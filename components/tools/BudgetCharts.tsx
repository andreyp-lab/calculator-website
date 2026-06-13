'use client';

import { useMemo, useState } from 'react';
import { useTools } from '@/lib/tools/ToolsContext';
import {
  calculateAllMonths,
  calculateIncomeTotal,
  calculateExpenseTotal,
} from '@/lib/tools/budget-engine';
import { formatCurrency } from '@/lib/tools/format';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
  Area,
} from 'recharts';
import {
  ChartPie,
  TrendingUp,
  BarChart3,
  ChartArea,
} from 'lucide-react';
import {
  EXPENSE_CATEGORY_LABELS,
  type ExpenseCategory,
} from '@/lib/tools/types';

const CATEGORY_PALETTE: Record<ExpenseCategory, string[]> = {
  cogs: ['#dc2626', '#ef4444', '#f87171', '#fca5a5', '#fecaca', '#fee2e2'],
  rnd: ['#102219', '#264B36', '#3a6b52', '#5a8b72', '#8ab0a0', '#c0d8d0'],
  marketing: ['#ea580c', '#f97316', '#fb923c', '#fdba74', '#fed7aa', '#ffedd5'],
  operating: ['#102219', '#8E6824', '#264B36', '#D8B36A', '#c0d8d0', '#f0e8d0'],
  financial: ['#264B36', '#102219', '#8E6824', '#5a8b72', '#D8B36A', '#c0d8d0'],
};

const INCOME_PALETTE = [
  '#059669',
  '#10b981',
  '#34d399',
  '#6ee7b7',
  '#a7f3d0',
  '#d1fae5',
];

const CATEGORY_HEADER_COLORS: Record<ExpenseCategory, string> = {
  cogs: 'bg-red-700',
  rnd: 'bg-ink',
  marketing: 'bg-orange-600',
  operating: 'bg-ink-deep',
  financial: 'bg-ink',
};

type View = 'overview' | 'distribution';

export function BudgetCharts() {
  const { budget, settings } = useTools();
  const [view, setView] = useState<View>('overview');

  const data = useMemo(() => {
    if (!budget || !settings) return null;
    const monthly = calculateAllMonths(budget, settings);

    // נתונים לגרף Income vs Profit + Cumulative
    let cumulative = 0;
    const overview = monthly.map((m) => {
      cumulative += m.netProfit;
      return {
        month: m.monthName,
        'הכנסות': Math.round(m.income),
        'רווח נקי': Math.round(m.netProfit),
        'רווח מצטבר': Math.round(cumulative),
      };
    });

    // התפלגות הכנסות
    const incomeDistribution = budget.income
      .map((inc) => ({
        name: inc.name,
        value: Math.round(calculateIncomeTotal(inc, settings.monthsToShow)),
      }))
      .filter((d) => d.value > 0);

    // התפלגות לכל קטגוריית הוצאות
    const expenseDistributions: Record<
      ExpenseCategory,
      Array<{ name: string; value: number }>
    > = {
      cogs: [],
      rnd: [],
      marketing: [],
      operating: [],
      financial: [],
    };

    for (const cat of Object.keys(EXPENSE_CATEGORY_LABELS) as ExpenseCategory[]) {
      expenseDistributions[cat] = budget.expenses
        .filter((e) => e.category === cat)
        .map((e) => ({
          name: e.name,
          value: Math.round(calculateExpenseTotal(e, budget.income, settings.monthsToShow)),
        }))
        .filter((d) => d.value > 0);
    }

    return {
      overview,
      incomeDistribution,
      expenseDistributions,
    };
  }, [budget, settings]);

  if (!data || !settings) return null;

  const fmt = (v: number) => formatCurrency(v, settings.currency);

  return (
    <div className="space-y-4">
      {/* Toggle */}
      <div className="bg-paper border-2 border-ink/15 p-3 shadow-sm flex items-center justify-between">
        <h3 className="font-bold text-ink flex items-center gap-2">
          <ChartArea className="w-5 h-5 text-gold" />
          גרפים פיננסיים
        </h3>
        <div className="flex gap-1">
          <button
            onClick={() => setView('overview')}
            className={`px-3 py-1.5 text-sm transition ${
              view === 'overview'
                ? 'bg-ink text-cream'
                : 'bg-cream-2 text-ink/70 hover:bg-paper-hover'
            }`}
          >
            מבט-על
          </button>
          <button
            onClick={() => setView('distribution')}
            className={`px-3 py-1.5 text-sm transition ${
              view === 'distribution'
                ? 'bg-ink text-cream'
                : 'bg-cream-2 text-ink/70 hover:bg-paper-hover'
            }`}
          >
            התפלגות
          </button>
        </div>
      </div>

      {view === 'overview' && (
        <>
          {/* Income vs Profit + Cumulative */}
          <div className="bg-paper border-2 border-ink/15 shadow-sm overflow-hidden">
            <div className="bg-ink text-cream p-3">
              <h3 className="font-bold flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                הכנסות מול רווח חודשי + רווח מצטבר
              </h3>
              <p className="text-xs text-cream/70">לאורך כל התקופה</p>
            </div>
            <div className="p-4">
              <ResponsiveContainer width="100%" height={320}>
                <ComposedChart data={data.overview}>
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
                  <Legend wrapperStyle={{ direction: 'rtl', fontSize: 11 }} />
                  <Bar dataKey="הכנסות" fill="#10b981" />
                  <Bar dataKey="רווח נקי" fill="#102219" />
                  <Line
                    type="monotone"
                    dataKey="רווח מצטבר"
                    stroke="#8E6824"
                    strokeWidth={3}
                    strokeDasharray="5 5"
                    dot={{ r: 4 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}

      {view === 'distribution' && (
        <>
          {/* Income Distribution */}
          {data.incomeDistribution.length > 0 && (
            <div className="bg-paper border-2 border-ink/15 shadow-sm overflow-hidden">
              <div className="bg-emerald-700 text-white p-3">
                <h3 className="font-bold flex items-center gap-2">
                  <ChartPie className="w-5 h-5" />
                  התפלגות הכנסות לפי מקור
                </h3>
              </div>
              <div className="p-4">
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie
                      data={data.incomeDistribution}
                      dataKey="value"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label={(e) => {
                        const total = data.incomeDistribution.reduce(
                          (s, d) => s + d.value,
                          0,
                        );
                        const pct = (e.value / total) * 100;
                        return pct > 5 ? `${pct.toFixed(0)}%` : '';
                      }}
                    >
                      {data.incomeDistribution.map((_, i) => (
                        <Cell key={i} fill={INCOME_PALETTE[i % INCOME_PALETTE.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(v) => fmt(Number(v))}
                      contentStyle={{ direction: 'rtl', textAlign: 'right' }}
                    />
                    <Legend wrapperStyle={{ direction: 'rtl', fontSize: 11 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Expense Pie Charts - 5 categories */}
          <div className="grid md:grid-cols-2 gap-4">
            {(Object.keys(EXPENSE_CATEGORY_LABELS) as ExpenseCategory[]).map((cat) => {
              const dist = data.expenseDistributions[cat];
              if (dist.length === 0) return null;

              return (
                <div
                  key={cat}
                  className="bg-paper border-2 border-ink/15 shadow-sm overflow-hidden"
                >
                  <div
                    className={`${CATEGORY_HEADER_COLORS[cat]} text-white p-3`}
                  >
                    <h3 className="font-bold flex items-center gap-2 text-sm">
                      <ChartPie className="w-4 h-4" />
                      {EXPENSE_CATEGORY_LABELS[cat]}
                    </h3>
                  </div>
                  <div className="p-3">
                    <ResponsiveContainer width="100%" height={220}>
                      <PieChart>
                        <Pie
                          data={dist}
                          dataKey="value"
                          cx="50%"
                          cy="50%"
                          outerRadius={75}
                          label={(e) => {
                            const total = dist.reduce((s, d) => s + d.value, 0);
                            const pct = (e.value / total) * 100;
                            return pct > 8 ? `${pct.toFixed(0)}%` : '';
                          }}
                        >
                          {dist.map((_, i) => (
                            <Cell
                              key={i}
                              fill={
                                CATEGORY_PALETTE[cat][i % CATEGORY_PALETTE[cat].length]
                              }
                            />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(v) => fmt(Number(v))}
                          contentStyle={{ direction: 'rtl', textAlign: 'right' }}
                        />
                        <Legend wrapperStyle={{ direction: 'rtl', fontSize: 10 }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
