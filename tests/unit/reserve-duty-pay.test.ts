import { describe, it, expect } from 'vitest';
import {
  calculateReserveDutyPay,
  calculateDailyPay,
  calculateWarBonuses,
  calculateEmployerReimbursement,
  calculateFamilyAllowances,
  calculateIncomeLossProtection,
  calculateMonthlyProjection,
  resolveEffectiveSalary,
  RESERVE_PAY_2026,
  IRON_SWORDS_BONUSES,
  FAMILY_ALLOWANCES_2026,
  type ReserveDutyInput,
} from '@/lib/calculators/reserve-duty-pay';

// ============================================================
// Helpers
// ============================================================

function makeInput(overrides: Partial<ReserveDutyInput> = {}): ReserveDutyInput {
  return {
    employmentStatus: 'employee',
    recentMonthlySalary: 12_000,
    salary12Months: 11_500,
    preWarSalary: 11_000,
    salaryBasis: '3months',
    reserveDays: 30,
    isIronSwordsService: false,
    combatRole: 'none',
    dependentChildren: 0,
    hasSpouse: false,
    spouseWorks: true,
    partTimePercent: 100,
    isSmallBusiness: false,
    employerContinuesPaying: true,
    ...overrides,
  };
}

// ============================================================
// calculateDailyPay
// ============================================================

describe('calculateDailyPay', () => {
  it('שכיר עם שכר רגיל — שכר/30', () => {
    const { dailyPay, cappedAtMaximum, atMinimum } = calculateDailyPay('employee', 12_000);
    expect(dailyPay).toBeCloseTo(400, 0);
    expect(cappedAtMaximum).toBe(false);
    expect(atMinimum).toBe(false);
  });

  it('שכר מעל תקרה — מוגבל לתקרה', () => {
    const { dailyPay, cappedAtMaximum } = calculateDailyPay('employee', 100_000);
    expect(dailyPay).toBe(RESERVE_PAY_2026.DAILY_CAP);
    expect(cappedAtMaximum).toBe(true);
  });

  it('שכר נמוך מאוד — מינימום', () => {
    const { dailyPay, atMinimum } = calculateDailyPay('employee', 1_000);
    expect(dailyPay).toBe(RESERVE_PAY_2026.MIN_DAILY);
    expect(atMinimum).toBe(true);
  });

  it('חסר תעסוקה — תמיד מינימום', () => {
    const { dailyPay } = calculateDailyPay('unemployed', 50_000);
    expect(dailyPay).toBe(RESERVE_PAY_2026.MIN_DAILY);
    // unemployed always gets MIN_DAILY directly (not flagged as atMinimum since it's the baseline)
  });

  it('חלקי משרה 50% של 12,000 — נמוך ממינימום, מקבל מינימום', () => {
    // 12,000 × 50% = 6,000 → 200/day < 219 MIN → gets 219
    const { dailyPay, atMinimum } = calculateDailyPay('employee', 12_000, 50);
    expect(dailyPay).toBe(RESERVE_PAY_2026.MIN_DAILY);
    expect(atMinimum).toBe(true);
  });

  it('חלקי משרה 50% של 30,000 — שכר יומי מחצי (מעל מינימום)', () => {
    // 30,000 × 50% = 15,000 → 500/day > 219 MIN → no change
    const { dailyPay, atMinimum } = calculateDailyPay('employee', 30_000, 50);
    expect(dailyPay).toBeCloseTo(500, 0);
    expect(atMinimum).toBe(false);
  });

  it('עצמאי עם שכר מספיק — לפי שכר', () => {
    const { dailyPay } = calculateDailyPay('self-employed', 15_000);
    expect(dailyPay).toBeCloseTo(500, 0);
  });
});

// ============================================================
// calculateWarBonuses
// ============================================================

describe('calculateWarBonuses', () => {
  it('לא שירות חרבות ברזל — אפס מענקים', () => {
    const result = calculateWarBonuses(30, false, 'none', 'employee', false);
    expect(result.totalGrants).toBe(0);
    expect(result.generalGrant).toBe(0);
    expect(result.totalDailyGrant).toBe(0);
    expect(result.taxExempt).toBe(true);
  });

  it('שירות חרבות ברזל 1 יום — מענק כללי + יומי', () => {
    const result = calculateWarBonuses(1, true, 'none', 'employee', false);
    expect(result.generalGrant).toBe(IRON_SWORDS_BONUSES.GENERAL_GRANT);
    expect(result.totalDailyGrant).toBe(IRON_SWORDS_BONUSES.DAILY_GRANT * 1);
    expect(result.returnToWorkGrant).toBe(0); // פחות מ-20 ימים
  });

  it('שירות 30 ימים — כולל מענק חזרה לעבודה', () => {
    const result = calculateWarBonuses(30, true, 'none', 'employee', false);
    expect(result.returnToWorkGrant).toBe(IRON_SWORDS_BONUSES.RETURN_TO_WORK_GRANT);
    expect(result.totalDailyGrant).toBe(IRON_SWORDS_BONUSES.DAILY_GRANT * 30);
    expect(result.generalGrant).toBe(IRON_SWORDS_BONUSES.GENERAL_GRANT);
  });

  it('שכיר — זכאי למענק חזרה, עצמאי — לא זכאי', () => {
    const employee = calculateWarBonuses(30, true, 'none', 'employee', false);
    const selfEmployed = calculateWarBonuses(30, true, 'none', 'self-employed', false);
    expect(employee.returnToWorkGrant).toBe(IRON_SWORDS_BONUSES.RETURN_TO_WORK_GRANT);
    expect(selfEmployed.returnToWorkGrant).toBe(0);
  });

  it('תפקיד קרבי מלא — תוספת 100 ₪/יום', () => {
    const result = calculateWarBonuses(10, true, 'combat', 'employee', false);
    expect(result.combatRoleGrant).toBe(IRON_SWORDS_BONUSES.COMBAT_DAILY_BONUS * 10);
  });

  it('תומך לחימה — תוספת 50 ₪/יום (50%)', () => {
    const result = calculateWarBonuses(10, true, 'combat_support', 'employee', false);
    expect(result.combatRoleGrant).toBe(
      Math.round(IRON_SWORDS_BONUSES.COMBAT_DAILY_BONUS * 0.5 * 10),
    );
  });

  it('כל המענקים ביחד — סכום נכון', () => {
    const result = calculateWarBonuses(30, true, 'combat', 'employee', false);
    const expected =
      result.generalGrant +
      result.totalDailyGrant +
      result.returnToWorkGrant +
      result.combatRoleGrant;
    expect(result.totalGrants).toBe(expected);
  });
});

// ============================================================
// calculateEmployerReimbursement
// ============================================================

describe('calculateEmployerReimbursement', () => {
  it('מעסיק ממשיך לשלם שכר רגיל — החזר נכון', () => {
    const dailyPay = 400;
    const days = 30;
    const result = calculateEmployerReimbursement(dailyPay, days, 12_000, true, 'employee');
    expect(result.blReimbursementToEmployer).toBeCloseTo(dailyPay * days, 0);
    expect(result.directBLPaymentToEmployee).toBe(0);
  });

  it('מעסיק לא ממשיך — ב.ל. משלם ישירות', () => {
    const dailyPay = 400;
    const days = 30;
    const result = calculateEmployerReimbursement(dailyPay, days, 12_000, false, 'employee');
    expect(result.directBLPaymentToEmployee).toBeCloseTo(dailyPay * days, 0);
    expect(result.blReimbursementToEmployer).toBe(0);
    expect(result.netCostToEmployer).toBe(0);
  });

  it('עצמאי — תמיד ב.ל. ישיר', () => {
    const result = calculateEmployerReimbursement(400, 30, 12_000, true, 'self-employed');
    expect(result.directBLPaymentToEmployee).toBeCloseTo(400 * 30, 0);
    expect(result.blReimbursementToEmployer).toBe(0);
  });

  it('שכר מעל תקרה — יש עלות נטו למעסיק', () => {
    // שכר 60,000 ₪, תגמול מוגבל לתקרה
    const result = calculateEmployerReimbursement(
      RESERVE_PAY_2026.DAILY_CAP,
      30,
      60_000,
      true,
      'employee',
    );
    expect(result.netCostToEmployer).toBeGreaterThan(0);
  });
});

// ============================================================
// calculateFamilyAllowances
// ============================================================

describe('calculateFamilyAllowances', () => {
  it('פחות מ-30 ימים — אין קצבות', () => {
    const result = calculateFamilyAllowances(29, 2, true, false);
    expect(result.totalFamilyAllowances).toBe(0);
    expect(result.childAllowance).toBe(0);
  });

  it('30 ימים + 2 ילדים — קצבת ילדים', () => {
    const result = calculateFamilyAllowances(30, 2, false, true);
    expect(result.childAllowance).toBe(
      FAMILY_ALLOWANCES_2026.CHILD_PER_DAY * 2 * 30,
    );
    expect(result.spouseAllowance).toBe(0);
  });

  it('30 ימים + בן/בת זוג לא עובד/ת', () => {
    const result = calculateFamilyAllowances(30, 0, true, false);
    expect(result.spouseAllowance).toBe(
      FAMILY_ALLOWANCES_2026.NON_WORKING_SPOUSE_PER_DAY * 30,
    );
    expect(result.childAllowance).toBe(0);
  });

  it('בן/בת זוג עובד/ת — אין קצבה לבן/בת זוג', () => {
    const result = calculateFamilyAllowances(30, 0, true, true);
    expect(result.spouseAllowance).toBe(0);
  });

  it('ילדים עם מקסימום 6 (מעל 6 לא נספר)', () => {
    const result6 = calculateFamilyAllowances(30, 6, false, true);
    const result8 = calculateFamilyAllowances(30, 8, false, true);
    expect(result6.childAllowance).toBe(result8.childAllowance);
  });
});

// ============================================================
// calculateIncomeLossProtection
// ============================================================

describe('calculateIncomeLossProtection', () => {
  it('שכר זהה לתגמול — אין הפסד', () => {
    // שכר 12,000 → תגמול 400/יום = 400 × 30 = 12,000
    const result = calculateIncomeLossProtection(400, 30, 12_000);
    expect(result.hasIncomeLoss).toBe(false);
    expect(result.incomeDifference).toBeCloseTo(0, 0);
    expect(result.compensationPercent).toBeCloseTo(100, 0);
  });

  it('תגמול נמוך — הפסד הכנסה', () => {
    // שכר 30,000 → 1,000/יום, תגמול 800/יום → הפסד
    const result = calculateIncomeLossProtection(800, 30, 30_000);
    expect(result.hasIncomeLoss).toBe(true);
    expect(result.incomeDifference).toBeLessThan(0);
  });

  it('תגמול גבוה משכר — אין הפסד (מינימום)', () => {
    // שכר 3,000 → יומי 100, אבל מינימום 219
    const result = calculateIncomeLossProtection(219, 30, 3_000);
    expect(result.hasIncomeLoss).toBe(false);
  });

  it('אחוז פיצוי מחושב נכון', () => {
    const dailyPay = 600;
    const days = 10;
    const salary = 24_000; // 800/יום
    const result = calculateIncomeLossProtection(dailyPay, days, salary);
    expect(result.compensationPercent).toBeCloseTo(75, 0); // 600/800
  });
});

// ============================================================
// resolveEffectiveSalary
// ============================================================

describe('resolveEffectiveSalary', () => {
  it('3 חודשים — מחזיר שכר 3 חודשים', () => {
    const salary = resolveEffectiveSalary('3months', 12_000, 11_000, 10_000);
    expect(salary).toBe(12_000);
  });

  it('12 חודשים — מחזיר שכר 12 חודשים', () => {
    const salary = resolveEffectiveSalary('12months', 12_000, 11_000, 10_000);
    expect(salary).toBe(11_000);
  });

  it('לפני מלחמה — מחזיר שכר לפני מלחמה', () => {
    const salary = resolveEffectiveSalary('prewar', 12_000, 11_000, 10_000);
    expect(salary).toBe(10_000);
  });

  it('12 חודשים ללא ערך — fallback לשכר 3 חודשים', () => {
    const salary = resolveEffectiveSalary('12months', 12_000, undefined, undefined);
    expect(salary).toBe(12_000);
  });
});

// ============================================================
// calculateReserveDutyPay — integration
// ============================================================

describe('calculateReserveDutyPay — אינטגרציה', () => {
  it('שכיר פשוט ללא מענקים', () => {
    const result = calculateReserveDutyPay(makeInput());
    expect(result.dailyPayment).toBeCloseTo(400, 0);
    expect(result.totalBasicPayment).toBeCloseTo(12_000, 0);
    expect(result.warBonuses.totalGrants).toBe(0);
    expect(result.totalCompensation).toBeCloseTo(12_000, 0);
  });

  it('שכיר + חרבות ברזל 30 ימים — מענקים', () => {
    const result = calculateReserveDutyPay(makeInput({ isIronSwordsService: true }));
    expect(result.warBonuses.generalGrant).toBe(IRON_SWORDS_BONUSES.GENERAL_GRANT);
    expect(result.warBonuses.totalDailyGrant).toBe(IRON_SWORDS_BONUSES.DAILY_GRANT * 30);
    expect(result.warBonuses.returnToWorkGrant).toBe(IRON_SWORDS_BONUSES.RETURN_TO_WORK_GRANT);
    expect(result.totalWithOneTimeGrants).toBeGreaterThan(result.totalCompensation);
  });

  it('חסר תעסוקה — מינימום', () => {
    const result = calculateReserveDutyPay(
      makeInput({ employmentStatus: 'unemployed', reserveDays: 10 }),
    );
    expect(result.dailyPayment).toBe(RESERVE_PAY_2026.MIN_DAILY);
    // unemployed always gets MIN_DAILY — atMinimum may be false since it's the baseline
    expect(result.totalBasicPayment).toBeCloseTo(RESERVE_PAY_2026.MIN_DAILY * 10, 0);
  });

  it('שכר מעל תקרה — מוגבל', () => {
    const result = calculateReserveDutyPay(
      makeInput({ recentMonthlySalary: 200_000 }),
    );
    expect(result.cappedAtMaximum).toBe(true);
    expect(result.dailyPayment).toBe(RESERVE_PAY_2026.DAILY_CAP);
  });

  it('עם ילדים ו-30 ימים — קצבות משפחה', () => {
    const result = calculateReserveDutyPay(
      makeInput({ dependentChildren: 2, hasSpouse: true, spouseWorks: false }),
    );
    expect(result.familyAllowances.childAllowance).toBeGreaterThan(0);
    expect(result.familyAllowances.spouseAllowance).toBeGreaterThan(0);
    expect(result.familyAllowances.totalFamilyAllowances).toBeGreaterThan(0);
  });

  it('חלקי משרה — תגמול יחסי (מעל מינימום)', () => {
    // שכר 30,000 כדי לא לפגוע במינימום
    const full = calculateReserveDutyPay(makeInput({ partTimePercent: 100, recentMonthlySalary: 30_000 }));
    const half = calculateReserveDutyPay(makeInput({ partTimePercent: 50, recentMonthlySalary: 30_000 }));
    expect(half.dailyPayment).toBeCloseTo(full.dailyPayment / 2, 0);
  });

  it('notes מכילות מידע על מס', () => {
    const result = calculateReserveDutyPay(makeInput());
    expect(result.notes.some((n) => n.includes('זיכוי מס'))).toBe(true);
  });

  it('90+ ימים — הערה על שירות ממושך', () => {
    const result = calculateReserveDutyPay(makeInput({ reserveDays: 90 }));
    expect(result.notes.some((n) => n.includes('90+') || n.includes('ממושך'))).toBe(true);
  });

  it('תגמול כולל = בסיס + מענק יומי', () => {
    const result = calculateReserveDutyPay(makeInput({ isIronSwordsService: true, reserveDays: 20 }));
    const expected = result.totalBasicPayment + result.warBonuses.totalDailyGrant;
    expect(result.totalCompensation).toBeCloseTo(expected, 0);
  });

  it('תחזית חודשית — סך ימים נכון', () => {
    const result = calculateReserveDutyPay(makeInput({ reserveDays: 30 }));
    const totalDays = result.monthlyProjection.reduce((sum, m) => sum + m.reserveDays, 0);
    expect(totalDays).toBe(30);
  });
});

// ============================================================
// calculateMonthlyProjection
// ============================================================

describe('calculateMonthlyProjection', () => {
  it('ללא תאריך — 3 חודשים עם חלוקה שווה', () => {
    const projection = calculateMonthlyProjection(400, 0, 30, undefined);
    expect(projection.length).toBe(3);
    const totalDays = projection.reduce((s, m) => s + m.reserveDays, 0);
    expect(totalDays).toBe(30);
  });

  it('עם תאריך — ממוקם בחודשים נכונים', () => {
    const projection = calculateMonthlyProjection(400, 280, 60, '2026-01-01');
    expect(projection.length).toBeGreaterThan(0);
    const totalDays = projection.reduce((s, m) => s + m.reserveDays, 0);
    expect(totalDays).toBe(60);
  });

  it('total = basicPay + warBonus', () => {
    const projection = calculateMonthlyProjection(400, 280, 30, undefined);
    for (const m of projection) {
      expect(m.total).toBeCloseTo(m.basicPay + m.warBonus, 0);
    }
  });

  it('ללא מענק יומי (0) — warBonus=0', () => {
    const projection = calculateMonthlyProjection(400, 0, 30, undefined);
    expect(projection.every((m) => m.warBonus === 0)).toBe(true);
  });
});
