'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import {
  calculateTaxRefund,
  TAX_REFUND_YEAR_RULES,
  type TaxRefundResult,
  type TaxRefundYear,
} from '@/lib/calculators/tax-refund';
import { calculateRefundChildPoints } from '@/lib/calculators/tax-refund-entitlements';
import { formatCurrency, formatPercent } from '@/lib/utils/formatters';
import { ResultCard } from '@/components/calculator/ResultCard';
import { Breakdown } from '@/components/calculator/Breakdown';
import { PROFESSIONAL_ADVICE_NOTICE } from '@/lib/config/disclaimers';

interface DraftIncomeSource {
  id: number;
  label: string;
  taxableIncome: string;
  taxWithheld: string;
  insuredIncome: string;
  employeePensionContributions: string;
}

type CreditPointMode = '' | 'basic-with-children' | 'verified-total';
type BasicResidentMode = '' | 'resident-2.25' | 'resident-2.75';
type PensionCreditMode = 'automatic' | 'manual';

interface DraftChild {
  id: number;
  birthYear: string;
}

type AnalyticsWindow = Window & {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
};

const YEARS = [...Object.keys(TAX_REFUND_YEAR_RULES)].reverse() as TaxRefundYear[];

const initialSource: DraftIncomeSource = {
  id: 1,
  label: 'טופס 106 — מעסיק 1',
  taxableIncome: '',
  taxWithheld: '',
  insuredIncome: '',
  employeePensionContributions: '',
};

function asNumber(value: string): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.max(0, parsed) : 0;
}

function isValidChildBirthYear(taxYear: TaxRefundYear, value: string): boolean {
  const birthYear = Number(value);
  const year = Number(taxYear);
  return Number.isInteger(birthYear) && birthYear >= year - 18 && birthYear <= year;
}

function trackCalculation() {
  const analytics = window as AnalyticsWindow;
  analytics.dataLayer = analytics.dataLayer || [];
  analytics.gtag = analytics.gtag || function gtag(...args: unknown[]) {
    analytics.dataLayer?.push(args);
  };
  analytics.gtag('event', 'tax_refund_calculation');
}

export function TaxRefundCalculator() {
  const nextId = useRef(2);
  const nextChildId = useRef(1);
  const resultRef = useRef<HTMLElement>(null);
  const [taxYear, setTaxYear] = useState<TaxRefundYear>('2025');
  const [sources, setSources] = useState<DraftIncomeSource[]>([initialSource]);
  const [creditPointMode, setCreditPointMode] = useState<CreditPointMode>('');
  const [basicResidentMode, setBasicResidentMode] = useState<BasicResidentMode>('');
  const [manualCreditPoints, setManualCreditPoints] = useState('');
  const [children, setChildren] = useState<DraftChild[]>([]);
  const [marriedParentConfirmed, setMarriedParentConfirmed] = useState(false);
  const [pensionCreditMode, setPensionCreditMode] = useState<PensionCreditMode>('automatic');
  const [manualPensionCredit, setManualPensionCredit] = useState('');
  const [recognizedDeductions, setRecognizedDeductions] = useState('0');
  const [donations, setDonations] = useState('0');
  const [additionalTaxCredits, setAdditionalTaxCredits] = useState('0');
  const [allDocumentsConfirmed, setAllDocumentsConfirmed] = useState(false);
  const [simpleCaseConfirmed, setSimpleCaseConfirmed] = useState(false);
  const [result, setResult] = useState<TaxRefundResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!result) return;

    const animationFrame = window.requestAnimationFrame(() => {
      resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      resultRef.current?.focus({ preventScroll: true });
    });

    return () => window.cancelAnimationFrame(animationFrame);
  }, [result]);

  function invalidateResult(resetConfirmations = true) {
    setResult(null);
    setError(null);
    if (resetConfirmations) {
      setAllDocumentsConfirmed(false);
      setSimpleCaseConfirmed(false);
    }
  }

  function updateSource(id: number, field: keyof Omit<DraftIncomeSource, 'id'>, value: string) {
    setSources((current) =>
      current.map((source) => (source.id === id ? { ...source, [field]: value } : source)),
    );
    invalidateResult();
  }

  function addSource() {
    const id = nextId.current++;
    setSources((current) => [
      ...current,
      {
        id,
        label: `טופס 106 / אישור — מקור ${current.length + 1}`,
        taxableIncome: '',
        taxWithheld: '',
        insuredIncome: '',
        employeePensionContributions: '',
      },
    ]);
    invalidateResult();
  }

  function removeSource(id: number) {
    setSources((current) => current.filter((source) => source.id !== id));
    invalidateResult();
  }

  function addChild() {
    const id = nextChildId.current++;
    setChildren((current) => [...current, { id, birthYear: '' }]);
    invalidateResult();
  }

  function updateChild(id: number, value: string) {
    setChildren((current) =>
      current.map((child) => (child.id === id ? { ...child, birthYear: value } : child)),
    );
    invalidateResult();
  }

  function removeChild(id: number) {
    setChildren((current) => current.filter((child) => child.id !== id));
    invalidateResult();
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!allDocumentsConfirmed || !simpleCaseConfirmed) {
      setError('יש לאשר שכל הנתונים הוזנו ושהמקרה מתאים לאומדן הפשוט לפני החישוב.');
      setResult(null);
      return;
    }

    const incompleteSourceIndex = sources.findIndex(
      (source) =>
        source.taxableIncome.trim() === '' ||
        source.taxWithheld.trim() === '' ||
        (pensionCreditMode === 'automatic' &&
          (source.insuredIncome.trim() === '' || source.employeePensionContributions.trim() === '')),
    );

    if (incompleteSourceIndex !== -1) {
      setError(
        `יש להזין את כל הסכומים הנדרשים במקור הכנסה ${incompleteSourceIndex + 1}. אם סכום אינו קיים, יש להזין 0.`,
      );
      setResult(null);
      return;
    }

    if (!creditPointMode) {
      setError('יש לבחור חישוב בסיסי או להזין מספר נקודות כולל שאומת לשנת המס.');
      setResult(null);
      return;
    }

    let pointsForCalculation: number;

    if (creditPointMode === 'verified-total') {
      if (manualCreditPoints.trim() === '') {
        setError('יש להזין מספר נקודות כולל שאומת לשנת המס.');
        setResult(null);
        return;
      }
      pointsForCalculation = asNumber(manualCreditPoints);
    } else {
      if (!basicResidentMode) {
        setError('יש לבחור בסיס של 2.25 או 2.75 נקודות זיכוי.');
        setResult(null);
        return;
      }

      const incompleteChildIndex = children.findIndex((child) => child.birthYear.trim() === '');
      if (incompleteChildIndex !== -1) {
        setError(`יש להזין שנת לידה עבור ילד ${incompleteChildIndex + 1}.`);
        setResult(null);
        return;
      }

      const invalidChildIndex = children.findIndex(
        (child) => !isValidChildBirthYear(taxYear, child.birthYear),
      );
      if (invalidChildIndex !== -1) {
        setError(`שנת הלידה של ילד ${invalidChildIndex + 1} צריכה להתאים לגיל 0–18 בשנת המס.`);
        setResult(null);
        return;
      }

      if (children.length > 0 && !marriedParentConfirmed) {
        setError('חישוב ילדים אוטומטי דורש אישור שההורה היה נשוי לאורך כל שנת המס.');
        setResult(null);
        return;
      }

      try {
        const childPoints = children.reduce(
          (sum, child) =>
            sum +
            calculateRefundChildPoints(
              taxYear,
              Number(child.birthYear),
              basicResidentMode === 'resident-2.75' ? 'mother' : 'father',
            ),
          0,
        );
        pointsForCalculation = (basicResidentMode === 'resident-2.25' ? 2.25 : 2.75) + childPoints;
      } catch (childError) {
        setError(childError instanceof Error ? childError.message : 'לא ניתן לחשב את נקודות הילדים.');
        setResult(null);
        return;
      }
    }

    const incomeSources = sources.map((source) => ({
      taxableIncome: asNumber(source.taxableIncome),
      taxWithheld: asNumber(source.taxWithheld),
      insuredIncome: asNumber(source.insuredIncome),
      employeePensionContributions: asNumber(source.employeePensionContributions),
    }));

    const withheldAboveIncomeIndex = incomeSources.findIndex(
      (source) => source.taxWithheld > source.taxableIncome,
    );
    if (withheldAboveIncomeIndex !== -1) {
      setError(
        `במקור הכנסה ${withheldAboveIncomeIndex + 1} המס שנוכה גבוה מההכנסה החייבת. האומדן הבסיסי אינו תומך במקרה כזה; בדקו שהועתקו השדות הנכונים.`,
      );
      setResult(null);
      return;
    }

    if (pensionCreditMode === 'automatic') {
      const insuredAboveIncomeIndex = incomeSources.findIndex(
        (source) => source.insuredIncome > source.taxableIncome,
      );
      if (insuredAboveIncomeIndex !== -1) {
        setError(
          `במקור הכנסה ${insuredAboveIncomeIndex + 1} ההכנסה המבוטחת גבוהה מההכנסה החייבת. מסלול הפנסיה האוטומטי אינו תומך במקרה כזה; בדקו שהועתקו השדות הנכונים או עברו לזיכוי פנסיה ידני מאומת.`,
        );
        setResult(null);
        return;
      }

      const contributionsWithoutIncomeIndex = incomeSources.findIndex(
        (source) => source.employeePensionContributions > 0 && source.insuredIncome <= 0,
      );
      if (contributionsWithoutIncomeIndex !== -1) {
        setError(`במקור הכנסה ${contributionsWithoutIncomeIndex + 1} הוזנו הפקדות עובד ללא הכנסה מבוטחת.`);
        setResult(null);
        return;
      }

      const hasPensionContributions = incomeSources.some(
        (source) => source.employeePensionContributions > 0,
      );
      const nonFullyInsuredSourceIndex = incomeSources.findIndex(
        (source) => Math.abs(source.insuredIncome - source.taxableIncome) > 0.01,
      );
      if (hasPensionContributions && nonFullyInsuredSourceIndex !== -1) {
        setError(
          `במקור הכנסה ${nonFullyInsuredSourceIndex + 1} ההכנסה אינה מבוטחת במלואה. חישוב הפנסיה האוטומטי דורש התאמה בכל מקור בנפרד; בחרו זיכוי פנסיה ידני שנתי מאומת.`,
        );
        setResult(null);
        return;
      }
      if (hasPensionContributions && asNumber(recognizedDeductions) > 0) {
        setError(
          'חישוב הפנסיה האוטומטי אינו תומך בהפקדות לצד ניכויים מוכרים. בחרו זיכוי פנסיה ידני שנתי מאומת.',
        );
        setResult(null);
        return;
      }
    } else if (manualPensionCredit.trim() === '') {
      setError('יש להזין סכום זיכוי פנסיה שנתי מאומת או לבחור בחישוב האוטומטי.');
      setResult(null);
      return;
    }

    if (!incomeSources.some((source) => source.taxableIncome > 0)) {
      setError('יש להזין הכנסה חייבת שנתית אחת לפחות מתוך טופס 106 או אישור שנתי.');
      setResult(null);
      return;
    }

    try {
      const calculation = calculateTaxRefund({
        taxYear,
        incomeSources,
        creditPoints: pointsForCalculation,
        recognizedDeductions: asNumber(recognizedDeductions),
        donations: asNumber(donations),
        additionalTaxCredits: asNumber(additionalTaxCredits),
        pensionCreditMode,
        manualPensionCredit:
          pensionCreditMode === 'manual' ? asNumber(manualPensionCredit) : undefined,
      });

      setResult(calculation);
      setError(null);
      trackCalculation();
    } catch (calculationError) {
      setError(
        calculationError instanceof Error
          ? calculationError.message
          : 'לא ניתן להשלים את החישוב. בדקו את הנתונים ונסו שוב.',
      );
      setResult(null);
    }
  }

  const deadline = TAX_REFUND_YEAR_RULES[taxYear].claimDeadline;
  const basicPoints = basicResidentMode === 'resident-2.25' ? 2.25 : basicResidentMode === 'resident-2.75' ? 2.75 : 0;
  const automaticParentRole = basicResidentMode === 'resident-2.75' ? 'mother' : 'father';
  const childPointBreakdown = children.map((child, index) => {
    if (child.birthYear.trim() === '') {
      return { id: child.id, label: `ילד ${index + 1}`, points: null, error: null };
    }

    if (!isValidChildBirthYear(taxYear, child.birthYear)) {
      return {
        id: child.id,
        label: `ילד ${index + 1}`,
        points: null,
        error: 'שנת הלידה צריכה להתאים לגיל 0–18 בשנת המס.',
      };
    }

    try {
      return {
        id: child.id,
        label: `ילד ${index + 1} — שנת לידה ${child.birthYear}, ${automaticParentRole === 'mother' ? 'אם' : 'אב'}`,
        points: calculateRefundChildPoints(
          taxYear,
          Number(child.birthYear),
          automaticParentRole,
        ),
        error: null,
      };
    } catch (childError) {
      return {
        id: child.id,
        label: `ילד ${index + 1}`,
        points: null,
        error: childError instanceof Error ? childError.message : 'נתונים לא תקינים',
      };
    }
  });
  const automaticChildPoints = childPointBreakdown.reduce(
    (sum, child) => sum + (child.points ?? 0),
    0,
  );
  const automaticTotalPoints = basicPoints + automaticChildPoints;

  return (
    <div className="space-y-6">
      <form onSubmit={submit} className="bg-paper border-2 border-ink/15 p-5 md:p-6 space-y-7">
        <div>
          <h2 className="text-xl font-bold text-ink">הזנת נתונים מטופס 106</h2>
          <p className="mt-2 text-sm leading-relaxed text-ink/70">
            העתיקו לכאן ידנית את הנתונים השנתיים, ללא העלאת מסמכים. החישוב מתבצע בדפדפן;
            הנתונים אינם נשלחים ואינם נשמרים באתר.
          </p>
          <p className="mt-3 border-r-4 border-gold bg-cream-2 p-3 text-sm leading-relaxed text-ink" role="note">
            {PROFESSIONAL_ADVICE_NOTICE}
          </p>
        </div>

        <section aria-labelledby="refund-step-1" className="space-y-4">
          <div>
            <p className="font-mono text-xs font-bold uppercase tracking-[0.12em] text-gold">שלב 1</p>
            <h3 id="refund-step-1" className="mt-1 text-lg font-bold text-ink">
              בחירת שנת מס ונקודות זיכוי
            </h3>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label htmlFor="refund-tax-year" className="block text-sm font-medium text-ink mb-2">
              שנת המס
            </label>
            <select
              id="refund-tax-year"
              aria-describedby="refund-tax-year-help"
              value={taxYear}
              onChange={(event) => {
                setTaxYear(event.target.value as TaxRefundYear);
                invalidateResult();
              }}
              className="w-full border border-ink/20 bg-white px-3 py-2.5 focus:border-gold focus:ring-2 focus:ring-gold/25"
            >
              {YEARS.map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
            <p id="refund-tax-year-help" className="mt-1 text-xs text-ink/65">
              מועד הגשה משוער לשנה זו: עד {new Intl.DateTimeFormat('he-IL').format(new Date(`${deadline}T12:00:00`))}
            </p>
          </div>

          <div>
            <label htmlFor="refund-credit-point-mode" className="block text-sm font-medium text-ink mb-2">
              אופן הזנת נקודות הזיכוי
            </label>
            <select
              id="refund-credit-point-mode"
              aria-describedby="refund-credit-point-mode-help"
              value={creditPointMode}
              onChange={(event) => {
                setCreditPointMode(event.target.value as CreditPointMode);
                invalidateResult();
              }}
              className="w-full border border-ink/20 px-3 py-2.5 focus:border-gold focus:ring-2 focus:ring-gold/25"
              required
            >
              <option value="">בחרו אפשרות</option>
              <option value="basic-with-children">בסיס תושב/ת + ילדים במקרה הפשוט</option>
              <option value="verified-total">מספר נקודות כולל שאומת לשנת המס</option>
            </select>
            <p id="refund-credit-point-mode-help" className="mt-1 text-xs leading-relaxed text-ink/65">
              במצב הבסיס מחברים 2.25 או 2.75 לנקודות ילדים פשוטות. הזנה ידנית מחליפה את
              כל החישוב האוטומטי ואינה מתווספת לבסיס או לילדים.
            </p>

            {creditPointMode === 'verified-total' ? (
              <div className="mt-3 border border-ink/15 bg-cream-2 p-4">
                <label htmlFor="refund-credit-points" className="block text-sm font-medium text-ink mb-2">
                  ממוצע נקודות זיכוי שנתי מאומת
                </label>
                <input
                  id="refund-credit-points"
                  aria-describedby="refund-credit-points-help"
                  type="number"
                  inputMode="decimal"
                  min="0"
                  step="any"
                  value={manualCreditPoints}
                  onChange={(event) => {
                    setManualCreditPoints(event.target.value);
                    invalidateResult();
                  }}
                  className="w-full border border-ink/20 px-3 py-2.5 focus:border-gold focus:ring-2 focus:ring-gold/25"
                  required
                />
                <p id="refund-credit-points-help" className="mt-1 text-xs leading-relaxed text-ink/65">
                  הזינו את המספר הכולל שכבר בדקתם עבור שנת המס. ערך זה מחליף לחלוטין נקודות
                  בסיס וילדים; הכלי לא יוסיף אותן שוב.
                </p>
              </div>
            ) : null}
          </div>
        </div>

        {creditPointMode === 'basic-with-children' ? (
          <div className="space-y-5 border border-ink/15 bg-cream-2 p-4">
            <div>
              <label htmlFor="refund-basic-resident-mode" className="block text-sm font-medium text-ink mb-2">
                נקודות בסיס לתושב/ת ישראל במשך כל השנה
              </label>
              <select
                id="refund-basic-resident-mode"
                aria-describedby="refund-basic-resident-mode-help"
                value={basicResidentMode}
                onChange={(event) => {
                  setBasicResidentMode(event.target.value as BasicResidentMode);
                  invalidateResult();
                }}
                className="w-full border border-ink/20 bg-white px-3 py-2.5 focus:border-gold focus:ring-2 focus:ring-gold/25"
                required
              >
                <option value="">בחרו בסיס</option>
                <option value="resident-2.25">2.25 — תושב ישראל במשך כל שנת המס</option>
                <option value="resident-2.75">2.75 — תושבת ישראל במשך כל שנת המס</option>
              </select>
              <p id="refund-basic-resident-mode-help" className="mt-1 text-xs leading-relaxed text-ink/65">
                הבחירה מוסיפה נקודות בסיס בלבד. היא אינה מסיקה זכאות משירות, לימודים, עלייה,
                יישוב, נכות או נסיבות אישיות אחרות. במקרה הפשוט בלבד, 2.25 מגדיר את הנישום
                כאב ו־2.75 מגדיר את הנישומה כאם לצורך כל שורות הילדים; לא מחברים נקודות של שני הורים.
              </p>
            </div>

            <fieldset className="space-y-4" aria-describedby="refund-children-help">
              <legend className="font-bold text-ink">ילדים — לא חובה</legend>
              <p id="refund-children-help" className="text-sm leading-relaxed text-ink/70">
                החישוב האוטומטי מיועד רק לאם או אב שהיו נשואים לאורך כל שנת המס, ללא שינוי
                משמורת וללא דחיית נקודה משנת הלידה. במקרה של הורה יחיד, משמורת מיוחדת,
                ילדים שאינם בחזקה, שינוי מצב משפחתי או דחיית נקודת לידה — בחרו במספר כולל מאומת.
                גם להורים מאותו מין, שבהם תפקיד ההורה המקבל קצבת ילדים עשוי להשפיע על החלוקה,
                יש לבחור בשלב זה מספר נקודות כולל מאומת.
              </p>

              {children.map((child, index) => (
                <div key={child.id} className="border border-ink/15 bg-white p-4">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <p className="font-medium text-ink">ילד {index + 1}</p>
                    <button
                      type="button"
                      onClick={() => removeChild(child.id)}
                      className="inline-flex items-center gap-1 text-sm text-ink/65 hover:text-red-700"
                      aria-label={`הסר ילד ${index + 1}`}
                    >
                      <Trash2 className="h-4 w-4" aria-hidden="true" />
                      הסרה
                    </button>
                  </div>

                  <div>
                    <div>
                      <label htmlFor={`child-birth-year-${child.id}`} className="block text-xs font-medium text-ink/70 mb-1">
                        שנת לידה
                      </label>
                      <input
                        id={`child-birth-year-${child.id}`}
                        aria-describedby={`child-birth-year-help-${child.id}`}
                        type="number"
                        inputMode="numeric"
                        min={Number(taxYear) - 18}
                        max={Number(taxYear)}
                        step="1"
                        value={child.birthYear}
                        onChange={(event) => updateChild(child.id, event.target.value)}
                        className="w-full border border-ink/20 px-3 py-2"
                        required
                      />
                      <p id={`child-birth-year-help-${child.id}`} className="mt-1 text-xs text-ink/65">
                        הזינו שנה מלאה. הגיל מחושב לפי שנת המס שנבחרה.
                      </p>
                    </div>

                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={addChild}
                className="inline-flex items-center gap-2 border border-ink/20 bg-white px-4 py-2 text-sm font-medium text-ink hover:border-gold"
              >
                <Plus className="h-4 w-4" aria-hidden="true" />
                הוספת ילד
              </button>

              {children.length > 0 ? (
                <label htmlFor="refund-married-parent-confirmed" className="flex items-start gap-3 text-sm leading-relaxed text-ink">
                  <input
                    id="refund-married-parent-confirmed"
                    type="checkbox"
                    checked={marriedParentConfirmed}
                    onChange={(event) => {
                      setMarriedParentConfirmed(event.target.checked);
                      invalidateResult();
                    }}
                    className="mt-1 h-4 w-4 flex-none"
                    required
                  />
                  <span>
                    ההורה שעבורו מחושב האומדן היה נשוי לאורך כל שנת המס, והמקרה אינו כולל
                    משמורת מיוחדת, הורות יחידנית או דחיית נקודה משנת הלידה.
                  </span>
                </label>
              ) : null}
            </fieldset>

            {basicResidentMode ? (
              <div aria-live="polite" className="border-r-4 border-gold bg-paper p-4">
                <p className="font-bold text-ink">פירוט נקודות הזיכוי המחושבות</p>
                <dl className="mt-3 space-y-2 text-sm text-ink/75">
                  <div className="flex justify-between gap-4">
                    <dt>נקודות בסיס</dt>
                    <dd className="font-medium text-ink">{basicPoints.toFixed(2)}</dd>
                  </div>
                  {childPointBreakdown.map((child) => (
                    <div key={child.id} className="flex justify-between gap-4">
                      <dt>
                        {child.label}
                        {child.error ? <span className="block text-xs text-red-700">{child.error}</span> : null}
                      </dt>
                      <dd className="font-medium text-ink">
                        {child.points === null ? 'טרם חושב' : child.points.toFixed(2)}
                      </dd>
                    </div>
                  ))}
                  <div className="flex justify-between gap-4 border-t border-ink/15 pt-2 font-bold text-ink">
                    <dt>סה״כ לחישוב</dt>
                    <dd>{automaticTotalPoints.toFixed(2)}</dd>
                  </div>
                </dl>
              </div>
            ) : null}
          </div>
        ) : null}
        </section>

        <fieldset className="space-y-4" aria-describedby="refund-income-sources-help">
          <legend className="text-lg font-bold text-ink">
            <span className="mb-1 block font-mono text-xs font-bold uppercase tracking-[0.12em] text-gold">
              שלב 2
            </span>
            העתקת נתונים ידנית מטופסי 106 ואישורי הכנסה
          </legend>
          <p className="text-sm text-ink/70">
            לכל מעסיק או אישור שנתי העתיקו את הסכומים שלמטה — לא את הנטו. אין להעלות
            מסמכים; הכנסה חייבת ומס שנוכה נדרשים בכל שורה, גם כשהערך הוא 0.
          </p>
          <p id="refund-income-sources-help" className="text-xs leading-relaxed text-ink/65">
            בטופס 106 חפשו את הקודים המופיעים בשמות השדות. במבנה טופס שונה, ודאו שהסכום מתאר
            את אותו רכיב לפני ההזנה.
          </p>

          <div className="border border-ink/15 bg-white p-4">
            <label htmlFor="refund-pension-credit-mode" className="block text-sm font-medium text-ink mb-2">
              אופן חישוב זיכוי הפנסיה
            </label>
            <select
              id="refund-pension-credit-mode"
              aria-describedby="refund-pension-credit-mode-help"
              value={pensionCreditMode}
              onChange={(event) => {
                setPensionCreditMode(event.target.value as PensionCreditMode);
                invalidateResult();
              }}
              className="w-full border border-ink/20 bg-white px-3 py-2.5 focus:border-gold focus:ring-2 focus:ring-gold/25"
            >
              <option value="automatic">אוטומטי — הפקדות עובד רגילות מטופסי 106</option>
              <option value="manual">ידני — סכום זיכוי שנתי מאומת</option>
            </select>
            <p id="refund-pension-credit-mode-help" className="mt-1 text-xs leading-relaxed text-ink/65">
              החישוב האוטומטי מיועד רק להפקדות עובד רגילות משכר שמבוטח במלואו, ללא ניכויים
              מוכרים וללא הפקדות פרטיות, ומחיל תקרה שנתית אחת על כל המעסיקים. הוא אינו מכסה
              ביטוח חיים או שאירים המתחרה בזיכוי לפי סעיף 45א, חלוקת זכאות בין בני זוג,
              הפקדות פרטיות או חישוב משולב לפי סעיף 47. במקרים אלה בחרו סכום ידני שכבר אומת.
            </p>

            {pensionCreditMode === 'manual' ? (
              <div className="mt-4">
                <label htmlFor="refund-manual-pension-credit" className="block text-sm font-medium text-ink mb-2">
                  זיכוי פנסיה שנתי מאומת (₪)
                </label>
                <input
                  id="refund-manual-pension-credit"
                  aria-describedby="refund-manual-pension-credit-help"
                  type="number"
                  inputMode="decimal"
                  min="0"
                  step="0.01"
                  value={manualPensionCredit}
                  onChange={(event) => {
                    setManualPensionCredit(event.target.value);
                    invalidateResult();
                  }}
                  className="w-full border border-ink/20 px-3 py-2.5 focus:border-gold focus:ring-2 focus:ring-gold/25"
                  required
                />
                <p id="refund-manual-pension-credit-help" className="mt-1 text-xs leading-relaxed text-ink/65">
                  הזינו את סכום זיכוי המס השנתי המלא שכבר חושב ואומת — לא את סכום ההפקדה.
                  סכום זה מחליף את חישוב הפנסיה האוטומטי ואינו מתווסף אליו.
                </p>
              </div>
            ) : null}
          </div>

          {sources.map((source, index) => (
            <div key={source.id} className="border border-ink/15 bg-cream-2 p-4">
              <div className="mb-4 flex items-center justify-between gap-3">
                <p className="font-medium text-ink">מקור הכנסה {index + 1}</p>
                {sources.length > 1 ? (
                  <button
                    type="button"
                    onClick={() => removeSource(source.id)}
                    className="inline-flex items-center gap-1 text-sm text-ink/65 hover:text-red-700"
                    aria-label={`הסר מקור הכנסה ${index + 1}`}
                  >
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                    הסרה
                  </button>
                ) : null}
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label htmlFor={`source-label-${source.id}`} className="block text-xs font-medium text-ink/70 mb-1">
                    תיאור (לא חובה)
                  </label>
                  <input
                    id={`source-label-${source.id}`}
                    type="text"
                    value={source.label}
                    onChange={(event) => updateSource(source.id, 'label', event.target.value)}
                    className="w-full border border-ink/20 px-3 py-2"
                  />
                </div>
                <div>
                  <label htmlFor={`source-income-${source.id}`} className="block text-xs font-medium text-ink/70 mb-1">
                    משכורת ותשלומים חייבים במס (158/172) (₪)
                  </label>
                  <input
                    id={`source-income-${source.id}`}
                    aria-describedby={`source-income-help-${source.id}`}
                    type="number"
                    inputMode="decimal"
                    min="0"
                    step="0.01"
                    value={source.taxableIncome}
                    onChange={(event) => updateSource(source.id, 'taxableIncome', event.target.value)}
                    className="w-full border border-ink/20 px-3 py-2"
                    required
                  />
                  <p id={`source-income-help-${source.id}`} className="mt-1 text-xs leading-relaxed text-ink/65">
                    העתיקו את הסכום השנתי של שדה 158/172. אם הסכום הוא 0, הזינו 0.
                  </p>
                </div>
                <div>
                  <label htmlFor={`source-withheld-${source.id}`} className="block text-xs font-medium text-ink/70 mb-1">
                    מס הכנסה שנוכה (042) (₪)
                  </label>
                  <input
                    id={`source-withheld-${source.id}`}
                    aria-describedby={`source-withheld-help-${source.id}`}
                    type="number"
                    inputMode="decimal"
                    min="0"
                    step="0.01"
                    value={source.taxWithheld}
                    onChange={(event) => updateSource(source.id, 'taxWithheld', event.target.value)}
                    className="w-full border border-ink/20 px-3 py-2"
                    required
                  />
                  <p id={`source-withheld-help-${source.id}`} className="mt-1 text-xs leading-relaxed text-ink/65">
                    העתיקו את סכום מס ההכנסה שנוכה בשדה 042. אם לא נוכה מס, הזינו 0.
                  </p>
                </div>

                {pensionCreditMode === 'automatic' ? (
                  <>
                    <div>
                      <label htmlFor={`source-insured-income-${source.id}`} className="block text-xs font-medium text-ink/70 mb-1">
                        הכנסה מבוטחת (244/245) (₪)
                      </label>
                      <input
                        id={`source-insured-income-${source.id}`}
                        aria-describedby={`source-insured-income-help-${source.id}`}
                        type="number"
                        inputMode="decimal"
                        min="0"
                        step="0.01"
                        value={source.insuredIncome}
                        onChange={(event) => updateSource(source.id, 'insuredIncome', event.target.value)}
                        className="w-full border border-ink/20 px-3 py-2"
                        required
                      />
                      <p id={`source-insured-income-help-${source.id}`} className="mt-1 text-xs leading-relaxed text-ink/65">
                        העתיקו את שדה 244/245. אין להזין הפקדות מעסיק 248/249 או כספי פיצויים.
                        במקור אחר, כגון אישור ביטוח לאומי, הזינו 0.
                      </p>
                    </div>
                    <div>
                      <label htmlFor={`source-pension-contributions-${source.id}`} className="block text-xs font-medium text-ink/70 mb-1">
                        הפקדות עובד לקצבה (045/086) (₪)
                      </label>
                      <input
                        id={`source-pension-contributions-${source.id}`}
                        aria-describedby={`source-pension-contributions-help-${source.id}`}
                        type="number"
                        inputMode="decimal"
                        min="0"
                        step="0.01"
                        value={source.employeePensionContributions}
                        onChange={(event) => updateSource(source.id, 'employeePensionContributions', event.target.value)}
                        className="w-full border border-ink/20 px-3 py-2"
                        required
                      />
                      <p id={`source-pension-contributions-help-${source.id}`} className="mt-1 text-xs leading-relaxed text-ink/65">
                        העתיקו רק הפקדות עובד בשדה 045/086. אין להזין הפקדות מעסיק 248/249
                        או כספי פיצויים; במקור שאינו מעסיק הזינו 0.
                      </p>
                    </div>
                  </>
                ) : null}
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addSource}
            className="inline-flex items-center gap-2 border border-ink/20 bg-white px-4 py-2 text-sm font-medium text-ink hover:border-gold"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            הוספת מקור הכנסה
          </button>
          <p className="text-xs leading-relaxed text-ink/65">
            הכפתור מוסיף שורת הזנה ידנית בלבד; הוא אינו מצרף או מעלה מסמך.
          </p>
        </fieldset>

        <details className="border border-ink/15 bg-cream-2 p-4">
          <summary className="cursor-pointer font-medium text-ink">
            <span className="me-2 font-mono text-xs font-bold uppercase tracking-[0.12em] text-gold">שלב 3</span>
            שדות מתקדמים — רק לפי אישור או חישוב שנבדק
          </summary>
          <div className="mt-4 grid gap-5 md:grid-cols-2">
            <div>
              <label htmlFor="refund-deductions" className="block text-sm font-medium text-ink mb-2">
                ניכויים מוכרים מההכנסה (₪)
              </label>
              <input
                id="refund-deductions"
                aria-describedby="refund-deductions-help"
                type="number"
                inputMode="decimal"
                min="0"
                step="0.01"
                value={recognizedDeductions}
                onChange={(event) => {
                  setRecognizedDeductions(event.target.value);
                  invalidateResult();
                }}
                className="w-full border border-ink/20 px-3 py-2.5"
              />
              <p id="refund-deductions-help" className="mt-1 text-xs text-ink/65">
                סכום ניכוי שכבר חושב ואומת, לא סכום ההפקדה או ההוצאה. אין להזין כאן
                הפקדות פנסיה או זיכוי פנסיה.
              </p>
            </div>
            <div>
              <label htmlFor="refund-extra-credits" className="block text-sm font-medium text-ink mb-2">
                זיכויי מס נוספים (₪)
              </label>
              <input
                id="refund-extra-credits"
                aria-describedby="refund-extra-credits-help"
                type="number"
                inputMode="decimal"
                min="0"
                step="0.01"
                value={additionalTaxCredits}
                onChange={(event) => {
                  setAdditionalTaxCredits(event.target.value);
                  invalidateResult();
                }}
                className="w-full border border-ink/20 px-3 py-2.5"
              />
              <p id="refund-extra-credits-help" className="mt-1 text-xs text-ink/65">
                הזינו את מלוא סכום הזיכוי השנתי שכבר חושב ואומת, לא רק סכום שלדעתכם הוחמץ
                בתלוש ולא את סכום ההוצאה. אין לכלול כאן נקודות זיכוי, זיכוי פנסיה או תרומות
                שכבר מחושבים בכלי.
              </p>
            </div>
            <div>
              <label htmlFor="refund-donations" className="block text-sm font-medium text-ink mb-2">
                סך תרומות מוכרות לפי סעיף 46 (₪)
              </label>
              <input
                id="refund-donations"
                aria-describedby="refund-donations-help"
                type="number"
                inputMode="decimal"
                min="0"
                step="0.01"
                value={donations}
                onChange={(event) => {
                  setDonations(event.target.value);
                  invalidateResult();
                }}
                className="w-full border border-ink/20 px-3 py-2.5"
              />
              <p id="refund-donations-help" className="mt-1 text-xs leading-relaxed text-ink/65">
                הזינו סכום שנתי כולל: תרומות שנוכו בתלוש בשדות 037/237 וכן קבלות מוכרות שלא
                נכללו שם. ספרו כל קבלה פעם אחת בלבד ואל תוסיפו שוב תרומה שכבר מופיעה בתלוש.
              </p>
            </div>
          </div>
        </details>

        <section aria-labelledby="refund-step-4" className="space-y-3 border-r-4 border-gold bg-gold/8 p-4 text-sm leading-relaxed text-ink">
          <div>
            <p className="font-mono text-xs font-bold uppercase tracking-[0.12em] text-gold">שלב 4</p>
            <h3 id="refund-step-4" className="mt-1 font-bold text-ink">אישור שלמות הנתונים והיקף האומדן</h3>
          </div>
          <label htmlFor="refund-all-data-confirmed" className="flex items-start gap-3">
            <input
              id="refund-all-data-confirmed"
              type="checkbox"
              checked={allDocumentsConfirmed}
              onChange={(event) => {
                setAllDocumentsConfirmed(event.target.checked);
                invalidateResult(false);
              }}
              className="mt-1 h-4 w-4 flex-none"
            />
            <span>הזנתי את כל הנתונים מכל טופסי 106 ומכל אישורי ההכנסה והמס שנוכה באותה שנת מס.</span>
          </label>
          <label htmlFor="refund-simple-case-confirmed" className="flex items-start gap-3">
            <input
              id="refund-simple-case-confirmed"
              type="checkbox"
              checked={simpleCaseConfirmed}
              onChange={(event) => {
                setSimpleCaseConfirmed(event.target.checked);
                invalidateResult(false);
              }}
              className="mt-1 h-4 w-4 flex-none"
            />
            <span>
              זהו אומדן לשכיר/ה המבוסס על הכנסה מיגיעה אישית בלבד. אין בחישוב עסק עצמאי,
              רווחי הון, הכנסות מחו״ל, שכירות במסלול המחייב חישוב נפרד, אירוע פרישה או חובת דיווח
              מיוחדת עם בן או בת זוג.
              {pensionCreditMode === 'automatic' ? (
                <span className="mt-1 block">
                  במסלול הפנסיה האוטומטי, כל מקור הכנסה עם הפקדות הוא שכר שמבוטח במלואו ואין
                  ניכויים מוכרים, הפקדות פרטיות, ביטוח חיים או שאירים מתחרה, או חלוקת זכאות בין בני זוג.
                </span>
              ) : null}
            </span>
          </label>
        </section>

        {error ? <p role="alert" className="border border-red-300 bg-red-50 p-3 text-sm text-red-800">{error}</p> : null}

        <button
          type="submit"
          className="w-full bg-ink px-5 py-3.5 font-bold text-gold-light transition hover:bg-ink-deep focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2"
        >
          חשב אומדן הפרש מס
        </button>
      </form>

      {result ? (
        <section
          ref={resultRef}
          tabIndex={-1}
          aria-live="polite"
          aria-labelledby="refund-result-title"
          className="scroll-mt-6 space-y-4 focus:outline-none"
        >
          <h2 id="refund-result-title" className="text-2xl font-bold text-ink">תוצאת האומדן לשנת {result.taxYear}</h2>
          <p className="text-sm leading-relaxed text-ink/75">{PROFESSIONAL_ADVICE_NOTICE}</p>

          {result.estimatedRefund > 0 ? (
            <ResultCard
              title="אומדן מס שנוכה ביתר"
              value={formatCurrency(result.estimatedRefund)}
              subtitle="סכום חיובי אינו אישור זכאות ואינו כולל הצמדה"
              variant="success"
            />
          ) : result.estimatedBalanceDue > 0 ? (
            <ResultCard
              title="אומדן יתרת מס אפשרית לתשלום"
              value={formatCurrency(result.estimatedBalanceDue)}
              subtitle="מומלץ לבדוק את הנתונים לפני הגשת בקשה"
              variant="warning"
            />
          ) : (
            <ResultCard
              title="אומדן הפרש המס"
              value={formatCurrency(0)}
              subtitle="לפי הנתונים שהוזנו לא נמצא הפרש"
            />
          )}

          <Breakdown
            title="פירוט האומדן השנתי"
            defaultOpen
            items={[
              { label: 'הכנסה חייבת מכל המקורות', value: formatCurrency(result.totalIncomeBeforeDeductions) },
              ...(result.recognizedDeductions > 0
                ? [{ label: 'ניכויים מוכרים שהוזנו', value: `-${formatCurrency(result.recognizedDeductions)}` }]
                : []),
              { label: 'הכנסה חייבת לאחר ניכויים', value: formatCurrency(result.taxableIncome), bold: true },
              ...result.bracketBreakdown.map((bracket) => ({
                label: `מס במדרגת ${formatPercent(bracket.rate, 0)}`,
                value: formatCurrency(bracket.tax),
                note: `על ${formatCurrency(bracket.taxableAmount)}`,
              })),
              ...(result.surtax > 0 ? [{ label: 'מס יסף 3%', value: formatCurrency(result.surtax) }] : []),
              { label: 'מס לפני זיכויים', value: formatCurrency(result.taxBeforeCredits), bold: true },
              {
                label: 'נקודות זיכוי',
                value: `-${formatCurrency(result.creditPointsAmount)}`,
                note: `${result.creditPoints} נקודות × ${formatCurrency(result.creditPointValueAnnual)} לשנה`,
              },
              ...(pensionCreditMode === 'automatic'
                ? [
                    { label: 'הכנסה מבוטחת לפנסיה', value: formatCurrency(result.insuredIncome) },
                    { label: 'הפקדות עובד לקצבה', value: formatCurrency(result.pensionContributions) },
                    {
                      label: 'הפקדות מזכות לפנסיה',
                      value: formatCurrency(result.pensionEligibleContributions),
                      note: 'לאחר החלת התקרה השנתית המשותפת לכל מקורות ההכנסה',
                    },
                  ]
                : []),
              {
                label: pensionCreditMode === 'manual' ? 'זיכוי פנסיה שנתי מאומת' : 'זיכוי מס בגין פנסיה',
                value:
                  result.pensionTaxCredit > 0
                    ? `-${formatCurrency(result.pensionTaxCredit)}`
                    : formatCurrency(0),
                note:
                  pensionCreditMode === 'manual'
                    ? 'הסכום הידני החליף את החישוב האוטומטי'
                    : '35% מההפקדות המזכות במסלול הפשוט',
              },
              ...(asNumber(donations) > 0
                ? [
                    {
                      label: 'סך תרומות מוכרות שהוזן',
                      value: formatCurrency(asNumber(donations)),
                    },
                    {
                      label: 'סכום תרומות מזכה בשנת המס',
                      value: formatCurrency(result.donationEligibleAmount),
                    },
                    {
                      label: 'זיכוי מס לפי סעיף 46',
                      value:
                        result.donationTaxCredit > 0
                          ? `-${formatCurrency(result.donationTaxCredit)}`
                          : formatCurrency(0),
                    },
                  ]
                : []),
              ...(result.donationExcess > 0
                ? [
                    {
                      label: 'תרומות שאינן מזכות בשנת המס הנוכחית',
                      value: formatCurrency(result.donationExcess),
                      note: 'הסכום אינו זיכוי מס נוכחי ואינו מועבר אוטומטית לשנים אחרות',
                    },
                  ]
                : []),
              ...(result.additionalTaxCredits > 0
                ? [{ label: 'זיכויי מס נוספים שהוזנו', value: `-${formatCurrency(result.additionalTaxCredits)}` }]
                : []),
              { label: 'חבות מס שנתית באומדן', value: formatCurrency(result.taxAfterCredits), bold: true },
              { label: 'מס שנוכה בפועל', value: formatCurrency(result.totalTaxWithheld), bold: true },
            ]}
          />

          <div className="border-r-4 border-gold bg-cream-2 p-4 text-sm leading-relaxed text-ink/75">
            התוצאה אינה כוללת ריבית והצמדה ואינה מחליפה את הדמיית המס של רשות המסים. לפני הגשה יש
            להשוות את כל הסכומים לטופסי 106, לאישורי ביטוח לאומי ולמסמכי הזכאות של שנת המס שנבחרה.
            חישוב הפנסיה האוטומטי מכסה הפקדות עובד רגילות משכר שמבוטח במלואו וללא ניכויים;
            מקרים אחרים דורשים סכום זיכוי שנתי מאומת. יתרת תרומות שאינה מזכה בשנה הנוכחית
            אינה מועברת אוטומטית לשנת מס אחרת.
          </div>
        </section>
      ) : null}
    </div>
  );
}
