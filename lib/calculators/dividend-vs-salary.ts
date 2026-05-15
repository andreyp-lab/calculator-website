/**
 * דיבידנד vs משכורת - אופטימיזציית מס לבעל חברה בע"מ (2026)
 *
 * הבעיה: בעל חברה בע"מ צריך להחליט איך למשוך כסף מהחברה.
 *
 * אפשרות 1: משכורת
 *   - מס הכנסה לפי מדרגות (10%-50%)
 *   - ב.ל. עובד (4.27% / 12.17% עד תקרה)
 *   - ב.ל. מעסיק (4.51% / 7.6%)
 *   - הוצאה מוכרת לחברה (חוסך מס חברות 23%)
 *   - מאפשר הפקדות פנסיוניות + קרן השתלמות
 *
 * אפשרות 2: דיבידנד
 *   - מס חברות 23% על הרווח לפני
 *   - מס דיבידנד: 25% (רגיל) / 30% (בעל מניות מהותי)
 *   - מס יסף 3% על הכנסה > 721,560 ₪
 *   - אין ב.ל. על דיבידנד (חיסכון משמעותי)
 *   - לא מאפשר הפקדות פנסיוניות
 *
 * שיעור מס אפקטיבי מצרפי:
 *   - דיב' רגיל: 1 - (1-0.23)×(1-0.25) = 42.25%
 *   - דיב' מהותי (כולל מס יסף): 1 - (1-0.23)×(1-0.30) = 46.1% + ~2% מס יסף = ~48.1%
 *   - דיב' מהותי בסכומים נמוכים (ללא מס יסף): 23% + 0.77×30% = 46.1%
 *
 * מקורות: רשות המסים, ביטוח לאומי, פקודת מס הכנסה
 */

import { TAX_BRACKETS_2026, CREDIT_POINT_2026, SURTAX_2026 } from '@/lib/constants/tax-2026';

// ============================================================
// קבועי מס 2026
// ============================================================

export const CORP_TAX_2026 = 0.23; // מס חברות 2026
export const DIVIDEND_TAX_REGULAR = 0.25; // מס דיבידנד - בעל מניות לא מהותי
export const DIVIDEND_TAX_CONTROLLING = 0.30; // מס דיבידנד - בעל מניות מהותי (בעל שליטה)
export const SURTAX_RATE = 0.03; // מס יסף 3%
export const SURTAX_THRESHOLD = 721_560; // ₪/שנה - סף מס יסף

// ביטוח לאומי + בריאות - עובד שכיר
export const NI_LOW_MONTHLY = 7_522; // ₪/חודש - ספה לשיעור מופחת
export const NI_HIGH_MONTHLY = 51_910; // ₪/חודש - תקרת חיוב
export const NI_EMPLOYEE_LOW = 0.0427; // 4.27% - שיעור מופחת (עובד)
export const NI_EMPLOYEE_HIGH = 0.1217; // 12.17% - שיעור מלא (עובד)
export const NI_EMPLOYER_LOW = 0.0451; // 4.51% - שיעור מופחת (מעסיק)
export const NI_EMPLOYER_HIGH = 0.076; // 7.6% - שיעור מלא (מעסיק)

// פנסיה חובה - שיעורים ל-2026
export const PENSION_EMPLOYEE_RATE = 0.06; // 6% עובד
export const PENSION_EMPLOYER_RATE = 0.065; // 6.5% מעסיק
export const PENSION_SEVERANCE_RATE = 0.0833; // 8.33% פיצויים
export const PENSION_MAX_MONTHLY = 45_240; // ₪/חודש - תקרה פנסיה

// קרן השתלמות לבעלים-עובד
export const STUDY_FUND_EMPLOYER_RATE = 0.075; // 7.5% מעסיק
export const STUDY_FUND_EMPLOYEE_RATE = 0.025; // 2.5% עובד
export const STUDY_FUND_MAX_ANNUAL = 18_840; // ₪/שנה - תקרה פטורה ממס

// ============================================================
// טיפוסים
// ============================================================

export interface DividendVsSalaryInput {
  /** רווח שנתי של החברה (לפני משיכת בעלים) */
  companyAnnualProfit: number;
  /** סכום שצריך לבעלים לחיות עליו (שנתי) - לא בשימוש חישובי, לתצוגה */
  withdrawalNeeds: number;
  /** נקודות זיכוי (ברירת מחדל 2.25) */
  creditPoints: number;
  /** האם בעל מניות מהותי (10%+) - משפיע על שיעור מס דיבידנד */
  isMaterialShareholder: boolean;
  /** האם לחשב השפעת פנסיה וקרן השתלמות */
  includePension?: boolean;
  /** האם לחשב השפעת קרן השתלמות */
  includeStudyFund?: boolean;
  /** האם יש בן/בת זוג שיכול לקבל משכורת מהחברה */
  includeSpouseSalary?: boolean;
  /** משכורת חודשית לבן/בת זוג (₪) */
  spouseMonthlyGross?: number;
  /** נקודות זיכוי של בן/בת הזוג */
  spouseCreditPoints?: number;
}

export interface ScenarioBreakdown {
  /** משכורת ברוטו ששולמה לבעלים */
  grossSalary: number;
  /** דיבידנד שחולק */
  dividend: number;
  /** מס הכנסה אישי */
  incomeTax: number;
  /** ב.ל. עובד + מעסיק */
  socialSecurity: number;
  /** מס חברות */
  corporateTax: number;
  /** מס דיבידנד */
  dividendTax: number;
  /** מס יסף (על הכנסה מעל 721,560) */
  surtax: number;
  /** סה"כ מס שולם (כולל מס חברות) */
  totalTax: number;
  /** נטו לבעלים */
  netToOwner: number;
  /** רווח נצבר בחברה (לא חולק) */
  retainedEarnings: number;
  /** שיעור מס אפקטיבי מצרפי */
  effectiveTaxRate: number;
  /** חיסכון פנסיוני (הפקדת מעסיק) - יתרון עתידי */
  pensionEmployerContribution: number;
  /** חיסכון קרן השתלמות (חוסך מס) */
  studyFundTaxSaving: number;
  /** ב.ל. עובד בלבד (לפירוט) */
  employeeSocialSecurity: number;
  /** ב.ל. מעסיק בלבד (לפירוט) */
  employerSocialSecurity: number;
}

export interface MixScenario extends ScenarioBreakdown {
  /** אחוז ממשכורת מסך הרווח */
  salaryPct: number;
}

export interface SpouseOptimizationResult {
  /** נטו לבעלים - ללא בן/בת זוג */
  netWithoutSpouse: number;
  /** נטו לבעלים + בן/בת זוג - יחד */
  netWithSpouse: number;
  /** חיסכון מס שנתי בזכות בן/בת זוג */
  annualTaxSaving: number;
  /** משכורת נטו של בן/בת הזוג */
  spouseNetSalary: number;
  /** עלות מעסיק לחברה */
  spouseEmployerCost: number;
}

export interface LongTermProjection {
  years: number;
  /** נטו מצטבר - אסטרטגיית אופטימום */
  cumulativeNetOptimal: number;
  /** נטו מצטבר - הכל משכורת */
  cumulativeNetSalary: number;
  /** נטו מצטבר - הכל דיבידנד */
  cumulativeNetDividend: number;
  /** שווי קרן פנסיה (בשנה h) */
  pensionFundValue: number;
  /** חיסכון בפנסיה לעומת מסלול דיבידנד */
  pensionAdvantage: number;
}

export interface SensitivityPoint {
  corpTax: number;
  divTax: number;
  netDividend: number;
  netOptimal: number;
  recommendation: 'salary' | 'dividend' | 'mixed';
}

export interface DividendVsSalaryResult {
  /** משיכת הכל כמשכורת */
  allSalary: ScenarioBreakdown;
  /** משיכת הכל כדיבידנד */
  allDividend: ScenarioBreakdown;
  /** משיכה מעורבת אופטימלית */
  optimal: MixScenario;
  /** המלצה */
  recommendation: 'allSalary' | 'allDividend' | 'optimal';
  /** חיסכון מס שנתי לעומת אסטרטגיית הכל-משכורת */
  taxSavings: number;
  /** כל תרחישי המיקס (0%, 10%, ..., 100% משכורת) */
  allMixes: MixScenario[];
  /** אופטימיזציית בן/בת זוג (אם הוזן) */
  spouseOptimization?: SpouseOptimizationResult;
  /** תחזית ארוכת טווח */
  longTermProjection: LongTermProjection[];
  /** ניתוח רגישות - מה קורה אם ישתנו שיעורי מס */
  sensitivityAnalysis: SensitivityPoint[];
}

// ============================================================
// פונקציות עזר
// ============================================================

/** חישוב מס הכנסה שנתי (לפני זיכויים) */
function calcRawIncomeTax(income: number): number {
  let remaining = income;
  let tax = 0;
  let prev = 0;
  for (const b of TAX_BRACKETS_2026) {
    if (remaining <= 0) break;
    const sz = b.upTo - prev;
    const t = Math.min(remaining, sz);
    tax += t * b.rate;
    remaining -= t;
    prev = b.upTo;
  }
  return tax;
}

/** חישוב מס הכנסה שנתי נטו (אחרי ניכוי נקודות זיכוי) */
export function calcIncomeTax(income: number, creditPoints: number): number {
  const raw = calcRawIncomeTax(income);
  const creditAmount = creditPoints * CREDIT_POINT_2026.annual;
  return Math.max(0, raw - creditAmount);
}

/** ב.ל. עובד שנתי */
export function calcEmployeeSS(grossSalary: number): number {
  const lowAnnual = NI_LOW_MONTHLY * 12;
  const highAnnual = NI_HIGH_MONTHLY * 12;
  const capped = Math.min(grossSalary, highAnnual);
  if (capped <= lowAnnual) return capped * NI_EMPLOYEE_LOW;
  return lowAnnual * NI_EMPLOYEE_LOW + (capped - lowAnnual) * NI_EMPLOYEE_HIGH;
}

/** ב.ל. מעסיק שנתי */
export function calcEmployerSS(grossSalary: number): number {
  const lowAnnual = NI_LOW_MONTHLY * 12;
  const highAnnual = NI_HIGH_MONTHLY * 12;
  const capped = Math.min(grossSalary, highAnnual);
  if (capped <= lowAnnual) return capped * NI_EMPLOYER_LOW;
  return lowAnnual * NI_EMPLOYER_LOW + (capped - lowAnnual) * NI_EMPLOYER_HIGH;
}

/** מס יסף על הכנסה אישית (לא הכנסה הונית) מעל 721,560 */
export function calcSurtaxOnIncome(annualIncome: number): number {
  if (annualIncome <= SURTAX_THRESHOLD) return 0;
  return (annualIncome - SURTAX_THRESHOLD) * SURTAX_RATE;
}

/** מס יסף על דיבידנד (הכנסה הונית) - 3% על הסכום שמעל הסף */
export function calcSurtaxOnDividend(dividend: number, alreadyIncome: number): number {
  // הסף הוא משולב: הכנסה אישית + דיבידנד
  const combined = alreadyIncome + dividend;
  if (combined <= SURTAX_THRESHOLD) return 0;
  const taxableAbove = combined - Math.max(alreadyIncome, SURTAX_THRESHOLD);
  return Math.max(0, taxableAbove) * SURTAX_RATE;
}

/** חישוב הפקדות פנסיה (מעסיק) - שנתי */
function calcPensionEmployer(grossSalary: number): number {
  const pensionBase = Math.min(grossSalary / 12, PENSION_MAX_MONTHLY) * 12;
  return pensionBase * PENSION_EMPLOYER_RATE;
}

/** חיסכון מס של קרן השתלמות לבעלים-עובד */
function calcStudyFundTaxSaving(grossSalary: number, creditPoints: number): number {
  const employerContrib = Math.min(grossSalary * STUDY_FUND_EMPLOYER_RATE, STUDY_FUND_MAX_ANNUAL);
  // החלק הפטור ממס - 7.5% מהמשכורת (עד תקרה)
  // חיסכון = ההפקדה × שיעור המס השולי
  const marginalRate = calcMarginalTaxRate(grossSalary, creditPoints);
  return employerContrib * marginalRate;
}

/** שיעור מס שולי על משכורת נתונה */
function calcMarginalTaxRate(grossSalary: number, _creditPoints: number): number {
  // מוצא את מדרגת המס של הגרוס הזה
  let prev = 0;
  for (const b of TAX_BRACKETS_2026) {
    if (grossSalary <= b.upTo) {
      // בדוק אם יש מס יסף
      const annual = grossSalary;
      if (annual > SURTAX_THRESHOLD) return b.rate + SURTAX_RATE;
      return b.rate;
    }
    prev = b.upTo;
  }
  return 0.5; // מעל כל המדרגות
}

// ============================================================
// תרחישים
// ============================================================

/** תרחיש "הכל משכורת" */
function scenarioAllSalary(
  profit: number,
  creditPoints: number,
  includePension: boolean,
  includeStudyFund: boolean,
): ScenarioBreakdown {
  // נחפש gross שב: gross + employerSS(gross) + [pensionEmployer(gross)] = profit
  // שיטה: איטרציה
  let gross = profit / 1.12; // קירוב ראשון
  for (let i = 0; i < 10; i++) {
    const empSS = calcEmployerSS(gross);
    const pensionEmp = includePension ? calcPensionEmployer(gross) : 0;
    gross = profit - empSS - pensionEmp;
    if (gross < 0) { gross = 0; break; }
  }
  gross = Math.max(0, gross);

  const empSS = calcEmployerSS(gross);
  const eeSS = calcEmployeeSS(gross);
  const incTax = calcIncomeTax(gross, creditPoints);
  const surtax = calcSurtaxOnIncome(gross);
  const pensionEmployer = includePension ? calcPensionEmployer(gross) : 0;
  const studyFundTaxSaving = includeStudyFund ? calcStudyFundTaxSaving(gross, creditPoints) : 0;

  const totalTax = empSS + eeSS + incTax + surtax;
  const net = gross - eeSS - incTax - surtax;

  return {
    grossSalary: gross,
    dividend: 0,
    incomeTax: incTax,
    socialSecurity: empSS + eeSS,
    employeeSocialSecurity: eeSS,
    employerSocialSecurity: empSS,
    corporateTax: 0,
    dividendTax: 0,
    surtax,
    totalTax,
    netToOwner: net,
    retainedEarnings: 0,
    effectiveTaxRate: profit > 0 ? totalTax / profit : 0,
    pensionEmployerContribution: pensionEmployer,
    studyFundTaxSaving,
  };
}

/** תרחיש "הכל דיבידנד" */
function scenarioAllDividend(
  profit: number,
  isMaterial: boolean,
): ScenarioBreakdown {
  const corpTax = profit * CORP_TAX_2026;
  const afterCorpTax = profit - corpTax;
  const baseDivRate = isMaterial ? DIVIDEND_TAX_CONTROLLING : DIVIDEND_TAX_REGULAR;

  // מס יסף על דיבידנד מעל הסף
  const surtaxOnDiv = calcSurtaxOnDividend(afterCorpTax, 0);
  const effectiveDivRate = baseDivRate;
  const divTax = afterCorpTax * effectiveDivRate;
  const net = afterCorpTax - divTax - surtaxOnDiv;

  return {
    grossSalary: 0,
    dividend: afterCorpTax,
    incomeTax: 0,
    socialSecurity: 0,
    employeeSocialSecurity: 0,
    employerSocialSecurity: 0,
    corporateTax: corpTax,
    dividendTax: divTax,
    surtax: surtaxOnDiv,
    totalTax: corpTax + divTax + surtaxOnDiv,
    netToOwner: net,
    retainedEarnings: 0,
    effectiveTaxRate: profit > 0 ? (corpTax + divTax + surtaxOnDiv) / profit : 0,
    pensionEmployerContribution: 0,
    studyFundTaxSaving: 0,
  };
}

/** תרחיש מעורב - משכורת X ₪ + יתרה כדיבידנד */
function scenarioMixed(
  profit: number,
  salaryAmount: number,
  creditPoints: number,
  isMaterial: boolean,
  includePension: boolean,
  includeStudyFund: boolean,
): ScenarioBreakdown {
  const empSS = calcEmployerSS(salaryAmount);
  const pensionEmp = includePension ? calcPensionEmployer(salaryAmount) : 0;
  const totalSalaryCost = salaryAmount + empSS + pensionEmp;

  if (totalSalaryCost > profit + 1) {
    return {
      grossSalary: 0,
      dividend: 0,
      incomeTax: 0,
      socialSecurity: 0,
      employeeSocialSecurity: 0,
      employerSocialSecurity: 0,
      corporateTax: 0,
      dividendTax: 0,
      surtax: 0,
      totalTax: profit,
      netToOwner: 0,
      retainedEarnings: 0,
      effectiveTaxRate: 1,
      pensionEmployerContribution: 0,
      studyFundTaxSaving: 0,
    };
  }

  const eeSS = calcEmployeeSS(salaryAmount);
  const incTax = calcIncomeTax(salaryAmount, creditPoints);
  const surtaxSalary = calcSurtaxOnIncome(salaryAmount);

  const remainingForDiv = profit - totalSalaryCost;
  const corpTax = remainingForDiv * CORP_TAX_2026;
  const afterCorpTax = remainingForDiv - corpTax;
  const baseDivRate = isMaterial ? DIVIDEND_TAX_CONTROLLING : DIVIDEND_TAX_REGULAR;
  const divTax = afterCorpTax * baseDivRate;
  const surtaxDiv = calcSurtaxOnDividend(afterCorpTax, salaryAmount);

  const totalTax = empSS + eeSS + incTax + surtaxSalary + corpTax + divTax + surtaxDiv;
  const net = (salaryAmount - eeSS - incTax - surtaxSalary) + (afterCorpTax - divTax - surtaxDiv);

  const studyFundTaxSaving = includeStudyFund ? calcStudyFundTaxSaving(salaryAmount, creditPoints) : 0;

  return {
    grossSalary: salaryAmount,
    dividend: afterCorpTax,
    incomeTax: incTax,
    socialSecurity: empSS + eeSS,
    employeeSocialSecurity: eeSS,
    employerSocialSecurity: empSS,
    corporateTax: corpTax,
    dividendTax: divTax,
    surtax: surtaxSalary + surtaxDiv,
    totalTax,
    netToOwner: net,
    retainedEarnings: 0,
    effectiveTaxRate: profit > 0 ? totalTax / profit : 0,
    pensionEmployerContribution: includePension ? calcPensionEmployer(salaryAmount) : 0,
    studyFundTaxSaving,
  };
}

// ============================================================
// מציאת האופטימום
// ============================================================

/**
 * סריקה מלאה של כל אפשרויות המיקס (0%-100% משכורת, צעדים של 5K ₪)
 * מחזיר מערך מסודר של כל המיקסים
 */
export function calculateAllMixes(
  profit: number,
  creditPoints: number,
  isMaterial: boolean,
  includePension = false,
  includeStudyFund = false,
): MixScenario[] {
  const mixes: MixScenario[] = [];

  // צעדים: כל 5,000 ₪ משכורת
  const step = 5_000;
  // גם בדוק נקודות קצה של מדרגות מס
  const bracketBoundaries = [
    0,
    7_010 * 12,  // 84,120 - סוף מדרגה 10%
    10_060 * 12, // 120,720 - סוף מדרגה 14%
    19_000 * 12, // 228,000 - סוף מדרגה 20%
    25_100 * 12, // 301,200 - סוף מדרגה 31%
    46_690 * 12, // 560,280 - סוף מדרגה 35%
    60_130 * 12, // 721,560 - סוף מדרגה 47%
  ];

  const candidates = new Set<number>();

  // צעדים קטנים
  for (let salary = 0; salary <= profit / 1.045; salary += step) {
    candidates.add(salary);
  }

  // נקודות קצה של מדרגות
  for (const b of bracketBoundaries) {
    if (b <= profit) candidates.add(b);
    // גם מעט מתחת לכל מדרגה
    if (b - 1 >= 0 && b - 1 <= profit) candidates.add(b - 1);
  }

  // גם 100% משכורת
  const maxGross = profit / 1.076;
  candidates.add(maxGross);

  for (const salary of Array.from(candidates).sort((a, b) => a - b)) {
    const sc = scenarioMixed(profit, salary, creditPoints, isMaterial, includePension, includeStudyFund);
    const pct = profit > 0 ? (salary / profit) * 100 : 0;
    mixes.push({ ...sc, salaryPct: pct });
  }

  return mixes;
}

/**
 * מוצא את המיקס האופטימלי (ממקסם netToOwner)
 */
export function findOptimalMix(
  profit: number,
  creditPoints: number,
  isMaterial: boolean,
  includePension = false,
  includeStudyFund = false,
): MixScenario {
  const mixes = calculateAllMixes(profit, creditPoints, isMaterial, includePension, includeStudyFund);

  let best = mixes[0];
  for (const m of mixes) {
    if (m.netToOwner > best.netToOwner) best = m;
  }
  return best;
}

// ============================================================
// אופטימיזציית בן/בת זוג
// ============================================================

/**
 * חישוב חיסכון מס בשכר בן/בת זוג
 * הרעיון: חברה משלמת משכורת לבן/בת זוג - מפזר הכנסה ומנצל מדרגות נמוכות
 */
export function calculateSpouseOptimization(
  profit: number,
  creditPoints: number,
  isMaterial: boolean,
  spouseMonthlyGross: number,
  spouseCreditPoints: number,
): SpouseOptimizationResult {
  const spouseAnnualGross = spouseMonthlyGross * 12;
  const spouseEmpSS = calcEmployerSS(spouseAnnualGross);
  const spouseEmployerCost = spouseAnnualGross + spouseEmpSS;

  // בלי בן/בת זוג - בעלים לוקח הכל
  const withoutSpouseOptimal = findOptimalMix(profit, creditPoints, isMaterial);

  // עם בן/בת זוג - רווח החברה קטן בעלות המעסיק, בעלים לוקח פחות
  const profitAfterSpouse = Math.max(0, profit - spouseEmployerCost);
  const withSpouseOptimal = findOptimalMix(profitAfterSpouse, creditPoints, isMaterial);

  // נטו של בן/בת זוג
  const spouseEeSS = calcEmployeeSS(spouseAnnualGross);
  const spouseIncomeTax = calcIncomeTax(spouseAnnualGross, spouseCreditPoints);
  const spouseNet = spouseAnnualGross - spouseEeSS - spouseIncomeTax;

  const netWithSpouse = withSpouseOptimal.netToOwner + spouseNet;
  const netWithoutSpouse = withoutSpouseOptimal.netToOwner;

  return {
    netWithoutSpouse,
    netWithSpouse,
    annualTaxSaving: netWithSpouse - netWithoutSpouse,
    spouseNetSalary: spouseNet,
    spouseEmployerCost,
  };
}

// ============================================================
// תחזית ארוכת טווח
// ============================================================

const ANNUAL_RETURN_RATE = 0.07; // תשואה שנתית ממוצעת על פנסיה

/**
 * תחזית ארוכת טווח על הצטברות הון וחיסכון פנסיוני
 */
export function calculateLongTermProjection(
  profit: number,
  creditPoints: number,
  isMaterial: boolean,
  years = 20,
): LongTermProjection[] {
  const optimal = findOptimalMix(profit, creditPoints, isMaterial, true, false);
  const allSalary = scenarioAllSalary(profit, creditPoints, true, false);
  const allDividend = scenarioAllDividend(profit, isMaterial);

  const projections: LongTermProjection[] = [];

  let pensionFund = 0;

  for (let y = 1; y <= years; y++) {
    // הגדל קרן פנסיה: הפקדות + תשואה
    pensionFund = (pensionFund + optimal.pensionEmployerContribution) * (1 + ANNUAL_RETURN_RATE);

    projections.push({
      years: y,
      cumulativeNetOptimal: optimal.netToOwner * y,
      cumulativeNetSalary: allSalary.netToOwner * y,
      cumulativeNetDividend: allDividend.netToOwner * y,
      pensionFundValue: pensionFund,
      pensionAdvantage: pensionFund,
    });
  }

  return projections;
}

// ============================================================
// ניתוח רגישות
// ============================================================

/**
 * ניתוח רגישות - מה קורה אם שיעורי מס ישתנו?
 */
export function calculateSensitivityAnalysis(
  profit: number,
  creditPoints: number,
): SensitivityPoint[] {
  const points: SensitivityPoint[] = [];

  // שינויים במס חברות: 20%, 23%, 25%, 28%
  const corpTaxRates = [0.20, 0.23, 0.25, 0.28];
  // שינויים במס דיבידנד לבעל מניות מהותי: 25%, 28%, 30%, 33%
  const divTaxRates = [0.25, 0.28, 0.30, 0.33];

  for (const corpTax of corpTaxRates) {
    for (const divTax of divTaxRates) {
      // דיבידנד מלא
      const afterCorpTax = profit * (1 - corpTax);
      const netDividend = afterCorpTax * (1 - divTax);

      // אופטימום - משכורת בסיסית + דיבידנד (קירוב)
      const baseSalary = Math.min(profit * 0.25, 19_000 * 12);
      const empSS = calcEmployerSS(baseSalary);
      const eeSS = calcEmployeeSS(baseSalary);
      const incTax = calcIncomeTax(baseSalary, creditPoints);
      const remainingDiv = profit - baseSalary - empSS;
      const netFromSalary = baseSalary - eeSS - incTax;
      const netFromDiv = remainingDiv > 0 ? remainingDiv * (1 - corpTax) * (1 - divTax) : 0;
      const netOptimal = netFromSalary + netFromDiv;

      let recommendation: 'salary' | 'dividend' | 'mixed';
      if (netOptimal > netDividend && netOptimal > calcIncomeTax(profit, creditPoints)) {
        recommendation = 'mixed';
      } else if (netDividend > netOptimal) {
        recommendation = 'dividend';
      } else {
        recommendation = 'salary';
      }

      points.push({ corpTax, divTax, netDividend, netOptimal, recommendation });
    }
  }

  return points;
}

// ============================================================
// פונקציה ראשית
// ============================================================

export function calculateDividendVsSalary(
  input: DividendVsSalaryInput,
): DividendVsSalaryResult {
  const profit = Math.max(0, input.companyAnnualProfit);
  const cp = Math.max(0, input.creditPoints);
  const isMaterial = input.isMaterialShareholder;
  const includePension = input.includePension ?? false;
  const includeStudyFund = input.includeStudyFund ?? false;

  const allSalary = scenarioAllSalary(profit, cp, includePension, includeStudyFund);
  const allDividend = scenarioAllDividend(profit, isMaterial);

  // מציאת אופטימום - סריקה מלאה
  const allMixesArr = calculateAllMixes(profit, cp, isMaterial, includePension, includeStudyFund);
  let best = allMixesArr[0] ?? { ...allSalary, salaryPct: 100 };
  for (const m of allMixesArr) {
    if (m.netToOwner > best.netToOwner) best = m;
  }
  const optimal = best;

  // אופטימיזציית בן/בת זוג
  let spouseOptimization: SpouseOptimizationResult | undefined;
  if (input.includeSpouseSalary && input.spouseMonthlyGross && input.spouseMonthlyGross > 0) {
    spouseOptimization = calculateSpouseOptimization(
      profit,
      cp,
      isMaterial,
      input.spouseMonthlyGross,
      input.spouseCreditPoints ?? 2.25,
    );
  }

  // תחזית ארוכת טווח
  const longTermProjection = calculateLongTermProjection(profit, cp, isMaterial, 20);

  // ניתוח רגישות
  const sensitivityAnalysis = calculateSensitivityAnalysis(profit, cp);

  // המלצה
  const scenarios = [
    { key: 'allSalary' as const, net: allSalary.netToOwner },
    { key: 'allDividend' as const, net: allDividend.netToOwner },
    { key: 'optimal' as const, net: optimal.netToOwner },
  ];
  const bestScenario = scenarios.reduce((max, s) => (s.net > max.net ? s : max));

  return {
    allSalary,
    allDividend,
    optimal,
    recommendation: bestScenario.key,
    taxSavings: Math.max(0, bestScenario.net - allSalary.netToOwner),
    allMixes: allMixesArr,
    spouseOptimization,
    longTermProjection,
    sensitivityAnalysis,
  };
}
