'use client';

import { usePathname } from 'next/navigation';

/**
 * באנר קידום קורסי FinSchool — מוצג רק בעמודי מחשבונים רלוונטיים.
 *
 * מיפוי:
 * - עמודי בעלי עסקים (חברה, דיבידנד, עלות מעסיק) → קורס "מנהל הכספים" (CFO)
 * - שאר עמודי /self-employed → קורס "הכסף של העסק בידיים שלך" (CPA)
 * - בכל עמוד אחר הרכיב לא מרונדר כלל.
 *
 * עקרון מסר (לפי קו הקרייטיבים של FinSchool): eyebrow → headline → support → CTA.
 */

const CFO_PATHS = [
  '/self-employed/corporation-vs-individual',
  '/self-employed/dividend-vs-salary',
  '/self-employed/employer-cost',
];

const COURSES = {
  cpa: {
    url: 'https://school.profitmargin.co.il/CPA.html',
    eyebrow: 'קורס דיגיטלי לעצמאים · בהדרכת רו״ח',
    headline: 'חישבת את המספר. עכשיו תבין את השיטה.',
    support:
      'מע״מ, מס הכנסה וביטוח לאומי — בשפה שכולם מבינים. תפסיק לשלם ביתר ותנהל את הכסף של העסק בביטחון מלא.',
    cta: 'לפרטי הקורס',
    campaign: 'cpa-course',
  },
  cfo: {
    url: 'https://school.profitmargin.co.il/CFO.html',
    eyebrow: 'קורס דיגיטלי לבעלי עסקים · בהדרכת רו״ח',
    headline: 'תנהל את העסק כמו מנהל כספים אמיתי.',
    support:
      'תזרים מזומנים, תקציב שנתי, הון חוזר והתנהלות מול הבנק — עם כלי Excel מוכנים לעבודה.',
    cta: 'לפרטי הקורס',
    campaign: 'cfo-course',
  },
} as const;

export function CourseCTA() {
  const pathname = usePathname();

  if (!pathname?.startsWith('/self-employed/')) return null;

  const course = CFO_PATHS.includes(pathname) ? COURSES.cfo : COURSES.cpa;
  const href = `${course.url}?utm_source=cheshbonai&utm_medium=site_cta&utm_campaign=${course.campaign}&utm_content=${encodeURIComponent(pathname)}`;

  return (
    <aside
      aria-label="קורס דיגיטלי מומלץ"
      className="my-12 rounded-2xl bg-gray-900 p-6 sm:p-8 text-white shadow-lg"
    >
      <p className="text-xs font-semibold tracking-wide text-amber-400 mb-2">
        {course.eyebrow}
      </p>
      <p className="text-xl sm:text-2xl font-bold mb-3 leading-snug">{course.headline}</p>
      <p className="text-sm sm:text-base text-gray-300 leading-relaxed mb-5 max-w-2xl">
        {course.support}
      </p>
      <div className="flex flex-wrap items-center gap-4">
        <a
          href={href}
          target="_blank"
          rel="noopener"
          className="inline-block rounded-lg bg-amber-500 px-6 py-3 text-sm font-bold text-gray-900 transition hover:bg-amber-400"
        >
          {course.cta} ←
        </a>
        <span className="text-xs text-gray-400">
          FinSchool · רו״ח אנדרי פלטונוב, בוגר PwC · 14 יום החזר כספי מלא
        </span>
      </div>
    </aside>
  );
}
