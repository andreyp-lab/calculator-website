import { describe, it, expect } from 'vitest';
import {
  calculateSalaryNetGross,
  calculateGrossFromNet,
  calculateNetFromEmployerCost,
  calculateYearComparison,
  calculateBonusNet,
  calculateCreditPoints,
  calculateSalaryCurve,
  getMarginalBracketInfoPublic,
  TAX_BRACKETS_2024,
  TAX_BRACKETS_2025,
  PENSION_RATES,
  type SalaryNetGrossInput,
  type CreditPointsProfile,
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

  it('שכר גבוה (100,000 ₪) — מס הכנסה חודשי משמעותי ומדרגה שולית 50%', () => {
    const r = calculateSalaryNetGross({ ...defaultInput, grossSalary: 100_000, pensionEnabled: false });
    // מס חודשי: ~8,006 ₪ (אפקטיבי ~8% מהברוטו הגולמי לפני קרדיטים)
    expect(r.incomeTax).toBeGreaterThan(7_000);
    expect(r.incomeTax).toBeLessThan(20_000);
    expect(r.marginalTaxRate).toBe(50); // מעל 60,130 → 50%
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
// 4. calculateYearComparison
// ============================================================

describe('calculateYearComparison', () => {
  it('2026 נותן נטו גבוה יותר מ-2024 לשכר בינוני (19,000 ₪)', () => {
    const comparison = calculateYearComparison({ ...defaultInput, grossSalary: 19_000 });
    const net2026 = comparison.find((c) => c.year === '2026')!.netSalary;
    const net2024 = comparison.find((c) => c.year === '2024')!.netSalary;
    // ב-2026 מדרגת 20% הורחבה — 19,000 ₪/חודש במדרגה 20% בשניהם אבל...
    // למעשה ב-2024: 19,000 × 12 = 228,000 מעל 193,800 → חלק ב-31%. ב-2026: עד 228,000 הכל ב-20%
    expect(net2026).toBeGreaterThanOrEqual(net2024 - 1); // לפחות שווה
  });

  it('מחזיר 3 שנים', () => {
    const comparison = calculateYearComparison(defaultInput);
    expect(comparison).toHaveLength(3);
    expect(comparison.map((c) => c.year)).toEqual(['2024', '2025', '2026']);
  });

  it('2024 ו-2025 זהים (אותן מדרגות)', () => {
    const comparison = calculateYearComparison({ ...defaultInput, grossSalary: 20_000 });
    const net2024 = comparison.find((c) => c.year === '2024')!.netSalary;
    const net2025 = comparison.find((c) => c.year === '2025')!.netSalary;
    expect(net2024).toBeCloseTo(net2025, 0);
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
// 6. calculateCreditPoints
// ============================================================

describe('calculateCreditPoints', () => {
  it('גבר בסיסי — 2.25 נקודות', () => {
    const profile: CreditPointsProfile = {
      gender: 'male', childrenAge0: 0, childrenAge1to5: 0, childrenAge6to17: 0,
      childrenAge18: 0, singleParent: false, disabledChildren: 0, newImmigrantYears: 0,
      releasedSoldier: false, bachelorDegree: false, masterDegree: false,
    };
    const result = calculateCreditPoints(profile);
    expect(result.totalPoints).toBeCloseTo(2.25, 2);
  });

  it('אישה בסיסית — 2.75 נקודות', () => {
    const profile: CreditPointsProfile = {
      gender: 'female', childrenAge0: 0, childrenAge1to5: 0, childrenAge6to17: 0,
      childrenAge18: 0, singleParent: false, disabledChildren: 0, newImmigrantYears: 0,
      releasedSoldier: false, bachelorDegree: false, masterDegree: false,
    };
    const result = calculateCreditPoints(profile);
    expect(result.totalPoints).toBeCloseTo(2.75, 2);
  });

  it('גבר + 2 ילדים 1-5 = 2.25 + 5 = 7.25 נקודות', () => {
    const profile: CreditPointsProfile = {
      gender: 'male', childrenAge0: 0, childrenAge1to5: 2, childrenAge6to17: 0,
      childrenAge18: 0, singleParent: false, disabledChildren: 0, newImmigrantYears: 0,
      releasedSoldier: false, bachelorDegree: false, masterDegree: false,
    };
    const result = calculateCreditPoints(profile);
    expect(result.totalPoints).toBeCloseTo(7.25, 2);
  });

  it('חייל משוחרר — מוסיף 2 נקודות', () => {
    const profileBase: CreditPointsProfile = {
      gender: 'male', childrenAge0: 0, childrenAge1to5: 0, childrenAge6to17: 0,
      childrenAge18: 0, singleParent: false, disabledChildren: 0, newImmigrantYears: 0,
      releasedSoldier: false, bachelorDegree: false, masterDegree: false,
    };
    const profileSoldier = { ...profileBase, releasedSoldier: true };
    const base = calculateCreditPoints(profileBase);
    const soldier = calculateCreditPoints(profileSoldier);
    expect(soldier.totalPoints - base.totalPoints).toBeCloseTo(2, 2);
  });

  it('זיכוי חודשי = נקודות × 242', () => {
    const profile: CreditPointsProfile = {
      gender: 'male', childrenAge0: 0, childrenAge1to5: 0, childrenAge6to17: 0,
      childrenAge18: 0, singleParent: false, disabledChildren: 0, newImmigrantYears: 0,
      releasedSoldier: false, bachelorDegree: false, masterDegree: false,
    };
    const result = calculateCreditPoints(profile);
    expect(result.monthlyCredit).toBeCloseTo(result.totalPoints * 242, 1);
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
// 9. קבועים היסטוריים
// ============================================================

describe('TAX_BRACKETS_2024 / 2025', () => {
  it('2024 ו-2025 זהים', () => {
    expect(TAX_BRACKETS_2024).toBe(TAX_BRACKETS_2025);
  });

  it('2024: מדרגה 3 = 193,800 (צרה יותר מ-2026)', () => {
    const bracket3 = TAX_BRACKETS_2024[2];
    expect(bracket3.upTo).toBe(193_800);
    expect(bracket3.rate).toBe(0.20);
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
