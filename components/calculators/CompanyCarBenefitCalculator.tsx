'use client';

import { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from 'recharts';
import {
  calculateCompanyCarBenefit,
  detectCarGroup,
  CAR_GROUPS_2026,
  type CompanyCarInput,
  type CarGroup,
  type CarType,
} from '@/lib/calculators/company-car-benefit';
import { formatCurrency } from '@/lib/utils/formatters';
import { ChevronDown, ChevronUp } from 'lucide-react';

// ─────────────────────────────────────────────
// Initial state
// ─────────────────────────────────────────────

const CAR_TYPE_LABELS: Record<CarType, string> = {
  regular: 'רגיל (בנזין / דיזל)',
  hybrid: 'היברידי (70% שווי)',
  electric: 'חשמלי (50% שווי)',
  used: 'משומש / ישן',
};

const initialInput: CompanyCarInput = {
  catalogPrice: 220_000,
  carType: 'regular',
  marginalTaxRate: 35,
  monthlySalary: 18_000,
  employerCoversMaintenance: false,
  maintenanceCoveredByEmployer: 500,
  monthlyKm: 1_500,
  fuelCostPer100km: 50,
};

// ─────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────

export function CompanyCarBenefitCalculator() {
  const [input, setInput] = useState<CompanyCarInput>(initialInput);
  const [autoGroup, setAutoGroup] = useState(true);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [activeTab, setActiveTab] = useState<'breakdown' | 'comparison' | 'details'>('breakdown');

  // Auto-detect group from price
  const detectedGroup = useMemo(() => detectCarGroup(input.catalogPrice), [input.catalogPrice]);
  const effectiveGroup: CarGroup = autoGroup ? detectedGroup : (input.carGroup ?? detectedGroup);

  const result = useMemo(
    () => calculateCompanyCarBenefit({ ...input, carGroup: effectiveGroup }),
    [input, effectiveGroup],
  );

  function update<K extends keyof CompanyCarInput>(k: K, v: CompanyCarInput[K]) {
    setInput((p) => ({ ...p, [k]: v }));
  }

  // Pie data
  const pieData = useMemo(() => {
    const items = [
      {
        name: 'שווי שימוש נטו לעובד',
        value: Math.round(result.taxableBenefit - result.monthlyTax),
        color: '#10b981',
      },
      {
        name: 'מס על שווי שימוש',
        value: Math.round(result.monthlyTax),
        color: '#ef4444',
      },
    ];
    if (result.maintenanceBenefit > 0) {
      items.push({
        name: 'תחזוקה שמעסיק מכסה',
        value: Math.round(result.maintenanceBenefit),
        color: '#3b82f6',
      });
    }
    return items.filter((d) => d.value > 0);
  }, [result]);

  // Bar comparison data
  const barData = useMemo(
    () => [
      { name: 'שווי שימוש חודשי', value: Math.round(result.taxableBenefit) },
      { name: 'מס בתלוש (חודשי)', value: Math.round(result.monthlyTax) },
      { name: 'שכר מקביל (ברוטו)', value: Math.round(result.salaryEquivalent) },
      { name: 'רכב פרטי (עלות)', value: Math.round(result.personalCarMonthlyCost) },
    ],
    [result],
  );

  // Yearly scenarios (3 tax brackets)
  const scenariosData = useMemo(() => {
    const rates = [20, 31, 35, 47];
    return rates.map((rate) => {
      const r = calculateCompanyCarBenefit({ ...input, carGroup: effectiveGroup, marginalTaxRate: rate });
      return {
        name: `מס ${rate}%`,
        'מס חודשי': Math.round(r.monthlyTax),
        'עלות שנתית': Math.round(r.annualCostToEmployee),
      };
    });
  }, [input, effectiveGroup]);

  const groupInfo = CAR_GROUPS_2026.find((g) => g.group === effectiveGroup);

  return (
    <div className="space-y-6" dir="rtl">
      {/* ─── Grid: inputs + key results ─── */}
      <div className="grid lg:grid-cols-5 gap-6">
        {/* ─── Inputs ─── */}
        <div className="lg:col-span-3 space-y-5">
          <Section title="פרטי הרכב" color="gray">
            <div className="grid md:grid-cols-2 gap-4">
              <Field label="מחיר קטלוגי (₪)" hint="המחיר הקטלוגי ברישום הרכב">
                <input
                  type="number"
                  min={0}
                  step={5_000}
                  value={input.catalogPrice}
                  onChange={(e) => update('catalogPrice', Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-base"
                />
              </Field>

              <Field label="סוג הרכב">
                <select
                  value={input.carType}
                  onChange={(e) => update('carType', e.target.value as CarType)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                >
                  {(Object.entries(CAR_TYPE_LABELS) as [CarType, string][]).map(([v, l]) => (
                    <option key={v} value={v}>
                      {l}
                    </option>
                  ))}
                </select>
              </Field>

              {/* Car Group */}
              <div className="md:col-span-2">
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-medium text-gray-700">קבוצת רכב</label>
                  <label className="flex items-center gap-1 text-xs text-blue-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={autoGroup}
                      onChange={(e) => setAutoGroup(e.target.checked)}
                      className="w-3 h-3"
                    />
                    זיהוי אוטומטי לפי מחיר
                  </label>
                </div>
                {autoGroup ? (
                  <div className="px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-900 font-medium">
                    {groupInfo?.label ?? `קבוצה ${effectiveGroup}`} — זוהה אוטומטית
                  </div>
                ) : (
                  <select
                    value={effectiveGroup}
                    onChange={(e) =>
                      setInput((p) => ({ ...p, carGroup: Number(e.target.value) as CarGroup }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  >
                    {CAR_GROUPS_2026.map((g) => (
                      <option key={g.group} value={g.group}>
                        {g.label}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {input.carType === 'used' && (
                <Field label="גיל הרכב (שנים)" hint="לצורך חישוב מחיר אפקטיבי">
                  <input
                    type="number"
                    min={0}
                    max={20}
                    value={input.carAgeYears ?? 0}
                    onChange={(e) => update('carAgeYears', Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </Field>
              )}
            </div>
          </Section>

          <Section title="פרטי עובד" color="blue">
            <div className="grid md:grid-cols-2 gap-4">
              <Field label="שכר ברוטו חודשי (₪)" hint="לחישוב השפעה על מדרגות מס">
                <input
                  type="number"
                  min={0}
                  step={500}
                  value={input.monthlySalary}
                  onChange={(e) => update('monthlySalary', Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </Field>

              <Field label="מס שולי (%)" hint="המדרגה השולית שלך (10–50%)">
                <input
                  type="number"
                  min={10}
                  max={50}
                  step={1}
                  value={input.marginalTaxRate}
                  onChange={(e) => update('marginalTaxRate', Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
                <div className="mt-1 flex flex-wrap gap-1">
                  {[20, 31, 35, 47, 50].map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => update('marginalTaxRate', r)}
                      className={`text-xs px-2 py-0.5 rounded border transition ${
                        input.marginalTaxRate === r
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white text-gray-600 border-gray-300 hover:border-blue-400'
                      }`}
                    >
                      {r}%
                    </button>
                  ))}
                </div>
              </Field>
            </div>
          </Section>

          {/* Advanced: Maintenance & Comparison */}
          <div>
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="w-full bg-gray-100 hover:bg-gray-200 rounded-xl p-3 flex items-center justify-between transition text-sm font-medium text-gray-800"
            >
              <span>⚙️ הגדרות מתקדמות (תחזוקה, ק״מ, השוואה)</span>
              {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {showAdvanced && (
              <div className="mt-3 grid md:grid-cols-2 gap-4 bg-white border-2 border-gray-200 rounded-xl p-5">
                <Field label={'ק"מ חודשיים (לנסיעות עסקיות + פרטי)'} hint="לחישוב השוואה לרכב פרטי">
                  <input
                    type="number"
                    min={0}
                    step={100}
                    value={input.monthlyKm}
                    onChange={(e) => update('monthlyKm', Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                  />
                </Field>

                <Field label={'עלות דלק ל-100 ק"מ (₪)'} hint="בנזין ~50 ₪ / חשמל ~10–15 ₪">
                  <input
                    type="number"
                    min={0}
                    step={5}
                    value={input.fuelCostPer100km}
                    onChange={(e) => update('fuelCostPer100km', Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                  />
                </Field>

                <div className="md:col-span-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={input.employerCoversMaintenance}
                      onChange={(e) => update('employerCoversMaintenance', e.target.checked)}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="text-sm font-medium text-gray-800">
                      המעסיק מכסה תחזוקה (דלק, שטיפות, טיפולים)
                    </span>
                  </label>
                </div>

                {input.employerCoversMaintenance && (
                  <Field label="שווי תחזוקה שמעסיק מכסה (₪/חודש)" hint="דלק + שטיפות + טיפולים + ביטוח">
                    <input
                      type="number"
                      min={0}
                      step={100}
                      value={input.maintenanceCoveredByEmployer}
                      onChange={(e) => update('maintenanceCoveredByEmployer', Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                    />
                  </Field>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ─── Key results ─── */}
        <div className="lg:col-span-2 space-y-3">
          {/* Primary cards */}
          <SummaryCard
            title="שווי שימוש חודשי"
            value={formatCurrency(result.taxableBenefit)}
            sub={`${(result.benefitPercentage * 100).toFixed(2)}% × ${formatCurrency(input.catalogPrice)}`}
            color="blue"
          />
          <SummaryCard
            title="מס חודשי בתלוש"
            value={formatCurrency(result.monthlyTax)}
            sub={`עלות שנתית: ${formatCurrency(result.annualCostToEmployee)}`}
            color="red"
          />
          <SummaryCard
            title="שכר מקביל (ברוטו)"
            value={formatCurrency(result.salaryEquivalent)}
            sub="כמה שכר ברוטו היה שווה את הרכב"
            color="emerald"
          />

          {/* Breakdown box */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-2 text-sm">
            <div className="font-semibold text-gray-800 mb-1">פירוט שווי שימוש</div>
            <Row label="שווי גולמי" value={formatCurrency(result.monthlyBenefitRaw)} />
            {result.monthlyBenefitRaw !== result.monthlyBenefitAfterDiscount && (
              <Row
                label={
                  input.carType === 'electric'
                    ? 'הנחה חשמלי (50%)'
                    : input.carType === 'hybrid'
                    ? 'הנחה היברידי (30%)'
                    : 'הפחתת פחת (רכב ישן)'
                }
                value={`-${formatCurrency(result.monthlyBenefitRaw - result.monthlyBenefitAfterDiscount)}`}
                valueClass="text-emerald-700"
              />
            )}
            <Row label="שווי חייב במס" value={formatCurrency(result.taxableBenefit)} bold />
            <div className="border-t border-gray-200 pt-2">
              <Row
                label={`מס שולי (${input.marginalTaxRate}%)`}
                value={`-${formatCurrency(result.monthlyTax)}`}
                valueClass="text-red-700"
              />
              <Row
                label="שווי נטו לעובד"
                value={formatCurrency(result.taxableBenefit - result.monthlyTax)}
                valueClass="text-emerald-700"
                bold
              />
            </div>
            {result.maintenanceBenefit > 0 && (
              <>
                <div className="border-t border-gray-200 pt-2">
                  <Row
                    label="+ תחזוקה ממעסיק"
                    value={formatCurrency(result.maintenanceBenefit)}
                    valueClass="text-blue-700"
                  />
                  <Row
                    label={'סה"כ הטבה חודשית'}
                    value={formatCurrency(result.totalMonthlyBenefit)}
                    bold
                  />
                </div>
              </>
            )}
          </div>

          {/* Tax bracket warning */}
          {result.pushesToHigherBracket && (
            <div className="bg-amber-50 border border-amber-300 rounded-lg p-3 text-xs text-amber-900">
              ⚠️ שווי השימוש דוחף אותך למדרגת מס גבוהה יותר. מסלול המס השולי שלך עולה.
            </div>
          )}

          {/* Company car vs personal verdict */}
          <div
            className={`rounded-lg p-3 text-sm border ${
              result.isCompanyCarWorthIt
                ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                : 'bg-red-50 border-red-200 text-red-900'
            }`}
          >
            {result.isCompanyCarWorthIt ? (
              <>
                ✅ <strong>רכב החברה משתלם!</strong> חוסך{' '}
                {formatCurrency(result.monthlySavingsVsPersonalCar)}/חודש לעומת רכב פרטי.
              </>
            ) : (
              <>
                ⚠️ <strong>רכב פרטי + החזר עשוי להשתלם יותר</strong> לפי הנתונים שהכנסת.
              </>
            )}
          </div>
        </div>
      </div>

      {/* ─── Tabs: Charts & Details ─── */}
      <div className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden">
        <div className="flex border-b border-gray-200">
          {(
            [
              { id: 'breakdown', label: '🥧 פירוט עלויות' },
              { id: 'comparison', label: '📊 השוואת תרחישים' },
              { id: 'details', label: '🔢 פרטים מלאים' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-3 text-sm font-medium transition ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-5">
          {/* Tab 1: Pie chart */}
          {activeTab === 'breakdown' && (
            <div className="grid md:grid-cols-2 gap-6 items-center">
              <div>
                <h3 className="font-bold text-gray-900 mb-3">חלוקת שווי השימוש החודשי</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={90}
                      label={false}
                    >
                      {pieData.map((entry, idx) => (
                        <Cell key={idx} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(v) => formatCurrency(Number(v))}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-3">
                {pieData.map((item) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className="inline-block w-3 h-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm text-gray-700">{item.name}</span>
                    </div>
                    <span className="font-semibold tabular-nums text-sm">
                      {formatCurrency(item.value)}/חודש
                    </span>
                  </div>
                ))}
                <div className="pt-3 border-t border-gray-200">
                  <div className="flex justify-between text-sm font-bold">
                    <span>עלות שנתית למעסיק</span>
                    <span className="tabular-nums">{formatCurrency(result.annualCostToEmployee)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-emerald-700 font-medium mt-1">
                    <span>שכר מקביל (ברוטו)</span>
                    <span className="tabular-nums">{formatCurrency(result.salaryEquivalent * 12)}/שנה</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Bar chart – scenarios */}
          {activeTab === 'comparison' && (
            <div className="space-y-5">
              <div>
                <h3 className="font-bold text-gray-900 mb-1">מס לפי מדרגות שונות</h3>
                <p className="text-xs text-gray-500 mb-3">
                  אותו רכב, אותו מחיר — כמה מס תשלם לפי מדרגת המס שלך?
                </p>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={scenariosData} margin={{ top: 5, right: 20, bottom: 5, left: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis tickFormatter={(v) => `${Math.round(Number(v) / 1000)}K`} />
                    <Tooltip formatter={(v) => formatCurrency(Number(v))} />
                    <Legend />
                    <Bar dataKey="מס חודשי" fill="#ef4444" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="עלות שנתית" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Group comparison table */}
              <div>
                <h3 className="font-bold text-gray-900 mb-2">שווי שימוש לפי קבוצות רכב</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="text-right px-3 py-2 border border-gray-200">קבוצה</th>
                        <th className="text-right px-3 py-2 border border-gray-200">טווח מחיר</th>
                        <th className="text-right px-3 py-2 border border-gray-200">אחוז</th>
                        <th className="text-right px-3 py-2 border border-gray-200">שווי/חודש*</th>
                        <th className="text-right px-3 py-2 border border-gray-200">מס (35%)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {CAR_GROUPS_2026.map((g) => {
                        const midPrice = g.maxPrice
                          ? (g.minPrice + g.maxPrice) / 2
                          : g.minPrice * 1.05;
                        const monthlyVal = midPrice * g.percentage;
                        const tax = monthlyVal * 0.35;
                        const isCurrent = g.group === effectiveGroup;
                        return (
                          <tr
                            key={g.group}
                            className={isCurrent ? 'bg-blue-50 font-semibold' : 'hover:bg-gray-50'}
                          >
                            <td className="px-3 py-2 border border-gray-200 text-center">
                              {g.group}
                              {isCurrent && (
                                <span className="mr-1 text-xs text-blue-700">(נבחר)</span>
                              )}
                            </td>
                            <td className="px-3 py-2 border border-gray-200 text-xs">
                              {formatCurrency(g.minPrice)} –{' '}
                              {g.maxPrice ? formatCurrency(g.maxPrice) : '∞'}
                            </td>
                            <td className="px-3 py-2 border border-gray-200">
                              {(g.percentage * 100).toFixed(2)}%
                            </td>
                            <td className="px-3 py-2 border border-gray-200 tabular-nums">
                              {formatCurrency(monthlyVal)}
                            </td>
                            <td className="px-3 py-2 border border-gray-200 tabular-nums text-red-700">
                              {formatCurrency(tax)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td
                          colSpan={5}
                          className="px-3 py-1 text-xs text-gray-500 border border-gray-200"
                        >
                          * עלות שנתית מחושבת על בסיס מחיר אמצעי בכל קבוצה
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Full details */}
          {activeTab === 'details' && (
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-bold text-gray-900 mb-3">חישוב מלא</h3>
                <div className="space-y-2 text-sm">
                  <DetailRow label="מחיר קטלוגי" value={formatCurrency(input.catalogPrice)} />
                  <DetailRow label="קבוצת רכב" value={`${effectiveGroup} (${(result.benefitPercentage * 100).toFixed(2)}%)`} />
                  <DetailRow label="שווי שימוש גולמי" value={formatCurrency(result.monthlyBenefitRaw)} />
                  {input.carType !== 'regular' && (
                    <DetailRow
                      label={input.carType === 'electric' ? 'הנחה חשמלי' : input.carType === 'hybrid' ? 'הנחה היברידי' : 'הפחתת פחת'}
                      value={`-${formatCurrency(result.monthlyBenefitRaw - result.monthlyBenefitAfterDiscount)}`}
                      valueClass="text-emerald-700"
                    />
                  )}
                  <DetailRow label="שווי חייב במס" value={formatCurrency(result.taxableBenefit)} bold />
                  <div className="border-t pt-2">
                    <DetailRow label={`מס שולי (${input.marginalTaxRate}%)`} value={formatCurrency(result.monthlyTax)} valueClass="text-red-700" />
                    <DetailRow label="שווי נטו לעובד" value={formatCurrency(result.taxableBenefit - result.monthlyTax)} valueClass="text-emerald-700" bold />
                  </div>
                  {result.maintenanceBenefit > 0 && (
                    <DetailRow label="תחזוקה ממעסיק" value={formatCurrency(result.maintenanceBenefit)} valueClass="text-blue-700" />
                  )}
                </div>
              </div>

              <div>
                <h3 className="font-bold text-gray-900 mb-3">השוואה לרכב פרטי</h3>
                <div className="space-y-2 text-sm">
                  <DetailRow label={'ק"מ חודשיים'} value={`${input.monthlyKm.toLocaleString()} ק"מ`} />
                  <DetailRow label="עלות רכב פרטי/חודש" value={formatCurrency(result.personalCarMonthlyCost)} />
                  <DetailRow label="מס על שווי שימוש" value={formatCurrency(result.monthlyTax)} valueClass="text-red-700" />
                  <div className="border-t pt-2">
                    <DetailRow
                      label="חיסכון/הפסד עם רכב חברה"
                      value={formatCurrency(Math.abs(result.monthlySavingsVsPersonalCar))}
                      valueClass={result.isCompanyCarWorthIt ? 'text-emerald-700' : 'text-red-700'}
                      bold
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {result.isCompanyCarWorthIt ? '✅ רכב חברה משתלם' : '⚠️ רכב פרטי + החזר עדיף'}
                    </p>
                  </div>
                </div>

                <div className="mt-4">
                  <h3 className="font-bold text-gray-900 mb-3">שנתי סיכום</h3>
                  <div className="space-y-2 text-sm">
                    <DetailRow label="שווי שימוש שנתי" value={formatCurrency(result.taxableBenefit * 12)} />
                    <DetailRow label="מס שנתי בתלוש" value={formatCurrency(result.annualCostToEmployee)} valueClass="text-red-700" />
                    <DetailRow label="שכר מקביל (שנתי ברוטו)" value={formatCurrency(result.salaryEquivalent * 12)} valueClass="text-emerald-700" bold />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ─── Recommendations ─── */}
      {result.recommendations.length > 0 && (
        <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-5">
          <h3 className="text-base font-bold text-amber-900 mb-3">💡 המלצות וטיפים</h3>
          <ul className="space-y-2">
            {result.recommendations.map((rec, i) => (
              <li key={i} className="flex gap-2 text-sm text-amber-900">
                <span>•</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// Helper sub-components
// ─────────────────────────────────────────────

function Section({
  title,
  color = 'gray',
  children,
}: {
  title: string;
  color?: 'gray' | 'blue' | 'emerald';
  children: React.ReactNode;
}) {
  const styles: Record<string, string> = {
    gray: 'bg-white border-gray-200',
    blue: 'bg-blue-50 border-blue-200',
    emerald: 'bg-emerald-50 border-emerald-200',
  };
  return (
    <div className={`rounded-xl border-2 p-5 ${styles[color]}`}>
      <h3 className="font-bold text-gray-900 mb-4">{title}</h3>
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
      <label className="block text-xs font-medium text-gray-700 mb-1">{label}</label>
      {children}
      {hint && <p className="text-xs text-gray-500 mt-0.5">{hint}</p>}
    </div>
  );
}

function SummaryCard({
  title,
  value,
  sub,
  color,
}: {
  title: string;
  value: string;
  sub?: string;
  color: 'blue' | 'red' | 'emerald';
}) {
  const styles: Record<string, string> = {
    blue: 'border-blue-300 bg-blue-50 text-blue-700',
    red: 'border-red-300 bg-red-50 text-red-700',
    emerald: 'border-emerald-300 bg-emerald-50 text-emerald-700',
  };
  return (
    <div className={`rounded-xl border-2 p-4 ${styles[color]}`}>
      <p className="text-xs font-medium text-gray-600 mb-1">{title}</p>
      <p className="text-2xl font-bold tabular-nums">{value}</p>
      {sub && <p className="text-xs mt-0.5 opacity-80">{sub}</p>}
    </div>
  );
}

function Row({
  label,
  value,
  bold,
  valueClass,
}: {
  label: string;
  value: string;
  bold?: boolean;
  valueClass?: string;
}) {
  return (
    <div className={`flex justify-between ${bold ? 'font-bold' : ''}`}>
      <span className="text-gray-600">{label}</span>
      <span className={`tabular-nums ${valueClass ?? ''}`}>{value}</span>
    </div>
  );
}

function DetailRow({
  label,
  value,
  bold,
  valueClass,
}: {
  label: string;
  value: string;
  bold?: boolean;
  valueClass?: string;
}) {
  return (
    <div className={`flex justify-between py-1 border-b border-gray-100 ${bold ? 'font-bold' : ''}`}>
      <span className="text-gray-700">{label}</span>
      <span className={`tabular-nums ${valueClass ?? ''}`}>{value}</span>
    </div>
  );
}
