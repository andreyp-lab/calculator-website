import Link from 'next/link';
import { Metadata } from 'next';
import { ArrowLeft, Calculator } from 'lucide-react';
import { Breadcrumbs } from '@/components/calculator/Breadcrumbs';

export const metadata: Metadata = {
  title: 'מחשבוני חיסכון וחובות | FinCalc',
  description: 'מחשבונים לתקציב משפחתי, החזרי הלוואה, וניהול חובות',
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
];

export default function SavingsPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Breadcrumbs items={[{ label: 'דף הבית', href: '/' }, { label: 'חיסכון וחובות' }]} />
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          💳 חיסכון וחובות
        </h1>
        <p className="text-lg text-gray-600 mb-12">
          ניהול תקציב משפחתי וחישוב החזרי הלוואה
        </p>

        <div className="grid md:grid-cols-2 gap-4">
          {calculators.map((calc) => (
            <Link
              key={calc.href}
              href={calc.href}
              className="group bg-white p-6 rounded-lg border-2 border-gray-200 hover:border-blue-400 hover:shadow-md transition flex items-start gap-4"
            >
              <div className="text-3xl">{calc.icon}</div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition">
                  {calc.title}
                </h3>
                <p className="text-sm text-gray-600">{calc.description}</p>
              </div>
              <ArrowLeft className="w-4 h-4 text-blue-600 mt-2 opacity-0 group-hover:opacity-100 transition" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
