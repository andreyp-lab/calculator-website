'use client';

import { useMemo } from 'react';
import { useTools } from '@/lib/tools/ToolsContext';
import { formatCurrency } from '@/lib/tools/format';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { Users } from 'lucide-react';
import type { Department } from '@/lib/tools/types';

const DEPARTMENT_LABELS: Record<Department, string> = {
  sales: 'מכירות',
  marketing: 'שיווק',
  development: 'פיתוח',
  operations: 'תפעול',
  administration: 'אדמיניסטרציה',
};

const DEPARTMENT_COLORS: Record<Department, string> = {
  sales: '#102219',
  marketing: '#f59e0b',
  development: '#10b981',
  operations: '#8E6824',
  administration: '#ef4444',
};

export function EmployeeAnalysis() {
  const { budget, settings } = useTools();

  const analysis = useMemo(() => {
    if (!budget || !settings || budget.employees.length === 0) return null;
    const byDept = new Map<Department, { count: number; monthlyCost: number; periodCost: number }>();

    for (const employee of budget.employees) {
      const current = byDept.get(employee.department) ?? {
        count: 0,
        monthlyCost: 0,
        periodCost: 0,
      };
      const finalMonth = Math.min(
        employee.endMonth ?? settings.monthsToShow - 1,
        settings.monthsToShow - 1,
      );
      const duration = Math.max(0, finalMonth - employee.startMonth + 1);
      current.count += 1;
      current.monthlyCost += employee.monthlySalary;
      current.periodCost += employee.monthlySalary * duration;
      byDept.set(employee.department, current);
    }

    const departments = Array.from(byDept.entries());
    return {
      departments,
      totalCount: budget.employees.length,
      totalPeriodCost: departments.reduce((sum, [, dept]) => sum + dept.periodCost, 0),
    };
  }, [budget, settings]);

  if (!analysis || !settings) return null;
  const fmt = (value: number) => formatCurrency(value, settings.currency);
  const distributionData = analysis.departments.map(([department, data]) => ({
    name: DEPARTMENT_LABELS[department],
    value: data.count,
    color: DEPARTMENT_COLORS[department],
  }));

  return (
    <div className="space-y-4">
      <div className="bg-paper border-2 border-ink/15 p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Users className="w-5 h-5 text-gold" />
          <h3 className="font-bold text-lg text-ink">ניתוח עלויות מעסיק</h3>
          <span className="text-sm text-ink/70">({analysis.totalCount} עובדים)</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-cream-2">
              <tr>
                <th className="text-right px-3 py-2">מחלקה</th>
                <th className="text-center px-3 py-2">עובדים</th>
                <th className="text-right px-3 py-2">עלות מעסיק חודשית</th>
                <th className="text-right px-3 py-2">עלות בתקופה</th>
              </tr>
            </thead>
            <tbody>
              {analysis.departments.map(([department, data]) => (
                <tr key={department} className="border-b border-ink/10">
                  <td className="px-3 py-2 font-medium">{DEPARTMENT_LABELS[department]}</td>
                  <td className="px-3 py-2 text-center">{data.count}</td>
                  <td className="px-3 py-2">{fmt(data.monthlyCost)}</td>
                  <td className="px-3 py-2">{fmt(data.periodCost)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-cream-2 font-bold">
              <tr>
                <td className="px-3 py-2">סה&quot;כ</td>
                <td className="px-3 py-2 text-center">{analysis.totalCount}</td>
                <td className="px-3 py-2">—</td>
                <td className="px-3 py-2">{fmt(analysis.totalPeriodCost)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <div className="bg-paper border-2 border-ink/15 p-4 shadow-sm">
        <h4 className="font-semibold text-ink mb-2 text-sm">חלוקת עובדים לפי מחלקה</h4>
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie data={distributionData} dataKey="value" cx="50%" cy="50%" outerRadius={80} label={(entry) => entry.name}>
              {distributionData.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-cream-2 border border-ink/15 p-3 text-xs text-ink">
        הנתונים מציגים עלויות שהוזנו בלבד. אין ייחוס שרירותי של הכנסות או תפוקה למחלקות.
      </div>
    </div>
  );
}
