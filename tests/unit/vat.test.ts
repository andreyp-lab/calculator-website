import { describe, it, expect } from 'vitest';
import { calculateVat } from '@/lib/calculators/vat';

describe('calculateVat - הוספה', () => {
  it('הוספת מע"מ ב-18% ל-1000 ₪', () => {
    const result = calculateVat({ amount: 1000, mode: 'add', rate: 0.18 });
    expect(result.amountWithoutVat).toBe(1000);
    expect(result.vatAmount).toBeCloseTo(180, 2);
    expect(result.amountWithVat).toBeCloseTo(1180, 2);
  });

  it('הוספת מע"מ ל-0', () => {
    const result = calculateVat({ amount: 0, mode: 'add' });
    expect(result.amountWithoutVat).toBe(0);
    expect(result.vatAmount).toBe(0);
    expect(result.amountWithVat).toBe(0);
  });

  it('שיעור ברירת מחדל הוא 18%', () => {
    const result = calculateVat({ amount: 100, mode: 'add' });
    expect(result.vatRate).toBe(0.18);
    expect(result.amountWithVat).toBeCloseTo(118, 2);
  });

  it('שיעור 0%', () => {
    const result = calculateVat({ amount: 100, mode: 'add', rate: 0 });
    expect(result.vatAmount).toBe(0);
    expect(result.amountWithVat).toBe(100);
  });
});

describe('calculateVat - חילוץ', () => {
  it('חילוץ מע"מ מ-1180 ₪', () => {
    const result = calculateVat({ amount: 1180, mode: 'extract', rate: 0.18 });
    expect(result.amountWithoutVat).toBeCloseTo(1000, 0);
    expect(result.vatAmount).toBeCloseTo(180, 0);
    expect(result.amountWithVat).toBe(1180);
  });

  it('חילוץ מע"מ ב-17%', () => {
    const result = calculateVat({ amount: 1170, mode: 'extract', rate: 0.17 });
    expect(result.amountWithoutVat).toBeCloseTo(1000, 0);
    expect(result.vatAmount).toBeCloseTo(170, 0);
  });

  it('חילוץ ב-0%', () => {
    const result = calculateVat({ amount: 100, mode: 'extract', rate: 0 });
    expect(result.amountWithoutVat).toBe(100);
    expect(result.vatAmount).toBe(0);
  });
});

describe('calculateVat - עקביות', () => {
  it('הוספה ואז חילוץ מחזיר את הסכום המקורי', () => {
    const original = 1000;
    const added = calculateVat({ amount: original, mode: 'add', rate: 0.18 });
    const extracted = calculateVat({ amount: added.amountWithVat, mode: 'extract', rate: 0.18 });
    expect(extracted.amountWithoutVat).toBeCloseTo(original, 2);
  });
});
