/**
 * המרת מטבע — פונקציות טהורות. השקל הוא מטבע הציר: שער = ₪ ל-1 יחידה של המטבע.
 * אין כאן שערים; הם מגיעים מ-`lib/data/exchange-rates.ts` (חיים) או מהמשתמש.
 */

export type RatesTable = Record<string, number | undefined>;

export interface ConvertInput {
  amount: number;
  from: string; // קוד מטבע או 'ILS'
  to: string;
  /** ₪ ל-1 יחידת מטבע; ILS מובן ללא רישום */
  ilsPerUnit: RatesTable;
  /** עמלה/מרווח של הבנק או חברת ההמרה, באחוזים מהסכום שמומר (0–20) */
  commissionPct?: number;
}

export interface ConvertResult {
  /** סכום ביעד לפי השער הרשמי, ללא עמלה */
  gross: number;
  commissionPct: number;
  /** עלות העמלה, במטבע היעד */
  commission: number;
  /** מה מקבלים בפועל אחרי העמלה */
  net: number;
  /** כמה יחידות יעד ל-1 יחידת מקור לפי השער הרשמי */
  midRate: number;
  /** שער אפקטיבי אחרי עמלה */
  effectiveRate: number;
}

const round = (n: number, d: number) => {
  const f = 10 ** d;
  return Math.round(n * f) / f;
};

function ilsValue(code: string, table: RatesTable): number | null {
  if (code === 'ILS') return 1;
  const v = table[code];
  return typeof v === 'number' && Number.isFinite(v) && v > 0 ? v : null;
}

/** מחזיר null אם הקלט לא תקין או שחסר שער. */
export function convertCurrency(input: ConvertInput): ConvertResult | null {
  const { amount, from, to, ilsPerUnit } = input;
  const commissionPct = input.commissionPct ?? 0;
  if (!Number.isFinite(amount) || amount < 0) return null;
  if (!Number.isFinite(commissionPct) || commissionPct < 0 || commissionPct > 20) return null;
  const fromIls = ilsValue(from, ilsPerUnit);
  const toIls = ilsValue(to, ilsPerUnit);
  if (fromIls === null || toIls === null) return null;
  const midRate = fromIls / toIls;
  const gross = amount * midRate;
  const commission = gross * (commissionPct / 100);
  const net = gross - commission;
  return {
    gross: round(gross, 2),
    commissionPct,
    commission: round(commission, 2),
    net: round(net, 2),
    midRate: round(midRate, 6),
    effectiveRate: round(midRate * (1 - commissionPct / 100), 6),
  };
}
