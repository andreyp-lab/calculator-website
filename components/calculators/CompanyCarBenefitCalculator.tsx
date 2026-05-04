'use client';

import { useState, useMemo } from 'react';
import {
  calculateCompanyCarBenefit,
  type CompanyCarInput,
  type CarGroup,
} from '@/lib/calculators/company-car-benefit';
import { formatCurrency } from '@/lib/utils/formatters';
import { ResultCard } from '@/components/calculator/ResultCard';

const initial: CompanyCarInput = {
  catalogPrice: 200_000,
  carGroup: 4,
  isElectric: false,
  marginalTaxRate: 35,
};

export function CompanyCarBenefitCalculator() {
  const [input, setInput] = useState<CompanyCarInput>(initial);
  const result = useMemo(() => calculateCompanyCarBenefit(input), [input]);

  function update<K extends keyof CompanyCarInput>(k: K, v: CompanyCarInput[K]) {
    setInput((p) => ({ ...p, [k]: v }));
  }

  return (
    <div className="grid lg:grid-cols-5 gap-6">
      <div className="lg:col-span-3 bg-white border-2 border-gray-200 rounded-xl p-6 space-y-5">
        <h2 className="text-xl font-bold text-gray-900">פרטי הרכב</h2>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            מחיר קטלוגי (₪)
          </label>
          <input
            type="number"
            min={0}
            step={5000}
            value={input.catalogPrice}
            onChange={(e) => update('catalogPrice', Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-lg"
          />
          <p className="text-xs text-gray-500 mt-1">
            המחיר הקטלוגי של הרכב כפי שהיה במועד הרישום
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            קבוצת רכב (1-7)
          </label>
          <select
            value={input.carGroup}
            onChange={(e) => update('carGroup', Number(e.target.value) as CarGroup)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          >
            <option value={1}>1 - 2.04% (רכב קטן)</option>
            <option value={2}>2 - 2.39%</option>
            <option value={3}>3 - 2.74%</option>
            <option value={4}>4 - 3.06% (בינוני - ברירת מחדל)</option>
            <option value={5}>5 - 3.27%</option>
            <option value={6}>6 - 3.46%</option>
            <option value={7}>7 - 3.65% (יוקרה)</option>
          </select>
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
            value={input.marginalTaxRate}
            onChange={(e) => update('marginalTaxRate', Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
          <p className="text-xs text-gray-500 mt-1">
            לרוב 31-50% (לפי מדרגת השכר)
          </p>
        </div>

        <label className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-300 rounded-lg cursor-pointer">
          <input
            type="checkbox"
            checked={input.isElectric}
            onChange={(e) => update('isElectric', e.target.checked)}
            className="w-4 h-4"
          />
          <span className="text-sm font-medium text-emerald-900">
            רכב חשמלי (זיכוי 1,150 ₪/חודש)
          </span>
        </label>
      </div>

      <div className="lg:col-span-2 space-y-4">
        <ResultCard
          title="שווי שימוש חודשי"
          value={formatCurrency(result.taxableBenefit)}
          subtitle={`${(result.benefitPercentage * 100).toFixed(2)}% × מחיר`}
          variant="primary"
        />

        <ResultCard
          title="מס חודשי בתלוש"
          value={formatCurrency(result.monthlyTax)}
          subtitle={`עלות שנתית: ${formatCurrency(result.annualCost)}`}
          variant="success"
        />

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">שווי שימוש לפני זיכוי:</span>
            <span className="font-medium">{formatCurrency(result.monthlyBenefit)}</span>
          </div>
          {result.electricDiscount > 0 && (
            <div className="flex justify-between text-emerald-700">
              <span>זיכוי חשמלי:</span>
              <span className="font-medium">-{formatCurrency(result.electricDiscount)}</span>
            </div>
          )}
          <div className="flex justify-between pt-2 border-t font-bold">
            <span>שווי חייב במס:</span>
            <span>{formatCurrency(result.taxableBenefit)}</span>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-900">
          💡 {result.recommendation}
        </div>
      </div>
    </div>
  );
}
