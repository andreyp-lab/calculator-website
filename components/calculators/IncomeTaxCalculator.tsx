'use client';

import { useState, useMemo } from 'react';
import { calculateIncomeTax, type IncomeTaxInput } from '@/lib/calculators/income-tax';
import { formatCurrency, formatPercent } from '@/lib/utils/formatters';
import { ResultCard } from '@/components/calculator/ResultCard';
import { Breakdown } from '@/components/calculator/Breakdown';

const initialInput: IncomeTaxInput = {
  monthlySalary: 15000,
  creditPoints: 2.25,
  hasPension: false,
  pensionPercentage: 6,
};

export function IncomeTaxCalculator() {
  const [input, setInput] = useState<IncomeTaxInput>(initialInput);

  const result = useMemo(() => calculateIncomeTax(input), [input]);

  function updateField<K extends keyof IncomeTaxInput>(field: K, value: IncomeTaxInput[K]) {
    setInput((prev) => ({ ...prev, [field]: value }));
  }

  return (
    <div className="grid lg:grid-cols-5 gap-6">
      {/* Form */}
      <div className="lg:col-span-3 bg-white border-2 border-gray-200 rounded-xl p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">פרטי השכר</h2>

        <div className="space-y-5">
          {/* Monthly Salary */}
          <div>
            <label htmlFor="salary" className="block text-sm font-medium text-gray-700 mb-2">
              משכורת חודשית ברוטו (ש"ח)
            </label>
            <input
              id="salary"
              type="number"
              min={0}
              max={500000}
              step={100}
              value={input.monthlySalary}
              onChange={(e) => updateField('monthlySalary', Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
            />
          </div>

          {/* Credit Points */}
          <div>
            <label htmlFor="credits" className="block text-sm font-medium text-gray-700 mb-2">
              מספר נקודות זיכוי
            </label>
            <input
              id="credits"
              type="number"
              min={0}
              max={10}
              step={0.25}
              value={input.creditPoints}
              onChange={(e) => updateField('creditPoints', Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">
              תושב = 2.25, אישה = 2.75, +2.5 לכל ילד 1-5, +1 לכל ילד 6-17
            </p>
          </div>

          {/* Pension */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <label className="flex items-center gap-2 cursor-pointer mb-3">
              <input
                type="checkbox"
                checked={input.hasPension}
                onChange={(e) => updateField('hasPension', e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-900">
                כולל הפרשה לפנסיה (ניכוי משכר)
              </span>
            </label>
            {input.hasPension && (
              <div>
                <label htmlFor="pensionPct" className="block text-xs text-gray-700 mb-1">
                  אחוז הפרשת עובד (%)
                </label>
                <input
                  id="pensionPct"
                  type="number"
                  min={0}
                  max={20}
                  step={0.1}
                  value={input.pensionPercentage}
                  onChange={(e) => updateField('pensionPercentage', Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="lg:col-span-2 space-y-4">
        <ResultCard
          title="שכר נטו חודשי"
          value={formatCurrency(result.monthlyNet)}
          subtitle={`מתוך ברוטו ${formatCurrency(result.monthlyGross)}`}
          variant="success"
        >
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">שיעור מס אפקטיבי:</span>
              <span className="font-medium">{formatPercent(result.effectiveTaxRate, 2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">סה"כ ניכויים חודשי:</span>
              <span className="font-medium">
                {formatCurrency(
                  result.monthlyTaxAfterCredits +
                    result.monthlySocialSecurity +
                    result.monthlyPension
                )}
              </span>
            </div>
          </div>
        </ResultCard>

        <ResultCard
          title="מס הכנסה חודשי"
          value={formatCurrency(result.monthlyTaxAfterCredits)}
          subtitle={`לאחר ${result.creditPoints} נקודות זיכוי`}
          variant="primary"
        />

        <Breakdown
          title="פירוט החישוב"
          defaultOpen
          items={[
            { label: 'משכורת ברוטו', value: formatCurrency(result.monthlyGross) },
            ...result.taxByBracket.map((b) => ({
              label: `מס ${formatPercent(b.rate, 0)}`,
              value: formatCurrency(b.taxInBracket / 12),
              note: `על ${formatCurrency(b.amountInBracket / 12)}/חודש`,
            })),
            {
              label: 'מס לפני זיכוי',
              value: formatCurrency(result.monthlyTaxBeforeCredits),
              bold: true,
            },
            {
              label: 'נקודות זיכוי',
              value: `-${formatCurrency(result.monthlyCreditAmount)}`,
              note: `${result.creditPoints} × 242 ₪`,
            },
            {
              label: 'מס הכנסה לתשלום',
              value: formatCurrency(result.monthlyTaxAfterCredits),
              bold: true,
            },
            {
              label: 'ב.ל. + בריאות',
              value: formatCurrency(result.monthlySocialSecurity),
              note: `${formatCurrency(result.socialSecurityReduced)} מופחת + ${formatCurrency(result.socialSecurityFull)} מלא`,
            },
            ...(result.monthlyPension > 0
              ? [
                  {
                    label: 'הפרשה לפנסיה',
                    value: formatCurrency(result.monthlyPension),
                    note: `${input.pensionPercentage}% מהשכר`,
                  },
                ]
              : []),
            { label: 'נטו לתשלום', value: formatCurrency(result.monthlyNet), bold: true },
          ]}
        />
      </div>
    </div>
  );
}
