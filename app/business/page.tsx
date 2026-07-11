import type { Metadata } from 'next';
import Link from 'next/link';
import { BUSINESS_TYPES } from '@/lib/data/business-setup/business-types';
import { Breadcrumbs } from '@/components/calculator/Breadcrumbs';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'כמה עולה להקים עסק? מחשבוני עלות הקמה ותוכנית עסקית 2026',
  description:
    'כמה עולה להקים סטודיו, בית קפה, מספרה, חדר כושר או קליניקה? מחשבוני עלות הקמה + תוכנית עסקית לפי עיר ושטח — הקמה, הוצאות חודשיות, נקודת איזון ורזרבת חידוש. 2026.',
  alternates: { canonical: '/business' },
};

export default function BusinessHubPage() {
  return (
    <div className="min-h-screen bg-cream" dir="rtl">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Breadcrumbs items={[{ label: 'דף הבית', href: '/' }, { label: 'הקמת עסק' }]} />
        </div>

        <div className="bg-ink-deep border border-cream/15 p-6 md:p-10 text-cream mb-8">
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-gold-light mb-3">
            // מחשבוני הקמת עסק ✦
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-cream mb-3">כמה עולה להקים עסק?</h1>
          <p className="text-cream/70 text-lg mb-0">
            בחרו סוג עסק וקבלו תוכנית עסקית מלאה: עלות הקמה לפי עיר ושטח, הוצאות חודשיות, נקודת איזון,
            פחת ורזרבת חידוש — כמה באמת צריך כדי לפתוח ולהחזיק.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {BUSINESS_TYPES.map((bt) => (
            <Link
              key={bt.slug}
              href={`/business/${bt.slug}`}
              className="group bg-paper border border-ink/15 hover:bg-paper-hover transition p-6 flex flex-col"
            >
              <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-gold mb-2">{bt.category}</p>
              <h2 className="font-bold text-ink text-lg mb-1 group-hover:text-gold transition">
                כמה עולה להקים {bt.name}?
              </h2>
              <p className="text-sm text-ink/60 flex-1">{bt.intro}</p>
              <span className="mt-4 flex items-center gap-1 text-xs font-mono uppercase tracking-[0.1em] text-gold">
                למחשבון <ArrowLeft className="w-3.5 h-3.5" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
