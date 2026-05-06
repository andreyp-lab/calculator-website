'use client';

import { useMemo } from 'react';
import { useTools } from '@/lib/tools/ToolsContext';
import { calculateAllMonths, calculateBudgetTotals } from '@/lib/tools/budget-engine';
import { calculateBreakEven, calculateWhatIf } from '@/lib/tools/break-even-analyzer';
import { formatCurrency } from '@/lib/tools/format';
import { Scale, AlertCircle, CheckCircle2 } from 'lucide-react';

export function BreakEvenDisplay() {
  const { budget, settings } = useTools();

  const analysis = useMemo(() => {
    if (!budget || !settings) return null;
    const monthly = calculateAllMonths(budget, settings);
    const totals = calculateBudgetTotals(monthly);

    // Variable costs = COGS + linked-pct expenses (rough)
    const variableCosts = totals.cogs;
    // Fixed costs = R&D + Marketing + Operating - financial (those are fixed/manual usually)
    const fixedCosts = totals.rnd + totals.marketing + totals.operating;

    const result = calculateBreakEven({
      revenue: totals.income,
      variableCosts,
      fixedCosts,
    });

    const whatIf = calculateWhatIf({
      revenue: totals.income,
      variableCosts,
      fixedCosts,
      targetProfit: totals.income * 0.10, // יעד: 10% רווח
    });

    return { result, whatIf };
  }, [budget, settings]);

  if (!analysis) {
    return (
      <div className="bg-amber-50 border-2 border-amber-200 rounded-lg p-6 text-center">
        <AlertCircle className="w-10 h-10 text-amber-500 mx-auto mb-2" />
        <p className="text-amber-900">חסרים נתונים לחישוב נקודת איזון</p>
      </div>
    );
  }

  const { result, whatIf } = analysis;
  const fmt = (v: number) => formatCurrency(v, settings?.currency ?? 'ILS');
  const safetyColor = {
    excellent: 'emerald',
    good: 'blue',
    fair: 'amber',
    weak: 'orange',
    critical: 'red',
  }[result.marginOfSafetyInterpretation.status];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white rounded-lg border-2 border-gray-200 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-cyan-600 to-teal-600 text-white p-4">
          <h3 className="font-bold flex items-center gap-2">
            <Scale className="w-5 h-5" />
            ניתוח נקודת איזון
          </h3>
          <p className="text-xs text-cyan-100">Break-Even + מרווח בטחון + מינוף תפעולי</p>
        </div>
      </div>

      {/* Main Status */}
      <div
        className={`bg-${safetyColor}-50 border-4 border-${safetyColor}-300 rounded-xl p-6 text-center`}
      >
        {result.isAboveBreakEven ? (
          <CheckCircle2 className={`w-12 h-12 text-${safetyColor}-600 mx-auto mb-2`} />
        ) : (
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-2" />
        )}
        <div className="text-xs text-gray-600 mb-1">
          {result.isAboveBreakEven ? 'מעל נקודת איזון' : 'מתחת לנקודת איזון'}
        </div>
        <div className={`text-4xl font-bold text-${safetyColor}-700 mb-2`}>
          {(result.marginOfSafetyRatio * 100).toFixed(1)}%
        </div>
        <div className={`text-sm text-${safetyColor}-800`}>מרווח בטחון</div>
        <div className="text-xs text-gray-600 mt-2">
          {result.marginOfSafetyInterpretation.text}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid md:grid-cols-3 gap-3">
        <MetricCard
          label="נקודת איזון (הכנסות)"
          value={fmt(result.breakEvenRevenue)}
          color="cyan"
          sublabel="הכנסות מינימליות לכיסוי הוצאות"
        />
        <MetricCard
          label="מרווח בטחון (₪)"
          value={fmt(result.marginOfSafety)}
          color={result.marginOfSafety > 0 ? 'emerald' : 'red'}
          sublabel="פער בין הכנסות לאיזון"
        />
        <MetricCard
          label="מינוף תפעולי (DOL)"
          value={result.operatingLeverage.toFixed(2) + 'x'}
          color="purple"
          sublabel={result.operatingLeverageInterpretation.split('-')[0].trim()}
        />
      </div>

      {/* Contribution Margin */}
      <div className="bg-white rounded-lg border-2 border-gray-200 p-4 shadow-sm">
        <h4 className="font-semibold text-gray-900 mb-3">תרומה לכיסוי</h4>
        <div className="grid md:grid-cols-2 gap-3">
          <div className="bg-gray-50 rounded p-3">
            <div className="text-xs text-gray-600 mb-1">תרומה לכיסוי (Contribution Margin)</div>
            <div className="text-2xl font-bold text-blue-700">{fmt(result.contributionMargin)}</div>
          </div>
          <div className="bg-gray-50 rounded p-3">
            <div className="text-xs text-gray-600 mb-1">שיעור תרומה</div>
            <div className="text-2xl font-bold text-blue-700">
              {(result.contributionMarginRatio * 100).toFixed(1)}%
            </div>
          </div>
        </div>
      </div>

      {/* What-If Analysis */}
      <div className="bg-white rounded-lg border-2 border-purple-200 shadow-sm overflow-hidden">
        <div className="bg-purple-600 text-white p-3">
          <h4 className="font-bold">What-If: השגת רווח של 10% מהכנסות</h4>
        </div>
        <div className="p-4 grid md:grid-cols-2 gap-3 text-sm">
          <WhatIfRow
            label="הגדלת מחיר"
            value={`+${whatIf.priceIncrease.toFixed(1)}%`}
            note="מניחים גמישות ביקושים נמוכה"
          />
          <WhatIfRow
            label="הגדלת כמות"
            value={
              Number.isFinite(whatIf.volumeIncrease)
                ? `+${whatIf.volumeIncrease.toFixed(1)}%`
                : 'לא ניתן'
            }
            note="ללא שינוי במרווח"
          />
          <WhatIfRow
            label="הפחתת עלויות משתנות"
            value={
              Number.isFinite(whatIf.variableCostReduction)
                ? `-${whatIf.variableCostReduction.toFixed(1)}%`
                : 'לא ניתן'
            }
            note="התייעלות בייצור"
          />
          <WhatIfRow
            label="הפחתת עלויות קבועות"
            value={
              Number.isFinite(whatIf.fixedCostReduction)
                ? `-${whatIf.fixedCostReduction.toFixed(1)}%`
                : 'לא ניתן'
            }
            note="חיסכון בתפעול"
          />
        </div>
      </div>

      {/* Insights */}
      {result.insights.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-900 mb-2">תובנות</h4>
          <ul className="text-sm text-blue-900 space-y-1">
            {result.insights.map((i, idx) => (
              <li key={idx}>{i}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function MetricCard({
  label,
  value,
  color,
  sublabel,
}: {
  label: string;
  value: string;
  color: string;
  sublabel: string;
}) {
  const colorMap: Record<string, { bg: string; text: string; border: string }> = {
    cyan: { bg: 'bg-cyan-50', text: 'text-cyan-700', border: 'border-cyan-200' },
    emerald: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
    red: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
    purple: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
  };
  const c = colorMap[color] ?? colorMap.cyan;
  return (
    <div className={`${c.bg} ${c.border} border-2 rounded-lg p-3 text-center`}>
      <div className="text-xs text-gray-600 mb-1">{label}</div>
      <div className={`text-2xl font-bold ${c.text}`}>{value}</div>
      <div className="text-[10px] text-gray-500 mt-1">{sublabel}</div>
    </div>
  );
}

function WhatIfRow({ label, value, note }: { label: string; value: string; note: string }) {
  return (
    <div className="bg-gray-50 rounded p-2">
      <div className="flex justify-between items-center">
        <span className="font-medium text-gray-700">{label}</span>
        <span className="font-bold text-purple-700">{value}</span>
      </div>
      <div className="text-[10px] text-gray-500 mt-0.5">{note}</div>
    </div>
  );
}
