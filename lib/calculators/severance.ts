/**
 * חישוב פיצויי פיטורין
 *
 * מבוסס על:
 * - חוק פיצויי פיטורים, התשכ"ג-1963
 * - חוזרי רשות המסים בנושא פטור ממס על פיצויים
 *
 * נוסחה בסיסית: שכר חודשי קובע × שנות ותק
 * תקרת פטור: לכל שנת עבודה (בערך 13,750 ש"ח לשנה ב-2026)
 */

import { SEVERANCE_COMPENSATION } from '@/lib/constants/tax-2026';

export type EmploymentType = 'monthly' | 'hourly';
export type TerminationReason = 'fired' | 'resigned' | 'retirement' | 'qualifying';

export interface SeveranceInput {
  startDate: string; // YYYY-MM-DD
  endDate: string;
  monthlySalary: number;
  employmentType: EmploymentType;
  partTimePercentage: number; // 0-100
  hasSection14: boolean;
  section14Percentage: number; // 0-8.33
  terminationReason: TerminationReason;
}

export interface SeveranceResult {
  isEligible: boolean;
  ineligibilityReason?: string;
  yearsOfService: number;
  monthsOfService: number;
  adjustedSalary: number;
  baseSeverance: number;
  taxExemptAmount: number;
  taxableAmount: number;
  estimatedTax: number;
  netSeverance: number;
  formula: string;
}

function calculateYearsOfService(start: Date, end: Date): { years: number; months: number } {
  const diffMs = end.getTime() - start.getTime();
  const totalMonths = diffMs / (1000 * 60 * 60 * 24 * 30.44);
  const years = totalMonths / 12;
  return {
    years: Math.round(years * 100) / 100,
    months: Math.round(totalMonths * 10) / 10,
  };
}

export function calculateSeverance(input: SeveranceInput): SeveranceResult {
  const start = new Date(input.startDate);
  const end = new Date(input.endDate);

  // ולידציה בסיסית
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return {
      isEligible: false,
      ineligibilityReason: 'תאריכים אינם תקינים',
      yearsOfService: 0,
      monthsOfService: 0,
      adjustedSalary: 0,
      baseSeverance: 0,
      taxExemptAmount: 0,
      taxableAmount: 0,
      estimatedTax: 0,
      netSeverance: 0,
      formula: '',
    };
  }

  if (end <= start) {
    return {
      isEligible: false,
      ineligibilityReason: 'תאריך סיום העבודה חייב להיות אחרי תאריך תחילת העבודה',
      yearsOfService: 0,
      monthsOfService: 0,
      adjustedSalary: 0,
      baseSeverance: 0,
      taxExemptAmount: 0,
      taxableAmount: 0,
      estimatedTax: 0,
      netSeverance: 0,
      formula: '',
    };
  }

  const { years, months } = calculateYearsOfService(start, end);

  // בדיקת זכאות - שנה לפחות
  if (years < SEVERANCE_COMPENSATION.yearsRequired) {
    return {
      isEligible: false,
      ineligibilityReason: `נדרש ותק של שנה לפחות. ותק נוכחי: ${years.toFixed(1)} שנים`,
      yearsOfService: years,
      monthsOfService: months,
      adjustedSalary: 0,
      baseSeverance: 0,
      taxExemptAmount: 0,
      taxableAmount: 0,
      estimatedTax: 0,
      netSeverance: 0,
      formula: '',
    };
  }

  // בדיקת זכאות לפי סיבת סיום
  if (input.terminationReason === 'resigned') {
    return {
      isEligible: false,
      ineligibilityReason:
        'התפטרות (לא מזכה) - אינך זכאי לפיצויי פיטורין אלא אם זה במסגרת התפטרות מזכה (חוק 14, מעבר דירה, מצב בריאותי וכו\')',
      yearsOfService: years,
      monthsOfService: months,
      adjustedSalary: 0,
      baseSeverance: 0,
      taxExemptAmount: 0,
      taxableAmount: 0,
      estimatedTax: 0,
      netSeverance: 0,
      formula: '',
    };
  }

  // חישוב שכר מתואם
  const adjustedSalary =
    input.employmentType === 'hourly'
      ? input.monthlySalary * (input.partTimePercentage / 100)
      : input.monthlySalary;

  // חישוב פיצוי בסיסי
  const baseSeverance = adjustedSalary * years;

  // חישוב פטור ממס - הנמוך מבין:
  // 1. הסכום המלא של הפיצוי
  // 2. תקרת הפטור השנתית × שנות ותק
  // 3. שכר × 1.5 × שנות ותק
  const exemptionByCeiling = SEVERANCE_COMPENSATION.annualExemptionCeiling * years;
  const exemptionBySalary = adjustedSalary * SEVERANCE_COMPENSATION.exemptionMultiplier * years;
  const taxExemptAmount = Math.min(baseSeverance, exemptionByCeiling, exemptionBySalary);

  // סכום חייב במס
  const taxableAmount = Math.max(0, baseSeverance - taxExemptAmount);

  // מס משוער (פישוט: שיעור ממוצע 30% - אומדן בלבד)
  const estimatedTax = taxableAmount * 0.30;

  // נטו
  const netSeverance = baseSeverance - estimatedTax;

  return {
    isEligible: true,
    yearsOfService: years,
    monthsOfService: months,
    adjustedSalary,
    baseSeverance,
    taxExemptAmount,
    taxableAmount,
    estimatedTax,
    netSeverance,
    formula: `${adjustedSalary.toLocaleString('he-IL')} ש"ח × ${years.toFixed(2)} שנים = ${baseSeverance.toLocaleString('he-IL')} ש"ח`,
  };
}
