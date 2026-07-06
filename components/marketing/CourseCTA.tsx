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
    // דף המכירה המשולב באתר (1:1) — לא הפניה חיצונית
    url: '/course/self-employed',
    eyebrow: 'קורס דיגיטלי לעצמאים · בהדרכת רו״ח',
    headline: 'חישבת את המספר. עכשיו תבין את השיטה.',
    support:
      'מע״מ, מס הכנסה וביטוח לאומי — בשפה שכולם מבינים. תפסיק לשלם ביתר ותנהל את הכסף של העסק בביטחון מלא.',
    cta: 'לפרטי הקורס',
  },
  cfo: {
    url: '/course/business',
    eyebrow: 'קורס דיגיטלי לבעלי עסקים · בהדרכת רו״ח',
    headline: 'תנהל את העסק כמו מנהל כספים אמיתי.',
    support:
      'תזרים מזומנים, תקציב שנתי, הון חוזר והתנהלות מול הבנק — עם כלי Excel מוכנים לעבודה.',
    cta: 'לפרטי הקורס',
  },
} as const;

export function CourseCTA() {
  const pathname = usePathname();

  if (!pathname?.startsWith('/self-employed/')) return null;

  const course = CFO_PATHS.includes(pathname) ? COURSES.cfo : COURSES.cpa;

  return (
    <aside
      aria-label="קורס דיגיטלי מומלץ"
      className="my-12 bg-ink border border-gold-light/30 p-6 sm:p-8 text-cream"
    >
      <p className="font-mono text-xs uppercase tracking-[0.14em] text-gold-light mb-3">
        // {course.eyebrow}
      </p>
      <p className="font-serif text-xl sm:text-2xl mb-3 leading-snug text-cream">{course.headline}</p>
      <p className="text-sm sm:text-base text-cream/70 leading-relaxed mb-5 max-w-2xl">
        {course.support}
      </p>
      <div className="flex flex-wrap items-center gap-4">
        <a
          href={course.url}
          className="inline-block bg-gold px-8 py-3.5 text-sm font-bold text-paper transition hover:bg-gold-2"
        >
          {course.cta} ←
        </a>
        <span className="text-xs text-cream/50">
          FinSchool · רו״ח אנדרי פלטונוב, בוגר PwC · 14 יום החזר כספי מלא
        </span>
      </div>
    </aside>
  );
}
