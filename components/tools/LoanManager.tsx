'use client';

import { useState } from 'react';
import { useTools } from '@/lib/tools/ToolsContext';
import { formatCurrency } from '@/lib/tools/format';
import { calculateLoan } from '@/lib/tools/budget-engine';
import { HEBREW_MONTHS } from '@/lib/tools/types';
import { Plus, Trash2, Banknote, Edit2, ChevronDown, ChevronUp } from 'lucide-react';
import type { Loan } from '@/lib/tools/types';

const LOAN_TYPES: Array<{ value: NonNullable<Loan['type']>; label: string; color: string }> = [
  { value: 'bank', label: 'בנק', color: 'bg-cream-2 text-ink' },
  { value: 'credit_fund', label: 'חוץ-בנקאי / קרן אשראי', color: 'bg-cream-2 text-gold' },
  { value: 'private', label: 'הלוואה פרטית', color: 'bg-amber-100 text-amber-800' },
  { value: 'government', label: 'בערבות מדינה', color: 'bg-emerald-100 text-emerald-800' },
];

const initialForm = {
  name: '',
  amount: 0,
  termMonths: 60,
  annualRate: 7,
  startMonth: 0,
  type: 'bank' as NonNullable<Loan['type']>,
};

export function LoanManager() {
  const { budget, settings, addLoan, updateLoan, deleteLoan } = useTools();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [form, setForm] = useState(initialForm);

  if (!budget || !settings) return null;

  function reset() {
    setForm(initialForm);
    setEditingId(null);
    setShowForm(false);
  }

  function handleSubmit() {
    if (!form.name.trim() || form.amount <= 0 || form.termMonths <= 0) return;

    if (editingId) {
      updateLoan(editingId, form);
    } else {
      addLoan(form);
    }
    reset();
  }

  function handleEdit(loan: Loan) {
    setForm({
      name: loan.name,
      amount: loan.amount,
      termMonths: loan.termMonths,
      annualRate: loan.annualRate,
      startMonth: loan.startMonth,
      type: loan.type ?? 'bank',
    });
    setEditingId(loan.id);
    setShowForm(true);
  }

  // חישוב סך החזר חודשי / סך ריבית
  const totals = budget.loans.reduce(
    (acc, loan) => {
      const calc = calculateLoan(loan);
      return {
        outstanding: acc.outstanding + loan.amount,
        monthlyPayment: acc.monthlyPayment + calc.monthlyPayment,
        totalInterest: acc.totalInterest + calc.totalInterest,
        totalRepay: acc.totalRepay + calc.totalPayments,
      };
    },
    { outstanding: 0, monthlyPayment: 0, totalInterest: 0, totalRepay: 0 },
  );

  return (
    <div className="bg-paper border-2 border-ink/15 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Banknote className="w-5 h-5 text-amber-600" />
          <h3 className="font-bold text-lg text-ink">הלוואות</h3>
          <span className="text-sm text-ink/60">({budget.loans.length} פריטים)</span>
        </div>
        <button
          onClick={() => {
            if (showForm && !editingId) {
              reset();
            } else {
              reset();
              setShowForm(true);
            }
          }}
          className="flex items-center gap-1 px-3 py-1.5 bg-amber-600 text-white rounded-none hover:bg-amber-700 text-sm"
        >
          <Plus className="w-4 h-4" />
          הוסף הלוואה
        </button>
      </div>

      {/* סיכום */}
      {budget.loans.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4 text-xs">
          <div className="bg-cream-2 border border-ink/15 rounded-none p-2">
            <div className="text-ink/60">קרן כוללת</div>
            <div className="font-bold text-ink">{formatCurrency(totals.outstanding)}</div>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-none p-2">
            <div className="text-amber-600">החזר חודשי</div>
            <div className="font-bold text-amber-900">{formatCurrency(totals.monthlyPayment)}</div>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-none p-2">
            <div className="text-red-600">סך ריבית</div>
            <div className="font-bold text-red-900">{formatCurrency(totals.totalInterest)}</div>
          </div>
          <div className="bg-cream-2 border border-ink/15 rounded-none p-2">
            <div className="text-ink-mid">סך החזר</div>
            <div className="font-bold text-ink">{formatCurrency(totals.totalRepay)}</div>
          </div>
        </div>
      )}

      {/* טופס */}
      {showForm && (
        <div className="bg-cream-2 border border-ink/15 rounded-none p-4 mb-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs text-ink/70 mb-1">שם הלוואה *</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="למשל: הלוואה לרכש ציוד"
                className="w-full px-3 py-2 border border-ink/15 rounded-none text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-ink/70 mb-1">סוג הלוואה</label>
              <select
                value={form.type}
                onChange={(e) =>
                  setForm({ ...form, type: e.target.value as NonNullable<Loan['type']> })
                }
                className="w-full px-3 py-2 border border-ink/15 rounded-none text-sm"
              >
                {LOAN_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-ink/70 mb-1">סכום קרן (₪) *</label>
              <input
                type="number"
                value={form.amount || ''}
                onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })}
                placeholder="100,000"
                className="w-full px-3 py-2 border border-ink/15 rounded-none text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-ink/70 mb-1">תקופה (חודשים) *</label>
              <input
                type="number"
                value={form.termMonths || ''}
                onChange={(e) => setForm({ ...form, termMonths: Number(e.target.value) })}
                placeholder="60"
                className="w-full px-3 py-2 border border-ink/15 rounded-none text-sm"
              />
              <p className="text-[10px] text-ink/60 mt-0.5">
                {form.termMonths > 0 && `(${(form.termMonths / 12).toFixed(1)} שנים)`}
              </p>
            </div>
            <div>
              <label className="block text-xs text-ink/70 mb-1">ריבית שנתית (%) *</label>
              <input
                type="number"
                step={0.1}
                value={form.annualRate || ''}
                onChange={(e) => setForm({ ...form, annualRate: Number(e.target.value) })}
                placeholder="7"
                className="w-full px-3 py-2 border border-ink/15 rounded-none text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-ink/70 mb-1">חודש התחלה</label>
              <select
                value={form.startMonth}
                onChange={(e) => setForm({ ...form, startMonth: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-ink/15 rounded-none text-sm"
              >
                {HEBREW_MONTHS.map((m, i) => (
                  <option key={i} value={i}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* תצוגה מקדימה */}
          {form.amount > 0 && form.termMonths > 0 && (
            <div className="mt-3 p-3 bg-paper rounded-none border border-amber-300 text-xs">
              <div className="grid grid-cols-3 gap-2">
                {(() => {
                  const calc = calculateLoan({
                    id: 'preview',
                    name: form.name,
                    amount: form.amount,
                    termMonths: form.termMonths,
                    annualRate: form.annualRate,
                    startMonth: form.startMonth,
                    type: form.type,
                  });
                  return (
                    <>
                      <div>
                        <div className="text-ink/60">החזר חודשי</div>
                        <div className="font-bold text-amber-700">
                          {formatCurrency(calc.monthlyPayment)}
                        </div>
                      </div>
                      <div>
                        <div className="text-ink/60">סך ריבית</div>
                        <div className="font-bold text-red-700">
                          {formatCurrency(calc.totalInterest)}
                        </div>
                      </div>
                      <div>
                        <div className="text-ink/60">סך החזר</div>
                        <div className="font-bold text-ink">
                          {formatCurrency(calc.totalPayments)}
                        </div>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>
          )}

          <div className="flex gap-2 mt-3">
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-amber-600 text-white rounded-none hover:bg-amber-700 text-sm font-medium"
            >
              {editingId ? 'עדכן' : 'הוסף'}
            </button>
            <button
              onClick={reset}
              className="px-4 py-2 bg-cream-2 text-ink rounded-none hover:bg-paper-hover text-sm"
            >
              ביטול
            </button>
          </div>
        </div>
      )}

      {/* רשימת הלוואות */}
      {budget.loans.length === 0 ? (
        <div className="text-center py-8 text-ink/60 text-sm">
          אין הלוואות כרגע. לחץ "הוסף הלוואה" כדי להתחיל.
          <p className="text-xs mt-1 text-ink/45">
            ההלוואות נכללות אוטומטית ב-P&L (ריבית) ובתזרים (תשלומים).
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {budget.loans.map((loan) => {
            const calc = calculateLoan(loan);
            const typeInfo = LOAN_TYPES.find((t) => t.value === loan.type) ?? LOAN_TYPES[0];
            const isExpanded = expandedId === loan.id;

            return (
              <div
                key={loan.id}
                className="border border-ink/15 rounded-none overflow-hidden"
              >
                <div className="p-3 hover:bg-cream-2">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-ink truncate">
                          {loan.name}
                        </span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full ${typeInfo.color}`}
                        >
                          {typeInfo.label}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-3 text-xs text-ink/60">
                        <span>קרן: <strong>{formatCurrency(loan.amount)}</strong></span>
                        <span>ריבית: <strong>{loan.annualRate}%</strong></span>
                        <span>תקופה: <strong>{loan.termMonths} חודשים</strong></span>
                        <span>החזר/חודש: <strong className="text-amber-700">{formatCurrency(calc.monthlyPayment)}</strong></span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setExpandedId(isExpanded ? null : loan.id)}
                        className="p-1.5 text-ink/60 hover:bg-cream-2 rounded-none"
                        title="הראה/הסתר לוח סילוקין"
                      >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => handleEdit(loan)}
                        className="p-1.5 text-gold hover:bg-cream-2 rounded-none"
                        title="ערוך"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteLoan(loan.id)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                        title="מחק"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* לוח סילוקין */}
                {isExpanded && (
                  <div className="bg-cream-2 border-t border-ink/15 p-3">
                    <div className="text-xs font-semibold mb-2 text-ink/70">
                      לוח סילוקין (12 תשלומים ראשונים)
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="bg-paper border-b border-ink/10">
                            <th className="text-right p-1.5 font-semibold">חודש</th>
                            <th className="text-right p-1.5 font-semibold">תשלום</th>
                            <th className="text-right p-1.5 font-semibold">קרן</th>
                            <th className="text-right p-1.5 font-semibold">ריבית</th>
                            <th className="text-right p-1.5 font-semibold">יתרה</th>
                          </tr>
                        </thead>
                        <tbody>
                          {calc.schedule.slice(0, 12).map((entry, i) => (
                            <tr key={i} className="border-b border-ink/10">
                              <td className="p-1.5">
                                {HEBREW_MONTHS[entry.month % 12]}
                              </td>
                              <td className="p-1.5">{formatCurrency(entry.payment)}</td>
                              <td className="p-1.5 text-emerald-700">
                                {formatCurrency(entry.principal)}
                              </td>
                              <td className="p-1.5 text-red-700">
                                {formatCurrency(entry.interest)}
                              </td>
                              <td className="p-1.5 font-medium">
                                {formatCurrency(entry.balance)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="grid grid-cols-3 gap-2 mt-3 text-xs">
                      <div className="bg-paper rounded-none p-2 border border-ink/15">
                        <div className="text-ink/60">סך החזר</div>
                        <div className="font-bold">{formatCurrency(calc.totalPayments)}</div>
                      </div>
                      <div className="bg-paper rounded-none p-2 border border-red-200">
                        <div className="text-red-600">סך ריבית</div>
                        <div className="font-bold text-red-900">{formatCurrency(calc.totalInterest)}</div>
                      </div>
                      <div className="bg-paper rounded-none p-2 border border-emerald-200">
                        <div className="text-emerald-600">% עלות</div>
                        <div className="font-bold text-emerald-900">
                          {((calc.totalInterest / loan.amount) * 100).toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-3 p-2 bg-cream-2 border border-ink/15 rounded-none text-[11px] text-ink">
        💡 ההלוואות נכללות אוטומטית: <strong>ריבית</strong> בהוצאות מימון ב-P&L,{' '}
        <strong>תשלום מלא (קרן+ריבית)</strong> בתזרים המזומנים.
      </div>
    </div>
  );
}
