import { withPageSocialMetadata } from '@/lib/config/site-info';
import type { Metadata } from 'next';
import Link from 'next/link';
import { CalculatorLayout } from '@/components/calculator/CalculatorLayout';
import { FAQ } from '@/components/calculator/FAQ';
import { FinanceExtraCalculator } from '@/components/calculators/FinanceExtraCalculator';

export const metadata: Metadata = withPageSocialMetadata({
  title: "מחשבון תשואת שכירות — ברוטו ונטו על נכס להשקעה",
  description: "חשבו תשואה ברוטו ונטו על דירה להשקעה לפי מחיר, עלויות רכישה, שכר דירה, חודשים ריקים והוצאות, וראו תוך כמה שנים ההשקעה חוזרת.",
  alternates: { canonical: '/real-estate/rental-yield' },
});

const faqItems = [
  { question: "מה תשואת שכירות טובה בישראל?", answer: "אין מספר אחד. התשואה משתנה בין אזורים וסוגי נכסים, ויש להשוות אותה להחזר המשכנתא ולחלופות השקעה." },
];

export default function Page() {
  return (
    <CalculatorLayout
      pageUrl="/real-estate/rental-yield"
      title="מחשבון תשואת שכירות"
      description="חשבו תשואה ברוטו ונטו על דירה להשקעה לפי מחיר, עלויות רכישה, שכר דירה, חודשים ריקים והוצאות, וראו תוך כמה שנים ההשקעה חוזרת."
      breadcrumbs={[
        { label: 'דף הבית', href: '/' },
        { label: "נדל״ן", href: '/real-estate' },
        { label: "תשואת שכירות" },
      ]}
      lastUpdated="2026-11-20"
      quickAnswer={<p>תשואה ברוטו = שכר דירה שנתי ÷ מחיר הנכס. תשואה נטו = (שכר דירה אחרי חודשים ריקים − הוצאות) ÷ (מחיר + עלויות רכישה). למשל, דירה ב־2 מיליון ₪ עם שכר דירה של 6,000 ₪: תשואה ברוטו 3.6%.</p>}
      calculator={<FinanceExtraCalculator section="yield" />}
      content={
        <>
          <h2>מה כולל החישוב</h2>
          <p>הנטו מנכה חודשים ריקים והוצאות שוטפות (<Link href="/real-estate/arnona">ארנונה</Link>, ועד, ביטוח, תחזוקה), ומחשב על כל הכסף שהושקע כולל <Link href="/real-estate/purchase-tax">מס רכישה</Link>. לפני מס על השכירות: ראו <Link href="/real-estate/rental-tax-calculator">מס על שכר דירה</Link>.</p>
          <p>להשוואה מול קנייה לשימוש עצמי: <Link href="/real-estate/rent-vs-buy-calculator">שכירות מול קנייה</Link>.</p>
        </>
      }
      faq={<FAQ items={faqItems} />}

    />
  );
}
