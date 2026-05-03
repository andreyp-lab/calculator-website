'use client';

import { useMemo } from 'react';
import { useTools } from '@/lib/tools/ToolsContext';
import { calculateAllMonths, calculateBudgetTotals } from '@/lib/tools/budget-engine';
import { formatCurrency, formatPercent } from '@/lib/tools/format';
import { ChartPie, TrendingUp, TrendingDown } from 'lucide-react';

export function PLSummary() {
  const { budget, settings } = useTools();

  const totals = useMemo(() => {
    if (!budget || !settings) return null;
    const monthly = calculateAllMonths(budget, settings);
    return calculateBudgetTotals(monthly);
  }, [budget, settings]);

  if (!totals || !settings) return null;

  const fmt = (v: number) => formatCurrency(v, settings.currency);
  const isProfitable = totals.netProfit > 0;

  return (
    <div className="bg-white rounded-lg border-2 border-gray-200 shadow-sm overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4">
        <div className="flex items-center gap-2">
          <ChartPie className="w-5 h-5" />
          <h3 className="font-bold text-lg">דוח רווח והפסד (P&L)</h3>
        </div>
        <p className="text-sm text-blue-100 mt-1">
          {settings.companyName || 'החברה שלי'} | {settings.monthsToShow} חודשים
        </p>
      </div>

      <div className="p-5 space-y-3">
        {/* הכנסות */}
        <div className="flex justify-between items-center py-2 bg-green-50 rounded px-3 border-r-4 border-green-500">
          <span className="font-medium text-gray-700">סה"כ הכנסות</span>
          <span className="font-bold text-green-700 text-lg">{fmt(totals.income)}</span>
        </div>

        {/* COGS */}
        <div className="flex justify-between items-center py-2 px-3">
          <span className="text-gray-700">עלות המכר (COGS)</span>
          <span className="text-red-600">({fmt(totals.cogs)})</span>
        </div>

        {/* רווח גולמי */}
        <div className="flex justify-between items-center py-2 bg-blue-50 rounded px-3 border-r-4 border-blue-500">
          <div>
            <span className="font-bold text-gray-900">רווח גולמי</span>
            <span className="text-xs text-gray-600 mr-2">({formatPercent(totals.grossMargin)})</span>
          </div>
          <span className="font-bold text-blue-700">{fmt(totals.grossProfit)}</span>
        </div>

        {/* הוצאות תפעול */}
        <div className="space-y-1 px-3 text-sm">
          <div className="flex justify-between text-gray-600">
            <span>R&D</span>
            <span>({fmt(totals.rnd)})</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>שיווק ומכירות</span>
            <span>({fmt(totals.marketing)})</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>הוצאות תפעול</span>
            <span>({fmt(totals.operating)})</span>
          </div>
        </div>

        {/* רווח תפעולי */}
        <div className="flex justify-between items-center py-2 bg-purple-50 rounded px-3 border-r-4 border-purple-500">
          <div>
            <span className="font-bold text-gray-900">רווח תפעולי (EBIT)</span>
            <span className="text-xs text-gray-600 mr-2">
              ({formatPercent(totals.operatingMargin)})
            </span>
          </div>
          <span
            className={`font-bold ${
              totals.operatingProfit > 0 ? 'text-purple-700' : 'text-red-700'
            }`}
          >
            {fmt(totals.operatingProfit)}
          </span>
        </div>

        {/* EBITDA */}
        <div className="flex justify-between items-center py-2 px-3 text-sm">
          <span className="text-gray-700">EBITDA</span>
          <span className="font-medium">{fmt(totals.ebitda)}</span>
        </div>

        {/* הוצאות מימון */}
        <div className="flex justify-between items-center py-2 px-3 text-sm">
          <span className="text-gray-700">הוצאות מימון</span>
          <span className="text-red-600">({fmt(totals.financial)})</span>
        </div>

        {/* רווח לפני מס */}
        <div className="flex justify-between items-center py-2 px-3 border-t border-gray-200">
          <span className="font-medium text-gray-700">רווח לפני מס</span>
          <span className={totals.preTaxProfit > 0 ? 'text-gray-900' : 'text-red-700'}>
            {fmt(totals.preTaxProfit)}
          </span>
        </div>

        {/* מס */}
        <div className="flex justify-between items-center py-2 px-3 text-sm">
          <span className="text-gray-700">מס ({settings.taxRate}%)</span>
          <span className="text-red-600">({fmt(totals.tax)})</span>
        </div>

        {/* רווח נקי */}
        <div
          className={`flex justify-between items-center py-3 rounded px-3 border-r-4 ${
            isProfitable
              ? 'bg-green-100 border-green-600'
              : 'bg-red-100 border-red-600'
          }`}
        >
          <div className="flex items-center gap-2">
            {isProfitable ? (
              <TrendingUp className="w-5 h-5 text-green-700" />
            ) : (
              <TrendingDown className="w-5 h-5 text-red-700" />
            )}
            <div>
              <span className="font-bold text-gray-900">רווח נקי</span>
              <span className="text-xs text-gray-700 mr-2">({formatPercent(totals.netMargin)})</span>
            </div>
          </div>
          <span
            className={`font-bold text-2xl ${
              isProfitable ? 'text-green-700' : 'text-red-700'
            }`}
          >
            {fmt(totals.netProfit)}
          </span>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4 pt-4 border-t border-gray-200">
          <div className="bg-blue-50 p-3 rounded text-center">
            <div className="text-xs text-gray-600">מרווח גולמי</div>
            <div className="font-bold text-blue-700">{formatPercent(totals.grossMargin)}</div>
          </div>
          <div className="bg-purple-50 p-3 rounded text-center">
            <div className="text-xs text-gray-600">מרווח תפעולי</div>
            <div className="font-bold text-purple-700">{formatPercent(totals.operatingMargin)}</div>
          </div>
          <div className="bg-green-50 p-3 rounded text-center">
            <div className="text-xs text-gray-600">מרווח נקי</div>
            <div className="font-bold text-green-700">{formatPercent(totals.netMargin)}</div>
          </div>
          <div className="bg-yellow-50 p-3 rounded text-center">
            <div className="text-xs text-gray-600">מרווח EBITDA</div>
            <div className="font-bold text-yellow-700">{formatPercent(totals.ebitdaMargin)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
