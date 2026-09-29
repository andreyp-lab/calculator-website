'use client';

import { useMemo, useState } from 'react';
import { calculateLoanRepayment } from '@/lib/calculators/savings';

const currency = new Intl.NumberFormat('he-IL', { style: 'currency', currency: 'ILS', maximumFractionDigits: 0 });

export function BasicLoanCalculator() {
  const [amount, setAmount] = useState(100000);
  const [annualRate, setAnnualRate] = useState(7);
  const [months, setMonths] = useState(60);
  const valid = Number.isFinite(amount) && amount > 0 && Number.isFinite(annualRate) && annualRate >= 0 && annualRate <= 100 && Number.isInteger(months) && months > 0 && months <= 600;
  const result = useMemo(() => valid ? calculateLoanRepayment({ loanAmount: amount, annualRate, termMonths: months, extraMonthlyPayment: 0, oneTimePayment: 0 }) : null, [valid, amount, annualRate, months]);

  return (
    <div className="border border-ink/15 bg-paper p-5 space-y-5">
      <div className="grid gap-4 sm:grid-cols-3">
        <label className="text-sm font-medium">סכום ההלוואה (₪)
          <input type="number" min="1" step="1000" value={amount} onChange={event => setAmount(Number(event.target.value))} className="mt-2 w-full border border-ink/20 bg-white p-2" />
        </label>
        <label className="text-sm font-medium">ריבית שנתית נומינלית (%)
          <input type="number" min="0" max="100" step="0.1" value={annualRate} onChange={event => setAnnualRate(Number(event.target.value))} className="mt-2 w-full border border-ink/20 bg-white p-2" />
        </label>
        <label className="text-sm font-medium">תקופה (חודשים)
          <input type="number" min="1" max="600" step="1" value={months} onChange={event => setMonths(Number(event.target.value))} className="mt-2 w-full border border-ink/20 bg-white p-2" />
        </label>
      </div>
      {!valid && <p role="alert" className="text-red-700">יש להזין סכום חיובי, ריבית בין 0% ל־100% ותקופה של 1–600 חודשים.</p>}
      {result && <div className="grid gap-3 sm:grid-cols-3" aria-live="polite">
        <div><p className="text-sm text-ink/70">החזר חודשי</p><p className="text-xl font-bold">{currency.format(result.monthlyPayment)}</p></div>
        <div><p className="text-sm text-ink/70">סך תשלומים</p><p className="text-xl font-bold">{currency.format(result.totalPayments)}</p></div>
        <div><p className="text-sm text-ink/70">מתוכם ריבית</p><p className="text-xl font-bold">{currency.format(result.totalInterest)}</p></div>
      </div>}
      <p className="text-xs text-ink/70">הדמיה לריבית קבועה לא צמודה בלבד; ללא עמלות, ביטוח או שינויי ריבית. השתמשו בנתוני הצעה אישית.</p>
    </div>
  );
}
