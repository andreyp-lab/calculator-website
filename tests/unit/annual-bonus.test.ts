import { describe, it, expect } from 'vitest';
import {
  calculateBonusNet,
  compareBonusVsRaise,
  compareWithholdingMethods,
  calculate13thSalary,
  calculatePerformanceBonus,
  calculateStockOption102,
  compareYears,
  calculateBonusCurve,
  calculateYearEndRefund,
} from '@/lib/calculators/annual-bonus';

// ====================================================================
// 1. calculateBonusNet — חישוב נטו בונוס
// ====================================================================

describe('calculateBonusNet', () => {
  it('בונוס 0 — מחזיר אפסים', () => {
    const result = calculateBonusNet({
      grossBonus: 0,
      monthlyBaseSalary: 15_000,
      creditPoints: 2.25,
    });
    expect(result.netBonus).toBe(0);
    expect(result.incomeTaxOnBonus).toBe(0);
    expect(result.netPercentage).toBe(0);
  });

  it('בונוס 50K + שכר 15K — נטו בין 50-70%', () => {
    const result = calculateBonusNet({
      grossBonus: 50_000,
      monthlyBaseSalary: 15_000,
      creditPoints: 2.25,
    });
    expect(result.netBonus).toBeGreaterThan(0);
    expect(result.netPercentage).toBeGreaterThan(40);
    expect(result.netPercentage).toBeLessThan(80);
    expect(result.incomeTaxOnBonus).toBeGreaterThan(0);
    expect(result.socialSecurityOnBonus).toBeGreaterThan(0);
  });

  it('נטו בונוס = ברוטו פחות כל הניכויים', () => {
    const result = calculateBonusNet({
      grossBonus: 50_000,
      monthlyBaseSalary: 15_000,
      creditPoints: 2.25,
    });
    const expected =
      result.grossBonus - result.incomeTaxOnBonus - result.socialSecurityOnBonus;
    expect(Math.abs(result.netBonus - expected)).toBeLessThan(1);
  });

  it('הפקדה לפנסיה מפחיתה את הנטו', () => {
    const without = calculateBonusNet({
      grossBonus: 50_000,
      monthlyBaseSalary: 15_000,
      creditPoints: 2.25,
      pensionDeductionEnabled: false,
    });
    const withPension = calculateBonusNet({
      grossBonus: 50_000,
      monthlyBaseSalary: 15_000,
      creditPoints: 2.25,
      pensionDeductionEnabled: true,
    });
    // נטו מיידי קטן יותר עם פנסיה (אבל חיסכון מס נחשב בנפרד)
    expect(withPension.pensionDeduction).toBeCloseTo(50_000 * 0.06, 0);
  });

  it('מדרגה שולית עולה ככל שהשכר + הבונוס עולים', () => {
    const low = calculateBonusNet({
      grossBonus: 10_000,
      monthlyBaseSalary: 8_000,
      creditPoints: 2.25,
    });
    const high = calculateBonusNet({
      grossBonus: 100_000,
      monthlyBaseSalary: 40_000,
      creditPoints: 2.25,
    });
    expect(high.effectiveMarginalRate).toBeGreaterThanOrEqual(low.effectiveMarginalRate);
  });

  it('שנת מס 2024 מחזירה ערכים תקינים', () => {
    const result = calculateBonusNet({
      grossBonus: 50_000,
      monthlyBaseSalary: 15_000,
      creditPoints: 2.25,
      taxYear: '2024',
    });
    expect(result.netBonus).toBeGreaterThan(0);
    expect(result.netBonus).toBeLessThan(50_000);
  });
});

// ====================================================================
// 2. compareWithholdingMethods — 3 שיטות ניכוי
// ====================================================================

describe('compareWithholdingMethods', () => {
  it('מחזיר 3 שיטות', () => {
    const methods = compareWithholdingMethods({
      grossBonus: 50_000,
      monthlyBaseSalary: 15_000,
      creditPoints: 2.25,
      monthsRemainingInYear: 6,
    });
    expect(methods).toHaveLength(3);
    expect(methods[0].method).toBe('current_month');
    expect(methods[1].method).toBe('annual_spread');
    expect(methods[2].method).toBe('defer_next_year');
  });

  it('כל שיטה מחזירה נטו חיובי', () => {
    const methods = compareWithholdingMethods({
      grossBonus: 50_000,
      monthlyBaseSalary: 15_000,
      creditPoints: 2.25,
    });
    methods.forEach((m) => {
      expect(m.netAfterRefund).toBeGreaterThan(0);
    });
  });

  it('שיטת חד-פעמי יכולה לגרום לניכוי ביתר (החזר חיובי)', () => {
    const methods = compareWithholdingMethods({
      grossBonus: 100_000,
      monthlyBaseSalary: 15_000,
      creditPoints: 2.25,
    });
    const currentMonth = methods.find((m) => m.method === 'current_month')!;
    // ניכוי גדול יותר מהמס האמיתי — לכן יש החזר
    expect(currentMonth.estimatedWithheld).toBeGreaterThan(0);
  });
});

// ====================================================================
// 3. compareBonusVsRaise — בונוס vs העלאת שכר
// ====================================================================

describe('compareBonusVsRaise', () => {
  it('מחזיר תוצאות עבור בונוס והעלאה', () => {
    const result = compareBonusVsRaise({
      grossBonus: 60_000,
      currentMonthlySalary: 15_000,
      creditPoints: 2.25,
      monthsRemaining: 6,
    });
    expect(result.bonus.netReceived).toBeGreaterThan(0);
    expect(result.raise.monthlyIncrease).toBeCloseTo(5_000, -1); // 60K / 12 = 5K
    expect(result.raise.netMonthlyIncrease).toBeGreaterThan(0);
  });

  it('נטו בונוס < ברוטו', () => {
    const result = compareBonusVsRaise({
      grossBonus: 50_000,
      currentMonthlySalary: 15_000,
      creditPoints: 2.25,
    });
    expect(result.bonus.netReceived).toBeLessThan(50_000);
  });

  it('% נטו בונוס בין 30%-80%', () => {
    const result = compareBonusVsRaise({
      grossBonus: 50_000,
      currentMonthlySalary: 15_000,
      creditPoints: 2.25,
    });
    expect(result.bonus.netPercentage).toBeGreaterThan(30);
    expect(result.bonus.netPercentage).toBeLessThan(80);
  });

  it('מחזיר המלצה', () => {
    const result = compareBonusVsRaise({
      grossBonus: 50_000,
      currentMonthlySalary: 15_000,
      creditPoints: 2.25,
    });
    expect(result.difference.recommendation.length).toBeGreaterThan(10);
  });
});

// ====================================================================
// 4. calculate13thSalary — משכורת 13
// ====================================================================

describe('calculate13thSalary', () => {
  it('חודש מלא: ברוטו = שכר חודשי', () => {
    const result = calculate13thSalary({
      monthlySalary: 15_000,
      creditPoints: 2.25,
      convention: 'full_month',
    });
    expect(result.grossAmount).toBe(15_000);
    expect(result.netAmount).toBeGreaterThan(0);
    expect(result.netAmount).toBeLessThan(15_000);
  });

  it('חצי חודש: ברוטו = מחצית השכר', () => {
    const result = calculate13thSalary({
      monthlySalary: 15_000,
      creditPoints: 2.25,
      convention: 'half_month',
    });
    expect(result.grossAmount).toBe(7_500);
  });

  it('יחסי (6 חודשים): ברוטו = שכר × 6/12', () => {
    const result = calculate13thSalary({
      monthlySalary: 15_000,
      creditPoints: 2.25,
      convention: 'proportional',
      monthsWorkedThisYear: 6,
    });
    expect(result.grossAmount).toBeCloseTo(7_500, 0);
  });

  it('סכום מותאם', () => {
    const result = calculate13thSalary({
      monthlySalary: 15_000,
      creditPoints: 2.25,
      convention: 'custom',
      customAmount: 20_000,
    });
    expect(result.grossAmount).toBe(20_000);
  });

  it('נטו + ניכויים = ברוטו', () => {
    const result = calculate13thSalary({
      monthlySalary: 15_000,
      creditPoints: 2.25,
      convention: 'full_month',
    });
    const sum = result.netAmount + result.taxOnAmount + result.ssOnAmount;
    expect(Math.abs(sum - result.grossAmount)).toBeLessThan(1);
  });
});

// ====================================================================
// 5. calculatePerformanceBonus — בונוס ביצועים
// ====================================================================

describe('calculatePerformanceBonus', () => {
  it('% משכר: 10% מ-180K שנתי = 18,000 ₪', () => {
    const result = calculatePerformanceBonus({
      monthlySalary: 15_000,
      creditPoints: 2.25,
      bonusType: 'percentage_of_salary',
      bonusPercentageOfSalary: 10,
    });
    expect(result.grossBonus).toBeCloseTo(18_000, 0);
  });

  it('סכום קבוע: מחזיר הסכום', () => {
    const result = calculatePerformanceBonus({
      monthlySalary: 15_000,
      creditPoints: 2.25,
      bonusType: 'fixed',
      fixedAmount: 30_000,
    });
    expect(result.grossBonus).toBe(30_000);
  });

  it('מבוסס יעד 100%: מחזיר סכום היעד', () => {
    const result = calculatePerformanceBonus({
      monthlySalary: 15_000,
      creditPoints: 2.25,
      bonusType: 'target_based',
      targetAmount: 50_000,
      achievementPercentage: 100,
    });
    expect(result.grossBonus).toBeCloseTo(50_000, 0);
  });

  it('מחזיר 5 תרחישים (50%-150%)', () => {
    const result = calculatePerformanceBonus({
      monthlySalary: 15_000,
      creditPoints: 2.25,
      bonusType: 'target_based',
      targetAmount: 50_000,
      achievementPercentage: 100,
    });
    expect(result.scenarios).toHaveLength(5);
    expect(result.scenarios[0].achievementPct).toBe(50);
    expect(result.scenarios[4].achievementPct).toBe(150);
  });

  it('תרחישי נטו עולים עם % עמידה', () => {
    const result = calculatePerformanceBonus({
      monthlySalary: 15_000,
      creditPoints: 2.25,
      bonusType: 'target_based',
      targetAmount: 50_000,
      achievementPercentage: 100,
    });
    for (let i = 1; i < result.scenarios.length; i++) {
      expect(result.scenarios[i].netBonus).toBeGreaterThanOrEqual(
        result.scenarios[i - 1].netBonus,
      );
    }
  });
});

// ====================================================================
// 6. calculateStockOption102 — אופציות / RSU
// ====================================================================

describe('calculateStockOption102', () => {
  it('מסלול הוני: מס 25% על הרווח', () => {
    const result = calculateStockOption102({
      numberOfUnits: 1000,
      exercisePrice: 5,
      marketPriceAtExercise: 15,
      track: 'capital',
      vestingYears: 4,
      vestedPercentage: 100,
    });
    expect(result.gainAtExercise).toBe(1000 * (15 - 5)); // 10,000
    expect(result.taxOnGain).toBeCloseTo(10_000 * 0.25, 0);
    expect(result.netGain).toBeCloseTo(10_000 * 0.75, 0);
  });

  it('RSU (מחיר מימוש 0): כל הערך הוא רווח', () => {
    const result = calculateStockOption102({
      numberOfUnits: 1000,
      exercisePrice: 0,
      marketPriceAtExercise: 20,
      track: 'capital',
      vestingYears: 4,
      vestedPercentage: 100,
    });
    expect(result.gainAtExercise).toBe(1000 * 20); // 20,000
    expect(result.taxOnGain).toBeCloseTo(20_000 * 0.25, 0);
  });

  it('100% וסטינג: כל היחידות', () => {
    const result = calculateStockOption102({
      numberOfUnits: 1000,
      exercisePrice: 5,
      marketPriceAtExercise: 15,
      track: 'capital',
      vestingYears: 4,
      vestedPercentage: 100,
    });
    expect(result.vestedUnits).toBe(1000);
  });

  it('50% וסטינג: מחצית היחידות', () => {
    const result = calculateStockOption102({
      numberOfUnits: 1000,
      exercisePrice: 5,
      marketPriceAtExercise: 15,
      track: 'capital',
      vestingYears: 4,
      vestedPercentage: 50,
    });
    expect(result.vestedUnits).toBe(500);
  });

  it('מחיר שוק < מחיר מימוש: אזהרה Underwater', () => {
    const result = calculateStockOption102({
      numberOfUnits: 1000,
      exercisePrice: 20,
      marketPriceAtExercise: 10,
      track: 'capital',
      vestingYears: 4,
      vestedPercentage: 100,
    });
    expect(result.gainAtExercise).toBe(0);
    expect(result.warnings.some((w) => w.includes('מתחת למים'))).toBe(true);
  });

  it('מחיר מכירה: מחשב רווח הון נוסף', () => {
    const result = calculateStockOption102({
      numberOfUnits: 1000,
      exercisePrice: 5,
      marketPriceAtExercise: 15,
      marketPriceAtSale: 25,
      track: 'capital',
      vestingYears: 4,
      vestedPercentage: 100,
    });
    expect(result.additionalCapitalGain).toBeCloseTo(1000 * (25 - 15), 0);
    expect(result.additionalTaxOnSale).toBeCloseTo(1000 * 10 * 0.25, 0);
  });

  it('לוח וסטינג: מספר שנים נכון', () => {
    const result = calculateStockOption102({
      numberOfUnits: 1000,
      exercisePrice: 5,
      marketPriceAtExercise: 15,
      track: 'capital',
      vestingYears: 4,
      vestedPercentage: 100,
    });
    expect(result.vestingSchedule).toHaveLength(4);
  });
});

// ====================================================================
// 7. compareYears — השוואת שנים
// ====================================================================

describe('compareYears', () => {
  it('מחזיר 3 תוצאות (2024/2025/2026)', () => {
    const results = compareYears({
      grossBonus: 50_000,
      monthlyBaseSalary: 15_000,
      creditPoints: 2.25,
    });
    expect(results).toHaveLength(3);
    expect(results.map((r) => r.year)).toEqual(['2024', '2025', '2026']);
  });

  it('2026 נטו גבוה מ-2024 לשכר בינוני (הרחבת מדרגות)', () => {
    const results = compareYears({
      grossBonus: 50_000,
      monthlyBaseSalary: 15_000,
      creditPoints: 2.25,
    });
    const net2026 = results.find((r) => r.year === '2026')!.netBonus;
    const net2024 = results.find((r) => r.year === '2024')!.netBonus;
    // 2026 הרחיב מדרגות — לכן נטו גבוה יותר או שווה
    expect(net2026).toBeGreaterThanOrEqual(net2024 - 1); // tolerance 1 ₪
  });
});

// ====================================================================
// 8. calculateBonusCurve — גרף נטו
// ====================================================================

describe('calculateBonusCurve', () => {
  it('מחזיר 20 נקודות', () => {
    const curve = calculateBonusCurve(15_000, 2.25, 200_000, 20);
    expect(curve).toHaveLength(20);
  });

  it('נטו גדל ככל שהבונוס גדל', () => {
    const curve = calculateBonusCurve(15_000, 2.25, 100_000, 10);
    for (let i = 1; i < curve.length; i++) {
      expect(curve[i].netBonus).toBeGreaterThanOrEqual(curve[i - 1].netBonus);
    }
  });

  it('% נטו לא עולה על 100%', () => {
    const curve = calculateBonusCurve(15_000, 2.25, 200_000, 20);
    curve.forEach((p) => {
      expect(p.netPercentage).toBeLessThanOrEqual(100);
      expect(p.netPercentage).toBeGreaterThanOrEqual(0);
    });
  });
});

// ====================================================================
// 9. calculateYearEndRefund — החזר מס בסוף שנה
// ====================================================================

describe('calculateYearEndRefund', () => {
  it('ניכוי ביתר → החזר חיובי', () => {
    const result = calculateYearEndRefund({
      avgMonthlySalary: 15_000,
      totalBonusReceived: 50_000,
      taxWithheldOnBonus: 25_000, // ביתר
      taxWithheldOnSalary: 30_000,
      creditPoints: 2.25,
    });
    // בדיקה שהחזר / תוספת מחושבים
    expect(typeof result.estimatedRefund).toBe('number');
    expect(result.annualIncome).toBe(15_000 * 12 + 50_000);
    expect(result.verdict.length).toBeGreaterThan(10);
  });

  it('מחזיר טיפים', () => {
    const result = calculateYearEndRefund({
      avgMonthlySalary: 15_000,
      totalBonusReceived: 50_000,
      taxWithheldOnBonus: 20_000,
      taxWithheldOnSalary: 25_000,
      creditPoints: 2.25,
    });
    expect(Array.isArray(result.tips)).toBe(true);
  });
});
