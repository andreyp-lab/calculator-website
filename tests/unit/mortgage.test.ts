import { describe, it, expect } from 'vitest';
import {
  calculateMortgage,
  getMaxLoanAmount,
  getRequiredEquity,
} from '@/lib/calculators/mortgage';

describe('calculateMortgage - שפיצר', () => {
  it('משכנתא 1 מיליון ב-4.5% ל-25 שנים', () => {
    const result = calculateMortgage({
      loanAmount: 1_000_000,
      interestRate: 4.5,
      termYears: 25,
      method: 'shpitzer',
    });

    // תשלום חודשי משוער ~5,558 ₪
    expect(result.monthlyPayment).toBeGreaterThan(5_400);
    expect(result.monthlyPayment).toBeLessThan(5_700);

    // 25 שנים × 12 = 300 תשלומים
    expect(result.schedule.length).toBe(300);

    // סך הריבית גדול מהקרן בריבית 4.5%
    expect(result.totalInterest).toBeGreaterThan(600_000);
    expect(result.totalInterest).toBeLessThan(700_000);
  });

  it('שפיצר - תשלום חודשי קבוע', () => {
    const result = calculateMortgage({
      loanAmount: 1_000_000,
      interestRate: 4,
      termYears: 20,
      method: 'shpitzer',
    });

    expect(result.firstPayment).toBeCloseTo(result.lastPayment, 2);
  });

  it('ריבית 0% - תשלום שווה לחלוקת הקרן', () => {
    const result = calculateMortgage({
      loanAmount: 240_000,
      interestRate: 0,
      termYears: 20,
      method: 'shpitzer',
    });

    expect(result.monthlyPayment).toBeCloseTo(1000, 0); // 240,000 / 240
    expect(result.totalInterest).toBeCloseTo(0, 0);
  });

  it('סכום הקרן בלוח שווה לקרן המקורית', () => {
    const result = calculateMortgage({
      loanAmount: 500_000,
      interestRate: 5,
      termYears: 15,
      method: 'shpitzer',
    });

    const totalPrincipal = result.schedule.reduce((sum, m) => sum + m.principal, 0);
    expect(totalPrincipal).toBeCloseTo(500_000, -2);
  });
});

describe('calculateMortgage - קרן שווה', () => {
  it('קרן שווה - תשלום קרן זהה כל חודש', () => {
    const result = calculateMortgage({
      loanAmount: 1_000_000,
      interestRate: 5,
      termYears: 20,
      method: 'equal-principal',
    });

    // קרן חודשית = 1,000,000 / 240 ≈ 4,166.67
    const expectedPrincipal = 1_000_000 / 240;
    result.schedule.forEach((entry) => {
      expect(entry.principal).toBeCloseTo(expectedPrincipal, 1);
    });
  });

  it('קרן שווה - תשלום ראשון > תשלום אחרון', () => {
    const result = calculateMortgage({
      loanAmount: 1_000_000,
      interestRate: 5,
      termYears: 20,
      method: 'equal-principal',
    });

    expect(result.firstPayment).toBeGreaterThan(result.lastPayment);
  });

  it('קרן שווה - סך ריבית קטן משפיצר', () => {
    const shpitzer = calculateMortgage({
      loanAmount: 1_000_000,
      interestRate: 5,
      termYears: 20,
      method: 'shpitzer',
    });
    const equalPrincipal = calculateMortgage({
      loanAmount: 1_000_000,
      interestRate: 5,
      termYears: 20,
      method: 'equal-principal',
    });

    expect(equalPrincipal.totalInterest).toBeLessThan(shpitzer.totalInterest);
  });
});

describe('getMaxLoanAmount', () => {
  it('דירה ראשונה: 75% LTV', () => {
    expect(getMaxLoanAmount(2_000_000, 'first-home')).toBe(1_500_000);
  });

  it('מחליף דירה: 70% LTV', () => {
    expect(getMaxLoanAmount(2_000_000, 'home-replacement')).toBe(1_400_000);
  });

  it('משקיע: 50% LTV', () => {
    expect(getMaxLoanAmount(2_000_000, 'investor')).toBe(1_000_000);
  });
});

describe('getRequiredEquity', () => {
  it('דירה ראשונה: הון עצמי 25%', () => {
    expect(getRequiredEquity(2_000_000, 'first-home')).toBe(500_000);
  });

  it('משקיע: הון עצמי 50%', () => {
    expect(getRequiredEquity(2_000_000, 'investor')).toBe(1_000_000);
  });
});

describe('Edge cases', () => {
  it('סכום שלילי מחזיר 0', () => {
    const result = calculateMortgage({
      loanAmount: -1000,
      interestRate: 5,
      termYears: 20,
      method: 'shpitzer',
    });
    expect(result.monthlyPayment).toBe(0);
  });

  it('תקופה 0 מחזיר 0', () => {
    const result = calculateMortgage({
      loanAmount: 1_000_000,
      interestRate: 5,
      termYears: 0,
      method: 'shpitzer',
    });
    expect(result.monthlyPayment).toBe(0);
  });
});
