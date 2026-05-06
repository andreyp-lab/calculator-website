'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { SoloCashFlowManager } from '@/components/tools/SoloCashFlowManager';
import {
  calculateSoloCashFlow,
  createEmptySoloData,
  getCategoryBreakdown,
  INCOME_CATEGORY_LABELS,
  EXPENSE_CATEGORY_LABELS,
} from '@/lib/tools/solo-cashflow-engine';
import type { SoloCashFlowData, BankAccount } from '@/lib/tools/types';
import { formatCurrency } from '@/lib/tools/format';
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ReferenceLine,
} from 'recharts';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  Plus,
  Trash2,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';

const STORAGE_KEY = 'solo-cashflow-v1';

const CATEGORY_COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4', '#ef4444', '#84cc16'];

export default function CashFlowSoloPage() {
  const [data, setData] = useState<SoloCashFlowData>(() => {
    if (typeof window === 'undefined') return createEmptySoloData();
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch {}
    return createEmptySoloData();
  });

  // Auto-save
  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const monthly = useMemo(() => calculateSoloCashFlow(data), [data]);
  const incomeBreakdown = useMemo(() => getCategoryBreakdown(data, 'in'), [data]);
  const expenseBreakdown = useMemo(() => getCategoryBreakdown(data, 'out'), [data]);

  const fmt = (v: number) => formatCurrency(v, data.currency);
  const fmtCompact = (v: number) => {
    const abs = Math.abs(v);
    if (abs >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`;
    if (abs >= 1_000) return `${(v / 1_000).toFixed(0)}K`;
    return v.toFixed(0);
  };

  // KPIs
  const totalIn = monthly.reduce((s, m) => s + m.incomeReceived, 0);
  const totalOut = monthly.reduce((s, m) => s + m.expensesPaid, 0);
  const netFlow = totalIn - totalOut;
  const finalBalance = monthly.length > 0 ? monthly[monthly.length - 1].closingBalance : 0;
  const minBalance = monthly.length > 0 ? Math.min(...monthly.map((m) => m.closingBalance)) : 0;
  const negativeMonths = monthly.filter((m) => m.closingBalance < 0).length;

  // Bank accounts management
  function addAccount() {
    const newAccount: BankAccount = {
      id: Math.random().toString(36).slice(2, 10),
      name: `חשבון ${data.accounts.length + 1}`,
      balance: 0,
      asOfDate: new Date().toISOString().split('T')[0],
    };
    setData({ ...data, accounts: [...data.accounts, newAccount] });
  }

  function updateAccount(id: string, updates: Partial<BankAccount>) {
    setData({
      ...data,
      accounts: data.accounts.map((a) => (a.id === id ? { ...a, ...updates } : a)),
    });
  }

  function removeAccount(id: string) {
    setData({ ...data, accounts: data.accounts.filter((a) => a.id !== id) });
  }

  // Chart data
  const chartData = monthly.map((m) => ({
    month: m.monthName.replace(/\s\d{4}$/, ''), // remove year for compactness
    תקבולים: Math.round(m.incomeReceived),
    תשלומים: -Math.round(m.expensesPaid),
    'יתרה מצטברת': Math.round(m.closingBalance),
  }));

  const incomePieData = incomeBreakdown.map((b, i) => ({
    name: INCOME_CATEGORY_LABELS[b.category as keyof typeof INCOME_CATEGORY_LABELS] ?? b.category,
    value: Math.round(b.total),
    color: CATEGORY_COLORS[i % CATEGORY_COLORS.length],
  }));

  const expensePieData = expenseBreakdown.map((b, i) => ({
    name:
      EXPENSE_CATEGORY_LABELS[b.category as keyof typeof EXPENSE_CATEGORY_LABELS] ?? b.category,
    value: Math.round(b.total),
    color: CATEGORY_COLORS[i % CATEGORY_COLORS.length],
  }));

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-100 p-3 rounded-lg">
            <Wallet className="w-6 h-6 text-emerald-700" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">תזרים מזומנים סולו</h2>
            <p className="text-sm text-gray-600">
              תזרים ללא תקציב - הזן ישירות תקבולים ותשלומים לפי תאריכים
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Link
            href="/tools/start"
            className="text-sm text-gray-600 hover:text-blue-600 flex items-center gap-1"
          >
            <ArrowLeft className="w-4 h-4" />
            חזרה למסך הראשי
          </Link>
          <Link
            href="/tools/unified"
            className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 text-sm flex items-center gap-1"
          >
            <Sparkles className="w-4 h-4" />
            עבור למערכת מלאה
          </Link>
        </div>
      </div>

      {/* Settings */}
      <div className="bg-white border-2 border-gray-200 rounded-lg p-4 mb-4 shadow-sm">
        <div className="grid md:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs text-gray-700 mb-1">תאריך התחלה</label>
            <input
              type="date"
              value={data.startDate}
              onChange={(e) => setData({ ...data, startDate: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-700 mb-1">חודשים לחיזוי</label>
            <select
              value={data.monthsToProject}
              onChange={(e) => setData({ ...data, monthsToProject: parseInt(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value={3}>3 חודשים</option>
              <option value={6}>6 חודשים</option>
              <option value={12}>12 חודשים</option>
              <option value={18}>18 חודשים</option>
              <option value={24}>24 חודשים</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-700 mb-1">מטבע</label>
            <select
              value={data.currency}
              onChange={(e) =>
                setData({ ...data, currency: e.target.value as SoloCashFlowData['currency'] })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="ILS">₪ שקל</option>
              <option value="USD">$ דולר</option>
              <option value="EUR">€ אירו</option>
              <option value="GBP">£ פאונד</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bank Accounts */}
      <div className="bg-white border-2 border-gray-200 rounded-lg p-4 mb-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-900">חשבונות בנק (יתרת פתיחה)</h3>
          <button
            onClick={addAccount}
            className="px-2 py-1 bg-emerald-600 text-white rounded text-xs flex items-center gap-1 hover:bg-emerald-700"
          >
            <Plus className="w-3 h-3" />
            הוסף חשבון
          </button>
        </div>
        {data.accounts.length === 0 ? (
          <p className="text-sm text-gray-500">אין חשבונות. הוסף חשבון לקביעת יתרת פתיחה.</p>
        ) : (
          <div className="space-y-2">
            {data.accounts.map((acc) => (
              <div key={acc.id} className="flex gap-2 items-center">
                <input
                  type="text"
                  value={acc.name}
                  onChange={(e) => updateAccount(acc.id, { name: e.target.value })}
                  placeholder="שם חשבון"
                  className="flex-1 px-2 py-1.5 border border-gray-300 rounded text-sm"
                />
                <input
                  type="number"
                  value={acc.balance || ''}
                  onChange={(e) =>
                    updateAccount(acc.id, { balance: parseFloat(e.target.value) || 0 })
                  }
                  placeholder="יתרה"
                  className="w-32 px-2 py-1.5 border border-gray-300 rounded text-sm text-left"
                />
                <button
                  onClick={() => removeAccount(acc.id)}
                  className="p-1 text-red-600 hover:bg-red-50 rounded"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            <div className="text-xs text-gray-600 text-left pt-2 border-t">
              סה"כ פתיחה: {fmt(data.accounts.reduce((s, a) => s + a.balance, 0))}
            </div>
          </div>
        )}
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
        <KPICard
          label="תקבולים צפויים"
          value={fmtCompact(totalIn)}
          color="emerald"
          icon={TrendingUp}
        />
        <KPICard
          label="תשלומים צפויים"
          value={fmtCompact(totalOut)}
          color="red"
          icon={TrendingDown}
        />
        <KPICard
          label="תזרים נטו"
          value={fmtCompact(netFlow)}
          color={netFlow >= 0 ? 'emerald' : 'red'}
          icon={Wallet}
        />
        <KPICard
          label="יתרת סיום"
          value={fmtCompact(finalBalance)}
          subValue={
            negativeMonths > 0 ? `⚠️ ${negativeMonths} חודשים שליליים` : '✓ יציב'
          }
          color={finalBalance >= 0 ? 'blue' : 'red'}
          icon={Wallet}
        />
        <KPICard
          label="יתרה מינימלית"
          value={fmtCompact(minBalance)}
          color={minBalance >= 0 ? 'emerald' : 'red'}
          icon={AlertTriangle}
        />
      </div>

      {/* Items Manager */}
      <div className="mb-4">
        <SoloCashFlowManager data={data} onChange={setData} />
      </div>

      {/* Chart */}
      {monthly.length > 0 && data.items.length > 0 && (
        <div className="bg-white border-2 border-gray-200 rounded-lg shadow-sm overflow-hidden mb-4">
          <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-3">
            <h3 className="font-bold flex items-center gap-2">
              <Wallet className="w-5 h-5" />
              תזרים חודשי + יתרה מצטברת
            </h3>
          </div>
          <div className="p-4">
            <ResponsiveContainer width="100%" height={320}>
              <ComposedChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" reversed />
                <YAxis tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} orientation="right" />
                <Tooltip
                  formatter={(v) => fmt(Math.abs(Number(v)))}
                  contentStyle={{ direction: 'rtl', textAlign: 'right' }}
                />
                <Legend wrapperStyle={{ direction: 'rtl', fontSize: 11 }} />
                <ReferenceLine y={0} stroke="#dc2626" strokeWidth={1.5} />
                <Bar dataKey="תקבולים" fill="#10b981" />
                <Bar dataKey="תשלומים" fill="#ef4444" />
                <Line
                  type="monotone"
                  dataKey="יתרה מצטברת"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Distributions */}
      {(incomePieData.length > 0 || expensePieData.length > 0) && (
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          {incomePieData.length > 0 && (
            <div className="bg-white border-2 border-gray-200 rounded-lg shadow-sm overflow-hidden">
              <div className="bg-emerald-600 text-white p-3 text-sm font-bold">
                התפלגות תקבולים
              </div>
              <div className="p-3">
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={incomePieData}
                      dataKey="value"
                      cx="50%"
                      cy="50%"
                      outerRadius={90}
                      label={(e: any) => {
                        const total = incomePieData.reduce((s, d) => s + d.value, 0);
                        const pct = total > 0 ? (e.value / total) * 100 : 0;
                        return pct > 5 ? `${pct.toFixed(0)}%` : '';
                      }}
                    >
                      {incomePieData.map((d, i) => (
                        <Cell key={i} fill={d.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v) => fmt(Number(v))} />
                    <Legend wrapperStyle={{ fontSize: 10 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {expensePieData.length > 0 && (
            <div className="bg-white border-2 border-gray-200 rounded-lg shadow-sm overflow-hidden">
              <div className="bg-red-600 text-white p-3 text-sm font-bold">
                התפלגות תשלומים
              </div>
              <div className="p-3">
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={expensePieData}
                      dataKey="value"
                      cx="50%"
                      cy="50%"
                      outerRadius={90}
                      label={(e: any) => {
                        const total = expensePieData.reduce((s, d) => s + d.value, 0);
                        const pct = total > 0 ? (e.value / total) * 100 : 0;
                        return pct > 5 ? `${pct.toFixed(0)}%` : '';
                      }}
                    >
                      {expensePieData.map((d, i) => (
                        <Cell key={i} fill={d.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v) => fmt(Number(v))} />
                    <Legend wrapperStyle={{ fontSize: 10 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Monthly Table */}
      {monthly.length > 0 && data.items.length > 0 && (
        <div className="bg-white border-2 border-gray-200 rounded-lg shadow-sm overflow-x-auto mb-4">
          <div className="bg-gray-700 text-white p-3 text-sm font-bold">טבלת תזרים חודשית</div>
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-right p-2">חודש</th>
                <th className="text-left p-2">פתיחה</th>
                <th className="text-left p-2">תקבולים</th>
                <th className="text-left p-2">תשלומים</th>
                <th className="text-left p-2">תזרים נטו</th>
                <th className="text-left p-2">יתרת סיום</th>
              </tr>
            </thead>
            <tbody>
              {monthly.map((m, i) => (
                <tr
                  key={i}
                  className={`border-t border-gray-100 ${
                    m.closingBalance < 0 ? 'bg-red-50' : i % 2 === 0 ? '' : 'bg-gray-50'
                  }`}
                >
                  <td className="p-2 font-medium">{m.monthName}</td>
                  <td className="p-2 text-left">{fmt(m.openingBalance)}</td>
                  <td className="p-2 text-left text-emerald-700">+{fmt(m.incomeReceived)}</td>
                  <td className="p-2 text-left text-red-700">-{fmt(m.expensesPaid)}</td>
                  <td
                    className={`p-2 text-left font-semibold ${
                      m.netCashFlow >= 0 ? 'text-emerald-700' : 'text-red-700'
                    }`}
                  >
                    {m.netCashFlow >= 0 ? '+' : ''}
                    {fmt(m.netCashFlow)}
                  </td>
                  <td
                    className={`p-2 text-left font-bold ${
                      m.closingBalance >= 0 ? 'text-blue-700' : 'text-red-700'
                    }`}
                  >
                    {fmt(m.closingBalance)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-900">
        <p className="font-semibold mb-1">💡 רוצה יותר?</p>
        <p>
          עבור ל
          <Link href="/tools/unified" className="underline mx-1 font-medium">
            מערכת מלאה
          </Link>
          לקבלת ניתוח דוחות, יחסים פיננסיים, חיזוי 5 שנים, הערכת שווי DCF ועוד 30+ כלים. הנתונים יישמרו.
        </p>
      </div>
    </div>
  );
}

function KPICard({
  label,
  value,
  subValue,
  color,
  icon: Icon,
}: {
  label: string;
  value: string;
  subValue?: string;
  color: 'emerald' | 'red' | 'blue';
  icon: typeof TrendingUp;
}) {
  const colorMap: Record<string, { bg: string; border: string; text: string }> = {
    emerald: { bg: 'bg-emerald-50', border: 'border-emerald-300', text: 'text-emerald-700' },
    red: { bg: 'bg-red-50', border: 'border-red-300', text: 'text-red-700' },
    blue: { bg: 'bg-blue-50', border: 'border-blue-300', text: 'text-blue-700' },
  };
  const c = colorMap[color];
  return (
    <div className={`${c.bg} ${c.border} border-2 rounded-lg p-3`}>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-gray-700">{label}</span>
        <Icon className={`w-4 h-4 ${c.text}`} />
      </div>
      <div className={`text-2xl font-bold ${c.text}`}>{value}</div>
      {subValue && <div className="text-[10px] text-gray-600 mt-1">{subValue}</div>}
    </div>
  );
}
