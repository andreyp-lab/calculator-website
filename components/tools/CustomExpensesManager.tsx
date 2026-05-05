'use client';

import { useState } from 'react';
import { useTools } from '@/lib/tools/ToolsContext';
import { formatCurrency } from '@/lib/tools/format';
import { Plus, Trash2, Receipt, Edit2 } from 'lucide-react';
import type { CashFlowExpense } from '@/lib/tools/types';

const CATEGORIES: Array<{ value: CashFlowExpense['category']; label: string; color: string }> = [
  { value: 'supplier', label: 'ספק', color: 'bg-blue-100 text-blue-800' },
  { value: 'employee', label: 'עובד / שכר', color: 'bg-emerald-100 text-emerald-800' },
  { value: 'authority', label: 'רשויות (מס/ב.ל./מע"מ)', color: 'bg-red-100 text-red-800' },
  { value: 'check', label: "צ'ק", color: 'bg-purple-100 text-purple-800' },
  { value: 'creditcard', label: 'כרטיס אשראי', color: 'bg-amber-100 text-amber-800' },
  { value: 'loan', label: 'הלוואה / חוב', color: 'bg-orange-100 text-orange-800' },
  { value: 'other', label: 'אחר', color: 'bg-gray-100 text-gray-800' },
];

const STATUSES: Array<{ value: CashFlowExpense['status']; label: string }> = [
  { value: 'pending', label: 'ממתין' },
  { value: 'approved', label: 'מאושר' },
  { value: 'paid', label: 'שולם' },
  { value: 'cleared', label: 'מסולק' },
  { value: 'bounced', label: 'הוחזר' },
];

const initialForm: Omit<CashFlowExpense, 'id'> = {
  category: 'supplier',
  name: '',
  amount: 0,
  date: new Date().toISOString().slice(0, 10),
  paymentTerms: 0,
  status: 'pending',
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

  return (
    <div className="bg-white rounded-lg border-2 border-gray-200 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Receipt className="w-5 h-5 text-orange-600" />
          <h3 className="font-bold text-base text-gray-900">תשלומים חד-פעמיים</h3>
          <span className="text-xs text-gray-500">({cashFlow.customExpenses.length})</span>
        </div>
        <button
          onClick={() => (showForm && !editingId ? reset() : (reset(), setShowForm(true)))}
          className="flex items-center gap-1 px-2.5 py-1 bg-orange-600 text-white rounded-lg hover:bg-orange-700 text-xs"
        >
          <Plus className="w-3 h-3" />
          הוסף תשלום
        </button>
      </div>

      {cashFlow.customExpenses.length > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded p-2 mb-3 text-sm">
          <div className="flex justify-between">
            <span className="text-orange-700">סה"כ תשלומים חד-פעמיים:</span>
            <span className="font-bold text-orange-900">{fmt(total)}</span>
          </div>
        </div>
      )}

      {showForm && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div>
              <label className="block text-xs text-gray-700 mb-1">שם / תיאור</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="לדוגמה: תשלום מס שנתי"
                className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-700 mb-1">קטגוריה</label>
              <select
                value={form.category}
                onChange={(e) =>
                  setForm({ ...form, category: e.target.value as CashFlowExpense['category'] })
                }
                className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
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
              <label className="block text-xs text-gray-700 mb-1">ימי דחייה (תנאי)</label>
              <input
                type="number"
                value={form.paymentTerms}
                onChange={(e) => setForm({ ...form, paymentTerms: Number(e.target.value) })}
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
                {STATUSES.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex gap-2 mt-2">
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
          אין תשלומים חד-פעמיים. הוסף תשלום שלא נכנס לתקציב הרגיל (כמו מס שנתי, השקעה,
          רכישת ציוד גדולה).
        </div>
      ) : (
        <div className="space-y-1.5">
          {cashFlow.customExpenses.map((expense) => {
            const cat = CATEGORIES.find((c) => c.value === expense.category) ?? CATEGORIES[6];
            return (
              <div
                key={expense.id}
                className="flex items-center gap-2 p-2 bg-gray-50 border border-gray-200 rounded text-sm"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${cat.color}`}>
                      {cat.label}
                    </span>
                    <span className="font-semibold text-gray-900">{expense.name}</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    {expense.date} • {expense.paymentTerms} ימי תשלום
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
      )}
    </div>
  );
}
