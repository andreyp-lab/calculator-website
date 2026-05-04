'use client';

import { useState, useMemo } from 'react';
import { calculateAnnualBonus } from '@/lib/calculators/employee-benefits';
import { formatCurrency, formatPercent } from '@/lib/utils/formatters';
import { ResultCard } from '@/components/calculator/ResultCard';

export function AnnualBonusCalculator() {
  const [bonus, setBonus] = useState(50_000);
  const [salary, setSalary] = useState(15_000);
  const [creditPoints, setCreditPoints] = useState(2.25);

  const result = useMemo(
    () =>
      calculateAnnualBonus({
        grossBonus: bonus,
        regularMonthlySalary: salary,
        creditPoints,
      }),
    [bonus, salary, creditPoints],
  );

  return (
    <div className="grid lg:grid-cols-5 gap-6">
      <div className="lg:col-span-3 bg-white border-2 border-gray-200 rounded-xl p-6 space-y-5">
        <h2 className="text-xl font-bold text-gray-900">פרטי הבונוס</h2>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            סכום הבונוס ברוטו (₪)
          </label>
          <input
            type="number"
            min={0}
            step={1000}
            value={bonus}
            onChange={(e) => setBonus(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            משכורת חודשית רגילה (₪)
          </label>
          <input
            type="number"
            min={0}
            step={500}
            value={salary}
            onChange={(e) => setSalary(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
          <p className="text-xs text-gray-500 mt-1">
            השכר הקבוע - משפיע על מס שולי
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">נקודות זיכוי</label>
          <input
            type="number"
            min={0}
            max={10}
            step={0.25}
            value={creditPoints}
            onChange={(e) => setCreditPoints(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
        </div>
      </div>

      <div className="lg:col-span-2 space-y-4">
        <ResultCard
          title="בונוס נטו (לכיס)"
          value={formatCurrency(result.netBonus)}
          subtitle={`${result.netPercentage.toFixed(1)}% מהברוטו`}
          variant="success"
        />

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">בונוס ברוטו:</span>
            <span className="font-medium">{formatCurrency(bonus)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">
              מס שולי ({formatPercent(result.marginalTaxRate, 1)}):
            </span>
            <span className="font-medium">-{formatCurrency(result.taxAmount)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">ב.ל. + בריאות:</span>
            <span className="font-medium">-{formatCurrency(result.socialSecurity)}</span>
          </div>
          <div className="flex justify-between pt-2 border-t font-bold text-emerald-700">
            <span>נטו לכיס:</span>
            <span>{formatCurrency(result.netBonus)}</span>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-900">
          💡 בונוס מחושב במס לפי המס השולי - לרוב גבוה יותר ממס השכר הרגיל. תכנון: שקול לפזר
          בונוסים על פני שני שנות מס.
        </div>
      </div>
    </div>
  );
}
