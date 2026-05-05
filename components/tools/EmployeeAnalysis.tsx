'use client';

import { useMemo } from 'react';
import { useTools } from '@/lib/tools/ToolsContext';
import { calculateAllMonths, calculateBudgetTotals } from '@/lib/tools/budget-engine';
import { formatCurrency } from '@/lib/tools/format';
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
import { Users, TrendingUp } from 'lucide-react';
import type { Department } from '@/lib/tools/types';

const DEPARTMENT_LABELS: Record<Department, string> = {
  sales: 'מכירות',
  marketing: 'שיווק',
  development: 'פיתוח',
  operations: 'תפעול',
  administration: 'אדמיניסטרציה',
};

const DEPARTMENT_COLORS: Record<Department, string> = {
  sales: '#3b82f6',
  marketing: '#f59e0b',
  development: '#10b981',
  operations: '#8b5cf6',
  administration: '#ef4444',
};

// אחוזי השקעה משוערים בהכנסות לפי מחלקה
const REVENUE_ATTRIBUTION: Record<Department, number> = {
  sales: 0.4,
  marketing: 0.3,
  development: 0.2,
  operations: 0.1,
  administration: 0,
};

export function EmployeeAnalysis() {
  const { budget, settings } = useTools();

  const analysis = useMemo(() => {
    if (!budget || !settings) return null;
    if (budget.employees.length === 0) return null;

    const monthly = calculateAllMonths(budget, settings);
    const totals = calculateBudgetTotals(monthly);
    const totalIncome = totals.income;

    // קיבוץ לפי מחלקות
    const byDept: Record<Department, {
      count: number;
      monthlyCost: number;
      annualCost: number;
      revenue: number;
      efficiency: number;
    }> = {
      sales: { count: 0, monthlyCost: 0, annualCost: 0, revenue: 0, efficiency: 0 },
      marketing: { count: 0, monthlyCost: 0, annualCost: 0, revenue: 0, efficiency: 0 },
      development: { count: 0, monthlyCost: 0, annualCost: 0, revenue: 0, efficiency: 0 },
      operations: { count: 0, monthlyCost: 0, annualCost: 0, revenue: 0, efficiency: 0 },
      administration: { count: 0, monthlyCost: 0, annualCost: 0, revenue: 0, efficiency: 0 },
    };

    for (const emp of budget.employees) {
      const dept = byDept[emp.department];
      dept.count++;
      const months = emp.endMonth ?? settings.monthsToShow - 1;
      const duration = Math.max(0, Math.min(months, settings.monthsToShow - 1) - emp.startMonth + 1);
      dept.monthlyCost += emp.monthlySalary;
      dept.annualCost += emp.monthlySalary * duration;
    }

    // הקצאת הכנסות + יחס יעילות
    let totalEmployeeCost = 0;
    for (const dept of Object.keys(byDept) as Department[]) {
      byDept[dept].revenue = totalIncome * REVENUE_ATTRIBUTION[dept];
      byDept[dept].efficiency =
        byDept[dept].annualCost > 0 ? byDept[dept].revenue / byDept[dept].annualCost : 0;
      totalEmployeeCost += byDept[dept].annualCost;
    }

    const totalCount = budget.employees.length;
    const otherCosts = totals.totalExpenses - totalEmployeeCost;
    const profit = totalIncome - totals.totalExpenses;

    return {
      byDept,
      totalCount,
      totalEmployeeCost,
      otherCosts,
      profit,
      totalIncome,
    };
  }, [budget, settings]);

  if (!analysis || !settings) return null;

  const fmt = (v: number) => formatCurrency(v, settings.currency);

  const activeDepts = (Object.entries(analysis.byDept) as [Department, typeof analysis.byDept[Department]][])
    .filter(([, d]) => d.count > 0);

  // Department distribution data
  const distributionData = activeDepts.map(([dept, d]) => ({
    name: DEPARTMENT_LABELS[dept],
    value: d.count,
    color: DEPARTMENT_COLORS[dept],
  }));

  // Efficiency data
  const efficiencyData = activeDepts.map(([dept, d]) => ({
    name: DEPARTMENT_LABELS[dept],
    efficiency: Number(d.efficiency.toFixed(2)),
    color: DEPARTMENT_COLORS[dept],
  }));

  // Cost vs Revenue
  const costRevenueData = [
    {
      name: 'עלויות עובדים',
      value: Math.max(0, analysis.totalEmployeeCost),
      color: '#3b82f6',
    },
    {
      name: 'עלויות אחרות',
      value: Math.max(0, analysis.otherCosts),
      color: '#ef4444',
    },
    {
      name: 'רווח',
      value: Math.max(0, analysis.profit),
      color: '#10b981',
    },
  ].filter((d) => d.value > 0);

  function getEfficiencyClass(eff: number) {
    if (eff > 1.5) return 'bg-emerald-100 text-emerald-800 border-emerald-300';
    if (eff > 0.8) return 'bg-amber-100 text-amber-800 border-amber-300';
    if (eff > 0) return 'bg-red-100 text-red-800 border-red-300';
    return 'bg-gray-100 text-gray-800 border-gray-300';
  }

  function getEfficiencyLabel(eff: number) {
    if (eff > 1.5) return 'גבוה';
    if (eff > 0.8) return 'בינוני';
    if (eff > 0) return 'נמוך';
    return '—';
  }

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg border-2 border-gray-200 p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Users className="w-5 h-5 text-purple-600" />
          <h3 className="font-bold text-lg text-gray-900">ניתוח עובדים</h3>
          <span className="text-sm text-gray-500">({analysis.totalCount} עובדים)</span>
        </div>

        {/* טבלת סיכום */}
        <div className="overflow-x-auto mb-4">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-right px-3 py-2">מחלקה</th>
                <th className="text-center px-3 py-2">עובדים</th>
                <th className="text-right px-3 py-2">עלות חודשית</th>
                <th className="text-right px-3 py-2">עלות שנתית</th>
                <th className="text-right px-3 py-2">תרומה להכנסות</th>
                <th className="text-center px-3 py-2">יעילות</th>
              </tr>
            </thead>
            <tbody>
              {activeDepts.map(([dept, d]) => (
                <tr key={dept} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-3 py-2 font-medium" style={{ color: DEPARTMENT_COLORS[dept] }}>
                    {DEPARTMENT_LABELS[dept]}
                  </td>
                  <td className="px-3 py-2 text-center">{d.count}</td>
                  <td className="px-3 py-2">{fmt(d.monthlyCost)}</td>
                  <td className="px-3 py-2">{fmt(d.annualCost)}</td>
                  <td className="px-3 py-2 text-emerald-700">{fmt(d.revenue)}</td>
                  <td className="px-3 py-2 text-center">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-xs border ${getEfficiencyClass(
                        d.efficiency,
                      )}`}
                    >
                      {getEfficiencyLabel(d.efficiency)} ({d.efficiency.toFixed(2)}x)
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-purple-50 font-bold">
              <tr>
                <td className="px-3 py-2">סה"כ</td>
                <td className="px-3 py-2 text-center">{analysis.totalCount}</td>
                <td className="px-3 py-2">{fmt(analysis.totalEmployeeCost / 12)}</td>
                <td className="px-3 py-2">{fmt(analysis.totalEmployeeCost)}</td>
                <td className="px-3 py-2 text-emerald-700">{fmt(analysis.totalIncome)}</td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* גרפים */}
      <div className="grid md:grid-cols-3 gap-4">
        {/* Distribution */}
        <div className="bg-white rounded-lg border-2 border-gray-200 p-4 shadow-sm">
          <h4 className="font-semibold text-gray-900 mb-2 text-sm">חלוקת עובדים</h4>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={distributionData}
                dataKey="value"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={(e) => e.name}
              >
                {distributionData.map((d, i) => (
                  <Cell key={i} fill={d.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Efficiency */}
        <div className="bg-white rounded-lg border-2 border-gray-200 p-4 shadow-sm">
          <h4 className="font-semibold text-gray-900 mb-2 text-sm">יחס יעילות (הכנסות/עלות)</h4>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={efficiencyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v) => `${v}x`} />
              <Bar dataKey="efficiency" fill="#8b5cf6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Cost Structure */}
        <div className="bg-white rounded-lg border-2 border-gray-200 p-4 shadow-sm">
          <h4 className="font-semibold text-gray-900 mb-2 text-sm">מבנה עלויות</h4>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={costRevenueData}
                dataKey="value"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={(e) => `${((Number(e.value) / analysis.totalIncome) * 100).toFixed(0)}%`}
              >
                {costRevenueData.map((d, i) => (
                  <Cell key={i} fill={d.color} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => fmt(Number(v))} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded p-3 text-xs text-blue-900">
        💡 <strong>הערה:</strong> תרומת ההכנסות מבוססת על אחוזי הקצאה מקובלים: מכירות 40%,
        שיווק 30%, פיתוח 20%, תפעול 10%. ניתן להתאים זאת לעסק שלך.
      </div>
    </div>
  );
}
