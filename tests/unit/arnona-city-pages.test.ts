import { describe, it, expect } from 'vitest';
import { ARNONA_CITY_PAGES, describeRate, getArnonaCityPage } from '@/lib/data/arnona-city-pages';
import { BUSINESS_TYPES } from '@/lib/data/business-setup/business-types';

describe('arnona city pages', () => {
  it('one page per city with an in-force 2026 order; slugs are unique', () => {
    expect(ARNONA_CITY_PAGES.length).toBe(6);
    expect(new Set(ARNONA_CITY_PAGES.map((c) => c.slug)).size).toBe(6);
    for (const c of ARNONA_CITY_PAGES) expect(c.current.year).toBe(2026);
    expect(getArnonaCityPage('tel-aviv')?.upcoming?.year).toBe(2027);
    expect(getArnonaCityPage('beer-sheva')?.upcoming).toBeUndefined();
    expect(getArnonaCityPage('nope')).toBeUndefined();
  });
  it('describeRate formats flat, banded and tiered rates', () => {
    expect(describeRate({ ratePerSqm: 78.39 })).toBe('78.39');
    expect(describeRate({ bands: [{ upToSqm: 140, ratePerSqm: 112.99 }, { upToSqm: Infinity, ratePerSqm: 139.6 }] })).toBe('עד 140 מ״ר: 112.99 · מעל 140 מ״ר: 139.60');
    expect(describeRate({ tiers: [{ upToSqm: 100, ratePerSqm: 119.57 }, { upToSqm: Infinity, ratePerSqm: 125.59 }] })).toContain('כל מ״ר נוסף: 125.59');
  });
});

describe('business guides', () => {
  it('slugs are unique and every guide has full content', () => {
    const slugs = BUSINESS_TYPES.map((b) => b.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    expect(slugs.length).toBeGreaterThanOrEqual(71);
    for (const b of BUSINESS_TYPES) {
      expect(b.name.length).toBeGreaterThan(2);
      expect(Object.keys(b.sections)).toHaveLength(7);
      expect(b.faq.length).toBeGreaterThan(0);
    }
  });
});
