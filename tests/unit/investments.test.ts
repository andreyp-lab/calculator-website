import { describe, it, expect } from 'vitest';
import {
  calculateCompoundInterest,
  calculateROI,
  calculateRetirement,
} from '@/lib/calculators/investments';

describe('calculateCompoundInterest', () => {
  it('100,000 ב-7% במשך 10 שנים, ללא הפקדות', () => {
    const result = calculateCompoundInterest({
      principal: 100_000,
      annualRate: 7,
      years: 10,
      frequency: 'yearly',
      monthlyContribution: 0,
    });
    // 100,000 × 1.07^10 = 196,715
    expect(result.finalAmount).toBeCloseTo(196_715, -2);
    expect(result.totalInterest).toBeCloseTo(96_715, -2);
  });

  it('עם הפקדות חודשיות', () => {
    const result = calculateCompoundInterest({
      principal: 0,
      annualRate: 5,
      years: 10,
      frequency: 'monthly',
      monthlyContribution: 1000,
    });
    // 120 הפקדות של 1000 בריבית 5% = ~155,300
    expect(result.totalContributions).toBe(120_000);
    expect(result.finalAmount).toBeGreaterThan(150_000);
    expect(result.finalAmount).toBeLessThan(160_000);
  });

  it('ריבית 0 - הסכום שווה לקרן + הפקדות', () => {
    const result = calculateCompoundInterest({
      principal: 10_000,
      annualRate: 0,
      years: 5,
      frequency: 'yearly',
      monthlyContribution: 100,
    });
    // 10,000 + 100*60 = 16,000
    expect(result.finalAmount).toBeCloseTo(16_000, 0);
    expect(result.totalInterest).toBeCloseTo(0, 0);
  });
});

describe('calculateROI', () => {
  it('100K → 150K ב-3 שנים', () => {
    const result = calculateROI({
      initialInvestment: 100_000,
      finalValue: 150_000,
      years: 3,
      additionalCosts: 0,
      additionalIncome: 0,
    });
    expect(result.netProfit).toBe(50_000);
    expect(result.roi).toBe(50);
    // (1.5)^(1/3) - 1 = 14.47%
    expect(result.annualizedROI).toBeCloseTo(14.47, 1);
    expect(result.isPositive).toBe(true);
  });

  it('השקעה הפסידה', () => {
    const result = calculateROI({
      initialInvestment: 10_000,
      finalValue: 8_000,
      years: 1,
      additionalCosts: 0,
      additionalIncome: 0,
    });
    expect(result.netProfit).toBe(-2_000);
    expect(result.roi).toBe(-20);
    expect(result.isPositive).toBe(false);
  });

  it('עם דיבידנדים והוצאות', () => {
    const result = calculateROI({
      initialInvestment: 10_000,
      finalValue: 12_000,
      years: 1,
      additionalCosts: 500, // עמלות
      additionalIncome: 800, // דיבידנדים
    });
    // (12,000 + 800) - (10,000 + 500) = 2,300 רווח
    expect(result.netProfit).toBeCloseTo(2_300, 0);
  });
});

describe('calculateRetirement', () => {
  it('בן 35 רוצה לפרוש ב-67', () => {
    const result = calculateRetirement({
      currentAge: 35,
      retirementAge: 67,
      currentSavings: 100_000,
      monthlyContribution: 2_000,
      expectedReturn: 6,
      desiredMonthlyIncome: 12_000,
      yearsInRetirement: 20,
      inflationRate: 2.5,
    });
    expect(result.yearsUntilRetirement).toBe(32);
    expect(result.projectedSavings).toBeGreaterThan(100_000);
    expect(result.requiredSavings).toBeGreaterThan(0);
  });

  it('כבר בגיל פרישה - בלי שנים נוספות', () => {
    const result = calculateRetirement({
      currentAge: 67,
      retirementAge: 67,
      currentSavings: 1_000_000,
      monthlyContribution: 0,
      expectedReturn: 6,
      desiredMonthlyIncome: 8_000,
      yearsInRetirement: 20,
      inflationRate: 2.5,
    });
    expect(result.yearsUntilRetirement).toBe(0);
    expect(result.projectedSavings).toBe(1_000_000);
  });
});
