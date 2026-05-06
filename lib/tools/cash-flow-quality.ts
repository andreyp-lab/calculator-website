/**
 * Cash Flow Quality Analyzer
 *
 * ניתוח איכות תזרים מזומנים:
 * 1. Direct Method - תזרים תפעולי מהותי לפי הרכיבים
 * 2. Indirect Method - מ-Net Income עם התאמות
 * 3. Free Cash Flow (FCFF, FCFE)
 * 4. Quality Analysis - האם הרווח מומר למזומן?
 * 5. Coverage Ratios - יכולת לכסות חוב/דיבידנד/CapEx מתזרים
 *
 * המטרה: לחשוף מצבים של "רווח על נייר" - חברה שמדווחת רווח אבל
 * לא רואה אותו במזומן (לקוחות שלא משלמים, מלאי שתופח, וכו').
 */

export interface CashFlowQualityInput {
  // P&L
  revenue: number;
  netProfit: number;
  ebit: number;
  ebitda: number;
  depreciation: number;
  amortization: number;
  interestExpense: number;
  taxExpense: number;
  // Direct method components
  cashFromCustomers?: number;
  cashToSuppliers?: number;
  cashToEmployees?: number;
  // Working capital changes (current vs previous)
  changeInReceivables: number;
  changeInInventory: number;
  changeInPayables: number;
  changeInOtherWC: number;
  // Investing
  capex: number;
  assetSales: number;
  // Financing
  debtIssuance: number;
  debtRepayment: number;
  dividendsPaid: number;
  equityIssuance: number;
  // Beginning balance
  openingCash: number;
}

export interface CashFlowDecomposition {
  netIncome: number;
  depreciation: number;
  amortization: number;
  changeInWC: {
    receivables: number;
    inventory: number;
    payables: number;
    other: number;
    total: number;
  };
  cashFromOperations: number;
  capex: number;
  assetSales: number;
  cashFromInvesting: number;
  debtIssuance: number;
  debtRepayment: number;
  dividends: number;
  equity: number;
  cashFromFinancing: number;
  netChangeInCash: number;
  endingCash: number;
}

export interface CashFlowQualityResult {
  decomposition: CashFlowDecomposition;
  freeCashFlow: {
    fcff: number; // Free Cash Flow to Firm
    fcfe: number; // Free Cash Flow to Equity
    unleveredFCF: number;
    leveredFCF: number;
    fcfMargin: number; // FCF / Revenue %
  };
  qualityMetrics: {
    cashFlowToNetIncome: number; // Should be > 1 for high quality
    cashFlowMargin: number; // OCF / Revenue
    accrualRatio: number; // (NI - OCF) / Total Assets
    earningsQuality: 'excellent' | 'good' | 'fair' | 'poor' | 'red_flag';
    qualityScore: number; // 0-100
  };
  coverageRatios: {
    cashFlowToDebt: number;
    cashFlowToInterest: number;
    cashFlowToCapex: number;
    cashFlowToDividends: number;
    reinvestmentRatio: number; // CapEx / OCF
  };
  insights: string[];
  warnings: string[];
}

function safeDiv(n: number, d: number, fallback = 0): number {
  return Math.abs(d) > 0.001 ? n / d : fallback;
}

export function analyzeCashFlowQuality(
  input: CashFlowQualityInput,
  totalAssets: number,
  totalDebt: number,
): CashFlowQualityResult {
  // === Indirect Method Calculation ===
  const totalWCChange =
    input.changeInPayables -
    input.changeInReceivables -
    input.changeInInventory +
    input.changeInOtherWC;

  const cashFromOperations =
    input.netProfit + input.depreciation + input.amortization + totalWCChange;

  // === Investing ===
  const cashFromInvesting = -input.capex + input.assetSales;

  // === Financing ===
  const cashFromFinancing =
    input.debtIssuance - input.debtRepayment - input.dividendsPaid + input.equityIssuance;

  // === Net Change ===
  const netChangeInCash = cashFromOperations + cashFromInvesting + cashFromFinancing;
  const endingCash = input.openingCash + netChangeInCash;

  const decomposition: CashFlowDecomposition = {
    netIncome: input.netProfit,
    depreciation: input.depreciation,
    amortization: input.amortization,
    changeInWC: {
      receivables: -input.changeInReceivables,
      inventory: -input.changeInInventory,
      payables: input.changeInPayables,
      other: input.changeInOtherWC,
      total: totalWCChange,
    },
    cashFromOperations,
    capex: -input.capex,
    assetSales: input.assetSales,
    cashFromInvesting,
    debtIssuance: input.debtIssuance,
    debtRepayment: -input.debtRepayment,
    dividends: -input.dividendsPaid,
    equity: input.equityIssuance,
    cashFromFinancing,
    netChangeInCash,
    endingCash,
  };

  // === Free Cash Flow ===
  const taxRate = input.netProfit !== 0 ? safeDiv(input.taxExpense, input.netProfit + input.taxExpense) : 0.23;
  const nopat = input.ebit * (1 - taxRate);
  const fcff = nopat + input.depreciation + input.amortization - input.capex - totalWCChange;
  const fcfe = fcff - input.interestExpense * (1 - taxRate) + (input.debtIssuance - input.debtRepayment);
  const unleveredFCF = cashFromOperations - input.capex;
  const leveredFCF = unleveredFCF - input.interestExpense - input.debtRepayment;

  // === Quality Metrics ===
  const cashFlowToNetIncome = safeDiv(cashFromOperations, input.netProfit);
  const cashFlowMargin = safeDiv(cashFromOperations, input.revenue);
  const accrualRatio = safeDiv(input.netProfit - cashFromOperations, totalAssets);

  let earningsQuality: CashFlowQualityResult['qualityMetrics']['earningsQuality'];
  let qualityScore = 50;

  if (cashFlowToNetIncome >= 1.2) {
    earningsQuality = 'excellent';
    qualityScore = 90;
  } else if (cashFlowToNetIncome >= 1.0) {
    earningsQuality = 'good';
    qualityScore = 75;
  } else if (cashFlowToNetIncome >= 0.7) {
    earningsQuality = 'fair';
    qualityScore = 55;
  } else if (cashFlowToNetIncome >= 0.3) {
    earningsQuality = 'poor';
    qualityScore = 30;
  } else {
    earningsQuality = 'red_flag';
    qualityScore = 15;
  }

  // Adjust for special cases
  if (cashFromOperations < 0 && input.netProfit > 0) {
    earningsQuality = 'red_flag';
    qualityScore = 10;
  }
  if (Math.abs(accrualRatio) > 0.1) {
    qualityScore = Math.max(0, qualityScore - 15);
  }
  if (cashFlowMargin > 0.15) {
    qualityScore = Math.min(100, qualityScore + 10);
  }

  // === Coverage Ratios ===
  const coverageRatios = {
    cashFlowToDebt: safeDiv(cashFromOperations, totalDebt),
    cashFlowToInterest: safeDiv(cashFromOperations, input.interestExpense, 999),
    cashFlowToCapex: safeDiv(cashFromOperations, input.capex, 999),
    cashFlowToDividends: safeDiv(cashFromOperations, input.dividendsPaid, 999),
    reinvestmentRatio: safeDiv(input.capex, cashFromOperations),
  };

  // === Insights & Warnings ===
  const insights: string[] = [];
  const warnings: string[] = [];

  if (cashFromOperations < 0) {
    warnings.push('🚨 תזרים תפעולי שלילי - החברה שורפת מזומנים בפעילות שוטפת!');
  }

  if (cashFromOperations > 0 && input.netProfit < 0) {
    insights.push('💪 תזרים חיובי למרות הפסד - איכות תזרים טובה (פחת/עתודות)');
  }

  if (cashFromOperations < input.netProfit * 0.5 && input.netProfit > 0) {
    warnings.push('⚠️ פער גדול בין רווח לתזרים - בדוק איכות רווחים');
    if (input.changeInReceivables > 0) {
      warnings.push(`לקוחות גדלו ב-${input.changeInReceivables.toLocaleString()} - גבייה איטית?`);
    }
    if (input.changeInInventory > 0) {
      warnings.push(`מלאי גדל ב-${input.changeInInventory.toLocaleString()} - האטה במכירות?`);
    }
  }

  if (cashFlowToNetIncome > 1.5 && input.netProfit > 0) {
    insights.push('✅ המרה מצוינת של רווח לתזרים - איכות גבוהה');
  }

  if (input.capex > cashFromOperations && cashFromOperations > 0) {
    warnings.push('💸 השקעות הון עולות על התזרים - תלות במימון חיצוני');
  }

  if (unleveredFCF > 0 && unleveredFCF > input.netProfit) {
    insights.push('🌟 תזרים חופשי חזק - יוצר ערך גם אחרי השקעות');
  }

  if (cashFlowMargin > 0.15) {
    insights.push(`💧 מרווח תזרים גבוה (${(cashFlowMargin * 100).toFixed(1)}%) - יעילות תזרימית מעולה`);
  } else if (cashFlowMargin < 0.05 && cashFromOperations > 0) {
    insights.push('📉 מרווח תזרים נמוך - יעילות תזרימית מוגבלת');
  }

  if (Math.abs(accrualRatio) > 0.1) {
    warnings.push(`⚠️ יחס צבירה גבוה (${(accrualRatio * 100).toFixed(1)}%) - חשד לרווחים לא ממומשים`);
  }

  if (coverageRatios.reinvestmentRatio > 0.8 && cashFromOperations > 0) {
    insights.push('🏗️ שיעור השקעה גבוה - השקעה בצמיחה');
  }

  return {
    decomposition,
    freeCashFlow: {
      fcff,
      fcfe,
      unleveredFCF,
      leveredFCF,
      fcfMargin: safeDiv(fcff, input.revenue),
    },
    qualityMetrics: {
      cashFlowToNetIncome,
      cashFlowMargin,
      accrualRatio,
      earningsQuality,
      qualityScore: Math.round(qualityScore),
    },
    coverageRatios,
    insights,
    warnings,
  };
}
