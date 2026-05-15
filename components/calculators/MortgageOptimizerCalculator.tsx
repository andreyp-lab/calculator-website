'use client';

import { useState, useMemo, useCallback } from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import {
  optimizeMortgage,
  calculateMonthlyPayment,
  checkConstraints,
  evaluateAllocation,
  DEFAULT_TRACKS_2026,
  DEFAULT_CONSTRAINTS,
  PRESET_TRACKS_2026,
  TRACK_TYPE_LABELS,
  TRACK_DEFAULT_RATES,
  TRACK_DEFAULT_VOLATILITY,
  TRACK_COLORS,
  TRACK_RISK_LABELS,
  BANK_OF_ISRAEL_PRIME_2026,
  AVG_INFLATION_ISRAEL,
  type OptimizerTrack,
  type OptimizerTrackType,
  type OptimizationObjective,
  type OptimizerConstraints,
  type AllocationResult,
  type OptimizerResult,
} from '@/lib/calculators/mortgage-optimizer';
import { formatCurrency } from '@/lib/utils/formatters';
import { ResultCard } from '@/components/calculator/ResultCard';
import { Breakdown } from '@/components/calculator/Breakdown';

// ============================================================
// קבועים ועזרים
// ============================================================

type TabId = 'setup' | 'tracks' | 'objective' | 'results' | 'scenarios';

let trackIdCounter = 100;
function newTrackId() {
  return `opt-track-${++trackIdCounter}`;
}

const TAB_LABELS: Record<TabId, string> = {
  setup: 'הגדרת בקשה',
  tracks: 'מסלולים',
  objective: 'מטרה ואילוצים',
  results: 'תוצאות',
  scenarios: 'תרחישים',
};

const OBJECTIVE_OPTIONS: { id: OptimizationObjective; label: string; desc: string; emoji: string }[] = [
  {
    id: 'minimize_total_cost',
    label: 'עלות מינימלית',
    desc: 'ממזערת את סה"כ הריבית על פני כל חיי המשכנתא',
    emoji: '🎯',
  },
  {
    id: 'balanced',
    label: 'איזון עלות + סיכון',
    desc: 'שילוב אופטימלי: חיסכון בעלות ללא חשיפה מופרזת',
    emoji: '⚖️',
  },
  {
    id: 'minimize_risk',
    label: 'סיכון מינימלי',
    desc: 'מגן על תשלומים יציבים גם כשריבית ואינפלציה עולות',
    emoji: '🛡️',
  },
  {
    id: 'minimize_monthly_payment',
    label: 'תשלום חודשי מינימלי',
    desc: 'מפחיתה את התשלום החודשי הראשוני עד כמה שניתן',
    emoji: '💰',
  },
];

// ============================================================
// קומפוננטת אינפוט מספרי
// ============================================================

interface NumericInputProps {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  note?: string;
  className?: string;
  error?: string;
}

function NumericInput({ label, value, onChange, min, max, step, unit, note, className, error }: NumericInputProps) {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="relative">
        <input
          type="number"
          value={value}
          min={min}
          max={max}
          step={step}
          onChange={(e) => onChange(Number(e.target.value))}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
            error ? 'border-red-400 bg-red-50' : 'border-gray-300'
          }`}
        />
        {unit && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 pointer-events-none">
            {unit}
          </span>
        )}
      </div>
      {note && !error && <p className="text-xs text-gray-500 mt-1">{note}</p>}
      {error && <p className="text-xs text-red-600 mt-1 font-medium">{error}</p>}
    </div>
  );
}

// ============================================================
// כרטיס תמהיל
// ============================================================

interface AllocationCardProps {
  result: AllocationResult;
  title: string;
  isOptimal?: boolean;
  badge?: string;
  onSelect?: () => void;
}

function AllocationCard({ result, title, isOptimal, badge, onSelect }: AllocationCardProps) {
  const pieData = result.allocation
    .filter((a) => a.amount > 0)
    .map((a) => ({
      name: a.trackName,
      value: Math.round(a.amount),
    }));

  const PIE_COLORS_LIST = ['#2563eb', '#f59e0b', '#f97316', '#8b5cf6', '#10b981'];

  return (
    <div
      className={`bg-white rounded-xl border-2 p-5 transition ${
        isOptimal
          ? 'border-blue-500 shadow-lg'
          : 'border-gray-200 hover:border-blue-300 cursor-pointer'
      }`}
      onClick={onSelect}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h4 className="font-bold text-gray-900">{title}</h4>
            {isOptimal && (
              <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full font-medium">
                מומלץ
              </span>
            )}
            {badge && (
              <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">
                {badge}
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500 mt-0.5">
            ריבית ממוצעת: {result.weightedAvgRate.toFixed(2)}%
          </p>
        </div>
        <div
          className={`px-2.5 py-1 rounded-full text-xs font-bold ${
            result.riskScore < 30
              ? 'bg-green-100 text-green-800'
              : result.riskScore < 60
              ? 'bg-amber-100 text-amber-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          סיכון: {result.riskScore < 30 ? 'נמוך' : result.riskScore < 60 ? 'בינוני' : 'גבוה'}
        </div>
      </div>

      {/* חלוקה */}
      <div className="space-y-1.5 mb-4">
        {result.allocation
          .filter((a) => a.amount > 0)
          .map((a, i) => (
            <div key={a.trackId} className="flex items-center gap-2 text-sm">
              <div
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: PIE_COLORS_LIST[i % PIE_COLORS_LIST.length] }}
              />
              <span className="flex-1 text-gray-700">{a.trackName}</span>
              <span className="text-gray-500 text-xs">{Math.round(a.percent * 100)}%</span>
              <span className="font-medium text-gray-900">{formatCurrency(a.amount)}</span>
            </div>
          ))}
      </div>

      {/* Pie Chart מיני */}
      {pieData.length > 0 && (
        <div className="h-32 mb-3">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={30}
                outerRadius={55}
                dataKey="value"
                label={({ name, percent }) =>
                  `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`
                }
                labelLine={false}
                fontSize={10}
              >
                {pieData.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS_LIST[i % PIE_COLORS_LIST.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => formatCurrency(Number(v))} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* תוצאות עיקריות */}
      <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-100">
        <div className="text-center">
          <p className="text-xs text-gray-500 mb-0.5">תשלום חודשי</p>
          <p className="font-bold text-gray-900">{formatCurrency(result.monthlyPayment)}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-500 mb-0.5">סה"כ ריבית</p>
          <p className="font-bold text-amber-700">{formatCurrency(result.totalCost)}</p>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// טאב 1: הגדרת בקשה
// ============================================================

interface SetupState {
  totalAmount: number;
  defaultTermYears: number;
  preset: 'standard' | 'conservative' | 'aggressive' | 'custom';
}

interface SetupTabProps {
  state: SetupState;
  onChange: (s: SetupState) => void;
  onTracksChanged: (t: OptimizerTrack[]) => void;
  onNext: () => void;
}

function SetupTab({ state, onChange, onTracksChanged, onNext }: SetupTabProps) {
  const quickAmounts = [800_000, 1_000_000, 1_200_000, 1_500_000, 2_000_000];

  function applyPreset(preset: SetupState['preset']) {
    onChange({ ...state, preset });
    if (preset !== 'custom') {
      const rawTracks = PRESET_TRACKS_2026[preset as keyof typeof PRESET_TRACKS_2026];
      const tracks: OptimizerTrack[] = rawTracks.map((t) => ({ ...t, termYears: state.defaultTermYears }));
      onTracksChanged(tracks);
    }
  }

  return (
    <div className="space-y-6">
      {/* כותרת */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
        <h3 className="font-bold text-blue-900 text-lg mb-1">אופטימייזר תמהיל המשכנתא</h3>
        <p className="text-sm text-blue-700">
          כמו Excel Solver — מוצא את החלוקה המתמטית האופטימלית בין מסלולי המשכנתא למזעור העלות,
          הסיכון, או התשלום החודשי.
        </p>
      </div>

      {/* סכום */}
      <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
        <h3 className="font-bold text-gray-900 mb-4">סכום המשכנתא</h3>
        <NumericInput
          label='סה"כ סכום משכנתא (₪)'
          value={state.totalAmount}
          onChange={(v) => onChange({ ...state, totalAmount: v })}
          min={100_000}
          max={10_000_000}
          step={50_000}
        />

        <div className="flex flex-wrap gap-2 mt-3">
          {quickAmounts.map((a) => (
            <button
              key={a}
              type="button"
              onClick={() => onChange({ ...state, totalAmount: a })}
              className={`px-3 py-1.5 text-sm rounded-lg border transition ${
                state.totalAmount === a
                  ? 'border-blue-500 bg-blue-50 text-blue-700 font-medium'
                  : 'border-gray-300 bg-white text-gray-600 hover:border-blue-300'
              }`}
            >
              {formatCurrency(a)}
            </button>
          ))}
        </div>

        <div className="mt-4">
          <NumericInput
            label="תקופה ברירת מחדל (שנים)"
            value={state.defaultTermYears}
            onChange={(v) => onChange({ ...state, defaultTermYears: v })}
            min={5}
            max={30}
            step={1}
            note="ניתן לשנות לכל מסלול בנפרד בטאב המסלולים"
          />
        </div>
      </div>

      {/* בחירת פריסט */}
      <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
        <h3 className="font-bold text-gray-900 mb-4">נקודת התחלה</h3>
        <div className="grid sm:grid-cols-3 gap-3">
          {[
            {
              id: 'standard' as const,
              label: 'תמהיל סטנדרטי',
              desc: 'פריים + קל"צ + צמוד מדד (1/3 כל אחד)',
              risk: 'בינוני',
              riskColor: 'text-amber-600',
            },
            {
              id: 'conservative' as const,
              label: 'שמרני',
              desc: 'קל"צ דומיננטי — ריבית קבועה ויציבה',
              risk: 'נמוך',
              riskColor: 'text-green-600',
            },
            {
              id: 'aggressive' as const,
              label: 'אגרסיבי',
              desc: 'פריים + משתנה — עלות נמוכה כיום, סיכון גבוה',
              risk: 'גבוה',
              riskColor: 'text-red-600',
            },
          ].map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => applyPreset(opt.id)}
              className={`text-right p-4 rounded-xl border-2 transition ${
                state.preset === opt.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 bg-white hover:border-blue-300'
              }`}
            >
              <div className="font-bold text-gray-900 text-sm">{opt.label}</div>
              <div className="text-xs text-gray-500 mt-1">{opt.desc}</div>
              <div className={`text-xs mt-2 font-medium ${opt.riskColor}`}>
                סיכון: {opt.risk}
              </div>
            </button>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={onNext}
        className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition"
      >
        הגדר מסלולים ←
      </button>
    </div>
  );
}

// ============================================================
// טאב 2: מסלולים
// ============================================================

interface TracksTabProps {
  tracks: OptimizerTrack[];
  defaultTermYears: number;
  onChange: (t: OptimizerTrack[]) => void;
  onNext: () => void;
}

function TracksTab({ tracks, defaultTermYears, onChange, onNext }: TracksTabProps) {
  function updateTrack(id: string, field: keyof OptimizerTrack, value: unknown) {
    onChange(
      tracks.map((t) => {
        if (t.id !== id) return t;
        const updated = { ...t, [field]: value };
        // עדכן ברירת מחדל לפי סוג מסלול
        if (field === 'type') {
          const ttype = value as OptimizerTrackType;
          updated.rate = TRACK_DEFAULT_RATES[ttype];
          updated.rateVolatility = TRACK_DEFAULT_VOLATILITY[ttype];
          updated.isLinked = ttype === 'fixed_linked';
          updated.inflationExposure = ttype === 'fixed_linked' ? 1.0 : 0;
        }
        return updated;
      }),
    );
  }

  function addTrack() {
    if (tracks.length >= 5) return;
    onChange([
      ...tracks,
      {
        id: newTrackId(),
        name: 'מסלול חדש',
        type: 'fixed_unlinked',
        rate: 4.2,
        termYears: defaultTermYears,
        isLinked: false,
        rateVolatility: 0,
        inflationExposure: 0,
      },
    ]);
  }

  function removeTrack(id: string) {
    if (tracks.length <= 1) return;
    onChange(tracks.filter((t) => t.id !== id));
  }

  const TRACK_COLORS_LIST = ['#2563eb', '#f59e0b', '#f97316', '#8b5cf6', '#10b981'];

  return (
    <div className="space-y-5">
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
        <p className="text-sm text-amber-800">
          <strong>הוסף/ערוך עד 5 מסלולים.</strong> בנק ישראל מחייב לפחות 33% בריבית קבועה
          (קל"צ או צמוד מדד). האופטימייזר ידאג לכך אוטומטית.
        </p>
      </div>

      {tracks.map((track, i) => {
        const color = TRACK_COLORS_LIST[i % TRACK_COLORS_LIST.length];
        return (
          <div
            key={track.id}
            className="bg-white border-2 rounded-xl p-5 space-y-4"
            style={{ borderColor: color }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                <input
                  type="text"
                  value={track.name}
                  onChange={(e) => updateTrack(track.id, 'name', e.target.value)}
                  className="font-bold text-gray-900 bg-transparent border-b border-dashed border-gray-300 focus:border-blue-500 focus:outline-none text-base"
                />
              </div>
              {tracks.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeTrack(track.id)}
                  className="text-red-500 hover:text-red-700 text-sm font-medium"
                >
                  הסר
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="block text-xs font-medium text-gray-600 mb-1">סוג מסלול</label>
                <select
                  value={track.type}
                  onChange={(e) => updateTrack(track.id, 'type', e.target.value as OptimizerTrackType)}
                  className="w-full px-2 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                >
                  {(Object.keys(TRACK_TYPE_LABELS) as OptimizerTrackType[]).map((t) => (
                    <option key={t} value={t}>
                      {TRACK_TYPE_LABELS[t]}
                    </option>
                  ))}
                </select>
              </div>

              <NumericInput
                label="ריבית שנתית (%)"
                value={track.rate}
                onChange={(v) => updateTrack(track.id, 'rate', v)}
                min={0}
                max={20}
                step={0.1}
                note={
                  track.type === 'prime'
                    ? `פריים כיום: ${BANK_OF_ISRAEL_PRIME_2026}%`
                    : track.type === 'fixed_linked'
                    ? `אינפלציה ממוצעת: ${AVG_INFLATION_ISRAEL}% (בנוסף)`
                    : undefined
                }
              />

              <NumericInput
                label="תקופה (שנים)"
                value={track.termYears}
                onChange={(v) => updateTrack(track.id, 'termYears', v)}
                min={1}
                max={30}
                step={1}
              />
            </div>

            <div className="flex items-center justify-between text-xs text-gray-500 pt-1 border-t border-gray-100">
              <span>
                סיכון: <strong>{TRACK_RISK_LABELS[track.type]}</strong>
              </span>
              <span>
                תשלום ל-1M: {formatCurrency(calculateMonthlyPayment(1_000_000, track.rate, track.termYears))}/חודש
              </span>
            </div>
          </div>
        );
      })}

      {tracks.length < 5 && (
        <button
          type="button"
          onClick={addTrack}
          className="w-full py-3 border-2 border-dashed border-blue-300 rounded-xl text-blue-600 hover:border-blue-500 hover:bg-blue-50 transition font-medium"
        >
          + הוסף מסלול (עד 5)
        </button>
      )}

      <button
        type="button"
        onClick={onNext}
        className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition"
      >
        הגדר מטרה ואילוצים ←
      </button>
    </div>
  );
}

// ============================================================
// טאב 3: מטרה ואילוצים
// ============================================================

interface ObjectiveTabProps {
  objective: OptimizationObjective;
  constraints: OptimizerConstraints;
  riskAversion: number;
  onObjectiveChange: (o: OptimizationObjective) => void;
  onConstraintsChange: (c: OptimizerConstraints) => void;
  onRiskAversionChange: (v: number) => void;
  onRun: () => void;
  isRunning: boolean;
}

function ObjectiveTab({
  objective,
  constraints,
  riskAversion,
  onObjectiveChange,
  onConstraintsChange,
  onRiskAversionChange,
  onRun,
  isRunning,
}: ObjectiveTabProps) {
  function updC<K extends keyof OptimizerConstraints>(field: K, value: OptimizerConstraints[K]) {
    onConstraintsChange({ ...constraints, [field]: value });
  }

  return (
    <div className="space-y-6">
      {/* בחירת מטרה */}
      <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
        <h3 className="font-bold text-gray-900 mb-4">מה רוצים לאופטם?</h3>
        <div className="space-y-3">
          {OBJECTIVE_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => onObjectiveChange(opt.id)}
              className={`w-full text-right p-4 rounded-xl border-2 transition flex items-start gap-3 ${
                objective === opt.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 bg-white hover:border-blue-300'
              }`}
            >
              <span className="text-2xl mt-0.5 flex-shrink-0">{opt.emoji}</span>
              <div>
                <div className={`font-bold text-sm ${objective === opt.id ? 'text-blue-800' : 'text-gray-900'}`}>
                  {opt.label}
                </div>
                <div className="text-xs text-gray-500 mt-0.5">{opt.desc}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* סליידר סיכון-עלות (עבור balanced) */}
      {objective === 'balanced' && (
        <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
          <h3 className="font-bold text-gray-900 mb-3">רמת שמרנות</h3>
          <div className="space-y-3">
            <input
              type="range"
              min={0}
              max={1}
              step={0.1}
              value={riskAversion}
              onChange={(e) => onRiskAversionChange(Number(e.target.value))}
              className="w-full accent-blue-600"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>מקסימלי — עלות נמוכה</span>
              <span className="font-medium text-blue-700">
                {riskAversion < 0.3
                  ? 'אגרסיבי'
                  : riskAversion < 0.6
                  ? 'מאוזן'
                  : 'שמרני'}
              </span>
              <span>מקסימלי — ביטחון</span>
            </div>
          </div>
        </div>
      )}

      {/* אילוצים */}
      <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
        <h3 className="font-bold text-gray-900 mb-4">אילוצים</h3>

        <div className="space-y-4">
          {/* אילוץ בנק ישראל - קבוע */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="text-sm font-medium text-gray-800">מינימום 33% ריבית קבועה</p>
              <p className="text-xs text-gray-500">הוראת בנק ישראל — לא ניתן לשנות</p>
            </div>
            <span className="bg-gray-300 text-gray-700 text-xs px-3 py-1 rounded-full font-medium">
              33% מינימום
            </span>
          </div>

          {/* מקסימום % למסלול בודד */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              מקסימום % למסלול בודד
            </label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={0.3}
                max={1.0}
                step={0.05}
                value={constraints.maxPerTrackPercent ?? 0.8}
                onChange={(e) => updC('maxPerTrackPercent', Number(e.target.value))}
                className="flex-1 accent-blue-600"
              />
              <span className="text-sm font-medium text-gray-900 w-12 text-left">
                {Math.round((constraints.maxPerTrackPercent ?? 0.8) * 100)}%
              </span>
            </div>
          </div>

          {/* מקסימום % צמוד מדד */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              מקסימום % צמוד מדד
            </label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={0}
                max={1.0}
                step={0.05}
                value={constraints.maxIndexedPercent ?? 0.6}
                onChange={(e) => updC('maxIndexedPercent', Number(e.target.value))}
                className="flex-1 accent-blue-600"
              />
              <span className="text-sm font-medium text-gray-900 w-12 text-left">
                {Math.round((constraints.maxIndexedPercent ?? 0.6) * 100)}%
              </span>
            </div>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={onRun}
        disabled={isRunning}
        className={`w-full py-4 rounded-xl font-bold text-lg transition ${
          isRunning
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl'
        }`}
      >
        {isRunning ? 'מחשב תמהיל אופטימלי...' : 'הפעל אופטימייזר ←'}
      </button>
    </div>
  );
}

// ============================================================
// טאב 4: תוצאות
// ============================================================

interface ResultsTabProps {
  result: OptimizerResult;
  totalAmount: number;
  onSelectAlternative?: (idx: number) => void;
}

function ResultsTab({ result, totalAmount }: ResultsTabProps) {
  const { optimal, alternatives, bankProposal, defaultMixResult, savingsVsDefault, savingsVsBank } = result;

  const comparisonData = [
    {
      name: 'אופטימלי',
      'ריבית כוללת': Math.round(optimal.totalCost),
      'תשלום חודשי': Math.round(optimal.monthlyPayment),
      fill: '#2563eb',
    },
    ...(defaultMixResult
      ? [
          {
            name: '1/3+1/3+1/3',
            'ריבית כוללת': Math.round(defaultMixResult.totalCost),
            'תשלום חודשי': Math.round(defaultMixResult.monthlyPayment),
            fill: '#9ca3af',
          },
        ]
      : []),
    ...(bankProposal
      ? [
          {
            name: 'הצעת הבנק',
            'ריבית כוללת': Math.round(bankProposal.totalCost),
            'תשלום חודשי': Math.round(bankProposal.monthlyPayment),
            fill: '#f59e0b',
          },
        ]
      : []),
  ];

  // גרף הרכב אופטימלי
  const pieData = optimal.allocation
    .filter((a) => a.amount > 0)
    .map((a) => ({ name: a.trackName, value: Math.round(a.amount) }));

  const PIE_COLORS_LIST = ['#2563eb', '#f59e0b', '#f97316', '#8b5cf6', '#10b981'];

  return (
    <div className="space-y-6">
      {/* Hero - תמהיל אופטימלי */}
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-300 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl">🏆</span>
          <h3 className="text-xl font-bold text-blue-900">התמהיל האופטימלי</h3>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Pie Chart */}
          <div>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={90}
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`
                    }
                    labelLine={true}
                    fontSize={11}
                  >
                    {pieData.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS_LIST[i % PIE_COLORS_LIST.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => formatCurrency(Number(v))} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-2 mt-2">
              {optimal.allocation
                .filter((a) => a.amount > 0)
                .map((a, i) => (
                  <div key={a.trackId} className="flex items-center gap-2 text-sm">
                    <div
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: PIE_COLORS_LIST[i % PIE_COLORS_LIST.length] }}
                    />
                    <span className="flex-1 font-medium text-gray-800">{a.trackName}</span>
                    <span className="text-gray-500">{Math.round(a.percent * 100)}%</span>
                    <span className="font-bold text-gray-900">{formatCurrency(a.amount)}</span>
                  </div>
                ))}
            </div>
          </div>

          {/* מדדים עיקריים */}
          <div className="space-y-3">
            <div className="bg-white rounded-xl p-4 border border-blue-200">
              <p className="text-xs text-gray-500 mb-1">תשלום חודשי ראשוני</p>
              <p className="text-3xl font-bold text-blue-700">{formatCurrency(optimal.monthlyPayment)}</p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-amber-200">
              <p className="text-xs text-gray-500 mb-1">סה"כ ריבית לכל חיי המשכנתא</p>
              <p className="text-2xl font-bold text-amber-700">{formatCurrency(optimal.totalCost)}</p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-200">
              <p className="text-xs text-gray-500 mb-1">ריבית ממוצעת משוקללת</p>
              <p className="text-2xl font-bold text-gray-800">{optimal.weightedAvgRate.toFixed(2)}%</p>
            </div>

            <div className="flex gap-2">
              <div
                className={`flex-1 text-center p-3 rounded-lg ${
                  optimal.riskScore < 30
                    ? 'bg-green-50 border border-green-200'
                    : optimal.riskScore < 60
                    ? 'bg-amber-50 border border-amber-200'
                    : 'bg-red-50 border border-red-200'
                }`}
              >
                <p className="text-xs text-gray-500 mb-0.5">ציון סיכון</p>
                <p
                  className={`text-xl font-bold ${
                    optimal.riskScore < 30
                      ? 'text-green-700'
                      : optimal.riskScore < 60
                      ? 'text-amber-700'
                      : 'text-red-700'
                  }`}
                >
                  {optimal.riskScore}/100
                </p>
              </div>
              <div
                className={`flex-1 text-center p-3 rounded-lg ${
                  optimal.isRegulationCompliant
                    ? 'bg-green-50 border border-green-200'
                    : 'bg-red-50 border border-red-200'
                }`}
              >
                <p className="text-xs text-gray-500 mb-0.5">תקנות בנק ישראל</p>
                <p
                  className={`text-lg font-bold ${
                    optimal.isRegulationCompliant ? 'text-green-700' : 'text-red-700'
                  }`}
                >
                  {optimal.isRegulationCompliant ? '✓ עומד' : '✗ לא עומד'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* חיסכון לעומת תמהיל אחיד */}
      {(savingsVsDefault !== undefined || savingsVsBank !== undefined) && (
        <div className="grid sm:grid-cols-2 gap-4">
          {savingsVsDefault !== undefined && savingsVsDefault > 0 && (
            <div className="bg-green-50 border-2 border-green-200 rounded-xl p-5">
              <p className="text-sm font-medium text-green-700 mb-1">חיסכון לעומת תמהיל שווה</p>
              <p className="text-3xl font-bold text-green-800">{formatCurrency(savingsVsDefault)}</p>
              <p className="text-xs text-green-600 mt-1">
                פחות ריבית לעומת 1/3+1/3+1/3 על {formatCurrency(totalAmount)}
              </p>
            </div>
          )}
          {savingsVsBank !== undefined && savingsVsBank > 0 && (
            <div className="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-5">
              <p className="text-sm font-medium text-emerald-700 mb-1">חיסכון לעומת הצעת הבנק</p>
              <p className="text-3xl font-bold text-emerald-800">{formatCurrency(savingsVsBank)}</p>
              <p className="text-xs text-emerald-600 mt-1">ריבית פחות לאורך כל חיי המשכנתא</p>
            </div>
          )}
        </div>
      )}

      {/* גרף השוואה */}
      {comparisonData.length > 1 && (
        <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">השוואה לתמהילים אחרים</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tickFormatter={(v) => `${Math.round(v / 1000)}K`} tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v) => formatCurrency(Number(v))} />
                <Legend />
                <Bar dataKey="ריבית כוללת" fill="#ef4444" radius={[4, 4, 0, 0]} />
                <Bar dataKey="תשלום חודשי" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* המלצה */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
        <h4 className="font-bold text-blue-900 mb-2">המלצת המערכת</h4>
        <p className="text-sm text-blue-800 leading-relaxed">{result.recommendation}</p>
      </div>

      {/* חלופות */}
      {alternatives.length > 0 && (
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-4">תמהילים חלופיים</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {alternatives.map((alt, i) => (
              <AllocationCard
                key={i}
                result={alt}
                title={`חלופה ${i + 1}`}
                badge={
                  alt.riskScore < optimal.riskScore
                    ? 'פחות סיכון'
                    : alt.totalCost < optimal.totalCost
                    ? 'עלות נמוכה יותר'
                    : undefined
                }
              />
            ))}
          </div>
        </div>
      )}

      {/* פירוט מלא */}
      <Breakdown
        title="פירוט מלא של התמהיל האופטימלי"
        defaultOpen
        items={[
          { label: 'סה"כ קרן', value: formatCurrency(totalAmount) },
          ...optimal.allocation
            .filter((a) => a.amount > 0)
            .map((a) => ({
              label: `${a.trackName} (${Math.round(a.percent * 100)}%)`,
              value: `${formatCurrency(a.amount)} | ${formatCurrency(a.monthlyPayment)}/חודש`,
            })),
          { label: 'תשלום חודשי כולל', value: formatCurrency(optimal.monthlyPayment) },
          { label: 'סה"כ ריבית', value: formatCurrency(optimal.totalCost) },
          { label: 'סה"כ תשלומים', value: formatCurrency(optimal.totalPayments), bold: true },
          { label: 'ריבית ממוצעת', value: `${optimal.weightedAvgRate.toFixed(2)}%` },
          { label: 'ציון סיכון', value: `${optimal.riskScore}/100` },
          { label: '% קבוע', value: `${Math.round(optimal.fixedPercent * 100)}%` },
          { label: 'עמידה בתקנות', value: optimal.isRegulationCompliant ? 'כן ✓' : 'לא ✗' },
          {
            label: 'זמן אופטימיזציה',
            value: `${result.optimizationStats.timeMs}ms (${result.optimizationStats.iterationsChecked.toLocaleString()} בדיקות)`,
          },
        ]}
      />
    </div>
  );
}

// ============================================================
// טאב 5: תרחישים
// ============================================================

interface ScenariosTabProps {
  result: OptimizerResult;
  tracks: OptimizerTrack[];
  totalAmount: number;
}

function ScenariosTab({ result, tracks, totalAmount }: ScenariosTabProps) {
  const { optimal } = result;

  // נבנה לוח תשלומים לאורך 25 שנים עבור 3 תרחישים
  const buildPaymentOverTime = (primeShock: number, inflation: number) => {
    const data: { year: number; payment: number }[] = [];
    for (let year = 1; year <= 25; year++) {
      let yearPayment = 0;
      for (let i = 0; i < tracks.length; i++) {
        const track = tracks[i];
        const alloc = optimal.allocation[i];
        if (!alloc || alloc.amount <= 0) continue;

        let rate = track.rate;
        if (track.type === 'prime' || track.type === 'variable_unlinked') rate += primeShock;
        else if (track.type === 'variable_5y') {
          // מתעדכן כל 5 שנים
          if (year > 5) rate += primeShock;
        }
        if (track.isLinked && track.inflationExposure) {
          rate += inflation * track.inflationExposure * Math.min(year / 5, 1);
        }
        rate = Math.max(0.5, rate);
        yearPayment += calculateMonthlyPayment(alloc.amount, rate, track.termYears);
      }
      data.push({ year, payment: Math.round(yearPayment) });
    }
    return data;
  };

  const scenarioLines = [
    { label: 'בסיס (ריבית כיום)', primeShock: 0, inflation: AVG_INFLATION_ISRAEL, color: '#2563eb' },
    { label: 'ריבית עולה +2%', primeShock: 2, inflation: AVG_INFLATION_ISRAEL, color: '#ef4444' },
    { label: 'ריבית יורדת -2%', primeShock: -2, inflation: AVG_INFLATION_ISRAEL, color: '#10b981' },
    { label: 'אינפלציה 4%', primeShock: 0, inflation: 4.0, color: '#f59e0b' },
  ];

  const chartData = Array.from({ length: 25 }, (_, idx) => {
    const year = idx + 1;
    const row: Record<string, number | string> = { שנה: `${year}` };
    for (const sc of scenarioLines) {
      const payments = buildPaymentOverTime(sc.primeShock, sc.inflation);
      row[sc.label] = payments[idx]?.payment ?? 0;
    }
    return row;
  });

  // טבלת תרחישי סיכון
  const baseScenario = optimal.scenarios.find((s) => s.name.includes('אינפלציה 2.5%') && s.deltaFromBase === 0);
  const baseCost = baseScenario?.totalCost ?? optimal.totalCost;

  return (
    <div className="space-y-6">
      {/* גרף תשלומים לאורך זמן */}
      <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-2">התפתחות תשלום חודשי לאורך זמן</h3>
        <p className="text-sm text-gray-500 mb-4">
          השוואת תשלומים בתרחישי ריבית ואינפלציה שונים
        </p>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="שנה" tick={{ fontSize: 11 }} label={{ value: 'שנה', position: 'insideBottom', offset: -5 }} />
              <YAxis tickFormatter={(v) => `${Math.round(v / 1000)}K`} tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v) => formatCurrency(Number(v))} />
              <Legend />
              {scenarioLines.map((sc) => (
                <Line
                  key={sc.label}
                  type="monotone"
                  dataKey={sc.label}
                  stroke={sc.color}
                  strokeWidth={2}
                  dot={false}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* טבלת תרחישים */}
      <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">ניתוח תרחישי סיכון</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-right py-2 pr-2 font-medium text-gray-600">תרחיש</th>
                <th className="text-left py-2 pl-2 font-medium text-gray-600">תשלום חודשי</th>
                <th className="text-left py-2 pl-2 font-medium text-gray-600">שינוי מבסיס</th>
                <th className="text-left py-2 pl-2 font-medium text-gray-600">עלות כוללת</th>
              </tr>
            </thead>
            <tbody>
              {optimal.scenarios.map((sc, i) => (
                <tr key={i} className={`border-b border-gray-100 ${i % 2 === 0 ? 'bg-gray-50' : ''}`}>
                  <td className="py-2 pr-2 text-gray-700">{sc.name}</td>
                  <td className="py-2 pl-2 text-right text-gray-900 font-medium">
                    {formatCurrency(sc.monthlyPaymentYear1)}
                  </td>
                  <td className={`py-2 pl-2 text-right font-medium ${
                    sc.deltaFromBase > 500
                      ? 'text-red-600'
                      : sc.deltaFromBase < -500
                      ? 'text-green-600'
                      : 'text-gray-500'
                  }`}>
                    {sc.deltaFromBase > 0 ? '+' : ''}
                    {formatCurrency(sc.deltaFromBase)}
                  </td>
                  <td className="py-2 pl-2 text-right text-amber-700">
                    {formatCurrency(sc.totalCost)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pareto Frontier */}
      {result.paretoFrontier && result.paretoFrontier.length > 1 && (
        <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-2">קיצת פארטו: עלות vs. סיכון</h3>
          <p className="text-sm text-gray-500 mb-4">
            כל נקודה היא תמהיל שלא ניתן לשפר בשני הממדים בו-זמנית
          </p>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={result.paretoFrontier.map((r) => ({
                  'ריבית כוללת (K)': Math.round(r.totalCost / 1000),
                  'ציון סיכון': r.riskScore,
                }))}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="ריבית כוללת (K)" tick={{ fontSize: 11 }} />
                <YAxis dataKey="ציון סיכון" tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v, name) => [name === 'ציון סיכון' ? `${v}/100` : formatCurrency(Number(v) * 1000), name]} />
                <Line
                  type="monotone"
                  dataKey="ציון סיכון"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  dot={{ r: 5, fill: '#8b5cf6' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* סיכום ציון סיכון */}
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
          <p className="text-sm text-blue-700 mb-1">ציון סיכון</p>
          <p className="text-3xl font-bold text-blue-900">{optimal.riskScore}/100</p>
          <p className="text-xs text-blue-600 mt-1">
            {optimal.riskScore < 30
              ? 'נמוך — תמהיל מוגן'
              : optimal.riskScore < 60
              ? 'בינוני — חשיפה מינונית'
              : 'גבוה — שמור רזרבה!'}
          </p>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center">
          <p className="text-sm text-amber-700 mb-1">% קבוע (בנק ישראל)</p>
          <p className="text-3xl font-bold text-amber-900">
            {Math.round(optimal.fixedPercent * 100)}%
          </p>
          <p className="text-xs text-amber-600 mt-1">נדרש לפחות 33%</p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
          <p className="text-sm text-green-700 mb-1">ריבית ממוצעת</p>
          <p className="text-3xl font-bold text-green-900">{optimal.weightedAvgRate.toFixed(2)}%</p>
          <p className="text-xs text-green-600 mt-1">משוקללת לפי סכום</p>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// קומפוננטה ראשית
// ============================================================

export function MortgageOptimizerCalculator() {
  const [activeTab, setActiveTab] = useState<TabId>('setup');
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<OptimizerResult | null>(null);

  // מצב הגדרות
  const [setupState, setSetupState] = useState({
    totalAmount: 1_500_000,
    defaultTermYears: 25,
    preset: 'standard' as 'standard' | 'conservative' | 'aggressive' | 'custom',
  });

  const [tracks, setTracks] = useState<OptimizerTrack[]>(
    DEFAULT_TRACKS_2026.map((t) => ({ ...t, termYears: 25 })),
  );

  const [objective, setObjective] = useState<OptimizationObjective>('balanced');
  const [constraints, setConstraints] = useState<OptimizerConstraints>({ ...DEFAULT_CONSTRAINTS });
  const [riskAversion, setRiskAversion] = useState(0.5);

  const tabs: { id: TabId; label: string; description: string }[] = [
    { id: 'setup', label: TAB_LABELS.setup, description: 'סכום ופריסטים' },
    { id: 'tracks', label: TAB_LABELS.tracks, description: 'ריביות ותנאים' },
    { id: 'objective', label: TAB_LABELS.objective, description: 'מה לאופטם?' },
    { id: 'results', label: TAB_LABELS.results, description: 'תמהיל אופטימלי' },
    { id: 'scenarios', label: TAB_LABELS.scenarios, description: 'ניתוח סיכון' },
  ];

  const runOptimizer = useCallback(() => {
    setIsRunning(true);

    // setTimeout כדי לאפשר ל-React לרנדר את ה-loading state
    setTimeout(() => {
      try {
        const optimizerResult = optimizeMortgage({
          totalAmount: setupState.totalAmount,
          tracks,
          objective,
          constraints,
          riskAversion,
        });
        setResult(optimizerResult);
        setActiveTab('results');
      } catch (e) {
        console.error('Optimizer error:', e);
      } finally {
        setIsRunning(false);
      }
    }, 50);
  }, [setupState.totalAmount, tracks, objective, constraints, riskAversion]);

  return (
    <div className="space-y-6" dir="rtl">
      {/* Tab Navigation */}
      <div className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden">
        <div className="flex overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex-shrink-0 px-4 py-4 text-right border-b-2 transition-all ${
                activeTab === tab.id
                  ? 'border-blue-600 bg-blue-50 text-blue-900'
                  : 'border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-800'
              }`}
            >
              <div className="font-medium text-sm whitespace-nowrap">{tab.label}</div>
              <div className="text-xs text-gray-500 mt-0.5 whitespace-nowrap">{tab.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {activeTab === 'setup' && (
        <SetupTab
          state={setupState}
          onChange={setSetupState}
          onTracksChanged={setTracks}
          onNext={() => setActiveTab('tracks')}
        />
      )}

      {activeTab === 'tracks' && (
        <TracksTab
          tracks={tracks}
          defaultTermYears={setupState.defaultTermYears}
          onChange={setTracks}
          onNext={() => setActiveTab('objective')}
        />
      )}

      {activeTab === 'objective' && (
        <ObjectiveTab
          objective={objective}
          constraints={constraints}
          riskAversion={riskAversion}
          onObjectiveChange={setObjective}
          onConstraintsChange={setConstraints}
          onRiskAversionChange={setRiskAversion}
          onRun={runOptimizer}
          isRunning={isRunning}
        />
      )}

      {activeTab === 'results' && (
        <>
          {result ? (
            <ResultsTab result={result} totalAmount={setupState.totalAmount} />
          ) : (
            <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-12 text-center">
              <p className="text-gray-500 text-lg mb-4">טרם הרצת אופטימיזציה</p>
              <button
                type="button"
                onClick={() => setActiveTab('objective')}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition"
              >
                עבור להגדרת מטרה ←
              </button>
            </div>
          )}
        </>
      )}

      {activeTab === 'scenarios' && (
        <>
          {result ? (
            <ScenariosTab
              result={result}
              tracks={tracks}
              totalAmount={setupState.totalAmount}
            />
          ) : (
            <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-12 text-center">
              <p className="text-gray-500 text-lg mb-4">הרץ אופטימיזציה תחילה לצפייה בתרחישים</p>
              <button
                type="button"
                onClick={() => setActiveTab('objective')}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition"
              >
                עבור להגדרת מטרה ←
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
