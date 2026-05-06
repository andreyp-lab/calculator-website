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
  /** אינפלציה שנתית (%) - מוחל על פריטים עם applyInflation=true */
  annualInflationPct?: number;
  /** שערי המרה למטבע התקציב (key = currency code, value = שער) */
  fxRates?: Partial<Record<Currency, number>>;
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
  paymentTerms: number; // ימי אשראי (0/30/60/90) - תאימות לאחור
  /** פיצול תשלומים (אופציונלי). אם קיים, גובר על paymentTerms. */
  paymentSplit?: PaymentTermInstallment[];
  status: IncomeStatus;
  /** מטבע ספציפי לפריט (אופציונלי - אם לא, משמש מטבע התקציב) */
  currency?: Currency;
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
  paymentTerms: number; // ימי תשלום - תאימות לאחור
  /** פיצול תשלומים (אופציונלי). אם קיים, גובר על paymentTerms. */
  paymentSplit?: PaymentTermInstallment[];
  // עובדים:
  isEmployeeExpense?: boolean;
  department?: Department;
  employeeCount?: number;
  // אוטומטי (כמו ריבית הלוואה):
  isAuto?: boolean;
  /** מטבע ספציפי לפריט (אופציונלי) */
  currency?: Currency;
  /** האם להחיל אינפלציה שנתית */
  applyInflation?: boolean;
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
// SOLO CASH FLOW - תזרים עצמאי (ללא תקציב)
// ============================================================

export type SoloItemType = 'in' | 'out';

export type SoloRecurringFrequency =
  | 'once'
  | 'weekly'
  | 'monthly'
  | 'quarterly'
  | 'yearly';

export type SoloIncomeCategory =
  | 'sales'
  | 'service'
  | 'investment'
  | 'loan_received'
  | 'refund'
  | 'other_income';

export type SoloExpenseCategory =
  | 'rent'
  | 'salary'
  | 'supplier'
  | 'tax'
  | 'utilities'
  | 'marketing'
  | 'equipment'
  | 'insurance'
  | 'professional'
  | 'loan_payment'
  | 'other_expense';

export interface SoloCashFlowItem {
  id: string;
  /** ISO date YYYY-MM-DD */
  date: string;
  type: SoloItemType;
  amount: number;
  category: SoloIncomeCategory | SoloExpenseCategory;
  description: string;
  recurring: SoloRecurringFrequency;
  /** ISO date - end of recurring */
  recurringEnd?: string;
  /** Bank account ID this relates to (optional) */
  accountId?: string;
  /** Status of the item */
  status?: 'expected' | 'confirmed' | 'paid' | 'received';
  /** Tags for analysis */
  tags?: string[];
}

export interface SoloCashFlowData {
  items: SoloCashFlowItem[];
  accounts: BankAccount[];
  /** Months to project from start date */
  monthsToProject: number;
  /** Start date for projection (ISO date) */
  startDate: string;
  /** Currency for display */
  currency: Currency;
}

// ============================================================
// PAYMENT TERMS - תנאי תשלום מפוצלים
// ============================================================

/**
 * תשלום בודד בתוך פיצול.
 * לדוגמה: { percentage: 30, daysOffset: 30 } = 30% נטו 30
 */
export interface PaymentTermInstallment {
  /** אחוז מהסכום הכולל (0-100) */
  percentage: number;
  /** ימים מתאריך החיוב/החשבונית */
  daysOffset: number;
  /** תיאור (לדוגמה: "מקדמה", "סופי") */
  label?: string;
}

/**
 * תנאי תשלום: או מספר ימים אחיד, או רשימת installments
 * אם installments ריקה/לא קיימת → simpleNet משמש כברירת מחדל
 */
export interface PaymentTerms {
  /** ברירת מחדל: ימי דחייה אחידים (תאימות לאחור) */
  simpleNet: number;
  /** פיצול לתשלומים (אופציונלי). סכום האחוזים חייב להיות 100. */
  installments?: PaymentTermInstallment[];
}

// ============================================================
// HISTORICAL DATA - נתוני עבר לחיזוי
// ============================================================

/** דוח רווח והפסד שנתי (מתומצת) */
export interface AnnualPnL {
  revenue: number;
  cogs: number;
  grossProfit: number;
  rnd: number;
  marketing: number;
  operating: number;
  ebitda: number;
  depreciation: number;
  ebit: number;
  interest: number;
  preTaxProfit: number;
  tax: number;
  netProfit: number;
}

/** מאזן שנתי (מתומצת) */
export interface AnnualBalanceSheet {
  // נכסים
  cash: number;
  accountsReceivable: number;
  inventory: number;
  otherCurrentAssets: number;
  totalCurrentAssets: number;
  fixedAssets: number;
  intangibleAssets: number;
  totalAssets: number;
  // התחייבויות
  accountsPayable: number;
  shortTermDebt: number;
  otherCurrentLiabilities: number;
  totalCurrentLiabilities: number;
  longTermDebt: number;
  totalLiabilities: number;
  // הון עצמי
  shareCapital: number;
  retainedEarnings: number;
  totalEquity: number;
}

/** תזרים מזומנים שנתי (מתומצת) */
export interface AnnualCashFlow {
  // תפעולית
  netIncome: number;
  depreciation: number;
  changeInWC: number;
  cashFromOperations: number;
  // השקעה
  capex: number;
  cashFromInvesting: number;
  // מימון
  debtIssuance: number;
  debtRepayment: number;
  equityIssuance: number;
  dividends: number;
  cashFromFinancing: number;
  // נטו
  netChangeInCash: number;
  openingCash: number;
  closingCash: number;
}

/** שנה היסטורית או מתוכננת מלאה */
export interface AnnualStatements {
  year: number;
  isProjection: boolean;
  pnl: AnnualPnL;
  balanceSheet: AnnualBalanceSheet;
  cashFlow: AnnualCashFlow;
}

/**
 * הנחות תכנון לחיזוי שנים קדימה.
 * המנוע משתמש בהנחות אלה כדי לבנות P&L, מאזן ותזרים עתידיים מהשנה הבסיס.
 */
export interface ForecastAssumptions {
  /** צמיחת הכנסות שנתית (%) - יכול להיות מספר לכל שנה או יחיד לכולן */
  revenueGrowthPct: number[];
  /** מרווח גולמי יעד (%) - אם null, משמר את היחס מהשנה הקודמת */
  grossMarginPct: number[] | null;
  /** R&D כאחוז מהכנסות */
  rndPctOfRevenue: number[] | null;
  /** Marketing כאחוז מהכנסות */
  marketingPctOfRevenue: number[] | null;
  /** Operating כאחוז מהכנסות */
  operatingPctOfRevenue: number[] | null;
  /** הוצאות פחת שנתיות (קבוע) */
  depreciationPerYear: number[];
  /** ריבית אפקטיבית על חוב (%) */
  effectiveInterestRate: number;
  /** שיעור מס אפקטיבי (%) */
  effectiveTaxRate: number;
  /** ימי גבייה ממוצעים (DSO) */
  dso: number;
  /** ימי תשלום לספקים (DPO) */
  dpo: number;
  /** ימי מלאי (DIO) */
  dio: number;
  /** השקעה בנכסים קבועים שנתית (CapEx) */
  capexPerYear: number[];
  /** הנפקת חוב שנתית (אם בכלל) */
  debtIssuancePerYear: number[];
  /** החזר חוב שנתי */
  debtRepaymentPerYear: number[];
  /** דיבידנד שנתי */
  dividendsPerYear: number[];
  /** מספר שנים לחיזוי (3-5) */
  yearsToProject: number;
}

/** תוצאת מודל שלוש-דוחות */
export interface ThreeStatementModel {
  historical: AnnualStatements[]; // שנים אחורה (1-3)
  projected: AnnualStatements[]; // שנים קדימה (3-5)
  assumptions: ForecastAssumptions;
  /** מטא-דאטה: שנת בסיס ושיטת חיזוי */
  baseYear: number;
  modelDate: string;
}

// ============================================================
// INDUSTRY BENCHMARKS - השוואות ענף
// ============================================================

export interface BenchmarkValue {
  /** מינימום (אחוזון 25 / "צד תחתון") */
  low: number;
  /** חציון / "ממוצע ענף" */
  median: number;
  /** מקסימום (אחוזון 75 / "צד עליון") */
  high: number;
  /** יחידת מידה (% / יחס / ימים) */
  unit: 'pct' | 'ratio' | 'days';
}

export interface IndustryBenchmarks {
  industry: Industry;
  industryLabel: string;
  source: string;
  asOfYear: number;
  // רווחיות
  grossMargin: BenchmarkValue;
  operatingMargin: BenchmarkValue;
  netMargin: BenchmarkValue;
  ebitdaMargin: BenchmarkValue;
  // יעילות
  rndPctOfRevenue: BenchmarkValue;
  marketingPctOfRevenue: BenchmarkValue;
  operatingPctOfRevenue: BenchmarkValue;
  // הון חוזר
  dso: BenchmarkValue;
  dpo: BenchmarkValue;
  dio: BenchmarkValue;
  // פיננסי
  currentRatio: BenchmarkValue;
  quickRatio: BenchmarkValue;
  debtToEquity: BenchmarkValue;
  interestCoverage: BenchmarkValue;
  // צמיחה
  revenueGrowthPct: BenchmarkValue;
}

// ============================================================
// MONTE CARLO - סימולציה הסתברותית
// ============================================================

export type DistributionType = 'normal' | 'triangular' | 'uniform';

export interface InputDistribution {
  variable: 'revenueGrowth' | 'grossMargin' | 'opex' | 'capex';
  distribution: DistributionType;
  /** עבור normal: mean, stdDev. עבור triangular: min, mode, max. עבור uniform: min, max */
  params: { mean?: number; stdDev?: number; min?: number; mode?: number; max?: number };
}

export interface MonteCarloResult {
  iterations: number;
  metric: 'netProfit' | 'cashRunway' | 'closingCash' | 'irr';
  /** התפלגות תוצאות */
  histogram: { bucket: number; count: number }[];
  /** סטטיסטיקות */
  stats: {
    mean: number;
    median: number;
    stdDev: number;
    p5: number; // אחוזון 5
    p25: number;
    p75: number;
    p95: number;
    min: number;
    max: number;
  };
  /** סיכויים */
  probabilityPositive: number;
  probabilityAboveTarget?: number;
}

// ============================================================
// COHORT ANALYSIS - ניתוח קוהורט
// ============================================================

export interface CustomerCohort {
  /** תקופת רכישה (YYYY-MM) */
  acquisitionMonth: string;
  /** מספר לקוחות שנרכשו */
  newCustomers: number;
  /** ARPU (Average Revenue Per User) חודשי */
  arpu: number;
  /** Churn rate חודשי (%) */
  monthlyChurnPct: number;
  /** עלות רכישה לכל לקוח (CAC) */
  cac: number;
}

export interface CohortAnalysisResult {
  cohorts: CustomerCohort[];
  /** ערכי הקוהורט לכל חודש - revenue, retained customers */
  cohortMatrix: number[][];
  /** מצרפי */
  totals: {
    avgLtv: number;
    avgCac: number;
    ltvToCacRatio: number;
    paybackMonths: number;
    netRevenueRetention: number; // %
  };
}

// ============================================================
// TEMPLATES - תבניות לפי ענף
// ============================================================

export interface BudgetTemplate {
  id: string;
  name: string;
  industry: Industry;
  description: string;
  /** איקון Lucide name */
  icon: string;
  /** תקציב לדוגמה */
  budget: BudgetData;
  /** הנחות חיזוי דיפולט */
  assumptions: Partial<ForecastAssumptions>;
  /** הערות מיוחדות לענף */
  notes: string[];
}

// ============================================================
// DCF VALUATION
// ============================================================

export interface DCFInput {
  /** תזרימים חופשיים שנתיים (FCF) - מהמודל או ידני */
  freeCashFlows: number[];
  /** WACC - שיעור ניכיון (%) */
  wacc: number;
  /** קצב צמיחה תמידי (%) - Gordon Growth */
  terminalGrowthRate: number;
  /** מכפיל יציאה (לחישוב Terminal Value אלטרנטיבי) */
  exitMultiple?: number;
  /** EBITDA של השנה האחרונה (לחישוב Terminal Value עם מכפיל) */
  finalEbitda?: number;
  /** חוב נקי (חוב - מזומן) להמרה מ-EV ל-Equity */
  netDebt: number;
  /** מספר מניות (לחישוב מחיר למניה) */
  sharesOutstanding?: number;
  /** שיטת Terminal Value */
  terminalMethod: 'gordon' | 'exit_multiple';
}

export interface DCFResult {
  /** ערך נוכחי של תזרימים מפורשים */
  pvOfExplicitCashFlows: number[];
  /** סכום ה-PV של התזרימים המפורשים */
  sumOfExplicitPV: number;
  /** Terminal Value בסוף תקופת התחזית */
  terminalValue: number;
  /** PV של ה-Terminal Value */
  pvOfTerminalValue: number;
  /** Enterprise Value */
  enterpriseValue: number;
  /** Equity Value (EV - Net Debt) */
  equityValue: number;
  /** מחיר למניה (אם sharesOutstanding) */
  pricePerShare?: number;
  /** % מהשווי שמגיע מ-Terminal */
  terminalValueShare: number;
}

export interface WACCInput {
  /** משקל החוב (%) */
  debtWeight: number;
  /** משקל ההון העצמי (%) */
  equityWeight: number;
  /** עלות חוב לפני מס (%) */
  costOfDebt: number;
  /** שיעור מס אפקטיבי (%) */
  taxRate: number;
  /** Risk-free rate (%) - אג"ח מ-10 שנים */
  riskFreeRate: number;
  /** Beta של החברה */
  beta: number;
  /** Equity Risk Premium (%) */
  equityRiskPremium: number;
}

// ============================================================
// CAP TABLE & FUNDING ROUNDS
// ============================================================

export type ShareClass = 'common' | 'preferred_a' | 'preferred_b' | 'preferred_c' | 'preferred_seed' | 'esop';

export interface Shareholder {
  id: string;
  name: string;
  shareClass: ShareClass;
  /** מספר מניות לפני סבב הנוכחי (יתעדכן אחרי כל סבב) */
  shares: number;
  /** האם מייסד (לסיווג) */
  isFounder?: boolean;
}

export interface FundingRound {
  id: string;
  name: string; // "Pre-Seed", "Seed", "Series A"
  /** סוג מניות שנוצרו */
  shareClass: ShareClass;
  /** Pre-money valuation */
  preMoneyValuation: number;
  /** השקעה בסבב */
  investmentAmount: number;
  /** מי השקיע (שם המשקיע) */
  investorName: string;
  /** ESOP pool שנפתח עם הסבב (% מ-post-money) */
  esopPoolPct?: number;
  /** האם ה-ESOP נפתח לפני או אחרי המוני (Pre-money pool מדלל יותר את המייסדים) */
  esopPrePostMoney?: 'pre' | 'post';
  /** Liquidation preference (1x, 2x...) */
  liquidationPreference?: number;
  /** Participating preferred? */
  participating?: boolean;
  /** Date */
  date?: string;
}

export interface CapTableSnapshot {
  /** מצב Pre-funding (לפני אף סבב) */
  initialShareholders: Shareholder[];
  /** הסבבים בסדר כרונולוגי */
  rounds: FundingRound[];
}

export interface CapTableState {
  /** Snapshot אחרי כל סבב */
  perRound: Array<{
    afterRound: string;
    shareholders: Array<Shareholder & { ownershipPct: number }>;
    totalShares: number;
    postMoneyValuation: number;
    pricePerShare: number;
  }>;
}

export interface ExitWaterfall {
  /** ערך יציאה */
  exitValue: number;
  /** סכום שמגיע לכל בעל מניות לפי הסדר */
  payouts: Array<{
    shareholderId: string;
    shareholderName: string;
    preferenceAmount: number; // liquidation preference
    proRataAmount: number;
    totalAmount: number;
    sharePct: number;
  }>;
}

// ============================================================
// GOALS & BURN RATE
// ============================================================

export type GoalType =
  | 'revenue'
  | 'arr'
  | 'profit'
  | 'ebitda'
  | 'customers'
  | 'cashBalance'
  | 'runway'
  | 'custom';

export interface Goal {
  id: string;
  name: string;
  type: GoalType;
  targetValue: number;
  /** תאריך יעד YYYY-MM-DD */
  targetDate: string;
  createdAt: string;
  notes?: string;
}

export interface GoalProgress {
  goal: Goal;
  currentValue: number;
  projectedValue: number;
  pctComplete: number;
  /** האם בקצב להגיע ליעד */
  onTrack: boolean;
  /** סטטוס */
  status: 'ahead' | 'on_track' | 'at_risk' | 'behind' | 'achieved';
  /** ההפרש מול היעד הנוכחי הצפוי */
  gap: number;
}

export interface BurnRateMetrics {
  /** מזומן נוכחי */
  currentCash: number;
  /** Burn ממוצע ב-3 חודשים אחרונים */
  avg3MonthBurn: number;
  /** Burn ממוצע ב-6 חודשים אחרונים */
  avg6MonthBurn: number;
  /** Net Burn (negative cash flow אם קיים) */
  netBurn: number;
  /** Cash runway בחודשים */
  runwayMonths: number;
  /** סטטוס */
  status: 'profitable' | 'healthy' | 'caution' | 'critical';
  /** התאריך הצפוי לאזילת מזומן */
  projectedZeroDate?: string;
  /** המלצה */
  recommendation: string;
}

// ============================================================
// WORKING CAPITAL OPTIMIZATION
// ============================================================

export interface WorkingCapitalScenario {
  dso: number;
  dpo: number;
  dio: number;
  /** מזומן ש"משוחרר" / נדרש לעומת המצב הנוכחי */
  cashImpact: number;
  /** Cash Conversion Cycle */
  ccc: number;
  /** הון חוזר נטו */
  netWorkingCapital: number;
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
