import { describe, it, expect } from 'vitest';
import { calculateElectricityBill, calculateWaterBill, waterQuotaM3 } from '@/lib/calculators/utility-bills';
import { ELECTRICITY_HOUSEHOLD_2026, WATER_HOUSEHOLD_2026 } from '@/lib/constants/utilities-2026';

describe('constants match the official books read on 2026-11-20', () => {
  it('electricity: 53.83 agorot ex VAT = 63.52 with 18% VAT (matches the secondary source cited)', () => {
    expect(ELECTRICITY_HOUSEHOLD_2026.agorotPerKwh).toBe(53.83);
    expect(Math.round(ELECTRICITY_HOUSEHOLD_2026.agorotPerKwh * 1.18 * 100) / 100).toBe(63.52);
    expect(ELECTRICITY_HOUSEHOLD_2026.fixedPerBillSinglePhase).toBe(9.97 + 15.6);
  });
  it('water: 7.21/13.24 ex VAT = 8.51/15.62 with VAT (as printed in the book)', () => {
    expect(Math.round(WATER_HOUSEHOLD_2026.quotaPricePerM3 * 1.18 * 100) / 100).toBe(8.51);
    expect(Math.round(WATER_HOUSEHOLD_2026.aboveQuotaPricePerM3 * 1.18 * 100) / 100).toBe(15.62);
  });
});

describe('calculateElectricityBill', () => {
  it('600 kWh, two months, single phase, no capacity: energy + fixed + VAT', () => {
    const r = calculateElectricityBill({ kwh: 600, billingMonths: 2, phase: 'single' })!;
    expect(r.energy).toBe(322.98); // 600 × 0.5383
    expect(r.fixed).toBe(25.57);
    expect(r.beforeVat).toBe(348.55);
    expect(r.vat).toBe(62.74);
    expect(r.total).toBe(411.29);
    expect(r.effectivePerKwh).toBe(0.69);
  });

  it('three phase fixed charge', () => {
    const r = calculateElectricityBill({ kwh: 0, billingMonths: 2, phase: 'three' })!;
    expect(r.fixed).toBe(27.09);
    expect(r.effectivePerKwh).toBe(0);
  });

  it('monthly billing halves the fixed charge and the quota of welfare discount', () => {
    const r = calculateElectricityBill({ kwh: 300, billingMonths: 1, phase: 'single' })!;
    expect(r.fixed).toBe(12.79); // 25.57 / 2 → 12.785
  });

  it('capacity charge scales with kVA and period', () => {
    const r = calculateElectricityBill({ kwh: 0, billingMonths: 2, phase: 'single', kva: 12 })!;
    expect(r.capacity).toBe(12.36); // 12 × 6.18 × 2 / 12
  });

  it('welfare discount is 50% on up to 400 kWh per month', () => {
    const r = calculateElectricityBill({ kwh: 1000, billingMonths: 2, phase: 'single', welfareDiscount: true })!;
    // 800 kWh מזכים: 800 × 0.5383 × 50% = 215.32
    expect(r.welfareDiscount).toBe(215.32);
    expect(r.energy).toBe(322.98); // 538.30 − 215.32
    const small = calculateElectricityBill({ kwh: 300, billingMonths: 2, phase: 'single', welfareDiscount: true })!;
    expect(small.welfareDiscount).toBe(80.75); // 300 × 0.5383 × 50%
  });

  it('rejects invalid input', () => {
    expect(calculateElectricityBill({ kwh: -1, billingMonths: 2, phase: 'single' })).toBeNull();
    expect(calculateElectricityBill({ kwh: 100, billingMonths: 3 as 1, phase: 'single' })).toBeNull();
    expect(calculateElectricityBill({ kwh: 100, billingMonths: 2, phase: 'single', kva: -1 })).toBeNull();
    expect(calculateElectricityBill({ kwh: NaN, billingMonths: 2, phase: 'single' })).toBeNull();
  });
});

describe('calculateWaterBill', () => {
  it('quota is 3.5 m3 per person per month, at least 7 m3 per month', () => {
    expect(waterQuotaM3(1, 1)).toBe(7);
    expect(waterQuotaM3(2, 1)).toBe(7);
    expect(waterQuotaM3(4, 1)).toBe(14);
    expect(waterQuotaM3(4, 2)).toBe(28);
  });

  it('within quota: all at the quota rate', () => {
    // 4 נפשות, חודשיים, 25 מ"ק (מכסה 28): 25 × 7.21 = 180.25; מע"מ 32.45
    const r = calculateWaterBill({ m3: 25, persons: 4, billingMonths: 2 })!;
    expect(r.aboveQuotaM3).toBe(0);
    expect(r.atQuotaCost).toBe(180.25);
    expect(r.vat).toBe(32.45);
    expect(r.total).toBe(212.7);
  });

  it('above quota: excess at the higher rate', () => {
    // 4 נפשות, חודשיים, 35 מ"ק: 28 × 7.21 + 7 × 13.24 = 201.88 + 92.68 = 294.56
    const r = calculateWaterBill({ m3: 35, persons: 4, billingMonths: 2 })!;
    expect(r.atQuotaM3).toBe(28);
    expect(r.aboveQuotaM3).toBe(7);
    expect(r.beforeVat).toBe(294.56);
    expect(r.total).toBe(347.58);
  });

  it('zero consumption → zero bill', () => {
    const r = calculateWaterBill({ m3: 0, persons: 3, billingMonths: 2 })!;
    expect(r.total).toBe(0);
    expect(r.effectivePerM3).toBe(0);
  });

  it('rejects invalid input', () => {
    expect(calculateWaterBill({ m3: -1, persons: 2, billingMonths: 2 })).toBeNull();
    expect(calculateWaterBill({ m3: 10, persons: 0, billingMonths: 2 })).toBeNull();
    expect(calculateWaterBill({ m3: 10, persons: 2.5, billingMonths: 2 })).toBeNull();
    expect(calculateWaterBill({ m3: 10, persons: 2, billingMonths: 3 as 1 })).toBeNull();
  });
});
