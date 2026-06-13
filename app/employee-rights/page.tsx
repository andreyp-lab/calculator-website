import Link from 'next/link';
import { Metadata } from 'next';
import { ArrowLeft, Calculator } from 'lucide-react';
import { Breadcrumbs } from '@/components/calculator/Breadcrumbs';

export const metadata: Metadata = {
  alternates: { canonical: '/employee-rights' },
  title: 'מחשבוני זכויות עובדים 2026 — פיצויים, הבראה, אבטלה ומחלה',
  description: 'מחשבונים לזכויות עובדים שכירים בישראל 2026: פיצויי פיטורין, דמי הבראה, חופשה שנתית, דמי לידה, דמי אבטלה, מחלה ומילואים. בדוק כמה מגיע לך עכשיו.',
};

const calculators = [
  {
    title: 'מחשבון פיצויי פיטורין',
    description: 'חישוב פיצויי פיטורין מדויק לפי חוק פיצויי פיטורים',
    href: '/employee-rights/severance',
    available: true,
  },
  {
    title: 'מחשבון דמי הבראה',
    description: 'חישוב דמי הבראה לפי שנות ותק (תעריף 2026)',
    href: '/employee-rights/recreation-pay',
    available: true,
  },
  {
    title: 'מחשבון דמי לידה',
    description: 'חישוב גובה דמי לידה מהביטוח הלאומי + הארכות לתאומים',
    href: '/employee-rights/maternity-benefits',
    available: true,
  },
  {
    title: 'מחשבון דמי אבטלה',
    description: 'חישוב גובה דמי אבטלה ותקופת הזכאות לפי גיל ושכר',
    href: '/employee-rights/unemployment-benefits',
    available: true,
  },
  {
    title: 'מחשבון תגמולי מילואים',
    description: 'תשלום בסיסי + מענקי חרבות ברזל (280 ₪/יום)',
    href: '/employee-rights/reserve-duty-pay',
    available: true,
  },
  {
    title: 'מחשבון חופשה שנתית',
    description: 'חישוב ימי חופשה, פדיון חופשה וצבירה לפי שנות ותק',
    href: '/employee-rights/annual-leave',
    available: true,
  },
  {
    title: 'מחשבון דמי מחלה',
    description: 'חישוב דמי מחלה, ימים צבורים ומחלת בן משפחה',
    href: '/employee-rights/sick-pay',
    available: true,
  },
  {
    title: 'מחשבון שכר מינימום',
    description: 'בדיקת עמידה בשכר מינימום 2026: 6,443.85 ₪/חודש',
    href: '/employee-rights/minimum-wage',
    available: true,
  },
  {
    title: 'מחשבון בונוס שנתי',
    description: 'חישוב גובה הבונוס ומיסוי תשלום שנתי חד-פעמי',
    href: '/employee-rights/annual-bonus',
    available: true,
  },
  {
    title: 'מחשבון מענק עבודה',
    description: 'חישוב מענק עבודה (מס הכנסה שלילי) לשכירים',
    href: '/employee-rights/work-grant',
    available: true,
  },
];

export default function EmployeeRightsPage() {
  return (
    <div className="min-h-screen bg-paper">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Breadcrumbs
            items={[{ label: 'דף הבית', href: '/' }, { label: 'זכויות עובדים' }]}
          />
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-ink mb-3">
          מחשבוני זכויות עובדים
        </h1>
        <p className="text-lg text-ink/70 mb-6">
          מחשבונים מקצועיים לבדיקת הזכויות שמגיעות לך כעובד שכיר בישראל
        </p>

        {/* Banner to /salaried */}
        <Link
          href="/salaried"
          className="block bg-cream-2 border-2 border-ink/15 p-4 mb-8 hover:shadow-md transition group"
        >
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="font-semibold text-ink mb-1">
                🆕 מרכז שכירים — כולל גם החזר מס ונטו/ברוטו
              </div>
              <div className="text-sm text-ink/70">
                כל הכלים לעובד שכיר במקום אחד: זכויות + מיסים + השוואות (16 כלים)
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
                className="group bg-paper p-6 border-2 border-ink/15 hover:border-gold hover:shadow-md transition flex items-start gap-4"
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
