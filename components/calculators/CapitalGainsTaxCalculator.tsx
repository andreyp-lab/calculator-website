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
  calculateCapitalGainsTax,
  calculateLinearTax,
  calculateFirstHomeExemption,
  calculateInheritedProperty,
  calculateSecuritiesGain,
  applyExpenseDeductions,
  getCumulativeInflation,
  FIRST_HOME_EXEMPTION_CAP_2026,
  defaultDetailedExpenses,
  type CapitalGainsInput,
  type CapitalGainsScenario,
  type LinearTaxInput,
  type FirstHomeExemptionInput,
  type InheritedPropertyInput,
  type SecuritiesGainInput,
  type SecuritiesType,
  type DetailedExpenses,
} from '@/lib/calculators/capital-gains-tax';
import { formatCurrency, formatPercent } from '@/lib/utils/formatters';
import { ResultCard } from '@/components/calculator/ResultCard';
import { Breakdown } from '@/components/calculator/Breakdown';

// ============================================================
// קבועים
// ============================================================

type Tab = 'real-estate' | 'first-home' | 'linear' | 'inherited' | 'securities';

const TAB_LABELS: Record<Tab, string> = {
  'real-estate': 'נדל"ן',
  'first-home': 'דירה יחידה',
  linear: 'מס לינארי',
  inherited: 'ירושה',
  securities: 'ני"ע',
};

const CURRENT_YEAR = 2026;

const PIE_COLORS = ['#ef4444', '#10b981', '#f59e0b'];
const BAR_COLORS = { withLinear: '#3b82f6', withoutLinear: '#ef4444' };

// ============================================================
// עזרי UI
// ============================================================

function TabButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
        active
          ? 'bg-blue-600 text-white shadow-sm'
          : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-300 hover:text-blue-600'
      }`}
    >
      {label}
    </button>
  );
}

interface FieldProps {
  label: string;
  hint?: string;
  children: React.ReactNode;
}
function Field({ label, hint, children }: FieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {children}
      {hint && <p className="text-xs text-gray-500 mt-1">{hint}</p>}
    </div>
  );
}

function NumberInput({
  value,
  onChange,
  min = 0,
  max,
  step = 1000,
  placeholder,
}: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
}) {
  return (
    <input
      type="number"
      value={value}
      min={min}
      max={max}
      step={step}
      placeholder={placeholder}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
    />
  );
}

function YearInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <NumberInput
      value={value}
      onChange={onChange}
      min={1980}
      max={CURRENT_YEAR}
      step={1}
      placeholder="שנה"
    />
  );
}

function CheckboxField({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <label className="flex items-center gap-2 text-sm cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="w-4 h-4 rounded border-gray-300 text-blue-600"
      />
      <span>{label}</span>
    </label>
  );
}

function InfoBox({ text }: { text: string }) {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-900 leading-relaxed">
      {text}
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="text-base font-semibold text-gray-800 border-b border-gray-200 pb-2 mb-3">{children}</h3>;
}

// ============================================================
// פאי גרף - חלוקת תמורה
// ============================================================

function TaxPieChart({ tax, net, label }: { tax: number; net: number; label?: string }) {
  const data = [
    { name: 'מס שבח', value: Math.round(Math.max(0, tax)) },
    { name: 'נטו למוכר', value: Math.round(Math.max(0, net)) },
  ];

  const COLORS = ['#ef4444', '#10b981'];

  return (
    <div className="h-48">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={80}
            paddingAngle={2}
            dataKey="value"
            label={false}
            labelLine={false}
          >
            {data.map((_, idx) => (
              <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => formatCurrency(Number(value))} />
        </PieChart>
      </ResponsiveContainer>
      {label && <p className="text-center text-xs text-gray-500 -mt-2">{label}</p>}
    </div>
  );
}

// ============================================================
// תב לינארי - גרף השוואה
// ============================================================

function LinearComparisonChart({
  withLinear,
  withoutLinear,
}: {
  withLinear: number;
  withoutLinear: number;
}) {
  const data = [
    { name: 'עם חישוב לינארי', מס: Math.round(withLinear) },
    { name: 'ללא חישוב לינארי', מס: Math.round(withoutLinear) },
  ];
  return (
    <div className="h-40">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ left: 10, right: 20 }}>
          <CartesianGrid strokeDasharray="3 3" horizontal={false} />
          <XAxis type="number" tickFormatter={(v) => `₪${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 11 }} />
          <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={100} />
          <Tooltip formatter={(value) => formatCurrency(Number(value))} />
          <Bar dataKey="מס" fill={BAR_COLORS.withLinear} radius={4}>
            {data.map((_, idx) => (
              <Cell key={idx} fill={idx === 0 ? BAR_COLORS.withLinear : BAR_COLORS.withoutLinear} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// ============================================================
// TAB 1: נדל"ן - חישוב כללי
// ============================================================

const initialRealEstate: CapitalGainsInput = {
  salePrice: 3_000_000,
  purchasePrice: 1_500_000,
  recognizedExpenses: 100_000,
  purchaseYear: 2018,
  saleYear: CURRENT_YEAR,
  scenario: 'first-home',
  isResident: true,
  usedExemptionRecently: false,
  hasHighIncome: false,
  inflationCumulativePct: 15,
  useAutoCPI: true,
};

function RealEstateTab() {
  const [input, setInput] = useState<CapitalGainsInput>(initialRealEstate);
  const [showExpenses, setShowExpenses] = useState(false);
  const [expenses, setExpenses] = useState<DetailedExpenses>(defaultDetailedExpenses);

  const result = useMemo(() => {
    const totalExp = showExpenses
      ? Object.values(expenses).reduce((a, b) => a + b, 0)
      : input.recognizedExpenses;
    return calculateCapitalGainsTax({ ...input, recognizedExpenses: totalExp });
  }, [input, expenses, showExpenses]);

  function update<K extends keyof CapitalGainsInput>(k: K, v: CapitalGainsInput[K]) {
    setInput((p) => ({ ...p, [k]: v }));
  }

  function updateExp<K extends keyof DetailedExpenses>(k: K, v: number) {
    setExpenses((p) => ({ ...p, [k]: v }));
  }

  const autoInflation = useMemo(
    () => (getCumulativeInflation(input.purchaseYear, input.saleYear) * 100).toFixed(1),
    [input.purchaseYear, input.saleYear],
  );

  return (
    <div className="grid lg:grid-cols-5 gap-6">
      {/* קלטים */}
      <div className="lg:col-span-3 space-y-5">
        <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
          <SectionTitle>פרטי העסקה</SectionTitle>

          <div className="grid grid-cols-2 gap-4">
            <Field label="שווי מכירה (₪)">
              <NumberInput
                value={input.salePrice}
                onChange={(v) => update('salePrice', v)}
                step={50_000}
              />
            </Field>
            <Field label="שווי רכישה (₪)">
              <NumberInput
                value={input.purchasePrice}
                onChange={(v) => update('purchasePrice', v)}
                step={50_000}
              />
            </Field>
            <Field label="שנת רכישה">
              <YearInput value={input.purchaseYear} onChange={(v) => update('purchaseYear', v)} />
            </Field>
            <Field label="שנת מכירה">
              <NumberInput
                value={input.saleYear}
                onChange={(v) => update('saleYear', v)}
                min={input.purchaseYear + 1}
                max={2040}
                step={1}
              />
            </Field>
          </div>

          <Field label="סוג העסקה">
            <select
              value={input.scenario}
              onChange={(e) => update('scenario', e.target.value as CapitalGainsScenario)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="first-home">דירה יחידה (לתושב ישראל)</option>
              <option value="investment">דירת השקעה / נוספת</option>
              <option value="inherited">דירה בירושה</option>
            </select>
          </Field>
        </div>

        {/* הוצאות מוכרות */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <SectionTitle>הוצאות מוכרות</SectionTitle>
            <button
              type="button"
              onClick={() => setShowExpenses(!showExpenses)}
              className="text-xs text-blue-600 hover:underline"
            >
              {showExpenses ? 'חזרה לסכום כולל' : 'פירוט הוצאות'}
            </button>
          </div>

          {!showExpenses ? (
            <Field label="סה&quot;כ הוצאות מוכרות (₪)" hint="עו&quot;ד, תיווך, שיפוצים, מס רכישה, ועוד">
              <NumberInput
                value={input.recognizedExpenses}
                onChange={(v) => update('recognizedExpenses', v)}
                step={5_000}
              />
            </Field>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <Field label="שכ&quot;ט עו&quot;ד - רכישה (₪)">
                <NumberInput value={expenses.lawyerAtPurchase} onChange={(v) => updateExp('lawyerAtPurchase', v)} step={1_000} />
              </Field>
              <Field label="שכ&quot;ט עו&quot;ד - מכירה (₪)">
                <NumberInput value={expenses.lawyerAtSale} onChange={(v) => updateExp('lawyerAtSale', v)} step={1_000} />
              </Field>
              <Field label="עמלת תיווך (₪)">
                <NumberInput value={expenses.realtorFee} onChange={(v) => updateExp('realtorFee', v)} step={1_000} />
              </Field>
              <Field label="מס רכישה ששולם (₪)">
                <NumberInput value={expenses.purchaseTaxPaid} onChange={(v) => updateExp('purchaseTaxPaid', v)} step={1_000} />
              </Field>
              <Field label="שיפוצים / השבחה (₪)">
                <NumberInput value={expenses.renovations} onChange={(v) => updateExp('renovations', v)} step={5_000} />
              </Field>
              <Field label="היטל השבחה (₪)">
                <NumberInput value={expenses.bettermentLevy} onChange={(v) => updateExp('bettermentLevy', v)} step={1_000} />
              </Field>
              <Field label="שיווק ופרסום (₪)">
                <NumberInput value={expenses.marketing} onChange={(v) => updateExp('marketing', v)} step={500} />
              </Field>
              <Field label="ריבית משכנתא מוכרת (₪)">
                <NumberInput value={expenses.mortgageInterest} onChange={(v) => updateExp('mortgageInterest', v)} step={5_000} />
              </Field>
              <Field label="הוצאות אחרות (₪)">
                <NumberInput value={expenses.other} onChange={(v) => updateExp('other', v)} step={1_000} />
              </Field>
              <div className="col-span-2 bg-blue-50 rounded-lg px-3 py-2 text-sm font-semibold text-blue-800">
                סה&quot;כ הוצאות: {formatCurrency(Object.values(expenses).reduce((a, b) => a + b, 0))}
              </div>
            </div>
          )}
        </div>

        {/* הגדרות נוספות */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-3">
          <SectionTitle>הגדרות נוספות</SectionTitle>
          <Field
            label={`אינפלציה מצטברת (%) ${input.useAutoCPI ? `— אוטומטי לפי מדד: ${autoInflation}%` : ''}`}
            hint="השבח האינפלציוני פטור ממס. בערך 2-3%/שנה."
          >
            <div className="flex gap-2">
              <NumberInput
                value={input.useAutoCPI ? parseFloat(autoInflation) : input.inflationCumulativePct}
                onChange={(v) => {
                  update('inflationCumulativePct', v);
                  update('useAutoCPI', false);
                }}
                min={0}
                max={500}
                step={1}
              />
              <button
                type="button"
                onClick={() => update('useAutoCPI', !input.useAutoCPI)}
                className={`px-3 py-2 text-xs rounded-lg border ${input.useAutoCPI ? 'bg-blue-100 border-blue-300 text-blue-700' : 'bg-gray-50 border-gray-200 text-gray-600'}`}
              >
                {input.useAutoCPI ? 'מדד CPI אוטו' : 'הכנס ידני'}
              </button>
            </div>
          </Field>
          <div className="space-y-2">
            <CheckboxField
              checked={input.isResident}
              onChange={(v) => update('isResident', v)}
              label="תושב ישראל"
            />
            <CheckboxField
              checked={input.usedExemptionRecently}
              onChange={(v) => update('usedExemptionRecently', v)}
              label="השתמשתי בפטור דירה יחידה ב-18 חודשים האחרונים"
            />
            <CheckboxField
              checked={input.hasHighIncome}
              onChange={(v) => update('hasHighIncome', v)}
              label="הכנסות גבוהות — מס יסף 5% נוסף (סה&quot;כ 30%)"
            />
          </div>
        </div>
      </div>

      {/* תוצאות */}
      <div className="lg:col-span-2 space-y-4">
        <ResultCard
          title="מס שבח לתשלום"
          value={formatCurrency(result.taxAmount)}
          subtitle={
            result.fullExemption
              ? 'פטור מלא לדירה יחידה'
              : result.appliedLinearMethod
              ? `חישוב לינארי — ${(result.taxablePct * 100).toFixed(1)}% חייב`
              : `${formatPercent(result.taxRate, 0)} מהשבח הריאלי`
          }
          variant={result.fullExemption ? 'success' : result.taxAmount === 0 ? 'success' : 'primary'}
        />

        <ResultCard
          title="נטו לאחר מס"
          value={formatCurrency(result.netToSeller)}
          subtitle={`שיעור מס אפקטיבי: ${formatPercent(result.effectiveTaxRate, 1)}`}
          variant="success"
        />

        {result.taxAmount > 0 && (
          <TaxPieChart
            tax={result.taxAmount}
            net={result.netToSeller}
            label="חלוקת תמורת המכירה"
          />
        )}

        <Breakdown
          title="פירוט החישוב"
          defaultOpen
          items={[
            { label: 'שווי מכירה', value: formatCurrency(result.grossGain + (showExpenses ? Object.values(expenses).reduce((a,b)=>a+b,0) : input.recognizedExpenses) + input.purchasePrice) },
            { label: 'שווי רכישה', value: `${formatCurrency(input.purchasePrice)}−` },
            { label: 'הוצאות מוכרות', value: `${formatCurrency(showExpenses ? Object.values(expenses).reduce((a,b)=>a+b,0) : input.recognizedExpenses)}−` },
            { label: 'שבח כולל', value: formatCurrency(result.grossGain), bold: true },
            { label: 'שבח אינפלציוני (פטור)', value: `${formatCurrency(result.inflationGain)}−` },
            { label: 'שבח ריאלי', value: formatCurrency(result.realGain), bold: true },
            ...(result.appliedLinearMethod
              ? [
                  {
                    label: `חלק חייב במס (${(result.taxablePct * 100).toFixed(1)}%)`,
                    value: formatCurrency(result.taxableGain),
                    note: `${result.yearsBefore2014} שנים לפני 2014 פטורות, ${result.yearsAfter2014} שנים חייבות`,
                  },
                ]
              : []),
            { label: `מס ${formatPercent(result.taxRate, 0)}`, value: formatCurrency(result.taxAmount), bold: true },
          ]}
        />

        <InfoBox text={result.explanation} />
      </div>
    </div>
  );
}

// ============================================================
// TAB 2: דירה יחידה
// ============================================================

const initialFirstHome: FirstHomeExemptionInput = {
  salePrice: 2_800_000,
  purchasePrice: 1_200_000,
  recognizedExpenses: 80_000,
  purchaseYear: 2015,
  saleYear: CURRENT_YEAR,
  isResident: true,
  usedExemptionRecently: false,
  ownershipMonths: 132, // 11 שנים
  hasHighIncome: false,
  useAutoCPI: true,
  inflationCumulativePct: 20,
};

function FirstHomeTab() {
  const [input, setInput] = useState<FirstHomeExemptionInput>(initialFirstHome);

  const result = useMemo(() => calculateFirstHomeExemption(input), [input]);

  function update<K extends keyof FirstHomeExemptionInput>(k: K, v: FirstHomeExemptionInput[K]) {
    setInput((p) => ({ ...p, [k]: v }));
  }

  return (
    <div className="grid lg:grid-cols-5 gap-6">
      <div className="lg:col-span-3 space-y-5">
        <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
          <SectionTitle>פרטי הדירה</SectionTitle>
          <div className="grid grid-cols-2 gap-4">
            <Field label="שווי מכירה (₪)">
              <NumberInput value={input.salePrice} onChange={(v) => update('salePrice', v)} step={50_000} />
            </Field>
            <Field label="שווי רכישה (₪)">
              <NumberInput value={input.purchasePrice} onChange={(v) => update('purchasePrice', v)} step={50_000} />
            </Field>
            <Field label="שנת רכישה">
              <YearInput value={input.purchaseYear} onChange={(v) => update('purchaseYear', v)} />
            </Field>
            <Field label="שנת מכירה">
              <NumberInput value={input.saleYear} onChange={(v) => update('saleYear', v)} min={2015} max={2040} step={1} />
            </Field>
            <Field label="הוצאות מוכרות (₪)">
              <NumberInput value={input.recognizedExpenses} onChange={(v) => update('recognizedExpenses', v)} step={5_000} />
            </Field>
            <Field label="חודשי אחזקה" hint="נדרש מינימום 18 חודשים">
              <NumberInput value={input.ownershipMonths} onChange={(v) => update('ownershipMonths', v)} min={1} max={600} step={1} />
            </Field>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-3">
          <SectionTitle>תנאי זכאות</SectionTitle>
          <div className="space-y-2">
            <CheckboxField checked={input.isResident} onChange={(v) => update('isResident', v)} label="תושב ישראל" />
            <CheckboxField
              checked={input.usedExemptionRecently}
              onChange={(v) => update('usedExemptionRecently', v)}
              label="ניצלתי פטור דירה יחידה ב-18 חודשים האחרונים"
            />
            <CheckboxField
              checked={input.hasHighIncome}
              onChange={(v) => update('hasHighIncome', v)}
              label="הכנסות גבוהות (מס יסף 5%)"
            />
            <CheckboxField
              checked={input.useAutoCPI}
              onChange={(v) => update('useAutoCPI', v)}
              label="חישוב אינפלציה אוטומטי לפי מדד CPI"
            />
          </div>
          {!input.useAutoCPI && (
            <Field label="אינפלציה מצטברת (%)">
              <NumberInput value={input.inflationCumulativePct} onChange={(v) => update('inflationCumulativePct', v)} min={0} max={300} step={1} />
            </Field>
          )}
        </div>

        {/* תקרת פטור */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm">
          <p className="font-semibold text-amber-800 mb-1">תקרת הפטור 2026</p>
          <p className="text-amber-700">
            שווי מכירה עד <span className="font-bold">{formatCurrency(FIRST_HOME_EXEMPTION_CAP_2026)}</span>
          </p>
          <p className="text-amber-600 mt-1">
            השווי שלכם: <span className="font-bold">{formatCurrency(input.salePrice)}</span>
            {input.salePrice > FIRST_HOME_EXEMPTION_CAP_2026 ? ' — מעל התקרה!' : ' — בתוך התקרה'}
          </p>
        </div>
      </div>

      <div className="lg:col-span-2 space-y-4">
        <ResultCard
          title={result.isEligible ? 'זכאי לפטור מלא!' : 'לא זכאי לפטור'}
          value={result.isEligible ? 'פטור ממס' : formatCurrency(result.taxIfNoExemption)}
          subtitle={result.isEligible ? `חיסכון של ${formatCurrency(result.savingFromExemption)}` : 'מס שבח לתשלום'}
          variant={result.isEligible ? 'success' : 'warning'}
        />

        <ResultCard
          title="נטו לאחר מס"
          value={formatCurrency(result.netToSeller)}
          variant="success"
        />

        {!result.isEligible && result.savingFromExemption === 0 && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 space-y-2">
            <p className="font-semibold text-red-800 text-sm">סיבות חוסר זכאות:</p>
            <ul className="space-y-1">
              {result.ineligibilityReasons.map((r, i) => (
                <li key={i} className="text-xs text-red-700 flex gap-1">
                  <span>•</span>
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {result.isEligible && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 space-y-1">
            <p className="font-semibold text-green-800 text-sm">כל תנאי הפטור מתקיימים</p>
            <p className="text-xs text-green-700">תושב ישראל, לא ניצל פטור לאחרונה, בתקרה, ואחזקה 18+ חודשים</p>
          </div>
        )}

        <Breakdown
          title="פירוט"
          defaultOpen
          items={[
            { label: 'שבח כולל', value: formatCurrency(result.grossGain) },
            { label: 'שבח אינפלציוני (פטור)', value: `-${formatCurrency(result.inflationGain)}` },
            { label: 'שבח ריאלי', value: formatCurrency(result.realGain), bold: true },
            { label: 'מס ללא פטור', value: formatCurrency(result.taxIfNoExemption) },
            { label: 'חיסכון מהפטור', value: formatCurrency(result.savingFromExemption), bold: true },
          ]}
        />

        <InfoBox text={result.explanation} />
      </div>
    </div>
  );
}

// ============================================================
// TAB 3: מס לינארי
// ============================================================

const initialLinear: LinearTaxInput = {
  salePrice: 3_500_000,
  purchasePrice: 400_000,
  recognizedExpenses: 120_000,
  purchaseYear: 2000,
  saleYear: CURRENT_YEAR,
  hasHighIncome: false,
  useAutoCPI: true,
  inflationCumulativePct: 80,
};

function LinearTab() {
  const [input, setInput] = useState<LinearTaxInput>(initialLinear);

  const result = useMemo(() => calculateLinearTax(input), [input]);

  function update<K extends keyof LinearTaxInput>(k: K, v: LinearTaxInput[K]) {
    setInput((p) => ({ ...p, [k]: v }));
  }

  // גרף עמודות - ציר זמן
  const timelineData = result.breakdown.map((b) => ({
    name: b.period,
    שנים: b.years,
    רווח: Math.round(b.gain),
    מס: Math.round(b.tax),
    fill: b.taxable ? '#ef4444' : '#10b981',
  }));

  return (
    <div className="grid lg:grid-cols-5 gap-6">
      <div className="lg:col-span-3 space-y-5">
        <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
          <SectionTitle>פרטי הנכס הישן (לפני 2014)</SectionTitle>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-800 mb-2">
            החישוב הלינארי חל על דירות שנרכשו לפני 1 בינואר 2014. שנת הרכישה שלכם: <strong>{input.purchaseYear}</strong>
            {input.purchaseYear >= 2014 && (
              <span className="text-red-600 font-bold"> — נרכש אחרי 2014, חישוב לינארי לא חל!</span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="שווי מכירה (₪)">
              <NumberInput value={input.salePrice} onChange={(v) => update('salePrice', v)} step={50_000} />
            </Field>
            <Field label="שווי רכישה (₪)">
              <NumberInput value={input.purchasePrice} onChange={(v) => update('purchasePrice', v)} step={50_000} />
            </Field>
            <Field label="שנת רכישה (לפני 2014)">
              <NumberInput value={input.purchaseYear} onChange={(v) => update('purchaseYear', v)} min={1980} max={2013} step={1} />
            </Field>
            <Field label="שנת מכירה">
              <NumberInput value={input.saleYear} onChange={(v) => update('saleYear', v)} min={2014} max={2040} step={1} />
            </Field>
            <Field label="הוצאות מוכרות (₪)">
              <NumberInput value={input.recognizedExpenses} onChange={(v) => update('recognizedExpenses', v)} step={5_000} />
            </Field>
          </div>

          <div className="space-y-2">
            <CheckboxField
              checked={input.hasHighIncome}
              onChange={(v) => update('hasHighIncome', v)}
              label="הכנסות גבוהות (מס יסף 5%)"
            />
            <CheckboxField
              checked={input.useAutoCPI}
              onChange={(v) => update('useAutoCPI', v)}
              label="אינפלציה אוטומטית לפי מדד CPI"
            />
          </div>
          {!input.useAutoCPI && (
            <Field label="אינפלציה מצטברת (%)">
              <NumberInput value={input.inflationCumulativePct} onChange={(v) => update('inflationCumulativePct', v)} min={0} max={1000} step={5} />
            </Field>
          )}
        </div>

        {/* ציר זמן */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <SectionTitle>חלוקת שנות האחזקה</SectionTitle>
          <div className="flex gap-4 mb-4 text-sm">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span>לפני 2014 — פטור ({result.yearsBefore2014} שנים, {(result.pctBefore2014 * 100).toFixed(0)}%)</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <span>אחרי 2014 — חייב ({result.yearsAfter2014} שנים, {(result.pctAfter2014 * 100).toFixed(0)}%)</span>
            </div>
          </div>
          {/* פס ויזואלי */}
          <div className="h-8 flex rounded-lg overflow-hidden mb-3">
            {result.pctBefore2014 > 0 && (
              <div
                className="bg-green-500 flex items-center justify-center text-white text-xs font-medium"
                style={{ width: `${result.pctBefore2014 * 100}%` }}
              >
                {result.yearsBefore2014}y
              </div>
            )}
            {result.pctAfter2014 > 0 && (
              <div
                className="bg-red-500 flex items-center justify-center text-white text-xs font-medium"
                style={{ width: `${result.pctAfter2014 * 100}%` }}
              >
                {result.yearsAfter2014}y
              </div>
            )}
          </div>
          <p className="text-xs text-gray-500">סה&quot;כ {result.totalYears} שנות אחזקה — {input.purchaseYear} עד {input.saleYear}</p>
        </div>
      </div>

      <div className="lg:col-span-2 space-y-4">
        <ResultCard
          title="מס שבח (לינארי)"
          value={formatCurrency(result.taxAmount)}
          subtitle={`שיעור אפקטיבי: ${formatPercent(result.effectiveTaxRate, 1)} מהשבח הכולל`}
          variant="primary"
        />

        <ResultCard
          title="חיסכון מהחישוב הלינארי"
          value={formatCurrency(result.savingFromLinear)}
          subtitle="לעומת חיוב מס מלא ללא הקלות"
          variant="success"
        />

        <LinearComparisonChart withLinear={result.taxAmount} withoutLinear={result.taxWithoutLinear} />

        <Breakdown
          title="פירוט מלא"
          defaultOpen
          items={[
            { label: 'שבח כולל', value: formatCurrency(result.grossGain) },
            { label: 'שבח אינפלציוני', value: `-${formatCurrency(result.inflationGain)}` },
            { label: 'שבח ריאלי', value: formatCurrency(result.realGain), bold: true },
            { label: `חלק לפני 2014 (פטור, ${(result.pctBefore2014*100).toFixed(0)}%)`, value: formatCurrency(result.gainBefore2014) },
            { label: `חלק אחרי 2014 (חייב, ${(result.pctAfter2014*100).toFixed(0)}%)`, value: formatCurrency(result.gainAfter2014) },
            { label: `מס ${(result.taxRate * 100).toFixed(0)}%`, value: formatCurrency(result.taxAmount), bold: true },
            { label: 'נטו לאחר מס', value: formatCurrency(result.netToSeller), bold: true },
          ]}
        />

        <InfoBox
          text={`חישוב לינארי מוטב: מתוך ${result.totalYears} שנות אחזקה, ${result.yearsBefore2014} שנים לפני 2014 פטורות ממס, ורק ${result.yearsAfter2014} שנים אחרי 2014 חייבות. חיסכון: ${formatCurrency(result.savingFromLinear)}.`}
        />
      </div>
    </div>
  );
}

// ============================================================
// TAB 4: ירושה
// ============================================================

const initialInherited: InheritedPropertyInput = {
  salePrice: 2_500_000,
  deceasedPurchasePrice: 300_000,
  recognizedExpenses: 60_000,
  deceasedPurchaseYear: 1998,
  saleYear: CURRENT_YEAR,
  inheritedFromSpouse: false,
  hasHighIncome: false,
  useAutoCPI: true,
  inflationCumulativePct: 100,
};

function InheritedTab() {
  const [input, setInput] = useState<InheritedPropertyInput>(initialInherited);

  const result = useMemo(() => calculateInheritedProperty(input), [input]);

  function update<K extends keyof InheritedPropertyInput>(k: K, v: InheritedPropertyInput[K]) {
    setInput((p) => ({ ...p, [k]: v }));
  }

  return (
    <div className="grid lg:grid-cols-5 gap-6">
      <div className="lg:col-span-3 space-y-5">
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm">
          <p className="font-semibold text-amber-800 mb-1">כלל ירושה במיסוי מקרקעין</p>
          <ul className="text-amber-700 space-y-1 text-xs">
            <li>• ירושה מבן/בת זוג: בדרך כלל פטורה ממס שבח</li>
            <li>• ירושה מאחרים: מחושב על בסיס תאריך ומחיר רכישת המוריש</li>
            <li>• חישוב לינארי חל אם המוריש רכש לפני 2014</li>
          </ul>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
          <SectionTitle>פרטי הנכס שהתקבל בירושה</SectionTitle>

          <CheckboxField
            checked={input.inheritedFromSpouse}
            onChange={(v) => update('inheritedFromSpouse', v)}
            label="ירשתי מבן/בת זוג (פטור בדרך כלל)"
          />

          <div className="grid grid-cols-2 gap-4">
            <Field label="שווי מכירה (₪)">
              <NumberInput value={input.salePrice} onChange={(v) => update('salePrice', v)} step={50_000} />
            </Field>
            <Field label="שווי רכישה ע&quot;י המוריש (₪)">
              <NumberInput value={input.deceasedPurchasePrice} onChange={(v) => update('deceasedPurchasePrice', v)} step={10_000} />
            </Field>
            <Field label="שנת רכישת המוריש">
              <YearInput value={input.deceasedPurchaseYear} onChange={(v) => update('deceasedPurchaseYear', v)} />
            </Field>
            <Field label="שנת מכירה">
              <NumberInput value={input.saleYear} onChange={(v) => update('saleYear', v)} min={2000} max={2040} step={1} />
            </Field>
            <Field label="הוצאות מוכרות (₪)">
              <NumberInput value={input.recognizedExpenses} onChange={(v) => update('recognizedExpenses', v)} step={5_000} />
            </Field>
          </div>

          <div className="space-y-2">
            <CheckboxField
              checked={input.hasHighIncome}
              onChange={(v) => update('hasHighIncome', v)}
              label="הכנסות גבוהות (מס יסף 5%)"
            />
            <CheckboxField
              checked={input.useAutoCPI}
              onChange={(v) => update('useAutoCPI', v)}
              label="אינפלציה אוטומטית לפי מדד CPI"
            />
          </div>
        </div>
      </div>

      <div className="lg:col-span-2 space-y-4">
        <ResultCard
          title={result.isExempt ? 'פטור ממס שבח' : 'מס שבח לתשלום'}
          value={result.isExempt ? 'פטור' : formatCurrency(result.taxAmount)}
          subtitle={
            result.isExempt
              ? 'ירושה מבן/בת זוג'
              : result.appliedLinearMethod
              ? `חישוב לינארי — ${(result.taxablePct * 100).toFixed(1)}% חייב`
              : `${(result.taxRate * 100).toFixed(0)}% מהשבח הריאלי`
          }
          variant={result.isExempt ? 'success' : 'primary'}
        />

        {!result.isExempt && (
          <ResultCard
            title="נטו לאחר מס"
            value={formatCurrency(result.netToSeller)}
            subtitle={`שיעור אפקטיבי: ${formatPercent(result.effectiveTaxRate, 1)}`}
            variant="success"
          />
        )}

        {!result.isExempt && result.taxAmount > 0 && (
          <TaxPieChart tax={result.taxAmount} net={result.netToSeller} label="מס vs. נטו" />
        )}

        {!result.isExempt && (
          <Breakdown
            title="פירוט"
            defaultOpen
            items={[
              { label: 'שבח כולל', value: formatCurrency(result.grossGain) },
              { label: 'שבח אינפלציוני', value: `-${formatCurrency(result.inflationGain)}` },
              { label: 'שבח ריאלי', value: formatCurrency(result.realGain), bold: true },
              ...(result.appliedLinearMethod
                ? [{ label: `חלק חייב (${(result.taxablePct*100).toFixed(0)}%)`, value: formatCurrency(result.taxableGain) }]
                : []),
              { label: `מס ${(result.taxRate*100).toFixed(0)}%`, value: formatCurrency(result.taxAmount), bold: true },
              { label: 'נטו', value: formatCurrency(result.netToSeller), bold: true },
            ]}
          />
        )}

        <InfoBox text={result.explanation} />
      </div>
    </div>
  );
}

// ============================================================
// TAB 5: ניירות ערך (מס רווחי הון)
// ============================================================

const initialSecurities: SecuritiesGainInput = {
  purchaseAmount: 100_000,
  saleAmount: 180_000,
  purchaseYear: 2020,
  saleYear: CURRENT_YEAR,
  securitiesType: 'stocks',
  isResident: true,
  hasHighIncome: false,
  isDayTrading: false,
  isTaxSheltered: false,
  applyIndexation: false,
  dividendsReceived: 0,
  dividendsTaxWithheld: 0,
};

const SECURITIES_TYPE_LABELS: Record<SecuritiesType, string> = {
  stocks: 'מניות',
  bonds: 'אגרות חוב',
  etf: 'קרן מחקה / ETF',
  crypto: 'מטבע קריפטו',
  options: 'אופציות',
};

function SecuritiesTab() {
  const [input, setInput] = useState<SecuritiesGainInput>(initialSecurities);

  const result = useMemo(() => calculateSecuritiesGain(input), [input]);

  function update<K extends keyof SecuritiesGainInput>(k: K, v: SecuritiesGainInput[K]) {
    setInput((p) => ({ ...p, [k]: v }));
  }

  const roi = input.purchaseAmount > 0
    ? ((input.saleAmount - input.purchaseAmount) / input.purchaseAmount * 100).toFixed(1)
    : '0';

  return (
    <div className="grid lg:grid-cols-5 gap-6">
      <div className="lg:col-span-3 space-y-5">
        <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
          <SectionTitle>פרטי ההשקעה</SectionTitle>
          <div className="grid grid-cols-2 gap-4">
            <Field label="סכום השקעה מקורי (₪)">
              <NumberInput value={input.purchaseAmount} onChange={(v) => update('purchaseAmount', v)} step={5_000} />
            </Field>
            <Field label="סכום מכירה (₪)">
              <NumberInput value={input.saleAmount} onChange={(v) => update('saleAmount', v)} step={5_000} />
            </Field>
            <Field label="שנת רכישה">
              <YearInput value={input.purchaseYear} onChange={(v) => update('purchaseYear', v)} />
            </Field>
            <Field label="שנת מכירה">
              <NumberInput value={input.saleYear} onChange={(v) => update('saleYear', v)} min={1985} max={2040} step={1} />
            </Field>
            <Field label="סוג ני&quot;ע">
              <select
                value={input.securitiesType}
                onChange={(e) => update('securitiesType', e.target.value as SecuritiesType)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                {(Object.keys(SECURITIES_TYPE_LABELS) as SecuritiesType[]).map((k) => (
                  <option key={k} value={k}>{SECURITIES_TYPE_LABELS[k]}</option>
                ))}
              </select>
            </Field>
            <div className="flex items-end pb-2">
              <p className="text-sm text-gray-600">
                תשואה גולמית: <span className="font-bold text-blue-700">{roi}%</span>
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
          <SectionTitle>דיבידנדים</SectionTitle>
          <div className="grid grid-cols-2 gap-4">
            <Field label="דיבידנדים שהתקבלו (₪)">
              <NumberInput value={input.dividendsReceived} onChange={(v) => update('dividendsReceived', v)} step={500} />
            </Field>
            <Field label="מס שנוכה במקור (₪)" hint="לזיכוי מול המס הישראלי">
              <NumberInput value={input.dividendsTaxWithheld} onChange={(v) => update('dividendsTaxWithheld', v)} step={100} />
            </Field>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-3">
          <SectionTitle>הגדרות מס</SectionTitle>
          <div className="space-y-2">
            <CheckboxField
              checked={input.isTaxSheltered}
              onChange={(v) => update('isTaxSheltered', v)}
              label="חשבון פנסיוני / קרן השתלמות (פטור ממס)"
            />
            <CheckboxField
              checked={input.hasHighIncome}
              onChange={(v) => update('hasHighIncome', v)}
              label="הכנסות גבוהות — מס יסף 5% (סה&quot;כ 30%)"
            />
            <CheckboxField
              checked={input.isDayTrading}
              onChange={(v) => update('isDayTrading', v)}
              label="מסחר יומי (דיי-טריידינג) — חויב כהכנסה רגילה"
            />
            <CheckboxField
              checked={input.applyIndexation}
              onChange={(v) => update('applyIndexation', v)}
              label={`הצמדה למדד CPI (רלוונטי לני"ע לפני 2003 — שנת רכישה: ${input.purchaseYear})`}
            />
          </div>
        </div>
      </div>

      <div className="lg:col-span-2 space-y-4">
        <ResultCard
          title="מס רווחי הון"
          value={formatCurrency(result.totalTax)}
          subtitle={
            result.isTaxSheltered
              ? 'פטור — חשבון מוגן'
              : result.isDayTradingTreatedAsIncome
              ? 'מחויב כהכנסה רגילה (~35%)'
              : `${(result.taxRate * 100).toFixed(0)}% מהרווח הריאלי`
          }
          variant={result.totalTax === 0 ? 'success' : 'primary'}
        />

        <ResultCard
          title="רווח נטו"
          value={formatCurrency(result.netProfit)}
          subtitle={`תשואה נטו: ${formatPercent(result.effectiveReturnPct, 1)}`}
          variant="success"
        />

        {result.grossProfit > 0 && !result.isTaxSheltered && (
          <TaxPieChart
            tax={result.totalTax}
            net={result.netProfit}
            label="מס vs. רווח נטו"
          />
        )}

        <Breakdown
          title="פירוט המס"
          defaultOpen
          items={result.breakdown
            .filter((b) => b.amount !== 0)
            .map((b) => ({
              label: b.label,
              value: formatCurrency(Math.abs(b.amount)),
              note: b.note,
              bold: b.label === 'רווח נטו',
            }))}
        />

        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-xs text-gray-700 space-y-2">
          <p className="font-semibold text-gray-900">הבדלים מרכזיים: ני&quot;ע vs. נדל&quot;ן</p>
          <ul className="space-y-1">
            <li>• ני&quot;ע: 25% על רווח ריאלי, נדל&quot;ן: 25% + חישוב לינארי</li>
            <li>• ני&quot;ע: אין פטור דירה יחידה</li>
            <li>• הפסדי הון בני&quot;ע ניתן לקיזוז מול רווחים באותה שנה</li>
            <li>• מניות זרות: יש לדווח + ייתכן זיכוי מס זר</li>
          </ul>
        </div>

        <InfoBox text={result.explanation} />
      </div>
    </div>
  );
}

// ============================================================
// קומפוננטה ראשית
// ============================================================

export function CapitalGainsTaxCalculator() {
  const [activeTab, setActiveTab] = useState<Tab>('real-estate');

  return (
    <div className="space-y-6" dir="rtl">
      {/* טאבים */}
      <div className="flex flex-wrap gap-2">
        {(Object.keys(TAB_LABELS) as Tab[]).map((tab) => (
          <TabButton
            key={tab}
            label={TAB_LABELS[tab]}
            active={activeTab === tab}
            onClick={() => setActiveTab(tab)}
          />
        ))}
      </div>

      {/* תוכן */}
      {activeTab === 'real-estate' && <RealEstateTab />}
      {activeTab === 'first-home' && <FirstHomeTab />}
      {activeTab === 'linear' && <LinearTab />}
      {activeTab === 'inherited' && <InheritedTab />}
      {activeTab === 'securities' && <SecuritiesTab />}
    </div>
  );
}
