import Link from 'next/link';
import { Metadata } from 'next';
import { ArrowLeft, Calculator } from 'lucide-react';
import { Breadcrumbs } from '@/components/calculator/Breadcrumbs';

export const metadata: Metadata = {
  alternates: { canonical: '/investments' },
  title: 'מחשבוני השקעות וחיסכון 2026 — ריבית דריבית, ROI ופרישה',
  description:
    'מחשבונים להשקעות וחיסכון לטווח ארוך: ריבית דריבית, ROI, תכנון פרישה ו-FIRE. גלה כמה הכסף שלך יגדל ומתי תוכל לפרוש בעצמאות כלכלית. חשב עכשיו בחינם.',
};

const calculators = [
  {
    title: 'מחשבון ריבית דריבית',
    description: 'גלה כמה הכסף שלך יגדל עם הזמן עם ריבית דריבית והפקדות חודשיות',
    href: '/investments/compound-interest',
    available: true,
    icon: '📈',
  },
  {
    title: 'מחשבון ROI',
    description: 'חשב תשואה על השקעה וקבל ROI שנתי מנורמל',
    href: '/investments/roi',
    available: true,
    icon: '💹',
  },
  {
    title: 'מחשבון תכנון פרישה',
    description: 'בדוק האם אתה במסלול לחיסכון מספיק לפרישה',
    href: '/investments/retirement',
    available: true,
    icon: '🏖️',
  },
  {
    title: 'מחשבון FIRE - פרישה מוקדמת',
    description: 'תוך כמה שנים תוכל לפרוש בעצמאות כלכלית? כלל ה-4% וניתוח Lean/Regular/Fat',
    href: '/investments/fire',
    available: true,
    icon: '🔥',
  },
  {
    title: '📘 מדריך מס רווח הון',
    description: 'כמה מס על רווחים בבורסה? 25% על מניות, מס דיבידנד, קיזוז הפסדים ואפיקים פטורים',
    href: '/investments/capital-gains-tax',
    available: true,
    icon: '🧾',
  },
];

export default function InvestmentsPage() {
  return (
    <div className="min-h-screen bg-paper">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Breadcrumbs items={[{ label: 'דף הבית', href: '/' }, { label: 'השקעות' }]} />
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-ink mb-3">
          📈 מחשבוני השקעות וחיסכון
        </h1>
        <p className="text-lg text-ink/70 mb-12">
          מחשבונים מקצועיים לתכנון פיננסי לטווח ארוך - ריבית דריבית, ROI, פרישה
        </p>

        <div className="grid md:grid-cols-2 gap-4">
          {calculators.map((calc) =>
            calc.available ? (
              <Link
                key={calc.href}
                href={calc.href}
                className="group bg-paper p-6 border-2 border-ink/15 hover:border-gold hover:shadow-md transition flex items-start gap-4"
              >
                <div className="text-3xl">{calc.icon}</div>
                <div className="flex-1">
                  <h3 className="font-bold text-ink mb-1 group-hover:text-gold transition">
                    {calc.title}
                  </h3>
                  <p className="text-sm text-ink/70">{calc.description}</p>
                </div>
                <ArrowLeft className="w-4 h-4 text-gold mt-2 opacity-0 group-hover:opacity-100 transition" />
              </Link>
            ) : (
              <div
                key={calc.href}
                className="bg-cream-2 p-6 border-2 border-ink/15 flex items-start gap-4 opacity-60"
              >
                <Calculator className="w-6 h-6 text-ink/45 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h3 className="font-bold text-ink/70 mb-1">{calc.title}</h3>
                  <p className="text-sm text-ink/60">{calc.description}</p>
                  <span className="inline-block mt-2 text-xs bg-ink/10 text-ink/60 px-2 py-1">
                    בקרוב
                  </span>
                </div>
              </div>
            ),
          )}
        </div>
      </div>
    </div>
  );
}
