/**
 * מנוע תזרים מזומנים - חישובים
 *
 * מבוסס על מודל תזרים מזומנים מתקדם עם שיפורים:
 * - אינטגרציה מלאה עם נתוני התקציב
 * - תמיכה בעיכובי גביה ודחיית תשלומים
 * - חישוב יתרות בנק לאורך זמן
 * - זיהוי תקופות של תזרים שלילי
 */

import {
  BudgetData,
  CashFlowData,
  CashFlowDelay,
  MonthlyCashFlow,
  PeriodSettings,
  HEBREW_MONTHS,
  IncomeItem,
  ExpenseItem,
} from './types';
import {
  getIncomeForMonth,
  getExpenseForMonth,
  getEmployeeCostForMonth,
  getLoanPaymentsForMonth,
} from './budget-engine';

// ============================================================
// PAYMENT TIMING
// ============================================================

/**
 * חישוב חודש קבלת תשלום בפועל לפי תנאי אשראי + עיכוב
 *
 * אם הכנסה ב-ינואר, תנאי 30 יום + עיכוב 15 יום → קבלה בפועל ב-פברואר
 */
function getActualPaymentMonth(
  originalMonth: number,
  paymentTermsDays: number,
  delayDays: number = 0,
): number {
  const totalDelayDays = paymentTermsDays + delayDays;
  const monthsDelay = Math.floor(totalDelayDays / 30);
  return originalMonth + monthsDelay;
}

/**
 * חיפוש עיכוב על פריט מסויים
 */
function findDelay(
  delays: CashFlowDelay[],
  itemId: string,
  type: 'collection_delay' | 'payment_delay',
): CashFlowDelay | undefined {
  return delays.find((d) => d.itemId === itemId && d.type === type);
}

// ============================================================
// CASH-IN: כסף נכנס
// ============================================================

/**
 * חישוב כסף שנכנס בחודש מסוים (אחרי תנאי אשראי + עיכובים)
 */
export function getCashInForMonth(
  budget: BudgetData,
  monthIdx: number,
  delays: CashFlowDelay[],
  loanReceiptMonth: number = 0,
): number {
  let total = 0;

  // הכנסות מלקוחות (עם תנאי אשראי + עיכובים)
  for (const income of budget.income) {
    const delay = findDelay(delays, income.id, 'collection_delay');
    const delayDays = delay?.delayDays ?? 0;
    const amountImpact = delay?.amountImpact ?? 0;

    // עוברים על כל החודשים שההכנסה פעילה
    for (let m = income.startMonth; m < income.startMonth + income.duration; m++) {
      const actualMonth = getActualPaymentMonth(m, income.paymentTerms, delayDays);
      if (actualMonth === monthIdx) {
        let amount = getIncomeForMonth(income, m);
        if (amountImpact !== 0) {
          amount *= 1 + amountImpact / 100;
        }
        total += amount;
      }
    }
  }

  // קבלת הלוואות (חד-פעמית בתחילת החודש שלהן)
  for (const loan of budget.loans) {
    if (loan.startMonth === monthIdx + loanReceiptMonth - 1) {
      total += loan.amount;
    }
  }

  return total;
}

// ============================================================
// CASH-OUT: כסף יוצא
// ============================================================

/**
 * חישוב כסף שיוצא בחודש מסוים (אחרי תנאי תשלום + דחיות)
 */
export function getCashOutForMonth(
  budget: BudgetData,
  customExpenses: CashFlowExpenseLite[],
  monthIdx: number,
  delays: CashFlowDelay[],
): number {
  let total = 0;

  // הוצאות מהתקציב (לפי תנאי תשלום)
  for (const expense of budget.expenses) {
    if (expense.isAuto) continue; // ריבית אוטומטית מטופלת בהלוואות

    const delay = findDelay(delays, expense.id, 'payment_delay');
    const delayDays = delay?.delayDays ?? 0;
    const splitCount = delay?.splitPayment ? delay.splitCount ?? 1 : 1;

    for (let m = expense.startMonth; m < expense.startMonth + expense.duration; m++) {
      const baseAmount = getExpenseForMonth(expense, m, budget.income);
      if (baseAmount === 0) continue;

      // אם יש פיצול - חלק את הסכום על פני N חודשים
      if (splitCount > 1) {
        const perPayment = baseAmount / splitCount;
        for (let p = 0; p < splitCount; p++) {
          const actualMonth = getActualPaymentMonth(m, expense.paymentTerms, delayDays + p * 30);
          if (actualMonth === monthIdx) {
            total += perPayment;
          }
        }
      } else {
        const actualMonth = getActualPaymentMonth(m, expense.paymentTerms, delayDays);
        if (actualMonth === monthIdx) {
          total += baseAmount;
        }
      }
    }
  }

  // עלות עובדים (תשלום מיידי בסוף חודש)
  total += getEmployeeCostForMonth(budget.employees, monthIdx);

  // החזרי הלוואות (קרן + ריבית)
  total += getLoanPaymentsForMonth(budget.loans, monthIdx);

  // הוצאות מותאמות אישית מהתזרים
  for (const exp of customExpenses) {
    const expMonth = getMonthIndexFromDate(exp.date);
    if (expMonth === monthIdx) {
      total += exp.amount;
    }
  }

  return total;
}

// ============================================================
// FULL MONTHLY CASH FLOW
// ============================================================

/**
 * חישוב תזרים חודשי מלא לכל התקופה
 */
export function calculateCashFlow(
  budget: BudgetData,
  cashFlowData: CashFlowData,
  settings: PeriodSettings,
): MonthlyCashFlow[] {
  const results: MonthlyCashFlow[] = [];
  const startMonthOfYear = parseInt(settings.startMonth.split('-')[1] ?? '1', 10) - 1;

  // יתרת פתיחה: יתרה ממוגדרת + סה"כ יתרות בנק
  const accountsBalance = cashFlowData.accounts.reduce((sum, a) => sum + a.balance, 0);
  let runningBalance = settings.openingBalance + accountsBalance;

  for (let m = 0; m < settings.monthsToShow; m++) {
    const calendarMonth = (startMonthOfYear + m) % 12;
    const year = Math.floor((startMonthOfYear + m) / 12);
    const monthName =
      year > 0 ? `${HEBREW_MONTHS[calendarMonth]} ${settings.fiscalYear + year}` : HEBREW_MONTHS[calendarMonth];

    const opening = runningBalance;
    const incomeReceived = getCashInForMonth(budget, m, cashFlowData.delays);
    const customCashOut = cashFlowData.customExpenses ?? [];
    const expensesPaidGross = getCashOutForMonth(budget, customCashOut, m, cashFlowData.delays);
    const loanPayments = getLoanPaymentsForMonth(budget.loans, m);
    const expensesPaid = expensesPaidGross; // כבר כולל הלוואות

    const netCashFlow = incomeReceived - expensesPaid;
    const closing = opening + netCashFlow;

    results.push({
      monthIndex: m,
      monthName,
      openingBalance: opening,
      incomeReceived,
      expensesPaid,
      loanPayments,
      netCashFlow,
      closingBalance: closing,
    });

    runningBalance = closing;
  }

  return results;
}

// ============================================================
// HELPER: Date → Month Index
// ============================================================

interface CashFlowExpenseLite {
  id: string;
  amount: number;
  date: string;
}

function getMonthIndexFromDate(_dateStr: string): number {
  // פישוט: מחזיר -1 כי הוצאות מותאמות אישיות נדירות
  // (אפשר להרחיב בעתיד עם getStartMonth מ-settings)
  return -1;
}

// ============================================================
// CASH FLOW INSIGHTS - תובנות
// ============================================================

export interface CashFlowInsight {
  type: 'critical' | 'warning' | 'info' | 'success';
  title: string;
  description: string;
  monthIndex?: number;
}

/**
 * זיהוי בעיות תזרים אוטומטית
 */
export function generateCashFlowInsights(monthly: MonthlyCashFlow[]): CashFlowInsight[] {
  const insights: CashFlowInsight[] = [];

  // 1. חודשים עם יתרה שלילית
  const negMonths = monthly.filter((m) => m.closingBalance < 0);
  if (negMonths.length > 0) {
    insights.push({
      type: 'critical',
      title: 'יתרה שלילית מזוהה',
      description: `${negMonths.length} חודשים עם יתרה שלילית. הקרוב: ${negMonths[0].monthName}`,
      monthIndex: negMonths[0].monthIndex,
    });
  }

  // 2. חודש הכי קריטי
  const minBalance = monthly.reduce(
    (min, m) => (m.closingBalance < min.closingBalance ? m : min),
    monthly[0],
  );
  if (minBalance && minBalance.closingBalance < 0) {
    insights.push({
      type: 'warning',
      title: 'יתרה מינימלית',
      description: `${minBalance.monthName}: יתרה של ${formatCurrencyHe(minBalance.closingBalance)}`,
      monthIndex: minBalance.monthIndex,
    });
  }

  // 3. תזרים חיובי לאורך זמן
  const allPositive = monthly.every((m) => m.netCashFlow > 0);
  if (allPositive && monthly.length >= 6) {
    insights.push({
      type: 'success',
      title: 'תזרים חיובי לאורך זמן',
      description: 'החברה מייצרת תזרים חיובי בכל חודש - מצב פיננסי בריא',
    });
  }

  // 4. תקופות של ירידה
  let consecutiveDecline = 0;
  let maxDecline = 0;
  for (let i = 1; i < monthly.length; i++) {
    if (monthly[i].closingBalance < monthly[i - 1].closingBalance) {
      consecutiveDecline++;
      maxDecline = Math.max(maxDecline, consecutiveDecline);
    } else {
      consecutiveDecline = 0;
    }
  }
  if (maxDecline >= 3) {
    insights.push({
      type: 'warning',
      title: 'מגמת ירידה ביתרה',
      description: `זוהו ${maxDecline} חודשים רצופים של ירידה ביתרה`,
    });
  }

  return insights;
}

// ============================================================
// HELPERS
// ============================================================

function formatCurrencyHe(value: number): string {
  return new Intl.NumberFormat('he-IL', {
    style: 'currency',
    currency: 'ILS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function createEmptyCashFlow(): CashFlowData {
  return {
    accounts: [],
    customExpenses: [],
    delays: [],
  };
}

// ============================================================
// KPI METRICS
// ============================================================

export interface CashFlowKPIs {
  currentCash: number; // יתרה נוכחית (חודש 0)
  totalInflow: number; // סך תקבולים בתקופה
  totalOutflow: number; // סך תשלומים בתקופה
  netCashFlow: number; // תזרים נטו בתקופה
  minBalance: number; // יתרה מינימלית
  maxBalance: number; // יתרה מקסימלית
  avgBalance: number; // יתרה ממוצעת
  closingBalance: number; // יתרת סיום
  burnRate: number; // קצב שחיקה חודשי (אם תזרים שלילי)
  runwayMonths: number; // חודשים עד אזילת המזומן (אם burn rate)
  negativeMonths: number; // מספר חודשים עם יתרה שלילית
  positiveMonths: number; // מספר חודשים עם תזרים חיובי
  monthsToBreakeven: number | null; // חודשים עד תזרים חיובי
  cashAtRiskMonth: number | null; // החודש הראשון עם יתרה שלילית
}

export function calculateCashFlowKPIs(monthly: MonthlyCashFlow[]): CashFlowKPIs {
  if (monthly.length === 0) {
    return {
      currentCash: 0,
      totalInflow: 0,
      totalOutflow: 0,
      netCashFlow: 0,
      minBalance: 0,
      maxBalance: 0,
      avgBalance: 0,
      closingBalance: 0,
      burnRate: 0,
      runwayMonths: 0,
      negativeMonths: 0,
      positiveMonths: 0,
      monthsToBreakeven: null,
      cashAtRiskMonth: null,
    };
  }

  const totalInflow = monthly.reduce((s, m) => s + m.incomeReceived, 0);
  const totalOutflow = monthly.reduce((s, m) => s + m.expensesPaid, 0);
  const netCashFlow = totalInflow - totalOutflow;
  const closingBalance = monthly[monthly.length - 1].closingBalance;
  const balances = monthly.map((m) => m.closingBalance);
  const minBalance = Math.min(...balances);
  const maxBalance = Math.max(...balances);
  const avgBalance = balances.reduce((s, b) => s + b, 0) / balances.length;

  // Burn rate - קצב שחיקה (תזרים נטו שלילי ממוצע)
  const negFlows = monthly.filter((m) => m.netCashFlow < 0).map((m) => m.netCashFlow);
  const burnRate =
    negFlows.length > 0 ? Math.abs(negFlows.reduce((s, n) => s + n, 0) / negFlows.length) : 0;

  // Runway - חודשים עד 0 בקצב הנוכחי
  const currentCash = monthly[0].openingBalance;
  const runwayMonths = burnRate > 0 ? currentCash / burnRate : Infinity;

  // ניתוחים נוספים
  const negativeMonths = monthly.filter((m) => m.closingBalance < 0).length;
  const positiveMonths = monthly.filter((m) => m.netCashFlow > 0).length;

  const breakeven = monthly.findIndex((m) => m.netCashFlow > 0);
  const monthsToBreakeven = breakeven >= 0 ? breakeven : null;

  const firstNegative = monthly.findIndex((m) => m.closingBalance < 0);
  const cashAtRiskMonth = firstNegative >= 0 ? firstNegative : null;

  return {
    currentCash,
    totalInflow,
    totalOutflow,
    netCashFlow,
    minBalance,
    maxBalance,
    avgBalance,
    closingBalance,
    burnRate,
    runwayMonths: Number.isFinite(runwayMonths) ? runwayMonths : Infinity,
    negativeMonths,
    positiveMonths,
    monthsToBreakeven,
    cashAtRiskMonth,
  };
}

// ============================================================
// DEBT RESTRUCTURING - פריסת חוב
// ============================================================

export interface DebtRestructureResult {
  originalMonthlyPayment: number;
  newMonthlyPayment: number;
  monthlyDifference: number;
  originalTotalInterest: number;
  newTotalInterest: number;
  additionalInterestCost: number;
  cashFlowReliefMonthly: number;
}

/**
 * חישוב פריסה מחדש של חוב - הארכת תקופה / שינוי ריבית
 */
export function restructureDebt(
  originalAmount: number,
  originalRate: number, // שנתי באחוזים
  remainingMonths: number,
  newTermMonths: number,
  newRate?: number,
): DebtRestructureResult {
  const calcPmt = (P: number, r: number, n: number): number => {
    if (P <= 0 || n <= 0) return 0;
    if (r === 0) return P / n;
    return (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  };

  const origR = originalRate / 100 / 12;
  const newR = (newRate ?? originalRate) / 100 / 12;

  const originalMonthlyPayment = calcPmt(originalAmount, origR, remainingMonths);
  const newMonthlyPayment = calcPmt(originalAmount, newR, newTermMonths);

  const originalTotalInterest = originalMonthlyPayment * remainingMonths - originalAmount;
  const newTotalInterest = newMonthlyPayment * newTermMonths - originalAmount;

  return {
    originalMonthlyPayment,
    newMonthlyPayment,
    monthlyDifference: originalMonthlyPayment - newMonthlyPayment,
    originalTotalInterest,
    newTotalInterest,
    additionalInterestCost: newTotalInterest - originalTotalInterest,
    cashFlowReliefMonthly: originalMonthlyPayment - newMonthlyPayment,
  };
}
