'use client';

import { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import {
  calculateSalaryNetGross,
  calculateGrossFromNet,
  calculateNetFromEmployerCost,
  calculateYearComparison,
  calculateBonusNet,
  calculateCreditPoints,
  calculateSalaryCurve,
  PENSION_RATES,
  type SalaryNetGrossInput,
  type CalculatorMode,
  type TaxYear,
  type PensionLevel,
  type CreditPointsProfile,
} from '@/lib/calculators/salary-net-gross';
import { formatCurrency, formatPercent } from '@/lib/utils/formatters';

// ============================================================
// ערכי ברירת מחדל
// ============================================================

const defaultOptions: Omit<SalaryNetGrossInput, 'grossSalary'> = {
  creditPoints: 2.25,
  pensionEnabled: true,
  pensionLevel: 'minimum',
  studyFundEnabled: false,
  disabilityInsuranceRate: 0,
  monthlyWorkHours: 182,
  taxYear: '2026',
};

const defaultProfile: CreditPointsProfile = {
  gender: 'male',
  childrenAge0: 0,
  childrenAge1to5: 0,
  childrenAge6to17: 0,
  childrenAge18: 0,
  singleParent: false,
  disabledChildren: 0,
  newImmigrantYears: 0,
  releasedSoldier: false,
  bachelorDegree: false,
  masterDegree: false,
};

type ChartView = 'pie' | 'bar' | 'curve';

// ============================================================
// קומפוננטה ראשית
// ============================================================

export function SalaryNetGrossCalculator() {
  // מצב: מצב חישוב
  const [mode, setMode] = useState<CalculatorMode>('gross-to-net');

  // קלט מספרי לפי מצב
  const [grossInput, setGrossInput] = useState(15_000);
  const [netInput, setNetInput] = useState(12_000);
  const [employerCostInput, setEmployerCostInput] = useState(25_000);

  // אפשרויות משותפות
  const [opts, setOpts] = useState(defaultOptions);

  // תצוגות נוספות
  const [showYearCompare, setShowYearCompare] = useState(false);
  const [showBonus, setShowBonus] = useState(false);
  const [showCreditWizard, setShowCreditWizard] = useState(false);
  const [bonusAmount, setBonusAmount] = useState(10_000);
  const [creditProfile, setCreditProfile] = useState<CreditPointsProfile>(defaultProfile);
  const [chartView, setChartView] = useState<ChartView>('pie');

  function updateOpts<K extends keyof typeof opts>(k: K, v: (typeof opts)[K]) {
    setOpts((p) => ({ ...p, [k]: v }));
  }

  // חישוב ראשי
  const mainResult = useMemo(() => {
    if (mode === 'gross-to-net') {
      return calculateSalaryNetGross({ ...opts, grossSalary: grossInput });
    } else if (mode === 'net-to-gross') {
      return calculateGrossFromNet(netInput, opts).result;
    } else {
      return calculateNetFromEmployerCost(employerCostInput, opts).result;
    }
  }, [mode, grossInput, netInput, employerCostInput, opts]);

  // השוואת שנים
  const yearComparison = useMemo(
    () =>
      showYearCompare
        ? calculateYearComparison({ ...opts, grossSalary: mainResult.grossSalary }, ['2024', '2025', '2026'])
        : null,
    [showYearCompare, opts, mainResult.grossSalary],
  );

  // בונוס
  const bonusResult = useMemo(
    () =>
      showBonus
        ? calculateBonusNet(bonusAmount, mainResult.annualGross, opts)
        : null,
    [showBonus, bonusAmount, mainResult.annualGross, opts],
  );

  // נקודות זיכוי
  const creditResult = useMemo(
    () => (showCreditWizard ? calculateCreditPoints(creditProfile) : null),
    [showCreditWizard, creditProfile],
  );

  // עקומת שכר
  const salaryCurve = useMemo(
    () =>
      chartView === 'curve'
        ? calculateSalaryCurve(opts)
        : null,
    [chartView, opts],
  );

  // נתוני Pie
  const pieData = useMemo(() => {
    const r = mainResult;
    const data = [
      { name: 'נטו (לכיס)', value: Math.round(r.netSalary), color: '#10b981' },
      { name: 'מס הכנסה', value: Math.round(r.incomeTax), color: '#ef4444' },
      { name: 'ב.ל. + בריאות', value: Math.round(r.socialSecurity), color: '#f59e0b' },
    ];
    if (r.pensionDeduction > 0)
      data.push({ name: 'פנסיה', value: Math.round(r.pensionDeduction), color: '#3b82f6' });
    if (r.studyFundDeduction > 0)
      data.push({ name: 'קרן השתלמות', value: Math.round(r.studyFundDeduction), color: '#8b5cf6' });
    if (r.disabilityInsurance > 0)
      data.push({ name: 'אובדן כושר', value: Math.round(r.disabilityInsurance), color: '#6b7280' });
    return data.filter((d) => d.value > 0);
  }, [mainResult]);

  // נתוני Bar (comparison)
  const barData = useMemo(() => {
    const r = mainResult;
    return [
      { name: 'ברוטו', value: Math.round(r.grossSalary), fill: '#6b7280' },
      { name: 'נטו לעובד', value: Math.round(r.netSalary), fill: '#10b981' },
      { name: 'עלות מעסיק', value: Math.round(r.totalEmployerCost), fill: '#3b82f6' },
    ];
  }, [mainResult]);

  const r = mainResult;
  const gross = r.grossSalary;

  return (
    <div className="space-y-6" dir="rtl">
      {/* ===== Mode Toggle ===== */}
      <div className="flex flex-wrap gap-2 bg-gray-100 rounded-xl p-1 w-fit">
        <ModeButton active={mode === 'gross-to-net'} onClick={() => setMode('gross-to-net')} color="emerald">
          ברוטו → נטו
        </ModeButton>
        <ModeButton active={mode === 'net-to-gross'} onClick={() => setMode('net-to-gross')} color="blue">
          נטו → ברוטו
        </ModeButton>
        <ModeButton active={mode === 'employer-to-net'} onClick={() => setMode('employer-to-net')} color="purple">
          עלות מעסיק → נטו
        </ModeButton>
      </div>

      {mode === 'net-to-gross' && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-900">
          <strong>מצב הפוך:</strong> הכנס את הנטו שאתה רוצה לקבל — המחשבון ימצא את הברוטו הדרוש
        </div>
      )}
      {mode === 'employer-to-net' && (
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 text-sm text-purple-900">
          <strong>מצב מעסיק:</strong> הכנס את עלות המעסיק הכוללת — המחשבון יחשב את ברוטו העובד ואת הנטו שלו
        </div>
      )}

      {/* ===== Main Grid ===== */}
      <div className="grid lg:grid-cols-5 gap-6">
        {/* === Form === */}
        <div className="lg:col-span-3 space-y-5">

          {/* קלט ראשי */}
          <Section title="פרטי השכר" color="emerald">
            <div className="space-y-4">

              {mode === 'gross-to-net' && (
                <Field label="שכר ברוטו חודשי (₪)" hint="השכר שמופיע בתלוש — לפני כל הניכויים">
                  <input
                    type="number"
                    min={0}
                    step={500}
                    value={grossInput}
                    onChange={(e) => setGrossInput(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-lg focus:ring-2 focus:ring-emerald-500"
                  />
                  {/* Quick-picks */}
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {[6_444, 10_000, 15_000, 20_000, 30_000, 50_000].map((v) => (
                      <button
                        key={v}
                        type="button"
                        onClick={() => setGrossInput(v)}
                        className="text-xs px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded hover:bg-emerald-200 transition"
                      >
                        {(v / 1000).toFixed(v % 1000 === 0 ? 0 : 2)}K
                      </button>
                    ))}
                  </div>
                </Field>
              )}

              {mode === 'net-to-gross' && (
                <Field label="שכר נטו רצוי (₪)" hint="כמה אתה רוצה להיות עם לאחר כל הניכויים">
                  <input
                    type="number"
                    min={0}
                    step={500}
                    value={netInput}
                    onChange={(e) => setNetInput(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-blue-300 rounded-lg text-lg bg-blue-50 focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {[8_000, 10_000, 12_000, 15_000, 20_000, 25_000].map((v) => (
                      <button
                        key={v}
                        type="button"
                        onClick={() => setNetInput(v)}
                        className="text-xs px-2 py-0.5 bg-blue-100 text-blue-800 rounded hover:bg-blue-200 transition"
                      >
                        {v.toLocaleString('he-IL')}
                      </button>
                    ))}
                  </div>
                </Field>
              )}

              {mode === 'employer-to-net' && (
                <Field label="עלות מעסיק כוללת (₪)" hint="הסכום שהמעסיק משלם — כולל ב.ל. מעסיק, פנסיה, פיצויים">
                  <input
                    type="number"
                    min={0}
                    step={1000}
                    value={employerCostInput}
                    onChange={(e) => setEmployerCostInput(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-purple-300 rounded-lg text-lg bg-purple-50 focus:ring-2 focus:ring-purple-500"
                  />
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {[15_000, 20_000, 25_000, 35_000, 50_000].map((v) => (
                      <button
                        key={v}
                        type="button"
                        onClick={() => setEmployerCostInput(v)}
                        className="text-xs px-2 py-0.5 bg-purple-100 text-purple-800 rounded hover:bg-purple-200 transition"
                      >
                        {(v / 1000).toFixed(0)}K
                      </button>
                    ))}
                  </div>
                </Field>
              )}

              <div className="grid grid-cols-2 gap-4">
                <Field label="נקודות זיכוי" hint="גבר=2.25, אישה=2.75">
                  <input
                    type="number"
                    min={0}
                    max={15}
                    step={0.25}
                    value={opts.creditPoints}
                    onChange={(e) => updateOpts('creditPoints', Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCreditWizard(!showCreditWizard)}
                    className="mt-1 text-xs text-emerald-700 hover:underline"
                  >
                    חשב נקודות זיכוי אישית
                  </button>
                </Field>
                <Field label="שעות / חודש" hint="182 = משרה מלאה">
                  <input
                    type="number"
                    min={1}
                    max={300}
                    value={opts.monthlyWorkHours}
                    onChange={(e) => updateOpts('monthlyWorkHours', Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  />
                </Field>
              </div>
            </div>
          </Section>

          {/* פנסיה */}
          <Section title="פנסיה וקרן השתלמות" color="blue">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="pension"
                  checked={opts.pensionEnabled}
                  onChange={(e) => updateOpts('pensionEnabled', e.target.checked)}
                  className="w-4 h-4 text-blue-600"
                />
                <label htmlFor="pension" className="text-sm font-medium cursor-pointer">
                  הפרשה לפנסיה (חובה לפי חוק)
                </label>
              </div>

              {opts.pensionEnabled && (
                <div className="mr-6 space-y-2">
                  <p className="text-xs text-gray-500 mb-2">רמת הפרשה:</p>
                  {(['minimum', 'recommended', 'maximum'] as PensionLevel[]).map((level) => (
                    <label key={level} className="flex items-start gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="pensionLevel"
                        value={level}
                        checked={opts.pensionLevel === level}
                        onChange={() => updateOpts('pensionLevel', level)}
                        className="mt-0.5 w-4 h-4 text-blue-600"
                      />
                      <div>
                        <span className="text-sm font-medium">{PENSION_RATES[level].label}</span>
                        <p className="text-xs text-gray-500">{PENSION_RATES[level].description}</p>
                      </div>
                    </label>
                  ))}

                  {/* השפעה על נטו */}
                  <div className="bg-blue-50 rounded-lg p-3 text-xs text-blue-900 mt-2">
                    <p className="font-semibold mb-1">השפעה על הנטו:</p>
                    <p>
                      ניכוי עובד:{' '}
                      <strong>{formatCurrency(r.pensionDeduction)}/חודש</strong> (
                      {(PENSION_RATES[opts.pensionLevel ?? 'minimum'].employee * 100).toFixed(0)}%)
                    </p>
                    <p className="text-emerald-700">
                      חיסכון שנתי במסלול מינימום:{' '}
                      <strong>{formatCurrency(r.employerPension * 12)}</strong> מהמעסיק
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="studyFund"
                  checked={opts.studyFundEnabled}
                  onChange={(e) => updateOpts('studyFundEnabled', e.target.checked)}
                  className="w-4 h-4 text-blue-600"
                />
                <label htmlFor="studyFund" className="text-sm font-medium cursor-pointer">
                  קרן השתלמות (2.5% עובד + 7.5% מעסיק)
                </label>
              </div>

              {opts.studyFundEnabled && r.studyFundDeduction > 0 && (
                <div className="mr-6 bg-purple-50 rounded-lg p-3 text-xs text-purple-900">
                  <p>ניכוי עובד: <strong>{formatCurrency(r.studyFundDeduction)}/ח</strong></p>
                  <p>הפרשת מעסיק: <strong>{formatCurrency(r.employerStudyFund)}/ח</strong></p>
                  <p className="text-emerald-700 mt-1">
                    סה"כ שנתי בקרן: <strong>{formatCurrency((r.studyFundDeduction + r.employerStudyFund) * 12)}</strong> (פטור ממס!)
                  </p>
                </div>
              )}
            </div>
          </Section>

          {/* הגדרות נוספות */}
          <Section title="הגדרות נוספות" color="gray">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Field label="שנת מס">
                  <select
                    value={opts.taxYear}
                    onChange={(e) => updateOpts('taxYear', e.target.value as TaxYear)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 text-sm"
                  >
                    <option value="2024">2024</option>
                    <option value="2025">2025</option>
                    <option value="2026">2026 (נוכחית)</option>
                  </select>
                </Field>
                <Field
                  label={`ביטוח אובדן כושר: ${opts.disabilityInsuranceRate}%`}
                  hint="בדרך כלל 1-2% מהברוטו"
                >
                  <input
                    type="range"
                    min={0}
                    max={3}
                    step={0.1}
                    value={opts.disabilityInsuranceRate}
                    onChange={(e) => updateOpts('disabilityInsuranceRate', Number(e.target.value))}
                    className="w-full accent-gray-600"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>ללא</span>
                    <span>1%</span>
                    <span>2%</span>
                    <span>3%</span>
                  </div>
                </Field>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="yearCompare"
                  checked={showYearCompare}
                  onChange={(e) => setShowYearCompare(e.target.checked)}
                  className="w-4 h-4"
                />
                <label htmlFor="yearCompare" className="text-sm cursor-pointer">
                  הצג השוואת שנים (2024 / 2025 / 2026)
                </label>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="showBonus"
                  checked={showBonus}
                  onChange={(e) => setShowBonus(e.target.checked)}
                  className="w-4 h-4"
                />
                <label htmlFor="showBonus" className="text-sm cursor-pointer">
                  חשב נטו על בונוס / חודש 13
                </label>
              </div>
            </div>
          </Section>
        </div>

        {/* === Results === */}
        <div className="lg:col-span-2 space-y-4">
          {/* כרטיס נטו */}
          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-2 border-emerald-300 rounded-xl p-5">
            <p className="text-sm font-medium text-emerald-800 mb-1">שכר נטו (לכיס)</p>
            <p className="text-4xl font-bold text-emerald-700 tabular-nums">{formatCurrency(r.netSalary)}</p>
            <p className="text-sm text-emerald-600 mt-1">
              {r.netPercentage.toFixed(1)}% מהברוטו
            </p>
          </div>

          {/* ברוטו (מוצג רק במצבים שבהם הוא מחושב) */}
          {(mode === 'net-to-gross' || mode === 'employer-to-net') && (
            <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-4">
              <p className="text-xs font-medium text-gray-600 mb-1">
                {mode === 'net-to-gross' ? 'ברוטו נדרש' : 'ברוטו מחושב'}
              </p>
              <p className="text-2xl font-bold text-gray-900 tabular-nums">
                {formatCurrency(r.grossSalary)}
              </p>
            </div>
          )}

          {/* פירוט ניכויים */}
          <div className="bg-white border-2 border-gray-200 rounded-xl p-4 space-y-1.5 text-sm">
            <h4 className="font-bold text-gray-900 mb-3">פירוט ניכויים</h4>
            <Row label="ברוטו" value={formatCurrency(r.grossSalary)} bold />
            <Row label={`מס הכנסה (${r.effectiveTaxRate.toFixed(1)}% בפועל)`} value={`-${formatCurrency(r.incomeTax)}`} color="red" />
            <Row label="ב.ל. + בריאות" value={`-${formatCurrency(r.socialSecurity)}`} color="amber" />
            {r.pensionDeduction > 0 && (
              <Row label={`פנסיה (${(PENSION_RATES[opts.pensionLevel ?? 'minimum'].employee * 100).toFixed(0)}%)`} value={`-${formatCurrency(r.pensionDeduction)}`} color="blue" />
            )}
            {r.studyFundDeduction > 0 && (
              <Row label="קרן השתלמות (2.5%)" value={`-${formatCurrency(r.studyFundDeduction)}`} color="blue" />
            )}
            {r.disabilityInsurance > 0 && (
              <Row label={`אובדן כושר (${opts.disabilityInsuranceRate}%)`} value={`-${formatCurrency(r.disabilityInsurance)}`} />
            )}
            <div className="pt-2 border-t-2 border-emerald-300">
              <Row label="נטו לכיס" value={formatCurrency(r.netSalary)} bold color="emerald" />
            </div>
          </div>

          {/* מדרגת מס שולי */}
          <MarginalBracketCard result={r} />

          {/* שכר שעתי */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm">
            <p className="font-semibold text-blue-900 mb-1">שכר שעתי (ברוטו)</p>
            <p className="text-2xl font-bold text-blue-700 tabular-nums">
              {r.hourlyRate.toFixed(1)} ₪/שעה
            </p>
            <p className="text-xs text-blue-600 mt-1">לפי {opts.monthlyWorkHours} שעות/חודש</p>
          </div>

          {/* עלות מעסיק */}
          <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 text-sm space-y-1.5">
            <h4 className="font-semibold text-purple-900 mb-2">עלות מעסיק כוללת</h4>
            <p className="text-2xl font-bold text-purple-700 tabular-nums">
              {formatCurrency(r.totalEmployerCost)}
            </p>
            <Row label="ב.ל. מעסיק" value={formatCurrency(r.employerSocialSecurity)} />
            <Row label="פנסיה מעסיק" value={formatCurrency(r.employerPension)} />
            {r.employerStudyFund > 0 && <Row label="קרן השתלמות מעסיק" value={formatCurrency(r.employerStudyFund)} />}
            <Row label="פיצויים (8.33%)" value={formatCurrency(r.employerCompensation)} />
            <p className="text-xs text-purple-700 pt-1 border-t border-purple-200">
              יחס עלות/נטו: {r.costToNetRatio.toFixed(2)}× (על כל ₪1 נטו, מעסיק משלם ₪{r.costToNetRatio.toFixed(2)})
            </p>
          </div>
        </div>
      </div>

      {/* ===== Credit Points Wizard ===== */}
      {showCreditWizard && (
        <CreditPointsWizard
          profile={creditProfile}
          setProfile={setCreditProfile}
          creditResult={creditResult}
          onApply={(points) => updateOpts('creditPoints', points)}
        />
      )}

      {/* ===== Year Comparison ===== */}
      {showYearCompare && yearComparison && (
        <YearComparisonPanel comparison={yearComparison} grossSalary={r.grossSalary} />
      )}

      {/* ===== Bonus Calculator ===== */}
      {showBonus && (
        <BonusPanel
          bonusAmount={bonusAmount}
          setBonusAmount={setBonusAmount}
          bonusResult={bonusResult}
          marginalRate={r.marginalTaxRate}
        />
      )}

      {/* ===== Charts ===== */}
      <div className="bg-white border-2 border-gray-200 rounded-xl p-5">
        <div className="flex flex-wrap gap-2 mb-5">
          <TabButton active={chartView === 'pie'} onClick={() => setChartView('pie')}>
            חלוקת שכר (Pie)
          </TabButton>
          <TabButton active={chartView === 'bar'} onClick={() => setChartView('bar')}>
            ברוטו / נטו / עלות
          </TabButton>
          <TabButton active={chartView === 'curve'} onClick={() => setChartView('curve')}>
            עקומת נטו לפי שכר
          </TabButton>
        </div>

        {chartView === 'pie' && (
          <div>
            <h3 className="font-bold text-gray-900 mb-1">חלוקת השכר</h3>
            <p className="text-xs text-gray-500 mb-4">ירוק = נטו | אדום = מס | כתום = ב.ל. | כחול = פנסיה</p>
            <div className="flex flex-col md:flex-row items-center gap-4">
              <div className="h-64 w-full md:w-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      dataKey="value"
                      label={false}
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
              <div className="flex-1 space-y-2">
                {pieData.map((d, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="inline-block w-3 h-3 rounded-full" style={{ backgroundColor: d.color }} />
                      <span>{d.name}</span>
                    </div>
                    <span className="tabular-nums font-medium">{formatCurrency(d.value)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {chartView === 'bar' && (
          <div>
            <h3 className="font-bold text-gray-900 mb-1">ברוטו / נטו / עלות מעסיק</h3>
            <p className="text-xs text-gray-500 mb-4">הבדל ויזואלי בין מה שהמעסיק משלם, מה שבתלוש, ומה שמגיע לכיס</p>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} tick={{ fontSize: 11 }} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} width={90} />
                  <Tooltip formatter={(v) => formatCurrency(Number(v))} />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {barData.map((entry, i) => (
                      <Cell key={i} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {chartView === 'curve' && salaryCurve && (
          <div>
            <h3 className="font-bold text-gray-900 mb-1">עקומת נטו — לאורך טווח שכר</h3>
            <p className="text-xs text-gray-500 mb-4">ירוק = נטו | אדום = מס הכנסה | כתום = ב.ל. | כחול = פנסיה</p>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salaryCurve}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="label" tick={{ fontSize: 10 }} />
                  <YAxis tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} tick={{ fontSize: 10 }} />
                  <Tooltip formatter={(v) => formatCurrency(Number(v))} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Bar dataKey="net" stackId="a" name="נטו" fill="#10b981" />
                  <Bar dataKey="tax" stackId="a" name="מס הכנסה" fill="#ef4444" />
                  <Bar dataKey="ss" stackId="a" name="ב.ל." fill="#f59e0b" />
                  <Bar dataKey="pension" stackId="a" name="פנסיה" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================
// Marginal Bracket Card
// ============================================================

function MarginalBracketCard({ result }: { result: ReturnType<typeof calculateSalaryNetGross> }) {
  const info = result.marginalBracketInfo;
  const isTop = info.nextRate === null;

  return (
    <div className={`rounded-xl border-2 p-4 text-sm ${isTop ? 'bg-red-50 border-red-200' : 'bg-amber-50 border-amber-200'}`}>
      <h4 className={`font-semibold mb-2 ${isTop ? 'text-red-800' : 'text-amber-800'}`}>
        מדרגת מס שולי
      </h4>
      <p className={`text-2xl font-bold tabular-nums ${isTop ? 'text-red-700' : 'text-amber-700'}`}>
        {(info.currentRate * 100).toFixed(0)}%
      </p>
      <p className="text-xs text-gray-600 mt-1">
        {isTop
          ? 'אתה במדרגה העליונה (50%). כל תוספת שכר ממוסה ב-50%.'
          : `כל שקל נוסף מעל הברוטו הנוכחי ממוסה ב-${(info.currentRate * 100).toFixed(0)}%`}
      </p>
      {!isTop && info.distanceToNextMonthly > 0 && (
        <div className="mt-2 bg-white rounded p-2 border border-amber-200">
          <p className="text-xs text-amber-700">
            מרחק למדרגה הבאה ({(info.nextRate! * 100).toFixed(0)}%):
          </p>
          <p className="font-bold text-amber-900 tabular-nums">
            +{formatCurrency(info.distanceToNextMonthly)}/חודש
          </p>
          <p className="text-xs text-gray-500 mt-0.5">
            (כלומר: העלאה של פחות מ-{formatCurrency(info.distanceToNextMonthly)}/ח לא תשנה את המדרגה)
          </p>
        </div>
      )}
      <div className="mt-2 text-xs text-gray-500">
        שיעור אפקטיבי: <strong>{result.effectiveTaxRate.toFixed(1)}%</strong> — הפרש: {((info.currentRate * 100) - result.effectiveTaxRate).toFixed(1)}%
      </div>
    </div>
  );
}

// ============================================================
// Year Comparison Panel
// ============================================================

function YearComparisonPanel({
  comparison,
  grossSalary,
}: {
  comparison: ReturnType<typeof calculateYearComparison>;
  grossSalary: number;
}) {
  const result2026 = comparison.find((c) => c.year === '2026');
  const result2025 = comparison.find((c) => c.year === '2025');
  const benefitFrom2026 = result2026 && result2025
    ? (result2026.netSalary - result2025.netSalary) * 12
    : 0;

  return (
    <div className="bg-white border-2 border-gray-200 rounded-xl p-5">
      <h3 className="font-bold text-gray-900 text-lg mb-1">השוואת שנים — אותו ברוטו ({formatCurrency(grossSalary)})</h3>
      <p className="text-sm text-gray-500 mb-4">
        ב-2026 הורחבו מדרגות 20% ו-31% — מי שמשתכר 19,000-25,100 ₪/חודש נהנה הכי הרבה
      </p>

      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-50">
              <th className="text-right p-2 border border-gray-200">שנה</th>
              <th className="text-right p-2 border border-gray-200">נטו חודשי</th>
              <th className="text-right p-2 border border-gray-200">מס הכנסה</th>
              <th className="text-right p-2 border border-gray-200">שיעור אפקטיבי</th>
              <th className="text-right p-2 border border-gray-200">מדרגה שולית</th>
            </tr>
          </thead>
          <tbody>
            {comparison.map((row, i) => (
              <tr key={row.year} className={`${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'} ${row.year === '2026' ? 'ring-2 ring-inset ring-emerald-400' : ''}`}>
                <td className="p-2 border border-gray-200 font-bold">
                  {row.year}
                  {row.year === '2026' && <span className="mr-1 text-emerald-600 text-xs">✓ נוכחי</span>}
                </td>
                <td className="p-2 border border-gray-200 tabular-nums font-medium text-emerald-700">
                  {formatCurrency(row.netSalary)}
                </td>
                <td className="p-2 border border-gray-200 tabular-nums text-red-600">
                  {formatCurrency(row.incomeTax)}
                </td>
                <td className="p-2 border border-gray-200 tabular-nums">
                  {row.netPercentage.toFixed(1)}%
                </td>
                <td className="p-2 border border-gray-200 tabular-nums">
                  {row.marginalRate.toFixed(0)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {benefitFrom2026 > 0 && (
        <div className="mt-4 bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-sm text-emerald-900">
          <strong>הרווחת מהשינוי ב-2026:</strong> {formatCurrency(benefitFrom2026)} יותר בשנה (לעומת 2025)
        </div>
      )}
    </div>
  );
}

// ============================================================
// Bonus Panel
// ============================================================

function BonusPanel({
  bonusAmount,
  setBonusAmount,
  bonusResult,
  marginalRate,
}: {
  bonusAmount: number;
  setBonusAmount: (v: number) => void;
  bonusResult: ReturnType<typeof calculateBonusNet> | null;
  marginalRate: number;
}) {
  return (
    <div className="bg-white border-2 border-gray-200 rounded-xl p-5">
      <h3 className="font-bold text-gray-900 text-lg mb-1">מחשבון בונוס / חודש 13</h3>
      <p className="text-sm text-gray-500 mb-4">
        הבונוס ממוסה בשיעור המדרגה <strong>השולית</strong> ({marginalRate.toFixed(0)}%) — לא הממוצעת.
        לכן הנטו על בונוס נמוך יותר מהצפוי.
      </p>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">סכום הבונוס (₪)</label>
          <input
            type="number"
            min={0}
            step={1000}
            value={bonusAmount}
            onChange={(e) => setBonusAmount(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
          />
          <div className="flex flex-wrap gap-1 mt-1">
            {[5_000, 10_000, 20_000, 30_000].map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setBonusAmount(v)}
                className="text-xs px-2 py-0.5 bg-amber-100 text-amber-800 rounded hover:bg-amber-200"
              >
                {v.toLocaleString('he-IL')}
              </button>
            ))}
          </div>
        </div>

        {bonusResult && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm space-y-1">
            <p className="font-semibold text-amber-800 mb-2">תוצאה:</p>
            <Row label="ברוטו בונוס" value={formatCurrency(bonusResult.grossBonus)} />
            <Row label={`מס (${(bonusResult.marginalRate * 100).toFixed(0)}% שולי)`} value={`-${formatCurrency(bonusResult.taxOnBonus)}`} color="red" />
            <Row label="ב.ל." value={`-${formatCurrency(bonusResult.socialSecurityOnBonus)}`} color="amber" />
            <div className="pt-1 border-t">
              <Row label="נטו מהבונוס" value={formatCurrency(bonusResult.netBonus)} bold color="emerald" />
              <p className="text-xs text-gray-500 mt-1">
                {bonusResult.effectiveBonusRate.toFixed(1)}% מהבונוס הגיע לכיס
              </p>
            </div>
          </div>
        )}
      </div>

      {bonusResult && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-900">
          <strong>למה הנטו על הבונוס נמוך?</strong> הבונוס נחשב כהכנסה נוספת ומחויב במס שולי (
          {(bonusResult.marginalRate * 100).toFixed(0)}%) — לא בשיעור הממוצע. זה פחות ממה שרוב האנשים מצפים.
        </div>
      )}
    </div>
  );
}

// ============================================================
// Credit Points Wizard
// ============================================================

function CreditPointsWizard({
  profile,
  setProfile,
  creditResult,
  onApply,
}: {
  profile: CreditPointsProfile;
  setProfile: (p: CreditPointsProfile) => void;
  creditResult: ReturnType<typeof calculateCreditPoints> | null;
  onApply: (points: number) => void;
}) {
  function updateProfile<K extends keyof CreditPointsProfile>(k: K, v: CreditPointsProfile[K]) {
    setProfile({ ...profile, [k]: v });
  }

  return (
    <div className="bg-white border-2 border-emerald-200 rounded-xl p-5">
      <h3 className="font-bold text-gray-900 text-lg mb-1">מחשבון נקודות זיכוי אישי</h3>
      <p className="text-sm text-gray-500 mb-4">
        מלא את הפרטים שלך — המחשבון ימצא את מספר נקודות הזיכוי הנכון
      </p>

      <div className="grid md:grid-cols-2 gap-5">
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">מין</label>
            <div className="flex gap-3">
              {(['male', 'female'] as const).map((g) => (
                <label key={g} className="flex items-center gap-1.5 cursor-pointer text-sm">
                  <input
                    type="radio"
                    checked={profile.gender === g}
                    onChange={() => updateProfile('gender', g)}
                    className="w-4 h-4"
                  />
                  {g === 'male' ? 'גבר' : 'אישה'}
                </label>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <NumberField
              label="ילדים שנת לידה"
              value={profile.childrenAge0}
              onChange={(v) => updateProfile('childrenAge0', v)}
              hint="1.5 נק' לילד"
            />
            <NumberField
              label="ילדים גיל 1-5"
              value={profile.childrenAge1to5}
              onChange={(v) => updateProfile('childrenAge1to5', v)}
              hint="2.5 נק' לילד"
            />
            <NumberField
              label="ילדים גיל 6-17"
              value={profile.childrenAge6to17}
              onChange={(v) => updateProfile('childrenAge6to17', v)}
              hint="1 נק' לילד"
            />
            <NumberField
              label="ילד גיל 18"
              value={profile.childrenAge18}
              onChange={(v) => updateProfile('childrenAge18', v)}
              hint="0.5 נק' לילד"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <NumberField
              label="ילדים נכים"
              value={profile.disabledChildren}
              onChange={(v) => updateProfile('disabledChildren', v)}
              hint="1 נק' לילד"
            />
          </div>
        </div>

        <div className="space-y-3">
          <ToggleField
            label="הורה יחיד"
            hint="+1 נקודה"
            value={profile.singleParent}
            onChange={(v) => updateProfile('singleParent', v)}
          />
          <ToggleField
            label="חייל משוחרר (עד 3 שנים)"
            hint="+2 נקודות"
            value={profile.releasedSoldier}
            onChange={(v) => updateProfile('releasedSoldier', v)}
          />
          <ToggleField
            label="תואר ראשון (שנה ראשונה)"
            hint="+1 נקודה"
            value={profile.bachelorDegree}
            onChange={(v) => updateProfile('bachelorDegree', v)}
          />
          <ToggleField
            label="תואר שני (שנה ראשונה)"
            hint="+0.5 נקודה"
            value={profile.masterDegree}
            onChange={(v) => updateProfile('masterDegree', v)}
          />

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">עולה חדש</label>
            <select
              value={profile.newImmigrantYears}
              onChange={(e) => updateProfile('newImmigrantYears', Number(e.target.value) as 0 | 1 | 2 | 3)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value={0}>לא עולה חדש</option>
              <option value={1}>שנה 1-1.5 (+3 נק')</option>
              <option value={2}>שנה 1.5-3 (+2 נק')</option>
              <option value={3}>שנה 3-4.5 (+1 נק')</option>
            </select>
          </div>
        </div>
      </div>

      {creditResult && (
        <div className="mt-5 bg-emerald-50 border border-emerald-200 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="font-bold text-emerald-900 text-lg">
                {creditResult.totalPoints.toFixed(2)} נקודות זיכוי
              </p>
              <p className="text-sm text-emerald-700">
                = {formatCurrency(creditResult.monthlyCredit)}/חודש | {formatCurrency(creditResult.annualCredit)}/שנה פחות מס
              </p>
            </div>
            <button
              type="button"
              onClick={() => onApply(creditResult.totalPoints)}
              className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition"
            >
              החל על המחשבון
            </button>
          </div>

          <div className="grid grid-cols-2 gap-1 text-xs">
            {creditResult.breakdown.map((item, i) => (
              <div key={i} className="flex justify-between text-gray-700">
                <span>{item.label}</span>
                <span className="font-medium tabular-nums">{item.points.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// Helper UI Components
// ============================================================

function Section({
  title,
  color = 'gray',
  children,
}: {
  title: string;
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

function NumberField({
  label,
  value,
  onChange,
  hint,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  hint?: string;
}) {
  return (
    <Field label={label} hint={hint}>
      <input
        type="number"
        min={0}
        max={20}
        value={value}
        onChange={(e) => onChange(Math.max(0, Math.round(Number(e.target.value))))}
        className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500"
      />
    </Field>
  );
}

function ToggleField({
  label,
  hint,
  value,
  onChange,
}: {
  label: string;
  hint: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <input
        type="checkbox"
        checked={value}
        onChange={(e) => onChange(e.target.checked)}
        className="w-4 h-4 text-emerald-600"
      />
      <div>
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className="text-xs text-gray-500 mr-1">{hint}</span>
      </div>
    </label>
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

function ModeButton({
  active,
  onClick,
  color,
  children,
}: {
  active: boolean;
  onClick: () => void;
  color: 'emerald' | 'blue' | 'purple';
  children: React.ReactNode;
}) {
  const activeMap = {
    emerald: 'bg-white text-emerald-700 shadow font-bold',
    blue: 'bg-white text-blue-700 shadow font-bold',
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
        active ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      }`}
    >
      {children}
    </button>
  );
}
