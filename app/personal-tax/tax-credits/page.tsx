import type { Metadata } from 'next';
import Link from 'next/link';
import { DisclaimerBox } from '@/components/calculator/DisclaimerBox';

export const metadata: Metadata = {
  title: 'נקודות זיכוי ממס הכנסה — בדיקה אישית',
  description: 'שווי נקודת זיכוי בשנת 2026 וקישור לסימולטור הרשמי לחישוב הזכאות לפי מצב משפחתי.',
  alternates: { canonical: '/personal-tax/tax-credits' },
};

export default function TaxCreditsPage() {
  return <main dir="rtl" className="mx-auto max-w-4xl px-5 py-12 text-ink">
    <nav className="mb-8 text-sm text-ink/60"><Link href="/">דף הבית</Link> / <Link href="/personal-tax">מס אישי</Link></nav>
    <h1 className="mb-5 text-3xl font-bold">נקודות זיכוי במס הכנסה</h1>
    <p className="leading-relaxed">שווי נקודת זיכוי בשנת 2026 הוא 242 ₪ לחודש, כלומר 2,904 ₪ לשנה, עד גובה המס שחייבים בו. הזכאות להורים משתנה לפי הגיל שאליו מגיע הילד בשנת המס, מי מההורים מקבל את קצבת הילדים ומצב משפחתי. לדוגמה, לילד בשנת לידתו ולילד בגיל שנתיים אין אותו מספר נקודות.</p>
    <p className="mt-5 leading-relaxed">תוספות לעולים, מסיימי שירות ולבעלי תואר תלויות במועד ובתנאי הזכאות. הזינו את פרטי המשפחה <a className="font-bold text-gold underline" href="https://www.gov.il/he/service/tax-credit" target="_blank" rel="noopener noreferrer">בסימולטור נקודות הזיכוי של רשות המסים</a>, והעבירו את מספר הנקודות שקיבלתם לתלוש או למחשבון השכר. לחישוב סכום המס לפי מספר נקודות ידוע השתמשו <a className="text-gold underline" href="https://www.gov.il/he/service/income-tax-calculator" target="_blank" rel="noopener noreferrer">בסימולטור המס הרשמי</a>.</p>
    <p className="mt-8 text-sm text-ink/70">מקור נוסף: <a className="underline" href="https://www.gov.il/he/pages/tax-benefits-for-parents-with-small-children" target="_blank" rel="noopener noreferrer">רשות המסים — הטבות להורים לילדים קטנים</a>.</p>
    <p className="my-6 leading-relaxed">בודקים שנה שכבר הסתיימה? <Link href="/personal-tax/tax-refund" className="text-gold underline">מחשבון החזר המס לפי טופס 106</Link> מחשב את הפרש המס לפי נתוני השנה שנבחרה. יש להזין את הזכאות ההיסטורית, ולא להעתיק אוטומטית את נקודות השנה הנוכחית.</p>
    <DisclaimerBox />
  </main>;
}
