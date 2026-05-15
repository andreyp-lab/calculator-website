'use client';

import { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
} from 'recharts';
import {
  calculateFireResult,
  FIRE_CONSTANTS_2026,
  type FireInput,
  type FireType,
  type SWRType,
} from '@/lib/calculators/fire';
import { formatCurrency, formatNumber } from '@/lib/utils/formatters';

// ============================================================
// ערכי ברירת מחדל
// ============================================================
const defaultInput: FireInput = {
  currentAge: 32,
  currentSavings: 200_000,
  monthlyContribution: 5_000,
  monthlyGrossIncome: 20_000,
  monthlyExpensesRetirement: 15_000,
  expectedNominalReturn: 8,
  inflationRate: 3,
  swrType: 'four_pct',
  targetRetirementAge: 55,
  includeBituachLeumi: true,
  realEstateIncome: 0,
  baristaWorkIncome: 0,
  retirementDurationYears: 40,
};

type TabType = 'calculator' | 'types' | 'swr' | 'withdrawal' | 'sensitivity';

const SWR_LABELS: Record<SWRType, string> = {
  four_pct: 'כלל 4% (Trinity)',
  three_pct: 'שמרן 3%',
  three_five_pct: '3.5% - ישראל',
  dynamic: 'דינמי 3-5%',
};

const FIRE_TYPE_COLORS: Record<FireType, string> = {
  lean: '#10b981',
  regular: '#3b82f6',
  fat: '#8b5cf6',
  coast: '#f59e0b',
  barista: '#ec4899',
};

// ============================================================
// Tooltip מותאם
// ============================================================
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
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 text-sm">
      <p className="font-semibold text-gray-800 mb-2">{label}</p>
      {payload.map((entry, i) => (
        <div key={i} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
          <span className="text-gray-600">{entry.name}:</span>
          <span className="font-medium">{formatCurrency(entry.value)}</span>
        </div>
      ))}
    </div>
  );
}

// ============================================================
// קומפוננטה ראשית
// ============================================================
export function FireCalculator() {
  const [input, setInput] = useState<FireInput>(defaultInput);
  const [activeTab, setActiveTab] = useState<TabType>('calculator');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const result = useMemo(() => calculateFireResult(input), [input]);

  function update<K extends keyof FireInput>(key: K, value: FireInput[K]) {
    setInput((prev) => ({ ...prev, [key]: value }));
  }

  // נתוני גרף - נתיב ל-FIRE
  const pathChartData = useMemo(() => {
    const rows = result.yearlyPath.slice(0, Math.min(result.yearsToFire + 10, 50));
    return rows.map((row) => ({
      name: `גיל ${row.age}`,
      'שווי תיק': Math.round(row.portfolioValue),
      'יעד FIRE': Math.round(result.fireNumber),
      progress: row.progressPct,
    }));
  }, [result.yearlyPath, result.fireNumber, result.yearsToFire]);

  // נתוני גרף - שלב המשיכה
  const withdrawalChartData = useMemo(() => {
    return result.withdrawalPhase.slice(0, 40).map((row) => ({
      name: `גיל ${row.age}`,
      'שווי תיק': Math.round(row.portfolioValue),
      'משיכה שנתית': Math.round(row.withdrawal),
    }));
  }, [result.withdrawalPhase]);

  // נתוני גרף - השוואת סוגי FIRE
  const fireTypesChartData = useMemo(() => {
    return result.fireTypeBreakdown.map((ft) => ({
      name: ft.label.split(' - ')[0],
      'FIRE Number': Math.round(ft.fireNumber),
      'שנים ל-FIRE': ft.yearsToFire,
      'גיל פרישה': ft.retirementAge,
    }));
  }, [result.fireTypeBreakdown]);

  // סרגל קידמה
  const progressPct = Math.min(100, result.fireProgress);

  const tabs: Array<{ id: TabType; label: string }> = [
    { id: 'calculator', label: 'מחשבון' },
    { id: 'types', label: '5 סוגי FIRE' },
    { id: 'swr', label: 'SWR & אסטרטגיה' },
    { id: 'withdrawal', label: 'שלב המשיכה' },
    { id: 'sensitivity', label: 'ניתוח רגישות' },
  ];

  return (
    <div className="space-y-6" dir="rtl">
      {/* טאבים */}
      <div className="flex flex-wrap gap-1 border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* טאב: מחשבון ראשי */}
      {activeTab === 'calculator' && (
        <div className="grid lg:grid-cols-5 gap-6">
          {/* קלט */}
          <div className="lg:col-span-3 space-y-5">
            <div className="bg-white border-2 border-gray-200 rounded-xl p-6 space-y-5">
              <h2 className="text-xl font-bold text-gray-900">מחשבון FIRE - פרישה מוקדמת</h2>

              {/* שורה 1 */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">גיל נוכחי</label>
                  <input
                    type="number"
                    min={18}
                    max={70}
                    value={input.currentAge}
                    onChange={(e) => update('currentAge', Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    גיל פרישה יעד
                  </label>
                  <input
                    type="number"
                    min={30}
                    max={80}
                    value={input.targetRetirementAge ?? 55}
                    onChange={(e) => update('targetRetirementAge', Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* חיסכון והפקדה */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    חיסכון / תיק נוכחי (₪)
                  </label>
                  <input
                    type="number"
                    min={0}
                    step={10_000}
                    value={input.currentSavings}
                    onChange={(e) => update('currentSavings', Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">כולל פנסיה, קרנות, כסף חופשי</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    הפקדה חודשית (₪)
                  </label>
                  <input
                    type="number"
                    min={0}
                    step={500}
                    value={input.monthlyContribution}
                    onChange={(e) => update('monthlyContribution', Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">נטו לאחר מחיה (חיסכון + השקעה)</p>
                </div>
              </div>

              {/* הכנסה והוצאות */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    הכנסה חודשית ברוטו (₪)
                  </label>
                  <input
                    type="number"
                    min={0}
                    step={1_000}
                    value={input.monthlyGrossIncome}
                    onChange={(e) => update('monthlyGrossIncome', Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">לחישוב שיעור חיסכון</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    הוצאות בפרישה (₪/חודש)
                  </label>
                  <input
                    type="number"
                    min={0}
                    step={1_000}
                    value={input.monthlyExpensesRetirement}
                    onChange={(e) => update('monthlyExpensesRetirement', Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Lean: 10K | Regular: 20K | Fat: 40K+
                  </p>
                </div>
              </div>

              {/* תשואה ואינפלציה */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    תשואה נומינלית שנתית (%)
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={20}
                    step={0.5}
                    value={input.expectedNominalReturn}
                    onChange={(e) => update('expectedNominalReturn', Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    S&P 500: 10% | תיק מגוון: 7-8%
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    אינפלציה שנתית (%)
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={10}
                    step={0.5}
                    value={input.inflationRate}
                    onChange={(e) => update('inflationRate', Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">ישראל ממוצע: 3%</p>
                </div>
              </div>

              {/* SWR */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  שיעור משיכה בטוח (SWR)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(Object.entries(SWR_LABELS) as Array<[SWRType, string]>).map(
                    ([key, label]) => (
                      <button
                        key={key}
                        onClick={() => update('swrType', key)}
                        className={`px-3 py-2 rounded-lg text-sm border-2 transition-colors text-right ${
                          input.swrType === key
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
                        }`}
                      >
                        {label}
                      </button>
                    ),
                  )}
                </div>
              </div>

              {/* הגדרות מתקדמות */}
              <div>
                <button
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
                >
                  {showAdvanced ? '▲' : '▼'} הגדרות מתקדמות - הקשר ישראלי
                </button>

                {showAdvanced && (
                  <div className="mt-4 space-y-4 bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <h3 className="text-sm font-bold text-blue-900">הקשר ישראלי</h3>

                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id="bituachLeumi"
                        checked={input.includeBituachLeumi}
                        onChange={(e) => update('includeBituachLeumi', e.target.checked)}
                        className="w-4 h-4"
                      />
                      <label htmlFor="bituachLeumi" className="text-sm text-gray-700">
                        כלול קצבת ביטוח לאומי (
                        {formatCurrency(FIRE_CONSTANTS_2026.BITUACH_LEUMI_BASIC_MONTHLY)}/חודש מגיל
                        67)
                      </label>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          הכנסה מנדל"ן (₪/חודש)
                        </label>
                        <input
                          type="number"
                          min={0}
                          step={500}
                          value={input.realEstateIncome}
                          onChange={(e) => update('realEstateIncome', Number(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          שכ&quot;ד נטו מנכס השקעה (מפחית FIRE Number)
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Barista: עבודה חלקית (₪/חודש)
                        </label>
                        <input
                          type="number"
                          min={0}
                          step={500}
                          value={input.baristaWorkIncome}
                          onChange={(e) => update('baristaWorkIncome', Number(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          עבודה חלקית / קונסולטינג בפרישה
                        </p>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        שנות פרישה מתוכננות
                      </label>
                      <input
                        type="number"
                        min={10}
                        max={60}
                        value={input.retirementDurationYears}
                        onChange={(e) => update('retirementDurationYears', Number(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        כמה שנים התיק צריך להחזיק (10 + תוחלת חיים)
                      </p>
                    </div>

                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-900 space-y-1">
                      <p className="font-bold">ביטוח לאומי בפרישה מוקדמת:</p>
                      <p>
                        • יש לשלם מינימום 16 שנות דמי ב.ל. לקבלת קצבה מלאה בגיל 67
                      </p>
                      <p>• שילום עצמאי: כ-560 ₪/חודש (מינימום - לשמור על זכויות)</p>
                      <p>• קופת חולים: ₪200-400/חודש נוספים לאחר עזיבת העבודה</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* תוצאות */}
          <div className="lg:col-span-2 space-y-4">
            {/* פרוגרס בר */}
            <div className="bg-white border-2 border-gray-200 rounded-xl p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">התקדמות ל-FIRE</span>
                <span className="text-sm font-bold text-blue-600">
                  {formatNumber(progressPct, 1)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>{formatCurrency(input.currentSavings)}</span>
                <span>יעד: {formatCurrency(result.fireNumber)}</span>
              </div>
            </div>

            {/* FIRE Number */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 rounded-xl p-5">
              <p className="text-sm font-medium text-gray-700 mb-1">סכום ה-FIRE שלך</p>
              <p className="text-3xl font-bold text-green-700 mb-1">
                {formatCurrency(result.fireNumber)}
              </p>
              <p className="text-xs text-gray-600">
                SWR {result.swr}% | הוצאות:{' '}
                {formatCurrency(input.monthlyExpensesRetirement)}/חודש
              </p>
            </div>

            {/* שנים ל-FIRE */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 rounded-xl p-5">
              <p className="text-sm font-medium text-gray-700 mb-1">שנים עד פרישה</p>
              <p className="text-3xl font-bold text-blue-700 mb-1">
                {result.willReachFire ? `${result.yearsToFire} שנים` : 'לא מגיע'}
              </p>
              <p className="text-xs text-gray-600">
                גיל פרישה: {result.fireAge} | שיעור חיסכון:{' '}
                {formatNumber(result.currentSavingsRate, 1)}%
              </p>
            </div>

            {/* כרטיסי נוספים */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-2 text-sm">
              <p className="font-semibold text-gray-800 mb-2">פירוט הכנסות בפרישה</p>
              <div className="flex justify-between">
                <span className="text-gray-600">מתיק ההשקעות:</span>
                <span className="font-medium">
                  {formatCurrency(result.passiveIncomeBreakdown.portfolio)}/חודש
                </span>
              </div>
              {result.passiveIncomeBreakdown.realEstate > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">מנדל&quot;ן:</span>
                  <span className="font-medium">
                    {formatCurrency(result.passiveIncomeBreakdown.realEstate)}/חודש
                  </span>
                </div>
              )}
              {result.passiveIncomeBreakdown.bituachLeumi > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">ביטוח לאומי (מגיל 67):</span>
                  <span className="font-medium">
                    {formatCurrency(result.passiveIncomeBreakdown.bituachLeumi)}/חודש
                  </span>
                </div>
              )}
              <div className="flex justify-between border-t border-gray-200 pt-2">
                <span className="font-semibold text-gray-800">סה&quot;כ הכנסה פסיבית:</span>
                <span className="font-bold text-green-700">
                  {formatCurrency(result.totalMonthlyPassiveIncome)}/חודש
                </span>
              </div>
            </div>

            {/* Coast FIRE */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm">
              <p className="font-semibold text-amber-900 mb-1">Coast FIRE</p>
              <p className="text-amber-800 text-xs mb-2">
                אם תגיע לסכום זה - אפשר להפסיק להפקיד ולתת לזמן לעשות את העבודה
              </p>
              <div className="flex justify-between">
                <span className="text-gray-600">Coast Number:</span>
                <span className="font-bold text-amber-700">
                  {formatCurrency(result.coastFire.coastNumber)}
                </span>
              </div>
              {result.coastFire.hasReachedCoast ? (
                <p className="text-green-700 font-semibold mt-1">הגעת ל-Coast FIRE!</p>
              ) : (
                <div className="flex justify-between mt-1">
                  <span className="text-gray-600">חסר:</span>
                  <span className="font-medium text-amber-700">
                    {formatCurrency(result.coastFire.coastShortfall)}
                  </span>
                </div>
              )}
            </div>

            {/* שיעור חיסכון נדרש */}
            {result.requiredSavingsRate !== null && (
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-sm">
                <p className="font-semibold text-purple-900 mb-1">
                  שיעור חיסכון נדרש לפרישה בגיל {input.targetRetirementAge}
                </p>
                <p className="text-2xl font-bold text-purple-700">
                  {formatNumber(result.requiredSavingsRate, 1)}%
                </p>
                <p className="text-xs text-gray-600">
                  = {formatCurrency((result.requiredSavingsRate / 100) * input.monthlyGrossIncome)}/חודש מההכנסה
                </p>
              </div>
            )}

            {/* אזהרה אם לא מגיע */}
            {!result.willReachFire && (
              <div className="bg-red-50 border border-red-300 rounded-lg p-3 text-xs text-red-900">
                <p className="font-bold mb-1">לא מגיע ל-FIRE בהגדרות הנוכחיות</p>
                <p>
                  הגדל הפקדה חודשית ב-{formatCurrency(result.monthlyShortfall)} כדי להגיע ב-30 שנה
                </p>
              </div>
            )}
          </div>

          {/* גרף נתיב ל-FIRE */}
          <div className="lg:col-span-5 bg-white border border-gray-200 rounded-xl p-5">
            <h3 className="text-base font-semibold text-gray-900 mb-4">נתיב ל-FIRE - שווי תיק לאורך השנים</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={pathChartData} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                <defs>
                  <linearGradient id="portfolioGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={4} />
                <YAxis tickFormatter={(v) => `${(v / 1_000_000).toFixed(1)}M`} tick={{ fontSize: 11 }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="שווי תיק"
                  stroke="#3b82f6"
                  fill="url(#portfolioGrad)"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="יעד FIRE"
                  stroke="#10b981"
                  strokeWidth={2}
                  strokeDasharray="6 3"
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* טאב: 5 סוגי FIRE */}
      {activeTab === 'types' && (
        <div className="space-y-6">
          <div className="grid md:grid-cols-1 gap-4">
            {result.fireTypeBreakdown.map((ft) => (
              <div
                key={ft.type}
                className="bg-white border-2 rounded-xl p-5"
                style={{ borderColor: FIRE_TYPE_COLORS[ft.type] + '60' }}
              >
                <div className="flex items-start justify-between flex-wrap gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: FIRE_TYPE_COLORS[ft.type] }}
                      />
                      <h3 className="text-base font-bold text-gray-900">{ft.label}</h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      {ft.type === 'lean' && 'מינימום הוצאות, פריפריה או חיים פשוטים - ₪8K-12K/חודש לזוג'}
                      {ft.type === 'regular' && 'רמת חיים נורמלית במרכז, משכנתא שולמה - ₪15K-25K/חודש לזוג'}
                      {ft.type === 'fat' && 'אורח חיים גבוה, נסיעות, פינוקים - ₪35K-50K+/חודש לזוג'}
                      {ft.type === 'coast' && 'הפסק להפקיד ותן לתיק לצמוח - מחייב גיל פרישה גבוה יותר'}
                      {ft.type === 'barista' && 'עבודה חלקית/קונסולטינג + תיק קטן יותר - פחות לחץ לחיסכון'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">FIRE Number</p>
                    <p className="text-xl font-bold" style={{ color: FIRE_TYPE_COLORS[ft.type] }}>
                      {formatCurrency(ft.fireNumber)}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm border-t border-gray-100 pt-3 mt-2">
                  <div>
                    <p className="text-xs text-gray-500">הוצאות/חודש</p>
                    <p className="font-semibold">{formatCurrency(ft.monthlyExpenses)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">שנים ל-FIRE</p>
                    <p className="font-semibold">
                      {ft.yearsToFire < 100 ? `${ft.yearsToFire} שנים` : 'לא מגיע'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">גיל פרישה</p>
                    <p className="font-semibold">{ft.yearsToFire < 100 ? ft.retirementAge : '-'}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* גרף השוואת FIRE Numbers */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h3 className="text-base font-semibold text-gray-900 mb-4">
              השוואת FIRE Number לפי סוג
            </h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={fireTypesChartData} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tickFormatter={(v) => `${(v / 1_000_000).toFixed(1)}M`} tick={{ fontSize: 11 }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="FIRE Number" fill="#3b82f6" radius={[4, 4, 0, 0]}>
                  {fireTypesChartData.map((_, index) => {
                    const colors = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ec4899'];
                    return <rect key={index} fill={colors[index % colors.length]} />;
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* הסברים */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
            <h3 className="text-base font-bold text-blue-900 mb-3">
              Barista FIRE - הגישה הגמישה
            </h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-900">
              <div>
                <p className="font-semibold mb-1">מה זה?</p>
                <p>
                  Barista FIRE = עבודה חלקית (20-30 שעות שבועיות) תוך הסתמכות על תיק קטן יותר.
                  השם מגיע מ-Starbucks שהציעה ביטוח בריאות לעובדים חלקיים.
                </p>
              </div>
              <div>
                <p className="font-semibold mb-1">Barista FIRE Number שלך</p>
                <p className="text-xl font-bold text-blue-700 mb-1">
                  {formatCurrency(result.baristaFireNumber)}
                </p>
                <p className="text-xs">
                  בהנחת עבודה חלקית:{' '}
                  {formatCurrency(input.baristaWorkIncome)}/חודש
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* טאב: SWR & אסטרטגיה */}
      {activeTab === 'swr' && (
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            {result.swrScenarios.map((scenario) => (
              <div
                key={scenario.type}
                className={`bg-white border-2 rounded-xl p-5 transition-colors ${
                  input.swrType === scenario.type
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300'
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-sm font-bold text-gray-900">{scenario.label}</h3>
                  <span className="text-lg font-bold text-blue-600">{scenario.rate}%</span>
                </div>
                <p className="text-2xl font-bold text-gray-900 mb-1">
                  {formatCurrency(scenario.fireNumber)}
                </p>
                <p className="text-xs text-gray-500 mb-3">
                  מכפיל: {scenario.multiplier.toFixed(1)}× הוצאות שנתיות
                </p>
                <div className="text-xs text-blue-800 bg-blue-50 rounded p-2">
                  {scenario.successRate}
                </div>
              </div>
            ))}
          </div>

          {/* הסבר Trinity Study */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
            <h3 className="text-base font-bold text-gray-900">מחקר Trinity - הבסיס של כלל ה-4%</h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700">
              <div className="space-y-2">
                <p className="font-semibold">מה המחקר מצא?</p>
                <p>
                  ניתוח של 30 שנות נתוני שוק (1926-1995) הראה שמשיכה של 4% מהתיק בשנה הראשונה
                  ותיאום לאינפלציה בשנים הבאות - שרדה 96% מהמקרים ל-30 שנה.
                </p>
                <p className="text-xs text-gray-500">
                  מניות 75% + אג&quot;ח 25% | Cooley, Hubbard, Walz 1998
                </p>
              </div>
              <div className="space-y-2">
                <p className="font-semibold">הסיכוי הגדול: Sequence of Returns Risk</p>
                <p>
                  הסיכון הכי גדול ב-FIRE הוא ירידות גדולות בתחילת הפרישה. ירידה של 40% בשנה
                  הראשונה + משיכות = נזק בלתי הפיך לתיק. לכן:
                </p>
                <ul className="text-xs space-y-1 text-gray-600">
                  <li>• שמור 2 שנות הוצאות במזומן / אג&quot;ח</li>
                  <li>• הקטן משיכות בשנות ירידה</li>
                  <li>• שקול Bond Tent בתחילת פרישה</li>
                </ul>
              </div>
            </div>
          </div>

          {/* הקשר ישראלי */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 space-y-4">
            <h3 className="text-base font-bold text-amber-900">4% Rule בהקשר ישראלי</h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold mt-0.5">⚠</span>
                  <div>
                    <p className="font-semibold text-amber-900">מס רווחי הון 25%</p>
                    <p className="text-gray-700">
                      בישראל, כל משיכה מתיק חופשי חייבת 25% מס על הרווח. לכן יש לחשב את המשיכה
                      בגרוס ולא בנטו.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-600 font-bold mt-0.5">✓</span>
                  <div>
                    <p className="font-semibold text-amber-900">פנסיה - לא חייבת מס עד תקרה</p>
                    <p className="text-gray-700">
                      קצבה מהפנסיה עד ~8,700 ₪/חודש פטורה ממס (2026). כדאי לבנות FIRE משני
                      מקורות.
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold mt-0.5">ℹ</span>
                  <div>
                    <p className="font-semibold text-amber-900">ביטוח לאומי מגיל 67</p>
                    <p className="text-gray-700">
                      קצבת זקנה בסיסית: ~1,754 ₪/חודש. יש לשלם דמי ב.ל. מינימום גם בפרישה מוקדמת
                      (כ-560 ₪/חודש) כדי לשמור על הזכות.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-purple-600 font-bold mt-0.5">⊕</span>
                  <div>
                    <p className="font-semibold text-amber-900">קרן השתלמות - הטבת מס</p>
                    <p className="text-gray-700">
                      משיכה מקרן השתלמות לאחר 6 שנים - פטורה ממס! חלק מ-FIRE ישראלי חייב להכלול
                      ניצול מקסימלי של כלי זה.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* טאב: שלב המשיכה */}
      {activeTab === 'withdrawal' && (
        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h3 className="text-base font-semibold text-gray-900 mb-1">
              שלב המשיכה - שווי תיק לאורך הפרישה
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              החל מגיל {result.fireAge} | {input.retirementDurationYears} שנות פרישה | SWR{' '}
              {result.swr}%
            </p>
            <ResponsiveContainer width="100%" height={320}>
              <AreaChart
                data={withdrawalChartData}
                margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
              >
                <defs>
                  <linearGradient id="withdrawalGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={4} />
                <YAxis tickFormatter={(v) => `${(v / 1_000_000).toFixed(1)}M`} tick={{ fontSize: 11 }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="שווי תיק"
                  stroke="#8b5cf6"
                  fill="url(#withdrawalGrad)"
                  strokeWidth={2}
                />
                <Bar dataKey="משיכה שנתית" fill="#f59e0b" opacity={0.7} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* האם התיק שורד? */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h3 className="text-sm font-bold text-gray-900 mb-3">האם התיק שורד?</h3>
            <div className="space-y-1">
              {result.withdrawalPhase
                .filter((_, i) => i % 5 === 0 || !result.withdrawalPhase[i]?.isPortfolioAlive)
                .slice(0, 12)
                .map((row) => (
                  <div
                    key={row.year}
                    className={`flex justify-between items-center px-3 py-2 rounded text-sm ${
                      row.isPortfolioAlive ? 'bg-green-50' : 'bg-red-50'
                    }`}
                  >
                    <span className="text-gray-700">
                      שנה {row.year} (גיל {row.age})
                    </span>
                    <span className={row.isPortfolioAlive ? 'text-green-700' : 'text-red-700'}>
                      {row.isPortfolioAlive ? formatCurrency(row.portfolioValue) : 'התיק אזל'}
                    </span>
                  </div>
                ))}
            </div>
          </div>

          {/* טיפים */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 text-sm text-blue-900 space-y-2">
            <p className="font-bold">אסטרטגיות להאריך את חיי התיק:</p>
            <ul className="space-y-1">
              <li>• <strong>Bucket Strategy:</strong> 1-3 שנות מחיה במזומן, 4-10 שנות באג&quot;ח, שאר במניות</li>
              <li>• <strong>Guardrails Method:</strong> הגדל/הקטן משיכה לפי ביצועי השוק (±20%)</li>
              <li>• <strong>Floor & Upside:</strong> כסה הוצאות קבועות מפנסיה/ב.ל., שאר משוק</li>
              <li>• <strong>Part-time Work:</strong> אפילו 5K ₪/חודש מעבודה חלקית מאריך תיק בשנים רבות</li>
            </ul>
          </div>
        </div>
      )}

      {/* טאב: ניתוח רגישות */}
      {activeTab === 'sensitivity' && (
        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h3 className="text-base font-semibold text-gray-900 mb-4">
              ניתוח רגישות - מה משפיע הכי הרבה?
            </h3>
            <div className="space-y-4">
              {[
                {
                  label: 'מצב נוכחי',
                  years: result.yearsToFire,
                  age: result.fireAge,
                  color: 'bg-blue-100 border-blue-300',
                  badge: 'bg-blue-600',
                },
                {
                  label: 'הגדל חיסכון +10%',
                  years: result.sensitivityPlusSavings,
                  age: Math.round(input.currentAge + result.sensitivityPlusSavings),
                  color: 'bg-green-50 border-green-300',
                  badge: 'bg-green-600',
                  diff: result.yearsToFire - result.sensitivityPlusSavings,
                },
                {
                  label: 'תשואה +1% לשנה',
                  years: result.sensitivityPlusReturn,
                  age: Math.round(input.currentAge + result.sensitivityPlusReturn),
                  color: 'bg-purple-50 border-purple-300',
                  badge: 'bg-purple-600',
                  diff: result.yearsToFire - result.sensitivityPlusReturn,
                },
                {
                  label: 'הוצאות -10% בפרישה',
                  years: result.sensitivityLowerExpenses,
                  age: Math.round(input.currentAge + result.sensitivityLowerExpenses),
                  color: 'bg-amber-50 border-amber-300',
                  badge: 'bg-amber-600',
                  diff: result.yearsToFire - result.sensitivityLowerExpenses,
                },
              ].map((row) => (
                <div
                  key={row.label}
                  className={`flex items-center justify-between rounded-lg border p-4 ${row.color}`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-2 h-10 rounded-full ${row.badge}`} />
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{row.label}</p>
                      <p className="text-xs text-gray-500">גיל פרישה: {row.age}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">
                      {row.years < 100 ? `${row.years} שנים` : 'לא מגיע'}
                    </p>
                    {'diff' in row && row.diff !== undefined && row.diff > 0 && (
                      <p className="text-xs text-green-700 font-semibold">
                        ↓ {row.diff.toFixed(1)} שנים פחות
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* גרף השוואת תרחישים */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h3 className="text-base font-semibold text-gray-900 mb-4">
              השוואת תרחישים - שנים ל-FIRE
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart
                data={[
                  { name: 'נוכחי', שנים: result.yearsToFire },
                  { name: '+10% חיסכון', שנים: result.sensitivityPlusSavings },
                  { name: '+1% תשואה', שנים: result.sensitivityPlusReturn },
                  { name: '-10% הוצאות', שנים: result.sensitivityLowerExpenses },
                ]}
                margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="שנים" fill="#3b82f6" radius={[4, 4, 0, 0]}>
                  {[
                    '#3b82f6',
                    '#10b981',
                    '#8b5cf6',
                    '#f59e0b',
                  ].map((color, index) => (
                    <rect key={index} fill={color} />
                  ))}
                </Bar>
                <ReferenceLine
                  y={result.yearsToFire}
                  stroke="#ef4444"
                  strokeDasharray="4 4"
                  label={{ value: 'בסיס', position: 'right', fontSize: 11 }}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* המלצות */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-5 text-sm space-y-3">
            <h3 className="font-bold text-gray-900">המלצות לזרז FIRE</h3>
            <div className="grid md:grid-cols-2 gap-3">
              <div className="bg-white rounded-lg p-3 border border-blue-100">
                <p className="font-semibold text-blue-900 mb-1">⬆ הגדל הכנסה</p>
                <p className="text-gray-700 text-xs">
                  עלייה בשכר / freelance / side project. כל 1,000 ₪ נוספים בחודש = ~3-5 שנים
                  פחות ל-FIRE.
                </p>
              </div>
              <div className="bg-white rounded-lg p-3 border border-green-100">
                <p className="font-semibold text-green-900 mb-1">⬇ הקטן הוצאות קבועות</p>
                <p className="text-gray-700 text-xs">
                  כל הוצאה חודשית קבועה = הוצאות שנתיות × 25 ב-FIRE Number. רכב זול, שכירות
                  נמוכה = FIRE מהיר יותר.
                </p>
              </div>
              <div className="bg-white rounded-lg p-3 border border-purple-100">
                <p className="font-semibold text-purple-900 mb-1">📈 אופטימיזציה מסית</p>
                <p className="text-gray-700 text-xs">
                  קרן השתלמות מקסימלית (פטורה ממס), IRA, ניצול נקודות זיכוי. כל ₪ מס שנחסך =
                  ₪1 נוסף לתיק.
                </p>
              </div>
              <div className="bg-white rounded-lg p-3 border border-amber-100">
                <p className="font-semibold text-amber-900 mb-1">🏠 נדל"ן כרכיב FIRE</p>
                <p className="text-gray-700 text-xs">
                  נכס להשקעה שמניב 5,000 ₪/חודש מקביל ל-FIRE Number של 1.5M ₪ (בחישוב 4% SWR).
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
