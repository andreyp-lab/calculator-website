'use client';

import { useState, useMemo } from 'react';
import {
  calculateTaxAdvances,
  calculateLatePayment,
  type TaxAdvancesInput,
  type AdvanceFrequency,
} from '@/lib/calculators/tax-advances';
import { formatCurrency, formatPercent } from '@/lib/utils/formatters';
import { ResultCard } from '@/components/calculator/ResultCard';

// ============================================================
// ברירות מחדל
// ============================================================

const initial: TaxAdvancesInput = {
  expectedAnnualIncome: 200_000,
  creditPoints: 2.25,
  isVatRegistered: true,
  frequency: 'bimonthly',
  annualVatCollected: 36_000,
  annualVatDeductible: 12_000,
  monthlyPensionDeposit: 1_000,
  monthlyStudyFundDeposit: 500,
  actualIncomeYTD: undefined,
  advancesPaidYTD: undefined,
  currentMonth: new Date().getMonth() + 1,
};

// ============================================================
// רכיב ראשי
// ============================================================

export function TaxAdvancesCalculator() {
  const [input, setInput] = useState<TaxAdvancesInput>(initial);
  const [activeTab, setActiveTab] = useState<'main' | 'cashflow' | 'midyear' | 'late'>('main');
  const [showSchedule, setShowSchedule] = useState(false);

  // Late payment calculator state (נפרד מהחישוב הראשי)
  const [lateAmount, setLateAmount] = useState(5_000);
  const [lateMonths, setLateMonths] = useState(3);

  const result = useMemo(() => calculateTaxAdvances(input), [input]);

  const lateResult = useMemo(
    () => calculateLatePayment({ unpaidAmount: lateAmount, monthsLate: lateMonths }),
    [lateAmount, lateMonths],
  );

  function update<K extends keyof TaxAdvancesInput>(k: K, v: TaxAdvancesInput[K]) {
    setInput((p) => ({ ...p, [k]: v }));
  }

  const freqLabel = input.frequency === 'monthly' ? 'חודשית' : 'דו-חודשית';

  const tabs = [
    { id: 'main' as const, label: 'חישוב מקדמות' },
    { id: 'cashflow' as const, label: 'תזרים מזומנים' },
    { id: 'midyear' as const, label: 'תיאום אמצע שנה' },
    { id: 'late' as const, label: 'ריבית פיגורים' },
  ];

  return (
    <div className="space-y-6">
      {/* טאבים */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl overflow-x-auto">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setActiveTab(t.id)}
            className={`flex-1 min-w-fit px-3 py-2 rounded-lg text-sm font-medium transition whitespace-nowrap ${
              activeTab === t.id
                ? 'bg-white text-blue-700 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ===== טאב ראשי ===== */}
      {activeTab === 'main' && (
        <div className="grid lg:grid-cols-5 gap-6">
          {/* קלט */}
          <div className="lg:col-span-3 space-y-5">
            {/* פרטי הכנסה */}
            <div className="bg-white border-2 border-gray-200 rounded-xl p-6 space-y-5">
              <h2 className="text-xl font-bold text-gray-900">פרטי ההכנסה</h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  הכנסה שנתית צפויה — אחרי הוצאות מוכרות (₪)
                </label>
                <input
                  type="number"
                  min={0}
                  step={5_000}
                  value={input.expectedAnnualIncome}
                  onChange={(e) => update('expectedAnnualIncome', Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-lg"
                />
                <p className="text-xs text-gray-500 mt-1">
                  הכנסה ברוטו פחות הוצאות מוכרות. לא כולל מע"מ.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    נקודות זיכוי
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={10}
                    step={0.25}
                    value={input.creditPoints}
                    onChange={(e) => update('creditPoints', Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    תושב: 2.25 | אישה: +0.5 | ילד: +1-2.5
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    תדירות תשלום
                  </label>
                  <select
                    value={input.frequency}
                    onChange={(e) => update('frequency', e.target.value as AdvanceFrequency)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="monthly">חודשי (12 תשלומים)</option>
                    <option value="bimonthly">דו-חודשי (6 תשלומים)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* ניכויים */}
            <div className="bg-white border-2 border-gray-200 rounded-xl p-6 space-y-4">
              <h2 className="text-lg font-bold text-gray-900">ניכויים פנסיוניים</h2>
              <p className="text-xs text-gray-500">
                ניכויים אלה מקטינים את ההכנסה החייבת ובכך מפחיתים את מקדמות המס
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    פנסיה חודשית (₪)
                  </label>
                  <input
                    type="number"
                    min={0}
                    step={50}
                    value={input.monthlyPensionDeposit ?? 0}
                    onChange={(e) => update('monthlyPensionDeposit', Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    ניכוי עד 11% מהכנסה (שנתי:{' '}
                    {formatCurrency((input.monthlyPensionDeposit ?? 0) * 12)})
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    קרן השתלמות חודשית (₪)
                  </label>
                  <input
                    type="number"
                    min={0}
                    step={50}
                    value={input.monthlyStudyFundDeposit ?? 0}
                    onChange={(e) => update('monthlyStudyFundDeposit', Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    ניכוי עד 4.5% (מקסימום 20,520 ₪/שנה)
                  </p>
                </div>
              </div>
              {(result.annualPensionDeduction > 0 || result.annualStudyFundDeduction > 0) && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-xs text-green-900">
                  חסכת במס:{' '}
                  <strong>
                    {formatCurrency(
                      (result.annualPensionDeduction + result.annualStudyFundDeduction) * 0.35,
                    )}
                  </strong>{' '}
                  בזכות הניכויים הפנסיוניים (הכנסה חייבת:{' '}
                  {formatCurrency(result.taxableIncome)})
                </div>
              )}
            </div>

            {/* מע"מ */}
            <div className="bg-white border-2 border-gray-200 rounded-xl p-6 space-y-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={input.isVatRegistered}
                  onChange={(e) => update('isVatRegistered', e.target.checked)}
                  className="w-4 h-4"
                />
                <div>
                  <span className="text-base font-semibold text-gray-900">עוסק מורשה</span>
                  <p className="text-xs text-gray-500">חייב בגביית ותשלום מע"מ 18%</p>
                </div>
              </label>

              {input.isVatRegistered && (
                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-100">
                  <div>
                    <label className="block text-xs font-medium text-blue-900 mb-1">
                      מע"מ עסקאות שנתי (₪)
                    </label>
                    <input
                      type="number"
                      min={0}
                      step={1_000}
                      value={input.annualVatCollected ?? 0}
                      onChange={(e) => update('annualVatCollected', Number(e.target.value))}
                      className="w-full px-2 py-1.5 border border-blue-300 rounded text-sm"
                    />
                    <p className="text-xs text-gray-400 mt-0.5">
                      מחזור × 18% ={' '}
                      {formatCurrency(input.expectedAnnualIncome * 0.18)} (אומדן)
                    </p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-blue-900 mb-1">
                      מע"מ תשומות שנתי (₪)
                    </label>
                    <input
                      type="number"
                      min={0}
                      step={1_000}
                      value={input.annualVatDeductible ?? 0}
                      onChange={(e) => update('annualVatDeductible', Number(e.target.value))}
                      className="w-full px-2 py-1.5 border border-blue-300 rounded text-sm"
                    />
                    <p className="text-xs text-gray-400 mt-0.5">
                      קניות עסקיות × 18% — מקוזז מהעסקאות
                    </p>
                  </div>
                  {result.annualVatPayable > 0 && (
                    <div className="col-span-2 bg-blue-50 border border-blue-200 rounded p-2 text-xs text-blue-900">
                      מע"מ נטו לתשלום: <strong>{formatCurrency(result.annualVatPayable)}</strong>{' '}
                      לשנה ({result.paymentsPerYear === 6 ? 'כל חודשיים' : 'חודשי'}:{' '}
                      {formatCurrency(result.perPaymentBreakdown.vat)})
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* תוצאות */}
          <div className="lg:col-span-2 space-y-4">
            <ResultCard
              title={`מקדמה ${freqLabel}`}
              value={formatCurrency(result.perPaymentAmount)}
              subtitle={`${result.paymentsPerYear} תשלומים בשנה`}
              variant="success"
            />

            <ResultCard
              title="סך מקדמות שנתי"
              value={formatCurrency(result.totalAnnual)}
              subtitle={`שיעור מס מצרפי: ${formatPercent(result.effectiveTaxRate, 1)}`}
              variant="primary"
            />

            <ResultCard
              title="הפרשה חודשית מומלצת"
              value={formatCurrency(result.monthlySetAside)}
              subtitle={`${formatPercent(result.setAsidePercent, 0)} מההכנסה החודשית`}
              variant="warning"
            />

            {/* פירוט */}
            <div className="bg-white border-2 border-gray-200 rounded-xl p-4 space-y-2 text-sm">
              <h4 className="font-bold text-gray-900 mb-3">פירוט שנתי</h4>
              <Row label="הכנסה צפויה" value={formatCurrency(input.expectedAnnualIncome)} />
              {result.annualPensionDeduction > 0 && (
                <Row
                  label="(-) ניכוי פנסיה"
                  value={`- ${formatCurrency(result.annualPensionDeduction)}`}
                  mute
                />
              )}
              {result.annualStudyFundDeduction > 0 && (
                <Row
                  label="(-) ניכוי קרן השתלמות"
                  value={`- ${formatCurrency(result.annualStudyFundDeduction)}`}
                  mute
                />
              )}
              <Row
                label="הכנסה חייבת"
                value={formatCurrency(result.taxableIncome)}
                bold
                line
              />
              <Row
                label="מס הכנסה"
                value={formatCurrency(result.annualIncomeTax)}
                sub={formatPercent(result.incomeTaxRate, 1)}
                negative
              />
              <Row
                label="ב.ל. + בריאות"
                value={formatCurrency(result.annualSocialSecurity)}
                sub={formatPercent(result.socialSecurityRate, 1)}
                negative
              />
              {result.annualVatPayable > 0 && (
                <Row
                  label='מע"מ נטו'
                  value={formatCurrency(result.annualVatPayable)}
                  mute
                />
              )}
              <Row
                label="סך מקדמות (ללא מע&quot;מ)"
                value={formatCurrency(result.annualIncomeTax + result.annualSocialSecurity)}
                bold
                line
                highlight
              />

              {/* פר תשלום */}
              <div className="pt-2 border-t border-gray-100 mt-2">
                <h5 className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">
                  פר תשלום {freqLabel}
                </h5>
                <Row
                  label="מס הכנסה"
                  value={formatCurrency(result.perPaymentBreakdown.incomeTax)}
                />
                <Row
                  label="ב.ל. + בריאות"
                  value={formatCurrency(result.perPaymentBreakdown.socialSecurity)}
                />
                {result.perPaymentBreakdown.vat > 0 && (
                  <Row label='מע"מ' value={formatCurrency(result.perPaymentBreakdown.vat)} />
                )}
                <Row label="סה&quot;כ" value={formatCurrency(result.perPaymentAmount)} bold />
              </div>
            </div>

            {/* חלוקה ויזואלית */}
            <div className="bg-white border-2 border-gray-200 rounded-xl p-4">
              <h4 className="font-bold text-gray-900 mb-3 text-sm">חלוקת המקדמות</h4>
              <TaxBreakdownBar result={result} />
            </div>

            {/* לוח תשלומים */}
            <button
              type="button"
              onClick={() => setShowSchedule((v) => !v)}
              className="w-full text-sm text-blue-600 hover:text-blue-800 underline text-center py-1"
            >
              {showSchedule ? 'הסתר לוח תשלומים' : 'הצג לוח תשלומים שנתי'}
            </button>

            {showSchedule && (
              <PaymentScheduleTable schedule={result.paymentSchedule} />
            )}

            {/* המלצות */}
            {result.recommendations.length > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-2">
                <h4 className="text-sm font-bold text-amber-900">המלצות</h4>
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

      {/* ===== טאב תזרים ===== */}
      {activeTab === 'cashflow' && (
        <div className="space-y-6">
          <div className="grid md:grid-cols-3 gap-4">
            <ResultCard
              title="הפרשה חודשית"
              value={formatCurrency(result.monthlySetAside)}
              subtitle={`${formatPercent(result.setAsidePercent, 0)} מהכנסה`}
              variant="warning"
            />
            <ResultCard
              title="סה&quot;כ לשנה"
              value={formatCurrency(result.totalAnnual)}
              subtitle={`${result.paymentsPerYear} תשלומים`}
              variant="primary"
            />
            <ResultCard
              title="מקדמה לתשלום"
              value={formatCurrency(result.perPaymentAmount)}
              subtitle={`כל ${input.frequency === 'monthly' ? 'חודש' : 'חודשיים'}`}
              variant="success"
            />
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
            <h3 className="font-bold text-blue-900 mb-2">עיקרון ה-X% מדי חודש</h3>
            <p className="text-sm text-blue-800">
              הפרש <strong>{formatCurrency(result.monthlySetAside)}</strong> (
              {formatPercent(result.setAsidePercent, 0)}) מכל תשלום שתקבל לחשבון נפרד. כך כשיגיע
              מועד המקדמה — הכסף כבר שם.
            </p>
          </div>

          <div className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden">
            <div className="p-4 border-b border-gray-100">
              <h3 className="font-bold text-gray-900">תזרים חודשי — 2026</h3>
              <p className="text-xs text-gray-500 mt-1">
                כולל: הפרשה חודשית מומלצת + מועדי תשלום
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-right py-2 px-3 font-semibold text-gray-700">חודש</th>
                    <th className="text-left py-2 px-3 font-semibold text-gray-700">
                      הפרשה חודשית
                    </th>
                    <th className="text-left py-2 px-3 font-semibold text-gray-700">
                      מצטבר בחיסכון
                    </th>
                    <th className="text-left py-2 px-3 font-semibold text-gray-700">
                      תשלום מקדמה
                    </th>
                    <th className="text-left py-2 px-3 font-semibold text-gray-700">
                      יתרה לאחר תשלום
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {result.cashFlowPlan.map((row) => (
                    <tr
                      key={row.month}
                      className={`border-b border-gray-100 ${
                        row.paymentDue ? 'bg-amber-50' : 'hover:bg-gray-50'
                      }`}
                    >
                      <td className="py-2 px-3 font-medium text-gray-800">{row.monthName}</td>
                      <td className="py-2 px-3 tabular-nums text-green-700">
                        +{formatCurrency(row.suggestedSetAside)}
                      </td>
                      <td className="py-2 px-3 tabular-nums text-gray-700">
                        {formatCurrency(row.cumulativeSetAside)}
                      </td>
                      <td className="py-2 px-3 tabular-nums">
                        {row.paymentDue ? (
                          <span className="text-red-700 font-semibold">
                            -{formatCurrency(row.paymentDue)}
                          </span>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                      <td
                        className={`py-2 px-3 tabular-nums font-medium ${
                          row.balanceAfterPayment < 0 ? 'text-red-700' : 'text-emerald-700'
                        }`}
                      >
                        {formatCurrency(row.balanceAfterPayment)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white border-2 border-gray-200 rounded-xl p-5 space-y-3">
            <h3 className="font-bold text-gray-900">לוח תשלומי מע&quot;מ (עוסק מורשה)</h3>
            {input.isVatRegistered ? (
              <div className="space-y-2 text-sm">
                <p className="text-gray-600">
                  מע&quot;מ מדווח ומשולם כל חודשיים (דו-חודשי) — בנפרד ממס הכנסה וב.ל.
                </p>
                <div className="grid grid-cols-3 gap-3 text-center">
                  {['מרץ', 'מאי', 'יולי', 'ספטמבר', 'נובמבר', 'ינואר'].map((m) => (
                    <div key={m} className="bg-blue-50 border border-blue-200 rounded-lg p-2">
                      <div className="text-xs text-blue-700 font-medium">15 ב{m}</div>
                      <div className="font-bold text-blue-900 text-sm">
                        {formatCurrency(result.annualVatPayable / 6)}
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-500">
                  * תאריך הגשה: 15 לחודש שאחרי סיום התקופה. תשלום עד אותו תאריך.
                </p>
              </div>
            ) : (
              <p className="text-sm text-gray-500">
                עוסק פטור — פטור מדיווח וגביית מע&quot;מ (עד {(120_000).toLocaleString('he-IL')}{' '}
                ₪/שנה)
              </p>
            )}
          </div>
        </div>
      )}

      {/* ===== טאב תיאום אמצע שנה ===== */}
      {activeTab === 'midyear' && (
        <div className="space-y-6">
          <div className="bg-white border-2 border-gray-200 rounded-xl p-6 space-y-5">
            <h2 className="text-xl font-bold text-gray-900">תיאום מקדמות אמצע שנה</h2>
            <p className="text-sm text-gray-600">
              אם ההכנסה בפועל שונה מהתכנון — כדאי לדווח על תיאום מקדמות (טופס 1300 / פניה
              לרשות המסים)
            </p>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  חודש נוכחי (1-12)
                </label>
                <input
                  type="number"
                  min={1}
                  max={12}
                  value={input.currentMonth ?? new Date().getMonth() + 1}
                  onChange={(e) => update('currentMonth', Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  הכנסה בפועל מתחילת השנה (₪)
                </label>
                <input
                  type="number"
                  min={0}
                  step={5_000}
                  value={input.actualIncomeYTD ?? ''}
                  placeholder="הזן הכנסה בפועל"
                  onChange={(e) =>
                    update(
                      'actualIncomeYTD',
                      e.target.value === '' ? undefined : Number(e.target.value),
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  מקדמות שולמו עד כה (₪)
                </label>
                <input
                  type="number"
                  min={0}
                  step={1_000}
                  value={input.advancesPaidYTD ?? ''}
                  placeholder="הזן סה&quot;כ שולם"
                  onChange={(e) =>
                    update(
                      'advancesPaidYTD',
                      e.target.value === '' ? undefined : Number(e.target.value),
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* תיאום אמצע שנה */}
          {result.midYearAdjustment ? (
            <div className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-center">
                  <div className="text-xs text-gray-500 mb-1">תכנית מקורית (שנתי)</div>
                  <div className="text-2xl font-bold text-gray-800">
                    {formatCurrency(result.midYearAdjustment.originalPlan)}
                  </div>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
                  <div className="text-xs text-blue-700 mb-1">הכנסה שנתית צפויה (מוצפת)</div>
                  <div className="text-2xl font-bold text-blue-900">
                    {formatCurrency(result.midYearAdjustment.projectedAnnual)}
                  </div>
                  <div
                    className={`text-xs mt-1 font-medium ${
                      result.midYearAdjustment.changePercent > 0
                        ? 'text-orange-600'
                        : 'text-green-600'
                    }`}
                  >
                    {result.midYearAdjustment.changePercent > 0 ? '▲' : '▼'}{' '}
                    {formatPercent(Math.abs(result.midYearAdjustment.changePercent), 1)} מהתכנית
                  </div>
                </div>
                <div
                  className={`border-2 rounded-xl p-4 text-center ${
                    result.midYearAdjustment.shouldAdjust
                      ? 'bg-red-50 border-red-300'
                      : 'bg-green-50 border-green-300'
                  }`}
                >
                  <div
                    className={`text-xs mb-1 ${
                      result.midYearAdjustment.shouldAdjust ? 'text-red-700' : 'text-green-700'
                    }`}
                  >
                    מקדמה {input.frequency === 'monthly' ? 'חודשית' : 'דו-חודשית'} מומלצת
                  </div>
                  <div
                    className={`text-2xl font-bold ${
                      result.midYearAdjustment.shouldAdjust ? 'text-red-900' : 'text-green-900'
                    }`}
                  >
                    {formatCurrency(result.midYearAdjustment.newAdviceAdvance)}
                  </div>
                  <div className="text-xs mt-1 text-gray-600">
                    {result.midYearAdjustment.advanceDiff > 0 ? '+' : ''}
                    {formatCurrency(result.midYearAdjustment.advanceDiff)} מהמקדמה הנוכחית
                  </div>
                </div>
              </div>

              <div
                className={`border-2 rounded-xl p-5 ${
                  result.midYearAdjustment.shouldAdjust
                    ? 'bg-orange-50 border-orange-300'
                    : 'bg-green-50 border-green-300'
                }`}
              >
                <h3
                  className={`font-bold mb-2 ${
                    result.midYearAdjustment.shouldAdjust ? 'text-orange-900' : 'text-green-900'
                  }`}
                >
                  {result.midYearAdjustment.shouldAdjust
                    ? '⚠️ מומלץ לדווח תיאום מקדמות'
                    : '✅ אין צורך בתיאום'}
                </h3>
                <p
                  className={`text-sm ${
                    result.midYearAdjustment.shouldAdjust ? 'text-orange-800' : 'text-green-800'
                  }`}
                >
                  {result.midYearAdjustment.adjustmentReason}
                </p>
                {result.midYearAdjustment.shouldAdjust && (
                  <p className="text-xs text-orange-700 mt-2">
                    פנה לרשות המסים לבקשת תיאום מקדמות (טופס 1300 / שירות מקוון). ניתן לבצע
                    בכל עת במהלך השנה.
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 text-center text-gray-500">
              <p>הזן הכנסה בפועל מתחילת השנה + חודש נוכחי לחישוב תיאום</p>
            </div>
          )}

          {/* הערכת גמר שנה */}
          {result.reconciliationEstimate && (
            <div className="bg-white border-2 border-gray-200 rounded-xl p-6 space-y-4">
              <h3 className="text-lg font-bold text-gray-900">הערכת גמר שנה (טופס 1301)</h3>
              <div className="grid md:grid-cols-3 gap-4 text-center">
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="text-xs text-gray-500 mb-1">מקדמות ששולמו</div>
                  <div className="text-2xl font-bold text-gray-800">
                    {formatCurrency(result.reconciliationEstimate.totalAdvancesPaid)}
                  </div>
                </div>
                <div className="bg-blue-50 rounded-xl p-4">
                  <div className="text-xs text-blue-600 mb-1">חבות מס אמיתית</div>
                  <div className="text-2xl font-bold text-blue-900">
                    {formatCurrency(result.reconciliationEstimate.actualTaxLiability)}
                  </div>
                </div>
                <div
                  className={`rounded-xl p-4 ${
                    result.reconciliationEstimate.isRefund
                      ? 'bg-green-50'
                      : 'bg-red-50'
                  }`}
                >
                  <div
                    className={`text-xs mb-1 ${
                      result.reconciliationEstimate.isRefund ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {result.reconciliationEstimate.isRefund ? 'החזר מס צפוי' : 'תשלום נוסף צפוי'}
                  </div>
                  <div
                    className={`text-2xl font-bold ${
                      result.reconciliationEstimate.isRefund ? 'text-green-800' : 'text-red-800'
                    }`}
                  >
                    {formatCurrency(Math.abs(result.reconciliationEstimate.difference))}
                  </div>
                  <div className="text-xs mt-1 text-gray-500">
                    ניצול מקדמות:{' '}
                    {formatPercent(result.reconciliationEstimate.utilizationRate, 0)}
                  </div>
                </div>
              </div>
              <p className="text-xs text-gray-500">
                * גמר שנה מוגש עד 31 במרץ השנה הבאה. עורך דין / רואה חשבון יכול להגיש עד 30 ביוני.
              </p>
            </div>
          )}
        </div>
      )}

      {/* ===== טאב ריבית פיגורים ===== */}
      {activeTab === 'late' && (
        <div className="space-y-6">
          <div className="bg-white border-2 border-gray-200 rounded-xl p-6 space-y-5">
            <h2 className="text-xl font-bold text-gray-900">מחשבון ריבית פיגורים</h2>
            <p className="text-sm text-gray-600">
              אי תשלום מקדמה בזמן גורר ריבית פיגורים של ~1.5% לחודש (ריבית עוגן + 2%). חשוב
              לשלם בזמן או לבקש הסדר תשלום.
            </p>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  סכום מקדמה שלא שולמה (₪)
                </label>
                <input
                  type="number"
                  min={0}
                  step={500}
                  value={lateAmount}
                  onChange={(e) => setLateAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  מספר חודשי איחור
                </label>
                <input
                  type="number"
                  min={1}
                  max={36}
                  step={1}
                  value={lateMonths}
                  onChange={(e) => setLateMonths(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-lg"
                />
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <ResultCard
              title="קרן (מקדמה מקורית)"
              value={formatCurrency(lateResult.principal)}
              subtitle="הסכום שהיה צריך לשלם"
              variant="primary"
            />
            <ResultCard
              title="ריבית פיגורים"
              value={formatCurrency(lateResult.interest)}
              subtitle={`${formatPercent(lateResult.monthlyRate, 1)}/חודש = ${formatPercent(lateResult.annualRate, 1)}/שנה`}
              variant="warning"
            />
            <ResultCard
              title="סה&quot;כ לתשלום"
              value={formatCurrency(lateResult.total)}
              subtitle={`עלות האיחור: +${formatPercent((lateResult.interest / lateResult.principal), 1)}`}
              variant="success"
            />
          </div>

          {/* טבלת ריבית לפי חודשים */}
          <div className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden">
            <div className="p-4 border-b border-gray-100">
              <h3 className="font-bold text-gray-900">התפתחות ריבית לפי חודשים</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-right py-2 px-3 font-semibold text-gray-700">חודש איחור</th>
                    <th className="text-left py-2 px-3 font-semibold text-gray-700">ריבית מצטברת</th>
                    <th className="text-left py-2 px-3 font-semibold text-gray-700">סה&quot;כ לתשלום</th>
                    <th className="text-left py-2 px-3 font-semibold text-gray-700">עלות %</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: Math.min(lateMonths, 24) }, (_, i) => {
                    const m = i + 1;
                    const interest = lateAmount * 0.015 * m;
                    const total = lateAmount + interest;
                    const pct = interest / lateAmount;
                    return (
                      <tr
                        key={m}
                        className={`border-b border-gray-100 hover:bg-gray-50 ${
                          m === lateMonths ? 'bg-amber-50 font-semibold' : ''
                        }`}
                      >
                        <td className="py-2 px-3 text-gray-800">{m} חודש{m === 1 ? '' : 'ים'}</td>
                        <td className="py-2 px-3 tabular-nums text-red-700">
                          {formatCurrency(interest)}
                        </td>
                        <td className="py-2 px-3 tabular-nums text-gray-900">
                          {formatCurrency(total)}
                        </td>
                        <td className="py-2 px-3 tabular-nums text-orange-700">
                          {formatPercent(pct, 1)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-900 space-y-2">
            <h4 className="font-bold">מה לעשות אם לא שילמת בזמן?</h4>
            <ul className="space-y-1 list-disc list-inside text-xs">
              <li>שלם מיד — ריבית ממשיכה לצבור כל חודש</li>
              <li>פנה לרשות המסים לבקשת הסדר תשלום — לפעמים ניתן לפרוס</li>
              <li>תשלום חלקי מפסיק את הריבית על החלק ששולם</li>
              <li>הגשת בקשה להפחתת קנס (ויתור מנהלי) — ניתן בתנאים מסוימים</li>
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
  sub,
}: {
  label: string;
  value: string;
  bold?: boolean;
  mute?: boolean;
  line?: boolean;
  highlight?: boolean;
  negative?: boolean;
  sub?: string;
}) {
  return (
    <div
      className={`flex justify-between items-center py-1.5 ${
        line ? 'border-t border-gray-200 pt-2.5 mt-1' : ''
      } ${highlight ? 'bg-blue-50 -mx-2 px-2 rounded' : ''}`}
    >
      <span className={`${mute ? 'text-gray-500' : 'text-gray-800'} ${bold ? 'font-bold' : ''}`}>
        {label}
      </span>
      <div className="text-right">
        <span
          className={`tabular-nums ${bold ? 'font-bold text-gray-900' : ''} ${
            mute ? 'text-gray-500' : ''
          } ${negative ? 'text-red-700' : ''}`}
        >
          {value}
        </span>
        {sub && <div className="text-xs text-gray-400">{sub}</div>}
      </div>
    </div>
  );
}

function TaxBreakdownBar({
  result,
}: {
  result: ReturnType<typeof calculateTaxAdvances>;
}) {
  const total = result.totalAnnual;
  if (total <= 0) return <p className="text-sm text-gray-500">אין נתונים</p>;

  const items = [
    {
      label: 'מס הכנסה',
      value: result.annualIncomeTax,
      color: 'bg-red-500',
      textColor: 'text-red-700',
    },
    {
      label: 'ב.ל. + בריאות',
      value: result.annualSocialSecurity,
      color: 'bg-orange-500',
      textColor: 'text-orange-700',
    },
    ...(result.annualVatPayable > 0
      ? [
          {
            label: 'מע"מ',
            value: result.annualVatPayable,
            color: 'bg-blue-500',
            textColor: 'text-blue-700',
          },
        ]
      : []),
  ].filter((i) => i.value > 0);

  return (
    <div className="space-y-3">
      <div className="flex h-7 rounded-lg overflow-hidden border border-gray-200">
        {items.map((item) => {
          const pct = (item.value / total) * 100;
          return (
            <div
              key={item.label}
              className={`${item.color} flex items-center justify-center text-white text-xs font-bold`}
              style={{ width: `${pct}%` }}
              title={`${item.label}: ${pct.toFixed(1)}%`}
            >
              {pct >= 10 ? `${pct.toFixed(0)}%` : ''}
            </div>
          );
        })}
      </div>
      <div className="grid grid-cols-2 gap-1 text-xs">
        {items.map((item) => {
          const pct = (item.value / total) * 100;
          return (
            <div key={item.label} className="flex items-center gap-1.5">
              <div className={`w-2.5 h-2.5 rounded ${item.color} flex-shrink-0`} />
              <span className={`${item.textColor} font-medium`}>
                {item.label}: {pct.toFixed(1)}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function PaymentScheduleTable({
  schedule,
}: {
  schedule: ReturnType<typeof calculateTaxAdvances>['paymentSchedule'];
}) {
  return (
    <div className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden">
      <div className="p-3 border-b border-gray-100 bg-gray-50">
        <h4 className="font-bold text-gray-900 text-sm">לוח תשלומים שנתי</h4>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-right py-2 px-2 font-semibold text-gray-600">תשלום</th>
              <th className="text-right py-2 px-2 font-semibold text-gray-600">חודשים</th>
              <th className="text-left py-2 px-2 font-semibold text-gray-600">מס הכנסה</th>
              <th className="text-left py-2 px-2 font-semibold text-gray-600">ב.ל.</th>
              <th className="text-left py-2 px-2 font-semibold text-gray-600 hidden sm:table-cell">
                מע&quot;מ
              </th>
              <th className="text-left py-2 px-2 font-semibold text-gray-600">סה&quot;כ</th>
            </tr>
          </thead>
          <tbody>
            {schedule.map((row) => (
              <tr
                key={row.paymentNumber}
                className="border-b border-gray-100 hover:bg-gray-50"
              >
                <td className="py-2 px-2 text-gray-700 font-medium">{row.paymentNumber}</td>
                <td className="py-2 px-2 text-gray-600">{row.monthsCovered}</td>
                <td className="py-2 px-2 tabular-nums text-gray-700">
                  {formatCurrency(row.incomeTax)}
                </td>
                <td className="py-2 px-2 tabular-nums text-gray-700">
                  {formatCurrency(row.socialSecurity)}
                </td>
                <td className="py-2 px-2 tabular-nums text-gray-700 hidden sm:table-cell">
                  {row.vat > 0 ? formatCurrency(row.vat) : '—'}
                </td>
                <td className="py-2 px-2 tabular-nums font-bold text-gray-900">
                  {formatCurrency(row.total)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-gray-50 border-t-2 border-gray-200">
            <tr>
              <td colSpan={2} className="py-2 px-2 font-bold text-gray-800 text-right">
                סה&quot;כ שנתי
              </td>
              <td className="py-2 px-2 tabular-nums font-bold text-red-700">
                {formatCurrency(schedule.reduce((s, r) => s + r.incomeTax, 0))}
              </td>
              <td className="py-2 px-2 tabular-nums font-bold text-orange-700">
                {formatCurrency(schedule.reduce((s, r) => s + r.socialSecurity, 0))}
              </td>
              <td className="py-2 px-2 tabular-nums font-bold text-blue-700 hidden sm:table-cell">
                {formatCurrency(schedule.reduce((s, r) => s + r.vat, 0))}
              </td>
              <td className="py-2 px-2 tabular-nums font-bold text-gray-900">
                {formatCurrency(schedule.reduce((s, r) => s + r.total, 0))}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
