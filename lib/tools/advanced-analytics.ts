/**
 * אנליזות מתקדמות לתקציב:
 * - Sensitivity Analysis (ניתוח רגישות)
 * - Forecasting Engine (תחזיות)
 * - Break-Even Analysis בתקציב
 * - Financial Ratios
 */

import type { BudgetData, MonthlyBudget, PeriodSettings } from './types';
import { calculateAllMonths, calculateBudgetTotals } from './budget-engine';

// ============================================================
// SENSITIVITY ANALYSIS
// ============================================================

export interface SensitivityCell {
  incomeChange: number; // %
  expenseChange: number; // %
  netProfit: number;
  margin: number;
}

/**
 * מטריצת חום של רווח לפי שינוי הכנסות והוצאות
 * שינויים: -30%, -20%, -10%, 0%, +10%, +20%, +30%
 */
export function calculateSensitivityMatrix(
  budget: BudgetData,
  settings: PeriodSettings,
): SensitivityCell[][] {
  const changes = [-30, -20, -10, 0, 10, 20, 30];
  const matrix: SensitivityCell[][] = [];

  for (const incomeChange of changes) {
    const row: SensitivityCell[] = [];
    for (const expenseChange of changes) {
      // צור עותק של ה-budget עם השינויים
      const modifiedBudget: BudgetData = {
        ...budget,
        income: budget.income.map((i) => ({
          ...i,
          amount: i.amount * (1 + incomeChange / 100),
        })),
        expenses: budget.expenses.map((e) => ({
          ...e,
          amount: e.amount * (1 + expenseChange / 100),
        })),
        employees: budget.employees.map((emp) => ({
          ...emp,
          monthlySalary: emp.monthlySalary * (1 + expenseChange / 100),
        })),
      };

      const monthly = calculateAllMonths(modifiedBudget, settings);
      const totals = calculateBudgetTotals(monthly);

      row.push({
        incomeChange,
        expenseChange,
        netProfit: totals.netProfit,
        margin: totals.netMargin,
      });
    }
    matrix.push(row);
  }

  return matrix;
}

// ============================================================
// FORECASTING ENGINE
// ============================================================

export type ForecastMethod = 'moving-average' | 'exponential' | 'linear' | 'weighted';

export interface ForecastInput {
  historicalData: number[]; // נתוני עבר (לפחות 3 ערכים)
  monthsToForecast: number;
  method: ForecastMethod;
  alpha?: number; // לExponential Smoothing (0-1)
  windowSize?: number; // ל-Moving Average
}

export interface ForecastResult {
  predicted: number[];
  confidence: { upper: number[]; lower: number[] };
  method: ForecastMethod;
  trend: 'up' | 'down' | 'stable';
  confidence_level: number;
}

export function forecast(input: ForecastInput): ForecastResult {
  const { historicalData, monthsToForecast, method } = input;

  if (historicalData.length < 3) {
    return {
      predicted: Array(monthsToForecast).fill(historicalData[0] ?? 0),
      confidence: {
        upper: Array(monthsToForecast).fill(0),
        lower: Array(monthsToForecast).fill(0),
      },
      method,
      trend: 'stable',
      confidence_level: 0,
    };
  }

  let predicted: number[] = [];

  switch (method) {
    case 'moving-average': {
      const window = input.windowSize ?? 3;
      const data = [...historicalData];
      for (let i = 0; i < monthsToForecast; i++) {
        const lastN = data.slice(-window);
        const avg = lastN.reduce((s, v) => s + v, 0) / lastN.length;
        predicted.push(avg);
        data.push(avg);
      }
      break;
    }

    case 'exponential': {
      const alpha = input.alpha ?? 0.3;
      let level = historicalData[0];
      for (let i = 1; i < historicalData.length; i++) {
        level = alpha * historicalData[i] + (1 - alpha) * level;
      }
      for (let i = 0; i < monthsToForecast; i++) {
        predicted.push(level);
      }
      break;
    }

    case 'linear': {
      // y = mx + b
      const n = historicalData.length;
      const sumX = (n * (n - 1)) / 2;
      const sumY = historicalData.reduce((s, v) => s + v, 0);
      const sumXY = historicalData.reduce((s, v, i) => s + v * i, 0);
      const sumX2 = historicalData.reduce((s, _, i) => s + i * i, 0);

      const m = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
      const b = (sumY - m * sumX) / n;

      for (let i = 0; i < monthsToForecast; i++) {
        predicted.push(b + m * (n + i));
      }
      break;
    }

    case 'weighted': {
      const window = Math.min(historicalData.length, 4);
      const weights = Array.from({ length: window }, (_, i) => i + 1);
      const weightSum = weights.reduce((s, w) => s + w, 0);

      const data = [...historicalData];
      for (let i = 0; i < monthsToForecast; i++) {
        const lastN = data.slice(-window);
        let weightedSum = 0;
        for (let j = 0; j < lastN.length; j++) {
          weightedSum += lastN[j] * weights[j];
        }
        const wAvg = weightedSum / weightSum;
        predicted.push(wAvg);
        data.push(wAvg);
      }
      break;
    }
  }

  // טווח ביטחון פשוט - 10%
  const upper = predicted.map((p) => p * 1.1);
  const lower = predicted.map((p) => p * 0.9);

  // טרנד
  const recentAvg =
    historicalData.slice(-3).reduce((s, v) => s + v, 0) / Math.min(3, historicalData.length);
  const futureAvg = predicted.reduce((s, v) => s + v, 0) / predicted.length;
  const trend: 'up' | 'down' | 'stable' =
    futureAvg > recentAvg * 1.05 ? 'up' : futureAvg < recentAvg * 0.95 ? 'down' : 'stable';

  return {
    predicted,
    confidence: { upper, lower },
    method,
    trend,
    confidence_level: 0.9,
  };
}

// ============================================================
// BREAK-EVEN ANALYSIS (in budget context)
// ============================================================

export interface BudgetBreakEvenResult {
  fixedCosts: number;
  variableCosts: number;
  totalCosts: number;
  totalRevenue: number;
  contributionMargin: number;
  contributionMarginRatio: number; // אחוז
  breakEvenRevenue: number;
  marginOfSafety: number;
  marginOfSafetyPct: number;
  isAboveBreakEven: boolean;
}

/**
 * חישוב break-even מתוך נתוני התקציב
 * עלויות קבועות = הוצאות חודשיות שאינן % הכנסה
 * עלויות משתנות = הוצאות שהן % הכנסה
 */
export function calculateBudgetBreakEven(
  budget: BudgetData,
  settings: PeriodSettings,
): BudgetBreakEvenResult {
  const monthly = calculateAllMonths(budget, settings);
  const totals = calculateBudgetTotals(monthly);

  // חלוקה לעלויות קבועות ומשתנות
  let fixedCosts = 0;
  let variableCosts = 0;

  for (const exp of budget.expenses) {
    const total = exp.isPct
      ? totals.income * (exp.percentage / 100)
      : exp.amount * Math.min(exp.duration, settings.monthsToShow);

    if (exp.isPct) {
      variableCosts += total;
    } else {
      fixedCosts += total;
    }
  }

  // עובדים תמיד קבועים
  for (const emp of budget.employees) {
    const months = emp.endMonth ?? settings.monthsToShow - 1;
    const duration = Math.max(0, Math.min(months, settings.monthsToShow - 1) - emp.startMonth + 1);
    fixedCosts += emp.monthlySalary * duration;
  }

  const totalCosts = fixedCosts + variableCosts;
  const totalRevenue = totals.income;
  const contributionMargin = totalRevenue - variableCosts;
  const contributionMarginRatio =
    totalRevenue > 0 ? (contributionMargin / totalRevenue) * 100 : 0;
  const breakEvenRevenue =
    contributionMarginRatio > 0 ? fixedCosts / (contributionMarginRatio / 100) : 0;
  const marginOfSafety = totalRevenue - breakEvenRevenue;
  const marginOfSafetyPct = totalRevenue > 0 ? (marginOfSafety / totalRevenue) * 100 : 0;
  const isAboveBreakEven = totalRevenue >= breakEvenRevenue;

  return {
    fixedCosts,
    variableCosts,
    totalCosts,
    totalRevenue,
    contributionMargin,
    contributionMarginRatio,
    breakEvenRevenue,
    marginOfSafety,
    marginOfSafetyPct,
    isAboveBreakEven,
  };
}

// ============================================================
// FINANCIAL RATIOS (in budget)
// ============================================================

export interface BudgetRatios {
  // רווחיות
  grossMargin: number;
  operatingMargin: number;
  netMargin: number;
  ebitdaMargin: number;
  // יעילות
  roi: number; // ROI % - net profit / total expenses
  // יציבות פיננסית
  debtToIncome: number; // הלוואות / הכנסה
  interestCoverage: number; // EBIT / הוצאות מימון
  // צמיחה
  monthlyIncomeGrowth: number; // % ממוצע
}

export function calculateBudgetRatios(
  monthly: MonthlyBudget[],
  budget: BudgetData,
): BudgetRatios {
  const totals = calculateBudgetTotals(monthly);

  // ROI
  const roi = totals.totalExpenses > 0 ? (totals.netProfit / totals.totalExpenses) * 100 : 0;

  // Debt to Income
  const totalLoans = budget.loans.reduce((s, l) => s + l.amount, 0);
  const debtToIncome = totals.income > 0 ? (totalLoans / totals.income) * 100 : 0;

  // Interest Coverage
  const interestCoverage =
    totals.financial > 0 ? totals.operatingProfit / totals.financial : 0;

  // Income Growth
  let totalGrowth = 0;
  let growthCount = 0;
  for (let i = 1; i < monthly.length; i++) {
    if (monthly[i - 1].income > 0) {
      totalGrowth += ((monthly[i].income - monthly[i - 1].income) / monthly[i - 1].income) * 100;
      growthCount++;
    }
  }
  const monthlyIncomeGrowth = growthCount > 0 ? totalGrowth / growthCount : 0;

  return {
    grossMargin: totals.grossMargin,
    operatingMargin: totals.operatingMargin,
    netMargin: totals.netMargin,
    ebitdaMargin: totals.ebitdaMargin,
    roi,
    debtToIncome,
    interestCoverage,
    monthlyIncomeGrowth,
  };
}
