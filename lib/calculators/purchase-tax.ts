/**
 * מחשבון מס רכישה - 2024 / 2025 / 2026
 *
 * מקור: רשות המסים, מיסוי מקרקעין
 * מדרגות מאומתות עבור 2024, 2025, 2026
 * תקרות מתעדכנות ב-15 בינואר לפי מדד המחירים לצרכן
 *
 * ⚠️ לתשלום סופי פנה לרו"ח / עורך דין - חישוב זה הוא אינדיקטיבי בלבד
 */

import { PURCHASE_TAX_2026 } from '@/lib/constants/tax-2026';

// ============================================================
// סוגי רוכשים
// ============================================================

export type BuyerType =
  | 'first-home'       // דירה ראשונה ויחידה - תושב ישראל
  | 'replacement'      // משפר דיור (מחליף דירה קיימת)
  | 'investor'         // דירה נוספת / משקיע
  | 'foreign'          // תושב חוץ (זר)
  | 'oleh'             // עולה חדש / תושב חוזר (תוך 7 שנים)
  | 'disabled'         // נכה 50%+ / נפגע פעולת איבה
  | 'large-family'     // משפחה ברוכת ילדים (3+ ילדים) - לשיקול הדעת
  | 'gift';            // רכישה ללא תמורה / מתנה

export const BUYER_TYPE_LABELS: Record<BuyerType, string> = {
  'first-home':   'דירה ראשונה ויחידה',
  replacement:    'משפר דיור (מחליף דירה)',
  investor:       'דירה נוספת / משקיע',
  foreign:        'תושב חוץ',
  oleh:           'עולה חדש / תושב חוזר',
  disabled:       'נכה / נפגע פעולת איבה',
  'large-family': 'משפחה ברוכת ילדים (3+ ילדים)',
  gift:           'רכישה ללא תמורה (מתנה)',
};

export const BUYER_TYPE_DESCRIPTION: Record<BuyerType, string> = {
  'first-home':
    'תושב ישראל שאין לו ולבן/בת הזוג דירה אחרת. פטור עד 1,978,745 ₪ ב-2026.',
  replacement:
    'בעל דירה המוכר אותה וקונה אחרת. אם ימכור תוך 18 חודש מהרכישה — אותן מדרגות כמו דירה ראשונה.',
  investor:
    'מי שיש לו דירה נוספת (ולא מוכרה). מס גבוה: 8% מהשקל הראשון עד 6.05M, 10% מעבר.',
  foreign:
    'מי שאינו תושב ישראל. בדרך כלל כמו משקיע + עלולים לחול מגבלות נוספות. בדוק עם עו"ד.',
  oleh:
    'עולה חדש או תושב חוזר ב-7 שנות זכאות. מס מופחת מאוד: 0.5% עד 5M, 5% מעבר.',
  disabled:
    'נכה בשיעור 50%+ אחוזי נכות רפואית, או נפגע פעולת איבה. פטור מוגבר עד 2.5M ₪.',
  'large-family':
    'משפחה עם 3+ ילדים. הקלות מסוימות ייתכנו, אך בדרך כלל לפי מדרגות דירה ראשונה. פנה לרשות המסים.',
  gift:
    'רכישה ללא תמורה (מתנה לילד, בן זוג). בדרך כלל ⅓ שיעור המס הרגיל. בדוק עם עו"ד.',
};

// ============================================================
// מבנה מדרגה
// ============================================================

export interface TaxBracket {
  upTo: number;
  rate: number;
}

// ============================================================
// מדרגות לפי שנה
// ============================================================

/** מדרגות דירה ראשונה 2024 */
export const PURCHASE_TAX_FIRST_HOME_2024: TaxBracket[] = [
  { upTo: 1_919_155, rate: 0 },
  { upTo: 2_276_360, rate: 0.035 },
  { upTo: 5_872_725, rate: 0.05 },
  { upTo: 19_575_755, rate: 0.08 },
  { upTo: Infinity,  rate: 0.10 },
];

/** מדרגות דירה נוספת 2024 */
export const PURCHASE_TAX_INVESTOR_2024: TaxBracket[] = [
  { upTo: 5_872_725, rate: 0.08 },
  { upTo: Infinity,  rate: 0.10 },
];

/** מדרגות דירה ראשונה 2025 */
export const PURCHASE_TAX_FIRST_HOME_2025: TaxBracket[] = [
  { upTo: 1_978_745, rate: 0 },
  { upTo: 2_347_040, rate: 0.035 },
  { upTo: 6_055_070, rate: 0.05 },
  { upTo: 20_183_565, rate: 0.08 },
  { upTo: Infinity,  rate: 0.10 },
];

/** מדרגות דירה נוספת 2025 */
export const PURCHASE_TAX_INVESTOR_2025: TaxBracket[] = [
  { upTo: 6_055_070, rate: 0.08 },
  { upTo: Infinity,  rate: 0.10 },
];

/** מדרגות דירה ראשונה 2026 (גם נוכחי) */
export const PURCHASE_TAX_FIRST_HOME_2026: TaxBracket[] = [
  { upTo: 1_978_745, rate: 0 },
  { upTo: 2_347_040, rate: 0.035 },
  { upTo: 6_055_070, rate: 0.05 },
  { upTo: 20_183_565, rate: 0.08 },
  { upTo: Infinity,  rate: 0.10 },
];

/** מדרגות דירה נוספת 2026 */
export const PURCHASE_TAX_INVESTOR_2026: TaxBracket[] = [
  { upTo: 6_055_070, rate: 0.08 },
  { upTo: Infinity,  rate: 0.10 },
];

/** מדרגות עולה חדש */
export const PURCHASE_TAX_OLEH_2026: TaxBracket[] = [
  { upTo: 5_000_000, rate: 0.005 },
  { upTo: Infinity,  rate: 0.05 },
];

export const PURCHASE_TAX_OLEH_2025 = PURCHASE_TAX_OLEH_2026;
export const PURCHASE_TAX_OLEH_2024: TaxBracket[] = [
  { upTo: 5_000_000, rate: 0.005 },
  { upTo: Infinity,  rate: 0.05 },
];

// ============================================================
// פונקציה: קבלת מדרגות לפי שנה + סוג
// ============================================================

export type TaxYear = 2024 | 2025 | 2026;

export function getBracketsForYear(
  year: TaxYear,
  buyerType: BuyerType,
): TaxBracket[] {
  if (buyerType === 'oleh') {
    if (year === 2024) return PURCHASE_TAX_OLEH_2024;
    if (year === 2025) return PURCHASE_TAX_OLEH_2025;
    return PURCHASE_TAX_OLEH_2026;
  }

  const isInvestor =
    buyerType === 'investor' || buyerType === 'foreign';

  if (isInvestor) {
    if (year === 2024) return PURCHASE_TAX_INVESTOR_2024;
    if (year === 2025) return PURCHASE_TAX_INVESTOR_2025;
    return PURCHASE_TAX_INVESTOR_2026;
  }

  // first-home, replacement, disabled, large-family, gift - בסיס מדרגות דירה ראשונה
  if (year === 2024) return PURCHASE_TAX_FIRST_HOME_2024;
  if (year === 2025) return PURCHASE_TAX_FIRST_HOME_2025;
  return PURCHASE_TAX_FIRST_HOME_2026;
}

// ============================================================
// פונקציה: חישוב מס על בסיס מדרגות
// ============================================================

export interface PurchaseTaxBreakdown {
  bracket: string;
  range: string;
  rate: number;
  amountInBracket: number;
  taxInBracket: number;
}

function applyBrackets(
  propertyValue: number,
  brackets: readonly TaxBracket[] | TaxBracket[],
): { totalTax: number; breakdown: PurchaseTaxBreakdown[] } {
  const breakdown: PurchaseTaxBreakdown[] = [];
  let totalTax = 0;
  let previousLimit = 0;

  for (const bracket of brackets) {
    if (propertyValue <= previousLimit) break;

    const taxableInBracket = Math.min(propertyValue, bracket.upTo) - previousLimit;
    const taxInBracket = taxableInBracket * bracket.rate;
    totalTax += taxInBracket;

    if (taxableInBracket > 0) {
      const upperLabel =
        bracket.upTo === Infinity
          ? '∞'
          : bracket.upTo.toLocaleString('he-IL');
      breakdown.push({
        bracket: `${(bracket.rate * 100).toFixed(1)}%`,
        range: `${previousLimit.toLocaleString('he-IL')} - ${upperLabel}`,
        rate: bracket.rate,
        amountInBracket: taxableInBracket,
        taxInBracket,
      });
    }

    if (propertyValue <= bracket.upTo) break;
    previousLimit = bracket.upTo;
  }

  return { totalTax, breakdown };
}

// ============================================================
// חישוב הנחת נכה
// ============================================================

const DISABLED_EXEMPTION_LIMIT = 2_500_000;

// ============================================================
// חישוב הנחת עולה חדש
// ============================================================

export interface OlehDiscountResult {
  baseTax: number;                // מס ללא הנחת עולה
  olehTax: number;                // מס עם הנחת עולה
  savings: number;                // חיסכון
  savingsPercent: number;         // חיסכון באחוזים
}

export function calculateImmigrantDiscount(
  propertyValue: number,
  year: TaxYear = 2026,
): OlehDiscountResult {
  const firstHomeBrackets = getBracketsForYear(year, 'first-home');
  const olehBrackets = getBracketsForYear(year, 'oleh');

  const { totalTax: baseTax } = applyBrackets(propertyValue, firstHomeBrackets);
  const { totalTax: olehTax } = applyBrackets(propertyValue, olehBrackets);

  const savings = Math.max(0, baseTax - olehTax);
  const savingsPercent = baseTax > 0 ? (savings / baseTax) * 100 : 0;

  return { baseTax, olehTax, savings, savingsPercent };
}

// ============================================================
// חישוב רכישה משותפת (לפי % בעלות)
// ============================================================

export interface JointPurchaseInput {
  propertyValue: number;
  ownershipPercent: number; // 0-100
  buyerType: BuyerType;
  year?: TaxYear;
}

export function calculateJointPurchaseTax(input: JointPurchaseInput): {
  proportionalValue: number;
  totalTax: number;
  effectiveRate: number;
  breakdown: PurchaseTaxBreakdown[];
} {
  const year = input.year ?? 2026;
  const proportionalValue = input.propertyValue * (input.ownershipPercent / 100);
  const brackets = getBracketsForYear(year, input.buyerType);
  const { totalTax, breakdown } = applyBrackets(proportionalValue, brackets);
  const effectiveRate = proportionalValue > 0 ? (totalTax / proportionalValue) * 100 : 0;
  return { proportionalValue, totalTax, effectiveRate, breakdown };
}

// ============================================================
// השוואה: דירה ראשונה vs משקיע
// ============================================================

export interface BuyerTypeComparison {
  buyerType: BuyerType;
  label: string;
  totalTax: number;
  effectiveRate: number;
  breakdown: PurchaseTaxBreakdown[];
}

export function compareAllBuyerTypes(
  propertyValue: number,
  year: TaxYear = 2026,
): BuyerTypeComparison[] {
  const types: BuyerType[] = ['first-home', 'replacement', 'investor', 'oleh', 'disabled'];
  return types.map((buyerType) => {
    const result = calculatePurchaseTaxByType({ propertyValue, buyerType, year });
    return {
      buyerType,
      label: BUYER_TYPE_LABELS[buyerType],
      totalTax: result.totalTax,
      effectiveRate: result.effectiveRate,
      breakdown: result.breakdown,
    };
  });
}

// ============================================================
// השוואת שנים
// ============================================================

export interface YearComparison {
  year: TaxYear;
  totalTax: number;
  effectiveRate: number;
  difference?: number; // מ-2024 לשנה הנוכחית
}

export function compareAcrossYears(
  propertyValue: number,
  buyerType: BuyerType,
): YearComparison[] {
  const years: TaxYear[] = [2024, 2025, 2026];
  const results = years.map((year) => {
    const brackets = getBracketsForYear(year, buyerType);
    const { totalTax } = applyBrackets(propertyValue, brackets);
    const effectiveRate = propertyValue > 0 ? (totalTax / propertyValue) * 100 : 0;
    return { year, totalTax, effectiveRate };
  });

  // חישוב הפרש מ-2024
  const base = results[0].totalTax;
  return results.map((r) => ({
    ...r,
    difference: r.totalTax - base,
  }));
}

// ============================================================
// חישוב בסיסי לפי סוג רוכש
// ============================================================

export interface PurchaseTaxByTypeInput {
  propertyValue: number;
  buyerType: BuyerType;
  year?: TaxYear;
  ownershipPercent?: number; // לרכישה משותפת (0-100)
}

export interface PurchaseTaxByTypeResult {
  totalTax: number;
  effectiveRate: number;
  breakdown: PurchaseTaxBreakdown[];
  fullExemption: boolean;
  partialExemption: boolean;
  notes: string[];
  proportionalValue?: number;
}

export function calculatePurchaseTaxByType(
  input: PurchaseTaxByTypeInput,
): PurchaseTaxByTypeResult {
  const { buyerType, ownershipPercent = 100 } = input;
  const year: TaxYear = input.year ?? 2026;
  const notes: string[] = [];

  const proportionalValue =
    ownershipPercent < 100
      ? input.propertyValue * (ownershipPercent / 100)
      : input.propertyValue;

  if (proportionalValue <= 0) {
    return {
      totalTax: 0,
      effectiveRate: 0,
      breakdown: [],
      fullExemption: false,
      partialExemption: false,
      notes: [],
    };
  }

  let taxableValue = proportionalValue;
  let brackets: TaxBracket[];

  switch (buyerType) {
    case 'first-home':
      brackets = getBracketsForYear(year, 'first-home');
      break;

    case 'replacement':
      brackets = getBracketsForYear(year, 'first-home');
      notes.push('מחליף דירה — אותן מדרגות כמו דירה ראשונה, בתנאי שתמכור תוך 18 חודש מהרכישה.');
      notes.push('אם לא תמכור בזמן — תחויב בהפרש מס (כמשקיע).');
      break;

    case 'investor':
      brackets = getBracketsForYear(year, 'investor');
      notes.push('דירה נוספת / להשקעה — מס מלא מהשקל הראשון, ללא פטור.');
      break;

    case 'foreign':
      brackets = getBracketsForYear(year, 'investor');
      notes.push('תושב חוץ — בדרך כלל כמו משקיע. ייתכנו כללים נוספים; יש להתייעץ עם עו"ד.');
      break;

    case 'oleh':
      brackets = getBracketsForYear(year, 'oleh');
      notes.push('עולה חדש / תושב חוזר — שיעור מופחת בתוקף ל-7 שנים מעלייה.');
      break;

    case 'disabled': {
      const exemptionLimit = DISABLED_EXEMPTION_LIMIT;
      if (taxableValue <= exemptionLimit) {
        return {
          totalTax: 0,
          effectiveRate: 0,
          breakdown: [],
          fullExemption: true,
          partialExemption: false,
          proportionalValue,
          notes: [`נכה / נפגע פעולת איבה — פטור מלא עד ${exemptionLimit.toLocaleString('he-IL')} ₪.`],
        };
      }
      brackets = getBracketsForYear(year, 'first-home');
      notes.push('נכה — מדרגות דירה ראשונה, ייתכנו הקלות נוספות. פנה לרשות המסים.');
      break;
    }

    case 'large-family':
      brackets = getBracketsForYear(year, 'first-home');
      notes.push('משפחה ברוכת ילדים — בדרך כלל מדרגות דירה ראשונה. ייתכנו הקלות בהתאם לנסיבות.');
      break;

    case 'gift':
      // מתנה — ⅓ מהמס הרגיל של דירה ראשונה (בהתאם לפס"ד ועמדת רשות המסים)
      brackets = getBracketsForYear(year, 'first-home');
      notes.push('רכישה ללא תמורה (מתנה) — המס הוא ⅓ מהמס הרגיל. ודא עם עו"ד.');
      break;

    default:
      brackets = getBracketsForYear(year, 'first-home');
  }

  let { totalTax, breakdown } = applyBrackets(taxableValue, brackets);

  // מתנה = ⅓ מס
  if (buyerType === 'gift') {
    totalTax = totalTax / 3;
    breakdown = breakdown.map((b) => ({
      ...b,
      taxInBracket: b.taxInBracket / 3,
    }));
  }

  if (ownershipPercent < 100) {
    notes.push(
      `רכישה משותפת — חושב על ${ownershipPercent}% בעלות (${proportionalValue.toLocaleString('he-IL')} ₪).`,
    );
  }

  const fullExemption = totalTax === 0;
  const partialExemption =
    totalTax > 0 && breakdown.some((b) => b.rate === 0);
  const effectiveRate = proportionalValue > 0 ? (totalTax / proportionalValue) * 100 : 0;

  return {
    totalTax,
    effectiveRate,
    breakdown,
    fullExemption,
    partialExemption,
    proportionalValue,
    notes,
  };
}

// ============================================================
// חישוב ראשי - תאימות לאחור (API ישן)
// ============================================================

export interface PurchaseTaxInput {
  propertyValue: number;
  buyerType: BuyerType;
  isYoung: boolean; // deprecated - עולה חדש בשנים ראשונות
}

export interface PurchaseTaxResult {
  totalTax: number;
  effectiveRate: number;
  breakdown: PurchaseTaxBreakdown[];
  fullExemption: boolean;
  partialExemption: boolean;
  notes: string[];
}

/**
 * calculatePurchaseTax — נשמרת לתאימות לאחור עם ה-API הקיים.
 * שימוש חדש: העדף calculatePurchaseTaxByType().
 */
export function calculatePurchaseTax(input: PurchaseTaxInput): PurchaseTaxResult {
  const { propertyValue, buyerType, isYoung } = input;

  if (propertyValue <= 0) {
    return {
      totalTax: 0,
      effectiveRate: 0,
      breakdown: [],
      fullExemption: false,
      partialExemption: false,
      notes: [],
    };
  }

  const result = calculatePurchaseTaxByType({ propertyValue, buyerType, year: 2026 });

  const notes = [...result.notes];
  if (isYoung && buyerType === 'oleh') {
    notes.push('עולה חדש בשנותיו הראשונות — יתכנו הקלות נוספות. בדוק עם יועץ מס.');
  }

  return {
    totalTax: result.totalTax,
    effectiveRate: result.effectiveRate,
    breakdown: result.breakdown,
    fullExemption: result.fullExemption,
    partialExemption: result.partialExemption,
    notes,
  };
}

// ============================================================
// חישוב חיסכון פוטנציאלי (המלצות)
// ============================================================

export interface SavingsRecommendation {
  scenario: string;
  currentTax: number;
  alternativeTax: number;
  savings: number;
  action: string;
}

export function getSmartRecommendations(
  propertyValue: number,
  buyerType: BuyerType,
  year: TaxYear = 2026,
): SavingsRecommendation[] {
  const current = calculatePurchaseTaxByType({ propertyValue, buyerType, year });
  const recs: SavingsRecommendation[] = [];

  if (buyerType === 'investor') {
    const firstHome = calculatePurchaseTaxByType({ propertyValue, buyerType: 'first-home', year });
    recs.push({
      scenario: 'אם היה זו דירתך הראשונה (מכרת את הקיימת)',
      currentTax: current.totalTax,
      alternativeTax: firstHome.totalTax,
      savings: current.totalTax - firstHome.totalTax,
      action: 'שקול למכור את הדירה הקיימת לפני הרכישה ולהזדכות על מדרגות דירה ראשונה.',
    });
  }

  if (buyerType === 'first-home' || buyerType === 'investor') {
    const oleh = calculatePurchaseTaxByType({ propertyValue, buyerType: 'oleh', year });
    if (current.totalTax > oleh.totalTax) {
      recs.push({
        scenario: 'כעולה חדש (אם רלוונטי)',
        currentTax: current.totalTax,
        alternativeTax: oleh.totalTax,
        savings: current.totalTax - oleh.totalTax,
        action: 'עולה חדש זכאי לשיעור מופחת מאוד (0.5%). בדוק זכאות עם רו"ח.',
      });
    }
  }

  if (buyerType === 'investor' && propertyValue > 6_055_070) {
    recs.push({
      scenario: 'רכישת שתי דירות נפרדות במקום אחת',
      currentTax: current.totalTax,
      alternativeTax: current.totalTax * 0.85, // הערכה
      savings: current.totalTax * 0.15,
      action:
        'לעיתים פיצול לשתי עסקאות נפרדות (עם בן/בת זוג) מאפשר חסכון. ייעוץ מס חובה.',
    });
  }

  return recs.filter((r) => r.savings > 0);
}
