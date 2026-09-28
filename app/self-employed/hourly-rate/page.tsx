import type { Metadata } from 'next';
import Link from 'next/link';
import { CalculatorLayout } from '@/components/calculator/CalculatorLayout';
import { HourlyRateBasicCalculator } from '@/components/calculators/HourlyRateBasicCalculator';

export const metadata: Metadata = {
  title: 'מחשבון יעד הכנסה לשעת עבודה לעצמאי',
  description: 'חלוקת יעד ההכנסות החודשי במספר שעות שניתן לחייב בפועל; מדריך לאיסוף העלויות לפני קביעת תעריף.',
  alternates: { canonical: '/self-employed/hourly-rate' },
};

export default function HourlyRatePage() {
  return <CalculatorLayout
    title="תכנון תעריף לשעת עבודה"
    description="בדקו מהו יעד ההכנסה לשעת חיוב לפי יעד הכנסות ושעות שניתן למכור בפועל."
    breadcrumbs={[{ label: 'דף הבית', href: '/' }, { label: 'עצמאים', href: '/self-employed' }, { label: 'תמחור שעה' }]}
    lastUpdated="2026-09-28"
    quickAnswer={<p>מחלקים את יעד ההכנסות החודשי במספר שעות החיוב הצפויות. אם היעד הוא 24,000 ₪ לפני מע״מ ויש 120 שעות חיוב, היעד החשבוני הוא 200 ₪ לשעה. את יעד ההכנסות צריך לקבוע לאחר בחינת העלויות, מסים, זמני עבודה שאינם ניתנים לחיוב וסיכון עסקי.</p>}
    calculator={<HourlyRateBasicCalculator />}
    content={<>
      <h2>איך לבנות יעד הכנסות חודשי?</h2>
      <p>אספו הוצאות קבועות ומשתנות לפי הצעות מחיר וחשבוניות, הוסיפו את הסכום הדרוש למחיה ואת העתודות שתבחרו, ובקשו ממייצג אומדן מס ודמי ביטוח לפי הנתונים האישיים. אל תניחו שכל שעות העבודה זמינות לחיוב: שיווק, שירות לקוחות, ניהול, הדרכה והיעדרויות מצמצמים את מספר השעות שתוכלו למכור.</p>
      <p>החישוב כאן הוא כלי לתכנון מחיר רצוי בלבד. המחיר שתוכלו לגבות תלוי בביקוש, בהצעת הערך, בתנאי החוזה ובהשוואה להצעות רלוונטיות ועדכניות. אין בדף תעריפי שוק מאומתים לשנת 2026.</p>
      <h2>בדיקה לפני הצעת מחיר</h2>
      <ul>
        <li>בדקו אם הצעת המחיר ללקוח מוצגת כולל מע״מ או בתוספת מע״מ, לפי סוג הלקוח והחובות החלות.</li>
        <li>הגדירו מה כלול במחיר, שעות נוספות, תשלומים על שינויי היקף ומועד הגבייה.</li>
        <li>השוו הכנסה בפועל בשעות חיוב שבוצעו ליעד, ועדכנו את התכנון לאורך השנה.</li>
      </ul>
      <p><Link href="/self-employed/vat" className="text-gold underline">חישוב הוספה וחילוץ של מע״מ</Link> · <Link href="/self-employed/net" className="text-gold underline">אילו נתונים נדרשים לבדיקת הכנסה פנויה</Link></p>
      <p><Link href="/course/self-employed" className="text-gold underline">הקורס לניהול כספים לעצמאים</Link></p>
    </>}
  />;
}
