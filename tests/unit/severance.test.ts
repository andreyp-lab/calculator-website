import { describe, it, expect } from 'vitest';
import { calculateSeverance } from '@/lib/calculators/severance';

describe('calculateSeverance', () => {
  it('עובד 5 שנים, שכר 10,000 - פטור מלא ממס', () => {
    const result = calculateSeverance({
      startDate: '2020-01-01',
      endDate: '2025-01-01',
      monthlySalary: 10000,
      employmentType: 'monthly',
      partTimePercentage: 100,
      hasSection14: false,
      section14Percentage: 0,
      terminationReason: 'fired',
    });

    expect(result.isEligible).toBe(true);
    expect(result.yearsOfService).toBeCloseTo(5, 1);
    expect(result.baseSeverance).toBeCloseTo(50_000, -2);
    // 50,000 פטור מלא (תקרה 13,750 × 5 = 68,750 > 50,000)
    expect(result.taxableAmount).toBe(0);
  });

  it('עובד פחות משנה - לא זכאי', () => {
    const result = calculateSeverance({
      startDate: '2024-06-01',
      endDate: '2025-01-01',
      monthlySalary: 10000,
      employmentType: 'monthly',
      partTimePercentage: 100,
      hasSection14: false,
      section14Percentage: 0,
      terminationReason: 'fired',
    });

    expect(result.isEligible).toBe(false);
    expect(result.ineligibilityReason).toContain('שנה לפחות');
  });

  it('עובד שעתי 50% משרה - שכר מתואם', () => {
    const result = calculateSeverance({
      startDate: '2020-01-01',
      endDate: '2025-01-01',
      monthlySalary: 12000,
      employmentType: 'hourly',
      partTimePercentage: 50,
      hasSection14: false,
      section14Percentage: 0,
      terminationReason: 'fired',
    });

    expect(result.isEligible).toBe(true);
    expect(result.adjustedSalary).toBeCloseTo(6000, 0);
    expect(result.baseSeverance).toBeCloseTo(30_000, -2); // 6000 × 5
  });

  it('התפטרות רגילה - לא זכאי', () => {
    const result = calculateSeverance({
      startDate: '2020-01-01',
      endDate: '2025-01-01',
      monthlySalary: 10000,
      employmentType: 'monthly',
      partTimePercentage: 100,
      hasSection14: false,
      section14Percentage: 0,
      terminationReason: 'resigned',
    });

    expect(result.isEligible).toBe(false);
    expect(result.ineligibilityReason).toContain('התפטרות');
  });

  it('שכר גבוה - חלק חייב במס', () => {
    // עובד 10 שנים ב-30,000 ₪ = 300,000 ₪ פיצוי
    // תקרת פטור: 13,750 × 10 = 137,500
    // או 30,000 × 1.5 × 10 = 450,000
    // הפטור הוא הנמוך = 137,500
    // חייב במס: 300,000 - 137,500 = 162,500
    const result = calculateSeverance({
      startDate: '2015-01-01',
      endDate: '2025-01-01',
      monthlySalary: 30000,
      employmentType: 'monthly',
      partTimePercentage: 100,
      hasSection14: false,
      section14Percentage: 0,
      terminationReason: 'fired',
    });

    expect(result.isEligible).toBe(true);
    expect(result.baseSeverance).toBeCloseTo(300_000, -2);
    expect(result.taxExemptAmount).toBeCloseTo(137_500, -2);
    expect(result.taxableAmount).toBeCloseTo(162_500, -2);
  });

  it('תאריך סיום לפני תחילה - שגוי', () => {
    const result = calculateSeverance({
      startDate: '2025-01-01',
      endDate: '2024-01-01',
      monthlySalary: 10000,
      employmentType: 'monthly',
      partTimePercentage: 100,
      hasSection14: false,
      section14Percentage: 0,
      terminationReason: 'fired',
    });

    expect(result.isEligible).toBe(false);
  });
});
