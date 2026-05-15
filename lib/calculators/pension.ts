/**
 * מחשבון פנסיה מקיפה - ישראל 2026
 *
 * מקורות:
 * - צו הרחבה לפנסיה חובה (2008, עדכון 2016, 2020)
 * - רשות שוק ההון, ביטוח וחיסכון
 * - מסלקה פנסיונית מרכזית (maslaka.org.il)
 * - חוק מס הכנסה - סעיפים 45א, 47
 */

// ============================================================
// קבועים 2026
// ============================================================

export const PENSION_CONSTANTS_2026 = {
  // שכר ממוצע במשק (APW) - בסיס לחישוב תקרות (ינואר 2026)
  averageWage: 12_547,

  // תקרת שכר להפרשות מוכרות (פי 4 ממוצע) - ~50,188 ₪
  pensionCeiling: 50_188,

  // שיעורי הפרשה מינימום (צו הרחבה)
  minContribRates: {
    employee: 6,      // %
    employer: 6.5,    // %
    severance: 6,     // %
    total: 18.5,      // %
  },

  // שיעורי הפרשה מקסימום להטבת מס
  maxContribRates: {
    employee: 7,      // %
    employer: 7.5,    // %
    severance: 8.33,  // %
    total: 22.83,     // %
  },

  // מקדמי המרה 2026 (לפי גיל פרישה, ללא שאיר)
  conversionFactors: {
    60: 232,
    62: 224,
    65: 213,
    67: 205,
    68: 200,
    70: 190,
    72: 180,
  } as Record<number, number>,

  // מקדם עם קצבת שאיר 60%
  conversionFactorsWithSpouse: {
    60: 252,
    62: 243,
    65: 230,
    67: 221,
    68: 215,
    70: 204,
    72: 193,
  } as Record<number, number>,

  // תקרת פטור ממס קצבה (סעיף 9א) - לפנסיונרים מגיל 67+
  // ~52% מהקצבה פטורה עד תקרה
  pensionTaxExemptionPct: 52, // %
  pensionTaxExemptionCeiling: 9_430, // ₪/חודש (תקרת הפטור 2026)

  // ניכוי ב.ל.ל לזכאי פנסיה
  nationalInsurancePension: {
    single: 3_465,    // ₪/חודש (זקנה יחיד 2026)
    couple: 5_090,    // ₪/חודש (זוג)
    deferred: 3_800,  // עם דחיית גיל (גיל 70+)
  },

  // קרן השתלמות - מקסימום הפקדה מוטבת (2026)
  studyFundEmployerLimit: 10_680,   // ₪ שנתי (4.5% × 240K ÷ 12)
  studyFundEmployeeLimit: 3_560,    // ₪ שנתי (1.5%)
  studyFundEmployerPct: 7.5,        // % מקסימום
  studyFundEmployeePct: 2.5,        // % (תורם לטובת)

  // אינפלציה ממוצעת היסטורית
  defaultInflation: 2.5, // %

  // שנת פרישה לגבר/אישה
  retirementAgeMan: 67,
  retirementAgeWoman: 65,
} as const;

// ============================================================
// סוגי קרנות פנסיה
// ============================================================

export type PensionFundType =
  | 'comprehensive'   // קרן פנסיה מקיפה
  | 'managers'        // ביטוח מנהלים
  | 'provident'       // קופת גמל לתגמולים
  | 'study_fund'      // קרן השתלמות
  | 'national_ins';   // ביטוח לאומי (קצבת זקנה)

export type SpouseOption = 'none' | '40pct' | '60pct' | '100pct';

// ============================================================
// טיפוסי קלט
// ============================================================

export interface PensionSourceInput {
  id: string;
  label: string;              // שם חופשי (קרן X, עבודה ב-Y)
  fundType: PensionFundType;
  currentBalance: number;     // צבירה נוכחית (₪)
  monthlySalary: number;      // שכר ברוטו (₪/חודש)
  employeeContrib: number;    // % הפקדת עובד
  employerContrib: number;    // % הפרשת מעסיק (קצבה)
  severanceContrib: number;   // % הפרשת פיצויים
  managementFeeAccum: number; // % דמי ניהול מצבירה (0-1.5%)
  managementFeeContrib: number; // % דמי ניהול מהפקדה (0-6%)
  expectedReturn: number;     // % תשואה שנתית (לפני דמי ניהול)
  yearsContributing: number;  // שנות הפקדה נותרות עד פרישה
  isActive: boolean;          // האם עדיין מפקיד?
}

export interface ComprehensivePensionInput {
  // פרטים אישיים
  currentAge: number;
  retirementAge: number;
  gender: 'male' | 'female';
  maritalStatus: 'single' | 'married' | 'divorced' | 'widowed';
  spouseAge?: number;
  inflationRate: number;        // % אינפלציה שנתית

  // מקורות פנסיה
  sources: PensionSourceInput[];

  // קצבת ב.ל.ל
  includNationalIns: boolean;
  nationalInsAmount: number;    // ₪/חודש

  // קרן השתלמות (כהשלמה בפרישה)
  studyFundBalance: number;     // ₪
  studyFundReturn: number;      // %
  studyFundYearsLeft: number;   // שנות הפקדה עד פרישה
  studyFundMonthlySalary: number;
  studyFundEmployerPct: number;
  studyFundEmployeePct: number;

  // אפשרויות
  spouseOption: SpouseOption;   // בחירת קצבת שאיר
  conversionFactor?: number;    // מקדם מרה ידני (0 = אוטומטי)
  lumpSumFromSeverance: boolean; // לקחת פיצויים כסכום חד-פעמי

  // יעד
  targetMonthlyIncome: number;  // ₪/חודש (קצבה רצויה בפרישה)
}

// ============================================================
// טיפוסי פלט
// ============================================================

export interface PensionSourceResult {
  id: string;
  label: string;
  fundType: PensionFundType;
  finalBalance: number;           // צבירה בפרישה
  monthlyPension: number;         // קצבה חודשית מקור זה
  totalContributions: number;     // סך הפקדות
  totalGrowth: number;            // סך תשואה נטו
  effectiveReturn: number;        // תשואה אפקטיבית נטו מדמי ניהול
  monthlyContribution: number;    // הפרשה חודשית כוללת
  yearsContributing: number;
  realMonthlyPension: number;     // קצבה ריאלית (מוצמדת אינפלציה)
}

export interface PensionYearlyDataPoint {
  year: number;
  age: number;
  totalBalance: number;           // צבירה כוללת כל המקורות
  annualContributions: number;    // הפרשות השנה
  annualGrowth: number;           // תשואה השנה
  projectedMonthlyPension: number; // אם הייתי פורש עכשיו
  bySource: Record<string, number>; // צבירה לפי מקור
}

export interface TaxAnalysis {
  grossMonthlyPension: number;    // קצבה ברוטו
  taxExemptAmount: number;        // סכום פטור ממס
  taxableAmount: number;          // סכום חייב
  estimatedMonthlyTax: number;    // מס חודשי מוערך
  effectiveTaxRate: number;       // אחוז מס אפקטיבי
  netMonthlyPension: number;      // קצבה נטו
  lumpSumSeveranceTax?: number;   // מס על פיצויים כסכום חד-פעמי
}

export interface GoalAnalysis {
  targetMonthlyIncome: number;    // יעד קצבה
  currentProjected: number;       // קצבה צפויה נוכחית
  gap: number;                    // פער (חיובי = חסר)
  gapPct: number;                 // פער כ-%
  requiredAdditionalMonthly: number; // כמה להוסיף כדי לסגור פער
  yearsToReachTarget: number;     // כמה שנים אם מגדיל ב-1%
  recommendations: string[];      // המלצות
}

export interface ComprehensivePensionResult {
  // סיכום
  totalFinalBalance: number;      // צבירה כוללת
  totalMonthlyPension: number;    // קצבה חודשית ברוטו
  totalWithNationalIns: number;   // כולל ב.ל.ל
  yearsUntilRetirement: number;

  // ריאלי
  realMonthlyPension: number;     // קצבה ריאלית (מוצמדת)
  replacementRate: number;        // אחוז החלפת שכר

  // לפי מקורות
  sources: PensionSourceResult[];

  // קרן השתלמות
  studyFundFinalBalance: number;
  studyFundMonthlyEquivalent: number; // אם מחלקים ל-20 שנה

  // מיסוי
  taxAnalysis: TaxAnalysis;

  // יעד
  goalAnalysis: GoalAnalysis;

  // גרף שנתי
  yearlyData: PensionYearlyDataPoint[];

  // conversion factor used
  conversionFactor: number;

  // מקדם עם שאיר
  conversionFactorWithSpouse: number;
  monthlyPensionWithSpouse: number;

  // לפיצויים בנפרד
  severanceLumpSum?: number;
  severanceLumpSumNet?: number;
}

// ============================================================
// פונקציות עזר
// ============================================================

/**
 * חישוב מקדם המרה אוטומטי לפי גיל פרישה
 * ממלא בין ערכים ידועים בקירוב לינארי
 */
export function getConversionFactor(retirementAge: number, withSpouse = false): number {
  const factors = withSpouse
    ? PENSION_CONSTANTS_2026.conversionFactorsWithSpouse
    : PENSION_CONSTANTS_2026.conversionFactors;

  const ages = Object.keys(factors).map(Number).sort((a, b) => a - b);

  // מצא את הסביבה
  const lower = ages.filter((a) => a <= retirementAge).pop();
  const upper = ages.find((a) => a > retirementAge);

  if (lower === undefined) return factors[ages[0]];
  if (upper === undefined) return factors[ages[ages.length - 1]];
  if (lower === retirementAge) return factors[lower];

  // קירוב לינארי
  const t = (retirementAge - lower) / (upper - lower);
  return Math.round(factors[lower] + t * (factors[upper] - factors[lower]));
}

/**
 * חישוב תשואה אפקטיבית נטו מדמי ניהול
 * דמי ניהול מצבירה מורידים את התשואה האפקטיבית
 */
export function netEffectiveReturn(grossReturn: number, managementFeeAccum: number): number {
  return Math.max(0, grossReturn - managementFeeAccum);
}

/**
 * Future Value עם הפקדות חודשיות
 */
export function futureValue(
  pv: number,
  monthlyPmt: number,
  annualRate: number,
  years: number,
): number {
  if (years <= 0) return pv;
  const months = years * 12;
  const mr = annualRate / 100 / 12;
  if (mr === 0) return pv + monthlyPmt * months;

  const fvPV = pv * Math.pow(1 + mr, months);
  const fvPMT = monthlyPmt * ((Math.pow(1 + mr, months) - 1) / mr);
  return fvPV + fvPMT;
}

/**
 * חישוב מיסוי קצבה (סעיף 9א)
 * פנסיונרים 67+ זכאים לפטור חלקי
 */
export function calculatePensionTax(
  monthlyPension: number,
  age: number,
  includeSeveranceInAnnuity: boolean = true,
): TaxAnalysis {
  const annualPension = monthlyPension * 12;

  // פטור: 52% עד תקרה
  const exemptionCeilingMonthly = PENSION_CONSTANTS_2026.pensionTaxExemptionCeiling;
  const exemptionPct =
    age >= 67 ? PENSION_CONSTANTS_2026.pensionTaxExemptionPct / 100 : 0;

  const taxExemptMonthly = Math.min(monthlyPension * exemptionPct, exemptionCeilingMonthly);
  const taxableMonthly = Math.max(0, monthlyPension - taxExemptMonthly);
  const taxableAnnual = taxableMonthly * 12;

  // מדרגות מס הכנסה 2026 (ללא נקודות זיכוי)
  // נניח 2.25 נקודות זיכוי סטנדרטי = 2.25 × 242 × 12 = 6,534 ₪ זיכוי שנתי
  const standardCreditAnnual = 2.25 * 242 * 12;

  let tax = 0;
  const brackets = [
    { up: 84_120, rate: 0.1 },
    { up: 120_720, rate: 0.14 },
    { up: 193_800, rate: 0.2 },
    { up: 269_280, rate: 0.31 },
    { up: 560_280, rate: 0.35 },
    { up: Infinity, rate: 0.47 },
  ];

  let remaining = Math.max(0, taxableAnnual);
  let prevThreshold = 0;
  for (const bracket of brackets) {
    if (remaining <= 0) break;
    const chunkable = Math.min(remaining, bracket.up - prevThreshold);
    tax += chunkable * bracket.rate;
    remaining -= chunkable;
    prevThreshold = bracket.up;
  }

  // הפחת נקודות זיכוי
  tax = Math.max(0, tax - standardCreditAnnual);
  const monthlyTax = tax / 12;

  return {
    grossMonthlyPension: monthlyPension,
    taxExemptAmount: taxExemptMonthly,
    taxableAmount: taxableMonthly,
    estimatedMonthlyTax: monthlyTax,
    effectiveTaxRate: monthlyPension > 0 ? (monthlyTax / monthlyPension) * 100 : 0,
    netMonthlyPension: monthlyPension - monthlyTax,
    lumpSumSeveranceTax: includeSeveranceInAnnuity ? 0 : undefined,
  };
}

/**
 * חישוב קצבת שאירים
 */
export function calculateSpousePension(monthlyPension: number, option: SpouseOption): number {
  switch (option) {
    case 'none':
      return 0;
    case '40pct':
      return monthlyPension * 0.4;
    case '60pct':
      return monthlyPension * 0.6;
    case '100pct':
      return monthlyPension;
    default:
      return monthlyPension * 0.6;
  }
}

/**
 * חישוב צבירה שנתית (עבור גרף)
 */
function buildYearlyData(
  sources: PensionSourceInput[],
  yearsUntilRetirement: number,
  currentAge: number,
): PensionYearlyDataPoint[] {
  const data: PensionYearlyDataPoint[] = [];

  // מצב נוכחי של כל מקור
  const balances: Record<string, number> = {};
  sources.forEach((s) => {
    balances[s.id] = s.currentBalance;
  });

  for (let y = 0; y <= yearsUntilRetirement; y++) {
    const bySource: Record<string, number> = {};
    let totalBalance = 0;
    let annualContributions = 0;
    let annualGrowth = 0;

    sources.forEach((s) => {
      const isActive = s.isActive && y < s.yearsContributing;
      const monthlyContrib = isActive
        ? s.monthlySalary * ((s.employeeContrib + s.employerContrib) / 100)
        : 0;
      const effectiveR = netEffectiveReturn(s.expectedReturn, s.managementFeeAccum);
      const mr = effectiveR / 100 / 12;

      if (y === 0) {
        bySource[s.id] = s.currentBalance;
      } else {
        const prevBal = bySource[s.id] ?? balances[s.id];
        const growth = prevBal * (effectiveR / 100);
        const contribs = monthlyContrib * 12;
        bySource[s.id] = prevBal + growth + contribs;
        annualContributions += contribs;
        annualGrowth += growth;
      }
      totalBalance += bySource[s.id];
    });

    // קצבה אם פורשים עכשיו
    const age = currentAge + y;
    const cf = getConversionFactor(Math.max(60, age));
    const projectedPension = cf > 0 ? totalBalance / cf : 0;

    data.push({
      year: y,
      age,
      totalBalance,
      annualContributions,
      annualGrowth,
      projectedMonthlyPension: projectedPension,
      bySource,
    });

    // עדכן יתרות לשנה הבאה
    Object.assign(balances, bySource);
  }

  return data;
}

/**
 * חישוב מקיף לכל מקור
 */
function calculateSourceResult(
  source: PensionSourceInput,
  conversionFactor: number,
  inflationRate: number,
  yearsUntilRetirement: number,
): PensionSourceResult {
  const effectiveReturn = netEffectiveReturn(source.expectedReturn, source.managementFeeAccum);

  const totalContribPct =
    (source.employeeContrib + source.employerContrib + source.severanceContrib) / 100;
  const monthlyContribution = source.monthlySalary * totalContribPct;

  // הפקדות - רק בשנות הפעילות
  const activeYears = source.isActive
    ? Math.min(source.yearsContributing, yearsUntilRetirement)
    : 0;
  const passiveYears = yearsUntilRetirement - activeYears;

  // FV של הצבירה הנוכחית לכל תקופה
  const fvCurrentActive = futureValue(source.currentBalance, monthlyContribution, effectiveReturn, activeYears);
  const fvCurrent = passiveYears > 0
    ? futureValue(fvCurrentActive, 0, effectiveReturn, passiveYears)
    : fvCurrentActive;

  const totalContributions = monthlyContribution * activeYears * 12;
  const totalGrowth = fvCurrent - source.currentBalance - totalContributions;

  const monthlyPension = conversionFactor > 0 ? fvCurrent / conversionFactor : 0;

  // ריאלי: הקצבה בכוח קנייה של היום
  const inflationFactor = Math.pow(1 + inflationRate / 100, yearsUntilRetirement);
  const realMonthlyPension = inflationFactor > 0 ? monthlyPension / inflationFactor : monthlyPension;

  return {
    id: source.id,
    label: source.label,
    fundType: source.fundType,
    finalBalance: fvCurrent,
    monthlyPension,
    totalContributions,
    totalGrowth,
    effectiveReturn,
    monthlyContribution,
    yearsContributing: activeYears,
    realMonthlyPension,
  };
}

// ============================================================
// פונקציה ראשית
// ============================================================

export function calculateComprehensivePension(
  input: ComprehensivePensionInput,
): ComprehensivePensionResult {
  const {
    currentAge,
    retirementAge,
    inflationRate,
    sources,
    includNationalIns,
    nationalInsAmount,
    studyFundBalance,
    studyFundReturn,
    studyFundYearsLeft,
    studyFundMonthlySalary,
    studyFundEmployerPct,
    studyFundEmployeePct,
    spouseOption,
    conversionFactor: customCF,
    lumpSumFromSeverance,
    targetMonthlyIncome,
  } = input;

  const yearsUntilRetirement = Math.max(0, retirementAge - currentAge);

  // מקדמי המרה
  const conversionFactor =
    customCF && customCF > 0 ? customCF : getConversionFactor(retirementAge, false);
  const conversionFactorWithSpouse =
    spouseOption !== 'none'
      ? getConversionFactor(retirementAge, true)
      : conversionFactor;

  // חישוב לפי מקורות
  const sourceResults = sources.map((s) =>
    calculateSourceResult(s, conversionFactor, inflationRate, yearsUntilRetirement),
  );

  const totalFinalBalance = sourceResults.reduce((sum, s) => sum + s.finalBalance, 0);
  const totalMonthlyPension = sourceResults.reduce((sum, s) => sum + s.monthlyPension, 0);

  // קצבה עם שאיר (מקדם גבוה יותר = קצבה נמוכה יותר)
  const monthlyPensionWithSpouse =
    spouseOption !== 'none' && conversionFactorWithSpouse > 0
      ? totalFinalBalance / conversionFactorWithSpouse
      : totalMonthlyPension;

  // קרן השתלמות
  const studyFundMonthlyContrib =
    studyFundMonthlySalary * ((studyFundEmployerPct + studyFundEmployeePct) / 100);
  const studyFundActiveYears = Math.min(studyFundYearsLeft, yearsUntilRetirement);
  const studyFundFinalBalance = futureValue(
    studyFundBalance,
    studyFundMonthlyContrib,
    studyFundReturn,
    studyFundActiveYears,
  );
  // חלוקה על 20 שנה (240 חודשים) כקצבה
  const studyFundMonthlyEquivalent = studyFundFinalBalance / 240;

  // ב.ל.ל
  const nationalInsMonthly = includNationalIns ? nationalInsAmount : 0;
  const totalWithNationalIns = totalMonthlyPension + nationalInsMonthly;

  // ריאלי
  const inflationFactor = Math.pow(1 + inflationRate / 100, yearsUntilRetirement);
  const realMonthlyPension =
    inflationFactor > 0 ? totalMonthlyPension / inflationFactor : totalMonthlyPension;

  // החלפת שכר - ביחס לממוצע שכר של כל המקורות הפעילים
  const avgSalary =
    sources.length > 0
      ? sources.reduce((sum, s) => sum + s.monthlySalary, 0) / sources.length
      : 1;
  const replacementRate = avgSalary > 0 ? (totalMonthlyPension / avgSalary) * 100 : 0;

  // מיסוי
  const taxAnalysis = calculatePensionTax(totalMonthlyPension, retirementAge, !lumpSumFromSeverance);

  // פיצויים כסכום חד-פעמי
  let severanceLumpSum: number | undefined;
  let severanceLumpSumNet: number | undefined;
  if (lumpSumFromSeverance) {
    severanceLumpSum = sourceResults.reduce((sum, s, i) => {
      const src = sources[i];
      const months = Math.min(src.yearsContributing, yearsUntilRetirement) * 12;
      return sum + src.monthlySalary * (src.severanceContrib / 100) * months;
    }, 0);
    // פיצויים עד 12,230 ₪/שנת ותק פטורים - קירוב פשוט
    const avgTenure = sources.length > 0 ? sources[0].yearsContributing : yearsUntilRetirement;
    const exemptSeverance = Math.min(severanceLumpSum, 12_230 * avgTenure);
    const taxableSeverance = Math.max(0, severanceLumpSum - exemptSeverance);
    severanceLumpSumNet = severanceLumpSum - taxableSeverance * 0.2; // קירוב 20%
  }

  // גרף שנתי
  const yearlyData = buildYearlyData(sources, yearsUntilRetirement, currentAge);

  // ניתוח יעד
  const effectivePension =
    spouseOption !== 'none' ? monthlyPensionWithSpouse : totalMonthlyPension;
  const gap = targetMonthlyIncome - effectivePension;
  const gapPct = targetMonthlyIncome > 0 ? (gap / targetMonthlyIncome) * 100 : 0;

  // כמה הפקדה חודשית נוספת דרושה לסגור פער
  const additionalNeededBalance = Math.max(0, gap) * conversionFactor;
  const mr = (sources[0]?.expectedReturn ?? 5) / 100 / 12;
  const months = yearsUntilRetirement * 12;
  const requiredAdditionalMonthly =
    months > 0 && mr > 0
      ? additionalNeededBalance / ((Math.pow(1 + mr, months) - 1) / mr)
      : months > 0
      ? additionalNeededBalance / months
      : 0;

  const recommendations: string[] = [];
  if (gap > 2000) {
    recommendations.push(`הגדל הפקדה חודשית ב-${Math.round(requiredAdditionalMonthly).toLocaleString()} ₪ לסגירת הפער`);
  }
  if (replacementRate < 60) {
    recommendations.push('שיעור ההחלפה נמוך מ-60% - שקול להגדיל הפקדות');
  }
  if (retirementAge < 67) {
    recommendations.push('פרישה מוקדמת מפחיתה משמעותית את הקצבה ואת גיל תחילת ב.ל.ל');
  }
  if (sources.some((s) => s.managementFeeAccum > 0.5)) {
    recommendations.push('דמי הניהול גבוהים - שקול לעבור לקרן זולה יותר');
  }
  if (!includNationalIns) {
    recommendations.push('אל תשכח לכלול קצבת ביטוח לאומי (~3,465 ₪ ליחיד) בתכנון');
  }

  const goalAnalysis: GoalAnalysis = {
    targetMonthlyIncome,
    currentProjected: effectivePension,
    gap: Math.max(0, gap),
    gapPct: Math.max(0, gapPct),
    requiredAdditionalMonthly: Math.max(0, requiredAdditionalMonthly),
    yearsToReachTarget: 0, // placeholder
    recommendations,
  };

  return {
    totalFinalBalance,
    totalMonthlyPension,
    totalWithNationalIns,
    yearsUntilRetirement,
    realMonthlyPension,
    replacementRate,
    sources: sourceResults,
    studyFundFinalBalance,
    studyFundMonthlyEquivalent,
    taxAnalysis,
    goalAnalysis,
    yearlyData,
    conversionFactor,
    conversionFactorWithSpouse,
    monthlyPensionWithSpouse,
    severanceLumpSum,
    severanceLumpSumNet,
  };
}

// ============================================================
// Backward-compat: keep old calculatePension export
// ============================================================

export { calculatePension } from '@/lib/calculators/insurance';
export type { PensionInput, PensionResult } from '@/lib/calculators/insurance';

// ============================================================
// אוגרגציה - מספר מקורות
// ============================================================

export function aggregateMultiSources(sourceResults: PensionSourceResult[]): {
  totalBalance: number;
  totalMonthlyPension: number;
  byFundType: Record<PensionFundType, number>;
} {
  const byFundType: Record<PensionFundType, number> = {
    comprehensive: 0,
    managers: 0,
    provident: 0,
    study_fund: 0,
    national_ins: 0,
  };

  let totalBalance = 0;
  let totalMonthlyPension = 0;

  sourceResults.forEach((s) => {
    totalBalance += s.finalBalance;
    totalMonthlyPension += s.monthlyPension;
    byFundType[s.fundType] = (byFundType[s.fundType] ?? 0) + s.monthlyPension;
  });

  return { totalBalance, totalMonthlyPension, byFundType };
}

/**
 * כמה הפקדה חודשית נדרשת לקצבה יעד
 */
export function goalSeekMonthlyContribution(params: {
  targetMonthlyPension: number;
  conversionFactor: number;
  currentBalance: number;
  annualReturn: number;
  yearsUntilRetirement: number;
}): number {
  const { targetMonthlyPension, conversionFactor, currentBalance, annualReturn, yearsUntilRetirement } = params;
  if (yearsUntilRetirement <= 0) return 0;

  const targetBalance = targetMonthlyPension * conversionFactor;
  const months = yearsUntilRetirement * 12;
  const mr = annualReturn / 100 / 12;

  const fvCurrent = currentBalance * Math.pow(1 + mr, months);
  const remaining = Math.max(0, targetBalance - fvCurrent);

  if (mr === 0) return remaining / months;
  return remaining / ((Math.pow(1 + mr, months) - 1) / mr);
}
