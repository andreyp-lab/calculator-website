'use client';

import { useState, useMemo } from 'react';
import {
  calculatePurchaseTax,
  type PurchaseTaxInput,
  type BuyerType,
  BUYER_TYPE_LABELS,
} from '@/lib/calculators/purchase-tax';
import { formatCurrency, formatPercent } from '@/lib/utils/formatters';
import { ResultCard } from '@/components/calculator/ResultCard';
import { Breakdown } from '@/components/calculator/Breakdown';

const initialInput: PurchaseTaxInput = {
  propertyValue: 2500000,
  buyerType: 'first-home',
  isYoung: false,
};

export function PurchaseTaxCalculator() {
  const [input, setInput] = useState<PurchaseTaxInput>(initialInput);

  const result = useMemo(() => calculatePurchaseTax(input), [input]);

  function update<K extends keyof PurchaseTaxInput>(field: K, value: PurchaseTaxInput[K]) {
    setInput((prev) => ({ ...prev, [field]: value }));
  }

  return (
    <div className="grid lg:grid-cols-5 gap-6">
      <div className="lg:col-span-3 bg-white border-2 border-gray-200 rounded-xl p-6 space-y-5">
        <h2 className="text-xl font-bold text-gray-900">פרטי הרכישה</h2>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            שווי הדירה (ש"ח)
          </label>
          <input
            type="number"
            min={0}
            step={50000}
            value={input.propertyValue}
            onChange={(e) => update('propertyValue', Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-lg"
          />
          <p className="text-xs text-gray-500 mt-1">
            מחיר הדירה כפי שהוסכם בחוזה הרכישה
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">סוג הרוכש</label>
          <div className="space-y-2">
            {(Object.keys(BUYER_TYPE_LABELS) as BuyerType[]).map((type) => (
              <label
                key={type}
                className={`flex items-start gap-2 p-3 border-2 rounded-lg cursor-pointer transition ${
                  input.buyerType === type
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  checked={input.buyerType === type}
                  onChange={() => update('buyerType', type)}
                  className="mt-1"
                />
                <div className="flex-1">
                  <div className="font-medium text-sm">{BUYER_TYPE_LABELS[type]}</div>
                  <div className="text-xs text-gray-600 mt-1">
                    {type === 'first-home' && 'תושב ישראל ללא דירה אחרת - פטור עד 1,978,745 ₪'}
                    {type === 'replacement' && 'מוכר דירה ישנה וקונה חדשה - אותן מדרגות'}
                    {type === 'investor' && 'יש דירה אחרת / משקיע - מדרגות גבוהות יותר'}
                    {type === 'oleh' && 'עולה חדש - שיעור מופחת 0.5% עד 5 מיליון'}
                    {type === 'disabled' && 'נכה / נפגע פעולת איבה - פטור מוגבר'}
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="lg:col-span-2 space-y-4">
        <ResultCard
          title="מס רכישה לתשלום"
          value={formatCurrency(result.totalTax)}
          subtitle={
            result.fullExemption
              ? '🎉 פטור מלא ממס!'
              : `${formatPercent(result.effectiveRate / 100, 2)} מהשווי`
          }
          variant={result.fullExemption ? 'success' : 'primary'}
        />

        {result.notes.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <h4 className="font-semibold text-blue-900 text-sm mb-2">הערות:</h4>
            <ul className="text-xs text-blue-800 space-y-1">
              {result.notes.map((note, i) => (
                <li key={i}>• {note}</li>
              ))}
            </ul>
          </div>
        )}

        {result.breakdown.length > 0 && (
          <div className="bg-white border-2 border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
              <h4 className="font-semibold text-gray-900 text-sm">פירוט לפי מדרגות</h4>
            </div>
            <table className="w-full text-xs">
              <thead className="bg-gray-50 text-gray-700">
                <tr>
                  <th className="px-3 py-2 text-right">מדרגה</th>
                  <th className="px-3 py-2 text-right">סכום במדרגה</th>
                  <th className="px-3 py-2 text-right">מס</th>
                </tr>
              </thead>
              <tbody>
                {result.breakdown.map((b, i) => (
                  <tr key={i} className="border-b border-gray-100">
                    <td className="px-3 py-2">
                      <div className="font-bold text-blue-700">{b.bracket}</div>
                      <div className="text-gray-500 text-xs">{b.range}</div>
                    </td>
                    <td className="px-3 py-2">{formatCurrency(b.amountInBracket)}</td>
                    <td className="px-3 py-2 font-medium">{formatCurrency(b.taxInBracket)}</td>
                  </tr>
                ))}
                <tr className="bg-blue-50 font-bold">
                  <td className="px-3 py-2" colSpan={2}>
                    סה"כ
                  </td>
                  <td className="px-3 py-2 text-blue-700">{formatCurrency(result.totalTax)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        <Breakdown
          title="פירוט"
          items={[
            { label: 'שווי הדירה', value: formatCurrency(input.propertyValue) },
            { label: 'סוג רוכש', value: BUYER_TYPE_LABELS[input.buyerType] },
            { label: 'מס רכישה', value: formatCurrency(result.totalTax), bold: true },
            { label: 'שיעור אפקטיבי', value: formatPercent(result.effectiveRate / 100, 2) },
            {
              label: 'סכום אחרי מס',
              value: formatCurrency(input.propertyValue + result.totalTax),
              note: 'דירה + מס רכישה',
              bold: true,
            },
          ]}
        />
      </div>
    </div>
  );
}
