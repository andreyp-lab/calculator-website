'use client';

import { useMemo, useState, type ReactNode } from 'react';
import {
  calculateHolidayPay,
  calculateLeaveEntitlement,
  calculateLeaveRedemption,
  calculateNoticePeriod,
  calculateSeverance,
  calculateSickPay,
  calculateTenure,
  calculateUnemployment,
  checkMinimumWage,
  monthlySickDailyWage,
  noticePayInLieu,
  recreationDaysForYears,
  sickBalance,
} from '@/lib/calculators/labor-rights';
import { calculateShift, formatHoursMinutes, splitRegularOvertime } from '@/lib/calculators/work-hours';
import { calculateOvertimeDay, hourlyWageFromMonthly } from '@/lib/calculators/overtime-pay';
import { calculateBtlContributions, type BtlStatus } from '@/lib/calculators/btl-contributions';
import { HOLIDAY_DAYS, UNEMPLOYMENT_2026 } from '@/lib/constants/labor-2026';

export type LaborSection =
  | 'leave' | 'notice' | 'sick' | 'holiday' | 'severance' | 'tenure'
  | 'unemployment' | 'minwage' | 'hours' | 'btl';

const field = 'mt-2 block w-full border border-ink/20 bg-cream p-3';
const money = (v: number) => `${v.toLocaleString('he-IL', { minimumFractionDigits: 0, maximumFractionDigits: 2 })} ₪`;
const today = () => new Date().toISOString().slice(0, 10);

function Box({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="my-8 border border-ink/15 bg-paper p-6" dir="rtl">
      <h2 className="mb-4 text-xl font-bold">{title}</h2>
      {children}
    </div>
  );
}
function Out({ children }: { children: ReactNode }) {
  return <div className="mt-4" aria-live="polite">{children}</div>;
}
function Note({ children }: { children: ReactNode }) {
  return <p className="mt-3 text-sm leading-relaxed text-ink/70">{children}</p>;
}
function Num({ label, value, set, ...rest }: { label: string; value: string; set: (v: string) => void } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      {label}
      <input className={field} type="number" inputMode="decimal" value={value} onChange={(e) => set(e.target.value)} {...rest} />
    </label>
  );
}

// ───────────────────────── חופשה ─────────────────────────
function Leave() {
  const [year, setYear] = useState('3');
  const [week, setWeek] = useState<'5' | '6'>('5');
  const [ext, setExt] = useState(false);
  const [worked, setWorked] = useState('');
  const [partial, setPartial] = useState(false);
  const [unused, setUnused] = useState('10');
  const [accrual, setAccrual] = useState<'net' | 'calendar'>('net');
  const [pay, setPay] = useState<'monthly' | 'hourly'>('monthly');
  const [salary, setSalary] = useState('8000');
  const [threeMonths, setThreeMonths] = useState('24000');
  const ent = useMemo(
    () =>
      calculateLeaveEntitlement({
        seniorityYear: Number(year),
        workWeekDays: Number(week) as 5 | 6,
        extensionOrderApplies: ext,
        workedDaysInYear: worked === '' ? undefined : Number(worked),
        partialYear: partial,
      }),
    [year, week, ext, worked, partial],
  );
  const red = useMemo(
    () =>
      calculateLeaveRedemption({
        unusedDays: Number(unused),
        accrual,
        workWeekDays: Number(week) as 5 | 6,
        payType: pay,
        monthlySalary: Number(salary),
        threeMonthTotal: Number(threeMonths),
      }),
    [unused, accrual, week, pay, salary, threeMonths],
  );
  return (
    <Box title="ימי חופשה שנתית ופדיון">
      <div className="grid gap-4 sm:grid-cols-3">
        <Num label="שנת ותק (שנות לוח, 1 = שנת העבודה הראשונה)" value={year} set={setYear} min="1" max="60" />
        <label className="block">
          ימי עבודה בשבוע
          <select className={field} value={week} onChange={(e) => setWeek(e.target.value as '5' | '6')}>
            <option value="5">5</option>
            <option value="6">6</option>
          </select>
        </label>
        <Num label="ימי עבודה בפועל בשנה (ריק = שנה מלאה)" value={worked} set={setWorked} min="0" />
      </div>
      <div className="mt-3 flex flex-wrap gap-4 text-sm">
        {week === '5' && (
          <label className="flex items-center gap-2"><input type="checkbox" checked={ext} onChange={(e) => setExt(e.target.checked)} /> צו ההרחבה לשבוע עבודה מקוצר חל במקום העבודה</label>
        )}
        <label className="flex items-center gap-2"><input type="checkbox" checked={partial} onChange={(e) => setPartial(e.target.checked)} /> שנה חלקית (התחלתי או סיימתי באמצע השנה)</label>
      </div>
      <Out>
        {ent ? (
          <p className="text-xl font-bold">
            {ent.netDays} ימי חופשה נטו ({ent.grossDays} ימים קלנדריים כולל שבתות){ent.prorated && ' — חישוב יחסי'}
          </p>
        ) : <p className="font-bold">בדקו את הערכים שהוזנו.</p>}
      </Out>

      <h3 className="mb-3 mt-8 text-lg font-bold">פדיון ימי חופשה שלא נוצלו</h3>
      <div className="grid gap-4 sm:grid-cols-3">
        <Num label="ימים לפדיון" value={unused} set={setUnused} min="0" />
        <label className="block">
          איך נצברו הימים
          <select className={field} value={accrual} onChange={(e) => setAccrual(e.target.value as 'net' | 'calendar')}>
            <option value="net">ימי עבודה (נטו)</option>
            <option value="calendar">ימים קלנדריים</option>
          </select>
        </label>
        <label className="block">
          סוג שכר
          <select className={field} value={pay} onChange={(e) => setPay(e.target.value as 'monthly' | 'hourly')}>
            <option value="monthly">חודשי</option>
            <option value="hourly">שעתי</option>
          </select>
        </label>
        {pay === 'monthly' ? (
          <Num label="שכר חודשי (₪)" value={salary} set={setSalary} min="0" />
        ) : (
          <Num label="סך השכר ב־3 החודשים הרצופים עם הכי הרבה ימי עבודה מתוך 12 האחרונים (₪)" value={threeMonths} set={setThreeMonths} min="0" />
        )}
      </div>
      <Out>
        {red ? <p className="text-xl font-bold">{money(red.total)} <span className="text-sm font-normal">(שווי יום: {money(red.dailyValue)})</span></p> : <p className="font-bold">בדקו את הערכים שהוזנו.</p>}
      </Out>
      <Note>הטבלאות לפי סיכום כל זכות של חוק חופשה שנתית וצו ההרחבה; פדיון הוא הכנסה חייבת במס. הסכם מיטיב עשוי לתת יותר.</Note>
    </Box>
  );
}

// ───────────────────────── הודעה מוקדמת ─────────────────────────
function Notice() {
  const [months, setMonths] = useState('9');
  const [type, setType] = useState<'monthly' | 'hourly'>('monthly');
  const [pay, setPay] = useState('9000');
  const r = useMemo(() => calculateNoticePeriod({ fullMonthsOfService: Number(months), payType: type }), [months, type]);
  const inLieu = r ? noticePayInLieu(r.days, Number(pay)) : null;
  return (
    <Box title="חישוב תקופת הודעה מוקדמת">
      <div className="grid gap-4 sm:grid-cols-3">
        <Num label="חודשי עבודה מלאים" value={months} set={setMonths} min="0" step="1" />
        <label className="block">
          סוג שכר
          <select className={field} value={type} onChange={(e) => setType(e.target.value as 'monthly' | 'hourly')}>
            <option value="monthly">חודשי</option>
            <option value="hourly">שעתי / יומי</option>
          </select>
        </label>
        <Num label="שכר חודשי רגיל (לחישוב פיצוי חלף הודעה)" value={pay} set={setPay} min="0" />
      </div>
      <Out>
        {r ? (
          <>
            <p className="text-xl font-bold">{r.isFullMonth ? 'חודש (30 ימים)' : `${r.days} ימים`} הודעה מוקדמת</p>
            {inLieu !== null && <p className="mt-1 text-sm">פיצוי חלף הודעה (שכר רגיל לתקופה): {money(inLieu)}</p>}
          </>
        ) : <p className="font-bold">הזינו מספר שלם של חודשים.</p>}
      </Out>
      <Note>זהה לפיטורים ולהתפטרות. ההודעה בכתב, בימים קלנדריים ומיום המסירה. חוזה יכול לקבוע תקופה ארוכה יותר.</Note>
    </Box>
  );
}

// ───────────────────────── מחלה ─────────────────────────
function Sick() {
  const [days, setDays] = useState('5');
  const [mode, setMode] = useState<'daily' | 'monthly'>('monthly');
  const [daily, setDaily] = useState('300');
  const [salary, setSalary] = useState('6500');
  const [method, setMethod] = useState<'30' | '5day' | '6day'>('5day');
  const [fromDay1, setFromDay1] = useState(false);
  const [months, setMonths] = useState('12');
  const [used, setUsed] = useState('0');
  const wage = mode === 'daily' ? Number(daily) : monthlySickDailyWage(Number(salary), method);
  const r = useMemo(() => (wage === null ? null : calculateSickPay({ consecutiveDays: Number(days), dailyWage: wage, paidFromDayOne: fromDay1 })), [days, wage, fromDay1]);
  const bal = sickBalance(Number(months), Number(used));
  return (
    <Box title="תשלום על ימי מחלה">
      <div className="grid gap-4 sm:grid-cols-3">
        <Num label="ימי מחלה ברצף" value={days} set={setDays} min="0" step="1" />
        <label className="block">
          איך לחשב שכר יום
          <select className={field} value={mode} onChange={(e) => setMode(e.target.value as 'daily' | 'monthly')}>
            <option value="monthly">משכורת חודשית</option>
            <option value="daily">שכר יום ידוע</option>
          </select>
        </label>
        {mode === 'daily' ? (
          <Num label="שכר ליום (₪)" value={daily} set={setDaily} min="0" />
        ) : (
          <>
            <Num label="משכורת חודשית (₪)" value={salary} set={setSalary} min="0" />
            <label className="block">
              שיטת חישוב יום מחלה
              <select className={field} value={method} onChange={(e) => setMethod(e.target.value as '30' | '5day' | '6day')}>
                <option value="5day">÷ 21.67 (שבוע של 5 ימים)</option>
                <option value="6day">÷ 25 (שבוע של 6 ימים)</option>
                <option value="30">÷ 30 (ימים קלנדריים)</option>
              </select>
            </label>
          </>
        )}
      </div>
      <label className="mt-3 flex items-center gap-2 text-sm"><input type="checkbox" checked={fromDay1} onChange={(e) => setFromDay1(e.target.checked)} /> המעסיק משלם מהיום הראשון (הסכם או נוהג)</label>
      <Out>
        {r ? (
          <>
            <p className="text-2xl font-bold">{money(r.total)}</p>
            <p className="mt-1 text-sm">שווה ערך ל־{r.paidDays} ימי שכר מלאים. {r.lines.slice(0, 4).map((l) => `יום ${l.day}: ${l.pct * 100}%`).join(' · ')}{r.lines.length > 4 ? ' · מיום 4 ואילך: 100%' : ''}</p>
          </>
        ) : <p className="font-bold">בדקו את הערכים שהוזנו.</p>}
      </Out>
      <h3 className="mb-3 mt-8 text-lg font-bold">יתרת ימי מחלה</h3>
      <div className="grid max-w-xl gap-4 sm:grid-cols-2">
        <Num label="חודשי עבודה מלאים" value={months} set={setMonths} min="0" step="1" />
        <Num label="ימי מחלה שנוצלו" value={used} set={setUsed} min="0" />
      </div>
      <Out>{bal !== null ? <p className="text-lg font-bold">יתרה משוערת: {bal} ימים (צבירה 1.5 ליום לחודש, עד 90)</p> : <p className="font-bold">בדקו את הערכים.</p>}</Out>
      <Note>הכלל: יום ראשון ללא תשלום, ימים 2–3 חצי שכר, מיום 4 שכר מלא. שיטת חישוב שכר יום למשכורת חודשית אינה מוכרעת לגמרי בפרסומים, ולכן אפשר לבחור. הסכמים קיבוציים רבים מיטיבים.</Note>
    </Box>
  );
}

// ───────────────────────── חגים ─────────────────────────
function Holiday() {
  const [wage, setWage] = useState('40');
  const [hours, setHours] = useState('450');
  const [workdays, setWorkdays] = useState('60');
  const [months, setMonths] = useState('6');
  const [sched, setSched] = useState(true);
  const [around, setAround] = useState(true);
  const r = useMemo(
    () => calculateHolidayPay({ hourlyWage: Number(wage), totalHours: Number(hours), workdays: Number(workdays), monthsAtWorkplace: Number(months), scheduledToWork: sched, workedDayBeforeAndAfter: around }),
    [wage, hours, workdays, months, sched, around],
  );
  return (
    <Box title="דמי חגים לעובד שעתי או יומי">
      <div className="grid gap-4 sm:grid-cols-2">
        <Num label="שכר שעתי (₪)" value={wage} set={setWage} min="0" />
        <Num label="חודשים במקום העבודה" value={months} set={setMonths} min="0" />
        <Num label="סך שעות עבודה בתקופת הממוצע (ברירת מחדל 3 חודשים)" value={hours} set={setHours} min="0" />
        <Num label="ימי עבודה בתקופה" value={workdays} set={setWorkdays} min="1" />
      </div>
      <div className="mt-3 space-y-1 text-sm">
        <label className="flex items-center gap-2"><input type="checkbox" checked={sched} onChange={(e) => setSched(e.target.checked)} /> הייתי אמור לעבוד ביום החג</label>
        <label className="flex items-center gap-2"><input type="checkbox" checked={around} onChange={(e) => setAround(e.target.checked)} /> עבדתי ביום שלפני וביום שאחרי (או נעדרתי בהסכמת המעסיק)</label>
      </div>
      <Out>
        {r ? (
          r.eligible ? (
            <p className="text-2xl font-bold">{money(r.amount)} לכל יום חג <span className="text-sm font-normal">({r.avgDailyHours} שעות ביום × שכר שעתי)</span></p>
          ) : (
            <div><p className="text-lg font-bold">לפי הנתונים אין זכאות</p><ul className="list-disc pr-5 text-sm">{r.reasons.map((x) => <li key={x}>{x}</li>)}</ul></div>
          )
        ) : <p className="font-bold">בדקו את הערכים שהוזנו.</p>}
      </Out>
      <Note>תשעת ימי החג: {HOLIDAY_DAYS.map((h) => `${h.label} (${h.days})`).join(', ')}. חג שחל בשישי או בשבת — אין תשלום אלא אם עובדים ביום זה. עובד בשכר חודשי מקבל את משכורתו כרגיל ואינו מקבל &quot;דמי חגים&quot; נפרדים.</Note>
    </Box>
  );
}

// ───────────────────────── פיצויים ─────────────────────────
function Severance() {
  const [salary, setSalary] = useState('10000');
  const [years, setYears] = useState('5');
  const r = useMemo(() => calculateSeverance({ lastMonthlySalary: Number(salary), yearsOfService: Number(years) }), [salary, years]);
  return (
    <Box title="חישוב פיצויי פיטורים ופטור ממס">
      <div className="grid gap-4 sm:grid-cols-2">
        <Num label="משכורת חודש אחרון (₪)" value={salary} set={setSalary} min="0" />
        <Num label="שנות עבודה (אפשר עשרוני: 3.5)" value={years} set={setYears} min="0" step="0.1" />
      </div>
      <Out>
        {r ? (
          <>
            <p className="text-2xl font-bold">{money(r.severance)}</p>
            <p className="mt-1 text-sm">פטור ממס: {money(r.exempt)} · חייב במס: {money(r.taxable)} (תקרת הפטור: {money(r.exemptionCeiling)})</p>
          </>
        ) : <p className="font-bold">בדקו את הערכים שהוזנו.</p>}
      </Out>
      <Note>משכורת חודש אחרון לכל שנת עבודה, יחסית לשנה חלקית. הפטור הוא הנמוך מבין 1.5 משכורות לשנה לבין תקרה שנתית. עובד עם סעיף 14 קיבל את הפיצויים בהפקדות, ולכן ההפקדות הן חלף הפיצויים. אינו מחשב התפטרות שרואים בה פיטורים.</Note>
    </Box>
  );
}

// ───────────────────────── ותק ─────────────────────────
function Tenure() {
  const [start, setStart] = useState('2021-03-01');
  const [end, setEnd] = useState(today());
  const t = useMemo(() => calculateTenure(start, end), [start, end]);
  const full = t ? t.totalFullMonths : 0;
  const notice = t ? calculateNoticePeriod({ fullMonthsOfService: full, payType: 'monthly' }) : null;
  const leaveYear = t ? Number(end.slice(0, 4)) - Number(start.slice(0, 4)) + 1 : 0;
  const leave = t ? calculateLeaveEntitlement({ seniorityYear: leaveYear, workWeekDays: 5 }) : null;
  return (
    <Box title="חישוב ותק תעסוקתי והזכויות שנגזרות ממנו">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">תאריך תחילת עבודה<input className={field} type="date" value={start} onChange={(e) => setStart(e.target.value)} /></label>
        <label className="block">תאריך סיום / היום<input className={field} type="date" value={end} onChange={(e) => setEnd(e.target.value)} /></label>
      </div>
      <Out>
        {t ? (
          <>
            <p className="text-2xl font-bold">{t.years} שנים, {t.months} חודשים, {t.days} ימים</p>
            <ul className="mt-3 grid gap-1 text-sm sm:grid-cols-2">
              <li>סך הכול: {t.totalDays} ימים ({t.decimalYears} שנים)</li>
              <li>ימי הבראה בשנה הנוכחית (מגזר פרטי): {recreationDaysForYears(t.years)}</li>
              <li>הודעה מוקדמת (שכר חודשי): {notice?.isFullMonth ? 'חודש' : `${notice?.days} ימים`}</li>
              <li>חופשה שנתית (שנת ותק {leaveYear}, שבוע 5 ימים): {leave?.netDays} ימים נטו</li>
              <li>יתרת ימי מחלה מצטברת: {sickBalance(t.totalFullMonths)} ימים (ללא ניצול)</li>
              <li>פיצויים: {t.years >= 1 ? 'מגיעים משנה מלאה (בכפוף לנסיבות הסיום)' : 'פחות משנה — בדרך כלל אין זכאות'}</li>
            </ul>
          </>
        ) : <p className="font-bold">תאריך הסיום חייב להיות אחרי תאריך ההתחלה.</p>}
      </Out>
      <Note>חופשה נספרת בשנות לוח (ינואר–דצמבר), ולכן שנת הוותק לחופשה נגזרת מהשנים הקלנדריות ולא מהחודשים. תקופות ללא תשלום אינן נספרות בהודעה מוקדמת.</Note>
    </Box>
  );
}

// ───────────────────────── אבטלה ─────────────────────────
function Unemployment() {
  const [wage, setWage] = useState('10000');
  const [age, setAge] = useState('32');
  const [deps, setDeps] = useState('0');
  const [months, setMonths] = useState('14');
  const r = useMemo(() => calculateUnemployment({ avgMonthlyGross: Number(wage), age: Number(age), dependents: Number(deps), workedMonthsOf18: Number(months) }), [wage, age, deps, months]);
  return (
    <Box title="חישוב דמי אבטלה">
      <div className="grid gap-4 sm:grid-cols-2">
        <Num label="שכר חודשי ברוטו ממוצע ב־6 החודשים האחרונים (₪)" value={wage} set={setWage} min="0" />
        <Num label="גיל" value={age} set={setAge} min="0" max="120" />
        <Num label="מספר תלויים (ילדים, בן/בת זוג שעומד בתנאים)" value={deps} set={setDeps} min="0" step="1" />
        <Num label="חודשי עבודה כשכיר מתוך 18 האחרונים" value={months} set={setMonths} min="0" max="18" step="1" />
      </div>
      <Out>
        {r ? (
          <>
            {!r.eligibleByBasics && (
              <div className="mb-3 border border-gold/40 bg-cream p-3 text-sm"><strong>לפי הנתונים אין זכאות בסיסית:</strong><ul className="list-disc pr-5">{r.reasons.map((x) => <li key={x}>{x}</li>)}</ul></div>
            )}
            <p className="text-2xl font-bold">{money(r.dailyFirst125)} ליום · עד {r.maxDays} ימים</p>
            <p className="mt-1 text-sm">סך משוער אם מנצלים את כל הימים: {money(r.totalGross)} ברוטו · כ־{money(r.monthlyAt25Days)} לחודש (25 ימי התייצבות)</p>
            {r.dailyAfter125 < r.dailyFirst125 && <p className="mt-1 text-sm">מיום התשלום ה־{UNEMPLOYMENT_2026.capSwitchDay + 1} התקרה היומית יורדת ל־{money(r.dailyAfter125)}.</p>}
            <p className="mt-1 text-sm text-ink/70">שכר יומי ממוצע ששימש לחישוב: {money(r.dailyAverageWage)} (ממוצע חודשי ÷ 25).</p>
          </>
        ) : <p className="font-bold">בדקו את הערכים שהוזנו.</p>}
      </Out>
      <Note>הסכום ברוטו; ינוכו מס הכנסה, דמי ביטוח לאומי ובריאות. אינו כולל מקרים מיוחדים: נשים בגילי 57–67 (עד 300 ימים), חיילים משוחררים, הכשרה מקצועית, הכנסות בזמן האבטלה. תנאי הזכאות המלאים בביטוח הלאומי.</Note>
    </Box>
  );
}

// ───────────────────────── שכר מינימום ─────────────────────────
function MinWage() {
  const [amount, setAmount] = useState('6000');
  const [basis, setBasis] = useState<'monthly' | 'hourly' | 'daily5' | 'daily6'>('monthly');
  const [hours, setHours] = useState('182');
  const r = useMemo(() => checkMinimumWage({ amount: Number(amount), basis, monthlyHours: Number(hours) }), [amount, basis, hours]);
  return (
    <Box title="בדיקת שכר מינימום">
      <div className="grid gap-4 sm:grid-cols-3">
        <Num label="השכר שלך (₪)" value={amount} set={setAmount} min="0" />
        <label className="block">
          בסיס
          <select className={field} value={basis} onChange={(e) => setBasis(e.target.value as typeof basis)}>
            <option value="monthly">חודשי (משרה מלאה)</option>
            <option value="hourly">לשעה</option>
            <option value="daily5">ליום (שבוע של 5 ימים)</option>
            <option value="daily6">ליום (שבוע של 6 ימים)</option>
          </select>
        </label>
        {basis === 'hourly' && <Num label="שעות בחודש במשרה מלאה אצלך" value={hours} set={setHours} min="1" />}
      </div>
      <Out>
        {r ? (
          <p className={`text-xl font-bold ${r.meets ? '' : 'text-red-700'}`}>
            {r.meets ? 'השכר עומד בשכר המינימום' : 'השכר נמוך משכר המינימום'} — המינימום: {money(r.minimum)}
            {' '}({r.difference >= 0 ? '+' : ''}{money(r.difference)})
          </p>
        ) : <p className="font-bold">בדקו את הערכים שהוזנו.</p>}
      </Out>
      <Note>שכר מינימום בתוקף מ־{r?.effectiveFrom ?? '1.4.2026'}. עובד חלקי מושווה לפי שעות; עובד במשרה חלקית בחוזה גלובלי — בדקו לפי השעות בפועל. תחולת שכר מינימום שונה לנוער, חניכים ועובדים מוגבלים.</Note>
    </Box>
  );
}

// ───────────────────────── שעות עבודה ─────────────────────────
function Hours() {
  const [start, setStart] = useState('08:00');
  const [end, setEnd] = useState('17:30');
  const [brk, setBrk] = useState('45');
  const [regular, setRegular] = useState('8');
  const [monthly, setMonthly] = useState('');
  const shift = useMemo(() => calculateShift({ start, end, breakMinutes: Number(brk) }), [start, end, brk]);
  const split = shift ? splitRegularOvertime(shift.netHours, Number(regular)) : null;
  const wage = monthly === '' ? 0 : hourlyWageFromMonthly(Number(monthly));
  const ot = split && wage > 0 ? calculateOvertimeDay(wage, split.overtime) : null;
  return (
    <Box title="מחשבון שעות עבודה">
      <div className="grid gap-4 sm:grid-cols-3">
        <label className="block">התחלה<input className={field} type="time" value={start} onChange={(e) => setStart(e.target.value)} /></label>
        <label className="block">סיום<input className={field} type="time" value={end} onChange={(e) => setEnd(e.target.value)} /></label>
        <Num label="הפסקה (דקות)" value={brk} set={setBrk} min="0" step="5" />
        <Num label="אורך יום עבודה רגיל (שעות)" value={regular} set={setRegular} min="1" step="0.1" />
        <Num label="שכר חודשי (אופציונלי, לאומדן שעות נוספות)" value={monthly} set={setMonthly} min="0" />
      </div>
      <Out>
        {shift ? (
          <>
            <p className="text-2xl font-bold">{formatHoursMinutes(shift.netMinutes)} שעות נטו ({shift.netHours})</p>
            {shift.crossesMidnight && <p className="text-sm">המשמרת חוצה חצות.</p>}
            {split && <p className="mt-1 text-sm">רגילות: {split.regular} · נוספות: {split.overtime}{ot ? ` · תשלום שעות נוספות: ${money(ot.totalPay)} (תוספת מעל שכר רגיל: ${money(ot.premium)})` : ''}</p>}
          </>
        ) : <p className="font-bold">בדקו את השעות וההפסקה.</p>}
      </Out>
      <Note>שעות נוספות: שתי הראשונות ב־125%, אחריהן 150%. הקביעה מהן שעות נוספות תלויה ביום ובשבוע העבודה החלים עליך. ראו את <a className="text-gold underline" href="/employee-rights/overtime">דף השעות הנוספות</a>.</Note>
    </Box>
  );
}

// ───────────────────────── ביטוח לאומי ─────────────────────────
function Btl() {
  const [income, setIncome] = useState('10000');
  const [status, setStatus] = useState<BtlStatus>('employee');
  const r = useMemo(() => calculateBtlContributions(Number(income), status), [income, status]);
  return (
    <Box title="דמי ביטוח לאומי ודמי ביטוח בריאות">
      <div className="grid gap-4 sm:grid-cols-2">
        <Num label="הכנסה חודשית ברוטו (₪)" value={income} set={setIncome} min="0" />
        <label className="block">
          מעמד
          <select className={field} value={status} onChange={(e) => setStatus(e.target.value as BtlStatus)}>
            <option value="employee">שכיר</option>
            <option value="self-employed">עצמאי</option>
          </select>
        </label>
      </div>
      <Out>
        {r ? (
          <>
            <p className="text-2xl font-bold">{money(r.total)} בחודש <span className="text-sm font-normal">({r.effectiveRatePct}% מההכנסה החייבת)</span></p>
            <p className="mt-1 text-sm">ביטוח לאומי {money(r.nationalInsurance)} · ביטוח בריאות {money(r.healthInsurance)}{status === 'employee' ? ` · חלק המעסיק: ${money(r.employer)}` : ''}</p>
            <p className="mt-1 text-sm text-ink/70">שיעור מופחת על {money(r.atReducedRate)}{r.atFullRate > 0 ? `, שיעור מלא על ${money(r.atFullRate)}` : ''}.</p>
          </>
        ) : <p className="font-bold">הזינו הכנסה חיובית.</p>}
      </Out>
      <Note>לעצמאי: הכנסה חייבת לפי הכללים, ללא ניכוי מס הכנסה (ניכוי חלקי מוכר נעשה בחישוב המס). אינו כולל תושבים שאינם עובדים או עובדים מעל גיל פרישה.</Note>
    </Box>
  );
}

const SECTIONS: Record<LaborSection, () => React.ReactElement> = {
  leave: Leave, notice: Notice, sick: Sick, holiday: Holiday, severance: Severance,
  tenure: Tenure, unemployment: Unemployment, minwage: MinWage, hours: Hours, btl: Btl,
};

export function LaborRightsCalculator({ section }: { section: LaborSection }) {
  const Component = SECTIONS[section];
  return <Component />;
}
