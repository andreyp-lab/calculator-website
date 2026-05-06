/**
 * Period Comparison Engine
 *
 * השוואה בין תקופות (שנים) - YoY analysis ומגמות רב-תקופתיות.
 * עוקב אחר שינויים במדדים מרכזיים ומזהה מגמות.
 */

export interface PeriodMetrics {
  year: number;
  revenue: number;
  grossProfit: number;
  operatingProfit: number;
  netProfit: number;
  ebitda: number;
  totalAssets: number;
  totalEquity: number;
  totalLiabilities: number;
  currentAssets: number;
  currentLiabilities: number;
}

export interface MetricComparison {
  label: string;
  key: keyof PeriodMetrics;
  values: number[];
  yoyGrowth: number[]; // % per year
  cagr: number; // %
  trend: 'strong_growth' | 'growth' | 'stable' | 'decline' | 'strong_decline';
  volatility: number; // %
  min: number;
  max: number;
  latest: number;
  first: number;
}

export interface PeriodComparisonResult {
  periods: number[]; // years
  metrics: Record<string, MetricComparison>;
  yoyAnalysis: Array<{
    fromYear: number;
    toYear: number;
    revenueGrowth: number;
    profitGrowth: number;
    assetsGrowth: number;
  }>;
  summary: {
    overallTrend: 'positive' | 'mixed' | 'negative';
    strongestGrowth: { metric: string; cagr: number };
    weakestPerformance: { metric: string; cagr: number };
    consistency: 'consistent' | 'volatile';
  };
  insights: string[];
}

function average(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

function stdDev(values: number[]): number {
  if (values.length < 2) return 0;
  const m = average(values);
  return Math.sqrt(average(values.map((v) => Math.pow(v - m, 2))));
}

function calculateCAGR(first: number, last: number, years: number): number {
  if (first <= 0 || last <= 0 || years <= 0) return 0;
  return (Math.pow(last / first, 1 / years) - 1) * 100;
}

function classifyTrend(cagr: number, volatility: number): MetricComparison['trend'] {
  if (volatility > 30) return 'stable'; // too volatile to call
  if (cagr > 15) return 'strong_growth';
  if (cagr > 3) return 'growth';
  if (cagr > -3) return 'stable';
  if (cagr > -15) return 'decline';
  return 'strong_decline';
}

const METRICS_CONFIG: Array<{ key: keyof PeriodMetrics; label: string }> = [
  { key: 'revenue', label: 'הכנסות' },
  { key: 'grossProfit', label: 'רווח גולמי' },
  { key: 'operatingProfit', label: 'רווח תפעולי' },
  { key: 'netProfit', label: 'רווח נקי' },
  { key: 'ebitda', label: 'EBITDA' },
  { key: 'totalAssets', label: 'סך נכסים' },
  { key: 'totalEquity', label: 'הון עצמי' },
  { key: 'totalLiabilities', label: 'סך התחייבויות' },
];

export function comparePeriods(periodsData: PeriodMetrics[]): PeriodComparisonResult {
  if (periodsData.length < 2) {
    throw new Error('Period comparison requires at least 2 periods');
  }

  const sorted = [...periodsData].sort((a, b) => a.year - b.year);
  const periods = sorted.map((p) => p.year);
  const yearsCount = sorted.length;

  // Build metric comparisons
  const metrics: Record<string, MetricComparison> = {};
  for (const config of METRICS_CONFIG) {
    const values = sorted.map((p) => p[config.key] as number);
    const yoyGrowth: number[] = [];
    for (let i = 1; i < values.length; i++) {
      const prev = values[i - 1];
      const curr = values[i];
      yoyGrowth.push(prev !== 0 ? ((curr - prev) / Math.abs(prev)) * 100 : 0);
    }

    const first = values[0];
    const last = values[values.length - 1];
    const cagr = calculateCAGR(first, last, yearsCount - 1);
    const avg = average(values);
    const volatility = avg !== 0 ? (stdDev(values) / Math.abs(avg)) * 100 : 0;

    metrics[config.key] = {
      label: config.label,
      key: config.key,
      values,
      yoyGrowth,
      cagr,
      trend: classifyTrend(cagr, volatility),
      volatility,
      min: Math.min(...values),
      max: Math.max(...values),
      latest: last,
      first,
    };
  }

  // YoY analysis
  const yoyAnalysis = [];
  for (let i = 1; i < sorted.length; i++) {
    const prev = sorted[i - 1];
    const curr = sorted[i];
    const calcGrowth = (a: number, b: number) =>
      a !== 0 ? ((b - a) / Math.abs(a)) * 100 : 0;
    yoyAnalysis.push({
      fromYear: prev.year,
      toYear: curr.year,
      revenueGrowth: calcGrowth(prev.revenue, curr.revenue),
      profitGrowth: calcGrowth(prev.netProfit, curr.netProfit),
      assetsGrowth: calcGrowth(prev.totalAssets, curr.totalAssets),
    });
  }

  // Summary
  const allCAGRs = METRICS_CONFIG.map((c) => ({ key: c.key, label: c.label, cagr: metrics[c.key].cagr }));
  const strongest = allCAGRs.reduce((max, c) => (c.cagr > max.cagr ? c : max), allCAGRs[0]);
  const weakest = allCAGRs.reduce((min, c) => (c.cagr < min.cagr ? c : min), allCAGRs[0]);

  const revGrowth = metrics.revenue.cagr;
  const profitGrowth = metrics.netProfit.cagr;
  let overallTrend: PeriodComparisonResult['summary']['overallTrend'];
  if (revGrowth > 5 && profitGrowth > 5) overallTrend = 'positive';
  else if (revGrowth < 0 && profitGrowth < 0) overallTrend = 'negative';
  else overallTrend = 'mixed';

  const avgVolatility = average(METRICS_CONFIG.map((c) => metrics[c.key].volatility));
  const consistency: 'consistent' | 'volatile' = avgVolatility > 25 ? 'volatile' : 'consistent';

  // Insights
  const insights: string[] = [];

  if (revGrowth > 15) insights.push(`📈 צמיחה מרשימה בהכנסות: ${revGrowth.toFixed(1)}% CAGR`);
  else if (revGrowth < -5) insights.push(`📉 ירידה עקבית בהכנסות: ${revGrowth.toFixed(1)}% CAGR`);

  if (profitGrowth > revGrowth + 5) {
    insights.push('🎯 הרווחים צומחים מהר יותר מההכנסות - שיפור ביעילות');
  } else if (profitGrowth < revGrowth - 5 && revGrowth > 0) {
    insights.push('⚠️ הכנסות גדלות אבל הרווחים פיגרו - שחיקת מרווחים');
  }

  if (consistency === 'volatile') {
    insights.push(`📊 תנודתיות גבוהה במדדים (${avgVolatility.toFixed(0)}% ממוצע)`);
  } else {
    insights.push(`✅ עקביות במדדים - חברה צפויה`);
  }

  // Check for declining trends in latest year
  const latestYoY = yoyAnalysis[yoyAnalysis.length - 1];
  if (latestYoY) {
    if (latestYoY.revenueGrowth < -10) {
      insights.push(`⚠️ ירידה חדה השנה בהכנסות (${latestYoY.revenueGrowth.toFixed(1)}%)`);
    }
    if (latestYoY.profitGrowth < -20) {
      insights.push(`🚨 ירידה חדה ברווחים (${latestYoY.profitGrowth.toFixed(1)}%)`);
    }
  }

  return {
    periods,
    metrics,
    yoyAnalysis,
    summary: {
      overallTrend,
      strongestGrowth: { metric: strongest.label, cagr: strongest.cagr },
      weakestPerformance: { metric: weakest.label, cagr: weakest.cagr },
      consistency,
    },
    insights,
  };
}
