import { describe, it, expect } from 'vitest';
import { calculatePurchaseTax } from '@/lib/calculators/purchase-tax';

describe('calculatePurchaseTax - דירה ראשונה', () => {
  it('פטור מלא לדירה ב-1.5 מיליון', () => {
    const result = calculatePurchaseTax({
      propertyValue: 1_500_000,
      buyerType: 'first-home',
      isYoung: false,
    });
    expect(result.totalTax).toBe(0);
    expect(result.fullExemption).toBe(true);
  });

  it('דירה ראשונה ב-2.5 מיליון - מס נמוך', () => {
    const result = calculatePurchaseTax({
      propertyValue: 2_500_000,
      buyerType: 'first-home',
      isYoung: false,
    });
    // 0 - 1,978,745: פטור
    // 1,978,745 - 2,347,040 (368,295 × 3.5%): 12,890
    // 2,347,040 - 2,500,000 (152,960 × 5%): 7,648
    // סה"כ: ~20,538
    expect(result.totalTax).toBeCloseTo(20_538, -2);
    expect(result.fullExemption).toBe(false);
    expect(result.partialExemption).toBe(true);
  });
});

describe('calculatePurchaseTax - משקיע', () => {
  it('משקיע משלם 8% מהשקל הראשון', () => {
    const result = calculatePurchaseTax({
      propertyValue: 2_000_000,
      buyerType: 'investor',
      isYoung: false,
    });
    // 2,000,000 × 8% = 160,000
    expect(result.totalTax).toBeCloseTo(160_000, -2);
    expect(result.fullExemption).toBe(false);
  });

  it('משקיע מעל 6M - 10% במדרגה העליונה', () => {
    const result = calculatePurchaseTax({
      propertyValue: 7_000_000,
      buyerType: 'investor',
      isYoung: false,
    });
    // 6,055,070 × 8% = 484,406
    // 944,930 × 10% = 94,493
    // סה"כ ~578,899
    expect(result.totalTax).toBeGreaterThan(550_000);
    expect(result.totalTax).toBeLessThan(600_000);
  });
});

describe('calculatePurchaseTax - עולה חדש', () => {
  it('עולה חדש - פטור עד 1.97M', () => {
    const result = calculatePurchaseTax({
      propertyValue: 1_500_000,
      buyerType: 'oleh',
      isYoung: true,
    });
    expect(result.totalTax).toBe(0);
  });

  it('עולה חדש - 0.5% מעל לפטור', () => {
    const result = calculatePurchaseTax({
      propertyValue: 3_000_000,
      buyerType: 'oleh',
      isYoung: true,
    });
    // 3,000,000 × 0.5% = 15,000
    expect(result.totalTax).toBeCloseTo(15_000, -2);
  });
});
