/**
 * מנוע ניתוח דוחות כספיים
 *
 * מבוסס על Finance Pro Advanced עם שיפורים:
 * - חישובים מלאים ב-TypeScript
 * - Altman Z-Score (private + public + service)
 * - Credit Rating (AAA-D)
 * - 20+ יחסים פיננסיים
 * - DSCR מתקדם
 */

import { BalanceSheetData, FinancialRatios, CreditRating, ZScoreResult } from './types';

// ============================================================
// FINANCIAL RATIOS - 20+ יחסים פיננסיים
// ============================================================

export interface RatioInputData {
  // P&L
  revenue: number;
  cogs: number;
  grossProfit: number;
  operatingExpenses: number;
  operatingProfit: number; // EBIT
  ebitda: number;
  netProfit: number;
  interestExpense: number;
  // Balance Sheet
  balance: BalanceSheetData;
  // Debt service
  annualDebtPayment: number; // קרן + ריבית שנתית
}

/**
 * חישוב כל היחסים הפיננסיים
 */
export function calculateRatios(data: RatioInputData): FinancialRatios {
  const safeDiv = (n: number, d: number, def: number = 0) => (d > 0 ? n / d : def);

  // נזילות
  const currentRatio = safeDiv(data.balance.currentAssets, data.balance.currentLiabilities);
  const quickRatio = safeDiv(
    data.balance.currentAssets - data.balance.inventory,
    data.balance.currentLiabilities,
  );
  const cashRatio = safeDiv(data.balance.cashAndEquivalents, data.balance.currentLiabilities);

  // רווחיות
  const grossProfitMargin = safeDiv(data.grossProfit, data.revenue) * 100;
  const operatingProfitMargin = safeDiv(data.operatingProfit, data.revenue) * 100;
  const netProfitMargin = safeDiv(data.netProfit, data.revenue) * 100;
  const returnOnAssets = safeDiv(data.netProfit, data.balance.totalAssets) * 100;
  const returnOnEquity = safeDiv(data.netProfit, data.balance.totalEquity) * 100;

  // מינוף
  const debtToEquity = safeDiv(data.balance.totalLiabilities, data.balance.totalEquity);
  const debtToAssets = safeDiv(data.balance.totalLiabilities, data.balance.totalAssets);
  const interestCoverage =
    data.interestExpense > 0 ? data.operatingProfit / data.interestExpense : 999;

  // יעילות
  const assetTurnover = safeDiv(data.revenue, data.balance.totalAssets);
  const inventoryTurnover = safeDiv(data.cogs, data.balance.inventory);
  const receivablesTurnover = safeDiv(data.revenue, data.balance.accountsReceivable);

  // הון חוזר (ימים)
  const dailyRevenue = data.revenue / 365;
  const dailyCogs = data.cogs / 365;

  const dso = dailyRevenue > 0 ? data.balance.accountsReceivable / dailyRevenue : 0;
  const dpo = dailyCogs > 0 ? data.balance.accountsPayable / dailyCogs : 0;
  const dio = dailyCogs > 0 ? data.balance.inventory / dailyCogs : 0;
  const ccc = dso + dio - dpo;

  // DSCR
  const dscr =
    data.annualDebtPayment > 0
      ? data.ebitda / data.annualDebtPayment
      : data.ebitda > 0
        ? 999
        : 0;

  return {
    currentRatio,
    quickRatio,
    cashRatio,
    grossProfitMargin,
    operatingProfitMargin,
    netProfitMargin,
    returnOnAssets,
    returnOnEquity,
    debtToEquity,
    debtToAssets,
    interestCoverage,
    assetTurnover,
    inventoryTurnover,
    receivablesTurnover,
    dso,
    dpo,
    dio,
    ccc,
    dscr,
  };
}

// ============================================================
// ALTMAN Z-SCORE
// ============================================================

export type CompanyType = 'private' | 'public' | 'service';

const ALTMAN_COEFFICIENTS = {
  private: { a: 0.717, b: 0.847, c: 3.107, d: 0.42, e: 0.998 },
  public: { a: 1.2, b: 1.4, c: 3.3, d: 0.6, e: 1.0 },
  service: { a: 6.56, b: 3.26, c: 6.72, d: 1.05, e: 0 },
};

/**
 * חישוב Altman Z-Score
 *
 * חוזה הסתברות לפשיטת רגל בתוך שנתיים:
 * - Private: > 2.9 = בטוח | 1.23-2.9 = אפור | < 1.23 = סכנה
 * - Public: > 2.99 = בטוח | 1.81-2.99 = אפור | < 1.81 = סכנה
 */
export function calculateZScore(data: RatioInputData, type: CompanyType = 'private'): ZScoreResult {
  const wc = data.balance.currentAssets - data.balance.currentLiabilities;
  const ta = data.balance.totalAssets || 1;
  const re = data.balance.retainedEarnings ?? data.balance.totalEquity * 0.6;

  const X1 = wc / ta; // Working Capital / Total Assets
  const X2 = re / ta; // Retained Earnings / Total Assets
  const X3 = data.operatingProfit / ta; // EBIT / Total Assets
  const X4 = data.balance.totalEquity / (data.balance.totalLiabilities || 1); // Equity / Liabilities
  const X5 = data.revenue / ta; // Sales / Total Assets

  const c = ALTMAN_COEFFICIENTS[type];
  const score =
    type === 'service' ? c.a * X1 + c.b * X2 + c.c * X3 + c.d * X4 : c.a * X1 + c.b * X2 + c.c * X3 + c.d * X4 + c.e * X5;

  let zone: 'safe' | 'grey' | 'distress';
  let bankruptcyProbability: string;

  const safeThreshold = type === 'private' ? 2.9 : 2.99;
  const distressThreshold = type === 'private' ? 1.23 : 1.81;

  if (score > safeThreshold) {
    zone = 'safe';
    bankruptcyProbability = 'פחות מ-5%';
  } else if (score > distressThreshold) {
    zone = 'grey';
    bankruptcyProbability = '15%-30%';
  } else {
    zone = 'distress';
    bankruptcyProbability = 'מעל 50%';
  }

  return {
    score,
    zone,
    bankruptcyProbability,
    components: {
      workingCapitalToAssets: X1,
      retainedEarningsToAssets: X2,
      ebitToAssets: X3,
      equityToDebt: X4,
      salesToAssets: X5,
    },
  };
}

// ============================================================
// HEALTH SCORE
// ============================================================

export interface HealthScore {
  totalScore: number; // 0-100
  breakdown: {
    profitability: number;
    liquidity: number;
    leverage: number;
    coverage: number;
    efficiency: number;
  };
  grade: string;
  interpretation: string;
}

/**
 * חישוב ציון בריאות פיננסית כללי
 */
export function calculateHealthScore(ratios: FinancialRatios): HealthScore {
  // רווחיות (0-100)
  let profitability = 50;
  if (ratios.netProfitMargin > 15) profitability = 95;
  else if (ratios.netProfitMargin > 10) profitability = 85;
  else if (ratios.netProfitMargin > 5) profitability = 70;
  else if (ratios.netProfitMargin > 0) profitability = 55;
  else profitability = 20;

  // נזילות
  let liquidity = 50;
  if (ratios.currentRatio > 2.5) liquidity = 95;
  else if (ratios.currentRatio > 1.8) liquidity = 80;
  else if (ratios.currentRatio > 1.2) liquidity = 65;
  else if (ratios.currentRatio > 1.0) liquidity = 50;
  else liquidity = 20;

  // מינוף
  let leverage = 50;
  if (ratios.debtToEquity < 0.5) leverage = 90;
  else if (ratios.debtToEquity < 1.0) leverage = 75;
  else if (ratios.debtToEquity < 1.5) leverage = 60;
  else if (ratios.debtToEquity < 2.5) leverage = 45;
  else leverage = 20;

  // כיסוי
  let coverage = 50;
  if (ratios.dscr > 2.0) coverage = 95;
  else if (ratios.dscr > 1.5) coverage = 80;
  else if (ratios.dscr > 1.25) coverage = 65;
  else if (ratios.dscr > 1.0) coverage = 45;
  else coverage = 15;

  // יעילות
  let efficiency = 50;
  if (ratios.ccc < 0) efficiency = 95;
  else if (ratios.ccc < 30) efficiency = 80;
  else if (ratios.ccc < 60) efficiency = 65;
  else if (ratios.ccc < 90) efficiency = 50;
  else efficiency = 30;

  // ציון סופי משוקלל
  const totalScore =
    profitability * 0.25 + liquidity * 0.2 + leverage * 0.2 + coverage * 0.2 + efficiency * 0.15;

  let grade: string;
  let interpretation: string;
  if (totalScore >= 85) {
    grade = 'A+';
    interpretation = 'מצב פיננסי מעולה';
  } else if (totalScore >= 75) {
    grade = 'A';
    interpretation = 'מצב פיננסי טוב מאוד';
  } else if (totalScore >= 65) {
    grade = 'B+';
    interpretation = 'מצב פיננסי טוב';
  } else if (totalScore >= 55) {
    grade = 'B';
    interpretation = 'מצב פיננסי סביר';
  } else if (totalScore >= 45) {
    grade = 'C';
    interpretation = 'מצב פיננסי חלש';
  } else {
    grade = 'D';
    interpretation = 'מצב פיננסי בעייתי - נדרשת התערבות';
  }

  return {
    totalScore: Math.round(totalScore),
    breakdown: { profitability, liquidity, leverage, coverage, efficiency },
    grade,
    interpretation,
  };
}

// ============================================================
// CREDIT RATING
// ============================================================

const CREDIT_RATING_THRESHOLDS = [
  { rating: 'AAA' as const, minScore: 95, maxDte: 0.3, minDscr: 3.0, minCr: 2.5 },
  { rating: 'AA' as const, minScore: 85, maxDte: 0.5, minDscr: 2.5, minCr: 2.0 },
  { rating: 'A' as const, minScore: 75, maxDte: 0.8, minDscr: 2.0, minCr: 1.8 },
  { rating: 'BBB' as const, minScore: 65, maxDte: 1.2, minDscr: 1.5, minCr: 1.5 },
  { rating: 'BB' as const, minScore: 55, maxDte: 1.8, minDscr: 1.25, minCr: 1.3 },
  { rating: 'B' as const, minScore: 45, maxDte: 2.5, minDscr: 1.1, minCr: 1.1 },
  { rating: 'CCC' as const, minScore: 35, maxDte: 3.5, minDscr: 1.0, minCr: 0.9 },
  { rating: 'CC' as const, minScore: 25, maxDte: 5.0, minDscr: 0.8, minCr: 0.7 },
  { rating: 'C' as const, minScore: 15, maxDte: 7.0, minDscr: 0.5, minCr: 0.5 },
];

const RATING_DESCRIPTIONS: Record<string, { desc: string; prob: string }> = {
  AAA: { desc: 'איכות אשראי מעולה - סיכון מינימלי', prob: '0.01%' },
  AA: { desc: 'איכות אשראי גבוהה מאוד', prob: '0.05%' },
  A: { desc: 'איכות אשראי גבוהה', prob: '0.10%' },
  BBB: { desc: 'איכות אשראי טובה', prob: '0.30%' },
  BB: { desc: 'איכות אשראי בינונית', prob: '1.00%' },
  B: { desc: 'איכות אשראי נמוכה - סיכון גבוה', prob: '3.00%' },
  CCC: { desc: 'איכות אשראי חלשה', prob: '10.00%' },
  CC: { desc: 'איכות אשראי חלשה מאוד', prob: '25.00%' },
  C: { desc: 'סיכון קריטי', prob: '50.00%' },
  D: { desc: 'חדלות פירעון', prob: '100%' },
};

/**
 * חישוב דירוג אשראי פנימי
 */
export function calculateCreditRating(
  ratios: FinancialRatios,
  healthScore: HealthScore,
): CreditRating {
  let rating: CreditRating['rating'] = 'D';
  for (const t of CREDIT_RATING_THRESHOLDS) {
    if (
      healthScore.totalScore >= t.minScore &&
      ratios.debtToEquity <= t.maxDte &&
      ratios.dscr >= t.minDscr &&
      ratios.currentRatio >= t.minCr
    ) {
      rating = t.rating;
      break;
    }
  }

  const investmentGrade = ['AAA', 'AA', 'A', 'BBB'].includes(rating);

  // Outlook
  let outlook: CreditRating['outlook'] = 'יציב';
  if (healthScore.totalScore > 75 && ratios.dscr > 2 && ratios.netProfitMargin > 8) {
    outlook = 'חיובי';
  } else if (healthScore.totalScore < 50 || ratios.dscr < 1 || ratios.netProfitMargin < 0) {
    outlook = 'שלילי';
  }

  return {
    rating,
    score: healthScore.totalScore,
    investmentGrade,
    description: RATING_DESCRIPTIONS[rating]?.desc ?? 'לא זמין',
    defaultProbability: RATING_DESCRIPTIONS[rating]?.prob ?? 'N/A',
    outlook,
  };
}

// ============================================================
// EMPTY DATA FACTORIES
// ============================================================

export function createEmptyBalanceSheet(): BalanceSheetData {
  return {
    cashAndEquivalents: 0,
    accountsReceivable: 0,
    inventory: 0,
    currentAssets: 0,
    fixedAssets: 0,
    totalAssets: 0,
    accountsPayable: 0,
    shortTermDebt: 0,
    currentLiabilities: 0,
    longTermDebt: 0,
    totalLiabilities: 0,
    totalEquity: 0,
    retainedEarnings: 0,
  };
}
