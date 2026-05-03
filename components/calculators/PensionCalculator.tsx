'use client';

import { useState, useMemo } from 'react';
import { calculatePension, type PensionInput } from '@/lib/calculators/insurance';
import { formatCurrency, formatPercent } from '@/lib/utils/formatters';
import { ResultCard } from '@/components/calculator/ResultCard';
import { Breakdown } from '@/components/calculator/Breakdown';

const initialInput: PensionInput = {
  currentAge: 35,
  retirementAge: 67,
  monthlySalary: 18000,
  currentPensionSavings: 200000,
  employeeContribution: 7,
  employerContribution: 6.5,
  severanceContribution: 8.33,
  expectedReturn: 5,
  conversionRate: 205,
};

export function PensionCalculator() {
  const [input, setInput] = useState<PensionInput>(initialInput);

  const result = useMemo(() => calculatePension(input), [input]);

  function update<K extends keyof PensionInput>(field: K, value: PensionInput[K]) {
    setInput((prev) => ({ ...prev, [field]: value }));
  }

  const totalContrib =
    input.employeeContribution + input.employerContribution + input.severanceContribution;

  return (
    <div className="grid lg:grid-cols-5 gap-6">
      <div className="lg:col-span-3 bg-white border-2 border-gray-200 rounded-xl p-6 space-y-5">
        <h2 className="text-xl font-bold text-gray-900">פרטים אישיים</h2>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">גיל נוכחי</label>
            <input
              type="number"
              min={18}
              max={80}
              value={input.currentAge}
              onChange={(e) => update('currentAge', Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">גיל פרישה</label>
            <input
              type="number"
              min={50}
              max={75}
              value={input.retirementAge}
              onChange={(e) => update('retirementAge', Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
            <p className="text-xs text-gray-500 mt-1">חוק 2026: גבר 67, אישה 65</p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            שכר חודשי ברוטו (ש&quot;ח)
          </label>
          <input
            type="number"
            min={0}
            value={input.monthlySalary}
            onChange={(e) => update('monthlySalary', Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            חיסכון פנסיוני נוכחי (ש&quot;ח)
          </label>
          <input
            type="number"
            min={0}
            step={10000}
            value={input.currentPensionSavings}
            onChange={(e) => update('currentPensionSavings', Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
          <p className="text-xs text-gray-500 mt-1">
            סה&quot;כ הצבירה בקרנות הפנסיה שלך - ניתן לבדוק במסלקה
          </p>
        </div>

        <h3 className="text-md font-semibold text-gray-800 pt-3 border-t border-gray-200">
          שיעורי הפרשה
        </h3>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-xs text-gray-700 mb-1">עובד (%)</label>
            <input
              type="number"
              min={0}
              max={10}
              step={0.1}
              value={input.employeeContribution}
              onChange={(e) => update('employeeContribution', Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
            />
            <p className="text-xs text-gray-500 mt-1">חוק: 6-7%</p>
          </div>
          <div>
            <label className="block text-xs text-gray-700 mb-1">מעסיק (%)</label>
            <input
              type="number"
              min={0}
              max={10}
              step={0.1}
              value={input.employerContribution}
              onChange={(e) => update('employerContribution', Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
            />
            <p className="text-xs text-gray-500 mt-1">חוק: 6.5-7.5%</p>
          </div>
          <div>
            <label className="block text-xs text-gray-700 mb-1">פיצויים (%)</label>
            <input
              type="number"
              min={0}
              max={10}
              step={0.1}
              value={input.severanceContribution}
              onChange={(e) => update('severanceContribution', Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
            />
            <p className="text-xs text-gray-500 mt-1">חוק: 6-8.33%</p>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded p-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-700">סה&quot;כ הפרשה חודשית:</span>
            <strong className="text-blue-700">
              {formatPercent(totalContrib / 100, 1)} = {formatCurrency(result.monthlyContribution)}/ח
            </strong>
          </div>
        </div>

        <h3 className="text-md font-semibold text-gray-800 pt-3 border-t border-gray-200">
          הנחות מקצועיות
        </h3>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-gray-700 mb-1">תשואה צפויה (%/שנה)</label>
            <input
              type="number"
              min={0}
              max={15}
              step={0.5}
              value={input.expectedReturn}
              onChange={(e) => update('expectedReturn', Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
            />
            <p className="text-xs text-gray-500 mt-1">קרן פנסיה ממוצעת: 4-6%</p>
          </div>
          <div>
            <label className="block text-xs text-gray-700 mb-1">מקדם המרה</label>
            <input
              type="number"
              min={150}
              max={250}
              value={input.conversionRate}
              onChange={(e) => update('conversionRate', Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
            />
            <p className="text-xs text-gray-500 mt-1">2026: ~205 בגיל 67</p>
          </div>
        </div>
      </div>

      <div className="lg:col-span-2 space-y-4">
        <ResultCard
          title="קצבה חודשית צפויה"
          value={formatCurrency(result.monthlyPension)}
          subtitle={`${formatPercent(result.pensionAsPercentOfSalary / 100, 1)} מהשכר הנוכחי`}
          variant={result.pensionAsPercentOfSalary > 60 ? 'success' : 'warning'}
        />

        <ResultCard
          title="חיסכון בפרישה"
          value={formatCurrency(result.finalSavings)}
          subtitle={`בעוד ${result.yearsUntilRetirement} שנים`}
          variant="primary"
        />

        <Breakdown
          title="פירוט"
          defaultOpen
          items={[
            { label: 'שכר נוכחי', value: formatCurrency(input.monthlySalary) },
            { label: 'חיסכון נוכחי', value: formatCurrency(input.currentPensionSavings) },
            {
              label: 'הפרשה חודשית',
              value: formatCurrency(result.monthlyContribution),
              note: `${totalContrib.toFixed(1)}% מהשכר`,
            },
            {
              label: 'סך הפרשות עתידיות',
              value: formatCurrency(result.totalContributionsPaid),
              note: `${result.yearsUntilRetirement} שנים`,
            },
            {
              label: 'תשואה כוללת',
              value: formatCurrency(result.totalEarnings),
              note: `${input.expectedReturn}% שנתי`,
            },
            { label: 'חיסכון בפרישה', value: formatCurrency(result.finalSavings), bold: true },
            {
              label: 'מקדם המרה',
              value: input.conversionRate.toString(),
              note: 'גיל פרישה',
            },
            {
              label: 'קצבה חודשית',
              value: formatCurrency(result.monthlyPension),
              bold: true,
            },
            {
              label: 'קצבה שנתית',
              value: formatCurrency(result.yearlyPension),
            },
          ]}
        />

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs">
          <p className="font-medium text-gray-800 mb-1">⚠️ שים לב:</p>
          <ul className="text-gray-700 space-y-0.5">
            <li>• הקצבה לא מותאמת לאינפלציה (כ-2.5%/שנה)</li>
            <li>• נטו אחרי מס (~10%) יהיה כ-90% מהמוצג</li>
            <li>• תוסיף ביטוח לאומי (~3,500 ₪/חודש)</li>
            <li>• תוצאה תלויה במסלול קרן הפנסיה</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
