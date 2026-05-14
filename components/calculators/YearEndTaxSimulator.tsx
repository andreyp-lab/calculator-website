'use client';

import { useState, useMemo } from 'react';
import {
  simulateYearEndTax,
  type YearEndTaxInput,
  type BusinessType,
  type Quarter,
} from '@/lib/calculators/year-end-tax-simulator';
import { formatCurrency, formatPercent } from '@/lib/utils/formatters';
import { ResultCard } from '@/components/calculator/ResultCard';

const MONTHS = [
  'ינו׳', 'פבר׳', 'מרץ', 'אפר׳', 'מאי', 'יוני',
  'יולי', 'אוג׳', 'ספט׳', 'אוק׳', 'נוב׳', 'דצמ׳',
];

const initial: YearEndTaxInput = {
  businessType: 'authorized',
  currentQuarter: 'Q2',
  monthlyRevenue: [15000, 15000, 15000, 15000, 15000, 15000, 0, 0, 0, 0, 0, 0],
  recognizedExpenses: 12000,
  monthlyPensionDeposit: 500,
  monthlyStudyFundDeposit: 500,
  creditPoints: 2.25,
  donations: 0,
  bituachLeumiAdvancesPaid: 2000,
  incomeTaxAdvancesPaid: 3000,
};

export function YearEndTaxSimulator() {
  const [input, setInput] = useState<YearEndTaxInput>(initial);
  const result = useMemo(() => simulateYearEndTax(input), [input]);

  function update<K extends keyof YearEndTaxInput>(k: K, v: YearEndTaxInput[K]) {
    setInput((p) => ({ ...p, [k]: v }));
  }

  function updateMonth(idx: number, val: number) {
    const next = [...input.monthlyRevenue];
    next[idx] = val;
    update('monthlyRevenue', next);
  }

  function fillForward() {
    // ממלא את כל החודשים הבאים על בסיס חודש שאינו אפס
    const lastFilled = [...input.monthlyRevenue].reverse().find((v) => v > 0) ?? 0;
    if (!lastFilled) return;
    const firstZero = input.monthlyRevenue.findIndex((v) => v === 0);
    if (firstZero === -1) return;
    const next = [...input.monthlyRevenue];
    for (let i = firstZero; i < 12; i++) next[i] = lastFilled;
    update('monthlyRevenue', next);
  }

  return (
    <div className="space-y-6">
      {/* פרטי עסק */}
      <div className="bg-white border-2 border-gray-200 rounded-xl p-6 space-y-5">
        <h2 className="text-xl font-bold text-gray-900">פרטי העסק</h2>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              סוג העסק
            </label>
            <select
              value={input.businessType}
              onChange={(e) => update('businessType', e.target.value as BusinessType)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="exempt">עוסק פטור</option>
              <option value="authorized">עוסק מורשה</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              רבעון נוכחי (לחישוב מקדמות)
            </label>
            <select
              value={input.currentQuarter}
              onChange={(e) => update('currentQuarter', e.target.value as Quarter)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="Q1">רבעון 1 (ינו׳-מרץ)</option>
              <option value="Q2">רבעון 1+2 מצטבר (ינו׳-יוני)</option>
              <option value="Q3">רבעון 1-3 מצטבר (ינו׳-ספט׳)</option>
              <option value="Q4">שנה מלאה (ינו׳-דצמ׳)</option>
            </select>
          </div>
        </div>
      </div>

      {/* הכנסות חודשיות */}
      <div className="bg-white border-2 border-gray-200 rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h2 className="text-xl font-bold text-gray-900">הכנסות חודשיות (ללא מע"מ)</h2>
          <button
            type="button"
            onClick={fillForward}
            className="text-sm text-blue-600 hover:text-blue-700 underline"
          >
            ↩ העתק קדימה (מילוי חודשים ריקים)
          </button>
        </div>

        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {MONTHS.map((label, i) => (
            <div key={i}>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                {label}
              </label>
              <input
                type="number"
                min={0}
                step={500}
                value={input.monthlyRevenue[i] ?? 0}
                onChange={(e) => updateMonth(i, Number(e.target.value))}
                className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
              />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
          {(Object.keys(result.quarterlyRevenue) as Quarter[]).map((q) => (
            <div key={q} className="bg-gray-50 rounded-lg p-2 text-center">
              <div className="text-gray-500">{q}</div>
              <div className="font-bold text-gray-900">
                {formatCurrency(result.quarterlyRevenue[q])}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm">
          <strong>מחזור שנתי צפוי:</strong>{' '}
          {formatCurrency(result.annualRevenue)} (ללא מע"מ)
          {input.businessType === 'authorized' && (
            <span className="block text-xs text-blue-800 mt-1">
              כולל מע"מ: {formatCurrency(result.annualRevenueIncludingVat)} | מע"מ עסקאות:{' '}
              {formatCurrency(result.vatOutput)}
            </span>
          )}
        </div>
      </div>

      {/* הוצאות מוכרות */}
      <div className="bg-white border-2 border-gray-200 rounded-xl p-6 space-y-4">
        <h2 className="text-xl font-bold text-gray-900">הוצאות מוכרות</h2>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            סה"כ הוצאות מוכרות שנתיות (לאחר התאמה לאחוז ההכרה)
          </label>
          <input
            type="number"
            min={0}
            step={500}
            value={input.recognizedExpenses}
            onChange={(e) => update('recognizedExpenses', Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-lg"
          />
          <p className="text-xs text-gray-500 mt-1">
            הוצאות עסקיות (חומרי גלם, פרסום, עו"ד, רואה חשבון, אינטרנט) מוכרות 100%.
            הוצאות מעורבות (טלפון נייד 50%/רכב 45%/בית 25%) - לאחר התאמת אחוז ההכרה.
          </p>
        </div>
      </div>

      {/* ניכויים / זיכויים */}
      <div className="bg-white border-2 border-gray-200 rounded-xl p-6 space-y-4">
        <h2 className="text-xl font-bold text-gray-900">ניכויים וזיכויים</h2>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              הפקדה חודשית לפנסיה (₪)
            </label>
            <input
              type="number"
              min={0}
              step={50}
              value={input.monthlyPensionDeposit}
              onChange={(e) => update('monthlyPensionDeposit', Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
            <p className="text-xs text-gray-500 mt-1">
              שנתי: {formatCurrency(input.monthlyPensionDeposit * 12)}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              הפקדה חודשית לקרן השתלמות (₪)
            </label>
            <input
              type="number"
              min={0}
              step={50}
              value={input.monthlyStudyFundDeposit}
              onChange={(e) => update('monthlyStudyFundDeposit', Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
            <p className="text-xs text-gray-500 mt-1">
              שנתי: {formatCurrency(input.monthlyStudyFundDeposit * 12)}
            </p>
          </div>
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
            <p className="text-xs text-gray-500 mt-1">
              שווי שנתי: {formatCurrency(input.creditPoints * 2904)} (₪2,904/נקודה)
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              תרומות לעמותות מוכרות (שנתי, ₪)
            </label>
            <input
              type="number"
              min={0}
              step={100}
              value={input.donations ?? 0}
              onChange={(e) => update('donations', Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
            <p className="text-xs text-gray-500 mt-1">זיכוי 35% מסכום התרומה</p>
          </div>
        </div>
      </div>

      {/* מקדמות ששולמו */}
      <div className="bg-white border-2 border-gray-200 rounded-xl p-6 space-y-4">
        <h2 className="text-xl font-bold text-gray-900">מקדמות ששולמו עד כה</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              מקדמות מס הכנסה (₪)
            </label>
            <input
              type="number"
              min={0}
              step={100}
              value={input.incomeTaxAdvancesPaid}
              onChange={(e) => update('incomeTaxAdvancesPaid', Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              מקדמות ביטוח לאומי (₪)
            </label>
            <input
              type="number"
              min={0}
              step={100}
              value={input.bituachLeumiAdvancesPaid}
              onChange={(e) => update('bituachLeumiAdvancesPaid', Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
        </div>
      </div>

      {/* תוצאות */}
      <div className="grid md:grid-cols-3 gap-4">
        <ResultCard
          title="מס הכנסה לסוף שנה"
          value={formatCurrency(result.netIncomeTax)}
          subtitle={`הכנסה חייבת: ${formatCurrency(result.finalTaxableIncome)}`}
          variant="primary"
        />
        <ResultCard
          title="ביטוח לאומי + בריאות"
          value={formatCurrency(result.bituachLeumiRequired)}
          subtitle="שנתי לסוף שנה"
          variant="warning"
        />
        <ResultCard
          title="שיעור מס מצרפי"
          value={formatPercent(result.effectiveTaxRate, 1)}
          subtitle="מס + ב.ל. מהמחזור"
          variant="success"
        />
      </div>

      {/* טבלת פירוט */}
      <div className="bg-white border-2 border-gray-200 rounded-xl p-6 space-y-3">
        <h2 className="text-xl font-bold text-gray-900 mb-3">פירוט החישוב</h2>

        <div className="space-y-2 text-sm">
          <Row label="מחזור שנתי" value={formatCurrency(result.annualRevenue)} />
          <Row
            label="(-) הוצאות מוכרות"
            value={`- ${formatCurrency(result.annualRecognizedExpenses)}`}
            mute
          />
          <Row
            label="הכנסה חייבת ראשונית"
            value={formatCurrency(result.initialTaxableIncome)}
            bold
            line
          />
          <Row
            label="(-) ניכוי פנסיה"
            value={`- ${formatCurrency(result.pensionDeduction)}`}
            mute
          />
          <Row
            label="(-) ניכוי קרן השתלמות"
            value={`- ${formatCurrency(result.studyFundDeduction)}`}
            mute
          />
          <Row
            label="(-) ניכוי ב.ל. (52%)"
            value={`- ${formatCurrency(result.bituachLeumiDeduction)}`}
            mute
          />
          <Row
            label="הכנסה חייבת סופית"
            value={formatCurrency(result.finalTaxableIncome)}
            bold
            line
          />
          <Row
            label="מס הכנסה ברוטו (מדרגות)"
            value={formatCurrency(result.grossIncomeTax)}
          />
          <Row
            label="(-) זיכוי נקודות זיכוי"
            value={`- ${formatCurrency(result.creditPointsValue)}`}
            mute
          />
          {result.pensionCredit > 0 && (
            <Row
              label="(-) זיכוי פנסיה (35%)"
              value={`- ${formatCurrency(result.pensionCredit)}`}
              mute
            />
          )}
          {result.donationsCredit > 0 && (
            <Row
              label="(-) זיכוי תרומות (35%)"
              value={`- ${formatCurrency(result.donationsCredit)}`}
              mute
            />
          )}
          <Row
            label="מס הכנסה נטו"
            value={formatCurrency(result.netIncomeTax)}
            bold
            line
            highlight
          />
        </div>
      </div>

      {/* השוואת מקדמות */}
      <div className="grid md:grid-cols-2 gap-4">
        <AdvancesCard
          title="מקדמות מס הכנסה"
          required={result.netIncomeTax}
          quarter={input.currentQuarter}
          paid={input.incomeTaxAdvancesPaid}
          diff={result.incomeTaxAdvancesDiff}
        />
        <AdvancesCard
          title="מקדמות ביטוח לאומי"
          required={result.bituachLeumiRequired}
          quarter={input.currentQuarter}
          paid={input.bituachLeumiAdvancesPaid}
          diff={result.bituachLeumiAdvancesDiff}
        />
      </div>

      {/* המלצות */}
      {result.recommendations.length > 0 && (
        <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-5">
          <h3 className="text-lg font-bold text-amber-900 mb-3">המלצות לאופטימיזציה</h3>
          <ul className="space-y-2">
            {result.recommendations.map((r, i) => (
              <li key={i} className="flex gap-2 text-sm text-amber-900">
                <span>💡</span>
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
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
}: {
  label: string;
  value: string;
  bold?: boolean;
  mute?: boolean;
  line?: boolean;
  highlight?: boolean;
}) {
  return (
    <div
      className={`flex justify-between items-center py-1.5 ${
        line ? 'border-t border-gray-200 pt-2.5 mt-1' : ''
      } ${highlight ? 'bg-blue-50 -mx-2 px-2 rounded' : ''}`}
    >
      <span className={`${mute ? 'text-gray-600' : 'text-gray-800'} ${bold ? 'font-bold' : ''}`}>
        {label}
      </span>
      <span
        className={`tabular-nums ${bold ? 'font-bold text-gray-900' : 'text-gray-700'} ${
          mute ? 'text-gray-500' : ''
        }`}
      >
        {value}
      </span>
    </div>
  );
}

function AdvancesCard({
  title,
  required,
  quarter,
  paid,
  diff,
}: {
  title: string;
  required: number;
  quarter: Quarter;
  paid: number;
  diff: number;
}) {
  const mul = { Q1: 0.25, Q2: 0.5, Q3: 0.75, Q4: 1 }[quarter];
  const needed = required * mul;
  const isShortfall = diff > 0;
  const isExact = Math.abs(diff) < 100;

  return (
    <div
      className={`border-2 rounded-xl p-5 ${
        isExact
          ? 'bg-emerald-50 border-emerald-300'
          : isShortfall
          ? 'bg-red-50 border-red-300'
          : 'bg-blue-50 border-blue-300'
      }`}
    >
      <h3 className="font-bold text-gray-900 mb-3">{title}</h3>
      <div className="space-y-1.5 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-700">צפי שנתי:</span>
          <span className="font-medium tabular-nums">{formatCurrency(required)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-700">נדרש עד {quarter}:</span>
          <span className="font-medium tabular-nums">{formatCurrency(needed)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-700">שולם בפועל:</span>
          <span className="font-medium tabular-nums">{formatCurrency(paid)}</span>
        </div>
        <div className="border-t border-gray-300 pt-2 mt-2 flex justify-between">
          <span className="font-bold text-gray-900">
            {isShortfall ? 'להשלים:' : isExact ? 'מאוזן:' : 'יתרה לטובתך:'}
          </span>
          <span
            className={`font-bold tabular-nums ${
              isShortfall ? 'text-red-700' : isExact ? 'text-emerald-700' : 'text-blue-700'
            }`}
          >
            {formatCurrency(Math.abs(diff))}
          </span>
        </div>
      </div>
    </div>
  );
}
