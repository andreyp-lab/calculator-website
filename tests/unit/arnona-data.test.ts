import { describe, it, expect } from 'vitest';
import { ARNONA_CITIES } from '@/lib/data/arnona-rates';
import { calculateArnona } from '@/lib/calculators/arnona';

describe('arnona data integrity', () => {
  it('ids are unique and every city has a source, date and zones', () => {
    const ids = ARNONA_CITIES.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const c of ARNONA_CITIES) {
      expect(c.sourceUrl).toMatch(/^https:\/\//);
      expect(c.verifiedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(c.zones.length).toBeGreaterThan(0);
    }
  });

  it('every zone yields a positive result for every class', () => {
    for (const c of ARNONA_CITIES) {
      for (const z of c.zones) {
        const rates = z.rateByClass ? Object.entries(z.rateByClass) : [['-', z.rate!] as const];
        if (z.rateByClass) {
          const known = (c.classes ?? []).map((k) => k.id);
          for (const key of Object.keys(z.rateByClass)) expect(known).toContain(key);
          expect(Object.keys(z.rateByClass).length).toBeGreaterThan(0);
        }
        for (const [, rate] of rates) {
          const r = calculateArnona({ areaSqm: 80, zone: rate });
          expect(r, `${c.id}/${z.id}`).not.toBeNull();
          expect(r!.annual).toBeGreaterThan(0);
        }
      }
    }
  });

  it('discounts are within 0-100 and caps are positive', () => {
    for (const c of ARNONA_CITIES) {
      for (const d of c.discounts ?? []) {
        expect(d.percent).toBeGreaterThan(0);
        expect(d.percent).toBeLessThanOrEqual(100);
        if (d.maxSqm !== undefined) expect(d.maxSqm).toBeGreaterThan(0);
      }
    }
  });

  it('Tel Aviv 2027 = 2026 + 3.05% (within a rounding agorot) for all published rates', () => {
    const a = ARNONA_CITIES.find((c) => c.id === 'tel-aviv-2026')!;
    const b = ARNONA_CITIES.find((c) => c.id === 'tel-aviv-2027')!;
    const flat = (rate: { bands?: { ratePerSqm: number }[]; ratePerSqm?: number }) =>
      rate.bands ? rate.bands.map((x) => x.ratePerSqm) : [rate.ratePerSqm!];
    for (const [zi, za] of a.zones.entries()) {
      for (const [cls, rate] of Object.entries(za.rateByClass!)) {
        const r27 = flat(b.zones[zi].rateByClass![cls]);
        flat(rate).forEach((v26, i) => {
          expect(Math.abs(v26 * 1.0305 - r27[i])).toBeLessThan(0.02);
        });
      }
    }
  });

  it('Tel Aviv 2026 spot checks against the order table', () => {
    const c = ARNONA_CITIES.find((x) => x.id === 'tel-aviv-2026')!;
    const z1 = c.zones.find((z) => z.id === 'z1')!.rateByClass!.aa;
    // 100 מ"ר באזור 1, סוג אא: 112.99 → 11,299 לשנה
    expect(calculateArnona({ areaSqm: 100, zone: z1 })!.grossAnnual).toBe(11299);
    // מעל 140 מ"ר כל השטח בתעריף הגבוה: 150 × 139.60
    expect(calculateArnona({ areaSqm: 150, zone: z1 })!.grossAnnual).toBe(20940);
  });

  it('Haifa 2027 = 2026 + 3.05% (within 2 agorot) for every published rate', () => {
    const a = ARNONA_CITIES.find((c) => c.id === 'haifa-2026')!;
    const b = ARNONA_CITIES.find((c) => c.id === 'haifa-2027')!;
    const all = (r: { bands?: { ratePerSqm: number }[]; tiers?: { ratePerSqm: number }[]; ratePerSqm?: number }) =>
      r.bands ? r.bands.map((x) => x.ratePerSqm) : r.tiers ? r.tiers.map((x) => x.ratePerSqm) : [r.ratePerSqm!];
    for (const [zi, za] of a.zones.entries()) {
      for (const [cls, rate] of Object.entries(za.rateByClass!)) {
        const r27 = all(b.zones[zi].rateByClass![cls]);
        all(rate).forEach((v26, i) => {
          expect(Math.abs(v26 * 1.0305 - r27[i]), `${za.id}/${cls}`).toBeLessThan(0.02);
        });
      }
    }
  });

  it('Haifa 2026 spot checks against the order table', () => {
    const c = ARNONA_CITIES.find((x) => x.id === 'haifa-2026')!;
    const zA = c.zones[0].rateByClass!;
    // מ2 אזור א׳, 90 מ"ר (76–100): 90 × 103.94
    expect(calculateArnona({ areaSqm: 90, zone: zA.m2 })!.grossAnnual).toBe(9354.6);
    // מ1 אזור א׳, 120 מ"ר: 100×119.57 + 20×125.59
    expect(calculateArnona({ areaSqm: 120, zone: zA.m1 })!.grossAnnual).toBe(11957 + 2511.8);
    // אין מ1 באזור ד׳
    expect(c.zones[3].rateByClass!.m1).toBeUndefined();
  });

  it('spot checks for the other 2026 orders', () => {
    const get = (id: string) => ARNONA_CITIES.find((c) => c.id === id)!;
    // ראשון לציון: אזור א׳, סוג א׳, 90 מ"ר × 69.69
    expect(calculateArnona({ areaSqm: 90, zone: get('rishon-2026').zones[0].rateByClass!.a })!.grossAnnual).toBe(6272.1);
    // פתח תקווה: אזור ב, סוג א, 100 מ"ר × 69.65
    expect(calculateArnona({ areaSqm: 100, zone: get('petah-tikva-2026').zones[1].rateByClass!.a })!.grossAnnual).toBe(6965);
    // רמת גן: אזור ב׳ (אינדקס 2), סוג א, 80 מ"ר × 83.35; אין סוג ב׳ באזור א׳+
    const rg = get('ramat-gan-2026');
    expect(calculateArnona({ areaSqm: 80, zone: rg.zones[2].rateByClass!.a })!.grossAnnual).toBe(6668);
    expect(rg.zones[0].rateByClass!.b).toBeUndefined();
    // באר שבע: אזור א׳, דירה עד 57 מ"ר בתעריף נמוך לכל השטח; מעל 57 בתעריף גבוה לכל השטח
    const bs = get('beer-sheva-2026').zones[0].rate!;
    expect(calculateArnona({ areaSqm: 57, zone: bs })!.grossAnnual).toBe(2960.58);
    expect(calculateArnona({ areaSqm: 58, zone: bs })!.grossAnnual).toBe(3380.24);
  });
});
