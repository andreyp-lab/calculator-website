'use client';

import { useState, useMemo } from 'react';
import { compareLeasingVsBuying, type LeasingInput } from '@/lib/calculators/vehicles';
import { formatCurrency } from '@/lib/utils/formatters';
import { ResultCard } from '@/components/calculator/ResultCard';
import { Breakdown } from '@/components/calculator/Breakdown';
import { CheckCircle2 } from 'lucide-react';

const initialInput: LeasingInput = {
  carPrice: 150000,
  yearsOfUse: 4,
  // ליסינג
  leasingMonthlyPayment: 2200,
  leasingDownPayment: 5000,
  leasingFinalPayment: 0,
  // קנייה
  loanAmount: 120000,
  loanTermMonths: 60,
  loanRate: 5.5,
  buyingDownPayment: 30000,
  carDepreciationRate: 18,
  // משותף
  monthlyKm: 1500,
  fuelMonthlyCost: 800,
  insuranceYearly: 4500,
  maintenanceYearly: 3000,
};

export function LeasingCalculator() {
  const [input, setInput] = useState<LeasingInput>(initialInput);

  const result = useMemo(() => compareLeasingVsBuying(input), [input]);

  function update<K extends keyof LeasingInput>(field: K, value: LeasingInput[K]) {
    setInput((prev) => ({ ...prev, [field]: value }));
  }

  return (
    <div className="space-y-6">
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Common params */}
        <div className="bg-paper border-2 border-ink/15 rounded-none p-5">
          <h3 className="font-bold text-ink mb-4">📋 פרטים כלליים</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-ink/70 mb-1">מחיר הרכב</label>
              <input
                type="number"
                value={input.carPrice}
                onChange={(e) => update('carPrice', Number(e.target.value))}
                className="w-full px-3 py-2 border border-ink/15 rounded-none text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-ink/70 mb-1">שנות שימוש</label>
              <input
                type="number"
                min={1}
                max={10}
                value={input.yearsOfUse}
                onChange={(e) => update('yearsOfUse', Number(e.target.value))}
                className="w-full px-3 py-2 border border-ink/15 rounded-none text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-ink/70 mb-1">דלק חודשי (ש"ח)</label>
              <input
                type="number"
                value={input.fuelMonthlyCost}
                onChange={(e) => update('fuelMonthlyCost', Number(e.target.value))}
                className="w-full px-3 py-2 border border-ink/15 rounded-none text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-ink/70 mb-1">ביטוח שנתי</label>
              <input
                type="number"
                value={input.insuranceYearly}
                onChange={(e) => update('insuranceYearly', Number(e.target.value))}
                className="w-full px-3 py-2 border border-ink/15 rounded-none text-sm"
              />
            </div>
          </div>
        </div>

        {/* Leasing */}
        <div className="bg-cream-2 border-2 border-ink/15 rounded-none p-5">
          <h3 className="font-bold text-ink mb-4">🚙 ליסינג</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-ink/70 mb-1">תשלום חודשי</label>
              <input
                type="number"
                value={input.leasingMonthlyPayment}
                onChange={(e) => update('leasingMonthlyPayment', Number(e.target.value))}
                className="w-full px-3 py-2 border border-ink/15 rounded-none text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-ink/70 mb-1">מקדמה</label>
              <input
                type="number"
                value={input.leasingDownPayment}
                onChange={(e) => update('leasingDownPayment', Number(e.target.value))}
                className="w-full px-3 py-2 border border-ink/15 rounded-none text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-ink/70 mb-1">
                תשלום סופי (אם תקנה את הרכב)
              </label>
              <input
                type="number"
                value={input.leasingFinalPayment}
                onChange={(e) => update('leasingFinalPayment', Number(e.target.value))}
                className="w-full px-3 py-2 border border-ink/15 rounded-none text-sm"
              />
            </div>
            <p className="text-xs text-ink/70">
              💡 ליסינג כולל בד"כ תחזוקה, ביטוח חלקי, רישוי
            </p>
          </div>
        </div>

        {/* Buying */}
        <div className="bg-cream-2 border-2 border-ink/15 rounded-none p-5">
          <h3 className="font-bold text-ink mb-4">💰 קנייה</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-ink/70 mb-1">מקדמה</label>
              <input
                type="number"
                value={input.buyingDownPayment}
                onChange={(e) => update('buyingDownPayment', Number(e.target.value))}
                className="w-full px-3 py-2 border border-ink/15 rounded-none text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-ink/70 mb-1">סכום הלוואה</label>
              <input
                type="number"
                value={input.loanAmount}
                onChange={(e) => update('loanAmount', Number(e.target.value))}
                className="w-full px-3 py-2 border border-ink/15 rounded-none text-sm"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-medium text-ink/70 mb-1">תקופה (ח')</label>
                <input
                  type="number"
                  value={input.loanTermMonths}
                  onChange={(e) => update('loanTermMonths', Number(e.target.value))}
                  className="w-full px-3 py-2 border border-ink/15 rounded-none text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-ink/70 mb-1">ריבית %</label>
                <input
                  type="number"
                  step={0.1}
                  value={input.loanRate}
                  onChange={(e) => update('loanRate', Number(e.target.value))}
                  className="w-full px-3 py-2 border border-ink/15 rounded-none text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-ink/70 mb-1">
                תחזוקה שנתית (ש"ח)
              </label>
              <input
                type="number"
                value={input.maintenanceYearly}
                onChange={(e) => update('maintenanceYearly', Number(e.target.value))}
                className="w-full px-3 py-2 border border-ink/15 rounded-none text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-ink/70 mb-1">ירידת ערך שנתית %</label>
              <input
                type="number"
                step={1}
                value={input.carDepreciationRate}
                onChange={(e) => update('carDepreciationRate', Number(e.target.value))}
                className="w-full px-3 py-2 border border-ink/15 rounded-none text-sm"
              />
              <p className="text-xs text-ink/60 mt-1">ממוצע: 15-20% בשנה</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recommendation */}
      <div
        className={`rounded-none p-6 border-2 ${
          result.recommendation === 'leasing'
            ? 'bg-cream-2 border-ink/15'
            : result.recommendation === 'buying'
              ? 'bg-green-50 border-green-300'
              : 'bg-amber-50 border-amber-300'
        }`}
      >
        <div className="flex items-start gap-3">
          <CheckCircle2
            className={`w-8 h-8 flex-shrink-0 ${
              result.recommendation === 'leasing'
                ? 'text-ink'
                : result.recommendation === 'buying'
                  ? 'text-green-600'
                  : 'text-amber-600'
            }`}
          />
          <div>
            <h3 className="font-bold text-ink text-xl mb-1">
              {result.recommendation === 'leasing' && 'ליסינג זול יותר 🚙'}
              {result.recommendation === 'buying' && 'קנייה זולה יותר 💰'}
              {result.recommendation === 'similar' && 'העלויות דומות 🤝'}
            </h3>
            <p className="text-sm text-ink/70">
              ההפרש: <strong>{formatCurrency(result.difference)}</strong> ב-{input.yearsOfUse} שנים
            </p>
          </div>
        </div>
      </div>

      {/* Detailed Comparison */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-paper border-2 border-ink/15 rounded-none p-5">
          <h3 className="font-bold text-ink text-lg mb-3">🚙 ליסינג</h3>
          <div className="space-y-1 text-sm">
            {result.leasing.breakdown.map((item, i) => (
              <div key={i} className="flex justify-between py-1 border-b border-ink/15">
                <span className="text-ink/70">{item.label}</span>
                <span>{formatCurrency(item.value)}</span>
              </div>
            ))}
            <div className="flex justify-between py-2 font-bold text-ink border-t-2 border-ink/15">
              <span>סה"כ עלות</span>
              <span>{formatCurrency(result.leasing.totalCost)}</span>
            </div>
            <div className="flex justify-between py-1 text-xs text-ink/70">
              <span>ממוצע חודשי</span>
              <span>{formatCurrency(result.leasing.monthlyAvg)}/ח</span>
            </div>
          </div>
        </div>

        <div className="bg-paper border-2 border-ink/15 rounded-none p-5">
          <h3 className="font-bold text-ink text-lg mb-3">💰 קנייה</h3>
          <div className="space-y-1 text-sm">
            {result.buying.breakdown.map((item, i) => (
              <div key={i} className="flex justify-between py-1 border-b border-ink/15">
                <span className="text-ink/70">{item.label}</span>
                <span className={item.value < 0 ? 'text-green-700' : ''}>
                  {item.value < 0 ? '-' : ''}{formatCurrency(Math.abs(item.value))}
                </span>
              </div>
            ))}
            <div className="flex justify-between py-2 font-bold text-ink border-t-2 border-ink/15">
              <span>עלות נטו</span>
              <span>{formatCurrency(result.buying.totalCost)}</span>
            </div>
            <div className="flex justify-between py-1 text-xs text-ink/70">
              <span>ממוצע חודשי</span>
              <span>{formatCurrency(result.buying.monthlyAvg)}/ח</span>
            </div>
            <p className="text-xs text-green-700 mt-2">
              💡 שווי הרכב הנותר: {formatCurrency(result.buying.finalCarValue)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
