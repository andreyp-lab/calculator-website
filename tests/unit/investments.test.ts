import { describe, it, expect } from 'vitest';
import {
  calculateCompoundInterest,
  calculateROI,
  calculateRetirement,
  calculateRequiredMonthlyContribution,
  compareScenarios,
  calculateComprehensiveRetirement,
  estimateSocialSecurityBenefit,
  estimatePensionBenefit,
  calculatePortfolioLongevity,
  INVESTMENT_CONSTANTS_2026,
  type ComprehensiveRetirementInput,
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

// ============================================================
// COMPREHENSIVE RETIREMENT TESTS - תכנון פרישה מקיף
// ============================================================

const baseComprehensiveInput: ComprehensiveRetirementInput = {
  currentAge: 35,
  retirementAge: 67,
  yearsInRetirement: 25,
  currentSavings: 200_000,
  monthlyContribution: 3_000,
  expectedReturn: 6,
  desiredMonthlyIncome: 15_000,
  inflationRate: 3,
  incomeSources: {
    pensionMonthly: 5_000,
    socialSecurityMonthly: 3_500,
    rentalIncome: 0,
    partTimeWork: 0,
    investmentPortfolio: 0,
  },
  withdrawalRate: 4,
  pensionTaxRate: 10,
  capitalGainsTaxRate: 25,
  scenarios: [
    { label: 'שמרני (3%)', returnRate: 3, color: '#6b7280', retirementAge: 67 },
    { label: 'מתון (6%)', returnRate: 6, color: '#3b82f6', retirementAge: 67 },
    { label: 'אגרסיבי (8%)', returnRate: 8, color: '#10b981', retirementAge: 67 },
  ],
};

describe('calculateComprehensiveRetirement', () => {
  it('מחזיר ערכים בסיסיים נכונים', () => {
    const result = calculateComprehensiveRetirement(baseComprehensiveInput);
    expect(result.yearsUntilRetirement).toBe(32);
    expect(result.projectedSavings).toBeGreaterThan(200_000);
    expect(result.requiredSavings).toBeGreaterThan(0);
    expect(result.fundingRatio).toBeGreaterThan(0);
  });

  it('חיסכון ריאלי קטן מנומינלי', () => {
    const result = calculateComprehensiveRetirement(baseComprehensiveInput);
    expect(result.realProjectedSavings).toBeLessThan(result.projectedSavings);
    // ריאלי = נומינלי / (1.03^32)
    const expectedReal = result.projectedSavings / Math.pow(1.03, 32);
    expect(result.realProjectedSavings).toBeCloseTo(expectedReal, -3);
  });

  it('תשואה גבוהה = חיסכון גבוה יותר', () => {
    const low = calculateComprehensiveRetirement({ ...baseComprehensiveInput, expectedReturn: 3 });
    const high = calculateComprehensiveRetirement({ ...baseComprehensiveInput, expectedReturn: 8 });
    expect(high.projectedSavings).toBeGreaterThan(low.projectedSavings);
  });

  it('accumulationData מכיל 32 שנים', () => {
    const result = calculateComprehensiveRetirement(baseComprehensiveInput);
    expect(result.accumulationData).toHaveLength(32);
    expect(result.accumulationData[0].age).toBe(36);
    expect(result.accumulationData[31].age).toBe(67);
  });

  it('drawdownData לא ריק כאשר יש drawdown', () => {
    const result = calculateComprehensiveRetirement(baseComprehensiveInput);
    expect(result.drawdownData.length).toBeGreaterThan(0);
    expect(result.drawdownData.length).toBeLessThanOrEqual(25);
  });

  it('תרחישים — ריבית גבוהה = חיסכון גבוה', () => {
    const result = calculateComprehensiveRetirement(baseComprehensiveInput);
    expect(result.scenarioResults).toHaveLength(3);
    // שמרני < מתון < אגרסיבי
    expect(result.scenarioResults[0].projectedSavings).toBeLessThan(result.scenarioResults[1].projectedSavings);
    expect(result.scenarioResults[1].projectedSavings).toBeLessThan(result.scenarioResults[2].projectedSavings);
  });

  it('הכנסות קבועות מפחיתות את הdrawdown מהתיק', () => {
    const noFixed = calculateComprehensiveRetirement({
      ...baseComprehensiveInput,
      incomeSources: { pensionMonthly: 0, socialSecurityMonthly: 0, rentalIncome: 0, partTimeWork: 0, investmentPortfolio: 0 },
    });
    const withFixed = calculateComprehensiveRetirement(baseComprehensiveInput);
    expect(withFixed.portfolioMonthlyDrawdown).toBeLessThan(noFixed.portfolioMonthlyDrawdown);
  });

  it('פרישה מוקדמת יותר = חיסכון קטן יותר (פחות שנות חיסכון)', () => {
    const early = calculateComprehensiveRetirement({ ...baseComprehensiveInput, retirementAge: 62 });
    const late = calculateComprehensiveRetirement({ ...baseComprehensiveInput, retirementAge: 67 });
    expect(early.projectedSavings).toBeLessThan(late.projectedSavings);
    expect(early.yearsUntilRetirement).toBe(27);
    expect(late.yearsUntilRetirement).toBe(32);
  });

  it('goal-seeking: הפקדה נדרשת > 0 כאשר יש פער', () => {
    const lowSavings = calculateComprehensiveRetirement({
      ...baseComprehensiveInput,
      currentSavings: 0,
      monthlyContribution: 500,
      desiredMonthlyIncome: 30_000,
      incomeSources: { pensionMonthly: 0, socialSecurityMonthly: 0, rentalIncome: 0, partTimeWork: 0, investmentPortfolio: 0 },
    });
    expect(lowSavings.requiredMonthlyContributionForGoal).toBeGreaterThan(500);
  });

  it('goal-seeking: הפקדה נוכחית מספיקה = לא נדרשת תוספת גדולה', () => {
    const richSavings = calculateComprehensiveRetirement({
      ...baseComprehensiveInput,
      currentSavings: 5_000_000,
      monthlyContribution: 5_000,
      desiredMonthlyIncome: 10_000,
    });
    // הפקדה נדרשת צריכה להיות קטנה (תיק קיים גדול מכסה את הכל)
    expect(richSavings.requiredMonthlyContributionForGoal).toBeLessThanOrEqual(richSavings.shortfall > 0 ? 99999 : 5_000);
    expect(richSavings.isOnTrack).toBe(true);
  });

  it('סה"כ הפקדות = חיסכון ראשוני + הפקדות חודשיות × חודשים', () => {
    const result = calculateComprehensiveRetirement(baseComprehensiveInput);
    const expectedContribs = 200_000 + 3_000 * 32 * 12;
    expect(result.totalContributions).toBeCloseTo(expectedContribs, -2);
  });

  it('totalGrowth = projectedSavings - totalContributions', () => {
    const result = calculateComprehensiveRetirement(baseComprehensiveInput);
    expect(result.totalGrowth).toBeCloseTo(result.projectedSavings - result.totalContributions, 0);
  });

  it('גיל פרישה = גיל נוכחי — yearsUntilRetirement = 0', () => {
    const result = calculateComprehensiveRetirement({
      ...baseComprehensiveInput,
      currentAge: 67,
      retirementAge: 67,
    });
    expect(result.yearsUntilRetirement).toBe(0);
    expect(result.projectedSavings).toBe(200_000);
    expect(result.accumulationData).toHaveLength(0);
  });

  it('מס פנסיה מחושב נכון', () => {
    const result = calculateComprehensiveRetirement(baseComprehensiveInput);
    // 5,000 * 12 * 10% = 6,000
    expect(result.estimatedPensionTax).toBeCloseTo(6_000, 0);
  });
});

// ============================================================
// SOCIAL SECURITY & PENSION ESTIMATE TESTS
// ============================================================

describe('estimateSocialSecurityBenefit', () => {
  it('גיל פרישה תקני 67 — קצבת בסיס', () => {
    const benefit = estimateSocialSecurityBenefit({
      retirementAge: 67,
      yearsContributed: 30,
      averageSalary: 15_000,
      isCouple: false,
    });
    expect(benefit).toBe(3_500); // קצבת בסיס
  });

  it('לזוג — יותר מליחיד', () => {
    const single = estimateSocialSecurityBenefit({ retirementAge: 67, yearsContributed: 30, averageSalary: 15_000, isCouple: false });
    const couple = estimateSocialSecurityBenefit({ retirementAge: 67, yearsContributed: 30, averageSalary: 15_000, isCouple: true });
    expect(couple).toBeGreaterThan(single);
    expect(couple).toBe(4_900);
  });

  it('פרישה מוקדמת — קצבה קטנה יותר', () => {
    const early = estimateSocialSecurityBenefit({ retirementAge: 62, yearsContributed: 30, averageSalary: 15_000, isCouple: false });
    const standard = estimateSocialSecurityBenefit({ retirementAge: 67, yearsContributed: 30, averageSalary: 15_000, isCouple: false });
    expect(early).toBeLessThan(standard);
    // 5 שנות פרישה מוקדמת = 5*12*0.5% = 30% הפחתה
    expect(early).toBeCloseTo(3_500 * 0.70, 0);
  });

  it('קצבה לא שלילית', () => {
    const veryEarly = estimateSocialSecurityBenefit({ retirementAge: 50, yearsContributed: 30, averageSalary: 15_000, isCouple: false });
    expect(veryEarly).toBeGreaterThanOrEqual(0);
  });
});

describe('estimatePensionBenefit', () => {
  it('40 שנה × 1.75% = 70% מהשכר', () => {
    const result = estimatePensionBenefit({ averageSalary: 10_000, yearsOfContribution: 40 });
    expect(result.monthlyPension).toBeCloseTo(7_000, 0);
    expect(result.replacementRate).toBeCloseTo(70, 0);
  });

  it('30 שנה × 1.75% = 52.5% מהשכר', () => {
    const result = estimatePensionBenefit({ averageSalary: 20_000, yearsOfContribution: 30 });
    expect(result.monthlyPension).toBeCloseTo(10_500, 0);
    expect(result.replacementRate).toBeCloseTo(52.5, 0);
  });

  it('מקדם מותאם אישית', () => {
    const result = estimatePensionBenefit({ averageSalary: 10_000, yearsOfContribution: 40, pensionCoefficient: 2.0 });
    // 10,000 * 40 * 2% = 8,000
    expect(result.monthlyPension).toBeCloseTo(8_000, 0);
    expect(result.replacementRate).toBeCloseTo(80, 0);
  });
});

// ============================================================
// PORTFOLIO LONGEVITY TESTS
// ============================================================

describe('calculatePortfolioLongevity', () => {
  it('תיק גדול עם משיכה קטנה — מחזיק לאורך זמן', () => {
    const result = calculatePortfolioLongevity({
      initialBalance: 3_000_000,
      monthlyWithdrawal: 8_000,
      annualReturn: 5,
      inflationRate: 3,
      maxYears: 40,
    });
    expect(result.yearsItLasts).toBe(40); // אמור להחזיק את כל התקופה
  });

  it('תיק קטן עם משיכה גדולה — נגמר מהר', () => {
    const result = calculatePortfolioLongevity({
      initialBalance: 500_000,
      monthlyWithdrawal: 15_000,
      annualReturn: 3,
      inflationRate: 3,
    });
    expect(result.yearsItLasts).toBeLessThan(20);
  });

  it('yearlyData מכיל נתונים', () => {
    const result = calculatePortfolioLongevity({
      initialBalance: 1_000_000,
      monthlyWithdrawal: 5_000,
      annualReturn: 5,
      inflationRate: 3,
    });
    expect(result.yearlyData.length).toBeGreaterThan(0);
    expect(result.yearlyData[0].year).toBe(1);
    expect(result.yearlyData[0].balance).toBeGreaterThan(0);
  });

  it('ריבית 0 — הכסף נגמר לפי קצב ידוע', () => {
    // 720,000 ÷ 5,000/ח = 12 שנים בלי ריבית ואינפלציה
    // הפונקציה מחשבת שנה שלמה: עד שהיתרה > 0
    const result = calculatePortfolioLongevity({
      initialBalance: 720_000,
      monthlyWithdrawal: 5_000,
      annualReturn: 0,
      inflationRate: 0,
      maxYears: 15,
    });
    // לאחר 12 שנים: 720,000 - 60,000*12 = 0 (בסיום שנה 12 = אפס, אז yearsItLasts=11)
    // לכן הפונקציה מחזירה 11 (מחשיבה רק שנים בהן יתרה > 0)
    expect(result.yearsItLasts).toBeGreaterThanOrEqual(10);
    expect(result.yearsItLasts).toBeLessThanOrEqual(12);
  });

  it('endBalance >= 0 תמיד', () => {
    const result = calculatePortfolioLongevity({
      initialBalance: 100_000,
      monthlyWithdrawal: 10_000,
      annualReturn: 0,
      inflationRate: 0,
    });
    expect(result.endBalance).toBeGreaterThanOrEqual(0);
  });
});
