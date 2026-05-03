'use client';

import { useState, useMemo } from 'react';
import { calculateLoanRepayment, type LoanRepaymentInput } from '@/lib/calculators/savings';
import { formatCurrency } from '@/lib/utils/formatters';
import { ResultCard } from '@/components/calculator/ResultCard';
import { Breakdown } from '@/components/calculator/Breakdown';
import { CheckCircle2 } from 'lucide-react';

const initialInput: LoanRepaymentInput = {
  loanAmount: 100000,
  annualRate: 5.5,
  termMonths: 60,
  extraMonthlyPayment: 0,
  oneTimePayment: 0,
};

export function LoanRepaymentCalculator() {
  const [input, setInput] = useState<LoanRepaymentInput>(initialInput);

  const result = useMemo(() => calculateLoanRepayment(input), [input]);

  function update<K extends keyof LoanRepaymentInput>(field: K, value: LoanRepaymentInput[K]) {
    setInput((prev) => ({ ...prev, [field]: value }));
  }

  return (
    <div className="grid lg:grid-cols-5 gap-6">
      <div className="lg:col-span-3 bg-white border-2 border-gray-200 rounded-xl p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">פרטי ההלוואה</h2>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              סכום ההלוואה (ש"ח)
            </label>
            <input
              type="number"
              min={0}
              step={1000}
              value={input.loanAmount}
              onChange={(e) => update('loanAmount', Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-lg"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ריבית שנתית (%)
              </label>
              <input
                type="number"
                min={0}
                max={30}
                step={0.1}
                value={input.annualRate}
                onChange={(e) => update('annualRate', Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                תקופה (חודשים)
              </label>
              <input
                type="number"
                min={1}
                max={360}
                value={input.termMonths}
                onChange={(e) => update('termMonths', Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">{(input.termMonths / 12).toFixed(1)} שנים</p>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-bold text-blue-900 mb-2">⚡ סילוק מואץ (אופציונלי)</h3>
            <p className="text-xs text-blue-800 mb-3">
              הוסף תשלומים נוספים כדי לסיים מהר יותר ולחסוך ריבית
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  תשלום נוסף חודשי
                </label>
                <input
                  type="number"
                  min={0}
                  step={100}
                  value={input.extraMonthlyPayment}
                  onChange={(e) => update('extraMonthlyPayment', Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  תשלום חד-פעמי
                </label>
                <input
                  type="number"
                  min={0}
                  step={1000}
                  value={input.oneTimePayment}
                  onChange={(e) => update('oneTimePayment', Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="lg:col-span-2 space-y-4">
        <ResultCard
          title="תשלום חודשי"
          value={formatCurrency(result.monthlyPayment)}
          subtitle={`${input.termMonths} חודשים`}
          variant="primary"
        />

        <ResultCard
          title="סך הריבית הרגיל"
          value={formatCurrency(result.totalInterest)}
          subtitle={`${((result.totalInterest / input.loanAmount) * 100).toFixed(0)}% מהקרן`}
          variant="warning"
        />

        {(input.extraMonthlyPayment > 0 || input.oneTimePayment > 0) && (
          <div className="bg-green-50 border-2 border-green-200 rounded-xl p-5">
            <div className="flex items-start gap-3 mb-4">
              <CheckCircle2 className="w-8 h-8 text-green-600 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-green-900 text-lg">חיסכון מהסילוק המואץ! 🎉</h3>
                <p className="text-sm text-green-800">
                  תסיים את ההלוואה {result.monthsSaved} חודשים מוקדם יותר
                </p>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>חיסכון בריבית:</span>
                <strong className="text-green-700">
                  {formatCurrency(result.interestSaved)}
                </strong>
              </div>
              <div className="flex justify-between">
                <span>תקופה מואצת:</span>
                <strong>{result.acceleratedTermMonths} חודשים</strong>
              </div>
              <div className="flex justify-between">
                <span>ריבית מואצת:</span>
                <strong>{formatCurrency(result.acceleratedTotalInterest)}</strong>
              </div>
            </div>
          </div>
        )}

        <Breakdown
          title="פירוט"
          defaultOpen
          items={[
            { label: 'סכום הלוואה', value: formatCurrency(input.loanAmount) },
            { label: 'ריבית שנתית', value: `${input.annualRate}%` },
            { label: 'תקופה', value: `${input.termMonths} חודשים` },
            { label: 'תשלום חודשי', value: formatCurrency(result.monthlyPayment), bold: true },
            { label: 'סך תשלומים', value: formatCurrency(result.totalPayments) },
            { label: 'סך ריבית', value: formatCurrency(result.totalInterest), bold: true },
            ...(input.extraMonthlyPayment > 0 || input.oneTimePayment > 0
              ? [
                  {
                    label: 'תשלום נוסף חודשי',
                    value: formatCurrency(input.extraMonthlyPayment),
                  },
                  {
                    label: 'חודשים שחסכת',
                    value: `${result.monthsSaved} חודשים`,
                    bold: true,
                  },
                  {
                    label: 'ריבית שחסכת',
                    value: formatCurrency(result.interestSaved),
                    bold: true,
                  },
                ]
              : []),
          ]}
        />
      </div>
    </div>
  );
}
