/**
 * מחשבוני השקעות - ריבית דריבית מקיף
 *
 * 1. ריבית דריבית עם אינפלציה ומס רווחי הון
 * 2. חיפוש-יעד (Goal Seeking) - כמה להפקיד כדי להגיע לסכום
 * 3. השוואת תרחישים (Scenario Comparison)
 * 4. ROI - תשואה על השקעה
 * 5. תכנון פרישה
 *
 * נוסחאות מבוססות על:
 * - מתמטיקה פיננסית סטנדרטית (CFA Institute)
 * - חוק מס הכנסה - מס רווחי הון 25% (סעיף 91)
 * - אינפלציה ממוצעת 2.5-3.5% בישראל (בנק ישראל 2020-2026)
 */

// ============================================================
// 1. COMPOUND INTEREST - ריבית דריבית
// ============================================================

export type CompoundFrequency = 'yearly' | 'quarterly' | 'monthly' | 'daily';

export interface CompoundInterestInput {
  principal: number; // קרן ראשונית
  annualRate: number; // ריבית שנתית %
  years: number;
  frequency: CompoundFrequency;
  monthlyContribution: number; // הפקדה חודשית (אופציונלי)
  inflationRate?: number; // אינפלציה שנתית % (ברירת מחדל: 3)
  applyTax?: boolean; // האם להחיל מס רווחי הון 25% (ברירת מחדל: true)
}

export interface YearlyBreakdownRow {
  year: number;
  contributions: number; // הפקדות השנה
  interest: number; // ריבית שנצברה השנה
  balance: number; // יתרה נומינלית
  cumulativeContributions: number; // סה"כ הפקדות עד כה
  cumulativeInterest: number; // סה"כ ריבית עד כה
  realBalance: number; // ערך ריאלי (מותאם אינפלציה)
  afterTaxBalance: number; // ערך אחרי מס רווחי הון
}

export interface CompoundInterestResult {
  finalAmount: number; // ערך נומינלי סופי
  totalContributions: number; // סך הפקדות
  totalInterest: number; // סך ריבית נומינלית
  realFinalAmount: number; // ערך ריאלי (מותאם אינפלציה)
  afterTaxFinalAmount: number; // ערך אחרי מס 25%
  taxAmount: number; // סכום המס שישולם
  crossoverYear: number | null; // שנה בה הריבית השנתית עולה על ההפקדות השנתיות
  yearlyBreakdown: YearlyBreakdownRow[];
}

// קבועים ישראלים 2026
export const INVESTMENT_CONSTANTS_2026 = {
  CAPITAL_GAINS_TAX_RATE: 0.25, // 25% - מס רווחי הון בישראל (סעיף 91)
  DEFAULT_INFLATION_RATE: 3.0, // 3% - ממוצע אינפלציה בישראל
  TYPICAL_RETURNS: {
    pikdon: 3.5, // פיקדון בנק
    bondsGovernment: 5.0, // אג"ח ממשלתי
    taSP_diversified: 7.0, // תיק מגוון ת"א / קרן מחקה
    sp500: 10.0, // S&P 500 (היסטורי)
  },
} as const;

const COMPOUND_PERIODS: Record<CompoundFrequency, number> = {
  yearly: 1,
  quarterly: 4,
  monthly: 12,
  daily: 365,
};

/**
 * חישוב ריבית דריבית מלא
 *
 * נוסחה בסיסית: A = P(1 + r/n)^(nt)
 * עם הפקדות חודשיות: FV = P(1+r/n)^(nt) + PMT × [((1+r/n)^(nt) - 1) / (r/n)]
 * ריאלי: A_real = A / (1 + inflation)^t
 * אחרי מס: net = A - (A - total_contributions) × 0.25
 */
export function calculateCompoundInterest(input: CompoundInterestInput): CompoundInterestResult {
  const {
    principal,
    annualRate,
    years,
    frequency,
    monthlyContribution,
    inflationRate = INVESTMENT_CONSTANTS_2026.DEFAULT_INFLATION_RATE,
    applyTax = true,
  } = input;

  if (principal < 0 || annualRate < 0 || years < 0) {
    return {
      finalAmount: 0,
      totalContributions: 0,
      totalInterest: 0,
      realFinalAmount: 0,
      afterTaxFinalAmount: 0,
      taxAmount: 0,
      crossoverYear: null,
      yearlyBreakdown: [],
    };
  }

  const r = annualRate / 100;
  const n = COMPOUND_PERIODS[frequency];
  const monthlyContrib = monthlyContribution || 0;
  const inflR = inflationRate / 100;

  const yearlyBreakdown: YearlyBreakdownRow[] = [];

  let balance = principal;
  let totalContributions = principal;
  let crossoverYear: number | null = null;

  for (let year = 1; year <= years; year++) {
    const startBalance = balance;
    const startContributions = totalContributions;

    if (monthlyContrib > 0) {
      // חישוב חודשי (מדויק יותר עם הפקדות)
      const monthlyR = r / 12;
      for (let month = 0; month < 12; month++) {
        balance = balance * (1 + monthlyR);
        balance += monthlyContrib;
        totalContributions += monthlyContrib;
      }
    } else {
      // ללא הפקדות - חישוב לפי תדירות
      balance = startBalance * Math.pow(1 + r / n, n);
    }

    const yearlyContributions = monthlyContrib * 12;
    const yearInterest = balance - startBalance - yearlyContributions;

    // ערך ריאלי - מה הכסף שווה בערכי היום
    const realBalance = balance / Math.pow(1 + inflR, year);

    // אחרי מס - מס רק על הרווח (לא על הקרן + הפקדות)
    const totalProfit = balance - totalContributions;
    const taxAmount = applyTax ? Math.max(0, totalProfit * INVESTMENT_CONSTANTS_2026.CAPITAL_GAINS_TAX_RATE) : 0;
    const afterTaxBalance = balance - taxAmount;

    // נקודת חציה: ריבית שנתית > הפקדות שנתיות
    if (crossoverYear === null && monthlyContrib > 0 && yearInterest >= yearlyContributions && yearlyContributions > 0) {
      crossoverYear = year;
    }

    yearlyBreakdown.push({
      year,
      contributions: yearlyContributions,
      interest: yearInterest,
      balance,
      cumulativeContributions: totalContributions,
      cumulativeInterest: balance - totalContributions,
      realBalance,
      afterTaxBalance,
    });
  }

  const finalAmount = balance;
  const totalProfit = finalAmount - totalContributions;
  const taxAmount = applyTax ? Math.max(0, totalProfit * INVESTMENT_CONSTANTS_2026.CAPITAL_GAINS_TAX_RATE) : 0;

  return {
    finalAmount,
    totalContributions,
    totalInterest: finalAmount - totalContributions,
    realFinalAmount: finalAmount / Math.pow(1 + inflR, years),
    afterTaxFinalAmount: finalAmount - taxAmount,
    taxAmount,
    crossoverYear,
    yearlyBreakdown,
  };
}

// ============================================================
// 2. GOAL SEEKING - חיפוש יעד
// ============================================================

export interface GoalSeekInput {
  goalAmount: number; // סכום יעד
  principal: number; // קרן ראשונית קיימת
  annualRate: number; // ריבית שנתית %
  years: number;
  inflationRate?: number; // האם לחשב יעד ריאלי (בערכי היום)?
  targetIsReal?: boolean; // true = היעד הוא בערכי היום (ריאלי)
}

export interface GoalSeekResult {
  requiredMonthlyContribution: number; // הפקדה חודשית נדרשת
  totalContributions: number; // סה"כ הפקדות
  totalInterest: number; // סה"כ ריבית
  goalAmount: number; // היעד
}

/**
 * חישוב הפקדה חודשית נדרשת להגיע ליעד
 *
 * נוסחת PMT הפוכה:
 * FV = P(1+r)^n + PMT × [((1+r)^n - 1) / r]
 * PMT = (FV - P(1+r)^n) × r / ((1+r)^n - 1)
 *
 * כאשר r = ריבית חודשית, n = מספר חודשים
 */
export function calculateRequiredMonthlyContribution(input: GoalSeekInput): GoalSeekResult {
  const {
    goalAmount,
    principal,
    annualRate,
    years,
    inflationRate = INVESTMENT_CONSTANTS_2026.DEFAULT_INFLATION_RATE,
    targetIsReal = false,
  } = input;

  const monthlyR = annualRate / 100 / 12;
  const n = years * 12;

  // אם היעד הוא ריאלי - נהפוך אותו לנומינלי
  const nominalGoal = targetIsReal
    ? goalAmount * Math.pow(1 + inflationRate / 100, years)
    : goalAmount;

  // ערך עתידי של הקרן
  const futurePrincipal = principal * Math.pow(1 + monthlyR, n);

  // כמה שנשאר לכסות עם ההפקדות
  const remainingGoal = nominalGoal - futurePrincipal;

  let requiredMonthly = 0;
  if (remainingGoal > 0) {
    if (monthlyR === 0) {
      requiredMonthly = remainingGoal / n;
    } else {
      const fvFactor = (Math.pow(1 + monthlyR, n) - 1) / monthlyR;
      requiredMonthly = remainingGoal / fvFactor;
    }
  }

  const totalContributions = principal + Math.max(0, requiredMonthly) * n;

  return {
    requiredMonthlyContribution: Math.max(0, requiredMonthly),
    totalContributions,
    totalInterest: nominalGoal - totalContributions,
    goalAmount: nominalGoal,
  };
}

// ============================================================
// 3. SCENARIO COMPARISON - השוואת תרחישים
// ============================================================

export interface ScenarioInput {
  label: string; // שם התרחיש
  annualRate: number; // תשואה שנתית %
  color: string; // צבע לגרף
}

export interface ScenarioResult {
  label: string;
  annualRate: number;
  color: string;
  finalAmount: number;
  realFinalAmount: number;
  afterTaxFinalAmount: number;
  totalContributions: number;
  totalInterest: number;
  yearlyData: Array<{ year: number; balance: number; realBalance: number; afterTaxBalance: number }>;
}

export interface CompareScenarioInput {
  principal: number;
  monthlyContribution: number;
  years: number;
  inflationRate?: number;
  applyTax?: boolean;
  scenarios: ScenarioInput[];
}

/**
 * השוואת מספר תרחישי השקעה זה לצד זה
 */
export function compareScenarios(input: CompareScenarioInput): ScenarioResult[] {
  const {
    principal,
    monthlyContribution,
    years,
    inflationRate = INVESTMENT_CONSTANTS_2026.DEFAULT_INFLATION_RATE,
    applyTax = true,
    scenarios,
  } = input;

  return scenarios.map((scenario) => {
    const result = calculateCompoundInterest({
      principal,
      annualRate: scenario.annualRate,
      years,
      frequency: 'monthly',
      monthlyContribution,
      inflationRate,
      applyTax,
    });

    return {
      label: scenario.label,
      annualRate: scenario.annualRate,
      color: scenario.color,
      finalAmount: result.finalAmount,
      realFinalAmount: result.realFinalAmount,
      afterTaxFinalAmount: result.afterTaxFinalAmount,
      totalContributions: result.totalContributions,
      totalInterest: result.totalInterest,
      yearlyData: result.yearlyBreakdown.map((row) => ({
        year: row.year,
        balance: row.balance,
        realBalance: row.realBalance,
        afterTaxBalance: row.afterTaxBalance,
      })),
    };
  });
}

// ============================================================
// 4. ROI - Return on Investment
// ============================================================

export interface ROIInput {
  initialInvestment: number;
  finalValue: number;
  years: number; // אופציונלי - לחישוב שנתי
  additionalCosts: number; // עלויות נוספות
  additionalIncome: number; // הכנסות נוספות (דיבידנדים וכו')
}

export interface ROIResult {
  netProfit: number;
  roi: number; // %
  annualizedROI: number; // %
  totalReturn: number;
  isPositive: boolean;
}

export function calculateROI(input: ROIInput): ROIResult {
  const { initialInvestment, finalValue, years, additionalCosts, additionalIncome } = input;

  if (initialInvestment <= 0) {
    return {
      netProfit: 0,
      roi: 0,
      annualizedROI: 0,
      totalReturn: 0,
      isPositive: false,
    };
  }

  const totalReturn = finalValue + additionalIncome;
  const totalCost = initialInvestment + additionalCosts;
  const netProfit = totalReturn - totalCost;
  const roi = (netProfit / totalCost) * 100;

  // ROI שנתי (מנורמל)
  let annualizedROI = roi;
  if (years > 0 && years !== 1) {
    annualizedROI = (Math.pow(totalReturn / totalCost, 1 / years) - 1) * 100;
  }

  return {
    netProfit,
    roi,
    annualizedROI,
    totalReturn,
    isPositive: netProfit > 0,
  };
}

// ============================================================
// 5. RETIREMENT PLANNING - תכנון פרישה
// ============================================================

export interface RetirementInput {
  currentAge: number;
  retirementAge: number;
  currentSavings: number;
  monthlyContribution: number;
  expectedReturn: number; // % שנתי
  desiredMonthlyIncome: number; // הכנסה חודשית רצויה בפרישה
  yearsInRetirement: number; // כמה שנים לחיות אחרי פרישה
  inflationRate: number; // % שנתי
}

export interface RetirementResult {
  yearsUntilRetirement: number;
  projectedSavings: number; // חיסכון צפוי בפרישה
  requiredSavings: number; // חיסכון נדרש כדי לחיות בכבוד
  shortfall: number; // החוסר (אם יש)
  isOnTrack: boolean;
  additionalMonthlyNeeded: number; // כמה צריך להוסיף לחודש
  yearlyProjection: Array<{
    age: number;
    savings: number;
    contributions: number;
  }>;
}

export function calculateRetirement(input: RetirementInput): RetirementResult {
  const {
    currentAge,
    retirementAge,
    currentSavings,
    monthlyContribution,
    expectedReturn,
    desiredMonthlyIncome,
    yearsInRetirement,
    inflationRate,
  } = input;

  const yearsUntilRetirement = retirementAge - currentAge;
  if (yearsUntilRetirement <= 0) {
    return {
      yearsUntilRetirement: 0,
      projectedSavings: currentSavings,
      requiredSavings: desiredMonthlyIncome * 12 * yearsInRetirement,
      shortfall: 0,
      isOnTrack: false,
      additionalMonthlyNeeded: 0,
      yearlyProjection: [],
    };
  }

  // חישוב חיסכון צפוי בפרישה (ריבית דריבית עם הפקדות)
  const annualR = expectedReturn / 100;
  const monthlyR = annualR / 12;
  let savings = currentSavings;
  const yearlyProjection: RetirementResult['yearlyProjection'] = [];

  for (let year = 0; year < yearsUntilRetirement; year++) {
    for (let m = 0; m < 12; m++) {
      savings = savings * (1 + monthlyR) + monthlyContribution;
    }
    yearlyProjection.push({
      age: currentAge + year + 1,
      savings,
      contributions: monthlyContribution * 12,
    });
  }

  const projectedSavings = savings;

  // חישוב הסכום הנדרש לפרישה
  // התאמה לאינפלציה - ההכנסה הרצויה תעלה
  const inflationFactor = Math.pow(1 + inflationRate / 100, yearsUntilRetirement);
  const adjustedMonthlyIncome = desiredMonthlyIncome * inflationFactor;

  // נחשב כסכום נוכחי של הזרם השנתי בפרישה
  // נניח שגם בפרישה הכסף מרוויח ריבית מתונה (3% נטו אחרי אינפלציה)
  const realReturnInRetirement: number = 0.03; // 3% נטו
  const requiredSavings =
    realReturnInRetirement === 0
      ? adjustedMonthlyIncome * 12 * yearsInRetirement
      : (adjustedMonthlyIncome *
          12 *
          (1 - Math.pow(1 + realReturnInRetirement, -yearsInRetirement))) /
        realReturnInRetirement;

  const shortfall = Math.max(0, requiredSavings - projectedSavings);
  const isOnTrack = projectedSavings >= requiredSavings;

  // כמה צריך להוסיף לחודש כדי לסגור את הפער
  let additionalMonthlyNeeded = 0;
  if (shortfall > 0) {
    // FV of monthly payment: PMT × [((1+r)^n - 1) / r]
    const months = yearsUntilRetirement * 12;
    const futureValueFactor =
      monthlyR === 0 ? months : (Math.pow(1 + monthlyR, months) - 1) / monthlyR;
    additionalMonthlyNeeded = shortfall / futureValueFactor;
  }

  return {
    yearsUntilRetirement,
    projectedSavings,
    requiredSavings,
    shortfall,
    isOnTrack,
    additionalMonthlyNeeded,
    yearlyProjection,
  };
}

// ============================================================
// 6. COMPREHENSIVE RETIREMENT PLANNING - תכנון פרישה מקיף
// ============================================================

/**
 * מקורות הכנסה בפרישה
 */
export interface RetirementIncomeSources {
  pensionMonthly: number;        // קצבת פנסיה חודשית (ש"ח)
  socialSecurityMonthly: number; // קצבת זקנה - ביטוח לאומי (ש"ח)
  rentalIncome: number;          // הכנסה מדמי שכירות (ש"ח/חודש)
  partTimeWork: number;          // עבודה חלקית בפרישה (ש"ח/חודש)
  investmentPortfolio: number;   // שווי תיק השקעות (ש"ח) - ייצור drawdown
}

/**
 * קלט מקיף לתכנון פרישה
 */
export interface ComprehensiveRetirementInput {
  // אישי
  currentAge: number;
  retirementAge: number;
  yearsInRetirement: number;   // תוחלת חיים אחרי פרישה

  // חיסכון נוכחי
  currentSavings: number;        // חיסכון קיים (פנסיה + כל שאר)
  monthlyContribution: number;   // הפקדה חודשית כוללת
  expectedReturn: number;        // % תשואה שנתית בצמיחה

  // יעדי פרישה
  desiredMonthlyIncome: number;  // הכנסה רצויה (בערכי היום)
  inflationRate: number;         // % אינפלציה שנתי

  // מקורות הכנסה בפרישה
  incomeSources: RetirementIncomeSources;

  // אסטרטגיית משיכה
  withdrawalRate: number;        // % משיכה שנתי מתיק ההשקעות (ברירת מחדל: 4%)

  // מיסוי
  pensionTaxRate: number;        // % מס על קצבת פנסיה (בד"כ 0-17% בגלל פטורים)
  capitalGainsTaxRate: number;   // % מס רווחי הון על תיק השקעות

  // תרחישים להשוואה
  scenarios: Array<{
    label: string;
    returnRate: number;   // % תשואה שנתית
    color: string;
    retirementAge?: number;
  }>;
}

/**
 * תוצאה שנתית בתקופת הצמיחה
 */
export interface RetirementAccumulationRow {
  age: number;
  year: number;
  balance: number;           // יתרה נומינלית
  realBalance: number;       // ערך ריאלי
  yearlyContribution: number;
  yearlyGrowth: number;      // ריבית שנצברה השנה
}

/**
 * תוצאה שנתית בתקופת הפרישה (drawdown)
 */
export interface RetirementDrawdownRow {
  age: number;
  year: number;              // שנה בפרישה (1, 2, ...)
  balance: number;           // יתרה בתחילת שנה
  totalIncome: number;       // סה"כ הכנסה חודשית
  portfolioDrawdown: number; // משיכה מתיק השקעות
  nominalDesiredIncome: number; // הכנסה רצויה נומינלית (מותאמת אינפלציה)
}

/**
 * תוצאה מקיפה לתכנון פרישה
 */
export interface ComprehensiveRetirementResult {
  // תקופת צמיחה
  yearsUntilRetirement: number;
  projectedSavings: number;        // חיסכון צפוי בפרישה (נומינלי)
  realProjectedSavings: number;    // חיסכון צפוי בפרישה (ריאלי)
  totalContributions: number;      // סה"כ הפקדות
  totalGrowth: number;             // סה"כ צמיחה (ריבית)

  // יעד ומצב
  requiredSavings: number;         // חיסכון נדרש
  shortfall: number;               // פער
  surplus: number;                 // עודף
  isOnTrack: boolean;
  fundingRatio: number;            // יחס כיסוי (projected/required)

  // הכנסה בפרישה
  totalMonthlyIncomeAtRetirement: number;   // סה"כ הכנסה חודשית בפרישה (נומינלי)
  totalMonthlyIncomeReal: number;           // אותו דבר בערכי היום
  portfolioMonthlyDrawdown: number;         // משיכה חודשית מהתיק בשנת פרישה ראשונה
  incomeGap: number;                        // פער בין הכנסה רצויה להכנסה צפויה

  // תוחלת כסף
  yearsMoneyWillLast: number;               // כמה שנים הכסף יחזיק
  portfolioDepletionAge: number;            // גיל שבו הכסף נגמר

  // חיפוש יעד (goal-seeking)
  requiredMonthlyContributionForGoal: number; // הפקדה חודשית נדרשת לעמוד ביעד

  // מיסוי
  estimatedPensionTax: number;     // מס משוער שנתי על פנסיה
  estimatedPortfolioTax: number;   // מס משוער שנתי על תיק

  // נתוני גרפים
  accumulationData: RetirementAccumulationRow[];  // נתוני צמיחה
  drawdownData: RetirementDrawdownRow[];          // נתוני פרישה (drawdown)

  // השוואת תרחישים
  scenarioResults: Array<{
    label: string;
    color: string;
    returnRate: number;
    retirementAge: number;
    projectedSavings: number;
    realProjectedSavings: number;
    isOnTrack: boolean;
    yearsMoneyWillLast: number;
  }>;
}

/**
 * חישוב תכנון פרישה מקיף
 *
 * כולל:
 * - ריבית דריבית בתקופת הצמיחה
 * - מקורות הכנסה מרובים בפרישה
 * - אסטרטגיית drawdown (משיכה מתיק)
 * - מיסוי על פנסיה ורווחי הון
 * - goal-seeking
 * - השוואת תרחישים
 */
export function calculateComprehensiveRetirement(
  input: ComprehensiveRetirementInput,
): ComprehensiveRetirementResult {
  const {
    currentAge,
    retirementAge,
    yearsInRetirement,
    currentSavings,
    monthlyContribution,
    expectedReturn,
    desiredMonthlyIncome,
    inflationRate,
    incomeSources,
    withdrawalRate,
    pensionTaxRate,
    capitalGainsTaxRate,
    scenarios,
  } = input;

  const yearsUntilRetirement = Math.max(0, retirementAge - currentAge);
  const annualR = expectedReturn / 100;
  const monthlyR = annualR / 12;
  const inflR = inflationRate / 100;

  // ============================================================
  // שלב 1: תקופת צמיחה - בנה את החיסכון
  // ============================================================
  const accumulationData: RetirementAccumulationRow[] = [];
  let balance = currentSavings;
  let totalContributions = currentSavings;

  for (let year = 1; year <= yearsUntilRetirement; year++) {
    const startBalance = balance;
    // חישוב חודשי מדויק
    for (let m = 0; m < 12; m++) {
      balance = balance * (1 + monthlyR) + monthlyContribution;
      totalContributions += monthlyContribution;
    }
    const yearlyGrowth = balance - startBalance - monthlyContribution * 12;
    const realBalance = balance / Math.pow(1 + inflR, year);

    accumulationData.push({
      age: currentAge + year,
      year,
      balance,
      realBalance,
      yearlyContribution: monthlyContribution * 12,
      yearlyGrowth,
    });
  }

  const projectedSavings = balance;
  const realProjectedSavings = yearsUntilRetirement > 0
    ? projectedSavings / Math.pow(1 + inflR, yearsUntilRetirement)
    : projectedSavings;
  const totalGrowth = projectedSavings - totalContributions;

  // ============================================================
  // שלב 2: הכנסה בפרישה
  // ============================================================

  // הכנסה בפרישה - כל מקורות ההכנסה הנומינליים בשנת פרישה ראשונה
  const inflationFactorAtRetirement = Math.pow(1 + inflR, yearsUntilRetirement);

  // פנסיה (אחרי מס)
  const pensionNet = incomeSources.pensionMonthly * (1 - pensionTaxRate / 100);
  // ביטוח לאומי (פטור ממס)
  const socialSecurity = incomeSources.socialSecurityMonthly;
  // שכירות + עבודה חלקית
  const otherIncome = incomeSources.rentalIncome + incomeSources.partTimeWork;

  const fixedMonthlyIncomeToday = pensionNet + socialSecurity + otherIncome;

  // כמה עוד צריך מהתיק (בערכי היום)
  const desiredIncomeReal = desiredMonthlyIncome; // זה כבר בערכי היום
  const portfolioNeededMonthly = Math.max(0, desiredIncomeReal - fixedMonthlyIncomeToday);

  // בשנת פרישה ראשונה - נומינלי
  const nominalDesiredIncome = desiredMonthlyIncome * inflationFactorAtRetirement;
  const fixedMonthlyIncomeNominal = fixedMonthlyIncomeToday * inflationFactorAtRetirement;
  const portfolioMonthlyDrawdown = Math.max(0, nominalDesiredIncome - fixedMonthlyIncomeNominal);

  const totalMonthlyIncomeAtRetirement = fixedMonthlyIncomeNominal + portfolioMonthlyDrawdown;
  const totalMonthlyIncomeReal = totalMonthlyIncomeAtRetirement / inflationFactorAtRetirement;

  // פער הכנסה (האם הכנסה צפויה מכסה את הרצויה)
  const incomeGap = Math.max(0, nominalDesiredIncome - totalMonthlyIncomeAtRetirement);

  // ============================================================
  // שלב 3: drawdown - כמה זמן הכסף מחזיק
  // ============================================================

  // תיק ההשקעות בפרישה - נניח תשואה מתונה יותר (60/40)
  const portfolioReturnInRetirement = Math.max(0, (expectedReturn - 2) / 100); // מתון יותר
  const portfolioMonthlyReturn = portfolioReturnInRetirement / 12;

  // שיעור משיכה שנתי מהתיק
  const annualWithdrawalRate = withdrawalRate / 100;

  const drawdownData: RetirementDrawdownRow[] = [];
  let portfolioBalance = projectedSavings;

  // עלות הזדמנות: מס רווחי הון על תיק ההשקעות בפרישה
  const portfolioProfit = Math.max(0, projectedSavings - totalContributions);
  const estimatedPortfolioTax = portfolioProfit * (capitalGainsTaxRate / 100) * 0.3; // 30% מהרווח ממוסה בשנה ראשונה (הערכה)

  let yearsMoneyWillLast = 0;
  let portfolioDepletionAge = retirementAge;

  for (let year = 1; year <= Math.max(yearsInRetirement, 40); year++) {
    if (portfolioBalance <= 0) break;

    // הכנסה רצויה מותאמת אינפלציה בשנה זו
    const yearNominalDesiredIncome = nominalDesiredIncome * Math.pow(1 + inflR, year - 1);

    // הכנסה קבועה מותאמת אינפלציה
    const yearFixedIncome = fixedMonthlyIncomeNominal * Math.pow(1 + inflR, year - 1);

    // משיכה מהתיק
    const yearPortfolioDrawdown = Math.max(0, yearNominalDesiredIncome - yearFixedIncome);
    const startBalance = portfolioBalance;

    // גדל בתשואה
    for (let m = 0; m < 12; m++) {
      portfolioBalance = portfolioBalance * (1 + portfolioMonthlyReturn);
      portfolioBalance -= yearPortfolioDrawdown / 12;
    }

    if (year <= yearsInRetirement) {
      drawdownData.push({
        age: retirementAge + year,
        year,
        balance: Math.max(0, startBalance),
        totalIncome: yearFixedIncome + Math.min(yearPortfolioDrawdown, yearPortfolioDrawdown),
        portfolioDrawdown: yearPortfolioDrawdown,
        nominalDesiredIncome: yearNominalDesiredIncome,
      });
    }

    if (portfolioBalance > 0) {
      yearsMoneyWillLast = year;
      portfolioDepletionAge = retirementAge + year;
    }
  }

  // עדכן yearsMoneyWillLast אם הכסף מחזיק יותר מ-40 שנה
  if (portfolioBalance > 0) {
    yearsMoneyWillLast = 40;
    portfolioDepletionAge = retirementAge + 40;
  }

  // ============================================================
  // שלב 4: חיסכון נדרש
  // ============================================================

  // חיסכון נדרש כדי לייצר את הdrawdown הדרוש
  const monthlyDrawdownNeeded = portfolioMonthlyDrawdown;
  // PV של annuity: כמה צריך היום כדי לייצר cashflow לאורך yearsInRetirement
  const retirementMonthlyR = portfolioMonthlyReturn;
  const retirementMonths = yearsInRetirement * 12;
  const requiredSavings =
    monthlyDrawdownNeeded <= 0
      ? 0
      : retirementMonthlyR === 0
        ? monthlyDrawdownNeeded * retirementMonths
        : (monthlyDrawdownNeeded * (1 - Math.pow(1 + retirementMonthlyR, -retirementMonths))) /
          retirementMonthlyR;

  const shortfall = Math.max(0, requiredSavings - projectedSavings);
  const surplus = Math.max(0, projectedSavings - requiredSavings);
  const isOnTrack = projectedSavings >= requiredSavings;
  const fundingRatio = requiredSavings > 0 ? projectedSavings / requiredSavings : 1;

  // ============================================================
  // שלב 5: goal-seeking — כמה להפקיד כדי לעמוד ביעד
  // ============================================================
  let requiredMonthlyContributionForGoal = monthlyContribution;

  if (shortfall > 0 && yearsUntilRetirement > 0) {
    const months = yearsUntilRetirement * 12;
    const fvFactor =
      monthlyR === 0
        ? months
        : (Math.pow(1 + monthlyR, months) - 1) / monthlyR;
    const existingSavingsFV = currentSavings * Math.pow(1 + monthlyR, months);
    const neededFV = requiredSavings - existingSavingsFV;
    requiredMonthlyContributionForGoal = neededFV > 0 ? neededFV / fvFactor : 0;
  }

  // ============================================================
  // שלב 6: מיסוי
  // ============================================================
  const estimatedPensionTax =
    incomeSources.pensionMonthly * 12 * (pensionTaxRate / 100);

  // ============================================================
  // שלב 7: השוואת תרחישים
  // ============================================================
  const scenarioResults = scenarios.map((scenario) => {
    const scenarioRetirementAge = scenario.retirementAge ?? retirementAge;
    const scenarioYears = Math.max(0, scenarioRetirementAge - currentAge);
    const scenarioR = scenario.returnRate / 100;
    const scenarioMonthlyR = scenarioR / 12;

    let scenarioBalance = currentSavings;
    for (let year = 0; year < scenarioYears; year++) {
      for (let m = 0; m < 12; m++) {
        scenarioBalance = scenarioBalance * (1 + scenarioMonthlyR) + monthlyContribution;
      }
    }

    const scenarioRealBalance =
      scenarioYears > 0
        ? scenarioBalance / Math.pow(1 + inflR, scenarioYears)
        : scenarioBalance;

    // האם התרחיש מכסה את הdrawdown הדרוש
    const scenarioOnTrack = scenarioBalance >= requiredSavings;

    // כמה שנים הכסף מחזיק בתרחיש זה
    const scenarioPortfolioReturn = Math.max(0, (scenario.returnRate - 2) / 100);
    const scenarioPortfolioMonthlyR = scenarioPortfolioReturn / 12;
    let scenarioPortfolioBalance = scenarioBalance;
    let scenarioYearsLast = 0;
    for (let year = 1; year <= 40; year++) {
      if (scenarioPortfolioBalance <= 0) break;
      const yearNominalDesiredIncome =
        nominalDesiredIncome * Math.pow(1 + inflR, year - 1);
      const yearFixedIncome = fixedMonthlyIncomeNominal * Math.pow(1 + inflR, year - 1);
      const yearDrawdown = Math.max(0, yearNominalDesiredIncome - yearFixedIncome);
      for (let m = 0; m < 12; m++) {
        scenarioPortfolioBalance *= 1 + scenarioPortfolioMonthlyR;
        scenarioPortfolioBalance -= yearDrawdown / 12;
      }
      if (scenarioPortfolioBalance > 0) scenarioYearsLast = year;
    }
    if (scenarioPortfolioBalance > 0) scenarioYearsLast = 40;

    return {
      label: scenario.label,
      color: scenario.color,
      returnRate: scenario.returnRate,
      retirementAge: scenarioRetirementAge,
      projectedSavings: scenarioBalance,
      realProjectedSavings: scenarioRealBalance,
      isOnTrack: scenarioOnTrack,
      yearsMoneyWillLast: scenarioYearsLast,
    };
  });

  return {
    yearsUntilRetirement,
    projectedSavings,
    realProjectedSavings,
    totalContributions,
    totalGrowth,
    requiredSavings,
    shortfall,
    surplus,
    isOnTrack,
    fundingRatio,
    totalMonthlyIncomeAtRetirement,
    totalMonthlyIncomeReal,
    portfolioMonthlyDrawdown,
    incomeGap,
    yearsMoneyWillLast,
    portfolioDepletionAge,
    requiredMonthlyContributionForGoal,
    estimatedPensionTax,
    estimatedPortfolioTax,
    accumulationData,
    drawdownData,
    scenarioResults,
  };
}

/**
 * חישוב קצבת ביטוח לאומי מוערכת לפי גיל ומשכורת
 * מבוסס על מחשבון ב.ל. 2026
 * קצבת בסיס: כ-3,500 ₪/חודש לאחד, 4,900 ₪ לזוג
 */
export function estimateSocialSecurityBenefit(options: {
  retirementAge: number;
  yearsContributed: number; // שנות עבודה בהן שולם ביטוח לאומי
  averageSalary: number;    // שכר ממוצע ב-5 שנים אחרונות
  isCouple: boolean;
}): number {
  const BASE_SINGLE = 3_500;  // ₪/חודש
  const BASE_COUPLE = 4_900;  // ₪/חודש
  const EARLY_RETIREMENT_DEDUCTION = 0.5; // 0.5% לכל חודש לפני גיל הפרישה

  const base = options.isCouple ? BASE_COUPLE : BASE_SINGLE;
  const standardRetirementAge = 67;

  let benefit = base;

  // הפחתה לפרישה מוקדמת
  if (options.retirementAge < standardRetirementAge) {
    const monthsEarly = (standardRetirementAge - options.retirementAge) * 12;
    benefit = benefit * (1 - EARLY_RETIREMENT_DEDUCTION * monthsEarly / 100);
  }

  return Math.max(0, Math.round(benefit));
}

/**
 * חישוב קצבת פנסיה מוערכת
 * מבוסס על: שכר × שנות ותק × מקדם (בד"כ 1.75%-2% לשנה)
 */
export function estimatePensionBenefit(options: {
  averageSalary: number;      // שכר ממוצע (ש"ח/חודש)
  yearsOfContribution: number; // שנות הפקדה לפנסיה
  pensionCoefficient?: number; // מקדם (/100) - ברירת מחדל: 1.75%
}): {
  monthlyPension: number;
  replacementRate: number;  // % מהשכר
} {
  const { averageSalary, yearsOfContribution, pensionCoefficient = 1.75 } = options;
  const monthlyPension = averageSalary * (yearsOfContribution * pensionCoefficient) / 100;
  const replacementRate = (monthlyPension / averageSalary) * 100;
  return { monthlyPension: Math.round(monthlyPension), replacementRate };
}

/**
 * חישוב כמה שנים כסף מחזיק לפי תרחיש משיכה
 */
export function calculatePortfolioLongevity(options: {
  initialBalance: number;
  monthlyWithdrawal: number;   // משיכה חודשית קבועה (ריאלית)
  annualReturn: number;        // % תשואה שנתית בפרישה
  inflationRate: number;       // % אינפלציה - מגדיל משיכה כל שנה
  maxYears?: number;
}): {
  yearsItLasts: number;
  depletionAge?: number;
  endBalance: number;
  yearlyData: Array<{ year: number; balance: number; withdrawal: number }>;
} {
  const { initialBalance, monthlyWithdrawal, annualReturn, inflationRate, maxYears = 50 } = options;
  const monthlyR = annualReturn / 100 / 12;
  const inflR = inflationRate / 100;

  let balance = initialBalance;
  let yearsItLasts = 0;
  const yearlyData: Array<{ year: number; balance: number; withdrawal: number }> = [];

  for (let year = 1; year <= maxYears; year++) {
    if (balance <= 0) break;
    const yearlyWithdrawal = monthlyWithdrawal * 12 * Math.pow(1 + inflR, year - 1);

    for (let m = 0; m < 12; m++) {
      balance = balance * (1 + monthlyR) - yearlyWithdrawal / 12;
    }

    yearlyData.push({
      year,
      balance: Math.max(0, balance),
      withdrawal: yearlyWithdrawal / 12,
    });

    if (balance > 0) yearsItLasts = year;
  }
  if (balance > 0) yearsItLasts = maxYears;

  return { yearsItLasts, endBalance: Math.max(0, balance), yearlyData };
}
