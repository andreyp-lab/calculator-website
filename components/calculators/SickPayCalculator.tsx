'use client';

import { useState, useMemo } from 'react';
import { calculateSickPay } from '@/lib/calculators/employee-benefits';
import { formatCurrency } from '@/lib/utils/formatters';
import { ResultCard } from '@/components/calculator/ResultCard';

export function SickPayCalculator() {
  const [sickDays, setSickDays] = useState(5);
  const [salary, setSalary] = useState(15_000);
  const result = useMemo(
    () => calculateSickPay({ sickDays, monthlySalary: salary, consecutive: true }),
    [sickDays, salary],
  );

  return (
    <div className="grid lg:grid-cols-5 gap-6">
      <div className="lg:col-span-3 bg-white border-2 border-gray-200 rounded-xl p-6 space-y-5">
        <h2 className="text-xl font-bold text-gray-900">פרטי המחלה</h2>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ימי מחלה (רצופים)
          </label>
          <input
            type="number"
            min={0}
            max={90}
            value={sickDays}
            onChange={(e) => setSickDays(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            שכר חודשי ברוטו (₪)
          </label>
          <input
            type="number"
            min={0}
            step={500}
            value={salary}
            onChange={(e) => setSalary(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-lg"
          />
        </div>

        <div className="bg-blue-50 p-3 rounded-lg text-xs text-blue-900">
          <p className="font-bold mb-1">📋 חוק דמי מחלה</p>
          <ul className="space-y-1">
            <li>יום 1: ללא תשלום</li>
            <li>ימים 2-3: 50% מהשכר היומי</li>
            <li>יום 4 ואילך: 100% מהשכר היומי</li>
            <li>זכאות: עד 18 ימים בשנה</li>
          </ul>
        </div>
      </div>

      <div className="lg:col-span-2 space-y-4">
        <ResultCard
          title="תשלום שתקבל מהמעסיק"
          value={formatCurrency(result.totalPayment)}
          subtitle={`עבור ${sickDays} ימי מחלה`}
          variant="success"
        />

        {result.totalUnpaidLoss > 0 && (
          <ResultCard
            title="הפרש משכר רגיל"
            value={formatCurrency(result.totalUnpaidLoss)}
            subtitle="הפסד עקב חוק דמי מחלה"
            variant="primary"
          />
        )}

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm space-y-1">
          <h4 className="font-bold mb-2">פירוט פר יום</h4>
          {result.daysPayment.slice(0, 7).map((d) => (
            <div key={d.day} className="flex justify-between text-xs">
              <span>יום {d.day}:</span>
              <span>
                {(d.rate * 100).toFixed(0)}% = {formatCurrency(d.amount)}
              </span>
            </div>
          ))}
          {result.daysPayment.length > 7 && (
            <p className="text-xs text-gray-500">
              + עוד {result.daysPayment.length - 7} ימים ב-100%
            </p>
          )}
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-900">
          💡 {result.explanation}
        </div>
      </div>
    </div>
  );
}
