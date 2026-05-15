import { describe, it, expect } from 'vitest';
import {
  calculateCompoundInterest,
  calculateROI,
  calculateRetirement,
  calculateRequiredMonthlyContribution,
  compareScenarios,
  INVESTMENT_CONSTANTS_2026,
} from '@/lib/calculators/investments';

// ============================================================
// EXISTING TESTS — must keep passing
// ============================================================

describe('calculateCompoundInterest', () => {
  it('100,000 ב-7% במשך 10 שנים, ללא הפקדות', () => {
    const result = calculateCompoundInterest({
      principal: 100_000,
      annualRate: 7,
      years: 10,
      frequency: 'yearly',
      monthlyContribution: 0,
    });
    // 100,000 × 1.07^10 = 196,715
    expect(result.finalAmount).toBeCloseTo(196_715, -2);
    expect(result.totalInterest).toBeCloseTo(96_715, -2);
  });

  it('עם הפקדות חודשיות', () => {
    const result = calculateCompoundInterest({
      principal: 0,
      annualRate: 5,
      years: 10,
      frequency: 'monthly',
      monthlyContribution: 1000,
    });
    // 120 הפקדות של 1000 בריבית 5% = ~155,300
    expect(result.totalContributions).toBe(120_000);
    expect(result.finalAmount).toBeGreaterThan(150_000);
    expect(result.finalAmount).toBeLessThan(160_000);
  });

  it('ריבית 0 - הסכום שווה לקרן + הפקדות', () => {
    const result = calculateCompoundInterest({
      principal: 10_000,
      annualRate: 0,
      years: 5,
      frequency: 'yearly',
      monthlyContribution: 100,
    });
    // 10,000 + 100*60 = 16,000
    expect(result.finalAmount).toBeCloseTo(16_000, 0);
    expect(result.totalInterest).toBeCloseTo(0, 0);
  });

  // ============================================================
  // NEW TESTS — inflation, tax, crossover, goal-seek, scenarios
  // ============================================================

  it('ערך ריאלי < ערך נומינלי כשיש אינפלציה', () => {
    const result = calculateCompoundInterest({
      principal: 100_000,
      annualRate: 7,
      years: 30,
      frequency: 'monthly',
      monthlyContribution: 0,
      inflationRate: 3,
      applyTax: false,
    });
    expect(result.realFinalAmount).toBeLessThan(result.finalAmount);
    // ערך ריאלי = FV / (1.03^30) ≈ FV / 2.427
    const expectedReal = result.finalAmount / Math.pow(1.03, 30);
    expect(result.realFinalAmount).toBeCloseTo(expectedReal, -2);
  });

  it('ערך ריאלי = ערך נומינלי כשאינפלציה = 0', () => {
    const result = calculateCompoundInterest({
      principal: 100_000,
      annualRate: 7,
      years: 20,
      frequency: 'monthly',
      monthlyContribution: 0,
      inflationRate: 0,
      applyTax: false,
    });
    expect(result.realFinalAmount).toBeCloseTo(result.finalAmount, 0);
  });

  it('מס 25% מחושב רק על הרווח', () => {
    const result = calculateCompoundInterest({
      principal: 100_000,
      annualRate: 7,
      years: 10,
      frequency: 'monthly',
      monthlyContribution: 0,
      inflationRate: 0,
      applyTax: true,
    });
    // רווח = finalAmount - 100,000; מס = רווח × 25%
    const expectedTax = (result.finalAmount - 100_000) * 0.25;
    expect(result.taxAmount).toBeCloseTo(expectedTax, 0);
    expect(result.afterTaxFinalAmount).toBeCloseTo(result.finalAmount - expectedTax, 0);
  });

  it('ללא מס — afterTaxFinalAmount = finalAmount', () => {
    const result = calculateCompoundInterest({
      principal: 50_000,
      annualRate: 7,
      years: 20,
      frequency: 'monthly',
      monthlyContribution: 1_000,
      inflationRate: 3,
      applyTax: false,
    });
    expect(result.taxAmount).toBe(0);
    expect(result.afterTaxFinalAmount).toBeCloseTo(result.finalAmount, 0);
  });

  it('אחרי מס < לפני מס', () => {
    const result = calculateCompoundInterest({
      principal: 100_000,
      annualRate: 7,
      years: 20,
      frequency: 'monthly',
      monthlyContribution: 1_000,
      inflationRate: 3,
      applyTax: true,
    });
    expect(result.afterTaxFinalAmount).toBeLessThan(result.finalAmount);
    expect(result.taxAmount).toBeGreaterThan(0);
  });

  it('yearlyBreakdown מכיל כל שנה', () => {
    const result = calculateCompoundInterest({
      principal: 10_000,
      annualRate: 5,
      years: 15,
      frequency: 'monthly',
      monthlyContribution: 500,
    });
    expect(result.yearlyBreakdown).toHaveLength(15);
    expect(result.yearlyBreakdown[0].year).toBe(1);
    expect(result.yearlyBreakdown[14].year).toBe(15);
  });

  it('cumulativeContributions בשנה האחרונה = totalContributions', () => {
    const result = calculateCompoundInterest({
      principal: 10_000,
      annualRate: 5,
      years: 10,
      frequency: 'monthly',
      monthlyContribution: 500,
    });
    const lastRow = result.yearlyBreakdown[result.yearlyBreakdown.length - 1];
    expect(lastRow.cumulativeContributions).toBeCloseTo(result.totalContributions, 0);
  });

  it('crossoverYear: עם הפקדות קיים — בלי הפקדות null', () => {
    // ללא הפקדות — אין crossover
    const noContrib = calculateCompoundInterest({
      principal: 100_000,
      annualRate: 7,
      years: 20,
      frequency: 'monthly',
      monthlyContribution: 0,
    });
    expect(noContrib.crossoverYear).toBeNull();

    // עם הפקדות קטנות יחסית לריבית על קרן גדולה — יש crossover מוקדם
    const withContrib = calculateCompoundInterest({
      principal: 100_000,
      annualRate: 7,
      years: 30,
      frequency: 'monthly',
      monthlyContribution: 500,
    });
    expect(withContrib.crossoverYear).not.toBeNull();
    if (withContrib.crossoverYear) {
      expect(withContrib.crossoverYear).toBeGreaterThan(0);
      expect(withContrib.crossoverYear).toBeLessThanOrEqual(30);
    }
  });

  it('ערכים שליליים מחזיר אפסים', () => {
    const result = calculateCompoundInterest({
      principal: -1000,
      annualRate: 7,
      years: 10,
      frequency: 'monthly',
      monthlyContribution: 0,
    });
    expect(result.finalAmount).toBe(0);
    expect(result.yearlyBreakdown).toHaveLength(0);
  });

  it('קרן 0 + הפקדות — גדל רק מהפקדות', () => {
    const result = calculateCompoundInterest({
      principal: 0,
      annualRate: 0,
      years: 5,
      frequency: 'monthly',
      monthlyContribution: 1_000,
      inflationRate: 0,
      applyTax: false,
    });
    // 1000 × 12 × 5 = 60,000
    expect(result.finalAmount).toBeCloseTo(60_000, 0);
    expect(result.totalInterest).toBeCloseTo(0, 0);
  });
});

// ============================================================
// GOAL SEEKING TESTS
// ============================================================

describe('calculateRequiredMonthlyContribution', () => {
  it('חישוב בסיסי — בלי קרן, 30 שנה, 7%', () => {
    const result = calculateRequiredMonthlyContribution({
      goalAmount: 1_000_000,
      principal: 0,
      annualRate: 7,
      years: 30,
    });
    // PMT לוקח זמן — נוודא שהוא הגיוני
    expect(result.requiredMonthlyContribution).toBeGreaterThan(500);
    expect(result.requiredMonthlyContribution).toBeLessThan(2000);

    // בדיקה: הפקדות × תקופה + ריבית ≈ יעד
    const check = calculateCompoundInterest({
      principal: 0,
      annualRate: 7,
      years: 30,
      frequency: 'monthly',
      monthlyContribution: result.requiredMonthlyContribution,
      inflationRate: 0,
      applyTax: false,
    });
    expect(check.finalAmount).toBeCloseTo(1_000_000, -3); // תוך 1K
  });

  it('קרן קיימת מפחיתה את ההפקדה הנדרשת', () => {
    const withoutPrincipal = calculateRequiredMonthlyContribution({
      goalAmount: 500_000,
      principal: 0,
      annualRate: 7,
      years: 20,
    });
    const withPrincipal = calculateRequiredMonthlyContribution({
      goalAmount: 500_000,
      principal: 100_000,
      annualRate: 7,
      years: 20,
    });
    expect(withPrincipal.requiredMonthlyContribution).toBeLessThan(
      withoutPrincipal.requiredMonthlyContribution,
    );
  });

  it('יעד ריאלי גבוה יותר מנומינלי — הפקדה גבוהה יותר', () => {
    const nominalGoal = calculateRequiredMonthlyContribution({
      goalAmount: 1_000_000,
      principal: 0,
      annualRate: 7,
      years: 30,
      inflationRate: 3,
      targetIsReal: false,
    });
    const realGoal = calculateRequiredMonthlyContribution({
      goalAmount: 1_000_000,
      principal: 0,
      annualRate: 7,
      years: 30,
      inflationRate: 3,
      targetIsReal: true,
    });
    expect(realGoal.requiredMonthlyContribution).toBeGreaterThan(
      nominalGoal.requiredMonthlyContribution,
    );
  });

  it('ריבית 0 — הפקדה = יעד / חודשים', () => {
    const result = calculateRequiredMonthlyContribution({
      goalAmount: 120_000,
      principal: 0,
      annualRate: 0,
      years: 10,
    });
    // 120,000 / 120 חודשים = 1,000
    expect(result.requiredMonthlyContribution).toBeCloseTo(1_000, 0);
  });

  it('אם הקרן גדולה מהיעד — הפקדה = 0', () => {
    const result = calculateRequiredMonthlyContribution({
      goalAmount: 100_000,
      principal: 200_000,
      annualRate: 7,
      years: 10,
    });
    expect(result.requiredMonthlyContribution).toBe(0);
  });
});

// ============================================================
// SCENARIO COMPARISON TESTS
// ============================================================

describe('compareScenarios', () => {
  const baseInput = {
    principal: 50_000,
    monthlyContribution: 1_000,
    years: 20,
    inflationRate: 3,
    applyTax: true,
    scenarios: [
      { label: 'פיקדון', annualRate: 3.5, color: '#6b7280' },
      { label: 'מגוון', annualRate: 7, color: '#3b82f6' },
      { label: 'S&P 500', annualRate: 10, color: '#10b981' },
    ],
  };

  it('מחזיר תוצאה לכל תרחיש', () => {
    const results = compareScenarios(baseInput);
    expect(results).toHaveLength(3);
    expect(results[0].label).toBe('פיקדון');
    expect(results[1].label).toBe('מגוון');
    expect(results[2].label).toBe('S&P 500');
  });

  it('ריבית גבוהה יותר = סכום סופי גבוה יותר', () => {
    const results = compareScenarios(baseInput);
    expect(results[0].finalAmount).toBeLessThan(results[1].finalAmount);
    expect(results[1].finalAmount).toBeLessThan(results[2].finalAmount);
  });

  it('ערך ריאלי < נומינלי בכל תרחיש', () => {
    const results = compareScenarios(baseInput);
    results.forEach((r) => {
      expect(r.realFinalAmount).toBeLessThan(r.finalAmount);
    });
  });

  it('אחרי מס < לפני מס בכל תרחיש', () => {
    const results = compareScenarios(baseInput);
    results.forEach((r) => {
      expect(r.afterTaxFinalAmount).toBeLessThan(r.finalAmount);
    });
  });

  it('yearlyData אורכו = שנים', () => {
    const results = compareScenarios(baseInput);
    results.forEach((r) => {
      expect(r.yearlyData).toHaveLength(20);
    });
  });

  it('INVESTMENT_CONSTANTS_2026 — קבועים נכונים', () => {
    expect(INVESTMENT_CONSTANTS_2026.CAPITAL_GAINS_TAX_RATE).toBe(0.25);
    expect(INVESTMENT_CONSTANTS_2026.DEFAULT_INFLATION_RATE).toBe(3.0);
    expect(INVESTMENT_CONSTANTS_2026.TYPICAL_RETURNS.sp500).toBe(10.0);
  });
});

// ============================================================
// EXISTING TESTS (ROI + Retirement) — must keep passing
// ============================================================

describe('calculateROI', () => {
  it('100K → 150K ב-3 שנים', () => {
    const result = calculateROI({
      initialInvestment: 100_000,
      finalValue: 150_000,
      years: 3,
      additionalCosts: 0,
      additionalIncome: 0,
    });
    expect(result.netProfit).toBe(50_000);
    expect(result.roi).toBe(50);
    // (1.5)^(1/3) - 1 = 14.47%
    expect(result.annualizedROI).toBeCloseTo(14.47, 1);
    expect(result.isPositive).toBe(true);
  });

  it('השקעה הפסידה', () => {
    const result = calculateROI({
      initialInvestment: 10_000,
      finalValue: 8_000,
      years: 1,
      additionalCosts: 0,
      additionalIncome: 0,
    });
    expect(result.netProfit).toBe(-2_000);
    expect(result.roi).toBe(-20);
    expect(result.isPositive).toBe(false);
  });

  it('עם דיבידנדים והוצאות', () => {
    const result = calculateROI({
      initialInvestment: 10_000,
      finalValue: 12_000,
      years: 1,
      additionalCosts: 500, // עמלות
      additionalIncome: 800, // דיבידנדים
    });
    // (12,000 + 800) - (10,000 + 500) = 2,300 רווח
    expect(result.netProfit).toBeCloseTo(2_300, 0);
  });
});

describe('calculateRetirement', () => {
  it('בן 35 רוצה לפרוש ב-67', () => {
    const result = calculateRetirement({
      currentAge: 35,
      retirementAge: 67,
      currentSavings: 100_000,
      monthlyContribution: 2_000,
      expectedReturn: 6,
      desiredMonthlyIncome: 12_000,
      yearsInRetirement: 20,
      inflationRate: 2.5,
    });
    expect(result.yearsUntilRetirement).toBe(32);
    expect(result.projectedSavings).toBeGreaterThan(100_000);
    expect(result.requiredSavings).toBeGreaterThan(0);
  });

  it('כבר בגיל פרישה - בלי שנים נוספות', () => {
    const result = calculateRetirement({
      currentAge: 67,
      retirementAge: 67,
      currentSavings: 1_000_000,
      monthlyContribution: 0,
      expectedReturn: 6,
      desiredMonthlyIncome: 8_000,
      yearsInRetirement: 20,
      inflationRate: 2.5,
    });
    expect(result.yearsUntilRetirement).toBe(0);
    expect(result.projectedSavings).toBe(1_000_000);
  });
});
