/**
 * מחשבון החזר מס לשכירים - ישראל 2026 (גרסה מורחבת)
 *
 * מבוסס על מחקר מקיף של:
 * - רשות המסים (gov.il/service/simulator-employee)
 * - כל-זכות (החזר מס + פריפריה + מילואים + סעיף 9.5)
 * - finupp/meitavdash, PwC Tax Summary
 * - פקודת מס הכנסה 2026 + תקנות מ.ה. (זיכויים)
 *
 * תכולה:
 * - 7 סקציות קלט (הכנסות, אישי, מיוחדים, מילואים+שירות, הפקדות, רפואי, תרומות+פריפריה)
 * - חישוב מס מלא לפי 7 מדרגות 2026
 * - כל סוגי נקודות זיכוי
 * - ניכויים, זיכויים, פטורים מיוחדים
 * - סעיף 9.5 (פטור נכי 100%/עיוורים) עד תקרה 608K
 * - סעיף 66 (דמי טיפול בילד לאישה עובדת)
 * - הוצאות רפואיות חריגות (מעל 12.5% מההכנסה)
 * - מילואים פעיל + ילדים בשירות
 * - 6 שנות מס (2020-2025) - תמיכה בסיסית
 *
 * אומת: 2026-05-04
 */

import {
  TAX_BRACKETS_2026,
  CREDIT_POINT_2026,
  CREDIT_POINTS_BY_STATUS,
} from '@/lib/constants/tax-2026';

// ============================================================
// סוגים
// ============================================================

export type Gender = 'male' | 'female';
export type MaritalStatus = 'single' | 'married' | 'single-parent';
export type PeripheryZone =
  | 'none'
  | 'eilat' // 10% עד תקרה 268,560
  | 'tier-a' // 7% (קרית שמונה, צפת, מעלות, וכו')
  | 'tier-b' // 11% (יישובים בקו עימות חלקי)
  | 'tier-c'; // 13% (יישובי קו עימות מלא)

/** שנת מס - לתמיכה ברטרואקטיבי */
export type TaxYear = 2020 | 2021 | 2022 | 2023 | 2024 | 2025 | 2026;

export interface TaxRefundInput {
  // ----- שלב 1: הכנסות שנתיות -----
  annualGrossSalary: number;
  taxWithheld: number;
  socialSecurityWithheld: number;
  monthsWorked: number;
  /** שנת המס שלגביה מבקשים החזר */
  taxYear: TaxYear;

  // ----- שלב 2: סטטוס אישי -----
  gender: Gender;
  maritalStatus: MaritalStatus;
  spouseNoIncome: boolean;
  /** בן/בת זוג נכה (סעיף 45 - 2 נקודות) */
  spouseDisabled: boolean;
  childrenAge0: number;
  childrenAge1to5: number;
  childrenAge6to17: number;
  childrenAge18: number;
  disabledChildren: number;
  /** ילדים בני 18-21 בשירות צבאי / לאומי - נקודה לכל ילד */
  childrenInService: number;

  // ----- שלב 3: מצבים מיוחדים -----
  monthsSinceImmigration: number;
  yearsSinceRelease: number;
  bachelorDegreeThisYear: boolean;
  masterDegreeThisYear: boolean;
  /** האם משרת במילואים פעיל (מעל 10 ימים בשנה) - 1 נקודה */
  activeReservist: boolean;
  /** ימי מילואים בשנה (לתיעוד / נקודה מורחבת) */
  reserveDuyDays: number;
  /** סעיף 9.5 - נכה 100% / עיוור / חולה במחלה קשה - פטור עד תקרה */
  hasSection95Exemption: boolean;

  // ----- שלב 4: הפקדות וביטוחים -----
  privatePensionDeposits: number;
  privateStudyFundDeposits: number;
  lifeInsurancePremium: number;
  disabilityInsurancePremium: number;
  educationExpenses: number;

  // ----- שלב 5: דמי טיפול בילד וגירושים -----
  /** דמי טיפול בילד / מעון לאישה עובדת (סעיף 66) */
  childcareExpenses: number;
  /** מזונות שמשולמים לבן/בת זוג גרוש - הוצאה מוכרת */
  alimonyPaid: number;

  // ----- שלב 6: הוצאות רפואיות -----
  /** סך הוצאות רפואיות שנתיות (מעל 12.5% מההכנסה - ניכוי) */
  medicalExpenses: number;
  /** שכר טרחה לרו"ח / יועץ מס - הוצאה מוכרת */
  accountantFees: number;

  // ----- שלב 7: תרומות ופריפריה -----
  /** תרומות לעמותות סעיף 46 - 35% זיכוי */
  donations: number;
  /** תרומות פוליטיות (סעיף 46א) - תקרה נפרדת */
  politicalDonations: number;
  peripheryZone: PeripheryZone;

  // ----- שלב 8: דגלים נוספים -----
  multipleEmployersNoCoordination: boolean;
  taxCoordinationPerformed: boolean;

  // ----- שלב 9: הכנסות נוספות -----
  /** הכנסה מהון - דיב' / ריבית / רווחי הון (מס נפרד 25%) */
  capitalIncome: number;
  /** האם נוכה מס על הכנסת הון */
  capitalTaxWithheld: number;
}

export interface TaxRefundResult {
  taxableIncome: number;
  grossTax: number;
  totalCreditPoints: number;
  creditPointsValue: number;
  totalDeductions: number;
  donationsCredit: number;
  politicalDonationsCredit: number;
  lifeInsuranceCredit: number;
  peripheryCredit: number;
  section95Exemption: number;
  finalTax: number;
  capitalGainsTax: number;
  capitalGainsRefund: number;
  estimatedRefund: number;
  isEntitledToRefund: boolean;
  refundReasons: RefundReason[];
  notes: string[];
}

export interface RefundReason {
  category: string;
  description: string;
  estimatedAmount: number;
}

// ============================================================
// קבועים 2026
// ============================================================

const PENSION_DEDUCTION_CAP = 13_700;
const STUDY_FUND_DEDUCTION_CAP = 18_840;
const LIFE_INSURANCE_CREDIT_RATE = 0.25;
const LIFE_INSURANCE_CAP = 12_000;
const DONATIONS_MIN = 207;
const DONATIONS_MAX_PCT = 0.30;
const DONATIONS_CREDIT_RATE = 0.35;
const POLITICAL_DONATIONS_CAP = 12_800; // תקרת תרומות פוליטיות
const POLITICAL_DONATIONS_RATE = 0.35;
const SECTION_95_EXEMPTION_CAP_EARNED = 608_400; // פטור על הכנסה מיגיעה אישית
const MEDICAL_EXPENSES_THRESHOLD_PCT = 0.125; // 12.5% מההכנסה
const CAPITAL_GAINS_TAX_RATE = 0.25; // 25% על דיב'/רווחי הון/ריבית
const PERIPHERY_RATES: Record<PeripheryZone, number> = {
  none: 0,
  eilat: 0.10,
  'tier-a': 0.07,
  'tier-b': 0.11,
  'tier-c': 0.13,
};
const EILAT_INCOME_CAP = 268_560;

/** סעיף 66 - תקרת ניכוי דמי טיפול בילד (לאישה עובדת) */
const CHILDCARE_DEDUCTION_PER_CHILD = 8_400; // משוער 2026

// ============================================================
// פונקציות עזר - חישוב מס
// ============================================================

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

// ============================================================
// פונקציות עזר - נקודות זיכוי
// ============================================================

function calculateCreditPoints(input: TaxRefundInput): {
  points: number;
  breakdown: { label: string; points: number }[];
} {
  const breakdown: { label: string; points: number }[] = [];
  let points = 0;

  // בסיס - תושב
  points += CREDIT_POINTS_BY_STATUS.resident;
  breakdown.push({ label: 'תושב ישראל', points: CREDIT_POINTS_BY_STATUS.resident });

  // אישה
  if (input.gender === 'female') {
    points += CREDIT_POINTS_BY_STATUS.woman;
    breakdown.push({ label: 'אישה', points: CREDIT_POINTS_BY_STATUS.woman });
  }

  // ילדים
  const kids =
    input.childrenAge0 * CREDIT_POINTS_BY_STATUS.childAge0 +
    input.childrenAge1to5 * CREDIT_POINTS_BY_STATUS.childAge1to5 +
    input.childrenAge6to17 * CREDIT_POINTS_BY_STATUS.childAge6to17 +
    input.childrenAge18 * CREDIT_POINTS_BY_STATUS.childAge18 +
    input.disabledChildren * CREDIT_POINTS_BY_STATUS.disabledChild;
  if (kids > 0) {
    points += kids;
    breakdown.push({ label: 'ילדים (לפי גיל)', points: kids });
  }

  // ילדים בני 18-21 בשירות
  if (input.childrenInService > 0) {
    const serviceCredits = input.childrenInService * 1; // 1 נקודה לכל ילד בשירות
    points += serviceCredits;
    breakdown.push({
      label: `ילדים בשירות צבאי/לאומי (${input.childrenInService})`,
      points: serviceCredits,
    });
  }

  // הורה יחיד
  if (input.maritalStatus === 'single-parent') {
    points += CREDIT_POINTS_BY_STATUS.singleParent;
    breakdown.push({ label: 'הורה יחיד', points: CREDIT_POINTS_BY_STATUS.singleParent });
  }

  // עולה חדש
  if (input.monthsSinceImmigration > 0) {
    let immPts = 0;
    if (input.monthsSinceImmigration <= 18) immPts = CREDIT_POINTS_BY_STATUS.newImmigrant.year1to1_5;
    else if (input.monthsSinceImmigration <= 30) immPts = CREDIT_POINTS_BY_STATUS.newImmigrant.year1_5to3;
    else if (input.monthsSinceImmigration <= 54) immPts = CREDIT_POINTS_BY_STATUS.newImmigrant.year3to4_5;
    if (immPts > 0) {
      points += immPts;
      breakdown.push({ label: 'עולה חדש', points: immPts });
    }
  }

  // חייל משוחרר
  if (input.yearsSinceRelease > 0 && input.yearsSinceRelease <= 3) {
    points += CREDIT_POINTS_BY_STATUS.releasedSoldier;
    breakdown.push({
      label: 'חייל משוחרר',
      points: CREDIT_POINTS_BY_STATUS.releasedSoldier,
    });
  }

  // מילואים פעיל - נקודה אחת
  if (input.activeReservist || input.reserveDuyDays >= 10) {
    points += 1;
    breakdown.push({ label: 'משרת במילואים פעיל', points: 1 });
  }

  // תארים
  if (input.bachelorDegreeThisYear) {
    points += CREDIT_POINTS_BY_STATUS.bachelorDegree;
    breakdown.push({ label: 'תואר ראשון', points: CREDIT_POINTS_BY_STATUS.bachelorDegree });
  }
  if (input.masterDegreeThisYear) {
    points += CREDIT_POINTS_BY_STATUS.masterDegree;
    breakdown.push({ label: 'תואר שני', points: CREDIT_POINTS_BY_STATUS.masterDegree });
  }

  // בן/בת זוג ללא הכנסה
  if (input.spouseNoIncome && input.maritalStatus === 'married') {
    points += 1;
    breakdown.push({ label: 'בן/בת זוג ללא הכנסה', points: 1 });
  }

  // בן/בת זוג נכה (סעיף 45 - 2 נקודות)
  if (input.spouseDisabled && input.maritalStatus === 'married') {
    points += 2;
    breakdown.push({ label: 'בן/בת זוג נכה', points: 2 });
  }

  return { points, breakdown };
}

// ============================================================
// ניכויים מההכנסה
// ============================================================

function calculateDeductions(input: TaxRefundInput): {
  total: number;
  breakdown: { label: string; amount: number }[];
} {
  const breakdown: { label: string; amount: number }[] = [];
  let total = 0;

  // הפקדות פנסיה עצמאיות
  const pension = Math.min(input.privatePensionDeposits, PENSION_DEDUCTION_CAP);
  if (pension > 0) {
    total += pension;
    breakdown.push({ label: 'פנסיה עצמאית', amount: pension });
  }

  // קרן השתלמות
  const studyFund = Math.min(input.privateStudyFundDeposits, STUDY_FUND_DEDUCTION_CAP);
  if (studyFund > 0) {
    total += studyFund;
    breakdown.push({ label: 'קרן השתלמות', amount: studyFund });
  }

  // הוצאות לימוד מוכרות
  if (input.educationExpenses > 0) {
    total += input.educationExpenses;
    breakdown.push({ label: 'לימודים מקצועיים', amount: input.educationExpenses });
  }

  // ביטוח אובדן כושר עבודה
  const disabilityCap = input.annualGrossSalary * 0.05;
  const disability = Math.min(input.disabilityInsurancePremium, disabilityCap);
  if (disability > 0) {
    total += disability;
    breakdown.push({ label: 'ביטוח אובדן כושר עבודה', amount: disability });
  }

  // דמי טיפול בילד (סעיף 66) - לאישה עובדת
  if (
    input.gender === 'female' &&
    input.childcareExpenses > 0 &&
    (input.childrenAge0 + input.childrenAge1to5) > 0
  ) {
    const eligibleKids = input.childrenAge0 + input.childrenAge1to5;
    const cap = eligibleKids * CHILDCARE_DEDUCTION_PER_CHILD;
    const childcare = Math.min(input.childcareExpenses, cap);
    if (childcare > 0) {
      total += childcare;
      breakdown.push({ label: 'דמי טיפול בילד (סעיף 66)', amount: childcare });
    }
  }

  // מזונות
  if (input.alimonyPaid > 0) {
    total += input.alimonyPaid;
    breakdown.push({ label: 'מזונות', amount: input.alimonyPaid });
  }

  // הוצאות רפואיות חריגות (מעל 12.5% מההכנסה)
  const medicalThreshold = input.annualGrossSalary * MEDICAL_EXPENSES_THRESHOLD_PCT;
  const medicalDeductible = Math.max(0, input.medicalExpenses - medicalThreshold);
  if (medicalDeductible > 0) {
    total += medicalDeductible;
    breakdown.push({
      label: `הוצאות רפואיות חריגות (מעל ${formatPctText(MEDICAL_EXPENSES_THRESHOLD_PCT)})`,
      amount: medicalDeductible,
    });
  }

  // שכר טרחה לרו"ח / יועץ מס
  if (input.accountantFees > 0) {
    total += input.accountantFees;
    breakdown.push({ label: 'שכר טרחה רו"ח / יועץ מס', amount: input.accountantFees });
  }

  return { total, breakdown };
}

function formatPctText(pct: number): string {
  return `${(pct * 100).toFixed(1)}%`;
}

// ============================================================
// זיכויים
// ============================================================

function calculateDonationsCredit(donations: number, annualIncome: number): number {
  if (donations < DONATIONS_MIN) return 0;
  const cap = annualIncome * DONATIONS_MAX_PCT;
  const eligible = Math.min(donations, cap);
  return eligible * DONATIONS_CREDIT_RATE;
}

function calculatePoliticalDonationsCredit(donations: number): number {
  if (donations <= 0) return 0;
  const eligible = Math.min(donations, POLITICAL_DONATIONS_CAP);
  return eligible * POLITICAL_DONATIONS_RATE;
}

function calculateLifeInsuranceCredit(premium: number): number {
  return Math.min(premium, LIFE_INSURANCE_CAP) * LIFE_INSURANCE_CREDIT_RATE;
}

function calculatePeripheryCredit(zone: PeripheryZone, income: number): number {
  if (zone === 'none') return 0;
  if (zone === 'eilat') return Math.min(income, EILAT_INCOME_CAP) * PERIPHERY_RATES.eilat;
  return income * PERIPHERY_RATES[zone];
}

// ============================================================
// סעיף 9.5 - פטור לנכה 100% / עיוור / חולה
// ============================================================

function applySection95(grossIncome: number, hasExemption: boolean): {
  exemptIncome: number;
  taxableIncome: number;
} {
  if (!hasExemption) return { exemptIncome: 0, taxableIncome: grossIncome };
  const exempt = Math.min(grossIncome, SECTION_95_EXEMPTION_CAP_EARNED);
  return {
    exemptIncome: exempt,
    taxableIncome: Math.max(0, grossIncome - exempt),
  };
}

// ============================================================
// פונקציה ראשית
// ============================================================

export function calculateTaxRefund(input: TaxRefundInput): TaxRefundResult {
  const reasons: RefundReason[] = [];
  const notes: string[] = [];

  const annualIncome = Math.max(0, input.annualGrossSalary);
  const taxWithheld = Math.max(0, input.taxWithheld);

  // 0. סעיף 9.5 - פטור (משפיע על הכנסה חייבת)
  const { exemptIncome, taxableIncome: incomeAfterExemption } = applySection95(
    annualIncome,
    input.hasSection95Exemption,
  );

  // 1. ניכויים
  const { total: totalDeductions, breakdown: deductionsBreakdown } = calculateDeductions(input);
  const taxableIncome = Math.max(0, incomeAfterExemption - totalDeductions);

  // 2. מס לפי מדרגות
  const grossTax = calculateTaxFromBrackets(taxableIncome);

  // 3. נקודות זיכוי
  const { points: totalCreditPoints, breakdown: pointsBreakdown } = calculateCreditPoints(input);
  const creditPointsValue = totalCreditPoints * CREDIT_POINT_2026.annual;

  // 4. זיכויים
  const donationsCredit = calculateDonationsCredit(input.donations, annualIncome);
  const politicalDonationsCredit = calculatePoliticalDonationsCredit(input.politicalDonations);
  const lifeInsuranceCredit = calculateLifeInsuranceCredit(input.lifeInsurancePremium);
  const peripheryCredit = calculatePeripheryCredit(input.peripheryZone, annualIncome);

  const totalCredits =
    creditPointsValue +
    donationsCredit +
    politicalDonationsCredit +
    lifeInsuranceCredit +
    peripheryCredit;

  // 5. מס סופי
  const finalTax = Math.max(0, grossTax - totalCredits);

  // 6. החזר עיקרי
  const mainRefund = Math.max(0, taxWithheld - finalTax);

  // 7. הכנסות הון - חישוב נפרד 25%
  const capitalGainsTax = input.capitalIncome * CAPITAL_GAINS_TAX_RATE;
  const capitalGainsRefund = Math.max(0, input.capitalTaxWithheld - capitalGainsTax);

  // 8. סה"כ החזר
  const estimatedRefund = mainRefund + capitalGainsRefund;
  const isEntitledToRefund = estimatedRefund > 0;

  // ----- בניית רשימת סיבות -----

  if (input.monthsWorked < 12) {
    const partialEstimate = (taxWithheld * (12 - input.monthsWorked)) / 12 * 0.3;
    reasons.push({
      category: 'עבודה חלקית בשנה',
      description: `עבדת ${input.monthsWorked}/12 חודשים. ניכוי בוצע על הנחת שכר מלא.`,
      estimatedAmount: partialEstimate,
    });
  }

  if (input.multipleEmployersNoCoordination && !input.taxCoordinationPerformed) {
    reasons.push({
      category: 'מספר מעסיקים ללא תיאום מס',
      description: 'במעסיק שני נוכה לפי מדרגה גבוהה - תיאום שנתי מחזיר עודף.',
      estimatedAmount: mainRefund * 0.4,
    });
  }

  if (input.privatePensionDeposits > 0 || input.privateStudyFundDeposits > 0) {
    const depositRefund =
      (Math.min(input.privatePensionDeposits, PENSION_DEDUCTION_CAP) +
        Math.min(input.privateStudyFundDeposits, STUDY_FUND_DEDUCTION_CAP)) *
      0.35;
    reasons.push({
      category: 'הפקדות עצמאיות לפנסיה / קרן השתלמות',
      description: 'הפקדות שלא דרך המעסיק - מגיע החזר על המס שעל הסכום',
      estimatedAmount: depositRefund,
    });
  }

  if (donationsCredit > 0) {
    reasons.push({
      category: 'תרומות לעמותות (סעיף 46)',
      description: `זיכוי 35% מתרומות מעל ${DONATIONS_MIN} ₪`,
      estimatedAmount: donationsCredit,
    });
  }

  if (politicalDonationsCredit > 0) {
    reasons.push({
      category: 'תרומות פוליטיות (סעיף 46א)',
      description: `זיכוי 35% עד תקרה של ${POLITICAL_DONATIONS_CAP.toLocaleString()} ₪`,
      estimatedAmount: politicalDonationsCredit,
    });
  }

  if (lifeInsuranceCredit > 0) {
    reasons.push({
      category: 'ביטוח חיים',
      description: 'זיכוי 25% מפרמיה (תקרה 12,000 ₪)',
      estimatedAmount: lifeInsuranceCredit,
    });
  }

  if (peripheryCredit > 0) {
    reasons.push({
      category: 'תושב פריפריה',
      description: 'זיכוי על השכר לפי אזור מגורים',
      estimatedAmount: peripheryCredit,
    });
  }

  if (input.hasSection95Exemption) {
    const exemptionTax = exemptIncome * 0.30; // הערכה גסה של מס שהיה משולם
    reasons.push({
      category: 'סעיף 9(5) - נכה 100% / עיוור / חולה',
      description: `פטור על הכנסה עד ${SECTION_95_EXEMPTION_CAP_EARNED.toLocaleString()} ₪/שנה`,
      estimatedAmount: exemptionTax,
    });
  }

  if (input.activeReservist || input.reserveDuyDays >= 10) {
    reasons.push({
      category: 'משרת במילואים פעיל',
      description: `נקודת זיכוי נוספת = ${CREDIT_POINT_2026.annual.toLocaleString()} ₪/שנה`,
      estimatedAmount: CREDIT_POINT_2026.annual,
    });
  }

  if (input.childrenInService > 0) {
    const childServiceCredit = input.childrenInService * CREDIT_POINT_2026.annual;
    reasons.push({
      category: `${input.childrenInService} ילדים בשירות צבאי/לאומי`,
      description: 'נקודת זיכוי לכל ילד בשירות בני 18-21',
      estimatedAmount: childServiceCredit,
    });
  }

  if (
    input.gender === 'female' &&
    input.childcareExpenses > 0 &&
    (input.childrenAge0 + input.childrenAge1to5) > 0
  ) {
    reasons.push({
      category: 'דמי טיפול בילד (סעיף 66)',
      description: 'אישה עובדת זכאית לניכוי דמי מעון/טיפול עד תקרה',
      estimatedAmount: input.childcareExpenses * 0.35,
    });
  }

  const medicalThreshold = annualIncome * MEDICAL_EXPENSES_THRESHOLD_PCT;
  if (input.medicalExpenses > medicalThreshold) {
    const excess = input.medicalExpenses - medicalThreshold;
    reasons.push({
      category: 'הוצאות רפואיות חריגות',
      description: `מעל 12.5% מההכנסה ניתן לניכוי - הסך החריג: ${excess.toLocaleString()} ₪`,
      estimatedAmount: excess * 0.30,
    });
  }

  if (input.alimonyPaid > 0) {
    reasons.push({
      category: 'תשלום מזונות',
      description: 'מזונות לבן/בת זוג גרוש מנוכים מההכנסה החייבת',
      estimatedAmount: input.alimonyPaid * 0.30,
    });
  }

  if (capitalGainsRefund > 0) {
    reasons.push({
      category: 'מס יתר על הכנסות הון',
      description: 'מס יתר ביחס ל-25% הסטטוטורי על דיב\'/ריבית/רווחי הון',
      estimatedAmount: capitalGainsRefund,
    });
  }

  if (input.spouseDisabled && input.maritalStatus === 'married') {
    reasons.push({
      category: 'בן/בת זוג נכה',
      description: '2 נקודות זיכוי נוספות',
      estimatedAmount: 2 * CREDIT_POINT_2026.annual,
    });
  }

  if (input.childrenAge0 > 0) {
    reasons.push({
      category: 'לידת ילד בשנת המס',
      description: `${input.childrenAge0} ילדים בשנת לידתם - 1.5 נקודות לכל אחד`,
      estimatedAmount: input.childrenAge0 * 1.5 * CREDIT_POINT_2026.annual,
    });
  }

  if (input.monthsSinceImmigration > 0 && input.monthsSinceImmigration <= 54) {
    reasons.push({
      category: 'עולה חדש',
      description: `נקודות זיכוי לפי תקופת העלייה (${input.monthsSinceImmigration} חודשים)`,
      estimatedAmount: 0,
    });
  }

  if (input.yearsSinceRelease > 0 && input.yearsSinceRelease <= 3) {
    reasons.push({
      category: 'חייל משוחרר',
      description: `2 נקודות זיכוי בשלוש שנים מהשחרור`,
      estimatedAmount: 2 * CREDIT_POINT_2026.annual,
    });
  }

  if (input.bachelorDegreeThisYear || input.masterDegreeThisYear) {
    reasons.push({
      category: 'סיום לימודים אקדמיים',
      description: 'נקודה לתואר ראשון / 0.5 נקודה לתואר שני',
      estimatedAmount: 0,
    });
  }

  // ----- הודעות -----

  if (input.taxCoordinationPerformed && mainRefund > 0) {
    notes.push('בוצע תיאום מס. ייתכן שעדיין יש החזר אם היו שינויים בנסיבות.');
  }

  if (input.spouseNoIncome && input.maritalStatus !== 'married') {
    notes.push('סימנת בן/בת זוג ללא הכנסה אך לא נשוי/אה - לא מזכה.');
  }

  if (input.spouseDisabled && input.maritalStatus !== 'married') {
    notes.push('סימנת בן/בת זוג נכה אך לא נשוי/אה - לא מזכה.');
  }

  if (input.gender !== 'female' && input.childcareExpenses > 0) {
    notes.push(
      'סעיף 66 (דמי טיפול בילד) חל רק על אישה עובדת לפי החוק. בקש ייעוץ מס במקרים מיוחדים.',
    );
  }

  if (input.medicalExpenses > 0 && input.medicalExpenses <= medicalThreshold) {
    notes.push(
      `הוצאות רפואיות (${input.medicalExpenses.toLocaleString()} ₪) מתחת לסף 12.5% מההכנסה - לא ניתן לניכוי.`,
    );
  }

  if (input.donations > 0 && input.donations < DONATIONS_MIN) {
    notes.push(`תרומות פחות מ-${DONATIONS_MIN} ₪ אינן מזכות בזיכוי.`);
  }

  if (input.taxYear < 2026) {
    notes.push(
      `שנת המס ${input.taxYear} - החישוב מבוסס על קבועי 2026. לדיוק מלא לשנים קודמות, מומלץ ייעוץ מקצועי.`,
    );
  }

  if (annualIncome === 0) {
    notes.push('לא הוזן שכר.');
  }

  if (estimatedRefund === 0 && taxWithheld > 0) {
    notes.push('בחישוב הראשוני אין החזר. בדוק אם יש סעיפים שלא הוזנו.');
  }

  if (estimatedRefund > 5000) {
    notes.push(
      'החזר משמעותי - מומלץ להגיש דוח. ניתן לעשות זאת באתר רשות המסים או דרך יועץ.',
    );
  }

  if (input.hasSection95Exemption) {
    notes.push(
      'סעיף 9(5) - חובה אישור רפואי / נכות מטעם ביטוח לאומי או רשות המסים.',
    );
  }

  return {
    taxableIncome,
    grossTax,
    totalCreditPoints,
    creditPointsValue,
    totalDeductions,
    donationsCredit,
    politicalDonationsCredit,
    lifeInsuranceCredit,
    peripheryCredit,
    section95Exemption: exemptIncome,
    finalTax,
    capitalGainsTax,
    capitalGainsRefund,
    estimatedRefund,
    isEntitledToRefund,
    refundReasons: reasons,
    notes,
  };
}

// ============================================================
// פונקציות עזר חיצוניות (לשימוש ב-UI)
// ============================================================

export function getDefaultInput(): TaxRefundInput {
  return {
    annualGrossSalary: 200_000,
    taxWithheld: 30_000,
    socialSecurityWithheld: 0,
    monthsWorked: 12,
    taxYear: 2026,
    gender: 'male',
    maritalStatus: 'single',
    spouseNoIncome: false,
    spouseDisabled: false,
    childrenAge0: 0,
    childrenAge1to5: 0,
    childrenAge6to17: 0,
    childrenAge18: 0,
    disabledChildren: 0,
    childrenInService: 0,
    monthsSinceImmigration: 0,
    yearsSinceRelease: 0,
    bachelorDegreeThisYear: false,
    masterDegreeThisYear: false,
    activeReservist: false,
    reserveDuyDays: 0,
    hasSection95Exemption: false,
    privatePensionDeposits: 0,
    privateStudyFundDeposits: 0,
    lifeInsurancePremium: 0,
    disabilityInsurancePremium: 0,
    educationExpenses: 0,
    childcareExpenses: 0,
    alimonyPaid: 0,
    medicalExpenses: 0,
    accountantFees: 0,
    donations: 0,
    politicalDonations: 0,
    peripheryZone: 'none',
    multipleEmployersNoCoordination: false,
    taxCoordinationPerformed: false,
    capitalIncome: 0,
    capitalTaxWithheld: 0,
  };
}
