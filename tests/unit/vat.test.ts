import { describe, expect, it } from 'vitest';
import { calculateVatBasic } from '@/lib/calculators/vat-basic';

describe('VAT arithmetic at the standard 18% rate', () => {
  it('adds VAT to an amount before VAT', () => {
    const result = calculateVatBasic(1000, 'add');
    expect(result.net).toBe(1000);
    expect(result.vat).toBeCloseTo(180, 2);
    expect(result.gross).toBeCloseTo(1180, 2);
  });

  it('extracts VAT from a total that includes VAT', () => {
    const result = calculateVatBasic(1180, 'extract');
    expect(result.net).toBeCloseTo(1000, 2);
    expect(result.vat).toBeCloseTo(180, 2);
    expect(result.gross).toBe(1180);
  });

  it('normalizes negative and nonfinite inputs', () => {
    expect(calculateVatBasic(-100, 'add')).toEqual({ net: 0, vat: 0, gross: 0 });
    expect(calculateVatBasic(Number.NaN, 'extract')).toEqual({ net: 0, vat: 0, gross: 0 });
  });

  it('adding and extracting return the original amount', () => {
    const added = calculateVatBasic(500, 'add');
    expect(calculateVatBasic(added.gross, 'extract').net).toBeCloseTo(500, 2);
  });
});
