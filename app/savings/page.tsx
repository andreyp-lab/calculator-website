import Link from 'next/link';
import { Metadata } from 'next';
import { ArrowLeft, Calculator } from 'lucide-react';
import { Breadcrumbs } from '@/components/calculator/Breadcrumbs';

export const metadata: Metadata = {
  alternates: { canonical: '/savings' },
  title: 'מחשבוני חיסכון, תקציב וחובות 2026 - ניהול פיננסי',
  description:
    'מחשבונים לניהול כספים משפחתי 2026: תקציב לפי כלל 50/30/20, החזר הלוואה וסילוק מואץ לחיסכון בריבית, ומחשבון הלוואה אישית. קח שליטה על הכסף שלך עכשיו.',
};

const calculators = [
  {
    title: 'תקציב משפחתי',
    description: 'נהל הכנסות והוצאות עם ניתוח לפי כלל 50/30/20',
    href: '/savings/family-budget',
    available: true,
    icon: '👨‍👩‍👧',
  },
  {
    title: 'מחשבון החזרי הלוואה',
    description: 'חישוב תשלום חודשי + סילוק מואץ לחיסכון בריבית',
    href: '/savings/loan-repayment',
    available: true,
    icon: '💳',
  },
  {
    title: 'מחשבון הלוואה אישית',
    description: 'APR אמיתי, השוואת בנק/קרן השתלמות/חוץ-בנקאי, שיטות Snowball ו-Avalanche',
    href: '/savings/personal-loan',
    available: true,
    icon: '🏦',
  },
];

export default function SavingsPage() {
  return (
    <div className="min-h-screen bg-paper">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Breadcrumbs items={[{ label: 'דף הבית', href: '/' }, { label: 'חיסכון וחובות' }]} />
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-ink mb-3">
          💳 חיסכון וחובות
        </h1>
        <p className="text-lg text-ink/70 mb-12">
          ניהול תקציב משפחתי וחישוב החזרי הלוואה
        </p>

        <div className="grid md:grid-cols-2 gap-4">
          {calculators.map((calc) => (
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
          ))}
        </div>
      </div>
    </div>
  );
}
