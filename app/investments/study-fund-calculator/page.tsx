import { withPageSocialMetadata } from '@/lib/config/site-info';
import type { Metadata } from 'next';
import Link from 'next/link';
import { CalculatorLayout } from '@/components/calculator/CalculatorLayout';
import { FAQ } from '@/components/calculator/FAQ';
import { FinanceExtraCalculator } from '@/components/calculators/FinanceExtraCalculator';

export const metadata: Metadata = withPageSocialMetadata({
  title: "מחשבון קרן השתלמות 2026 — צבירה והטבות מס",
  description: "חשבו כמה תצברו בקרן השתלמות, כמה מס תחסכו כעצמאי (ניכוי 4.5%) ואם ההפקדה בתוך התקרה המוטבת.",
  alternates: { canonical: '/investments/study-fund-calculator' },
});

const faqItems = [
  { question: "מתי אפשר למשוך בלי מס?", answer: "בדרך כלל אחרי תקופת אחזקה שנקבעת בחוק ובכפוף לתקרות. בדקו אצל הגוף המנהל." },
];

export default function Page() {
  return (
    <CalculatorLayout
      pageUrl="/investments/study-fund-calculator"
      title="מחשבון קרן השתלמות"
      description="חשבו כמה תצברו בקרן השתלמות, כמה מס תחסכו כעצמאי (ניכוי 4.5%) ואם ההפקדה בתוך התקרה המוטבת."
      breadcrumbs={[
        { label: 'דף הבית', href: '/' },
        { label: "השקעות", href: '/investments' },
        { label: "קרן השתלמות" },
      ]}
      lastUpdated="2026-11-20"
      quickAnswer={<p>עצמאי מנכה הפקדה לקרן השתלמות עד 4.5% מההכנסה, עד תקרת הכנסה של 293,397 ₪ (ניכוי מרבי 13,203 ₪). תקרת ההפקדה המוטבת לפטור על רווחים היא 20,566 ₪ בשנה. המחשבון מחשב צבירה לפי תשואה והחיסכון במס.</p>}
      calculator={<FinanceExtraCalculator section="studyfund" />}
      content={
        <>
          <h2>מה כלול</h2>
          <p>הניכוי והחיסכון במס מחושבים לפי מדרגות 2026. לצבירה: הפקדות חודשיות וריבית. להשוואה מול פיקדון: <Link href="/compare/keren-hishtalmut-vs-pikadon">קרן השתלמות מול פיקדון</Link>. לשכירים: <Link href="/savings/education-fund-employee">קרן השתלמות לשכיר</Link>.</p>
        </>
      }
      faq={<FAQ items={faqItems} />}
      sources={
        <ul>
          <li><a href="https://www.kolzchut.org.il/he/קרן_השתלמות_לעובד_עצמאי" target="_blank" rel="noopener noreferrer">כל זכות — קרן השתלמות לעובד עצמאי</a></li>
        </ul>
      }
    />
  );
}
