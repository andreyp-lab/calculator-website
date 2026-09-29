'use client';

import { useMemo, useState } from 'react';
import { calculateMortgage, type AmortizationMethod } from '@/lib/calculators/mortgage';
import { formatCurrency } from '@/lib/utils/formatters';

export function MortgageCalculator() {
  const [amount, setAmount] = useState(1_000_000);
  const [annualRate, setAnnualRate] = useState(4.5);
  const [years, setYears] = useState(25);
  const [method, setMethod] = useState<AmortizationMethod>('shpitzer');
  const result = useMemo(() => calculateMortgage({ loanAmount: amount, interestRate: annualRate, termYears: years, method }), [amount, annualRate, years, method]);
  const valid = Number.isFinite(amount) && amount > 0 && Number.isFinite(annualRate) && annualRate >= 0
    && Number.isInteger(years) && years >= 1 && years <= 30;

  return <div className="grid gap-6 lg:grid-cols-2" dir="rtl">
    <div className="space-y-5 border border-ink/20 bg-paper p-6">
      <h2 className="text-xl font-bold">פרטי המסלול</h2>
      <label className="block text-sm font-medium">סכום ההלוואה (₪)
        <input className="mt-2 w-full border border-ink/25 px-3 py-2 text-lg" type="number" min="1" step="10000" value={amount} onChange={(event) => setAmount(Number(event.target.value))} />
      </label>
      <label className="block text-sm font-medium">ריבית שנתית לפי ההצעה (%)
        <input className="mt-2 w-full border border-ink/25 px-3 py-2 text-lg" type="number" min="0" step="0.1" value={annualRate} onChange={(event) => setAnnualRate(Number(event.target.value))} />
      </label>
      <label className="block text-sm font-medium">תקופה בשנים
        <input className="mt-2 w-full border border-ink/25 px-3 py-2 text-lg" type="number" min="1" max="30" step="1" value={years} onChange={(event) => setYears(Number(event.target.value))} />
      </label>
      <fieldset>
        <legend className="mb-2 text-sm font-medium">שיטת החזר</legend>
        <div className="flex flex-wrap gap-5">
          <label className="flex items-center gap-2"><input type="radio" name="mortgage-method" checked={method === 'shpitzer'} onChange={() => setMethod('shpitzer')} />שפיצר</label>
          <label className="flex items-center gap-2"><input type="radio" name="mortgage-method" checked={method === 'equal-principal'} onChange={() => setMethod('equal-principal')} />קרן שווה</label>
        </div>
      </fieldset>
      {!valid && <p className="text-sm text-red-700" role="alert">הזינו סכום חיובי, ריבית לא שלילית ותקופה שלמה בין שנה ל־30 שנים.</p>}
    </div>
    <div className="space-y-5 border border-ink/20 bg-cream-2 p-6" aria-live="polite">
      <h2 className="text-xl font-bold">אומדן למסלול אחד</h2>
      <p><span className="block text-sm text-ink/70">תשלום ראשון</span><strong className="text-3xl">{valid ? formatCurrency(result.firstPayment) : '—'}</strong></p>
      {method === 'equal-principal' && <p><span className="block text-sm text-ink/70">תשלום אחרון</span><strong className="text-xl">{valid ? formatCurrency(result.lastPayment) : '—'}</strong></p>}
      <p><span className="block text-sm text-ink/70">סך תשלומים לפי ריבית קבועה</span><strong className="text-xl">{valid ? formatCurrency(result.totalPayments) : '—'}</strong></p>
      <p><span className="block text-sm text-ink/70">מתוכם ריבית</span><strong className="text-xl">{valid ? formatCurrency(result.totalInterest) : '—'}</strong></p>
      <p className="border-r-4 border-amber-500 bg-amber-50 p-3 text-sm leading-relaxed">החישוב מניח שהריבית שהזנתם אינה משתנה לאורך כל התקופה. הוא אינו כולל הצמדה למדד, עמלות או ביטוחים. התשלום במסלול משתנה או צמוד עשוי להיות שונה; השוו לאישור העקרוני של הבנק.</p>
    </div>
  </div>;
}
