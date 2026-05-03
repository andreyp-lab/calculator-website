'use client';

import { useState, useMemo } from 'react';
import {
  calculateCompoundInterest,
  type CompoundInterestInput,
  type CompoundFrequency,
} from '@/lib/calculators/investments';
import { formatCurrency, formatPercent } from '@/lib/utils/formatters';
import { ResultCard } from '@/components/calculator/ResultCard';
import { Breakdown } from '@/components/calculator/Breakdown';

const initialInput: CompoundInterestInput = {
  principal: 50000,
  annualRate: 7,
  years: 20,
  frequency: 'monthly',
  monthlyContribution: 1000,
};

export function CompoundInterestCalculator() {
  const [input, setInput] = useState<CompoundInterestInput>(initialInput);

  const result = useMemo(() => calculateCompoundInterest(input), [input]);

  function update<K extends keyof CompoundInterestInput>(field: K, value: CompoundInterestInput[K]) {
    setInput((prev) => ({ ...prev, [field]: value }));
  }

  // Show 5 sample years for breakdown
  const sampleYears = useMemo(() => {
    const all = result.yearlyBreakdown;
    if (all.length <= 6) return all;
    const indices = [0, Math.floor(all.length / 4), Math.floor(all.length / 2), Math.floor((all.length * 3) / 4), all.length - 1];
    return indices.map((i) => all[i]).filter(Boolean);
  }, [result]);

  return (
    <div className="grid lg:grid-cols-5 gap-6">
      {/* Form */}
      <div className="lg:col-span-3 bg-white border-2 border-gray-200 rounded-xl p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">פרטי ההשקעה</h2>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              סכום השקעה ראשוני (ש"ח)
            </label>
            <input
              type="number"
              min={0}
              step={1000}
              value={input.principal}
              onChange={(e) => update('principal', Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              הפקדה חודשית (ש"ח)
            </label>
            <input
              type="number"
              min={0}
              step={100}
              value={input.monthlyContribution}
              onChange={(e) => update('monthlyContribution', Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              סכום שאתה מפקיד מדי חודש (אופציונלי - 0 ללא הפקדות)
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ריבית שנתית (%)
              </label>
              <input
                type="number"
                min={0}
                max={50}
                step={0.1}
                value={input.annualRate}
                onChange={(e) => update('annualRate', Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">תשואה שנתית ממוצעת</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                תקופה (שנים)
              </label>
              <input
                type="number"
                min={1}
                max={60}
                step={1}
                value={input.years}
                onChange={(e) => update('years', Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">תדירות חישוב</label>
            <select
              value={input.frequency}
              onChange={(e) => update('frequency', e.target.value as CompoundFrequency)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="yearly">שנתי</option>
              <option value="quarterly">רבעוני</option>
              <option value="monthly">חודשי (מומלץ)</option>
              <option value="daily">יומי</option>
            </select>
          </div>

          {/* Examples */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-xs text-gray-700 mb-2 font-medium">💡 תשואות שנתיות לדוגמה:</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>📈 מדד S&P 500: ~10%</div>
              <div>🏦 פיקדון בנק: ~3-4%</div>
              <div>📊 ת"א 35: ~7-9%</div>
              <div>🏠 נדל"ן: ~5-7%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="lg:col-span-2 space-y-4">
        <ResultCard
          title="סכום סופי"
          value={formatCurrency(result.finalAmount)}
          subtitle={`אחרי ${input.years} שנים`}
          variant="success"
        />

        <ResultCard
          title="סך הריבית שצברת"
          value={formatCurrency(result.totalInterest)}
          subtitle={`${formatPercent(result.totalInterest / result.totalContributions, 0)} מהקרן`}
          variant="primary"
        />

        <Breakdown
          title="פירוט החישוב"
          defaultOpen
          items={[
            { label: 'קרן ראשונית', value: formatCurrency(input.principal) },
            { label: 'הפקדות חודשיות', value: formatCurrency(input.monthlyContribution) + '/ח' },
            {
              label: 'סך הפקדות',
              value: formatCurrency(result.totalContributions),
              note: `${input.years} שנים`,
            },
            { label: 'ריבית שנתית', value: formatPercent(input.annualRate / 100) },
            { label: 'תקופה', value: `${input.years} שנים` },
            { label: 'סך הריבית', value: formatCurrency(result.totalInterest), bold: true },
            { label: 'סכום סופי', value: formatCurrency(result.finalAmount), bold: true },
          ]}
        />

        {sampleYears.length > 0 && (
          <Breakdown
            title="התקדמות לאורך זמן"
            items={sampleYears.map((y) => ({
              label: `שנה ${y.year}`,
              value: formatCurrency(y.balance),
              note: `ריבית שנצברה: ${formatCurrency(y.interest)}`,
            }))}
          />
        )}
      </div>
    </div>
  );
}
