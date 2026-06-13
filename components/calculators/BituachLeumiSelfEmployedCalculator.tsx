'use client';

import { useState, useMemo } from 'react';
import {
  calculateBituachLeumiSelfEmployed,
  calculateAnnualReconciliation,
  projectPensionEntitlement,
  calculateBLWithOtherEmployment,
  BL_SE_RATES_2026,
  type BLInput,
  type PaymentFrequency,
} from '@/lib/calculators/bituach-leumi-self-employed';
import { formatCurrency, formatPercent } from '@/lib/utils/formatters';
import { ResultCard } from '@/components/calculator/ResultCard';

// ============================================================
// ברירות מחדל
// ============================================================

const QUICK_PICKS = [5_000, 10_000, 15_000, 25_000, 40_000, 55_000];

const MARGINAL_TAX_RATES = [
  { label: '10%', value: 0.10 },
  { label: '14%', value: 0.14 },
  { label: '20%', value: 0.20 },
  { label: '31%', value: 0.31 },
  { label: '35%', value: 0.35 },
  { label: '47%', value: 0.47 },
];

const INITIAL_INPUT: BLInput = {
  monthlyIncome: 15_000,
  paymentFrequency: 'quarterly',
  age: 35,
  hasOtherEmployment: false,
  otherEmploymentIncome: 0,
  yearsContributing: 5,
  expectedRetirementAge: 67,
};

type TabId = 'quick' | 'breakdown' | 'taxbenefit' | 'reconciliation' | 'rights';

// ============================================================
// רכיב ראשי
// ============================================================

export function BituachLeumiSelfEmployedCalculator() {
  const [input, setInput] = useState<BLInput>(INITIAL_INPUT);
  const [activeTab, setActiveTab] = useState<TabId>('quick');
  const [marginalTaxRate, setMarginalTaxRate] = useState(0.31);

  // תיאום שנתי
  const [estimatedMonthly, setEstimatedMonthly] = useState(12_000);
  const [actualMonthly, setActualMonthly] = useState(15_000);

  const result = useMemo(
    () => calculateBituachLeumiSelfEmployed(input, marginalTaxRate),
    [input, marginalTaxRate],
  );

  const reconciliationResult = useMemo(
    () => calculateAnnualReconciliation(estimatedMonthly, actualMonthly),
    [estimatedMonthly, actualMonthly],
  );

  const pensionProjection = useMemo(
    () =>
      projectPensionEntitlement(
        input.yearsContributing ?? 5,
        result.monthlyTotal,
      ),
    [input.yearsContributing, result.monthlyTotal],
  );

  const combinedResult = useMemo(() => {
    if (!input.hasOtherEmployment || !input.otherEmploymentIncome) return null;
    return calculateBLWithOtherEmployment(input.monthlyIncome, input.otherEmploymentIncome);
  }, [input.hasOtherEmployment, input.monthlyIncome, input.otherEmploymentIncome]);

  function update<K extends keyof BLInput>(k: K, v: BLInput[K]) {
    setInput((p) => ({ ...p, [k]: v }));
  }

  const tabs: { id: TabId; label: string }[] = [
    { id: 'quick', label: 'חישוב מהיר' },
    { id: 'breakdown', label: 'פירוט והשוואה' },
    { id: 'taxbenefit', label: 'הטבת מס' },
    { id: 'reconciliation', label: 'תיאום שנתי' },
    { id: 'rights', label: 'זכויות מ-ב.ל.' },
  ];

  return (
    <div className="space-y-6" dir="rtl">
      {/* טאבים */}
      <div className="flex gap-1 bg-cream-2 p-1 rounded-none overflow-x-auto">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setActiveTab(t.id)}
            className={`flex-1 min-w-fit px-3 py-2 rounded-none text-sm font-medium transition whitespace-nowrap ${
              activeTab === t.id
                ? 'bg-paper text-ink shadow-sm'
                : 'text-ink/60 hover:text-ink'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ===== טאב 1: חישוב מהיר ===== */}
      {activeTab === 'quick' && (
        <div className="grid lg:grid-cols-5 gap-6">
          {/* קלט */}
          <div className="lg:col-span-2 space-y-5">
            <div className="bg-paper border border-ink/15 rounded-none p-6 space-y-5">
              <h2 className="text-xl font-bold text-ink">הכנסה חודשית</h2>

              {/* Quick picks */}
              <div>
                <p className="text-xs text-ink/60 mb-2">בחר סכום מהיר:</p>
                <div className="flex flex-wrap gap-2">
                  {QUICK_PICKS.map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => update('monthlyIncome', v)}
                      className={`px-3 py-1.5 rounded-none text-xs font-medium border transition ${
                        input.monthlyIncome === v
                          ? 'bg-ink text-cream border-ink'
                          : 'bg-paper text-ink/70 border-ink/15 hover:border-ink/40'
                      }`}
                    >
                      {(v / 1000).toFixed(0)}K
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-ink/70 mb-2">
                  הכנסה חייבת חודשית (₪) — לאחר הוצאות מוכרות
                </label>
                <input
                  type="number"
                  min={0}
                  step={1_000}
                  value={input.monthlyIncome}
                  onChange={(e) => update('monthlyIncome', Number(e.target.value))}
                  className="w-full px-3 py-2 border border-ink/15 rounded-none text-lg"
                />
                <p className="text-xs text-ink/60 mt-1">
                  מחזור מינוס הוצאות מוכרות = הכנסה חייבת
                </p>
              </div>

              {/* תדירות תשלום */}
              <div>
                <label className="block text-sm font-medium text-ink/70 mb-2">
                  תדירות תשלום מקדמות
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(['quarterly', 'monthly'] as PaymentFrequency[]).map((f) => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => update('paymentFrequency', f)}
                      className={`px-3 py-2 rounded-none border text-sm font-medium transition ${
                        input.paymentFrequency === f
                          ? 'bg-ink text-cream border-ink'
                          : 'bg-paper text-ink/70 border-ink/15 hover:border-ink/40'
                      }`}
                    >
                      {f === 'quarterly' ? 'רבעוני (4 תשלומים)' : 'חודשי (12 תשלומים)'}
                    </button>
                  ))}
                </div>
              </div>

              {/* גיל */}
              <div>
                <label className="block text-sm font-medium text-ink/70 mb-2">גיל</label>
                <input
                  type="number"
                  min={18}
                  max={75}
                  step={1}
                  value={input.age}
                  onChange={(e) => update('age', Number(e.target.value))}
                  className="w-full px-3 py-2 border border-ink/15 rounded-none"
                />
              </div>

              {/* כפל עיסוקים */}
              <div className="pt-3 border-t border-ink/15">
                <label className="flex items-center gap-3 cursor-pointer mb-3">
                  <input
                    type="checkbox"
                    checked={!!input.hasOtherEmployment}
                    onChange={(e) => update('hasOtherEmployment', e.target.checked)}
                    className="w-4 h-4"
                  />
                  <div>
                    <span className="text-sm font-medium text-ink">כפל עיסוקים</span>
                    <p className="text-xs text-ink/60">עובד גם כשכיר</p>
                  </div>
                </label>
                {input.hasOtherEmployment && (
                  <div>
                    <label className="block text-xs font-medium text-ink/70 mb-1">
                      שכר חודשי כשכיר (₪)
                    </label>
                    <input
                      type="number"
                      min={0}
                      step={500}
                      value={input.otherEmploymentIncome ?? 0}
                      onChange={(e) => update('otherEmploymentIncome', Number(e.target.value))}
                      className="w-full px-2 py-1.5 border border-ink/15 rounded-none text-sm"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* תוצאות */}
          <div className="lg:col-span-3 space-y-4">
            {/* כרטיסי תוצאה */}
            <div className="grid sm:grid-cols-2 gap-4">
              <ResultCard
                title="ב.ל. + בריאות חודשי"
                value={formatCurrency(result.monthlyTotal)}
                subtitle={`שיעור אפקטיבי: ${formatPercent(result.effectiveRate, 1)}`}
                variant="primary"
              />
              <ResultCard
                title="ב.ל. + בריאות שנתי"
                value={formatCurrency(result.annualTotal)}
                subtitle={`${result.installmentsPerYear} תשלומים × ${formatCurrency(result.paymentPerInstallment)}`}
                variant="warning"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <ResultCard
                title="ביטוח לאומי בלבד (חודשי)"
                value={formatCurrency(result.monthlyBL)}
                subtitle="ב.ל. (ללא בריאות)"
                variant="primary"
              />
              <ResultCard
                title="דמי בריאות (חודשי)"
                value={formatCurrency(result.monthlyHealth)}
                subtitle="מס בריאות"
                variant="success"
              />
            </div>

            {/* מינימום */}
            {result.isMinimumApplied && (
              <div className="bg-amber-50 border border-amber-300 rounded-none p-4 text-sm text-amber-900">
                <strong>תשלום מינימום:</strong> ב.ל. מחיל תשלום מינימום של{' '}
                {BL_SE_RATES_2026.minimumMonthlyPayment} ₪/חודש גם בהכנסה נמוכה, לשמירה על זכויות.
              </div>
            )}

            {/* פס מדרגות */}
            <div className="bg-paper border border-ink/15 rounded-none p-5">
              <h3 className="font-bold text-ink mb-4">חלוקת ב.ל. לפי מדרגות (חודשי)</h3>
              <TierBar result={result} monthlyIncome={input.monthlyIncome} />
            </div>

            {/* לוח תשלומים */}
            <div className="bg-paper border border-ink/15 rounded-none p-5">
              <h3 className="font-bold text-ink mb-3">מועדי תשלום</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {result.installmentMonths.slice(0, input.paymentFrequency === 'quarterly' ? 4 : 12).map((month) => (
                  <div
                    key={month}
                    className="bg-cream-2 border border-ink/15 rounded-none p-2 text-center"
                  >
                    <div className="text-xs text-ink/60 font-medium">15 ב{month}</div>
                    <div className="font-bold text-ink text-sm">
                      {formatCurrency(result.paymentPerInstallment)}
                    </div>
                  </div>
                ))}
              </div>
              {input.paymentFrequency === 'monthly' && (
                <p className="text-xs text-ink/60 mt-2">
                  * תשלום חודשי מגיע עד ה-15 לחודש העוקב
                </p>
              )}
            </div>

            {/* כפל עיסוקים */}
            {combinedResult && (
              <div className="bg-cream-2 border border-ink/15 rounded-none p-4 space-y-2 text-sm">
                <h4 className="font-bold text-ink">ב.ל. בכפל עיסוקים</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="text-xs text-ink/60">ב.ל. כעצמאי</div>
                    <div className="font-bold text-ink">
                      {formatCurrency(combinedResult.selfEmployedBL)}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-ink/60">ב.ל. שכבר שולם כשכיר</div>
                    <div className="font-bold text-ink">
                      {formatCurrency(combinedResult.employeePortionAlreadyPaid)}
                    </div>
                  </div>
                </div>
                <p className="text-xs text-ink/70">{combinedResult.note}</p>
              </div>
            )}

            {/* המלצות */}
            {result.recommendations.length > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-none p-4 space-y-2">
                <h4 className="text-sm font-bold text-amber-900">טיפים והמלצות</h4>
                {result.recommendations.map((r, i) => (
                  <p key={i} className="text-xs text-amber-900 flex gap-2">
                    <span className="flex-shrink-0">💡</span>
                    <span>{r}</span>
                  </p>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ===== טאב 2: פירוט והשוואה ===== */}
      {activeTab === 'breakdown' && (
        <div className="space-y-6">
          {/* פירוט מדרגות */}
          <div className="bg-paper border border-ink/15 rounded-none p-6">
            <h2 className="text-xl font-bold text-ink mb-4">פירוט מדרגות ב.ל.</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-ink text-cream border-b border-ink">
                  <tr>
                    <th className="text-right py-2 px-3 font-semibold">מדרגה</th>
                    <th className="text-right py-2 px-3 font-semibold">הכנסה</th>
                    <th className="text-left py-2 px-3 font-semibold">שיעור</th>
                    <th className="text-left py-2 px-3 font-semibold">ב.ל.</th>
                    <th className="text-left py-2 px-3 font-semibold">בריאות</th>
                    <th className="text-left py-2 px-3 font-semibold">סה&quot;כ</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-ink/10">
                    <td className="py-2 px-3 text-ink font-medium">
                      מופחת (עד {BL_SE_RATES_2026.reducedThreshold.toLocaleString('he-IL')} ₪)
                    </td>
                    <td className="py-2 px-3 tabular-nums text-ink/70">
                      {formatCurrency(result.tierBreakdown.reducedTierIncome)}
                    </td>
                    <td className="py-2 px-3 tabular-nums text-ink/70">
                      {formatPercent(BL_SE_RATES_2026.reducedRate.total, 2)}
                    </td>
                    <td className="py-2 px-3 tabular-nums text-ink/70">
                      {formatCurrency(result.tierBreakdown.reducedTierBL)}
                    </td>
                    <td className="py-2 px-3 tabular-nums text-green-700">
                      {formatCurrency(result.tierBreakdown.reducedTierHealth)}
                    </td>
                    <td className="py-2 px-3 tabular-nums font-bold text-ink">
                      {formatCurrency(result.tierBreakdown.reducedTierTotal)}
                    </td>
                  </tr>
                  <tr className="border-b border-ink/10">
                    <td className="py-2 px-3 text-red-700 font-medium">
                      מלא ({BL_SE_RATES_2026.reducedThreshold.toLocaleString('he-IL')}-
                      {BL_SE_RATES_2026.fullThreshold.toLocaleString('he-IL')} ₪)
                    </td>
                    <td className="py-2 px-3 tabular-nums text-ink/70">
                      {formatCurrency(result.tierBreakdown.fullTierIncome)}
                    </td>
                    <td className="py-2 px-3 tabular-nums text-red-700">
                      {formatPercent(BL_SE_RATES_2026.fullRate.total, 2)}
                    </td>
                    <td className="py-2 px-3 tabular-nums text-ink/70">
                      {formatCurrency(result.tierBreakdown.fullTierBL)}
                    </td>
                    <td className="py-2 px-3 tabular-nums text-green-700">
                      {formatCurrency(result.tierBreakdown.fullTierHealth)}
                    </td>
                    <td className="py-2 px-3 tabular-nums font-bold text-ink">
                      {formatCurrency(result.tierBreakdown.fullTierTotal)}
                    </td>
                  </tr>
                  {result.tierBreakdown.exemptIncome > 0 && (
                    <tr className="border-b border-ink/10 bg-cream-2">
                      <td className="py-2 px-3 text-ink/60 font-medium">
                        פטור (מעל {BL_SE_RATES_2026.fullThreshold.toLocaleString('he-IL')} ₪)
                      </td>
                      <td className="py-2 px-3 tabular-nums text-ink/60">
                        {formatCurrency(result.tierBreakdown.exemptIncome)}
                      </td>
                      <td className="py-2 px-3 text-ink/45">0%</td>
                      <td colSpan={3} className="py-2 px-3 text-ink/45 text-xs">
                        לא חייב בב.ל.
                      </td>
                    </tr>
                  )}
                  <tr className="bg-cream-2 border-t-2 border-ink/15">
                    <td colSpan={2} className="py-2 px-3 font-bold text-ink">
                      סה&quot;כ חודשי
                    </td>
                    <td className="py-2 px-3 tabular-nums font-bold text-ink/70">
                      {formatPercent(result.effectiveRate, 2)}
                    </td>
                    <td className="py-2 px-3 tabular-nums font-bold text-ink">
                      {formatCurrency(result.monthlyBL)}
                    </td>
                    <td className="py-2 px-3 tabular-nums font-bold text-green-700">
                      {formatCurrency(result.monthlyHealth)}
                    </td>
                    <td className="py-2 px-3 tabular-nums font-bold text-ink text-base">
                      {formatCurrency(result.monthlyTotal)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* השוואה לשכיר */}
          <div className="bg-paper border border-ink/15 rounded-none p-6">
            <h2 className="text-xl font-bold text-ink mb-2">השוואה לשכיר</h2>
            <p className="text-sm text-ink/60 mb-4">
              עצמאי משלם הן חלק עובד והן חלק מעסיק — לכן שיעורי ב.ל. גבוהים יותר
            </p>
            <div className="grid md:grid-cols-3 gap-4 mb-4">
              <div className="bg-cream-2 border border-ink/15 rounded-none p-4 text-center">
                <div className="text-xs text-ink/60 mb-1">שכיר - ב.ל. חודשי</div>
                <div className="text-2xl font-bold text-ink">
                  {formatCurrency(result.comparisonToEmployee.employeeMonthly)}
                </div>
                <div className="text-xs text-ink/60 mt-1">
                  (4.27% / 12.17%)
                </div>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-none p-4 text-center">
                <div className="text-xs text-red-700 mb-1">עצמאי - ב.ל. חודשי</div>
                <div className="text-2xl font-bold text-red-900">
                  {formatCurrency(result.monthlyTotal)}
                </div>
                <div className="text-xs text-red-600 mt-1">
                  (6.10% / 18.00%)
                </div>
              </div>
              <div className="bg-cream-2 border border-gold/40 rounded-none p-4 text-center">
                <div className="text-xs text-gold mb-1">הפרש שנתי</div>
                <div className="text-2xl font-bold text-ink">
                  {formatCurrency(result.comparisonToEmployee.differenceAnnual)}
                </div>
                <div className="text-xs text-gold mt-1">
                  {formatPercent(result.comparisonToEmployee.differencePercent, 1)} נוסף מהכנסה
                </div>
              </div>
            </div>

            {/* בר השוואה */}
            <ComparisonBar
              employeeMonthly={result.comparisonToEmployee.employeeMonthly}
              selfEmployedMonthly={result.monthlyTotal}
              monthlyIncome={input.monthlyIncome}
            />

            <div className="mt-4 p-3 bg-cream-2 rounded-none text-xs text-ink/70">
              <strong>למה עצמאי משלם יותר?</strong> {result.comparisonToEmployee.explanation}
            </div>
          </div>

          {/* טבלת שנתי */}
          <div className="bg-paper border border-ink/15 rounded-none p-5">
            <h3 className="font-bold text-ink mb-3">פירוט שנתי</h3>
            <div className="space-y-2 text-sm">
              <Row label="ב.ל. שנתי" value={formatCurrency(result.annualBL)} negative />
              <Row label="דמי בריאות שנתי" value={formatCurrency(result.annualHealth)} negative />
              <Row label="סה&quot;כ ב.ל. + בריאות שנתי" value={formatCurrency(result.annualTotal)} bold line negative />
              <Row label="52% מוכר כהוצאה" value={formatCurrency(result.taxDeductibleAmount)} mute />
              <Row label="עלות נטו אחרי הטבת מס (31%)" value={formatCurrency(result.netCostAfterTax)} bold highlight />
            </div>
          </div>
        </div>
      )}

      {/* ===== טאב 3: הטבת מס ===== */}
      {activeTab === 'taxbenefit' && (
        <div className="space-y-6">
          <div className="bg-cream-2 border border-ink/15 rounded-none p-5">
            <h2 className="text-xl font-bold text-ink mb-2">הטבת מס 52% — מה זה אומר?</h2>
            <p className="text-sm text-ink/70 leading-relaxed">
              לפי חוק מס הכנסה, <strong>52%</strong> מסכום ביטוח הלאומי ששילמת כעצמאי מוכר כ
              <strong>הוצאה עסקית</strong>. כלומר, 52% מהב.ל. מקטין את ההכנסה החייבת שלך — ובכך
              מפחית את מס ההכנסה שתשלם. ה-48% הנותרים אינם מוכרים.
            </p>
          </div>

          {/* שיעור מס שולי */}
          <div className="bg-paper border border-ink/15 rounded-none p-6 space-y-4">
            <h3 className="font-bold text-ink">שיעור מס שולי שלך</h3>
            <p className="text-sm text-ink/60">
              בחר את שיעור המס שחל על ההכנסה שלך (המדרגה הגבוהה ביותר):
            </p>
            <div className="flex flex-wrap gap-2">
              {MARGINAL_TAX_RATES.map((rate) => (
                <button
                  key={rate.value}
                  type="button"
                  onClick={() => setMarginalTaxRate(rate.value)}
                  className={`px-4 py-2 rounded-none border text-sm font-medium transition ${
                    marginalTaxRate === rate.value
                      ? 'bg-ink text-cream border-ink'
                      : 'bg-paper text-ink/70 border-ink/15 hover:border-ink/40'
                  }`}
                >
                  {rate.label}
                </button>
              ))}
            </div>
            <p className="text-xs text-ink/60">
              הכנסה חודשית {formatCurrency(input.monthlyIncome)} → שיעור מס שולי מוצע:{' '}
              <strong>{formatPercent(getSuggestedMarginalRate(input.monthlyIncome), 0)}</strong>
            </p>
          </div>

          {/* חישוב הטבה */}
          <div className="grid md:grid-cols-3 gap-4">
            <ResultCard
              title="ב.ל. שנתי (ברוטו)"
              value={formatCurrency(result.annualTotal)}
              subtitle="סכום ששולם לב.ל."
              variant="primary"
            />
            <ResultCard
              title="52% מוכר כהוצאה"
              value={formatCurrency(result.taxDeductibleAmount)}
              subtitle="מקטין הכנסה חייבת"
              variant="warning"
            />
            <ResultCard
              title="חסכון מס בפועל"
              value={formatCurrency(result.taxSavingAmount)}
              subtitle={`${formatPercent(marginalTaxRate, 0)} × ${formatCurrency(result.taxDeductibleAmount)}`}
              variant="success"
            />
          </div>

          {/* עלות נטו */}
          <div className="bg-emerald-50 border-2 border-emerald-300 rounded-none p-6 text-center">
            <p className="text-sm text-emerald-700 mb-2">עלות אמיתית של ב.ל. לאחר הטבת מס</p>
            <p className="text-4xl font-bold text-emerald-900">{formatCurrency(result.netCostAfterTax)}</p>
            <p className="text-sm text-emerald-700 mt-1">
              לשנה (חסכת {formatCurrency(result.taxSavingAmount)} בזכות הניכוי)
            </p>
          </div>

          {/* טבלת חישוב מפורטת */}
          <div className="bg-paper border border-ink/15 rounded-none p-5">
            <h3 className="font-bold text-ink mb-3">פירוט החישוב</h3>
            <div className="space-y-2 text-sm">
              <Row label="ב.ל. + בריאות שנתי (ברוטו)" value={formatCurrency(result.annualTotal)} />
              <Row
                label={`× 52% = חלק מוכר כהוצאה`}
                value={formatCurrency(result.taxDeductibleAmount)}
                mute
              />
              <Row
                label={`× ${formatPercent(marginalTaxRate, 0)} מס שולי = חסכון מס`}
                value={`- ${formatCurrency(result.taxSavingAmount)}`}
                mute
              />
              <Row
                label="עלות נטו אחרי הטבת מס"
                value={formatCurrency(result.netCostAfterTax)}
                bold
                line
                highlight
              />
              <Row
                label={`חלק ה-48% הלא מוכר`}
                value={formatCurrency(result.annualTotal * 0.48)}
                mute
              />
            </div>
          </div>

          {/* הסבר */}
          <div className="bg-amber-50 border border-amber-200 rounded-none p-4 text-sm text-amber-900 space-y-2">
            <h4 className="font-bold">מדוע רק 52% ולא 100%?</h4>
            <p>
              המחוקק קבע שחלק מהב.ל. מוכר כהוצאה כי הוא תשלום חובה הדרוש לצורך פעילות העסק.
              ה-48% הנותרים אינם מוכרים כי הם רכיב "אישי" של ביטוח (בריאות, פנסיה) שאינו
              "הוצאה עסקית" טהורה לפי ציוני רשות המסים.
            </p>
            <p>
              בכל מקרה — ה-52% מהווים הפחתת מס משמעותית של{' '}
              <strong>{formatCurrency(result.taxSavingAmount)}</strong> בשנה.
            </p>
          </div>
        </div>
      )}

      {/* ===== טאב 4: תיאום שנתי ===== */}
      {activeTab === 'reconciliation' && (
        <div className="space-y-6">
          <div className="bg-paper border border-ink/15 rounded-none p-6 space-y-5">
            <h2 className="text-xl font-bold text-ink">תיאום מקדמות ב.ל. שנתי</h2>
            <p className="text-sm text-ink/60">
              בתחילת שנה מגישים אומדן הכנסה לב.ל. ומשלמים לפיו. בסוף שנה — מתיאמים לפי הכנסה
              בפועל. הפרש לתשלום / החזר מגיע עד מרץ.
            </p>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-ink/70 mb-2">
                  הכנסה חודשית שהוערכה (לפיה שולם)
                </label>
                <input
                  type="number"
                  min={0}
                  step={1_000}
                  value={estimatedMonthly}
                  onChange={(e) => setEstimatedMonthly(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-ink/15 rounded-none text-lg"
                />
                <p className="text-xs text-ink/60 mt-1">
                  הכנסה שהצהרת בתחילת השנה לב.ל.
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-ink/70 mb-2">
                  הכנסה חודשית בפועל (סוף שנה)
                </label>
                <input
                  type="number"
                  min={0}
                  step={1_000}
                  value={actualMonthly}
                  onChange={(e) => setActualMonthly(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-ink/15 rounded-none text-lg"
                />
                <p className="text-xs text-ink/60 mt-1">
                  ההכנסה בפועל לאחר גמר שנת המס
                </p>
              </div>
            </div>
          </div>

          {/* תוצאות תיאום */}
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-cream-2 border border-ink/15 rounded-none p-4 text-center">
              <div className="text-xs text-ink/60 mb-1">ב.ל. ששולם (הערכה)</div>
              <div className="text-2xl font-bold text-ink">
                {formatCurrency(reconciliationResult.paidBL)}
              </div>
              <div className="text-xs text-ink/60 mt-1">שנתי</div>
            </div>
            <div className="bg-cream-2 border border-ink/15 rounded-none p-4 text-center">
              <div className="text-xs text-ink/60 mb-1">ב.ל. אמיתי (בפועל)</div>
              <div className="text-2xl font-bold text-ink">
                {formatCurrency(reconciliationResult.actualBL)}
              </div>
              <div className="text-xs text-ink/60 mt-1">שנתי</div>
            </div>
            <div
              className={`border-2 rounded-none p-4 text-center ${
                reconciliationResult.refundOrPayment === 'refund'
                  ? 'bg-green-50 border-green-300'
                  : reconciliationResult.refundOrPayment === 'payment'
                  ? 'bg-red-50 border-red-300'
                  : 'bg-cream-2 border-ink/20'
              }`}
            >
              <div
                className={`text-xs mb-1 ${
                  reconciliationResult.refundOrPayment === 'refund'
                    ? 'text-green-700'
                    : reconciliationResult.refundOrPayment === 'payment'
                    ? 'text-red-700'
                    : 'text-ink/60'
                }`}
              >
                {reconciliationResult.refundOrPayment === 'refund'
                  ? 'החזר צפוי'
                  : reconciliationResult.refundOrPayment === 'payment'
                  ? 'תשלום נוסף נדרש'
                  : 'מאוזן'}
              </div>
              <div
                className={`text-2xl font-bold ${
                  reconciliationResult.refundOrPayment === 'refund'
                    ? 'text-green-900'
                    : reconciliationResult.refundOrPayment === 'payment'
                    ? 'text-red-900'
                    : 'text-ink'
                }`}
              >
                {formatCurrency(Math.abs(reconciliationResult.difference))}
              </div>
            </div>
          </div>

          {/* המלצה */}
          <div
            className={`border-2 rounded-none p-5 ${
              reconciliationResult.refundOrPayment === 'refund'
                ? 'bg-green-50 border-green-300'
                : reconciliationResult.refundOrPayment === 'payment'
                ? 'bg-red-50 border-red-300'
                : 'bg-cream-2 border-ink/20'
            }`}
          >
            <h3 className="font-bold mb-2 text-ink">
              {reconciliationResult.refundOrPayment === 'refund'
                ? '✅ מגיע לך החזר מב.ל.'
                : reconciliationResult.refundOrPayment === 'payment'
                ? '⚠️ יש לשלם הפרש לב.ל.'
                : '✅ תשלומים מאוזנים'}
            </h3>
            <p className="text-sm text-ink/70">{reconciliationResult.recommendation}</p>
            {reconciliationResult.refundOrPayment === 'payment' &&
              reconciliationResult.interestIfLate3Months > 0 && (
                <p className="text-sm text-red-700 mt-2">
                  <strong>ריבית פיגורים אם תאחר 3 חודשים:</strong>{' '}
                  {formatCurrency(reconciliationResult.interestIfLate3Months)}
                </p>
              )}
          </div>

          {/* הנחיות */}
          <div className="bg-cream-2 border border-ink/15 rounded-none p-4 text-sm text-ink/70 space-y-2">
            <h4 className="font-bold">איך מגישים תיאום?</h4>
            <ul className="space-y-1 list-disc list-inside text-xs">
              <li>הגש דוח שנתי לב.ל. (טופס 1300 / שרות מקוון באתר btl.gov.il)</li>
              <li>מועד הגשה: עד 31 במרץ של השנה הבאה</li>
              <li>ניתן להגיש גם דרך רואה חשבון (עד יוני)</li>
              <li>ב.ל. ישלח הודעת הפרש / החזר לאחר עיבוד הדוח</li>
              <li>החזר מוחזר בדרך כלל תוך 30-60 יום</li>
            </ul>
          </div>
        </div>
      )}

      {/* ===== טאב 5: זכויות מ-ב.ל. ===== */}
      {activeTab === 'rights' && (
        <div className="space-y-6">
          {/* תחזית פנסיה */}
          <div className="bg-paper border border-ink/15 rounded-none p-6 space-y-4">
            <h2 className="text-xl font-bold text-ink">תחזית קצבת זקנה</h2>
            <p className="text-sm text-ink/60">
              קצבת זקנה מב.ל. מחושבת לפי &quot;נקודות ביטוח&quot; שנצברות עם השנים. כאן הערכה גסה:
            </p>

            <div>
              <label className="block text-sm font-medium text-ink/70 mb-2">
                שנות תשלום ב.ל. כעצמאי (עד היום)
              </label>
              <input
                type="number"
                min={0}
                max={45}
                step={1}
                value={input.yearsContributing ?? 5}
                onChange={(e) => update('yearsContributing', Number(e.target.value))}
                className="w-full px-3 py-2 border border-ink/15 rounded-none"
              />
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div className={`border-2 rounded-none p-4 text-center ${pensionProjection.meetsMinimumYears ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300'}`}>
                <div className={`text-xs mb-1 ${pensionProjection.meetsMinimumYears ? 'text-green-700' : 'text-red-700'}`}>
                  {pensionProjection.meetsMinimumYears ? '✅ עומד בדרישה' : '❌ חסר שנות ביטוח'}
                </div>
                <div className={`text-2xl font-bold ${pensionProjection.meetsMinimumYears ? 'text-green-900' : 'text-red-900'}`}>
                  {input.yearsContributing ?? 5} / {pensionProjection.minimumYearsRequired}
                </div>
                <div className="text-xs text-ink/60 mt-1">שנות ביטוח מינימום</div>
              </div>
              <div className="bg-cream-2 border border-ink/15 rounded-none p-4 text-center">
                <div className="text-xs text-ink/60 mb-1">גיל זכאות</div>
                <div className="text-2xl font-bold text-ink">{pensionProjection.retirementAge}</div>
                <div className="text-xs text-ink/60 mt-1">לגברים (65 לנשים)</div>
              </div>
              <div className="bg-cream-2 border border-gold/40 rounded-none p-4 text-center">
                <div className="text-xs text-gold mb-1">הערכת קצבה חודשית*</div>
                <div className="text-2xl font-bold text-ink">
                  {formatCurrency(pensionProjection.estimatedMonthlyPension)}
                </div>
                <div className="text-xs text-gold mt-1">* אינדיקציה בלבד</div>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-none p-3 text-xs text-amber-800">
              <strong>חשוב:</strong> תחזית זו היא אינדיקציה גסה בלבד. הקצבה האמיתית מחושבת
              על ידי ב.ל. לפי &quot;נקודות ביטוח&quot; שנצברו לאורך כל שנות העבודה. לבדיקה מדויקת —
              פנה לב.ל. או היכנס לאזור האישי באתר btl.gov.il.
            </div>
          </div>

          {/* רשימת זכויות */}
          <div className="bg-paper border border-ink/15 rounded-none p-6">
            <h2 className="text-xl font-bold text-ink mb-4">זכויות עצמאי מב.ל.</h2>
            <div className="space-y-4">
              {RIGHTS.map((right) => (
                <div key={right.title} className="border border-ink/15 rounded-none p-4">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{right.icon}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-bold text-ink">{right.title}</h4>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                            right.status === 'full'
                              ? 'bg-green-100 text-green-700'
                              : right.status === 'partial'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {right.status === 'full'
                            ? 'זכאי מלא'
                            : right.status === 'partial'
                            ? 'זכאי חלקי'
                            : 'מוגבל'}
                        </span>
                      </div>
                      <p className="text-sm text-ink/70">{right.description}</p>
                      {right.condition && (
                        <p className="text-xs text-gold mt-1">
                          <strong>תנאי:</strong> {right.condition}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* הבדל מעיקרי מהשכיר */}
          <div className="bg-cream-2 border border-gold/40 rounded-none p-4 text-sm text-ink/70 space-y-2">
            <h4 className="font-bold text-ink">ההבדל העיקרי מזכויות שכיר</h4>
            <ul className="space-y-1 list-disc list-inside text-xs">
              <li>
                <strong>דמי לידה:</strong> שכיר זכאי ל-26 שבועות; עצמאי זכאי ל-15 שבועות (אם
                שילם ב.ל. ב-10 מתוך 14 חודשים לפני הלידה)
              </li>
              <li>
                <strong>אבטלה:</strong> עצמאי בדרך כלל לא זכאי לדמי אבטלה (אלא אם סגר עסק
                ועבד כשכיר 12 חודשים לאחר מכן)
              </li>
              <li>
                <strong>פגיעת עבודה:</strong> עצמאי זכאי לפיצוי, אך הגדרת &quot;פגיעה בעבודה&quot; מצומצמת
                יותר
              </li>
              <li>
                <strong>קצבת זקנה:</strong> עצמאי זכאי לאותה קצבה כמו שכיר, בתנאי צבירת שנות ביטוח
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// רכיבי עזר
// ============================================================

function Row({
  label,
  value,
  bold,
  mute,
  line,
  highlight,
  negative,
}: {
  label: string;
  value: string;
  bold?: boolean;
  mute?: boolean;
  line?: boolean;
  highlight?: boolean;
  negative?: boolean;
}) {
  return (
    <div
      className={`flex justify-between items-center py-1.5 ${
        line ? 'border-t border-ink/15 pt-2.5 mt-1' : ''
      } ${highlight ? 'bg-emerald-50 -mx-2 px-2 rounded-none' : ''}`}
    >
      <span className={`${mute ? 'text-ink/60' : 'text-ink'} ${bold ? 'font-bold' : ''}`}>
        {label}
      </span>
      <span
        className={`tabular-nums ${bold ? 'font-bold text-ink' : ''} ${
          mute ? 'text-ink/60' : ''
        } ${negative ? 'text-red-700' : ''}`}
      >
        {value}
      </span>
    </div>
  );
}

function TierBar({
  result,
  monthlyIncome,
}: {
  result: ReturnType<typeof calculateBituachLeumiSelfEmployed>;
  monthlyIncome: number;
}) {
  const safeIncome = Math.max(0, monthlyIncome);
  if (safeIncome === 0) {
    return (
      <div className="text-sm text-ink/60">
        תשלום מינימום: {formatCurrency(BL_SE_RATES_2026.minimumMonthlyPayment)}/חודש
      </div>
    );
  }

  const capped = Math.min(safeIncome, BL_SE_RATES_2026.fullThreshold);

  const reducedPct = (result.tierBreakdown.reducedTierIncome / capped) * 100;
  const fullPct = (result.tierBreakdown.fullTierIncome / capped) * 100;
  const exemptPct = result.tierBreakdown.exemptIncome > 0
    ? (result.tierBreakdown.exemptIncome / safeIncome) * 100
    : 0;

  const items = [
    {
      label: `מופחת ${formatPercent(BL_SE_RATES_2026.reducedRate.total, 2)}`,
      value: result.tierBreakdown.reducedTierTotal,
      income: result.tierBreakdown.reducedTierIncome,
      pct: reducedPct,
      color: 'bg-ink',
      textColor: 'text-ink',
    },
    ...(result.tierBreakdown.fullTierIncome > 0
      ? [
          {
            label: `מלא ${formatPercent(BL_SE_RATES_2026.fullRate.total, 2)}`,
            value: result.tierBreakdown.fullTierTotal,
            income: result.tierBreakdown.fullTierIncome,
            pct: fullPct,
            color: 'bg-red-500',
            textColor: 'text-red-700',
          },
        ]
      : []),
    ...(result.tierBreakdown.exemptIncome > 0
      ? [
          {
            label: 'פטור 0%',
            value: 0,
            income: result.tierBreakdown.exemptIncome,
            pct: exemptPct,
            color: 'bg-ink/20',
            textColor: 'text-ink/60',
          },
        ]
      : []),
  ];

  return (
    <div className="space-y-3">
      <div className="flex h-8 rounded-none overflow-hidden border border-ink/15">
        {items.map((item) => (
          <div
            key={item.label}
            className={`${item.color} flex items-center justify-center text-cream text-xs font-bold`}
            style={{ width: `${item.pct}%` }}
            title={`${item.label}: ${formatCurrency(item.income)} הכנסה`}
          >
            {item.pct >= 10 ? `${item.pct.toFixed(0)}%` : ''}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
        {items.map((item) => (
          <div key={item.label} className="flex items-start gap-2">
            <div className={`w-3 h-3 rounded-none ${item.color} flex-shrink-0 mt-0.5`} />
            <div>
              <div className={`${item.textColor} font-medium`}>{item.label}</div>
              <div className="text-ink/60">{formatCurrency(item.income)} הכנסה</div>
              {item.value > 0 && (
                <div className="text-ink/70 font-medium">{formatCurrency(item.value)} ב.ל.</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ComparisonBar({
  employeeMonthly,
  selfEmployedMonthly,
  monthlyIncome,
}: {
  employeeMonthly: number;
  selfEmployedMonthly: number;
  monthlyIncome: number;
}) {
  const maxBar = Math.max(employeeMonthly, selfEmployedMonthly, 1);
  const empPct = (employeeMonthly / maxBar) * 100;
  const sePct = (selfEmployedMonthly / maxBar) * 100;
  const incPct = Math.min((monthlyIncome / maxBar) * 100, 100);

  return (
    <div className="space-y-3 text-sm">
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <span className="w-24 text-right text-ink font-medium text-xs">שכיר</span>
          <div className="flex-1 bg-cream-2 rounded-none h-6 overflow-hidden">
            <div
              className="h-full bg-ink rounded-none flex items-center justify-end px-2"
              style={{ width: `${empPct}%` }}
            >
              <span className="text-cream text-xs font-bold">
                {formatCurrency(employeeMonthly)}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="w-24 text-right text-red-700 font-medium text-xs">עצמאי</span>
          <div className="flex-1 bg-cream-2 rounded-none h-6 overflow-hidden">
            <div
              className="h-full bg-red-500 rounded-none flex items-center justify-end px-2"
              style={{ width: `${sePct}%` }}
            >
              <span className="text-white text-xs font-bold">
                {formatCurrency(selfEmployedMonthly)}
              </span>
            </div>
          </div>
        </div>
      </div>
      <p className="text-xs text-ink/60">
        הפרש: עצמאי משלם{' '}
        <strong className="text-red-700">
          {formatCurrency(selfEmployedMonthly - employeeMonthly)} יותר
        </strong>{' '}
        לחודש ({formatPercent((selfEmployedMonthly - employeeMonthly) / Math.max(monthlyIncome, 1), 1)} מהכנסה)
      </p>
    </div>
  );
}

// ============================================================
// נתוני זכויות
// ============================================================

const RIGHTS = [
  {
    icon: '🪖',
    title: 'מילואים (Reserve Duty)',
    status: 'full' as const,
    description:
      'עצמאי שגוייס למילואים זכאי לדמי מילואים ב-100% מההכנסה היומית הממוצעת. ב.ל. מחשב לפי הכנסה ממוצעת מהשנה הקודמת.',
    condition: 'נדרשת צו גיוס רשמי. ההשלמה לב.ל. - תוך 6 חודשים מסיום המילואים.',
  },
  {
    icon: '🤰',
    title: 'דמי לידה (Maternity)',
    status: 'partial' as const,
    description:
      'עצמאית זכאית ל-15 שבועות דמי לידה (לעומת 26 לשכירה). הסכום נחשב לפי ממוצע הכנסה ב-3 חודשים לפני הלידה.',
    condition: 'שילמה ב.ל. ב-10 מתוך 14 חודשים לפני הלידה.',
  },
  {
    icon: '🤕',
    title: 'פגיעת עבודה (Work Injury)',
    status: 'partial' as const,
    description:
      'תאונה שאירעה בעת ביצוע עבודה עצמאית מזכה בדמי פגיעה. התשלום: 75% מהכנסה היומית הממוצעת עד 90 יום.',
    condition: 'יש להוכיח שהתאונה אירעה בעת ביצוע פעילות עסקית ישירה.',
  },
  {
    icon: '♿',
    title: 'נכות כללית (Disability)',
    status: 'full' as const,
    description:
      'אם כתוצאה ממחלה/תאונה אינך יכול לעבוד לתקופה ממושכת — קצבת נכות חודשית. נדרשת בדיקה רפואית ותפקודית.',
    condition: 'ירידה ביכולת להשתכר של 50%+ לפחות 6 חודשים.',
  },
  {
    icon: '👴',
    title: 'קצבת זקנה (Pension)',
    status: 'full' as const,
    description:
      'קצבה חודשית לכל החיים מגיל 67 (גברים) / 65 (נשים). גובהה תלוי בשנות הביטוח ובנקודות הביטוח שנצברו.',
    condition: 'מינימום 5 שנות ביטוח. קצבה מלאה — לאחר 10+ שנות ביטוח.',
  },
  {
    icon: '😢',
    title: 'שארים (Survivors)',
    status: 'full' as const,
    description:
      'במות עצמאי מבוטח — בן/בת הזוג וילדים קטינים זכאים לקצבת שאירים חודשית.',
    condition: 'הנפטר שילם ב.ל. ב-12 מתוך 24 החודשים לפני הפטירה.',
  },
  {
    icon: '💼',
    title: 'אבטלה (Unemployment)',
    status: 'limited' as const,
    description:
      'עצמאי שסגר עסק ועבד אחר-כך כשכיר 12 חודשים — עשוי להיות זכאי לדמי אבטלה. עצמאי טהור שסגר עסק אינו זכאי.',
    condition: 'נדרש: 12 חודשי עבודה כשכיר לאחר סגירת העסק העצמאי.',
  },
  {
    icon: '🎁',
    title: 'מענק מיוחד / פטירה',
    status: 'full' as const,
    description:
      'מענק פטירה (לשאירים), מענק לרגל נישואין, מענק לידה — כל אלה ניתנים גם לעצמאים המבוטחים.',
    condition: 'תנאי הזכאות משתנים לפי סוג המענק.',
  },
];

// ============================================================
// פונקציה עזר: שיעור מס שולי מומלץ
// ============================================================

function getSuggestedMarginalRate(monthlyIncome: number): number {
  const annual = monthlyIncome * 12;
  if (annual <= 84_120) return 0.10;
  if (annual <= 120_720) return 0.14;
  if (annual <= 228_000) return 0.20;
  if (annual <= 301_200) return 0.31;
  if (annual <= 560_280) return 0.35;
  return 0.47;
}
