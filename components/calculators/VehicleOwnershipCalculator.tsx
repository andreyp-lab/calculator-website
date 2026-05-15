'use client';

import { useState, useMemo, useEffect } from 'react';
import {
  compareVehicleOwnership,
  getDefaultsForSegment,
  FUEL_LABELS,
  TYPICAL_FUEL_EFFICIENCY,
  type VehicleOwnershipInput,
  type CarSegment,
  type FuelType,
  type PaymentMethod,
} from '@/lib/calculators/vehicle-ownership';
import { formatCurrency } from '@/lib/utils/formatters';
import { Car, Wallet, CreditCard, RefreshCw, TrendingUp, ChevronDown, ChevronUp } from 'lucide-react';

const SEGMENT_LABELS: Record<CarSegment, string> = {
  mini: 'מיני (אופל קורסה / יאריס)',
  family: 'משפחתי (קורולה / קטון)',
  executive: 'מנהלים (פסאט / מאזדה 6)',
  suv: 'SUV (RAV4 / קוגה)',
  luxury: 'יוקרה (BMW / מרצדס)',
};

const initialInput: VehicleOwnershipInput = {
  // רכב
  carPrice: 180000,
  carSegment: 'family',
  yearsOfUse: 5,
  fuelType: 'gasoline_95',
  fuelEfficiency: 7.5,
  monthlyKm: 1500,

  // מזומן
  cashPrice: 175000,
  alternativeInvestmentReturn: 6,

  // הלוואה
  loanDownPayment: 50000,
  loanAmount: 130000,
  loanTermMonths: 60,
  loanRate: 6.5,
  loanIncludeOpportunityCostOnDP: true,

  // ליסינג
  leasingMonthlyPayment: 2400,
  leasingInitialPayment: 8000,
  leasingFinalPayment: 0,
  leasingBuysAtEnd: false,
  leasingIncludesMaintenance: true,
  leasingIncludesInsurance: false,

  // תפעול (defaults לפי family)
  insuranceMandatoryYearly: 1300,
  insuranceComprehensiveYearly: 3800,
  licenseFeeYearly: 1850,
  annualInspection: 230,
  serviceYearly: 2400,
  unexpectedRepairsYearly: 2000,
  tiresEveryKm: 50000,
  tiresSetPrice: 1800,
  parkingYearly: 0,
  tollsMonthly: 0,

  vatRefundable: false,
};

export function VehicleOwnershipCalculator() {
  const [input, setInput] = useState<VehicleOwnershipInput>(initialInput);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const result = useMemo(() => compareVehicleOwnership(input), [input]);

  function update<K extends keyof VehicleOwnershipInput>(k: K, v: VehicleOwnershipInput[K]) {
    setInput((prev) => ({ ...prev, [k]: v }));
  }

  // עדכון ברירות מחדל לפי סגמנט
  function changeSegment(seg: CarSegment) {
    const defaults = getDefaultsForSegment(seg);
    setInput((prev) => ({
      ...prev,
      carSegment: seg,
      ...defaults,
    }));
  }

  // עדכון יעילות דלק לפי סוג + סגמנט
  function changeFuelType(ft: FuelType) {
    const efficiency = TYPICAL_FUEL_EFFICIENCY[ft][input.carSegment];
    setInput((prev) => ({ ...prev, fuelType: ft, fuelEfficiency: efficiency }));
  }

  // יישור לאחר שינוי סגמנט (יעילות דלק)
  useEffect(() => {
    const newEfficiency = TYPICAL_FUEL_EFFICIENCY[input.fuelType][input.carSegment];
    if (Math.abs(newEfficiency - input.fuelEfficiency) > 0.5) {
      setInput((prev) => ({ ...prev, fuelEfficiency: newEfficiency }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input.carSegment]);

  return (
    <div className="space-y-6">
      {/* פרטי רכב */}
      <Section title="🚗 פרטי הרכב והשימוש" color="gray">
        <div className="grid md:grid-cols-3 gap-4">
          <Field label="סגמנט הרכב">
            <select
              value={input.carSegment}
              onChange={(e) => changeSegment(e.target.value as CarSegment)}
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
            >
              {(Object.keys(SEGMENT_LABELS) as CarSegment[]).map((s) => (
                <option key={s} value={s}>
                  {SEGMENT_LABELS[s]}
                </option>
              ))}
            </select>
          </Field>
          <Field label="מחיר רכב מחירון (₪)">
            <input
              type="number"
              value={input.carPrice}
              onChange={(e) => update('carPrice', Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
            />
          </Field>
          <Field label="שנות שימוש">
            <input
              type="number"
              min={1}
              max={15}
              value={input.yearsOfUse}
              onChange={(e) => update('yearsOfUse', Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
            />
          </Field>
          <Field label="ק״מ חודשיים">
            <input
              type="number"
              value={input.monthlyKm}
              onChange={(e) => update('monthlyKm', Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
            />
          </Field>
          <Field label="סוג דלק">
            <select
              value={input.fuelType}
              onChange={(e) => changeFuelType(e.target.value as FuelType)}
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
            >
              {(Object.keys(FUEL_LABELS) as FuelType[]).map((ft) => (
                <option key={ft} value={ft}>
                  {FUEL_LABELS[ft]}
                </option>
              ))}
            </select>
          </Field>
          <Field label={`יעילות דלק (${input.fuelType === 'electric' ? 'קוט"ש' : 'ליטר'}/100ק"מ)`}>
            <input
              type="number"
              step={0.5}
              value={input.fuelEfficiency}
              onChange={(e) => update('fuelEfficiency', Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
            />
          </Field>
        </div>
      </Section>

      {/* 3 אופציות */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* מזומן */}
        <Section
          title={
            <span className="flex items-center gap-2">
              <Wallet className="w-5 h-5 text-emerald-600" />
              💰 מימון עצמי
            </span>
          }
          color="emerald"
        >
          <div className="space-y-3">
            <Field label="מחיר במזומן (₪)" hint="לרוב יש הנחה למזומן">
              <input
                type="number"
                value={input.cashPrice}
                onChange={(e) => update('cashPrice', Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
              />
            </Field>
            <Field
              label="תשואה אלטרנטיבית (%/שנה)"
              hint="מה הכסף היה מרוויח בהשקעה במקום (S&P 500 ~7-8%, ת״א 125 ~6-7%, פק״מ ~3-4%)"
            >
              <input
                type="number"
                step={0.5}
                value={input.alternativeInvestmentReturn}
                onChange={(e) =>
                  update('alternativeInvestmentReturn', Number(e.target.value))
                }
                className="w-full px-3 py-2 border border-emerald-300 rounded text-sm bg-emerald-50"
              />
            </Field>
            <div className="text-xs text-emerald-800 bg-emerald-50 p-2 rounded">
              💡 <strong>עלות הזדמנות</strong>: כסף שיוצא לרכב לא מרוויח בהשקעה. המחשבון לוקח את זה בחשבון.
            </div>
          </div>
        </Section>

        {/* הלוואה */}
        <Section
          title={
            <span className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-blue-600" />
              🏦 הלוואה
            </span>
          }
          color="blue"
        >
          <div className="space-y-3">
            <Field label="מקדמה (₪)">
              <input
                type="number"
                value={input.loanDownPayment}
                onChange={(e) => update('loanDownPayment', Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
              />
            </Field>
            <Field label="סכום הלוואה (₪)">
              <input
                type="number"
                value={input.loanAmount}
                onChange={(e) => update('loanAmount', Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
              />
            </Field>
            <div className="grid grid-cols-2 gap-2">
              <Field label="תקופה (חודשים)">
                <input
                  type="number"
                  value={input.loanTermMonths}
                  onChange={(e) => update('loanTermMonths', Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                />
              </Field>
              <Field label="ריבית (%)">
                <input
                  type="number"
                  step={0.1}
                  value={input.loanRate}
                  onChange={(e) => update('loanRate', Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                />
              </Field>
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={input.loanIncludeOpportunityCostOnDP}
                onChange={(e) =>
                  update('loanIncludeOpportunityCostOnDP', e.target.checked)
                }
                className="w-4 h-4"
              />
              <span>חשב עלות הזדמנות על המקדמה</span>
            </label>
          </div>
        </Section>

        {/* ליסינג */}
        <Section
          title={
            <span className="flex items-center gap-2">
              <RefreshCw className="w-5 h-5 text-purple-600" />
              🚙 ליסינג
            </span>
          }
          color="purple"
        >
          <div className="space-y-3">
            <Field label="תשלום ראשוני (₪)">
              <input
                type="number"
                value={input.leasingInitialPayment}
                onChange={(e) => update('leasingInitialPayment', Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
              />
            </Field>
            <Field label="תשלום חודשי (₪)">
              <input
                type="number"
                value={input.leasingMonthlyPayment}
                onChange={(e) => update('leasingMonthlyPayment', Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
              />
            </Field>
            <Field label="תשלום סופי (אם תקנה)">
              <input
                type="number"
                value={input.leasingFinalPayment}
                onChange={(e) => update('leasingFinalPayment', Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
              />
            </Field>
            <div className="space-y-1 text-sm">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={input.leasingBuysAtEnd}
                  onChange={(e) => update('leasingBuysAtEnd', e.target.checked)}
                  className="w-4 h-4"
                />
                <span>אני אקנה את הרכב בסוף</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={input.leasingIncludesMaintenance}
                  onChange={(e) => update('leasingIncludesMaintenance', e.target.checked)}
                  className="w-4 h-4"
                />
                <span>הליסינג כולל תחזוקה</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={input.leasingIncludesInsurance}
                  onChange={(e) => update('leasingIncludesInsurance', e.target.checked)}
                  className="w-4 h-4"
                />
                <span>הליסינג כולל ביטוח</span>
              </label>
            </div>
          </div>
        </Section>
      </div>

      {/* עלויות תפעול - כפתור הרחבה */}
      <div>
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="w-full bg-gray-100 hover:bg-gray-200 rounded-xl p-4 flex items-center justify-between transition"
        >
          <span className="font-bold text-gray-900 flex items-center gap-2">
            ⚙️ עלויות תפעול מפורטות (ביטוח, רישוי, טיפולים, צמיגים)
          </span>
          {showAdvanced ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>

        {showAdvanced && (
          <div className="mt-4 grid md:grid-cols-2 lg:grid-cols-3 gap-4 bg-white border-2 border-gray-200 rounded-xl p-5">
            <Field label="ביטוח חובה שנתי (₪)">
              <input
                type="number"
                value={input.insuranceMandatoryYearly}
                onChange={(e) =>
                  update('insuranceMandatoryYearly', Number(e.target.value))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
              />
            </Field>
            <Field label="ביטוח מקיף שנתי (₪)">
              <input
                type="number"
                value={input.insuranceComprehensiveYearly}
                onChange={(e) =>
                  update('insuranceComprehensiveYearly', Number(e.target.value))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
              />
            </Field>
            <Field label="אגרת רישוי שנתית (₪)">
              <input
                type="number"
                value={input.licenseFeeYearly}
                onChange={(e) => update('licenseFeeYearly', Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
              />
            </Field>
            <Field label="טסט שנתי (₪)">
              <input
                type="number"
                value={input.annualInspection}
                onChange={(e) => update('annualInspection', Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
              />
            </Field>
            <Field label="טיפולים תקופתיים (₪/שנה)">
              <input
                type="number"
                value={input.serviceYearly}
                onChange={(e) => update('serviceYearly', Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
              />
            </Field>
            <Field label="תיקונים בלתי צפויים (₪/שנה)">
              <input
                type="number"
                value={input.unexpectedRepairsYearly}
                onChange={(e) =>
                  update('unexpectedRepairsYearly', Number(e.target.value))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
              />
            </Field>
            <Field label="החלפת צמיגים כל כמה ק״מ">
              <input
                type="number"
                value={input.tiresEveryKm}
                onChange={(e) => update('tiresEveryKm', Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
              />
            </Field>
            <Field label="עלות סט צמיגים (₪)">
              <input
                type="number"
                value={input.tiresSetPrice}
                onChange={(e) => update('tiresSetPrice', Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
              />
            </Field>
            <Field label="חניה שנתית (₪)">
              <input
                type="number"
                value={input.parkingYearly}
                onChange={(e) => update('parkingYearly', Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
              />
            </Field>
            <Field label="כביש 6 / אגרות חודשיות (₪)">
              <input
                type="number"
                value={input.tollsMonthly}
                onChange={(e) => update('tollsMonthly', Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
              />
            </Field>
            <Field label="עוסק מורשה? (מע״מ מקוזז)">
              <label className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded">
                <input
                  type="checkbox"
                  checked={input.vatRefundable}
                  onChange={(e) => update('vatRefundable', e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-sm">כן, הרכב עסקי</span>
              </label>
            </Field>
          </div>
        )}
      </div>

      {/* תוצאות - 3 כרטיסי השוואה */}
      <div className="grid md:grid-cols-3 gap-4">
        <ResultCard option={result.options.cash} isCheapest={result.cheapest === 'cash'} />
        <ResultCard option={result.options.loan} isCheapest={result.cheapest === 'loan'} />
        <ResultCard option={result.options.leasing} isCheapest={result.cheapest === 'leasing'} />
      </div>

      {/* פס השוואה */}
      <ComparisonBar result={result} years={input.yearsOfUse} />

      {/* גרף עלות מצטברת */}
      <CumulativeChart result={result} years={input.yearsOfUse} />

      {/* פירוט עלויות */}
      <BreakdownGrid result={result} />

      {/* המלצות */}
      {result.recommendations.length > 0 && (
        <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-5">
          <h3 className="text-lg font-bold text-amber-900 mb-3 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            המלצות חכמות
          </h3>
          <ul className="space-y-2">
            {result.recommendations.map((r, i) => (
              <li key={i} className="flex gap-2 text-sm text-amber-900">
                <span>💡</span>
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* עלויות תפעול שנתיות */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <span className="text-gray-700">
            💸 עלות תפעול שנתית (משותפת לכל האופציות):{' '}
            <strong>{formatCurrency(result.yearlyOperatingCost)}</strong>
          </span>
          <span className="text-gray-600">
            עלות לק״מ: <strong>{(result.costPerKm[result.cheapest] || 0).toFixed(2)} ₪</strong>{' '}
            (באופציה הזולה)
          </span>
        </div>
      </div>
    </div>
  );
}

// ==================== Helper Components ====================

function Section({
  title,
  color = 'gray',
  children,
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
      {hint && <p className="text-xs text-gray-500 mt-1">{hint}</p>}
    </div>
  );
}

function ResultCard({
  option,
  isCheapest,
}: {
  option: ReturnType<typeof compareVehicleOwnership>['options']['cash'];
  isCheapest: boolean;
}) {
  const colorMap: Record<PaymentMethod, string> = {
    cash: 'border-emerald-400 bg-emerald-50',
    loan: 'border-blue-400 bg-blue-50',
    leasing: 'border-purple-400 bg-purple-50',
  };
  const accentMap: Record<PaymentMethod, string> = {
    cash: 'text-emerald-700',
    loan: 'text-blue-700',
    leasing: 'text-purple-700',
  };
  return (
    <div
      className={`rounded-xl border-2 p-5 ${colorMap[option.method]} ${
        isCheapest ? 'ring-4 ring-amber-300' : ''
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-bold text-gray-900">{option.label}</h4>
        {isCheapest && (
          <span className="bg-amber-400 text-amber-900 text-xs font-bold px-2 py-0.5 rounded">
            הזול ביותר
          </span>
        )}
      </div>
      <div className={`text-3xl font-bold tabular-nums mb-1 ${accentMap[option.method]}`}>
        {formatCurrency(option.totalCost)}
      </div>
      <p className="text-xs text-gray-600 mb-3">סך עלות לתקופה</p>

      <div className="space-y-1 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">חודשי ממוצע:</span>
          <span className="font-medium tabular-nums">
            {formatCurrency(option.monthlyAverage)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">תשלום ב-Day 1:</span>
          <span className="font-medium tabular-nums">{formatCurrency(option.upfrontCash)}</span>
        </div>
        {option.opportunityCost > 0 && (
          <div className="flex justify-between">
            <span className="text-gray-600">עלות הזדמנות:</span>
            <span className="font-medium tabular-nums text-amber-700">
              {formatCurrency(option.opportunityCost)}
            </span>
          </div>
        )}
        {option.assetValueAtEnd > 0 && (
          <div className="flex justify-between">
            <span className="text-gray-600">שווי רכב בסוף:</span>
            <span className="font-medium tabular-nums text-emerald-700">
              {formatCurrency(option.assetValueAtEnd)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

function ComparisonBar({
  result,
  years,
}: {
  result: ReturnType<typeof compareVehicleOwnership>;
  years: number;
}) {
  const max = Math.max(
    result.options.cash.totalCost,
    result.options.loan.totalCost,
    result.options.leasing.totalCost,
  );
  const opts = [result.options.cash, result.options.loan, result.options.leasing];
  const colorMap: Record<PaymentMethod, string> = {
    cash: 'bg-emerald-500',
    loan: 'bg-blue-500',
    leasing: 'bg-purple-500',
  };
  return (
    <div className="bg-white border-2 border-gray-200 rounded-xl p-5">
      <h3 className="font-bold text-gray-900 mb-4">📊 השוואת סך עלות ({years} שנים)</h3>
      <div className="space-y-3">
        {opts.map((o) => {
          const widthPct = (o.totalCost / max) * 100;
          const diff = result.differences[o.method];
          return (
            <div key={o.method}>
              <div className="flex items-center justify-between mb-1 text-sm">
                <span className="font-medium">{o.label}</span>
                <span className="tabular-nums">
                  {formatCurrency(o.totalCost)}
                  {diff > 0 && (
                    <span className="text-red-600 text-xs mr-2">
                      (+{formatCurrency(diff)})
                    </span>
                  )}
                </span>
              </div>
              <div className="h-6 bg-gray-100 rounded overflow-hidden">
                <div
                  className={`h-full ${colorMap[o.method]} transition-all`}
                  style={{ width: `${widthPct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CumulativeChart({
  result,
  years,
}: {
  result: ReturnType<typeof compareVehicleOwnership>;
  years: number;
}) {
  const maxVal = Math.max(
    ...result.options.cash.cumulativeByYear,
    ...result.options.loan.cumulativeByYear,
    ...result.options.leasing.cumulativeByYear,
  );
  const minVal = Math.min(
    0,
    ...result.options.cash.cumulativeByYear,
    ...result.options.loan.cumulativeByYear,
    ...result.options.leasing.cumulativeByYear,
  );
  const range = maxVal - minVal || 1;
  const width = 100;
  const height = 200;
  const padding = 15;

  const points = (vals: number[]) =>
    vals
      .map((v, i) => {
        const x = padding + (i / Math.max(1, years - 1)) * (width - 2 * padding);
        const y = padding + (1 - (v - minVal) / range) * (height - 2 * padding);
        return `${x},${y}`;
      })
      .join(' ');

  return (
    <div className="bg-white border-2 border-gray-200 rounded-xl p-5">
      <h3 className="font-bold text-gray-900 mb-3">📈 התפתחות עלות מצטברת לאורך השנים</h3>
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-64">
        {/* Grid */}
        {[0, 0.25, 0.5, 0.75, 1].map((t) => (
          <line
            key={t}
            x1={padding}
            y1={padding + t * (height - 2 * padding)}
            x2={width - padding}
            y2={padding + t * (height - 2 * padding)}
            stroke="#e5e7eb"
            strokeWidth="0.3"
          />
        ))}
        {/* Cash line */}
        <polyline
          fill="none"
          stroke="#10b981"
          strokeWidth="1.2"
          points={points(result.options.cash.cumulativeByYear)}
        />
        {/* Loan line */}
        <polyline
          fill="none"
          stroke="#3b82f6"
          strokeWidth="1.2"
          points={points(result.options.loan.cumulativeByYear)}
        />
        {/* Leasing line */}
        <polyline
          fill="none"
          stroke="#a855f7"
          strokeWidth="1.2"
          points={points(result.options.leasing.cumulativeByYear)}
        />
        {/* X axis labels */}
        {Array.from({ length: years }, (_, i) => i + 1).map((y, i) => {
          const x = padding + (i / Math.max(1, years - 1)) * (width - 2 * padding);
          return (
            <text key={y} x={x} y={height - 3} fontSize="3" textAnchor="middle" fill="#6b7280">
              שנה {y}
            </text>
          );
        })}
      </svg>
      <div className="flex flex-wrap gap-4 mt-2 text-xs">
        <span className="flex items-center gap-1">
          <span className="inline-block w-4 h-1 bg-emerald-500" /> מזומן
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block w-4 h-1 bg-blue-500" /> הלוואה
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block w-4 h-1 bg-purple-500" /> ליסינג
        </span>
      </div>
    </div>
  );
}

function BreakdownGrid({ result }: { result: ReturnType<typeof compareVehicleOwnership> }) {
  return (
    <div className="grid md:grid-cols-3 gap-4">
      <BreakdownCard option={result.options.cash} color="emerald" />
      <BreakdownCard option={result.options.loan} color="blue" />
      <BreakdownCard option={result.options.leasing} color="purple" />
    </div>
  );
}

function BreakdownCard({
  option,
  color,
}: {
  option: ReturnType<typeof compareVehicleOwnership>['options']['cash'];
  color: 'emerald' | 'blue' | 'purple';
}) {
  const borderMap = {
    emerald: 'border-emerald-200',
    blue: 'border-blue-200',
    purple: 'border-purple-200',
  };
  return (
    <div className={`bg-white border-2 rounded-xl p-4 ${borderMap[color]}`}>
      <h4 className="font-bold text-gray-900 mb-3">{option.label}</h4>
      <div className="space-y-1.5 text-sm">
        {option.breakdown.map((item, i) => (
          <div key={i} className="border-b border-gray-100 pb-1.5">
            <div className="flex justify-between">
              <span className={item.value < 0 ? 'text-emerald-700' : 'text-gray-700'}>
                {item.label}
              </span>
              <span
                className={`tabular-nums font-medium ${
                  item.value < 0 ? 'text-emerald-700' : ''
                }`}
              >
                {item.value < 0 ? '-' : ''}
                {formatCurrency(Math.abs(item.value))}
              </span>
            </div>
            {item.note && <div className="text-xs text-gray-500 mt-0.5">{item.note}</div>}
          </div>
        ))}
        <div className="flex justify-between pt-2 font-bold border-t-2 border-gray-300">
          <span>סה״כ</span>
          <span className="tabular-nums">{formatCurrency(option.totalCost)}</span>
        </div>
      </div>
    </div>
  );
}
