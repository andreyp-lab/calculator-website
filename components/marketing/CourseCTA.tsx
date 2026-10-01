'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  COURSE_DESTINATIONS,
  getCourseRouting,
  hasExistingCoursePromotion,
  type CourseId,
  type CoursePlacement,
} from '@/lib/data/course-routing';

/**
 * באנר קידום קורסי FinSchool — מוצג רק בתוכן שהמיפוי המרכזי מסווג כרלוונטי.
 *
 * מיפוי:
 * - עמודי בעלי עסקים (חברה, דיבידנד, עלות מעסיק) וכלי ניהול עסקיים
 *   (/tools, /business) → קורס "מנהל הכספים" (CFO)
 * - שאר עמודי /self-employed, תוכן מס לעצמאים וכלי חילוץ מע״מ → קורס
 *   "הכסף של העסק בידיים שלך" (CPA)
 * - בכל עמוד אחר הרכיב לא מרונדר כלל.
 *
 * עקרון מסר (לפי קו הקרייטיבים של FinSchool): eyebrow → headline → support → CTA.
 */

const COURSES = {
  cpa: {
    // דף המכירה המשולב באתר (1:1) — לא הפניה חיצונית
    url: COURSE_DESTINATIONS.cpa,
    eyebrow: 'קורס דיגיטלי לעצמאים · בהדרכת רו״ח',
    headline: 'למד לנהל את כספי העסק, מהדיווח ועד התכנון.',
    support:
      'מע״מ, מס הכנסה וביטוח לאומי — הסברים וכלים שיעזרו להבין את חובות העסק ולבדוק את התשלומים שלו.',
    cta: 'לפרטי הקורס',
  },
  cfo: {
    url: COURSE_DESTINATIONS.cfo,
    eyebrow: 'קורס דיגיטלי לבעלי עסקים · בהדרכת רו״ח',
    headline: 'למד לנהל את כספי העסק.',
    support:
      'תזרים מזומנים, תקציב שנתי, הון חוזר והתנהלות מול הבנק — שיעורים ותכני עזר לניהול כספי העסק.',
    cta: 'לפרטי הקורס',
  },
} as const;

interface CourseCTAProps {
  /** נתיב מפורש מאפשר רינדור יציב גם כשהרכיב משובץ בדף ייעודי. */
  path?: string;
  /** עקיפה ידנית למקרים שבהם הקורס נקבע על ידי הקשר תוכן שאינו URL. */
  courseId?: CourseId;
  placement?: CoursePlacement;
  /** מיועד לפריסה משותפת: מונע CTA נוסף בעמוד שכבר מקדם קורס. */
  suppressIfPromoted?: boolean;
  className?: string;
}

export function CourseCTA({
  path,
  courseId,
  placement,
  suppressIfPromoted = false,
  className,
}: CourseCTAProps = {}) {
  const pathname = usePathname();
  const sourcePath = path ?? pathname;

  if (!sourcePath) return null;
  if (suppressIfPromoted && hasExistingCoursePromotion(sourcePath)) return null;

  const route = getCourseRouting(sourcePath);
  const resolvedCourseId = courseId ?? route?.courseId;

  if (!resolvedCourseId) return null;

  const course = COURSES[resolvedCourseId];
  const resolvedPlacement = placement ?? route?.placement ?? 'calculator';

  return (
    <aside
      aria-label="קורס דיגיטלי מומלץ"
      className={cn(
        'my-12 border border-gold-light/30 bg-ink p-6 text-cream sm:p-8',
        className,
      )}
    >
      <p className="font-mono text-xs uppercase tracking-[0.14em] text-gold-light mb-3">
        {'// '}{course.eyebrow}
      </p>
      <p className="font-serif text-xl sm:text-2xl mb-3 leading-snug text-cream">{course.headline}</p>
      <p className="text-sm sm:text-base text-cream/70 leading-relaxed mb-5 max-w-2xl">
        {course.support}
      </p>
      <div className="flex flex-wrap items-center gap-4">
        <Link
          href={course.url}
          onClick={() => {
            const analytics = window as Window & {
              gtag?: (...args: unknown[]) => void;
            };
            analytics.gtag?.('event', 'course_cta_click', {
              course_id: resolvedCourseId,
              placement: resolvedPlacement,
              source_path: sourcePath,
            });
          }}
          className="inline-block bg-gold px-8 py-3.5 text-sm font-bold text-paper transition hover:bg-gold-2"
        >
          {course.cta} ←
        </Link>
        <span className="text-xs text-cream/50">
          FinSchool · רו״ח אנדרי פלטונוב, בוגר PwC
        </span>
      </div>
    </aside>
  );
}
