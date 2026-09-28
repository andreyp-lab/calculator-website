import type { Metadata } from 'next';
import Link from 'next/link';
import { WorkValueCalculator } from '@/components/calculators/WorkValueCalculator';

export const metadata: Metadata = {
  title: 'השוואת הכנסה מעבודה להכנסה חלופית',
  description: 'השוואה כספית לפי שכר נטו צפוי, הוצאות עבודה, הטבות והכנסה חלופית שמזינים באופן אישי.',
  alternates: { canonical: '/personal-tax/work-value' },
};

export default function WorkValuePage() {
  return (
    <main dir="rtl" className="mx-auto max-w-6xl px-5 py-12 text-ink">
      <nav aria-label="פירורי לחם" className="mb-8 text-sm text-ink/60"><Link href="/">דף הבית</Link> / <Link href="/personal-tax">מיסוי אישי</Link></nav>
      <h1 className="mb-5 text-3xl font-bold md:text-4xl">השוואת הכנסה מעבודה לאפשרות אחרת</h1>
      <p className="mb-8 max-w-3xl text-lg leading-relaxed">הזינו <strong>שכר נטו צפוי</strong> מתוך תלוש או בדיקה אישית, הוצאות הקשורות לעבודה והכנסה חלופית <strong>נטו</strong> שכבר בדקתם את זכאותכם לה. הכלי מציג פער כספי בלבד. הפקדות מעסיק הן הטבה לעתיד ולא כסף פנוי בחשבון, ולכן השוו גם את הרכיבים בנפרד.</p>
      <WorkValueCalculator />
      <p className="mt-8 max-w-3xl leading-relaxed">אפשר להיעזר ב<Link href="/personal-tax/salary-net-gross" className="font-semibold text-gold underline">מחשבון ברוטו נטו</Link> כאומדן לשכר, ובשירות הרשמי של הרשות המטפלת לבדיקת דמי לידה או אבטלה. ההשוואה אינה קובעת זכאות לגמלה ואינה כוללת שיקולי בריאות, קידום או השלכות ארוכות טווח.</p>
    </main>
  );
}
