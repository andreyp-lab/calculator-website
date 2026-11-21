import { withPageSocialMetadata } from '@/lib/config/site-info';
import type { Metadata } from 'next';
import Link from 'next/link';
import { CalculatorLayout } from '@/components/calculator/CalculatorLayout';
import { FAQ } from '@/components/calculator/FAQ';
import { FinanceExtraCalculator } from '@/components/calculators/FinanceExtraCalculator';

export const metadata: Metadata = withPageSocialMetadata({
  title: "מחשבון מס על שכר דירה 2026 — פטור, 10% או מדרגות",
  description: "השוו את שלושת מסלולי המס על הכנסה משכר דירה למגורים — פטור, 10% ומדרגות — לפי שכר הדירה וההכנסה האחרת שלכם.",
  alternates: { canonical: '/real-estate/rental-tax-calculator' },
});

const faqItems = [
  { question: "האם אפשר לשלב מסלולים?", answer: "לא על אותה דירה באותה שנה. הבחירה כפופה לתנאי החוק ולדיווח לרשות המסים." },
];

export default function Page() {
  return (
    <CalculatorLayout
      pageUrl="/real-estate/rental-tax-calculator"
      title="מחשבון מס על שכר דירה"
      description="השוו את שלושת מסלולי המס על הכנסה משכר דירה למגורים — פטור, 10% ומדרגות — לפי שכר הדירה וההכנסה האחרת שלכם."
      breadcrumbs={[
        { label: 'דף הבית', href: '/' },
        { label: "נדל״ן", href: '/real-estate' },
        { label: "מס על שכר דירה" },
      ]}
      lastUpdated="2026-11-20"
      quickAnswer={<p>שכר דירה למגורים פטור ממס עד 5,654 ₪ לחודש; מעל זה הפטור נשחק ומתאפס ב־11,308 ₪. מסלול 10% הוא 10% על כל השכר בלי ניכויים. במסלול המדרגות מנכים הוצאות ומשלמים לפי מדרגת המס השולית. המחשבון משווה ובוחר את הזול.</p>}
      calculator={<FinanceExtraCalculator section="rentax" />}
      content={
        <>
          <h2>מי מתאים לכל מסלול</h2>
          <p>מי שהכנסתו האחרת גבוהה והוצאותיו נמוכות יעדיף 10%; בשכר דירה נמוך הפטור עדיף. לפירוט המסלולים: <Link href="/real-estate/rental-income-tax">מדריך מיסוי שכר דירה</Link>. תשואה: <Link href="/real-estate/rental-yield">תשואת שכירות</Link>.</p>
        </>
      }
      faq={<FAQ items={faqItems} />}
      sources={
        <ul>
          <li><a href="https://www.kolzchut.org.il/he/פטור_ממס_על_הכנסה_מהשכרת_דירה_למגורים" target="_blank" rel="noopener noreferrer">כל זכות — פטור ממס על הכנסה מהשכרת דירה</a></li>
        </ul>
      }
    />
  );
}
