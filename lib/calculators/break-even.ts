/**
 * מחשבון נקודת איזון (Break-Even Analysis)
 *
 * המדד הבסיסי לכל עסק - כמה צריך למכור כדי לכסות הוצאות?
 *
 * נוסחה:
 *   נקודת איזון (יחידות) = הוצאות קבועות / (מחיר ליחידה - עלות משתנה ליחידה)
 *   = הוצאות קבועות / תרומה ליחידה
 *
 * תרומה לכיסוי (Contribution Margin) = מחיר ליחידה - עלות משתנה ליחידה
 * שיעור תרומה = תרומה / מחיר × 100%
 *
 * Margin of Safety = (מכירות בפועל - מכירות באיזון) / מכירות בפועל
 */

export interface BreakEvenInput {
  /** הוצאות קבועות חודשיות (₪) */
  fixedCosts: number;
  /** עלות משתנה ליחידה (₪) */
  variableCostPerUnit: number;
  /** מחיר מכירה ליחידה (₪) */
  pricePerUnit: number;
  /** יחידות צפויות למכירה (אופציונלי - לחישוב Margin of Safety) */
  expectedUnits?: number;
  /** רווח מטרה חודשי (אופציונלי) */
  targetProfit?: number;
}

export interface BreakEvenResult {
  /** תרומה ליחידה (price - variable cost) */
  contributionPerUnit: number;
  /** שיעור תרומה כאחוז */
  contributionMarginPct: number;
  /** נקודת איזון - יחידות חודשיות */
  breakEvenUnits: number;
  /** נקודת איזון - הכנסה חודשית */
  breakEvenRevenue: number;
  /** נקודת איזון יומית (30 ימים) */
  breakEvenUnitsPerDay: number;
  /** מרווח ביטחון - יחידות (אם expectedUnits) */
  marginOfSafetyUnits: number;
  /** מרווח ביטחון - אחוז */
  marginOfSafetyPct: number;
  /** רווח חודשי צפוי לפי expectedUnits */
  expectedProfit: number;
  /** יחידות נדרשות לרווח מטרה (אם targetProfit) */
  unitsForTargetProfit: number;
  /** האם החישוב תקין */
  isValid: boolean;
  /** הודעת אזהרה */
  warning?: string;
}

export function calculateBreakEven(input: BreakEvenInput): BreakEvenResult {
  const fixedCosts = Math.max(0, input.fixedCosts);
  const variableCost = Math.max(0, input.variableCostPerUnit);
  const price = Math.max(0, input.pricePerUnit);
  const expected = Math.max(0, input.expectedUnits ?? 0);
  const target = Math.max(0, input.targetProfit ?? 0);

  const contributionPerUnit = price - variableCost;
  const contributionMarginPct = price > 0 ? (contributionPerUnit / price) * 100 : 0;

  // ולידציה
  if (price <= variableCost) {
    return {
      contributionPerUnit,
      contributionMarginPct,
      breakEvenUnits: 0,
      breakEvenRevenue: 0,
      breakEvenUnitsPerDay: 0,
      marginOfSafetyUnits: 0,
      marginOfSafetyPct: 0,
      expectedProfit: 0,
      unitsForTargetProfit: 0,
      isValid: false,
      warning:
        price === 0
          ? 'יש להזין מחיר מכירה ליחידה'
          : 'מחיר המכירה נמוך מהעלות המשתנה - אין תרומה לכיסוי הוצאות',
    };
  }

  const breakEvenUnits = fixedCosts / contributionPerUnit;
  const breakEvenRevenue = breakEvenUnits * price;
  const breakEvenUnitsPerDay = breakEvenUnits / 30;

  // מרווח ביטחון
  let marginOfSafetyUnits = 0;
  let marginOfSafetyPct = 0;
  let expectedProfit = 0;
  if (expected > 0) {
    marginOfSafetyUnits = expected - breakEvenUnits;
    marginOfSafetyPct = (marginOfSafetyUnits / expected) * 100;
    expectedProfit = expected * contributionPerUnit - fixedCosts;
  }

  // יחידות לרווח מטרה
  const unitsForTargetProfit = target > 0 ? (fixedCosts + target) / contributionPerUnit : 0;

  return {
    contributionPerUnit,
    contributionMarginPct,
    breakEvenUnits,
    breakEvenRevenue,
    breakEvenUnitsPerDay,
    marginOfSafetyUnits,
    marginOfSafetyPct,
    expectedProfit,
    unitsForTargetProfit,
    isValid: true,
  };
}
