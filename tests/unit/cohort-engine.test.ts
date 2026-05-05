import { describe, it, expect } from 'vitest';
import {
  calculateCohortLTV,
  calculatePaybackPeriod,
  buildCohortMatrix,
  calculateNRR,
  analyzeCohorts,
  rateLtvCac,
} from '@/lib/tools/cohort-engine';
import type { CustomerCohort } from '@/lib/tools/types';

describe('cohort-engine', () => {
  const sampleCohort: CustomerCohort = {
    acquisitionMonth: '2025-01',
    newCustomers: 100,
    arpu: 200,
    monthlyChurnPct: 5,
    cac: 500,
  };

  describe('calculateCohortLTV', () => {
    it('uses ARPU/churn formula', () => {
      // ARPU=200, churn=5% → LTV = 200/0.05 = 4000
      const ltv = calculateCohortLTV(sampleCohort);
      expect(ltv).toBeCloseTo(4000, 0);
    });

    it('returns horizon * ARPU when churn=0', () => {
      const ltv = calculateCohortLTV({ ...sampleCohort, monthlyChurnPct: 0 }, 60);
      expect(ltv).toBe(200 * 60);
    });
  });

  describe('calculatePaybackPeriod', () => {
    it('finds month when cumulative revenue >= CAC', () => {
      // CAC=500, ARPU=200, month 1: 200, month 2: 200*0.95=190 → cumulative ~390 → month 3
      const months = calculatePaybackPeriod(sampleCohort);
      expect(months).toBeGreaterThan(0);
      expect(months).toBeLessThan(10);
    });

    it('returns Infinity if ARPU<=0', () => {
      const months = calculatePaybackPeriod({ ...sampleCohort, arpu: 0 });
      expect(months).toBe(Infinity);
    });
  });

  describe('buildCohortMatrix', () => {
    it('creates a row per cohort with proper decay', () => {
      const matrix = buildCohortMatrix([sampleCohort], 12);
      expect(matrix).toHaveLength(1);
      expect(matrix[0]).toHaveLength(12);
      // Month 0: 100 customers * 200 = 20000
      expect(matrix[0][0]).toBeCloseTo(20000, 0);
      // Decreases over time due to churn
      expect(matrix[0][11]).toBeLessThan(matrix[0][0]);
    });
  });

  describe('calculateNRR', () => {
    it('calculates 12-month retention', () => {
      // 5% monthly churn → after 12 months = 0.95^12 ≈ 54%
      const nrr = calculateNRR(sampleCohort);
      expect(nrr).toBeGreaterThan(50);
      expect(nrr).toBeLessThan(60);
    });
  });

  describe('analyzeCohorts', () => {
    it('produces totals', () => {
      const result = analyzeCohorts([sampleCohort], 24);
      expect(result.cohorts).toHaveLength(1);
      expect(result.totals.avgLtv).toBeCloseTo(4000, 0);
      expect(result.totals.avgCac).toBe(500);
      expect(result.totals.ltvToCacRatio).toBeCloseTo(8, 1); // 4000/500
    });

    it('handles empty cohorts', () => {
      const result = analyzeCohorts([], 24);
      expect(result.totals.avgLtv).toBe(0);
    });
  });

  describe('rateLtvCac', () => {
    it('rates ratios correctly', () => {
      expect(rateLtvCac(5).rating).toBe('excellent');
      expect(rateLtvCac(3).rating).toBe('good');
      expect(rateLtvCac(2).rating).toBe('acceptable');
      expect(rateLtvCac(1.2).rating).toBe('poor');
      expect(rateLtvCac(0.5).rating).toBe('unsustainable');
    });
  });
});
