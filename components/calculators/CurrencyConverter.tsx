'use client';

import { useMemo, useState } from 'react';
import { convertCurrency } from '@/lib/calculators/currency';
import { CURRENCY_NAMES, type CurrencyCode } from '@/lib/data/exchange-rates';

const field = 'mt-2 block w-full border border-ink/20 bg-cream p-3';
const num = (v: number, d = 2) =>
  v.toLocaleString('he-IL', { minimumFractionDigits: d, maximumFractionDigits: d });

interface Props {
  /** ₪ ל-1 יחידת מטבע, כפי שנמשך בשרת */
  ilsPerUnit: Partial<Record<CurrencyCode, number>>;
  updatedAt: string | null;
  sourceLabel: string;
  sourceUrl: string;
}

export function CurrencyConverter({ ilsPerUnit, updatedAt, sourceLabel, sourceUrl }: Props) {
  const available = (Object.keys(CURRENCY_NAMES) as CurrencyCode[]).filter((c) => ilsPerUnit[c]);
  const [amount, setAmount] = useState('1000');
  const [from, setFrom] = useState<string>(available.includes('USD') ? 'USD' : available[0]);
  const [to, setTo] = useState<string>('ILS');
  const [commission, setCommission] = useState('0');

  const result = useMemo(
    () =>
      convertCurrency({
        amount: Number(amount),
        from,
        to,
        ilsPerUnit,
        commissionPct: Number(commission),
      }),
    [amount, from, to, ilsPerUnit, commission],
  );

  const options = (
    <>
      <option value="ILS">שקל ישראלי (ILS)</option>
      {available.map((c) => (
        <option key={c} value={c}>
          {CURRENCY_NAMES[c]} ({c})
        </option>
      ))}
    </>
  );

  return (
    <div className="my-8 border border-ink/15 bg-paper p-6" dir="rtl">
      <h2 className="mb-4 text-xl font-bold">המרת מטבע לפי שער יציג</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          סכום
          <input className={field} type="number" min="0" inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)} />
        </label>
        <label className="block">
          עמלת ההמרה של הבנק או הסוחר (%)
          <input className={field} type="number" min="0" max="20" step="0.1" inputMode="decimal" value={commission} onChange={(e) => setCommission(e.target.value)} />
        </label>
        <label className="block">
          מ־
          <select className={field} value={from} onChange={(e) => setFrom(e.target.value)}>
            {options}
          </select>
        </label>
        <label className="block">
          ל־
          <select className={field} value={to} onChange={(e) => setTo(e.target.value)}>
            {options}
          </select>
        </label>
      </div>
      <button
        type="button"
        className="mt-3 text-sm underline"
        onClick={() => {
          setFrom(to);
          setTo(from);
        }}
      >
        החלפת כיוון
      </button>

      <div className="mt-5" aria-live="polite">
        {result ? (
          <>
            <p className="text-2xl font-bold">
              {num(result.net)} {to === 'ILS' ? '₪' : to}
            </p>
            <p className="mt-2 text-sm">
              לפי השער היציג: {num(result.gross)} {to === 'ILS' ? '₪' : to}
              {result.commission > 0 && <> · עמלה: {num(result.commission)} · שער אפקטיבי: {num(result.effectiveRate, 4)}</>}
              {' '}· 1 {from === 'ILS' ? '₪' : from} = {num(result.midRate, 4)} {to === 'ILS' ? '₪' : to}
            </p>
          </>
        ) : (
          <p className="font-bold">הזינו סכום חיובי ועמלה בין 0% ל־20%.</p>
        )}
      </div>

      <p className="mt-5 text-sm leading-relaxed text-ink/70">
        שערים: {sourceLabel}
        {updatedAt ? `, עודכנו ${new Date(updatedAt).toLocaleDateString('he-IL')}` : ''}. השער שתקבלו בפועל בבנק, בכרטיס
        אשראי או אצל מחליף כספים שונה מהשער היציג ומכיל מרווח ועמלה.{' '}
        <a className="font-bold text-gold underline" href={sourceUrl} target="_blank" rel="noopener noreferrer">
          מקור השערים ↗
        </a>
      </p>
    </div>
  );
}
