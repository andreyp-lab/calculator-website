/**
 * מס רווחי הון על ניירות ערך — פונקציות טהורות.
 * כללים (מקור משני: בנק לאומי, ביזפורטל; לאימות מול רשות המסים):
 *  - נייר צמוד/זר/מניה: מס על הרווח הריאלי — 25%, ובעל מניות מהותי (10%+) 30%; הרווח האינפלציוני פטור.
 *  - נייר לא צמוד (למשל איגרת חוב שקלית): 15% על הרווח הנומינלי.
 *  - מס יסף: 3% על הכנסה חייבת מעל סף השנה, ועוד 2% על הכנסה הונית — `SURTAX_2026`.
 * הסכום האינפלציוני = מחיר רכישה × שינוי המדד מהרכישה עד המכירה, ואינו עולה על הרווח הנומינלי.
 */

import { SURTAX_2026 } from '@/lib/constants/tax-2026';

const round2 = (n: number) => Math.round(n * 100) / 100;
const ok = (...ns: number[]) => ns.every((n) => Number.isFinite(n));

export type SecurityKind = 'real-25' | 'substantial-30' | 'nominal-15';
export const SECURITY_RATES: Record<SecurityKind, { rate: number; real: boolean }> = {
  'real-25': { rate: 0.25, real: true },
  'substantial-30': { rate: 0.3, real: true },
  'nominal-15': { rate: 0.15, real: false },
};

export interface SecuritiesTaxInput {
  purchasePrice: number;
  salePrice: number;
  /** עמלות קנייה ומכירה */
  expenses: number;
  kind: SecurityKind;
  /** שינוי המדד מחודש הרכישה עד חודש המכירה, באחוזים (ישפיע רק בנייר ריאלי) */
  cpiChangePct: number;
  /** הכנסה חייבת אחרת בשנה, לחישוב מס יסף */
  otherAnnualIncome: number;
}

export interface SecuritiesTaxResult {
  nominalGain: number;
  inflationaryAmount: number;
  taxableGain: number;
  rate: number;
  capitalGainsTax: number;
  surtax: number;
  totalTax: number;
  netProceeds: number;
  isLoss: boolean;
}

export function securitiesTax(i: SecuritiesTaxInput): SecuritiesTaxResult | null {
  if (!ok(i.purchasePrice, i.salePrice, i.expenses, i.cpiChangePct, i.otherAnnualIncome)) return null;
  if (i.purchasePrice < 0 || i.salePrice < 0 || i.expenses < 0 || i.otherAnnualIncome < 0 || i.cpiChangePct < -50 || i.cpiChangePct > 1000) return null;
  const spec = SECURITY_RATES[i.kind];
  if (!spec) return null;
  const nominal = i.salePrice - i.purchasePrice - i.expenses;
  if (nominal <= 0) {
    return { nominalGain: round2(nominal), inflationaryAmount: 0, taxableGain: 0, rate: spec.rate, capitalGainsTax: 0, surtax: 0, totalTax: 0, netProceeds: round2(i.salePrice - i.expenses), isLoss: nominal < 0 };
  }
  const inflationary = spec.real ? Math.min(nominal, Math.max(0, (i.purchasePrice * i.cpiChangePct) / 100)) : 0;
  const taxable = nominal - inflationary;
  const tax = taxable * spec.rate;
  const above = Math.max(0, Math.min(taxable, i.otherAnnualIncome + taxable - SURTAX_2026.annualThreshold));
  const surtax = above * (SURTAX_2026.rate + SURTAX_2026.capitalGainsExtraRate);
  const total = tax + surtax;
  return {
    nominalGain: round2(nominal),
    inflationaryAmount: round2(inflationary),
    taxableGain: round2(taxable),
    rate: spec.rate,
    capitalGainsTax: round2(tax),
    surtax: round2(surtax),
    totalTax: round2(total),
    netProceeds: round2(i.salePrice - i.expenses - total),
    isLoss: false,
  };
}
