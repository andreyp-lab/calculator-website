'use client';

import { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
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
  calculateReserveDutyPay,
  calculateWarBonuses,
  calculateEmployerReimbursement,
  calculateFamilyAllowances,
  calculateIncomeLossProtection,
  RESERVE_PAY_2026,
  IRON_SWORDS_BONUSES,
  type ReserveDutyInput,
  type EmploymentStatus,
  type SalaryBasisPeriod,
  type CombatRole,
} from '@/lib/calculators/reserve-duty-pay';
import { formatCurrency } from '@/lib/utils/formatters';
import { ResultCard } from '@/components/calculator/ResultCard';
import { Breakdown } from '@/components/calculator/Breakdown';
import { AlertCircle, Info, ChevronDown, ChevronUp } from 'lucide-react';

// ============================================================
// Types & Constants
// ============================================================

type TabMode =
  | 'basic'
  | 'war_bonuses'
  | 'employer'
  | 'family'
  | 'income_protection'
  | 'timeline';

const TABS: { id: TabMode; label: string }[] = [
  { id: 'basic', label: 'חישוב בסיסי' },
  { id: 'war_bonuses', label: 'מענקי חרבות ברזל' },
  { id: 'employer', label: 'החזר מעסיק' },
  { id: 'family', label: 'קצבות משפחה' },
  { id: 'income_protection', label: 'הגנת הכנסה' },
  { id: 'timeline', label: 'לוח תשלומים' },
];

const PIE_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444'];

// ============================================================
// Default Input
// ============================================================

const DEFAULT_INPUT: ReserveDutyInput = {
  employmentStatus: 'employee',
  recentMonthlySalary: 12_000,
  salary12Months: 11_500,
  preWarSalary: 11_000,
  salaryBasis: '3months',
  reserveDays: 30,
  serviceStartDate: '',
  isIronSwordsService: true,
  combatRole: 'none',
  dependentChildren: 0,
  hasSpouse: false,
  spouseWorks: true,
  partTimePercent: 100,
  isSmallBusiness: false,
  employerContinuesPaying: true,
};

// ============================================================
// Main Calculator
// ============================================================

export function ReserveDutyPayCalculator() {
  const [activeTab, setActiveTab] = useState<TabMode>('basic');
  const [input, setInput] = useState<ReserveDutyInput>(DEFAULT_INPUT);
  const [showAllNotes, setShowAllNotes] = useState(false);

  const result = useMemo(() => calculateReserveDutyPay(input), [input]);

  function update<K extends keyof ReserveDutyInput>(k: K, v: ReserveDutyInput[K]) {
    setInput((prev) => ({ ...prev, [k]: v }));
  }

  // ============================================================
  // Shared Input Section
  // ============================================================

  const SharedInputs = () => (
    <div className="bg-white border-2 border-gray-200 rounded-xl p-6 space-y-5">
      <h2 className="text-lg font-bold text-gray-900">פרטי השירות</h2>

      {/* Employment Status */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">סטטוס תעסוקתי</label>
        <select
          value={input.employmentStatus}
          onChange={(e) => update('employmentStatus', e.target.value as EmploymentStatus)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="employee">שכיר</option>
          <option value="self-employed">עצמאי</option>
          <option value="unemployed">חסר תעסוקה / סטודנט</option>
        </select>
      </div>

      {/* Salary + basis */}
      {input.employmentStatus !== 'unemployed' && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">בסיס חישוב שכר</label>
            <select
              value={input.salaryBasis}
              onChange={(e) => update('salaryBasis', e.target.value as SalaryBasisPeriod)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="3months">ממוצע 3 חודשים אחרונים (מקובל)</option>
              <option value="12months">ממוצע 12 חודשים אחרונים</option>
              <option value="prewar">שכר לפני המלחמה</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                שכר ממוצע 3 חודשים (₪)
              </label>
              <input
                type="number"
                min={0}
                step={500}
                value={input.recentMonthlySalary}
                onChange={(e) => update('recentMonthlySalary', Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-lg font-semibold focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                תקרה: {RESERVE_PAY_2026.MONTHLY_CAP.toLocaleString('he-IL')} ₪/חודש
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                שכר ממוצע 12 חודשים (₪)
              </label>
              <input
                type="number"
                min={0}
                step={500}
                value={input.salary12Months ?? ''}
                onChange={(e) => update('salary12Months', Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Part-time */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              היקף משרה: {input.partTimePercent}%
            </label>
            <input
              type="range"
              min={10}
              max={100}
              step={5}
              value={input.partTimePercent}
              onChange={(e) => update('partTimePercent', Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>10%</span>
              <span>50%</span>
              <span>100% (משרה מלאה)</span>
            </div>
          </div>
        </>
      )}

      {/* Reserve Days */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">ימי מילואים</label>
          <input
            type="number"
            min={1}
            max={365}
            value={input.reserveDays}
            onChange={(e) => update('reserveDays', Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-lg font-semibold focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">תאריך תחילת שירות</label>
          <input
            type="date"
            value={input.serviceStartDate ?? ''}
            onChange={(e) => update('serviceStartDate', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Iron Swords */}
      <label className="flex items-start gap-3 p-3 bg-emerald-50 border-2 border-emerald-300 rounded-xl cursor-pointer hover:bg-emerald-100 transition">
        <input
          type="checkbox"
          checked={input.isIronSwordsService}
          onChange={(e) => update('isIronSwordsService', e.target.checked)}
          className="w-4 h-4 mt-0.5"
        />
        <div>
          <span className="text-sm font-bold text-emerald-900">שירות במסגרת חרבות ברזל (אחרי 7.10.2023)</span>
          <p className="text-xs text-emerald-700 mt-0.5">
            מזכה במענקים מיוחדים: {IRON_SWORDS_BONUSES.DAILY_GRANT} ₪/יום + {IRON_SWORDS_BONUSES.GENERAL_GRANT.toLocaleString('he-IL')} ₪ מענק כללי
          </p>
        </div>
      </label>

      {/* Combat Role */}
      {input.isIronSwordsService && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">תפקיד</label>
          <select
            value={input.combatRole}
            onChange={(e) => update('combatRole', e.target.value as CombatRole)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="none">לא קרבי / תומך לחימה</option>
            <option value="combat_support">תומך לחימה (עם תוספת חלקית)</option>
            <option value="combat">קרבי מלא</option>
          </select>
        </div>
      )}
    </div>
  );

  // ============================================================
  // Summary Cards (always visible)
  // ============================================================

  const SummaryCards = () => (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <ResultCard
        title="תגמול בסיסי כולל"
        value={formatCurrency(result.totalBasicPayment)}
        subtitle={`${formatCurrency(result.dailyPayment)}/יום × ${input.reserveDays} ימים`}
        variant="primary"
      />
      <ResultCard
        title={input.isIronSwordsService ? 'כולל מענקי חרבות ברזל' : 'סה"כ תגמולים'}
        value={formatCurrency(result.totalCompensation)}
        subtitle={
          input.isIronSwordsService
            ? `+ ${formatCurrency(result.warBonuses.totalDailyGrant)} מענק יומי`
            : `${input.reserveDays} ימי שירות`
        }
        variant="success"
      />
      <ResultCard
        title="כולל מענקים חד-פעמיים"
        value={formatCurrency(result.totalWithOneTimeGrants)}
        subtitle={
          result.warBonuses.generalGrant + result.warBonuses.returnToWorkGrant > 0
            ? `+ ${formatCurrency(result.warBonuses.generalGrant + result.warBonuses.returnToWorkGrant)} מענקים נוספים`
            : 'ללא מענקים חד-פעמיים'
        }
        variant={result.totalWithOneTimeGrants > result.totalCompensation ? 'success' : 'primary'}
      />
    </div>
  );

  // ============================================================
  // TAB: Basic Calculation
  // ============================================================

  const BasicTab = () => (
    <div className="space-y-4">
      <SharedInputs />

      {/* Key alerts */}
      {result.cappedAtMaximum && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-amber-900 text-sm">שכר מעל תקרת ב.ל.</p>
            <p className="text-xs text-amber-700 mt-1">
              התגמול מוגבל ל-{RESERVE_PAY_2026.DAILY_CAP.toLocaleString('he-IL')} ₪/יום (
              {RESERVE_PAY_2026.MONTHLY_CAP.toLocaleString('he-IL')} ₪/חודש). ההפרש לא מפוצה על ידי ב.ל.
            </p>
          </div>
        </div>
      )}

      {result.atMinimum && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex gap-3">
          <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-blue-900 text-sm">תגמול מינימום</p>
            <p className="text-xs text-blue-700 mt-1">
              קיבלת מינימום שכר מינימום יומי: {RESERVE_PAY_2026.MIN_DAILY} ₪/יום
            </p>
          </div>
        </div>
      )}

      {/* Breakdown */}
      <Breakdown
        title="פירוט חישוב תגמול בסיסי"
        defaultOpen={true}
        items={[
          {
            label: 'שכר חודשי בסיס',
            value: `${formatCurrency(input.employmentStatus === 'unemployed' ? RESERVE_PAY_2026.MIN_MONTHLY : input.recentMonthlySalary)}`,
            note: input.employmentStatus === 'unemployed' ? 'שכר מינימום' : `בסיס: ${input.salaryBasis === '3months' ? '3 חודשים' : input.salaryBasis === '12months' ? '12 חודשים' : 'לפני המלחמה'}`,
          },
          {
            label: 'שכר יומי (÷30)',
            value: formatCurrency(result.dailyPayment),
            note: result.cappedAtMaximum
              ? `מוגבל לתקרה (חושב: ${formatCurrency(input.recentMonthlySalary / 30)})`
              : undefined,
          },
          {
            label: `ימי מילואים`,
            value: `${input.reserveDays} ימים`,
          },
          {
            label: 'תשלום בסיסי כולל',
            value: formatCurrency(result.totalBasicPayment),
            bold: true,
          },
          ...(input.isIronSwordsService
            ? [
                {
                  label: `מענק יומי חרבות ברזל (${IRON_SWORDS_BONUSES.DAILY_GRANT} ₪ × ${input.reserveDays})`,
                  value: formatCurrency(result.warBonuses.totalDailyGrant),
                  note: 'פטור ממס',
                },
                {
                  label: 'סה"כ תגמולים (בסיס + מענק יומי)',
                  value: formatCurrency(result.totalCompensation),
                  bold: true,
                },
              ]
            : []),
        ]}
      />

      {/* Tax info */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 space-y-2">
        <h3 className="font-bold text-blue-900 text-sm">מיסוי תגמולי מילואים</h3>
        <ul className="text-xs text-blue-800 space-y-1">
          <li>• תגמול מילואים בסיסי — <strong>חייב במס הכנסה</strong> (כמו שכר רגיל)</li>
          <li>• מענק יומי חרבות ברזל (280 ₪/יום) — <strong>פטור ממס!</strong></li>
          <li>• מענק כללי (5,000 ₪) — <strong>פטור ממס!</strong></li>
          <li>• נקודת זיכוי מס: {RESERVE_PAY_2026.TAX_CREDIT_POINT_VALUE.toLocaleString('he-IL')} ₪ שנתי — <strong>בדוק החזר מס</strong></li>
        </ul>
      </div>

      {/* Notes */}
      {result.notes.length > 0 && (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
          <h3 className="font-semibold text-gray-900 text-sm mb-2">הערות והמלצות</h3>
          <div className="space-y-1">
            {(showAllNotes ? result.notes : result.notes.slice(0, 3)).map((note, i) => (
              <p key={i} className="text-xs text-gray-700">
                💡 {note}
              </p>
            ))}
          </div>
          {result.notes.length > 3 && (
            <button
              type="button"
              onClick={() => setShowAllNotes(!showAllNotes)}
              className="mt-2 text-xs text-blue-600 flex items-center gap-1"
            >
              {showAllNotes ? (
                <>הסתר <ChevronUp className="w-3 h-3" /></>
              ) : (
                <>הצג עוד {result.notes.length - 3} הערות <ChevronDown className="w-3 h-3" /></>
              )}
            </button>
          )}
        </div>
      )}
    </div>
  );

  // ============================================================
  // TAB: War Bonuses
  // ============================================================

  const WarBonusesTab = () => {
    const wb = result.warBonuses;

    const bonusBreakdownData = [
      { name: 'מענק כללי', value: wb.generalGrant, color: PIE_COLORS[0] },
      { name: 'מענק יומי', value: wb.totalDailyGrant, color: PIE_COLORS[1] },
      { name: 'חזרה לעבודה', value: wb.returnToWorkGrant, color: PIE_COLORS[2] },
      { name: 'תפקיד קרבי', value: wb.combatRoleGrant, color: PIE_COLORS[3] },
    ].filter((d) => d.value > 0);

    return (
      <div className="space-y-4">
        {/* Iron Swords toggle */}
        <div className="bg-white border-2 border-emerald-200 rounded-xl p-6 space-y-4">
          <h2 className="text-lg font-bold text-gray-900">הגדרות מענקי חרבות ברזל</h2>

          <label className="flex items-start gap-3 p-3 bg-emerald-50 border border-emerald-300 rounded-lg cursor-pointer">
            <input
              type="checkbox"
              checked={input.isIronSwordsService}
              onChange={(e) => update('isIronSwordsService', e.target.checked)}
              className="w-4 h-4 mt-0.5"
            />
            <div>
              <span className="text-sm font-bold text-emerald-900">שירות חרבות ברזל (7.10.2023 ואילך)</span>
              <p className="text-xs text-emerald-700 mt-0.5">מזכה בכל המענקים המפורטים למטה</p>
            </div>
          </label>

          {input.isIronSwordsService && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">תפקיד</label>
                <select
                  value={input.combatRole}
                  onChange={(e) => update('combatRole', e.target.value as CombatRole)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="none">לא קרבי</option>
                  <option value="combat_support">תומך לחימה</option>
                  <option value="combat">קרבי מלא (+{IRON_SWORDS_BONUSES.COMBAT_DAILY_BONUS} ₪/יום)</option>
                </select>
              </div>

              {input.employmentStatus === 'self-employed' && (
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={input.isSmallBusiness}
                    onChange={(e) => update('isSmallBusiness', e.target.checked)}
                    className="w-4 h-4 mt-0.5"
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-700">עסק קטן (עד 20 עובדים)</span>
                    <p className="text-xs text-gray-500">מזכה במענק עסק קטן עד {IRON_SWORDS_BONUSES.SMALL_BUSINESS_GRANT.toLocaleString('he-IL')} ₪</p>
                  </div>
                </label>
              )}
            </>
          )}
        </div>

        {/* Grants breakdown */}
        {input.isIronSwordsService ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* General grant */}
              <div className={`rounded-xl border-2 p-4 ${wb.generalGrant > 0 ? 'bg-emerald-50 border-emerald-200' : 'bg-gray-50 border-gray-200'}`}>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-bold text-gray-900">מענק כללי חרבות ברזל</p>
                    <p className="text-xs text-gray-600 mt-1">חד-פעמי לכל מי ששירת מאז 7.10.2023</p>
                    <p className="text-xs text-emerald-700 mt-1 font-medium">פטור ממס</p>
                  </div>
                  <p className={`text-xl font-bold ${wb.generalGrant > 0 ? 'text-emerald-700' : 'text-gray-400'}`}>
                    {formatCurrency(wb.generalGrant)}
                  </p>
                </div>
                {wb.generalGrant === 0 && (
                  <p className="text-xs text-red-600 mt-2">לא זכאי — נדרש לפחות יום שירות אחד</p>
                )}
              </div>

              {/* Daily grant */}
              <div className="rounded-xl border-2 bg-blue-50 border-blue-200 p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-bold text-gray-900">מענק יומי</p>
                    <p className="text-xs text-gray-600 mt-1">
                      {IRON_SWORDS_BONUSES.DAILY_GRANT} ₪/יום × {input.reserveDays} ימים
                    </p>
                    <p className="text-xs text-emerald-700 mt-1 font-medium">פטור ממס</p>
                  </div>
                  <p className="text-xl font-bold text-blue-700">{formatCurrency(wb.totalDailyGrant)}</p>
                </div>
              </div>

              {/* Return to work grant */}
              <div className={`rounded-xl border-2 p-4 ${wb.returnToWorkGrant > 0 ? 'bg-purple-50 border-purple-200' : 'bg-gray-50 border-gray-200'}`}>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-bold text-gray-900">מענק חזרה למקום עבודה</p>
                    <p className="text-xs text-gray-600 mt-1">
                      לשכירים עם 20+ ימי שירות
                    </p>
                    <p className="text-xs text-emerald-700 mt-1 font-medium">פטור ממס</p>
                  </div>
                  <p className={`text-xl font-bold ${wb.returnToWorkGrant > 0 ? 'text-purple-700' : 'text-gray-400'}`}>
                    {formatCurrency(wb.returnToWorkGrant)}
                  </p>
                </div>
                {wb.returnToWorkGrant === 0 && input.employmentStatus === 'employee' && input.reserveDays < 20 && (
                  <p className="text-xs text-amber-600 mt-2">
                    נדרשים {20 - input.reserveDays} ימים נוספים לזכאות
                  </p>
                )}
              </div>

              {/* Combat role grant */}
              <div className={`rounded-xl border-2 p-4 ${wb.combatRoleGrant > 0 ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-200'}`}>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-bold text-gray-900">מענק תפקיד קרבי</p>
                    <p className="text-xs text-gray-600 mt-1">
                      {input.combatRole === 'combat'
                        ? `${IRON_SWORDS_BONUSES.COMBAT_DAILY_BONUS} ₪/יום × ${input.reserveDays} ימים`
                        : input.combatRole === 'combat_support'
                        ? `${Math.round(IRON_SWORDS_BONUSES.COMBAT_DAILY_BONUS * 0.5)} ₪/יום × ${input.reserveDays} ימים`
                        : 'לא זכאי — נדרש תפקיד קרבי'}
                    </p>
                  </div>
                  <p className={`text-xl font-bold ${wb.combatRoleGrant > 0 ? 'text-red-700' : 'text-gray-400'}`}>
                    {formatCurrency(wb.combatRoleGrant)}
                  </p>
                </div>
              </div>
            </div>

            {/* Total + pie */}
            <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-gray-900">סיכום מענקים כולל</h3>
                <p className="text-2xl font-bold text-emerald-700">{formatCurrency(wb.totalGrants)}</p>
              </div>

              {bonusBreakdownData.length > 0 && (
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={bonusBreakdownData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                        label={({ name, percent }: { name?: string; percent?: number }) => `${name ?? ''} (${((percent ?? 0) * 100).toFixed(0)}%)`}
                        labelLine={false}
                      >
                        {bonusBreakdownData.map((entry, index) => (
                          <Cell key={index} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            {input.isSmallBusiness && input.employmentStatus === 'self-employed' && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
                <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-amber-900 text-sm">מענק עסק קטן</p>
                  <p className="text-xs text-amber-700 mt-1">
                    בתור עצמאי עם עסק קטן, ייתכן שמגיע לך מענק עסק קטן של עד{' '}
                    {IRON_SWORDS_BONUSES.SMALL_BUSINESS_GRANT.toLocaleString('he-IL')} ₪.
                    פנה למרכז השירות לעסקים קטנים ובינוניים.
                  </p>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 text-center text-gray-500">
            <p className="text-lg">סמן "שירות חרבות ברזל" לחישוב מענקים</p>
            <p className="text-sm mt-2">רלוונטי לשירות מאז 7.10.2023</p>
          </div>
        )}
      </div>
    );
  };

  // ============================================================
  // TAB: Employer Reimbursement
  // ============================================================

  const EmployerTab = () => {
    const er = result.employerReimbursement;

    return (
      <div className="space-y-4">
        <div className="bg-white border-2 border-gray-200 rounded-xl p-6 space-y-4">
          <h2 className="text-lg font-bold text-gray-900">הגדרות - יחסי מעסיק-עובד</h2>

          {input.employmentStatus === 'employee' ? (
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={input.employerContinuesPaying}
                onChange={(e) => update('employerContinuesPaying', e.target.checked)}
                className="w-4 h-4 mt-0.5"
              />
              <div>
                <span className="text-sm font-medium text-gray-700">
                  המעסיק ממשיך לשלם שכר רגיל בזמן המילואים
                </span>
                <p className="text-xs text-gray-500">
                  רוב המעסיקים עושים זאת ואז מקבלים החזר מב.ל. (אגרת מעסיק)
                </p>
              </div>
            </label>
          ) : (
            <p className="text-sm text-gray-500">
              {input.employmentStatus === 'self-employed'
                ? 'עצמאי — התגמול מועבר ישירות מב.ל.'
                : 'חסר תעסוקה — התגמול מועבר ישירות מב.ל.'}
            </p>
          )}
        </div>

        {/* Employer breakdown */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <p className="text-sm font-medium text-gray-700">שכר שהמעסיק שילם בתקופת המילואים</p>
            <p className="text-2xl font-bold text-blue-700 mt-1">
              {formatCurrency(er.employerPaidDuringService)}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {formatCurrency(input.recentMonthlySalary / 30)}/יום × {input.reserveDays} ימים
            </p>
          </div>

          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
            <p className="text-sm font-medium text-gray-700">החזר מב.ל. למעסיק</p>
            <p className="text-2xl font-bold text-emerald-700 mt-1">
              {formatCurrency(er.blReimbursementToEmployer)}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {formatCurrency(result.dailyPayment)}/יום × {input.reserveDays} ימים
            </p>
          </div>

          <div className={`rounded-xl border-2 p-4 ${er.netCostToEmployer > 0 ? 'bg-amber-50 border-amber-200' : 'bg-gray-50 border-gray-200'}`}>
            <p className="text-sm font-medium text-gray-700">עלות נטו למעסיק (לאחר החזר)</p>
            <p className={`text-2xl font-bold mt-1 ${er.netCostToEmployer > 0 ? 'text-amber-700' : 'text-gray-500'}`}>
              {formatCurrency(er.netCostToEmployer)}
            </p>
            {er.netCostToEmployer > 0 && (
              <p className="text-xs text-amber-600 mt-1">
                המעסיק משלם יותר ממה שמוחזר (שכר מעל תקרה)
              </p>
            )}
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
            <p className="text-sm font-medium text-gray-700">תשלום ישיר ב.ל. לעובד</p>
            <p className="text-2xl font-bold text-purple-700 mt-1">
              {formatCurrency(er.directBLPaymentToEmployee)}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {er.directBLPaymentToEmployee > 0
                ? 'ב.ל. משלם ישירות לעובד (מעסיק לא ממשיך לשלם)'
                : 'ב.ל. משלם למעסיק (מעסיק מעביר לעובד)'}
            </p>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <h3 className="font-bold text-blue-900 text-sm mb-2">כיצד עובד תהליך האגרת מעסיק?</h3>
          <ol className="text-xs text-blue-800 space-y-1 list-decimal list-inside">
            <li>המעסיק ממשיך לשלם לעובד שכר רגיל בתלוש</li>
            <li>המעסיק מגיש טופס 0512 לב.ל. (אגרת מעסיק)</li>
            <li>ב.ל. מחשב את תגמול המילואים ומחזיר למעסיק</li>
            <li>אם יש הפרש (שכר מעל תקרה) — עלות נטו למעסיק</li>
            <li>העובד מקבל את המענקים (280 ₪/יום) ישירות לחשבון הבנק</li>
          </ol>
        </div>
      </div>
    );
  };

  // ============================================================
  // TAB: Family Allowances
  // ============================================================

  const FamilyTab = () => {
    const fa = result.familyAllowances;

    return (
      <div className="space-y-4">
        <div className="bg-white border-2 border-gray-200 rounded-xl p-6 space-y-4">
          <h2 className="text-lg font-bold text-gray-900">הרכב המשפחה</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              מספר ילדים תלויים (עד גיל 14): {input.dependentChildren}
            </label>
            <input
              type="range"
              min={0}
              max={8}
              step={1}
              value={input.dependentChildren}
              onChange={(e) => update('dependentChildren', Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>0</span>
              <span>4</span>
              <span>8</span>
            </div>
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={input.hasSpouse}
              onChange={(e) => update('hasSpouse', e.target.checked)}
              className="w-4 h-4"
            />
            <span className="text-sm font-medium text-gray-700">יש בן/בת זוג</span>
          </label>

          {input.hasSpouse && (
            <label className="flex items-center gap-3 cursor-pointer mr-6">
              <input
                type="checkbox"
                checked={input.spouseWorks}
                onChange={(e) => update('spouseWorks', e.target.checked)}
                className="w-4 h-4"
              />
              <span className="text-sm font-medium text-gray-700">בן/בת זוג עובד/ת</span>
            </label>
          )}
        </div>

        {/* Eligibility notice */}
        {input.reserveDays < 30 && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-amber-800">
              קצבות משפחה מחייבות מינימום 30 ימי שירות. נותרו{' '}
              <strong>{30 - input.reserveDays} ימים</strong> לזכאות.
            </p>
          </div>
        )}

        {/* Family breakdown */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className={`rounded-xl border-2 p-4 ${fa.childAllowance > 0 ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'}`}>
            <p className="text-sm font-medium text-gray-700">קצבת ילדים</p>
            <p className={`text-2xl font-bold mt-1 ${fa.childAllowance > 0 ? 'text-blue-700' : 'text-gray-400'}`}>
              {formatCurrency(fa.childAllowance)}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {input.dependentChildren} ילדים × {30} ₪/יום × {input.reserveDays} ימים
            </p>
          </div>

          <div className={`rounded-xl border-2 p-4 ${fa.spouseAllowance > 0 ? 'bg-purple-50 border-purple-200' : 'bg-gray-50 border-gray-200'}`}>
            <p className="text-sm font-medium text-gray-700">קצבת בן/בת זוג לא עובד/ת</p>
            <p className={`text-2xl font-bold mt-1 ${fa.spouseAllowance > 0 ? 'text-purple-700' : 'text-gray-400'}`}>
              {formatCurrency(fa.spouseAllowance)}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {input.hasSpouse && !input.spouseWorks
                ? `45 ₪/יום × ${input.reserveDays} ימים`
                : 'לא זכאי'}
            </p>
          </div>
        </div>

        {fa.totalFamilyAllowances > 0 && (
          <div className="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-4">
            <div className="flex justify-between items-center">
              <p className="font-bold text-emerald-900">סה"כ קצבות משפחה</p>
              <p className="text-2xl font-bold text-emerald-700">{formatCurrency(fa.totalFamilyAllowances)}</p>
            </div>
            <p className="text-xs text-emerald-700 mt-1">{fa.note}</p>
          </div>
        )}
      </div>
    );
  };

  // ============================================================
  // TAB: Income Protection
  // ============================================================

  const IncomeProtectionTab = () => {
    const ilp = result.incomeLossProtection;

    return (
      <div className="space-y-4">
        <div className="bg-white border-2 border-gray-200 rounded-xl p-6 space-y-4">
          <h2 className="text-lg font-bold text-gray-900">השוואת הכנסה</h2>
          <p className="text-sm text-gray-600">
            כמה הכנסה תקבל מהמילואים לעומת שכר רגיל, ומה ההפרש הצפוי?
          </p>

          {input.employmentStatus !== 'unemployed' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                שכר לפני המלחמה / שכר רגיל (₪)
              </label>
              <input
                type="number"
                min={0}
                step={500}
                value={input.preWarSalary ?? input.recentMonthlySalary}
                onChange={(e) => update('preWarSalary', Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}
        </div>

        {/* Comparison cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
            <p className="text-sm font-medium text-gray-700">שכר רגיל לתקופה</p>
            <p className="text-2xl font-bold text-gray-800 mt-1">
              {formatCurrency(ilp.regularSalaryForPeriod)}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {formatCurrency(input.recentMonthlySalary / 30)}/יום × {input.reserveDays} ימים
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <p className="text-sm font-medium text-gray-700">תגמולי מילואים (בסיסי)</p>
            <p className="text-2xl font-bold text-blue-700 mt-1">
              {formatCurrency(ilp.reservePayForPeriod)}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {formatCurrency(result.dailyPayment)}/יום × {input.reserveDays} ימים
            </p>
          </div>

          <div className={`rounded-xl border-2 p-4 ${ilp.hasIncomeLoss ? 'bg-red-50 border-red-200' : 'bg-emerald-50 border-emerald-200'}`}>
            <p className="text-sm font-medium text-gray-700">הפרש</p>
            <p className={`text-2xl font-bold mt-1 ${ilp.hasIncomeLoss ? 'text-red-700' : 'text-emerald-700'}`}>
              {ilp.incomeDifference >= 0 ? '+' : ''}{formatCurrency(ilp.incomeDifference)}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              פיצוי: {ilp.compensationPercent.toFixed(0)}% מהשכר הרגיל
            </p>
          </div>
        </div>

        {/* With war bonuses */}
        {input.isIronSwordsService && (
          <div className="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-4">
            <h3 className="font-bold text-emerald-900 text-sm mb-3">כולל מענקי חרבות ברזל</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-600">תגמול יומי + מענק יומי</p>
                <p className="text-xl font-bold text-emerald-700">
                  {formatCurrency(result.dailyPayment + IRON_SWORDS_BONUSES.DAILY_GRANT)}/יום
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600">סך הכל לתקופה</p>
                <p className="text-xl font-bold text-emerald-700">
                  {formatCurrency(result.totalCompensation)}
                </p>
              </div>
            </div>
            {result.warBonuses.generalGrant > 0 && (
              <p className="text-xs text-emerald-700 mt-2">
                + מענקים חד-פעמיים: {formatCurrency(result.warBonuses.generalGrant + result.warBonuses.returnToWorkGrant)}
              </p>
            )}
          </div>
        )}

        {ilp.hasIncomeLoss && !input.employerContinuesPaying && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-amber-900 text-sm">פגיעה בהכנסה</p>
              <p className="text-xs text-amber-700 mt-1">
                תגמולי המילואים מפצים {ilp.compensationPercent.toFixed(0)}% מהשכר הרגיל.
                אם המעסיק ממשיך לשלם — לחץ על "המעסיק ממשיך לשלם" בטאב החזר מעסיק.
              </p>
            </div>
          </div>
        )}

        {/* Tax credit */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <h3 className="font-bold text-blue-900 text-sm mb-2">נקודת זיכוי מס שנתית</h3>
          <div className="flex justify-between items-center">
            <p className="text-xs text-blue-700">
              כל משרת מילואים פעיל זכאי לנקודת זיכוי מס שנתית
            </p>
            <p className="text-xl font-bold text-blue-700">
              {formatCurrency(result.taxCreditValue)}
            </p>
          </div>
          <p className="text-xs text-blue-600 mt-1">שווה לבדוק החזר מס לשנים אחורה!</p>
        </div>
      </div>
    );
  };

  // ============================================================
  // TAB: Timeline / Chart
  // ============================================================

  const TimelineTab = () => {
    const { monthlyProjection } = result;

    const chartData = monthlyProjection.map((m) => ({
      name: m.month,
      תשלום_בסיסי: Math.round(m.basicPay),
      מענק_יומי: Math.round(m.warBonus),
      total: Math.round(m.total),
    }));

    // Annual projection data
    const annualDays = Math.min(input.reserveDays, 100); // assume max ~100 days/year
    const annualBasic = result.dailyPayment * annualDays;
    const annualWarBonus = input.isIronSwordsService ? IRON_SWORDS_BONUSES.DAILY_GRANT * annualDays : 0;

    const annualData = [
      { name: 'תגמול בסיסי שנתי', value: annualBasic, color: PIE_COLORS[0] },
      { name: 'מענק יומי שנתי', value: annualWarBonus, color: PIE_COLORS[1] },
      { name: 'מענקים חד-פעמיים', value: result.warBonuses.generalGrant + result.warBonuses.returnToWorkGrant, color: PIE_COLORS[2] },
      { name: 'קצבות משפחה', value: result.familyAllowances.totalFamilyAllowances, color: PIE_COLORS[3] },
    ].filter((d) => d.value > 0);

    return (
      <div className="space-y-4">
        <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-1">לוח תשלומים חודשי</h2>
          <p className="text-sm text-gray-500 mb-4">
            {input.serviceStartDate ? 'לפי תאריך תחילת שירות' : 'חלוקה שווה על 3 חודשים (הכנס תאריך לחישוב מדויק)'}
          </p>

          {chartData.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fontFamily: 'inherit' }} />
                  <YAxis
                    tickFormatter={(v) => `₪${(v / 1000).toFixed(0)}K`}
                    tick={{ fontSize: 11 }}
                  />
                  <Tooltip
                    formatter={(value, name) => [formatCurrency(Number(value)), String(name).replace(/_/g, ' ')]}
                  />
                  <Legend
                    formatter={(value) => value.replace(/_/g, ' ')}
                    wrapperStyle={{ fontSize: 12 }}
                  />
                  <Bar dataKey="תשלום_בסיסי" fill="#3b82f6" name="תשלום_בסיסי" />
                  {input.isIronSwordsService && (
                    <Bar dataKey="מענק_יומי" fill="#10b981" name="מענק_יומי" />
                  )}
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-gray-400 text-center py-8">אין נתונים להצגה</p>
          )}
        </div>

        {/* Monthly detail table */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-right px-4 py-3 font-semibold text-gray-700">חודש</th>
                <th className="text-right px-4 py-3 font-semibold text-gray-700">ימים</th>
                <th className="text-right px-4 py-3 font-semibold text-gray-700">תשלום בסיסי</th>
                {input.isIronSwordsService && (
                  <th className="text-right px-4 py-3 font-semibold text-gray-700">מענק יומי</th>
                )}
                <th className="text-right px-4 py-3 font-semibold text-gray-700">סה"כ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {monthlyProjection.map((m, i) => (
                <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-4 py-3 text-gray-800">{m.month}</td>
                  <td className="px-4 py-3 text-gray-600">{m.reserveDays}</td>
                  <td className="px-4 py-3 text-blue-700 font-medium">{formatCurrency(m.basicPay)}</td>
                  {input.isIronSwordsService && (
                    <td className="px-4 py-3 text-emerald-700 font-medium">{formatCurrency(m.warBonus)}</td>
                  )}
                  <td className="px-4 py-3 font-bold text-gray-900">{formatCurrency(m.total)}</td>
                </tr>
              ))}
              {/* Totals row */}
              <tr className="bg-blue-50 font-bold">
                <td className="px-4 py-3 text-gray-900">סה"כ</td>
                <td className="px-4 py-3 text-gray-900">{input.reserveDays}</td>
                <td className="px-4 py-3 text-blue-700">{formatCurrency(result.totalBasicPayment)}</td>
                {input.isIronSwordsService && (
                  <td className="px-4 py-3 text-emerald-700">{formatCurrency(result.warBonuses.totalDailyGrant)}</td>
                )}
                <td className="px-4 py-3 text-gray-900">{formatCurrency(result.totalCompensation)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Annual breakdown pie */}
        {annualData.length > 1 && (
          <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
            <h3 className="font-bold text-gray-900 mb-4">הרכב ההכנסה מהמילואים</h3>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={annualData}
                    cx="50%"
                    cy="50%"
                    outerRadius={85}
                    dataKey="value"
                    label={({ name, percent }: { name?: string; percent?: number }) => `${name ?? ''} ${((percent ?? 0) * 100).toFixed(0)}%`}
                    labelLine={true}
                  >
                    {annualData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    );
  };

  // ============================================================
  // Render
  // ============================================================

  const tabContent: Record<TabMode, React.ReactNode> = {
    basic: <BasicTab />,
    war_bonuses: <WarBonusesTab />,
    employer: <EmployerTab />,
    family: <FamilyTab />,
    income_protection: <IncomeProtectionTab />,
    timeline: <TimelineTab />,
  };

  return (
    <div className="space-y-6">
      {/* Summary cards — always visible */}
      <SummaryCards />

      {/* Tabs */}
      <div className="border-b border-gray-200 overflow-x-auto">
        <nav className="flex gap-1 min-w-max">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab content */}
      <div>{tabContent[activeTab]}</div>
    </div>
  );
}
