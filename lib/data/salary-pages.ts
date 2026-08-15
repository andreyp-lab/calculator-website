/**
 * דפי SEO פרוגרמטיים: "שכר X ברוטו כמה נטו" — /salary/[amount]
 *
 * כל המספרים מחושבים בזמן build מתוך מנוע החישוב האמיתי
 * (lib/calculators/salary-net-gross.ts) — אין מספרי מס מוקלדים ידנית (YMYL).
 */

import {
  calculateSalaryNetGross,
  type SalaryNetGrossResult,
} from '@/lib/calculators/salary-net-gross';
import { TAX_BRACKETS_2026, CREDIT_POINT_2026 } from '@/lib/constants/tax-2026';

// ============================================================
// רשימת הסכומים — מקור אמת יחיד (משמש גם את ה-sitemap)
// ============================================================

export const SALARY_PAGE_AMOUNTS: number[] = [
  // 6,500 עד 25,000 בקפיצות של 500 ₪
  ...Array.from({ length: (25_000 - 6_500) / 500 + 1 }, (_, i) => 6_500 + i * 500),
  30_000,
  35_000,
  40_000,
];

export function isSalaryPageAmount(amount: number): boolean {
  return SALARY_PAGE_AMOUNTS.includes(amount);
}

/** סכומים סמוכים (עד 2 מכל צד: X±500, X±1000 ברשת הרגילה) */
export function getNearbyAmounts(amount: number): number[] {
  const idx = SALARY_PAGE_AMOUNTS.indexOf(amount);
  if (idx === -1) return [];
  return SALARY_PAGE_AMOUNTS.slice(Math.max(0, idx - 2), idx + 3).filter((a) => a !== amount);
}

// ============================================================
// חישובים — הכל דרך המנוע
// ============================================================

const BASE_INPUT = {
  studyFundEnabled: false,
  monthlyWorkHours: 182,
} as const;

export function calcSalary(
  grossSalary: number,
  creditPoints: number,
  pensionEnabled: boolean,
): SalaryNetGrossResult {
  return calculateSalaryNetGross({
    grossSalary,
    creditPoints,
    pensionEnabled,
    pensionLevel: 'minimum', // 6% עובד
    ...BASE_INPUT,
  });
}

export interface BracketRow {
  /** תיאור המדרגה, מחושב מהקבועים */
  label: string;
  ratePercent: number;
  /** חלק השכר החודשי שממוסה במדרגה זו */
  taxedMonthly: number;
  /** המס החודשי במדרגה זו (לפני נקודות זיכוי) */
  taxMonthly: number;
}

/** פירוק מס הכנסה לפי מדרגות (לפני זיכוי), בערכים חודשיים */
export function getBracketBreakdown(monthlyGross: number): BracketRow[] {
  const annual = monthlyGross * 12;
  const rows: BracketRow[] = [];
  let prev = 0;
  for (const b of TAX_BRACKETS_2026) {
    if (annual <= prev) break;
    const taxedAnnual = Math.min(annual, b.upTo) - prev;
    if (taxedAnnual > 0) {
      rows.push({
        label:
          b.upTo === Infinity
            ? `מעל ${Math.round(prev / 12).toLocaleString('he-IL')} ₪`
            : `עד ${Math.round(b.monthlyUpTo).toLocaleString('he-IL')} ₪`,
        ratePercent: b.rate * 100,
        taxedMonthly: taxedAnnual / 12,
        taxMonthly: (taxedAnnual * b.rate) / 12,
      });
    }
    if (annual <= b.upTo) break;
    prev = b.upTo;
  }
  return rows;
}

/** זיכוי חודשי לפי נקודות זיכוי */
export function monthlyCreditAmount(creditPoints: number): number {
  return (creditPoints * CREDIT_POINT_2026.annual) / 12;
}

// ============================================================
// נתוני עמוד מרוכזים
// ============================================================

export const CREDIT_POINT_VARIANTS = [2.25, 2.75, 3.5] as const;

export interface SalaryPageData {
  amount: number;
  /** רווק/ה, 2.25 נ"ז, ללא פנסיה */
  noPension: SalaryNetGrossResult;
  /** רווק/ה, 2.25 נ"ז, פנסיה 6% */
  withPension: SalaryNetGrossResult;
  /** וריאציות נקודות זיכוי: 2.25 / 2.75 / 3.5 */
  variants: { creditPoints: number; noPensionNet: number; withPensionNet: number }[];
  brackets: BracketRow[];
  nearby: number[];
}

export function getSalaryPageData(amount: number): SalaryPageData {
  return {
    amount,
    noPension: calcSalary(amount, 2.25, false),
    withPension: calcSalary(amount, 2.25, true),
    variants: CREDIT_POINT_VARIANTS.map((cp) => ({
      creditPoints: cp,
      noPensionNet: calcSalary(amount, cp, false).netSalary,
      withPensionNet: calcSalary(amount, cp, true).netSalary,
    })),
    brackets: getBracketBreakdown(amount),
    nearby: getNearbyAmounts(amount),
  };
}
