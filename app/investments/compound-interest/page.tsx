import type { Metadata } from 'next';
import { CalculatorLayout } from '@/components/calculator/CalculatorLayout';
import { CompoundInterestCalculator } from '@/components/calculators/CompoundInterestCalculator';

export const metadata: Metadata = {
  title: 'מחשבון ריבית דריבית — השוואת תרחישי חיסכון',
  description: 'בדקו כיצד הפקדות, משך זמן והנחות תשואה ואינפלציה משפיעים על סכום חיסכון תיאורטי.',
  alternates: { canonical: '/investments/compound-interest' },
};

export default function CompoundInterestPage() {
  return (
    <CalculatorLayout
      title="מחשבון ריבית דריבית"
      description="תרחיש מתמטי לפי נתונים והנחות שאתם בוחרים. אין כאן תחזית תשואה או אומדן מס אישי."
      breadcrumbs={[
        { label: 'דף הבית', href: '/' },
        { label: 'השקעות', href: '/investments' },
        { label: 'ריבית דריבית' },
      ]}
      lastUpdated="2026-09-28"
      pageUrl="/investments/compound-interest"
      calculator={<CompoundInterestCalculator />}
      quickAnswer={
        <p>
          ריבית דריבית פירושה שתשואה על הקרן והסכומים שנצברו משפיעה גם על התקופות הבאות.
          שנו את שיעור התשואה והאינפלציה כדי לראות רגישות לתרחישים שונים. המחשבון מניח
          שיעור קבוע בכל שנה, ואינו מנבא תנודות, עמלות, דמי ניהול או מס אישי.
        </p>
      }
      content={
        <>
          <h2>איך לפרש את התוצאה?</h2>
          <p>
            הסכום הנומינלי הוא תוצאה של הנוסחה ושל ההפקדות שהוזנו. הערך הריאלי מחלק אותו
            בגורם האינפלציה שהזנתם, כדי להציג כוח קנייה משוער בערכי היום. גם שיעור התשואה
            וגם שיעור האינפלציה הם הנחות; התוצאה בפועל עשויה להיות שונה באופן משמעותי.
          </p>
          <h2>לפני החלטת השקעה</h2>
          <p>
            בדקו אופק, סיכון, נזילות, עלויות ומיסוי של המוצר המסוים. שיעור תשואה היסטורי
            או תרחיש מתמטי אינו הבטחה. מיסוי השקעות תלוי בסוג המוצר, במועדי הפעולות
            ובנסיבות האישיות, ולכן אינו מחושב בדף זה.
          </p>
        </>
      }
      sources={
        <ul>
          <li><a href="https://www.cbs.gov.il/he/cbsNewBrand/Pages/Calculator.aspx" target="_blank" rel="noopener noreferrer">הלמ״ס — מחשבון הצמדה למדד</a></li>
          <li><a href="https://www.finra.org/investors/investing/investing-basics/risk" target="_blank" rel="noopener noreferrer">FINRA — סיכון והשקעות</a></li>
        </ul>
      }
    />
  );
}
