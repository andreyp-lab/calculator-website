import { withPageSocialMetadata } from '@/lib/config/site-info';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/calculator/Breadcrumbs';
import { EVERYDAY_GROUP_LABELS, EVERYDAY_PAGES, type EverydayGroup } from '@/lib/data/everyday-pages';

export const metadata: Metadata = withPageSocialMetadata({
  title: 'מחשבונים יומיומיים — אחוזים, יחידות, תאריכים, בריאות ועוד',
  description: 'אחוזים, הנחה, טיפ, המרת יחידות, שטח ונפח, הפרש תאריכים, גיל, תאריך עברי, BMI, קלוריות, שינה, הריון ועוד.',
  alternates: { canonical: '/calc' },
});

export default function CalcHubPage() {
  const groups = Object.keys(EVERYDAY_GROUP_LABELS) as EverydayGroup[];
  return (
    <main dir="rtl" className="mx-auto max-w-4xl px-5 py-12 text-ink">
      <Breadcrumbs items={[{ label: 'דף הבית', href: '/' }, { label: 'מחשבונים יומיומיים' }]} />
      <h1 className="my-6 text-3xl font-bold">מחשבונים יומיומיים</h1>
      <p className="mb-8 text-lg leading-relaxed text-ink/75">
        כלים קצרים לחישובים של כל יום. למחשבונים פיננסיים ומשפטיים מעמיקים ראו את <Link className="text-gold underline" href="/">דף הבית</Link>.
      </p>
      {groups.map((g) => (
        <section key={g} className="mb-8">
          <h2 className="mb-3 text-2xl font-bold">{EVERYDAY_GROUP_LABELS[g]}</h2>
          <ul className="grid gap-2 sm:grid-cols-2">
            {EVERYDAY_PAGES.filter((p) => p.group === g).map((p) => (
              <li key={p.slug}>
                <Link href={`/calc/${p.slug}`} className="block border border-ink/15 bg-paper p-3 hover:border-gold">
                  <span className="font-bold">{p.h1}</span>
                  <span className="mt-1 block text-sm text-ink/70">{p.description}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </main>
  );
}
