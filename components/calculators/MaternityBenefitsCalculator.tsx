'use client';

import { useState, useMemo } from 'react';
import {
  calculateLeaveDuration,
  calculateMaternityPay,
  calculateFatherLeave,
  calculateJobProtection,
  calculateBreastfeedingValue,
  calculateHospitalVsHome,
  MATERNITY_MONTHLY_CAP_2026,
  MATERNITY_DAILY_CAP_2026,
  FULL_LEAVE_DAYS,
  MIN_LEAVE_DAYS,
  AVERAGE_WAGE_2026,
  BREASTFEEDING_HOUR_MONTHS,
  JOB_PROTECTION_DAYS_AFTER_RETURN,
} from '@/lib/calculators/maternity-benefits';
import { formatCurrency } from '@/lib/utils/formatters';
import { ResultCard } from '@/components/calculator/ResultCard';
import { Breakdown } from '@/components/calculator/Breakdown';
import { AlertCircle, Info, CheckCircle, Shield, Baby, Clock, Calendar } from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

// ============================================================
// Types & Constants
// ============================================================

type TabMode = 'eligibility' | 'pay' | 'father' | 'protection' | 'breastfeeding';

const TABS: { id: TabMode; label: string; icon: React.ReactNode }[] = [
  { id: 'eligibility', label: 'זכאות ואורך', icon: <Baby className="w-4 h-4" /> },
  { id: 'pay', label: 'חישוב תשלום', icon: <Info className="w-4 h-4" /> },
  { id: 'father', label: 'חופשת אב', icon: <CheckCircle className="w-4 h-4" /> },
  { id: 'protection', label: 'הגנת משרה', icon: <Shield className="w-4 h-4" /> },
  { id: 'breastfeeding', label: 'שעת הנקה', icon: <Clock className="w-4 h-4" /> },
];

// ============================================================
// Shared Sub-components
// ============================================================

const SectionCard = ({ title, children, icon }: { title: string; children: React.ReactNode; icon?: React.ReactNode }) => (
  <div className="bg-white border-2 border-gray-200 rounded-xl p-6 space-y-5">
    <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
      {icon && <span className="text-pink-500">{icon}</span>}
      {title}
    </h2>
    {children}
  </div>
);

const InfoBox = ({
  children,
  variant = 'blue',
}: {
  children: React.ReactNode;
  variant?: 'blue' | 'amber' | 'red' | 'green' | 'pink';
}) => {
  const classes = {
    blue: 'bg-blue-50 border-blue-200 text-blue-900',
    amber: 'bg-amber-50 border-amber-200 text-amber-900',
    red: 'bg-red-50 border-red-200 text-red-900',
    green: 'bg-green-50 border-green-200 text-green-900',
    pink: 'bg-pink-50 border-pink-200 text-pink-900',
  };
  return (
    <div className={`border rounded-xl p-4 ${classes[variant]}`}>
      {children}
    </div>
  );
};

const Recommendations = ({ items, variant = 'amber' }: { items: string[]; variant?: 'amber' | 'pink' | 'blue' }) => {
  if (items.length === 0) return null;
  const classes = {
    amber: 'bg-amber-50 border-amber-200 text-amber-900',
    pink: 'bg-pink-50 border-pink-200 text-pink-900',
    blue: 'bg-blue-50 border-blue-200 text-blue-900',
  };
  return (
    <div className={`border rounded-xl p-4 ${classes[variant]}`}>
      <h4 className="text-sm font-bold mb-2 flex items-center gap-2">
        <Info className="w-4 h-4" />
        המלצות ותובנות
      </h4>
      <ul className="space-y-1.5">
        {items.map((rec, i) => (
          <li key={i} className="text-sm flex gap-2">
            <span className="flex-shrink-0">💡</span>
            <span>{rec}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

// ============================================================
// Tab 1: Eligibility & Duration
// ============================================================

const EligibilityTab = ({
  monthsWorked,
  setMonthsWorked,
  numberOfBabies,
  setNumberOfBabies,
  isPremature,
  setIsPremature,
  hospitalizationDays,
  setHospitalizationDays,
}: {
  monthsWorked: number;
  setMonthsWorked: (v: number) => void;
  numberOfBabies: number;
  setNumberOfBabies: (v: number) => void;
  isPremature: boolean;
  setIsPremature: (v: boolean) => void;
  hospitalizationDays: number;
  setHospitalizationDays: (v: number) => void;
}) => {
  const result = useMemo(
    () =>
      calculateLeaveDuration({
        monthsWorkedInLast14: monthsWorked,
        employmentType: 'employee',
        numberOfBabies,
        isPremature,
        hospitalizationDays,
      }),
    [monthsWorked, numberOfBabies, isPremature, hospitalizationDays],
  );

  // נתוני גרף — השוואת תרחישים
  const chartData = useMemo(() => {
    const base: { תרחיש: string; ימים: number; שבועות: number }[] = [
      { תרחיש: '6-9 חודשי עבודה', ימים: MIN_LEAVE_DAYS, שבועות: 8 },
      { תרחיש: '10+ חודשי עבודה', ימים: FULL_LEAVE_DAYS, שבועות: 15 },
    ];
    if (numberOfBabies === 2) {
      base.push({ תרחיש: 'תאומים (10+ חודשים)', ימים: FULL_LEAVE_DAYS + 21, שבועות: 18 });
    }
    if (numberOfBabies === 3) {
      base.push({ תרחיש: 'שלישיה (10+ חודשים)', ימים: FULL_LEAVE_DAYS + 42, שבועות: 21 });
    }
    if (isPremature) {
      base.push({ תרחיש: 'פג + 10+ חודשים', ימים: FULL_LEAVE_DAYS + 21, שבועות: 18 });
    }
    if (hospitalizationDays >= 7) {
      base.push({
        תרחיש: `אישפוז ${hospitalizationDays} ימים`,
        ימים: FULL_LEAVE_DAYS + Math.min(hospitalizationDays, 140),
        שבועות: Math.round((FULL_LEAVE_DAYS + Math.min(hospitalizationDays, 140)) / 7),
      });
    }
    return base;
  }, [numberOfBabies, isPremature, hospitalizationDays]);

  const eligibilityColor =
    result.eligibility === 'full' ? 'green' : result.eligibility === 'partial' ? 'amber' : 'red';
  const eligibilityBg =
    result.eligibility === 'full'
      ? 'bg-green-50 border-green-300'
      : result.eligibility === 'partial'
        ? 'bg-amber-50 border-amber-300'
        : 'bg-red-50 border-red-300';
  const eligibilityText =
    result.eligibility === 'full'
      ? 'text-green-800'
      : result.eligibility === 'partial'
        ? 'text-amber-800'
        : 'text-red-800';
  const eligibilityLabel =
    result.eligibility === 'full' ? 'זכאית לחופשה מלאה' : result.eligibility === 'partial' ? 'זכאית לחופשה חלקית' : 'אינך זכאית לדמי לידה';

  return (
    <div className="space-y-4">
      <SectionCard title="פרטי הזכאות" icon={<Baby className="w-5 h-5" />}>
        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              חודשים שעבדת מתוך 14 חודשים אחרונים
            </label>
            <input
              type="number"
              min={0}
              max={14}
              value={monthsWorked}
              onChange={(e) => setMonthsWorked(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-400 focus:border-transparent text-xl font-bold"
            />
            <p className="text-xs text-gray-500 mt-1">
              10+ חודשים → חופשה מלאה (15 שב'). 6-9 חודשים → חלקית (8 שב').
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              מספר ילדים בלידה
            </label>
            <select
              value={numberOfBabies}
              onChange={(e) => setNumberOfBabies(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-400 focus:border-transparent"
            >
              <option value={1}>ילד אחד</option>
              <option value={2}>תאומים (+3 שבועות)</option>
              <option value={3}>שלישיה (+6 שבועות)</option>
              <option value={4}>רביעיה (+9 שבועות)</option>
            </select>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ימי אישפוז יילוד (אם רלוונטי)
            </label>
            <input
              type="number"
              min={0}
              max={140}
              value={hospitalizationDays}
              onChange={(e) => setHospitalizationDays(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-400 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">7+ ימים → זכאות להארכה עד 20 שבועות</p>
          </div>
          <div className="flex items-center gap-3 pt-6">
            <input
              type="checkbox"
              id="premature"
              checked={isPremature}
              onChange={(e) => setIsPremature(e.target.checked)}
              className="w-5 h-5 rounded accent-pink-500"
            />
            <label htmlFor="premature" className="text-sm font-medium text-gray-700 cursor-pointer">
              לידה מוקדמת / פג (משקל &lt;1.5 ק"ג)
              <span className="block text-xs text-gray-500 font-normal">+21 ימים נוספים</span>
            </label>
          </div>
        </div>

        {/* כרטיס זכאות */}
        <div className={`border-2 rounded-xl p-4 ${eligibilityBg}`}>
          <div className="flex items-start gap-3">
            {result.eligibility === 'full' ? (
              <CheckCircle className={`w-6 h-6 text-${eligibilityColor}-600 flex-shrink-0 mt-0.5`} />
            ) : result.eligibility === 'partial' ? (
              <AlertCircle className={`w-6 h-6 text-${eligibilityColor}-600 flex-shrink-0 mt-0.5`} />
            ) : (
              <AlertCircle className={`w-6 h-6 text-${eligibilityColor}-600 flex-shrink-0 mt-0.5`} />
            )}
            <div>
              <h3 className={`font-bold text-base ${eligibilityText}`}>{eligibilityLabel}</h3>
              <p className={`text-sm mt-1 ${eligibilityText}`}>{result.explanation}</p>
            </div>
          </div>
        </div>
      </SectionCard>

      {/* תוצאות */}
      {result.eligibility !== 'none' && (
        <>
          <div className="grid sm:grid-cols-3 gap-4">
            <ResultCard
              title="ימי חופשה בסיסיים"
              value={`${result.paidLeaveDays} ימים`}
              subtitle={`${result.paidLeaveWeeks} שבועות`}
              variant="primary"
            />
            <ResultCard
              title="ימי הארכות"
              value={`${result.multipleBirthExtraDays + result.prematureExtraDays + result.hospitalizationExtraDays} ימים`}
              subtitle={[
                result.multipleBirthExtraDays > 0 ? `תאומים: +${result.multipleBirthExtraDays}` : '',
                result.prematureExtraDays > 0 ? `פגות: +${result.prematureExtraDays}` : '',
                result.hospitalizationExtraDays > 0 ? `אישפוז: +${result.hospitalizationExtraDays}` : '',
              ].filter(Boolean).join(' | ') || 'ללא הארכות'}
              variant={result.multipleBirthExtraDays + result.prematureExtraDays + result.hospitalizationExtraDays > 0 ? 'success' : 'primary'}
            />
            <ResultCard
              title="סה״כ ימי חופשה"
              value={`${result.totalDays} ימים`}
              subtitle={`${Math.round(result.totalDays / 7)} שבועות`}
              variant="success"
            />
          </div>

          {/* פירוט */}
          <Breakdown
            title="פירוט ימי החופשה"
            defaultOpen
            items={[
              { label: 'חופשה בסיסית', value: `${result.paidLeaveDays} ימים` },
              ...(result.multipleBirthExtraDays > 0
                ? [{ label: `הארכה — ${numberOfBabies - 1} ילד/ים נוסף/ים`, value: `+${result.multipleBirthExtraDays} ימים` }]
                : []),
              ...(result.prematureExtraDays > 0
                ? [{ label: 'הארכה — לידה מוקדמת', value: `+${result.prematureExtraDays} ימים` }]
                : []),
              ...(result.hospitalizationExtraDays > 0
                ? [{ label: 'הארכה — אישפוז יילוד', value: `+${result.hospitalizationExtraDays} ימים` }]
                : []),
              { label: 'סה"כ', value: `${result.totalDays} ימים`, bold: true },
            ]}
          />

          {/* גרף השוואת תרחישים */}
          <div className="bg-white border-2 border-gray-200 rounded-xl p-5">
            <h3 className="font-bold text-gray-900 mb-4">השוואת אורך חופשה לפי תרחישים</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 40 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="תרחיש" tick={{ fontSize: 11 }} angle={-15} textAnchor="end" interval={0} />
                <YAxis tick={{ fontSize: 11 }} unit=" ימים" />
                <Tooltip formatter={(v) => `${Number(v)} ימים`} />
                <Bar dataKey="ימים" fill="#ec4899" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}

      <Recommendations items={result.recommendations} variant="pink" />
    </div>
  );
};

// ============================================================
// Tab 2: Pay Calculator
// ============================================================

const PayTab = ({
  salary3Months,
  setSalary3Months,
  salary6Months,
  setSalary6Months,
  leaveDays,
  setLeaveDays,
  hospitalizationDays,
}: {
  salary3Months: number;
  setSalary3Months: (v: number) => void;
  salary6Months: number;
  setSalary6Months: (v: number) => void;
  leaveDays: number;
  setLeaveDays: (v: number) => void;
  hospitalizationDays: number;
}) => {
  const [showHospitalComparison, setShowHospitalComparison] = useState(false);

  const result = useMemo(
    () =>
      calculateMaternityPay({
        avgSalary3Months: salary3Months,
        avgSalary6Months: salary6Months > 0 ? salary6Months : undefined,
        leaveDays,
      }),
    [salary3Months, salary6Months, leaveDays],
  );

  const hospitalResult = useMemo(() => {
    if (!showHospitalComparison || hospitalizationDays < 7) return null;
    return calculateHospitalVsHome(
      result.dailyBenefit,
      leaveDays,
      hospitalizationDays,
      result.effectiveMonthlySalary,
    );
  }, [showHospitalComparison, hospitalizationDays, result.dailyBenefit, leaveDays, result.effectiveMonthlySalary]);

  // נתוני גרף עוגה — חלוקת תשלום
  const pieData = useMemo(() => [
    { name: 'דמי לידה נטו', value: Math.round(result.estimatedNetBenefit) },
    { name: 'ביטוח לאומי', value: Math.round(result.nationalInsuranceAmount) },
    ...(result.excessLoss > 0 ? [{ name: 'הפסד מעל תקרה', value: Math.round(result.excessLoss) }] : []),
  ], [result]);

  const PIE_COLORS = ['#22c55e', '#f59e0b', '#ef4444'];

  // גרף עמודות: השוואת שכרים
  const salaryCompare = useMemo(() => [
    { name: 'שכר 3 חודשים', שכר: salary3Months },
    ...(salary6Months > 0 ? [{ name: 'שכר 6 חודשים', שכר: salary6Months }] : []),
    { name: 'שכר קובע', שכר: result.effectiveMonthlySalary },
    { name: 'תקרת ב.ל.', שכר: MATERNITY_MONTHLY_CAP_2026 },
    { name: 'שכר ממוצע', שכר: AVERAGE_WAGE_2026 },
  ], [salary3Months, salary6Months, result.effectiveMonthlySalary]);

  return (
    <div className="space-y-4">
      <SectionCard title="פרטי השכר">
        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              שכר חודשי ממוצע — 3 חודשים אחרונים (₪)
            </label>
            <input
              type="number"
              min={0}
              max={300000}
              step={500}
              value={salary3Months}
              onChange={(e) => setSalary3Months(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-400 focus:border-transparent text-xl font-bold"
            />
            <p className="text-xs text-gray-500 mt-1">
              שכר יומי: {formatCurrency(salary3Months / 30, { decimals: 0 })}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              שכר חודשי ממוצע — 6 חודשים אחרונים (₪) <span className="text-gray-400 font-normal">(אופציונלי)</span>
            </label>
            <input
              type="number"
              min={0}
              max={300000}
              step={500}
              value={salary6Months}
              onChange={(e) => setSalary6Months(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-400 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">ב.ל. ייקח את הגבוה מבין שני החישובים</p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ימי חופשת לידה בתשלום
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { days: MIN_LEAVE_DAYS, label: '8 שב׳ — חלקית', desc: '6-9 חודשים' },
              { days: FULL_LEAVE_DAYS, label: '15 שב׳ — מלאה', desc: '10+ חודשים' },
              { days: 126, label: '18 שב׳ — תאומים', desc: '+21 ימים' },
            ].map(({ days, label, desc }) => (
              <button
                key={days}
                type="button"
                onClick={() => setLeaveDays(days)}
                className={`p-2 rounded-lg border-2 text-sm transition text-center ${
                  leaveDays === days
                    ? 'bg-pink-500 text-white border-pink-500'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-pink-300'
                }`}
              >
                <div className="font-bold">{label}</div>
                <div className="text-xs opacity-80">{desc}</div>
              </button>
            ))}
          </div>
          <input
            type="range"
            min={56}
            max={245}
            step={7}
            value={leaveDays}
            onChange={(e) => setLeaveDays(Number(e.target.value))}
            className="w-full mt-3 accent-pink-500"
          />
          <p className="text-xs text-gray-500 text-center mt-1">{leaveDays} ימים ({Math.round(leaveDays / 7)} שבועות)</p>
        </div>

        <InfoBox variant="pink">
          <p className="text-sm font-bold mb-2">מנגנון חישוב הביטוח הלאומי</p>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-white rounded-lg p-2 border border-pink-200">
              <p className="font-bold text-pink-700">שכר קובע</p>
              <p className="text-xs text-gray-600">הגבוה מ-3 חודשים או 6 חודשים</p>
            </div>
            <div className="bg-white rounded-lg p-2 border border-pink-200">
              <p className="font-bold text-pink-700">תשלום יומי</p>
              <p className="text-xs text-gray-600">שכר קובע ÷ 30 ימים</p>
            </div>
            <div className="bg-white rounded-lg p-2 border border-pink-200">
              <p className="font-bold text-pink-700">תקרה יומית</p>
              <p className="text-xs text-gray-600">{formatCurrency(MATERNITY_DAILY_CAP_2026, { decimals: 0 })}/יום</p>
            </div>
            <div className="bg-white rounded-lg p-2 border border-pink-200">
              <p className="font-bold text-pink-700">תקרה חודשית</p>
              <p className="text-xs text-gray-600">{formatCurrency(MATERNITY_MONTHLY_CAP_2026)} (5× שכר ממוצע)</p>
            </div>
          </div>
        </InfoBox>
      </SectionCard>

      {/* תוצאות */}
      {result.effectiveMonthlySalary > 0 && (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <ResultCard
              title="שכר קובע"
              value={formatCurrency(result.effectiveMonthlySalary)}
              subtitle={result.used6MonthCalc ? 'לפי ממוצע 6 חודשים (גבוה יותר)' : 'לפי ממוצע 3 חודשים'}
              variant={result.cappedAtMaximum ? 'warning' : 'primary'}
            />
            <ResultCard
              title="תשלום יומי"
              value={formatCurrency(result.dailyBenefit, { decimals: 2 })}
              subtitle={result.cappedAtMaximum ? 'תקרה מקסימלית' : 'ללא הגבלה'}
              variant={result.cappedAtMaximum ? 'warning' : 'success'}
            />
            <ResultCard
              title="סה״כ דמי לידה"
              value={formatCurrency(result.totalBenefit)}
              subtitle={`${leaveDays} ימים × ${formatCurrency(result.dailyBenefit, { decimals: 0 })}`}
              variant="success"
            />
            <ResultCard
              title="נטו משוערך"
              value={formatCurrency(result.estimatedNetBenefit)}
              subtitle="ללא מס הכנסה + ב.ל."
              variant="success"
            />
          </div>

          {result.warning && (
            <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-4 flex gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-amber-900">{result.warning}</p>
            </div>
          )}

          {/* פירוט */}
          <Breakdown
            title="פירוט חישוב דמי הלידה"
            defaultOpen
            items={[
              { label: 'שכר ממוצע 3 חודשים', value: formatCurrency(salary3Months) },
              ...(salary6Months > 0 ? [{ label: 'שכר ממוצע 6 חודשים', value: formatCurrency(salary6Months) }] : []),
              { label: 'שכר קובע (הגבוה)', value: formatCurrency(result.effectiveMonthlySalary) },
              { label: 'תקרה חודשית ב.ל.', value: formatCurrency(MATERNITY_MONTHLY_CAP_2026) },
              { label: 'תשלום יומי (÷30)', value: formatCurrency(result.dailyBenefit, { decimals: 2 }) },
              { label: 'ימי חופשה', value: `${leaveDays} ימים` },
              { label: 'סה"כ ברוטו', value: formatCurrency(result.totalBenefit) },
              { label: 'מס הכנסה', value: 'פטור לחלוטין', note: 'לפי פקודת מס הכנסה סעיף 9(5)' },
              { label: 'ביטוח לאומי (~3.5%)', value: formatCurrency(result.nationalInsuranceAmount) },
              { label: 'נטו משוערך', value: formatCurrency(result.estimatedNetBenefit), bold: true },
              ...(result.excessLoss > 0 ? [{ label: 'הפסד מעל תקרה', value: formatCurrency(result.excessLoss), bold: false }] : []),
            ]}
          />

          {/* גרף עוגה */}
          <div className="bg-white border-2 border-gray-200 rounded-xl p-5">
            <h3 className="font-bold text-gray-900 mb-4">חלוקת דמי הלידה</h3>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {pieData.map((_, index) => (
                    <Cell key={index} fill={PIE_COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => formatCurrency(Number(v))} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* גרף השוואת שכרים */}
          <div className="bg-white border-2 border-gray-200 rounded-xl p-5">
            <h3 className="font-bold text-gray-900 mb-4">השוואת שכר לעומת תקרות</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={salaryCompare} margin={{ top: 5, right: 10, left: 10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} angle={-10} textAnchor="end" />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${Math.round(v / 1000)}K`} />
                <Tooltip formatter={(v) => formatCurrency(Number(v))} />
                <Bar dataKey="שכר" fill="#ec4899" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* השוואה: אישפוז vs. בית */}
          {hospitalizationDays >= 7 && (
            <div className="bg-white border-2 border-gray-200 rounded-xl p-5">
              <button
                type="button"
                onClick={() => setShowHospitalComparison(!showHospitalComparison)}
                className="w-full flex items-center justify-between text-right"
              >
                <h3 className="font-bold text-gray-900">השוואה: הארכת חופשה vs. חזרה לעבודה בזמן האישפוז</h3>
                <span className="text-pink-500 text-sm font-medium">{showHospitalComparison ? 'הסתר' : 'הצג'}</span>
              </button>

              {showHospitalComparison && hospitalResult && (
                <div className="mt-4 space-y-3">
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div className="bg-pink-50 border border-pink-200 rounded-lg p-3">
                      <h4 className="font-bold text-pink-800 text-sm mb-1">תרחיש א׳: הארכת חופשה</h4>
                      <p className="text-xs text-pink-700">{hospitalResult.hospitalScenario.description}</p>
                      <p className="text-lg font-black text-pink-700 mt-2">{formatCurrency(hospitalResult.hospitalScenario.totalBenefit)}</p>
                    </div>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <h4 className="font-bold text-blue-800 text-sm mb-1">תרחיש ב׳: חזרה לעבודה</h4>
                      <p className="text-xs text-blue-700">{hospitalResult.homeScenario.description}</p>
                      <p className="text-lg font-black text-blue-700 mt-2">{formatCurrency(hospitalResult.homeScenario.totalBenefit)}</p>
                    </div>
                  </div>
                  <InfoBox variant={hospitalResult.difference >= 0 ? 'green' : 'blue'}>
                    <p className="text-sm font-bold">{hospitalResult.recommendation}</p>
                  </InfoBox>
                </div>
              )}
            </div>
          )}

          <InfoBox variant="pink">
            <p className="text-sm font-bold mb-1">חשוב לדעת</p>
            <ul className="text-sm space-y-1">
              <li>• דמי לידה <strong>פטורים ממס הכנסה</strong> — הנטו קרוב לברוטו</li>
              <li>• ייתכן ותשלמי <strong>ביטוח לאומי</strong> (כ-3.5%) גם על דמי הלידה</li>
              <li>• <strong>עצמאית</strong>: החישוב לפי הכנסה החייבת בב.ל., לא שכר</li>
              <li>• עובדת אצל <strong>מספר מעסיקים</strong>: מגישה בקשה נפרדת לכל מעסיק</li>
            </ul>
          </InfoBox>
        </>
      )}
    </div>
  );
};

// ============================================================
// Tab 3: Father Leave
// ============================================================

const FatherTab = ({
  motherSalary,
  setMotherSalary,
  fatherSalary,
  setFatherSalary,
  motherFullEligible,
  setMotherFullEligible,
}: {
  motherSalary: number;
  setMotherSalary: (v: number) => void;
  fatherSalary: number;
  setFatherSalary: (v: number) => void;
  motherFullEligible: boolean;
  setMotherFullEligible: (v: boolean) => void;
}) => {
  const [motherLeaveDays, setMotherLeaveDays] = useState(FULL_LEAVE_DAYS);

  const result = useMemo(
    () =>
      calculateFatherLeave({
        motherFullLeaveEligible: motherFullEligible,
        fatherMonthlySalary: fatherSalary,
        motherMonthlySalary: motherSalary,
        motherLeaveDays,
      }),
    [motherFullEligible, fatherSalary, motherSalary, motherLeaveDays],
  );

  // גרף — השוואה: ימים ותשלום
  const chartData = useMemo(() => [
    {
      name: 'האם בלבד',
      תשלום: Math.round((Math.min(motherSalary, MATERNITY_MONTHLY_CAP_2026) / 30) * motherLeaveDays),
    },
    {
      name: 'אם + אב',
      תשלום: Math.round(result.combinedBenefit),
    },
  ], [motherSalary, motherLeaveDays, result.combinedBenefit]);

  return (
    <div className="space-y-4">
      <SectionCard title="פרטי חופשת האב" icon={<Baby className="w-5 h-5" />}>
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="motherFull"
            checked={motherFullEligible}
            onChange={(e) => setMotherFullEligible(e.target.checked)}
            className="w-5 h-5 rounded accent-pink-500"
          />
          <label htmlFor="motherFull" className="text-sm font-medium text-gray-700 cursor-pointer">
            האם זכאית לחופשה מלאה (10+ חודשי עבודה מתוך 14)
          </label>
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">שכר חודשי האם (₪)</label>
            <input
              type="number"
              min={0}
              max={200000}
              step={500}
              value={motherSalary}
              onChange={(e) => setMotherSalary(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-400 text-xl font-bold"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">שכר חודשי האב (₪)</label>
            <input
              type="number"
              min={0}
              max={200000}
              step={500}
              value={fatherSalary}
              onChange={(e) => setFatherSalary(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-400 text-xl font-bold"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ימי חופשה שהאם תיקח: {motherLeaveDays} ימים
          </label>
          <input
            type="range"
            min={56}
            max={FULL_LEAVE_DAYS}
            step={7}
            value={motherLeaveDays}
            onChange={(e) => setMotherLeaveDays(Number(e.target.value))}
            className="w-full accent-pink-500"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>8 שבועות</span>
            <span>15 שבועות</span>
          </div>
        </div>

        <InfoBox variant="blue">
          <p className="text-sm font-bold mb-2">תנאי זכאות לחופשת אב</p>
          <ul className="text-sm space-y-1.5">
            <li>• האם זכאית לחופשה <strong>מלאה</strong> (15 שבועות)</li>
            <li>• האם לוקחת לפחות <strong>21 ימים</strong> בעצמה</li>
            <li>• האב לוקח את <strong>7 הימים האחרונים</strong> של חופשת האם</li>
            <li>• לא ניתן שניהם ביחד — האם חוזרת לעבודה כשהאב בחופשה</li>
          </ul>
        </InfoBox>
      </SectionCard>

      {/* תוצאות */}
      <div className="grid sm:grid-cols-3 gap-4">
        <ResultCard
          title="ימי חופשת אב"
          value={`${result.fatherLeaveDays} ימים`}
          subtitle={result.fatherLeaveDays > 0 ? '7 ימים — שבוע שלם' : 'אינו זכאי'}
          variant={result.fatherLeaveDays > 0 ? 'success' : 'warning'}
        />
        <ResultCard
          title="תשלום לאב"
          value={formatCurrency(result.fatherTotalBenefit)}
          subtitle={result.fatherLeaveDays > 0 ? `${result.fatherLeaveDays} ימים × ${formatCurrency(result.fatherDailyBenefit, { decimals: 0 })}` : '—'}
          variant={result.fatherLeaveDays > 0 ? 'success' : 'primary'}
        />
        <ResultCard
          title="תועלת משפחתית כוללת"
          value={formatCurrency(result.combinedBenefit)}
          subtitle="אם + אב ביחד"
          variant="success"
        />
      </div>

      <InfoBox variant={result.fatherLeaveDays > 0 ? 'green' : 'amber'}>
        <p className="text-sm">{result.explanation}</p>
      </InfoBox>

      {/* גרף השוואה */}
      {fatherSalary > 0 && motherSalary > 0 && (
        <div className="bg-white border-2 border-gray-200 rounded-xl p-5">
          <h3 className="font-bold text-gray-900 mb-4">תועלת כלכלית: ניצול חופשת האב</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tickFormatter={(v) => `${Math.round(v / 1000)}K ₪`} tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v) => formatCurrency(Number(v))} />
              <Bar dataKey="תשלום" fill="#ec4899" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          {result.fatherLeaveDays > 0 && (
            <p className="text-center text-sm text-green-700 font-medium mt-2">
              רווח נוסף: {formatCurrency(result.fatherTotalBenefit)} מניצול חופשת האב
            </p>
          )}
        </div>
      )}

      <Breakdown
        title="פירוט חישוב חופשת האב"
        items={[
          { label: 'זכאות האם', value: motherFullEligible ? 'חופשה מלאה (15 שב׳)' : 'חופשה חלקית — אב לא זכאי' },
          { label: 'ימי חופשת האם', value: `${motherLeaveDays} ימים` },
          { label: 'ימי חופשה לאב', value: `${result.fatherLeaveDays} ימים` },
          { label: 'שכר האב', value: formatCurrency(fatherSalary) },
          { label: 'שכר קובע לאב', value: formatCurrency(Math.min(fatherSalary, MATERNITY_MONTHLY_CAP_2026)) },
          { label: 'תשלום יומי לאב', value: formatCurrency(result.fatherDailyBenefit, { decimals: 2 }) },
          { label: 'תשלום לאב', value: formatCurrency(result.fatherTotalBenefit), bold: true },
          { label: 'ימי האם (שנותרים)', value: `${result.motherRemainingDays} ימים` },
          { label: 'תועלת משפחתית כוללת', value: formatCurrency(result.combinedBenefit), bold: true },
        ]}
      />

      <Recommendations items={result.recommendations} variant="pink" />
    </div>
  );
};

// ============================================================
// Tab 4: Job Protection Timeline
// ============================================================

const ProtectionTab = ({
  leaveDays,
}: {
  leaveDays: number;
}) => {
  const [birthDateStr, setBirthDateStr] = useState(() => {
    const d = new Date();
    return d.toISOString().split('T')[0];
  });

  const result = useMemo(() => {
    try {
      return calculateJobProtection({ birthDate: birthDateStr, leaveDays });
    } catch {
      return null;
    }
  }, [birthDateStr, leaveDays]);

  return (
    <div className="space-y-4">
      <SectionCard title="ציר זמן הגנת המשרה" icon={<Shield className="w-5 h-5" />}>
        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              תאריך הלידה
            </label>
            <input
              type="date"
              value={birthDateStr}
              onChange={(e) => setBirthDateStr(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-400"
            />
          </div>
          <div className="flex items-center">
            <div className="bg-pink-50 border border-pink-200 rounded-lg p-3 w-full">
              <p className="text-sm font-bold text-pink-800">ימי חופשה: {leaveDays}</p>
              <p className="text-xs text-pink-700">שנה בלשונית "חישוב תשלום"</p>
            </div>
          </div>
        </div>

        <InfoBox variant="pink">
          <p className="text-sm font-bold mb-2">הגנות חוק עבודת נשים</p>
          <div className="grid sm:grid-cols-3 gap-2 text-sm">
            <div className="bg-white rounded-lg p-2 border border-pink-200">
              <p className="font-bold text-pink-700">בזמן החופשה</p>
              <p className="text-xs text-gray-600">אסור לפטר בכלל</p>
            </div>
            <div className="bg-white rounded-lg p-2 border border-pink-200">
              <p className="font-bold text-pink-700">60 יום אחרי</p>
              <p className="text-xs text-gray-600">פיטורים רק עם אישור שר</p>
            </div>
            <div className="bg-white rounded-lg p-2 border border-pink-200">
              <p className="font-bold text-pink-700">שעת הנקה</p>
              <p className="text-xs text-gray-600">{BREASTFEEDING_HOUR_MONTHS} חודשים בתשלום</p>
            </div>
          </div>
        </InfoBox>
      </SectionCard>

      {result && (
        <>
          {/* ציר זמן */}
          <div className="bg-white border-2 border-gray-200 rounded-xl p-5">
            <h3 className="font-bold text-gray-900 mb-5 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-pink-500" />
              ציר זמן מלא
            </h3>
            <div className="space-y-3">
              {result.timeline.map((phase, i) => (
                <div
                  key={i}
                  className={`flex items-start gap-3 p-3 rounded-lg border-2 ${
                    phase.isProtected
                      ? 'bg-green-50 border-green-300'
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                    phase.isProtected ? 'bg-green-500 text-white' : 'bg-gray-400 text-white'
                  }`}>
                    {i + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h4 className={`font-bold text-sm ${phase.isProtected ? 'text-green-800' : 'text-gray-800'}`}>
                        {phase.phase}
                      </h4>
                      {phase.isProtected && (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                          מוגן
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 mt-0.5">{phase.description}</p>
                    <p className="text-xs font-medium text-gray-700 mt-1">
                      {phase.startDate} — {phase.endDate}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* כרטיסי מידע */}
          <div className="grid sm:grid-cols-2 gap-4">
            <ResultCard
              title="סיום החופשה"
              value={result.leaveEndDate}
              subtitle={`אחרי ${leaveDays} ימי חופשה`}
              variant="primary"
            />
            <ResultCard
              title="סיום הגנת המשרה"
              value={result.protectionEndDate}
              subtitle={`${JOB_PROTECTION_DAYS_AFTER_RETURN} ימים אחרי החזרה`}
              variant="success"
            />
          </div>

          <InfoBox variant="green">
            <p className="text-sm font-bold mb-1">שעת הנקה</p>
            <p className="text-sm">{result.breastfeedingProtection}</p>
          </InfoBox>

          {/* הגנות נוספות */}
          <InfoBox variant="blue">
            <p className="text-sm font-bold mb-2">הגנות נוספות שחשוב לדעת</p>
            <ul className="text-sm space-y-1.5">
              <li>• <strong>אי-הרעת תנאים</strong>: בזמן החופשה ו-60 הימים שאחריה, אסור להרע תנאי עבודה</li>
              <li>• <strong>חזרה לאותו תפקיד</strong>: זכות לחזור לתפקיד זהה או שווה</li>
              <li>• <strong>הריון</strong>: הגנות נוספות מתחילות כבר בהריון (לא רק אחרי לידה)</li>
              <li>• <strong>טיפולי פוריות (IVF)</strong>: הגנות מיוחדות על עובדת בטיפולים</li>
              <li>• <strong>פיטורים אסורים</strong>: גם בשל הגשת תביעת דמי לידה</li>
            </ul>
          </InfoBox>
        </>
      )}
    </div>
  );
};

// ============================================================
// Tab 5: Breastfeeding Hour Value
// ============================================================

const BreastfeedingTab = ({
  monthlySalary,
  setMonthlySalary,
}: {
  monthlySalary: number;
  setMonthlySalary: (v: number) => void;
}) => {
  const [workHoursPerDay, setWorkHoursPerDay] = useState(8);
  const [showMonthlyChart, setShowMonthlyChart] = useState(true);

  const result = useMemo(
    () =>
      calculateBreastfeedingValue({
        monthlySalary,
        workHoursPerDay,
      }),
    [monthlySalary, workHoursPerDay],
  );

  // גרף — שווי לפי חודשים
  const chartData = useMemo(() => {
    const months: { חודש: string; שווי: number; מצטבר: number }[] = [];
    let cumulative = 0;
    for (let m = 1; m <= BREASTFEEDING_HOUR_MONTHS; m++) {
      cumulative += result.monthlyBreastfeedingValue;
      months.push({
        חודש: `חודש ${m}`,
        שווי: Math.round(result.monthlyBreastfeedingValue),
        מצטבר: Math.round(cumulative),
      });
    }
    return months;
  }, [result.monthlyBreastfeedingValue]);

  // השוואה לפי שעות עבודה
  const hoursCompare = useMemo(() => {
    return [7, 8, 9, 10].map((h) => {
      const r = calculateBreastfeedingValue({ monthlySalary, workHoursPerDay: h });
      return {
        'שעות ביום': `${h} שעות`,
        'שווי חודשי': Math.round(r.monthlyBreastfeedingValue),
        'שכר שעתי': Math.round(r.hourlyRate),
      };
    });
  }, [monthlySalary]);

  return (
    <div className="space-y-4">
      <SectionCard title="שווי שעת ההנקה" icon={<Clock className="w-5 h-5" />}>
        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              שכר חודשי ברוטו (₪)
            </label>
            <input
              type="number"
              min={0}
              max={200000}
              step={500}
              value={monthlySalary}
              onChange={(e) => setMonthlySalary(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-400 text-xl font-bold"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              שעות עבודה ביום
            </label>
            <select
              value={workHoursPerDay}
              onChange={(e) => setWorkHoursPerDay(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-400"
            >
              <option value={6}>6 שעות</option>
              <option value={7}>7 שעות</option>
              <option value={8}>8 שעות</option>
              <option value={9}>9 שעות</option>
              <option value={10}>10 שעות</option>
            </select>
          </div>
        </div>

        <InfoBox variant="pink">
          <p className="text-sm font-bold mb-1">מה זו שעת הנקה?</p>
          <p className="text-sm">
            לפי חוק עבודת נשים, אם שחזרה לעבודה זכאית לשעה אחת בתשלום ביום, לצורך הנקה — במשך{' '}
            <strong>{BREASTFEEDING_HOUR_MONTHS} החודשים הראשונים</strong> לאחר החזרה. לא כרוכה בהפחתת שכר.
          </p>
        </InfoBox>
      </SectionCard>

      {monthlySalary > 0 && (
        <>
          <div className="grid sm:grid-cols-3 gap-4">
            <ResultCard
              title="שכר שעתי"
              value={formatCurrency(result.hourlyRate, { decimals: 0 })}
              subtitle={`${monthlySalary.toLocaleString('he-IL')} ÷ (22 × ${workHoursPerDay})`}
              variant="primary"
            />
            <ResultCard
              title="שווי חודשי"
              value={formatCurrency(result.monthlyBreastfeedingValue)}
              subtitle="22 ימי עבודה × שכר שעתי"
              variant="success"
            />
            <ResultCard
              title="סה״כ ל-4 חודשים"
              value={formatCurrency(result.totalBreastfeedingValue)}
              subtitle="שווי כולל של זכות ההנקה"
              variant="success"
            />
          </div>

          <InfoBox variant="green">
            <p className="text-sm">{result.explanation}</p>
          </InfoBox>

          {/* גרף — שווי לפי חודשים */}
          <div className="bg-white border-2 border-gray-200 rounded-xl p-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-gray-900">שווי שעת ההנקה לאורך 4 חודשים</h3>
              <button
                type="button"
                onClick={() => setShowMonthlyChart(!showMonthlyChart)}
                className="text-sm text-pink-500 font-medium"
              >
                {showMonthlyChart ? 'שווי מצטבר' : 'שווי חודשי'}
              </button>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="חודש" tick={{ fontSize: 12 }} />
                <YAxis tickFormatter={(v) => `${Math.round(v).toLocaleString('he-IL')} ₪`} tick={{ fontSize: 11 }} width={75} />
                <Tooltip formatter={(v) => formatCurrency(Number(v))} />
                <Bar
                  dataKey={showMonthlyChart ? 'שווי' : 'מצטבר'}
                  fill="#ec4899"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* השוואה לפי שעות */}
          <div className="bg-white border-2 border-gray-200 rounded-xl p-5">
            <h3 className="font-bold text-gray-900 mb-4">השוואת שווי לפי שעות עבודה יומיות</h3>
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-pink-50">
                  <th className="px-3 py-2 text-right font-semibold text-gray-700">שעות ביום</th>
                  <th className="px-3 py-2 text-center font-semibold text-gray-700">שכר שעתי</th>
                  <th className="px-3 py-2 text-center font-semibold text-gray-700">שווי חודשי</th>
                  <th className="px-3 py-2 text-center font-semibold text-gray-700">שווי 4 חודשים</th>
                </tr>
              </thead>
              <tbody>
                {hoursCompare.map((row, i) => (
                  <tr
                    key={i}
                    className={`border-t border-gray-100 ${row['שעות ביום'] === `${workHoursPerDay} שעות` ? 'bg-pink-50 font-semibold' : ''}`}
                  >
                    <td className="px-3 py-2">{row['שעות ביום']}</td>
                    <td className="px-3 py-2 text-center">{formatCurrency(row['שכר שעתי'])}</td>
                    <td className="px-3 py-2 text-center">{formatCurrency(row['שווי חודשי'])}</td>
                    <td className="px-3 py-2 text-center">{formatCurrency(row['שווי חודשי'] * BREASTFEEDING_HOUR_MONTHS)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Breakdown
            title="פירוט חישוב שעת ההנקה"
            items={[
              { label: 'שכר חודשי ברוטו', value: formatCurrency(monthlySalary) },
              { label: 'ימי עבודה בחודש', value: '22 ימים' },
              { label: 'שעות עבודה ביום', value: `${workHoursPerDay} שעות` },
              { label: 'שכר שעתי', value: formatCurrency(result.hourlyRate, { decimals: 2 }) },
              { label: 'שווי שעה ביום', value: formatCurrency(result.dailyBreastfeedingValue, { decimals: 2 }) },
              { label: 'שווי חודשי (22 ימים)', value: formatCurrency(result.monthlyBreastfeedingValue) },
              { label: `שווי ${BREASTFEEDING_HOUR_MONTHS} חודשים`, value: formatCurrency(result.totalBreastfeedingValue), bold: true },
            ]}
          />

          <InfoBox variant="blue">
            <p className="text-sm font-bold mb-1">חשוב לדעת על שעת הנקה</p>
            <ul className="text-sm space-y-1">
              <li>• שעת הנקה היא <strong>זכות חוקית</strong> — המעסיק לא יכול לסרב</li>
              <li>• ניתן לצבור ולקחת שעתיים כל יומיים, לפי הסדר עם המעסיק</li>
              <li>• מגיעה גם אם <strong>לא מניקה בפועל</strong> — זו שעת "טיפול בתינוק"</li>
              <li>• לאחר {BREASTFEEDING_HOUR_MONTHS} חודשים — הזכות פוקעת אוטומטית</li>
            </ul>
          </InfoBox>
        </>
      )}
    </div>
  );
};

// ============================================================
// Main Component
// ============================================================

export function MaternityBenefitsCalculator() {
  const [activeTab, setActiveTab] = useState<TabMode>('eligibility');

  // Shared state
  const [salary3Months, setSalary3Months] = useState(12_000);
  const [salary6Months, setSalary6Months] = useState(0);
  const [fatherSalary, setFatherSalary] = useState(15_000);
  const [leaveDays, setLeaveDays] = useState(FULL_LEAVE_DAYS);

  // Eligibility tab state
  const [monthsWorked, setMonthsWorked] = useState(12);
  const [numberOfBabies, setNumberOfBabies] = useState(1);
  const [isPremature, setIsPremature] = useState(false);
  const [hospitalizationDays, setHospitalizationDays] = useState(0);

  // Father tab state
  const [motherFullEligible, setMotherFullEligible] = useState(true);

  return (
    <div className="space-y-6" dir="rtl">
      {/* Tab Navigation */}
      <div className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden">
        <div className="flex flex-wrap border-b border-gray-200">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 min-w-[120px] px-3 py-3 text-sm font-medium transition-colors flex items-center justify-center gap-1.5 ${
                activeTab === tab.id
                  ? 'bg-pink-500 text-white border-b-2 border-pink-500'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'eligibility' && (
        <EligibilityTab
          monthsWorked={monthsWorked}
          setMonthsWorked={setMonthsWorked}
          numberOfBabies={numberOfBabies}
          setNumberOfBabies={setNumberOfBabies}
          isPremature={isPremature}
          setIsPremature={setIsPremature}
          hospitalizationDays={hospitalizationDays}
          setHospitalizationDays={setHospitalizationDays}
        />
      )}
      {activeTab === 'pay' && (
        <PayTab
          salary3Months={salary3Months}
          setSalary3Months={setSalary3Months}
          salary6Months={salary6Months}
          setSalary6Months={setSalary6Months}
          leaveDays={leaveDays}
          setLeaveDays={setLeaveDays}
          hospitalizationDays={hospitalizationDays}
        />
      )}
      {activeTab === 'father' && (
        <FatherTab
          motherSalary={salary3Months}
          setMotherSalary={setSalary3Months}
          fatherSalary={fatherSalary}
          setFatherSalary={setFatherSalary}
          motherFullEligible={motherFullEligible}
          setMotherFullEligible={setMotherFullEligible}
        />
      )}
      {activeTab === 'protection' && (
        <ProtectionTab leaveDays={leaveDays} />
      )}
      {activeTab === 'breastfeeding' && (
        <BreastfeedingTab
          monthlySalary={salary3Months}
          setMonthlySalary={setSalary3Months}
        />
      )}
    </div>
  );
}
