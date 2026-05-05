import { describe, it, expect } from 'vitest';
import {
  buildThreeStatementModel,
  createEmptyAnnualStatements,
  recomputePnL,
  recomputeBalanceSheet,
  defaultAssumptions,
  suggestAssumptions,
  validateBalanceSheet,
} from '@/lib/tools/three-statement-model';
import type { AnnualStatements } from '@/lib/tools/types';

function createBaseYear(year: number): AnnualStatements {
  const empty = createEmptyAnnualStatements(year);
  empty.pnl = recomputePnL({
    ...empty.pnl,
    revenue: 1000000,
    cogs: 600000,
    rnd: 50000,
    marketing: 100000,
    operating: 150000,
    depreciation: 20000,
    interest: 10000,
    tax: 0,
  });
  empty.balanceSheet = recomputeBalanceSheet({
    ...empty.balanceSheet,
    cash: 100000,
    accountsReceivable: 150000,
    inventory: 80000,
    fixedAssets: 200000,
    accountsPayable: 100000,
    longTermDebt: 200000,
    shareCapital: 100000,
    retainedEarnings: 130000,
  });
  return empty;
}

describe('three-statement-model engine', () => {
  describe('recomputePnL', () => {
    it('calculates derived fields correctly', () => {
      const base = createEmptyAnnualStatements(2024);
      const result = recomputePnL({
        ...base.pnl,
        revenue: 1000,
        cogs: 600,
        rnd: 50,
        marketing: 100,
        operating: 150,
        depreciation: 20,
        interest: 10,
        tax: 17,
      });
      expect(result.grossProfit).toBe(400);
      expect(result.ebitda).toBe(100); // 400 - 50 - 100 - 150
      expect(result.ebit).toBe(80); // 100 - 20
      expect(result.preTaxProfit).toBe(70); // 80 - 10
      expect(result.netProfit).toBe(53); // 70 - 17
    });
  });

  describe('recomputeBalanceSheet', () => {
    it('calculates totals correctly', () => {
      const base = createEmptyAnnualStatements(2024);
      const result = recomputeBalanceSheet({
        ...base.balanceSheet,
        cash: 100,
        accountsReceivable: 50,
        inventory: 30,
        fixedAssets: 200,
        accountsPayable: 40,
        longTermDebt: 100,
        shareCapital: 100,
        retainedEarnings: 140,
      });
      expect(result.totalCurrentAssets).toBe(180); // 100+50+30
      expect(result.totalAssets).toBe(380); // 180+200
      expect(result.totalCurrentLiabilities).toBe(40);
      expect(result.totalLiabilities).toBe(140); // 40+100
      expect(result.totalEquity).toBe(240); // 100+140
    });
  });

  describe('buildThreeStatementModel', () => {
    it('builds 3-year projection from 1 historical year', () => {
      const base = createBaseYear(2024);
      const assumptions = defaultAssumptions(3);
      const model = buildThreeStatementModel([base], assumptions);

      expect(model.historical).toHaveLength(1);
      expect(model.projected).toHaveLength(3);
      expect(model.projected[0].year).toBe(2025);
      expect(model.projected[2].year).toBe(2027);
    });

    it('grows revenue per assumptions', () => {
      const base = createBaseYear(2024);
      const assumptions = { ...defaultAssumptions(2), revenueGrowthPct: [10, 20] };
      const model = buildThreeStatementModel([base], assumptions);

      expect(model.projected[0].pnl.revenue).toBeCloseTo(1100000, 0);
      expect(model.projected[1].pnl.revenue).toBeCloseTo(1320000, 0); // 1.1M * 1.2
    });

    it('produces balanced balance sheets', () => {
      const base = createBaseYear(2024);
      const assumptions = defaultAssumptions(3);
      const model = buildThreeStatementModel([base], assumptions);

      for (const year of model.projected) {
        expect(validateBalanceSheet(year.balanceSheet, 100)).toBe(true);
      }
    });

    it('throws if no historical', () => {
      expect(() => buildThreeStatementModel([], defaultAssumptions(3))).toThrow();
    });
  });

  describe('suggestAssumptions', () => {
    it('returns defaults when no historical', () => {
      const a = suggestAssumptions([], 3);
      expect(a.yearsToProject).toBe(3);
    });

    it('extracts margins from history', () => {
      const base = createBaseYear(2024);
      const a = suggestAssumptions([base], 3);
      // gross margin = (1M-0.6M)/1M = 40%
      expect(a.grossMarginPct?.[0]).toBeCloseTo(40, 1);
    });

    it('calculates avg growth across multiple years', () => {
      const y1 = createBaseYear(2022);
      const y2 = createBaseYear(2023);
      y2.pnl.revenue = 1100000; // 10% growth
      const y3 = createBaseYear(2024);
      y3.pnl.revenue = 1320000; // 20% growth from y2

      const a = suggestAssumptions([y1, y2, y3], 3);
      // avg of [10, 20] = 15
      expect(a.revenueGrowthPct[0]).toBeCloseTo(15, 1);
    });
  });
});
