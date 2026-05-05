/**
 * מנוע תקציב - חישובים פיננסיים
 *
 * מבוסס על ProfitMargin Budget Dashboard עם שיפורים:
 * - TypeScript טיפוסים מלאים
 * - חישובים מדויקים לכל אורך התקופה (לא רק 12 חודשים)
 * - תמיכה בהוצאות אחוזיות מקושרות
 * - PMT formula מדויק להלוואות
 */

import {
  BudgetData,
  IncomeItem,
  ExpenseItem,
  ExpenseCategory,
  Loan,
  Employee,
  MonthlyBudget,
  PeriodSettings,
  HEBREW_MONTHS,
} from './types';

// ============================================================
// HELPER: Effective months for period
// ============================================================

/**
 * חישוב מספר חודשים יעיל בתוך התקופה
 */
function effectiveMonths(startMonth: number, duration: number, totalMonths: number): number {
  return Math.max(0, Math.min(duration, totalMonths - startMonth));
}

/**
 * חישוב הכנסה כוללת עם צמיחה (סכום סדרה גיאומטרית)
 *
 * נוסחה: Sum = A × ((1+r)^n - 1) / r
 * אם r=0: Sum = A × n
 */
export function calculateIncomeTotal(income: IncomeItem, totalMonths: number): number {
  const n = effectiveMonths(income.startMonth, income.duration, totalMonths);
  if (n <= 0) return 0;

  if (income.growthPct && income.growthPct !== 0) {
    const r = income.growthPct / 100;
    return income.amount * ((Math.pow(1 + r, n) - 1) / r);
  }
  return income.amount * n;
}

/**
 * חישוב הכנסה לחודש ספציפי (כולל צמיחה מצטברת)
 */
export function getIncomeForMonth(income: IncomeItem, monthIdx: number): number {
  const offset = monthIdx - income.startMonth;
  if (offset < 0 || offset >= income.duration) return 0;
  return income.amount * Math.pow(1 + (income.growthPct || 0) / 100, offset);
}

/**
 * חישוב הוצאה לחודש ספציפי
 *
 * @param annualInflationPct - אינפלציה שנתית (%) להחיל אם expense.applyInflation=true
 */
export function getExpenseForMonth(
  expense: ExpenseItem,
  monthIdx: number,
  income: IncomeItem[],
  annualInflationPct: number = 0,
): number {
  const offset = monthIdx - expense.startMonth;
  if (offset < 0 || offset >= expense.duration) return 0;

  let value: number;

  if (expense.isPct) {
    if (expense.linkedIncomeId) {
      const linked = income.find((i) => i.id === expense.linkedIncomeId);
      if (linked) {
        value = getIncomeForMonth(linked, monthIdx) * (expense.percentage / 100);
      } else {
        value = 0;
      }
    } else {
      // אחוז מסך כל ההכנסה החודשית
      const totalIncomeMonth = income.reduce(
        (sum, inc) => sum + getIncomeForMonth(inc, monthIdx),
        0,
      );
      value = totalIncomeMonth * (expense.percentage / 100);
    }
  } else {
    value = expense.amount;
  }

  // החל אינפלציה (לפי שנים מההתחלה, לא חודשים)
  if (expense.applyInflation && annualInflationPct > 0) {
    const yearsFromStart = Math.floor(offset / 12);
    if (yearsFromStart > 0) {
      value *= Math.pow(1 + annualInflationPct / 100, yearsFromStart);
    }
  }

  return value;
}

/**
 * חישוב סה"כ הוצאה על פני התקופה
 */
export function calculateExpenseTotal(
  expense: ExpenseItem,
  income: IncomeItem[],
  totalMonths: number,
  annualInflationPct: number = 0,
): number {
  let total = 0;
  for (let m = 0; m < totalMonths; m++) {
    total += getExpenseForMonth(expense, m, income, annualInflationPct);
  }
  return total;
}

// ============================================================
// LOAN CALCULATIONS (Spitzer / PMT)
// ============================================================

export interface LoanScheduleEntry {
  month: number; // 0-based
  payment: number; // תשלום חודשי (קרן+ריבית)
  principal: number;
  interest: number;
  balance: number; // יתרה אחרי התשלום
}

export interface LoanCalculation {
  monthlyPayment: number;
  totalPayments: number;
  totalInterest: number;
  schedule: LoanScheduleEntry[];
}

/**
 * חישוב תשלום חודשי לפי שיטת שפיצר (PMT formula)
 *
 * M = P × [r(1+r)^n] / [(1+r)^n - 1]
 *
 * P = קרן (principal)
 * r = ריבית חודשית (annualRate / 12 / 100)
 * n = מספר תשלומים
 */
export function calculateLoan(loan: Loan): LoanCalculation {
  const P = loan.amount;
  const n = loan.termMonths;
  const r = loan.annualRate / 100 / 12;

  if (P <= 0 || n <= 0) {
    return { monthlyPayment: 0, totalPayments: 0, totalInterest: 0, schedule: [] };
  }

  let monthlyPayment: number;
  if (r === 0) {
    monthlyPayment = P / n;
  } else {
    monthlyPayment = (P * (r * Math.pow(1 + r, n))) / (Math.pow(1 + r, n) - 1);
  }

  let balance = P;
  const schedule: LoanScheduleEntry[] = [];
  let totalInterest = 0;

  for (let i = 0; i < n; i++) {
    const interest = balance * r;
    const principal = monthlyPayment - interest;
    balance -= principal;
    totalInterest += interest;

    schedule.push({
      month: loan.startMonth + i,
      payment: monthlyPayment,
      principal,
      interest,
      balance: Math.max(0, balance),
    });
  }

  return {
    monthlyPayment,
    totalPayments: monthlyPayment * n,
    totalInterest,
    schedule,
  };
}

/**
 * תשלום הלוואה בחודש מסויים (לכל ההלוואות)
 */
export function getLoanPaymentsForMonth(loans: Loan[], monthIdx: number): number {
  let total = 0;
  for (const loan of loans) {
    const calc = calculateLoan(loan);
    const entry = calc.schedule.find((e) => e.month === monthIdx);
    if (entry) total += entry.payment;
  }
  return total;
}

/**
 * ריבית הלוואה בחודש מסויים (לחישובים פיננסיים)
 */
export function getLoanInterestForMonth(loans: Loan[], monthIdx: number): number {
  let total = 0;
  for (const loan of loans) {
    const calc = calculateLoan(loan);
    const entry = calc.schedule.find((e) => e.month === monthIdx);
    if (entry) total += entry.interest;
  }
  return total;
}

// ============================================================
// EMPLOYEE COSTS
// ============================================================

/**
 * עלות עובדים לחודש
 */
export function getEmployeeCostForMonth(employees: Employee[], monthIdx: number): number {
  let total = 0;
  for (const emp of employees) {
    const inRange =
      monthIdx >= emp.startMonth && (emp.endMonth === null || monthIdx <= emp.endMonth);
    if (inRange) total += emp.monthlySalary;
  }
  return total;
}

/**
 * עלות עובדים לקטגוריה (לפי מחלקה → קטגוריית הוצאה)
 */
const DEPARTMENT_TO_CATEGORY: Record<string, ExpenseCategory> = {
  sales: 'operating',
  marketing: 'marketing',
  development: 'rnd',
  operations: 'cogs',
  administration: 'operating',
};

export function getEmployeeCostByCategory(
  employees: Employee[],
  category: ExpenseCategory,
  monthIdx: number,
): number {
  let total = 0;
  for (const emp of employees) {
    if (DEPARTMENT_TO_CATEGORY[emp.department] !== category) continue;
    const inRange =
      monthIdx >= emp.startMonth && (emp.endMonth === null || monthIdx <= emp.endMonth);
    if (inRange) total += emp.monthlySalary;
  }
  return total;
}

// ============================================================
// MONTHLY BUDGET CALCULATION
// ============================================================

/**
 * חישוב נתוני תקציב לחודש בודד
 */
export function calculateMonth(
  budget: BudgetData,
  monthIdx: number,
  taxRate: number,
  startMonthOfYear: number = 0,
  annualInflationPct: number = 0,
): MonthlyBudget {
  const calendarMonth = (startMonthOfYear + monthIdx) % 12;
  const year = Math.floor((startMonthOfYear + monthIdx) / 12);
  const monthName = HEBREW_MONTHS[calendarMonth];

  // הכנסות
  const income = budget.income.reduce((sum, inc) => sum + getIncomeForMonth(inc, monthIdx), 0);

  // הוצאות לפי קטגוריה - מהקטלוג + מעובדים + מהלוואות
  const cogs =
    budget.expenses
      .filter((e) => e.category === 'cogs')
      .reduce((sum, exp) => sum + getExpenseForMonth(exp, monthIdx, budget.income, annualInflationPct), 0) +
    getEmployeeCostByCategory(budget.employees, 'cogs', monthIdx);

  const rnd =
    budget.expenses
      .filter((e) => e.category === 'rnd')
      .reduce((sum, exp) => sum + getExpenseForMonth(exp, monthIdx, budget.income, annualInflationPct), 0) +
    getEmployeeCostByCategory(budget.employees, 'rnd', monthIdx);

  const marketing =
    budget.expenses
      .filter((e) => e.category === 'marketing')
      .reduce((sum, exp) => sum + getExpenseForMonth(exp, monthIdx, budget.income, annualInflationPct), 0) +
    getEmployeeCostByCategory(budget.employees, 'marketing', monthIdx);

  const operating =
    budget.expenses
      .filter((e) => e.category === 'operating')
      .reduce((sum, exp) => sum + getExpenseForMonth(exp, monthIdx, budget.income, annualInflationPct), 0) +
    getEmployeeCostByCategory(budget.employees, 'operating', monthIdx);

  // הוצאות מימון: ריבית הלוואות + הוצאות מימון ידניות
  const financialManual = budget.expenses
    .filter((e) => e.category === 'financial' && !e.isAuto)
    .reduce((sum, exp) => sum + getExpenseForMonth(exp, monthIdx, budget.income, annualInflationPct), 0);
  const loanInterest = getLoanInterestForMonth(budget.loans, monthIdx);
  const financial = financialManual + loanInterest;

  const totalExpenses = cogs + rnd + marketing + operating + financial;
  const grossProfit = income - cogs;
  const operatingProfit = grossProfit - rnd - marketing - operating;
  const ebitda = operatingProfit; // מפושט - אם יש פחת ידני להוסיף
  const preTaxProfit = operatingProfit - financial;
  const tax = preTaxProfit > 0 ? preTaxProfit * (taxRate / 100) : 0;
  const netProfit = preTaxProfit - tax;

  return {
    monthIndex: monthIdx,
    monthName: year > 0 ? `${monthName} ${year + 1}` : monthName,
    income,
    cogs,
    rnd,
    marketing,
    operating,
    financial,
    totalExpenses,
    grossProfit,
    operatingProfit,
    ebitda,
    preTaxProfit,
    tax,
    netProfit,
  };
}

/**
 * חישוב כל החודשים בתקופה
 */
export function calculateAllMonths(budget: BudgetData, settings: PeriodSettings): MonthlyBudget[] {
  const results: MonthlyBudget[] = [];
  const startMonthOfYear = parseInt(settings.startMonth.split('-')[1] ?? '1', 10) - 1;
  const inflation = settings.annualInflationPct ?? 0;

  for (let m = 0; m < settings.monthsToShow; m++) {
    results.push(calculateMonth(budget, m, settings.taxRate, startMonthOfYear, inflation));
  }

  return results;
}

// ============================================================
// BUDGET TOTALS - סיכום שנתי
// ============================================================

export interface BudgetTotals {
  income: number;
  cogs: number;
  rnd: number;
  marketing: number;
  operating: number;
  financial: number;
  totalExpenses: number;
  grossProfit: number;
  operatingProfit: number;
  ebitda: number;
  preTaxProfit: number;
  tax: number;
  netProfit: number;
  // יחסים
  grossMargin: number; // %
  operatingMargin: number;
  netMargin: number;
  ebitdaMargin: number;
}

export function calculateBudgetTotals(monthly: MonthlyBudget[]): BudgetTotals {
  const sum = (key: keyof MonthlyBudget): number =>
    monthly.reduce((s, m) => s + (m[key] as number), 0);

  const income = sum('income');
  const cogs = sum('cogs');
  const rnd = sum('rnd');
  const marketing = sum('marketing');
  const operating = sum('operating');
  const financial = sum('financial');
  const totalExpenses = sum('totalExpenses');
  const grossProfit = sum('grossProfit');
  const operatingProfit = sum('operatingProfit');
  const ebitda = sum('ebitda');
  const preTaxProfit = sum('preTaxProfit');
  const tax = sum('tax');
  const netProfit = sum('netProfit');

  const safePct = (n: number, d: number): number => (d > 0 ? (n / d) * 100 : 0);

  return {
    income,
    cogs,
    rnd,
    marketing,
    operating,
    financial,
    totalExpenses,
    grossProfit,
    operatingProfit,
    ebitda,
    preTaxProfit,
    tax,
    netProfit,
    grossMargin: safePct(grossProfit, income),
    operatingMargin: safePct(operatingProfit, income),
    netMargin: safePct(netProfit, income),
    ebitdaMargin: safePct(ebitda, income),
  };
}

// ============================================================
// EMPTY BUDGET FACTORY
// ============================================================

export function createEmptyBudget(): BudgetData {
  return {
    income: [],
    expenses: [],
    loans: [],
    employees: [],
  };
}

export function createDefaultSettings(): PeriodSettings {
  const now = new Date();
  return {
    startMonth: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`,
    monthsToShow: 12,
    fiscalYear: now.getFullYear(),
    currency: 'ILS',
    taxRate: 23,
    openingBalance: 0,
    industry: 'services',
    companyName: '',
  };
}
