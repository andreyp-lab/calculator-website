'use client';

import { useState } from 'react';

const currency = new Intl.NumberFormat('he-IL', {
  style: 'currency', currency: 'ILS', minimumFractionDigits: 2, maximumFractionDigits: 2,
});

export function VatBasicCalculator() {
  const [amount, setAmount] = useState(1000);
  const [mode, setMode] = useState<'add' | 'extract'>('add');
  const safeAmount = Number.isFinite(amount) && amount >= 0 ? amount : 0;
  const net = mode === 'add' ? safeAmount : safeAmount / 1.18;
  const gross = mode === 'add' ? safeAmount * 1.18 : safeAmount;

  return (
    <section className="border border-ink/15 bg-paper p-6" aria-label="חישוב חשבוני של מע״מ בשיעור 18%">
      <div className="flex flex-wrap gap-3 mb-5" role="group" aria-label="סוג החישוב">
        <button type="button" aria-pressed={mode === 'add'} onClick={() => setMode('add')} className="border border-ink/30 px-4 py-2 aria-pressed:bg-ink aria-pressed:text-cream">הוספת מע״מ</button>
        <button type="button" aria-pressed={mode === 'extract'} onClick={() => setMode('extract')} className="border border-ink/30 px-4 py-2 aria-pressed:bg-ink aria-pressed:text-cream">חילוץ מע״מ</button>
      </div>
      <label htmlFor="vat-basic-amount" className="block font-semibold mb-2">{mode === 'add' ? 'סכום לפני מע״מ (₪)' : 'סכום הכולל מע״מ (₪)'}</label>
      <input id="vat-basic-amount" type="number" min="0" step="0.01" value={amount} onChange={(event) => setAmount(Number(event.target.value))} className="w-full max-w-sm border border-ink/30 px-3 py-2" />
      <dl className="mt-6 grid gap-3 sm:grid-cols-3">
        <div><dt>לפני מע״מ</dt><dd className="font-bold" dir="ltr">{currency.format(net)}</dd></div>
        <div><dt>מע״מ 18%</dt><dd className="font-bold" dir="ltr">{currency.format(gross - net)}</dd></div>
        <div><dt>כולל מע״מ</dt><dd className="font-bold" dir="ltr">{currency.format(gross)}</dd></div>
      </dl>
      <p className="mt-5 text-sm text-ink/70">חישוב מתמטי בשיעור הרגיל בלבד. שיעור המס החל בעסקה, עיתוי החיוב וזכאות לניכוי תשומות דורשים בדיקה לפי נסיבותיה.</p>
    </section>
  );
}
