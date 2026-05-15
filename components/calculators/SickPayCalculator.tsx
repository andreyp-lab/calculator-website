'use client';

import { useState, useMemo } from 'react';
import {
  calculateSickPayFull,
  calculateSickDayAccumulation,
  calculateFamilyIllnessPay,
  calculateLongIllness,
  SICK_DAYS_MAX_BALANCE,
  SICK_DAYS_ACCRUAL_PER_YEAR,
  FAMILY_ILLNESS_ALLOWANCES,
  type FamilyRelation,
} from '@/lib/calculators/sick-pay';
import { formatCurrency } from '@/lib/utils/formatters';
import { ResultCard } from '@/components/calculator/ResultCard';
import { Breakdown } from '@/components/calculator/Breakdown';
import { AlertCircle, Info, ChevronDown, ChevronUp } from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Legend,
} from 'recharts';

// ============================================================
// Constants
// ============================================================

type TabMode = 'pay' | 'balance' | 'family' | 'long_illness';

const TABS: { id: TabMode; label: string; emoji: string }[] = [
  { id: 'pay', label: 'כמה אקבל?', emoji: '💊' },
  { id: 'balance', label: 'יתרת ימים', emoji: '📊' },
  { id: 'family', label: 'מחלת משפחה', emoji: '👨‍👩‍👧' },
  { id: 'long_illness', label: 'מחלה ממושכת', emoji: '🏥' },
];

const RELATION_LABELS: Record<FamilyRelation, string> = {
  child: 'ילד עד גיל 16',
  spouse: 'בן/בת זוג',
  parent: 'הורה (גיל 65+)',
};

// ============================================================
// Shared sub-components
// ============================================================

const SectionCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="bg-white border-2 border-gray-200 rounded-xl p-6 space-y-5">
    <h2 className="text-lg font-bold text-gray-900">{title}</h2>
    {children}
  </div>
);

const InfoBox = ({ children, variant = 'blue' }: { children: React.ReactNode; variant?: 'blue' | 'amber' | 'red' | 'green' }) => {
  const classes = {
    blue: 'bg-blue-50 border-blue-200 text-blue-900',
    amber: 'bg-amber-50 border-amber-200 text-amber-900',
    red: 'bg-red-50 border-red-200 text-red-900',
    green: 'bg-green-50 border-green-200 text-green-900',
  };
  return (
    <div className={`border rounded-xl p-4 ${classes[variant]}`}>
      {children}
    </div>
  );
};

const Recommendations = ({ items }: { items: string[] }) => {
  if (items.length === 0) return null;
  return (
    <InfoBox variant="amber">
      <h4 className="text-sm font-bold mb-2 flex items-center gap-2">
        <Info className="w-4 h-4" />
        המלצות ותובנות
      </h4>
      <ul className="space-y-1.5">
        {items.map((rec, i) => (
          <li key={i} className="text-sm flex gap-2">
            <span className="flex-shrink-0">💡</span>
            <span>{rec}</span>
          </li>
        ))}
      </ul>
    </InfoBox>
  );
};

// ============================================================
// Progress Bar — ניצול ימי מחלה
// ============================================================
const SickDayProgressBar = ({
  balance,
  max = SICK_DAYS_MAX_BALANCE,
}: {
  balance: number;
  max?: number;
}) => {
  const pct = Math.min(100, (balance / max) * 100);
  const color =
    pct >= 80 ? 'bg-green-500' :
    pct >= 40 ? 'bg-blue-500' :
    pct >= 15 ? 'bg-amber-500' :
    'bg-red-500';

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-xs text-gray-600">
        <span>0 ימים</span>
        <span className="font-semibold text-gray-800">{balance.toFixed(1)} ימים ({pct.toFixed(0)}%)</span>
        <span>{max} ימים</span>
      </div>
      <div className="h-6 bg-gray-100 rounded-full overflow-hidden border border-gray-200">
        <div
          className={`h-full ${color} rounded-full transition-all duration-500 flex items-center justify-end pr-2`}
          style={{ width: `${Math.max(3, pct)}%` }}
        >
          {pct > 10 && (
            <span className="text-xs text-white font-medium">{balance.toFixed(1)}</span>
          )}
        </div>
      </div>
      <div className="flex gap-3 text-xs">
        <span className="flex items-center gap-1">
          <span className="inline-block w-3 h-3 rounded-full bg-green-500" />
          מוגן (80%+)
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block w-3 h-3 rounded-full bg-blue-500" />
          טוב
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block w-3 h-3 rounded-full bg-amber-500" />
          נמוך
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block w-3 h-3 rounded-full bg-red-500" />
          מועט
        </span>
      </div>
    </div>
  );
};

// ============================================================
// Tab: Pay Calculator
// ============================================================
const PayTab = ({
  monthlySalary,
  setMonthlySalary,
  sickDays,
  setSickDays,
}: {
  monthlySalary: number;
  setMonthlySalary: (v: number) => void;
  sickDays: number;
  setSickDays: (v: number) => void;
}) => {
  const result = useMemo(
    () => calculateSickPayFull({ sickDays, monthlySalary, consecutive: true }),
    [sickDays, monthlySalary],
  );

  // נתונים לגרף עמודות
  const chartData = useMemo(() => {
    return result.daysPayment.slice(0, Math.min(sickDays, 14)).map((d) => ({
      name: `י׳ ${d.day}`,
      תשלום: Math.round(d.amount),
      הפסד: Math.round(result.dailySalary - d.amount),
    }));
  }, [result, sickDays]);

  const pieData = useMemo(() => [
    { name: 'תשלום מהמעסיק', value: Math.round(result.totalPayment) },
    { name: 'הפסד שכר', value: Math.round(result.totalUnpaidLoss) },
  ], [result]);

  const PIE_COLORS = ['#22c55e', '#f59e0b'];

  return (
    <div className="space-y-4">
      <SectionCard title="פרטי המחלה">
        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              מספר ימי מחלה
            </label>
            <input
              type="number"
              min={0}
              max={90}
              value={sickDays}
              onChange={(e) => setSickDays(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xl font-bold"
            />
            <p className="text-xs text-gray-500 mt-1">מקסימום 90 ימים (תקרת החוק)</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              שכר חודשי ברוטו (₪)
            </label>
            <input
              type="number"
              min={0}
              max={200000}
              step={500}
              value={monthlySalary}
              onChange={(e) => setMonthlySalary(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {monthlySalary > 0 && (
              <p className="text-xs text-gray-500 mt-1">
                שכר יומי: {formatCurrency(result.dailySalary, { decimals: 0 })}
              </p>
            )}
          </div>
        </div>

        <InfoBox variant="blue">
          <p className="text-sm font-bold mb-2">חוק דמי מחלה — שיעורי תשלום</p>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-white rounded-lg p-2 border border-blue-200">
              <p className="text-lg font-black text-red-600">0%</p>
              <p className="text-xs text-gray-600">יום 1</p>
            </div>
            <div className="bg-white rounded-lg p-2 border border-blue-200">
              <p className="text-lg font-black text-amber-600">50%</p>
              <p className="text-xs text-gray-600">ימים 2-3</p>
            </div>
            <div className="bg-white rounded-lg p-2 border border-blue-200">
              <p className="text-lg font-black text-green-600">100%</p>
              <p className="text-xs text-gray-600">יום 4+</p>
            </div>
          </div>
        </InfoBox>
      </SectionCard>

      {/* תוצאות */}
      <div className="grid sm:grid-cols-3 gap-4">
        <ResultCard
          title="תשלום מהמעסיק"
          value={formatCurrency(result.totalPayment)}
          subtitle={`עבור ${sickDays} ימי מחלה`}
          variant="success"
        />
        <ResultCard
          title="שכר יומי"
          value={formatCurrency(result.dailySalary, { decimals: 0 })}
          subtitle={`${monthlySalary.toLocaleString('he-IL')} ₪ / 22 ימים`}
          variant="primary"
        />
        {result.totalUnpaidLoss > 0 ? (
          <ResultCard
            title="הפסד עקב החוק"
            value={formatCurrency(result.totalUnpaidLoss)}
            subtitle="ימים 1-3 לא מכוסים במלואם"
            variant="warning"
          />
        ) : (
          <ResultCard
            title="הפסד שכר"
            value="אין"
            subtitle="מקבל 100% מהשכר"
            variant="success"
          />
        )}
      </div>

      {/* פירוט לפי ימים */}
      <Breakdown
        title="פירוט תשלום לפי ימים"
        defaultOpen={sickDays > 0 && sickDays <= 10}
        items={[
          { label: 'שכר חודשי ברוטו', value: formatCurrency(monthlySalary) },
          { label: 'שכר יומי (÷22)', value: formatCurrency(result.dailySalary, { decimals: 2 }) },
          ...result.daysPayment.slice(0, Math.min(sickDays, 10)).map((d) => ({
            label: `יום ${d.day} (${d.label})`,
            value: formatCurrency(d.amount, { decimals: 0 }),
          })),
          ...(sickDays > 10 ? [{
            label: `ימים 11-${sickDays} (100% כל יום)`,
            value: formatCurrency((sickDays - 10) * result.dailySalary, { decimals: 0 }),
            note: `${sickDays - 10} ימים × ${formatCurrency(result.dailySalary, { decimals: 0 })}`,
          }] : []),
          { label: 'סה"כ תשלום מהמעסיק', value: formatCurrency(result.totalPayment), bold: true },
          { label: 'שכר מלא לתקופה', value: formatCurrency(result.totalGrossForPeriod) },
          { label: 'הפרש (הפסד)', value: formatCurrency(result.totalUnpaidLoss), bold: result.totalUnpaidLoss > 0 },
        ]}
      />

      {/* גרף — עמודות תשלום לפי ימים */}
      {sickDays > 1 && sickDays <= 14 && monthlySalary > 0 && (
        <div className="bg-white border-2 border-gray-200 rounded-xl p-5">
          <h3 className="font-bold text-gray-900 mb-4">תשלום לפי ימים</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${v.toLocaleString('he-IL')} ₪`} width={70} />
              <Tooltip formatter={(v) => `${Number(v).toLocaleString('he-IL')} ₪`} />
              <Legend />
              <Bar dataKey="תשלום" fill="#22c55e" radius={[4, 4, 0, 0]} />
              <Bar dataKey="הפסד" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* גרף עוגה — פירוט */}
      {sickDays > 0 && monthlySalary > 0 && result.totalUnpaidLoss > 0 && (
        <div className="bg-white border-2 border-gray-200 rounded-xl p-5">
          <h3 className="font-bold text-gray-900 mb-4">חלוקת השכר בתקופת המחלה</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ name, percent }) => `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {pieData.map((_, index) => (
                  <Cell key={index} fill={PIE_COLORS[index]} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => `${Number(v).toLocaleString('he-IL')} ₪`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* הסבר */}
      {result.explanation && (
        <InfoBox variant="blue">
          <p className="text-sm">{result.explanation}</p>
        </InfoBox>
      )}

      <Recommendations items={result.recommendations} />
    </div>
  );
};

// ============================================================
// Tab: Balance / Accumulation
// ============================================================
const BalanceTab = ({
  monthsWorked,
  setMonthsWorked,
  daysUsed,
  setDaysUsed,
}: {
  monthsWorked: number;
  setMonthsWorked: (v: number) => void;
  daysUsed: number;
  setDaysUsed: (v: number) => void;
}) => {
  const result = useMemo(
    () => calculateSickDayAccumulation({ monthsWorked, daysUsed }),
    [monthsWorked, daysUsed],
  );

  // נתוני גרף צבירה לפי חודשים
  const chartData = useMemo(() => {
    const points: { חודש: string; צבורים: number; נוצלו: number }[] = [];
    const yearsToShow = Math.min(Math.ceil(monthsWorked / 12) + 1, 6);
    for (let y = 1; y <= yearsToShow; y++) {
      const m = y * 12;
      const accrued = Math.min(m * 1.5, 90);
      points.push({
        חודש: `שנה ${y}`,
        צבורים: Math.round(accrued * 10) / 10,
        נוצלו: Math.min(daysUsed, accrued),
      });
    }
    return points;
  }, [monthsWorked, daysUsed]);

  return (
    <div className="space-y-4">
      <SectionCard title="פרטי ההעסקה">
        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              חודשי עבודה אצל המעסיק
            </label>
            <input
              type="number"
              min={0}
              max={600}
              value={monthsWorked}
              onChange={(e) => setMonthsWorked(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xl font-bold"
            />
            <p className="text-xs text-gray-500 mt-1">
              {monthsWorked >= 12
                ? `${Math.floor(monthsWorked / 12)} שנים ו-${monthsWorked % 12} חודשים`
                : `${monthsWorked} חודשים (שנה ראשונה)`}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ימי מחלה שנוצלו בסה"כ
            </label>
            <input
              type="number"
              min={0}
              max={90}
              value={daysUsed}
              onChange={(e) => setDaysUsed(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">סך ימים שנעדרת בשל מחלה</p>
          </div>
        </div>

        <InfoBox variant="blue">
          <p className="text-sm font-bold mb-1">כיצד מחשבים ימי מחלה?</p>
          <ul className="text-sm space-y-1">
            <li>• <strong>1.5 ימים לחודש</strong> = 18 ימים לשנה</li>
            <li>• <strong>תקרה: 90 ימים</strong> מצטברים (5 שנים של עבודה)</li>
            <li>• ימים שלא נוצלו <strong>נשמרים לשנים הבאות</strong></li>
            <li>• בסיום עבודה — <strong>לא ניתנים לפדיון</strong> (שלא כמו חופשה)</li>
          </ul>
        </InfoBox>
      </SectionCard>

      {/* תוצאות */}
      <div className="grid sm:grid-cols-3 gap-4">
        <ResultCard
          title="ימים שנצברו"
          value={`${result.daysAccrued.toFixed(1)} ימים`}
          subtitle={`${monthsWorked} חודשים × 1.5`}
          variant="primary"
        />
        <ResultCard
          title="יתרה זמינה"
          value={`${result.balance.toFixed(1)} ימים`}
          subtitle={`לאחר ניצול ${daysUsed} ימים`}
          variant={result.balance >= 10 ? 'success' : result.balance >= 3 ? 'warning' : 'warning'}
        />
        <ResultCard
          title={result.atMaximum ? 'תקרה מלאה!' : 'עד תקרה'}
          value={result.atMaximum ? '90 ימים' : `${result.monthsToMax} חודשים`}
          subtitle={result.atMaximum ? 'הגעת לתקרה המקסימלית' : `עוד ${result.monthsToMax} חודשים לתקרה`}
          variant={result.atMaximum ? 'success' : 'primary'}
        />
      </div>

      {/* Progress bar */}
      <div className="bg-white border-2 border-gray-200 rounded-xl p-5">
        <h3 className="font-bold text-gray-900 mb-4">מצב יתרת ימי מחלה</h3>
        <SickDayProgressBar balance={result.balance} max={SICK_DAYS_MAX_BALANCE} />
        <p className="text-xs text-gray-500 mt-3 text-center">
          {result.balance.toFixed(1)} מתוך 90 ימים ({result.percentOfMax.toFixed(0)}% מהתקרה)
        </p>
      </div>

      {/* גרף צבירה לאורך שנים */}
      {monthsWorked >= 12 && (
        <div className="bg-white border-2 border-gray-200 rounded-xl p-5">
          <h3 className="font-bold text-gray-900 mb-4">צבירת ימי מחלה לאורך שנים</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="חודש" tick={{ fontSize: 12 }} />
              <YAxis domain={[0, 90]} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="צבורים" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="נוצלו" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <p className="text-xs text-gray-400 text-center mt-1">הקו המקסימלי: 90 ימים</p>
        </div>
      )}

      {/* אזהרה אם יתרה נמוכה */}
      {result.balance < 5 && monthsWorked > 0 && (
        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 flex gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-red-900 mb-1">יתרת ימי מחלה נמוכה!</h4>
            <p className="text-sm text-red-800">
              יש לך רק {result.balance.toFixed(1)} ימים זמינים. אם תמרד {Math.ceil(result.balance) + 1} ימים ויותר,
              המעסיק לא יהיה מחויב לשלם על הימים מעבר ליתרה.
              שקול ביטוח אובדן כושר עבודה.
            </p>
          </div>
        </div>
      )}

      {result.atMaximum && (
        <InfoBox variant="green">
          <h4 className="font-bold mb-1">הגעת לתקרה המקסימלית (90 ימים)</h4>
          <p className="text-sm">
            צברת את המכסה הגבוהה ביותר האפשרית. ימי מחלה נוספים לא יצטברו עוד.
            הצבירה תחודש רק לאחר ניצול חלק מהיתרה.
          </p>
        </InfoBox>
      )}

      <Breakdown
        title="פירוט חישוב הצבירה"
        items={[
          { label: 'חודשי עבודה', value: `${monthsWorked} חודשים` },
          { label: 'קצב צבירה', value: '1.5 ימים/חודש' },
          { label: 'ימים שנצברו (לפני תקרה)', value: `${(monthsWorked * 1.5).toFixed(1)} ימים` },
          { label: 'תקרה מקסימלית', value: '90 ימים' },
          { label: 'ימים שנצברו (אחרי תקרה)', value: `${result.daysAccrued.toFixed(1)} ימים` },
          { label: 'ימים שנוצלו', value: `${daysUsed} ימים` },
          { label: 'יתרה זמינה', value: `${result.balance.toFixed(1)} ימים`, bold: true },
        ]}
      />
    </div>
  );
};

// ============================================================
// Tab: Family Illness
// ============================================================
const FamilyTab = ({
  monthlySalary,
  setMonthlySalary,
}: {
  monthlySalary: number;
  setMonthlySalary: (v: number) => void;
}) => {
  const [relation, setRelation] = useState<FamilyRelation>('child');
  const [absenceDays, setAbsenceDays] = useState(3);
  const [parentAge, setParentAge] = useState(68);
  const [showCompare, setShowCompare] = useState(false);

  const result = useMemo(
    () =>
      calculateFamilyIllnessPay({
        relation,
        absenceDays,
        monthlySalary,
        parentAge: relation === 'parent' ? parentAge : undefined,
      }),
    [relation, absenceDays, monthlySalary, parentAge],
  );

  // השוואה בין כל סוגי הקרבה
  const comparisonData = useMemo(() => {
    return (['child', 'spouse', 'parent'] as FamilyRelation[]).map((rel) => ({
      שם: RELATION_LABELS[rel],
      'מכסה שנתית': rel === 'child' ? 8 : 6,
    }));
  }, []);

  return (
    <div className="space-y-4">
      <SectionCard title="מחלת בן משפחה — פרטים">
        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              קרבת משפחה
            </label>
            <select
              value={relation}
              onChange={(e) => setRelation(e.target.value as FamilyRelation)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="child">ילד עד גיל 16</option>
              <option value="spouse">בן/בת זוג</option>
              <option value="parent">הורה (גיל 65+)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ימי היעדרות
            </label>
            <input
              type="number"
              min={1}
              max={30}
              value={absenceDays}
              onChange={(e) => setAbsenceDays(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xl font-bold"
            />
          </div>
        </div>

        {relation === 'parent' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              גיל ההורה
            </label>
            <input
              type="number"
              min={50}
              max={100}
              value={parentAge}
              onChange={(e) => setParentAge(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">
              זכאות למחלת הורה חלה רק מגיל 65
            </p>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            שכר חודשי ברוטו (₪)
          </label>
          <input
            type="number"
            min={0}
            max={200000}
            step={500}
            value={monthlySalary}
            onChange={(e) => setMonthlySalary(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </SectionCard>

      {/* תוצאות */}
      {result.isEligible ? (
        <>
          <div className="grid sm:grid-cols-3 gap-4">
            <ResultCard
              title="ימים מכוסים"
              value={`${result.coveredDays} ימים`}
              subtitle={`מתוך מכסה של ${result.maxAllowedDays} ימים`}
              variant="success"
            />
            <ResultCard
              title="תשלום מהמעסיק"
              value={formatCurrency(result.totalPayment)}
              subtitle="לפי שיעורי מחלה רגילים"
              variant="success"
            />
            {result.uncoveredDays > 0 ? (
              <ResultCard
                title="ימים לא מכוסים"
                value={`${result.uncoveredDays} ימים`}
                subtitle="מעבר למכסה השנתית"
                variant="warning"
              />
            ) : (
              <ResultCard
                title="יתרת מכסה"
                value={`${result.maxAllowedDays - result.coveredDays} ימים`}
                subtitle="נשארו עד תום המכסה"
                variant="primary"
              />
            )}
          </div>

          <Breakdown
            title="פירוט חישוב מחלת בן משפחה"
            defaultOpen
            items={[
              { label: 'סוג קרבה', value: RELATION_LABELS[relation] },
              { label: 'מכסה שנתית', value: `${result.maxAllowedDays} ימים` },
              { label: 'ימי היעדרות', value: `${absenceDays} ימים` },
              { label: 'ימים מכוסים', value: `${result.coveredDays} ימים` },
              { label: 'ימים לא מכוסים', value: `${result.uncoveredDays} ימים` },
              { label: 'שכר יומי', value: formatCurrency(result.dailySalary, { decimals: 0 }) },
              { label: 'תשלום סה"כ', value: formatCurrency(result.totalPayment), bold: true },
            ]}
          />
        </>
      ) : (
        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 flex gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-red-900 mb-1">אינך זכאי להיעדרות מכוסה</h4>
            <p className="text-sm text-red-800">{result.ineligibilityReason}</p>
          </div>
        </div>
      )}

      {/* מידע כללי */}
      <InfoBox variant="blue">
        <p className="text-sm font-bold mb-2">חשוב לדעת על מחלת בן משפחה</p>
        <ul className="text-sm space-y-1.5">
          <li>• הימים נחשבים <strong>מתוך מכסת ימי המחלה האישיים שלך</strong> (18/שנה)</li>
          <li>• <strong>ילד</strong>: עד 8 ימים/שנה (מגיל 3 עד 16). עד גיל 3 — יש הרחבות</li>
          <li>• <strong>בן/בת זוג</strong>: עד 6 ימים/שנה</li>
          <li>• <strong>הורה</strong>: עד 6 ימים/שנה, רק מגיל 65</li>
          <li>• נדרש <strong>אישור רפואי</strong> על מחלת בן המשפחה</li>
          <li>• בן/בת הזוג <strong>הראשי/ת</strong> לטיפול בילד נהנה ממכסה כפולה (8 במקום 4)</li>
        </ul>
      </InfoBox>

      {/* השוואה */}
      <button
        type="button"
        onClick={() => setShowCompare(!showCompare)}
        className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl transition"
      >
        <span className="text-sm font-medium text-gray-800">השוואת מכסות לפי סוג קרבה</span>
        {showCompare ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>
      {showCompare && (
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-3 py-2 text-right font-semibold text-gray-700">קרבה</th>
                <th className="px-3 py-2 text-center font-semibold text-gray-700">מכסה שנתית</th>
                <th className="px-3 py-2 text-right font-semibold text-gray-700">תנאי זכאות</th>
              </tr>
            </thead>
            <tbody>
              <tr className={`border-t border-gray-100 ${relation === 'child' ? 'bg-blue-50 font-semibold' : ''}`}>
                <td className="px-3 py-2">ילד</td>
                <td className="px-3 py-2 text-center">{FAMILY_ILLNESS_ALLOWANCES.child} ימים</td>
                <td className="px-3 py-2 text-xs text-gray-600">עד גיל 16</td>
              </tr>
              <tr className={`border-t border-gray-100 ${relation === 'spouse' ? 'bg-blue-50 font-semibold' : ''}`}>
                <td className="px-3 py-2">בן/בת זוג</td>
                <td className="px-3 py-2 text-center">{FAMILY_ILLNESS_ALLOWANCES.spouse} ימים</td>
                <td className="px-3 py-2 text-xs text-gray-600">ללא תנאי גיל</td>
              </tr>
              <tr className={`border-t border-gray-100 ${relation === 'parent' ? 'bg-blue-50 font-semibold' : ''}`}>
                <td className="px-3 py-2">הורה</td>
                <td className="px-3 py-2 text-center">{FAMILY_ILLNESS_ALLOWANCES.parent} ימים</td>
                <td className="px-3 py-2 text-xs text-gray-600">רק מגיל 65</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// ============================================================
// Tab: Long Illness Scenario
// ============================================================
const LongIllnessTab = ({
  monthlySalary,
  setMonthlySalary,
}: {
  monthlySalary: number;
  setMonthlySalary: (v: number) => void;
}) => {
  const [yearsOfService, setYearsOfService] = useState(3);
  const [totalSickDays, setTotalSickDays] = useState(45);

  const result = useMemo(
    () => calculateLongIllness(yearsOfService, monthlySalary, totalSickDays),
    [yearsOfService, monthlySalary, totalSickDays],
  );

  const coverageRatio =
    result.accruedDaysAtStart > 0
      ? Math.min(100, (result.daysFromPersonalBalance / result.accruedDaysAtStart) * 100)
      : 0;

  return (
    <div className="space-y-4">
      <SectionCard title="תרחיש מחלה ממושכת">
        <div className="grid sm:grid-cols-3 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              שנות עבודה אצל המעסיק
            </label>
            <input
              type="number"
              min={0}
              max={40}
              step={0.5}
              value={yearsOfService}
              onChange={(e) => setYearsOfService(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xl font-bold"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              סך ימי מחלה
            </label>
            <input
              type="number"
              min={1}
              max={365}
              value={totalSickDays}
              onChange={(e) => setTotalSickDays(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xl font-bold"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              שכר חודשי ברוטו (₪)
            </label>
            <input
              type="number"
              min={0}
              max={200000}
              step={500}
              value={monthlySalary}
              onChange={(e) => setMonthlySalary(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </SectionCard>

      {/* תוצאות */}
      <div className="grid sm:grid-cols-3 gap-4">
        <ResultCard
          title="ימי מחלה צבורים"
          value={`${result.accruedDaysAtStart.toFixed(0)} ימים`}
          subtitle={`${yearsOfService} שנות עבודה × 18/שנה`}
          variant="primary"
        />
        <ResultCard
          title="תשלום מהמעסיק"
          value={formatCurrency(result.totalEmployerPayment)}
          subtitle={`עבור ${result.daysFromPersonalBalance} ימים מכוסים`}
          variant="success"
        />
        <ResultCard
          title="כיסוי מהיתרה"
          value={`${coverageRatio.toFixed(0)}%`}
          subtitle={`${result.daysFromPersonalBalance} מתוך ${result.accruedDaysAtStart} ימים`}
          variant={coverageRatio >= 80 ? 'success' : coverageRatio >= 40 ? 'warning' : 'warning'}
        />
      </div>

      {/* שלבי המחלה */}
      <div className="bg-white border-2 border-gray-200 rounded-xl p-5">
        <h3 className="font-bold text-gray-900 mb-4">שלבי המחלה — מה מגיע מתי?</h3>
        <div className="space-y-3">
          {result.scenarios.map((s, i) => (
            <div
              key={i}
              className={`flex items-start gap-3 p-3 rounded-lg border ${
                s.rate === 0 && s.startDay > 1
                  ? 'bg-red-50 border-red-200'
                  : s.rate === 1
                  ? 'bg-green-50 border-green-200'
                  : 'bg-amber-50 border-amber-200'
              }`}
            >
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white border-2 border-current flex items-center justify-center text-sm font-bold">
                {i + 1}
              </div>
              <div className="flex-1">
                <div className="flex justify-between">
                  <p className="text-sm font-semibold">
                    ימים {s.startDay}–{s.endDay}
                  </p>
                  <p className="text-sm font-bold">
                    {s.rate === 0 && s.startDay > 1 ? '0 ₪' : formatCurrency(s.payment)}
                  </p>
                </div>
                <p className="text-xs text-gray-600 mt-0.5">{s.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* מה קורה אחרי מיצוי הימים */}
      <InfoBox variant={totalSickDays > result.accruedDaysAtStart ? 'red' : 'green'}>
        <h4 className="font-bold mb-1">
          {totalSickDays > result.accruedDaysAtStart ? 'אחרי מיצוי הסל:' : 'הסל לא מוצה:'}
        </h4>
        <p className="text-sm">{result.afterBalance}</p>
      </InfoBox>

      {totalSickDays > result.accruedDaysAtStart && (
        <InfoBox variant="amber">
          <h4 className="font-bold mb-2">אפשרויות לאחר מיצוי ימי המחלה</h4>
          <ul className="text-sm space-y-1.5">
            <li>• <strong>ביטוח אובדן כושר עבודה</strong>: מכסה 70-80% מהשכר לאחר תקופת המתנה</li>
            <li>• <strong>חל"ת (חופשה ללא תשלום)</strong>: בהסכמת המעסיק, שמירת מקום העבודה</li>
            <li>• <strong>ביטוח לאומי — נכות</strong>: רלוונטי אם המחלה פוגעת בכושר העבודה לאורך זמן</li>
            <li>• <strong>מחלת מקצוע</strong>: אם נגרמה בתנאי עבודה — פיצוי ב.ל. שונה</li>
            <li>• <strong>פיטורים</strong>: מחלה אינה עילה לפיטורים (עד 180 ימים) — יש הגנות בחוק</li>
          </ul>
        </InfoBox>
      )}

      <Breakdown
        title="פירוט חישוב תרחיש ממושך"
        items={[
          { label: 'שנות עבודה', value: `${yearsOfService}` },
          { label: 'ימי מחלה צבורים (18/שנה, מקס׳ 90)', value: `${result.accruedDaysAtStart} ימים` },
          { label: 'שכר יומי (÷22)', value: formatCurrency(result.dailySalary, { decimals: 0 }) },
          { label: 'ימים מכוסים מהיתרה', value: `${result.daysFromPersonalBalance} ימים` },
          { label: 'ימים ללא תשלום', value: `${Math.max(0, totalSickDays - result.daysFromPersonalBalance)} ימים` },
          { label: 'תשלום כולל מהמעסיק', value: formatCurrency(result.totalEmployerPayment), bold: true },
        ]}
      />
    </div>
  );
};

// ============================================================
// Main Component
// ============================================================

export function SickPayCalculator() {
  const [activeTab, setActiveTab] = useState<TabMode>('pay');

  // Shared state
  const [monthlySalary, setMonthlySalary] = useState(12000);
  const [sickDays, setSickDays] = useState(5);

  // Balance tab state
  const [monthsWorked, setMonthsWorked] = useState(36);
  const [daysUsed, setDaysUsed] = useState(8);

  return (
    <div className="space-y-6" dir="rtl">
      {/* Tab navigation */}
      <div className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden">
        <div className="flex flex-wrap border-b border-gray-200">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 min-w-[120px] px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <span className="ml-1">{tab.emoji}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      {activeTab === 'pay' && (
        <PayTab
          monthlySalary={monthlySalary}
          setMonthlySalary={setMonthlySalary}
          sickDays={sickDays}
          setSickDays={setSickDays}
        />
      )}
      {activeTab === 'balance' && (
        <BalanceTab
          monthsWorked={monthsWorked}
          setMonthsWorked={setMonthsWorked}
          daysUsed={daysUsed}
          setDaysUsed={setDaysUsed}
        />
      )}
      {activeTab === 'family' && (
        <FamilyTab
          monthlySalary={monthlySalary}
          setMonthlySalary={setMonthlySalary}
        />
      )}
      {activeTab === 'long_illness' && (
        <LongIllnessTab
          monthlySalary={monthlySalary}
          setMonthlySalary={setMonthlySalary}
        />
      )}
    </div>
  );
}
