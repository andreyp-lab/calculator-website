/**
 * דפי ארנונה לפי עיר (`/real-estate/arnona/[city]`) — נגזרים מ-`ARNONA_CITIES` ומ-`ARNONA_BUSINESS_CITIES`.
 * אין כאן תעריפים: כל מספר מגיע מהנתונים המאומתים. עיר חדשה בנתונים → דף חדש אוטומטית.
 */

import type { ArnonaZoneRate } from '@/lib/calculators/arnona';
import { ARNONA_CITIES, type ArnonaCity } from '@/lib/data/arnona-rates';
import { ARNONA_BUSINESS_CITIES } from '@/lib/data/arnona-business-rates';

export interface ArnonaCityPage {
  slug: string;
  name: string;
  /** מערך הנתונים של הצו שבתוקף (2026) לחישוב ולטבלה */
  current: ArnonaCity;
  /** צו עתידי (2027), אם קיים */
  upcoming?: ArnonaCity;
  businessCityId?: string;
}

const SLUGS: Record<string, string> = {
  'תל אביב-יפו': 'tel-aviv',
  'חיפה': 'haifa',
  'ראשון לציון': 'rishon-lezion',
  'פתח תקווה': 'petah-tikva',
  'רמת גן': 'ramat-gan',
  'באר שבע': 'beer-sheva',
};

export const ARNONA_CITY_PAGES: ArnonaCityPage[] = Object.entries(SLUGS)
  .map(([name, slug]): ArnonaCityPage | null => {
    const current = ARNONA_CITIES.find((c) => c.name === name && c.status !== 'pending-approval');
    if (!current) return null;
    return {
      slug,
      name,
      current,
      upcoming: ARNONA_CITIES.find((c) => c.name === name && c.status === 'pending-approval'),
      businessCityId: ARNONA_BUSINESS_CITIES.find((c) => c.name === name)?.id,
    };
  })
  .filter((x): x is ArnonaCityPage => x !== null);

export const getArnonaCityPage = (slug: string) => ARNONA_CITY_PAGES.find((c) => c.slug === slug);

const money = (v: number) => v.toLocaleString('he-IL', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/** תיאור קריא של תעריף: אחיד, לפי טווח שטח (כל השטח) או לפי מדרגות (שולי). */
export function describeRate(rate: ArnonaZoneRate): string {
  if (rate.bands && rate.bands.length > 0) {
    const sorted = [...rate.bands].sort((a, b) => a.upToSqm - b.upToSqm);
    let prev = 0;
    return sorted
      .map((b) => {
        const label = Number.isFinite(b.upToSqm) ? (prev === 0 ? `עד ${b.upToSqm} מ״ר` : `${prev + 1}–${b.upToSqm} מ״ר`) : `מעל ${prev} מ״ר`;
        prev = Number.isFinite(b.upToSqm) ? b.upToSqm : prev;
        return `${label}: ${money(b.ratePerSqm)}`;
      })
      .join(' · ');
  }
  if (rate.tiers && rate.tiers.length > 0) {
    const sorted = [...rate.tiers].sort((a, b) => a.upToSqm - b.upToSqm);
    let prev = 0;
    return sorted
      .map((t) => {
        const label = Number.isFinite(t.upToSqm) ? (prev === 0 ? `100% הראשונים עד ${t.upToSqm} מ״ר` : `עד ${t.upToSqm} מ״ר`) : `כל מ״ר נוסף`;
        prev = Number.isFinite(t.upToSqm) ? t.upToSqm : prev;
        return `${label}: ${money(t.ratePerSqm)}`;
      })
      .join(' · ')
      .replace('100% הראשונים עד', 'ראשונים עד');
  }
  return typeof rate.ratePerSqm === 'number' ? money(rate.ratePerSqm) : '—';
}
