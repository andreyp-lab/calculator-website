import { withPageSocialMetadata } from '@/lib/config/site-info';
import type { Metadata } from 'next';
import Link from 'next/link';
import { CalculatorLayout } from '@/components/calculator/CalculatorLayout';
import { FAQ } from '@/components/calculator/FAQ';
import { FinanceExtraCalculator } from '@/components/calculators/FinanceExtraCalculator';

export const metadata: Metadata = withPageSocialMetadata({
  title: "מחשבון מחזור משכנתא — כמה תחסכו ומתי זה משתלם",
  description: "חשבו כמה תחסכו בהחזר החודשי ובסך הכול ממחזור משכנתא, אחרי עמלות, ומתי מגיעים לנקודת איזון.",
  alternates: { canonical: '/real-estate/refinance-calculator' },
});

const faqItems = [
  { question: "האם הארכת התקופה מקטינה את ההחזר?", answer: "כן, אך מגדילה את סך הריבית. המחשבון מציג את החיסכון הכולל אחרי העלויות." },
];

export default function Page() {
  return (
    <CalculatorLayout
      pageUrl="/real-estate/refinance-calculator"
      title="מחשבון מחזור משכנתא"
      description="חשבו כמה תחסכו בהחזר החודשי ובסך הכול ממחזור משכנתא, אחרי עמלות, ומתי מגיעים לנקודת איזון."
      breadcrumbs={[
        { label: 'דף הבית', href: '/' },
        { label: "נדל״ן", href: '/real-estate' },
        { label: "מחזור משכנתא" },
      ]}
      lastUpdated="2026-11-20"
      quickAnswer={<p>מחזור משתלם כשהחיסכון החודשי מחזיר את עלויות המחזור (עמלת פירעון מוקדם, שמאות, עו״ד) בזמן סביר. נקודת האיזון = סך העלויות ÷ החיסכון החודשי. כדאי שתהיה קצרה מהזמן שאתם מתכוונים להישאר בהלוואה.</p>}
      calculator={<FinanceExtraCalculator section="refinance" />}
      content={
        <>
          <h2>מה לבדוק לפני מחזור</h2>
          <p>עמלת פירעון מוקדם בכל מסלול, תקופת ההלוואה החדשה, והאם התמהיל החדש מתאים לסיכון שלכם. ראו <Link href="/real-estate/mortgage/guide/refinance-cost">עלות מחזור משכנתא</Link>, <Link href="/real-estate/mortgage/guide/prepayment-fee">עמלת פירעון מוקדם</Link> ו<Link href="/real-estate/mortgage">מחשבון משכנתא</Link>.</p>
        </>
      }
      faq={<FAQ items={faqItems} />}

    />
  );
}
