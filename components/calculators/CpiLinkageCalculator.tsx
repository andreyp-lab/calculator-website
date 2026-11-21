'use client';

import { useMemo, useState } from 'react';
import { linkToCpi, supportedDateRange } from '@/lib/calculators/cpi-linkage';
import { CPI_LAST_MONTH, CPI_VERIFIED_AT, CPI_SOURCE_URL } from '@/lib/data/cpi-series';

const field = 'mt-2 block w-full border border-ink/20 bg-cream p-3';
const money = (v: number) => `${v.toLocaleString('he-IL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₪`;
const BASE_LABEL: Record<string, string> = {
  '2018': 'ממוצע 2018',
  '2020': 'ממוצע 2020',
  '2022': 'ממוצע 2022',
  '2024': 'ממוצע 2024',
};

export function CpiLinkageCalculator() {
  const range = supportedDateRange();
  const [amount, setAmount] = useState('5000');
  const [from, setFrom] = useState('2024-01');
  const [to, setTo] = useState(range.max);

  const result = useMemo(
    () => linkToCpi({ amount: Number(amount), fromMonth: from, toMonth: to }),
    [amount, from, to],
  );

  return (
    <div className="my-8 border border-ink/15 bg-paper p-6" dir="rtl">
      <h2 className="mb-4 text-xl font-bold">חישוב הצמדה למדד המחירים לצרכן</h2>
      <div className="grid gap-4 sm:grid-cols-3">
        <label className="block">
          סכום (₪)
          <input className={field} type="number" min="0" inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)} />
        </label>
        <label className="block">
          מתאריך (חודש)
          <input className={field} type="month" min={range.min} max={range.max} value={from} onChange={(e) => setFrom(e.target.value)} />
        </label>
        <label className="block">
          עד תאריך (חודש)
          <input className={field} type="month" min={range.min} max={range.max} value={to} onChange={(e) => setTo(e.target.value)} />
        </label>
      </div>

      <div className="mt-6" aria-live="polite">
        {result ? (
          <>
            <p className="text-2xl font-bold">הסכום המוצמד: {money(result.linkedAmount)}</p>
            <p className="mt-2">
              שינוי בתקופה: <strong>{result.changePct}%</strong>
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="border border-ink/15 bg-cream p-3">
                <div className="text-sm text-ink/70">מדד ידוע לתאריך הבסיס ({result.fromIndexMonth})</div>
                <div className="text-lg font-bold">{result.fromIndexPublished} <span className="text-sm font-normal">בסיס {BASE_LABEL[result.fromBase]}</span></div>
              </div>
              <div className="border border-ink/15 bg-cream p-3">
                <div className="text-sm text-ink/70">מדד ידוע לתאריך החישוב ({result.toIndexMonth})</div>
                <div className="text-lg font-bold">{result.toIndexPublished} <span className="text-sm font-normal">בסיס {BASE_LABEL[result.toBase]}</span></div>
              </div>
            </div>
            {result.crossedBase && (
              <p className="mt-3 text-sm text-ink/70">
                בין שני התאריכים הלמ״ס החליף בסיס מדד, ולכן הערכים שורשרו במקדמי השרשור הרשמיים של הלמ״ס.
              </p>
            )}
          </>
        ) : (
          <p className="font-bold">בחרו תאריכים בטווח {range.min} עד {range.max} והזינו סכום חיובי.</p>
        )}
      </div>

      <p className="mt-5 text-sm leading-relaxed text-ink/70">
        החישוב לפי המדד הידוע: תאריך בחודש מסוים מוצמד למדד של חודשיים קודם. המדד האחרון בנתונים הוא{' '}
        {CPI_LAST_MONTH} (נבדק מול הלמ״ס ב־{CPI_VERIFIED_AT}). הסכמים מסוימים מוצמדים למדד &quot;בגין&quot; או לתאריך
        אחר, ולכן בדקו מה כתוב בהסכם שלכם.{' '}
        <a className="font-bold text-gold underline" href={CPI_SOURCE_URL} target="_blank" rel="noopener noreferrer">
          נתוני הלמ״ס ↗
        </a>
      </p>
    </div>
  );
}
