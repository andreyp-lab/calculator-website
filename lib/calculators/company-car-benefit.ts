/**
 * שווי שימוש ברכב צמוד (2026) — פונקציות טהורות. קבועים מ-`lib/constants/benefits-2026.ts`.
 * רכב שנרשם מ-1.1.2010: 2.48% ממחיר הרכב (עד התקרה) פחות הפחתה לרכב בהנעה מתקדמת.
 * רכב שנרשם לפניו: ערך קבוע לפי קבוצת מחיר. את מחיר הרכב ואת הקבוצה מוצאים בסימולטור של רשות המסים.
 */

import { COMPANY_CAR_BENEFIT_2026, COMPANY_CAR_PRE_2010_MONTHLY } from '@/lib/constants/benefits-2026';
import { calculateSalaryNetGross } from '@/lib/calculators/salary-net-gross';

const round2 = (n: number) => Math.round(n * 100) / 100;

export type CarTech = 'regular' | 'hybrid' | 'plugin' | 'electric';
export type CarKind = 'car-2010' | 'car-pre-2010' | 'motorcycle';

export interface CompanyCarInput {
  kind: CarKind;
  /** מחיר מתואם לצרכן ("מחיר מחירון") — לרכב מ-2010 */
  price?: number;
  /** קבוצת מחיר 1–7 — לרכב שנרשם לפני 2010 */
  priceGroup?: number;
  tech?: CarTech;
}

export interface CompanyCarResult {
  monthlyBenefit: number;
  annualBenefit: number;
  priceUsed: number | null;
  cappedByCeiling: boolean;
  reduction: number;
}

export function calculateCompanyCarBenefit(i: CompanyCarInput): CompanyCarResult | null {
  const c = COMPANY_CAR_BENEFIT_2026;
  if (i.kind === 'motorcycle') {
    return { monthlyBenefit: c.motorcycleL3Monthly, annualBenefit: c.motorcycleL3Monthly * 12, priceUsed: null, cappedByCeiling: false, reduction: 0 };
  }
  if (i.kind === 'car-pre-2010') {
    const g = i.priceGroup;
    if (!Number.isInteger(g) || (g as number) < 1 || (g as number) > COMPANY_CAR_PRE_2010_MONTHLY.length) return null;
    const m = COMPANY_CAR_PRE_2010_MONTHLY[(g as number) - 1];
    return { monthlyBenefit: m, annualBenefit: m * 12, priceUsed: null, cappedByCeiling: false, reduction: 0 };
  }
  const price = i.price;
  if (typeof price !== 'number' || !Number.isFinite(price) || price <= 0 || price > 20_000_000) return null;
  const tech = i.tech ?? 'regular';
  const priceUsed = Math.min(price, c.priceCeiling);
  const base = priceUsed * c.monthlyRateOfPrice;
  const reduction = c.reductions[tech];
  const monthly = Math.max(0, base - reduction);
  return {
    monthlyBenefit: round2(monthly),
    annualBenefit: round2(monthly * 12),
    priceUsed,
    cappedByCeiling: price > c.priceCeiling,
    reduction: Math.min(reduction, base),
  };
}

export interface CarPayslipImpact {
  netWithoutBenefit: number;
  netWithBenefit: number;
  monthlyNetCost: number;
  /** כמה מהשווי "נשאר" כעלות בתלוש, באחוזים */
  costPctOfBenefit: number;
}

/** כמה השווי מקטין את הנטו בתלוש: מחשבים נטו עם ובלי השווי (נקודות זיכוי נתונות, ללא פנסיה). */
export function carPayslipImpact(monthlyGross: number, benefit: number, creditPoints = 2.25): CarPayslipImpact | null {
  if (!Number.isFinite(monthlyGross) || monthlyGross <= 0 || !Number.isFinite(benefit) || benefit < 0) return null;
  const base = { creditPoints, pensionEnabled: false, studyFundEnabled: false, monthlyWorkHours: 182 };
  const a = calculateSalaryNetGross({ ...base, grossSalary: monthlyGross });
  const b = calculateSalaryNetGross({ ...base, grossSalary: monthlyGross + benefit });
  // הרכב אינו כסף בכיס: נטו בתלוש יורד בגובה המס שנוסף על השווי
  const taxAdded = b.totalDeductions - a.totalDeductions;
  return {
    netWithoutBenefit: round2(a.netSalary),
    netWithBenefit: round2(b.netSalary - benefit),
    monthlyNetCost: round2(taxAdded),
    costPctOfBenefit: benefit > 0 ? round2((taxAdded / benefit) * 100) : 0,
  };
}
