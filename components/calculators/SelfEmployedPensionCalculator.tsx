'use client';

import { useState, useMemo } from 'react';
import { calculateSelfEmployedPension } from '@/lib/calculators/self-employed-pension';
import { formatCurrency } from '@/lib/utils/formatters';
import { ResultCard } from '@/components/calculator/ResultCard';

export function SelfEmployedPensionCalculator() {
  const [income, setIncome] = useState(15_000);
  const [marginalRate, setMarginalRate] = useState(35);
  const [voluntary, setVoluntary] = useState(false);
  const [voluntaryAmount, setVoluntaryAmount] = useState(500);

  const result = useMemo(
    () =>
      calculateSelfEmployedPension({
        monthlyIncome: income,
        marginalTaxRate: marginalRate,
        contributeAboveMandatory: voluntary,
        voluntaryMonthlyContribution: voluntaryAmount,
      }),
    [income, marginalRate, voluntary, voluntaryAmount],
  );

  return (
    <div className="grid lg:grid-cols-5 gap-6">
      <div className="lg:col-span-3 bg-white border-2 border-gray-200 rounded-xl p-6 space-y-5">
        <h2 className="text-xl font-bold text-gray-900">פרטי הכנסה</h2>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            הכנסה חודשית ממוצעת (₪)
          </label>
          <input
            type="number"
            min={0}
            step={500}
            value={income}
            onChange={(e) => setIncome(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            מס שולי שלך (%)
          </label>
          <input
            type="number"
            min={0}
            max={50}
            step={1}
            value={marginalRate}
            onChange={(e) => setMarginalRate(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
          <p className="text-xs text-gray-500 mt-1">31-50% לרוב העצמאים</p>
        </div>

        <label className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-300 rounded-lg cursor-pointer">
          <input
            type="checkbox"
            checked={voluntary}
            onChange={(e) => setVoluntary(e.target.checked)}
            className="w-4 h-4"
          />
          <span className="text-sm">להפקיד מעבר לחובה (חיסכון נוסף)</span>
        </label>

        {voluntary && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              הפקדה רצונית חודשית (₪)
            </label>
            <input
              type="number"
              min={0}
              step={100}
              value={voluntaryAmount}
              onChange={(e) => setVoluntaryAmount(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
            <p className="text-xs text-gray-500 mt-1">
              עד תקרת הטבה: ~13,700 ₪/שנה (~1,140/חודש)
            </p>
          </div>
        )}
      </div>

      <div className="lg:col-span-2 space-y-4">
        <ResultCard
          title="הפקדה חובה חודשית"
          value={formatCurrency(result.mandatoryMonthly)}
          subtitle={`שנתי: ${formatCurrency(result.mandatoryAnnual)}`}
          variant="success"
        />

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-2 text-sm">
          <h4 className="font-bold mb-2">פירוט</h4>
          <div className="flex justify-between">
            <span className="text-gray-600">שלב 1 (4.45%):</span>
            <span className="font-medium">{formatCurrency(result.breakdown.tier1Amount)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">שלב 2 (12.55%):</span>
            <span className="font-medium">{formatCurrency(result.breakdown.tier2Amount)}</span>
          </div>
          {voluntary && (
            <div className="flex justify-between text-emerald-700">
              <span>הפקדה רצונית:</span>
              <span className="font-medium">{formatCurrency(result.voluntaryAnnual / 12)}</span>
            </div>
          )}
        </div>

        <ResultCard
          title="חיסכון מס שנתי"
          value={formatCurrency(result.taxSavings)}
          subtitle={`עלות נטו: ${formatCurrency(result.netCost)}`}
          variant="primary"
        />

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-900">
          <p className="font-bold mb-1">קצבה צפויה לפרישה (30 שנה)</p>
          <p className="text-base font-bold">
            ~{formatCurrency(result.expectedMonthlyPension30Years)}/חודש
          </p>
        </div>

        {result.notes.length > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-900 space-y-1">
            {result.notes.map((n, i) => (
              <p key={i}>💡 {n}</p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
