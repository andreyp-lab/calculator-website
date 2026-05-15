'use client';

import { useState, useMemo } from 'react';
import {
  calculateSeverance,
  calculateSection14Detail,
  compareSeveranceTaxOptions,
  getTerminationRights,
  calculateLatePaymentPenalty,
  calculateSalaryBasis,
  type SeveranceInput,
  type TerminationReason,
  type EmploymentType,
  type TaxOption,
} from '@/lib/calculators/severance';
import { formatCurrency } from '@/lib/utils/formatters';
import { ResultCard } from '@/components/calculator/ResultCard';
import { Breakdown } from '@/components/calculator/Breakdown';
import { AlertCircle, Info, ChevronDown, ChevronUp, CheckCircle2, XCircle } from 'lucide-react';

// ============================================================
// Constants
// ============================================================

type TabMode = 'basic' | 'tax_options' | 'section14' | 'termination_rights' | 'late_payment' | 'salary_basis';

const TABS: { id: TabMode; label: string }[] = [
  { id: 'basic', label: 'חישוב פיצויים' },
  { id: 'tax_options', label: '4 אפשרויות מס' },
  { id: 'section14', label: 'סעיף 14 מפורט' },
  { id: 'termination_rights', label: 'זכויות לפי סיבה' },
  { id: 'salary_basis', label: 'שכר קובע' },
  { id: 'late_payment', label: 'הלנת פיצויים' },
];

const TERMINATION_REASON_LABELS: Record<TerminationReason, string> = {
  fired: 'פיטורין רגילים',
  resigned: 'התפטרות רגילה (לא מזכה)',
  retirement: 'פרישה לגיל פרישה',
  qualifying: 'התפטרות מזכה (כללי)',
  deterioration: 'הרעה מוחשית בתנאי עבודה',
  relocation: 'העברה גיאוגרפית (>50 ק"מ)',
  health: 'מצב בריאותי (עצמי/משפחה)',
  maternity: 'לידה / 9 חודשים לאחר חזרה',
  disabled_child: 'טיפול בילד נכה',
  reserve_duty: 'מילואים ממושכים (90+ ימים)',
  employer_death: 'מות מעסיק / פירוק חברה',
  conditions_change: 'שינוי מהותי בתנאי ההעסקה',
  fixed_term_end: 'סיום חוזה לתקופה קצובה',
};

const SECTION14_COVERAGE_OPTIONS = [
  { value: 72, label: '72% — ישן (לפני 2008)' },
  { value: 83.3, label: '83.3% — חלקי (נפוץ)' },
  { value: 100, label: '100% — מלא (מלא)' },
];

const today = new Date().toISOString().split('T')[0];
const fiveYearsAgo = new Date(new Date().setFullYear(new Date().getFullYear() - 5))
  .toISOString()
  .split('T')[0];

// ============================================================
// Main Calculator
// ============================================================

export function SeveranceCalculator() {
  const [activeTab, setActiveTab] = useState<TabMode>('basic');

  // --- Basic inputs (shared) ---
  const [startDate, setStartDate] = useState(fiveYearsAgo);
  const [endDate, setEndDate] = useState(today);
  const [monthlySalary, setMonthlySalary] = useState(12000);
  const [employmentType, setEmploymentType] = useState<EmploymentType>('monthly');
  const [partTimePercentage, setPartTimePercentage] = useState(100);
  const [terminationReason, setTerminationReason] = useState<TerminationReason>('fired');
  const [hasSection14, setHasSection14] = useState(false);
  const [section14Percentage, setSection14Percentage] = useState(8.33);

  // --- Tax options ---
  const [currentAnnualIncome, setCurrentAnnualIncome] = useState(144000);
  const [age, setAge] = useState(40);
  const [spreadYears, setSpreadYears] = useState(6);
  const [selectedTaxOption, setSelectedTaxOption] = useState<TaxOption>('immediate_exemption');

  // --- Section 14 detailed ---
  const [section14Coverage, setSection14Coverage] = useState(100);
  const [accumulatedInFund, setAccumulatedInFund] = useState(0);

  // --- Late payment ---
  const [daysLate, setDaysLate] = useState(30);

  // --- Salary basis ---
  const [lastMonthSalary, setLastMonthSalary] = useState(12000);
  const [avg3mSalary, setAvg3mSalary] = useState(11500);
  const [avg12mSalary, setAvg12mSalary] = useState(11000);

  // --- UI state ---
  const [showTerminationAll, setShowTerminationAll] = useState(false);

  // ============================================================
  // Computations
  // ============================================================

  const basicInput: SeveranceInput = useMemo(() => ({
    startDate,
    endDate,
    monthlySalary,
    employmentType,
    partTimePercentage,
    hasSection14,
    section14Percentage,
    terminationReason,
  }), [startDate, endDate, monthlySalary, employmentType, partTimePercentage, hasSection14, section14Percentage, terminationReason]);

  const basicResult = useMemo(() => calculateSeverance(basicInput), [basicInput]);

  const years = basicResult.isEligible ? basicResult.yearsOfService : 0;
  const adjustedSalary = basicResult.isEligible ? basicResult.adjustedSalary : monthlySalary;
  const baseSeverance = basicResult.isEligible ? basicResult.baseSeverance : 0;

  const taxComparison = useMemo(() => {
    if (!basicResult.isEligible || baseSeverance <= 0) return null;
    return compareSeveranceTaxOptions({
      baseSeverance,
      adjustedSalary,
      years,
      age,
      currentAnnualIncome,
      spreadYears,
    });
  }, [basicResult.isEligible, baseSeverance, adjustedSalary, years, age, currentAnnualIncome, spreadYears]);

  const section14Detail = useMemo(() => {
    if (accumulatedInFund <= 0 && baseSeverance <= 0) return null;
    const entitlement = baseSeverance > 0 ? baseSeverance : adjustedSalary * Math.max(years, 1);
    return calculateSection14Detail(
      accumulatedInFund || adjustedSalary * (section14Percentage / 100) * years * 12,
      entitlement,
      section14Coverage,
    );
  }, [accumulatedInFund, baseSeverance, adjustedSalary, years, section14Coverage, section14Percentage]);

  const terminationRights = useMemo(() => getTerminationRights(terminationReason), [terminationReason]);

  const latePaymentResult = useMemo(() => {
    const amount = baseSeverance > 0 ? baseSeverance : monthlySalary * 5;
    return calculateLatePaymentPenalty(amount, daysLate);
  }, [baseSeverance, monthlySalary, daysLate]);

  const salaryBasisResult = useMemo(() =>
    calculateSalaryBasis(lastMonthSalary, avg3mSalary, avg12mSalary),
    [lastMonthSalary, avg3mSalary, avg12mSalary],
  );

  const allReasons = Object.keys(TERMINATION_REASON_LABELS) as TerminationReason[];

  // ============================================================
  // Shared components
  // ============================================================

  const BasicInputsSection = () => (
    <div className="bg-white border-2 border-gray-200 rounded-xl p-6 space-y-5">
      <h2 className="text-lg font-bold text-gray-900">פרטי ההעסקה</h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">תאריך תחילת עבודה</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">תאריך סיום עבודה</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          שכר חודשי קובע (ש"ח)
        </label>
        <input
          type="number"
          min={0}
          max={500000}
          step={500}
          value={monthlySalary}
          onChange={(e) => setMonthlySalary(Number(e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg font-semibold"
        />
        <p className="text-xs text-gray-500 mt-1">שכר חודש אחרון / ממוצע 12 חודשים (לפי השיטה שנבחרה)</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">סוג העסקה</label>
          <select
            value={employmentType}
            onChange={(e) => setEmploymentType(e.target.value as EmploymentType)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="monthly">עובד חודשי (משכורת קבועה)</option>
            <option value="hourly">עובד שעתי / חלקי משרה</option>
          </select>
        </div>
        {employmentType === 'hourly' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              היקף משרה ({partTimePercentage}%)
            </label>
            <input
              type="range"
              min={10}
              max={100}
              step={5}
              value={partTimePercentage}
              onChange={(e) => setPartTimePercentage(Number(e.target.value))}
              className="w-full mt-3"
            />
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">סיבת סיום העבודה</label>
        <select
          value={terminationReason}
          onChange={(e) => setTerminationReason(e.target.value as TerminationReason)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {allReasons.map((r) => (
            <option key={r} value={r}>{TERMINATION_REASON_LABELS[r]}</option>
          ))}
        </select>
      </div>
    </div>
  );

  // ============================================================
  // TAB: Basic Calculation
  // ============================================================
  const BasicTab = () => (
    <div className="space-y-4">
      <BasicInputsSection />

      {!basicResult.isEligible ? (
        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6">
          <div className="flex gap-3">
            <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-red-900 mb-2">לא זכאי לפיצויי פיטורין</h3>
              <p className="text-sm text-red-800 leading-relaxed">{basicResult.ineligibilityReason}</p>
              {terminationReason === 'resigned' && (
                <p className="text-sm text-red-700 mt-2">
                  <strong>טיפ:</strong> אם התפטרת בנסיבות מיוחדות (הרעה, העברה, בריאות, לידה) — עיין בטאב "זכויות לפי סיבה".
                </p>
              )}
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <ResultCard
              title="פיצויי פיטורין (ברוטו)"
              value={formatCurrency(basicResult.baseSeverance, { decimals: 0 })}
              subtitle={`${adjustedSalary.toLocaleString('he-IL')} ₪ × ${years.toFixed(2)} שנים`}
              variant="primary"
            />
            <ResultCard
              title="פיצויים נטו (אחרי מס)"
              value={formatCurrency(basicResult.netSeverance, { decimals: 0 })}
              subtitle={
                basicResult.taxableAmount > 0
                  ? `מס משוער: ${formatCurrency(basicResult.estimatedTax, { decimals: 0 })}`
                  : 'פטור מלא ממס'
              }
              variant="success"
            />
            <ResultCard
              title="ותק מוכר"
              value={`${years.toFixed(2)} שנים`}
              subtitle={`${basicResult.monthsOfService.toFixed(0)} חודשים בסה"כ`}
              variant={basicResult.taxableAmount > 0 ? 'warning' : 'success'}
            />
          </div>

          {basicResult.taxableAmount > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
              <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-amber-900 mb-1">יש סכום חייב במס!</p>
                <p className="text-sm text-amber-800">
                  {formatCurrency(basicResult.taxableAmount, { decimals: 0 })} ₪ חייבים במס (מעל תקרת הפטור).
                  בטאב <strong>"4 אפשרויות מס"</strong> תוכל לראות כיצד לחסוך מס.
                </p>
              </div>
            </div>
          )}

          <Breakdown
            title="פירוט חישוב הפיצויים"
            defaultOpen
            items={[
              { label: 'שכר חודשי קובע', value: formatCurrency(adjustedSalary) },
              { label: 'שנות ותק', value: `${years.toFixed(2)} שנים` },
              { label: 'פיצוי ברוטו (שכר × ותק)', value: formatCurrency(basicResult.baseSeverance) },
              {
                label: 'תקרת פטור ממס (13,750 ₪ × שנים)',
                value: formatCurrency(13_750 * years, { decimals: 0 }),
                note: 'הנמוך מבין: תקרה שנתית / שכר×1.5×שנים',
              },
              { label: 'סכום פטור ממס', value: formatCurrency(basicResult.taxExemptAmount) },
              {
                label: 'סכום חייב במס',
                value: formatCurrency(basicResult.taxableAmount),
                note: basicResult.taxableAmount > 0 ? 'שיעור אומדן: 30% (ראה "4 אפשרויות מס" לחיסכון)' : 'פטור מלא',
              },
              { label: 'מס משוער', value: formatCurrency(basicResult.estimatedTax) },
              { label: 'פיצויים נטו', value: formatCurrency(basicResult.netSeverance), bold: true },
            ]}
          />

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 space-y-2">
            <h4 className="text-sm font-bold text-blue-900">חשוב לדעת</h4>
            <ul className="text-xs text-blue-900 space-y-1.5">
              <li>• <strong>שכר קובע</strong>: כולל שכר בסיס, קצובות קבועות (רכב, ביגוד) אך לא בונוסים חד-פעמיים</li>
              <li>• <strong>פריסה</strong>: ניתן לפרוס את הסכום החייב על עד 6 שנים — חיסכון מס משמעותי</li>
              <li>• <strong>רצף קצבה</strong>: העברה לפנסיה — פטור מלא ממס, גידול בקצבה חודשית</li>
              <li>• <strong>תשלום</strong>: המעסיק חייב לשלם תוך 15 ימים מסיום העבודה</li>
              <li>• <strong>מגיל 50</strong>: פטור מוגדל — עד 150% מהתקרה הרגילה</li>
            </ul>
          </div>
        </>
      )}
    </div>
  );

  // ============================================================
  // TAB: 4 Tax Options
  // ============================================================
  const TaxOptionsTab = () => {
    const optionColors: Record<string, string> = {
      immediate_exemption: 'border-blue-300 bg-blue-50',
      pension_continuity: 'border-emerald-300 bg-emerald-50',
      multi_year_spread: 'border-purple-300 bg-purple-50',
      combination: 'border-amber-300 bg-amber-50',
    };
    const optionHeaderColors: Record<string, string> = {
      immediate_exemption: 'bg-blue-100',
      pension_continuity: 'bg-emerald-100',
      multi_year_spread: 'bg-purple-100',
      combination: 'bg-amber-100',
    };
    const optionValueColors: Record<string, string> = {
      immediate_exemption: 'text-blue-700',
      pension_continuity: 'text-emerald-700',
      multi_year_spread: 'text-purple-700',
      combination: 'text-amber-700',
    };

    return (
      <div className="space-y-4">
        {/* Tax profile inputs */}
        <div className="bg-white border-2 border-gray-200 rounded-xl p-6 space-y-4">
          <h2 className="text-lg font-bold text-gray-900">פרופיל מס</h2>
          <p className="text-sm text-gray-600">
            לקבלת השוואה מדויקת, הכנס נתוני מס אישיים:
          </p>

          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">גיל</label>
              <input
                type="number"
                min={18}
                max={80}
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              {age >= 50 && (
                <p className="text-xs text-emerald-700 mt-1">מגיל 50: פטור מוגדל (×1.5)</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">הכנסה שנתית אחרת (₪)</label>
              <input
                type="number"
                min={0}
                max={2000000}
                step={12000}
                value={currentAnnualIncome}
                onChange={(e) => setCurrentAnnualIncome(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">לחישוב מדרגת מס שולי</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">שנות פריסה (1-6)</label>
              <input
                type="range"
                min={1}
                max={6}
                step={1}
                value={spreadYears}
                onChange={(e) => setSpreadYears(Number(e.target.value))}
                className="w-full mt-2"
              />
              <p className="text-xs text-center text-purple-700 font-semibold">{spreadYears} שנים</p>
            </div>
          </div>
        </div>

        {!basicResult.isEligible ? (
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 text-center">
            <p className="text-gray-600">הכנס נתוני ותק ושכר בטאב "חישוב פיצויים" כדי לראות השוואת אפשרויות מס</p>
          </div>
        ) : taxComparison ? (
          <>
            {/* Recommendation banner */}
            <div className="bg-emerald-50 border-2 border-emerald-300 rounded-xl p-4 flex gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-emerald-900 mb-1">המלצה</p>
                <p className="text-sm text-emerald-800">{taxComparison.recommendationText}</p>
              </div>
            </div>

            {/* Options grid */}
            <div className="grid sm:grid-cols-2 gap-4">
              {taxComparison.options.map((opt) => (
                <div
                  key={opt.option}
                  onClick={() => setSelectedTaxOption(opt.option)}
                  className={`border-2 rounded-xl overflow-hidden cursor-pointer transition-all ${
                    optionColors[opt.option]
                  } ${opt.isRecommended ? 'ring-2 ring-emerald-400' : ''} ${
                    selectedTaxOption === opt.option ? 'shadow-lg scale-[1.01]' : ''
                  }`}
                >
                  <div className={`px-4 py-3 ${optionHeaderColors[opt.option]} flex justify-between items-center`}>
                    <span className="font-bold text-gray-900">{opt.label}</span>
                    {opt.isRecommended && (
                      <span className="text-xs bg-emerald-500 text-white px-2 py-0.5 rounded-full font-medium">
                        מומלץ
                      </span>
                    )}
                  </div>

                  <div className="p-4 space-y-3">
                    <p className="text-xs text-gray-600">{opt.description}</p>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">פטור ממס:</span>
                        <span className="font-semibold text-emerald-700">
                          {formatCurrency(opt.taxExemptAmount, { decimals: 0 })}
                        </span>
                      </div>
                      {opt.taxableAmount > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">חייב במס:</span>
                          <span className="font-semibold text-red-600">
                            {formatCurrency(opt.taxableAmount, { decimals: 0 })}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">מס:</span>
                        <span className="font-semibold text-red-700">
                          {opt.estimatedTax > 0 ? formatCurrency(opt.estimatedTax, { decimals: 0 }) : 'ללא'}
                        </span>
                      </div>
                      {opt.pensionTransferAmount > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">לפנסיה:</span>
                          <span className="font-semibold text-emerald-700">
                            {formatCurrency(opt.pensionTransferAmount, { decimals: 0 })}
                          </span>
                        </div>
                      )}
                      <div className="pt-2 border-t border-gray-300 flex justify-between">
                        <span className="font-bold text-gray-800">מזומן נטו:</span>
                        <span className={`text-xl font-bold ${optionValueColors[opt.option]}`}>
                          {formatCurrency(opt.netCash, { decimals: 0 })}
                        </span>
                      </div>
                    </div>

                    {opt.note && (
                      <p className="text-xs text-gray-500 italic">{opt.note}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Selected option detail */}
            {selectedTaxOption && (() => {
              const opt = taxComparison.options.find((o) => o.option === selectedTaxOption);
              if (!opt) return null;
              return (
                <div className={`border-2 rounded-xl p-5 ${optionColors[selectedTaxOption]}`}>
                  <h3 className="font-bold text-gray-900 mb-4">{opt.label} — יתרונות וחסרונות</h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-semibold text-emerald-800 mb-2 flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" /> יתרונות
                      </h4>
                      <ul className="space-y-1">
                        {opt.pros.map((p, i) => (
                          <li key={i} className="text-sm text-gray-700 flex gap-2">
                            <span className="text-emerald-600 flex-shrink-0">+</span>
                            {p}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-red-700 mb-2 flex items-center gap-1">
                        <XCircle className="w-4 h-4" /> חסרונות
                      </h4>
                      <ul className="space-y-1">
                        {opt.cons.map((c, i) => (
                          <li key={i} className="text-sm text-gray-700 flex gap-2">
                            <span className="text-red-500 flex-shrink-0">−</span>
                            {c}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Visual bar chart */}
            <div className="bg-white border-2 border-gray-200 rounded-xl p-5">
              <h3 className="font-bold text-gray-900 mb-4">השוואה ויזואלית — מזומן נטו</h3>
              <div className="space-y-3">
                {taxComparison.options.map((opt) => {
                  const maxCash = Math.max(...taxComparison.options.map((o) => Math.max(o.netCash, 1)));
                  const pct = maxCash > 0 ? Math.max(5, (opt.netCash / maxCash) * 100) : 0;
                  const barColors: Record<string, string> = {
                    immediate_exemption: 'bg-blue-500',
                    pension_continuity: 'bg-emerald-500',
                    multi_year_spread: 'bg-purple-500',
                    combination: 'bg-amber-500',
                  };
                  return (
                    <div key={opt.option}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-700 font-medium">{opt.label}</span>
                        <span className="font-bold text-gray-900">
                          {formatCurrency(opt.netCash, { decimals: 0 })}
                        </span>
                      </div>
                      <div className="h-7 bg-gray-100 rounded-lg overflow-hidden">
                        <div
                          className={`h-full ${barColors[opt.option]} flex items-center justify-end pr-2 transition-all`}
                          style={{ width: `${pct}%` }}
                        >
                          {pct > 20 && (
                            <span className="text-white text-xs font-medium">
                              {Math.round(pct)}%
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <p className="text-xs text-gray-500 mt-3">
                * רצף קצבה אינו מזומן מיידי — הסכום ממשיך לצמוח בפנסיה
              </p>
            </div>
          </>
        ) : null}
      </div>
    );
  };

  // ============================================================
  // TAB: Section 14 Detailed
  // ============================================================
  const Section14Tab = () => (
    <div className="space-y-4">
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <h3 className="font-bold text-blue-900 mb-2">מה זה סעיף 14?</h3>
        <p className="text-sm text-blue-800 leading-relaxed">
          סעיף 14 לחוק פיצויי פיטורים מאפשר למעסיק לשחרר עצמו מחובת תשלום פיצויים על-ידי הפרשה
          חודשית לקרן פנסיה/גמל לשם כך. העובד מקבל את הסכום שנצבר בקרן — אפילו בהתפטרות.
          הפרשה חלקית (72% / 83.3%) — המעסיק עדיין חייב להשלים את ההפרש.
        </p>
      </div>

      <div className="bg-white border-2 border-gray-200 rounded-xl p-6 space-y-4">
        <h2 className="text-lg font-bold text-gray-900">פרטי סעיף 14</h2>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">אחוז כיסוי סעיף 14</label>
            <select
              value={section14Coverage}
              onChange={(e) => setSection14Coverage(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              {SECTION14_COVERAGE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              סכום שנצבר בקרן (₪)
            </label>
            <input
              type="number"
              min={0}
              step={1000}
              value={accumulatedInFund}
              onChange={(e) => setAccumulatedInFund(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-lg font-semibold"
            />
            <p className="text-xs text-gray-500 mt-1">
              נמצא בדו"ח קרן הפנסיה / גמל תחת "מרכיב פיצויים"
              {baseSeverance > 0 && accumulatedInFund === 0 && (
                <span className="text-blue-600"> (אמדן: {formatCurrency(adjustedSalary * (section14Percentage / 100) * years * 12, { decimals: 0 })} לפי 8.33%)</span>
              )}
            </p>
          </div>
        </div>

        {/* Show basic severance if available */}
        {basicResult.isEligible && (
          <div className="bg-gray-50 rounded-lg p-3 flex justify-between items-center">
            <span className="text-sm text-gray-700">זכאות חוקית לפיצויים (שכר × ותק):</span>
            <span className="font-bold text-gray-900">{formatCurrency(baseSeverance, { decimals: 0 })}</span>
          </div>
        )}
      </div>

      {section14Detail && (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <ResultCard
              title="סכום בקרן"
              value={formatCurrency(section14Detail.accumulatedInFund, { decimals: 0 })}
              subtitle={`כיסוי: ${section14Detail.fundCoversEntitlement}% מהזכאות`}
              variant="primary"
            />
            <ResultCard
              title="השלמה מהמעסיק"
              value={formatCurrency(section14Detail.employerTopUp, { decimals: 0 })}
              subtitle={
                section14Detail.employerTopUp > 0
                  ? `כיסוי חלקי (${section14Coverage}%) — חייב להשלים`
                  : section14Coverage >= 100 ? 'סעיף 14 מלא — אין השלמה' : 'מכוסה במלואו'
              }
              variant={section14Detail.employerTopUp > 0 ? 'warning' : 'success'}
            />
            <ResultCard
              title="סה״כ שתקבל"
              value={formatCurrency(section14Detail.totalReceived, { decimals: 0 })}
              subtitle={
                section14Detail.fundSurplus > 0
                  ? `כולל עודף: ${formatCurrency(section14Detail.fundSurplus, { decimals: 0 })} לטובתך`
                  : 'מהקרן + השלמה'
              }
              variant="success"
            />
          </div>

          <div className={`border-2 rounded-xl p-4 flex gap-3 ${
            section14Detail.fundSurplus > 0 ? 'bg-emerald-50 border-emerald-200' : 'bg-amber-50 border-amber-200'
          }`}>
            <Info className={`w-5 h-5 flex-shrink-0 mt-0.5 ${section14Detail.fundSurplus > 0 ? 'text-emerald-600' : 'text-amber-600'}`} />
            <p className={`text-sm ${section14Detail.fundSurplus > 0 ? 'text-emerald-800' : 'text-amber-800'}`}>
              {section14Detail.note}
            </p>
          </div>

          <Breakdown
            title="פירוט מלא סעיף 14"
            defaultOpen
            items={[
              { label: 'זכאות חוקית לפיצויים', value: formatCurrency(section14Detail.employeeEntitlement) },
              { label: `כיסוי סעיף 14 (${section14Coverage}%)`, value: formatCurrency((section14Detail.employeeEntitlement * section14Coverage) / 100) },
              { label: 'נצבר בקרן בפועל', value: formatCurrency(section14Detail.accumulatedInFund) },
              {
                label: 'הקרן מכסה את הזכאות',
                value: `${section14Detail.fundCoversEntitlement}%`,
                note: section14Detail.fundSurplus > 0 ? 'עודף — לטובת העובד' : section14Coverage < 100 ? 'חוסר — המעסיק משלים' : 'סעיף 14 מלא',
              },
              { label: 'עודף בקרן (לטובתך)', value: formatCurrency(section14Detail.fundSurplus) },
              { label: 'השלמה מהמעסיק', value: formatCurrency(section14Detail.employerTopUp) },
              { label: 'סכום מהקרן', value: formatCurrency(section14Detail.employeeReceivedFromFund) },
              { label: 'סה"כ שתקבל', value: formatCurrency(section14Detail.totalReceived), bold: true },
            ]}
          />

          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-3">
            <h4 className="text-sm font-bold text-gray-800">הבדל בין סעיף 14 מלא לחלקי</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-3 py-2 text-right font-medium text-gray-700">נושא</th>
                    <th className="px-3 py-2 text-center font-medium text-gray-700">סעיף 14 מלא (100%)</th>
                    <th className="px-3 py-2 text-center font-medium text-gray-700">סעיף 14 חלקי (72%/83%)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-3 py-2">כיסוי הקרן</td>
                    <td className="px-3 py-2 text-center">100% מהזכאות</td>
                    <td className="px-3 py-2 text-center">72%-83% מהזכאות</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-3 py-2">אם הקרן קטנה מהזכאות</td>
                    <td className="px-3 py-2 text-center text-red-700">מעסיק לא משלים</td>
                    <td className="px-3 py-2 text-center text-emerald-700">מעסיק משלים את ההפרש</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2">אם הקרן גדולה מהזכאות</td>
                    <td className="px-3 py-2 text-center text-emerald-700">עובד מקבל הכל</td>
                    <td className="px-3 py-2 text-center text-emerald-700">עובד מקבל הכל</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-3 py-2">זכאות בהתפטרות</td>
                    <td className="px-3 py-2 text-center text-emerald-700">כן — מקבל את הקרן</td>
                    <td className="px-3 py-2 text-center text-amber-700">חלקי — רק הקרן</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );

  // ============================================================
  // TAB: Termination Rights
  // ============================================================
  const TerminationRightsTab = () => {
    const displayReasons: TerminationReason[] = showTerminationAll
      ? allReasons
      : ['fired', 'resigned', 'retirement', 'deterioration', 'relocation', 'health', 'maternity', 'reserve_duty', 'employer_death'];

    return (
      <div className="space-y-4">
        <div className="bg-white border-2 border-gray-200 rounded-xl p-5 space-y-3">
          <h2 className="text-lg font-bold text-gray-900">בחר את סיבת הסיום שלך</h2>
          <select
            value={terminationReason}
            onChange={(e) => setTerminationReason(e.target.value as TerminationReason)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            {allReasons.map((r) => (
              <option key={r} value={r}>{TERMINATION_REASON_LABELS[r]}</option>
            ))}
          </select>
        </div>

        {/* Current selection highlight */}
        <div className={`border-2 rounded-xl overflow-hidden ${terminationRights.isEntitled ? 'border-emerald-300' : 'border-red-300'}`}>
          <div className={`px-4 py-3 flex items-center gap-3 ${terminationRights.isEntitled ? 'bg-emerald-50' : 'bg-red-50'}`}>
            {terminationRights.isEntitled ? (
              <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0" />
            ) : (
              <XCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
            )}
            <div>
              <h3 className="font-bold text-gray-900">{terminationRights.label}</h3>
              <p className={`text-sm font-medium ${terminationRights.isEntitled ? 'text-emerald-700' : 'text-red-700'}`}>
                {terminationRights.isEntitled ? 'זכאי לפיצויי פיטורין' : 'לא זכאי לפיצויי פיטורין'}
              </p>
            </div>
          </div>

          <div className="p-4 space-y-3 bg-white">
            {terminationRights.entitlementCondition && (
              <div className="bg-blue-50 rounded-lg p-3">
                <p className="text-sm text-blue-800">
                  <strong>תנאי:</strong> {terminationRights.entitlementCondition}
                </p>
              </div>
            )}

            <div>
              <p className="text-xs font-semibold text-gray-500 mb-1">בסיס משפטי:</p>
              <p className="text-sm text-gray-700">{terminationRights.legalBasis}</p>
            </div>

            <div>
              <p className="text-xs font-semibold text-gray-500 mb-2">נקודות חשובות:</p>
              <ul className="space-y-1.5">
                {terminationRights.notes.map((note, i) => (
                  <li key={i} className="text-sm text-gray-700 flex gap-2">
                    <span className="flex-shrink-0 text-blue-500">•</span>
                    {note}
                  </li>
                ))}
              </ul>
            </div>

            {terminationRights.requiresProof && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-amber-900">נדרש תיעוד</p>
                  <p className="text-sm text-amber-800">{terminationRights.proofRequired}</p>
                </div>
              </div>
            )}

            {terminationRights.importantDeadline && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-800">
                  <strong>מועד חשוב:</strong> {terminationRights.importantDeadline}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* All reasons table */}
        <div className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden">
          <button
            type="button"
            onClick={() => setShowTerminationAll(!showTerminationAll)}
            className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition"
          >
            <span className="font-medium text-gray-900">כל 13 הסיבות — טבלת זכאות</span>
            {showTerminationAll ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
          </button>
          {showTerminationAll && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-3 py-2 text-right font-medium text-gray-600">סיבה</th>
                    <th className="px-3 py-2 text-center font-medium text-gray-600">זכאי?</th>
                    <th className="px-3 py-2 text-right font-medium text-gray-600">תנאי עיקרי</th>
                    <th className="px-3 py-2 text-center font-medium text-gray-600">הוכחה?</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {allReasons.map((r) => {
                    const rights = getTerminationRights(r);
                    return (
                      <tr
                        key={r}
                        onClick={() => setTerminationReason(r)}
                        className={`cursor-pointer hover:bg-blue-50 transition ${r === terminationReason ? 'bg-blue-50 font-medium' : ''}`}
                      >
                        <td className="px-3 py-2 text-gray-800">{rights.label}</td>
                        <td className="px-3 py-2 text-center">
                          {rights.isEntitled ? (
                            <span className="text-emerald-700 font-medium">כן</span>
                          ) : (
                            <span className="text-red-600 font-medium">לא</span>
                          )}
                        </td>
                        <td className="px-3 py-2 text-gray-600 text-xs">
                          {rights.entitlementCondition ?? '—'}
                        </td>
                        <td className="px-3 py-2 text-center">
                          {rights.requiresProof ? (
                            <span className="text-amber-700 text-xs">כן</span>
                          ) : (
                            <span className="text-gray-400 text-xs">—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    );
  };

  // ============================================================
  // TAB: Salary Basis
  // ============================================================
  const SalaryBasisTab = () => {
    const methodLabels: Record<string, string> = {
      last_month: 'שכר חודש אחרון',
      average_3m: 'ממוצע 3 חודשים',
      average_12m: 'ממוצע 12 חודשים',
    };
    return (
      <div className="space-y-4">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <h3 className="font-bold text-blue-900 mb-1">מה זה שכר קובע?</h3>
          <p className="text-sm text-blue-800">
            השכר הקובע הוא הבסיס לחישוב הפיצויים. לרוב הוא השכר האחרון, אך ניתן לבחור את השיטה הנוחה
            יותר לעובד (הגבוהה ביותר). הכנס 3 נתונים — המחשבון ימליץ על השיטה הטובה ביותר.
          </p>
        </div>

        <div className="bg-white border-2 border-gray-200 rounded-xl p-6 space-y-4">
          <h2 className="text-lg font-bold text-gray-900">הכנס נתוני שכר</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">שכר חודש אחרון (₪)</label>
              <input
                type="number"
                min={0}
                step={500}
                value={lastMonthSalary}
                onChange={(e) => setLastMonthSalary(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-lg font-semibold"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ממוצע 3 חודשים (₪)</label>
              <input
                type="number"
                min={0}
                step={500}
                value={avg3mSalary}
                onChange={(e) => setAvg3mSalary(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-lg font-semibold"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ממוצע 12 חודשים (₪)</label>
              <input
                type="number"
                min={0}
                step={500}
                value={avg12mSalary}
                onChange={(e) => setAvg12mSalary(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-lg font-semibold"
              />
            </div>
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          {(['last_month', 'average_3m', 'average_12m'] as const).map((method) => {
            const value = method === 'last_month' ? salaryBasisResult.lastMonth
              : method === 'average_3m' ? salaryBasisResult.average3m
              : salaryBasisResult.average12m;
            const isRecommended = salaryBasisResult.recommended === method;
            return (
              <div
                key={method}
                className={`border-2 rounded-xl p-4 ${isRecommended ? 'border-emerald-400 bg-emerald-50' : 'border-gray-200 bg-white'}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <p className="text-sm font-medium text-gray-700">{methodLabels[method]}</p>
                  {isRecommended && (
                    <span className="text-xs bg-emerald-500 text-white px-2 py-0.5 rounded-full">מומלץ</span>
                  )}
                </div>
                <p className={`text-2xl font-bold ${isRecommended ? 'text-emerald-700' : 'text-gray-900'}`}>
                  {formatCurrency(value, { decimals: 0 })}
                </p>
                {basicResult.isEligible && years > 0 && (
                  <p className="text-xs text-gray-500 mt-1">
                    פיצויים: {formatCurrency(value * years, { decimals: 0 })}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
          <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-amber-900 mb-1">המלצה</p>
            <p className="text-sm text-amber-800">{salaryBasisResult.recommendationNote}</p>
          </div>
        </div>

        <Breakdown
          title="פירוט הפרשי שכר"
          items={[
            {
              label: 'שכר אחרון לעומת ממוצע 3 חודשים',
              value: salaryBasisResult.differences.lastVs3m > 0
                ? `+${formatCurrency(salaryBasisResult.differences.lastVs3m, { decimals: 0 })}`
                : formatCurrency(salaryBasisResult.differences.lastVs3m, { decimals: 0 }),
              note: salaryBasisResult.differences.lastVs3m > 0 ? 'שכר אחרון גבוה יותר' : 'ממוצע 3 חודשים גבוה יותר',
            },
            {
              label: 'שכר אחרון לעומת ממוצע 12 חודשים',
              value: salaryBasisResult.differences.lastVs12m > 0
                ? `+${formatCurrency(salaryBasisResult.differences.lastVs12m, { decimals: 0 })}`
                : formatCurrency(salaryBasisResult.differences.lastVs12m, { decimals: 0 }),
              note: salaryBasisResult.differences.lastVs12m > 0 ? 'שכר אחרון גבוה יותר' : 'ממוצע 12 חודשים גבוה יותר',
            },
          ]}
        />

        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-2">
          <h4 className="text-sm font-bold text-gray-800">מה כולל השכר הקובע?</h4>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-semibold text-emerald-700 mb-1">כולל:</p>
              <ul className="text-xs text-gray-700 space-y-1">
                <li>• שכר בסיס</li>
                <li>• קצובת רכב קבועה</li>
                <li>• קצובת ביגוד קבועה</li>
                <li>• תוספת ותק קבועה</li>
                <li>• תוספת משפחה</li>
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold text-red-700 mb-1">לא כולל (בדרך כלל):</p>
              <ul className="text-xs text-gray-700 space-y-1">
                <li>• בונוס חד-פעמי</li>
                <li>• עמלות (אם לא קבועות)</li>
                <li>• שעות נוספות</li>
                <li>• תשלומי הוצאות</li>
                <li>• אופציות / מניות</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ============================================================
  // TAB: Late Payment
  // ============================================================
  const LatePaymentTab = () => (
    <div className="space-y-4">
      <div className="bg-red-50 border border-red-200 rounded-xl p-4">
        <h3 className="font-bold text-red-900 mb-2">הלנת פיצויים — מה מגיע לי?</h3>
        <p className="text-sm text-red-800">
          לפי חוק הגנת השכר (סעיף 20), מעסיק שלא שילם פיצויים תוך 15 ימים מסיום העבודה
          חייב בפיצויי הלנה: <strong>8%</strong> ראשוני על הסכום המלא +
          <strong> 1.5%</strong> לכל חודש נוסף של עיכוב.
        </p>
      </div>

      <div className="bg-white border-2 border-gray-200 rounded-xl p-6 space-y-4">
        <h2 className="text-lg font-bold text-gray-900">פרטי העיכוב</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              סכום פיצויים שלא שולם (₪)
            </label>
            <input
              type="number"
              min={0}
              step={1000}
              value={basicResult.isEligible ? basicResult.baseSeverance : monthlySalary * 5}
              readOnly
              className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-lg font-semibold cursor-not-allowed"
            />
            <p className="text-xs text-gray-500 mt-1">לפי חישוב בטאב "חישוב פיצויים"</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              כמה ימים מאוחר? ({daysLate} ימים)
            </label>
            <input
              type="range"
              min={0}
              max={365}
              step={1}
              value={daysLate}
              onChange={(e) => setDaysLate(Number(e.target.value))}
              className="w-full mt-3"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0</span>
              <span>30 ימים</span>
              <span>365 ימים</span>
            </div>
          </div>
        </div>
      </div>

      {daysLate === 0 ? (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <p className="text-sm text-emerald-800 font-medium">שולם בזמן — אין פיצויי הלנה</p>
        </div>
      ) : daysLate <= 15 ? (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
          <p className="text-sm text-amber-800">
            בתוך 15 הימים הראשונים — עדיין בחסד. פיצויי הלנה חלים רק לאחר 15 ימים.
          </p>
        </div>
      ) : (
        <>
          <div className="grid sm:grid-cols-3 gap-4">
            <ResultCard
              title="פיצוי הלנה"
              value={formatCurrency(latePaymentResult.totalPenalty, { decimals: 0 })}
              subtitle={`8% + ${Math.ceil((daysLate - 15) / 30)} חודשים × 1.5%`}
              variant="warning"
            />
            <ResultCard
              title="פיצויים מקוריים"
              value={formatCurrency(latePaymentResult.originalAmount, { decimals: 0 })}
              subtitle="ללא ריבית הלנה"
              variant="primary"
            />
            <ResultCard
              title="סה״כ מגיע לך"
              value={formatCurrency(latePaymentResult.totalDue, { decimals: 0 })}
              subtitle="פיצויים + פיצויי הלנה"
              variant="success"
            />
          </div>

          <Breakdown
            title="פירוט פיצויי הלנה"
            defaultOpen
            items={[
              { label: 'פיצויים מקוריים', value: formatCurrency(latePaymentResult.originalAmount) },
              { label: 'ימי עיכוב', value: `${daysLate} ימים (${Math.ceil((daysLate - 15) / 30)} חודשי עיכוב נוסף)` },
              { label: 'פיצוי ראשוני (8%)', value: formatCurrency(latePaymentResult.originalAmount * 0.08) },
              {
                label: `ריבית חודשית (1.5% × ${Math.ceil((daysLate - 15) / 30)} חודשים)`,
                value: formatCurrency(latePaymentResult.originalAmount * 0.015 * Math.ceil((daysLate - 15) / 30)),
              },
              { label: 'סך פיצויי הלנה', value: formatCurrency(latePaymentResult.totalPenalty) },
              { label: 'סה"כ מגיע', value: formatCurrency(latePaymentResult.totalDue), bold: true },
            ]}
          />

          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-2">
            <h4 className="text-sm font-bold text-gray-800">כיצד לפעול?</h4>
            <ul className="text-xs text-gray-700 space-y-1.5">
              <li>1. <strong>שלח מכתב דרישה</strong> בכתב (מייל + דואר רשום) עם סכום מדויק וחישוב הלנה</li>
              <li>2. <strong>בקר בהסתדרות</strong> לייעוץ ראשוני חינמי (זכות עובד)</li>
              <li>3. <strong>הגש תלונה</strong> לאגף פיקוח על עבודה (משרד העבודה) — בחינם</li>
              <li>4. <strong>תביעה בבית הדין לעבודה</strong> — הצלחה גבוהה, ללא הצורך בעורך דין עד 50,000 ₪</li>
              <li>5. <strong>תקופת התיישנות</strong>: 7 שנים לתביעת פיצויים רגילים</li>
            </ul>
          </div>
        </>
      )}
    </div>
  );

  // ============================================================
  // Render
  // ============================================================
  return (
    <div className="space-y-6" dir="rtl">
      {/* Tabs */}
      <div className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden">
        <div className="flex flex-wrap border-b border-gray-200">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 min-w-[110px] px-3 py-3 text-xs sm:text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      {activeTab === 'basic' && <BasicTab />}
      {activeTab === 'tax_options' && <TaxOptionsTab />}
      {activeTab === 'section14' && <Section14Tab />}
      {activeTab === 'termination_rights' && <TerminationRightsTab />}
      {activeTab === 'salary_basis' && <SalaryBasisTab />}
      {activeTab === 'late_payment' && <LatePaymentTab />}
    </div>
  );
}
