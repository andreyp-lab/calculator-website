import { withPageSocialMetadata } from '@/lib/config/site-info';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CalculatorLayout } from '@/components/calculator/CalculatorLayout';
import { FAQ } from '@/components/calculator/FAQ';
import { ArnonaCalculator } from '@/components/calculators/ArnonaCalculator';
import { calculateArnona } from '@/lib/calculators/arnona';
import { ARNONA_CITY_PAGES, describeRate, getArnonaCityPage } from '@/lib/data/arnona-city-pages';

export function generateStaticParams() {
  return ARNONA_CITY_PAGES.map((c) => ({ city: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ city: string }> }): Promise<Metadata> {
  const page = getArnonaCityPage((await params).city);
  if (!page) return {};
  return withPageSocialMetadata({
    title: `ארנונה ב${page.name} ${page.current.year} — תעריפים לפי אזור, מחשבון והנחות`,
    description: `כמה עולה ארנונה ב${page.name}: תעריף למ״ר לפי אזור וסוג בניין לפי צו הארנונה ${page.current.year}, מחשבון חודשי ושנתי, והנחות לזכאים. הנתונים מהצו הרשמי של העירייה.`,
    alternates: { canonical: `/real-estate/arnona/${page.slug}` },
  });
}

const money = (v: number) => `${v.toLocaleString('he-IL', { maximumFractionDigits: 2 })} ₪`;

export default async function ArnonaCityRoute({ params }: { params: Promise<{ city: string }> }) {
  const page = getArnonaCityPage((await params).city);
  if (!page) notFound();
  const c = page.current;
  const zone = c.zones[0];
  const classId = c.classes?.[0]?.id;
  const rate = zone.rateByClass && classId ? zone.rateByClass[classId] : zone.rate!;
  const AREA = 100;
  const ex = calculateArnona({ areaSqm: AREA, zone: rate })!;
  const others = ARNONA_CITY_PAGES.filter((x) => x.slug !== page.slug);

  const faqItems = [
    {
      question: `כמה עולה ארנונה ב${page.name}?`,
      answer: `לפי צו הארנונה ${c.year}, דירה של ${AREA} מ״ר ב${zone.label}${c.classes ? ` (${c.classes[0].label.split('—')[0].trim()})` : ''} עולה ${money(ex.annual)} בשנה, כלומר ${money(ex.monthly)} בחודש. הסכום בפועל תלוי באזור, בסוג הבניין ובשטח המחויב.`,
    },
    {
      question: `איך יודעים באיזה אזור ב${page.name} הנכס נמצא?`,
      answer: c.notes?.find((n) => n.includes('אזור')) ?? 'אזור המס מופיע בחשבון הארנונה האחרון ובמפת האזורים או ברשימת הרחובות של העירייה.',
    },
    {
      question: `אילו הנחות בארנונה יש ב${page.name}?`,
      answer: c.discounts && c.discounts.length > 0
        ? `בין ההנחות בצו: ${c.discounts.slice(0, 4).map((d) => `${d.label} (${d.percent}%${d.maxSqm ? `, עד ${d.maxSqm} מ״ר` : ''})`).join('; ')}. הרשימה המלאה והתנאים בצו העירייה.`
        : 'ההנחות מפורטות בצו הארנונה של העירייה.',
    },
    {
      question: 'האם הסכום מחייב?',
      answer: 'לא. זה אומדן לפי תעריפי הצו. החיוב נקבע לפי הסיווג והשטח המחויב שרשומים בעירייה.',
    },
  ];

  return (
    <CalculatorLayout
      pageUrl={`/real-estate/arnona/${page.slug}`}
      title={`ארנונה ב${page.name} ${c.year}`}
      description={`תעריפי ארנונה למגורים ב${page.name} לפי אזור וסוג בניין, מחשבון והנחות — מצו הארנונה הרשמי.`}
      breadcrumbs={[
        { label: 'דף הבית', href: '/' },
        { label: 'נדל״ן', href: '/real-estate' },
        { label: 'ארנונה', href: '/real-estate/arnona' },
        { label: page.name },
      ]}
      lastUpdated={c.verifiedAt}
      quickAnswer={
        <p>
          ארנונה ב{page.name} = שטח × תעריף למ״ר לשנה לפי אזור וסוג בניין בצו {c.year}. למשל, דירה של {AREA} מ״ר ב
          {zone.label} משלמת {money(ex.annual)} בשנה, כ־{money(ex.monthly)} בחודש. בחרו אזור, סוג בניין ושטח במחשבון
          לתוצאה לנכס שלכם.
        </p>
      }
      calculator={<ArnonaCalculator initialCityId={c.id} heading={`מחשבון ארנונה ב${page.name}`} />}
      content={
        <>
          <h2>תעריפי הארנונה ב{page.name} — צו {c.year}</h2>
          <p>
            התעריפים בש״ח למ״ר לשנה. {c.classHelp ?? ''}
          </p>
          <div className="overflow-x-auto">
            <table>
              <thead>
                <tr>
                  <th scope="col">אזור</th>
                  {c.classes ? <th scope="col">סוג בניין</th> : null}
                  <th scope="col">תעריף (₪ למ״ר לשנה)</th>
                </tr>
              </thead>
              <tbody>
                {c.zones.flatMap((z) =>
                  z.rateByClass && c.classes
                    ? c.classes
                        .filter((k) => z.rateByClass![k.id])
                        .map((k) => (
                          <tr key={`${z.id}-${k.id}`}>
                            <th scope="row">{z.label}</th>
                            <td>{k.label.split('—')[0].trim()}</td>
                            <td>{describeRate(z.rateByClass![k.id])}</td>
                          </tr>
                        ))
                    : [
                        <tr key={z.id}>
                          <th scope="row">{z.label}</th>
                          <td>{describeRate(z.rate!)}</td>
                        </tr>,
                      ],
                )}
              </tbody>
            </table>
          </div>

          {c.discounts && c.discounts.length > 0 && (
            <>
              <h2>הנחות בארנונה ב{page.name}</h2>
              <ul>
                {c.discounts.map((d) => (
                  <li key={d.id}>
                    <strong>{d.label}:</strong> {d.percent}%{d.maxSqm ? ` על עד ${d.maxSqm} מ״ר` : ''}. {d.conditions}
                  </li>
                ))}
              </ul>
              <p>
                הנחה לפי הכנסה: <Link href="/real-estate/arnona-discount">מחשבון הנחה בארנונה לפי הכנסה</Link>.
              </p>
            </>
          )}

          {c.notes && c.notes.length > 0 && (
            <>
              <h2>מה כדאי לדעת</h2>
              <ul>
                {c.notes.map((n) => (
                  <li key={n}>{n}</li>
                ))}
              </ul>
            </>
          )}

          {page.upcoming && (
            <p>
              צו {page.upcoming.year} אושר במועצת העירייה וממתין לאישור השרים. התעריפים שלו זמינים במחשבון הכללי של{' '}
              <Link href="/real-estate/arnona">ארנונה</Link> (סימון &quot;הצג גם צווי 2027&quot;).
            </p>
          )}
          {page.businessCityId && (
            <p>
              בעלי עסקים: <Link href="/real-estate/arnona-business">ארנונה לעסקים ב{page.name}</Link>.
            </p>
          )}

          <h2>ערים נוספות</h2>
          <ul>
            {others.map((o) => (
              <li key={o.slug}>
                <Link href={`/real-estate/arnona/${o.slug}`}>ארנונה ב{o.name}</Link>
              </li>
            ))}
          </ul>
        </>
      }
      faq={<FAQ items={faqItems} />}
      sources={
        <ul>
          <li>
            <a href={c.sourceUrl} target="_blank" rel="noopener noreferrer">
              {c.sourceLabel}
            </a>{' '}
            (אומת {c.verifiedAt})
          </li>
        </ul>
      }
    />
  );
}
