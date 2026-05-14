'use client';

import { useState, useMemo } from 'react';
import {
  calculateSelfEmployedNet,
  type SelfEmployedNetInput,
  type BusinessType,
  type InputPeriod,
} from '@/lib/calculators/self-employed-net';
import { formatCurrency, formatPercent } from '@/lib/utils/formatters';
import { ResultCard } from '@/components/calculator/ResultCard';

const initial: SelfEmployedNetInput = {
  businessType: 'authorized',
  inputPeriod: 'monthly',
  revenue: 20000,
  recognizedExpenses: 3000,
  creditPoints: 2.25,
  monthlyPensionDeposit: 1000,
  monthlyStudyFundDeposit: 500,
};

export function SelfEmployedNetCalculator() {
  const [input, setInput] = useState<SelfEmployedNetInput>(initial);
  const result = useMemo(() => calculateSelfEmployedNet(input), [input]);

  function update<K extends keyof SelfEmployedNetInput>(k: K, v: SelfEmployedNetInput[K]) {
    setInput((p) => ({ ...p, [k]: v }));
  }

  const periodLabel = input.inputPeriod === 'monthly' ? 'חודשי' : 'שנתי';

  return (
    <div className="grid lg:grid-cols-5 gap-6">
      {/* קלט */}
      <div className="lg:col-span-2 bg-white border-2 border-gray-200 rounded-xl p-6 space-y-5">
        <h2 className="text-xl font-bold text-gray-900">פרטים</h2>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">סוג עסק</label>
          <div className="grid grid-cols-2 gap-2">
            {(['exempt', 'authorized'] as BusinessType[]).map((bt) => (
              <button
                key={bt}
                type="button"
                onClick={() => update('businessType', bt)}
                className={`px-3 py-2 rounded-lg border-2 text-sm font-medium transition ${
                  input.businessType === bt
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
                }`}
              >
                {bt === 'exempt' ? 'עוסק פטור' : 'עוסק מורשה'}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">תקופת הזנה</label>
          <div className="grid grid-cols-2 gap-2">
            {(['monthly', 'annual'] as InputPeriod[]).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => update('inputPeriod', p)}
                className={`px-3 py-2 rounded-lg border-2 text-sm font-medium transition ${
                  input.inputPeriod === p
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-emerald-400'
                }`}
              >
                {p === 'monthly' ? 'חודשי' : 'שנתי'}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            מחזור {periodLabel} ללא מע"מ (₪)
          </label>
          <input
            type="number"
            min={0}
            step={500}
            value={input.revenue}
            onChange={(e) => update('revenue', Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            הוצאות מוכרות {periodLabel} (₪)
          </label>
          <input
            type="number"
            min={0}
            step={100}
            value={input.recognizedExpenses}
            onChange={(e) => update('recognizedExpenses', Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
          <p className="text-xs text-gray-500 mt-1">
            לאחר התאמת אחוז הכרה (רכב 45%, בית 25% וכו')
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              נקודות זיכוי
            </label>
            <input
              type="number"
              min={0}
              max={10}
              step={0.25}
              value={input.creditPoints}
              onChange={(e) => update('creditPoints', Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
        </div>

        <div className="pt-3 border-t border-gray-200 space-y-3">
          <p className="text-sm font-medium text-gray-700">הפקדות פנסיוניות (חודשי)</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                פנסיה (₪/חודש)
              </label>
              <input
                type="number"
                min={0}
                step={50}
                value={input.monthlyPensionDeposit}
                onChange={(e) => update('monthlyPensionDeposit', Number(e.target.value))}
                className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                קרן השתלמות (₪/חודש)
              </label>
              <input
                type="number"
                min={0}
                step={50}
                value={input.monthlyStudyFundDeposit}
                onChange={(e) => update('monthlyStudyFundDeposit', Number(e.target.value))}
                className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* תוצאות */}
      <div className="lg:col-span-3 space-y-4">
        {/* כרטיסי תוצאה */}
        <div className="grid sm:grid-cols-2 gap-4">
          <ResultCard
            title="💰 נטו ביד - חודשי"
            value={formatCurrency(result.monthlyNet)}
            subtitle={`כסף שנשאר אחרי מס, ב.ל. והפקדות`}
            variant="success"
          />
          <ResultCard
            title="📅 נטו ביד - שנתי"
            value={formatCurrency(result.annualNet)}
            subtitle={`שיעור מס מצרפי: ${formatPercent(result.effectiveTaxRate, 1)}`}
            variant="primary"
          />
        </div>

        {/* פירוט */}
        <div className="bg-white border-2 border-gray-200 rounded-xl p-5">
          <h3 className="font-bold text-gray-900 mb-3">פירוט שנתי</h3>
          <div className="space-y-1.5 text-sm">
            <Row label="מחזור" value={formatCurrency(result.annualRevenue)} positive />
            <Row
              label="(-) הוצאות מוכרות"
              value={`- ${formatCurrency(result.annualExpenses)}`}
              mute
            />
            <Row
              label="הכנסה חייבת"
              value={formatCurrency(result.initialTaxableIncome)}
              bold
              line
            />
            <Row
              label="(-) מס הכנסה"
              value={`- ${formatCurrency(result.netIncomeTax)}`}
              negative
            />
            <Row
              label="(-) ביטוח לאומי + בריאות"
              value={`- ${formatCurrency(result.bituachLeumi)}`}
              negative
            />
            {result.annualPensionDeposit > 0 && (
              <Row
                label="(-) הפקדה לפנסיה"
                value={`- ${formatCurrency(result.annualPensionDeposit)}`}
                mute
              />
            )}
            {result.annualStudyFundDeposit > 0 && (
              <Row
                label="(-) הפקדה לקרן השתלמות"
                value={`- ${formatCurrency(result.annualStudyFundDeposit)}`}
                mute
              />
            )}
            <Row
              label="נטו ביד שנתי"
              value={formatCurrency(result.annualNet)}
              bold
              line
              highlight
            />
          </div>
        </div>

        {/* גרף ויזואלי */}
        <div className="bg-white border-2 border-gray-200 rounded-xl p-5">
          <h3 className="font-bold text-gray-900 mb-3">איך מתחלק כל ₪ מההכנסה החייבת</h3>
          <PieBreakdown result={result} />
        </div>

        {/* הערות */}
        {input.businessType === 'authorized' && result.annualVat > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-900">
            ℹ️ <strong>מע"מ עסקאות</strong>: {formatCurrency(result.annualVat)} בשנה — את זה תגבה
            מהלקוחות ותעביר לרשות המסים (פחות מע"מ תשומות). זה <strong>לא</strong> חלק מהנטו שלך.
          </div>
        )}
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  bold,
  mute,
  line,
  highlight,
  positive,
  negative,
}: {
  label: string;
  value: string;
  bold?: boolean;
  mute?: boolean;
  line?: boolean;
  highlight?: boolean;
  positive?: boolean;
  negative?: boolean;
}) {
  return (
    <div
      className={`flex justify-between items-center py-1.5 ${
        line ? 'border-t border-gray-200 pt-2.5 mt-1' : ''
      } ${highlight ? 'bg-emerald-50 -mx-2 px-2 rounded' : ''}`}
    >
      <span
        className={`${mute ? 'text-gray-600' : 'text-gray-800'} ${bold ? 'font-bold' : ''}`}
      >
        {label}
      </span>
      <span
        className={`tabular-nums ${bold ? 'font-bold text-gray-900' : ''} ${
          mute ? 'text-gray-500' : ''
        } ${positive ? 'text-emerald-700' : ''} ${negative ? 'text-red-700' : ''}`}
      >
        {value}
      </span>
    </div>
  );
}

function PieBreakdown({
  result,
}: {
  result: ReturnType<typeof calculateSelfEmployedNet>;
}) {
  const base = result.initialTaxableIncome;
  if (base <= 0) {
    return <p className="text-sm text-gray-500">לא ניתן להציג חלוקה ללא הכנסה</p>;
  }

  const items = [
    {
      label: 'מס הכנסה',
      value: result.netIncomeTax,
      color: 'bg-red-500',
      textColor: 'text-red-700',
    },
    {
      label: 'ביטוח לאומי + בריאות',
      value: result.bituachLeumi,
      color: 'bg-orange-500',
      textColor: 'text-orange-700',
    },
    {
      label: 'פנסיה',
      value: result.annualPensionDeposit,
      color: 'bg-purple-500',
      textColor: 'text-purple-700',
    },
    {
      label: 'קרן השתלמות',
      value: result.annualStudyFundDeposit,
      color: 'bg-indigo-500',
      textColor: 'text-indigo-700',
    },
    {
      label: 'נטו ביד',
      value: Math.max(0, result.annualNet),
      color: 'bg-emerald-500',
      textColor: 'text-emerald-700',
    },
  ].filter((i) => i.value > 0);

  const total = items.reduce((sum, i) => sum + i.value, 0);

  return (
    <div className="space-y-3">
      {/* פס צבעוני */}
      <div className="flex h-8 rounded-lg overflow-hidden border border-gray-200">
        {items.map((i) => {
          const pct = (i.value / total) * 100;
          return (
            <div
              key={i.label}
              className={`${i.color} flex items-center justify-center text-white text-xs font-bold`}
              style={{ width: `${pct}%` }}
              title={`${i.label}: ${pct.toFixed(1)}%`}
            >
              {pct >= 8 ? `${pct.toFixed(0)}%` : ''}
            </div>
          );
        })}
      </div>

      {/* מקרא */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
        {items.map((i) => {
          const pct = (i.value / total) * 100;
          return (
            <div key={i.label} className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded ${i.color} flex-shrink-0`} />
              <span className={`${i.textColor} font-medium`}>
                {i.label}: {pct.toFixed(1)}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
