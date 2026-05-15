import { describe, it, expect } from 'vitest';
import {
  calculateAnnualLeave,
  getVacationDaysByTenure,
  calculateAnnualLeaveFull,
  calculateRedemption,
  calculateAccumulation,
  calculatePartialYear,
} from '@/lib/calculators/employee-benefits';

// ====================================================================
// getVacationDaysByTenure — טבלת זכאות לפי ותק (חוק 2026)
// ====================================================================
describe('getVacationDaysByTenure', () => {
  describe('5 ימי עבודה בשבוע', () => {
    it('שנה 1 — 12 ימים', () => {
      expect(getVacationDaysByTenure(1, 5)).toBe(12);
    });
    it('שנה 4 — 12 ימים', () => {
      expect(getVacationDaysByTenure(4, 5)).toBe(12);
    });
    it('שנה 5 — 15 ימים', () => {
      expect(getVacationDaysByTenure(5, 5)).toBe(15);
    });
    it('שנה 6 — 16 ימים', () => {
      expect(getVacationDaysByTenure(6, 5)).toBe(16);
    });
    it('שנה 7 — 17 ימים', () => {
      expect(getVacationDaysByTenure(7, 5)).toBe(17);
    });
    it('שנה 8 — 18 ימים', () => {
      expect(getVacationDaysByTenure(8, 5)).toBe(18);
    });
    it('שנה 9 — 18 ימים', () => {
      expect(getVacationDaysByTenure(9, 5)).toBe(18);
    });
    it('שנה 10 — 19 ימים', () => {
      expect(getVacationDaysByTenure(10, 5)).toBe(19);
    });
    it('שנה 11 — 20 ימים', () => {
      expect(getVacationDaysByTenure(11, 5)).toBe(20);
    });
    it('שנה 12 — 21 ימים', () => {
      expect(getVacationDaysByTenure(12, 5)).toBe(21);
    });
    it('שנה 13 — 22 ימים', () => {
      expect(getVacationDaysByTenure(13, 5)).toBe(22);
    });
    it('שנה 14 — 23 ימים', () => {
      expect(getVacationDaysByTenure(14, 5)).toBe(23);
    });
    it('שנה 20 — 23 ימים (לא עולה מעל 23)', () => {
      expect(getVacationDaysByTenure(20, 5)).toBe(23);
    });
    it('שנה 0 — 12 ימים (מינימום)', () => {
      expect(getVacationDaysByTenure(0, 5)).toBe(12);
    });
  });

  describe('6 ימי עבודה בשבוע', () => {
    it('שנה 1 — 14 ימים', () => {
      expect(getVacationDaysByTenure(1, 6)).toBe(14);
    });
    it('שנה 4 — 14 ימים', () => {
      expect(getVacationDaysByTenure(4, 6)).toBe(14);
    });
    it('שנה 5 — 16 ימים', () => {
      expect(getVacationDaysByTenure(5, 6)).toBe(16);
    });
    it('שנה 6 — 18 ימים', () => {
      expect(getVacationDaysByTenure(6, 6)).toBe(18);
    });
    it('שנה 7 — 21 ימים', () => {
      expect(getVacationDaysByTenure(7, 6)).toBe(21);
    });
    it('שנה 8 — 22 ימים', () => {
      expect(getVacationDaysByTenure(8, 6)).toBe(22);
    });
    it('שנה 10 — 22 ימים', () => {
      expect(getVacationDaysByTenure(10, 6)).toBe(22);
    });
    it('שנה 11 — 23 ימים', () => {
      expect(getVacationDaysByTenure(11, 6)).toBe(23);
    });
    it('שנה 12 — 24 ימים', () => {
      expect(getVacationDaysByTenure(12, 6)).toBe(24);
    });
    it('שנה 13 — 26 ימים', () => {
      expect(getVacationDaysByTenure(13, 6)).toBe(26);
    });
    it('שנה 14 — 28 ימים', () => {
      expect(getVacationDaysByTenure(14, 6)).toBe(28);
    });
    it('שנה 30 — 28 ימים (מקסימום)', () => {
      expect(getVacationDaysByTenure(30, 6)).toBe(28);
    });
  });
});

// ====================================================================
// calculateAnnualLeave — תאימות לאחור (backward compatibility)
// ====================================================================
describe('calculateAnnualLeave (backward compat)', () => {
  it('ותק 5 שנים, 5 ימי עבודה', () => {
    const r = calculateAnnualLeave({ yearsOfService: 5, workDaysPerWeek: 5 });
    expect(r.daysEntitled).toBeGreaterThanOrEqual(12);
    expect(r.basis).toBeTruthy();
  });

  it('ותק 10 שנים, 6 ימי עבודה', () => {
    const r = calculateAnnualLeave({ yearsOfService: 10, workDaysPerWeek: 6 });
    expect(r.daysEntitled).toBeGreaterThanOrEqual(14);
    expect(r.actualWorkDays).toBeGreaterThan(0);
  });

  it('ותק 0 שנים — מחזיר ברירת מחדל', () => {
    const r = calculateAnnualLeave({ yearsOfService: 0, workDaysPerWeek: 5 });
    expect(r.daysEntitled).toBeGreaterThanOrEqual(12);
  });
});

// ====================================================================
// calculateAnnualLeaveFull — חישוב מלא
// ====================================================================
describe('calculateAnnualLeaveFull', () => {
  it('ותק 5 שנים, שכר 15,000 — ערך יום נכון', () => {
    const r = calculateAnnualLeaveFull({
      yearsOfService: 5,
      additionalMonths: 0,
      workDaysPerWeek: 5,
      partTimePercent: 100,
      monthlySalary: 15000,
      daysUsedThisYear: 0,
      daysUsedLastYear: 0,
      isTermination: false,
    });
    expect(r.annualEntitlement).toBe(15);
    expect(r.dailyWageValue).toBeCloseTo(15000 / 21.67, 0);
    expect(r.remainingDays).toBe(15);
  });

  it('משרה 50% — זכאות מחצית', () => {
    const r = calculateAnnualLeaveFull({
      yearsOfService: 3,
      additionalMonths: 0,
      workDaysPerWeek: 5,
      partTimePercent: 50,
      monthlySalary: 8000,
      daysUsedThisYear: 0,
      daysUsedLastYear: 0,
      isTermination: false,
    });
    expect(r.adjustedEntitlement).toBe(6); // 12 × 50%
  });

  it('שנה חלקית (8 חודשים) — חישוב יחסי', () => {
    const r = calculateAnnualLeaveFull({
      yearsOfService: 2,
      additionalMonths: 8,
      workDaysPerWeek: 5,
      partTimePercent: 100,
      monthlySalary: 10000,
      daysUsedThisYear: 0,
      daysUsedLastYear: 0,
      isTermination: false,
    });
    // 12 ימים × (8/12) = 8
    expect(r.proRatedCurrentYear).toBeCloseTo(8, 0);
  });

  it('ניצול 5 ימים — יתרה נכונה', () => {
    const r = calculateAnnualLeaveFull({
      yearsOfService: 5,
      additionalMonths: 0,
      workDaysPerWeek: 5,
      partTimePercent: 100,
      monthlySalary: 12000,
      daysUsedThisYear: 5,
      daysUsedLastYear: 0,
      isTermination: false,
    });
    expect(r.remainingDays).toBe(10); // 15 - 5
  });

  it('סיום עבודה — פדיון מחושב', () => {
    const r = calculateAnnualLeaveFull({
      yearsOfService: 7,
      additionalMonths: 0,
      workDaysPerWeek: 5,
      partTimePercent: 100,
      monthlySalary: 20000,
      daysUsedThisYear: 0,
      daysUsedLastYear: 0,
      isTermination: true,
    });
    expect(r.redemptionDays).toBeGreaterThan(0);
    expect(r.redemptionValue).toBeGreaterThan(0);
  });

  it('6 ימי עבודה — ערך יום נמוך יותר (מחלקים ב-25)', () => {
    const r = calculateAnnualLeaveFull({
      yearsOfService: 5,
      additionalMonths: 0,
      workDaysPerWeek: 6,
      partTimePercent: 100,
      monthlySalary: 15000,
      daysUsedThisYear: 0,
      daysUsedLastYear: 0,
      isTermination: false,
    });
    expect(r.dailyWageValue).toBeCloseTo(15000 / 25, 0);
  });
});

// ====================================================================
// calculateRedemption — פדיון חופשה
// ====================================================================
describe('calculateRedemption', () => {
  it('20 ימים, שכר 10,000 — חישוב נכון', () => {
    const r = calculateRedemption({
      accumulatedDays: 20,
      monthlySalary: 10000,
      workDaysPerWeek: 5,
    });
    const expectedDaily = 10000 / 21.67;
    expect(r.dailyWage).toBeCloseTo(expectedDaily, 0);
    expect(r.totalRedemption).toBeCloseTo(20 * expectedDaily, 0);
    expect(r.daysToRedeem).toBe(20);
  });

  it('0 ימים — פדיון אפס', () => {
    const r = calculateRedemption({
      accumulatedDays: 0,
      monthlySalary: 15000,
      workDaysPerWeek: 5,
    });
    expect(r.totalRedemption).toBe(0);
  });

  it('6 ימי עבודה — חלוקה ב-25', () => {
    const r = calculateRedemption({
      accumulatedDays: 10,
      monthlySalary: 12500,
      workDaysPerWeek: 6,
    });
    expect(r.dailyWage).toBeCloseTo(12500 / 25, 1);
    expect(r.totalRedemption).toBeCloseTo(10 * (12500 / 25), 0);
  });

  it('שכר 0 — ערך אפס', () => {
    const r = calculateRedemption({
      accumulatedDays: 15,
      monthlySalary: 0,
      workDaysPerWeek: 5,
    });
    expect(r.dailyWage).toBe(0);
    expect(r.totalRedemption).toBe(0);
  });
});

// ====================================================================
// calculateAccumulation — צבירה לאורך שנים
// ====================================================================
describe('calculateAccumulation', () => {
  it('5 שנים, ניצול 0 — צבירה מלאה', () => {
    const r = calculateAccumulation({
      yearsOfService: 5,
      workDaysPerWeek: 5,
      totalDaysUsed: 0,
      partTimePercent: 100,
    });
    // 12+12+12+12+15 = 63
    expect(r.totalAccumulated).toBeCloseTo(63, 0);
    expect(r.totalUsed).toBe(0);
    expect(r.balance).toBeCloseTo(63, 0);
  });

  it('3 שנות ניצול — מפחית מהיתרה', () => {
    const r = calculateAccumulation({
      yearsOfService: 3,
      workDaysPerWeek: 5,
      totalDaysUsed: 20,
      partTimePercent: 100,
    });
    // 12+12+12 = 36 נצברו, 20 נוצלו, יתרה 16
    expect(r.balance).toBeCloseTo(16, 0);
  });

  it('פירוט שנתי — שנה 1 עם 12 ימים', () => {
    const r = calculateAccumulation({
      yearsOfService: 3,
      workDaysPerWeek: 5,
      totalDaysUsed: 0,
      partTimePercent: 100,
    });
    expect(r.yearlyBreakdown[0].entitled).toBe(12);
    expect(r.yearlyBreakdown[0].year).toBe(1);
  });

  it('50% משרה — צבירה חצי', () => {
    const r = calculateAccumulation({
      yearsOfService: 4,
      workDaysPerWeek: 5,
      totalDaysUsed: 0,
      partTimePercent: 50,
    });
    // 4 × 12 × 50% = 24
    expect(r.totalAccumulated).toBeCloseTo(24, 0);
  });
});

// ====================================================================
// calculatePartialYear — שנה חלקית
// ====================================================================
describe('calculatePartialYear', () => {
  it('6 חודשים, ותק 5, 5 ימים — חצי שנה', () => {
    const r = calculatePartialYear({
      monthsWorked: 6,
      yearsOfService: 5,
      workDaysPerWeek: 5,
      partTimePercent: 100,
    });
    // 15 × 6/12 = 7.5
    expect(r.proRatedEntitlement).toBeCloseTo(7.5, 1);
    expect(r.fullYearEntitlement).toBe(15);
  });

  it('12 חודשים — שנה מלאה', () => {
    const r = calculatePartialYear({
      monthsWorked: 12,
      yearsOfService: 10,
      workDaysPerWeek: 5,
      partTimePercent: 100,
    });
    expect(r.proRatedEntitlement).toBe(r.fullYearEntitlement);
  });

  it('משרה 75%, 8 חודשים', () => {
    const r = calculatePartialYear({
      monthsWorked: 8,
      yearsOfService: 3,
      workDaysPerWeek: 5,
      partTimePercent: 75,
    });
    // 12 × 0.75 × (8/12) = 6
    expect(r.proRatedEntitlement).toBeCloseTo(6, 0);
  });

  it('ותק 14 שנים, 6 ימים — מקסימום זכאות', () => {
    const r = calculatePartialYear({
      monthsWorked: 12,
      yearsOfService: 14,
      workDaysPerWeek: 6,
      partTimePercent: 100,
    });
    expect(r.fullYearEntitlement).toBe(28);
    expect(r.proRatedEntitlement).toBe(28);
  });

  it('breakown string מכיל מידע מהחישוב', () => {
    const r = calculatePartialYear({
      monthsWorked: 6,
      yearsOfService: 5,
      workDaysPerWeek: 5,
      partTimePercent: 100,
    });
    expect(r.breakdown).toContain('6');
  });
});
