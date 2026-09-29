/**
 * מחשבוני השקעות - ריבית דריבית מקיף
 *
 * 1. ריבית דריבית עם הנחות אינפלציה ומס שהמשתמש בוחר
 * 2. חיפוש-יעד (Goal Seeking) - כמה להפקיד כדי להגיע לסכום
 * 3. השוואת תרחישים (Scenario Comparison)
 * 4. ROI - תשואה על השקעה
 * שיעורי תשואה, אינפלציה ומס אינם נתונים כלליים של שנת מס.
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
  inflationRate?: number; // הנחת אינפלציה שנתית %; ברירת מחדל 0
  applyTax?: boolean; // חישוב הדגמה בלבד, רק אם גם taxRate סופק
  taxRate?: number; // שיעור מס שהמשתמש הזין להדגמה, לא חישוב מס אישי
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
  afterTaxFinalAmount: number; // הדגמה לפי שיעור מס שהוזן
  taxAmount: number; // סכום הדגמה, לא חבות מס אישית
  crossoverYear: number | null; // שנה בה הריבית השנתית עולה על ההפקדות השנתיות
  yearlyBreakdown: YearlyBreakdownRow[];
}

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
 * הדגמת מס, אם שיעור סופק: net = A - max(0, A - contributions) × taxRate
 */
export function calculateCompoundInterest(input: CompoundInterestInput): CompoundInterestResult {
  const {
    principal,
    annualRate,
    years,
    frequency,
    monthlyContribution,
    inflationRate = 0,
    applyTax = false,
    taxRate,
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
  const illustrativeTaxRate = applyTax && Number.isFinite(taxRate) && taxRate !== undefined
    ? Math.max(0, Math.min(100, taxRate)) / 100
    : 0;

  const yearlyBreakdown: YearlyBreakdownRow[] = [];

  let balance = principal;
  let totalContributions = principal;
  let crossoverYear: number | null = null;

  for (let year = 1; year <= years; year++) {
    const startBalance = balance;

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
    const taxAmount = Math.max(0, totalProfit * illustrativeTaxRate);
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
  const taxAmount = Math.max(0, totalProfit * illustrativeTaxRate);

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
    inflationRate = 0,
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
  taxRate?: number;
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
    inflationRate = 0,
    applyTax = false,
    taxRate,
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
      taxRate,
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
    if (totalReturn <= 0) {
      // אובדן מלא או יותר - הערך הסופי אפס/שלילי, התשואה השנתית היא -100%
      annualizedROI = -100;
    } else {
      annualizedROI = (Math.pow(totalReturn / totalCost, 1 / years) - 1) * 100;
    }
  }

  return {
    netProfit,
    roi,
    annualizedROI,
    totalReturn,
    isPositive: netProfit > 0,
  };
}
