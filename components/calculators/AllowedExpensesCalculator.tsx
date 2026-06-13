'use client';

import { useState, useMemo } from 'react';
import {
  calculateAllowedExpenses,
  EXPENSE_RULES,
  EXPENSE_CATEGORY_ORDER,
  type AllowedExpensesInput,
  type ExpenseCategoryKey,
} from '@/lib/calculators/allowed-expenses';
import { formatCurrency, formatPercent } from '@/lib/utils/formatters';
import { ResultCard } from '@/components/calculator/ResultCard';

const initialExpenses: Partial<Record<ExpenseCategoryKey, number>> = {
  vehicle: 12_000,
  cellular: 3_600,
  homeOffice: 18_000,
  refreshments: 2_400,
  equipment: 6_000,
  training: 0,
  insurance: 0,
  accounting: 8_000,
  other: 0,
};

const initial: AllowedExpensesInput = {
  annualIncome: 250_000,
  isVatRegistered: true,
  creditPoints: 2.25,
  expenses: initialExpenses,
  cellularBusinessRatio: 0.5,
  homeOfficeAreaRatio: 0.2,
};

export function AllowedExpensesCalculator() {
  const [input, setInput] = useState<AllowedExpensesInput>(initial);
  const result = useMemo(() => calculateAllowedExpenses(input), [input]);

  function updateExpense(key: ExpenseCategoryKey, value: number) {
    setInput((p) => ({ ...p, expenses: { ...p.expenses, [key]: value } }));
  }

  function update<K extends keyof AllowedExpensesInput>(k: K, v: AllowedExpensesInput[K]) {
    setInput((p) => ({ ...p, [k]: v }));
  }

  return (
    <div className="grid lg:grid-cols-5 gap-6">
      {/* קלט */}
      <div className="lg:col-span-2 bg-paper border border-ink/15 rounded-none p-6 space-y-5">
        <h2 className="text-xl font-bold text-ink">פרטי העסק וההוצאות</h2>

        <div>
          <label className="block text-sm font-medium text-ink/70 mb-2">סוג עוסק</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => update('isVatRegistered', false)}
              className={`px-3 py-2 rounded-none border text-sm font-medium transition ${
                !input.isVatRegistered
                  ? 'bg-ink text-cream border-ink'
                  : 'bg-paper text-ink/70 border-ink/15 hover:border-ink/40'
              }`}
            >
              עוסק פטור
            </button>
            <button
              type="button"
              onClick={() => update('isVatRegistered', true)}
              className={`px-3 py-2 rounded-none border text-sm font-medium transition ${
                input.isVatRegistered
                  ? 'bg-ink text-cream border-ink'
                  : 'bg-paper text-ink/70 border-ink/15 hover:border-ink/40'
              }`}
            >
              עוסק מורשה
            </button>
          </div>
          <p className="text-xs text-ink/60 mt-1">רק עוסק מורשה מקזז מע"מ תשומות.</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-ink/70 mb-2">
            הכנסה שנתית חייבת (₪)
          </label>
          <input
            type="number"
            min={0}
            step={5_000}
            value={input.annualIncome ?? 0}
            onChange={(e) => update('annualIncome', Number(e.target.value))}
            className="w-full px-3 py-2 border border-ink/15 rounded-none text-lg"
          />
          <p className="text-xs text-ink/60 mt-1">
            קובעת את המדרגה השולית להערכת חיסכון המס.
          </p>
        </div>

        <div className="pt-3 border-t border-ink/15 space-y-3">
          <p className="text-sm font-medium text-ink/70">הוצאות שנתיות לפי קטגוריה (כולל מע"מ)</p>

          {EXPENSE_CATEGORY_ORDER.map((key) => {
            const rule = EXPENSE_RULES[key];
            return (
              <div key={key}>
                <label className="block text-xs font-medium text-ink/60 mb-1">
                  {rule.label}
                </label>
                <input
                  type="number"
                  min={0}
                  step={100}
                  value={input.expenses[key] ?? 0}
                  onChange={(e) => updateExpense(key, Number(e.target.value))}
                  className="w-full px-2 py-1.5 border border-ink/15 rounded-none text-sm"
                />

                {key === 'cellular' && (input.expenses.cellular ?? 0) > 0 && (
                  <div className="mt-1.5">
                    <label className="block text-xs text-ink/60 mb-1">
                      יחס שימוש עסקי: {formatPercent(input.cellularBusinessRatio ?? 0.5, 0)}
                    </label>
                    <input
                      type="range"
                      min={0}
                      max={1}
                      step={0.05}
                      value={input.cellularBusinessRatio ?? 0.5}
                      onChange={(e) => update('cellularBusinessRatio', Number(e.target.value))}
                      className="w-full"
                    />
                  </div>
                )}

                {key === 'homeOffice' && (input.expenses.homeOffice ?? 0) > 0 && (
                  <div className="mt-1.5">
                    <label className="block text-xs text-ink/60 mb-1">
                      יחס שטח חדר העבודה: {formatPercent(input.homeOfficeAreaRatio ?? 0, 0)}
                    </label>
                    <input
                      type="range"
                      min={0}
                      max={1}
                      step={0.05}
                      value={input.homeOfficeAreaRatio ?? 0}
                      onChange={(e) => update('homeOfficeAreaRatio', Number(e.target.value))}
                      className="w-full"
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* תוצאות */}
      <div className="lg:col-span-3 space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <ResultCard
            title="📉 חיסכון מס משוער"
            value={formatCurrency(result.estimatedIncomeTaxSaving)}
            subtitle={`לפי מדרגה שולית ${formatPercent(result.marginalTaxRate, 0)}`}
            variant="success"
          />
          <ResultCard
            title="💼 סך הטבה שנתית"
            value={formatCurrency(result.totalBenefit)}
            subtitle={
              input.isVatRegistered
                ? `כולל קיזוז מע"מ: ${formatCurrency(result.totalVatRecoverable)}`
                : 'חיסכון מס הכנסה בלבד (עוסק פטור)'
            }
            variant="primary"
          />
        </div>

        {/* פירוט לפי קטגוריה */}
        <div className="bg-paper border border-ink/15 rounded-none p-5">
          <h3 className="font-bold text-ink mb-3">פירוט לפי קטגוריה</h3>
          {result.categories.length === 0 ? (
            <p className="text-sm text-ink/60">הזן סכומי הוצאה כדי לראות פירוט.</p>
          ) : (
            <div className="overflow-x-auto -mx-1">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-right text-ink/60 border-b border-ink/15">
                    <th className="py-2 px-1 font-medium">קטגוריה</th>
                    <th className="py-2 px-1 font-medium">הוצאה</th>
                    <th className="py-2 px-1 font-medium">% הכרה</th>
                    <th className="py-2 px-1 font-medium">מוכר</th>
                    <th className="py-2 px-1 font-medium">קיזוז מע"מ</th>
                  </tr>
                </thead>
                <tbody>
                  {result.categories.map((c) => (
                    <tr key={c.key} className="border-b border-ink/10">
                      <td className="py-2 px-1 text-ink">{c.label}</td>
                      <td className="py-2 px-1 tabular-nums text-ink/60">
                        {formatCurrency(c.grossExpense)}
                      </td>
                      <td className="py-2 px-1 tabular-nums">
                        {formatPercent(c.incomeTaxRecognitionApplied, 0)}
                      </td>
                      <td className="py-2 px-1 tabular-nums font-medium text-ink">
                        {formatCurrency(c.recognizedForIncomeTax)}
                      </td>
                      <td className="py-2 px-1 tabular-nums text-emerald-700">
                        {c.vatRecoverable > 0 ? formatCurrency(c.vatRecoverable) : '—'}
                      </td>
                    </tr>
                  ))}
                  <tr className="font-bold text-ink border-t-2 border-ink/15">
                    <td className="py-2 px-1">סה"כ</td>
                    <td className="py-2 px-1 tabular-nums">
                      {formatCurrency(result.totalGrossExpense)}
                    </td>
                    <td className="py-2 px-1">—</td>
                    <td className="py-2 px-1 tabular-nums">
                      {formatCurrency(result.totalRecognizedForIncomeTax)}
                    </td>
                    <td className="py-2 px-1 tabular-nums text-emerald-700">
                      {formatCurrency(result.totalVatRecoverable)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* גרף חזותי — תרומת כל קטגוריה לסכום המוכר */}
        {result.totalRecognizedForIncomeTax > 0 && (
          <div className="bg-paper border border-ink/15 rounded-none p-5">
            <h3 className="font-bold text-ink mb-3">חלוקת ההוצאה המוכרת</h3>
            <RecognizedBreakdown result={result} />
          </div>
        )}

        {/* הערות */}
        {result.notes.length > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-none p-4 text-sm text-amber-900 space-y-1.5">
            {result.notes.map((n, i) => (
              <p key={i}>ℹ️ {n}</p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function RecognizedBreakdown({
  result,
}: {
  result: ReturnType<typeof calculateAllowedExpenses>;
}) {
  const colors = [
    'bg-ink',
    'bg-gold',
    'bg-ink-mid',
    'bg-gold-light',
    'bg-ink-deep',
    'bg-gold-2',
    'bg-ink/60',
    'bg-gold/70',
    'bg-ink-mid/70',
  ];
  const items = result.categories
    .filter((c) => c.recognizedForIncomeTax > 0)
    .map((c, i) => ({
      label: c.label,
      value: c.recognizedForIncomeTax,
      color: colors[i % colors.length],
    }));
  const total = items.reduce((s, i) => s + i.value, 0);
  if (total <= 0) return null;

  return (
    <div className="space-y-3">
      <div className="flex h-8 rounded-none overflow-hidden border border-ink/15">
        {items.map((i) => {
          const pct = (i.value / total) * 100;
          return (
            <div
              key={i.label}
              className={`${i.color} flex items-center justify-center text-cream text-xs font-bold`}
              style={{ width: `${pct}%` }}
              title={`${i.label}: ${pct.toFixed(1)}%`}
            >
              {pct >= 9 ? `${pct.toFixed(0)}%` : ''}
            </div>
          );
        })}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
        {items.map((i) => {
          const pct = (i.value / total) * 100;
          return (
            <div key={i.label} className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-none ${i.color} flex-shrink-0`} />
              <span className="text-ink/70 font-medium">
                {i.label}: {pct.toFixed(1)}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
