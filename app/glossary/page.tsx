import type { Metadata } from 'next';
import Link from 'next/link';
import { GlossaryClient } from './GlossaryClient';
import { ALL_TERMS, HEBREW_ALPHABET } from '@/lib/data/glossary';

export const metadata: Metadata = {
  title: 'מילון מונחים פיננסי 2026 — כל המונחים בעברית פשוטה',
  description:
    'מילון מונחים פיננסיים מקיף לשנת 2026: 80+ מושגים מעולם המס, ההשקעות, המשכנתאות והעצמאיים. הגדרה ברורה + לינק למחשבון רלוונטי.',
  alternates: { canonical: '/glossary' },
  openGraph: {
    title: 'מילון מונחים פיננסי 2026 — כל המונחים בעברית פשוטה',
    description:
      'מילון מונחים פיננסיים מקיף: 80+ מושגים חשובים מעולם המס, ההשקעות, המשכנתאות והעצמאיים.',
    type: 'website',
    locale: 'he_IL',
  },
};


export default function GlossaryPage() {
  return (
    <div className="min-h-screen bg-paper" dir="rtl">
      {/* Schema.org */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'DefinedTermSet',
            name: 'מילון מונחים פיננסיים',
            description: 'מילון מונחים פיננסיים מקיף: 80+ מושגים חשובים מעולם המס, ההשקעות, המשכנתאות והעצמאיים.',
            url: 'https://cheshbonai.co.il/glossary',
            inLanguage: 'he',
          }),
        }}
      />

      {/* Hero */}
      <div className="bg-ink text-cream py-14 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-sm text-cream/70 mb-3">
            <Link href="/" className="hover:text-cream">דף הבית</Link>
            {' › '}
            <span>מילון מונחים</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            מילון מונחים פיננסיים
          </h1>
          <p className="text-lg text-cream/80 max-w-2xl mx-auto mb-4">
            80+ מונחים מעולם המס, המשכנתאות, ההשקעות וזכויות העובד – הגדרה ברורה בעברית פשוטה,
            עם לינק למחשבון הרלוונטי.
          </p>
          <div className="flex flex-wrap gap-4 justify-center text-sm text-cream/60">
            <span>📚 {ALL_TERMS.length} מונחים</span>
            <span>🔍 חיפוש ואינדקס אלפביתי</span>
            <span>📅 מעודכן מאי 2026</span>
          </div>
        </div>
      </div>

      {/* Quick links to pillar pages */}
      <div className="bg-cream-2 border-b border-ink/15 py-4 px-4">
        <div className="max-w-4xl mx-auto flex flex-wrap gap-3 justify-center text-sm">
          <span className="text-ink/60">מדריכים מלאים:</span>
          <Link href="/guides/mortgage-complete-guide-2026" className="text-gold hover:text-gold-2 underline">
            מדריך משכנתא שלם
          </Link>
          <Link href="/guides/taxes-complete-guide-2026" className="text-gold hover:text-gold-2 underline">
            מדריך מסים שלם
          </Link>
          <Link href="/guides/employee-rights-complete-guide" className="text-gold hover:text-gold-2 underline">
            מדריך זכויות עובדים
          </Link>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-5xl mx-auto px-4 py-10">
        <GlossaryClient terms={ALL_TERMS} letters={HEBREW_ALPHABET} />
      </div>
    </div>
  );
}
