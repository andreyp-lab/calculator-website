/**
 * שערי חליפין חיים — שרת בלבד (fetch עם ISR).
 *
 * מקור ראשי: שער יציג של בנק ישראל (PublicApi/GetExchangeRates).
 * גיבוי: open.er-api.com (חינמי, ללא מפתח). אין שערי ברירת מחדל קבועים: אם שני המקורות נכשלים
 * מחזירים null והמסך מציג הודעה, כדי לא להציג שער ישן כאילו הוא עדכני.
 *
 * שערים כאן הם ₪ ל-1 יחידת מטבע (שער בנק ישראל ליחידות של 100/10 מנורמל ליחידה אחת).
 */

export const EXCHANGE_REVALIDATE_SECONDS = 21600; // 6 שעות

export type CurrencyCode =
  | 'USD' | 'EUR' | 'GBP' | 'CHF' | 'JPY' | 'AUD' | 'CAD'
  | 'DKK' | 'NOK' | 'SEK' | 'ZAR' | 'JOD' | 'EGP';

/** שמות תצוגה בלבד (לא נתון כספי). */
export const CURRENCY_NAMES: Record<CurrencyCode, string> = {
  USD: 'דולר אמריקאי',
  EUR: 'אירו',
  GBP: 'לירה שטרלינג',
  CHF: 'פרנק שוויצרי',
  JPY: 'ין יפני',
  AUD: 'דולר אוסטרלי',
  CAD: 'דולר קנדי',
  DKK: 'כתר דני',
  NOK: 'כתר נורווגי',
  SEK: 'כתר שוודי',
  ZAR: 'ראנד דרום אפריקאי',
  JOD: 'דינר ירדני',
  EGP: 'לירה מצרית',
};

export const CURRENCY_CODES = Object.keys(CURRENCY_NAMES) as CurrencyCode[];

export interface ExchangeRates {
  /** ₪ ל-1 יחידת מטבע */
  ilsPerUnit: Partial<Record<CurrencyCode, number>>;
  source: 'boi' | 'open-er-api';
  /** ISO — מתי המקור עדכן את השער */
  updatedAt: string | null;
  sourceUrl: string;
}

const BOI_URL = 'https://boi.org.il/PublicApi/GetExchangeRates';
const ER_URL = 'https://open.er-api.com/v6/latest/ILS';

const isCode = (k: string): k is CurrencyCode => (CURRENCY_CODES as string[]).includes(k);

async function fromBoi(): Promise<ExchangeRates | null> {
  try {
    const res = await fetch(BOI_URL, { next: { revalidate: EXCHANGE_REVALIDATE_SECONDS } });
    if (!res.ok) return null;
    const data = await res.json();
    const list: unknown = data?.exchangeRates;
    if (!Array.isArray(list)) return null;
    const ilsPerUnit: ExchangeRates['ilsPerUnit'] = {};
    let updatedAt: string | null = null;
    for (const row of list) {
      const key = String(row?.key);
      const rate = Number(row?.currentExchangeRate);
      const unit = Number(row?.unit) || 1;
      if (!isCode(key) || !(rate > 0)) continue;
      ilsPerUnit[key] = rate / unit;
      if (typeof row?.lastUpdate === 'string') updatedAt = row.lastUpdate;
    }
    if (!ilsPerUnit.USD) return null;
    return { ilsPerUnit, source: 'boi', updatedAt, sourceUrl: 'https://www.boi.org.il/roles/markets/exchange-rates/' };
  } catch {
    return null;
  }
}

async function fromErApi(): Promise<ExchangeRates | null> {
  try {
    const res = await fetch(ER_URL, { next: { revalidate: EXCHANGE_REVALIDATE_SECONDS } });
    if (!res.ok) return null;
    const data = await res.json();
    const rates = data?.rates;
    if (!rates || typeof rates !== 'object') return null;
    const ilsPerUnit: ExchangeRates['ilsPerUnit'] = {};
    for (const code of CURRENCY_CODES) {
      const perIls = Number(rates[code]);
      if (perIls > 0) ilsPerUnit[code] = 1 / perIls;
    }
    if (!ilsPerUnit.USD) return null;
    const t = Number(data?.time_last_update_unix);
    return {
      ilsPerUnit,
      source: 'open-er-api',
      updatedAt: t > 0 ? new Date(t * 1000).toISOString() : null,
      sourceUrl: 'https://open.er-api.com',
    };
  } catch {
    return null;
  }
}

/** מחזיר שערים חיים או null אם אף מקור לא זמין. */
export async function getExchangeRates(): Promise<ExchangeRates | null> {
  return (await fromBoi()) ?? (await fromErApi());
}
