'use client';

import { useState, useMemo } from 'react';
import {
  calculateReserveDutyPay,
  type ReserveDutyInput,
  type EmploymentStatus,
} from '@/lib/calculators/reserve-duty-pay';
import { formatCurrency } from '@/lib/utils/formatters';
import { ResultCard } from '@/components/calculator/ResultCard';

const initial: ReserveDutyInput = {
  recentMonthlySalary: 12_000,
  reserveDays: 30,
  employmentStatus: 'employee',
  eligibleForSpecialGrants: true,
};

export function ReserveDutyPayCalculator() {
  const [input, setInput] = useState<ReserveDutyInput>(initial);
  const result = useMemo(() => calculateReserveDutyPay(input), [input]);

  function update<K extends keyof ReserveDutyInput>(k: K, v: ReserveDutyInput[K]) {
    setInput((p) => ({ ...p, [k]: v }));
  }

  return (
    <div className="grid lg:grid-cols-5 gap-6">
      <div className="lg:col-span-3 bg-white border-2 border-gray-200 rounded-xl p-6 space-y-5">
        <h2 className="text-xl font-bold text-gray-900">פרטי השירות</h2>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">סטטוס תעסוקתי</label>
          <select
            value={input.employmentStatus}
            onChange={(e) => update('employmentStatus', e.target.value as EmploymentStatus)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          >
            <option value="employee">שכיר</option>
            <option value="self-employed">עצמאי</option>
            <option value="unemployed">חסר תעסוקה / סטודנט</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            שכר חודשי ממוצע 3 חודשים (₪)
          </label>
          <input
            type="number"
            min={0}
            step={500}
            value={input.recentMonthlySalary}
            onChange={(e) => update('recentMonthlySalary', Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-lg"
          />
          <p className="text-xs text-gray-500 mt-1">תקרה: 51,910 ₪/חודש</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">ימי מילואים</label>
          <input
            type="number"
            min={0}
            max={365}
            value={input.reserveDays}
            onChange={(e) => update('reserveDays', Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-lg"
          />
        </div>

        <label className="flex items-start gap-2 p-3 bg-emerald-50 border border-emerald-300 rounded-lg cursor-pointer">
          <input
            type="checkbox"
            checked={input.eligibleForSpecialGrants}
            onChange={(e) => update('eligibleForSpecialGrants', e.target.checked)}
            className="w-4 h-4 mt-1"
          />
          <div>
            <span className="text-sm font-semibold text-emerald-900">
              זכאי למענקי "חרבות ברזל"
            </span>
            <p className="text-xs text-emerald-800 mt-1">
              מענק יום מילואים מיוחד: 280 ₪/יום נוספים (תוקף 2024-2026)
            </p>
          </div>
        </label>
      </div>

      <div className="lg:col-span-2 space-y-4">
        <ResultCard
          title="סך תגמולי המילואים"
          value={formatCurrency(result.totalCompensation)}
          subtitle={`${input.reserveDays} ימי מילואים`}
          variant="success"
        />

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">תשלום יומי בסיסי:</span>
            <span className="font-medium">{formatCurrency(result.dailyPayment)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">תשלום בסיסי כולל:</span>
            <span className="font-medium">{formatCurrency(result.totalBasicPayment)}</span>
          </div>
          {result.totalSpecialGrant > 0 && (
            <>
              <div className="flex justify-between text-emerald-700">
                <span>מענק חרבות ברזל ({input.reserveDays}× 280 ₪):</span>
                <span className="font-medium">+{formatCurrency(result.totalSpecialGrant)}</span>
              </div>
            </>
          )}
          <div className="flex justify-between pt-2 border-t font-bold">
            <span>סה"כ:</span>
            <span>{formatCurrency(result.totalCompensation)}</span>
          </div>
        </div>

        {result.notes.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-900 space-y-1">
            {result.notes.map((note, i) => (
              <p key={i}>💡 {note}</p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
