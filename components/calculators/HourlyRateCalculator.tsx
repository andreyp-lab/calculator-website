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
  ReferenceLine,
  LineChart,
  Line,
  Legend,
} from 'recharts';

import {
  calculateHourlyRate,
  calculateRealisticBillableHours,
  calculateDetailedHourlyRate,
  calculateValueBasedRate,
  compareToSalary,
  calculatePricingTiers,
  compareToIndustryBenchmark,
  calculateVacationSickCompensation,
  INDUSTRY_RATES_2026,
  type HourlyRateInput,
  type BillableHoursInput,
  type DetailedCostInput,
  type ValueBasedInput,
  type IndustryKey,
  type BusinessType,
} from '@/lib/calculators/hourly-rate';
import { formatCurrency, formatPercent } from '@/lib/utils/formatters';

// ============================================================
// Types & Constants
// ============================================================

type MainTab = 'quick' | 'detailed' | 'value-based';
type ResultTab = 'summary' | 'breakdown' | 'benchmark' | 'tiers' | 'salary-compare';

const INDUSTRY_OPTIONS: { key: IndustryKey; label: string }[] = Object.entries(
  INDUSTRY_RATES_2026,
).map(([key, val]) => ({ key: key as IndustryKey, label: val.label }));

// ============================================================
// Default values
// ============================================================

const defaultQuickInput: HourlyRateInput = {
  monthlySalary: 18_000,
  workingHours: 160,
  billableHours: 120,
  monthlyOverhead: 5_000,
  profitMargin: 25,
  addVat: false,
  vatRate: 0.18,
};

const defaultBillableInput: BillableHoursInput = {
  vacationDays: 15,
  sickDays: 7,
  holidayDays: 9,
  adminPercent: 25,
  hoursPerDay: 8,
};

const defaultDetailedInput: Omit<DetailedCostInput, 'billableHoursMonthly'> = {
  targetMonthlySalary: 18_000,
  homeOfficeRent: 1_200,
  internetPhone: 400,
  softwareSubscriptions: 500,
  hardwareDepreciation: 300,
  healthInsurance: 400,
  professionalInsurance: 300,
  marketing: 800,
  meetingExpenses: 300,
  training: 400,
  pensionRate: 4.5,
  studyFundEnabled: false,
  businessType: 'osek-morsheh' as BusinessType,
  creditPoints: 2.25,
  profitMargin: 20,
  vatRate: 0.18,
};

const defaultValueInput: ValueBasedInput = {
  clientAnnualValue: 500_000,
  valueCapturePercent: 15,
  projectHours: 80,
};

// ============================================================
// Main Calculator
// ============================================================

export function HourlyRateCalculator() {
  // Tabs
  const [mainTab, setMainTab] = useState<MainTab>('quick');
  const [resultTab, setResultTab] = useState<ResultTab>('summary');

  // Quick mode state
  const [quickInput, setQuickInput] = useState<HourlyRateInput>(defaultQuickInput);
  const [showBillableWizard, setShowBillableWizard] = useState(false);
  const [billableInput, setBillableInput] = useState<BillableHoursInput>(defaultBillableInput);

  // Detailed mode state
  const [detailedInput, setDetailedInput] = useState(defaultDetailedInput);

  // Value-based state
  const [valueInput, setValueInput] = useState<ValueBasedInput>(defaultValueInput);

  // Benchmark
  const [selectedIndustry, setSelectedIndustry] = useState<IndustryKey>('midDeveloper');

  // ---- computations ----
  const quickResult = useMemo(() => calculateHourlyRate(quickInput), [quickInput]);

  const billableResult = useMemo(
    () => calculateRealisticBillableHours(billableInput),
    [billableInput],
  );

  const detailedFull = useMemo(() => {
    const bh = showBillableWizard
      ? billableResult.netBillableHoursPerMonth
      : quickInput.billableHours;
    return calculateDetailedHourlyRate({ ...detailedInput, billableHoursMonthly: bh });
  }, [detailedInput, showBillableWizard, billableResult, quickInput.billableHours]);

  const valueResult = useMemo(() => calculateValueBasedRate(valueInput), [valueInput]);

  // Active rate — depends on tab
  const activeRate = useMemo(() => {
    if (mainTab === 'value-based') return valueResult.impliedHourlyRate;
    if (mainTab === 'detailed') return detailedFull.requiredHourlyRate;
    return quickResult.hourlyRate;
  }, [mainTab, quickResult, detailedFull, valueResult]);

  const pricingTiers = useMemo(
    () => calculatePricingTiers(activeRate, quickInput.vatRate ?? 0.18),
    [activeRate, quickInput.vatRate],
  );

  const benchmarkResult = useMemo(
    () => compareToIndustryBenchmark(activeRate, selectedIndustry),
    [activeRate, selectedIndustry],
  );

  const salaryComparison = useMemo(() => {
    const overhead =
      mainTab === 'detailed'
        ? detailedFull.totalOverheadMonthly
        : quickInput.monthlyOverhead;
    const bh =
      showBillableWizard
        ? billableResult.netBillableHoursPerMonth
        : quickInput.billableHours;
    return compareToSalary(activeRate, bh, overhead, detailedInput.creditPoints);
  }, [activeRate, mainTab, detailedFull, quickInput, billableResult, showBillableWizard, detailedInput.creditPoints]);

  const vacationComp = useMemo(
    () =>
      calculateVacationSickCompensation(
        activeRate,
        billableInput.vacationDays,
        billableInput.sickDays,
      ),
    [activeRate, billableInput],
  );

  // Bar chart data for cost breakdown
  const costBreakdownData = useMemo(
    () =>
      detailedFull.costBreakdown.map((item) => ({
        name: item.label,
        value: Math.round(item.amount),
        fill: item.color,
      })),
    [detailedFull],
  );

  // Line chart: rate vs billable hours
  const rateVsBillableData = useMemo(() => {
    const totalCost = (quickInput.monthlySalary + quickInput.monthlyOverhead) * (1 + quickInput.profitMargin / 100);
    return [60, 80, 100, 110, 120, 130, 140, 160].map((h) => ({
      hours: `${h}ש'`,
      rate: Math.round(totalCost / h),
    }));
  }, [quickInput]);

  // Benchmark chart data
  const benchmarkChartData = useMemo(() => {
    return Object.values(INDUSTRY_RATES_2026).map((b) => ({
      name: b.label.length > 12 ? b.label.slice(0, 12) + '…' : b.label,
      min: b.min,
      max: b.max,
      mid: b.mid,
    }));
  }, []);

  function updateQuick<K extends keyof HourlyRateInput>(k: K, v: HourlyRateInput[K]) {
    setQuickInput((p) => ({ ...p, [k]: v }));
  }

  function updateBillable<K extends keyof BillableHoursInput>(k: K, v: BillableHoursInput[K]) {
    setBillableInput((p) => ({ ...p, [k]: v }));
  }

  function updateDetailed<K extends keyof typeof detailedInput>(
    k: K,
    v: (typeof detailedInput)[K],
  ) {
    setDetailedInput((p) => ({ ...p, [k]: v }));
  }

  return (
    <div className="space-y-6" dir="rtl">
      {/* ======= Main Mode Tabs ======= */}
      <div className="flex flex-wrap gap-2 bg-gray-100 rounded-xl p-1 w-fit">
        <ModeBtn active={mainTab === 'quick'} onClick={() => setMainTab('quick')} color="blue">
          מהיר — עלות + רווח
        </ModeBtn>
        <ModeBtn active={mainTab === 'detailed'} onClick={() => setMainTab('detailed')} color="emerald">
          מפורט — כל ההוצאות
        </ModeBtn>
        <ModeBtn active={mainTab === 'value-based'} onClick={() => setMainTab('value-based')} color="purple">
          ערך ללקוח
        </ModeBtn>
      </div>

      {/* ======= Input / Result Grid ======= */}
      <div className="grid lg:grid-cols-5 gap-6">
        {/* === Left: Inputs === */}
        <div className="lg:col-span-3 space-y-5">
          {/* ---------- QUICK MODE ---------- */}
          {mainTab === 'quick' && (
            <>
              <Section title="פרטי החישוב" color="blue">
                <div className="space-y-4">
                  <Field label="הכנסה חודשית רצויה (לפני מסים) — ₪" hint="כמה אתה רוצה להרוויח מהעסק">
                    <input
                      type="number" min={0} step={500}
                      value={quickInput.monthlySalary}
                      onChange={(e) => updateQuick('monthlySalary', Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    <QuickPicks
                      values={[10_000, 15_000, 18_000, 25_000, 35_000]}
                      onPick={(v) => updateQuick('monthlySalary', v)}
                      color="blue"
                    />
                  </Field>

                  <div className="grid grid-cols-2 gap-4">
                    <Field label="שעות עבודה / חודש" hint="160 = משרה מלאה">
                      <input
                        type="number" min={1} max={300} step={5}
                        value={quickInput.workingHours}
                        onChange={(e) => updateQuick('workingHours', Number(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </Field>
                    <Field label="שעות לחיוב / חודש" hint="בד״כ 60–75% מהעבודה">
                      <input
                        type="number" min={1} max={300} step={5}
                        value={quickInput.billableHours}
                        onChange={(e) => updateQuick('billableHours', Number(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </Field>
                  </div>

                  {/* Billable Wizard toggle */}
                  <button
                    type="button"
                    onClick={() => setShowBillableWizard(!showBillableWizard)}
                    className="text-xs text-blue-700 hover:underline font-medium"
                  >
                    {showBillableWizard ? '▲ סגור מחשבון שעות ריאליסטי' : '▼ חשב שעות חיוב ריאליסטיות (חופשה / מחלה / ניהול)'}
                  </button>

                  {showBillableWizard && (
                    <BillableWizard
                      input={billableInput}
                      result={billableResult}
                      onChange={updateBillable}
                      onApply={(h) => updateQuick('billableHours', Math.round(h))}
                    />
                  )}

                  <Field label="הוצאות עסק חודשיות — ₪" hint="רו״ח, ביטוחים, תוכנות, שיווק וכו׳">
                    <input
                      type="number" min={0} step={100}
                      value={quickInput.monthlyOverhead}
                      onChange={(e) => updateQuick('monthlyOverhead', Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    <QuickPicks
                      values={[2_000, 3_500, 5_000, 8_000, 12_000]}
                      onPick={(v) => updateQuick('monthlyOverhead', v)}
                      color="blue"
                    />
                  </Field>

                  <Field
                    label={`מרווח רווח: ${quickInput.profitMargin}%`}
                    hint="מינימום 25% לכיסוי חופשה, מחלה, תקופות שפל"
                  >
                    <input
                      type="range" min={0} max={100} step={5}
                      value={quickInput.profitMargin}
                      onChange={(e) => updateQuick('profitMargin', Number(e.target.value))}
                      className="w-full accent-blue-600 mt-1"
                    />
                    <div className="flex justify-between text-xs text-gray-400 mt-0.5">
                      <span>0%</span><span>25%</span><span>50%</span><span>75%</span><span>100%</span>
                    </div>
                  </Field>

                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                    <label className="flex items-center gap-2 cursor-pointer text-sm font-medium">
                      <input
                        type="checkbox"
                        checked={quickInput.addVat ?? false}
                        onChange={(e) => updateQuick('addVat', e.target.checked)}
                        className="w-4 h-4 text-blue-600"
                      />
                      הצג גם תעריף כולל מע"מ (18%)
                    </label>
                  </div>
                </div>
              </Section>

              {/* Vacation compensation callout */}
              {vacationComp.hourlyAddition > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm">
                  <p className="font-semibold text-amber-900 mb-1">שכיר מקבל ימי חופשה — עצמאי לא!</p>
                  <p className="text-amber-800">
                    {billableInput.vacationDays + billableInput.sickDays} ימי חופשה + מחלה = אובדן
                    {' '}<strong>{formatCurrency(vacationComp.annualLostRevenue)}</strong> בשנה.
                    {' '}תוספת מומלצת לתעריף:{' '}
                    <strong>{formatCurrency(vacationComp.hourlyAddition)}/שעה</strong>.
                  </p>
                </div>
              )}
            </>
          )}

          {/* ---------- DETAILED MODE ---------- */}
          {mainTab === 'detailed' && (
            <>
              <Section title="הכנסה יעד" color="emerald">
                <Field label="הכנסה חודשית רצויה (לפני מסים) — ₪">
                  <input
                    type="number" min={0} step={500}
                    value={detailedInput.targetMonthlySalary}
                    onChange={(e) => updateDetailed('targetMonthlySalary', Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  <QuickPicks
                    values={[10_000, 15_000, 20_000, 30_000, 40_000]}
                    onPick={(v) => updateDetailed('targetMonthlySalary', v)}
                    color="emerald"
                  />
                </Field>
              </Section>

              <Section title="הוצאות קבועות (חודשי)" color="blue">
                <div className="grid grid-cols-2 gap-3">
                  <SmallField label="משרד / בית (חלק) ₪" value={detailedInput.homeOfficeRent} onChange={(v) => updateDetailed('homeOfficeRent', v)} />
                  <SmallField label="אינטרנט + סלולר ₪" value={detailedInput.internetPhone} onChange={(v) => updateDetailed('internetPhone', v)} />
                  <SmallField label="מנויי תוכנה ₪" value={detailedInput.softwareSubscriptions} onChange={(v) => updateDetailed('softwareSubscriptions', v)} />
                  <SmallField label="פחת ציוד ₪" value={detailedInput.hardwareDepreciation} onChange={(v) => updateDetailed('hardwareDepreciation', v)} />
                  <SmallField label="ביטוח בריאות ₪" value={detailedInput.healthInsurance} onChange={(v) => updateDetailed('healthInsurance', v)} />
                  <SmallField label="ביטוח אחריות מקצועית ₪" value={detailedInput.professionalInsurance} onChange={(v) => updateDetailed('professionalInsurance', v)} />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  סה"כ קבועות: <strong>{formatCurrency(detailedFull.fixedCostsMonthly)}/חודש</strong>
                </p>
              </Section>

              <Section title="הוצאות משתנות (חודשי)" color="blue">
                <div className="grid grid-cols-2 gap-3">
                  <SmallField label="שיווק ופרסום ₪" value={detailedInput.marketing} onChange={(v) => updateDetailed('marketing', v)} />
                  <SmallField label="פגישות + נסיעות ₪" value={detailedInput.meetingExpenses} onChange={(v) => updateDetailed('meetingExpenses', v)} />
                  <SmallField label="קורסים + השתלמויות ₪" value={detailedInput.training} onChange={(v) => updateDetailed('training', v)} />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  סה"כ משתנות: <strong>{formatCurrency(detailedFull.variableCostsMonthly)}/חודש</strong>
                </p>
              </Section>

              <Section title="פנסיה, מסים ושעות" color="gray">
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <Field label={`פנסיה: ${detailedInput.pensionRate}%`} hint="מינימום חוקי לעצמאי: 4.5%">
                      <input
                        type="range" min={0} max={15} step={0.5}
                        value={detailedInput.pensionRate}
                        onChange={(e) => updateDetailed('pensionRate', Number(e.target.value))}
                        className="w-full accent-purple-600"
                      />
                    </Field>
                    <Field label="נקודות זיכוי" hint="גבר=2.25, אישה=2.75">
                      <input
                        type="number" min={0} max={15} step={0.25}
                        value={detailedInput.creditPoints}
                        onChange={(e) => updateDetailed('creditPoints', Number(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </Field>
                  </div>

                  <label className="flex items-center gap-2 cursor-pointer text-sm">
                    <input
                      type="checkbox"
                      checked={detailedInput.studyFundEnabled}
                      onChange={(e) => updateDetailed('studyFundEnabled', e.target.checked)}
                      className="w-4 h-4 text-purple-600"
                    />
                    קרן השתלמות (7.5%)
                  </label>

                  <Field
                    label={`מרווח רווח: ${detailedInput.profitMargin}%`}
                    hint="רזרבה לתקופות שפל + עסקות"
                  >
                    <input
                      type="range" min={0} max={100} step={5}
                      value={detailedInput.profitMargin}
                      onChange={(e) => updateDetailed('profitMargin', Number(e.target.value))}
                      className="w-full accent-emerald-600"
                    />
                  </Field>

                  <Field label="שעות חיוב / חודש">
                    <input
                      type="number" min={1} max={300} step={5}
                      value={quickInput.billableHours}
                      onChange={(e) => updateQuick('billableHours', Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowBillableWizard(!showBillableWizard)}
                      className="text-xs text-emerald-700 hover:underline mt-1"
                    >
                      {showBillableWizard ? '▲ סגור אשף' : '▼ חשב שעות ריאליסטיות'}
                    </button>
                  </Field>

                  {showBillableWizard && (
                    <BillableWizard
                      input={billableInput}
                      result={billableResult}
                      onChange={updateBillable}
                      onApply={(h) => updateQuick('billableHours', Math.round(h))}
                    />
                  )}
                </div>
              </Section>
            </>
          )}

          {/* ---------- VALUE-BASED ---------- */}
          {mainTab === 'value-based' && (
            <Section title="תמחור מבוסס ערך ללקוח" color="purple">
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 text-sm text-purple-900 mb-4">
                <strong>שיטת Value-Based:</strong> במקום לשאול "כמה עולה לי?" — שואלים "כמה שווה ללקוח?"
                גובים אחוז מהערך שאתה יוצר. רלוונטי ליועצים, מפתחים ומומחים מנוסים.
              </div>
              <div className="space-y-4">
                <Field
                  label="ערך כספי שנתי שהלקוח מרוויח — ₪"
                  hint="לדוגמה: חיסכון, גידול הכנסה, הפחתת עלויות"
                >
                  <input
                    type="number" min={0} step={10_000}
                    value={valueInput.clientAnnualValue}
                    onChange={(e) => setValueInput((p) => ({ ...p, clientAnnualValue: Number(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  <QuickPicks
                    values={[100_000, 250_000, 500_000, 1_000_000, 2_000_000]}
                    onPick={(v) => setValueInput((p) => ({ ...p, clientAnnualValue: v }))}
                    color="purple"
                    format={(v) => `${(v / 1000).toFixed(0)}K`}
                  />
                </Field>

                <Field
                  label={`אחוז לכידת ערך: ${valueInput.valueCapturePercent}%`}
                  hint="בדרך כלל 10–30% מהערך ללקוח"
                >
                  <input
                    type="range" min={1} max={50} step={1}
                    value={valueInput.valueCapturePercent}
                    onChange={(e) => setValueInput((p) => ({ ...p, valueCapturePercent: Number(e.target.value) }))}
                    className="w-full accent-purple-600"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-0.5">
                    <span>1%</span><span>10%</span><span>20%</span><span>30%</span><span>50%</span>
                  </div>
                </Field>

                <Field label="שעות שאתה משקיע בפרויקט" hint="לחישוב תעריף שעתי משתמע">
                  <input
                    type="number" min={1} step={5}
                    value={valueInput.projectHours}
                    onChange={(e) => setValueInput((p) => ({ ...p, projectHours: Number(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </Field>

                {valueResult.impliedHourlyRate > 0 && (
                  <div className={`rounded-lg p-3 text-sm ${valueResult.impliedHourlyRate > 300 ? 'bg-emerald-50 border border-emerald-200 text-emerald-900' : 'bg-amber-50 border border-amber-200 text-amber-900'}`}>
                    <p className="font-semibold mb-1">פירוש:</p>
                    <p>ערך ללקוח: <strong>{formatCurrency(valueResult.projectValue)}/שנה</strong></p>
                    <p>מה שאתה לוקח: <strong>{formatCurrency(valueResult.capturedValue)}</strong></p>
                    <p className="mt-1 text-xs">{valueResult.comparison}</p>
                  </div>
                )}
              </div>
            </Section>
          )}
        </div>

        {/* === Right: Results === */}
        <div className="lg:col-span-2 space-y-4">
          {/* Primary Result Card */}
          <PrimaryResultCard
            mainTab={mainTab}
            quickResult={quickResult}
            detailedResult={detailedFull}
            valueResult={valueResult}
            addVat={quickInput.addVat}
            vatRate={quickInput.vatRate ?? 0.18}
          />

          {/* Warning */}
          {mainTab === 'quick' && !quickResult.isValid && quickResult.warning && (
            <div className="bg-amber-50 border-2 border-amber-300 rounded-lg p-3 text-sm text-amber-900">
              {quickResult.warning}
            </div>
          )}

          {/* Quick summary breakdown */}
          {mainTab === 'quick' && (
            <div className="bg-white border-2 border-gray-200 rounded-xl p-4 text-sm space-y-1.5">
              <h4 className="font-bold text-gray-900 mb-2">פירוט</h4>
              <Row label="עלות בסיס לשעה" value={formatCurrency(quickResult.baseCostPerHour)} />
              <Row label="רווח לשעה" value={`+${formatCurrency(quickResult.profitPerHour)}`} color="emerald" />
              <div className="border-t pt-1.5">
                <Row label="תעריף שעתי" value={formatCurrency(quickResult.hourlyRate)} bold />
              </div>
              {quickInput.addVat && (
                <Row label='+ מע"מ 18%' value={formatCurrency(quickResult.hourlyRateWithVat)} color="blue" />
              )}
              <div className="border-t pt-1.5">
                <Row label="תעריף יומי (8ש׳)" value={formatCurrency(quickResult.dailyRate)} />
                <Row label="הכנסה חודשית מקסימלית" value={formatCurrency(quickResult.monthlyRevenue)} />
                <Row label="רווח חודשי" value={formatCurrency(quickResult.monthlyProfit)} color={quickResult.monthlyProfit >= 0 ? 'emerald' : 'red'} />
                <Row label="ניצול שעות" value={`${quickResult.utilizationRate.toFixed(0)}%`} />
              </div>
            </div>
          )}

          {/* Detailed summary */}
          {mainTab === 'detailed' && (
            <div className="bg-white border-2 border-gray-200 rounded-xl p-4 text-sm space-y-1.5">
              <h4 className="font-bold text-gray-900 mb-2">פירוט עלויות חודשי</h4>
              <Row label="שכר לעצמי" value={formatCurrency(detailedInput.targetMonthlySalary)} />
              <Row label="הוצאות קבועות" value={formatCurrency(detailedFull.fixedCostsMonthly)} />
              <Row label="הוצאות משתנות" value={formatCurrency(detailedFull.variableCostsMonthly)} />
              <Row label="מס הכנסה (מוערך)" value={formatCurrency(detailedFull.estimatedTaxMonthly)} color="red" />
              <Row label="ביטוח לאומי" value={formatCurrency(detailedFull.socialSecurityMonthly)} color="amber" />
              <Row label="פנסיה" value={formatCurrency(detailedFull.pensionMonthly)} color="blue" />
              {detailedFull.studyFundMonthly > 0 && (
                <Row label="קרן השתלמות" value={formatCurrency(detailedFull.studyFundMonthly)} color="blue" />
              )}
              <div className="border-t pt-1.5">
                <Row label="סה״כ עלות" value={formatCurrency(detailedFull.totalCostMonthly)} bold />
                <Row label="הכנסה נדרשת (עם רווח)" value={formatCurrency(detailedFull.requiredRevenueMonthly)} bold color="emerald" />
              </div>
              <p className="text-xs text-gray-500 pt-1">
                שיעור מס אפקטיבי: {(detailedFull.effectiveTaxRate * 100).toFixed(1)}%
              </p>
            </div>
          )}

          {/* Industry picker */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <label className="block text-sm font-semibold text-blue-900 mb-2">
              בנצ'מארק לפי תחום
            </label>
            <select
              value={selectedIndustry}
              onChange={(e) => setSelectedIndustry(e.target.value as IndustryKey)}
              className="w-full px-3 py-2 border border-blue-300 rounded-lg text-sm bg-white"
            >
              {INDUSTRY_OPTIONS.map((o) => (
                <option key={o.key} value={o.key}>{o.label}</option>
              ))}
            </select>
            <div className="mt-2 text-xs text-blue-800">
              <span className="font-medium">{INDUSTRY_RATES_2026[selectedIndustry].label}:</span>{' '}
              {INDUSTRY_RATES_2026[selectedIndustry].min}–{INDUSTRY_RATES_2026[selectedIndustry].max} ₪/שעה
            </div>
            <BenchmarkBar
              userRate={activeRate}
              min={INDUSTRY_RATES_2026[selectedIndustry].min}
              max={INDUSTRY_RATES_2026[selectedIndustry].max}
              mid={INDUSTRY_RATES_2026[selectedIndustry].mid}
            />
            <p className={`text-xs mt-2 font-medium ${benchmarkResult.percentile === 'below' ? 'text-red-700' : benchmarkResult.percentile === 'premium' ? 'text-purple-700' : 'text-blue-800'}`}>
              {benchmarkResult.percentileLabel}
            </p>
          </div>
        </div>
      </div>

      {/* ======= Result Tabs (full width) ======= */}
      <div className="bg-white border-2 border-gray-200 rounded-xl p-5">
        <div className="flex flex-wrap gap-2 mb-5">
          <TabBtn active={resultTab === 'summary'} onClick={() => setResultTab('summary')}>סיכום</TabBtn>
          <TabBtn active={resultTab === 'breakdown'} onClick={() => setResultTab('breakdown')}>פירוט עלויות</TabBtn>
          <TabBtn active={resultTab === 'benchmark'} onClick={() => setResultTab('benchmark')}>תעריפי שוק</TabBtn>
          <TabBtn active={resultTab === 'tiers'} onClick={() => setResultTab('tiers')}>מחיר לפי לקוח</TabBtn>
          <TabBtn active={resultTab === 'salary-compare'} onClick={() => setResultTab('salary-compare')}>השוואה לשכיר</TabBtn>
        </div>

        {/* ---- Summary Tab ---- */}
        {resultTab === 'summary' && (
          <div>
            <h3 className="font-bold text-gray-900 mb-3">כמה שעות חיוב ריאליסטי?</h3>
            <p className="text-sm text-gray-600 mb-4">
              פרילנסרים רבים מניחים 160 שעות × 12 חודש = 1,920 שעות/שנה. המציאות שונה.
            </p>
            <div className="grid md:grid-cols-3 gap-4 mb-5">
              <InfoCard
                title="הנחה נאיבית"
                value="1,920 ש׳/שנה"
                subtitle="160ש׳ × 12 חודש"
                color="gray"
              />
              <InfoCard
                title="ריאליסטי"
                value={`${Math.round(billableResult.netBillableHoursPerYear)} ש׳/שנה`}
                subtitle={`${Math.round(billableResult.netBillableHoursPerMonth)} ש׳/חודש`}
                color="blue"
              />
              <InfoCard
                title="הפרש!"
                value={`-${billableResult.comparisonToNaive} ש׳/שנה`}
                subtitle={`ניצול ${billableResult.utilizationPercent.toFixed(0)}%`}
                color="amber"
              />
            </div>

            {/* Rate vs Billable Hours Chart */}
            <h3 className="font-bold text-gray-900 mb-2">תעריף לפי שעות חיוב</h3>
            <p className="text-xs text-gray-500 mb-3">ככל שפחות שעות חיוב — התעריף חייב לעלות</p>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={rateVsBillableData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hours" tick={{ fontSize: 11 }} />
                  <YAxis tickFormatter={(v) => `${v}₪`} tick={{ fontSize: 11 }} width={55} />
                  <Tooltip formatter={(v) => formatCurrency(Number(v))} />
                  <Line type="monotone" dataKey="rate" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} name="תעריף שעתי" />
                  <ReferenceLine
                    x={`${Math.round(quickInput.billableHours)}ש'`}
                    stroke="#ef4444"
                    strokeDasharray="4 2"
                    label={{ value: 'נוכחי', fill: '#ef4444', fontSize: 11 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* ---- Breakdown Tab ---- */}
        {resultTab === 'breakdown' && (
          <div>
            <h3 className="font-bold text-gray-900 mb-2">פירוט עלויות חודשי (מצב מפורט)</h3>
            {mainTab !== 'detailed' && (
              <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded p-2 mb-4">
                עבור לטאב &quot;מפורט&quot; לפירוט מלא של הוצאות ומסים.
              </p>
            )}
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={costBreakdownData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} tick={{ fontSize: 10 }} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={110} />
                  <Tooltip formatter={(v) => formatCurrency(Number(v))} />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {costBreakdownData.map((entry, i) => (
                      <Cell key={i} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Table */}
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-right p-2 border border-gray-200">רכיב</th>
                    <th className="text-right p-2 border border-gray-200">חודשי</th>
                    <th className="text-right p-2 border border-gray-200">שנתי</th>
                    <th className="text-right p-2 border border-gray-200">% מהסה"כ</th>
                  </tr>
                </thead>
                <tbody>
                  {detailedFull.costBreakdown.map((item, i) => (
                    <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="p-2 border border-gray-200">
                        <span className="inline-block w-2 h-2 rounded-full ml-1" style={{ backgroundColor: item.color }} />
                        {item.label}
                      </td>
                      <td className="p-2 border border-gray-200 tabular-nums">{formatCurrency(item.amount)}</td>
                      <td className="p-2 border border-gray-200 tabular-nums">{formatCurrency(item.amount * 12)}</td>
                      <td className="p-2 border border-gray-200 tabular-nums">
                        {detailedFull.totalCostMonthly > 0
                          ? ((item.amount / detailedFull.totalCostMonthly) * 100).toFixed(1) + '%'
                          : '—'}
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-emerald-50 font-bold">
                    <td className="p-2 border border-gray-200">סה"כ</td>
                    <td className="p-2 border border-gray-200 tabular-nums text-emerald-700">{formatCurrency(detailedFull.totalCostMonthly)}</td>
                    <td className="p-2 border border-gray-200 tabular-nums text-emerald-700">{formatCurrency(detailedFull.totalCostMonthly * 12)}</td>
                    <td className="p-2 border border-gray-200">100%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ---- Benchmark Tab ---- */}
        {resultTab === 'benchmark' && (
          <div>
            <h3 className="font-bold text-gray-900 mb-2">תעריפי שוק 2026 — ישראל (₪/שעה)</h3>
            <p className="text-xs text-gray-500 mb-4">
              הקו האדום הוא התעריף שלך ({formatCurrency(activeRate)}/שעה)
            </p>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={benchmarkChartData} margin={{ top: 5, right: 10, left: 0, bottom: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 10 }}
                    angle={-30}
                    textAnchor="end"
                    interval={0}
                  />
                  <YAxis tickFormatter={(v) => `${v}₪`} tick={{ fontSize: 10 }} width={45} />
                  <Tooltip formatter={(v) => `${v} ₪/שעה`} />
                  <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
                  <Bar dataKey="min" name="מינימום" fill="#93c5fd" stackId="range" />
                  <Bar dataKey="max" name="מקסימום" fill="#3b82f6" stackId="range" radius={[4, 4, 0, 0]} />
                  <ReferenceLine y={activeRate} stroke="#ef4444" strokeWidth={2} strokeDasharray="5 3" label={{ value: 'התעריף שלך', fill: '#ef4444', fontSize: 11 }} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Benchmark recommendation */}
            <div className={`mt-4 rounded-lg p-4 text-sm ${
              benchmarkResult.percentile === 'below' ? 'bg-red-50 border border-red-200 text-red-900'
              : benchmarkResult.percentile === 'premium' ? 'bg-purple-50 border border-purple-200 text-purple-900'
              : 'bg-blue-50 border border-blue-200 text-blue-900'
            }`}>
              <p className="font-semibold mb-1">
                {INDUSTRY_RATES_2026[selectedIndustry].label}: {benchmarkResult.percentileLabel}
              </p>
              <p>{benchmarkResult.recommendation}</p>
            </div>
          </div>
        )}

        {/* ---- Tiers Tab ---- */}
        {resultTab === 'tiers' && (
          <div>
            <h3 className="font-bold text-gray-900 mb-2">מחיר לפי סוג לקוח / פרויקט</h3>
            <p className="text-xs text-gray-500 mb-4">בסיס: {formatCurrency(activeRate)}/שעה</p>
            <div className="grid md:grid-cols-2 gap-3">
              <TierCard
                label="לקוח חדש (סטנדרט)"
                rate={pricingTiers.newClient}
                rateVat={pricingTiers.withVat.newClient}
                badge="בסיס"
                color="blue"
                note="תעריף סטנדרטי"
              />
              <TierCard
                label="לקוח חוזר"
                rate={pricingTiers.repeatClient}
                rateVat={pricingTiers.withVat.repeatClient}
                badge="-15%"
                color="emerald"
                note="הנחת נאמנות"
              />
              <TierCard
                label="עבודה דחופה"
                rate={pricingTiers.rushJob}
                rateVat={pricingTiers.withVat.rushJob}
                badge="+25%"
                color="amber"
                note="תוספת דחיפות"
              />
              <TierCard
                label="רטיינר ארוך טווח"
                rate={pricingTiers.longRetainer}
                rateVat={pricingTiers.withVat.longRetainer}
                badge="-10%"
                color="teal"
                note="הנחת יציבות"
              />
              <TierCard
                label="עבודה אסטרטגית / Value"
                rate={pricingTiers.strategicWork}
                rateVat={pricingTiers.withVat.strategicWork}
                badge="+50%"
                color="purple"
                note="תמחור לפי ערך"
              />
            </div>

            <div className="mt-4 bg-gray-50 border border-gray-200 rounded-lg p-3 text-xs text-gray-700">
              <strong>טיפ:</strong> הצג ללקוחות 2–3 חבילות תמחור — Standard / Premium / Enterprise.
              מחקרים מראים שהוספת חבילה יקרה מעלה את שיעור הרכישה של החבילה הבינונית ב-20–35%.
            </div>
          </div>
        )}

        {/* ---- Salary Compare Tab ---- */}
        {resultTab === 'salary-compare' && (
          <div>
            <h3 className="font-bold text-gray-900 mb-3">
              מה שווה {formatCurrency(activeRate)}/שעה כשכיר?
            </h3>
            <div className="grid md:grid-cols-3 gap-4 mb-5">
              <InfoCard
                title="עצמאי — נטו חודשי"
                value={formatCurrency(salaryComparison.selfEmployedNetMonthly)}
                subtitle="לאחר מסים, ב.ל., פנסיה"
                color={salaryComparison.advantage >= 0 ? 'emerald' : 'red'}
              />
              <InfoCard
                title="שכיר שווה-ערך — ברוטו"
                value={formatCurrency(salaryComparison.equivalentEmployeeSalaryGross)}
                subtitle="עלות מעסיק שקולה"
                color="blue"
              />
              <InfoCard
                title="שכיר שווה-ערך — נטו"
                value={formatCurrency(salaryComparison.equivalentEmployeeSalaryNet)}
                subtitle="הערכה — לפי נוסחה גסה"
                color="gray"
              />
            </div>

            <div className={`rounded-lg p-4 text-sm mb-4 ${
              salaryComparison.advantage >= 0
                ? 'bg-emerald-50 border border-emerald-200 text-emerald-900'
                : 'bg-red-50 border border-red-200 text-red-900'
            }`}>
              {salaryComparison.advantage >= 0 ? (
                <>
                  <strong>עצמאי מרוויח יותר!</strong> יתרון עצמאי: {' '}
                  <strong>{formatCurrency(salaryComparison.advantage)}/חודש</strong> מעל שכיר שקול.
                </>
              ) : (
                <>
                  <strong>שכיר מרוויח יותר נטו</strong> בתעריף זה. שקול להעלות ל-{formatCurrency(salaryComparison.breakEvenHourlyRate)}/שעה.
                </>
              )}
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm space-y-2">
              <h4 className="font-semibold text-gray-900">מה העצמאי משלם שהשכיר לא?</h4>
              <ul className="space-y-1 text-gray-700 text-xs">
                <li>• ביטוח לאומי מלא (12.5% + בריאות 5%) — במקום 3.5%+2.5% של שכיר</li>
                <li>• פנסיה מהכיס שלו (אין הפרשת מעסיק)</li>
                <li>• ימי חופשה ומחלה — אין שכר</li>
                <li>• הוצאות עסק (תוכנה, ציוד, שיווק)</li>
                <li>• ביטוח אחריות מקצועית</li>
                <li>• אין בונוסים, רכב חברה, נסיעות מעסיק</li>
              </ul>
              <p className="text-xs text-gray-500 pt-1">
                נקודת שיווי-משקל: <strong>{formatCurrency(salaryComparison.breakEvenHourlyRate)}/שעה</strong> — מתחת לזה שכיר עדיף נטו.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================
// Sub-Components
// ============================================================

function BillableWizard({
  input,
  result,
  onChange,
  onApply,
}: {
  input: BillableHoursInput;
  result: ReturnType<typeof calculateRealisticBillableHours>;
  onChange: <K extends keyof BillableHoursInput>(k: K, v: BillableHoursInput[K]) => void;
  onApply: (hours: number) => void;
}) {
  return (
    <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
      <h4 className="font-bold text-blue-900 mb-3 text-sm">מחשבון שעות חיוב ריאליסטי</h4>
      <div className="grid grid-cols-2 gap-3 mb-3">
        <SmallField
          label="ימי חופשה / שנה"
          value={input.vacationDays}
          onChange={(v) => onChange('vacationDays', v)}
        />
        <SmallField
          label="ימי מחלה / שנה"
          value={input.sickDays}
          onChange={(v) => onChange('sickDays', v)}
        />
        <SmallField
          label="ימי חג / שנה"
          value={input.holidayDays ?? 9}
          onChange={(v) => onChange('holidayDays', v)}
        />
        <SmallField
          label="% ניהול + שיווק"
          value={input.adminPercent}
          onChange={(v) => onChange('adminPercent', v)}
          max={60}
        />
      </div>

      <div className="bg-white rounded-lg p-3 text-xs space-y-1 mb-3">
        <div className="flex justify-between">
          <span className="text-gray-600">ימי עבודה גולמי:</span>
          <span className="font-medium">{result.grossWorkingDays} ימים</span>
        </div>
        <div className="flex justify-between text-red-700">
          <span>- חופשה + מחלה + חג:</span>
          <span className="font-medium">-{result.vacationDays + result.sickDays + result.holidayDays} ימים</span>
        </div>
        <div className="flex justify-between text-amber-700">
          <span>- ניהול / שיווק:</span>
          <span className="font-medium">-{result.nonBillableAdminDays} ימים</span>
        </div>
        <div className="flex justify-between font-bold text-blue-900 border-t pt-1">
          <span>ימי חיוב נטו:</span>
          <span>{result.netBillableDays} ימים/שנה</span>
        </div>
        <div className="flex justify-between font-bold text-blue-900">
          <span>שעות חיוב:</span>
          <span>{result.netBillableHoursPerYear} ש׳/שנה</span>
        </div>
        <div className="flex justify-between font-bold text-blue-900">
          <span>ממוצע חודשי:</span>
          <span>{result.netBillableHoursPerMonth} ש׳/חודש</span>
        </div>
      </div>

      <button
        type="button"
        onClick={() => onApply(result.netBillableHoursPerMonth)}
        className="w-full bg-blue-600 text-white text-sm font-medium py-2 rounded-lg hover:bg-blue-700 transition"
      >
        החל {result.netBillableHoursPerMonth} ש׳/חודש על המחשבון
      </button>
    </div>
  );
}

function PrimaryResultCard({
  mainTab,
  quickResult,
  detailedResult,
  valueResult,
  addVat,
  vatRate,
}: {
  mainTab: MainTab;
  quickResult: ReturnType<typeof calculateHourlyRate>;
  detailedResult: ReturnType<typeof calculateDetailedHourlyRate>;
  valueResult: ReturnType<typeof calculateValueBasedRate>;
  addVat?: boolean;
  vatRate: number;
}) {
  if (mainTab === 'value-based') {
    return (
      <div className="bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-300 rounded-xl p-5">
        <p className="text-sm font-medium text-purple-800 mb-1">תעריף שעתי משתמע (Value-Based)</p>
        <p className="text-4xl font-bold text-purple-700 tabular-nums">
          {formatCurrency(valueResult.impliedHourlyRate)}
          <span className="text-lg font-normal">/שעה</span>
        </p>
        <p className="text-sm text-purple-600 mt-1">
          כולל מע"מ: {formatCurrency(valueResult.impliedHourlyRateWithVat)}
        </p>
      </div>
    );
  }

  if (mainTab === 'detailed') {
    return (
      <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-2 border-emerald-300 rounded-xl p-5">
        <p className="text-sm font-medium text-emerald-800 mb-1">תעריף שעתי נדרש (מפורט)</p>
        <p className="text-4xl font-bold text-emerald-700 tabular-nums">
          {formatCurrency(detailedResult.requiredHourlyRate)}
          <span className="text-lg font-normal">/שעה</span>
        </p>
        <p className="text-sm text-emerald-600 mt-1">
          כולל מע"מ: {formatCurrency(detailedResult.requiredHourlyRateWithVat)}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-300 rounded-xl p-5">
      <p className="text-sm font-medium text-blue-800 mb-1">תעריף שעתי מומלץ</p>
      <p className="text-4xl font-bold text-blue-700 tabular-nums">
        {formatCurrency(quickResult.hourlyRate)}
        <span className="text-lg font-normal">/שעה</span>
      </p>
      {addVat && (
        <p className="text-sm text-blue-600 mt-1">
          כולל מע"מ: {formatCurrency(quickResult.hourlyRate * (1 + vatRate))}
        </p>
      )}
    </div>
  );
}

function BenchmarkBar({
  userRate,
  min,
  max,
  mid,
}: {
  userRate: number;
  min: number;
  max: number;
  mid: number;
}) {
  const range = max - min || 1;
  const userPos = Math.max(0, Math.min(100, ((userRate - min) / range) * 100));
  const midPos = ((mid - min) / range) * 100;

  return (
    <div className="mt-2">
      <div className="relative h-4 bg-gray-200 rounded-full overflow-visible">
        <div
          className="absolute top-0 left-0 h-4 bg-blue-300 rounded-full"
          style={{ width: '100%' }}
        />
        <div
          className="absolute top-0 h-4 w-0.5 bg-blue-600"
          style={{ left: `${midPos}%` }}
          title="ממוצע"
        />
        <div
          className="absolute top-0 h-4 w-1.5 bg-red-500 rounded-full"
          style={{ left: `${userPos}%`, transform: 'translateX(-50%)' }}
          title="התעריף שלך"
        />
      </div>
      <div className="flex justify-between text-xs text-gray-500 mt-1">
        <span>{min}₪</span>
        <span>{mid}₪ ממוצע</span>
        <span>{max}₪</span>
      </div>
    </div>
  );
}

function TierCard({
  label,
  rate,
  rateVat,
  badge,
  color,
  note,
}: {
  label: string;
  rate: number;
  rateVat: number;
  badge: string;
  color: 'blue' | 'emerald' | 'amber' | 'teal' | 'purple';
  note: string;
}) {
  const colorMap = {
    blue: 'bg-blue-50 border-blue-200 text-blue-900',
    emerald: 'bg-emerald-50 border-emerald-200 text-emerald-900',
    amber: 'bg-amber-50 border-amber-200 text-amber-900',
    teal: 'bg-teal-50 border-teal-200 text-teal-900',
    purple: 'bg-purple-50 border-purple-200 text-purple-900',
  };
  const badgeMap = {
    blue: 'bg-blue-200 text-blue-800',
    emerald: 'bg-emerald-200 text-emerald-800',
    amber: 'bg-amber-200 text-amber-800',
    teal: 'bg-teal-200 text-teal-800',
    purple: 'bg-purple-200 text-purple-800',
  };

  return (
    <div className={`border-2 rounded-xl p-4 ${colorMap[color]}`}>
      <div className="flex justify-between items-start mb-1">
        <span className="text-sm font-semibold">{label}</span>
        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${badgeMap[color]}`}>{badge}</span>
      </div>
      <p className="text-2xl font-bold tabular-nums">{formatCurrency(rate)}<span className="text-sm font-normal">/ש׳</span></p>
      <p className="text-xs opacity-70 mt-0.5">כולל מע"מ: {formatCurrency(rateVat)}</p>
      <p className="text-xs mt-1 opacity-80">{note}</p>
    </div>
  );
}

function InfoCard({
  title,
  value,
  subtitle,
  color,
}: {
  title: string;
  value: string;
  subtitle?: string;
  color: 'blue' | 'emerald' | 'amber' | 'gray' | 'red';
}) {
  const colorMap = {
    blue: 'bg-blue-50 border-blue-200 text-blue-700',
    emerald: 'bg-emerald-50 border-emerald-200 text-emerald-700',
    amber: 'bg-amber-50 border-amber-200 text-amber-700',
    gray: 'bg-gray-50 border-gray-200 text-gray-700',
    red: 'bg-red-50 border-red-200 text-red-700',
  };
  return (
    <div className={`border-2 rounded-xl p-4 ${colorMap[color].split(' ').slice(0, 2).join(' ')}`}>
      <p className="text-xs font-medium text-gray-600 mb-1">{title}</p>
      <p className={`text-xl font-bold tabular-nums ${colorMap[color].split(' ')[2]}`}>{value}</p>
      {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
    </div>
  );
}

// ============================================================
// Primitive helpers
// ============================================================

function Section({
  title,
  color = 'gray',
  children,
}: {
  title: string;
  color?: 'gray' | 'emerald' | 'blue' | 'purple';
  children: React.ReactNode;
}) {
  const map = {
    gray: 'bg-white border-gray-200',
    emerald: 'bg-emerald-50 border-emerald-200',
    blue: 'bg-blue-50 border-blue-200',
    purple: 'bg-purple-50 border-purple-200',
  };
  return (
    <div className={`rounded-xl border-2 p-5 ${map[color]}`}>
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
      {hint && <p className="text-xs text-gray-500 mt-0.5">{hint}</p>}
    </div>
  );
}

function SmallField({
  label,
  value,
  onChange,
  min = 0,
  max = 99_999,
  step = 50,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
      <input
        type="number"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full px-2 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}

function QuickPicks({
  values,
  onPick,
  color,
  format,
}: {
  values: number[];
  onPick: (v: number) => void;
  color: 'blue' | 'emerald' | 'purple';
  format?: (v: number) => string;
}) {
  const colorMap = {
    blue: 'bg-blue-100 text-blue-800 hover:bg-blue-200',
    emerald: 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200',
    purple: 'bg-purple-100 text-purple-800 hover:bg-purple-200',
  };
  return (
    <div className="flex flex-wrap gap-1 mt-1.5">
      {values.map((v) => (
        <button
          key={v}
          type="button"
          onClick={() => onPick(v)}
          className={`text-xs px-2 py-0.5 rounded transition ${colorMap[color]}`}
        >
          {format ? format(v) : v.toLocaleString('he-IL')}
        </button>
      ))}
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

function ModeBtn({
  active,
  onClick,
  color,
  children,
}: {
  active: boolean;
  onClick: () => void;
  color: 'blue' | 'emerald' | 'purple';
  children: React.ReactNode;
}) {
  const activeMap = {
    blue: 'bg-white text-blue-700 shadow font-bold',
    emerald: 'bg-white text-emerald-700 shadow font-bold',
    purple: 'bg-white text-purple-700 shadow font-bold',
  };
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
        active ? activeMap[color] : 'text-gray-600 hover:text-gray-900'
      }`}
    >
      {children}
    </button>
  );
}

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
      type="button"
      onClick={onClick}
      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
        active ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      }`}
    >
      {children}
    </button>
  );
}
