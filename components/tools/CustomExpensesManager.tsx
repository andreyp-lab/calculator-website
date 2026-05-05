'use client';

import { useState } from 'react';
import { useTools } from '@/lib/tools/ToolsContext';
import { formatCurrency } from '@/lib/tools/format';
import { Plus, Trash2, Receipt, Edit2 } from 'lucide-react';
import type { CashFlowExpense, ExpenseFrequency } from '@/lib/tools/types';

const CATEGORIES: Array<{
  value: CashFlowExpense['category'];
  label: string;
  color: string;
  icon: string;
}> = [
  { value: 'supplier', label: 'ספק', color: 'bg-blue-100 text-blue-800', icon: '🚚' },
  { value: 'employee', label: 'עובד / שכר', color: 'bg-emerald-100 text-emerald-800', icon: '👥' },
  {
    value: 'authority',
    label: 'רשויות (מס/ב.ל./מע"מ)',
    color: 'bg-red-100 text-red-800',
    icon: '🏛️',
  },
  { value: 'check', label: 'שיק לתשלום', color: 'bg-purple-100 text-purple-800', icon: '✍️' },
  { value: 'creditcard', label: 'כרטיס אשראי', color: 'bg-amber-100 text-amber-800', icon: '💳' },
  { value: 'loan', label: 'הלוואה / חוב', color: 'bg-orange-100 text-orange-800', icon: '🏦' },
  { value: 'other', label: 'אחר', color: 'bg-gray-100 text-gray-800', icon: '📋' },
];

const FREQUENCIES: Array<{ value: ExpenseFrequency; label: string }> = [
  { value: 'once', label: 'חד-פעמי' },
  { value: 'monthly', label: 'חודשי' },
  { value: 'quarterly', label: 'רבעוני' },
  { value: 'yearly', label: 'שנתי' },
];

const AUTHORITY_TYPES = [
  { value: 'tax', label: 'מס הכנסה' },
  { value: 'vat', label: 'מע"מ' },
  { value: 'insurance', label: 'ביטוח לאומי' },
  { value: 'license', label: 'אגרות / רישוי' },
  { value: 'other', label: 'אחר' },
];

const PRIORITIES = [
  { value: 'low', label: 'נמוכה' },
  { value: 'medium', label: 'בינונית' },
  { value: 'high', label: 'גבוהה' },
  { value: 'critical', label: 'קריטית' },
];

const CREDIT_COMPANIES = [
  { value: 'visa', label: 'ויזה' },
  { value: 'mastercard', label: 'מאסטרקארד' },
  { value: 'amex', label: 'אמריקן אקספרס' },
  { value: 'cal', label: 'כאל' },
  { value: 'diners', label: 'דיינרס' },
];

const initialForm: Omit<CashFlowExpense, 'id'> = {
  category: 'supplier',
  name: '',
  amount: 0,
  date: new Date().toISOString().slice(0, 10),
  paymentTerms: 0,
  status: 'pending',
  frequency: 'once',
  details: {},
};

export function CustomExpensesManager() {
  const { cashFlow, settings, addCustomExpense, updateCustomExpense, deleteCustomExpense } =
    useTools();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<CashFlowExpense, 'id'>>(initialForm);

  if (!cashFlow || !settings) return null;

  function reset() {
    setForm(initialForm);
    setEditingId(null);
    setShowForm(false);
  }

  function updateDetail(key: string, value: string | number) {
    setForm((prev) => ({
      ...prev,
      details: { ...(prev.details ?? {}), [key]: value },
    }));
  }

  function handleSubmit() {
    if (!form.name.trim() || form.amount <= 0) return;
    if (editingId) {
      updateCustomExpense(editingId, form);
    } else {
      addCustomExpense(form);
    }
    reset();
  }

  const fmt = (v: number) => formatCurrency(v, settings.currency);
  const total = cashFlow.customExpenses.reduce((sum, e) => sum + e.amount, 0);

  const byCategory = CATEGORIES.map((cat) => ({
    ...cat,
    items: cashFlow.customExpenses.filter((e) => e.category === cat.value),
    total: cashFlow.customExpenses
      .filter((e) => e.category === cat.value)
      .reduce((s, e) => s + e.amount, 0),
  })).filter((c) => c.items.length > 0);

  return (
    <div className="bg-white rounded-lg border-2 border-gray-200 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Receipt className="w-5 h-5 text-orange-600" />
          <h3 className="font-bold text-base text-gray-900">
            הוצאות מפורטות (ספקים, רשויות, שיקים, אשראי)
          </h3>
          <span className="text-xs text-gray-500">({cashFlow.customExpenses.length})</span>
        </div>
        <button
          onClick={() => (showForm && !editingId ? reset() : (reset(), setShowForm(true)))}
          className="flex items-center gap-1 px-2.5 py-1 bg-orange-600 text-white rounded-lg hover:bg-orange-700 text-xs"
        >
          <Plus className="w-3 h-3" />
          הוסף הוצאה
        </button>
      </div>

      {cashFlow.customExpenses.length > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded p-2 mb-3 text-sm">
          <div className="flex justify-between">
            <span className="text-orange-700">סה"כ הוצאות:</span>
            <span className="font-bold text-orange-900">{fmt(total)}</span>
          </div>
        </div>
      )}

      {showForm && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-3 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div>
              <label className="block text-xs text-gray-700 mb-1">קטגוריה</label>
              <select
                value={form.category}
                onChange={(e) =>
                  setForm({
                    ...form,
                    category: e.target.value as CashFlowExpense['category'],
                    details: {},
                  })
                }
                className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.icon} {c.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-700 mb-1">שם / תיאור</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="לדוגמה: ספק חומרי גלם"
                className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-700 mb-1">סכום (₪)</label>
              <input
                type="number"
                value={form.amount || ''}
                onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })}
                className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-700 mb-1">תאריך תשלום</label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-700 mb-1">ימי דחייה</label>
              <input
                type="number"
                value={form.paymentTerms}
                onChange={(e) => setForm({ ...form, paymentTerms: Number(e.target.value) })}
                className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-700 mb-1">תכיפות</label>
              <select
                value={form.frequency ?? 'once'}
                onChange={(e) => setForm({ ...form, frequency: e.target.value as ExpenseFrequency })}
                className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
              >
                {FREQUENCIES.map((f) => (
                  <option key={f.value} value={f.value}>
                    {f.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {form.category === 'supplier' && (
            <div className="bg-blue-50 border border-blue-200 rounded p-2">
              <div className="text-xs font-semibold text-blue-900 mb-2">פרטי ספק</div>
              <div>
                <label className="block text-xs text-gray-700 mb-1">סטטוס</label>
                <select
                  value={form.status}
                  onChange={(e) =>
                    setForm({ ...form, status: e.target.value as CashFlowExpense['status'] })
                  }
                  className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
                >
                  <option value="pending">ממתין</option>
                  <option value="approved">מאושר</option>
                  <option value="paid">שולם</option>
                </select>
              </div>
            </div>
          )}

          {form.category === 'authority' && (
            <div className="bg-red-50 border border-red-200 rounded p-2">
              <div className="text-xs font-semibold text-red-900 mb-2">פרטי רשות</div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs text-gray-700 mb-1">סוג תשלום</label>
                  <select
                    value={(form.details?.authorityType as string) ?? 'tax'}
                    onChange={(e) => updateDetail('authorityType', e.target.value)}
                    className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
                  >
                    {AUTHORITY_TYPES.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-700 mb-1">דחיפות</label>
                  <select
                    value={(form.details?.priority as string) ?? 'medium'}
                    onChange={(e) => updateDetail('priority', e.target.value)}
                    className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
                  >
                    {PRIORITIES.map((p) => (
                      <option key={p.value} value={p.value}>
                        {p.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {form.category === 'check' && (
            <div className="bg-purple-50 border border-purple-200 rounded p-2">
              <div className="text-xs font-semibold text-purple-900 mb-2">פרטי שיק</div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs text-gray-700 mb-1">מספר שיק</label>
                  <input
                    type="text"
                    value={(form.details?.checkNumber as string) ?? ''}
                    onChange={(e) => updateDetail('checkNumber', e.target.value)}
                    placeholder="123456"
                    className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-700 mb-1">נמען</label>
                  <input
                    type="text"
                    value={(form.details?.payee as string) ?? ''}
                    onChange={(e) => updateDetail('payee', e.target.value)}
                    placeholder="שם הנמען"
                    className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-700 mb-1">בנק</label>
                  <input
                    type="text"
                    value={(form.details?.bank as string) ?? ''}
                    onChange={(e) => updateDetail('bank', e.target.value)}
                    placeholder="לאומי / פועלים..."
                    className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-700 mb-1">סטטוס</label>
                  <select
                    value={form.status}
                    onChange={(e) =>
                      setForm({ ...form, status: e.target.value as CashFlowExpense['status'] })
                    }
                    className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
                  >
                    <option value="pending">הונפק / ממתין</option>
                    <option value="cleared">נפרע</option>
                    <option value="bounced">חזר</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {form.category === 'creditcard' && (
            <div className="bg-amber-50 border border-amber-200 rounded p-2">
              <div className="text-xs font-semibold text-amber-900 mb-2">פרטי כרטיס אשראי</div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs text-gray-700 mb-1">חברת אשראי</label>
                  <select
                    value={(form.details?.creditCompany as string) ?? 'visa'}
                    onChange={(e) => updateDetail('creditCompany', e.target.value)}
                    className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
                  >
                    {CREDIT_COMPANIES.map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-700 mb-1">4 ספרות</label>
                  <input
                    type="text"
                    maxLength={4}
                    value={(form.details?.last4 as string) ?? ''}
                    onChange={(e) => updateDetail('last4', e.target.value.replace(/\D/g, ''))}
                    placeholder="0000"
                    className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-700 mb-1">מספר תשלומים</label>
                  <select
                    value={(form.details?.payments as number) ?? 1}
                    onChange={(e) => updateDetail('payments', Number(e.target.value))}
                    className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
                  >
                    <option value={1}>1</option>
                    <option value={2}>2</option>
                    <option value={3}>3</option>
                    <option value={6}>6</option>
                    <option value={12}>12</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <button
              onClick={handleSubmit}
              className="px-3 py-1 bg-orange-600 text-white rounded text-xs"
            >
              {editingId ? 'עדכן' : 'הוסף'}
            </button>
            <button onClick={reset} className="px-3 py-1 bg-gray-200 rounded text-xs">
              ביטול
            </button>
          </div>
        </div>
      )}

      {cashFlow.customExpenses.length === 0 ? (
        <div className="text-center py-4 text-gray-400 text-xs">
          אין הוצאות. הוסף תשלום ספק / רשות / שיק / אשראי.
        </div>
      ) : (
        <div className="space-y-3">
          {byCategory.map((cat) => (
            <div key={cat.value} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-semibold text-gray-700 border-b pb-1">
                <span>
                  {cat.icon} {cat.label} ({cat.items.length})
                </span>
                <span>{fmt(cat.total)}</span>
              </div>
              {cat.items.map((expense) => {
                const freqLabel =
                  FREQUENCIES.find((f) => f.value === expense.frequency)?.label ?? '';
                return (
                  <div
                    key={expense.id}
                    className="flex items-center gap-2 p-2 bg-gray-50 border border-gray-200 rounded text-sm"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-gray-900 truncate">{expense.name}</div>
                      <div className="text-xs text-gray-500 mt-0.5 flex flex-wrap gap-x-2">
                        <span>{expense.date}</span>
                        {expense.paymentTerms > 0 && (
                          <span>{expense.paymentTerms} ימי דחייה</span>
                        )}
                        {freqLabel && expense.frequency !== 'once' && (
                          <span>📅 {freqLabel}</span>
                        )}
                        {expense.details?.checkNumber ? (
                          <span>שיק #{expense.details.checkNumber}</span>
                        ) : null}
                        {expense.details?.last4 ? <span>****{expense.details.last4}</span> : null}
                        {expense.details?.payments && Number(expense.details.payments) > 1 ? (
                          <span>×{expense.details.payments}</span>
                        ) : null}
                      </div>
                    </div>
                    <div className="font-bold text-red-700">{fmt(expense.amount)}</div>
                    <button
                      onClick={() => {
                        setForm({
                          category: expense.category,
                          name: expense.name,
                          amount: expense.amount,
                          date: expense.date,
                          paymentTerms: expense.paymentTerms,
                          status: expense.status,
                          frequency: expense.frequency ?? 'once',
                          details: expense.details ?? {},
                        });
                        setEditingId(expense.id);
                        setShowForm(true);
                      }}
                      className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => deleteCustomExpense(expense.id)}
                      className="p-1 text-red-600 hover:bg-red-50 rounded"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
