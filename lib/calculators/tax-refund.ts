/**
 * מחשבון החזר מס לשכירים - ישראל 2026
 *
 * הרעיון: מס שנתי תקין = חישוב על בסיס שנתי של כל ההכנסות פחות זיכויים וניכויים.
 * אם נוכה במהלך השנה יותר ממה שצריך → זכאי להחזר.
 *
 * סיבות עיקריות להחזר מס:
 * 1. מספר מעסיקים ללא תיאום מס (מנכים מהשכר השני לפי מדרגה גבוהה)
 * 2. עבודה חלקית בשנה (פיטורים/חל"ת/לידה) - ניכוי הניח שכר מלא
 * 3. הפקדות פנסיה/קרן השתלמות עצמאיות
 * 4. תרומות (זיכוי 35% לפי סעיף 46)
 * 5. ביטוח חיים
 * 6. נקודות זיכוי לא נוצלו (לידת תינוק לאחר הגשת 101)
 * 7. עולה חדש בשנה הראשונה
 * 8. חייל משוחרר עד 3 שנים מהשחרור
 * 9. אזורי פריפריה (אילת = 10%)
 * 10. בן/בת זוג ללא הכנסה
 * 11. הפקדות לקופ"ג / ביטוח אובדן כושר עבודה
 * 12. הוצאות מוכרות (שכר לימוד גבוה, לימודי מקצוע)
 *
 * מקור: רשות המסים, כל-זכות, finupp/meitavdash, פקודת מס הכנסה
 * אומת: 2026-05-03
 */

import {
  TAX_BRACKETS_2026,
  CREDIT_POINT_2026,
  CREDIT_POINTS_BY_STATUS,
  SOCIAL_SECURITY_EMPLOYEE_2026,
} from '@/lib/constants/tax-2026';

// ============================================================
// סוגים
// ============================================================

export type Gender = 'male' | 'female';
export type MaritalStatus = 'single' | 'married' | 'single-parent';
export type PeripheryZone =
  | 'none'
  | 'eilat' // 10%
  | 'tier-a' // 7% (קרית שמונה, צפת, מעלות, וכו')
  | 'tier-b' // 11% (יישובים מסוימים בצפון/דרום)
  | 'tier-c'; // 13% (יישובי קו עימות)

export interface TaxRefundInput {
  // ----- שלב 1: הכנסות שנתיות -----
  /** שכר ברוטו שנתי (סך כל המעסיקים) */
  annualGrossSalary: number;
  /** מס הכנסה שנוכה במקור במהלך השנה (מטופס 106) */
  taxWithheld: number;
  /** ביטוח לאומי שנוכה (לבדיקת תיאום) */
  socialSecurityWithheld: number;
  /** חודשים שעבד בפועל (12 = שנה מלאה) */
  monthsWorked: number;

  // ----- שלב 2: סטטוס אישי -----
  gender: Gender;
  maritalStatus: MaritalStatus;
  /** האם הבן/בת זוג ללא הכנסה (זכאי לתוספת נקודה) */
  spouseNoIncome: boolean;
  /** ילדים בשנת הלידה */
  childrenAge0: number;
  /** ילדים בני 1-5 */
  childrenAge1to5: number;
  /** ילדים בני 6-17 */
  childrenAge6to17: number;
  /** ילדים בני 18 */
  childrenAge18: number;
  /** ילדים נכים */
  disabledChildren: number;

  // ----- שלב 3: מצבים מיוחדים -----
  /** עולה חדש - חודשים מעלייה (0 = לא עולה) */
  monthsSinceImmigration: number;
  /** חייל משוחרר - שנים מהשחרור (0 = לא רלוונטי) */
  yearsSinceRelease: number;
  /** האם מסיים תואר ראשון בשנת המס */
  bachelorDegreeThisYear: boolean;
  /** האם מסיים תואר שני בשנת המס */
  masterDegreeThisYear: boolean;

  // ----- שלב 4: ניכויים והפקדות -----
  /** הפקדות עצמאיות לקופ"ג / פנסיה (לא דרך המעסיק) */
  privatePensionDeposits: number;
  /** הפקדות עצמאיות לקרן השתלמות */
  privateStudyFundDeposits: number;
  /** ביטוח חיים (פרמיה שנתית) */
  lifeInsurancePremium: number;
  /** ביטוח אובדן כושר עבודה */
  disabilityInsurancePremium: number;

  // ----- שלב 5: זיכויים מיוחדים -----
  /** סכום תרומות שנתי לעמותות מאושרות (סעיף 46) */
  donations: number;
  /** מגורים באזור פריפריה */
  peripheryZone: PeripheryZone;
  /** הוצאות לימודים מקצועיים מוכרות */
  educationExpenses: number;

  // ----- שלב 6: דגלים נוספים -----
  /** עבדת אצל יותר ממעסיק אחד ללא תיאום */
  multipleEmployersNoCoordination: boolean;
  /** תיאום מס בוצע במהלך השנה? */
  taxCoordinationPerformed: boolean;
}

export interface TaxRefundResult {
  // חישובי מס
  /** הכנסה חייבת לפני זיכויים */
  taxableIncome: number;
  /** מס לפי מדרגות (לפני זיכויים) */
  grossTax: number;
  /** סה"כ נקודות זיכוי (כולל מצבים מיוחדים) */
  totalCreditPoints: number;
  /** ערך נקודות זיכוי בש"ח */
  creditPointsValue: number;
  /** ניכויים מותרים (פנסיה, ק.ה., ביטוחים) */
  totalDeductions: number;
  /** זיכוי תרומות (35% מהתרומות) */
  donationsCredit: number;
  /** זיכוי פריפריה */
  peripheryCredit: number;
  /** מס סופי לתשלום */
  finalTax: number;

  // החזר
  /** סכום החזר משוער */
  estimatedRefund: number;
  /** האם זכאי להחזר */
  isEntitledToRefund: boolean;

  // פירוט
  /** רשימת סיבות לזכאות + סכום משוער לכל סיבה */
  refundReasons: RefundReason[];
  /** הודעות למשתמש */
  notes: string[];
}

export interface RefundReason {
  category: string;
  description: string;
  estimatedAmount: number;
}

// ============================================================
// קבועים נוספים 2026
// ============================================================

const PENSION_DEDUCTION_CAP_2026 = 13_700; // תקרת ניכוי הפקדות פנסיה עצמאיות (משוער 2026)
const STUDY_FUND_DEDUCTION_CAP_2026 = 18_840; // תקרת קרן השתלמות פטורה ממס
const LIFE_INSURANCE_CREDIT_RATE = 0.25; // זיכוי 25% על ביטוח חיים
const LIFE_INSURANCE_CAP = 12_000; // תקרת ביטוח חיים שנתית
const DONATIONS_MIN = 207; // מינימום תרומות לזכאות
const DONATIONS_MAX_PCT = 0.30; // עד 30% מההכנסה
const DONATIONS_CREDIT_RATE = 0.35; // 35% זיכוי
const PERIPHERY_RATES: Record<PeripheryZone, number> = {
  none: 0,
  eilat: 0.10, // 10% עד תקרת 268,560
  'tier-a': 0.07, // קרית שמונה, צפת
  'tier-b': 0.11, // קו עימות חלקי
  'tier-c': 0.13, // קו עימות מלא
};
const EILAT_INCOME_CAP = 268_560;

// ============================================================
// פונקציות עזר
// ============================================================

/** חישוב מס לפי מדרגות */
function calculateTaxFromBrackets(annualIncome: number): number {
  let remaining = annualIncome;
  let tax = 0;
  let prev = 0;
  for (const bracket of TAX_BRACKETS_2026) {
    if (remaining <= 0) break;
    const bracketSize = bracket.upTo - prev;
    const taxable = Math.min(remaining, bracketSize);
    tax += taxable * bracket.rate;
    remaining -= taxable;
    prev = bracket.upTo;
  }
  return tax;
}

/** חישוב נקודות זיכוי כולל */
function calculateCreditPoints(input: TaxRefundInput): number {
  let points = 0;

  // בסיס - תושב
  points += CREDIT_POINTS_BY_STATUS.resident; // 2.25

  // אישה
  if (input.gender === 'female') {
    points += CREDIT_POINTS_BY_STATUS.woman; // +0.5
  }

  // ילדים
  points +=
    input.childrenAge0 * CREDIT_POINTS_BY_STATUS.childAge0 +
    input.childrenAge1to5 * CREDIT_POINTS_BY_STATUS.childAge1to5 +
    input.childrenAge6to17 * CREDIT_POINTS_BY_STATUS.childAge6to17 +
    input.childrenAge18 * CREDIT_POINTS_BY_STATUS.childAge18;

  // ילד נכה
  points += input.disabledChildren * CREDIT_POINTS_BY_STATUS.disabledChild;

  // הורה יחיד
  if (input.maritalStatus === 'single-parent') {
    points += CREDIT_POINTS_BY_STATUS.singleParent;
  }

  // עולה חדש - מוקלט לפי תקופות
  if (input.monthsSinceImmigration > 0) {
    if (input.monthsSinceImmigration <= 18) {
      points += CREDIT_POINTS_BY_STATUS.newImmigrant.year1to1_5; // 3
    } else if (input.monthsSinceImmigration <= 30) {
      points += CREDIT_POINTS_BY_STATUS.newImmigrant.year1_5to3; // 2
    } else if (input.monthsSinceImmigration <= 54) {
      points += CREDIT_POINTS_BY_STATUS.newImmigrant.year3to4_5; // 1
    }
  }

  // חייל משוחרר (3 שנים מהשחרור)
  if (input.yearsSinceRelease > 0 && input.yearsSinceRelease <= 3) {
    points += CREDIT_POINTS_BY_STATUS.releasedSoldier; // 2
  }

  // תארים
  if (input.bachelorDegreeThisYear) points += CREDIT_POINTS_BY_STATUS.bachelorDegree; // 1
  if (input.masterDegreeThisYear) points += CREDIT_POINTS_BY_STATUS.masterDegree; // 0.5

  // בן/בת זוג ללא הכנסה (נקודה אחת)
  if (input.spouseNoIncome && input.maritalStatus === 'married') {
    points += 1;
  }

  return points;
}

/** חישוב ניכויים (מורידים מההכנסה) */
function calculateDeductions(input: TaxRefundInput): number {
  let deductions = 0;

  // הפקדות פנסיה עצמאיות - ניכוי עד תקרה
  deductions += Math.min(input.privatePensionDeposits, PENSION_DEDUCTION_CAP_2026);

  // קרן השתלמות עצמאית - ניכוי עד תקרה
  deductions += Math.min(input.privateStudyFundDeposits, STUDY_FUND_DEDUCTION_CAP_2026);

  // הוצאות לימוד מוכרות
  deductions += input.educationExpenses;

  // ביטוח אובדן כושר עבודה - ניכוי עד 5% מההכנסה
  const disabilityCap = input.annualGrossSalary * 0.05;
  deductions += Math.min(input.disabilityInsurancePremium, disabilityCap);

  return deductions;
}

/** חישוב זיכוי תרומות */
function calculateDonationsCredit(donations: number, annualIncome: number): number {
  if (donations < DONATIONS_MIN) return 0;
  const cap = annualIncome * DONATIONS_MAX_PCT;
  const eligibleDonations = Math.min(donations, cap);
  return eligibleDonations * DONATIONS_CREDIT_RATE;
}

/** חישוב זיכוי ביטוח חיים */
function calculateLifeInsuranceCredit(premium: number): number {
  return Math.min(premium, LIFE_INSURANCE_CAP) * LIFE_INSURANCE_CREDIT_RATE;
}

/** חישוב זיכוי פריפריה */
function calculatePeripheryCredit(zone: PeripheryZone, income: number): number {
  if (zone === 'none') return 0;
  if (zone === 'eilat') {
    return Math.min(income, EILAT_INCOME_CAP) * PERIPHERY_RATES.eilat;
  }
  return income * PERIPHERY_RATES[zone];
}

// ============================================================
// פונקציה ראשית
// ============================================================

export function calculateTaxRefund(input: TaxRefundInput): TaxRefundResult {
  const reasons: RefundReason[] = [];
  const notes: string[] = [];

  const annualIncome = Math.max(0, input.annualGrossSalary);
  const taxWithheld = Math.max(0, input.taxWithheld);

  // 1. חישוב ניכויים
  const totalDeductions = calculateDeductions(input);
  const taxableIncome = Math.max(0, annualIncome - totalDeductions);

  // 2. חישוב מס לפני זיכויים
  const grossTax = calculateTaxFromBrackets(taxableIncome);

  // 3. נקודות זיכוי
  const totalCreditPoints = calculateCreditPoints(input);
  const creditPointsValue = totalCreditPoints * CREDIT_POINT_2026.annual;

  // 4. זיכויים נוספים
  const donationsCredit = calculateDonationsCredit(input.donations, annualIncome);
  const lifeInsuranceCredit = calculateLifeInsuranceCredit(input.lifeInsurancePremium);
  const peripheryCredit = calculatePeripheryCredit(input.peripheryZone, annualIncome);

  // 5. מס סופי
  const totalCredits = creditPointsValue + donationsCredit + lifeInsuranceCredit + peripheryCredit;
  const finalTax = Math.max(0, grossTax - totalCredits);

  // 6. החזר משוער
  const estimatedRefund = Math.max(0, taxWithheld - finalTax);
  const isEntitledToRefund = estimatedRefund > 0;

  // ----- בניית רשימת סיבות -----

  // עבודה חלקית
  if (input.monthsWorked < 12) {
    const partialYearImpact = (taxWithheld * (12 - input.monthsWorked)) / 12 * 0.3;
    reasons.push({
      category: 'עבודה חלקית בשנה',
      description: `עבדת ${input.monthsWorked}/12 חודשים. המעסיק חישב מס לפי הנחת שכר מלא לכל השנה.`,
      estimatedAmount: partialYearImpact,
    });
  }

  // מספר מעסיקים
  if (input.multipleEmployersNoCoordination && !input.taxCoordinationPerformed) {
    reasons.push({
      category: 'מספר מעסיקים ללא תיאום מס',
      description:
        'במעסיק שני נוכה לפי מדרגת מס מקסימלית. תיאום שנתי בד"כ מחזיר חלק משמעותי.',
      estimatedAmount: estimatedRefund * 0.4, // הערכה גסה
    });
  }

  // הפקדות עצמאיות
  if (input.privatePensionDeposits > 0 || input.privateStudyFundDeposits > 0) {
    const depositRefund =
      (Math.min(input.privatePensionDeposits, PENSION_DEDUCTION_CAP_2026) +
        Math.min(input.privateStudyFundDeposits, STUDY_FUND_DEDUCTION_CAP_2026)) *
      0.35; // מקדם מס שולי משוער
    reasons.push({
      category: 'הפקדות עצמאיות לפנסיה / קרן השתלמות',
      description: 'הפקדות שלא דרך המעסיק לא נוכו במקור - מגיע החזר על מס שעל הסכום',
      estimatedAmount: depositRefund,
    });
  }

  // תרומות
  if (donationsCredit > 0) {
    reasons.push({
      category: 'תרומות לעמותות מוכרות',
      description: `זיכוי 35% מתרומות מעל ${DONATIONS_MIN} ₪/שנה (סעיף 46)`,
      estimatedAmount: donationsCredit,
    });
  } else if (input.donations > 0 && input.donations < DONATIONS_MIN) {
    notes.push(
      `תרומות פחות מ-${DONATIONS_MIN} ₪ אינן מזכות בזיכוי. שמור קבלות לתרומות שנים הבאות.`,
    );
  }

  // ביטוח חיים
  if (lifeInsuranceCredit > 0) {
    reasons.push({
      category: 'ביטוח חיים',
      description: 'זיכוי 25% מפרמיית ביטוח חיים (עד תקרה)',
      estimatedAmount: lifeInsuranceCredit,
    });
  }

  // פריפריה
  if (peripheryCredit > 0) {
    reasons.push({
      category: 'תושב פריפריה',
      description: 'זיכוי לפי אזור מגורים - אילת/קו עימות/יישובים מוטבים',
      estimatedAmount: peripheryCredit,
    });
  }

  // ילדים שנולדו השנה (לידה לאחר 101)
  if (input.childrenAge0 > 0) {
    const newbornCredit = input.childrenAge0 * CREDIT_POINTS_BY_STATUS.childAge0 * CREDIT_POINT_2026.annual;
    reasons.push({
      category: 'לידת ילד בשנת המס',
      description: `${input.childrenAge0} ילדים בשנת לידתם - 1.5 נקודות זיכוי לכל אחד = ${(1.5 * CREDIT_POINT_2026.annual).toFixed(0)} ₪`,
      estimatedAmount: newbornCredit,
    });
  }

  // עולה חדש
  if (input.monthsSinceImmigration > 0 && input.monthsSinceImmigration <= 54) {
    reasons.push({
      category: 'עולה חדש',
      description: `נקודות זיכוי לעולה חדש - בשלב הנוכחי (${input.monthsSinceImmigration} חודשים מעלייה)`,
      estimatedAmount: 0, // כלול בחישוב הכללי
    });
  }

  // חייל משוחרר
  if (input.yearsSinceRelease > 0 && input.yearsSinceRelease <= 3) {
    const soldierCredit = CREDIT_POINTS_BY_STATUS.releasedSoldier * CREDIT_POINT_2026.annual;
    reasons.push({
      category: 'חייל משוחרר',
      description: `2 נקודות זיכוי בשלוש שנים מהשחרור = ${soldierCredit.toFixed(0)} ₪/שנה`,
      estimatedAmount: 0,
    });
  }

  // תואר
  if (input.bachelorDegreeThisYear || input.masterDegreeThisYear) {
    reasons.push({
      category: 'סיום לימודים אקדמיים',
      description: 'נקודת זיכוי לסיום תואר (תואר ראשון - שנה אחרי, תואר שני - חצי שנה)',
      estimatedAmount: 0,
    });
  }

  // הודעות נוספות
  if (input.taxCoordinationPerformed && estimatedRefund > 0) {
    notes.push('בוצע תיאום מס במהלך השנה. ייתכן שעדיין יש החזר אם היו שינויים בנסיבות.');
  }

  if (input.spouseNoIncome && input.maritalStatus !== 'married') {
    notes.push('סימנת בן/בת זוג ללא הכנסה אך לא נשוי/אה - לא ייקח בחשבון.');
  }

  if (annualIncome === 0) {
    notes.push('לא הוזן שכר. החזר יחושב לפי שכר ברוטו.');
  }

  if (estimatedRefund === 0 && taxWithheld > 0) {
    notes.push(
      'בחישוב הראשוני אין החזר. ייתכן שעדיין כדאי להגיש דוח אם היו אירועים חריגים בשנה.',
    );
  }

  if (estimatedRefund > 5000) {
    notes.push('החזר משמעותי - מומלץ להגיש דוח להחזר מס. ניתן לעשות זאת באתר רשות המסים.');
  }

  return {
    taxableIncome,
    grossTax,
    totalCreditPoints,
    creditPointsValue,
    totalDeductions,
    donationsCredit,
    peripheryCredit: peripheryCredit + lifeInsuranceCredit, // לפי הצגה
    finalTax,
    estimatedRefund,
    isEntitledToRefund,
    refundReasons: reasons,
    notes,
  };
}
