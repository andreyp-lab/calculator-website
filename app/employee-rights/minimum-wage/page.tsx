import type { Metadata } from 'next';
import Link from 'next/link';
import { MINIMUM_WAGE_2026 } from '@/lib/constants/tax-2026';

export const metadata: Metadata = {
  title: 'שכר מינימום 2026 — תעריפים רשמיים',
  description: 'שכר מינימום חודשי ושעתי החל באפריל 2026, לפי פרסום הביטוח הלאומי.',
  alternates: { canonical: '/employee-rights/minimum-wage' },
};

export default function MinimumWagePage() {
  return (
    <main dir="rtl" className="mx-auto max-w-4xl px-5 py-12 text-ink">
      <nav aria-label="פירורי לחם" className="mb-8 text-sm text-ink/60">
        <Link href="/">דף הבית</Link> / <Link href="/employee-rights">זכויות עובדים</Link>
      </nav>
      <h1 className="mb-5 text-3xl font-bold md:text-4xl">שכר מינימום בישראל — 2026</h1>
      <p className="mb-8 text-lg leading-relaxed">
        החל ב־1 באפריל 2026, שכר המינימום למשרה מלאה הוא {MINIMUM_WAGE_2026.monthly.toLocaleString('he-IL')} ₪ לחודש.
        התעריף השעתי לפי 182 שעות בחודש הוא {MINIMUM_WAGE_2026.hourly182.toFixed(2)} ₪.
      </p>
      <div className="border-r-4 border-gold bg-cream-2 p-6 leading-relaxed">
        <h2 className="mb-3 text-xl font-bold">בדקו את התעריף המתאים לכם</h2>
        <p className="mb-4">עבודה חלקית, נוער, ענפים שחלים עליהם צווי הרחבה ורכיבי שכר שונים דורשים בדיקה לפי הנסיבות. אין להסיק משכר ברוטו על נטו אישי ללא נתוני מס והפרשות.</p>
        <a href="https://www.btl.gov.il/Mediniyut/GeneralData/Pages/%D7%A9%D7%9B%D7%A8%20%D7%9E%D7%99%D7%A0%D7%99%D7%9E%D7%95%D7%9D.aspx" target="_blank" rel="noopener noreferrer" className="inline-block bg-ink px-6 py-3 font-semibold text-cream hover:bg-ink-deep">
          לתעריפי שכר המינימום בביטוח הלאומי ↗
        </a>
      </div>
    </main>
  );
}
