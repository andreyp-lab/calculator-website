/**
 * השוואה מקיפה: חברה בע"מ vs עוסק מורשה
 *
 * ============================================================
 * מטרה: השוואה מלאה של כל מרכיבי המס בין שני מבנים עסקיים
 *
 * עוסק מורשה:
 * - מס הכנסה אישי (10%-50%, 7 מדרגות)
 * - ביטוח לאומי + בריאות (6.1%-18%)
 * - נקודות זיכוי
 * - קרן השתלמות (4.5% ניכוי, 2.5% פטור)
 * - פנסיה (עד 16.5% מהפקדה)
 *
 * חברה בע"מ:
 * - מס חברות 23% על רווח
 * - דיבידנד: 30% + 3% מס יסף (לבעל מניות מהותי) = 33%
 * - משכורת: מס הכנסה אישי + ב.ל. עובד + ב.ל. מעסיק
 * - מיקס אופטימלי: שילוב משכורת + דיבידנד
 *
 * עלויות הפעלת חברה:
 * - רואה חשבון מבקר, ניהול ספרים, אגרה שנתית
 *
 * מקורות: רשות המסים, ביטוח לאומי, חוק החברות
 * אומת: 2026-05-15
 * ============================================================
 */

import { TAX_BRACKETS_2026, CREDIT_POINT_2026 } from '@/lib/constants/tax-2026';

// ============================================================
// קבועים 2026
// ============================================================

/** מס חברות 2026 */
export const CORP_TAX_2026 = 0.23;

/** מס דיבידנד לבעל מניות מהותי (10%+) - 30% + 3% מס יסף */
export const DIVIDEND_TAX_CONTROLLING = 0.33; // 30% + 3%

/** מס דיבידנד לבעל מניות רגיל (מתחת ל-10%) - 25% */
export const DIVIDEND_TAX_NON_CONTROLLING = 0.25;

/** שיעור מס חברות × שיעור דיב' מהותי = שיעור מצרפי */
export const CORP_EFFECTIVE_ALL_DIV = 1 - (1 - CORP_TAX_2026) * (1 - DIVIDEND_TAX_CONTROLLING);
// = 1 - 0.77 × 0.67 = 1 - 0.5159 = 0.4841

/** תקרת ב.ל. חודשית */
export const MAX_NI_MONTHLY = 51_910;
export const MAX_NI_ANNUAL = MAX_NI_MONTHLY * 12; // 622,920

/** סף מנימלי לחישוב ב.ל. (60% מהשכר הממוצע) */
export const NI_REDUCED_THRESHOLD_MONTHLY = 7_522;
export const NI_REDUCED_THRESHOLD_ANNUAL = NI_REDUCED_THRESHOLD_MONTHLY * 12; // 90,264

/** שיעורי ב.ל. עצמאי */
export const NI_SELF_EMPLOYED_REDUCED = 0.061; // 6.1%
export const NI_SELF_EMPLOYED_FULL = 0.18; // 18%

/** שיעורי ב.ל. שכיר - עובד */
export const NI_EMPLOYEE_REDUCED = 0.0427; // 4.27%
export const NI_EMPLOYEE_FULL = 0.1217; // 12.17%

/** שיעורי ב.ל. מעסיק */
export const NI_EMPLOYER_REDUCED = 0.0451; // 4.51%
export const NI_EMPLOYER_FULL = 0.076; // 7.6%

// ============================================================
// ממשקי נתונים
// ============================================================

export interface CorpVsIndividualInput {
  /** רווח שנתי לפני מס לפני הוצאות עסקיות (הכנסות פחות עלות) */
  annualProfit: number;
  /** נקודות זיכוי - ברירת מחדל 2.25 */
  creditPoints: number;
  /** שיעור מיקס משכורת בחברה (0=כל דיבידנד, 1=כל משכורת) */
  salaryDividendMix: number;
  /** עלויות תפעול חברה שנתיות (ר"ח, ניהול ספרים, אגרה) */
  corpRunningCosts: number;
  /** האם בעל מניות מהותי (>10%)? */
  isControllingOwner: boolean;
  /** קצב צמיחה שנתי לתחזית רב-שנתית (%) */
  annualGrowthRate: number;
  /** מספר שנות תחזית */
  projectionYears: number;
  /** האם לכלול קרן השתלמות בחישוב עוסק */
  includeStudyFundIndividual: boolean;
  /** האם לכלול קרן השתלמות בחישוב חברה */
  includeStudyFundCorp: boolean;
  /** קרן השתלמות - שיעור הפקדה שנתי (עד 4.5%) - לעוסק מורשה */
  studyFundRateIndividual: number;
}

export interface ScenarioResult {
  grossProfit: number;
  incomeTax: number;
  socialSecurity: number;
  corporateTax: number;
  dividendTax: number;
  corpRunningCosts: number;
  studyFundDeduction: number;
  totalTax: number;
  totalCosts: number;
  netToOwner: number;
  effectiveTaxRate: number;
  /** פירוט שלב-שלב */
  breakdown: Array<{ label: string; amount: number; note?: string }>;
}

export interface IncomeLevelComparison {
  annualProfit: number;
  individual: { netToOwner: number; effectiveTaxRate: number; totalTax: number };
  corpDividend: { netToOwner: number; effectiveTaxRate: number; totalTax: number };
  corpMix: { netToOwner: number; effectiveTaxRate: number; totalTax: number };
  winner: 'individual' | 'corp';
  savingsWithCorp: number;
}

export interface YearProjection {
  year: number;
  annualProfit: number;
  individualNet: number;
  corpNet: number;
  annualSaving: number;
  cumulativeSaving: number;
  winner: 'individual' | 'corp' | 'equal';
}

export interface CorpVsIndividualResult {
  individual: ScenarioResult;
  corporationDividend: ScenarioResult;
  corporationSalary: ScenarioResult;
  corporationMix: ScenarioResult;
  recommendation: 'individual' | 'corporationDividend' | 'corporationSalary' | 'corporationMix';
  taxSavingsVsIndividual: number;
  breakEvenProfit: number;
  incomeLevelComparisons: IncomeLevelComparison[];
  yearProjections: YearProjection[];
  /** שיעור מס אפקטיבי מצרפי לכל תרחיש */
  effectiveRatesSummary: {
    individual: number;
    corpDividend: number;
    corpSalary: number;
    corpMix: number;
  };
  /** האם עלויות החברה מכסות עצמן */
  corpCostsPayback: { yearlySaving: number; monthsToBreakEven: number | null };
}

// ============================================================
// פונקציות עזר פנימיות
// ============================================================

/** חישוב מס הכנסה אישי לפי מדרגות + נקודות זיכוי */
function calcPersonalIncomeTax(annualIncome: number, creditPoints: number): number {
  let remaining = annualIncome;
  let tax = 0;
  let prevLimit = 0;

  for (const bracket of TAX_BRACKETS_2026) {
    if (remaining <= 0) break;
    const bracketSize = bracket.upTo - prevLimit;
    const taxable = Math.min(remaining, bracketSize);
    tax += taxable * bracket.rate;
    remaining -= taxable;
    prevLimit = bracket.upTo;
  }

  const creditValue = creditPoints * CREDIT_POINT_2026.annual;
  return Math.max(0, tax - creditValue);
}

/** חישוב ב.ל. + בריאות לעצמאי */
function calcSelfEmployedNI(annualIncome: number): number {
  const reducedThreshold = NI_REDUCED_THRESHOLD_ANNUAL;
  const maxThreshold = MAX_NI_ANNUAL;

  if (annualIncome <= reducedThreshold) {
    return annualIncome * NI_SELF_EMPLOYED_REDUCED;
  }
  const cappedIncome = Math.min(annualIncome, maxThreshold);
  return (
    reducedThreshold * NI_SELF_EMPLOYED_REDUCED +
    (cappedIncome - reducedThreshold) * NI_SELF_EMPLOYED_FULL
  );
}

/** חישוב ב.ל. + בריאות לשכיר - עובד */
function calcEmployeeNI(annualSalary: number): number {
  const reducedThreshold = NI_REDUCED_THRESHOLD_ANNUAL;
  const maxThreshold = MAX_NI_ANNUAL;
  const cappedSalary = Math.min(annualSalary, maxThreshold);

  const reducedPart = Math.min(cappedSalary, reducedThreshold);
  const fullPart = Math.max(0, cappedSalary - reducedThreshold);

  return reducedPart * NI_EMPLOYEE_REDUCED + fullPart * NI_EMPLOYEE_FULL;
}

/** חישוב ב.ל. מעסיק */
function calcEmployerNI(annualSalary: number): number {
  const reducedThreshold = NI_REDUCED_THRESHOLD_ANNUAL;
  const maxThreshold = MAX_NI_ANNUAL;
  const cappedSalary = Math.min(annualSalary, maxThreshold);

  const reducedPart = Math.min(cappedSalary, reducedThreshold);
  const fullPart = Math.max(0, cappedSalary - reducedThreshold);

  return reducedPart * NI_EMPLOYER_REDUCED + fullPart * NI_EMPLOYER_FULL;
}

/**
 * מחשב ברוטו מ"רווח לפני מס" בהתחשב בכך שמ.ל. מעסיק הוא הוצאה נוספת.
 * profit = grossSalary + employerNI(grossSalary)
 * צריך למצוא grossSalary כך שהעלות הכוללת = profit
 * פתרון: איטרציה (5 איטרציות מספיקות)
 */
function grossFromProfitForSalary(profit: number): number {
  if (profit <= 0) return 0;
  let gross = profit;
  for (let i = 0; i < 10; i++) {
    const cost = gross + calcEmployerNI(gross);
    if (cost <= 0) break;
    gross = profit * (gross / cost);
  }
  return Math.max(0, gross);
}

// ============================================================
// חישובי תרחישים
// ============================================================

/** תרחיש עוסק מורשה */
export function calculateAsIndividual(
  annualProfit: number,
  creditPoints: number,
  studyFundDeduction = 0,
): ScenarioResult {
  const profit = Math.max(0, annualProfit);
  const taxableProfit = Math.max(0, profit - studyFundDeduction);

  const incomeTax = calcPersonalIncomeTax(taxableProfit, creditPoints);
  const socialSecurity = calcSelfEmployedNI(profit);
  const totalTax = incomeTax + socialSecurity;
  const netToOwner = profit - totalTax - studyFundDeduction;

  return {
    grossProfit: profit,
    incomeTax,
    socialSecurity,
    corporateTax: 0,
    dividendTax: 0,
    corpRunningCosts: 0,
    studyFundDeduction,
    totalTax,
    totalCosts: totalTax + studyFundDeduction,
    netToOwner: Math.max(0, netToOwner),
    effectiveTaxRate: profit > 0 ? totalTax / profit : 0,
    breakdown: [
      { label: 'רווח ברוטו', amount: profit },
      ...(studyFundDeduction > 0
        ? [{ label: 'קרן השתלמות (ניכוי)', amount: -studyFundDeduction, note: '4.5% מהרווח' }]
        : []),
      { label: 'מס הכנסה', amount: -incomeTax, note: 'לאחר נקודות זיכוי' },
      { label: 'ביטוח לאומי + בריאות', amount: -socialSecurity, note: '6.1%-18%' },
      { label: 'נטו לבעלים', amount: Math.max(0, netToOwner), note: 'לאחר כל ניכויים' },
    ],
  };
}

/** תרחיש חברה - הכל דיבידנד */
export function calculateAsCorporationDividend(
  annualProfit: number,
  corpRunningCosts: number,
  isControllingOwner: boolean,
): ScenarioResult {
  const profit = Math.max(0, annualProfit);
  const corpTaxableProfit = Math.max(0, profit - corpRunningCosts);

  const corporateTax = corpTaxableProfit * CORP_TAX_2026;
  const profitAfterCorpTax = corpTaxableProfit - corporateTax;
  const dividendTaxRate = isControllingOwner ? DIVIDEND_TAX_CONTROLLING : DIVIDEND_TAX_NON_CONTROLLING;
  const dividendTax = profitAfterCorpTax * dividendTaxRate;
  const totalTax = corporateTax + dividendTax;
  const netToOwner = profit - totalTax - corpRunningCosts;

  return {
    grossProfit: profit,
    incomeTax: 0,
    socialSecurity: 0,
    corporateTax,
    dividendTax,
    corpRunningCosts,
    studyFundDeduction: 0,
    totalTax,
    totalCosts: totalTax + corpRunningCosts,
    netToOwner: Math.max(0, netToOwner),
    effectiveTaxRate: profit > 0 ? totalTax / profit : 0,
    breakdown: [
      { label: 'רווח ברוטו', amount: profit },
      ...(corpRunningCosts > 0
        ? [{ label: 'עלויות תפעול חברה', amount: -corpRunningCosts, note: 'ר"ח, ספרים, אגרה' }]
        : []),
      { label: 'מס חברות 23%', amount: -corporateTax },
      { label: `מס דיבידנד ${isControllingOwner ? '33%' : '25%'}`, amount: -dividendTax, note: isControllingOwner ? 'בעל מניות מהותי' : 'בעל מניות רגיל' },
      { label: 'נטו לבעלים', amount: Math.max(0, netToOwner) },
    ],
  };
}

/** תרחיש חברה - הכל משכורת */
export function calculateAsCorporationSalary(
  annualProfit: number,
  creditPoints: number,
  corpRunningCosts: number,
): ScenarioResult {
  const profit = Math.max(0, annualProfit);
  // עלויות ח"ה מופחתות מהרווח לפני חלוקת משכורת
  const availableForSalary = Math.max(0, profit - corpRunningCosts);

  // מציאת ברוטו כך שמשכורת ברוטו + ב.ל. מעסיק = availableForSalary
  const grossSalary = grossFromProfitForSalary(availableForSalary);
  const employerNI = calcEmployerNI(grossSalary);

  const incomeTax = calcPersonalIncomeTax(grossSalary, creditPoints);
  const employeeNI = calcEmployeeNI(grossSalary);
  const socialSecurity = employeeNI + employerNI;
  const totalTax = incomeTax + socialSecurity;
  const netToOwner = grossSalary - incomeTax - employeeNI;

  return {
    grossProfit: profit,
    incomeTax,
    socialSecurity,
    corporateTax: 0,
    dividendTax: 0,
    corpRunningCosts,
    studyFundDeduction: 0,
    totalTax,
    totalCosts: totalTax + corpRunningCosts,
    netToOwner: Math.max(0, netToOwner),
    effectiveTaxRate: profit > 0 ? totalTax / profit : 0,
    breakdown: [
      { label: 'רווח ברוטו', amount: profit },
      ...(corpRunningCosts > 0
        ? [{ label: 'עלויות תפעול חברה', amount: -corpRunningCosts }]
        : []),
      { label: 'משכורת ברוטו', amount: grossSalary, note: 'כולל תשלום ל-ב.ל. מעסיק' },
      { label: 'מס הכנסה', amount: -incomeTax },
      { label: 'ב.ל. עובד', amount: -employeeNI, note: '4.27%-12.17%' },
      { label: 'ב.ל. מעסיק', amount: -employerNI, note: '4.51%-7.6%' },
      { label: 'נטו לבעלים', amount: Math.max(0, netToOwner) },
    ],
  };
}

/**
 * תרחיש מיקס אופטימלי: חלק משכורת + חלק דיבידנד
 * משכורת מנוצלת למלוא נקודות הזיכוי וה"מדרגה האפקטיבית הנמוכה",
 * השאר כדיבידנד.
 */
export function calculateAsCorporationMix(
  annualProfit: number,
  creditPoints: number,
  salaryRatio: number, // 0-1
  corpRunningCosts: number,
  isControllingOwner: boolean,
  includeStudyFund = false,
): ScenarioResult {
  const profit = Math.max(0, annualProfit);
  const available = Math.max(0, profit - corpRunningCosts);
  const mixRatio = Math.max(0, Math.min(1, salaryRatio));

  // חלק לפי משכורת
  const salaryPortion = available * mixRatio;
  // חלק לפי דיבידנד
  const dividendPortion = available * (1 - mixRatio);

  // עלות המשכורת (ב.ל. מעסיק כלולה בעלות)
  const grossSalary = grossFromProfitForSalary(salaryPortion);
  const employerNI = calcEmployerNI(grossSalary);
  const employeeNI = calcEmployeeNI(grossSalary);

  // קרן השתלמות לבעלים-עובד: 7.5% מהמשכורת, עד 188*12=2,256₪/חודש ≈ 27,072 פטור
  const studyFundDeduction = includeStudyFund ? Math.min(grossSalary * 0.075, 27_072) : 0;

  const taxableGross = Math.max(0, grossSalary - studyFundDeduction);
  const incomeTax = calcPersonalIncomeTax(taxableGross, creditPoints);

  // דיבידנד: מס חברות על חלק הדיבידנד + דיבידנד
  const dividendCorpTax = dividendPortion * CORP_TAX_2026;
  const profitAfterCorpTax = dividendPortion * (1 - CORP_TAX_2026);
  const dividendTaxRate = isControllingOwner ? DIVIDEND_TAX_CONTROLLING : DIVIDEND_TAX_NON_CONTROLLING;
  const dividendTax = profitAfterCorpTax * dividendTaxRate;

  const totalTax = incomeTax + employeeNI + employerNI + dividendCorpTax + dividendTax;
  const netSalaryPart = grossSalary - incomeTax - employeeNI;
  const netDividendPart = profitAfterCorpTax - dividendTax;
  const netToOwner = netSalaryPart + netDividendPart;

  return {
    grossProfit: profit,
    incomeTax,
    socialSecurity: employeeNI + employerNI,
    corporateTax: dividendCorpTax,
    dividendTax,
    corpRunningCosts,
    studyFundDeduction,
    totalTax,
    totalCosts: totalTax + corpRunningCosts,
    netToOwner: Math.max(0, netToOwner),
    effectiveTaxRate: profit > 0 ? totalTax / profit : 0,
    breakdown: [
      { label: 'רווח ברוטו', amount: profit },
      ...(corpRunningCosts > 0
        ? [{ label: 'עלויות תפעול חברה', amount: -corpRunningCosts }]
        : []),
      { label: `משכורת ברוטו (${Math.round(mixRatio * 100)}%)`, amount: grossSalary },
      ...(studyFundDeduction > 0
        ? [{ label: 'קרן השתלמות (7.5%)', amount: -studyFundDeduction }]
        : []),
      { label: 'מס הכנסה', amount: -incomeTax },
      { label: 'ב.ל. עובד + מעסיק', amount: -(employeeNI + employerNI) },
      { label: `דיבידנד (${Math.round((1 - mixRatio) * 100)}%)`, amount: dividendPortion },
      { label: 'מס חברות 23%', amount: -dividendCorpTax },
      { label: `מס דיבידנד ${isControllingOwner ? '33%' : '25%'}`, amount: -dividendTax },
      { label: 'נטו לבעלים', amount: Math.max(0, netToOwner) },
    ],
  };
}

// ============================================================
// חיפוש נקודת איזון
// ============================================================

/**
 * מוצא את הרווח השנתי שבו חברה עם דיבידנד עולה על עוסק מורשה
 * מחזיר -1 אם לא נמצאה נקודה (אחת תמיד עדיפה)
 */
export function findBreakevenPoint(
  creditPoints: number,
  corpRunningCosts: number,
  isControllingOwner: boolean,
): number {
  // חיפוש בינארי: מה הרווח שבו corpDividend.netToOwner = individual.netToOwner
  let lo = 50_000;
  let hi = 10_000_000;

  // בדיקה ש-breakeven קיים בטווח
  const corpAtLo = calculateAsCorporationDividend(lo, corpRunningCosts, isControllingOwner);
  const indAtLo = calculateAsIndividual(lo, creditPoints);
  if (corpAtLo.netToOwner >= indAtLo.netToOwner) return lo; // כבר עדיפה מההתחלה

  const corpAtHi = calculateAsCorporationDividend(hi, corpRunningCosts, isControllingOwner);
  const indAtHi = calculateAsIndividual(hi, creditPoints);
  if (corpAtHi.netToOwner <= indAtHi.netToOwner) return -1; // לא עוברת בטווח

  // בינארי
  for (let i = 0; i < 40; i++) {
    const mid = Math.round((lo + hi) / 2);
    const corpMid = calculateAsCorporationDividend(mid, corpRunningCosts, isControllingOwner);
    const indMid = calculateAsIndividual(mid, creditPoints);
    if (corpMid.netToOwner > indMid.netToOwner) {
      hi = mid;
    } else {
      lo = mid;
    }
    if (hi - lo < 1000) break;
  }
  return Math.round((lo + hi) / 2);
}

// ============================================================
// השוואה ברמות הכנסה שונות
// ============================================================

const INCOME_LEVELS = [200_000, 300_000, 500_000, 700_000, 1_000_000, 2_000_000, 5_000_000];

export function compareAtIncomeLevels(
  levels: number[],
  creditPoints: number,
  corpRunningCosts: number,
  isControllingOwner: boolean,
  salaryRatio: number,
): IncomeLevelComparison[] {
  return levels.map((profit) => {
    const ind = calculateAsIndividual(profit, creditPoints);
    const corp = calculateAsCorporationDividend(profit, corpRunningCosts, isControllingOwner);
    const mix = calculateAsCorporationMix(profit, creditPoints, salaryRatio, corpRunningCosts, isControllingOwner);

    const bestCorpNet = Math.max(corp.netToOwner, mix.netToOwner);
    const winner: 'individual' | 'corp' = bestCorpNet > ind.netToOwner ? 'corp' : 'individual';

    return {
      annualProfit: profit,
      individual: {
        netToOwner: ind.netToOwner,
        effectiveTaxRate: ind.effectiveTaxRate,
        totalTax: ind.totalTax,
      },
      corpDividend: {
        netToOwner: corp.netToOwner,
        effectiveTaxRate: corp.effectiveTaxRate,
        totalTax: corp.totalTax,
      },
      corpMix: {
        netToOwner: mix.netToOwner,
        effectiveTaxRate: mix.effectiveTaxRate,
        totalTax: mix.totalTax,
      },
      winner,
      savingsWithCorp: Math.max(0, bestCorpNet - ind.netToOwner),
    };
  });
}

// ============================================================
// תחזית רב-שנתית
// ============================================================

export function calculateMultiYearProjection(
  startProfit: number,
  annualGrowthRate: number, // 0.1 = 10%
  years: number,
  creditPoints: number,
  corpRunningCosts: number,
  isControllingOwner: boolean,
  salaryRatio: number,
): YearProjection[] {
  const projections: YearProjection[] = [];
  let cumulative = 0;

  for (let y = 1; y <= Math.min(years, 15); y++) {
    const profit = startProfit * Math.pow(1 + annualGrowthRate, y - 1);
    const ind = calculateAsIndividual(profit, creditPoints);
    const corp = calculateAsCorporationMix(profit, creditPoints, salaryRatio, corpRunningCosts, isControllingOwner);
    const corpDiv = calculateAsCorporationDividend(profit, corpRunningCosts, isControllingOwner);

    const bestCorpNet = Math.max(corp.netToOwner, corpDiv.netToOwner);
    const annualSaving = bestCorpNet - ind.netToOwner;
    cumulative += annualSaving;

    projections.push({
      year: y,
      annualProfit: Math.round(profit),
      individualNet: Math.round(ind.netToOwner),
      corpNet: Math.round(bestCorpNet),
      annualSaving: Math.round(annualSaving),
      cumulativeSaving: Math.round(cumulative),
      winner: annualSaving > 1000 ? 'corp' : annualSaving < -1000 ? 'individual' : 'equal',
    });
  }

  return projections;
}

// ============================================================
// פונקציה ראשית
// ============================================================

export function calculateCorpVsIndividual(
  input: CorpVsIndividualInput,
): CorpVsIndividualResult {
  const {
    annualProfit,
    creditPoints,
    salaryDividendMix,
    corpRunningCosts,
    isControllingOwner,
    annualGrowthRate,
    projectionYears,
    includeStudyFundIndividual,
    studyFundRateIndividual,
  } = input;

  const profit = Math.max(0, annualProfit);

  // קרן השתלמות לעוסק: עד 4.5% מהרווח
  const studyFundDeductionInd = includeStudyFundIndividual
    ? Math.min(profit * Math.min(studyFundRateIndividual, 0.045), 20_520)
    : 0;

  // 4 תרחישים
  const individual = calculateAsIndividual(profit, creditPoints, studyFundDeductionInd);
  const corporationDividend = calculateAsCorporationDividend(profit, corpRunningCosts, isControllingOwner);
  const corporationSalary = calculateAsCorporationSalary(profit, creditPoints, corpRunningCosts);
  const corporationMix = calculateAsCorporationMix(
    profit,
    creditPoints,
    salaryDividendMix,
    corpRunningCosts,
    isControllingOwner,
    input.includeStudyFundCorp,
  );

  // המלצה
  const scenarios = [
    { key: 'individual' as const, net: individual.netToOwner },
    { key: 'corporationDividend' as const, net: corporationDividend.netToOwner },
    { key: 'corporationSalary' as const, net: corporationSalary.netToOwner },
    { key: 'corporationMix' as const, net: corporationMix.netToOwner },
  ];
  const best = scenarios.reduce((max, s) => (s.net > max.net ? s : max));
  const taxSavings = best.net - individual.netToOwner;

  // נקודת איזון
  const breakEvenProfit = findBreakevenPoint(creditPoints, corpRunningCosts, isControllingOwner);

  // השוואת רמות הכנסה
  const incomeLevelComparisons = compareAtIncomeLevels(
    INCOME_LEVELS,
    creditPoints,
    corpRunningCosts,
    isControllingOwner,
    salaryDividendMix,
  );

  // תחזית רב-שנתית
  const yearProjections = calculateMultiYearProjection(
    profit,
    annualGrowthRate,
    projectionYears,
    creditPoints,
    corpRunningCosts,
    isControllingOwner,
    salaryDividendMix,
  );

  // חישוב החזר על עלויות החברה
  const annualSavingAtCurrentProfit = Math.max(0, best.net - individual.netToOwner);
  const monthsToBreakEven =
    corpRunningCosts > 0 && annualSavingAtCurrentProfit > 0
      ? (corpRunningCosts / annualSavingAtCurrentProfit) * 12
      : null;

  return {
    individual,
    corporationDividend,
    corporationSalary,
    corporationMix,
    recommendation: best.key,
    taxSavingsVsIndividual: taxSavings,
    breakEvenProfit,
    incomeLevelComparisons,
    yearProjections,
    effectiveRatesSummary: {
      individual: individual.effectiveTaxRate,
      corpDividend: corporationDividend.effectiveTaxRate,
      corpSalary: corporationSalary.effectiveTaxRate,
      corpMix: corporationMix.effectiveTaxRate,
    },
    corpCostsPayback: {
      yearlySaving: annualSavingAtCurrentProfit,
      monthsToBreakEven,
    },
  };
}

// תאימות לאחור - ממשק ישן
export interface CorpVsIndividualInputLegacy {
  annualProfit: number;
  creditPoints: number;
}

export function calculateCorpVsIndividualLegacy(
  input: CorpVsIndividualInputLegacy,
): {
  individual: ScenarioResult;
  corporationDividend: ScenarioResult;
  corporationSalary: ScenarioResult;
  recommendation: 'individual' | 'corporationDividend' | 'corporationSalary' | 'corporationMix';
  taxSavingsVsIndividual: number;
  breakEvenProfit: number;
} {
  const result = calculateCorpVsIndividual({
    annualProfit: input.annualProfit,
    creditPoints: input.creditPoints,
    salaryDividendMix: 0.3,
    corpRunningCosts: 20_000,
    isControllingOwner: true,
    annualGrowthRate: 0.1,
    projectionYears: 5,
    includeStudyFundIndividual: false,
    includeStudyFundCorp: false,
    studyFundRateIndividual: 0.045,
  });

  const legacyRec =
    result.recommendation === 'corporationMix' ? 'corporationDividend' : result.recommendation;

  return {
    individual: result.individual,
    corporationDividend: result.corporationDividend,
    corporationSalary: result.corporationSalary,
    recommendation: legacyRec as 'individual' | 'corporationDividend' | 'corporationSalary',
    taxSavingsVsIndividual: result.taxSavingsVsIndividual,
    breakEvenProfit: result.breakEvenProfit,
  };
}

// ייצוא לשמירת תאימות לאחור - הממשק הישן עם אותו שם
export { calculateCorpVsIndividual as default };
