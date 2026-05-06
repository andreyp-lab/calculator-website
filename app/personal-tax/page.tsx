import Link from 'next/link';
import { Metadata } from 'next';
import { ArrowLeft, Calculator } from 'lucide-react';
import { Breadcrumbs } from '@/components/calculator/Breadcrumbs';

export const metadata: Metadata = {
  title: 'מיסוי אישי - מחשבונים | FinCalc',
  description: 'מחשבונים לחישוב מס הכנסה, נקודות זיכוי, מס שולי והחזרי מס לעובדים שכירים בישראל',
};

const calculators = [
  {
    title: 'מחשבון מס הכנסה לשכיר',
    description: 'חישוב מס הכנסה מדויק לפי מדרגות 2026 כולל נקודות זיכוי וב.ל.',
    href: '/personal-tax/income-tax',
    available: true,
  },
  {
    title: 'מחשבון נקודות זיכוי',
    description: 'בדוק כמה נקודות זיכוי מגיעות לך לפי מצב אישי',
    href: '/personal-tax/tax-credits',
    available: true,
  },
  {
    title: 'מחשבון החזר מס',
    description: 'בדוק כמה מס מגיע לך בחזרה - תרומות, פנסיה, פריפריה, ועוד',
    href: '/personal-tax/tax-refund',
    available: true,
  },
  {
    title: 'מחשבון "מה שווה לי לעבוד?"',
    description: 'השוואת שכר vs דמי לידה/אבטלה/קצבה - שווי אמיתי של עבודה',
    href: '/personal-tax/work-value',
    available: true,
  },
];

export default function PersonalTaxPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Breadcrumbs items={[{ label: 'דף הבית', href: '/' }, { label: 'מיסוי אישי' }]} />
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">מחשבוני מיסוי אישי</h1>
        <p className="text-lg text-gray-600 mb-6">
          מחשבונים לחישוב מס הכנסה ועוד נושאי מיסוי אישי לפי החקיקה העדכנית
        </p>

        {/* Banner to /salaried */}
        <Link
          href="/salaried"
          className="block bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-300 rounded-xl p-4 mb-8 hover:shadow-md transition group"
        >
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="font-semibold text-blue-900 mb-1">
                🆕 מרכז שכירים — כל הכלים לעובד במקום אחד
              </div>
              <div className="text-sm text-blue-800">
                החזר מס + נטו/ברוטו + פיצויי פיטורין + דמי הבראה + 11 כלים נוספים
              </div>
            </div>
            <ArrowLeft className="w-5 h-5 text-blue-600 group-hover:-translate-x-1 transition flex-shrink-0" />
          </div>
        </Link>

        <div className="grid md:grid-cols-2 gap-4">
          {calculators.map((calc) =>
            calc.available ? (
              <Link
                key={calc.href}
                href={calc.href}
                className="group bg-white p-6 rounded-lg border-2 border-gray-200 hover:border-blue-400 hover:shadow-md transition flex items-start gap-4"
              >
                <Calculator className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
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
                <Calculator className="w-6 h-6 text-gray-400 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h3 className="font-bold text-gray-700 mb-1">{calc.title}</h3>
                  <p className="text-sm text-gray-500">{calc.description}</p>
                  <span className="inline-block mt-2 text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded">
                    בקרוב
                  </span>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
