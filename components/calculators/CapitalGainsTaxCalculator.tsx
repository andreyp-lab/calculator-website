'use client';

import { useState, useMemo } from 'react';
import {
  calculateCapitalGainsTax,
  type CapitalGainsInput,
  type CapitalGainsScenario,
} from '@/lib/calculators/capital-gains-tax';
import { formatCurrency, formatPercent } from '@/lib/utils/formatters';
import { ResultCard } from '@/components/calculator/ResultCard';

const initial: CapitalGainsInput = {
  salePrice: 3_000_000,
  purchasePrice: 1_500_000,
  recognizedExpenses: 100_000,
  purchaseYear: 2018,
  saleYear: 2026,
  scenario: 'first-home',
  isResident: true,
  usedExemptionRecently: false,
  hasHighIncome: false,
  inflationCumulativePct: 15,
};

export function CapitalGainsTaxCalculator() {
  const [input, setInput] = useState<CapitalGainsInput>(initial);
  const result = useMemo(() => calculateCapitalGainsTax(input), [input]);

  function update<K extends keyof CapitalGainsInput>(k: K, v: CapitalGainsInput[K]) {
    setInput((p) => ({ ...p, [k]: v }));
  }

  return (
    <div className="grid lg:grid-cols-5 gap-6">
      <div className="lg:col-span-3 bg-white border-2 border-gray-200 rounded-xl p-6 space-y-5">
        <h2 className="text-xl font-bold text-gray-900 mb-2">פרטי העסקה</h2>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              שווי מכירה (₪)
            </label>
            <input
              type="number"
              min={0}
              step={50_000}
              value={input.salePrice}
              onChange={(e) => update('salePrice', Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              שווי רכישה (₪)
            </label>
            <input
              type="number"
              min={0}
              step={50_000}
              value={input.purchasePrice}
              onChange={(e) => update('purchasePrice', Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            הוצאות מוכרות (₪)
          </label>
          <input
            type="number"
            min={0}
            step={5_000}
            value={input.recognizedExpenses}
            onChange={(e) => update('recognizedExpenses', Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
          <p className="text-xs text-gray-500 mt-1">
            עו"ד, תיווך, שיפוצים, מס רכישה, פחת, ועוד
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">שנת רכישה</label>
            <input
              type="number"
              min={1980}
              max={2026}
              value={input.purchaseYear}
              onChange={(e) => update('purchaseYear', Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">שנת מכירה</label>
            <input
              type="number"
              min={2014}
              max={2030}
              value={input.saleYear}
              onChange={(e) => update('saleYear', Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            אינפלציה מצטברת מהרכישה (%)
          </label>
          <input
            type="number"
            min={0}
            max={200}
            step={1}
            value={input.inflationCumulativePct}
            onChange={(e) => update('inflationCumulativePct', Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
          <p className="text-xs text-gray-500 mt-1">
            השבח האינפלציוני פטור ממס. בערך 2-3%/שנה.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">סוג העסקה</label>
          <select
            value={input.scenario}
            onChange={(e) => update('scenario', e.target.value as CapitalGainsScenario)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          >
            <option value="first-home">דירה יחידה (לתושב ישראל)</option>
            <option value="investment">דירת השקעה / נוספת</option>
            <option value="inherited">דירה בירושה</option>
          </select>
        </div>

        <div className="space-y-2 p-3 bg-gray-50 rounded-lg">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={input.isResident}
              onChange={(e) => update('isResident', e.target.checked)}
              className="w-4 h-4"
            />
            <span>תושב ישראל</span>
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={input.usedExemptionRecently}
              onChange={(e) => update('usedExemptionRecently', e.target.checked)}
              className="w-4 h-4"
            />
            <span>השתמשתי בפטור דירה יחידה ב-18 חודשים האחרונים</span>
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={input.hasHighIncome}
              onChange={(e) => update('hasHighIncome', e.target.checked)}
              className="w-4 h-4"
            />
            <span>בעל הכנסות גבוהות (חייב במס יסף 5%)</span>
          </label>
        </div>
      </div>

      <div className="lg:col-span-2 space-y-4">
        <ResultCard
          title="מס שבח לתשלום"
          value={formatCurrency(result.taxAmount)}
          subtitle={result.fullExemption ? 'פטור מלא ✓' : `${formatPercent(result.taxRate, 0)} מהשבח החייב`}
          variant={result.fullExemption ? 'success' : 'primary'}
        />

        <ResultCard
          title="נטו לאחר מס"
          value={formatCurrency(result.netToSeller)}
          variant="success"
        />

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-2 text-sm">
          <h4 className="font-bold text-gray-900 mb-2">פירוט החישוב</h4>
          <Row label="שבח כולל" value={formatCurrency(result.grossGain)} />
          <Row
            label="שבח אינפלציוני (פטור)"
            value={`-${formatCurrency(result.inflationGain)}`}
          />
          <Row label="שבח ריאלי" value={formatCurrency(result.realGain)} bold />
          {result.appliedLinearMethod && (
            <Row
              label={`חישוב לינארי (${(result.taxablePct * 100).toFixed(1)}%)`}
              value={formatCurrency(result.taxableGain)}
              className="text-blue-700"
            />
          )}
          <Row
            label={`מס ${formatPercent(result.taxRate, 0)}`}
            value={formatCurrency(result.taxAmount)}
            bold
          />
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-900">
          💡 {result.explanation}
        </div>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  bold,
  className,
}: {
  label: string;
  value: string;
  bold?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`flex justify-between ${bold ? 'font-semibold text-gray-900' : 'text-gray-700'} ${className ?? ''}`}
    >
      <span>{label}:</span>
      <span>{value}</span>
    </div>
  );
}
