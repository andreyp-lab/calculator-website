import { describe, it, expect } from 'vitest';
import { overdraftCost, overdraftPayoff, overdraftVsLoan } from '@/lib/calculators/overdraft';

describe('overdraftCost', () => {
  it('daily interest on the average balance', () => {
    // 10,000 ₪ × 12% × 30/365
    const r = overdraftCost({ averageOverdraft: 10000, annualRatePct: 12, daysPerMonth: 30 })!;
    expect(r.monthlyInterest).toBe(98.63);
    expect(r.annualInterest).toBe(1183.56);
    expect(r.monthlyPctOfBalance).toBe(0.99);
  });

  it('full month in the red costs about rate/12', () => {
    const r = overdraftCost({ averageOverdraft: 36500, annualRatePct: 10, daysPerMonth: 31 })!;
    expect(r.monthlyInterest).toBe(310);
  });

  it('rejects invalid input', () => {
    expect(overdraftCost({ averageOverdraft: 0, annualRatePct: 10, daysPerMonth: 30 })).toBeNull();
    expect(overdraftCost({ averageOverdraft: 1000, annualRatePct: -1, daysPerMonth: 30 })).toBeNull();
    expect(overdraftCost({ averageOverdraft: 1000, annualRatePct: 101, daysPerMonth: 30 })).toBeNull();
    expect(overdraftCost({ averageOverdraft: 1000, annualRatePct: 10, daysPerMonth: 0 })).toBeNull();
    expect(overdraftCost({ averageOverdraft: 1000, annualRatePct: 10, daysPerMonth: 32 })).toBeNull();
    expect(overdraftCost({ averageOverdraft: NaN, annualRatePct: 10, daysPerMonth: 30 })).toBeNull();
  });
});

describe('overdraftPayoff', () => {
  it('zero interest: balance / paydown', () => {
    const r = overdraftPayoff({ balance: 6000, annualRatePct: 0, monthlyPaydown: 1000 })!;
    expect(r.months).toBe(6);
    expect(r.totalInterest).toBe(0);
    expect(r.totalPaid).toBe(6000);
  });

  it('with interest, takes longer and pays interest', () => {
    const r = overdraftPayoff({ balance: 12000, annualRatePct: 12, monthlyPaydown: 1000 })!;
    expect(r.months).toBeGreaterThan(12);
    expect(r.months).toBeLessThanOrEqual(14);
    expect(r.totalInterest).toBeGreaterThan(0);
    expect(r.totalPaid).toBeCloseTo(12000 + r.totalInterest, 2);
  });

  it('returns null when the paydown does not cover monthly interest', () => {
    // 12,000 × 12% / 12 = 120 per month
    expect(overdraftPayoff({ balance: 12000, annualRatePct: 12, monthlyPaydown: 120 })).toBeNull();
    expect(overdraftPayoff({ balance: 12000, annualRatePct: 12, monthlyPaydown: 50 })).toBeNull();
    expect(overdraftPayoff({ balance: 12000, annualRatePct: 12, monthlyPaydown: 121 })).not.toBeNull();
  });

  it('rejects invalid input', () => {
    expect(overdraftPayoff({ balance: 0, annualRatePct: 5, monthlyPaydown: 100 })).toBeNull();
    expect(overdraftPayoff({ balance: 100, annualRatePct: 5, monthlyPaydown: 0 })).toBeNull();
  });
});

describe('overdraftVsLoan', () => {
  it('loan with lower rate saves interest and closes the debt', () => {
    const r = overdraftVsLoan({
      averageOverdraft: 12000,
      overdraftRatePct: 12,
      daysPerMonth: 30,
      loanRatePct: 8,
      loanMonths: 24,
    })!;
    expect(r.overdraftTotalInterest).toBeCloseTo(12000 * 0.12 * (30 / 365) * 24, 1);
    expect(r.loanMonthlyPayment).toBeGreaterThan(12000 / 24);
    expect(r.loanTotalInterest).toBeGreaterThan(0);
    expect(r.interestSavedByLoan).toBeCloseTo(r.overdraftTotalInterest - r.loanTotalInterest, 2);
    expect(r.overdraftRemainingDebt).toBe(12000);
  });

  it('a more expensive loan shows negative savings', () => {
    const r = overdraftVsLoan({
      averageOverdraft: 12000,
      overdraftRatePct: 6,
      daysPerMonth: 30,
      loanRatePct: 14,
      loanMonths: 36,
    })!;
    expect(r.interestSavedByLoan).toBeLessThan(0);
  });

  it('rejects invalid input', () => {
    expect(
      overdraftVsLoan({ averageOverdraft: 1000, overdraftRatePct: 10, daysPerMonth: 30, loanRatePct: 8, loanMonths: 0 }),
    ).toBeNull();
    expect(
      overdraftVsLoan({ averageOverdraft: 1000, overdraftRatePct: 10, daysPerMonth: 30, loanRatePct: 8, loanMonths: 12.5 }),
    ).toBeNull();
  });
});
