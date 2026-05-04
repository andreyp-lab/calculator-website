'use client';

import { useState, useMemo } from 'react';
import { calculatePersonalLoan } from '@/lib/calculators/personal-loan';
import { formatCurrency } from '@/lib/utils/formatters';
import { ResultCard } from '@/components/calculator/ResultCard';

export function PersonalLoanCalculator() {
  const [amount, setAmount] = useState(50_000);
  const [rate, setRate] = useState(7);
  const [months, setMonths] = useState(36);
  const [openingFee, setOpeningFee] = useState(500);

  const result = useMemo(
    () =>
      calculatePersonalLoan({
        loanAmount: amount,
        annualInterestRate: rate,
        termMonths: months,
        openingFee,
      }),
    [amount, rate, months, openingFee],
  );

  return (
    <div className="grid lg:grid-cols-5 gap-6">
      <div className="lg:col-span-3 bg-white border-2 border-gray-200 rounded-xl p-6 space-y-5">
        <h2 className="text-xl font-bold text-gray-900">פרטי ההלוואה</h2>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            סכום ההלוואה (₪)
          </label>
          <input
            type="number"
            min={0}
            step={1000}
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-lg"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ריבית שנתית (%)
            </label>
            <input
              type="number"
              min={0}
              max={30}
              step={0.5}
              value={rate}
              onChange={(e) => setRate(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
            <p className="text-xs text-gray-500 mt-1">בנקים: 5-12%</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">תקופה (חודשים)</label>
            <select
              value={months}
              onChange={(e) => setMonths(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value={12}>12 חודשים (שנה)</option>
              <option value={24}>24 חודשים (שנתיים)</option>
              <option value={36}>36 חודשים (3 שנים)</option>
              <option value={48}>48 חודשים (4 שנים)</option>
              <option value={60}>60 חודשים (5 שנים)</option>
              <option value={84}>84 חודשים (7 שנים)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            עמלת פתיחת תיק (₪)
          </label>
          <input
            type="number"
            min={0}
            step={50}
            value={openingFee}
            onChange={(e) => setOpeningFee(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
        </div>
      </div>

      <div className="lg:col-span-2 space-y-4">
        <ResultCard
          title="תשלום חודשי"
          value={formatCurrency(result.monthlyPayment)}
          subtitle={`${months} תשלומים`}
          variant="success"
        />

        <ResultCard
          title="סך ריבית"
          value={formatCurrency(result.totalInterest)}
          subtitle={`עלות כוללת: ${formatCurrency(result.totalCostWithFees)}`}
          variant="primary"
        />

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm space-y-2">
          <h4 className="font-bold mb-2">תקציר</h4>
          <div className="flex justify-between">
            <span>סכום הלוואה:</span>
            <span className="font-medium">{formatCurrency(amount)}</span>
          </div>
          <div className="flex justify-between">
            <span>סך תשלומים:</span>
            <span className="font-medium">{formatCurrency(result.totalPayments)}</span>
          </div>
          <div className="flex justify-between">
            <span>עמלות:</span>
            <span className="font-medium">{formatCurrency(openingFee)}</span>
          </div>
          <div className="flex justify-between pt-2 border-t font-bold text-red-700">
            <span>עלות הלוואה:</span>
            <span>{formatCurrency(result.totalCostWithFees - amount)}</span>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-900">
          ⚠️ ריבית אפקטיבית (כולל עמלות): {result.effectiveAnnualRate.toFixed(2)}%
        </div>
      </div>
    </div>
  );
}
