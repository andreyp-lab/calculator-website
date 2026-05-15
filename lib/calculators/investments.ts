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
