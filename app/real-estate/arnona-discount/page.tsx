import { withPageSocialMetadata } from '@/lib/config/site-info';
import type { Metadata } from 'next';
import Link from 'next/link';
import { CalculatorLayout } from '@/components/calculator/CalculatorLayout';
import { FAQ } from '@/components/calculator/FAQ';
import { FinanceExtraCalculator } from '@/components/calculators/FinanceExtraCalculator';

export const metadata: Metadata = withPageSocialMetadata({
  title: "הנחה בארנונה לפי הכנסה 2026 — טבלה ומחשבון זכאות",
  description: "בדקו לאיזו הנחה בארנונה אתם זכאים לפי הכנסה וגודל משק הבית (30%–90%), וכמה תחסכו, לפי הטבלה הארצית ל־2026.",
  alternates: { canonical: '/real-estate/arnona-discount' },
});

const faqItems = [
  { question: "איך מחשבים את ההכנסה הממוצעת?", answer: "לשכיר: ממוצע ההכנסה הברוטו בשנים עשר החודשים שלפני שנת ההנחה. לעצמאי: הכנסה חייבת לפי השומה האחרונה ÷ 12, בהתאמה למדד." },
  { question: "האם ההנחה חלה על כל השטח?", answer: "זה נקבע בצו של כל עירייה. המחשבון מציג חיסכון בהנחה שחלה על כל השטח, ולכן הוא עשוי להיות גבוה מהמציאות." },
  { question: "מי לא נספר בהכנסה?", answer: "הצו מוציא ממנה, בין היתר, קצבת ילדים, קצבת זקנה, קצבת שאירים וחלק מהכנסות ילדים." },
];

export default function Page() {
  return (
    <CalculatorLayout
      pageUrl="/real-estate/arnona-discount"
      title="מחשבון הנחה בארנונה לפי הכנסה"
      description="בדקו לאיזו הנחה בארנונה אתם זכאים לפי הכנסה וגודל משק הבית (30%–90%), וכמה תחסכו, לפי הטבלה הארצית ל־2026."
      breadcrumbs={[
        { label: 'דף הבית', href: '/' },
        { label: "נדל״ן", href: '/real-estate' },
        { label: "הנחה בארנונה לפי הכנסה" },
      ]}
      lastUpdated="2026-11-20"
      quickAnswer={<p>הנחה בארנונה לפי מבחן הכנסה נקבעת לפי הכנסה חודשית ממוצעת ברוטו של משק הבית וגודלו: למשק בית של נפש אחת, עד 3,513 ₪ — עד 90%, עד 4,295 ₪ — 70%, עד 5,076 ₪ — 50% ועד 5,857 ₪ — 30%. ההנחה אינה חובה, והרשות המקומית קובעת בצו את השיעור והשטח שעליו היא חלה.</p>}
      calculator={<FinanceExtraCalculator section="arnonadiscount" />}
      content={
        <>
          <h2>איך מגישים</h2>
          <p>מגישים בקשה לאגף הגבייה של העירייה עם מסמכי הכנסה, ומשלמים את הארנונה עד 31 בדצמבר. מגיעה הנחה אחת בלבד, הגבוהה. לחישוב הארנונה עצמה: <Link href="/real-estate/arnona">מחשבון ארנונה</Link>. לעסקים: <Link href="/real-estate/arnona-business">ארנונה לעסקים</Link>.</p>
          <p>גם ההנחות הסוציאליות האחרות (אזרח ותיק, נכה, עולה) מפורטות בצו של כל עיר ובמחשבון הארנונה.</p>
        </>
      }
      faq={<FAQ items={faqItems} />}
      sources={
        <ul>
          <li><a href="https://www.kolzchut.org.il/he/הנחה_בארנונה_לבעלי_הכנסה_נמוכה" target="_blank" rel="noopener noreferrer">כל זכות — הנחה בארנונה לבעלי הכנסה נמוכה</a></li>
        </ul>
      }
    />
  );
}
