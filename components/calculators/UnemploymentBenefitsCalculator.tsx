'use client';

import { useState, useMemo } from 'react';
import {
  calculateUnemploymentBenefits,
  type UnemploymentBenefitsInput,
} from '@/lib/calculators/unemployment-benefits';
import { formatCurrency, formatPercent } from '@/lib/utils/formatters';
import { ResultCard } from '@/components/calculator/ResultCard';

const initial: UnemploymentBenefitsInput = {
  averageMonthlySalary: 12_000,
  age: 35,
  hasChildren: false,
  workDaysIn18Months: 400,
};

export function UnemploymentBenefitsCalculator() {
  const [input, setInput] = useState<UnemploymentBenefitsInput>(initial);
  const result = useMemo(() => calculateUnemploymentBenefits(input), [input]);

  function update<K extends keyof UnemploymentBenefitsInput>(
    k: K,
    v: UnemploymentBenefitsInput[K],
  ) {
    setInput((p) => ({ ...p, [k]: v }));
  }

  return (
    <div className="grid lg:grid-cols-5 gap-6">
      <div className="lg:col-span-3 bg-white border-2 border-gray-200 rounded-xl p-6 space-y-5">
        <h2 className="text-xl font-bold text-gray-900">פרטי הזכאות</h2>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            שכר חודשי ממוצע ב-6 חודשים אחרונים (₪)
          </label>
          <input
            type="number"
            min={0}
            step={500}
            value={input.averageMonthlySalary}
            onChange={(e) => update('averageMonthlySalary', Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-lg"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">גיל</label>
            <input
              type="number"
              min={18}
              max={70}
              value={input.age}
              onChange={(e) => update('age', Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ימי עבודה ב-18 חודשים
            </label>
            <input
              type="number"
              min={0}
              max={540}
              value={input.workDaysIn18Months}
              onChange={(e) => update('workDaysIn18Months', Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
            <p className="text-xs text-gray-500 mt-1">נדרש 360+ לזכאות</p>
          </div>
        </div>

        <label className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg cursor-pointer">
          <input
            type="checkbox"
            checked={input.hasChildren}
            onChange={(e) => update('hasChildren', e.target.checked)}
            className="w-4 h-4"
          />
          <span className="text-sm">יש ילדים מתחת לגיל 18</span>
        </label>
      </div>

      <div className="lg:col-span-2 space-y-4">
        <ResultCard
          title="דמי אבטלה כוללים משוערים"
          value={result.isEligible ? formatCurrency(result.totalEstimate) : 'לא זכאי'}
          subtitle={
            result.isEligible
              ? `${result.maxDays} ימי זכאות`
              : 'לא עומד בתנאי הסף'
          }
          variant={result.isEligible ? 'success' : 'primary'}
        />

        {result.isEligible && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">תשלום יומי (125 ימים ראשונים):</span>
              <span className="font-medium">{formatCurrency(result.dailyBenefit)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">תשלום יומי (מהיום ה-126):</span>
              <span className="font-medium">{formatCurrency(result.reducedDailyBenefit)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">שיעור מהשכר:</span>
              <span className="font-medium">{formatPercent(result.benefitRate, 0)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">קטגוריה:</span>
              <span className="font-medium text-xs">{result.averageWageBracket}</span>
            </div>
          </div>
        )}

        {result.notes.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-900 space-y-1">
            {result.notes.map((note, i) => (
              <p key={i}>💡 {note}</p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
