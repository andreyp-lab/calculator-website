import { withPageSocialMetadata } from '@/lib/config/site-info';
import type { Metadata } from 'next';
import Link from 'next/link';
import { CalculatorLayout } from '@/components/calculator/CalculatorLayout';
import { FAQ } from '@/components/calculator/FAQ';
import { FinanceExtraCalculator } from '@/components/calculators/FinanceExtraCalculator';

export const metadata: Metadata = withPageSocialMetadata({
  title: "מחשבון הלוואה — שפיצר, קרן שווה ובלון עם לוח סילוקין",
  description: "חשבו החזר חודשי, ריבית כוללת ולוח סילוקין להלוואה בשיטת שפיצר, קרן שווה או בלון, והשוו ביניהן.",
  alternates: { canonical: '/savings/loan-methods' },
});

const faqItems = [
  { question: "איזו שיטה זולה יותר?", answer: "קרן שווה זולה יותר בסך הריבית כי הקרן יורדת מהר, אבל התשלום הראשון גבוה. שפיצר נוח לתקציב קבוע. בלון יקר בדרך כלל ומסוכן אם אין מימון לתשלום האחרון." },
  { question: "האם המחשבון כולל עמלות והצמדה?", answer: "לא. הוא מניח ריבית קבועה ללא עמלות והצמדה." },
];

export default function Page() {
  return (
    <CalculatorLayout
      pageUrl="/savings/loan-methods"
      title="מחשבון הלוואה בשלוש שיטות"
      description="חשבו החזר חודשי, ריבית כוללת ולוח סילוקין להלוואה בשיטת שפיצר, קרן שווה או בלון, והשוו ביניהן."
      breadcrumbs={[
        { label: 'דף הבית', href: '/' },
        { label: "חיסכון וחובות", href: '/savings' },
        { label: "הלוואה בשלוש שיטות" },
      ]}
      lastUpdated="2026-11-20"
      quickAnswer={<p>בשפיצר ההחזר החודשי קבוע; בקרן שווה הקרן מוחזרת בשווה וההחזר יורד עם הזמן ולכן סך הריבית נמוך יותר; בבלון משלמים ריבית ועיקר הקרן בסוף. למשל, 100,000 ₪ בריבית 6% ל־60 חודשים בשפיצר: כ־1,933 ₪ בחודש וכ־16,000 ₪ ריבית.</p>}
      calculator={<FinanceExtraCalculator section="loan" />}
      content={
        <>
          <h2>איך עובדת כל שיטה</h2>
          <ul>
            <li><strong>שפיצר:</strong> תשלום קבוע; בתחילה רוב התשלום ריבית ובהמשך קרן.</li>
            <li><strong>קרן שווה:</strong> קרן קבועה בכל חודש וריבית על היתרה, ולכן התשלום הראשון הגבוה ביותר.</li>
            <li><strong>בלון:</strong> ריבית בלבד (או אחוז מהקרן בשפיצר) והקרן נפרעת בתשלום האחרון.</li>
          </ul>
          <p>להחזר לפי יכולת: <Link href="/savings/loan-repayment">מחשבון החזר הלוואה</Link>. אם אתם במינוס: <Link href="/savings/overdraft">מחשבון מינוס</Link>. לסגירת חוב: <Link href="/savings/debt-payoff">סילוק חוב</Link>.</p>
        </>
      }
      faq={<FAQ items={faqItems} />}

    />
  );
}
