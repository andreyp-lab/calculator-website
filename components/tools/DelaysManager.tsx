'use client';

import { useState } from 'react';
import { useTools } from '@/lib/tools/ToolsContext';
import { Plus, Trash2, Clock, Edit2, AlertTriangle } from 'lucide-react';
import type { CashFlowDelay } from '@/lib/tools/types';

export function DelaysManager() {
  const { cashFlow, budget, addDelay, updateDelay, deleteDelay } = useTools();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<{
    type: 'collection_delay' | 'payment_delay';
    itemId: string;
    delayDays: number;
    reason?: string;
    amountImpact?: number;
    splitPayment?: boolean;
    splitCount?: number;
  }>({
    type: 'collection_delay',
    itemId: '',
    delayDays: 30,
    reason: '',
    splitPayment: false,
    splitCount: 1,
  });

  if (!cashFlow || !budget) return null;

  function reset() {
    setForm({
      type: 'collection_delay',
      itemId: '',
      delayDays: 30,
      reason: '',
      splitPayment: false,
      splitCount: 1,
    });
    setEditingId(null);
    setShowForm(false);
  }

  function handleSubmit() {
    if (!form.itemId) return;
    if (editingId) {
      updateDelay(editingId, form);
    } else {
      addDelay(form);
    }
    reset();
  }

  const availableItems = form.type === 'collection_delay' ? budget.income : budget.expenses;

  function getItemName(delay: CashFlowDelay): string {
    if (!budget) return '(לא נמצא)';
    const list = delay.type === 'collection_delay' ? budget.income : budget.expenses;
    return list.find((i) => i.id === delay.itemId)?.name ?? '(לא נמצא)';
  }

  return (
    <div className="bg-white rounded-lg border-2 border-gray-200 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-amber-600" />
          <h3 className="font-bold text-base text-gray-900">עיכובים ודחיות</h3>
          <span className="text-xs text-gray-500">({cashFlow.delays.length})</span>
        </div>
        <button
          onClick={() => (showForm && !editingId ? reset() : (reset(), setShowForm(true)))}
          className="flex items-center gap-1 px-2.5 py-1 bg-amber-600 text-white rounded-lg hover:bg-amber-700 text-xs"
        >
          <Plus className="w-3 h-3" />
          הוסף עיכוב
        </button>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded p-2 mb-3 text-xs text-amber-900 flex gap-2">
        <AlertTriangle className="w-4 h-4 flex-shrink-0" />
        <span>
          <strong>עיכוב גביה</strong> - לקוחות שמשלמים מאוחר. <strong>דחיית תשלום</strong> -
          ספקים שאתה דוחה. ניתן גם לפצל תשלום ל-N תשלומים.
        </span>
      </div>

      {showForm && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-3 space-y-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div>
              <label className="block text-xs text-gray-700 mb-1">סוג עיכוב</label>
              <select
                value={form.type}
                onChange={(e) =>
                  setForm({
                    ...form,
                    type: e.target.value as 'collection_delay' | 'payment_delay',
                    itemId: '',
                  })
                }
                className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
              >
                <option value="collection_delay">עיכוב גביה (לקוח)</option>
                <option value="payment_delay">דחיית תשלום (ספק)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-700 mb-1">פריט מהתקציב</label>
              <select
                value={form.itemId}
                onChange={(e) => setForm({ ...form, itemId: e.target.value })}
                className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
              >
                <option value="">בחר פריט...</option>
                {availableItems.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-700 mb-1">ימי עיכוב</label>
              <input
                type="number"
                value={form.delayDays}
                onChange={(e) => setForm({ ...form, delayDays: Number(e.target.value) })}
                className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-700 mb-1">
                {form.type === 'collection_delay' ? 'אובדן בגביה (%)' : 'הנחה / תוספת (%)'}
              </label>
              <input
                type="number"
                step={1}
                value={form.amountImpact ?? 0}
                onChange={(e) => setForm({ ...form, amountImpact: Number(e.target.value) })}
                placeholder="0"
                className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
              />
            </div>
            <div className="md:col-span-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.splitPayment ?? false}
                  onChange={(e) => setForm({ ...form, splitPayment: e.target.checked })}
                  className="w-4 h-4"
                />
                <span className="text-sm">פיצול תשלום (פריסת חוב)</span>
              </label>
              {form.splitPayment && (
                <div className="mt-2">
                  <label className="block text-xs text-gray-700 mb-1">מספר תשלומים</label>
                  <input
                    type="number"
                    min={2}
                    max={36}
                    value={form.splitCount ?? 2}
                    onChange={(e) => setForm({ ...form, splitCount: Number(e.target.value) })}
                    className="w-32 px-2 py-1.5 border border-gray-300 rounded text-sm"
                  />
                </div>
              )}
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs text-gray-700 mb-1">סיבה (אופציונלי)</label>
              <input
                type="text"
                value={form.reason ?? ''}
                onChange={(e) => setForm({ ...form, reason: e.target.value })}
                placeholder="לקוח שמשלם בעיכוב..."
                className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleSubmit}
              disabled={!form.itemId}
              className="px-3 py-1 bg-amber-600 text-white rounded text-xs disabled:bg-gray-400"
            >
              {editingId ? 'עדכן' : 'הוסף'}
            </button>
            <button onClick={reset} className="px-3 py-1 bg-gray-200 rounded text-xs">
              ביטול
            </button>
          </div>
        </div>
      )}

      {cashFlow.delays.length === 0 ? (
        <div className="text-center py-4 text-gray-400 text-xs">
          אין עיכובים מוגדרים. הוסף עיכוב גביה (לקוחות) או דחיית תשלום (ספקים) כדי לדמות
          תרחישים אמיתיים.
        </div>
      ) : (
        <div className="space-y-1.5">
          {cashFlow.delays.map((delay) => (
            <div
              key={delay.id}
              className="flex items-center gap-2 p-2 bg-gray-50 border border-gray-200 rounded text-sm"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full ${
                      delay.type === 'collection_delay'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}
                  >
                    {delay.type === 'collection_delay' ? 'גביה' : 'תשלום'}
                  </span>
                  <span className="font-semibold text-gray-900 text-sm">{getItemName(delay)}</span>
                </div>
                <div className="text-xs text-gray-600 mt-0.5">
                  {delay.delayDays} ימי עיכוב
                  {delay.amountImpact ? ` • ${delay.amountImpact > 0 ? '+' : ''}${delay.amountImpact}%` : ''}
                  {delay.splitPayment ? ` • פיצול ל-${delay.splitCount} תשלומים` : ''}
                  {delay.reason ? ` • ${delay.reason}` : ''}
                </div>
              </div>
              <button
                onClick={() => {
                  setForm({
                    type: delay.type,
                    itemId: delay.itemId,
                    delayDays: delay.delayDays,
                    reason: delay.reason ?? '',
                    amountImpact: delay.amountImpact ?? 0,
                    splitPayment: delay.splitPayment ?? false,
                    splitCount: delay.splitCount ?? 1,
                  });
                  setEditingId(delay.id);
                  setShowForm(true);
                }}
                className="p-1 text-blue-600 hover:bg-blue-50 rounded"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => deleteDelay(delay.id)}
                className="p-1 text-red-600 hover:bg-red-50 rounded"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
