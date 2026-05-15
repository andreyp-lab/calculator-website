/**
 * חישוב פיצויי פיטורין - גרסה מקיפה
 *
 * מבוסס על:
 * - חוק פיצויי פיטורים, התשכ"ג-1963
 * - סעיף 14 לחוק פיצויי פיטורים (הסדר ביטוח)
 * - חוזרי רשות המסים: מס הכנסה, פריסה רב-שנתית, רצף קצבה
 * - תקנות פיצויי פיטורים (חישוב הפיצויים), התשמ"ו-1985
 * - חוק הגנת השכר - הלנת שכר
 *
 * עדכון: 2026-05-15
 */

import { SEVERANCE_COMPENSATION, TAX_BRACKETS_2026 } from '@/lib/constants/tax-2026';

// ============================================================
// Types & Enums
// ============================================================

export type EmploymentType = 'monthly' | 'hourly';

/**
 * סיבות סיום עבודה - 13 תרחישים
 */
export type TerminationReason =
  | 'fired'               // פיטורין רגילים
  | 'resigned'            // התפטרות רגילה (לא מזכה)
  | 'retirement'          // פרישה לגיל פרישה (67/64)
  | 'qualifying'          // התפטרות מזכה - כלל
  | 'deterioration'       // הרעה מוחשית בתנאי עבודה
  | 'relocation'          // העברה גיאוגרפית (>50 ק"מ)
  | 'health'              // מצב בריאותי - עצמו/משפחה
  | 'maternity'           // לידה / 9 חודשים אחרי
  | 'disabled_child'      // טיפול בילד נכה
  | 'reserve_duty'        // מילואים ממושכים (90+ ימים)
  | 'employer_death'      // מות מעסיק / פירוק חברה
  | 'conditions_change'   // שינוי מהותי בתנאי העסקה
  | 'fixed_term_end';     // סיום חוזה לתקופה קצובה

/**
 * שיטת חישוב השכר הקובע
 */
export type SalaryBasisMethod =
  | 'last_month'          // שכר חודש אחרון
  | 'average_3m'          // ממוצע 3 חודשים אחרונים
  | 'average_12m'         // ממוצע 12 חודשים אחרונים
  | 'custom';             // הכנסה מותאמת (בחירה ידנית)

/**
 * אפשרות מיסוי פיצויים
 */
export type TaxOption =
  | 'immediate_exemption' // פטור מיידי עד תקרה
  | 'pension_continuity'  // רצף קצבה - העברה לפנסיה
  | 'multi_year_spread'   // פריסה רב-שנתית (עד 6 שנים)
  | 'combination';        // שילוב: חלק לפנסיה, חלק בפריסה

// ============================================================
// Input Interfaces
// ============================================================

export interface SeveranceInput {
  startDate: string;          // YYYY-MM-DD
  endDate: string;
  monthlySalary: number;      // שכר קובע
  employmentType: EmploymentType;
  partTimePercentage: number; // 0-100
  hasSection14: boolean;
  section14Percentage: number; // 0-8.33 (usually 8.33)
  terminationReason: TerminationReason;
}

export interface SeveranceFullInput extends SeveranceInput {
  salaryBasisMethod?: SalaryBasisMethod;
  lastMonthSalary?: number;
  avg3mSalary?: number;
  avg12mSalary?: number;
  // Section 14 full detail
  section14Coverage?: number;       // % כיסוי סעיף 14 (72, 83.3, 100)
  accumulatedInFund?: number;       // סכום שנצבר בקרן בפועל
  // Tax planning
  currentAnnualIncome?: number;     // הכנסה שנתית נוכחית (לחישוב מדרגות)
  age?: number;                     // גיל (מגיל 50 - פטור מוגדל)
  taxOption?: TaxOption;
  spreadYears?: number;             // 1-6 שנים פריסה
  // Late payment
  paymentDueDate?: string;          // YYYY-MM-DD
  actualPaymentDate?: string;       // YYYY-MM-DD (ריק = עדיין לא שולם)
}

// ============================================================
// Result Interfaces
// ============================================================

export interface SeveranceResult {
  isEligible: boolean;
  ineligibilityReason?: string;
  yearsOfService: number;
  monthsOfService: number;
  adjustedSalary: number;
  baseSeverance: number;
  taxExemptAmount: number;
  taxableAmount: number;
  estimatedTax: number;
  netSeverance: number;
  formula: string;
}

export interface Section14Detail {
  section14Coverage: number;          // % כיסוי
  accumulatedInFund: number;          // נצבר בקרן
  employeeEntitlement: number;        // זכאות חוקית
  fundCoversEntitlement: number;      // כמה הקרן מכסה (%)
  employerTopUp: number;              // השלמה מהמעסיק
  employeeReceivedFromFund: number;   // עובד מקבל מהקרן
  totalReceived: number;              // סה"כ
  fundSurplus: number;                // עודף בקרן (לטובת עובד)
  note: string;
}

export interface TaxOptionResult {
  option: TaxOption;
  label: string;
  description: string;
  taxExemptAmount: number;
  taxableAmount: number;
  estimatedTax: number;
  netCash: number;                    // מזומן נטו (לא כולל קצבה עתידית)
  pensionTransferAmount: number;      // סכום שמועבר לפנסיה
  isRecommended: boolean;
  pros: string[];
  cons: string[];
  note: string;
}

export interface TaxComparisonResult {
  baseSeverance: number;
  options: TaxOptionResult[];
  bestOptionForCash: TaxOption;
  bestOptionOverall: TaxOption;
  recommendationText: string;
}

export interface TerminationRights {
  reason: TerminationReason;
  label: string;
  isEntitled: boolean;
  entitlementCondition?: string;
  legalBasis: string;
  notes: string[];
  requiresProof: boolean;
  proofRequired?: string;
  importantDeadline?: string;
}

export interface LatePaymentResult {
  originalAmount: number;
  daysLate: number;
  delayPenaltyRate: number;          // 8% ראשוני
  monthlyInterestRate: number;       // 1.5% לחודש נוסף
  totalPenalty: number;
  totalDue: number;
  legalBasis: string;
}

export interface SalaryBasisResult {
  lastMonth: number;
  average3m: number;
  average12m: number;
  recommended: SalaryBasisMethod;
  recommendationNote: string;
  differences: {
    lastVs3m: number;
    lastVs12m: number;
  };
}

// ============================================================
// Helper: Years of service calculation
// ============================================================

function calculateYearsOfService(start: Date, end: Date): { years: number; months: number } {
  const diffMs = end.getTime() - start.getTime();
  const totalMonths = diffMs / (1000 * 60 * 60 * 24 * 30.44);
  const years = totalMonths / 12;
  return {
    years: Math.round(years * 100) / 100,
    months: Math.round(totalMonths * 10) / 10,
  };
}

// ============================================================
// Helper: Marginal tax on severance amount
// Uses progressive tax brackets on the taxable portion
// ============================================================

function calculateMarginalTaxOnSeverance(
  taxableAmount: number,
  currentAnnualIncome: number = 0,
): number {
  if (taxableAmount <= 0) return 0;

  let tax = 0;
  let remaining = taxableAmount;
  let prevLimit = currentAnnualIncome; // בנינו על הכנסה השנתית הנוכחית

  for (const bracket of TAX_BRACKETS_2026) {
    if (remaining <= 0) break;
    if (prevLimit >= bracket.upTo) continue;

    const inBracket = Math.min(remaining, bracket.upTo - prevLimit);
    tax += inBracket * bracket.rate;
    remaining -= inBracket;
    prevLimit = bracket.upTo;
  }

  return Math.round(tax);
}

// ============================================================
// Helper: Calculate tax exemption ceiling
// ============================================================

function calculateExemptionCeiling(
  adjustedSalary: number,
  years: number,
  age: number = 45,
): number {
  const byCeiling = SEVERANCE_COMPENSATION.annualExemptionCeiling * years;
  const bySalary = adjustedSalary * SEVERANCE_COMPENSATION.exemptionMultiplier * years;

  let ceiling = Math.min(byCeiling, bySalary);

  // מגיל 50 - פטור מוגדל (חוזר מס הכנסה 11/2009)
  // כפל מקדם עד 150% מהתקרה הרגילה, בתנאים מסוימים
  if (age >= 50) {
    ceiling = Math.min(byCeiling * 1.5, bySalary);
  }

  return ceiling;
}

// ============================================================
// Core: Basic severance calculation (backward compatible)
// ============================================================

export function calculateSeverance(input: SeveranceInput): SeveranceResult {
  const start = new Date(input.startDate);
  const end = new Date(input.endDate);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return {
      isEligible: false,
      ineligibilityReason: 'תאריכים אינם תקינים',
      yearsOfService: 0,
      monthsOfService: 0,
      adjustedSalary: 0,
      baseSeverance: 0,
      taxExemptAmount: 0,
      taxableAmount: 0,
      estimatedTax: 0,
      netSeverance: 0,
      formula: '',
    };
  }

  if (end <= start) {
    return {
      isEligible: false,
      ineligibilityReason: 'תאריך סיום העבודה חייב להיות אחרי תאריך תחילת העבודה',
      yearsOfService: 0,
      monthsOfService: 0,
      adjustedSalary: 0,
      baseSeverance: 0,
      taxExemptAmount: 0,
      taxableAmount: 0,
      estimatedTax: 0,
      netSeverance: 0,
      formula: '',
    };
  }

  const { years, months } = calculateYearsOfService(start, end);

  if (years < SEVERANCE_COMPENSATION.yearsRequired) {
    return {
      isEligible: false,
      ineligibilityReason: `נדרש ותק של שנה לפחות. ותק נוכחי: ${years.toFixed(1)} שנים`,
      yearsOfService: years,
      monthsOfService: months,
      adjustedSalary: 0,
      baseSeverance: 0,
      taxExemptAmount: 0,
      taxableAmount: 0,
      estimatedTax: 0,
      netSeverance: 0,
      formula: '',
    };
  }

  if (input.terminationReason === 'resigned') {
    return {
      isEligible: false,
      ineligibilityReason:
        'התפטרות (לא מזכה) - אינך זכאי לפיצויי פיטורין אלא אם זה במסגרת התפטרות מזכה (חוק 14, מעבר דירה, מצב בריאותי וכו\')',
      yearsOfService: years,
      monthsOfService: months,
      adjustedSalary: 0,
      baseSeverance: 0,
      taxExemptAmount: 0,
      taxableAmount: 0,
      estimatedTax: 0,
      netSeverance: 0,
      formula: '',
    };
  }

  const adjustedSalary =
    input.employmentType === 'hourly'
      ? input.monthlySalary * (input.partTimePercentage / 100)
      : input.monthlySalary;

  const baseSeverance = adjustedSalary * years;

  const exemptionByCeiling = SEVERANCE_COMPENSATION.annualExemptionCeiling * years;
  const exemptionBySalary = adjustedSalary * SEVERANCE_COMPENSATION.exemptionMultiplier * years;
  const taxExemptAmount = Math.min(baseSeverance, exemptionByCeiling, exemptionBySalary);

  const taxableAmount = Math.max(0, baseSeverance - taxExemptAmount);

  const estimatedTax = taxableAmount * 0.30;

  const netSeverance = baseSeverance - estimatedTax;

  return {
    isEligible: true,
    yearsOfService: years,
    monthsOfService: months,
    adjustedSalary,
    baseSeverance,
    taxExemptAmount,
    taxableAmount,
    estimatedTax,
    netSeverance,
    formula: `${adjustedSalary.toLocaleString('he-IL')} ש"ח × ${years.toFixed(2)} שנים = ${baseSeverance.toLocaleString('he-IL')} ש"ח`,
  };
}

// ============================================================
// Full Severance: detailed result with more data
// ============================================================

export function calculateSeveranceFull(input: SeveranceFullInput): SeveranceResult & {
  section14Detail?: Section14Detail;
  taxComparison?: TaxComparisonResult;
  terminationRights: TerminationRights;
  salaryBasis?: SalaryBasisResult;
} {
  const baseResult = calculateSeverance(input);
  const terminationRights = getTerminationRights(input.terminationReason);

  if (!baseResult.isEligible) {
    return { ...baseResult, terminationRights };
  }

  const start = new Date(input.startDate);
  const end = new Date(input.endDate);
  const { years } = calculateYearsOfService(start, end);

  const adjustedSalary = baseResult.adjustedSalary;
  const baseSeverance = baseResult.baseSeverance;
  const age = input.age ?? 45;

  // Section 14 detail
  let section14Detail: Section14Detail | undefined;
  if (input.hasSection14 && input.accumulatedInFund !== undefined) {
    section14Detail = calculateSection14Detail(
      input.accumulatedInFund,
      baseSeverance,
      input.section14Coverage ?? 100,
    );
  }

  // Tax comparison
  const taxComparison = compareSeveranceTaxOptions({
    baseSeverance,
    adjustedSalary,
    years,
    age,
    currentAnnualIncome: input.currentAnnualIncome ?? 0,
    spreadYears: input.spreadYears ?? 6,
  });

  // Salary basis helper
  let salaryBasis: SalaryBasisResult | undefined;
  if (input.lastMonthSalary !== undefined || input.avg3mSalary !== undefined || input.avg12mSalary !== undefined) {
    salaryBasis = calculateSalaryBasis(
      input.lastMonthSalary ?? input.monthlySalary,
      input.avg3mSalary ?? input.monthlySalary,
      input.avg12mSalary ?? input.monthlySalary,
    );
  }

  return {
    ...baseResult,
    section14Detail,
    taxComparison,
    terminationRights,
    salaryBasis,
  };
}

// ============================================================
// Section 14: Full/Partial Coverage Calculation
// ============================================================

export function calculateSection14Detail(
  accumulatedInFund: number,
  employeeEntitlement: number,  // שכר × שנים = זכאות חוקית
  coveragePercent: number = 100, // 72, 83.3, or 100
): Section14Detail {
  const coveredEntitlement = (employeeEntitlement * coveragePercent) / 100;
  const uncoveredEntitlement = employeeEntitlement - coveredEntitlement;

  // אם הצבירה בקרן גבוהה מהזכאות המכוסה - עובד מקבל הכל (עודף לטובתו)
  const fundCoversAmount = Math.min(accumulatedInFund, coveredEntitlement);
  const fundSurplus = Math.max(0, accumulatedInFund - coveredEntitlement);

  // אם סעיף 14 מלא (100%): מעסיק לא משלים גם אם הקרן קטנה מהזכאות
  // אם סעיף 14 חלקי: מעסיק חייב להשלים את החלק שאינו מכוסה
  const employerTopUp = coveragePercent >= 100
    ? 0  // סעיף 14 מלא - אין השלמה
    : Math.max(0, uncoveredEntitlement - 0); // חלק לא מכוסה - מעסיק משלם

  const employeeReceivedFromFund = accumulatedInFund; // כל הקרן עוברת לעובד
  const totalReceived = employeeReceivedFromFund + employerTopUp;

  const fundCoversPct = employeeEntitlement > 0
    ? Math.round((accumulatedInFund / employeeEntitlement) * 100)
    : 0;

  let note = '';
  if (coveragePercent >= 100) {
    if (accumulatedInFund >= employeeEntitlement) {
      note = 'סעיף 14 מלא: הקרן מכסה את מלוא הזכאות וישנו עודף לטובתך.';
    } else {
      note = 'סעיף 14 מלא: גם אם הקרן נמוכה מהזכאות, המעסיק אינו חייב להשלים (לפי פס"ד).';
    }
  } else {
    note = `סעיף 14 חלקי (${coveragePercent}%): ${coveragePercent}% מכוסה בקרן, ${100 - coveragePercent}% על המעסיק להשלים ישירות.`;
  }

  return {
    section14Coverage: coveragePercent,
    accumulatedInFund,
    employeeEntitlement,
    fundCoversEntitlement: fundCoversPct,
    employerTopUp,
    employeeReceivedFromFund,
    totalReceived,
    fundSurplus,
    note,
  };
}

// ============================================================
// Tax Options Comparison: 4 strategies
// ============================================================

interface TaxComparisonInput {
  baseSeverance: number;
  adjustedSalary: number;
  years: number;
  age: number;
  currentAnnualIncome: number;
  spreadYears: number; // 1-6
}

export function compareSeveranceTaxOptions(input: TaxComparisonInput): TaxComparisonResult {
  const { baseSeverance, adjustedSalary, years, age, currentAnnualIncome, spreadYears } = input;

  const exemptionCeiling = calculateExemptionCeiling(adjustedSalary, years, age);
  const cappedExemption = Math.min(baseSeverance, exemptionCeiling);
  const taxableBase = Math.max(0, baseSeverance - cappedExemption);

  // ============================================================
  // Option A: פטור מיידי (Immediate Exemption)
  // ============================================================
  const taxImmediate = calculateMarginalTaxOnSeverance(taxableBase, currentAnnualIncome);
  const optionImmediate: TaxOptionResult = {
    option: 'immediate_exemption',
    label: 'פטור מיידי',
    description: 'קבל את הפטור עד התקרה עכשיו, שלם מס שולי על השאר',
    taxExemptAmount: cappedExemption,
    taxableAmount: taxableBase,
    estimatedTax: taxImmediate,
    netCash: baseSeverance - taxImmediate,
    pensionTransferAmount: 0,
    isRecommended: false,
    pros: [
      'מזומן מיידי בסכום גבוה',
      'פשוט לחישוב ולניהול',
      'לא מחייב עוד קשר עם מעסיק',
    ],
    cons: [
      taxableBase > 0 ? `מס על ${Math.round(taxableBase).toLocaleString('he-IL')} ₪` : 'ללא חסרונות מהותיים',
      'לא מגדיל קצבת פנסיה עתידית',
    ],
    note: age >= 50 ? 'מגיל 50: זכאי לפטור מוגדל (עד 150% מהתקרה הרגילה)' : '',
  };

  // ============================================================
  // Option B: רצף קצבה (Pension Continuity)
  // מעביר את כל/חלק הפיצויים לקרן פנסיה - ללא מס עכשיו
  // ============================================================
  const optionPension: TaxOptionResult = {
    option: 'pension_continuity',
    label: 'רצף קצבה',
    description: 'העבר את הפיצויים לקרן פנסיה — פטור מלא ממס עכשיו, קצבה עתידית',
    taxExemptAmount: baseSeverance, // כל הסכום עובר לפנסיה - אפס מס עכשיו
    taxableAmount: 0,
    estimatedTax: 0,
    netCash: 0,                     // אין מזומן עכשיו
    pensionTransferAmount: baseSeverance,
    isRecommended: false,
    pros: [
      'פטור מלא ממס עכשיו',
      'הכסף ממשיך לצמוח בפנסיה',
      'מגדיל קצבה חודשית בפרישה',
      'הכי משתלם לטווח ארוך',
    ],
    cons: [
      'אין מזומן מיידי',
      'הכסף "נעול" עד גיל פרישה',
      'מחייב קרן פנסיה פעילה',
    ],
    note: 'מומלץ לעובדים צעירים (עד גיל 50) עם קרן פנסיה פעילה',
  };

  // ============================================================
  // Option C: פריסה רב-שנתית (Multi-Year Spread)
  // מחלק את הסכום החייב על X שנים, מוריד מדרגת מס
  // ============================================================
  const actualSpreadYears = Math.min(Math.max(1, spreadYears), 6);

  // פריסה: הסכום החייב מחולק לשנים, מס לפי מדרגה נמוכה יותר
  const annualSpreadAmount = taxableBase / actualSpreadYears;
  // כל שנה מדווחת כהכנסה נוספת, אך בלי ההכנסה השנתית הנוכחית (מס ממוצע נמוך יותר)
  const taxPerSpreadYear = calculateMarginalTaxOnSeverance(annualSpreadAmount, 0);
  const totalTaxSpread = taxPerSpreadYear * actualSpreadYears;

  const optionSpread: TaxOptionResult = {
    option: 'multi_year_spread',
    label: `פריסה (${actualSpreadYears} שנים)`,
    description: `פרוס את הסכום החייב על ${actualSpreadYears} שנים — מס שולי נמוך יותר`,
    taxExemptAmount: cappedExemption,
    taxableAmount: taxableBase,
    estimatedTax: totalTaxSpread,
    netCash: baseSeverance - totalTaxSpread,
    pensionTransferAmount: 0,
    isRecommended: false,
    pros: [
      'הפחתת מדרגת המס',
      `חסכון של ${Math.max(0, taxImmediate - totalTaxSpread).toLocaleString('he-IL')} ₪ לעומת פטור מיידי`,
      'מקבל מזומן (בשיעורים)',
      'מתאים לסכומים גדולים',
    ],
    cons: [
      'מחייב הגשת דוח שנתי ${actualSpreadYears} שנים',
      'תהליך בירוקרטי מול פקיד שומה',
      'דורש תיאום עם רשות המסים',
    ],
    note: `פריסה מומלצת עד ${Math.min(Math.ceil(years), 6)} שנים (לפי שנות הוותק, עד 6 מקסימום)`,
  };

  // ============================================================
  // Option D: שילוב - חלק לפנסיה, חלק בפריסה
  // ============================================================
  const pensionPortion = cappedExemption;                     // הסכום הפטור עובר לפנסיה
  const spreadPortion = taxableBase;                           // הסכום החייב נפרס
  const taxSpreadHalf = calculateMarginalTaxOnSeverance(
    spreadPortion / actualSpreadYears,
    0,
  ) * actualSpreadYears;

  const optionCombo: TaxOptionResult = {
    option: 'combination',
    label: 'שילוב (פנסיה + פריסה)',
    description: 'הסכום הפטור לפנסיה, הסכום החייב בפריסה — מקסימום יעילות',
    taxExemptAmount: pensionPortion,
    taxableAmount: spreadPortion,
    estimatedTax: taxSpreadHalf,
    netCash: spreadPortion - taxSpreadHalf,
    pensionTransferAmount: pensionPortion,
    isRecommended: false,
    pros: [
      'מיטוב מלא — הפטור גדל בפנסיה',
      'המס הנמוך ביותר על החייב',
      'גמישות: גם מזומן גם חיסכון',
    ],
    cons: [
      'מורכב לניהול ובירוקרטיה',
      'מחייב ייעוץ מס מקצועי',
      'מחייב קרן פנסיה פעילה',
    ],
    note: 'הדרישה: חשבון פנסיה פעיל. מומלץ בייעוץ עם רואה חשבון.',
  };

  // ============================================================
  // Mark best options
  // ============================================================
  const options = [optionImmediate, optionPension, optionSpread, optionCombo];

  // Best for cash: highest netCash (excluding pension - no immediate cash)
  const cashOptions = [optionImmediate, optionSpread, optionCombo];
  const bestCashOption = cashOptions.reduce((a, b) => a.netCash > b.netCash ? a : b);

  // Best overall: if young (<50) pension wins; otherwise spread or immediate
  let bestOverall: TaxOption;
  if (taxableBase === 0) {
    bestOverall = 'immediate_exemption'; // No tax anyway
  } else if (input.age < 45 && baseSeverance > 100_000) {
    bestOverall = 'pension_continuity';
  } else if (taxableBase > 50_000) {
    bestOverall = 'combination';
  } else {
    bestOverall = bestCashOption.option;
  }

  options.forEach((opt) => {
    opt.isRecommended = opt.option === bestOverall;
  });

  let recommendationText = '';
  if (taxableBase === 0) {
    recommendationText = 'הפיצויים בטווח הפטור המלא — לא יידרש תשלום מס בכל מקרה.';
  } else if (bestOverall === 'pension_continuity') {
    recommendationText = `מומלץ רצף קצבה: בגיל ${age} עם ותק ${years.toFixed(1)} שנים, הכסף יצמח בפנסיה וייחסך מס של ${taxImmediate.toLocaleString('he-IL')} ₪.`;
  } else if (bestOverall === 'combination') {
    recommendationText = `מומלץ שילוב: הסכום הפטור (${cappedExemption.toLocaleString('he-IL')} ₪) לפנסיה, הסכום החייב (${taxableBase.toLocaleString('he-IL')} ₪) בפריסה — חיסכון מס של ${Math.max(0, taxImmediate - taxSpreadHalf).toLocaleString('he-IL')} ₪.`;
  } else {
    recommendationText = `פריסה ל-${actualSpreadYears} שנים חוסכת ${Math.max(0, taxImmediate - totalTaxSpread).toLocaleString('he-IL')} ₪ מס לעומת פטור מיידי.`;
  }

  return {
    baseSeverance,
    options,
    bestOptionForCash: bestCashOption.option,
    bestOptionOverall: bestOverall,
    recommendationText,
  };
}

// ============================================================
// Termination Rights: 13 scenarios
// ============================================================

export function getTerminationRights(reason: TerminationReason): TerminationRights {
  const rights: Record<TerminationReason, TerminationRights> = {
    fired: {
      reason: 'fired',
      label: 'פיטורין רגילים',
      isEntitled: true,
      legalBasis: 'סעיף 1 לחוק פיצויי פיטורים, התשכ"ג-1963',
      notes: [
        'זכאי לפיצויים לאחר שנת עבודה לפחות',
        'המעסיק חייב לשלם תוך 15 יום מסיום העבודה',
        'יש לדרוש שימוע לפני פיטורים (זכות קיומית)',
        'ניתן לדרוש פיצויים מוגדלים בנסיבות מיוחדות',
      ],
      requiresProof: false,
      importantDeadline: 'תשלום בתוך 15 ימים מסיום עבודה',
    },
    resigned: {
      reason: 'resigned',
      label: 'התפטרות רגילה',
      isEntitled: false,
      entitlementCondition: 'אלא אם חתום על סעיף 14 (קבלת צבירת הקרן)',
      legalBasis: 'סעיף 6 לחוק פיצויי פיטורים',
      notes: [
        'התפטרות רגילה - לא מזכה בפיצויי פיטורין',
        'אם חתום על סעיף 14 - מקבל את הסכום שנצבר בקרן',
        'מומלץ לבדוק אם קיים סעיף 14 בהסכם ההעסקה',
        'יש לתת הודעה מוקדמת (אחרת ינוכה מהשכר)',
      ],
      requiresProof: false,
    },
    retirement: {
      reason: 'retirement',
      label: 'פרישה לגיל פרישה',
      isEntitled: true,
      legalBasis: 'סעיפים 1, 11(e) לחוק פיצויי פיטורים',
      notes: [
        'גיל פרישה: 67 לגברים, 64-67 לנשים (בהדרגה)',
        'זכאי לפיצויים כבפיטורין — אין הבדל',
        'אם יש קרן פנסיה - הפיצויים משתלמים לפי סעיף 14',
        'ניתן לבקש "רצף קצבה" לשיפור הקצבה החודשית',
        'פנסיית חובה: הכסף מהפנסיה מגיע ישירות בנוסף',
      ],
      requiresProof: false,
    },
    qualifying: {
      reason: 'qualifying',
      label: 'התפטרות מזכה',
      isEntitled: true,
      entitlementCondition: 'יש להוכיח עילה מוכרת בחוק',
      legalBasis: 'סעיף 11 לחוק פיצויי פיטורים',
      notes: [
        'עובד זכאי לפיצויים כאילו פוטר',
        'נטל ההוכחה על העובד',
        'מומלץ לתעד את הנסיבות בכתב לפני ההתפטרות',
      ],
      requiresProof: true,
      proofRequired: 'תיעוד בכתב של הנסיבות המזכות',
    },
    deterioration: {
      reason: 'deterioration',
      label: 'הרעה מוחשית בתנאי עבודה',
      isEntitled: true,
      entitlementCondition: 'שינוי משמעותי ולא מוסכם בתנאי העבודה',
      legalBasis: 'סעיף 11(א) לחוק פיצויי פיטורים',
      notes: [
        'הפחתת שכר משמעותית ללא הסכמה',
        'שינוי תפקיד לנחות משמעותית',
        'שינוי שעות עבודה באופן מהותי',
        'יש להודיע למעסיק בכתב ולתת הזדמנות לתיקון',
        'מומלץ לתעד — תלושי שכר, מיילים, מסמכים',
      ],
      requiresProof: true,
      proofRequired: 'מסמכי השינוי בתנאים + תכתובת עם המעסיק',
      importantDeadline: 'להתפטר בסמיכות סבירה לאחר ההרעה',
    },
    relocation: {
      reason: 'relocation',
      label: 'העברה גיאוגרפית',
      isEntitled: true,
      entitlementCondition: 'מרחק > 50 ק"מ ממקום העבודה המקורי',
      legalBasis: 'תקנות פיצויי פיטורים (חישוב הפיצויים), התשמ"ו-1985',
      notes: [
        'חל על מעבר מקום עבודה על ידי המעסיק',
        'גם מעבר עיר/אזור שמאריך זמן נסיעה יכול להיחשב',
        'יש לתת הודעה מוקדמת ולנסות לסדר חלופה',
        'אם המעסיק מציע סיוע (נסיעות, שכר נסיעה) — ייבדק',
      ],
      requiresProof: true,
      proofRequired: 'הוכחת מרחק ושינוי מקום עבודה',
    },
    health: {
      reason: 'health',
      label: 'מצב בריאותי',
      isEntitled: true,
      entitlementCondition: 'מצב בריאות מונע המשך עבודה — עצמי או בן משפחה',
      legalBasis: 'סעיף 6 + תקנות פיצויי פיטורים',
      notes: [
        'מחלה קשה של העובד עצמו — מלא זכאי',
        'מחלה של ילד/הורה קשישים — תלוי בנסיבות',
        'יש לצרף אישורים רפואיים',
        'הכרה בזכאות תלויה לעיתים בפסיקה ונסיבות ספציפיות',
        'מומלץ לקבל חוות דעת עורך דין לפני ההתפטרות',
      ],
      requiresProof: true,
      proofRequired: 'אישורי רפואיים מרופא/מומחה',
    },
    maternity: {
      reason: 'maternity',
      label: 'לידה / 9 חודשים לאחר חזרה',
      isEntitled: true,
      entitlementCondition: 'התפטרות בתוך 9 חודשים מחזרה מחופשת לידה',
      legalBasis: 'סעיף 7 לחוק עבודת נשים, תשי"א-1951',
      notes: [
        'עובדת שהתפטרה בגלל הצורך לטפל בילד בתוך 9 חודשים מחזרה',
        'גם אב הנמצא בחופשת לידה זכאי באותן נסיבות',
        'אין צורך להוכיח כי לא הייתה אפשרות אחרת',
        'תקופת ה-9 חודשים מתחילה מיום החזרה בפועל',
        'הזכות קיימת גם אם עבדה בחלקיות משרה',
      ],
      requiresProof: true,
      proofRequired: 'תעודת לידה + תאריך חזרה מחופשת לידה',
    },
    disabled_child: {
      reason: 'disabled_child',
      label: 'טיפול בילד נכה',
      isEntitled: true,
      entitlementCondition: 'ילד עם נכות הדורש טיפול מיוחד מהורה',
      legalBasis: 'סעיף 7א לחוק עבודת נשים / חוק שוויון זכויות לאנשים עם מוגבלות',
      notes: [
        'הורה שמתפטר לטפל בילד עם נכות מוכרת — זכאי',
        'יש להוכיח שאין מסגרת חלופית מתאימה',
        'מומלץ לדווח למוסד לביטוח לאומי על הנכות',
        'ייתכן זכאות גם לדמי אבטלה — כדאי לבדוק',
      ],
      requiresProof: true,
      proofRequired: 'אישור נכות של הילד + אישור רפואי על צורך בטיפול',
    },
    reserve_duty: {
      reason: 'reserve_duty',
      label: 'מילואים ממושכים (90+ יום)',
      isEntitled: true,
      entitlementCondition: 'שירות מילואים של 90 ימים ומעלה בתוך שנה',
      legalBasis: 'חוק שירות בטחון (הוראות נוספות), תשל"ז-1977, סעיף 38',
      notes: [
        'עובד ששירת 90+ ימי מילואים יכול להתפטר ולקבל פיצויים',
        'הזכות חלה גם במקרה של פיטורים בגלל מילואים (אסור חוקית)',
        'ביטוח לאומי מפצה את המעסיק על תשלומי מילואים',
        'אסור לפטר עובד שנמצא או חזר ממילואים (עד 30 יום)',
      ],
      requiresProof: true,
      proofRequired: 'אישורי שירות מילואים',
    },
    employer_death: {
      reason: 'employer_death',
      label: 'מות מעסיק / פירוק חברה',
      isEntitled: true,
      legalBasis: 'סעיפים 4-5 לחוק פיצויי פיטורים',
      notes: [
        'מות מעסיק שקול לפיטורים עבור העובד',
        'חברה שפורקת — העובדים זכאים לפיצויים מנכסי פירוק',
        'במקרה חדלות פירעון — יש להגיש תביעה לנאמן בפשיטת רגל',
        'ביטוח לאומי עשוי לשלם פיצויים אם המעסיק חדל פירעון',
        'יש להגיש תביעה לפיצויים בתוך 7 שנים (התיישנות)',
      ],
      requiresProof: false,
    },
    conditions_change: {
      reason: 'conditions_change',
      label: 'שינוי מהותי בתנאי ההעסקה',
      isEntitled: true,
      entitlementCondition: 'שינוי חד-צדדי מהותי בתנאי ההעסקה',
      legalBasis: 'סעיף 11(א) לחוק פיצויי פיטורים',
      notes: [
        'שינוי בבעלות/מדיניות שמשנה את מהות התפקיד',
        'מעבר לחברה בת/אחרת ללא הסכמה',
        'שינוי שיטת תגמול (בונוס → בסיס) שמפחית שכר',
        'הסכם אי-תחרות חדש ומגביל',
        'שינוי תנאי פנסיה/בריאות',
      ],
      requiresProof: true,
      proofRequired: 'הסכם עבודה מקורי + מסמך השינוי',
    },
    fixed_term_end: {
      reason: 'fixed_term_end',
      label: 'סיום חוזה לתקופה קצובה',
      isEntitled: true,
      entitlementCondition: 'חוזה לתקופה קצובה שלא חודש — נחשב פיטורים לפי פסיקה',
      legalBasis: 'ע"ע 1400/04 עיריית ירושלים נ\' יצחק ורדה',
      notes: [
        'אי-חידוש חוזה קצוב שקול לפיטורים לצרכי פיצויים',
        'מחייב ותק שנה לפחות (כולל חידושי חוזה רצופים)',
        'אם עבד מספר חוזים קצובים ברצף — הוותק מצטבר',
        'אם ניתנה הודעה מראש שלא יחודש — פחות פיצויים',
        'לא חל אם עזב מרצונו לפני תום החוזה',
      ],
      requiresProof: false,
    },
  };

  return rights[reason];
}

// ============================================================
// Late Payment Penalty: הלנת פיצויים
// ============================================================

export function calculateLatePaymentPenalty(
  originalAmount: number,
  daysLate: number,
): LatePaymentResult {
  // חוק הגנת השכר: עד 15 ימים — ריבית 5% על כל חודש עיכוב
  // לפיצויים: 8% ראשוני + 1.5% לכל חודש נוסף
  const INITIAL_PENALTY_RATE = 0.08; // 8% על הסכום המלא
  const MONTHLY_DELAY_RATE = 0.015; // 1.5% לחודש נוסף

  if (daysLate <= 0) {
    return {
      originalAmount,
      daysLate: 0,
      delayPenaltyRate: 0,
      monthlyInterestRate: 0,
      totalPenalty: 0,
      totalDue: originalAmount,
      legalBasis: 'שולם בזמן — אין עיכוב',
    };
  }

  // 15 ימים הם פרק הזמן החוקי לתשלום
  const lateBeyondGrace = Math.max(0, daysLate - 15);
  const additionalMonths = Math.ceil(lateBeyondGrace / 30);

  const initialPenalty = daysLate > 15 ? originalAmount * INITIAL_PENALTY_RATE : 0;
  const monthlyPenalty = additionalMonths > 0
    ? originalAmount * MONTHLY_DELAY_RATE * additionalMonths
    : 0;

  const totalPenalty = initialPenalty + monthlyPenalty;
  const totalDue = originalAmount + totalPenalty;

  return {
    originalAmount,
    daysLate,
    delayPenaltyRate: INITIAL_PENALTY_RATE,
    monthlyInterestRate: MONTHLY_DELAY_RATE,
    totalPenalty: Math.round(totalPenalty),
    totalDue: Math.round(totalDue),
    legalBasis: 'חוק הגנת השכר, תשי"ח-1958, סעיף 20',
  };
}

// ============================================================
// Salary Basis: 3 methods helper
// ============================================================

export function calculateSalaryBasis(
  lastMonth: number,
  average3m: number,
  average12m: number,
): SalaryBasisResult {
  // לרוב, הקובע הוא הגבוה מבין השכר האחרון לשכר הממוצע (לטובת העובד)
  const allValues = [lastMonth, average3m, average12m];
  const highest = Math.max(...allValues);
  const lowest = Math.min(...allValues);

  let recommended: SalaryBasisMethod;
  let recommendationNote: string;

  if (highest === lastMonth) {
    recommended = 'last_month';
    recommendationNote = 'השכר האחרון הוא הגבוה ביותר — מומלץ לבסס עליו את חישוב הפיצויים';
  } else if (highest === average3m) {
    recommended = 'average_3m';
    recommendationNote = 'ממוצע 3 חודשים הוא הגבוה — בחר בו לחישוב גבוה יותר';
  } else {
    recommended = 'average_12m';
    recommendationNote = 'ממוצע 12 חודשים הוא הגבוה — בחר בו לחישוב גבוה יותר';
  }

  // אם ההפרש קטן מ-5% — השכר האחרון מומלץ (פשטות)
  if (highest > 0 && (highest - lowest) / highest < 0.05) {
    recommended = 'last_month';
    recommendationNote = 'הפרש קטן בין השיטות — ניתן להשתמש בשכר האחרון (פשוט יותר)';
  }

  return {
    lastMonth,
    average3m,
    average12m,
    recommended,
    recommendationNote,
    differences: {
      lastVs3m: lastMonth - average3m,
      lastVs12m: lastMonth - average12m,
    },
  };
}
