'use client';

import { useState, useMemo } from 'react';
import { calculateRetirement, type RetirementInput } from '@/lib/calculators/investments';
import { formatCurrency, formatPercent } from '@/lib/utils/formatters';
import { ResultCard } from '@/components/calculator/ResultCard';
import { Breakdown } from '@/components/calculator/Breakdown';
import { CheckCircle2, AlertTriangle } from 'lucide-react';

const initialInput: RetirementInput = {
  currentAge: 35,
  retirementAge: 67,
  currentSavings: 100000,
  monthlyContribution: 2000,
  expectedReturn: 6,
  desiredMonthlyIncome: 12000,
  yearsInRetirement: 20,
  inflationRate: 2.5,
};

export function RetirementCalculator() {
  const [input, setInput] = useState<RetirementInput>(initialInput);

  const result = useMemo(() => calculateRetirement(input), [input]);

  function update<K extends keyof RetirementInput>(field: K, value: RetirementInput[K]) {
    setInput((prev) => ({ ...prev, [field]: value }));
  }

  return (
    <div className="grid lg:grid-cols-5 gap-6">
      <div className="lg:col-span-3 bg-white border-2 border-gray-200 rounded-xl p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">פרטי תכנון</h2>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">גיל נוכחי</label>
              <input
                type="number"
                min={18}
                max={80}
                value={input.currentAge}
                onChange={(e) => update('currentAge', Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">גיל פרישה</label>
              <input
                type="number"
                min={50}
                max={80}
                value={input.retirementAge}
                onChange={(e) => update('retirementAge', Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">גיל פרישה בישראל: 67 (גבר), 65 (אישה)</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              חיסכון נוכחי (ש"ח)
            </label>
            <input
              type="number"
              min={0}
              step={10000}
              value={input.currentSavings}
              onChange={(e) => update('currentSavings', Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-lg"
            />
            <p className="text-xs text-gray-500 mt-1">
              סך הקרנות שלך: פנסיה, השתלמות, חיסכון פרטי
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              הפקדה חודשית (ש"ח)
            </label>
            <input
              type="number"
              min={0}
              step={100}
              value={input.monthlyContribution}
              onChange={(e) => update('monthlyContribution', Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              כולל הפרשות מעסיק לפנסיה (כ-18.5% מהשכר)
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                תשואה צפויה (%)
              </label>
              <input
                type="number"
                min={0}
                max={20}
                step={0.5}
                value={input.expectedReturn}
                onChange={(e) => update('expectedReturn', Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">אינפלציה (%)</label>
              <input
                type="number"
                min={0}
                max={10}
                step={0.1}
                value={input.inflationRate}
                onChange={(e) => update('inflationRate', Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-200">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                הכנסה רצויה בפרישה
              </label>
              <input
                type="number"
                min={0}
                step={500}
                value={input.desiredMonthlyIncome}
                onChange={(e) => update('desiredMonthlyIncome', Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">בערכים של היום</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                שנים בפרישה
              </label>
              <input
                type="number"
                min={5}
                max={40}
                value={input.yearsInRetirement}
                onChange={(e) => update('yearsInRetirement', Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">תוחלת חיים: ~85</p>
            </div>
          </div>
        </div>
      </div>

      <div className="lg:col-span-2 space-y-4">
        {result.isOnTrack ? (
          <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-8 h-8 text-green-600 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-green-900 text-lg mb-1">אתה במסלול! 🎉</h3>
                <p className="text-sm text-green-800">
                  על פי החישובים, החיסכון שלך יספיק לכל תקופת הפרישה.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-amber-50 border-2 border-amber-300 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-8 h-8 text-amber-600 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-amber-900 text-lg mb-1">לא במסלול ⚠️</h3>
                <p className="text-sm text-amber-800">
                  צריך להוסיף עוד <strong>{formatCurrency(result.additionalMonthlyNeeded)}</strong>{' '}
                  לחודש כדי לסגור את הפער
                </p>
              </div>
            </div>
          </div>
        )}

        <ResultCard
          title="חיסכון צפוי בפרישה"
          value={formatCurrency(result.projectedSavings)}
          subtitle={`בעוד ${result.yearsUntilRetirement} שנים`}
          variant="primary"
        />

        <ResultCard
          title="חיסכון נדרש"
          value={formatCurrency(result.requiredSavings)}
          subtitle={`לכיסוי ${input.yearsInRetirement} שנות פרישה`}
          variant="success"
        />

        {result.shortfall > 0 && (
          <ResultCard
            title="פער"
            value={formatCurrency(result.shortfall)}
            subtitle="חסר כדי לסגור"
            variant="warning"
          />
        )}

        <Breakdown
          title="פירוט"
          items={[
            { label: 'גיל נוכחי', value: `${input.currentAge}` },
            { label: 'גיל פרישה', value: `${input.retirementAge}` },
            { label: 'שנים עד פרישה', value: `${result.yearsUntilRetirement}` },
            { label: 'חיסכון נוכחי', value: formatCurrency(input.currentSavings) },
            {
              label: 'הפקדה חודשית',
              value: formatCurrency(input.monthlyContribution),
            },
            {
              label: 'סה"כ הפקדות צפויות',
              value: formatCurrency(input.monthlyContribution * 12 * result.yearsUntilRetirement),
            },
            { label: 'תשואה צפויה', value: formatPercent(input.expectedReturn / 100) },
            {
              label: 'הכנסה צפויה לחודש',
              value: formatCurrency(input.desiredMonthlyIncome),
              note: 'בערכי היום',
            },
            {
              label: 'הכנסה מותאמת לאינפלציה',
              value: formatCurrency(
                input.desiredMonthlyIncome *
                  Math.pow(1 + input.inflationRate / 100, result.yearsUntilRetirement),
              ),
              note: `בעוד ${result.yearsUntilRetirement} שנים`,
            },
          ]}
        />
      </div>
    </div>
  );
}
