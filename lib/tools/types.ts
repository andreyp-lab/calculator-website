/**
 * טיפוסים משותפים למערכת תקציב + תזרים + ניתוח דוחות
 *
 * ארכיטקטורה: כל הכלים חולקים את אותו data model.
 * Budget מזין את Cash Flow, ו-Cash Flow מזין את Financial Analysis.
 */

// ============================================================
// CORE TYPES - משותף לכל הכלים
// ============================================================

export type Currency = 'ILS' | 'USD' | 'EUR' | 'GBP';
export type Industry =
  | 'services'
  | 'technology'
  | 'retail'
  | 'manufacturing'
  | 'construction'
  | 'food'
  | 'energy'
  | 'healthcare'
  | 'finance'
  | 'realestate';

export interface PeriodSettings {
  startMonth: string; // YYYY-MM
  monthsToShow: number; // 3-36
  fiscalYear: number;
  currency: Currency;
  taxRate: number; // %
  openingBalance: number;
  industry: Industry;
  companyName: string;
}

// ============================================================
// BUDGET TYPES - תקציב (מבוסס על ProfitMargin Budget)
// ============================================================

export type ExpenseCategory =
  | 'cogs' // עלות מכר
  | 'rnd' // מחקר ופיתוח
  | 'marketing' // שיווק ומכירות
  | 'operating' // הוצאות תפעול כלליות
  | 'financial'; // הוצאות מימון

export type IncomeStatus = 'expected' | 'confirmed' | 'received';

export interface IncomeItem {
  id: string;
  name: string;
  amount: number; // סכום חודשי (ש"ח)
  startMonth: number; // 0-11 (חודש בשנה)
  duration: number; // מספר חודשים
  growthPct: number; // אחוז צמיחה חודשי (0 = קבוע)
  paymentTerms: number; // ימי אשראי (0/30/60/90)
  status: IncomeStatus;
}

export interface ExpenseItem {
  id: string;
  category: ExpenseCategory;
  name: string;
  // אמרה אחת מהשתיים:
  amount: number; // סכום חודשי קבוע (ש"ח)
  isPct: boolean;
  percentage: number; // אחוז מהכנסה (אם isPct=true)
  linkedIncomeId?: string; // קישור להכנסה ספציפית (אם isPct=true)
  // פרטים:
  startMonth: number;
  duration: number;
  paymentTerms: number; // ימי תשלום
  // עובדים:
  isEmployeeExpense?: boolean;
  department?: Department;
  employeeCount?: number;
  // אוטומטי (כמו ריבית הלוואה):
  isAuto?: boolean;
}

export interface Loan {
  id: string;
  name: string; // "הלוואה 1"
  amount: number; // קרן
  termMonths: number; // תקופה (חודשים)
  annualRate: number; // ריבית שנתית (%)
  startMonth: number; // חודש תשלום ראשון
  type?: 'bank' | 'credit_fund' | 'private' | 'government';
}

export type Department =
  | 'sales'
  | 'marketing'
  | 'development'
  | 'operations'
  | 'administration';

export interface Employee {
  id: string;
  name: string;
  department: Department;
  monthlySalary: number;
  startMonth: number; // 0-11
  endMonth: number | null; // null = ongoing
  position?: string;
  status?: 'active' | 'inactive' | 'temp';
}

export interface BudgetData {
  income: IncomeItem[];
  expenses: ExpenseItem[];
  loans: Loan[];
  employees: Employee[];
}

// ============================================================
// CASH FLOW TYPES - תזרים מזומנים
// ============================================================

export interface BankAccount {
  id: string;
  name: string;
  balance: number;
  asOfDate: string; // YYYY-MM-DD
}

export type ExpenseFrequency = 'once' | 'monthly' | 'quarterly' | 'yearly';

export interface CashFlowExpense {
  id: string;
  category: 'supplier' | 'employee' | 'authority' | 'check' | 'creditcard' | 'loan' | 'other';
  name: string;
  amount: number;
  date: string; // תאריך חיוב
  paymentTerms: number; // ימי דחייה
  status: 'pending' | 'approved' | 'paid' | 'cleared' | 'bounced';
  /** תכיפות (חד-פעמי / חודשי / רבעוני / שנתי) */
  frequency?: ExpenseFrequency;
  // פרטים נוספים לפי קטגוריה:
  // ספק: status (pending/approved/paid)
  // רשות: type (tax/insurance/license/vat), priority (low/medium/high/critical)
  // שיק: number, payee, bank, status (issued/pending/cleared/bounced)
  // אשראי: company (visa/mc/amex/cal/diners), last4, payments (1-12)
  // אחר: subcategory
  details?: Record<string, string | number>;
}

export interface CashFlowDelay {
  id: string;
  type: 'collection_delay' | 'payment_delay';
  itemId: string; // ID של ההכנסה/הוצאה
  delayDays: number;
  reason?: string;
  amountImpact?: number; // %
  splitPayment?: boolean;
  splitCount?: number;
}

export interface CashFlowData {
  accounts: BankAccount[];
  customExpenses: CashFlowExpense[]; // הוצאות שלא מקושרות לתקציב
  delays: CashFlowDelay[]; // עיכובים ודחיות
}

// ============================================================
// MONTHLY CALCULATIONS - תוצאות חישובים חודשיים
// ============================================================

export interface MonthlyBudget {
  monthIndex: number; // 0-based מתחילת התקופה
  monthName: string; // "ינואר 2026"
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
}

export interface MonthlyCashFlow {
  monthIndex: number;
  monthName: string;
  openingBalance: number;
  incomeReceived: number; // מה שנכנס בפועל (אחרי ימי אשראי)
  expensesPaid: number; // מה ששולם בפועל
  loanPayments: number;
  netCashFlow: number;
  closingBalance: number;
}

// ============================================================
// FINANCIAL ANALYSIS TYPES - ניתוח דוחות
// ============================================================

export interface BalanceSheetData {
  // נכסים
  cashAndEquivalents: number;
  accountsReceivable: number;
  inventory: number;
  currentAssets: number;
  fixedAssets: number;
  totalAssets: number;
  // התחייבויות
  accountsPayable: number;
  shortTermDebt: number;
  currentLiabilities: number;
  longTermDebt: number;
  totalLiabilities: number;
  // הון
  totalEquity: number;
  retainedEarnings?: number;
}

export interface FinancialRatios {
  // נזילות
  currentRatio: number;
  quickRatio: number;
  cashRatio: number;
  // רווחיות
  grossProfitMargin: number;
  operatingProfitMargin: number;
  netProfitMargin: number;
  returnOnAssets: number;
  returnOnEquity: number;
  // מינוף
  debtToEquity: number;
  debtToAssets: number;
  interestCoverage: number;
  // יעילות
  assetTurnover: number;
  inventoryTurnover: number;
  receivablesTurnover: number;
  // הון חוזר
  dso: number; // Days Sales Outstanding
  dpo: number; // Days Payable Outstanding
  dio: number; // Days Inventory Outstanding
  ccc: number; // Cash Conversion Cycle
  // כיסוי
  dscr: number; // Debt Service Coverage Ratio
}

export interface CreditRating {
  rating: 'AAA' | 'AA' | 'A' | 'BBB' | 'BB' | 'B' | 'CCC' | 'CC' | 'C' | 'D';
  score: number; // 0-100
  investmentGrade: boolean;
  description: string;
  defaultProbability: string;
  outlook: 'חיובי' | 'יציב' | 'שלילי';
}

export interface ZScoreResult {
  score: number;
  zone: 'safe' | 'grey' | 'distress';
  bankruptcyProbability: string;
  components: {
    workingCapitalToAssets: number;
    retainedEarningsToAssets: number;
    ebitToAssets: number;
    equityToDebt: number;
    salesToAssets: number;
  };
}

// ============================================================
// SCENARIO MANAGEMENT - תרחישים
// ============================================================

export interface Scenario {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  // נתונים:
  settings: PeriodSettings;
  budget: BudgetData;
  cashFlow: CashFlowData;
  balanceSheet?: BalanceSheetData;
}

// ============================================================
// HELPERS - עזרים
// ============================================================

export const CURRENCY_SYMBOLS: Record<Currency, string> = {
  ILS: '₪',
  USD: '$',
  EUR: '€',
  GBP: '£',
};

export const HEBREW_MONTHS = [
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

export const HEBREW_MONTHS_SHORT = ['ינו', 'פבר', 'מרץ', 'אפר', 'מאי', 'יונ', 'יול', 'אוג', 'ספט', 'אוק', 'נוב', 'דצמ'];

export const DEPARTMENT_LABELS: Record<Department, string> = {
  sales: 'מכירות',
  marketing: 'שיווק',
  development: 'פיתוח',
  operations: 'תפעול',
  administration: 'הנהלה',
};

export const EXPENSE_CATEGORY_LABELS: Record<ExpenseCategory, string> = {
  cogs: 'עלות המכר (COGS)',
  rnd: 'מחקר ופיתוח (R&D)',
  marketing: 'שיווק ומכירות',
  operating: 'הוצאות תפעול',
  financial: 'הוצאות מימון',
};
