'use client';

import { useState, useMemo } from 'react';
import {
  calculateSelfEmployedPension,
  buildProjection,
  calculateMandatoryDeposit,
  calculateTaxBenefit,
  AVERAGE_WAGE_2026,
  HALF_AVERAGE_WAGE_2026,
  TAX_CREDIT_CEILING_ANNUAL,
  TIER1_RATE,
  TIER2_RATE,
} from '@/lib/calculators/self-employed-pension';
import { formatCurrency, formatPercent } from '@/lib/utils/formatters';
import { ResultCard } from '@/components/calculator/ResultCard';
import { Info, AlertCircle, TrendingUp, Shield, ChevronDown, ChevronUp } from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
  ReferenceLine,
} from 'recharts';

// ============================================================
// Shared UI
// ============================================================

const SectionCard = ({ title, children, className = '' }: { title: string; children: React.ReactNode; className?: string }) => (
  <div className={`bg-white border-2 border-gray-200 rounded-xl p-6 space-y-4 ${className}`}>
    <h2 className="text-lg font-bold text-gray-900">{title}</h2>
    {children}
  </div>
);

const InfoBox = ({
  children,
  variant = 'blue',
}: {
  children: React.ReactNode;
  variant?: 'blue' | 'amber' | 'red' | 'green';
}) => {
  const classes: Record<string, string> = {
    blue: 'bg-blue-50 border-blue-200 text-blue-900',
    amber: 'bg-amber-50 border-amber-200 text-amber-900',
    red: 'bg-red-50 border-red-200 text-red-900',
    green: 'bg-green-50 border-green-200 text-green-900',
  };
  return <div className={`border rounded-xl p-4 ${classes[variant]}`}>{children}</div>;
};

const TabButton = ({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) => (
  <button
    onClick={onClick}
    className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
      active
        ? 'bg-blue-600 text-white shadow-sm'
        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
    }`}
  >
    {children}
  </button>
);

// ============================================================
// Tab: Main Calculator
// ============================================================
const CalculatorTab = () => {
  const [income, setIncome] = useState(15_000);
  const [marginalRate, setMarginalRate] = useState(35);
  const [voluntary, setVoluntary] = useState(false);
  const [voluntaryAmount, setVoluntaryAmount] = useState(500);
  const [yearsToRetirement, setYearsToRetirement] = useState(25);
  const [expectedReturn, setExpectedReturn] = useState(4);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const result = useMemo(
    () =>
      calculateSelfEmployedPension({
        monthlyIncome: income,
        marginalTaxRate: marginalRate,
        contributeAboveMandatory: voluntary,
        voluntaryMonthlyContribution: voluntaryAmount,
        yearsToRetirement,
        expectedAnnualReturn: expectedReturn,
        currentAge: 67 - yearsToRetirement,
      }),
    [income, marginalRate, voluntary, voluntaryAmount, yearsToRetirement, expectedReturn],
  );

  // Pie chart data
  const pieData = [
    { name: 'עלות נטו (כיסך)', value: Math.max(0, Math.round(result.netCost)), color: '#ef4444' },
    { name: 'חיסכון מס', value: Math.round(result.taxSavings), color: '#10b981' },
  ];

  const mandatoryForIncomeRange = useMemo(() => {
    const points = [];
    for (let inc = 3_000; inc <= 25_000; inc += 1_000) {
      const { total } = calculateMandatoryDeposit(inc);
      points.push({ income: inc, mandatory: Math.round(total) });
    }
    return points;
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid lg:grid-cols-5 gap-6">
        {/* Input */}
        <div className="lg:col-span-3 space-y-5">
          <SectionCard title="פרטי הכנסה">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                הכנסה חודשית ממוצעת (₪)
              </label>
              <input
                type="number"
                min={0}
                step={500}
                value={income}
                onChange={(e) => setIncome(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xl font-bold focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <div className="mt-2 flex items-center gap-2 text-xs">
                <div className={`h-2 flex-1 rounded-full overflow-hidden bg-gray-100`}>
                  <div
                    className={`h-full rounded-full transition-all ${
                      income <= HALF_AVERAGE_WAGE_2026
                        ? 'bg-blue-400'
                        : income <= AVERAGE_WAGE_2026
                        ? 'bg-emerald-500'
                        : 'bg-amber-400'
                    }`}
                    style={{ width: `${Math.min(100, (income / (AVERAGE_WAGE_2026 * 1.5)) * 100)}%` }}
                  />
                </div>
                <span className="text-gray-500 whitespace-nowrap">
                  {income <= HALF_AVERAGE_WAGE_2026
                    ? `שלב 1 (4.45%)`
                    : income <= AVERAGE_WAGE_2026
                    ? 'שלב 1+2'
                    : `מעל שכר ממוצע`}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                מס שולי שלך (%)
              </label>
              <div className="grid grid-cols-5 gap-1.5 mb-2">
                {[10, 20, 31, 35, 47].map((rate) => (
                  <button
                    key={rate}
                    onClick={() => setMarginalRate(rate)}
                    className={`py-2 rounded-lg text-sm font-medium transition-colors ${
                      marginalRate === rate
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {rate}%
                  </button>
                ))}
              </div>
              <input
                type="number"
                min={0}
                max={50}
                step={1}
                value={marginalRate}
                onChange={(e) => setMarginalRate(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">עצמאי בהכנסה 15K-25K: לרוב 31%-35%</p>
            </div>

            <label className="flex items-center gap-3 p-3 bg-emerald-50 border border-emerald-300 rounded-lg cursor-pointer">
              <input
                type="checkbox"
                checked={voluntary}
                onChange={(e) => setVoluntary(e.target.checked)}
                className="w-4 h-4 rounded"
              />
              <div>
                <span className="text-sm font-medium text-emerald-900">הפקדה רצונית מעבר לחובה</span>
                <p className="text-xs text-emerald-700">
                  עד תקרת הטבה: {formatCurrency(TAX_CREDIT_CEILING_ANNUAL)}/שנה (~{formatCurrency(TAX_CREDIT_CEILING_ANNUAL / 12)}/חודש)
                </p>
              </div>
            </label>

            {voluntary && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  הפקדה רצונית חודשית (₪)
                </label>
                <input
                  type="number"
                  min={0}
                  step={100}
                  value={voluntaryAmount}
                  onChange={(e) => setVoluntaryAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                {result.taxBenefit.maxBenefitReached && (
                  <p className="text-xs text-emerald-700 mt-1">
                    מנצל את מלוא הטבת הזיכוי!
                  </p>
                )}
                {!result.taxBenefit.maxBenefitReached && (
                  <p className="text-xs text-amber-700 mt-1">
                    הוסף {formatCurrency(Math.max(0, TAX_CREDIT_CEILING_ANNUAL - result.totalAnnualContribution) / 12)}/חודש נוספים למקסם הטבה
                  </p>
                )}
              </div>
            )}

            {/* Advanced */}
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700"
            >
              {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              הגדרות מתקדמות
            </button>

            {showAdvanced && (
              <div className="grid sm:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    שנים עד פרישה
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={45}
                    value={yearsToRetirement}
                    onChange={(e) => setYearsToRetirement(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    תשואה שנתית צפויה (%)
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={15}
                    step={0.5}
                    value={expectedReturn}
                    onChange={(e) => setExpectedReturn(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">ממוצע היסטורי: 4-6% לשנה</p>
                </div>
              </div>
            )}
          </SectionCard>
        </div>

        {/* Results */}
        <div className="lg:col-span-2 space-y-4">
          <ResultCard
            title="הפקדה חובה חודשית"
            value={formatCurrency(result.mandatoryMonthly)}
            subtitle={`שנתי: ${formatCurrency(result.mandatoryAnnual)}`}
            variant="success"
          />

          {/* Tier breakdown */}
          <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-2 text-sm">
            <h4 className="font-bold text-gray-900 mb-3">פירוט שלבים</h4>
            {result.tierBreakdown.map((tier, i) => (
              <div key={i} className="flex justify-between items-center">
                <span className="text-gray-600 text-xs">{tier.label}</span>
                <span className="font-medium">{formatCurrency(tier.monthlyAmount)}</span>
              </div>
            ))}
            {voluntary && (
              <div className="flex justify-between items-center text-emerald-700 border-t pt-2">
                <span className="text-xs">הפקדה רצונית:</span>
                <span className="font-medium">{formatCurrency(voluntaryAmount)}</span>
              </div>
            )}
            <div className="flex justify-between items-center border-t pt-2 font-bold">
              <span>סה"כ חודשי:</span>
              <span className="text-blue-700">{formatCurrency(result.mandatoryMonthly + (voluntary ? voluntaryAmount : 0))}</span>
            </div>
          </div>

          <ResultCard
            title="חיסכון מס שנתי"
            value={formatCurrency(result.taxSavings)}
            subtitle={`עלות נטו: ${formatCurrency(result.netCost)} (${result.netCostAsPercentOfIncome.toFixed(1)}% מהכנסה)`}
            variant="primary"
          />

          {/* Tax benefit detail */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-xs text-blue-900 space-y-1.5">
            <p className="font-bold text-sm mb-2">פירוט הטבת מס</p>
            <div className="flex justify-between">
              <span>ניכוי (מס שולי {marginalRate}%):</span>
              <span className="font-medium">{formatCurrency(result.taxBenefit.deductionSaving)}</span>
            </div>
            <div className="flex justify-between">
              <span>זיכוי (35% × 35%):</span>
              <span className="font-medium">{formatCurrency(result.taxBenefit.creditSaving)}</span>
            </div>
            <div className="flex justify-between font-bold border-t pt-1.5">
              <span>החזר אפקטיבי:</span>
              <span>{(result.taxBenefit.effectiveReturnRate * 100).toFixed(0)}%</span>
            </div>
          </div>

          {/* Pension projection */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
            <p className="text-xs font-bold text-emerald-900 mb-1 flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5" />
              קצבה חודשית צפויה לפרישה
            </p>
            <p className="text-3xl font-black text-emerald-700">
              {formatCurrency(result.expectedMonthlyPensionActual)}
            </p>
            <p className="text-xs text-emerald-700 mt-1">
              לאחר {yearsToRetirement} שנות הפקדה בתשואה {expectedReturn}%
            </p>
            <p className="text-xs text-emerald-600 mt-0.5">
              (30 שנה ב-4%: {formatCurrency(result.expectedMonthlyPension30Years)})
            </p>
          </div>
        </div>
      </div>

      {/* Pie chart — cost breakdown */}
      <div className="grid sm:grid-cols-2 gap-6">
        <SectionCard title="חלוקת עלות — מה מגיע לאן?">
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} dataKey="value" cx="50%" cy="50%" outerRadius={75} paddingAngle={3}>
                  {pieData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip formatter={(v) => formatCurrency(Number(v))} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-gray-500 text-center">
            מתוך {formatCurrency(result.totalAnnualContribution)}/שנה,
            {' '}{(result.taxBenefit.effectiveReturnRate * 100).toFixed(0)}% מחזיר המדינה
          </p>
        </SectionCard>

        <SectionCard title="הפקדה חובה לפי הכנסה">
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mandatoryForIncomeRange} margin={{ top: 5, right: 10, left: 5, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="income"
                  tickFormatter={(v) => `${(Number(v) / 1000).toFixed(0)}K`}
                  tick={{ fontSize: 10 }}
                />
                <YAxis tickFormatter={(v) => formatCurrency(Number(v))} tick={{ fontSize: 9 }} />
                <Tooltip
                  formatter={(v) => formatCurrency(Number(v))}
                  labelFormatter={(v) => `הכנסה: ${Number(v).toLocaleString('he-IL')} ₪`}
                />
                <Area type="monotone" dataKey="mandatory" stroke="#3b82f6" fill="#dbeafe" name="חובה חודשית" strokeWidth={2} />
                <ReferenceLine x={income} stroke="#ef4444" strokeDasharray="4 4" label={{ value: 'אתה', position: 'top', fontSize: 10, fill: '#ef4444' }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>
      </div>

      {/* Recommendations */}
      {result.recommendations.length > 0 && (
        <InfoBox variant="amber">
          <h4 className="text-sm font-bold mb-2 flex items-center gap-2">
            <Info className="w-4 h-4" />
            המלצות
          </h4>
          <ul className="space-y-1.5">
            {result.recommendations.map((rec, i) => (
              <li key={i} className="text-sm flex gap-2">
                <span className="flex-shrink-0">💡</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </InfoBox>
      )}
    </div>
  );
};

// ============================================================
// Tab: Pension Projection
// ============================================================
const ProjectionTab = () => {
  const [income, setIncome] = useState(15_000);
  const [marginalRate, setMarginalRate] = useState(35);
  const [voluntary, setVoluntary] = useState(false);
  const [voluntaryAmount, setVoluntaryAmount] = useState(500);
  const [yearsToRetirement, setYearsToRetirement] = useState(25);
  const [expectedReturn, setExpectedReturn] = useState(4);
  const [currentAge, setCurrentAge] = useState(40);

  const result = useMemo(
    () =>
      calculateSelfEmployedPension({
        monthlyIncome: income,
        marginalTaxRate: marginalRate,
        contributeAboveMandatory: voluntary,
        voluntaryMonthlyContribution: voluntaryAmount,
        yearsToRetirement,
        expectedAnnualReturn: expectedReturn,
        currentAge,
      }),
    [income, marginalRate, voluntary, voluntaryAmount, yearsToRetirement, expectedReturn, currentAge],
  );

  const chartData = result.projection.filter((_, i) => i % 2 === 0 || i === result.projection.length - 1);

  return (
    <div className="space-y-5">
      <div className="grid sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">הכנסה חודשית (₪)</label>
          <input type="number" min={0} step={500} value={income}
            onChange={(e) => setIncome(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">גיל נוכחי</label>
          <input type="number" min={20} max={65} value={currentAge}
            onChange={(e) => setCurrentAge(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">תשואה שנתית (%)</label>
          <input type="number" min={0} max={15} step={0.5} value={expectedReturn}
            onChange={(e) => setExpectedReturn(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
        </div>
      </div>

      <label className="flex items-center gap-2 cursor-pointer">
        <input type="checkbox" checked={voluntary} onChange={(e) => setVoluntary(e.target.checked)} className="w-4 h-4" />
        <span className="text-sm">הפקדה רצונית נוספת:</span>
        {voluntary && (
          <input type="number" min={0} step={100} value={voluntaryAmount}
            onChange={(e) => setVoluntaryAmount(Number(e.target.value))}
            className="w-32 px-2 py-1 border border-gray-300 rounded-lg text-sm" />
        )}
        {voluntary && <span className="text-xs text-gray-500">₪/חודש</span>}
      </label>

      {/* Projected fund value */}
      <div className="h-64">
        <p className="text-xs font-medium text-gray-600 mb-1">שווי הקרן לאורך השנים</p>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="ageAtYear" tick={{ fontSize: 11 }} label={{ value: 'גיל', position: 'insideBottom', offset: -2, fontSize: 11 }} />
            <YAxis tickFormatter={(v) => `${(Number(v) / 1000).toFixed(0)}K`} tick={{ fontSize: 10 }} />
            <Tooltip
              formatter={(v) => formatCurrency(Number(v))}
              labelFormatter={(v) => `גיל: ${v}`}
            />
            <Area type="monotone" dataKey="fundValue" stroke="#3b82f6" fill="#dbeafe" name="שווי קרן" strokeWidth={2} />
            <Area type="monotone" dataKey="totalDeposited" stroke="#9ca3af" fill="transparent" strokeDasharray="4 4" name="סך הפקדות" strokeWidth={1.5} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Projected monthly pension */}
      <div className="h-48">
        <p className="text-xs font-medium text-gray-600 mb-1">קצבה חודשית צפויה לאורך הזמן</p>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="ageAtYear" tick={{ fontSize: 11 }} />
            <YAxis tickFormatter={(v) => formatCurrency(Number(v))} tick={{ fontSize: 9 }} />
            <Tooltip formatter={(v) => formatCurrency(Number(v))} labelFormatter={(v) => `גיל: ${v}`} />
            <Line type="monotone" dataKey="monthlyPension" stroke="#10b981" strokeWidth={2} dot={false} name="קצבה חודשית" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Summary */}
      {result.projection.length > 0 && (
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            {
              label: 'שווי קרן בפרישה',
              value: formatCurrency(result.projection[result.projection.length - 1]?.fundValue ?? 0),
              color: 'blue',
            },
            {
              label: 'קצבה חודשית',
              value: formatCurrency(result.expectedMonthlyPensionActual),
              color: 'green',
            },
            {
              label: 'סך הפקדות',
              value: formatCurrency(result.projection[result.projection.length - 1]?.totalDeposited ?? 0),
              color: 'gray',
            },
          ].map((item, i) => (
            <div key={i} className={`rounded-xl p-4 text-center border-2 ${
              item.color === 'blue' ? 'bg-blue-50 border-blue-200' :
              item.color === 'green' ? 'bg-emerald-50 border-emerald-200' :
              'bg-gray-50 border-gray-200'
            }`}>
              <p className="text-xs text-gray-500 mb-1">{item.label}</p>
              <p className={`text-2xl font-black ${
                item.color === 'blue' ? 'text-blue-700' :
                item.color === 'green' ? 'text-emerald-700' :
                'text-gray-700'
              }`}>{item.value}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ============================================================
// Tab: Penalty Calculator
// ============================================================
const PenaltyTab = () => {
  const [income, setIncome] = useState(15_000);
  const [yearsWithout, setYearsWithout] = useState(3);

  const { total: mandatory } = useMemo(() => calculateMandatoryDeposit(income), [income]);
  const annualMandatory = mandatory * 12;

  const estimatedMissing = annualMandatory * yearsWithout;
  const estimatedInterest = estimatedMissing * (Math.pow(1.04, yearsWithout) - 1);
  const totalExposure = estimatedMissing + estimatedInterest;

  const severity = yearsWithout >= 5 ? 'red' : yearsWithout >= 2 ? 'amber' : 'blue';

  return (
    <div className="space-y-5">
      <InfoBox variant="red">
        <div className="flex gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-sm">חשוב: חובת פנסיה לעצמאי מ-2017</p>
            <p className="text-sm mt-1">
              מאז 2017, כל עצמאי חייב להפקיד לפנסיה. אי הפקדה גוררת חוב לביטוח הלאומי + ריבית.
            </p>
          </div>
        </div>
      </InfoBox>

      <SectionCard title="חשיפה לקנסות">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">הכנסה חודשית ממוצעת (₪)</label>
            <input type="number" min={0} step={500} value={income}
              onChange={(e) => setIncome(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">שנות חוסר הפקדה (אומדן)</label>
            <input type="number" min={0} max={8} step={0.5} value={yearsWithout}
              onChange={(e) => setYearsWithout(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
            <p className="text-xs text-gray-500 mt-1">החובה חלה מ-2017</p>
          </div>
        </div>

        <div className={`rounded-xl p-5 border-2 mt-2 ${
          severity === 'red' ? 'bg-red-50 border-red-300' :
          severity === 'amber' ? 'bg-amber-50 border-amber-300' :
          'bg-blue-50 border-blue-300'
        }`}>
          <p className={`text-lg font-bold mb-4 ${
            severity === 'red' ? 'text-red-800' :
            severity === 'amber' ? 'text-amber-800' :
            'text-blue-800'
          }`}>
            {severity === 'red' ? 'חשיפה גבוהה!' :
             severity === 'amber' ? 'חשיפה בינונית' :
             'חשיפה נמוכה'}
          </p>
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'הפקדות חסרות', value: formatCurrency(estimatedMissing) },
              { label: 'ריבית משוערת (4%)', value: formatCurrency(estimatedInterest) },
              { label: 'סה"כ חשיפה', value: formatCurrency(totalExposure) },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <p className="text-xs text-gray-600 mb-1">{item.label}</p>
                <p className={`text-xl font-black ${
                  severity === 'red' ? 'text-red-700' :
                  severity === 'amber' ? 'text-amber-700' :
                  'text-blue-700'
                }`}>{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </SectionCard>

      <InfoBox variant="green">
        <div className="flex gap-3">
          <Shield className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-sm">כיצד לפתור?</p>
            <ul className="text-sm mt-1.5 space-y-1">
              <li>1. פתח קרן פנסיה / קופת גמל (אם אין)</li>
              <li>2. פנה לביטוח לאומי לאסדרת הפיגורים</li>
              <li>3. התייעץ עם רואה חשבון על הסדר</li>
              <li>4. התחל להפקיד מיד — הקנסות ממשיכים לצמוח</li>
            </ul>
          </div>
        </div>
      </InfoBox>
    </div>
  );
};

// ============================================================
// Tab: Tax Benefits
// ============================================================
const TaxBenefitsTab = () => {
  const [contribution, setContribution] = useState(1_000);
  const incomePoints = [10, 20, 31, 35, 47, 50];

  const barData = incomePoints.map((rate) => {
    const benefit = calculateTaxBenefit(contribution * 12, rate);
    return {
      name: `${rate}%`,
      ניכוי: Math.round(benefit.deductionSaving),
      זיכוי: Math.round(benefit.creditSaving),
      'נטו לחסוך': Math.round(benefit.totalSaving),
    };
  });

  const optimal = useMemo(() => ({
    annual: TAX_CREDIT_CEILING_ANNUAL,
    monthly: TAX_CREDIT_CEILING_ANNUAL / 12,
  }), []);

  return (
    <div className="space-y-5">
      <InfoBox variant="blue">
        <p className="font-bold text-sm mb-2">שתי הטבות מס בו-זמנית</p>
        <div className="grid sm:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="font-semibold text-blue-800">1. ניכוי (Deduction)</p>
            <p className="text-xs mt-1">כל ₪ שמופקד מוריד את ההכנסה החייבת. חיסכון = סכום × מס שולי.</p>
          </div>
          <div>
            <p className="font-semibold text-blue-800">2. זיכוי (Tax Credit)</p>
            <p className="text-xs mt-1">35% × 35% = 12.25% החזר נוסף. עד תקרה {formatCurrency(optimal.annual)}/שנה.</p>
          </div>
        </div>
      </InfoBox>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          הפקדה חודשית לסימולציה (₪)
        </label>
        <input
          type="number" min={100} max={5000} step={100} value={contribution}
          onChange={(e) => setContribution(Number(e.target.value))}
          className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
        <p className="text-xs text-gray-500 mt-1">
          {formatCurrency(contribution * 12)}/שנה ·
          {contribution * 12 >= optimal.annual
            ? ' מנצל את מלוא הטבת הזיכוי'
            : ` הגדל ל-${formatCurrency(optimal.monthly)}/חודש למקסם הטבה`}
        </p>
      </div>

      <div className="h-56">
        <p className="text-xs font-medium text-gray-600 mb-1">חיסכון מס לפי מס שולי — הפקדה {formatCurrency(contribution)}/חודש</p>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={barData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tickFormatter={(v) => formatCurrency(Number(v))} tick={{ fontSize: 9 }} />
            <Tooltip formatter={(v) => formatCurrency(Number(v))} />
            <Legend />
            <Bar dataKey="ניכוי" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            <Bar dataKey="זיכוי" fill="#10b981" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-blue-50">
              <th className="border border-gray-200 px-3 py-2 text-right">מס שולי</th>
              <th className="border border-gray-200 px-3 py-2 text-center">ניכוי (שנתי)</th>
              <th className="border border-gray-200 px-3 py-2 text-center">זיכוי (שנתי)</th>
              <th className="border border-gray-200 px-3 py-2 text-center">סה"כ חיסכון</th>
              <th className="border border-gray-200 px-3 py-2 text-center">החזר אפקטיבי</th>
            </tr>
          </thead>
          <tbody>
            {incomePoints.map((rate) => {
              const benefit = calculateTaxBenefit(contribution * 12, rate);
              return (
                <tr key={rate} className="hover:bg-gray-50 border-t border-gray-100">
                  <td className="border border-gray-200 px-3 py-2 font-medium">{rate}%</td>
                  <td className="border border-gray-200 px-3 py-2 text-center">{formatCurrency(benefit.deductionSaving)}</td>
                  <td className="border border-gray-200 px-3 py-2 text-center">{formatCurrency(benefit.creditSaving)}</td>
                  <td className="border border-gray-200 px-3 py-2 text-center font-semibold text-emerald-700">{formatCurrency(benefit.totalSaving)}</td>
                  <td className="border border-gray-200 px-3 py-2 text-center font-medium text-blue-700">
                    {(benefit.effectiveReturnRate * 100).toFixed(0)}%
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ============================================================
// Main Component
// ============================================================

type TabMode = 'calculator' | 'projection' | 'penalty' | 'tax';

const TABS: { id: TabMode; label: string }[] = [
  { id: 'calculator', label: 'מחשבון חובה' },
  { id: 'projection', label: 'הקרנה לפרישה' },
  { id: 'penalty', label: 'קנסות אי-הפקדה' },
  { id: 'tax', label: 'הטבות מס' },
];

export function SelfEmployedPensionCalculator() {
  const [activeTab, setActiveTab] = useState<TabMode>('calculator');

  return (
    <div className="space-y-4">
      {/* Tab header */}
      <div className="flex flex-wrap gap-2 bg-gray-50 border border-gray-200 rounded-xl p-2">
        {TABS.map((tab) => (
          <TabButton
            key={tab.id}
            active={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </TabButton>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 'calculator' && <CalculatorTab />}
      {activeTab === 'projection' && <ProjectionTab />}
      {activeTab === 'penalty' && <PenaltyTab />}
      {activeTab === 'tax' && <TaxBenefitsTab />}
    </div>
  );
}
