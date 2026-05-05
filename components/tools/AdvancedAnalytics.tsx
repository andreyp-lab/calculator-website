'use client';

import { useMemo, useState } from 'react';
import { useTools } from '@/lib/tools/ToolsContext';
import { calculateAllMonths } from '@/lib/tools/budget-engine';
import {
  calculateSensitivityMatrix,
  calculateBudgetBreakEven,
  calculateBudgetRatios,
  forecast,
  type ForecastMethod,
} from '@/lib/tools/advanced-analytics';
import { formatCurrency, formatPercent } from '@/lib/tools/format';
import {
  LineChart,
  Line,
  Area,
  ComposedChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import {
  Activity,
  Zap,
  Scale,
  Percent,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';

type Tab = 'sensitivity' | 'forecast' | 'breakeven' | 'ratios';

export function AdvancedAnalytics() {
  const { budget, settings } = useTools();
  const [tab, setTab] = useState<Tab>('breakeven');
  const [forecastMethod, setForecastMethod] = useState<ForecastMethod>('moving-average');
  const [forecastMonths, setForecastMonths] = useState(12);

  const computed = useMemo(() => {
    if (!budget || !settings) return null;
    const monthly = calculateAllMonths(budget, settings);

    return {
      monthly,
      sensitivity: calculateSensitivityMatrix(budget, settings),
      breakEven: calculateBudgetBreakEven(budget, settings),
      ratios: calculateBudgetRatios(monthly, budget),
      forecastResult: forecast({
        historicalData: monthly.map((m) => m.income),
        monthsToForecast: forecastMonths,
        method: forecastMethod,
      }),
    };
  }, [budget, settings, forecastMethod, forecastMonths]);

  if (!computed || !settings) return null;

  const fmt = (v: number) => formatCurrency(v, settings.currency);

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="bg-white rounded-lg border-2 border-gray-200 p-2 shadow-sm flex flex-wrap gap-1">
        {[
          { id: 'breakeven' as Tab, label: 'נקודת איזון', icon: Scale },
          { id: 'sensitivity' as Tab, label: 'ניתוח רגישות', icon: Activity },
          { id: 'forecast' as Tab, label: 'תחזית', icon: TrendingUp },
          { id: 'ratios' as Tab, label: 'יחסים פיננסיים', icon: Percent },
        ].map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded text-sm transition ${
                tab === t.id
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Break-Even Analysis */}
      {tab === 'breakeven' && (
        <div className="bg-white rounded-lg border-2 border-gray-200 shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white p-4">
            <h3 className="font-bold flex items-center gap-2">
              <Scale className="w-5 h-5" />
              ניתוח נקודת איזון (Break-Even)
            </h3>
            <p className="text-xs text-blue-100">חישוב מינימום הכנסות לכיסוי הוצאות</p>
          </div>
          <div className="p-5 space-y-4">
            <div
              className={`border-2 rounded-lg p-4 ${
                computed.breakEven.isAboveBreakEven
                  ? 'border-emerald-400 bg-emerald-50'
                  : 'border-red-400 bg-red-50'
              }`}
            >
              <div className="flex items-center gap-3">
                {computed.breakEven.isAboveBreakEven ? (
                  <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                ) : (
                  <AlertTriangle className="w-8 h-8 text-red-600" />
                )}
                <div>
                  <h4 className="font-bold text-lg">
                    {computed.breakEven.isAboveBreakEven
                      ? 'מעל נקודת האיזון ✓'
                      : 'מתחת לנקודת האיזון ⚠️'}
                  </h4>
                  <p className="text-sm">
                    {computed.breakEven.isAboveBreakEven
                      ? `מרווח ביטחון: ${formatPercent(computed.breakEven.marginOfSafetyPct, 1)}`
                      : `חסר: ${fmt(Math.abs(computed.breakEven.marginOfSafety))} בהכנסות`}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-900">פירוט עלויות</h4>
                <div className="bg-gray-50 rounded p-3 space-y-1.5 text-sm">
                  <div className="flex justify-between">
                    <span>עלויות קבועות:</span>
                    <span className="font-medium">{fmt(computed.breakEven.fixedCosts)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>עלויות משתנות:</span>
                    <span className="font-medium">{fmt(computed.breakEven.variableCosts)}</span>
                  </div>
                  <div className="flex justify-between pt-1 border-t font-bold">
                    <span>סה"כ עלויות:</span>
                    <span>{fmt(computed.breakEven.totalCosts)}</span>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-900">תוצאות</h4>
                <div className="bg-gray-50 rounded p-3 space-y-1.5 text-sm">
                  <div className="flex justify-between">
                    <span>תרומה לכיסוי:</span>
                    <span className="font-medium">
                      {fmt(computed.breakEven.contributionMargin)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>שיעור תרומה:</span>
                    <span className="font-medium">
                      {formatPercent(computed.breakEven.contributionMarginRatio, 1)}
                    </span>
                  </div>
                  <div className="flex justify-between pt-1 border-t font-bold">
                    <span>הכנסות לאיזון:</span>
                    <span className="text-cyan-700">
                      {fmt(computed.breakEven.breakEvenRevenue)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sensitivity Analysis */}
      {tab === 'sensitivity' && (
        <div className="bg-white rounded-lg border-2 border-gray-200 shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4">
            <h3 className="font-bold flex items-center gap-2">
              <Activity className="w-5 h-5" />
              ניתוח רגישות - מטריצת רווח
            </h3>
            <p className="text-xs text-purple-100">
              רווח נקי לפי שינוי בהכנסות (שורות) ובהוצאות (עמודות)
            </p>
          </div>
          <div className="p-4 overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr>
                  <th className="border border-gray-300 p-2 bg-gray-100 text-gray-600">
                    הכנסות \ הוצאות
                  </th>
                  {[-30, -20, -10, 0, 10, 20, 30].map((c) => (
                    <th
                      key={c}
                      className="border border-gray-300 p-2 bg-gray-100 text-center font-medium"
                    >
                      {c > 0 ? '+' : ''}
                      {c}%
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {computed.sensitivity.map((row, i) => (
                  <tr key={i}>
                    <td className="border border-gray-300 p-2 bg-gray-100 font-medium text-center">
                      {row[0].incomeChange > 0 ? '+' : ''}
                      {row[0].incomeChange}%
                    </td>
                    {row.map((cell, j) => {
                      const isProfit = cell.netProfit > 0;
                      const intensity = Math.min(
                        Math.abs(cell.netProfit) / 100000,
                        1,
                      );
                      const bg = isProfit
                        ? `rgba(16, 185, 129, ${0.1 + intensity * 0.5})`
                        : `rgba(239, 68, 68, ${0.1 + intensity * 0.5})`;
                      return (
                        <td
                          key={j}
                          className="border border-gray-300 p-2 text-center"
                          style={{ backgroundColor: bg }}
                        >
                          <div className="font-medium">{fmt(cell.netProfit)}</div>
                          <div className="text-[10px] text-gray-600">
                            {formatPercent(cell.margin, 1)}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-3 text-xs text-gray-600">
              💡 ירוק = רווח, אדום = הפסד. עומק הצבע = גודל הסכום.
            </div>
          </div>
        </div>
      )}

      {/* Forecast */}
      {tab === 'forecast' && (
        <div className="bg-white rounded-lg border-2 border-gray-200 shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-amber-600 to-orange-600 text-white p-4">
            <h3 className="font-bold flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              תחזית הכנסות
            </h3>
            <p className="text-xs text-amber-100">חיזוי לפי שיטות סטטיסטיות</p>
          </div>
          <div className="p-4">
            <div className="grid md:grid-cols-3 gap-3 mb-4">
              <div>
                <label className="block text-xs text-gray-700 mb-1">שיטת חיזוי</label>
                <select
                  value={forecastMethod}
                  onChange={(e) => setForecastMethod(e.target.value as ForecastMethod)}
                  className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
                >
                  <option value="moving-average">ממוצע נע (Moving Average)</option>
                  <option value="exponential">החלקה מעריכית (Exponential)</option>
                  <option value="linear">רגרסיה לינארית</option>
                  <option value="weighted">ממוצע משוקלל</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-700 mb-1">אופק חיזוי (חודשים)</label>
                <select
                  value={forecastMonths}
                  onChange={(e) => setForecastMonths(parseInt(e.target.value))}
                  className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
                >
                  <option value={6}>6 חודשים</option>
                  <option value={12}>12 חודשים</option>
                  <option value={18}>18 חודשים</option>
                  <option value={24}>24 חודשים</option>
                </select>
              </div>
              <div className="flex items-end">
                <div
                  className={`w-full p-2 rounded text-center text-sm ${
                    computed.forecastResult.trend === 'up'
                      ? 'bg-emerald-50 text-emerald-700'
                      : computed.forecastResult.trend === 'down'
                        ? 'bg-red-50 text-red-700'
                        : 'bg-gray-50 text-gray-700'
                  }`}
                >
                  טרנד:{' '}
                  {computed.forecastResult.trend === 'up'
                    ? '📈 עלייה'
                    : computed.forecastResult.trend === 'down'
                      ? '📉 ירידה'
                      : '➡️ יציב'}
                </div>
              </div>
            </div>

            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart
                data={[
                  ...computed.monthly.map((m, i) => ({
                    month: m.monthName,
                    actual: m.income,
                    forecast: null as number | null,
                    upper: null as number | null,
                    lower: null as number | null,
                  })),
                  ...computed.forecastResult.predicted.map((v, i) => ({
                    month: `+${i + 1}`,
                    actual: null as number | null,
                    forecast: v,
                    upper: computed.forecastResult.confidence.upper[i],
                    lower: computed.forecastResult.confidence.lower[i],
                  })),
                ]}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" tick={{ fontSize: 10 }} reversed />
                <YAxis
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`}
                  orientation="right"
                />
                <Tooltip formatter={(v) => (v ? fmt(Number(v)) : '')} />
                <Legend wrapperStyle={{ direction: 'rtl', fontSize: 11 }} />
                <Area
                  type="monotone"
                  dataKey="upper"
                  stroke="transparent"
                  fill="#fbbf24"
                  fillOpacity={0.2}
                  name="טווח עליון"
                />
                <Area
                  type="monotone"
                  dataKey="lower"
                  stroke="transparent"
                  fill="#fbbf24"
                  fillOpacity={0.2}
                  name="טווח תחתון"
                />
                <Line
                  type="monotone"
                  dataKey="actual"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  name="היסטורי"
                />
                <Line
                  type="monotone"
                  dataKey="forecast"
                  stroke="#f59e0b"
                  strokeWidth={3}
                  strokeDasharray="5 5"
                  dot={{ r: 4 }}
                  name="חיזוי"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Financial Ratios */}
      {tab === 'ratios' && (
        <div className="bg-white rounded-lg border-2 border-gray-200 shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-4">
            <h3 className="font-bold flex items-center gap-2">
              <Percent className="w-5 h-5" />
              יחסים פיננסיים
            </h3>
            <p className="text-xs text-emerald-100">מדדי ביצוע פיננסיים מבוססי תקציב</p>
          </div>
          <div className="p-5">
            <div className="grid md:grid-cols-3 gap-3">
              {[
                {
                  label: 'מרווח גולמי',
                  value: computed.ratios.grossMargin,
                  format: 'pct',
                  benchmark: 'יעד: 40%+',
                  bg: 'bg-blue-50',
                  border: 'border-blue-200',
                  text: 'text-blue-700',
                },
                {
                  label: 'מרווח תפעולי',
                  value: computed.ratios.operatingMargin,
                  format: 'pct',
                  benchmark: 'יעד: 15%+',
                  bg: 'bg-purple-50',
                  border: 'border-purple-200',
                  text: 'text-purple-700',
                },
                {
                  label: 'מרווח נקי',
                  value: computed.ratios.netMargin,
                  format: 'pct',
                  benchmark: 'יעד: 10%+',
                  bg: 'bg-emerald-50',
                  border: 'border-emerald-200',
                  text: 'text-emerald-700',
                },
                {
                  label: 'מרווח EBITDA',
                  value: computed.ratios.ebitdaMargin,
                  format: 'pct',
                  benchmark: 'יעד: 20%+',
                  bg: 'bg-amber-50',
                  border: 'border-amber-200',
                  text: 'text-amber-700',
                },
                {
                  label: 'ROI',
                  value: computed.ratios.roi,
                  format: 'pct',
                  benchmark: 'יעד: 15%+',
                  bg: 'bg-cyan-50',
                  border: 'border-cyan-200',
                  text: 'text-cyan-700',
                },
                {
                  label: 'חוב/הכנסה',
                  value: computed.ratios.debtToIncome,
                  format: 'pct',
                  benchmark: 'יעד: <50%',
                  bg: 'bg-red-50',
                  border: 'border-red-200',
                  text: 'text-red-700',
                },
                {
                  label: 'כיסוי ריבית',
                  value: computed.ratios.interestCoverage,
                  format: 'ratio',
                  benchmark: 'יעד: >2.5',
                  bg: 'bg-orange-50',
                  border: 'border-orange-200',
                  text: 'text-orange-700',
                },
                {
                  label: 'צמיחה חודשית',
                  value: computed.ratios.monthlyIncomeGrowth,
                  format: 'pct',
                  benchmark: 'יעד: 5%+/חודש',
                  bg: 'bg-pink-50',
                  border: 'border-pink-200',
                  text: 'text-pink-700',
                },
              ].map((r) => {
                const value =
                  r.format === 'pct'
                    ? formatPercent(r.value, 1)
                    : `${r.value.toFixed(2)}x`;
                return (
                  <div
                    key={r.label}
                    className={`${r.bg} border-2 ${r.border} rounded-lg p-3`}
                  >
                    <div className="text-xs text-gray-600 mb-1">{r.label}</div>
                    <div className={`text-2xl font-bold ${r.text}`}>{value}</div>
                    <div className="text-[10px] text-gray-500 mt-1">{r.benchmark}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
