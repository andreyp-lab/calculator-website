'use client';

import { useState } from 'react';
import { useTools } from '@/lib/tools/ToolsContext';
import { formatCurrency } from '@/lib/tools/format';
import { Plus, Trash2, Building2, Edit2 } from 'lucide-react';

const initialForm = {
  name: '',
  balance: 0,
  asOfDate: new Date().toISOString().slice(0, 10),
};

export function BankAccountsManager() {
  const { cashFlow, settings, addBankAccount, updateBankAccount, deleteBankAccount } = useTools();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(initialForm);

  if (!cashFlow || !settings) return null;

  function reset() {
    setForm(initialForm);
    setEditingId(null);
    setShowForm(false);
  }

  function handleSubmit() {
    if (!form.name.trim()) return;
    if (editingId) {
      updateBankAccount(editingId, form);
    } else {
      addBankAccount(form);
    }
    reset();
  }

  const totalBalance = cashFlow.accounts.reduce((sum, a) => sum + a.balance, 0);
  const fmt = (v: number) => formatCurrency(v, settings.currency);

  return (
    <div className="bg-white rounded-lg border-2 border-gray-200 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Building2 className="w-5 h-5 text-blue-600" />
          <h3 className="font-bold text-base text-gray-900">חשבונות בנק</h3>
          <span className="text-xs text-gray-500">({cashFlow.accounts.length})</span>
        </div>
        <button
          onClick={() => (showForm && !editingId ? reset() : (reset(), setShowForm(true)))}
          className="flex items-center gap-1 px-2.5 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-xs"
        >
          <Plus className="w-3 h-3" />
          הוסף חשבון
        </button>
      </div>

      {cashFlow.accounts.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded p-2 mb-3">
          <div className="flex justify-between text-sm">
            <span className="text-blue-700">סה"כ יתרות בנק:</span>
            <span className="font-bold text-blue-900">{fmt(totalBalance)}</span>
          </div>
        </div>
      )}

      {showForm && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <div>
              <label className="block text-xs text-gray-700 mb-1">שם / בנק</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="לאומי 12345"
                className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-700 mb-1">יתרה (₪)</label>
              <input
                type="number"
                value={form.balance || ''}
                onChange={(e) => setForm({ ...form, balance: Number(e.target.value) })}
                className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-700 mb-1">לתאריך</label>
              <input
                type="date"
                value={form.asOfDate}
                onChange={(e) => setForm({ ...form, asOfDate: e.target.value })}
                className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
              />
            </div>
          </div>
          <div className="flex gap-2 mt-2">
            <button
              onClick={handleSubmit}
              className="px-3 py-1 bg-blue-600 text-white rounded text-xs"
            >
              {editingId ? 'עדכן' : 'הוסף'}
            </button>
            <button onClick={reset} className="px-3 py-1 bg-gray-200 rounded text-xs">
              ביטול
            </button>
          </div>
        </div>
      )}

      {cashFlow.accounts.length === 0 ? (
        <div className="text-center py-4 text-gray-400 text-xs">
          אין חשבונות בנק. הוסף חשבון לבחישוב מדויק של יתרת הפתיחה.
        </div>
      ) : (
        <div className="space-y-1.5">
          {cashFlow.accounts.map((account) => (
            <div
              key={account.id}
              className="flex items-center gap-2 p-2 bg-gray-50 border border-gray-200 rounded text-sm"
            >
              <div className="flex-1">
                <div className="font-semibold text-gray-900">{account.name}</div>
                <div className="text-xs text-gray-500">{account.asOfDate}</div>
              </div>
              <div
                className={`font-bold ${account.balance >= 0 ? 'text-blue-700' : 'text-red-700'}`}
              >
                {fmt(account.balance)}
              </div>
              <button
                onClick={() => {
                  setForm({
                    name: account.name,
                    balance: account.balance,
                    asOfDate: account.asOfDate,
                  });
                  setEditingId(account.id);
                  setShowForm(true);
                }}
                className="p-1 text-blue-600 hover:bg-blue-50 rounded"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => deleteBankAccount(account.id)}
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
