'use client';

import { useState, useMemo } from 'react';
import {
  calculateFuelCost,
  FUEL_PRICES_2026,
  FUEL_LABELS,
  type FuelCostInput,
  type FuelType,
} from '@/lib/calculators/vehicles';
import { formatCurrency } from '@/lib/utils/formatters';
import { ResultCard } from '@/components/calculator/ResultCard';
import { Breakdown } from '@/components/calculator/Breakdown';

const initialInput: FuelCostInput = {
  monthlyKm: 1500,
  fuelEfficiency: 7,
  fuelType: 'gasoline_95',
  customPrice: 7.45,
  useCustomPrice: false,
};

export function FuelCostCalculator() {
  const [input, setInput] = useState<FuelCostInput>(initialInput);

  const result = useMemo(() => calculateFuelCost(input), [input]);

  function update<K extends keyof FuelCostInput>(field: K, value: FuelCostInput[K]) {
    setInput((prev) => ({ ...prev, [field]: value }));
  }

  const fuelUnit = input.fuelType === 'electric' ? 'קוט"ש' : 'ליטר';

  return (
    <div className="grid lg:grid-cols-5 gap-6">
      <div className="lg:col-span-3 bg-white border-2 border-gray-200 rounded-xl p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">פרטי הרכב</h2>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              קילומטראז' חודשי (ק"מ)
            </label>
            <input
              type="number"
              min={0}
              step={100}
              value={input.monthlyKm}
              onChange={(e) => update('monthlyKm', Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-lg"
            />
            <p className="text-xs text-gray-500 mt-1">ממוצע ישראלי: ~1,500 ק"מ/חודש</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">סוג דלק</label>
            <select
              value={input.fuelType}
              onChange={(e) => update('fuelType', e.target.value as FuelType)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              {(Object.keys(FUEL_LABELS) as FuelType[]).map((type) => (
                <option key={type} value={type}>
                  {FUEL_LABELS[type]} ({FUEL_PRICES_2026[type]} ₪/{type === 'electric' ? 'קוט"ש' : 'ל'})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              צריכת דלק ({fuelUnit}/100 ק"מ)
            </label>
            <input
              type="number"
              min={0}
              max={50}
              step={0.1}
              value={input.fuelEfficiency}
              onChange={(e) => update('fuelEfficiency', Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              {input.fuelType === 'electric'
                ? 'רכב חשמלי ממוצע: 18 קוט"ש/100ק"מ'
                : 'רכב משפחתי: 6-8 ל/100ק"מ, רכב גדול: 10-12'}
            </p>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
            <label className="flex items-center gap-2 cursor-pointer mb-2">
              <input
                type="checkbox"
                checked={input.useCustomPrice}
                onChange={(e) => update('useCustomPrice', e.target.checked)}
                className="w-4 h-4"
              />
              <span className="text-sm font-medium">השתמש במחיר מותאם אישית</span>
            </label>
            {input.useCustomPrice && (
              <input
                type="number"
                min={0}
                step={0.01}
                value={input.customPrice}
                onChange={(e) => update('customPrice', Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                placeholder={`מחיר ל-${fuelUnit}`}
              />
            )}
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-xs text-gray-700 mb-2 font-medium">⛽ מחירי דלק 2026:</p>
            <div className="grid grid-cols-2 gap-1 text-xs">
              <div>בנזין 95: 7.45 ₪/ל'</div>
              <div>בנזין 98: 7.85 ₪/ל'</div>
              <div>סולר: 6.95 ₪/ל'</div>
              <div>חשמל: 0.55 ₪/קוט"ש</div>
            </div>
          </div>
        </div>
      </div>

      <div className="lg:col-span-2 space-y-4">
        <ResultCard
          title="עלות חודשית"
          value={formatCurrency(result.monthlyCost)}
          subtitle={`${result.fuelPerMonth.toFixed(1)} ${fuelUnit} בחודש`}
          variant="primary"
        />

        <ResultCard
          title="עלות שנתית"
          value={formatCurrency(result.yearlyCost)}
          subtitle={`כ-${(result.fuelPerMonth * 12).toFixed(0)} ${fuelUnit} בשנה`}
          variant="warning"
        />

        <ResultCard
          title="עלות לק&quot;מ"
          value={formatCurrency(result.costPerKm) + '/ק"מ'}
          subtitle={`${input.monthlyKm.toLocaleString()} ק"מ בחודש`}
          variant="success"
        />

        <Breakdown
          title="פירוט"
          defaultOpen
          items={[
            { label: 'קילומטראז\' חודשי', value: `${input.monthlyKm.toLocaleString()} ק"מ` },
            { label: 'צריכת דלק', value: `${input.fuelEfficiency} ${fuelUnit}/100ק"מ` },
            {
              label: `מחיר ל-${fuelUnit}`,
              value: `${result.pricePerUnit} ₪`,
            },
            {
              label: `${fuelUnit} בחודש`,
              value: result.fuelPerMonth.toFixed(1),
            },
            { label: 'עלות חודשית', value: formatCurrency(result.monthlyCost), bold: true },
            { label: 'עלות שנתית', value: formatCurrency(result.yearlyCost), bold: true },
            { label: 'עלות 5 שנים', value: formatCurrency(result.yearlyCost * 5) },
          ]}
        />
      </div>
    </div>
  );
}
