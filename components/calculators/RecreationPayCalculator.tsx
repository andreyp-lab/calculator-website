'use client';

import { useState, useMemo } from 'react';
import {
  calculateRecreationPay,
  type RecreationPayInput,
  type Sector,
} from '@/lib/calculators/recreation-pay';
import { formatCurrency } from '@/lib/utils/formatters';
import { ResultCard } from '@/components/calculator/ResultCard';
import { Breakdown } from '@/components/calculator/Breakdown';
import { AlertCircle } from 'lucide-react';

const initialInput: RecreationPayInput = {
  yearsOfService: 5,
  partTimePercentage: 100,
  sector: 'private',
};

export function RecreationPayCalculator() {
  const [input, setInput] = useState<RecreationPayInput>(initialInput);

  const result = useMemo(() => calculateRecreationPay(input), [input]);

  function updateField<K extends keyof RecreationPayInput>(field: K, value: RecreationPayInput[K]) {
    setInput((prev) => ({ ...prev, [field]: value }));
  }

  return (
    <div className="grid lg:grid-cols-5 gap-6">
      <div className="lg:col-span-3 bg-white border-2 border-gray-200 rounded-xl p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">פרטי העבודה</h2>

        <div className="space-y-5">
          <div>
            <label htmlFor="years" className="block text-sm font-medium text-gray-700 mb-2">
              שנות וותק במקום העבודה
            </label>
            <input
              id="years"
              type="number"
              min={0}
              max={50}
              step={1}
              value={input.yearsOfService}
              onChange={(e) => updateField('yearsOfService', Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              שנות עבודה רצופות אצל אותו מעסיק (זכאות מתחילה אחרי שנה 1)
            </p>
          </div>

          <div>
            <label htmlFor="sector" className="block text-sm font-medium text-gray-700 mb-2">
              מגזר העסקה
            </label>
            <select
              id="sector"
              value={input.sector}
              onChange={(e) => updateField('sector', e.target.value as Sector)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="private">מגזר פרטי (418 ₪/יום)</option>
              <option value="public">מגזר ציבורי (471.40 ₪/יום)</option>
            </select>
          </div>

          <div>
            <label htmlFor="partTime" className="block text-sm font-medium text-gray-700 mb-2">
              היקף משרה (%)
            </label>
            <input
              id="partTime"
              type="number"
              min={1}
              max={100}
              step={1}
              value={input.partTimePercentage}
              onChange={(e) => updateField('partTimePercentage', Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">100% = משרה מלאה, 50% = חצי משרה</p>
          </div>
        </div>
      </div>

      <div className="lg:col-span-2 space-y-4">
        {result.isEligible ? (
          <>
            <ResultCard
              title="דמי הבראה שנתיים"
              value={formatCurrency(result.finalAmount)}
              subtitle={`${result.daysEntitled} ימים × ${formatCurrency(result.payPerDay)}`}
              variant="success"
            />

            <Breakdown
              title="פירוט החישוב"
              defaultOpen
              items={[
                { label: 'ימי הבראה לפי וותק', value: `${result.daysEntitled} ימים` },
                { label: 'תעריף ליום', value: formatCurrency(result.payPerDay) },
                {
                  label: 'סה"כ למשרה מלאה',
                  value: formatCurrency(result.fullTimeAmount),
                },
                {
                  label: `יחס משרה (${result.partTimePercentage}%)`,
                  value: `× ${(result.partTimePercentage / 100).toFixed(2)}`,
                },
                { label: 'דמי הבראה לתשלום', value: formatCurrency(result.finalAmount), bold: true },
              ]}
            />
          </>
        ) : (
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6">
            <div className="flex gap-3">
              <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-red-900 mb-2">לא זכאי לדמי הבראה</h3>
                <p className="text-sm text-red-800 leading-relaxed">{result.ineligibilityReason}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
