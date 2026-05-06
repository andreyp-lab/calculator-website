'use client';

import { useMemo, useState } from 'react';
import { useTools } from '@/lib/tools/ToolsContext';
import { calculateAllMonths } from '@/lib/tools/budget-engine';
import { forecastMultiMethod } from '@/lib/tools/forecast-multi-method';
import { formatCurrency } from '@/lib/tools/format';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { AlertCircle, Sparkles } from 'lucide-react';

type Metric = 'revenue' | 'netProfit' | 'ebitda';

export function MultiMethodForecastDisplay() {
  const { budget, settings } = useTools();
  const [metric, setMetric] = useState<Metric>('revenue');
  const [yearsAhead, setYearsAhead] = useState(3);

  // Build historical from monthly aggregated to annual buckets
  const forecast = useMemo(() => {
    if (!budget || !settings) return null;
    const monthly = calculateAllMonths(budget, settings);
    if (monthly.length < 2) return null;

    // Aggregate to annual values
    const valuesByYear: Record<number, number[]> = {};
    monthly.forEach((m) => {
      const year = settings.fiscalYear + Math.floor(m.monthIndex / 12);
      if (!valuesByYear[year]) valuesByYear[year] = [];
      const value =
        metric === 'revenue' ? m.income : metric === 'netProfit' ? m.netProfit : m.ebitda;
      valuesByYear[year].push(value);
    });

    const annualValues: number[] = [];
    const sortedYears = Object.keys(valuesByYear)
      .map(Number)
      .sort((a, b) => a - b);
    sortedYears.forEach((y) => {
      annualValues.push(valuesByYear[y].reduce((s, v) => s + v, 0));
    });

    // Need at least 2 years for forecast
    if (annualValues.length < 2) {
      // Use monthly trend instead - take last 12 months and project
      const last12 = monthly.slice(-12).map((m) =>
        metric === 'revenue' ? m.income : metric === 'netProfit' ? m.netProfit : m.ebitda,
      );
      // For monthly forecast, use 4 quarters as data points
      const quarters = [0, 1, 2, 3].map((q) => last12.slice(q * 3, (q + 1) * 3).reduce((s, v) => s + v, 0));
      try {
        return forecastMultiMethod(
          quarters,
          settings.fiscalYear,
          yearsAhead,
          metric === 'revenue' ? 'הכנסות' : metric === 'netProfit' ? 'רווח נקי' : 'EBITDA',
        );
      } catch {
        return null;
      }
    }

    try {
      return forecastMultiMethod(
        annualValues,
        sortedYears[0],
        yearsAhead,
        metric === 'revenue' ? 'הכנסות' : metric === 'netProfit' ? 'רווח נקי' : 'EBITDA',
      );
    } catch {
      return null;
    }
  }, [budget, settings, metric, yearsAhead]);

  if (!forecast) {
    return (
      <div className="bg-amber-50 border-2 border-amber-200 rounded-lg p-6 text-center">
        <AlertCircle className="w-10 h-10 text-amber-500 mx-auto mb-2" />
        <p className="text-amber-900">חסרים נתונים לחיזוי - דרושות לפחות 2 נקודות זמן</p>
      </div>
    );
  }

  const fmt = (v: number) => formatCurrency(v, settings?.currency ?? 'ILS');

  // Build chart data
  const chartData = [
    ...forecast.historical.years.map((y, i) => ({
      year: y.toString(),
      היסטורי: forecast.historical.values[i],
      תחזית: null as number | null,
      upper: null as number | null,
      lower: null as number | null,
    })),
    ...forecast.forecast.years.map((y, i) => ({
      year: y.toString(),
      היסטורי: null as number | null,
      תחזית: forecast.forecast.values[i],
      upper: forecast.confidenceIntervals.high.upper[i],
      lower: forecast.confidenceIntervals.high.lower[i],
    })),
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white rounded-lg border-2 border-gray-200 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-amber-600 to-orange-600 text-white p-4">
          <h3 className="font-bold flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            חיזוי רב-שיטתי (Ensemble)
          </h3>
          <p className="text-xs text-amber-100">
            ממוצע משוקלל של 4 שיטות חיזוי + טווחי ביטחון
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-lg border-2 border-gray-200 p-3 shadow-sm flex gap-3 flex-wrap">
        <div>
          <label className="block text-xs text-gray-700 mb-1">מדד לחיזוי</label>
          <select
            value={metric}
            onChange={(e) => setMetric(e.target.value as Metric)}
            className="px-2 py-1.5 border border-gray-300 rounded text-sm"
          >
            <option value="revenue">📈 הכנסות</option>
            <option value="netProfit">💰 רווח נקי</option>
            <option value="ebitda">⚡ EBITDA</option>
          </select>
        </div>
        <div>
          <label className="block text-xs text-gray-700 mb-1">אופק חיזוי</label>
          <select
            value={yearsAhead}
            onChange={(e) => setYearsAhead(parseInt(e.target.value))}
            className="px-2 py-1.5 border border-gray-300 rounded text-sm"
          >
            <option value={1}>1 שנה</option>
            <option value={2}>2 שנים</option>
            <option value={3}>3 שנים</option>
            <option value={5}>5 שנים</option>
          </select>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid md:grid-cols-4 gap-3">
        <StatCard label="ממוצע היסטורי" value={fmt(forecast.statistics.mean)} color="blue" />
        <StatCard
          label="CAGR"
          value={`${(forecast.statistics.cagr * 100).toFixed(1)}%`}
          color={forecast.statistics.cagr > 0 ? 'emerald' : 'red'}
        />
        <StatCard
          label="תנודתיות"
          value={`${(forecast.statistics.volatility * 100).toFixed(0)}%`}
          color={forecast.statistics.volatility > 0.3 ? 'amber' : 'emerald'}
        />
        <StatCard
          label="מגמה"
          value={
            forecast.statistics.trend === 'upward'
              ? '📈 עולה'
              : forecast.statistics.trend === 'downward'
                ? '📉 יורדת'
                : '➡️ יציבה'
          }
          color={
            forecast.statistics.trend === 'upward'
              ? 'emerald'
              : forecast.statistics.trend === 'downward'
                ? 'red'
                : 'gray'
          }
        />
      </div>

      {/* Chart */}
      <div className="bg-white rounded-lg border-2 border-gray-200 shadow-sm overflow-hidden">
        <div className="bg-amber-600 text-white p-3 text-sm font-bold">
          {forecast.metric} - היסטוריה ותחזית עם רצועת ביטחון 90%
        </div>
        <div className="p-4">
          <ResponsiveContainer width="100%" height={320}>
            <ComposedChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
              <Tooltip formatter={(v) => (v ? fmt(Number(v)) : '')} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Area
                type="monotone"
                dataKey="upper"
                stroke="transparent"
                fill="#fbbf24"
                fillOpacity={0.2}
                name="טווח עליון 90%"
              />
              <Area
                type="monotone"
                dataKey="lower"
                stroke="transparent"
                fill="#fbbf24"
                fillOpacity={0.2}
                name="טווח תחתון 90%"
              />
              <Line
                type="monotone"
                dataKey="היסטורי"
                stroke="#10b981"
                strokeWidth={3}
                dot={{ r: 5 }}
              />
              <Line
                type="monotone"
                dataKey="תחזית"
                stroke="#f59e0b"
                strokeWidth={3}
                strokeDasharray="5 5"
                dot={{ r: 5 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Methods Comparison */}
      <div className="bg-white rounded-lg border-2 border-gray-200 shadow-sm overflow-x-auto">
        <div className="bg-gray-700 text-white p-3 text-sm font-bold">
          השוואת שיטות חיזוי - שנה אחרונה
        </div>
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-right p-2">שיטה</th>
              {forecast.forecast.years.map((y) => (
                <th key={y} className="text-center p-2">
                  {y}
                </th>
              ))}
              <th className="text-center p-2">איכות</th>
            </tr>
          </thead>
          <tbody>
            <MethodRow
              method="Linear Regression"
              values={forecast.methods.linearRegression.values}
              fmt={fmt}
              extra={
                forecast.methods.linearRegression.confidence
                  ? `R²=${(forecast.methods.linearRegression.confidence * 100).toFixed(0)}%`
                  : ''
              }
            />
            <MethodRow
              method="Exponential Smoothing"
              values={forecast.methods.exponentialSmoothing.values}
              fmt={fmt}
              extra="Holt"
            />
            <MethodRow
              method="Moving Average"
              values={forecast.methods.movingAverage.values}
              fmt={fmt}
            />
            <MethodRow
              method="CAGR Growth"
              values={forecast.methods.growthRate.values}
              fmt={fmt}
            />
            <tr className="border-t-2 bg-amber-50 font-bold">
              <td className="p-2">🎯 Ensemble (משוקלל)</td>
              {forecast.forecast.values.map((v, i) => (
                <td key={i} className="p-2 text-center text-amber-700">
                  {fmt(v)}
                </td>
              ))}
              <td className="p-2 text-center text-xs">35/30/15/20</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Anomalies */}
      {forecast.anomalies.length > 0 && (
        <div className="bg-rose-50 border border-rose-200 rounded-lg p-3">
          <h4 className="font-semibold text-rose-900 mb-2">🔍 ערכים חריגים בהיסטוריה</h4>
          <div className="text-xs text-rose-900 space-y-1">
            {forecast.anomalies.map((a, i) => (
              <div key={i}>
                שנת {a.year}: {fmt(a.value)} (Z={a.zScore.toFixed(2)},{' '}
                {a.severity === 'severe' ? 'חריגה חמורה' : 'חריגה קלה'})
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Insights */}
      {forecast.insights.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <h4 className="font-semibold text-blue-900 mb-2">תובנות AI</h4>
          <ul className="text-sm text-blue-900 space-y-1">
            {forecast.insights.map((i, idx) => (
              <li key={idx}>{i}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
}) {
  const colorMap: Record<string, { bg: string; text: string }> = {
    blue: { bg: 'bg-blue-50', text: 'text-blue-700' },
    emerald: { bg: 'bg-emerald-50', text: 'text-emerald-700' },
    red: { bg: 'bg-red-50', text: 'text-red-700' },
    amber: { bg: 'bg-amber-50', text: 'text-amber-700' },
    gray: { bg: 'bg-gray-50', text: 'text-gray-700' },
  };
  const c = colorMap[color];
  return (
    <div className={`${c.bg} rounded-lg p-3 text-center border border-gray-200`}>
      <div className="text-xs text-gray-600 mb-1">{label}</div>
      <div className={`text-xl font-bold ${c.text}`}>{value}</div>
    </div>
  );
}

function MethodRow({
  method,
  values,
  fmt,
  extra,
}: {
  method: string;
  values: number[];
  fmt: (v: number) => string;
  extra?: string;
}) {
  return (
    <tr className="border-t border-gray-100">
      <td className="p-2 text-xs">{method}</td>
      {values.map((v, i) => (
        <td key={i} className="p-2 text-center text-xs">
          {fmt(v)}
        </td>
      ))}
      <td className="p-2 text-center text-xs text-gray-500">{extra}</td>
    </tr>
  );
}
