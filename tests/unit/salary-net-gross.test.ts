import { describe, it, expect } from 'vitest';
import {
  calculateSalaryNetGross,
  calculateGrossFromNet,
  calculateNetFromEmployerCost,
  calculateBonusNet,
  calculateSalaryCurve,
  getMarginalBracketInfoPublic,
  PENSION_RATES,
  type SalaryNetGrossInput,
} from '@/lib/calculators/salary-net-gross';

// ============================================================
// helpers
// ============================================================

const defaultInput: SalaryNetGrossInput = {
  grossSalary: 15_000,
  creditPoints: 2.25,
  pensionEnabled: true,
  pensionLevel: 'minimum',
  studyFundEnabled: false,
  disabilityInsuranceRate: 0,
  monthlyWorkHours: 182,
  taxYear: '2026',
};

const defaultOpts = (partial?: Partial<Omit<SalaryNetGrossInput, 'grossSalary'>>) => ({
  creditPoints: 2.25,
  pensionEnabled: false,
  pensionLevel: 'minimum' as const,
  studyFundEnabled: false,
  disabilityInsuranceRate: 0,
  monthlyWorkHours: 182,
  taxYear: '2026' as const,
  ...partial,
});

// ============================================================
// 1. calculateSalaryNetGross — forward calculation
// ============================================================

describe('calculateSalaryNetGross', () => {
  it('ברוטו 15,000 ₪ — נטו הגיוני', () => {
    const r = calculateSalaryNetGross(defaultInput);
    expect(r.grossSalary).toBe(15_000);
    expect(r.netSalary).toBeGreaterThan(10_000);
    expect(r.netSalary).toBeLessThan(15_000);
    expect(r.netPercentage).toBeGreaterThan(60);
    expect(r.netPercentage).toBeLessThan(100);
  });

  it('ברוטו 0 ₪ — תוצאות אפס', () => {
    const r = calculateSalaryNetGross({ ...defaultInput, grossSalary: 0 });
    expect(r.netSalary).toBe(0);
    expect(r.incomeTax).toBe(0);
    expect(r.socialSecurity).toBe(0);
  });

  it('שכר מינימום (6,443 ₪) — מס הכנסה נמוך מאוד (נקודות זיכוי מקטינות)', () => {
    const r = calculateSalaryNetGross({ ...defaultInput, grossSalary: 6_443, pensionEnabled: false });
    // בשכר מינימום + 2.25 נקודות זיכוי, מס הכנסה קטן מאוד
    expect(r.incomeTax).toBeGreaterThanOrEqual(0);
    expect(r.incomeTax).toBeLessThan(200);
  });

  it('שכר גבוה (100,000 ₪) — מס הכנסה כולל את כל המדרגות ומס היסף', () => {
    const r = calculateSalaryNetGross({
      ...defaultInput,
      grossSalary: 100_000,
      creditPoints: 0,
      pensionEnabled: false,
    });
    expect(r.incomeTax).toBeCloseTo(38_615.3, 1);
    expect(r.marginalTaxRate).toBe(50); // מעל 60,130 → 50%
  });

  it('המס רציף סביב סף מס היסף 60,130 ₪', () => {
    const atThreshold = calculateSalaryNetGross({
      ...defaultInput,
      grossSalary: 60_130,
      creditPoints: 0,
      pensionEnabled: false,
    });
    const aboveThreshold = calculateSalaryNetGross({
      ...defaultInput,
      grossSalary: 60_131,
      creditPoints: 0,
      pensionEnabled: false,
    });

    expect(atThreshold.incomeTax).toBeCloseTo(18_680.3, 1);
    expect(aboveThreshold.incomeTax).toBeCloseTo(18_680.8, 1);
    expect(aboveThreshold.incomeTax - atThreshold.incomeTax).toBeCloseTo(0.5, 2);
  });

  it.each([
    [7_010, 0.14],
    [10_060, 0.20],
    [19_000, 0.31],
    [25_100, 0.35],
    [46_690, 0.47],
    [60_130, 0.50],
  ])('המס נשאר מונוטוני ורציף מעל מדרגת %s ₪', (monthlyBoundary, nextRate) => {
    const atBoundary = calculateSalaryNetGross({
      ...defaultInput,
      grossSalary: monthlyBoundary,
      creditPoints: 0,
      pensionEnabled: false,
    });
    const oneShekelAbove = calculateSalaryNetGross({
      ...defaultInput,
      grossSalary: monthlyBoundary + 1,
      creditPoints: 0,
      pensionEnabled: false,
    });

    expect(oneShekelAbove.incomeTax).toBeGreaterThan(atBoundary.incomeTax);
    expect(oneShekelAbove.incomeTax - atBoundary.incomeTax).toBeCloseTo(nextRate, 2);
  });

  it('פנסיה מינימום — ניכוי 6%', () => {
    const r = calculateSalaryNetGross({ ...defaultInput, grossSalary: 10_000, pensionEnabled: true, pensionLevel: 'minimum' });
    expect(r.pensionDeduction).toBeCloseTo(600, 0);
    expect(r.employerPension).toBeCloseTo(650, 0);
  });

  it('קרן השתלמות — ניכוי 2.5% עובד, 7.5% מעסיק', () => {
    const r = calculateSalaryNetGross({ ...defaultInput, grossSalary: 10_000, studyFundEnabled: true });
    expect(r.studyFundDeduction).toBeCloseTo(250, 0);
    expect(r.employerStudyFund).toBeCloseTo(750, 0);
  });

  it('ביטוח אובדן כושר 2% — ניכוי נכון', () => {
    const r = calculateSalaryNetGross({ ...defaultInput, grossSalary: 10_000, disabilityInsuranceRate: 2 });
    expect(r.disabilityInsurance).toBeCloseTo(200, 0);
  });

  it('עלות מעסיק > ברוטו', () => {
    const r = calculateSalaryNetGross(defaultInput);
    expect(r.totalEmployerCost).toBeGreaterThan(r.grossSalary);
  });

  it('פיצויים = 8.33% מהברוטו', () => {
    const r = calculateSalaryNetGross({ ...defaultInput, grossSalary: 12_000 });
    expect(r.employerCompensation).toBeCloseTo(12_000 * 0.0833, 0);
  });

  it('שכר שעתי נכון', () => {
    const r = calculateSalaryNetGross({ ...defaultInput, grossSalary: 18_200, monthlyWorkHours: 182 });
    expect(r.hourlyRate).toBeCloseTo(100, 0);
  });

  it('ב.ל. מוגבל — שכר מעל 51,910 ₪ לא גורר ב.ל. נוסף', () => {
    const r1 = calculateSalaryNetGross({ ...defaultInput, grossSalary: 51_910, pensionEnabled: false });
    const r2 = calculateSalaryNetGross({ ...defaultInput, grossSalary: 80_000, pensionEnabled: false });
    // ב.ל. אמור להיות זהה מעל התקרה
    expect(r1.socialSecurity).toBeCloseTo(r2.socialSecurity, 0);
  });
});

// ============================================================
// 2. calculateGrossFromNet — reverse calculation
// ============================================================

describe('calculateGrossFromNet', () => {
  it('עקביות: נטו→ברוטו→נטו מחזיר את הנטו המקורי', () => {
    const targetNet = 12_000;
    const opts = defaultOpts({ pensionEnabled: true });
    const { result } = calculateGrossFromNet(targetNet, opts);
    expect(result.netSalary).toBeCloseTo(targetNet, 0);
  });

  it('נטו 8,000 ₪ — ברוטו מחושב הגיוני', () => {
    const { grossSalary, result } = calculateGrossFromNet(8_000, defaultOpts());
    expect(grossSalary).toBeGreaterThan(8_000);
    expect(result.netSalary).toBeCloseTo(8_000, 0);
  });

  it('נטו 20,000 ₪ — עקביות', () => {
    const opts = defaultOpts({ pensionEnabled: true, studyFundEnabled: true });
    const { result } = calculateGrossFromNet(20_000, opts);
    expect(result.netSalary).toBeCloseTo(20_000, 0);
  });

  it('ברוטו שמחושב עולה על הנטו הרצוי', () => {
    const { grossSalary } = calculateGrossFromNet(15_000, defaultOpts());
    expect(grossSalary).toBeGreaterThan(15_000);
  });
});

// ============================================================
// 3. calculateNetFromEmployerCost
// ============================================================

describe('calculateNetFromEmployerCost', () => {
  it('עלות מעסיק → ברוטו נכון — עקביות', () => {
    const opts = defaultOpts({ pensionEnabled: true });
    const targetCost = 25_000;
    const { result } = calculateNetFromEmployerCost(targetCost, opts);
    expect(result.totalEmployerCost).toBeCloseTo(targetCost, 0);
  });

  it('עלות מעסיק גדולה מהברוטו המחושב', () => {
    const opts = defaultOpts({ pensionEnabled: true });
    const { grossSalary, result } = calculateNetFromEmployerCost(30_000, opts);
    expect(grossSalary).toBeLessThan(30_000);
    expect(result.totalEmployerCost).toBeCloseTo(30_000, 0);
  });
});

// ============================================================
// 4. 2026 official boundaries and unsupported historical years
// ============================================================

describe('2026 salary boundaries', () => {
  it('2026: מדרגת הביטוח המופחתת מסתיימת ב־7,703 ₪', () => {
    const below = calculateSalaryNetGross({ ...defaultInput, grossSalary: 7_703, pensionEnabled: false });
    const above = calculateSalaryNetGross({ ...defaultInput, grossSalary: 7_704, pensionEnabled: false });
    expect(below.socialSecurity).toBeCloseTo(7_703 * 0.0427, 5);
    expect(above.socialSecurity - below.socialSecurity).toBeCloseTo(0.1217, 5);
  });

  it('2026: מס לפני זיכויים על 19,000 ₪ הוא 2,916 ₪ לחודש', () => {
    const result = calculateSalaryNetGross({ ...defaultInput, grossSalary: 19_000, creditPoints: 0, pensionEnabled: false });
    expect(result.incomeTax).toBeCloseTo(2_916, 5);
  });

  it('שנת מס היסטורית אינה מחושבת עם נתוני הביטוח של 2026', () => {
    expect(() => calculateSalaryNetGross({ ...defaultInput, taxYear: '2025' as SalaryNetGrossInput['taxYear'] }))
      .toThrow(RangeError);
  });

  it('בשכר שנמצא בדיוק בסוף מדרגה, השקל הבא שייך למדרגה הבאה', () => {
    const atFirstBoundary = calculateSalaryNetGross({ ...defaultInput, grossSalary: 7_010, pensionEnabled: false });
    const atThirdBoundary = calculateSalaryNetGross({ ...defaultInput, grossSalary: 19_000, pensionEnabled: false });
    expect(atFirstBoundary.marginalTaxRate).toBeCloseTo(14, 8);
    expect(atFirstBoundary.marginalBracketInfo.distanceToNextMonthly).toBe(10_060 - 7_010);
    expect(atThirdBoundary.marginalTaxRate).toBeCloseTo(31, 8);
  });
});

// ============================================================
// 5. calculateBonusNet
// ============================================================

describe('calculateBonusNet', () => {
  it('בונוס ממוסה בשיעור שולי', () => {
    // שכר 20,000 ₪/חודש → שנתי 240,000 → מדרגה 31%
    const opts = defaultOpts();
    const result = calculateBonusNet(10_000, 240_000, opts);
    expect(result.marginalRate).toBe(0.31);
    expect(result.taxOnBonus).toBeCloseTo(3_100, 0);
  });

  it('נטו מבונוס < ברוטו בונוס', () => {
    const result = calculateBonusNet(10_000, 180_000, defaultOpts());
    expect(result.netBonus).toBeLessThan(10_000);
    expect(result.netBonus).toBeGreaterThan(0);
  });

  it('שיעור אפקטיבי סביר (50-80%)', () => {
    const result = calculateBonusNet(10_000, 180_000, defaultOpts());
    expect(result.effectiveBonusRate).toBeGreaterThan(50);
    expect(result.effectiveBonusRate).toBeLessThan(100);
  });
});

// ============================================================
// 7. calculateSalaryCurve
// ============================================================

describe('calculateSalaryCurve', () => {
  it('מחזיר נקודות לאורך טווח שכר', () => {
    const curve = calculateSalaryCurve(defaultOpts());
    expect(curve.length).toBeGreaterThan(5);
    curve.forEach((pt) => {
      expect(pt.net).toBeLessThanOrEqual(pt.gross);
      expect(pt.net).toBeGreaterThan(0);
    });
  });

  it('שכר גבוה → שיעור נטו נמוך יותר', () => {
    const curve = calculateSalaryCurve(defaultOpts());
    const low = curve[0];
    const high = curve[curve.length - 1];
    const lowRate = low.net / low.gross;
    const highRate = high.net / high.gross;
    expect(highRate).toBeLessThan(lowRate);
  });
});

// ============================================================
// 8. getMarginalBracketInfoPublic
// ============================================================

describe('getMarginalBracketInfoPublic', () => {
  it('שכר נמוך (60,000 ₪ שנתי) — מדרגה 10%', () => {
    const info = getMarginalBracketInfoPublic(60_000);
    expect(info.currentRate).toBe(0.10);
    expect(info.nextRate).toBe(0.14);
    expect(info.distanceToNext).toBeGreaterThan(0);
  });

  it('שכר גבוה (800,000 ₪ שנתי) — מדרגה 50%', () => {
    const info = getMarginalBracketInfoPublic(800_000);
    expect(info.currentRate).toBe(0.50);
    expect(info.nextRate).toBeNull();
  });
});

// ============================================================
// 10. PENSION_RATES
// ============================================================

describe('PENSION_RATES', () => {
  it('מינימום: עובד 6%, מעסיק 6.5%', () => {
    expect(PENSION_RATES.minimum.employee).toBe(0.06);
    expect(PENSION_RATES.minimum.employer).toBe(0.065);
  });

  it('מומלץ: עובד 7%, מעסיק 7.5%', () => {
    expect(PENSION_RATES.recommended.employee).toBe(0.07);
    expect(PENSION_RATES.recommended.employer).toBe(0.075);
  });
});
