import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'זכויות עובדים בישראל — נקודות בדיקה ומקורות רשמיים',
  description: 'שכר מינימום, מילואים, אבטלה ומענק עבודה: הפניות לבדיקת הזכויות והסכומים האישיים במקורות הרשמיים.',
  alternates: { canonical: '/guides/employee-rights-complete-guide' },
};

const rights = [
  { title: 'שכר מינימום', href: '/employee-rights/minimum-wage', detail: 'מ־1 באפריל 2026: 6,443.85 ₪ לחודש ו־35.40 ₪ לשעה לפי בסיס 182 שעות.', source: 'https://www.btl.gov.il/Mediniyut/GeneralData/Pages/%D7%A9%D7%9B%D7%A8%20%D7%9E%D7%99%D7%A0%D7%99%D7%9E%D7%95%D7%9D.aspx' },
  { title: 'תגמולי מילואים', href: '/employee-rights/reserve-duty-pay', detail: 'מחושבים על בסיס ההכנסה וימי השירות. מענקים נלווים תלויים במסלול ובתנאי זכאות.', source: 'https://www.btl.gov.il/benefits/Reserve_Service/Pages/default.aspx' },
  { title: 'דמי אבטלה', href: '/employee-rights/unemployment-benefits', detail: 'זכאות וגובה התשלום תלויים בתקופת העבודה, בגיל, בשכר הקודם ובמספר ימי הזכאות.', source: 'https://www.btl.gov.il/benefits/Unemployment/Pages/default.aspx' },
  { title: 'מענק עבודה', href: '/employee-rights/work-grant', detail: 'בדיקת זכאות וסכום לפי שנת מס ונתוני משק הבית בשירות רשות המסים.', source: 'https://www.gov.il/he/service/check-eligibility-for-job-grant' },
  { title: 'חופשה, הבראה ופיצויי פיטורים', href: '/employee-rights', detail: 'חישוב הזכות משתנה לפי ותק, הסכם, היקף עבודה ונסיבות הסיום.', source: 'https://www.gov.il/he/departments/labor' },
];

export default function EmployeeRightsGuide() {
  return <main dir="rtl" className="mx-auto max-w-4xl px-5 py-12 text-ink">
    <nav className="mb-8 text-sm text-ink/60"><Link href="/">דף הבית</Link> / <Link href="/employee-rights">זכויות עובדים</Link></nav>
    <h1 className="mb-6 text-3xl font-bold">זכויות עובדים בישראל</h1>
    <p className="mb-8 leading-relaxed">הנתונים בדף זה הם נקודת התחלה לבדיקה. זכאות אישית עשויה להשתנות לפי נתוני העובד, תקופת העבודה והדין החל. לכל נושא מצורף מקור רשמי.</p>
    <div className="space-y-6">{rights.map((right) => <section key={right.href} className="border border-ink/15 bg-paper p-6">
      <h2 className="text-xl font-bold"><Link href={right.href} className="text-gold underline">{right.title}</Link></h2>
      <p className="my-3 leading-relaxed">{right.detail}</p>
      <a href={right.source} target="_blank" rel="noopener noreferrer" className="text-sm underline">למקור הרשמי ↗</a>
    </section>)}</div>
  </main>;
}
