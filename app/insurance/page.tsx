import Link from 'next/link';
import { Metadata } from 'next';
import { ArrowLeft, Calculator } from 'lucide-react';
import { Breadcrumbs } from '@/components/calculator/Breadcrumbs';

export const metadata: Metadata = {
  alternates: { canonical: '/insurance' },
  title: 'מחשבוני ביטוחים ופנסיה 2026 – חישוב קצבה ועלות ביטוח',
  description: 'חשב את הפנסיה הצפויה שלך לפי שכר וותק, סכום ביטוח החיים הנדרש למשפחה ועלות ביטוח רכב. מחשבונים מקצועיים לתכנון פיננסי, עדכניים ל-2026 — חינם ומיידי.',
};

const calculators = [
  {
    title: 'מחשבון פנסיה צפויה',
    description: 'חשב את הקצבה החודשית שתקבל בפרישה',
    href: '/insurance/pension',
    available: true,
    icon: '👴',
  },
  {
    title: 'מחשבון ביטוח חיים',
    description: 'חישוב סכום ביטוח נדרש למשפחה',
    href: '/insurance/life',
    available: false,
    icon: '🛡️',
  },
  {
    title: 'מחשבון ביטוח רכב',
    description: 'השוואת ביטוח חובה ומקיף',
    href: '/insurance/car',
    available: false,
    icon: '🚗',
  },
];

export default function InsurancePage() {
  return (
    <div className="min-h-screen bg-paper">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Breadcrumbs items={[{ label: 'דף הבית', href: '/' }, { label: 'ביטוחים' }]} />
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-ink mb-3">💼 מחשבוני ביטוחים</h1>
        <p className="text-lg text-ink/60 mb-12">
          מחשבונים לתכנון פנסיוני וביטוחי. גלה כמה תקבל בפרישה וכמה ביטוח אתה צריך.
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
                  <p className="text-sm text-ink/60">{calc.description}</p>
                </div>
                <ArrowLeft className="w-4 h-4 text-gold mt-2 opacity-0 group-hover:opacity-100 transition" />
              </Link>
            ) : (
              <div
                key={calc.href}
                className="bg-cream-2 p-6 rounded-none border-2 border-ink/15 flex items-start gap-4 opacity-60"
              >
                <div className="text-3xl">{calc.icon}</div>
                <div className="flex-1">
                  <h3 className="font-bold text-ink/70 mb-1">{calc.title}</h3>
                  <p className="text-sm text-ink/60">{calc.description}</p>
                  <span className="inline-block mt-2 text-xs bg-cream-2 text-ink/60 px-2 py-1 rounded-none">
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
