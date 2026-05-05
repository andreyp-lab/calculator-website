/**
 * מנוע חישוב תנאי תשלום מפוצלים.
 *
 * תומך בשני מצבים:
 * 1. simpleNet - מספר ימים אחיד (תאימות לאחור)
 * 2. installments - פיצול לאחוזים עם ימי דחייה שונים
 *    דוגמה: 30% נטו 30 + 50% נטו 60 + 20% נטו 90
 */

import type { PaymentTerms, PaymentTermInstallment } from './types';

export interface PaymentSchedule {
  monthOffset: number; // 0 = חודש החיוב, 1 = חודש הבא וכו'
  amount: number;
  installmentLabel?: string;
}

/**
 * מחשב לוח תשלומים: מתי כמה כסף מגיע (או יוצא) על סכום נתון.
 */
export function calculatePaymentSchedule(
  amount: number,
  terms: PaymentTerms,
  invoiceMonthIndex: number = 0,
): PaymentSchedule[] {
  // אם אין installments, תשלום אחיד
  if (!terms.installments || terms.installments.length === 0) {
    const monthOffset = Math.floor(terms.simpleNet / 30);
    return [
      {
        monthOffset: invoiceMonthIndex + monthOffset,
        amount,
      },
    ];
  }

  // פיצול
  const schedule: PaymentSchedule[] = [];
  let totalPct = 0;
  for (const inst of terms.installments) {
    totalPct += inst.percentage;
    const monthOffset = Math.floor(inst.daysOffset / 30);
    schedule.push({
      monthOffset: invoiceMonthIndex + monthOffset,
      amount: amount * (inst.percentage / 100),
      installmentLabel: inst.label,
    });
  }

  // נורמליזציה אם הסכום שגוי (לדוגמה 99% או 101%)
  if (Math.abs(totalPct - 100) > 0.01 && totalPct > 0) {
    const factor = 100 / totalPct;
    return schedule.map((s) => ({ ...s, amount: s.amount * factor }));
  }

  return schedule;
}

/**
 * ולידציה: סכום אחוזים = 100, אין כפילויות, ערכים סבירים.
 */
export function validatePaymentTerms(terms: PaymentTerms): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!terms.installments || terms.installments.length === 0) {
    if (terms.simpleNet < 0 || terms.simpleNet > 365) {
      errors.push('ימי תשלום חייבים להיות בטווח 0-365');
    }
    return { valid: errors.length === 0, errors };
  }

  // ולידציה לפיצולים
  let totalPct = 0;
  for (const inst of terms.installments) {
    if (inst.percentage <= 0 || inst.percentage > 100) {
      errors.push(`אחוז לא תקין: ${inst.percentage}%`);
    }
    if (inst.daysOffset < 0 || inst.daysOffset > 365) {
      errors.push(`ימים לא תקין: ${inst.daysOffset}`);
    }
    totalPct += inst.percentage;
  }

  if (Math.abs(totalPct - 100) > 0.5) {
    errors.push(`סכום אחוזים: ${totalPct.toFixed(1)}% (חייב להיות 100%)`);
  }

  return { valid: errors.length === 0, errors };
}

/**
 * תיאור מילולי של תנאי תשלום.
 * דוגמה: "30% נטו 30 + 70% נטו 60"
 */
export function describePaymentTerms(terms: PaymentTerms): string {
  if (!terms.installments || terms.installments.length === 0) {
    return terms.simpleNet === 0 ? 'מיידי' : `נטו ${terms.simpleNet}`;
  }
  return terms.installments
    .map((i) => `${i.percentage}% נטו ${i.daysOffset}`)
    .join(' + ');
}

/**
 * עוזר ליצירת תנאים נפוצים.
 */
export const COMMON_PAYMENT_TERMS: Record<string, PaymentTerms> = {
  immediate: { simpleNet: 0 },
  net30: { simpleNet: 30 },
  net60: { simpleNet: 60 },
  net90: { simpleNet: 90 },
  // 30% מקדמה + 70% נטו 30
  '30-70-30': {
    simpleNet: 30,
    installments: [
      { percentage: 30, daysOffset: 0, label: 'מקדמה' },
      { percentage: 70, daysOffset: 30, label: 'יתרה' },
    ],
  },
  // 50/50
  '50-50-30': {
    simpleNet: 30,
    installments: [
      { percentage: 50, daysOffset: 0, label: 'מקדמה' },
      { percentage: 50, daysOffset: 30, label: 'סופי' },
    ],
  },
  // 30/30/40 ל-90 יום
  'staged-90': {
    simpleNet: 60,
    installments: [
      { percentage: 30, daysOffset: 30, label: 'תשלום 1' },
      { percentage: 30, daysOffset: 60, label: 'תשלום 2' },
      { percentage: 40, daysOffset: 90, label: 'תשלום 3' },
    ],
  },
};

/**
 * המרה: מ-paymentTerms ישן (מספר) ל-PaymentTerms החדש.
 */
export function migrateLegacyPaymentTerms(legacy: number): PaymentTerms {
  return { simpleNet: legacy };
}

/**
 * חישוב ימי גבייה ממוצעים משוקללים (Weighted Average Days).
 * שימושי לחישוב DSO על מערכת תנאים מורכבת.
 */
export function calculateWeightedAverageDays(terms: PaymentTerms): number {
  if (!terms.installments || terms.installments.length === 0) {
    return terms.simpleNet;
  }
  let weighted = 0;
  let totalPct = 0;
  for (const inst of terms.installments) {
    weighted += inst.daysOffset * inst.percentage;
    totalPct += inst.percentage;
  }
  return totalPct > 0 ? weighted / totalPct : 0;
}
