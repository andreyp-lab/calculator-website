/**
 * מחשבון FIRE - Financial Independence, Retire Early
 *
 * השאיפה: לחסוך מספיק כדי לצאת לפנסיה לפני גיל הפנסיה הרשמי.
 *
 * מושגי יסוד:
 * - FI Number = הסכום שצריך כדי לחיות מהריבית בלבד
 * - 4% Rule: יכול למשוך 4% משווי התיק כל שנה ולא לאזול לעולם
 * - FI Number = הוצאות שנתיות × 25
 *
 * סוגים:
 * - Lean FIRE: הוצאות נמוכות, פנסיה מינימלית (~6-10K/חודש)
 * - Regular FIRE: רמת חיים נורמלית (~15-25K/חודש)
 * - Fat FIRE: רמת חיים גבוהה (~30K+/חודש)
 *
 * נוסחה:
 * Years to FIRE = log(FI Number / Current Savings) / log(1 + Real Return)
 *
 * עם הפקדות חודשיות:
 * FV = PV × (1+r)^n + PMT × ((1+r)^n - 1) / r
 */

export interface FireCalculatorInput {
  /** גיל נוכחי */
  currentAge: number;
  /** חיסכון נוכחי (₪) */
  currentSavings: number;
  /** הפקדה חודשית (₪) */
  monthlyContribution: number;
  /** הוצאות חודשיות לאחר פרישה (₪) */
  monthlyExpensesInRetirement: number;
  /** תשואה ריאלית שנתית צפויה (%) - אחרי אינפלציה */
  expectedRealReturn: number;
  /** שיעור משיכה בטוח (% - ברירת מחדל 4) */
  withdrawalRate: number;
}

export interface FireCalculatorResult {
  /** סכום ה-FIRE (Target) */
  fireNumber: number;
  /** שנים עד FIRE */
  yearsToFire: number;
  /** גיל בו תוכל לפרוש */
  fireAge: number;
  /** סכום צפוי בגיל פרישה */
  projectedSavings: number;
  /** האם תגיע ל-FIRE */
  willReachFire: boolean;
  /** הוצאות שנתיות מטרה */
  annualExpenses: number;
  /** הכנסה חודשית פסיבית בגיל FIRE */
  monthlyPassiveIncome: number;
  /** סוג FIRE לפי הוצאות */
  fireType: 'lean' | 'regular' | 'fat';
  /** פער חודשי (אם לא מגיע) */
  monthlyShortfall: number;
}

export function calculateFire(input: FireCalculatorInput): FireCalculatorResult {
  const annualExpenses = input.monthlyExpensesInRetirement * 12;
  const withdrawalRate = (input.withdrawalRate || 4) / 100;
  const fireNumber = annualExpenses / withdrawalRate;

  // סוג FIRE
  let fireType: 'lean' | 'regular' | 'fat' = 'regular';
  if (input.monthlyExpensesInRetirement < 12_000) fireType = 'lean';
  else if (input.monthlyExpensesInRetirement > 30_000) fireType = 'fat';

  // חישוב שנים ל-FIRE
  const r = input.expectedRealReturn / 100;
  const monthlyR = r / 12;
  const PV = input.currentSavings;
  const PMT = input.monthlyContribution;

  let yearsToFire = 0;
  let projectedSavings = PV;

  if (PV >= fireNumber) {
    // כבר הגיע ל-FIRE
    yearsToFire = 0;
    projectedSavings = PV;
  } else if (PMT <= 0 && r > 0) {
    // אין הפקדות - חישוב דרך ריבית בלבד
    yearsToFire = Math.log(fireNumber / PV) / Math.log(1 + r);
    projectedSavings = fireNumber;
  } else if (r === 0) {
    // אין ריבית - חיסכון לינארי
    yearsToFire = (fireNumber - PV) / (PMT * 12);
    projectedSavings = fireNumber;
  } else {
    // חישוב מלא עם הפקדות וריבית - איטרציה
    let years = 0;
    let savings = PV;
    while (savings < fireNumber && years < 100) {
      savings = savings * (1 + r) + PMT * 12;
      years++;
    }
    yearsToFire = years;
    projectedSavings = savings;
  }

  const fireAge = Math.round(input.currentAge + yearsToFire);
  const willReachFire = yearsToFire <= 100 && yearsToFire >= 0;

  // הכנסה פסיבית - לפי 4% rule
  const monthlyPassiveIncome = (projectedSavings * withdrawalRate) / 12;

  // אם לא מגיע, פער חודשי
  const monthlyShortfall =
    yearsToFire > 30
      ? (fireNumber - PV) / (30 * 12) - PMT
      : 0;

  return {
    fireNumber,
    yearsToFire,
    fireAge,
    projectedSavings,
    willReachFire,
    annualExpenses,
    monthlyPassiveIncome,
    fireType,
    monthlyShortfall: Math.max(0, monthlyShortfall),
  };
}
