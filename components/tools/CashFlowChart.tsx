'use client';

import { useMemo } from 'react';
import { useTools } from '@/lib/tools/ToolsContext';
import { calculateCashFlow } from '@/lib/tools/cashflow-engine';
import { formatCurrency } from '@/lib/tools/format';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { LineChart as ChartIcon, BarChart3 } from 'lucide-react';
import { useState } from 'react';

type ChartView = 'balance' | 'flow';

export function CashFlowChart() {
  const { budget, cashFlow, settings } = useTools();
  const [view, setView] = useState<ChartView>('balance');

  const data = useMemo(() => {
    if (!budget || !cashFlow || !settings) return [];
    const monthly = calculateCashFlow(budget, cashFlow, settings);
    return monthly.map((m) => ({
      month: m.monthName,
      'יתרה': Math.round(m.closingBalance),
      'יתרת פתיחה': Math.round(m.openingBalance),
      'תקבולים': Math.round(m.incomeReceived),
      'תשלומים': -Math.round(m.expensesPaid),
      'תזרים נטו': Math.round(m.netCashFlow),
    }));
  }, [budget, cashFlow, settings]);

  if (!settings || data.length === 0) return null;

  const fmt = (v: number) => formatCurrency(v, settings.currency);

  return (
    <div className="bg-paper border-2 border-ink/15 shadow-sm overflow-hidden">
      <div className="bg-ink text-cream p-4 flex items-center justify-between">
        <div>
          <h3 className="font-bold text-lg flex items-center gap-2">
            <ChartIcon className="w-5 h-5" />
            ויזואליזציית תזרים
          </h3>
          <p className="text-sm text-cream/70">
            מגמת היתרה והתזרים החודשי לאורך התקופה
          </p>
        </div>
        <div className="flex bg-white/10 p-1">
          <button
            onClick={() => setView('balance')}
            className={`px-3 py-1 text-xs ${view === 'balance' ? 'bg-cream text-ink font-semibold' : 'text-cream'}`}
          >
            יתרת מזומנים
          </button>
          <button
            onClick={() => setView('flow')}
            className={`px-3 py-1 text-xs ${view === 'flow' ? 'bg-cream text-ink font-semibold' : 'text-cream'}`}
          >
            תזרים חודשי
          </button>
        </div>
      </div>

      <div className="p-4">
        <ResponsiveContainer width="100%" height={300}>
          {view === 'balance' ? (
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 5 }}>
              <defs>
                <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#102219" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#102219" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} reversed />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} orientation="right" />
              <Tooltip
                formatter={(value) => fmt(Number(value))}
                contentStyle={{ direction: 'rtl', textAlign: 'right' }}
              />
              <ReferenceLine y={0} stroke="#dc2626" strokeDasharray="4 4" />
              <Area
                type="monotone"
                dataKey="יתרה"
                stroke="#102219"
                strokeWidth={2}
                fill="url(#balanceGradient)"
              />
            </AreaChart>
          ) : (
            <BarChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} reversed />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} orientation="right" />
              <Tooltip
                formatter={(value) => fmt(Math.abs(Number(value)))}
                contentStyle={{ direction: 'rtl', textAlign: 'right' }}
              />
              <Legend wrapperStyle={{ direction: 'rtl' }} />
              <ReferenceLine y={0} stroke="#000" />
              <Bar dataKey="תקבולים" fill="#10b981" stackId="flow" />
              <Bar dataKey="תשלומים" fill="#ef4444" stackId="flow" />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
