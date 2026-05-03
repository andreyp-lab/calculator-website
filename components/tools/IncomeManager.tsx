'use client';

import { useState } from 'react';
import { useTools } from '@/lib/tools/ToolsContext';
import { formatCurrency, formatPercent } from '@/lib/tools/format';
import { calculateIncomeTotal } from '@/lib/tools/budget-engine';
import { HEBREW_MONTHS } from '@/lib/tools/types';
import { Plus, Trash2, TrendingUp, Edit2 } from 'lucide-react';

export function IncomeManager() {
  const { budget, settings, addIncome, deleteIncome } = useTools();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: '',
    amount: 0,
    startMonth: 0,
    duration: 12,
    growthPct: 0,
    paymentTerms: 0,
    status: 'expected' as const,
  });

  if (!budget || !settings) return null;

  function handleAdd() {
    if (!form.name.trim() || form.amount <= 0) return;
    addIncome(form);
    setForm({
      name: '',
      amount: 0,
      startMonth: 0,
      duration: 12,
      growthPct: 0,
      paymentTerms: 0,
      status: 'expected',
    });
    setShowForm(false);
  }

  const totalIncome = budget.income.reduce(
    (sum, inc) => sum + calculateIncomeTotal(inc, settings.monthsToShow),
    0,
  );

  return (
    <div className="bg-white rounded-lg border-2 border-gray-200 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-green-600" />
          <h3 className="font-bold text-lg text-gray-900">הכנסות</h3>
          <span className="text-sm text-gray-500">({budget.income.length} פריטים)</span>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
        >
          <Plus className="w-4 h-4" />
          הוסף הכנסה
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs text-gray-700 mb-1">שם הכנסה *</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="לדוגמה: מכירת מוצרים"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-700 mb-1">סכום חודשי *</label>
              <input
                type="number"
                value={form.amount || ''}
                onChange={(e) => setForm({ ...form, amount: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>
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
            <div>
              <label className="block text-xs text-gray-700 mb-1">צמיחה חודשית (%)</label>
              <input
                type="number"
                value={form.growthPct}
                onChange={(e) =>
                  setForm({ ...form, growthPct: parseFloat(e.target.value) || 0 })
                }
                step={0.1}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-700 mb-1">תנאי תשלום (ימים)</label>
              <select
                value={form.paymentTerms}
                onChange={(e) =>
                  setForm({ ...form, paymentTerms: parseInt(e.target.value) })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value={0}>מיידי</option>
                <option value={30}>שוטף + 30</option>
                <option value={60}>שוטף + 60</option>
                <option value={90}>שוטף + 90</option>
              </select>
            </div>
          </div>
          <div className="flex gap-2 mt-3">
            <button
              onClick={handleAdd}
              disabled={!form.name.trim() || form.amount <= 0}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
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
      {budget.income.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <TrendingUp className="w-12 h-12 mx-auto mb-2 opacity-30" />
          <p>אין הכנסות עדיין. לחץ "הוסף הכנסה" כדי להתחיל.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-right px-3 py-2">שם</th>
                <th className="text-right px-3 py-2">סכום חודשי</th>
                <th className="text-right px-3 py-2">תקופה</th>
                <th className="text-right px-3 py-2">צמיחה</th>
                <th className="text-right px-3 py-2">תנאי</th>
                <th className="text-right px-3 py-2">סה"כ</th>
                <th className="text-center px-3 py-2 w-16">פעולות</th>
              </tr>
            </thead>
            <tbody>
              {budget.income.map((inc) => (
                <tr key={inc.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-3 py-2 font-medium">{inc.name}</td>
                  <td className="px-3 py-2">{formatCurrency(inc.amount, settings.currency)}</td>
                  <td className="px-3 py-2 text-xs text-gray-600">
                    {HEBREW_MONTHS[inc.startMonth]} ({inc.duration} חודשים)
                  </td>
                  <td className="px-3 py-2">
                    {inc.growthPct > 0 ? (
                      <span className="text-green-700">+{formatPercent(inc.growthPct)}</span>
                    ) : (
                      <span className="text-gray-400">קבוע</span>
                    )}
                  </td>
                  <td className="px-3 py-2 text-xs text-gray-600">
                    {inc.paymentTerms === 0 ? 'מיידי' : `${inc.paymentTerms} ימים`}
                  </td>
                  <td className="px-3 py-2 font-medium text-green-700">
                    {formatCurrency(
                      calculateIncomeTotal(inc, settings.monthsToShow),
                      settings.currency,
                    )}
                  </td>
                  <td className="px-3 py-2 text-center">
                    <button
                      onClick={() => deleteIncome(inc.id)}
                      className="p-1 text-red-600 hover:bg-red-50 rounded"
                      title="מחק"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-green-50 font-bold">
              <tr>
                <td colSpan={5} className="px-3 py-2 text-right">
                  סך כל ההכנסות:
                </td>
                <td className="px-3 py-2 text-green-700">
                  {formatCurrency(totalIncome, settings.currency)}
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
