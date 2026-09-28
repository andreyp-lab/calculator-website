import type { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/calculator/Breadcrumbs';
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';
import { MACRO_DATA, formatHebrewDate } from '@/lib/data/macroeconomic-data';

const { monthly, reportPeriod, sourceUrl } = MACRO_DATA.averageWage;

export const metadata: Metadata = {
  title: 'השכר הממוצע לפי חוק הביטוח הלאומי 2026',
  description: `השכר הממוצע לפי סעיף 2 לחוק הביטוח הלאומי בשנת 2026: ₪${monthly.toLocaleString('he-IL')} לחודש. הסבר ומקור רשמי.`,
  alternates: { canonical: 'https://cheshbonai.co.il/news/average-wage' },
};

export default function AverageWagePage() {
  return (
    <main className="min-h-screen bg-paper">
      <div className="max-w-3xl mx-auto px-4 py-10">
        <Breadcrumbs items={[{ label: 'דף הבית', href: '/' }, { label: 'עדכוני שוק', href: '/news' }, { label: 'שכר ממוצע' }]} />
        <div className="bg-ink text-cream p-8 my-8">
          <h1 className="text-2xl font-bold mb-4">שכר ממוצע לפי סעיף 2 לחוק הביטוח הלאומי</h1>
          <p className="text-6xl font-bold text-gold-light">₪{monthly.toLocaleString('he-IL')}</p>
          <p className="mt-4 text-cream/80">לחודש, החל ב־1 בינואר 2026 · אומת ב־{formatHebrewDate(MACRO_DATA.averageWage.lastUpdated)}</p>
        </div>
        <section className="space-y-4 text-ink/80 leading-relaxed">
          <h2 className="text-xl font-bold text-ink">מה הנתון מודד?</h2>
          <p>זהו השכר הממוצע הסטטוטורי לפי סעיף 2 לחוק הביטוח הלאומי ({reportPeriod}). הוא משמש לחישובי זכויות ותקרות בחוק. לפי סעיף 1 לחוק, הסכום בשנת 2026 הוא ₪13,566. הנתונים האלה אינם אומדן לשכר נטו של עובד מסוים ואינם שקולים בהכרח לסדרת השכר החודשית למשרת שכיר של הלשכה המרכזית לסטטיסטיקה.</p>
          <p>הסכומים מתעדכנים על פי פרסום הביטוח הלאומי. <a className="underline text-gold" href={sourceUrl} target="_blank" rel="noopener noreferrer">בדקו את המקור הרשמי</a> לפני החלטה אישית.</p>
          <div className="flex gap-3 flex-wrap pt-4">
            <Link className="bg-ink text-cream px-4 py-2" href="/personal-tax/salary-net-gross">מחשבון נטו לפי נתונים אישיים</Link>
            <Link className="border border-ink/20 px-4 py-2" href="/employee-rights/minimum-wage">שכר מינימום</Link>
          </div>
        </section>
        <BreadcrumbSchema items={[{ name: 'דף הבית', url: 'https://cheshbonai.co.il' }, { name: 'עדכוני שוק', url: 'https://cheshbonai.co.il/news' }, { name: 'שכר ממוצע', url: 'https://cheshbonai.co.il/news/average-wage' }]} />
      </div>
    </main>
  );
}
