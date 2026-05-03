'use client';

import { useState, useMemo } from 'react';
import {
  calculateSeverance,
  type SeveranceInput,
  type EmploymentType,
  type TerminationReason,
} from '@/lib/calculators/severance';
import { formatCurrency } from '@/lib/utils/formatters';
import { ResultCard } from '@/components/calculator/ResultCard';
import { Breakdown } from '@/components/calculator/Breakdown';
import { AlertCircle } from 'lucide-react';

const today = new Date().toISOString().split('T')[0];
const fiveYearsAgo = new Date(new Date().setFullYear(new Date().getFullYear() - 5))
  .toISOString()
  .split('T')[0];

const initialInput: SeveranceInput = {
  startDate: fiveYearsAgo,
  endDate: today,
  monthlySalary: 10000,
  employmentType: 'monthly',
  partTimePercentage: 100,
  hasSection14: false,
  section14Percentage: 8.33,
  terminationReason: 'fired',
};

export function SeveranceCalculator() {
  const [input, setInput] = useState<SeveranceInput>(initialInput);

  const result = useMemo(() => calculateSeverance(input), [input]);

  function updateField<K extends keyof SeveranceInput>(field: K, value: SeveranceInput[K]) {
    setInput((prev) => ({ ...prev, [field]: value }));
  }

  return (
    <div className="grid lg:grid-cols-5 gap-6">
      {/* Form */}
      <div className="lg:col-span-3 bg-white border-2 border-gray-200 rounded-xl p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">פרטי העבודה</h2>

        <div className="space-y-5">
          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
                תאריך תחילת עבודה
              </label>
              <input
                id="startDate"
                type="date"
                value={input.startDate}
                onChange={(e) => updateField('startDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-2">
                תאריך סיום עבודה
              </label>
              <input
                id="endDate"
                type="date"
                value={input.endDate}
                onChange={(e) => updateField('endDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Salary */}
          <div>
            <label htmlFor="salary" className="block text-sm font-medium text-gray-700 mb-2">
              שכר חודשי קובע (ש"ח)
            </label>
            <input
              id="salary"
              type="number"
              min={0}
              max={500000}
              step={100}
              value={input.monthlySalary}
              onChange={(e) => updateField('monthlySalary', Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">השכר החודשי האחרון או הממוצע ב-12 החודשים האחרונים</p>
          </div>

          {/* Employment Type */}
          <div>
            <label htmlFor="employmentType" className="block text-sm font-medium text-gray-700 mb-2">
              סוג העסקה
            </label>
            <select
              id="employmentType"
              value={input.employmentType}
              onChange={(e) => updateField('employmentType', e.target.value as EmploymentType)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="monthly">עובד חודשי (משכורת קבועה)</option>
              <option value="hourly">עובד שעתי</option>
            </select>
          </div>

          {/* Part-time percentage (if hourly) */}
          {input.employmentType === 'hourly' && (
            <div>
              <label htmlFor="partTime" className="block text-sm font-medium text-gray-700 mb-2">
                היקף משרה (%)
              </label>
              <input
                id="partTime"
                type="number"
                min={1}
                max={100}
                value={input.partTimePercentage}
                onChange={(e) => updateField('partTimePercentage', Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          )}

          {/* Termination reason */}
          <div>
            <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-2">
              סיבת סיום העבודה
            </label>
            <select
              id="reason"
              value={input.terminationReason}
              onChange={(e) =>
                updateField('terminationReason', e.target.value as TerminationReason)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="fired">פיטורין</option>
              <option value="qualifying">התפטרות מזכה (סעיף 14, מעבר דירה וכו')</option>
              <option value="retirement">פרישה לפנסיה</option>
              <option value="resigned">התפטרות (לא מזכה)</option>
            </select>
          </div>

          {/* Section 14 */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={input.hasSection14}
                onChange={(e) => updateField('hasSection14', e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-900">
                חתום על סעיף 14 (הפרשה חודשית לפיצויים)
              </span>
            </label>
            <p className="text-xs text-gray-600 mt-2">
              סעיף 14 קובע שמעסיק מפריש לקופת גמל סכום חודשי שמשמש לפיצויים
            </p>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="lg:col-span-2 space-y-4">
        {result.isEligible ? (
          <>
            <ResultCard
              title="פיצויי פיטורין משוערים (ברוטו)"
              value={formatCurrency(result.baseSeverance)}
              subtitle={`לפי ותק של ${result.yearsOfService.toFixed(2)} שנים`}
              variant="primary"
            />

            <ResultCard
              title="פיצויים נטו (לאחר מס משוער)"
              value={formatCurrency(result.netSeverance)}
              subtitle={
                result.taxableAmount > 0
                  ? `אומדן מס: ${formatCurrency(result.estimatedTax)}`
                  : 'פטור מלא ממס'
              }
              variant="success"
            />

            <Breakdown
              title="פירוט החישוב"
              items={[
                {
                  label: 'שכר מתואם',
                  value: formatCurrency(result.adjustedSalary),
                  note: input.employmentType === 'hourly' ? `${input.partTimePercentage}% משרה` : undefined,
                },
                { label: 'ותק (שנים)', value: result.yearsOfService.toFixed(2) },
                {
                  label: 'פיצוי בסיסי',
                  value: formatCurrency(result.baseSeverance),
                  note: 'שכר × ותק',
                },
                { label: 'סכום פטור ממס', value: formatCurrency(result.taxExemptAmount) },
                { label: 'סכום חייב במס', value: formatCurrency(result.taxableAmount) },
                { label: 'מס משוער (30%)', value: formatCurrency(result.estimatedTax) },
                { label: 'סך הכל נטו', value: formatCurrency(result.netSeverance), bold: true },
              ]}
            />
          </>
        ) : (
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6">
            <div className="flex gap-3">
              <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-red-900 mb-2">לא זכאי לפיצויי פיטורין</h3>
                <p className="text-sm text-red-800 leading-relaxed">{result.ineligibilityReason}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
