import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BUSINESS_TYPES, getBusinessType } from '@/lib/data/business-setup/business-types';
import { BusinessPlanCalculator } from '@/components/calculators/BusinessPlanCalculator';
import { FAQ } from '@/components/calculator/FAQ';
import { Breadcrumbs } from '@/components/calculator/Breadcrumbs';
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';
import { AuthorBox } from '@/components/calculator/AuthorBox';
import { ArrowLeft } from 'lucide-react';

const SITE_URL = 'https://cheshbonai.co.il';

interface PageProps {
  params: Promise<{ type: string }>;
}

export function generateStaticParams() {
  return BUSINESS_TYPES.map((b) => ({ type: b.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { type } = await params;
  const bt = getBusinessType(type);
  if (!bt) return { title: 'לא נמצא' };
  const title = `כמה עולה להקים ${bt.name}? מחשבון תוכנית עסקית 2026`;
  const description = `${bt.intro} מחשבון עלות הקמה לפי עיר ושטח + תוכנית עסקית: הוצאות חודשיות, נקודת איזון, פחת ורזרבת חידוש. עדכני 2026.`;
  return {
    title,
    description,
    alternates: { canonical: `/business/${bt.slug}` },
    openGraph: { title, description, url: `/business/${bt.slug}`, type: 'article', locale: 'he_IL' },
  };
}

export default async function BusinessGuidePage({ params }: PageProps) {
  const { type } = await params;
  const bt = getBusinessType(type);
  if (!bt) notFound();

  const faqItems = bt.faq.map((f) => ({ question: f.q, answer: f.a }));

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: bt.faq.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  return (
    <div className="min-h-screen bg-cream" dir="rtl">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <BreadcrumbSchema
        items={[
          { name: 'דף הבית', url: '/' },
          { name: 'כמה עולה להקים עסק', url: '/business' },
          { name: bt.name, url: `/business/${bt.slug}` },
        ]}
      />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Breadcrumbs
            items={[
              { label: 'דף הבית', href: '/' },
              { label: 'הקמת עסק', href: '/business' },
              { label: bt.name },
            ]}
          />
        </div>

        <header className="mb-8 pb-6 border-b border-ink/15">
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-gold mb-3">
            ✦ מחשבון עלות הקמה + תוכנית עסקית
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-ink mb-3">
            כמה עולה להקים {bt.name}? <span className="text-gold">2026</span>
          </h1>
          <p className="text-lg text-ink/70 leading-relaxed">{bt.intro}</p>
        </header>

        {/* Quick answer */}
        <section className="answer-box bg-cream-2 border-r-4 border-gold p-5 mb-8" aria-label="תשובה מהירה">
          <p className="text-lg text-ink leading-relaxed">{bt.faq[0].a}</p>
        </section>

        {/* Calculator */}
        <section className="mb-12">
          <BusinessPlanCalculator businessSlug={bt.slug} />
        </section>

        {/* Guide */}
        <section className="prose prose-lg max-w-none mb-12 text-ink leading-relaxed">
          <h2>המדריך: איך מקימים {bt.name} נכון</h2>
          {bt.guide.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
          <h3>אל תשכחו את הפחת ורזרבת החידוש</h3>
          <p>
            רוב מי שמקים עסק מתמקד בעלות ההקמה ובהוצאות החודשיות — ושוכח שהציוד והשיפוץ{' '}
            <strong>מתבלים ויצטרכו חידוש</strong>. אם לא מפרישים כל חודש סכום לרזרבה, העסק ייראה רווחי
            על הנייר — אבל בעוד כמה שנים, כשצריך לחדש את הסטודיו או להחליף ציוד, לא יהיה מאיפה. המחשבון
            למעלה מחשב את הפחת החודשי ואת הרזרבה המומלצת, ומציג את הרווח <em>האמיתי</em> — אחרי ההפרשה.
          </p>
        </section>

        {/* Course CTA — CFO course */}
        <aside className="my-12 bg-ink border border-gold-light/30 p-6 sm:p-8 text-cream">
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-gold-light mb-3">
            // קורס דיגיטלי לבעלי עסקים · בהדרכת רו״ח ✦
          </p>
          <p className="font-serif text-xl sm:text-2xl mb-3 leading-snug text-cream">
            תוכנית עסקית זה רק ההתחלה. תלמד לנהל את הכסף לאורך זמן.
          </p>
          <p className="text-sm sm:text-base text-cream/70 leading-relaxed mb-5 max-w-2xl">
            תזרים מזומנים, תקציב, הון חוזר, פחת ורזרבות, ועבודה מול הבנק — כל מה שצריך כדי שהעסק החדש
            שלך לא רק ייפתח, אלא יחזיק ויצמח. עם כלי Excel מוכנים, בהדרכת רו"ח אנדרי פלטונוב.
          </p>
          <Link
            href="/course/business"
            className="inline-block bg-gold px-8 py-3.5 text-sm font-bold text-paper transition hover:bg-gold-2"
          >
            לקורס "מנהל הכספים של העסק שלך" ←
          </Link>
        </aside>

        {/* FAQ */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-ink mb-6">שאלות נפוצות — הקמת {bt.name}</h2>
          <FAQ items={faqItems} />
        </section>

        {/* Internal links */}
        <section className="mb-12">
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-gold mb-3">✦ כלים ומדריכים רלוונטיים</p>
          <ul className="grid sm:grid-cols-2 gap-3">
            {[
              { href: '/self-employed/opening-business', label: 'מדריך פתיחת עסק — עוסק פטור או מורשה?' },
              { href: '/self-employed/business-finance', label: 'ניהול כספים לעסק קטן' },
              { href: '/self-employed/employer-cost', label: 'מחשבון עלות מעסיק (לשכירת עובדים)' },
              { href: '/self-employed/vat', label: 'מחשבון מע"מ' },
            ].map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="group flex items-center justify-between gap-2 bg-paper border border-ink/15 hover:bg-paper-hover p-4 transition"
                >
                  <span className="text-ink font-medium">{l.label}</span>
                  <ArrowLeft className="w-4 h-4 text-gold opacity-0 group-hover:opacity-100 transition" />
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-8">
          <AuthorBox />
        </section>
      </div>
    </div>
  );
}
