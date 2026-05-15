'use client';

import { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import {
  calculateCompoundInterest,
  calculateRequiredMonthlyContribution,
  compareScenarios,
  INVESTMENT_CONSTANTS_2026,
  type CompoundInterestInput,
  type CompoundFrequency,
} from '@/lib/calculators/investments';
import { formatCurrency, formatPercent } from '@/lib/utils/formatters';

// ============================================================
// ערכי ברירת מחדל
// ============================================================
const initialInput: CompoundInterestInput = {
  principal: 50_000,
  annualRate: 7,
  years: 20,
  frequency: 'monthly',
  monthlyContribution: 1_000,
  inflationRate: 3,
  applyTax: true,
};

type Mode = 'forward' | 'goal';
type ChartView = 'growth' | 'stacked' | 'scenarios';

const PRESET_SCENARIOS = [
  { label: 'פיקדון / חיסכון (3.5%)', annualRate: 3.5, color: '#6b7280' },
  { label: 'תיק מגוון / קרן מחקה (7%)', annualRate: 7, color: '#3b82f6' },
  { label: 'S&P 500 / מניות (10%)', annualRate: 10, color: '#10b981' },
];

// ============================================================
// קומפוננטה ראשית
// ============================================================
export function CompoundInterestCalculator() {
  const [input, setInput] = useState<CompoundInterestInput>(initialInput);
  const [mode, setMode] = useState<Mode>('forward');
  const [goalAmount, setGoalAmount] = useState<number>(1_000_000);
  const [goalIsReal, setGoalIsReal] = useState(false);
  const [chartView, setChartView] = useState<ChartView>('growth');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const result = useMemo(() => calculateCompoundInterest(input), [input]);

  const goalResult = useMemo(() => {
    if (mode !== 'goal') return null;
    return calculateRequiredMonthlyContribution({
      goalAmount,
      principal: input.principal,
      annualRate: input.annualRate,
      years: input.years,
      inflationRate: input.inflationRate,
      targetIsReal: goalIsReal,
    });
  }, [mode, goalAmount, input.principal, input.annualRate, input.years, input.inflationRate, goalIsReal]);

  const scenarioResults = useMemo(
    () =>
      compareScenarios({
        principal: input.principal,
        monthlyContribution: input.monthlyContribution,
        years: input.years,
        inflationRate: input.inflationRate,
        applyTax: input.applyTax,
        scenarios: PRESET_SCENARIOS,
      }),
    [input.principal, input.monthlyContribution, input.years, input.inflationRate, input.applyTax],
  );

  function update<K extends keyof CompoundInterestInput>(field: K, value: CompoundInterestInput[K]) {
    setInput((prev) => ({ ...prev, [field]: value }));
  }

  // נתוני גרף - צמיחה לאורך זמן
  const growthChartData = useMemo(
    () =>
      result.yearlyBreakdown.map((row) => ({
        name: `שנה ${row.year}`,
        'ערך נומינלי': Math.round(row.balance),
        'ערך ריאלי': Math.round(row.realBalance),
        'אחרי מס': Math.round(row.afterTaxBalance),
      })),
    [result.yearlyBreakdown],
  );

  // נתוני גרף - מוערם (הפקדות vs ריבית)
  const stackedChartData = useMemo(
    () =>
      result.yearlyBreakdown
        .filter((_, i) => result.yearlyBreakdown.length <= 20 || i % 2 === 0 || i === result.yearlyBreakdown.length - 1)
        .map((row) => ({
          name: `${row.year}`,
          הפקדות: Math.round(row.cumulativeContributions),
          ריבית: Math.round(row.cumulativeInterest),
        })),
    [result.yearlyBreakdown],
  );

  // נתוני גרף - השוואת תרחישים
  const scenarioChartData = useMemo(() => {
    const maxYears = input.years;
    const step = maxYears <= 20 ? 1 : 5;
    const yearIndices: number[] = [];
    for (let y = step; y <= maxYears; y += step) yearIndices.push(y);
    if (!yearIndices.includes(maxYears)) yearIndices.push(maxYears);

    return yearIndices.map((yr) => {
      const row: Record<string, number | string> = { name: `${yr}` };
      scenarioResults.forEach((s) => {
        const found = s.yearlyData.find((d) => d.year === yr);
        if (found) row[s.label] = Math.round(found.balance);
      });
      return row;
    });
  }, [scenarioResults, input.years]);

  // שנים לטבלה - כל שנה עד 20, אחרת ציוני דרך
  const tableRows = useMemo(() => {
    const rows = result.yearlyBreakdown;
    if (rows.length <= 20) return rows;
    const milestones = new Set([5, 10, 15, 20, 25, 30, 35, 40, rows.length]);
    return rows.filter((r) => milestones.has(r.year));
  }, [result.yearlyBreakdown]);

  const taxRate = input.applyTax ? INVESTMENT_CONSTANTS_2026.CAPITAL_GAINS_TAX_RATE : 0;
  const inflationImpact = result.finalAmount - result.realFinalAmount;
  const annualContributions = input.monthlyContribution * 12;

  return (
    <div className="space-y-6" dir="rtl">
      {/* ===== Mode Toggle ===== */}
      <div className="flex gap-2 bg-gray-100 rounded-xl p-1 w-fit">
        <button
          type="button"
          onClick={() => setMode('forward')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
            mode === 'forward'
              ? 'bg-white text-emerald-700 shadow font-bold'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          📈 חישוב קדימה
        </button>
        <button
          type="button"
          onClick={() => setMode('goal')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
            mode === 'goal'
              ? 'bg-white text-blue-700 shadow font-bold'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          🎯 חישוב יעד
        </button>
      </div>

      {/* ===== Main Grid ===== */}
      <div className="grid lg:grid-cols-5 gap-6">
        {/* === Form === */}
        <div className="lg:col-span-3 space-y-5">
          {/* פרטי ההשקעה */}
          <Section title="💰 פרטי ההשקעה" color="emerald">
            <div className="space-y-4">
              <Field label="סכום השקעה ראשוני (₪)" hint="הסכום הנוכחי שיש לך להשקיע">
                <input
                  type="number"
                  min={0}
                  step={5000}
                  value={input.principal}
                  onChange={(e) => update('principal', Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 text-lg"
                />
              </Field>

              {mode === 'forward' ? (
                <Field
                  label="הפקדה חודשית (₪)"
                  hint="כמה תוסיף כל חודש? (0 = בלי הפקדות)"
                >
                  <input
                    type="number"
                    min={0}
                    step={100}
                    value={input.monthlyContribution}
                    onChange={(e) => update('monthlyContribution', Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  />
                </Field>
              ) : (
                <div className="space-y-3">
                  <Field
                    label="סכום יעד (₪)"
                    hint={goalIsReal ? 'בערכי היום (ריאלי - מותאם אינפלציה)' : 'ערך נומינלי עתידי'}
                  >
                    <input
                      type="number"
                      min={0}
                      step={50000}
                      value={goalAmount}
                      onChange={(e) => setGoalAmount(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-lg bg-blue-50"
                    />
                  </Field>
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="checkbox"
                      checked={goalIsReal}
                      onChange={(e) => setGoalIsReal(e.target.checked)}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span>היעד הוא בערכי היום (ריאלי) — המחשבון יתאים לאינפלציה</span>
                  </label>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <Field label="ריבית / תשואה שנתית (%)">
                  <input
                    type="number"
                    min={0}
                    max={50}
                    step={0.1}
                    value={input.annualRate}
                    onChange={(e) => update('annualRate', Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  />
                </Field>
                <Field label="תקופה (שנים)">
                  <input
                    type="number"
                    min={1}
                    max={60}
                    step={1}
                    value={input.years}
                    onChange={(e) => update('years', Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  />
                </Field>
              </div>

              {/* תשואות לדוגמה */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                <p className="text-xs text-emerald-800 font-medium mb-2">💡 תשואות שנתיות טיפוסיות:</p>
                <div className="grid grid-cols-2 gap-1 text-xs text-emerald-900">
                  <button
                    type="button"
                    onClick={() => update('annualRate', 3.5)}
                    className="text-right hover:text-emerald-600 transition"
                  >
                    🏦 פיקדון בנק: ~3.5%
                  </button>
                  <button
                    type="button"
                    onClick={() => update('annualRate', 5)}
                    className="text-right hover:text-emerald-600 transition"
                  >
                    📋 אג&quot;ח ממשלתי: ~5%
                  </button>
                  <button
                    type="button"
                    onClick={() => update('annualRate', 7)}
                    className="text-right hover:text-emerald-600 transition"
                  >
                    📊 תיק מגוון: ~7%
                  </button>
                  <button
                    type="button"
                    onClick={() => update('annualRate', 10)}
                    className="text-right hover:text-emerald-600 transition"
                  >
                    📈 S&amp;P 500: ~10%
                  </button>
                </div>
              </div>
            </div>
          </Section>

          {/* הגדרות מתקדמות */}
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="w-full bg-gray-100 hover:bg-gray-200 rounded-xl p-4 flex items-center justify-between transition text-sm font-medium text-gray-700"
          >
            <span>⚙️ הגדרות מתקדמות — אינפלציה, מס, תדירות חישוב</span>
            <span>{showAdvanced ? '▲' : '▼'}</span>
          </button>

          {showAdvanced && (
            <Section title="⚙️ הגדרות מתקדמות" color="gray">
              <div className="space-y-4">
                {/* אינפלציה */}
                <Field
                  label={`שיעור אינפלציה שנתי: ${input.inflationRate}%`}
                  hint="אינפלציה ממוצעת בישראל 2020-2026: כ-3%. השפעה: ₪1M נומינלי בעוד 30 שנה = כ-₪412K בערכי היום"
                >
                  <input
                    type="range"
                    min={0}
                    max={8}
                    step={0.5}
                    value={input.inflationRate}
                    onChange={(e) => update('inflationRate', Number(e.target.value))}
                    className="w-full accent-red-500"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>0%</span>
                    <span className="text-red-600 font-medium">ישראל ממוצע: 3%</span>
                    <span>8%</span>
                  </div>
                </Field>

                {/* מס רווחי הון */}
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={input.applyTax ?? true}
                      onChange={(e) => update('applyTax', e.target.checked)}
                      className="w-4 h-4 text-amber-600"
                    />
                    <span className="text-sm font-medium text-amber-900">
                      חשב מס רווחי הון (25%)
                    </span>
                  </label>
                  <p className="text-xs text-amber-800 mt-1 mr-6">
                    בישראל, רווחי הון מהשקעות חייבים ב-25% מס (סעיף 91 לפקודת מס הכנסה).
                    המס חל רק על הרווח — לא על הקרן + הפקדות.
                  </p>
                </div>

                {/* תדירות */}
                <Field label="תדירות חישוב ריבית">
                  <select
                    value={input.frequency}
                    onChange={(e) => update('frequency', e.target.value as CompoundFrequency)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 text-sm"
                  >
                    <option value="yearly">שנתי</option>
                    <option value="quarterly">רבעוני</option>
                    <option value="monthly">חודשי (מומלץ)</option>
                    <option value="daily">יומי</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    ההבדל בין חודשי ליומי זניח. עם הפקדות חודשיות, תמיד מחשבים חודשי.
                  </p>
                </Field>
              </div>
            </Section>
          )}
        </div>

        {/* === Results === */}
        <div className="lg:col-span-2 space-y-4">
          {mode === 'forward' ? (
            <ForwardResults
              result={result}
              input={input}
              inflationImpact={inflationImpact}
              taxRate={taxRate}
            />
          ) : (
            goalResult && (
              <GoalResults
                goalResult={goalResult}
                input={input}
                goalAmount={goalAmount}
                goalIsReal={goalIsReal}
              />
            )
          )}
        </div>
      </div>

      {/* ===== Crossover Note ===== */}
      {mode === 'forward' && result.crossoverYear && input.monthlyContribution > 0 && (
        <div className="bg-emerald-50 border-2 border-emerald-300 rounded-xl p-4">
          <p className="text-emerald-900 font-bold text-sm">
            🎉 נקודת פלא (Crossover Point): שנה {result.crossoverYear}
          </p>
          <p className="text-emerald-800 text-sm mt-1">
            החל משנה {result.crossoverYear}, הריבית השנתית שלך (
            {formatCurrency(result.yearlyBreakdown[result.crossoverYear - 1]?.interest ?? 0)}) עולה
            על ההפקדות השנתיות ({formatCurrency(annualContributions)}). מכאן הכסף &quot;עובד קשה יותר ממך&quot;!
          </p>
        </div>
      )}

      {/* ===== Charts ===== */}
      <div className="bg-white border-2 border-gray-200 rounded-xl p-5">
        {/* Chart Tab Selector */}
        <div className="flex flex-wrap gap-2 mb-5">
          <TabButton active={chartView === 'growth'} onClick={() => setChartView('growth')}>
            📈 צמיחה לאורך זמן
          </TabButton>
          <TabButton active={chartView === 'stacked'} onClick={() => setChartView('stacked')}>
            📊 הפקדות vs ריבית
          </TabButton>
          <TabButton active={chartView === 'scenarios'} onClick={() => setChartView('scenarios')}>
            🔀 השוואת תרחישים
          </TabButton>
        </div>

        {chartView === 'growth' && (
          <div>
            <h3 className="font-bold text-gray-900 mb-1">
              צמיחת השקעה לאורך {input.years} שנים
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              ירוק = ערך נומינלי | כחול = ריאלי (אחרי אינפלציה {input.inflationRate}%) |
              כתום = אחרי מס 25%
            </p>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={growthChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} interval="preserveStartEnd" />
                  <YAxis tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} tick={{ fontSize: 10 }} />
                  <Tooltip
                    formatter={(value) => formatCurrency(Number(value))}
                    labelStyle={{ direction: 'rtl', fontFamily: 'inherit' }}
                  />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Line
                    type="monotone"
                    dataKey="ערך נומינלי"
                    stroke="#10b981"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="ערך ריאלי"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={false}
                    strokeDasharray="5 5"
                  />
                  {(input.applyTax ?? true) && (
                    <Line
                      type="monotone"
                      dataKey="אחרי מס"
                      stroke="#f59e0b"
                      strokeWidth={2}
                      dot={false}
                      strokeDasharray="3 3"
                    />
                  )}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {chartView === 'stacked' && (
          <div>
            <h3 className="font-bold text-gray-900 mb-1">הפקדות מצטברות vs ריבית שנצברה</h3>
            <p className="text-xs text-gray-500 mb-4">
              כחול = סה&quot;כ הפקדות | ירוק = סה&quot;כ ריבית (הכוח האמיתי של ריבית דריבית)
            </p>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stackedChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                  <YAxis tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} tick={{ fontSize: 10 }} />
                  <Tooltip
                    formatter={(value) => formatCurrency(Number(value))}
                    labelStyle={{ direction: 'rtl', fontFamily: 'inherit' }}
                  />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Bar dataKey="הפקדות" stackId="a" fill="#3b82f6" />
                  <Bar dataKey="ריבית" stackId="a" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {chartView === 'scenarios' && (
          <div>
            <h3 className="font-bold text-gray-900 mb-1">
              השוואת תרחישים — אותו קרן + הפקדות, ריביות שונות
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              קרן: {formatCurrency(input.principal)} | הפקדה: {formatCurrency(input.monthlyContribution)}/ח
            </p>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={scenarioChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} label={{ value: 'שנה', position: 'insideBottom', offset: -2, fontSize: 10 }} />
                  <YAxis tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} tick={{ fontSize: 10 }} />
                  <Tooltip
                    formatter={(value) => formatCurrency(Number(value))}
                    labelStyle={{ direction: 'rtl', fontFamily: 'inherit' }}
                  />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  {PRESET_SCENARIOS.map((s) => (
                    <Line
                      key={s.label}
                      type="monotone"
                      dataKey={s.label}
                      stroke={s.color}
                      strokeWidth={2}
                      dot={false}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* טבלת השוואה */}
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-right p-2 border border-gray-200">תרחיש</th>
                    <th className="text-right p-2 border border-gray-200">סכום סופי</th>
                    <th className="text-right p-2 border border-gray-200">ריאלי</th>
                    <th className="text-right p-2 border border-gray-200">אחרי מס</th>
                  </tr>
                </thead>
                <tbody>
                  {scenarioResults.map((s, i) => (
                    <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="p-2 border border-gray-200">
                        <span className="inline-block w-3 h-3 rounded-full mr-1" style={{ backgroundColor: s.color }} />
                        {s.label}
                      </td>
                      <td className="p-2 border border-gray-200 tabular-nums font-medium">
                        {formatCurrency(s.finalAmount)}
                      </td>
                      <td className="p-2 border border-gray-200 tabular-nums text-blue-700">
                        {formatCurrency(s.realFinalAmount)}
                      </td>
                      <td className="p-2 border border-gray-200 tabular-nums text-amber-700">
                        {formatCurrency(s.afterTaxFinalAmount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="text-xs text-gray-500 mt-2">
                ההפרש בין פיקדון לS&P 500 לאורך {input.years} שנים:{' '}
                <strong className="text-emerald-700">
                  {formatCurrency(
                    (scenarioResults[2]?.finalAmount ?? 0) - (scenarioResults[0]?.finalAmount ?? 0),
                  )}
                </strong>
              </p>
            </div>
          </div>
        )}
      </div>

      {/* ===== Yearly Breakdown Table ===== */}
      {mode === 'forward' && tableRows.length > 0 && (
        <div className="bg-white border-2 border-gray-200 rounded-xl p-5">
          <h3 className="font-bold text-gray-900 mb-3">
            📋 פירוט שנתי {result.yearlyBreakdown.length > 20 ? '(ציוני דרך)' : ''}
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse min-w-[600px]">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-right p-2 border border-gray-200">שנה</th>
                  <th className="text-right p-2 border border-gray-200">ריבית שנצברה</th>
                  <th className="text-right p-2 border border-gray-200">הפקדות מצטבר</th>
                  <th className="text-right p-2 border border-gray-200">יתרה נומינלית</th>
                  <th className="text-right p-2 border border-gray-200">ערך ריאלי</th>
                  <th className="text-right p-2 border border-gray-200">אחרי מס</th>
                </tr>
              </thead>
              <tbody>
                {tableRows.map((row, i) => {
                  const isCrossover = result.crossoverYear === row.year;
                  return (
                    <tr
                      key={row.year}
                      className={`${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'} ${isCrossover ? 'ring-2 ring-inset ring-emerald-400' : ''}`}
                    >
                      <td className="p-2 border border-gray-200 font-medium">
                        {row.year}
                        {isCrossover && (
                          <span className="mr-1 text-emerald-600 text-xs">⭐ פלא</span>
                        )}
                      </td>
                      <td className="p-2 border border-gray-200 tabular-nums text-emerald-700">
                        {formatCurrency(row.interest)}
                      </td>
                      <td className="p-2 border border-gray-200 tabular-nums">
                        {formatCurrency(row.cumulativeContributions)}
                      </td>
                      <td className="p-2 border border-gray-200 tabular-nums font-bold">
                        {formatCurrency(row.balance)}
                      </td>
                      <td className="p-2 border border-gray-200 tabular-nums text-blue-700">
                        {formatCurrency(row.realBalance)}
                      </td>
                      <td className="p-2 border border-gray-200 tabular-nums text-amber-700">
                        {formatCurrency(row.afterTaxBalance)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ===== Educational Examples ===== */}
      <EducationalExamples input={input} />
    </div>
  );
}

// ============================================================
// תוצאות מצב קדימה
// ============================================================
function ForwardResults({
  result,
  input,
  inflationImpact,
  taxRate,
}: {
  result: ReturnType<typeof calculateCompoundInterest>;
  input: CompoundInterestInput;
  inflationImpact: number;
  taxRate: number;
}) {
  const profitRatio = result.totalContributions > 0
    ? result.totalInterest / result.totalContributions
    : 0;

  return (
    <>
      {/* כרטיס ראשי */}
      <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-2 border-emerald-300 rounded-xl p-5">
        <p className="text-sm font-medium text-emerald-800 mb-1">💰 סכום סופי (נומינלי)</p>
        <p className="text-4xl font-bold text-emerald-700 tabular-nums mb-1">
          {formatCurrency(result.finalAmount)}
        </p>
        <p className="text-xs text-emerald-600">אחרי {input.years} שנים</p>
      </div>

      {/* ריאלי + אחרי מס */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
          <p className="text-xs font-medium text-blue-800 mb-1">🌍 ערך ריאלי</p>
          <p className="text-xl font-bold text-blue-700 tabular-nums">
            {formatCurrency(result.realFinalAmount)}
          </p>
          <p className="text-xs text-blue-600 mt-1">
            אחרי אינפלציה {input.inflationRate}%/שנה
          </p>
          <p className="text-xs text-red-600 mt-1">
            אינפלציה &quot;אוכלת&quot;: {formatCurrency(inflationImpact)}
          </p>
        </div>

        <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-4">
          <p className="text-xs font-medium text-amber-800 mb-1">🏛️ אחרי מס 25%</p>
          <p className="text-xl font-bold text-amber-700 tabular-nums">
            {formatCurrency(result.afterTaxFinalAmount)}
          </p>
          <p className="text-xs text-amber-600 mt-1">מס על הרווח</p>
          <p className="text-xs text-red-600 mt-1">
            מס: {formatCurrency(result.taxAmount)}
          </p>
        </div>
      </div>

      {/* פירוט */}
      <div className="bg-white border-2 border-gray-200 rounded-xl p-4 space-y-2 text-sm">
        <h4 className="font-bold text-gray-900 mb-3">📊 פירוט</h4>
        <Row label="קרן ראשונית" value={formatCurrency(input.principal)} />
        {input.monthlyContribution > 0 && (
          <Row
            label={`הפקדות (${input.monthlyContribution.toLocaleString('he-IL')} ₪/ח × ${input.years * 12})`}
            value={formatCurrency(input.monthlyContribution * input.years * 12)}
          />
        )}
        <Row
          label="סך הפקדות"
          value={formatCurrency(result.totalContributions)}
          bold
        />
        <Row
          label="סך ריבית שצברת"
          value={formatCurrency(result.totalInterest)}
          color="emerald"
          bold
        />
        <Row
          label="יחס ריבית/קרן"
          value={formatPercent(profitRatio, 0)}
          color="emerald"
        />
        {taxRate > 0 && (
          <Row
            label={`מס רווחי הון (${(taxRate * 100).toFixed(0)}%)`}
            value={`-${formatCurrency(result.taxAmount)}`}
            color="red"
          />
        )}
        <div className="border-t border-gray-200 pt-2 mt-2">
          <Row
            label="סכום סופי נומינלי"
            value={formatCurrency(result.finalAmount)}
            bold
          />
          <Row
            label="ערך ריאלי (היום)"
            value={formatCurrency(result.realFinalAmount)}
            color="blue"
            bold
          />
        </div>
      </div>
    </>
  );
}

// ============================================================
// תוצאות מצב יעד
// ============================================================
function GoalResults({
  goalResult,
  input,
  goalAmount,
  goalIsReal,
}: {
  goalResult: ReturnType<typeof calculateRequiredMonthlyContribution>;
  input: CompoundInterestInput;
  goalAmount: number;
  goalIsReal: boolean;
}) {
  return (
    <>
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-300 rounded-xl p-5">
        <p className="text-sm font-medium text-blue-800 mb-1">🎯 הפקדה חודשית נדרשת</p>
        <p className="text-4xl font-bold text-blue-700 tabular-nums mb-1">
          {formatCurrency(goalResult.requiredMonthlyContribution)}
        </p>
        <p className="text-xs text-blue-600">
          כדי להגיע ל-{formatCurrency(goalAmount)}{goalIsReal ? ' (ריאלי)' : ''} בעוד {input.years} שנים
        </p>
      </div>

      <div className="bg-white border-2 border-gray-200 rounded-xl p-4 space-y-2 text-sm">
        <h4 className="font-bold text-gray-900 mb-3">📊 פירוט יעד</h4>
        <Row label="יעד" value={formatCurrency(goalAmount)} />
        {goalIsReal && (
          <Row
            label="יעד נומינלי (מותאם אינפלציה)"
            value={formatCurrency(goalResult.goalAmount)}
            color="blue"
          />
        )}
        <Row label="קרן קיימת" value={formatCurrency(input.principal)} />
        <Row label="ריבית שנתית" value={`${input.annualRate}%`} />
        <Row label="תקופה" value={`${input.years} שנים`} />
        <div className="border-t border-gray-200 pt-2 mt-2">
          <Row
            label="הפקדה חודשית נדרשת"
            value={formatCurrency(goalResult.requiredMonthlyContribution)}
            bold
            color="blue"
          />
          <Row label="סה&quot;כ הפקדות" value={formatCurrency(goalResult.totalContributions)} />
          <Row
            label="ריבית שתצבור"
            value={formatCurrency(goalResult.totalInterest)}
            color="emerald"
          />
        </div>
      </div>

      {goalResult.requiredMonthlyContribution > 10_000 && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-900">
          ⚠️ ההפקדה גבוהה — שקול להאריך את התקופה, להעלות את שיעור התשואה, או להגדיל את הקרן הראשונית.
        </div>
      )}
    </>
  );
}

// ============================================================
// דוגמאות חינוכיות
// ============================================================
function EducationalExamples({ input }: { input: CompoundInterestInput }) {
  // דוגמה 1: 25 vs 35
  const early = calculateCompoundInterest({
    principal: 0, annualRate: 7, years: 40, frequency: 'monthly',
    monthlyContribution: 500, inflationRate: 3, applyTax: false,
  });
  const late = calculateCompoundInterest({
    principal: 0, annualRate: 7, years: 30, frequency: 'monthly',
    monthlyContribution: 500, inflationRate: 3, applyTax: false,
  });

  // דוגמה 2: כפלת כסף (Rule of 72)
  const rule72years = (input.annualRate > 0) ? (72 / input.annualRate).toFixed(1) : '—';

  // דוגמה 3: 3% vs 7% vs 10% (30 שנה, 1000/ח)
  const scenario3 = calculateCompoundInterest({ principal: 0, annualRate: 3.5, years: 30, frequency: 'monthly', monthlyContribution: 1000, inflationRate: 3, applyTax: false });
  const scenario7 = calculateCompoundInterest({ principal: 0, annualRate: 7, years: 30, frequency: 'monthly', monthlyContribution: 1000, inflationRate: 3, applyTax: false });
  const scenario10 = calculateCompoundInterest({ principal: 0, annualRate: 10, years: 30, frequency: 'monthly', monthlyContribution: 1000, inflationRate: 3, applyTax: false });

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-200 rounded-xl p-5">
      <h3 className="font-bold text-gray-900 text-lg mb-4">📚 תרחישי לימוד — כוח ריבית דריבית</h3>

      <div className="grid md:grid-cols-3 gap-4">
        {/* דוגמה 1: התחלה מוקדמת */}
        <div className="bg-white rounded-xl border border-emerald-200 p-4">
          <h4 className="font-bold text-emerald-800 mb-2">⏰ מוקדם vs מאוחר</h4>
          <p className="text-xs text-gray-600 mb-3">
            500 ₪/חודש בריבית 7%, הפקדות זהות
          </p>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-700">התחיל בגיל 25 (40 שנה):</span>
              <span className="font-bold text-emerald-700 tabular-nums">
                {formatCurrency(early.finalAmount)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">התחיל בגיל 35 (30 שנה):</span>
              <span className="font-bold text-orange-700 tabular-nums">
                {formatCurrency(late.finalAmount)}
              </span>
            </div>
            <div className="border-t pt-2 flex justify-between">
              <span className="text-red-600 text-xs">ההפרש (10 שנים):</span>
              <span className="font-bold text-red-600 text-sm tabular-nums">
                -{formatCurrency(early.finalAmount - late.finalAmount)}
              </span>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            10 שנים מוקדמות = {Math.round((early.finalAmount / late.finalAmount - 1) * 100)}% יותר כסף!
          </p>
        </div>

        {/* דוגמה 2: Rule of 72 */}
        <div className="bg-white rounded-xl border border-blue-200 p-4">
          <h4 className="font-bold text-blue-800 mb-2">✕2 כלל 72</h4>
          <p className="text-xs text-gray-600 mb-3">
            בריבית {input.annualRate > 0 ? `${input.annualRate}%` : 'הנוכחית'} — כמה זמן לכפל?
          </p>
          <div className="space-y-2 text-sm">
            <div className="text-center py-3">
              <span className="text-5xl font-bold text-blue-700">
                {rule72years}
              </span>
              <p className="text-sm text-blue-600 mt-1">שנים לכפל הכסף</p>
            </div>
            <p className="text-xs text-gray-500">
              כלל 72: שנים = 72 ÷ ריבית%. זה קירוב מהיר ומדויק מאוד.
            </p>
            <div className="space-y-1 text-xs text-gray-600">
              <div>ב-3.5% (פיקדון): {(72 / 3.5).toFixed(1)} שנים</div>
              <div>ב-7% (מגוון): {(72 / 7).toFixed(1)} שנים</div>
              <div>ב-10% (S&P 500): {(72 / 10).toFixed(1)} שנים</div>
            </div>
          </div>
        </div>

        {/* דוגמה 3: 3% vs 7% vs 10% */}
        <div className="bg-white rounded-xl border border-purple-200 p-4">
          <h4 className="font-bold text-purple-800 mb-2">📈 ריבית משנה הכל</h4>
          <p className="text-xs text-gray-600 mb-3">
            1,000 ₪/חודש במשך 30 שנה
          </p>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-700">פיקדון (3.5%):</span>
              <span className="font-bold text-gray-700 tabular-nums">
                {formatCurrency(scenario3.finalAmount)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">מגוון (7%):</span>
              <span className="font-bold text-blue-700 tabular-nums">
                {formatCurrency(scenario7.finalAmount)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">S&P 500 (10%):</span>
              <span className="font-bold text-emerald-700 tabular-nums">
                {formatCurrency(scenario10.finalAmount)}
              </span>
            </div>
            <div className="border-t pt-2">
              <p className="text-xs text-emerald-700">
                הפרש S&P vs פיקדון:{' '}
                <strong>{formatCurrency(scenario10.finalAmount - scenario3.finalAmount)}</strong>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// Helper Components
// ============================================================

function Section({
  title,
  color = 'gray',
  children,
}: {
  title: React.ReactNode;
  color?: 'gray' | 'emerald' | 'blue';
  children: React.ReactNode;
}) {
  const bgMap = {
    gray: 'bg-white border-gray-200',
    emerald: 'bg-emerald-50 border-emerald-200',
    blue: 'bg-blue-50 border-blue-200',
  };
  return (
    <div className={`rounded-xl border-2 p-5 ${bgMap[color]}`}>
      <h3 className="font-bold text-gray-900 text-base mb-4">{title}</h3>
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

function Row({
  label,
  value,
  bold,
  color,
}: {
  label: string;
  value: string;
  bold?: boolean;
  color?: 'emerald' | 'blue' | 'red' | 'amber';
}) {
  const colorMap = {
    emerald: 'text-emerald-700',
    blue: 'text-blue-700',
    red: 'text-red-600',
    amber: 'text-amber-700',
  };
  const valueClass = color ? colorMap[color] : 'text-gray-900';
  return (
    <div className="flex justify-between py-0.5">
      <span className={`text-gray-600 ${bold ? 'font-bold text-gray-900' : ''}`}>{label}</span>
      <span className={`tabular-nums ${bold ? 'font-bold' : ''} ${valueClass}`}>{value}</span>
    </div>
  );
}

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
      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
        active
          ? 'bg-gray-900 text-white'
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      }`}
    >
      {children}
    </button>
  );
}
