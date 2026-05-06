import { describe, it, expect } from 'vitest';
import { calculateDuPont, compareDuPont } from '@/lib/tools/dupont-analyzer';
import { calculateAdvancedDSCR } from '@/lib/tools/dscr-advanced';
import { calculateBreakEven, calculateWhatIf } from '@/lib/tools/break-even-analyzer';
import { identifyRisks } from '@/lib/tools/risk-identifier';
import { analyzeCashFlowQuality } from '@/lib/tools/cash-flow-quality';
import { forecastMultiMethod } from '@/lib/tools/forecast-multi-method';
import { calculateSensitivity, calculateAllQuickScenarios } from '@/lib/tools/sensitivity-financial';
import { comparePeriods } from '@/lib/tools/period-comparison';

describe('DuPont Analyzer', () => {
  it('decomposes ROE into 3 factors', () => {
    const result = calculateDuPont({
      revenue: 1000,
      netProfit: 100,
      ebit: 150,
      ebt: 130,
      totalAssets: 800,
      totalEquity: 400,
    });
    // NPM = 0.10, AT = 1.25, EM = 2.0 → ROE = 0.25
    expect(result.threeFactor.netProfitMargin.value).toBeCloseTo(0.10, 2);
    expect(result.threeFactor.assetTurnover.value).toBeCloseTo(1.25, 2);
    expect(result.threeFactor.equityMultiplier.value).toBeCloseTo(2.0, 2);
    expect(result.threeFactor.roe).toBeCloseTo(0.25, 2);
    expect(result.directROE).toBeCloseTo(0.25, 2);
  });

  it('5-factor includes tax burden and interest burden', () => {
    const result = calculateDuPont({
      revenue: 1000,
      netProfit: 100,
      ebit: 150,
      ebt: 130,
      totalAssets: 800,
      totalEquity: 400,
    });
    // Tax burden = NI/EBT = 100/130 ≈ 0.77
    expect(result.fiveFactor.taxBurden.value).toBeCloseTo(0.77, 2);
    // Interest burden = EBT/EBIT = 130/150 ≈ 0.87
    expect(result.fiveFactor.interestBurden.value).toBeCloseTo(0.87, 2);
  });

  it('identifies primary driver correctly', () => {
    // High margin, average turnover, low leverage → profitability
    const profitDriven = calculateDuPont({
      revenue: 1000, netProfit: 200, ebit: 250, ebt: 220, totalAssets: 1000, totalEquity: 800,
    });
    expect(profitDriven.primaryDriver).toBe('profitability');

    // Low margin, high leverage → leverage
    const leverageDriven = calculateDuPont({
      revenue: 10000, netProfit: 100, ebit: 200, ebt: 150, totalAssets: 5000, totalEquity: 500,
    });
    expect(leverageDriven.primaryDriver).toBe('leverage');
  });
});

describe('Advanced DSCR', () => {
  it('calculates 5 methods', () => {
    const result = calculateAdvancedDSCR({
      ebitda: 100000,
      operatingCashFlow: 90000,
      netProfit: 50000,
      depreciation: 20000,
      interestExpense: 10000,
      principalPayment: 30000,
      capitalExpenditure: 15000,
      taxRate: 23,
    });
    // EBITDA / 40000 = 2.5
    expect(result.ebitda.value).toBeCloseTo(2.5, 1);
    // OCF / 40000 = 2.25
    expect(result.cashFlow.value).toBeCloseTo(2.25, 1);
    // FCF = 90 - 15 = 75 / 40 = 1.875
    expect(result.freeCashFlow.value).toBeCloseTo(1.875, 1);
  });

  it('approves with high DSCR', () => {
    const result = calculateAdvancedDSCR({
      ebitda: 1000000,
      operatingCashFlow: 900000,
      netProfit: 500000,
      depreciation: 100000,
      interestExpense: 50000,
      principalPayment: 100000,
      capitalExpenditure: 50000,
      taxRate: 23,
    });
    expect(result.bankAssessment.approval).toContain('מומלץ');
    expect(result.bankAssessment.maxLTV).toBeGreaterThanOrEqual(70);
  });

  it('rejects with DSCR < 1', () => {
    const result = calculateAdvancedDSCR({
      ebitda: 50000,
      operatingCashFlow: 30000,
      netProfit: 10000,
      depreciation: 20000,
      interestExpense: 30000,
      principalPayment: 50000,
      capitalExpenditure: 20000,
      taxRate: 23,
    });
    expect(result.bankAssessment.approval).toContain('לא');
    expect(result.bankAssessment.maxLTV).toBe(0);
  });
});

describe('Break-Even Analyzer', () => {
  it('calculates break-even revenue', () => {
    // Revenue 1000, Variable 600, Fixed 200 → CM = 0.4 → BE = 200/0.4 = 500
    const result = calculateBreakEven({
      revenue: 1000,
      variableCosts: 600,
      fixedCosts: 200,
    });
    expect(result.breakEvenRevenue).toBeCloseTo(500, 0);
    expect(result.contributionMarginRatio).toBeCloseTo(0.4, 2);
    expect(result.marginOfSafetyRatio).toBeCloseTo(0.5, 2);
    expect(result.isAboveBreakEven).toBe(true);
  });

  it('detects below break-even', () => {
    const result = calculateBreakEven({
      revenue: 400,
      variableCosts: 300,
      fixedCosts: 200,
    });
    expect(result.isAboveBreakEven).toBe(false);
    expect(result.shortfall).toBeGreaterThan(0);
    expect(result.marginOfSafetyInterpretation.status).toBe('critical');
  });

  it('what-if calculates required changes', () => {
    const result = calculateWhatIf({
      revenue: 1000,
      variableCosts: 600,
      fixedCosts: 300,
      targetProfit: 200,
    });
    // Current profit = 100, target = 200, gap = 100
    // Price increase = 100/1000 = 10%
    expect(result.priceIncrease).toBeCloseTo(10, 1);
  });
});

describe('Risk Identifier', () => {
  it('identifies critical risks', () => {
    const result = identifyRisks({
      ratios: {
        currentRatio: 0.5,
        quickRatio: 0.3,
        cashRatio: 0.1,
        grossProfitMargin: 5,
        operatingProfitMargin: -5,
        netProfitMargin: -10,
        returnOnAssets: -3,
        returnOnEquity: -8,
        debtToEquity: 5,
        debtToAssets: 0.85,
        interestCoverage: 0.5,
        assetTurnover: 0.3,
        inventoryTurnover: 1,
        receivablesTurnover: 2,
        dso: 120,
        dpo: 20,
        dio: 150,
        ccc: 250,
        dscr: 0.5,
      },
      zScore: { score: 1.0, zone: 'distress', bankruptcyProbability: '50%+', components: { workingCapitalToAssets: 0, retainedEarningsToAssets: 0, ebitToAssets: 0, equityToDebt: 0, salesToAssets: 0 } },
      hasLoss: true,
    });
    expect(result.summary.criticalCount).toBeGreaterThanOrEqual(2);
    expect(result.summary.overallRiskLevel).toBe('קריטי');
  });

  it('healthy company has low risk', () => {
    const result = identifyRisks({
      ratios: {
        currentRatio: 2.5, quickRatio: 1.8, cashRatio: 0.5,
        grossProfitMargin: 50, operatingProfitMargin: 25, netProfitMargin: 18,
        returnOnAssets: 12, returnOnEquity: 25,
        debtToEquity: 0.5, debtToAssets: 0.3, interestCoverage: 15,
        assetTurnover: 1.5, inventoryTurnover: 10, receivablesTurnover: 12,
        dso: 30, dpo: 45, dio: 30, ccc: 15,
        dscr: 3.0,
      },
      zScore: { score: 4.5, zone: 'safe', bankruptcyProbability: '<5%', components: { workingCapitalToAssets: 0, retainedEarningsToAssets: 0, ebitToAssets: 0, equityToDebt: 0, salesToAssets: 0 } },
      hasLoss: false,
    });
    expect(result.summary.criticalCount).toBe(0);
    expect(['נמוך', 'בינוני']).toContain(result.summary.overallRiskLevel);
  });
});

describe('Cash Flow Quality', () => {
  it('detects high quality earnings', () => {
    const result = analyzeCashFlowQuality(
      {
        revenue: 1000000,
        netProfit: 100000,
        ebit: 150000,
        ebitda: 200000,
        depreciation: 50000,
        amortization: 0,
        interestExpense: 20000,
        taxExpense: 30000,
        changeInReceivables: -10000, // gathered cash
        changeInInventory: -5000,
        changeInPayables: 8000,
        changeInOtherWC: 0,
        capex: 30000,
        assetSales: 0,
        debtIssuance: 0,
        debtRepayment: 20000,
        dividendsPaid: 0,
        equityIssuance: 0,
        openingCash: 50000,
      },
      1000000,
      200000,
    );
    expect(result.qualityMetrics.cashFlowToNetIncome).toBeGreaterThan(1);
    expect(['excellent', 'good']).toContain(result.qualityMetrics.earningsQuality);
  });

  it('flags negative OCF with positive NI', () => {
    const result = analyzeCashFlowQuality(
      {
        revenue: 1000000,
        netProfit: 100000,
        ebit: 150000,
        ebitda: 200000,
        depreciation: 50000,
        amortization: 0,
        interestExpense: 20000,
        taxExpense: 30000,
        changeInReceivables: 300000, // huge increase = OCF negative
        changeInInventory: 100000,
        changeInPayables: -50000,
        changeInOtherWC: 0,
        capex: 30000,
        assetSales: 0,
        debtIssuance: 0,
        debtRepayment: 20000,
        dividendsPaid: 0,
        equityIssuance: 0,
        openingCash: 50000,
      },
      1000000,
      200000,
    );
    expect(result.qualityMetrics.earningsQuality).toBe('red_flag');
    expect(result.warnings.length).toBeGreaterThan(0);
  });
});

describe('Multi-Method Forecast', () => {
  it('forecasts with positive trend', () => {
    const result = forecastMultiMethod([100, 110, 121, 133], 2020, 3, 'Revenue');
    expect(result.forecast.values).toHaveLength(3);
    expect(result.statistics.cagr).toBeGreaterThan(0);
    expect(result.statistics.trend).toBe('upward');
    // Last forecast > last historical
    expect(result.forecast.values[2]).toBeGreaterThan(133);
  });

  it('detects anomalies', () => {
    // Use 6 values with one extreme outlier to ensure z > 2
    const result = forecastMultiMethod([100, 105, 110, 5000, 108, 112], 2020, 2);
    expect(result.anomalies.length).toBeGreaterThan(0);
  });

  it('produces confidence intervals', () => {
    const result = forecastMultiMethod([100, 110, 120], 2020, 3);
    expect(result.confidenceIntervals.high.upper.length).toBe(3);
    expect(result.confidenceIntervals.high.lower.length).toBe(3);
    // Upper > lower
    for (let i = 0; i < 3; i++) {
      expect(result.confidenceIntervals.high.upper[i]).toBeGreaterThanOrEqual(
        result.confidenceIntervals.high.lower[i],
      );
    }
  });
});

describe('Financial Sensitivity', () => {
  it('finds break-even point', () => {
    const result = calculateSensitivity(
      {
        revenue: 1000000,
        cogs: 600000,
        opex: 250000,
        depreciation: 30000,
        interestExpense: 20000,
        taxExpense: 23000,
        principalPayment: 50000,
      },
      'revenue',
      30,
      9,
    );
    expect(result.results).toHaveLength(9);
    expect(result.baseDSCR).toBeGreaterThan(0);
  });

  it('quick scenarios identify recession risk', () => {
    const scenarios = calculateAllQuickScenarios({
      revenue: 1000000,
      cogs: 700000,
      opex: 200000,
      depreciation: 20000,
      interestExpense: 30000,
      taxExpense: 12000,
      principalPayment: 60000,
    });
    expect(scenarios).toHaveLength(4);
    const recession = scenarios.find((s) => s.name.includes('מיתון'));
    expect(recession).toBeDefined();
    // Recession should reduce metrics
    expect(recession!.changes_metrics.netProfitChange).toBeLessThan(0);
  });
});

describe('Period Comparison', () => {
  it('compares multiple periods', () => {
    const result = comparePeriods([
      { year: 2022, revenue: 1000, grossProfit: 400, operatingProfit: 200, netProfit: 100, ebitda: 250, totalAssets: 800, totalEquity: 400, totalLiabilities: 400, currentAssets: 300, currentLiabilities: 200 },
      { year: 2023, revenue: 1100, grossProfit: 450, operatingProfit: 240, netProfit: 130, ebitda: 290, totalAssets: 850, totalEquity: 450, totalLiabilities: 400, currentAssets: 320, currentLiabilities: 200 },
      { year: 2024, revenue: 1300, grossProfit: 540, operatingProfit: 290, netProfit: 170, ebitda: 340, totalAssets: 950, totalEquity: 530, totalLiabilities: 420, currentAssets: 400, currentLiabilities: 220 },
    ]);
    expect(result.periods).toEqual([2022, 2023, 2024]);
    expect(result.metrics.revenue.cagr).toBeGreaterThan(0);
    expect(result.summary.overallTrend).toBe('positive');
  });

  it('throws with single period', () => {
    expect(() =>
      comparePeriods([
        { year: 2024, revenue: 1000, grossProfit: 400, operatingProfit: 200, netProfit: 100, ebitda: 250, totalAssets: 800, totalEquity: 400, totalLiabilities: 400, currentAssets: 300, currentLiabilities: 200 },
      ]),
    ).toThrow();
  });
});
