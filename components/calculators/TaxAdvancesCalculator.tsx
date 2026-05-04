'use client';

import { useState, useMemo } from 'react';
import {
  calculateTaxAdvances,
  type TaxAdvancesInput,
  type AdvanceFrequency,
} from '@/lib/calculators/tax-advances';
import { formatCurrency, formatPercent } from '@/lib/utils/formatters';
import { ResultCard } from '@/components/calculator/ResultCard';

const initial: TaxAdvancesInput = {
  expectedAnnualIncome: 200_000,
  creditPoints: 2.25,
  isVatRegistered: true,
  frequency: 'bimonthly',
  annualVatCollected: 36_000,
  annualVatDeductible: 12_000,
};

export function TaxAdvancesCalculator() {
  const [input, setInput] = useState<TaxAdvancesInput>(initial);
  const result = useMemo(() => calculateTaxAdvances(input), [input]);

  function update<K extends keyof TaxAdvancesInput>(k: K, v: TaxAdvancesInput[K]) {
    setInput((p) => ({ ...p, [k]: v }));
  }

  return (
    <div className="grid lg:grid-cols-5 gap-6">
      <div className="lg:col-span-3 bg-white border-2 border-gray-200 rounded-xl p-6 space-y-5">
        <h2 className="text-xl font-bold text-gray-900">פרטי ההכנסה</h2>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            הכנסה שנתית צפויה - אחרי הוצאות (₪)
          </label>
          <input
            type="number"
            min={0}
            step={5000}
            value={input.expectedAnnualIncome}
            onChange={(e) => update('expectedAnnualIncome', Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-lg"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">נקודות זיכוי</label>
            <input
              type="number"
              min={0}
              max={10}
              step={0.25}
              value={input.creditPoints}
              onChange={(e) => update('creditPoints', Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">תדירות תשלום</label>
            <select
              value={input.frequency}
              onChange={(e) => update('frequency', e.target.value as AdvanceFrequency)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="monthly">חודשי (12 תשלומים)</option>
              <option value="bimonthly">דו-חודשי (6 תשלומים)</option>
            </select>
          </div>
        </div>

        <label className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg cursor-pointer">
          <input
            type="checkbox"
            checked={input.isVatRegistered}
            onChange={(e) => update('isVatRegistered', e.target.checked)}
            className="w-4 h-4"
          />
          <span className="text-sm">עוסק מורשה (חייב מע"מ)</span>
        </label>

        {input.isVatRegistered && (
          <div className="grid grid-cols-2 gap-4 p-3 bg-blue-50 rounded-lg">
            <div>
              <label className="block text-xs font-medium text-blue-900 mb-1">
                מע"מ עסקאות שנתי
              </label>
              <input
                type="number"
                min={0}
                step={1000}
                value={input.annualVatCollected ?? 0}
                onChange={(e) => update('annualVatCollected', Number(e.target.value))}
                className="w-full px-2 py-1.5 border border-blue-300 rounded text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-blue-900 mb-1">
                מע"מ תשומות שנתי
              </label>
              <input
                type="number"
                min={0}
                step={1000}
                value={input.annualVatDeductible ?? 0}
                onChange={(e) => update('annualVatDeductible', Number(e.target.value))}
                className="w-full px-2 py-1.5 border border-blue-300 rounded text-sm"
              />
            </div>
          </div>
        )}
      </div>

      <div className="lg:col-span-2 space-y-4">
        <ResultCard
          title={`מקדמה ${input.frequency === 'monthly' ? 'חודשית' : 'דו-חודשית'}`}
          value={formatCurrency(result.perPaymentAmount)}
          subtitle={`${result.paymentsPerYear} תשלומים בשנה`}
          variant="success"
        />

        <ResultCard
          title="סך מקדמות שנתי"
          value={formatCurrency(result.totalAnnual)}
          subtitle={`${formatPercent(result.effectiveTaxRate, 1)} מההכנסה`}
          variant="primary"
        />

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-2 text-sm">
          <h4 className="font-bold mb-2">פירוט פר תשלום</h4>
          <div className="flex justify-between">
            <span className="text-gray-600">מס הכנסה:</span>
            <span className="font-medium">
              {formatCurrency(result.perPaymentBreakdown.incomeTax)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">ב.ל. + בריאות:</span>
            <span className="font-medium">
              {formatCurrency(result.perPaymentBreakdown.socialSecurity)}
            </span>
          </div>
          {result.perPaymentBreakdown.vat > 0 && (
            <div className="flex justify-between">
              <span className="text-gray-600">מע"מ:</span>
              <span className="font-medium">
                {formatCurrency(result.perPaymentBreakdown.vat)}
              </span>
            </div>
          )}
        </div>

        {result.recommendations.length > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-900 space-y-1">
            {result.recommendations.map((r, i) => (
              <p key={i}>💡 {r}</p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
