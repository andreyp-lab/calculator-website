/**
 * Break-Even Analysis Engine
 *
 * חישוב נקודת איזון, מרווח בטחון ומינוף תפעולי.
 *
 * Break-Even Revenue = Fixed Costs / Contribution Margin Ratio
 * Margin of Safety = (Actual Revenue - BE Revenue) / Actual Revenue
 * Operating Leverage (DOL) = Contribution Margin / Operating Profit
 *   - DOL גבוה = רגישות גבוהה לשינויים בהכנסות (יתרון בצמיחה, סיכון בירידה)
 */

export interface BreakEvenInput {
  revenue: number;
  variableCosts: number;
  fixedCosts: number;
  /** מספר יחידות (אופציונלי - לחישוב break-even per unit) */
  unitsSold?: number;
  /** מחיר ליחידה (אופציונלי) */
  pricePerUnit?: number;
  /** עלות משתנה ליחידה (אופציונלי) */
  variableCostPerUnit?: number;
}

export interface BreakEvenResult {
  // נקודת איזון
  breakEvenRevenue: number;
  breakEvenUnits?: number;
  // מרווח בטחון
  marginOfSafety: number; // currency
  marginOfSafetyRatio: number; // %
  marginOfSafetyInterpretation: { status: 'excellent' | 'good' | 'fair' | 'weak' | 'critical'; text: string };
  // תרומה
  contributionMargin: number; // currency
  contributionMarginRatio: number; // %
  contributionMarginPerUnit?: number;
  // מינוף תפעולי
  operatingLeverage: number;
  operatingLeverageInterpretation: string;
  // ניתוח
  isAboveBreakEven: boolean;
  percentAboveBreakEven: number;
  /** כמה צריך להוסיף הכנסות לכיסוי */
  shortfall: number;
  insights: string[];
}

function safeDiv(n: number, d: number, fallback = 0): number {
  return Math.abs(d) > 0.001 ? n / d : fallback;
}

function interpretMarginOfSafety(ratio: number): BreakEvenResult['marginOfSafetyInterpretation'] {
  if (ratio < 0) return { status: 'critical', text: 'מתחת לנקודת איזון - הפסד!' };
  if (ratio < 0.10) return { status: 'weak', text: 'מרווח דק - רגישות גבוהה לירידות' };
  if (ratio < 0.20) return { status: 'fair', text: 'מרווח סביר - יש מקום לשיפור' };
  if (ratio < 0.40) return { status: 'good', text: 'מרווח בטחון טוב' };
  return { status: 'excellent', text: 'מרווח בטחון מעולה - יציבות גבוהה' };
}

function interpretOperatingLeverage(dol: number): string {
  if (dol > 5) return `מינוף גבוה מאוד (${dol.toFixed(1)}x) - שינוי 10% בהכנסות = ${(dol * 10).toFixed(0)}% ברווח. סיכון!`;
  if (dol > 3) return `מינוף גבוה (${dol.toFixed(1)}x) - עלויות קבועות משמעותיות`;
  if (dol > 2) return `מינוף בינוני (${dol.toFixed(1)}x) - מאוזן`;
  if (dol > 1) return `מינוף נמוך (${dol.toFixed(1)}x) - גמישות גבוהה`;
  return `מינוף מינימלי (${dol.toFixed(1)}x) - הוצאות בעיקר משתנות`;
}

export function calculateBreakEven(input: BreakEvenInput): BreakEvenResult {
  const { revenue, variableCosts, fixedCosts, unitsSold, pricePerUnit, variableCostPerUnit } =
    input;

  // Contribution Margin
  const contributionMargin = revenue - variableCosts;
  const contributionMarginRatio = safeDiv(contributionMargin, revenue);

  // Break-even revenue
  const breakEvenRevenue = contributionMarginRatio > 0 ? fixedCosts / contributionMarginRatio : 0;

  // Operating Profit
  const operatingProfit = contributionMargin - fixedCosts;

  // Per-unit calculations
  let contributionMarginPerUnit: number | undefined;
  let breakEvenUnits: number | undefined;
  if (unitsSold && pricePerUnit && variableCostPerUnit !== undefined) {
    contributionMarginPerUnit = pricePerUnit - variableCostPerUnit;
    breakEvenUnits = contributionMarginPerUnit > 0 ? fixedCosts / contributionMarginPerUnit : 0;
  } else if (unitsSold && unitsSold > 0) {
    contributionMarginPerUnit = contributionMargin / unitsSold;
    breakEvenUnits = contributionMarginPerUnit > 0 ? fixedCosts / contributionMarginPerUnit : 0;
  }

  // Margin of Safety
  const marginOfSafety = revenue - breakEvenRevenue;
  const marginOfSafetyRatio = safeDiv(marginOfSafety, revenue);

  // Operating Leverage
  // DOL = CM / Operating Profit (כשרווחי)
  // אם הפסד - DOL לא רלוונטי
  const operatingLeverage =
    operatingProfit > 0 ? contributionMargin / operatingProfit : 0;

  const isAboveBreakEven = revenue > breakEvenRevenue;
  const percentAboveBreakEven = safeDiv(revenue - breakEvenRevenue, breakEvenRevenue) * 100;
  const shortfall = isAboveBreakEven ? 0 : breakEvenRevenue - revenue;

  // Insights
  const insights: string[] = [];

  if (!isAboveBreakEven) {
    insights.push(`🚨 החברה מתחת לנקודת איזון - דרושות הכנסות נוספות של ₪${shortfall.toLocaleString()} לכיסוי בלבד`);
  } else if (marginOfSafetyRatio < 0.15) {
    insights.push(`⚠️ מרווח בטחון דק (${(marginOfSafetyRatio * 100).toFixed(1)}%) - ירידה קטנה בהכנסות תיצור הפסד`);
  } else if (marginOfSafetyRatio > 0.35) {
    insights.push(`✅ מרווח בטחון מצוין - יש כרית גדולה לפני נקודת ההפסד`);
  }

  if (contributionMarginRatio < 0.20) {
    insights.push(`📉 שיעור תרומה נמוך (${(contributionMarginRatio * 100).toFixed(1)}%) - עלויות משתנות גבוהות`);
  } else if (contributionMarginRatio > 0.60) {
    insights.push(`💪 שיעור תרומה גבוה - מודל עסקי עם יתרון תחרותי`);
  }

  if (operatingLeverage > 3 && isAboveBreakEven) {
    insights.push(`⚡ מינוף תפעולי גבוה - צמיחה תקפיץ רווחים, ירידה תפיל אותם`);
  }

  if (fixedCosts > revenue * 0.5) {
    insights.push(`🏗️ עלויות קבועות גבוהות (>50% מהכנסות) - מודל "כבד"`);
  }

  // What-if: required revenue for target profit
  return {
    breakEvenRevenue,
    breakEvenUnits,
    marginOfSafety,
    marginOfSafetyRatio,
    marginOfSafetyInterpretation: interpretMarginOfSafety(marginOfSafetyRatio),
    contributionMargin,
    contributionMarginRatio,
    contributionMarginPerUnit,
    operatingLeverage,
    operatingLeverageInterpretation: interpretOperatingLeverage(operatingLeverage),
    isAboveBreakEven,
    percentAboveBreakEven,
    shortfall,
    insights,
  };
}

/**
 * חישוב הכנסות נדרשות לרווח יעד.
 * Required Revenue = (Fixed Costs + Target Profit) / CM Ratio
 */
export function calculateRequiredRevenueForTarget(
  fixedCosts: number,
  contributionMarginRatio: number,
  targetProfit: number,
): number {
  if (contributionMarginRatio <= 0) return Infinity;
  return (fixedCosts + targetProfit) / contributionMarginRatio;
}

/**
 * What-If sensitivity: כמה צריך לשנות מחיר/כמות/עלות כדי להגיע ליעד.
 */
export interface WhatIfInput extends BreakEvenInput {
  targetProfit: number;
}

export interface WhatIfResult {
  /** % שינוי מחיר נדרש */
  priceIncrease: number;
  /** % שינוי כמות נדרש */
  volumeIncrease: number;
  /** % הפחתת עלויות משתנות נדרשת */
  variableCostReduction: number;
  /** % הפחתת עלויות קבועות נדרשת */
  fixedCostReduction: number;
}

export function calculateWhatIf(input: WhatIfInput): WhatIfResult {
  const { revenue, variableCosts, fixedCosts, targetProfit } = input;
  const currentProfit = revenue - variableCosts - fixedCosts;
  const gap = targetProfit - currentProfit;

  if (gap <= 0) {
    return { priceIncrease: 0, volumeIncrease: 0, variableCostReduction: 0, fixedCostReduction: 0 };
  }

  // Price increase (assumes inelastic demand - simplification)
  // ΔRevenue = gap → ΔPrice% = gap / Revenue × 100
  const priceIncrease = (gap / revenue) * 100;

  // Volume increase (CM stays same)
  const cm = revenue - variableCosts;
  const cmRatio = revenue > 0 ? cm / revenue : 0;
  const volumeIncrease = cmRatio > 0 ? (gap / cm) * 100 : Infinity;

  // Variable cost reduction
  const variableCostReduction = variableCosts > 0 ? (gap / variableCosts) * 100 : Infinity;

  // Fixed cost reduction
  const fixedCostReduction = fixedCosts > 0 ? (gap / fixedCosts) * 100 : Infinity;

  return { priceIncrease, volumeIncrease, variableCostReduction, fixedCostReduction };
}
