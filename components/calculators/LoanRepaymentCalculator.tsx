'use client';

import { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  calculateLoanRepayment,
  calculateAmortizationSchedule,
  calculateTrueAPR,
  compareLoans,
  calculateDebtConsolidation,
  calculateEarlyPayoffLoan,
  calculateAffordabilityLoan,
  ISRAELI_LOAN_TYPES,
  getLoanTypeRecommendation,
  type LoanRepaymentInput,
  type LoanOffer,
  type ExistingLoan,
} from '@/lib/calculators/savings';
import { formatCurrency } from '@/lib/utils/formatters';
import { ResultCard } from '@/components/calculator/ResultCard';
import { Breakdown } from '@/components/calculator/Breakdown';
import { CheckCircle2, AlertTriangle, XCircle, Info, PlusCircle, Trash2 } from 'lucide-react';

// ============================================================
// Types & constants
// ============================================================
type TabMode = 'basic' | 'compare' | 'consolidate' | 'early-payoff' | 'affordability';

const PIE_COLORS = ['#2563eb', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4'];

const TAB_LABELS: Record<TabMode, string> = {
  basic: 'חישוב הלוואה',
  compare: 'השוואת הצעות',
  consolidate: 'איחוד הלוואות',
  'early-payoff': 'פירעון מוקדם',
  affordability: 'כושר החזר',
};

// ============================================================
// Small reusable components
// ============================================================

function TabBar({ active, onChange }: { active: TabMode; onChange: (t: TabMode) => void }) {
  return (
    <div className="flex flex-wrap gap-1 mb-6 bg-gray-100 rounded-xl p-1">
      {(Object.keys(TAB_LABELS) as TabMode[]).map((tab) => (
        <button
          key={tab}
          type="button"
          onClick={() => onChange(tab)}
          className={`flex-1 min-w-[120px] py-2 px-3 rounded-lg text-sm font-medium transition-all ${
            active === tab
              ? 'bg-white text-blue-700 shadow font-bold'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          {TAB_LABELS[tab]}
        </button>
      ))}
    </div>
  );
}

interface NumericInputProps {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  note?: string;
  className?: string;
}

function NumericInput({ label, value, onChange, min, max, step, unit, note, className }: NumericInputProps) {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="relative">
        <input
          type="number"
          value={value}
          min={min}
          max={max}
          step={step}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
        {unit && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 pointer-events-none">
            {unit}
          </span>
        )}
      </div>
      {note && <p className="text-xs text-gray-500 mt-1">{note}</p>}
    </div>
  );
}

function StatusBadge({ status }: { status: 'excellent' | 'good' | 'warning' | 'danger' }) {
  const configs = {
    excellent: { bg: 'bg-green-50', border: 'border-green-300', text: 'text-green-700', icon: <CheckCircle2 className="w-5 h-5 text-green-600" /> },
    good: { bg: 'bg-blue-50', border: 'border-blue-300', text: 'text-blue-700', icon: <Info className="w-5 h-5 text-blue-600" /> },
    warning: { bg: 'bg-yellow-50', border: 'border-yellow-300', text: 'text-yellow-700', icon: <AlertTriangle className="w-5 h-5 text-yellow-600" /> },
    danger: { bg: 'bg-red-50', border: 'border-red-300', text: 'text-red-700', icon: <XCircle className="w-5 h-5 text-red-600" /> },
  };
  const c = configs[status];
  return (
    <div className={`flex items-center gap-2 rounded-lg border px-3 py-2 ${c.bg} ${c.border}`}>
      {c.icon}
      <span className={`text-sm font-medium ${c.text}`} />
    </div>
  );
}

// ============================================================
// TAB 1: Basic Loan Calculator
// ============================================================
const initialBasicInput: LoanRepaymentInput = {
  loanAmount: 100_000,
  annualRate: 5.5,
  termMonths: 60,
  extraMonthlyPayment: 0,
  oneTimePayment: 0,
};

function BasicTab() {
  const [input, setInput] = useState<LoanRepaymentInput>(initialBasicInput);
  const [showAmortization, setShowAmortization] = useState(false);
  const [loanType, setLoanType] = useState('consumer');
  const [showFees, setShowFees] = useState(false);
  const [openingFee, setOpeningFee] = useState(0);
  const [monthlyServiceFee, setMonthlyServiceFee] = useState(0);
  const [mandatoryInsurance, setMandatoryInsurance] = useState(0);

  function update<K extends keyof LoanRepaymentInput>(field: K, value: LoanRepaymentInput[K]) {
    setInput((prev) => ({ ...prev, [field]: value }));
  }

  const result = useMemo(() => calculateLoanRepayment(input), [input]);

  const amortization = useMemo(
    () =>
      showAmortization
        ? calculateAmortizationSchedule({
            loanAmount: input.loanAmount,
            annualRate: input.annualRate,
            termMonths: input.termMonths,
          })
        : [],
    [showAmortization, input.loanAmount, input.annualRate, input.termMonths]
  );

  const aprResult = useMemo(
    () =>
      calculateTrueAPR({
        loanAmount: input.loanAmount,
        annualRate: input.annualRate,
        termMonths: input.termMonths,
        openingFee,
        monthlyServiceFee,
        mandatoryInsurance,
        otherFees: 0,
      }),
    [input.loanAmount, input.annualRate, input.termMonths, openingFee, monthlyServiceFee, mandatoryInsurance]
  );

  const selectedType = ISRAELI_LOAN_TYPES.find((t) => t.id === loanType);
  const rateRecommendation = getLoanTypeRecommendation(input.annualRate);

  // Chart data
  const chartData = useMemo(() => {
    const schedule = calculateAmortizationSchedule({
      loanAmount: input.loanAmount,
      annualRate: input.annualRate,
      termMonths: input.termMonths,
    });
    const yearly: Array<{ year: string; balance: number; cumulativeInterest: number; principalPaid: number }> = [];
    for (let y = 0; y < Math.ceil(input.termMonths / 12); y++) {
      const row = schedule[Math.min((y + 1) * 12 - 1, schedule.length - 1)];
      if (row) {
        yearly.push({
          year: `שנה ${y + 1}`,
          balance: Math.round(row.balance),
          cumulativeInterest: Math.round(row.cumulativeInterest),
          principalPaid: Math.round(row.cumulativePrincipal),
        });
      }
    }
    return yearly;
  }, [input.loanAmount, input.annualRate, input.termMonths]);

  const pieData = [
    { name: 'קרן', value: input.loanAmount },
    { name: 'ריבית', value: Math.round(result.totalInterest) },
    ...(openingFee + monthlyServiceFee + mandatoryInsurance > 0
      ? [{ name: 'עמלות', value: Math.round(openingFee + (monthlyServiceFee + mandatoryInsurance) * input.termMonths) }]
      : []),
  ];

  const hasAcceleration = input.extraMonthlyPayment > 0 || input.oneTimePayment > 0;

  return (
    <div className="space-y-6">
      {/* Loan Type Selector */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <h3 className="font-bold text-blue-900 mb-3">סוג ההלוואה</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {ISRAELI_LOAN_TYPES.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => {
                setLoanType(t.id);
                update('annualRate', (t.typicalRateMin + t.typicalRateMax) / 2);
                update('termMonths', t.typicalTermMonths);
              }}
              className={`p-2 rounded-lg border text-xs text-right transition-all ${
                loanType === t.id
                  ? 'border-blue-600 bg-blue-100 text-blue-900 font-bold'
                  : 'border-gray-300 bg-white text-gray-700 hover:border-blue-400'
              }`}
            >
              <div className="font-medium">{t.nameHe}</div>
              <div className="text-gray-500">{t.typicalRateMin}%-{t.typicalRateMax}%</div>
            </button>
          ))}
        </div>
        {selectedType && (
          <p className="text-xs text-blue-800 mt-2">{selectedType.tip}</p>
        )}
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Input Panel */}
        <div className="lg:col-span-3 bg-white border-2 border-gray-200 rounded-xl p-6 space-y-5">
          <h2 className="text-xl font-bold text-gray-900">פרטי ההלוואה</h2>

          <NumericInput
            label='סכום ההלוואה (₪)'
            value={input.loanAmount}
            onChange={(v) => update('loanAmount', v)}
            min={0}
            step={1000}
          />

          <div className="grid grid-cols-2 gap-3">
            <NumericInput
              label="ריבית שנתית (%)"
              value={input.annualRate}
              onChange={(v) => update('annualRate', v)}
              min={0}
              max={30}
              step={0.1}
              note={selectedType ? `טווח אופייני: ${selectedType.typicalRateMin}%-${selectedType.typicalRateMax}%` : undefined}
            />
            <NumericInput
              label="תקופה (חודשים)"
              value={input.termMonths}
              onChange={(v) => update('termMonths', v)}
              min={1}
              max={360}
              note={`${(input.termMonths / 12).toFixed(1)} שנים`}
            />
          </div>

          {/* Rate recommendation */}
          {input.annualRate >= 6 && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800">
              <strong>טיפ:</strong> {rateRecommendation}
            </div>
          )}

          {/* Early payoff section */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-bold text-blue-900 mb-2">סילוק מואץ (אופציונלי)</h3>
            <p className="text-xs text-blue-800 mb-3">הוסף תשלומים נוספים כדי לסיים מהר ולחסוך ריבית</p>
            <div className="grid grid-cols-2 gap-3">
              <NumericInput
                label="תשלום נוסף חודשי (₪)"
                value={input.extraMonthlyPayment}
                onChange={(v) => update('extraMonthlyPayment', v)}
                min={0}
                step={100}
              />
              <NumericInput
                label="תשלום חד-פעמי (₪)"
                value={input.oneTimePayment}
                onChange={(v) => update('oneTimePayment', v)}
                min={0}
                step={1000}
              />
            </div>
          </div>

          {/* Fees section */}
          <div>
            <button
              type="button"
              onClick={() => setShowFees(!showFees)}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              {showFees ? '▲ הסתר עמלות' : '▼ הוסף עמלות (לחישוב APR אמיתי)'}
            </button>
            {showFees && (
              <div className="mt-3 space-y-3 bg-gray-50 rounded-lg p-4 border border-gray-200">
                <p className="text-xs text-gray-600">עמלות נסתרות מעלות את ה-APR האמיתי ב-1-3%</p>
                <div className="grid grid-cols-3 gap-3">
                  <NumericInput
                    label="עמלת פתיחת תיק (₪)"
                    value={openingFee}
                    onChange={setOpeningFee}
                    min={0}
                    step={100}
                  />
                  <NumericInput
                    label="דמי ניהול חודשי (₪)"
                    value={monthlyServiceFee}
                    onChange={setMonthlyServiceFee}
                    min={0}
                    step={10}
                  />
                  <NumericInput
                    label="ביטוח חובה חודשי (₪)"
                    value={mandatoryInsurance}
                    onChange={setMandatoryInsurance}
                    min={0}
                    step={10}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-2 space-y-4">
          <ResultCard
            title="תשלום חודשי"
            value={formatCurrency(result.monthlyPayment)}
            subtitle={`${input.termMonths} חודשים`}
            variant="primary"
          />

          <ResultCard
            title="סך ריבית"
            value={formatCurrency(result.totalInterest)}
            subtitle={`${((result.totalInterest / input.loanAmount) * 100).toFixed(0)}% מהקרן`}
            variant="warning"
          />

          <ResultCard
            title="סך עלות כוללת"
            value={formatCurrency(result.totalPayments)}
            subtitle="קרן + ריבית"
            variant="primary"
          />

          {showFees && (openingFee + monthlyServiceFee + mandatoryInsurance > 0) && (
            <div className="bg-orange-50 border-2 border-orange-200 rounded-xl p-4 space-y-2 text-sm">
              <h3 className="font-bold text-orange-900">APR אמיתי (כולל עמלות)</h3>
              <div className="flex justify-between">
                <span>ריבית נומינלית:</span>
                <strong>{input.annualRate.toFixed(1)}%</strong>
              </div>
              <div className="flex justify-between">
                <span>APR אמיתי:</span>
                <strong className="text-orange-700">{aprResult.trueAPR.toFixed(2)}%</strong>
              </div>
              <div className="flex justify-between">
                <span>עלות עמלות כוללת:</span>
                <strong className="text-orange-700">{formatCurrency(aprResult.totalFees)}</strong>
              </div>
              <div className="flex justify-between">
                <span>תשלום חודשי אמיתי:</span>
                <strong>{formatCurrency(aprResult.trueMonthlyPayment)}</strong>
              </div>
            </div>
          )}

          {hasAcceleration && (
            <div className="bg-green-50 border-2 border-green-200 rounded-xl p-5">
              <div className="flex items-start gap-3 mb-4">
                <CheckCircle2 className="w-8 h-8 text-green-600 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-green-900 text-lg">חיסכון מסילוק מואץ!</h3>
                  <p className="text-sm text-green-800">
                    תסיים {result.monthsSaved} חודשים מוקדם יותר
                  </p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>חיסכון בריבית:</span>
                  <strong className="text-green-700">{formatCurrency(result.interestSaved)}</strong>
                </div>
                <div className="flex justify-between">
                  <span>תקופה חדשה:</span>
                  <strong>{result.acceleratedTermMonths} חודשים</strong>
                </div>
                <div className="flex justify-between">
                  <span>ריבית בתקופה המואצת:</span>
                  <strong>{formatCurrency(result.acceleratedTotalInterest)}</strong>
                </div>
              </div>
            </div>
          )}

          <Breakdown
            title="פירוט"
            defaultOpen
            items={[
              { label: 'סכום הלוואה', value: formatCurrency(input.loanAmount) },
              { label: 'ריבית שנתית', value: `${input.annualRate}%` },
              { label: 'תקופה', value: `${input.termMonths} חודשים` },
              { label: 'תשלום חודשי', value: formatCurrency(result.monthlyPayment), bold: true },
              { label: 'סך תשלומים', value: formatCurrency(result.totalPayments) },
              { label: 'סך ריבית', value: formatCurrency(result.totalInterest), bold: true },
              ...(hasAcceleration
                ? [
                    { label: 'חודשים שנחסכו', value: `${result.monthsSaved}`, bold: true },
                    { label: 'ריבית שנחסכה', value: formatCurrency(result.interestSaved), bold: true },
                  ]
                : []),
            ]}
          />
        </div>
      </div>

      {/* Balance Chart */}
      {chartData.length > 0 && (
        <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
          <h3 className="font-bold text-gray-900 mb-4">התפתחות יתרת ההלוואה לאורך השנים</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="balanceGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="interestGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" tick={{ fontSize: 11 }} />
              <YAxis tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v) => formatCurrency(Number(v))} />
              <Legend />
              <Area
                type="monotone"
                dataKey="balance"
                name="יתרת קרן"
                stroke="#2563eb"
                fill="url(#balanceGrad)"
              />
              <Area
                type="monotone"
                dataKey="cumulativeInterest"
                name="ריבית מצטברת"
                stroke="#f59e0b"
                fill="url(#interestGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Pie chart */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
          <h3 className="font-bold text-gray-900 mb-4">חלוקת עלות ההלוואה</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                dataKey="value"
                nameKey="name"
                label={({ name, percent }: { name?: string; percent?: number }) => `${name ?? ''} ${((percent ?? 0) * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {pieData.map((_, index) => (
                  <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => formatCurrency(Number(v))} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Amortization toggle */}
        <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900">לוח סילוקין</h3>
            <button
              type="button"
              onClick={() => setShowAmortization(!showAmortization)}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              {showAmortization ? 'הסתר' : 'הצג לוח מלא'}
            </button>
          </div>
          {!showAmortization && (
            <div className="text-sm text-gray-600 space-y-2">
              <p>לחץ על &quot;הצג לוח מלא&quot; לפירוט כל תשלום: קרן, ריבית ויתרה.</p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-blue-50 rounded p-2">
                  <div className="text-gray-500">תשלום ראשון</div>
                  <div className="font-bold text-blue-700">
                    ריבית: {amortization[0] ? formatCurrency(amortization[0].interest) : '—'}
                  </div>
                </div>
                <div className="bg-green-50 rounded p-2">
                  <div className="text-gray-500">תשלום אחרון</div>
                  <div className="font-bold text-green-700">
                    ריבית: {amortization.length > 0
                      ? formatCurrency(amortization[amortization.length - 1]?.interest ?? 0)
                      : '—'}
                  </div>
                </div>
              </div>
            </div>
          )}
          {showAmortization && amortization.length > 0 && (
            <div className="overflow-auto max-h-72">
              <table className="w-full text-xs text-right">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="p-2 text-gray-600">חודש</th>
                    <th className="p-2 text-gray-600">תשלום</th>
                    <th className="p-2 text-gray-600">קרן</th>
                    <th className="p-2 text-gray-600">ריבית</th>
                    <th className="p-2 text-gray-600">יתרה</th>
                  </tr>
                </thead>
                <tbody>
                  {amortization.map((row) => (
                    <tr key={row.month} className="border-t border-gray-100">
                      <td className="p-2 text-gray-700">{row.month}</td>
                      <td className="p-2">{formatCurrency(row.payment)}</td>
                      <td className="p-2 text-green-700">{formatCurrency(row.principal)}</td>
                      <td className="p-2 text-red-600">{formatCurrency(row.interest)}</td>
                      <td className="p-2 font-medium">{formatCurrency(row.balance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// TAB 2: Loan Comparison
// ============================================================
let offerIdCounter = 0;
function newOfferId() { return `offer-${++offerIdCounter}`; }

const DEFAULT_OFFERS: LoanOffer[] = [
  { id: newOfferId(), name: 'בנק א\'', loanAmount: 50_000, annualRate: 5.0, termMonths: 36, openingFee: 500, monthlyServiceFee: 0 },
  { id: newOfferId(), name: 'בנק ב\'', loanAmount: 50_000, annualRate: 4.5, termMonths: 48, openingFee: 0, monthlyServiceFee: 15 },
  { id: newOfferId(), name: 'בנק ג\'', loanAmount: 50_000, annualRate: 6.0, termMonths: 24, openingFee: 300, monthlyServiceFee: 0 },
];

function CompareTab() {
  const [offers, setOffers] = useState<LoanOffer[]>(DEFAULT_OFFERS);

  const results = useMemo(() => compareLoans(offers), [offers]);

  function updateOffer(id: string, field: keyof LoanOffer, value: string | number) {
    setOffers((prev) => prev.map((o) => (o.id === id ? { ...o, [field]: value } : o)));
  }

  function addOffer() {
    setOffers((prev) => [
      ...prev,
      { id: newOfferId(), name: `הצעה ${prev.length + 1}`, loanAmount: 50_000, annualRate: 6, termMonths: 36, openingFee: 0, monthlyServiceFee: 0 },
    ]);
  }

  function removeOffer(id: string) {
    setOffers((prev) => prev.filter((o) => o.id !== id));
  }

  const RANK_COLORS = ['#10b981', '#2563eb', '#f59e0b', '#8b5cf6', '#ef4444'];

  const barData = results.map((r) => ({
    name: r.name,
    'ריבית כוללת': Math.round(r.totalInterest),
    'סך עלות': Math.round(r.totalCost),
    'תשלום חודשי': Math.round(r.monthlyPayment),
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">השוואת הצעות הלוואה</h2>
        {offers.length < 5 && (
          <button
            type="button"
            onClick={addOffer}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            <PlusCircle className="w-4 h-4" />
            הוסף הצעה
          </button>
        )}
      </div>

      {/* Offer inputs */}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {offers.map((offer, idx) => (
          <div
            key={offer.id}
            className="border-2 rounded-xl p-4 bg-white"
            style={{ borderColor: PIE_COLORS[idx % PIE_COLORS.length] }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: PIE_COLORS[idx % PIE_COLORS.length] }} />
                <input
                  type="text"
                  value={offer.name}
                  onChange={(e) => updateOffer(offer.id, 'name', e.target.value)}
                  className="font-bold text-gray-900 bg-transparent border-b border-dashed border-gray-300 focus:border-blue-500 focus:outline-none text-sm"
                />
              </div>
              {offers.length > 2 && (
                <button type="button" onClick={() => removeOffer(offer.id)} className="text-red-400 hover:text-red-600">
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
            <div className="space-y-3">
              <NumericInput
                label="סכום (₪)"
                value={offer.loanAmount}
                onChange={(v) => updateOffer(offer.id, 'loanAmount', v)}
                min={0}
                step={1000}
              />
              <div className="grid grid-cols-2 gap-2">
                <NumericInput
                  label="ריבית (%)"
                  value={offer.annualRate}
                  onChange={(v) => updateOffer(offer.id, 'annualRate', v)}
                  min={0}
                  max={30}
                  step={0.1}
                />
                <NumericInput
                  label="חודשים"
                  value={offer.termMonths}
                  onChange={(v) => updateOffer(offer.id, 'termMonths', v)}
                  min={1}
                  max={360}
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <NumericInput
                  label="עמלת פתיחה (₪)"
                  value={offer.openingFee ?? 0}
                  onChange={(v) => updateOffer(offer.id, 'openingFee', v)}
                  min={0}
                  step={100}
                />
                <NumericInput
                  label="דמי ניהול/חודש (₪)"
                  value={offer.monthlyServiceFee ?? 0}
                  onChange={(v) => updateOffer(offer.id, 'monthlyServiceFee', v)}
                  min={0}
                  step={5}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Results table */}
      {results.length > 0 && (
        <div className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-bold text-gray-900">תוצאות ההשוואה</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-right">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-3 text-gray-600">דירוג</th>
                  <th className="p-3 text-gray-600">שם</th>
                  <th className="p-3 text-gray-600">תשלום חודשי</th>
                  <th className="p-3 text-gray-600">סך ריבית</th>
                  <th className="p-3 text-gray-600">APR אמיתי</th>
                  <th className="p-3 text-gray-600">סך עלות כוללת</th>
                </tr>
              </thead>
              <tbody>
                {results.map((r, idx) => (
                  <tr
                    key={r.id}
                    className={`border-t border-gray-100 ${r.rank === 1 ? 'bg-green-50' : ''}`}
                  >
                    <td className="p-3">
                      <span
                        className="inline-flex items-center justify-center w-7 h-7 rounded-full text-white text-xs font-bold"
                        style={{ backgroundColor: RANK_COLORS[idx % RANK_COLORS.length] }}
                      >
                        {r.rank}
                      </span>
                    </td>
                    <td className="p-3 font-medium">
                      {r.name}
                      {r.rank === 1 && <span className="mr-2 text-xs text-green-600 font-bold">✓ הטוב ביותר</span>}
                    </td>
                    <td className="p-3">{formatCurrency(r.monthlyPayment)}</td>
                    <td className="p-3 text-red-600">{formatCurrency(r.totalInterest)}</td>
                    <td className="p-3 font-medium">{r.trueAPR.toFixed(2)}%</td>
                    <td className={`p-3 font-bold ${r.rank === 1 ? 'text-green-700' : ''}`}>
                      {formatCurrency(r.totalCost)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Bar chart */}
      {results.length > 0 && (
        <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
          <h3 className="font-bold text-gray-900 mb-4">השוואה ויזואלית</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v) => formatCurrency(Number(v))} />
              <Legend />
              <Bar dataKey="ריבית כוללת" fill="#f59e0b" />
              <Bar dataKey="סך עלות" fill="#2563eb" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {results.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-900">
          <strong>המלצה:</strong>{' '}
          {results[0] && (
            <>
              ההצעה של <strong>{results[0].name}</strong> היא הזולה ביותר עם עלות כוללת של{' '}
              <strong>{formatCurrency(results[0].totalCost)}</strong> ו-APR אמיתי של{' '}
              <strong>{results[0].trueAPR.toFixed(2)}%</strong>.{' '}
              {results[1] && (
                <>
                  לעומת <strong>{results[results.length - 1].name}</strong> (היקרה) – תחסוך{' '}
                  <strong>{formatCurrency(results[results.length - 1].totalCost - results[0].totalCost)}</strong>.
                </>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

// ============================================================
// TAB 3: Debt Consolidation
// ============================================================
let loanIdCounter = 0;
function newLoanId() { return `loan-${++loanIdCounter}`; }

const DEFAULT_LOANS: ExistingLoan[] = [
  { id: newLoanId(), name: 'כרטיס אשראי', remainingBalance: 20_000, annualRate: 16, remainingMonths: 24 },
  { id: newLoanId(), name: 'הלוואה צרכנית', remainingBalance: 30_000, annualRate: 9, remainingMonths: 36 },
  { id: newLoanId(), name: 'אוברדרפט', remainingBalance: 10_000, annualRate: 12, remainingMonths: 12 },
];

function ConsolidateTab() {
  const [loans, setLoans] = useState<ExistingLoan[]>(DEFAULT_LOANS);
  const [consolidationRate, setConsolidationRate] = useState(6);
  const [consolidationTermMonths, setConsolidationTermMonths] = useState(48);
  const [consolidationFee, setConsolidationFee] = useState(500);

  const result = useMemo(
    () =>
      calculateDebtConsolidation({
        existingLoans: loans,
        consolidationRate,
        consolidationTermMonths,
        consolidationFee,
      }),
    [loans, consolidationRate, consolidationTermMonths, consolidationFee]
  );

  function updateLoan(id: string, field: keyof ExistingLoan, value: string | number) {
    setLoans((prev) => prev.map((l) => (l.id === id ? { ...l, [field]: value } : l)));
  }

  function addLoan() {
    setLoans((prev) => [
      ...prev,
      { id: newLoanId(), name: `הלוואה ${prev.length + 1}`, remainingBalance: 10_000, annualRate: 8, remainingMonths: 24 },
    ]);
  }

  function removeLoan(id: string) {
    setLoans((prev) => prev.filter((l) => l.id !== id));
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-900">מחשבון איחוד הלוואות</h2>
      <p className="text-gray-600 text-sm">הכנס את ההלוואות הקיימות שלך וגלה האם כדאי לאחדן</p>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Existing loans */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-gray-800">הלוואות קיימות</h3>
            <button
              type="button"
              onClick={addLoan}
              className="flex items-center gap-1 text-blue-600 text-sm font-medium"
            >
              <PlusCircle className="w-4 h-4" />
              הוסף הלוואה
            </button>
          </div>

          {loans.map((loan, idx) => (
            <div
              key={loan.id}
              className="border-2 rounded-xl p-4 bg-white"
              style={{ borderColor: PIE_COLORS[idx % PIE_COLORS.length] }}
            >
              <div className="flex items-center justify-between mb-3">
                <input
                  type="text"
                  value={loan.name}
                  onChange={(e) => updateLoan(loan.id, 'name', e.target.value)}
                  className="font-medium text-gray-900 bg-transparent border-b border-dashed border-gray-300 focus:border-blue-500 focus:outline-none text-sm"
                />
                {loans.length > 1 && (
                  <button type="button" onClick={() => removeLoan(loan.id)} className="text-red-400 hover:text-red-600">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
              <div className="grid grid-cols-3 gap-2">
                <NumericInput
                  label="יתרה (₪)"
                  value={loan.remainingBalance}
                  onChange={(v) => updateLoan(loan.id, 'remainingBalance', v)}
                  min={0}
                  step={1000}
                />
                <NumericInput
                  label="ריבית (%)"
                  value={loan.annualRate}
                  onChange={(v) => updateLoan(loan.id, 'annualRate', v)}
                  min={0}
                  max={30}
                  step={0.5}
                />
                <NumericInput
                  label="חודשים נותרים"
                  value={loan.remainingMonths}
                  onChange={(v) => updateLoan(loan.id, 'remainingMonths', v)}
                  min={1}
                  max={360}
                />
              </div>
            </div>
          ))}

          {/* Consolidation terms */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 space-y-3">
            <h3 className="font-bold text-blue-900">תנאי הלוואה מאחדת</h3>
            <div className="grid grid-cols-3 gap-3">
              <NumericInput
                label="ריבית מוצעת (%)"
                value={consolidationRate}
                onChange={setConsolidationRate}
                min={0}
                max={20}
                step={0.1}
              />
              <NumericInput
                label="תקופה (חודשים)"
                value={consolidationTermMonths}
                onChange={setConsolidationTermMonths}
                min={12}
                max={120}
              />
              <NumericInput
                label="עמלת פתיחה (₪)"
                value={consolidationFee}
                onChange={setConsolidationFee}
                min={0}
                step={100}
              />
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-4">
          <div
            className={`border-2 rounded-xl p-5 ${
              result.recommended
                ? 'bg-green-50 border-green-300'
                : 'bg-red-50 border-red-300'
            }`}
          >
            <div className="flex items-center gap-2 mb-3">
              {result.recommended ? (
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              ) : (
                <XCircle className="w-6 h-6 text-red-500" />
              )}
              <h3 className={`font-bold text-lg ${result.recommended ? 'text-green-900' : 'text-red-900'}`}>
                {result.recommended ? 'האיחוד משתלם!' : 'האיחוד לא משתלם'}
              </h3>
            </div>
            <p className="text-sm text-gray-700">{result.recommendation}</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <ResultCard
              title="תשלום חודשי נוכחי"
              value={formatCurrency(result.currentMonthlyTotal)}
              subtitle="סך כל ההלוואות"
              variant="warning"
            />
            <ResultCard
              title="תשלום חודשי חדש"
              value={formatCurrency(result.consolidatedMonthlyPayment)}
              subtitle="הלוואה מאוחדת"
              variant="primary"
            />
          </div>

          <Breakdown
            title="פירוט השוואה"
            defaultOpen
            items={[
              { label: 'סך חוב כולל', value: formatCurrency(result.totalBalance) },
              { label: 'ריבית ממוצעת נוכחית', value: `${result.weightedAverageRate.toFixed(1)}%` },
              { label: 'ריבית הלוואה מאחדת', value: `${consolidationRate}%` },
              { label: 'חיסכון חודשי', value: formatCurrency(result.monthlySavings), bold: true },
              { label: 'חיסכון כולל', value: formatCurrency(result.totalSavings), bold: true },
              { label: 'נקודת האיזון (חודשים)', value: `${result.breakEvenMonths === 999 ? '—' : result.breakEvenMonths}` },
              { label: 'ריבית נוכחית נותרת', value: formatCurrency(result.currentTotalInterestRemaining) },
              { label: 'ריבית הלוואה מאחדת', value: formatCurrency(result.consolidatedTotalInterest) },
            ]}
          />

          {result.totalBalance > 0 && (
            <div className="bg-white border-2 border-gray-200 rounded-xl p-4">
              <h3 className="font-bold text-gray-900 mb-3 text-sm">פירוט לפי הלוואה</h3>
              <div className="space-y-2">
                {loans.map((loan, idx) => (
                  <div key={loan.id} className="flex items-center gap-2 text-xs">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: PIE_COLORS[idx % PIE_COLORS.length] }} />
                    <span className="flex-1 text-gray-700">{loan.name}</span>
                    <span className="text-gray-500">{formatCurrency(loan.remainingBalance)}</span>
                    <span className="font-medium text-red-600">{loan.annualRate}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// TAB 4: Early Payoff
// ============================================================
function EarlyPayoffTab() {
  const [loanAmount, setLoanAmount] = useState(100_000);
  const [annualRate, setAnnualRate] = useState(6);
  const [termMonths, setTermMonths] = useState(60);
  const [monthsElapsed, setMonthsElapsed] = useState(12);
  const [lumpSum, setLumpSum] = useState(10_000);
  const [extraMonthly, setExtraMonthly] = useState(500);
  const [penaltyPct, setPenaltyPct] = useState(0);

  const result = useMemo(
    () =>
      calculateEarlyPayoffLoan({
        loanAmount,
        annualRate,
        termMonths,
        monthsElapsed,
        lumpSumPayment: lumpSum,
        extraMonthlyPayment: extraMonthly,
        earlyPayoffPenaltyPct: penaltyPct,
      }),
    [loanAmount, annualRate, termMonths, monthsElapsed, lumpSum, extraMonthly, penaltyPct]
  );

  const pieData = [
    { name: 'ריבית שנחסכה', value: Math.max(0, result.interestSaved) },
    { name: 'ריבית שנותרת', value: Math.max(0, result.newTotalInterest) },
    { name: 'קנס פירעון', value: Math.max(0, result.penaltyAmount) },
  ].filter((d) => d.value > 0);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-900">מחשבון פירעון מוקדם</h2>
      <p className="text-gray-600 text-sm">חשב כמה תחסוך מפירעון מוקדם של ההלוואה</p>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Inputs */}
        <div className="bg-white border-2 border-gray-200 rounded-xl p-6 space-y-5">
          <h3 className="font-bold text-gray-800">פרטי ההלוואה הנוכחית</h3>
          <div className="grid grid-cols-2 gap-3">
            <NumericInput label="סכום מקורי (₪)" value={loanAmount} onChange={setLoanAmount} min={0} step={1000} />
            <NumericInput label="ריבית שנתית (%)" value={annualRate} onChange={setAnnualRate} min={0} max={30} step={0.1} />
            <NumericInput label="תקופה מקורית (חודשים)" value={termMonths} onChange={setTermMonths} min={1} max={360} />
            <NumericInput
              label="חודשים ששולמו"
              value={monthsElapsed}
              onChange={setMonthsElapsed}
              min={0}
              max={termMonths - 1}
              note={`יתרה משוערת: ${formatCurrency(result.currentBalance)}`}
            />
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-3">
            <h3 className="font-bold text-green-900">תשלום נוסף</h3>
            <div className="grid grid-cols-2 gap-3">
              <NumericInput
                label="תשלום חד-פעמי (₪)"
                value={lumpSum}
                onChange={setLumpSum}
                min={0}
                step={1000}
                note="מופחת מהקרן מיד"
              />
              <NumericInput
                label="תשלום חודשי נוסף (₪)"
                value={extraMonthly}
                onChange={setExtraMonthly}
                min={0}
                step={100}
              />
            </div>
          </div>

          <NumericInput
            label="קנס פירעון מוקדם (%)"
            value={penaltyPct}
            onChange={setPenaltyPct}
            min={0}
            max={5}
            step={0.5}
            note="בהלוואות צרכנית ישראלית בד&quot;כ 0-2%"
          />
        </div>

        {/* Results */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <ResultCard
              title="חודשים שנחסכים"
              value={`${result.monthsSaved}`}
              subtitle={`מ-${result.remainingMonthsOriginal} ל-${result.newRemainingMonths} חודשים`}
              variant="primary"
            />
            <ResultCard
              title="ריבית שנחסכת"
              value={formatCurrency(result.interestSaved)}
              subtitle="לפני קנס"
              variant={result.interestSaved > 0 ? 'success' : 'warning'}
            />
          </div>

          {result.penaltyAmount > 0 && (
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-orange-800 font-medium">קנס פירעון מוקדם:</span>
                <strong className="text-orange-900">{formatCurrency(result.penaltyAmount)}</strong>
              </div>
            </div>
          )}

          <div
            className={`border-2 rounded-xl p-5 ${
              result.netSavings > 0 ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300'
            }`}
          >
            <h3 className={`font-bold text-lg mb-2 ${result.netSavings > 0 ? 'text-green-900' : 'text-red-900'}`}>
              {result.netSavings > 0 ? 'חיסכון נטו:' : 'עלות נטו:'}
            </h3>
            <div className="text-2xl font-bold">
              {formatCurrency(Math.abs(result.netSavings))}
            </div>
            <p className="text-sm text-gray-600 mt-1">
              תאריך סיום חדש: <strong>{result.newPayoffDate}</strong>
            </p>
          </div>

          <Breakdown
            title="פירוט"
            defaultOpen
            items={[
              { label: 'תשלום חודשי מקורי', value: formatCurrency(result.originalMonthlyPayment) },
              { label: 'יתרה נוכחית', value: formatCurrency(result.currentBalance) },
              { label: 'חודשים נותרים ללא שינוי', value: `${result.remainingMonthsOriginal}` },
              { label: 'ריבית נותרת ללא שינוי', value: formatCurrency(result.originalRemainingInterest) },
              { label: 'חודשים חדשים', value: `${result.newRemainingMonths}`, bold: true },
              { label: 'ריבית חדשה', value: formatCurrency(result.newTotalInterest), bold: true },
              { label: 'חיסכון בריבית', value: formatCurrency(result.interestSaved), bold: true },
              { label: 'קנס פירעון', value: formatCurrency(result.penaltyAmount) },
              { label: 'חיסכון נטו', value: formatCurrency(result.netSavings), bold: true },
            ]}
          />

          {pieData.length > 0 && (
            <div className="bg-white border-2 border-gray-200 rounded-xl p-4">
              <h3 className="font-bold text-gray-900 mb-3 text-sm">חלוקת הריבית</h3>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={70}
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }: { name?: string; percent?: number }) => `${name ?? ''}: ${((percent ?? 0) * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {pieData.map((_, index) => (
                      <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => formatCurrency(Number(v))} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// TAB 5: Affordability Check
// ============================================================
function AffordabilityTab() {
  const [monthlyNetIncome, setMonthlyNetIncome] = useState(15_000);
  const [existingObligations, setExistingObligations] = useState(3_000);
  const [loanAmount, setLoanAmount] = useState(80_000);
  const [annualRate, setAnnualRate] = useState(6);
  const [termMonths, setTermMonths] = useState(48);

  // Calculate monthly payment for the requested loan
  const requestedMonthlyPayment = useMemo(() => {
    const r = annualRate / 100 / 12;
    const n = termMonths;
    const P = loanAmount;
    if (P <= 0 || n <= 0) return 0;
    return r === 0 ? P / n : (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  }, [loanAmount, annualRate, termMonths]);

  const result = useMemo(
    () =>
      calculateAffordabilityLoan({
        monthlyNetIncome,
        existingObligations,
        requestedMonthlyPayment,
      }),
    [monthlyNetIncome, existingObligations, requestedMonthlyPayment]
  );

  const statusConfigs = {
    excellent: { bg: 'bg-green-50', border: 'border-green-300', textColor: 'text-green-900', icon: <CheckCircle2 className="w-6 h-6 text-green-600" /> },
    good: { bg: 'bg-blue-50', border: 'border-blue-300', textColor: 'text-blue-900', icon: <Info className="w-6 h-6 text-blue-600" /> },
    warning: { bg: 'bg-yellow-50', border: 'border-yellow-300', textColor: 'text-yellow-900', icon: <AlertTriangle className="w-6 h-6 text-yellow-600" /> },
    danger: { bg: 'bg-red-50', border: 'border-red-300', textColor: 'text-red-900', icon: <XCircle className="w-6 h-6 text-red-600" /> },
  };

  const cfg = statusConfigs[result.status];

  const chartData = [
    { name: 'הכנסה נטו', value: monthlyNetIncome, fill: '#10b981' },
    { name: 'התחייבויות קיימות', value: existingObligations, fill: '#f59e0b' },
    { name: 'תשלום ההלוואה', value: requestedMonthlyPayment, fill: '#ef4444' },
    { name: 'פנוי לאחר', value: Math.max(0, result.disposableAfterLoan), fill: '#2563eb' },
  ];

  const dtiGaugeData = [
    { name: 'חוב', value: result.dtiRatio },
    { name: 'פנוי', value: Math.max(0, 100 - result.dtiRatio) },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-900">בדיקת כושר החזר</h2>
      <p className="text-gray-600 text-sm">בדוק האם ההלוואה המבוקשת מתאימה למצבך הפיננסי</p>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Inputs */}
        <div className="bg-white border-2 border-gray-200 rounded-xl p-6 space-y-5">
          <div className="space-y-3">
            <h3 className="font-bold text-gray-800">מצב פיננסי נוכחי</h3>
            <NumericInput
              label="הכנסה חודשית נטו (₪)"
              value={monthlyNetIncome}
              onChange={setMonthlyNetIncome}
              min={0}
              step={500}
              note="לאחר ניכוי מסים"
            />
            <NumericInput
              label="התחייבויות חודשיות קיימות (₪)"
              value={existingObligations}
              onChange={setExistingObligations}
              min={0}
              step={100}
              note="משכנתא, הלוואות אחרות, ליסינג"
            />
          </div>

          <div className="space-y-3">
            <h3 className="font-bold text-gray-800">הלוואה מבוקשת</h3>
            <NumericInput label="סכום הלוואה (₪)" value={loanAmount} onChange={setLoanAmount} min={0} step={1000} />
            <div className="grid grid-cols-2 gap-3">
              <NumericInput
                label="ריבית שנתית (%)"
                value={annualRate}
                onChange={setAnnualRate}
                min={0}
                max={30}
                step={0.1}
              />
              <NumericInput
                label="תקופה (חודשים)"
                value={termMonths}
                onChange={setTermMonths}
                min={1}
                max={360}
              />
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">תשלום חודשי מחושב:</span>
              <strong>{formatCurrency(requestedMonthlyPayment)}</strong>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-4">
          <div className={`border-2 rounded-xl p-5 ${cfg.bg} ${cfg.border}`}>
            <div className="flex items-center gap-3 mb-3">
              {cfg.icon}
              <div>
                <h3 className={`font-bold text-lg ${cfg.textColor}`}>{result.statusLabel}</h3>
                <p className={`text-sm ${cfg.textColor}`}>יחס חוב להכנסה: {result.dtiRatio.toFixed(1)}%</p>
              </div>
            </div>
            <p className="text-sm text-gray-700">{result.recommendation}</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <ResultCard
              title="יחס DTI"
              value={`${result.dtiRatio.toFixed(1)}%`}
              subtitle="מסך ההכנסה"
              variant={result.dtiRatio <= 40 ? 'success' : 'warning'}
            />
            <ResultCard
              title="פנוי לאחר הכל"
              value={formatCurrency(result.disposableAfterLoan)}
              subtitle="לחודש"
              variant={result.disposableAfterLoan > 2000 ? 'success' : 'warning'}
            />
          </div>

          <div className="bg-white border-2 border-gray-200 rounded-xl p-4">
            <h3 className="font-bold text-gray-900 mb-3 text-sm">תמהיל הכנסה מול הוצאות</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={chartData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} tick={{ fontSize: 10 }} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={110} />
                <Tooltip formatter={(v) => formatCurrency(Number(v))} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={index} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white border-2 border-gray-200 rounded-xl p-4">
            <h3 className="font-bold text-gray-900 mb-2 text-sm">מד DTI (יחס חוב להכנסה)</h3>
            <ResponsiveContainer width="100%" height={140}>
              <PieChart>
                <Pie
                  data={dtiGaugeData}
                  cx="50%"
                  cy="80%"
                  startAngle={180}
                  endAngle={0}
                  innerRadius={50}
                  outerRadius={80}
                  dataKey="value"
                >
                  <Cell fill={result.dtiRatio <= 30 ? '#10b981' : result.dtiRatio <= 40 ? '#2563eb' : result.dtiRatio <= 50 ? '#f59e0b' : '#ef4444'} />
                  <Cell fill="#e5e7eb" />
                </Pie>
                <Tooltip formatter={(v) => `${Number(v).toFixed(1)}%`} />
              </PieChart>
            </ResponsiveContainer>
            <div className="text-center -mt-4 text-sm text-gray-600">
              <div className="flex justify-center gap-4 text-xs mt-1">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500 inline-block" />מעולה &lt;30%</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500 inline-block" />טוב 30-40%</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-yellow-500 inline-block" />אזהרה 40-50%</span>
              </div>
            </div>
          </div>

          <Breakdown
            title="פירוט"
            defaultOpen
            items={[
              { label: 'הכנסה חודשית נטו', value: formatCurrency(monthlyNetIncome) },
              { label: 'התחייבויות קיימות', value: formatCurrency(existingObligations) },
              { label: 'תשלום הלוואה מבוקשת', value: formatCurrency(requestedMonthlyPayment), bold: true },
              { label: 'סך התחייבויות', value: formatCurrency(result.totalObligationsWithLoan) },
              { label: 'יחס חוב להכנסה (DTI)', value: `${result.dtiRatio.toFixed(1)}%`, bold: true },
              { label: 'מפנה חודשי לאחר', value: formatCurrency(result.disposableAfterLoan) },
              { label: 'תשלום מקסימלי מומלץ', value: formatCurrency(result.maxRecommendedPayment) },
            ]}
          />
        </div>
      </div>
    </div>
  );
}

// ============================================================
// Main Component
// ============================================================
export function LoanRepaymentCalculator() {
  const [activeTab, setActiveTab] = useState<TabMode>('basic');

  return (
    <div className="space-y-2">
      <TabBar active={activeTab} onChange={setActiveTab} />
      {activeTab === 'basic' && <BasicTab />}
      {activeTab === 'compare' && <CompareTab />}
      {activeTab === 'consolidate' && <ConsolidateTab />}
      {activeTab === 'early-payoff' && <EarlyPayoffTab />}
      {activeTab === 'affordability' && <AffordabilityTab />}
    </div>
  );
}
