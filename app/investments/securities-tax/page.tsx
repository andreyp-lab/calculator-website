import { withPageSocialMetadata } from '@/lib/config/site-info';
import type { Metadata } from 'next';
import Link from 'next/link';
import { CalculatorLayout } from '@/components/calculator/CalculatorLayout';
import { FAQ } from '@/components/calculator/FAQ';
import { FinanceExtraCalculator } from '@/components/calculators/FinanceExtraCalculator';

export const metadata: Metadata = withPageSocialMetadata({
  title: "מחשבון מס רווחי הון על ניירות ערך — מניות, קרנות ואג״ח",
  description: "חשבו מס על רווח ממכירת מניות וקרנות: 25% על הרווח הריאלי (אחרי ניכוי האינפלציה), 30% לבעל מניות מהותי, 15% על נייר לא צמוד, ומס יסף.",
  alternates: { canonical: '/investments/securities-tax' },
});

const faqItems = [
  { question: "מה ההבדל בין רווח ריאלי לנומינלי?", answer: "נומינלי הוא ההפרש בין מחיר המכירה לרכישה; ריאלי מנכה ממנו את האינפלציה, ולכן המס נמוך יותר בתקופות של עליית מחירים." },
  { question: "מי בעל מניות מהותי?", answer: "מי שמחזיק 10% או יותר מאמצעי השליטה בחברה, ישירות או בעקיפין." },
  { question: "האם אפשר לקזז הפסדים?", answer: "כן, הפסד הון מקוזז מרווחי הון לפי כללי החוק. המחשבון אינו מחשב קיזוז." },
];

export default function Page() {
  return (
    <CalculatorLayout
      pageUrl="/investments/securities-tax"
      title="מחשבון מס רווחי הון על ניירות ערך"
      description="חשבו מס על רווח ממכירת מניות וקרנות: 25% על הרווח הריאלי (אחרי ניכוי האינפלציה), 30% לבעל מניות מהותי, 15% על נייר לא צמוד, ומס יסף."
      breadcrumbs={[
        { label: 'דף הבית', href: '/' },
        { label: "השקעות", href: '/investments' },
        { label: "מס על ניירות ערך" },
      ]}
      lastUpdated="2026-11-20"
      quickAnswer={<p>על רווח ממכירת מניות, קרנות סל ונייר צמוד משלמים 25% על הרווח הריאלי, כלומר אחרי ניכוי הסכום האינפלציוני (מחיר הרכישה כפול שינוי המדד). בעל מניות מהותי משלם 30%, ונייר לא צמוד 15% על הרווח הנומינלי. מעל סף ההכנסה השנתי נוסף מס יסף. המחשבון מחשב את המדד אוטומטית מנתוני הלמ״ס.</p>}
      calculator={<FinanceExtraCalculator section="securities" />}
      content={
        <>
          <h2>איך מחושב הרווח הריאלי</h2>
          <p>רווח נומינלי = מחיר מכירה − מחיר רכישה − עמלות. הסכום האינפלציוני = מחיר הרכישה × שינוי המדד מהרכישה עד המכירה, והוא פטור. הרווח הריאלי = הנומינלי פחות האינפלציוני. את שינוי המדד אפשר לראות גם ב<Link href="/savings/cpi-linkage">מחשבון ההצמדה למדד</Link>.</p>
          <p>ראו גם: <Link href="/investments/capital-gains-tax">מס רווחי הון</Link>, <Link href="/personal-tax/crypto-tax">מס על קריפטו</Link>, <Link href="/investments/roi">תשואה על השקעה</Link>.</p>
        </>
      }
      faq={<FAQ items={faqItems} />}
      sources={
        <ul>
          <li><a href="https://leumi.co.il/Articles/9236" target="_blank" rel="noopener noreferrer">בנק לאומי — מיסוי ניירות ערך</a></li>
          <li><a href="https://api.cbs.gov.il/index/data/price?id=120010&format=json&download=false" target="_blank" rel="noopener noreferrer">הלמ״ס — מדד המחירים לצרכן</a></li>
        </ul>
      }
    />
  );
}
