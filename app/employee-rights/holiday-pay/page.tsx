import { withPageSocialMetadata } from '@/lib/config/site-info';
import type { Metadata } from 'next';
import Link from 'next/link';
import { CalculatorLayout } from '@/components/calculator/CalculatorLayout';
import { FAQ } from '@/components/calculator/FAQ';
import { LaborRightsCalculator } from '@/components/calculators/LaborRightsCalculator';

export const metadata: Metadata = withPageSocialMetadata({
  title: "מחשבון דמי חגים — כמה מגיע לעובד שעתי או יומי",
  description: "חשבו דמי חגים לעובד שעתי או יומי: תנאי הזכאות (3 חודשים, עבודה לפני ואחרי) והסכום לפי ממוצע השעות היומי.",
  alternates: { canonical: '/employee-rights/holiday-pay' },
});

const faqItems = [
  { question: "כמה ימי חג יש?", answer: "תשעה: ראש השנה (2), יום כיפור (1), סוכות (2), פסח (2), יום העצמאות (1) ושבועות (1)." },
  { question: "מה קורה כשחג חל בשישי או בשבת?", answer: "עובד שעתי או יומי אינו זכאי לתשלום על חג כזה, אלא אם מקום העבודה עובד באותו יום." },
  { question: "האם אפשר לוותר על דמי חגים?", answer: "לא. הזכות אינה ניתנת לוויתור." },
];

export default function Page() {
  return (
    <CalculatorLayout
      pageUrl="/employee-rights/holiday-pay"
      title="מחשבון דמי חגים"
      description="חשבו דמי חגים לעובד שעתי או יומי: תנאי הזכאות (3 חודשים, עבודה לפני ואחרי) והסכום לפי ממוצע השעות היומי."
      breadcrumbs={[
        { label: 'דף הבית', href: '/' },
        { label: "זכויות עובדים", href: '/employee-rights' },
        { label: "דמי חגים" },
      ]}
      lastUpdated="2026-11-20"
      quickAnswer={<p>עובד שעתי או יומי זכאי לשכר של יום עבודה רגיל על כל אחד מתשעת ימי החג, אם עבד לפחות 3 חודשים במקום העבודה, היה אמור לעבוד ביום החג, ועבד ביום שלפניו וביום שאחריו (או נעדר בהסכמת המעסיק). הסכום הוא ממוצע שעות העבודה היומי כפול השכר השעתי. עובד חודשי מקבל את משכורתו כרגיל ואינו מקבל תשלום נפרד.</p>}
      calculator={<LaborRightsCalculator section="holiday" />}
      content={
        <>
          <h2>מי זכאי לדמי חגים</h2>
          <p>דמי חגים משולמים לעובדים שעתיים, יומיים ובקבלנות. עובד בשכר חודשי מקבל את משכורתו כרגיל בימי החג ואינו נדרש לנצל ימי חופשה עבורם.</p>
          <h2>איך מחשבים</h2>
          <p>מחלקים את סך שעות העבודה בתקופה (בדרך כלל 3 חודשים) במספר ימי העבודה, ומכפילים בשכר השעתי. הפסיקה אינה מכריעה אם תקופת הממוצע היא 3 או 12 חודשים.</p>
          <h2>קשר למחשבונים אחרים</h2>
          <p>שכר ושעות: <Link href="/employee-rights/overtime">שעות נוספות</Link>, <Link href="/employee-rights/work-hours">שעות עבודה</Link>. חישוב ותק: <Link href="/employee-rights/seniority">ותק תעסוקתי</Link>.</p>
        </>
      }
      faq={<FAQ items={faqItems} />}
      sources={
        <ul>
          <li><a href="https://www.kolzchut.org.il/he/דמי_חגים" target="_blank" rel="noopener noreferrer">כל זכות — דמי חגים</a></li>
          <li><a href="https://www.kolzchut.org.il/he/חגים_יהודיים" target="_blank" rel="noopener noreferrer">כל זכות — חגים יהודיים</a></li>
        </ul>
      }
    />
  );
}
