import { withPageSocialMetadata } from '@/lib/config/site-info';
import type { Metadata } from 'next';
import Link from 'next/link';
import { CalculatorLayout } from '@/components/calculator/CalculatorLayout';
import { FAQ } from '@/components/calculator/FAQ';
import { FinanceExtraCalculator } from '@/components/calculators/FinanceExtraCalculator';

export const metadata: Metadata = withPageSocialMetadata({
  title: "מחשבון שכירות מול קנייה — השוואת הון לאורך שנים",
  description: "השוו הון בסוף התקופה בקנייה עם משכנתא מול שכירות והשקעת ההון והחיסכון, לפי הנחות על ריבית, שכר דירה, עליית ערך ותשואה.",
  alternates: { canonical: '/real-estate/rent-vs-buy-calculator' },
});

const faqItems = [
  { question: "האם קנייה תמיד עדיפה בטווח ארוך?", answer: "לא. זה תלוי במחיר היחסי, בריבית, בעליית הערך ובתשואה החלופית." },
];

export default function Page() {
  return (
    <CalculatorLayout
      pageUrl="/real-estate/rent-vs-buy-calculator"
      title="מחשבון שכירות מול קנייה"
      description="השוו הון בסוף התקופה בקנייה עם משכנתא מול שכירות והשקעת ההון והחיסכון, לפי הנחות על ריבית, שכר דירה, עליית ערך ותשואה."
      breadcrumbs={[
        { label: 'דף הבית', href: '/' },
        { label: "נדל״ן", href: '/real-estate' },
        { label: "שכירות מול קנייה" },
      ]}
      lastUpdated="2026-11-20"
      quickAnswer={<p>השוואה הוגנת בין קנייה לשכירות בודקת את ההון בסוף התקופה: בקנייה — שווי הדירה פחות יתרת משכנתא ועלויות; בשכירות — ההון העצמי וההפרש החודשי מושקעים. התוצאה תלויה בהנחות, ולכן כדאי לנסות כמה תרחישים.</p>}
      calculator={<FinanceExtraCalculator section="rentbuy" />}
      content={
        <>
          <h2>איך לקרוא את התוצאה</h2>
          <p>המחשבון אינו מנבא את השוק. שנו את עליית ערך הדירה, התשואה על ההשקעה והריבית וראו מתי התוצאה מתהפכת. למדריך: <Link href="/compare/rent-vs-buy">שכירות מול קנייה</Link>; למשכנתא: <Link href="/real-estate/mortgage">מחשבון משכנתא</Link>; למס: <Link href="/real-estate/purchase-tax">מס רכישה</Link>.</p>
        </>
      }
      faq={<FAQ items={faqItems} />}

    />
  );
}
