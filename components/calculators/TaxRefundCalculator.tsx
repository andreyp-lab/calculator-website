'use client';

import { useRef, useState, type FormEvent } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import {
  calculateTaxRefund,
  TAX_REFUND_YEAR_RULES,
  type TaxRefundResult,
  type TaxRefundYear,
} from '@/lib/calculators/tax-refund';
import { formatCurrency, formatPercent } from '@/lib/utils/formatters';
import { ResultCard } from '@/components/calculator/ResultCard';
import { Breakdown } from '@/components/calculator/Breakdown';

interface DraftIncomeSource {
  id: number;
  label: string;
  taxableIncome: string;
  taxWithheld: string;
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
};

function asNumber(value: string): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.max(0, parsed) : 0;
}

function trackCalculation(result: TaxRefundResult, sourceCount: number) {
  const analytics = window as AnalyticsWindow;
  analytics.dataLayer = analytics.dataLayer || [];
  analytics.gtag = analytics.gtag || function gtag(...args: unknown[]) {
    analytics.dataLayer?.push(args);
  };
  analytics.gtag('event', 'tax_refund_calculation', {
    tax_year: result.taxYear,
    result_type: result.estimatedRefund > 0 ? 'refund' : result.estimatedBalanceDue > 0 ? 'balance_due' : 'balanced',
    source_count: String(sourceCount),
  });
}

export function TaxRefundCalculator() {
  const nextId = useRef(2);
  const [taxYear, setTaxYear] = useState<TaxRefundYear>('2025');
  const [sources, setSources] = useState<DraftIncomeSource[]>([initialSource]);
  const [creditPoints, setCreditPoints] = useState('2.25');
  const [recognizedDeductions, setRecognizedDeductions] = useState('0');
  const [additionalTaxCredits, setAdditionalTaxCredits] = useState('0');
  const [allDocumentsConfirmed, setAllDocumentsConfirmed] = useState(false);
  const [simpleCaseConfirmed, setSimpleCaseConfirmed] = useState(false);
  const [result, setResult] = useState<TaxRefundResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  function invalidateResult() {
    setResult(null);
    setError(null);
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
      },
    ]);
    invalidateResult();
  }

  function removeSource(id: number) {
    setSources((current) => current.filter((source) => source.id !== id));
    invalidateResult();
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!allDocumentsConfirmed || !simpleCaseConfirmed) {
      setError('יש לאשר שכל האישורים הוזנו ושהמקרה מתאים לאומדן הפשוט לפני החישוב.');
      setResult(null);
      return;
    }

    const incomeSources = sources.map((source) => ({
      taxableIncome: asNumber(source.taxableIncome),
      taxWithheld: asNumber(source.taxWithheld),
    }));

    if (!incomeSources.some((source) => source.taxableIncome > 0)) {
      setError('יש להזין הכנסה חייבת שנתית אחת לפחות מתוך טופס 106 או אישור שנתי.');
      setResult(null);
      return;
    }

    const calculation = calculateTaxRefund({
      taxYear,
      incomeSources,
      creditPoints: asNumber(creditPoints),
      recognizedDeductions: asNumber(recognizedDeductions),
      additionalTaxCredits: asNumber(additionalTaxCredits),
    });

    setResult(calculation);
    setError(null);
    trackCalculation(calculation, incomeSources.length);
  }

  const deadline = TAX_REFUND_YEAR_RULES[taxYear].claimDeadline;

  return (
    <div className="space-y-6">
      <form onSubmit={submit} className="bg-paper border-2 border-ink/15 p-5 md:p-6 space-y-7">
        <div>
          <h2 className="text-xl font-bold text-ink">נתונים שנתיים מהאישורים</h2>
          <p className="mt-2 text-sm leading-relaxed text-ink/70">
            החישוב מתבצע בדפדפן בלבד. הנתונים אינם נשלחים ואינם נשמרים באתר.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label htmlFor="refund-tax-year" className="block text-sm font-medium text-ink mb-2">
              שנת המס
            </label>
            <select
              id="refund-tax-year"
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
            <p className="mt-1 text-xs text-ink/65">
              מועד הגשה משוער לשנה זו: עד {new Intl.DateTimeFormat('he-IL').format(new Date(`${deadline}T12:00:00`))}
            </p>
          </div>

          <div>
            <label htmlFor="refund-credit-points" className="block text-sm font-medium text-ink mb-2">
              ממוצע נקודות זיכוי לשנה
            </label>
            <input
              id="refund-credit-points"
              type="number"
              inputMode="decimal"
              min="0"
              max="20"
              step="0.01"
              value={creditPoints}
              onChange={(event) => {
                setCreditPoints(event.target.value);
                invalidateResult();
              }}
              className="w-full border border-ink/20 px-3 py-2.5 focus:border-gold focus:ring-2 focus:ring-gold/25"
            />
            <p className="mt-1 text-xs text-ink/65">
              הזינו את המספר שנבדק לשנת המס. אם הזכאות השתנתה במהלך השנה, נדרש ממוצע שנתי מתאים.
            </p>
          </div>
        </div>

        <fieldset className="space-y-4">
          <legend className="font-bold text-ink">טופסי 106 ואישורי הכנסה</legend>
          <p className="text-sm text-ink/70">
            לכל מעסיק או אישור שנתי הוסיפו את ההכנסה החייבת ואת מס ההכנסה שנוכה — לא את הנטו.
          </p>

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

              <div className="grid gap-4 md:grid-cols-3">
                <div>
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
                    הכנסה חייבת שנתית (₪)
                  </label>
                  <input
                    id={`source-income-${source.id}`}
                    type="number"
                    inputMode="decimal"
                    min="0"
                    step="1"
                    value={source.taxableIncome}
                    onChange={(event) => updateSource(source.id, 'taxableIncome', event.target.value)}
                    className="w-full border border-ink/20 px-3 py-2"
                    required={index === 0}
                  />
                </div>
                <div>
                  <label htmlFor={`source-withheld-${source.id}`} className="block text-xs font-medium text-ink/70 mb-1">
                    מס הכנסה שנוכה (₪)
                  </label>
                  <input
                    id={`source-withheld-${source.id}`}
                    type="number"
                    inputMode="decimal"
                    min="0"
                    step="1"
                    value={source.taxWithheld}
                    onChange={(event) => updateSource(source.id, 'taxWithheld', event.target.value)}
                    className="w-full border border-ink/20 px-3 py-2"
                  />
                </div>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addSource}
            className="inline-flex items-center gap-2 border border-ink/20 bg-white px-4 py-2 text-sm font-medium text-ink hover:border-gold"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            הוספת מעסיק או אישור
          </button>
        </fieldset>

        <details className="border border-ink/15 bg-cream-2 p-4">
          <summary className="cursor-pointer font-medium text-ink">שדות מתקדמים — רק לפי אישור או חישוב שנבדק</summary>
          <div className="mt-4 grid gap-5 md:grid-cols-2">
            <div>
              <label htmlFor="refund-deductions" className="block text-sm font-medium text-ink mb-2">
                ניכויים מוכרים מההכנסה (₪)
              </label>
              <input
                id="refund-deductions"
                type="number"
                inputMode="decimal"
                min="0"
                step="1"
                value={recognizedDeductions}
                onChange={(event) => {
                  setRecognizedDeductions(event.target.value);
                  invalidateResult();
                }}
                className="w-full border border-ink/20 px-3 py-2.5"
              />
              <p className="mt-1 text-xs text-ink/65">סכום הניכוי המוכר, לא סכום ההפקדה או ההוצאה.</p>
            </div>
            <div>
              <label htmlFor="refund-extra-credits" className="block text-sm font-medium text-ink mb-2">
                זיכויי מס נוספים (₪)
              </label>
              <input
                id="refund-extra-credits"
                type="number"
                inputMode="decimal"
                min="0"
                step="1"
                value={additionalTaxCredits}
                onChange={(event) => {
                  setAdditionalTaxCredits(event.target.value);
                  invalidateResult();
                }}
                className="w-full border border-ink/20 px-3 py-2.5"
              />
              <p className="mt-1 text-xs text-ink/65">סכום הזיכוי במס שכבר חושב, לא סכום התרומה או התשלום.</p>
            </div>
          </div>
        </details>

        <div className="space-y-3 border-r-4 border-gold bg-gold/8 p-4 text-sm leading-relaxed text-ink">
          <label className="flex items-start gap-3">
            <input
              type="checkbox"
              checked={allDocumentsConfirmed}
              onChange={(event) => {
                setAllDocumentsConfirmed(event.target.checked);
                invalidateResult();
              }}
              className="mt-1 h-4 w-4 flex-none"
            />
            <span>הזנתי את כל טופסי 106 ואת כל אישורי ההכנסה והמס שנוכה באותה שנת מס.</span>
          </label>
          <label className="flex items-start gap-3">
            <input
              type="checkbox"
              checked={simpleCaseConfirmed}
              onChange={(event) => {
                setSimpleCaseConfirmed(event.target.checked);
                invalidateResult();
              }}
              className="mt-1 h-4 w-4 flex-none"
            />
            <span>
              זהו אומדן לשכיר/ה המבוסס על הכנסה מיגיעה אישית בלבד. אין בחישוב עסק עצמאי,
              רווחי הון, הכנסות מחו״ל, שכירות במסלול המחייב חישוב נפרד, אירוע פרישה או חובת דיווח
              מיוחדת עם בן או בת זוג.
            </span>
          </label>
        </div>

        {error ? <p role="alert" className="border border-red-300 bg-red-50 p-3 text-sm text-red-800">{error}</p> : null}

        <button
          type="submit"
          className="w-full bg-ink px-5 py-3.5 font-bold text-gold-light transition hover:bg-ink-deep focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2"
        >
          חשב אומדן הפרש מס
        </button>
      </form>

      {result ? (
        <section aria-live="polite" aria-labelledby="refund-result-title" className="space-y-4">
          <h2 id="refund-result-title" className="text-2xl font-bold text-ink">תוצאת האומדן לשנת {result.taxYear}</h2>

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
          </div>
        </section>
      ) : null}
    </div>
  );
}
