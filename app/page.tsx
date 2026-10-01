import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { AllCalculatorsGrid } from '@/components/home/AllCalculatorsGrid';
import { HeroSalaryCalc } from '@/components/home/HeroSalaryCalc';

export const metadata: Metadata = {
  title: 'מחשבונים ומדריכים פיננסיים חינם בעברית',
  description:
    'כלים ומדריכים פיננסיים בעברית לשכר, מסים, זכויות עובדים, עצמאים, משכנתא והשקעות. גישה חופשית לכלים ולמידע.',
  alternates: { canonical: '/' },
};

// ============================================================
// 7 קטגוריות ראשיות — שם וקישור פנימי
// ============================================================
const CATEGORIES = [
  {
    idx: '01',
    label: 'מסים אישיים',
    href: '/personal-tax',
    description: 'החזר מס, שכר נטו/ברוטו, מס הכנסה, נקודות זיכוי ומענק עבודה.',
  },
  {
    idx: '02',
    label: 'זכויות עובדים',
    href: '/employee-rights',
    description: 'פיצויי פיטורין, דמי לידה ואבטלה, מילואים, הבראה, חופשה ומחלה.',
  },
  {
    idx: '03',
    label: 'עצמאיים ועסקים',
    href: '/self-employed',
    description: 'מע״מ, מקדמות מס, ביטוח לאומי, תמחור שעה ומבנה עסקי אופטימלי.',
  },
  {
    idx: '04',
    label: 'משכנתא ונדל״ן',
    href: '/real-estate',
    description: 'מחשבון משכנתא, אופטימייזר תמהיל, מס רכישה ומס שבח.',
  },
  {
    idx: '05',
    label: 'השקעות וחיסכון',
    href: '/investments',
    description: 'ריבית דריבית, תכנון פרישה, FIRE, תשואה ותקציב משפחתי.',
  },
  {
    idx: '06',
    label: 'רכב ותחבורה',
    href: '/vehicles',
    description: 'ליסינג מול קנייה, עלות דלק שנתית ושווי שימוש ברכב.',
  },
  {
    idx: '07',
    label: 'הקמת עסק',
    href: '/business',
    description: 'מדריכי פתיחת עסק לסטודיו, בית קפה, מספרה, קליניקה ועוד.',
  },
] as const;

// ============================================================
// כרטיסי הקורסים מובילים לדף המכירה של הקורס שנבחר.
// ============================================================
const COURSE_CARDS = [
  {
    id: 'cpa',
    badge: 'לעצמאים ופרילנסרים',
    name: 'הכסף של העסק בידיים שלך',
    audience: 'עצמאים / פרילנסרים',
    description:
      'מע״מ, מס הכנסה וביטוח לאומי — הסברים וכלים לניהול הכסף של העסק.',
    href: '/course/self-employed',
    featured: true,
  },
  {
    id: 'cfo',
    badge: 'לבעלי עסקים מבוססים',
    name: 'מנהל הכספים של העסק שלך',
    audience: 'בעלי עסקים מבוססים, חברות',
    description:
      'תזרים מזומנים, תקציב שנתי, הון חוזר, בנקים ואשראי — כלים לניהול כספי העסק.',
    href: '/course/business',
    featured: false,
  },
  {
    id: 'ai',
    badge: 'לאנשי כספים',
    name: 'Claude AI לאנשי כספים',
    audience: 'בעלי עסקים, מנהלי כספים, רואי חשבון',
    description:
      'לרתום את Claude לעבודה הפיננסית היומית — דוחות, מצגות, אוטומציה ודאשבורדים. מהבסיס ועד צוותי סוכנים.',
    href: '/course',
    featured: false,
  },
] as const;

export default function Home() {
  return (
    <div className="bg-cream">
      {/* ============================================================
          1. HERO
          ============================================================ */}
      <section className="relative overflow-hidden bg-cream">
        {/* רקע גריד עדין של קווים אופקיים */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.5]"
          style={{
            backgroundImage:
              'repeating-linear-gradient(to bottom, transparent, transparent 47px, rgba(16,34,25,0.05) 47px, rgba(16,34,25,0.05) 48px)',
          }}
        />
        <div className="relative mx-auto max-w-6xl px-4 py-20 md:py-28">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            {/* קופי */}
            <div>
              <span className="inline-flex items-center gap-2 border border-gold/40 px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-gold">
                ✦ מחשבונים ומדריכים פיננסיים בעברית
              </span>

              <h1 className="mt-7 text-5xl font-black leading-[1.05] md:text-6xl">
                <span className="block text-ink-deep">כל מספר פיננסי</span>
                <span className="block font-serif font-normal italic text-gold">
                  שחשוב לכם.
                </span>
              </h1>

              <p className="mt-7 max-w-lg text-lg leading-relaxed text-ink/70">
                כלים ומדריכים פיננסיים לשכר ומסים, משכנתא, זכויות עובדים,
                ביטוח לאומי, השקעות וניהול עסק. בעמודים תמצאו הסברים וקישורים
                למקורות המתאימים לנושא.
              </p>

              {/* שורת סטטים */}
              <div className="mt-7 flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-xs uppercase tracking-[0.1em] text-ink/70">
                <span>מחשבונים ומדריכים</span>
                <span className="text-gold" aria-hidden="true">✦</span>
                <span>7 קטגוריות</span>
                <span className="text-gold" aria-hidden="true">✦</span>
                <span>בעברית</span>
                <span className="text-gold" aria-hidden="true">✦</span>
                <span>הכלים חינם</span>
              </div>

              {/* כפתורים */}
              <div className="mt-9 flex flex-wrap gap-3">
                <Link
                  href="#calculators"
                  className="bg-ink px-8 py-3.5 text-sm font-medium text-cream transition hover:bg-ink-deep"
                >
                  עיין בכלים ←
                </Link>
                <Link
                  href="/course"
                  className="border border-ink/35 bg-transparent px-8 py-3.5 text-sm font-medium text-ink transition hover:bg-ink/5"
                >
                  הקורסים של FinSchool
                </Link>
              </div>
            </div>

            {/* מחשבון חי */}
            <div className="lg:ps-4">
              <HeroSalaryCalc />
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          2. CATEGORIES
          ============================================================ */}
      <section id="categories" className="scroll-mt-20 bg-cream-2 py-20 md:py-24">
        <div className="mx-auto max-w-6xl px-4">
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-gold">
            {'// '}קטגוריות
          </p>
          <h2 className="mt-3 text-3xl font-black md:text-4xl">
            שבע קטגוריות.{' '}
            <span className="font-serif font-normal italic text-gold">
              מהשכר ועד ניהול העסק.
            </span>
          </h2>

          {/* גריד 6 כרטיסים בגבול קו-שיער */}
          <div className="mt-10 grid border-t border-e border-ink/15 sm:grid-cols-2 lg:grid-cols-3">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.idx}
                href={cat.href}
                className="group flex flex-col border-b border-s border-ink/15 p-7 transition hover:bg-paper-hover"
              >
                <div className="flex items-baseline justify-between">
                  <span className="font-mono text-sm text-ink/70">{cat.idx}</span>
                </div>
                <h3 className="mt-5 text-xl font-black text-ink transition group-hover:text-gold">
                  {cat.label}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink/65">
                  {cat.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          3. ALL CALCULATORS
          ============================================================ */}
      <section id="calculators" className="scroll-mt-20 bg-cream py-20 md:py-24">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-gold">
            ✦ הספרייה המלאה ✦
          </p>
          <h2 className="mt-3 text-3xl font-black md:text-4xl">הכלים והמדריכים שלנו</h2>
          <p className="mx-auto mt-3 max-w-2xl text-ink/70">
            כלים ומדריכים מסודרים לפי נושא, בגישה חופשית וללא הרשמה.
          </p>
        </div>
        <AllCalculatorsGrid />
      </section>

      {/* ============================================================
          4. COURSES BAND
          ============================================================ */}
      <section id="courses" className="relative overflow-hidden bg-ink py-20 md:py-24">
        {/* רקע גריד עדין זהב */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.4]"
          style={{
            backgroundImage:
              'repeating-linear-gradient(to bottom, transparent, transparent 47px, rgba(216,179,106,0.07) 47px, rgba(216,179,106,0.07) 48px)',
          }}
        />
        <div className="relative mx-auto max-w-6xl px-4">
          <div className="text-center">
            <p className="font-mono text-xs uppercase tracking-[0.14em] text-gold-light">
              ✦ בית הספר הפיננסי FinSchool ✦
            </p>
            <h2 className="mx-auto mt-3 max-w-3xl text-3xl font-black leading-tight text-cream md:text-4xl">
              הכלים עוזרים להבין את המספרים.
              <br />
              <span className="font-serif font-normal italic text-gold-light">
                הקורסים מציעים לימוד מעמיק.
              </span>
            </h2>
            <p className="mx-auto mt-5 max-w-2xl leading-relaxed text-cream/70">
              שלושה מסלולי לימוד על מע״מ ומס לעצמאים, ניהול כספים לבעלי עסקים,
              ו-AI לעבודה הפיננסית. בדקו את הסילבוס, פרטי הגישה ותנאי הרכישה בכל מסלול.
            </p>
          </div>

          {/* כרטיסים עם קישור ישיר לדפי המכירה הקיימים */}
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {COURSE_CARDS.map((course) => (
              <Link
                key={course.id}
                href={course.href}
                className={`group relative flex flex-col bg-paper p-7 transition hover:bg-paper-hover ${
                  course.featured ? 'border-2 border-gold' : 'border border-ink/15'
                }`}
              >
                <span
                  className={`inline-flex w-fit items-center px-3 py-1 font-mono text-[10px] uppercase tracking-[0.12em] ${
                    course.featured
                      ? 'bg-gold text-paper'
                      : 'border border-ink/25 text-ink/70'
                  }`}
                >
                  {course.badge}
                </span>
                <h3 className="mt-5 text-xl font-black leading-snug text-ink">
                  {course.name}
                </h3>
                <p className="mt-2 text-xs font-medium text-gold">
                  למי שמתאים: {course.audience}
                </p>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-ink/70">
                  {course.description}
                </p>
                <span className="mt-6 flex items-center justify-between border-t border-ink/12 pt-4 text-sm font-medium text-ink transition group-hover:text-gold">
                  לפרטי הקורס
                  <span className="text-gold transition-transform group-hover:-translate-x-1" aria-hidden="true">
                    ←
                  </span>
                </span>
              </Link>
            ))}
          </div>

          {/* שורת מנחה */}
          <div className="mt-12 flex flex-col items-center gap-4 border-t border-cream/15 pt-10 sm:flex-row sm:items-center sm:justify-center sm:gap-5 sm:text-start">
            <Image
              src="/images/andrey-platonov.jpg"
              alt="אנדרי פלטונוב"
              width={56}
              height={56}
              className="h-14 w-14 flex-shrink-0 border border-gold-light/40 object-cover object-top"
            />
            <div className="text-center sm:text-start">
              <p className="font-bold text-cream">
                אנדרי פלטונוב — רו״ח &amp; סמנכ״ל כספים
              </p>
              <p className="mt-1 max-w-xl text-sm leading-relaxed text-cream/65">
                בוגר PwC, בעל ניסיון בניהול כספים. הקורסים בנויים על דוגמאות
                מהעבודה הפיננסית היומיומית.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          5. BOTTOM CTA
          ============================================================ */}
      <section className="bg-cream-2 py-20 md:py-24">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-gold">
            ✦ ההחלטה ✦
          </p>
          <h2 className="mt-3 text-3xl font-black leading-tight md:text-4xl">
            מהמחשבונים — עד{' '}
            <span className="font-serif font-normal italic text-gold">
              עבודה עם AI.
            </span>
          </h2>
          <p className="mx-auto mt-5 max-w-xl leading-relaxed text-ink/70">
            התחילו עם הכלים החינמיים, ותעלו רמה עם הקורסים של FinSchool — מהבנת
            המספרים ועד ללימוד ניהול כספי העסק.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Link
              href="#calculators"
              className="bg-ink px-8 py-3.5 text-sm font-medium text-cream transition hover:bg-ink-deep"
            >
              עיין בכלים ←
            </Link>
            <Link
              href="/course"
              className="bg-gold px-8 py-3.5 text-sm font-medium text-paper transition hover:bg-gold-2"
            >
              לכל הקורסים
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
