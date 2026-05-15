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
  PieChart,
  Pie,
  Cell,
  ReferenceLine,
} from 'recharts';
import {
  calculateDividendVsSalary,
  calculateAllMixes,
  calculateSpouseOptimization,
  type DividendVsSalaryInput,
  type ScenarioBreakdown,
  CORP_TAX_2026,
  DIVIDEND_TAX_CONTROLLING,
  DIVIDEND_TAX_REGULAR,
} from '@/lib/calculators/dividend-vs-salary';
import { formatCurrency, formatPercent } from '@/lib/utils/formatters';
import { ResultCard } from '@/components/calculator/ResultCard';
import { Breakdown } from '@/components/calculator/Breakdown';

// ============================================================
// קבועים ותצורה
// ============================================================

type TabMode = 'compare' | 'optimal' | 'longterm' | 'spouse' | 'sensitivity';

const TABS: { id: TabMode; label: string }[] = [
  { id: 'compare', label: 'השוואת אסטרטגיות' },
  { id: 'optimal', label: 'מציאת המיקס האופטימלי' },
  { id: 'longterm', label: 'השפעה ארוכת טווח' },
  { id: 'spouse', label: 'אופטימיזציית בן/בת זוג' },
  { id: 'sensitivity', label: 'ניתוח רגישות' },
];

const PIE_COLORS_SALARY = ['#3b82f6', '#ef4444', '#f59e0b', '#8b5cf6'];
const PIE_COLORS_DIVIDEND = ['#10b981', '#ef4444', '#f97316'];
const PIE_COLORS_OPTIMAL = ['#3b82f6', '#10b981', '#ef4444', '#f59e0b', '#8b5cf6', '#f97316'];

const initial: DividendVsSalaryInput = {
  companyAnnualProfit: 800_000,
  withdrawalNeeds: 600_000,
  creditPoints: 2.25,
  isMaterialShareholder: true,
  includePension: false,
  includeStudyFund: false,
  includeSpouseSalary: false,
  spouseMonthlyGross: 15_000,
  spouseCreditPoints: 2.25,
};

// ============================================================
// פונקציות עזר לפורמט
// ============================================================

function pct(val: number, decimals = 1) {
  return `${(val * 100).toFixed(decimals)}%`;
}

function shortCurrency(val: number): string {
  if (Math.abs(val) >= 1_000_000) return `${(val / 1_000_000).toFixed(1)}M ₪`;
  if (Math.abs(val) >= 1_000) return `${(val / 1_000).toFixed(0)}K ₪`;
  return formatCurrency(val);
}

// ============================================================
// Tooltip מותאם
// ============================================================

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ color: string; name: string; value: number }>;
  label?: string;
}) {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 text-sm" dir="rtl">
      {label && <div className="font-bold text-gray-900 mb-2">{label}</div>}
      {payload.map((p, i) => (
        <div key={i} className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: p.color }} />
          <span className="text-gray-700">{p.name}:</span>
          <span className="font-semibold text-gray-900">{formatCurrency(p.value)}</span>
        </div>
      ))}
    </div>
  );
}

// ============================================================
// פרטי תרחיש
// ============================================================

function ScenarioDetail({
  label,
  scenario,
  isRecommended,
  profit,
}: {
  label: string;
  scenario: ScenarioBreakdown;
  isRecommended: boolean;
  profit: number;
}) {
  const pieData = scenario.grossSalary > 0
    ? [
        { name: 'נטו לבעלים', value: scenario.netToOwner },
        { name: 'מס הכנסה', value: scenario.incomeTax },
        { name: 'ב.ל. עובד', value: scenario.employeeSocialSecurity },
        { name: 'ב.ל. מעסיק', value: scenario.employerSocialSecurity },
        { name: 'מס יסף', value: scenario.surtax },
      ].filter(d => d.value > 0)
    : [
        { name: 'נטו לבעלים', value: scenario.netToOwner },
        { name: 'מס חברות', value: scenario.corporateTax },
        { name: 'מס דיבידנד', value: scenario.dividendTax },
        { name: 'מס יסף', value: scenario.surtax },
      ].filter(d => d.value > 0);

  const colors = scenario.grossSalary > 0 ? PIE_COLORS_SALARY : PIE_COLORS_DIVIDEND;

  return (
    <div
      className={`rounded-xl border-2 p-5 transition-all ${
        isRecommended
          ? 'border-emerald-400 bg-emerald-50 shadow-md'
          : 'border-gray-200 bg-white'
      }`}
    >
      {isRecommended && (
        <div className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-xs font-bold px-2 py-1 rounded-full mb-3">
          ✓ מומלץ
        </div>
      )}
      <h3 className="font-bold text-gray-900 text-lg mb-3">{label}</h3>

      <div className="flex justify-center mb-3">
        <PieChart width={160} height={160}>
          <Pie
            data={pieData}
            cx={80}
            cy={80}
            innerRadius={40}
            outerRadius={70}
            dataKey="value"
          >
            {pieData.map((_, idx) => (
              <Cell key={idx} fill={colors[idx % colors.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(v) => formatCurrency(Number(v))}
            contentStyle={{ fontSize: '12px', direction: 'rtl' }}
          />
        </PieChart>
      </div>

      <div className="space-y-2 text-sm">
        {scenario.grossSalary > 0 && (
          <div className="flex justify-between">
            <span className="text-gray-600">משכורת ברוטו:</span>
            <span className="font-medium">{formatCurrency(scenario.grossSalary)}</span>
          </div>
        )}
        {scenario.dividend > 0 && (
          <div className="flex justify-between">
            <span className="text-gray-600">דיבידנד:</span>
            <span className="font-medium">{formatCurrency(scenario.dividend)}</span>
          </div>
        )}
        {scenario.incomeTax > 0 && (
          <div className="flex justify-between">
            <span className="text-gray-600">מס הכנסה:</span>
            <span className="font-medium text-red-600">−{formatCurrency(scenario.incomeTax)}</span>
          </div>
        )}
        {scenario.employeeSocialSecurity > 0 && (
          <div className="flex justify-between">
            <span className="text-gray-600">ב.ל. עובד:</span>
            <span className="font-medium text-red-600">−{formatCurrency(scenario.employeeSocialSecurity)}</span>
          </div>
        )}
        {scenario.employerSocialSecurity > 0 && (
          <div className="flex justify-between">
            <span className="text-gray-600">ב.ל. מעסיק:</span>
            <span className="font-medium text-orange-600">−{formatCurrency(scenario.employerSocialSecurity)}</span>
          </div>
        )}
        {scenario.corporateTax > 0 && (
          <div className="flex justify-between">
            <span className="text-gray-600">מס חברות (23%):</span>
            <span className="font-medium text-red-600">−{formatCurrency(scenario.corporateTax)}</span>
          </div>
        )}
        {scenario.dividendTax > 0 && (
          <div className="flex justify-between">
            <span className="text-gray-600">מס דיבידנד:</span>
            <span className="font-medium text-red-600">−{formatCurrency(scenario.dividendTax)}</span>
          </div>
        )}
        {scenario.surtax > 0 && (
          <div className="flex justify-between">
            <span className="text-gray-600">מס יסף (3%):</span>
            <span className="font-medium text-red-600">−{formatCurrency(scenario.surtax)}</span>
          </div>
        )}
        <div className="flex justify-between pt-2 border-t border-gray-200">
          <span className="font-bold text-gray-900">סה"כ מס:</span>
          <span className="font-bold text-red-700">{formatCurrency(scenario.totalTax)}</span>
        </div>
        <div
          className={`flex justify-between pt-2 border-t-2 ${
            isRecommended ? 'border-emerald-300' : 'border-gray-300'
          }`}
        >
          <span className="font-bold text-gray-900">נטו לבעלים:</span>
          <span
            className={`font-bold text-xl ${
              isRecommended ? 'text-emerald-700' : 'text-gray-900'
            }`}
          >
            {formatCurrency(scenario.netToOwner)}
          </span>
        </div>
        <div className="flex justify-between text-gray-500">
          <span>שיעור מס אפקטיבי:</span>
          <span>{pct(scenario.effectiveTaxRate)}</span>
        </div>
        {scenario.pensionEmployerContribution > 0 && (
          <div className="flex justify-between text-emerald-700 bg-emerald-50 rounded px-2 py-1 mt-1">
            <span className="text-xs">+ הפקדת מעסיק לפנסיה:</span>
            <span className="text-xs font-medium">
              {formatCurrency(scenario.pensionEmployerContribution)}/שנה
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================
// קלטים
// ============================================================

function InputSection({
  input,
  update,
}: {
  input: DividendVsSalaryInput;
  update: <K extends keyof DividendVsSalaryInput>(k: K, v: DividendVsSalaryInput[K]) => void;
}) {
  return (
    <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">פרטי החברה והבעלים</h2>
      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            רווח שנתי לפני מס (₪)
          </label>
          <p className="text-xs text-gray-500 mb-2">לפני משכורת בעלים ולפני מס חברות</p>
          <input
            type="number"
            min={0}
            step={50_000}
            value={input.companyAnnualProfit}
            onChange={(e) => update('companyAnnualProfit', Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            נקודות זיכוי של הבעלים
          </label>
          <p className="text-xs text-gray-500 mb-2">
            גבר רגיל = 2.25 | אישה = 2.75 | הורה לילדים = יותר
          </p>
          <input
            type="number"
            min={0}
            max={20}
            step={0.25}
            value={input.creditPoints}
            onChange={(e) => update('creditPoints', Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="border border-gray-200 rounded-lg p-4 space-y-3">
          <h3 className="font-semibold text-gray-800 text-sm">סטטוס בעלות</h3>

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={input.isMaterialShareholder}
              onChange={(e) => update('isMaterialShareholder', e.target.checked)}
              className="w-4 h-4 mt-0.5"
            />
            <div>
              <div className="text-sm font-medium text-gray-700">בעל מניות מהותי (בעל שליטה)</div>
              <div className="text-xs text-gray-500">
                מחזיק 10%+ מהמניות → מס דיבידנד 30% (במקום 25%)
              </div>
            </div>
          </label>
        </div>

        <div className="border border-gray-200 rounded-lg p-4 space-y-3">
          <h3 className="font-semibold text-gray-800 text-sm">הטבות נוספות</h3>

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={input.includePension ?? false}
              onChange={(e) => update('includePension', e.target.checked)}
              className="w-4 h-4 mt-0.5"
            />
            <div>
              <div className="text-sm font-medium text-gray-700">כלול הפקדות פנסיה</div>
              <div className="text-xs text-gray-500">
                מעסיק 6.5% + עובד 6% + פיצויים 8.33% — הוצאה מוכרת לחברה
              </div>
            </div>
          </label>

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={input.includeStudyFund ?? false}
              onChange={(e) => update('includeStudyFund', e.target.checked)}
              className="w-4 h-4 mt-0.5"
            />
            <div>
              <div className="text-sm font-medium text-gray-700">כלול קרן השתלמות</div>
              <div className="text-xs text-gray-500">
                7.5% מעסיק + 2.5% עובד — חסכון מס משמעותי עד 18,840 ₪/שנה
              </div>
            </div>
          </label>
        </div>

        <div className="border border-gray-200 rounded-lg p-4 space-y-3">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={input.includeSpouseSalary ?? false}
              onChange={(e) => update('includeSpouseSalary', e.target.checked)}
              className="w-4 h-4 mt-0.5"
            />
            <div>
              <div className="text-sm font-medium text-gray-700">בן/בת זוג עובד בחברה</div>
              <div className="text-xs text-gray-500">
                מפזר הכנסה → מדרגות מס נמוכות יותר
              </div>
            </div>
          </label>

          {input.includeSpouseSalary && (
            <div className="space-y-3 pt-2 border-t border-gray-100">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  משכורת חודשית ברוטו לבן/בת זוג (₪)
                </label>
                <input
                  type="number"
                  min={6_500}
                  max={100_000}
                  step={1_000}
                  value={input.spouseMonthlyGross ?? 15_000}
                  onChange={(e) => update('spouseMonthlyGross', Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  נקודות זיכוי של בן/בת הזוג
                </label>
                <input
                  type="number"
                  min={0}
                  max={20}
                  step={0.25}
                  value={input.spouseCreditPoints ?? 2.25}
                  onChange={(e) => update('spouseCreditPoints', Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* מידע מס נוכחי */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4 text-xs text-blue-800 space-y-1">
        <div className="font-bold mb-2">שיעורי מס 2026 בשימוש:</div>
        <div className="flex justify-between">
          <span>מס חברות:</span>
          <span className="font-medium">{pct(CORP_TAX_2026)}</span>
        </div>
        <div className="flex justify-between">
          <span>מס דיבידנד (מהותי):</span>
          <span className="font-medium">{pct(DIVIDEND_TAX_CONTROLLING)}</span>
        </div>
        <div className="flex justify-between">
          <span>מס דיבידנד (רגיל):</span>
          <span className="font-medium">{pct(DIVIDEND_TAX_REGULAR)}</span>
        </div>
        <div className="flex justify-between">
          <span>מס יסף:</span>
          <span className="font-medium">3% מעל 721,560 ₪/שנה</span>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// טאב 1: השוואת אסטרטגיות
// ============================================================

function CompareTab({
  result,
  profit,
}: {
  result: ReturnType<typeof calculateDividendVsSalary>;
  profit: number;
}) {
  const labels = {
    allSalary: 'הכל משכורת',
    allDividend: 'הכל דיבידנד',
    optimal: 'מעורב אופטימלי',
  };

  const barData = [
    {
      name: 'הכל משכורת',
      'נטו לבעלים': Math.round(result.allSalary.netToOwner),
      'מס הכנסה': Math.round(result.allSalary.incomeTax + result.allSalary.surtax),
      'ב.ל.': Math.round(result.allSalary.socialSecurity),
    },
    {
      name: 'הכל דיבידנד',
      'נטו לבעלים': Math.round(result.allDividend.netToOwner),
      'מס חברות': Math.round(result.allDividend.corporateTax),
      'מס דיבידנד': Math.round(result.allDividend.dividendTax + result.allDividend.surtax),
    },
    {
      name: 'מעורב אופטימלי',
      'נטו לבעלים': Math.round(result.optimal.netToOwner),
      'מס הכנסה': Math.round(result.optimal.incomeTax + result.optimal.surtax),
      'ב.ל.': Math.round(result.optimal.socialSecurity),
      'מס חברות': Math.round(result.optimal.corporateTax),
      'מס דיבידנד': Math.round(result.optimal.dividendTax),
    },
  ];

  return (
    <div className="space-y-6">
      {/* כרטיסי המלצה */}
      <div className="grid md:grid-cols-3 gap-4">
        {(['allSalary', 'optimal', 'allDividend'] as const).map((key) => (
          <ScenarioDetail
            key={key}
            label={labels[key]}
            scenario={result[key]}
            isRecommended={result.recommendation === key}
            profit={profit}
          />
        ))}
      </div>

      {/* גרף השוואה */}
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <h3 className="font-bold text-gray-900 mb-4">השוואת נטו לבעלים לפי אסטרטגיה</h3>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={barData} margin={{ top: 10, right: 10, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tickFormatter={shortCurrency} tick={{ fontSize: 11 }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="נטו לבעלים" fill="#10b981" radius={[4, 4, 0, 0]} />
            <Bar dataKey="מס הכנסה" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            <Bar dataKey="ב.ל." fill="#8b5cf6" radius={[4, 4, 0, 0]} />
            <Bar dataKey="מס חברות" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            <Bar dataKey="מס דיבידנד" fill="#ef4444" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* פירוט מס מצרפי */}
      <div className="grid md:grid-cols-2 gap-4">
        <Breakdown
          title="פירוט - הכל משכורת"
          defaultOpen={false}
          items={[
            { label: 'רווח חברה', value: formatCurrency(profit) },
            { label: 'משכורת ברוטו', value: formatCurrency(result.allSalary.grossSalary) },
            { label: 'ב.ל. מעסיק', value: `−${formatCurrency(result.allSalary.employerSocialSecurity)}` },
            { label: 'ב.ל. עובד', value: `−${formatCurrency(result.allSalary.employeeSocialSecurity)}` },
            { label: 'מס הכנסה', value: `−${formatCurrency(result.allSalary.incomeTax)}` },
            { label: 'מס יסף', value: `−${formatCurrency(result.allSalary.surtax)}` },
            { label: 'נטו לבעלים', value: formatCurrency(result.allSalary.netToOwner), bold: true },
            { label: 'שיעור מס אפקטיבי', value: pct(result.allSalary.effectiveTaxRate) },
          ]}
        />
        <Breakdown
          title="פירוט - הכל דיבידנד"
          defaultOpen={false}
          items={[
            { label: 'רווח חברה', value: formatCurrency(profit) },
            { label: 'מס חברות (23%)', value: `−${formatCurrency(result.allDividend.corporateTax)}` },
            { label: 'רווח אחרי מס חברות', value: formatCurrency(result.allDividend.dividend) },
            { label: `מס דיבידנד (${pct(result.allDividend.dividendTax / Math.max(result.allDividend.dividend, 1))})`, value: `−${formatCurrency(result.allDividend.dividendTax)}` },
            { label: 'מס יסף', value: `−${formatCurrency(result.allDividend.surtax)}` },
            { label: 'נטו לבעלים', value: formatCurrency(result.allDividend.netToOwner), bold: true },
            { label: 'שיעור מס אפקטיבי מצרפי', value: pct(result.allDividend.effectiveTaxRate) },
          ]}
        />
      </div>

      {/* המלצה */}
      {result.taxSavings > 0 && (
        <div className="bg-emerald-50 border-2 border-emerald-300 rounded-xl p-5">
          <div className="flex items-start gap-3">
            <div className="text-2xl">💡</div>
            <div>
              <div className="font-bold text-emerald-900 text-lg mb-1">
                המלצה: {labels[result.recommendation]}
              </div>
              <div className="text-emerald-800">
                חיסכון שנתי של{' '}
                <strong className="text-xl">{formatCurrency(result.taxSavings)}</strong>{' '}
                לעומת אסטרטגיית &quot;הכל משכורת&quot;.
              </div>
              {result.recommendation === 'optimal' && (
                <div className="mt-2 text-sm text-emerald-700">
                  המיקס האופטימלי: משכורת {formatCurrency(result.optimal.grossSalary)}/שנה (
                  {result.optimal.salaryPct.toFixed(0)}% מהרווח) + דיבידנד{' '}
                  {formatCurrency(result.optimal.dividend)}/שנה.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// טאב 2: מציאת המיקס האופטימלי
// ============================================================

function OptimalMixTab({
  result,
  profit,
  creditPoints,
  isMaterialShareholder,
  includePension,
  includeStudyFund,
}: {
  result: ReturnType<typeof calculateDividendVsSalary>;
  profit: number;
  creditPoints: number;
  isMaterialShareholder: boolean;
  includePension: boolean;
  includeStudyFund: boolean;
}) {
  const mixes = useMemo(
    () => calculateAllMixes(profit, creditPoints, isMaterialShareholder, includePension, includeStudyFund),
    [profit, creditPoints, isMaterialShareholder, includePension, includeStudyFund],
  );

  // סנן לנקודות מייצגות לגרף (כל 50K ₪ משכורת)
  const chartData = useMemo(() => {
    const step = 50_000;
    const seen = new Set<number>();
    return mixes
      .filter((m) => {
        const rounded = Math.round(m.grossSalary / step) * step;
        if (seen.has(rounded)) return false;
        seen.add(rounded);
        return true;
      })
      .map((m) => ({
        משכורת: Math.round(m.grossSalary),
        'נטו לבעלים': Math.round(m.netToOwner),
        'סה"כ מס': Math.round(m.totalTax),
        salaryPct: m.salaryPct.toFixed(0) + '%',
      }));
  }, [mixes]);

  const optimalSalary = result.optimal.grossSalary;

  return (
    <div className="space-y-6">
      {/* כרטיס אופטימום */}
      <div className="grid md:grid-cols-3 gap-4">
        <ResultCard
          title="משכורת אופטימלית"
          value={formatCurrency(result.optimal.grossSalary)}
          subtitle={`${result.optimal.salaryPct.toFixed(0)}% מרווח החברה`}
          variant="success"
        />
        <ResultCard
          title="דיבידנד אופטימלי"
          value={formatCurrency(result.optimal.dividend)}
          subtitle="לאחר מס חברות"
          variant="primary"
        />
        <ResultCard
          title="נטו לבעלים"
          value={formatCurrency(result.optimal.netToOwner)}
          subtitle={`שיעור מס: ${pct(result.optimal.effectiveTaxRate)}`}
          variant="success"
        />
      </div>

      {/* גרף נטו לפי משכורת */}
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <h3 className="font-bold text-gray-900 mb-1">נטו לבעלים לפי גובה המשכורת</h3>
        <p className="text-sm text-gray-500 mb-4">
          הנקודה הגבוהה ביותר = המיקס האופטימלי. מימין: הכל משכורת. משמאל: הכל דיבידנד.
        </p>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="משכורת" tickFormatter={shortCurrency} tick={{ fontSize: 10 }} />
            <YAxis tickFormatter={shortCurrency} tick={{ fontSize: 11 }} />
            <Tooltip
              formatter={(v, name) => [formatCurrency(Number(v)), name as string]}
              labelFormatter={(v) => `משכורת: ${formatCurrency(Number(v))}`}
              contentStyle={{ direction: 'rtl', fontSize: '12px' }}
            />
            <Legend />
            <ReferenceLine
              x={Math.round(optimalSalary)}
              stroke="#10b981"
              strokeWidth={2}
              strokeDasharray="5 5"
              label={{ value: 'אופטימום', position: 'top', fontSize: 11, fill: '#10b981' }}
            />
            <Line
              type="monotone"
              dataKey='נטו לבעלים'
              stroke="#3b82f6"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey='סה"כ מס'
              stroke="#ef4444"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* גרף עמודות: פירוק מס לפי מיקס */}
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <h3 className="font-bold text-gray-900 mb-4">הרכב המס לפי גובה המשכורת</h3>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart
            data={chartData.map((d) => ({
              ...d,
              'מס הכנסה': Math.round(
                mixes.find((m) => Math.round(m.grossSalary) === d['משכורת'])?.incomeTax ?? 0,
              ),
              'ב.ל.': Math.round(
                mixes.find((m) => Math.round(m.grossSalary) === d['משכורת'])?.socialSecurity ?? 0,
              ),
              'מס חברות': Math.round(
                mixes.find((m) => Math.round(m.grossSalary) === d['משכורת'])?.corporateTax ?? 0,
              ),
              'מס דיבידנד': Math.round(
                mixes.find((m) => Math.round(m.grossSalary) === d['משכורת'])?.dividendTax ?? 0,
              ),
            }))}
            margin={{ top: 10, right: 10, left: 10, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="משכורת" tickFormatter={shortCurrency} tick={{ fontSize: 10 }} />
            <YAxis tickFormatter={shortCurrency} tick={{ fontSize: 11 }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="מס הכנסה" stackId="a" fill="#3b82f6" />
            <Bar dataKey="ב.ל." stackId="a" fill="#8b5cf6" />
            <Bar dataKey="מס חברות" stackId="a" fill="#f59e0b" />
            <Bar dataKey="מס דיבידנד" stackId="a" fill="#ef4444" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* הסבר */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
        <h4 className="font-bold text-blue-900 mb-3">למה זה האופטימום?</h4>
        <div className="text-sm text-blue-800 space-y-2">
          <p>
            <strong>הנוסחה:</strong> כל ₪ משכורת שמוסיפים — חוסך מס חברות (23%) + ב.ל. מעסיק, אבל עולה
            מס הכנסה שולי + ב.ל. עובד.
          </p>
          <p>
            <strong>נקודת השוויון:</strong> כשמס השולי על המשכורת שווה לשיעור המס המצרפי על הדיבידנד
            (~46%), כדאי לעצור ולעבור לדיבידנד.
          </p>
          <p>
            <strong>הכלל המעשי:</strong> משכורת עד מדרגת 31% (25,100 ₪/חודש) בד&quot;כ משתלמת. מעבר לזה —
            דיבידנד.
          </p>
        </div>
      </div>

      {/* פירוט האופטימום */}
      <Breakdown
        title="פירוט המיקס האופטימלי"
        defaultOpen={true}
        items={[
          { label: 'רווח החברה', value: formatCurrency(profit) },
          { label: 'משכורת ברוטו לבעלים', value: formatCurrency(result.optimal.grossSalary) },
          { label: 'ב.ל. מעסיק', value: `−${formatCurrency(result.optimal.employerSocialSecurity)}` },
          { label: 'נשאר לדיבידנד (לפני מס חברות)', value: formatCurrency(profit - result.optimal.grossSalary - result.optimal.employerSocialSecurity) },
          { label: 'מס חברות (23%)', value: `−${formatCurrency(result.optimal.corporateTax)}` },
          { label: 'דיבידנד לאחר מס חברות', value: formatCurrency(result.optimal.dividend) },
          { label: 'ב.ל. עובד', value: `−${formatCurrency(result.optimal.employeeSocialSecurity)}` },
          { label: 'מס הכנסה', value: `−${formatCurrency(result.optimal.incomeTax)}` },
          { label: 'מס דיבידנד', value: `−${formatCurrency(result.optimal.dividendTax)}` },
          { label: 'מס יסף', value: `−${formatCurrency(result.optimal.surtax)}` },
          { label: 'סה"כ מס', value: formatCurrency(result.optimal.totalTax) },
          { label: 'נטו לבעלים', value: formatCurrency(result.optimal.netToOwner), bold: true },
          { label: 'שיעור מס אפקטיבי', value: pct(result.optimal.effectiveTaxRate), bold: true },
        ]}
      />
    </div>
  );
}

// ============================================================
// טאב 3: השפעה ארוכת טווח
// ============================================================

function LongTermTab({ result }: { result: ReturnType<typeof calculateDividendVsSalary> }) {
  const projection = result.longTermProjection;

  const chartData = projection.map((p) => ({
    שנה: p.years,
    'אופטימלי': Math.round(p.cumulativeNetOptimal),
    'הכל משכורת': Math.round(p.cumulativeNetSalary),
    'הכל דיבידנד': Math.round(p.cumulativeNetDividend),
    'קרן פנסיה': Math.round(p.pensionFundValue),
  }));

  const year20 = projection[projection.length - 1];

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-4">
        <ResultCard
          title="נטו מצטבר - 20 שנה (אופטימלי)"
          value={formatCurrency(year20.cumulativeNetOptimal)}
          subtitle={`ממוצע ${formatCurrency(year20.cumulativeNetOptimal / 20)}/שנה`}
          variant="success"
        />
        <ResultCard
          title="שווי קרן פנסיה (20 שנה)"
          value={formatCurrency(year20.pensionFundValue)}
          subtitle="תשואה 7% בשנה (לא מובטח)"
          variant="primary"
        />
        <ResultCard
          title="יתרון אופטימלי על משכורת מלאה"
          value={formatCurrency(year20.cumulativeNetOptimal - year20.cumulativeNetSalary)}
          subtitle="הפרש מצטבר לאורך 20 שנה"
          variant="success"
        />
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <h3 className="font-bold text-gray-900 mb-4">נטו מצטבר לאורך 20 שנה</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="שנה" label={{ value: 'שנים', position: 'insideBottom', offset: -5 }} />
            <YAxis tickFormatter={shortCurrency} tick={{ fontSize: 11 }} />
            <Tooltip
              formatter={(v, name) => [formatCurrency(Number(v)), name as string]}
              labelFormatter={(v) => `שנה ${v}`}
              contentStyle={{ direction: 'rtl', fontSize: '12px' }}
            />
            <Legend />
            <Line type="monotone" dataKey="אופטימלי" stroke="#10b981" strokeWidth={3} dot={false} />
            <Line type="monotone" dataKey="הכל משכורת" stroke="#3b82f6" strokeWidth={2} dot={false} strokeDasharray="5 5" />
            <Line type="monotone" dataKey="הכל דיבידנד" stroke="#f59e0b" strokeWidth={2} dot={false} strokeDasharray="3 3" />
            <Line type="monotone" dataKey="קרן פנסיה" stroke="#8b5cf6" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
        <h4 className="font-bold text-amber-900 mb-3">שיקולי פנסיה וחיסכון ארוך טווח</h4>
        <div className="text-sm text-amber-800 space-y-3">
          <div className="flex gap-2">
            <span className="text-lg">📈</span>
            <div>
              <strong>דיבידנד לא בונה פנסיה</strong> — הכנסה מדיבידנד אינה מזכה בהפקדות פנסיוניות.
              בעלים שמושך רק דיבידנד יצטרך לחסוך לפנסיה בנפרד.
            </div>
          </div>
          <div className="flex gap-2">
            <span className="text-lg">💰</span>
            <div>
              <strong>קרן השתלמות</strong> — משכורת מאפשרת הפקדה לקרן השתלמות: 7.5% מעסיק + 2.5% עובד.
              עד 18,840 ₪/שנה פטורים ממס. אחרי 6 שנים — כסף נזיל.
            </div>
          </div>
          <div className="flex gap-2">
            <span className="text-lg">🏦</span>
            <div>
              <strong>הפקדות פנסיה מוכרות</strong> — הפקדת מעסיק לפנסיה היא הוצאה מוכרת לחברה (חיסכון
              מס חברות 23%). הפקדת עובד — פטורה ממס הכנסה עד תקרה.
            </div>
          </div>
          <div className="flex gap-2">
            <span className="text-lg">⚠️</span>
            <div>
              <strong>הנחות בתחזית:</strong> תשואת פנסיה 7% שנתי (לא מובטח). אינפלציה לא מחושבת.
              שיעורי מס עשויים להשתנות. יש לבצע בדיקה עם יועץ פנסיוני מוסמך.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// טאב 4: אופטימיזציית בן/בת זוג
// ============================================================

function SpouseTab({
  input,
  result,
  profit,
}: {
  input: DividendVsSalaryInput;
  result: ReturnType<typeof calculateDividendVsSalary>;
  profit: number;
}) {
  const spouseOptimization = result.spouseOptimization;

  const examples = [12_000, 15_000, 20_000, 25_000].map((salary) => {
    const opt = calculateSpouseOptimization(
      profit,
      input.creditPoints,
      input.isMaterialShareholder,
      salary,
      input.spouseCreditPoints ?? 2.25,
    );
    return {
      'משכורת בן/בת זוג': formatCurrency(salary) + '/חודש',
      'חיסכון שנתי': Math.round(opt.annualTaxSaving),
      'נטו ביחד': Math.round(opt.netWithSpouse),
    };
  });

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
        <h3 className="font-bold text-blue-900 mb-2">מהי אסטרטגיית פיצול הכנסה?</h3>
        <p className="text-sm text-blue-800">
          כשבן/בת הזוג עובד בחברה ומקבל משכורת, הכנסה מתפזרת לשני מסלולי מס נפרדים. כל אחד ממלא
          את המדרגות הנמוכות שלו, מה שמוריד את שיעור המס האפקטיבי הכולל.
        </p>
      </div>

      {spouseOptimization ? (
        <>
          <div className="grid md:grid-cols-3 gap-4">
            <ResultCard
              title="חיסכון מס שנתי"
              value={formatCurrency(spouseOptimization.annualTaxSaving)}
              subtitle="בזכות פיצול הכנסה"
              variant={spouseOptimization.annualTaxSaving > 0 ? 'success' : 'warning'}
            />
            <ResultCard
              title="נטו ביחד (בעלים + בן/בת זוג)"
              value={formatCurrency(spouseOptimization.netWithSpouse)}
              subtitle={`נטו בן/בת זוג: ${formatCurrency(spouseOptimization.spouseNetSalary)}`}
              variant="primary"
            />
            <ResultCard
              title="עלות מעסיק (לחברה)"
              value={formatCurrency(spouseOptimization.spouseEmployerCost)}
              subtitle="כולל ב.ל. מעסיק"
              variant="warning"
            />
          </div>

          <Breakdown
            title="פירוט אופטימיזציית בן/בת זוג"
            defaultOpen={true}
            items={[
              { label: 'נטו לבעלים ללא בן/בת זוג', value: formatCurrency(spouseOptimization.netWithoutSpouse) },
              { label: 'נטו ביחד עם בן/בת זוג', value: formatCurrency(spouseOptimization.netWithSpouse) },
              { label: 'חיסכון שנתי', value: formatCurrency(spouseOptimization.annualTaxSaving), bold: true },
              { label: 'נטו בן/בת זוג', value: formatCurrency(spouseOptimization.spouseNetSalary) },
              { label: 'עלות מעסיק לחברה', value: `${formatCurrency(spouseOptimization.spouseEmployerCost)}/שנה` },
            ]}
          />
        </>
      ) : (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 text-center text-gray-500">
          <div className="text-4xl mb-3">👩‍💼</div>
          <p className="font-medium">סמן &quot;בן/בת זוג עובד בחברה&quot; בטופס הקלט כדי לראות את האנליזה</p>
        </div>
      )}

      {/* טבלת דוגמאות */}
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <h3 className="font-bold text-gray-900 mb-4">
          השוואת חיסכון לפי גובה משכורת בן/בת זוג
        </h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={examples} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="משכורת בן/בת זוג" tick={{ fontSize: 11 }} />
            <YAxis tickFormatter={shortCurrency} tick={{ fontSize: 11 }} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="חיסכון שנתי" fill="#10b981" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 text-sm text-amber-800">
        <strong>שים לב:</strong> כדי שמשכורת לבן/בת זוג תהיה חוקית, הבן/בת זוג חייב לבצע עבודה
        ממשית בחברה בהלימה לשכר. שכר חסר בסיס עסקי עלול להיפסל על ידי פקיד השומה. מומלץ
        לתעד את תפקיד הבן/בת זוג, שעות עבודה, ולשמור חוזה עבודה מסודר.
      </div>
    </div>
  );
}

// ============================================================
// טאב 5: ניתוח רגישות
// ============================================================

function SensitivityTab({ result }: { result: ReturnType<typeof calculateDividendVsSalary> }) {
  const sensitivity = result.sensitivityAnalysis;

  // מטריצת רגישות - לכל שילוב של מס חברות × מס דיבידנד
  const corpTaxRates = [0.20, 0.23, 0.25, 0.28];
  const divTaxRates = [0.25, 0.28, 0.30, 0.33];

  // גרף קווי: שינוי מס חברות על נטו
  const corpTaxChartData = corpTaxRates.flatMap((ct) =>
    divTaxRates.map((dt) => {
      const point = sensitivity.find((s) => s.corpTax === ct && s.divTax === dt);
      return {
        'מס חברות': `${(ct * 100).toFixed(0)}%`,
        'מס דיב': `${(dt * 100).toFixed(0)}%`,
        'נטו (דיב מלא)': Math.round(point?.netDividend ?? 0),
        'נטו (אופטימלי)': Math.round(point?.netOptimal ?? 0),
      };
    }),
  );

  // בחר רק מס דיב' 30% (מהותי) להצגה ראשית
  const mainChartData = corpTaxRates.map((ct) => {
    const point = sensitivity.find((s) => s.corpTax === ct && s.divTax === 0.30);
    return {
      'מס חברות': `${(ct * 100).toFixed(0)}%`,
      'נטו דיבידנד מלא': Math.round(point?.netDividend ?? 0),
      'נטו אופטימלי': Math.round(point?.netOptimal ?? 0),
    };
  });

  return (
    <div className="space-y-6">
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
        <h3 className="font-bold text-gray-900 mb-2">מה אם שיעורי המס ישתנו?</h3>
        <p className="text-sm text-gray-700">
          שיעורי המס בישראל משתנים מעת לעת. הניתוח הבא מראה איך היה משתנה הנטו שלך תחת תרחישי
          מס שונים.
        </p>
      </div>

      {/* גרף עמודות - השפעת שינוי מס חברות */}
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <h3 className="font-bold text-gray-900 mb-4">
          השפעת שינוי מס חברות על הנטו (מס דיבידנד מהותי 30%)
        </h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={mainChartData} margin={{ top: 10, right: 10, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="מס חברות" />
            <YAxis tickFormatter={shortCurrency} tick={{ fontSize: 11 }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="נטו דיבידנד מלא" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            <Bar dataKey="נטו אופטימלי" fill="#10b981" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* מטריצה */}
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <h3 className="font-bold text-gray-900 mb-4">מטריצת רגישות - נטו (דיבידנד מלא)</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-200 px-3 py-2 text-right">מס חברות \ מס דיב'</th>
                {divTaxRates.map((dt) => (
                  <th key={dt} className="border border-gray-200 px-3 py-2 text-center">
                    {pct(dt)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {corpTaxRates.map((ct) => (
                <tr key={ct} className="hover:bg-gray-50">
                  <td className="border border-gray-200 px-3 py-2 font-medium">{pct(ct)}</td>
                  {divTaxRates.map((dt) => {
                    const point = sensitivity.find((s) => s.corpTax === ct && s.divTax === dt);
                    const isCurrent = ct === CORP_TAX_2026 && dt === DIVIDEND_TAX_CONTROLLING;
                    return (
                      <td
                        key={dt}
                        className={`border border-gray-200 px-3 py-2 text-center ${
                          isCurrent ? 'bg-blue-100 font-bold text-blue-900' : ''
                        }`}
                      >
                        {point ? shortCurrency(point.netDividend) : '—'}
                        {isCurrent && (
                          <div className="text-xs text-blue-600">נוכחי</div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 text-sm text-blue-800">
        <strong>מה זה אומר למעשה?</strong> אם ממשלת ישראל תעלה את מס החברות ל-28%, הנטו שלך מדיבידנד
        ירד. לכן, אסטרטגיית מיקס גמישה שיכולה להתאים לשינויים — עדיפה על פני מדיניות קשיחה של
        &quot;הכל דיבידנד&quot;.
      </div>
    </div>
  );
}

// ============================================================
// קומפוננטה ראשית
// ============================================================

export function DividendVsSalaryCalculator() {
  const [input, setInput] = useState<DividendVsSalaryInput>(initial);
  const [activeTab, setActiveTab] = useState<TabMode>('compare');

  const result = useMemo(() => calculateDividendVsSalary(input), [input]);

  function update<K extends keyof DividendVsSalaryInput>(k: K, v: DividendVsSalaryInput[K]) {
    setInput((p) => ({ ...p, [k]: v }));
  }

  const profit = Math.max(0, input.companyAnnualProfit);

  return (
    <div className="space-y-6" dir="rtl">
      {/* שורת סיכום עליונה */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white border border-gray-200 rounded-lg p-3 text-center">
          <div className="text-xs text-gray-500 mb-1">רווח חברה</div>
          <div className="font-bold text-gray-900 text-lg">{shortCurrency(profit)}</div>
        </div>
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-center">
          <div className="text-xs text-gray-500 mb-1">נטו אופטימלי</div>
          <div className="font-bold text-emerald-700 text-lg">
            {shortCurrency(result.optimal.netToOwner)}
          </div>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
          <div className="text-xs text-gray-500 mb-1">חיסכון vs. כל-משכורת</div>
          <div className="font-bold text-blue-700 text-lg">
            {shortCurrency(result.taxSavings)}
          </div>
        </div>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-center">
          <div className="text-xs text-gray-500 mb-1">מס אפקטיבי (אופטימלי)</div>
          <div className="font-bold text-gray-900 text-lg">
            {pct(result.optimal.effectiveTaxRate)}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* עמודת קלטים */}
        <div className="lg:col-span-2">
          <InputSection input={input} update={update} />
        </div>

        {/* עמודת תוצאות */}
        <div className="lg:col-span-3">
          {/* טאבים */}
          <div className="flex gap-1 flex-wrap mb-4">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-2 text-sm rounded-lg font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === 'compare' && (
            <CompareTab result={result} profit={profit} />
          )}
          {activeTab === 'optimal' && (
            <OptimalMixTab
              result={result}
              profit={profit}
              creditPoints={input.creditPoints}
              isMaterialShareholder={input.isMaterialShareholder}
              includePension={input.includePension ?? false}
              includeStudyFund={input.includeStudyFund ?? false}
            />
          )}
          {activeTab === 'longterm' && (
            <LongTermTab result={result} />
          )}
          {activeTab === 'spouse' && (
            <SpouseTab input={input} result={result} profit={profit} />
          )}
          {activeTab === 'sensitivity' && (
            <SensitivityTab result={result} />
          )}
        </div>
      </div>
    </div>
  );
}
