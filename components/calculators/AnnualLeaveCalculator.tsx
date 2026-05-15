'use client';

import { useState, useMemo } from 'react';
import {
  calculateAnnualLeaveFull,
  calculateRedemption,
  calculateAccumulation,
  calculatePartialYear,
  getVacationDaysByTenure,
} from '@/lib/calculators/employee-benefits';
import { formatCurrency } from '@/lib/utils/formatters';
import { ResultCard } from '@/components/calculator/ResultCard';
import { Breakdown } from '@/components/calculator/Breakdown';
import { ChevronDown, ChevronUp, AlertCircle, Info } from 'lucide-react';

// ============================
// Types & Constants
// ============================

type TabMode = 'entitlement' | 'balance' | 'redemption' | 'termination';

const TABS: { id: TabMode; label: string; emoji: string }[] = [
  { id: 'entitlement', label: 'כמה מגיע לי?', emoji: '📋' },
  { id: 'balance', label: 'יתרה וצבירה', emoji: '📊' },
  { id: 'redemption', label: 'פדיון חופשה', emoji: '💰' },
  { id: 'termination', label: 'עזיבה היום', emoji: '🚪' },
];

// ============================
// Main Calculator
// ============================

export function AnnualLeaveCalculator() {
  const [activeTab, setActiveTab] = useState<TabMode>('entitlement');
  const [showTenureTable, setShowTenureTable] = useState(false);

  // --- Shared state ---
  const [yearsOfService, setYearsOfService] = useState(5);
  const [additionalMonths, setAdditionalMonths] = useState(0);
  const [workDays, setWorkDays] = useState<5 | 6>(5);
  const [partTime, setPartTime] = useState(100);
  const [monthlySalary, setMonthlySalary] = useState(12000);

  // --- Entitlement tab ---
  // (uses shared state only)

  // --- Balance tab ---
  const [daysUsedThisYear, setDaysUsedThisYear] = useState(5);
  const [daysUsedLastYear, setDaysUsedLastYear] = useState(0);

  // --- Redemption tab ---
  const [accumulatedDaysRed, setAccumulatedDaysRed] = useState(20);

  // --- Termination tab ---
  const [monthsWorkedCurrent, setMonthsWorkedCurrent] = useState(8);
  const [totalDaysUsedEver, setTotalDaysUsedEver] = useState(10);

  // ============================
  // Computations
  // ============================

  const entitlementResult = useMemo(
    () =>
      calculateAnnualLeaveFull({
        yearsOfService,
        additionalMonths,
        workDaysPerWeek: workDays,
        partTimePercent: partTime,
        monthlySalary,
        daysUsedThisYear: 0,
        daysUsedLastYear: 0,
        isTermination: false,
      }),
    [yearsOfService, additionalMonths, workDays, partTime, monthlySalary],
  );

  const balanceResult = useMemo(
    () =>
      calculateAnnualLeaveFull({
        yearsOfService,
        additionalMonths,
        workDaysPerWeek: workDays,
        partTimePercent: partTime,
        monthlySalary,
        daysUsedThisYear,
        daysUsedLastYear,
        isTermination: false,
      }),
    [yearsOfService, additionalMonths, workDays, partTime, monthlySalary, daysUsedThisYear, daysUsedLastYear],
  );

  const accumulationResult = useMemo(
    () =>
      calculateAccumulation({
        yearsOfService,
        workDaysPerWeek: workDays,
        totalDaysUsed: totalDaysUsedEver,
        partTimePercent: partTime,
      }),
    [yearsOfService, workDays, totalDaysUsedEver, partTime],
  );

  const redemptionResult = useMemo(
    () =>
      calculateRedemption({
        accumulatedDays: accumulatedDaysRed,
        monthlySalary,
        workDaysPerWeek: workDays,
      }),
    [accumulatedDaysRed, monthlySalary, workDays],
  );

  const partialYearResult = useMemo(
    () =>
      calculatePartialYear({
        monthsWorked: monthsWorkedCurrent,
        yearsOfService,
        workDaysPerWeek: workDays,
        partTimePercent: partTime,
      }),
    [monthsWorkedCurrent, yearsOfService, workDays, partTime],
  );

  const terminationResult = useMemo(
    () =>
      calculateAnnualLeaveFull({
        yearsOfService,
        additionalMonths: monthsWorkedCurrent,
        workDaysPerWeek: workDays,
        partTimePercent: partTime,
        monthlySalary,
        daysUsedThisYear: totalDaysUsedEver,
        daysUsedLastYear: 0,
        isTermination: true,
      }),
    [yearsOfService, monthsWorkedCurrent, workDays, partTime, monthlySalary, totalDaysUsedEver],
  );

  // ============================
  // Tenure table data
  // ============================
  const tenureTableData = useMemo(() => {
    const rows: { tenure: string; days5: number; days6: number }[] = [
      { tenure: '1-4 שנים', days5: 12, days6: 14 },
      { tenure: '5', days5: 15, days6: 16 },
      { tenure: '6', days5: 16, days6: 18 },
      { tenure: '7', days5: 17, days6: 21 },
      { tenure: '8-9', days5: 18, days6: 22 },
      { tenure: '10', days5: 19, days6: 22 },
      { tenure: '11', days5: 20, days6: 23 },
      { tenure: '12', days5: 21, days6: 24 },
      { tenure: '13', days5: 22, days6: 26 },
      { tenure: '14+', days5: 23, days6: 28 },
    ];
    return rows;
  }, []);

  // ============================
  // Shared inputs section
  // ============================
  const SharedInputs = () => (
    <div className="bg-white border-2 border-gray-200 rounded-xl p-6 space-y-5">
      <h2 className="text-lg font-bold text-gray-900">פרטי ההעסקה</h2>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            שנות וותק
          </label>
          <input
            type="number"
            min={0}
            max={50}
            value={yearsOfService}
            onChange={(e) => setYearsOfService(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg font-semibold"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            חודשים נוספים
          </label>
          <select
            value={additionalMonths}
            onChange={(e) => setAdditionalMonths(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i} value={i}>{i === 0 ? 'אין' : `${i} חודשים`}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            ימי עבודה בשבוע
          </label>
          <select
            value={workDays}
            onChange={(e) => setWorkDays(Number(e.target.value) as 5 | 6)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value={5}>5 ימים (משרה רגילה)</option>
            <option value={6}>6 ימים (שישי עבודה)</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            היקף משרה (%)
          </label>
          <div className="flex items-center gap-2">
            <input
              type="range"
              min={10}
              max={100}
              step={5}
              value={partTime}
              onChange={(e) => setPartTime(Number(e.target.value))}
              className="flex-1"
            />
            <span className="text-sm font-semibold text-blue-700 w-10 text-center">{partTime}%</span>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          שכר חודשי ברוטו (₪)
          <span className="text-xs text-gray-500 mr-2">לחישוב ערך יום וסכום פדיון</span>
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
            ערך יום חופשה: {formatCurrency(monthlySalary / (workDays === 5 ? 21.67 : 25), { decimals: 0 })}
          </p>
        )}
      </div>
    </div>
  );

  // ============================
  // Tenure table widget
  // ============================
  const TenureTableWidget = () => (
    <div className="bg-blue-50 border border-blue-200 rounded-xl overflow-hidden">
      <button
        type="button"
        onClick={() => setShowTenureTable(!showTenureTable)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-blue-100 transition"
      >
        <span className="text-sm font-medium text-blue-900">
          טבלת ימי חופשה לפי וותק (לפי חוק 2026)
        </span>
        {showTenureTable ? (
          <ChevronUp className="w-4 h-4 text-blue-700" />
        ) : (
          <ChevronDown className="w-4 h-4 text-blue-700" />
        )}
      </button>
      {showTenureTable && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-blue-100">
                <th className="px-3 py-2 text-right font-semibold text-blue-900">וותק</th>
                <th className="px-3 py-2 text-center font-semibold text-blue-900">5 ימים</th>
                <th className="px-3 py-2 text-center font-semibold text-blue-900">6 ימים</th>
              </tr>
            </thead>
            <tbody>
              {tenureTableData.map((row, i) => {
                const isHighlighted =
                  (yearsOfService <= 4 && row.tenure === '1-4 שנים') ||
                  (yearsOfService >= 14 && row.tenure === '14+') ||
                  (yearsOfService.toString() === row.tenure);
                return (
                  <tr
                    key={i}
                    className={isHighlighted ? 'bg-emerald-100 font-bold' : i % 2 === 0 ? 'bg-white' : 'bg-blue-50'}
                  >
                    <td className="px-3 py-2 text-right text-gray-800">
                      {row.tenure}
                      {isHighlighted && <span className="mr-1 text-emerald-700"> ◀ אתה כאן</span>}
                    </td>
                    <td className="px-3 py-2 text-center text-gray-700">{row.days5}</td>
                    <td className="px-3 py-2 text-center text-gray-700">{row.days6}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <p className="text-xs text-blue-700 px-3 py-2">
            מקור: חוק חופשה שנתית תשי"א-1951, סעיף 3 | עדכון 2026
          </p>
        </div>
      )}
    </div>
  );

  // ============================
  // Progress Bar Component
  // ============================
  const VacationProgressBar = ({
    entitled,
    used,
    forfeitable = 0,
  }: {
    entitled: number;
    used: number;
    forfeitable?: number;
  }) => {
    const total = Math.max(entitled + forfeitable, 1);
    const usedPct = Math.min(100, (used / total) * 100);
    const availablePct = Math.min(100 - usedPct, (Math.max(0, entitled - used) / total) * 100);
    const forfeitablePct = Math.min(100 - usedPct - availablePct, (forfeitable / total) * 100);

    return (
      <div className="space-y-2">
        <div className="flex h-8 rounded-lg overflow-hidden border border-gray-200">
          <div
            className="bg-blue-500 flex items-center justify-center text-white text-xs font-medium transition-all"
            style={{ width: `${usedPct}%` }}
          >
            {usedPct > 10 && `${Math.round(usedPct)}%`}
          </div>
          <div
            className="bg-emerald-400 flex items-center justify-center text-white text-xs font-medium transition-all"
            style={{ width: `${availablePct}%` }}
          >
            {availablePct > 10 && `${Math.round(availablePct)}%`}
          </div>
          {forfeitablePct > 0 && (
            <div
              className="bg-amber-400 flex items-center justify-center text-white text-xs font-medium transition-all"
              style={{ width: `${forfeitablePct}%` }}
            >
              {forfeitablePct > 10 && `${Math.round(forfeitablePct)}%`}
            </div>
          )}
        </div>
        <div className="flex flex-wrap gap-3 text-xs">
          <span className="flex items-center gap-1">
            <span className="inline-block w-3 h-3 rounded bg-blue-500" />
            נוצל ({used.toFixed(1)} ימים)
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block w-3 h-3 rounded bg-emerald-400" />
            זמין ({Math.max(0, entitled - used).toFixed(1)} ימים)
          </span>
          {forfeitable > 0 && (
            <span className="flex items-center gap-1">
              <span className="inline-block w-3 h-3 rounded bg-amber-400" />
              בסכנת אובדן ({forfeitable.toFixed(1)} ימים)
            </span>
          )}
        </div>
      </div>
    );
  };

  // ============================
  // Recommendations display
  // ============================
  const Recommendations = ({ items }: { items: string[] }) => {
    if (items.length === 0) return null;
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-2">
        <h4 className="text-sm font-bold text-amber-900 flex items-center gap-2">
          <Info className="w-4 h-4" />
          המלצות
        </h4>
        <ul className="space-y-1.5">
          {items.map((rec, i) => (
            <li key={i} className="text-sm text-amber-900 flex gap-2">
              <span className="flex-shrink-0">💡</span>
              <span>{rec}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  // ============================
  // TAB: Entitlement
  // ============================
  const EntitlementTab = () => (
    <div className="space-y-4">
      <SharedInputs />
      <TenureTableWidget />

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <ResultCard
          title="ימי חופשה שנתיים (לפי חוק)"
          value={`${entitlementResult.annualEntitlement} ימים`}
          subtitle={`${yearsOfService} שנות וותק • ${workDays} ימים/שבוע`}
          variant="success"
        />
        {partTime < 100 && (
          <ResultCard
            title={`זכאות מותאמת (${partTime}% משרה)`}
            value={`${entitlementResult.adjustedEntitlement} ימים`}
            subtitle="לפי היקף משרה"
            variant="primary"
          />
        )}
        {monthlySalary > 0 && (
          <ResultCard
            title="ערך יום חופשה"
            value={formatCurrency(entitlementResult.dailyWageValue, { decimals: 0 })}
            subtitle={`שכר ${formatCurrency(monthlySalary)} / ${workDays === 5 ? '21.67' : '25'} ימים`}
            variant="primary"
          />
        )}
      </div>

      {additionalMonths > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <h4 className="text-sm font-bold text-blue-900 mb-2">זכאות יחסית לשנה הנוכחית</h4>
          <p className="text-2xl font-bold text-blue-700">
            {entitlementResult.proRatedCurrentYear} ימים
          </p>
          <p className="text-xs text-blue-700 mt-1">
            {entitlementResult.annualEntitlement} ימים × {additionalMonths}/12 חודשים
            {partTime < 100 ? ` × ${partTime}%` : ''}
          </p>
        </div>
      )}

      <Breakdown
        title="פירוט חישוב הזכאות"
        defaultOpen
        items={[
          {
            label: 'וותק במקום העבודה',
            value: `${yearsOfService} שנים${additionalMonths > 0 ? ` + ${additionalMonths} חודשים` : ''}`,
          },
          { label: 'ימי עבודה בשבוע', value: `${workDays} ימים` },
          { label: 'היקף משרה', value: `${partTime}%` },
          {
            label: 'ימי חופשה שנתיים (חוק)',
            value: `${entitlementResult.annualEntitlement} ימים`,
          },
          ...(partTime < 100
            ? [{ label: `זכאות מותאמת (${partTime}%)`, value: `${entitlementResult.adjustedEntitlement} ימים` }]
            : []),
          ...(monthlySalary > 0
            ? [
                {
                  label: 'ערך יום חופשה',
                  value: formatCurrency(entitlementResult.dailyWageValue, { decimals: 0 }),
                  note: `שכר ${formatCurrency(monthlySalary)} / ${workDays === 5 ? '21.67' : '25'} ימי עבודה`,
                },
                {
                  label: 'שווי חופשה שנתית',
                  value: formatCurrency(entitlementResult.adjustedEntitlement * entitlementResult.dailyWageValue, { decimals: 0 }),
                  bold: true,
                },
              ]
            : []),
        ]}
      />

      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
        <h4 className="text-sm font-bold text-gray-800 mb-2">חשוב לדעת</h4>
        <ul className="text-xs text-gray-700 space-y-1.5">
          <li>• המעסיק <strong>חייב</strong> לאפשר לפחות <strong>7 ימים רצופים</strong> בשנה</li>
          <li>• המעסיק קובע את המועד, אך חייב להודיע <strong>14 יום מראש</strong></li>
          <li>• חופשת מחלה, לידה ומילואים <strong>אינן</strong> נחשבות לימי חופשה</li>
          <li>• הסכם קיבוצי או אישי יכול לתת <strong>יותר ימים</strong> מהחוק — אך לא פחות</li>
          <li>• החוק חל לאחר <strong>75 ימי עבודה</strong> בפועל אצל אותו מעסיק</li>
        </ul>
      </div>
    </div>
  );

  // ============================
  // TAB: Balance & Accumulation
  // ============================
  const BalanceTab = () => (
    <div className="space-y-4">
      <SharedInputs />

      <div className="bg-white border-2 border-gray-200 rounded-xl p-6 space-y-4">
        <h3 className="font-bold text-gray-900">ניצול חופשה</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ימים שניצלת השנה
            </label>
            <input
              type="number"
              min={0}
              max={60}
              step={0.5}
              value={daysUsedThisYear}
              onChange={(e) => setDaysUsedThisYear(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              יתרה שנה שעברה (ימים)
            </label>
            <input
              type="number"
              min={0}
              max={60}
              step={0.5}
              value={daysUsedLastYear}
              onChange={(e) => setDaysUsedLastYear(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">ימי חופשה שנשארו מהשנה הקודמת</p>
          </div>
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <ResultCard
          title="זכאות שנה נוכחית"
          value={`${balanceResult.proRatedCurrentYear} ימים`}
          subtitle={balanceResult.tenureBasis}
          variant="success"
        />
        <ResultCard
          title="יתרה לניצול"
          value={`${balanceResult.remainingDays.toFixed(1)} ימים`}
          subtitle={`ניצלת ${daysUsedThisYear} ימים מתוך ${balanceResult.proRatedCurrentYear}`}
          variant="primary"
        />
        {balanceResult.forfeitableDays > 0 ? (
          <ResultCard
            title="ימים בסכנת אובדן"
            value={`${balanceResult.forfeitableDays.toFixed(1)} ימים`}
            subtitle="מהשנה הקודמת — עלולים לאבד!"
            variant="warning"
          />
        ) : (
          <ResultCard
            title="ימים בסכנת אובדן"
            value="אין"
            subtitle="כל הימים בטוחים"
            variant="success"
          />
        )}
      </div>

      <div className="bg-white border-2 border-gray-200 rounded-xl p-5">
        <h3 className="font-bold text-gray-900 mb-4">מצב חופשה — שנה נוכחית</h3>
        <VacationProgressBar
          entitled={balanceResult.proRatedCurrentYear}
          used={daysUsedThisYear}
          forfeitable={balanceResult.forfeitableDays}
        />
      </div>

      {balanceResult.forfeitableDays > 0 && (
        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 flex gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-red-900 mb-1">אזהרה: ימים עלולים לאבד!</h4>
            <p className="text-sm text-red-800">
              יש לך {balanceResult.forfeitableDays.toFixed(1)} ימים שנותרו מהשנה הקודמת.
              לפי חוק חופשה שנתית, ניתן לצבור עד שנתיים חופשה בלבד — ימים מעבר לכך עלולים לאבד.
              המעסיק יכול לחייב ניצול. פנה למנהל/ת לתכנון חופשה בהקדם.
            </p>
          </div>
        </div>
      )}

      {/* Accumulation breakdown */}
      <div className="bg-white border-2 border-gray-200 rounded-xl p-5">
        <h3 className="font-bold text-gray-900 mb-4">היסטוריית צבירה ({yearsOfService} שנים)</h3>
        <div className="grid sm:grid-cols-3 gap-4 mb-4">
          <div className="text-center bg-emerald-50 rounded-lg p-3">
            <p className="text-2xl font-bold text-emerald-700">{accumulationResult.totalAccumulated}</p>
            <p className="text-xs text-emerald-700">סך ימים שנצברו</p>
          </div>
          <div className="text-center bg-blue-50 rounded-lg p-3">
            <p className="text-2xl font-bold text-blue-700">{accumulationResult.totalUsed}</p>
            <p className="text-xs text-blue-700">ימים שנוצלו</p>
          </div>
          <div className="text-center bg-amber-50 rounded-lg p-3">
            <p className="text-2xl font-bold text-amber-700">{accumulationResult.balance}</p>
            <p className="text-xs text-amber-700">יתרה כוללת</p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            סך ימי חופשה שניצלת לאורך כל הוותק
          </label>
          <input
            type="number"
            min={0}
            max={500}
            value={totalDaysUsedEver}
            onChange={(e) => setTotalDaysUsedEver(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {accumulationResult.yearlyBreakdown.length > 0 && (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-3 py-2 text-right font-medium text-gray-600">שנה</th>
                  <th className="px-3 py-2 text-center font-medium text-gray-600">זכאות</th>
                  <th className="px-3 py-2 text-center font-medium text-gray-600">ניצול</th>
                  <th className="px-3 py-2 text-center font-medium text-gray-600">יתרה</th>
                  <th className="px-3 py-2 text-center font-medium text-gray-600">בסכנה</th>
                </tr>
              </thead>
              <tbody>
                {accumulationResult.yearlyBreakdown.map((row) => (
                  <tr
                    key={row.year}
                    className={`border-t border-gray-100 ${row.forfeitable > 0 ? 'bg-amber-50' : ''}`}
                  >
                    <td className="px-3 py-2 text-right text-gray-800">שנה {row.year}</td>
                    <td className="px-3 py-2 text-center text-emerald-700">{row.entitled}</td>
                    <td className="px-3 py-2 text-center text-blue-700">{row.used}</td>
                    <td className="px-3 py-2 text-center font-medium">{row.balance}</td>
                    <td className="px-3 py-2 text-center">
                      {row.forfeitable > 0 ? (
                        <span className="text-amber-700 font-medium">{row.forfeitable}</span>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Recommendations items={balanceResult.recommendations} />
    </div>
  );

  // ============================
  // TAB: Redemption
  // ============================
  const RedemptionTab = () => (
    <div className="space-y-4">
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <h3 className="font-bold text-blue-900 mb-1">מה זה פדיון חופשה?</h3>
        <p className="text-sm text-blue-800">
          בעת <strong>סיום עבודה</strong> (פיטורים, התפטרות, פרישה), המעסיק חייב לפדות בכסף
          את כל ימי החופשה שלא נוצלו. הסכום מחושב לפי <strong>השכר האחרון</strong>.
          לפי פסיקה (ע"ע 31579-09-15) — הפדיון כולל גם הפרשות סוציאליות.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white border-2 border-gray-200 rounded-xl p-6 space-y-4">
          <h3 className="font-bold text-gray-900">פרטי החישוב</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ימי חופשה צבורים לפדיון
            </label>
            <input
              type="number"
              min={0}
              max={200}
              step={0.5}
              value={accumulatedDaysRed}
              onChange={(e) => setAccumulatedDaysRed(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg font-semibold"
            />
            <p className="text-xs text-gray-500 mt-1">כמה ימי חופשה לא נוצלו שמגיעים לך בעת הסיום</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              שכר חודשי ברוטו אחרון (₪)
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ימי עבודה בשבוע
            </label>
            <select
              value={workDays}
              onChange={(e) => setWorkDays(Number(e.target.value) as 5 | 6)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value={5}>5 ימים</option>
              <option value={6}>6 ימים</option>
            </select>
          </div>
        </div>

        <div className="space-y-4">
          <ResultCard
            title="סכום פדיון חופשה"
            value={formatCurrency(redemptionResult.totalRedemption, { decimals: 0 })}
            subtitle={redemptionResult.explanation}
            variant="success"
          />
          <ResultCard
            title="ערך יום חופשה"
            value={formatCurrency(redemptionResult.dailyWage, { decimals: 0 })}
            subtitle={`שכר ${formatCurrency(monthlySalary)} / ${workDays === 5 ? '21.67' : '25'} ימים`}
            variant="primary"
          />
        </div>
      </div>

      <Breakdown
        title="פירוט חישוב הפדיון"
        defaultOpen
        items={[
          { label: 'ימים לפדיון', value: `${redemptionResult.daysToRedeem.toFixed(1)} ימים` },
          {
            label: 'שכר חודשי ברוטו',
            value: formatCurrency(monthlySalary),
          },
          {
            label: 'ימי עבודה ממוצע בחודש',
            value: workDays === 5 ? '21.67' : '25',
            note: workDays === 5 ? '5 ימי עבודה' : '6 ימי עבודה',
          },
          {
            label: 'ערך יום עבודה',
            value: formatCurrency(redemptionResult.dailyWage, { decimals: 2 }),
          },
          {
            label: 'סכום פדיון',
            value: formatCurrency(redemptionResult.totalRedemption, { decimals: 0 }),
            bold: true,
          },
        ]}
      />

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-2">
        <h4 className="text-sm font-bold text-amber-900">חשוב לדעת על פדיון חופשה</h4>
        <ul className="text-xs text-amber-900 space-y-1.5">
          <li>• <strong>מגיע לך בעת כל סיום עבודה</strong> — פיטורים, התפטרות, פרישה.</li>
          <li>• <strong>במהלך עבודה</strong> — פדיון חופשה אסור (מטרת החוק היא שתצא לחופשה).</li>
          <li>• <strong>הפדיון כולל רכיבים סוציאליים</strong> (פנסיה, קרן השתלמות) לפי פסיקה עדכנית.</li>
          <li>• <strong>תקרת התביעה</strong>: ניתן לתבוע עד 3 שנים אחורה (התיישנות מיוחדת).</li>
          <li>• <strong>חוזה שנותן יותר ימים</strong>: אם החוזה נותן 25 ימים אך החוק 23 — מגיע לך 25.</li>
        </ul>
      </div>
    </div>
  );

  // ============================
  // TAB: Termination Scenario
  // ============================
  const TerminationTab = () => (
    <div className="space-y-4">
      <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-6 space-y-5">
        <h2 className="text-lg font-bold text-gray-900">אם עזבתי/עוזב/ת היום</h2>
        <p className="text-sm text-gray-600">
          מחשבון זה מחשב כמה ימי חופשה מגיעים לך בעת עזיבה — כולל החודשים שעבדת בשנה הנוכחית + כל הצבירה הקודמת.
        </p>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              שנות וותק שלמות
            </label>
            <input
              type="number"
              min={0}
              max={50}
              value={yearsOfService}
              onChange={(e) => setYearsOfService(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              חודשים בשנה הנוכחית
            </label>
            <select
              value={monthsWorkedCurrent}
              onChange={(e) => setMonthsWorkedCurrent(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                <option key={m} value={m}>{m} חודשים</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ימי עבודה בשבוע
            </label>
            <select
              value={workDays}
              onChange={(e) => setWorkDays(Number(e.target.value) as 5 | 6)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value={5}>5 ימים</option>
              <option value={6}>6 ימים</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              היקף משרה (%)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min={10}
                max={100}
                step={5}
                value={partTime}
                onChange={(e) => setPartTime(Number(e.target.value))}
                className="flex-1"
              />
              <span className="text-sm font-semibold text-blue-700 w-10 text-center">{partTime}%</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              שכר חודשי ברוטו אחרון (₪)
            </label>
            <input
              type="number"
              min={0}
              max={200000}
              step={500}
              value={monthlySalary}
              onChange={(e) => setMonthlySalary(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ימי חופשה שניצלת השנה
            </label>
            <input
              type="number"
              min={0}
              max={100}
              step={0.5}
              value={totalDaysUsedEver}
              onChange={(e) => setTotalDaysUsedEver(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <ResultCard
          title="חופשה יחסית לשנה הנוכחית"
          value={`${partialYearResult.proRatedEntitlement} ימים`}
          subtitle={partialYearResult.breakdown}
          variant="success"
        />
        <ResultCard
          title="יתרה לפדיון (לאחר ניצול)"
          value={`${terminationResult.remainingDays.toFixed(1)} ימים`}
          subtitle={`ניצלת ${totalDaysUsedEver} ימים`}
          variant="primary"
        />
        {monthlySalary > 0 && (
          <ResultCard
            title="סכום פדיון משוער"
            value={formatCurrency(
              terminationResult.remainingDays * terminationResult.dailyWageValue,
              { decimals: 0 },
            )}
            subtitle={`${terminationResult.remainingDays.toFixed(1)} ימים × ${formatCurrency(terminationResult.dailyWageValue, { decimals: 0 })}`}
            variant="success"
          />
        )}
      </div>

      <Breakdown
        title="פירוט חישוב עזיבה"
        defaultOpen
        items={[
          {
            label: 'וותק שלם',
            value: `${yearsOfService} שנים`,
          },
          {
            label: 'חודשים בשנה הנוכחית',
            value: `${monthsWorkedCurrent} חודשים`,
          },
          {
            label: 'זכאות שנתית מלאה',
            value: `${partialYearResult.fullYearEntitlement} ימים`,
          },
          {
            label: 'חופשה יחסית לשנה (יחסי)',
            value: `${partialYearResult.proRatedEntitlement} ימים`,
            note: partialYearResult.breakdown,
          },
          {
            label: 'ניצלת השנה',
            value: `${totalDaysUsedEver} ימים`,
          },
          {
            label: 'יתרה לפדיון',
            value: `${terminationResult.remainingDays.toFixed(1)} ימים`,
          },
          ...(monthlySalary > 0
            ? [
                {
                  label: 'ערך יום',
                  value: formatCurrency(terminationResult.dailyWageValue, { decimals: 0 }),
                },
                {
                  label: 'סכום פדיון',
                  value: formatCurrency(
                    terminationResult.remainingDays * terminationResult.dailyWageValue,
                    { decimals: 0 },
                  ),
                  bold: true,
                },
              ]
            : []),
        ]}
      />

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 space-y-2">
        <h4 className="text-sm font-bold text-blue-900">זכויות נוספות בסיום עבודה</h4>
        <ul className="text-xs text-blue-900 space-y-1">
          <li>• <strong>פיצויי פיטורים</strong>: שנת עבודה × משכורת אחרונה (אם פוטרת/פרשת)</li>
          <li>• <strong>הודעה מוקדמת</strong>: 1 יום לכל חודש (שנה ראשונה) + 1 שבוע לכל שנה נוספת עד תקרה</li>
          <li>• <strong>דמי הבראה</strong>: לפי ותק — מגיע בעת הסיום</li>
          <li>• <strong>פנסיה</strong>: כספי תגמולים מועברים לרשותך לאחר ותק מינימלי</li>
        </ul>
      </div>

      <Recommendations items={terminationResult.recommendations} />
    </div>
  );

  // ============================
  // Render
  // ============================
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
      {activeTab === 'entitlement' && <EntitlementTab />}
      {activeTab === 'balance' && <BalanceTab />}
      {activeTab === 'redemption' && <RedemptionTab />}
      {activeTab === 'termination' && <TerminationTab />}
    </div>
  );
}
