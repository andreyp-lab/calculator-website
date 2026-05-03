import { describe, it, expect } from 'vitest';
import { calculateRecreationPay, getRecreationDays } from '@/lib/calculators/recreation-pay';

describe('getRecreationDays', () => {
  it('פחות משנה - 0 ימים', () => {
    expect(getRecreationDays(0)).toBe(0);
  });

  it('שנה 1 - 5 ימים', () => {
    expect(getRecreationDays(1)).toBe(5);
  });

  it('שנים 2-3 - 6 ימים', () => {
    expect(getRecreationDays(2)).toBe(6);
    expect(getRecreationDays(3)).toBe(6);
  });

  it('שנים 4-10 - 7 ימים', () => {
    expect(getRecreationDays(4)).toBe(7);
    expect(getRecreationDays(7)).toBe(7);
    expect(getRecreationDays(10)).toBe(7);
  });

  it('שנים 11-15 - 8 ימים', () => {
    expect(getRecreationDays(11)).toBe(8);
    expect(getRecreationDays(15)).toBe(8);
  });

  it('שנים 16-19 - 9 ימים', () => {
    expect(getRecreationDays(16)).toBe(9);
    expect(getRecreationDays(19)).toBe(9);
  });

  it('20+ שנים - 10 ימים', () => {
    expect(getRecreationDays(20)).toBe(10);
    expect(getRecreationDays(30)).toBe(10);
  });
});

describe('calculateRecreationPay', () => {
  it('עובד שנה 1 במגזר פרטי, משרה מלאה', () => {
    const result = calculateRecreationPay({
      yearsOfService: 1,
      partTimePercentage: 100,
      sector: 'private',
    });

    expect(result.isEligible).toBe(true);
    expect(result.daysEntitled).toBe(5);
    expect(result.payPerDay).toBe(418);
    expect(result.fullTimeAmount).toBe(2090); // 5 × 418
    expect(result.finalAmount).toBe(2090);
  });

  it('עובד 5 שנים במגזר ציבורי, משרה מלאה', () => {
    const result = calculateRecreationPay({
      yearsOfService: 5,
      partTimePercentage: 100,
      sector: 'public',
    });

    expect(result.daysEntitled).toBe(7);
    expect(result.payPerDay).toBe(471.40);
    expect(result.fullTimeAmount).toBeCloseTo(7 * 471.40, 1);
  });

  it('משרת 50% - חצי מהסכום', () => {
    const fullTime = calculateRecreationPay({
      yearsOfService: 5,
      partTimePercentage: 100,
      sector: 'private',
    });
    const halfTime = calculateRecreationPay({
      yearsOfService: 5,
      partTimePercentage: 50,
      sector: 'private',
    });

    expect(halfTime.finalAmount).toBeCloseTo(fullTime.finalAmount / 2, 0);
  });

  it('פחות משנת עבודה - לא זכאי', () => {
    const result = calculateRecreationPay({
      yearsOfService: 0.5,
      partTimePercentage: 100,
      sector: 'private',
    });

    expect(result.isEligible).toBe(false);
    expect(result.finalAmount).toBe(0);
  });

  it('20+ שנים - 10 ימים', () => {
    const result = calculateRecreationPay({
      yearsOfService: 25,
      partTimePercentage: 100,
      sector: 'private',
    });

    expect(result.daysEntitled).toBe(10);
    expect(result.finalAmount).toBe(4180); // 10 × 418
  });
});
