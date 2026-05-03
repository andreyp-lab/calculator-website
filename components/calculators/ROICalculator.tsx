'use client';

import { useState, useMemo } from 'react';
import { calculateROI, type ROIInput } from '@/lib/calculators/investments';
import { formatCurrency, formatPercent } from '@/lib/utils/formatters';
import { ResultCard } from '@/components/calculator/ResultCard';
import { Breakdown } from '@/components/calculator/Breakdown';

const initialInput: ROIInput = {
  initialInvestment: 100000,
  finalValue: 150000,
  years: 3,
  additionalCosts: 0,
  additionalIncome: 0,
};

export function ROICalculator() {
  const [input, setInput] = useState<ROIInput>(initialInput);

  const result = useMemo(() => calculateROI(input), [input]);

  function update<K extends keyof ROIInput>(field: K, value: ROIInput[K]) {
    setInput((prev) => ({ ...prev, [field]: value }));
  }

  return (
    <div className="grid lg:grid-cols-5 gap-6">
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
              value={input.initialInvestment}
              onChange={(e) => update('initialInvestment', Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              שווי סופי / סכום שנמכר (ש"ח)
            </label>
            <input
              type="number"
              min={0}
              step={1000}
              value={input.finalValue}
              onChange={(e) => update('finalValue', Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              תקופת ההשקעה (שנים)
            </label>
            <input
              type="number"
              min={0.1}
              max={50}
              step={0.1}
              value={input.years}
              onChange={(e) => update('years', Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">לחישוב תשואה שנתית מנורמלת</p>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-200">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                עלויות נוספות (ש"ח)
              </label>
              <input
                type="number"
                min={0}
                step={100}
                value={input.additionalCosts}
                onChange={(e) => update('additionalCosts', Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">עמלות, מס, תחזוקה...</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                הכנסות נוספות (ש"ח)
              </label>
              <input
                type="number"
                min={0}
                step={100}
                value={input.additionalIncome}
                onChange={(e) => update('additionalIncome', Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">דיבידנדים, שכ"ד...</p>
            </div>
          </div>
        </div>
      </div>

      <div className="lg:col-span-2 space-y-4">
        <ResultCard
          title="ROI כולל"
          value={formatPercent(result.roi / 100, 1)}
          subtitle={result.isPositive ? '✓ השקעה רווחית' : '✗ השקעה הפסידה'}
          variant={result.isPositive ? 'success' : 'warning'}
        />

        <ResultCard
          title="תשואה שנתית מנורמלת"
          value={formatPercent(result.annualizedROI / 100, 2)}
          subtitle={`לפי ${input.years} שנים`}
          variant="primary"
        />

        <ResultCard
          title="רווח/הפסד נטו"
          value={formatCurrency(result.netProfit)}
          subtitle={`מתוך ${formatCurrency(input.initialInvestment)} השקעה`}
          variant={result.isPositive ? 'success' : 'warning'}
        />

        <Breakdown
          title="פירוט החישוב"
          defaultOpen
          items={[
            { label: 'השקעה ראשונית', value: formatCurrency(input.initialInvestment) },
            { label: 'עלויות נוספות', value: formatCurrency(input.additionalCosts) },
            {
              label: 'סך עלות',
              value: formatCurrency(input.initialInvestment + input.additionalCosts),
              bold: true,
            },
            { label: 'שווי סופי', value: formatCurrency(input.finalValue) },
            { label: 'הכנסות נוספות', value: formatCurrency(input.additionalIncome) },
            { label: 'סך תמורה', value: formatCurrency(result.totalReturn), bold: true },
            { label: 'רווח נטו', value: formatCurrency(result.netProfit), bold: true },
          ]}
        />

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs">
          <p className="font-medium text-gray-800 mb-1">💡 איך לפרש את התוצאה:</p>
          <ul className="text-gray-700 space-y-0.5">
            <li>• ROI שנתי 7-10% = השקעה סבירה (כמו S&P 500)</li>
            <li>• ROI שנתי מעל 15% = השקעה מצוינת אבל בדוק סיכון</li>
            <li>• ROI שלילי = השקעה כושלת - בחן מה השתבש</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
