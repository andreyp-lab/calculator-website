import type { Metadata } from 'next';
import Link from 'next/link';
import { GlossaryClient } from './GlossaryClient';
import { ALL_TERMS, HEBREW_ALPHABET } from '@/lib/data/glossary';

export const metadata: Metadata = {
  title: 'מילון מונחים פיננסיים 2026 – הגדרות בעברית פשוטה',
  description:
    'מילון מונחים פיננסיים מקיף לשנת 2026: 80+ מושגים מעולם המס, ההשקעות, המשכנתאות והעצמאיים. הגדרה ברורה + לינק למחשבון רלוונטי.',
  alternates: { canonical: '/glossary' },
  openGraph: {
    title: 'מילון מונחים פיננסיים 2026 – הגדרות בעברית פשוטה',
    description:
      'מילון מונחים פיננסיים מקיף: 80+ מושגים חשובים מעולם המס, ההשקעות, המשכנתאות והעצמאיים.',
    type: 'website',
    locale: 'he_IL',
  },
};


export default function GlossaryPage() {
  return (
    <div className="min-h-screen bg-white" dir="rtl">
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
      <div className="bg-gradient-to-bl from-gray-900 via-slate-700 to-slate-500 text-white py-14 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-sm text-gray-300 mb-3">
            <Link href="/" className="hover:text-white">דף הבית</Link>
            {' › '}
            <span>מילון מונחים</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            מילון מונחים פיננסיים
          </h1>
          <p className="text-lg text-gray-200 max-w-2xl mx-auto mb-4">
            80+ מונחים מעולם המס, המשכנתאות, ההשקעות וזכויות העובד – הגדרה ברורה בעברית פשוטה,
            עם לינק למחשבון הרלוונטי.
          </p>
          <div className="flex flex-wrap gap-4 justify-center text-sm text-gray-300">
            <span>📚 {ALL_TERMS.length} מונחים</span>
            <span>🔍 חיפוש ואינדקס אלפביתי</span>
            <span>📅 מעודכן מאי 2026</span>
          </div>
        </div>
      </div>

      {/* Quick links to pillar pages */}
      <div className="bg-slate-50 border-b border-gray-200 py-4 px-4">
        <div className="max-w-4xl mx-auto flex flex-wrap gap-3 justify-center text-sm">
          <span className="text-gray-500">מדריכים מלאים:</span>
          <Link href="/guides/mortgage-complete-guide-2026" className="text-blue-600 hover:text-blue-800 underline">
            מדריך משכנתא שלם
          </Link>
          <Link href="/guides/taxes-complete-guide-2026" className="text-emerald-600 hover:text-emerald-800 underline">
            מדריך מסים שלם
          </Link>
          <Link href="/guides/employee-rights-complete-guide" className="text-purple-600 hover:text-purple-800 underline">
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
