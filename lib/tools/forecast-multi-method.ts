/**
 * Multi-Method Forecast Engine
 *
 * 4 שיטות חיזוי + Ensemble (משוקלל):
 * 1. Linear Regression - מתאים למגמות לינאריות יציבות
 * 2. Exponential Smoothing (Holt's) - מתאים לנתונים עם trend
 * 3. Moving Average - חלק נתונים רועשים
 * 4. Growth Rate (CAGR) - מבוסס על שיעור צמיחה גיאומטרי
 *
 * Ensemble: ממוצע משוקלל של כל השיטות
 *
 * + טווחי ביטחון (90%, 80%, 70%) לפי volatility
 * + זיהוי anomalies
 * + תובנות אוטומטיות
 */

export interface ForecastMethodResult {
  values: number[];
  method: string;
  confidence?: number; // R² עבור regression
}

export interface ConfidenceInterval {
  upper: number[];
  lower: number[];
}

export interface MultiMethodForecastResult {
  metric: string;
  historical: { values: number[]; years: number[] };
  forecast: { values: number[]; years: number[] };
  methods: {
    linearRegression: ForecastMethodResult;
    exponentialSmoothing: ForecastMethodResult;
    movingAverage: ForecastMethodResult;
    growthRate: ForecastMethodResult;
  };
  confidenceIntervals: {
    high: ConfidenceInterval; // 90%
    medium: ConfidenceInterval; // 80%
    low: ConfidenceInterval; // 70%
  };
  statistics: {
    mean: number;
    stdDev: number;
    cagr: number;
    volatility: number;
    trend: 'upward' | 'downward' | 'stable';
  };
  anomalies: Array<{ year: number; value: number; zScore: number; severity: 'mild' | 'severe' }>;
  insights: string[];
}

// ============================================================
// STATISTICAL HELPERS
// ============================================================

function average(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((s, v) => s + v, 0) / values.length;
}

function stdDev(values: number[]): number {
  if (values.length < 2) return 0;
  const avg = average(values);
  const sq = values.map((v) => Math.pow(v - avg, 2));
  return Math.sqrt(average(sq));
}

function calculateCAGR(values: number[]): number {
  if (values.length < 2) return 0;
  const first = values[0];
  const last = values[values.length - 1];
  const years = values.length - 1;
  if (first <= 0 || last <= 0) return 0;
  return Math.pow(last / first, 1 / years) - 1;
}

// ============================================================
// FORECAST METHODS
// ============================================================

function linearRegressionForecast(values: number[], yearsAhead: number): ForecastMethodResult {
  const n = values.length;
  if (n < 2) return { values: Array(yearsAhead).fill(values[0] ?? 0), method: 'Linear Regression' };

  const x = Array.from({ length: n }, (_, i) => i);
  const sumX = x.reduce((a, b) => a + b, 0);
  const sumY = values.reduce((a, b) => a + b, 0);
  const sumXY = x.reduce((acc, xi, i) => acc + xi * values[i], 0);
  const sumX2 = x.reduce((acc, xi) => acc + xi * xi, 0);

  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX || 1);
  const intercept = (sumY - slope * sumX) / n;

  // R²
  const meanY = sumY / n;
  const predicted = x.map((xi) => intercept + slope * xi);
  const ssTotal = values.reduce((acc, v) => acc + Math.pow(v - meanY, 2), 0);
  const ssResidual = values.reduce((acc, v, i) => acc + Math.pow(v - predicted[i], 2), 0);
  const r2 = ssTotal > 0 ? 1 - ssResidual / ssTotal : 0;

  const forecast: number[] = [];
  for (let i = 0; i < yearsAhead; i++) {
    forecast.push(Math.max(0, intercept + slope * (n + i)));
  }

  return { values: forecast, method: 'Linear Regression', confidence: r2 };
}

function exponentialSmoothingForecast(
  values: number[],
  yearsAhead: number,
  alpha = 0.3,
  beta = 0.2,
): ForecastMethodResult {
  const n = values.length;
  if (n < 2) return { values: Array(yearsAhead).fill(values[0] ?? 0), method: 'Exponential Smoothing' };

  // Holt's double exponential smoothing
  let level = values[0];
  let trend = values[1] - values[0];

  for (let i = 1; i < n; i++) {
    const lastLevel = level;
    level = alpha * values[i] + (1 - alpha) * (level + trend);
    trend = beta * (level - lastLevel) + (1 - beta) * trend;
  }

  const forecast: number[] = [];
  for (let i = 1; i <= yearsAhead; i++) {
    forecast.push(Math.max(0, level + i * trend));
  }

  return { values: forecast, method: 'Exponential Smoothing (Holt)' };
}

function movingAverageForecast(values: number[], yearsAhead: number, window = 3): ForecastMethodResult {
  const n = values.length;
  const w = Math.min(window, n);
  const recent = values.slice(-w);
  const ma = average(recent);

  let trend = 0;
  if (n >= w + 1) {
    const prevMA = average(values.slice(-w - 1, -1));
    trend = ma - prevMA;
  }

  const forecast: number[] = [];
  for (let i = 1; i <= yearsAhead; i++) {
    forecast.push(Math.max(0, ma + i * trend));
  }

  return { values: forecast, method: `Moving Average (${w}-period)` };
}

function growthRateForecast(values: number[], yearsAhead: number): ForecastMethodResult {
  const cagr = calculateCAGR(values);
  const last = values[values.length - 1];

  const forecast: number[] = [];
  for (let i = 1; i <= yearsAhead; i++) {
    forecast.push(Math.max(0, last * Math.pow(1 + cagr, i)));
  }

  return { values: forecast, method: `CAGR (${(cagr * 100).toFixed(1)}%)` };
}

// ============================================================
// ENSEMBLE & CONFIDENCE
// ============================================================

function calculateEnsemble(
  methods: { values: number[]; weight: number }[],
  yearsAhead: number,
): number[] {
  const result: number[] = [];
  for (let i = 0; i < yearsAhead; i++) {
    let sum = 0;
    let totalWeight = 0;
    for (const m of methods) {
      if (m.values[i] !== undefined) {
        sum += m.values[i] * m.weight;
        totalWeight += m.weight;
      }
    }
    result.push(totalWeight > 0 ? sum / totalWeight : 0);
  }
  return result;
}

function calculateConfidenceIntervals(
  forecast: number[],
  volatility: number,
): MultiMethodForecastResult['confidenceIntervals'] {
  const zScores = { high: 1.645, medium: 1.282, low: 1.036 };

  const buildInterval = (z: number): ConfidenceInterval => ({
    upper: [],
    lower: [],
  });

  const intervals = {
    high: buildInterval(zScores.high),
    medium: buildInterval(zScores.medium),
    low: buildInterval(zScores.low),
  };

  forecast.forEach((value, idx) => {
    const yearMultiplier = Math.sqrt(idx + 1);
    Object.entries(zScores).forEach(([key, z]) => {
      const margin = value * volatility * z * yearMultiplier;
      intervals[key as keyof typeof intervals].upper.push(value + margin);
      intervals[key as keyof typeof intervals].lower.push(Math.max(0, value - margin));
    });
  });

  return intervals;
}

// ============================================================
// MAIN
// ============================================================

export function forecastMultiMethod(
  values: number[],
  startYear: number,
  yearsAhead: number = 3,
  metricName: string = 'Value',
): MultiMethodForecastResult {
  const n = values.length;
  if (n < 2) {
    throw new Error('Forecast requires at least 2 data points');
  }

  // Methods
  const lr = linearRegressionForecast(values, yearsAhead);
  const es = exponentialSmoothingForecast(values, yearsAhead);
  const ma = movingAverageForecast(values, yearsAhead);
  const gr = growthRateForecast(values, yearsAhead);

  // Ensemble (משקלים: LR 35%, ES 30%, GR 20%, MA 15%)
  const ensembleValues = calculateEnsemble(
    [
      { values: lr.values, weight: 0.35 },
      { values: es.values, weight: 0.3 },
      { values: gr.values, weight: 0.2 },
      { values: ma.values, weight: 0.15 },
    ],
    yearsAhead,
  );

  // Statistics
  const mean = average(values);
  const sd = stdDev(values);
  const cagr = calculateCAGR(values);
  const volatility = mean > 0 ? sd / mean : 0;

  // Trend
  const recentAvg = average(values.slice(-3));
  const earlyAvg = average(values.slice(0, 3));
  let trend: MultiMethodForecastResult['statistics']['trend'];
  if (recentAvg > earlyAvg * 1.05) trend = 'upward';
  else if (recentAvg < earlyAvg * 0.95) trend = 'downward';
  else trend = 'stable';

  // Anomalies
  const anomalies: MultiMethodForecastResult['anomalies'] = [];
  values.forEach((v, i) => {
    if (sd > 0) {
      const z = (v - mean) / sd;
      if (Math.abs(z) > 2) {
        anomalies.push({
          year: startYear + i,
          value: v,
          zScore: z,
          severity: Math.abs(z) > 3 ? 'severe' : 'mild',
        });
      }
    }
  });

  // Confidence intervals
  const confidenceIntervals = calculateConfidenceIntervals(ensembleValues, volatility);

  // Insights
  const insights: string[] = [];
  if (cagr > 0.15) insights.push(`📈 צמיחה חזקה היסטורית - ${(cagr * 100).toFixed(1)}% CAGR`);
  else if (cagr < -0.05) insights.push(`📉 ירידה היסטורית - ${(cagr * 100).toFixed(1)}% CAGR`);

  if (volatility > 0.3) insights.push(`⚠️ תנודתיות גבוהה (${(volatility * 100).toFixed(0)}%) - תחזית פחות אמינה`);
  else if (volatility < 0.1) insights.push(`✅ יציבות גבוהה - תחזית מהימנה יותר`);

  if (lr.confidence && lr.confidence > 0.9) insights.push(`✅ R² גבוה (${(lr.confidence * 100).toFixed(0)}%) - מגמה לינארית ברורה`);

  if (anomalies.length > 0) insights.push(`🔍 זוהו ${anomalies.length} ערכים חריגים בהיסטוריה`);

  return {
    metric: metricName,
    historical: {
      values,
      years: Array.from({ length: n }, (_, i) => startYear + i),
    },
    forecast: {
      values: ensembleValues,
      years: Array.from({ length: yearsAhead }, (_, i) => startYear + n + i),
    },
    methods: {
      linearRegression: lr,
      exponentialSmoothing: es,
      movingAverage: ma,
      growthRate: gr,
    },
    confidenceIntervals,
    statistics: { mean, stdDev: sd, cagr, volatility, trend },
    anomalies,
    insights,
  };
}
