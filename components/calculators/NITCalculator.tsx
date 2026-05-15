'use client';

import { useState, useMemo } from 'react';
import {
  calculateWorkGrant,
  buildGrantCurve,
  getYearComparison,
  calculateMaxGrant,
  WORK_GRANT_MIN_INCOME_2026,
  WORK_GRANT_PEAK_INCOME_2026,
  WORK_GRANT_MAX_INCOME_SINGLE_2026,
  WORK_GRANT_MAX_INCOME_PARENT_2026,
  type WorkGrantInput,
  type EmploymentType,
  type FamilyStatus,
} from '@/lib/calculators/work-grant';
import { CHILDREN_ALLOWANCE_2026 } from '@/lib/constants/tax-2026';
import { formatCurrency, formatPercent } from '@/lib/utils/formatters';
import { ResultCard } from '@/components/calculator/ResultCard';
import { CheckCircle, AlertCircle, Info, ChevronDown, ChevronUp, Calendar, TrendingUp, TrendingDown } from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  BarChart,
  Bar,
  Cell,
  Legend,
} from 'recharts';

// ============================================================
// Shared UI Components
// ============================================================

const SectionCard = ({ title, children, className = '' }: { title: string; children: React.ReactNode; className?: string }) => (
  <div className={`bg-white border-2 border-gray-200 rounded-xl p-6 space-y-5 ${className}`}>
    <h2 className="text-lg font-bold text-gray-900">{title}</h2>
    {children}
  </div>
);

const InfoBox = ({
  children,
  variant = 'blue',
}: {
  children: React.ReactNode;
  variant?: 'blue' | 'amber' | 'red' | 'green' | 'purple';
}) => {
  const classes: Record<string, string> = {
    blue: 'bg-blue-50 border-blue-200 text-blue-900',
    amber: 'bg-amber-50 border-amber-200 text-amber-900',
    red: 'bg-red-50 border-red-200 text-red-900',
    green: 'bg-green-50 border-green-200 text-green-900',
    purple: 'bg-purple-50 border-purple-200 text-purple-900',
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
        ? 'bg-emerald-600 text-white shadow-sm'
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
  const [income, setIncome] = useState(55_000);
  const [age, setAge] = useState(35);
  const [familyStatus, setFamilyStatus] = useState<FamilyStatus>('single');
  const [children, setChildren] = useState(0);
  const [singleParent, setSingleParent] = useState(false);
  const [employmentType, setEmploymentType] = useState<EmploymentType>('salaried');
  const [monthsSalaried, setMonthsSalaried] = useState(12);
  const [weeksSelfEmployed, setWeeksSelfEmployed] = useState(0);
  const [isResident, setIsResident] = useState(true);

  const input: WorkGrantInput = {
    annualWorkIncome: income,
    age,
    familyStatus,
    numberOfChildren: children,
    isSingleParent: singleParent,
    employmentType,
    monthsAsSalaried: monthsSalaried,
    weeksAsSelfEmployed: weeksSelfEmployed,
    isIsraeliResident: isResident,
  };

  const result = useMemo(() => calculateWorkGrant(input), [
    income, age, familyStatus, children, singleParent, employmentType,
    monthsSalaried, weeksSelfEmployed, isResident,
  ]);

  // curve data
  const curveData = useMemo(
    () => buildGrantCurve(children, singleParent),
    [children, singleParent],
  );

  const maxForChart = (children > 0 ? WORK_GRANT_MAX_INCOME_PARENT_2026 : WORK_GRANT_MAX_INCOME_SINGLE_2026) * 1.05;

  return (
    <div className="space-y-6">
      <div className="grid lg:grid-cols-5 gap-6">
        {/* Input Panel */}
        <div className="lg:col-span-3 space-y-5">
          <SectionCard title="פרטי הגשה">
            {/* הכנסה */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                הכנסה שנתית מעבודה (₪)
              </label>
              <input
                type="number"
                min={0}
                step={1000}
                value={income}
                onChange={(e) => setIncome(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-lg font-bold focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                הכנסה ממשכורת / עצמאי בלבד (ללא קצבאות/שכ"ד). טווח: {WORK_GRANT_MIN_INCOME_2026.toLocaleString('he-IL')}–
                {(children > 0 ? WORK_GRANT_MAX_INCOME_PARENT_2026 : WORK_GRANT_MAX_INCOME_SINGLE_2026).toLocaleString('he-IL')} ₪
              </p>
            </div>

            {/* גיל */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">גיל</label>
              <input
                type="number"
                min={18}
                max={80}
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">מינימום: 23 ללא ילדים, 21 עם ילדים, 56-62 גמלאים</p>
            </div>

            {/* סוג תעסוקה */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">סוג תעסוקה</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'salaried' as EmploymentType, label: 'שכיר' },
                  { id: 'self_employed' as EmploymentType, label: 'עצמאי' },
                  { id: 'both' as EmploymentType, label: 'שניהם' },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setEmploymentType(opt.id)}
                    className={`px-3 py-2 rounded-lg text-sm border-2 font-medium transition-colors ${
                      employmentType === opt.id
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-white text-gray-700 border-gray-200 hover:border-emerald-300'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* ותק עבודה */}
            {(employmentType === 'salaried' || employmentType === 'both') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  חודשי עבודה כשכיר
                </label>
                <input
                  type="number"
                  min={0}
                  max={12}
                  value={monthsSalaried}
                  onChange={(e) => setMonthsSalaried(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
                <p className="text-xs text-gray-500 mt-1">נדרש: לפחות 6 חודשים</p>
              </div>
            )}

            {(employmentType === 'self_employed' || employmentType === 'both') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  שבועות עצמאי (50%+ ממש)
                </label>
                <input
                  type="number"
                  min={0}
                  max={52}
                  value={weeksSelfEmployed}
                  onChange={(e) => setWeeksSelfEmployed(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
                <p className="text-xs text-gray-500 mt-1">נדרש: לפחות 13 שבועות</p>
              </div>
            )}
          </SectionCard>

          <SectionCard title="מצב משפחתי">
            {/* מצב אישי */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">מצב אישי</label>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {[
                  { id: 'single' as FamilyStatus, label: 'רווק/ה' },
                  { id: 'married' as FamilyStatus, label: 'נשוי/אה' },
                  { id: 'divorced' as FamilyStatus, label: 'גרוש/ה' },
                  { id: 'widowed' as FamilyStatus, label: 'אלמן/ה' },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setFamilyStatus(opt.id)}
                    className={`px-3 py-2 rounded-lg text-sm border-2 font-medium transition-colors ${
                      familyStatus === opt.id
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-gray-700 border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* ילדים */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                מספר ילדים מתחת לגיל 18
              </label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setChildren(Math.max(0, children - 1))}
                  className="w-10 h-10 rounded-full bg-gray-200 text-gray-700 font-bold text-xl hover:bg-gray-300 transition-colors"
                >
                  -
                </button>
                <span className="text-3xl font-black text-emerald-700 w-12 text-center">{children}</span>
                <button
                  onClick={() => setChildren(Math.min(5, children + 1))}
                  className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 font-bold text-xl hover:bg-emerald-200 transition-colors"
                >
                  +
                </button>
                <span className="text-sm text-gray-500">ילדים</span>
              </div>
            </div>

            {children > 0 && (
              <label className="flex items-center gap-3 p-3 bg-amber-50 border border-amber-200 rounded-lg cursor-pointer">
                <input
                  type="checkbox"
                  checked={singleParent}
                  onChange={(e) => setSingleParent(e.target.checked)}
                  className="w-4 h-4 rounded"
                />
                <div>
                  <span className="text-sm font-medium text-amber-900">הורה יחיד</span>
                  <p className="text-xs text-amber-700">
                    תוספת מענק: ~{calculateMaxGrant(children, true) - calculateMaxGrant(children, false) > 0
                      ? formatCurrency(calculateMaxGrant(children, true) - calculateMaxGrant(children, false))
                      : '2,950 ₪'}
                  </p>
                </div>
              </label>
            )}

            <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer">
              <input
                type="checkbox"
                checked={isResident}
                onChange={(e) => setIsResident(e.target.checked)}
                className="w-4 h-4 rounded"
              />
              <span className="text-sm">תושב ישראל (רשום במרשם האוכלוסין)</span>
            </label>
          </SectionCard>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-2 space-y-4">
          {result.isEligible ? (
            <>
              <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-2 border-emerald-300 rounded-xl p-6">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle className="w-6 h-6 text-emerald-600 flex-shrink-0" />
                  <h3 className="text-lg font-bold text-emerald-900">זכאי למענק עבודה</h3>
                </div>
                <p className="text-5xl font-black text-emerald-700 mb-1">
                  {formatCurrency(result.annualGrant)}
                </p>
                <p className="text-emerald-700 font-medium">
                  לשנה · {formatCurrency(result.monthlyEquivalent)} לחודש (משוער)
                </p>
                <div className="mt-4 pt-3 border-t border-emerald-200">
                  <div className="flex justify-between text-sm">
                    <span className="text-emerald-800">מקסימום אפשרי:</span>
                    <span className="font-bold text-emerald-900">{formatCurrency(result.maxPossibleGrant)}</span>
                  </div>
                  <div className="flex justify-between text-sm mt-1">
                    <span className="text-emerald-800">מקבל:</span>
                    <span className="font-bold text-emerald-900">{result.percentOfMax.toFixed(0)}% מהמקסימום</span>
                  </div>
                  {/* progress bar */}
                  <div className="mt-2 h-2 bg-emerald-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all"
                      style={{ width: `${Math.min(100, result.percentOfMax)}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Tier indicator */}
              <div className={`rounded-xl p-4 border-2 flex items-center gap-3 ${
                result.tier.direction === 'rise'
                  ? 'bg-blue-50 border-blue-200 text-blue-900'
                  : result.tier.direction === 'fall'
                  ? 'bg-amber-50 border-amber-200 text-amber-900'
                  : 'bg-gray-50 border-gray-200 text-gray-700'
              }`}>
                {result.tier.direction === 'rise' ? (
                  <TrendingUp className="w-5 h-5 flex-shrink-0" />
                ) : (
                  <TrendingDown className="w-5 h-5 flex-shrink-0" />
                )}
                <div>
                  <p className="text-sm font-bold">{result.tier.name}</p>
                  <p className="text-xs mt-0.5">
                    {result.tier.direction === 'rise'
                      ? `המשך להגדיל הכנסה עד ${WORK_GRANT_PEAK_INCOME_2026.toLocaleString('he-IL')} ₪ — המענק יגדל`
                      : `מעל ${WORK_GRANT_PEAK_INCOME_2026.toLocaleString('he-IL')} ₪ — המענק קטן עם עלייה בהכנסה`}
                  </p>
                </div>
              </div>

              {/* Breakdown */}
              <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-2 text-sm">
                <h4 className="font-bold text-gray-900 mb-3">פירוט המענק</h4>
                <div className="flex justify-between">
                  <span className="text-gray-600">מענק בסיס:</span>
                  <span className="font-medium">{formatCurrency(result.breakdown.baseGrant)}</span>
                </div>
                {result.breakdown.childrenBonus > 0 && (
                  <div className="flex justify-between text-blue-700">
                    <span>תוספת {result.numberOfChildren} ילד{result.numberOfChildren > 1 ? 'ים' : ''}:</span>
                    <span className="font-medium">+{formatCurrency(result.breakdown.childrenBonus)}</span>
                  </div>
                )}
                {result.breakdown.singleParentBonus > 0 && (
                  <div className="flex justify-between text-purple-700">
                    <span>תוספת הורה יחיד:</span>
                    <span className="font-medium">+{formatCurrency(result.breakdown.singleParentBonus)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold border-t pt-2 text-emerald-700">
                  <span>סה"כ שנתי:</span>
                  <span>{formatCurrency(result.breakdown.totalGrant)}</span>
                </div>
              </div>

              {/* Filing info */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-sm space-y-2">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4 text-emerald-700" />
                  <h4 className="font-bold text-emerald-900">איך מגישים?</h4>
                </div>
                <ul className="space-y-1 text-emerald-800 text-xs">
                  <li>• אתר רשות המסים → "מענק עבודה" → "הגשת בקשה"</li>
                  <li>• נדרש: ת.ז., טופס 106, פרטי בנק</li>
                  <li>• חלון הגשה: אוגוסט–ספטמבר לשנה הנוכחית</li>
                  <li>• טיפול: עד 90 ימים מהגשה</li>
                  <li>• ניתן להגיש 6 שנים אחורה!</li>
                </ul>
              </div>
            </>
          ) : (
            <>
              <div className="bg-red-50 border-2 border-red-300 rounded-xl p-6">
                <div className="flex items-center gap-2 mb-3">
                  <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
                  <h3 className="text-lg font-bold text-red-900">לא זכאי בתנאים הנוכחיים</h3>
                </div>
                {result.eligibility.primaryReason && (
                  <p className="text-sm text-red-800 font-medium">{result.eligibility.primaryReason}</p>
                )}
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm">
                <p className="font-bold text-amber-900 mb-2">מה ניתן לעשות?</p>
                <ul className="space-y-1.5 text-amber-800 text-xs">
                  {result.tips.map((tip, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="flex-shrink-0">💡</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Show potential grant at peak income */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm">
                <p className="font-bold text-blue-900 mb-2">פוטנציאל (אם תהיה בטווח):</p>
                <p className="text-blue-800 text-xs">
                  מקסימום עבור הפרופיל שלך: <strong>{formatCurrency(result.maxPossibleGrant)}/שנה</strong>
                </p>
                <p className="text-blue-700 text-xs mt-1">
                  בהכנסה {WORK_GRANT_PEAK_INCOME_2026.toLocaleString('he-IL')} ₪/שנה
                </p>
              </div>
            </>
          )}

          {/* Tips */}
          {result.isEligible && result.tips.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-900 space-y-1.5">
              <p className="font-bold mb-1 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5" />
                טיפים
              </p>
              {result.tips.map((t, i) => (
                <p key={i} className="flex gap-1.5">
                  <span className="flex-shrink-0">💡</span>
                  <span>{t}</span>
                </p>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Grant Curve Chart */}
      <SectionCard title="עקומת המענק — איך הסכום משתנה לפי הכנסה">
        <p className="text-xs text-gray-500 -mt-3 mb-2">
          עלייה לשיא ב-{WORK_GRANT_PEAK_INCOME_2026.toLocaleString('he-IL')} ₪, ואז ירידה עד לאפס
        </p>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={curveData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="income"
                tickFormatter={(v) => `${(Number(v) / 1000).toFixed(0)}K`}
                tick={{ fontSize: 11 }}
              />
              <YAxis
                tickFormatter={(v) => `${(Number(v) / 1000).toFixed(0)}K`}
                tick={{ fontSize: 11 }}
              />
              <Tooltip
                formatter={(v) => formatCurrency(Number(v))}
                labelFormatter={(v) => `הכנסה: ${Number(v).toLocaleString('he-IL')} ₪`}
              />
              <Area
                type="monotone"
                dataKey="grant"
                stroke="#10b981"
                fill="#d1fae5"
                strokeWidth={2}
                name="מענק עבודה"
              />
              {result.isEligible && (
                <ReferenceLine
                  x={income}
                  stroke="#ef4444"
                  strokeDasharray="4 4"
                  label={{ value: 'אתה', position: 'top', fill: '#ef4444', fontSize: 11 }}
                />
              )}
              <ReferenceLine
                x={WORK_GRANT_PEAK_INCOME_2026}
                stroke="#f59e0b"
                strokeDasharray="4 4"
                label={{ value: 'שיא', position: 'top', fill: '#f59e0b', fontSize: 11 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </SectionCard>
    </div>
  );
};

// ============================================================
// Tab: Eligibility Checker
// ============================================================
const EligibilityTab = () => {
  const [age, setAge] = useState(30);
  const [children, setChildren] = useState(0);
  const [singleParent, setSingleParent] = useState(false);
  const [income, setIncome] = useState(55_000);
  const [employmentType, setEmploymentType] = useState<EmploymentType>('salaried');
  const [monthsSalaried, setMonthsSalaried] = useState(12);
  const [weeksSelfEmployed, setWeeksSelfEmployed] = useState(0);

  const result = useMemo(() => calculateWorkGrant({
    annualWorkIncome: income,
    age,
    familyStatus: 'single',
    numberOfChildren: children,
    isSingleParent: singleParent,
    employmentType,
    monthsAsSalaried: monthsSalaried,
    weeksAsSelfEmployed: weeksSelfEmployed,
    isIsraeliResident: true,
  }), [age, children, singleParent, income, employmentType, monthsSalaried, weeksSelfEmployed]);

  return (
    <div className="space-y-4">
      <SectionCard title="בדיקת תנאי זכאות">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">גיל</label>
            <input
              type="number" min={18} max={80} value={age}
              onChange={(e) => setAge(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">הכנסה שנתית (₪)</label>
            <input
              type="number" min={0} step={1000} value={income}
              onChange={(e) => setIncome(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">מספר ילדים</label>
            <input
              type="number" min={0} max={5} value={children}
              onChange={(e) => setChildren(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">חודשי עבודה (שכיר)</label>
            <input
              type="number" min={0} max={12} value={monthsSalaried}
              onChange={(e) => setMonthsSalaried(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer">
          <input type="checkbox" checked={singleParent} onChange={(e) => setSingleParent(e.target.checked)} className="w-4 h-4" />
          <span className="text-sm">הורה יחיד</span>
        </label>
      </SectionCard>

      {/* Condition checklist */}
      <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
        <h3 className="font-bold text-gray-900 mb-4">
          {result.eligibility.isEligible ? (
            <span className="text-emerald-700 flex items-center gap-2">
              <CheckCircle className="w-5 h-5" /> עומד בכל תנאי הזכאות
            </span>
          ) : (
            <span className="text-red-700 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" /> חסר תנאי אחד או יותר
            </span>
          )}
        </h3>

        <ul className="space-y-3">
          {result.eligibility.conditions.map((cond, i) => (
            <li
              key={i}
              className={`flex items-start gap-3 p-3 rounded-lg ${
                cond.met ? 'bg-green-50' : 'bg-red-50'
              }`}
            >
              {cond.met ? (
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              )}
              <div>
                <p className={`text-sm font-semibold ${cond.met ? 'text-green-800' : 'text-red-800'}`}>
                  {cond.label}
                </p>
                <p className={`text-xs mt-0.5 ${cond.met ? 'text-green-700' : 'text-red-700'}`}>
                  {cond.note}
                </p>
              </div>
            </li>
          ))}
        </ul>

        {result.isEligible && (
          <div className="mt-4 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
            <p className="text-sm font-bold text-emerald-900">
              מענק משוער: {formatCurrency(result.annualGrant)}/שנה
            </p>
            <p className="text-xs text-emerald-700 mt-1">
              ניתן להגיש 6 שנים אחורה — בדוק שנים 2020–2025
            </p>
          </div>
        )}
      </div>

      {/* Filing window */}
      <InfoBox variant="blue">
        <div className="flex items-center gap-2 mb-2">
          <Calendar className="w-4 h-4" />
          <h4 className="text-sm font-bold">חלון הגשה</h4>
        </div>
        <p className="text-sm">
          הגשה לשנת מס 2025 פתוחה: <strong>אוגוסט–ספטמבר 2026</strong>.
          ניתן להגיש דרך אתר רשות המסים. גם אם פספסת שנים קודמות — עדיין ניתן להגיש עד 6 שנים אחורה.
        </p>
      </InfoBox>
    </div>
  );
};

// ============================================================
// Tab: Year Comparison
// ============================================================
const ComparisonTab = () => {
  const [children, setChildren] = useState(0);
  const comparisons = useMemo(() => getYearComparison(), []);

  const barData = [
    { name: 'יחיד ללא ילדים', '2024': comparisons[0].maxGrantSingle, '2026': comparisons[1].maxGrantSingle },
    { name: 'ילד אחד', '2024': comparisons[0].maxGrantOneChild, '2026': comparisons[1].maxGrantOneChild },
    { name: 'שני ילדים', '2024': comparisons[0].maxGrantTwoChildren, '2026': comparisons[1].maxGrantTwoChildren },
    { name: 'שלושה ילדים', '2024': comparisons[0].maxGrantThreeChildren, '2026': comparisons[1].maxGrantThreeChildren },
  ];

  const BAR_COLORS = ['#9ca3af', '#10b981'];

  return (
    <div className="space-y-5">
      <InfoBox variant="green">
        <p className="text-sm font-bold mb-1">עדכון 2026 — מה השתנה?</p>
        <p className="text-sm">
          סכומי המענק עלו בכ-10% ביחס ל-2024, בהתאם לעדכון מדד המחירים. גם טווחי ההכנסה הורחבו.
        </p>
      </InfoBox>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={barData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="name" tick={{ fontSize: 11 }} />
            <YAxis tickFormatter={(v) => formatCurrency(Number(v))} tick={{ fontSize: 10 }} />
            <Tooltip formatter={(v) => formatCurrency(Number(v))} />
            <Legend />
            {BAR_COLORS.map((color, i) => (
              <Bar key={['2024', '2026'][i]} dataKey={['2024', '2026'][i]} fill={color} radius={[4, 4, 0, 0]} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-50">
              <th className="border border-gray-200 px-3 py-2 text-right font-semibold">פרמטר</th>
              <th className="border border-gray-200 px-3 py-2 text-center font-semibold">2024</th>
              <th className="border border-gray-200 px-3 py-2 text-center font-semibold text-emerald-700">2026</th>
              <th className="border border-gray-200 px-3 py-2 text-center font-semibold text-blue-700">שינוי</th>
            </tr>
          </thead>
          <tbody>
            {[
              {
                label: 'הכנסה מינימלית',
                v2024: comparisons[0].minIncome,
                v2026: comparisons[1].minIncome,
              },
              {
                label: 'תקרה יחיד',
                v2024: comparisons[0].maxIncomeSingle,
                v2026: comparisons[1].maxIncomeSingle,
              },
              {
                label: 'תקרה הורה',
                v2024: comparisons[0].maxIncomeParent,
                v2026: comparisons[1].maxIncomeParent,
              },
              {
                label: 'מקסימום יחיד ללא ילדים',
                v2024: comparisons[0].maxGrantSingle,
                v2026: comparisons[1].maxGrantSingle,
              },
              {
                label: 'מקסימום הורה 1 ילד',
                v2024: comparisons[0].maxGrantOneChild,
                v2026: comparisons[1].maxGrantOneChild,
              },
              {
                label: 'מקסימום הורה 2 ילדים',
                v2024: comparisons[0].maxGrantTwoChildren,
                v2026: comparisons[1].maxGrantTwoChildren,
              },
            ].map((row, i) => {
              const diff = row.v2026 - row.v2024;
              const pct = ((diff / row.v2024) * 100).toFixed(1);
              return (
                <tr key={i} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="border border-gray-200 px-3 py-2">{row.label}</td>
                  <td className="border border-gray-200 px-3 py-2 text-center text-gray-500">
                    {formatCurrency(row.v2024)}
                  </td>
                  <td className="border border-gray-200 px-3 py-2 text-center font-semibold text-emerald-700">
                    {formatCurrency(row.v2026)}
                  </td>
                  <td className="border border-gray-200 px-3 py-2 text-center text-blue-700 font-medium">
                    +{pct}%
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
// Tab: Benefits Comparison
// ============================================================
const BenefitsTab = () => {
  const [children, setChildren] = useState(2);
  const [income, setIncome] = useState(55_000);
  const [singleParent, setSingleParent] = useState(false);

  const workGrant = useMemo(() => calculateWorkGrant({
    annualWorkIncome: income,
    age: 35,
    familyStatus: 'single',
    numberOfChildren: children,
    isSingleParent: singleParent,
    employmentType: 'salaried',
    monthsAsSalaried: 12,
    weeksAsSelfEmployed: 0,
    isIsraeliResident: true,
  }), [income, children, singleParent]);

  // Child allowance calculation
  const monthlyChildAllowance = useMemo(() => {
    let total = 0;
    const c = CHILDREN_ALLOWANCE_2026;
    for (let i = 1; i <= children; i++) {
      if (i === 1) total += c.firstChild;
      else if (i === 2) total += c.secondChild;
      else if (i === 3) total += c.thirdChild;
      else if (i === 4) total += c.fourthChild;
      else total += c.fifthAndAbove;
    }
    return total;
  }, [children]);

  const annualChildAllowance = monthlyChildAllowance * 12;

  const barData = [
    {
      name: 'מענק עבודה',
      value: Math.round(workGrant.annualGrant),
      color: '#10b981',
      description: 'תלוי בהכנסה',
    },
    {
      name: 'קצבת ילדים',
      value: annualChildAllowance,
      color: '#3b82f6',
      description: `${children} ילדים × חודשי`,
    },
    {
      name: 'סה"כ',
      value: Math.round(workGrant.annualGrant) + annualChildAllowance,
      color: '#8b5cf6',
      description: 'מענק + קצבת ילדים',
    },
  ];

  return (
    <div className="space-y-5">
      <div className="grid sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">הכנסה שנתית (₪)</label>
          <input
            type="number" min={0} step={1000} value={income}
            onChange={(e) => setIncome(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">ילדים</label>
          <input
            type="number" min={0} max={5} value={children}
            onChange={(e) => setChildren(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
          />
        </div>
        <div className="flex items-end">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={singleParent} onChange={(e) => setSingleParent(e.target.checked)} className="w-4 h-4" />
            <span className="text-sm">הורה יחיד</span>
          </label>
        </div>
      </div>

      {/* Bar chart */}
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={barData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tickFormatter={(v) => formatCurrency(Number(v))} tick={{ fontSize: 10 }} />
            <Tooltip formatter={(v) => formatCurrency(Number(v))} />
            <Bar dataKey="value" radius={[4, 4, 0, 0]} name="סכום שנתי">
              {barData.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Summary cards */}
      <div className="grid sm:grid-cols-3 gap-4">
        {barData.map((item, i) => (
          <div
            key={i}
            className="rounded-xl p-4 text-center border-2"
            style={{ borderColor: item.color, backgroundColor: `${item.color}15` }}
          >
            <p className="text-xs text-gray-500 mb-1">{item.name}</p>
            <p className="text-2xl font-black" style={{ color: item.color }}>
              {formatCurrency(item.value)}
            </p>
            <p className="text-xs text-gray-500 mt-1">{item.description}</p>
          </div>
        ))}
      </div>

      <InfoBox variant="blue">
        <p className="text-sm font-bold mb-1">חשוב לדעת</p>
        <p className="text-sm">
          מענק עבודה וקצבת ילדים הם שני הטבות נפרדות — ניתן לקבל שניהם. קצבת ילדים ניתנת אוטומטית
          ממוסד הביטוח הלאומי. מענק עבודה דורש הגשת בקשה פעילה לרשות המסים.
        </p>
      </InfoBox>
    </div>
  );
};

// ============================================================
// Main Component
// ============================================================

type TabMode = 'calculator' | 'eligibility' | 'comparison' | 'benefits';

const TABS: { id: TabMode; label: string }[] = [
  { id: 'calculator', label: 'מחשבון מענק' },
  { id: 'eligibility', label: 'בדיקת זכאות' },
  { id: 'comparison', label: 'השוואת שנים' },
  { id: 'benefits', label: 'השוואת הטבות' },
];

export function NITCalculator() {
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
      {activeTab === 'eligibility' && <EligibilityTab />}
      {activeTab === 'comparison' && <ComparisonTab />}
      {activeTab === 'benefits' && <BenefitsTab />}
    </div>
  );
}
