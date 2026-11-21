import { describe, it, expect } from 'vitest';
import { arnonaIncomeDiscount, arnonaIncomeThresholds } from '@/lib/calculators/arnona-discount';
import { securitiesTax } from '@/lib/calculators/securities-tax';
import { linkToCpi } from '@/lib/calculators/cpi-linkage';

describe('arnona income discount (national 2026 table)', () => {
  it('thresholds match the Haifa 2026 order for one person', () => {
    expect(arnonaIncomeThresholds(1)).toEqual([3513, 4295, 5076, 5857]);
  });
  it('bands: up to threshold inclusive', () => {
    expect(arnonaIncomeDiscount({ householdSize: 1, avgMonthlyGrossIncome: 3513 })!.percent).toBe(90);
    expect(arnonaIncomeDiscount({ householdSize: 1, avgMonthlyGrossIncome: 3514 })!.percent).toBe(70);
    expect(arnonaIncomeDiscount({ householdSize: 1, avgMonthlyGrossIncome: 5076 })!.percent).toBe(50);
    expect(arnonaIncomeDiscount({ householdSize: 1, avgMonthlyGrossIncome: 5857 })!.percent).toBe(30);
    expect(arnonaIncomeDiscount({ householdSize: 1, avgMonthlyGrossIncome: 5858 })!.percent).toBe(0);
  });
  it('household of 4', () => {
    expect(arnonaIncomeDiscount({ householdSize: 4, avgMonthlyGrossIncome: 10000 })!.percent).toBe(70);
    expect(arnonaIncomeDiscount({ householdSize: 4, avgMonthlyGrossIncome: 14994 })!.percent).toBe(30);
  });
  it('10 or more persons add the per-person amount to the 9-person bounds', () => {
    expect(arnonaIncomeThresholds(10)).toEqual([15743 + 1125, 19243 + 1374, 22742 + 1624, 26240 + 1874]);
    expect(arnonaIncomeThresholds(11)![0]).toBe(15743 + 2 * 1125);
  });
  it('saving on a given arnona and the gap to the band edge', () => {
    const r = arnonaIncomeDiscount({ householdSize: 2, avgMonthlyGrossIncome: 5000, monthlyArnona: 400 })!;
    expect(r.percent).toBe(90);
    expect(r.monthlySaving).toBe(360);
    expect(r.annualSaving).toBe(4320);
    expect(r.nextThresholdGap).toBe(621);
  });
  it('invalid', () => {
    expect(arnonaIncomeDiscount({ householdSize: 0, avgMonthlyGrossIncome: 1000 })).toBeNull();
    expect(arnonaIncomeDiscount({ householdSize: 2, avgMonthlyGrossIncome: -1 })).toBeNull();
  });
});

describe('securities capital gains tax', () => {
  const base = { expenses: 0, otherAnnualIncome: 0 };
  it('25% on the real gain; the inflationary amount is exempt', () => {
    // רווח נומינלי 20,000; מדד +5% על 100,000 → סכום אינפלציוני 5,000; ריאלי 15,000 → מס 3,750
    const r = securitiesTax({ ...base, purchasePrice: 100000, salePrice: 120000, kind: 'real-25', cpiChangePct: 5 })!;
    expect(r.nominalGain).toBe(20000);
    expect(r.inflationaryAmount).toBe(5000);
    expect(r.taxableGain).toBe(15000);
    expect(r.capitalGainsTax).toBe(3750);
    expect(r.totalTax).toBe(3750);
    expect(r.netProceeds).toBe(116250);
  });
  it('the inflationary amount cannot exceed the nominal gain', () => {
    const r = securitiesTax({ ...base, purchasePrice: 100000, salePrice: 102000, kind: 'real-25', cpiChangePct: 5 })!;
    expect(r.inflationaryAmount).toBe(2000);
    expect(r.totalTax).toBe(0);
  });
  it('substantial shareholder 30%; unindexed 15% nominal ignores CPI', () => {
    expect(securitiesTax({ ...base, purchasePrice: 100000, salePrice: 120000, kind: 'substantial-30', cpiChangePct: 0 })!.capitalGainsTax).toBe(6000);
    const n = securitiesTax({ ...base, purchasePrice: 100000, salePrice: 120000, kind: 'nominal-15', cpiChangePct: 5 })!;
    expect(n.capitalGainsTax).toBe(3000);
    expect(n.inflationaryAmount).toBe(0);
  });
  it('expenses reduce the nominal gain; loss produces no tax', () => {
    expect(securitiesTax({ expenses: 1000, otherAnnualIncome: 0, purchasePrice: 100000, salePrice: 120000, kind: 'real-25', cpiChangePct: 0 })!.nominalGain).toBe(19000);
    const l = securitiesTax({ ...base, purchasePrice: 100000, salePrice: 90000, kind: 'real-25', cpiChangePct: 0 })!;
    expect(l.isLoss).toBe(true);
    expect(l.totalTax).toBe(0);
  });
  it('surtax: 5% on the part of the gain above the annual threshold', () => {
    // הכנסה אחרת 700,000, רווח ריאלי 100,000: מעל הסף 721,560 → 78,440; יסף 5% = 3,922
    const r = securitiesTax({ expenses: 0, otherAnnualIncome: 700000, purchasePrice: 0, salePrice: 100000, kind: 'real-25', cpiChangePct: 0 })!;
    expect(r.surtax).toBe(3922);
    expect(r.totalTax).toBe(25000 + 3922);
  });
  it('invalid', () => {
    expect(securitiesTax({ ...base, purchasePrice: -1, salePrice: 1, kind: 'real-25', cpiChangePct: 0 })).toBeNull();
  });
  it('works with the CPI series: change between purchase and sale months', () => {
    const link = linkToCpi({ amount: 100, fromMonth: '2024-03', toMonth: '2026-03' })!;
    const cpiPct = (link.ratio - 1) * 100;
    const r = securitiesTax({ ...base, purchasePrice: 100000, salePrice: 130000, kind: 'real-25', cpiChangePct: cpiPct })!;
    expect(r.inflationaryAmount).toBeCloseTo(100000 * (link.ratio - 1), 0);
    expect(r.taxableGain).toBeLessThan(30000);
  });
});
