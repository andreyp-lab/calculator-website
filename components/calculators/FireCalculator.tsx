'use client';

import { useState, useMemo } from 'react';
import { calculateFire, type FireCalculatorInput } from '@/lib/calculators/fire-calculator';
import { formatCurrency } from '@/lib/utils/formatters';
import { ResultCard } from '@/components/calculator/ResultCard';

const initial: FireCalculatorInput = {
  currentAge: 30,
  currentSavings: 200_000,
  monthlyContribution: 5_000,
  monthlyExpensesInRetirement: 15_000,
  expectedRealReturn: 5,
  withdrawalRate: 4,
};

export function FireCalculator() {
  const [input, setInput] = useState<FireCalculatorInput>(initial);
  const result = useMemo(() => calculateFire(input), [input]);

  function update<K extends keyof FireCalculatorInput>(k: K, v: FireCalculatorInput[K]) {
    setInput((p) => ({ ...p, [k]: v }));
  }

  const fireTypeLabels = {
    lean: 'Lean FIRE - חיסכון מקסימלי',
    regular: 'Regular FIRE - רמת חיים נורמלית',
    fat: 'Fat FIRE - רמת חיים גבוהה',
  };

  return (
    <div className="grid lg:grid-cols-5 gap-6">
      <div className="lg:col-span-3 bg-white border-2 border-gray-200 rounded-xl p-6 space-y-5">
        <h2 className="text-xl font-bold text-gray-900">תכנון פרישה מוקדמת</h2>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">גיל נוכחי</label>
            <input
              type="number"
              min={18}
              max={70}
              value={input.currentAge}
              onChange={(e) => update('currentAge', Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              חיסכון נוכחי (₪)
            </label>
            <input
              type="number"
              min={0}
              step={10_000}
              value={input.currentSavings}
              onChange={(e) => update('currentSavings', Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            הפקדה חודשית (₪)
          </label>
          <input
            type="number"
            min={0}
            step={500}
            value={input.monthlyContribution}
            onChange={(e) => update('monthlyContribution', Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-lg"
          />
          <p className="text-xs text-gray-500 mt-1">
            כמה אתה מצליח לחסוך כל חודש (אחוז שמירה גבוה = FIRE מהיר)
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            הוצאות חודשיות מתוכננות בפרישה (₪)
          </label>
          <input
            type="number"
            min={0}
            step={500}
            value={input.monthlyExpensesInRetirement}
            onChange={(e) => update('monthlyExpensesInRetirement', Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-lg"
          />
          <p className="text-xs text-gray-500 mt-1">
            כמה תצטרך כדי לחיות בנוחות (Lean: ‎8K-12K, Regular: ‎15-25K, Fat: ‎30K+)
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              תשואה ריאלית צפויה (%)
            </label>
            <input
              type="number"
              min={0}
              max={20}
              step={0.5}
              value={input.expectedRealReturn}
              onChange={(e) => update('expectedRealReturn', Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
            <p className="text-xs text-gray-500 mt-1">
              S&P 500 היסטורי: 7% נומינלי / 5% ריאלי
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              שיעור משיכה בטוח (%)
            </label>
            <input
              type="number"
              min={2}
              max={10}
              step={0.5}
              value={input.withdrawalRate}
              onChange={(e) => update('withdrawalRate', Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
            <p className="text-xs text-gray-500 mt-1">4% Rule הוא הסטנדרט</p>
          </div>
        </div>
      </div>

      <div className="lg:col-span-2 space-y-4">
        <ResultCard
          title="סכום ה-FIRE שלך"
          value={formatCurrency(result.fireNumber)}
          subtitle={fireTypeLabels[result.fireType]}
          variant="success"
        />

        <ResultCard
          title="שנים עד פרישה"
          value={`${result.yearsToFire.toFixed(1)} שנים`}
          subtitle={`גיל פרישה: ${result.fireAge}`}
          variant="primary"
        />

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">הוצאות שנתיות:</span>
            <span className="font-medium">{formatCurrency(result.annualExpenses)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">הכנסה פסיבית חודשית בפרישה:</span>
            <span className="font-medium">{formatCurrency(result.monthlyPassiveIncome)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">סכום צפוי בגיל פרישה:</span>
            <span className="font-medium">{formatCurrency(result.projectedSavings)}</span>
          </div>
        </div>

        {!result.willReachFire && (
          <div className="bg-amber-50 border border-amber-300 rounded-lg p-3 text-xs text-amber-900">
            ⚠️ בקצב הנוכחי לא תגיע ל-FIRE לפני גיל הפנסיה. שקול להגדיל הפקדה ב-
            {formatCurrency(result.monthlyShortfall)}/חודש.
          </div>
        )}

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-900">
          💡 כלל ה-4%: אם החיסכון שלך הוא 25× הוצאות שנתיות, אתה יכול למשוך 4% בשנה ולא לאזול.
        </div>
      </div>
    </div>
  );
}
