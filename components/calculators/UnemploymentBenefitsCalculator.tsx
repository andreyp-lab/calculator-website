'use client';

import { useState, useMemo } from 'react';
import {
  calculateEligibility,
  calculateDailyPay,
  calculateWorkIncomeDuringUnemployment,
  buildPaymentSchedule,
  estimateTaxOnBenefits,
  AVERAGE_NATIONAL_WAGE_2026,
  DAILY_CAP_FIRST_125,
  DAILY_CAP_AFTER_125,
  FULL_RATE_DAYS,
  WAITING_DAYS_DISMISSAL,
  WAITING_DAYS_RESIGNATION,
  type ResignationReason,
} from '@/lib/calculators/unemployment-benefits';
import { formatCurrency, formatPercent } from '@/lib/utils/formatters';
import { ResultCard } from '@/components/calculator/ResultCard';
import { Breakdown } from '@/components/calculator/Breakdown';
import { AlertCircle, Info, CheckCircle } from 'lucide-react';
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
  LineChart,
  Line,
  ReferenceLine,
} from 'recharts';

// ============================================================
// Types & Constants
// ============================================================

type TabMode = 'eligibility' | 'pay' | 'work_income' | 'tax';

const TABS: { id: TabMode; label: string; emoji: string }[] = [
  { id: 'eligibility', label: 'בדיקת זכאות', emoji: '✅' },
  { id: 'pay', label: 'חישוב תשלום', emoji: '💰' },
  { id: 'work_income', label: 'עבודה חלקית', emoji: '💼' },
  { id: 'tax', label: 'השפעת מס', emoji: '🧾' },
];

const RESIGNATION_LABELS: Record<ResignationReason, string> = {
  none: 'התפטרות רגילה (ללא עילה)',
  qualified_spouse_relocation: 'מעבר דירה בגלל עבודת בן/בת הזוג',
  qualified_health: 'סיבות בריאות (אישור רפואי)',
  qualified_working_conditions: 'הרעה מהותית בתנאי עבודה',
  qualified_contract_end: 'סיום חוזה קצוב ללא חידוש',
  qualified_harassment: 'הטרדה מינית או פגיעה אישית',
};

// ============================================================
// Shared sub-components
// ============================================================

const SectionCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="bg-white border-2 border-gray-200 rounded-xl p-6 space-y-5">
    <h2 className="text-lg font-bold text-gray-900">{title}</h2>
    {children}
  </div>
);

const InfoBox = ({
  children,
  variant = 'blue',
}: {
  children: React.ReactNode;
  variant?: 'blue' | 'amber' | 'red' | 'green';
}) => {
  const classes = {
    blue: 'bg-blue-50 border-blue-200 text-blue-900',
    amber: 'bg-amber-50 border-amber-200 text-amber-900',
    red: 'bg-red-50 border-red-200 text-red-900',
    green: 'bg-green-50 border-green-200 text-green-900',
  };
  return <div className={`border rounded-xl p-4 ${classes[variant]}`}>{children}</div>;
};

const Recommendations = ({ items }: { items: string[] }) => {
  if (items.length === 0) return null;
  return (
    <InfoBox variant="amber">
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
    </InfoBox>
  );
};

// ============================================================
// Tab: Eligibility Checker
// ============================================================
const EligibilityTab = () => {
  const [age, setAge] = useState(32);
  const [hasChildren, setHasChildren] = useState(false);
  const [wasDismissed, setWasDismissed] = useState(true);
  const [resignationReason, setResignationReason] = useState<ResignationReason>('none');
  const [insuredMonths, setInsuredMonths] = useState(14);
  const [isPriorClaim, setIsPriorClaim] = useState(false);
  const [remainingDays, setRemainingDays] = useState(0);

  const result = useMemo(
    () =>
      calculateEligibility({
        age,
        hasChildren,
        wasDismissed,
        resignationReason: wasDismissed ? undefined : resignationReason,
        insuredMonthsIn18: insuredMonths,
        isPriorClaim,
        remainingDaysFromPrior: remainingDays,
      }),
    [age, hasChildren, wasDismissed, resignationReason, insuredMonths, isPriorClaim, remainingDays],
  );

  const ageGroupLabels: Record<string, string> = {
    under25: 'מתחת לגיל 25',
    '25to28': 'גיל 25–28',
    '28to35': 'גיל 28–35',
    '35to45': 'גיל 35–45',
    above45: 'מעל גיל 45',
  };

  return (
    <div className="space-y-4">
      <SectionCard title="פרטים אישיים ותעסוקתיים">
        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">גיל</label>
            <input
              type="number"
              min={16}
              max={70}
              value={age}
              onChange={(e) => setAge(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xl font-bold"
            />
            <p className="text-xs text-gray-500 mt-1">זכאות: גיל 20–66</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              חודשי ביטוח ב-18 חודשים האחרונים
            </label>
            <input
              type="number"
              min={0}
              max={18}
              value={insuredMonths}
              onChange={(e) => setInsuredMonths(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xl font-bold"
            />
            <p className="text-xs text-gray-500 mt-1">
              נדרש: {hasChildren ? '9' : '12'} חודשים{hasChildren ? ' (בעל/ת משפחה)' : ''}
            </p>
          </div>
        </div>

        <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer">
          <input
            type="checkbox"
            checked={hasChildren}
            onChange={(e) => setHasChildren(e.target.checked)}
            className="w-4 h-4 rounded"
          />
          <div>
            <span className="text-sm font-medium">יש ילדים מתחת לגיל 18</span>
            <p className="text-xs text-gray-500">
              משפיע על תקופת הזכאות ועל דרישת הותק (9 חודשים במקום 12)
            </p>
          </div>
        </label>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            סיבת הפסקת עבודה
          </label>
          <div className="space-y-2">
            <label className="flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-colors border-blue-300 bg-blue-50">
              <input
                type="radio"
                name="dismissal"
                checked={wasDismissed}
                onChange={() => setWasDismissed(true)}
                className="w-4 h-4"
              />
              <div>
                <span className="text-sm font-medium">פוטרתי מעבודה</span>
                <p className="text-xs text-gray-600">5 ימי המתנה בלבד</p>
              </div>
            </label>
            <label className="flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-colors border-gray-200 bg-white">
              <input
                type="radio"
                name="dismissal"
                checked={!wasDismissed}
                onChange={() => setWasDismissed(false)}
                className="w-4 h-4"
              />
              <div>
                <span className="text-sm font-medium">התפטרתי</span>
                <p className="text-xs text-gray-600">90 ימי המתנה (אלא אם עילה מוצדקת)</p>
              </div>
            </label>
          </div>
        </div>

        {!wasDismissed && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              סיבת ההתפטרות
            </label>
            <select
              value={resignationReason}
              onChange={(e) => setResignationReason(e.target.value as ResignationReason)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {Object.entries(RESIGNATION_LABELS).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
            {resignationReason !== 'none' && (
              <InfoBox variant="green">
                <p className="text-sm">
                  התפטרות מסיבה מוצדקת — לא תחול תקופת המתנה של 90 יום. כדאי לתעד את הסיבה.
                </p>
              </InfoBox>
            )}
          </div>
        )}

        <div className="border-t pt-4">
          <label className="flex items-center gap-3 cursor-pointer mb-3">
            <input
              type="checkbox"
              checked={isPriorClaim}
              onChange={(e) => setIsPriorClaim(e.target.checked)}
              className="w-4 h-4 rounded"
            />
            <span className="text-sm font-medium">אבטלה חוזרת (תוך 4 שנים מהפעם הקודמת)</span>
          </label>
          {isPriorClaim && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ימי זכאות שנותרו מהתביעה הקודמת
              </label>
              <input
                type="number"
                min={0}
                max={175}
                value={remainingDays}
                onChange={(e) => setRemainingDays(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          )}
        </div>
      </SectionCard>

      {/* תוצאת זכאות */}
      {result.isEligible ? (
        <div className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-300 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <CheckCircle className="w-8 h-8 text-green-600 flex-shrink-0" />
            <div>
              <h3 className="text-xl font-bold text-green-900">זכאי לדמי אבטלה</h3>
              <p className="text-green-700 text-sm">עומד בכל תנאי הסף</p>
            </div>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-3 border border-green-200 text-center">
              <p className="text-2xl font-black text-green-700">{result.maxEntitlementDays}</p>
              <p className="text-xs text-gray-600">ימי זכאות מרביים</p>
            </div>
            <div className="bg-white rounded-lg p-3 border border-green-200 text-center">
              <p className="text-2xl font-black text-amber-600">{result.waitingDays}</p>
              <p className="text-xs text-gray-600">ימי המתנה לפני תשלום</p>
            </div>
            <div className="bg-white rounded-lg p-3 border border-green-200 text-center">
              <p className="text-sm font-bold text-gray-800">{ageGroupLabels[result.ageGroup]}</p>
              <p className="text-xs text-gray-600">קבוצת גיל</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-red-50 border-2 border-red-300 rounded-xl p-6 flex gap-4">
          <AlertCircle className="w-8 h-8 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-xl font-bold text-red-900 mb-2">אינך זכאי לדמי אבטלה</h3>
            <ul className="space-y-1">
              {result.reasons.map((r, i) => (
                <li key={i} className="text-sm text-red-800 flex gap-2">
                  <span>•</span>
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* הערות */}
      {result.notes.length > 0 && (
        <InfoBox variant="blue">
          <h4 className="text-sm font-bold mb-2 flex items-center gap-2">
            <Info className="w-4 h-4" />
            פרטים נוספים
          </h4>
          <ul className="space-y-1.5">
            {result.notes.map((note, i) => (
              <li key={i} className="text-sm flex gap-2">
                <span className="flex-shrink-0">📋</span>
                <span>{note}</span>
              </li>
            ))}
          </ul>
        </InfoBox>
      )}

      {/* טבלת תקופות זכאות */}
      <SectionCard title="תקופות זכאות לפי גיל ומשפחה">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-blue-50">
                <th className="px-3 py-2 text-right font-semibold text-gray-700">קבוצת גיל</th>
                <th className="px-3 py-2 text-center font-semibold text-gray-700">ללא ילדים</th>
                <th className="px-3 py-2 text-center font-semibold text-gray-700">עם ילדים</th>
              </tr>
            </thead>
            <tbody>
              {[
                { label: '20–24', noKids: 50, withKids: 100 },
                { label: '25–27', noKids: 100, withKids: 100 },
                { label: '28–34', noKids: 138, withKids: 138 },
                { label: '35–44', noKids: 138, withKids: 175 },
                { label: '45+', noKids: 175, withKids: 175 },
              ].map((row, i) => (
                <tr
                  key={i}
                  className={`border-t border-gray-100 ${
                    ageGroupLabels[result.ageGroup]?.includes(row.label.split('–')[0]) ? 'bg-blue-50 font-semibold' : ''
                  }`}
                >
                  <td className="px-3 py-2">{row.label}</td>
                  <td className="px-3 py-2 text-center">{row.noKids} ימים</td>
                  <td className="px-3 py-2 text-center">{row.withKids} ימים</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-500">* גיל 25+ ללא ילדים — 100 ימים גם כן</p>
      </SectionCard>
    </div>
  );
};

// ============================================================
// Tab: Pay Calculator
// ============================================================
const PayTab = () => {
  const [averageSalary, setAverageSalary] = useState(12_000);
  const [age, setAge] = useState(32);
  const [hasChildren, setHasChildren] = useState(false);

  const result = useMemo(
    () => calculateDailyPay({ averageMonthlySalary: averageSalary, age, hasChildren }),
    [averageSalary, age, hasChildren],
  );

  const schedule = useMemo(
    () =>
      buildPaymentSchedule(
        result.dailyBenefitFirst125,
        result.dailyBenefitAfter125,
        result.maxDays,
        WAITING_DAYS_DISMISSAL,
      ),
    [result],
  );

  // נתוני גרף קו — תשלום מצטבר
  const cumulativeData = useMemo(() => {
    return schedule.map((s) => ({
      period: s.label,
      'תשלום מצטבר': Math.round(s.cumulativePayment),
      'תשלום דו-שבועי': Math.round(s.periodPayment),
    }));
  }, [schedule]);

  // Pie chart — חלוקת סך התשלום
  const pieData = useMemo(() => {
    const items = [
      { name: `125 ימים ראשונים (${result.dailyBenefitFirst125.toFixed(0)} ₪/יום)`, value: Math.round(result.totalFirst125) },
    ];
    if (result.remainingDays > 0) {
      items.push({
        name: `${result.remainingDays} ימים נוספים (${result.dailyBenefitAfter125.toFixed(0)} ₪/יום)`,
        value: Math.round(result.totalAfter125),
      });
    }
    return items;
  }, [result]);

  const PIE_COLORS = ['#3b82f6', '#f59e0b'];

  // גרף עמודות — השוואת שכר מלא מול דמי אבטלה
  const comparisonData = [
    { name: 'שכר מלא', value: Math.round(averageSalary) },
    { name: `דמי אבטלה\n(125 ימים ראשונים)`, value: Math.round(result.monthlyEquivalentFirst125) },
    ...(result.remainingDays > 0
      ? [{ name: `דמי אבטלה\n(מיום 126)`, value: Math.round(result.monthlyEquivalentAfter125) }]
      : []),
  ];

  return (
    <div className="space-y-4">
      <SectionCard title="פרטי המשכורת">
        <div className="grid sm:grid-cols-3 gap-5">
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              שכר חודשי ברוטו ממוצע — 6 חודשים אחרונים (₪)
            </label>
            <input
              type="number"
              min={0}
              max={100_000}
              step={500}
              value={averageSalary}
              onChange={(e) => setAverageSalary(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xl font-bold"
            />
            <p className="text-xs text-gray-500 mt-1">
              שכר יומי: {formatCurrency(result.dailySalary, { decimals: 2 })} | שכר ממוצע
              ארצי: {formatCurrency(AVERAGE_NATIONAL_WAGE_2026)}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">גיל</label>
            <input
              type="number"
              min={20}
              max={66}
              value={age}
              onChange={(e) => setAge(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer">
          <input
            type="checkbox"
            checked={hasChildren}
            onChange={(e) => setHasChildren(e.target.checked)}
            className="w-4 h-4 rounded"
          />
          <span className="text-sm font-medium">יש ילדים מתחת לגיל 18</span>
        </label>

        {/* מדרגות שכר */}
        <div className="grid grid-cols-3 gap-3 text-center">
          {[
            { label: 'עד 60% מהממוצע', threshold: `${formatCurrency(AVERAGE_NATIONAL_WAGE_2026 * 0.6)}`, rate: '80%', active: result.benefitRate === 0.8 },
            { label: '60–80% מהממוצע', threshold: `${formatCurrency(AVERAGE_NATIONAL_WAGE_2026 * 0.8)}`, rate: '60%', active: result.benefitRate === 0.6 },
            { label: 'מעל 80% מהממוצע', threshold: `מעל ${formatCurrency(AVERAGE_NATIONAL_WAGE_2026 * 0.8)}`, rate: '50%', active: result.benefitRate === 0.5 },
          ].map((bracket, i) => (
            <div
              key={i}
              className={`rounded-xl p-3 border-2 transition-all ${
                bracket.active
                  ? 'border-blue-400 bg-blue-50 shadow-sm'
                  : 'border-gray-200 bg-white'
              }`}
            >
              <p className={`text-2xl font-black ${bracket.active ? 'text-blue-700' : 'text-gray-500'}`}>
                {bracket.rate}
              </p>
              <p className="text-xs text-gray-600 mt-1">{bracket.label}</p>
              <p className="text-xs text-gray-400">{bracket.threshold}</p>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* כרטיסי תוצאה */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <ResultCard
          title="סה&quot;כ דמי אבטלה"
          value={formatCurrency(result.totalGross)}
          subtitle={`${result.maxDays} ימי זכאות`}
          variant="success"
        />
        <ResultCard
          title="תשלום יומי (125 ראשונים)"
          value={formatCurrency(result.dailyBenefitFirst125, { decimals: 2 })}
          subtitle={`${formatPercent(result.benefitRate, 0)} מהשכר`}
          variant="primary"
        />
        <ResultCard
          title="שווה ערך חודשי"
          value={formatCurrency(result.monthlyEquivalentFirst125)}
          subtitle="ב-30 ימים"
          variant="primary"
        />
        <ResultCard
          title="אחוז הכיסוי"
          value={formatPercent(
            Math.min(result.monthlyEquivalentFirst125 / averageSalary, 1),
            0,
          )}
          subtitle="מהשכר המלא"
          variant={result.benefitRate >= 0.7 ? 'success' : 'warning'}
        />
      </div>

      {result.isCapped && (
        <div className="bg-amber-50 border-2 border-amber-300 rounded-xl p-4 flex gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-amber-900">תשלום מוגבל לתקרה</h4>
            <p className="text-sm text-amber-800">{result.capNote}</p>
          </div>
        </div>
      )}

      {/* פירוט חישוב */}
      <Breakdown
        title="פירוט מלא של החישוב"
        defaultOpen
        items={[
          { label: 'שכר חודשי ממוצע', value: formatCurrency(averageSalary) },
          { label: 'שכר יומי (÷30)', value: formatCurrency(result.dailySalary, { decimals: 2 }) },
          { label: 'שכר ממוצע ארצי (2026)', value: formatCurrency(AVERAGE_NATIONAL_WAGE_2026) },
          { label: 'יחס לשכר הממוצע', value: `${(result.wageRatio * 100).toFixed(1)}%` },
          { label: 'מדרגת שכר', value: result.bracket },
          { label: 'שיעור דמי אבטלה', value: formatPercent(result.benefitRate, 0) },
          { label: 'שכר יומי × שיעור', value: formatCurrency(result.dailySalary * result.benefitRate, { decimals: 2 }) },
          { label: 'תקרה יומית (125 ימים ראשונים)', value: `${DAILY_CAP_FIRST_125} ₪` },
          { label: 'תקרה יומית (מיום 126)', value: `${DAILY_CAP_AFTER_125} ₪` },
          { label: 'תשלום יומי בפועל (125 ראשונים)', value: formatCurrency(result.dailyBenefitFirst125, { decimals: 2 }) },
          ...(result.remainingDays > 0
            ? [{ label: `תשלום יומי בפועל (ימים ${FULL_RATE_DAYS + 1}–${result.maxDays})`, value: formatCurrency(result.dailyBenefitAfter125, { decimals: 2 }) }]
            : []),
          { label: `תשלום עבור ${result.first125Days} ימים ראשונים`, value: formatCurrency(result.totalFirst125) },
          ...(result.remainingDays > 0
            ? [{ label: `תשלום עבור ${result.remainingDays} ימים נוספים`, value: formatCurrency(result.totalAfter125) }]
            : []),
          { label: 'סה"כ דמי אבטלה ברוטו', value: formatCurrency(result.totalGross), bold: true },
        ]}
      />

      {/* גרף השוואה */}
      {averageSalary > 0 && (
        <div className="bg-white border-2 border-gray-200 rounded-xl p-5">
          <h3 className="font-bold text-gray-900 mb-4">השוואה: שכר מלא מול דמי אבטלה (₪/חודש)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={comparisonData} margin={{ top: 5, right: 10, left: 10, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
              <Tooltip formatter={(v) => formatCurrency(Number(v))} />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {comparisonData.map((_, index) => (
                  <Cell key={index} fill={index === 0 ? '#22c55e' : index === 1 ? '#3b82f6' : '#f59e0b'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* גרף עוגה — חלוקת הסכום */}
      {result.totalGross > 0 && (
        <div className="bg-white border-2 border-gray-200 rounded-xl p-5">
          <h3 className="font-bold text-gray-900 mb-4">חלוקת סכום דמי האבטלה לפי תקופה</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ name, percent }) => `${((percent ?? 0) * 100).toFixed(0)}%`}
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
      )}

      {/* לוח תשלומים */}
      {schedule.length > 0 && (
        <div className="bg-white border-2 border-gray-200 rounded-xl p-5">
          <h3 className="font-bold text-gray-900 mb-4">לוח תשלומים דו-שבועי</h3>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={cumulativeData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="period" tick={{ fontSize: 10 }} hide={cumulativeData.length > 8} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
              <Tooltip formatter={(v) => formatCurrency(Number(v))} />
              <Legend />
              <ReferenceLine
                y={result.totalGross}
                stroke="#22c55e"
                strokeDasharray="4 4"
                label={{ value: 'סה"כ', position: 'left', fontSize: 11, fill: '#22c55e' }}
              />
              <Line
                type="monotone"
                dataKey="תשלום מצטבר"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="תשלום דו-שבועי"
                stroke="#f59e0b"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>

          {/* טבלת לוח תשלומים */}
          {schedule.length <= 15 && (
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-gray-50 border-b">
                    <th className="px-2 py-2 text-right text-gray-600">תקופה</th>
                    <th className="px-2 py-2 text-center text-gray-600">ימים</th>
                    <th className="px-2 py-2 text-center text-gray-600">₪/יום</th>
                    <th className="px-2 py-2 text-left text-gray-600">תשלום</th>
                    <th className="px-2 py-2 text-left text-gray-600">מצטבר</th>
                  </tr>
                </thead>
                <tbody>
                  {schedule.map((s, i) => (
                    <tr key={i} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="px-2 py-1.5 text-gray-700">{s.label}</td>
                      <td className="px-2 py-1.5 text-center">{s.daysInPeriod}</td>
                      <td className="px-2 py-1.5 text-center">
                        {formatCurrency(s.dailyRate, { decimals: 0 })}
                      </td>
                      <td className="px-2 py-1.5 text-left font-medium">
                        {formatCurrency(s.periodPayment)}
                      </td>
                      <td className="px-2 py-1.5 text-left text-blue-700 font-medium">
                        {formatCurrency(s.cumulativePayment)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-blue-50 font-bold border-t-2 border-blue-200">
                    <td className="px-2 py-2" colSpan={3}>
                      סה&quot;כ
                    </td>
                    <td className="px-2 py-2 text-left" colSpan={2}>
                      {formatCurrency(result.totalGross)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </div>
      )}

      <Recommendations items={result.recommendations} />
    </div>
  );
};

// ============================================================
// Tab: Work Income During Unemployment
// ============================================================
const WorkIncomeTab = () => {
  const [averageSalary, setAverageSalary] = useState(12_000);
  const [partTimeIncome, setPartTimeIncome] = useState(3_000);
  const [partTimePercent, setPartTimePercent] = useState(25);

  const result = useMemo(
    () =>
      calculateWorkIncomeDuringUnemployment({
        averageMonthlySalary: averageSalary,
        partTimeIncome,
        partTimePercent,
      }),
    [averageSalary, partTimeIncome, partTimePercent],
  );

  const { rate } = useMemo(() => {
    const r = calculateDailyPay({ averageMonthlySalary: averageSalary, age: 30, hasChildren: false });
    return { rate: r.benefitRate, fullDaily: r.dailyBenefitFirst125 };
  }, [averageSalary]);

  const halfNational = AVERAGE_NATIONAL_WAGE_2026 * 0.5;

  const barData = [
    { name: 'שכר מלא', value: averageSalary },
    { name: 'הכנסה מעבודה חלקית', value: partTimeIncome },
    { name: 'דמי אבטלה מלאים', value: Math.min((averageSalary / 30) * rate * 30, DAILY_CAP_FIRST_125 * 30) },
    ...(result.isEntitledToPartialBenefit
      ? [{ name: 'דמי אבטלה מופחתים', value: result.partialDailyBenefit * 30 }]
      : []),
    ...(result.isEntitledToPartialBenefit
      ? [{ name: 'סה"כ הכנסה', value: partTimeIncome + result.partialDailyBenefit * 30 }]
      : []),
  ];

  return (
    <div className="space-y-4">
      <SectionCard title="פרטי עבודה חלקית בתקופת האבטלה">
        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              שכר ממוצע לפני הפסקת עבודה (₪/חודש)
            </label>
            <input
              type="number"
              min={0}
              step={500}
              value={averageSalary}
              onChange={(e) => setAverageSalary(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-xl font-bold"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              הכנסה חודשית מעבודה חלקית חדשה (₪)
            </label>
            <input
              type="number"
              min={0}
              step={500}
              value={partTimeIncome}
              onChange={(e) => setPartTimeIncome(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-xl font-bold"
            />
            <p className="text-xs text-gray-500 mt-1">
              סף: {formatCurrency(halfNational)} (50% מהשכר הממוצע) — מעל זה אין זכאות
            </p>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            אחוז משרה בעבודה החדשה: {partTimePercent}%
          </label>
          <input
            type="range"
            min={10}
            max={100}
            step={5}
            value={partTimePercent}
            onChange={(e) => setPartTimePercent(Number(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>10%</span>
            <span>50%</span>
            <span>100%</span>
          </div>
        </div>
      </SectionCard>

      {/* תוצאה */}
      {result.isEntitledToPartialBenefit ? (
        <div className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-300 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <h3 className="text-lg font-bold text-green-900">זכאי להשלמת אבטלה</h3>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl p-4 border border-green-200 text-center">
              <p className="text-2xl font-black text-blue-700">
                {formatCurrency(result.partialDailyBenefit, { decimals: 0 })}
              </p>
              <p className="text-xs text-gray-600">דמי אבטלה מופחתים/יום</p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-green-200 text-center">
              <p className="text-2xl font-black text-amber-700">
                {formatCurrency(result.reduction, { decimals: 0 })}
              </p>
              <p className="text-xs text-gray-600">הפחתה/יום</p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-green-200 text-center">
              <p className="text-2xl font-black text-green-700">
                {formatCurrency(partTimeIncome + result.partialDailyBenefit * 30)}
              </p>
              <p className="text-xs text-gray-600">סה&quot;כ הכנסה חודשית</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-red-50 border-2 border-red-300 rounded-xl p-6 flex gap-4">
          <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-lg font-bold text-red-900 mb-1">לא זכאי לדמי אבטלה</h3>
            <p className="text-sm text-red-800">{result.explanation}</p>
          </div>
        </div>
      )}

      <InfoBox variant="blue">
        <p className="text-sm">{result.explanation}</p>
      </InfoBox>

      {/* גרף השוואה */}
      <div className="bg-white border-2 border-gray-200 rounded-xl p-5">
        <h3 className="font-bold text-gray-900 mb-4">השוואת הכנסות חודשיות</h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={barData} margin={{ top: 5, right: 10, left: 10, bottom: 30 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" tick={{ fontSize: 10 }} angle={-15} textAnchor="end" />
            <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
            <Tooltip formatter={(v) => formatCurrency(Number(v))} />
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {barData.map((_, index) => (
                <Cell
                  key={index}
                  fill={
                    index === 0
                      ? '#22c55e'
                      : index === barData.length - 1
                      ? '#8b5cf6'
                      : '#3b82f6'
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <InfoBox variant="amber">
        <h4 className="text-sm font-bold mb-2">כללי עבודה חלקית בתקופת אבטלה</h4>
        <ul className="text-sm space-y-1.5">
          <li>• <strong>עד 50% מהשכר הממוצע</strong> ({formatCurrency(halfNational)}/חודש) — ניתן לקבל דמי אבטלה מופחתים</li>
          <li>• <strong>מעל 50%</strong> — דמי האבטלה נפסקים לחלוטין בחודש זה</li>
          <li>• יש <strong>לדווח מיד</strong> לביטוח לאומי ולשירות התעסוקה על תחילת עבודה</li>
          <li>• ימי עבודה בפועל <strong>נגרעים</strong> מקצבת ימי הזכאות</li>
          <li>• אי-דיווח עלול לגרור <strong>קנסות והחזר כספי</strong></li>
        </ul>
      </InfoBox>
    </div>
  );
};

// ============================================================
// Tab: Tax Impact
// ============================================================
const TaxTab = () => {
  const [totalBenefits, setTotalBenefits] = useState(50_000);
  const [otherIncome, setOtherIncome] = useState(0);

  const result = useMemo(
    () => estimateTaxOnBenefits(totalBenefits, otherIncome),
    [totalBenefits, otherIncome],
  );

  const netBenefits = totalBenefits - result.estimatedTax;

  const pieData = [
    { name: 'נטו (לאחר מס)', value: Math.round(netBenefits) },
    { name: 'מס הכנסה', value: Math.round(result.estimatedTax) },
  ];
  const PIE_COLORS = ['#22c55e', '#ef4444'];

  return (
    <div className="space-y-4">
      <SectionCard title="חישוב מס על דמי אבטלה">
        <InfoBox variant="amber">
          <p className="text-sm font-bold mb-1">חשוב: דמי אבטלה חייבים במס הכנסה!</p>
          <p className="text-sm">
            ביטוח לאומי מנכה מס מראש לפי מדרגה 1 (10%). אם מדרגת המס שלך גבוהה יותר,
            תשלם הפרש בדוח השנתי.
          </p>
        </InfoBox>

        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              סך דמי אבטלה שקיבלת (₪)
            </label>
            <input
              type="number"
              min={0}
              step={1_000}
              value={totalBenefits}
              onChange={(e) => setTotalBenefits(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-xl font-bold"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              הכנסות אחרות באותה שנה (₪)
            </label>
            <input
              type="number"
              min={0}
              step={1_000}
              value={otherIncome}
              onChange={(e) => setOtherIncome(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">
              שכר ממשכורת אחרת, עסק, שכירות וכד&apos; — משפיע על מדרגת המס
            </p>
          </div>
        </div>
      </SectionCard>

      {/* תוצאות מס */}
      <div className="grid sm:grid-cols-3 gap-4">
        <ResultCard
          title="דמי אבטלה ברוטו"
          value={formatCurrency(totalBenefits)}
          subtitle="לפני ניכוי מס"
          variant="primary"
        />
        <ResultCard
          title="מס הכנסה משוער"
          value={formatCurrency(result.estimatedTax)}
          subtitle={`${formatPercent(result.effectiveTaxRate, 1)} שיעור מס אפקטיבי`}
          variant="warning"
        />
        <ResultCard
          title="דמי אבטלה נטו"
          value={formatCurrency(netBenefits)}
          subtitle="לאחר מס הכנסה"
          variant="success"
        />
      </div>

      {/* גרף עוגה */}
      {totalBenefits > 0 && (
        <div className="bg-white border-2 border-gray-200 rounded-xl p-5">
          <h3 className="font-bold text-gray-900 mb-4">חלוקת דמי האבטלה: נטו לעומת מס</h3>
          <ResponsiveContainer width="100%" height={200}>
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
      )}

      <Breakdown
        title="פירוט חישוב המס"
        defaultOpen
        items={[
          { label: 'דמי אבטלה ברוטו', value: formatCurrency(totalBenefits) },
          { label: 'הכנסות נוספות בשנה', value: formatCurrency(otherIncome) },
          { label: 'סך הכנסה חייבת', value: formatCurrency(totalBenefits + otherIncome) },
          { label: 'מס משוער על דמי אבטלה', value: formatCurrency(result.estimatedTax) },
          { label: 'שיעור מס אפקטיבי', value: formatPercent(result.effectiveTaxRate, 1) },
          { label: 'דמי אבטלה נטו', value: formatCurrency(netBenefits), bold: true },
        ]}
      />

      <InfoBox variant="blue">
        <h4 className="text-sm font-bold mb-2">כיצד ביטוח לאומי מנכה מס?</h4>
        <ul className="text-sm space-y-1.5">
          <li>• ב.ל. מנכה <strong>10% מס הכנסה</strong> (מדרגה 1) ו-<strong>3.5% ביטוח לאומי</strong> אוטומטית</li>
          <li>• אם שכרך לפני הפסקת עבודה היה במדרגה גבוהה (20%, 31%...) — <strong>תשלם הפרש בדוח השנתי</strong></li>
          <li>• <strong>נקודות זיכוי</strong> (2.25 לכל אדם) מפחיתות את המס — 774 ₪/נק׳ × 2.25 = ~1,740 ₪/שנה</li>
          <li>• מומלץ להגיש <strong>דוח שנתי</strong> כדי לקבל החזר מס אם נוכה עודף</li>
          <li>* חישוב זה הוא הערכה — לחישוב מדויק פנה לרואה חשבון</li>
        </ul>
      </InfoBox>
    </div>
  );
};

// ============================================================
// Main Component
// ============================================================

export function UnemploymentBenefitsCalculator() {
  const [activeTab, setActiveTab] = useState<TabMode>('eligibility');

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
              className={`flex-1 min-w-[130px] px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <span className="ml-1">{tab.emoji}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      {activeTab === 'eligibility' && <EligibilityTab />}
      {activeTab === 'pay' && <PayTab />}
      {activeTab === 'work_income' && <WorkIncomeTab />}
      {activeTab === 'tax' && <TaxTab />}
    </div>
  );
}
