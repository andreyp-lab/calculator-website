import { describe, it, expect } from 'vitest';
import { calculateShift, formatHoursMinutes, parseTime, splitRegularOvertime } from '@/lib/calculators/work-hours';
import { calculateBtlContributions } from '@/lib/calculators/btl-contributions';

describe('work hours', () => {
  it('parse', () => {
    expect(parseTime('08:30')).toBe(510);
    expect(parseTime('24:00')).toBeNull();
    expect(parseTime('8:30')).toBeNull();
  });
  it('simple shift minus break', () => {
    const r = calculateShift({ start: '08:00', end: '17:30', breakMinutes: 45 })!;
    expect(r.netMinutes).toBe(525);
    expect(r.netHours).toBe(8.75);
    expect(r.crossesMidnight).toBe(false);
    expect(formatHoursMinutes(r.netMinutes)).toBe('8:45');
  });
  it('shift across midnight', () => {
    const r = calculateShift({ start: '22:00', end: '06:00', breakMinutes: 30 })!;
    expect(r.crossesMidnight).toBe(true);
    expect(r.netMinutes).toBe(450);
  });
  it('invalid: break longer than shift, bad time', () => {
    expect(calculateShift({ start: '08:00', end: '09:00', breakMinutes: 90 })).toBeNull();
    expect(calculateShift({ start: '8', end: '09:00', breakMinutes: 0 })).toBeNull();
  });
  it('split regular and overtime', () => {
    expect(splitRegularOvertime(10, 8)).toEqual({ regular: 8, overtime: 2 });
    expect(splitRegularOvertime(6.5, 8)).toEqual({ regular: 6.5, overtime: 0 });
    expect(splitRegularOvertime(-1, 8)).toBeNull();
  });
});

describe('btl contributions (constants of tax-2026)', () => {
  it('employee below the reduced threshold: 1.04% + 3.23%', () => {
    const r = calculateBtlContributions(5000, 'employee')!;
    expect(r.nationalInsurance).toBe(52);
    expect(r.healthInsurance).toBe(161.5);
    expect(r.total).toBe(213.5);
    expect(r.atFullRate).toBe(0);
  });
  it('employee above the threshold splits at 7,703', () => {
    const r = calculateBtlContributions(10000, 'employee')!;
    expect(r.atReducedRate).toBe(7703);
    expect(r.atFullRate).toBe(2297);
    // 7703×1.04% + 2297×7% = 80.11 + 160.79 ; health 7703×3.23% + 2297×5.17% = 248.80 + 118.75
    expect(r.nationalInsurance).toBe(240.9);
    expect(r.healthInsurance).toBe(367.56);
  });
  it('capped at the maximum insured income', () => {
    const a = calculateBtlContributions(51910, 'employee')!;
    const b = calculateBtlContributions(80000, 'employee')!;
    expect(b.total).toBe(a.total);
    expect(b.insuredIncome).toBe(51910);
  });
  it('self-employed uses its own rates and no employer part', () => {
    const r = calculateBtlContributions(10000, 'self-employed')!;
    expect(r.employer).toBe(0);
    expect(r.total).toBeGreaterThan(calculateBtlContributions(10000, 'employee')!.total);
  });
  it('zero and invalid', () => {
    expect(calculateBtlContributions(0, 'employee')!.total).toBe(0);
    expect(calculateBtlContributions(-1, 'employee')).toBeNull();
  });
});
