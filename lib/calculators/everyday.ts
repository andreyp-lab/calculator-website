/**
 * מחשבונים יומיומיים — פונקציות טהורות, ללא React וללא נתונים כספיים או משפטיים.
 * כל הנוסחאות מוכרות וציבוריות (מתמטיקה, יחידות מידה, נוסחאות בריאות מקובלות).
 * מחשבוני הבריאות הם הערכה כללית בלבד ואינם ייעוץ רפואי.
 */

const round = (n: number, d = 2) => {
  const f = 10 ** d;
  return Math.round(n * f) / f;
};
const ok = (...ns: number[]) => ns.every((n) => Number.isFinite(n));

// ───────────────────────── אחוזים והנחות ─────────────────────────

/** X% מתוך N. */
export const percentOf = (percent: number, n: number) => (ok(percent, n) ? round((percent / 100) * n, 6) : null);
/** כמה אחוזים part מתוך total. null כשהמחלק אפס. */
export const whatPercent = (part: number, total: number) => (ok(part, total) && total !== 0 ? round((part / total) * 100, 6) : null);
/** שינוי באחוזים מערך ישן לחדש. null כשהישן אפס. */
export const percentChange = (from: number, to: number) => (ok(from, to) && from !== 0 ? round(((to - from) / Math.abs(from)) * 100, 6) : null);
/** הוספה (positive) או הפחתה (negative) של אחוז מסכום. */
export const applyPercent = (n: number, percent: number) => (ok(n, percent) ? round(n * (1 + percent / 100), 6) : null);
/** מהו הסכום המקורי אם `final` הוא התוצאה אחרי הוספת/הפחתת אחוז. */
export const originalBeforePercent = (final: number, percent: number) =>
  ok(final, percent) && 1 + percent / 100 !== 0 ? round(final / (1 + percent / 100), 6) : null;

export interface DiscountResult {
  finalPrice: number;
  saved: number;
  combinedPct: number;
}
/** הנחות עוקבות (למשל 20% ואז עוד 20%): ההנחה המצטברת אינה סכום ההנחות. */
export function successiveDiscounts(price: number, discountsPct: number[]): DiscountResult | null {
  if (!ok(price) || price < 0 || discountsPct.length === 0 || discountsPct.some((d) => !Number.isFinite(d) || d < 0 || d > 100)) return null;
  const finalPrice = discountsPct.reduce((p, d) => p * (1 - d / 100), price);
  return { finalPrice: round(finalPrice), saved: round(price - finalPrice), combinedPct: price > 0 ? round((1 - finalPrice / price) * 100, 4) : 0 };
}

// ───────────────────────── טיפ וחלוקת חשבון ─────────────────────────

export interface TipResult {
  tip: number;
  total: number;
  perPerson: number;
  tipPerPerson: number;
}
export function calculateTip(bill: number, tipPct: number, people = 1): TipResult | null {
  if (!ok(bill, tipPct, people) || bill < 0 || tipPct < 0 || tipPct > 100 || !Number.isInteger(people) || people < 1 || people > 1000) return null;
  const tip = (bill * tipPct) / 100;
  const total = bill + tip;
  return { tip: round(tip), total: round(total), perPerson: round(total / people), tipPerPerson: round(tip / people) };
}

export interface Settlement {
  from: string;
  to: string;
  amount: number;
}
export interface SplitResult {
  total: number;
  share: number;
  balances: { name: string; paid: number; balance: number }[];
  settlements: Settlement[];
}
/** חלוקת הוצאות שווה בין משתתפים והעברות מינימליות כדי להתחשבן. */
export function splitExpenses(paid: { name: string; paid: number }[]): SplitResult | null {
  if (paid.length < 2 || paid.some((p) => !p.name.trim() || !Number.isFinite(p.paid) || p.paid < 0)) return null;
  const total = paid.reduce((s, p) => s + p.paid, 0);
  const share = total / paid.length;
  const balances = paid.map((p) => ({ name: p.name, paid: round(p.paid), balance: round(p.paid - share) }));
  const creditors = balances.filter((b) => b.balance > 0.004).map((b) => ({ name: b.name, left: b.balance })).sort((a, b) => b.left - a.left);
  const debtors = balances.filter((b) => b.balance < -0.004).map((b) => ({ name: b.name, left: -b.balance })).sort((a, b) => b.left - a.left);
  const settlements: Settlement[] = [];
  let i = 0;
  let j = 0;
  while (i < debtors.length && j < creditors.length) {
    const amount = Math.min(debtors[i].left, creditors[j].left);
    if (amount > 0.004) settlements.push({ from: debtors[i].name, to: creditors[j].name, amount: round(amount) });
    debtors[i].left -= amount;
    creditors[j].left -= amount;
    if (debtors[i].left <= 0.004) i++;
    if (creditors[j].left <= 0.004) j++;
  }
  return { total: round(total), share: round(share), balances, settlements };
}

// ───────────────────────── ממוצעים ─────────────────────────

export interface GradeEntry {
  value: number;
  /** משקל / נקודות זכות / יחידות לימוד. ברירת מחדל 1 (ממוצע פשוט). */
  weight?: number;
}
export function weightedAverage(entries: GradeEntry[]): number | null {
  if (entries.length === 0) return null;
  let sum = 0;
  let wsum = 0;
  for (const e of entries) {
    const w = e.weight ?? 1;
    if (!ok(e.value, w) || w < 0) return null;
    sum += e.value * w;
    wsum += w;
  }
  return wsum > 0 ? round(sum / wsum) : null;
}
export const simpleAverage = (values: number[]) => weightedAverage(values.map((value) => ({ value })));

// ───────────────────────── מהירות, זמן ומרחק ─────────────────────────

/** מקבל שניים משלושת הערכים ומחזיר את החסר. מהירות בקמ"ש, זמן בשעות, מרחק בק"מ. */
export function speedTimeDistance(input: { speed?: number; time?: number; distance?: number }) {
  const { speed, time, distance } = input;
  const given = [speed, time, distance].filter((x) => x !== undefined);
  if (given.length !== 2 || given.some((x) => !Number.isFinite(x as number) || (x as number) < 0)) return null;
  if (distance === undefined) return { distance: round((speed as number) * (time as number), 4) };
  if (time === undefined) return (speed as number) > 0 ? { time: round(distance / (speed as number), 4) } : null;
  return (time as number) > 0 ? { speed: round(distance / (time as number), 4) } : null;
}

// ───────────────────────── גיאומטריה ─────────────────────────

export type AreaShape = 'rectangle' | 'circle' | 'triangle' | 'trapezoid' | 'rooms';
export function area(shape: AreaShape, a: number, b = 0, c = 0): number | null {
  if (!ok(a, b, c) || a < 0 || b < 0 || c < 0) return null;
  switch (shape) {
    case 'rectangle': return round(a * b, 4);
    case 'circle': return round(Math.PI * a * a, 4); // a = רדיוס
    case 'triangle': return round((a * b) / 2, 4); // בסיס × גובה ÷ 2
    case 'trapezoid': return round(((a + b) / 2) * c, 4); // בסיסים a,b וגובה c
    default: return null;
  }
}
export type VolumeShape = 'cube' | 'box' | 'sphere' | 'cylinder' | 'cone' | 'pyramid';
export function volume(shape: VolumeShape, a: number, b = 0, c = 0): number | null {
  if (!ok(a, b, c) || a < 0 || b < 0 || c < 0) return null;
  switch (shape) {
    case 'cube': return round(a ** 3, 4);
    case 'box': return round(a * b * c, 4);
    case 'sphere': return round((4 / 3) * Math.PI * a ** 3, 4);
    case 'cylinder': return round(Math.PI * a * a * b, 4); // רדיוס, גובה
    case 'cone': return round((Math.PI * a * a * b) / 3, 4);
    case 'pyramid': return round((a * b * c) / 3, 4); // אורך, רוחב, גובה
    default: return null;
  }
}

// ───────────────────────── יחידות ─────────────────────────

export type UnitCategory = 'length' | 'weight' | 'area' | 'volume' | 'cooking';
/** מקדם ליחידת בסיס: אורך במטר, משקל בגרם, שטח במ"ר, נפח בליטר, מידות בישול (אמריקאיות) במ"ל. */
export const UNITS: Record<UnitCategory, Record<string, { label: string; factor: number }>> = {
  length: {
    mm: { label: 'מילימטר', factor: 0.001 }, cm: { label: 'סנטימטר', factor: 0.01 }, m: { label: 'מטר', factor: 1 },
    km: { label: 'קילומטר', factor: 1000 }, inch: { label: 'אינץ׳', factor: 0.0254 }, foot: { label: 'רגל (פיט)', factor: 0.3048 },
    yard: { label: 'יארד', factor: 0.9144 }, mile: { label: 'מייל', factor: 1609.344 },
  },
  weight: {
    mg: { label: 'מיליגרם', factor: 0.001 }, g: { label: 'גרם', factor: 1 }, kg: { label: 'קילוגרם', factor: 1000 },
    ton: { label: 'טון', factor: 1_000_000 }, oz: { label: 'אונקיה', factor: 28.349523125 }, lb: { label: 'פאונד', factor: 453.59237 },
  },
  area: {
    cm2: { label: 'סמ״ר', factor: 0.0001 }, m2: { label: 'מ״ר', factor: 1 }, dunam: { label: 'דונם', factor: 1000 },
    hectare: { label: 'הקטאר', factor: 10_000 }, km2: { label: 'קמ״ר', factor: 1_000_000 }, sqft: { label: 'רגל רבועה', factor: 0.09290304 },
    acre: { label: 'אקר', factor: 4046.8564224 },
  },
  volume: {
    ml: { label: 'מ״ל', factor: 0.001 }, l: { label: 'ליטר', factor: 1 }, m3: { label: 'מ״ק', factor: 1000 },
    galUS: { label: 'גלון אמריקאי', factor: 3.785411784 }, galUK: { label: 'גלון בריטי', factor: 4.54609 },
  },
  cooking: {
    ml: { label: 'מ״ל', factor: 1 }, l: { label: 'ליטר', factor: 1000 }, tsp: { label: 'כפית (אמריקאית)', factor: 4.92892159375 },
    tbsp: { label: 'כף (אמריקאית)', factor: 14.78676478125 }, floz: { label: 'אונקיית נוזל (אמריקאית)', factor: 29.5735295625 },
    cup: { label: 'כוס (אמריקאית)', factor: 236.5882365 },
  },
};
export function convertUnit(category: UnitCategory, from: string, to: string, value: number): number | null {
  const table = UNITS[category];
  if (!ok(value) || !table[from] || !table[to]) return null;
  return round((value * table[from].factor) / table[to].factor, 6);
}
export type TempUnit = 'C' | 'F' | 'K';
export function convertTemperature(value: number, from: TempUnit, to: TempUnit): number | null {
  if (!ok(value)) return null;
  const c = from === 'C' ? value : from === 'F' ? ((value - 32) * 5) / 9 : value - 273.15;
  if (c < -273.15) return null;
  const out = to === 'C' ? c : to === 'F' ? (c * 9) / 5 + 32 : c + 273.15;
  return round(out, 4);
}

// ───────────────────────── תאריכים ─────────────────────────

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
function parseDate(iso: string): Date | null {
  if (!DATE_RE.test(iso)) return null;
  const d = new Date(`${iso}T00:00:00Z`);
  return Number.isNaN(d.getTime()) ? null : d;
}
const DAY = 86_400_000;

export interface DateDiff {
  totalDays: number;
  weeks: number;
  remainderDays: number;
  years: number;
  months: number;
  days: number;
  weekdays: number; // ימים א'–ה' (ימי עסקים בישראל, ללא חגים)
}
/** הפרש בין שני תאריכים. הסדר אינו חשוב (מחזיר ערכים חיוביים). */
export function dateDifference(aIso: string, bIso: string): DateDiff | null {
  const a = parseDate(aIso);
  const b = parseDate(bIso);
  if (!a || !b) return null;
  const [s, e] = a <= b ? [a, b] : [b, a];
  const totalDays = Math.round((e.getTime() - s.getTime()) / DAY);
  let years = e.getUTCFullYear() - s.getUTCFullYear();
  let months = e.getUTCMonth() - s.getUTCMonth();
  let days = e.getUTCDate() - s.getUTCDate();
  if (days < 0) {
    months -= 1;
    days += new Date(Date.UTC(e.getUTCFullYear(), e.getUTCMonth(), 0)).getUTCDate();
  }
  if (months < 0) { years -= 1; months += 12; }
  let weekdays = 0;
  for (let t = s.getTime(); t < e.getTime(); t += DAY) {
    const dow = new Date(t).getUTCDay(); // 5 = שישי, 6 = שבת
    if (dow !== 5 && dow !== 6) weekdays++;
  }
  return { totalDays, weeks: Math.floor(totalDays / 7), remainderDays: totalDays % 7, years, months, days, weekdays };
}
export function addDays(iso: string, days: number): string | null {
  const d = parseDate(iso);
  if (!d || !Number.isInteger(days)) return null;
  return new Date(d.getTime() + days * DAY).toISOString().slice(0, 10);
}
export interface AgeResult extends DateDiff {
  nextBirthday: string;
  daysToNextBirthday: number;
}
export function calculateAge(birthIso: string, onIso: string): AgeResult | null {
  const b = parseDate(birthIso);
  const o = parseDate(onIso);
  if (!b || !o || o < b) return null;
  const diff = dateDifference(birthIso, onIso);
  if (!diff) return null;
  let next = new Date(Date.UTC(o.getUTCFullYear(), b.getUTCMonth(), b.getUTCDate()));
  if (next < o) next = new Date(Date.UTC(o.getUTCFullYear() + 1, b.getUTCMonth(), b.getUTCDate()));
  return { ...diff, nextBirthday: next.toISOString().slice(0, 10), daysToNextBirthday: Math.round((next.getTime() - o.getTime()) / DAY) };
}
/** תאריך עברי לפי לוח השנה העברי המובנה בדפדפן/Node (Intl). */
export function hebrewDate(iso: string): string | null {
  const d = parseDate(iso);
  if (!d) return null;
  return new Intl.DateTimeFormat('he-IL-u-ca-hebrew', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(d);
}

// ───────────────────────── בריאות (הערכות כלליות) ─────────────────────────

export type Sex = 'male' | 'female';
export type BmiCategory = 'underweight' | 'normal' | 'overweight' | 'obese';
/** קטגוריות WHO: מתחת 18.5, 18.5–24.9, 25–29.9, 30 ומעלה. */
export function calculateBmi(heightCm: number, weightKg: number) {
  if (!ok(heightCm, weightKg) || heightCm < 50 || heightCm > 260 || weightKg < 2 || weightKg > 500) return null;
  const m = heightCm / 100;
  const bmi = weightKg / (m * m);
  const category: BmiCategory = bmi < 18.5 ? 'underweight' : bmi < 25 ? 'normal' : bmi < 30 ? 'overweight' : 'obese';
  return { bmi: round(bmi, 1), category, healthyMinKg: round(18.5 * m * m, 1), healthyMaxKg: round(24.9 * m * m, 1) };
}
export const ACTIVITY_FACTORS = { sedentary: 1.2, light: 1.375, moderate: 1.55, high: 1.725, extreme: 1.9 } as const;
export type Activity = keyof typeof ACTIVITY_FACTORS;
/** Mifflin–St Jeor. */
export function calculateCalories(sex: Sex, age: number, heightCm: number, weightKg: number, activity: Activity) {
  if (!ok(age, heightCm, weightKg) || age < 10 || age > 120 || heightCm < 100 || heightCm > 250 || weightKg < 20 || weightKg > 400) return null;
  const bmr = 10 * weightKg + 6.25 * heightCm - 5 * age + (sex === 'male' ? 5 : -161);
  const tdee = bmr * ACTIVITY_FACTORS[activity];
  return { bmr: Math.round(bmr), tdee: Math.round(tdee), lose: Math.round(tdee - 500), gain: Math.round(tdee + 300) };
}
/** חלוקת מאקרו מקלוריות: אחוזים מקובלים למטרות שונות. חלבון/פחמימה 4 קלוריות לגרם, שומן 9. */
export const MACRO_SPLITS = { balanced: [0.25, 0.5, 0.25], highProtein: [0.35, 0.4, 0.25], lowCarb: [0.3, 0.3, 0.4] } as const;
export type MacroGoal = keyof typeof MACRO_SPLITS;
export function macroSplit(calories: number, goal: MacroGoal) {
  if (!ok(calories) || calories <= 0) return null;
  const [p, c, f] = MACRO_SPLITS[goal];
  return { proteinG: Math.round((calories * p) / 4), carbsG: Math.round((calories * c) / 4), fatG: Math.round((calories * f) / 9) };
}
/** משקל אידיאלי: Devine, Robinson, Miller (לפי אינצ'ים מעל 5 רגל). */
export function idealWeight(sex: Sex, heightCm: number) {
  if (!ok(heightCm) || heightCm < 130 || heightCm > 230) return null;
  const over = Math.max(0, heightCm / 2.54 - 60);
  const m = sex === 'male';
  return {
    devine: round((m ? 50 : 45.5) + 2.3 * over, 1),
    robinson: round((m ? 52 : 49) + (m ? 1.9 : 1.7) * over, 1),
    miller: round((m ? 56.2 : 53.1) + (m ? 1.41 : 1.36) * over, 1),
  };
}
/** אחוז שומן, שיטת הצי האמריקאי (היקפים בס"מ). */
export function bodyFatNavy(sex: Sex, heightCm: number, neckCm: number, waistCm: number, hipCm = 0) {
  if (!ok(heightCm, neckCm, waistCm, hipCm) || heightCm < 100 || neckCm <= 0 || waistCm <= neckCm) return null;
  let pct: number;
  if (sex === 'male') {
    pct = 495 / (1.0324 - 0.19077 * Math.log10(waistCm - neckCm) + 0.15456 * Math.log10(heightCm)) - 450;
  } else {
    if (hipCm <= 0 || waistCm + hipCm <= neckCm) return null;
    pct = 495 / (1.29579 - 0.35004 * Math.log10(waistCm + hipCm - neckCm) + 0.221 * Math.log10(heightCm)) - 450;
  }
  if (!Number.isFinite(pct) || pct < 0 || pct > 70) return null;
  return round(pct, 1);
}
/** דופק מרבי (Tanaka) ואזורי אימון לפי Karvonen (דופק עתודה). */
export function heartRateZones(age: number, restingHr: number) {
  if (!ok(age, restingHr) || age < 5 || age > 110 || restingHr < 30 || restingHr > 120) return null;
  const max = Math.round(208 - 0.7 * age);
  if (restingHr >= max) return null;
  const reserve = max - restingHr;
  const zone = (lo: number, hi: number) => ({ from: Math.round(restingHr + reserve * lo), to: Math.round(restingHr + reserve * hi) });
  return { max, zones: [zone(0.5, 0.6), zone(0.6, 0.7), zone(0.7, 0.8), zone(0.8, 0.9), zone(0.9, 1)] };
}
/** מחזורי שינה של 90 דקות, עם 15 דקות הירדמות: שעות קימה/שינה מומלצות. */
export function sleepTimes(timeHhmm: string, mode: 'wake' | 'bed') {
  const m = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(timeHhmm);
  if (!m) return null;
  const base = Number(m[1]) * 60 + Number(m[2]);
  const fmt = (min: number) => `${String(Math.floor(((min % 1440) + 1440) % 1440 / 60)).padStart(2, '0')}:${String(((min % 60) + 60) % 60).padStart(2, '0')}`;
  const out: { cycles: number; time: string; sleepHours: number }[] = [];
  for (const cycles of [6, 5, 4, 3]) {
    const total = cycles * 90;
    out.push({ cycles, sleepHours: round(total / 60, 1), time: mode === 'wake' ? fmt(base - total - 15) : fmt(base + total + 15) });
  }
  return out;
}
/** חישוב הריון לפי כלל Naegele: מועד לידה = הווסת האחרונה + 280 ימים. */
export function pregnancy(lmpIso: string, onIso: string) {
  const dueDate = addDays(lmpIso, 280);
  const lmp = parseDate(lmpIso);
  const on = parseDate(onIso);
  if (!dueDate || !lmp || !on || on < lmp) return null;
  const days = Math.round((on.getTime() - lmp.getTime()) / DAY);
  const weeks = Math.floor(days / 7);
  return { dueDate, weeks, days: days % 7, trimester: weeks < 13 ? 1 : weeks < 27 ? 2 : 3, daysLeft: 280 - days };
}
/** ביוץ משוער: 14 ימים לפני הווסת הבאה; חלון פוריות: 5 ימים לפני ועד יום הביוץ. */
export function ovulation(lmpIso: string, cycleLength: number) {
  if (!ok(cycleLength) || !Number.isInteger(cycleLength) || cycleLength < 21 || cycleLength > 45) return null;
  const ovulationDay = addDays(lmpIso, cycleLength - 14);
  const fertileStart = addDays(lmpIso, cycleLength - 19);
  const nextPeriod = addDays(lmpIso, cycleLength);
  if (!ovulationDay || !fertileStart || !nextPeriod) return null;
  return { ovulationDay, fertileStart, fertileEnd: ovulationDay, nextPeriod };
}
