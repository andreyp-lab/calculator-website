import { withPageSocialMetadata } from '@/lib/config/site-info';
import type { Metadata } from 'next';
import Link from 'next/link';
import { CalculatorLayout } from '@/components/calculator/CalculatorLayout';
import { FAQ } from '@/components/calculator/FAQ';
import { LaborRightsCalculator } from '@/components/calculators/LaborRightsCalculator';

export const metadata: Metadata = withPageSocialMetadata({
  title: "מחשבון שעות עבודה — זמן נטו אחרי הפסקות ושעות נוספות",
  description: "חשבו שעות עבודה נטו אחרי הפסקה, כולל משמרת חוצת חצות, וקבלו פיצול לשעות רגילות ונוספות ואומדן תשלום.",
  alternates: { canonical: '/employee-rights/work-hours' },
});

const faqItems = [
  { question: "האם הפסקה נספרת כשעת עבודה?", answer: "תלוי בהסדר: הפסקה בתשלום נספרת, הפסקה שאינה בתשלום אינה נספרת. הזינו במחשבון רק הפסקה שאינה נחשבת לעבודה." },
  { question: "איך מחשבים משמרת לילה?", answer: "הזינו שעת סיום מוקדמת מהתחלה, והמחשבון יחשב חציית חצות." },
];

export default function Page() {
  return (
    <CalculatorLayout
      pageUrl="/employee-rights/work-hours"
      title="מחשבון שעות עבודה"
      description="חשבו שעות עבודה נטו אחרי הפסקה, כולל משמרת חוצת חצות, וקבלו פיצול לשעות רגילות ונוספות ואומדן תשלום."
      breadcrumbs={[
        { label: 'דף הבית', href: '/' },
        { label: "זכויות עובדים", href: '/employee-rights' },
        { label: "שעות עבודה" },
      ]}
      lastUpdated="2026-11-20"
      quickAnswer={<p>שעות העבודה נטו הן הזמן בין תחילת המשמרת לסיומה, פחות ההפסקה. אם הסיום קטן מההתחלה המשמרת חוצה חצות. שעות מעל יום העבודה הרגיל הן שעות נוספות: שתי הראשונות ב־125% וכל אחת אחריהן ב־150%.</p>}
      calculator={<LaborRightsCalculator section="hours" />}
      content={
        <>
          <h2>איך מחשבים</h2>
          <p>מחסרים את שעת ההתחלה משעת הסיום, ומורידים את זמן ההפסקה. הזינו שכר חודשי כדי לקבל אומדן לשעות הנוספות לפי שכר שעתי של משרה מלאה.</p>
          <h2>המשך</h2>
          <p>לחישוב חודש שלם עם משמרות מגוונות: <Link href="/employee-rights/overtime">שעות נוספות</Link>. לשכר שעתי מול חודשי: <Link href="/personal-tax/salary-net-gross">ברוטו נטו</Link>.</p>
        </>
      }
      faq={<FAQ items={faqItems} />}
      sources={
        <ul>
          <li><a href="https://www.nevo.co.il/law_html/law01/p275_001.htm" target="_blank" rel="noopener noreferrer">חוק שעות עבודה ומנוחה</a></li>
        </ul>
      }
    />
  );
}
