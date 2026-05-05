/**
 * Goal Tracking Engine
 *
 * עוקב אחרי יעדים שהוגדרו: הכנסות, רווח, EBITDA, מזומן, lapuk.
 * משווה ערך נוכחי לערך צפוי וליעד → מחשב סטטוס + on/off track.
 */

import type { Goal, GoalProgress, MonthlyBudget, MonthlyCashFlow } from './types';
import { calculateBudgetTotals } from './budget-engine';

/**
 * חשב התקדמות של יעד.
 */
export function calculateGoalProgress(
  goal: Goal,
  monthly: MonthlyBudget[],
  cashFlow: MonthlyCashFlow[],
): GoalProgress {
  const today = new Date();
  const targetDate = new Date(goal.targetDate);
  const now = monthly[0] ? new Date() : today;

  // ערך נוכחי לפי סוג היעד
  let currentValue = 0;
  let projectedValue = 0;

  const totals = calculateBudgetTotals(monthly);

  switch (goal.type) {
    case 'revenue':
      currentValue = totals.income;
      projectedValue = currentValue; // sum-to-date
      break;
    case 'arr':
      // ARR = הכנסה חודשית אחרונה × 12
      currentValue = (monthly[monthly.length - 1]?.income ?? 0) * 12;
      projectedValue = currentValue;
      break;
    case 'profit':
      currentValue = totals.netProfit;
      projectedValue = currentValue;
      break;
    case 'ebitda':
      currentValue = totals.ebitda;
      projectedValue = currentValue;
      break;
    case 'cashBalance':
      currentValue = cashFlow[cashFlow.length - 1]?.closingBalance ?? 0;
      projectedValue = currentValue;
      break;
    case 'runway': {
      const lastBurn = cashFlow.slice(-3).reduce((s, m) => s + (m.netCashFlow < 0 ? Math.abs(m.netCashFlow) : 0), 0) / 3;
      const cash = cashFlow[cashFlow.length - 1]?.closingBalance ?? 0;
      currentValue = lastBurn > 0 ? cash / lastBurn : 999;
      projectedValue = currentValue;
      break;
    }
    case 'customers':
    case 'custom':
      currentValue = 0; // user-managed manually
      projectedValue = 0;
      break;
  }

  const pctComplete = goal.targetValue > 0 ? (currentValue / goal.targetValue) * 100 : 0;
  const gap = goal.targetValue - currentValue;

  // קצב נדרש vs קצב נוכחי
  const monthsTotal = Math.max(
    1,
    (targetDate.getFullYear() - today.getFullYear()) * 12 +
      targetDate.getMonth() -
      today.getMonth(),
  );
  // נחשב את הקצב הצפוי מהממוצע החודשי
  const monthsElapsed = monthly.length;
  const expectedAtNow =
    monthsTotal > 0
      ? goal.targetValue * (monthsElapsed / (monthsTotal + monthsElapsed))
      : 0;

  let status: GoalProgress['status'];
  if (pctComplete >= 100) status = 'achieved';
  else if (currentValue >= expectedAtNow * 1.05) status = 'ahead';
  else if (currentValue >= expectedAtNow * 0.95) status = 'on_track';
  else if (currentValue >= expectedAtNow * 0.7) status = 'at_risk';
  else status = 'behind';

  const onTrack = status === 'ahead' || status === 'on_track' || status === 'achieved';

  return {
    goal,
    currentValue,
    projectedValue,
    pctComplete,
    onTrack,
    status,
    gap,
  };
}

export const GOAL_TYPE_LABELS: Record<Goal['type'], string> = {
  revenue: 'הכנסות',
  arr: 'ARR (הכנסה שנתית מתחזית)',
  profit: 'רווח נקי',
  ebitda: 'EBITDA',
  cashBalance: 'יתרת מזומן',
  runway: 'Cash Runway (חודשים)',
  customers: 'מספר לקוחות',
  custom: 'יעד מותאם',
};
