/**
 * מחשבוני השקעות
 *
 * 1. ריבית דריבית - הזהב של ה-SEO
 * 2. ROI - תשואה על השקעה
 * 3. תכנון פרישה
 *
 * נוסחאות מבוססות על מתמטיקה פיננסית סטנדרטית
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
}

export interface CompoundInterestResult {
  finalAmount: number;
  totalContributions: number;
  totalInterest: number;
  yearlyBreakdown: Array<{
    year: number;
    contributions: number;
    interest: number;
    balance: number;
  }>;
}

const COMPOUND_PERIODS: Record<CompoundFrequency, number> = {
  yearly: 1,
  quarterly: 4,
  monthly: 12,
  daily: 365,
};

/**
 * חישוב ריבית דריבית
 *
 * נוסחה בסיסית: A = P(1 + r/n)^(nt)
 * עם הפקדות חודשיות: FV = P(1+r/n)^(nt) + PMT × [((1+r/n)^(nt) - 1) / (r/n)]
 */
export function calculateCompoundInterest(input: CompoundInterestInput): CompoundInterestResult {
  const { principal, annualRate, years, frequency, monthlyContribution } = input;

  if (principal < 0 || annualRate < 0 || years < 0) {
    return {
      finalAmount: 0,
      totalContributions: 0,
      totalInterest: 0,
      yearlyBreakdown: [],
    };
  }

  const r = annualRate / 100;
  const n = COMPOUND_PERIODS[frequency];
  const monthlyContrib = monthlyContribution || 0;

  const yearlyBreakdown: CompoundInterestResult['yearlyBreakdown'] = [];

  let balance = principal;
  let totalContributions = principal;

  for (let year = 1; year <= years; year++) {
    const startOfYear = balance;

    // אם יש הפקדות חודשיות, מחשבים על בסיס חודשי
    if (monthlyContrib > 0) {
      const monthlyR = r / 12;
      for (let month = 0; month < 12; month++) {
        balance = balance * (1 + monthlyR);
        balance += monthlyContrib;
        totalContributions += monthlyContrib;
      }
    } else {
      // ללא הפקדות - חישוב לפי תדירות
      balance = startOfYear * Math.pow(1 + r / n, n);
    }

    const yearInterest = balance - startOfYear - (monthlyContrib > 0 ? monthlyContrib * 12 : 0);

    yearlyBreakdown.push({
      year,
      contributions: monthlyContrib > 0 ? monthlyContrib * 12 : 0,
      interest: yearInterest,
      balance,
    });
  }

  return {
    finalAmount: balance,
    totalContributions,
    totalInterest: balance - totalContributions,
    yearlyBreakdown,
  };
}

// ============================================================
// 2. ROI - Return on Investment
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
// 3. RETIREMENT PLANNING - תכנון פרישה
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
    const startOfYear = savings;
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
