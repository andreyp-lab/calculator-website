'use client';

import { useState, useMemo } from 'react';
import {
  calculateSalaryNetGross,
  type SalaryNetGrossInput,
} from '@/lib/calculators/salary-net-gross';
import { formatCurrency } from '@/lib/utils/formatters';
import { ResultCard } from '@/components/calculator/ResultCard';

const initial: SalaryNetGrossInput = {
  grossSalary: 15_000,
  creditPoints: 2.25,
  pensionEnabled: true,
  studyFundEnabled: false,
  monthlyWorkHours: 182,
};

export function SalaryNetGrossCalculator() {
  const [input, setInput] = useState<SalaryNetGrossInput>(initial);
  const result = useMemo(() => calculateSalaryNetGross(input), [input]);

  function update<K extends keyof SalaryNetGrossInput>(k: K, v: SalaryNetGrossInput[K]) {
    setInput((p) => ({ ...p, [k]: v }));
  }

  return (
    <div className="grid lg:grid-cols-5 gap-6">
      <div className="lg:col-span-3 bg-white border-2 border-gray-200 rounded-xl p-6 space-y-5">
        <h2 className="text-xl font-bold text-gray-900">פרטי השכר</h2>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            שכר ברוטו חודשי (₪)
          </label>
          <input
            type="number"
            min={0}
            step={500}
            value={input.grossSalary}
            onChange={(e) => update('grossSalary', Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-lg"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">נקודות זיכוי</label>
            <input
              type="number"
              min={0}
              max={10}
              step={0.25}
              value={input.creditPoints}
              onChange={(e) => update('creditPoints', Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
            <p className="text-xs text-gray-500 mt-1">2.25 = גבר, 2.75 = אישה</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              שעות עבודה / חודש
            </label>
            <input
              type="number"
              min={1}
              max={300}
              value={input.monthlyWorkHours}
              onChange={(e) => update('monthlyWorkHours', Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
        </div>

        <div className="bg-gray-50 p-3 rounded-lg space-y-2">
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={input.pensionEnabled}
              onChange={(e) => update('pensionEnabled', e.target.checked)}
              className="w-4 h-4"
            />
            <span>הפרשה לפנסיה (6% עובד + 6.5% מעסיק)</span>
          </label>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={input.studyFundEnabled}
              onChange={(e) => update('studyFundEnabled', e.target.checked)}
              className="w-4 h-4"
            />
            <span>קרן השתלמות (2.5% עובד + 7.5% מעסיק)</span>
          </label>
        </div>
      </div>

      <div className="lg:col-span-2 space-y-4">
        <ResultCard
          title="שכר נטו (לכיס)"
          value={formatCurrency(result.netSalary)}
          subtitle={`${result.netPercentage.toFixed(1)}% מהברוטו`}
          variant="success"
        />

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-2 text-sm">
          <h4 className="font-bold mb-2">פירוט ניכויים</h4>
          <Row label="ברוטו" value={formatCurrency(result.grossSalary)} />
          <Row label="מס הכנסה" value={`-${formatCurrency(result.incomeTax)}`} />
          <Row label="ב.ל. + בריאות" value={`-${formatCurrency(result.socialSecurity)}`} />
          {result.pensionDeduction > 0 && (
            <Row label="פנסיה" value={`-${formatCurrency(result.pensionDeduction)}`} />
          )}
          {result.studyFundDeduction > 0 && (
            <Row
              label="קרן השתלמות"
              value={`-${formatCurrency(result.studyFundDeduction)}`}
            />
          )}
          <div className="pt-2 border-t font-bold flex justify-between text-emerald-700">
            <span>נטו:</span>
            <span>{formatCurrency(result.netSalary)}</span>
          </div>
        </div>

        <ResultCard
          title="שכר שעתי"
          value={`${result.hourlyRate.toFixed(0)} ₪/שעה`}
          subtitle={`לפי ${input.monthlyWorkHours} שעות`}
          variant="primary"
        />

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-900">
          <p className="font-semibold mb-1">💼 עלות מעסיק כוללת</p>
          <p className="font-bold text-base">{formatCurrency(result.totalEmployerCost)}</p>
          <p className="text-blue-700 mt-1">
            על כל ₪1 ברוטו → ₪{result.costToNetRatio.toFixed(2)} עלות מעסיק
          </p>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-gray-700">
      <span>{label}:</span>
      <span>{value}</span>
    </div>
  );
}
