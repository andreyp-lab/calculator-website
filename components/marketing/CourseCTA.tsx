'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  COURSE_DESTINATIONS,
  getCourseRouting,
  hasExistingCoursePromotion,
  normalizeCoursePath,
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

interface CourseCopy {
  headline: string;
  support: string;
}

type AnalyticsWindow = Window & {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
};

function trackCourseEvent(eventName: string, params: Record<string, string>) {
  const analytics = window as AnalyticsWindow;
  analytics.dataLayer = analytics.dataLayer || [];
  analytics.gtag = analytics.gtag || function gtag(...args: unknown[]) {
    analytics.dataLayer?.push(args);
  };
  analytics.gtag('event', eventName, params);
}

/**
 * מתאים את המסר לשאלה שהביאה את הקורא לעמוד. הקורס עצמו לא משתנה — רק
 * החיבור בין הערך שקיבל בעמוד לבין הצעד הבא הרלוונטי עבורו.
 */
function getContextualCopy(path: string, courseId: CourseId): CourseCopy {
  const normalizedPath = normalizeCoursePath(path);

  if (courseId === 'cpa') {
    if (
      normalizedPath.includes('opening-business') ||
      normalizedPath.includes('business-setup-cost') ||
      normalizedPath.includes('osek-patur') ||
      normalizedPath.includes('esek-zeir') ||
      normalizedPath.includes('first-90-days')
    ) {
      return {
        headline: 'פתחתם עסק? עכשיו בונים שגרת ניהול מסודרת.',
        support:
          'הקורס מחבר בין פתיחת התיק לבין העבודה השוטפת: מסמכים, מע״מ, מס הכנסה וביטוח לאומי — בשפה ברורה ובהדרכת רו״ח.',
      };
    }

    if (
      normalizedPath.includes('/invoices') ||
      normalizedPath.includes('/vat') ||
      normalizedPath.includes('allowed-expenses')
    ) {
      return {
        headline: 'להבין מה מוציאים, מה שומרים ומה מדווחים.',
        support:
          'בקורס לעצמאים לומדים לחבר בין חשבוניות, מע״מ, הוצאות מוכרות והתשלומים לרשויות — בלי להסתמך על ניחושים.',
      };
    }

    if (
      normalizedPath.includes('tax-advances') ||
      normalizedPath.includes('social-security') ||
      normalizedPath.includes('/net') ||
      normalizedPath.includes('year-end')
    ) {
      return {
        headline: 'רוצים להבין מה עומד מאחורי החיובים של העסק?',
        support:
          'הקורס מסביר כיצד מע״מ, מס הכנסה וביטוח לאומי מתחברים לאורך השנה, ואילו נתונים כדאי לבדוק לפני שפונים לאיש מקצוע.',
      };
    }
  }

  if (courseId === 'cfo') {
    if (
      normalizedPath.includes('cash-flow') ||
      normalizedPath.includes('cashflow') ||
      normalizedPath.includes('/budget') ||
      normalizedPath.includes('/forecast')
    ) {
      return {
        headline: 'הופכים תקציב ותזרים לשגרת ניהול של העסק.',
        support:
          'בקורס CFO לומדים לעבוד באופן שוטף עם תזרים, תקציב ותרחישים — כדי לקבל החלטות על בסיס המספרים ולא רק בדיעבד.',
      };
    }

    if (
      normalizedPath.includes('credit') ||
      normalizedPath.includes('loan-eligibility') ||
      normalizedPath.includes('working-capital')
    ) {
      return {
        headline: 'מתכוננים לשיחת אשראי עם תמונה פיננסית מסודרת.',
        support:
          'קורס CFO מחבר בין תזרים, הון חוזר, תקציב והתנהלות מול הבנק — בלי להבטיח אישור ובלי להחליף בדיקה מקצועית.',
      };
    }

    if (
      normalizedPath.includes('profit-and-loss') ||
      normalizedPath.includes('financial-analysis') ||
      normalizedPath.includes('business-finance')
    ) {
      return {
        headline: 'קוראים את המספרים — ומשתמשים בהם כדי לנהל.',
        support:
          'בקורס CFO לומדים לחבר בין דוח רווח והפסד, תזרים מזומנים ותקציב, ולתרגם את הנתונים לשגרת ניהול מעשית.',
      };
    }
  }

  return COURSES[courseId];
}

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
  const asideRef = useRef<HTMLElement>(null);
  const trackedViewRef = useRef<string | null>(null);
  const route = sourcePath ? getCourseRouting(sourcePath) : null;
  const resolvedCourseId = courseId ?? route?.courseId;
  const resolvedPlacement = placement ?? route?.placement ?? 'calculator';
  const shouldSuppress = Boolean(
    sourcePath && suppressIfPromoted && hasExistingCoursePromotion(sourcePath),
  );

  useEffect(() => {
    if (!sourcePath || !resolvedCourseId || shouldSuppress || !asideRef.current) return;

    const trackingKey = `${resolvedCourseId}:${resolvedPlacement}:${sourcePath}`;
    const node = asideRef.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || trackedViewRef.current === trackingKey) return;
        trackedViewRef.current = trackingKey;
        trackCourseEvent('course_cta_view', {
          course_id: resolvedCourseId,
          placement: resolvedPlacement,
          source_path: sourcePath,
        });
        observer.disconnect();
      },
      { threshold: 0.5 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [resolvedCourseId, resolvedPlacement, shouldSuppress, sourcePath]);

  if (!sourcePath || !resolvedCourseId || shouldSuppress) return null;

  const course = COURSES[resolvedCourseId];
  const copy = getContextualCopy(sourcePath, resolvedCourseId);

  return (
    <aside
      ref={asideRef}
      aria-label="קורס דיגיטלי מומלץ"
      className={cn(
        'my-12 border border-gold-light/30 bg-ink p-6 text-cream sm:p-8',
        className,
      )}
    >
      <p className="font-mono text-xs uppercase tracking-[0.14em] text-gold-light mb-3">
        {'// '}{course.eyebrow}
      </p>
      <p className="font-serif text-xl sm:text-2xl mb-3 leading-snug text-cream">{copy.headline}</p>
      <p className="text-sm sm:text-base text-cream/70 leading-relaxed mb-5 max-w-2xl">
        {copy.support}
      </p>
      <div className="flex flex-wrap items-center gap-4">
        <Link
          href={course.url}
          onClick={() => {
            trackCourseEvent('course_cta_click', {
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
