'use client';

import { useState, useMemo } from 'react';
import {
  calculateDividendVsSalary,
  type DividendVsSalaryInput,
} from '@/lib/calculators/dividend-vs-salary';
import { formatCurrency, formatPercent } from '@/lib/utils/formatters';
import { ResultCard } from '@/components/calculator/ResultCard';

const initial: DividendVsSalaryInput = {
  companyAnnualProfit: 800_000,
  withdrawalNeeds: 500_000,
  creditPoints: 2.25,
  isMaterialShareholder: true,
};

export function DividendVsSalaryCalculator() {
  const [input, setInput] = useState<DividendVsSalaryInput>(initial);
  const result = useMemo(() => calculateDividendVsSalary(input), [input]);

  function update<K extends keyof DividendVsSalaryInput>(
    k: K,
    v: DividendVsSalaryInput[K],
  ) {
    setInput((p) => ({ ...p, [k]: v }));
  }

  const labels = {
    allSalary: 'הכל משכורת',
    allDividend: 'הכל דיבידנד',
    optimal: 'מעורב אופטימלי',
  };

  return (
    <div className="grid lg:grid-cols-5 gap-6">
      <div className="lg:col-span-2 bg-white border-2 border-gray-200 rounded-xl p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">פרטי החברה</h2>
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              רווח שנתי לפני מס (₪)
            </label>
            <input
              type="number"
              min={0}
              step={50_000}
              value={input.companyAnnualProfit}
              onChange={(e) => update('companyAnnualProfit', Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              נקודות זיכוי
            </label>
            <input
              type="number"
              min={0}
              max={10}
              step={0.25}
              value={input.creditPoints}
              onChange={(e) => update('creditPoints', Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <label className="flex items-center gap-2 cursor-pointer p-3 bg-gray-50 rounded-lg">
            <input
              type="checkbox"
              checked={input.isMaterialShareholder}
              onChange={(e) => update('isMaterialShareholder', e.target.checked)}
              className="w-4 h-4"
            />
            <span className="text-sm text-gray-700">בעל מניות מהותי (10%+)</span>
          </label>
        </div>
      </div>

      <div className="lg:col-span-3 space-y-4">
        <ResultCard
          title={`המלצה: ${labels[result.recommendation]}`}
          value={formatCurrency(result[result.recommendation].netToOwner)}
          subtitle={
            result.taxSavings > 0
              ? `חיסכון של ${formatCurrency(result.taxSavings)} לעומת "הכל משכורת"`
              : 'משכורת היא האופציה הטובה ביותר'
          }
          variant="success"
        />

        <div className="grid md:grid-cols-3 gap-3">
          {(['allSalary', 'optimal', 'allDividend'] as const).map((key) => {
            const s = result[key];
            const isRec = result.recommendation === key;
            return (
              <div
                key={key}
                className={`p-4 rounded-lg border-2 ${
                  isRec ? 'border-emerald-400 bg-emerald-50' : 'border-gray-200 bg-white'
                }`}
              >
                <h4 className="font-bold text-sm text-gray-900 mb-2">{labels[key]}</h4>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-600">משכורת:</span>
                    <span className="font-medium">{formatCurrency(s.grossSalary)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">דיבידנד:</span>
                    <span className="font-medium">{formatCurrency(s.dividend)}</span>
                  </div>
                  <div className="flex justify-between pt-1 border-t">
                    <span className="text-gray-600">סה"כ מס:</span>
                    <span className="font-medium">{formatCurrency(s.totalTax)}</span>
                  </div>
                  <div className="flex justify-between pt-1 border-t">
                    <span className="text-gray-700 font-medium">נטו:</span>
                    <span className={`font-bold ${isRec ? 'text-emerald-700' : 'text-gray-900'}`}>
                      {formatCurrency(s.netToOwner)}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-500">
                    <span>שיעור מס:</span>
                    <span>{formatPercent(s.effectiveTaxRate, 1)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {result.recommendation === 'optimal' && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-900">
            💡 <strong>השילוב האופטימלי:</strong> משכורת{' '}
            {formatCurrency(result.optimal.grossSalary)} ({result.optimal.salaryPct.toFixed(0)}%
            מהרווח) + דיבידנד {formatCurrency(result.optimal.dividend)}.
          </div>
        )}
      </div>
    </div>
  );
}
