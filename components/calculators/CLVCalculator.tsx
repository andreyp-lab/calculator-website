'use client';

import { useState, useMemo } from 'react';
import { calculateCLV, type CLVInput } from '@/lib/calculators/customer-lifetime-value';
import { formatCurrency } from '@/lib/utils/formatters';
import { ResultCard } from '@/components/calculator/ResultCard';

const initial: CLVInput = {
  averageOrderValue: 250,
  purchasesPerYear: 12,
  customerLifespanYears: 3,
  grossMargin: 60,
  customerAcquisitionCost: 800,
};

export function CLVCalculator() {
  const [input, setInput] = useState<CLVInput>(initial);
  const [useChurn, setUseChurn] = useState(false);
  const result = useMemo(
    () => calculateCLV({ ...input, monthlyChurnRate: useChurn ? input.monthlyChurnRate : undefined }),
    [input, useChurn],
  );

  function update<K extends keyof CLVInput>(k: K, v: CLVInput[K]) {
    setInput((p) => ({ ...p, [k]: v }));
  }

  const ratingColors = {
    excellent: 'bg-emerald-100 border-emerald-400 text-emerald-900',
    good: 'bg-cream-2 border-ink/20 text-ink',
    fair: 'bg-amber-100 border-amber-400 text-amber-900',
    poor: 'bg-red-100 border-red-400 text-red-900',
  };

  return (
    <div className="grid lg:grid-cols-5 gap-6">
      <div className="lg:col-span-3 bg-paper border border-ink/15 rounded-none p-6">
        <h2 className="text-xl font-bold text-ink mb-6">נתוני לקוח</h2>
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-ink/70 mb-2">
                ערך הזמנה ממוצעת (₪)
              </label>
              <input
                type="number"
                min={0}
                value={input.averageOrderValue}
                onChange={(e) => update('averageOrderValue', Number(e.target.value))}
                className="w-full px-3 py-2 border border-ink/15 rounded-none focus:ring-2 focus:ring-gold"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink/70 mb-2">
                רכישות בשנה
              </label>
              <input
                type="number"
                min={0}
                step={0.5}
                value={input.purchasesPerYear}
                onChange={(e) => update('purchasesPerYear', Number(e.target.value))}
                className="w-full px-3 py-2 border border-ink/15 rounded-none focus:ring-2 focus:ring-gold"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-ink/70 mb-2">
              שיעור רווח גולמי (%)
            </label>
            <input
              type="number"
              min={0}
              max={100}
              value={input.grossMargin}
              onChange={(e) => update('grossMargin', Number(e.target.value))}
              className="w-full px-3 py-2 border border-ink/15 rounded-none focus:ring-2 focus:ring-gold"
            />
            <p className="text-xs text-ink/60 mt-1">
              SaaS: 70-90%, שירותים: 50-70%, מסחר: 20-40%
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-ink/70 mb-2">
              CAC - עלות גיוס לקוח (₪)
            </label>
            <input
              type="number"
              min={0}
              step={50}
              value={input.customerAcquisitionCost}
              onChange={(e) => update('customerAcquisitionCost', Number(e.target.value))}
              className="w-full px-3 py-2 border border-ink/15 rounded-none focus:ring-2 focus:ring-gold"
            />
            <p className="text-xs text-ink/60 mt-1">
              פרסום + מכירות + ספקי לידים מחולק במספר לקוחות חדשים
            </p>
          </div>

          <div className="bg-cream-2 border border-ink/15 rounded-none p-3">
            <label className="flex items-center gap-2 cursor-pointer mb-3">
              <input
                type="checkbox"
                checked={useChurn}
                onChange={(e) => setUseChurn(e.target.checked)}
                className="w-4 h-4"
              />
              <span className="text-sm font-medium text-ink/70">
                השתמש ב-Churn Rate (במקום אורך חיים)
              </span>
            </label>
            {useChurn ? (
              <div>
                <label className="block text-xs text-ink/70 mb-1">
                  Churn חודשי (%)
                </label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  step={0.1}
                  value={input.monthlyChurnRate ?? 5}
                  onChange={(e) => update('monthlyChurnRate', Number(e.target.value))}
                  className="w-full px-3 py-1.5 border border-ink/15 rounded-none text-sm"
                />
                <p className="text-xs text-ink/60 mt-1">
                  SaaS B2B בריא: 1-2%, חלש: 5%+
                </p>
              </div>
            ) : (
              <div>
                <label className="block text-xs text-ink/70 mb-1">אורך חיים (שנים)</label>
                <input
                  type="number"
                  min={0.1}
                  step={0.5}
                  value={input.customerLifespanYears}
                  onChange={(e) => update('customerLifespanYears', Number(e.target.value))}
                  className="w-full px-3 py-1.5 border border-ink/15 rounded-none text-sm"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="lg:col-span-2 space-y-4">
        <ResultCard
          title="CLV - שווי לקוח לטווח ארוך"
          value={formatCurrency(result.clv)}
          subtitle={`רווח גולמי ללקוח: ${formatCurrency(result.grossProfitPerCustomer)}`}
          variant="success"
        />

        <div className={`border-2 rounded-none p-4 ${ratingColors[result.rating]}`}>
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-bold text-sm">LTV/CAC</h4>
            <span className="text-2xl font-bold">{result.ltvCacRatio.toFixed(2)}x</span>
          </div>
          <p className="text-xs">{result.ratingLabel}</p>
        </div>

        <div className="bg-cream-2 border border-ink/15 rounded-none p-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-ink/60">ARPU חודשי:</span>
            <span className="font-medium">{formatCurrency(result.monthlyArpu)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-ink/60">סה"כ הכנסה ללקוח:</span>
            <span className="font-medium">{formatCurrency(result.totalRevenuePerCustomer)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-ink/60">Payback (חודשים):</span>
            <span className="font-medium">
              {Number.isFinite(result.paybackMonths) ? result.paybackMonths.toFixed(1) : '∞'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-ink/60">אורך חיים אפקטיבי:</span>
            <span className="font-medium">{result.effectiveLifespan.toFixed(1)} שנים</span>
          </div>
        </div>

        <div className="bg-cream-2 border border-ink/15 rounded-none p-3 text-xs text-ink/70">
          💡 {result.recommendation}
        </div>
      </div>
    </div>
  );
}
