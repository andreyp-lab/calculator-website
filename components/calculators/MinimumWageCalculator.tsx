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
  Cell,
  PieChart,
  Pie,
  Legend,
  LineChart,
  Line,
} from 'recharts';

import {
  calculateMinimumWage,
  calculateNetMinimumWage,
  calculateYouthWage,
  checkCompliance,
  calculateLivingWageGap,
  HISTORICAL_MINIMUM_WAGES,
  OECD_MINIMUM_WAGES,
  SECTOR_MINIMUMS,
  AGE_MULTIPLIERS,
  type MinimumWageInput,
  type WorkType,
  type AgeGroup,
} from '@/lib/calculators/minimum-wage';
import { formatCurrency, formatPercent } from '@/lib/utils/formatters';
import { ResultCard } from '@/components/calculator/ResultCard';

// ============================================================
// Tab types
// ============================================================

type MainTab = 'rates' | 'compliance' | 'net' | 'youth' | 'history' | 'international' | 'living';

const TABS: { key: MainTab; label: string }[] = [
  { key: 'rates', label: 'תעריפים' },
  { key: 'compliance', label: 'בדיקת תאימות' },
  { key: 'net', label: 'שכר נטו' },
  { key: 'youth', label: 'נוער' },
  { key: 'history', label: 'היסטוריה' },
  { key: 'international', label: 'השוואה בינ״ל' },
  { key: 'living', label: 'עלות מחיה' },
];

// ============================================================
// Helper
// ============================================================

function TabBtn({
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
      onClick={onClick}
      className={`px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-colors ${
        active
          ? 'bg-blue-600 text-white shadow-sm'
          : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
      }`}
    >
      {children}
    </button>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <h3 className="text-base font-semibold text-gray-800 mb-3">{children}</h3>;
}

function InfoRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`flex justify-between items-center py-2 border-b border-gray-100 last:border-0 ${highlight ? 'bg-blue-50 px-2 rounded' : ''}`}>
      <span className="text-sm text-gray-600">{label}</span>
      <span className={`text-sm font-semibold ${highlight ? 'text-blue-700' : 'text-gray-900'}`}>{value}</span>
    </div>
  );
}

// ============================================================
// Rates Tab
// ============================================================

const initial: MinimumWageInput = {
  workType: 'monthly',
  ageGroup: 'adult',
  partTimePercentage: 100,
};

function RatesTab() {
  const [input, setInput] = useState<MinimumWageInput>(initial);
  const [actualWage, setActualWage] = useState(6_000);

  const result = useMemo(
    () => calculateMinimumWage({ ...input, actualWage }),
    [input, actualWage],
  );

  function update<K extends keyof MinimumWageInput>(k: K, v: MinimumWageInput[K]) {
    setInput((p) => ({ ...p, [k]: v }));
  }

  const allRates = useMemo(() => {
    const mult = AGE_MULTIPLIERS[input.ageGroup].rate;
    return [
      { label: 'חודשי', value: 6_443.85 * mult * (input.workType === 'monthly' ? input.partTimePercentage / 100 : 1) },
      { label: 'שעתי 182 שעות', value: 35.40 * mult },
      { label: 'שעתי 186 שעות', value: 34.64 * mult },
      { label: 'יומי 5 ימים', value: 297.40 * mult },
      { label: 'יומי 6 ימים', value: 257.75 * mult },
    ];
  }, [input.ageGroup, input.partTimePercentage, input.workType]);

  return (
    <div className="grid lg:grid-cols-5 gap-6">
      {/* Inputs */}
      <div className="lg:col-span-3 space-y-5">
        <div className="bg-white border-2 border-gray-200 rounded-xl p-6 space-y-4">
          <SectionLabel>פרטי העסקה</SectionLabel>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">סוג שכר</label>
            <select
              value={input.workType}
              onChange={(e) => update('workType', e.target.value as WorkType)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="monthly">חודשי (משרה מלאה)</option>
              <option value="hourly-182">שעתי (182 שעות/חודש)</option>
              <option value="hourly-186">שעתי (186 שעות/חודש)</option>
              <option value="daily-5">יומי (5 ימים/שבוע)</option>
              <option value="daily-6">יומי (6 ימים/שבוע)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">גיל העובד</label>
            <select
              value={input.ageGroup}
              onChange={(e) => update('ageGroup', e.target.value as AgeGroup)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="adult">בוגר (18+) – 100%</option>
              <option value="youth-17-18">17-18 – 75% משכר מינימום</option>
              <option value="youth-16-17">16-17 – 70% משכר מינימום</option>
              <option value="under-16">מתחת ל-16 – 60% משכר מינימום</option>
            </select>
          </div>

          {input.workType === 'monthly' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                אחוז משרה: <span className="text-blue-600 font-bold">{input.partTimePercentage}%</span>
              </label>
              <input
                type="range"
                min={10}
                max={100}
                step={5}
                value={input.partTimePercentage}
                onChange={(e) => update('partTimePercentage', Number(e.target.value))}
                className="w-full accent-blue-600"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>10%</span>
                <span>50%</span>
                <span>100%</span>
              </div>
            </div>
          )}
        </div>

        {/* All rates table */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <SectionLabel>כל תעריפי שכר המינימום (מותאמים לגיל)</SectionLabel>
          <div className="space-y-1">
            {allRates.map((r) => (
              <InfoRow key={r.label} label={r.label} value={formatCurrency(r.value)} />
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="lg:col-span-2 space-y-4">
        <ResultCard
          title="שכר מינימום מותאם"
          value={formatCurrency(result.adjustedMinimumWage)}
          subtitle={result.wageTypeLabel}
          variant={result.isAboveMinimum ? 'success' : 'primary'}
        />

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-3">
          <label className="block text-sm font-medium text-amber-900">
            השכר שאני מקבל בפועל (₪)
          </label>
          <input
            type="number"
            min={0}
            step={100}
            value={actualWage}
            onChange={(e) => setActualWage(Number(e.target.value))}
            className="w-full px-3 py-2 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-400"
          />
          {actualWage > 0 && (
            <div
              className={`border-2 rounded-lg p-3 ${
                result.isAboveMinimum
                  ? 'border-emerald-400 bg-emerald-50 text-emerald-900'
                  : 'border-red-400 bg-red-50 text-red-900'
              }`}
            >
              <p className="font-bold text-sm">
                {result.isAboveMinimum ? '✅ השכר תקין' : '⚠️ השכר נמוך מהמינימום'}
              </p>
              {!result.isAboveMinimum && (
                <p className="text-sm mt-1">חסר: {formatCurrency(result.shortfall)}/חודש = {formatCurrency(result.shortfall * 12)}/שנה</p>
              )}
            </div>
          )}
        </div>

        {result.notes.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 space-y-1">
            {result.notes.map((n, i) => (
              <p key={i} className="text-xs text-blue-900">{n}</p>
            ))}
          </div>
        )}

        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
          <p className="text-xs text-gray-500 font-medium mb-2">מידע כללי</p>
          <InfoRow label="תקף מ-" value="1.4.2026" />
          <InfoRow label="שעות מלאה" value="182 שעות/חודש" />
          <InfoRow label="ימי עבודה" value="22 ימים (5 יום/שבוע)" />
        </div>
      </div>
    </div>
  );
}

// ============================================================
// Compliance Tab
// ============================================================

function ComplianceTab() {
  const [actualWage, setActualWage] = useState(6_200);
  const [hoursPerMonth, setHoursPerMonth] = useState(182);
  const [ageGroup, setAgeGroup] = useState<AgeGroup>('adult');
  const [workType, setWorkType] = useState<WorkType>('monthly');
  const [partTime, setPartTime] = useState(100);

  const result = useMemo(
    () =>
      checkCompliance({
        actualMonthlyWage: actualWage,
        hoursPerMonth,
        ageGroup,
        workType,
        partTimePercentage: partTime,
      }),
    [actualWage, hoursPerMonth, ageGroup, workType, partTime],
  );

  const pctColor =
    result.severity === 'ok'
      ? 'text-green-700'
      : result.severity === 'warning'
      ? 'text-amber-700'
      : 'text-red-700';

  return (
    <div className="grid lg:grid-cols-5 gap-6">
      <div className="lg:col-span-3 bg-white border-2 border-gray-200 rounded-xl p-6 space-y-4">
        <SectionLabel>בדיקת עמידה בשכר מינימום</SectionLabel>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">גיל עובד</label>
            <select
              value={ageGroup}
              onChange={(e) => setAgeGroup(e.target.value as AgeGroup)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="adult">18+ (בוגר)</option>
              <option value="youth-17-18">17-18</option>
              <option value="youth-16-17">16-17</option>
              <option value="under-16">מתחת ל-16</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">סוג עסקה</label>
            <select
              value={workType}
              onChange={(e) => setWorkType(e.target.value as WorkType)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="monthly">חודשי</option>
              <option value="hourly-182">שעתי 182 ש/ח</option>
              <option value="hourly-186">שעתי 186 ש/ח</option>
              <option value="daily-5">יומי 5 ימים</option>
              <option value="daily-6">יומי 6 ימים</option>
            </select>
          </div>
        </div>

        {workType === 'monthly' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              אחוז משרה: <span className="text-blue-600 font-bold">{partTime}%</span>
            </label>
            <input
              type="range"
              min={10}
              max={100}
              step={5}
              value={partTime}
              onChange={(e) => setPartTime(Number(e.target.value))}
              className="w-full accent-blue-600"
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">שכר בפועל (₪)</label>
          <input
            type="number"
            min={0}
            step={100}
            value={actualWage}
            onChange={(e) => setActualWage(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-lg font-semibold"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">שעות חודשיות</label>
          <input
            type="number"
            min={1}
            max={300}
            value={hoursPerMonth}
            onChange={(e) => setHoursPerMonth(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
        </div>

        {/* Visual gauge */}
        <div className="mt-2">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>0%</span>
            <span>שכר מינימום</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden">
            <div
              className={`h-4 rounded-full transition-all ${
                result.severity === 'ok'
                  ? 'bg-green-500'
                  : result.severity === 'warning'
                  ? 'bg-amber-500'
                  : 'bg-red-500'
              }`}
              style={{ width: `${Math.min(100, result.percentageOfMinimum)}%` }}
            />
          </div>
          <p className={`text-sm font-bold mt-1 ${pctColor}`}>
            {result.percentageOfMinimum.toFixed(1)}% משכר המינימום
          </p>
        </div>
      </div>

      <div className="lg:col-span-2 space-y-4">
        <div
          className={`rounded-xl border-2 p-5 ${
            result.severity === 'ok'
              ? 'border-green-400 bg-green-50'
              : result.severity === 'warning'
              ? 'border-amber-400 bg-amber-50'
              : 'border-red-500 bg-red-50'
          }`}
        >
          <p className="text-lg font-bold mb-2">
            {result.severity === 'ok'
              ? '✅ תואם לחוק'
              : result.severity === 'warning'
              ? '⚠️ קרוב לסף'
              : '🚨 הפרה!'}
          </p>
          <p className="text-sm leading-relaxed">{result.recommendation}</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-1">
          <InfoRow label="שכר מינימום חוקי" value={formatCurrency(result.legalMinimum)} highlight />
          <InfoRow label="שכר בפועל" value={formatCurrency(actualWage)} />
          <InfoRow
            label="הפרש חודשי"
            value={result.shortfall > 0 ? `-${formatCurrency(result.shortfall)}` : '—'}
          />
          <InfoRow
            label="הפרש שנתי"
            value={result.annualShortfall > 0 ? `-${formatCurrency(result.annualShortfall)}` : '—'}
          />
          <InfoRow label="% מהמינימום" value={`${result.percentageOfMinimum.toFixed(1)}%`} />
        </div>

        {result.severity !== 'ok' && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-900 space-y-2">
            <p className="font-semibold">מה לעשות?</p>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li>תעד את שעות העבודה ותלושי השכר שלך</li>
              <li>פנה למעסיק בכתב לתיקון השגיאה</li>
              <li>פנה לקו ההסברה: 1-700-707-100</li>
              <li>הגש תלונה למשרד הכלכלה</li>
              <li>ייצוג משפטי בבית הדין לעבודה (לרוב ללא עלות)</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================
// Net Wage Tab
// ============================================================

const NET_COLORS = ['#3b82f6', '#ef4444', '#f59e0b', '#10b981'];

function NetWageTab() {
  const [ageGroup, setAgeGroup] = useState<AgeGroup>('adult');
  const [pensionEnabled, setPensionEnabled] = useState(true);
  const [creditPoints, setCreditPoints] = useState(2.25);

  const result = useMemo(
    () => calculateNetMinimumWage(ageGroup, pensionEnabled, creditPoints),
    [ageGroup, pensionEnabled, creditPoints],
  );

  const pieData = [
    { name: 'שכר נטו', value: Math.round(result.netMonthly) },
    { name: 'מס הכנסה', value: Math.round(result.incomeTax) },
    { name: 'ב.ל. + בריאות', value: Math.round(result.nationalInsurance) },
    ...(pensionEnabled ? [{ name: 'פנסיה (6%)', value: Math.round(result.pensionDeduction) }] : []),
  ];

  return (
    <div className="grid lg:grid-cols-5 gap-6">
      <div className="lg:col-span-3 bg-white border-2 border-gray-200 rounded-xl p-6 space-y-4">
        <SectionLabel>חישוב שכר מינימום נטו</SectionLabel>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">קבוצת גיל</label>
            <select
              value={ageGroup}
              onChange={(e) => setAgeGroup(e.target.value as AgeGroup)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="adult">18+ (100%)</option>
              <option value="youth-17-18">17-18 (75%)</option>
              <option value="youth-16-17">16-17 (70%)</option>
              <option value="under-16">מתחת ל-16 (60%)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              נקודות זיכוי
            </label>
            <input
              type="number"
              min={0}
              max={10}
              step={0.25}
              value={creditPoints}
              onChange={(e) => setCreditPoints(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
            <p className="text-xs text-gray-500 mt-1">ברירת מחדל: 2.25 (תושב ישראל)</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="pension-net"
            checked={pensionEnabled}
            onChange={(e) => setPensionEnabled(e.target.checked)}
            className="w-4 h-4 accent-blue-600"
          />
          <label htmlFor="pension-net" className="text-sm text-gray-700">
            ניכוי פנסיה 6% (חובה לפי חוק)
          </label>
        </div>

        {/* Pie chart */}
        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={90}
                label={({ name, percent }: { name?: string; percent?: number }) => `${name ?? ''} ${((percent ?? 0) * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {pieData.map((_, i) => (
                  <Cell key={i} fill={NET_COLORS[i % NET_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => formatCurrency(Number(v))} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-900">
          <p className="font-semibold mb-1">הערה חשובה</p>
          <p>שכר מינימום נמצא בעיקר במדרגת 10% בלבד — כלומר מרבית ההכנסה כמעט פטורה ממס הכנסה בזכות נקודות הזיכוי.</p>
        </div>
      </div>

      <div className="lg:col-span-2 space-y-4">
        <ResultCard
          title="שכר נטו חודשי"
          value={formatCurrency(result.netMonthly)}
          subtitle={`${result.netPercent.toFixed(1)}% מהברוטו`}
          variant="success"
        />
        <ResultCard
          title="שכר שעתי נטו"
          value={formatCurrency(result.hourlyNet)}
          subtitle="לפי 182 שעות/חודש"
          variant="primary"
        />

        <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-1">
          <InfoRow label="שכר ברוטו" value={formatCurrency(result.grossMonthly)} highlight />
          <InfoRow label="מס הכנסה" value={`-${formatCurrency(result.incomeTax)}`} />
          <InfoRow label="ב.ל. + בריאות" value={`-${formatCurrency(result.nationalInsurance)}`} />
          {pensionEnabled && (
            <InfoRow label="פנסיה (6%)" value={`-${formatCurrency(result.pensionDeduction)}`} />
          )}
          <InfoRow label="שכר נטו" value={formatCurrency(result.netMonthly)} highlight />
          <InfoRow label="שיעור ניכוי כולל" value={`${(100 - result.netPercent).toFixed(1)}%`} />
          <InfoRow label="שיעור מס אפקטיבי" value={`${result.effectiveTaxRate.toFixed(1)}%`} />
        </div>
      </div>
    </div>
  );
}

// ============================================================
// Youth Wages Tab
// ============================================================

function YouthTab() {
  const ages: AgeGroup[] = ['under-16', 'youth-16-17', 'youth-17-18', 'adult'];
  const youthData = ages.map((ag) => {
    const w = calculateYouthWage(ag);
    return { ...w, netWage: calculateNetMinimumWage(ag, true, 2.25).netMonthly };
  });

  const barData = youthData.map((d) => ({
    name: d.label,
    ברוטו: Math.round(d.monthlyGross),
    נטו: Math.round(d.netWage),
  }));

  return (
    <div className="space-y-6">
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-900">
        <p className="font-semibold mb-1">חוק עבודת נוער - שכר מינימום מופחת</p>
        <p>עובדים מתחת לגיל 18 זכאים לשכר מינימום מופחת. עם הגיע ל-18 יש זכות לשכר מינימום מלא.</p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {youthData.map((d) => (
          <div
            key={d.ageGroup}
            className={`rounded-xl border-2 p-4 text-center ${
              d.ageGroup === 'adult'
                ? 'border-blue-400 bg-blue-50'
                : 'border-amber-300 bg-amber-50'
            }`}
          >
            <p className="text-xs font-medium text-gray-600 mb-1">{d.label}</p>
            <p className="text-xl font-bold text-gray-900">{formatCurrency(d.monthlyGross)}</p>
            <p className="text-xs text-gray-500 mt-1">{(d.multiplier * 100).toFixed(0)}% מהמינימום</p>
            <p className="text-xs text-green-700 mt-1">נטו: ~{formatCurrency(d.netWage)}</p>
            <p className="text-xs text-gray-500 mt-1">{formatCurrency(d.hourly182)}/שעה</p>
          </div>
        ))}
      </div>

      {/* Bar chart */}
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <SectionLabel>השוואת שכר לפי גיל – ברוטו מול נטו</SectionLabel>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" tickFormatter={(v) => formatCurrency(Number(v))} width={90} />
              <YAxis type="category" dataKey="name" width={90} tick={{ fontSize: 12 }} />
              <Tooltip formatter={(v) => formatCurrency(Number(v))} />
              <Legend />
              <Bar dataKey="ברוטו" fill="#3b82f6" radius={[0, 4, 4, 0]} />
              <Bar dataKey="נטו" fill="#10b981" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Sector comparison */}
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <SectionLabel>מינימום מיוחד לפי ענף</SectionLabel>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-200 p-2 text-right font-semibold">ענף</th>
                <th className="border border-gray-200 p-2 text-right font-semibold">מינימום חודשי</th>
                <th className="border border-gray-200 p-2 text-right font-semibold">מקור</th>
                <th className="border border-gray-200 p-2 text-right font-semibold">הערות</th>
              </tr>
            </thead>
            <tbody>
              {SECTOR_MINIMUMS.map((s, i) => (
                <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="border border-gray-200 p-2 font-medium">{s.sector}</td>
                  <td className="border border-gray-200 p-2 text-blue-700 font-semibold">{formatCurrency(s.minimumMonthly)}</td>
                  <td className="border border-gray-200 p-2 text-gray-600 text-xs">{s.source}</td>
                  <td className="border border-gray-200 p-2 text-gray-500 text-xs">{s.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// Historical Tab
// ============================================================

function HistoryTab() {
  const lineData = HISTORICAL_MINIMUM_WAGES.map((h) => ({
    name: `${h.year}`,
    חודשי: h.monthly,
    שעתי: h.hourly182,
  }));

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4">
        {HISTORICAL_MINIMUM_WAGES.map((h) => (
          <div
            key={h.year}
            className={`rounded-xl border-2 p-4 ${
              h.year === 2026 ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white'
            }`}
          >
            <p className="text-sm font-semibold text-gray-600 mb-1">{h.year}</p>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(h.monthly)}</p>
            <p className="text-xs text-gray-500 mt-1">{formatCurrency(h.hourly182)}/שעה</p>
            {h.changePercent !== null && (
              <p className="text-xs text-green-700 font-medium mt-2">
                +{h.changePercent.toFixed(2)}% משנה קודמת
              </p>
            )}
            <p className="text-xs text-gray-400 mt-1">תקף מ: {h.effectiveFrom}</p>
          </div>
        ))}
      </div>

      {/* Line chart */}
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <SectionLabel>מגמת שכר מינימום 2024–2026</SectionLabel>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={lineData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis
                yAxisId="monthly"
                orientation="left"
                tickFormatter={(v) => `₪${v.toLocaleString()}`}
              />
              <YAxis yAxisId="hourly" orientation="right" tickFormatter={(v) => `₪${v}`} />
              <Tooltip formatter={(v) => formatCurrency(Number(v))} />
              <Legend />
              <Line
                yAxisId="monthly"
                type="monotone"
                dataKey="חודשי"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{ r: 6 }}
              />
              <Line
                yAxisId="hourly"
                type="monotone"
                dataKey="שעתי"
                stroke="#10b981"
                strokeWidth={3}
                dot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Comparison table */}
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <SectionLabel>השוואת תעריפים 2024–2026</SectionLabel>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-200 p-2 text-right font-semibold">תעריף</th>
                {HISTORICAL_MINIMUM_WAGES.map((h) => (
                  <th key={h.year} className="border border-gray-200 p-2 text-right font-semibold">
                    {h.year}
                  </th>
                ))}
                <th className="border border-gray-200 p-2 text-right font-semibold">שינוי כולל</th>
              </tr>
            </thead>
            <tbody>
              {(
                [
                  { label: 'חודשי', key: 'monthly' },
                  { label: 'שעתי 182', key: 'hourly182' },
                  { label: 'שעתי 186', key: 'hourly186' },
                  { label: 'יומי 5 ימים', key: 'daily5DayWeek' },
                  { label: 'יומי 6 ימים', key: 'daily6DayWeek' },
                ] as const
              ).map((row, i) => {
                const first = HISTORICAL_MINIMUM_WAGES[0][row.key] as number;
                const last = HISTORICAL_MINIMUM_WAGES[HISTORICAL_MINIMUM_WAGES.length - 1][row.key] as number;
                const totalChange = (((last - first) / first) * 100).toFixed(1);
                return (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="border border-gray-200 p-2 font-medium">{row.label}</td>
                    {HISTORICAL_MINIMUM_WAGES.map((h) => (
                      <td key={h.year} className="border border-gray-200 p-2">
                        {formatCurrency(h[row.key] as number)}
                      </td>
                    ))}
                    <td className="border border-gray-200 p-2 text-green-700 font-semibold">
                      +{totalChange}%
                    </td>
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
// International Tab
// ============================================================

function InternationalTab() {
  const israelUSD = OECD_MINIMUM_WAGES.find((c) => c.country.startsWith('ישראל'))?.monthlyUSD ?? 1_780;
  const sortedDesc = [...OECD_MINIMUM_WAGES].sort((a, b) => b.monthlyUSD - a.monthlyUSD);

  const barData = sortedDesc.map((c) => ({
    name: `${c.flag} ${c.country.replace(' 🇮🇱', '')}`,
    USD: c.monthlyUSD,
    isIsrael: c.country.startsWith('ישראל'),
  }));

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-900">
        <p className="font-semibold mb-1">השוואה בינלאומית – שכר מינימום בארצות OECD</p>
        <p>הנתונים מוצגים ב-USD בהתאמת כוח קנייה (PPP) לצורך השוואה הוגנת. ישראל (2026): ~{formatCurrency(6_443.85)} / ~{israelUSD.toLocaleString()} USD.</p>
      </div>

      {/* Bar chart */}
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <SectionLabel>שכר מינימום חודשי בארצות OECD נבחרות (USD PPP)</SectionLabel>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" tickFormatter={(v) => `$${v.toLocaleString()}`} />
              <YAxis type="category" dataKey="name" width={130} tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v) => [`$${Number(v).toLocaleString()}`, 'USD PPP']} />
              <Bar dataKey="USD" radius={[0, 4, 4, 0]}>
                {barData.map((entry, i) => (
                  <Cell key={i} fill={entry.isIsrael ? '#3b82f6' : '#94a3b8'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <SectionLabel>פירוט מדינות</SectionLabel>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-200 p-2 text-right">דגל</th>
                <th className="border border-gray-200 p-2 text-right">מדינה</th>
                <th className="border border-gray-200 p-2 text-right">מטבע מקומי</th>
                <th className="border border-gray-200 p-2 text-right">מינימום מקומי</th>
                <th className="border border-gray-200 p-2 text-right">USD PPP</th>
                <th className="border border-gray-200 p-2 text-right">שנה</th>
              </tr>
            </thead>
            <tbody>
              {sortedDesc.map((c, i) => (
                <tr
                  key={i}
                  className={
                    c.country.startsWith('ישראל')
                      ? 'bg-blue-50 font-semibold'
                      : i % 2 === 0
                      ? 'bg-white'
                      : 'bg-gray-50'
                  }
                >
                  <td className="border border-gray-200 p-2 text-center text-lg">{c.flag}</td>
                  <td className="border border-gray-200 p-2">{c.country.replace(' 🇮🇱', '')}</td>
                  <td className="border border-gray-200 p-2 text-gray-500">{c.currency}</td>
                  <td className="border border-gray-200 p-2">
                    {c.monthlyLocal.toLocaleString()} {c.currency}
                  </td>
                  <td className="border border-gray-200 p-2 text-blue-700 font-semibold">
                    ${c.monthlyUSD.toLocaleString()}
                  </td>
                  <td className="border border-gray-200 p-2 text-gray-400">{c.year}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-500 mt-3">מקורות: OECD.stat, ILO Global Wage Report 2025, ממוצעים מוערכים לפי PPP</p>
      </div>
    </div>
  );
}

// ============================================================
// Living Wage Tab
// ============================================================

const LIVING_COLORS = ['#3b82f6', '#ef4444', '#f59e0b', '#10b981', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];

function LivingWageTab() {
  const [familySize, setFamilySize] = useState<1 | 2 | 3 | 4>(1);
  const [ageGroup, setAgeGroup] = useState<AgeGroup>('adult');

  const result = useMemo(
    () => calculateLivingWageGap(familySize, ageGroup),
    [familySize, ageGroup],
  );

  const pieData = result.breakdown.map((b) => ({
    name: b.category,
    value: b.monthlyEstimate,
  }));

  return (
    <div className="grid lg:grid-cols-5 gap-6">
      <div className="lg:col-span-3 space-y-5">
        <div className="bg-white border-2 border-gray-200 rounded-xl p-6 space-y-4">
          <SectionLabel>חישוב עלות מחיה מינימלית</SectionLabel>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">גודל משפחה</label>
            <div className="flex gap-3">
              {([1, 2, 3, 4] as const).map((n) => (
                <button
                  key={n}
                  onClick={() => setFamilySize(n)}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium border-2 transition-colors ${
                    familySize === n
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {n === 1 ? 'יחיד' : n === 2 ? 'זוג' : n === 3 ? '3 נפשות' : '4 נפשות'}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">קבוצת גיל</label>
            <select
              value={ageGroup}
              onChange={(e) => setAgeGroup(e.target.value as AgeGroup)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="adult">18+ (100%)</option>
              <option value="youth-17-18">17-18 (75%)</option>
              <option value="youth-16-17">16-17 (70%)</option>
              <option value="under-16">מתחת ל-16 (60%)</option>
            </select>
          </div>

          {/* Coverage bar */}
          <div className="mt-2">
            <div className="flex justify-between text-xs text-gray-600 mb-1">
              <span>כיסוי שכר מינימום</span>
              <span>{result.coveragePercent.toFixed(0)}%</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-5">
              <div
                className={`h-5 rounded-full transition-all ${
                  result.coveragePercent >= 80
                    ? 'bg-green-500'
                    : result.coveragePercent >= 60
                    ? 'bg-amber-500'
                    : 'bg-red-500'
                }`}
                style={{ width: `${result.coveragePercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Breakdown table */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <SectionLabel>פירוט הוצאות חודשיות מוערכות</SectionLabel>
          <div className="space-y-1">
            {result.breakdown.map((b, i) => (
              <div key={i} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: LIVING_COLORS[i % LIVING_COLORS.length] }}
                  />
                  <span className="text-sm text-gray-600">{b.category}</span>
                </div>
                <span className="text-sm font-semibold">{formatCurrency(b.monthlyEstimate)}</span>
              </div>
            ))}
            <div className="flex justify-between items-center py-2 font-bold border-t-2 border-gray-300">
              <span className="text-sm">סה״כ עלות מחיה מוערכת</span>
              <span className="text-sm text-red-700">{formatCurrency(result.estimatedLivingWage)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="lg:col-span-2 space-y-4">
        <ResultCard
          title="שכר מינימום נטו"
          value={formatCurrency(result.minimumWage)}
          subtitle="ברוטו חודשי"
          variant={result.coveragePercent >= 80 ? 'success' : 'warning'}
        />

        <div
          className={`rounded-xl border-2 p-4 ${
            result.gap > 0 ? 'border-red-400 bg-red-50' : 'border-green-400 bg-green-50'
          }`}
        >
          {result.gap > 0 ? (
            <>
              <p className="font-bold text-red-900 mb-1">פער לעלות מחיה</p>
              <p className="text-2xl font-bold text-red-700">{formatCurrency(result.gap)}</p>
              <p className="text-sm text-red-800 mt-1">
                שכר מינימום מכסה {result.coveragePercent.toFixed(0)}% מעלות המחיה המינימלית
              </p>
            </>
          ) : (
            <p className="font-bold text-green-900">שכר המינימום מכסה את עלות המחיה</p>
          )}
        </div>

        {/* Pie chart */}
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-sm font-semibold text-gray-700 mb-2">חלוקת הוצאות</p>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={75}
                  label={false}
                >
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={LIVING_COLORS[i % LIVING_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => formatCurrency(Number(v))} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-xs text-blue-900">
          <p className="font-semibold mb-1">מקורות</p>
          <p>עלות מחיה מוערכת בהתאם לנתוני הלמ"ס (2025), מחירי שכ"ד ממוצעים ארציים, ומחקר מרכז אדוה.</p>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// Main Export
// ============================================================

export function MinimumWageCalculator() {
  const [activeTab, setActiveTab] = useState<MainTab>('rates');

  return (
    <div className="space-y-6">
      {/* Tab bar */}
      <div className="flex gap-2 flex-wrap">
        {TABS.map((t) => (
          <TabBtn key={t.key} active={activeTab === t.key} onClick={() => setActiveTab(t.key)}>
            {t.label}
          </TabBtn>
        ))}
      </div>

      {/* Content */}
      {activeTab === 'rates' && <RatesTab />}
      {activeTab === 'compliance' && <ComplianceTab />}
      {activeTab === 'net' && <NetWageTab />}
      {activeTab === 'youth' && <YouthTab />}
      {activeTab === 'history' && <HistoryTab />}
      {activeTab === 'international' && <InternationalTab />}
      {activeTab === 'living' && <LivingWageTab />}
    </div>
  );
}
