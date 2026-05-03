'use client';

import { useMemo } from 'react';
import { useTools } from '@/lib/tools/ToolsContext';
import { calculateCashFlow, generateCashFlowInsights } from '@/lib/tools/cashflow-engine';
import { formatCurrency } from '@/lib/tools/format';
import { AlertTriangle, CheckCircle2, AlertCircle, Info } from 'lucide-react';

export function CashFlowTable() {
  const { budget, cashFlow, settings } = useTools();

  const data = useMemo(() => {
    if (!budget || !cashFlow || !settings) return null;
    const monthly = calculateCashFlow(budget, cashFlow, settings);
    const insights = generateCashFlowInsights(monthly);
    return { monthly, insights };
  }, [budget, cashFlow, settings]);

  if (!data || !settings) return null;

  const fmt = (v: number) => formatCurrency(v, settings.currency);

  return (
    <div className="space-y-4">
      {/* Insights */}
      {data.insights.length > 0 && (
        <div className="space-y-2">
          {data.insights.map((insight, i) => {
            const Icon =
              insight.type === 'critical'
                ? AlertCircle
                : insight.type === 'warning'
                  ? AlertTriangle
                  : insight.type === 'success'
                    ? CheckCircle2
                    : Info;
            const colorClass =
              insight.type === 'critical'
                ? 'bg-red-50 border-red-300 text-red-900'
                : insight.type === 'warning'
                  ? 'bg-amber-50 border-amber-300 text-amber-900'
                  : insight.type === 'success'
                    ? 'bg-green-50 border-green-300 text-green-900'
                    : 'bg-blue-50 border-blue-300 text-blue-900';
            return (
              <div
                key={i}
                className={`border-2 rounded-lg p-3 flex items-start gap-3 ${colorClass}`}
              >
                <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold">{insight.title}</h4>
                  <p className="text-sm">{insight.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-lg border-2 border-gray-200 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-4">
          <h3 className="font-bold text-lg">תזרים מזומנים חודשי</h3>
          <p className="text-sm text-blue-100">
            {data.monthly.length} חודשים | יתרת פתיחה: {fmt(settings.openingBalance)}
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-right px-3 py-2">חודש</th>
                <th className="text-right px-3 py-2">יתרת פתיחה</th>
                <th className="text-right px-3 py-2">תקבולים</th>
                <th className="text-right px-3 py-2">תשלומים</th>
                <th className="text-right px-3 py-2">תזרים נטו</th>
                <th className="text-right px-3 py-2">יתרת סגירה</th>
              </tr>
            </thead>
            <tbody>
              {data.monthly.map((m, i) => {
                const isNegative = m.closingBalance < 0;
                return (
                  <tr
                    key={i}
                    className={`border-b border-gray-100 hover:bg-gray-50 ${
                      isNegative ? 'bg-red-50' : ''
                    }`}
                  >
                    <td className="px-3 py-2 font-medium">{m.monthName}</td>
                    <td
                      className={`px-3 py-2 ${
                        m.openingBalance < 0 ? 'text-red-600' : ''
                      }`}
                    >
                      {fmt(m.openingBalance)}
                    </td>
                    <td className="px-3 py-2 text-green-700">
                      {fmt(m.incomeReceived)}
                    </td>
                    <td className="px-3 py-2 text-red-600">
                      ({fmt(m.expensesPaid)})
                    </td>
                    <td
                      className={`px-3 py-2 font-medium ${
                        m.netCashFlow < 0 ? 'text-red-700' : 'text-green-700'
                      }`}
                    >
                      {fmt(m.netCashFlow)}
                    </td>
                    <td
                      className={`px-3 py-2 font-bold ${
                        isNegative ? 'text-red-700' : 'text-blue-700'
                      }`}
                    >
                      {fmt(m.closingBalance)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
