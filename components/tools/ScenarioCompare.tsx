'use client';

import { useMemo, useState } from 'react';
import { useTools } from '@/lib/tools/ToolsContext';
import { calculateCashFlow, calculateCashFlowKPIs } from '@/lib/tools/cashflow-engine';
import { formatCurrency } from '@/lib/tools/format';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { GitCompare, ArrowLeftRight } from 'lucide-react';

export function ScenarioCompare() {
  const { scenario, scenarioId, scenariosList, getScenarioById, settings } = useTools();
  const [compareId, setCompareId] = useState<string>('');

  const compareScenario = compareId ? getScenarioById(compareId) : null;

  const data = useMemo(() => {
    if (!scenario || !settings || !compareScenario) return null;

    const currentMonthly = calculateCashFlow(scenario.budget, scenario.cashFlow, settings);
    const compareMonthly = calculateCashFlow(
      compareScenario.budget,
      compareScenario.cashFlow,
      compareScenario.settings,
    );

    const currentKPIs = calculateCashFlowKPIs(currentMonthly);
    const compareKPIs = calculateCashFlowKPIs(compareMonthly);

    // Combine for charts
    const balanceData = currentMonthly.map((m, i) => ({
      month: m.monthName,
      [scenario.name]: Math.round(m.closingBalance),
      [compareScenario.name]: Math.round(compareMonthly[i]?.closingBalance ?? 0),
    }));

    const flowData = currentMonthly.map((m, i) => ({
      month: m.monthName,
      [scenario.name]: Math.round(m.netCashFlow),
      [compareScenario.name]: Math.round(compareMonthly[i]?.netCashFlow ?? 0),
    }));

    return {
      currentKPIs,
      compareKPIs,
      balanceData,
      flowData,
    };
  }, [scenario, compareScenario, settings]);

  const otherScenarios = scenariosList.filter((s) => s.id !== scenarioId);

  if (!settings || !scenario) return null;

  const fmt = (v: number) => formatCurrency(v, settings.currency);

  const diffClass = (v: number) => (v >= 0 ? 'text-emerald-700' : 'text-red-700');
  const diffPrefix = (v: number) => (v >= 0 ? '+' : '');

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg border-2 border-gray-200 p-4">
        <div className="flex items-center gap-2 mb-3">
          <GitCompare className="w-5 h-5 text-purple-600" />
          <h3 className="font-bold text-base text-gray-900">השוואת תרחישים</h3>
        </div>

        {otherScenarios.length === 0 ? (
          <div className="bg-amber-50 border border-amber-200 rounded p-3 text-sm text-amber-900">
            ⚠️ אין תרחיש נוסף להשוואה. צור תרחיש נוסף ב-ScenarioBar למעלה.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="md:col-span-2">
              <label className="block text-xs text-gray-700 mb-1">בחר תרחיש להשוואה:</label>
              <select
                value={compareId}
                onChange={(e) => setCompareId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
              >
                <option value="">— בחר תרחיש —</option>
                {otherScenarios.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-end gap-2">
              <div className="flex-1 bg-blue-50 border border-blue-200 rounded p-2 text-xs">
                <div className="text-blue-700">תרחיש נוכחי:</div>
                <div className="font-bold text-blue-900">{scenario.name}</div>
              </div>
              <ArrowLeftRight className="w-5 h-5 text-purple-600 flex-shrink-0" />
              {compareScenario && (
                <div className="flex-1 bg-purple-50 border border-purple-200 rounded p-2 text-xs">
                  <div className="text-purple-700">משווה ל:</div>
                  <div className="font-bold text-purple-900">{compareScenario.name}</div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {data && compareScenario && (
        <>
          {/* KPI Comparison Table */}
          <div className="bg-white rounded-lg border-2 border-gray-200 shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-3">
              <h3 className="font-bold">השוואת מדדים מרכזיים</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-right px-3 py-2">מדד</th>
                    <th className="text-right px-3 py-2 text-blue-700">{scenario.name}</th>
                    <th className="text-right px-3 py-2 text-purple-700">{compareScenario.name}</th>
                    <th className="text-right px-3 py-2">הפרש</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    {
                      label: 'יתרת פתיחה',
                      a: data.currentKPIs.currentCash,
                      b: data.compareKPIs.currentCash,
                    },
                    {
                      label: 'סך תקבולים',
                      a: data.currentKPIs.totalInflow,
                      b: data.compareKPIs.totalInflow,
                    },
                    {
                      label: 'סך תשלומים',
                      a: data.currentKPIs.totalOutflow,
                      b: data.compareKPIs.totalOutflow,
                      reverse: true, // הוצאה גבוהה יותר היא רעה
                    },
                    {
                      label: 'תזרים נטו',
                      a: data.currentKPIs.netCashFlow,
                      b: data.compareKPIs.netCashFlow,
                    },
                    {
                      label: 'יתרת סיום',
                      a: data.currentKPIs.closingBalance,
                      b: data.compareKPIs.closingBalance,
                    },
                    {
                      label: 'יתרה מינימלית',
                      a: data.currentKPIs.minBalance,
                      b: data.compareKPIs.minBalance,
                    },
                  ].map((row, i) => {
                    const diff = row.a - row.b;
                    const isGood = row.reverse ? diff < 0 : diff > 0;
                    return (
                      <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="px-3 py-2 font-medium">{row.label}</td>
                        <td className="px-3 py-2">{fmt(row.a)}</td>
                        <td className="px-3 py-2">{fmt(row.b)}</td>
                        <td className={`px-3 py-2 font-bold ${isGood ? 'text-emerald-700' : 'text-red-700'}`}>
                          {diff >= 0 ? '+' : ''}
                          {fmt(diff)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Balance Comparison Chart */}
          <div className="bg-white rounded-lg border-2 border-gray-200 shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-3">
              <h3 className="font-bold">השוואת יתרות לאורך זמן</h3>
            </div>
            <div className="p-4">
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={data.balanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} reversed />
                  <YAxis
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`}
                    orientation="right"
                  />
                  <Tooltip
                    formatter={(v) => fmt(Number(v))}
                    contentStyle={{ direction: 'rtl', textAlign: 'right' }}
                  />
                  <Legend wrapperStyle={{ direction: 'rtl' }} />
                  <ReferenceLine y={0} stroke="#dc2626" strokeDasharray="4 4" />
                  <Line
                    type="monotone"
                    dataKey={scenario.name}
                    stroke="#3b82f6"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey={compareScenario.name}
                    stroke="#a855f7"
                    strokeWidth={3}
                    strokeDasharray="5 5"
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Flow Comparison Chart */}
          <div className="bg-white rounded-lg border-2 border-gray-200 shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-600 to-green-600 text-white p-3">
              <h3 className="font-bold">השוואת תזרים נטו חודשי</h3>
            </div>
            <div className="p-4">
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={data.flowData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} reversed />
                  <YAxis
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`}
                    orientation="right"
                  />
                  <Tooltip
                    formatter={(v) => fmt(Number(v))}
                    contentStyle={{ direction: 'rtl', textAlign: 'right' }}
                  />
                  <Legend wrapperStyle={{ direction: 'rtl' }} />
                  <ReferenceLine y={0} stroke="#000" />
                  <Line
                    type="monotone"
                    dataKey={scenario.name}
                    stroke="#10b981"
                    strokeWidth={3}
                  />
                  <Line
                    type="monotone"
                    dataKey={compareScenario.name}
                    stroke="#f59e0b"
                    strokeWidth={3}
                    strokeDasharray="5 5"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
