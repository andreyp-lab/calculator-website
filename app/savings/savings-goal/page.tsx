import { withPageSocialMetadata } from '@/lib/config/site-info';
import type { Metadata } from 'next';
import Link from 'next/link';
import { CalculatorLayout } from '@/components/calculator/CalculatorLayout';
import { FAQ } from '@/components/calculator/FAQ';
import { FinanceExtraCalculator } from '@/components/calculators/FinanceExtraCalculator';

export const metadata: Metadata = withPageSocialMetadata({
  title: "מחשבון חיסכון — כמה יהיה לי וכמה צריך לחסוך ליעד",
  description: "חשבו כמה כסף יצטבר מהפקדה חודשית עם ריבית, כולל ערך ריאלי אחרי אינפלציה, וכמה צריך לחסוך בחודש כדי להגיע ליעד.",
  alternates: { canonical: '/savings/savings-goal' },
});

const faqItems = [
  { question: "מהי תשואה ריאלית?", answer: "תשואה אחרי אינפלציה. אם התשואה 6% והאינפלציה 2%, התשואה הריאלית כ־3.9%." },
  { question: "האם המחשבון כולל מס?", answer: "לא. על רווחים בחיסכון חל לרוב מס; בדקו לפי המוצר." },
];

export default function Page() {
  return (
    <CalculatorLayout
      pageUrl="/savings/savings-goal"
      title="מחשבון חיסכון ויעד חיסכון"
      description="חשבו כמה כסף יצטבר מהפקדה חודשית עם ריבית, כולל ערך ריאלי אחרי אינפלציה, וכמה צריך לחסוך בחודש כדי להגיע ליעד."
      breadcrumbs={[
        { label: 'דף הבית', href: '/' },
        { label: "חיסכון וחובות", href: '/savings' },
        { label: "יעד חיסכון" },
      ]}
      lastUpdated="2026-11-20"
      quickAnswer={<p>ערך עתידי = סכום פתיחה × (1+r)ⁿ + הפקדה × ((1+r)ⁿ−1)/r, כשr הריבית החודשית. 1,000 ₪ בחודש ל־10 שנים בתשואה של 6% מגיעים לכ־164,000 ₪, מתוכם 120,000 ₪ הפקדות. הערך הריאלי נמוך יותר בגלל אינפלציה.</p>}
      calculator={<FinanceExtraCalculator section="goal" />}
      content={
        <>
          <h2>איך משתמשים</h2>
          <p>הזינו סכום פתיחה, הפקדה חודשית, תשואה שנתית ושנים וקבלו את הסכום בסוף. להפך: הזינו יעד וקבלו את ההפקדה החודשית הדרושה.</p>
          <p>להשוואת מוצרי חיסכון: <Link href="/savings/bank-deposit">פיקדון</Link>, <Link href="/savings/money-market-fund">קרן כספית</Link>, <Link href="/investments/compound-interest">ריבית דריבית</Link>, <Link href="/savings/cpi-linkage">הצמדה למדד</Link>.</p>
        </>
      }
      faq={<FAQ items={faqItems} />}

    />
  );
}
