'use client';

import { useMemo } from 'react';
import { useTools } from '@/lib/tools/ToolsContext';
import { calculateAllMonths, calculateBudgetTotals } from '@/lib/tools/budget-engine';
import { calculateDuPont } from '@/lib/tools/dupont-analyzer';
import { Sparkles, TrendingUp, AlertCircle } from 'lucide-react';

export function DuPontDisplay() {
  const { budget, settings, balanceSheet } = useTools();

  const dupont = useMemo(() => {
    if (!budget || !settings || !balanceSheet || balanceSheet.totalAssets === 0) return null;

    const monthly = calculateAllMonths(budget, settings);
    const totals = calculateBudgetTotals(monthly);
    const ebt = totals.preTaxProfit;

    return calculateDuPont({
      revenue: totals.income,
      netProfit: totals.netProfit,
      ebit: totals.operatingProfit,
      ebt,
      totalAssets: balanceSheet.totalAssets,
      totalEquity: balanceSheet.totalEquity || 1,
    });
  }, [budget, settings, balanceSheet]);

  if (!dupont) {
    return (
      <div className="bg-amber-50 border-2 border-amber-200 rounded-lg p-6 text-center">
        <AlertCircle className="w-10 h-10 text-amber-500 mx-auto mb-2" />
        <p className="text-amber-900">חסרים נתוני מאזן ל-DuPont Analysis</p>
      </div>
    );
  }

  const driverColor = {
    profitability: 'emerald',
    efficiency: 'blue',
    leverage: 'amber',
  }[dupont.primaryDriver];

  const driverLabel = {
    profitability: 'רווחיות',
    efficiency: 'יעילות',
    leverage: 'מינוף',
  }[dupont.primaryDriver];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white rounded-lg border-2 border-gray-200 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white p-4">
          <h3 className="font-bold flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            DuPont Analysis - פירוק ROE
          </h3>
          <p className="text-xs text-indigo-100">
            הבנת מקור התשואה על ההון - רווחיות, יעילות, או מינוף
          </p>
        </div>
      </div>

      {/* Primary Driver */}
      <div
        className={`bg-${driverColor}-50 border-2 border-${driverColor}-200 rounded-lg p-4 text-center`}
      >
        <div className="text-xs text-gray-600 mb-1">המנוע העיקרי לתשואה</div>
        <div className={`text-3xl font-bold text-${driverColor}-700`}>{driverLabel}</div>
        <div className="text-sm text-gray-600 mt-2">
          ROE = {(dupont.threeFactor.roe * 100).toFixed(1)}%
        </div>
      </div>

      {/* 3-Factor Tree */}
      <div className="bg-white rounded-lg border-2 border-gray-200 p-4 shadow-sm">
        <h4 className="font-semibold text-gray-900 mb-4 text-center">פירוק 3-Factor</h4>
        <div className="flex items-center justify-center gap-2 flex-wrap">
          <ComponentBox
            label={dupont.threeFactor.netProfitMargin.label}
            value={`${(dupont.threeFactor.netProfitMargin.value * 100).toFixed(2)}%`}
            color="emerald"
            formula={dupont.threeFactor.netProfitMargin.formula}
          />
          <span className="text-2xl text-gray-400 font-bold">×</span>
          <ComponentBox
            label={dupont.threeFactor.assetTurnover.label}
            value={dupont.threeFactor.assetTurnover.value.toFixed(2)}
            color="blue"
            formula={dupont.threeFactor.assetTurnover.formula}
          />
          <span className="text-2xl text-gray-400 font-bold">×</span>
          <ComponentBox
            label={dupont.threeFactor.equityMultiplier.label}
            value={dupont.threeFactor.equityMultiplier.value.toFixed(2)}
            color="amber"
            formula={dupont.threeFactor.equityMultiplier.formula}
          />
          <span className="text-2xl text-gray-400 font-bold">=</span>
          <ComponentBox
            label="ROE"
            value={`${(dupont.threeFactor.roe * 100).toFixed(2)}%`}
            color="indigo"
            formula="תשואה על ההון"
            highlight
          />
        </div>
      </div>

      {/* 5-Factor Tree */}
      <div className="bg-white rounded-lg border-2 border-gray-200 p-4 shadow-sm overflow-x-auto">
        <h4 className="font-semibold text-gray-900 mb-4 text-center">פירוק 5-Factor (מורחב)</h4>
        <div className="flex items-center justify-center gap-2 flex-wrap min-w-max">
          <ComponentBoxSm
            label="נטל מס"
            value={`${(dupont.fiveFactor.taxBurden.value * 100).toFixed(0)}%`}
            color="rose"
          />
          <span className="text-xl text-gray-400">×</span>
          <ComponentBoxSm
            label="נטל ריבית"
            value={`${(dupont.fiveFactor.interestBurden.value * 100).toFixed(0)}%`}
            color="orange"
          />
          <span className="text-xl text-gray-400">×</span>
          <ComponentBoxSm
            label="מרווח תפעולי"
            value={`${(dupont.fiveFactor.operatingMargin.value * 100).toFixed(2)}%`}
            color="emerald"
          />
          <span className="text-xl text-gray-400">×</span>
          <ComponentBoxSm
            label="מחזור נכסים"
            value={dupont.fiveFactor.assetTurnover.value.toFixed(2)}
            color="blue"
          />
          <span className="text-xl text-gray-400">×</span>
          <ComponentBoxSm
            label="מכפיל הון"
            value={dupont.fiveFactor.equityMultiplier.value.toFixed(2)}
            color="amber"
          />
          <span className="text-xl text-gray-400">=</span>
          <ComponentBoxSm
            label="ROE"
            value={`${(dupont.fiveFactor.roe * 100).toFixed(2)}%`}
            color="indigo"
            highlight
          />
        </div>
      </div>

      {/* Insights */}
      {dupont.insights.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            תובנות
          </h4>
          <ul className="space-y-1 text-sm text-blue-900">
            {dupont.insights.map((i, idx) => (
              <li key={idx}>{i}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function ComponentBox({
  label,
  value,
  color,
  formula,
  highlight,
}: {
  label: string;
  value: string;
  color: string;
  formula: string;
  highlight?: boolean;
}) {
  const colorMap: Record<string, { bg: string; text: string; border: string }> = {
    emerald: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-300' },
    blue: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-300' },
    amber: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-300' },
    indigo: { bg: 'bg-indigo-100', text: 'text-indigo-800', border: 'border-indigo-400' },
  };
  const c = colorMap[color];
  return (
    <div
      className={`${c.bg} ${c.border} border-2 rounded-lg p-3 text-center min-w-[140px] ${
        highlight ? 'ring-2 ring-indigo-400' : ''
      }`}
    >
      <div className={`text-2xl font-bold ${c.text}`}>{value}</div>
      <div className="text-xs text-gray-700 mt-1 font-medium">{label}</div>
      <div className="text-[10px] text-gray-500 mt-1">{formula}</div>
    </div>
  );
}

function ComponentBoxSm({
  label,
  value,
  color,
  highlight,
}: {
  label: string;
  value: string;
  color: string;
  highlight?: boolean;
}) {
  const colorMap: Record<string, { bg: string; text: string }> = {
    emerald: { bg: 'bg-emerald-50', text: 'text-emerald-700' },
    blue: { bg: 'bg-blue-50', text: 'text-blue-700' },
    amber: { bg: 'bg-amber-50', text: 'text-amber-700' },
    rose: { bg: 'bg-rose-50', text: 'text-rose-700' },
    orange: { bg: 'bg-orange-50', text: 'text-orange-700' },
    indigo: { bg: 'bg-indigo-100', text: 'text-indigo-800' },
  };
  const c = colorMap[color];
  return (
    <div className={`${c.bg} rounded-lg p-2 text-center ${highlight ? 'ring-2 ring-indigo-400' : ''}`}>
      <div className={`text-base font-bold ${c.text}`}>{value}</div>
      <div className="text-[10px] text-gray-600 mt-0.5">{label}</div>
    </div>
  );
}
