/**
 * מנוע "תוכנית עסקית" — כמה עולה להקים עסק וכמה צריך כדי להתקיים.
 *
 * מקבל סוג עסק + עיר + שטח + מקום חדש/קיים, ומחשב:
 * - עלות הקמה חד-פעמית (ציוד, שיפוץ, רישוי, פיקדון שכירות)
 * - הוצאות חודשיות קבועות (שכ"ד, ארנונה, שכר, שוטף)
 * - נקודת איזון (כמה לקוחות/יחידות בחודש)
 * - תחזית רווח וזמן להחזר ההשקעה
 *
 * ⚠️ אומדן בקירוב בלבד — מבוסס טווחי שוק 2026. לא תחליף לתוכנית עסקית מקצועית.
 */

import { getBusinessType } from '@/lib/data/business-setup/business-types';
import { getCityRent } from '@/lib/data/business-setup/rent-by-city';

/** מקדם עלות מעביד מקורב: שכר ברוטו × 1.30 (ב"ל מעסיק ~7.6% + פנסיה 6.5% + פיצויים 6% + הבראה/חופשה) */
export const EMPLOYER_BURDEN_FACTOR = 1.3;
/** פיקדון/ערבות שכירות מקובל — חודשים */
export const RENT_DEPOSIT_MONTHS = 3;

export interface BusinessPlanInput {
  businessSlug: string;
  city: string;
  areaSqm: number;
  /** מקום קיים ומאובזר (שיפוץ קל) או חלל חדש (שיפוץ מלא) */
  isExistingPlace: boolean;
  /** לכלול פריטי הקמה אופציונליים */
  includeOptional: boolean;
  /** כמה יחידות מכירה בחודש (לתחזית רווח); ברירת מחדל = נקודת איזון */
  monthlyUnitsSold?: number;
}

export interface CostLine {
  name: string;
  amount: number;
}

export interface BusinessPlanResult {
  businessName: string;
  city: string;
  areaSqm: number;
  // --- הקמה חד-פעמית ---
  setupLines: CostLine[];
  setupTotal: number;
  /** טווח הקמה (מינ'-מקס') לתצוגה */
  setupRange: { min: number; max: number };
  // --- חודשי קבוע ---
  monthlyLines: CostLine[];
  monthlyFixedTotal: number;
  // --- נקודת איזון ---
  contributionPerUnit: number;
  breakEvenUnits: number;
  breakEvenRevenue: number;
  unitLabel: string;
  // --- פחת ורזרבת חידוש ---
  /** בסיס בר-פחת (ציוד + שיפוץ) */
  depreciableBase: number;
  /** אורך חיים של הציוד (שנים) */
  equipmentUsefulLifeYears: number;
  /** פחת חודשי — הבלאי הכלכלי של הציוד/שיפוץ */
  monthlyDepreciation: number;
  /** רזרבה חודשית מומלצת לחידוש (= פחת) — כסף שכדאי להפריש בפועל */
  recommendedRenewalReserve: number;
  // --- תחזית ---
  projectedUnits: number;
  projectedRevenue: number;
  /** רווח תזרימי חודשי (הכנסה − משתנה − הוצאות קבועות), לפני הפרשה לחידוש */
  projectedMonthlyProfit: number;
  /** רווח בר-קיימא: אחרי הפרשת רזרבת החידוש (התמונה האמיתית) */
  projectedProfitAfterReserve: number;
  /** חודשים להחזר ההשקעה (לפי רווח תזרימי) */
  monthsToRecoup: number | null;
  // --- הון חוזר מומלץ ---
  recommendedWorkingCapital: number;
}

function clamp(v: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, v));
}

export function calculateBusinessPlan(input: BusinessPlanInput): BusinessPlanResult | null {
  const bt = getBusinessType(input.businessSlug);
  if (!bt) return null;

  const city = getCityRent(input.city);
  const area = clamp(Math.round(input.areaSqm) || bt.typicalAreaSqm, bt.minAreaSqm, bt.maxAreaSqm);

  // ===== הקמה חד-פעמית =====
  const items = bt.setupItems.filter((i) => i.essential || input.includeOptional);
  const equipmentMid = items.reduce((s, i) => s + (i.min + i.max) / 2, 0);
  const equipmentMin = items.reduce((s, i) => s + i.min, 0);
  const equipmentMax = items.reduce((s, i) => s + i.max, 0);

  // שיפוץ: מקום קיים = התאמה קלה (~25% מהמינימום); חדש = ממוצע מלא
  const renovMid = input.isExistingPlace
    ? area * bt.renovationPerSqm.min * 0.25
    : area * (bt.renovationPerSqm.min + bt.renovationPerSqm.max) / 2;
  const renovMin = input.isExistingPlace ? area * bt.renovationPerSqm.min * 0.15 : area * bt.renovationPerSqm.min;
  const renovMax = input.isExistingPlace ? area * bt.renovationPerSqm.min * 0.4 : area * bt.renovationPerSqm.max;

  const licensingMid = (bt.licensing.min + bt.licensing.max) / 2;
  const rentMonthly = area * city.rentPerSqmMonthly;
  const rentDeposit = rentMonthly * RENT_DEPOSIT_MONTHS;

  const setupLines: CostLine[] = [
    { name: 'ציוד וריהוט', amount: Math.round(equipmentMid) },
    { name: input.isExistingPlace ? 'התאמת חלל קיים' : 'שיפוץ והתאמת חלל', amount: Math.round(renovMid) },
    { name: 'רישוי, אגרות ואישורים', amount: Math.round(licensingMid) },
    { name: `פיקדון שכירות (${RENT_DEPOSIT_MONTHS} חודשים)`, amount: Math.round(rentDeposit) },
  ];
  const setupTotal = setupLines.reduce((s, l) => s + l.amount, 0);
  const setupRange = {
    min: Math.round(equipmentMin + renovMin + bt.licensing.min + rentDeposit),
    max: Math.round(equipmentMax + renovMax + bt.licensing.max + rentDeposit),
  };

  // ===== הוצאות חודשיות קבועות =====
  const arnonaMonthly = (area * city.arnonaPerSqmYearly) / 12;
  const staffMonthly = bt.staff.count * bt.staff.avgMonthlyGross * EMPLOYER_BURDEN_FACTOR;
  const otherMonthly = bt.monthlyItems.reduce((s, i) => s + i.amount, 0);

  const monthlyLines: CostLine[] = [
    { name: 'שכר דירה', amount: Math.round(rentMonthly) },
    { name: 'ארנונה', amount: Math.round(arnonaMonthly) },
    ...(staffMonthly > 0 ? [{ name: `שכר עובדים (${bt.staff.count})`, amount: Math.round(staffMonthly) }] : []),
    ...bt.monthlyItems.map((i) => ({ name: i.name, amount: i.amount })),
  ];
  const monthlyFixedTotal = monthlyLines.reduce((s, l) => s + l.amount, 0);

  // ===== נקודת איזון =====
  const contributionPerUnit = bt.revenue.avgTicket * (1 - bt.variableCostRate);
  const breakEvenUnits = Math.ceil(monthlyFixedTotal / contributionPerUnit);
  const breakEvenRevenue = Math.round(breakEvenUnits * bt.revenue.avgTicket);

  // ===== פחת ורזרבת חידוש =====
  // הציוד והשיפוץ נשחקים ויצטרכו חידוש. הפחת החודשי הוא הבלאי הכלכלי,
  // ומייצג את הסכום שכדאי להפריש בפועל לרזרבה כדי לחדש בעתיד (סטודיו/מטבח וכו').
  const depreciableBase = Math.round(equipmentMid + renovMid);
  const monthlyDepreciation = Math.round(depreciableBase / (bt.equipmentUsefulLifeYears * 12));

  // ===== תחזית רווח =====
  const projectedUnits = input.monthlyUnitsSold ?? breakEvenUnits;
  const projectedRevenue = projectedUnits * bt.revenue.avgTicket;
  const variableCost = projectedRevenue * bt.variableCostRate;
  const projectedMonthlyProfit = Math.round(projectedRevenue - variableCost - monthlyFixedTotal);
  const projectedProfitAfterReserve = projectedMonthlyProfit - monthlyDepreciation;
  const monthsToRecoup = projectedMonthlyProfit > 0 ? Math.ceil(setupTotal / projectedMonthlyProfit) : null;

  return {
    businessName: bt.name,
    city: city.city,
    areaSqm: area,
    setupLines,
    setupTotal,
    setupRange,
    monthlyLines,
    monthlyFixedTotal,
    contributionPerUnit: Math.round(contributionPerUnit),
    breakEvenUnits,
    breakEvenRevenue,
    unitLabel: bt.revenue.unitLabel,
    depreciableBase,
    equipmentUsefulLifeYears: bt.equipmentUsefulLifeYears,
    monthlyDepreciation,
    recommendedRenewalReserve: monthlyDepreciation,
    projectedUnits,
    projectedRevenue: Math.round(projectedRevenue),
    projectedMonthlyProfit,
    projectedProfitAfterReserve,
    monthsToRecoup,
    recommendedWorkingCapital: Math.round(monthlyFixedTotal * 4),
  };
}
