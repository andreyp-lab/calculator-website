'use client';

import { useState, useMemo, useEffect } from 'react';
import { useTools } from '@/lib/tools/ToolsContext';
import { calculateAllMonths } from '@/lib/tools/budget-engine';
import { calculateCashFlow } from '@/lib/tools/cashflow-engine';
import {
  calculateGoalProgress,
  GOAL_TYPE_LABELS,
} from '@/lib/tools/goals-engine';
import type { Goal, GoalProgress } from '@/lib/tools/types';
import { Target, Plus, Trash2, CheckCircle2, AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react';

const STORAGE_KEY = 'goals-v1';

function genId() {
  return Math.random().toString(36).slice(2, 9);
}

export function GoalsTracker() {
  const { budget, settings, cashFlow } = useTools();
  const [goals, setGoals] = useState<Goal[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch {}
    return [];
  });

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Omit<Goal, 'id' | 'createdAt'>>({
    name: '',
    type: 'revenue',
    targetValue: 1000000,
    targetDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    notes: '',
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(goals));
  }, [goals]);

  const progress = useMemo(() => {
    if (!budget || !settings || !cashFlow) return [];
    const monthly = calculateAllMonths(budget, settings);
    const cf = calculateCashFlow(budget, cashFlow, settings);
    return goals.map((g) => calculateGoalProgress(g, monthly, cf));
  }, [goals, budget, settings, cashFlow]);

  function addGoal() {
    if (!form.name.trim() || form.targetValue <= 0) return;
    setGoals([
      ...goals,
      {
        ...form,
        id: genId(),
        createdAt: new Date().toISOString(),
      },
    ]);
    setForm({
      name: '',
      type: 'revenue',
      targetValue: 1000000,
      targetDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      notes: '',
    });
    setShowForm(false);
  }

  function removeGoal(id: string) {
    setGoals(goals.filter((g) => g.id !== id));
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white rounded-lg border-2 border-gray-200 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-violet-600 to-purple-600 text-white p-4 flex items-center justify-between">
          <div>
            <h3 className="font-bold flex items-center gap-2">
              <Target className="w-5 h-5" />
              מעקב יעדים ({goals.length})
            </h3>
            <p className="text-xs text-violet-100">הגדר יעדים פיננסיים ועקוב אחרי ההתקדמות</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-3 py-1.5 bg-white text-violet-700 rounded text-sm font-medium hover:bg-violet-50 flex items-center gap-1"
          >
            <Plus className="w-4 h-4" />
            יעד חדש
          </button>
        </div>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-lg border-2 border-violet-200 p-4 shadow-sm">
          <h4 className="font-semibold mb-3">יעד חדש</h4>
          <div className="grid md:grid-cols-2 gap-3 text-sm">
            <div>
              <label className="block text-xs text-gray-700 mb-1">שם היעד</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="לדוגמה: 1M ARR עד סוף 2026"
                className="w-full px-3 py-2 border border-gray-300 rounded"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-700 mb-1">סוג</label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value as Goal['type'] })}
                className="w-full px-3 py-2 border border-gray-300 rounded"
              >
                {(Object.keys(GOAL_TYPE_LABELS) as Goal['type'][]).map((t) => (
                  <option key={t} value={t}>{GOAL_TYPE_LABELS[t]}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-700 mb-1">ערך יעד</label>
              <input
                type="number"
                value={form.targetValue}
                onChange={(e) => setForm({ ...form, targetValue: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-700 mb-1">תאריך יעד</label>
              <input
                type="date"
                value={form.targetDate}
                onChange={(e) => setForm({ ...form, targetDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs text-gray-700 mb-1">הערות (אופציונלי)</label>
              <input
                type="text"
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded"
              />
            </div>
          </div>
          <div className="flex gap-2 mt-3">
            <button
              onClick={addGoal}
              disabled={!form.name.trim() || form.targetValue <= 0}
              className="px-4 py-2 bg-violet-600 text-white rounded hover:bg-violet-700 disabled:opacity-50"
            >
              שמור יעד
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
            >
              ביטול
            </button>
          </div>
        </div>
      )}

      {/* Goals list */}
      {progress.length === 0 ? (
        <div className="bg-amber-50 border-2 border-amber-200 rounded-lg p-6 text-center">
          <Target className="w-12 h-12 mx-auto mb-2 text-amber-500" />
          <p className="text-amber-900">אין יעדים עדיין. הוסף יעד פיננסי כדי לעקוב.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-3">
          {progress.map((p) => (
            <GoalCard key={p.goal.id} progress={p} onRemove={() => removeGoal(p.goal.id)} />
          ))}
        </div>
      )}
    </div>
  );
}

function GoalCard({ progress, onRemove }: { progress: GoalProgress; onRemove: () => void }) {
  const { goal, currentValue, pctComplete, status, gap } = progress;

  const statusConfig = {
    achieved: { label: 'הושג! 🎉', color: 'emerald', icon: CheckCircle2 },
    ahead: { label: 'מעל הצפוי', color: 'emerald', icon: TrendingUp },
    on_track: { label: 'בקצב', color: 'blue', icon: CheckCircle2 },
    at_risk: { label: 'בסיכון', color: 'amber', icon: AlertTriangle },
    behind: { label: 'מאחור', color: 'red', icon: TrendingDown },
  };
  const cfg = statusConfig[status];
  const StatusIcon = cfg.icon;

  const colorMap: Record<string, { bg: string; border: string; text: string; bar: string }> = {
    emerald: { bg: 'bg-emerald-50', border: 'border-emerald-300', text: 'text-emerald-700', bar: 'bg-emerald-500' },
    blue: { bg: 'bg-blue-50', border: 'border-blue-300', text: 'text-blue-700', bar: 'bg-blue-500' },
    amber: { bg: 'bg-amber-50', border: 'border-amber-300', text: 'text-amber-700', bar: 'bg-amber-500' },
    red: { bg: 'bg-red-50', border: 'border-red-300', text: 'text-red-700', bar: 'bg-red-500' },
  };
  const c = colorMap[cfg.color];

  const fmt = (v: number) =>
    Math.abs(v) > 1000000
      ? `${(v / 1000000).toFixed(2)}M`
      : Math.abs(v) > 1000
        ? `${(v / 1000).toFixed(0)}K`
        : v.toFixed(0);

  return (
    <div className={`${c.bg} border-2 ${c.border} rounded-lg p-4 shadow-sm`}>
      <div className="flex items-start justify-between mb-2">
        <div>
          <h4 className="font-bold text-gray-900">{goal.name}</h4>
          <div className="text-xs text-gray-600">{GOAL_TYPE_LABELS[goal.type]}</div>
        </div>
        <button
          onClick={onRemove}
          className="p-1 text-red-600 hover:bg-red-100 rounded"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="flex items-baseline gap-2 mb-2">
        <span className="text-2xl font-bold">{fmt(currentValue)}</span>
        <span className="text-sm text-gray-500">/ {fmt(goal.targetValue)}</span>
      </div>

      {/* Progress bar */}
      <div className="bg-gray-200 rounded-full h-3 mb-2 overflow-hidden">
        <div
          className={`${c.bar} h-full rounded-full transition-all`}
          style={{ width: `${Math.min(100, pctComplete)}%` }}
        />
      </div>

      <div className="flex items-center justify-between text-xs">
        <span className={`font-bold ${c.text} flex items-center gap-1`}>
          <StatusIcon className="w-3.5 h-3.5" />
          {cfg.label}
        </span>
        <span className="text-gray-600">
          {pctComplete.toFixed(1)}% • יעד: {goal.targetDate}
        </span>
      </div>

      {gap > 0 && status !== 'achieved' && (
        <div className="mt-2 text-xs text-gray-700">
          🎯 חסר: {fmt(gap)}
        </div>
      )}

      {goal.notes && (
        <div className="mt-2 text-xs text-gray-600 italic">"{goal.notes}"</div>
      )}
    </div>
  );
}
