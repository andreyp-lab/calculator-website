import { Metadata } from 'next';
import { CalculatorLayout } from '@/components/calculator/CalculatorLayout';
import { ROICalculator } from '@/components/calculators/ROICalculator';
import { FAQ } from '@/components/calculator/FAQ';

export const metadata: Metadata = {
  title: 'מחשבון ROI - תשואה על השקעה | FinCalc',
  description:
    'חשב את ROI (Return on Investment) על כל השקעה - מניות, נדל"ן, עסק. כולל ROI שנתי מנורמל.',
  alternates: { canonical: '/investments/roi' },
};

const faqItems = [
  {
    question: 'מהו ROI?',
    answer:
      'ROI (Return on Investment) הוא יחס הרווח להשקעה הראשונית - המדד הכי בסיסי לכדאיות השקעה. הנוסחה: ROI = (רווח נטו / עלות) × 100. למשל: השקעה של 100,000 ₪ שגדלה ל-150,000 ₪ = ROI של 50%.',
  },
  {
    question: 'מה ההבדל בין ROI כולל ל-ROI שנתי?',
    answer:
      'ROI כולל מודד את הרווח הכולל בלי קשר לזמן. ROI שנתי (annualized) מנורמל לתשואה לשנה - חיוני להשוואה בין השקעות בעלות תקופות שונות. השקעה של 50% ב-3 שנים = רק 14.5% בשנה (לא 16.7%!).',
  },
  {
    question: 'איזה ROI נחשב טוב?',
    answer:
      'תלוי בסיכון: 4-5% שנתי = פיקדון בנק (סיכון נמוך). 7-10% = מדדי מניות (S&P 500 ממוצע). 15%+ = השקעות מסוכנות (סטארטאפים, נדל"ן ממונף). זכור: תשואה גבוהה = סיכון גבוה. אל תשווה ROI בלי להבין את הסיכון.',
  },
  {
    question: 'האם לכלול עלויות נוספות?',
    answer:
      'כן! ROI מדויק חייב לכלול את כל העלויות: עמלות תיווך, מס רווחי הון, עלות מימון, תחזוקה (לדירה), זמן (לעסק). השקעה ב-100,000 ₪ עם 5,000 ₪ עמלות = העלות האמיתית 105,000 ₪.',
  },
  {
    question: 'איך לכלול דיבידנדים?',
    answer:
      'הוסף את הדיבידנדים שקיבלת ל"הכנסות נוספות". זה מגדיל את ה-ROI הסופי. דוגמה: השקעה במניה ב-10,000 ₪, מכרת ב-12,000 ₪ + קיבלת 800 ₪ דיבידנדים = ROI של 28% (לא רק 20%).',
  },
  {
    question: 'מה ההבדל בין ROI ל-IRR?',
    answer:
      'ROI חישוב פשוט. IRR (Internal Rate of Return) מתחשב בזרם תזרימים לאורך זמן (כמו תשלומי שכר דירה כל חודש). IRR מדויק יותר להשקעות מורכבות אבל קשה לחשב ידנית. ROI שנתי הוא קירוב סביר.',
  },
];

export default function ROIPage() {
  return (
    <CalculatorLayout
      title="מחשבון ROI - תשואה על השקעה"
      description="חשב את התשואה האמיתית על ההשקעה שלך, כולל ROI שנתי מנורמל."
      breadcrumbs={[
        { label: 'דף הבית', href: '/' },
        { label: 'השקעות', href: '/investments' },
        { label: 'ROI' },
      ]}
      lastUpdated="2026-05-03"
      calculator={<ROICalculator />}
      content={
        <>
          <h2>מהו ROI?</h2>
          <p>
            ROI (Return on Investment) הוא היחס בין הרווח שצברת לבין הסכום שהשקעת. זה המדד הבסיסי
            ביותר לכדאיות השקעה - האם הרווחת כסף, וכמה?
          </p>

          <h2>הנוסחה</h2>
          <p>
            <strong>ROI = ((שווי סופי - השקעה) / השקעה) × 100</strong>
          </p>
          <p>
            לדוגמה: השקעת 100,000 ₪, מכרת ב-130,000 ₪. ROI = (30,000 / 100,000) × 100 = 30%.
          </p>

          <h2>ROI שנתי מנורמל - הקריטי</h2>
          <p>
            בעיה: ROI של 50% ב-2 שנים נראה זהה ל-50% ב-10 שנים, אבל הם שונים מאוד! ROI שנתי מנורמל
            מתקן את זה:
          </p>
          <ul>
            <li>50% ב-2 שנים = 22.5% שנתי (מצוין)</li>
            <li>50% ב-5 שנים = 8.4% שנתי (בסדר)</li>
            <li>50% ב-10 שנים = 4.1% שנתי (חלש - בקושי מנצח אינפלציה)</li>
          </ul>

          <h2>איך לחשב ROI נכון?</h2>
          <ol>
            <li>
              <strong>הזן עלות אמיתית</strong> - כולל עמלות, מסים, זמן
            </li>
            <li>
              <strong>הזן שווי סופי</strong> - מה קיבלת בסוף
            </li>
            <li>
              <strong>הוסף הכנסות במהלך הדרך</strong> - דיבידנדים, שכ"ד
            </li>
            <li>
              <strong>חלק לפי שנים</strong> - תמיד תסתכל על ROI שנתי
            </li>
          </ol>

          <h2>הערכת התוצאה</h2>
          <p>השוואה לאלטרנטיבות:</p>
          <ul>
            <li>
              <strong>פיקדון בנק:</strong> 3-4% שנתי
            </li>
            <li>
              <strong>אג"ח ממשלתי:</strong> 4-5% שנתי
            </li>
            <li>
              <strong>S&P 500 ממוצע:</strong> 7-10% שנתי
            </li>
            <li>
              <strong>נדל"ן ממוצע:</strong> 5-8% שנתי
            </li>
            <li>
              <strong>סטארטאפ:</strong> 15%+ אבל סיכון גבוה
            </li>
          </ul>
        </>
      }
      faq={<FAQ items={faqItems} />}
    />
  );
}
