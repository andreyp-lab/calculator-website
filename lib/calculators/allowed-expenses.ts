/**
 * מחשבון הוצאות מוכרות לעצמאי — 2026
 *
 * מחשב, לכל קטגוריית הוצאה, את הסכום המוכר לצורכי מס הכנסה (לפי אחוז ההכרה
 * שנקבע בתקנות) ואת מס התשומות (מע"מ) הניתן לקיזוז, ומסכם את חיסכון המס המשוער
 * לפי המדרגה השולית של ההכנסה.
 *
 * הכלל-על (סעיף 17 לפקודה): הוצאה מוכרת רק אם הוצאה כולה לייצור הכנסה.
 * הוצאה מעורבת (עסקית + פרטית) מוכרת בחלקה היחסי בלבד.
 *
 * מקורות (ראה /tmp/wp-data/regulatory-data.md, סעיף א'):
 * - תקנות מס הכנסה (ניכוי הוצאות מסויימות), תשל"ב-1972
 * - תקנות מס הכנסה (ניכוי הוצאות רכב), התשנ"ה-1995
 * - תקנות מע"מ (תקנה 18 — קיזוז תשומות מעורבות; תקנה 15א — כיבוד/עובד)
 *
 * כל קבוע הכרה מתועד עם הפניה למספר השורה בקובץ הנתונים (א.1–א.27).
 */

import { TAX_BRACKETS_2026, CREDIT_POINT_2026, VAT_2026 } from '@/lib/constants/tax-2026';

// ============================================================
// קבועי הכרה — מתועדים עם הפניה למקור
// ============================================================

/** שיעור מע"מ רגיל (תואם VAT_2026.standard = 18%) */
export const VAT_RATE = VAT_2026.standard;

/**
 * שיעור קיזוז תשומות לרכב פרטי המשמש גם לעסק — 2/3 (תקנה 18; מקור א.24).
 * חל גם על סלולר מעורב (מקור א.25).
 */
export const VAT_MIXED_MAINLY_BUSINESS = 2 / 3;

/**
 * מזהי קטגוריות ההוצאה הנתמכות.
 */
export type ExpenseCategoryKey =
  | 'vehicle'
  | 'cellular'
  | 'homeOffice'
  | 'refreshments'
  | 'equipment'
  | 'training'
  | 'insurance'
  | 'accounting'
  | 'other';

/**
 * הגדרת כלל ההכרה לכל קטגוריה.
 */
export interface ExpenseRule {
  key: ExpenseCategoryKey;
  /** שם הקטגוריה בעברית */
  label: string;
  /**
   * שיעור ההכרה הקבוע במס הכנסה (0–1).
   * אם null — ההכרה נקבעת לפי קלט המשתמש (יחס שימוש/שטח עסקי).
   */
  incomeTaxRecognition: number | null;
  /**
   * שיעור קיזוז מע"מ התשומות (0–1) על החלק העסקי.
   */
  vatRecovery: number;
  /**
   * האם שיעור קיזוז המע"מ מוכפל גם ביחס השימוש העסקי שהזין המשתמש
   * (רלוונטי לקטגוריות מעורבות שבהן המשתמש קובע את החלק העסקי).
   */
  vatRecoveryUsesBusinessRatio: boolean;
  /** הפניה למקור בקובץ הנתונים */
  source: string;
  /** הערה קצרה למשתמש */
  note: string;
}

/**
 * טבלת כללי ההכרה. כל ערך מקורו בקובץ הנתונים המאומת (סעיף א').
 */
export const EXPENSE_RULES: Record<ExpenseCategoryKey, ExpenseRule> = {
  vehicle: {
    key: 'vehicle',
    label: 'רכב',
    // א.1: 45% מהוצאות הרכב מוכרות (חלופת ברירת המחדל)
    incomeTaxRecognition: 0.45,
    // א.24: 2/3 ממס התשומות ניתן לקיזוז ברכב פרטי מעורב
    vatRecovery: VAT_MIXED_MAINLY_BUSINESS,
    vatRecoveryUsesBusinessRatio: false,
    source: 'א.1 / א.24',
    note: 'ברירת המחדל: 45% מהוצאות הרכב (דלק, ביטוח, רישוי, תיקונים, פחת). מע"מ תשומות — 2/3.',
  },
  cellular: {
    key: 'cellular',
    // א.3: חלק יחסי לפי שימוש עסקי (אין שיעור קבוע בחוק)
    label: 'סלולר ותקשורת',
    incomeTaxRecognition: null,
    // א.25: 2/3 ממס התשומות (הוצאה מעורבת)
    vatRecovery: VAT_MIXED_MAINLY_BUSINESS,
    vatRecoveryUsesBusinessRatio: false,
    source: 'א.3 / א.25',
    note: 'אין שיעור קבוע בחוק — ההכרה לפי יחס השימוש העסקי שהוכח. מע"מ תשומות — 2/3.',
  },
  homeOffice: {
    key: 'homeOffice',
    label: 'עבודה מהבית',
    // א.5: חלק יחסי משטח הבית המשמש לעסק
    incomeTaxRecognition: null,
    // אין שיעור מע"מ מיוחד מאומת בקובץ הנתונים לעבודה מהבית
    vatRecovery: 0,
    vatRecoveryUsesBusinessRatio: false,
    source: 'א.5',
    note: 'יחס שטח חדר העבודה מתוך שטח הדירה — מוחל על ארנונה, חשמל, מים, ועד בית, שכ"ד וביטוח דירה.',
  },
  refreshments: {
    key: 'refreshments',
    label: 'כיבוד במקום העיסוק',
    // א.6: 80% מוכר
    incomeTaxRecognition: 0.8,
    // א.26: מס תשומות על כיבוד ככלל אינו ניתן לקיזוז
    vatRecovery: 0,
    vatRecoveryUsesBusinessRatio: false,
    source: 'א.6 / א.26',
    note: 'כיבוד קל במקום העיסוק — 80% מוכר במס הכנסה. מע"מ תשומות על כיבוד — ככלל אינו ניתן לקיזוז.',
  },
  equipment: {
    key: 'equipment',
    label: 'ציוד ופחת',
    // א.19–א.22: ציוד נדרש להיפחת; הסכום שמוזן כאן הוא הוצאת הפחת המוכרת לשנה
    incomeTaxRecognition: 1,
    vatRecovery: 1,
    vatRecoveryUsesBusinessRatio: false,
    source: 'א.19 / א.23',
    note: 'הזן את הוצאת הפחת המוכרת לשנה (מחשבים 33%, ריהוט 6%–7%, ציוד ~15%). מע"מ תשומות — מלא.',
  },
  training: {
    key: 'training',
    label: 'השתלמויות וספרות מקצועית',
    // א.10: מוכר אם שמירה על הקיים (לא השכלה ראשונית)
    incomeTaxRecognition: 1,
    vatRecovery: 1,
    vatRecoveryUsesBusinessRatio: false,
    source: 'א.10',
    note: 'מוכר רק אם מטרתו שמירה על הקיים — לא רכישת מקצוע חדש או השכלה ראשונית (הוצאה הונית).',
  },
  insurance: {
    key: 'insurance',
    label: 'ביטוחים מקצועיים',
    // א.18: ביטוח אחריות מקצועית / צד ג' עסקי — מוכר במלואו
    incomeTaxRecognition: 1,
    vatRecovery: 1,
    vatRecoveryUsesBusinessRatio: false,
    source: 'א.18',
    note: 'ביטוח אחריות מקצועית / צד ג\' עסקי — מוכר במלואו. ביטוח חיים/בריאות אישי אינו הוצאה עסקית.',
  },
  accounting: {
    key: 'accounting',
    label: 'שכ"ט רו"ח / הנהלת חשבונות',
    // א.23: מוכר במלואו
    incomeTaxRecognition: 1,
    vatRecovery: 1,
    vatRecoveryUsesBusinessRatio: false,
    source: 'א.23',
    note: 'הוצאה שוטפת לייצור הכנסה — מוכרת במלואה. מע"מ תשומות — מלא.',
  },
  other: {
    key: 'other',
    label: 'הוצאות עסקיות אחרות',
    // ברירת מחדל: הוצאה עסקית מלאה לייצור הכנסה (סעיף 17)
    incomeTaxRecognition: 1,
    vatRecovery: 1,
    vatRecoveryUsesBusinessRatio: false,
    source: 'סעיף 17 לפקודה',
    note: 'הוצאות עסקיות שוטפות אחרות לייצור הכנסה — מוכרות במלואן (בכפוף לכך שאינן פרטיות).',
  },
};

// סדר תצוגה מומלץ
export const EXPENSE_CATEGORY_ORDER: ExpenseCategoryKey[] = [
  'vehicle',
  'cellular',
  'homeOffice',
  'refreshments',
  'equipment',
  'training',
  'insurance',
  'accounting',
  'other',
];

// ============================================================
// טיפוסי קלט
// ============================================================

export interface AllowedExpensesInput {
  /** הכנסה שנתית חייבת (לאחר הוצאות) — לקביעת המדרגה השולית. אופציונלי */
  annualIncome?: number;
  /** האם העוסק רשום כעוסק מורשה (רק מורשה מקזז מע"מ תשומות) */
  isVatRegistered: boolean;
  /** נקודות זיכוי — להערכת המדרגה השולית */
  creditPoints?: number;
  /** סכומי ההוצאה השנתיים לפי קטגוריה (כולל מע"מ, ₪) */
  expenses: Partial<Record<ExpenseCategoryKey, number>>;
  /**
   * יחס השימוש העסקי לסלולר (0–1). ברירת מחדל 0.5 (מקור א.3).
   */
  cellularBusinessRatio?: number;
  /**
   * יחס שטח חדר העבודה מתוך שטח הדירה (0–1) — לעבודה מהבית (מקור א.5).
   */
  homeOfficeAreaRatio?: number;
}

// ============================================================
// טיפוסי פלט
// ============================================================

export interface CategoryResult {
  key: ExpenseCategoryKey;
  label: string;
  /** הסכום שהוזן (כולל מע"מ) */
  grossExpense: number;
  /** שיעור ההכרה במס הכנסה שהוחל בפועל (0–1) */
  incomeTaxRecognitionApplied: number;
  /** הסכום המוכר לצורכי מס הכנסה (₪) */
  recognizedForIncomeTax: number;
  /** מס תשומות הגלום בהוצאה (₪) */
  embeddedVat: number;
  /** מס תשומות הניתן לקיזוז (₪) */
  vatRecoverable: number;
  /** הפניה למקור */
  source: string;
}

export interface AllowedExpensesResult {
  /** פירוט לפי קטגוריה (רק קטגוריות עם סכום > 0) */
  categories: CategoryResult[];
  /** סך ההוצאה שהוזנה (כולל מע"מ) */
  totalGrossExpense: number;
  /** סך ההוצאה המוכרת לצורכי מס הכנסה */
  totalRecognizedForIncomeTax: number;
  /** סך מס תשומות הניתן לקיזוז */
  totalVatRecoverable: number;
  /** המדרגה השולית ששימשה לחישוב חיסכון המס (0–1) */
  marginalTaxRate: number;
  /** חיסכון מס הכנסה משוער = הוצאה מוכרת × מדרגה שולית */
  estimatedIncomeTaxSaving: number;
  /** סך ההטבה הכוללת = חיסכון מס הכנסה + קיזוז מע"מ */
  totalBenefit: number;
  /** הערות / אזהרות */
  notes: string[];
}

// ============================================================
// עזר: מדרגה שולית לפי הכנסה שנתית חייבת
// ============================================================

/**
 * מחזיר את שיעור המס השולי (מדרגת המס העליונה) להכנסה שנתית נתונה.
 * מקור המדרגות: TAX_BRACKETS_2026.
 */
export function getMarginalTaxRate(annualIncome: number): number {
  if (annualIncome <= 0) return 0;
  for (const b of TAX_BRACKETS_2026) {
    if (annualIncome <= b.upTo) return b.rate;
  }
  return TAX_BRACKETS_2026[TAX_BRACKETS_2026.length - 1].rate;
}

// ============================================================
// חישוב עיקרי
// ============================================================

const DEFAULT_CELLULAR_RATIO = 0.5; // מקור א.3 — שכיח ~50%

function clampRatio(v: number | undefined, fallback: number): number {
  if (v === undefined || Number.isNaN(v)) return fallback;
  if (v < 0) return 0;
  if (v > 1) return 1;
  return v;
}

/**
 * מחשב, לקטגוריה אחת, את ההכרה ואת קיזוז המע"מ.
 */
function computeCategory(
  key: ExpenseCategoryKey,
  grossExpense: number,
  isVatRegistered: boolean,
  cellularBusinessRatio: number,
  homeOfficeAreaRatio: number,
): CategoryResult {
  const rule = EXPENSE_RULES[key];
  const gross = Math.max(0, grossExpense);

  // שיעור ההכרה במס הכנסה
  let recognition: number;
  if (rule.incomeTaxRecognition !== null) {
    recognition = rule.incomeTaxRecognition;
  } else if (key === 'cellular') {
    recognition = cellularBusinessRatio;
  } else if (key === 'homeOffice') {
    recognition = homeOfficeAreaRatio;
  } else {
    recognition = 1;
  }

  // מס תשומות גלום (ההוצאה כוללת מע"מ): VAT = gross × rate/(1+rate)
  const embeddedVat = gross * (VAT_RATE / (1 + VAT_RATE));

  let vatRecoverable = 0;
  if (isVatRegistered && rule.vatRecovery > 0) {
    // בסיס הקיזוז: בקטגוריות מבוססות-יחס, הקיזוז חל על החלק העסקי
    const businessRatio =
      key === 'cellular'
        ? cellularBusinessRatio
        : key === 'homeOffice'
          ? homeOfficeAreaRatio
          : 1;
    const baseVat = rule.vatRecoveryUsesBusinessRatio ? embeddedVat * businessRatio : embeddedVat;
    vatRecoverable = baseVat * rule.vatRecovery;
  }

  // בסיס ההכרה במס הכנסה:
  // לעוסק מורשה שקיזז מע"מ תשומות — המע"מ המקוזז אינו הוצאה, ולכן בסיס ההכרה
  // הוא ההוצאה בניכוי המע"מ שקוזז (gross − vatRecoverable). לעוסק פטור — המע"מ
  // נשאר חלק מהעלות ולכן בסיס ההכרה הוא ה-gross המלא.
  // לקטגוריות מבוססות-יחס, ה-recognition כבר משקף את החלק העסקי.
  const recognitionBase = gross - vatRecoverable;
  const recognizedForIncomeTax = recognitionBase * recognition;

  return {
    key,
    label: rule.label,
    grossExpense: gross,
    incomeTaxRecognitionApplied: recognition,
    recognizedForIncomeTax,
    embeddedVat,
    vatRecoverable,
    source: rule.source,
  };
}

export function calculateAllowedExpenses(input: AllowedExpensesInput): AllowedExpensesResult {
  const cellularRatio = clampRatio(input.cellularBusinessRatio, DEFAULT_CELLULAR_RATIO);
  const homeRatio = clampRatio(input.homeOfficeAreaRatio, 0);

  const categories: CategoryResult[] = [];
  for (const key of EXPENSE_CATEGORY_ORDER) {
    const amount = input.expenses[key] ?? 0;
    if (amount <= 0) continue;
    categories.push(
      computeCategory(key, amount, input.isVatRegistered, cellularRatio, homeRatio),
    );
  }

  const totalGrossExpense = categories.reduce((s, c) => s + c.grossExpense, 0);
  const totalRecognizedForIncomeTax = categories.reduce(
    (s, c) => s + c.recognizedForIncomeTax,
    0,
  );
  const totalVatRecoverable = categories.reduce((s, c) => s + c.vatRecoverable, 0);

  // מדרגה שולית: אם הוזנה הכנסה — לפי המדרגה; אחרת 0.
  const marginalTaxRate = getMarginalTaxRate(input.annualIncome ?? 0);

  // חיסכון מס הכנסה = הוצאה מוכרת × מדרגה שולית.
  // הערה: עבור עוסק מורשה, מס התשומות המקוזז אינו נכלל בהוצאה לצורכי מס הכנסה
  // (ההוצאה לצורכי מ"ה היא ללא מע"מ). לעוסק פטור — המע"מ אינו ניתן לקיזוז ונכלל בהוצאה.
  const estimatedIncomeTaxSaving = totalRecognizedForIncomeTax * marginalTaxRate;

  const totalBenefit = estimatedIncomeTaxSaving + totalVatRecoverable;

  const notes: string[] = [];
  if (!input.isVatRegistered && totalGrossExpense > 0) {
    notes.push(
      'עוסק פטור אינו מקזז מע"מ תשומות — המע"מ הגלום בהוצאות נשאר כחלק מעלות ההוצאה.',
    );
  }
  if (input.annualIncome === undefined || input.annualIncome <= 0) {
    notes.push(
      'לא הוזנה הכנסה שנתית — לא ניתן להעריך את חיסכון המס לפי המדרגה השולית.',
    );
  }
  if ((input.expenses.refreshments ?? 0) > 0) {
    notes.push('כיבוד מוכר 80% במס הכנסה, ומס התשומות עליו ככלל אינו ניתן לקיזוז (תקנה 15א).');
  }
  if ((input.expenses.vehicle ?? 0) > 0) {
    notes.push('רכב: 45% מההוצאות מוכר; קיים מסלול חלופי (הוצאות בניכוי שווי שימוש) — בחר את הגבוה.');
  }
  if (input.isVatRegistered && (input.expenses.refreshments ?? 0) > 0) {
    notes.push('שים לב: לא קוזז מע"מ תשומות על כיבוד — בהתאם לעמדה המקצועית הרווחת.');
  }

  return {
    categories,
    totalGrossExpense,
    totalRecognizedForIncomeTax,
    totalVatRecoverable,
    marginalTaxRate,
    estimatedIncomeTaxSaving,
    totalBenefit,
    notes,
  };
}

/**
 * עזר נוח לתצוגה: רשימת כל כללי ההכרה (לטבלת-האם בעמוד).
 */
export function listExpenseRules(): ExpenseRule[] {
  return EXPENSE_CATEGORY_ORDER.map((k) => EXPENSE_RULES[k]);
}

// תאימות-לאחור / שמות חלופיים נפוצים
export const CREDIT_POINT_ANNUAL = CREDIT_POINT_2026.annual;
