import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'מס שבח במכירת מקרקעין — חישוב עצמי ברשות המסים',
  description: 'מס שבח תלוי במועדי העסקה, בשווי, בהוצאות ובזכאות לפטור. קישור לשומה העצמית הרשמית של רשות המסים.',
  alternates: { canonical: '/real-estate/capital-gains-tax' },
};

export default function CapitalGainsTaxPage() {
  return (
    <main dir="rtl" className="mx-auto max-w-4xl px-5 py-12 text-ink">
      <nav aria-label="פירורי לחם" className="mb-8 text-sm text-ink/60"><Link href="/">דף הבית</Link> / <Link href="/real-estate">נדל״ן</Link></nav>
      <h1 className="mb-5 text-3xl font-bold md:text-4xl">מס שבח — בדיקת החבות בעת מכירה</h1>
      <p className="mb-6 text-lg leading-relaxed">החבות במס שבח מושפעת ממועד הרכישה והמכירה, סוג הזכות, מחיר העסקה, הוצאות מוכרות, הצמדה, זכאות לפטור ונתוני המוכר. תנאי הפטור לדירת מגורים יחידה והחישוב הלינארי אינם נקבעים על סמך שנת רכישה ושווי מכירה בלבד.</p>
      <div className="border-r-4 border-gold bg-cream-2 p-6">
        <h2 className="mb-3 text-xl font-bold">שומה עצמית באתר רשות המסים</h2>
        <p className="mb-5 leading-relaxed">הכינו חוזי רכישה ומכירה, מועדים מדויקים, מסמכי הוצאות ואסמכתאות לזכאות לפטור. חישוב אישי ומילוי הצהרה נעשים בשירות הרשמי.</p>
        <a href="https://www.gov.il/he/service/real_estate_selfshuma" target="_blank" rel="noopener noreferrer" className="inline-block bg-ink px-6 py-3 font-semibold text-cream hover:bg-ink-deep">לשומה העצמית ברשות המסים ↗</a>
      </div>
      <p className="mt-8 leading-relaxed">שיעור המס, תחולת מס יסף והחלק הפטור דורשים חישוב לפי נסיבות העסקה והדין החל. <Link href="/blog/capital-gains-tax-property-2026" className="font-semibold text-gold underline">קראו את המדריך</Link> לפני איסוף המסמכים.</p>
    </main>
  );
}
