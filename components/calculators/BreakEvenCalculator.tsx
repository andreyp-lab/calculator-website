'use client';

import { useState, useMemo } from 'react';
import { calculateBreakEven, type BreakEvenInput } from '@/lib/calculators/break-even';
import { formatCurrency } from '@/lib/utils/formatters';
import { ResultCard } from '@/components/calculator/ResultCard';

const initial: BreakEvenInput = {
  fixedCosts: 30_000,
  variableCostPerUnit: 50,
  pricePerUnit: 200,
  expectedUnits: 250,
  targetProfit: 20_000,
};

export function BreakEvenCalculator() {
  const [input, setInput] = useState<BreakEvenInput>(initial);
  const result = useMemo(() => calculateBreakEven(input), [input]);

  function update<K extends keyof BreakEvenInput>(k: K, v: BreakEvenInput[K]) {
    setInput((p) => ({ ...p, [k]: v }));
  }

  return (
    <div className="grid lg:grid-cols-5 gap-6">
      <div className="lg:col-span-3 bg-paper border border-ink/15 rounded-none p-6">
        <h2 className="text-xl font-bold text-ink mb-6">פרטי העסק</h2>
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-ink/70 mb-2">
              הוצאות קבועות חודשיות (₪)
            </label>
            <input
              type="number"
              min={0}
              step={500}
              value={input.fixedCosts}
              onChange={(e) => update('fixedCosts', Number(e.target.value))}
              className="w-full px-3 py-2 border border-ink/15 rounded-none focus:ring-2 focus:ring-gold text-lg"
            />
            <p className="text-xs text-ink/60 mt-1">
              שכ"ד, משכורות קבועות, ביטוחים, רואה חשבון, תוכנות, וכו'
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-ink/70 mb-2">
                מחיר ליחידה (₪)
              </label>
              <input
                type="number"
                min={0}
                value={input.pricePerUnit}
                onChange={(e) => update('pricePerUnit', Number(e.target.value))}
                className="w-full px-3 py-2 border border-ink/15 rounded-none focus:ring-2 focus:ring-gold"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink/70 mb-2">
                עלות משתנה ליחידה (₪)
              </label>
              <input
                type="number"
                min={0}
                value={input.variableCostPerUnit}
                onChange={(e) => update('variableCostPerUnit', Number(e.target.value))}
                className="w-full px-3 py-2 border border-ink/15 rounded-none focus:ring-2 focus:ring-gold"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-ink/70 mb-2">
                יחידות צפויות (חודשי)
              </label>
              <input
                type="number"
                min={0}
                value={input.expectedUnits ?? 0}
                onChange={(e) => update('expectedUnits', Number(e.target.value))}
                className="w-full px-3 py-2 border border-ink/15 rounded-none focus:ring-2 focus:ring-gold"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink/70 mb-2">
                רווח מטרה חודשי (₪)
              </label>
              <input
                type="number"
                min={0}
                value={input.targetProfit ?? 0}
                onChange={(e) => update('targetProfit', Number(e.target.value))}
                className="w-full px-3 py-2 border border-ink/15 rounded-none focus:ring-2 focus:ring-gold"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="lg:col-span-2 space-y-4">
        {!result.isValid && (
          <div className="bg-amber-50 border border-amber-300 rounded-none p-3 text-sm text-amber-900">
            ⚠️ {result.warning}
          </div>
        )}

        <ResultCard
          title="נקודת איזון - יחידות חודשיות"
          value={result.breakEvenUnits.toFixed(0)}
          subtitle={`= ${result.breakEvenUnitsPerDay.toFixed(1)} יחידות ביום`}
          variant="success"
        />
        <ResultCard
          title="נקודת איזון - הכנסות חודשיות"
          value={formatCurrency(result.breakEvenRevenue)}
          variant="primary"
        />

        <div className="bg-cream-2 border border-ink/15 rounded-none p-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-ink/60">תרומה ליחידה:</span>
            <span className="font-medium">{formatCurrency(result.contributionPerUnit)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-ink/60">שיעור תרומה:</span>
            <span className="font-medium">{result.contributionMarginPct.toFixed(1)}%</span>
          </div>
          {input.expectedUnits ? (
            <>
              <div className="flex justify-between pt-2 border-t border-ink/15">
                <span className="text-ink/60">מרווח ביטחון:</span>
                <span
                  className={`font-medium ${result.marginOfSafetyPct >= 0 ? 'text-emerald-700' : 'text-red-700'}`}
                >
                  {result.marginOfSafetyPct.toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink/60">רווח חודשי צפוי:</span>
                <span
                  className={`font-bold ${result.expectedProfit >= 0 ? 'text-emerald-700' : 'text-red-700'}`}
                >
                  {formatCurrency(result.expectedProfit)}
                </span>
              </div>
            </>
          ) : null}
          {input.targetProfit ? (
            <div className="flex justify-between pt-2 border-t border-ink/15">
              <span className="text-ink/60">יחידות לרווח מטרה:</span>
              <span className="font-medium">{result.unitsForTargetProfit.toFixed(0)}</span>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
