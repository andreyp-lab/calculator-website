import Link from 'next/link';
import { Metadata } from 'next';
import { ArrowLeft, Calculator } from 'lucide-react';
import { Breadcrumbs } from '@/components/calculator/Breadcrumbs';

export const metadata: Metadata = {
  alternates: { canonical: '/vehicles' },
  title: 'מחשבוני רכב ותחבורה 2026 - עלות דלק, ליסינג ורכישה',
  description: 'חשב עלות דלק חודשית ושנתית, השווה בין ליסינג לקניית רכב ובדוק את כדאיות הרכב שלך. כלים מקצועיים לחישוב הוצאות רכב בעברית, עדכני 2026 — חינם לחלוטין.',
};

const calculators = [
  {
    title: 'מחשבון עלות דלק',
    description: 'חשב את ההוצאה החודשית והשנתית על דלק',
    href: '/vehicles/fuel-cost',
    available: true,
    icon: '⛽',
  },
  {
    title: 'ליסינג vs קנייה',
    description: 'השווה עלויות בין ליסינג לקניית רכב',
    href: '/vehicles/leasing-vs-buying',
    available: true,
    icon: '🚙',
  },
];

export default function VehiclesPage() {
  return (
    <div className="min-h-screen bg-paper">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Breadcrumbs items={[{ label: 'דף הבית', href: '/' }, { label: 'רכב ותחבורה' }]} />
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-ink mb-3">
          🚗 מחשבוני רכב ותחבורה
        </h1>
        <p className="text-lg text-ink/70 mb-12">
          מחשבונים מקצועיים לקבלת החלטות חכמות בנוגע לרכב שלך
        </p>

        <div className="grid md:grid-cols-2 gap-4">
          {calculators.map((calc) =>
            calc.available ? (
              <Link
                key={calc.href}
                href={calc.href}
                className="group bg-paper p-6 rounded-none border-2 border-ink/15 hover:border-gold hover:shadow-md transition flex items-start gap-4"
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
                className="bg-cream-2 p-6 rounded-none border-2 border-ink/15 flex items-start gap-4 opacity-60"
              >
                <Calculator className="w-6 h-6 text-ink/45 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h3 className="font-bold text-ink/70 mb-1">{calc.title}</h3>
                  <p className="text-sm text-ink/60">{calc.description}</p>
                  <span className="inline-block mt-2 text-xs bg-ink/10 text-ink/70 px-2 py-1 rounded-none">
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
