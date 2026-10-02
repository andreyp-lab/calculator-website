import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { getLoanDebtServiceForPeriod } from '@/lib/tools/budget-engine';
import { analyzeCashFlowQuality } from '@/lib/tools/cash-flow-quality';
import { getCashInForMonth, getCashOutForMonth } from '@/lib/tools/cashflow-engine';
import { calculateRatios, type RatioInputData } from '@/lib/tools/financial-analyzer';
import { calculateWorkingCapitalScenario } from '@/lib/tools/working-capital';
import type { BudgetData, CashFlowExpense } from '@/lib/tools/types';

const emptyBudget: BudgetData = { income: [], expenses: [], loans: [], employees: [] };

describe('calculator audit regressions', () => {
  it('posts a loan receipt in its configured start month', () => {
    const budget: BudgetData = {
      ...emptyBudget,
      loans: [
        { id: 'loan', name: 'Loan', amount: 12000, termMonths: 6, annualRate: 0, startMonth: 0 },
      ],
    };
    expect(getCashInForMonth(budget, 0, [])).toBe(12000);
    expect(getCashInForMonth(budget, 1, [])).toBe(0);
  });

  it('includes custom expenses with payment terms and recurrence', () => {
    const expense: CashFlowExpense = {
      id: 'expense',
      category: 'supplier',
      name: 'Supplier',
      amount: 500,
      date: '2026-01-15',
      paymentTerms: 30,
      status: 'approved',
      frequency: 'monthly',
    };
    expect(getCashOutForMonth(emptyBudget, [expense], 0, [], '2026-01')).toBe(0);
    expect(getCashOutForMonth(emptyBudget, [expense], 1, [], '2026-01')).toBe(500);
    expect(getCashOutForMonth(emptyBudget, [expense], 2, [], '2026-01')).toBe(500);
  });

  it('does not annualize a six-payment loan into twelve payments', () => {
    const service = getLoanDebtServiceForPeriod([
      { id: 'short', name: 'Short', amount: 12000, termMonths: 6, annualRate: 0, startMonth: 0 },
    ]);
    expect(service.principal).toBeCloseTo(12000, 8);
    expect(service.interest).toBe(0);
    expect(service.total).toBeCloseTo(12000, 8);
  });

  it('treats liabilities over non-positive equity as unbounded leverage', () => {
    const input: RatioInputData = {
      revenue: 1000,
      cogs: 500,
      grossProfit: 500,
      operatingExpenses: 200,
      operatingProfit: 300,
      ebitda: 300,
      netProfit: 200,
      interestExpense: 10,
      annualDebtPayment: 100,
      balance: {
        cashAndEquivalents: 50,
        accountsReceivable: 100,
        inventory: 50,
        currentAssets: 200,
        fixedAssets: 600,
        totalAssets: 800,
        accountsPayable: 100,
        shortTermDebt: 200,
        currentLiabilities: 300,
        longTermDebt: 700,
        totalLiabilities: 1000,
        totalEquity: -200,
        retainedEarnings: -300,
      },
    };
    expect(calculateRatios(input).debtToEquity).toBe(Number.POSITIVE_INFINITY);
  });

  it('subtracts an increase in receivables once when calculating FCFF', () => {
    const result = analyzeCashFlowQuality(
      {
        revenue: 5000,
        netProfit: 770,
        ebit: 1000,
        ebitda: 1000,
        depreciation: 0,
        amortization: 0,
        interestExpense: 0,
        taxExpense: 230,
        changeInReceivables: 100,
        changeInInventory: 0,
        changeInPayables: 0,
        changeInOtherWC: 0,
        capex: 0,
        assetSales: 0,
        debtIssuance: 0,
        debtRepayment: 0,
        dividendsPaid: 0,
        equityIssuance: 0,
        openingCash: 0,
      },
      5000,
      0,
    );
    expect(result.freeCashFlow.fcff).toBeCloseTo(670, 8);
  });

  it('calculates working capital only from the selected scenario', () => {
    const scenario = calculateWorkingCapitalScenario(365000, 182500, 45, 30, 30);
    expect(scenario.netWorkingCapital).toBeCloseTo(45000, 8);
    expect(scenario.ccc).toBe(45);
  });

  it('keeps unsupported public outputs disabled and labels user-selected costs/scenarios', () => {
    const source = (path: string) => readFileSync(join(process.cwd(), path), 'utf8');
    expect(source('components/tools/BankCreditAdvice.tsx')).toContain('אינה מחושבת');
    expect(source('components/tools/AdvancedDSCRDisplay.tsx')).toContain('אינו מחושב');
    expect(source('components/tools/CashFlowQualityDisplay.tsx')).toContain('אינה מחושבת');
    expect(source('components/tools/UnifiedKPIBar.tsx')).not.toContain('calculateCreditRating');
    expect(source('components/tools/UnifiedOverview.tsx')).not.toContain('calculateCreditRating');
    expect(source('components/tools/RatiosDisplay.tsx')).not.toContain('calculateCreditRating');
    expect(source('components/tools/EmployeeAnalysis.tsx')).not.toContain('REVENUE_ATTRIBUTION');
    expect(source('components/tools/EmployeeManager.tsx')).toContain('עלות מעסיק חודשית כוללת');
    expect(source('components/tools/WorkingCapitalOptimizer.tsx')).toContain('תרחיש בסיס לבחירתכם');
    expect(source('components/tools/WorkingCapitalOptimizer.tsx')).not.toContain('מצב נוכחי');
  });
});
