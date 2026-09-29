import { describe, expect, it } from 'vitest';
import { calculateMortgage, getMaxLoanAmount, getRequiredEquity } from '@/lib/calculators/mortgage';

describe('single-track fixed-rate mortgage', () => {
  it('amortizes a standard Shpitzer loan to zero and reconciles totals', () => {
    const result = calculateMortgage({ loanAmount: 1_000_000, interestRate: 4.5, termYears: 25, method: 'shpitzer' });
    expect(result.schedule).toHaveLength(300);
    expect(result.monthlyPayment).toBeCloseTo(5_558.32, 1);
    expect(result.schedule.at(-1)?.remainingBalance).toBe(0);
    expect(result.schedule.reduce((sum, entry) => sum + entry.principal, 0)).toBeCloseTo(1_000_000, 5);
    expect(result.totalPayments - result.loanAmount).toBeCloseTo(result.totalInterest, 5);
    expect(result.yearlyTotals.reduce((sum, year) => sum + year.interest, 0)).toBeCloseTo(result.totalInterest, 5);
  });

  it('uses equal principal and produces falling payments', () => {
    const result = calculateMortgage({ loanAmount: 240_000, interestRate: 6, termYears: 20, method: 'equal-principal' });
    expect(result.schedule.every((entry) => Math.abs(entry.principal - 1_000) < 1e-7)).toBe(true);
    expect(result.firstPayment).toBeGreaterThan(result.lastPayment);
    expect(result.schedule.at(-1)?.remainingBalance).toBe(0);
  });

  it('handles a zero-rate mortgage', () => {
    const result = calculateMortgage({ loanAmount: 240_000, interestRate: 0, termYears: 20, method: 'shpitzer' });
    expect(result.monthlyPayment).toBe(1_000);
    expect(result.totalInterest).toBe(0);
  });

  it.each([
    { loanAmount: 0, interestRate: 4, termYears: 20, method: 'shpitzer' as const },
    { loanAmount: 100_000, interestRate: -1, termYears: 20, method: 'shpitzer' as const },
    { loanAmount: 100_000, interestRate: 4, termYears: 30.5, method: 'shpitzer' as const },
    { loanAmount: 100_000, interestRate: Number.NaN, termYears: 20, method: 'shpitzer' as const },
  ])('rejects invalid input without a misleading schedule: %o', (input) => {
    expect(calculateMortgage(input).schedule).toHaveLength(0);
  });
});

describe('residential LTV ceilings', () => {
  it.each([
    ['first-home', 1_500_000, 500_000],
    ['home-replacement', 1_400_000, 600_000],
    ['investor', 1_000_000, 1_000_000],
  ] as const)('%s', (buyerType, maxLoan, equity) => {
    expect(getMaxLoanAmount(2_000_000, buyerType)).toBe(maxLoan);
    expect(getRequiredEquity(2_000_000, buyerType)).toBe(equity);
  });
});
