/**
 * מחשבון "שכיר + עצמאי" (הכנסה משולבת) — ישראל 2026
 *
 * השאלה: למי שיש משרה כשכיר וגם עסק/פרילנס בצד — כמה באמת נשאר לו
 * מההכנסה הצדדית, אחרי שמדרגות המס "יושבות" על השכר?
 *
 * עקרונות החישוב (מקובץ הנתונים המאומת, סעיף ה'):
 *
 * 1. מס הכנסה — ההכנסות מצטברות (ה.4, ביטחון: גבוה):
 *    שתי ההכנסות (שכיר + עצמאי) נכנסות יחד לאותו סולם מדרגות. ההכנסה
 *    העצמאית "יושבת" על השכר — כלומר היא ממוסה במדרגות השוליות שמעל השכר.
 *    נקודות הזיכוי מנוצלות פעם אחת על כלל ההכנסה.
 *    מס על ההכנסה הצדדית = מס(שכר+עצמאי) − מס(שכר בלבד).
 *
 * 2. ביטוח לאומי — כללי "שכיר וגם עצמאי" (ה.1 + ה.2, ביטחון: גבוה):
 *    ההכנסה כשכיר מחושבת "ראשונה". דמי הב"ל על העצמאות מחושבים על
 *    היתרה עד תקרת 51,910 ₪/חודש (תקרה משותפת). אם השכר ≥ התקרה →
 *    אין חבות ב"ל נוספת על העצמאות (מונע כפל גבייה).
 *
 *    הערה מודלית (תיעוד שקיפות): קובץ הנתונים מאמת את **שיתוף התקרה**
 *    (51,910 ₪) ואת מנגנון "השכר קודם". את מיקום סף המדרגה המופחתת
 *    (7,522 ₪) ביחס לשכר — הקובץ אינו מפרט. כאן ההכנסה העצמאית
 *    "יושבת" על השכר גם לעניין מדרגות הב"ל: החלק שמעל השכר ועד 7,522 ₪
 *    בשיעור מופחת (6.1%), והחלק שמעליו ועד התקרה בשיעור מלא (18%).
 *    אם השכר כבר חצה את 7,522 ₪ — כל ההכנסה העצמאית בשיעור המלא.
 *
 * 3. ניכוי 52% מדמי הביטוח הלאומי (סעיף 47א לפקודה, ביטחון: גבוה):
 *    מחצית (52%) מדמי הב"ל ששילם העצמאי מוכרת כניכוי מההכנסה החייבת
 *    לפני חישוב מס ההכנסה. הניכוי מיוחס להכנסה הצדדית (כי חבות הב"ל
 *    נובעת ממנה) — לכן הוא מקטין את מס ההכנסה על ההכנסה הצדדית בלבד.
 *    בסיס הב"ל הוא ההכנסה לפני הניכוי, ולכן אין תלות מעגלית.
 *    (דפוס זהה ל-self-employed-net / year-end-tax-simulator).
 *
 * 4. הכנסה הונית/יסף: לא נכלל כאן (הכנסה מיגיעה אישית בלבד).
 *
 * מקורות:
 * - ביטוח לאומי — "עובד שכיר וגם עצמאי"
 * - רשות המסים — מדרגות מס 2026 (TAX_BRACKETS_2026)
 * - כל-זכות — תיאום מס, דוח שנתי
 */

import {
  TAX_BRACKETS_2026,
  CREDIT_POINT_2026,
  SOCIAL_SECURITY_SELF_EMPLOYED_2026,
} from '@/lib/constants/tax-2026';

// ============================================================
// קבועים מקומיים
// ============================================================

/** סף המדרגה המופחתת בב"ל (60% מהשכר הממוצע) — חודשי */
const BL_REDUCED_THRESHOLD_MONTHLY = 7_703;
/** תקרת ב"ל משותפת (שכיר+עצמאי) — חודשי (מאומת: ה.1) */
const BL_MAX_THRESHOLD_MONTHLY =
  SOCIAL_SECURITY_SELF_EMPLOYED_2026.maxThresholdMonthly; // 51,910

const BL_REDUCED_RATE = SOCIAL_SECURITY_SELF_EMPLOYED_2026.reducedRate.total; // 6.1%
const BL_FULL_RATE = SOCIAL_SECURITY_SELF_EMPLOYED_2026.fullRate.total; // 18%

/** שיעור דמי הב"ל המוכר כניכוי מההכנסה החייבת (סעיף 47א לפקודה) */
const BL_DEDUCTIBLE = 0.52;

// ============================================================
// טיפוסים
// ============================================================

export interface CombinedIncomeInput {
  /** שכר חודשי ברוטו כשכיר (₪) */
  monthlyGrossSalary: number;
  /** הכנסה שנתית חייבת כעצמאי — לאחר הוצאות מוכרות (₪) */
  annualSelfEmployedIncome: number;
  /** נקודות זיכוי (ברירת מחדל 2.25 — תושב) */
  creditPoints: number;
}

export interface CombinedIncomeResult {
  // --- בסיס ---
  /** שכר שנתי ברוטו (שכיר) */
  annualSalary: number;
  /** הכנסה שנתית חייבת (עצמאי) */
  annualSelfEmployedIncome: number;
  /** סך הכנסה חייבת משולבת */
  combinedTaxableIncome: number;

  // --- מס הכנסה ---
  /** מס הכנסה ברוטו על השכר בלבד (לפני זיכוי) */
  taxOnSalaryOnly: number;
  /** מס הכנסה ברוטו על ההכנסה המשולבת (לפני זיכוי, אחרי ניכוי 52% מהב"ל) */
  taxOnCombinedGross: number;
  /** ניכוי 52% מדמי הב"ל מההכנסה החייבת (סעיף 47א) */
  bituachLeumiDeduction: number;
  /** ערך נקודות הזיכוי (שנתי) */
  creditPointsValue: number;
  /** מס הכנסה כולל אחרי זיכוי (על שתי ההכנסות) */
  totalIncomeTax: number;
  /** מס הכנסה המיוחס להכנסה הצדדית (העצמאית) */
  taxOnSideIncome: number;

  // --- ביטוח לאומי ---
  /** דמי ב"ל + בריאות שנתיים על ההכנסה העצמאית (כללי שכיר-גם-עצמאי) */
  selfEmployedBituachLeumi: number;
  /** האם השכר מיצה את התקרה (אין ב"ל נוסף) */
  capReachedBySalary: boolean;
  /** פירוט מדרגות ב"ל על ההכנסה העצמאית */
  bituachLeumiBreakdown: {
    /** הכנסה עצמאית בשיעור מופחת (6.1%) */
    reducedTierIncome: number;
    reducedTierAmount: number;
    /** הכנסה עצמאית בשיעור מלא (18%) */
    fullTierIncome: number;
    fullTierAmount: number;
    /** הכנסה עצמאית מעל התקרה המשותפת (פטורה) */
    exemptIncome: number;
  };

  // --- נטו מההכנסה הצדדית ---
  /** נטו שנתי מההכנסה העצמאית (אחרי מס שולי + ב"ל) */
  netSideIncomeAnnual: number;
  /** נטו חודשי ממוצע מההכנסה העצמאית */
  netSideIncomeMonthly: number;

  // --- מדרגה שולית אפקטיבית ---
  /** המדרגה השולית של מס ההכנסה החלה על השקל הבא מההכנסה העצמאית */
  marginalIncomeTaxRate: number;
  /** השיעור השולי של ב"ל החל על ההכנסה העצמאית */
  marginalBituachRate: number;
  /**
   * מדרגה שולית אפקטיבית משולבת (מס + ב"ל) על ההכנסה הצדדית —
   * (מס צד + ב"ל צד) ÷ הכנסה עצמאית
   */
  effectiveMarginalRate: number;
}

// ============================================================
// פונקציות עזר
// ============================================================

/** מס הכנסה ברוטו לפי מדרגות 2026 על הכנסה שנתית (לפני זיכויים) */
export function calculateBracketTax(annualIncome: number): number {
  const income = Math.max(0, annualIncome);
  let tax = 0;
  let prev = 0;
  for (const b of TAX_BRACKETS_2026) {
    if (income <= prev) break;
    const inBracket = Math.min(income, b.upTo) - prev;
    tax += inBracket * b.rate;
    if (income <= b.upTo) break;
    prev = b.upTo;
  }
  return tax;
}

/** המדרגה השולית (rate) החלה על השקל הבא מעל הכנסה שנתית נתונה */
export function marginalBracketRate(annualIncome: number): number {
  const income = Math.max(0, annualIncome);
  let prev = 0;
  for (const b of TAX_BRACKETS_2026) {
    if (income < b.upTo) return b.rate;
    prev = b.upTo;
  }
  void prev;
  return TAX_BRACKETS_2026[TAX_BRACKETS_2026.length - 1].rate;
}

/**
 * דמי ב"ל + בריאות שנתיים על ההכנסה העצמאית, לפי כללי "שכיר וגם עצמאי":
 * השכר "תופס" קודם את התקרה ואת מדרגת המס המופחת; ההכנסה העצמאית
 * "יושבת" עליו עד התקרה המשותפת (51,910 ₪/חודש).
 */
export function calculateSelfEmployedBituachWithSalary(
  monthlyGrossSalary: number,
  annualSelfEmployedIncome: number,
): CombinedIncomeResult['bituachLeumiBreakdown'] & {
  total: number;
  capReached: boolean;
} {
  const salary = Math.max(0, monthlyGrossSalary);
  const monthlySE = Math.max(0, annualSelfEmployedIncome) / 12;

  // החדר הפנוי עד התקרה המשותפת, אחרי שהשכר "ישב"
  const roomToCap = Math.max(0, BL_MAX_THRESHOLD_MONTHLY - salary);
  const capReached = roomToCap <= 0;

  // החלק החייב מההכנסה העצמאית (עד התקרה)
  const taxableSE = Math.min(monthlySE, roomToCap);
  // החלק שמעל התקרה — פטור
  const exemptMonthly = Math.max(0, monthlySE - taxableSE);

  // מיקום מדרגות הב"ל: ההכנסה העצמאית "יושבת" על השכר.
  // החלק שמעל השכר ועד 7,522 ₪ — שיעור מופחת; מעליו — שיעור מלא.
  const reducedRoom = Math.max(0, BL_REDUCED_THRESHOLD_MONTHLY - salary);
  const reducedMonthly = Math.min(taxableSE, reducedRoom);
  const fullMonthly = Math.max(0, taxableSE - reducedMonthly);

  const reducedAmountMonthly = reducedMonthly * BL_REDUCED_RATE;
  const fullAmountMonthly = fullMonthly * BL_FULL_RATE;

  return {
    reducedTierIncome: reducedMonthly * 12,
    reducedTierAmount: reducedAmountMonthly * 12,
    fullTierIncome: fullMonthly * 12,
    fullTierAmount: fullAmountMonthly * 12,
    exemptIncome: exemptMonthly * 12,
    total: (reducedAmountMonthly + fullAmountMonthly) * 12,
    capReached,
  };
}

// ============================================================
// פונקציית חישוב ראשית
// ============================================================

export function calculateCombinedIncome(
  input: CombinedIncomeInput,
): CombinedIncomeResult {
  const annualSalary = Math.max(0, input.monthlyGrossSalary) * 12;
  const annualSE = Math.max(0, input.annualSelfEmployedIncome);
  const creditPoints = Math.max(0, input.creditPoints);
  const combined = annualSalary + annualSE;

  // --- ביטוח לאומי על ההכנסה העצמאית (מחושב קודם — דרוש לניכוי 52%) ---
  // אין תלות מעגלית: בסיס הב"ל הוא ההכנסה העצמאית לפני ניכוי המס.
  const bl = calculateSelfEmployedBituachWithSalary(
    input.monthlyGrossSalary,
    annualSE,
  );

  // ניכוי 52% מדמי הב"ל מההכנסה החייבת (סעיף 47א לפקודה).
  // הניכוי מיוחס להכנסה הצדדית — לכן רק ההכנסה המשולבת מופחתת בו,
  // והשכר בלבד (taxOnSalaryOnly) נשאר ללא שינוי.
  const bituachLeumiDeduction = bl.total * BL_DEDUCTIBLE;

  // --- מס הכנסה: ההכנסה העצמאית יושבת על השכר ---
  const taxOnSalaryOnly = calculateBracketTax(annualSalary);
  const combinedAfterBLDeduction = Math.max(0, combined - bituachLeumiDeduction);
  const taxOnCombinedGross = calculateBracketTax(combinedAfterBLDeduction);
  const creditPointsValue = creditPoints * CREDIT_POINT_2026.annual;

  // מס כולל אחרי זיכוי (זיכוי מנוצל פעם אחת על כלל ההכנסה)
  const totalIncomeTax = Math.max(0, taxOnCombinedGross - creditPointsValue);

  // מס המיוחס להכנסה הצדדית:
  // ההפרש בין מס משולב (אחרי ניכוי הב"ל) למס שכר, אך לא יותר מהמס הכולל
  // בפועל (אם נקודות הזיכוי מאפסות חלק מהמס על השכר).
  const grossTaxOnSide = taxOnCombinedGross - taxOnSalaryOnly;
  const netTaxOnSalary = Math.max(0, taxOnSalaryOnly - creditPointsValue);
  const taxOnSideIncome = Math.max(0, totalIncomeTax - netTaxOnSalary);
  void grossTaxOnSide;

  // --- נטו מההכנסה הצדדית ---
  const netSideIncomeAnnual = Math.max(
    0,
    annualSE - taxOnSideIncome - bl.total,
  );
  const netSideIncomeMonthly = netSideIncomeAnnual / 12;

  // --- מדרגות שוליות אפקטיביות (על השקל הבא מההכנסה העצמאית) ---
  const marginalIncomeTaxRate = marginalBracketRate(combined);

  const monthlySalary = Math.max(0, input.monthlyGrossSalary);
  let marginalBituachRate: number;
  if (monthlySalary >= BL_MAX_THRESHOLD_MONTHLY) {
    marginalBituachRate = 0; // השכר מיצה את התקרה
  } else {
    const combinedMonthlyAtCap = monthlySalary + annualSE / 12;
    if (combinedMonthlyAtCap >= BL_MAX_THRESHOLD_MONTHLY) {
      marginalBituachRate = 0; // ההכנסה המשולבת בתקרה ומעלה → השקל הבא פטור
    } else if (monthlySalary + annualSE / 12 > BL_REDUCED_THRESHOLD_MONTHLY) {
      marginalBituachRate = BL_FULL_RATE;
    } else {
      marginalBituachRate = BL_REDUCED_RATE;
    }
  }

  // מדרגה אפקטיבית משולבת על ההכנסה הצדדית בפועל
  const effectiveMarginalRate =
    annualSE > 0 ? (taxOnSideIncome + bl.total) / annualSE : 0;

  return {
    annualSalary,
    annualSelfEmployedIncome: annualSE,
    combinedTaxableIncome: combined,
    taxOnSalaryOnly,
    taxOnCombinedGross,
    bituachLeumiDeduction,
    creditPointsValue,
    totalIncomeTax,
    taxOnSideIncome,
    selfEmployedBituachLeumi: bl.total,
    capReachedBySalary: bl.capReached,
    bituachLeumiBreakdown: {
      reducedTierIncome: bl.reducedTierIncome,
      reducedTierAmount: bl.reducedTierAmount,
      fullTierIncome: bl.fullTierIncome,
      fullTierAmount: bl.fullTierAmount,
      exemptIncome: bl.exemptIncome,
    },
    netSideIncomeAnnual,
    netSideIncomeMonthly,
    marginalIncomeTaxRate,
    marginalBituachRate,
    effectiveMarginalRate,
  };
}
