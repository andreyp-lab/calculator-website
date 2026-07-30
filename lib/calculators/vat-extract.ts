/**
 * חילוץ והוספת מע"מ — מנוע חישוב ייעודי
 *
 * מקור שיעור המע"מ: lib/constants/tax-2026.ts (VAT_2026.standard) — מקור אמת יחיד.
 * חוק מס ערך מוסף, תשל"ו-1975; רשות המסים.
 *
 * עיגול: כל התוצאות מעוגלות לאגורות (2 ספרות אחרי הנקודה), כך שתמיד
 * base + vat === gross בדיוק מלא (המע"מ מחושב כהפרש אחרי עיגול הבסיס).
 */

import { VAT_2026 } from '@/lib/constants/tax-2026';

/** שיעור המע"מ הרגיל (יובא מקובץ הקבועים — אין לשכפל את המספר) */
export const VAT_EXTRACT_RATE: number = VAT_2026.standard;

/** עיגול לאגורות (2 ספרות) */
export function roundAgorot(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export interface ExtractVatResult {
  /** הסכום ללא מע"מ (הבסיס) */
  base: number;
  /** רכיב המע"מ */
  vat: number;
  /** הסכום כולל מע"מ (הקלט) */
  gross: number;
  /** השיעור ששימש בחישוב */
  rate: number;
}

export interface AddVatResult {
  /** הסכום כולל מע"מ */
  gross: number;
  /** רכיב המע"מ */
  vat: number;
  /** הסכום ללא מע"מ (הקלט) */
  net: number;
  /** השיעור ששימש בחישוב */
  rate: number;
}

/**
 * חילוץ מע"מ מסכום שכולל מע"מ.
 * base = gross / (1 + rate), vat = gross - base (אחרי עיגול — כך שהסכום מתאזן).
 */
export function extractVat(grossAmount: number, rate: number = VAT_EXTRACT_RATE): ExtractVatResult {
  const gross = roundAgorot(Math.max(0, grossAmount));
  if (rate === 0) {
    return { base: gross, vat: 0, gross, rate };
  }
  const base = roundAgorot(gross / (1 + rate));
  const vat = roundAgorot(gross - base);
  return { base, vat, gross, rate };
}

/**
 * הוספת מע"מ לסכום נטו (ללא מע"מ).
 * vat = net × rate, gross = net + vat (אחרי עיגול — כך שהסכום מתאזן).
 */
export function addVat(netAmount: number, rate: number = VAT_EXTRACT_RATE): AddVatResult {
  const net = roundAgorot(Math.max(0, netAmount));
  const vat = roundAgorot(net * rate);
  const gross = roundAgorot(net + vat);
  return { gross, vat, net, rate };
}
