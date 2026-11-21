/**
 * מנוע חישוב ארנונה למגורים — פונקציות טהורות, ללא React.
 *
 * הארנונה נקבעת בצו הארנונה של כל רשות מקומית: תעריף למ"ר לשנה לפי אזור, ולעיתים
 * מדרגות לפי שטח. המנוע לא מכיר ערים; הוא מקבל תעריפים מ-`lib/data/arnona-rates.ts`
 * (נתונים עם מקור ותאריך אימות) ולכן אין בו שום מספר כספי.
 */

/** מדרגת שטח: `upToSqm` הוא הגבול העליון המצטבר (Infinity לשאר השטח). */
export interface ArnonaTier {
  upToSqm: number;
  /** ₪ למ"ר לשנה */
  ratePerSqm: number;
}

export interface ArnonaZoneRate {
  /** תעריף אחיד ₪ למ"ר לשנה, כשאין מדרגות */
  ratePerSqm?: number;
  /**
   * תעריף לפי טווח שטח **כולל** (לא שולי): כל השטח מחויב בתעריף הטווח שבו הוא נופל,
   * למשל "דירות עד 140 מ"ר" מול "דירות מעל 140 מ"ר". הטווח נבחר לפי הקטן ביותר שבו
   * `areaSqm <= upToSqm`. גובר על `tiers` ו-`ratePerSqm`.
   */
  bands?: ArnonaTier[];
  /** מדרגות לפי שטח, בסדר עולה. אם קיימות, גוברות על `ratePerSqm` */
  tiers?: ArnonaTier[];
}

export interface ArnonaDiscount {
  /** אחוז ההנחה, 0–100 */
  percent: number;
  /** ההנחה חלה רק על N המ"ר הראשונים (נהוג בהנחות סוציאליות). ללא ערך: על כל השטח */
  maxSqm?: number;
}

export interface ArnonaInput {
  areaSqm: number;
  zone: ArnonaZoneRate;
  discount?: ArnonaDiscount;
}

export interface ArnonaBreakdownRow {
  fromSqm: number;
  toSqm: number;
  sqm: number;
  ratePerSqm: number;
  annual: number;
}

export interface ArnonaResult {
  grossAnnual: number;
  discountAnnual: number;
  annual: number;
  monthly: number;
  bimonthly: number;
  breakdown: ArnonaBreakdownRow[];
  /** תעריף ממוצע אפקטיבי ₪ למ"ר לשנה אחרי הנחה */
  effectiveRatePerSqm: number;
}

const round2 = (n: number) => Math.round(n * 100) / 100;

function normalizeTiers(zone: ArnonaZoneRate): ArnonaTier[] {
  if (zone.tiers && zone.tiers.length > 0) {
    return [...zone.tiers].sort((a, b) => a.upToSqm - b.upToSqm);
  }
  if (typeof zone.ratePerSqm === 'number') {
    return [{ upToSqm: Infinity, ratePerSqm: zone.ratePerSqm }];
  }
  return [];
}

/** פירוט עלות לפי מדרגות עבור שטח נתון (לפני הנחה). */
export function arnonaBreakdown(areaSqm: number, zone: ArnonaZoneRate): ArnonaBreakdownRow[] {
  if (zone.bands && zone.bands.length > 0) {
    const band = [...zone.bands]
      .sort((a, b) => a.upToSqm - b.upToSqm)
      .find((b) => areaSqm <= b.upToSqm);
    if (!band || areaSqm <= 0) return [];
    return [
      {
        fromSqm: 0,
        toSqm: areaSqm,
        sqm: areaSqm,
        ratePerSqm: band.ratePerSqm,
        annual: round2(areaSqm * band.ratePerSqm),
      },
    ];
  }
  const tiers = normalizeTiers(zone);
  const rows: ArnonaBreakdownRow[] = [];
  let previous = 0;
  for (const tier of tiers) {
    if (areaSqm <= previous) break;
    const to = Math.min(areaSqm, tier.upToSqm);
    const sqm = to - previous;
    if (sqm > 0) {
      rows.push({
        fromSqm: previous,
        toSqm: to,
        sqm,
        ratePerSqm: tier.ratePerSqm,
        annual: round2(sqm * tier.ratePerSqm),
      });
    }
    previous = tier.upToSqm;
  }
  return rows;
}

/** מחזיר null כשהקלט לא תקין (שטח לא חיובי / אזור בלי תעריף). */
export function calculateArnona(input: ArnonaInput): ArnonaResult | null {
  const { areaSqm, zone, discount } = input;
  if (!Number.isFinite(areaSqm) || areaSqm <= 0) return null;
  const breakdown = arnonaBreakdown(areaSqm, zone);
  if (breakdown.length === 0) return null;

  const grossAnnual = round2(breakdown.reduce((sum, row) => sum + row.annual, 0));

  let discountAnnual = 0;
  if (discount && discount.percent > 0) {
    const percent = Math.min(100, discount.percent) / 100;
    const cap = discount.maxSqm ?? Infinity;
    let discountable = 0;
    for (const row of breakdown) {
      const sqmInCap = Math.max(0, Math.min(row.toSqm, cap) - row.fromSqm);
      discountable += sqmInCap * row.ratePerSqm;
    }
    discountAnnual = round2(discountable * percent);
  }

  const annual = round2(grossAnnual - discountAnnual);
  return {
    grossAnnual,
    discountAnnual,
    annual,
    monthly: round2(annual / 12),
    bimonthly: round2(annual / 6),
    breakdown,
    effectiveRatePerSqm: round2(annual / areaSqm),
  };
}
