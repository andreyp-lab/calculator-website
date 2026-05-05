'use client';

import { useMemo } from 'react';
import { useTools } from '@/lib/tools/ToolsContext';
import { formatCurrency } from '@/lib/tools/format';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { PieChart as PieIcon } from 'lucide-react';

const COLORS = [
  '#3b82f6', // blue
  '#10b981', // emerald
  '#f59e0b', // amber
  '#ef4444', // red
  '#8b5cf6', // violet
  '#ec4899', // pink
  '#06b6d4', // cyan
  '#f97316', // orange
  '#84cc16', // lime
  '#6366f1', // indigo
];

export function CashFlowDistributionCharts() {
  const { budget, cashFlow, settings } = useTools();

  const incomeData = useMemo(() => {
    if (!budget) return [];
    return budget.income
      .filter((i) => i.amount > 0)
      .map((i) => ({
        name: i.name,
        value: i.amount * i.duration,
      }));
  }, [budget]);

  const expensesData = useMemo(() => {
    if (!budget || !cashFlow) return [];

    const breakdown: Record<string, number> = {
      'הוצאות תפעוליות': 0,
      'שכר עובדים': 0,
      'הלוואות': 0,
      'ספקים': 0,
      'רשויות': 0,
      'שיקים': 0,
      'אשראי': 0,
      'אחר': 0,
    };

    // הוצאות מהתקציב
    for (const exp of budget.expenses) {
      const total = exp.amount * exp.duration;
      breakdown['הוצאות תפעוליות'] += total;
    }

    // עובדים
    for (const emp of budget.employees) {
      const months = emp.endMonth ? emp.endMonth - emp.startMonth : 12;
      breakdown['שכר עובדים'] += emp.monthlySalary * months;
    }

    // הלוואות
    for (const loan of budget.loans) {
      const monthlyR = loan.annualRate / 100 / 12;
      const monthlyPmt =
        monthlyR === 0
          ? loan.amount / loan.termMonths
          : (loan.amount * (monthlyR * Math.pow(1 + monthlyR, loan.termMonths))) /
            (Math.pow(1 + monthlyR, loan.termMonths) - 1);
      const annualPmt = monthlyPmt * Math.min(12, loan.termMonths);
      breakdown['הלוואות'] += annualPmt;
    }

    // הוצאות מפורטות (CashFlow customExpenses)
    for (const exp of cashFlow.customExpenses) {
      const multiplier =
        exp.frequency === 'monthly'
          ? 12
          : exp.frequency === 'quarterly'
            ? 4
            : exp.frequency === 'yearly'
              ? 1
              : 1;
      const total = exp.amount * multiplier;

      const catLabels: Record<string, string> = {
        supplier: 'ספקים',
        authority: 'רשויות',
        check: 'שיקים',
        creditcard: 'אשראי',
        loan: 'הלוואות',
        employee: 'שכר עובדים',
        other: 'אחר',
      };
      const cat = catLabels[exp.category] ?? 'אחר';
      breakdown[cat] = (breakdown[cat] ?? 0) + total;
    }

    return Object.entries(breakdown)
      .filter(([, v]) => v > 0)
      .map(([name, value]) => ({ name, value }));
  }, [budget, cashFlow]);

  if (!settings) return null;
  const fmt = (v: number) => formatCurrency(v, settings.currency);

  if (incomeData.length === 0 && expensesData.length === 0) {
    return null;
  }

  const totalIncome = incomeData.reduce((s, d) => s + d.value, 0);
  const totalExpenses = expensesData.reduce((s, d) => s + d.value, 0);

  return (
    <div className="grid md:grid-cols-2 gap-4">
      {/* התפלגות הכנסות */}
      <div className="bg-white rounded-lg border-2 border-gray-200 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-emerald-600 to-green-600 text-white p-3">
          <h3 className="font-bold flex items-center gap-2">
            <PieIcon className="w-5 h-5" />
            התפלגות הכנסות לפי מקור
          </h3>
          <p className="text-xs text-emerald-100">סה"כ: {fmt(totalIncome)}</p>
        </div>
        <div className="p-3">
          {incomeData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={incomeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                  label={(entry) => {
                    const pct = (entry.value / totalIncome) * 100;
                    return pct > 5 ? `${pct.toFixed(0)}%` : '';
                  }}
                >
                  {incomeData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(v) => fmt(Number(v))}
                  contentStyle={{ direction: 'rtl', textAlign: 'right' }}
                />
                <Legend
                  wrapperStyle={{ direction: 'rtl', fontSize: 11 }}
                  formatter={(v) => v}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[280px] flex items-center justify-center text-gray-400 text-sm">
              אין הכנסות להציג
            </div>
          )}
        </div>
      </div>

      {/* התפלגות הוצאות */}
      <div className="bg-white rounded-lg border-2 border-gray-200 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-red-600 to-rose-600 text-white p-3">
          <h3 className="font-bold flex items-center gap-2">
            <PieIcon className="w-5 h-5" />
            התפלגות הוצאות לפי קטגוריה
          </h3>
          <p className="text-xs text-red-100">סה"כ: {fmt(totalExpenses)}</p>
        </div>
        <div className="p-3">
          {expensesData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={expensesData}
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  dataKey="value"
                  label={(entry) => {
                    const pct = (entry.value / totalExpenses) * 100;
                    return pct > 5 ? `${pct.toFixed(0)}%` : '';
                  }}
                >
                  {expensesData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(v) => fmt(Number(v))}
                  contentStyle={{ direction: 'rtl', textAlign: 'right' }}
                />
                <Legend
                  wrapperStyle={{ direction: 'rtl', fontSize: 11 }}
                  formatter={(v) => v}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[280px] flex items-center justify-center text-gray-400 text-sm">
              אין הוצאות להציג
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
