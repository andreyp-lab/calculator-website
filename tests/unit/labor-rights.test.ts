import { describe, it, expect } from 'vitest';
import {
  calculateHolidayPay,
  calculateLeaveEntitlement,
  calculateLeaveRedemption,
  calculateNoticePeriod,
  calculateSeverance,
  calculateSickPay,
  calculateTenure,
  calculateUnemployment,
  checkMinimumWage,
  monthlySickDailyWage,
  noticePayInLieu,
  recreationDaysForYears,
  sickAccrualForMonth,
  sickBalance,
} from '@/lib/calculators/labor-rights';

describe('annual leave entitlement (kolzchut tables)', () => {
  it('first 5 years, 5-day week: 12 net / 16 gross', () => {
    expect(calculateLeaveEntitlement({ seniorityYear: 1, workWeekDays: 5 })).toEqual({ netDays: 12, grossDays: 16, prorated: false });
    expect(calculateLeaveEntitlement({ seniorityYear: 5, workWeekDays: 5 })!.netDays).toBe(12);
  });
  it('statutory 5-day table climbs; extension order takes the higher', () => {
    expect(calculateLeaveEntitlement({ seniorityYear: 8, workWeekDays: 5 })!.netDays).toBe(16);
    expect(calculateLeaveEntitlement({ seniorityYear: 8, workWeekDays: 5, extensionOrderApplies: true })!.netDays).toBe(17);
    expect(calculateLeaveEntitlement({ seniorityYear: 9, workWeekDays: 5, extensionOrderApplies: true })!.netDays).toBe(23);
    expect(calculateLeaveEntitlement({ seniorityYear: 14, workWeekDays: 5 })!.grossDays).toBe(28);
  });
  it('6-day week table', () => {
    expect(calculateLeaveEntitlement({ seniorityYear: 1, workWeekDays: 6 })!.netDays).toBe(14);
    expect(calculateLeaveEntitlement({ seniorityYear: 14, workWeekDays: 6 })!.netDays).toBe(24);
  });
  it('pro-rata below 200 (full year) / 240 (partial year) worked days, rounded down', () => {
    const r = calculateLeaveEntitlement({ seniorityYear: 1, workWeekDays: 5, workedDaysInYear: 100 })!;
    expect(r.prorated).toBe(true);
    expect(r.grossDays).toBe(8); // 16 × 0.5
    const p = calculateLeaveEntitlement({ seniorityYear: 1, workWeekDays: 5, workedDaysInYear: 120, partialYear: true })!;
    expect(p.grossDays).toBe(8);
    expect(calculateLeaveEntitlement({ seniorityYear: 1, workWeekDays: 5, workedDaysInYear: 200 })!.prorated).toBe(false);
  });
  it('invalid', () => {
    expect(calculateLeaveEntitlement({ seniorityYear: 0, workWeekDays: 5 })).toBeNull();
    expect(calculateLeaveEntitlement({ seniorityYear: 1, workWeekDays: 4 as 5 })).toBeNull();
  });
});

describe('leave redemption (kolzchut: 9,000 over 3 months → 138.46 / 120 / 100)', () => {
  it('hourly worker examples from the page', () => {
    const a = (accrual: 'net' | 'calendar', week: 5 | 6) =>
      calculateLeaveRedemption({ unusedDays: 1, accrual, workWeekDays: week, payType: 'hourly', threeMonthTotal: 9000 })!.dailyValue;
    expect(a('net', 5)).toBe(138.46);
    expect(a('net', 6)).toBe(120);
    expect(a('calendar', 5)).toBe(100);
  });
  it('monthly salary: ÷21.67, ÷25, ÷30', () => {
    const r = (accrual: 'net' | 'calendar', week: 5 | 6) =>
      calculateLeaveRedemption({ unusedDays: 10, accrual, workWeekDays: week, payType: 'monthly', monthlySalary: 6000 })!;
    expect(r('net', 5).dailyValue).toBe(276.92);
    expect(r('net', 6).dailyValue).toBe(240);
    expect(r('calendar', 5).total).toBe(2000);
  });
});

describe('notice period', () => {
  it('monthly: 1 day per month for 6 months then 2.5; a full month from a year', () => {
    expect(calculateNoticePeriod({ fullMonthsOfService: 4, payType: 'monthly' })!.days).toBe(4);
    expect(calculateNoticePeriod({ fullMonthsOfService: 9, payType: 'monthly' })!.days).toBe(13.5);
    expect(calculateNoticePeriod({ fullMonthsOfService: 11, payType: 'monthly' })!.days).toBe(18.5);
    expect(calculateNoticePeriod({ fullMonthsOfService: 12, payType: 'monthly' })).toEqual({ days: 30, isFullMonth: true });
  });
  it('hourly/daily stages', () => {
    expect(calculateNoticePeriod({ fullMonthsOfService: 8, payType: 'hourly' })!.days).toBe(8);
    expect(calculateNoticePeriod({ fullMonthsOfService: 12, payType: 'hourly' })!.days).toBe(14);
    expect(calculateNoticePeriod({ fullMonthsOfService: 17, payType: 'hourly' })!.days).toBe(16);
    expect(calculateNoticePeriod({ fullMonthsOfService: 24, payType: 'hourly' })!.days).toBe(21);
    expect(calculateNoticePeriod({ fullMonthsOfService: 35, payType: 'hourly' })!.days).toBe(26);
    expect(calculateNoticePeriod({ fullMonthsOfService: 36, payType: 'hourly' })!.isFullMonth).toBe(true);
  });
  it('pay in lieu', () => {
    expect(noticePayInLieu(15, 9000)).toBe(4500);
    expect(noticePayInLieu(-1, 9000)).toBeNull();
  });
});

describe('sick pay', () => {
  it('accrual: part month = days worked / 21.67 × 1.5 (kolzchut: 10 days → 0.69)', () => {
    expect(sickAccrualForMonth(10)).toBe(0.69);
    expect(sickAccrualForMonth(22)).toBe(1.5); // capped to a full month
  });
  it('balance caps at 90', () => {
    expect(sickBalance(12)).toBe(18);
    expect(sickBalance(100)).toBe(90);
    expect(sickBalance(12, 5)).toBe(13);
  });
  it('pay: day 1 none, days 2–3 half, day 4+ full', () => {
    const r = calculateSickPay({ consecutiveDays: 5, dailyWage: 400 })!;
    expect(r.lines.map((l) => l.pct)).toEqual([0, 0.5, 0.5, 1, 1]);
    expect(r.total).toBe(0 + 200 + 200 + 400 + 400);
    expect(r.paidDays).toBe(3);
    expect(calculateSickPay({ consecutiveDays: 3, dailyWage: 400, paidFromDayOne: true })!.total).toBe(1200);
  });
  it('monthly daily wage readings', () => {
    expect(monthlySickDailyWage(6500, '30')).toBe(216.67);
    expect(monthlySickDailyWage(6500, '5day')).toBe(300);
    expect(monthlySickDailyWage(6500, '6day')).toBe(260);
  });
});

describe('holiday pay', () => {
  it('amount = average daily hours × hourly wage (kolzchut: 450h/60d × 40 = 300)', () => {
    const r = calculateHolidayPay({ hourlyWage: 40, totalHours: 450, workdays: 60, monthsAtWorkplace: 6, scheduledToWork: true, workedDayBeforeAndAfter: true })!;
    expect(r.eligible).toBe(true);
    expect(r.avgDailyHours).toBe(7.5);
    expect(r.amount).toBe(300);
  });
  it('conditions', () => {
    const r = calculateHolidayPay({ hourlyWage: 40, totalHours: 450, workdays: 60, monthsAtWorkplace: 2, scheduledToWork: false, workedDayBeforeAndAfter: false })!;
    expect(r.eligible).toBe(false);
    expect(r.reasons).toHaveLength(3);
    expect(r.amount).toBe(0);
  });
});

describe('severance and tax exemption', () => {
  it('1 month per year; exemption is the lower of 1.5×salary×years and 13,750×years', () => {
    const low = calculateSeverance({ lastMonthlySalary: 8000, yearsOfService: 4 })!;
    expect(low.severance).toBe(32000);
    expect(low.exemptionCeiling).toBe(48000); // 1.5×8000×4 = 48,000 < 13,750×4 = 55,000
    expect(low.exempt).toBe(32000);
    expect(low.taxable).toBe(0);
    const high = calculateSeverance({ lastMonthlySalary: 20000, yearsOfService: 10 })!;
    expect(high.severance).toBe(200000);
    expect(high.exemptionCeiling).toBe(137500);
    expect(high.taxable).toBe(62500);
  });
  it('invalid', () => {
    expect(calculateSeverance({ lastMonthlySalary: -1, yearsOfService: 2 })).toBeNull();
  });
});

describe('tenure', () => {
  it('years, months, days', () => {
    const t = calculateTenure('2020-03-15', '2026-11-20')!;
    expect([t.years, t.months, t.days]).toEqual([6, 8, 5]);
    expect(t.totalFullMonths).toBe(80);
  });
  it('end-of-month borrow', () => {
    const t = calculateTenure('2025-01-31', '2025-03-01')!;
    expect([t.years, t.months, t.days]).toEqual([0, 1, 1]);
  });
  it('same day is zero; reversed or bad input is null', () => {
    expect(calculateTenure('2026-01-01', '2026-01-01')!.totalDays).toBe(0);
    expect(calculateTenure('2026-02-01', '2026-01-01')).toBeNull();
    expect(calculateTenure('2026-1-1', '2026-02-01')).toBeNull();
  });
  it('recreation days by completed years (private sector)', () => {
    expect(recreationDaysForYears(0)).toBe(0);
    expect(recreationDaysForYears(1)).toBe(5);
    expect(recreationDaysForYears(3)).toBe(6);
    expect(recreationDaysForYears(11)).toBe(8);
    expect(recreationDaysForYears(25)).toBe(10);
  });
});

describe('unemployment benefit — reproduces the BTL 2026 tables', () => {
  const u = (age: number, gross: number) =>
    calculateUnemployment({ avgMonthlyGross: gross, age, dependents: 0, workedMonthsOf18: 14 })!;
  it('age 28+', () => {
    expect(u(30, 3000).dailyBeforeCap).toBe(96);
    expect(u(30, 6000).dailyBeforeCap).toBe(182.25);
    expect(u(30, 10000).dailyBeforeCap).toBe(257.81);
    expect(u(30, 20000).dailyBeforeCap).toBe(380.06);
  });
  it('under 28', () => {
    expect(u(24, 5000).dailyBeforeCap).toBe(120);
    expect(u(24, 6000).dailyBeforeCap).toBe(137.5);
    expect(u(24, 12000).dailyBeforeCap).toBe(218.56);
  });
  it('capped at 550.76 for the first 125 days and 367.17 afterwards', () => {
    const r = u(30, 45000);
    expect(r.dailyFirst125).toBe(550.76);
    expect(r.dailyAfter125).toBe(367.17);
  });
  it('eligibility days by age and dependents', () => {
    expect(calculateUnemployment({ avgMonthlyGross: 8000, age: 23, dependents: 0, workedMonthsOf18: 12 })!.maxDays).toBe(50);
    expect(calculateUnemployment({ avgMonthlyGross: 8000, age: 26, dependents: 0, workedMonthsOf18: 12 })!.maxDays).toBe(67);
    expect(calculateUnemployment({ avgMonthlyGross: 8000, age: 30, dependents: 0, workedMonthsOf18: 12 })!.maxDays).toBe(100);
    expect(calculateUnemployment({ avgMonthlyGross: 8000, age: 40, dependents: 0, workedMonthsOf18: 12 })!.maxDays).toBe(138);
    expect(calculateUnemployment({ avgMonthlyGross: 8000, age: 50, dependents: 0, workedMonthsOf18: 12 })!.maxDays).toBe(175);
    expect(calculateUnemployment({ avgMonthlyGross: 8000, age: 30, dependents: 3, workedMonthsOf18: 12 })!.maxDays).toBe(138);
  });
  it('total uses the two caps across the 125-day switch', () => {
    const r = calculateUnemployment({ avgMonthlyGross: 45000, age: 50, dependents: 0, workedMonthsOf18: 18 })!;
    expect(r.maxDays).toBe(175);
    expect(r.totalGross).toBe(Math.round((550.76 * 125 + 367.17 * 50) * 100) / 100);
  });
  it('qualification flags', () => {
    expect(u(30, 8000).eligibleByBasics).toBe(true);
    expect(calculateUnemployment({ avgMonthlyGross: 8000, age: 19, dependents: 0, workedMonthsOf18: 14 })!.eligibleByBasics).toBe(false);
    expect(calculateUnemployment({ avgMonthlyGross: 8000, age: 30, dependents: 0, workedMonthsOf18: 11 })!.reasons).toHaveLength(1);
    expect(calculateUnemployment({ avgMonthlyGross: 8000, age: 67, dependents: 0, workedMonthsOf18: 14 })!.eligibleByBasics).toBe(false);
  });
});

describe('minimum wage check', () => {
  it('monthly, daily, hourly', () => {
    expect(checkMinimumWage({ amount: 6443.85, basis: 'monthly' })!.meets).toBe(true);
    expect(checkMinimumWage({ amount: 6000, basis: 'monthly' })!.difference).toBe(-443.85);
    expect(checkMinimumWage({ amount: 297.4, basis: 'daily5' })!.meets).toBe(true);
    expect(checkMinimumWage({ amount: 35.4, basis: 'hourly', monthlyHours: 182 })!.minimum).toBe(35.4);
    expect(checkMinimumWage({ amount: 34.64, basis: 'hourly', monthlyHours: 186 })!.meets).toBe(true);
    expect(checkMinimumWage({ amount: 30, basis: 'hourly' })!.meets).toBe(false);
  });
});
