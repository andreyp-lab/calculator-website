import { describe, it, expect } from 'vitest';
import {
  INDUSTRY_BENCHMARKS,
  compareToBenchmark,
  compareCompanyToBenchmark,
  calculateOverallScore,
} from '@/lib/tools/industry-benchmarks';

describe('industry-benchmarks engine', () => {
  it('has benchmarks for all 10 industries', () => {
    expect(Object.keys(INDUSTRY_BENCHMARKS)).toHaveLength(10);
  });

  describe('compareToBenchmark', () => {
    const benchmark = { low: 10, median: 20, high: 30, unit: 'pct' as const };

    it('classifies above_high correctly', () => {
      const r = compareToBenchmark(35, benchmark, true);
      expect(r.comparison).toBe('above_high');
      expect(r.score).toBeGreaterThan(85);
    });

    it('classifies below_low correctly', () => {
      const r = compareToBenchmark(5, benchmark, true);
      expect(r.comparison).toBe('below_low');
      expect(r.score).toBeLessThan(40);
    });

    it('inverts for "lower is better" metrics', () => {
      const dso = { low: 30, median: 60, high: 90, unit: 'days' as const };
      const lowDSO = compareToBenchmark(15, dso, false); // Very fast collection - good
      const highDSO = compareToBenchmark(120, dso, false); // Slow - bad
      expect(lowDSO.score).toBeGreaterThan(highDSO.score);
    });
  });

  describe('compareCompanyToBenchmark', () => {
    it('produces insights for technology industry', () => {
      const insights = compareCompanyToBenchmark(
        {
          grossMargin: 75,
          netMargin: 15,
          ebitdaMargin: 25,
          rndPctOfRevenue: 20,
        },
        'technology',
      );
      expect(insights.length).toBeGreaterThan(0);
      const grossMarginInsight = insights.find((i) => i.metric === 'grossMargin');
      expect(grossMarginInsight?.score).toBeGreaterThan(50);
    });

    it('skips undefined metrics', () => {
      const insights = compareCompanyToBenchmark({}, 'services');
      expect(insights).toHaveLength(0);
    });
  });

  describe('calculateOverallScore', () => {
    it('returns 0 for empty insights', () => {
      expect(calculateOverallScore([])).toBe(0);
    });

    it('calculates average', () => {
      const insights = [
        { score: 80 } as any,
        { score: 60 } as any,
        { score: 100 } as any,
      ];
      expect(calculateOverallScore(insights)).toBe(80);
    });
  });
});
