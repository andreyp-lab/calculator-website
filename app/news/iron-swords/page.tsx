import type { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/calculator/Breadcrumbs';
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';

const sourceUrl = 'https://www.btl.gov.il/Benefits/OperationIronSwords/Pages/default.aspx';

export const metadata: Metadata = {
  title: 'סיוע בעקבות מלחמת חרבות ברזל — בדיקת זכאות',
  description: 'מידע על מסלולי סיוע ותגמולי מילואים וקישור למקור הרשמי לבדיקת סכומים ותנאי זכאות.',
  alternates: { canonical: 'https://cheshbonai.co.il/news/iron-swords' },
};

export default function IronSwordsPage() {
  return (
    <main className="min-h-screen bg-paper">
      <div className="max-w-3xl mx-auto px-4 py-10">
        <Breadcrumbs items={[{ label: 'דף הבית', href: '/' }, { label: 'עדכוני שוק', href: '/news' }, { label: 'סיוע בעקבות המלחמה' }]} />
        <div className="bg-ink text-cream p-8 my-8">
          <h1 className="text-3xl font-bold">סיוע ותגמולים בעקבות מלחמת חרבות ברזל</h1>
          <p className="mt-4 text-cream/80">גובה הסיוע ותנאי הזכאות תלויים במסלול, בתקופת השירות או הפגיעה ובמעמד הזכאי. אין סכום מענק אחיד שמתאים לכל המקרים.</p>
        </div>
        <section className="space-y-5 text-ink/80 leading-relaxed">
          <p>לפני הגשת בקשה, בדקו באתר הביטוח הלאומי מהו מסלול הזכאות המתאים לכם ומהם המסמכים הנדרשים. המידע הרשמי מתעדכן בהתאם להוראות ולמועדים החלים על כל מסלול.</p>
          <a className="inline-block bg-ink text-cream px-5 py-3" href={sourceUrl} target="_blank" rel="noopener noreferrer">למסלולי הסיוע באתר הביטוח הלאומי</a>
          <div className="border border-ink/20 p-6">
            <h2 className="text-xl font-bold text-ink mb-2">שירתתם במילואים?</h2>
            <p>אפשר לאמוד את תגמול המילואים לפי ההכנסה והימים ששירתתם. בדקו זכאות וסכום סופי מול הביטוח הלאומי.</p>
            <Link className="inline-block mt-4 underline text-gold" href="/employee-rights/reserve-duty-pay">מחשבון תגמולי מילואים</Link>
          </div>
        </section>
        <BreadcrumbSchema items={[{ name: 'דף הבית', url: 'https://cheshbonai.co.il' }, { name: 'עדכוני שוק', url: 'https://cheshbonai.co.il/news' }, { name: 'סיוע בעקבות המלחמה', url: 'https://cheshbonai.co.il/news/iron-swords' }]} />
      </div>
    </main>
  );
}
