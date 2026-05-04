'use client';

import { useState, useMemo } from 'react';
import { calculateNIT } from '@/lib/calculators/employee-benefits';
import { formatCurrency } from '@/lib/utils/formatters';
import { ResultCard } from '@/components/calculator/ResultCard';

export function NITCalculator() {
  const [income, setIncome] = useState(60_000);
  const [age, setAge] = useState(35);
  const [isParent, setIsParent] = useState(true);
  const [children, setChildren] = useState(2);
  const [singleParent, setSingleParent] = useState(false);

  const result = useMemo(
    () =>
      calculateNIT({
        annualEarnedIncome: income,
        age,
        isParent,
        numberOfChildren: children,
        isSingleParent: singleParent,
      }),
    [income, age, isParent, children, singleParent],
  );

  return (
    <div className="grid lg:grid-cols-5 gap-6">
      <div className="lg:col-span-3 bg-white border-2 border-gray-200 rounded-xl p-6 space-y-5">
        <h2 className="text-xl font-bold text-gray-900">פרטי הזכאות</h2>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            הכנסה שנתית מעבודה (₪)
          </label>
          <input
            type="number"
            min={0}
            step={1000}
            value={income}
            onChange={(e) => setIncome(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-lg"
          />
          <p className="text-xs text-gray-500 mt-1">משכר/עצמאי בלבד (לא קצבאות)</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">גיל</label>
          <input
            type="number"
            min={18}
            max={80}
            value={age}
            onChange={(e) => setAge(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
        </div>

        <label className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg cursor-pointer">
          <input
            type="checkbox"
            checked={isParent}
            onChange={(e) => setIsParent(e.target.checked)}
            className="w-4 h-4"
          />
          <span className="text-sm">הורה לילד מתחת ל-18</span>
        </label>

        {isParent && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                מספר ילדים
              </label>
              <input
                type="number"
                min={1}
                max={10}
                value={children}
                onChange={(e) => setChildren(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            <label className="flex items-center gap-2 p-3 bg-emerald-50 rounded-lg cursor-pointer">
              <input
                type="checkbox"
                checked={singleParent}
                onChange={(e) => setSingleParent(e.target.checked)}
                className="w-4 h-4"
              />
              <span className="text-sm">הורה יחיד (תוספת מענק)</span>
            </label>
          </>
        )}
      </div>

      <div className="lg:col-span-2 space-y-4">
        <ResultCard
          title={result.isEligible ? 'מענק עבודה שנתי' : 'לא זכאי'}
          value={result.isEligible ? formatCurrency(result.annualGrant) : '-'}
          subtitle={
            result.isEligible
              ? `~${formatCurrency(result.monthlyEquivalent)}/חודש`
              : result.ineligibilityReason
          }
          variant={result.isEligible ? 'success' : 'primary'}
        />

        {result.isEligible && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 text-sm space-y-2">
            <h4 className="font-bold text-emerald-900 mb-1">איך מקבלים?</h4>
            <ul className="space-y-1 text-emerald-800 text-xs">
              <li>• הגשת בקשה דרך אתר רשות המסים</li>
              <li>• דרוש: טופס 106, אישורים</li>
              <li>• התשלום מועבר לחשבון תוך 90 יום</li>
              <li>• ניתן להגיש 6 שנים אחורה</li>
            </ul>
          </div>
        )}

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-xs text-gray-700">
          <p className="font-bold mb-1">תנאי זכאות:</p>
          <p>
            הכנסה שנתית: {formatCurrency(result.lowerThreshold)} -{' '}
            {formatCurrency(result.upperThreshold)}
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-900">
          💡 מענק עבודה הוא תוכנית של רשות המסים לתמרץ עבודה. עבודה במשרה חלקית בשכר נמוך
          מקנה את הזכאות הגבוהה ביותר.
        </div>
      </div>
    </div>
  );
}
