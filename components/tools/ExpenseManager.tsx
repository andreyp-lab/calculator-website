'use client';

import { useState } from 'react';
import { useTools } from '@/lib/tools/ToolsContext';
import { formatCurrency } from '@/lib/tools/format';
import { calculateExpenseTotal } from '@/lib/tools/budget-engine';
import {
  HEBREW_MONTHS,
  ExpenseCategory,
  EXPENSE_CATEGORY_LABELS,
} from '@/lib/tools/types';
import { Plus, Trash2, TrendingDown } from 'lucide-react';
import { PaymentTermsEditor } from './PaymentTermsEditor';
import type { PaymentTermInstallment } from '@/lib/tools/types';

const CATEGORY_COLORS: Record<ExpenseCategory, string> = {
  cogs: 'border-red-200 bg-red-50',
  rnd: 'border-purple-200 bg-purple-50',
  marketing: 'border-orange-200 bg-orange-50',
  operating: 'border-blue-200 bg-blue-50',
  financial: 'border-teal-200 bg-teal-50',
};

export function ExpenseManager() {
  const { budget, settings, addExpense, deleteExpense } = useTools();
  const [activeCategory, setActiveCategory] = useState<ExpenseCategory>('cogs');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: '',
    amount: 0,
    isPct: false,
    percentage: 0,
    linkedIncomeId: '',
    startMonth: 0,
    duration: 12,
    paymentTerms: 0,
    paymentSplit: undefined as PaymentTermInstallment[] | undefined,
    applyInflation: false,
  });

  if (!budget || !settings) return null;

  function handleAdd() {
    if (!form.name.trim()) return;
    if (!form.isPct && form.amount <= 0) return;
    if (form.isPct && form.percentage <= 0) return;

    addExpense({
      category: activeCategory,
      name: form.name,
      amount: form.amount,
      isPct: form.isPct,
      percentage: form.percentage,
      linkedIncomeId: form.linkedIncomeId || undefined,
      startMonth: form.startMonth,
      duration: form.duration,
      paymentTerms: form.paymentTerms,
      paymentSplit: form.paymentSplit,
      applyInflation: form.applyInflation,
    });

    setForm({
      name: '',
      amount: 0,
      isPct: false,
      percentage: 0,
      linkedIncomeId: '',
      startMonth: 0,
      duration: 12,
      paymentTerms: 0,
      paymentSplit: undefined,
      applyInflation: false,
    });
    setShowForm(false);
  }

  const categoryExpenses = budget.expenses.filter((e) => e.category === activeCategory);
  const categoryTotal = categoryExpenses.reduce(
    (sum, exp) => sum + calculateExpenseTotal(exp, budget.income, settings.monthsToShow),
    0,
  );

  return (
    <div className="bg-white rounded-lg border-2 border-gray-200 p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <TrendingDown className="w-5 h-5 text-red-600" />
        <h3 className="font-bold text-lg text-gray-900">הוצאות</h3>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 flex-wrap mb-4 border-b border-gray-200 pb-3">
        {(Object.keys(EXPENSE_CATEGORY_LABELS) as ExpenseCategory[]).map((cat) => {
          const count = budget.expenses.filter((e) => e.category === cat).length;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                activeCategory === cat
                  ? `${CATEGORY_COLORS[cat]} border-2`
                  : 'bg-gray-100 text-gray-600 border-2 border-transparent hover:bg-gray-200'
              }`}
            >
              {EXPENSE_CATEGORY_LABELS[cat]}
              {count > 0 && (
                <span className="ml-1 text-xs bg-white px-1.5 py-0.5 rounded">{count}</span>
              )}
            </button>
          );
        })}
      </div>

      <div className="flex justify-between items-center mb-3">
        <span className="text-sm text-gray-600">
          {EXPENSE_CATEGORY_LABELS[activeCategory]} - {categoryExpenses.length} פריטים
        </span>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
        >
          <Plus className="w-4 h-4" />
          הוסף הוצאה
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className={`border rounded-lg p-4 mb-4 ${CATEGORY_COLORS[activeCategory]}`}>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <div className="col-span-2 md:col-span-3">
              <label className="block text-xs text-gray-700 mb-1">שם ההוצאה *</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="לדוגמה: שכר דירה משרד"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>

            <div className="col-span-2 md:col-span-3 flex items-center gap-3 bg-white p-3 rounded">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  checked={!form.isPct}
                  onChange={() => setForm({ ...form, isPct: false })}
                />
                סכום קבוע
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  checked={form.isPct}
                  onChange={() => setForm({ ...form, isPct: true })}
                />
                אחוז מהכנסות
              </label>
            </div>

            {!form.isPct ? (
              <div>
                <label className="block text-xs text-gray-700 mb-1">סכום חודשי *</label>
                <input
                  type="number"
                  value={form.amount || ''}
                  onChange={(e) => setForm({ ...form, amount: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
            ) : (
              <>
                <div>
                  <label className="block text-xs text-gray-700 mb-1">% מהכנסה *</label>
                  <input
                    type="number"
                    value={form.percentage || ''}
                    onChange={(e) =>
                      setForm({ ...form, percentage: parseFloat(e.target.value) || 0 })
                    }
                    step={0.1}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-700 mb-1">קישור להכנסה</label>
                  <select
                    value={form.linkedIncomeId}
                    onChange={(e) => setForm({ ...form, linkedIncomeId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  >
                    <option value="">סך כל ההכנסות</option>
                    {budget.income.map((inc) => (
                      <option key={inc.id} value={inc.id}>
                        {inc.name}
                      </option>
                    ))}
                  </select>
                </div>
              </>
            )}

            <div>
              <label className="block text-xs text-gray-700 mb-1">חודש התחלה</label>
              <select
                value={form.startMonth}
                onChange={(e) => setForm({ ...form, startMonth: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                {HEBREW_MONTHS.map((m, i) => (
                  <option key={i} value={i}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-700 mb-1">משך (חודשים)</label>
              <input
                type="number"
                value={form.duration}
                onChange={(e) =>
                  setForm({ ...form, duration: parseInt(e.target.value) || 12 })
                }
                min={1}
                max={36}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>
            <div className="md:col-span-2">
              <PaymentTermsEditor
                label="תנאי תשלום"
                value={
                  form.paymentSplit && form.paymentSplit.length > 0
                    ? { simpleNet: form.paymentTerms, installments: form.paymentSplit }
                    : { simpleNet: form.paymentTerms }
                }
                onChange={(t) =>
                  setForm({
                    ...form,
                    paymentTerms: t.simpleNet,
                    paymentSplit: t.installments,
                  })
                }
              />
            </div>
            <div>
              <label className="flex items-center gap-2 cursor-pointer mt-2">
                <input
                  type="checkbox"
                  checked={form.applyInflation}
                  onChange={(e) => setForm({ ...form, applyInflation: e.target.checked })}
                  className="w-4 h-4"
                />
                <span className="text-xs text-gray-700">החל אינפלציה שנתית (מהגדרות)</span>
              </label>
            </div>
          </div>
          <div className="flex gap-2 mt-3">
            <button
              onClick={handleAdd}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              הוסף
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
            >
              ביטול
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      {categoryExpenses.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>אין הוצאות ב{EXPENSE_CATEGORY_LABELS[activeCategory]}</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-right px-3 py-2">שם</th>
                <th className="text-right px-3 py-2">סכום</th>
                <th className="text-right px-3 py-2">תקופה</th>
                <th className="text-right px-3 py-2">תנאי</th>
                <th className="text-right px-3 py-2">סה"כ</th>
                <th className="text-center px-3 py-2 w-16"></th>
              </tr>
            </thead>
            <tbody>
              {categoryExpenses.map((exp) => (
                <tr key={exp.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-3 py-2 font-medium">{exp.name}</td>
                  <td className="px-3 py-2">
                    {exp.isPct ? (
                      <span className="text-blue-700">{exp.percentage}% מהכנסות</span>
                    ) : (
                      formatCurrency(exp.amount, settings.currency)
                    )}
                  </td>
                  <td className="px-3 py-2 text-xs text-gray-600">
                    {HEBREW_MONTHS[exp.startMonth]} ({exp.duration} ח')
                  </td>
                  <td className="px-3 py-2 text-xs text-gray-600">
                    {exp.paymentTerms === 0 ? 'מיידי' : `+${exp.paymentTerms}`}
                  </td>
                  <td className="px-3 py-2 font-medium text-red-700">
                    {formatCurrency(
                      calculateExpenseTotal(exp, budget.income, settings.monthsToShow),
                      settings.currency,
                    )}
                  </td>
                  <td className="px-3 py-2 text-center">
                    <button
                      onClick={() => deleteExpense(exp.id)}
                      className="p-1 text-red-600 hover:bg-red-50 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-red-50 font-bold">
              <tr>
                <td colSpan={4} className="px-3 py-2 text-right">
                  סה"כ {EXPENSE_CATEGORY_LABELS[activeCategory]}:
                </td>
                <td className="px-3 py-2 text-red-700">
                  {formatCurrency(categoryTotal, settings.currency)}
                </td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </div>
  );
}
