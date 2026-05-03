import Link from 'next/link';
import { Metadata } from 'next';
import { ArrowLeft, Calculator } from 'lucide-react';
import { Breadcrumbs } from '@/components/calculator/Breadcrumbs';

export const metadata: Metadata = {
  title: 'מחשבוני ביטוחים | FinCalc',
  description: 'מחשבוני פנסיה, ביטוח חיים, ביטוח רכב וביטוחים נוספים',
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
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Breadcrumbs items={[{ label: 'דף הבית', href: '/' }, { label: 'ביטוחים' }]} />
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">💼 מחשבוני ביטוחים</h1>
        <p className="text-lg text-gray-600 mb-12">
          מחשבונים לתכנון פנסיוני וביטוחי. גלה כמה תקבל בפרישה וכמה ביטוח אתה צריך.
        </p>

        <div className="grid md:grid-cols-2 gap-4">
          {calculators.map((calc) =>
            calc.available ? (
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
            ) : (
              <div
                key={calc.href}
                className="bg-gray-50 p-6 rounded-lg border-2 border-gray-200 flex items-start gap-4 opacity-60"
              >
                <div className="text-3xl">{calc.icon}</div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-700 mb-1">{calc.title}</h3>
                  <p className="text-sm text-gray-500">{calc.description}</p>
                  <span className="inline-block mt-2 text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded">
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
