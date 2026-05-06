'use client';

import { useMemo } from 'react';
import { useTools } from '@/lib/tools/ToolsContext';
import { calculateAllMonths, calculateBudgetTotals } from '@/lib/tools/budget-engine';
import { comparePeriods, type PeriodMetrics } from '@/lib/tools/period-comparison';
import { formatCurrency } from '@/lib/tools/format';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { GitCompare, AlertCircle, TrendingUp, TrendingDown } from 'lucide-react';

/**
 * רכיב להשוואת תקופות.
 * משתמש בכל התרחישים השמורים כתקופות נפרדות.
 */
export function PeriodComparisonDisplay() {
  const { budget, settings, balanceSheet, scenariosList, getScenarioById } = useTools();

  const comparison = useMemo(() => {
    if (!budget || !settings || !balanceSheet) return null;

    // Build periods from all scenarios that have data
    const periods: PeriodMetrics[] = [];
    let yearOffset = 0;

    for (const s of scenariosList) {
      const scen = getScenarioById(s.id);
      if (!scen) continue;
      const monthly = calculateAllMonths(scen.budget, scen.settings);
      const totals = calculateBudgetTotals(monthly);

      // Use scenario fiscal year if set, otherwise increment
      const year = scen.settings.fiscalYear + yearOffset;
      yearOffset++;

      periods.push({
        year,
        revenue: totals.income,
        grossProfit: totals.grossProfit,
        operatingProfit: totals.operatingProfit,
        netProfit: totals.netProfit,
        ebitda: totals.ebitda,
        totalAssets: scen.balanceSheet?.totalAssets ?? 0,
        totalEquity: scen.balanceSheet?.totalEquity ?? 0,
        totalLiabilities: scen.balanceSheet?.totalLiabilities ?? 0,
        currentAssets: scen.balanceSheet?.currentAssets ?? 0,
        currentLiabilities: scen.balanceSheet?.currentLiabilities ?? 0,
      });
    }

    if (periods.length < 2) return null;

    try {
      return comparePeriods(periods);
    } catch {
      return null;
    }
  }, [budget, settings, balanceSheet, scenariosList, getScenarioById]);

  if (!comparison) {
    return (
      <div className="bg-amber-50 border-2 border-amber-200 rounded-lg p-6 text-center">
        <AlertCircle className="w-10 h-10 text-amber-500 mx-auto mb-2" />
        <p className="text-amber-900 mb-2">נדרשים לפחות 2 תרחישים להשוואת תקופות</p>
        <p className="text-xs text-amber-700">
          צור תרחיש נוסף עם נתוני שנה קודמת/הבאה כדי לראות השוואה
        </p>
      </div>
    );
  }

  const fmt = (v: number) => formatCurrency(v, settings?.currency ?? 'ILS');
  const trendColor = {
    positive: 'emerald',
    mixed: 'amber',
    negative: 'red',
  }[comparison.summary.overallTrend];

  // Chart data
  const chartData = comparison.periods.map((year, i) => ({
    year: year.toString(),
    הכנסות: Math.round(comparison.metrics.revenue.values[i] / 1000),
    'רווח נקי': Math.round(comparison.metrics.netProfit.values[i] / 1000),
    EBITDA: Math.round(comparison.metrics.ebitda.values[i] / 1000),
  }));

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white rounded-lg border-2 border-gray-200 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-violet-600 to-purple-600 text-white p-4">
          <h3 className="font-bold flex items-center gap-2">
            <GitCompare className="w-5 h-5" />
            השוואת תקופות (YoY)
          </h3>
          <p className="text-xs text-violet-100">
            ניתוח מגמות לאורך {comparison.periods.length} שנים
          </p>
        </div>
      </div>

      {/* Overall Summary */}
      <div className={`bg-${trendColor}-50 border-2 border-${trendColor}-300 rounded-lg p-4`}>
        <div className="grid md:grid-cols-3 gap-3 text-center">
          <div>
            <div className="text-xs text-gray-600">מגמה כללית</div>
            <div className={`text-2xl font-bold text-${trendColor}-700`}>
              {comparison.summary.overallTrend === 'positive'
                ? '📈 חיובית'
                : comparison.summary.overallTrend === 'mixed'
                  ? '↔️ מעורבת'
                  : '📉 שלילית'}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-600">צמיחה חזקה ביותר</div>
            <div className="text-sm font-bold">{comparison.summary.strongestGrowth.metric}</div>
            <div className="text-emerald-700 font-bold">
              {comparison.summary.strongestGrowth.cagr.toFixed(1)}% CAGR
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-600">ביצוע חלש ביותר</div>
            <div className="text-sm font-bold">
              {comparison.summary.weakestPerformance.metric}
            </div>
            <div className="text-red-700 font-bold">
              {comparison.summary.weakestPerformance.cagr.toFixed(1)}% CAGR
            </div>
          </div>
        </div>
      </div>

      {/* Trend Chart */}
      <div className="bg-white rounded-lg border-2 border-gray-200 shadow-sm overflow-hidden">
        <div className="bg-gray-700 text-white p-3 text-sm font-bold">
          מגמות מדדים מרכזיים (₪K)
        </div>
        <div className="p-4">
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis tickFormatter={(v) => `${v}K`} />
              <Tooltip formatter={(v) => `${Number(v).toLocaleString('he-IL')}K`} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Line type="monotone" dataKey="הכנסות" stroke="#3b82f6" strokeWidth={3} />
              <Line type="monotone" dataKey="רווח נקי" stroke="#10b981" strokeWidth={2} />
              <Line type="monotone" dataKey="EBITDA" stroke="#f59e0b" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Metrics Table */}
      <div className="bg-white rounded-lg border-2 border-gray-200 shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-right p-2">מדד</th>
              {comparison.periods.map((y) => (
                <th key={y} className="text-center p-2">
                  {y}
                </th>
              ))}
              <th className="text-center p-2">CAGR</th>
              <th className="text-center p-2">מגמה</th>
            </tr>
          </thead>
          <tbody>
            {Object.values(comparison.metrics).map((m) => (
              <tr key={m.key} className="border-t border-gray-100">
                <td className="p-2 font-medium">{m.label}</td>
                {m.values.map((v, i) => (
                  <td key={i} className="p-2 text-center text-xs">
                    {fmt(v)}
                  </td>
                ))}
                <td
                  className={`p-2 text-center font-bold ${
                    m.cagr > 0 ? 'text-emerald-700' : m.cagr < 0 ? 'text-red-700' : 'text-gray-600'
                  }`}
                >
                  {m.cagr > 0 ? '+' : ''}
                  {m.cagr.toFixed(1)}%
                </td>
                <td className="p-2 text-center">
                  {m.trend === 'strong_growth' && '🚀'}
                  {m.trend === 'growth' && '📈'}
                  {m.trend === 'stable' && '➡️'}
                  {m.trend === 'decline' && '📉'}
                  {m.trend === 'strong_decline' && '⚠️'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* YoY Analysis */}
      <div className="bg-white rounded-lg border-2 border-gray-200 shadow-sm overflow-hidden">
        <div className="bg-purple-600 text-white p-3 text-sm font-bold">YoY Growth - שנה לשנה</div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-right p-2">תקופה</th>
                <th className="text-center p-2">הכנסות</th>
                <th className="text-center p-2">רווח נקי</th>
                <th className="text-center p-2">נכסים</th>
              </tr>
            </thead>
            <tbody>
              {comparison.yoyAnalysis.map((y, i) => (
                <tr key={i} className="border-t border-gray-100">
                  <td className="p-2">
                    {y.fromYear} → {y.toYear}
                  </td>
                  <YoYCell value={y.revenueGrowth} />
                  <YoYCell value={y.profitGrowth} />
                  <YoYCell value={y.assetsGrowth} />
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Insights */}
      {comparison.insights.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-900 mb-2">תובנות</h4>
          <ul className="text-sm text-blue-900 space-y-1">
            {comparison.insights.map((i, idx) => (
              <li key={idx}>{i}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function YoYCell({ value }: { value: number }) {
  const color = value > 0 ? 'emerald' : value < 0 ? 'red' : 'gray';
  const Icon = value > 0 ? TrendingUp : value < 0 ? TrendingDown : null;
  return (
    <td className={`p-2 text-center font-bold text-${color}-700`}>
      <span className="inline-flex items-center gap-1">
        {Icon && <Icon className="w-3 h-3" />}
        {value > 0 ? '+' : ''}
        {value.toFixed(1)}%
      </span>
    </td>
  );
}
