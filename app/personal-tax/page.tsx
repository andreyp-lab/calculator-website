import Link from 'next/link';
import { Metadata } from 'next';
import { ArrowLeft, Calculator } from 'lucide-react';
import { Breadcrumbs } from '@/components/calculator/Breadcrumbs';

export const metadata: Metadata = {
  alternates: { canonical: '/personal-tax' },
  title: 'מחשבוני מס הכנסה לשכיר 2026 - מיסוי אישי בישראל',
  description: 'מחשבונים לחישוב מס הכנסה לפי מדרגות 2026, נקודות זיכוי ושוויין, מס שולי והחזר מס לשכירים בישראל. כולל שכר נטו-ברוטו ומה שווה לי לעבוד. חשב בחינם עכשיו.',
};

const calculators = [
  {
    title: 'מחשבון שכר נטו ברוטו 2026',
    description: 'חישוב מדויק של שכר נטו מברוטו - מס הכנסה, ביטוח לאומי, ביטוח בריאות ותוספות שכר',
    href: '/personal-tax/salary-net-gross',
    available: true,
  },
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
    <div className="min-h-screen bg-paper">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Breadcrumbs items={[{ label: 'דף הבית', href: '/' }, { label: 'מיסוי אישי' }]} />
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-ink mb-3">מחשבוני מיסוי אישי</h1>
        <p className="text-lg text-ink/70 mb-6">
          מחשבונים לחישוב מס הכנסה ועוד נושאי מיסוי אישי לפי החקיקה העדכנית
        </p>

        {/* Banner to /salaried */}
        <Link
          href="/salaried"
          className="block bg-cream-2 border-2 border-ink/15 rounded-none p-4 mb-8 hover:shadow-md transition group"
        >
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="font-semibold text-ink mb-1">
                🆕 מרכז שכירים — כל הכלים לעובד במקום אחד
              </div>
              <div className="text-sm text-ink/70">
                החזר מס + נטו/ברוטו + פיצויי פיטורין + דמי הבראה + 11 כלים נוספים
              </div>
            </div>
            <ArrowLeft className="w-5 h-5 text-gold group-hover:-translate-x-1 transition flex-shrink-0" />
          </div>
        </Link>

        <div className="grid md:grid-cols-2 gap-4">
          {calculators.map((calc) =>
            calc.available ? (
              <Link
                key={calc.href}
                href={calc.href}
                className="group bg-paper p-6 rounded-none border-2 border-ink/15 hover:border-gold hover:shadow-md transition flex items-start gap-4"
              >
                <Calculator className="w-6 h-6 text-gold flex-shrink-0 mt-1" />
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
                  <span className="inline-block mt-2 text-xs bg-ink/10 text-ink/60 px-2 py-1 rounded-none">
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
