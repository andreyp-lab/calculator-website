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
