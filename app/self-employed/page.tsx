import Link from 'next/link';
import { Metadata } from 'next';
import { ArrowLeft, Calculator } from 'lucide-react';
import { Breadcrumbs } from '@/components/calculator/Breadcrumbs';

export const metadata: Metadata = {
  title: 'עצמאיים ועסקים - מחשבונים | FinCalc',
  description: 'מחשבונים לעצמאיים ובעלי עסקים: מע"מ, מקדמות מס, ביטוח לאומי לעצמאי ועוד',
};

const calculators = [
  {
    title: '⭐ סימולטור הערכת מס לסוף שנה',
    description: 'הכלי המקיף ביותר: הכנסות + הוצאות + פנסיה + ב.ל. + מקדמות - הערכת חבות מס מלאה לסוף השנה',
    href: '/self-employed/year-end-tax-simulator',
    available: true,
  },
  {
    title: '💰 מחשבון נטו לעצמאי',
    description: 'כמה כסף נשאר ביד בסוף החודש? המרה מהירה ממחזור לנטו אחרי מס, ב.ל., מע"מ ופנסיה',
    href: '/self-employed/net',
    available: true,
  },
  {
    title: 'מחשבון מע"מ',
    description: 'הוספת או חילוץ מע"מ (18% ב-2026)',
    href: '/self-employed/vat',
    available: true,
  },
  {
    title: 'מחשבון ביטוח לאומי לעצמאי',
    description: 'חישוב דמי ב.ל. + בריאות לעצמאי לפי הכנסה',
    href: '/self-employed/social-security',
    available: false,
  },
  {
    title: 'מחשבון מקדמות מס',
    description: 'חישוב מקדמות מס הכנסה לעצמאי',
    href: '/self-employed/tax-advances',
    available: false,
  },
  {
    title: 'מחשבון תמחור שעת עבודה',
    description: 'חישוב מחיר שעה לפרילנסר/יועץ - שכר רצוי + הוצאות + רווח',
    href: '/self-employed/hourly-rate',
    available: true,
  },
  {
    title: 'מחשבון עלות מעסיק',
    description: 'כמה עולה להעסיק עובד - שכר + ביטוח לאומי + פנסיה + הטבות',
    href: '/self-employed/employer-cost',
    available: true,
  },
  {
    title: 'חברה בע"מ vs עוסק מורשה',
    description: 'השוואת מס מצרפי - איזה מבנה עסקי משתלם יותר',
    href: '/self-employed/corporation-vs-individual',
    available: true,
  },
  {
    title: 'דיבידנד vs משכורת',
    description: 'אופטימיזציית מס לבעל חברה - מציאת המיקס האופטימלי',
    href: '/self-employed/dividend-vs-salary',
    available: true,
  },
];

export default function SelfEmployedPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Breadcrumbs items={[{ label: 'דף הבית', href: '/' }, { label: 'עצמאיים' }]} />
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">מחשבונים לעצמאיים</h1>
        <p className="text-lg text-gray-600 mb-12">
          מחשבונים מקצועיים לעצמאיים, פרילנסרים ובעלי עסקים קטנים
        </p>

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
