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
  ReferenceLine,
} from 'recharts';
import {
  optimizeMortgage,
  calculateMonthlyPayment,
  calculateMonthlyPaymentWithGrace,
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
  hasInflationRelevance,
  calculateDTI,
  calculateClosingCosts,
  calculateStagedPayoffForMix,
  calculateThreeOptions,
  meetsBudgetConstraint,
  calculateBankGradeAffordability,
  runIncomeStressTest,
  compareBankOffers,
  calculateTimeline,
  getLTVRateAdjustment,
  getLTVBandLabel,
  calculateSavingsFromHigherDownPayment,
  applyLTVAdjustmentToTracks,
  MORTGAGE_TIMELINE_STAGES,
  DEFAULT_STRESS_SCENARIOS,
  LTV_RATE_ADJUSTMENTS_2026,
  type OptimizerTrack,
  type OptimizerTrackType,
  type OptimizationObjective,
  type OptimizerConstraints,
  type AllocationResult,
  type OptimizerResult,
  type PrepaymentPlan,
  type MaxConstraints,
  type DTIInfo,
  type ClosingCosts,
  type ThreeOptionsResult,
  type BankOffer,
  type RankedOffer,
  type AffordabilityProfile,
  type BankAffordabilityResult,
  type StressTestResult,
  type FamilyStatus,
} from '@/lib/calculators/mortgage-optimizer';
import { formatCurrency } from '@/lib/utils/formatters';
import { ResultCard } from '@/components/calculator/ResultCard';
import { Breakdown } from '@/components/calculator/Breakdown';

// ============================================================
// קבועים ועזרים
// ============================================================

type TabId = 'setup' | 'tracks' | 'objective' | 'results' | 'scenarios' | 'stress' | 'bankcomp' | 'timeline';

let trackIdCounter = 100;
function newTrackId() {
  return `opt-track-${++trackIdCounter}`;
}

let prepaymentIdCounter = 0;
function newPrepaymentId() {
  return `pp-${++prepaymentIdCounter}`;
}

const TAB_LABELS: Record<TabId, string> = {
  setup: 'הגדרת בקשה',
  tracks: 'מסלולים',
  objective: 'מטרה ואילוצים',
  results: 'תוצאות',
  scenarios: 'תרחישים',
  stress: 'מבחן עמידות',
  bankcomp: 'השוואת בנקים',
  timeline: 'לוח זמנים',
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

const PIE_COLORS_LIST = ['#2563eb', '#f59e0b', '#f97316', '#8b5cf6', '#10b981'];

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
  placeholder?: string;
}

function NumericInput({ label, value, onChange, min, max, step, unit, note, className, error, placeholder }: NumericInputProps) {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="relative">
        <input
          type="number"
          value={value || ''}
          min={min}
          max={max}
          step={step}
          placeholder={placeholder}
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
// כרטיס DTI
// ============================================================

function DTIBadge({ dti }: { dti: DTIInfo }) {
  if (!dti.netIncome) return null;
  const colorMap = {
    green: 'bg-green-50 border-green-200 text-green-800',
    amber: 'bg-amber-50 border-amber-200 text-amber-800',
    orange: 'bg-orange-50 border-orange-200 text-orange-800',
    red: 'bg-red-50 border-red-200 text-red-800',
    gray: 'bg-gray-50 border-gray-200 text-gray-600',
  };
  const cls = colorMap[dti.statusColor as keyof typeof colorMap] || colorMap.gray;

  return (
    <div className={`border rounded-xl p-4 ${cls}`}>
      <div className="flex items-center justify-between mb-1">
        <span className="font-bold text-sm">{dti.statusLabel}</span>
        <span className="text-2xl font-bold">{dti.ratioPercent.toFixed(0)}%</span>
      </div>
      <div className="text-xs leading-relaxed">{dti.message}</div>
      <div className="mt-2 bg-white/50 rounded-full h-2 overflow-hidden">
        <div
          className={`h-2 rounded-full transition-all ${
            dti.status === 'safe' ? 'bg-green-500' :
            dti.status === 'good' ? 'bg-amber-500' :
            dti.status === 'tight' ? 'bg-orange-500' : 'bg-red-500'
          }`}
          style={{ width: `${Math.min(100, dti.ratioPercent * 2)}%` }}
        />
      </div>
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
  showInflation?: boolean;
}

function AllocationCard({ result, title, isOptimal, badge, onSelect, showInflation = true }: AllocationCardProps) {
  const pieData = result.allocation
    .filter((a) => a.amount > 0)
    .map((a) => ({
      name: a.trackName,
      value: Math.round(a.amount),
    }));

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
        {showInflation && result.indexedPercent > 0 && (
          <div className="text-center col-span-2">
            <p className="text-xs text-gray-500 mb-0.5">% צמוד מדד</p>
            <p className="font-medium text-gray-700">{Math.round(result.indexedPercent * 100)}%</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================
// כרטיס 3 אפשרויות
// ============================================================

interface ThreeOptionsCardProps {
  option: AllocationResult & { label: string; description: string };
  onSelect: () => void;
  isSelected: boolean;
  showInflation: boolean;
  totalAmount: number;
}

function ThreeOptionCard({ option, onSelect, isSelected, showInflation, totalAmount }: ThreeOptionsCardProps) {
  return (
    <div
      className={`relative rounded-xl border-2 p-5 cursor-pointer transition-all ${
        isSelected ? 'border-blue-500 bg-blue-50 shadow-lg' : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-md'
      }`}
      onClick={onSelect}
    >
      {isSelected && (
        <div className="absolute -top-3 right-4 bg-blue-600 text-white text-xs px-3 py-1 rounded-full font-bold">
          נבחר
        </div>
      )}
      <h4 className="font-bold text-gray-900 text-base mb-1">{option.label}</h4>
      <p className="text-xs text-gray-500 mb-3">{option.description}</p>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">תשלום חודשי</span>
          <span className="font-bold text-blue-700">{formatCurrency(option.monthlyPayment)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">סה"כ ריבית</span>
          <span className="font-bold text-amber-700">{formatCurrency(option.totalCost)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">סה"כ תשלומים</span>
          <span className="font-bold text-gray-800">{formatCurrency(option.totalPayments)}</span>
        </div>
        {showInflation && option.indexedPercent > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">% צמוד מדד</span>
            <span className="font-medium text-amber-600">{Math.round(option.indexedPercent * 100)}%</span>
          </div>
        )}
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">ציון סיכון</span>
          <span className={`font-bold ${option.riskScore < 30 ? 'text-green-600' : option.riskScore < 60 ? 'text-amber-600' : 'text-red-600'}`}>
            {option.riskScore}/100
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">ריבית ממוצעת</span>
          <span className="font-medium text-gray-700">{option.weightedAvgRate.toFixed(2)}%</span>
        </div>
      </div>

      {/* Pie mini */}
      <div className="mt-3 h-28">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={option.allocation.filter((a) => a.amount > 0).map((a) => ({ name: a.trackName, value: Math.round(a.amount) }))}
              cx="50%" cy="50%" innerRadius={25} outerRadius={48}
              dataKey="value"
              label={({ percent }) => `${((percent ?? 0) * 100).toFixed(0)}%`}
              labelLine={false}
              fontSize={9}
            >
              {option.allocation.filter((a) => a.amount > 0).map((_, i) => (
                <Cell key={i} fill={PIE_COLORS_LIST[i % PIE_COLORS_LIST.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(v) => formatCurrency(Number(v))} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-2 space-y-1">
        {option.allocation.filter((a) => a.amount > 0).map((a, i) => (
          <div key={a.trackId} className="flex items-center gap-1 text-xs">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: PIE_COLORS_LIST[i % PIE_COLORS_LIST.length] }} />
            <span className="flex-1 text-gray-600">{a.trackName}</span>
            <span className="font-medium">{Math.round(a.percent * 100)}%</span>
          </div>
        ))}
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
  // DTI
  netIncome: number;
  // Max constraints
  maxMonthlyPayment: number;
  maxTermYears: number;
  // Closing costs
  showClosingCosts: boolean;
  lawyerFeePercent: number;
  appraiserFee: number;
  bankOpeningFeePercent: number;
  lifeInsurancePercent: number;
  buildingInsuranceAnnual: number;
  // V3: LTV
  propertyValue: number;
  applyLTVAdjustment: boolean;
  // V3: Bank-grade affordability
  familyStatus: FamilyStatus;
  numChildren: number;
  otherLoanPayments: number;
  monthlyInsurance: number;
  showAffordability: boolean;
}

interface SetupTabProps {
  state: SetupState;
  onChange: (s: SetupState) => void;
  onTracksChanged: (t: OptimizerTrack[]) => void;
  onNext: () => void;
  dti?: DTIInfo;
  closingCosts?: ClosingCosts;
}

function SetupTab({ state, onChange, onTracksChanged, onNext, dti, closingCosts }: SetupTabProps) {
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
        <h3 className="font-bold text-blue-900 text-lg mb-1">אופטימייזר תמהיל המשכנתא — V3</h3>
        <p className="text-sm text-blue-700">
          כמו Excel Solver — מוצא את החלוקה המתמטית האופטימלית בין מסלולי המשכנתא למזעור העלות,
          הסיכון, או התשלום החודשי.
        </p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {['כשירות בנקאית', 'ריביות LTV', 'תקופת גרייס', 'מבחן עמידות', 'השוואת בנקים', 'לוח זמנים'].map((f) => (
            <span key={f} className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full font-medium">{f}</span>
          ))}
        </div>
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

      {/* אילוצי תקציב */}
      <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
        <h3 className="font-bold text-gray-900 mb-4">אילוצי תקציב (אופציונלי)</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <NumericInput
            label="תשלום חודשי מקסימלי (₪)"
            value={state.maxMonthlyPayment}
            onChange={(v) => onChange({ ...state, maxMonthlyPayment: v })}
            min={0}
            step={500}
            placeholder="ללא הגבלה"
            note="המערכת תסנן תמהילים מעל הסכום"
          />
          <NumericInput
            label="תקופה מקסימלית (שנים)"
            value={state.maxTermYears}
            onChange={(v) => onChange({ ...state, maxTermYears: v })}
            min={0}
            max={30}
            step={1}
            placeholder="ללא הגבלה"
            note="מגביל את משך ההלוואה"
          />
        </div>

        {state.maxMonthlyPayment > 0 && (
          <div className="mt-3 bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
            <strong>הגבלת תשלום:</strong> תמהילים עם תשלום &gt; {formatCurrency(state.maxMonthlyPayment)}/חודש יסומנו כחורגים מהתקציב.
          </div>
        )}
        {state.maxTermYears > 0 && (
          <div className="mt-2 bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-800">
            <strong>טיפ:</strong> תקופה קצרה = תשלום חודשי גבוה יותר אבל ריבית כוללת נמוכה משמעותית.
          </div>
        )}
      </div>

      {/* V3: LTV */}
      <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
        <h3 className="font-bold text-gray-900 mb-1">שווי הנכס ו-LTV</h3>
        <p className="text-xs text-gray-500 mb-4">
          הזן שווי הנכס לחישוב LTV ולקבלת ריביות מותאמות אוטומטית
        </p>
        <NumericInput
          label="שווי הנכס (₪)"
          value={state.propertyValue}
          onChange={(v) => onChange({ ...state, propertyValue: v })}
          min={0}
          step={50_000}
          placeholder="לדוגמה: 2,500,000"
        />

        {state.propertyValue > 0 && state.totalAmount > 0 && (() => {
          const ltv = state.totalAmount / state.propertyValue;
          const adj = getLTVRateAdjustment(ltv);
          const bandLabel = getLTVBandLabel(ltv);
          const adjColor = adj < 0 ? 'text-green-700' : adj > 0 ? 'text-red-700' : 'text-gray-700';
          const bandBg = adj < -0.25 ? 'bg-green-50 border-green-200' : adj < 0 ? 'bg-blue-50 border-blue-200' : adj === 0 ? 'bg-gray-50 border-gray-200' : 'bg-orange-50 border-orange-200';
          return (
            <div className={`mt-3 border rounded-xl p-4 ${bandBg}`}>
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-sm text-gray-800">LTV: {(ltv * 100).toFixed(1)}%</span>
                <span className={`text-sm font-bold ${adjColor}`}>
                  {adj > 0 ? '+' : ''}{adj.toFixed(2)}% לריבית
                </span>
              </div>
              <p className="text-xs text-gray-600">{bandLabel}</p>
              <div className="mt-2 flex items-center gap-2">
                <input
                  type="checkbox"
                  id="applyLTV"
                  checked={state.applyLTVAdjustment}
                  onChange={(e) => onChange({ ...state, applyLTVAdjustment: e.target.checked })}
                  className="accent-blue-600"
                />
                <label htmlFor="applyLTV" className="text-xs text-gray-700 cursor-pointer">
                  החל התאמת LTV אוטומטית על כל המסלולים
                </label>
              </div>

              {/* הצעת הון עצמי נוסף */}
              {ltv > 0.45 && (
                (() => {
                  const extra = 200_000;
                  const savings = calculateSavingsFromHigherDownPayment(
                    state.totalAmount, state.propertyValue, extra,
                    DEFAULT_TRACKS_2026, 25
                  );
                  if (savings.estimatedSavings > 0) {
                    return (
                      <div className="mt-2 bg-green-50 border border-green-200 rounded-lg p-3 text-xs text-green-800">
                        <strong>טיפ:</strong> הוספת {formatCurrency(extra)} הון עצמי (LTV יורד ל-{(savings.newLtv * 100).toFixed(0)}%) תחסוך כ-{formatCurrency(savings.estimatedSavings)} לאורך חיי המשכנתא.
                      </div>
                    );
                  }
                  return null;
                })()
              )}
            </div>
          );
        })()}
      </div>

      {/* DTI */}
      <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
        <h3 className="font-bold text-gray-900 mb-1">בדיקת יחס החזר-הכנסה (DTI)</h3>
        <p className="text-xs text-gray-500 mb-4">הזן הכנסה נטו משפחתית לקבלת המלצה</p>
        <NumericInput
          label="הכנסה משפחתית נטו חודשית (₪)"
          value={state.netIncome}
          onChange={(v) => onChange({ ...state, netIncome: v })}
          min={0}
          step={1000}
          placeholder="לדוגמה: 18,000"
        />
        {dti && dti.netIncome > 0 && (
          <div className="mt-3">
            <DTIBadge dti={dti} />
          </div>
        )}
      </div>

      {/* V3: Bank-Grade Affordability */}
      <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
        <button
          type="button"
          onClick={() => onChange({ ...state, showAffordability: !state.showAffordability })}
          className="flex items-center justify-between w-full"
        >
          <div>
            <h3 className="font-bold text-gray-900">כשירות בנקאית מלאה</h3>
            <p className="text-xs text-gray-500">חישוב מדויק כפי שהבנק מחשב — לפי הרכב משפחה וחובות</p>
          </div>
          <span className="text-gray-400 text-lg">{state.showAffordability ? '▲' : '▼'}</span>
        </button>

        {state.showAffordability && (
          <div className="mt-4 space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">מצב משפחתי</label>
                <select
                  value={state.familyStatus}
                  onChange={(e) => onChange({ ...state, familyStatus: e.target.value as FamilyStatus })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                >
                  <option value="single">יחיד/ה</option>
                  <option value="couple">זוג</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">מספר ילדים</label>
                <input
                  type="number"
                  min={0} max={10}
                  value={state.numChildren}
                  onChange={(e) => onChange({ ...state, numChildren: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
              <NumericInput
                label="תשלומי חובות אחרים (₪/חודש)"
                value={state.otherLoanPayments}
                onChange={(v) => onChange({ ...state, otherLoanPayments: v })}
                min={0}
                step={500}
                placeholder="0"
                note="הלוואות רכב, הלוואות אישיות וכו'"
              />
              <NumericInput
                label="ביטוחים חודשיים (₪/חודש)"
                value={state.monthlyInsurance}
                onChange={(v) => onChange({ ...state, monthlyInsurance: v })}
                min={0}
                step={100}
                placeholder="0"
                note="ביטוח חיים, בריאות וכו'"
              />
            </div>

            {state.netIncome > 0 && (() => {
              const profile: AffordabilityProfile = {
                netIncome: state.netIncome,
                familyStatus: state.familyStatus,
                numChildren: state.numChildren,
                otherLoanPayments: state.otherLoanPayments,
                monthlyInsurance: state.monthlyInsurance,
                loanAmount: state.totalAmount,
                propertyValue: state.propertyValue,
              };
              const estimated = calculateMonthlyPayment(state.totalAmount, 4.0, state.defaultTermYears);
              const aff = calculateBankGradeAffordability(profile, estimated);

              const bgColor = aff.profileColor === 'green' ? 'bg-green-50 border-green-200' :
                              aff.profileColor === 'red' ? 'bg-red-50 border-red-200' : 'bg-amber-50 border-amber-200';
              const textColor = aff.profileColor === 'green' ? 'text-green-800' :
                                aff.profileColor === 'red' ? 'text-red-800' : 'text-amber-800';

              return (
                <div className={`border rounded-xl p-4 ${bgColor}`}>
                  <div className="flex items-center justify-between mb-3">
                    <span className={`font-bold text-sm ${textColor}`}>{aff.profileLabel}</span>
                    <span className={`text-xl font-bold ${textColor}`}>
                      כשירות: {formatCurrency(aff.maxMonthlyPayment)}/חודש
                    </span>
                  </div>
                  <div className="space-y-1 text-xs text-gray-700">
                    <div className="flex justify-between">
                      <span>הכנסה נטו</span>
                      <span className="font-medium">{formatCurrency(aff.breakdown.netIncome)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>פחות הוצאות מחייה</span>
                      <span className="font-medium text-red-600">-{formatCurrency(aff.breakdown.minusLivingExpenses)}</span>
                    </div>
                    {aff.breakdown.minusOtherLoans > 0 && (
                      <div className="flex justify-between">
                        <span>פחות חובות אחרים</span>
                        <span className="font-medium text-red-600">-{formatCurrency(aff.breakdown.minusOtherLoans)}</span>
                      </div>
                    )}
                    {aff.breakdown.minusInsurance > 0 && (
                      <div className="flex justify-between">
                        <span>פחות ביטוחים</span>
                        <span className="font-medium text-red-600">-{formatCurrency(aff.breakdown.minusInsurance)}</span>
                      </div>
                    )}
                    <div className="flex justify-between border-t pt-1">
                      <span className="font-medium">זמין למשכנתא</span>
                      <span className="font-bold">{formatCurrency(aff.breakdown.availableForMortgage)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>גבול DTI ({aff.breakdown.dtiLimitPercent.toFixed(0)}%)</span>
                      <span className="font-bold text-blue-700">{formatCurrency(aff.maxMonthlyPayment)}/חודש</span>
                    </div>
                  </div>
                  {aff.warningMessage && (
                    <div className="mt-2 bg-red-100 border border-red-300 rounded-lg p-2 text-xs text-red-800 font-medium">
                      {aff.warningMessage}
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        )}
      </div>

      {/* עלויות נלוות */}
      <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
        <button
          type="button"
          onClick={() => onChange({ ...state, showClosingCosts: !state.showClosingCosts })}
          className="flex items-center justify-between w-full"
        >
          <h3 className="font-bold text-gray-900">עלויות נלוות לחישוב</h3>
          <span className="text-gray-400 text-lg">{state.showClosingCosts ? '▲' : '▼'}</span>
        </button>
        {state.showClosingCosts && (
          <div className="mt-4 space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">אגרת עו"ד (%)</label>
                <div className="flex items-center gap-3">
                  <input type="range" min={0.3} max={1.5} step={0.05}
                    value={state.lawyerFeePercent}
                    onChange={(e) => onChange({ ...state, lawyerFeePercent: Number(e.target.value) })}
                    className="flex-1 accent-blue-600"
                  />
                  <span className="text-sm w-12 text-left">{state.lawyerFeePercent.toFixed(2)}%</span>
                </div>
                <p className="text-xs text-gray-400 mt-1">= {formatCurrency((state.lawyerFeePercent / 100) * state.totalAmount)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">אגרת שמאי (₪)</label>
                <input type="number" value={state.appraiserFee}
                  onChange={(e) => onChange({ ...state, appraiserFee: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">אגרת פתיחה בבנק (%)</label>
                <div className="flex items-center gap-3">
                  <input type="range" min={0.1} max={0.75} step={0.025}
                    value={state.bankOpeningFeePercent}
                    onChange={(e) => onChange({ ...state, bankOpeningFeePercent: Number(e.target.value) })}
                    className="flex-1 accent-blue-600"
                  />
                  <span className="text-sm w-12 text-left">{state.bankOpeningFeePercent.toFixed(3)}%</span>
                </div>
                <p className="text-xs text-gray-400 mt-1">= {formatCurrency((state.bankOpeningFeePercent / 100) * state.totalAmount)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ביטוח חיים (%/שנה)</label>
                <div className="flex items-center gap-3">
                  <input type="range" min={0.03} max={0.20} step={0.005}
                    value={state.lifeInsurancePercent}
                    onChange={(e) => onChange({ ...state, lifeInsurancePercent: Number(e.target.value) })}
                    className="flex-1 accent-blue-600"
                  />
                  <span className="text-sm w-14 text-left">{state.lifeInsurancePercent.toFixed(3)}%</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ביטוח מבנה (₪/שנה)</label>
                <div className="flex items-center gap-3">
                  <input type="range" min={400} max={2000} step={50}
                    value={state.buildingInsuranceAnnual}
                    onChange={(e) => onChange({ ...state, buildingInsuranceAnnual: Number(e.target.value) })}
                    className="flex-1 accent-blue-600"
                  />
                  <span className="text-sm w-20 text-left">{formatCurrency(state.buildingInsuranceAnnual)}</span>
                </div>
              </div>
            </div>
            {closingCosts && (
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mt-2">
                <h4 className="font-bold text-gray-800 mb-3 text-sm">סיכום עלויות נלוות</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between"><span className="text-gray-600">אגרת עו"ד</span><span className="font-medium">{formatCurrency(closingCosts.lawyerFeeAmount)}</span></div>
                  <div className="flex justify-between"><span className="text-gray-600">אגרת שמאי</span><span className="font-medium">{formatCurrency(closingCosts.appraiserFee)}</span></div>
                  <div className="flex justify-between"><span className="text-gray-600">אגרת פתיחה בבנק</span><span className="font-medium">{formatCurrency(closingCosts.bankOpeningFeeAmount)}</span></div>
                  <div className="flex justify-between border-t pt-1 font-bold"><span>סה"כ עלויות חד-פעמיות</span><span className="text-red-700">{formatCurrency(closingCosts.totalClosingCosts)}</span></div>
                  <div className="flex justify-between mt-1"><span className="text-gray-600">ביטוח חיים (שנתי)</span><span className="font-medium">{formatCurrency(closingCosts.lifeInsuranceAnnual)}</span></div>
                  <div className="flex justify-between"><span className="text-gray-600">ביטוח מבנה (שנתי)</span><span className="font-medium">{formatCurrency(closingCosts.buildingInsuranceAnnual)}</span></div>
                  <div className="flex justify-between border-t pt-1 font-bold"><span>סה"כ ביטוח שנתי</span><span className="text-amber-700">{formatCurrency(closingCosts.totalAnnualInsurance)}</span></div>
                </div>
              </div>
            )}
          </div>
        )}
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
  maxTermYears?: number;
  onChange: (t: OptimizerTrack[]) => void;
  onNext: () => void;
}

function TracksTab({ tracks, defaultTermYears, maxTermYears, onChange, onNext }: TracksTabProps) {
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
        // הגבל תקופה למקסימום אם הוגדר
        if (field === 'termYears' && maxTermYears && (value as number) > maxTermYears) {
          updated.termYears = maxTermYears;
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
        termYears: maxTermYears ? Math.min(defaultTermYears, maxTermYears) : defaultTermYears,
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
  const hasLinked = hasInflationRelevance(tracks);

  return (
    <div className="space-y-5">
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
        <p className="text-sm text-amber-800">
          <strong>הוסף/ערוך עד 5 מסלולים.</strong> בנק ישראל מחייב לפחות 33% בריבית קבועה
          (קל"צ או צמוד מדד). האופטימייזר ידאג לכך אוטומטית.
        </p>
        {!hasLinked && (
          <p className="text-sm text-green-800 mt-1">
            <strong>ניתוח אינפלציה:</strong> אין מסלולים צמודים — ניתוח אינפלציה יוסתר מהתוצאות.
          </p>
        )}
        {(maxTermYears ?? 0) > 0 && (
          <p className="text-sm text-blue-800 mt-1">
            <strong>מגבלת תקופה:</strong> מקסימום {maxTermYears} שנים לכל המסלולים.
          </p>
        )}
      </div>

      {tracks.map((track, i) => {
        const color = TRACK_COLORS_LIST[i % TRACK_COLORS_LIST.length];
        const effectiveTerm = maxTermYears && maxTermYears > 0 ? Math.min(track.termYears, maxTermYears) : track.termYears;
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
                onChange={(v) => updateTrack(track.id, 'termYears', maxTermYears && maxTermYears > 0 ? Math.min(v, maxTermYears) : v)}
                min={1}
                max={maxTermYears && maxTermYears > 0 ? maxTermYears : 30}
                step={1}
                error={maxTermYears && maxTermYears > 0 && track.termYears > maxTermYears ? `מעל מגבלת ${maxTermYears} שנים` : undefined}
              />
            </div>

            {/* V3: גרייס */}
            <div className="pt-2 border-t border-gray-100">
              <label className="block text-xs font-medium text-gray-600 mb-1">
                תקופת גרייס (חודשים): <strong>{track.gracePeriodMonths ?? 0}</strong>
              </label>
              <input
                type="range"
                min={0}
                max={60}
                step={1}
                value={track.gracePeriodMonths ?? 0}
                onChange={(e) => updateTrack(track.id, 'gracePeriodMonths', Number(e.target.value))}
                className="w-full accent-blue-600"
              />
              {(track.gracePeriodMonths ?? 0) > 0 && (() => {
                const grace = calculateMonthlyPaymentWithGrace(1_000_000, track.rate, effectiveTerm, track.gracePeriodMonths ?? 0);
                return (
                  <p className="text-xs text-blue-700 mt-1">
                    בגרייס: {formatCurrency(grace.duringGrace)}/חודש | אחרי גרייס: {formatCurrency(grace.afterGrace)}/חודש (ל-1M ₪)
                  </p>
                );
              })()}
              {(track.gracePeriodMonths ?? 0) === 0 && (
                <p className="text-xs text-gray-400 mt-1">0 = ללא גרייס (שפיצר רגיל)</p>
              )}
            </div>

            <div className="flex items-center justify-between text-xs text-gray-500 pt-1 border-t border-gray-100">
              <span>
                סיכון: <strong>{TRACK_RISK_LABELS[track.type]}</strong>
              </span>
              <span>
                תשלום ל-1M: {formatCurrency(calculateMonthlyPayment(1_000_000, track.rate, effectiveTerm))}/חודש
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
// טאב 3: מטרה ואילוצים + פירעונות מוקדמים
// ============================================================

interface ObjectiveTabProps {
  objective: OptimizationObjective;
  constraints: OptimizerConstraints;
  riskAversion: number;
  prepayments: PrepaymentPlan[];
  tracks: OptimizerTrack[];
  onObjectiveChange: (o: OptimizationObjective) => void;
  onConstraintsChange: (c: OptimizerConstraints) => void;
  onRiskAversionChange: (v: number) => void;
  onPrepaymentsChange: (pp: PrepaymentPlan[]) => void;
  onRun: () => void;
  isRunning: boolean;
}

function ObjectiveTab({
  objective,
  constraints,
  riskAversion,
  prepayments,
  tracks,
  onObjectiveChange,
  onConstraintsChange,
  onRiskAversionChange,
  onPrepaymentsChange,
  onRun,
  isRunning,
}: ObjectiveTabProps) {
  function updC<K extends keyof OptimizerConstraints>(field: K, value: OptimizerConstraints[K]) {
    onConstraintsChange({ ...constraints, [field]: value });
  }

  function addPrepayment() {
    const newPP: PrepaymentPlan = {
      id: newPrepaymentId(),
      yearNumber: 5,
      amount: 100_000,
      trackId: 'auto',
      description: 'פירעון מוקדם',
    };
    onPrepaymentsChange([...prepayments, newPP]);
  }

  function updatePrepayment(id: string, field: keyof PrepaymentPlan, value: unknown) {
    onPrepaymentsChange(prepayments.map((p) => p.id === id ? { ...p, [field]: value } : p));
  }

  function removePrepayment(id: string) {
    onPrepaymentsChange(prepayments.filter((p) => p.id !== id));
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

      {/* תכנון פירעונות מוקדמים */}
      <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
        <h3 className="font-bold text-gray-900 mb-2">תכנון פירעונות מוקדמים</h3>
        <p className="text-xs text-gray-500 mb-4">
          הוסף פירעונות מוקדמים מתוכננים (ירושה, קרן השתלמות, בונוס). המחשבון יחשב חיסכון בריבית ותאריך סיום מוקדם.
        </p>

        <div className="space-y-3">
          {prepayments.map((pp, idx) => (
            <div key={pp.id} className="border border-gray-200 rounded-xl p-4 bg-gray-50 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-700 text-sm">פירעון {idx + 1}</span>
                <button
                  type="button"
                  onClick={() => removePrepayment(pp.id)}
                  className="text-red-500 hover:text-red-700 text-xs"
                >
                  הסר
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">תיאור</label>
                  <input
                    type="text"
                    value={pp.description}
                    onChange={(e) => updatePrepayment(pp.id, 'description', e.target.value)}
                    placeholder="קרן השתלמות, ירושה..."
                    className="w-full px-2 py-1.5 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">בשנה מספר</label>
                  <input
                    type="number"
                    value={pp.yearNumber}
                    min={1} max={30}
                    onChange={(e) => updatePrepayment(pp.id, 'yearNumber', Number(e.target.value))}
                    className="w-full px-2 py-1.5 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">סכום (₪)</label>
                  <input
                    type="number"
                    value={pp.amount}
                    min={10000} step={10000}
                    onChange={(e) => updatePrepayment(pp.id, 'amount', Number(e.target.value))}
                    className="w-full px-2 py-1.5 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">החל על מסלול</label>
                  <select
                    value={pp.trackId}
                    onChange={(e) => updatePrepayment(pp.id, 'trackId', e.target.value)}
                    className="w-full px-2 py-1.5 border border-gray-300 rounded-lg text-sm"
                  >
                    <option value="auto">אוטומטי (ריבית גבוהה)</option>
                    {tracks.map((t) => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={addPrepayment}
          className="w-full mt-3 py-2.5 border-2 border-dashed border-green-300 rounded-xl text-green-600 hover:border-green-500 hover:bg-green-50 transition font-medium text-sm"
        >
          + הוסף פירעון מוקדם
        </button>

        {prepayments.length > 0 && (
          <p className="text-xs text-gray-500 mt-2">
            סה"כ פירעונות מתוכננים: {formatCurrency(prepayments.reduce((s, p) => s + p.amount, 0))}
          </p>
        )}
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
  tracks: OptimizerTrack[];
  prepayments: PrepaymentPlan[];
  threeOptions?: ThreeOptionsResult;
  maxMonthlyPayment?: number;
  dti?: DTIInfo;
  closingCosts?: ClosingCosts;
}

function ResultsTab({ result, totalAmount, tracks, prepayments, threeOptions, maxMonthlyPayment, dti, closingCosts }: ResultsTabProps) {
  const { optimal, alternatives, bankProposal, defaultMixResult, savingsVsDefault, savingsVsBank } = result;
  const [selectedOption, setSelectedOption] = useState<'lowestMonthly' | 'balanced' | 'lowestCost' | null>(null);
  const showInflation = hasInflationRelevance(tracks);

  // פירעונות מוקדמים
  const hasPrepayments = prepayments.length > 0;
  const prepayoffResult = useMemo(() => {
    if (!hasPrepayments) return null;
    return calculateStagedPayoffForMix(optimal, tracks, prepayments, true);
  }, [optimal, tracks, prepayments, hasPrepayments]);

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

  const exceedsBudget = maxMonthlyPayment && maxMonthlyPayment > 0 && optimal.monthlyPayment > maxMonthlyPayment;

  return (
    <div className="space-y-6">

      {/* 3 אפשרויות — HERO SECTION */}
      {threeOptions && (
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-200 rounded-xl p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-2">3 אפשרויות להשוואה</h3>
          <p className="text-sm text-gray-500 mb-5">בחר את האפשרות שמתאימה לצרכים שלך</p>
          <div className="grid md:grid-cols-3 gap-4">
            <ThreeOptionCard
              option={threeOptions.lowestMonthly}
              onSelect={() => setSelectedOption(selectedOption === 'lowestMonthly' ? null : 'lowestMonthly')}
              isSelected={selectedOption === 'lowestMonthly'}
              showInflation={showInflation}
              totalAmount={totalAmount}
            />
            <ThreeOptionCard
              option={threeOptions.balanced}
              onSelect={() => setSelectedOption(selectedOption === 'balanced' ? null : 'balanced')}
              isSelected={selectedOption === 'balanced'}
              showInflation={showInflation}
              totalAmount={totalAmount}
            />
            <ThreeOptionCard
              option={threeOptions.lowestCost}
              onSelect={() => setSelectedOption(selectedOption === 'lowestCost' ? null : 'lowestCost')}
              isSelected={selectedOption === 'lowestCost'}
              showInflation={showInflation}
              totalAmount={totalAmount}
            />
          </div>

          {/* השוואה מהירה */}
          <div className="mt-4 bg-white rounded-xl border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="text-right py-2 px-3 font-medium text-gray-600">מדד</th>
                  <th className="text-center py-2 px-2 font-medium text-blue-700">תשלום מינימלי</th>
                  <th className="text-center py-2 px-2 font-medium text-purple-700">מאוזן</th>
                  <th className="text-center py-2 px-2 font-medium text-green-700">עלות מינימלית</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-2 px-3 text-gray-600">תשלום חודשי</td>
                  <td className="py-2 px-2 text-center font-bold text-blue-700">{formatCurrency(threeOptions.lowestMonthly.monthlyPayment)}</td>
                  <td className="py-2 px-2 text-center font-bold text-purple-700">{formatCurrency(threeOptions.balanced.monthlyPayment)}</td>
                  <td className="py-2 px-2 text-center font-bold text-green-700">{formatCurrency(threeOptions.lowestCost.monthlyPayment)}</td>
                </tr>
                <tr className="border-b bg-gray-50">
                  <td className="py-2 px-3 text-gray-600">סה"כ ריבית</td>
                  <td className="py-2 px-2 text-center text-blue-700">{formatCurrency(threeOptions.lowestMonthly.totalCost)}</td>
                  <td className="py-2 px-2 text-center text-purple-700">{formatCurrency(threeOptions.balanced.totalCost)}</td>
                  <td className="py-2 px-2 text-center text-green-700 font-bold">{formatCurrency(threeOptions.lowestCost.totalCost)}</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 px-3 text-gray-600">סה"כ תשלומים</td>
                  <td className="py-2 px-2 text-center text-blue-700">{formatCurrency(threeOptions.lowestMonthly.totalPayments)}</td>
                  <td className="py-2 px-2 text-center text-purple-700">{formatCurrency(threeOptions.balanced.totalPayments)}</td>
                  <td className="py-2 px-2 text-center text-green-700">{formatCurrency(threeOptions.lowestCost.totalPayments)}</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 text-gray-600">ציון סיכון</td>
                  <td className="py-2 px-2 text-center text-blue-700">{threeOptions.lowestMonthly.riskScore}/100</td>
                  <td className="py-2 px-2 text-center text-purple-700">{threeOptions.balanced.riskScore}/100</td>
                  <td className="py-2 px-2 text-center text-green-700">{threeOptions.lowestCost.riskScore}/100</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* DTI */}
      {dti && dti.netIncome > 0 && (
        <div className="bg-white border-2 border-gray-200 rounded-xl p-5">
          <h4 className="font-bold text-gray-900 mb-3">בדיקת יחס החזר-הכנסה (DTI)</h4>
          <DTIBadge dti={dti} />
        </div>
      )}

      {/* אזהרת תקציב */}
      {exceedsBudget && (
        <div className="bg-red-50 border-2 border-red-300 rounded-xl p-5">
          <p className="font-bold text-red-800 mb-1">חריגה מתקציב!</p>
          <p className="text-sm text-red-700">
            התשלום החודשי האופטימלי ({formatCurrency(optimal.monthlyPayment)}) חורג מהמגבלה שהגדרת ({formatCurrency(maxMonthlyPayment!)}).
            שקול להאריך את תקופת ההלוואה או להפחית את הסכום.
          </p>
          {tracks.length > 0 && (
            <p className="text-xs text-red-600 mt-2">
              לתשלום של עד {formatCurrency(maxMonthlyPayment!)}/חודש על {formatCurrency(totalAmount)}, נדרשת תקופה של לפחות{' '}
              {Math.ceil(-Math.log(1 - (totalAmount * (4.0 / 100 / 12)) / maxMonthlyPayment!) / Math.log(1 + 4.0 / 100 / 12) / 12)} שנים (בריבית ממוצעת ~4%).
            </p>
          )}
        </div>
      )}

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
            {showInflation && optimal.indexedPercent > 0 && (
              <div className="bg-white rounded-xl p-4 border border-yellow-200">
                <p className="text-xs text-gray-500 mb-1">% צמוד מדד (חשיפת אינפלציה)</p>
                <p className="text-2xl font-bold text-yellow-700">{Math.round(optimal.indexedPercent * 100)}%</p>
              </div>
            )}
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

      {/* פירעונות מוקדמים */}
      {hasPrepayments && prepayoffResult && (
        <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6">
          <h3 className="text-lg font-bold text-green-900 mb-4">השפעת פירעונות מוקדמים</h3>
          <div className="grid sm:grid-cols-3 gap-4 mb-4">
            <div className="bg-white rounded-xl p-4 text-center border border-green-200">
              <p className="text-xs text-gray-500 mb-1">חיסכון בריבית</p>
              <p className="text-2xl font-bold text-green-700">{formatCurrency(prepayoffResult.totalInterestSaved)}</p>
            </div>
            <div className="bg-white rounded-xl p-4 text-center border border-green-200">
              <p className="text-xs text-gray-500 mb-1">ריבית ללא פירעונות</p>
              <p className="text-xl font-bold text-gray-700">{formatCurrency(prepayoffResult.totalOriginalInterest)}</p>
            </div>
            <div className="bg-white rounded-xl p-4 text-center border border-green-200">
              <p className="text-xs text-gray-500 mb-1">ריבית עם פירעונות</p>
              <p className="text-xl font-bold text-green-700">{formatCurrency(prepayoffResult.totalNewInterest)}</p>
            </div>
          </div>

          {/* גרף השוואה */}
          {prepayoffResult.comparisonSeries.length > 0 && (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={prepayoffResult.comparisonSeries.filter((_, i) => i % 2 === 0 || prepayoffResult.comparisonSeries.length <= 15)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" tickFormatter={(v) => `שנה ${v}`} tick={{ fontSize: 10 }} />
                  <YAxis tickFormatter={(v) => `${Math.round(v / 1000)}K`} tick={{ fontSize: 10 }} />
                  <Tooltip formatter={(v) => formatCurrency(Number(v))} />
                  <Legend />
                  <Bar dataKey="withoutPrepayment" name="ללא פירעונות" fill="#94a3b8" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="withPrepayment" name="עם פירעונות" fill="#10b981" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* אירועי פירעון */}
          {prepayoffResult.trackResults.some((r) => r.prepaymentEvents.length > 0) && (
            <div className="mt-4">
              <h4 className="font-bold text-green-800 mb-2 text-sm">אירועי פירעון</h4>
              <div className="space-y-2">
                {prepayoffResult.trackResults.flatMap((r) =>
                  r.prepaymentEvents.map((ev, i) => (
                    <div key={`${r.trackId}-${i}`} className="bg-white rounded-lg p-3 border border-green-100 text-sm">
                      <span className="font-medium text-green-700">שנה {ev.year} — {r.trackName}: </span>
                      <span>פירעון {formatCurrency(ev.amount)} | יתרה {formatCurrency(ev.balanceBefore)} ← {formatCurrency(ev.balanceAfter)}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* עלויות נלוות */}
      {closingCosts && (
        <div className="bg-white border-2 border-gray-200 rounded-xl p-5">
          <h4 className="font-bold text-gray-900 mb-3">ALL-IN Cost — עלות כוללת כולל הוצאות נלוות</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-gray-600">סה"כ קרן</span><span className="font-medium">{formatCurrency(totalAmount)}</span></div>
            <div className="flex justify-between"><span className="text-gray-600">סה"כ ריבית</span><span className="font-medium text-amber-700">{formatCurrency(optimal.totalCost)}</span></div>
            <div className="flex justify-between"><span className="text-gray-600">עלויות חד-פעמיות</span><span className="font-medium text-red-600">{formatCurrency(closingCosts.totalClosingCosts)}</span></div>
            <div className="flex justify-between border-t pt-2 font-bold text-base">
              <span>ALL-IN סה"כ</span>
              <span className="text-red-700">{formatCurrency(totalAmount + optimal.totalCost + closingCosts.totalClosingCosts)}</span>
            </div>
            <div className="flex justify-between text-xs text-gray-500"><span>ביטוח שנתי (ממוצע)</span><span>{formatCurrency(closingCosts.totalAnnualInsurance)}/שנה</span></div>
          </div>
        </div>
      )}

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
                showInflation={showInflation}
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
          ...(showInflation && optimal.indexedPercent > 0 ? [{ label: '% צמוד מדד', value: `${Math.round(optimal.indexedPercent * 100)}%` }] : []),
          { label: 'סה"כ תשלומים', value: formatCurrency(optimal.totalPayments), bold: true },
          { label: 'ריבית ממוצעת', value: `${optimal.weightedAvgRate.toFixed(2)}%` },
          { label: 'ציון סיכון', value: `${optimal.riskScore}/100` },
          { label: '% קבוע', value: `${Math.round(optimal.fixedPercent * 100)}%` },
          { label: 'עמידה בתקנות', value: optimal.isRegulationCompliant ? 'כן ✓' : 'לא ✗' },
          ...(hasPrepayments && prepayoffResult ? [
            { label: 'חיסכון עם פירעונות מוקדמים', value: formatCurrency(prepayoffResult.totalInterestSaved) },
          ] : []),
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
  const showInflation = hasInflationRelevance(tracks);

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
        // הצמדה רק אם יש מסלולים צמודים
        if (showInflation && track.isLinked && track.inflationExposure) {
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
    { label: 'בסיס (ריבית כיום)', primeShock: 0, inflation: showInflation ? AVG_INFLATION_ISRAEL : 0, color: '#2563eb' },
    { label: 'ריבית עולה +2%', primeShock: 2, inflation: showInflation ? AVG_INFLATION_ISRAEL : 0, color: '#ef4444' },
    { label: 'ריבית יורדת -2%', primeShock: -2, inflation: showInflation ? AVG_INFLATION_ISRAEL : 0, color: '#10b981' },
    ...(showInflation ? [{ label: 'אינפלציה 4%', primeShock: 0, inflation: 4.0, color: '#f59e0b' }] : []),
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

  // סינון תרחישי אינפלציה אם אין מסלולים צמודים
  const filteredScenarios = showInflation
    ? optimal.scenarios
    : optimal.scenarios.filter((s) => !s.name.includes('אינפלציה') || s.name.includes('אינפלציה 2.5%'));

  return (
    <div className="space-y-6">
      {!showInflation && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">
          <strong>שים לב:</strong> אין מסלולים צמודים בתמהיל — ניתוח אינפלציה מוסתר. ריבית קבועה = עלות ידועה מראש.
        </div>
      )}

      {/* גרף תשלומים לאורך זמן */}
      <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-2">התפתחות תשלום חודשי לאורך זמן</h3>
        <p className="text-sm text-gray-500 mb-4">
          השוואת תשלומים בתרחישי ריבית{showInflation ? ' ואינפלציה' : ''} שונים
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
              {filteredScenarios.map((sc, i) => (
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
// V3: טאב מבחן עמידות
// ============================================================

interface StressTestTabProps {
  monthlyIncome: number;
  monthlyPayment: number;
}

function StressTestTab({ monthlyIncome, monthlyPayment }: StressTestTabProps) {
  if (monthlyIncome <= 0 || monthlyPayment <= 0) {
    return (
      <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-12 text-center">
        <p className="text-gray-500 text-lg mb-2">הזן הכנסה חודשית בטאב הגדרות</p>
        <p className="text-gray-400 text-sm">ואחרי הרצת האופטימייזר תראה את מבחן העמידות</p>
      </div>
    );
  }

  const results = runIncomeStressTest(monthlyIncome, monthlyPayment);

  const chartData = results.map((r) => ({
    name: r.label,
    dti: Math.round(r.newDTIPercent),
    income: Math.round(r.newMonthlyIncome),
  }));

  return (
    <div className="space-y-6" dir="rtl">
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
        <h3 className="font-bold text-blue-900 text-lg mb-1">מבחן עמידות — Income Stress Test</h3>
        <p className="text-sm text-blue-700">
          מדמה 4 תרחישי ירידה בהכנסה. הבנק בוחן תרחישים דומים לפני אישור משכנתא.
          DTI מעל 55% בתרחיש קיצוני = אזהרה אדומה.
        </p>
      </div>

      {/* Bar Chart */}
      <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">יחס החזר לפי תרחיש (%)</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" domain={[0, 80]} tickFormatter={(v) => `${v}%`} tick={{ fontSize: 11 }} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={120} />
              <Tooltip formatter={(v) => `${v}%`} />
              <ReferenceLine x={40} stroke="#f59e0b" strokeDasharray="5 5" label={{ value: '40%', position: 'top', fontSize: 10 }} />
              <ReferenceLine x={55} stroke="#ef4444" strokeDasharray="5 5" label={{ value: '55%', position: 'top', fontSize: 10 }} />
              <Bar dataKey="dti" name="DTI (%)" radius={[0, 4, 4, 0]}>
                {results.map((r, idx) => (
                  <Cell
                    key={idx}
                    fill={r.status === 'green' ? '#10b981' : r.status === 'amber' ? '#f59e0b' : '#ef4444'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
          <div className="flex items-center gap-1"><div className="w-3 h-3 bg-green-500 rounded" />עד 40% — נוח</div>
          <div className="flex items-center gap-1"><div className="w-3 h-3 bg-amber-500 rounded" />40%-55% — מאתגר</div>
          <div className="flex items-center gap-1"><div className="w-3 h-3 bg-red-500 rounded" />מעל 55% — בעייתי</div>
        </div>
      </div>

      {/* כרטיסי תרחישים */}
      <div className="grid sm:grid-cols-2 gap-4">
        {results.map((r) => {
          const cardBg = r.status === 'green' ? 'bg-green-50 border-green-200' :
                         r.status === 'amber' ? 'bg-amber-50 border-amber-200' : 'bg-red-50 border-red-200';
          const textColor = r.status === 'green' ? 'text-green-800' :
                            r.status === 'amber' ? 'text-amber-800' : 'text-red-800';
          return (
            <div key={r.scenarioId} className={`border-2 rounded-xl p-4 ${cardBg}`}>
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className={`font-bold text-sm ${textColor}`}>{r.label}</h4>
                  <p className="text-xs text-gray-500 mt-0.5">{r.description}</p>
                </div>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                  r.status === 'green' ? 'bg-green-200 text-green-800' :
                  r.status === 'amber' ? 'bg-amber-200 text-amber-800' : 'bg-red-200 text-red-800'
                }`}>{r.statusLabel}</span>
              </div>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-600">הכנסה חדשה</span>
                  <span className="font-medium">{formatCurrency(r.newMonthlyIncome)}/חודש</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">תשלום משכנתא</span>
                  <span className="font-medium">{formatCurrency(r.monthlyPayment)}/חודש</span>
                </div>
                <div className="flex justify-between border-t pt-1">
                  <span className="font-medium text-gray-700">DTI</span>
                  <span className={`font-bold text-lg ${textColor}`}>{r.newDTIPercent.toFixed(0)}%</span>
                </div>
              </div>
              <p className="mt-2 text-xs text-gray-700 leading-relaxed">{r.recommendation}</p>
            </div>
          );
        })}
      </div>

      {/* המלצה */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
        <h4 className="font-bold text-blue-900 mb-2">איך להתכונן לתרחישי קיצון?</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• שמור רזרבה של 6 חודשי תשלומים בפיקדון נזיל</li>
          <li>• שקול ביטוח חיים ו/או ביטוח אובדן כושר עבודה</li>
          <li>• אם DTI מעל 45% בבסיס — שקול הקטנת הסכום או הארכת התקופה</li>
          <li>• פריים + ריבית קבועה מגן חלקי: אם פריים יורד, התשלום יורד</li>
        </ul>
      </div>
    </div>
  );
}

// ============================================================
// V3: טאב השוואת בנקים
// ============================================================

let offerIdCounter = 0;
function newOfferId() { return `offer-${++offerIdCounter}`; }

interface BankCompTabProps {
  loanAmount: number;
  baseTracks: OptimizerTrack[];
  defaultTermYears: number;
  constraints: OptimizerConstraints;
}

function BankCompTab({ loanAmount, baseTracks, defaultTermYears, constraints }: BankCompTabProps) {
  const [offers, setOffers] = useState<(BankOffer & { id: string })[]>([
    {
      id: newOfferId(),
      bankName: 'בנק א\'',
      rates: baseTracks.map((t) => ({ trackType: t.type, rate: t.rate })),
      openingFee: 3_750,
      openingFeeIsPercent: false,
      notes: '',
    },
  ]);

  function addOffer() {
    if (offers.length >= 5) return;
    setOffers([...offers, {
      id: newOfferId(),
      bankName: `בנק ${String.fromCharCode(0x05D0 + offers.length)}`,
      rates: baseTracks.map((t) => ({ trackType: t.type, rate: t.rate })),
      openingFee: 3_750,
      openingFeeIsPercent: false,
      notes: '',
    }]);
  }

  function removeOffer(id: string) {
    setOffers(offers.filter((o) => o.id !== id));
  }

  function updateOffer(id: string, field: keyof BankOffer, value: unknown) {
    setOffers(offers.map((o) => o.id === id ? { ...o, [field]: value } : o));
  }

  function updateOfferRate(id: string, trackType: OptimizerTrackType, rate: number) {
    setOffers(offers.map((o) => {
      if (o.id !== id) return o;
      const rates = o.rates.map((r) => r.trackType === trackType ? { ...r, rate } : r);
      return { ...o, rates };
    }));
  }

  const ranked: RankedOffer[] = useMemo(() => {
    if (offers.length === 0 || loanAmount <= 0) return [];
    try {
      return compareBankOffers(offers, loanAmount, baseTracks, defaultTermYears, constraints);
    } catch {
      return [];
    }
  }, [offers, loanAmount, baseTracks, defaultTermYears, constraints]);

  const chartData = ranked.map((r) => ({
    name: r.offer.bankName,
    'ריבית כוללת': Math.round(r.totalInterest),
    'אגרת פתיחה': Math.round(r.openingFeeAmount),
    'עלות ALL-IN': Math.round(r.totalAllInCost),
  }));

  return (
    <div className="space-y-6" dir="rtl">
      <div className="bg-purple-50 border border-purple-200 rounded-xl p-5">
        <h3 className="font-bold text-purple-900 text-lg mb-1">השוואת הצעות בנקים</h3>
        <p className="text-sm text-purple-700">
          הזן עד 5 הצעות מבנקים שונים עם הריביות שקיבלת. המחשבון ימצא את התמהיל האופטימלי לכל בנק ויציג השוואה מלאה.
        </p>
      </div>

      {/* הצעות */}
      <div className="space-y-4">
        {offers.map((offer, idx) => (
          <div key={offer.id} className={`bg-white border-2 rounded-xl p-5 ${
            ranked.find((r) => r.offer.bankName === offer.bankName)?.isBest ? 'border-green-400' : 'border-gray-200'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <input
                type="text"
                value={offer.bankName}
                onChange={(e) => updateOffer(offer.id, 'bankName', e.target.value)}
                className="font-bold text-gray-900 bg-transparent border-b border-dashed border-gray-300 focus:border-blue-500 focus:outline-none text-base"
                placeholder="שם הבנק"
              />
              <div className="flex items-center gap-2">
                {ranked.find((r) => r.offer.bankName === offer.bankName)?.isBest && (
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full font-bold">הטוב ביותר</span>
                )}
                {offers.length > 1 && (
                  <button type="button" onClick={() => removeOffer(offer.id)} className="text-red-500 text-xs hover:text-red-700">הסר</button>
                )}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              {baseTracks.map((track) => {
                const offerRate = offer.rates.find((r) => r.trackType === track.type);
                return (
                  <div key={track.type}>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      ריבית {TRACK_TYPE_LABELS[track.type]} (%)
                    </label>
                    <input
                      type="number"
                      step={0.1}
                      min={0}
                      max={15}
                      value={offerRate?.rate ?? track.rate}
                      onChange={(e) => updateOfferRate(offer.id, track.type, Number(e.target.value))}
                      className="w-full px-2 py-1.5 border border-gray-300 rounded-lg text-sm"
                    />
                  </div>
                );
              })}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">אגרת פתיחה (₪)</label>
                <input
                  type="number"
                  step={500}
                  min={0}
                  value={offer.openingFee}
                  onChange={(e) => updateOffer(offer.id, 'openingFee', Number(e.target.value))}
                  className="w-full px-2 py-1.5 border border-gray-300 rounded-lg text-sm"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {offers.length < 5 && (
        <button
          type="button"
          onClick={addOffer}
          className="w-full py-3 border-2 border-dashed border-purple-300 rounded-xl text-purple-600 hover:border-purple-500 hover:bg-purple-50 transition font-medium"
        >
          + הוסף הצעת בנק (עד 5)
        </button>
      )}

      {/* תוצאות */}
      {ranked.length > 0 && (
        <>
          <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">השוואה גרפית — עלות ALL-IN</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tickFormatter={(v) => `${Math.round(v / 1000)}K`} tick={{ fontSize: 11 }} />
                  <Tooltip formatter={(v) => formatCurrency(Number(v))} />
                  <Legend />
                  <Bar dataKey="ריבית כוללת" fill="#ef4444" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="אגרת פתיחה" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* טבלת דירוג */}
          <div className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="text-right py-2 px-3 font-medium text-gray-600">דירוג</th>
                  <th className="text-right py-2 px-3 font-medium text-gray-600">בנק</th>
                  <th className="text-center py-2 px-2 font-medium text-gray-600">ריבית כוללת</th>
                  <th className="text-center py-2 px-2 font-medium text-gray-600">אגרת פתיחה</th>
                  <th className="text-center py-2 px-2 font-medium text-gray-600">ALL-IN</th>
                  <th className="text-center py-2 px-2 font-medium text-gray-600">יקר יותר ב-</th>
                </tr>
              </thead>
              <tbody>
                {ranked.map((r, idx) => (
                  <tr key={idx} className={`border-b ${r.isBest ? 'bg-green-50' : idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                    <td className="py-2 px-3 text-center">
                      {r.isBest ? (
                        <span className="bg-green-600 text-white text-xs px-2 py-0.5 rounded-full font-bold">1</span>
                      ) : r.rank}
                    </td>
                    <td className="py-2 px-3 font-medium text-gray-900">{r.offer.bankName}</td>
                    <td className="py-2 px-2 text-center text-amber-700">{formatCurrency(r.totalInterest)}</td>
                    <td className="py-2 px-2 text-center text-gray-600">{formatCurrency(r.openingFeeAmount)}</td>
                    <td className="py-2 px-2 text-center font-bold text-red-700">{formatCurrency(r.totalAllInCost)}</td>
                    <td className="py-2 px-2 text-center">
                      {r.isBest ? (
                        <span className="text-green-700 font-bold">הכי זול</span>
                      ) : (
                        <span className="text-red-600">+{formatCurrency(r.savingsVsBest ?? 0)}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

// ============================================================
// V3: טאב לוח זמנים
// ============================================================

function TimelineTab() {
  const [keysDateStr, setKeysDateStr] = useState(() => {
    const d = new Date();
    d.setMonth(d.getMonth() + 3);
    return d.toISOString().split('T')[0];
  });

  const timeline = useMemo(() => {
    const keysDate = new Date(keysDateStr);
    if (isNaN(keysDate.getTime())) return null;
    return calculateTimeline(keysDate);
  }, [keysDateStr]);

  return (
    <div className="space-y-6" dir="rtl">
      <div className="bg-teal-50 border border-teal-200 rounded-xl p-5">
        <h3 className="font-bold text-teal-900 text-lg mb-1">לוח זמנים — מ"אני רוצה" עד "יש לי מפתח"</h3>
        <p className="text-sm text-teal-700">
          תהליך המשכנתא לוקח בממוצע 10-12 שבועות. הזן את תאריך קבלת המפתח המתוכנן ונחשב לך את תאריך ההתחלה.
        </p>
      </div>

      <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          תאריך קבלת מפתח מתוכנן
        </label>
        <input
          type="date"
          value={keysDateStr}
          onChange={(e) => setKeysDateStr(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
          dir="ltr"
        />
        {timeline && (
          <p className="mt-2 text-sm text-gray-600">
            כדי לעמוד בלוח הזמנים הזה, צריך להתחיל ב-{' '}
            <strong className="text-blue-700">{timeline.startDate.toLocaleDateString('he-IL', { day: 'numeric', month: 'long', year: 'numeric' })}</strong>
          </p>
        )}
      </div>

      {timeline && (
        <div className="relative">
          {/* קו ציר */}
          <div className="absolute right-8 top-0 bottom-0 w-0.5 bg-gray-200" />

          <div className="space-y-6">
            {timeline.stages.map((stage, idx) => {
              const isLast = idx === timeline.stages.length - 1;
              const stageColors = [
                'bg-blue-500', 'bg-purple-500', 'bg-indigo-500', 'bg-teal-500',
                'bg-orange-500', 'bg-red-500', 'bg-green-600',
              ];
              const color = stageColors[idx % stageColors.length];

              return (
                <div key={stage.stageNumber} className="flex gap-4 relative">
                  {/* נקודת ציר */}
                  <div className={`w-8 h-8 rounded-full ${color} flex-shrink-0 flex items-center justify-center text-white text-xs font-bold z-10 mt-1`}>
                    {stage.stageNumber}
                  </div>

                  <div className="flex-1 bg-white border-2 border-gray-200 rounded-xl p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <span className="text-xs font-medium text-gray-500">{stage.weekRange}</span>
                        <h4 className="font-bold text-gray-900 text-base">{stage.title}</h4>
                      </div>
                      <div className="text-left text-xs text-gray-500">
                        <div>{stage.formattedStart}</div>
                        {!isLast && <div className="text-gray-400">– {stage.formattedEnd}</div>}
                      </div>
                    </div>
                    <ul className="space-y-1">
                      {stage.tasks.map((task, ti) => (
                        <li key={ti} className="text-sm text-gray-700 flex items-start gap-1.5">
                          <span className={`mt-0.5 w-1.5 h-1.5 rounded-full ${color} flex-shrink-0`} />
                          {task}
                        </li>
                      ))}
                    </ul>
                    {isLast && (
                      <div className="mt-3 bg-green-50 border border-green-200 rounded-lg p-2 text-sm font-bold text-green-800 text-center">
                        קבלת מפתח — {timeline.keysDate.toLocaleDateString('he-IL', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* טיפים */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
        <h4 className="font-bold text-amber-900 mb-2">טיפים חשובים לתהליך</h4>
        <ul className="text-sm text-amber-800 space-y-1">
          <li>• קבל לפחות 3 הצעות מבנקים שונים — זה הכי חשוב לחיסכון</li>
          <li>• אל תחתום על שום דבר לפני שיש לך לפחות 2 הצעות</li>
          <li>• יועץ משכנתאות עצמאי עולה 2,000-5,000 ₪ ויכול לחסוך עשרות אלפי ₪</li>
          <li>• תהליך הטאבו לוקח 30-90 יום — תכנן בהתאם</li>
        </ul>
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
  const [threeOptions, setThreeOptions] = useState<ThreeOptionsResult | null>(null);

  // מצב הגדרות
  const [setupState, setSetupState] = useState<SetupState>({
    totalAmount: 1_500_000,
    defaultTermYears: 25,
    preset: 'standard',
    netIncome: 0,
    maxMonthlyPayment: 0,
    maxTermYears: 0,
    showClosingCosts: false,
    lawyerFeePercent: 0.75,
    appraiserFee: 3500,
    bankOpeningFeePercent: 0.375,
    lifeInsurancePercent: 0.08,
    buildingInsuranceAnnual: 900,
    // V3
    propertyValue: 0,
    applyLTVAdjustment: false,
    familyStatus: 'couple',
    numChildren: 0,
    otherLoanPayments: 0,
    monthlyInsurance: 0,
    showAffordability: false,
  });

  const [tracks, setTracks] = useState<OptimizerTrack[]>(
    DEFAULT_TRACKS_2026.map((t) => ({ ...t, termYears: 25 })),
  );

  const [objective, setObjective] = useState<OptimizationObjective>('balanced');
  const [constraints, setConstraints] = useState<OptimizerConstraints>({ ...DEFAULT_CONSTRAINTS });
  const [riskAversion, setRiskAversion] = useState(0.5);
  const [prepayments, setPrepayments] = useState<PrepaymentPlan[]>([]);

  // DTI חישוב
  const dti = useMemo(() => {
    if (!result || !setupState.netIncome) return undefined;
    return calculateDTI(result.optimal.monthlyPayment, setupState.netIncome);
  }, [result, setupState.netIncome]);

  // עלויות נלוות
  const closingCosts = useMemo(() => {
    if (!setupState.showClosingCosts) return undefined;
    return calculateClosingCosts(setupState.totalAmount, {
      lawyerFeePercent: setupState.lawyerFeePercent,
      appraiserFee: setupState.appraiserFee,
      bankOpeningFeePercent: setupState.bankOpeningFeePercent,
      lifeInsurancePercent: setupState.lifeInsurancePercent,
      buildingInsuranceAnnual: setupState.buildingInsuranceAnnual,
    });
  }, [setupState]);

  // DTI preview בטאב setup (לפני ריצת optimizer)
  const setupDTI = useMemo(() => {
    if (!setupState.netIncome || !setupState.totalAmount) return undefined;
    // הערכה גסה: תשלום על בסיס 4% ריבית
    const estimatedMonthly = calculateMonthlyPayment(setupState.totalAmount, 4.0, setupState.defaultTermYears);
    return calculateDTI(estimatedMonthly, setupState.netIncome);
  }, [setupState.netIncome, setupState.totalAmount, setupState.defaultTermYears]);

  const tabs: { id: TabId; label: string; description: string }[] = [
    { id: 'setup', label: TAB_LABELS.setup, description: 'סכום ופריסטים' },
    { id: 'tracks', label: TAB_LABELS.tracks, description: 'ריביות ותנאים' },
    { id: 'objective', label: TAB_LABELS.objective, description: 'מה לאופטם?' },
    { id: 'results', label: TAB_LABELS.results, description: 'תמהיל אופטימלי' },
    { id: 'scenarios', label: TAB_LABELS.scenarios, description: 'ניתוח סיכון' },
    { id: 'stress', label: TAB_LABELS.stress, description: 'מבחן עמידות' },
    { id: 'bankcomp', label: TAB_LABELS.bankcomp, description: 'השוואת בנקים' },
    { id: 'timeline', label: TAB_LABELS.timeline, description: 'תהליך מ-A ל-Z' },
  ];

  // V3: LTV
  const ltv = useMemo(() => {
    if (!setupState.propertyValue || setupState.propertyValue <= 0) return undefined;
    return setupState.totalAmount / setupState.propertyValue;
  }, [setupState.totalAmount, setupState.propertyValue]);

  // הגבלת תקופת מסלולים לפי maxTermYears + LTV adjustment
  const effectiveTracks = useMemo(() => {
    let t = tracks;
    if (setupState.maxTermYears && setupState.maxTermYears > 0) {
      t = t.map((tr) => ({ ...tr, termYears: Math.min(tr.termYears, setupState.maxTermYears) }));
    }
    // V3: החלת LTV
    if (setupState.applyLTVAdjustment && ltv !== undefined) {
      t = applyLTVAdjustmentToTracks(t, ltv);
    }
    return t;
  }, [tracks, setupState.maxTermYears, setupState.applyLTVAdjustment, ltv]);

  const runOptimizer = useCallback(() => {
    setIsRunning(true);

    setTimeout(() => {
      try {
        const optimizerResult = optimizeMortgage({
          totalAmount: setupState.totalAmount,
          tracks: effectiveTracks,
          objective,
          constraints,
          riskAversion,
        });
        setResult(optimizerResult);

        // חישוב 3 אפשרויות
        const threeOpts = calculateThreeOptions({
          totalAmount: setupState.totalAmount,
          tracks: effectiveTracks,
          objective,
          constraints,
          riskAversion,
        });
        setThreeOptions(threeOpts);

        setActiveTab('results');
      } catch (e) {
        console.error('Optimizer error:', e);
      } finally {
        setIsRunning(false);
      }
    }, 50);
  }, [setupState.totalAmount, effectiveTracks, objective, constraints, riskAversion]);

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
          dti={setupDTI}
          closingCosts={closingCosts}
        />
      )}

      {activeTab === 'tracks' && (
        <TracksTab
          tracks={tracks}
          defaultTermYears={setupState.defaultTermYears}
          maxTermYears={setupState.maxTermYears}
          onChange={setTracks}
          onNext={() => setActiveTab('objective')}
        />
      )}

      {activeTab === 'objective' && (
        <ObjectiveTab
          objective={objective}
          constraints={constraints}
          riskAversion={riskAversion}
          prepayments={prepayments}
          tracks={effectiveTracks}
          onObjectiveChange={setObjective}
          onConstraintsChange={setConstraints}
          onRiskAversionChange={setRiskAversion}
          onPrepaymentsChange={setPrepayments}
          onRun={runOptimizer}
          isRunning={isRunning}
        />
      )}

      {activeTab === 'results' && (
        <>
          {result ? (
            <ResultsTab
              result={result}
              totalAmount={setupState.totalAmount}
              tracks={effectiveTracks}
              prepayments={prepayments}
              threeOptions={threeOptions ?? undefined}
              maxMonthlyPayment={setupState.maxMonthlyPayment || undefined}
              dti={dti}
              closingCosts={closingCosts}
            />
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
              tracks={effectiveTracks}
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

      {activeTab === 'stress' && (
        <StressTestTab
          monthlyIncome={setupState.netIncome}
          monthlyPayment={result?.optimal.monthlyPayment ?? 0}
        />
      )}

      {activeTab === 'bankcomp' && (
        <BankCompTab
          loanAmount={setupState.totalAmount}
          baseTracks={effectiveTracks}
          defaultTermYears={setupState.defaultTermYears}
          constraints={constraints}
        />
      )}

      {activeTab === 'timeline' && (
        <TimelineTab />
      )}
    </div>
  );
}
