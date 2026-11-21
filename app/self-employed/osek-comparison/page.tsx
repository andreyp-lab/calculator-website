import { withPageSocialMetadata } from '@/lib/config/site-info';
import type { Metadata } from 'next';
import Link from 'next/link';
import { CalculatorLayout } from '@/components/calculator/CalculatorLayout';
import { FAQ } from '@/components/calculator/FAQ';
import { FinanceExtraCalculator } from '@/components/calculators/FinanceExtraCalculator';

export const metadata: Metadata = withPageSocialMetadata({
  title: "מחשבון עוסק פטור מול עוסק מורשה — מה משתלם",
  description: "השוו נטו בכיס של עוסק פטור ועוסק מורשה לפי הכנסה, הוצאות וסוג הלקוחות, כולל מס הכנסה וביטוח לאומי.",
  alternates: { canonical: '/self-employed/osek-comparison' },
});

const faqItems = [
  { question: "מתי חייבים להיות עוסק מורשה?", answer: "מעל תקרת המחזור לעוסק פטור, וגם בענפים מסוימים או כשהלקוחות דורשים חשבונית מס. ראו את מדריך התקרה." },
];

export default function Page() {
  return (
    <CalculatorLayout
      pageUrl="/self-employed/osek-comparison"
      title="עוסק פטור מול עוסק מורשה: מחשבון השוואה"
      description="השוו נטו בכיס של עוסק פטור ועוסק מורשה לפי הכנסה, הוצאות וסוג הלקוחות, כולל מס הכנסה וביטוח לאומי."
      breadcrumbs={[
        { label: 'דף הבית', href: '/' },
        { label: "עצמאים", href: '/self-employed' },
        { label: "עוסק פטור מול מורשה" },
      ]}
      lastUpdated="2026-11-20"
      quickAnswer={<p>עוסק פטור אינו גובה מע״מ אך גם אינו מקזז מע״מ תשומות; עוסק מורשה גובה מע״מ ומקזז. מי שלקוחותיו עסקים והוצאותיו גבוהות נהנה בדרך כלל ממורשה; מי שמוכר לצרכנים פרטיים במחיר סופי מפסיד 18/118 מהמחיר. תקרת עוסק פטור ב־2026: 122,833 ₪ בשנה.</p>}
      calculator={<FinanceExtraCalculator section="osek" />}
      content={
        <>
          <h2>איך המחשבון מחשב</h2>
          <p>מס הכנסה לפי מדרגות 2026 עם נקודות זיכוי, וביטוח לאומי ובריאות לעצמאי לפי השיעורים. ההכנסה והוצאות מוזנות לפני מע״מ.</p>
          <p>למדריכים: <Link href="/compare/osek-patur-vs-murshe">עוסק פטור מול מורשה</Link>, <Link href="/self-employed/vat-threshold">תקרת עוסק פטור</Link>, <Link href="/self-employed/vat">מע״מ</Link>, <Link href="/self-employed/net">חישוב נטו לעצמאי</Link>.</p>
        </>
      }
      faq={<FAQ items={faqItems} />}

    />
  );
}
