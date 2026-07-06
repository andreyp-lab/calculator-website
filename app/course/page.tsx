import type { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/calculator/Breadcrumbs';
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';
import { CourseSchema } from '@/components/seo/CourseSchema';
import {
  CheckCircle2,
  GraduationCap,
  ShieldCheck,
  Clock,
  Star,
  BadgeCheck,
} from 'lucide-react';

const SITE_URL = 'https://cheshbonai.co.il';

export const metadata: Metadata = {
  alternates: { canonical: '/course' },
  title: 'בית הספר הפיננסי FinSchool — קורסים לניהול כספי העסק',
  description:
    'FinSchool — בית הספר הפיננסי לעצמאים ובעלי עסקים, בהדרכת רו״ח אנדרי פלטונוב. 3 קורסים פרקטיים: מע״מ ומס לעצמאים, ניהול כספים לעסקים ו-AI לאנשי כספים. גישה לכל החיים, 14 יום החזר.',
  openGraph: {
    title: 'בית הספר הפיננסי FinSchool — קורסים לניהול כספי העסק',
    description:
      'קורסים פרקטיים מרו״ח שניהל מאות מיליוני ₪: מע״מ ומס לעצמאים, ניהול כספים לבעלי עסקים ו-Claude AI לאנשי כספים. גישה לכל החיים · 14 יום החזר מלא.',
    url: '/course',
  },
};

const SCHOOL_URL = 'https://school.profitmargin.co.il';

/** בונה קישור חיצוני עם UTM אחיד לפי פורמט הקמפיין. */
function utm(
  baseUrl: string,
  campaign: 'cpa-course' | 'cfo-course' | 'ai-course',
  medium: 'course_page' | 'home_band' | 'nav',
  location: string,
) {
  const params = new URLSearchParams({
    utm_source: 'cheshbonai',
    utm_medium: medium,
    utm_campaign: campaign,
    utm_content: location,
  });
  return `${baseUrl}?${params.toString()}`;
}

interface Course {
  id: 'cpa' | 'cfo' | 'ai';
  badge: string;
  name: string;
  audience: string;
  description: string;
  bullets: string[];
  scope: string;
  price: string;
  /** מחיר נומרי ל-JSON-LD */
  priceValue: string;
  social?: string;
  baseUrl: string;
  campaign: 'cpa-course' | 'cfo-course' | 'ai-course';
  /** דף מכירה משולב באתר (1:1) — קישור פנימי בלי UTM/target חיצוני */
  internal?: boolean;
  /** תיאור מורחב ל-schema */
  schemaDescription: string;
  featured?: boolean;
}

const COURSES: Course[] = [
  {
    id: 'cpa',
    badge: 'לעצמאים ופרילנסרים',
    name: 'הכסף של העסק בידיים שלך',
    audience: 'עצמאים / פרילנסרים',
    description:
      'מע״מ, מס הכנסה וביטוח לאומי — בשפה שכולם מבינים. תפסיק לשלם ביתר ותנהל את הכסף של העסק בביטחון מלא.',
    bullets: [
      'מע״מ, מס הכנסה וביטוח לאומי — בלי מונחים מפחידים',
      'להפסיק לשלם מס ביתר ולהכיר את ההוצאות המוכרות',
      'לנהל את כסף העסק בביטחון לאורך כל השנה',
    ],
    scope: '37 שיעורים · 120+ דקות',
    price: '297 ₪ (תשלום חד-פעמי)',
    priceValue: '297',
    social: '87+ בוגרים · דירוג 4.9',
    baseUrl: '/course/self-employed',
    internal: true,
    campaign: 'cpa-course',
    schemaDescription:
      'קורס דיגיטלי לעצמאים ופרילנסרים: מע״מ, מס הכנסה וביטוח לאומי בשפה פשוטה, הפסקת תשלומי יתר וניהול כספי העסק בביטחון. 37 שיעורים, 120+ דקות.',
    featured: true,
  },
  {
    id: 'cfo',
    badge: 'לבעלי עסקים מבוססים',
    name: 'מנהל הכספים של העסק שלך',
    audience: 'בעלי עסקים מבוססים, חברות',
    description:
      'תזרים מזומנים, תקציב שנתי, הון חוזר, בנקים ואשראי — לנהל את העסק כמו מנהל כספים, בלי לשכור אחד.',
    bullets: [
      'תזרים מזומנים, תקציב שנתי והון חוזר',
      'התנהלות מול בנקים ואשראי כמו מקצוען',
      'כולל כלי Excel מוכנים לעבודה',
    ],
    scope: '25 שיעורים · 180+ דקות',
    price: '297 ₪ מחיר השקה (מחיר רגיל 497 ₪)',
    priceValue: '297',
    social: '64+ בוגרים · דירוג 4.9',
    baseUrl: '/course/business',
    internal: true,
    campaign: 'cfo-course',
    schemaDescription:
      'קורס דיגיטלי לבעלי עסקים: תזרים מזומנים, תקציב שנתי, הון חוזר והתנהלות מול בנקים ואשראי — לנהל כמו מנהל כספים בלי לשכור אחד, כולל כלי Excel מוכנים. 25 שיעורים, 180+ דקות.',
  },
  {
    id: 'ai',
    badge: 'לאנשי כספים מקצועיים',
    name: 'Claude AI לאנשי כספים',
    audience: 'בעלי עסקים, מנהלי כספים, רואי חשבון',
    description:
      'לרתום את Claude לעבודה הפיננסית היומית — דוחות, מצגות, אוטומציה ודאשבורדים. מהבסיס ועד צוותי סוכנים.',
    bullets: [
      'דוחות, מצגות, אוטומציה ודאשבורדים עם Claude',
      '12 מודולים — מהבסיס ועד צוותי סוכנים (Agents)',
      'כולל 10 Plugins & Skills מוכנים לשימוש',
    ],
    scope: '12 מודולים · 8 שעות תוכן',
    price: '397 ₪ מחיר השקה (עולה ל-500 ₪)',
    priceValue: '397',
    social: '100+ בוגרים · דירוג 4.9',
    baseUrl: 'https://claudecourse.profitmargin.co.il/',
    campaign: 'ai-course',
    schemaDescription:
      'קורס דיגיטלי לאנשי כספים: רתימת Claude AI לעבודה הפיננסית היומית — דוחות, מצגות, אוטומציה ודאשבורדים. 12 מודולים מהבסיס ועד צוותי סוכנים, כולל 10 Plugins & Skills מוכנים. 8 שעות תוכן.',
  },
];

const SCHOOL_FACTS = [
  { icon: GraduationCap, label: '3 קורסים פרקטיים · 200+ שיעורים' },
  { icon: Clock, label: '20+ שעות תוכן · גישה לכל החיים' },
  { icon: ShieldCheck, label: '14 יום החזר כספי מלא · תמיכה ב-WhatsApp' },
];

const TRUST_BAND = ['200+ שיעורים', '3 קורסים', 'גישה לכל החיים', '14 יום החזר'];

const PERSONAS = [
  {
    title: 'עצמאי חדש',
    body: 'פתחת עסק או פרילנס ורוצה סוף-סוף להבין מע״מ, מס וביטוח לאומי בלי לפחד. קורס CPA נבנה בדיוק בשבילך.',
  },
  {
    title: 'בעל עסק',
    body: 'יש לך עסק שגדל, ואתה רוצה לשלוט בתזרים, בתקציב ובאשראי כמו מנהל כספים אמיתי. קורס CFO ייתן לך את הכלים.',
  },
  {
    title: 'איש כספים',
    body: 'רו״ח, מנהל כספים או בעל עסק מנוסה שרוצה לעבוד מהר יותר עם AI — דוחות, אוטומציה ודאשבורדים. קורס Claude AI בשבילך.',
  },
];

const FAQ_ITEMS = [
  {
    question: 'יש החזר כספי אם הקורס לא מתאים לי?',
    answer:
      'כן. ל-FinSchool מדיניות של 14 יום החזר כספי מלא. אם אחרי שצפית בקורס הוא לא מתאים לך — מקבלים את הכסף בחזרה, בלי שאלות.',
  },
  {
    question: 'לכמה זמן יש לי גישה לקורס?',
    answer:
      'הגישה היא לכל החיים. רוכשים פעם אחת וצופים מתי שרוצים, בקצב שלכם, כולל כל עדכון עתידי לתוכן הקורס.',
  },
  {
    question: 'צריך ידע מוקדם בחשבונאות או במספרים?',
    answer:
      'לא. הקורסים נבנו כדי להסביר מהבסיס בשפה פשוטה. קורס CPA לעצמאים מתאים גם למי שמעולם לא עסק במספרים, וכל מושג מוסבר בדוגמאות מהחיים.',
  },
  {
    question: 'איך נרשמים ומתחילים?',
    answer:
      'נכנסים לעמוד הקורס באתר FinSchool דרך כפתור "לפרטי הקורס", משלימים את הרכישה (תשלום חד-פעמי), ומקבלים גישה מיידית לכל השיעורים בכל מכשיר.',
  },
  {
    question: 'מי מעביר את הקורסים?',
    answer:
      'אנדרי פלטונוב — רו״ח מוסמך, בוגר PwC וסמנכ״ל כספים (CFO) לשעבר, עם 15+ שנות ניסיון, שניהל כ-400 מיליון ₪ בשנה. הידע פרקטי ומגיע מהשטח.',
  },
];

export default function CoursePage() {
  return (
    <div className="bg-cream">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Breadcrumbs items={[{ label: 'דף הבית', href: '/' }, { label: 'הקורסים' }]} />
        </div>

        {/* Hero — ink + gold */}
        <section className="bg-ink p-6 sm:p-10 text-cream mb-10">
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-gold-light mb-3">
            // בית הספר הפיננסי לעצמאים ובעלי עסקים · בהדרכת רו״ח אנדרי פלטונוב
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold leading-tight mb-4">
            בית הספר הפיננסי FinSchool
          </h1>
          <p className="text-base sm:text-lg text-cream/70 leading-relaxed max-w-2xl mb-6">
            מרו״ח שמנהל מאות מיליוני שקלים — ידע פרקטי לניהול כספי העסק. 3 קורסים פרקטיים
            שיביאו אותך מ״לחשב מספר״ ל״להבין את השיטה״, ולנהל את הכסף של העסק בביטחון מלא.
          </p>

          {/* רצועת אמון */}
          <ul className="flex flex-wrap gap-x-3 gap-y-2 mb-6">
            {TRUST_BAND.map((item) => (
              <li
                key={item}
                className="inline-flex items-center gap-2 border border-cream/15 px-4 py-1.5 text-sm text-cream/85"
              >
                <CheckCircle2
                  className="w-4 h-4 text-gold-light flex-shrink-0"
                  aria-hidden="true"
                />
                {item}
              </li>
            ))}
          </ul>

          <ul className="grid gap-2 sm:grid-cols-3">
            {SCHOOL_FACTS.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-start gap-2 text-sm text-cream/70">
                <Icon className="w-5 h-5 text-gold-light flex-shrink-0 mt-0.5" aria-hidden="true" />
                <span>{label}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Courses */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-ink mb-2">שלושת הקורסים של FinSchool</h2>
          <p className="text-ink/70 mb-6">
            בחרו את הקורס שמתאים לשלב שבו אתם נמצאים — מעצמאי שמתחיל ועד איש כספים מנוסה.
          </p>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 items-stretch">
            {COURSES.map((course) => {
              const href = course.internal
                ? course.baseUrl
                : utm(course.baseUrl, course.campaign, 'course_page', 'card');
              return (
                <article
                  key={course.id}
                  className={`relative flex flex-col bg-paper p-6 ${
                    course.featured
                      ? 'border-2 border-gold'
                      : 'border border-ink/15'
                  }`}
                >
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className="inline-block border border-gold/40 px-3 py-1 font-mono text-xs uppercase tracking-[0.14em] text-gold">
                      {course.badge}
                    </span>
                    {course.featured && (
                      <span className="inline-flex items-center gap-1 bg-gold px-3 py-1 text-xs font-bold text-paper">
                        <Star className="w-3 h-3" aria-hidden="true" /> הכי פופולרי לעצמאים
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-bold text-ink mb-1 leading-snug">{course.name}</h3>
                  <p className="text-sm font-medium text-gold mb-3">
                    למי שמתאים: {course.audience}
                  </p>
                  <p className="text-sm text-ink/70 leading-relaxed mb-4">
                    {course.description}
                  </p>

                  <ul className="space-y-2 mb-5">
                    {course.bullets.map((b) => (
                      <li key={b} className="flex items-start gap-2 text-sm text-ink/80">
                        <CheckCircle2
                          className="w-4 h-4 text-gold flex-shrink-0 mt-0.5"
                          aria-hidden="true"
                        />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto">
                    <p className="text-xs text-ink/50 mb-1">{course.scope}</p>
                    <p className="text-base font-semibold text-ink mb-1">{course.price}</p>
                    {course.social ? (
                      <p className="text-xs text-ink/50 mb-4">{course.social}</p>
                    ) : (
                      <div className="mb-4" />
                    )}
                    <a
                      href={href}
                      {...(course.internal ? {} : { target: '_blank', rel: 'noopener' })}
                      className="block w-full bg-gold px-6 py-3 text-center text-sm font-bold text-paper transition hover:bg-gold-2"
                    >
                      לפרטי הקורס ←
                    </a>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* About the instructor */}
        <section className="bg-ink text-cream p-6 sm:p-8 mb-10">
          <div className="flex flex-col sm:flex-row items-start gap-5">
            <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center bg-gold text-2xl font-bold text-paper">
              א
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-xl font-bold">אנדרי פלטונוב</h2>
                <BadgeCheck className="w-5 h-5 text-gold-light" aria-hidden="true" />
              </div>
              <p className="text-sm font-medium text-gold-light mb-3">
                רו״ח מוסמך · בוגר PwC · סמנכ״ל כספים (CFO) לשעבר
              </p>
              <p className="text-sm sm:text-base text-cream/70 leading-relaxed max-w-2xl mb-4">
                15+ שנות ניסיון בעולם הכספים, שכלל ניהול של כ-400 מיליון ₪ בשנה. הקורסים של
                FinSchool בנויים על ידע פרקטי מהשטח — בדיוק מה שעצמאי או בעל עסק צריך כדי לנהל
                את הכסף בביטחון, בלי תיאוריה מיותרת.
              </p>
              <Link
                href="/about"
                className="inline-block text-sm font-semibold text-gold-light hover:text-gold"
              >
                עוד על הרקע המקצועי ←
              </Link>
            </div>
          </div>
        </section>

        {/* Personas */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-ink mb-6">למי הקורסים מתאימים?</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {PERSONAS.map((persona) => (
              <div
                key={persona.title}
                className="border border-ink/15 bg-cream-2 p-6"
              >
                <h3 className="text-lg font-bold text-ink mb-2">{persona.title}</h3>
                <p className="text-sm text-ink/75 leading-relaxed">{persona.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-ink mb-6">שאלות נפוצות</h2>
          <div className="space-y-3">
            {FAQ_ITEMS.map((item, idx) => (
              <details
                key={idx}
                className="group border border-ink/15 bg-paper overflow-hidden"
              >
                <summary className="flex cursor-pointer items-center justify-between px-4 py-3 font-medium text-ink hover:bg-paper-hover transition list-none">
                  <span>{item.question}</span>
                  <span
                    className="ms-4 text-xl leading-none text-gold transition-transform group-open:rotate-45"
                    aria-hidden="true"
                  >
                    +
                  </span>
                </summary>
                <div className="border-t border-ink/15 bg-cream-2 px-4 py-3">
                  <p className="text-ink/75 leading-relaxed">{item.answer}</p>
                </div>
              </details>
            ))}
          </div>
        </section>

        {/* Disclaimer — mandatory */}
        <section className="border border-ink/15 bg-cream-2 p-4 text-xs text-ink/55 leading-relaxed text-center">
          המידע באתר אינו מהווה ייעוץ פיננסי ואינו מחליף התייעצות עם רו״ח מוסמך. הרכישה
          וההתחייבות הן מול FinSchool.
        </section>
      </div>

      {/* ===== JSON-LD ===== */}
      <CourseSchema
        courses={COURSES.map((c) => ({
          name: c.name,
          description: c.schemaDescription,
          url: c.baseUrl.startsWith('http') ? c.baseUrl : `${SITE_URL}${c.baseUrl}`,
          price: c.priceValue,
        }))}
      />
      <BreadcrumbSchema
        items={[
          { name: 'דף הבית', url: SITE_URL },
          { name: 'הקורסים', url: `${SITE_URL}/course` },
        ]}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: FAQ_ITEMS.map((item) => ({
              '@type': 'Question',
              name: item.question,
              acceptedAnswer: {
                '@type': 'Answer',
                text: item.answer,
              },
            })),
          }),
        }}
      />
    </div>
  );
}
