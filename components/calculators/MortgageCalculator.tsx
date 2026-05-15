'use client';

import { useState, useMemo, useCallback } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  ReferenceLine,
} from 'recharts';
import {
  calculateMortgage,
  calculateMultiTrackMortgage,
  calculateRefinancing,
  calculateEarlyPayoff,
  calculateAffordability,
  calculateWithInflation,
  getMaxLoanAmount,
  PRESET_COMPOSITIONS,
  BANK_OF_ISRAEL_PRIME_2026,
  AVG_INFLATION_ISRAEL,
  LTV_LIMITS_2026,
  type MortgageInput,
  type AmortizationMethod,
  type BuyerType,
  type TrackType,
  type MortgageTrack,
  type MultiTrackMortgageInput,
  type RefinanceInput,
  type EarlyPayoffInput,
  type AffordabilityInput,
} from '@/lib/calculators/mortgage';
import { formatCurrency, formatPercent } from '@/lib/utils/formatters';
import { ResultCard } from '@/components/calculator/ResultCard';
import { Breakdown } from '@/components/calculator/Breakdown';

// ============================================================
// קבועים ועזרים
// ============================================================

type TabMode = 'single' | 'multi' | 'refinance' | 'early-payoff' | 'affordability';
type ChartView = 'balance' | 'yearly' | 'composition';

const TRACK_TYPE_LABELS: Record<TrackType, string> = {
  prime: 'פריים (Prime)',
  'fixed-unlinked': 'קבועה לא צמודה (קל"צ)',
  'fixed-linked': 'קבועה צמודה (צמ"ק)',
  'variable-5y': 'משתנה כל 5 שנים',
  forex: 'מטבע חוץ',
};

const TRACK_TYPE_COLORS: Record<TrackType, string> = {
  prime: '#2563eb',
  'fixed-unlinked': '#10b981',
  'fixed-linked': '#f59e0b',
  'variable-5y': '#8b5cf6',
  forex: '#ef4444',
};

const PIE_COLORS = ['#2563eb', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444'];

let trackIdCounter = 0;
function newTrackId() {
  return `track-${++trackIdCounter}`;
}

function defaultTrack(partial: Partial<MortgageTrack> = {}): MortgageTrack {
  return {
    id: newTrackId(),
    name: 'מסלול חדש',
    trackType: 'prime',
    amount: 500_000,
    interestRate: BANK_OF_ISRAEL_PRIME_2026 - 0.5,
    termYears: 25,
    method: 'shpitzer',
    gracePeriodMonths: 0,
    ...partial,
  };
}

// ============================================================
// אינפוט מספרי
// ============================================================

interface NumericInputProps {
  id?: string;
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

function NumericInput({ id, label, value, onChange, min, max, step, unit, note, className, error }: NumericInputProps) {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="relative">
        <input
          id={id}
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
// בחירת שיטה (שפיצר / קרן שווה)
// ============================================================

function MethodToggle({ value, onChange }: { value: AmortizationMethod; onChange: (v: AmortizationMethod) => void }) {
  return (
    <div className="flex gap-2">
      {(['shpitzer', 'equal-principal'] as AmortizationMethod[]).map((m) => (
        <button
          key={m}
          type="button"
          onClick={() => onChange(m)}
          className={`flex-1 py-2 px-3 rounded-lg border-2 text-sm transition ${
            value === m
              ? 'border-blue-600 bg-blue-50 text-blue-900 font-medium'
              : 'border-gray-300 bg-white text-gray-600 hover:border-gray-400'
          }`}
        >
          {m === 'shpitzer' ? 'שפיצר' : 'קרן שווה'}
        </button>
      ))}
    </div>
  );
}

// ============================================================
// כרטיס מסלול בודד (Multi-Track)
// ============================================================

interface TrackCardProps {
  track: MortgageTrack;
  index: number;
  totalTracks: number;
  onUpdate: (id: string, field: keyof MortgageTrack, value: unknown) => void;
  onRemove: (id: string) => void;
}

function TrackCard({ track, index, totalTracks, onUpdate, onRemove }: TrackCardProps) {
  const color = PIE_COLORS[index % PIE_COLORS.length];

  return (
    <div
      className="border-2 rounded-xl p-4 space-y-4 bg-white"
      style={{ borderColor: color }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
          <input
            type="text"
            value={track.name}
            onChange={(e) => onUpdate(track.id, 'name', e.target.value)}
            className="font-bold text-gray-900 bg-transparent border-b border-dashed border-gray-300 focus:border-blue-500 focus:outline-none text-base"
          />
        </div>
        {totalTracks > 1 && (
          <button
            type="button"
            onClick={() => onRemove(track.id)}
            className="text-red-500 hover:text-red-700 text-sm font-medium"
          >
            הסר
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        {/* סוג מסלול */}
        <div className="col-span-2">
          <label className="block text-xs font-medium text-gray-600 mb-1">סוג מסלול</label>
          <select
            value={track.trackType}
            onChange={(e) => {
              const t = e.target.value as TrackType;
              onUpdate(track.id, 'trackType', t);
              // עדכון ריבית ברירת מחדל לפי סוג
              const defaultRates: Record<TrackType, number> = {
                prime: BANK_OF_ISRAEL_PRIME_2026 - 0.5,
                'fixed-unlinked': 4.2,
                'fixed-linked': 3.0,
                'variable-5y': 3.8,
                forex: 5.0,
              };
              onUpdate(track.id, 'interestRate', defaultRates[t]);
            }}
            className="w-full px-2 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
          >
            {Object.entries(TRACK_TYPE_LABELS).map(([v, l]) => (
              <option key={v} value={v}>{l}</option>
            ))}
          </select>
        </div>

        {/* סכום */}
        <NumericInput
          label="סכום (₪)"
          value={track.amount}
          onChange={(v) => onUpdate(track.id, 'amount', v)}
          min={0}
          step={50_000}
        />

        {/* ריבית */}
        <NumericInput
          label="ריבית שנתית (%)"
          value={track.interestRate}
          onChange={(v) => onUpdate(track.id, 'interestRate', v)}
          min={0}
          max={20}
          step={0.1}
          note={track.trackType === 'prime' ? `פריים כיום: ${BANK_OF_ISRAEL_PRIME_2026}%` : undefined}
        />

        {/* תקופה */}
        <NumericInput
          label="תקופה (שנים)"
          value={track.termYears}
          onChange={(v) => onUpdate(track.id, 'termYears', v)}
          min={1}
          max={30}
          step={1}
        />

        {/* גרייס */}
        <NumericInput
          label="גרייס (חודשים)"
          value={track.gracePeriodMonths ?? 0}
          onChange={(v) => onUpdate(track.id, 'gracePeriodMonths', v)}
          min={0}
          max={36}
          step={1}
          note="תשלום ריבית בלבד"
        />
      </div>

      {/* שיטת חישוב */}
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">שיטת חישוב</label>
        <MethodToggle
          value={track.method}
          onChange={(v) => onUpdate(track.id, 'method', v)}
        />
      </div>

      {/* הצמדה למדד */}
      {(track.trackType === 'fixed-linked') && (
        <NumericInput
          label="אינפלציה שנתית מוערכת (%)"
          value={track.inflationRate ?? AVG_INFLATION_ISRAEL}
          onChange={(v) => onUpdate(track.id, 'inflationRate', v)}
          min={0}
          max={10}
          step={0.5}
          note={`ממוצע ישראל: ${AVG_INFLATION_ISRAEL}%`}
        />
      )}
    </div>
  );
}

// ============================================================
// טאב משכנתא יחידה
// ============================================================

interface SingleTrackState {
  propertyValue: number;
  buyerType: BuyerType;
  loanAmount: number;
  interestRate: number;
  termYears: number;
  method: AmortizationMethod;
}

function SingleTrackTab() {
  const [state, setState] = useState<SingleTrackState>({
    propertyValue: 2_000_000,
    buyerType: 'first-home',
    loanAmount: 1_500_000,
    interestRate: 4.5,
    termYears: 25,
    method: 'shpitzer',
  });

  const [chartView, setChartView] = useState<ChartView>('yearly');

  function update<K extends keyof SingleTrackState>(field: K, value: SingleTrackState[K]) {
    setState((prev) => ({ ...prev, [field]: value }));
  }

  const maxLoan = getMaxLoanAmount(state.propertyValue, state.buyerType);
  const ltvPercentage = state.propertyValue > 0 ? (state.loanAmount / state.propertyValue) * 100 : 0;
  const isLtvExceeded = state.loanAmount > maxLoan;

  const result = useMemo(
    () =>
      calculateMortgage({
        loanAmount: state.loanAmount,
        interestRate: state.interestRate,
        termYears: state.termYears,
        method: state.method,
      }),
    [state.loanAmount, state.interestRate, state.termYears, state.method],
  );

  const yearlyData = result.yearlyTotals.map((y) => ({
    שנה: `שנה ${y.year}`,
    קרן: Math.round(y.principal),
    ריבית: Math.round(y.interest),
    יתרה: Math.round(y.balance),
  }));

  return (
    <div className="space-y-6">
      <div className="grid lg:grid-cols-5 gap-6">
        {/* Form */}
        <div className="lg:col-span-3 bg-white border-2 border-gray-200 rounded-xl p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">פרטי המשכנתא</h2>
          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <NumericInput
                label='שווי הדירה (ש"ח)'
                value={state.propertyValue}
                onChange={(v) => update('propertyValue', v)}
                min={0}
                step={50_000}
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">סוג הרוכש</label>
                <select
                  value={state.buyerType}
                  onChange={(e) => update('buyerType', e.target.value as BuyerType)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  <option value="first-home">דירה ראשונה (LTV 75%)</option>
                  <option value="home-replacement">מחליף דירה (LTV 70%)</option>
                  <option value="investor">משקיע (LTV 50%)</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">מקסימום: {formatCurrency(maxLoan)}</p>
              </div>
            </div>

            <NumericInput
              label='סכום ההלוואה (ש"ח)'
              value={state.loanAmount}
              onChange={(v) => update('loanAmount', v)}
              min={0}
              step={50_000}
              error={isLtvExceeded ? `חורג ממגבלת LTV! מקסימום: ${formatCurrency(maxLoan)}` : undefined}
              note={`LTV: ${ltvPercentage.toFixed(1)}%`}
            />

            <div className="grid sm:grid-cols-2 gap-4">
              <NumericInput
                label="ריבית שנתית (%)"
                value={state.interestRate}
                onChange={(v) => update('interestRate', v)}
                min={0}
                max={20}
                step={0.1}
                note={`פריים כיום: ${BANK_OF_ISRAEL_PRIME_2026}%`}
              />
              <NumericInput
                label="תקופה (שנים)"
                value={state.termYears}
                onChange={(v) => update('termYears', v)}
                min={1}
                max={30}
                step={1}
                note="מקסימום: 30 שנים"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">שיטת חישוב</label>
              <MethodToggle value={state.method} onChange={(v) => update('method', v)} />
              <p className="text-xs text-gray-500 mt-1">
                {state.method === 'shpitzer'
                  ? 'שפיצר: תשלום חודשי קבוע. נוח לתכנון, אבל משלמים יותר ריבית בהתחלה.'
                  : 'קרן שווה: קרן קבועה + ריבית יורדת. תשלום ראשון גבוה, אבל חוסך ריבית כוללת.'}
              </p>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-2 space-y-4">
          <ResultCard
            title={state.method === 'shpitzer' ? 'תשלום חודשי (קבוע)' : 'תשלום ראשון'}
            value={formatCurrency(result.firstPayment)}
            subtitle={
              state.method === 'equal-principal'
                ? `יורד ל-${formatCurrency(result.lastPayment)} בסוף`
                : `${state.termYears} שנים × 12 חודשים`
            }
            variant="primary"
          />

          <ResultCard
            title="סך הריבית"
            value={formatCurrency(result.totalInterest)}
            subtitle={`${((result.totalInterest / (result.loanAmount || 1)) * 100).toFixed(1)}% מהקרן`}
            variant="warning"
          />

          <ResultCard
            title="סך כל התשלומים"
            value={formatCurrency(result.totalPayments)}
            subtitle={`קרן ${formatCurrency(result.loanAmount)} + ריבית ${formatCurrency(result.totalInterest)}`}
            variant="success"
          />

          <Breakdown
            title="פירוט מלא"
            defaultOpen
            items={[
              { label: 'קרן ההלוואה', value: formatCurrency(result.loanAmount) },
              { label: 'תקופה', value: `${state.termYears} שנים (${state.termYears * 12} חודשים)` },
              { label: 'ריבית שנתית', value: `${state.interestRate}%` },
              { label: 'LTV', value: `${ltvPercentage.toFixed(1)}%` },
              { label: 'תשלום ראשון', value: formatCurrency(result.firstPayment) },
              { label: 'תשלום אחרון', value: formatCurrency(result.lastPayment) },
              { label: 'סך תשלומים', value: formatCurrency(result.totalPayments), bold: true },
              { label: 'מתוכם ריבית', value: formatCurrency(result.totalInterest) },
            ]}
          />
        </div>
      </div>

      {/* Chart */}
      {yearlyData.length > 0 && (
        <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">גרף לוח הסילוקין</h3>
            <div className="flex gap-2">
              {(['yearly', 'balance'] as ChartView[]).map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setChartView(v)}
                  className={`px-3 py-1.5 text-sm rounded-lg transition ${
                    chartView === v
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {v === 'yearly' ? 'קרן וריבית' : 'יתרת חוב'}
                </button>
              ))}
            </div>
          </div>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              {chartView === 'yearly' ? (
                <AreaChart data={yearlyData}>
                  <defs>
                    <linearGradient id="sgPrincipal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.7} />
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="sgInterest" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#dc2626" stopOpacity={0.7} />
                      <stop offset="95%" stopColor="#dc2626" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="שנה" tick={{ fontSize: 12 }} />
                  <YAxis tickFormatter={(v) => `${Math.round(v / 1000)}K`} tick={{ fontSize: 11 }} />
                  <Tooltip formatter={(v) => formatCurrency(Number(v))} />
                  <Legend />
                  <Area type="monotone" dataKey="קרן" stackId="1" stroke="#2563eb" fill="url(#sgPrincipal)" />
                  <Area type="monotone" dataKey="ריבית" stackId="1" stroke="#dc2626" fill="url(#sgInterest)" />
                </AreaChart>
              ) : (
                <LineChart data={yearlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="שנה" tick={{ fontSize: 12 }} />
                  <YAxis tickFormatter={(v) => `${Math.round(v / 1000)}K`} tick={{ fontSize: 11 }} />
                  <Tooltip formatter={(v) => formatCurrency(Number(v))} />
                  <Legend />
                  <Line type="monotone" dataKey="יתרה" stroke="#2563eb" strokeWidth={2} dot={false} />
                </LineChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// טאב משכנתא מעורבת (Multi-Track)
// ============================================================

function MultiTrackTab() {
  const [tracks, setTracks] = useState<MortgageTrack[]>([
    defaultTrack({ name: 'פריים', trackType: 'prime', amount: 500_000, interestRate: BANK_OF_ISRAEL_PRIME_2026 - 0.5 }),
    defaultTrack({ name: 'קל"צ', trackType: 'fixed-unlinked', amount: 500_000, interestRate: 4.2 }),
    defaultTrack({ name: 'צמוד מדד', trackType: 'fixed-linked', amount: 500_000, interestRate: 3.0, inflationRate: AVG_INFLATION_ISRAEL }),
  ]);
  const [chartView, setChartView] = useState<ChartView>('yearly');
  const [showInflationWarning, setShowInflationWarning] = useState(true);

  const updateTrack = useCallback((id: string, field: keyof MortgageTrack, value: unknown) => {
    setTracks((prev) => prev.map((t) => (t.id === id ? { ...t, [field]: value } : t)));
  }, []);

  const removeTrack = useCallback((id: string) => {
    setTracks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addTrack = useCallback(() => {
    setTracks((prev) => [...prev, defaultTrack()]);
  }, []);

  const applyPreset = useCallback((presetIndex: number) => {
    const preset = PRESET_COMPOSITIONS[presetIndex];
    const totalAmount = tracks.reduce((s, t) => s + t.amount, 0);
    const newTracks: MortgageTrack[] = preset.tracks.map((pt, i) => ({
      ...pt,
      id: newTrackId(),
      amount: Math.round((totalAmount * preset.distributions[i]) / 100 / 50_000) * 50_000,
    }));
    setTracks(newTracks);
  }, [tracks]);

  const result = useMemo(
    () => calculateMultiTrackMortgage({ tracks }),
    [tracks],
  );

  const totalAmount = tracks.reduce((s, t) => s + t.amount, 0);

  const pieData = tracks.map((t, i) => ({
    name: t.name,
    value: t.amount,
    color: PIE_COLORS[i % PIE_COLORS.length],
  }));

  const yearlyData = result.yearlyTotals.map((y) => ({
    שנה: `שנה ${y.year}`,
    קרן: Math.round(y.principal),
    ריבית: Math.round(y.interest),
    יתרה: Math.round(y.balance),
  }));

  const hasLinkedTrack = tracks.some((t) => t.trackType === 'fixed-linked');

  return (
    <div className="space-y-6">
      {/* Presets */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <h3 className="font-bold text-blue-900 mb-2">תמהילים מוצעים</h3>
        <div className="grid sm:grid-cols-3 gap-2">
          {PRESET_COMPOSITIONS.map((preset, i) => (
            <button
              key={i}
              type="button"
              onClick={() => applyPreset(i)}
              className="text-right p-3 bg-white rounded-lg border border-blue-200 hover:border-blue-400 hover:bg-blue-50 transition group"
            >
              <div className="font-medium text-blue-900 text-sm group-hover:text-blue-700">
                {preset.name}
              </div>
              <div className="text-xs text-gray-500 mt-0.5">{preset.suitable}</div>
              <div className={`text-xs mt-1 font-medium ${
                preset.riskLevel === 'low' ? 'text-green-600' :
                preset.riskLevel === 'medium' ? 'text-amber-600' : 'text-red-600'
              }`}>
                סיכון: {preset.riskLevel === 'low' ? 'נמוך' : preset.riskLevel === 'medium' ? 'בינוני' : 'גבוה'}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Regulation Warning */}
      {!result.isRegulationCompliant && totalAmount > 0 && (
        <div className="bg-red-50 border border-red-300 rounded-xl p-4 flex items-start gap-3">
          <span className="text-red-600 text-lg mt-0.5">⚠</span>
          <div>
            <p className="font-bold text-red-800">לא עומד בדרישות בנק ישראל</p>
            <p className="text-sm text-red-700 mt-0.5">
              {result.fixedTrackPercentage.toFixed(1)}% בריבית קבועה — נדרש לפחות 33%. הוסף מסלולי קל"צ או צמוד מדד.
            </p>
          </div>
        </div>
      )}

      {/* Inflation Warning */}
      {hasLinkedTrack && showInflationWarning && (
        <div className="bg-amber-50 border border-amber-300 rounded-xl p-4 flex items-start gap-3">
          <span className="text-amber-600 text-lg mt-0.5">📈</span>
          <div className="flex-1">
            <p className="font-bold text-amber-800">שים לב: מסלול צמוד מדד!</p>
            <p className="text-sm text-amber-700 mt-0.5">
              בהצמדה למדד הקרן גדלה עם האינפלציה. לאחר 25 שנה עם אינפלציה של 2.5%, קרן של 500,000 ₪ הופכת לכ-873,000 ₪ נומינלית — עלייה של 75%!
            </p>
          </div>
          <button onClick={() => setShowInflationWarning(false)} className="text-amber-600 hover:text-amber-800 text-sm">✕</button>
        </div>
      )}

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Tracks */}
        <div className="lg:col-span-3 space-y-4">
          {tracks.map((track, i) => (
            <TrackCard
              key={track.id}
              track={track}
              index={i}
              totalTracks={tracks.length}
              onUpdate={updateTrack}
              onRemove={removeTrack}
            />
          ))}

          {tracks.length < 5 && (
            <button
              type="button"
              onClick={addTrack}
              className="w-full py-3 border-2 border-dashed border-blue-300 rounded-xl text-blue-600 hover:border-blue-500 hover:bg-blue-50 transition font-medium"
            >
              + הוסף מסלול
            </button>
          )}
        </div>

        {/* Results */}
        <div className="lg:col-span-2 space-y-4">
          <ResultCard
            title="תשלום חודשי משולב"
            value={formatCurrency(result.combinedMonthlyPayment)}
            subtitle={`סכום ${tracks.length} מסלולים`}
            variant="primary"
          />

          <ResultCard
            title="סך ריבית כוללת"
            value={formatCurrency(result.totalInterest)}
            subtitle={`${((result.totalInterest / (totalAmount || 1)) * 100).toFixed(1)}% מהקרן`}
            variant="warning"
          />

          <div className="bg-white border-2 border-gray-200 rounded-xl p-4">
            <h4 className="font-bold text-gray-800 mb-3">פירוט לפי מסלול</h4>
            <div className="space-y-2">
              {result.tracks.map((tr, i) => (
                <div key={tr.track.id} className="flex items-center gap-2 text-sm">
                  <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }} />
                  <span className="flex-1 text-gray-700">{tr.track.name}</span>
                  <span className="text-gray-500">{formatCurrency(tr.track.amount)}</span>
                  <span className="font-medium text-blue-700">{formatCurrency(tr.monthlyPayment)}/חודש</span>
                </div>
              ))}
            </div>
          </div>

          <Breakdown
            title="סיכום תמהיל"
            defaultOpen
            items={[
              { label: 'סך ההלוואה', value: formatCurrency(result.totalLoanAmount) },
              { label: 'תשלום משולב', value: formatCurrency(result.combinedMonthlyPayment) },
              { label: '% ריבית קבועה', value: `${result.fixedTrackPercentage.toFixed(1)}%` },
              { label: 'עמידה בתקנות', value: result.isRegulationCompliant ? 'כן ✓' : 'לא ✗' },
              { label: 'סך ריבית', value: formatCurrency(result.totalInterest) },
              { label: 'סך תשלומים', value: formatCurrency(result.totalPayments), bold: true },
            ]}
          />

          {/* Pie Chart */}
          <div className="bg-white border-2 border-gray-200 rounded-xl p-4">
            <h4 className="font-bold text-gray-800 mb-2 text-sm">הרכב המשכנתא</h4>
            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} dataKey="value" label={false} labelLine={false} fontSize={11}>
                    {pieData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => formatCurrency(Number(v))} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Combined Chart */}
      {yearlyData.length > 0 && (
        <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">גרף תמהיל מלא</h3>
            <div className="flex gap-2">
              {(['yearly', 'balance'] as ChartView[]).map((v) => (
                <button key={v} type="button" onClick={() => setChartView(v)}
                  className={`px-3 py-1.5 text-sm rounded-lg transition ${chartView === v ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                  {v === 'yearly' ? 'קרן וריבית' : 'יתרת חוב'}
                </button>
              ))}
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              {chartView === 'yearly' ? (
                <BarChart data={yearlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="שנה" tick={{ fontSize: 11 }} />
                  <YAxis tickFormatter={(v) => `${Math.round(v / 1000)}K`} tick={{ fontSize: 11 }} />
                  <Tooltip formatter={(v) => formatCurrency(Number(v))} />
                  <Legend />
                  <Bar dataKey="קרן" stackId="a" fill="#2563eb" />
                  <Bar dataKey="ריבית" stackId="a" fill="#ef4444" />
                </BarChart>
              ) : (
                <LineChart data={yearlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="שנה" tick={{ fontSize: 11 }} />
                  <YAxis tickFormatter={(v) => `${Math.round(v / 1000)}K`} tick={{ fontSize: 11 }} />
                  <Tooltip formatter={(v) => formatCurrency(Number(v))} />
                  <Legend />
                  <Line type="monotone" dataKey="יתרה" stroke="#2563eb" strokeWidth={2} dot={false} />
                </LineChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// טאב מחזור משכנתא
// ============================================================

function RefinanceTab() {
  const [input, setInput] = useState<RefinanceInput>({
    currentBalance: 800_000,
    currentRate: 5.5,
    currentMonthlyPayment: 6_500,
    monthsRemaining: 240,
    newRate: 4.0,
    refinancingFees: 8_000,
    newTermMonths: 240,
    newMethod: 'shpitzer',
  });

  function upd<K extends keyof RefinanceInput>(field: K, value: RefinanceInput[K]) {
    setInput((prev) => ({ ...prev, [field]: value }));
  }

  const result = useMemo(() => calculateRefinancing(input), [input]);

  // נתוני גרף - חיסכון מצטבר לאורך זמן
  const savingsChart = useMemo(() => {
    const data = [];
    let cumulativeSavings = -input.refinancingFees;
    const monthlySavings = result.monthlySavings;
    for (let m = 1; m <= Math.min(input.monthsRemaining, 360); m += 12) {
      cumulativeSavings += monthlySavings * 12;
      data.push({
        שנה: `שנה ${Math.ceil(m / 12)}`,
        'חיסכון מצטבר': Math.round(cumulativeSavings),
      });
    }
    return data;
  }, [input.refinancingFees, input.monthsRemaining, result.monthlySavings]);

  const breakevenYear = result.breakevenMonths / 12;

  return (
    <div className="space-y-6">
      <div className="grid lg:grid-cols-5 gap-6">
        {/* Form */}
        <div className="lg:col-span-3 bg-white border-2 border-gray-200 rounded-xl p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">פרטי המשכנתא הנוכחית</h2>
          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <NumericInput
                label='יתרת קרן (ש"ח)'
                value={input.currentBalance}
                onChange={(v) => upd('currentBalance', v)}
                min={0}
                step={10_000}
                note="כמה נשאר לסלק"
              />
              <NumericInput
                label="ריבית נוכחית (%)"
                value={input.currentRate}
                onChange={(v) => upd('currentRate', v)}
                min={0}
                max={20}
                step={0.1}
              />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <NumericInput
                label='תשלום חודשי נוכחי (ש"ח)'
                value={input.currentMonthlyPayment}
                onChange={(v) => upd('currentMonthlyPayment', v)}
                min={0}
                step={100}
              />
              <NumericInput
                label="חודשים שנותרו"
                value={input.monthsRemaining}
                onChange={(v) => upd('monthsRemaining', v)}
                min={1}
                max={360}
                step={12}
                note={`כ-${(input.monthsRemaining / 12).toFixed(1)} שנים`}
              />
            </div>

            <hr className="border-gray-200" />
            <h3 className="font-bold text-gray-800">הצעת מחזור</h3>

            <div className="grid sm:grid-cols-2 gap-4">
              <NumericInput
                label="ריבית חדשה (%)"
                value={input.newRate}
                onChange={(v) => upd('newRate', v)}
                min={0}
                max={20}
                step={0.1}
              />
              <NumericInput
                label='עמלות מחזור (ש"ח)'
                value={input.refinancingFees}
                onChange={(v) => upd('refinancingFees', v)}
                min={0}
                step={1_000}
                note="בדרך כלל 5,000-15,000 ₪"
              />
            </div>
            <NumericInput
              label="תקופה חדשה (חודשים)"
              value={input.newTermMonths ?? input.monthsRemaining}
              onChange={(v) => upd('newTermMonths', v)}
              min={12}
              max={360}
              step={12}
              note={`כ-${((input.newTermMonths ?? input.monthsRemaining) / 12).toFixed(1)} שנים`}
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">שיטת חישוב</label>
              <MethodToggle
                value={input.newMethod ?? 'shpitzer'}
                onChange={(v) => upd('newMethod', v)}
              />
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-2 space-y-4">
          <div className={`rounded-xl p-5 border-2 ${result.worthRefinancing ? 'bg-emerald-50 border-emerald-300' : 'bg-red-50 border-red-300'}`}>
            <p className="text-sm font-medium text-gray-700 mb-1">המלצה</p>
            <p className={`font-bold text-base ${result.worthRefinancing ? 'text-emerald-800' : 'text-red-800'}`}>
              {result.worthRefinancing ? '✓ מחזור כדאי!' : '✗ מחזור אינו כדאי'}
            </p>
            <p className="text-sm text-gray-700 mt-2">{result.recommendation}</p>
          </div>

          <ResultCard
            title="חיסכון חודשי"
            value={formatCurrency(result.monthlySavings)}
            subtitle={`מ-${formatCurrency(input.currentMonthlyPayment)} ל-${formatCurrency(result.newMonthlyPayment)}`}
            variant={result.monthlySavings > 0 ? 'success' : 'warning'}
          />

          <ResultCard
            title="חיסכון כולל (נטו אחרי עמלות)"
            value={formatCurrency(result.totalSavingsAfterFees)}
            subtitle={`נקודת איזון: ${result.breakevenMonths < 9000 ? `${Math.round(breakevenYear * 10) / 10} שנים` : 'לא מגיע'}`}
            variant={result.totalSavingsAfterFees > 0 ? 'success' : 'warning'}
          />

          <Breakdown
            title="פירוט מחזור"
            defaultOpen
            items={[
              { label: 'יתרת חוב', value: formatCurrency(input.currentBalance) },
              { label: 'סה"כ לשלם כיום', value: formatCurrency(result.currentTotalRemaining) },
              { label: 'תשלום חדש', value: formatCurrency(result.newMonthlyPayment) },
              { label: 'סה"כ לשלם אחרי מחזור', value: formatCurrency(result.newTotalPayments) },
              { label: 'חיסכון בריבית', value: formatCurrency(result.totalInterestSavings) },
              { label: 'עמלות מחזור', value: formatCurrency(input.refinancingFees) },
              { label: 'חיסכון נטו', value: formatCurrency(result.totalSavingsAfterFees), bold: true },
            ]}
          />
        </div>
      </div>

      {/* Chart - Cumulative Savings */}
      {savingsChart.length > 0 && result.monthlySavings > 0 && (
        <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">חיסכון מצטבר לאורך זמן</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={savingsChart}>
                <defs>
                  <linearGradient id="savingsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.7} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="שנה" tick={{ fontSize: 12 }} />
                <YAxis tickFormatter={(v) => `${Math.round(v / 1000)}K`} tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v) => formatCurrency(Number(v))} />
                <ReferenceLine y={0} stroke="#dc2626" strokeDasharray="3 3" label={{ value: 'נקודת איזון', position: 'right', fontSize: 11, fill: '#dc2626' }} />
                <Area type="monotone" dataKey="חיסכון מצטבר" stroke="#10b981" fill="url(#savingsGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// טאב פירעון מוקדם
// ============================================================

function EarlyPayoffTab() {
  const [input, setInput] = useState<EarlyPayoffInput>({
    currentBalance: 600_000,
    currentRate: 4.5,
    monthsRemaining: 240,
    method: 'shpitzer',
    lumpSum: 100_000,
    extraMonthlyPayment: 0,
    lumpSumInMonths: 0,
  });

  function upd<K extends keyof EarlyPayoffInput>(field: K, value: EarlyPayoffInput[K]) {
    setInput((prev) => ({ ...prev, [field]: value }));
  }

  const result = useMemo(() => calculateEarlyPayoff(input), [input]);

  const hasPayoff = (input.lumpSum ?? 0) > 0 || (input.extraMonthlyPayment ?? 0) > 0;

  return (
    <div className="space-y-6">
      <div className="grid lg:grid-cols-5 gap-6">
        {/* Form */}
        <div className="lg:col-span-3 bg-white border-2 border-gray-200 rounded-xl p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">פירעון מוקדם - כמה אחסוך?</h2>
          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <NumericInput
                label='יתרת קרן (ש"ח)'
                value={input.currentBalance}
                onChange={(v) => upd('currentBalance', v)}
                min={0}
                step={10_000}
              />
              <NumericInput
                label="ריבית שנתית (%)"
                value={input.currentRate}
                onChange={(v) => upd('currentRate', v)}
                min={0}
                max={20}
                step={0.1}
              />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <NumericInput
                label="חודשים שנותרו"
                value={input.monthsRemaining}
                onChange={(v) => upd('monthsRemaining', v)}
                min={1}
                max={360}
                step={12}
                note={`${(input.monthsRemaining / 12).toFixed(1)} שנים`}
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">שיטת חישוב</label>
                <MethodToggle value={input.method} onChange={(v) => upd('method', v)} />
              </div>
            </div>

            <hr className="border-gray-200" />
            <h3 className="font-bold text-gray-800">תוספת תשלום</h3>
            <p className="text-sm text-gray-500">בחר אחת מהאפשרויות:</p>

            <div className="grid sm:grid-cols-2 gap-4">
              <NumericInput
                label='תשלום חד-פעמי (ש"ח)'
                value={input.lumpSum ?? 0}
                onChange={(v) => upd('lumpSum', v)}
                min={0}
                step={10_000}
                note="תשלום מוקדם גדול"
              />
              <NumericInput
                label="אחרי כמה חודשים?"
                value={input.lumpSumInMonths ?? 0}
                onChange={(v) => upd('lumpSumInMonths', v)}
                min={0}
                step={1}
                note="0 = עכשיו"
              />
            </div>
            <NumericInput
              label='תוספת חודשית (ש"ח)'
              value={input.extraMonthlyPayment ?? 0}
              onChange={(v) => upd('extraMonthlyPayment', v)}
              min={0}
              step={500}
              note="תשלום נוסף כל חודש"
            />
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-2 space-y-4">
          <ResultCard
            title="חיסכון בריבית"
            value={formatCurrency(result.interestSaved)}
            subtitle={`${result.yearsSaved.toFixed(1)} שנים מוקדם יותר`}
            variant={result.interestSaved > 0 ? 'success' : 'primary'}
          />

          <ResultCard
            title="חיסכון נטו (אחרי עמלה)"
            value={formatCurrency(result.netSavings)}
            subtitle={`עמלה מוערכת: ${formatCurrency(result.estimatedPenalty)}`}
            variant={result.netSavings > 0 ? 'success' : 'warning'}
          />

          {hasPayoff && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <p className="text-sm font-medium text-blue-800">סיום משכנתא</p>
              <p className="text-2xl font-bold text-blue-700 mt-1">
                {result.newMonthsRemaining} חודשים
              </p>
              <p className="text-sm text-blue-600 mt-0.5">
                מקורית: {input.monthsRemaining} חודשים — חיסכון: {Math.max(0, input.monthsRemaining - result.newMonthsRemaining)} חודשים
              </p>
            </div>
          )}

          <Breakdown
            title="פירוט פירעון מוקדם"
            defaultOpen
            items={[
              { label: 'תשלום חודשי מקורי', value: formatCurrency(result.originalMonthlyPayment) },
              { label: 'סך ריבית מקורית', value: formatCurrency(result.originalTotalInterest) },
              { label: 'ריבית לאחר פירעון', value: formatCurrency(result.newTotalInterest) },
              { label: 'חיסכון ריבית', value: formatCurrency(result.interestSaved) },
              { label: 'עמלה מוערכת (1%)', value: formatCurrency(result.estimatedPenalty) },
              { label: 'חיסכון נטו', value: formatCurrency(result.netSavings), bold: true },
              { label: 'זמן שנחסך', value: `${result.monthsSaved} חודשים (${result.yearsSaved.toFixed(1)} שנים)` },
            ]}
          />

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <p className="text-sm font-bold text-amber-800 mb-1">טיפ: עמלת פירעון מוקדם</p>
            <p className="text-xs text-amber-700">
              בנקים גובים עמלה על מסלולים בריבית קבועה בלבד. במסלול פריים — אין עמלה. החישוב מוצג כהערכה של ~1%; הסכום המדויק תלוי בהפרש הריביות ביום הפירעון.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// טאב כושר החזר
// ============================================================

function AffordabilityTab() {
  const [input, setInput] = useState<AffordabilityInput>({
    monthlyNetIncome: 20_000,
    otherObligations: 2_000,
    propertyValue: 2_000_000,
    buyerType: 'first-home',
    termYears: 25,
    interestRate: 4.5,
    method: 'shpitzer',
  });

  function upd<K extends keyof AffordabilityInput>(field: K, value: AffordabilityInput[K]) {
    setInput((prev) => ({ ...prev, [field]: value }));
  }

  const result = useMemo(() => calculateAffordability(input), [input]);

  const dtiColor =
    result.debtToIncomeRatio > 40
      ? 'text-red-700'
      : result.debtToIncomeRatio > 30
      ? 'text-amber-700'
      : 'text-emerald-700';

  const barData = [
    { name: 'הכנסה נטו', value: input.monthlyNetIncome, color: '#2563eb' },
    { name: 'התחייבויות קיימות', value: input.otherObligations, color: '#dc2626' },
    { name: 'תשלום משכנתא (מומלץ)', value: Math.min(result.availableForMortgage, result.maxComfortablePayment - input.otherObligations), color: '#10b981' },
    { name: 'מגבלה 40%', value: result.maxBankPayment, color: '#f59e0b' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid lg:grid-cols-5 gap-6">
        {/* Form */}
        <div className="lg:col-span-3 bg-white border-2 border-gray-200 rounded-xl p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">כושר החזר - כמה משכנתא אני יכול לקחת?</h2>
          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <NumericInput
                label='הכנסה משפחתית נטו (ש"ח/חודש)'
                value={input.monthlyNetIncome}
                onChange={(v) => upd('monthlyNetIncome', v)}
                min={0}
                step={1_000}
                note="הכנסה נקייה משני בני הזוג"
              />
              <NumericInput
                label='התחייבויות חודשיות אחרות (ש"ח)'
                value={input.otherObligations}
                onChange={(v) => upd('otherObligations', v)}
                min={0}
                step={500}
                note="ליסינג, הלוואות, אשראי"
              />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <NumericInput
                label='שווי הדירה (ש"ח)'
                value={input.propertyValue}
                onChange={(v) => upd('propertyValue', v)}
                min={0}
                step={100_000}
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">סוג רוכש</label>
                <select
                  value={input.buyerType}
                  onChange={(e) => upd('buyerType', e.target.value as BuyerType)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  <option value="first-home">דירה ראשונה (LTV 75%)</option>
                  <option value="home-replacement">מחליף דירה (LTV 70%)</option>
                  <option value="investor">משקיע (LTV 50%)</option>
                </select>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <NumericInput
                label="ריבית (%)"
                value={input.interestRate}
                onChange={(v) => upd('interestRate', v)}
                min={0}
                max={20}
                step={0.1}
              />
              <NumericInput
                label="תקופה (שנים)"
                value={input.termYears}
                onChange={(v) => upd('termYears', v)}
                min={1}
                max={30}
                step={1}
              />
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-2 space-y-4">
          <ResultCard
            title="הלוואה מומלצת"
            value={formatCurrency(result.recommendedLoan)}
            subtitle={`מגבלת LTV: ${formatCurrency(result.maxAllowedByLtv)}`}
            variant="primary"
          />

          <div className={`rounded-xl p-5 border-2 ${
            result.debtToIncomeRatio > 40 ? 'bg-red-50 border-red-300' :
            result.debtToIncomeRatio > 30 ? 'bg-amber-50 border-amber-300' :
            'bg-emerald-50 border-emerald-300'
          }`}>
            <p className="text-sm font-medium text-gray-700 mb-1">יחס החזר-הכנסה (DTI)</p>
            <p className={`text-3xl font-bold ${dtiColor}`}>{result.debtToIncomeRatio.toFixed(1)}%</p>
            <p className="text-xs text-gray-600 mt-1">על המשכנתא המלאה לפי LTV</p>
            <p className="text-sm text-gray-700 mt-2">{result.recommendation}</p>
          </div>

          <Breakdown
            title="פירוט כושר החזר"
            defaultOpen
            items={[
              { label: 'הכנסה נטו', value: formatCurrency(input.monthlyNetIncome) },
              { label: 'מגבלה נוחה (30%)', value: formatCurrency(result.maxComfortablePayment) },
              { label: 'מגבלת בנק (40%)', value: formatCurrency(result.maxBankPayment) },
              { label: 'זמין למשכנתא', value: formatCurrency(result.availableForMortgage) },
              { label: 'תשלום על מלוא LTV', value: formatCurrency(result.monthlyPaymentForFullLoan) },
              { label: 'הלוואה נוחה', value: formatCurrency(result.maxLoanAtComfort) },
              { label: 'הלוואה מקסימלית', value: formatCurrency(result.maxLoanAtBank) },
              { label: 'המלצה', value: formatCurrency(result.recommendedLoan), bold: true },
            ]}
          />
        </div>
      </div>

      {/* Bar Chart */}
      <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">מפת ההכנסה החודשית</h3>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" tickFormatter={(v) => `${Math.round(v / 1000)}K`} tick={{ fontSize: 11 }} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} width={160} />
              <Tooltip formatter={(v) => formatCurrency(Number(v))} />
              <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                {barData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-3 p-3 bg-blue-50 rounded-lg">
          <p className="text-xs text-blue-800">
            <strong>כלל האצבע:</strong> בנק ישראל ממליץ שההחזר החודשי לא יעלה על 30%-40% מההכנסה הנטו. מעל 40% — קשה לקבל אישור.
          </p>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// קומפוננטה ראשית
// ============================================================

export function MortgageCalculator() {
  const [activeTab, setActiveTab] = useState<TabMode>('single');

  const tabs: { id: TabMode; label: string; description: string }[] = [
    { id: 'single', label: 'משכנתא יחידה', description: 'חישוב מסלול אחד' },
    { id: 'multi', label: 'משכנתא מעורבת', description: '2-4 מסלולים' },
    { id: 'refinance', label: 'מחזור משכנתא', description: 'האם כדאי למחזר?' },
    { id: 'early-payoff', label: 'פירעון מוקדם', description: 'כמה אחסוך?' },
    { id: 'affordability', label: 'כושר החזר', description: 'כמה אני יכול?' },
  ];

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

      {/* Tab Content */}
      {activeTab === 'single' && <SingleTrackTab />}
      {activeTab === 'multi' && <MultiTrackTab />}
      {activeTab === 'refinance' && <RefinanceTab />}
      {activeTab === 'early-payoff' && <EarlyPayoffTab />}
      {activeTab === 'affordability' && <AffordabilityTab />}
    </div>
  );
}
