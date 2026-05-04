'use client';

import { useState, useMemo } from 'react';
import {
  calculateMinimumWage,
  type MinimumWageInput,
  type WorkType,
  type AgeGroup,
} from '@/lib/calculators/minimum-wage';
import { formatCurrency } from '@/lib/utils/formatters';
import { ResultCard } from '@/components/calculator/ResultCard';

const initial: MinimumWageInput = {
  workType: 'monthly',
  ageGroup: 'adult',
  partTimePercentage: 100,
};

export function MinimumWageCalculator() {
  const [input, setInput] = useState<MinimumWageInput>(initial);
  const [actualWage, setActualWage] = useState(6_000);
  const result = useMemo(
    () => calculateMinimumWage({ ...input, actualWage }),
    [input, actualWage],
  );

  function update<K extends keyof MinimumWageInput>(k: K, v: MinimumWageInput[K]) {
    setInput((p) => ({ ...p, [k]: v }));
  }

  return (
    <div className="grid lg:grid-cols-5 gap-6">
      <div className="lg:col-span-3 bg-white border-2 border-gray-200 rounded-xl p-6 space-y-5">
        <h2 className="text-xl font-bold text-gray-900">פרטי העסקה</h2>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">סוג שכר</label>
          <select
            value={input.workType}
            onChange={(e) => update('workType', e.target.value as WorkType)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          >
            <option value="monthly">חודשי (משרה מלאה)</option>
            <option value="hourly-182">שעתי (182 שעות/חודש)</option>
            <option value="hourly-186">שעתי (186 שעות/חודש)</option>
            <option value="daily-5">יומי (5 ימים/שבוע)</option>
            <option value="daily-6">יומי (6 ימים/שבוע)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">גיל העובד</label>
          <select
            value={input.ageGroup}
            onChange={(e) => update('ageGroup', e.target.value as AgeGroup)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          >
            <option value="adult">בוגר (18+)</option>
            <option value="youth-17-18">17-18 (75% משכר מינימום)</option>
            <option value="youth-16-17">16-17 (70% משכר מינימום)</option>
          </select>
        </div>

        {input.workType === 'monthly' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              אחוז משרה (%)
            </label>
            <input
              type="number"
              min={1}
              max={100}
              value={input.partTimePercentage}
              onChange={(e) => update('partTimePercentage', Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
        )}

        <div className="bg-amber-50 border border-amber-300 rounded-lg p-4">
          <label className="block text-sm font-medium text-amber-900 mb-2">
            השכר שאני מקבל בפועל (₪)
          </label>
          <input
            type="number"
            min={0}
            step={100}
            value={actualWage}
            onChange={(e) => setActualWage(Number(e.target.value))}
            className="w-full px-3 py-2 border border-amber-300 rounded-lg"
          />
          <p className="text-xs text-amber-800 mt-1">
            נבדוק אם הוא תואם את שכר המינימום החוקי
          </p>
        </div>
      </div>

      <div className="lg:col-span-2 space-y-4">
        <ResultCard
          title="שכר מינימום מותאם"
          value={formatCurrency(result.adjustedMinimumWage)}
          subtitle={result.wageTypeLabel}
          variant={result.isAboveMinimum ? 'success' : 'primary'}
        />

        {actualWage > 0 && (
          <div
            className={`border-2 rounded-lg p-4 ${
              result.isAboveMinimum
                ? 'border-emerald-400 bg-emerald-50 text-emerald-900'
                : 'border-red-400 bg-red-50 text-red-900'
            }`}
          >
            <h4 className="font-bold mb-1">
              {result.isAboveMinimum ? '✅ השכר תקין' : '⚠️ השכר נמוך מהמינימום'}
            </h4>
            {!result.isAboveMinimum && (
              <p className="text-sm">חסר: {formatCurrency(result.shortfall)}</p>
            )}
          </div>
        )}

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">שכר מינימום מלא:</span>
            <span className="font-medium">{formatCurrency(result.minimumWageFullTime)}</span>
          </div>
          {result.ageMultiplier < 1 && (
            <div className="flex justify-between">
              <span className="text-gray-600">מקדם גיל:</span>
              <span className="font-medium">{(result.ageMultiplier * 100).toFixed(0)}%</span>
            </div>
          )}
        </div>

        {result.notes.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-900 space-y-1">
            {result.notes.map((n, i) => (
              <p key={i}>{n}</p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
