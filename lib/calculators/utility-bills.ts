/**
 * חשבון חשמל ומים ביתי — פונקציות טהורות. כל התעריפים מ-`lib/constants/utilities-2026.ts`,
 * מע"מ מ-`VAT_2026` ב-tax-2026.ts.
 */

import { VAT_2026 } from '@/lib/constants/tax-2026';
import { ELECTRICITY_HOUSEHOLD_2026, WATER_HOUSEHOLD_2026 } from '@/lib/constants/utilities-2026';

const round2 = (n: number) => Math.round(n * 100) / 100;

// ───────────────────────── חשמל ─────────────────────────

export interface ElectricityInput {
  /** צריכה בקוט"ש בתקופת החיוב */
  kwh: number;
  /** חודשי חיוב: 1 או 2 (חשבון דו־חודשי הוא הנהוג) */
  billingMonths: 1 | 2;
  phase: 'single' | 'three';
  /** גודל חיבור בקו"א אם ידוע (מופיע בחשבון) — 0 = לא כולל תשלום קיבולת */
  kva?: number;
  /** זכאי להנחת רווחה (50% על 400 קוט"ש ראשונים בחודש) */
  welfareDiscount?: boolean;
}

export interface ElectricityResult {
  energyBeforeDiscount: number;
  welfareDiscount: number;
  energy: number;
  fixed: number;
  capacity: number;
  beforeVat: number;
  vat: number;
  total: number;
  /** ₪ לקוט"ש כולל הכול */
  effectivePerKwh: number;
}

export function calculateElectricityBill(input: ElectricityInput): ElectricityResult | null {
  const { kwh, billingMonths, phase } = input;
  const kva = input.kva ?? 0;
  if (!Number.isFinite(kwh) || kwh < 0) return null;
  if (billingMonths !== 1 && billingMonths !== 2) return null;
  if (!Number.isFinite(kva) || kva < 0 || kva > 1000) return null;
  const e = ELECTRICITY_HOUSEHOLD_2026;
  const energyBeforeDiscount = (kwh * e.agorotPerKwh) / 100;
  let welfareDiscount = 0;
  if (input.welfareDiscount) {
    const discountedKwh = Math.min(kwh, e.welfareDiscountKwhPerMonth * billingMonths);
    welfareDiscount = ((discountedKwh * e.agorotPerKwh) / 100) * (e.welfareDiscountPct / 100);
  }
  // התשלום הקבוע מפורסם לחשבון דו־חודשי; בחיוב חודשי מחלקים לחצי
  const fixedPerBill = phase === 'single' ? e.fixedPerBillSinglePhase : e.fixedPerBillThreePhase;
  const fixed = fixedPerBill * (billingMonths / 2);
  const capacity = (kva * e.capacityPerKvaYear * billingMonths) / 12;
  const energy = energyBeforeDiscount - welfareDiscount;
  const beforeVat = energy + fixed + capacity;
  const vat = beforeVat * VAT_2026.standard;
  const total = beforeVat + vat;
  return {
    energyBeforeDiscount: round2(energyBeforeDiscount),
    welfareDiscount: round2(welfareDiscount),
    energy: round2(energy),
    fixed: round2(fixed),
    capacity: round2(capacity),
    beforeVat: round2(beforeVat),
    vat: round2(vat),
    total: round2(total),
    effectivePerKwh: kwh > 0 ? round2(total / kwh) : 0,
  };
}

// ───────────────────────── מים וביוב ─────────────────────────

export interface WaterInput {
  /** צריכה במ"ק בתקופת החיוב */
  m3: number;
  /** נפשות בדירה */
  persons: number;
  billingMonths: 1 | 2;
}

export interface WaterResult {
  quotaM3: number;
  atQuotaM3: number;
  aboveQuotaM3: number;
  atQuotaCost: number;
  aboveQuotaCost: number;
  beforeVat: number;
  vat: number;
  total: number;
  /** ₪ למ"ק כולל מע"מ */
  effectivePerM3: number;
}

/** מכסה: 3.5 מ"ק לנפש לחודש, לא פחות מ-7 מ"ק לחודש ליחידת דיור. */
export function waterQuotaM3(persons: number, billingMonths: 1 | 2): number {
  const w = WATER_HOUSEHOLD_2026;
  return Math.max(w.minQuotaM3PerMonth, w.quotaM3PerPersonPerMonth * persons) * billingMonths;
}

export function calculateWaterBill(input: WaterInput): WaterResult | null {
  const { m3, persons, billingMonths } = input;
  if (!Number.isFinite(m3) || m3 < 0) return null;
  if (!Number.isInteger(persons) || persons < 1 || persons > 30) return null;
  if (billingMonths !== 1 && billingMonths !== 2) return null;
  const w = WATER_HOUSEHOLD_2026;
  const quotaM3 = waterQuotaM3(persons, billingMonths);
  const atQuotaM3 = Math.min(m3, quotaM3);
  const aboveQuotaM3 = Math.max(0, m3 - quotaM3);
  const atQuotaCost = atQuotaM3 * w.quotaPricePerM3;
  const aboveQuotaCost = aboveQuotaM3 * w.aboveQuotaPricePerM3;
  const beforeVat = atQuotaCost + aboveQuotaCost;
  const vat = beforeVat * VAT_2026.standard;
  const total = beforeVat + vat;
  return {
    quotaM3: round2(quotaM3),
    atQuotaM3: round2(atQuotaM3),
    aboveQuotaM3: round2(aboveQuotaM3),
    atQuotaCost: round2(atQuotaCost),
    aboveQuotaCost: round2(aboveQuotaCost),
    beforeVat: round2(beforeVat),
    vat: round2(vat),
    total: round2(total),
    effectivePerM3: m3 > 0 ? round2(total / m3) : 0,
  };
}
