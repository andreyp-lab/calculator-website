'use client';

import { useEffect, useMemo, useState, type ReactNode } from 'react';
import * as E from '@/lib/calculators/everyday';

export type EverydaySection =
  | 'percent' | 'discount' | 'tip' | 'split' | 'average' | 'speed' | 'area' | 'volume' | 'units' | 'cooking'
  | 'dates' | 'age' | 'hebrew' | 'countdown' | 'bmi' | 'calories' | 'macros' | 'ideal' | 'bodyfat' | 'heart'
  | 'sleep' | 'pregnancy' | 'ovulation';

const field = 'mt-2 block w-full border border-ink/20 bg-cream p-3';
const num = (v: number | null, d = 2) => (v === null ? '—' : v.toLocaleString('he-IL', { maximumFractionDigits: d }));
const today = () => new Date().toISOString().slice(0, 10);

function Box({ children }: { children: ReactNode }) {
  return <div className="my-8 border border-ink/15 bg-paper p-6" dir="rtl">{children}</div>;
}
function In({ label, value, set, type = 'number', ...rest }: { label: string; value: string; set: (v: string) => void; type?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      {label}
      <input className={field} type={type} inputMode={type === 'number' ? 'decimal' : undefined} value={value} onChange={(e) => set(e.target.value)} {...rest} />
    </label>
  );
}
function Sel({ label, value, set, options }: { label: string; value: string; set: (v: string) => void; options: [string, string][] }) {
  return (
    <label className="block">
      {label}
      <select className={field} value={value} onChange={(e) => set(e.target.value)}>
        {options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
      </select>
    </label>
  );
}
function Res({ children }: { children: ReactNode }) {
  return <div className="mt-4 text-lg font-bold" aria-live="polite">{children}</div>;
}
const Bad = () => <p>בדקו את הערכים שהוזנו.</p>;
const Note = ({ children }: { children: ReactNode }) => <p className="mt-3 text-sm leading-relaxed text-ink/70">{children}</p>;

function Percent() {
  const [a, setA] = useState('15'), [b, setB] = useState('200'), [c, setC] = useState('30'), [d, setD] = useState('200');
  const [e, setE] = useState('80'), [f, setF] = useState('100'), [g, setG] = useState('200'), [h, setH] = useState('18');
  return (
    <Box>
      <h2 className="mb-4 text-xl font-bold">אחוזים</h2>
      <div className="space-y-6">
        <div><div className="grid gap-4 sm:grid-cols-2"><In label="כמה הם … אחוז" value={a} set={setA} /><In label="מתוך המספר" value={b} set={setB} /></div><Res>{num(E.percentOf(Number(a), Number(b)), 4)}</Res></div>
        <div><div className="grid gap-4 sm:grid-cols-2"><In label="כמה אחוזים הוא המספר" value={c} set={setC} /><In label="מתוך" value={d} set={setD} /></div><Res>{E.whatPercent(Number(c), Number(d)) === null ? <Bad /> : `${num(E.whatPercent(Number(c), Number(d)), 4)}%`}</Res></div>
        <div><div className="grid gap-4 sm:grid-cols-2"><In label="ערך קודם" value={e} set={setE} /><In label="ערך חדש" value={f} set={setF} /></div><Res>{E.percentChange(Number(e), Number(f)) === null ? <Bad /> : `שינוי של ${num(E.percentChange(Number(e), Number(f)), 4)}%`}</Res></div>
        <div><div className="grid gap-4 sm:grid-cols-2"><In label="סכום" value={g} set={setG} /><In label="הוספת אחוז (שלילי = הפחתה)" value={h} set={setH} /></div><Res>{num(E.applyPercent(Number(g), Number(h)), 4)}</Res></div>
      </div>
    </Box>
  );
}

function Discount() {
  const [price, setPrice] = useState('1000'), [d1, setD1] = useState('20'), [d2, setD2] = useState('20');
  const r = E.successiveDiscounts(Number(price), d2 === '' ? [Number(d1)] : [Number(d1), Number(d2)]);
  return (
    <Box>
      <h2 className="mb-4 text-xl font-bold">הנחה ומחיר סופי</h2>
      <div className="grid gap-4 sm:grid-cols-3"><In label="מחיר מקורי (₪)" value={price} set={setPrice} /><In label="הנחה ראשונה (%)" value={d1} set={setD1} /><In label="הנחה נוספת (%) — אופציונלי" value={d2} set={setD2} /></div>
      <Res>{r ? <>מחיר סופי: {num(r.finalPrice)} ₪ · חיסכון: {num(r.saved)} ₪ · הנחה מצטברת: {num(r.combinedPct, 2)}%</> : <Bad />}</Res>
      <Note>שתי הנחות עוקבות אינן מצטברות לסכומן: 20% ועוד 20% הן 36% ולא 40%.</Note>
    </Box>
  );
}

function Tip() {
  const [bill, setBill] = useState('400'), [pct, setPct] = useState('12'), [people, setPeople] = useState('4');
  const r = E.calculateTip(Number(bill), Number(pct), Number(people));
  return (
    <Box>
      <h2 className="mb-4 text-xl font-bold">טיפ וחלוקת חשבון</h2>
      <div className="grid gap-4 sm:grid-cols-3"><In label="סכום החשבון (₪)" value={bill} set={setBill} /><In label="טיפ (%)" value={pct} set={setPct} /><In label="מספר סועדים" value={people} set={setPeople} step="1" /></div>
      <Res>{r ? <>טיפ: {num(r.tip)} ₪ · סך הכול: {num(r.total)} ₪ · לכל סועד: {num(r.perPerson)} ₪</> : <Bad />}</Res>
    </Box>
  );
}

function Split() {
  const [rows, setRows] = useState([{ name: 'דנה', paid: '300' }, { name: 'יוסי', paid: '0' }, { name: 'נועה', paid: '120' }]);
  const r = E.splitExpenses(rows.map((x) => ({ name: x.name, paid: Number(x.paid) })));
  return (
    <Box>
      <h2 className="mb-4 text-xl font-bold">הוצאות משותפות — מי חייב למי</h2>
      <div className="space-y-2">
        {rows.map((row, i) => (
          <div key={i} className="grid gap-2 sm:grid-cols-[1fr_1fr_auto]">
            <input className={field} aria-label="שם" value={row.name} onChange={(e) => setRows(rows.map((x, j) => (j === i ? { ...x, name: e.target.value } : x)))} />
            <input className={field} aria-label="שילם" type="number" min="0" value={row.paid} onChange={(e) => setRows(rows.map((x, j) => (j === i ? { ...x, paid: e.target.value } : x)))} />
            <button type="button" className="mt-2 text-sm underline" onClick={() => setRows(rows.filter((_, j) => j !== i))} disabled={rows.length <= 2}>הסר</button>
          </div>
        ))}
      </div>
      <button type="button" className="mt-3 border border-ink/30 px-3 py-2 text-sm" onClick={() => setRows([...rows, { name: `משתתף ${rows.length + 1}`, paid: '0' }])}>הוסף משתתף</button>
      <Res>
        {r ? (
          <>
            <p>סך ההוצאות: {num(r.total)} ₪ · חלק כל אחד: {num(r.share)} ₪</p>
            {r.settlements.length === 0 ? <p className="mt-2">אין צורך בהעברות.</p> : <ul className="mt-2 list-disc pr-5">{r.settlements.map((s, i) => <li key={i}>{s.from} מעביר/ה {num(s.amount)} ₪ ל{s.to}</li>)}</ul>}
          </>
        ) : <Bad />}
      </Res>
    </Box>
  );
}

function Average() {
  const [rows, setRows] = useState([{ v: '90', w: '5' }, { v: '85', w: '3' }, { v: '100', w: '2' }]);
  const weighted = E.weightedAverage(rows.map((r) => ({ value: Number(r.v), weight: Number(r.w) })));
  const simple = E.simpleAverage(rows.map((r) => Number(r.v)));
  return (
    <Box>
      <h2 className="mb-4 text-xl font-bold">ממוצע פשוט ומשוקלל</h2>
      <p className="mb-2 text-sm text-ink/70">ציון/ערך ומשקל (נקודות זכות או יחידות לימוד). לממוצע פשוט כל המשקלים שווים.</p>
      <div className="space-y-2">
        {rows.map((row, i) => (
          <div key={i} className="grid gap-2 sm:grid-cols-[1fr_1fr_auto]">
            <input className={field} aria-label="ציון" type="number" value={row.v} onChange={(e) => setRows(rows.map((x, j) => (j === i ? { ...x, v: e.target.value } : x)))} />
            <input className={field} aria-label="משקל" type="number" min="0" value={row.w} onChange={(e) => setRows(rows.map((x, j) => (j === i ? { ...x, w: e.target.value } : x)))} />
            <button type="button" className="mt-2 text-sm underline" onClick={() => setRows(rows.filter((_, j) => j !== i))} disabled={rows.length <= 1}>הסר</button>
          </div>
        ))}
      </div>
      <button type="button" className="mt-3 border border-ink/30 px-3 py-2 text-sm" onClick={() => setRows([...rows, { v: '', w: '1' }])}>הוסף שורה</button>
      <Res>{weighted === null ? <Bad /> : <>ממוצע משוקלל: {num(weighted)} · ממוצע פשוט: {num(simple)}</>}</Res>
    </Box>
  );
}

function Speed() {
  const [speed, setSpeed] = useState('90'), [time, setTime] = useState('2'), [dist, setDist] = useState('');
  const given = (s: string) => (s === '' ? undefined : Number(s));
  const r = E.speedTimeDistance({ speed: given(speed), time: given(time), distance: given(dist) });
  return (
    <Box>
      <h2 className="mb-4 text-xl font-bold">מהירות, זמן ומרחק</h2>
      <p className="mb-2 text-sm text-ink/70">מלאו שניים מתוך שלושה וקבלו את החסר.</p>
      <div className="grid gap-4 sm:grid-cols-3"><In label="מהירות (קמ״ש)" value={speed} set={setSpeed} /><In label="זמן (שעות)" value={time} set={setTime} /><In label="מרחק (ק״מ)" value={dist} set={setDist} /></div>
      <Res>{r ? Object.entries(r).map(([k, v]) => <span key={k}>{k === 'speed' ? 'מהירות' : k === 'time' ? 'זמן' : 'מרחק'}: {num(v as number, 4)}</span>) : <Bad />}</Res>
    </Box>
  );
}

function Area() {
  const [shape, setShape] = useState<E.AreaShape>('rectangle'), [a, setA] = useState('4'), [b, setB] = useState('5'), [c, setC] = useState('2');
  const labels: Record<string, [string, string, string]> = { rectangle: ['אורך', 'רוחב', ''], circle: ['רדיוס', '', ''], triangle: ['בסיס', 'גובה', ''], trapezoid: ['בסיס א׳', 'בסיס ב׳', 'גובה'] };
  const [la, lb, lc] = labels[shape] ?? labels.rectangle;
  return (
    <Box>
      <h2 className="mb-4 text-xl font-bold">שטח (מ״ר)</h2>
      <div className="grid gap-4 sm:grid-cols-4">
        <Sel label="צורה" value={shape} set={(v) => setShape(v as E.AreaShape)} options={[['rectangle', 'מלבן/ריבוע'], ['circle', 'עיגול'], ['triangle', 'משולש'], ['trapezoid', 'טרפז']]} />
        <In label={la} value={a} set={setA} />{lb && <In label={lb} value={b} set={setB} />}{lc && <In label={lc} value={c} set={setC} />}
      </div>
      <Res>{E.area(shape, Number(a), Number(b), Number(c)) === null ? <Bad /> : `${num(E.area(shape, Number(a), Number(b), Number(c)), 4)} (יחידות רבועות)`}</Res>
      <Note>הזינו את כל המידות באותה יחידה (מטרים לקבלת מ״ר). לחדר: אורך כפול רוחב.</Note>
    </Box>
  );
}

function Volume() {
  const [shape, setShape] = useState<E.VolumeShape>('box'), [a, setA] = useState('2'), [b, setB] = useState('3'), [c, setC] = useState('4');
  const labels: Record<string, [string, string, string]> = { cube: ['צלע', '', ''], box: ['אורך', 'רוחב', 'גובה'], sphere: ['רדיוס', '', ''], cylinder: ['רדיוס', 'גובה', ''], cone: ['רדיוס', 'גובה', ''], pyramid: ['אורך בסיס', 'רוחב בסיס', 'גובה'] };
  const [la, lb, lc] = labels[shape];
  return (
    <Box>
      <h2 className="mb-4 text-xl font-bold">נפח</h2>
      <div className="grid gap-4 sm:grid-cols-4">
        <Sel label="גוף" value={shape} set={(v) => setShape(v as E.VolumeShape)} options={[['cube', 'קובייה'], ['box', 'תיבה'], ['sphere', 'כדור'], ['cylinder', 'גליל'], ['cone', 'חרוט'], ['pyramid', 'פירמידה']]} />
        <In label={la} value={a} set={setA} />{lb && <In label={lb} value={b} set={setB} />}{lc && <In label={lc} value={c} set={setC} />}
      </div>
      <Res>{E.volume(shape, Number(a), Number(b), Number(c)) === null ? <Bad /> : `${num(E.volume(shape, Number(a), Number(b), Number(c)), 4)} (יחידות מעוקבות)`}</Res>
    </Box>
  );
}

const CATEGORY_LABELS: Record<E.UnitCategory, string> = { length: 'אורך', weight: 'משקל', area: 'שטח', volume: 'נפח', cooking: 'מידות בישול' };
function Units({ category: initial, title }: { category: E.UnitCategory; title: string }) {
  const fixed = initial === 'cooking';
  const [category, setCategory] = useState<E.UnitCategory>(initial);
  const keys = Object.keys(E.UNITS[category]);
  const [from, setFrom] = useState(keys[0]), [to, setTo] = useState(keys[2] ?? keys[1]), [value, setValue] = useState('1');
  const opts = keys.map((k) => [k, E.UNITS[category][k].label] as [string, string]);
  const [tf, setTf] = useState<E.TempUnit>('C'), [tt, setTt] = useState<E.TempUnit>('F'), [tv, setTv] = useState('100');
  const switchCategory = (c: E.UnitCategory) => {
    const k = Object.keys(E.UNITS[c]);
    setCategory(c); setFrom(k[0]); setTo(k[2] ?? k[1]);
  };
  const conv = E.convertUnit(category, from, to, Number(value));
  const temp = E.convertTemperature(Number(tv), tf, tt);
  return (
    <Box>
      <h2 className="mb-4 text-xl font-bold">{title}</h2>
      <div className="grid gap-4 sm:grid-cols-4">
        {!fixed && <Sel label="סוג" value={category} set={(v) => switchCategory(v as E.UnitCategory)} options={(['length', 'weight', 'area', 'volume'] as E.UnitCategory[]).map((c) => [c, CATEGORY_LABELS[c]] as [string, string])} />}
        <In label="ערך" value={value} set={setValue} /><Sel label="מ־" value={from} set={setFrom} options={opts} /><Sel label="ל־" value={to} set={setTo} options={opts} />
      </div>
      <Res>{conv === null ? <Bad /> : `${num(conv, 6)} ${E.UNITS[category][to].label}`}</Res>
      {!fixed && (
        <>
          <h3 className="mb-3 mt-8 text-lg font-bold">טמפרטורה</h3>
          <div className="grid gap-4 sm:grid-cols-3"><In label="ערך" value={tv} set={setTv} /><Sel label="מ־" value={tf} set={(v) => setTf(v as E.TempUnit)} options={[['C', 'צלזיוס'], ['F', 'פרנהייט'], ['K', 'קלווין']]} /><Sel label="ל־" value={tt} set={(v) => setTt(v as E.TempUnit)} options={[['C', 'צלזיוס'], ['F', 'פרנהייט'], ['K', 'קלווין']]} /></div>
          <Res>{temp === null ? <Bad /> : `${num(temp, 2)}°`}</Res>
        </>
      )}
      {fixed && <Note>מידות אמריקאיות סטנדרטיות לנפח. המרה לגרמים תלויה בחומר (קמח, סוכר ועוד) ולכן אינה כלולה.</Note>}
    </Box>
  );
}

function Dates() {
  const [a, setA] = useState(today()), [b, setB] = useState(E.addDays(today(), 30) ?? today()), [add, setAdd] = useState('90');
  const d = E.dateDifference(a, b);
  return (
    <Box>
      <h2 className="mb-4 text-xl font-bold">הפרש בין תאריכים</h2>
      <div className="grid gap-4 sm:grid-cols-2"><In label="מתאריך" type="date" value={a} set={setA} /><In label="עד תאריך" type="date" value={b} set={setB} /></div>
      <Res>{d ? <>{num(d.totalDays, 0)} ימים · {d.weeks} שבועות ו־{d.remainderDays} ימים · {d.years} שנים, {d.months} חודשים, {d.days} ימים · ימי עבודה (א׳–ה׳): {d.weekdays}</> : <Bad />}</Res>
      <h3 className="mb-3 mt-8 text-lg font-bold">הוספת ימים לתאריך</h3>
      <div className="grid max-w-md gap-4 sm:grid-cols-2"><In label="ימים (שלילי = אחורה)" value={add} set={setAdd} step="1" /></div>
      <Res>{E.addDays(a, Number(add)) ?? <Bad />}</Res>
    </Box>
  );
}

function Age() {
  const [birth, setBirth] = useState('1990-05-20'), [on, setOn] = useState(today());
  const r = E.calculateAge(birth, on);
  return (
    <Box>
      <h2 className="mb-4 text-xl font-bold">גיל מדויק</h2>
      <div className="grid gap-4 sm:grid-cols-2"><In label="תאריך לידה" type="date" value={birth} set={setBirth} /><In label="נכון לתאריך" type="date" value={on} set={setOn} /></div>
      <Res>{r ? <><p>{r.years} שנים, {r.months} חודשים, {r.days} ימים</p><p className="mt-1 text-base font-normal">{num(r.totalDays, 0)} ימים · יום הולדת הבא: {r.nextBirthday} (בעוד {r.daysToNextBirthday} ימים) · תאריך עברי ללידה: {E.hebrewDate(birth)}</p></> : <Bad />}</Res>
    </Box>
  );
}

function Hebrew() {
  const [d, setD] = useState(today());
  return (
    <Box>
      <h2 className="mb-4 text-xl font-bold">המרת תאריך לועזי לעברי</h2>
      <div className="grid max-w-md gap-4"><In label="תאריך לועזי" type="date" value={d} set={setD} /></div>
      <Res>{E.hebrewDate(d) ?? <Bad />}</Res>
      <Note>התאריך העברי מחושב לפי לוח השנה העברי המובנה בדפדפן. תאריך שמתחיל בערב (אחרי שקיעה) כבר שייך ליום העברי הבא.</Note>
    </Box>
  );
}

function Countdown() {
  const [target, setTarget] = useState(`${new Date().getFullYear() + 1}-01-01`);
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const end = new Date(`${target}T00:00:00`).getTime();
  const left = now === null || Number.isNaN(end) ? null : end - now;
  const parts = left === null || left < 0 ? null : { d: Math.floor(left / 86_400_000), h: Math.floor((left / 3_600_000) % 24), m: Math.floor((left / 60_000) % 60), s: Math.floor((left / 1000) % 60) };
  return (
    <Box>
      <h2 className="mb-4 text-xl font-bold">ספירה לאחור</h2>
      <div className="grid max-w-md gap-4"><In label="תאריך יעד" type="date" value={target} set={setTarget} /></div>
      <Res>{parts ? `${parts.d} ימים ${parts.h} שעות ${parts.m} דקות ${parts.s} שניות` : left !== null && left < 0 ? 'התאריך עבר.' : '…'}</Res>
    </Box>
  );
}

function Bmi() {
  const [h, setH] = useState('175'), [w, setW] = useState('72');
  const r = E.calculateBmi(Number(h), Number(w));
  const names = { underweight: 'תת־משקל', normal: 'משקל תקין', overweight: 'עודף משקל', obese: 'השמנה' };
  return (
    <Box>
      <h2 className="mb-4 text-xl font-bold">BMI — מדד מסת גוף</h2>
      <div className="grid gap-4 sm:grid-cols-2"><In label="גובה (ס״מ)" value={h} set={setH} /><In label="משקל (ק״ג)" value={w} set={setW} /></div>
      <Res>{r ? <>BMI {r.bmi} — {names[r.category]} · טווח משקל תקין לגובה: {r.healthyMinKg}–{r.healthyMaxKg} ק״ג</> : <Bad />}</Res>
      <Note>קטגוריות ארגון הבריאות העולמי למבוגרים. BMI אינו מבחין בין שומן לשריר ואינו אבחנה רפואית.</Note>
    </Box>
  );
}

function Calories({ withMacros }: { withMacros?: boolean }) {
  const [sex, setSex] = useState<E.Sex>('male'), [age, setAge] = useState('30'), [h, setH] = useState('175'), [w, setW] = useState('72');
  const [act, setAct] = useState<E.Activity>('moderate'), [goal, setGoal] = useState<E.MacroGoal>('balanced');
  const r = E.calculateCalories(sex, Number(age), Number(h), Number(w), act);
  const mac = r ? E.macroSplit(r.tdee, goal) : null;
  return (
    <Box>
      <h2 className="mb-4 text-xl font-bold">{withMacros ? 'חלוקת מאקרו יומית' : 'קלוריות יומיות (BMR ו־TDEE)'}</h2>
      <div className="grid gap-4 sm:grid-cols-3">
        <Sel label="מין" value={sex} set={(v) => setSex(v as E.Sex)} options={[['male', 'גבר'], ['female', 'אישה']]} />
        <In label="גיל" value={age} set={setAge} /><In label="גובה (ס״מ)" value={h} set={setH} /><In label="משקל (ק״ג)" value={w} set={setW} />
        <Sel label="פעילות" value={act} set={(v) => setAct(v as E.Activity)} options={[['sedentary', 'כמעט ללא פעילות'], ['light', 'קלה (1–3 אימונים בשבוע)'], ['moderate', 'בינונית (3–5)'], ['high', 'גבוהה (6–7)'], ['extreme', 'קיצונית']]} />
        {withMacros && <Sel label="חלוקה" value={goal} set={(v) => setGoal(v as E.MacroGoal)} options={[['balanced', 'מאוזנת'], ['highProtein', 'עתירת חלבון'], ['lowCarb', 'דלת פחמימות']]} />}
      </div>
      <Res>{r ? <><p>BMR: {r.bmr} קל׳ · TDEE (שמירה על משקל): {r.tdee} קל׳</p><p className="mt-1 text-base font-normal">לירידה הדרגתית: ~{r.lose} · לעלייה: ~{r.gain}</p>{withMacros && mac && <p className="mt-1 text-base font-normal">חלבון {mac.proteinG} ג׳ · פחמימות {mac.carbsG} ג׳ · שומן {mac.fatG} ג׳</p>}</> : <Bad />}</Res>
      <Note>נוסחת Mifflin–St Jeor. הערכה כללית בלבד; להתאמה אישית פנו לדיאטן/ית.</Note>
    </Box>
  );
}

function Ideal() {
  const [sex, setSex] = useState<E.Sex>('male'), [h, setH] = useState('175');
  const r = E.idealWeight(sex, Number(h));
  return (
    <Box>
      <h2 className="mb-4 text-xl font-bold">משקל אידיאלי</h2>
      <div className="grid gap-4 sm:grid-cols-2"><Sel label="מין" value={sex} set={(v) => setSex(v as E.Sex)} options={[['male', 'גבר'], ['female', 'אישה']]} /><In label="גובה (ס״מ)" value={h} set={setH} /></div>
      <Res>{r ? <>Devine: {r.devine} · Robinson: {r.robinson} · Miller: {r.miller} ק״ג</> : <Bad />}</Res>
      <Note>שלוש נוסחאות מקובלות המניבות טווח. אינן מתחשבות בהרכב גוף.</Note>
    </Box>
  );
}

function BodyFat() {
  const [sex, setSex] = useState<E.Sex>('male'), [h, setH] = useState('180'), [neck, setNeck] = useState('38'), [waist, setWaist] = useState('88'), [hip, setHip] = useState('98');
  const r = E.bodyFatNavy(sex, Number(h), Number(neck), Number(waist), Number(hip));
  return (
    <Box>
      <h2 className="mb-4 text-xl font-bold">אחוז שומן בגוף (שיטת הצי האמריקאי)</h2>
      <div className="grid gap-4 sm:grid-cols-3">
        <Sel label="מין" value={sex} set={(v) => setSex(v as E.Sex)} options={[['male', 'גבר'], ['female', 'אישה']]} />
        <In label="גובה (ס״מ)" value={h} set={setH} /><In label="היקף צוואר (ס״מ)" value={neck} set={setNeck} /><In label="היקף מותניים (ס״מ)" value={waist} set={setWaist} />
        {sex === 'female' && <In label="היקף ירכיים (ס״מ)" value={hip} set={setHip} />}
      </div>
      <Res>{r === null ? <Bad /> : `${r}% שומן`}</Res>
      <Note>הערכה לפי היקפים; מדידה קלינית מדויקת יותר.</Note>
    </Box>
  );
}

function Heart() {
  const [age, setAge] = useState('35'), [rest, setRest] = useState('60');
  const r = E.heartRateZones(Number(age), Number(rest));
  return (
    <Box>
      <h2 className="mb-4 text-xl font-bold">דופק אימון ואזורי דופק</h2>
      <div className="grid gap-4 sm:grid-cols-2"><In label="גיל" value={age} set={setAge} /><In label="דופק מנוחה" value={rest} set={setRest} /></div>
      <Res>{r ? <><p>דופק מרבי (Tanaka): {r.max}</p><ul className="mt-2 list-disc pr-5 text-base font-normal">{r.zones.map((z, i) => <li key={i}>אזור {i + 1} ({50 + i * 10}%–{60 + i * 10}% מהעתודה): {z.from}–{z.to}</li>)}</ul></> : <Bad />}</Res>
      <Note>שיטת Karvonen (דופק עתודה). הערכה כללית; מצבים רפואיים דורשים הנחיית רופא.</Note>
    </Box>
  );
}

function Sleep() {
  const [t, setT] = useState('07:00'), [mode, setMode] = useState<'wake' | 'bed'>('wake');
  const r = E.sleepTimes(t, mode);
  return (
    <Box>
      <h2 className="mb-4 text-xl font-bold">מחשבון שינה</h2>
      <div className="grid gap-4 sm:grid-cols-2"><Sel label="אני רוצה" value={mode} set={(v) => setMode(v as 'wake' | 'bed')} options={[['wake', 'לקום בשעה…'], ['bed', 'ללכת לישון בשעה…']]} /><In label="שעה" type="time" value={t} set={setT} /></div>
      <Res>{r ? <ul className="list-disc pr-5">{r.map((x) => <li key={x.cycles}>{mode === 'wake' ? 'ללכת לישון' : 'לקום'} ב־{x.time} ({x.cycles} מחזורים, {x.sleepHours} שעות)</li>)}</ul> : <Bad />}</Res>
      <Note>מחזור שינה ממוצע הוא 90 דקות, ונלקחות 15 דקות הירדמות. מתאים לרוב אך משתנה בין אנשים.</Note>
    </Box>
  );
}

function Pregnancy() {
  const [lmp, setLmp] = useState(E.addDays(today(), -70) ?? today()), [on, setOn] = useState(today());
  const r = E.pregnancy(lmp, on);
  return (
    <Box>
      <h2 className="mb-4 text-xl font-bold">הריון: שבוע ותאריך לידה משוער</h2>
      <div className="grid gap-4 sm:grid-cols-2"><In label="תאריך הווסת האחרונה" type="date" value={lmp} set={setLmp} /><In label="נכון לתאריך" type="date" value={on} set={setOn} /></div>
      <Res>{r ? <>שבוע {r.weeks} ו־{r.days} ימים (טרימסטר {r.trimester}) · תאריך לידה משוער: {r.dueDate} · נותרו {r.daysLeft} ימים</> : <Bad />}</Res>
      <Note>כלל Naegele: 280 ימים מהווסת האחרונה, לזמן מחזור של 28 יום. תאריך הלידה בפועל משתנה; הסתמכו על הרופא/ה.</Note>
    </Box>
  );
}

function Ovulation() {
  const [lmp, setLmp] = useState(today()), [cycle, setCycle] = useState('28');
  const r = E.ovulation(lmp, Number(cycle));
  return (
    <Box>
      <h2 className="mb-4 text-xl font-bold">ביוץ וחלון פוריות</h2>
      <div className="grid gap-4 sm:grid-cols-2"><In label="תחילת הווסת האחרונה" type="date" value={lmp} set={setLmp} /><In label="אורך המחזור (ימים, 21–45)" value={cycle} set={setCycle} step="1" /></div>
      <Res>{r ? <>ביוץ משוער: {r.ovulationDay} · חלון פוריות: {r.fertileStart} עד {r.fertileEnd} · ווסת הבאה: {r.nextPeriod}</> : <Bad />}</Res>
      <Note>הערכה לפי ביוץ 14 ימים לפני הווסת הבאה. אינה אמצעי מניעה ואינה מחליפה בדיקות או ייעוץ רפואי.</Note>
    </Box>
  );
}

export function EverydayCalculator({ section }: { section: EverydaySection }) {
  const m = useMemo<Record<EverydaySection, () => ReactNode>>(
    () => ({
      percent: () => <Percent />, discount: () => <Discount />, tip: () => <Tip />, split: () => <Split />, average: () => <Average />,
      speed: () => <Speed />, area: () => <Area />, volume: () => <Volume />, units: () => <Units category="length" title="המרת יחידות מידה" />,
      cooking: () => <Units category="cooking" title="ממיר מידות בישול" />, dates: () => <Dates />, age: () => <Age />,
      hebrew: () => <Hebrew />, countdown: () => <Countdown />, bmi: () => <Bmi />, calories: () => <Calories />, macros: () => <Calories withMacros />,
      ideal: () => <Ideal />, bodyfat: () => <BodyFat />, heart: () => <Heart />, sleep: () => <Sleep />, pregnancy: () => <Pregnancy />, ovulation: () => <Ovulation />,
    }),
    [],
  );
  return <>{m[section]()}</>;
}
