'use client';

import { useMemo, useState } from 'react';
import { overdraftCost, overdraftPayoff, overdraftVsLoan } from '@/lib/calculators/overdraft';
import { MACRO_DATA } from '@/lib/data/macroeconomic-data';

const money = (v: number) =>
  `${v.toLocaleString('he-IL', { minimumFractionDigits: 0, maximumFractionDigits: 2 })} ₪`;

const field = 'mt-2 block w-full border border-ink/20 bg-cream p-3';

export function OverdraftCalculator() {
  const [balance, setBalance] = useState('10000');
  const [rate, setRate] = useState(String(MACRO_DATA.primeRate.value));
  const [days, setDays] = useState('30');
  const [paydown, setPaydown] = useState('1000');
  const [loanRate, setLoanRate] = useState('8');
  const [loanMonths, setLoanMonths] = useState('24');

  const cost = useMemo(
    () => overdraftCost({ averageOverdraft: Number(balance), annualRatePct: Number(rate), daysPerMonth: Number(days) }),
    [balance, rate, days],
  );
  const payoff = useMemo(
    () => overdraftPayoff({ balance: Number(balance), annualRatePct: Number(rate), monthlyPaydown: Number(paydown) }),
    [balance, rate, paydown],
  );
  const vsLoan = useMemo(
    () =>
      overdraftVsLoan({
        averageOverdraft: Number(balance),
        overdraftRatePct: Number(rate),
        daysPerMonth: Number(days),
        loanRatePct: Number(loanRate),
        loanMonths: Number(loanMonths),
      }),
    [balance, rate, days, loanRate, loanMonths],
  );

  return (
    <div className="my-8 border border-ink/15 bg-paper p-6" dir="rtl">
      <h2 className="mb-4 text-xl font-bold">כמה עולה המינוס שלכם</h2>
      <div className="grid gap-4 sm:grid-cols-3">
        <label className="block">
          יתרה שלילית ממוצעת (₪)
          <input className={field} type="number" min="1" inputMode="decimal" value={balance} onChange={(e) => setBalance(e.target.value)} />
        </label>
        <label className="block">
          ריבית שנתית על המינוס (%)
          <input className={field} type="number" min="0" max="100" step="0.1" inputMode="decimal" value={rate} onChange={(e) => setRate(e.target.value)} />
        </label>
        <label className="block">
          ימים בחודש במינוס
          <input className={field} type="number" min="1" max="31" inputMode="numeric" value={days} onChange={(e) => setDays(e.target.value)} />
        </label>
      </div>
      <p className="mt-2 text-sm text-ink/70">
        ברירת המחדל לריבית היא הפריים הנוכחי ({MACRO_DATA.primeRate.value}%) לצורך הדגמה בלבד. ריבית המינוס בפועל
        נקבעת בהסכם עם הבנק ובדרך כלל גבוהה מהפריים; הזינו את הריבית מתוך ההסכם או מדף התנאים של הבנק.
      </p>

      <div className="mt-6" aria-live="polite">
        {cost ? (
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="border border-ink/15 bg-cream p-3">
              <div className="text-sm text-ink/70">ריבית בחודש</div>
              <div className="text-lg font-bold">{money(cost.monthlyInterest)}</div>
            </div>
            <div className="border border-ink/15 bg-cream p-3">
              <div className="text-sm text-ink/70">ריבית בשנה (אותו דפוס כל חודש)</div>
              <div className="text-lg font-bold">{money(cost.annualInterest)}</div>
            </div>
            <div className="border border-ink/15 bg-cream p-3">
              <div className="text-sm text-ink/70">אחוז מהיתרה בחודש</div>
              <div className="text-lg font-bold">{cost.monthlyPctOfBalance}%</div>
            </div>
          </div>
        ) : (
          <p className="font-bold">הזינו יתרה חיובית, ריבית בין 0% ל־100% ומספר ימים בין 1 ל־31.</p>
        )}
      </div>

      <h3 className="mb-3 mt-8 text-lg font-bold">כמה זמן ייקח לצאת מהמינוס</h3>
      <label className="block max-w-xs">
        הקטנת המינוס בכל חודש (₪)
        <input className={field} type="number" min="1" inputMode="decimal" value={paydown} onChange={(e) => setPaydown(e.target.value)} />
      </label>
      <div className="mt-3" aria-live="polite">
        {payoff ? (
          <p>
            כ־<strong>{payoff.months}</strong> חודשים, עם ריבית כוללת של <strong>{money(payoff.totalInterest)}</strong> (סך
            תשלום: {money(payoff.totalPaid)}).
          </p>
        ) : (
          <p className="text-sm">
            ההקטנה החודשית צריכה להיות גבוהה מהריבית החודשית (בערך {cost ? money((Number(balance) * Number(rate)) / 1200) : '—'})
            כדי שהמינוס יקטן.
          </p>
        )}
      </div>

      <h3 className="mb-3 mt-8 text-lg font-bold">מינוס מול הלוואה שסוגרת אותו</h3>
      <div className="grid max-w-xl gap-4 sm:grid-cols-2">
        <label className="block">
          ריבית שנתית בהלוואה (%)
          <input className={field} type="number" min="0" max="100" step="0.1" inputMode="decimal" value={loanRate} onChange={(e) => setLoanRate(e.target.value)} />
        </label>
        <label className="block">
          תקופה (חודשים)
          <input className={field} type="number" min="1" max="600" inputMode="numeric" value={loanMonths} onChange={(e) => setLoanMonths(e.target.value)} />
        </label>
      </div>
      <div className="mt-3" aria-live="polite">
        {vsLoan ? (
          <div className="space-y-1">
            <p>החזר חודשי בהלוואה: <strong>{money(vsLoan.loanMonthlyPayment)}</strong></p>
            <p>ריבית כוללת בהלוואה: <strong>{money(vsLoan.loanTotalInterest)}</strong></p>
            <p>ריבית כוללת במינוס באותה תקופה: <strong>{money(vsLoan.overdraftTotalInterest)}</strong></p>
            <p>
              {vsLoan.interestSavedByLoan >= 0
                ? `חיסכון בריבית עם ההלוואה: ${money(vsLoan.interestSavedByLoan)}`
                : `ההלוואה יקרה יותר ב־${money(-vsLoan.interestSavedByLoan)} בריבית`}
            </p>
            <p className="text-sm text-ink/70">
              בסוף התקופה במינוס עדיין חייבים {money(vsLoan.overdraftRemainingDebt)}, ואילו ההלוואה נסגרת במלואה. בדקו
              גם עמלות פתיחה, הצמדה וביטוח בהצעת ההלוואה.
            </p>
          </div>
        ) : (
          <p className="text-sm">הזינו ריבית בין 0% ל־100% ותקופה של 1–600 חודשים.</p>
        )}
      </div>

      <p className="mt-5 text-sm leading-relaxed text-ink/70">
        חישוב פשוט: הריבית נצברת יומית על יתרה ממוצעת, בלי עמלות, בלי ריבית דריבית בתוך החודש ובלי שינוי בריבית.
        דף התנאים וחשבון הבנק שלכם קובעים את החיוב בפועל.
      </p>
    </div>
  );
}
