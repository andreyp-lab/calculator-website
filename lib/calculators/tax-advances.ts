/**
 * מחשבון מקדמות מס לעצמאי - 2026
 *
 * עצמאי משלם מקדמות מס לאורך השנה כל חודש או דו-חודש.
 * המקדמות מבוססות על השכר הצפוי + ביטוח לאומי + מע"מ.
 *
 * רכיבי המקדמה:
 * 1. מס הכנסה לפי מדרגות (10%-50%)
 * 2. ביטוח לאומי + בריאות לעצמאי (~6.1%-17.83%)
 * 3. מע"מ (אם עוסק מורשה - 18% מההפרש)
 *
 * תיקון מקדמות: בסוף השנה - תיאום סופי
 *
 * תדירות:
 * - חודשי: עוסקים גדולים
 * - דו-חודשי: עוסקים בינוניים (ברירת מחדל)
 * - שנתי: עוסקים קטנים
 *
 * מקור: רשות המסים, ביטוח לאומי
 */

import {
  TAX_BRACKETS_2026,
  CREDIT_POINT_2026,
  SOCIAL_SECURITY_SELF_EMPLOYED_2026,
} from '@/lib/constants/tax-2026';

export type AdvanceFrequency = 'monthly' | 'bimonthly';

export interface TaxAdvancesInput {
  /** הכנסה שנתית צפויה (ברוטו - לאחר הוצאות מוכרות) */
  expectedAnnualIncome: number;
  /** נקודות זיכוי */
  creditPoints: number;
  /** האם עוסק מורשה (חייב מע"מ) */
  isVatRegistered: boolean;
  /** תדירות התשלום */
  frequency: AdvanceFrequency;
  /** מע"מ עסקאות שנתי משוער (אם עוסק מורשה) */
  annualVatCollected?: number;
  /** מע"מ תשומות שנתי משוער */
  annualVatDeductible?: number;
}

export interface TaxAdvancesResult {
  /** מס הכנסה שנתי */
  annualIncomeTax: number;
  /** ב.ל. + בריאות שנתי */
  annualSocialSecurity: number;
  /** מע"מ שנתי לתשלום */
  annualVatPayable: number;
  /** סך מקדמות שנתי */
  totalAnnual: number;
  /** מקדמה לפי תדירות */
  perPaymentAmount: number;
  /** מספר תשלומים בשנה */
  paymentsPerYear: number;
  /** פירוט פר תשלום */
  perPaymentBreakdown: {
    incomeTax: number;
    socialSecurity: number;
    vat: number;
  };
  /** שיעור מס מצרפי */
  effectiveTaxRate: number;
  /** המלצות */
  recommendations: string[];
}

function calculateIncomeTax(income: number, creditPoints: number): number {
  let remaining = income;
  let tax = 0;
  let prev = 0;
  for (const b of TAX_BRACKETS_2026) {
    if (remaining <= 0) break;
    const sz = b.upTo - prev;
    const t = Math.min(remaining, sz);
    tax += t * b.rate;
    remaining -= t;
    prev = b.upTo;
  }
  return Math.max(0, tax - creditPoints * CREDIT_POINT_2026.annual);
}

function calculateSelfEmployedSS(annualIncome: number): number {
  const reducedThreshold = 7_522 * 12; // 90,264
  const maxThreshold = 51_910 * 12; // 622,920
  const reducedRate = SOCIAL_SECURITY_SELF_EMPLOYED_2026.reducedRate.total;
  const fullRate = 0.1783; // 12.6% + 5.17%

  if (annualIncome <= reducedThreshold) return annualIncome * reducedRate;
  if (annualIncome <= maxThreshold)
    return reducedThreshold * reducedRate + (annualIncome - reducedThreshold) * fullRate;
  return reducedThreshold * reducedRate + (maxThreshold - reducedThreshold) * fullRate;
}

export function calculateTaxAdvances(input: TaxAdvancesInput): TaxAdvancesResult {
  const income = Math.max(0, input.expectedAnnualIncome);

  // 1. מס הכנסה
  const annualIncomeTax = calculateIncomeTax(income, input.creditPoints);

  // 2. ביטוח לאומי
  const annualSocialSecurity = calculateSelfEmployedSS(income);

  // 3. מע"מ
  let annualVatPayable = 0;
  if (input.isVatRegistered) {
    const vatCollected = input.annualVatCollected ?? 0;
    const vatDeductible = input.annualVatDeductible ?? 0;
    annualVatPayable = Math.max(0, vatCollected - vatDeductible);
  }

  const totalAnnual = annualIncomeTax + annualSocialSecurity + annualVatPayable;

  // תשלום לפי תדירות
  const paymentsPerYear = input.frequency === 'monthly' ? 12 : 6;
  const perPaymentAmount = totalAnnual / paymentsPerYear;

  const perPaymentBreakdown = {
    incomeTax: annualIncomeTax / paymentsPerYear,
    socialSecurity: annualSocialSecurity / paymentsPerYear,
    vat: annualVatPayable / paymentsPerYear,
  };

  const effectiveTaxRate = income > 0 ? totalAnnual / income : 0;

  const recommendations: string[] = [];

  if (effectiveTaxRate > 0.4) {
    recommendations.push(
      'שיעור מס גבוה - שקול הקמת חברה בע"מ. ראה את המחשבון "חברה vs עוסק".',
    );
  }

  if (input.isVatRegistered && annualVatPayable > 50_000) {
    recommendations.push(
      'מע"מ גבוה - בדוק שכל מע"מ התשומות מתועד ומקוזז (הוצאות עסקיות).',
    );
  }

  if (input.frequency === 'bimonthly' && totalAnnual > 60_000) {
    recommendations.push(
      'מקדמה דו-חודשית גבוהה - שקול לעבור לחודשי כדי לפזר את התזרים.',
    );
  }

  recommendations.push('שמור על הפקדה חודשית של ~30% מההכנסה לכיסוי המקדמות');

  return {
    annualIncomeTax,
    annualSocialSecurity,
    annualVatPayable,
    totalAnnual,
    perPaymentAmount,
    paymentsPerYear,
    perPaymentBreakdown,
    effectiveTaxRate,
    recommendations,
  };
}
