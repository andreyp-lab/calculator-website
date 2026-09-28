import { describe, expect, it } from 'vitest';
import { estimatePurchaseTax2026 } from '@/lib/calculators/purchase-tax-verified';

describe('2026 purchase-tax schedule from Tax Authority instruction 1/2026', () => {
  it('applies the only-home exemption and progressive brackets', () => {
    expect(estimatePurchaseTax2026(1_978_745, 'only-home')).toBe(0);
    expect(estimatePurchaseTax2026(3_000_000, 'only-home')).toBe(45_538);
  });

  it('taxes an additional home at 8% up to the statutory ceiling', () => {
    expect(estimatePurchaseTax2026(3_000_000, 'additional-home')).toBe(240_000);
  });

  it('uses regulation 12a for an eligible immigrant buying an only home', () => {
    expect(estimatePurchaseTax2026(1_978_745, 'new-immigrant-only-home')).toBe(0);
    expect(estimatePurchaseTax2026(3_000_000, 'new-immigrant-only-home')).toBe(5_106);
    expect(estimatePurchaseTax2026(6_055_070, 'new-immigrant-only-home')).toBe(20_382);
    expect(estimatePurchaseTax2026(20_183_566, 'new-immigrant-only-home')).toBeNull();
  });

  it('rejects negative and non-finite input', () => {
    expect(estimatePurchaseTax2026(-1, 'only-home')).toBeNull();
    expect(estimatePurchaseTax2026(Number.NaN, 'only-home')).toBeNull();
  });
});
