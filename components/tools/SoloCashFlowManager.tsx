'use client';

import { useState, useEffect } from 'react';
import {
  type SoloCashFlowData,
  type SoloCashFlowItem,
  type SoloIncomeCategory,
  type SoloExpenseCategory,
  type SoloItemType,
  type SoloRecurringFrequency,
} from '@/lib/tools/types';
import {
  INCOME_CATEGORY_LABELS,
  EXPENSE_CATEGORY_LABELS,
  RECURRING_LABELS,
  createSampleSoloData,
} from '@/lib/tools/solo-cashflow-engine';
import { formatCurrency } from '@/lib/tools/format';
import { Plus, Trash2, Edit2, Database, ArrowDownCircle, ArrowUpCircle } from 'lucide-react';

interface Props {
  data: SoloCashFlowData;
  onChange: (data: SoloCashFlowData) => void;
}

const initialForm: Omit<SoloCashFlowItem, 'id'> = {
  date: new Date().toISOString().split('T')[0],
  type: 'in',
  amount: 0,
  category: 'sales',
  description: '',
  recurring: 'monthly',
};

export function SoloCashFlowManager({ data, onChange }: Props) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<SoloCashFlowItem, 'id'>>(initialForm);

  const fmt = (v: number) => formatCurrency(v, data.currency);

  function reset() {
    setForm(initialForm);
    setEditingId(null);
    setShowForm(false);
  }

  function genId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  }

  function handleSubmit() {
    if (!form.description.trim() || form.amount <= 0) return;

    if (editingId) {
      onChange({
        ...data,
        items: data.items.map((i) => (i.id === editingId ? { ...form, id: editingId } : i)),
      });
    } else {
      onChange({
        ...data,
        items: [...data.items, { ...form, id: genId() }],
      });
    }
    reset();
  }

  function deleteItem(id: string) {
    onChange({ ...data, items: data.items.filter((i) => i.id !== id) });
  }

  function startEdit(item: SoloCashFlowItem) {
    setForm({
      date: item.date,
      type: item.type,
      amount: item.amount,
      category: item.category,
      description: item.description,
      recurring: item.recurring,
      recurringEnd: item.recurringEnd,
      accountId: item.accountId,
      status: item.status,
    });
    setEditingId(item.id);
    setShowForm(true);
  }

  function loadSample() {
    if (data.items.length > 0 && !confirm('זה ימחק את הנתונים הקיימים. להמשיך?')) return;
    onChange(createSampleSoloData());
  }

  const categoryOptions =
    form.type === 'in'
      ? (Object.keys(INCOME_CATEGORY_LABELS) as SoloIncomeCategory[])
      : (Object.keys(EXPENSE_CATEGORY_LABELS) as SoloExpenseCategory[]);

  const totalIn = data.items
    .filter((i) => i.type === 'in')
    .reduce((sum, i) => {
      // Estimate based on recurring frequency and projection period
      const months = data.monthsToProject;
      const multiplier = {
        once: 1,
        weekly: months * 4.33,
        monthly: months,
        quarterly: months / 3,
        yearly: months / 12,
      }[i.recurring];
      return sum + i.amount * Math.max(1, Math.floor(multiplier));
    }, 0);

  const totalOut = data.items
    .filter((i) => i.type === 'out')
    .reduce((sum, i) => {
      const months = data.monthsToProject;
      const multiplier = {
        once: 1,
        weekly: months * 4.33,
        monthly: months,
        quarterly: months / 3,
        yearly: months / 12,
      }[i.recurring];
      return sum + i.amount * Math.max(1, Math.floor(multiplier));
    }, 0);

  // Sort items by date
  const sortedItems = [...data.items].sort((a, b) => a.date.localeCompare(b.date));

  return (
    <div className="bg-white rounded-lg border-2 border-gray-200 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Database className="w-5 h-5 text-emerald-600" />
          <h3 className="font-bold text-lg text-gray-900">פריטי תזרים</h3>
          <span className="text-sm text-gray-500">({data.items.length} פריטים)</span>
        </div>
        <div className="flex gap-2">
          {data.items.length === 0 && (
            <button
              onClick={loadSample}
              className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 text-sm flex items-center gap-1"
            >
              <Database className="w-4 h-4" />
              טען דוגמה
            </button>
          )}
          <button
            onClick={() => (showForm && !editingId ? reset() : (reset(), setShowForm(true)))}
            className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 text-sm flex items-center gap-1"
          >
            <Plus className="w-4 h-4" />
            הוסף פריט
          </button>
        </div>
      </div>

      {/* Summary Bar */}
      {data.items.length > 0 && (
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="bg-emerald-50 rounded p-2 text-center">
            <div className="text-xs text-gray-600">תקבולים צפויים</div>
            <div className="text-lg font-bold text-emerald-700">{fmt(totalIn)}</div>
          </div>
          <div className="bg-red-50 rounded p-2 text-center">
            <div className="text-xs text-gray-600">תשלומים צפויים</div>
            <div className="text-lg font-bold text-red-700">{fmt(totalOut)}</div>
          </div>
          <div
            className={`${
              totalIn - totalOut >= 0 ? 'bg-blue-50' : 'bg-amber-50'
            } rounded p-2 text-center`}
          >
            <div className="text-xs text-gray-600">תזרים נטו</div>
            <div
              className={`text-lg font-bold ${
                totalIn - totalOut >= 0 ? 'text-blue-700' : 'text-amber-700'
              }`}
            >
              {fmt(totalIn - totalOut)}
            </div>
          </div>
        </div>
      )}

      {/* Form */}
      {showForm && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs text-gray-700 mb-1">סוג *</label>
              <div className="flex gap-1">
                <button
                  onClick={() =>
                    setForm({ ...form, type: 'in', category: 'sales' })
                  }
                  className={`flex-1 px-2 py-1.5 rounded text-sm transition ${
                    form.type === 'in'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-white border border-gray-300 text-gray-700'
                  }`}
                >
                  <ArrowDownCircle className="w-4 h-4 inline mr-1" />
                  תקבול
                </button>
                <button
                  onClick={() =>
                    setForm({ ...form, type: 'out', category: 'rent' })
                  }
                  className={`flex-1 px-2 py-1.5 rounded text-sm transition ${
                    form.type === 'out'
                      ? 'bg-red-600 text-white'
                      : 'bg-white border border-gray-300 text-gray-700'
                  }`}
                >
                  <ArrowUpCircle className="w-4 h-4 inline mr-1" />
                  תשלום
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs text-gray-700 mb-1">תאריך *</label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-700 mb-1">סכום (₪) *</label>
              <input
                type="number"
                value={form.amount || ''}
                onChange={(e) => setForm({ ...form, amount: parseFloat(e.target.value) || 0 })}
                placeholder="0"
                className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs text-gray-700 mb-1">תיאור *</label>
              <input
                type="text"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="לדוגמה: שכירות משרד"
                className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-700 mb-1">קטגוריה</label>
              <select
                value={form.category}
                onChange={(e) =>
                  setForm({
                    ...form,
                    category: e.target.value as SoloIncomeCategory | SoloExpenseCategory,
                  })
                }
                className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
              >
                {categoryOptions.map((cat) => (
                  <option key={cat} value={cat}>
                    {form.type === 'in'
                      ? INCOME_CATEGORY_LABELS[cat as SoloIncomeCategory]
                      : EXPENSE_CATEGORY_LABELS[cat as SoloExpenseCategory]}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs text-gray-700 mb-1">תכיפות</label>
              <select
                value={form.recurring}
                onChange={(e) =>
                  setForm({ ...form, recurring: e.target.value as SoloRecurringFrequency })
                }
                className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
              >
                {(Object.keys(RECURRING_LABELS) as SoloRecurringFrequency[]).map((f) => (
                  <option key={f} value={f}>
                    {RECURRING_LABELS[f]}
                  </option>
                ))}
              </select>
            </div>

            {form.recurring !== 'once' && (
              <div>
                <label className="block text-xs text-gray-700 mb-1">תאריך סיום (אופציונלי)</label>
                <input
                  type="date"
                  value={form.recurringEnd ?? ''}
                  onChange={(e) =>
                    setForm({ ...form, recurringEnd: e.target.value || undefined })
                  }
                  className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
                />
              </div>
            )}
          </div>

          <div className="flex gap-2 mt-3">
            <button
              onClick={handleSubmit}
              disabled={!form.description.trim() || form.amount <= 0}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50"
            >
              {editingId ? 'עדכן' : 'הוסף'}
            </button>
            <button
              onClick={reset}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
            >
              ביטול
            </button>
          </div>
        </div>
      )}

      {/* Items List */}
      {data.items.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Database className="w-12 h-12 mx-auto mb-2 opacity-30" />
          <p>אין פריטים. לחץ "הוסף פריט" או "טען דוגמה".</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-right p-2">תאריך</th>
                <th className="text-right p-2">סוג</th>
                <th className="text-right p-2">תיאור</th>
                <th className="text-right p-2">קטגוריה</th>
                <th className="text-right p-2">תכיפות</th>
                <th className="text-left p-2">סכום</th>
                <th className="p-2"></th>
              </tr>
            </thead>
            <tbody>
              {sortedItems.map((item) => {
                const catLabel =
                  item.type === 'in'
                    ? INCOME_CATEGORY_LABELS[item.category as SoloIncomeCategory]
                    : EXPENSE_CATEGORY_LABELS[item.category as SoloExpenseCategory];
                return (
                  <tr key={item.id} className="border-t border-gray-100 hover:bg-gray-50">
                    <td className="p-2 text-xs">{item.date}</td>
                    <td className="p-2">
                      {item.type === 'in' ? (
                        <span className="flex items-center gap-1 text-emerald-700">
                          <ArrowDownCircle className="w-4 h-4" />
                          תקבול
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-red-700">
                          <ArrowUpCircle className="w-4 h-4" />
                          תשלום
                        </span>
                      )}
                    </td>
                    <td className="p-2 font-medium">{item.description}</td>
                    <td className="p-2 text-xs text-gray-600">{catLabel}</td>
                    <td className="p-2 text-xs">
                      <span className="bg-gray-100 px-2 py-0.5 rounded">
                        {RECURRING_LABELS[item.recurring]}
                      </span>
                    </td>
                    <td
                      className={`p-2 text-left font-bold ${
                        item.type === 'in' ? 'text-emerald-700' : 'text-red-700'
                      }`}
                    >
                      {item.type === 'in' ? '+' : '-'}
                      {fmt(item.amount)}
                    </td>
                    <td className="p-2">
                      <div className="flex gap-1">
                        <button
                          onClick={() => startEdit(item)}
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deleteItem(item.id)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
