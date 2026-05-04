'use client';

import { useState, useMemo } from 'react';
import { calculateWorkValue, type WorkValueInput } from '@/lib/calculators/work-value';
import { formatCurrency } from '@/lib/utils/formatters';
import { ResultCard } from '@/components/calculator/ResultCard';

const initial: WorkValueInput = {
  monthlyGrossSalary: 12_000,
  monthlyWorkHours: 180,
  monthlyCommutingHours: 20,
  alternativeBenefit: 5_000,
  commutingCost: 500,
  childcareCost: 0,
  workClothing: 200,
  workMeals: 600,
  otherWorkExpenses: 0,
  employerPensionContribution: 800,
  employerStudyFundContribution: 0,
  otherBenefits: 0,
};

export function WorkValueCalculator() {
  const [input, setInput] = useState<WorkValueInput>(initial);
  const result = useMemo(() => calculateWorkValue(input), [input]);

  function update<K extends keyof WorkValueInput>(k: K, v: WorkValueInput[K]) {
    setInput((p) => ({ ...p, [k]: v }));
  }

  return (
    <div className="grid lg:grid-cols-5 gap-6">
      <div className="lg:col-span-3 bg-white border-2 border-gray-200 rounded-xl p-6 space-y-5">
        <h2 className="text-xl font-bold text-gray-900">פרטים פיננסיים</h2>

        <div className="bg-gray-50 p-4 rounded-lg space-y-3">
          <h4 className="font-semibold text-gray-900 text-sm">💼 הכנסות מעבודה</h4>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              שכר ברוטו חודשי (₪)
            </label>
            <input
              type="number"
              value={input.monthlyGrossSalary}
              onChange={(e) => update('monthlyGrossSalary', Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">שעות עבודה</label>
              <input
                type="number"
                value={input.monthlyWorkHours}
                onChange={(e) => update('monthlyWorkHours', Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">שעות נסיעה</label>
              <input
                type="number"
                value={input.monthlyCommutingHours}
                onChange={(e) => update('monthlyCommutingHours', Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
              />
            </div>
          </div>
        </div>

        <div className="bg-amber-50 p-4 rounded-lg space-y-3">
          <h4 className="font-semibold text-gray-900 text-sm">
            💰 קצבה / הכנסה אלטרנטיבית (אם לא תעבד)
          </h4>
          <input
            type="number"
            value={input.alternativeBenefit}
            onChange={(e) => update('alternativeBenefit', Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded"
            placeholder="₪/חודש - דמי לידה / אבטלה / וכו'"
          />
        </div>

        <div className="bg-red-50 p-4 rounded-lg space-y-3">
          <h4 className="font-semibold text-gray-900 text-sm">🚗 הוצאות עבודה (₪/חודש)</h4>
          <div className="grid grid-cols-2 gap-3">
            <NumField label="נסיעות" value={input.commutingCost} onChange={(v) => update('commutingCost', v)} />
            <NumField
              label="מעון/פעוטון"
              value={input.childcareCost}
              onChange={(v) => update('childcareCost', v)}
            />
            <NumField
              label="ביגוד / כביסות"
              value={input.workClothing}
              onChange={(v) => update('workClothing', v)}
            />
            <NumField
              label="ארוחות בעבודה"
              value={input.workMeals}
              onChange={(v) => update('workMeals', v)}
            />
            <NumField
              label="הוצאות נוספות"
              value={input.otherWorkExpenses}
              onChange={(v) => update('otherWorkExpenses', v)}
            />
          </div>
        </div>

        <div className="bg-emerald-50 p-4 rounded-lg space-y-3">
          <h4 className="font-semibold text-gray-900 text-sm">🎁 הטבות מעסיק (₪/חודש)</h4>
          <div className="grid grid-cols-2 gap-3">
            <NumField
              label="הפרשת מעסיק לפנסיה"
              value={input.employerPensionContribution}
              onChange={(v) => update('employerPensionContribution', v)}
            />
            <NumField
              label="קרן השתלמות מעסיק"
              value={input.employerStudyFundContribution}
              onChange={(v) => update('employerStudyFundContribution', v)}
            />
            <NumField
              label="הטבות נוספות"
              value={input.otherBenefits}
              onChange={(v) => update('otherBenefits', v)}
            />
          </div>
        </div>
      </div>

      <div className="lg:col-span-2 space-y-4">
        <div
          className={`rounded-xl p-6 text-center text-white ${
            result.isWorthWorking
              ? 'bg-gradient-to-br from-emerald-500 to-emerald-700'
              : 'bg-gradient-to-br from-red-500 to-red-700'
          }`}
        >
          <div className="text-sm opacity-90 mb-1">
            {result.isWorthWorking ? 'משתלם לעבוד! ✓' : 'לא משתלם 😟'}
          </div>
          <div className="text-3xl font-bold mb-1">
            {result.differenceVsAlternative >= 0 ? '+' : ''}
            {formatCurrency(result.differenceVsAlternative)}
          </div>
          <div className="text-xs opacity-80">חודשי, מעל האלטרנטיבה</div>
        </div>

        <ResultCard
          title="שווי שעת עבודה אמיתי"
          value={`${result.effectiveHourlyWage.toFixed(0)} ₪/שעה`}
          subtitle="כולל זמני נסיעה והוצאות"
          variant="primary"
        />

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">נטו משכר (משוער):</span>
            <span className="font-medium">+{formatCurrency(result.estimatedNetSalary)}</span>
          </div>
          <div className="flex justify-between text-emerald-700">
            <span>הטבות מעסיק:</span>
            <span className="font-medium">+{formatCurrency(result.totalEmployerBenefits)}</span>
          </div>
          <div className="flex justify-between text-red-700">
            <span>הוצאות עבודה:</span>
            <span className="font-medium">-{formatCurrency(result.totalWorkExpenses)}</span>
          </div>
          <div className="flex justify-between pt-2 border-t font-bold">
            <span>נטו אפקטיבי:</span>
            <span>{formatCurrency(result.effectiveTakeHome)}</span>
          </div>
          <div className="flex justify-between text-gray-500">
            <span>אלטרנטיבה:</span>
            <span>{formatCurrency(input.alternativeBenefit)}</span>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-900">
          💡 {result.recommendation}
        </div>
      </div>
    </div>
  );
}

function NumField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <label className="block text-xs text-gray-700 mb-1">{label}</label>
      <input
        type="number"
        min={0}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
      />
    </div>
  );
}
