/**
 * בדיקות יחידה – מחשבון שכר מינימום 2026
 */

import { describe, it, expect } from 'vitest';
import {
  calculateMinimumWage,
  calculateNetMinimumWage,
  calculateYouthWage,
  checkCompliance,
  calculateLivingWageGap,
  HISTORICAL_MINIMUM_WAGES,
  OECD_MINIMUM_WAGES,
  SECTOR_MINIMUMS,
  AGE_MULTIPLIERS,
} from '@/lib/calculators/minimum-wage';

// ============================================================
// calculateMinimumWage — core
// ============================================================

describe('calculateMinimumWage – core', () => {
  it('שכר מינימום חודשי מלא לבוגר', () => {
    const r = calculateMinimumWage({ workType: 'monthly', ageGroup: 'adult', partTimePercentage: 100 });
    expect(r.minimumWageFullTime).toBe(6_443.85);
    expect(r.adjustedMinimumWage).toBe(6_443.85);
    expect(r.ageMultiplier).toBe(1.0);
    expect(r.wageTypeLabel).toBe('חודשי');
  });

  it('שכר מינימום שעתי 182 שעות', () => {
    const r = calculateMinimumWage({ workType: 'hourly-182', ageGroup: 'adult', partTimePercentage: 100 });
    expect(r.minimumWageFullTime).toBe(35.40);
    expect(r.adjustedMinimumWage).toBe(35.40);
    expect(r.wageTypeLabel).toBe('שעתי (182 שעות/חודש)');
  });

  it('שכר מינימום שעתי 186 שעות', () => {
    const r = calculateMinimumWage({ workType: 'hourly-186', ageGroup: 'adult', partTimePercentage: 100 });
    expect(r.minimumWageFullTime).toBe(34.64);
    expect(r.adjustedMinimumWage).toBe(34.64);
  });

  it('שכר מינימום יומי 5 ימים', () => {
    const r = calculateMinimumWage({ workType: 'daily-5', ageGroup: 'adult', partTimePercentage: 100 });
    expect(r.minimumWageFullTime).toBe(297.40);
    expect(r.adjustedMinimumWage).toBe(297.40);
  });

  it('שכר מינימום יומי 6 ימים', () => {
    const r = calculateMinimumWage({ workType: 'daily-6', ageGroup: 'adult', partTimePercentage: 100 });
    expect(r.minimumWageFullTime).toBe(257.75);
    expect(r.adjustedMinimumWage).toBe(257.75);
  });

  it('משרה חלקית 50%', () => {
    const r = calculateMinimumWage({ workType: 'monthly', ageGroup: 'adult', partTimePercentage: 50 });
    expect(r.adjustedMinimumWage).toBeCloseTo(6_443.85 * 0.5, 2);
  });

  it('אחוז משרה לא חל על שעתי', () => {
    // part-time percentage should NOT affect hourly rates
    const r = calculateMinimumWage({ workType: 'hourly-182', ageGroup: 'adult', partTimePercentage: 50 });
    expect(r.adjustedMinimumWage).toBe(35.40);
  });

  it('גיל 16-17: 70% מהמינימום', () => {
    const r = calculateMinimumWage({ workType: 'monthly', ageGroup: 'youth-16-17', partTimePercentage: 100 });
    expect(r.ageMultiplier).toBe(0.70);
    expect(r.adjustedMinimumWage).toBeCloseTo(6_443.85 * 0.70, 2);
  });

  it('גיל 17-18: 75% מהמינימום', () => {
    const r = calculateMinimumWage({ workType: 'monthly', ageGroup: 'youth-17-18', partTimePercentage: 100 });
    expect(r.ageMultiplier).toBe(0.75);
    expect(r.adjustedMinimumWage).toBeCloseTo(6_443.85 * 0.75, 2);
  });

  it('מתחת לגיל 16: 60% מהמינימום', () => {
    const r = calculateMinimumWage({ workType: 'monthly', ageGroup: 'under-16', partTimePercentage: 100 });
    expect(r.ageMultiplier).toBe(0.60);
    expect(r.adjustedMinimumWage).toBeCloseTo(6_443.85 * 0.60, 2);
  });
});

// ============================================================
// Compliance check
// ============================================================

describe('checkCompliance', () => {
  it('שכר תקין – בוגר משרה מלאה', () => {
    const r = checkCompliance({
      actualMonthlyWage: 7_000,
      hoursPerMonth: 182,
      ageGroup: 'adult',
      workType: 'monthly',
      partTimePercentage: 100,
    });
    expect(r.isCompliant).toBe(true);
    expect(r.shortfall).toBe(0);
    expect(r.severity).toBe('ok');
  });

  it('שכר נמוך מהמינימום – הפרה', () => {
    const r = checkCompliance({
      actualMonthlyWage: 5_000,
      hoursPerMonth: 182,
      ageGroup: 'adult',
      workType: 'monthly',
      partTimePercentage: 100,
    });
    expect(r.isCompliant).toBe(false);
    expect(r.shortfall).toBeCloseTo(6_443.85 - 5_000, 1);
    expect(r.severity).toBe('violation');
    expect(r.annualShortfall).toBeCloseTo((6_443.85 - 5_000) * 12, 0);
  });

  it('שכר קרוב לסף (warning)', () => {
    const r = checkCompliance({
      actualMonthlyWage: 6_300,
      hoursPerMonth: 182,
      ageGroup: 'adult',
      workType: 'monthly',
      partTimePercentage: 100,
    });
    expect(r.isCompliant).toBe(false);
    expect(r.severity).toBe('warning');
  });

  it('נוער 16-17 – שכר תואם', () => {
    const r = checkCompliance({
      actualMonthlyWage: 4_600,
      hoursPerMonth: 182,
      ageGroup: 'youth-16-17',
      workType: 'monthly',
      partTimePercentage: 100,
    });
    expect(r.isCompliant).toBe(true);
  });

  it('אחוז הכיסוי מחושב נכון', () => {
    const r = checkCompliance({
      actualMonthlyWage: 3_221.93, // 50% of minimum
      hoursPerMonth: 182,
      ageGroup: 'adult',
      workType: 'monthly',
      partTimePercentage: 50,
    });
    expect(r.isCompliant).toBe(true);
    expect(r.percentageOfMinimum).toBeCloseTo(100, 0);
  });
});

// ============================================================
// Net minimum wage
// ============================================================

describe('calculateNetMinimumWage', () => {
  it('שכר נטו לבוגר עם 2.25 נקודות זיכוי ופנסיה', () => {
    const r = calculateNetMinimumWage('adult', true, 2.25);
    expect(r.grossMonthly).toBe(6_443.85);
    expect(r.netMonthly).toBeGreaterThan(5_000);
    expect(r.netMonthly).toBeLessThan(r.grossMonthly);
    expect(r.netPercent).toBeGreaterThan(80);
    expect(r.effectiveTaxRate).toBeLessThan(25);
  });

  it('ניכוי פנסיה 6%', () => {
    const withPension = calculateNetMinimumWage('adult', true, 2.25);
    const noPension = calculateNetMinimumWage('adult', false, 2.25);
    expect(withPension.pensionDeduction).toBeCloseTo(6_443.85 * 0.06, 0);
    expect(noPension.pensionDeduction).toBe(0);
    expect(noPension.netMonthly).toBeGreaterThan(withPension.netMonthly);
  });

  it('שכר נטו שעתי לפי 182 שעות', () => {
    const r = calculateNetMinimumWage('adult', true, 2.25);
    expect(r.hourlyNet).toBeCloseTo(r.netMonthly / 182, 2);
  });

  it('פירוט ניכויים מסתכמים לסכום הנכון', () => {
    const r = calculateNetMinimumWage('adult', true, 2.25);
    const sumDeductions = r.incomeTax + r.nationalInsurance + r.pensionDeduction;
    expect(sumDeductions).toBeCloseTo(r.totalDeductions, 1);
    expect(r.grossMonthly - r.totalDeductions).toBeCloseTo(r.netMonthly, 1);
  });

  it('נוער 17-18: ברוטו 75%', () => {
    const r = calculateNetMinimumWage('youth-17-18', true, 2.25);
    expect(r.grossMonthly).toBeCloseTo(6_443.85 * 0.75, 0);
  });
});

// ============================================================
// Youth wage
// ============================================================

describe('calculateYouthWage', () => {
  it('גיל 16-17: 70%', () => {
    const r = calculateYouthWage('youth-16-17');
    expect(r.multiplier).toBe(0.70);
    // lib rounds to 2 decimal places: 6443.85 × 0.70 = 4510.695 → rounds to 4510.70
    expect(r.monthlyGross).toBeCloseTo(4_510.70, 1);
    expect(r.hourly182).toBeCloseTo(35.40 * 0.70, 1);
  });

  it('גיל 17-18: 75%', () => {
    const r = calculateYouthWage('youth-17-18');
    expect(r.multiplier).toBe(0.75);
    expect(r.monthlyGross).toBeCloseTo(6_443.85 * 0.75, 2);
  });

  it('מתחת ל-16: 60%', () => {
    const r = calculateYouthWage('under-16');
    expect(r.multiplier).toBe(0.60);
    expect(r.monthlyGross).toBeCloseTo(6_443.85 * 0.60, 2);
  });

  it('בוגר: 100%', () => {
    const r = calculateYouthWage('adult');
    expect(r.multiplier).toBe(1.0);
    expect(r.monthlyGross).toBe(6_443.85);
  });
});

// ============================================================
// Living wage
// ============================================================

describe('calculateLivingWageGap', () => {
  it('יחיד – עלות מחיה גבוהה משכר מינימום', () => {
    const r = calculateLivingWageGap(1, 'adult');
    expect(r.minimumWage).toBe(6_443.85);
    expect(r.estimatedLivingWage).toBeGreaterThan(6_443.85);
    expect(r.gap).toBeGreaterThan(0);
    expect(r.coveragePercent).toBeLessThan(100);
  });

  it('כיסוי עולה כי המשפחה גדולה – הפער גדל', () => {
    const single = calculateLivingWageGap(1, 'adult');
    const family4 = calculateLivingWageGap(4, 'adult');
    expect(family4.estimatedLivingWage).toBeGreaterThan(single.estimatedLivingWage);
    expect(family4.gap).toBeGreaterThan(single.gap);
  });

  it('פירוט הוצאות תקין', () => {
    const r = calculateLivingWageGap(1, 'adult');
    const sumBreakdown = r.breakdown.reduce((s, b) => s + b.monthlyEstimate, 0);
    expect(sumBreakdown).toBe(r.estimatedLivingWage);
  });

  it('נוער – ברוטו נמוך יותר, פער גדול יותר', () => {
    const adult = calculateLivingWageGap(1, 'adult');
    const youth = calculateLivingWageGap(1, 'youth-16-17');
    expect(youth.minimumWage).toBeLessThan(adult.minimumWage);
    expect(youth.gap).toBeGreaterThan(adult.gap);
  });
});

// ============================================================
// Historical data
// ============================================================

describe('HISTORICAL_MINIMUM_WAGES', () => {
  it('3 שנים קיימות', () => {
    expect(HISTORICAL_MINIMUM_WAGES).toHaveLength(3);
  });

  it('2026 עדכוני', () => {
    const entry2026 = HISTORICAL_MINIMUM_WAGES.find((h) => h.year === 2026);
    expect(entry2026).toBeDefined();
    expect(entry2026!.monthly).toBe(6_443.85);
    expect(entry2026!.hourly182).toBe(35.40);
  });

  it('שכר עולה משנה לשנה', () => {
    const wages = HISTORICAL_MINIMUM_WAGES.map((h) => h.monthly);
    for (let i = 1; i < wages.length; i++) {
      expect(wages[i]).toBeGreaterThan(wages[i - 1]);
    }
  });
});

// ============================================================
// OECD data integrity
// ============================================================

describe('OECD_MINIMUM_WAGES', () => {
  it('ישראל קיימת ברשימה', () => {
    const israel = OECD_MINIMUM_WAGES.find((c) => c.country.startsWith('ישראל'));
    expect(israel).toBeDefined();
    expect(israel!.monthlyLocal).toBe(6_443.85);
  });

  it('לפחות 10 מדינות', () => {
    expect(OECD_MINIMUM_WAGES.length).toBeGreaterThanOrEqual(10);
  });

  it('כל מדינה עם שדות חובה', () => {
    OECD_MINIMUM_WAGES.forEach((c) => {
      expect(c.country).toBeTruthy();
      expect(c.monthlyUSD).toBeGreaterThan(0);
      expect(c.monthlyLocal).toBeGreaterThan(0);
    });
  });
});

// ============================================================
// Sector minimums
// ============================================================

describe('SECTOR_MINIMUMS', () => {
  it('קיימים לפחות 5 ענפים', () => {
    expect(SECTOR_MINIMUMS.length).toBeGreaterThanOrEqual(5);
  });

  it('כל ענף מעל שכר מינימום חוקי או שווה לו', () => {
    SECTOR_MINIMUMS.forEach((s) => {
      expect(s.minimumMonthly).toBeGreaterThanOrEqual(6_443.85);
    });
  });
});

// ============================================================
// AGE_MULTIPLIERS integrity
// ============================================================

describe('AGE_MULTIPLIERS', () => {
  it('4 קבוצות גיל', () => {
    expect(Object.keys(AGE_MULTIPLIERS)).toHaveLength(4);
  });

  it('מכפילים עולים עם הגיל', () => {
    expect(AGE_MULTIPLIERS['under-16'].rate).toBeLessThan(AGE_MULTIPLIERS['youth-16-17'].rate);
    expect(AGE_MULTIPLIERS['youth-16-17'].rate).toBeLessThan(AGE_MULTIPLIERS['youth-17-18'].rate);
    expect(AGE_MULTIPLIERS['youth-17-18'].rate).toBeLessThan(AGE_MULTIPLIERS['adult'].rate);
  });

  it('בוגר = 100%', () => {
    expect(AGE_MULTIPLIERS['adult'].rate).toBe(1.0);
  });
});

// ============================================================
// Edge cases
// ============================================================

describe('Edge cases', () => {
  it('אחוז משרה 0 מוגבל ל-1%', () => {
    const r = calculateMinimumWage({ workType: 'monthly', ageGroup: 'adult', partTimePercentage: 0 });
    expect(r.adjustedMinimumWage).toBeCloseTo(6_443.85 * 0.01, 1);
  });

  it('אחוז משרה מעל 100 מוגבל ל-100%', () => {
    const r = calculateMinimumWage({ workType: 'monthly', ageGroup: 'adult', partTimePercentage: 150 });
    expect(r.adjustedMinimumWage).toBe(6_443.85);
  });

  it('שכר בפועל 0 – לא מחזיר shortfall', () => {
    const r = calculateMinimumWage({ workType: 'monthly', ageGroup: 'adult', partTimePercentage: 100, actualWage: 0 });
    expect(r.isAboveMinimum).toBe(true);
    expect(r.shortfall).toBe(0);
  });

  it('שכר בפועל תואם בדיוק – תקין', () => {
    const r = calculateMinimumWage({
      workType: 'monthly',
      ageGroup: 'adult',
      partTimePercentage: 100,
      actualWage: 6_443.85,
    });
    expect(r.isAboveMinimum).toBe(true);
    expect(r.shortfall).toBe(0);
  });

  it('הערות מכילות מידע על נוער', () => {
    const r = calculateMinimumWage({ workType: 'monthly', ageGroup: 'youth-16-17', partTimePercentage: 100 });
    const hasYouthNote = r.notes.some((n) => n.includes('70%') || n.includes('16-17'));
    expect(hasYouthNote).toBe(true);
  });

  it('הערות מכילות מידע על משרה חלקית', () => {
    const r = calculateMinimumWage({ workType: 'monthly', ageGroup: 'adult', partTimePercentage: 50 });
    const hasPartTimeNote = r.notes.some((n) => n.includes('50%'));
    expect(hasPartTimeNote).toBe(true);
  });
});
