'use client';

import { useState, useMemo } from 'react';
import { calculateVat, type VatInput, type VatMode } from '@/lib/calculators/vat';
import { formatCurrency, formatPercent } from '@/lib/utils/formatters';
import { ResultCard } from '@/components/calculator/ResultCard';

const initialInput: VatInput = {
  amount: 1000,
  mode: 'add',
  rate: 0.18,
};

export function VatCalculator() {
  const [input, setInput] = useState<VatInput>(initialInput);

  const result = useMemo(() => calculateVat(input), [input]);

  function updateField<K extends keyof VatInput>(field: K, value: VatInput[K]) {
    setInput((prev) => ({ ...prev, [field]: value }));
  }

  return (
    <div className="grid lg:grid-cols-5 gap-6">
      <div className="lg:col-span-3 bg-white border-2 border-gray-200 rounded-xl p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">פרטי החישוב</h2>

        <div className="space-y-5">
          {/* Mode */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">סוג חישוב</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => updateField('mode', 'add')}
                className={`px-4 py-3 rounded-lg border-2 transition text-right ${
                  input.mode === 'add'
                    ? 'border-blue-600 bg-blue-50 text-blue-900 font-medium'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                }`}
              >
                <div className="font-bold mb-1">הוספת מע"מ</div>
                <div className="text-xs">סכום ללא מע"מ → עם מע"מ</div>
              </button>
              <button
                type="button"
                onClick={() => updateField('mode', 'extract')}
                className={`px-4 py-3 rounded-lg border-2 transition text-right ${
                  input.mode === 'extract'
                    ? 'border-blue-600 bg-blue-50 text-blue-900 font-medium'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                }`}
              >
                <div className="font-bold mb-1">חילוץ מע"מ</div>
                <div className="text-xs">סכום כולל מע"מ → ללא</div>
              </button>
            </div>
          </div>

          {/* Amount */}
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
              {input.mode === 'add' ? 'סכום ללא מע"מ (ש"ח)' : 'סכום כולל מע"מ (ש"ח)'}
            </label>
            <input
              id="amount"
              type="number"
              min={0}
              step={1}
              value={input.amount}
              onChange={(e) => updateField('amount', Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-lg"
            />
          </div>

          {/* Rate */}
          <div>
            <label htmlFor="rate" className="block text-sm font-medium text-gray-700 mb-2">
              שיעור מע"מ (%)
            </label>
            <input
              id="rate"
              type="number"
              min={0}
              max={50}
              step={0.5}
              value={(input.rate ?? 0.18) * 100}
              onChange={(e) => updateField('rate', Number(e.target.value) / 100)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">שיעור רגיל ב-2026: 18%</p>
          </div>
        </div>
      </div>

      <div className="lg:col-span-2 space-y-4">
        <ResultCard
          title={input.mode === 'add' ? 'סכום סופי כולל מע"מ' : 'סכום ללא מע"מ'}
          value={formatCurrency(
            input.mode === 'add' ? result.amountWithVat : result.amountWithoutVat
          )}
          subtitle={`מע"מ ב-${formatPercent(result.vatRate, 0)}`}
          variant="success"
        />

        <ResultCard
          title="סכום המע&quot;מ"
          value={formatCurrency(result.vatAmount)}
          variant="primary"
        />

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 mb-3">פירוט</h4>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-gray-600">סכום ללא מע"מ:</dt>
              <dd className="font-medium">{formatCurrency(result.amountWithoutVat)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-600">מע"מ ({formatPercent(result.vatRate, 0)}):</dt>
              <dd className="font-medium">{formatCurrency(result.vatAmount)}</dd>
            </div>
            <div className="flex justify-between pt-2 border-t border-gray-200 font-bold">
              <dt className="text-gray-900">סה"כ עם מע"מ:</dt>
              <dd className="text-gray-900">{formatCurrency(result.amountWithVat)}</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
