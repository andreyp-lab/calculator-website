/**
 * Industry Benchmarks Database
 *
 * נתוני השוואה לפי ענף - מבוססים על:
 * - דוחות חברות ציבוריות בורסה ת"א (2024-2025)
 * - דוחות לשכת המסחר ישראל
 * - Damodaran (NYU Stern) - global industry data
 * - דוח דן אנד ברדסטריט ישראל
 *
 * הנתונים הם quartile-based: low = Q1 (אחוזון 25), median = Q2, high = Q3 (אחוזון 75).
 */

import type { IndustryBenchmarks, Industry, BenchmarkValue } from './types';

const pct = (low: number, median: number, high: number): BenchmarkValue => ({
  low,
  median,
  high,
  unit: 'pct',
});
const ratio = (low: number, median: number, high: number): BenchmarkValue => ({
  low,
  median,
  high,
  unit: 'ratio',
});
const days = (low: number, median: number, high: number): BenchmarkValue => ({
  low,
  median,
  high,
  unit: 'days',
});

export const INDUSTRY_BENCHMARKS: Record<Industry, IndustryBenchmarks> = {
  technology: {
    industry: 'technology',
    industryLabel: 'טכנולוגיה / SaaS',
    source: 'בורסה ת"א + Damodaran 2024',
    asOfYear: 2024,
    grossMargin: pct(55, 72, 85),
    operatingMargin: pct(5, 18, 32),
    netMargin: pct(2, 14, 25),
    ebitdaMargin: pct(10, 22, 38),
    rndPctOfRevenue: pct(8, 18, 35),
    marketingPctOfRevenue: pct(15, 25, 40),
    operatingPctOfRevenue: pct(8, 12, 18),
    dso: days(30, 45, 65),
    dpo: days(20, 35, 50),
    dio: days(0, 5, 15),
    currentRatio: ratio(1.2, 1.8, 3.0),
    quickRatio: ratio(0.9, 1.5, 2.5),
    debtToEquity: ratio(0.1, 0.4, 0.9),
    interestCoverage: ratio(3, 8, 25),
    revenueGrowthPct: pct(8, 22, 45),
  },
  retail: {
    industry: 'retail',
    industryLabel: 'קמעונאות / מסחר',
    source: 'דן אנד ברדסטריט ישראל 2024',
    asOfYear: 2024,
    grossMargin: pct(25, 35, 48),
    operatingMargin: pct(2, 5, 9),
    netMargin: pct(1, 3, 6),
    ebitdaMargin: pct(4, 7, 12),
    rndPctOfRevenue: pct(0, 0, 1),
    marketingPctOfRevenue: pct(2, 5, 10),
    operatingPctOfRevenue: pct(15, 22, 30),
    dso: days(5, 15, 30),
    dpo: days(30, 45, 70),
    dio: days(45, 75, 120),
    currentRatio: ratio(0.9, 1.4, 2.0),
    quickRatio: ratio(0.3, 0.6, 1.0),
    debtToEquity: ratio(0.4, 0.9, 1.8),
    interestCoverage: ratio(1.5, 3, 8),
    revenueGrowthPct: pct(2, 5, 12),
  },
  manufacturing: {
    industry: 'manufacturing',
    industryLabel: 'תעשייה / ייצור',
    source: 'בורסה ת"א + לשכת המסחר 2024',
    asOfYear: 2024,
    grossMargin: pct(18, 28, 40),
    operatingMargin: pct(3, 8, 14),
    netMargin: pct(2, 5, 10),
    ebitdaMargin: pct(7, 12, 20),
    rndPctOfRevenue: pct(0, 2, 6),
    marketingPctOfRevenue: pct(2, 4, 8),
    operatingPctOfRevenue: pct(10, 14, 20),
    dso: days(45, 65, 90),
    dpo: days(45, 60, 90),
    dio: days(60, 90, 150),
    currentRatio: ratio(1.1, 1.6, 2.2),
    quickRatio: ratio(0.6, 1.0, 1.5),
    debtToEquity: ratio(0.5, 1.0, 1.8),
    interestCoverage: ratio(2, 5, 12),
    revenueGrowthPct: pct(0, 4, 10),
  },
  food: {
    industry: 'food',
    industryLabel: 'מזון / מסעדנות',
    source: 'איגוד המסעדות + לשכת המסחר 2024',
    asOfYear: 2024,
    grossMargin: pct(55, 65, 75),
    operatingMargin: pct(2, 6, 12),
    netMargin: pct(1, 4, 8),
    ebitdaMargin: pct(8, 14, 22),
    rndPctOfRevenue: pct(0, 0, 1),
    marketingPctOfRevenue: pct(2, 4, 8),
    operatingPctOfRevenue: pct(35, 45, 55), // כולל שכר טבחים/מלצרים שזה מרכזי
    dso: days(0, 3, 10),
    dpo: days(15, 30, 45),
    dio: days(3, 7, 14),
    currentRatio: ratio(0.7, 1.0, 1.5),
    quickRatio: ratio(0.3, 0.5, 0.9),
    debtToEquity: ratio(0.6, 1.5, 3.0),
    interestCoverage: ratio(1.2, 3, 7),
    revenueGrowthPct: pct(-2, 4, 12),
  },
  construction: {
    industry: 'construction',
    industryLabel: 'בנייה / תשתיות',
    source: 'בורסה ת"א + התאחדות הקבלנים 2024',
    asOfYear: 2024,
    grossMargin: pct(10, 18, 28),
    operatingMargin: pct(2, 6, 12),
    netMargin: pct(1, 4, 8),
    ebitdaMargin: pct(5, 9, 15),
    rndPctOfRevenue: pct(0, 0, 1),
    marketingPctOfRevenue: pct(0.5, 1.5, 3),
    operatingPctOfRevenue: pct(5, 9, 15),
    dso: days(60, 90, 150),
    dpo: days(60, 90, 120),
    dio: days(0, 30, 90),
    currentRatio: ratio(1.0, 1.4, 2.0),
    quickRatio: ratio(0.6, 0.9, 1.4),
    debtToEquity: ratio(0.8, 1.5, 3.0),
    interestCoverage: ratio(1.5, 3, 7),
    revenueGrowthPct: pct(-5, 5, 18),
  },
  services: {
    industry: 'services',
    industryLabel: 'שירותים / ייעוץ',
    source: 'דן אנד ברדסטריט ישראל 2024',
    asOfYear: 2024,
    grossMargin: pct(40, 55, 70),
    operatingMargin: pct(8, 15, 28),
    netMargin: pct(5, 10, 22),
    ebitdaMargin: pct(10, 18, 32),
    rndPctOfRevenue: pct(0, 1, 5),
    marketingPctOfRevenue: pct(3, 7, 12),
    operatingPctOfRevenue: pct(25, 35, 45),
    dso: days(30, 50, 75),
    dpo: days(15, 30, 50),
    dio: days(0, 0, 5),
    currentRatio: ratio(1.2, 1.8, 2.8),
    quickRatio: ratio(1.0, 1.6, 2.5),
    debtToEquity: ratio(0.1, 0.4, 1.0),
    interestCoverage: ratio(3, 8, 20),
    revenueGrowthPct: pct(2, 8, 20),
  },
  energy: {
    industry: 'energy',
    industryLabel: 'אנרגיה',
    source: 'בורסה ת"א 2024',
    asOfYear: 2024,
    grossMargin: pct(20, 32, 45),
    operatingMargin: pct(5, 12, 22),
    netMargin: pct(3, 8, 18),
    ebitdaMargin: pct(15, 25, 40),
    rndPctOfRevenue: pct(0, 1, 3),
    marketingPctOfRevenue: pct(0, 1, 3),
    operatingPctOfRevenue: pct(8, 14, 22),
    dso: days(30, 60, 90),
    dpo: days(30, 60, 90),
    dio: days(15, 30, 60),
    currentRatio: ratio(1.0, 1.4, 2.0),
    quickRatio: ratio(0.7, 1.1, 1.7),
    debtToEquity: ratio(0.7, 1.5, 3.0),
    interestCoverage: ratio(2, 5, 12),
    revenueGrowthPct: pct(-3, 5, 15),
  },
  healthcare: {
    industry: 'healthcare',
    industryLabel: 'בריאות / רפואה',
    source: 'בורסה ת"א + משרד הבריאות 2024',
    asOfYear: 2024,
    grossMargin: pct(30, 45, 65),
    operatingMargin: pct(5, 12, 22),
    netMargin: pct(3, 8, 16),
    ebitdaMargin: pct(10, 18, 28),
    rndPctOfRevenue: pct(2, 8, 18),
    marketingPctOfRevenue: pct(3, 8, 15),
    operatingPctOfRevenue: pct(18, 25, 35),
    dso: days(60, 90, 130),
    dpo: days(40, 60, 90),
    dio: days(30, 60, 100),
    currentRatio: ratio(1.2, 1.8, 2.8),
    quickRatio: ratio(0.8, 1.3, 2.2),
    debtToEquity: ratio(0.3, 0.7, 1.5),
    interestCoverage: ratio(2, 6, 15),
    revenueGrowthPct: pct(3, 8, 18),
  },
  finance: {
    industry: 'finance',
    industryLabel: 'פיננסים',
    source: 'בורסה ת"א - בנקים וחברות ביטוח 2024',
    asOfYear: 2024,
    grossMargin: pct(60, 75, 90),
    operatingMargin: pct(20, 35, 55),
    netMargin: pct(15, 25, 40),
    ebitdaMargin: pct(25, 40, 60),
    rndPctOfRevenue: pct(0, 1, 4),
    marketingPctOfRevenue: pct(2, 5, 10),
    operatingPctOfRevenue: pct(20, 30, 45),
    dso: days(0, 5, 30),
    dpo: days(5, 15, 45),
    dio: days(0, 0, 0),
    currentRatio: ratio(0.8, 1.1, 1.5),
    quickRatio: ratio(0.7, 1.0, 1.4),
    debtToEquity: ratio(2, 5, 12),
    interestCoverage: ratio(1.5, 3, 6),
    revenueGrowthPct: pct(2, 7, 18),
  },
  realestate: {
    industry: 'realestate',
    industryLabel: 'נדל"ן',
    source: 'בורסה ת"א - חברות נדל"ן 2024',
    asOfYear: 2024,
    grossMargin: pct(35, 50, 70),
    operatingMargin: pct(15, 28, 45),
    netMargin: pct(8, 18, 35),
    ebitdaMargin: pct(20, 32, 50),
    rndPctOfRevenue: pct(0, 0, 1),
    marketingPctOfRevenue: pct(1, 3, 8),
    operatingPctOfRevenue: pct(8, 15, 25),
    dso: days(15, 30, 60),
    dpo: days(30, 60, 120),
    dio: days(180, 365, 730), // נדל"ן מלאי = פרויקטים בהקמה
    currentRatio: ratio(0.9, 1.3, 2.0),
    quickRatio: ratio(0.4, 0.8, 1.3),
    debtToEquity: ratio(0.8, 1.5, 3.5),
    interestCoverage: ratio(1.5, 3, 8),
    revenueGrowthPct: pct(-5, 6, 25),
  },
};

// ============================================================
// COMPARISON ENGINE
// ============================================================

export type BenchmarkComparison = 'below_low' | 'low_to_median' | 'median_to_high' | 'above_high';

export interface BenchmarkInsight {
  metric: string;
  metricLabel: string;
  yourValue: number;
  benchmark: BenchmarkValue;
  comparison: BenchmarkComparison;
  /** ציון 0-100 (גבוה יותר = טוב יותר; הפוך עבור DSO/חוב) */
  score: number;
  /** הערה ידידותית */
  message: string;
}

/**
 * משווה ערך בודד מול benchmark.
 * higherIsBetter: עבור marginים, ratios חיוביים = true.
 * עבור DSO, debt-to-equity, dpo (ימי תשלום הם נייטרליים) = false או null.
 */
export function compareToBenchmark(
  yourValue: number,
  benchmark: BenchmarkValue,
  higherIsBetter: boolean = true,
): { comparison: BenchmarkComparison; score: number } {
  let comparison: BenchmarkComparison;
  if (yourValue < benchmark.low) {
    comparison = 'below_low';
  } else if (yourValue < benchmark.median) {
    comparison = 'low_to_median';
  } else if (yourValue < benchmark.high) {
    comparison = 'median_to_high';
  } else {
    comparison = 'above_high';
  }

  // ציון 0-100
  let score: number;
  if (higherIsBetter) {
    if (yourValue >= benchmark.high) score = 90 + Math.min(10, (yourValue - benchmark.high) / 2);
    else if (yourValue >= benchmark.median)
      score =
        70 +
        ((yourValue - benchmark.median) / (benchmark.high - benchmark.median || 1)) * 20;
    else if (yourValue >= benchmark.low)
      score =
        40 + ((yourValue - benchmark.low) / (benchmark.median - benchmark.low || 1)) * 30;
    else score = Math.max(0, 40 - ((benchmark.low - yourValue) / Math.abs(benchmark.low || 1)) * 40);
  } else {
    // נמוך יותר = טוב יותר (DSO, debt-to-equity)
    if (yourValue <= benchmark.low) score = 90 + Math.min(10, (benchmark.low - yourValue) / 2);
    else if (yourValue <= benchmark.median)
      score =
        70 -
        ((yourValue - benchmark.low) / (benchmark.median - benchmark.low || 1)) * 0 +
        20;
    else if (yourValue <= benchmark.high)
      score =
        40 +
        (1 - (yourValue - benchmark.median) / (benchmark.high - benchmark.median || 1)) * 30;
    else
      score = Math.max(
        0,
        40 - ((yourValue - benchmark.high) / Math.abs(benchmark.high || 1)) * 40,
      );
  }

  return { comparison, score: Math.max(0, Math.min(100, score)) };
}

/**
 * מייצר insights עבור כל המדדים.
 */
export interface CompanyMetrics {
  grossMargin?: number;
  operatingMargin?: number;
  netMargin?: number;
  ebitdaMargin?: number;
  rndPctOfRevenue?: number;
  marketingPctOfRevenue?: number;
  operatingPctOfRevenue?: number;
  dso?: number;
  dpo?: number;
  dio?: number;
  currentRatio?: number;
  quickRatio?: number;
  debtToEquity?: number;
  interestCoverage?: number;
  revenueGrowthPct?: number;
}

export function compareCompanyToBenchmark(
  metrics: CompanyMetrics,
  industry: Industry,
): BenchmarkInsight[] {
  const bench = INDUSTRY_BENCHMARKS[industry];
  const insights: BenchmarkInsight[] = [];

  const metricsConfig: Array<{
    key: keyof CompanyMetrics;
    label: string;
    benchKey: keyof IndustryBenchmarks;
    higherIsBetter: boolean;
  }> = [
    { key: 'grossMargin', label: 'מרווח גולמי', benchKey: 'grossMargin', higherIsBetter: true },
    {
      key: 'operatingMargin',
      label: 'מרווח תפעולי',
      benchKey: 'operatingMargin',
      higherIsBetter: true,
    },
    { key: 'netMargin', label: 'מרווח נקי', benchKey: 'netMargin', higherIsBetter: true },
    { key: 'ebitdaMargin', label: 'מרווח EBITDA', benchKey: 'ebitdaMargin', higherIsBetter: true },
    {
      key: 'rndPctOfRevenue',
      label: 'R&D מהכנסות',
      benchKey: 'rndPctOfRevenue',
      higherIsBetter: false, // יחסי - תלוי בענף
    },
    {
      key: 'marketingPctOfRevenue',
      label: 'שיווק מהכנסות',
      benchKey: 'marketingPctOfRevenue',
      higherIsBetter: false,
    },
    {
      key: 'operatingPctOfRevenue',
      label: 'תפעול מהכנסות',
      benchKey: 'operatingPctOfRevenue',
      higherIsBetter: false,
    },
    { key: 'dso', label: 'ימי גבייה (DSO)', benchKey: 'dso', higherIsBetter: false },
    { key: 'dpo', label: 'ימי תשלום (DPO)', benchKey: 'dpo', higherIsBetter: true },
    { key: 'dio', label: 'ימי מלאי (DIO)', benchKey: 'dio', higherIsBetter: false },
    {
      key: 'currentRatio',
      label: 'יחס שוטף',
      benchKey: 'currentRatio',
      higherIsBetter: true,
    },
    {
      key: 'quickRatio',
      label: 'יחס מהיר',
      benchKey: 'quickRatio',
      higherIsBetter: true,
    },
    {
      key: 'debtToEquity',
      label: 'חוב להון',
      benchKey: 'debtToEquity',
      higherIsBetter: false,
    },
    {
      key: 'interestCoverage',
      label: 'כיסוי ריבית',
      benchKey: 'interestCoverage',
      higherIsBetter: true,
    },
    {
      key: 'revenueGrowthPct',
      label: 'צמיחת הכנסות',
      benchKey: 'revenueGrowthPct',
      higherIsBetter: true,
    },
  ];

  for (const cfg of metricsConfig) {
    const value = metrics[cfg.key];
    if (value === undefined || value === null || !Number.isFinite(value)) continue;

    const benchValue = bench[cfg.benchKey] as BenchmarkValue;
    const { comparison, score } = compareToBenchmark(value, benchValue, cfg.higherIsBetter);

    let message: string;
    if (comparison === 'above_high' && cfg.higherIsBetter) {
      message = `מצוין — מעל אחוזון 75 בענף (${benchValue.high.toFixed(1)})`;
    } else if (comparison === 'above_high') {
      message = `מתחת לסטנדרט — מעל אחוזון 75 (חיובי בכיוון השלילי)`;
    } else if (comparison === 'median_to_high') {
      message = `מעל החציון בענף (${benchValue.median.toFixed(1)}) ✓`;
    } else if (comparison === 'low_to_median') {
      message = `מתחת לחציון אבל מעל אחוזון 25 — מקום לשיפור`;
    } else {
      message = `מתחת לאחוזון 25 (${benchValue.low.toFixed(1)}) — דרושה התייחסות`;
    }

    insights.push({
      metric: cfg.key,
      metricLabel: cfg.label,
      yourValue: value,
      benchmark: benchValue,
      comparison,
      score,
      message,
    });
  }

  return insights;
}

/**
 * ציון כולל בריאות פיננסית (0-100).
 */
export function calculateOverallScore(insights: BenchmarkInsight[]): number {
  if (insights.length === 0) return 0;
  return insights.reduce((s, i) => s + i.score, 0) / insights.length;
}
