import Link from 'next/link';

interface OfficialBenefitPageProps {
  title: string;
  description: string;
  sourceUrl: string;
  sourceLabel: string;
  details: string[];
  related?: { href: string; label: string }[];
}

/** A source-first page for benefits whose personal entitlement cannot be calculated from the available inputs. */
export function OfficialBenefitPage({ title, description, sourceUrl, sourceLabel, details, related = [] }: OfficialBenefitPageProps) {
  return (
    <main dir="rtl" className="mx-auto max-w-4xl px-5 py-12 text-ink">
      <nav aria-label="פירורי לחם" className="mb-8 text-sm text-ink/60">
        <Link href="/">דף הבית</Link> / <Link href="/employee-rights">זכויות עובדים</Link>
      </nav>
      <h1 className="mb-5 text-3xl font-bold md:text-4xl">{title}</h1>
      <p className="mb-7 text-lg leading-relaxed">{description}</p>
      <div className="border-r-4 border-gold bg-cream-2 p-6">
        <h2 className="mb-3 text-xl font-bold">בדיקה אישית במקור הרשמי</h2>
        <p className="mb-5 leading-relaxed">הסכום והזכאות תלויים בנתונים האישיים ובתקופת הזכאות. לבדיקת סכום מעודכן השתמשו בשירות הרשמי של הרשות המטפלת.</p>
        <a href={sourceUrl} target="_blank" rel="noopener noreferrer" className="inline-block bg-ink px-6 py-3 font-semibold text-cream hover:bg-ink-deep">{sourceLabel} ↗</a>
      </div>
      <h2 className="mb-4 mt-10 text-2xl font-bold">מה כדאי להכין לבדיקה?</h2>
      <ul className="list-disc space-y-3 pr-6 leading-relaxed">{details.map((detail) => <li key={detail}>{detail}</li>)}</ul>
      {related.length > 0 && <div className="mt-10 flex flex-wrap gap-4">{related.map(({ href, label }) => <Link key={href} href={href} className="font-semibold text-gold underline underline-offset-4">{label}</Link>)}</div>}
    </main>
  );
}
