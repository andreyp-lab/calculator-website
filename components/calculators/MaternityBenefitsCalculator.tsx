'use client';

import { useState, useMemo } from 'react';
import {
  calculateMaternityBenefits,
  type MaternityBenefitsInput,
} from '@/lib/calculators/maternity-benefits';
import { formatCurrency } from '@/lib/utils/formatters';
import { ResultCard } from '@/components/calculator/ResultCard';

const initial: MaternityBenefitsInput = {
  recentMonthlySalary: 12_000,
  leaveDays: 105,
  multipleBabies: 1,
  hospitalizationDays: 0,
};

export function MaternityBenefitsCalculator() {
  const [input, setInput] = useState<MaternityBenefitsInput>(initial);
  const result = useMemo(() => calculateMaternityBenefits(input), [input]);

  function update<K extends keyof MaternityBenefitsInput>(k: K, v: MaternityBenefitsInput[K]) {
    setInput((p) => ({ ...p, [k]: v }));
  }

  return (
    <div className="grid lg:grid-cols-5 gap-6">
      <div className="lg:col-span-3 bg-white border-2 border-gray-200 rounded-xl p-6 space-y-5">
        <h2 className="text-xl font-bold text-gray-900">פרטי הזכאות</h2>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            שכר חודשי ב-3 חודשים אחרונים (₪)
          </label>
          <input
            type="number"
            min={0}
            step={500}
            value={input.recentMonthlySalary}
            onChange={(e) => update('recentMonthlySalary', Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-lg"
          />
          <p className="text-xs text-gray-500 mt-1">
            ב.ל. ייקח את הגבוה מבין 3 חודשים או 6 חודשים
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            שכר ממוצע 6 חודשים (אופציונלי - ₪)
          </label>
          <input
            type="number"
            min={0}
            step={500}
            value={input.sixMonthsAvgSalary ?? 0}
            onChange={(e) => update('sixMonthsAvgSalary', Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ימי חופשת לידה
          </label>
          <select
            value={input.leaveDays}
            onChange={(e) => update('leaveDays', Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          >
            <option value={105}>15 שבועות (105 ימים) - חופשה רגילה</option>
            <option value={56}>8 שבועות (56 ימים) - חופשה מינימלית</option>
            <option value={175}>25 שבועות (175 ימים) - חופשה מקסימלית</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            מספר תינוקות
          </label>
          <select
            value={input.multipleBabies}
            onChange={(e) => update('multipleBabies', Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          >
            <option value={1}>תינוק אחד</option>
            <option value={2}>תאומים (+3 שבועות)</option>
            <option value={3}>שלישיה (+6 שבועות)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ימי אישפוז התינוק (אם רלוונטי)
          </label>
          <input
            type="number"
            min={0}
            max={140}
            value={input.hospitalizationDays}
            onChange={(e) => update('hospitalizationDays', Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
          <p className="text-xs text-gray-500 mt-1">עד 20 שבועות נוספים במקרה של אישפוז</p>
        </div>
      </div>

      <div className="lg:col-span-2 space-y-4">
        <ResultCard
          title="סך דמי לידה משוערים"
          value={formatCurrency(result.totalBenefit)}
          subtitle={`${result.totalDays} ימים × ${formatCurrency(result.dailyBenefit)}`}
          variant="success"
        />

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">תשלום יומי:</span>
            <span className="font-medium">{formatCurrency(result.dailyBenefit)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">סך ימים:</span>
            <span className="font-medium">{result.totalDays}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">שכר קובע:</span>
            <span className="font-medium">{formatCurrency(result.effectiveMonthlySalary)}</span>
          </div>
        </div>

        {result.warning && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-900">
            ⚠️ {result.warning}
          </div>
        )}

        <div className="bg-pink-50 border border-pink-200 rounded-lg p-3 text-xs text-pink-900">
          💡 הסכומים פטורים ממס הכנסה אך חייבים בביטוח לאומי. מחושב לפי טבלאות 2026 של ב.ל.
        </div>
      </div>
    </div>
  );
}
