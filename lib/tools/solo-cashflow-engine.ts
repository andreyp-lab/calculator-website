/**
 * Solo Cash Flow Engine
 *
 * תזרים מזומנים ללא תקציב - מבוסס ישירות על רשימת פריטים.
 * המשתמש מזין תקבולים/תשלומים עם תאריכים, והמנוע:
 * - מרחיב פריטים חוזרים לכל חודש בתקופה
 * - מקבץ לפי חודש
 * - מחשב יתרות מצטברות
 * - מחזיר אותו פורמט MonthlyCashFlow כמו הגרסה הרגילה
 */

import type {
  SoloCashFlowItem,
  SoloCashFlowData,
  MonthlyCashFlow,
  SoloRecurringFrequency,
  SoloIncomeCategory,
  SoloExpenseCategory,
} from './types';

// ============================================================
// EXPAND RECURRING ITEMS
// ============================================================

/**
 * המר תאריך ISO ל-month index יחסי לתאריך התחלה.
 */
function getMonthsBetween(start: string, end: string): number {
  const s = new Date(start);
  const e = new Date(end);
  return (e.getFullYear() - s.getFullYear()) * 12 + (e.getMonth() - s.getMonth());
}

function addMonths(date: string, months: number): string {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d.toISOString().split('T')[0];
}

function addDays(date: string, days: number): string {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

/**
 * הרחב פריט חוזר לרשימת מופעים.
 */
export function expandRecurringItem(
  item: SoloCashFlowItem,
  projectionStart: string,
  projectionEnd: string,
): SoloCashFlowItem[] {
  if (item.recurring === 'once') {
    return [item];
  }

  const occurrences: SoloCashFlowItem[] = [];
  const endDate = item.recurringEnd ?? projectionEnd;
  const finalEnd = new Date(endDate) < new Date(projectionEnd) ? endDate : projectionEnd;

  let current = item.date;
  let counter = 0;
  const maxIterations = 1000; // safety

  while (new Date(current) <= new Date(finalEnd) && counter < maxIterations) {
    if (new Date(current) >= new Date(projectionStart)) {
      occurrences.push({
        ...item,
        id: `${item.id}_${counter}`,
        date: current,
        recurring: 'once', // expanded copy is one-time
      });
    }

    // Advance based on frequency
    switch (item.recurring) {
      case 'weekly':
        current = addDays(current, 7);
        break;
      case 'monthly':
        current = addMonths(current, 1);
        break;
      case 'quarterly':
        current = addMonths(current, 3);
        break;
      case 'yearly':
        current = addMonths(current, 12);
        break;
      default:
        return occurrences;
    }
    counter++;
  }

  return occurrences;
}

/**
 * הרחב את כל הפריטים החוזרים בנתונים.
 */
export function expandAllItems(data: SoloCashFlowData): SoloCashFlowItem[] {
  const projectionEnd = addMonths(data.startDate, data.monthsToProject);
  return data.items.flatMap((item) => expandRecurringItem(item, data.startDate, projectionEnd));
}

// ============================================================
// MONTHLY CASH FLOW
// ============================================================

const HEBREW_MONTHS = [
  'ינואר',
  'פברואר',
  'מרץ',
  'אפריל',
  'מאי',
  'יוני',
  'יולי',
  'אוגוסט',
  'ספטמבר',
  'אוקטובר',
  'נובמבר',
  'דצמבר',
];

/**
 * חשב תזרים חודשי מנתוני Solo.
 */
export function calculateSoloCashFlow(data: SoloCashFlowData): MonthlyCashFlow[] {
  const allItems = expandAllItems(data);
  const startDate = new Date(data.startDate);
  const accountsBalance = data.accounts.reduce((sum, a) => sum + a.balance, 0);
  const openingBalance = accountsBalance; // Solo doesn't have settings.openingBalance

  let runningBalance = openingBalance;
  const results: MonthlyCashFlow[] = [];

  for (let m = 0; m < data.monthsToProject; m++) {
    const monthStart = new Date(startDate);
    monthStart.setMonth(monthStart.getMonth() + m);
    const monthEnd = new Date(monthStart);
    monthEnd.setMonth(monthEnd.getMonth() + 1);
    monthEnd.setDate(0); // last day of month

    // Filter items in this month
    const monthItems = allItems.filter((item) => {
      const itemDate = new Date(item.date);
      return (
        itemDate.getFullYear() === monthStart.getFullYear() &&
        itemDate.getMonth() === monthStart.getMonth()
      );
    });

    const incomeReceived = monthItems
      .filter((i) => i.type === 'in')
      .reduce((sum, i) => sum + i.amount, 0);
    const expensesPaid = monthItems
      .filter((i) => i.type === 'out')
      .reduce((sum, i) => sum + i.amount, 0);
    const loanPayments = monthItems
      .filter((i) => i.type === 'out' && i.category === 'loan_payment')
      .reduce((sum, i) => sum + i.amount, 0);

    const netCashFlow = incomeReceived - expensesPaid;
    const opening = runningBalance;
    const closing = opening + netCashFlow;

    const monthName = `${HEBREW_MONTHS[monthStart.getMonth()]} ${monthStart.getFullYear()}`;

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
// AGGREGATIONS
// ============================================================

export interface SoloCategoryBreakdown {
  category: string;
  total: number;
  count: number;
  pctOfTotal: number;
}

export function getCategoryBreakdown(
  data: SoloCashFlowData,
  type: 'in' | 'out',
): SoloCategoryBreakdown[] {
  const allItems = expandAllItems(data);
  const items = allItems.filter((i) => i.type === type);
  const total = items.reduce((s, i) => s + i.amount, 0);

  const byCategory = items.reduce<Record<string, { total: number; count: number }>>((acc, i) => {
    if (!acc[i.category]) acc[i.category] = { total: 0, count: 0 };
    acc[i.category].total += i.amount;
    acc[i.category].count++;
    return acc;
  }, {});

  return Object.entries(byCategory)
    .map(([category, { total: catTotal, count }]) => ({
      category,
      total: catTotal,
      count,
      pctOfTotal: total > 0 ? (catTotal / total) * 100 : 0,
    }))
    .sort((a, b) => b.total - a.total);
}

// ============================================================
// LABELS
// ============================================================

export const INCOME_CATEGORY_LABELS: Record<SoloIncomeCategory, string> = {
  sales: 'מכירות',
  service: 'שירותים',
  investment: 'השקעות',
  loan_received: 'הלוואה התקבלה',
  refund: 'החזרים',
  other_income: 'אחר',
};

export const EXPENSE_CATEGORY_LABELS: Record<SoloExpenseCategory, string> = {
  rent: 'שכירות',
  salary: 'שכר',
  supplier: 'ספקים',
  tax: 'מיסים',
  utilities: 'חשמל/מים/גז',
  marketing: 'שיווק',
  equipment: 'ציוד',
  insurance: 'ביטוחים',
  professional: 'שירותים מקצועיים',
  loan_payment: 'החזר הלוואה',
  other_expense: 'אחר',
};

export const RECURRING_LABELS: Record<SoloRecurringFrequency, string> = {
  once: 'חד-פעמי',
  weekly: 'שבועי',
  monthly: 'חודשי',
  quarterly: 'רבעוני',
  yearly: 'שנתי',
};

// ============================================================
// FACTORIES
// ============================================================

export function createEmptySoloData(): SoloCashFlowData {
  const today = new Date().toISOString().split('T')[0];
  return {
    items: [],
    accounts: [],
    monthsToProject: 12,
    startDate: today,
    currency: 'ILS',
  };
}

/**
 * נתונים לדוגמה למשתמש חדש (כדי שייראה איך זה עובד).
 */
export function createSampleSoloData(): SoloCashFlowData {
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  const id = () => Math.random().toString(36).slice(2, 10);

  return {
    accounts: [
      { id: id(), name: 'חשבון עיקרי', balance: 50000, asOfDate: todayStr },
    ],
    monthsToProject: 12,
    startDate: todayStr,
    currency: 'ILS',
    items: [
      {
        id: id(),
        date: todayStr,
        type: 'in',
        amount: 35000,
        category: 'sales',
        description: 'מכירות חודשיות',
        recurring: 'monthly',
      },
      {
        id: id(),
        date: todayStr,
        type: 'out',
        amount: 8000,
        category: 'rent',
        description: 'שכירות משרד',
        recurring: 'monthly',
      },
      {
        id: id(),
        date: todayStr,
        type: 'out',
        amount: 18000,
        category: 'salary',
        description: 'שכר עובדים',
        recurring: 'monthly',
      },
      {
        id: id(),
        date: todayStr,
        type: 'out',
        amount: 2500,
        category: 'utilities',
        description: 'חשמל + תקשורת',
        recurring: 'monthly',
      },
    ],
  };
}
