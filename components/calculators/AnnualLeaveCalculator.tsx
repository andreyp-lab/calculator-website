'use client';

import { useState, useMemo } from 'react';
import { calculateAnnualLeave } from '@/lib/calculators/employee-benefits';
import { ResultCard } from '@/components/calculator/ResultCard';

export function AnnualLeaveCalculator() {
  const [years, setYears] = useState(5);
  const [days, setDays] = useState<5 | 6>(5);
  const result = useMemo(
    () => calculateAnnualLeave({ yearsOfService: years, workDaysPerWeek: days }),
    [years, days],
  );

  return (
    <div className="grid lg:grid-cols-5 gap-6">
      <div className="lg:col-span-3 bg-white border-2 border-gray-200 rounded-xl p-6 space-y-5">
        <h2 className="text-xl font-bold text-gray-900">פרטי וותק</h2>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            שנות וותק במקום העבודה
          </label>
          <input
            type="number"
            min={0}
            max={50}
            value={years}
            onChange={(e) => setYears(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ימי עבודה בשבוע
          </label>
          <select
            value={days}
            onChange={(e) => setDays(Number(e.target.value) as 5 | 6)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          >
            <option value={5}>5 ימים (משרה רגילה)</option>
            <option value={6}>6 ימים (שבת חופש)</option>
          </select>
        </div>
      </div>

      <div className="lg:col-span-2 space-y-4">
        <ResultCard
          title="ימי חופשה שנתיים"
          value={`${result.daysEntitled} ימים`}
          subtitle={result.basis}
          variant="success"
        />

        <ResultCard
          title="ימי עבודה שנתיים"
          value={`${result.actualWorkDays}`}
          subtitle='לא כולל סופ"שים וחגים'
          variant="primary"
        />

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-900">
          💡 ניתן לפדות בכסף עד שנת חופשה אחת בעת סיום עבודה. החוק מחייב מעסיק לאפשר ניצול
          חופשה לפחות 7 ימי חופשה רצופים בשנה.
        </div>
      </div>
    </div>
  );
}
