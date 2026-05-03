'use client';

import { useState, useMemo } from 'react';
import {
  calculateHourlyRate,
  type HourlyRateInput,
  INDUSTRY_BENCHMARKS_2026,
} from '@/lib/calculators/hourly-rate';
import { formatCurrency } from '@/lib/utils/formatters';
import { ResultCard } from '@/components/calculator/ResultCard';

const initialInput: HourlyRateInput = {
  monthlySalary: 15000,
  workingHours: 160,
  billableHours: 120,
  monthlyOverhead: 5000,
  profitMargin: 25,
  addVat: false,
  vatRate: 0.18,
};

export function HourlyRateCalculator() {
  const [input, setInput] = useState<HourlyRateInput>(initialInput);

  const result = useMemo(() => calculateHourlyRate(input), [input]);

  function updateField<K extends keyof HourlyRateInput>(field: K, value: HourlyRateInput[K]) {
    setInput((prev) => ({ ...prev, [field]: value }));
  }

  // השוואה לנתוני שוק - קלאס לתעריף
  const rateClass = useMemo(() => {
    if (result.hourlyRate < 100) return 'נמוך - שקול להעלות';
    if (result.hourlyRate < 200) return 'תעריף ג\'וניור';
    if (result.hourlyRate < 400) return 'תעריף בינוני';
    if (result.hourlyRate < 700) return 'תעריף סניור';
    return 'תעריף פרימיום';
  }, [result.hourlyRate]);

  return (
    <div className="grid lg:grid-cols-5 gap-6">
      {/* קלט */}
      <div className="lg:col-span-3 bg-white border-2 border-gray-200 rounded-xl p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">פרטי החישוב</h2>

        <div className="space-y-5">
          {/* שכר חודשי */}
          <div>
            <label
              htmlFor="monthlySalary"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              שכר חודשי רצוי (ש"ח)
            </label>
            <input
              id="monthlySalary"
              type="number"
              min={0}
              step={500}
              value={input.monthlySalary}
              onChange={(e) => updateField('monthlySalary', Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-lg"
            />
            <p className="text-xs text-gray-500 mt-1">
              השכר שאתה רוצה למשוך מהעסק (לפני מסים)
            </p>
          </div>

          {/* שעות עבודה */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="workingHours"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                שעות עבודה (חודשי)
              </label>
              <input
                id="workingHours"
                type="number"
                min={1}
                max={300}
                step={5}
                value={input.workingHours}
                onChange={(e) => updateField('workingHours', Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">משרה מלאה = 160</p>
            </div>
            <div>
              <label
                htmlFor="billableHours"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                שעות לחיוב (חודשי)
              </label>
              <input
                id="billableHours"
                type="number"
                min={1}
                max={300}
                step={5}
                value={input.billableHours}
                onChange={(e) => updateField('billableHours', Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">בד"כ 60-75% משעות עבודה</p>
            </div>
          </div>

          {/* הוצאות */}
          <div>
            <label
              htmlFor="monthlyOverhead"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              הוצאות עסק חודשיות (ש"ח)
            </label>
            <input
              id="monthlyOverhead"
              type="number"
              min={0}
              step={100}
              value={input.monthlyOverhead}
              onChange={(e) => updateField('monthlyOverhead', Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              משרד, תוכנות, רו"ח, ביטוחים, תקשורת, שיווק וכו'
            </p>
          </div>

          {/* רווח */}
          <div>
            <label
              htmlFor="profitMargin"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              מרווח רווח (%)
            </label>
            <input
              id="profitMargin"
              type="number"
              min={0}
              max={200}
              step={5}
              value={input.profitMargin}
              onChange={(e) => updateField('profitMargin', Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              25% - מינימום מומלץ לכיסוי חופשות, מחלות, השקעה בעצמך
            </p>
          </div>

          {/* מע"מ */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={input.addVat ?? false}
                onChange={(e) => updateField('addVat', e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded"
              />
              <span className="text-sm font-medium text-gray-700">
                הצג גם תעריף כולל מע"מ (18%)
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* תוצאה */}
      <div className="lg:col-span-2 space-y-4">
        {!result.isValid && result.warning && (
          <div className="bg-amber-50 border-2 border-amber-300 rounded-lg p-4 text-sm text-amber-900">
            ⚠️ {result.warning}
          </div>
        )}

        <ResultCard
          title="תעריף שעתי מומלץ"
          value={formatCurrency(result.hourlyRate)}
          subtitle={rateClass}
          variant="success"
        />

        {input.addVat && (
          <ResultCard
            title='תעריף כולל מע"מ'
            value={formatCurrency(result.hourlyRateWithVat)}
            subtitle="מחיר ללקוח סופי"
            variant="primary"
          />
        )}

        <ResultCard
          title="תעריף יומי (8 שעות)"
          value={formatCurrency(result.dailyRate)}
          variant="primary"
        />

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 mb-3">פירוט החישוב</h4>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-gray-600">עלות בסיס לשעה:</dt>
              <dd className="font-medium">{formatCurrency(result.baseCostPerHour)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-600">רווח לשעה:</dt>
              <dd className="font-medium text-green-700">
                +{formatCurrency(result.profitPerHour)}
              </dd>
            </div>
            <div className="flex justify-between pt-2 border-t border-gray-200">
              <dt className="text-gray-700 font-medium">תעריף סופי:</dt>
              <dd className="font-bold text-gray-900">{formatCurrency(result.hourlyRate)}</dd>
            </div>
            <div className="flex justify-between pt-2 border-t border-gray-200">
              <dt className="text-gray-600">אחוז ניצול:</dt>
              <dd className="font-medium">{result.utilizationRate.toFixed(0)}%</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-600">הכנסה חודשית:</dt>
              <dd className="font-medium">{formatCurrency(result.monthlyRevenue)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-600">רווח חודשי:</dt>
              <dd
                className={`font-medium ${
                  result.monthlyProfit >= 0 ? 'text-green-700' : 'text-red-700'
                }`}
              >
                {formatCurrency(result.monthlyProfit)}
              </dd>
            </div>
          </dl>
        </div>

        {/* benchmark */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-900 mb-3 text-sm">
            תעריפי שוק 2026 (₪/שעה)
          </h4>
          <ul className="space-y-1 text-xs text-blue-900">
            {Object.values(INDUSTRY_BENCHMARKS_2026)
              .slice(0, 6)
              .map((b) => (
                <li key={b.label} className="flex justify-between">
                  <span>{b.label}</span>
                  <span className="font-medium">
                    {b.min}-{b.max}
                  </span>
                </li>
              ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
