'use client';

import { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import {
  calculateComprehensivePension,
  getConversionFactor,
  goalSeekMonthlyContribution,
  PENSION_CONSTANTS_2026,
  type ComprehensivePensionInput,
  type PensionSourceInput,
  type PensionFundType,
  type SpouseOption,
} from '@/lib/calculators/pension';
import { formatCurrency, formatPercent } from '@/lib/utils/formatters';
import { ResultCard } from '@/components/calculator/ResultCard';
import { Breakdown } from '@/components/calculator/Breakdown';
import { PlusCircle, Trash2, ChevronDown, ChevronUp, TrendingUp, Shield, Target, AlertTriangle } from 'lucide-react';

// ============================================================
// קבועים וברירות מחדל
// ============================================================

const FUND_TYPE_LABELS: Record<PensionFundType, string> = {
  comprehensive: 'קרן פנסיה מקיפה',
  managers: 'ביטוח מנהלים',
  provident: 'קופת גמל לתגמולים',
  study_fund: 'קרן השתלמות',
  national_ins: 'ביטוח לאומי',
};

const FUND_TYPE_COLORS: Record<PensionFundType, string> = {
  comprehensive: '#3b82f6',
  managers: '#8b5cf6',
  provident: '#10b981',
  study_fund: '#f59e0b',
  national_ins: '#ef4444',
};

const SOURCE_COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4'];

function makeDefaultSource(id: number): PensionSourceInput {
  return {
    id: `src_${id}`,
    label: `קרן פנסיה ${id}`,
    fundType: 'comprehensive',
    currentBalance: id === 1 ? 200_000 : 0,
    monthlySalary: 18_000,
    employeeContrib: 6,
    employerContrib: 6.5,
    severanceContrib: 8.33,
    managementFeeAccum: 0.3,
    managementFeeContrib: 1.5,
    expectedReturn: 5,
    yearsContributing: 32,
    isActive: true,
  };
}

const DEFAULT_INPUT: ComprehensivePensionInput = {
  currentAge: 35,
  retirementAge: 67,
  gender: 'male',
  maritalStatus: 'married',
  spouseAge: 33,
  inflationRate: 2.5,
  sources: [makeDefaultSource(1)],
  includNationalIns: true,
  nationalInsAmount: PENSION_CONSTANTS_2026.nationalInsurancePension.single,
  studyFundBalance: 50_000,
  studyFundReturn: 5,
  studyFundYearsLeft: 32,
  studyFundMonthlySalary: 18_000,
  studyFundEmployerPct: 7.5,
  studyFundEmployeePct: 2.5,
  spouseOption: '60pct',
  conversionFactor: 0, // אוטומטי
  lumpSumFromSeverance: false,
  targetMonthlyIncome: 14_000,
};

type Tab = 'sources' | 'advanced' | 'goal' | 'tax';
type ChartView = 'accumulation' | 'income' | 'comparison';

// ============================================================
// רכיב בקרת קלט
// ============================================================
function InputRow({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {children}
      {hint && <p className="text-xs text-gray-500 mt-1">{hint}</p>}
    </div>
  );
}

function NumInput({
  value,
  onChange,
  min = 0,
  max,
  step = 1,
  className = '',
}: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
  className?: string;
}) {
  return (
    <input
      type="number"
      value={value}
      min={min}
      max={max}
      step={step}
      onChange={(e) => onChange(Number(e.target.value))}
      className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${className}`}
    />
  );
}

// ============================================================
// כרטיס מקור פנסיה
// ============================================================
function SourceCard({
  source,
  index,
  onChange,
  onRemove,
  canRemove,
}: {
  source: PensionSourceInput;
  index: number;
  onChange: (updated: PensionSourceInput) => void;
  onRemove: () => void;
  canRemove: boolean;
}) {
  const [expanded, setExpanded] = useState(index === 0);

  function upd<K extends keyof PensionSourceInput>(field: K, value: PensionSourceInput[K]) {
    onChange({ ...source, [field]: value });
  }

  const totalContrib =
    source.employeeContrib + source.employerContrib + source.severanceContrib;
  const monthlyTotal = source.monthlySalary * (totalContrib / 100);

  return (
    <div className="border-2 border-gray-200 rounded-xl overflow-hidden">
      {/* כותרת כרטיס */}
      <div
        className="flex items-center justify-between px-4 py-3 bg-gray-50 cursor-pointer hover:bg-gray-100 transition"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: SOURCE_COLORS[index % SOURCE_COLORS.length] }}
          />
          <span className="font-semibold text-gray-800">{source.label}</span>
          <span className="text-xs text-gray-500 bg-gray-200 px-2 py-0.5 rounded-full">
            {FUND_TYPE_LABELS[source.fundType]}
          </span>
          {source.isActive && (
            <span className="text-xs text-green-700 bg-green-100 px-2 py-0.5 rounded-full">פעיל</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">{formatCurrency(monthlyTotal)}/ח</span>
          {canRemove && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onRemove(); }}
              className="text-red-500 hover:text-red-700 transition"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
          {expanded ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
        </div>
      </div>

      {/* תוכן כרטיס */}
      {expanded && (
        <div className="p-4 space-y-4 bg-white">
          <div className="grid grid-cols-2 gap-3">
            <InputRow label="שם / תיאור">
              <input
                type="text"
                value={source.label}
                onChange={(e) => upd('label', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </InputRow>
            <InputRow label="סוג קרן">
              <select
                value={source.fundType}
                onChange={(e) => upd('fundType', e.target.value as PensionFundType)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                {Object.entries(FUND_TYPE_LABELS).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
            </InputRow>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <InputRow label="שכר ברוטו (₪/חודש)">
              <NumInput value={source.monthlySalary} onChange={(v) => upd('monthlySalary', v)} step={500} />
            </InputRow>
            <InputRow label="צבירה נוכחית (₪)" hint="ניתן לבדוק במסלקה">
              <NumInput value={source.currentBalance} onChange={(v) => upd('currentBalance', v)} step={10000} />
            </InputRow>
          </div>

          {/* שיעורי הפרשה */}
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
            <h4 className="text-sm font-semibold text-gray-800 mb-2">שיעורי הפרשה (%)</h4>
            <div className="grid grid-cols-3 gap-2">
              <InputRow label="עובד" hint="חוק: 6-7%">
                <NumInput value={source.employeeContrib} onChange={(v) => upd('employeeContrib', v)} min={0} max={10} step={0.1} />
              </InputRow>
              <InputRow label="מעסיק (קצבה)" hint="חוק: 6.5-7.5%">
                <NumInput value={source.employerContrib} onChange={(v) => upd('employerContrib', v)} min={0} max={10} step={0.1} />
              </InputRow>
              <InputRow label="פיצויים" hint="חוק: 6-8.33%">
                <NumInput value={source.severanceContrib} onChange={(v) => upd('severanceContrib', v)} min={0} max={10} step={0.1} />
              </InputRow>
            </div>
            <div className="mt-2 text-sm font-medium text-blue-800">
              סה&quot;כ: {totalContrib.toFixed(1)}% = {formatCurrency(monthlyTotal)}/חודש
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <InputRow label="תשואה צפויה (% שנתי)" hint="ממוצע קרנות: 4-7%">
              <NumInput value={source.expectedReturn} onChange={(v) => upd('expectedReturn', v)} min={0} max={20} step={0.5} />
            </InputRow>
            <InputRow label="שנות הפקדה נותרות">
              <NumInput value={source.yearsContributing} onChange={(v) => upd('yearsContributing', v)} min={0} max={50} />
            </InputRow>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <InputRow label="דמי ניהול מצבירה (% שנתי)" hint="מקסימום מאושר: 0.5%">
              <NumInput value={source.managementFeeAccum} onChange={(v) => upd('managementFeeAccum', v)} min={0} max={2} step={0.05} />
            </InputRow>
            <InputRow label="דמי ניהול מהפקדה (% חודשי)" hint="מקסימום: 6%">
              <NumInput value={source.managementFeeContrib} onChange={(v) => upd('managementFeeContrib', v)} min={0} max={6} step={0.1} />
            </InputRow>
          </div>

          <div className="flex items-center gap-3 pt-1">
            <input
              type="checkbox"
              id={`active_${source.id}`}
              checked={source.isActive}
              onChange={(e) => upd('isActive', e.target.checked)}
              className="w-4 h-4 text-blue-600"
            />
            <label htmlFor={`active_${source.id}`} className="text-sm text-gray-700">
              קרן פעילה (עדיין מפקיד)
            </label>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// Custom Tooltip לגרפים
// ============================================================
function CustomTooltip({ active, payload, label }: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string | number;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 text-right">
      <p className="text-xs font-semibold text-gray-700 mb-1">גיל {label}</p>
      {payload.map((p, i) => (
        <p key={i} className="text-xs" style={{ color: p.color }}>
          {p.name}: {formatCurrency(p.value)}
        </p>
      ))}
    </div>
  );
}

// ============================================================
// קומפוננטה ראשית
// ============================================================

export function PensionCalculator() {
  const [input, setInput] = useState<ComprehensivePensionInput>(DEFAULT_INPUT);
  const [activeTab, setActiveTab] = useState<Tab>('sources');
  const [chartView, setChartView] = useState<ChartView>('accumulation');
  const [showStudyFund, setShowStudyFund] = useState(true);
  const [sourceCounter, setSourceCounter] = useState(2);

  const result = useMemo(() => calculateComprehensivePension(input), [input]);

  function updateInput<K extends keyof ComprehensivePensionInput>(
    field: K,
    value: ComprehensivePensionInput[K],
  ) {
    setInput((prev) => ({ ...prev, [field]: value }));
  }

  function addSource() {
    const newSrc = makeDefaultSource(sourceCounter);
    newSrc.yearsContributing = Math.max(0, input.retirementAge - input.currentAge);
    setInput((prev) => ({ ...prev, sources: [...prev.sources, newSrc] }));
    setSourceCounter((c) => c + 1);
  }

  function updateSource(idx: number, updated: PensionSourceInput) {
    setInput((prev) => {
      const newSources = [...prev.sources];
      newSources[idx] = updated;
      return { ...prev, sources: newSources };
    });
  }

  function removeSource(idx: number) {
    setInput((prev) => ({
      ...prev,
      sources: prev.sources.filter((_, i) => i !== idx),
    }));
  }

  // נתוני גרף צבירה
  const accChartData = useMemo(() => {
    const INTERVAL = Math.max(1, Math.floor(result.yearsUntilRetirement / 20));
    return result.yearlyData
      .filter((d) => d.year % INTERVAL === 0 || d.year === result.yearsUntilRetirement)
      .map((d) => {
        const row: Record<string, number | string> = { age: d.age };
        input.sources.forEach((s, i) => {
          row[s.label] = d.bySource[s.id] ?? 0;
        });
        row['קרן השתלמות'] = showStudyFund
          ? (result.studyFundFinalBalance * (d.year / Math.max(1, result.yearsUntilRetirement)))
          : 0;
        return row;
      });
  }, [result, input.sources, showStudyFund]);

  // נתוני גרף הכנסה בפרישה
  const incomeChartData = useMemo(() => {
    const data = [];
    if (result.totalMonthlyPension > 0) {
      data.push({ name: 'קצבת פנסיה', value: Math.round(result.totalMonthlyPension), fill: '#3b82f6' });
    }
    if (input.includNationalIns) {
      data.push({ name: 'ביטוח לאומי', value: Math.round(input.nationalInsAmount), fill: '#ef4444' });
    }
    if (showStudyFund && result.studyFundMonthlyEquivalent > 0) {
      data.push({ name: 'קרן השתלמות', value: Math.round(result.studyFundMonthlyEquivalent), fill: '#f59e0b' });
    }
    return data;
  }, [result, input.includNationalIns, input.nationalInsAmount, showStudyFund]);

  // נתוני גרף השוואה (מקדם)
  const comparisonData = useMemo(() => {
    const ages = [60, 62, 65, 67, 68, 70];
    return ages.map((age) => {
      const cf = getConversionFactor(age, false);
      const pension = result.totalFinalBalance > 0 ? Math.round(result.totalFinalBalance / cf) : 0;
      return { age: `גיל ${age}`, מקדם: cf, קצבה: pension };
    });
  }, [result.totalFinalBalance]);

  const autoConvFactor = getConversionFactor(input.retirementAge, false);
  const displayConvFactor = (input.conversionFactor && input.conversionFactor > 0)
    ? input.conversionFactor
    : autoConvFactor;

  // Goal seek
  const goalSeekResult = useMemo(() => {
    if (input.sources.length === 0) return 0;
    return goalSeekMonthlyContribution({
      targetMonthlyPension: input.targetMonthlyIncome,
      conversionFactor: displayConvFactor,
      currentBalance: input.sources.reduce((s, src) => s + src.currentBalance, 0),
      annualReturn: input.sources[0]?.expectedReturn ?? 5,
      yearsUntilRetirement: result.yearsUntilRetirement,
    });
  }, [input, displayConvFactor, result.yearsUntilRetirement]);

  const totalMonthlyIncome =
    result.totalMonthlyPension +
    (input.includNationalIns ? input.nationalInsAmount : 0) +
    (showStudyFund ? result.studyFundMonthlyEquivalent : 0);

  const isOnTrack = totalMonthlyIncome >= input.targetMonthlyIncome;

  // ============================================================
  // טאב: מקורות
  // ============================================================
  function TabSources() {
    return (
      <div className="space-y-4">
        {/* פרטים אישיים */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
          <h3 className="text-md font-semibold text-gray-800 mb-3">פרטים אישיים</h3>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <InputRow label="גיל נוכחי">
              <NumInput
                value={input.currentAge}
                onChange={(v) => updateInput('currentAge', v)}
                min={18} max={80}
              />
            </InputRow>
            <InputRow label="גיל פרישה" hint="גבר: 67, אישה: 65">
              <NumInput
                value={input.retirementAge}
                onChange={(v) => updateInput('retirementAge', v)}
                min={50} max={75}
              />
            </InputRow>
            <InputRow label="מין">
              <select
                value={input.gender}
                onChange={(e) => updateInput('gender', e.target.value as 'male' | 'female')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="male">גבר</option>
                <option value="female">אישה</option>
              </select>
            </InputRow>
            <InputRow label="מצב משפחתי">
              <select
                value={input.maritalStatus}
                onChange={(e) => updateInput('maritalStatus', e.target.value as ComprehensivePensionInput['maritalStatus'])}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="single">רווק/ה</option>
                <option value="married">נשוי/אה</option>
                <option value="divorced">גרוש/ה</option>
                <option value="widowed">אלמן/ה</option>
              </select>
            </InputRow>
          </div>
          <div className="mt-3 text-sm text-blue-700 bg-blue-50 border border-blue-100 rounded p-2">
            זמן עד פרישה: <strong>{result.yearsUntilRetirement} שנים</strong> | מקדם המרה אוטומטי: <strong>{displayConvFactor}</strong>
          </div>
        </div>

        {/* מקורות פנסיה */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-md font-semibold text-gray-800">קרנות פנסיה וחיסכון</h3>
            <button
              type="button"
              onClick={addSource}
              className="flex items-center gap-1.5 text-sm bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition"
            >
              <PlusCircle className="w-4 h-4" />
              הוסף קרן
            </button>
          </div>
          <div className="space-y-3">
            {input.sources.map((src, i) => (
              <SourceCard
                key={src.id}
                source={src}
                index={i}
                onChange={(u) => updateSource(i, u)}
                onRemove={() => removeSource(i)}
                canRemove={input.sources.length > 1}
              />
            ))}
          </div>
        </div>

        {/* קרן השתלמות */}
        <div className="border-2 border-amber-200 rounded-xl overflow-hidden">
          <div
            className="flex items-center justify-between px-4 py-3 bg-amber-50 cursor-pointer"
            onClick={() => setShowStudyFund(!showStudyFund)}
          >
            <span className="font-semibold text-amber-800">קרן השתלמות (חיסכון נלווה)</span>
            {showStudyFund ? <ChevronUp className="w-4 h-4 text-amber-700" /> : <ChevronDown className="w-4 h-4 text-amber-700" />}
          </div>
          {showStudyFund && (
            <div className="p-4 bg-white">
              <div className="grid grid-cols-2 gap-3">
                <InputRow label="צבירה נוכחית (₪)">
                  <NumInput value={input.studyFundBalance} onChange={(v) => updateInput('studyFundBalance', v)} step={5000} />
                </InputRow>
                <InputRow label="תשואה צפויה (%)">
                  <NumInput value={input.studyFundReturn} onChange={(v) => updateInput('studyFundReturn', v)} min={0} max={15} step={0.5} />
                </InputRow>
                <InputRow label="שכר בסיס (%  מעסיק)" hint="מקסימום 7.5%">
                  <NumInput value={input.studyFundEmployerPct} onChange={(v) => updateInput('studyFundEmployerPct', v)} min={0} max={10} step={0.5} />
                </InputRow>
                <InputRow label="הפקדת עובד (%)" hint="מקסימום 2.5%">
                  <NumInput value={input.studyFundEmployeePct} onChange={(v) => updateInput('studyFundEmployeePct', v)} min={0} max={5} step={0.5} />
                </InputRow>
              </div>
              <div className="mt-2 text-sm text-amber-700 bg-amber-50 rounded p-2">
                צפי: <strong>{formatCurrency(result.studyFundFinalBalance)}</strong> | כ-{formatCurrency(result.studyFundMonthlyEquivalent)}/חודש לאורך 20 שנה
              </div>
            </div>
          )}
        </div>

        {/* ב.ל.ל */}
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-center gap-3 mb-3">
            <input
              type="checkbox"
              checked={input.includNationalIns}
              onChange={(e) => updateInput('includNationalIns', e.target.checked)}
              className="w-4 h-4 text-red-600"
              id="inclNI"
            />
            <label htmlFor="inclNI" className="font-semibold text-red-800">כלול קצבת ביטוח לאומי</label>
          </div>
          {input.includNationalIns && (
            <div className="grid grid-cols-2 gap-3">
              <InputRow label="קצבת ב.ל.ל (₪/חודש)" hint="יחיד: ~3,465 | זוג: ~5,090">
                <NumInput
                  value={input.nationalInsAmount}
                  onChange={(v) => updateInput('nationalInsAmount', v)}
                  step={100}
                />
              </InputRow>
              <div className="flex items-end gap-2 pb-1">
                <div className="space-y-1">
                  {Object.entries(PENSION_CONSTANTS_2026.nationalInsurancePension).map(([k, v]) => (
                    <button
                      key={k}
                      type="button"
                      onClick={() => updateInput('nationalInsAmount', v)}
                      className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded hover:bg-red-200 mr-1"
                    >
                      {k === 'single' ? 'יחיד' : k === 'couple' ? 'זוג' : 'דחוי'}: {formatCurrency(v)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ============================================================
  // טאב: הגדרות מתקדמות
  // ============================================================
  function TabAdvanced() {
    return (
      <div className="space-y-5">
        {/* מקדם המרה */}
        <div className="bg-white border-2 border-gray-200 rounded-xl p-4">
          <h3 className="text-md font-semibold text-gray-800 mb-3">מקדם המרה</h3>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <InputRow label="מקדם המרה (0 = אוטומטי)" hint="גיל 67 ≈ 205, גיל 70 ≈ 190">
              <NumInput
                value={input.conversionFactor ?? 0}
                onChange={(v) => updateInput('conversionFactor', v)}
                min={0} max={350}
              />
            </InputRow>
            <InputRow label="אינפלציה שנתית (%)" hint="ממוצע ישראל: 2-3%">
              <NumInput
                value={input.inflationRate}
                onChange={(v) => updateInput('inflationRate', v)}
                min={0} max={10} step={0.5}
              />
            </InputRow>
          </div>

          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-sm font-medium text-gray-700 mb-2">מקדמים לפי גיל:</p>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {Object.entries(PENSION_CONSTANTS_2026.conversionFactors).map(([age, cf]) => (
                <button
                  key={age}
                  type="button"
                  onClick={() => updateInput('conversionFactor', cf)}
                  className={`text-xs rounded px-2 py-1 border transition ${
                    displayConvFactor === cf
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                  }`}
                >
                  גיל {age}:{' '}
                  <span className="font-bold">{cf}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* קצבת שאיר */}
        <div className="bg-white border-2 border-gray-200 rounded-xl p-4">
          <h3 className="text-md font-semibold text-gray-800 mb-3">קצבת שאיר (לאחר פטירת הפנסיונר)</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {(['none', '40pct', '60pct', '100pct'] as SpouseOption[]).map((opt) => {
              const labels: Record<SpouseOption, string> = {
                none: 'ללא שאיר',
                '40pct': '40% לשאיר',
                '60pct': '60% לשאיר (סטנדרט)',
                '100pct': '100% לשאיר',
              };
              const descs: Record<SpouseOption, string> = {
                none: 'קצבה עצמית גבוהה יותר',
                '40pct': 'מקדם מוגדל מעט',
                '60pct': 'סטנדרט ישראלי',
                '100pct': 'מקדם גבוה ביותר',
              };
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => updateInput('spouseOption', opt)}
                  className={`p-3 rounded-lg border-2 text-right transition ${
                    input.spouseOption === opt
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <p className="text-sm font-semibold text-gray-800">{labels[opt]}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{descs[opt]}</p>
                </button>
              );
            })}
          </div>
          {input.spouseOption !== 'none' && (
            <div className="mt-3 text-sm text-blue-700 bg-blue-50 rounded p-2">
              עם מקדם {result.conversionFactorWithSpouse} קצבת {formatCurrency(result.monthlyPensionWithSpouse)}/חודש
              (לעומת {formatCurrency(result.totalMonthlyPension)} ללא שאיר)
            </div>
          )}
        </div>

        {/* פיצויים */}
        <div className="bg-white border-2 border-gray-200 rounded-xl p-4">
          <h3 className="text-md font-semibold text-gray-800 mb-3">פיצויים (סעיף 14)</h3>
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="lumpSum"
              checked={input.lumpSumFromSeverance}
              onChange={(e) => updateInput('lumpSumFromSeverance', e.target.checked)}
              className="w-4 h-4"
            />
            <label htmlFor="lumpSum" className="text-sm text-gray-700">
              קח פיצויים כסכום חד-פעמי (סעיף 14) במקום להמיר לקצבה
            </label>
          </div>
          {input.lumpSumFromSeverance && result.severanceLumpSum && (
            <div className="mt-3 grid grid-cols-2 gap-3">
              <div className="bg-amber-50 rounded-lg p-3 text-center">
                <p className="text-xs text-gray-600">סכום פיצויים</p>
                <p className="text-lg font-bold text-amber-700">{formatCurrency(result.severanceLumpSum)}</p>
              </div>
              <div className="bg-green-50 rounded-lg p-3 text-center">
                <p className="text-xs text-gray-600">נטו (אחרי מס)</p>
                <p className="text-lg font-bold text-green-700">
                  {formatCurrency(result.severanceLumpSumNet ?? 0)}
                </p>
              </div>
            </div>
          )}
          <p className="text-xs text-gray-500 mt-2">
            שים לב: משיכת פיצויים מפחיתה את הצבירה הפנסיונית. מומלץ להשאיר בקרן.
          </p>
        </div>
      </div>
    );
  }

  // ============================================================
  // טאב: ניתוח מס
  // ============================================================
  function TabTax() {
    const tax = result.taxAnalysis;
    return (
      <div className="space-y-4">
        <div className="bg-white border-2 border-gray-200 rounded-xl p-4">
          <h3 className="text-md font-semibold text-gray-800 mb-3">מיסוי קצבה בפרישה (סעיף 9א)</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-500">קצבה ברוטו</p>
              <p className="text-xl font-bold text-gray-800">{formatCurrency(tax.grossMonthlyPension)}</p>
            </div>
            <div className="bg-green-50 rounded-lg p-3">
              <p className="text-xs text-gray-500">פטור ממס (52% עד {formatCurrency(PENSION_CONSTANTS_2026.pensionTaxExemptionCeiling)})</p>
              <p className="text-xl font-bold text-green-700">{formatCurrency(tax.taxExemptAmount)}</p>
            </div>
            <div className="bg-amber-50 rounded-lg p-3">
              <p className="text-xs text-gray-500">חייב במס</p>
              <p className="text-xl font-bold text-amber-700">{formatCurrency(tax.taxableAmount)}</p>
            </div>
            <div className="bg-red-50 rounded-lg p-3">
              <p className="text-xs text-gray-500">מס חודשי (מדרגות הכנסה)</p>
              <p className="text-xl font-bold text-red-700">{formatCurrency(tax.estimatedMonthlyTax)}</p>
            </div>
          </div>
          <div className="mt-3 bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-700">קצבה נטו אחרי מס:</span>
              <strong className="text-lg text-blue-700">{formatCurrency(tax.netMonthlyPension)}/חודש</strong>
            </div>
            <div className="flex justify-between items-center mt-1">
              <span className="text-sm text-gray-700">מס אפקטיבי:</span>
              <strong className="text-sm text-gray-800">{tax.effectiveTaxRate.toFixed(1)}%</strong>
            </div>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <h4 className="font-semibold text-amber-800 mb-2 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            תכנון מס בפרישה
          </h4>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>• הפטור ממס (52%) הוא רק לגיל 67+ - פרישה מוקדמת משלמת יותר מס</li>
            <li>• ניתן לפרוס הכנסה מחד-פעמית (פיצויים) על 6 שנים</li>
            <li>• מומלץ לשקול סדר נכון: קצבה ראשית, אחר-כך פיצויים, אחר-כך תיק השקעות</li>
            <li>• קרן השתלמות שנפדית אחרי 6 שנים - ללא מס כלל</li>
          </ul>
        </div>

        <div className="bg-white border-2 border-gray-200 rounded-xl p-4">
          <h3 className="text-md font-semibold text-gray-800 mb-3">מקדמי המרה והשפעה על הקצבה</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-right">
                  <th className="px-3 py-2 text-gray-700">גיל פרישה</th>
                  <th className="px-3 py-2 text-gray-700">מקדם</th>
                  <th className="px-3 py-2 text-gray-700">מקדם עם שאיר 60%</th>
                  <th className="px-3 py-2 text-gray-700">קצבה חודשית</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(PENSION_CONSTANTS_2026.conversionFactors).map(([age, cf]) => {
                  const cfSpouse = PENSION_CONSTANTS_2026.conversionFactorsWithSpouse[Number(age)] ?? cf;
                  const pension = result.totalFinalBalance > 0 ? result.totalFinalBalance / cf : 0;
                  const isSelected = Number(age) === input.retirementAge;
                  return (
                    <tr
                      key={age}
                      className={`border-t ${isSelected ? 'bg-blue-50 font-semibold' : 'hover:bg-gray-50'}`}
                    >
                      <td className="px-3 py-2">{age}</td>
                      <td className="px-3 py-2">{cf}</td>
                      <td className="px-3 py-2">{cfSpouse}</td>
                      <td className="px-3 py-2 text-blue-700">{formatCurrency(pension)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================
  // טאב: יעד ותכנון
  // ============================================================
  function TabGoal() {
    const g = result.goalAnalysis;
    const isOnTarget = g.gap <= 0;

    return (
      <div className="space-y-4">
        <div className="bg-white border-2 border-gray-200 rounded-xl p-4">
          <h3 className="text-md font-semibold text-gray-800 mb-3">יעד הכנסה חודשית בפרישה</h3>
          <InputRow label="קצבה חודשית רצויה (₪)">
            <NumInput
              value={input.targetMonthlyIncome}
              onChange={(v) => updateInput('targetMonthlyIncome', v)}
              step={500}
            />
          </InputRow>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {[8_000, 10_000, 12_000, 15_000, 18_000, 20_000].map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => updateInput('targetMonthlyIncome', v)}
                className={`text-sm rounded-lg border px-3 py-2 transition ${
                  input.targetMonthlyIncome === v
                    ? 'border-blue-600 bg-blue-50 text-blue-700 font-semibold'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                {formatCurrency(v)}
              </button>
            ))}
          </div>
        </div>

        {/* מצב יעד */}
        <div className={`border-2 rounded-xl p-4 ${isOnTarget ? 'border-green-300 bg-green-50' : 'border-red-300 bg-red-50'}`}>
          <div className="flex items-center gap-2 mb-3">
            {isOnTarget
              ? <TrendingUp className="w-5 h-5 text-green-600" />
              : <AlertTriangle className="w-5 h-5 text-red-600" />
            }
            <h3 className={`font-semibold ${isOnTarget ? 'text-green-800' : 'text-red-800'}`}>
              {isOnTarget ? 'אתה בדרך הנכונה!' : 'יש פער - נדרשת פעולה'}
            </h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white rounded-lg p-3">
              <p className="text-xs text-gray-500">קצבה צפויה</p>
              <p className={`text-xl font-bold ${isOnTarget ? 'text-green-700' : 'text-red-700'}`}>
                {formatCurrency(g.currentProjected)}
              </p>
            </div>
            <div className="bg-white rounded-lg p-3">
              <p className="text-xs text-gray-500">יעד</p>
              <p className="text-xl font-bold text-gray-800">{formatCurrency(g.targetMonthlyIncome)}</p>
            </div>
          </div>
          {!isOnTarget && (
            <div className="mt-3">
              <p className="text-sm text-red-700">
                <strong>פער: {formatCurrency(g.gap)}/חודש ({g.gapPct.toFixed(0)}%)</strong>
              </p>
              <p className="text-sm text-red-700 mt-1">
                לסגירת הפער: הפקד <strong>{formatCurrency(g.requiredAdditionalMonthly)}/חודש</strong> נוסף
              </p>
            </div>
          )}
        </div>

        {/* המלצות */}
        {g.recommendations.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
              <Target className="w-4 h-4" />
              המלצות מותאמות אישית
            </h4>
            <ul className="space-y-1">
              {g.recommendations.map((rec, i) => (
                <li key={i} className="text-sm text-gray-700 flex gap-2">
                  <span className="text-blue-500 mt-0.5 shrink-0">•</span>
                  {rec}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* חישוב גב-אל-גב */}
        <div className="bg-white border-2 border-gray-200 rounded-xl p-4">
          <h3 className="text-md font-semibold text-gray-800 mb-3">כמה להפקיד ליעד?</h3>
          <p className="text-sm text-gray-600 mb-3">
            ליעד של {formatCurrency(input.targetMonthlyIncome)}/חודש עם מקדם {displayConvFactor}:
          </p>
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-sm text-gray-600">נדרש ריבית-על-ריבית חודשית:</p>
            <p className="text-2xl font-bold text-blue-700">{formatCurrency(goalSeekResult)}/חודש</p>
            <p className="text-xs text-gray-500 mt-1">
              (זה ה-PMT - הפקדה חודשית כוללת עובד+מעסיק)
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================
  // גרפים
  // ============================================================
  function Charts() {
    return (
      <div>
        <div className="flex gap-2 mb-4 flex-wrap">
          {(['accumulation', 'income', 'comparison'] as ChartView[]).map((v) => {
            const labels: Record<ChartView, string> = {
              accumulation: 'צבירה לאורך זמן',
              income: 'הכנסה בפרישה',
              comparison: 'גיל פרישה vs קצבה',
            };
            return (
              <button
                key={v}
                type="button"
                onClick={() => setChartView(v)}
                className={`text-sm px-3 py-1.5 rounded-lg border transition ${
                  chartView === v
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                {labels[v]}
              </button>
            );
          })}
        </div>

        {chartView === 'accumulation' && (
          <div>
            <p className="text-xs text-gray-500 mb-2">צבירה כוללת לפי מקורות לאורך השנים (₪)</p>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={accChartData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="age" tick={{ fontSize: 11 }} label={{ value: 'גיל', position: 'insideBottom', offset: -2, fontSize: 11 }} />
                <YAxis tickFormatter={(v) => `${(v / 1_000_000).toFixed(1)}M`} tick={{ fontSize: 10 }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                {input.sources.map((s, i) => (
                  <Area
                    key={s.id}
                    type="monotone"
                    dataKey={s.label}
                    stackId="1"
                    stroke={SOURCE_COLORS[i % SOURCE_COLORS.length]}
                    fill={SOURCE_COLORS[i % SOURCE_COLORS.length]}
                    fillOpacity={0.7}
                  />
                ))}
                {showStudyFund && (
                  <Area
                    type="monotone"
                    dataKey="קרן השתלמות"
                    stackId="1"
                    stroke="#f59e0b"
                    fill="#f59e0b"
                    fillOpacity={0.6}
                  />
                )}
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}

        {chartView === 'income' && (
          <div>
            <p className="text-xs text-gray-500 mb-2">פירוט הכנסה חודשית בפרישה (₪)</p>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={incomeChartData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tickFormatter={(v) => `${v.toLocaleString()}`} tick={{ fontSize: 10 }} />
                <Tooltip formatter={(v) => [formatCurrency(Number(v)), '']} />
                <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]}>
                  {incomeChartData.map((d, i) => (
                    <Bar key={i} dataKey="value" fill={d.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-2 flex flex-wrap gap-2 text-xs">
              {incomeChartData.map((d, i) => (
                <span key={i} className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: d.fill }} />
                  {d.name}: {formatCurrency(d.value)}
                </span>
              ))}
              <span className="font-semibold text-blue-700">
                סה&quot;כ: {formatCurrency(totalMonthlyIncome)}
              </span>
            </div>
          </div>
        )}

        {chartView === 'comparison' && (
          <div>
            <p className="text-xs text-gray-500 mb-2">קצבה חודשית לפי גיל פרישה (₪)</p>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={comparisonData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="age" tick={{ fontSize: 11 }} />
                <YAxis tickFormatter={(v) => `${v.toLocaleString()}`} tick={{ fontSize: 10 }} />
                <Tooltip formatter={(v) => [formatCurrency(Number(v)), 'קצבה']} />
                <Bar dataKey="קצבה" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    );
  }

  // ============================================================
  // תצוגה ראשית
  // ============================================================
  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'sources', label: 'מקורות', icon: <Shield className="w-4 h-4" /> },
    { id: 'advanced', label: 'הגדרות מתקדמות', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'tax', label: 'מיסוי', icon: <AlertTriangle className="w-4 h-4" /> },
    { id: 'goal', label: 'יעד ותכנון', icon: <Target className="w-4 h-4" /> },
  ];

  return (
    <div className="grid lg:grid-cols-5 gap-6">
      {/* עמודה שמאל - קלטים */}
      <div className="lg:col-span-3 space-y-4">
        {/* טאבים */}
        <div className="flex gap-1 bg-gray-100 p-1 rounded-xl flex-wrap">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition flex-1 justify-center ${
                activeTab === t.id
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {t.icon}
              <span className="hidden sm:inline">{t.label}</span>
            </button>
          ))}
        </div>

        {activeTab === 'sources' && <TabSources />}
        {activeTab === 'advanced' && <TabAdvanced />}
        {activeTab === 'tax' && <TabTax />}
        {activeTab === 'goal' && <TabGoal />}
      </div>

      {/* עמודה ימין - תוצאות */}
      <div className="lg:col-span-2 space-y-4">
        {/* כרטיסי תוצאה */}
        <ResultCard
          title="קצבה חודשית צפויה"
          value={formatCurrency(result.totalMonthlyPension)}
          subtitle={`${result.replacementRate.toFixed(0)}% מהשכר | מקדם ${displayConvFactor}`}
          variant={result.replacementRate >= 60 ? 'success' : 'warning'}
        />

        <ResultCard
          title="סך הכנסה בפרישה (כולל ב.ל.ל)"
          value={formatCurrency(totalMonthlyIncome)}
          subtitle={`נטו אחרי מס: ~${formatCurrency(result.taxAnalysis.netMonthlyPension)}`}
          variant={isOnTrack ? 'success' : 'warning'}
        />

        <ResultCard
          title="צבירה כוללת בפרישה"
          value={formatCurrency(result.totalFinalBalance)}
          subtitle={`בעוד ${result.yearsUntilRetirement} שנים`}
          variant="primary"
        />

        {/* פירוט לפי מקורות */}
        {result.sources.length > 1 && (
          <Breakdown
            title="פירוט לפי קרנות"
            defaultOpen={false}
            items={result.sources.map((s) => ({
              label: s.label,
              value: formatCurrency(s.monthlyPension),
              note: `צבירה: ${formatCurrency(s.finalBalance)} | תשואה נטו: ${s.effectiveReturn.toFixed(1)}%`,
            }))}
          />
        )}

        {/* קרן השתלמות */}
        {showStudyFund && result.studyFundFinalBalance > 0 && (
          <Breakdown
            title="קרן השתלמות"
            defaultOpen={false}
            items={[
              { label: 'צבירה צפויה', value: formatCurrency(result.studyFundFinalBalance) },
              { label: 'שווי חודשי (20 שנה)', value: formatCurrency(result.studyFundMonthlyEquivalent) },
            ]}
          />
        )}

        {/* ריאלי לאחר אינפלציה */}
        <Breakdown
          title="ריאלי (בכוח קנייה של היום)"
          defaultOpen={false}
          items={[
            {
              label: 'קצבה ריאלית',
              value: formatCurrency(result.realMonthlyPension),
              note: `לאחר ${input.inflationRate}% אינפלציה × ${result.yearsUntilRetirement} שנים`,
            },
            {
              label: 'ירידת ערך כסף',
              value: `${((1 - result.realMonthlyPension / Math.max(1, result.totalMonthlyPension)) * 100).toFixed(0)}%`,
            },
          ]}
        />

        {/* גרפים */}
        <div className="bg-white border-2 border-gray-200 rounded-xl p-4">
          <Charts />
        </div>

        {/* אזהרות */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs">
          <p className="font-semibold text-amber-800 mb-1">שים לב:</p>
          <ul className="text-gray-700 space-y-0.5">
            <li>• המחשבון הוא הערכה - לא ייעוץ פנסיוני מקצועי</li>
            <li>• תוצאות תלויות בתשואה בפועל ובדמי ניהול</li>
            <li>• לבדיקת הצבירה האמיתית: maslaka.org.il</li>
            <li>• מומלץ לפגישה עם יועץ פנסיוני בלתי-תלוי</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
