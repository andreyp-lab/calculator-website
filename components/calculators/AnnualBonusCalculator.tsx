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
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from 'recharts';
import {
  calculateBonusNet,
  compareBonusVsRaise,
  compareWithholdingMethods,
  calculate13thSalary,
  calculatePerformanceBonus,
  calculateStockOption102,
  compareYears,
  calculateBonusCurve,
  calculateYearEndRefund,
  type BonusNetInput,
  type ThirteenthSalaryConvention,
  type PerformanceBonusType,
  type Section102Track,
} from '@/lib/calculators/annual-bonus';
import { formatCurrency, formatPercent } from '@/lib/utils/formatters';
import { ResultCard } from '@/components/calculator/ResultCard';
import { Breakdown } from '@/components/calculator/Breakdown';

// ============================================================
// Types & Constants
// ============================================================

type TabMode =
  | 'net_bonus'
  | 'three_methods'
  | 'bonus_vs_raise'
  | 'thirteenth'
  | 'performance'
  | 'stock102'
  | 'year_compare'
  | 'curve';

const TABS: { id: TabMode; label: string; short: string }[] = [
  { id: 'net_bonus', label: 'נטו בונוס', short: 'נטו בונוס' },
  { id: 'three_methods', label: '3 שיטות ניכוי', short: 'שיטות ניכוי' },
  { id: 'bonus_vs_raise', label: 'בונוס vs העלאה', short: 'בונוס vs שכר' },
  { id: 'thirteenth', label: 'משכורת 13', short: 'משכורת 13' },
  { id: 'performance', label: 'בונוס ביצועים', short: 'ביצועים' },
  { id: 'stock102', label: 'אופציות / RSU', short: 'אופציות' },
  { id: 'year_compare', label: 'השוואת שנים', short: 'שנים' },
  { id: 'curve', label: 'גרף נטו', short: 'גרף' },
];

const PIE_COLORS = {
  net: '#10b981',
  tax: '#ef4444',
  ss: '#f59e0b',
  pension: '#3b82f6',
  studyFund: '#8b5cf6',
};

// ============================================================
// Helper sub-components
// ============================================================

function TabBar({ active, onChange }: { active: TabMode; onChange: (t: TabMode) => void }) {
  return (
    <div className="flex flex-wrap gap-1.5 bg-gray-100 rounded-xl p-1.5">
      {TABS.map((t) => (
        <button
          key={t.id}
          type="button"
          onClick={() => onChange(t.id)}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
            active === t.id
              ? 'bg-white text-blue-700 shadow-sm'
              : 'text-gray-600 hover:text-gray-900 hover:bg-white/60'
          }`}
        >
          <span className="hidden sm:inline">{t.label}</span>
          <span className="sm:hidden">{t.short}</span>
        </button>
      ))}
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

function InfoBox({ children, color = 'blue' }: { children: React.ReactNode; color?: 'blue' | 'amber' | 'green' | 'red' }) {
  const styles = {
    blue: 'bg-blue-50 border-blue-200 text-blue-900',
    amber: 'bg-amber-50 border-amber-200 text-amber-900',
    green: 'bg-green-50 border-green-200 text-green-900',
    red: 'bg-red-50 border-red-200 text-red-900',
  };
  return (
    <div className={`border rounded-lg p-3 text-sm ${styles[color]}`}>{children}</div>
  );
}

function SectionTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-4">
      <h2 className="text-lg font-bold text-gray-900">{title}</h2>
      {subtitle && <p className="text-sm text-gray-600 mt-0.5">{subtitle}</p>}
    </div>
  );
}

// ============================================================
// Tab: נטו בונוס
// ============================================================

function TabNetBonus() {
  const [grossBonus, setGrossBonus] = useState(50_000);
  const [monthlyBase, setMonthlyBase] = useState(15_000);
  const [creditPoints, setCreditPoints] = useState(2.25);
  const [pensionEnabled, setPensionEnabled] = useState(false);
  const [studyFundEnabled, setStudyFundEnabled] = useState(false);

  const result = useMemo(
    () =>
      calculateBonusNet({
        grossBonus,
        monthlyBaseSalary: monthlyBase,
        creditPoints,
        pensionDeductionEnabled: pensionEnabled,
        studyFundDeductionEnabled: studyFundEnabled,
      }),
    [grossBonus, monthlyBase, creditPoints, pensionEnabled, studyFundEnabled],
  );

  const pieData = [
    { name: 'נטו לכיס', value: Math.round(result.netBonus), color: PIE_COLORS.net },
    { name: 'מס הכנסה', value: Math.round(result.incomeTaxOnBonus), color: PIE_COLORS.tax },
    { name: 'ב.ל. + בריאות', value: Math.round(result.socialSecurityOnBonus), color: PIE_COLORS.ss },
    ...(result.pensionDeduction > 0
      ? [{ name: 'פנסיה', value: Math.round(result.pensionDeduction), color: PIE_COLORS.pension }]
      : []),
    ...(result.studyFundDeduction > 0
      ? [{ name: 'קרן השתלמות', value: Math.round(result.studyFundDeduction), color: PIE_COLORS.studyFund }]
      : []),
  ].filter((d) => d.value > 0);

  const breakdownItems = [
    { label: 'בונוס ברוטו', value: formatCurrency(grossBonus) },
    {
      label: `מס הכנסה שולי (${Math.round(result.effectiveMarginalRate * 100)}% אפקטיבי)`,
      value: `-${formatCurrency(result.incomeTaxOnBonus)}`,
      note: `מדרגה שולית: ${Math.round(result.marginalBracketRate * 100)}%`,
    },
    {
      label: 'ביטוח לאומי + בריאות',
      value: `-${formatCurrency(result.socialSecurityOnBonus)}`,
    },
    ...(result.pensionDeduction > 0
      ? [{ label: 'פנסיה (6%)', value: `-${formatCurrency(result.pensionDeduction)}` }]
      : []),
    ...(result.studyFundDeduction > 0
      ? [{ label: 'קרן השתלמות (2.5%)', value: `-${formatCurrency(result.studyFundDeduction)}` }]
      : []),
    {
      label: 'נטו לכיס',
      value: formatCurrency(result.netBonus),
      bold: true,
    },
  ];

  return (
    <div className="grid lg:grid-cols-5 gap-6">
      {/* Form */}
      <div className="lg:col-span-3 space-y-5">
        <SectionTitle title="חישוב נטו בונוס" subtitle="כמה תקבל בפועל מהבונוס שלך" />

        <Field label="סכום הבונוס ברוטו (₪)">
          <input
            type="number"
            min={0}
            step={1000}
            value={grossBonus}
            onChange={(e) => setGrossBonus(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-lg focus:ring-2 focus:ring-blue-500"
          />
          <div className="flex flex-wrap gap-1.5 mt-2">
            {[10_000, 25_000, 50_000, 75_000, 100_000, 200_000].map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setGrossBonus(v)}
                className="text-xs px-2 py-0.5 bg-blue-100 text-blue-800 rounded hover:bg-blue-200 transition"
              >
                {v >= 1000 ? `${v / 1000}K` : v.toLocaleString('he-IL')}
              </button>
            ))}
          </div>
        </Field>

        <Field label="משכורת חודשית רגילה ברוטו (₪)" hint="השכר הקבוע שלך — קובע את מדרגת המס השולי">
          <input
            type="number"
            min={0}
            step={500}
            value={monthlyBase}
            onChange={(e) => setMonthlyBase(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <div className="flex flex-wrap gap-1.5 mt-2">
            {[6_444, 10_000, 15_000, 20_000, 30_000, 50_000].map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setMonthlyBase(v)}
                className="text-xs px-2 py-0.5 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition"
              >
                {v >= 1000 ? `${(v / 1000).toFixed(v % 1000 === 0 ? 0 : 3).replace(/\.?0+$/, '')}K` : v}
              </button>
            ))}
          </div>
        </Field>

        <Field label="נקודות זיכוי" hint="גבר=2.25, אישה=2.75. ניתן לחשב מדויק לפי מצב משפחתי">
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

        <div className="flex flex-col gap-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={pensionEnabled}
              onChange={(e) => setPensionEnabled(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded"
            />
            <span className="text-sm text-gray-700">הפריש 6% לפנסיה מהבונוס (מפחית הכנסה חייבת)</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={studyFundEnabled}
              onChange={(e) => setStudyFundEnabled(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded"
            />
            <span className="text-sm text-gray-700">הפריש 2.5% לקרן השתלמות</span>
          </label>
        </div>

        <InfoBox color="blue">
          <strong>מדוע הבונוס ממוסה גבוה?</strong> הבונוס מצטרף להכנסה השנתית ומחויב לפי המדרגה השולית
          הגבוהה ביותר שאתה כבר נמצא בה — לא לפי הממוצע. למשל: שכר 15K/חודש (מדרגה 20-31%) + בונוס 50K
          = המס על הבונוס יהיה 31-35% ולא 20%.
        </InfoBox>
      </div>

      {/* Results */}
      <div className="lg:col-span-2 space-y-4">
        <ResultCard
          title="בונוס נטו לכיס"
          value={formatCurrency(result.netBonus)}
          subtitle={`${result.netPercentage.toFixed(1)}% מהברוטו`}
          variant="success"
        />
        <ResultCard
          title="מס אפקטיבי על הבונוס"
          value={`${result.effectiveTaxRate.toFixed(1)}%`}
          subtitle={`מדרגה שולית: ${Math.round(result.marginalBracketRate * 100)}%`}
          variant="warning"
        />

        <Breakdown title="פירוט הניכויים" items={breakdownItems} defaultOpen />

        {/* Pie Chart */}
        {grossBonus > 0 && (
          <div className="border border-gray-200 rounded-lg p-4">
            <p className="text-sm font-medium text-gray-700 mb-3">חלוקת הבונוס</p>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={75}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {pieData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => formatCurrency(Number(v))} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-xs text-gray-600">
          {result.explanation}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// Tab: 3 שיטות ניכוי
// ============================================================

function TabThreeMethods() {
  const [grossBonus, setGrossBonus] = useState(50_000);
  const [monthlyBase, setMonthlyBase] = useState(15_000);
  const [creditPoints, setCreditPoints] = useState(2.25);
  const [monthsLeft, setMonthsLeft] = useState(6);

  const methods = useMemo(
    () =>
      compareWithholdingMethods({
        grossBonus,
        monthlyBaseSalary: monthlyBase,
        creditPoints,
        monthsRemainingInYear: monthsLeft,
      }),
    [grossBonus, monthlyBase, creditPoints, monthsLeft],
  );

  const barData = methods.map((m) => ({
    name: m.method === 'current_month' ? 'חד-פעמי' : m.method === 'annual_spread' ? 'פריסה שנתית' : 'דחייה',
    'נטו מיידי': Math.round(m.netImmediately),
    'נטו סופי': Math.round(m.netAfterRefund),
  }));

  return (
    <div className="space-y-6">
      <SectionTitle
        title="3 שיטות ניכוי מס על בונוס"
        subtitle="כיצד שיטת התשלום משפיעה על נטו שתקבל"
      />

      <div className="grid sm:grid-cols-3 gap-4">
        <Field label="בונוס ברוטו (₪)">
          <input
            type="number" min={0} step={1000} value={grossBonus}
            onChange={(e) => setGrossBonus(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
        </Field>
        <Field label="שכר חודשי (₪)">
          <input
            type="number" min={0} step={500} value={monthlyBase}
            onChange={(e) => setMonthlyBase(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
        </Field>
        <Field label="חודשים שנותרו בשנה">
          <input
            type="number" min={1} max={12} step={1} value={monthsLeft}
            onChange={(e) => setMonthsLeft(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
        </Field>
      </div>

      {/* Bar chart */}
      <div className="border border-gray-200 rounded-lg p-4">
        <p className="text-sm font-medium text-gray-700 mb-3">השוואה: נטו מיידי vs נטו סופי</p>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={barData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
            <Tooltip formatter={(v) => formatCurrency(Number(v))} />
            <Legend />
            <Bar dataKey="נטו מיידי" fill="#f59e0b" />
            <Bar dataKey="נטו סופי" fill="#10b981" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Cards per method */}
      <div className="grid md:grid-cols-3 gap-4">
        {methods.map((m) => (
          <div key={m.method} className="border border-gray-200 rounded-xl p-4 space-y-3">
            <h3 className="font-bold text-gray-900 text-sm">{m.label}</h3>
            <p className="text-xs text-gray-600">{m.description}</p>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">ניכוי במקור:</span>
                <span className="font-medium text-red-600">-{formatCurrency(m.estimatedWithheld)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">נטו מיידי:</span>
                <span className="font-medium">{formatCurrency(m.netImmediately)}</span>
              </div>
              {m.estimatedRefund > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">החזר מס משוער:</span>
                  <span className="font-medium text-green-600">+{formatCurrency(m.estimatedRefund)}</span>
                </div>
              )}
              <div className="flex justify-between pt-2 border-t font-bold">
                <span>נטו סופי:</span>
                <span className="text-emerald-700">{formatCurrency(m.netAfterRefund)}</span>
              </div>
            </div>
            <div className="space-y-1">
              {m.pros.map((p, i) => (
                <p key={i} className="text-xs text-green-700">✓ {p}</p>
              ))}
              {m.cons.map((c, i) => (
                <p key={i} className="text-xs text-red-700">✗ {c}</p>
              ))}
            </div>
          </div>
        ))}
      </div>

      <InfoBox color="amber">
        <strong>מה להעדיף?</strong> מבחינת נטו סופי — שיטת הפריסה ודחייה לשנה הבאה יכולות לחסוך מס.
        שיטת החודש הנוכחי היא הנפוצה ביותר אבל גורמת לניכוי גבוה. בכל מקרה: הגשת שומה בסוף שנה
        מחזירה כסף שנוכה ביתר.
      </InfoBox>
    </div>
  );
}

// ============================================================
// Tab: בונוס vs העלאת שכר
// ============================================================

function TabBonusVsRaise() {
  const [grossBonus, setGrossBonus] = useState(50_000);
  const [monthlyBase, setMonthlyBase] = useState(15_000);
  const [creditPoints, setCreditPoints] = useState(2.25);
  const [monthsLeft, setMonthsLeft] = useState(6);

  const result = useMemo(
    () =>
      compareBonusVsRaise({
        grossBonus,
        currentMonthlySalary: monthlyBase,
        creditPoints,
        monthsRemaining: monthsLeft,
      }),
    [grossBonus, monthlyBase, creditPoints, monthsLeft],
  );

  const monthlyRaise = Math.round(grossBonus / 12);
  const barData = [
    { name: 'בונוס (נטו)', value: Math.round(result.bonus.netReceived), fill: '#3b82f6' },
    { name: `שכר (נטו שנה ראשונה)`, value: Math.round(result.raise.annualNetValue), fill: '#10b981' },
    { name: `שכר (נטו 3 שנים)`, value: Math.round(result.raise.annualNetValue * 3), fill: '#6b7280' },
  ];

  return (
    <div className="space-y-6">
      <SectionTitle
        title="בונוס חד-פעמי vs העלאת שכר"
        subtitle={`מה שווה יותר — בונוס ${grossBonus.toLocaleString('he-IL')} ₪ או העלאה של ${monthlyRaise.toLocaleString('he-IL')} ₪/חודש?`}
      />

      <div className="grid sm:grid-cols-4 gap-4">
        <Field label="בונוס ברוטו (₪)">
          <input type="number" min={0} step={1000} value={grossBonus}
            onChange={(e) => setGrossBonus(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
        </Field>
        <Field label="שכר חודשי (₪)">
          <input type="number" min={0} step={500} value={monthlyBase}
            onChange={(e) => setMonthlyBase(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
        </Field>
        <Field label="נקודות זיכוי">
          <input type="number" min={0} max={15} step={0.25} value={creditPoints}
            onChange={(e) => setCreditPoints(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
        </Field>
        <Field label="חודשים שנותרו בשנה">
          <input type="number" min={1} max={12} step={1} value={monthsLeft}
            onChange={(e) => setMonthsLeft(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
        </Field>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Bonus card */}
        <div className="border-2 border-blue-200 rounded-xl p-5 bg-blue-50">
          <h3 className="font-bold text-blue-900 mb-3">בונוס חד-פעמי {formatCurrency(grossBonus)} ברוטו</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">מס הכנסה:</span>
              <span className="text-red-600">-{formatCurrency(result.bonus.taxPaid)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">ב.ל. + בריאות:</span>
              <span className="text-red-600">-{formatCurrency(result.bonus.ssPaid)}</span>
            </div>
            <div className="flex justify-between pt-2 border-t font-bold text-blue-800">
              <span>נטו לכיס:</span>
              <span>{formatCurrency(result.bonus.netReceived)}</span>
            </div>
            <div className="text-xs text-blue-700">
              {result.bonus.netPercentage.toFixed(1)}% מהברוטו — קבלה מיידית
            </div>
          </div>
        </div>

        {/* Raise card */}
        <div className="border-2 border-green-200 rounded-xl p-5 bg-green-50">
          <h3 className="font-bold text-green-900 mb-3">
            העלאת שכר +{formatCurrency(monthlyRaise)}/חודש (שווה ערך)
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">נטו נוסף/חודש:</span>
              <span className="text-green-700">+{formatCurrency(result.raise.netMonthlyIncrease)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">נטו ל-{monthsLeft} חודשים:</span>
              <span className="font-medium">{formatCurrency(result.raise.netForRemainingYear)}</span>
            </div>
            <div className="flex justify-between pt-2 border-t font-bold text-green-800">
              <span>נטו שנה מלאה:</span>
              <span>{formatCurrency(result.raise.annualNetValue)}</span>
            </div>
            <div className="text-xs text-green-700">
              {result.raise.netPercentage.toFixed(1)}% מהעלאה — + זכויות סוציאליות (פנסיה, פיצויים)
            </div>
          </div>
        </div>
      </div>

      {/* Comparison */}
      <div className="border border-gray-200 rounded-lg p-4">
        <p className="text-sm font-medium text-gray-700 mb-3">השוואה לאורך הזמן</p>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={barData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" tick={{ fontSize: 11 }} />
            <YAxis tickFormatter={(v) => `${Math.round(v / 1000)}K`} />
            <Tooltip formatter={(v) => formatCurrency(Number(v))} />
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {barData.map((entry, i) => (
                <Cell key={i} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {result.difference.raiseWinsAfterMonths !== null && (
        <InfoBox color="green">
          <strong>מסקנה:</strong> ההעלאה "מנצחת" את הבונוס לאחר{' '}
          <strong>{result.difference.raiseWinsAfterMonths} חודשים</strong> של עבודה.{' '}
          {result.difference.recommendation}
        </InfoBox>
      )}

      <InfoBox color="amber">
        <strong>שים לב לזכויות סוציאליות:</strong> העלאת שכר מגדילה את בסיס הפנסיה, הפיצויים, ודמי
        ההבראה — יתרון שהבונוס לא נותן (אלא אם נקבע אחרת בחוזה).
      </InfoBox>
    </div>
  );
}

// ============================================================
// Tab: משכורת 13
// ============================================================

function TabThirteenth() {
  const [monthlySalary, setMonthlySalary] = useState(15_000);
  const [creditPoints, setCreditPoints] = useState(2.25);
  const [convention, setConvention] = useState<ThirteenthSalaryConvention>('full_month');
  const [monthsWorked, setMonthsWorked] = useState(12);
  const [customAmount, setCustomAmount] = useState(15_000);
  const [includesSocialRights, setIncludesSocialRights] = useState(false);

  const result = useMemo(
    () =>
      calculate13thSalary({
        monthlySalary,
        creditPoints,
        convention,
        monthsWorkedThisYear: monthsWorked,
        customAmount,
        includesSocialRights,
      }),
    [monthlySalary, creditPoints, convention, monthsWorked, customAmount, includesSocialRights],
  );

  return (
    <div className="grid lg:grid-cols-5 gap-6">
      <div className="lg:col-span-3 space-y-5">
        <SectionTitle
          title="משכורת 13 (חישוב ייעודי)"
          subtitle="חישוב שכר החודש ה-13 לפי אמנת התשלום שלך"
        />

        <Field label="שכר חודשי ברוטו (₪)">
          <input type="number" min={0} step={500} value={monthlySalary}
            onChange={(e) => setMonthlySalary(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
        </Field>

        <Field label="אמנת חישוב משכורת 13" hint="בדוק בחוזה העבודה שלך">
          <select
            value={convention}
            onChange={(e) => setConvention(e.target.value as ThirteenthSalaryConvention)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white"
          >
            <option value="full_month">שכר חודש מלא (הנפוץ)</option>
            <option value="half_month">חצי חודש</option>
            <option value="proportional">יחסי לפי חודשי עבודה</option>
            <option value="custom">סכום מותאם אישית</option>
          </select>
        </Field>

        {convention === 'proportional' && (
          <Field label="חודשים שעבדת בשנה זו" hint="1-12 חודשים">
            <input type="number" min={1} max={12} step={1} value={monthsWorked}
              onChange={(e) => setMonthsWorked(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
          </Field>
        )}

        {convention === 'custom' && (
          <Field label="סכום מותאם (₪)">
            <input type="number" min={0} step={1000} value={customAmount}
              onChange={(e) => setCustomAmount(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
          </Field>
        )}

        <Field label="נקודות זיכוי">
          <input type="number" min={0} max={15} step={0.25} value={creditPoints}
            onChange={(e) => setCreditPoints(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
        </Field>

        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={includesSocialRights}
            onChange={(e) => setIncludesSocialRights(e.target.checked)}
            className="w-4 h-4 text-blue-600 rounded" />
          <span className="text-sm text-gray-700">
            משכורת 13 כוללת בבסיס לזכויות סוציאליות (כתוב בחוזה)
          </span>
        </label>

        <InfoBox color="blue">
          <strong>מה זה משכורת 13?</strong> תשלום שנתי נוסף שאינו חובה בחוק הישראלי — אלא נהוג
          בהסכמי עבודה רבים. ברוב המקרים: שכר חודש מלא נוסף בדצמבר/ינואר. ממוסה בדיוק כמו בונוס.
        </InfoBox>
      </div>

      <div className="lg:col-span-2 space-y-4">
        <ResultCard
          title="משכורת 13 נטו"
          value={formatCurrency(result.netAmount)}
          subtitle={`${result.netPercentage.toFixed(1)}% מהברוטו (${formatCurrency(result.grossAmount)} ברוטו)`}
          variant="success"
        />

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">אמנה:</span>
            <span className="font-medium">{result.convention}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">ברוטו:</span>
            <span className="font-medium">{formatCurrency(result.grossAmount)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">מס הכנסה:</span>
            <span className="text-red-600">-{formatCurrency(result.taxOnAmount)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">ב.ל. + בריאות:</span>
            <span className="text-red-600">-{formatCurrency(result.ssOnAmount)}</span>
          </div>
          <div className="flex justify-between pt-2 border-t font-bold text-emerald-700">
            <span>נטו:</span>
            <span>{formatCurrency(result.netAmount)}</span>
          </div>
        </div>

        <InfoBox color="amber">
          <strong>זכויות סוציאליות:</strong> {result.socialRightsNote}
        </InfoBox>

        <InfoBox color="green">
          <strong>עלות הזדמנות:</strong> {result.opportunityCost}
        </InfoBox>

        <p className="text-xs text-gray-500">{result.conventionNote}</p>
      </div>
    </div>
  );
}

// ============================================================
// Tab: בונוס ביצועים
// ============================================================

function TabPerformance() {
  const [monthlySalary, setMonthlySalary] = useState(15_000);
  const [creditPoints, setCreditPoints] = useState(2.25);
  const [bonusType, setBonusType] = useState<PerformanceBonusType>('percentage_of_salary');
  const [bonusPct, setBonusPct] = useState(10);
  const [fixedAmount, setFixedAmount] = useState(30_000);
  const [targetAmount, setTargetAmount] = useState(50_000);
  const [achievementPct, setAchievementPct] = useState(100);

  const result = useMemo(
    () =>
      calculatePerformanceBonus({
        monthlySalary,
        creditPoints,
        bonusType,
        bonusPercentageOfSalary: bonusPct,
        fixedAmount,
        targetAmount,
        achievementPercentage: achievementPct,
      }),
    [monthlySalary, creditPoints, bonusType, bonusPct, fixedAmount, targetAmount, achievementPct],
  );

  const scenarioBarData = result.scenarios.map((s) => ({
    name: `${s.achievementPct}%`,
    'ברוטו': Math.round(s.grossBonus),
    'נטו': Math.round(s.netBonus),
  }));

  return (
    <div className="space-y-6">
      <SectionTitle
        title="בונוס מבוסס ביצועים"
        subtitle="חישוב בונוס לפי % משכר, סכום קבוע, או יעד ביצועים"
      />

      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="שכר חודשי ברוטו (₪)">
          <input type="number" min={0} step={500} value={monthlySalary}
            onChange={(e) => setMonthlySalary(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
        </Field>
        <Field label="נקודות זיכוי">
          <input type="number" min={0} max={15} step={0.25} value={creditPoints}
            onChange={(e) => setCreditPoints(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
        </Field>
      </div>

      <Field label="סוג בונוס ביצועים">
        <div className="flex flex-wrap gap-2">
          {[
            { v: 'percentage_of_salary', l: '% משכר שנתי' },
            { v: 'fixed', l: 'סכום קבוע' },
            { v: 'target_based', l: 'מבוסס יעד' },
          ].map(({ v, l }) => (
            <button key={v} type="button"
              onClick={() => setBonusType(v as PerformanceBonusType)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                bonusType === v
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}>
              {l}
            </button>
          ))}
        </div>
      </Field>

      {bonusType === 'percentage_of_salary' && (
        <Field label="% מהשכר השנתי" hint="לדוגמה: 10 = 10% מהשכר השנתי">
          <input type="number" min={0} max={500} step={1} value={bonusPct}
            onChange={(e) => setBonusPct(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
        </Field>
      )}

      {bonusType === 'fixed' && (
        <Field label="סכום בונוס קבוע (₪)">
          <input type="number" min={0} step={1000} value={fixedAmount}
            onChange={(e) => setFixedAmount(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
        </Field>
      )}

      {bonusType === 'target_based' && (
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="בונוס יעד מלא (₪) — 100% עמידה">
            <input type="number" min={0} step={1000} value={targetAmount}
              onChange={(e) => setTargetAmount(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
          </Field>
          <Field label="% עמידה ביעד בפועל" hint="50-200%">
            <input type="number" min={0} max={200} step={5} value={achievementPct}
              onChange={(e) => setAchievementPct(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
          </Field>
        </div>
      )}

      <div className="grid sm:grid-cols-3 gap-4">
        <ResultCard
          title="בונוס ברוטו"
          value={formatCurrency(result.grossBonus)}
          subtitle={`${result.bonusAsPercentOfAnnualSalary.toFixed(1)}% מהשכר השנתי`}
        />
        <ResultCard
          title="בונוס נטו"
          value={formatCurrency(result.netBonus)}
          subtitle={`${result.netPercentage.toFixed(1)}% מהברוטו`}
          variant="success"
        />
        <ResultCard
          title="מס + ב.ל."
          value={formatCurrency(result.taxOnBonus + result.ssOnBonus)}
          subtitle={`${((result.taxOnBonus + result.ssOnBonus) / (result.grossBonus || 1) * 100).toFixed(1)}% ניכוי`}
          variant="warning"
        />
      </div>

      <div className="border border-gray-200 rounded-lg p-4">
        <p className="text-sm font-medium text-gray-700 mb-3">תרחישי עמידה ביעד</p>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={scenarioBarData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tickFormatter={(v) => `${Math.round(v / 1000)}K`} />
            <Tooltip formatter={(v) => formatCurrency(Number(v))} />
            <Legend />
            <Bar dataKey="ברוטו" fill="#6b7280" />
            <Bar dataKey="נטו" fill="#10b981" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// ============================================================
// Tab: אופציות / RSU סעיף 102
// ============================================================

function TabStock102() {
  const [units, setUnits] = useState(10_000);
  const [exercisePrice, setExercisePrice] = useState(5);
  const [marketPrice, setMarketPrice] = useState(15);
  const [salePrice, setSalePrice] = useState(20);
  const [track, setTrack] = useState<Section102Track>('capital');
  const [vestingYears, setVestingYears] = useState(4);
  const [vestedPct, setVestedPct] = useState(100);
  const [creditPoints, setCreditPoints] = useState(2.25);
  const [otherIncome, setOtherIncome] = useState(180_000);

  const result = useMemo(
    () =>
      calculateStockOption102({
        numberOfUnits: units,
        exercisePrice,
        marketPriceAtExercise: marketPrice,
        marketPriceAtSale: salePrice,
        track,
        vestingYears,
        vestedPercentage: vestedPct,
        creditPoints,
        otherAnnualIncome: otherIncome,
      }),
    [units, exercisePrice, marketPrice, salePrice, track, vestingYears, vestedPct, creditPoints, otherIncome],
  );

  const vestingBarData = result.vestingSchedule.map((v) => ({
    name: `שנה ${v.year}`,
    'יחידות': v.vestedUnits,
    'מצטבר': v.cumulativeVested,
  }));

  return (
    <div className="space-y-6">
      <SectionTitle
        title="אופציות / RSU — סעיף 102"
        subtitle="חישוב מס על אופציות ויחידות מוגבלות לפי מסלול הוני או רגיל"
      />

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Field label="מספר יחידות (אופציות / RSU)">
          <input type="number" min={0} step={100} value={units}
            onChange={(e) => setUnits(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
        </Field>
        <Field label="מחיר מימוש (₪ ליחידה)" hint="0 עבור RSU">
          <input type="number" min={0} step={0.1} value={exercisePrice}
            onChange={(e) => setExercisePrice(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
        </Field>
        <Field label="מחיר שוק בעת מימוש (₪)">
          <input type="number" min={0} step={0.5} value={marketPrice}
            onChange={(e) => setMarketPrice(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
        </Field>
        <Field label="מחיר שוק בעת מכירה (₪)" hint="לחישוב רווח הון נוסף">
          <input type="number" min={0} step={0.5} value={salePrice}
            onChange={(e) => setSalePrice(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
        </Field>
        <Field label="% וסטינג שהושלם">
          <input type="number" min={0} max={100} step={25} value={vestedPct}
            onChange={(e) => setVestedPct(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
        </Field>
        <Field label="שנות וסטינג">
          <input type="number" min={1} max={10} step={1} value={vestingYears}
            onChange={(e) => setVestingYears(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
        </Field>
      </div>

      <Field label="מסלול מס">
        <div className="flex gap-3">
          {[
            { v: 'capital', l: 'הוני (25%) — 102ב(2)', hint: 'Lock-up 24 חודשים' },
            { v: 'ordinary', l: 'רגיל (מס שולי)', hint: 'ללא Lock-up' },
          ].map(({ v, l, hint }) => (
            <button key={v} type="button"
              onClick={() => setTrack(v as Section102Track)}
              className={`flex-1 px-4 py-3 rounded-lg text-sm font-medium border-2 transition ${
                track === v
                  ? v === 'capital'
                    ? 'bg-green-50 border-green-500 text-green-800'
                    : 'bg-red-50 border-red-500 text-red-800'
                  : 'bg-gray-50 border-gray-200 text-gray-600'
              }`}>
              <div className="font-bold">{l}</div>
              <div className="text-xs mt-0.5 opacity-75">{hint}</div>
            </button>
          ))}
        </div>
      </Field>

      {track === 'ordinary' && (
        <Field label="הכנסה שנתית אחרת (₪)" hint="לחישוב מס שולי נכון">
          <input type="number" min={0} step={10000} value={otherIncome}
            onChange={(e) => setOtherIncome(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
        </Field>
      )}

      <div className="grid sm:grid-cols-3 gap-4">
        <ResultCard
          title="רווח ממימוש"
          value={formatCurrency(result.gainAtExercise)}
          subtitle={`${result.vestedUnits.toLocaleString('he-IL')} יחידות × ${formatCurrency(Math.max(0, marketPrice - exercisePrice))}`}
        />
        <ResultCard
          title="מס על הרווח"
          value={formatCurrency(result.taxOnGain)}
          subtitle={`${result.trackLabel}`}
          variant="warning"
        />
        <ResultCard
          title="נטו ממימוש"
          value={formatCurrency(result.netGain)}
          subtitle={`${result.netPercentage.toFixed(1)}% מהרווח`}
          variant="success"
        />
      </div>

      {result.additionalCapitalGain !== undefined && result.additionalCapitalGain > 0 && (
        <div className="border border-purple-200 rounded-lg p-4 bg-purple-50">
          <p className="font-medium text-purple-900 mb-2">שלב ב׳ — רווח הון ממכירה</p>
          <div className="grid sm:grid-cols-3 gap-3 text-sm">
            <div>
              <span className="text-gray-600">רווח הון נוסף: </span>
              <span className="font-bold">{formatCurrency(result.additionalCapitalGain)}</span>
            </div>
            <div>
              <span className="text-gray-600">מס 25%: </span>
              <span className="font-bold text-red-600">-{formatCurrency(result.additionalTaxOnSale ?? 0)}</span>
            </div>
            <div>
              <span className="text-gray-600">נטו ממכירה: </span>
              <span className="font-bold text-green-700">{formatCurrency(result.netFromSale ?? 0)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Vesting schedule */}
      <div className="border border-gray-200 rounded-lg p-4">
        <p className="text-sm font-medium text-gray-700 mb-3">לוח וסטינג ({vestingYears} שנים)</p>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={vestingBarData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="יחידות" fill="#3b82f6" />
            <Bar dataKey="מצטבר" fill="#10b981" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {result.warnings.length > 0 && (
        <InfoBox color="red">
          <strong>אזהרות:</strong>
          <ul className="mt-1 space-y-1 list-disc list-inside text-sm">
            {result.warnings.map((w, i) => <li key={i}>{w}</li>)}
          </ul>
        </InfoBox>
      )}

      <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
        <p className="font-medium text-gray-800 mb-2">כללים מרכזיים — סעיף 102</p>
        <ul className="space-y-1">
          {result.keyRules.map((r, i) => (
            <li key={i} className="text-sm text-gray-700">• {r}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// ============================================================
// Tab: השוואת שנים
// ============================================================

function TabYearCompare() {
  const [grossBonus, setGrossBonus] = useState(50_000);
  const [monthlyBase, setMonthlyBase] = useState(15_000);
  const [creditPoints, setCreditPoints] = useState(2.25);

  const years = useMemo(
    () =>
      compareYears({
        grossBonus,
        monthlyBaseSalary: monthlyBase,
        creditPoints,
      }),
    [grossBonus, monthlyBase, creditPoints],
  );

  const barData = years.map((y) => ({
    name: y.year,
    'נטו': Math.round(y.netBonus),
    'מס': Math.round(y.taxOnBonus),
  }));

  const best = years.reduce((a, b) => (a.netBonus > b.netBonus ? a : b));

  return (
    <div className="space-y-6">
      <SectionTitle
        title="השוואת שנים — 2024 / 2025 / 2026"
        subtitle="האם שינויי מדרגות המס משפיעים על הבונוס שלך?"
      />

      <div className="grid sm:grid-cols-3 gap-4">
        <Field label="בונוס ברוטו (₪)">
          <input type="number" min={0} step={1000} value={grossBonus}
            onChange={(e) => setGrossBonus(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
        </Field>
        <Field label="שכר חודשי (₪)">
          <input type="number" min={0} step={500} value={monthlyBase}
            onChange={(e) => setMonthlyBase(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
        </Field>
        <Field label="נקודות זיכוי">
          <input type="number" min={0} max={15} step={0.25} value={creditPoints}
            onChange={(e) => setCreditPoints(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
        </Field>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        {years.map((y) => (
          <div
            key={y.year}
            className={`border-2 rounded-xl p-4 ${
              y.year === best.year ? 'border-green-500 bg-green-50' : 'border-gray-200'
            }`}
          >
            {y.year === best.year && (
              <span className="text-xs font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded-full mb-2 block w-fit">
                הכי טוב
              </span>
            )}
            <p className="text-xl font-bold text-gray-900">{y.year}</p>
            <p className="text-2xl font-bold text-emerald-700 mt-1">{formatCurrency(y.netBonus)}</p>
            <p className="text-sm text-gray-600 mt-1">נטו לכיס ({y.netBonus > 0 ? ((y.netBonus / grossBonus) * 100).toFixed(1) : 0}%)</p>
            <div className="mt-3 text-sm space-y-1">
              <div className="flex justify-between">
                <span className="text-gray-500">מס:</span>
                <span className="text-red-600">-{formatCurrency(y.taxOnBonus)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">מס שולי:</span>
                <span>{Math.round(y.marginalRate * 100)}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="border border-gray-200 rounded-lg p-4">
        <p className="text-sm font-medium text-gray-700 mb-3">השוואה ויזואלית</p>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={barData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis tickFormatter={(v) => `${Math.round(v / 1000)}K`} />
            <Tooltip formatter={(v) => formatCurrency(Number(v))} />
            <Legend />
            <Bar dataKey="נטו" fill="#10b981" />
            <Bar dataKey="מס" fill="#ef4444" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <InfoBox color="blue">
        <strong>ריווח מדרגות 2026:</strong> בשנת 2026 מדרגות 20% ו-31% הורחבו — מה שאומר שיותר הכנסה
        ממוסה בשיעור נמוך יותר. עובדים עם שכר 10K-25K/חודש נהנים מהגדלה של הנטו.
      </InfoBox>
    </div>
  );
}

// ============================================================
// Tab: גרף נטו לפי גודל בונוס
// ============================================================

function TabCurve() {
  const [monthlyBase, setMonthlyBase] = useState(15_000);
  const [creditPoints, setCreditPoints] = useState(2.25);
  const [maxBonus, setMaxBonus] = useState(200_000);

  const curveData = useMemo(
    () => calculateBonusCurve(monthlyBase, creditPoints, maxBonus, 20),
    [monthlyBase, creditPoints, maxBonus],
  );

  const chartData = curveData.map((p) => ({
    name: `${Math.round(p.grossBonus / 1000)}K`,
    'נטו (₪)': Math.round(p.netBonus),
    '% נטו': parseFloat(p.netPercentage.toFixed(1)),
  }));

  return (
    <div className="space-y-6">
      <SectionTitle
        title="גרף: נטו לפי גודל בונוס"
        subtitle="כיצד גדל הנטו ככל שהבונוס גדל — ואיפה עוברים מדרגות מס"
      />

      <div className="grid sm:grid-cols-3 gap-4">
        <Field label="שכר חודשי (₪)">
          <input type="number" min={0} step={500} value={monthlyBase}
            onChange={(e) => setMonthlyBase(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
        </Field>
        <Field label="נקודות זיכוי">
          <input type="number" min={0} max={15} step={0.25} value={creditPoints}
            onChange={(e) => setCreditPoints(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
        </Field>
        <Field label="בונוס מקסימלי לגרף (₪)">
          <select value={maxBonus} onChange={(e) => setMaxBonus(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white">
            <option value={50_000}>50,000</option>
            <option value={100_000}>100,000</option>
            <option value={200_000}>200,000</option>
            <option value={500_000}>500,000</option>
          </select>
        </Field>
      </div>

      <div className="border border-gray-200 rounded-lg p-4">
        <p className="text-sm font-medium text-gray-700 mb-3">נטו (₪) לפי גודל בונוס</p>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" tick={{ fontSize: 11 }} />
            <YAxis yAxisId="left" tickFormatter={(v) => `${Math.round(v / 1000)}K`} />
            <YAxis yAxisId="right" orientation="right" tickFormatter={(v) => `${v}%`} />
            <Tooltip formatter={(v, name) =>
              name === 'נטו (₪)' ? formatCurrency(Number(v)) : `${Number(v).toFixed(1)}%`} />
            <Legend />
            <Line yAxisId="left" type="monotone" dataKey="נטו (₪)" stroke="#10b981" strokeWidth={2} dot={false} />
            <Line yAxisId="right" type="monotone" dataKey="% נטו" stroke="#f59e0b" strokeWidth={2} dot={false} strokeDasharray="5 5" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <InfoBox color="amber">
        <strong>שים לב לשיפוע:</strong> ככל שהבונוס גדל ואתה עוברים מדרגת מס — % הנטו יורד.
        הקו הצהוב (% נטו) מראה כאן את "ירידות" המדרגה.
      </InfoBox>
    </div>
  );
}

// ============================================================
// Main Calculator
// ============================================================

export function AnnualBonusCalculator() {
  const [activeTab, setActiveTab] = useState<TabMode>('net_bonus');

  return (
    <div className="space-y-6" dir="rtl">
      <TabBar active={activeTab} onChange={setActiveTab} />

      <div className="min-h-[400px]">
        {activeTab === 'net_bonus' && <TabNetBonus />}
        {activeTab === 'three_methods' && <TabThreeMethods />}
        {activeTab === 'bonus_vs_raise' && <TabBonusVsRaise />}
        {activeTab === 'thirteenth' && <TabThirteenth />}
        {activeTab === 'performance' && <TabPerformance />}
        {activeTab === 'stock102' && <TabStock102 />}
        {activeTab === 'year_compare' && <TabYearCompare />}
        {activeTab === 'curve' && <TabCurve />}
      </div>

      <div className="text-xs text-gray-400 border-t pt-3">
        מקורות: רשות המסים, ביטוח לאומי 2026. החישובים הם אומדן — לייעוץ מס מחייב פנה לרואה חשבון.
      </div>
    </div>
  );
}
