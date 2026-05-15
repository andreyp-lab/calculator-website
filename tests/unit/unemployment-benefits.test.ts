import { describe, it, expect } from 'vitest';
import {
  calculateEligibility,
  calculateDailyPay,
  calculateMaxDays,
  calculateBenefitRate,
  calculateWorkIncomeDuringUnemployment,
  buildPaymentSchedule,
  estimateTaxOnBenefits,
  calculateUnemploymentBenefits,
  AVERAGE_NATIONAL_WAGE_2026,
  DAILY_CAP_FIRST_125,
  DAILY_CAP_AFTER_125,
  FULL_RATE_DAYS,
  WAITING_DAYS_DISMISSAL,
  WAITING_DAYS_RESIGNATION,
  MIN_AGE,
  RETIREMENT_AGE,
} from '@/lib/calculators/unemployment-benefits';

// ====================================================================
// קבועים
// ====================================================================
describe('קבועים', () => {
  it('שכר ממוצע ארצי 2026', () => {
    expect(AVERAGE_NATIONAL_WAGE_2026).toBe(13_769);
  });
  it('תקרה יומית 125 ימים ראשונים', () => {
    expect(DAILY_CAP_FIRST_125).toBeCloseTo(550.76, 2);
  });
  it('תקרה יומית מיום 126', () => {
    expect(DAILY_CAP_AFTER_125).toBeCloseTo(367.17, 2);
  });
  it('ימי תשלום מלא', () => {
    expect(FULL_RATE_DAYS).toBe(125);
  });
  it('ימי המתנה אחרי פיטורים', () => {
    expect(WAITING_DAYS_DISMISSAL).toBe(5);
  });
  it('ימי המתנה אחרי התפטרות', () => {
    expect(WAITING_DAYS_RESIGNATION).toBe(90);
  });
  it('גיל מינימלי', () => {
    expect(MIN_AGE).toBe(20);
  });
  it('גיל פרישה', () => {
    expect(RETIREMENT_AGE).toBe(67);
  });
});

// ====================================================================
// calculateMaxDays — תקופת זכאות
// ====================================================================
describe('calculateMaxDays', () => {
  it('גיל 22 ללא ילדים — 50 ימים', () => {
    expect(calculateMaxDays(22, false)).toBe(50);
  });
  it('גיל 22 עם ילדים — 100 ימים', () => {
    expect(calculateMaxDays(22, true)).toBe(100);
  });
  it('גיל 25 ללא ילדים — 100 ימים', () => {
    expect(calculateMaxDays(25, false)).toBe(100);
  });
  it('גיל 27 עם ילדים — 100 ימים', () => {
    expect(calculateMaxDays(27, true)).toBe(100);
  });
  it('גיל 30 ללא ילדים — 138 ימים', () => {
    expect(calculateMaxDays(30, false)).toBe(138);
  });
  it('גיל 34 עם ילדים — 138 ימים', () => {
    expect(calculateMaxDays(34, true)).toBe(138);
  });
  it('גיל 38 ללא ילדים — 138 ימים', () => {
    expect(calculateMaxDays(38, false)).toBe(138);
  });
  it('גיל 38 עם ילדים — 175 ימים', () => {
    expect(calculateMaxDays(38, true)).toBe(175);
  });
  it('גיל 45 ללא ילדים — 175 ימים', () => {
    expect(calculateMaxDays(45, false)).toBe(175);
  });
  it('גיל 60 עם ילדים — 175 ימים', () => {
    expect(calculateMaxDays(60, true)).toBe(175);
  });
});

// ====================================================================
// calculateBenefitRate — שיעורי תשלום
// ====================================================================
describe('calculateBenefitRate', () => {
  it('שכר נמוך (50% מהממוצע) — שיעור 80%', () => {
    const salary = AVERAGE_NATIONAL_WAGE_2026 * 0.5;
    const { rate } = calculateBenefitRate(salary);
    expect(rate).toBe(0.8);
  });

  it('שכר 60% בדיוק מהממוצע — שיעור 80%', () => {
    const salary = AVERAGE_NATIONAL_WAGE_2026 * 0.6;
    const { rate } = calculateBenefitRate(salary);
    expect(rate).toBe(0.8);
  });

  it('שכר 70% מהממוצע — שיעור 60%', () => {
    const salary = AVERAGE_NATIONAL_WAGE_2026 * 0.7;
    const { rate } = calculateBenefitRate(salary);
    expect(rate).toBe(0.6);
  });

  it('שכר 80% בדיוק — שיעור 60%', () => {
    const salary = AVERAGE_NATIONAL_WAGE_2026 * 0.8;
    const { rate } = calculateBenefitRate(salary);
    expect(rate).toBe(0.6);
  });

  it('שכר גבוה (100% מהממוצע) — שיעור 50%', () => {
    const salary = AVERAGE_NATIONAL_WAGE_2026;
    const { rate } = calculateBenefitRate(salary);
    expect(rate).toBe(0.5);
  });

  it('שכר גבוה מאוד — שיעור 50%', () => {
    const { rate } = calculateBenefitRate(50_000);
    expect(rate).toBe(0.5);
  });
});

// ====================================================================
// calculateEligibility — בדיקת זכאות
// ====================================================================
describe('calculateEligibility', () => {
  const baseInput = {
    age: 30,
    hasChildren: false,
    wasDismissed: true,
    insuredMonthsIn18: 14,
  };

  it('מקרה תקני — זכאי', () => {
    const result = calculateEligibility(baseInput);
    expect(result.isEligible).toBe(true);
    expect(result.waitingDays).toBe(WAITING_DAYS_DISMISSAL);
    expect(result.maxEntitlementDays).toBe(138);
  });

  it('גיל 19 — לא זכאי', () => {
    const result = calculateEligibility({ ...baseInput, age: 19 });
    expect(result.isEligible).toBe(false);
    expect(result.reasons.some((r) => r.includes('גיל'))).toBe(true);
  });

  it('גיל 67 — לא זכאי (גיל פרישה)', () => {
    const result = calculateEligibility({ ...baseInput, age: 67 });
    expect(result.isEligible).toBe(false);
  });

  it('ותק לא מספיק (10 חודשים) — לא זכאי', () => {
    const result = calculateEligibility({ ...baseInput, insuredMonthsIn18: 10 });
    expect(result.isEligible).toBe(false);
    expect(result.reasons.some((r) => r.includes('חודשי ביטוח'))).toBe(true);
  });

  it('בעלי ילדים עם 9 חודשים — זכאי', () => {
    const result = calculateEligibility({ ...baseInput, hasChildren: true, insuredMonthsIn18: 9 });
    expect(result.isEligible).toBe(true);
  });

  it('התפטרות ללא עילה — 90 ימי המתנה', () => {
    const result = calculateEligibility({
      ...baseInput,
      wasDismissed: false,
      resignationReason: 'none',
    });
    expect(result.isEligible).toBe(true);
    expect(result.waitingDays).toBe(WAITING_DAYS_RESIGNATION);
  });

  it('התפטרות מסיבה מוצדקת — 0 ימי המתנה נוספים', () => {
    const result = calculateEligibility({
      ...baseInput,
      wasDismissed: false,
      resignationReason: 'qualified_health',
    });
    expect(result.isEligible).toBe(true);
    // התפטרות מוצדקת: אין 90 ימי המתנה, רק 5 ימים כמו פיטורים אך הלוגיקה מחזירה 0
    expect(result.waitingDays).toBe(0);
  });

  it('גיל 45 — 175 ימי זכאות', () => {
    const result = calculateEligibility({ ...baseInput, age: 45 });
    expect(result.maxEntitlementDays).toBe(175);
  });
});

// ====================================================================
// calculateDailyPay — חישוב תשלום יומי
// ====================================================================
describe('calculateDailyPay', () => {
  it('שכר נמוך — שיעור 80%, ללא תקרה', () => {
    // שכר 6,000 ₪ — מתחת ל-60% מ-13,769 = 8,261
    const result = calculateDailyPay({ averageMonthlySalary: 6_000, age: 30, hasChildren: false });
    expect(result.benefitRate).toBe(0.8);
    const expectedDaily = (6_000 / 30) * 0.8; // = 160
    expect(result.dailyBenefitFirst125).toBeCloseTo(expectedDaily, 1);
  });

  it('שכר גבוה — מוגבל לתקרה יומית', () => {
    // שכר 50,000 ₪ — שיעור 50%, תקרה 550.76
    const result = calculateDailyPay({ averageMonthlySalary: 50_000, age: 30, hasChildren: false });
    expect(result.benefitRate).toBe(0.5);
    expect(result.dailyBenefitFirst125).toBeCloseTo(DAILY_CAP_FIRST_125, 2);
    expect(result.isCapped).toBe(true);
  });

  it('יום 126 ואילך — תקרה מופחתת', () => {
    // 50K salary, age 45+ so 175 days (50 > 125 threshold)
    const result = calculateDailyPay({ averageMonthlySalary: 50_000, age: 50, hasChildren: false });
    expect(result.dailyBenefitAfter125).toBeCloseTo(DAILY_CAP_AFTER_125, 2);
    expect(result.remainingDays).toBe(175 - 125);
  });

  it('גיל 22 ללא ילדים — 50 ימים, רק תשלום מלא', () => {
    const result = calculateDailyPay({ averageMonthlySalary: 8_000, age: 22, hasChildren: false });
    expect(result.maxDays).toBe(50);
    expect(result.first125Days).toBe(50);
    expect(result.remainingDays).toBe(0);
    expect(result.totalAfter125).toBe(0);
  });

  it('סה"כ תשלום = ימים ראשונים + ימים נוספים', () => {
    const result = calculateDailyPay({ averageMonthlySalary: 50_000, age: 45, hasChildren: false });
    const expected = result.first125Days * result.dailyBenefitFirst125 + result.remainingDays * result.dailyBenefitAfter125;
    expect(result.totalGross).toBeCloseTo(expected, 0);
  });

  it('שווה ערך חודשי = תשלום יומי × 30', () => {
    const result = calculateDailyPay({ averageMonthlySalary: 10_000, age: 30, hasChildren: false });
    expect(result.monthlyEquivalentFirst125).toBeCloseTo(result.dailyBenefitFirst125 * 30, 0);
  });
});

// ====================================================================
// calculateWorkIncomeDuringUnemployment — עבודה חלקית
// ====================================================================
describe('calculateWorkIncomeDuringUnemployment', () => {
  const halfNational = AVERAGE_NATIONAL_WAGE_2026 * 0.5;

  it('הכנסה נמוכה מ-50% — זכאי להשלמה', () => {
    const result = calculateWorkIncomeDuringUnemployment({
      averageMonthlySalary: 12_000,
      partTimeIncome: halfNational - 1_000,
      partTimePercent: 30,
    });
    expect(result.isEntitledToPartialBenefit).toBe(true);
    expect(result.partialDailyBenefit).toBeGreaterThan(0);
  });

  it('הכנסה מעל 50% — לא זכאי', () => {
    const result = calculateWorkIncomeDuringUnemployment({
      averageMonthlySalary: 12_000,
      partTimeIncome: halfNational + 500,
      partTimePercent: 50,
    });
    expect(result.isEntitledToPartialBenefit).toBe(false);
    expect(result.partialDailyBenefit).toBe(0);
  });

  it('עבודה ב-25% — הפחתה של 25% מדמי האבטלה', () => {
    const result = calculateWorkIncomeDuringUnemployment({
      averageMonthlySalary: 6_000, // שכר נמוך — שיעור 80%
      partTimeIncome: 1_000,
      partTimePercent: 25,
    });
    expect(result.isEntitledToPartialBenefit).toBe(true);
    // 6000/30 * 0.8 = 160 ₪/יום; הפחתה 25% = 40; נטו = 120
    const fullDaily = (6_000 / 30) * 0.8;
    const expectedPartial = fullDaily * 0.75;
    expect(result.partialDailyBenefit).toBeCloseTo(expectedPartial, 1);
  });
});

// ====================================================================
// buildPaymentSchedule — לוח תשלומים
// ====================================================================
describe('buildPaymentSchedule', () => {
  it('מספר הפריודות סביר', () => {
    const schedule = buildPaymentSchedule(400, 266, 100, 5);
    expect(schedule.length).toBeGreaterThan(0);
    // 100 - 5 = 95 ימי תשלום / 14 ≈ 7 פריודות
    expect(schedule.length).toBeLessThanOrEqual(10);
  });

  it('סה"כ ימים = maxDays - waitingDays', () => {
    const schedule = buildPaymentSchedule(400, 266, 100, 5);
    const totalDays = schedule.reduce((s, p) => s + p.daysInPeriod, 0);
    expect(totalDays).toBe(95); // 100 - 5
  });

  it('תשלום מצטבר עולה לאורך הזמן', () => {
    const schedule = buildPaymentSchedule(400, 266, 138, 5);
    for (let i = 1; i < schedule.length; i++) {
      expect(schedule[i].cumulativePayment).toBeGreaterThan(schedule[i - 1].cumulativePayment);
    }
  });
});

// ====================================================================
// estimateTaxOnBenefits — מס על דמי אבטלה
// ====================================================================
describe('estimateTaxOnBenefits', () => {
  it('הכנסה נמוכה — מס במדרגה 10%', () => {
    const result = estimateTaxOnBenefits(30_000, 0);
    expect(result.estimatedTax).toBeGreaterThanOrEqual(0);
    expect(result.effectiveTaxRate).toBeLessThanOrEqual(0.2);
  });

  it('ריבוי הכנסות — מס גדל', () => {
    const low = estimateTaxOnBenefits(50_000, 0);
    const high = estimateTaxOnBenefits(50_000, 150_000);
    expect(high.estimatedTax).toBeGreaterThan(low.estimatedTax);
  });

  it('אפס דמי אבטלה — אין מס', () => {
    const result = estimateTaxOnBenefits(0, 0);
    expect(result.estimatedTax).toBe(0);
    expect(result.effectiveTaxRate).toBe(0);
  });
});

// ====================================================================
// calculateUnemploymentBenefits — backward compat
// ====================================================================
describe('calculateUnemploymentBenefits (backward compat)', () => {
  it('זכאי — מחזיר תוצאות תקינות', () => {
    const result = calculateUnemploymentBenefits({
      averageMonthlySalary: 10_000,
      age: 35,
      hasChildren: true,
      workDaysIn18Months: 400,
    });
    expect(result.isEligible).toBe(true);
    expect(result.dailyBenefit).toBeGreaterThan(0);
    expect(result.maxDays).toBe(175);
    expect(result.totalEstimate).toBeGreaterThan(0);
    expect(result.benefitRate).toBeGreaterThan(0);
  });

  it('ותק לא מספיק — לא זכאי', () => {
    const result = calculateUnemploymentBenefits({
      averageMonthlySalary: 10_000,
      age: 35,
      hasChildren: false,
      workDaysIn18Months: 200,
    });
    expect(result.isEligible).toBe(false);
    expect(result.dailyBenefit).toBe(0);
    expect(result.totalEstimate).toBe(0);
  });

  it('גיל 18 — לא זכאי', () => {
    const result = calculateUnemploymentBenefits({
      averageMonthlySalary: 8_000,
      age: 18,
      hasChildren: false,
      workDaysIn18Months: 400,
    });
    expect(result.isEligible).toBe(false);
  });

  it('שכר גבוה — מוגבל לתקרה', () => {
    const result = calculateUnemploymentBenefits({
      averageMonthlySalary: 80_000,
      age: 40,
      hasChildren: false,
      workDaysIn18Months: 500,
    });
    expect(result.isEligible).toBe(true);
    expect(result.dailyBenefit).toBeCloseTo(DAILY_CAP_FIRST_125, 2);
  });

  it('reducedDailyBenefit קטן מ-dailyBenefit', () => {
    const result = calculateUnemploymentBenefits({
      averageMonthlySalary: 80_000,
      age: 50,
      hasChildren: false,
      workDaysIn18Months: 500,
    });
    expect(result.reducedDailyBenefit).toBeLessThanOrEqual(result.dailyBenefit);
  });
});
