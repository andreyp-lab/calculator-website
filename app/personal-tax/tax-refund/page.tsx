import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'החזר מס לשכירים — בדיקה והגשה ברשות המסים',
  description: 'בדיקת זכאות להחזר מס על בסיס נתונים שנתיים ונקודות זיכוי בשירות רשות המסים.',
  alternates: { canonical: '/personal-tax/tax-refund' },
};

export default function TaxRefundPage() {
  return <main dir="rtl" className="mx-auto max-w-4xl px-5 py-12 text-ink">
    <nav className="mb-8 text-sm text-ink/60"><Link href="/">דף הבית</Link> / <Link href="/personal-tax">מס אישי</Link></nav>
    <h1 className="mb-5 text-3xl font-bold">בדיקת החזר מס</h1>
    <p className="leading-relaxed">החזר מס נקבע לפי ההכנסה, הניכויים והזיכויים בשנת המס כולה. שינוי עבודה, חופשה ממושכת, ילדים, הפקדות ותיאום מס עשויים להשפיע על התוצאה. חישוב ממידע חלקי עלול להציג החזר שגוי.</p>
    <p className="mt-5 leading-relaxed">בדקו את שנת המס ואת נקודות הזיכוי האישיות, הכינו טופסי 106 ואישורים רלוונטיים, והשתמשו <a className="font-bold text-gold underline" href="https://www.gov.il/he/service/itc135" target="_blank" rel="noopener noreferrer">בשירות הגשת בקשה להחזר מס של רשות המסים</a>. אפשר לברר את מספר הנקודות <Link className="text-gold underline" href="/personal-tax/tax-credits">בדף נקודות הזיכוי</Link>.</p>
  </main>;
}
