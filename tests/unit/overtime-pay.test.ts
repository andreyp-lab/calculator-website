import { describe, it, expect } from 'vitest';
import {
  OVERTIME_RATES,
  calculateOvertimeDay,
  calculateRestDayPay,
  hourlyWageFromMonthly,
} from '@/lib/calculators/overtime-pay';

describe('hourlyWageFromMonthly', () => {
  it('divides by 182 by default', () => {
    expect(hourlyWageFromMonthly(18_200)).toBeCloseTo(100, 10);
  });
  it('accepts a custom divisor', () => {
    expect(hourlyWageFromMonthly(18_600, 186)).toBeCloseTo(100, 10);
  });
  it('returns 0 for invalid input', () => {
    expect(hourlyWageFromMonthly(-5)).toBe(0);
    expect(hourlyWageFromMonthly(NaN)).toBe(0);
    expect(hourlyWageFromMonthly(10_000, 0)).toBe(0);
  });
});

describe('calculateOvertimeDay', () => {
  it('pays one hour at 125%', () => {
    const r = calculateOvertimeDay(100, 1);
    expect(r.totalPay).toBeCloseTo(125, 10);
    expect(r.premium).toBeCloseTo(25, 10);
    expect(r.hoursAt125).toBe(1);
    expect(r.hoursAt150).toBe(0);
  });
  it('pays two hours at 125% each', () => {
    expect(calculateOvertimeDay(100, 2).totalPay).toBeCloseTo(250, 10);
  });
  it('pays the third hour at 150%', () => {
    const r = calculateOvertimeDay(100, 3);
    expect(r.totalPay).toBeCloseTo(125 + 125 + 150, 10);
    expect(r.hoursAt125).toBe(2);
    expect(r.hoursAt150).toBe(1);
  });
  it('handles fractional hours across the 2-hour boundary', () => {
    // 2.5 hours: 2 * 125 + 0.5 * 150
    expect(calculateOvertimeDay(100, 2.5).totalPay).toBeCloseTo(325, 10);
  });
  it('returns zero for no overtime or invalid input', () => {
    expect(calculateOvertimeDay(100, 0).totalPay).toBe(0);
    expect(calculateOvertimeDay(100, -3).totalPay).toBe(0);
    expect(calculateOvertimeDay(NaN, 3).totalPay).toBe(0);
  });
  it('premium equals totalPay minus regularPay', () => {
    const r = calculateOvertimeDay(65.93, 4);
    expect(r.premium).toBeCloseTo(r.totalPay - r.regularPay, 10);
  });
});

describe('calculateRestDayPay', () => {
  it('pays 150% per hour', () => {
    expect(calculateRestDayPay(100, 8)).toBeCloseTo(1200, 10);
    expect(OVERTIME_RATES.restDay).toBe(1.5);
  });
  it('returns zero for invalid input', () => {
    expect(calculateRestDayPay(100, -1)).toBe(0);
  });
});

import { calculateMonthlyShifts, roundAgorot, splitShift } from '@/lib/calculators/overtime-pay';

describe('splitShift', () => {
  it('an 8-hour shift has no overtime', () => {
    expect(splitShift({ hours: 8 })).toEqual({ regularHours: 8, hoursAt125: 0, hoursAt150: 0, restDayHours: 0 });
  });
  it('a 10-hour shift has 2 hours at 125%', () => {
    expect(splitShift({ hours: 10 })).toEqual({ regularHours: 8, hoursAt125: 2, hoursAt150: 0, restDayHours: 0 });
  });
  it('an 11-hour shift has 2 hours at 125% and 1 at 150%', () => {
    expect(splitShift({ hours: 11 })).toEqual({ regularHours: 8, hoursAt125: 2, hoursAt150: 1, restDayHours: 0 });
  });
  it('a shorter shift has no overtime and no negative hours', () => {
    expect(splitShift({ hours: 6 })).toEqual({ regularHours: 6, hoursAt125: 0, hoursAt150: 0, restDayHours: 0 });
  });
  it('a rest-day shift is all rest-day hours', () => {
    expect(splitShift({ hours: 9, restDay: true })).toEqual({
      regularHours: 0,
      hoursAt125: 0,
      hoursAt150: 0,
      restDayHours: 9,
    });
  });
  it('respects a custom regular day length', () => {
    expect(splitShift({ hours: 9 }, 8.4).hoursAt125).toBeCloseTo(0.6, 10);
  });
});

describe('calculateMonthlyShifts', () => {
  // חודש לדוגמה: שכר 12,000; 18 משמרות של 8; 3 של 10; 1 של 11; משמרת שבת של 8
  const month = {
    monthlyWage: 12_000,
    shifts: [
      ...Array.from({ length: 18 }, () => ({ hours: 8 })),
      ...Array.from({ length: 3 }, () => ({ hours: 10 })),
      { hours: 11 },
      { hours: 8, restDay: true },
    ],
  };

  it('matches the hand calculation (payslip lines by rate)', () => {
    // 125%: 3*2 + 2 = 8 hours; 150%: 1 hour; rest day: 8 hours. hourly = 12000/182
    const r = calculateMonthlyShifts(month);
    const h = 12_000 / 182;
    expect(r.lines.map((l) => l.hours)).toEqual([8, 1, 8]);
    expect(r.lines[0].amount).toBeCloseTo(roundAgorot(h * 8 * 1.25), 10); // 659.34
    expect(r.lines[1].amount).toBeCloseTo(roundAgorot(h * 1 * 1.5), 10); // 98.90
    expect(r.lines[2].amount).toBeCloseTo(roundAgorot(h * 8 * 1.5), 10); // 791.21
    expect(r.lines.map((l) => l.amount)).toEqual([659.34, 98.9, 791.21]);
    expect(r.extraPay).toBe(1549.45);
    expect(r.totalGross).toBe(13_549.45);
  });

  it('total gross = base salary + sum of the displayed lines', () => {
    const r = calculateMonthlyShifts(month);
    const sum = r.lines.reduce((s, l) => s + l.amount, 0);
    expect(r.totalGross).toBeCloseTo(r.baseSalary + sum, 2);
  });

  it('with no overtime the month equals the base salary', () => {
    const r = calculateMonthlyShifts({ monthlyWage: 9_000, shifts: [{ hours: 8 }, { hours: 7 }] });
    expect(r.lines).toEqual([]);
    expect(r.extraPay).toBe(0);
    expect(r.totalGross).toBe(9_000);
  });

  it('is consistent with the single-day function', () => {
    const r = calculateMonthlyShifts({ monthlyWage: 12_000, shifts: [{ hours: 11 }] });
    const day = calculateOvertimeDay(12_000 / 182, 3);
    expect(r.extraPay).toBeCloseTo(day.totalPay, 1);
  });

  it('handles invalid input safely', () => {
    const r = calculateMonthlyShifts({ monthlyWage: NaN, shifts: [{ hours: 12 }] });
    expect(r.totalGross).toBe(0);
    expect(r.extraPay).toBe(0);
  });
});

describe('roundAgorot', () => {
  it('rounds half up to two decimals', () => {
    expect(roundAgorot(1.005)).toBe(1.01);
    expect(roundAgorot(659.3406593)).toBe(659.34);
  });
});
