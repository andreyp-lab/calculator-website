import { Metadata } from 'next';
import { CalculatorLayout } from '@/components/calculator/CalculatorLayout';
import { SalaryNetGrossCalculator } from '@/components/calculators/SalaryNetGrossCalculator';
import { FAQ } from '@/components/calculator/FAQ';

export const metadata: Metadata = {
  title: 'מחשבון שכר נטו ברוטו 2026 - חישוב מדויק',
  description:
    'מחשבון שכר נטו וברוטו מקצועי - חישוב מס הכנסה, ביטוח לאומי, פנסיה וקרן השתלמות. כולל עלות מעסיק כוללת. מעודכן 2026.',
  alternates: { canonical: '/personal-tax/salary-net-gross' },
};

const faqItems = [
  {
    question: 'מה ההבדל בין שכר ברוטו לנטו?',
    answer:
      'ברוטו = השכר לפני ניכויים. נטו = הסכום שמועבר בפועל לחשבון הבנק שלך. הניכויים כוללים: מס הכנסה (לפי מדרגות), ביטוח לאומי + בריאות (~5-12%), הפרשה לפנסיה (6%), וקרן השתלמות (2.5% אופציונלי). בממוצע, הנטו הוא 70-80% מהברוטו.',
  },
  {
    question: 'איך מחשבים מס הכנסה לשכיר?',
    answer:
      'מס הכנסה מחושב על השכר השנתי לפי 7 מדרגות: 10% עד 84,120 ₪, 14% עד 120,720, 20% עד 228,000, 31% עד 301,200, 35% עד 560,280, 47% עד 721,560, 50% מעל. אחרי החישוב מורידים את ערך נקודות הזיכוי (242 ₪ × נקודות × 12).',
  },
  {
    question: 'כמה ביטוח לאומי משלמים?',
    answer:
      'ביטוח לאומי + בריאות בשני שיעורים: שיעור מופחת (4.27%) על שכר עד 7,522 ₪/חודש; שיעור מלא (12.17%) על שכר מ-7,523 ₪ עד 51,910 ₪. שכר מעל 51,910 ₪ - לא מחויב נוסף בב.ל. (אבל המעסיק כן משלם).',
  },
  {
    question: 'מה ההפרשות לפנסיה?',
    answer:
      'פנסיה חובה (צו הרחבה): עובד 6%, מעסיק 6.5%, מעסיק לפיצויים 6%-8.33% נוסף. סה"כ 18.5%-20.83%. ההפקדה פטורה ממס הכנסה למעלה 7.5% מהשכר. מי שלא מפריש לפנסיה - מאבד הטבת מס משמעותית.',
  },
  {
    question: 'מה זה קרן השתלמות?',
    answer:
      'קרן השתלמות היא חיסכון מוטב מס. עובד מפקיד 2.5%, מעסיק 7.5% (סה"כ 10%). אחרי 6 שנים ניתן למשוך את הכסף בפטור ממס. תקרת ההפקדה הפטורה: 18,840 ₪/שנה (1,570/חודש). מומלץ לכל מי שיכול - זו הטבה מצוינת.',
  },
  {
    question: 'איך מחושב שכר שעתי לעובד שעתי?',
    answer:
      'שכר שעתי = שכר חודשי / 182 (משרה מלאה). למשל: 12,000 ₪/חודש = ~66 ₪/שעה. למשרת חצי-עבודה (91 שעות): 6,000 ₪. שכר מינימום שעתי 2026: 35.40 ₪.',
  },
  {
    question: 'מה כוללת עלות מעסיק כוללת?',
    answer:
      'עלות מעסיק = שכר ברוטו + ביטוח לאומי מעסיק (4.51%/7.6%) + פנסיה מעסיק (6.5%) + פיצויים (8.33%) + קרן השתלמות מעסיק (7.5% אם פעיל). בממוצע, עלות המעסיק הכוללת היא 1.25-1.40× השכר ברוטו.',
  },
  {
    question: 'איך נקודות זיכוי משפיעות על השכר?',
    answer:
      'כל נקודת זיכוי = 242 ₪ פחות מס בחודש (2,904 ₪/שנה). תושב ישראל = 2.25 נקודות בסיס. אישה = +0.5. ילדים, חייל משוחרר, עולה חדש - מוסיפים נקודות. עדכון טופס 101 חיוני - אחרת מאבדים הטבות מס.',
  },
];

export default function SalaryNetGrossPage() {
  return (
    <CalculatorLayout
      title="מחשבון שכר נטו ברוטו 2026"
      description="חישוב מדויק של שכר נטו וברוטו - מס הכנסה, ב.ל., פנסיה, קרן השתלמות. כולל עלות מעסיק כוללת."
      breadcrumbs={[
        { label: 'דף הבית', href: '/' },
        { label: 'מיסוי אישי', href: '/personal-tax' },
        { label: 'שכר נטו ברוטו' },
      ]}
      lastUpdated="2026-05-04"
      calculator={<SalaryNetGrossCalculator />}
      content={
        <>
          <h2>מחשבון השכר הכי מקיף בישראל</h2>
          <p>
            המחשבון הכי מבוקש בישראל - חישוב מדויק של שכר נטו מהברוטו. כולל את כל הניכויים
            הסטנדרטיים: מס הכנסה לפי מדרגות, ביטוח לאומי + בריאות, פנסיה חובה, וקרן השתלמות.
            גם עלות המעסיק הכוללת.
          </p>

          <h2>מדרגות מס 2026</h2>
          <table className="w-full text-sm border-collapse my-4">
            <thead>
              <tr className="bg-blue-50">
                <th className="border border-gray-300 p-2 text-right">הכנסה חודשית</th>
                <th className="border border-gray-300 p-2 text-right">שיעור מס</th>
              </tr>
            </thead>
            <tbody>
              <tr><td className="border border-gray-300 p-2">עד 7,010 ₪</td><td className="border border-gray-300 p-2">10%</td></tr>
              <tr><td className="border border-gray-300 p-2">עד 10,060 ₪</td><td className="border border-gray-300 p-2">14%</td></tr>
              <tr><td className="border border-gray-300 p-2">עד 19,000 ₪</td><td className="border border-gray-300 p-2">20%</td></tr>
              <tr><td className="border border-gray-300 p-2">עד 25,100 ₪</td><td className="border border-gray-300 p-2">31%</td></tr>
              <tr><td className="border border-gray-300 p-2">עד 46,690 ₪</td><td className="border border-gray-300 p-2">35%</td></tr>
              <tr><td className="border border-gray-300 p-2">עד 60,130 ₪</td><td className="border border-gray-300 p-2">47%</td></tr>
              <tr><td className="border border-gray-300 p-2">מעל 60,130 ₪</td><td className="border border-gray-300 p-2">50% (כולל מס יסף)</td></tr>
            </tbody>
          </table>
        </>
      }
      faq={<FAQ items={faqItems} />}
    />
  );
}
