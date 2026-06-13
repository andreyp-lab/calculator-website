import Link from 'next/link';
import { Metadata } from 'next';
import { ArrowLeft, Calculator } from 'lucide-react';
import { Breadcrumbs } from '@/components/calculator/Breadcrumbs';

export const metadata: Metadata = {
  alternates: { canonical: '/real-estate' },
  title: 'מחשבוני משכנתא ומס רכישה 2026 - נדל"ן ישראל',
  description:
    'מחשבוני נדל"ן 2026: משכנתא, מס רכישה לפי מדרגות עדכניות, מס שבח ואופטימיזציה תמהיל משכנתא לרוכשי דירות בישראל. חשב את עלויות הרכישה עכשיו בחינם.',
};

const calculators = [
  {
    title: 'מחשבון משכנתא',
    description: 'חישוב תשלום חודשי, לוח סילוקין שפיצר/קרן שווה, גרף שנתי',
    href: '/real-estate/mortgage',
    available: true,
    badge: undefined as string | undefined,
  },
  {
    title: 'אופטימייזר תמהיל משכנתא',
    description: 'Solver-style: מוצא את החלוקה האופטימלית בין מסלולים למזעור עלות, סיכון, או תשלום חודשי',
    href: '/real-estate/mortgage-optimizer',
    available: true,
    badge: 'חדש' as string | undefined,
  },
  {
    title: 'מחשבון מס רכישה',
    description: 'חישוב מס רכישה לפי מדרגות 2026 (דירה ראשונה / נוספת)',
    href: '/real-estate/purchase-tax',
    available: true,
    badge: undefined as string | undefined,
  },
  {
    title: 'מחשבון מס שבח',
    description: 'מכירת דירה - פטור דירה יחידה + חישוב לינארי מוטב',
    href: '/real-estate/capital-gains-tax',
    available: true,
    badge: undefined as string | undefined,
  },
  {
    title: '📘 מדריך מיסוי שכר דירה',
    description: '3 מסלולי המס על הכנסה משכירות: פטור (עד 5,654 ₪), מסלול 10% ומדרגות — מתי כל אחד משתלם',
    href: '/real-estate/rental-income-tax',
    available: true,
    badge: undefined as string | undefined,
  },
];

export default function RealEstatePage() {
  return (
    <div className="min-h-screen bg-paper">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Breadcrumbs items={[{ label: 'דף הבית', href: '/' }, { label: 'משכנתא ונדל"ן' }]} />
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-ink mb-3">
          מחשבוני משכנתא ונדל&quot;ן
        </h1>
        <p className="text-lg text-ink/70 mb-12">
          מחשבונים מקצועיים לרוכשי ובעלי דירות בישראל
        </p>

        <div className="grid md:grid-cols-2 gap-4">
          {calculators.map((calc) =>
            calc.available ? (
              <Link
                key={calc.href}
                href={calc.href}
                className="group bg-paper p-6 border-2 border-ink/15 hover:border-gold hover:shadow-md transition flex items-start gap-4"
              >
                <Calculator className="w-6 h-6 text-gold flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-ink group-hover:text-gold transition">
                      {calc.title}
                    </h3>
                    {calc.badge && (
                      <span className="bg-cream-2 text-gold text-xs px-2 py-0.5 rounded-full font-medium">
                        {calc.badge}
                      </span>
                    )}
                  </div>
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
                  <span className="inline-block mt-2 text-xs bg-cream-2 text-ink/60 px-2 py-1">
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
