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
  calculateSalaryCurve,
  PENSION_RATES,
  type SalaryNetGrossInput,
  type CalculatorMode,
  type PensionLevel,
} from '@/lib/calculators/salary-net-gross';
import { formatCurrency } from '@/lib/utils/formatters';

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
      data.push({ name: 'פנסיה', value: Math.round(r.pensionDeduction), color: '#102219' });
    if (r.studyFundDeduction > 0)
      data.push({ name: 'קרן השתלמות', value: Math.round(r.studyFundDeduction), color: '#8E6824' });
    if (r.disabilityInsurance > 0)
      data.push({ name: 'אובדן כושר', value: Math.round(r.disabilityInsurance), color: '#264B36' });
    return data.filter((d) => d.value > 0);
  }, [mainResult]);

  // נתוני Bar (comparison)
  const barData = useMemo(() => {
    const r = mainResult;
    return [
      { name: 'ברוטו', value: Math.round(r.grossSalary), fill: '#264B36' },
      { name: 'נטו לעובד', value: Math.round(r.netSalary), fill: '#10b981' },
      { name: 'עלות מעסיק', value: Math.round(r.totalEmployerCost), fill: '#102219' },
    ];
  }, [mainResult]);

  const r = mainResult;

  return (
    <div className="space-y-6" dir="rtl">
      {/* ===== Mode Toggle ===== */}
      <div className="flex flex-wrap gap-2 bg-cream-2 rounded-none p-1 w-fit">
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
        <div className="bg-cream-2 border border-ink/15 rounded-none p-3 text-sm text-ink/80">
          <strong>מצב הפוך:</strong> הכנס את הנטו שאתה רוצה לקבל — המחשבון יחשב אומדן ברוטו לפי ההנחות שהוזנו
        </div>
      )}
      {mode === 'employer-to-net' && (
        <div className="bg-cream-2 border border-gold/40 rounded-none p-3 text-sm text-ink/80">
          <strong>מצב מעסיק:</strong> הכנס אומדן עלות מעסיק לפי הנחות המחשבון — יתקבל אומדן ברוטו ונטו לעובד
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
                    className="w-full px-3 py-2 border border-ink/15 rounded-none text-lg focus:ring-2 focus:ring-gold"
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
                    className="w-full px-3 py-2 border border-ink/15 rounded-none text-lg bg-cream-2 focus:ring-2 focus:ring-gold"
                  />
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {[8_000, 10_000, 12_000, 15_000, 20_000, 25_000].map((v) => (
                      <button
                        key={v}
                        type="button"
                        onClick={() => setNetInput(v)}
                        className="text-xs px-2 py-0.5 bg-cream text-ink rounded-none hover:bg-paper-hover transition"
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
                    className="w-full px-3 py-2 border border-ink/15 rounded-none text-lg bg-cream-2 focus:ring-2 focus:ring-gold"
                  />
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {[15_000, 20_000, 25_000, 35_000, 50_000].map((v) => (
                      <button
                        key={v}
                        type="button"
                        onClick={() => setEmployerCostInput(v)}
                        className="text-xs px-2 py-0.5 bg-cream text-gold rounded-none hover:bg-paper-hover transition"
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
                    className="w-full px-3 py-2 border border-ink/15 rounded-none focus:ring-2 focus:ring-gold"
                  />
                  <a className="mt-2 block text-xs text-emerald-800 underline" href="https://www.gov.il/he/service/tax-credit" target="_blank" rel="noopener noreferrer">בדיקת נקודות הזיכוי בסימולטור רשות המסים ↗</a>
                </Field>
                <Field label="שעות / חודש" hint="182 = משרה מלאה">
                  <input
                    type="number"
                    min={1}
                    max={300}
                    value={opts.monthlyWorkHours}
                    onChange={(e) => updateOpts('monthlyWorkHours', Number(e.target.value))}
                    className="w-full px-3 py-2 border border-ink/15 rounded-none focus:ring-2 focus:ring-gold"
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
                  className="w-4 h-4 accent-ink"
                />
                <label htmlFor="pension" className="text-sm font-medium cursor-pointer">
                  הפרשה לפנסיה לפי ההסדר החל
                </label>
              </div>

              {opts.pensionEnabled && (
                <div className="mr-6 space-y-2">
                  <p className="text-xs text-ink/70 mb-2">רמת הפרשה:</p>
                  {(['minimum', 'recommended'] as PensionLevel[]).map((level) => (
                    <label key={level} className="flex items-start gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="pensionLevel"
                        value={level}
                        checked={opts.pensionLevel === level}
                        onChange={() => updateOpts('pensionLevel', level)}
                        className="mt-0.5 w-4 h-4 accent-ink"
                      />
                      <div>
                        <span className="text-sm font-medium">{level === 'minimum' ? 'עובד 6% / מעסיק 6.5%' : 'תרחיש מוגדל: עובד 7% / מעסיק 7.5%'}</span>
                        <p className="text-xs text-ink/70">שיעורי חישוב לדוגמה; הבסיס והשיעור בפועל נקבעים לפי ההסכם.</p>
                      </div>
                    </label>
                  ))}

                  {/* השפעה על נטו */}
                  <div className="bg-cream-2 rounded-none p-3 text-xs text-ink/80 mt-2">
                    <p className="font-semibold mb-1">השפעה על הנטו:</p>
                    <p>
                      ניכוי עובד:{' '}
                      <strong>{formatCurrency(r.pensionDeduction)}/חודש</strong> (
                      {(PENSION_RATES[opts.pensionLevel ?? 'minimum'].employee * 100).toFixed(0)}%)
                    </p>
                    <p className="text-emerald-800">
                      הפרשת מעסיק משוערת לשנה:{' '}
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
                  className="w-4 h-4 accent-ink"
                />
                <label htmlFor="studyFund" className="text-sm font-medium cursor-pointer">
                  קרן השתלמות (2.5% עובד + 7.5% מעסיק)
                </label>
              </div>

              {opts.studyFundEnabled && r.studyFundDeduction > 0 && (
                <div className="mr-6 bg-cream-2 rounded-none p-3 text-xs text-ink/80">
                  <p>ניכוי עובד: <strong>{formatCurrency(r.studyFundDeduction)}/ח</strong></p>
                  <p>הפרשת מעסיק: <strong>{formatCurrency(r.employerStudyFund)}/ח</strong></p>
                  <p className="text-emerald-800 mt-1">
                    סך שנתי בקרן: <strong>{formatCurrency((r.studyFundDeduction + r.employerStudyFund) * 12)}</strong> (כפוף לתקרות ולתנאי המס)
                  </p>
                </div>
              )}
            </div>
          </Section>

          {/* הגדרות נוספות */}
          <Section title="הגדרות נוספות" color="gray">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
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
                    className="w-full accent-ink"
                  />
                  <div className="flex justify-between text-xs text-ink/70 mt-1">
                    <span>ללא</span>
                    <span>1%</span>
                    <span>2%</span>
                    <span>3%</span>
                  </div>
                </Field>
              </div>

            </div>
          </Section>
        </div>

        {/* === Results === */}
        <div className="lg:col-span-2 space-y-4">
          {/* כרטיס נטו */}
          <div className="bg-emerald-50 border border-emerald-300 rounded-none p-5">
            <p className="text-sm font-medium text-emerald-800 mb-1">אומדן נטו (ללא זיכוי מס על הפקדה לפנסיה)</p>
            <p className="text-4xl font-bold text-emerald-800 tabular-nums">{formatCurrency(r.netSalary)}</p>
            <p className="text-sm text-emerald-800 mt-1">
              {r.netPercentage.toFixed(1)}% מהברוטו; בדקו רכיבי תלוש והטבות מס אישיות.
            </p>
          </div>

          {/* ברוטו (מוצג רק במצבים שבהם הוא מחושב) */}
          {(mode === 'net-to-gross' || mode === 'employer-to-net') && (
            <div className="bg-cream-2 border border-ink/15 rounded-none p-4">
              <p className="text-xs font-medium text-ink/70 mb-1">
                {mode === 'net-to-gross' ? 'ברוטו נדרש' : 'ברוטו מחושב'}
              </p>
              <p className="text-2xl font-bold text-ink tabular-nums">
                {formatCurrency(r.grossSalary)}
              </p>
            </div>
          )}

          {/* פירוט ניכויים */}
          <div className="bg-paper border border-ink/15 rounded-none p-4 space-y-1.5 text-sm">
            <h4 className="font-bold text-ink mb-3">פירוט ניכויים</h4>
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
          <div className="bg-cream-2 border border-ink/15 rounded-none p-4 text-sm">
            <p className="font-semibold text-ink mb-1">שכר שעתי (ברוטו)</p>
            <p className="text-2xl font-bold text-ink tabular-nums">
              {r.hourlyRate.toFixed(1)} ₪/שעה
            </p>
            <p className="text-xs text-ink/70 mt-1">לפי {opts.monthlyWorkHours} שעות/חודש</p>
          </div>

          {/* עלות מעסיק */}
          <div className="bg-cream-2 border border-gold/40 rounded-none p-4 text-sm space-y-1.5">
            <h4 className="font-semibold text-ink mb-2">אומדן עלות מעסיק לפי הנחות המחשבון</h4>
            <p className="text-2xl font-bold text-gold tabular-nums">
              {formatCurrency(r.totalEmployerCost)}
            </p>
            <Row label="ב.ל. מעסיק" value={formatCurrency(r.employerSocialSecurity)} />
            <Row label="פנסיה מעסיק" value={formatCurrency(r.employerPension)} />
            {r.employerStudyFund > 0 && <Row label="קרן השתלמות מעסיק" value={formatCurrency(r.employerStudyFund)} />}
            <Row label="פיצויים (8.33%)" value={formatCurrency(r.employerCompensation)} />
            <p className="text-xs text-ink/70">האומדן מניח הפקדת פיצויים של 8.33% על כל הברוטו; בפועל הבסיס והשיעור עשויים להיות שונים.</p>
            <p className="text-xs text-ink/70 pt-1 border-t border-gold/30">
              יחס עלות/נטו: {r.costToNetRatio.toFixed(2)}× (על כל ₪1 נטו, מעסיק משלם ₪{r.costToNetRatio.toFixed(2)})
            </p>
          </div>
        </div>
      </div>

      {/* ===== Charts ===== */}
      <div className="bg-paper border border-ink/15 rounded-none p-5">
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
            <h3 className="font-bold text-ink mb-1">חלוקת השכר</h3>
            <p className="text-xs text-ink/70 mb-4">ירוק = נטו | אדום = מס | כתום = ב.ל. | כחול = פנסיה</p>
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
            <h3 className="font-bold text-ink mb-1">ברוטו / נטו / עלות מעסיק</h3>
            <p className="text-xs text-ink/70 mb-4">הבדל ויזואלי בין מה שהמעסיק משלם, מה שבתלוש, ומה שמגיע לכיס</p>
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
            <h3 className="font-bold text-ink mb-1">עקומת נטו — לאורך טווח שכר</h3>
            <p className="text-xs text-ink/70 mb-4">ירוק = נטו | אדום = מס הכנסה | כתום = ב.ל. | כחול = פנסיה</p>
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
                  <Bar dataKey="pension" stackId="a" name="פנסיה" fill="#102219" radius={[4, 4, 0, 0]} />
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
    <div className={`rounded-none border p-4 text-sm ${isTop ? 'bg-red-50 border-red-200' : 'bg-amber-50 border-amber-200'}`}>
      <h4 className={`font-semibold mb-2 ${isTop ? 'text-red-800' : 'text-amber-800'}`}>
        מדרגת מס שולי
      </h4>
      <p className={`text-2xl font-bold tabular-nums ${isTop ? 'text-red-700' : 'text-amber-800'}`}>
        {(info.currentRate * 100).toFixed(0)}%
      </p>
      <p className="text-xs text-ink/70 mt-1">
        {isTop
          ? 'אתה במדרגה העליונה (50%). כל תוספת שכר ממוסה ב-50%.'
          : `כל שקל נוסף מעל הברוטו הנוכחי ממוסה ב-${(info.currentRate * 100).toFixed(0)}%`}
      </p>
      {!isTop && info.distanceToNextMonthly > 0 && (
        <div className="mt-2 bg-paper rounded-none p-2 border border-amber-200">
          <p className="text-xs text-amber-800">
            מרחק למדרגה הבאה ({(info.nextRate! * 100).toFixed(0)}%):
          </p>
          <p className="font-bold text-amber-900 tabular-nums">
            +{formatCurrency(info.distanceToNextMonthly)}/חודש
          </p>
          <p className="text-xs text-ink/70 mt-0.5">
            (כלומר: העלאה של פחות מ-{formatCurrency(info.distanceToNextMonthly)}/ח לא תשנה את המדרגה)
          </p>
        </div>
      )}
      <div className="mt-2 text-xs text-ink/70">
        שיעור אפקטיבי: <strong>{result.effectiveTaxRate.toFixed(1)}%</strong> — הפרש: {((info.currentRate * 100) - result.effectiveTaxRate).toFixed(1)}%
      </div>
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
    gray: 'bg-paper border-ink/15',
    emerald: 'bg-emerald-50 border-emerald-200',
    blue: 'bg-cream-2 border-ink/15',
  };
  return (
    <div className={`rounded-none border p-5 ${bgMap[color]}`}>
      <h2 className="font-bold text-ink text-base mb-4">{title}</h2>
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
      <label className="block text-sm font-medium text-ink/70 mb-1">
        <span className="block">{label}</span>
        {children}
      </label>
      {hint && <p className="text-xs text-ink/70 mt-1">{hint}</p>}
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
    emerald: 'text-emerald-800',
    blue: 'text-ink',
    red: 'text-red-700',
    amber: 'text-amber-800',
  };
  const valueClass = color ? colorMap[color] : 'text-ink';
  return (
    <div className="flex justify-between py-0.5">
      <span className={`text-ink/70 ${bold ? 'font-bold text-ink' : ''}`}>{label}</span>
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
    emerald: 'bg-paper text-emerald-800 shadow font-bold',
    blue: 'bg-paper text-ink shadow font-bold',
    purple: 'bg-paper text-gold shadow font-bold',
  };
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-4 py-2 rounded-none text-sm font-medium transition ${
        active ? activeMap[color] : 'text-ink/70 hover:text-ink'
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
      className={`px-3 py-1.5 rounded-none text-xs font-medium transition ${
        active ? 'bg-ink text-cream' : 'bg-cream-2 text-ink/70 hover:bg-paper-hover'
      }`}
    >
      {children}
    </button>
  );
}
