'use client';

import { useState } from 'react';
import { useTools } from '@/lib/tools/ToolsContext';
import { formatCurrency } from '@/lib/tools/format';
import { HEBREW_MONTHS } from '@/lib/tools/types';
import { Plus, Trash2, Users, Edit2 } from 'lucide-react';
import type { Department } from '@/lib/tools/types';

const DEPARTMENT_LABELS: Record<Department, string> = {
  sales: 'מכירות',
  marketing: 'שיווק',
  development: 'פיתוח (R&D)',
  operations: 'תפעול (COGS)',
  administration: 'אדמיניסטרציה',
};

const DEPARTMENT_COLORS: Record<Department, string> = {
  sales: 'bg-blue-100 text-blue-800',
  marketing: 'bg-amber-100 text-amber-800',
  development: 'bg-emerald-100 text-emerald-800',
  operations: 'bg-violet-100 text-violet-800',
  administration: 'bg-red-100 text-red-800',
};

const DEPT_TO_CATEGORY: Record<Department, string> = {
  sales: 'תפעול',
  marketing: 'שיווק',
  development: 'מחקר ופיתוח',
  operations: 'עלות המכר (COGS)',
  administration: 'תפעול',
};

const initialForm = {
  name: '',
  department: 'sales' as Department,
  monthlySalary: 0,
  startMonth: 0,
  endMonth: null as number | null,
  position: '',
};

export function EmployeeManager() {
  const { budget, settings, addEmployee, updateEmployee, deleteEmployee } = useTools();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(initialForm);

  if (!budget || !settings) return null;

  function reset() {
    setForm(initialForm);
    setEditingId(null);
    setShowForm(false);
  }

  function handleSubmit() {
    if (!form.name.trim() || form.monthlySalary <= 0) return;

    if (editingId) {
      updateEmployee(editingId, form);
    } else {
      addEmployee(form);
    }
    reset();
  }

  // קיבוץ לפי מחלקה
  const byDept = (Object.keys(DEPARTMENT_LABELS) as Department[])
    .map((dept) => ({
      dept,
      employees: budget.employees.filter((e) => e.department === dept),
      total: budget.employees
        .filter((e) => e.department === dept)
        .reduce((sum, e) => sum + e.monthlySalary, 0),
    }))
    .filter((g) => g.employees.length > 0);

  const totalMonthly = budget.employees.reduce((sum, e) => sum + e.monthlySalary, 0);
  const fmt = (v: number) => formatCurrency(v, settings.currency);

  return (
    <div className="bg-white rounded-lg border-2 border-gray-200 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-purple-600" />
          <h3 className="font-bold text-lg text-gray-900">עובדים</h3>
          <span className="text-sm text-gray-500">({budget.employees.length} עובדים)</span>
        </div>
        <button
          onClick={() => (showForm && !editingId ? reset() : (reset(), setShowForm(true)))}
          className="flex items-center gap-1 px-3 py-1.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm"
        >
          <Plus className="w-4 h-4" />
          הוסף עובד
        </button>
      </div>

      {budget.employees.length > 0 && (
        <div className="bg-purple-50 border border-purple-200 rounded p-2 mb-4 text-sm flex justify-between">
          <span className="text-purple-700">סה"כ שכר חודשי:</span>
          <span className="font-bold text-purple-900">{fmt(totalMonthly)}</span>
        </div>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded p-2 mb-3 text-xs text-blue-900">
        💡 שכר העובדים מתווסף אוטומטית ל-P&L לפי המחלקה: <strong>מכירות/מנהל → תפעול</strong>,{' '}
        <strong>שיווק → שיווק</strong>, <strong>פיתוח → R&D</strong>,{' '}
        <strong>תפעול → COGS</strong>
      </div>

      {showForm && (
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs text-gray-700 mb-1">שם עובד *</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="ישראל ישראלי"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-700 mb-1">תפקיד</label>
              <input
                type="text"
                value={form.position}
                onChange={(e) => setForm({ ...form, position: e.target.value })}
                placeholder="מנהל מכירות"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-700 mb-1">מחלקה *</label>
              <select
                value={form.department}
                onChange={(e) => setForm({ ...form, department: e.target.value as Department })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                {(Object.keys(DEPARTMENT_LABELS) as Department[]).map((d) => (
                  <option key={d} value={d}>
                    {DEPARTMENT_LABELS[d]}
                  </option>
                ))}
              </select>
              <p className="text-[10px] text-gray-500 mt-0.5">
                → הוצאה ל-{DEPT_TO_CATEGORY[form.department]}
              </p>
            </div>
            <div>
              <label className="block text-xs text-gray-700 mb-1">שכר ברוטו חודשי (₪) *</label>
              <input
                type="number"
                value={form.monthlySalary || ''}
                onChange={(e) =>
                  setForm({ ...form, monthlySalary: parseFloat(e.target.value) || 0 })
                }
                placeholder="15,000"
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
              <label className="block text-xs text-gray-700 mb-1">חודש סיום</label>
              <select
                value={form.endMonth ?? ''}
                onChange={(e) =>
                  setForm({
                    ...form,
                    endMonth: e.target.value === '' ? null : parseInt(e.target.value),
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="">ממשיך</option>
                {HEBREW_MONTHS.map((m, i) => (
                  <option key={i} value={i}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex gap-2 mt-3">
            <button
              onClick={handleSubmit}
              disabled={!form.name.trim() || form.monthlySalary <= 0}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
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

      {budget.employees.length === 0 ? (
        <div className="text-center py-6 text-gray-500 text-sm">
          <Users className="w-12 h-12 mx-auto mb-2 opacity-30" />
          <p>אין עובדים. הוסף עובד כדי לראות את עלות השכר ב-P&L.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {byDept.map((g) => (
            <div key={g.dept}>
              <div className="flex items-center justify-between text-sm mb-1.5">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs px-2 py-0.5 rounded ${DEPARTMENT_COLORS[g.dept]}`}
                  >
                    {DEPARTMENT_LABELS[g.dept]}
                  </span>
                  <span className="text-gray-500 text-xs">({g.employees.length} עובדים)</span>
                </div>
                <span className="font-semibold text-gray-700">{fmt(g.total)}/חודש</span>
              </div>
              <div className="space-y-1">
                {g.employees.map((emp) => (
                  <div
                    key={emp.id}
                    className="flex items-center gap-2 p-2 bg-gray-50 border border-gray-200 rounded text-sm"
                  >
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{emp.name}</div>
                      <div className="text-xs text-gray-500">
                        {emp.position && <span>{emp.position} • </span>}
                        {HEBREW_MONTHS[emp.startMonth]}–
                        {emp.endMonth !== null ? HEBREW_MONTHS[emp.endMonth] : 'ממשיך'}
                      </div>
                    </div>
                    <div className="font-bold text-purple-700">
                      {fmt(emp.monthlySalary)}
                    </div>
                    <button
                      onClick={() => {
                        setForm({
                          name: emp.name,
                          department: emp.department,
                          monthlySalary: emp.monthlySalary,
                          startMonth: emp.startMonth,
                          endMonth: emp.endMonth,
                          position: emp.position ?? '',
                        });
                        setEditingId(emp.id);
                        setShowForm(true);
                      }}
                      className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => deleteEmployee(emp.id)}
                      className="p-1 text-red-600 hover:bg-red-50 rounded"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
