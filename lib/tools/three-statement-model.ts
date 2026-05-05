/**
 * Three-Statement Financial Model
 *
 * המנוע הליבה ליצירת מודל פיננסי 3-דוחות (P&L, מאזן, תזרים).
 * קלט: 1-3 שנות עבר + הנחות → פלט: 3-5 שנים קדימה.
 *
 * הגישה: Driver-Based Forecasting
 * - הכנסות → צמיחה % (משתמש)
 * - COGS → גזירה ממרווח גולמי יעד או היסטורי
 * - OpEx → אחוז מהכנסות
 * - מאזן → ימים (DSO/DPO/DIO) + CapEx + חוב
 * - תזרים → אינדירקט מ-P&L + שינוי הון חוזר
 *
 * המודל מבטיח עקביות:
 * Cash(t) = Cash(t-1) + CFO + CFI + CFF
 * Total Assets = Total Liabilities + Equity
 * Retained Earnings(t) = Retained Earnings(t-1) + Net Income - Dividends
 */

import type {
  AnnualPnL,
  AnnualBalanceSheet,
  AnnualCashFlow,
  AnnualStatements,
  ForecastAssumptions,
  ThreeStatementModel,
  BudgetData,
  PeriodSettings,
  BalanceSheetData,
} from './types';
import { calculateAllMonths, calculateBudgetTotals } from './budget-engine';

// ============================================================
// HELPERS
// ============================================================

function safeRatio(numerator: number, denominator: number, fallback = 0): number {
  return denominator !== 0 ? numerator / denominator : fallback;
}

function safePct(numerator: number, denominator: number, fallback = 0): number {
  return denominator !== 0 ? (numerator / denominator) * 100 : fallback;
}

/** עוזר לקבל ערך לשנה (אם המערך קצר, החזר ערך אחרון) */
function arrAt(arr: number[] | null | undefined, idx: number, fallback = 0): number {
  if (!arr || arr.length === 0) return fallback;
  return arr[idx] ?? arr[arr.length - 1] ?? fallback;
}

// ============================================================
// MAIN ENGINE
// ============================================================

/**
 * בונה מודל מלא: היסטוריה (כפי שהוזנה) + תחזית.
 */
export function buildThreeStatementModel(
  historical: AnnualStatements[],
  assumptions: ForecastAssumptions,
): ThreeStatementModel {
  if (historical.length === 0) {
    throw new Error('דרושה לפחות שנת בסיס אחת לבניית מודל');
  }

  // וודא שההיסטוריה ממוינת לפי שנה
  const sortedHistorical = [...historical].sort((a, b) => a.year - b.year);
  const baseYear = sortedHistorical[sortedHistorical.length - 1];
  const projected: AnnualStatements[] = [];

  let prev = baseYear;
  for (let i = 0; i < assumptions.yearsToProject; i++) {
    const projection = projectYear(prev, assumptions, i);
    projected.push(projection);
    prev = projection;
  }

  return {
    historical: sortedHistorical,
    projected,
    assumptions,
    baseYear: baseYear.year,
    modelDate: new Date().toISOString().split('T')[0],
  };
}

/**
 * חיזוי שנה אחת קדימה ע"ב הקודמת + הנחות.
 */
function projectYear(
  prev: AnnualStatements,
  assumptions: ForecastAssumptions,
  yearIdx: number,
): AnnualStatements {
  const year = prev.year + 1;

  // ============= P&L =============
  const revenueGrowth = arrAt(assumptions.revenueGrowthPct, yearIdx, 0) / 100;
  const revenue = prev.pnl.revenue * (1 + revenueGrowth);

  // מרווח גולמי - אם הוגדר, השתמש; אחרת שמר על אותו יחס
  let grossMarginPct: number;
  if (assumptions.grossMarginPct !== null && assumptions.grossMarginPct.length > 0) {
    grossMarginPct = arrAt(assumptions.grossMarginPct, yearIdx, 0) / 100;
  } else {
    grossMarginPct = safeRatio(prev.pnl.grossProfit, prev.pnl.revenue, 0.4);
  }
  const grossProfit = revenue * grossMarginPct;
  const cogs = revenue - grossProfit;

  // OpEx - אחוז מהכנסות (אם הוגדר; אחרת היסטורי)
  const rndPct =
    assumptions.rndPctOfRevenue !== null
      ? arrAt(assumptions.rndPctOfRevenue, yearIdx, 0) / 100
      : safeRatio(prev.pnl.rnd, prev.pnl.revenue, 0);
  const marketingPct =
    assumptions.marketingPctOfRevenue !== null
      ? arrAt(assumptions.marketingPctOfRevenue, yearIdx, 0) / 100
      : safeRatio(prev.pnl.marketing, prev.pnl.revenue, 0.1);
  const operatingPct =
    assumptions.operatingPctOfRevenue !== null
      ? arrAt(assumptions.operatingPctOfRevenue, yearIdx, 0) / 100
      : safeRatio(prev.pnl.operating, prev.pnl.revenue, 0.15);

  const rnd = revenue * rndPct;
  const marketing = revenue * marketingPct;
  const operating = revenue * operatingPct;

  const ebitda = grossProfit - rnd - marketing - operating;
  const depreciation = arrAt(assumptions.depreciationPerYear, yearIdx, prev.pnl.depreciation);
  const ebit = ebitda - depreciation;

  // ריבית - על חוב ממוצע
  const debtIssuance = arrAt(assumptions.debtIssuancePerYear, yearIdx, 0);
  const debtRepayment = arrAt(assumptions.debtRepaymentPerYear, yearIdx, 0);
  const avgDebt =
    (prev.balanceSheet.shortTermDebt +
      prev.balanceSheet.longTermDebt +
      debtIssuance / 2 -
      debtRepayment / 2);
  const interest = (avgDebt * assumptions.effectiveInterestRate) / 100;

  const preTaxProfit = ebit - interest;
  const tax = preTaxProfit > 0 ? (preTaxProfit * assumptions.effectiveTaxRate) / 100 : 0;
  const netProfit = preTaxProfit - tax;

  const pnl: AnnualPnL = {
    revenue,
    cogs,
    grossProfit,
    rnd,
    marketing,
    operating,
    ebitda,
    depreciation,
    ebit,
    interest,
    preTaxProfit,
    tax,
    netProfit,
  };

  // ============= BALANCE SHEET =============
  // הון חוזר - על בסיס ימים (DSO/DPO/DIO)
  const dailyRevenue = revenue / 365;
  const dailyCogs = cogs / 365;
  const accountsReceivable = dailyRevenue * assumptions.dso;
  const inventory = dailyCogs * assumptions.dio;
  const accountsPayable = dailyCogs * assumptions.dpo;

  // CapEx → הוסף לנכסים קבועים (פחת מקטין)
  const capex = arrAt(assumptions.capexPerYear, yearIdx, 0);
  const fixedAssets = prev.balanceSheet.fixedAssets + capex - depreciation;
  const intangibleAssets = prev.balanceSheet.intangibleAssets;

  // חוב
  const longTermDebt = Math.max(0, prev.balanceSheet.longTermDebt + debtIssuance - debtRepayment);
  const shortTermDebt = prev.balanceSheet.shortTermDebt;

  // הוצאות נדחות / שונות - שמר אחוז
  const otherCurrentAssets = prev.balanceSheet.otherCurrentAssets;
  const otherCurrentLiabilities = prev.balanceSheet.otherCurrentLiabilities;

  // הון - retained earnings מצטברים
  const dividends = arrAt(assumptions.dividendsPerYear, yearIdx, 0);
  const retainedEarnings = prev.balanceSheet.retainedEarnings + netProfit - dividends;
  const shareCapital = prev.balanceSheet.shareCapital;
  const totalEquity = shareCapital + retainedEarnings;

  // נכסים בסיסיים בלי מזומן (cash משלים)
  const totalCurrentLiabilities =
    accountsPayable + shortTermDebt + otherCurrentLiabilities;
  const totalLiabilities = totalCurrentLiabilities + longTermDebt;

  // זהות מאזן: Total Assets = Total Liabilities + Equity → Cash הוא ה-plug
  const totalAssetsRequired = totalLiabilities + totalEquity;
  const nonCashAssets =
    accountsReceivable + inventory + otherCurrentAssets + fixedAssets + intangibleAssets;
  const cash = totalAssetsRequired - nonCashAssets;

  const totalCurrentAssets = cash + accountsReceivable + inventory + otherCurrentAssets;
  const totalAssets = totalCurrentAssets + fixedAssets + intangibleAssets;

  const balanceSheet: AnnualBalanceSheet = {
    cash,
    accountsReceivable,
    inventory,
    otherCurrentAssets,
    totalCurrentAssets,
    fixedAssets,
    intangibleAssets,
    totalAssets,
    accountsPayable,
    shortTermDebt,
    otherCurrentLiabilities,
    totalCurrentLiabilities,
    longTermDebt,
    totalLiabilities,
    shareCapital,
    retainedEarnings,
    totalEquity,
  };

  // ============= CASH FLOW STATEMENT (אינדירקט) =============
  // CFO = NI + Depreciation - ΔWC
  const changeInAR = accountsReceivable - prev.balanceSheet.accountsReceivable;
  const changeInInventory = inventory - prev.balanceSheet.inventory;
  const changeInAP = accountsPayable - prev.balanceSheet.accountsPayable;
  const changeInOtherCA = otherCurrentAssets - prev.balanceSheet.otherCurrentAssets;
  const changeInOtherCL = otherCurrentLiabilities - prev.balanceSheet.otherCurrentLiabilities;

  // ΔWC: הגדלה ב-AR/Inventory מורידה מזומן; הגדלה ב-AP מוסיפה
  const changeInWC =
    -changeInAR - changeInInventory - changeInOtherCA + changeInAP + changeInOtherCL;
  const cashFromOperations = netProfit + depreciation + changeInWC;

  // CFI - השקעות (CapEx שלילי)
  const cashFromInvesting = -capex;

  // CFF - הנפקת חוב, החזרים, דיבידנדים
  const cashFromFinancing = debtIssuance - debtRepayment - dividends;

  const netChangeInCash = cashFromOperations + cashFromInvesting + cashFromFinancing;
  const openingCash = prev.balanceSheet.cash;
  const closingCash = openingCash + netChangeInCash;

  const cashFlow: AnnualCashFlow = {
    netIncome: netProfit,
    depreciation,
    changeInWC,
    cashFromOperations,
    capex,
    cashFromInvesting,
    debtIssuance,
    debtRepayment,
    equityIssuance: 0,
    dividends,
    cashFromFinancing,
    netChangeInCash,
    openingCash,
    closingCash,
  };

  return {
    year,
    isProjection: true,
    pnl,
    balanceSheet,
    cashFlow,
  };
}

// ============================================================
// VALIDATION
// ============================================================

/**
 * בודק שמאזן מאוזן (Total Assets = Total Liab + Equity).
 */
export function validateBalanceSheet(bs: AnnualBalanceSheet, tolerance = 1): boolean {
  const lhs = bs.totalAssets;
  const rhs = bs.totalLiabilities + bs.totalEquity;
  return Math.abs(lhs - rhs) < tolerance;
}

/**
 * בודק שתזרים מסתדר עם שינוי במזומן במאזן.
 */
export function validateCashFlowConsistency(
  cf: AnnualCashFlow,
  prevBS: AnnualBalanceSheet,
  currBS: AnnualBalanceSheet,
  tolerance = 1,
): boolean {
  const expectedClosing = prevBS.cash + cf.netChangeInCash;
  return Math.abs(expectedClosing - currBS.cash) < tolerance;
}

// ============================================================
// HISTORICAL DATA HELPERS
// ============================================================

/**
 * יוצר שנה היסטורית ריקה למילוי ידני.
 */
export function createEmptyAnnualStatements(year: number): AnnualStatements {
  const emptyPnL: AnnualPnL = {
    revenue: 0,
    cogs: 0,
    grossProfit: 0,
    rnd: 0,
    marketing: 0,
    operating: 0,
    ebitda: 0,
    depreciation: 0,
    ebit: 0,
    interest: 0,
    preTaxProfit: 0,
    tax: 0,
    netProfit: 0,
  };
  const emptyBS: AnnualBalanceSheet = {
    cash: 0,
    accountsReceivable: 0,
    inventory: 0,
    otherCurrentAssets: 0,
    totalCurrentAssets: 0,
    fixedAssets: 0,
    intangibleAssets: 0,
    totalAssets: 0,
    accountsPayable: 0,
    shortTermDebt: 0,
    otherCurrentLiabilities: 0,
    totalCurrentLiabilities: 0,
    longTermDebt: 0,
    totalLiabilities: 0,
    shareCapital: 0,
    retainedEarnings: 0,
    totalEquity: 0,
  };
  const emptyCF: AnnualCashFlow = {
    netIncome: 0,
    depreciation: 0,
    changeInWC: 0,
    cashFromOperations: 0,
    capex: 0,
    cashFromInvesting: 0,
    debtIssuance: 0,
    debtRepayment: 0,
    equityIssuance: 0,
    dividends: 0,
    cashFromFinancing: 0,
    netChangeInCash: 0,
    openingCash: 0,
    closingCash: 0,
  };
  return {
    year,
    isProjection: false,
    pnl: emptyPnL,
    balanceSheet: emptyBS,
    cashFlow: emptyCF,
  };
}

/**
 * מחשב שדות נגזרים ב-P&L (gross profit, EBITDA וכו') מתוך שדות בסיס.
 */
export function recomputePnL(pnl: AnnualPnL): AnnualPnL {
  const grossProfit = pnl.revenue - pnl.cogs;
  const ebitda = grossProfit - pnl.rnd - pnl.marketing - pnl.operating;
  const ebit = ebitda - pnl.depreciation;
  const preTaxProfit = ebit - pnl.interest;
  const netProfit = preTaxProfit - pnl.tax;
  return {
    ...pnl,
    grossProfit,
    ebitda,
    ebit,
    preTaxProfit,
    netProfit,
  };
}

/**
 * מחשב שדות מסכמים במאזן.
 */
export function recomputeBalanceSheet(bs: AnnualBalanceSheet): AnnualBalanceSheet {
  const totalCurrentAssets =
    bs.cash + bs.accountsReceivable + bs.inventory + bs.otherCurrentAssets;
  const totalAssets = totalCurrentAssets + bs.fixedAssets + bs.intangibleAssets;
  const totalCurrentLiabilities =
    bs.accountsPayable + bs.shortTermDebt + bs.otherCurrentLiabilities;
  const totalLiabilities = totalCurrentLiabilities + bs.longTermDebt;
  const totalEquity = bs.shareCapital + bs.retainedEarnings;
  return {
    ...bs,
    totalCurrentAssets,
    totalAssets,
    totalCurrentLiabilities,
    totalLiabilities,
    totalEquity,
  };
}

// ============================================================
// SUGGESTED ASSUMPTIONS
// ============================================================

/**
 * מציע הנחות חיזוי על בסיס ההיסטוריה (ממוצע + טרנדים).
 */
export function suggestAssumptions(
  historical: AnnualStatements[],
  yearsToProject: number = 5,
): ForecastAssumptions {
  if (historical.length === 0) {
    return defaultAssumptions(yearsToProject);
  }

  const sorted = [...historical].sort((a, b) => a.year - b.year);
  const last = sorted[sorted.length - 1];

  // חישוב צמיחה ממוצעת (אם יש 2+ שנים)
  let avgGrowth = 5; // ברירת מחדל 5%
  if (sorted.length >= 2) {
    const growthRates: number[] = [];
    for (let i = 1; i < sorted.length; i++) {
      if (sorted[i - 1].pnl.revenue > 0) {
        growthRates.push(
          ((sorted[i].pnl.revenue - sorted[i - 1].pnl.revenue) /
            sorted[i - 1].pnl.revenue) *
            100,
        );
      }
    }
    if (growthRates.length > 0) {
      avgGrowth = growthRates.reduce((s, v) => s + v, 0) / growthRates.length;
    }
  }

  const grossMargin = safePct(last.pnl.grossProfit, last.pnl.revenue, 40);
  const rndPct = safePct(last.pnl.rnd, last.pnl.revenue, 0);
  const marketingPct = safePct(last.pnl.marketing, last.pnl.revenue, 10);
  const operatingPct = safePct(last.pnl.operating, last.pnl.revenue, 15);

  // ימים על בסיס הנתונים האחרונים
  const dso = last.pnl.revenue > 0 ? (last.balanceSheet.accountsReceivable / last.pnl.revenue) * 365 : 45;
  const dpo = last.pnl.cogs > 0 ? (last.balanceSheet.accountsPayable / last.pnl.cogs) * 365 : 60;
  const dio = last.pnl.cogs > 0 ? (last.balanceSheet.inventory / last.pnl.cogs) * 365 : 30;

  return {
    revenueGrowthPct: Array(yearsToProject).fill(avgGrowth),
    grossMarginPct: Array(yearsToProject).fill(grossMargin),
    rndPctOfRevenue: Array(yearsToProject).fill(rndPct),
    marketingPctOfRevenue: Array(yearsToProject).fill(marketingPct),
    operatingPctOfRevenue: Array(yearsToProject).fill(operatingPct),
    depreciationPerYear: Array(yearsToProject).fill(last.pnl.depreciation),
    effectiveInterestRate: 6, // הנחה: 6% ברירת מחדל
    effectiveTaxRate: 23, // מס חברות בישראל
    dso: Math.round(dso),
    dpo: Math.round(dpo),
    dio: Math.round(dio),
    capexPerYear: Array(yearsToProject).fill(last.cashFlow.capex || 0),
    debtIssuancePerYear: Array(yearsToProject).fill(0),
    debtRepaymentPerYear: Array(yearsToProject).fill(0),
    dividendsPerYear: Array(yearsToProject).fill(0),
    yearsToProject,
  };
}

// ============================================================
// CONVERT BUDGET → BASE YEAR
// ============================================================

/**
 * המרת תקציב חודשי + מאזן (אופציונלי) לשנת בסיס.
 * משמש לטעינת המודל ישירות מהתקציב הקיים.
 */
export function convertBudgetToBaseYear(
  budget: BudgetData,
  settings: PeriodSettings,
  balanceSheet?: BalanceSheetData | null,
  customDepreciation: number = 0,
): AnnualStatements {
  const monthly = calculateAllMonths(budget, settings);
  const totals = calculateBudgetTotals(monthly);
  const year = settings.fiscalYear;

  // P&L מהתקציב
  const pnl: AnnualPnL = {
    revenue: totals.income,
    cogs: totals.cogs,
    grossProfit: totals.grossProfit,
    rnd: totals.rnd,
    marketing: totals.marketing,
    operating: totals.operating,
    ebitda: totals.ebitda,
    depreciation: customDepreciation,
    ebit: totals.ebitda - customDepreciation,
    interest: totals.financial,
    preTaxProfit: totals.ebitda - customDepreciation - totals.financial,
    tax: totals.tax,
    netProfit: totals.netProfit,
  };

  // מאזן: אם מאזן קיים נשתמש בו, אחרת ננסה להעריך
  let bs: AnnualBalanceSheet;
  if (balanceSheet) {
    bs = recomputeBalanceSheet({
      cash: balanceSheet.cashAndEquivalents,
      accountsReceivable: balanceSheet.accountsReceivable,
      inventory: balanceSheet.inventory,
      otherCurrentAssets: 0,
      totalCurrentAssets: balanceSheet.currentAssets,
      fixedAssets: balanceSheet.fixedAssets,
      intangibleAssets: 0,
      totalAssets: balanceSheet.totalAssets,
      accountsPayable: balanceSheet.accountsPayable,
      shortTermDebt: balanceSheet.shortTermDebt,
      otherCurrentLiabilities: 0,
      totalCurrentLiabilities: balanceSheet.currentLiabilities,
      longTermDebt: balanceSheet.longTermDebt,
      totalLiabilities: balanceSheet.totalLiabilities,
      shareCapital: 0,
      retainedEarnings: balanceSheet.retainedEarnings ?? balanceSheet.totalEquity,
      totalEquity: balanceSheet.totalEquity,
    });
  } else {
    // הערכה: מבוסס יחסים סטנדרטיים מההכנסות
    const ar = totals.income > 0 ? (totals.income / 12) * 1.5 : 0; // ~45 days DSO
    const inv = totals.cogs > 0 ? (totals.cogs / 12) * 1 : 0; // ~30 days DIO
    const ap = totals.cogs > 0 ? (totals.cogs / 12) * 2 : 0; // ~60 days DPO
    const cash = settings.openingBalance;
    const totalAssets = cash + ar + inv + (totals.income * 0.2);
    const fixedAssets = totals.income * 0.2;
    const totalLoans = budget.loans.reduce((s, l) => s + l.amount, 0);

    bs = recomputeBalanceSheet({
      cash,
      accountsReceivable: ar,
      inventory: inv,
      otherCurrentAssets: 0,
      totalCurrentAssets: 0,
      fixedAssets,
      intangibleAssets: 0,
      totalAssets: 0,
      accountsPayable: ap,
      shortTermDebt: 0,
      otherCurrentLiabilities: 0,
      totalCurrentLiabilities: 0,
      longTermDebt: totalLoans,
      totalLiabilities: 0,
      shareCapital: Math.max(0, totalAssets - ap - totalLoans - totals.netProfit),
      retainedEarnings: totals.netProfit,
      totalEquity: 0,
    });
  }

  // תזרים פשוט (יחושב מחדש בחיזוי)
  const cashFlow: AnnualCashFlow = {
    netIncome: pnl.netProfit,
    depreciation: pnl.depreciation,
    changeInWC: 0,
    cashFromOperations: pnl.netProfit + pnl.depreciation,
    capex: 0,
    cashFromInvesting: 0,
    debtIssuance: 0,
    debtRepayment: 0,
    equityIssuance: 0,
    dividends: 0,
    cashFromFinancing: 0,
    netChangeInCash: pnl.netProfit + pnl.depreciation,
    openingCash: bs.cash - (pnl.netProfit + pnl.depreciation),
    closingCash: bs.cash,
  };

  return {
    year,
    isProjection: false,
    pnl,
    balanceSheet: bs,
    cashFlow,
  };
}

export function defaultAssumptions(yearsToProject: number = 5): ForecastAssumptions {
  return {
    revenueGrowthPct: Array(yearsToProject).fill(10),
    grossMarginPct: Array(yearsToProject).fill(40),
    rndPctOfRevenue: Array(yearsToProject).fill(5),
    marketingPctOfRevenue: Array(yearsToProject).fill(10),
    operatingPctOfRevenue: Array(yearsToProject).fill(15),
    depreciationPerYear: Array(yearsToProject).fill(0),
    effectiveInterestRate: 6,
    effectiveTaxRate: 23,
    dso: 45,
    dpo: 60,
    dio: 30,
    capexPerYear: Array(yearsToProject).fill(0),
    debtIssuancePerYear: Array(yearsToProject).fill(0),
    debtRepaymentPerYear: Array(yearsToProject).fill(0),
    dividendsPerYear: Array(yearsToProject).fill(0),
    yearsToProject,
  };
}
