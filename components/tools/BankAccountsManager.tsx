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
    <div className="bg-paper rounded-none border-2 border-ink/15 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Building2 className="w-5 h-5 text-ink-mid" />
          <h3 className="font-bold text-base text-ink">חשבונות בנק</h3>
          <span className="text-xs text-ink/60">({cashFlow.accounts.length})</span>
        </div>
        <button
          onClick={() => (showForm && !editingId ? reset() : (reset(), setShowForm(true)))}
          className="flex items-center gap-1 px-2.5 py-1 bg-ink text-cream rounded-none hover:bg-ink-deep text-xs"
        >
          <Plus className="w-3 h-3" />
          הוסף חשבון
        </button>
      </div>

      {cashFlow.accounts.length > 0 && (
        <div className="bg-cream-2 border border-ink/15 rounded-none p-2 mb-3">
          <div className="flex justify-between text-sm">
            <span className="text-ink/70">סה"כ יתרות בנק:</span>
            <span className="font-bold text-ink">{fmt(totalBalance)}</span>
          </div>
        </div>
      )}

      {showForm && (
        <div className="bg-cream-2 border border-ink/15 rounded-none p-3 mb-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <div>
              <label className="block text-xs text-ink/70 mb-1">שם / בנק</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="לאומי 12345"
                className="w-full px-2 py-1.5 border border-ink/15 rounded-none text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-ink/70 mb-1">יתרה (₪)</label>
              <input
                type="number"
                value={form.balance || ''}
                onChange={(e) => setForm({ ...form, balance: Number(e.target.value) })}
                className="w-full px-2 py-1.5 border border-ink/15 rounded-none text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-ink/70 mb-1">לתאריך</label>
              <input
                type="date"
                value={form.asOfDate}
                onChange={(e) => setForm({ ...form, asOfDate: e.target.value })}
                className="w-full px-2 py-1.5 border border-ink/15 rounded-none text-sm"
              />
            </div>
          </div>
          <div className="flex gap-2 mt-2">
            <button
              onClick={handleSubmit}
              className="px-3 py-1 bg-ink text-cream rounded-none text-xs"
            >
              {editingId ? 'עדכן' : 'הוסף'}
            </button>
            <button onClick={reset} className="px-3 py-1 bg-cream-2 rounded-none text-xs">
              ביטול
            </button>
          </div>
        </div>
      )}

      {cashFlow.accounts.length === 0 ? (
        <div className="text-center py-4 text-ink/45 text-xs">
          אין חשבונות בנק. הוסף חשבון לבחישוב מדויק של יתרת הפתיחה.
        </div>
      ) : (
        <div className="space-y-1.5">
          {cashFlow.accounts.map((account) => (
            <div
              key={account.id}
              className="flex items-center gap-2 p-2 bg-cream-2 border border-ink/15 rounded-none text-sm"
            >
              <div className="flex-1">
                <div className="font-semibold text-ink">{account.name}</div>
                <div className="text-xs text-ink/60">{account.asOfDate}</div>
              </div>
              <div
                className={`font-bold ${account.balance >= 0 ? 'text-emerald-700' : 'text-red-700'}`}
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
                className="p-1 text-ink-mid hover:bg-cream-2 rounded-none"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => deleteBankAccount(account.id)}
                className="p-1 text-red-600 hover:bg-red-50 rounded-none"
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
