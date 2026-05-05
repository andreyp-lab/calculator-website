'use client';

import { useState, useMemo } from 'react';
import {
  simulateCapTable,
  calculateExitWaterfall,
  createSampleCapTable,
} from '@/lib/tools/cap-table-engine';
import type {
  Shareholder,
  FundingRound,
  CapTableSnapshot,
  ShareClass,
} from '@/lib/tools/types';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Plus, Trash2, Users, Briefcase, DollarSign, Sparkles } from 'lucide-react';

const STORAGE_KEY = 'cap-table-v1';

const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4', '#ef4444', '#84cc16', '#a855f7'];

const SHARE_CLASS_LABELS: Record<ShareClass, string> = {
  common: 'Common',
  esop: 'ESOP Pool',
  preferred_seed: 'Preferred Seed',
  preferred_a: 'Preferred A',
  preferred_b: 'Preferred B',
  preferred_c: 'Preferred C',
};

function genId() {
  return Math.random().toString(36).slice(2, 9);
}

export function CapTable() {
  const [snapshot, setSnapshot] = useState<CapTableSnapshot>(() => {
    if (typeof window === 'undefined') return createSampleCapTable();
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch {}
    return createSampleCapTable();
  });

  const [exitValue, setExitValue] = useState(50000000);

  function update(next: CapTableSnapshot) {
    setSnapshot(next);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    }
  }

  const state = useMemo(() => simulateCapTable(snapshot), [snapshot]);
  const waterfall = useMemo(() => calculateExitWaterfall(snapshot, exitValue), [snapshot, exitValue]);

  const finalState = state.perRound[state.perRound.length - 1];

  function addFounder() {
    update({
      ...snapshot,
      initialShareholders: [
        ...snapshot.initialShareholders,
        {
          id: genId(),
          name: `מייסד ${snapshot.initialShareholders.length + 1}`,
          shareClass: 'common',
          shares: 1000000,
          isFounder: true,
        },
      ],
    });
  }

  function updateFounder(id: string, patch: Partial<Shareholder>) {
    update({
      ...snapshot,
      initialShareholders: snapshot.initialShareholders.map((s) =>
        s.id === id ? { ...s, ...patch } : s,
      ),
    });
  }

  function removeFounder(id: string) {
    update({
      ...snapshot,
      initialShareholders: snapshot.initialShareholders.filter((s) => s.id !== id),
    });
  }

  function addRound() {
    const nextNum = snapshot.rounds.length;
    const classes: ShareClass[] = ['preferred_seed', 'preferred_a', 'preferred_b', 'preferred_c'];
    update({
      ...snapshot,
      rounds: [
        ...snapshot.rounds,
        {
          id: genId(),
          name: `Round ${nextNum + 1}`,
          shareClass: classes[Math.min(nextNum, classes.length - 1)],
          preMoneyValuation: 10000000 * (nextNum + 1),
          investmentAmount: 2000000 * (nextNum + 1),
          investorName: `Investor ${nextNum + 1}`,
          esopPoolPct: 5,
          esopPrePostMoney: 'pre',
          liquidationPreference: 1,
          participating: false,
        },
      ],
    });
  }

  function updateRound(id: string, patch: Partial<FundingRound>) {
    update({
      ...snapshot,
      rounds: snapshot.rounds.map((r) => (r.id === id ? { ...r, ...patch } : r)),
    });
  }

  function removeRound(id: string) {
    update({
      ...snapshot,
      rounds: snapshot.rounds.filter((r) => r.id !== id),
    });
  }

  const fmt = (v: number) =>
    Math.abs(v) > 1000000 ? `${(v / 1000000).toFixed(2)}M` : Math.abs(v) > 1000 ? `${(v / 1000).toFixed(0)}K` : v.toFixed(0);

  // Chart data
  const dilutionChart = state.perRound.map((round) => {
    const row: Record<string, string | number> = { round: round.afterRound };
    for (const sh of round.shareholders) {
      row[sh.name] = Number(sh.ownershipPct.toFixed(2));
    }
    return row;
  });

  const allShareholderNames = Array.from(
    new Set(state.perRound.flatMap((r) => r.shareholders.map((s) => s.name))),
  );

  const finalDistribution = finalState?.shareholders.map((sh, i) => ({
    name: sh.name,
    value: Number(sh.ownershipPct.toFixed(2)),
    color: COLORS[i % COLORS.length],
  })) ?? [];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white rounded-lg border-2 border-gray-200 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white p-4">
          <h3 className="font-bold flex items-center gap-2">
            <Briefcase className="w-5 h-5" />
            Cap Table - דילול וסבבי גיוס
          </h3>
          <p className="text-xs text-purple-100">
            סימולציה של דילול בעלי מניות לאורך סבבי גיוס + Exit Waterfall
          </p>
        </div>
      </div>

      {/* KPI Summary */}
      {finalState && (
        <div className="grid md:grid-cols-3 gap-3">
          <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-3">
            <div className="text-xs text-gray-600">סה"כ מניות (לאחר דילול)</div>
            <div className="text-2xl font-bold text-purple-700">
              {fmt(finalState.totalShares)}
            </div>
          </div>
          <div className="bg-fuchsia-50 border-2 border-fuchsia-200 rounded-lg p-3">
            <div className="text-xs text-gray-600">Post-Money (סבב אחרון)</div>
            <div className="text-2xl font-bold text-fuchsia-700">
              {fmt(finalState.postMoneyValuation)}
            </div>
          </div>
          <div className="bg-pink-50 border-2 border-pink-200 rounded-lg p-3">
            <div className="text-xs text-gray-600">מחיר למניה</div>
            <div className="text-2xl font-bold text-pink-700">
              ₪{finalState.pricePerShare.toFixed(2)}
            </div>
          </div>
        </div>
      )}

      {/* Founders */}
      <div className="bg-white rounded-lg border-2 border-gray-200 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between p-3 bg-gray-50 border-b">
          <h4 className="font-semibold text-gray-900 flex items-center gap-2">
            <Users className="w-4 h-4" />
            בעלי מניות התחלתיים (מייסדים)
          </h4>
          <button
            onClick={addFounder}
            className="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 flex items-center gap-1"
          >
            <Plus className="w-3 h-3" />
            הוסף מייסד
          </button>
        </div>
        <div className="p-3 space-y-2">
          {snapshot.initialShareholders.map((s) => (
            <div key={s.id} className="flex items-center gap-2 p-2 bg-blue-50 rounded">
              <input
                type="text"
                value={s.name}
                onChange={(e) => updateFounder(s.id, { name: e.target.value })}
                className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
              />
              <span className="text-xs text-gray-500">מניות:</span>
              <input
                type="number"
                value={s.shares}
                onChange={(e) => updateFounder(s.id, { shares: parseInt(e.target.value) || 0 })}
                className="w-32 px-2 py-1 border border-gray-300 rounded text-sm"
              />
              <button
                onClick={() => removeFounder(s.id)}
                className="p-1 text-red-600 hover:bg-red-100 rounded"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Funding Rounds */}
      <div className="bg-white rounded-lg border-2 border-gray-200 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between p-3 bg-gray-50 border-b">
          <h4 className="font-semibold text-gray-900 flex items-center gap-2">
            <DollarSign className="w-4 h-4" />
            סבבי גיוס ({snapshot.rounds.length})
          </h4>
          <button
            onClick={addRound}
            className="px-2 py-1 bg-purple-600 text-white text-xs rounded hover:bg-purple-700 flex items-center gap-1"
          >
            <Plus className="w-3 h-3" />
            הוסף סבב
          </button>
        </div>
        <div className="p-3 space-y-3">
          {snapshot.rounds.map((round, i) => (
            <div key={round.id} className="bg-purple-50 border border-purple-200 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="bg-purple-600 text-white text-xs px-2 py-0.5 rounded">
                    סבב {i + 1}
                  </span>
                  <input
                    type="text"
                    value={round.name}
                    onChange={(e) => updateRound(round.id, { name: e.target.value })}
                    className="px-2 py-0.5 border border-gray-300 rounded text-sm font-semibold"
                  />
                </div>
                <button
                  onClick={() => removeRound(round.id)}
                  className="p-1 text-red-600 hover:bg-red-100 rounded"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="grid md:grid-cols-3 gap-2 text-xs">
                <div>
                  <label className="block text-gray-700 mb-0.5">סוג מניות</label>
                  <select
                    value={round.shareClass}
                    onChange={(e) => updateRound(round.id, { shareClass: e.target.value as ShareClass })}
                    className="w-full px-2 py-1 border border-gray-300 rounded"
                  >
                    {(Object.keys(SHARE_CLASS_LABELS) as ShareClass[])
                      .filter((c) => c !== 'common' && c !== 'esop')
                      .map((c) => (
                        <option key={c} value={c}>{SHARE_CLASS_LABELS[c]}</option>
                      ))}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 mb-0.5">משקיע</label>
                  <input
                    type="text"
                    value={round.investorName}
                    onChange={(e) => updateRound(round.id, { investorName: e.target.value })}
                    className="w-full px-2 py-1 border border-gray-300 rounded"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-0.5">Pre-Money Valuation</label>
                  <input
                    type="number"
                    value={round.preMoneyValuation}
                    onChange={(e) => updateRound(round.id, { preMoneyValuation: parseFloat(e.target.value) || 0 })}
                    className="w-full px-2 py-1 border border-gray-300 rounded"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-0.5">השקעה</label>
                  <input
                    type="number"
                    value={round.investmentAmount}
                    onChange={(e) => updateRound(round.id, { investmentAmount: parseFloat(e.target.value) || 0 })}
                    className="w-full px-2 py-1 border border-gray-300 rounded"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-0.5">ESOP Pool % (post-funding)</label>
                  <input
                    type="number"
                    value={round.esopPoolPct ?? 0}
                    onChange={(e) => updateRound(round.id, { esopPoolPct: parseFloat(e.target.value) || 0 })}
                    className="w-full px-2 py-1 border border-gray-300 rounded"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-0.5">ESOP Pre/Post</label>
                  <select
                    value={round.esopPrePostMoney ?? 'pre'}
                    onChange={(e) => updateRound(round.id, { esopPrePostMoney: e.target.value as 'pre' | 'post' })}
                    className="w-full px-2 py-1 border border-gray-300 rounded"
                  >
                    <option value="pre">Pre-money (מדולל את המייסדים)</option>
                    <option value="post">Post-money (כל אחד)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 mb-0.5">Liquidation Preference (×)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={round.liquidationPreference ?? 1}
                    onChange={(e) => updateRound(round.id, { liquidationPreference: parseFloat(e.target.value) || 1 })}
                    className="w-full px-2 py-1 border border-gray-300 rounded"
                  />
                </div>
                <div className="flex items-end">
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={round.participating ?? false}
                      onChange={(e) => updateRound(round.id, { participating: e.target.checked })}
                      className="w-3.5 h-3.5"
                    />
                    <span>Participating Preferred</span>
                  </label>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cap Table per round */}
      <div className="bg-white rounded-lg border-2 border-gray-200 shadow-sm overflow-x-auto">
        <div className="bg-indigo-600 text-white p-2 text-sm font-bold">
          טבלת אחזקות לפי סבב
        </div>
        <table className="w-full text-xs">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-right p-2">בעל מניות</th>
              {state.perRound.map((r) => (
                <th key={r.afterRound} className="text-center p-2">
                  {r.afterRound}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {allShareholderNames.map((name) => (
              <tr key={name} className="border-t border-gray-100">
                <td className="p-2 font-medium">{name}</td>
                {state.perRound.map((r) => {
                  const sh = r.shareholders.find((s) => s.name === name);
                  return (
                    <td key={r.afterRound} className="p-2 text-center">
                      {sh ? `${sh.ownershipPct.toFixed(1)}%` : '—'}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Final distribution + Dilution chart */}
      <div className="grid md:grid-cols-2 gap-3">
        <div className="bg-white rounded-lg border-2 border-gray-200 shadow-sm overflow-hidden">
          <div className="bg-blue-600 text-white p-2 text-sm font-bold">פיזור סופי</div>
          <div className="p-3">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={finalDistribution}
                  dataKey="value"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  label={(e: any) => (e.value > 3 ? `${e.value.toFixed(0)}%` : '')}
                >
                  {finalDistribution.map((d, i) => (
                    <Cell key={i} fill={d.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => `${v}%`} />
                <Legend wrapperStyle={{ direction: 'rtl', fontSize: 10 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-lg border-2 border-gray-200 shadow-sm overflow-hidden">
          <div className="bg-emerald-600 text-white p-2 text-sm font-bold">
            דילול לאורך סבבים
          </div>
          <div className="p-3">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={dilutionChart}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="round" tick={{ fontSize: 9 }} />
                <YAxis unit="%" tick={{ fontSize: 9 }} />
                <Tooltip formatter={(v) => `${v}%`} />
                <Legend wrapperStyle={{ fontSize: 9 }} />
                {allShareholderNames.map((name, i) => (
                  <Bar
                    key={name}
                    dataKey={name}
                    stackId="a"
                    fill={COLORS[i % COLORS.length]}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Exit Waterfall */}
      <div className="bg-white rounded-lg border-2 border-gray-200 shadow-sm overflow-hidden">
        <div className="bg-amber-600 text-white p-3">
          <h3 className="font-bold flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            Exit Waterfall - חלוקה ביציאה
          </h3>
          <p className="text-xs text-amber-100">איך מתחלק כסף יציאה לפי liquidation preferences</p>
        </div>
        <div className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <label className="text-sm font-medium">ערך יציאה:</label>
            <input
              type="number"
              value={exitValue}
              onChange={(e) => setExitValue(parseFloat(e.target.value) || 0)}
              className="px-2 py-1 border border-gray-300 rounded text-sm w-40"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="text-right p-2">בעל מניות</th>
                  <th className="text-center p-2">Liquidation Pref</th>
                  <th className="text-center p-2">Pro-Rata</th>
                  <th className="text-center p-2 font-bold">סה"כ קבלה</th>
                  <th className="text-center p-2">% מהיציאה</th>
                </tr>
              </thead>
              <tbody>
                {waterfall.payouts.map((p, i) => (
                  <tr key={i} className="border-t border-gray-100">
                    <td className="p-2 font-medium">{p.shareholderName}</td>
                    <td className="p-2 text-center">{fmt(p.preferenceAmount)}</td>
                    <td className="p-2 text-center">{fmt(p.proRataAmount)}</td>
                    <td className="p-2 text-center font-bold text-emerald-700">
                      {fmt(p.totalAmount)}
                    </td>
                    <td className="p-2 text-center text-purple-700">
                      {p.sharePct.toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-amber-50 font-bold">
                <tr>
                  <td className="p-2">סה"כ</td>
                  <td className="p-2 text-center">
                    {fmt(waterfall.payouts.reduce((s, p) => s + p.preferenceAmount, 0))}
                  </td>
                  <td className="p-2 text-center">
                    {fmt(waterfall.payouts.reduce((s, p) => s + p.proRataAmount, 0))}
                  </td>
                  <td className="p-2 text-center text-emerald-700">{fmt(exitValue)}</td>
                  <td className="p-2 text-center">100%</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
