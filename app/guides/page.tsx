import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: { absolute: 'מדריכים פיננסיים מקיפים 2026 — מסים, משכנתא וזכויות עובדים' },
  description:
    'מדריכים בנושאי מסים, משכנתא, זכויות עובדים ותלוש שכר, עם הסברים וקישורים לכלים רלוונטיים.',
  alternates: { canonical: '/guides' },
};

const guides = [
  {
    href: '/guides/taxes-complete-guide-2026',
    title: 'מדריך מסים בישראל 2026',
    description:
      'מס הכנסה, ביטוח לאומי, מע"מ, מס שבח, מס רכישה ומיסוי השקעות — נושאים מרכזיים וכללי בדיקה.',
    icon: '🧾',
    tag: 'מיסוי',
  },
  {
    href: '/guides/mortgage-complete-guide-2026',
    title: 'מדריך משכנתא בישראל 2026',
    description:
      'מסלולי משכנתא, ריביות, יחס החזר, הון עצמי ומחזור משכנתא — נושאים לבדיקה לפני חתימה.',
    icon: '🏠',
    tag: 'נדל"ן',
  },
  {
    href: '/guides/employee-rights-complete-guide',
    title: 'מדריך זכויות עובדים בישראל 2026',
    description:
      'פיצויי פיטורים, דמי אבטלה, דמי לידה, חופשה שנתית, הבראה ופנסיה — הסברים וקישורים לכלים רלוונטיים.',
    icon: '👷',
    tag: 'עבודה',
  },
  {
    href: '/salaried/payslip-guide',
    title: 'איך קוראים תלוש שכר',
    description:
      'הסברים על ברוטו, נטו, שווי שימוש, הפרשות מעסיק וניכויים בתלוש.',
    icon: '📄',
    tag: 'שכירים',
  },
];

export default function GuidesPage() {
  return (
    <div className="min-h-screen bg-cream">
      <div className="max-w-4xl mx-auto px-4 py-10">
        <nav className="text-sm text-ink/70 mb-6" aria-label="breadcrumbs">
          <Link href="/" className="hover:text-gold transition">
            דף הבית
          </Link>
          <span className="mx-2">‹</span>
          <span>מדריכים</span>
        </nav>

        {/* Hero */}
        <div className="bg-ink-deep border border-cream/15 p-6 md:p-8 text-cream mb-8">
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-gold-light mb-3">
            {'// '}מדריכים פיננסיים ✦
          </p>
          <h1 className="text-3xl font-bold mb-3 text-cream">מדריכים פיננסיים מקיפים</h1>
          <p className="text-cream/70 max-w-2xl">
            מדריכים בעברית על נושאים פיננסיים מרכזיים, עם קישורים לכלים ולמקורות נוספים.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {guides.map((g) => (
            <Link
              key={g.href}
              href={g.href}
              className="group block bg-paper border border-ink/15 hover:bg-paper-hover hover:border-ink/25 p-6 transition"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl" aria-hidden>
                  {g.icon}
                </span>
                <span className="font-mono text-xs uppercase tracking-[0.14em] text-gold border border-gold/30 px-3 py-1">
                  {g.tag}
                </span>
              </div>
              <h2 className="text-lg font-bold mb-2 text-ink group-hover:text-gold transition">{g.title}</h2>
              <p className="text-sm text-ink/70 leading-relaxed">{g.description}</p>
            </Link>
          ))}
        </div>

        <div className="mt-10 bg-cream-2 border border-ink/15 p-6">
          <h2 className="text-lg font-bold text-ink mb-2 flex items-center gap-2">
            <span className="text-gold">✦</span>
            מחפשים נושא ספציפי?
          </h2>
          <p className="text-sm text-ink/70">
            כל המחשבונים מסודרים לפי נושאים בעמוד{' '}
            <Link href="/topics" className="text-gold hover:text-gold-2 underline transition">
              הנושאים
            </Link>
            , ומונחים מקצועיים מוסברים ב
            <Link href="/glossary" className="text-gold hover:text-gold-2 underline transition">
              מילון המונחים
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
