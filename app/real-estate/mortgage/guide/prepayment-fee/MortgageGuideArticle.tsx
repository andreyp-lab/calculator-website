import Link from 'next/link';
import { AuthorBox } from '@/components/calculator/AuthorBox';
import { Breadcrumbs } from '@/components/calculator/Breadcrumbs';
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';
import { FAQSchema } from '@/components/seo/FAQSchema';

const SITE_URL = 'https://cheshbonai.co.il';

export interface GuideSection { heading: string; paragraphs: string[]; bullets?: string[]; }
export interface GuideFaq { question: string; answer: string; }
export interface GuideSource { label: string; href: string; note: string; }
export interface RelatedLink { label: string; href: string; }

interface Props {
  path: string; title: string; eyebrow: string; description: string; answer: string;
  sections: GuideSection[]; faq: GuideFaq[]; sources: GuideSource[]; related: RelatedLink[];
}

export function MortgageGuideArticle({ path, title, eyebrow, description, answer, sections, faq, sources, related }: Props) {
  const articleSchema = {
    '@context': 'https://schema.org', '@type': 'Article', headline: title, description,
    inLanguage: 'he-IL', datePublished: '2026-10-24', dateModified: '2026-10-24',
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE_URL}${path}` },
    author: { '@type': 'Person', name: 'אנדרי פלטונוב', url: `${SITE_URL}/about` },
    publisher: { '@type': 'Organization', name: 'חשבונאי', url: SITE_URL },
  };
  return (
    <main className="min-h-screen bg-cream" dir="rtl">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <BreadcrumbSchema items={[
        { name: 'דף הבית', url: '/' }, { name: 'משכנתא ונדל״ן', url: '/real-estate' },
        { name: 'מחשבון משכנתא', url: '/real-estate/mortgage' }, { name: title, url: path },
      ]} />
      <FAQSchema items={faq.map(({ question, answer }) => ({ question, answer }))} />
      <article className="mx-auto max-w-4xl px-4 py-8">
        <div className="mb-6"><Breadcrumbs items={[
          { label: 'דף הבית', href: '/' }, { label: 'משכנתא ונדל״ן', href: '/real-estate' },
          { label: 'מחשבון משכנתא', href: '/real-estate/mortgage' }, { label: title },
        ]} /></div>
        <header className="mb-8 border-b border-ink/15 pb-6">
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.14em] text-gold">{'// '}{eyebrow} ✦</p>
          <h1 className="mb-4 text-3xl font-bold text-ink md:text-4xl">{title}</h1>
          <p className="text-lg leading-relaxed text-ink/75">{description}</p>
          <p className="mt-4 font-mono text-xs uppercase tracking-[0.12em] text-gold">עודכן לאחרונה: <time dateTime="2026-10-24">24.10.2026</time></p>
        </header>
        <section className="answer-box mb-10 border-r-4 border-gold bg-cream-2 p-5" aria-label="תשובה מהירה">
          <p className="leading-relaxed text-ink/85"><strong>בקצרה: </strong>{answer}</p>
        </section>
        <div className="prose prose-lg max-w-none text-ink leading-relaxed">
          {sections.map((section) => <section key={section.heading}>
            <h2>{section.heading}</h2>
            {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            {section.bullets && <ul>{section.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul>}
          </section>)}
        </div>
        <section className="my-10 border border-ink/15 bg-paper p-6">
          <h2 className="mb-4 text-2xl font-bold text-ink">להמשך בדיקה באתר</h2>
          <ul className="grid gap-3 sm:grid-cols-2">{related.map((item) => <li key={item.href}><Link className="text-gold underline" href={item.href}>{item.label}</Link></li>)}</ul>
        </section>
        <section className="mb-10">
          <h2 className="mb-5 text-2xl font-bold text-ink">שאלות נפוצות</h2>
          <div className="space-y-4">{faq.map((item) => <details key={item.question} className="border border-ink/15 bg-paper p-4">
            <summary className="cursor-pointer font-bold text-ink">{item.question}</summary><p className="mt-3 leading-relaxed text-ink/75">{item.answer}</p>
          </details>)}</div>
        </section>
        <section className="mb-10 text-sm leading-relaxed text-ink/75">
          <h2 className="mb-4 text-xl font-bold text-ink">מקורות רשמיים</h2>
          <ul className="list-disc space-y-3 pr-5">{sources.map((source) => <li key={source.href}>
            <a className="text-gold underline" href={source.href} target="_blank" rel="noopener noreferrer">{source.label} ↗</a>{' — '}{source.note}
          </li>)}</ul>
          <p className="mt-4">המקורות נבדקו ביום 24.10.2026. במקרה של שינוי בהוראה, בצו או במסמכי ההלוואה, הנוסח הרשמי והמסמכים שקיבלתם מהבנק הם הקובעים.</p>
        </section>
        <aside className="mb-10 border-r-4 border-gold bg-cream-2 p-5 text-sm leading-relaxed text-ink/75">
          <strong className="text-ink">הבהרה:</strong> מידע כללי בלבד; אינו ייעוץ משכנתאות/משפטי. אין בדף המלצה על מסלול, בנק, שיעור מימון או פעולה, ואין בו תחליף להצעה כתובה, לבדיקת ההסכם ולייעוץ מקצועי המתאים לנסיבות האישיות.
        </aside>
        <section className="mb-8"><AuthorBox /></section>
      </article>
    </main>
  );
}
