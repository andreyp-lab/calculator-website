import { describe, it, expect } from 'vitest';
import {
  calculateSickPayFull,
  calculateSickDayAccumulation,
  calculateFamilyIllnessPay,
  calculateLongIllness,
  calculateSickPay,
  SICK_DAYS_ACCRUAL_PER_MONTH,
  SICK_DAYS_ACCRUAL_PER_YEAR,
  SICK_DAYS_MAX_BALANCE,
  SICK_PAY_WORK_DAYS_PER_MONTH,
  FAMILY_ILLNESS_ALLOWANCES,
} from '@/lib/calculators/sick-pay';

// ====================================================================
// קבועים
// ====================================================================
describe('קבועים', () => {
  it('צבירה חודשית = 1.5', () => {
    expect(SICK_DAYS_ACCRUAL_PER_MONTH).toBe(1.5);
  });
  it('צבירה שנתית = 18', () => {
    expect(SICK_DAYS_ACCRUAL_PER_YEAR).toBe(18);
  });
  it('תקרה = 90', () => {
    expect(SICK_DAYS_MAX_BALANCE).toBe(90);
  });
  it('ימי עבודה לחודש = 22', () => {
    expect(SICK_PAY_WORK_DAYS_PER_MONTH).toBe(22);
  });
  it('מחלת ילד = 8 ימים', () => {
    expect(FAMILY_ILLNESS_ALLOWANCES.child).toBe(8);
  });
  it('מחלת בן/זוג = 6 ימים', () => {
    expect(FAMILY_ILLNESS_ALLOWANCES.spouse).toBe(6);
  });
  it('מחלת הורה = 6 ימים', () => {
    expect(FAMILY_ILLNESS_ALLOWANCES.parent).toBe(6);
  });
});

// ====================================================================
// calculateSickPayFull — חישוב תשלום
// ====================================================================
describe('calculateSickPayFull', () => {
  const baseSalary = 22_000; // שכר נוח לחישוב: 22000/22 = 1000 ₪/יום

  it('יום 1 — ללא תשלום', () => {
    const r = calculateSickPayFull({ sickDays: 1, monthlySalary: baseSalary, consecutive: true });
    expect(r.totalPayment).toBe(0);
    expect(r.totalUnpaidLoss).toBeCloseTo(1000, 0);
    expect(r.daysPayment[0].rate).toBe(0);
  });

  it('יום 2 — 50% מהשכר', () => {
    const r = calculateSickPayFull({ sickDays: 2, monthlySalary: baseSalary, consecutive: true });
    // יום 1: 0, יום 2: 500
    expect(r.totalPayment).toBeCloseTo(500, 0);
    expect(r.daysPayment[1].rate).toBe(0.5);
    expect(r.daysPayment[1].amount).toBeCloseTo(500, 0);
  });

  it('יום 3 — 50% מהשכר', () => {
    const r = calculateSickPayFull({ sickDays: 3, monthlySalary: baseSalary, consecutive: true });
    // יום 1: 0, יום 2: 500, יום 3: 500 → סה"כ 1000
    expect(r.totalPayment).toBeCloseTo(1000, 0);
    expect(r.daysPayment[2].rate).toBe(0.5);
  });

  it('יום 4 — 100% מהשכר', () => {
    const r = calculateSickPayFull({ sickDays: 4, monthlySalary: baseSalary, consecutive: true });
    // יום 1: 0, יום 2: 500, יום 3: 500, יום 4: 1000 → סה"כ 2000
    expect(r.totalPayment).toBeCloseTo(2000, 0);
    expect(r.daysPayment[3].rate).toBe(1);
    expect(r.daysPayment[3].amount).toBeCloseTo(1000, 0);
  });

  it('5 ימים — חישוב נכון', () => {
    const r = calculateSickPayFull({ sickDays: 5, monthlySalary: baseSalary, consecutive: true });
    // 0 + 500 + 500 + 1000 + 1000 = 3000
    expect(r.totalPayment).toBeCloseTo(3000, 0);
    expect(r.totalGrossForPeriod).toBeCloseTo(5000, 0);
    expect(r.totalUnpaidLoss).toBeCloseTo(2000, 0);
  });

  it('0 ימים — תשלום אפס', () => {
    const r = calculateSickPayFull({ sickDays: 0, monthlySalary: baseSalary, consecutive: true });
    expect(r.totalPayment).toBe(0);
    expect(r.totalUnpaidLoss).toBe(0);
    expect(r.daysPayment).toHaveLength(0);
  });

  it('שכר יומי מחושב נכון', () => {
    const r = calculateSickPayFull({ sickDays: 1, monthlySalary: 15000, consecutive: true });
    expect(r.dailySalary).toBeCloseTo(15000 / 22, 2);
  });

  it('שכר 0 — תשלום 0 ללא שגיאה', () => {
    const r = calculateSickPayFull({ sickDays: 5, monthlySalary: 0, consecutive: true });
    expect(r.totalPayment).toBe(0);
    expect(r.dailySalary).toBe(0);
  });

  it('10 ימים — 7 ימים ב-100%, פירוט מלא', () => {
    const r = calculateSickPayFull({ sickDays: 10, monthlySalary: baseSalary, consecutive: true });
    expect(r.daysPayment).toHaveLength(10);
    // ימים 4-10 בשיעור 100%
    for (let i = 3; i < 10; i++) {
      expect(r.daysPayment[i].rate).toBe(1);
    }
    // 0 + 500 + 500 + (7 × 1000) = 8000
    expect(r.totalPayment).toBeCloseTo(8000, 0);
  });

  it('מכיל label לכל יום', () => {
    const r = calculateSickPayFull({ sickDays: 4, monthlySalary: 12000, consecutive: true });
    expect(r.daysPayment[0].label).toBeTruthy();
    expect(r.daysPayment[3].label).toContain('100%');
  });

  it('מכיל המלצות למחלה של יום 1', () => {
    const r = calculateSickPayFull({ sickDays: 1, monthlySalary: 12000, consecutive: true });
    expect(r.recommendations.length).toBeGreaterThan(0);
  });
});

// ====================================================================
// calculateSickDayAccumulation — צבירת ימים
// ====================================================================
describe('calculateSickDayAccumulation', () => {
  it('12 חודשים → 18 ימים', () => {
    const r = calculateSickDayAccumulation({ monthsWorked: 12, daysUsed: 0 });
    expect(r.daysAccrued).toBe(18);
    expect(r.balance).toBe(18);
    expect(r.atMaximum).toBe(false);
  });

  it('60 חודשים (5 שנים) → תקרה 90 ימים', () => {
    const r = calculateSickDayAccumulation({ monthsWorked: 60, daysUsed: 0 });
    expect(r.daysAccrued).toBe(90);
    expect(r.balance).toBe(90);
    expect(r.atMaximum).toBe(true);
    expect(r.monthsToMax).toBe(0);
  });

  it('מעל 60 חודשים — לא חוצה 90', () => {
    const r = calculateSickDayAccumulation({ monthsWorked: 120, daysUsed: 0 });
    expect(r.daysAccrued).toBe(90);
  });

  it('ניצול מפחית מהיתרה', () => {
    const r = calculateSickDayAccumulation({ monthsWorked: 24, daysUsed: 10 });
    // 24 × 1.5 = 36, פחות 10 = 26
    expect(r.balance).toBe(26);
    expect(r.daysUsed).toBe(10);
  });

  it('0 חודשים — יתרה אפס', () => {
    const r = calculateSickDayAccumulation({ monthsWorked: 0, daysUsed: 0 });
    expect(r.daysAccrued).toBe(0);
    expect(r.balance).toBe(0);
  });

  it('אחוז מהתקרה — נכון', () => {
    const r = calculateSickDayAccumulation({ monthsWorked: 30, daysUsed: 0 });
    // 30 × 1.5 = 45 → 50% מ-90
    expect(r.percentOfMax).toBeCloseTo(50, 0);
  });

  it('חודשים עד תקרה — חישוב', () => {
    const r = calculateSickDayAccumulation({ monthsWorked: 24, daysUsed: 0 });
    // 36 נצברו, צריך עוד 54 → 54/1.5 = 36 חודשים
    expect(r.monthsToMax).toBe(36);
  });

  it('ניצול גבוה מהצבירה — יתרה לא שלילית', () => {
    const r = calculateSickDayAccumulation({ monthsWorked: 6, daysUsed: 50 });
    expect(r.balance).toBeGreaterThanOrEqual(0);
  });
});

// ====================================================================
// calculateFamilyIllnessPay — מחלת בן משפחה
// ====================================================================
describe('calculateFamilyIllnessPay', () => {
  const salary = 22_000; // 1000 ₪/יום

  it('ילד — 3 ימים — מכוסה', () => {
    const r = calculateFamilyIllnessPay({ relation: 'child', absenceDays: 3, monthlySalary: salary });
    expect(r.isEligible).toBe(true);
    expect(r.coveredDays).toBe(3);
    expect(r.uncoveredDays).toBe(0);
    expect(r.maxAllowedDays).toBe(8);
  });

  it('ילד — 10 ימים — 8 מכוסים, 2 לא', () => {
    const r = calculateFamilyIllnessPay({ relation: 'child', absenceDays: 10, monthlySalary: salary });
    expect(r.coveredDays).toBe(8);
    expect(r.uncoveredDays).toBe(2);
  });

  it('בן/בת זוג — 4 ימים', () => {
    const r = calculateFamilyIllnessPay({ relation: 'spouse', absenceDays: 4, monthlySalary: salary });
    expect(r.isEligible).toBe(true);
    expect(r.maxAllowedDays).toBe(6);
    expect(r.coveredDays).toBe(4);
    // תשלום: יום 1: 0, יום 2: 500, יום 3: 500, יום 4: 1000 = 2000
    expect(r.totalPayment).toBeCloseTo(2000, 0);
  });

  it('הורה מגיל 65 — זכאי', () => {
    const r = calculateFamilyIllnessPay({
      relation: 'parent',
      absenceDays: 3,
      monthlySalary: salary,
      parentAge: 70,
    });
    expect(r.isEligible).toBe(true);
    expect(r.maxAllowedDays).toBe(6);
  });

  it('הורה מתחת לגיל 65 — לא זכאי', () => {
    const r = calculateFamilyIllnessPay({
      relation: 'parent',
      absenceDays: 3,
      monthlySalary: salary,
      parentAge: 60,
    });
    expect(r.isEligible).toBe(false);
    expect(r.coveredDays).toBe(0);
    expect(r.totalPayment).toBe(0);
    expect(r.ineligibilityReason).toBeTruthy();
  });

  it('מחיר ליום נכון', () => {
    const r = calculateFamilyIllnessPay({ relation: 'spouse', absenceDays: 1, monthlySalary: salary });
    expect(r.dailySalary).toBeCloseTo(salary / 22, 1);
  });

  it('0 ימים — 0 תשלום', () => {
    const r = calculateFamilyIllnessPay({ relation: 'child', absenceDays: 0, monthlySalary: salary });
    expect(r.totalPayment).toBe(0);
    expect(r.coveredDays).toBe(0);
  });

  it('הסבר מכיל מידע', () => {
    const r = calculateFamilyIllnessPay({ relation: 'child', absenceDays: 5, monthlySalary: salary });
    expect(r.explanation).toBeTruthy();
    expect(r.explanation.length).toBeGreaterThan(10);
  });
});

// ====================================================================
// calculateLongIllness — מחלה ממושכת
// ====================================================================
describe('calculateLongIllness', () => {
  it('3 שנות עבודה = 54 ימים צבורים', () => {
    const r = calculateLongIllness(3, 22000, 30);
    expect(r.accruedDaysAtStart).toBe(54);
  });

  it('5+ שנות עבודה = 90 ימים (תקרה)', () => {
    const r = calculateLongIllness(6, 22000, 50);
    expect(r.accruedDaysAtStart).toBe(90);
  });

  it('מחלה קצרה מהסל — כולה מכוסה', () => {
    const r = calculateLongIllness(5, 22000, 20);
    // 90 ימים צבורים, 20 ימי מחלה — הכל מכוסה
    expect(r.daysFromPersonalBalance).toBe(20);
    expect(r.totalEmployerPayment).toBeGreaterThan(0);
  });

  it('מחלה ארוכה מהסל — חלק לא משולם', () => {
    const r = calculateLongIllness(1, 22000, 50);
    // שנה 1 = 18 ימים, 50 ימי מחלה → 18 מכוסים, 32 לא
    expect(r.daysFromPersonalBalance).toBeLessThan(50);
  });

  it('תרחישים — יש לפחות שלב אחד', () => {
    const r = calculateLongIllness(3, 22000, 30);
    expect(r.scenarios.length).toBeGreaterThan(0);
  });

  it('שלב 1 כולל ימים 1-3', () => {
    const r = calculateLongIllness(3, 22000, 10);
    const firstScenario = r.scenarios[0];
    expect(firstScenario.startDay).toBe(1);
    expect(firstScenario.endDay).toBeGreaterThanOrEqual(1);
  });

  it('afterBalance מכיל מידע', () => {
    const r = calculateLongIllness(1, 22000, 100);
    expect(r.afterBalance).toBeTruthy();
    expect(r.afterBalance.length).toBeGreaterThan(10);
  });

  it('שכר יומי נכון', () => {
    const r = calculateLongIllness(3, 22000, 10);
    expect(r.dailySalary).toBeCloseTo(1000, 0);
  });
});

// ====================================================================
// calculateSickPay — תאימות לאחור
// ====================================================================
describe('calculateSickPay (backward compat)', () => {
  it('מחזיר את השדות הישנים', () => {
    const r = calculateSickPay({ sickDays: 5, monthlySalary: 15000, consecutive: true });
    expect(r).toHaveProperty('totalPayment');
    expect(r).toHaveProperty('totalUnpaidLoss');
    expect(r).toHaveProperty('daysPayment');
    expect(r).toHaveProperty('explanation');
  });

  it('daysPayment ישן לא כולל label', () => {
    const r = calculateSickPay({ sickDays: 3, monthlySalary: 15000, consecutive: true });
    // שדות: day, rate, amount (לא label)
    r.daysPayment.forEach((d) => {
      expect(d).toHaveProperty('day');
      expect(d).toHaveProperty('rate');
      expect(d).toHaveProperty('amount');
    });
  });

  it('תוצאה עקבית עם calculateSickPayFull', () => {
    const old = calculateSickPay({ sickDays: 7, monthlySalary: 20000, consecutive: true });
    const full = calculateSickPayFull({ sickDays: 7, monthlySalary: 20000, consecutive: true });
    expect(old.totalPayment).toBeCloseTo(full.totalPayment, 1);
    expect(old.totalUnpaidLoss).toBeCloseTo(full.totalUnpaidLoss, 1);
  });
});
