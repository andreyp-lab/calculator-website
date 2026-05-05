/**
 * DCF Valuation Engine
 *
 * שיטה מקצועית להערכת שווי חברה על בסיס תזרימי מזומנים חופשיים עתידיים.
 *
 * שלבים:
 * 1. הצג FCF לשנים מפורשות (Explicit Forecast Period, בד"כ 5-10 שנים)
 * 2. נכס למזומן נוכחי בעזרת WACC
 * 3. חשב Terminal Value (Gordon Growth או Exit Multiple)
 * 4. נכס את ה-TV לזמן 0
 * 5. סכם → Enterprise Value
 * 6. הורד חוב נטו → Equity Value
 * 7. חלק במספר מניות → Price per Share
 *
 * המנוע גם יודע:
 * - לחשב WACC מ-CAPM
 * - לבנות מטריצת רגישות (WACC × Growth)
 * - להמיר Three-Statement → DCF inputs
 */

import type {
  DCFInput,
  DCFResult,
  WACCInput,
  ThreeStatementModel,
  AnnualStatements,
} from './types';

// ============================================================
// WACC CALCULATION
// ============================================================

/**
 * חישוב Cost of Equity ע"פ CAPM:
 *   Re = Rf + β × ERP
 */
export function calculateCostOfEquity(input: WACCInput): number {
  return input.riskFreeRate + input.beta * input.equityRiskPremium;
}

/**
 * חישוב WACC = (E/V) × Re + (D/V) × Rd × (1-T)
 */
export function calculateWACC(input: WACCInput): number {
  const ce = calculateCostOfEquity(input);
  const afterTaxDebt = input.costOfDebt * (1 - input.taxRate / 100);
  return (input.equityWeight / 100) * ce + (input.debtWeight / 100) * afterTaxDebt;
}

// ============================================================
// FREE CASH FLOW
// ============================================================

/**
 * FCFF = EBIT × (1-T) + Depreciation - CapEx - Δ Working Capital
 */
export function calculateFCFF(year: AnnualStatements, taxRate: number): number {
  const nopat = year.pnl.ebit * (1 - taxRate / 100);
  const depreciation = year.pnl.depreciation;
  const capex = year.cashFlow.capex;
  const deltaWC = -year.cashFlow.changeInWC; // changeInWC is positive when freed
  return nopat + depreciation - capex - deltaWC;
}

/**
 * חילוץ FCFs מ-Three-Statement model.
 */
export function extractFCFsFromModel(
  model: ThreeStatementModel,
  taxRate: number = 23,
): number[] {
  return model.projected.map((y) => calculateFCFF(y, taxRate));
}

// ============================================================
// CORE DCF VALUATION
// ============================================================

export function valuateDCF(input: DCFInput): DCFResult {
  const { freeCashFlows, wacc, terminalGrowthRate, netDebt } = input;
  const r = wacc / 100;
  const g = terminalGrowthRate / 100;

  if (freeCashFlows.length === 0) {
    throw new Error('Free cash flows required for DCF');
  }

  // Step 1: PV of explicit FCFs
  const pvOfExplicitCashFlows = freeCashFlows.map(
    (fcf, t) => fcf / Math.pow(1 + r, t + 1),
  );
  const sumOfExplicitPV = pvOfExplicitCashFlows.reduce((s, v) => s + v, 0);

  // Step 2: Terminal Value
  let terminalValue: number;
  const lastFCF = freeCashFlows[freeCashFlows.length - 1];

  if (input.terminalMethod === 'gordon') {
    // Gordon Growth: TV = FCF_(n+1) / (r - g)
    if (r <= g) {
      throw new Error('WACC must exceed terminal growth rate');
    }
    terminalValue = (lastFCF * (1 + g)) / (r - g);
  } else {
    // Exit Multiple: TV = EBITDA × Multiple
    if (!input.exitMultiple || !input.finalEbitda) {
      throw new Error('Exit multiple method requires exitMultiple and finalEbitda');
    }
    terminalValue = input.finalEbitda * input.exitMultiple;
  }

  // Step 3: PV of TV
  const pvOfTerminalValue = terminalValue / Math.pow(1 + r, freeCashFlows.length);

  // Step 4: Enterprise Value
  const enterpriseValue = sumOfExplicitPV + pvOfTerminalValue;

  // Step 5: Equity Value
  const equityValue = enterpriseValue - netDebt;

  // Step 6: Price per Share
  const pricePerShare =
    input.sharesOutstanding && input.sharesOutstanding > 0
      ? equityValue / input.sharesOutstanding
      : undefined;

  // % from Terminal
  const terminalValueShare = enterpriseValue !== 0 ? pvOfTerminalValue / enterpriseValue : 0;

  return {
    pvOfExplicitCashFlows,
    sumOfExplicitPV,
    terminalValue,
    pvOfTerminalValue,
    enterpriseValue,
    equityValue,
    pricePerShare,
    terminalValueShare,
  };
}

// ============================================================
// SENSITIVITY ANALYSIS
// ============================================================

export interface SensitivityCell {
  wacc: number;
  growth: number;
  equityValue: number;
  pricePerShare?: number;
}

/**
 * מטריצת רגישות: שווי הוני לפי שינויים ב-WACC ו-Growth.
 */
export function buildDCFSensitivityMatrix(
  baseInput: DCFInput,
  waccRange: number[] = [-2, -1, 0, 1, 2], // % deltas
  growthRange: number[] = [-1, -0.5, 0, 0.5, 1],
): SensitivityCell[][] {
  const matrix: SensitivityCell[][] = [];
  for (const dWacc of waccRange) {
    const row: SensitivityCell[] = [];
    for (const dGrowth of growthRange) {
      const adjustedInput: DCFInput = {
        ...baseInput,
        wacc: baseInput.wacc + dWacc,
        terminalGrowthRate: baseInput.terminalGrowthRate + dGrowth,
      };
      try {
        const result = valuateDCF(adjustedInput);
        row.push({
          wacc: adjustedInput.wacc,
          growth: adjustedInput.terminalGrowthRate,
          equityValue: result.equityValue,
          pricePerShare: result.pricePerShare,
        });
      } catch {
        row.push({
          wacc: adjustedInput.wacc,
          growth: adjustedInput.terminalGrowthRate,
          equityValue: NaN,
        });
      }
    }
    matrix.push(row);
  }
  return matrix;
}

// ============================================================
// EQUITY BRIDGE (EV → Equity Value)
// ============================================================

export interface EquityBridge {
  enterpriseValue: number;
  totalDebt: number;
  cash: number;
  netDebt: number;
  minorityInterest: number;
  preferredEquity: number;
  equityValue: number;
}

export function calculateEquityBridge(
  enterpriseValue: number,
  totalDebt: number,
  cash: number,
  minorityInterest: number = 0,
  preferredEquity: number = 0,
): EquityBridge {
  const netDebt = totalDebt - cash;
  const equityValue = enterpriseValue - netDebt - minorityInterest - preferredEquity;
  return {
    enterpriseValue,
    totalDebt,
    cash,
    netDebt,
    minorityInterest,
    preferredEquity,
    equityValue,
  };
}

// ============================================================
// VALUATION SUMMARY (multiple methods)
// ============================================================

export interface ValuationRange {
  method: string;
  lowEquity: number;
  midEquity: number;
  highEquity: number;
  lowPrice?: number;
  midPrice?: number;
  highPrice?: number;
}

/**
 * טווח שווי משולש: נמוך / מרכז / גבוה.
 */
export function buildValuationRange(
  baseInput: DCFInput,
  waccDelta: number = 1,
  growthDelta: number = 0.5,
): ValuationRange {
  // Low: high WACC, low growth = pessimistic
  const low = valuateDCF({
    ...baseInput,
    wacc: baseInput.wacc + waccDelta,
    terminalGrowthRate: baseInput.terminalGrowthRate - growthDelta,
  });
  // High: low WACC, high growth = optimistic
  const high = valuateDCF({
    ...baseInput,
    wacc: baseInput.wacc - waccDelta,
    terminalGrowthRate: baseInput.terminalGrowthRate + growthDelta,
  });
  // Mid: base case
  const mid = valuateDCF(baseInput);

  return {
    method: baseInput.terminalMethod === 'gordon' ? 'DCF Gordon Growth' : 'DCF Exit Multiple',
    lowEquity: low.equityValue,
    midEquity: mid.equityValue,
    highEquity: high.equityValue,
    lowPrice: low.pricePerShare,
    midPrice: mid.pricePerShare,
    highPrice: high.pricePerShare,
  };
}
