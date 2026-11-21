import { describe, it, expect } from 'vitest';
import { convertCurrency } from '@/lib/calculators/currency';

const table = { USD: 3.5, EUR: 4, JPY: 0.025 };

describe('convertCurrency', () => {
  it('foreign → ILS', () => {
    const r = convertCurrency({ amount: 100, from: 'USD', to: 'ILS', ilsPerUnit: table })!;
    expect(r.gross).toBe(350);
    expect(r.net).toBe(350);
    expect(r.midRate).toBe(3.5);
  });

  it('ILS → foreign', () => {
    const r = convertCurrency({ amount: 350, from: 'ILS', to: 'USD', ilsPerUnit: table })!;
    expect(r.gross).toBe(100);
  });

  it('cross rate through ILS', () => {
    const r = convertCurrency({ amount: 100, from: 'EUR', to: 'USD', ilsPerUnit: table })!;
    expect(r.gross).toBe(114.29); // 100 × 4 / 3.5
    expect(r.midRate).toBe(1.142857);
  });

  it('commission reduces what you receive', () => {
    const r = convertCurrency({ amount: 1000, from: 'USD', to: 'ILS', ilsPerUnit: table, commissionPct: 2 })!;
    expect(r.gross).toBe(3500);
    expect(r.commission).toBe(70);
    expect(r.net).toBe(3430);
    expect(r.effectiveRate).toBe(3.43);
  });

  it('same currency is identity', () => {
    expect(convertCurrency({ amount: 50, from: 'USD', to: 'USD', ilsPerUnit: table })!.gross).toBe(50);
    expect(convertCurrency({ amount: 50, from: 'ILS', to: 'ILS', ilsPerUnit: table })!.gross).toBe(50);
  });

  it('zero amount is fine; invalid input returns null', () => {
    expect(convertCurrency({ amount: 0, from: 'USD', to: 'ILS', ilsPerUnit: table })!.gross).toBe(0);
    expect(convertCurrency({ amount: -1, from: 'USD', to: 'ILS', ilsPerUnit: table })).toBeNull();
    expect(convertCurrency({ amount: NaN, from: 'USD', to: 'ILS', ilsPerUnit: table })).toBeNull();
    expect(convertCurrency({ amount: 1, from: 'USD', to: 'ILS', ilsPerUnit: table, commissionPct: 21 })).toBeNull();
    expect(convertCurrency({ amount: 1, from: 'XXX', to: 'ILS', ilsPerUnit: table })).toBeNull();
    expect(convertCurrency({ amount: 1, from: 'USD', to: 'ILS', ilsPerUnit: { USD: 0 } })).toBeNull();
  });
});
