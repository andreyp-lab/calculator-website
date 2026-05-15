/**
 * מחשבון שכר נטו/ברוטו מקיף - 2026
 *
 * המחשבון הכי פופולרי בישראל. כולל:
 * - חישוב ברוטו → נטו (סטנדרטי)
 * - חישוב נטו → ברוטו (Binary Search)
 * - חישוב עלות מעסיק → נטו
 * - השוואת שנים (2024 / 2025 / 2026)
 * - מס הכנסה לפי מדרגות
 * - ביטוח לאומי + בריאות (שכיר)
 * - ניכוי פנסיה (6% / 7% / 16.5%)
 * - ניכוי קרן השתלמות
 * - ביטוח אובדן כושר עבודה
 * - נקודות זיכוי (כולל wizard לחישוב)
 * - מדרגת מס שולי + מרחק לבאה
 * - חישוב בונוס נטו
 *
 * מקור: רשות המסים, ביטוח לאומי 2026
 */

import {
  TAX_BRACKETS_2026,
  CREDIT_POINT_2026,
  SOCIAL_SECURITY_EMPLOYEE_2026,
  CREDIT_POINTS_BY_STATUS,
} from '@/lib/constants/tax-2026';

// ============================================================
// מדרגות מס היסטוריות - לצורך השוואת שנים
// ============================================================

export const TAX_BRACKETS_2024 = [
  { upTo: 84_120, rate: 0.10 },
  { upTo: 120_720, rate: 0.14 },
  { upTo: 193_800, rate: 0.20 }, // צר יותר מ-2026
  { upTo: 269_280, rate: 0.31 }, // צר יותר מ-2026
  { upTo: 560_280, rate: 0.35 },
  { upTo: 721_560, rate: 0.47 },
  { upTo: Infinity, rate: 0.50 },
] as const;

export const TAX_BRACKETS_2025 = TAX_BRACKETS_2024; // אותן מדרגות כמו 2024

export type TaxBracket = { upTo: number; rate: number };
export type TaxYear = '2024' | '2025' | '2026';
export type PensionLevel = 'minimum' | 'recommended' | 'maximum';
export type CalculatorMode = 'gross-to-net' | 'net-to-gross' | 'employer-to-net';

// ============================================================
// Interfaces
// ============================================================

export interface SalaryNetGrossInput {
  /** שכר ברוטו חודשי (למצב gross-to-net) */
  grossSalary: number;
  /** נקודות זיכוי */
  creditPoints: number;
  /** האם להפריש לפנסיה */
  pensionEnabled: boolean;
  /** רמת פנסיה (ברירת מחדל: minimum) */
  pensionLevel?: PensionLevel;
  /** האם להפריש לקרן השתלמות (2.5% עובד) */
  studyFundEnabled: boolean;
  /** ביטוח אובדן כושר עבודה (%) (ברירת מחדל: 0) */
  disabilityInsuranceRate?: number;
  /** שעות עבודה חודשיות (לחישוב שכר שעתי) */
  monthlyWorkHours: number;
  /** שנת מס (ברירת מחדל: 2026) */
  taxYear?: TaxYear;
}

export interface SalaryNetGrossResult {
  grossSalary: number;
  annualGross: number;
  // ניכויים
  incomeTax: number;
  socialSecurity: number; // ב.ל. + בריאות
  pensionDeduction: number;
  studyFundDeduction: number;
  disabilityInsurance: number;
  totalDeductions: number;
  // נטו
  netSalary: number;
  netPercentage: number;
  // שיעורים
  effectiveTaxRate: number;
  marginalTaxRate: number;
  // מידע על מדרגת מס שולי
  marginalBracketInfo: MarginalBracketInfo;
  // לעובד
  hourlyRate: number;
  // עלויות מעסיק
  employerSocialSecurity: number;
  employerPension: number;
  employerStudyFund: number;
  employerCompensation: number;
  totalEmployerCost: number;
  costToNetRatio: number;
  // נקודות זיכוי
  creditAmount: number;
}

export interface MarginalBracketInfo {
  currentRate: number;       // שיעור המדרגה הנוכחית
  nextRate: number | null;   // שיעור המדרגה הבאה (null אם אין)
  distanceToNext: number;    // ₪ עד המדרגה הבאה
  distanceToNextMonthly: number;
  currentBracketLabel: string;
}

export interface YearComparisonResult {
  year: TaxYear;
  netSalary: number;
  incomeTax: number;
  totalDeductions: number;
  netPercentage: number;
  marginalRate: number;
}

export interface BonusResult {
  grossBonus: number;
  marginalRate: number;
  netBonus: number;
  effectiveBonusRate: number;
  taxOnBonus: number;
  socialSecurityOnBonus: number;
}

export interface CreditPointsProfile {
  gender: 'male' | 'female';
  childrenAge0: number;         // ילדים בשנת לידה
  childrenAge1to5: number;      // ילדים 1-5
  childrenAge6to17: number;     // ילדים 6-17
  childrenAge18: number;        // ילדים 18
  singleParent: boolean;
  disabledChildren: number;
  newImmigrantYears: 0 | 1 | 2 | 3; // 0=לא עולה, 1=שנה 1-1.5, 2=שנה 1.5-3, 3=שנה 3-4.5
  releasedSoldier: boolean;
  bachelorDegree: boolean;
  masterDegree: boolean;
}

export interface CreditPointsResult {
  totalPoints: number;
  monthlyCredit: number;
  annualCredit: number;
  breakdown: { label: string; points: number }[];
}

// ============================================================
// קבועי פנסיה
// ============================================================

export const PENSION_RATES: Record<PensionLevel, { employee: number; employer: number; label: string; description: string }> = {
  minimum: {
    employee: 0.06,
    employer: 0.065,
    label: 'מינימום (6% + 6.5%)',
    description: 'חובה לפי צו הרחבה — מינימום החוק',
  },
  recommended: {
    employee: 0.07,
    employer: 0.075,
    label: 'מומלץ (7% + 7.5%)',
    description: 'מומלץ לאיזון בין נטו גבוה לחיסכון טוב',
  },
  maximum: {
    employee: 0.07,      // 7% עובד (מעל 7% לא מוכר כהוצ' מוכרת)
    employer: 0.075,
    label: 'מקסימום הטבה (7% + 7.5% + 5.5%)',
    description: 'כולל 5.5% תגמולים נוספים — מקסום הטבת מס',
  },
  // note: maximum = same as recommended from employee side, employer adds 5.5%
};

const PENSION_EXTRA_EMPLOYER: Record<PensionLevel, number> = {
  minimum: 0,
  recommended: 0,
  maximum: 0.055,
};

// ============================================================
// פונקציות עזר פנימיות
// ============================================================

function calcIncomeTaxWithBrackets(
  annualIncome: number,
  creditPoints: number,
  brackets: readonly { upTo: number; rate: number }[],
): number {
  let remaining = annualIncome;
  let tax = 0;
  let prev = 0;
  for (const b of brackets) {
    if (remaining <= 0) break;
    const sz = (b.upTo === Infinity ? remaining : b.upTo) - prev;
    const t = Math.min(remaining, sz);
    tax += t * b.rate;
    remaining -= t;
    if (b.upTo !== Infinity) prev = b.upTo;
  }
  const creditAmount = creditPoints * CREDIT_POINT_2026.annual;
  return Math.max(0, tax - creditAmount);
}

function calcIncomeTax2026(annualIncome: number, creditPoints: number): number {
  return calcIncomeTaxWithBrackets(annualIncome, creditPoints, TAX_BRACKETS_2026);
}

function calcIncomeTax2024(annualIncome: number, creditPoints: number): number {
  return calcIncomeTaxWithBrackets(annualIncome, creditPoints, TAX_BRACKETS_2024);
}

function calcEmployeeSS(monthlyGross: number): number {
  const reducedThreshold = SOCIAL_SECURITY_EMPLOYEE_2026.reducedThresholdMonthly;
  const maxThreshold = SOCIAL_SECURITY_EMPLOYEE_2026.maxThresholdMonthly;
  const reducedRate = SOCIAL_SECURITY_EMPLOYEE_2026.reducedRate.total;
  const fullRate = SOCIAL_SECURITY_EMPLOYEE_2026.fullRate.total;

  if (monthlyGross <= reducedThreshold) return monthlyGross * reducedRate;
  if (monthlyGross <= maxThreshold)
    return reducedThreshold * reducedRate + (monthlyGross - reducedThreshold) * fullRate;
  return reducedThreshold * reducedRate + (maxThreshold - reducedThreshold) * fullRate;
}

function calcEmployerSS(monthlyGross: number): number {
  const reducedThreshold = SOCIAL_SECURITY_EMPLOYEE_2026.reducedThresholdMonthly;
  const maxThreshold = SOCIAL_SECURITY_EMPLOYEE_2026.maxThresholdMonthly;
  const reducedRate = SOCIAL_SECURITY_EMPLOYEE_2026.employerRates.reducedRate;
  const fullRate = SOCIAL_SECURITY_EMPLOYEE_2026.employerRates.fullRate;

  if (monthlyGross <= reducedThreshold) return monthlyGross * reducedRate;
  if (monthlyGross <= maxThreshold)
    return reducedThreshold * reducedRate + (monthlyGross - reducedThreshold) * fullRate;
  return reducedThreshold * reducedRate + (maxThreshold - reducedThreshold) * fullRate;
}

function getMarginalRate(annualIncome: number): number {
  const brackets = TAX_BRACKETS_2026;
  for (const b of brackets) {
    if (annualIncome <= b.upTo) return b.rate;
  }
  return brackets[brackets.length - 1].rate;
}

function getMarginalBracketInfo(annualIncome: number): MarginalBracketInfo {
  const brackets = [...TAX_BRACKETS_2026];
  let prev = 0;
  for (let i = 0; i < brackets.length; i++) {
    const b = brackets[i];
    if (annualIncome <= b.upTo) {
      const nextBracket = brackets[i + 1] ?? null;
      const distanceToNext = b.upTo === Infinity ? 0 : b.upTo - annualIncome;
      return {
        currentRate: b.rate,
        nextRate: nextBracket?.rate ?? null,
        distanceToNext,
        distanceToNextMonthly: distanceToNext / 12,
        currentBracketLabel: `${(b.rate * 100).toFixed(0)}%`,
      };
    }
    prev = b.upTo;
  }
  return {
    currentRate: 0.5,
    nextRate: null,
    distanceToNext: 0,
    distanceToNextMonthly: 0,
    currentBracketLabel: '50%',
  };
}

function computeNetFromGross(
  gross: number,
  opts: Pick<SalaryNetGrossInput, 'creditPoints' | 'pensionEnabled' | 'studyFundEnabled'> & {
    pensionLevel?: PensionLevel;
    disabilityInsuranceRate?: number;
    taxYear?: TaxYear;
  },
): number {
  const annual = gross * 12;
  const taxYear = opts.taxYear ?? '2026';
  const pensionLevel = opts.pensionLevel ?? 'minimum';
  const disabilityInsuranceRate = opts.disabilityInsuranceRate ?? 0;
  const brackets = taxYear === '2026' ? TAX_BRACKETS_2026 : TAX_BRACKETS_2024;
  const incomeTax = calcIncomeTaxWithBrackets(annual, opts.creditPoints, brackets) / 12;
  const ss = calcEmployeeSS(gross);
  const pensionRates = PENSION_RATES[pensionLevel];
  const pension = opts.pensionEnabled ? gross * pensionRates.employee : 0;
  const studyFund = opts.studyFundEnabled ? gross * 0.025 : 0;
  const disability = gross * (disabilityInsuranceRate / 100);
  return gross - incomeTax - ss - pension - studyFund - disability;
}

// ============================================================
// חישוב ראשי: ברוטו → נטו
// ============================================================

export function calculateSalaryNetGross(input: SalaryNetGrossInput): SalaryNetGrossResult {
  const gross = Math.max(0, input.grossSalary);
  const annual = gross * 12;
  // ברירות מחדל לשדות אופציונליים
  const taxYear = input.taxYear ?? '2026';
  const pensionLevel = input.pensionLevel ?? 'minimum';
  const disabilityInsuranceRate = input.disabilityInsuranceRate ?? 0;
  const brackets = taxYear === '2026' ? TAX_BRACKETS_2026 : TAX_BRACKETS_2024;

  const creditAmount = input.creditPoints * CREDIT_POINT_2026.annual;
  const incomeTax = calcIncomeTaxWithBrackets(annual, input.creditPoints, brackets) / 12;
  const socialSecurity = calcEmployeeSS(gross);

  const pensionRates = PENSION_RATES[pensionLevel];
  const pensionDeduction = input.pensionEnabled ? gross * pensionRates.employee : 0;
  const studyFundDeduction = input.studyFundEnabled ? gross * 0.025 : 0;
  const disabilityInsurance = gross * (disabilityInsuranceRate / 100);

  const totalDeductions = incomeTax + socialSecurity + pensionDeduction + studyFundDeduction + disabilityInsurance;
  const netSalary = gross - totalDeductions;
  const netPercentage = gross > 0 ? (netSalary / gross) * 100 : 0;

  const effectiveTaxRate = gross > 0 ? (incomeTax / gross) * 100 : 0;
  const marginalTaxRate = getMarginalRate(annual) * 100;
  const marginalBracketInfo = getMarginalBracketInfo(annual);
  const hourlyRate = input.monthlyWorkHours > 0 ? gross / input.monthlyWorkHours : 0;

  // עלויות מעסיק
  const employerSS = calcEmployerSS(gross);
  const employerPension = input.pensionEnabled ? gross * (pensionRates.employer + PENSION_EXTRA_EMPLOYER[pensionLevel]) : 0;
  const employerStudyFund = input.studyFundEnabled ? gross * 0.075 : 0;
  const employerCompensation = gross * 0.0833;
  const totalEmployerCost = gross + employerSS + employerPension + employerStudyFund + employerCompensation;

  return {
    grossSalary: gross,
    annualGross: annual,
    incomeTax,
    socialSecurity,
    pensionDeduction,
    studyFundDeduction,
    disabilityInsurance,
    totalDeductions,
    netSalary,
    netPercentage,
    effectiveTaxRate,
    marginalTaxRate,
    marginalBracketInfo,
    hourlyRate,
    employerSocialSecurity: employerSS,
    employerPension,
    employerStudyFund,
    employerCompensation,
    totalEmployerCost,
    costToNetRatio: netSalary > 0 ? totalEmployerCost / netSalary : 0,
    creditAmount: creditAmount / 12,
  };
}

// ============================================================
// חישוב הפוך: נטו → ברוטו (Binary Search)
// ============================================================

/**
 * חישוב הפוך: נטו רצוי → ברוטו נדרש
 * משתמש ב-binary search (מתכנס תוך ~40 איטרציות)
 */
export function calculateGrossFromNet(
  targetNet: number,
  options: Omit<SalaryNetGrossInput, 'grossSalary'>,
): { grossSalary: number; result: SalaryNetGrossResult } {
  let lo = targetNet;        // תחתית: ברוטו לפחות כמו הנטו
  let hi = targetNet * 3;   // גובה: מרווח ביטחון

  // הגדל את hi עד שהנטו מהברוטו עולה על הנטו המבוקש
  let safetyCounter = 0;
  while (
    computeNetFromGross(hi, options) < targetNet && safetyCounter < 50
  ) {
    hi *= 2;
    safetyCounter++;
  }

  for (let i = 0; i < 60; i++) {
    const mid = (lo + hi) / 2;
    const net = computeNetFromGross(mid, options);
    if (Math.abs(net - targetNet) < 0.01) {
      lo = mid;
      break;
    }
    if (net < targetNet) lo = mid;
    else hi = mid;
  }

  const gross = Math.round(lo * 100) / 100;
  const result = calculateSalaryNetGross({ ...options, grossSalary: gross });
  return { grossSalary: gross, result };
}

// ============================================================
// חישוב עלות מעסיק → נטו
// ============================================================

/**
 * נתון: עלות מעסיק כוללת — מה השכר ברוטו ומה הנטו לעובד?
 * עלות מעסיק = ברוטו × (1 + SS_employer + pension_employer + studyFund_employer + compensation)
 */
export function calculateNetFromEmployerCost(
  employerCost: number,
  options: Omit<SalaryNetGrossInput, 'grossSalary'>,
): { grossSalary: number; result: SalaryNetGrossResult } {
  // Binary search על ברוטו שנותן את עלות המעסיק הרצויה
  let lo = employerCost * 0.5;
  let hi = employerCost;

  for (let i = 0; i < 60; i++) {
    const mid = (lo + hi) / 2;
    const result = calculateSalaryNetGross({ ...options, grossSalary: mid });
    const diff = result.totalEmployerCost - employerCost;
    if (Math.abs(diff) < 0.01) {
      lo = mid;
      break;
    }
    if (result.totalEmployerCost < employerCost) lo = mid;
    else hi = mid;
  }

  const gross = Math.round(lo * 100) / 100;
  const result = calculateSalaryNetGross({ ...options, grossSalary: gross });
  return { grossSalary: gross, result };
}

// ============================================================
// השוואת שנים
// ============================================================

export function calculateYearComparison(
  input: SalaryNetGrossInput,
  years: TaxYear[] = ['2024', '2025', '2026'],
): YearComparisonResult[] {
  return years.map((year) => {
    const result = calculateSalaryNetGross({ ...input, taxYear: year });
    return {
      year,
      netSalary: result.netSalary,
      incomeTax: result.incomeTax,
      totalDeductions: result.totalDeductions,
      netPercentage: result.netPercentage,
      marginalRate: result.marginalTaxRate,
    };
  });
}

// ============================================================
// חישוב בונוס נטו
// ============================================================

/**
 * הבונוס ממוסה בשיעור המדרגה השולית (לא הממוצעת).
 * כלומר: שיעור המס על הבונוס גבוה ממה שמשלמים על המשכורת הרגילה.
 */
export function calculateBonusNet(
  bonus: number,
  annualGross: number,
  options: Pick<SalaryNetGrossInput, 'creditPoints' | 'pensionEnabled' | 'studyFundEnabled'> & {
    pensionLevel?: PensionLevel;
    disabilityInsuranceRate?: number;
    taxYear?: TaxYear;
  },
): BonusResult {
  const pensionLevel = options.pensionLevel ?? 'minimum';
  const disabilityInsuranceRate = options.disabilityInsuranceRate ?? 0;
  const marginalRate = getMarginalRate(annualGross);

  // ב.ל. על בונוס: בשיעור הרלוונטי לשכר הנוכחי + הבונוס
  const monthlyEquivalentBonus = bonus / 12;
  const grossWithBonus = annualGross / 12 + monthlyEquivalentBonus;
  const ssOnGross = calcEmployeeSS(annualGross / 12);
  const ssOnGrossWithBonus = calcEmployeeSS(grossWithBonus) * 12;
  const additionalSS = Math.max(0, ssOnGrossWithBonus - ssOnGross * 12);

  const taxOnBonus = bonus * marginalRate;
  const ssOnBonus = Math.min(additionalSS, bonus * SOCIAL_SECURITY_EMPLOYEE_2026.fullRate.total);

  const pensionOnBonus = options.pensionEnabled ? bonus * PENSION_RATES[pensionLevel].employee : 0;
  const studyFundOnBonus = options.studyFundEnabled ? bonus * 0.025 : 0;
  const disabilityOnBonus = bonus * (disabilityInsuranceRate / 100);

  const netBonus = bonus - taxOnBonus - ssOnBonus - pensionOnBonus - studyFundOnBonus - disabilityOnBonus;
  const effectiveBonusRate = bonus > 0 ? (netBonus / bonus) * 100 : 0;

  return {
    grossBonus: bonus,
    marginalRate,
    netBonus: Math.max(0, netBonus),
    effectiveBonusRate,
    taxOnBonus,
    socialSecurityOnBonus: ssOnBonus,
  };
}

// ============================================================
// מחשבון נקודות זיכוי
// ============================================================

export function calculateCreditPoints(profile: CreditPointsProfile): CreditPointsResult {
  const breakdown: { label: string; points: number }[] = [];

  // בסיס: תושב ישראל
  breakdown.push({ label: 'תושב ישראל', points: CREDIT_POINTS_BY_STATUS.resident });

  // אישה
  if (profile.gender === 'female') {
    breakdown.push({ label: 'אישה', points: CREDIT_POINTS_BY_STATUS.woman });
  }

  // ילדים
  for (let i = 0; i < profile.childrenAge0; i++) {
    breakdown.push({ label: `ילד שנת לידה #${i + 1}`, points: CREDIT_POINTS_BY_STATUS.childAge0 });
  }
  for (let i = 0; i < profile.childrenAge1to5; i++) {
    breakdown.push({ label: `ילד 1-5 #${i + 1}`, points: CREDIT_POINTS_BY_STATUS.childAge1to5 });
  }
  for (let i = 0; i < profile.childrenAge6to17; i++) {
    breakdown.push({ label: `ילד 6-17 #${i + 1}`, points: CREDIT_POINTS_BY_STATUS.childAge6to17 });
  }
  for (let i = 0; i < profile.childrenAge18; i++) {
    breakdown.push({ label: `ילד 18 #${i + 1}`, points: CREDIT_POINTS_BY_STATUS.childAge18 });
  }

  // הורה יחיד
  if (profile.singleParent) {
    breakdown.push({ label: 'הורה יחיד', points: CREDIT_POINTS_BY_STATUS.singleParent });
  }

  // ילדים נכים
  for (let i = 0; i < profile.disabledChildren; i++) {
    breakdown.push({ label: `ילד נכה #${i + 1}`, points: CREDIT_POINTS_BY_STATUS.disabledChild });
  }

  // עולה חדש
  if (profile.newImmigrantYears === 1) {
    breakdown.push({ label: 'עולה חדש (שנה 1-1.5)', points: CREDIT_POINTS_BY_STATUS.newImmigrant.year1to1_5 });
  } else if (profile.newImmigrantYears === 2) {
    breakdown.push({ label: 'עולה חדש (שנה 1.5-3)', points: CREDIT_POINTS_BY_STATUS.newImmigrant.year1_5to3 });
  } else if (profile.newImmigrantYears === 3) {
    breakdown.push({ label: 'עולה חדש (שנה 3-4.5)', points: CREDIT_POINTS_BY_STATUS.newImmigrant.year3to4_5 });
  }

  // חייל משוחרר
  if (profile.releasedSoldier) {
    breakdown.push({ label: 'חייל משוחרר', points: CREDIT_POINTS_BY_STATUS.releasedSoldier });
  }

  // השכלה
  if (profile.bachelorDegree) {
    breakdown.push({ label: 'תואר ראשון', points: CREDIT_POINTS_BY_STATUS.bachelorDegree });
  }
  if (profile.masterDegree) {
    breakdown.push({ label: 'תואר שני', points: CREDIT_POINTS_BY_STATUS.masterDegree });
  }

  const totalPoints = breakdown.reduce((sum, b) => sum + b.points, 0);
  const monthlyCredit = totalPoints * CREDIT_POINT_2026.monthly;
  const annualCredit = totalPoints * CREDIT_POINT_2026.annual;

  return { totalPoints, monthlyCredit, annualCredit, breakdown };
}

// ============================================================
// מידע על המדרגה השולית
// ============================================================

export function getMarginalBracketInfoPublic(annualIncome: number): MarginalBracketInfo {
  return getMarginalBracketInfo(annualIncome);
}

// ============================================================
// נתוני Bar Chart: נטו לאורך טווח שכר
// ============================================================

export interface SalaryCurvePoint {
  gross: number;
  net: number;
  tax: number;
  ss: number;
  pension: number;
  label: string;
}

export function calculateSalaryCurve(
  options: Omit<SalaryNetGrossInput, 'grossSalary'>,
  points: number[] = [5_000, 8_000, 10_000, 12_000, 15_000, 20_000, 25_000, 30_000, 40_000, 50_000],
): SalaryCurvePoint[] {
  return points.map((gross) => {
    const r = calculateSalaryNetGross({ ...options, grossSalary: gross });
    return {
      gross,
      net: Math.round(r.netSalary),
      tax: Math.round(r.incomeTax),
      ss: Math.round(r.socialSecurity),
      pension: Math.round(r.pensionDeduction),
      label: `${(gross / 1000).toFixed(0)}K`,
    };
  });
}
