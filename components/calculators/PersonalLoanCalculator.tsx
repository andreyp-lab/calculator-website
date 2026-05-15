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
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  calculatePersonalLoan,
  calculateAmortizationSchedulePersonalLoan,
  calculateTrueAPR,
  compareDebtStrategies,
  compareCreditCardVsLoan,
  compareLoanSources,
  calculateAffordabilityPersonalLoan,
  getLoanSourceRecommendation,
  ISRAELI_LOAN_SOURCES_2026,
  type DebtItem,
} from '@/lib/calculators/personal-loan';
import { formatCurrency } from '@/lib/utils/formatters';
import { ResultCard } from '@/components/calculator/ResultCard';
import { Breakdown } from '@/components/calculator/Breakdown';
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Info,
  PlusCircle,
  Trash2,
} from 'lucide-react';

// ============================================================
// Constants & helpers
// ============================================================

type TabMode = 'quick' | 'apr' | 'sources' | 'debt-payoff' | 'cc-vs-loan' | 'affordability';

const TAB_LABELS: Record<TabMode, string> = {
  quick: 'חישוב מהיר',
  apr: 'APR אמיתי',
  sources: 'השוואת מקורות',
  'debt-payoff': 'סילוק חובות',
  'cc-vs-loan': 'כרטיס vs הלוואה',
  affordability: 'כושר החזר',
};

const PIE_COLORS = ['#2563eb', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4'];

// ============================================================
// Reusable sub-components
// ============================================================

function TabBar({ active, onChange }: { active: TabMode; onChange: (t: TabMode) => void }) {
  return (
    <div className="flex flex-wrap gap-1 mb-6 bg-gray-100 rounded-xl p-1">
      {(Object.keys(TAB_LABELS) as TabMode[]).map((tab) => (
        <button
          key={tab}
          type="button"
          onClick={() => onChange(tab)}
          className={`flex-1 min-w-[100px] py-2 px-3 rounded-lg text-sm font-medium transition-all ${
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

function NumericInput({
  label,
  value,
  onChange,
  min,
  max,
  step,
  unit,
  note,
  className,
}: NumericInputProps) {
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

// ============================================================
// TAB 1: Quick Calculator
// ============================================================
function QuickTab() {
  const [loanAmount, setLoanAmount] = useState(50_000);
  const [annualRate, setAnnualRate] = useState(8);
  const [termMonths, setTermMonths] = useState(36);
  const [openingFee, setOpeningFee] = useState(500);
  const [showAmortization, setShowAmortization] = useState(false);

  const result = useMemo(
    () =>
      calculatePersonalLoan({
        loanAmount,
        annualInterestRate: annualRate,
        termMonths,
        openingFee,
      }),
    [loanAmount, annualRate, termMonths, openingFee],
  );

  const amortization = useMemo(
    () =>
      showAmortization
        ? calculateAmortizationSchedulePersonalLoan({ loanAmount, annualRate, termMonths })
        : [],
    [showAmortization, loanAmount, annualRate, termMonths],
  );

  const chartData = useMemo(() => {
    const schedule = calculateAmortizationSchedulePersonalLoan({
      loanAmount,
      annualRate,
      termMonths,
    });
    const yearly: Array<{
      year: string;
      balance: number;
      cumulativeInterest: number;
    }> = [];
    for (let y = 0; y < Math.ceil(termMonths / 12); y++) {
      const row = schedule[Math.min((y + 1) * 12 - 1, schedule.length - 1)];
      if (row) {
        yearly.push({
          year: `שנה ${y + 1}`,
          balance: Math.round(row.balance),
          cumulativeInterest: Math.round(row.cumulativeInterest),
        });
      }
    }
    return yearly;
  }, [loanAmount, annualRate, termMonths]);

  const pieData = [
    { name: 'קרן', value: loanAmount },
    { name: 'ריבית', value: Math.round(result.totalInterest) },
    ...(openingFee > 0 ? [{ name: 'עמלות', value: openingFee }] : []),
  ];

  const rateRecommendation = getLoanSourceRecommendation(annualRate);

  return (
    <div className="space-y-6">
      <div className="grid lg:grid-cols-5 gap-6">
        {/* Input Panel */}
        <div className="lg:col-span-3 bg-white border-2 border-gray-200 rounded-xl p-6 space-y-5">
          <h2 className="text-xl font-bold text-gray-900">פרטי ההלוואה</h2>

          <NumericInput
            label="סכום ההלוואה (₪)"
            value={loanAmount}
            onChange={setLoanAmount}
            min={0}
            step={1000}
          />

          <div className="grid grid-cols-2 gap-4">
            <NumericInput
              label="ריבית שנתית (%)"
              value={annualRate}
              onChange={setAnnualRate}
              min={0}
              max={30}
              step={0.5}
              note="בנקים: 5-10% | חוץ-בנקאי: 8-18%"
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">תקופה (חודשים)</label>
              <select
                value={termMonths}
                onChange={(e) => setTermMonths(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value={12}>12 חודשים (שנה)</option>
                <option value={24}>24 חודשים (שנתיים)</option>
                <option value={36}>36 חודשים (3 שנים)</option>
                <option value={48}>48 חודשים (4 שנים)</option>
                <option value={60}>60 חודשים (5 שנים)</option>
                <option value={72}>72 חודשים (6 שנים)</option>
                <option value={84}>84 חודשים (7 שנים)</option>
              </select>
            </div>
          </div>

          <NumericInput
            label="עמלת פתיחת תיק (₪)"
            value={openingFee}
            onChange={setOpeningFee}
            min={0}
            step={50}
            note="בד״כ 300-800 ₪ בבנקים"
          />

          {annualRate >= 8 && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-900">
              <strong>טיפ:</strong> {rateRecommendation}
            </div>
          )}
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-2 space-y-4">
          <ResultCard
            title="תשלום חודשי"
            value={formatCurrency(result.monthlyPayment)}
            subtitle={`${termMonths} תשלומים`}
            variant="primary"
          />

          <ResultCard
            title="סך ריבית"
            value={formatCurrency(result.totalInterest)}
            subtitle={`${((result.totalInterest / loanAmount) * 100).toFixed(0)}% מהקרן`}
            variant="warning"
          />

          <ResultCard
            title="עלות כוללת"
            value={formatCurrency(result.totalCostWithFees)}
            subtitle="קרן + ריבית + עמלות"
            variant="primary"
          />

          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 text-sm text-orange-900">
            <strong>ריבית אפקטיבית (כולל עמלות):</strong> {result.effectiveAnnualRate.toFixed(2)}%
          </div>

          <Breakdown
            title="פירוט"
            defaultOpen
            items={[
              { label: 'סכום הלוואה', value: formatCurrency(loanAmount) },
              { label: 'ריבית שנתית', value: `${annualRate}%` },
              { label: 'תקופה', value: `${termMonths} חודשים` },
              { label: 'תשלום חודשי', value: formatCurrency(result.monthlyPayment), bold: true },
              { label: 'סך תשלומים', value: formatCurrency(result.totalPayments) },
              { label: 'סך ריבית', value: formatCurrency(result.totalInterest) },
              { label: 'עמלת פתיחה', value: formatCurrency(openingFee) },
              { label: 'עלות כוללת', value: formatCurrency(result.totalCostWithFees), bold: true },
              {
                label: 'ריבית שנה ראשונה',
                value: formatCurrency(result.amortizationSummary.interestFirstYear),
              },
            ]}
          />
        </div>
      </div>

      {/* Area Chart */}
      {chartData.length > 0 && (
        <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
          <h3 className="font-bold text-gray-900 mb-4">התפתחות יתרת ההלוואה לאורך השנים</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="plBalanceGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="plInterestGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" tick={{ fontSize: 11 }} />
              <YAxis
                tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`}
                tick={{ fontSize: 11 }}
              />
              <Tooltip formatter={(v) => formatCurrency(Number(v))} />
              <Legend />
              <Area
                type="monotone"
                dataKey="balance"
                name="יתרת קרן"
                stroke="#2563eb"
                fill="url(#plBalanceGrad)"
              />
              <Area
                type="monotone"
                dataKey="cumulativeInterest"
                name="ריבית מצטברת"
                stroke="#f59e0b"
                fill="url(#plInterestGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Pie chart + Amortization */}
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
                label={({ name, percent }: { name?: string; percent?: number }) =>
                  `${name ?? ''} ${((percent ?? 0) * 100).toFixed(0)}%`
                }
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

        {/* Amortization Table */}
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
          {!showAmortization ? (
            <div className="text-sm text-gray-600 space-y-3">
              <p>לחץ להצגת כל תשלום: קרן, ריבית ויתרה.</p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-blue-50 rounded p-2">
                  <div className="text-gray-500">ריבית בחודש 1</div>
                  <div className="font-bold text-blue-700">
                    {formatCurrency((loanAmount * annualRate) / 100 / 12)}
                  </div>
                </div>
                <div className="bg-green-50 rounded p-2">
                  <div className="text-gray-500">יתרה לאחר שנה</div>
                  <div className="font-bold text-green-700">
                    {formatCurrency(result.amortizationSummary.remainingBalance12Months)}
                  </div>
                </div>
              </div>
            </div>
          ) : (
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
// TAB 2: True APR
// ============================================================
function APRTab() {
  const [loanAmount, setLoanAmount] = useState(50_000);
  const [annualRate, setAnnualRate] = useState(8);
  const [termMonths, setTermMonths] = useState(36);
  const [openingFee, setOpeningFee] = useState(500);
  const [monthlyServiceFee, setMonthlyServiceFee] = useState(25);
  const [mandatoryInsurance, setMandatoryInsurance] = useState(40);
  const [otherFees, setOtherFees] = useState(0);

  const result = useMemo(
    () =>
      calculateTrueAPR({
        loanAmount,
        annualRate,
        termMonths,
        openingFee,
        monthlyServiceFee,
        mandatoryInsurance,
        otherFees,
      }),
    [loanAmount, annualRate, termMonths, openingFee, monthlyServiceFee, mandatoryInsurance, otherFees],
  );

  const aprDiff = result.trueAPR - annualRate;

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-900">
        <strong>מה זה APR אמיתי?</strong> הבנק מפרסם ריבית נומינלית, אבל יש עמלות נסתרות שמייקרות את ההלוואה בפועל. APR כולל הכל - ריבית + עמלות. בישראל, הפרש של 1-3% נפוץ.
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 bg-white border-2 border-gray-200 rounded-xl p-6 space-y-5">
          <h2 className="text-xl font-bold text-gray-900">פרטי ההלוואה והעמלות</h2>

          <div className="grid grid-cols-3 gap-3">
            <NumericInput
              label="סכום (₪)"
              value={loanAmount}
              onChange={setLoanAmount}
              min={0}
              step={1000}
            />
            <NumericInput
              label="ריבית נומינלית (%)"
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
              max={120}
            />
          </div>

          <h3 className="font-semibold text-gray-800 border-t pt-4">עמלות נסתרות</h3>

          <div className="grid grid-cols-2 gap-3">
            <NumericInput
              label="עמלת פתיחת תיק (₪)"
              value={openingFee}
              onChange={setOpeningFee}
              min={0}
              step={50}
              note="חד פעמית בתחילת ההלוואה"
            />
            <NumericInput
              label="דמי ניהול חודשי (₪)"
              value={monthlyServiceFee}
              onChange={setMonthlyServiceFee}
              min={0}
              step={5}
              note="תשלום חודשי קבוע"
            />
            <NumericInput
              label="ביטוח אובדן כושר (₪/חודש)"
              value={mandatoryInsurance}
              onChange={setMandatoryInsurance}
              min={0}
              step={5}
              note="חובה ב-70% מהמקרים"
            />
            <NumericInput
              label="עמלות אחרות (₪)"
              value={otherFees}
              onChange={setOtherFees}
              min={0}
              step={50}
              note="העברות, ביטוח חיים וכו'"
            />
          </div>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white border-2 border-gray-200 rounded-xl p-5 space-y-3">
            <h3 className="font-bold text-gray-900">השוואה: נומינלי vs APR אמיתי</h3>
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-gray-600 text-sm">ריבית נומינלית:</span>
              <strong className="text-gray-900">{annualRate.toFixed(1)}%</strong>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-gray-600 text-sm">APR אמיתי:</span>
              <strong className={`text-lg ${aprDiff > 1 ? 'text-red-700' : 'text-orange-700'}`}>
                {result.trueAPR.toFixed(2)}%
              </strong>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-gray-600 text-sm">הפרש APR:</span>
              <strong className="text-red-600">+{aprDiff.toFixed(2)}%</strong>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-600 text-sm">סך עמלות:</span>
              <strong className="text-red-600">{formatCurrency(result.totalFees)}</strong>
            </div>
          </div>

          <ResultCard
            title="תשלום חודשי נומינלי"
            value={formatCurrency(result.statedMonthlyPayment)}
            subtitle="ריבית בלבד"
            variant="primary"
          />
          <ResultCard
            title="תשלום חודשי אמיתי"
            value={formatCurrency(result.trueMonthlyPayment)}
            subtitle="כולל כל העמלות"
            variant="warning"
          />

          {aprDiff > 1 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-900">
              <strong>אזהרה:</strong> העמלות מייקרות את ההלוואה ב-{aprDiff.toFixed(1)}%. דרוש גילוי נאות מלא מהבנק לפי חוק.
            </div>
          )}

          <Breakdown
            title="פירוט עמלות"
            defaultOpen
            items={[
              { label: 'עמלת פתיחת תיק', value: formatCurrency(result.feeBreakdown.openingFee) },
              {
                label: `דמי ניהול (${termMonths} חודשים)`,
                value: formatCurrency(result.feeBreakdown.monthlyServiceFeeTotal),
              },
              {
                label: `ביטוח (${termMonths} חודשים)`,
                value: formatCurrency(result.feeBreakdown.mandatoryInsuranceTotal),
              },
              { label: 'עמלות אחרות', value: formatCurrency(result.feeBreakdown.otherFees) },
              { label: 'סך עמלות', value: formatCurrency(result.totalFees), bold: true },
              {
                label: 'עלות כוללת עם עמלות',
                value: formatCurrency(result.totalCostWithFees),
                bold: true,
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
}

// ============================================================
// TAB 3: Loan Sources Comparison
// ============================================================
function SourcesTab() {
  const [loanAmount, setLoanAmount] = useState(50_000);
  const [termMonths, setTermMonths] = useState(36);

  const comparisons = useMemo(
    () => compareLoanSources(loanAmount, termMonths),
    [loanAmount, termMonths],
  );

  const barData = comparisons.map((c) => ({
    name: c.source.nameHe,
    'ריבית כוללת': Math.round(c.totalInterest),
    'תשלום חודשי': Math.round(c.monthlyPayment),
  }));

  const cheapest = comparisons[0];

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-900">
        <strong>טיפ:</strong> בישראל 2026, ההלוואה הזולה ביותר היא מקרן השתלמות (1.5-4.5%). לאחריה: הלוואת פנסיה, בנק, חברות אשראי. הכי יקר: מזומן מכרטיס אשראי.
      </div>

      <div className="grid grid-cols-2 gap-4 max-w-md">
        <NumericInput
          label="סכום הלוואה (₪)"
          value={loanAmount}
          onChange={setLoanAmount}
          min={1000}
          step={5000}
        />
        <NumericInput
          label="תקופה (חודשים)"
          value={termMonths}
          onChange={setTermMonths}
          min={6}
          max={120}
          step={6}
        />
      </div>

      {/* Comparison Cards */}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {comparisons.map((c, idx) => {
          const isCheapest = idx === 0;
          const savingsVsCheapest = c.totalInterest - (cheapest?.totalInterest ?? 0);
          return (
            <div
              key={c.source.id}
              className={`border-2 rounded-xl p-4 ${
                isCheapest
                  ? 'border-green-400 bg-green-50'
                  : 'border-gray-200 bg-white'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-gray-900 text-sm">{c.source.nameHe}</h3>
                {isCheapest && (
                  <span className="text-xs bg-green-600 text-white rounded-full px-2 py-0.5 font-bold">
                    הזול ביותר
                  </span>
                )}
              </div>
              <div className="text-xs text-gray-500 mb-3">
                ריבית אופיינית: {c.source.typicalRateMin}%-{c.source.typicalRateMax}%
              </div>
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">תשלום חודשי:</span>
                  <strong>{formatCurrency(c.monthlyPayment)}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">סך ריבית:</span>
                  <strong className={isCheapest ? 'text-green-700' : 'text-red-600'}>
                    {formatCurrency(c.totalInterest)}
                  </strong>
                </div>
                {!isCheapest && savingsVsCheapest > 0 && (
                  <div className="text-xs text-orange-700 mt-1">
                    יקר ב-{formatCurrency(savingsVsCheapest)} מהאופציה הזולה
                  </div>
                )}
              </div>
              <div className="mt-3 pt-3 border-t border-gray-200">
                <p className="text-xs text-gray-600">{c.source.tipHe}</p>
              </div>
              <div className="mt-2 flex flex-wrap gap-1">
                {c.source.pros.slice(0, 2).map((pro, i) => (
                  <span
                    key={i}
                    className="text-xs bg-green-100 text-green-800 rounded px-1.5 py-0.5"
                  >
                    + {pro}
                  </span>
                ))}
              </div>
              <div className="mt-1 flex flex-wrap gap-1">
                {c.source.cons.slice(0, 1).map((con, i) => (
                  <span
                    key={i}
                    className="text-xs bg-red-100 text-red-800 rounded px-1.5 py-0.5"
                  >
                    - {con}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bar chart */}
      <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
        <h3 className="font-bold text-gray-900 mb-4">השוואה ויזואלית - סך ריבית לפי מקור</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={barData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} tick={{ fontSize: 10 }} />
            <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={150} />
            <Tooltip formatter={(v) => formatCurrency(Number(v))} />
            <Legend />
            <Bar dataKey="ריבית כוללת" fill="#ef4444" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {comparisons[0] && comparisons[comparisons.length - 1] && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-sm text-green-900">
          <strong>חיסכון פוטנציאלי:</strong> בחירה ב-
          <strong>{comparisons[0].source.nameHe}</strong> לעומת{' '}
          <strong>{comparisons[comparisons.length - 1].source.nameHe}</strong> תחסוך לך{' '}
          <strong>
            {formatCurrency(
              comparisons[comparisons.length - 1].totalInterest - comparisons[0].totalInterest,
            )}
          </strong>{' '}
          ריבית על הלוואה של {formatCurrency(loanAmount)}.
        </div>
      )}
    </div>
  );
}

// ============================================================
// TAB 4: Snowball / Avalanche Debt Payoff
// ============================================================
let debtIdCounter = 0;
function newDebtId() {
  return `debt-${++debtIdCounter}`;
}

const DEFAULT_DEBTS: DebtItem[] = [
  { id: newDebtId(), name: 'כרטיס אשראי', balance: 8_000, annualRate: 18, minimumPayment: 200 },
  { id: newDebtId(), name: 'הלוואה צרכנית', balance: 25_000, annualRate: 9, minimumPayment: 600 },
  { id: newDebtId(), name: 'אוברדרפט', balance: 5_000, annualRate: 13, minimumPayment: 150 },
];

function DebtPayoffTab() {
  const [debts, setDebts] = useState<DebtItem[]>(DEFAULT_DEBTS);
  const [extra, setExtra] = useState(500);

  const comparison = useMemo(() => compareDebtStrategies(debts, extra), [debts, extra]);

  function updateDebt(id: string, field: keyof DebtItem, value: string | number) {
    setDebts((prev) => prev.map((d) => (d.id === id ? { ...d, [field]: value } : d)));
  }

  function addDebt() {
    setDebts((prev) => [
      ...prev,
      {
        id: newDebtId(),
        name: `חוב ${prev.length + 1}`,
        balance: 5_000,
        annualRate: 10,
        minimumPayment: 150,
      },
    ]);
  }

  function removeDebt(id: string) {
    setDebts((prev) => prev.filter((d) => d.id !== id));
  }

  const { snowball, avalanche, avalancheSaves, snowballSaves } = comparison;

  // Chart data for balance progression (sample every 3 months)
  const chartData = useMemo(() => {
    const maxLen = Math.max(
      snowball.monthlySummary.length,
      avalanche.monthlySummary.length,
    );
    const step = Math.max(1, Math.floor(maxLen / 24));
    const data: Array<{ month: string; snowball: number; avalanche: number }> = [];
    for (let i = 0; i < maxLen; i += step) {
      const s = snowball.monthlySummary[i];
      const a = avalanche.monthlySummary[i];
      if (s || a) {
        data.push({
          month: `חודש ${i + 1}`,
          snowball: s?.totalBalance ?? 0,
          avalanche: a?.totalBalance ?? 0,
        });
      }
    }
    return data;
  }, [snowball, avalanche]);

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4 bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm">
        <div>
          <h3 className="font-bold text-blue-900 mb-1">שיטת Snowball (כדור שלג)</h3>
          <p className="text-gray-600">פורע תחילה את החוב הקטן ביותר. יתרון פסיכולוגי - ניצחונות מהירים שמניעים להמשך.</p>
        </div>
        <div>
          <h3 className="font-bold text-green-900 mb-1">שיטת Avalanche (מפולת)</h3>
          <p className="text-gray-600">פורע תחילה את החוב בריבית הגבוהה ביותר. מתמטית אופטימלית - חוסך הכי הרבה ריבית.</p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">החובות שלי</h2>
        <button
          type="button"
          onClick={addDebt}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          <PlusCircle className="w-4 h-4" />
          הוסף חוב
        </button>
      </div>

      {/* Debt inputs */}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {debts.map((debt, idx) => (
          <div
            key={debt.id}
            className="border-2 rounded-xl p-4 bg-white"
            style={{ borderColor: PIE_COLORS[idx % PIE_COLORS.length] }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: PIE_COLORS[idx % PIE_COLORS.length] }}
                />
                <input
                  type="text"
                  value={debt.name}
                  onChange={(e) => updateDebt(debt.id, 'name', e.target.value)}
                  className="font-bold text-gray-900 bg-transparent border-b border-dashed border-gray-300 focus:border-blue-500 focus:outline-none text-sm"
                />
              </div>
              {debts.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeDebt(debt.id)}
                  className="text-red-400 hover:text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
            <div className="space-y-2">
              <NumericInput
                label="יתרת חוב (₪)"
                value={debt.balance}
                onChange={(v) => updateDebt(debt.id, 'balance', v)}
                min={0}
                step={500}
              />
              <div className="grid grid-cols-2 gap-2">
                <NumericInput
                  label="ריבית שנתית (%)"
                  value={debt.annualRate}
                  onChange={(v) => updateDebt(debt.id, 'annualRate', v)}
                  min={0}
                  max={30}
                  step={0.5}
                />
                <NumericInput
                  label="תשלום מינימום (₪)"
                  value={debt.minimumPayment}
                  onChange={(v) => updateDebt(debt.id, 'minimumPayment', v)}
                  min={0}
                  step={50}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="max-w-xs">
        <NumericInput
          label="תשלום נוסף חודשי (₪)"
          value={extra}
          onChange={setExtra}
          min={0}
          step={100}
          note="מעבר לתשלומי המינימום - לפירעון מהיר יותר"
        />
      </div>

      {/* Results comparison */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Snowball */}
        <div className="border-2 border-blue-300 bg-blue-50 rounded-xl p-5">
          <h3 className="font-bold text-blue-900 text-lg mb-3">Snowball (כדור שלג)</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>חודשים לסיום:</span>
              <strong>{snowball.totalMonths}</strong>
            </div>
            <div className="flex justify-between">
              <span>סך ריבית:</span>
              <strong className="text-red-700">{formatCurrency(snowball.totalInterest)}</strong>
            </div>
            <div className="mt-3 border-t border-blue-200 pt-3">
              <h4 className="font-semibold mb-2 text-blue-900">סדר פירעון:</h4>
              {snowball.payoffOrder.map((item, i) => (
                <div key={item.id} className="flex items-center gap-2 text-xs mb-1">
                  <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
                    {i + 1}
                  </span>
                  <span className="flex-1">{item.name}</span>
                  <span className="text-gray-500">חודש {item.payoffMonth}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Avalanche */}
        <div className="border-2 border-green-300 bg-green-50 rounded-xl p-5">
          <h3 className="font-bold text-green-900 text-lg mb-3">Avalanche (מפולת)</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>חודשים לסיום:</span>
              <strong>{avalanche.totalMonths}</strong>
            </div>
            <div className="flex justify-between">
              <span>סך ריבית:</span>
              <strong className="text-green-700">{formatCurrency(avalanche.totalInterest)}</strong>
            </div>
            <div className="mt-3 border-t border-green-200 pt-3">
              <h4 className="font-semibold mb-2 text-green-900">סדר פירעון:</h4>
              {avalanche.payoffOrder.map((item, i) => (
                <div key={item.id} className="flex items-center gap-2 text-xs mb-1">
                  <span className="w-5 h-5 rounded-full bg-green-600 text-white flex items-center justify-center text-xs font-bold">
                    {i + 1}
                  </span>
                  <span className="flex-1">{item.name}</span>
                  <span className="text-gray-500">חודש {item.payoffMonth}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Winner summary */}
      <div className="bg-white border-2 border-gray-200 rounded-xl p-5 space-y-3">
        <h3 className="font-bold text-gray-900">סיכום השוואה</h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          {avalancheSaves > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="flex items-center gap-2 text-green-800">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <strong>Avalanche חוסך {formatCurrency(avalancheSaves)} ריבית</strong>
              </div>
              <p className="text-green-700 text-xs mt-1">בחר Avalanche אם אכפת לך מסכומים.</p>
            </div>
          )}
          {snowballSaves > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-center gap-2 text-blue-800">
                <Info className="w-5 h-5 text-blue-600" />
                <strong>Snowball מהיר ב-{snowballSaves} חודשים</strong>
              </div>
              <p className="text-blue-700 text-xs mt-1">בחר Snowball אם אתה צריך מוטיבציה.</p>
            </div>
          )}
        </div>
      </div>

      {/* Chart */}
      {chartData.length > 0 && (
        <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
          <h3 className="font-bold text-gray-900 mb-4">התפתחות יתרת החוב הכוללת</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="snowGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="avGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" tick={{ fontSize: 10 }} interval={Math.floor(chartData.length / 6)} />
              <YAxis tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v) => formatCurrency(Number(v))} />
              <Legend />
              <Area
                type="monotone"
                dataKey="snowball"
                name="Snowball"
                stroke="#2563eb"
                fill="url(#snowGrad)"
              />
              <Area
                type="monotone"
                dataKey="avalanche"
                name="Avalanche"
                stroke="#10b981"
                fill="url(#avGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

// ============================================================
// TAB 5: Credit Card vs Personal Loan
// ============================================================
function CreditCardVsLoanTab() {
  const [debtAmount, setDebtAmount] = useState(20_000);
  const [creditCardRate, setCreditCardRate] = useState(16);
  const [personalLoanRate, setPersonalLoanRate] = useState(8.5);
  const [termMonths, setTermMonths] = useState(36);
  const [openingFee, setOpeningFee] = useState(500);

  const result = useMemo(
    () =>
      compareCreditCardVsLoan({
        debtAmount,
        creditCardRate,
        personalLoanRate,
        termMonths,
        personalLoanOpeningFee: openingFee,
      }),
    [debtAmount, creditCardRate, personalLoanRate, termMonths, openingFee],
  );

  const loanWins = result.savingsByLoan > 0;

  const barData = [
    {
      name: 'כרטיס אשראי',
      ריבית: Math.round(result.creditCard.totalInterest),
      'עלות כוללת': Math.round(result.creditCard.totalPayments),
    },
    {
      name: 'הלוואה אישית',
      ריבית: Math.round(result.personalLoan.totalInterest),
      'עלות כוללת': Math.round(result.personalLoan.totalCostWithFees),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-900">
        <strong>בישראל 2026:</strong> כרטיסי אשראי גובים 14-22% ריבית שנתית. מחזור החוב להלוואה אישית ב-7-10% חוסך אלפי שקלים. חשב כאן את החיסכון שלך.
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 bg-white border-2 border-gray-200 rounded-xl p-6 space-y-5">
          <h2 className="text-xl font-bold text-gray-900">פרטי החוב</h2>

          <NumericInput
            label="סכום החוב (₪)"
            value={debtAmount}
            onChange={setDebtAmount}
            min={0}
            step={1000}
          />

          <div className="grid grid-cols-2 gap-4">
            <NumericInput
              label="ריבית כרטיס אשראי (%)"
              value={creditCardRate}
              onChange={setCreditCardRate}
              min={0}
              max={30}
              step={0.5}
              note="ממוצע ישראל: 14-18%"
            />
            <NumericInput
              label="ריבית הלוואה אישית (%)"
              value={personalLoanRate}
              onChange={setPersonalLoanRate}
              min={0}
              max={30}
              step={0.5}
              note="בנקים ישראל: 6-12%"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">תקופת ההחזר</label>
              <select
                value={termMonths}
                onChange={(e) => setTermMonths(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value={12}>12 חודשים</option>
                <option value={24}>24 חודשים</option>
                <option value={36}>36 חודשים</option>
                <option value={48}>48 חודשים</option>
                <option value={60}>60 חודשים</option>
              </select>
            </div>
            <NumericInput
              label="עמלת פתיחת הלוואה (₪)"
              value={openingFee}
              onChange={setOpeningFee}
              min={0}
              step={50}
            />
          </div>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div
            className={`border-2 rounded-xl p-5 ${
              loanWins ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300'
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              {loanWins ? (
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              ) : (
                <XCircle className="w-6 h-6 text-red-500" />
              )}
              <h3
                className={`font-bold text-lg ${loanWins ? 'text-green-900' : 'text-red-900'}`}
              >
                {loanWins ? 'ההלוואה משתלמת!' : 'הכרטיס זול יותר'}
              </h3>
            </div>
            <p className="text-sm text-gray-700">{result.recommendation}</p>
          </div>

          {loanWins && (
            <ResultCard
              title="חיסכון בריבית"
              value={formatCurrency(result.savingsByLoan)}
              subtitle={`${result.savingsPct.toFixed(1)}% מהעלות הכוללת`}
              variant="success"
            />
          )}

          <div className="bg-white border-2 border-gray-200 rounded-xl p-4 space-y-3 text-sm">
            <h3 className="font-bold text-gray-900">השוואה מפורטת</h3>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="text-gray-500">פריט</div>
              <div className="text-gray-500 text-center">כרטיס אשראי</div>
              <div className="text-gray-500 text-center">הלוואה אישית</div>

              <div className="text-gray-700">תשלום חודשי</div>
              <div className="text-center font-medium">{formatCurrency(result.creditCard.monthlyPayment)}</div>
              <div className="text-center font-medium text-green-700">
                {formatCurrency(result.personalLoan.monthlyPayment)}
              </div>

              <div className="text-gray-700">סך ריבית</div>
              <div className="text-center text-red-600">{formatCurrency(result.creditCard.totalInterest)}</div>
              <div className="text-center text-green-700">
                {formatCurrency(result.personalLoan.totalInterest)}
              </div>

              <div className="text-gray-700 font-bold pt-2 border-t">עלות כוללת</div>
              <div className="text-center font-bold pt-2 border-t">
                {formatCurrency(result.creditCard.totalPayments)}
              </div>
              <div className="text-center font-bold text-green-700 pt-2 border-t">
                {formatCurrency(result.personalLoan.totalCostWithFees)}
              </div>
            </div>

            {result.breakEvenMonths > 0 && (
              <div className="text-xs text-gray-600 mt-2">
                נקודת האיזון על עמלת הפתיחה: חודש <strong>{result.breakEvenMonths}</strong>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
        <h3 className="font-bold text-gray-900 mb-4">השוואה ויזואלית</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={barData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} tick={{ fontSize: 11 }} />
            <Tooltip formatter={(v) => formatCurrency(Number(v))} />
            <Legend />
            <Bar dataKey="ריבית" fill="#ef4444" />
            <Bar dataKey="עלות כוללת" fill="#2563eb" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// ============================================================
// TAB 6: Affordability Check
// ============================================================
function AffordabilityTab() {
  const [monthlyNetIncome, setMonthlyNetIncome] = useState(15_000);
  const [existingObligations, setExistingObligations] = useState(3_000);
  const [loanAmount, setLoanAmount] = useState(50_000);
  const [annualRate, setAnnualRate] = useState(8);
  const [termMonths, setTermMonths] = useState(36);

  const requestedMonthlyPayment = useMemo(() => {
    const r = annualRate / 100 / 12;
    const n = termMonths;
    const P = loanAmount;
    if (P <= 0 || n <= 0) return 0;
    return r === 0 ? P / n : (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  }, [loanAmount, annualRate, termMonths]);

  const result = useMemo(
    () =>
      calculateAffordabilityPersonalLoan({
        monthlyNetIncome,
        existingObligations,
        requestedMonthlyPayment,
      }),
    [monthlyNetIncome, existingObligations, requestedMonthlyPayment],
  );

  const statusConfigs = {
    excellent: {
      bg: 'bg-green-50',
      border: 'border-green-300',
      textColor: 'text-green-900',
      icon: <CheckCircle2 className="w-6 h-6 text-green-600" />,
    },
    good: {
      bg: 'bg-blue-50',
      border: 'border-blue-300',
      textColor: 'text-blue-900',
      icon: <Info className="w-6 h-6 text-blue-600" />,
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-300',
      textColor: 'text-yellow-900',
      icon: <AlertTriangle className="w-6 h-6 text-yellow-600" />,
    },
    danger: {
      bg: 'bg-red-50',
      border: 'border-red-300',
      textColor: 'text-red-900',
      icon: <XCircle className="w-6 h-6 text-red-600" />,
    },
  };

  const cfg = statusConfigs[result.status];

  const barData = [
    { name: 'הכנסה נטו', value: monthlyNetIncome, fill: '#10b981' },
    { name: 'התחייבויות קיימות', value: existingObligations, fill: '#f59e0b' },
    { name: 'תשלום הלוואה', value: requestedMonthlyPayment, fill: '#ef4444' },
    { name: 'פנוי לאחר', value: Math.max(0, result.disposableAfterLoan), fill: '#2563eb' },
  ];

  const dtiGaugeData = [
    { name: 'חוב', value: result.dtiRatio },
    { name: 'פנוי', value: Math.max(0, 100 - result.dtiRatio) },
  ];

  return (
    <div className="space-y-6">
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white border-2 border-gray-200 rounded-xl p-6 space-y-5">
          <h2 className="text-xl font-bold text-gray-900">בדיקת כושר החזר</h2>

          <div className="space-y-3">
            <h3 className="font-semibold text-gray-800">מצב פיננסי נוכחי</h3>
            <NumericInput
              label="הכנסה חודשית נטו (₪)"
              value={monthlyNetIncome}
              onChange={setMonthlyNetIncome}
              min={0}
              step={500}
              note="לאחר ניכוי מסים ובטוח לאומי"
            />
            <NumericInput
              label="התחייבויות חודשיות קיימות (₪)"
              value={existingObligations}
              onChange={setExistingObligations}
              min={0}
              step={100}
              note="משכנתא, הלוואות, ליסינג, מינימום כרטיסים"
            />
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-gray-800">הלוואה מבוקשת</h3>
            <NumericInput
              label="סכום הלוואה (₪)"
              value={loanAmount}
              onChange={setLoanAmount}
              min={0}
              step={1000}
            />
            <div className="grid grid-cols-2 gap-3">
              <NumericInput
                label="ריבית שנתית (%)"
                value={annualRate}
                onChange={setAnnualRate}
                min={0}
                max={30}
                step={0.5}
              />
              <NumericInput
                label="תקופה (חודשים)"
                value={termMonths}
                onChange={setTermMonths}
                min={1}
                max={120}
              />
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">תשלום חודשי מחושב:</span>
              <strong>{formatCurrency(requestedMonthlyPayment)}</strong>
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-gray-600">תשלום מקסימלי מומלץ:</span>
              <strong className="text-green-700">{formatCurrency(result.maxRecommendedPayment)}</strong>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className={`border-2 rounded-xl p-5 ${cfg.bg} ${cfg.border}`}>
            <div className="flex items-center gap-3 mb-2">
              {cfg.icon}
              <div>
                <h3 className={`font-bold text-lg ${cfg.textColor}`}>{result.statusLabel}</h3>
                <p className={`text-sm ${cfg.textColor}`}>
                  יחס חוב להכנסה (DTI): {result.dtiRatio.toFixed(1)}%
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-700">{result.recommendation}</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <ResultCard
              title="DTI"
              value={`${result.dtiRatio.toFixed(1)}%`}
              subtitle="מסך ההכנסה"
              variant={result.dtiRatio <= 35 ? 'success' : 'warning'}
            />
            <ResultCard
              title="פנוי לאחר הכל"
              value={formatCurrency(result.disposableAfterLoan)}
              subtitle="לחודש"
              variant={result.disposableAfterLoan > 2_000 ? 'success' : 'warning'}
            />
          </div>

          {/* Gauge */}
          <div className="bg-white border-2 border-gray-200 rounded-xl p-4">
            <h3 className="font-bold text-gray-900 mb-2 text-sm">מד DTI</h3>
            <ResponsiveContainer width="100%" height={130}>
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
                  <Cell
                    fill={
                      result.dtiRatio <= 25
                        ? '#10b981'
                        : result.dtiRatio <= 35
                          ? '#2563eb'
                          : result.dtiRatio <= 50
                            ? '#f59e0b'
                            : '#ef4444'
                    }
                  />
                  <Cell fill="#e5e7eb" />
                </Pie>
                <Tooltip formatter={(v) => `${Number(v).toFixed(1)}%`} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 text-xs mt-1">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
                מעולה &lt;25%
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" />
                טוב 25-35%
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-yellow-500 inline-block" />
                אזהרה 35-50%
              </span>
            </div>
          </div>

          {/* Horizontal bar */}
          <div className="bg-white border-2 border-gray-200 rounded-xl p-4">
            <h3 className="font-bold text-gray-900 mb-3 text-sm">תמהיל הכנסה מול הוצאות</h3>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={barData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  type="number"
                  tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`}
                  tick={{ fontSize: 10 }}
                />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={115} />
                <Tooltip formatter={(v) => formatCurrency(Number(v))} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {barData.map((entry, index) => (
                    <Cell key={index} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <Breakdown
        title="פירוט כושר החזר"
        defaultOpen
        items={[
          { label: 'הכנסה חודשית נטו', value: formatCurrency(monthlyNetIncome) },
          { label: 'התחייבויות קיימות', value: formatCurrency(existingObligations) },
          { label: 'תשלום הלוואה מבוקש', value: formatCurrency(requestedMonthlyPayment), bold: true },
          { label: 'סך התחייבויות', value: formatCurrency(result.totalObligationsWithLoan) },
          { label: 'יחס DTI', value: `${result.dtiRatio.toFixed(1)}%`, bold: true },
          { label: 'פנוי לאחר הכל', value: formatCurrency(result.disposableAfterLoan) },
          { label: 'תשלום מקסימלי מומלץ (35%)', value: formatCurrency(result.maxRecommendedPayment) },
        ]}
      />
    </div>
  );
}

// ============================================================
// Main Component
// ============================================================
export function PersonalLoanCalculator() {
  const [activeTab, setActiveTab] = useState<TabMode>('quick');

  return (
    <div className="space-y-2">
      <TabBar active={activeTab} onChange={setActiveTab} />
      {activeTab === 'quick' && <QuickTab />}
      {activeTab === 'apr' && <APRTab />}
      {activeTab === 'sources' && <SourcesTab />}
      {activeTab === 'debt-payoff' && <DebtPayoffTab />}
      {activeTab === 'cc-vs-loan' && <CreditCardVsLoanTab />}
      {activeTab === 'affordability' && <AffordabilityTab />}
    </div>
  );
}
