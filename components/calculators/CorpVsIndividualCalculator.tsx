'use client';

import { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  ReferenceLine,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  calculateCorpVsIndividual,
  type CorpVsIndividualInput,
} from '@/lib/calculators/corporation-vs-individual';
import { formatCurrency, formatPercent } from '@/lib/utils/formatters';
import { ResultCard } from '@/components/calculator/ResultCard';
import { Breakdown } from '@/components/calculator/Breakdown';

// ============================================================
// קבועים
// ============================================================

const DEFAULT_CORP_COSTS = 20_000; // ₪/שנה

const RECOMMENDATION_LABELS = {
  individual: 'עוסק מורשה',
  corporationDividend: 'חברה בע"מ (דיבידנד)',
  corporationSalary: 'חברה בע"מ (משכורת)',
  corporationMix: 'חברה בע"מ (מיקס)',
};

type TabId = 'comparison' | 'breakeven' | 'projection' | 'costs';

const TABS: { id: TabId; label: string }[] = [
  { id: 'comparison', label: 'השוואה ישירה' },
  { id: 'breakeven', label: 'נקודת איזון' },
  { id: 'projection', label: 'תחזית רב-שנתית' },
  { id: 'costs', label: 'עלויות וסיכונים' },
];

const SCENARIO_COLORS = {
  individual: '#6366f1',
  corporationDividend: '#10b981',
  corporationSalary: '#f59e0b',
  corporationMix: '#3b82f6',
};

// ============================================================
// קומפוננטות עזר
// ============================================================

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-4 py-2 text-sm font-medium rounded-lg transition-all whitespace-nowrap ${
        active
          ? 'bg-blue-600 text-white shadow-sm'
          : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
      }`}
    >
      {children}
    </button>
  );
}

function SectionCard({
  title,
  children,
  className = '',
}: {
  title?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`bg-white border border-gray-200 rounded-xl p-5 ${className}`}>
      {title && <h3 className="text-base font-semibold text-gray-900 mb-4">{title}</h3>}
      {children}
    </div>
  );
}

function Field({
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

function SliderInput({
  value,
  min,
  max,
  step,
  onChange,
  formatValue,
}: {
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  formatValue: (v: number) => string;
}) {
  return (
    <div>
      <div className="flex items-center gap-3">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="flex-1 accent-blue-600"
        />
        <span className="text-sm font-semibold text-blue-700 min-w-[3rem] text-left">
          {formatValue(value)}
        </span>
      </div>
    </div>
  );
}

function RiskBadge({ level }: { level: 'low' | 'medium' | 'high' }) {
  const cfg = {
    low: { label: 'נמוך', cls: 'bg-green-100 text-green-800' },
    medium: { label: 'בינוני', cls: 'bg-amber-100 text-amber-800' },
    high: { label: 'גבוה', cls: 'bg-red-100 text-red-800' },
  };
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${cfg[level].cls}`}>
      {cfg[level].label}
    </span>
  );
}

// Custom tooltip for recharts
function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-lg text-sm" dir="rtl">
      <p className="font-semibold text-gray-800 mb-2">{label}</p>
      {payload.map((p, i) => (
        <div key={i} className="flex items-center gap-2">
          <span
            className="w-3 h-3 rounded-full inline-block"
            style={{ backgroundColor: p.color }}
          />
          <span className="text-gray-600">{p.name}:</span>
          <span className="font-medium">{formatCurrency(p.value)}</span>
        </div>
      ))}
    </div>
  );
}

// ============================================================
// קומפוננטה ראשית
// ============================================================

export function CorpVsIndividualCalculator() {
  const [activeTab, setActiveTab] = useState<TabId>('comparison');

  // ===== פרמטרי קלט =====
  const [annualProfit, setAnnualProfit] = useState(500_000);
  const [creditPoints, setCreditPoints] = useState(2.25);
  const [salaryDividendMix, setSalaryDividendMix] = useState(0.3); // 30% משכורת
  const [isControllingOwner, setIsControllingOwner] = useState(true);

  // עלויות חברה
  const [accountantCost, setAccountantCost] = useState(18_000);
  const [bookkeepingCost, setBookkeepingCost] = useState(9_600);
  const [registrarFee, setRegistrarFee] = useState(1_500);
  const [lawyerCost, setLawyerCost] = useState(3_000);

  // קרנות השתלמות
  const [includeStudyFundIndividual, setIncludeStudyFundIndividual] = useState(false);
  const [includeStudyFundCorp, setIncludeStudyFundCorp] = useState(false);

  // תחזית
  const [annualGrowthRate, setAnnualGrowthRate] = useState(0.1);
  const [projectionYears, setProjectionYears] = useState(5);

  const corpRunningCosts = accountantCost + bookkeepingCost + registrarFee + lawyerCost;

  const input: CorpVsIndividualInput = useMemo(
    () => ({
      annualProfit,
      creditPoints,
      salaryDividendMix,
      corpRunningCosts,
      isControllingOwner,
      annualGrowthRate,
      projectionYears,
      includeStudyFundIndividual,
      includeStudyFundCorp,
      studyFundRateIndividual: 0.045,
    }),
    [
      annualProfit,
      creditPoints,
      salaryDividendMix,
      corpRunningCosts,
      isControllingOwner,
      annualGrowthRate,
      projectionYears,
      includeStudyFundIndividual,
      includeStudyFundCorp,
    ],
  );

  const result = useMemo(() => calculateCorpVsIndividual(input), [input]);

  // ===== נתוני גרפים =====

  const barComparisonData = useMemo(
    () => [
      {
        name: 'עוסק מורשה',
        'נטו לבעלים': Math.round(result.individual.netToOwner),
        'מסים + ב.ל.': Math.round(result.individual.totalTax),
      },
      {
        name: 'חברה - דיבידנד',
        'נטו לבעלים': Math.round(result.corporationDividend.netToOwner),
        'מסים + ב.ל.': Math.round(result.corporationDividend.totalTax),
      },
      {
        name: 'חברה - משכורת',
        'נטו לבעלים': Math.round(result.corporationSalary.netToOwner),
        'מסים + ב.ל.': Math.round(result.corporationSalary.totalTax),
      },
      {
        name: 'חברה - מיקס',
        'נטו לבעלים': Math.round(result.corporationMix.netToOwner),
        'מסים + ב.ל.': Math.round(result.corporationMix.totalTax),
      },
    ],
    [result],
  );

  const incomeLevelBarData = useMemo(
    () =>
      result.incomeLevelComparisons.map((row) => ({
        name: `${(row.annualProfit / 1000).toFixed(0)}K`,
        'עוסק מורשה': Math.round(row.individual.effectiveTaxRate * 100),
        'חברה - מיקס': Math.round(row.corpMix.effectiveTaxRate * 100),
        'חברה - דיבידנד': Math.round(row.corpDividend.effectiveTaxRate * 100),
      })),
    [result],
  );

  const projectionLineData = useMemo(
    () =>
      result.yearProjections.map((p) => ({
        name: `שנה ${p.year}`,
        'עוסק מורשה': Math.round(p.individualNet),
        'חברה (מיקס)': Math.round(p.corpNet),
        'חיסכון מצטבר': Math.round(p.cumulativeSaving),
      })),
    [result],
  );

  const pieData = useMemo(() => {
    const r = result.individual;
    return [
      { name: 'נטו לבעלים', value: Math.round(r.netToOwner), color: '#10b981' },
      { name: 'מס הכנסה', value: Math.round(r.incomeTax), color: '#ef4444' },
      { name: 'ביטוח לאומי', value: Math.round(r.socialSecurity), color: '#f59e0b' },
    ].filter((d) => d.value > 0);
  }, [result]);

  const pieCorp = useMemo(() => {
    const r = result.corporationMix;
    return [
      { name: 'נטו לבעלים', value: Math.round(r.netToOwner), color: '#10b981' },
      { name: 'מס חברות', value: Math.round(r.corporateTax), color: '#ef4444' },
      { name: 'מס דיבידנד', value: Math.round(r.dividendTax), color: '#f97316' },
      { name: 'מס הכנסה', value: Math.round(r.incomeTax), color: '#dc2626' },
      { name: 'ביטוח לאומי', value: Math.round(r.socialSecurity), color: '#f59e0b' },
      { name: 'עלות תפעול', value: Math.round(r.corpRunningCosts), color: '#6b7280' },
    ].filter((d) => d.value > 0);
  }, [result]);

  const rec = result.recommendation;
  const recLabel = RECOMMENDATION_LABELS[rec];
  const isCorp =
    rec === 'corporationDividend' || rec === 'corporationSalary' || rec === 'corporationMix';

  const breakEven = result.breakEvenProfit;
  const isAboveBreakEven = breakEven > 0 && annualProfit >= breakEven;

  return (
    <div className="space-y-6" dir="rtl">
      {/* ===== כרטיס המלצה ===== */}
      <ResultCard
        title={`המלצה: ${recLabel}`}
        value={formatCurrency(result[rec === 'individual' ? 'individual' : rec].netToOwner)}
        subtitle={
          isCorp && result.taxSavingsVsIndividual > 0
            ? `חיסכון שנתי של ${formatCurrency(result.taxSavingsVsIndividual)} לעומת עוסק מורשה`
            : 'במצב הנוכחי - עוסק מורשה עדיף'
        }
        variant={isCorp ? 'success' : 'primary'}
      />

      {/* ===== גריד ראשי: טפסים + תכנים ===== */}
      <div className="grid lg:grid-cols-5 gap-6">
        {/* ===== עמודת קלט ===== */}
        <div className="lg:col-span-2 space-y-4">
          <SectionCard title="פרטי החישוב">
            <div className="space-y-4">
              <Field label="רווח שנתי לפני מס (₪)" hint="הכנסות פחות הוצאות מוכרות">
                <input
                  type="number"
                  min={0}
                  step={10_000}
                  value={annualProfit}
                  onChange={(e) => setAnnualProfit(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-lg font-semibold"
                />
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {[200_000, 350_000, 500_000, 750_000, 1_000_000, 2_000_000].map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setAnnualProfit(v)}
                      className={`text-xs px-2 py-0.5 rounded transition ${
                        annualProfit === v
                          ? 'bg-blue-600 text-white'
                          : 'bg-blue-50 text-blue-800 hover:bg-blue-100'
                      }`}
                    >
                      {v >= 1_000_000 ? `${v / 1_000_000}M` : `${v / 1000}K`}
                    </button>
                  ))}
                </div>
              </Field>

              <Field label="נקודות זיכוי" hint="גבר רווק=2.25 | אישה רווקה=2.75 | עם ילדים=3-6+">
                <input
                  type="number"
                  min={0}
                  max={15}
                  step={0.25}
                  value={creditPoints}
                  onChange={(e) => setCreditPoints(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </Field>

              <Field
                label={`מיקס בחברה: ${Math.round(salaryDividendMix * 100)}% משכורת / ${Math.round((1 - salaryDividendMix) * 100)}% דיבידנד`}
                hint="חלוקה אופטימלית לפי גודל הרווח"
              >
                <SliderInput
                  value={salaryDividendMix}
                  min={0}
                  max={1}
                  step={0.05}
                  onChange={setSalaryDividendMix}
                  formatValue={(v) => `${Math.round(v * 100)}%`}
                />
              </Field>

              <div className="flex items-center justify-between py-2 border-t border-gray-100">
                <label className="text-sm font-medium text-gray-700">
                  בעל מניות מהותי (&gt;10%)?
                </label>
                <button
                  type="button"
                  onClick={() => setIsControllingOwner(!isControllingOwner)}
                  className={`relative w-11 h-6 rounded-full transition-colors ${
                    isControllingOwner ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                      isControllingOwner ? 'translate-x-5' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>
              <p className="text-xs text-gray-500 -mt-2">
                {isControllingOwner ? 'מס דיבידנד: 30%+3%=33%' : 'מס דיבידנד: 25%'}
              </p>
            </div>
          </SectionCard>

          <SectionCard title="עלויות תפעול חברה שנתיות">
            <div className="space-y-3">
              <Field label="רואה חשבון מבקר (₪)" hint="חובה חוקית, 12K-30K/שנה">
                <input
                  type="number"
                  min={0}
                  step={1_000}
                  value={accountantCost}
                  onChange={(e) => setAccountantCost(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                />
              </Field>
              <Field label="ניהול ספרים (₪)" hint="8K-24K/שנה">
                <input
                  type="number"
                  min={0}
                  step={500}
                  value={bookkeepingCost}
                  onChange={(e) => setBookkeepingCost(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                />
              </Field>
              <Field label="אגרת רשם החברות (₪)" hint="~1,500 ₪/שנה">
                <input
                  type="number"
                  min={0}
                  step={100}
                  value={registrarFee}
                  onChange={(e) => setRegistrarFee(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                />
              </Field>
              <Field label="עו&quot;ד + עלויות משפטיות (₪)">
                <input
                  type="number"
                  min={0}
                  step={500}
                  value={lawyerCost}
                  onChange={(e) => setLawyerCost(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                />
              </Field>
              <div className="flex justify-between pt-2 border-t border-gray-200">
                <span className="text-sm font-semibold text-gray-700">סה&quot;כ עלות שנתית:</span>
                <span className="text-sm font-bold text-red-600">
                  {formatCurrency(corpRunningCosts)}
                </span>
              </div>
            </div>
          </SectionCard>

          <SectionCard title="קרן השתלמות">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm text-gray-700">עוסק מורשה - ניכוי 4.5%</label>
                <button
                  type="button"
                  onClick={() => setIncludeStudyFundIndividual(!includeStudyFundIndividual)}
                  className={`relative w-11 h-6 rounded-full transition-colors ${
                    includeStudyFundIndividual ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                      includeStudyFundIndividual ? 'translate-x-5' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm text-gray-700">חברה - ק&quot;ה לבעלים-עובד (7.5%)</label>
                <button
                  type="button"
                  onClick={() => setIncludeStudyFundCorp(!includeStudyFundCorp)}
                  className={`relative w-11 h-6 rounded-full transition-colors ${
                    includeStudyFundCorp ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                      includeStudyFundCorp ? 'translate-x-5' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>
              <p className="text-xs text-gray-500">
                {includeStudyFundCorp
                  ? 'יתרון לחברה: קרן השתלמות פטורה ממס על 7.5% ממשכורת'
                  : 'הפעל כדי לכלול קרן השתלמות בחישוב'}
              </p>
            </div>
          </SectionCard>

          <SectionCard title="פרמטרי תחזית">
            <div className="space-y-3">
              <Field
                label={`קצב צמיחה שנתי: ${Math.round(annualGrowthRate * 100)}%`}
                hint="צמיחה צפויה ברווח השנתי"
              >
                <SliderInput
                  value={annualGrowthRate}
                  min={0}
                  max={0.5}
                  step={0.05}
                  onChange={setAnnualGrowthRate}
                  formatValue={(v) => `${Math.round(v * 100)}%`}
                />
              </Field>
              <Field label="מספר שנות תחזית">
                <div className="flex gap-2">
                  {[3, 5, 7, 10].map((y) => (
                    <button
                      key={y}
                      type="button"
                      onClick={() => setProjectionYears(y)}
                      className={`flex-1 py-1.5 text-sm rounded-lg transition ${
                        projectionYears === y
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {y} שנים
                    </button>
                  ))}
                </div>
              </Field>
            </div>
          </SectionCard>
        </div>

        {/* ===== עמודת תוצאות ===== */}
        <div className="lg:col-span-3 space-y-5">
          {/* טאבים */}
          <div className="flex flex-wrap gap-2">
            {TABS.map((tab) => (
              <TabButton
                key={tab.id}
                active={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </TabButton>
            ))}
          </div>

          {/* ===== טאב 1: השוואה ישירה ===== */}
          {activeTab === 'comparison' && (
            <div className="space-y-5">
              {/* כרטיסי 4 תרחישים */}
              <div className="grid grid-cols-2 gap-3">
                {(
                  [
                    'individual',
                    'corporationDividend',
                    'corporationSalary',
                    'corporationMix',
                  ] as const
                ).map((key) => {
                  const s = result[key];
                  const isRec = rec === key;
                  const label = RECOMMENDATION_LABELS[key];
                  return (
                    <div
                      key={key}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        isRec
                          ? 'border-emerald-400 bg-emerald-50 shadow-md'
                          : 'border-gray-200 bg-white'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-bold text-sm text-gray-900 leading-tight">
                          {label}
                        </h4>
                        {isRec && (
                          <span className="text-xs bg-emerald-600 text-white px-2 py-0.5 rounded-full">
                            מומלץ
                          </span>
                        )}
                      </div>
                      <div className="space-y-1.5 text-xs">
                        <div className="flex justify-between">
                          <span className="text-gray-500">נטו לבעלים:</span>
                          <span
                            className={`font-bold text-sm ${isRec ? 'text-emerald-700' : 'text-gray-900'}`}
                          >
                            {formatCurrency(s.netToOwner)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">שיעור מס:</span>
                          <span className="font-medium">
                            {formatPercent(s.effectiveTaxRate, 1)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">סה&quot;כ מס:</span>
                          <span className="font-medium text-red-600">
                            {formatCurrency(s.totalTax)}
                          </span>
                        </div>
                        {s.corpRunningCosts > 0 && (
                          <div className="flex justify-between text-gray-400">
                            <span>עלות תפעול:</span>
                            <span>{formatCurrency(s.corpRunningCosts)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* גרף עמודות - השוואת נטו */}
              <SectionCard title="נטו לבעלים לפי תרחיש">
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={barComparisonData} layout="vertical" margin={{ left: 10, right: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                    <XAxis type="number" tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
                    <YAxis type="category" dataKey="name" width={120} tick={{ fontSize: 11 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="נטו לבעלים" fill="#10b981" radius={[0, 4, 4, 0]} />
                    <Bar dataKey="מסים + ב.ל." fill="#ef4444" radius={[0, 4, 4, 0]} />
                    <Legend />
                  </BarChart>
                </ResponsiveContainer>
              </SectionCard>

              {/* Pie charts: עוסק vs חברה */}
              <div className="grid md:grid-cols-2 gap-4">
                <SectionCard title='עוסק מורשה - חלוקת הרווח'>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie data={pieData} cx="50%" cy="50%" outerRadius={70} dataKey="value" label={({ name, percent }: { name?: string; percent?: number }) => `${name ?? ''} ${((percent ?? 0) * 100).toFixed(0)}%`}>
                        {pieData.map((entry, i) => (
                          <Cell key={i} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(v: unknown) => formatCurrency(Number(v))} />
                    </PieChart>
                  </ResponsiveContainer>
                </SectionCard>
                <SectionCard title='חברה (מיקס) - חלוקת הרווח'>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie data={pieCorp} cx="50%" cy="50%" outerRadius={70} dataKey="value" label={({ name, percent }: { name?: string; percent?: number }) => `${name ?? ''} ${((percent ?? 0) * 100).toFixed(0)}%`}>
                        {pieCorp.map((entry, i) => (
                          <Cell key={i} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(v: unknown) => formatCurrency(Number(v))} />
                    </PieChart>
                  </ResponsiveContainer>
                </SectionCard>
              </div>

              {/* פירוט חישובים */}
              <div className="space-y-3">
                <Breakdown
                  title="פירוט: עוסק מורשה"
                  defaultOpen={false}
                  items={result.individual.breakdown.map((b) => ({
                    label: b.label,
                    value: formatCurrency(Math.abs(b.amount)),
                    note: b.note,
                    bold: b.label === 'נטו לבעלים',
                  }))}
                />
                <Breakdown
                  title="פירוט: חברה בע&quot;מ (מיקס אופטימלי)"
                  defaultOpen={false}
                  items={result.corporationMix.breakdown.map((b) => ({
                    label: b.label,
                    value: formatCurrency(Math.abs(b.amount)),
                    note: b.note,
                    bold: b.label === 'נטו לבעלים',
                  }))}
                />
              </div>

              {/* טיפ חכם */}
              <div
                className={`rounded-xl p-4 border-2 text-sm ${
                  isCorp
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                    : 'bg-blue-50 border-blue-200 text-blue-900'
                }`}
              >
                <p className="font-bold mb-1">
                  {isCorp ? '✅ חברה בע"מ עדיפה' : 'ℹ️ עוסק מורשה עדיף כעת'}
                </p>
                {isCorp ? (
                  <p>
                    ברווח של {formatCurrency(annualProfit)}, חברה בע&quot;מ חוסכת לך{' '}
                    {formatCurrency(result.taxSavingsVsIndividual)} בשנה. נקודת האיזון היא{' '}
                    {breakEven > 0 ? formatCurrency(breakEven) : 'לא רלוונטי'}.
                    {result.corpCostsPayback.monthsToBreakEven &&
                      ` עלויות החברה יוחזרו תוך ${result.corpCostsPayback.monthsToBreakEven.toFixed(1)} חודשים.`}
                  </p>
                ) : (
                  <p>
                    ברווח הנוכחי, עלויות החברה ({formatCurrency(corpRunningCosts)}/שנה) עולות על
                    חיסכון המס.
                    {breakEven > 0 &&
                      ` כאשר הרווח יגיע ל-${formatCurrency(breakEven)} - שקול מעבר לחברה.`}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* ===== טאב 2: נקודת איזון ===== */}
          {activeTab === 'breakeven' && (
            <div className="space-y-5">
              {/* כרטיס נקודת איזון */}
              <div className="grid md:grid-cols-2 gap-4">
                <ResultCard
                  title="נקודת האיזון"
                  value={breakEven > 0 ? formatCurrency(breakEven) : 'לא נמצאה'}
                  subtitle={
                    breakEven > 0
                      ? `מעל רווח זה - חברה בע"מ משתלמת יותר`
                      : 'עוסק מורשה עדיף בכל טווח הרווחים'
                  }
                  variant={isAboveBreakEven ? 'success' : 'warning'}
                />
                <div className="bg-white border border-gray-200 rounded-xl p-5">
                  <p className="text-sm text-gray-600 mb-1">הרווח הנוכחי שלך</p>
                  <p className="text-3xl font-bold text-gray-900">{formatCurrency(annualProfit)}</p>
                  <p
                    className={`text-sm font-semibold mt-1 ${
                      isAboveBreakEven ? 'text-emerald-600' : 'text-amber-600'
                    }`}
                  >
                    {breakEven > 0
                      ? isAboveBreakEven
                        ? `${formatCurrency(annualProfit - breakEven)} מעל נקודת האיזון`
                        : `${formatCurrency(breakEven - annualProfit)} מתחת לנקודת האיזון`
                      : '—'}
                  </p>
                </div>
              </div>

              {/* טבלת רמות הכנסה */}
              <SectionCard title='שיעורי מס אפקטיביים לפי רמת רווח'>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="py-2 text-right font-semibold text-gray-700">רווח שנתי</th>
                        <th className="py-2 text-center font-semibold text-indigo-700">עוסק</th>
                        <th className="py-2 text-center font-semibold text-emerald-700">חברה (מיקס)</th>
                        <th className="py-2 text-center font-semibold text-blue-700">חברה (דיב&apos;)</th>
                        <th className="py-2 text-center font-semibold text-gray-700">עדיף</th>
                        <th className="py-2 text-center font-semibold text-gray-700">חיסכון</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.incomeLevelComparisons.map((row) => (
                        <tr
                          key={row.annualProfit}
                          className={`border-b border-gray-100 ${
                            row.annualProfit === annualProfit ? 'bg-blue-50' : ''
                          }`}
                        >
                          <td className="py-2 font-medium">
                            {row.annualProfit >= 1_000_000
                              ? `${row.annualProfit / 1_000_000}M`
                              : `${row.annualProfit / 1000}K`}
                          </td>
                          <td className="py-2 text-center text-indigo-700">
                            {formatPercent(row.individual.effectiveTaxRate, 1)}
                          </td>
                          <td className="py-2 text-center text-emerald-700">
                            {formatPercent(row.corpMix.effectiveTaxRate, 1)}
                          </td>
                          <td className="py-2 text-center text-blue-700">
                            {formatPercent(row.corpDividend.effectiveTaxRate, 1)}
                          </td>
                          <td className="py-2 text-center">
                            <span
                              className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                                row.winner === 'corp'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-gray-100 text-gray-700'
                              }`}
                            >
                              {row.winner === 'corp' ? 'חברה' : 'עוסק'}
                            </span>
                          </td>
                          <td className="py-2 text-center text-emerald-700 font-medium">
                            {row.savingsWithCorp > 0 ? formatCurrency(row.savingsWithCorp) : '—'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </SectionCard>

              {/* גרף שיעורי מס */}
              <SectionCard title="שיעור מס אפקטיבי לפי רמת רווח (%)">
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={incomeLevelBarData} margin={{ top: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                    <YAxis unit="%" domain={[0, 65]} />
                    <Tooltip formatter={(v: unknown) => `${v}%`} />
                    <Legend />
                    <Bar dataKey="עוסק מורשה" fill={SCENARIO_COLORS.individual} />
                    <Bar dataKey="חברה - מיקס" fill={SCENARIO_COLORS.corporationMix} />
                    <Bar dataKey="חברה - דיבידנד" fill={SCENARIO_COLORS.corporationDividend} />
                  </BarChart>
                </ResponsiveContainer>
              </SectionCard>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-900">
                <p className="font-bold mb-1">כיצד מחושבת נקודת האיזון?</p>
                <p>
                  הנקודה שבה הנטו לבעלים בחברה (לאחר עלויות תפעול של{' '}
                  {formatCurrency(corpRunningCosts)}/שנה) שווה לנטו כעוסק מורשה. מעל נקודה זו — החברה
                  עדיפה. ככל שעלויות החברה גבוהות יותר, נקודת האיזון תעלה.
                </p>
              </div>
            </div>
          )}

          {/* ===== טאב 3: תחזית רב-שנתית ===== */}
          {activeTab === 'projection' && (
            <div className="space-y-5">
              {/* סיכום תחזית */}
              <div className="grid md:grid-cols-3 gap-3">
                <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
                  <p className="text-xs text-gray-500 mb-1">חיסכון בשנה 1</p>
                  <p className="text-2xl font-bold text-emerald-700">
                    {result.yearProjections[0]
                      ? formatCurrency(result.yearProjections[0].annualSaving)
                      : '—'}
                  </p>
                </div>
                <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
                  <p className="text-xs text-gray-500 mb-1">
                    חיסכון בשנה {projectionYears}
                  </p>
                  <p className="text-2xl font-bold text-emerald-700">
                    {result.yearProjections[projectionYears - 1]
                      ? formatCurrency(result.yearProjections[projectionYears - 1].annualSaving)
                      : '—'}
                  </p>
                </div>
                <div className="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-4 text-center">
                  <p className="text-xs text-gray-600 mb-1">חיסכון מצטבר</p>
                  <p className="text-2xl font-bold text-emerald-700">
                    {result.yearProjections.length > 0
                      ? formatCurrency(
                          result.yearProjections[result.yearProjections.length - 1]
                            .cumulativeSaving,
                        )
                      : '—'}
                  </p>
                </div>
              </div>

              {/* גרף קו - נטו שנתי */}
              <SectionCard title="נטו שנתי לבעלים לאורך שנים">
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={projectionLineData} margin={{ top: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                    <YAxis tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="עוסק מורשה"
                      stroke={SCENARIO_COLORS.individual}
                      strokeWidth={2}
                      dot={{ r: 4 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="חברה (מיקס)"
                      stroke={SCENARIO_COLORS.corporationMix}
                      strokeWidth={2}
                      dot={{ r: 4 }}
                    />
                    <ReferenceLine y={0} stroke="#6b7280" strokeDasharray="4 4" />
                  </LineChart>
                </ResponsiveContainer>
              </SectionCard>

              {/* גרף חיסכון מצטבר */}
              <SectionCard title="חיסכון מצטבר לאורך שנים (חברה לעומת עוסק)">
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={projectionLineData} margin={{ top: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                    <YAxis tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
                    <Tooltip content={<CustomTooltip />} />
                    <ReferenceLine y={0} stroke="#6b7280" strokeDasharray="4 4" label="איזון" />
                    <Line
                      type="monotone"
                      dataKey="חיסכון מצטבר"
                      stroke="#10b981"
                      strokeWidth={3}
                      dot={{ r: 4 }}
                      fill="#d1fae5"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </SectionCard>

              {/* טבלת תחזית */}
              <SectionCard title="טבלת תחזית שנה-שנה">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="py-2 text-right text-gray-700">שנה</th>
                        <th className="py-2 text-center text-gray-700">רווח</th>
                        <th className="py-2 text-center text-indigo-700">עוסק נטו</th>
                        <th className="py-2 text-center text-emerald-700">חברה נטו</th>
                        <th className="py-2 text-center text-gray-700">חיסכון שנתי</th>
                        <th className="py-2 text-center text-emerald-700">חיסכון מצטבר</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.yearProjections.map((row) => (
                        <tr key={row.year} className="border-b border-gray-100">
                          <td className="py-2 font-medium">שנה {row.year}</td>
                          <td className="py-2 text-center">{formatCurrency(row.annualProfit)}</td>
                          <td className="py-2 text-center text-indigo-700">
                            {formatCurrency(row.individualNet)}
                          </td>
                          <td className="py-2 text-center text-emerald-700">
                            {formatCurrency(row.corpNet)}
                          </td>
                          <td
                            className={`py-2 text-center font-medium ${
                              row.annualSaving > 0 ? 'text-emerald-700' : 'text-red-600'
                            }`}
                          >
                            {row.annualSaving > 0 ? '+' : ''}
                            {formatCurrency(row.annualSaving)}
                          </td>
                          <td
                            className={`py-2 text-center font-bold ${
                              row.cumulativeSaving > 0 ? 'text-emerald-700' : 'text-red-600'
                            }`}
                          >
                            {row.cumulativeSaving > 0 ? '+' : ''}
                            {formatCurrency(row.cumulativeSaving)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </SectionCard>
            </div>
          )}

          {/* ===== טאב 4: עלויות וסיכונים ===== */}
          {activeTab === 'costs' && (
            <div className="space-y-5">
              {/* סיכום עלויות */}
              <SectionCard title="עלויות תפעול שנתיות - מפורט">
                <div className="space-y-3">
                  {[
                    {
                      label: 'רואה חשבון מבקר',
                      amount: accountantCost,
                      note: 'חובה חוקית לחברה בע"מ',
                      risk: 'low' as const,
                    },
                    {
                      label: 'ניהול ספרים',
                      amount: bookkeepingCost,
                      note: 'כפול לעומת עוסק',
                      risk: 'low' as const,
                    },
                    {
                      label: 'אגרת רשם החברות',
                      amount: registrarFee,
                      note: 'קבוע שנתי',
                      risk: 'low' as const,
                    },
                    {
                      label: "עו\"ד ועלויות משפטיות",
                      amount: lawyerCost,
                      note: 'חוזים, ייעוץ',
                      risk: 'medium' as const,
                    },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center justify-between py-2 border-b border-gray-100"
                    >
                      <div>
                        <p className="text-sm font-medium text-gray-800">{item.label}</p>
                        <p className="text-xs text-gray-500">{item.note}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <RiskBadge level={item.risk} />
                        <span className="text-sm font-bold text-red-600">
                          {formatCurrency(item.amount)}
                        </span>
                      </div>
                    </div>
                  ))}
                  <div className="flex justify-between pt-2 font-bold">
                    <span>סה&quot;כ עלות שנתית לחברה:</span>
                    <span className="text-red-700">{formatCurrency(corpRunningCosts)}</span>
                  </div>
                </div>
              </SectionCard>

              {/* סיכון אישי */}
              <SectionCard title="אחריות אישית — שיקול קריטי">
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex-1">
                      <p className="font-bold text-red-800 text-sm mb-1">עוסק מורשה — אחריות אישית מלאה</p>
                      <ul className="text-xs text-red-700 space-y-1 list-disc list-inside">
                        <li>חובות העסק הם חובות אישיים שלך</li>
                        <li>נושים יכולים להגיע לרכוש פרטי (דירה, חסכונות)</li>
                        <li>בפשיטת רגל — אישית מול בית המשפט</li>
                        <li>ביטוח אחריות מקצועית הכרחי</li>
                      </ul>
                    </div>
                    <RiskBadge level="high" />
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex-1">
                      <p className="font-bold text-green-800 text-sm mb-1">
                        חברה בע&quot;מ — הגבלת אחריות
                      </p>
                      <ul className="text-xs text-green-700 space-y-1 list-disc list-inside">
                        <li>חובות החברה לא עוברים לבעלים (בד&quot;כ)</li>
                        <li>הפסד מקסימלי = ההשקעה בחברה</li>
                        <li>
                          חריגים: ערבות אישית לבנק, מעשים פסולים, חדלות פירעון עם כוונה
                        </li>
                        <li>מגן על הנכסים האישיים שלך</li>
                      </ul>
                    </div>
                    <RiskBadge level="low" />
                  </div>

                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800">
                    <p className="font-bold mb-1">חשוב לדעת: ה-&quot;מסך התאגידי&quot;</p>
                    <p>
                      בנקים דורשים לרוב ערבות אישית של הבעלים על הלוואות לחברות קטנות. כך אחריות
                      ההגבלה פחות אפקטיבית בפועל לגבי חובות בנקאיים, אך עדיין מגנה מפני חובות
                      מסחריים ותביעות לקוחות.
                    </p>
                  </div>
                </div>
              </SectionCard>

              {/* יתרונות אסטרטגיים */}
              <SectionCard title="יתרונות אסטרטגיים — מעבר למס">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="font-semibold text-gray-800 text-sm mb-2">חברה בע&quot;מ - יתרונות</p>
                    <ul className="space-y-2">
                      {[
                        { text: 'מכירת החברה עתידית (Capital Gains)', detail: 'ניתן למכור מניות בנפרד' },
                        { text: 'קרן השתלמות 7.5% ממשכורת', detail: 'פטורה ממס לאחר 6 שנים' },
                        { text: 'כניסת שותפים ומשקיעים', detail: 'מבנה מניות ברור' },
                        { text: 'צבירת רווחים בחברה', detail: 'השקעה ללא משיכה ומיסוי מיידי' },
                        { text: 'תדמית לקוחות גדולים', detail: 'חברות מעדיפות לעבוד עם חברות' },
                      ].map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs">
                          <span className="text-emerald-600 mt-0.5">✓</span>
                          <div>
                            <p className="font-medium text-gray-800">{item.text}</p>
                            <p className="text-gray-500">{item.detail}</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm mb-2">עוסק מורשה - יתרונות</p>
                    <ul className="space-y-2">
                      {[
                        { text: 'גמישות מלאה בכסף', detail: 'כל הכנסה מיד בחשבון האישי' },
                        { text: 'פחות בירוקרטיה', detail: 'ללא דוחות חברה, ישיבות, פרוטוקולים' },
                        { text: 'עלות תפעול נמוכה', detail: 'ר"ח + ספרות פשוטים' },
                        { text: 'הוצאות אישיות מסוימות', detail: 'קל יותר לנכות הוצאות' },
                        { text: 'סגירה מהירה', detail: 'ללא פירוק חברה מורכב' },
                      ].map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs">
                          <span className="text-blue-500 mt-0.5">✓</span>
                          <div>
                            <p className="font-medium text-gray-800">{item.text}</p>
                            <p className="text-gray-500">{item.detail}</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </SectionCard>

              {/* המלצה אישית */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-5">
                <p className="font-bold text-blue-900 mb-3">המלצה אישית לפי הנתונים שלך</p>
                <div className="space-y-2 text-sm text-blue-800">
                  <div className="flex items-center gap-2">
                    <span className={result.individual.effectiveTaxRate < 0.35 ? '✅' : '⚠️'} />
                    <span>
                      שיעור מס עוסק: {formatPercent(result.individual.effectiveTaxRate, 1)}
                      {result.individual.effectiveTaxRate < 0.35
                        ? ' — נמוך יחסית, שקול להישאר עוסק'
                        : ' — גבוה, חברה כדאית'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={
                        annualProfit > (breakEven > 0 ? breakEven : 500_000) ? '✅' : '⚠️'
                      }
                    />
                    <span>
                      רווח{' '}
                      {annualProfit > (breakEven > 0 ? breakEven : 500_000)
                        ? 'מעל'
                        : 'מתחת ל'}{' '}
                      נקודת האיזון —{' '}
                      {annualProfit > (breakEven > 0 ? breakEven : 500_000)
                        ? 'חברה עדיפה כלכלית'
                        : 'עוסק עדיף כרגע'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={corpRunningCosts < annualProfit * 0.03 ? '✅' : '⚠️'} />
                    <span>
                      עלות חברה: {formatPercent(corpRunningCosts / Math.max(annualProfit, 1), 1)} מהרווח
                      {corpRunningCosts < annualProfit * 0.03 ? ' — סביר' : ' — גבוה יחסית'}
                    </span>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-blue-200">
                  <p className="font-bold text-blue-900 text-lg">
                    {isCorp
                      ? `✅ מומלץ: ${recLabel}`
                      : '📊 עוסק מורשה עדיף כרגע'}
                  </p>
                  <p className="text-sm text-blue-700 mt-1">
                    {isCorp
                      ? `חיסכון שנתי צפוי: ${formatCurrency(result.taxSavingsVsIndividual)}`
                      : `כאשר הרווח יגיע לכ-${breakEven > 0 ? formatCurrency(breakEven) : '350K-450K'} — שקול מעבר לחברה`}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
