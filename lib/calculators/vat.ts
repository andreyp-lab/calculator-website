/**
 * חישוב מע"מ 2026
 *
 * מקור: רשות המסים, חוק מס ערך מוסף
 * שיעור מע"מ ב-2026: 18% (עלה מ-17% ב-1.1.2025)
 *
 * שני סוגי חישובים:
 * 1. הוספת מע"מ לסכום (סכום ללא מע"מ → סכום עם מע"מ)
 * 2. חילוץ מע"מ (סכום עם מע"מ → סכום ללא מע"מ)
 */

import { VAT_2026 } from '@/lib/constants/tax-2026';

export type VatMode = 'add' | 'extract';

export interface VatInput {
  amount: number;
  mode: VatMode;
  rate?: number; // ברירת מחדל: 18%
}

export interface VatResult {
  amountWithoutVat: number;
  vatAmount: number;
  amountWithVat: number;
  vatRate: number;
}

export function calculateVat(input: VatInput): VatResult {
  const rate = input.rate ?? VAT_2026.standard;
  const amount = Math.max(0, input.amount);

  if (input.mode === 'add') {
    // הוספת מע"מ - הסכום הוא ללא מע"מ
    const vatAmount = amount * rate;
    return {
      amountWithoutVat: amount,
      vatAmount,
      amountWithVat: amount + vatAmount,
      vatRate: rate,
    };
  } else {
    // חילוץ מע"מ - הסכום כולל מע"מ
    const amountWithoutVat = amount / (1 + rate);
    const vatAmount = amount - amountWithoutVat;
    return {
      amountWithoutVat,
      vatAmount,
      amountWithVat: amount,
      vatRate: rate,
    };
  }
}
