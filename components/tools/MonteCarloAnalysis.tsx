'use client';

import { useState, useMemo } from 'react';
import {
  runMonteCarlo,
  buildPresetDistributions,
  type MonteCarloInput,
} from '@/lib/tools/monte-carlo';
import {
  defaultAssumptions,
  createEmptyAnnualStatements,
} from '@/lib/tools/three-statement-model';
import type {
  AnnualStatements,
  ForecastAssumptions,
  MonteCarloResult,
} from '@/lib/tools/types';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { Activity, Play, AlertCircle } from 'lucide-react';

export function MonteCarloAnalysis() {
  // נתוני שנת בסיס בסיסיים - ניתן להחליף ב-context
  const [revenue, setRevenue] = useState(2000000);
  const [grossMarginPct, setGrossMarginPct] = useState(40);
  const [opexPct, setOpexPct] = useState(25);
  const [growthPct, setGrowthPct] = useState(15);

  const [scenario, setScenario] = useState<'conservative' | 'moderate' | 'aggressive'>(
    'moderate',
  );
  const [iterations, setIterations] = useState(1000);
  const [metric, setMetric] = useState<'netProfit' | 'closingCash' | 'ebitda'>('netProfit');
  const [target, setTarget] = useState(0);
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<MonteCarloResult | null>(null);

  function buildBaseline(): { historical: AnnualStatements[]; assumptions: ForecastAssumptions } {
    const baseYear = createEmptyAnnualStatements(new Date().getFullYear() - 1);
    const cogs = revenue * (1 - grossMarginPct / 100);
    const grossProfit = revenue - cogs;
    const opex = revenue * (opexPct / 100);
    const ebitda = grossProfit - opex;
    baseYear.pnl = {
      revenue,
      cogs,
      grossProfit,
      rnd: opex * 0.2,
      marketing: opex * 0.4,
      operating: opex * 0.4,
      ebitda,
      depreciation: 0,
      ebit: ebitda,
      interest: 0,
      preTaxProfit: ebitda,
      tax: ebitda > 0 ? ebitda * 0.23 : 0,
      netProfit: ebitda > 0 ? ebitda * 0.77 : ebitda,
    };
    // מאזן בסיסי מינימלי
    baseYear.balanceSheet = {
      ...baseYear.balanceSheet,
      cash: revenue * 0.15,
      accountsReceivable: revenue * 0.15,
      inventory: cogs * 0.1,
      fixedAssets: revenue * 0.2,
      totalAssets: revenue * 0.6,
      accountsPayable: cogs * 0.15,
      shortTermDebt: 0,
      longTermDebt: revenue * 0.1,
      totalLiabilities: revenue * 0.25,
      shareCapital: revenue * 0.2,
      retainedEarnings: revenue * 0.15,
      totalEquity: revenue * 0.35,
    };

    const assumptions = defaultAssumptions(3);
    assumptions.revenueGrowthPct = [growthPct, growthPct, growthPct];
    assumptions.grossMarginPct = [grossMarginPct, grossMarginPct, grossMarginPct];
    assumptions.operatingPctOfRevenue = [opexPct * 0.4, opexPct * 0.4, opexPct * 0.4];

    return { historical: [baseYear], assumptions };
  }

  async function run() {
    setRunning(true);
    setResult(null);
    // לתת לדפדפן זמן לעדכן UI
    await new Promise((r) => setTimeout(r, 50));

    try {
      const { historical, assumptions } = buildBaseline();
      const distributions = buildPresetDistributions(scenario, assumptions);
      const input: MonteCarloInput = {
        baseHistorical: historical,
        baseAssumptions: assumptions,
        distributions,
        iterations,
        metric,
        target,
      };
      const r = runMonteCarlo(input);
      setResult(r);
    } catch (e) {
      console.error(e);
    } finally {
      setRunning(false);
    }
  }

  const fmt = (v: number) =>
    Math.abs(v) > 1000000
      ? `${(v / 1000000).toFixed(2)}M`
      : Math.abs(v) > 1000
        ? `${(v / 1000).toFixed(0)}K`
        : v.toFixed(0);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white rounded-lg border-2 border-gray-200 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4">
          <h3 className="font-bold flex items-center gap-2">
            <Activity className="w-5 h-5" />
            סימולציית מונטה קרלו
          </h3>
          <p className="text-xs text-purple-100">
            הערכה הסתברותית - אלפי תרחישים אקראיים
          </p>
        </div>

        <div className="p-4 space-y-4">
          {/* Baseline inputs */}
          <div>
            <h4 className="font-semibold text-sm mb-2">נתוני שנת בסיס</h4>
            <div className="grid md:grid-cols-4 gap-3">
              <Field label="הכנסות שנתיות" value={revenue} onChange={setRevenue} />
              <Field label="מרווח גולמי %" value={grossMarginPct} onChange={setGrossMarginPct} />
              <Field label="OpEx %" value={opexPct} onChange={setOpexPct} />
              <Field label="צמיחה %" value={growthPct} onChange={setGrowthPct} />
            </div>
          </div>

          {/* Simulation parameters */}
          <div>
            <h4 className="font-semibold text-sm mb-2">פרמטרי סימולציה</h4>
            <div className="grid md:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs text-gray-700 mb-1">תרחיש</label>
                <select
                  value={scenario}
                  onChange={(e) => setScenario(e.target.value as typeof scenario)}
                  className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
                >
                  <option value="conservative">שמרני (טווח צר)</option>
                  <option value="moderate">מתון</option>
                  <option value="aggressive">אגרסיבי (טווח רחב)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-700 mb-1">איטרציות</label>
                <select
                  value={iterations}
                  onChange={(e) => setIterations(parseInt(e.target.value))}
                  className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
                >
                  <option value={500}>500 (מהיר)</option>
                  <option value={1000}>1,000</option>
                  <option value={5000}>5,000 (מדויק)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-700 mb-1">מדד</label>
                <select
                  value={metric}
                  onChange={(e) => setMetric(e.target.value as typeof metric)}
                  className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
                >
                  <option value="netProfit">רווח נקי (שנה 3)</option>
                  <option value="closingCash">יתרת מזומן (שנה 3)</option>
                  <option value="ebitda">EBITDA (שנה 3)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-700 mb-1">יעד (לסיכוי)</label>
                <input
                  type="number"
                  value={target}
                  onChange={(e) => setTarget(parseFloat(e.target.value) || 0)}
                  className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
                />
              </div>
            </div>
          </div>

          <button
            onClick={run}
            disabled={running}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center gap-2"
          >
            <Play className="w-4 h-4" />
            {running ? 'מריץ...' : 'הרץ סימולציה'}
          </button>
        </div>
      </div>

      {/* Results */}
      {result && (
        <div className="bg-white rounded-lg border-2 border-gray-200 shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white p-3">
            <h3 className="font-bold">תוצאות ({result.iterations.toLocaleString()} איטרציות)</h3>
          </div>

          <div className="p-4">
            {/* Stats grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
              <StatCard label="ממוצע" value={fmt(result.stats.mean)} color="blue" />
              <StatCard label="חציון" value={fmt(result.stats.median)} color="indigo" />
              <StatCard label="סטיית תקן" value={fmt(result.stats.stdDev)} color="purple" />
              <StatCard
                label="סיכוי לרווח"
                value={`${(result.probabilityPositive * 100).toFixed(1)}%`}
                color={result.probabilityPositive > 0.7 ? 'emerald' : 'amber'}
              />
              <StatCard label="P5 (גרוע)" value={fmt(result.stats.p5)} color="red" />
              <StatCard label="P25" value={fmt(result.stats.p25)} color="orange" />
              <StatCard label="P75" value={fmt(result.stats.p75)} color="green" />
              <StatCard label="P95 (אופטימי)" value={fmt(result.stats.p95)} color="emerald" />
            </div>

            {result.probabilityAboveTarget !== undefined && (
              <div className="bg-blue-50 border border-blue-200 rounded p-3 mb-4 text-sm">
                <strong>סיכוי לחצות יעד {fmt(target)}:</strong>{' '}
                <span className="text-blue-700 font-bold">
                  {(result.probabilityAboveTarget * 100).toFixed(1)}%
                </span>
              </div>
            )}

            {/* Histogram */}
            <h4 className="font-semibold text-sm mb-2">התפלגות תוצאות</h4>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={result.histogram}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="bucket"
                  tickFormatter={(v) => fmt(v)}
                  tick={{ fontSize: 10 }}
                />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip
                  formatter={(v) => [v, 'תרחישים']}
                  labelFormatter={(v) => `ערך: ${fmt(Number(v))}`}
                />
                <Bar dataKey="count" fill="#a855f7" />
                <ReferenceLine x={result.stats.mean} stroke="#3b82f6" strokeDasharray="5 5" label="ממוצע" />
                <ReferenceLine x={result.stats.p5} stroke="#dc2626" strokeDasharray="3 3" label="P5" />
                <ReferenceLine x={result.stats.p95} stroke="#10b981" strokeDasharray="3 3" label="P95" />
              </BarChart>
            </ResponsiveContainer>

            <div className="mt-3 text-xs text-gray-600">
              💡 P5 = "גרוע מ-95% מהתרחישים", P95 = "טוב מ-95%". טווח P5-P95 = "טווח אמון 90%".
            </div>
          </div>
        </div>
      )}

      {!result && !running && (
        <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-6 text-center text-purple-900">
          <AlertCircle className="w-10 h-10 mx-auto mb-2 text-purple-500" />
          <p className="text-sm">הזן נתוני בסיס ולחץ "הרץ סימולציה" כדי לראות התפלגות תוצאות.</p>
        </div>
      )}
    </div>
  );
}

function Field({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <div>
      <label className="block text-xs text-gray-700 mb-1">{label}</label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
      />
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: string; color: string }) {
  const colorMap: Record<string, { bg: string; text: string }> = {
    blue: { bg: 'bg-blue-50', text: 'text-blue-700' },
    indigo: { bg: 'bg-indigo-50', text: 'text-indigo-700' },
    purple: { bg: 'bg-purple-50', text: 'text-purple-700' },
    emerald: { bg: 'bg-emerald-50', text: 'text-emerald-700' },
    amber: { bg: 'bg-amber-50', text: 'text-amber-700' },
    red: { bg: 'bg-red-50', text: 'text-red-700' },
    orange: { bg: 'bg-orange-50', text: 'text-orange-700' },
    green: { bg: 'bg-green-50', text: 'text-green-700' },
  };
  const c = colorMap[color] ?? colorMap.blue;
  return (
    <div className={`${c.bg} rounded-lg p-2 text-center border border-gray-200`}>
      <div className="text-[10px] text-gray-600 mb-0.5">{label}</div>
      <div className={`text-lg font-bold ${c.text}`}>{value}</div>
    </div>
  );
}
