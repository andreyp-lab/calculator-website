'use client';

import { useMemo, useState } from 'react';
import { useTools } from '@/lib/tools/ToolsContext';
import {
  calculateAllMonths,
  calculateBudgetTotals,
} from '@/lib/tools/budget-engine';
import {
  INDUSTRY_BENCHMARKS,
  compareCompanyToBenchmark,
  calculateOverallScore,
  type CompanyMetrics,
  type BenchmarkInsight,
} from '@/lib/tools/industry-benchmarks';
import type { Industry } from '@/lib/tools/types';
import { Trophy, TrendingUp, AlertTriangle, CheckCircle2 } from 'lucide-react';

export function IndustryBenchmarks() {
  const { budget, settings } = useTools();
  const [industryOverride, setIndustryOverride] = useState<Industry | null>(null);

  const industry: Industry = industryOverride ?? settings?.industry ?? 'services';
  const benchmark = INDUSTRY_BENCHMARKS[industry];

  const insights = useMemo<BenchmarkInsight[]>(() => {
    if (!budget || !settings) return [];

    const monthly = calculateAllMonths(budget, settings);
    const totals = calculateBudgetTotals(monthly);

    const metrics: CompanyMetrics = {
      grossMargin: totals.grossMargin,
      operatingMargin: totals.operatingMargin,
      netMargin: totals.netMargin,
      ebitdaMargin: totals.ebitdaMargin,
      rndPctOfRevenue: totals.income > 0 ? (totals.rnd / totals.income) * 100 : 0,
      marketingPctOfRevenue: totals.income > 0 ? (totals.marketing / totals.income) * 100 : 0,
      operatingPctOfRevenue: totals.income > 0 ? (totals.operating / totals.income) * 100 : 0,
    };

    return compareCompanyToBenchmark(metrics, industry);
  }, [budget, settings, industry]);

  if (!settings) return null;

  const overallScore = calculateOverallScore(insights);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white rounded-lg border-2 border-gray-200 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-4">
          <h3 className="font-bold flex items-center gap-2">
            <Trophy className="w-5 h-5" />
            השוואה לבנצ'מרק ענפי
          </h3>
          <p className="text-xs text-emerald-100">
            מקור: {benchmark.source} • {benchmark.asOfYear}
          </p>
        </div>

        <div className="p-4 flex items-center justify-between">
          <div>
            <label className="block text-xs text-gray-700 mb-1">ענף להשוואה</label>
            <select
              value={industry}
              onChange={(e) => setIndustryOverride(e.target.value as Industry)}
              className="px-3 py-1.5 border border-gray-300 rounded text-sm"
            >
              {Object.values(INDUSTRY_BENCHMARKS).map((b) => (
                <option key={b.industry} value={b.industry}>
                  {b.industryLabel}
                </option>
              ))}
            </select>
          </div>

          {/* Overall Score */}
          <div className="text-center">
            <div className="text-xs text-gray-600 mb-1">ציון בריאות פיננסית כולל</div>
            <div
              className={`text-3xl font-bold ${
                overallScore >= 75
                  ? 'text-emerald-600'
                  : overallScore >= 50
                    ? 'text-amber-600'
                    : 'text-red-600'
              }`}
            >
              {Math.round(overallScore)}
              <span className="text-base text-gray-500">/100</span>
            </div>
          </div>
        </div>
      </div>

      {/* Insights Grid */}
      <div className="grid md:grid-cols-2 gap-3">
        {insights.map((insight) => (
          <InsightCard key={insight.metric} insight={insight} />
        ))}
      </div>

      {insights.length === 0 && (
        <div className="bg-amber-50 border-2 border-amber-200 rounded-lg p-6 text-center text-amber-900">
          הזן נתוני תקציב כדי לראות השוואה
        </div>
      )}
    </div>
  );
}

function InsightCard({ insight }: { insight: BenchmarkInsight }) {
  const { metricLabel, yourValue, benchmark, comparison, score, message } = insight;

  const scoreColor =
    score >= 75 ? 'emerald' : score >= 50 ? 'amber' : 'red';

  // Position on the spectrum (0-100%)
  const min = Math.min(benchmark.low, yourValue);
  const max = Math.max(benchmark.high, yourValue);
  const range = max - min || 1;
  const yourPct = ((yourValue - min) / range) * 100;
  const lowPct = ((benchmark.low - min) / range) * 100;
  const medianPct = ((benchmark.median - min) / range) * 100;
  const highPct = ((benchmark.high - min) / range) * 100;

  const formatValue = (v: number) => {
    switch (benchmark.unit) {
      case 'pct':
        return `${v.toFixed(1)}%`;
      case 'days':
        return `${Math.round(v)} ימים`;
      case 'ratio':
        return v.toFixed(2);
    }
  };

  return (
    <div className="bg-white rounded-lg border-2 border-gray-200 p-3 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-semibold text-sm">{metricLabel}</h4>
        <span
          className={`text-xs px-2 py-0.5 rounded-full bg-${scoreColor}-100 text-${scoreColor}-800 border border-${scoreColor}-300`}
          style={{
            backgroundColor:
              score >= 75 ? '#d1fae5' : score >= 50 ? '#fef3c7' : '#fee2e2',
            color: score >= 75 ? '#065f46' : score >= 50 ? '#92400e' : '#991b1b',
          }}
        >
          {Math.round(score)}/100
        </span>
      </div>

      <div className="flex items-baseline gap-2 mb-3">
        <span className="text-2xl font-bold text-gray-900">{formatValue(yourValue)}</span>
        <span className="text-xs text-gray-500">בנצ'מרק חציון: {formatValue(benchmark.median)}</span>
      </div>

      {/* Spectrum bar */}
      <div className="relative h-2 bg-gray-100 rounded mb-2">
        <div
          className="absolute h-full bg-gradient-to-r from-red-200 via-amber-200 to-emerald-200 rounded"
          style={{
            left: `${lowPct}%`,
            width: `${Math.max(0, highPct - lowPct)}%`,
          }}
        />
        {/* Median marker */}
        <div
          className="absolute h-3 w-0.5 bg-gray-700 -top-0.5"
          style={{ left: `${medianPct}%` }}
        />
        {/* Your marker */}
        <div
          className="absolute -top-1 w-3 h-4 rounded-sm bg-blue-600 border-2 border-white shadow"
          style={{ left: `calc(${yourPct}% - 6px)` }}
        />
      </div>

      <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
        <span>Q1: {formatValue(benchmark.low)}</span>
        <span>חציון: {formatValue(benchmark.median)}</span>
        <span>Q3: {formatValue(benchmark.high)}</span>
      </div>

      <div className="flex items-start gap-1.5 text-xs">
        {score >= 75 ? (
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
        ) : score >= 50 ? (
          <TrendingUp className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
        ) : (
          <AlertTriangle className="w-3.5 h-3.5 text-red-600 shrink-0 mt-0.5" />
        )}
        <span className="text-gray-700">{message}</span>
      </div>
    </div>
  );
}
