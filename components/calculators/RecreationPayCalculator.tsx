'use client';

import { useState, useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  Legend,
} from 'recharts';
import {
  calculateRecreationPayFull,
  calculateRetroactiveClaim,
  calculateSmartAlerts,
  getRecreationPayTable,
  INDUSTRY_RATES_2026,
  type RecreationPayFullInput,
  type Industry,
  type Sector,
} from '@/lib/calculators/recreation-pay';
import { formatCurrency } from '@/lib/utils/formatters';
import { ResultCard } from '@/components/calculator/ResultCard';
import { Breakdown } from '@/components/calculator/Breakdown';
import { AlertCircle, Info, ChevronDown, ChevronUp, TrendingUp } from 'lucide-react';

// ============================
// Types
// ============================

type TabMode = 'basic' | 'net' | 'retroactive' | 'termination' | 'compare';

const TABS: { id: TabMode; label: string }[] = [
  { id: 'basic',       label: 'כמה מגיע לי?' },
  { id: 'net',         label: 'נטו לאחר מס' },
  { id: 'retroactive', label: 'תביעה רטרואקטיבית' },
  { id: 'termination', label: 'עזיבת עבודה' },
  { id: 'compare',     label: 'השוואת מגזרים' },
];

// ============================
// Shared input defaults
// ============================

const DEFAULT_INPUT: RecreationPayFullInput = {
  yearsOfService: 5,
  additionalMonths: 0,
  partTimePercentage: 100,
  sector: 'private',
  industry: 'private_general',
  monthlySalary: 12000,
  creditPoints: 2.25,
  isTermination: false,
  yearsPaid: 0,
};

// ============================
// Helper: custom tooltip for recharts
// ============================

function CurrencyTooltip({ active, payload, label }: {
  active?: boolean;
  payload?: { name: string; value: number; color: string }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-lg text-right text-sm" dir="rtl">
      <p className="font-semibold text-gray-800 mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }}>
          {p.name}: {formatCurrency(p.value)}
        </p>
      ))}
    </div>
  );
}

// ============================
// Recommendations block
// ============================

function Alerts({ items, variant = 'amber' }: { items: string[]; variant?: 'amber' | 'blue' | 'red' }) {
  if (items.length === 0) return null;
  const styles = {
    amber: 'bg-amber-50 border-amber-200 text-amber-900',
    blue:  'bg-blue-50 border-blue-200 text-blue-900',
    red:   'bg-red-50 border-red-200 text-red-900',
  };
  return (
    <div className={`border rounded-xl p-4 space-y-2 ${styles[variant]}`}>
      <h4 className="text-sm font-bold flex items-center gap-2">
        <Info className="w-4 h-4" />
        {variant === 'red' ? 'אזהרה' : 'המלצות'}
      </h4>
      <ul className="space-y-1.5">
        {items.map((item, i) => (
          <li key={i} className="text-sm flex gap-2">
            <span className="flex-shrink-0">•</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ============================
// Tenure table widget
// ============================

function TenureTableWidget({ sector, partTime, currentYears }: {
  sector: Sector;
  partTime: number;
  currentYears: number;
}) {
  const [open, setOpen] = useState(false);
  const rows = useMemo(() => getRecreationPayTable(sector, partTime), [sector, partTime]);

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-xl overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-blue-100 transition"
      >
        <span className="text-sm font-medium text-blue-900">
          טבלת דמי הבראה לפי וותק — {sector === 'public' ? 'מגזר ציבורי' : 'מגזר פרטי'}
        </span>
        {open ? (
          <ChevronUp className="w-4 h-4 text-blue-700" />
        ) : (
          <ChevronDown className="w-4 h-4 text-blue-700" />
        )}
      </button>
      {open && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-blue-100">
                <th className="px-3 py-2 text-right font-semibold text-blue-900">וותק</th>
                <th className="px-3 py-2 text-center font-semibold text-blue-900">ימים</th>
                <th className="px-3 py-2 text-center font-semibold text-blue-900">תעריף/יום</th>
                <th className="px-3 py-2 text-center font-semibold text-blue-900">סכום שנתי</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => {
                const isMe =
                  currentYears >= row.fromYear &&
                  (row.toYear === null || currentYears <= row.toYear);
                return (
                  <tr
                    key={i}
                    className={
                      isMe
                        ? 'bg-emerald-100 font-bold'
                        : i % 2 === 0
                        ? 'bg-white'
                        : 'bg-blue-50'
                    }
                  >
                    <td className="px-3 py-2 text-right text-gray-800">
                      {row.tenure}
                      {isMe && <span className="mr-2 text-emerald-700 text-xs">◀ אתה כאן</span>}
                    </td>
                    <td className="px-3 py-2 text-center text-gray-700">{row.days}</td>
                    <td className="px-3 py-2 text-center text-gray-700">
                      {formatCurrency(row.ratePerDay)}
                    </td>
                    <td className="px-3 py-2 text-center font-medium text-emerald-700">
                      {formatCurrency(row.annualGross)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <p className="text-xs text-blue-700 px-3 py-2">
            מקור: צו ההרחבה הכללי במשק 2026 | תעריף: {sector === 'public' ? '471.40' : '418'} ₪/יום
          </p>
        </div>
      )}
    </div>
  );
}

// ============================
// Shared Inputs Panel
// ============================

function SharedInputs({
  input,
  onChange,
  showIndustry = false,
  showSalary = false,
  showTermination = false,
}: {
  input: RecreationPayFullInput;
  onChange: (partial: Partial<RecreationPayFullInput>) => void;
  showIndustry?: boolean;
  showSalary?: boolean;
  showTermination?: boolean;
}) {
  return (
    <div className="bg-white border-2 border-gray-200 rounded-xl p-6 space-y-5">
      <h2 className="text-lg font-bold text-gray-900">פרטי ההעסקה</h2>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">שנות וותק שלמות</label>
          <input
            type="number"
            min={0}
            max={50}
            value={input.yearsOfService}
            onChange={(e) => onChange({ yearsOfService: Number(e.target.value) })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-lg font-semibold"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">חודשים נוספים</label>
          <select
            value={input.additionalMonths}
            onChange={(e) => onChange({ additionalMonths: Number(e.target.value) })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i} value={i}>{i === 0 ? 'אין חודשים נוספים' : `${i} חודשים`}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">מגזר</label>
          <select
            value={input.sector}
            onChange={(e) => {
              const s = e.target.value as Sector;
              onChange({
                sector: s,
                industry: s === 'public' ? 'public_general' : 'private_general',
              });
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="private">מגזר פרטי</option>
            <option value="public">מגזר ציבורי</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            היקף משרה ({input.partTimePercentage}%)
          </label>
          <div className="flex items-center gap-2 mt-2">
            <input
              type="range"
              min={10}
              max={100}
              step={5}
              value={input.partTimePercentage}
              onChange={(e) => onChange({ partTimePercentage: Number(e.target.value) })}
              className="flex-1"
            />
            <span className="text-sm font-semibold text-blue-700 w-10 text-center">
              {input.partTimePercentage}%
            </span>
          </div>
        </div>
      </div>

      {showIndustry && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">ענף / הסכם קיבוצי</label>
          <select
            value={input.industry}
            onChange={(e) => onChange({ industry: e.target.value as Industry })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            {Object.values(INDUSTRY_RATES_2026).map((r) => (
              <option key={r.id} value={r.id}>
                {r.label} — {formatCurrency(r.ratePerDay)}/יום
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-1">
            מקור: {INDUSTRY_RATES_2026[input.industry].source}
          </p>
        </div>
      )}

      {showSalary && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              שכר חודשי ברוטו (₪)
            </label>
            <input
              type="number"
              min={0}
              max={200000}
              step={500}
              value={input.monthlySalary}
              onChange={(e) => onChange({ monthlySalary: Number(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">נקודות זיכוי</label>
            <input
              type="number"
              min={0}
              max={10}
              step={0.5}
              value={input.creditPoints}
              onChange={(e) => onChange({ creditPoints: Number(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">תושב ישראל: 2.25 | אישה: +0.5</p>
          </div>
        </div>
      )}

      {showTermination && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={input.isTermination}
              onChange={(e) => onChange({ isTermination: e.target.checked })}
              className="w-4 h-4"
            />
            <span className="text-sm font-medium text-amber-900">
              חישוב בעת סיום עבודה (יחסי לחודשים שעבדתי)
            </span>
          </label>
        </div>
      )}
    </div>
  );
}

// ============================
// TAB: Basic entitlement
// ============================

function BasicTab({ input, onChange }: {
  input: RecreationPayFullInput;
  onChange: (partial: Partial<RecreationPayFullInput>) => void;
}) {
  const result = useMemo(
    () => calculateRecreationPayFull({ ...input, isTermination: false }),
    [input],
  );

  // Bar chart: tenure progression for current sector
  const chartData = useMemo(() => {
    const ratePerDay = input.sector === 'public' ? 471.40 : 418;
    const pub = input.sector === 'public';
    return [
      { name: 'שנה 1',      days: 5,          amount: 5  * ratePerDay },
      { name: 'שנים 2-3',  days: pub ? 7 : 6,  amount: (pub ? 7  : 6)  * ratePerDay },
      { name: 'שנים 4-10', days: pub ? 8 : 7,  amount: (pub ? 8  : 7)  * ratePerDay },
      { name: 'שנים 11-15',days: pub ? 9 : 8,  amount: (pub ? 9  : 8)  * ratePerDay },
      { name: 'שנים 16-19',days: pub ? 10 : 9, amount: (pub ? 10 : 9)  * ratePerDay },
      { name: '20+ שנים',  days: pub ? 11 : 10, amount: (pub ? 11 : 10) * ratePerDay },
    ];
  }, [input.sector]);

  return (
    <div className="space-y-4">
      <SharedInputs input={input} onChange={onChange} showIndustry />

      {!result.isEligible ? (
        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6 flex gap-3">
          <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-bold text-red-900 mb-1">לא זכאי לדמי הבראה</h3>
            <p className="text-sm text-red-800">{result.ineligibilityReason}</p>
          </div>
        </div>
      ) : (
        <>
          <div className="grid sm:grid-cols-3 gap-4">
            <ResultCard
              title="ימי הבראה לפי וותק"
              value={`${result.daysEntitled} ימים`}
              subtitle={`${input.yearsOfService} שנות וותק | ${input.sector === 'public' ? 'ציבורי' : 'פרטי'}`}
              variant="primary"
            />
            <ResultCard
              title="תעריף ליום"
              value={formatCurrency(result.payPerDay)}
              subtitle={result.industryRate.label}
              variant="primary"
            />
            <ResultCard
              title="דמי הבראה שנתיים ברוטו"
              value={formatCurrency(result.grossAmount)}
              subtitle={
                input.partTimePercentage < 100
                  ? `${input.partTimePercentage}% משרה | ${formatCurrency(result.fullTimeAmount)} למשרה מלאה`
                  : `${result.daysEntitled} ימים × ${formatCurrency(result.payPerDay)}`
              }
              variant="success"
            />
          </div>

          <Breakdown
            title="פירוט החישוב"
            defaultOpen
            items={[
              { label: 'שנות וותק', value: `${input.yearsOfService} שנים` },
              { label: 'ימי הבראה לפי וותק', value: `${result.daysEntitled} ימים` },
              { label: 'תעריף ליום', value: formatCurrency(result.payPerDay) },
              { label: 'סה"כ למשרה מלאה', value: formatCurrency(result.fullTimeAmount) },
              ...(input.partTimePercentage < 100
                ? [{ label: `יחס משרה (${input.partTimePercentage}%)`, value: `× ${(input.partTimePercentage / 100).toFixed(2)}` }]
                : []),
              { label: 'דמי הבראה שנתיים ברוטו', value: formatCurrency(result.grossAmount), bold: true },
            ]}
          />

          <TenureTableWidget
            sector={input.sector}
            partTime={input.partTimePercentage}
            currentYears={input.yearsOfService}
          />

          {/* Bar chart */}
          <div className="bg-white border-2 border-gray-200 rounded-xl p-5">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              צבירת דמי הבראה לפי וותק ({input.sector === 'public' ? 'מגזר ציבורי' : 'מגזר פרטי'})
            </h3>
            <div dir="ltr">
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis tickFormatter={(v: number) => `${v.toLocaleString('he-IL')} ₪`} tick={{ fontSize: 11 }} width={75} />
                  <Tooltip content={<CurrencyTooltip />} />
                  <Bar dataKey="amount" name="דמי הבראה שנתיים" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <Alerts items={result.recommendations} variant="blue" />
        </>
      )}
    </div>
  );
}

// ============================
// TAB: Net after tax
// ============================

function NetTab({ input, onChange }: {
  input: RecreationPayFullInput;
  onChange: (partial: Partial<RecreationPayFullInput>) => void;
}) {
  const result = useMemo(
    () => calculateRecreationPayFull({ ...input, isTermination: false }),
    [input],
  );

  const pieData = useMemo(() => [
    { name: 'נטו לעובד', value: result.netAmount, fill: '#22c55e' },
    { name: 'מס הכנסה', value: result.taxAmount, fill: '#ef4444' },
    { name: 'ב.ל. + בריאות', value: result.socialSecurityAmount, fill: '#f59e0b' },
  ], [result]);

  return (
    <div className="space-y-4">
      <SharedInputs input={input} onChange={onChange} showIndustry showSalary />

      {result.isEligible && (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <ResultCard
              title="ברוטו"
              value={formatCurrency(result.grossAmount)}
              subtitle={`${result.daysEntitled} ימים × ${formatCurrency(result.payPerDay)}`}
              variant="primary"
            />
            <ResultCard
              title="מס הכנסה"
              value={formatCurrency(result.taxAmount)}
              subtitle={`${Math.round((result.taxAmount / (result.grossAmount || 1)) * 100)}% מהסכום`}
              variant="warning"
            />
            <ResultCard
              title="ב.ל. + בריאות"
              value={formatCurrency(result.socialSecurityAmount)}
              subtitle={`${Math.round((result.socialSecurityAmount / (result.grossAmount || 1)) * 100)}% מהסכום`}
              variant="warning"
            />
            <ResultCard
              title="נטו לעובד"
              value={formatCurrency(result.netAmount)}
              subtitle={`${Math.round((1 - result.effectiveTaxRate) * 100)}% מהברוטו`}
              variant="success"
            />
          </div>

          <Breakdown
            title="פירוט חישוב מס"
            defaultOpen
            items={[
              { label: 'דמי הבראה ברוטו', value: formatCurrency(result.grossAmount) },
              { label: 'שכר חודשי שהוזן', value: formatCurrency(input.monthlySalary) },
              { label: 'מס הכנסה על דמי ההבראה', value: formatCurrency(result.taxAmount),
                note: 'מחושב כהפרש מס שנתי לפני ואחרי הסכום (מס שולי)' },
              { label: 'ב.ל. + ביטוח בריאות', value: formatCurrency(result.socialSecurityAmount),
                note: '4.27% עד 7,522 ₪ + 12.17% על היתרה' },
              { label: 'ניכויים כולל', value: formatCurrency(result.taxAmount + result.socialSecurityAmount) },
              { label: 'נטו לעובד', value: formatCurrency(result.netAmount), bold: true },
            ]}
          />

          {/* Stacked bar: net / social security / tax */}
          <div className="bg-white border-2 border-gray-200 rounded-xl p-5">
            <h3 className="font-bold text-gray-900 mb-4">הרכב הסכום</h3>
            <div dir="ltr">
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={[{
                  name: 'דמי הבראה',
                  net: Math.round(result.netAmount),
                  ss: Math.round(result.socialSecurityAmount),
                  tax: Math.round(result.taxAmount),
                }]}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={(v: number) => `${Math.round(v / 1000)}k ₪`} width={55} />
                  <Tooltip content={<CurrencyTooltip />} />
                  <Legend formatter={(val: string) => val === 'net' ? 'נטו לעובד' : val === 'ss' ? 'ב.ל. + בריאות' : 'מס הכנסה'} />
                  <Bar dataKey="net" name="נטו לעובד" stackId="a" fill="#22c55e" />
                  <Bar dataKey="ss" name="ב.ל. + בריאות" stackId="a" fill="#f59e0b" />
                  <Bar dataKey="tax" name="מס הכנסה" stackId="a" fill="#ef4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <h4 className="text-sm font-bold text-amber-900 mb-2">חשוב לדעת על מיסוי דמי הבראה</h4>
            <ul className="text-xs text-amber-900 space-y-1.5">
              <li>• דמי הבראה חייבים <strong>במלוא מס ההכנסה</strong> ובדמי ביטוח לאומי — ממש כמו שכר רגיל.</li>
              <li>• המס מחושב לפי <strong>שיעור מס שולי</strong> — הסכום נוסף לשכר השנתי שלך.</li>
              <li>• שכר גבוה = מדרגת מס גבוהה יותר על דמי ההבראה.</li>
              <li>• אם המעסיק משלם דמי הבראה חודשית בתלוש — המס נגבה מיד; אם שנתית — בחודש התשלום.</li>
            </ul>
          </div>

          <Alerts items={result.alerts} variant="amber" />
        </>
      )}

      {!result.isEligible && (
        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6">
          <p className="text-red-800 font-medium">{result.ineligibilityReason}</p>
        </div>
      )}
    </div>
  );
}

// ============================
// TAB: Retroactive claim
// ============================

function RetroactiveTab({ input, onChange }: {
  input: RecreationPayFullInput;
  onChange: (partial: Partial<RecreationPayFullInput>) => void;
}) {
  const [unpaidYears, setUnpaidYears] = useState(2);
  const [yearsActuallyPaid, setYearsActuallyPaid] = useState(0);

  const retroResult = useMemo(
    () =>
      calculateRetroactiveClaim({
        yearsOfService: input.yearsOfService,
        partTimePercentage: input.partTimePercentage,
        sector: input.sector,
        unpaidYears,
        monthlySalary: input.monthlySalary,
      }),
    [input.yearsOfService, input.partTimePercentage, input.sector, unpaidYears, input.monthlySalary],
  );

  const alertResult = useMemo(
    () =>
      calculateSmartAlerts({
        yearsOfService: input.yearsOfService,
        partTimePercentage: input.partTimePercentage,
        sector: input.sector,
        yearsActuallyPaid,
        monthlySalary: input.monthlySalary,
      }),
    [input.yearsOfService, input.partTimePercentage, input.sector, yearsActuallyPaid, input.monthlySalary],
  );

  // Line chart: gross vs with interest per year
  const chartData = retroResult.yearlyBreakdown.map((y) => ({
    name: y.label,
    ברוטו: Math.round(y.grossAmount),
    'עם ריבית הלנה': Math.round(y.withInterest),
  }));

  return (
    <div className="space-y-4">
      <SharedInputs input={input} onChange={onChange} />

      <div className="bg-white border-2 border-gray-200 rounded-xl p-6 space-y-5">
        <h2 className="text-lg font-bold text-gray-900">נתוני תביעה רטרואקטיבית</h2>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              שנים שלא קיבלת דמי הבראה
            </label>
            <select
              value={unpaidYears}
              onChange={(e) => setUnpaidYears(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              {[1, 2, 3, 4].map((y) => (
                <option key={y} value={y}>{y} {y === 1 ? 'שנה' : 'שנים'}</option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">מקסימום 4 שנים לפי חוק הגנת השכר</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              כמה שנים בפועל שולמו?
            </label>
            <input
              type="number"
              min={0}
              max={50}
              value={yearsActuallyPaid}
              onChange={(e) => setYearsActuallyPaid(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">לחישוב הפער הצפוי</p>
          </div>
        </div>
      </div>

      {/* Smart alerts */}
      {alertResult.shouldClaim && (
        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 space-y-2">
          <h4 className="font-bold text-red-900 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            התראה: ייתכן חוב של דמי הבראה!
          </h4>
          {alertResult.alerts.map((a, i) => (
            <p key={i} className="text-sm text-red-800">• {a}</p>
          ))}
        </div>
      )}

      {retroResult.isEligible ? (
        <>
          <div className="grid sm:grid-cols-3 gap-4">
            <ResultCard
              title="שנות תביעה"
              value={`${retroResult.claimYears} שנים`}
              subtitle="מקסימום 4 שנות התיישנות"
              variant="primary"
            />
            <ResultCard
              title="סכום תביעה ברוטו"
              value={formatCurrency(retroResult.totalGrossClaim)}
              subtitle="סכום הקרן ללא ריבית"
              variant="success"
            />
            <ResultCard
              title="עם ריבית הלנת שכר"
              value={formatCurrency(retroResult.totalWithInterest)}
              subtitle="כולל ~5% לשנה לכל שנת עיכוב"
              variant="warning"
            />
          </div>

          {/* Table */}
          <div className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden">
            <h3 className="font-bold text-gray-900 px-5 py-3 border-b border-gray-200">
              פירוט לפי שנה
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-2 text-right font-medium text-gray-600">שנה</th>
                    <th className="px-4 py-2 text-center font-medium text-gray-600">וותק</th>
                    <th className="px-4 py-2 text-center font-medium text-gray-600">ימים</th>
                    <th className="px-4 py-2 text-center font-medium text-gray-600">ברוטו</th>
                    <th className="px-4 py-2 text-center font-medium text-gray-600">עם ריבית</th>
                  </tr>
                </thead>
                <tbody>
                  {retroResult.yearlyBreakdown.map((row, i) => (
                    <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-4 py-2 text-right text-gray-800">{row.label}</td>
                      <td className="px-4 py-2 text-center text-gray-700">{row.yearsOfServiceThatYear} שנ'</td>
                      <td className="px-4 py-2 text-center text-gray-700">{row.daysEntitled}</td>
                      <td className="px-4 py-2 text-center text-emerald-700 font-medium">
                        {formatCurrency(row.grossAmount)}
                      </td>
                      <td className="px-4 py-2 text-center text-amber-700 font-medium">
                        {formatCurrency(row.withInterest)}
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-gray-100 font-bold border-t-2 border-gray-300">
                    <td className="px-4 py-2 text-right" colSpan={3}>סה"כ</td>
                    <td className="px-4 py-2 text-center text-emerald-700">
                      {formatCurrency(retroResult.totalGrossClaim)}
                    </td>
                    <td className="px-4 py-2 text-center text-amber-700">
                      {formatCurrency(retroResult.totalWithInterest)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Line chart */}
          {chartData.length > 1 && (
            <div className="bg-white border-2 border-gray-200 rounded-xl p-5">
              <h3 className="font-bold text-gray-900 mb-4">ברוטו לעומת עם ריבית הלנה</h3>
              <div dir="ltr">
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis tickFormatter={(v: number) => `${Math.round(v).toLocaleString('he-IL')} ₪`} tick={{ fontSize: 11 }} width={80} />
                  <Tooltip content={<CurrencyTooltip />} />
                  <Legend />
                  <Line type="monotone" dataKey="ברוטו" stroke="#3b82f6" strokeWidth={2} dot />
                  <Line type="monotone" dataKey="עם ריבית הלנה" stroke="#f59e0b" strokeWidth={2} dot />
                </LineChart>
              </ResponsiveContainer>
              </div>
            </div>
          )}

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <p className="text-sm text-blue-900 font-medium mb-1">הערת התיישנות</p>
            <p className="text-sm text-blue-800">{retroResult.statuteNote}</p>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-2">
            <h4 className="text-sm font-bold text-gray-900">כיצד לתבוע?</h4>
            <ul className="text-xs text-gray-700 space-y-1.5">
              <li>1. <strong>אסוף תלושי שכר</strong> — לוודא שאין שורת "דמי הבראה".</li>
              <li>2. <strong>שלח מכתב דרישה</strong> למעסיק בכתב (רשום).</li>
              <li>3. אם אין מענה — <strong>פנה לממונה על חוקי העבודה</strong> או לבית הדין לעבודה.</li>
              <li>4. <strong>סף תביעה קטנה</strong>: עד 27,000 ₪ ניתן בהליך מזורז (ללא עורך דין).</li>
              <li>5. <strong>ריבית הלנת שכר</strong>: ניתן לדרוש ריבית בנק ישראל + 20% או 5% לחודש.</li>
            </ul>
          </div>
        </>
      ) : (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <p className="text-amber-800">{retroResult.ineligibilityReason}</p>
        </div>
      )}
    </div>
  );
}

// ============================
// TAB: Termination
// ============================

function TerminationTab({ input, onChange }: {
  input: RecreationPayFullInput;
  onChange: (partial: Partial<RecreationPayFullInput>) => void;
}) {
  const result = useMemo(
    () => calculateRecreationPayFull({ ...input, isTermination: true }),
    [input],
  );

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <h3 className="font-bold text-blue-900 mb-1">דמי הבראה בעת סיום עבודה</h3>
        <p className="text-sm text-blue-800">
          גם אם פוטרת או התפטרת, מגיעים לך דמי הבראה <strong>יחסיים</strong> לתקופה שעבדת בשנה הנוכחית —
          לפי חלק השנה (חודשים ÷ 12). הזכות נכללת בגמר חשבון.
        </p>
      </div>

      <SharedInputs input={input} onChange={onChange} showSalary />

      {result.isEligible ? (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <ResultCard
              title="דמי הבראה שנתיים מלאים"
              value={formatCurrency(result.grossAmount)}
              subtitle={`${result.daysEntitled} ימים × ${formatCurrency(result.payPerDay)}`}
              variant="primary"
            />
            {input.additionalMonths > 0 ? (
              <ResultCard
                title={`יחסי (${input.additionalMonths} חודשים)`}
                value={formatCurrency(result.proRatedGross)}
                subtitle={`${input.additionalMonths}/12 × ${formatCurrency(result.grossAmount)}`}
                variant="success"
              />
            ) : (
              <ResultCard
                title="שנה מלאה"
                value={formatCurrency(result.grossAmount)}
                subtitle="עזיבה בסוף שנה — מגיע השנתי המלא"
                variant="success"
              />
            )}
            <ResultCard
              title="נטו לאחר מס"
              value={formatCurrency(result.proRatedNet > 0 ? result.proRatedNet : result.netAmount)}
              subtitle={`${Math.round((1 - result.effectiveTaxRate) * 100)}% מהברוטו`}
              variant="success"
            />
          </div>

          <Breakdown
            title="פירוט חישוב עזיבה"
            defaultOpen
            items={[
              { label: 'שנות וותק שלמות', value: `${input.yearsOfService} שנים` },
              { label: 'חודשים בשנה הנוכחית', value: `${input.additionalMonths} חודשים` },
              { label: 'ימי הבראה שנתיים', value: `${result.daysEntitled} ימים` },
              { label: 'תעריף', value: formatCurrency(result.payPerDay) },
              { label: 'שנתי מלא', value: formatCurrency(result.grossAmount) },
              ...(input.additionalMonths > 0
                ? [{ label: `יחסי (${input.additionalMonths}/12)`, value: formatCurrency(result.proRatedGross) }]
                : []),
              { label: 'מס הכנסה + ב.ל.', value: formatCurrency(result.taxAmount + result.socialSecurityAmount) },
              { label: 'נטו לעובד', value: formatCurrency(result.proRatedNet > 0 ? result.proRatedNet : result.netAmount), bold: true },
            ]}
          />

          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-2">
            <h4 className="text-sm font-bold text-gray-900">זכויות נוספות בגמר חשבון</h4>
            <ul className="text-xs text-gray-700 space-y-1.5">
              <li>• <strong>פיצויי פיטורים</strong>: שנה × משכורת (אם פוטרת / התפטרת בנסיבות מזכות)</li>
              <li>• <strong>הודעה מוקדמת</strong>: 1 יום/חודש בשנה הראשונה, שבוע/שנה לאחר מכן</li>
              <li>• <strong>פדיון חופשה שנתית</strong>: כל הימים הצבורים שלא נוצלו</li>
              <li>• <strong>דמי הבראה</strong> (אתה מחשב עכשיו) — כולל יחסי לשנה האחרונה</li>
              <li>• <strong>קרן פנסיה / השתלמות</strong>: כספי התגמולים עוברים לבעלותך</li>
            </ul>
          </div>

          <Alerts items={result.recommendations} variant="blue" />
        </>
      ) : (
        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6">
          <p className="text-red-800">{result.ineligibilityReason}</p>
        </div>
      )}
    </div>
  );
}

// ============================
// TAB: Sector comparison
// ============================

function CompareTab({ input, onChange }: {
  input: RecreationPayFullInput;
  onChange: (partial: Partial<RecreationPayFullInput>) => void;
}) {
  const result = useMemo(
    () => calculateRecreationPayFull({ ...input, isTermination: false }),
    [input],
  );

  // Comparison chart: all industries for current tenure
  const comparisonData = useMemo(() => {
    return Object.values(INDUSTRY_RATES_2026).map((ind) => {
      const days =
        ind.id.startsWith('public') || ind.id === 'healthcare' || ind.id === 'academia'
          ? result.daysEntitled + 1  // public tends to be +1 day
          : result.daysEntitled;
      return {
        name: ind.label.replace(' — ', '\n').split('—')[0].trim(),
        annualAmount: Math.round(days * ind.ratePerDay * (input.partTimePercentage / 100)),
      };
    });
  }, [result.daysEntitled, input.partTimePercentage]);

  // Accumulation line chart over 20 years
  const accumulationData = useMemo(() => {
    return Array.from({ length: 20 }, (_, i) => {
      const y = i + 1;
      const privateAmt =
        import_getRecreationDays(y, 'private') *
        INDUSTRY_RATES_2026.private_general.ratePerDay *
        (input.partTimePercentage / 100);
      const publicAmt =
        import_getRecreationDays(y, 'public') *
        INDUSTRY_RATES_2026.public_general.ratePerDay *
        (input.partTimePercentage / 100);
      return { name: `שנה ${y}`, 'מגזר פרטי': Math.round(privateAmt), 'מגזר ציבורי': Math.round(publicAmt) };
    });
  }, [input.partTimePercentage]);

  return (
    <div className="space-y-4">
      <SharedInputs input={input} onChange={onChange} />

      <div className="grid sm:grid-cols-3 gap-4">
        <ResultCard
          title="מגזר פרטי (כללי)"
          value={formatCurrency(result.privateSectorAmount)}
          subtitle={`${result.daysEntitled} ימים × 418 ₪`}
          variant="primary"
        />
        <ResultCard
          title="מגזר ציבורי"
          value={formatCurrency(result.publicSectorAmount)}
          subtitle={`${result.daysEntitled + 1} ימים × 471.40 ₪`}
          variant="success"
        />
        <ResultCard
          title="יתרון ציבורי"
          value={formatCurrency(result.publicSectorAmount - result.privateSectorAmount)}
          subtitle="פער שנתי למשרה רלוונטית"
          variant="warning"
        />
      </div>

      {/* Bar chart - all industries */}
      <div className="bg-white border-2 border-gray-200 rounded-xl p-5">
        <h3 className="font-bold text-gray-900 mb-4">
          השוואת דמי הבראה לפי ענף ({input.yearsOfService} שנות וותק, {input.partTimePercentage}% משרה)
        </h3>
        <div dir="ltr">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={comparisonData} layout="vertical" margin={{ right: 30 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" tickFormatter={(v: number) => `${v.toLocaleString('he-IL')} ₪`} tick={{ fontSize: 10 }} />
              <YAxis type="category" dataKey="name" width={120} tick={{ fontSize: 10 }} />
              <Tooltip content={<CurrencyTooltip />} />
              <Bar dataKey="annualAmount" name="דמי הבראה שנתיים" fill="#3b82f6" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Accumulation line chart */}
      <div className="bg-white border-2 border-gray-200 rounded-xl p-5">
        <h3 className="font-bold text-gray-900 mb-4">
          צבירה לפי שנים — פרטי vs ציבורי ({input.partTimePercentage}% משרה)
        </h3>
        <div dir="ltr">
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={accumulationData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={1} />
              <YAxis tickFormatter={(v: number) => `${v.toLocaleString('he-IL')} ₪`} width={75} tick={{ fontSize: 10 }} />
              <Tooltip content={<CurrencyTooltip />} />
              <Legend />
              <Line type="monotone" dataKey="מגזר פרטי" stroke="#3b82f6" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="מגזר ציבורי" stroke="#22c55e" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-2">
        <h4 className="text-sm font-bold text-gray-900">פרטי התעריפים 2026</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-right border-b">
                <th className="px-2 py-1 font-medium text-gray-600">ענף / מגזר</th>
                <th className="px-2 py-1 font-medium text-gray-600 text-center">תעריף/יום</th>
                <th className="px-2 py-1 font-medium text-gray-600">מקור</th>
              </tr>
            </thead>
            <tbody>
              {Object.values(INDUSTRY_RATES_2026).map((r, i) => (
                <tr key={r.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-2 py-1.5 text-gray-800">{r.label}</td>
                  <td className="px-2 py-1.5 text-center font-medium text-blue-700">{formatCurrency(r.ratePerDay)}</td>
                  <td className="px-2 py-1.5 text-gray-500 text-xs">{r.source}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Helper (avoids circular import — inline reimport of getRecreationDays for CompareTab)
function import_getRecreationDays(years: number, sector: Sector): number {
  const PRIVATE = [
    { fromYear: 1, days: 5 }, { fromYear: 2, days: 6 }, { fromYear: 4, days: 7 },
    { fromYear: 11, days: 8 }, { fromYear: 16, days: 9 }, { fromYear: 20, days: 10 },
  ];
  const PUBLIC = [
    { fromYear: 1, days: 6 }, { fromYear: 2, days: 7 }, { fromYear: 4, days: 8 },
    { fromYear: 11, days: 9 }, { fromYear: 16, days: 10 }, { fromYear: 20, days: 11 },
  ];
  if (years < 1) return 0;
  const table = sector === 'public' ? PUBLIC : PRIVATE;
  let days = 0;
  for (const row of table) {
    if (years >= row.fromYear) days = row.days;
    else break;
  }
  return days;
}

// ============================
// Main Calculator
// ============================

export function RecreationPayCalculator() {
  const [activeTab, setActiveTab] = useState<TabMode>('basic');
  const [input, setInput] = useState<RecreationPayFullInput>(DEFAULT_INPUT);

  function onChange(partial: Partial<RecreationPayFullInput>) {
    setInput((prev) => ({ ...prev, ...partial }));
  }

  return (
    <div className="space-y-6" dir="rtl">
      {/* Tab navigation */}
      <div className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden">
        <div className="flex flex-wrap border-b border-gray-200">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 min-w-[120px] px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      {activeTab === 'basic'       && <BasicTab       input={input} onChange={onChange} />}
      {activeTab === 'net'         && <NetTab         input={input} onChange={onChange} />}
      {activeTab === 'retroactive' && <RetroactiveTab input={input} onChange={onChange} />}
      {activeTab === 'termination' && <TerminationTab input={input} onChange={onChange} />}
      {activeTab === 'compare'     && <CompareTab     input={input} onChange={onChange} />}
    </div>
  );
}
