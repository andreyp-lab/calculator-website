/**
 * courses.ts — הקורסים הדיגיטליים של FinSchool (אנדרי פלטונוב, רו"ח).
 *
 * האתר משמש כמנוע לידים אורגני: באנרים מוצגים בהקשר הנכון
 * (מחשבון/מאמר עצמאים → קורס עצמאים; כלים עסקיים → קורס בעלי עסקים),
 * וכל קישור נושא פרמטרי UTM למדידת המרות לפי דף מקור.
 */

export interface Course {
  id: string;
  /** שם הקורס */
  name: string;
  /** משפט מכירה קצר */
  tagline: string;
  /** למי הקורס מיועד (מוצג בבאנר) */
  audience: string;
  lessons: number;
  price: number;
  /** דף הנחיתה / הרשמה */
  url: string;
  /** Tailwind gradient classes לרקע הבאנר */
  gradient: string;
  /** טקסט תג ההדגשה */
  badge: string;
  /** נקודות ערך קצרות */
  highlights: string[];
}

export const COURSES = {
  selfEmployed: {
    id: 'self-employed-money',
    name: 'הכסף של העסק בידיים שלך',
    tagline: 'מע״מ, מס הכנסה וביטוח לאומי — בשפה שכולם מבינים. תפסיק לשלם ביתר.',
    audience: 'לעצמאים, עוסקים פטורים ומורשים ופרילנסרים',
    lessons: 37,
    price: 297,
    url: 'https://course.profitmargin.co.il/profitmargin',
    gradient: 'from-slate-900 via-blue-900 to-indigo-800',
    badge: 'קורס דיגיטלי לעצמאים',
    highlights: ['37 שיעורים', 'גישה לכל החיים', '30 יום החזר כספי מלא'],
  },
  business: {
    id: 'business-cfo',
    name: 'מנהל הכספים של העסק שלך',
    tagline: 'תזרים מזומנים, תקציב והון חוזר — נהל את העסק כמו מנהל כספים, בלי לשכור אחד.',
    audience: 'לבעלי עסקים, יזמים ומנהלים',
    lessons: 25,
    price: 297,
    url: 'https://cfocourse.profitmargin.co.il/ImCFO',
    gradient: 'from-slate-900 via-emerald-900 to-teal-800',
    badge: 'קורס מתקדם לבעלי עסקים',
    highlights: ['25 שיעורים', 'כלים מוכנים להורדה', '30 יום החזר כספי מלא'],
  },
} as const satisfies Record<string, Course>;

export type CourseKey = keyof typeof COURSES;

/** נתיבי מחשבונים/כלים שמתאימים לקורס בעלי העסקים (שאר ה-self-employed → קורס עצמאים). */
const BUSINESS_PATHS = new Set<string>([
  '/self-employed/corporation-vs-individual',
  '/self-employed/dividend-vs-salary',
  '/self-employed/employer-cost',
]);

/**
 * מחזיר את הקורס הרלוונטי לנתיב דף, או null אם אין התאמה טובה
 * (כדי לא להציג באנר לא-רלוונטי בדפי שכירים/נדל"ן/רכב).
 */
export function getCourseForPath(path: string | undefined): Course | null {
  if (!path) return null;
  const p = path.replace(/\/$/, '');

  if (p.startsWith('/tools')) return COURSES.business;
  if (BUSINESS_PATHS.has(p)) return COURSES.business;
  if (p.startsWith('/self-employed')) return COURSES.selfEmployed;
  if (p.startsWith('/personal-tax')) return COURSES.selfEmployed;
  return null;
}

/** מחזיר קורס לפי קטגוריית בלוג, או null. */
export function getCourseForCategory(category: string | undefined): Course | null {
  if (!category) return null;
  switch (category) {
    case 'עצמאיים':
    case 'מיסוי אישי':
      return COURSES.selfEmployed;
    case 'תקציב וחיסכון':
      return COURSES.business;
    default:
      return null;
  }
}

/**
 * בונה URL עם פרמטרי UTM למדידת מקור הליד.
 * @param course הקורס
 * @param contentSlug מזהה הדף שממנו הגיע הקליק (למשל /self-employed/vat)
 */
export function courseUrl(course: Course, contentSlug: string): string {
  const params = new URLSearchParams({
    utm_source: 'cheshbonai',
    utm_medium: 'banner',
    utm_campaign: course.id,
    utm_content: contentSlug.replace(/^\//, '') || 'home',
  });
  return `${course.url}?${params.toString()}`;
}
