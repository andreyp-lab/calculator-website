'use client';

import { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
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
} from 'recharts';
import {
  calculatePurchaseTax,
  calculatePurchaseTaxByType,
  calculateImmigrantDiscount,
  compareAllBuyerTypes,
  compareAcrossYears,
  getSmartRecommendations,
  type BuyerType,
  type TaxYear,
  BUYER_TYPE_LABELS,
  BUYER_TYPE_DESCRIPTION,
} from '@/lib/calculators/purchase-tax';
import { formatCurrency, formatPercent, formatNumber } from '@/lib/utils/formatters';
import { ResultCard } from '@/components/calculator/ResultCard';
import { Breakdown } from '@/components/calculator/Breakdown';
import { Info } from 'lucide-react';

// ============================================================
// סוגי טאבים
// ============================================================

type TabMode = 'calculator' | 'comparison' | 'years' | 'joint' | 'recommendations';

const TABS: { id: TabMode; label: string }[] = [
  { id: 'calculator',      label: 'חישוב מס' },
  { id: 'comparison',      label: 'השוואת רוכשים' },
  { id: 'years',           label: 'השוואת שנים' },
  { id: 'joint',           label: 'רכישה משותפת' },
  { id: 'recommendations', label: 'המלצות חכמות' },
];

// ============================================================
// עזרים וצבעים
// ============================================================

const BRACKET_COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];
const BUYER_COLORS: Record<string, string> = {
  'first-home':   '#10b981',
  replacement:    '#3b82f6',
  investor:       '#ef4444',
  oleh:           '#8b5cf6',
  disabled:       '#f59e0b',
};

const TAX_YEARS: TaxYear[] = [2024, 2025, 2026];

function fmt(n: number) {
  return formatCurrency(n, { decimals: 0 });
}

function fmtShort(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)     return `${(n / 1_000).toFixed(0)}K`;
  return String(n);
}

// ============================================================
// Custom Tooltip for Recharts
// ============================================================

function CustomTooltip({ active, payload, label }: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 text-sm text-right" dir="rtl">
      <p className="font-bold text-gray-800 mb-1">{label}</p>
      {payload.map((entry, i) => (
        <p key={i} style={{ color: entry.color }}>
          {entry.name}: {fmt(entry.value)}
        </p>
      ))}
    </div>
  );
}

// ============================================================
// מרכיב קטן: בחירת טאב
// ============================================================

function TabBar({
  tabs,
  active,
  onChange,
}: {
  tabs: { id: TabMode; label: string }[];
  active: TabMode;
  onChange: (t: TabMode) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1 border-b border-gray-200 mb-6">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
          className={`px-4 py-2 text-sm font-medium rounded-t-lg border-b-2 transition ${
            active === tab.id
              ? 'border-blue-600 text-blue-700 bg-blue-50'
              : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

// ============================================================
// טאב 1: חישוב מס עיקרי
// ============================================================

function CalculatorTab({
  propertyValue,
  setPropertyValue,
  buyerType,
  setBuyerType,
  year,
  setYear,
}: {
  propertyValue: number;
  setPropertyValue: (v: number) => void;
  buyerType: BuyerType;
  setBuyerType: (v: BuyerType) => void;
  year: TaxYear;
  setYear: (v: TaxYear) => void;
}) {
  const result = useMemo(
    () => calculatePurchaseTaxByType({ propertyValue, buyerType, year }),
    [propertyValue, buyerType, year],
  );

  // נתוני עוגה
  const pieData = useMemo(() => {
    const taxPart = result.totalTax;
    const netPart = propertyValue - 0; // לא מחסירים מס - מראים יחס
    return [
      { name: 'מס רכישה', value: taxPart },
      { name: 'שווי הנכס', value: propertyValue },
    ];
  }, [propertyValue, result.totalTax]);

  // נתוני עמודות מדרגות
  const barData = useMemo(
    () =>
      result.breakdown.map((b) => ({
        name: b.bracket,
        'מס במדרגה': b.taxInBracket,
        'סכום במדרגה': b.amountInBracket,
      })),
    [result.breakdown],
  );

  return (
    <div className="grid lg:grid-cols-5 gap-6">
      {/* טופס קלט */}
      <div className="lg:col-span-3 space-y-5">
        {/* שווי הדירה */}
        <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">פרטי הרכישה</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                שווי הדירה (ש"ח)
              </label>
              <input
                type="number"
                min={0}
                step={50_000}
                value={propertyValue}
                onChange={(e) => setPropertyValue(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-lg font-semibold focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                מחיר הדירה כפי שהוסכם בחוזה הרכישה
              </p>
            </div>

            {/* שנת מס */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">שנת מדרגות</label>
              <div className="flex gap-2">
                {TAX_YEARS.map((y) => (
                  <button
                    key={y}
                    type="button"
                    onClick={() => setYear(y)}
                    className={`flex-1 py-2 rounded-lg border-2 text-sm font-medium transition ${
                      year === y
                        ? 'border-blue-600 bg-blue-50 text-blue-900'
                        : 'border-gray-300 text-gray-600 hover:border-gray-400'
                    }`}
                  >
                    {y}
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                המדרגות מתעדכנות ב-15 בינואר לפי מדד המחירים לצרכן
              </p>
            </div>
          </div>
        </div>

        {/* סוג רוכש */}
        <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">סוג הרוכש</h2>
          <div className="space-y-2">
            {(Object.keys(BUYER_TYPE_LABELS) as BuyerType[]).map((type) => (
              <label
                key={type}
                className={`flex items-start gap-3 p-3 border-2 rounded-xl cursor-pointer transition ${
                  buyerType === type
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <input
                  type="radio"
                  checked={buyerType === type}
                  onChange={() => setBuyerType(type)}
                  className="mt-1 accent-blue-600"
                />
                <div className="flex-1">
                  <div className="font-semibold text-sm text-gray-900">
                    {BUYER_TYPE_LABELS[type]}
                  </div>
                  <div className="text-xs text-gray-600 mt-0.5">
                    {BUYER_TYPE_DESCRIPTION[type]}
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* תוצאות */}
      <div className="lg:col-span-2 space-y-4">
        <ResultCard
          title="מס רכישה לתשלום"
          value={fmt(result.totalTax)}
          subtitle={
            result.fullExemption
              ? 'פטור מלא ממס!'
              : `${formatPercent(result.effectiveRate / 100, 2)} מהשווי`
          }
          variant={result.fullExemption ? 'success' : result.totalTax > 200_000 ? 'warning' : 'primary'}
        />

        {/* סיכום */}
        <div className="bg-white border-2 border-gray-200 rounded-xl p-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">שווי הדירה</span>
            <span className="font-bold">{fmt(propertyValue)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">מס רכישה</span>
            <span className="font-bold text-red-600">{fmt(result.totalTax)}</span>
          </div>
          <div className="flex justify-between border-t border-gray-200 pt-2">
            <span className="text-gray-700 font-semibold">עלות כוללת (דירה + מס)</span>
            <span className="font-bold text-blue-700">{fmt(propertyValue + result.totalTax)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">שיעור אפקטיבי</span>
            <span className="font-medium">{formatPercent(result.effectiveRate / 100, 3)}</span>
          </div>
        </div>

        {/* הערות */}
        {result.notes.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
            <div className="flex items-center gap-2 mb-2">
              <Info className="w-4 h-4 text-blue-600 flex-shrink-0" />
              <h4 className="font-semibold text-blue-900 text-sm">שים לב</h4>
            </div>
            <ul className="text-xs text-blue-800 space-y-1">
              {result.notes.map((note, i) => (
                <li key={i}>• {note}</li>
              ))}
            </ul>
          </div>
        )}

        {/* פירוט מדרגות */}
        {result.breakdown.length > 0 && (
          <div className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden">
            <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
              <h4 className="font-semibold text-gray-900 text-sm">פירוט לפי מדרגות</h4>
            </div>
            <table className="w-full text-xs">
              <thead className="bg-gray-50 text-gray-700">
                <tr>
                  <th className="px-3 py-2 text-right">שיעור</th>
                  <th className="px-3 py-2 text-right">סכום במדרגה</th>
                  <th className="px-3 py-2 text-right">מס</th>
                </tr>
              </thead>
              <tbody>
                {result.breakdown.map((b, i) => (
                  <tr key={i} className="border-b border-gray-100">
                    <td className="px-3 py-2">
                      <div
                        className="font-bold"
                        style={{ color: BRACKET_COLORS[i % BRACKET_COLORS.length] }}
                      >
                        {b.bracket}
                      </div>
                      <div className="text-gray-400 text-[10px]">{b.range}</div>
                    </td>
                    <td className="px-3 py-2 text-gray-700">{fmt(b.amountInBracket)}</td>
                    <td className="px-3 py-2 font-semibold text-gray-900">
                      {fmt(b.taxInBracket)}
                    </td>
                  </tr>
                ))}
                <tr className="bg-blue-50 font-bold">
                  <td className="px-3 py-2 text-blue-900" colSpan={2}>
                    סה"כ מס רכישה
                  </td>
                  <td className="px-3 py-2 text-blue-700">{fmt(result.totalTax)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* גרף עוגה */}
        {result.totalTax > 0 && propertyValue > 0 && (
          <div className="bg-white border-2 border-gray-200 rounded-xl p-4">
            <h4 className="font-semibold text-gray-900 text-sm mb-3">מס כחלק מהעלות הכוללת</h4>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={75}
                  dataKey="value"
                  label={false}
                  labelLine={false}
                >
                  {pieData.map((_, index) => (
                    <Cell
                      key={index}
                      fill={index === 0 ? '#ef4444' : '#3b82f6'}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* גרף מדרגות */}
        {barData.length > 1 && (
          <div className="bg-white border-2 border-gray-200 rounded-xl p-4">
            <h4 className="font-semibold text-gray-900 text-sm mb-3">מס לפי מדרגות</h4>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={barData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tickFormatter={fmtShort} tick={{ fontSize: 10 }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="מס במדרגה" radius={[4, 4, 0, 0]}>
                  {barData.map((_, index) => (
                    <Cell
                      key={index}
                      fill={BRACKET_COLORS[index % BRACKET_COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================
// טאב 2: השוואת סוגי רוכשים
// ============================================================

function ComparisonTab({
  propertyValue,
  year,
}: {
  propertyValue: number;
  year: TaxYear;
}) {
  const comparisons = useMemo(
    () => compareAllBuyerTypes(propertyValue, year),
    [propertyValue, year],
  );

  const chartData = comparisons.map((c) => ({
    name: c.label,
    'מס רכישה': c.totalTax,
    type: c.buyerType,
  }));

  const maxTax = Math.max(...comparisons.map((c) => c.totalTax));

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">
        <strong>השוואה עבור נכס בשווי {fmt(propertyValue)}</strong> — רואים את הפרש המס בין
        סוגי הרוכשים השונים. שנת מדרגות: {year}.
      </div>

      {/* גרף */}
      <div className="bg-white border-2 border-gray-200 rounded-xl p-5">
        <h3 className="font-bold text-gray-900 mb-4">מס רכישה לפי סוג רוכש</h3>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 10, left: 10, bottom: 60 }}
            layout="vertical"
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" tickFormatter={fmtShort} tick={{ fontSize: 11 }} />
            <YAxis
              dataKey="name"
              type="category"
              width={160}
              tick={{ fontSize: 11, textAnchor: 'end' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="מס רכישה" radius={[0, 4, 4, 0]}>
              {chartData.map((entry, i) => (
                <Cell
                  key={i}
                  fill={BUYER_COLORS[entry.type] ?? '#6b7280'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* טבלה מפורטת */}
      <div className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden">
        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
          <h3 className="font-bold text-gray-900">טבלת השוואה</h3>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-right font-semibold text-gray-700">סוג רוכש</th>
              <th className="px-4 py-3 text-right font-semibold text-gray-700">מס רכישה</th>
              <th className="px-4 py-3 text-right font-semibold text-gray-700">שיעור אפקטיבי</th>
              <th className="px-4 py-3 text-right font-semibold text-gray-700">עלות כוללת</th>
            </tr>
          </thead>
          <tbody>
            {comparisons.map((c, i) => (
              <tr key={i} className={`border-b border-gray-100 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                <td className="px-4 py-3">
                  <div
                    className="font-semibold"
                    style={{ color: BUYER_COLORS[c.buyerType] ?? '#374151' }}
                  >
                    {c.label}
                  </div>
                </td>
                <td className="px-4 py-3 font-bold">
                  {c.totalTax === 0 ? (
                    <span className="text-green-600">פטור מלא</span>
                  ) : (
                    <span className={c.totalTax === maxTax ? 'text-red-600' : ''}>{fmt(c.totalTax)}</span>
                  )}
                </td>
                <td className="px-4 py-3 text-gray-600">
                  {formatPercent(c.effectiveRate / 100, 2)}
                </td>
                <td className="px-4 py-3 text-gray-700">
                  {fmt(propertyValue + c.totalTax)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* הדגשת הפרש */}
      {comparisons.length >= 2 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(() => {
            const firstHome = comparisons.find((c) => c.buyerType === 'first-home');
            const investor = comparisons.find((c) => c.buyerType === 'investor');
            const oleh = comparisons.find((c) => c.buyerType === 'oleh');
            return (
              <>
                {firstHome && investor && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                    <h4 className="font-bold text-red-800 mb-1 text-sm">
                      הפרש: דירה ראשונה vs. משקיע
                    </h4>
                    <p className="text-2xl font-bold text-red-700">
                      {fmt(investor.totalTax - firstHome.totalTax)}
                    </p>
                    <p className="text-xs text-red-600 mt-1">
                      כך יותר משלם משקיע על אותה הדירה
                    </p>
                  </div>
                )}
                {firstHome && oleh && firstHome.totalTax > oleh.totalTax && (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                    <h4 className="font-bold text-green-800 mb-1 text-sm">
                      חיסכון עולה חדש
                    </h4>
                    <p className="text-2xl font-bold text-green-700">
                      {fmt(firstHome.totalTax - oleh.totalTax)}
                    </p>
                    <p className="text-xs text-green-600 mt-1">
                      כך חוסך עולה חדש ביחס לדירה ראשונה רגילה
                    </p>
                  </div>
                )}
              </>
            );
          })()}
        </div>
      )}
    </div>
  );
}

// ============================================================
// טאב 3: השוואת שנים (2024/2025/2026)
// ============================================================

function YearsTab({
  propertyValue,
  buyerType,
}: {
  propertyValue: number;
  buyerType: BuyerType;
}) {
  const yearsData = useMemo(
    () => compareAcrossYears(propertyValue, buyerType),
    [propertyValue, buyerType],
  );

  const chartData = yearsData.map((y) => ({
    name: String(y.year),
    'מס רכישה': y.totalTax,
  }));

  return (
    <div className="space-y-6">
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
        <strong>השוואת שנים עבור {BUYER_TYPE_LABELS[buyerType]}</strong> — נכס בשווי{' '}
        {fmt(propertyValue)}. המדרגות מתעדכנות מדי שנה לפי המדד.
      </div>

      {/* גרף */}
      <div className="bg-white border-2 border-gray-200 rounded-xl p-5">
        <h3 className="font-bold text-gray-900 mb-4">מס רכישה לפי שנה</h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis tickFormatter={fmtShort} tick={{ fontSize: 11 }} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="מס רכישה" fill="#3b82f6" radius={[4, 4, 0, 0]}>
              {chartData.map((_, i) => (
                <Cell
                  key={i}
                  fill={i === chartData.length - 1 ? '#10b981' : '#3b82f6'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* טבלה */}
      <div className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden">
        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
          <h3 className="font-bold text-gray-900">השוואת מדרגות 2024 – 2026</h3>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-right font-semibold text-gray-700">שנה</th>
              <th className="px-4 py-3 text-right font-semibold text-gray-700">מס רכישה</th>
              <th className="px-4 py-3 text-right font-semibold text-gray-700">שיעור אפקטיבי</th>
              <th className="px-4 py-3 text-right font-semibold text-gray-700">שינוי מ-2024</th>
            </tr>
          </thead>
          <tbody>
            {yearsData.map((y, i) => (
              <tr key={i} className={`border-b border-gray-100 ${y.year === 2026 ? 'bg-green-50' : ''}`}>
                <td className="px-4 py-3 font-bold text-gray-900">
                  {y.year} {y.year === 2026 && <span className="text-xs text-green-600 font-normal">(נוכחי)</span>}
                </td>
                <td className="px-4 py-3 font-bold">{fmt(y.totalTax)}</td>
                <td className="px-4 py-3 text-gray-600">{formatPercent(y.effectiveRate / 100, 2)}</td>
                <td className="px-4 py-3">
                  {i === 0 ? (
                    <span className="text-gray-400">—</span>
                  ) : y.difference! > 0 ? (
                    <span className="text-green-600">+{fmt(y.difference!)}</span>
                  ) : y.difference! < 0 ? (
                    <span className="text-red-600">{fmt(y.difference!)}</span>
                  ) : (
                    <span className="text-gray-500">ללא שינוי</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* הסבר */}
      <div className="bg-white border-2 border-gray-200 rounded-xl p-5">
        <h4 className="font-bold text-gray-900 mb-3">מדרגות לפי שנה — {BUYER_TYPE_LABELS[buyerType]}</h4>
        <div className="grid md:grid-cols-3 gap-4 text-xs">
          {[2024, 2025, 2026].map((yr) => {
            const data: Record<number, { first: string[][]; investor: string[][] }> = {
              2024: {
                first: [
                  ['0 – 1,919,155', '0%'],
                  ['1,919,155 – 2,276,360', '3.5%'],
                  ['2,276,360 – 5,872,725', '5%'],
                  ['5,872,725 – 19,575,755', '8%'],
                  ['מעל 19,575,755', '10%'],
                ],
                investor: [
                  ['0 – 5,872,725', '8%'],
                  ['מעל 5,872,725', '10%'],
                ],
              },
              2025: {
                first: [
                  ['0 – 1,978,745', '0%'],
                  ['1,978,745 – 2,347,040', '3.5%'],
                  ['2,347,040 – 6,055,070', '5%'],
                  ['6,055,070 – 20,183,565', '8%'],
                  ['מעל 20,183,565', '10%'],
                ],
                investor: [
                  ['0 – 6,055,070', '8%'],
                  ['מעל 6,055,070', '10%'],
                ],
              },
              2026: {
                first: [
                  ['0 – 1,978,745', '0%'],
                  ['1,978,745 – 2,347,040', '3.5%'],
                  ['2,347,040 – 6,055,070', '5%'],
                  ['6,055,070 – 20,183,565', '8%'],
                  ['מעל 20,183,565', '10%'],
                ],
                investor: [
                  ['0 – 6,055,070', '8%'],
                  ['מעל 6,055,070', '10%'],
                ],
              },
            };
            const rows = buyerType === 'investor' || buyerType === 'foreign'
              ? data[yr].investor
              : data[yr].first;
            return (
              <div key={yr} className={`border rounded-lg p-3 ${yr === 2026 ? 'border-green-300 bg-green-50' : 'border-gray-200'}`}>
                <h5 className="font-bold text-gray-800 mb-2">{yr} {yr === 2026 && '(נוכחי)'}</h5>
                <table className="w-full">
                  <thead>
                    <tr className="text-gray-500">
                      <th className="text-right pb-1">טווח</th>
                      <th className="text-right pb-1">מס</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map(([range, rate], j) => (
                      <tr key={j} className="border-t border-gray-100">
                        <td className="py-0.5 text-gray-700">{range}</td>
                        <td className="py-0.5 font-semibold text-blue-700">{rate}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// טאב 4: רכישה משותפת
// ============================================================

function JointPurchaseTab({
  propertyValue,
  buyerType,
  year,
}: {
  propertyValue: number;
  buyerType: BuyerType;
  year: TaxYear;
}) {
  const [ownershipA, setOwnershipA] = useState(50);
  const [buyerTypeA, setBuyerTypeA] = useState<BuyerType>('first-home');
  const [buyerTypeB, setBuyerTypeB] = useState<BuyerType>('first-home');

  const ownershipB = 100 - ownershipA;

  const resultA = useMemo(
    () =>
      calculatePurchaseTaxByType({
        propertyValue,
        buyerType: buyerTypeA,
        year,
        ownershipPercent: ownershipA,
      }),
    [propertyValue, buyerTypeA, year, ownershipA],
  );

  const resultB = useMemo(
    () =>
      calculatePurchaseTaxByType({
        propertyValue,
        buyerType: buyerTypeB,
        year,
        ownershipPercent: ownershipB,
      }),
    [propertyValue, buyerTypeB, year, ownershipB],
  );

  const totalTax = resultA.totalTax + resultB.totalTax;
  const effectiveTotal = propertyValue > 0 ? (totalTax / propertyValue) * 100 : 0;

  return (
    <div className="space-y-6">
      <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 text-sm text-purple-800">
        ברכישה משותפת, כל שותף חייב במס לפי חלקו היחסי בנכס. אם שותף א' הוא
        &quot;דירה ראשונה&quot; ושותף ב' הוא &quot;משקיע&quot; — המס מחושב בנפרד לכל אחד.
      </div>

      {/* הגדרת שותפים */}
      <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
        <h3 className="font-bold text-gray-900 mb-4">הגדרת השותפים</h3>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            חלוקת בעלות — שותף א&apos;: {ownershipA}% | שותף ב&apos;: {ownershipB}%
          </label>
          <input
            type="range"
            min={1}
            max={99}
            value={ownershipA}
            onChange={(e) => setOwnershipA(Number(e.target.value))}
            className="w-full accent-blue-600"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>1%</span>
            <span>50%</span>
            <span>99%</span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {/* שותף א */}
          <div className="border-2 border-blue-200 rounded-xl p-4 bg-blue-50">
            <h4 className="font-semibold text-blue-900 mb-3">
              שותף א&apos; — {ownershipA}% ({fmt(propertyValue * ownershipA / 100)})
            </h4>
            <select
              value={buyerTypeA}
              onChange={(e) => setBuyerTypeA(e.target.value as BuyerType)}
              className="w-full px-3 py-2 border border-blue-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500"
            >
              {(Object.keys(BUYER_TYPE_LABELS) as BuyerType[]).map((t) => (
                <option key={t} value={t}>{BUYER_TYPE_LABELS[t]}</option>
              ))}
            </select>
            <div className="mt-3 space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">שווי חלק</span>
                <span className="font-medium">{fmt(propertyValue * ownershipA / 100)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">מס רכישה</span>
                <span className="font-bold text-red-600">{fmt(resultA.totalTax)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">שיעור אפקטיבי</span>
                <span>{formatPercent(resultA.effectiveRate / 100, 2)}</span>
              </div>
            </div>
          </div>

          {/* שותף ב */}
          <div className="border-2 border-green-200 rounded-xl p-4 bg-green-50">
            <h4 className="font-semibold text-green-900 mb-3">
              שותף ב&apos; — {ownershipB}% ({fmt(propertyValue * ownershipB / 100)})
            </h4>
            <select
              value={buyerTypeB}
              onChange={(e) => setBuyerTypeB(e.target.value as BuyerType)}
              className="w-full px-3 py-2 border border-green-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-green-500"
            >
              {(Object.keys(BUYER_TYPE_LABELS) as BuyerType[]).map((t) => (
                <option key={t} value={t}>{BUYER_TYPE_LABELS[t]}</option>
              ))}
            </select>
            <div className="mt-3 space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">שווי חלק</span>
                <span className="font-medium">{fmt(propertyValue * ownershipB / 100)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">מס רכישה</span>
                <span className="font-bold text-red-600">{fmt(resultB.totalTax)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">שיעור אפקטיבי</span>
                <span>{formatPercent(resultB.effectiveRate / 100, 2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* סיכום */}
      <div className="grid grid-cols-3 gap-4">
        <ResultCard
          title={`מס שותף א' (${ownershipA}%)`}
          value={fmt(resultA.totalTax)}
          variant={resultA.fullExemption ? 'success' : 'primary'}
        />
        <ResultCard
          title={`מס שותף ב' (${ownershipB}%)`}
          value={fmt(resultB.totalTax)}
          variant={resultB.fullExemption ? 'success' : 'primary'}
        />
        <ResultCard
          title="סה&quot;כ מס רכישה"
          value={fmt(totalTax)}
          subtitle={`${formatPercent(effectiveTotal / 100, 2)} מהשווי`}
          variant={totalTax > 200_000 ? 'warning' : 'primary'}
        />
      </div>
    </div>
  );
}

// ============================================================
// טאב 5: המלצות חכמות
// ============================================================

function RecommendationsTab({
  propertyValue,
  buyerType,
  year,
}: {
  propertyValue: number;
  buyerType: BuyerType;
  year: TaxYear;
}) {
  const recommendations = useMemo(
    () => getSmartRecommendations(propertyValue, buyerType, year),
    [propertyValue, buyerType, year],
  );

  const olehDiscount = useMemo(
    () => calculateImmigrantDiscount(propertyValue, year),
    [propertyValue, year],
  );

  const current = useMemo(
    () => calculatePurchaseTaxByType({ propertyValue, buyerType, year }),
    [propertyValue, buyerType, year],
  );

  return (
    <div className="space-y-6">
      {/* המלצות */}
      {recommendations.length > 0 ? (
        <div className="space-y-4">
          <h3 className="font-bold text-gray-900 text-lg">המלצות לחיסכון במס רכישה</h3>
          {recommendations.map((rec, i) => (
            <div key={i} className="bg-green-50 border border-green-200 rounded-xl p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h4 className="font-bold text-green-900 mb-1">{rec.scenario}</h4>
                  <p className="text-sm text-green-800">{rec.action}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-xs text-green-600 mb-1">חיסכון פוטנציאלי</div>
                  <div className="text-2xl font-bold text-green-700">{fmt(rec.savings)}</div>
                </div>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                <div className="bg-white rounded-lg p-3 border border-green-200">
                  <div className="text-gray-500 text-xs mb-1">מס נוכחי ({BUYER_TYPE_LABELS[buyerType]})</div>
                  <div className="font-bold text-red-600">{fmt(rec.currentTax)}</div>
                </div>
                <div className="bg-white rounded-lg p-3 border border-green-200">
                  <div className="text-gray-500 text-xs mb-1">מס אלטרנטיבי</div>
                  <div className="font-bold text-green-700">{fmt(rec.alternativeTax)}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 text-blue-800 text-sm">
          <strong>אין המלצות חיסכון ספציפיות</strong> לסוג רוכש זה עבור שווי זה.
          בדוק את טאב &quot;השוואת רוכשים&quot; לתמונה המלאה.
        </div>
      )}

      {/* הנחת עולה חדש */}
      <div className="bg-white border-2 border-gray-200 rounded-xl p-5">
        <h3 className="font-bold text-gray-900 mb-4">מה אם אני עולה חדש?</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-gray-50 rounded-xl p-4 text-center">
            <div className="text-xs text-gray-500 mb-2">מס דירה ראשונה</div>
            <div className="text-2xl font-bold text-gray-800">{fmt(olehDiscount.baseTax)}</div>
          </div>
          <div className="bg-purple-50 rounded-xl p-4 text-center border border-purple-200">
            <div className="text-xs text-purple-600 mb-2">מס עולה חדש (0.5%/5%)</div>
            <div className="text-2xl font-bold text-purple-700">{fmt(olehDiscount.olehTax)}</div>
          </div>
          <div className="bg-green-50 rounded-xl p-4 text-center border border-green-200">
            <div className="text-xs text-green-600 mb-2">חיסכון לעולה חדש</div>
            <div className="text-2xl font-bold text-green-700">{fmt(olehDiscount.savings)}</div>
            <div className="text-xs text-green-600 mt-1">
              ({formatNumber(olehDiscount.savingsPercent, 1)}% פחות)
            </div>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-3">
          * הזכאות בתוקף ל-7 שנים ממועד העלייה. עולה חדש = מי שקיבל תעודת עולה ולא היה
          תושב ישראל 10 שנים לפני עלייתו. תושב חוזר ותיק — הטבות שונות.
        </p>
      </div>

      {/* עצות */}
      <div className="bg-white border-2 border-gray-200 rounded-xl p-5">
        <h3 className="font-bold text-gray-900 mb-4">טיפים למזעור מס רכישה</h3>
        <ul className="space-y-3 text-sm text-gray-700">
          <li className="flex gap-3">
            <span className="text-blue-600 font-bold mt-0.5">1.</span>
            <span>
              <strong>מחליף דירה?</strong> ודא שמכרת את הדירה הישנה לפני/תוך 18 חודש מהרכישה
              החדשה. אחרת תחויב כמשקיע.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="text-blue-600 font-bold mt-0.5">2.</span>
            <span>
              <strong>בני זוג?</strong> שניהם צריכים לעמוד בקריטריון דירה ראשונה. אם לאחד יש
              דירה, זה עלול להשפיע על המדרגות.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="text-blue-600 font-bold mt-0.5">3.</span>
            <span>
              <strong>עולה חדש</strong> — השיעור המופחת (0.5%) תקף ל-7 שנים. אל תפספס!
            </span>
          </li>
          <li className="flex gap-3">
            <span className="text-blue-600 font-bold mt-0.5">4.</span>
            <span>
              <strong>נכה 50%+?</strong> פטור עד 2.5M ₪. בקש אישור מהמוסד לביטוח לאומי לפני
              העסקה.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="text-blue-600 font-bold mt-0.5">5.</span>
            <span>
              <strong>מתנה לילד?</strong> מס רכישה של מתנה הוא ⅓ מהמס הרגיל — חיסכון משמעותי.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="text-blue-600 font-bold mt-0.5">6.</span>
            <span>
              <strong>תשלום בזמן!</strong> יש לשלם מס רכישה תוך 50 ימים מחתימת החוזה.
              איחור גורר קנסות וריבית.
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}

// ============================================================
// הרכיב הראשי
// ============================================================

export function PurchaseTaxCalculator() {
  const [activeTab, setActiveTab] = useState<TabMode>('calculator');
  const [propertyValue, setPropertyValue] = useState(2_500_000);
  const [buyerType, setBuyerType] = useState<BuyerType>('first-home');
  const [year, setYear] = useState<TaxYear>(2026);

  return (
    <div dir="rtl" className="space-y-2">
      <TabBar tabs={TABS} active={activeTab} onChange={setActiveTab} />

      {activeTab === 'calculator' && (
        <CalculatorTab
          propertyValue={propertyValue}
          setPropertyValue={setPropertyValue}
          buyerType={buyerType}
          setBuyerType={setBuyerType}
          year={year}
          setYear={setYear}
        />
      )}

      {activeTab === 'comparison' && (
        <ComparisonTab propertyValue={propertyValue} year={year} />
      )}

      {activeTab === 'years' && (
        <YearsTab propertyValue={propertyValue} buyerType={buyerType} />
      )}

      {activeTab === 'joint' && (
        <JointPurchaseTab
          propertyValue={propertyValue}
          buyerType={buyerType}
          year={year}
        />
      )}

      {activeTab === 'recommendations' && (
        <RecommendationsTab
          propertyValue={propertyValue}
          buyerType={buyerType}
          year={year}
        />
      )}
    </div>
  );
}
