import { describe, it, expect } from 'vitest';
import {
  valuateDCF,
  calculateWACC,
  calculateCostOfEquity,
  buildDCFSensitivityMatrix,
  buildValuationRange,
  calculateEquityBridge,
} from '@/lib/tools/dcf-engine';

describe('dcf-engine', () => {
  describe('CAPM cost of equity', () => {
    it('Re = Rf + β × ERP', () => {
      // Rf=4, β=1.2, ERP=6 → 4 + 7.2 = 11.2
      const ce = calculateCostOfEquity({
        debtWeight: 0,
        equityWeight: 100,
        costOfDebt: 0,
        taxRate: 23,
        riskFreeRate: 4,
        beta: 1.2,
        equityRiskPremium: 6,
      });
      expect(ce).toBeCloseTo(11.2, 1);
    });
  });

  describe('WACC', () => {
    it('weighted average', () => {
      // 70% E @ 11.2%, 30% D @ 7% × (1 - 0.23) = 5.39%
      // WACC = 0.7 × 11.2 + 0.3 × 5.39 = 7.84 + 1.617 = 9.46
      const wacc = calculateWACC({
        debtWeight: 30,
        equityWeight: 70,
        costOfDebt: 7,
        taxRate: 23,
        riskFreeRate: 4,
        beta: 1.2,
        equityRiskPremium: 6,
      });
      expect(wacc).toBeCloseTo(9.46, 1);
    });
  });

  describe('valuateDCF Gordon Growth', () => {
    it('discounts FCFs and adds terminal value', () => {
      const result = valuateDCF({
        freeCashFlows: [100, 110, 120],
        wacc: 10,
        terminalGrowthRate: 2,
        terminalMethod: 'gordon',
        netDebt: 50,
      });
      expect(result.pvOfExplicitCashFlows).toHaveLength(3);
      // PV(100) at 10% = 90.91
      expect(result.pvOfExplicitCashFlows[0]).toBeCloseTo(90.91, 1);
      // Terminal value = 120 × 1.02 / (0.10 - 0.02) = 1530
      expect(result.terminalValue).toBeCloseTo(1530, 0);
      // PV of TV at year 3
      expect(result.pvOfTerminalValue).toBeCloseTo(1530 / Math.pow(1.1, 3), 0);
      expect(result.equityValue).toBe(result.enterpriseValue - 50);
    });

    it('throws if WACC <= terminal growth', () => {
      expect(() =>
        valuateDCF({
          freeCashFlows: [100],
          wacc: 5,
          terminalGrowthRate: 5,
          terminalMethod: 'gordon',
          netDebt: 0,
        }),
      ).toThrow();
    });
  });

  describe('valuateDCF Exit Multiple', () => {
    it('uses EBITDA × multiple for terminal', () => {
      const result = valuateDCF({
        freeCashFlows: [100, 100],
        wacc: 10,
        terminalGrowthRate: 0, // not used
        terminalMethod: 'exit_multiple',
        exitMultiple: 8,
        finalEbitda: 200,
        netDebt: 0,
      });
      // TV = 200 × 8 = 1600
      expect(result.terminalValue).toBe(1600);
    });
  });

  describe('Sensitivity Matrix', () => {
    it('produces 5x5 matrix by default', () => {
      const matrix = buildDCFSensitivityMatrix({
        freeCashFlows: [100, 110, 120],
        wacc: 10,
        terminalGrowthRate: 2,
        terminalMethod: 'gordon',
        netDebt: 0,
      });
      expect(matrix).toHaveLength(5);
      expect(matrix[0]).toHaveLength(5);
    });
  });

  describe('Equity Bridge', () => {
    it('subtracts net debt and minority', () => {
      const bridge = calculateEquityBridge(1000, 200, 50, 30, 20);
      expect(bridge.netDebt).toBe(150);
      expect(bridge.equityValue).toBe(1000 - 150 - 30 - 20); // 800
    });
  });

  describe('Valuation Range', () => {
    it('low ≤ mid ≤ high', () => {
      const range = buildValuationRange({
        freeCashFlows: [100, 110, 120],
        wacc: 10,
        terminalGrowthRate: 2,
        terminalMethod: 'gordon',
        netDebt: 0,
      });
      expect(range.lowEquity).toBeLessThanOrEqual(range.midEquity);
      expect(range.midEquity).toBeLessThanOrEqual(range.highEquity);
    });
  });
});
