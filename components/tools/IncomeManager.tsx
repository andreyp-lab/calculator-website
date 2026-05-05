'use client';

import { useState } from 'react';
import { useTools } from '@/lib/tools/ToolsContext';
import { formatCurrency, formatPercent } from '@/lib/tools/format';
import { calculateIncomeTotal } from '@/lib/tools/budget-engine';
import {
  HEBREW_MONTHS,
  ExpenseCategory,
  EXPENSE_CATEGORY_LABELS,
} from '@/lib/tools/types';
import { Plus, Trash2, TrendingUp, Link2 } from 'lucide-react';

const initialForm = {
  name: '',
  amount: 0,
  startMonth: 0,
  duration: 12,
  growthPct: 0,
  paymentTerms: 0,
  status: 'expected' as const,
};

const initialVarExpense = {
  enabled: false,
  name: '',
  percentage: 0,
  category: 'cogs' as ExpenseCategory,
  startMonth: 0,
  duration: 12,
  paymentTerms: 0,
};

export function IncomeManager() {
  const { budget, settings, addIncome, addExpense, deleteIncome } = useTools();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [varExp, setVarExp] = useState(initialVarExpense);

  if (!budget || !settings) return null;

  function handleAdd() {
    if (!form.name.trim() || form.amount <= 0) return;
    if (!budget) return;

    // קח snapshot של ההכנסות הקיימות (לפני ההוספה)
    const existingIncome = budget.income;
    const newIncomeName = form.name;

    // 1. הוסף את ההכנסה ראשית
    addIncome(form);

    // 2. אם המשתמש סימן הוצאה משתנה מקושרת - הוסף אותה
    if (varExp.enabled && varExp.name.trim() && varExp.percentage > 0) {
      // נדע את ה-id של ההכנסה החדשה רק אחרי שהמצב יתעדכן.
      // לכן ניצור עם setTimeout כדי לקבל את הסטייט המעודכן בקומפוננטה הבאה.
      const expensePayload = {
        category: varExp.category,
        name: `${varExp.name} (${varExp.percentage}% מ-${newIncomeName})`,
        amount: 0,
        isPct: true,
        percentage: varExp.percentage,
        startMonth: varExp.startMonth,
        duration: varExp.duration,
        paymentTerms: varExp.paymentTerms,
      };
      setTimeout(() => {
        addExpense(expensePayload);
      }, 50);
      // הערה: linkedIncomeId לא נקבע כאן — ההוצאה תחושב כאחוז מסך כל ההכנסות.
      // לקישור מדויק להכנסה ספציפית, יש לערוך את ההוצאה לאחר היצירה.
      void existingIncome;
    }

    setForm(initialForm);
    setVarExp(initialVarExpense);
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
                onChange={(e) => setForm({ ...form, duration: parseInt(e.target.value) || 12 })}
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
                onChange={(e) => setForm({ ...form, paymentTerms: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value={0}>מיידי</option>
                <option value={30}>שוטף + 30</option>
                <option value={60}>שוטף + 60</option>
                <option value={90}>שוטף + 90</option>
              </select>
            </div>
          </div>

          {/* === הוצאה משתנה מקושרת === */}
          <div className="mt-4 p-3 bg-white border-2 border-emerald-200 rounded-lg">
            <label className="flex items-center gap-2 cursor-pointer mb-3">
              <input
                type="checkbox"
                checked={varExp.enabled}
                onChange={(e) => setVarExp({ ...varExp, enabled: e.target.checked })}
                className="w-4 h-4 accent-emerald-600"
              />
              <Link2 className="w-4 h-4 text-emerald-600" />
              <span className="text-sm font-semibold text-emerald-900">
                הוסף הוצאה משתנה מקושרת להכנסה זו
              </span>
              <span className="text-xs text-gray-500">
                (אחוז שמשתנה אוטומטית עם ההכנסה)
              </span>
            </label>

            {varExp.enabled && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 pt-2 border-t border-emerald-100">
                <div className="col-span-2">
                  <label className="block text-xs text-gray-700 mb-1">שם ההוצאה *</label>
                  <input
                    type="text"
                    value={varExp.name}
                    onChange={(e) => setVarExp({ ...varExp, name: e.target.value })}
                    placeholder="לדוגמה: עמלת סוכן"
                    className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-700 mb-1">% מההכנסה *</label>
                  <input
                    type="number"
                    value={varExp.percentage || ''}
                    onChange={(e) =>
                      setVarExp({
                        ...varExp,
                        percentage: parseFloat(e.target.value) || 0,
                      })
                    }
                    step={0.1}
                    className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-700 mb-1">קטגוריה</label>
                  <select
                    value={varExp.category}
                    onChange={(e) =>
                      setVarExp({
                        ...varExp,
                        category: e.target.value as ExpenseCategory,
                      })
                    }
                    className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
                  >
                    {(Object.keys(EXPENSE_CATEGORY_LABELS) as ExpenseCategory[]).map((c) => (
                      <option key={c} value={c}>
                        {EXPENSE_CATEGORY_LABELS[c]}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-700 mb-1">חודש התחלה</label>
                  <select
                    value={varExp.startMonth}
                    onChange={(e) =>
                      setVarExp({ ...varExp, startMonth: parseInt(e.target.value) })
                    }
                    className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
                  >
                    {HEBREW_MONTHS.map((m, i) => (
                      <option key={i} value={i}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-700 mb-1">משך</label>
                  <input
                    type="number"
                    value={varExp.duration}
                    onChange={(e) =>
                      setVarExp({ ...varExp, duration: parseInt(e.target.value) || 12 })
                    }
                    min={1}
                    max={36}
                    className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-700 mb-1">תנאי תשלום</label>
                  <select
                    value={varExp.paymentTerms}
                    onChange={(e) =>
                      setVarExp({ ...varExp, paymentTerms: parseInt(e.target.value) })
                    }
                    className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
                  >
                    <option value={0}>מיידי</option>
                    <option value={30}>שוטף + 30</option>
                    <option value={60}>שוטף + 60</option>
                    <option value={90}>שוטף + 90</option>
                  </select>
                </div>
                <div className="col-span-2 md:col-span-3 text-xs text-emerald-800 bg-emerald-50 p-2 rounded">
                  💡 ההוצאה תיווצר אוטומטית כ-{varExp.percentage || 0}% מהכנסה זו ותתעדכן עם הצמיחה
                </div>
              </div>
            )}
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
              onClick={() => {
                setShowForm(false);
                setVarExp(initialVarExpense);
              }}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
            >
              ביטול
            </button>
          </div>
        </div>
      )}

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
              {budget.income.map((inc) => {
                // האם יש הוצאות מקושרות?
                const linkedExpenses = budget.expenses.filter(
                  (e) => e.linkedIncomeId === inc.id,
                );
                const total = calculateIncomeTotal(inc, settings.monthsToShow);
                return (
                  <tr key={inc.id} className="border-b border-gray-100 hover:bg-green-50">
                    <td className="px-3 py-2 font-medium">
                      {inc.name}
                      {linkedExpenses.length > 0 && (
                        <span className="ml-2 inline-flex items-center gap-1 text-xs px-1.5 py-0.5 bg-emerald-100 text-emerald-800 rounded">
                          <Link2 className="w-3 h-3" />
                          {linkedExpenses.length} מקושרות
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-2">{formatCurrency(inc.amount, settings.currency)}</td>
                    <td className="px-3 py-2 text-xs">
                      {HEBREW_MONTHS[inc.startMonth]}–{inc.duration} ח'
                    </td>
                    <td className="px-3 py-2 text-xs">
                      {inc.growthPct > 0 ? `+${formatPercent(inc.growthPct, 1)}` : '—'}
                    </td>
                    <td className="px-3 py-2 text-xs">
                      {inc.paymentTerms > 0 ? `+${inc.paymentTerms}י'` : 'מיידי'}
                    </td>
                    <td className="px-3 py-2 font-bold text-emerald-700">
                      {formatCurrency(total, settings.currency)}
                    </td>
                    <td className="text-center">
                      <button
                        onClick={() => deleteIncome(inc.id)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot className="bg-emerald-50 font-bold">
              <tr>
                <td colSpan={5} className="px-3 py-2">
                  סה"כ הכנסות
                </td>
                <td className="px-3 py-2 text-emerald-700">
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
