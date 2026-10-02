import { describe, it, expect } from 'vitest';
import {
  calculateSoloCashFlow,
  expandAllItems,
  expandRecurringItem,
  getCategoryBreakdown,
  createSampleSoloData,
} from '@/lib/tools/solo-cashflow-engine';
import {
  generateBudgetFromWizard,
  annualGrowthToMonthlyPct,
  summarizeWizard,
  createDefaultAnswers,
  suggestDefaults,
} from '@/lib/tools/budget-wizard-engine';

describe('Solo Cash Flow Engine', () => {
  describe('expandRecurringItem', () => {
    it('returns one item for once', () => {
      const items = expandRecurringItem(
        {
          id: '1',
          date: '2026-01-15',
          type: 'in',
          amount: 100,
          category: 'sales',
          description: 'X',
          recurring: 'once',
        },
        '2026-01-01',
        '2026-12-31',
      );
      expect(items).toHaveLength(1);
    });

    it('expands monthly to 12 occurrences in a year', () => {
      const items = expandRecurringItem(
        {
          id: '1',
          date: '2026-01-15',
          type: 'in',
          amount: 100,
          category: 'sales',
          description: 'X',
          recurring: 'monthly',
        },
        '2026-01-01',
        '2026-12-31',
      );
      expect(items).toHaveLength(12);
    });

    it('preserves month-end recurrence without drifting into later months', () => {
      const items = expandRecurringItem(
        {
          id: 'month-end',
          date: '2026-01-31',
          type: 'in',
          amount: 100,
          category: 'sales',
          description: 'Month end',
          recurring: 'monthly',
        },
        '2026-01-01',
        '2026-04-30',
      );
      expect(items.map((item) => item.date)).toEqual([
        '2026-01-31',
        '2026-02-28',
        '2026-03-31',
        '2026-04-30',
      ]);
    });

    it('keeps a 12-month projection to exactly 12 monthly occurrences', () => {
      const data = createSampleSoloData();
      data.startDate = '2026-01-01';
      data.monthsToProject = 12;
      data.items = [
        {
          id: 'monthly',
          date: '2026-01-01',
          type: 'in',
          amount: 100,
          category: 'sales',
          description: 'Monthly',
          recurring: 'monthly',
        },
      ];
      expect(expandAllItems(data)).toHaveLength(12);
    });

    it('expands quarterly to 4 occurrences in a year', () => {
      const items = expandRecurringItem(
        {
          id: '1',
          date: '2026-01-15',
          type: 'out',
          amount: 200,
          category: 'tax',
          description: 'X',
          recurring: 'quarterly',
        },
        '2026-01-01',
        '2026-12-31',
      );
      expect(items).toHaveLength(4);
    });

    it('respects recurringEnd', () => {
      const items = expandRecurringItem(
        {
          id: '1',
          date: '2026-01-15',
          type: 'in',
          amount: 100,
          category: 'sales',
          description: 'X',
          recurring: 'monthly',
          recurringEnd: '2026-06-15',
        },
        '2026-01-01',
        '2026-12-31',
      );
      expect(items.length).toBeLessThanOrEqual(6);
    });
  });

  describe('calculateSoloCashFlow', () => {
    it('produces monthly results', () => {
      const data = createSampleSoloData();
      const monthly = calculateSoloCashFlow(data);
      expect(monthly).toHaveLength(data.monthsToProject);
    });

    it('opening balance comes from accounts', () => {
      const data = createSampleSoloData();
      const monthly = calculateSoloCashFlow(data);
      expect(monthly[0].openingBalance).toBe(data.accounts[0].balance);
    });

    it('tracks running balance correctly', () => {
      const data = createSampleSoloData();
      const monthly = calculateSoloCashFlow(data);
      // Each month's opening should equal previous month's closing
      for (let i = 1; i < monthly.length; i++) {
        expect(monthly[i].openingBalance).toBeCloseTo(monthly[i - 1].closingBalance, 2);
      }
    });
  });

  describe('getCategoryBreakdown', () => {
    it('groups items by category', () => {
      const data = createSampleSoloData();
      const breakdown = getCategoryBreakdown(data, 'out');
      expect(breakdown.length).toBeGreaterThan(0);
      // Should sum to ~100%
      const totalPct = breakdown.reduce((s, b) => s + b.pctOfTotal, 0);
      expect(totalPct).toBeCloseTo(100, 0);
    });
  });
});

describe('Budget Wizard Engine', () => {
  describe('generateBudgetFromWizard', () => {
    it('produces complete budget', () => {
      const answers = createDefaultAnswers();
      const budget = generateBudgetFromWizard(answers);
      expect(budget.income.length).toBeGreaterThan(0);
      expect(budget.expenses.length).toBeGreaterThan(0);
      expect(budget.employees.length).toBeGreaterThan(0);
    });

    it('income amounts sum to monthly revenue', () => {
      const answers = createDefaultAnswers();
      answers.numIncomeStreams = 3;
      answers.monthlyRevenue = 100000;
      const budget = generateBudgetFromWizard(answers);
      const totalIncome = budget.income.reduce((s, i) => s + i.amount, 0);
      expect(totalIncome).toBeCloseTo(100000, 0);
    });

    it('employees sum to total salary', () => {
      const answers = createDefaultAnswers();
      answers.numEmployees = 5;
      answers.totalMonthlySalary = 50000;
      const budget = generateBudgetFromWizard(answers);
      const totalSalary = budget.employees.reduce((s, e) => s + e.monthlySalary, 0);
      expect(totalSalary).toBeCloseTo(50000, -2); // ±100 for rounding
    });

    it('creates loan when hasLoans=true', () => {
      const answers = createDefaultAnswers();
      answers.hasLoans = true;
      answers.loanAmount = 200000;
      const budget = generateBudgetFromWizard(answers);
      expect(budget.loans).toHaveLength(1);
      expect(budget.loans[0].amount).toBe(200000);
    });

    it('no loan when hasLoans=false', () => {
      const answers = createDefaultAnswers();
      answers.hasLoans = false;
      const budget = generateBudgetFromWizard(answers);
      expect(budget.loans).toHaveLength(0);
    });
  });

  describe('summarizeWizard', () => {
    it('calculates annual revenue correctly', () => {
      const answers = createDefaultAnswers();
      answers.monthlyRevenue = 50000;
      answers.expectedGrowthPct = 0;
      const summary = summarizeWizard(answers);
      expect(summary.totalAnnualRevenue).toBe(600000);
    });

    it('uses detailed entries in the review summary', () => {
      const answers = createDefaultAnswers();
      answers.incomeMode = 'detailed';
      answers.incomeStreams = [
        { name: 'A', monthlyAmount: 1000, paymentTermsDays: 0, growthPctMonthly: 0 },
        { name: 'B', monthlyAmount: 2000, paymentTermsDays: 0, growthPctMonthly: 0 },
      ];
      answers.employeesMode = 'detailed';
      answers.employees = [
        {
          name: 'Employee',
          position: 'Role',
          department: 'administration',
          monthlySalary: 500,
        },
      ];
      const summary = summarizeWizard(answers);
      expect(summary.totalAnnualRevenue).toBe(36000);
      expect(summary.totalAnnualSalaries).toBe(6000);
    });

    it('converts annual growth to the equivalent compounded monthly rate', () => {
      const monthly = annualGrowthToMonthlyPct(12);
      expect(monthly).toBeCloseTo(0.948879, 5);
      expect(Math.pow(1 + monthly / 100, 12) - 1).toBeCloseTo(0.12, 10);
    });

    it('flags low margin', () => {
      const answers = createDefaultAnswers();
      answers.cogsPct = 95; // very high COGS
      answers.industry = 'technology'; // expects high gross margin
      const summary = summarizeWizard(answers);
      expect(summary.warnings.length).toBeGreaterThan(0);
    });
  });

  describe('suggestDefaults', () => {
    it('returns industry-specific defaults', () => {
      const tech = suggestDefaults('technology');
      const retail = suggestDefaults('retail');
      // Tech should have higher gross margin (lower cogs)
      expect(tech.cogsPct).toBeLessThan(retail.cogsPct ?? 0);
    });
  });
});
