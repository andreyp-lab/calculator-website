import { describe, it, expect } from 'vitest';
import {
  calculateSelfEmployedPension,
  calculateMandatoryDeposit,
  calculateTaxBenefit,
  calculateFutureValue,
  calculateMonthlyPension,
  buildProjection,
  analyzePenalty,
  calculateOptimalContribution,
  AVERAGE_WAGE_2026,
  HALF_AVERAGE_WAGE_2026,
  TIER1_RATE,
  TIER2_RATE,
  TAX_CREDIT_CEILING_ANNUAL,
  DEFAULT_ANNUAL_RETURN,
  MANDATORY_PENSION_YEAR,
} from '@/lib/calculators/self-employed-pension';

// ====================================================================
// קבועים
// ====================================================================
describe('קבועים', () => {
  it('שכר ממוצע 2026', () => {
    expect(AVERAGE_WAGE_2026).toBe(13_769);
  });

  it('מחצית שכר ממוצע', () => {
    expect(HALF_AVERAGE_WAGE_2026).toBe(6_884);
  });

  it('שיעור שלב 1', () => {
    expect(TIER1_RATE).toBeCloseTo(0.0445, 4);
  });

  it('שיעור שלב 2', () => {
    expect(TIER2_RATE).toBeCloseTo(0.1255, 4);
  });

  it('תקרת זיכוי מס', () => {
    expect(TAX_CREDIT_CEILING_ANNUAL).toBe(13_736);
  });

  it('שנת תחילת חובה', () => {
    expect(MANDATORY_PENSION_YEAR).toBe(2017);
  });
});

// ====================================================================
// calculateMandatoryDeposit
// ====================================================================
describe('calculateMandatoryDeposit', () => {
  it('הכנסה 0 — אין הפקדה', () => {
    const { total } = calculateMandatoryDeposit(0);
    expect(total).toBe(0);
  });

  it('הכנסה שלב 1 בלבד (3,000)', () => {
    const { tier1, tier2, total } = calculateMandatoryDeposit(3_000);
    expect(tier1).toBeCloseTo(3_000 * TIER1_RATE, 2);
    expect(tier2).toBe(0);
    expect(total).toBeCloseTo(tier1, 2);
  });

  it('הכנסה בדיוק בסף שלב 1 (6,884)', () => {
    const { tier1, tier2 } = calculateMandatoryDeposit(HALF_AVERAGE_WAGE_2026);
    expect(tier1).toBeCloseTo(HALF_AVERAGE_WAGE_2026 * TIER1_RATE, 2);
    expect(tier2).toBe(0);
  });

  it('הכנסה בשלב 2 (10,000)', () => {
    const { tier1, tier2, total } = calculateMandatoryDeposit(10_000);
    expect(tier1).toBeCloseTo(HALF_AVERAGE_WAGE_2026 * TIER1_RATE, 2);
    expect(tier2).toBeCloseTo((10_000 - HALF_AVERAGE_WAGE_2026) * TIER2_RATE, 2);
    expect(total).toBeCloseTo(tier1 + tier2, 2);
  });

  it('הכנסה בשיא החובה (13,769)', () => {
    const { total } = calculateMandatoryDeposit(AVERAGE_WAGE_2026);
    const expectedTier1 = HALF_AVERAGE_WAGE_2026 * TIER1_RATE;
    const expectedTier2 = (AVERAGE_WAGE_2026 - HALF_AVERAGE_WAGE_2026) * TIER2_RATE;
    expect(total).toBeCloseTo(expectedTier1 + expectedTier2, 1);
  });

  it('הכנסה מעל השכר הממוצע — לא גדל', () => {
    const { total: at13769 } = calculateMandatoryDeposit(AVERAGE_WAGE_2026);
    const { total: at20000 } = calculateMandatoryDeposit(20_000);
    expect(at20000).toBeCloseTo(at13769, 1);
  });

  it('הכנסה שלילית — אפס', () => {
    const { total } = calculateMandatoryDeposit(-1000);
    expect(total).toBe(0);
  });

  it('tier1 + tier2 = total', () => {
    const { tier1, tier2, total } = calculateMandatoryDeposit(12_000);
    expect(total).toBeCloseTo(tier1 + tier2, 2);
  });
});

// ====================================================================
// calculateTaxBenefit
// ====================================================================
describe('calculateTaxBenefit', () => {
  it('מס 0 — אין ניכוי', () => {
    const benefit = calculateTaxBenefit(10_000, 0);
    expect(benefit.deductionSaving).toBe(0);
  });

  it('ניכוי = contribution × marginal / 100', () => {
    const contribution = 10_000;
    const rate = 35;
    const benefit = calculateTaxBenefit(contribution, rate);
    expect(benefit.deductionSaving).toBeCloseTo(contribution * (rate / 100), 1);
  });

  it('זיכוי לא גדל מעל התקרה', () => {
    const b1 = calculateTaxBenefit(TAX_CREDIT_CEILING_ANNUAL, 35);
    const b2 = calculateTaxBenefit(TAX_CREDIT_CEILING_ANNUAL * 2, 35);
    expect(b1.creditSaving).toBeCloseTo(b2.creditSaving, 0);
  });

  it('maxBenefitReached = true כשמגיעים לתקרה', () => {
    const b = calculateTaxBenefit(TAX_CREDIT_CEILING_ANNUAL, 35);
    expect(b.maxBenefitReached).toBe(true);
  });

  it('maxBenefitReached = false מתחת לתקרה', () => {
    const b = calculateTaxBenefit(5_000, 35);
    expect(b.maxBenefitReached).toBe(false);
  });

  it('effectiveReturnRate > 0 עם מס חיובי', () => {
    const b = calculateTaxBenefit(12_000, 35);
    expect(b.effectiveReturnRate).toBeGreaterThan(0);
    expect(b.effectiveReturnRate).toBeLessThan(1);
  });

  it('totalSaving = deductionSaving + creditSaving', () => {
    const b = calculateTaxBenefit(12_000, 35);
    expect(b.totalSaving).toBeCloseTo(b.deductionSaving + b.creditSaving, 1);
  });
});

// ====================================================================
// calculateFutureValue
// ====================================================================
describe('calculateFutureValue', () => {
  it('תשואה 0% — FV = הפקדות', () => {
    const fv = calculateFutureValue(10_000, 10, 0);
    expect(fv).toBe(100_000);
  });

  it('ריבית 4% — FV גדולה מסך הפקדות', () => {
    const fv = calculateFutureValue(10_000, 10, 0.04);
    expect(fv).toBeGreaterThan(100_000);
  });

  it('תשואה גבוהה יותר — FV גדולה יותר', () => {
    const fv4 = calculateFutureValue(10_000, 20, 0.04);
    const fv6 = calculateFutureValue(10_000, 20, 0.06);
    expect(fv6).toBeGreaterThan(fv4);
  });

  it('שנות הפקדה יותר — FV גדולה יותר', () => {
    const fv20 = calculateFutureValue(10_000, 20, 0.04);
    const fv30 = calculateFutureValue(10_000, 30, 0.04);
    expect(fv30).toBeGreaterThan(fv20);
  });
});

// ====================================================================
// calculateMonthlyPension
// ====================================================================
describe('calculateMonthlyPension', () => {
  it('קרן 200,000 → 1,000 ₪/חודש', () => {
    expect(calculateMonthlyPension(200_000)).toBe(1_000);
  });

  it('קרן 0 → 0', () => {
    expect(calculateMonthlyPension(0)).toBe(0);
  });

  it('קרן כפול → קצבה כפולה', () => {
    const p1 = calculateMonthlyPension(500_000);
    const p2 = calculateMonthlyPension(1_000_000);
    expect(p2).toBeCloseTo(p1 * 2, 0);
  });
});

// ====================================================================
// buildProjection
// ====================================================================
describe('buildProjection', () => {
  it('מחזיר את מספר השנים הנכון', () => {
    const proj = buildProjection(12_000, 20, 0.04, 40);
    expect(proj.length).toBe(20);
  });

  it('שנה ראשונה — fundValue > 0', () => {
    const proj = buildProjection(12_000, 10, 0.04, 35);
    expect(proj[0].fundValue).toBeGreaterThan(0);
  });

  it('שווי קרן גדל לאורך השנים', () => {
    const proj = buildProjection(12_000, 10, 0.04, 40);
    for (let i = 1; i < proj.length; i++) {
      expect(proj[i].fundValue).toBeGreaterThan(proj[i - 1].fundValue);
    }
  });

  it('גיל בכל שנה = currentAge + year', () => {
    const proj = buildProjection(12_000, 5, 0.04, 40);
    proj.forEach((p, i) => {
      expect(p.ageAtYear).toBe(40 + i + 1);
    });
  });

  it('totalDeposited עולה ב-annualContribution כל שנה', () => {
    const annual = 12_000;
    const proj = buildProjection(annual, 3, 0.04, 40);
    expect(proj[0].totalDeposited).toBe(annual);
    expect(proj[1].totalDeposited).toBe(annual * 2);
    expect(proj[2].totalDeposited).toBe(annual * 3);
  });
});

// ====================================================================
// analyzePenalty
// ====================================================================
describe('analyzePenalty', () => {
  it('0 שנים — אין קנס', () => {
    const result = analyzePenalty(15_000, 0);
    expect(result.hasPenaltyRisk).toBe(false);
    expect(result.totalExposure).toBe(0);
  });

  it('שנות קנס > 0 — יש חשיפה', () => {
    const result = analyzePenalty(15_000, 3);
    expect(result.hasPenaltyRisk).toBe(true);
    expect(result.estimatedMissingDeposits).toBeGreaterThan(0);
    expect(result.totalExposure).toBeGreaterThan(result.estimatedMissingDeposits);
  });

  it('5 שנות קנס — חשיפה גבוהה', () => {
    const result5 = analyzePenalty(15_000, 5);
    const result2 = analyzePenalty(15_000, 2);
    expect(result5.totalExposure).toBeGreaterThan(result2.totalExposure);
  });

  it('הכנסה גבוהה — חשיפה גבוהה יותר', () => {
    const r1 = analyzePenalty(10_000, 3);
    const r2 = analyzePenalty(20_000, 3);
    expect(r2.totalExposure).toBeGreaterThan(r1.totalExposure);
  });
});

// ====================================================================
// calculateSelfEmployedPension (מלא)
// ====================================================================
describe('calculateSelfEmployedPension', () => {
  const baseInput = {
    monthlyIncome: 15_000,
    marginalTaxRate: 35,
    contributeAboveMandatory: false,
    voluntaryMonthlyContribution: 0,
  };

  it('מבנה תשובה', () => {
    const r = calculateSelfEmployedPension(baseInput);
    expect(r).toHaveProperty('mandatoryMonthly');
    expect(r).toHaveProperty('mandatoryAnnual');
    expect(r).toHaveProperty('taxSavings');
    expect(r).toHaveProperty('netCost');
    expect(r).toHaveProperty('taxBenefit');
    expect(r).toHaveProperty('tierBreakdown');
    expect(r).toHaveProperty('projection');
    expect(r).toHaveProperty('penaltyAnalysis');
    expect(r).toHaveProperty('recommendations');
  });

  it('mandatoryAnnual = mandatoryMonthly × 12', () => {
    const r = calculateSelfEmployedPension(baseInput);
    expect(r.mandatoryAnnual).toBeCloseTo(r.mandatoryMonthly * 12, 1);
  });

  it('netCost < totalAnnualContribution (הטבת מס)', () => {
    const r = calculateSelfEmployedPension({ ...baseInput, marginalTaxRate: 35 });
    expect(r.netCost).toBeLessThan(r.totalAnnualContribution);
  });

  it('הכנסה מעל שכר ממוצע — isAboveAverageWage = true', () => {
    const r = calculateSelfEmployedPension({ ...baseInput, monthlyIncome: 20_000 });
    expect(r.isAboveAverageWage).toBe(true);
  });

  it('הכנסה מתחת לשכר ממוצע — isAboveAverageWage = false', () => {
    const r = calculateSelfEmployedPension({ ...baseInput, monthlyIncome: 8_000 });
    expect(r.isAboveAverageWage).toBe(false);
  });

  it('הפקדה רצונית מגדילה totalAnnualContribution', () => {
    const rNoVoluntary = calculateSelfEmployedPension(baseInput);
    const rWithVoluntary = calculateSelfEmployedPension({
      ...baseInput,
      contributeAboveMandatory: true,
      voluntaryMonthlyContribution: 500,
    });
    expect(rWithVoluntary.totalAnnualContribution).toBeGreaterThan(rNoVoluntary.totalAnnualContribution);
  });

  it('קצבה צפויה > 0', () => {
    const r = calculateSelfEmployedPension({ ...baseInput, yearsToRetirement: 25 });
    expect(r.expectedMonthlyPensionActual).toBeGreaterThan(0);
  });

  it('הפקדה לשכר 0 = 0', () => {
    const r = calculateSelfEmployedPension({ ...baseInput, monthlyIncome: 0 });
    expect(r.mandatoryMonthly).toBe(0);
  });

  it('netCostMonthly = netCost / 12', () => {
    const r = calculateSelfEmployedPension(baseInput);
    expect(r.netCostMonthly).toBeCloseTo(r.netCost / 12, 1);
  });

  it('תאימות לאחור — breakdown קיים', () => {
    const r = calculateSelfEmployedPension(baseInput);
    expect(r.breakdown.tier1Rate).toBeCloseTo(4.45, 2);
    expect(r.breakdown.tier2Rate).toBeCloseTo(12.55, 2);
  });

  it('הקרנה מכילה שנים', () => {
    const r = calculateSelfEmployedPension({ ...baseInput, yearsToRetirement: 10 });
    expect(r.projection.length).toBeGreaterThan(0);
  });
});

// ====================================================================
// calculateOptimalContribution
// ====================================================================
describe('calculateOptimalContribution', () => {
  it('לא פחות מהחובה', () => {
    const income = 10_000;
    const mandatory = calculateMandatoryDeposit(income).total;
    const optimal = calculateOptimalContribution(income, 35);
    expect(optimal).toBeGreaterThanOrEqual(mandatory);
  });

  it('לא יותר מ-15% מההכנסה', () => {
    const income = 10_000;
    const optimal = calculateOptimalContribution(income, 35);
    expect(optimal).toBeLessThanOrEqual(income * 0.15 + 1); // +1 ε
  });
});
