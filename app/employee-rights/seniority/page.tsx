import { withPageSocialMetadata } from '@/lib/config/site-info';
import type { Metadata } from 'next';
import Link from 'next/link';
import { CalculatorLayout } from '@/components/calculator/CalculatorLayout';
import { FAQ } from '@/components/calculator/FAQ';
import { LaborRightsCalculator } from '@/components/calculators/LaborRightsCalculator';

export const metadata: Metadata = withPageSocialMetadata({
  title: "מחשבון ותק בעבודה — ותק, חופשה, הבראה והודעה מוקדמת",
  description: "חשבו ותק תעסוקתי בשנים, חודשים וימים, וראו מה נגזר ממנו: ימי חופשה, ימי הבראה, הודעה מוקדמת, ימי מחלה צבורים ופיצויים.",
  alternates: { canonical: '/employee-rights/seniority' },
});

const faqItems = [
  { question: "איך נספר ותק לחופשה?", answer: "בשנות לוח: מי שהתחיל בינואר ומי שהתחיל באוקטובר באותה שנה נחשבים שניהם בשנת ותק ראשונה באותה שנה." },
  { question: "האם ותק אצל מעסיק קודם נספר?", answer: "בדרך כלל לא, אלא אם נקבע אחרת בהסכם או בהעברת פעילות. בדקו את הנסיבות שלכם." },
];

export default function Page() {
  return (
    <CalculatorLayout
      pageUrl="/employee-rights/seniority"
      title="מחשבון ותק תעסוקתי"
      description="חשבו ותק תעסוקתי בשנים, חודשים וימים, וראו מה נגזר ממנו: ימי חופשה, ימי הבראה, הודעה מוקדמת, ימי מחלה צבורים ופיצויים."
      breadcrumbs={[
        { label: 'דף הבית', href: '/' },
        { label: "זכויות עובדים", href: '/employee-rights' },
        { label: "ותק" },
      ]}
      lastUpdated="2026-11-20"
      quickAnswer={<p>הוותק הוא הזמן שעבדתם אצל אותו מעסיק, והוא קובע חלק מהזכויות: ימי הבראה, הודעה מוקדמת, פיצויים (משנה מלאה) וימי חופשה. חופשה שנתית נספרת בשנות לוח (ינואר עד דצמבר), ולא בחודשים. הזינו תאריך התחלה ותאריך סיום וקבלו ותק מדויק וסיכום זכויות.</p>}
      calculator={<LaborRightsCalculator section="tenure" />}
      content={
        <>
          <h2>מה נגזר מהוותק</h2>
          <ul>
            <li><strong>חופשה שנתית:</strong> לפי שנת הוותק בשנות לוח. ראו <Link href="/employee-rights/annual-leave">מחשבון חופשה</Link>.</li>
            <li><strong>הבראה:</strong> לפי שנות ותק מלאות. ראו <Link href="/employee-rights/recreation-pay">דמי הבראה</Link>.</li>
            <li><strong>הודעה מוקדמת:</strong> לפי חודשי עבודה. ראו <Link href="/employee-rights/notice-period">הודעה מוקדמת</Link>.</li>
            <li><strong>פיצויים:</strong> משנה מלאה. ראו <Link href="/employee-rights/severance">פיצויי פיטורים</Link>.</li>
            <li><strong>ימי מחלה:</strong> 1.5 ליום לחודש עד 90. ראו <Link href="/employee-rights/sick-pay">דמי מחלה</Link>.</li>
          </ul>
          <p>תקופות ללא תשלום אינן נספרות בהודעה מוקדמת, וחופשת לידה נספרת.</p>
        </>
      }
      faq={<FAQ items={faqItems} />}
      sources={
        <ul>
          <li><a href="https://www.kolzchut.org.il/he/חופשה_שנתית" target="_blank" rel="noopener noreferrer">כל זכות — חופשה שנתית</a></li>
          <li><a href="https://www.kolzchut.org.il/he/הודעה_מוקדמת_לפיטורים_או_התפטרות" target="_blank" rel="noopener noreferrer">כל זכות — הודעה מוקדמת</a></li>
        </ul>
      }
    />
  );
}
