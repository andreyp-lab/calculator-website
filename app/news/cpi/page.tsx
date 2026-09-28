import type { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/calculator/Breadcrumbs';
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';
import { MACRO_DATA, formatHebrewDate } from '@/lib/data/macroeconomic-data';

const { annualRate, lastUpdated, sourceUrl } = MACRO_DATA.inflation;

export const metadata: Metadata = {
  title: 'אינפלציה בישראל — שיעור שנתי',
  description: `שיעור האינפלציה השנתי: ${annualRate}% נכון לאימות ב-${formatHebrewDate(lastUpdated)}. מקור וקישור לנתון הרשמי.`,
  alternates: { canonical: 'https://cheshbonai.co.il/news/cpi' },
};

export default function CpiPage() {
  const purchasingPower = 100_000 / (1 + annualRate / 100);
  return (
    <main className="min-h-screen bg-paper">
      <div className="max-w-3xl mx-auto px-4 py-10">
        <Breadcrumbs items={[{ label: 'דף הבית', href: '/' }, { label: 'עדכוני שוק', href: '/news' }, { label: 'אינפלציה' }]} />
        <div className="bg-ink text-cream p-8 my-8">
          <h1 className="text-2xl font-bold mb-4">אינפלציה בישראל — 12 חודשים אחרונים</h1>
          <p className="text-6xl font-bold text-gold-light">{annualRate}%</p>
          <p className="mt-4 text-cream/80">אומת ב־<time dateTime={lastUpdated}>{formatHebrewDate(lastUpdated)}</time>; הנתון אינו מתעדכן אוטומטית.</p>
        </div>
        <section className="space-y-4 text-ink/80 leading-relaxed">
          <h2 className="text-xl font-bold text-ink">מה המשמעות לכוח הקנייה?</h2>
          <p>אם שיעור האינפלציה השנתי יישאר {annualRate}%, כוח הקנייה של ₪100,000 שלא צברו ריבית יהיה שווה בעוד שנה לכ־₪{Math.round(purchasingPower).toLocaleString('he-IL')} במונחי היום. זו דוגמה מותנית, לא תחזית.</p>
          <p>לנתוני המדד החודשיים, ערך המדד ומועדי פרסום חדשים, בדקו את <a className="underline text-gold" href={sourceUrl} target="_blank" rel="noopener noreferrer">המקור הרשמי</a>.</p>
          <div className="flex gap-3 flex-wrap pt-4">
            <Link className="bg-ink text-cream px-4 py-2" href="/investments/compound-interest">מחשבון ריבית דריבית</Link>
            <Link className="border border-ink/20 px-4 py-2" href="/real-estate/mortgage">מחשבון משכנתא</Link>
          </div>
        </section>
        <BreadcrumbSchema items={[{ name: 'דף הבית', url: 'https://cheshbonai.co.il' }, { name: 'עדכוני שוק', url: 'https://cheshbonai.co.il/news' }, { name: 'אינפלציה', url: 'https://cheshbonai.co.il/news/cpi' }]} />
      </div>
    </main>
  );
}
