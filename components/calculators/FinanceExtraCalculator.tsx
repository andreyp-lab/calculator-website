'use client';

import { useMemo, useState } from 'react';
import * as F from '@/lib/calculators/finance-extra';
import { Box, NumField as In, Note, Result, SelField as Sel, Stat, fmt, shekel } from '@/components/calculators/ui';
import { MACRO_DATA } from '@/lib/data/macroeconomic-data';
import { RENTAL_TAX_2026 } from '@/lib/calculators/finance-extra';
import { arnonaIncomeDiscount } from '@/lib/calculators/arnona-discount';
import { securitiesTax, type SecurityKind } from '@/lib/calculators/securities-tax';
import { linkToCpi } from '@/lib/calculators/cpi-linkage';

export type FinanceSection =
  | 'loan' | 'debt' | 'goal' | 'yield' | 'osek' | 'rentax' | 'studyfund' | 'rentbuy' | 'refinance' | 'securities' | 'arnonadiscount';

const Bad = () => <p className="font-bold">בדקו את הערכים שהוזנו.</p>;

function Loan() {
  const [p, setP] = useState('300000'), [rate, setRate] = useState('5'), [months, setMonths] = useState('120');
  const [method, setMethod] = useState<F.LoanMethod>('spitzer'), [balloon, setBalloon] = useState('100');
  const r = useMemo(() => F.loanSchedule({ principal: Number(p), annualRatePct: Number(rate), months: Number(months), method, balloonPct: Number(balloon) }), [p, rate, months, method, balloon]);
  const [all, setAll] = useState(false);
  return (
    <Box title="הלוואה בשלוש שיטות החזר">
      <div className="grid gap-4 sm:grid-cols-3">
        <In label="סכום ההלוואה (₪)" value={p} set={setP} min="0" />
        <In label="ריבית שנתית (%)" value={rate} set={setRate} min="0" step="0.1" />
        <In label="תקופה (חודשים)" value={months} set={setMonths} min="1" max="600" step="1" />
        <Sel label="שיטה" value={method} set={(v) => setMethod(v as F.LoanMethod)} options={[['spitzer', 'שפיצר (החזר קבוע)'], ['equal-principal', 'קרן שווה (החזר יורד)'], ['balloon', 'בלון (קרן בסוף)']]} />
        {method === 'balloon' && <In label="אחוז הקרן שנפרע בסוף (%)" value={balloon} set={setBalloon} min="0" max="100" />}
      </div>
      <Result>
        {r ? (
          <>
            <div className="grid gap-3 sm:grid-cols-4">
              <Stat label="תשלום ראשון" value={shekel(r.firstPayment)} />
              <Stat label="תשלום אחרון" value={shekel(r.lastPayment)} />
              <Stat label="סך תשלומים" value={shekel(r.totalPaid, 0)} />
              <Stat label="סך ריבית" value={shekel(r.totalInterest, 0)} />
            </div>
            <button type="button" className="mt-4 text-sm underline" onClick={() => setAll(!all)}>{all ? 'הסתר לוח סילוקין' : 'הצג לוח סילוקין'}</button>
            {all && (
              <div className="mt-2 max-h-80 overflow-auto">
                <table className="w-full border-collapse text-sm">
                  <thead><tr className="border-b border-ink/20"><th className="p-2 text-start">חודש</th><th className="p-2 text-start">תשלום</th><th className="p-2 text-start">קרן</th><th className="p-2 text-start">ריבית</th><th className="p-2 text-start">יתרה</th></tr></thead>
                  <tbody>{r.schedule.map((x) => <tr key={x.month} className="border-b border-ink/10"><td className="p-2">{x.month}</td><td className="p-2">{fmt(x.payment)}</td><td className="p-2">{fmt(x.principal)}</td><td className="p-2">{fmt(x.interest)}</td><td className="p-2">{fmt(x.balance)}</td></tr>)}</tbody>
                </table>
              </div>
            )}
          </>
        ) : <Bad />}
      </Result>
      <Note>ריבית קבועה, ללא הצמדה ועמלות. בבלון, על חלק הקרן שנפרע בסוף משלמים ריבית בלבד, והיתרה נפרעת בשפיצר.</Note>
    </Box>
  );
}

function Debt() {
  const [bal, setBal] = useState('30000'), [rate, setRate] = useState('9'), [pay, setPay] = useState('1000'), [months, setMonths] = useState('24');
  const a = F.debtPayoff(Number(bal), Number(rate), Number(pay));
  const b = F.debtPayoff(Number(bal), Number(rate), Number(pay) * 1.5);
  const need = F.paymentToClearIn(Number(bal), Number(rate), Number(months));
  return (
    <Box title="סילוק חוב: זמן, ריבית והחזר נדרש">
      <div className="grid gap-4 sm:grid-cols-3">
        <In label="יתרת החוב (₪)" value={bal} set={setBal} min="0" />
        <In label="ריבית שנתית (%)" value={rate} set={setRate} min="0" step="0.1" />
        <In label="החזר חודשי (₪)" value={pay} set={setPay} min="0" />
      </div>
      <Result>
        {a ? (
          <div className="grid gap-3 sm:grid-cols-3">
            <Stat label="חודשים לסילוק" value={a.months} />
            <Stat label="סך ריבית" value={shekel(a.totalInterest, 0)} />
            <Stat label={`אם מחזירים ${fmt(Number(pay) * 1.5, 0)} ₪`} value={b ? `${b.months} חודשים, ריבית ${shekel(b.totalInterest, 0)}` : '—'} />
          </div>
        ) : <p className="font-bold">ההחזר החודשי צריך להיות גבוה מהריבית החודשית ({shekel((Number(bal) * Number(rate)) / 1200)}) כדי שהחוב יקטן.</p>}
      </Result>
      <div className="mt-6 grid max-w-xl gap-4 sm:grid-cols-2">
        <In label="רוצים לסגור תוך (חודשים)" value={months} set={setMonths} min="1" step="1" />
        <div className="self-end text-lg font-bold">{need === null ? '—' : `החזר נדרש: ${shekel(need)} לחודש`}</div>
      </div>
    </Box>
  );
}

function Goal() {
  const [initial, setInitial] = useState('10000'), [monthly, setMonthly] = useState('1500'), [rate, setRate] = useState('5'), [years, setYears] = useState('10'), [infl, setInfl] = useState('2'), [goal, setGoal] = useState('300000');
  const g = F.savingsFutureValue({ initial: Number(initial), monthly: Number(monthly), annualRatePct: Number(rate), years: Number(years), inflationPct: Number(infl) });
  const need = F.monthlyToReachGoal({ goal: Number(goal), initial: Number(initial), annualRatePct: Number(rate), years: Number(years) });
  return (
    <Box title="כמה יהיה לי, וכמה צריך לחסוך ליעד">
      <div className="grid gap-4 sm:grid-cols-3">
        <In label="סכום פתיחה (₪)" value={initial} set={setInitial} min="0" />
        <In label="הפקדה חודשית (₪)" value={monthly} set={setMonthly} min="0" />
        <In label="תשואה שנתית (%)" value={rate} set={setRate} step="0.1" />
        <In label="שנים" value={years} set={setYears} min="1" />
        <In label="אינפלציה שנתית (%)" value={infl} set={setInfl} step="0.1" />
        <In label="יעד (₪)" value={goal} set={setGoal} min="0" />
      </div>
      <Result>
        {g ? (
          <div className="grid gap-3 sm:grid-cols-4">
            <Stat label="סכום בסוף התקופה" value={shekel(g.futureValue, 0)} />
            <Stat label="הופקד" value={shekel(g.totalDeposited, 0)} />
            <Stat label="רווח" value={shekel(g.gains, 0)} />
            <Stat label="ערך ריאלי (כוח קנייה היום)" value={shekel(g.realValue, 0)} />
          </div>
        ) : <Bad />}
        <p className="mt-4 text-lg font-bold">{need === null ? '' : need === 0 ? 'סכום הפתיחה לבדו מגיע ליעד.' : `להגעה ליעד נדרשת הפקדה של ${shekel(need)} לחודש.`}</p>
      </Result>
      <Note>הפקדה בסוף כל חודש, ריבית נצברת חודשית. אינו כולל מס על רווחים או דמי ניהול; תשואה אינה מובטחת. אינפלציה ממוצעת נוכחית לשנה: {MACRO_DATA.inflation.annualRate}%.</Note>
    </Box>
  );
}

function Yield() {
  const [price, setPrice] = useState('2000000'), [costs, setCosts] = useState('100000'), [rent, setRent] = useState('6000'), [vac, setVac] = useState('1'), [exp, setExp] = useState('6000');
  const r = F.rentalYield({ purchasePrice: Number(price), purchaseCosts: Number(costs), monthlyRent: Number(rent), vacancyMonths: Number(vac), annualExpenses: Number(exp) });
  return (
    <Box title="תשואת שכירות">
      <div className="grid gap-4 sm:grid-cols-3">
        <In label="מחיר הנכס (₪)" value={price} set={setPrice} min="0" />
        <In label="עלויות רכישה (מס רכישה, עו״ד, תיווך) (₪)" value={costs} set={setCosts} min="0" />
        <In label="שכר דירה חודשי (₪)" value={rent} set={setRent} min="0" />
        <In label="חודשים ריקים בשנה" value={vac} set={setVac} min="0" max="12" step="0.5" />
        <In label="הוצאות שנתיות (ארנונה, ועד, ביטוח, תחזוקה) (₪)" value={exp} set={setExp} min="0" />
      </div>
      <Result>
        {r ? (
          <div className="grid gap-3 sm:grid-cols-4">
            <Stat label="תשואה ברוטו" value={`${r.grossYieldPct}%`} />
            <Stat label="תשואה נטו (לפני מס)" value={`${r.netYieldPct}%`} />
            <Stat label="הכנסה נטו שנתית" value={shekel(r.netAnnualIncome, 0)} />
            <Stat label="החזר ההשקעה (שנים)" value={r.paybackYears ?? '—'} />
          </div>
        ) : <Bad />}
      </Result>
      <Note>תשואה ברוטו: שכר דירה שנתי ÷ מחיר. נטו: אחרי חודשים ריקים והוצאות, על מחיר ועלויות הרכישה. לפני מס על השכירות ולפני עליית ערך הנכס.</Note>
    </Box>
  );
}

function Osek() {
  const [rev, setRev] = useState('100000'), [exp, setExp] = useState('30000'), [biz, setBiz] = useState<'biz' | 'consumer'>('biz'), [cp, setCp] = useState('2.25');
  const r = F.compareOsek({ annualRevenueExVat: Number(rev), annualExpensesExVat: Number(exp), customersRecoverVat: biz === 'biz', creditPoints: Number(cp) });
  return (
    <Box title="עוסק פטור מול עוסק מורשה">
      <div className="grid gap-4 sm:grid-cols-2">
        <In label="הכנסה שנתית לפני מע״מ (₪)" value={rev} set={setRev} min="0" />
        <In label="הוצאות שנתיות לפני מע״מ (₪)" value={exp} set={setExp} min="0" />
        <Sel label="הלקוחות שלך" value={biz} set={(v) => setBiz(v as 'biz' | 'consumer')} options={[['biz', 'בעיקר עסקים (מקזזים מע״מ)'], ['consumer', 'בעיקר צרכנים פרטיים (מחיר סופי)']]} />
        <In label="נקודות זיכוי" value={cp} set={setCp} min="0" step="0.25" />
      </div>
      <Result>
        {r ? (
          <>
            {!r.exemptAllowed && <p className="mb-3 border border-gold/40 bg-cream p-3 text-sm">ההכנסה גבוהה מתקרת עוסק פטור, ולכן אין אפשרות לפטור.</p>}
            <div className="grid gap-3 sm:grid-cols-2">
              <Stat label="עוסק פטור: נטו בכיס" value={shekel(r.exempt.netInHand, 0)} />
              <Stat label="עוסק מורשה: נטו בכיס" value={shekel(r.licensed.netInHand, 0)} />
              <Stat label="פטור: מס הכנסה + ביטוח לאומי" value={shekel(r.exempt.incomeTax + r.exempt.nationalInsurance, 0)} />
              <Stat label="מורשה: מס הכנסה + ביטוח לאומי" value={shekel(r.licensed.incomeTax + r.licensed.nationalInsurance, 0)} />
            </div>
            <p className="mt-4 text-lg font-bold">{r.licensedAdvantage >= 0 ? `עוסק מורשה משתלם יותר ב־${shekel(r.licensedAdvantage, 0)} בשנה` : `עוסק פטור משתלם יותר ב־${shekel(-r.licensedAdvantage, 0)} בשנה`}</p>
          </>
        ) : <Bad />}
      </Result>
      <Note>הנחות: עוסק פטור אינו גובה מע״מ ואינו מקזז מע״מ תשומות; עוסק מורשה מקזז. בלקוחות צרכנים במחיר קבוע, מע״מ נשלף מהמחיר. אינו כולל חובת רישום עוסק מורשה לפי הענף, ניכויים נוספים או הפרשות פנסיה. מס הכנסה וביטוח לאומי לפי הכנסה מרווח בלבד.</Note>
    </Box>
  );
}

function RentTax() {
  const [rent, setRent] = useState('7000'), [other, setOther] = useState('150000'), [exp, setExp] = useState('10000');
  const r = F.rentalIncomeTax({ monthlyRent: Number(rent), otherAnnualIncome: Number(other), annualExpenses: Number(exp) });
  const names = { exempt: 'מסלול פטור', flat: 'מסלול 10%', regular: 'מסלול מדרגות' } as const;
  return (
    <Box title="מס על הכנסה משכר דירה — השוואת מסלולים">
      <div className="grid gap-4 sm:grid-cols-3">
        <In label="שכר דירה חודשי (₪)" value={rent} set={setRent} min="0" />
        <In label="הכנסה חייבת אחרת בשנה (₪)" value={other} set={setOther} min="0" />
        <In label="הוצאות מוכרות בשנה למסלול המדרגות (₪)" value={exp} set={setExp} min="0" />
      </div>
      <Result>
        {r ? (
          <>
            <div className="grid gap-3 sm:grid-cols-3">
              <Stat label={`פטור (תקרה ${fmt(RENTAL_TAX_2026.exemptMonthlyCeiling, 0)} ₪ לחודש)`} value={shekel(r.exemptTrack.tax, 0)} />
              <Stat label="מסלול 10%" value={shekel(r.flatTrack.tax, 0)} />
              <Stat label="מסלול מדרגות" value={shekel(r.regularTrack.tax, 0)} />
            </div>
            <p className="mt-4 text-lg font-bold">המסלול הזול בנתונים שהוזנו: {names[r.best]}</p>
          </>
        ) : <Bad />}
      </Result>
      <Note>מס על שכר הדירה בלבד (תוספת על המס בגין ההכנסה האחרת), לפני נקודות זיכוי. מסלול פטור: פטור מלא עד התקרה החודשית, ובין התקרה לכפולה הפטור נשחק. במסלול 10% אין ניכוי הוצאות או נקודות זיכוי. הבחירה כפופה לתנאי החוק; בדקו מול רשות המסים או רו״ח.</Note>
    </Box>
  );
}

function StudyFund() {
  const [income, setIncome] = useState('300000'), [dep, setDep] = useState('13000'), [ret, setRet] = useState('4'), [years, setYears] = useState('6'), [self, setSelf] = useState<'self' | 'emp'>('self');
  const r = F.studyFund({ annualIncome: Number(income), annualDeposit: Number(dep), annualReturnPct: Number(ret), years: Number(years), selfEmployed: self === 'self' });
  return (
    <Box title="קרן השתלמות: צבירה והטבת מס">
      <div className="grid gap-4 sm:grid-cols-3">
        <Sel label="מעמד" value={self} set={(v) => setSelf(v as 'self' | 'emp')} options={[['self', 'עצמאי'], ['emp', 'שכיר']]} />
        <In label="הכנסה שנתית (₪)" value={income} set={setIncome} min="0" />
        <In label="הפקדה שנתית (₪)" value={dep} set={setDep} min="0" />
        <In label="תשואה שנתית (%)" value={ret} set={setRet} step="0.1" />
        <In label="שנים" value={years} set={setYears} min="1" />
      </div>
      <Result>
        {r ? (
          <>
            <div className="grid gap-3 sm:grid-cols-4">
              <Stat label="צבירה בסוף" value={shekel(r.accumulated, 0)} />
              <Stat label="הופקד" value={shekel(r.totalDeposited, 0)} />
              <Stat label="רווח" value={shekel(r.gains, 0)} />
              {self === 'self' && <Stat label="חיסכון מס שנתי" value={shekel(r.taxSaving, 0)} />}
            </div>
            <p className="mt-3 text-sm">{r.depositWithinCeiling ? 'ההפקדה בתוך תקרת ההפקדה המוטבת.' : `ההפקדה חורגת מתקרת ההפקדה המוטבת (${fmt(r.annualExemptCeiling, 0)} ₪ בשנה); על החריגה אין פטור מס על הרווחים.`}</p>
            {self === 'self' && <p className="mt-1 text-sm">ניכוי מותר: {shekel(r.deductibleDeposit, 0)} (4.5% מההכנסה עד תקרת הכנסה).</p>}
          </>
        ) : <Bad />}
      </Result>
      <Note>עצמאי מנכה עד 4.5% מההכנסה (עד תקרת הכנסה שנתית). פטור ממס רווחי הון בכפוף לתקופת אחזקה ותקרות; בדקו אצל הגוף המנהל. אינו כולל דמי ניהול ומס על משיכה מוקדמת.</Note>
    </Box>
  );
}

function RentVsBuy() {
  const [v, setV] = useState({ price: '2000000', equity: '800000', rate: '4.5', mYears: '25', costs: '2', maint: '0.5', rent: '6000', rentG: '2', appr: '3', inv: '4', sell: '2', horizon: '10' });
  const set = (k: keyof typeof v) => (x: string) => setV({ ...v, [k]: x });
  const r = F.rentVsBuy({ price: Number(v.price), equity: Number(v.equity), mortgageRatePct: Number(v.rate), mortgageYears: Number(v.mYears), purchaseCostsPct: Number(v.costs), maintenancePct: Number(v.maint), monthlyRent: Number(v.rent), rentGrowthPct: Number(v.rentG), appreciationPct: Number(v.appr), investmentReturnPct: Number(v.inv), sellingCostsPct: Number(v.sell), horizonYears: Number(v.horizon) });
  return (
    <Box title="שכירות מול קנייה — השוואת הון בסוף התקופה">
      <div className="grid gap-4 sm:grid-cols-3">
        <In label="מחיר הדירה (₪)" value={v.price} set={set('price')} />
        <In label="הון עצמי (₪)" value={v.equity} set={set('equity')} />
        <In label="ריבית משכנתא (%)" value={v.rate} set={set('rate')} step="0.1" />
        <In label="תקופת משכנתא (שנים)" value={v.mYears} set={set('mYears')} />
        <In label="עלויות רכישה (% מהמחיר)" value={v.costs} set={set('costs')} step="0.1" />
        <In label="תחזוקה וביטוח (% מהשווי בשנה)" value={v.maint} set={set('maint')} step="0.1" />
        <In label="שכר דירה חודשי נוכחי (₪)" value={v.rent} set={set('rent')} />
        <In label="עליית שכר דירה בשנה (%)" value={v.rentG} set={set('rentG')} step="0.1" />
        <In label="עליית ערך דירה בשנה (%)" value={v.appr} set={set('appr')} step="0.1" />
        <In label="תשואה על כסף מושקע (%)" value={v.inv} set={set('inv')} step="0.1" />
        <In label="עלויות מכירה (%)" value={v.sell} set={set('sell')} step="0.1" />
        <In label="אופק (שנים שלמות)" value={v.horizon} set={set('horizon')} step="1" />
      </div>
      <Result>
        {r ? (
          <>
            <div className="grid gap-3 sm:grid-cols-3">
              <Stat label="הון בסוף — קנייה" value={shekel(r.buyNetWorth, 0)} />
              <Stat label="הון בסוף — שכירות והשקעה" value={shekel(r.rentNetWorth, 0)} />
              <Stat label="החזר משכנתא חודשי" value={shekel(r.monthlyMortgage, 0)} />
            </div>
            <p className="mt-4 text-lg font-bold">{r.buyAdvantage >= 0 ? `בתרחיש הזה הקנייה מובילה ב־${shekel(r.buyAdvantage, 0)}` : `בתרחיש הזה השכירות מובילה ב־${shekel(-r.buyAdvantage, 0)}`}</p>
            <p className="mt-1 text-sm">שווי הדירה בסוף: {shekel(r.propertyValueAtHorizon, 0)} · יתרת משכנתא: {shekel(r.mortgageBalanceAtHorizon, 0)}</p>
          </>
        ) : <Bad />}
      </Result>
      <Note>התוצאה רגישה מאוד להנחות (עליית ערך, תשואה, ריבית). נסו כמה תרחישים. אינו כולל מס שבח, מס על רווחי ההשקעה והצמדה למדד, ומניח משכנתא בריבית קבועה.</Note>
    </Box>
  );
}

function Refinance() {
  const [bal, setBal] = useState('800000'), [cr, setCr] = useState('5.5'), [rm, setRm] = useState('240'), [nr, setNr] = useState('4.2'), [nm, setNm] = useState('240'), [fees, setFees] = useState('12000');
  const r = F.refinance({ balance: Number(bal), currentRatePct: Number(cr), remainingMonths: Number(rm), newRatePct: Number(nr), newMonths: Number(nm), totalFees: Number(fees) });
  return (
    <Box title="מחזור משכנתא — כמה תחסכו">
      <div className="grid gap-4 sm:grid-cols-3">
        <In label="יתרת הקרן (₪)" value={bal} set={setBal} />
        <In label="ריבית נוכחית (%)" value={cr} set={setCr} step="0.01" />
        <In label="חודשים שנותרו" value={rm} set={setRm} step="1" />
        <In label="ריבית חדשה (%)" value={nr} set={setNr} step="0.01" />
        <In label="תקופה חדשה (חודשים)" value={nm} set={setNm} step="1" />
        <In label="סך עלויות: פירעון מוקדם, שמאות, עו״ד (₪)" value={fees} set={setFees} />
      </div>
      <Result>
        {r ? (
          <>
            <div className="grid gap-3 sm:grid-cols-4">
              <Stat label="החזר חודשי היום" value={shekel(r.currentMonthly, 0)} />
              <Stat label="החזר חודשי חדש" value={shekel(r.newMonthly, 0)} />
              <Stat label="חיסכון חודשי" value={shekel(r.monthlySaving, 0)} />
              <Stat label="חיסכון כולל אחרי עלויות" value={shekel(r.totalSaving, 0)} />
            </div>
            <p className="mt-4 text-lg font-bold">{r.breakEvenMonths === null ? 'אין חיסכון חודשי, ולכן המחזור לא יחזיר את העלויות.' : `נקודת איזון: ${r.breakEvenMonths} חודשים`}</p>
          </>
        ) : <Bad />}
      </Result>
      <Note>המחשבון מניח מסלול יחיד בריבית קבועה לא צמודה. משכנתא בפועל כוללת כמה מסלולים, הצמדה ועמלת פירעון מוקדם לפי מסלול. בקשו הצעה מפורטת מהבנק.</Note>
    </Box>
  );
}

function Securities() {
  const [buy, setBuy] = useState('100000'), [sell, setSell] = useState('130000'), [exp, setExp] = useState('500'), [other, setOther] = useState('200000');
  const [kind, setKind] = useState<SecurityKind>('real-25'), [from, setFrom] = useState('2024-03'), [to, setTo] = useState('2026-09'), [manual, setManual] = useState('');
  const link = linkToCpi({ amount: 1, fromMonth: from, toMonth: to });
  const cpiPct = manual !== '' ? Number(manual) : link ? (link.ratio - 1) * 100 : 0;
  const r = securitiesTax({ purchasePrice: Number(buy), salePrice: Number(sell), expenses: Number(exp), kind, cpiChangePct: cpiPct, otherAnnualIncome: Number(other) });
  return (
    <Box title="מס רווחי הון על ניירות ערך">
      <div className="grid gap-4 sm:grid-cols-3">
        <In label="מחיר רכישה (₪)" value={buy} set={setBuy} min="0" />
        <In label="מחיר מכירה (₪)" value={sell} set={setSell} min="0" />
        <In label="עמלות קנייה ומכירה (₪)" value={exp} set={setExp} min="0" />
        <Sel label="סוג נייר" value={kind} set={(v) => setKind(v as SecurityKind)} options={[['real-25', 'מניה/קרן/נייר צמוד או זר (25% על רווח ריאלי)'], ['substantial-30', 'בעל מניות מהותי (30% על רווח ריאלי)'], ['nominal-15', 'נייר לא צמוד (15% על רווח נומינלי)']]} />
        <label className="block">חודש רכישה<input className="mt-2 block w-full border border-ink/20 bg-cream p-3" type="month" value={from} onChange={(e) => setFrom(e.target.value)} /></label>
        <label className="block">חודש מכירה<input className="mt-2 block w-full border border-ink/20 bg-cream p-3" type="month" value={to} onChange={(e) => setTo(e.target.value)} /></label>
        <In label="שינוי מדד באחוזים (ריק = לפי החודשים)" value={manual} set={setManual} step="0.1" />
        <In label="הכנסה חייבת אחרת בשנה (₪, למס יסף)" value={other} set={setOther} min="0" />
      </div>
      <Result>
        {r ? (
          <>
            <div className="grid gap-3 sm:grid-cols-4">
              <Stat label="רווח נומינלי" value={shekel(r.nominalGain, 0)} />
              <Stat label="סכום אינפלציוני (פטור)" value={shekel(r.inflationaryAmount, 0)} />
              <Stat label="רווח חייב" value={shekel(r.taxableGain, 0)} />
              <Stat label={`מס (${r.rate * 100}%)`} value={shekel(r.capitalGainsTax, 0)} />
            </div>
            <p className="mt-4 text-lg font-bold">{r.isLoss ? 'הפסד הון: אין מס. אפשר לקזז הפסד מרווחי הון אחרים לפי הכללים.' : `מס כולל: ${shekel(r.totalTax, 0)}${r.surtax > 0 ? ` (כולל מס יסף ${shekel(r.surtax, 0)})` : ''} · נטו אחרי מס: ${shekel(r.netProceeds, 0)}`}</p>
            <p className="mt-1 text-sm text-ink/70">שינוי המדד בתקופה: {cpiPct.toFixed(2)}%{manual === '' && !link ? ' (החודשים מחוץ לטווח הנתונים; הזינו ידנית)' : ''}</p>
          </>
        ) : <Bad />}
      </Result>
      <Note>הכללים לפי בנק לאומי וביזפורטל (לא אתר רשות המסים): 25% על רווח ריאלי (30% בעל מניות מהותי), 15% על רווח נומינלי בנייר לא צמוד, ומס יסף מעל הסף השנתי. הרווח האינפלציוני פטור. שיטת FIFO, קיזוז הפסדים, דיבידנדים ומטבע חוץ אינם מחושבים. בדקו מול רשות המסים או יועץ מס.</Note>
    </Box>
  );
}

function ArnonaDiscountTool() {
  const [size, setSize] = useState('3'), [income, setIncome] = useState('9000'), [arnona, setArnona] = useState('450');
  const r = arnonaIncomeDiscount({ householdSize: Number(size), avgMonthlyGrossIncome: Number(income), monthlyArnona: Number(arnona) });
  return (
    <Box title="הנחה בארנונה לפי הכנסה (טבלה ארצית 2026)">
      <div className="grid gap-4 sm:grid-cols-3">
        <In label="נפשות במשק הבית" value={size} set={setSize} min="1" step="1" />
        <In label="הכנסה חודשית ממוצעת ברוטו של משק הבית (₪)" value={income} set={setIncome} min="0" />
        <In label="ארנונה חודשית נוכחית (₪, אופציונלי)" value={arnona} set={setArnona} min="0" />
      </div>
      <Result>
        {r ? (
          <>
            <p className="text-2xl font-bold">{r.percent > 0 ? `זכאות להנחה של עד ${r.percent}%` : 'ההכנסה מעל הסף העליון בטבלה: אין הנחה לפי מבחן הכנסה'}</p>
            {r.monthlySaving !== null && r.percent > 0 && <p className="mt-1">חיסכון משוער: {shekel(r.monthlySaving, 0)} בחודש · {shekel(r.annualSaving, 0)} בשנה (אם ההנחה חלה על כל השטח)</p>}
            <p className="mt-2 text-sm text-ink/70">ספים עליונים למשק בית של {size}: 90% עד {fmt(r.thresholds[0], 0)} · 70% עד {fmt(r.thresholds[1], 0)} · 50% עד {fmt(r.thresholds[2], 0)} · 30% עד {fmt(r.thresholds[3], 0)} ₪.</p>
          </>
        ) : <Bad />}
      </Result>
      <Note>הכנסה ממוצעת של 12 החודשים שלפני שנת ההנחה (לשכיר), ברוטו מכל המקורות, בניכוי הכנסות שהחוק מוציא (קצבת ילדים, קצבת זקנה ועוד). ההנחה אינה חובה: הרשות המקומית קובעת בצו את השיעור, השטח שעליו חלה והמועד להגשה; יש לשלם את הארנונה עד 31 בדצמבר. הנחה אחת בלבד (הגבוהה).</Note>
    </Box>
  );
}

const MAP: Record<FinanceSection, () => React.ReactElement> = {
  loan: Loan, debt: Debt, goal: Goal, yield: Yield, osek: Osek, rentax: RentTax, studyfund: StudyFund, rentbuy: RentVsBuy, refinance: Refinance, securities: Securities, arnonadiscount: ArnonaDiscountTool,
};
export function FinanceExtraCalculator({ section }: { section: FinanceSection }) {
  const C = MAP[section];
  return <C />;
}
