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
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import {
  calculateComprehensiveRetirement,
  estimateSocialSecurityBenefit,
  estimatePensionBenefit,
  type ComprehensiveRetirementInput,
} from '@/lib/calculators/investments';
import { formatCurrency, formatPercent } from '@/lib/utils/formatters';
import { CheckCircle2, AlertTriangle, TrendingUp, TrendingDown, Target, DollarSign, Clock, Shield } from 'lucide-react';

// ============================================================
// ערכי ברירת מחדל
// ============================================================

const DEFAULT_INPUT: ComprehensiveRetirementInput = {
  currentAge: 35,
  retirementAge: 67,
  yearsInRetirement: 25,
  currentSavings: 200_000,
  monthlyContribution: 3_000,
  expectedReturn: 6,
  desiredMonthlyIncome: 15_000,
  inflationRate: 3,
  incomeSources: {
    pensionMonthly: 5_000,
    socialSecurityMonthly: 3_500,
    rentalIncome: 0,
    partTimeWork: 0,
    investmentPortfolio: 0,
  },
  withdrawalRate: 4,
  pensionTaxRate: 10,
  capitalGainsTaxRate: 25,
  scenarios: [
    { label: 'שמרני (3%)', returnRate: 3, color: '#6b7280', retirementAge: 67 },
    { label: 'מתון (6%)', returnRate: 6, color: '#3b82f6', retirementAge: 67 },
    { label: 'אגרסיבי (8%)', returnRate: 8, color: '#10b981', retirementAge: 67 },
    { label: 'מוקדם 62 (6%)', returnRate: 6, color: '#f59e0b', retirementAge: 62 },
    { label: 'מאוחר 70 (6%)', returnRate: 6, color: '#8b5cf6', retirementAge: 70 },
  ],
};

type MainMode = 'planning' | 'goal';
type ChartView = 'accumulation' | 'drawdown' | 'income' | 'scenarios';

// ============================================================
// קומפוננטה ראשית
// ============================================================
export function RetirementCalculator() {
  const [input, setInput] = useState<ComprehensiveRetirementInput>(DEFAULT_INPUT);
  const [mainMode, setMainMode] = useState<MainMode>('planning');
  const [chartView, setChartView] = useState<ChartView>('accumulation');
  const [showIncomeSources, setShowIncomeSources] = useState(true);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showEstimator, setShowEstimator] = useState(false);

  // קלטי אומדן פנסיה
  const [estimatorSalary, setEstimatorSalary] = useState(18_000);
  const [estimatorYears, setEstimatorYears] = useState(30);
  const [estimatorCouple, setEstimatorCouple] = useState(false);

  const result = useMemo(() => calculateComprehensiveRetirement(input), [input]);

  function update<K extends keyof ComprehensiveRetirementInput>(
    field: K,
    value: ComprehensiveRetirementInput[K],
  ) {
    setInput((prev) => ({ ...prev, [field]: value }));
  }

  function updateIncomeSources<K extends keyof ComprehensiveRetirementInput['incomeSources']>(
    field: K,
    value: number,
  ) {
    setInput((prev) => ({
      ...prev,
      incomeSources: { ...prev.incomeSources, [field]: value },
    }));
  }

  // פונקציה לאומדן אוטומטי
  function applyEstimate() {
    const pension = estimatePensionBenefit({
      averageSalary: estimatorSalary,
      yearsOfContribution: estimatorYears,
    });
    const ss = estimateSocialSecurityBenefit({
      retirementAge: input.retirementAge,
      yearsContributed: estimatorYears,
      averageSalary: estimatorSalary,
      isCouple: estimatorCouple,
    });
    setInput((prev) => ({
      ...prev,
      incomeSources: {
        ...prev.incomeSources,
        pensionMonthly: pension.monthlyPension,
        socialSecurityMonthly: ss,
      },
    }));
    setShowEstimator(false);
  }

  // נתוני גרף - צמיחת חיסכון
  const accumulationChartData = useMemo(
    () =>
      result.accumulationData
        .filter((_, i) => result.accumulationData.length <= 30 || i % 2 === 0 || i === result.accumulationData.length - 1)
        .map((row) => ({
          name: `${row.age}`,
          'חיסכון נומינלי': Math.round(row.balance),
          'ערך ריאלי': Math.round(row.realBalance),
          'הפקדות מצטבר': Math.round(row.yearlyContribution * row.year),
        })),
    [result.accumulationData],
  );

  // נתוני גרף - drawdown בפרישה
  const drawdownChartData = useMemo(
    () =>
      result.drawdownData.map((row) => ({
        name: `${row.age}`,
        'יתרת תיק': Math.round(row.balance),
        'הכנסה חודשית': Math.round(row.totalIncome),
        'יעד הכנסה': Math.round(row.nominalDesiredIncome),
      })),
    [result.drawdownData],
  );

  // נתוני גרף - מקורות הכנסה
  const incomeChartData = useMemo(() => {
    const { incomeSources, pensionTaxRate } = input;
    const inflFactor = Math.pow(1 + input.inflationRate / 100, result.yearsUntilRetirement);
    return [
      {
        name: 'פנסיה (נטו)',
        value: Math.round(incomeSources.pensionMonthly * (1 - pensionTaxRate / 100) * inflFactor),
        fill: '#3b82f6',
      },
      {
        name: 'ביטוח לאומי',
        value: Math.round(incomeSources.socialSecurityMonthly * inflFactor),
        fill: '#10b981',
      },
      {
        name: 'שכירות',
        value: Math.round(incomeSources.rentalIncome * inflFactor),
        fill: '#8b5cf6',
      },
      {
        name: 'עבודה חלקית',
        value: Math.round(incomeSources.partTimeWork * inflFactor),
        fill: '#f59e0b',
      },
      {
        name: 'משיכת תיק',
        value: Math.round(result.portfolioMonthlyDrawdown),
        fill: '#ef4444',
      },
    ].filter((d) => d.value > 0);
  }, [input, result]);

  // נתוני גרף - השוואת תרחישים
  const scenarioChartData = useMemo(() => {
    return result.scenarioResults.map((s) => ({
      name: s.label,
      'חיסכון צפוי': Math.round(s.projectedSavings),
      'ערך ריאלי': Math.round(s.realProjectedSavings),
      'שנים שמחזיק': s.yearsMoneyWillLast,
    }));
  }, [result.scenarioResults]);

  const statusColor = result.isOnTrack ? 'green' : result.fundingRatio > 0.7 ? 'amber' : 'red';
  const statusBg = statusColor === 'green' ? 'bg-green-50 border-green-300' :
    statusColor === 'amber' ? 'bg-amber-50 border-amber-300' : 'bg-red-50 border-red-300';
  const statusTextMain = statusColor === 'green' ? 'text-green-900' :
    statusColor === 'amber' ? 'text-amber-900' : 'text-red-900';

  return (
    <div className="space-y-6" dir="rtl">
      {/* ===== Mode Toggle ===== */}
      <div className="flex gap-2 bg-gray-100 rounded-xl p-1 w-fit">
        <button
          type="button"
          onClick={() => setMainMode('planning')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${mainMode === 'planning' ? 'bg-white text-blue-700 shadow font-bold' : 'text-gray-600 hover:text-gray-900'}`}
        >
          📋 תכנון פרישה
        </button>
        <button
          type="button"
          onClick={() => setMainMode('goal')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${mainMode === 'goal' ? 'bg-white text-emerald-700 shadow font-bold' : 'text-gray-600 hover:text-gray-900'}`}
        >
          🎯 כמה להפקיד?
        </button>
      </div>

      {/* ===== Main Grid ===== */}
      <div className="grid lg:grid-cols-5 gap-6">
        {/* === Form Panel === */}
        <div className="lg:col-span-3 space-y-5">

          {/* בסיס */}
          <Section title="👤 פרטים אישיים" color="blue">
            <div className="grid grid-cols-2 gap-3">
              <Field label="גיל נוכחי" hint="גיל הנוכחי שלך">
                <input type="number" min={18} max={75} value={input.currentAge}
                  onChange={(e) => update('currentAge', Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-base"
                />
              </Field>
              <Field label="גיל פרישה" hint="גבר: 67 | אישה: 65 (עולה ל-67)">
                <input type="number" min={50} max={80} value={input.retirementAge}
                  onChange={(e) => update('retirementAge', Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </Field>
              <Field label="שנות פרישה" hint="תוחלת חיים ממוצעת: 85-90">
                <input type="number" min={5} max={40} value={input.yearsInRetirement}
                  onChange={(e) => update('yearsInRetirement', Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </Field>
              <div className="bg-blue-50 rounded-lg p-3 flex items-center">
                <div>
                  <p className="text-xs text-blue-700 font-medium">שנים עד פרישה</p>
                  <p className="text-2xl font-bold text-blue-800">{result.yearsUntilRetirement}</p>
                </div>
              </div>
            </div>
          </Section>

          {/* חיסכון וצמיחה */}
          <Section title="💰 חיסכון והשקעה" color="emerald">
            <div className="space-y-3">
              <Field label="חיסכון נוכחי סה&quot;כ (₪)" hint="פנסיה + השתלמות + חיסכון פרטי">
                <input type="number" min={0} step={10_000} value={input.currentSavings}
                  onChange={(e) => update('currentSavings', Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 text-lg"
                />
              </Field>
              <Field label="הפקדה חודשית כוללת (₪)" hint="כולל הפרשות מעסיק לפנסיה (18.5% מהשכר)">
                <input type="number" min={0} step={500} value={input.monthlyContribution}
                  onChange={(e) => update('monthlyContribution', Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="תשואה שנתית צפויה (%)">
                  <input type="number" min={0} max={20} step={0.5} value={input.expectedReturn}
                    onChange={(e) => update('expectedReturn', Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  />
                </Field>
                <Field label="אינפלציה שנתית (%)">
                  <input type="number" min={0} max={10} step={0.5} value={input.inflationRate}
                    onChange={(e) => update('inflationRate', Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  />
                </Field>
              </div>
              {/* תשואות ייחוס */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                <p className="text-xs text-emerald-800 font-medium mb-2">💡 תשואות ייחוס לפנסיה:</p>
                <div className="grid grid-cols-3 gap-1">
                  {[['שמרני', 3], ['מסלול כללי', 5.5], ['מניות', 7]].map(([label, rate]) => (
                    <button key={String(label)} type="button"
                      onClick={() => update('expectedReturn', Number(rate))}
                      className={`text-xs py-1 px-2 rounded transition text-center ${input.expectedReturn === Number(rate) ? 'bg-emerald-600 text-white' : 'bg-white border border-emerald-300 text-emerald-700 hover:bg-emerald-100'}`}
                    >
                      {label}: {rate}%
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </Section>

          {/* הכנסה רצויה */}
          <Section title="🏠 יעד הכנסה בפרישה" color="purple">
            <Field label="הכנסה חודשית רצויה בפרישה (₪ — בערכי היום)"
              hint="כמה תרצה לחיות בחודש? המחשבון יתאים לאינפלציה">
              <input type="number" min={0} step={500} value={input.desiredMonthlyIncome}
                onChange={(e) => update('desiredMonthlyIncome', Number(e.target.value))}
                className="w-full px-3 py-2 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-lg bg-purple-50"
              />
            </Field>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {[8_000, 12_000, 15_000, 20_000, 25_000, 30_000].map((amt) => (
                <button key={amt} type="button"
                  onClick={() => update('desiredMonthlyIncome', amt)}
                  className={`text-xs py-1.5 px-2 rounded-lg transition text-center ${input.desiredMonthlyIncome === amt ? 'bg-purple-600 text-white font-bold' : 'bg-purple-50 border border-purple-200 text-purple-700 hover:bg-purple-100'}`}
                >
                  {formatCurrency(amt)}/ח
                </button>
              ))}
            </div>
            <div className="mt-3 bg-purple-50 border border-purple-200 rounded-lg p-3">
              <p className="text-xs text-purple-800">
                <strong>בערכים נומינליים בגיל פרישה:</strong>{' '}
                {formatCurrency(Math.round(input.desiredMonthlyIncome * Math.pow(1 + input.inflationRate / 100, result.yearsUntilRetirement)))}/חודש
                {' '}(אחרי {result.yearsUntilRetirement} שנות אינפלציה של {input.inflationRate}%)
              </p>
            </div>
          </Section>

          {/* מקורות הכנסה בפרישה */}
          <button type="button"
            onClick={() => setShowIncomeSources(!showIncomeSources)}
            className="w-full bg-gray-100 hover:bg-gray-200 rounded-xl p-4 flex items-center justify-between transition text-sm font-medium text-gray-700"
          >
            <span>💼 מקורות הכנסה בפרישה — פנסיה, ב.ל., שכירות, עבודה</span>
            <span>{showIncomeSources ? '▲' : '▼'}</span>
          </button>

          {showIncomeSources && (
            <Section title="💼 מקורות הכנסה בפרישה (בערכי היום)" color="gray">
              <div className="space-y-3">
                {/* אומדן אוטומטי */}
                <button type="button"
                  onClick={() => setShowEstimator(!showEstimator)}
                  className="w-full bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-700 hover:bg-blue-100 transition text-right"
                >
                  🧮 חשב לי אומדן פנסיה + ב.ל. אוטומטי
                </button>

                {showEstimator && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
                    <p className="text-sm font-medium text-blue-900">אומדן מהיר — מבוסס על שכר + וותק</p>
                    <div className="grid grid-cols-2 gap-3">
                      <Field label="שכר ממוצע (₪/חודש)">
                        <input type="number" min={5_000} step={1_000} value={estimatorSalary}
                          onChange={(e) => setEstimatorSalary(Number(e.target.value))}
                          className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-400 text-sm"
                        />
                      </Field>
                      <Field label="שנות הפקדה לפנסיה">
                        <input type="number" min={1} max={50} value={estimatorYears}
                          onChange={(e) => setEstimatorYears(Number(e.target.value))}
                          className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-400 text-sm"
                        />
                      </Field>
                    </div>
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                      <input type="checkbox" checked={estimatorCouple}
                        onChange={(e) => setEstimatorCouple(e.target.checked)}
                        className="w-4 h-4 text-blue-600" />
                      <span>חישוב לזוג (ב.ל. לזוג: ~4,900 ₪)</span>
                    </label>
                    <div className="bg-white rounded-lg p-3 text-sm space-y-1">
                      <div className="flex justify-between">
                        <span>פנסיה מוערכת:</span>
                        <strong>{formatCurrency(estimatePensionBenefit({ averageSalary: estimatorSalary, yearsOfContribution: estimatorYears }).monthlyPension)}/ח</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>ב.ל. מוערך:</span>
                        <strong>{formatCurrency(estimateSocialSecurityBenefit({ retirementAge: input.retirementAge, yearsContributed: estimatorYears, averageSalary: estimatorSalary, isCouple: estimatorCouple }))}/ח</strong>
                      </div>
                      <div className="flex justify-between text-gray-500">
                        <span>שיעור החלפה:</span>
                        <span>{estimatePensionBenefit({ averageSalary: estimatorSalary, yearsOfContribution: estimatorYears }).replacementRate.toFixed(0)}% מהשכר</span>
                      </div>
                    </div>
                    <button type="button" onClick={applyEstimate}
                      className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition">
                      החל אומדנים
                    </button>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <Field label="קצבת פנסיה (₪/ח)" hint="לפני מס">
                    <input type="number" min={0} step={500} value={input.incomeSources.pensionMonthly}
                      onChange={(e) => updateIncomeSources('pensionMonthly', Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 text-sm"
                    />
                  </Field>
                  <Field label="ב.ל. — קצבת זקנה (₪/ח)" hint="פטור ממס (כ-3,500 ₪)">
                    <input type="number" min={0} step={100} value={input.incomeSources.socialSecurityMonthly}
                      onChange={(e) => updateIncomeSources('socialSecurityMonthly', Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 text-sm"
                    />
                  </Field>
                  <Field label="דמי שכירות (₪/ח)" hint="הכנסה פסיבית מנדל&quot;ן">
                    <input type="number" min={0} step={500} value={input.incomeSources.rentalIncome}
                      onChange={(e) => updateIncomeSources('rentalIncome', Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 text-sm"
                    />
                  </Field>
                  <Field label="עבודה חלקית (₪/ח)" hint="משרה חלקית / ייעוץ בפרישה">
                    <input type="number" min={0} step={500} value={input.incomeSources.partTimeWork}
                      onChange={(e) => updateIncomeSources('partTimeWork', Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 text-sm"
                    />
                  </Field>
                </div>

                {/* סיכום הכנסות קבועות */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                  <p className="text-xs text-gray-500 mb-2">סיכום הכנסות קבועות (בערכי היום):</p>
                  <div className="space-y-1 text-sm">
                    {[
                      { label: 'פנסיה נטו', val: input.incomeSources.pensionMonthly * (1 - input.pensionTaxRate / 100) },
                      { label: 'ביטוח לאומי', val: input.incomeSources.socialSecurityMonthly },
                      { label: 'שכירות', val: input.incomeSources.rentalIncome },
                      { label: 'עבודה חלקית', val: input.incomeSources.partTimeWork },
                    ].filter((r) => r.val > 0).map((r) => (
                      <div key={r.label} className="flex justify-between">
                        <span className="text-gray-600">{r.label}</span>
                        <span className="font-medium">{formatCurrency(Math.round(r.val))}/ח</span>
                      </div>
                    ))}
                    <div className="border-t border-gray-300 pt-1 flex justify-between font-bold">
                      <span>סה&quot;כ קבוע</span>
                      <span>{formatCurrency(Math.round(
                        input.incomeSources.pensionMonthly * (1 - input.pensionTaxRate / 100) +
                        input.incomeSources.socialSecurityMonthly +
                        input.incomeSources.rentalIncome +
                        input.incomeSources.partTimeWork
                      ))}/ח</span>
                    </div>
                    <div className="flex justify-between text-purple-700">
                      <span>נדרש מהתיק להשלמה</span>
                      <span className="font-bold">{formatCurrency(Math.round(result.portfolioMonthlyDrawdown))}/ח</span>
                    </div>
                  </div>
                </div>
              </div>
            </Section>
          )}

          {/* הגדרות מתקדמות */}
          <button type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="w-full bg-gray-100 hover:bg-gray-200 rounded-xl p-4 flex items-center justify-between transition text-sm font-medium text-gray-700"
          >
            <span>⚙️ הגדרות מתקדמות — מיסוי, שיעור משיכה</span>
            <span>{showAdvanced ? '▲' : '▼'}</span>
          </button>

          {showAdvanced && (
            <Section title="⚙️ מיסוי ואסטרטגיית משיכה" color="gray">
              <div className="space-y-4">
                <Field label={`שיעור משיכה שנתי מהתיק: ${input.withdrawalRate}%`}
                  hint="כלל 4% = בטוח ל-30 שנה. 3% = שמרני מאוד. 5% = סיכון גבוה">
                  <input type="range" min={2} max={8} step={0.5} value={input.withdrawalRate}
                    onChange={(e) => update('withdrawalRate', Number(e.target.value))}
                    className="w-full accent-blue-600"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>2% (שמרני)</span>
                    <span className="text-blue-600 font-medium">4% (כלל אצבע)</span>
                    <span>8% (אגרסיבי)</span>
                  </div>
                </Field>

                <div className="grid grid-cols-2 gap-3">
                  <Field label={`מס על פנסיה: ${input.pensionTaxRate}%`}
                    hint="פטור עד ~8,000 ₪/ח. מס מוגבר מעל.">
                    <input type="range" min={0} max={35} step={1} value={input.pensionTaxRate}
                      onChange={(e) => update('pensionTaxRate', Number(e.target.value))}
                      className="w-full accent-amber-500"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>0%</span>
                      <span className="text-amber-600">{input.pensionTaxRate}%</span>
                      <span>35%</span>
                    </div>
                  </Field>

                  <Field label={`מס רווחי הון: ${input.capitalGainsTaxRate}%`}
                    hint="25% בישראל (סעיף 91). רלוונטי לתיק השקעות.">
                    <input type="range" min={0} max={30} step={1} value={input.capitalGainsTaxRate}
                      onChange={(e) => update('capitalGainsTaxRate', Number(e.target.value))}
                      className="w-full accent-red-500"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>0%</span>
                      <span className="text-red-600">{input.capitalGainsTaxRate}%</span>
                      <span>30%</span>
                    </div>
                  </Field>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-900 space-y-1">
                  <p className="font-medium">מיסוי פנסיה בישראל (2026):</p>
                  <p>• פטור עד ~8,100 ₪/חודש (אחרי 67) — מגדיל עם הגיל</p>
                  <p>• פיצויים: פטור עד ~13,000 ₪ לשנת עבודה (תקרה שנתית)</p>
                  <p>• מעבר לתקרה — מדרגות מס רגילות</p>
                </div>
              </div>
            </Section>
          )}
        </div>

        {/* === Results Panel === */}
        <div className="lg:col-span-2 space-y-4">
          {mainMode === 'planning' ? (
            <PlanningResults result={result} input={input} statusBg={statusBg} statusTextMain={statusTextMain} statusColor={statusColor} />
          ) : (
            <GoalSeekingResults result={result} input={input} />
          )}
        </div>
      </div>

      {/* ===== Charts ===== */}
      <div className="bg-white border-2 border-gray-200 rounded-xl p-5">
        <div className="flex flex-wrap gap-2 mb-5">
          <TabButton active={chartView === 'accumulation'} onClick={() => setChartView('accumulation')}>
            📈 צמיחת חיסכון
          </TabButton>
          <TabButton active={chartView === 'drawdown'} onClick={() => setChartView('drawdown')}>
            📉 תיק בפרישה
          </TabButton>
          <TabButton active={chartView === 'income'} onClick={() => setChartView('income')}>
            💼 מקורות הכנסה
          </TabButton>
          <TabButton active={chartView === 'scenarios'} onClick={() => setChartView('scenarios')}>
            🔀 תרחישים
          </TabButton>
        </div>

        {chartView === 'accumulation' && (
          <div>
            <h3 className="font-bold text-gray-900 mb-1">צמיחת החיסכון עד גיל {input.retirementAge}</h3>
            <p className="text-xs text-gray-500 mb-4">
              כחול = נומינלי | ירוק מנוקד = ריאלי (אחרי {input.inflationRate}% אינפלציה)
            </p>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={accumulationChartData}>
                  <defs>
                    <linearGradient id="gradNominal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="gradReal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} label={{ value: 'גיל', position: 'insideBottom', offset: -2, fontSize: 10 }} />
                  <YAxis tickFormatter={(v) => `${(v / 1_000_000).toFixed(1)}M`} tick={{ fontSize: 10 }} />
                  <Tooltip formatter={(value) => formatCurrency(Number(value))} labelStyle={{ direction: 'rtl', fontFamily: 'inherit' }} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Area type="monotone" dataKey="חיסכון נומינלי" stroke="#3b82f6" strokeWidth={2} fill="url(#gradNominal)" />
                  <Area type="monotone" dataKey="ערך ריאלי" stroke="#10b981" strokeWidth={2} fill="url(#gradReal)" strokeDasharray="5 5" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-3 text-center text-sm">
              <div className="bg-blue-50 rounded-lg p-2">
                <p className="text-xs text-blue-600">חיסכון נומינלי</p>
                <p className="font-bold text-blue-800">{formatCurrency(result.projectedSavings)}</p>
              </div>
              <div className="bg-green-50 rounded-lg p-2">
                <p className="text-xs text-green-600">ערך ריאלי</p>
                <p className="font-bold text-green-800">{formatCurrency(result.realProjectedSavings)}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-2">
                <p className="text-xs text-gray-500">הפקדות בלבד</p>
                <p className="font-bold text-gray-700">{formatCurrency(result.totalContributions)}</p>
              </div>
            </div>
          </div>
        )}

        {chartView === 'drawdown' && (
          <div>
            <h3 className="font-bold text-gray-900 mb-1">תיק ההשקעות בגיל {input.retirementAge}–{input.retirementAge + input.yearsInRetirement}</h3>
            <p className="text-xs text-gray-500 mb-4">
              כחול = יתרת תיק | ירוק = הכנסה חודשית בפועל | כתום מנוקד = יעד הכנסה
            </p>
            {drawdownChartData.length > 0 ? (
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={drawdownChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{ fontSize: 10 }} label={{ value: 'גיל', position: 'insideBottom', offset: -2, fontSize: 10 }} />
                    <YAxis yAxisId="balance" tickFormatter={(v) => `${(v / 1_000_000).toFixed(1)}M`} tick={{ fontSize: 10 }} />
                    <YAxis yAxisId="income" orientation="left" tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} tick={{ fontSize: 9 }} width={40} />
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} labelStyle={{ direction: 'rtl', fontFamily: 'inherit' }} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Line yAxisId="balance" type="monotone" dataKey="יתרת תיק" stroke="#3b82f6" strokeWidth={2} dot={false} />
                    <Line yAxisId="income" type="monotone" dataKey="הכנסה חודשית" stroke="#10b981" strokeWidth={2} dot={false} />
                    <Line yAxisId="income" type="monotone" dataKey="יעד הכנסה" stroke="#f59e0b" strokeWidth={1} strokeDasharray="4 4" dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-72 flex items-center justify-center text-gray-500">
                <p>הגדר יעד הכנסה ומקורות כדי לראות גרף drawdown</p>
              </div>
            )}
            <div className="mt-3 bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm">
              <p className="text-blue-800">
                <strong>תוחלת כסף:</strong> הכסף יחזיק{' '}
                <strong>{result.yearsMoneyWillLast} שנים</strong> (עד גיל {result.portfolioDepletionAge})
                {result.yearsMoneyWillLast >= 40 && ' 🎉 — הכסף לא ייגמר!'}
              </p>
            </div>
          </div>
        )}

        {chartView === 'income' && (
          <div>
            <h3 className="font-bold text-gray-900 mb-1">מקורות הכנסה חודשית בפרישה</h3>
            <p className="text-xs text-gray-500 mb-4">
              כל הסכומים נומינליים — מותאמים לאינפלציה עד גיל {input.retirementAge}
            </p>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={incomeChartData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} tick={{ fontSize: 10 }} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={90} />
                  <Tooltip formatter={(value) => formatCurrency(Number(value)) + '/ח'} />
                  <Bar dataKey="value" name="הכנסה חודשית">
                    {incomeChartData.map((entry, index) => (
                      <Cell key={index} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <div className="bg-green-50 rounded-lg p-3 text-center">
                <p className="text-xs text-green-600">סה&quot;כ הכנסה חודשית</p>
                <p className="font-bold text-green-800 text-lg">{formatCurrency(result.totalMonthlyIncomeAtRetirement)}</p>
                <p className="text-xs text-green-600">נומינלי בשנת פרישה ראשונה</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-3 text-center">
                <p className="text-xs text-purple-600">ערך ריאלי (בערכי היום)</p>
                <p className="font-bold text-purple-800 text-lg">{formatCurrency(result.totalMonthlyIncomeReal)}</p>
                <p className="text-xs text-purple-600">= כוח קנייה של היום</p>
              </div>
            </div>
            {result.incomeGap > 0 && (
              <div className="mt-3 bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-800">
                <strong>פער הכנסה:</strong> {formatCurrency(Math.round(result.incomeGap))}/חודש — ההכנסה הצפויה לא מכסה את היעד.
                שקול הגדלת חיסכון או הפחתת הוצאות.
              </div>
            )}
          </div>
        )}

        {chartView === 'scenarios' && (
          <div>
            <h3 className="font-bold text-gray-900 mb-1">השוואת תרחישים — תשואה וגיל פרישה שונים</h3>
            <p className="text-xs text-gray-500 mb-4">
              אותה הפקדה ({formatCurrency(input.monthlyContribution)}/ח) עם נתונים שונים
            </p>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={scenarioChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fontSize: 9 }} />
                  <YAxis tickFormatter={(v) => `${(v / 1_000_000).toFixed(1)}M`} tick={{ fontSize: 10 }} />
                  <Tooltip formatter={(value) => formatCurrency(Number(value))} labelStyle={{ direction: 'rtl', fontFamily: 'inherit' }} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Bar dataKey="חיסכון צפוי" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="ערך ריאלי" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* טבלת תרחישים */}
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-sm border-collapse min-w-[500px]">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-right p-2 border border-gray-200">תרחיש</th>
                    <th className="text-right p-2 border border-gray-200">גיל פרישה</th>
                    <th className="text-right p-2 border border-gray-200">חיסכון</th>
                    <th className="text-right p-2 border border-gray-200">ריאלי</th>
                    <th className="text-right p-2 border border-gray-200">שנות כסף</th>
                    <th className="text-right p-2 border border-gray-200">מצב</th>
                  </tr>
                </thead>
                <tbody>
                  {result.scenarioResults.map((s, i) => (
                    <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="p-2 border border-gray-200">
                        <span className="inline-block w-3 h-3 rounded-full ml-1" style={{ backgroundColor: s.color }} />
                        {s.label}
                      </td>
                      <td className="p-2 border border-gray-200 text-center">{s.retirementAge}</td>
                      <td className="p-2 border border-gray-200 tabular-nums font-medium">{formatCurrency(s.projectedSavings)}</td>
                      <td className="p-2 border border-gray-200 tabular-nums text-blue-700">{formatCurrency(s.realProjectedSavings)}</td>
                      <td className="p-2 border border-gray-200 text-center">
                        {s.yearsMoneyWillLast >= 40 ? '40+' : s.yearsMoneyWillLast}
                      </td>
                      <td className="p-2 border border-gray-200">
                        {s.isOnTrack
                          ? <span className="text-green-600 font-medium">במסלול ✓</span>
                          : <span className="text-red-500 font-medium">פער ✗</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* ===== Tips & Education ===== */}
      <RetirementEducation input={input} result={result} />
    </div>
  );
}

// ============================================================
// תוצאות — מצב תכנון
// ============================================================
function PlanningResults({
  result, input, statusBg, statusTextMain, statusColor,
}: {
  result: ReturnType<typeof calculateComprehensiveRetirement>;
  input: ComprehensiveRetirementInput;
  statusBg: string;
  statusTextMain: string;
  statusColor: string;
}) {
  return (
    <>
      {/* כרטיס סטטוס */}
      <div className={`border-2 rounded-xl p-5 ${statusBg}`}>
        <div className="flex items-start gap-3">
          {statusColor === 'green'
            ? <CheckCircle2 className="w-7 h-7 text-green-600 flex-shrink-0" />
            : <AlertTriangle className={`w-7 h-7 flex-shrink-0 ${statusColor === 'amber' ? 'text-amber-600' : 'text-red-500'}`} />
          }
          <div>
            <h3 className={`font-bold text-lg mb-1 ${statusTextMain}`}>
              {statusColor === 'green' ? 'במסלול!' :
               statusColor === 'amber' ? 'פער בינוני' : 'פער משמעותי'}
            </h3>
            <p className={`text-sm ${statusTextMain}`}>
              יחס כיסוי: <strong>{(result.fundingRatio * 100).toFixed(0)}%</strong>
              {' '}({result.isOnTrack ? `עודף ${formatCurrency(result.surplus)}` : `חסר ${formatCurrency(result.shortfall)}`})
            </p>
          </div>
        </div>
      </div>

      {/* חיסכון צפוי */}
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-300 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-1">
          <TrendingUp className="w-5 h-5 text-blue-600" />
          <p className="text-sm font-medium text-blue-800">חיסכון צפוי בפרישה</p>
        </div>
        <p className="text-3xl font-bold text-blue-700 tabular-nums">{formatCurrency(result.projectedSavings)}</p>
        <p className="text-xs text-blue-600 mt-1">ריאלי: {formatCurrency(result.realProjectedSavings)} (בכוח קנייה של היום)</p>
      </div>

      {/* כרטיסים קטנים */}
      <div className="grid grid-cols-2 gap-3">
        <MiniCard
          title="נדרש לפרישה"
          value={formatCurrency(result.requiredSavings)}
          subtitle={`לכיסוי ${input.yearsInRetirement} שנות פרישה`}
          color="purple"
          icon={<Target className="w-4 h-4" />}
        />
        <MiniCard
          title="הכנסה בפרישה"
          value={formatCurrency(result.totalMonthlyIncomeAtRetirement)}
          subtitle="חודשי נומינלי"
          color="green"
          icon={<DollarSign className="w-4 h-4" />}
        />
        <MiniCard
          title="כסף מחזיק"
          value={`${result.yearsMoneyWillLast >= 40 ? '40+' : result.yearsMoneyWillLast} שנים`}
          subtitle={`עד גיל ${result.portfolioDepletionAge}`}
          color={result.yearsMoneyWillLast >= input.yearsInRetirement ? 'green' : 'red'}
          icon={<Clock className="w-4 h-4" />}
        />
        <MiniCard
          title="צמיחה מתיק"
          value={formatCurrency(result.totalGrowth)}
          subtitle={`על ${formatCurrency(result.totalContributions)} הפקדות`}
          color="emerald"
          icon={<Shield className="w-4 h-4" />}
        />
      </div>

      {/* פירוט */}
      <div className="bg-white border-2 border-gray-200 rounded-xl p-4 space-y-1.5 text-sm">
        <h4 className="font-bold text-gray-900 mb-2">📊 פירוט מלא</h4>
        <Row label="שנים עד פרישה" value={`${result.yearsUntilRetirement}`} />
        <Row label="חיסכון נוכחי" value={formatCurrency(input.currentSavings)} />
        <Row label="הפקדה חודשית" value={`${formatCurrency(input.monthlyContribution)}/ח`} />
        <Row label="סה&quot;כ הפקדות" value={formatCurrency(result.totalContributions)} />
        <Row label="צמיחת תיק" value={formatCurrency(result.totalGrowth)} color="emerald" />
        <div className="border-t border-gray-200 pt-2">
          <Row label="חיסכון נומינלי" value={formatCurrency(result.projectedSavings)} bold />
          <Row label="חיסכון ריאלי" value={formatCurrency(result.realProjectedSavings)} color="blue" bold />
        </div>
        <div className="border-t border-gray-200 pt-2">
          <Row label="משיכה חודשית מתיק" value={`${formatCurrency(Math.round(result.portfolioMonthlyDrawdown))}/ח`} color="red" />
          <Row label="מס פנסיה שנתי מוערך" value={`~${formatCurrency(Math.round(result.estimatedPensionTax))}`} color="amber" />
          <Row label="מס על תיק מוערך" value={`~${formatCurrency(Math.round(result.estimatedPortfolioTax))}`} color="amber" />
        </div>
      </div>
    </>
  );
}

// ============================================================
// תוצאות — מצב goal-seeking
// ============================================================
function GoalSeekingResults({
  result, input,
}: {
  result: ReturnType<typeof calculateComprehensiveRetirement>;
  input: ComprehensiveRetirementInput;
}) {
  const additionalNeeded = Math.max(0, result.requiredMonthlyContributionForGoal - input.monthlyContribution);
  return (
    <>
      <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-2 border-emerald-300 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-2">
          <Target className="w-5 h-5 text-emerald-600" />
          <p className="text-sm font-medium text-emerald-800">הפקדה חודשית נדרשת ליעד</p>
        </div>
        <p className="text-4xl font-bold text-emerald-700 tabular-nums">
          {formatCurrency(Math.round(result.requiredMonthlyContributionForGoal))}
        </p>
        <p className="text-xs text-emerald-600 mt-1">
          כדי שהחיסכון יכסה {input.yearsInRetirement} שנות פרישה
        </p>
      </div>

      {additionalNeeded > 100 ? (
        <div className="bg-amber-50 border-2 border-amber-300 rounded-xl p-4">
          <p className="text-sm font-medium text-amber-800 mb-1">צריך להוסיף</p>
          <p className="text-2xl font-bold text-amber-700">{formatCurrency(Math.round(additionalNeeded))}/חודש</p>
          <p className="text-xs text-amber-600 mt-1">מעל ההפקדה הנוכחית ({formatCurrency(input.monthlyContribution)}/ח)</p>
        </div>
      ) : (
        <div className="bg-green-50 border-2 border-green-300 rounded-xl p-4">
          <CheckCircle2 className="w-6 h-6 text-green-600 mb-1" />
          <p className="text-sm font-medium text-green-800">ההפקדה הנוכחית מספיקה!</p>
          <p className="text-xs text-green-700 mt-1">אפשר אפילו להפחית ב-{formatCurrency(Math.abs(additionalNeeded))}/ח</p>
        </div>
      )}

      <div className="bg-white border-2 border-gray-200 rounded-xl p-4 space-y-2 text-sm">
        <h4 className="font-bold text-gray-900 mb-2">📊 ניתוח יעד</h4>
        <Row label="הכנסה רצויה (היום)" value={`${formatCurrency(input.desiredMonthlyIncome)}/ח`} />
        <Row label="קצבאות קבועות" value={`${formatCurrency(Math.round(
          input.incomeSources.pensionMonthly * (1 - input.pensionTaxRate / 100) +
          input.incomeSources.socialSecurityMonthly +
          input.incomeSources.rentalIncome +
          input.incomeSources.partTimeWork
        ))}/ח`} />
        <Row label="נדרש מהתיק (היום)" value={`${formatCurrency(Math.round(result.portfolioMonthlyDrawdown))}/ח`} color="red" />
        <div className="border-t border-gray-200 pt-2">
          <Row label="חיסכון נדרש" value={formatCurrency(result.requiredSavings)} bold />
          <Row label="חיסכון צפוי" value={formatCurrency(result.projectedSavings)} bold color={result.isOnTrack ? 'emerald' : 'red'} />
        </div>
        <div className="border-t border-gray-200 pt-2">
          <Row label="הפקדה נוכחית" value={`${formatCurrency(input.monthlyContribution)}/ח`} />
          <Row label="הפקדה נדרשת" value={`${formatCurrency(Math.round(result.requiredMonthlyContributionForGoal))}/ח`} bold color="emerald" />
          <Row label="תוספת נדרשת" value={`${additionalNeeded > 0 ? '+' : ''}${formatCurrency(Math.round(additionalNeeded))}/ח`} color={additionalNeeded > 0 ? 'red' : 'emerald'} />
        </div>
      </div>

      {/* טיפ: אופציות לסגירת הפער */}
      {additionalNeeded > 100 && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm">
          <p className="font-medium text-blue-900 mb-2">💡 אפשרויות לסגירת הפער:</p>
          <ul className="space-y-1 text-blue-800 text-xs">
            <li>✓ דחה פרישה ב-3 שנים (עד {input.retirementAge + 3}) — חיסכון עולה משמעותית</li>
            <li>✓ הגדל הפקדה חודשית ב-{formatCurrency(Math.round(additionalNeeded))}</li>
            <li>✓ הפחת הכנסה רצויה ב-{formatCurrency(Math.round(additionalNeeded * 0.3))} (פחות תלות בתיק)</li>
            <li>✓ שפר תשואה — עבור למסלול מניות בפנסיה</li>
            <li>✓ הוסף מקור הכנסה: שכירות / עבודה חלקית</li>
          </ul>
        </div>
      )}
    </>
  );
}

// ============================================================
// חינוך — טיפים וסיכום
// ============================================================
function RetirementEducation({
  input,
  result,
}: {
  input: ComprehensiveRetirementInput;
  result: ReturnType<typeof calculateComprehensiveRetirement>;
}) {
  // כמה שווה דחיית פרישה ב-3 שנים
  const delayBenefit = result.scenarioResults.find((s) => s.retirementAge === input.retirementAge + 3)?.projectedSavings;

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-200 rounded-xl p-5 space-y-5">
      <h3 className="font-bold text-gray-900 text-lg">📚 תובנות פרישה — ישראל 2026</h3>

      <div className="grid md:grid-cols-3 gap-4">
        {/* כלל ה-4% */}
        <div className="bg-white rounded-xl border border-blue-200 p-4">
          <h4 className="font-bold text-blue-800 mb-2">📐 כלל ה-4%</h4>
          <p className="text-xs text-gray-600 mb-3">
            משוך 4% מהתיק בשנה הראשונה, הגדל בהתאם לאינפלציה. מחקר Trinity (1998): הכסף מחזיק 30+ שנה ב-95% מהמקרים.
          </p>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">4% מ-{formatCurrency(result.projectedSavings)}:</span>
            </div>
            <div className="text-lg font-bold text-blue-700">
              {formatCurrency(Math.round(result.projectedSavings * 0.04 / 12))}/חודש
            </div>
            <p className="text-xs text-gray-500">זה הsustainable drawdown מהתיק</p>
          </div>
        </div>

        {/* כוח הזמן */}
        <div className="bg-white rounded-xl border border-emerald-200 p-4">
          <h4 className="font-bold text-emerald-800 mb-2">⏰ כוח הזמן</h4>
          <p className="text-xs text-gray-600 mb-3">
            כל שנה נוספת של חיסכון שווה יותר מהשנה הקודמת — בגלל ריבית דריבית על הריבית.
          </p>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">חיסכון נוכחי:</span>
              <span className="font-bold">{formatCurrency(result.projectedSavings)}</span>
            </div>
            {delayBenefit && (
              <>
                <div className="flex justify-between text-emerald-700">
                  <span>+ 3 שנות חיסכון:</span>
                  <span className="font-bold">{formatCurrency(delayBenefit)}</span>
                </div>
                <div className="border-t pt-1 flex justify-between text-emerald-600">
                  <span>תוספת:</span>
                  <span className="font-bold">+{formatCurrency(delayBenefit - result.projectedSavings)}</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* ביטוח לאומי */}
        <div className="bg-white rounded-xl border border-amber-200 p-4">
          <h4 className="font-bold text-amber-800 mb-2">🛡️ קצבאות ישראל</h4>
          <p className="text-xs text-gray-600 mb-3">
            ביטוח לאומי: ~3,500 ₪ ביחיד, ~4,900 ₪ לזוג. פנסיה חובה: 18.5% מהשכר (עובד + מעסיק).
          </p>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">ב.ל. (זוג):</span>
              <span className="font-bold text-amber-700">4,900 ₪/ח</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">פנסיה (40 שנה):</span>
              <span className="font-bold text-amber-700">~{formatCurrency(estimatePensionBenefit({ averageSalary: 15000, yearsOfContribution: 40 }).monthlyPension)}/ח</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              שיעור החלפה: {estimatePensionBenefit({ averageSalary: 15000, yearsOfContribution: 40 }).replacementRate.toFixed(0)}% מהשכר
            </p>
          </div>
        </div>
      </div>

      {/* קו הגדול: קצבה vs. פיצויים */}
      <div className="bg-amber-50 border border-amber-300 rounded-xl p-4">
        <h4 className="font-bold text-amber-900 mb-2">⚠️ הטעות הגדולה: משיכת פיצויים</h4>
        <p className="text-sm text-amber-800">
          משיכת פיצויים בסיום עבודה = פגיעה אנושה בפנסיה. כל ₪ שנמשך כפיצויים הוא
          {' '}<strong>₪5-10</strong> פחות בקצבה החודשית לאורך 20 שנות פרישה.
          השאר את הפיצויים בקרן — הם חלק מהפנסיה!
        </p>
      </div>
    </div>
  );
}

// ============================================================
// Helper Components
// ============================================================
function Section({
  title, color = 'gray', children,
}: {
  title: React.ReactNode;
  color?: 'gray' | 'emerald' | 'blue' | 'purple';
  children: React.ReactNode;
}) {
  const bgMap = {
    gray: 'bg-white border-gray-200',
    emerald: 'bg-emerald-50 border-emerald-200',
    blue: 'bg-blue-50 border-blue-200',
    purple: 'bg-purple-50 border-purple-200',
  };
  return (
    <div className={`rounded-xl border-2 p-5 ${bgMap[color]}`}>
      <h3 className="font-bold text-gray-900 text-base mb-4">{title}</h3>
      {children}
    </div>
  );
}

function Field({ label, hint, children }: {
  label: string; hint?: string; children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {children}
      {hint && <p className="text-xs text-gray-500 mt-1">{hint}</p>}
    </div>
  );
}

function Row({ label, value, bold, color }: {
  label: string; value: string; bold?: boolean; color?: 'emerald' | 'blue' | 'red' | 'amber';
}) {
  const colorMap = { emerald: 'text-emerald-700', blue: 'text-blue-700', red: 'text-red-600', amber: 'text-amber-700' };
  const valueClass = color ? colorMap[color] : 'text-gray-900';
  return (
    <div className="flex justify-between py-0.5">
      <span className={`text-gray-600 ${bold ? 'font-bold text-gray-900' : ''}`}>{label}</span>
      <span className={`tabular-nums ${bold ? 'font-bold' : ''} ${valueClass}`}>{value}</span>
    </div>
  );
}

function MiniCard({ title, value, subtitle, color, icon }: {
  title: string; value: string; subtitle: string; color: string; icon?: React.ReactNode;
}) {
  const colorMap: Record<string, string> = {
    purple: 'bg-purple-50 border-purple-200 text-purple-800',
    green: 'bg-green-50 border-green-200 text-green-800',
    red: 'bg-red-50 border-red-200 text-red-800',
    emerald: 'bg-emerald-50 border-emerald-200 text-emerald-800',
    blue: 'bg-blue-50 border-blue-200 text-blue-800',
  };
  const cls = colorMap[color] ?? 'bg-gray-50 border-gray-200 text-gray-800';
  return (
    <div className={`border-2 rounded-xl p-3 ${cls}`}>
      <div className="flex items-center gap-1 mb-1">
        {icon}
        <p className="text-xs font-medium">{title}</p>
      </div>
      <p className="text-lg font-bold tabular-nums">{value}</p>
      <p className="text-xs opacity-75 mt-0.5">{subtitle}</p>
    </div>
  );
}

function TabButton({ active, onClick, children }: {
  active: boolean; onClick: () => void; children: React.ReactNode;
}) {
  return (
    <button type="button" onClick={onClick}
      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${active ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
      {children}
    </button>
  );
}
