'use client';

import { useState, useMemo } from 'react';
import {
  calculateBusinessValuation,
  INDUSTRIES_LIST,
  type BusinessValuationInput,
  type IndustryType,
} from '@/lib/calculators/business-valuation';
import { formatCurrency } from '@/lib/utils/formatters';
import { ResultCard } from '@/components/calculator/ResultCard';

const initial: BusinessValuationInput = {
  annualRevenue: 5_000_000,
  ebitda: 800_000,
  netProfit: 600_000,
  industry: 'services',
  growthRate: 5,
  yearsToProject: 5,
  discountRate: 12,
};

export function BusinessValuationCalculator() {
  const [input, setInput] = useState<BusinessValuationInput>(initial);
  const result = useMemo(() => calculateBusinessValuation(input), [input]);

  function update<K extends keyof BusinessValuationInput>(
    k: K,
    v: BusinessValuationInput[K],
  ) {
    setInput((p) => ({ ...p, [k]: v }));
  }

  return (
    <div className="grid lg:grid-cols-5 gap-6">
      <div className="lg:col-span-3 bg-white border-2 border-gray-200 rounded-xl p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">נתוני העסק</h2>
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">ענף</label>
            <select
              value={input.industry}
              onChange={(e) => update('industry', e.target.value as IndustryType)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              {INDUSTRIES_LIST.map((i) => (
                <option key={i.key} value={i.key}>
                  {i.label} (מכפיל EBITDA: {i.ebitda}x)
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                הכנסות שנתיות (₪)
              </label>
              <input
                type="number"
                min={0}
                step={100_000}
                value={input.annualRevenue}
                onChange={(e) => update('annualRevenue', Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                רווח נקי שנתי (₪)
              </label>
              <input
                type="number"
                min={0}
                step={50_000}
                value={input.netProfit}
                onChange={(e) => update('netProfit', Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              EBITDA שנתי (₪)
            </label>
            <input
              type="number"
              min={0}
              step={50_000}
              value={input.ebitda}
              onChange={(e) => update('ebitda', Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              רווח לפני ריבית, מס, פחת והפחתות (Earnings Before Interest, Tax, D&A)
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                צמיחה שנתית (%)
              </label>
              <input
                type="number"
                min={-20}
                max={100}
                step={1}
                value={input.growthRate}
                onChange={(e) => update('growthRate', Number(e.target.value))}
                className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                תקופה (שנים)
              </label>
              <input
                type="number"
                min={1}
                max={10}
                value={input.yearsToProject}
                onChange={(e) => update('yearsToProject', Number(e.target.value))}
                className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                שיעור היוון (%)
              </label>
              <input
                type="number"
                min={5}
                max={30}
                step={0.5}
                value={input.discountRate}
                onChange={(e) => update('discountRate', Number(e.target.value))}
                className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              מכפיל EBITDA מותאם (אופציונלי)
            </label>
            <input
              type="number"
              min={0}
              max={20}
              step={0.5}
              value={input.customMultiple ?? ''}
              placeholder={`ברירת מחדל לענף: ${result.appliedMultiple}x`}
              onChange={(e) =>
                update('customMultiple', e.target.value ? Number(e.target.value) : undefined)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      <div className="lg:col-span-2 space-y-4">
        <ResultCard
          title="הערכת שווי ממוצעת"
          value={formatCurrency(result.averageValue)}
          subtitle={result.valuationLabel}
          variant="success"
        />

        <div className="bg-gradient-to-br from-emerald-50 to-blue-50 border border-emerald-200 rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 mb-2 text-sm">טווח שווי</h4>
          <div className="text-xs text-gray-700 mb-1">
            מ-{formatCurrency(result.range.low)} עד {formatCurrency(result.range.high)}
          </div>
          <div className="h-2 bg-gradient-to-r from-blue-300 via-emerald-400 to-blue-300 rounded-full" />
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-2 text-sm">
          <h4 className="font-semibold text-gray-900 mb-2">לפי שיטת חישוב</h4>
          <div className="flex justify-between">
            <span className="text-gray-600">DCF (היוון תזרים):</span>
            <span className="font-medium">{formatCurrency(result.dcfValue)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">מכפיל EBITDA × {result.appliedMultiple}:</span>
            <span className="font-medium">{formatCurrency(result.ebitdaMultipleValue)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">מכפיל הכנסות:</span>
            <span className="font-medium">{formatCurrency(result.revenueMultipleValue)}</span>
          </div>
          <div className="flex justify-between pt-2 border-t border-gray-200">
            <span className="text-gray-600">Terminal Value:</span>
            <span className="font-medium">{formatCurrency(result.terminalValue)}</span>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-900">
          ⚠️ זוהי הערכה כללית בלבד. שווי בפועל תלוי גם בנכסים, חוזים, הון אנושי, סינרגיות
          ועוד. למוכר/קונה רציני - מומלץ הערכת שווי מקצועית.
        </div>
      </div>
    </div>
  );
}
