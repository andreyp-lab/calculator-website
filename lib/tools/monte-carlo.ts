/**
 * Monte Carlo Simulation Engine
 *
 * סימולציה הסתברותית: במקום לתת ערך יחיד לרווח עתידי,
 * מריץ אלפי איטרציות עם משתנים אקראיים ומציג התפלגות.
 *
 * שימושים:
 * - "מה הסיכוי שאהיה ברווח?"
 * - "מה ה-VaR (value at risk) ב-95%?"
 * - "מה הטווח הסביר של תוצאות?"
 */

import type {
  AnnualStatements,
  ForecastAssumptions,
  InputDistribution,
  MonteCarloResult,
  DistributionType,
} from './types';
import { buildThreeStatementModel } from './three-statement-model';

// ============================================================
// RANDOM NUMBER GENERATORS
// ============================================================

/**
 * Box-Muller transform: יוצר מספרים אקראיים מהתפלגות נורמלית.
 */
function randomNormal(mean: number, stdDev: number): number {
  let u = 0;
  let v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  return mean + z * stdDev;
}

/**
 * התפלגות משולשת: min, mode (שכיח), max.
 * נפוצה ב-FP&A כי קל להגדיר ("פסימי / סביר / אופטימי").
 */
function randomTriangular(min: number, mode: number, max: number): number {
  const u = Math.random();
  const f = (mode - min) / (max - min);
  if (u < f) {
    return min + Math.sqrt(u * (max - min) * (mode - min));
  }
  return max - Math.sqrt((1 - u) * (max - min) * (max - mode));
}

/**
 * התפלגות אחידה.
 */
function randomUniform(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

function sample(dist: InputDistribution): number {
  switch (dist.distribution) {
    case 'normal':
      return randomNormal(dist.params.mean ?? 0, dist.params.stdDev ?? 1);
    case 'triangular':
      return randomTriangular(
        dist.params.min ?? 0,
        dist.params.mode ?? 0,
        dist.params.max ?? 1,
      );
    case 'uniform':
      return randomUniform(dist.params.min ?? 0, dist.params.max ?? 1);
  }
}

// ============================================================
// SIMULATION CORE
// ============================================================

export interface MonteCarloInput {
  baseHistorical: AnnualStatements[];
  baseAssumptions: ForecastAssumptions;
  /** התפלגויות לכל משתנה */
  distributions: InputDistribution[];
  /** מספר איטרציות (1000-10000) */
  iterations: number;
  /** אילו מדדים לחלץ */
  metric: 'netProfit' | 'cashRunway' | 'closingCash' | 'ebitda';
  /** יעד אופציונלי לחישוב P(>target) */
  target?: number;
}

/**
 * הרץ סימולציה.
 * הערה: רץ סינכרונית בלולאה. עבור 10K איטרציות זה ~2-5 שניות בדפדפן.
 * ניתן לעטוף ב-Web Worker בעתיד.
 */
export function runMonteCarlo(input: MonteCarloInput): MonteCarloResult {
  const { baseHistorical, baseAssumptions, distributions, iterations, metric, target } = input;
  const results: number[] = [];

  for (let i = 0; i < iterations; i++) {
    // צור הנחות מותאמות לאיטרציה זו
    const itAssumptions = { ...baseAssumptions };

    for (const dist of distributions) {
      const value = sample(dist);
      switch (dist.variable) {
        case 'revenueGrowth':
          itAssumptions.revenueGrowthPct = Array(itAssumptions.yearsToProject).fill(value);
          break;
        case 'grossMargin':
          itAssumptions.grossMarginPct = Array(itAssumptions.yearsToProject).fill(value);
          break;
        case 'opex':
          // הוסף ל-operating
          itAssumptions.operatingPctOfRevenue = Array(itAssumptions.yearsToProject).fill(value);
          break;
        case 'capex':
          itAssumptions.capexPerYear = Array(itAssumptions.yearsToProject).fill(value);
          break;
      }
    }

    try {
      const model = buildThreeStatementModel(baseHistorical, itAssumptions);
      const lastYear = model.projected[model.projected.length - 1];
      if (!lastYear) continue;

      let value: number;
      switch (metric) {
        case 'netProfit':
          value = lastYear.pnl.netProfit;
          break;
        case 'closingCash':
          value = lastYear.balanceSheet.cash;
          break;
        case 'ebitda':
          value = lastYear.pnl.ebitda;
          break;
        case 'cashRunway': {
          // בחנו כמה חודשים יש מזומן בקצב burn
          const annualBurn =
            lastYear.pnl.netProfit < 0 ? Math.abs(lastYear.pnl.netProfit) : 0;
          value = annualBurn > 0 ? (lastYear.balanceSheet.cash / annualBurn) * 12 : 999;
          break;
        }
      }
      results.push(value);
    } catch (e) {
      // איטרציה שנכשלה - דלג
      continue;
    }
  }

  return analyzeResults(results, iterations, metric, target);
}

// ============================================================
// ANALYSIS
// ============================================================

function analyzeResults(
  results: number[],
  iterations: number,
  metric: MonteCarloInput['metric'],
  target?: number,
): MonteCarloResult {
  if (results.length === 0) {
    return {
      iterations: 0,
      metric: metric as MonteCarloResult['metric'],
      histogram: [],
      stats: {
        mean: 0,
        median: 0,
        stdDev: 0,
        p5: 0,
        p25: 0,
        p75: 0,
        p95: 0,
        min: 0,
        max: 0,
      },
      probabilityPositive: 0,
    };
  }

  const sorted = [...results].sort((a, b) => a - b);
  const n = sorted.length;
  const mean = results.reduce((s, v) => s + v, 0) / n;
  const variance = results.reduce((s, v) => s + (v - mean) ** 2, 0) / n;
  const stdDev = Math.sqrt(variance);

  const percentile = (p: number): number => {
    const idx = Math.floor((p / 100) * (n - 1));
    return sorted[idx];
  };

  const stats = {
    mean,
    median: percentile(50),
    stdDev,
    p5: percentile(5),
    p25: percentile(25),
    p75: percentile(75),
    p95: percentile(95),
    min: sorted[0],
    max: sorted[n - 1],
  };

  // היסטוגרמה - 30 buckets
  const histogram = buildHistogram(sorted, 30);

  // סיכויים
  const probabilityPositive = results.filter((v) => v > 0).length / n;
  const probabilityAboveTarget =
    target !== undefined ? results.filter((v) => v > target).length / n : undefined;

  return {
    iterations,
    metric: metric as MonteCarloResult['metric'],
    histogram,
    stats,
    probabilityPositive,
    probabilityAboveTarget,
  };
}

function buildHistogram(
  sorted: number[],
  buckets: number,
): { bucket: number; count: number }[] {
  if (sorted.length === 0) return [];
  const min = sorted[0];
  const max = sorted[sorted.length - 1];
  const range = max - min;
  if (range === 0) {
    return [{ bucket: min, count: sorted.length }];
  }
  const bucketSize = range / buckets;
  const histogram: { bucket: number; count: number }[] = [];
  for (let i = 0; i < buckets; i++) {
    const bucketCenter = min + bucketSize * (i + 0.5);
    histogram.push({ bucket: bucketCenter, count: 0 });
  }
  for (const v of sorted) {
    const idx = Math.min(buckets - 1, Math.floor((v - min) / bucketSize));
    histogram[idx].count++;
  }
  return histogram;
}

// ============================================================
// SCENARIO PRESETS
// ============================================================

/**
 * תרחישים מוכנים: פסימי / סביר / אופטימי.
 */
export function buildPresetDistributions(
  scenario: 'conservative' | 'moderate' | 'aggressive',
  baseAssumptions: ForecastAssumptions,
): InputDistribution[] {
  const baseGrowth = baseAssumptions.revenueGrowthPct[0] ?? 10;
  const baseGrossMargin =
    baseAssumptions.grossMarginPct?.[0] ?? 40;
  const baseOpex = baseAssumptions.operatingPctOfRevenue?.[0] ?? 15;

  const widths = {
    conservative: { growth: 5, margin: 3, opex: 3 },
    moderate: { growth: 10, margin: 5, opex: 5 },
    aggressive: { growth: 20, margin: 10, opex: 10 },
  };
  const w = widths[scenario];

  return [
    {
      variable: 'revenueGrowth',
      distribution: 'triangular',
      params: { min: baseGrowth - w.growth, mode: baseGrowth, max: baseGrowth + w.growth },
    },
    {
      variable: 'grossMargin',
      distribution: 'triangular',
      params: {
        min: baseGrossMargin - w.margin,
        mode: baseGrossMargin,
        max: baseGrossMargin + w.margin,
      },
    },
    {
      variable: 'opex',
      distribution: 'triangular',
      params: { min: baseOpex - w.opex, mode: baseOpex, max: baseOpex + w.opex },
    },
  ];
}
