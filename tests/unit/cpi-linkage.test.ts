import { describe, it, expect } from 'vitest';
import {
  addMonths,
  factorTo2018,
  indexIn2018Terms,
  knownIndexMonth,
  linkToCpi,
  supportedDateRange,
} from '@/lib/calculators/cpi-linkage';
import { CPI_LAST_MONTH, CPI_VALUES, baseOfMonth } from '@/lib/data/cpi-series';

describe('cpi helpers', () => {
  it('month arithmetic wraps years', () => {
    expect(addMonths('2020-03', -2)).toBe('2020-01');
    expect(addMonths('2020-01', -2)).toBe('2019-11');
    expect(addMonths('2026-10', 2)).toBe('2026-12');
    expect(addMonths('2026-12', 1)).toBe('2027-01');
  });

  it('known index is the index of month M-2', () => {
    expect(knownIndexMonth('2026-10')).toBe('2026-08');
    expect(knownIndexMonth('2025-01')).toBe('2024-11');
  });

  it('bases change every January, every other year', () => {
    expect(baseOfMonth('2020-12')).toBe('2018');
    expect(baseOfMonth('2021-01')).toBe('2020');
    expect(baseOfMonth('2022-12')).toBe('2020');
    expect(baseOfMonth('2023-01')).toBe('2022');
    expect(baseOfMonth('2024-12')).toBe('2022');
    expect(baseOfMonth('2025-01')).toBe('2024');
  });

  it('chaining factors multiply to the official 1.141 (2024→2018)', () => {
    expect(factorTo2018('2018')).toBe(1);
    expect(factorTo2018('2020')).toBeCloseTo(1.003, 6);
    expect(factorTo2018('2022')).toBeCloseTo(1.059 * 1.003, 6);
    expect(factorTo2018('2024')).toBeCloseTo(1.074 * 1.059 * 1.003, 6);
    expect(factorTo2018('2024')).toBeCloseTo(1.141, 3);
  });

  it('Oct 2026 expressed in older bases matches the values CBS shows', () => {
    expect(CPI_VALUES[CPI_LAST_MONTH] * 1.074).toBeCloseTo(112.9848, 4);
    expect(CPI_VALUES[CPI_LAST_MONTH] * 1.074 * 1.059).toBeCloseTo(119.6509, 3);
    expect(indexIn2018Terms('2026-10')).toBeCloseTo(120.0099, 3);
  });

  it('supported date range follows the data', () => {
    expect(supportedDateRange()).toEqual({ min: '2020-03', max: '2026-12' });
  });
});

describe('linkToCpi — matches the official CBS calculator', () => {
  it('1,000 ₪ from 03-2020 to 03-2026 = 1,173.73 (CBS calculator result)', () => {
    const r = linkToCpi({ amount: 1000, fromMonth: '2020-03', toMonth: '2026-03' })!;
    expect(r.fromIndexMonth).toBe('2020-01');
    expect(r.toIndexMonth).toBe('2026-01');
    expect(r.fromIndexPublished).toBe(100.4);
    expect(r.toIndexPublished).toBe(103.3);
    expect(r.crossedBase).toBe(true);
    expect(r.linkedAmount).toBe(1173.73);
    expect(r.changePct).toBe(17.4);
  });

  it('same base: simple ratio of published indices', () => {
    // תאריכים 03-2026 → 10-2026: מדד ינואר 103.3 → מדד אוגוסט 105.8
    const r = linkToCpi({ amount: 5000, fromMonth: '2026-03', toMonth: '2026-10' })!;
    expect(r.crossedBase).toBe(false);
    expect(r.ratio).toBeCloseTo(105.8 / 103.3, 10);
    expect(r.linkedAmount).toBe(5121.01);
  });

  it('same month gives the same amount', () => {
    const r = linkToCpi({ amount: 1234.56, fromMonth: '2024-06', toMonth: '2024-06' })!;
    expect(r.linkedAmount).toBe(1234.56);
    expect(r.changePct).toBe(0);
  });

  it('going backwards deflates', () => {
    const r = linkToCpi({ amount: 1000, fromMonth: '2026-10', toMonth: '2024-06' })!;
    expect(r.linkedAmount).toBeLessThan(1000);
  });

  it('crossing a base boundary uses the chain (Dec 2024 base-2022 → Jan 2025 base-2024)', () => {
    // date 12-2024 → index 2024-10 = 109.1 (base 2022). date 02-2025 → index 2024-12 = 108.4 (base 2022): same base
    const same = linkToCpi({ amount: 1000, fromMonth: '2024-12', toMonth: '2025-02' })!;
    expect(same.crossedBase).toBe(false);
    expect(same.linkedAmount).toBe(Math.round((108.4 / 109.1) * 100000) / 100);
    // date 03-2025 → index 2025-01 = 101.5 (base 2024): crossed
    const crossed = linkToCpi({ amount: 1000, fromMonth: '2024-12', toMonth: '2025-03' })!;
    expect(crossed.crossedBase).toBe(true);
    expect(crossed.ratio).toBeCloseTo((101.5 * 1.074) / 109.1, 10);
  });

  it('returns null outside the data or for bad input', () => {
    expect(linkToCpi({ amount: 1000, fromMonth: '2020-02', toMonth: '2026-03' })).toBeNull(); // index 2019-12 missing
    expect(linkToCpi({ amount: 1000, fromMonth: '2020-03', toMonth: '2027-01' })).toBeNull(); // index 2026-11 missing
    expect(linkToCpi({ amount: -5, fromMonth: '2020-03', toMonth: '2026-03' })).toBeNull();
    expect(linkToCpi({ amount: 5, fromMonth: '2020-3', toMonth: '2026-03' })).toBeNull();
    expect(linkToCpi({ amount: NaN, fromMonth: '2020-03', toMonth: '2026-03' })).toBeNull();
  });
});
