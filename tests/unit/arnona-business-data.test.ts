import { describe, it, expect } from 'vitest';
import {
  ARNONA_BUSINESS_CITIES,
  businessRate,
  classesForUse,
  zonesForUse,
} from '@/lib/data/arnona-business-rates';
import { calculateArnona } from '@/lib/calculators/arnona';

const city = (id: string) => ARNONA_BUSINESS_CITIES.find((c) => c.id === id)!;
const use = (c: ReturnType<typeof city>, id: string) => c.uses.find((u) => u.id === id)!;

describe('business arnona data integrity', () => {
  it('unique ids, sources and verification dates', () => {
    const ids = ARNONA_BUSINESS_CITIES.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const c of ARNONA_BUSINESS_CITIES) {
      expect(c.sourceUrl).toMatch(/^https:\/\//);
      expect(c.verifiedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(c.year).toBe(2026);
      expect(c.uses.length).toBeGreaterThan(0);
    }
  });

  it('every use × zone × class that is declared resolves to a computable rate', () => {
    for (const c of ARNONA_BUSINESS_CITIES) {
      for (const u of c.uses) {
        const zones = zonesForUse(c, u);
        const classes = classesForUse(c, u);
        let found = 0;
        for (const z of zones) {
          for (const k of classes ?? [undefined]) {
            const rate = businessRate(u, z.id, k?.id);
            if (!rate) continue;
            found++;
            const r = calculateArnona({ areaSqm: 20, zone: rate });
            expect(r, `${c.id}/${u.id}/${z.id}/${k?.id}`).not.toBeNull();
            expect(r!.annual).toBeGreaterThan(0);
          }
        }
        expect(found, `${c.id}/${u.id}`).toBeGreaterThan(0);
      }
    }
  });

  it('every rate key refers to a real zone/class', () => {
    for (const c of ARNONA_BUSINESS_CITIES) {
      for (const u of c.uses) {
        const zoneIds = new Set([...zonesForUse(c, u).map((z) => z.id), '*']);
        for (const key of Object.keys(u.rates ?? {})) expect(zoneIds.has(key), `${c.id}/${u.id}/${key}`).toBe(true);
        for (const key of Object.keys(u.ratesByClass ?? {})) expect(zoneIds.has(key)).toBe(true);
        const classIds = new Set((classesForUse(c, u) ?? []).map((k) => k.id));
        for (const byClass of Object.values(u.ratesByClass ?? {})) {
          for (const k of Object.keys(byClass)) expect(classIds.has(k), `${c.id}/${u.id}/${k}`).toBe(true);
        }
      }
    }
  });
});

describe('business arnona spot checks against the 2026 orders', () => {
  it('Tel Aviv: uniform rate, industry tiers, warehouse tiers', () => {
    const t = city('tel-aviv-business-2026');
    expect(calculateArnona({ areaSqm: 100, zone: businessRate(use(t, 'office-retail'), 'z1')! })!.grossAnnual).toBe(44978);
    // תעשייה 250 מ"ר: 200×196.49 + 50×107.65
    expect(calculateArnona({ areaSqm: 250, zone: businessRate(use(t, 'industry'), 'z2')! })!.grossAnnual).toBe(
      200 * 196.49 + 50 * 107.65,
    );
    // מחסן 150 מ"ר באזור 3: 100×307.74 + 50×119.66
    expect(calculateArnona({ areaSqm: 150, zone: businessRate(use(t, 'warehouse'), 'z3')! })!.grossAnnual).toBe(
      30774 + 5983,
    );
    // בית קפה אזור 3 מופחת, באזור 1 כתעריף אחיד
    expect(businessRate(use(t, 'cafe'), 'z3')!.ratePerSqm).toBe(291.96);
    expect(businessRate(use(t, 'cafe'), 'z1')!.ratePerSqm).toBe(449.78);
  });

  it('Haifa: 40 sqm first tier then marginal rate, by class', () => {
    const h = city('haifa-business-2026');
    const rate = businessRate(use(h, 'office-retail'), 'a', 'ayin1')!;
    // 60 מ"ר: 40×383.10 + 20×267.30
    expect(calculateArnona({ areaSqm: 60, zone: rate })!.grossAnnual).toBe(15324 + 5346);
    expect(businessRate(use(h, 'office-retail'), 'a')).toBeUndefined(); // דורש סימול
  });

  it('Rishon: whole-area band by land-use zone for industry', () => {
    const r = city('rishon-business-2026');
    const rate = businessRate(use(r, 'industry'), 'resco')!;
    // 300 מ"ר בטווח 101–500: 300 × 192.65
    expect(calculateArnona({ areaSqm: 300, zone: rate })!.grossAnnual).toBe(57795);
  });

  it('Petah Tikva: band by whole area, class A offices zone A; beyond table returns null', () => {
    const p = city('petah-tikva-business-2026');
    const rate = businessRate(use(p, 'office'), 'a', 'A')!;
    expect(calculateArnona({ areaSqm: 70, zone: rate })!.grossAnnual).toBe(31402.7);
    expect(calculateArnona({ areaSqm: 30000, zone: rate })).toBeNull();
  });

  it('Ramat Gan: offices band; industry bands rise again above 1,000', () => {
    const g = city('ramat-gan-business-2026');
    expect(calculateArnona({ areaSqm: 200, zone: businessRate(use(g, 'office-retail'), 'b')! })!.grossAnnual).toBe(81254);
    expect(calculateArnona({ areaSqm: 1200, zone: businessRate(use(g, 'industry'), 'a')! })!.grossAnnual).toBe(215928);
  });

  it('Beer Sheva: retail marginal after 100 sqm; industry zone A three tiers; A1 has no office rate', () => {
    const b = city('beer-sheva-business-2026');
    expect(calculateArnona({ areaSqm: 120, zone: businessRate(use(b, 'retail'), 'a')! })!.grossAnnual).toBe(
      41571 + 20 * 364.09,
    );
    const ind = businessRate(use(b, 'industry'), 'ia')!;
    expect(calculateArnona({ areaSqm: 600, zone: ind })!.grossAnnual).toBe(250 * 193.06 + 250 * 99.98 + 100 * 59);
    expect(businessRate(use(b, 'office'), 'a1')).toBeUndefined();
  });

  it('business-setup-cost example: 60 sqm office/retail, Tel Aviv zone 2 = 1,875.35/month', () => {
    const t = city('tel-aviv-business-2026');
    const r = calculateArnona({ areaSqm: 60, zone: businessRate(use(t, 'office-retail'), 'z2')! })!;
    expect(r.annual).toBe(22504.2);
    expect(r.monthly).toBe(1875.35);
    expect(Math.round(r.monthly)).toBe(1875);
  });
});
