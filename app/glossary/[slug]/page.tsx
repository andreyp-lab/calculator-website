import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ALL_TERMS, getTermBySlug, getRelatedTerms } from '@/lib/data/glossary';

const SITE_URL = 'https://cheshbonai.co.il';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return ALL_TERMS.map((t) => ({ slug: t.id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const term = getTermBySlug(slug);
  if (!term) {
    return { title: 'מונח לא נמצא' };
  }
  const cleanDef = term.definition.replace(/\s+/g, ' ').trim();
  const description =
    cleanDef.length > 158 ? cleanDef.slice(0, 155).trimEnd() + '…' : cleanDef;

  // מונחים דקים (הגדרה מתחת ל-60 מילים) הם thin-content ששורף crawl budget
  // ומדלל סמכות → noindex,follow מסיר אותם מהאינדקס אך שומר על מעבר link-equity
  // למחשבונים (seeAlso). מונח שיורחב ל-60+ מילים יחזור אוטומטית לאינדוקס.
  const wordCount = cleanDef.split(/\s+/).filter(Boolean).length;
  const isThin = wordCount < 60;

  return {
    title: `${term.term} – מה זה? הסבר והגדרה | מילון פיננסי 2026`,
    description,
    alternates: { canonical: `/glossary/${term.id}` },
    robots: isThin ? { index: false, follow: true } : undefined,
    openGraph: {
      title: `${term.term} – הגדרה והסבר`,
      description,
      type: 'article',
      locale: 'he_IL',
    },
  };
}

export default async function GlossaryTermPage({ params }: PageProps) {
  const { slug } = await params;
  const term = getTermBySlug(slug);
  if (!term) notFound();

  const related = getRelatedTerms(slug);

  const definedTermSchema = {
    '@context': 'https://schema.org',
    '@type': 'DefinedTerm',
    name: term.term,
    description: term.definition,
    inLanguage: 'he',
    url: `${SITE_URL}/glossary/${term.id}`,
    inDefinedTermSet: {
      '@type': 'DefinedTermSet',
      name: 'מילון מונחים פיננסיים – חשבונאי',
      url: `${SITE_URL}/glossary`,
    },
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'דף הבית', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'מילון מונחים', item: `${SITE_URL}/glossary` },
      { '@type': 'ListItem', position: 3, name: term.term, item: `${SITE_URL}/glossary/${term.id}` },
    ],
  };

  return (
    <div className="min-h-screen bg-paper" dir="rtl">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(definedTermSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <article className="max-w-3xl mx-auto px-4 py-10">
        {/* Breadcrumbs */}
        <nav className="text-sm text-ink/60 mb-6" aria-label="breadcrumb">
          <Link href="/" className="hover:text-gold">דף הבית</Link>
          {' › '}
          <Link href="/glossary" className="hover:text-gold">מילון מונחים</Link>
          {' › '}
          <span className="text-ink/70">{term.term}</span>
        </nav>

        {/* Header */}
        <header className="mb-6">
          <span className="inline-block bg-cream-2 text-gold text-sm font-bold rounded-none px-3 py-1 mb-3">
            מונח פיננסי · אות {term.letter}
          </span>
          <h1 className="text-3xl md:text-4xl font-bold text-ink mb-4">
            {term.term} — מה זה?
          </h1>
        </header>

        {/* Definition */}
        <div className="bg-cream-2 border-r-4 border-gold rounded-none p-5 mb-8">
          <p className="text-lg text-ink leading-relaxed">{term.definition}</p>
        </div>

        {/* Related calculators (seeAlso) */}
        {term.seeAlso && term.seeAlso.length > 0 && (
          <section className="mb-10">
            <h2 className="text-xl font-bold text-ink mb-4">כלים ומדריכים רלוונטיים</h2>
            <div className="flex flex-wrap gap-3">
              {term.seeAlso.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="inline-flex items-center gap-2 bg-ink text-cream px-4 py-2.5 rounded-none font-medium hover:bg-ink-deep transition"
                >
                  {link.label}
                  <span aria-hidden>←</span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Related terms */}
        {related.length > 0 && (
          <section className="mb-10">
            <h2 className="text-xl font-bold text-ink mb-4">מונחים קשורים</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {related.map((t) => (
                <Link
                  key={t.id}
                  href={`/glossary/${t.id}`}
                  className="block border border-ink/15 rounded-none p-4 hover:border-gold hover:shadow-sm transition"
                >
                  <span className="font-bold text-ink">{t.term}</span>
                  <span className="block text-sm text-ink/60 mt-1 line-clamp-2">
                    {t.definition}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Back to glossary */}
        <div className="border-t border-ink/15 pt-6">
          <Link href="/glossary" className="text-gold hover:text-gold-2 font-medium">
            ← חזרה למילון המונחים המלא
          </Link>
        </div>
      </article>
    </div>
  );
}
