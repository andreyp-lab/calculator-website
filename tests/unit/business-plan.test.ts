import { describe, it, expect } from 'vitest';
import {
  calculateBusinessPlan,
  EMPLOYER_BURDEN_FACTOR,
  RENT_DEPOSIT_MONTHS,
} from '@/lib/calculators/business-plan';
import { getBusinessType } from '@/lib/data/business-setup/business-types';
import { getCityRent } from '@/lib/data/business-setup/rent-by-city';

describe('calculateBusinessPlan', () => {
  const base = {
    businessSlug: 'pilates-studio',
    city: 'תל אביב',
    areaSqm: 60,
    isExistingPlace: false,
    includeOptional: false,
  };

  it('מחזיר null לסוג עסק לא קיים', () => {
    expect(calculateBusinessPlan({ ...base, businessSlug: 'nope' })).toBeNull();
  });

  it('שכר דירה = שטח × ₪/מ"ר של העיר', () => {
    const r = calculateBusinessPlan(base)!;
    const rent = getCityRent('תל אביב').rentPerSqmMonthly * 60;
    const rentLine = r.monthlyLines.find((l) => l.name === 'שכר דירה')!;
    expect(rentLine.amount).toBe(rent); // 120 × 60 = 7,200
  });

  it('פיקדון שכירות = שכ"ד × מספר חודשי הפיקדון', () => {
    const r = calculateBusinessPlan(base)!;
    const deposit = r.setupLines.find((l) => l.name.includes('פיקדון'))!;
    expect(deposit.amount).toBe(120 * 60 * RENT_DEPOSIT_MONTHS);
  });

  it('שטח מוגבל לטווח המותר של סוג העסק', () => {
    const bt = getBusinessType('pilates-studio')!;
    const tooBig = calculateBusinessPlan({ ...base, areaSqm: 9999 })!;
    expect(tooBig.areaSqm).toBe(bt.maxAreaSqm);
    const tooSmall = calculateBusinessPlan({ ...base, areaSqm: 1 })!;
    expect(tooSmall.areaSqm).toBe(bt.minAreaSqm);
  });

  it('שכר עובדים כולל מקדם עלות מעביד', () => {
    const bt = getBusinessType('pilates-studio')!; // staff.count=1, gross=9000
    const r = calculateBusinessPlan(base)!;
    const staff = r.monthlyLines.find((l) => l.name.startsWith('שכר עובדים'))!;
    expect(staff.amount).toBe(Math.round(bt.staff.count * bt.staff.avgMonthlyGross * EMPLOYER_BURDEN_FACTOR));
  });

  it('נקודת איזון: יחידות × תרומה ≥ הוצאות קבועות', () => {
    const r = calculateBusinessPlan(base)!;
    expect(r.breakEvenUnits * r.contributionPerUnit).toBeGreaterThanOrEqual(r.monthlyFixedTotal);
    // יחידה אחת פחות — לא מכסה
    expect((r.breakEvenUnits - 1) * r.contributionPerUnit).toBeLessThan(r.monthlyFixedTotal);
  });

  it('מקום קיים זול יותר להקמה ממקום חדש (פחות שיפוץ)', () => {
    const existing = calculateBusinessPlan({ ...base, isExistingPlace: true })!;
    const brandNew = calculateBusinessPlan({ ...base, isExistingPlace: false })!;
    expect(existing.setupTotal).toBeLessThan(brandNew.setupTotal);
  });

  it('פריטים אופציונליים מגדילים את עלות הציוד', () => {
    const without = calculateBusinessPlan({ ...base, includeOptional: false })!;
    const withOpt = calculateBusinessPlan({ ...base, includeOptional: true })!;
    const eq = (r: typeof without) => r.setupLines.find((l) => l.name === 'ציוד וריהוט')!.amount;
    expect(eq(withOpt)).toBeGreaterThan(eq(without));
  });

  it('רווח חודשי חיובי מחזיר זמן החזר סופי', () => {
    const r = calculateBusinessPlan({ ...base, monthlyUnitsSold: 80 })!;
    expect(r.projectedMonthlyProfit).toBeGreaterThan(0);
    expect(r.monthsToRecoup).toBeGreaterThan(0);
  });

  it('מתחת לנקודת איזון — אין זמן החזר (null)', () => {
    const r = calculateBusinessPlan({ ...base, monthlyUnitsSold: 1 })!;
    expect(r.projectedMonthlyProfit).toBeLessThan(0);
    expect(r.monthsToRecoup).toBeNull();
  });

  it('פחת חודשי = (ציוד + שיפוץ) / אורך חיים בחודשים', () => {
    const bt = getBusinessType('pilates-studio')!;
    const r = calculateBusinessPlan(base)!;
    expect(r.monthlyDepreciation).toBe(Math.round(r.depreciableBase / (bt.equipmentUsefulLifeYears * 12)));
    expect(r.recommendedRenewalReserve).toBe(r.monthlyDepreciation);
    expect(r.monthlyDepreciation).toBeGreaterThan(0);
  });

  it('רווח אחרי רזרבת חידוש נמוך מהרווח התזרימי', () => {
    const r = calculateBusinessPlan({ ...base, monthlyUnitsSold: 80 })!;
    expect(r.projectedProfitAfterReserve).toBe(r.projectedMonthlyProfit - r.monthlyDepreciation);
    expect(r.projectedProfitAfterReserve).toBeLessThan(r.projectedMonthlyProfit);
  });

  it('בסיס בר-פחת = ציוד + שיפוץ (לא כולל פיקדון/רישוי)', () => {
    const r = calculateBusinessPlan(base)!;
    const equip = r.setupLines.find((l) => l.name === 'ציוד וריהוט')!.amount;
    const renov = r.setupLines.find((l) => l.name.includes('שיפוץ') || l.name.includes('התאמת'))!.amount;
    expect(r.depreciableBase).toBe(equip + renov);
  });

  it('עובד גם לסטודיו צילום (ללא עובדים)', () => {
    const r = calculateBusinessPlan({ ...base, businessSlug: 'photography-studio' })!;
    expect(r.monthlyLines.find((l) => l.name.startsWith('שכר עובדים'))).toBeUndefined();
    expect(r.setupTotal).toBeGreaterThan(0);
  });
});
