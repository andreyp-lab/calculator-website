'use client';

import { useMemo, useState } from 'react';
import { useTools } from '@/lib/tools/ToolsContext';
import { calculateAllMonths, calculateBudgetTotals } from '@/lib/tools/budget-engine';
import {
  calculateSensitivity,
  calculateAllQuickScenarios,
  type SensitivityVariable,
  type SensitivityInput,
} from '@/lib/tools/sensitivity-financial';
import { formatCurrency } from '@/lib/tools/format';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from 'recharts';
import { Activity, Zap, TrendingDown, Percent, AlertTriangle } from 'lucide-react';

export function FinancialSensitivity() {
  const { budget, settings } = useTools();
  const [variable, setVariable] = useState<SensitivityVariable>('revenue');
  const [range, setRange] = useState(20);

  const input = useMemo((): SensitivityInput | null => {
    if (!budget || !settings) return null;
    const monthly = calculateAllMonths(budget, settings);
    const totals = calculateBudgetTotals(monthly);
    const annualPrincipal = budget.loans.reduce((sum, loan) => {
      const monthlyR = loan.annualRate / 100 / 12;
      const n = loan.termMonths;
      const monthlyPmt =
        monthlyR === 0
          ? loan.amount / n
          : (loan.amount * (monthlyR * Math.pow(1 + monthlyR, n))) / (Math.pow(1 + monthlyR, n) - 1);
      const totalPaid = monthlyPmt * 12;
      const interestPortion = loan.amount * (loan.annualRate / 100);
      return sum + Math.max(0, totalPaid - interestPortion);
    }, 0);

    return {
      revenue: totals.income,
      cogs: totals.cogs,
      opex: totals.rnd + totals.marketing + totals.operating,
      depreciation: 0,
      interestExpense: totals.financial,
      taxExpense: totals.tax,
      principalPayment: annualPrincipal,
    };
  }, [budget, settings]);

  const sensitivity = useMemo(() => {
    if (!input) return null;
    return calculateSensitivity(input, variable, range, 9);
  }, [input, variable, range]);

  const scenarios = useMemo(() => {
    if (!input) return null;
    return calculateAllQuickScenarios(input);
  }, [input]);

  if (!input || !sensitivity || !scenarios) {
    return <div className="bg-amber-50 border-2 border-amber-200 rounded-lg p-6 text-center">חסרים נתונים</div>;
  }

  const fmt = (v: number) => formatCurrency(v, settings?.currency ?? 'ILS');

  // Chart data
  const chartData = sensitivity.results.map((r) => ({
    change: `${r.changePercent > 0 ? '+' : ''}${r.changePercent.toFixed(0)}%`,
    DSCR: Number(r.dscr.toFixed(2)),
    'רווח נקי': Math.round(r.netProfit / 1000),
  }));

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white rounded-lg border-2 border-gray-200 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4">
          <h3 className="font-bold flex items-center gap-2">
            <Activity className="w-5 h-5" />
            ניתוח רגישות + תרחישים מהירים
          </h3>
          <p className="text-xs text-purple-100">
            בדיקת השפעה של שינויים על DSCR, רווחיות ויכולת החזר
          </p>
        </div>
      </div>

      {/* Quick Scenarios */}
      <div className="bg-white rounded-lg border-2 border-amber-200 shadow-sm overflow-hidden">
        <div className="bg-amber-600 text-white p-3">
          <h4 className="font-bold flex items-center gap-2">
            <Zap className="w-4 h-4" />
            תרחישים מהירים
          </h4>
        </div>
        <div className="p-4 grid md:grid-cols-2 gap-3">
          {scenarios.map((s, i) => (
            <ScenarioCard key={i} scenario={s} fmt={fmt} />
          ))}
        </div>
      </div>

      {/* Variable Sensitivity */}
      <div className="bg-white rounded-lg border-2 border-gray-200 shadow-sm overflow-hidden">
        <div className="bg-purple-600 text-white p-3">
          <h4 className="font-bold flex items-center gap-2">
            <TrendingDown className="w-4 h-4" />
            ניתוח רגישות חד-משתני
          </h4>
        </div>
        <div className="p-4 space-y-3">
          {/* Controls */}
          <div className="grid md:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs text-gray-700 mb-1">משתנה לבדיקה</label>
              <select
                value={variable}
                onChange={(e) => setVariable(e.target.value as SensitivityVariable)}
                className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
              >
                <option value="revenue">📈 הכנסות</option>
                <option value="cogs">🏭 עלות מכר</option>
                <option value="opex">💼 הוצאות תפעול</option>
                <option value="interest">💰 הוצאות ריבית</option>
                <option value="principalPayment">🏦 החזר חוב</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-700 mb-1">טווח שינוי (±%)</label>
              <select
                value={range}
                onChange={(e) => setRange(parseInt(e.target.value))}
                className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
              >
                <option value={10}>±10%</option>
                <option value={20}>±20%</option>
                <option value={30}>±30%</option>
                <option value={50}>±50%</option>
              </select>
            </div>
            <div className="flex items-end">
              <div className="w-full p-2 bg-purple-50 rounded text-center text-xs">
                <div className="text-gray-600">DSCR בסיס</div>
                <div className="text-xl font-bold text-purple-700">
                  {sensitivity.baseDSCR.toFixed(2)}
                </div>
              </div>
            </div>
          </div>

          {/* Break-Even Alert */}
          {sensitivity.breakEvenChange !== null && (
            <div className="bg-red-50 border border-red-300 rounded p-3 flex items-start gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold text-red-800">נקודת שבירה</div>
                <div className="text-sm text-red-700">
                  שינוי של {sensitivity.breakEvenChange.toFixed(1)}% ב{sensitivity.variableLabel}{' '}
                  מביא DSCR ל-1 — נקודת חוסר יכולת לשרת חוב
                </div>
              </div>
            </div>
          )}

          {/* Chart */}
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="change" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <ReferenceLine y={1} stroke="#dc2626" strokeDasharray="3 3" label="DSCR=1" />
              <ReferenceLine y={1.5} stroke="#10b981" strokeDasharray="3 3" label="DSCR=1.5" />
              <Line
                type="monotone"
                dataKey="DSCR"
                stroke="#7c3aed"
                strokeWidth={3}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 text-center">שינוי</th>
                  <th className="p-2 text-center">{sensitivity.variableLabel}</th>
                  <th className="p-2 text-center">EBITDA</th>
                  <th className="p-2 text-center">DSCR</th>
                  <th className="p-2 text-center">רווח נקי</th>
                  <th className="p-2 text-center">סטטוס</th>
                </tr>
              </thead>
              <tbody>
                {sensitivity.results.map((r, i) => {
                  const statusBg = {
                    excellent: 'bg-emerald-50',
                    good: 'bg-blue-50',
                    fair: 'bg-amber-50',
                    critical: 'bg-red-50',
                  }[r.status];
                  const statusText = {
                    excellent: 'מצוין',
                    good: 'טוב',
                    fair: 'גבולי',
                    critical: 'קריטי',
                  }[r.status];
                  return (
                    <tr key={i} className={`border-t border-gray-100 ${statusBg}`}>
                      <td className="p-2 text-center font-bold">
                        {r.changePercent > 0 ? '+' : ''}
                        {r.changePercent.toFixed(0)}%
                      </td>
                      <td className="p-2 text-center">{fmt(r.newValue)}</td>
                      <td className="p-2 text-center">{fmt(r.ebitda)}</td>
                      <td className="p-2 text-center font-bold">{r.dscr.toFixed(2)}</td>
                      <td className="p-2 text-center">{fmt(r.netProfit)}</td>
                      <td className="p-2 text-center text-xs font-semibold">{statusText}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Insights */}
          {sensitivity.insights.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded p-3">
              <ul className="text-sm text-blue-900 space-y-1">
                {sensitivity.insights.map((i, idx) => (
                  <li key={idx}>{i}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ScenarioCard({
  scenario,
  fmt,
}: {
  scenario: ReturnType<typeof calculateAllQuickScenarios>[0];
  fmt: (v: number) => string;
}) {
  const statusColor = {
    safe: 'emerald',
    tight: 'amber',
    critical: 'red',
  }[scenario.status];

  return (
    <div className={`bg-${statusColor}-50 border-2 border-${statusColor}-200 rounded-lg p-3`}>
      <h5 className={`font-semibold text-${statusColor}-900 mb-1`}>{scenario.name}</h5>
      <p className="text-xs text-gray-600 mb-2">{scenario.description}</p>
      <div className="grid grid-cols-3 gap-2 text-center text-xs mb-2">
        <div>
          <div className="text-gray-600">EBITDA</div>
          <div className="font-bold">{fmt(scenario.scenario.ebitda)}</div>
          <div className={`text-[10px] text-${scenario.changes_metrics.ebitdaChange >= 0 ? 'emerald' : 'red'}-700`}>
            {scenario.changes_metrics.ebitdaChange >= 0 ? '+' : ''}
            {scenario.changes_metrics.ebitdaChange.toFixed(1)}%
          </div>
        </div>
        <div>
          <div className="text-gray-600">רווח נקי</div>
          <div className="font-bold">{fmt(scenario.scenario.netProfit)}</div>
          <div className={`text-[10px] text-${scenario.changes_metrics.netProfitChange >= 0 ? 'emerald' : 'red'}-700`}>
            {scenario.changes_metrics.netProfitChange >= 0 ? '+' : ''}
            {scenario.changes_metrics.netProfitChange.toFixed(1)}%
          </div>
        </div>
        <div>
          <div className="text-gray-600">DSCR</div>
          <div className={`font-bold text-${statusColor}-700`}>
            {scenario.scenario.dscr.toFixed(2)}
          </div>
          <div className="text-[10px] text-gray-600">
            {scenario.canRepay ? '✓ יכול' : '✗ לא יכול'}
          </div>
        </div>
      </div>
      <div className={`text-xs text-${statusColor}-800`}>{scenario.recommendation}</div>
    </div>
  );
}
