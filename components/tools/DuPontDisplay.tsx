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
      <div className="bg-amber-50 border-2 border-amber-200 p-6 text-center">
        <AlertCircle className="w-10 h-10 text-amber-500 mx-auto mb-2" />
        <p className="text-amber-900">חסרים נתוני מאזן ל-DuPont Analysis</p>
      </div>
    );
  }

  const driverLabel = {
    profitability: 'רווחיות',
    efficiency: 'יעילות',
    leverage: 'מינוף',
  }[dupont.primaryDriver];

  const driverBgClass = dupont.primaryDriver === 'profitability'
    ? 'bg-emerald-50 border-emerald-200'
    : dupont.primaryDriver === 'leverage'
      ? 'bg-amber-50 border-amber-200'
      : 'bg-cream-2 border-ink/15';

  const driverTextClass = dupont.primaryDriver === 'profitability'
    ? 'text-emerald-700'
    : dupont.primaryDriver === 'leverage'
      ? 'text-amber-700'
      : 'text-gold';

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-paper border-2 border-ink/15 shadow-sm overflow-hidden">
        <div className="bg-ink text-cream p-4">
          <h3 className="font-bold flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            DuPont Analysis - פירוק ROE
          </h3>
          <p className="text-xs text-cream/70">
            הבנת מקור התשואה על ההון - רווחיות, יעילות, או מינוף
          </p>
        </div>
      </div>

      {/* Primary Driver */}
      <div
        className={`${driverBgClass} border-2 p-4 text-center`}
      >
        <div className="text-xs text-ink/60 mb-1">המנוע העיקרי לתשואה</div>
        <div className={`text-3xl font-bold ${driverTextClass}`}>{driverLabel}</div>
        <div className="text-sm text-ink/70 mt-2">
          ROE = {(dupont.threeFactor.roe * 100).toFixed(1)}%
        </div>
      </div>

      {/* 3-Factor Tree */}
      <div className="bg-paper border-2 border-ink/15 p-4 shadow-sm">
        <h4 className="font-semibold text-ink mb-4 text-center">פירוק 3-Factor</h4>
        <div className="flex items-center justify-center gap-2 flex-wrap">
          <ComponentBox
            label={dupont.threeFactor.netProfitMargin.label}
            value={`${(dupont.threeFactor.netProfitMargin.value * 100).toFixed(2)}%`}
            color="emerald"
            formula={dupont.threeFactor.netProfitMargin.formula}
          />
          <span className="text-2xl text-ink/45 font-bold">×</span>

          <ComponentBox
            label={dupont.threeFactor.assetTurnover.label}
            value={dupont.threeFactor.assetTurnover.value.toFixed(2)}
            color="gold"
            formula={dupont.threeFactor.assetTurnover.formula}
          />
          <span className="text-2xl text-ink/45 font-bold">×</span>
          <ComponentBox
            label={dupont.threeFactor.equityMultiplier.label}
            value={dupont.threeFactor.equityMultiplier.value.toFixed(2)}
            color="amber"
            formula={dupont.threeFactor.equityMultiplier.formula}
          />
          <span className="text-2xl text-ink/45 font-bold">=</span>
          <ComponentBox
            label="ROE"
            value={`${(dupont.threeFactor.roe * 100).toFixed(2)}%`}
            color="ink"
            formula="תשואה על ההון"
            highlight
          />
        </div>
      </div>

      {/* 5-Factor Tree */}
      <div className="bg-paper border-2 border-ink/15 p-4 shadow-sm overflow-x-auto">
        <h4 className="font-semibold text-ink mb-4 text-center">פירוק 5-Factor (מורחב)</h4>
        <div className="flex items-center justify-center gap-2 flex-wrap min-w-max">
          <ComponentBoxSm
            label="נטל מס"
            value={`${(dupont.fiveFactor.taxBurden.value * 100).toFixed(0)}%`}
            color="rose"
          />
          <span className="text-xl text-ink/45">×</span>
          <ComponentBoxSm
            label="נטל ריבית"
            value={`${(dupont.fiveFactor.interestBurden.value * 100).toFixed(0)}%`}
            color="orange"
          />
          <span className="text-xl text-ink/45">×</span>
          <ComponentBoxSm
            label="מרווח תפעולי"
            value={`${(dupont.fiveFactor.operatingMargin.value * 100).toFixed(2)}%`}
            color="emerald"
          />
          <span className="text-xl text-ink/45">×</span>
          <ComponentBoxSm
            label="מחזור נכסים"
            value={dupont.fiveFactor.assetTurnover.value.toFixed(2)}
            color="gold"
          />
          <span className="text-xl text-ink/45">×</span>
          <ComponentBoxSm
            label="מכפיל הון"
            value={dupont.fiveFactor.equityMultiplier.value.toFixed(2)}
            color="amber"
          />
          <span className="text-xl text-ink/45">=</span>
          <ComponentBoxSm
            label="ROE"
            value={`${(dupont.fiveFactor.roe * 100).toFixed(2)}%`}
            color="ink"
            highlight
          />
        </div>
      </div>

      {/* Insights */}
      {dupont.insights.length > 0 && (
        <div className="bg-cream-2 border border-ink/15 p-4">
          <h4 className="font-semibold text-ink mb-2 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            תובנות
          </h4>
          <ul className="space-y-1 text-sm text-ink">
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
    gold: { bg: 'bg-cream-2', text: 'text-gold', border: 'border-ink/15' },
    amber: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-300' },
    ink: { bg: 'bg-ink', text: 'text-cream', border: 'border-ink' },
  };
  const c = colorMap[color] ?? colorMap['gold'];
  return (
    <div
      className={`${c.bg} ${c.border} border-2 p-3 text-center min-w-[140px] ${
        highlight ? 'ring-2 ring-gold' : ''
      }`}
    >
      <div className={`text-2xl font-bold ${c.text}`}>{value}</div>
      <div className="text-xs text-ink/70 mt-1 font-medium">{label}</div>
      <div className="text-[10px] text-ink/45 mt-1">{formula}</div>
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
    gold: { bg: 'bg-cream-2', text: 'text-gold' },
    amber: { bg: 'bg-amber-50', text: 'text-amber-700' },
    rose: { bg: 'bg-rose-50', text: 'text-rose-700' },
    orange: { bg: 'bg-orange-50', text: 'text-orange-700' },
    ink: { bg: 'bg-ink', text: 'text-cream' },
  };
  const c = colorMap[color] ?? colorMap['gold'];
  return (
    <div className={`${c.bg} p-2 text-center ${highlight ? 'ring-2 ring-gold' : ''}`}>
      <div className={`text-base font-bold ${c.text}`}>{value}</div>
      <div className="text-[10px] text-ink/60 mt-0.5">{label}</div>
    </div>
  );
}
