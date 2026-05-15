import { describe, it, expect } from 'vitest';
import {
  calculateCompanyCarBenefit,
  calculateCompanyCarBenefitLegacy,
  detectCarGroup,
  calculateUsageValue,
  calculateTaxImpact,
  calculateEffectivePriceForUsed,
  calculateSalaryEquivalent,
  getCarGroupInfo,
  CAR_GROUPS_2026,
  type CompanyCarInput,
} from '@/lib/calculators/company-car-benefit';

// ─────────────────────────────────────────────
// Base input
// ─────────────────────────────────────────────

const baseInput: CompanyCarInput = {
  catalogPrice: 220_000,
  carType: 'regular',
  marginalTaxRate: 35,
  monthlySalary: 18_000,
  employerCoversMaintenance: false,
  maintenanceCoveredByEmployer: 0,
  monthlyKm: 1_500,
  fuelCostPer100km: 50,
};

// ─────────────────────────────────────────────
// detectCarGroup
// ─────────────────────────────────────────────

describe('detectCarGroup', () => {
  it('מחיר 0 → קבוצה 1', () => {
    expect(detectCarGroup(0)).toBe(1);
  });

  it('מחיר 100,000 → קבוצה 1 (מתחת ל-162,070)', () => {
    expect(detectCarGroup(100_000)).toBe(1);
  });

  it('מחיר 162,070 → קבוצה 2', () => {
    expect(detectCarGroup(162_070)).toBe(2);
  });

  it('מחיר 188,900 → קבוצה 3', () => {
    expect(detectCarGroup(188_900)).toBe(3);
  });

  it('מחיר 250,140 → קבוצה 4', () => {
    expect(detectCarGroup(250_140)).toBe(4);
  });

  it('מחיר 322,210 → קבוצה 5', () => {
    expect(detectCarGroup(322_210)).toBe(5);
  });

  it('מחיר 410,420 → קבוצה 6', () => {
    expect(detectCarGroup(410_420)).toBe(6);
  });

  it('מחיר 506,490 → קבוצה 7', () => {
    expect(detectCarGroup(506_490)).toBe(7);
  });

  it('מחיר 564,250 → קבוצה 8', () => {
    expect(detectCarGroup(564_250)).toBe(8);
  });

  it('מחיר 1,000,000 → קבוצה 8', () => {
    expect(detectCarGroup(1_000_000)).toBe(8);
  });
});

// ─────────────────────────────────────────────
// getCarGroupInfo
// ─────────────────────────────────────────────

describe('getCarGroupInfo', () => {
  it('קבוצה 1 – אחוז 2.04%', () => {
    const info = getCarGroupInfo(1);
    expect(info.percentage).toBeCloseTo(0.0204, 4);
  });

  it('קבוצה 8 – אחוז 5.14%', () => {
    const info = getCarGroupInfo(8);
    expect(info.percentage).toBeCloseTo(0.0514, 4);
  });

  it('כל 8 קבוצות קיימות', () => {
    expect(CAR_GROUPS_2026).toHaveLength(8);
  });
});

// ─────────────────────────────────────────────
// calculateUsageValue
// ─────────────────────────────────────────────

describe('calculateUsageValue', () => {
  it('רכב רגיל: שווי גולמי = מחיר × אחוז', () => {
    const { raw } = calculateUsageValue(200_000, 'regular', 3);
    // group 3: 2.92%
    expect(raw).toBeCloseTo(200_000 * 0.0292, 0);
  });

  it('רכב חשמלי: afterDiscount = 50% מהגולמי', () => {
    const { raw, afterDiscount } = calculateUsageValue(200_000, 'electric', 3);
    expect(afterDiscount).toBeCloseTo(raw * 0.5, 0);
  });

  it('רכב היברידי: afterDiscount = 70% מהגולמי', () => {
    const { raw, afterDiscount } = calculateUsageValue(200_000, 'hybrid', 3);
    expect(afterDiscount).toBeCloseTo(raw * 0.7, 0);
  });

  it('רכב ישן: effectivePrice נמוך מהמקורי', () => {
    const { effectivePrice } = calculateUsageValue(200_000, 'used', 1, 5);
    expect(effectivePrice).toBeLessThan(200_000);
  });

  it('רכב ישן: effectivePrice לא יורד מתחת ל-20% מהמקורי', () => {
    const { effectivePrice } = calculateUsageValue(200_000, 'used', 1, 30);
    expect(effectivePrice).toBeGreaterThanOrEqual(200_000 * 0.2);
  });
});

// ─────────────────────────────────────────────
// calculateEffectivePriceForUsed
// ─────────────────────────────────────────────

describe('calculateEffectivePriceForUsed', () => {
  it('גיל 0 → מחיר מקורי', () => {
    expect(calculateEffectivePriceForUsed(200_000, 0)).toBe(200_000);
  });

  it('גיל 1 → ~78,000 מ-100,000', () => {
    const p = calculateEffectivePriceForUsed(100_000, 1);
    expect(p).toBeCloseTo(78_000, -2);
  });

  it('גיל 5 → ירידה משמעותית', () => {
    const p = calculateEffectivePriceForUsed(200_000, 5);
    expect(p).toBeLessThan(130_000);
    expect(p).toBeGreaterThan(40_000);
  });
});

// ─────────────────────────────────────────────
// calculateTaxImpact
// ─────────────────────────────────────────────

describe('calculateTaxImpact', () => {
  it('שכר נמוך + שווי קטן → לא דוחף מדרגה', () => {
    // 5,000/month = 60,000/year (bracket 10%), + 500/month = 66,000/year (still 10%)
    const r = calculateTaxImpact(5_000, 500);
    expect(r.bracketBefore).toBe(r.bracketAfter);
  });

  it('מס נוסף > 0', () => {
    const r = calculateTaxImpact(15_000, 5_000);
    expect(r.additionalTax).toBeGreaterThan(0);
  });

  it('שכר גבוה + שווי גדול → עשוי לדחוף מדרגה', () => {
    // Annual 269,280 is the boundary for 31%→35%
    const monthlySalary = 22_000; // annual ~264k – close to boundary
    const benefit = 600; // small bump to push over
    const r = calculateTaxImpact(monthlySalary, benefit);
    // Should at least calculate a higher tax
    expect(r.taxAfterBenefit).toBeGreaterThan(r.taxBeforeBenefit);
  });
});

// ─────────────────────────────────────────────
// calculateSalaryEquivalent
// ─────────────────────────────────────────────

describe('calculateSalaryEquivalent', () => {
  it('מדרגה 50% → שכר מקביל = 2x ההטבה', () => {
    const eq = calculateSalaryEquivalent(5_000, 50);
    expect(eq).toBeCloseTo(10_000, 0);
  });

  it('מדרגה 0% → שכר מקביל = ההטבה', () => {
    const eq = calculateSalaryEquivalent(5_000, 0);
    expect(eq).toBeCloseTo(5_000, 0);
  });

  it('מדרגה 35% → שכר מקביל > ההטבה', () => {
    const eq = calculateSalaryEquivalent(5_000, 35);
    expect(eq).toBeGreaterThan(5_000);
    expect(eq).toBeCloseTo(5_000 / 0.65, 0);
  });
});

// ─────────────────────────────────────────────
// calculateCompanyCarBenefit – main
// ─────────────────────────────────────────────

describe('calculateCompanyCarBenefit', () => {
  it('מחזיר את קבוצת הרכב הנכונה לפי מחיר', () => {
    const r = calculateCompanyCarBenefit({ ...baseInput, catalogPrice: 220_000 });
    // 220,000 is in group 3 (188,900–250,140)
    expect(r.carGroup).toBe(3);
  });

  it('שווי שימוש חודשי חיובי', () => {
    const r = calculateCompanyCarBenefit(baseInput);
    expect(r.taxableBenefit).toBeGreaterThan(0);
  });

  it('מס חודשי = שווי × מס שולי', () => {
    const r = calculateCompanyCarBenefit({ ...baseInput, marginalTaxRate: 35 });
    expect(r.monthlyTax).toBeCloseTo(r.taxableBenefit * 0.35, 0);
  });

  it('עלות שנתית = מס חודשי × 12', () => {
    const r = calculateCompanyCarBenefit(baseInput);
    expect(r.annualCostToEmployee).toBeCloseTo(r.monthlyTax * 12, 0);
  });

  it('רכב חשמלי: שווי אחרי הנחה = 50% מהגולמי', () => {
    const r = calculateCompanyCarBenefit({ ...baseInput, carType: 'electric' });
    expect(r.monthlyBenefitAfterDiscount).toBeCloseTo(r.monthlyBenefitRaw * 0.5, 0);
  });

  it('רכב היברידי: שווי אחרי הנחה = 70% מהגולמי', () => {
    const r = calculateCompanyCarBenefit({ ...baseInput, carType: 'hybrid' });
    expect(r.monthlyBenefitAfterDiscount).toBeCloseTo(r.monthlyBenefitRaw * 0.7, 0);
  });

  it('רכב רגיל: שווי לפני = שווי אחרי', () => {
    const r = calculateCompanyCarBenefit({ ...baseInput, carType: 'regular' });
    expect(r.monthlyBenefitRaw).toBeCloseTo(r.monthlyBenefitAfterDiscount, 0);
  });

  it('תחזוקה ממעסיק מופיעה ב-maintenanceBenefit', () => {
    const r = calculateCompanyCarBenefit({
      ...baseInput,
      employerCoversMaintenance: true,
      maintenanceCoveredByEmployer: 800,
    });
    expect(r.maintenanceBenefit).toBe(800);
    expect(r.totalMonthlyBenefit).toBeGreaterThan(r.taxableBenefit);
  });

  it('בלי תחזוקה: maintenanceBenefit = 0', () => {
    const r = calculateCompanyCarBenefit({ ...baseInput, employerCoversMaintenance: false });
    expect(r.maintenanceBenefit).toBe(0);
  });

  it('מחיר מינימלי (0): לא מחזיר ערכים שליליים', () => {
    const r = calculateCompanyCarBenefit({ ...baseInput, catalogPrice: 0 });
    expect(r.taxableBenefit).toBeGreaterThanOrEqual(0);
    expect(r.monthlyTax).toBeGreaterThanOrEqual(0);
  });

  it('קבוצה 8 – מחיר 600,000 ₪ → אחוז 5.14%', () => {
    const r = calculateCompanyCarBenefit({ ...baseInput, catalogPrice: 600_000 });
    expect(r.carGroup).toBe(8);
    expect(r.benefitPercentage).toBeCloseTo(0.0514, 4);
    expect(r.monthlyBenefitRaw).toBeCloseTo(600_000 * 0.0514, 0);
  });

  it('salaryEquivalent > taxableBenefit כשמס > 0', () => {
    const r = calculateCompanyCarBenefit({ ...baseInput, marginalTaxRate: 35 });
    expect(r.salaryEquivalent).toBeGreaterThan(r.taxableBenefit);
  });

  it('יש לפחות המלצה אחת', () => {
    const r = calculateCompanyCarBenefit(baseInput);
    expect(r.recommendations.length).toBeGreaterThan(0);
  });

  it('costBreakdown כולל לפחות 2 פריטים', () => {
    const r = calculateCompanyCarBenefit(baseInput);
    expect(r.costBreakdown.length).toBeGreaterThanOrEqual(2);
  });
});

// ─────────────────────────────────────────────
// Backward compatibility (legacy)
// ─────────────────────────────────────────────

describe('calculateCompanyCarBenefitLegacy', () => {
  it('מחזיר את השדות הישנים הנדרשים', () => {
    const r = calculateCompanyCarBenefitLegacy({
      catalogPrice: 200_000,
      carGroup: 4,
      isElectric: false,
      marginalTaxRate: 35,
    });
    expect(r).toHaveProperty('benefitPercentage');
    expect(r).toHaveProperty('monthlyBenefit');
    expect(r).toHaveProperty('electricDiscount');
    expect(r).toHaveProperty('taxableBenefit');
    expect(r).toHaveProperty('monthlyTax');
    expect(r).toHaveProperty('annualCost');
    expect(r).toHaveProperty('recommendation');
  });

  it('electricDiscount > 0 עבור רכב חשמלי', () => {
    const r = calculateCompanyCarBenefitLegacy({
      catalogPrice: 200_000,
      carGroup: 3,
      isElectric: true,
      marginalTaxRate: 35,
    });
    expect(r.electricDiscount).toBeGreaterThan(0);
  });

  it('electricDiscount = 0 עבור רכב רגיל', () => {
    const r = calculateCompanyCarBenefitLegacy({
      catalogPrice: 200_000,
      carGroup: 3,
      isElectric: false,
      marginalTaxRate: 35,
    });
    expect(r.electricDiscount).toBe(0);
  });

  it('annualCost = monthlyTax × 12', () => {
    const r = calculateCompanyCarBenefitLegacy({
      catalogPrice: 150_000,
      carGroup: 2,
      isElectric: false,
      marginalTaxRate: 31,
    });
    expect(r.annualCost).toBeCloseTo(r.monthlyTax * 12, 0);
  });
});
