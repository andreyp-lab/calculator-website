/**
 * תעריפי ארנונה למגורים לפי עיר — נתונים ידניים ממקור רשמי בלבד.
 *
 * כללים:
 *  - כל תעריף נלקח מצו הארנונה שהעירייה מפרסמת באתר שלה; אסור להעתיק מאתרי מחשבונים.
 *  - לכל עיר: שנה, קישור למקור, תאריך אימות, וציון עמוד/סעיף בהערות.
 *  - לא למשוך אוטומטית. תעריפים משתנים כל שנה בצו חדש (עדכון חוקי + החלטות מועצה).
 *  - נוסף ערך חדש → להוסיף ל-`ARNONA_CITIES` ולוודא שבדיקת העקביות ב-tests/unit/arnona-data.test.ts עוברת.
 *  - המנוע עצמו (`lib/calculators/arnona.ts`) לא מכיר ערים ולא מכיל מספרים.
 */

import type { ArnonaZoneRate } from '@/lib/calculators/arnona';

export interface ArnonaBuildingClass {
  id: string;
  label: string;
}

export interface ArnonaZone {
  id: string;
  label: string;
  description?: string;
  /** תעריף אחיד לאזור (כשאין מימד סוג בניין) */
  rate?: ArnonaZoneRate;
  /** תעריף לפי סוג בניין (`classes` של העיר) */
  rateByClass?: Record<string, ArnonaZoneRate>;
}

export interface ArnonaDiscountDef {
  id: string;
  label: string;
  percent: number;
  /** ההנחה חלה רק על N המ"ר הראשונים */
  maxSqm?: number;
  conditions: string;
}

export interface ArnonaCity {
  /** מזהה ייחודי של מערך הנתונים (עיר + שנה) */
  id: string;
  name: string;
  year: number;
  /** סטטוס הצו: ברירת מחדל "בתוקף". "ממתין לאישור" לצו שאושר במועצה בלבד */
  status?: 'in-force' | 'pending-approval';
  /** סוגי בניין, כשהתעריף תלוי בהם */
  classes?: ArnonaBuildingClass[];
  /** הסבר איך לדעת את סוג הבניין / האזור */
  classHelp?: string;
  zones: ArnonaZone[];
  discounts?: ArnonaDiscountDef[];
  sourceUrl: string;
  sourceLabel: string;
  /** YYYY-MM-DD — מתי התעריפים אומתו מול המקור */
  verifiedAt: string;
  notes?: string[];
}

// ───────────────────────── תל אביב-יפו ─────────────────────────
// מקור: חוברת צו הארנונה, סעיף 2.3 ("התעריפים לכל מ"ר - בש"ח לשנה"), עמ' 8.
// אזורי המס מוגדרים במפה (עמ' 5 בחוברת 2027) ובחריגי רחובות/מבננים; לא ברשימת רחובות.
// עמודות בטבלה: [אזור 1 וילות/מעל 140, אזור 1 עד 140, אזור 2 וילות/מעל 140,
//                אזור 2 עד 140, אזור 3, אזורים 4–5]
type TelAvivRow = readonly [number, number, number, number, number, number];

const TEL_AVIV_CLASSES: ArnonaBuildingClass[] = [
  { id: 'aa', label: 'אא — החדשים והמשופרים ביותר, וילות' },
  { id: 'ka', label: 'כא' },
  { id: 'het-a', label: 'ח+א' },
  { id: 'bet-gimel', label: 'ב+ג' },
  { id: 'dalet', label: 'ד' },
  { id: 'he-vav', label: 'ה+ו — הישנים והפשוטים ביותר' },
];

const TEL_AVIV_2026: Record<string, TelAvivRow> = {
  aa: [139.6, 112.99, 108.98, 90.71, 78.39, 64.42],
  ka: [138.97, 112.49, 108.49, 90.29, 78.06, 64.13],
  'het-a': [132.35, 107.12, 103.33, 86.01, 74.34, 61.09],
  'bet-gimel': [112.16, 90.78, 87.56, 72.89, 63.01, 54.05],
  dalet: [97.54, 78.94, 76.14, 63.38, 54.79, 49.15],
  'he-vav': [84.81, 68.64, 66.21, 55.1, 47.65, 46.64],
};

const TEL_AVIV_2027: Record<string, TelAvivRow> = {
  aa: [143.86, 116.44, 112.3, 93.48, 80.78, 66.38],
  ka: [143.21, 115.92, 111.8, 93.04, 80.44, 66.09],
  'het-a': [136.39, 110.39, 106.48, 88.63, 76.61, 62.95],
  'bet-gimel': [115.58, 93.55, 90.23, 75.11, 64.93, 55.7],
  dalet: [100.51, 81.35, 78.46, 65.31, 56.46, 50.65],
  'he-vav': [87.4, 70.73, 68.23, 56.78, 49.1, 48.06],
};

const bandRate = (upTo140: number, over140: number): ArnonaZoneRate => ({
  bands: [
    { upToSqm: 140, ratePerSqm: upTo140 },
    { upToSqm: Infinity, ratePerSqm: over140 },
  ],
});
const flatRate = (rate: number): ArnonaZoneRate => ({ ratePerSqm: rate });

function telAvivZones(table: Record<string, TelAvivRow>): ArnonaZone[] {
  const pick = (build: (row: TelAvivRow) => ArnonaZoneRate) =>
    Object.fromEntries(Object.entries(table).map(([cls, row]) => [cls, build(row)]));
  return [
    {
      id: 'z1',
      label: 'אזור 1',
      description: 'דירה עד 140 מ״ר בתעריף נמוך; וילה או דירה מעל 140 מ״ר בתעריף גבוה לכל השטח.',
      rateByClass: pick((r) => bandRate(r[1], r[0])),
    },
    {
      id: 'z2',
      label: 'אזור 2',
      description: 'דירה עד 140 מ״ר בתעריף נמוך; וילה או דירה מעל 140 מ״ר בתעריף גבוה לכל השטח.',
      rateByClass: pick((r) => bandRate(r[3], r[2])),
    },
    { id: 'z3', label: 'אזור 3', rateByClass: pick((r) => flatRate(r[4])) },
    { id: 'z45', label: 'אזורים 4 ו-5', rateByClass: pick((r) => flatRate(r[5])) },
  ];
}

// הנחות שנקראו בבירור בסעיף 6 בצו ("הנחות בארנונה"), בשתי השנים זהות. הנחות שהאחוז שלהן
// לא היה קריא או שתלויות בטבלת הכנסה — לא כלולות כאן בכוונה (ראו notes).
const TEL_AVIV_DISCOUNTS: ArnonaDiscountDef[] = [
  {
    id: 'senior',
    label: 'אזרח ותיק (מקבל קצבת זקנה/שאירים)',
    percent: 12.5,
    maxSqm: 100,
    conditions: 'מקבל קצבת זקנה, שאירים, תלויים או נפגעי עבודה; על דירת מגורים בלבד.',
  },
  {
    id: 'senior-income-support',
    label: 'אזרח ותיק המקבל גם הבטחת הכנסה',
    percent: 100,
    maxSqm: 100,
    conditions: 'מקבל קצבה כאמור וגם הבטחת הכנסה.',
  },
  {
    id: 'disabled',
    label: 'נכה (נכות 75% ומעלה)',
    percent: 80,
    conditions: 'זכאי לקצבה חודשית מלאה, או נכות/אי־כושר עבודה של 75% ומעלה.',
  },
  {
    id: 'blind',
    label: 'עיוור (בעל תעודת עיוור)',
    percent: 90,
    conditions: 'בעל תעודת עיוור.',
  },
  {
    id: 'new-immigrant',
    label: 'עולה חדש',
    percent: 50,
    maxSqm: 100,
    conditions: 'במשך 12 חודשים מתוך 24 מיום הרישום כעולה.',
  },
  {
    id: 'nazi-compensation',
    label: 'מקבל תגמולים כמפורט בצו (נרדפי הנאצים ודומיהם)',
    percent: 66,
    maxSqm: 70,
    conditions: 'מקבל אחד מתשלומי הפיצוי המנויים בצו.',
  },
];

const TEL_AVIV_NOTES = [
  'סוג הבניין נקבע לפי שנת הבנייה וסוג הנכס (סעיף 2.1 בצו) ומופיע בחשבון הארנונה.',
  'אזור המס נקבע לפי מפת האזורים בצו ורשימות החריגים לרחובות ולמבננים; הוא מופיע בחשבון הארנונה.',
  'לא כלולות כאן הנחות לפי הכנסה (טבלת הכנסה לפי גודל משק בית), משפחה מרובת ילדים, הורה יחיד, מילואים ונכס ריק — יש לבדוק בצו.',
  'השטח מעוגל למטר שלם; שטחי חניה בלבד אינם נספרים בדירת מגורים.',
];

// ───────────────────────── חיפה ─────────────────────────
// מקור: צו המסים (ארנונה) של עיריית חיפה, טבלת "מגורים" — חיפה הרגילה, ללא קריית חיים
// (עמ' 7 מודפס; עמ' 11 ב-PDF). אזורי השומה (א'–ד') אינם מוגדרים בצו אלא ברשימת רחובות של
// העירייה. בניין גובל בכמה אזורים מחויב באזור הגבוה. תעריף לפי סוג בניין (מ1–מ6) וגודל דירה.
// מ1: עד 100 מ"ר בתעריף אחד והשטח העודף מעל 100 בתעריף אחר (שולי). מ2–מ4: תעריף לכל הדירה לפי
// טווח השטח (עד 75 / 76–100 / מעל 100). קריית חיים לא נכללת (טבלה נפרדת עם אי־בהירות בקריאה).
type HaifaRow = {
  // [אזור א', ב', ג', ד'] — null = אין תעריף באזור
  m1Base: readonly (number | null)[]; // מ1 עד 100 מ"ר
  m1Extra: readonly (number | null)[]; // מ1 לכל מ"ר מעל 100
  m2Over100: readonly number[];
  m2To100: readonly number[]; // 76–100
  m2To75: readonly number[];
  m3Over75: readonly number[];
  m3To75: readonly number[];
  m4Over75: readonly number[];
  m4To75: readonly number[];
  m56: readonly number[];
};

const HAIFA_CLASSES: ArnonaBuildingClass[] = [
  { id: 'm1', label: 'מ1 — משובח (עד 2 דירות, עם חימום מרכזי / מוסך פרטי / בריכה / 2 חדרי רחצה)' },
  { id: 'm2', label: 'מ2 — רגיל' },
  { id: 'm3', label: 'מ3 — חלקו מתחת לקרקע' },
  { id: 'm4', label: 'מ4 — פשוט' },
  { id: 'm5', label: 'מ5 — בניין עזר' },
  { id: 'm6', label: 'מ6 — פשוט חלקו מתחת לקרקע, או מרתף' },
];

const HAIFA_2026: HaifaRow = {
  m1Base: [119.57, 90.5, 63.13, null],
  m1Extra: [125.59, 115.64, 90.79, null],
  m2Over100: [119.57, 90.5, 63.13, 44.68],
  m2To100: [103.94, 78.79, 53.62, 43.12],
  m2To75: [90.07, 68.46, 47.52, 43.12],
  m3Over75: [65.25, 48.94, 43.12, 43.12],
  m3To75: [56.42, 43.12, 43.12, 43.12],
  m4Over75: [48.94, 43.12, 43.12, 43.12],
  m4To75: [43.12, 43.12, 43.12, 43.12],
  m56: [43.12, 43.12, 43.12, 43.12],
};

const HAIFA_2027: HaifaRow = {
  m1Base: [123.22, 93.26, 65.06, null],
  m1Extra: [129.42, 119.17, 93.56, null],
  m2Over100: [123.22, 93.26, 65.06, 46.04],
  m2To100: [107.11, 81.19, 55.26, 44.44],
  m2To75: [92.82, 70.55, 48.97, 44.44],
  m3Over75: [67.24, 50.43, 44.44, 44.44],
  m3To75: [58.14, 44.44, 44.44, 44.44],
  m4Over75: [50.43, 44.44, 44.44, 44.44],
  m4To75: [44.44, 44.44, 44.44, 44.44],
  m56: [44.44, 44.44, 44.44, 44.44],
};

const HAIFA_ZONE_LABELS = ['אזור א׳', 'אזור ב׳', 'אזור ג׳', 'אזור ד׳'];

function haifaZones(t: HaifaRow): ArnonaZone[] {
  return HAIFA_ZONE_LABELS.map((label, i) => {
    const rateByClass: Record<string, ArnonaZoneRate> = {};
    const base = t.m1Base[i];
    const extra = t.m1Extra[i];
    if (base !== null && extra !== null) {
      rateByClass.m1 = {
        tiers: [
          { upToSqm: 100, ratePerSqm: base },
          { upToSqm: Infinity, ratePerSqm: extra },
        ],
      };
    }
    rateByClass.m2 = {
      bands: [
        { upToSqm: 75, ratePerSqm: t.m2To75[i] },
        { upToSqm: 100, ratePerSqm: t.m2To100[i] },
        { upToSqm: Infinity, ratePerSqm: t.m2Over100[i] },
      ],
    };
    rateByClass.m3 = {
      bands: [
        { upToSqm: 75, ratePerSqm: t.m3To75[i] },
        { upToSqm: Infinity, ratePerSqm: t.m3Over75[i] },
      ],
    };
    rateByClass.m4 = {
      bands: [
        { upToSqm: 75, ratePerSqm: t.m4To75[i] },
        { upToSqm: Infinity, ratePerSqm: t.m4Over75[i] },
      ],
    };
    rateByClass.m5 = { ratePerSqm: t.m56[i] };
    rateByClass.m6 = { ratePerSqm: t.m56[i] };
    return {
      id: `z${i + 1}`,
      label,
      description:
        i === 3 ? 'באזור ד׳ אין תעריף לבניין משובח (מ1).' : undefined,
      rateByClass,
    };
  });
}

// הנחות בצו 2026 (סעיף ההנחות לדירת מגורים בלבד, עמ' 29–38 מודפס). נבחרו הנחות שנקראו בבירור.
// הנחות לפי הכנסה, התחדשות עירונית ונזקקות לא כלולות (ראו notes).
const HAIFA_DISCOUNTS_2026: ArnonaDiscountDef[] = [
  {
    id: 'senior',
    label: 'אזרח ותיק (הכנסה עד השכר הממוצע)',
    percent: 30,
    maxSqm: 100,
    conditions:
      'הכנסה שאינה עולה על השכר הממוצע (בהתאם לצו; בני זוג — עד 150% מהשכר הממוצע במצטבר).',
  },
  {
    id: 'senior-income-support',
    label: 'אזרח ותיק המקבל הבטחת הכנסה / גמלת נכות',
    percent: 100,
    maxSqm: 100,
    conditions: 'מקבל גמלת הבטחת הכנסה או גמלת נכה ותיק.',
  },
  {
    id: 'disabled',
    label: 'נכה (אובדן כושר עבודה 75% ומעלה)',
    percent: 80,
    conditions: 'זכאי לקצבה חודשית מלאה עם דרגת אובדן כושר עבודה של 75% ומעלה.',
  },
  {
    id: 'blind',
    label: 'עיוור',
    percent: 90,
    conditions: 'בעל תעודת עיוור.',
  },
  {
    id: 'new-immigrant',
    label: 'עולה חדש',
    percent: 90,
    maxSqm: 100,
    conditions: 'במשך 12 חודשים מתוך 24 מיום הרישום כעולה.',
  },
  {
    id: 'income-support',
    label: 'מקבל הבטחת הכנסה או גמלת סיעוד',
    percent: 70,
    conditions: 'מקבל גמלת הבטחת הכנסה או גמלת סיעוד.',
  },
  {
    id: 'single-parent',
    label: 'הורה יחיד',
    percent: 20,
    conditions: 'לפי התנאים בצו.',
  },
];

const HAIFA_NOTES = [
  'חיפה הרגילה בלבד: קריית חיים נכללת בצו בטבלה נפרדת ולא נכללה כאן.',
  'אזור השומה (א׳–ד׳) נקבע לפי רשימת הרחובות של העירייה, ולא לפי הצו; מופיע בחשבון הארנונה.',
  'בניין הגובל בכמה אזורים מחויב באזור שתעריפו הגבוה.',
  'השטח נמדד מקיר לקיר וכולל מרפסות; שבר מעוגל למטר שלם.',
  'לא כלולות הנחות לפי הכנסה (טבלת הכנסה לפי גודל משק בית), התחדשות עירונית ונזקקות.',
  'בהנחות יחול רק הגבוה מביניהן; בקשה מוגשת עד 31 במרץ או תוך 90 יום.',
];

// ───────────────────── ראשון לציון, פתח תקווה, רמת גן, באר שבע (צו 2026) ─────────────────────
// כל הערכים נקראו מצו הארנונה הרשמי של העירייה (ראו sourceUrl). צווי 2027 של הערים האלה לא נכללו עדיין.

const disc = (
  id: string,
  label: string,
  percent: number,
  conditions: string,
  maxSqm?: number,
): ArnonaDiscountDef => ({ id, label, percent, conditions, ...(maxSqm ? { maxSqm } : {}) });

const flat = (rate: number): ArnonaZoneRate => ({ ratePerSqm: rate });

// ראשון לציון — צו 2026, סעיף 2.1 עמ' 4. סוג בניין לפי סעיף 1.9: אא' = בית/פנטהאוז/דירה דו־מפלסית מעל 110 מ"ר.
const RISHON_CLASSES: ArnonaBuildingClass[] = [
  { id: 'aa', label: 'אא׳ — בית צמוד קרקע / פנטהאוז / דירה דו־מפלסית מעל 110 מ״ר' },
  { id: 'a', label: 'א׳ — דירת מגורים רגילה (בטון/אבן/בלוק)' },
  { id: 'b', label: 'ב׳ — בנייה קשיחה עד 1990 עם שירותים ורחצה משותפים, קרוואן, דיור סטודנטים' },
  { id: 'c', label: 'ג׳ — בנייה מבוץ/עץ לפני 1960, מתחת לקרקע, קרוואן משרד השיכון' },
];
const RISHON_2026: Record<string, readonly [number, number, number, number]> = {
  // אזורים: א׳, ב׳, ג׳, ד׳
  aa: [77.1, 71.65, 77.1, 77.1],
  a: [69.69, 52.58, 69.69, 69.69],
  b: [47.92, 42.5, 47.92, 47.92],
  c: [42.5, 42.5, 42.5, 42.5],
};
const rishonZones = (): ArnonaZone[] =>
  ['א׳', 'ב׳', 'ג׳', 'ד׳'].map((name, i) => ({
    id: `z${i + 1}`,
    label: `אזור ${name}`,
    description:
      i === 0
        ? 'אזור א׳: כל העיר פרט לאזורים ב׳, ג׳ ו־ד׳.'
        : i === 1
          ? 'אזור ב׳: שיכון המזרח, שיכון גורדון, רמת אליהו, שיכון סלע החדש, קריית קלוב ושכונות נוספות לפי הצו.'
          : 'אזור מוגדר בצו לפי מספרי תכניות וגושים/חלקות.',
    rateByClass: Object.fromEntries(Object.entries(RISHON_2026).map(([k, r]) => [k, flat(r[i])])),
  }));

// פתח תקווה — צו 2026, סעיף 2.1 עמ' 7. סוג בניין נקבע לפי סוג וגודל הדירה (סעיף 3.1.9 בצו).
const PT_CLASSES: ArnonaBuildingClass[] = [
  { id: 'aa', label: 'אא — בית מעל 130 מ״ר או דירה בבניין משותף מעל 140 מ״ר' },
  { id: 'a', label: 'א — בית 60–129 מ״ר או דירה בבניין משותף 75–139 מ״ר' },
  { id: 'b', label: 'ב — דירה בבניין משותף 50–74 מ״ר או בית 45–59 מ״ר' },
  { id: 'c', label: 'ג — דירה מתחת ל־50 מ״ר, בית מתחת ל־45 מ״ר, קרוואן/מכולה' },
  { id: 'd', label: 'ד — דירה בלי מטבחון/שירותים/רחצה או מחומרים פשוטים' },
];
const PT_2026: Record<string, readonly [number, number, number]> = {
  // אזורים: א, ב, ג
  aa: [84.96, 74.58, 48.54],
  a: [79.26, 69.65, 44.71],
  b: [62.89, 57.0, 43.39],
  c: [56.27, 50.41, 43.39],
  d: [43.39, 43.39, 43.39],
};
const ptZones = (): ArnonaZone[] =>
  ['א', 'ב', 'ג'].map((name, i) => ({
    id: `z${i + 1}`,
    label: `אזור ${name}`,
    rateByClass: Object.fromEntries(Object.entries(PT_2026).map(([k, r]) => [k, flat(r[i])])),
  }));

// רמת גן — צו 2026, "א. בניני מגורים", עמ' 10 מודפס. אזור א'+ חל רק על נכסים שנישומו מ-1.1.2026 בגושים שבצו.
const RG_CLASSES: ArnonaBuildingClass[] = [
  { id: 'aplus', label: 'א+ — בית חד/דו־משפחתי, פנטהאוז או דירה מעל 130 מ״ר' },
  { id: 'a', label: 'א — דירה בבניין משותף / בית עד 130 מ״ר (לפי הצו)' },
  { id: 'b', label: 'ב — דירה בבניין משותף במצב טוב' },
  { id: 'c', label: 'ג — דירה במצב ירוד' },
  { id: 'd', label: 'ד — צריף' },
];
// עמודות: [א'+, א', ב', ג', ד'] ; null = אין תעריף
const RG_2026: Record<string, readonly (number | null)[]> = {
  aplus: [135.53, 111.15, 93.79, 82.17, 71.09],
  a: [112.99, 92.66, 83.35, 69.66, 60.25],
  b: [null, 77.64, 64.56, 50.91, 46.6],
  c: [null, 57.29, 46.54, 44.59, 44.59],
  d: [null, 44.59, 44.59, 44.59, 44.59],
};
const RG_ZONES: [string, string | undefined][] = [
  ['אזור א׳+', 'חל רק על נכסים שנישומו מ־1.1.2026 בגושים ובחלקות המפורטים בצו.'],
  ['אזור א׳', undefined],
  ['אזור ב׳', undefined],
  ['אזור ג׳', undefined],
  ['אזור ד׳', undefined],
];
const rgZones = (): ArnonaZone[] =>
  RG_ZONES.map(([label, description], i) => {
    const rateByClass: Record<string, ArnonaZoneRate> = {};
    for (const [k, row] of Object.entries(RG_2026)) {
      const v = row[i];
      if (v !== null) rateByClass[k] = flat(v);
    }
    return { id: `z${i}`, label, description, rateByClass };
  });

// באר שבע — צו 2026, סעיף 2 עמ' 2 (נקרא מהטקסט). דירה עד 57 מ"ר באזורים א׳ ו־ב׳: תעריף נמוך לכל הדירה.
const BS_ZONES: ArnonaZone[] = [
  {
    id: 'a',
    label: 'אזור א׳',
    description: 'ראו הגדרת האזורים בנספח א׳ בצו ובמפה שבו.',
    rate: {
      bands: [
        { upToSqm: 57, ratePerSqm: 51.94 },
        { upToSqm: Infinity, ratePerSqm: 58.28 },
      ],
    },
  },
  {
    id: 'b',
    label: 'אזור ב׳',
    description: 'נחל בקע וכל השכונות שאינן באזורים א׳, ג׳ ו־ד׳.',
    rate: {
      bands: [
        { upToSqm: 57, ratePerSqm: 47.78 },
        { upToSqm: Infinity, ratePerSqm: 50.45 },
      ],
    },
  },
  { id: 'c', label: 'אזור ג׳', rate: flat(48.64) },
];

const COMMON_NOTES = ['ההנחות המוצגות הן הנחות שנקראו בבירור בצו או בדף ההנחות של העירייה; הנחות לפי הכנסה ומקרים מיוחדים נבדקים מול העירייה.'];

export const ARNONA_MORE_CITIES: ArnonaCity[] = [
  {
    id: 'rishon-2026',
    name: 'ראשון לציון',
    year: 2026,
    status: 'in-force',
    classes: RISHON_CLASSES,
    classHelp: 'סוג הבניין והאזור מופיעים בחשבון הארנונה.',
    zones: rishonZones(),
    discounts: [
      disc('senior-30', 'אזרח ותיק (לפי חוק האזרחים הוותיקים)', 30, 'בכפוף לתנאי הכנסה לפי הצו.', 100),
      disc('senior-25', 'אזרח ותיק המקבל קצבת זקנה/שאירים', 25, 'מקבל קצבת זקנה, שאירים, תלויים או נפגעי עבודה.', 100),
      disc('senior-income-support', 'אזרח ותיק המקבל הבטחת הכנסה', 100, 'מקבל גמלת הבטחת הכנסה.', 100),
      disc('disabled-80', 'נכה (75% ומעלה)', 80, 'אי־כושר עבודה של 75% ומעלה.'),
      disc('blind', 'עיוור', 90, 'בעל תעודת עיוור.'),
      disc('new-immigrant', 'עולה חדש', 90, '12 חודשים מתוך 24 הראשונים.', 100),
      disc('single-parent', 'הורה יחיד', 20, 'לפי התנאים בצו.'),
      disc('income-support', 'מקבל הבטחת הכנסה / סיעוד', 70, 'מקבל הבטחת הכנסה, מזונות או גמלת סיעוד.'),
    ],
    sourceUrl: 'https://www.rishonlezion.muni.il/Residents/arnona/ArnonaOrders/צו_ארנונה_2026.pdf',
    sourceLabel: 'צו ארנונה 2026 של ראשון לציון, סעיף 2.1 עמ׳ 4',
    verifiedAt: '2026-11-20',
    notes: [
      ...COMMON_NOTES,
      'אזורים ג׳ ו־ד׳ מוגדרים בצו לפי מספרי תכניות, גושים וחלקות; האזור מופיע בחשבון הארנונה.',
      'הנחות בשטח: מחסן 50%, בריכה פתוחה 67%, מרתף 50% — בכפוף לתעריף המינימלי למגורים (לא מחושב כאן).',
    ],
  },
  {
    id: 'petah-tikva-2026',
    name: 'פתח תקווה',
    year: 2026,
    status: 'in-force',
    classes: PT_CLASSES,
    classHelp: 'סוג הבניין נקבע לפי סוג הדירה וגודלה; מופיע בחשבון הארנונה.',
    zones: ptZones(),
    discounts: [
      disc('senior-25', 'אזרח ותיק המקבל קצבת זקנה/שאירים', 25, 'מקבל קצבת זקנה, שאירים או תלויים.', 100),
      disc('senior-30', 'אזרח ותיק (הכנסה עד השכר הממוצע)', 30, 'סך ההכנסה אינו עולה על השכר הממוצע.', 100),
      disc('senior-income-support', 'אזרח ותיק המקבל השלמת הכנסה', 100, 'מקבל השלמת הכנסה.', 100),
      disc('disabled-75', 'נכה (אי־כושר עבודה 75% ומעלה)', 50, 'ההנחה היא 50%; 80% אם הנכות היא מקור ההכנסה היחיד.'),
      disc('disabled-sole', 'נכה — הנכות היא מקור ההכנסה היחיד', 80, 'אי־כושר עבודה 75% ומעלה כמקור הכנסה יחיד.'),
      disc('medical-90', 'נכות רפואית 90% ומעלה', 40, 'נכות רפואית מוכחת של 90% ומעלה.'),
      disc('blind', 'עיוור', 90, 'בעל תעודת עיוור.'),
      disc('new-immigrant', 'עולה חדש', 90, 'דירה עד 100 מ״ר; 12 חודשים מתוך 24 הראשונים.', 100),
      disc('single-parent', 'הורה יחיד', 20, 'לפי התנאים בצו.'),
    ],
    sourceUrl: 'https://api.petah-tikva.muni.il//media/vovfqold/צו-מיסים-2026-חוקי-קיים-סופי-pdfua.pdf',
    sourceLabel: 'צו מיסים 2026 של פתח תקווה, סעיף 2.1 עמ׳ 7',
    verifiedAt: '2026-11-20',
    notes: [
      ...COMMON_NOTES,
      'אזור המס לכל רחוב מופיע ברשימת הרחובות של העירייה; בניין הגובל בכמה אזורים מסווג באזור שתעריפו הגבוה.',
    ],
  },
  {
    id: 'ramat-gan-2026',
    name: 'רמת גן',
    year: 2026,
    status: 'in-force',
    classes: RG_CLASSES,
    classHelp: 'סוג הנכס והאזור מופיעים בחשבון הארנונה; אזור א׳+ חל על נכסים חדשים בגושים מסוימים.',
    zones: rgZones(),
    discounts: [
      disc('senior-25', 'אזרח ותיק המקבל קצבת זקנה/שאירים', 25, 'עד 25% על 100 מ״ר ראשונים.', 100),
      disc('senior-30', 'אזרח ותיק (לפי הכנסה)', 30, 'בכפוף לתנאי הכנסה לפי הצו.', 100),
      disc('senior-income-support', 'אזרח ותיק המקבל הבטחת הכנסה', 100, 'עד 100% על 100 מ״ר ראשונים.', 100),
      disc('disabled-80', 'נכה (75% ומעלה)', 80, 'אי־כושר עבודה של 75% ומעלה.'),
      disc('medical-90', 'נכות רפואית 90% ומעלה', 40, 'נכות רפואית מוכחת של 90% ומעלה.'),
      disc('blind', 'עיוור', 90, 'בעל תעודת עיוור.'),
      disc('new-immigrant', 'עולה חדש', 90, 'שנה אחת מתוך 24 חודשים.', 100),
      disc('single-parent', 'הורה יחיד', 20, 'לפי התנאים בצו.'),
      disc('nursing', 'מקבל גמלת סיעוד', 70, 'מקבל גמלת סיעוד.'),
      disc('disabled-child', 'הורה לילד נכה', 33, 'לפי התנאים בצו.', 100),
    ],
    sourceUrl: 'https://cms-media.ramat-gan.muni.il/media/lchlofwg/tzav-arnona-2026.pdf',
    sourceLabel: 'צו ארנונה 2026 של רמת גן, בניני מגורים, עמ׳ 10 מודפס',
    verifiedAt: '2026-11-20',
    notes: [
      ...COMMON_NOTES,
      'גבולות האזורים מוגדרים בצו לפי גושים וחלקות ובמפה; האזור מופיע בחשבון הארנונה.',
      'הנחה של 2% (עד 200 ₪ בשנה) בהוראת קבע לא מחושבת כאן.',
    ],
  },
  {
    id: 'beer-sheva-2026',
    name: 'באר שבע',
    year: 2026,
    status: 'in-force',
    zones: BS_ZONES,
    discounts: [
      disc('senior-25', 'אזרח ותיק המקבל קצבת זקנה/שאירים', 25, 'מקבל קצבת זקנה, שאירים, תלויים או נפגעי עבודה.', 100),
      disc('senior-30', 'אזרח ותיק (לפי הכנסה)', 30, 'בכפוף לתנאי הכנסה.', 100),
      disc('senior-supplement', 'אזרח ותיק המקבל השלמת הכנסה / גמלת נכות', 100, 'מקבל השלמת הכנסה או תוספת נכות.', 100),
      disc('disabled-80', 'נכה (75% ומעלה)', 80, 'אי־כושר עבודה של 75% ומעלה.'),
      disc('blind', 'עיוור', 90, 'בעל תעודת עיוור.'),
      disc('new-immigrant', 'עולה חדש', 90, '12 חודשים מתוך 24 הראשונים.', 100),
      disc('single-parent', 'הורה יחיד', 20, 'לפי התנאים בצו.'),
      disc('nursing', 'מקבל גמלת סיעוד', 70, 'מקבל גמלת סיעוד.'),
    ],
    sourceUrl: 'https://www.beer-sheva.muni.il/Residents/Arnona/Documents/צווי-ארנונה/צו%20ארנונה%20לשנת%202026.pdf',
    sourceLabel: 'צו ארנונה 2026 של באר שבע, סעיף 2 עמ׳ 2',
    verifiedAt: '2026-11-20',
    notes: [
      ...COMMON_NOTES,
      'אזור המס מוגדר בנספח א׳ בצו ובמפה; לא ניתן לקבל הנחה אם יש לבעל הנכס דירה נוספת בארץ.',
      'ההנחות נלקחו מדף ההנחות של העירייה ולא מהצו עצמו.',
    ],
  },
];

export const ARNONA_CITIES: ArnonaCity[] = [
  {
    id: 'tel-aviv-2026',
    name: 'תל אביב-יפו',
    year: 2026,
    status: 'in-force',
    classes: TEL_AVIV_CLASSES,
    classHelp: 'סוג הבניין מופיע בחשבון הארנונה; אם אינכם בטוחים, ראו סעיף 2.1 בצו.',
    zones: telAvivZones(TEL_AVIV_2026),
    discounts: TEL_AVIV_DISCOUNTS,
    sourceUrl:
      'https://www.tel-aviv.gov.il/Residents/Arnona/Documents/חוברת צו הארנונה לשנת 2026.pdf',
    sourceLabel: 'חוברת צו הארנונה לשנת 2026, סעיף 2.3 עמ׳ 8',
    verifiedAt: '2026-11-20',
    notes: TEL_AVIV_NOTES,
  },
  {
    id: 'tel-aviv-2027',
    name: 'תל אביב-יפו',
    year: 2027,
    status: 'pending-approval',
    classes: TEL_AVIV_CLASSES,
    classHelp: 'סוג הבניין מופיע בחשבון הארנונה; אם אינכם בטוחים, ראו סעיף 2.1 בצו.',
    zones: telAvivZones(TEL_AVIV_2027),
    discounts: TEL_AVIV_DISCOUNTS,
    sourceUrl:
      'https://www.tel-aviv.gov.il/Residents/Arnona/Documents/חוברת צו הארנונה לשנת 2027.pdf',
    sourceLabel: 'חוברת צו הארנונה לשנת 2027, סעיף 2.3 עמ׳ 8 (אושרה במועצה ב-22.6.2026)',
    verifiedAt: '2026-11-20',
    notes: [
      ...TEL_AVIV_NOTES,
      'צו 2027 אושר במועצת העירייה וכפוף לאישור השרים. תעריפי 2027 הם תעריפי 2026 בתוספת עדכון של 3.05%. כמה שכונות סווגו מחדש לאזור גבוה יותר בצו 2027.',
    ],
  },
  {
    id: 'haifa-2026',
    name: 'חיפה',
    year: 2026,
    status: 'in-force',
    classes: HAIFA_CLASSES,
    classHelp: 'סוג הבניין והאזור מופיעים בחשבון הארנונה; מעט מאוד בניינים הם מ1.',
    zones: haifaZones(HAIFA_2026),
    discounts: HAIFA_DISCOUNTS_2026,
    sourceUrl: 'https://www.haifa.muni.il/resident-service/arnona/taxes/',
    sourceLabel: 'צו המסים (ארנונה) 2026 של עיריית חיפה, טבלת מגורים, עמ׳ 7',
    verifiedAt: '2026-11-20',
    notes: HAIFA_NOTES,
  },
  {
    id: 'haifa-2027',
    name: 'חיפה',
    year: 2027,
    status: 'pending-approval',
    classes: HAIFA_CLASSES,
    classHelp: 'סוג הבניין והאזור מופיעים בחשבון הארנונה; מעט מאוד בניינים הם מ1.',
    zones: haifaZones(HAIFA_2027),
    sourceUrl: 'https://www.haifa.muni.il/resident-service/arnona/taxes/',
    sourceLabel: 'צו המסים 2027 של עיריית חיפה (אושר במועצה ב-30.6.2026), טבלת מגורים',
    verifiedAt: '2026-11-20',
    notes: [
      ...HAIFA_NOTES,
      'צו 2027 אושר במועצה וכפוף לאישור השרים. ההנחות לשנת 2027 לא נבדקו ולכן אינן מוצגות.',
    ],
  },
  ...ARNONA_MORE_CITIES,
];
