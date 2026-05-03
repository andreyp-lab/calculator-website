import { describe, it, expect } from 'vitest';
import { calculateIncomeTax } from '@/lib/calculators/income-tax';
import { calculateAnnualIncomeTax } from '@/lib/constants/tax-2026';

describe('calculateAnnualIncomeTax (פונקציה גרעינית)', () => {
  it('שכר נמוך - מדרגה אחת בלבד (10%)', () => {
    // 50,000 ₪ שנתי - הכל במדרגה 1
    const tax = calculateAnnualIncomeTax(50_000);
    expect(tax).toBeCloseTo(5_000, 0); // 50,000 × 10%
  });

  it('שכר גבולי בדיוק על תקרת מדרגה 1', () => {
    const tax = calculateAnnualIncomeTax(84_120);
    expect(tax).toBeCloseTo(8_412, 0);
  });

  it('שכר במדרגות 1+2', () => {
    // 100,000 - 84,120 במדרגה 1 (8,412) + 15,880 במדרגה 2 (14%)
    const tax = calculateAnnualIncomeTax(100_000);
    expect(tax).toBeCloseTo(8_412 + 15_880 * 0.14, 0);
  });

  it('שכר במדרגה 3 (ריווח 2026)', () => {
    // 200,000 שנתי - ב-2026 זה במדרגה 3 (20%)
    // 84,120 × 10% + (120,720 - 84,120) × 14% + (200,000 - 120,720) × 20%
    const expected = 84_120 * 0.1 + (120_720 - 84_120) * 0.14 + (200_000 - 120_720) * 0.2;
    const tax = calculateAnnualIncomeTax(200_000);
    expect(tax).toBeCloseTo(expected, 0);
  });

  it('שכר 0 - אין מס', () => {
    expect(calculateAnnualIncomeTax(0)).toBe(0);
  });

  it('שכר גבוה מאוד - מדרגה 7 (מס יסף)', () => {
    const tax = calculateAnnualIncomeTax(1_000_000);
    expect(tax).toBeGreaterThan(300_000); // לפחות 30% אפקטיבי
  });
});

describe('calculateIncomeTax (מחשבון מלא)', () => {
  it('שכר 15,000 ₪/חודש עם 2.25 נקודות - חישוב סטנדרטי', () => {
    const result = calculateIncomeTax({
      monthlySalary: 15_000,
      creditPoints: 2.25,
      hasPension: false,
      pensionPercentage: 0,
    });

    expect(result.monthlyGross).toBe(15_000);
    expect(result.annualGross).toBe(180_000);
    expect(result.creditPoints).toBe(2.25);
    expect(result.monthlyCreditAmount).toBeCloseTo(544.5, 0); // 2.25 × 242
    // נטו אמור להיות בסביבות 12,000-12,500
    expect(result.monthlyNet).toBeGreaterThan(11_500);
    expect(result.monthlyNet).toBeLessThan(13_000);
  });

  it('שכר מינימום - מס נמוך/0', () => {
    const result = calculateIncomeTax({
      monthlySalary: 6_500,
      creditPoints: 2.25,
      hasPension: false,
      pensionPercentage: 0,
    });

    // 6,500 × 12 = 78,000 שנתי - מדרגה 1 בלבד
    // מס = 7,800, זיכוי = 6,534
    // מס נטו ~ 1,266/שנה ~ 105/חודש
    expect(result.monthlyTaxAfterCredits).toBeLessThan(200);
  });

  it('עם הפרשה לפנסיה - הנטו יורד', () => {
    const withoutPension = calculateIncomeTax({
      monthlySalary: 15_000,
      creditPoints: 2.25,
      hasPension: false,
      pensionPercentage: 0,
    });

    const withPension = calculateIncomeTax({
      monthlySalary: 15_000,
      creditPoints: 2.25,
      hasPension: true,
      pensionPercentage: 6,
    });

    // עם פנסיה הנטו צריך להיות 900 ₪ פחות (6% × 15,000)
    expect(withPension.monthlyNet).toBeCloseTo(withoutPension.monthlyNet - 900, 0);
  });

  it('שכר 0 - הכל 0', () => {
    const result = calculateIncomeTax({
      monthlySalary: 0,
      creditPoints: 2.25,
      hasPension: false,
      pensionPercentage: 0,
    });

    expect(result.monthlyTaxAfterCredits).toBe(0);
    expect(result.monthlySocialSecurity).toBe(0);
    expect(result.monthlyNet).toBe(0);
  });

  it('שכר מעל תקרת ב.ל. - לא נוסף ניכוי', () => {
    const result = calculateIncomeTax({
      monthlySalary: 60_000,
      creditPoints: 2.25,
      hasPension: false,
      pensionPercentage: 0,
    });

    // ב.ל. + בריאות צריך להיות מקסימלי - על התקרה (51,910)
    // 7,522 × 4.27% + 44,388 × 12.17% ≈ 5,723
    expect(result.monthlySocialSecurity).toBeCloseTo(5_723, -1);
  });
});
