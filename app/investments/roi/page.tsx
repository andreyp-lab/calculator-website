import type { Metadata } from 'next';
import { CalculatorLayout } from '@/components/calculator/CalculatorLayout';
import { ROICalculator } from '@/components/calculators/ROICalculator';

export const metadata: Metadata = {
  title: 'מחשבון ROI — רווח ביחס לעלות השקעה',
  description: 'חשבו רווח או הפסד ביחס לעלות שהזנתם, עם שיעור שנתי שקול לתקופה ומגבלות החישוב.',
  alternates: { canonical: '/investments/roi' },
};

export default function ROIPage() {
  return (
    <CalculatorLayout
      title="מחשבון ROI — תשואה ביחס לעלות"
      description="חישוב אריתמטי על סכומי השקעה, תמורה, הכנסות ועלויות שהזנתם. המחשבון אינו מעריך מס או כדאיות השקעה."
      breadcrumbs={[
        { label: 'דף הבית', href: '/' },
        { label: 'השקעות', href: '/investments' },
        { label: 'ROI' },
      ]}
      lastUpdated="2026-09-28"
      pageUrl="/investments/roi"
      calculator={<ROICalculator />}
      quickAnswer={
        <p>
          ROI מחלק את ההפרש בין התמורה הכוללת לעלות הכוללת בעלות הכוללת. לדוגמה
          מתמטית: עלות 100,000 ₪ ותמורה 150,000 ₪ נותנות ROI של 50% לפני עלויות
          שלא הוזנו. השיעור השנתי השקול מניח סכום התחלתי וסכום סופי בלבד.
        </p>
      }
      content={
        <>
          <h2>מה להזין?</h2>
          <p>
            הזינו סכומים אמיתיים להשקעה, תמורה, הכנסות נוספות ועלויות. אין בדף חישוב
            עצמאי של מס, עמלות או אינפלציה. אם הזנתם מס בעלויות, בדקו שאינו נכלל שוב
            בשדה אחר. השוואה בין השקעות דורשת גם בדיקת סיכון ונזילות.
          </p>
          <h2>מגבלת השיעור השנתי</h2>
          <p>
            החישוב השנתי משקף שיעור שקול בין עלות כוללת לתמורה בסוף התקופה. הוא אינו
            IRR: אם הפקדתם או משכתם כסף במועדים שונים, יש להביא בחשבון את תאריכי
            התזרים בנפרד. הערכת שווי נכס שעדיין לא נמכר אינה תמורה שהתקבלה בפועל.
          </p>
        </>
      }
      sources={
        <ul>
          <li><a href="https://www.finra.org/investors/investing/investing-basics/risk" target="_blank" rel="noopener noreferrer">FINRA — סיכוני השקעה</a></li>
        </ul>
      }
    />
  );
}
