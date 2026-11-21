import { describe, it, expect } from 'vitest';
import { calculateArnona, arnonaBreakdown } from '@/lib/calculators/arnona';

describe('calculateArnona', () => {
  it('flat rate: area × rate, monthly and bimonthly', () => {
    const r = calculateArnona({ areaSqm: 100, zone: { ratePerSqm: 60 } })!;
    expect(r.grossAnnual).toBe(6000);
    expect(r.annual).toBe(6000);
    expect(r.monthly).toBe(500);
    expect(r.bimonthly).toBe(1000);
    expect(r.effectiveRatePerSqm).toBe(60);
  });

  it('tiers: splits area across tiers', () => {
    const zone = {
      tiers: [
        { upToSqm: 100, ratePerSqm: 50 },
        { upToSqm: Infinity, ratePerSqm: 80 },
      ],
    };
    const r = calculateArnona({ areaSqm: 130, zone })!;
    expect(r.breakdown).toHaveLength(2);
    expect(r.breakdown[0]).toMatchObject({ sqm: 100, annual: 5000 });
    expect(r.breakdown[1]).toMatchObject({ sqm: 30, annual: 2400 });
    expect(r.grossAnnual).toBe(7400);
  });

  it('area inside first tier uses only that tier', () => {
    const zone = {
      tiers: [
        { upToSqm: 100, ratePerSqm: 50 },
        { upToSqm: Infinity, ratePerSqm: 80 },
      ],
    };
    expect(arnonaBreakdown(60, zone)).toHaveLength(1);
    expect(calculateArnona({ areaSqm: 60, zone })!.grossAnnual).toBe(3000);
  });

  it('tiers given out of order are sorted', () => {
    const zone = {
      tiers: [
        { upToSqm: Infinity, ratePerSqm: 80 },
        { upToSqm: 100, ratePerSqm: 50 },
      ],
    };
    expect(calculateArnona({ areaSqm: 110, zone })!.grossAnnual).toBe(5000 + 800);
  });

  it('percent discount on all area', () => {
    const r = calculateArnona({
      areaSqm: 100,
      zone: { ratePerSqm: 60 },
      discount: { percent: 25 },
    })!;
    expect(r.discountAnnual).toBe(1500);
    expect(r.annual).toBe(4500);
    expect(r.monthly).toBe(375);
  });

  it('discount capped to first N sqm', () => {
    const r = calculateArnona({
      areaSqm: 120,
      zone: { ratePerSqm: 60 },
      discount: { percent: 50, maxSqm: 100 },
    })!;
    expect(r.grossAnnual).toBe(7200);
    expect(r.discountAnnual).toBe(3000); // 100 sqm × 60 × 50%
    expect(r.annual).toBe(4200);
  });

  it('discount cap across tiers uses each tier rate', () => {
    const zone = {
      tiers: [
        { upToSqm: 80, ratePerSqm: 40 },
        { upToSqm: Infinity, ratePerSqm: 100 },
      ],
    };
    const r = calculateArnona({
      areaSqm: 120,
      zone,
      discount: { percent: 100, maxSqm: 100 },
    })!;
    // discountable: 80×40 + 20×100 = 5200
    expect(r.discountAnnual).toBe(5200);
    expect(r.annual).toBe(r.grossAnnual - 5200);
  });

  it('discount percent above 100 is clamped', () => {
    const r = calculateArnona({
      areaSqm: 50,
      zone: { ratePerSqm: 10 },
      discount: { percent: 250 },
    })!;
    expect(r.annual).toBe(0);
  });

  it('bands: whole area at the band rate (not marginal); boundary is inclusive', () => {
    const zone = {
      bands: [
        { upToSqm: 140, ratePerSqm: 100 },
        { upToSqm: Infinity, ratePerSqm: 130 },
      ],
    };
    expect(calculateArnona({ areaSqm: 140, zone })!.grossAnnual).toBe(14000);
    expect(calculateArnona({ areaSqm: 141, zone })!.grossAnnual).toBe(18330);
    expect(calculateArnona({ areaSqm: 100, zone })!.breakdown).toHaveLength(1);
  });

  it('bands with discount cap use the band rate', () => {
    const zone = { bands: [{ upToSqm: Infinity, ratePerSqm: 100 }] };
    const r = calculateArnona({
      areaSqm: 120,
      zone,
      discount: { percent: 10, maxSqm: 100 },
    })!;
    expect(r.discountAnnual).toBe(1000);
  });

  it('invalid input returns null', () => {
    expect(calculateArnona({ areaSqm: 0, zone: { ratePerSqm: 60 } })).toBeNull();
    expect(calculateArnona({ areaSqm: -5, zone: { ratePerSqm: 60 } })).toBeNull();
    expect(calculateArnona({ areaSqm: NaN, zone: { ratePerSqm: 60 } })).toBeNull();
    expect(calculateArnona({ areaSqm: 80, zone: {} })).toBeNull();
  });
});
