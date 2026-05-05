'use client';

import { useState, useMemo } from 'react';
import {
  analyzeCohorts,
  rateLtvCac,
  ratePayback,
} from '@/lib/tools/cohort-engine';
import type { CustomerCohort } from '@/lib/tools/types';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Users, Plus, Trash2, TrendingUp } from 'lucide-react';

const STORAGE_KEY = 'cohort-analysis-v1';

const COHORT_COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4', '#ef4444', '#84cc16'];

export function CohortAnalysis() {
  const [cohorts, setCohorts] = useState<CustomerCohort[]>(() => {
    if (typeof window === 'undefined') return defaultCohorts();
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch {}
    return defaultCohorts();
  });

  const [horizonMonths, setHorizonMonths] = useState(24);

  const analysis = useMemo(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cohorts));
    }
    return analyzeCohorts(cohorts, horizonMonths);
  }, [cohorts, horizonMonths]);

  function addCohort() {
    const lastDate = new Date();
    lastDate.setMonth(lastDate.getMonth() - cohorts.length);
    const month = lastDate.toISOString().slice(0, 7);
    setCohorts([
      ...cohorts,
      {
        acquisitionMonth: month,
        newCustomers: 100,
        arpu: 200,
        monthlyChurnPct: 5,
        cac: 500,
      },
    ]);
  }

  function updateCohort(idx: number, patch: Partial<CustomerCohort>) {
    setCohorts(cohorts.map((c, i) => (i === idx ? { ...c, ...patch } : c)));
  }

  function removeCohort(idx: number) {
    setCohorts(cohorts.filter((_, i) => i !== idx));
  }

  const ltvCacRating = rateLtvCac(analysis.totals.ltvToCacRatio);
  const paybackRating = ratePayback(analysis.totals.paybackMonths);

  // Chart data: revenue per month for each cohort
  const chartData = Array.from({ length: horizonMonths }, (_, m) => {
    const row: Record<string, string | number> = { month: `M${m + 1}` };
    cohorts.forEach((c, i) => {
      row[`קוהורט ${c.acquisitionMonth}`] = Math.round(analysis.cohortMatrix[i]?.[m] ?? 0);
    });
    return row;
  });

  return (
    <div className="space-y-4">
      {/* Header + KPIs */}
      <div className="bg-white rounded-lg border-2 border-gray-200 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-pink-600 to-rose-600 text-white p-4">
          <h3 className="font-bold flex items-center gap-2">
            <Users className="w-5 h-5" />
            ניתוח קוהורט - LTV / CAC
          </h3>
          <p className="text-xs text-pink-100">מדדים קריטיים ל-SaaS, e-commerce, מנויים</p>
        </div>

        <div className="p-4 grid md:grid-cols-5 gap-2">
          <KPICard
            label="LTV ממוצע"
            value={`₪${Math.round(analysis.totals.avgLtv).toLocaleString()}`}
            color="blue"
          />
          <KPICard
            label="CAC ממוצע"
            value={`₪${Math.round(analysis.totals.avgCac).toLocaleString()}`}
            color="purple"
          />
          <KPICard
            label="יחס LTV/CAC"
            value={`${analysis.totals.ltvToCacRatio.toFixed(1)}x`}
            color={ltvCacRating.rating === 'excellent' || ltvCacRating.rating === 'good' ? 'emerald' : 'amber'}
            sublabel={ltvCacRating.message}
          />
          <KPICard
            label="Payback"
            value={
              Number.isFinite(analysis.totals.paybackMonths)
                ? `${Math.round(analysis.totals.paybackMonths)} חוד'`
                : '∞'
            }
            color={paybackRating.rating === 'excellent' || paybackRating.rating === 'good' ? 'emerald' : 'amber'}
            sublabel={paybackRating.message}
          />
          <KPICard
            label="NRR"
            value={`${analysis.totals.netRevenueRetention.toFixed(0)}%`}
            color={analysis.totals.netRevenueRetention >= 100 ? 'emerald' : 'red'}
            sublabel={analysis.totals.netRevenueRetention >= 100 ? 'בריא' : 'דליפת לקוחות'}
          />
        </div>
      </div>

      {/* Cohorts editor */}
      <div className="bg-white rounded-lg border-2 border-gray-200 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between p-3 bg-gray-50 border-b">
          <h4 className="font-semibold text-gray-900">קוהורטים ({cohorts.length})</h4>
          <div className="flex items-center gap-2">
            <select
              value={horizonMonths}
              onChange={(e) => setHorizonMonths(parseInt(e.target.value))}
              className="px-2 py-1 border border-gray-300 rounded text-xs"
            >
              <option value={12}>12 חודשים</option>
              <option value={24}>24 חודשים</option>
              <option value={36}>36 חודשים</option>
            </select>
            <button
              onClick={addCohort}
              className="flex items-center gap-1 px-2 py-1 bg-pink-600 text-white rounded text-xs hover:bg-pink-700"
            >
              <Plus className="w-3 h-3" />
              הוסף קוהורט
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-right p-2 text-xs">חודש רכישה</th>
                <th className="text-center p-2 text-xs">לקוחות חדשים</th>
                <th className="text-center p-2 text-xs">ARPU חודשי (₪)</th>
                <th className="text-center p-2 text-xs">Churn % חודשי</th>
                <th className="text-center p-2 text-xs">CAC (₪)</th>
                <th className="text-center p-2 text-xs">LTV (₪)</th>
                <th className="text-center p-2 text-xs">LTV/CAC</th>
                <th className="text-center p-2 text-xs"></th>
              </tr>
            </thead>
            <tbody>
              {cohorts.map((c, i) => {
                const ltv = c.monthlyChurnPct > 0 ? c.arpu / (c.monthlyChurnPct / 100) : c.arpu * 60;
                const ltvCac = c.cac > 0 ? ltv / c.cac : 0;
                return (
                  <tr key={i} className="border-t border-gray-100">
                    <td className="p-1.5">
                      <input
                        type="month"
                        value={c.acquisitionMonth}
                        onChange={(e) => updateCohort(i, { acquisitionMonth: e.target.value })}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
                      />
                    </td>
                    <td className="p-1.5">
                      <input
                        type="number"
                        value={c.newCustomers}
                        onChange={(e) => updateCohort(i, { newCustomers: parseInt(e.target.value) || 0 })}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-xs text-center"
                      />
                    </td>
                    <td className="p-1.5">
                      <input
                        type="number"
                        value={c.arpu}
                        onChange={(e) => updateCohort(i, { arpu: parseFloat(e.target.value) || 0 })}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-xs text-center"
                      />
                    </td>
                    <td className="p-1.5">
                      <input
                        type="number"
                        step="0.5"
                        value={c.monthlyChurnPct}
                        onChange={(e) =>
                          updateCohort(i, { monthlyChurnPct: parseFloat(e.target.value) || 0 })
                        }
                        className="w-full px-2 py-1 border border-gray-300 rounded text-xs text-center"
                      />
                    </td>
                    <td className="p-1.5">
                      <input
                        type="number"
                        value={c.cac}
                        onChange={(e) => updateCohort(i, { cac: parseFloat(e.target.value) || 0 })}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-xs text-center"
                      />
                    </td>
                    <td className="p-1.5 text-center text-xs font-semibold text-blue-700">
                      ₪{Math.round(ltv).toLocaleString()}
                    </td>
                    <td className="p-1.5 text-center">
                      <span
                        className={`text-xs px-1.5 py-0.5 rounded font-bold ${
                          ltvCac >= 3
                            ? 'bg-emerald-100 text-emerald-800'
                            : ltvCac >= 1.5
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {ltvCac.toFixed(1)}x
                      </span>
                    </td>
                    <td className="p-1.5 text-center">
                      <button
                        onClick={() => removeCohort(i)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cohort Revenue Chart */}
      {cohorts.length > 0 && (
        <div className="bg-white rounded-lg border-2 border-gray-200 shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-3">
            <h3 className="font-bold flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              הכנסות מצטברות לפי קוהורט
            </h3>
          </div>
          <div className="p-4">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                <YAxis tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} tick={{ fontSize: 10 }} />
                <Tooltip
                  formatter={(v) => `₪${Number(v).toLocaleString('he-IL')}`}
                />
                <Legend wrapperStyle={{ direction: 'rtl', fontSize: 10 }} />
                {cohorts.map((c, i) => (
                  <Line
                    key={i}
                    type="monotone"
                    dataKey={`קוהורט ${c.acquisitionMonth}`}
                    stroke={COHORT_COLORS[i % COHORT_COLORS.length]}
                    strokeWidth={2}
                    dot={false}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}

function KPICard({
  label,
  value,
  color,
  sublabel,
}: {
  label: string;
  value: string;
  color: 'blue' | 'purple' | 'emerald' | 'amber' | 'red';
  sublabel?: string;
}) {
  const colorMap: Record<string, { bg: string; text: string }> = {
    blue: { bg: 'bg-blue-50', text: 'text-blue-700' },
    purple: { bg: 'bg-purple-50', text: 'text-purple-700' },
    emerald: { bg: 'bg-emerald-50', text: 'text-emerald-700' },
    amber: { bg: 'bg-amber-50', text: 'text-amber-700' },
    red: { bg: 'bg-red-50', text: 'text-red-700' },
  };
  const c = colorMap[color];
  return (
    <div className={`${c.bg} rounded-lg p-3 border border-gray-200`}>
      <div className="text-xs text-gray-600 mb-0.5">{label}</div>
      <div className={`text-xl font-bold ${c.text}`}>{value}</div>
      {sublabel && <div className="text-[10px] text-gray-500 mt-1 line-clamp-1">{sublabel}</div>}
    </div>
  );
}

function defaultCohorts(): CustomerCohort[] {
  const now = new Date();
  return [0, 1, 2].map((i) => {
    const d = new Date(now);
    d.setMonth(d.getMonth() - (3 - i));
    return {
      acquisitionMonth: d.toISOString().slice(0, 7),
      newCustomers: 100 + i * 20,
      arpu: 200,
      monthlyChurnPct: 4,
      cac: 500,
    };
  });
}
