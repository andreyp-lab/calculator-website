import { withPageSocialMetadata } from '@/lib/config/site-info';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CalculatorLayout } from '@/components/calculator/CalculatorLayout';
import { FAQ } from '@/components/calculator/FAQ';
import { EverydayCalculator } from '@/components/calculators/EverydayCalculator';
import { EVERYDAY_GROUP_LABELS, EVERYDAY_PAGES, getEverydayPage } from '@/lib/data/everyday-pages';

export function generateStaticParams() {
  return EVERYDAY_PAGES.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const page = getEverydayPage(slug);
  if (!page) return {};
  return withPageSocialMetadata({
    title: page.title,
    description: page.description,
    alternates: { canonical: `/calc/${page.slug}` },
  });
}

export default async function EverydayPageRoute({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = getEverydayPage(slug);
  if (!page) notFound();
  const related = EVERYDAY_PAGES.filter((p) => p.group === page.group && p.slug !== page.slug).slice(0, 8);
  return (
    <CalculatorLayout
      pageUrl={`/calc/${page.slug}`}
      title={page.h1}
      description={page.description}
      breadcrumbs={[
        { label: 'דף הבית', href: '/' },
        { label: 'מחשבונים יומיומיים', href: '/calc' },
        { label: page.h1 },
      ]}
      lastUpdated="2026-11-20"
      quickAnswer={<p>{page.quickAnswer}</p>}
      calculator={<EverydayCalculator section={page.section} />}
      content={
        <>
          {page.group === 'health' && (
            <p>
              המחשבון נותן הערכה כללית לפי נוסחאות מקובלות ואינו ייעוץ רפואי. לשאלות בריאותיות פנו לרופא/ה או לדיאטן/ית.
            </p>
          )}
          {page.links.length > 0 && (
            <>
              <h2>כלים קשורים</h2>
              <ul>
                {page.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href}>{l.label}</Link>
                  </li>
                ))}
              </ul>
            </>
          )}
          {related.length > 0 && (
            <>
              <h2>עוד: {EVERYDAY_GROUP_LABELS[page.group]}</h2>
              <ul>
                {related.map((p) => (
                  <li key={p.slug}>
                    <Link href={`/calc/${p.slug}`}>{p.h1}</Link>
                  </li>
                ))}
              </ul>
            </>
          )}
        </>
      }
      faq={<FAQ items={page.faq} />}
    />
  );
}
