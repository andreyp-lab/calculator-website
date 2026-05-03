/**
 * מחשבון מס רכישה 2026
 *
 * מקור: רשות המסים, מיסוי מקרקעין
 * מדרגות 2026 מאומתות
 */

import { PURCHASE_TAX_2026 } from '@/lib/constants/tax-2026';

export type BuyerType = 'first-home' | 'replacement' | 'investor' | 'oleh' | 'disabled';

export interface PurchaseTaxInput {
  propertyValue: number;
  buyerType: BuyerType;
  isYoung: boolean; // עולה חדש בשנים הראשונות (פטור מסויים)
}

export interface PurchaseTaxBreakdown {
  bracket: string;
  range: string;
  rate: number;
  amountInBracket: number;
  taxInBracket: number;
}

export interface PurchaseTaxResult {
  totalTax: number;
  effectiveRate: number; // % מהשווי הכולל
  breakdown: PurchaseTaxBreakdown[];
  fullExemption: boolean;
  partialExemption: boolean;
  notes: string[];
}

/**
 * חישוב מס רכישה - דירה ראשונה (תושב ישראל)
 */
function calculateFirstHomeTax(propertyValue: number): {
  totalTax: number;
  breakdown: PurchaseTaxBreakdown[];
} {
  const breakdown: PurchaseTaxBreakdown[] = [];
  let totalTax = 0;
  let previousLimit = 0;

  for (const bracket of PURCHASE_TAX_2026.firstHome) {
    if (propertyValue <= previousLimit) break;

    const taxableInBracket = Math.min(propertyValue, bracket.upTo) - previousLimit;
    const taxInBracket = taxableInBracket * bracket.rate;
    totalTax += taxInBracket;

    if (taxableInBracket > 0) {
      const upperLabel = bracket.upTo === Infinity ? '∞' : bracket.upTo.toLocaleString('he-IL');
      breakdown.push({
        bracket: `${(bracket.rate * 100).toFixed(1)}%`,
        range: `${previousLimit.toLocaleString('he-IL')} - ${upperLabel}`,
        rate: bracket.rate,
        amountInBracket: taxableInBracket,
        taxInBracket,
      });
    }

    if (propertyValue <= bracket.upTo) break;
    previousLimit = bracket.upTo;
  }

  return { totalTax, breakdown };
}

/**
 * חישוב מס רכישה - דירה נוספת / משקיע
 */
function calculateInvestorTax(propertyValue: number): {
  totalTax: number;
  breakdown: PurchaseTaxBreakdown[];
} {
  const breakdown: PurchaseTaxBreakdown[] = [];
  let totalTax = 0;
  let previousLimit = 0;

  for (const bracket of PURCHASE_TAX_2026.additionalHome) {
    if (propertyValue <= previousLimit) break;

    const taxableInBracket = Math.min(propertyValue, bracket.upTo) - previousLimit;
    const taxInBracket = taxableInBracket * bracket.rate;
    totalTax += taxInBracket;

    if (taxableInBracket > 0) {
      const upperLabel = bracket.upTo === Infinity ? '∞' : bracket.upTo.toLocaleString('he-IL');
      breakdown.push({
        bracket: `${(bracket.rate * 100).toFixed(1)}%`,
        range: `${previousLimit.toLocaleString('he-IL')} - ${upperLabel}`,
        rate: bracket.rate,
        amountInBracket: taxableInBracket,
        taxInBracket,
      });
    }

    if (propertyValue <= bracket.upTo) break;
    previousLimit = bracket.upTo;
  }

  return { totalTax, breakdown };
}

/**
 * חישוב מס רכישה כללי
 */
export function calculatePurchaseTax(input: PurchaseTaxInput): PurchaseTaxResult {
  const { propertyValue, buyerType, isYoung } = input;

  if (propertyValue <= 0) {
    return {
      totalTax: 0,
      effectiveRate: 0,
      breakdown: [],
      fullExemption: false,
      partialExemption: false,
      notes: [],
    };
  }

  const notes: string[] = [];
  let result: { totalTax: number; breakdown: PurchaseTaxBreakdown[] };

  if (buyerType === 'first-home' || buyerType === 'replacement') {
    result = calculateFirstHomeTax(propertyValue);
    if (buyerType === 'replacement') {
      notes.push('מחליף דירה - אותן מדרגות אבל יש להחזיק/למכור במגבלות זמן');
    }
  } else if (buyerType === 'investor') {
    result = calculateInvestorTax(propertyValue);
    notes.push('דירה להשקעה / נוספת - מדרגות גבוהות יותר ללא פטור');
  } else if (buyerType === 'oleh') {
    // עולה חדש - הקלות מיוחדות (פטור עד תקרה ושיעור מופחת)
    if (propertyValue <= 1_978_745) {
      result = { totalTax: 0, breakdown: [] };
      notes.push('עולה חדש - פטור מלא עד 1,978,745 ₪');
    } else {
      // עולה חדש - 0.5% עד 5 מיליון, 5% מעבר לכך (בערך)
      const lowerBracket = Math.min(propertyValue, 5_000_000) - 0;
      const upperBracket = Math.max(0, propertyValue - 5_000_000);
      const tax = lowerBracket * 0.005 + upperBracket * 0.05;
      result = {
        totalTax: tax,
        breakdown: [
          {
            bracket: '0.5%',
            range: `0 - 5,000,000`,
            rate: 0.005,
            amountInBracket: lowerBracket,
            taxInBracket: lowerBracket * 0.005,
          },
          ...(upperBracket > 0
            ? [
                {
                  bracket: '5%',
                  range: `5,000,000+`,
                  rate: 0.05,
                  amountInBracket: upperBracket,
                  taxInBracket: upperBracket * 0.05,
                },
              ]
            : []),
        ],
      };
      notes.push('עולה חדש - שיעור מופחת 0.5% עד 5 מיליון');
    }
    if (isYoung) {
      notes.push('עולה חדש בשנותיו הראשונות - יתכנו הקלות נוספות');
    }
  } else {
    // disabled - פטורים מוגברים
    if (propertyValue <= 2_500_000) {
      result = { totalTax: 0, breakdown: [] };
      notes.push('נכה / נפגע פעולת איבה - פטור מוגבר עד 2,500,000 ₪');
    } else {
      result = calculateFirstHomeTax(propertyValue);
      notes.push('נכה - יתכנו הקלות נוספות מעבר למדרגות הסטנדרטיות');
    }
  }

  const fullExemption = result.totalTax === 0;
  const partialExemption =
    result.totalTax > 0 && result.breakdown.some((b) => b.rate === 0);
  const effectiveRate = (result.totalTax / propertyValue) * 100;

  return {
    totalTax: result.totalTax,
    effectiveRate,
    breakdown: result.breakdown,
    fullExemption,
    partialExemption,
    notes,
  };
}

export const BUYER_TYPE_LABELS: Record<BuyerType, string> = {
  'first-home': 'דירה ראשונה ויחידה',
  replacement: 'מחליף דירה',
  investor: 'דירה נוספת / השקעה',
  oleh: 'עולה חדש / תושב חוזר',
  disabled: 'נכה / נפגע איבה',
};
