/**
 * תעריפי ארנונה לעסקים (נכס שאינו למגורים) לפי עיר — נתונים ידניים ממקור רשמי בלבד.
 *
 * כללים זהים ל-`arnona-rates.ts`: כל תעריף נלקח מצו הארנונה הרשמי של העירייה (ראו sourceUrl),
 * עם שנה ותאריך אימות. אסור להעתיק מאתרי מחשבונים ואסור למשוך אוטומטית.
 * המנוע (`lib/calculators/arnona.ts`) משותף למגורים ולעסקים ואינו מכיל מספרים.
 *
 * מבנה: עיר → שימושים (סוג עסק לפי הצו) → תעריף לפי אזור (ובחיפה גם לפי סימול בניין).
 * לשימוש יכולה להיות רשימת אזורים משלה (`zones`) כשהצו מגדיר אזורי תעשייה נפרדים.
 */

import type { ArnonaZoneRate } from '@/lib/calculators/arnona';

export interface BusinessZone {
  id: string;
  label: string;
  description?: string;
}

export interface BusinessClass {
  id: string;
  label: string;
}

export interface BusinessUse {
  id: string;
  label: string;
  description?: string;
  /** אזורים ייחודיים לשימוש (לדוגמה אזורי תעשייה); אחרת — אזורי העיר */
  zones?: BusinessZone[];
  /** תעריף לפי מזהה אזור; המפתח '*' = כל האזורים */
  rates?: Record<string, ArnonaZoneRate>;
  /** סימולי בניין ייחודיים לשימוש; אחרת — של העיר */
  classes?: BusinessClass[];
  /** תעריף לפי אזור ואז לפי סימול בניין (חיפה, פתח תקווה) */
  ratesByClass?: Record<string, Record<string, ArnonaZoneRate>>;
}

export interface BusinessCity {
  id: string;
  name: string;
  year: number;
  zones: BusinessZone[];
  /** מימד סימול בניין, כשהתעריף תלוי בו */
  classes?: BusinessClass[];
  /** איך יודעים את האזור/סימול */
  zoneHelp: string;
  uses: BusinessUse[];
  sourceUrl: string;
  sourceLabel: string;
  verifiedAt: string;
  notes: string[];
}

const flat = (rate: number): ArnonaZoneRate => ({ ratePerSqm: rate });
const bands = (...pairs: [number, number][]): ArnonaZoneRate => ({
  bands: pairs.map(([upToSqm, ratePerSqm]) => ({ upToSqm, ratePerSqm })),
});
const tiers = (...pairs: [number, number][]): ArnonaZoneRate => ({
  tiers: pairs.map(([upToSqm, ratePerSqm]) => ({ upToSqm, ratePerSqm })),
});
const INF = Infinity;

// ───────────────────────── תל אביב-יפו (צו 2026, פרק 3, עמ' 12–18) ─────────────────────────
const TLV_ZONES: BusinessZone[] = [
  { id: 'z1', label: 'אזור 1' },
  { id: 'z2', label: 'אזור 2' },
  { id: 'z3', label: 'אזור 3' },
];
const TLV_UNIFORM = { z1: 449.78, z2: 375.07, z3: 307.74 };

const TEL_AVIV_BUSINESS: BusinessCity = {
  id: 'tel-aviv-business-2026',
  name: 'תל אביב-יפו',
  year: 2026,
  zones: TLV_ZONES,
  zoneHelp:
    'אזור המס של נכס עסקי נקבע לפי כתובת הכניסה הראשית ולפי מפת האזורים בצו (עמ׳ 10); יש 3 אזורים, שונים מאזורי המגורים.',
  uses: [
    {
      id: 'office-retail',
      label: 'משרדים, שירותים וחנויות (תעריף אחיד)',
      description: 'חל על כל שימוש שאין לו תעריף מיוחד בצו; ללא מדרגות שטח.',
      rates: { z1: flat(TLV_UNIFORM.z1), z2: flat(TLV_UNIFORM.z2), z3: flat(TLV_UNIFORM.z3) },
    },
    {
      id: 'cafe',
      label: 'בית קפה / מסעדה',
      description: 'באזור 3 תעריף מופחת; באזורים 1 ו־2 חל התעריף האחיד.',
      rates: { z1: flat(TLV_UNIFORM.z1), z2: flat(TLV_UNIFORM.z2), z3: flat(291.96) },
    },
    {
      id: 'industry',
      label: 'תעשייה ומלאכה',
      description: 'עד 200 מ״ר, מעל 200 עד 500, ומעל 500 — מדרגות שוליות; אותו תעריף בכל האזורים.',
      rates: { '*': tiers([200, 196.49], [500, 107.65], [INF, 103.71]) },
    },
    {
      id: 'warehouse',
      label: 'מחסן (אחסנה בלבד)',
      description:
        '100 מ״ר ראשונים בתעריף האחיד של האזור, אחר כך 119.66 עד 500 מ״ר ו־85.49 מעל. התעריף המופחת חל רק על מחסן אחסנה בלבד, בלי לקוחות ובלי שיווק והפצה (תנאים בצו §3.3.2).',
      rates: {
        z1: tiers([100, TLV_UNIFORM.z1], [500, 119.66], [INF, 85.49]),
        z2: tiers([100, TLV_UNIFORM.z2], [500, 119.66], [INF, 85.49]),
        z3: tiers([100, TLV_UNIFORM.z3], [500, 119.66], [INF, 85.49]),
      },
    },
    { id: 'bank', label: 'סניף בנק', rates: { '*': flat(1642.06) } },
    { id: 'insurer', label: 'חברת ביטוח', rates: { '*': flat(683.94) } },
  ],
  sourceUrl: 'https://www.tel-aviv.gov.il/Residents/Arnona/Documents/חוברת צו הארנונה לשנת 2026.pdf',
  sourceLabel: 'צו הארנונה של תל אביב-יפו 2026, פרק 3: סעיפים 3.2 ו־3.3 (עמ׳ 12–18)',
  verifiedAt: '2026-11-20',
  notes: [
    'שטחים משותפים בבניין שאינו למגורים אינם מחויבים, אלא אם 80% ומעלה מהשטח מוחזקים בידי מחזיק אחד (סעיף 1.3.1(ז)).',
    'גלריה (מזנין) נספרת בבניין שאינו למגורים רק אם גובהה מעל 1.70 מ׳ ויש גישה קבועה אליה.',
    'השטח מעוגל למטר שלם. מחזיק שנכנס אחרי 1 בינואר מחויב יחסית לימים.',
    'בניין ריק שנבנה חדש: הנחה של 100% עד 12 חודשים; בניין ריק 30 יום ומעלה: 100% עד 6 חודשים מצטבר (סעיף 6(17)).',
    'מלונות, קולנוע, בתי חולים ושימושים מיוחדים אחרים לא נכללו כאן; ראו פרק 3.3 בצו.',
  ],
};

// ───────────────────────── חיפה (צו 2026, "בניינים אחרים", עמ' 9–28) ─────────────────────────
const HAIFA_ZONES: BusinessZone[] = [
  { id: 'a', label: 'אזור א׳' },
  { id: 'b', label: 'אזור ב׳' },
  { id: 'c', label: 'אזור ג׳' },
];
const HAIFA_CLASSES: BusinessClass[] = [
  { id: 'ayin1', label: 'ע1 — קומת קרקע בבניין בטון/לבנים/בלוקים, וכל קומות קניון' },
  { id: 'ayin2', label: 'ע2 — קומה שאינה קרקע, או עסק בקומת קרקע בלי כניסה מחזית הרחוב' },
  { id: 'ayin3', label: 'ע3 — מרתף, צריף, סככה, גגון או מרפסת לא מקורה' },
];
/** [אזור א', ב', ג'] */
type Tri = readonly [number, number, number];
type HaifaBandedClass = { first: Tri; extra: Tri };
const haifaRates = (
  byClass: Record<'ayin1' | 'ayin2' | 'ayin3', HaifaBandedClass>,
): Record<string, Record<string, ArnonaZoneRate>> => {
  const out: Record<string, Record<string, ArnonaZoneRate>> = {};
  HAIFA_ZONES.forEach((z, i) => {
    out[z.id] = {};
    for (const [cls, v] of Object.entries(byClass)) {
      out[z.id][cls] = tiers([40, v.first[i]], [INF, v.extra[i]]);
    }
  });
  return out;
};

const HAIFA_BUSINESS: BusinessCity = {
  id: 'haifa-business-2026',
  name: 'חיפה',
  year: 2026,
  zones: HAIFA_ZONES,
  classes: HAIFA_CLASSES,
  zoneHelp:
    'אזור (א׳–ג׳) נקבע לפי רשימת הרחובות של העירייה, שאינה בקובץ הצו; סימול הבניין (ע1–ע3) נקבע לפי הקומה וסוג הבניין. שניהם מופיעים בחשבון הארנונה.',
  uses: [
    {
      id: 'office-retail',
      label: 'משרדים וחנויות (עסקים אחרים, סעיף 22)',
      description:
        '40 מ״ר ראשונים בתעריף אחד והשטח העודף בתעריף נמוך יותר. ברחובות המפורטים בנספחי הצו (א׳, ז׳ ועוד) חלים תעריפים שונים — בדקו בצו.',
      ratesByClass: haifaRates({
        ayin1: { first: [383.1, 304.72, 233.34], extra: [267.3, 240.44, 163.7] },
        ayin2: { first: [283.84, 229.85, 170.68], extra: [202.31, 167.31, 121.88] },
        ayin3: { first: [189.81, 151.5, 104.5], extra: [134.89, 115.27, 82.93] },
      }),
    },
    {
      id: 'industry',
      label: 'תעשייה',
      description: '40 מ״ר ראשונים בתעריף אחד והעודף בתעריף נמוך יותר (סעיף 1.א).',
      ratesByClass: haifaRates({
        ayin1: { first: [193.74, 174.16, 128.86], extra: [159.99, 146.25, 101.01] },
        ayin2: { first: [191.54, 167.15, 114.92], extra: [120.14, 113.16, 82.48] },
        ayin3: { first: [149.73, 127.14, 88.81], extra: [76.64, 67.91, 55.75] },
      }),
    },
    {
      id: 'workshop',
      label: 'מלאכה (בתי מלאכה)',
      description: 'מלאכה בבניינים שאינם ברשימת נספח א׳ (סעיף 1.ב).',
      ratesByClass: haifaRates({
        ayin1: { first: [248.43, 235.08, 182.52], extra: [188.33, 160.22, 104.51] },
        ayin2: { first: [204.34, 186.3, 140.25], extra: [143.43, 113.16, 76.64] },
        ayin3: { first: [160.64, 123.78, 93.09], extra: [83.92, 76.64, 55.99] },
      }),
    },
    { id: 'bank', label: 'בנק וחברת כרטיסי אשראי', rates: { '*': flat(1534.49) } },
    { id: 'insurer', label: 'חברת ביטוח', rates: { '*': flat(1009.25) } },
  ],
  sourceUrl: 'https://www.haifa.muni.il/resident-service/arnona/taxes/',
  sourceLabel: 'צו המסים (ארנונה) 2026 של עיריית חיפה, בניינים שאינם למגורים, עמ׳ 9–28',
  verifiedAt: '2026-11-20',
  notes: [
    'מחסן רגיל אינו מוגדר בנפרד בצו חיפה ומחויב כ"עסקים אחרים"; למחסני לוגיסטיקה באזור מסומן בנספח ב׳ יש תעריף נפרד שלא נכלל כאן.',
    'שטחים משותפים בבניין שאינו למגורים מתחלקים בין המחזיקים ונוספים לשטח כל אחד (שונה מתל אביב).',
    'בניין הגובל בכמה אזורים מחויב באזור שתעריפו הגבוה.',
    'גלריה: חיוב של כרבע מהשטח עד 2 מ׳ גובה, חצי עד 2.75 מ׳ ומלא מעל זה.',
    'בניין ריק: 100% עד 6 חודשים מצטבר; תשלום מראש של כל השנה: 2% עד 31 בדצמבר, 1% עד 31 בינואר.',
  ],
};

// ───────────────────────── רמת גן (צו 2026, "שיעורי הארנונה", עמ' 10–12) ─────────────────────────
const RG_ZONES: BusinessZone[] = [
  { id: 'a', label: 'אזור א׳' },
  { id: 'b', label: 'אזור ב׳' },
  { id: 'c', label: 'אזור ג׳' },
  { id: 'd', label: 'אזור ד׳' },
];

const RAMAT_GAN_BUSINESS: BusinessCity = {
  id: 'ramat-gan-business-2026',
  name: 'רמת גן',
  year: 2026,
  zones: RG_ZONES,
  zoneHelp:
    'אזורי העסקים (א׳–ד׳) מוגדרים במפה ובטבלת גושים וחלקות בצו (עמ׳ 7 ו־9). האזור מופיע בחשבון הארנונה.',
  uses: [
    {
      id: 'office-retail',
      label: 'משרדים, חנויות, מרפאות, מסעדות ובתי קפה',
      description:
        'הצו מחלק לעסק עד 300 מ״ר ולעסק מעל 300 מ״ר ואינו מבהיר אם התעריף חל על כל השטח; המחשבון מחיל את התעריף על כל השטח.',
      rates: {
        a: bands([300, 455.93], [INF, 455.93]),
        b: bands([300, 406.27], [INF, 413.73]),
        c: bands([300, 277.43], [INF, 266.21]),
        d: bands([300, 146.55], [INF, 144.46]),
      },
    },
    {
      id: 'industry',
      label: 'תעשייה',
      description:
        'לפי טווח השטח הכולל: עד 100, 101–500, 501–1,000 ומעל 1,000 מ״ר. הצו אינו מבהיר אם התעריף חל על כל השטח; המחשבון מחיל אותו על כל השטח.',
      rates: { '*': bands([100, 187.07], [500, 164.01], [1000, 143.54], [INF, 179.94]) },
    },
    {
      id: 'craft',
      label: 'מלאכה (מסגריות, נגריות, מוסכים וכד׳)',
      rates: { '*': flat(258.69) },
    },
    { id: 'warehouse', label: 'מחסן עסק', rates: { '*': flat(193.98) } },
    { id: 'industry-warehouse', label: 'מחסן תעשייה הצמוד לבניין תעשייה', rates: { '*': flat(169.36) } },
    { id: 'bank', label: 'סניף בנק מסחרי', rates: { '*': flat(1631.91) } },
    { id: 'bank-hq', label: 'הנהלת בנק או חברת ביטוח', rates: { '*': flat(565.22) } },
  ],
  sourceUrl: 'https://cms-media.ramat-gan.muni.il/media/lchlofwg/tzav-arnona-2026.pdf',
  sourceLabel: 'צו ארנונה 2026 של רמת גן, שיעורי הארנונה (עמ׳ 10–12 מודפס)',
  verifiedAt: '2026-11-20',
  notes: [
    'מחיר התעשייה והמלאכה כאן אחיד לכל העיר; בצו יש הבחנה בין אזור התעשייה לשאר העיר רק בהגדרות.',
    'גושים מסוימים (6109, 6207, 6128, 7277, 7278, 6233, 6235, 6236) מחויבים בתעריף חריג שמופיע בהערה בצו.',
    'שטחים משותפים לשני מחזיקים ומעלה אינם נספרים; גלריה נספרת בבניין שאינו למגורים אם גובהה מעל 1.70 מ׳ ויש גישה קבועה.',
    'השטח מעוגל למטר שלם.',
    'בניין ריק חדש: 100% עד 12 חודשים; בניין ריק: 100% עד 6 חודשים. הוראת קבע: 2% עד 200 ₪ בשנה.',
  ],
};

// ───────────────────────── באר שבע (צו 2026, פרקים 2–11) ─────────────────────────
const BS_RETAIL_ZONES: BusinessZone[] = [
  { id: 'a', label: 'אזור א׳' },
  { id: 'a1', label: 'אזור א׳1 (קניונים בדרך חברון)' },
  { id: 'b', label: 'אזור ב׳' },
  { id: 'c1', label: 'אזור ג׳1 (שכונות מגורים)' },
  { id: 'c', label: 'אזור ג׳ (קריית יהודית)' },
];
const BS_INDUSTRY_ZONES: BusinessZone[] = [
  { id: 'ia', label: 'אזור תעשייה א׳ (העיר הישנה והשכונות)' },
  { id: 'ib', label: 'אזור תעשייה ב׳ (תעשייה, מלאכה ועמק שרה)' },
  { id: 'ic', label: 'אזור תעשייה ג׳ (קריית יהודית)' },
  { id: 'id', label: 'אזור תעשייה ד׳ (פארק ההייטק)' },
];

const BEER_SHEVA_BUSINESS: BusinessCity = {
  id: 'beer-sheva-business-2026',
  name: 'באר שבע',
  year: 2026,
  zones: BS_RETAIL_ZONES,
  zoneHelp: 'האזורים מוגדרים בנספח א׳ בצו ובמפה; האזור מופיע בחשבון הארנונה.',
  uses: [
    {
      id: 'retail',
      label: 'חנויות ומסחר (ללא עסק טעון רישוי)',
      description:
        '100 מ״ר ראשונים בתעריף אחד וכל מ״ר מעל — בתעריף אחר (סעיף 23א). כולל משרד בקומת קרקע עד 8 עובדים.',
      rates: {
        a: tiers([100, 415.71], [INF, 364.09]),
        a1: tiers([100, 381.31], [INF, 312.04]),
        b: tiers([100, 325.08], [INF, 312.04]),
        c1: tiers([100, 296.78], [INF, 275.24]),
        c: tiers([100, 318.61], [INF, 318.61]),
      },
    },
    {
      id: 'office',
      label: 'משרדים, בניין שירותים ועסק טעון רישוי (סעיף 23ב)',
      description: 'תעריף אחד, ללא מדרגות. באזור א׳1 אין תעריף בעמודה זו בצו.',
      rates: {
        a: flat(455.93),
        b: flat(361.3),
        c1: flat(326.65),
        c: flat(313.68),
      },
    },
    {
      id: 'industry',
      label: 'מפעל, מלאכה ומוסך',
      description: 'מדרגות שוליות לפי אזור התעשייה (סעיף 3 בצו).',
      zones: BS_INDUSTRY_ZONES,
      rates: {
        ia: tiers([250, 193.06], [500, 99.98], [INF, 59.0]),
        ib: tiers([500, 115.5], [INF, 60.36]),
        ic: tiers([500, 115.5], [INF, 60.36]),
        id: tiers([500, 65.7], [INF, 60.36]),
      },
    },
    { id: 'bank', label: 'סניף בנק', rates: { '*': flat(1642.08) } },
    { id: 'insurer', label: 'חברת ביטוח', rates: { '*': flat(666.13) } },
  ],
  sourceUrl: 'https://www.beer-sheva.muni.il/Residents/Arnona/Documents/צווי-ארנונה/צו%20ארנונה%20לשנת%202026.pdf',
  sourceLabel: 'צו ארנונה 2026 של באר שבע, פרק א׳ סעיפים 3, 9, 11 ו־23 (עמ׳ 2–6)',
  verifiedAt: '2026-11-20',
  notes: [
    'מחסן הצמוד לעסק מחויב ב־75% מתעריף הבניין שהוא משרת; גלריה לאחסון בלבד ב־50% (סעיף 24). לא מחושב כאן.',
    'השטח נמדד לפי המידות החיצוניות של המבנה וכולל מרפסות ומעברים.',
    'מפעל חדש או שהועבר מרשות אחרת זכאי להנחה לפי שיעור האבטלה (סעיף 7 בפרק ג׳).',
    'בניין ריק: 100% עד 3 חודשים; תשלום בהוראת קבע בחיוב שנתי עד 100,000 ₪: הנחה 1%.',
  ],
};

// ───────────────────────── ראשון לציון (צו 2026, פרק ב׳, עמ' 16–21) ─────────────────────────
const RISHON_ZONES: BusinessZone[] = [
  { id: 'a', label: 'אזור א׳ (כל העיר פרט לאזורים ב׳, ג׳, ד׳)' },
  { id: 'b', label: 'אזור ב׳' },
  { id: 'c', label: 'אזור ג׳' },
  { id: 'd', label: 'אזור ד׳' },
];
const RISHON_LANDUSE_ZONES: BusinessZone[] = [
  { id: 'resco', label: 'אזור תעשייה המוגדר בתכנית כאזור מגורים או מסחר' },
  { id: 'other', label: 'אזור תעשייה בייעוד אחר לפי התכנית' },
];

const RISHON_BUSINESS: BusinessCity = {
  id: 'rishon-business-2026',
  name: 'ראשון לציון',
  year: 2026,
  zones: RISHON_ZONES,
  zoneHelp:
    'אזורי העסקים (א׳–ד׳, סעיף 1.17 בצו) שונים מאזורי המגורים: אזור ב׳ מוגדר בגושים וחלקות, אזורים ג׳ ו־ד׳ בתכניות. האזור מופיע בחשבון הארנונה.',
  uses: [
    {
      id: 'office-retail',
      label: 'משרדים, חנויות, שירותים ועסקים אחרים',
      description:
        'עד 150 מ״ר ומעל 150 מ״ר. הצו אינו מבהיר אם התעריף חל על כל השטח; המחשבון מחיל אותו על כל השטח. משרדים באזור ג׳ (בתעריף מדורג נפרד בצו) לא נכללו.',
      rates: {
        a: bands([150, 320.27], [INF, 342.81]),
        b: bands([150, 198.57], [INF, 207.42]),
        c: bands([150, 320.27], [INF, 342.81]),
        d: bands([150, 320.27], [INF, 342.81]),
      },
    },
    {
      id: 'department-store',
      label: 'חנות כלבו, סופרמרקט, בית ספר לנהיגה',
      rates: { '*': flat(402.53) },
    },
    {
      id: 'industry',
      label: 'תעשייה (במפעל, מחסן קירור, מחסן ערובה)',
      description:
        'לפי ייעוד הקרקע בתכנית ולפי שטח הבניין הכולל (עד 100, 101–500, 501–1,000, מעל 1,000 מ״ר); התעריף חל על כל השטח.',
      zones: RISHON_LANDUSE_ZONES,
      rates: {
        resco: bands([100, 194.06], [500, 192.65], [1000, 185.54], [INF, 176.47]),
        other: bands([100, 168.5], [500, 163.81], [1000, 160.83], [INF, 146.09]),
      },
    },
    {
      id: 'workshop',
      label: 'מלאכה (מוסך, מסגריה, נגריה, ריפוד, זגגות)',
      zones: RISHON_LANDUSE_ZONES,
      rates: {
        resco: bands([100, 196.39], [500, 194.99], [1000, 187.77], [INF, 178.58]),
        other: bands([100, 170.53], [500, 165.75], [1000, 162.78], [INF, 147.85]),
      },
    },
    { id: 'bank', label: 'בנק (כל האזורים, פרט לרמת אליהו)', rates: { '*': flat(1621.69) } },
    { id: 'insurer', label: 'חברת ביטוח', rates: { '*': flat(556.2) } },
  ],
  sourceUrl: 'https://www.rishonlezion.muni.il/Residents/arnona/ArnonaOrders/צו_ארנונה_2026.pdf',
  sourceLabel: 'צו ארנונה 2026 של ראשון לציון, פרק ב׳: סעיפים 2.1–2.15 (עמ׳ 16–21)',
  verifiedAt: '2026-11-20',
  notes: [
    'אין בצו תעריף מחסן כללי: מחסן מחויב כחלק מהקטגוריה שהוא משרת — ב־50% מהתעריף במשרדים ובחנויות, ובתעריף התעשייה בתעשייה.',
    'השטח מחושב לפי המידות החיצוניות של הבניין; שבר מעל חצי מ״ר נחשב למטר שלם.',
    'שטח פתוח פטור. בניין חדש ריק: 100% עד 12 חודשים; בניין ריק 30 יום ומעלה: 100% עד 6 חודשים, בכפוף להצהרה ובדיקה.',
    'תשלום מראש של כל השנה עד 15.2.2026: הנחה 1%; הוראת קבע בבנק: 1%.',
  ],
};

// ───────────────────────── פתח תקווה (צו 2026, פרק 2, עמ' 8–14) ─────────────────────────
const PT_ZONES: BusinessZone[] = [
  { id: 'a', label: 'אזור א׳' },
  { id: 'b', label: 'אזור ב׳' },
  { id: 'c', label: 'אזור ג׳' },
];
const PT_OFFICE_CLASSES: BusinessClass[] = [
  { id: 'A', label: 'סוג א׳ — בניין אבן/בטון/בלוקים, ברוטו 11 מ״ר ומעלה, או בנייה/שיפוץ אחרי 1930' },
  { id: 'B', label: 'סוג ב׳ — כל משרד אחר' },
];
const PT_SHOP_CLASSES: BusinessClass[] = [
  { id: 'A', label: 'סוג א׳ — בנייה קשיחה ובנוסף: אחרי 1930, או ברוטו 16 מ״ר ומעלה, או גלריה מעל 20 מ״ר' },
  { id: 'B', label: 'סוג ב׳ — בטון/בלוקים שאינו סוג א׳, גלריה עד 20 מ״ר, חנות בחצר בלי חזית לרחוב' },
  { id: 'C', label: 'סוג ג׳ — כל השאר, כולל קרוואן' },
];

/** מרכיב ratesByClass מתוך שורות [גבול שטח, תעריף סוג א׳, ב׳, ג׳?] לכל אזור. */
function ptRates(
  rowsByZone: Record<string, [number, ...number[]][]>,
  classIds: string[],
): Record<string, Record<string, ArnonaZoneRate>> {
  const out: Record<string, Record<string, ArnonaZoneRate>> = {};
  for (const [zone, rows] of Object.entries(rowsByZone)) {
    out[zone] = {};
    classIds.forEach((cls, ci) => {
      out[zone][cls] = bands(...rows.map((r) => [r[0], r[ci + 1]] as [number, number]));
    });
  }
  return out;
}

const PETAH_TIKVA_BUSINESS: BusinessCity = {
  id: 'petah-tikva-business-2026',
  name: 'פתח תקווה',
  year: 2026,
  zones: PT_ZONES,
  zoneHelp:
    'אזור המס של עסק נקבע לפי רשימת הרחובות של העירייה (נספח "לוט 1", שאינו בקובץ הצו) ומופיע בחשבון הארנונה; בניין הגובל בכמה אזורים מסווג באזור שתעריפו הגבוה.',
  uses: [
    {
      id: 'office',
      label: 'משרד (מקצועות חופשיים ואחרים, מחוץ לאזור תעשייה)',
      description:
        'הצו מחלק לטווחי שטח (עד 50, 51–85, 86–25,000) ואינו מבהיר אם התעריף חל על כל השטח; המחשבון מחיל אותו על כל השטח. שטח מעל 25,000 מ״ר — תעריף נפרד בצו, לא מחושב כאן.',
      classes: PT_OFFICE_CLASSES,
      ratesByClass: ptRates(
        {
          a: [
            [50, 455.93, 402.03],
            [85, 448.61, 365.8],
            [25000, 408.17, 332.89],
          ],
          b: [
            [50, 358.18, 325.27],
            [85, 341.68, 295.87],
            [25000, 290.68, 240.74],
          ],
          c: [[25000, 255.85, 237.48]],
        },
        ['A', 'B'],
      ),
    },
    {
      id: 'retail',
      label: 'חנות, מסעדה, בית קפה ועסק מסחרי',
      description:
        'לפי טווחי שטח (עד 50, 100, 200, 299, 300–25,000). הצו אינו מבהיר אם התעריף חל על כל השטח; המחשבון מחיל אותו על כל השטח. שטח מעל 25,000 מ״ר — לא מחושב כאן.',
      classes: PT_SHOP_CLASSES,
      ratesByClass: ptRates(
        {
          a: [
            [50, 427.96, 349.89, 263.87],
            [100, 455.93, 374.05, 282.32],
            [200, 455.93, 402.99, 305.01],
            [299, 455.93, 455.93, 358.38],
            [25000, 455.93, 455.93, 364.87],
          ],
          b: [
            [50, 310.92, 281.61, 240.95],
            [100, 329.83, 301.42, 256.72],
            [200, 359.12, 324.7, 277.97],
            [299, 416.94, 380.36, 321.81],
            [25000, 424.48, 387.16, 327.66],
          ],
          c: [[25000, 280.41, 258.28, 206.59]],
        },
        ['A', 'B', 'C'],
      ),
    },
    {
      id: 'warehouse',
      label: 'מחסן (למעט מחסן שיווק)',
      description:
        'מחסן לאחסנה בלבד, ללא מכירה או תצוגה, מבנה נפרד עם כניסה משלו. עד 100 מ״ר ומעל 100 מ״ר; התעריף חל על כל השטח לפי הצו.',
      classes: PT_SHOP_CLASSES,
      ratesByClass: ptRates(
        {
          a: [
            [100, 277.8, 228.32, 171.26],
            [INF, 319.71, 254.94, 194.03],
          ],
          b: [
            [100, 201.69, 186.48, 159.77],
            [INF, 228.32, 205.51, 175.05],
          ],
          c: [[INF, 152.19, 136.92, 110.34]],
        },
        ['A', 'B', 'C'],
      ),
    },
    {
      id: 'industry',
      label: 'תעשייה ומלאכה (מפעל, בית מלאכה)',
      description: 'עד 20,000 מ״ר בתעריף אחד והעודף בתעריף נמוך יותר (מדרגות שוליות), בכל העיר.',
      rates: { '*': tiers([20000, 196.47], [INF, 120.41]) },
    },
    { id: 'bank', label: 'בנק (למעט הנהלות)', rates: { '*': flat(1642.06) } },
    { id: 'insurer', label: 'חברת ביטוח', rates: { '*': flat(575.75) } },
  ],
  sourceUrl: 'https://api.petah-tikva.muni.il//media/vovfqold/צו-מיסים-2026-חוקי-קיים-סופי-pdfua.pdf',
  sourceLabel: 'צו מיסים 2026 של פתח תקווה, פרק 2: סעיפים 2.2–2.4 (עמ׳ 8–12)',
  verifiedAt: '2026-11-20',
  notes: [
    'סוג הבניין (א׳/ב׳/ג׳) נקבע בצו בנפרד למשרדים ולחנויות (סעיפים 3.2.9–3.2.10); מחסן מקבל את סיווג העסק שהוא משרת.',
    'שטחים משותפים בבניין מרובה מחזיקים מתחלקים ביניהם לפי יחס השטח; שבר מעל חצי מ״ר נחשב למטר שלם.',
    'גלריה לשימוש משרד או מכירה מחויבת במלואה; גלריית אחסנה מעל 1.70 מ׳ — 50%, ומתחת — 25%.',
    'מחזיק שנכנס אחרי 1 בינואר מחויב יחסית לחודשים. תשלום מראש של כל השנה עד 31.1.2026: 1%; הוראת קבע: 0.7%.',
    'הנחות לבניין ריק מפורטות בנספח הנחות ופטורים שאינו בקובץ הצו, ולכן לא כלולות כאן.',
  ],
};

export const ARNONA_BUSINESS_CITIES: BusinessCity[] = [
  TEL_AVIV_BUSINESS,
  HAIFA_BUSINESS,
  RISHON_BUSINESS,
  PETAH_TIKVA_BUSINESS,
  RAMAT_GAN_BUSINESS,
  BEER_SHEVA_BUSINESS,
];

/** סימולי הבניין של השימוש (אם יש מימד כזה). */
export function classesForUse(city: BusinessCity, use: BusinessUse): BusinessClass[] | undefined {
  if (!use.ratesByClass) return undefined;
  return use.classes ?? city.classes;
}

/** אזורי השימוש: של השימוש עצמו אם הוגדרו, אחרת של העיר. */
export function zonesForUse(city: BusinessCity, use: BusinessUse): BusinessZone[] {
  return use.zones ?? city.zones;
}

/** מוצא את תעריף השימוש באזור ובסימול; undefined אם אין תעריף בצו. */
export function businessRate(
  use: BusinessUse,
  zoneId: string,
  classId?: string,
): ArnonaZoneRate | undefined {
  if (use.ratesByClass) {
    const byZone = use.ratesByClass[zoneId] ?? use.ratesByClass['*'];
    return classId ? byZone?.[classId] : undefined;
  }
  return use.rates?.[zoneId] ?? use.rates?.['*'];
}
