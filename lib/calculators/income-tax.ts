/**
 * חישוב מס הכנסה לשכיר 2026
 *
 * מבוסס על:
 * - לוח עזר לחישוב מס הכנסה ממשכורת ושכר עבודה - רשות המסים
 * - מדרגות מס הכנסה 2026 (כולל ריווח מדרגות 20% ו-31%)
 * - שיעורי ביטוח לאומי ובריאות 2026
 * - נקודות זיכוי 2026
 */

import {
  TAX_BRACKETS_2026,
  CREDIT_POINT_2026,
  SOCIAL_SECURITY_EMPLOYEE_2026,
} from '@/lib/constants/tax-2026';

export interface IncomeTaxInput {
  monthlySalary: number;
  creditPoints: number;
  hasPension: boolean;
  pensionPercentage: number; // 0-7
}

export interface BracketCalc {
  bracket: string;
  rate: number;
  amountInBracket: number;
  taxInBracket: number;
}

export interface IncomeTaxResult {
  // ברוטו
  monthlyGross: number;
  annualGross: number;

  // מס הכנסה
  taxByBracket: BracketCalc[];
  monthlyTaxBeforeCredits: number;
  annualTaxBeforeCredits: number;
  creditPoints: number;
  monthlyCreditAmount: number;
  annualCreditAmount: number;
  monthlyTaxAfterCredits: number;
  annualTaxAfterCredits: number;

  // ביטוח לאומי + בריאות
  monthlySocialSecurity: number;
  socialSecurityReduced: number;
  socialSecurityFull: number;

  // פנסיה
  monthlyPension: number;

  // נטו
  monthlyNet: number;
  annualNet: number;
  effectiveTaxRate: number;
}

export function calculateIncomeTax(input: IncomeTaxInput): IncomeTaxResult {
  const monthlySalary = Math.max(0, input.monthlySalary);
  const annualSalary = monthlySalary * 12;

  // חישוב מס הכנסה לפי מדרגות (שנתי)
  let annualTax = 0;
  let previousLimit = 0;
  const bracketCalcs: BracketCalc[] = [];

  for (const bracket of TAX_BRACKETS_2026) {
    if (annualSalary <= previousLimit) break;

    const amountInBracket = Math.min(annualSalary, bracket.upTo) - previousLimit;
    const taxInBracket = amountInBracket * bracket.rate;
    annualTax += taxInBracket;

    if (amountInBracket > 0) {
      bracketCalcs.push({
        bracket: bracket.label,
        rate: bracket.rate,
        amountInBracket,
        taxInBracket,
      });
    }

    if (annualSalary <= bracket.upTo) break;
    previousLimit = bracket.upTo;
  }

  // נקודות זיכוי
  const annualCreditAmount = input.creditPoints * CREDIT_POINT_2026.annual;
  const monthlyCreditAmount = annualCreditAmount / 12;

  // מס לאחר זיכוי (לא פחות מ-0)
  const annualTaxAfterCredits = Math.max(0, annualTax - annualCreditAmount);
  const monthlyTaxAfterCredits = annualTaxAfterCredits / 12;

  // ביטוח לאומי + בריאות
  const cap = SOCIAL_SECURITY_EMPLOYEE_2026.maxThresholdMonthly;
  const threshold = SOCIAL_SECURITY_EMPLOYEE_2026.reducedThresholdMonthly;
  const cappedSalary = Math.min(monthlySalary, cap);

  const reducedPart = Math.min(cappedSalary, threshold);
  const fullPart = Math.max(0, cappedSalary - threshold);

  const socialSecurityReduced = reducedPart * SOCIAL_SECURITY_EMPLOYEE_2026.reducedRate.total;
  const socialSecurityFull = fullPart * SOCIAL_SECURITY_EMPLOYEE_2026.fullRate.total;
  const monthlySocialSecurity = socialSecurityReduced + socialSecurityFull;

  // פנסיה (לא חיוב חובה לחישוב, אלא ניכוי וולונטרי)
  const monthlyPension = input.hasPension
    ? monthlySalary * (input.pensionPercentage / 100)
    : 0;

  // נטו
  const monthlyNet =
    monthlySalary - monthlyTaxAfterCredits - monthlySocialSecurity - monthlyPension;
  const annualNet = monthlyNet * 12;

  // שיעור מס אפקטיבי (מס + ב.ל.) ביחס לברוטו
  const totalDeductionsExcludingPension = monthlyTaxAfterCredits + monthlySocialSecurity;
  const effectiveTaxRate =
    monthlySalary > 0 ? totalDeductionsExcludingPension / monthlySalary : 0;

  return {
    monthlyGross: monthlySalary,
    annualGross: annualSalary,
    taxByBracket: bracketCalcs,
    monthlyTaxBeforeCredits: annualTax / 12,
    annualTaxBeforeCredits: annualTax,
    creditPoints: input.creditPoints,
    monthlyCreditAmount,
    annualCreditAmount,
    monthlyTaxAfterCredits,
    annualTaxAfterCredits,
    monthlySocialSecurity,
    socialSecurityReduced,
    socialSecurityFull,
    monthlyPension,
    monthlyNet,
    annualNet,
    effectiveTaxRate,
  };
}
