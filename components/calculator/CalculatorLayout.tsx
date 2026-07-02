import { ReactNode } from 'react';
import { Breadcrumbs, Breadcrumb } from './Breadcrumbs';
import { DisclaimerBox } from './DisclaimerBox';
import { AuthorBox } from './AuthorBox';
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';
import { CalculatorSchemaClient } from '@/components/seo/CalculatorSchemaClient';
import { RelatedCalculators } from './RelatedCalculators';
import { CourseCTA } from '@/components/marketing/CourseCTA';

const SITE_URL = 'https://cheshbonai.co.il'; // used for breadcrumb schema fallback

interface CalculatorLayoutProps {
  title: string;
  description: string;
  breadcrumbs: Breadcrumb[];
  lastUpdated?: string;
  calculator: ReactNode;
  content?: ReactNode;
  faq?: ReactNode;
  sources?: ReactNode;
  /** URL עמוד המחשבון (נתיב יחסי כגון /personal-tax/income-tax). אם לא סופק – נגזר מ-breadcrumbs. */
  pageUrl?: string;
}

export function CalculatorLayout({
  title,
  description,
  breadcrumbs,
  lastUpdated,
  calculator,
  content,
  faq,
  sources,
  pageUrl,
}: CalculatorLayoutProps) {
  // בנה BreadcrumbList items מה-breadcrumbs הקיימים
  const breadcrumbSchemaItems = breadcrumbs.map((b) => ({
    name: b.label,
    url: b.href ?? SITE_URL,
  }));

  // נתיב הדף הנוכחי לצורך "מחשבונים קשורים": pageUrl, או ה-href האחרון ב-breadcrumbs
  const currentPath =
    pageUrl ?? [...breadcrumbs].reverse().find((b) => b.href)?.href ?? undefined;

  return (
    <article className="bg-cream">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <div className="mb-6">
          <Breadcrumbs items={breadcrumbs} />
        </div>

        {/* Header */}
        <header className="mb-8 pb-6 border-b border-ink/15">
          <h1 className="text-3xl md:text-4xl font-bold text-ink mb-3">{title}</h1>
          <p className="text-lg text-ink/65 leading-relaxed">{description}</p>
          {lastUpdated && (
            <p className="font-mono text-xs uppercase tracking-[0.12em] text-gold mt-4">
              עודכן לאחרונה: <time dateTime={lastUpdated}>{lastUpdated}</time>
            </p>
          )}
        </header>

        {/* Calculator (above the fold) */}
        <section className="mb-12">{calculator}</section>

        {/* Disclaimer */}
        <div className="mb-8">
          <DisclaimerBox />
        </div>

        {/* קידום קורסי FinSchool — מיד אחרי התוצאה והדיסקליימר, לפני התוכן */}
        <CourseCTA />

        {/* Content */}
        {content && (
          <section className="prose prose-lg max-w-none mb-12 text-ink leading-relaxed">
            {content}
          </section>
        )}

        {/* FAQ */}
        {faq && (
          <section className="mb-12">
            <h2 className="text-2xl text-ink mb-6">שאלות נפוצות</h2>
            {faq}
          </section>
        )}

        {/* Sources */}
        {sources && (
          <section className="mb-12">
            <h2 className="text-2xl text-ink mb-4">מקורות וקישורים רשמיים</h2>
            {sources}
          </section>
        )}

        {/* Related calculators — internal linking */}
        <RelatedCalculators currentPath={currentPath} />

        {/* Author */}
        <section className="mb-8">
          <AuthorBox />
        </section>
      </div>

      {/* SEO Schemas – BreadcrumbList + SoftwareApplication */}
      <BreadcrumbSchema items={breadcrumbSchemaItems} />
      <CalculatorSchemaClient
        name={title}
        description={description}
        urlOverride={pageUrl}
      />
    </article>
  );
}
