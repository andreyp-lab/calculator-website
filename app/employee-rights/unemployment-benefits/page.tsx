import { Metadata } from 'next';
import { CalculatorLayout } from '@/components/calculator/CalculatorLayout';
import { UnemploymentBenefitsCalculator } from '@/components/calculators/UnemploymentBenefitsCalculator';
import { FAQ } from '@/components/calculator/FAQ';

export const metadata: Metadata = {
  title: 'מחשבון דמי אבטלה 2026 - חישוב מביטוח לאומי',
  description:
    'מחשבון דמי אבטלה מקצועי - בדוק זכאות, תשלום יומי, ותקופת זכאות לפי גיל ושכר. נתונים 2026.',
  alternates: { canonical: '/employee-rights/unemployment-benefits' },
};

const faqItems = [
  {
    question: 'מי זכאי לדמי אבטלה?',
    answer:
      'תנאי זכאות: (1) בני 20-67; (2) צבר 360 ימי עבודה ב-18 חודשים האחרונים (בערך 12 חודשי עבודה); (3) פוטר/התפטר מסיבה מוצדקת (לא מרצונו); (4) אינו עצמאי; (5) רשום כמחפש עבודה בשירות התעסוקה. נדרש לעמוד בכל התנאים.',
  },
  {
    question: 'איך מחושבים דמי האבטלה?',
    answer:
      'דמי האבטלה מחושבים לפי השכר הממוצע ב-6 חודשים אחרונים. התשלום מדורג: עד 60% מהשכר הממוצע במשק (~8,260 ₪) - 80% מהשכר; 60-80% - 60%; מעל 80% - 50%. תקרה יומית 2026: 550.76 ₪ ל-125 ימים ראשונים, 367.17 ₪ מהיום ה-126.',
  },
  {
    question: 'כמה ימי זכאות מגיעים?',
    answer:
      'תלוי בגיל ובמצב משפחתי: בני 20-25 ללא ילדים = 67 ימים; 25-28 = 100 ימים; 28-35 = 138 ימים; 35+ עם ילדים מתחת ל-18 = 175 ימים; 45+ = 175 ימים. בנוסף יש "תקופת המתנה" של ~5 ימים בתחילה.',
  },
  {
    question: 'מה ההבדל בין פיטורים להתפטרות?',
    answer:
      'אחרי פיטורים מקבלים דמי אבטלה אוטומטית (אחרי 5 ימי המתנה). אחרי התפטרות יש 90 ימי המתנה. יוצאים מן הכלל: התפטרות מסיבה מוצדקת (גירושים, מעבר דירה לעבודת בן זוג, הרעה בתנאי העבודה, סיום חוזה ארעי) - אין המתנה.',
  },
  {
    question: 'כמה זמן עד שמקבלים את הכסף?',
    answer:
      'הגשת תביעה: עד שבוע לאחר ההפסקה דרך אתר ב.ל. או בסניף. אישור: בד"כ 14-30 ימי עסקים. אחרי האישור - תשלום ראשון מועבר תוך שבועיים. תשלומים שוטפים: כל שבועיים-חודש. במקרה של עיכוב מקבלים תשלום מצטבר רטרואקטיבית.',
  },
  {
    question: 'האם דמי אבטלה חייבים במס?',
    answer:
      'כן! דמי אבטלה הם הכנסה חייבת במס הכנסה ובביטוח לאומי. ב.ל. מנכה אוטומטית מדרגה 1 (10%) ו-ב.ל. עובד. אם המדרגה שלך גבוהה יותר - תשלם הפרש בסוף השנה. נקודות זיכוי מתוקננות בחישוב.',
  },
  {
    question: 'מה קורה אם מצאתי עבודה באמצע התקופה?',
    answer:
      'תשלום נפסק ביום שאתה מתחיל לעבוד. ימי הזכאות שנותרו "נשמרים" - אם תפוטר שוב תוך 4 שנים, תוכל לחזור ולקבל אותם. זה תמריץ למצוא עבודה מהר. אם תרוויח פחות מ-50% משכרך הקודם - תקבל "השלמת אבטלה".',
  },
  {
    question: 'מה זה תקופת אבטלה והאם משפיעה על פנסיה?',
    answer:
      'בתקופת אבטלה ב.ל. ממשיך לדווח על "ימי תשלום" שנחשבים לתקופת ביטוח. זה משפיע על קצבת זקנה עתידית, דמי לידה, וקצבאות אחרות. לפנסיה הפרטית - אין הפקדות בתקופה (אלא אם מפקיד עצמאית). ייתכן רצף ביטוחי לקרן הפנסיה - בדוק עם הסוכן.',
  },
];

export default function UnemploymentBenefitsPage() {
  return (
    <CalculatorLayout
      title="מחשבון דמי אבטלה 2026"
      description="בדוק את הזכאות וגובה דמי האבטלה שלך מהביטוח הלאומי. כולל חישוב לפי שכר, גיל ומצב משפחתי."
      breadcrumbs={[
        { label: 'דף הבית', href: '/' },
        { label: 'זכויות עובדים', href: '/employee-rights' },
        { label: 'דמי אבטלה' },
      ]}
      lastUpdated="2026-05-04"
      calculator={<UnemploymentBenefitsCalculator />}
      content={
        <>
          <h2>דמי אבטלה - מה צריך לדעת</h2>
          <p>
            דמי אבטלה הם תשלום זמני מהביטוח הלאומי לעובד שכיר שאיבד את עבודתו ועומד בתנאי
            הזכאות. הם נועדו לאפשר תקופת חיפוש עבודה ללא דאגה כלכלית. הסכום מחושב לפי השכר
            הקודם והגיל.
          </p>

          <h2>שיעורי תשלום מדורגים</h2>
          <table className="w-full text-sm border-collapse my-4">
            <thead>
              <tr className="bg-blue-50">
                <th className="border border-gray-300 p-2 text-right">מדרגת שכר</th>
                <th className="border border-gray-300 p-2 text-right">% מהשכר</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 p-2">עד 60% מהשכר הממוצע (~8,260 ₪)</td>
                <td className="border border-gray-300 p-2">80%</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2">60-80% מהשכר הממוצע</td>
                <td className="border border-gray-300 p-2">60%</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2">מעל 80%</td>
                <td className="border border-gray-300 p-2">50%</td>
              </tr>
            </tbody>
          </table>

          <h2>תקופת זכאות לפי גיל</h2>
          <ul>
            <li>20-25 ללא ילדים: 67 ימים</li>
            <li>25-28: 100 ימים</li>
            <li>28-35: 138 ימים</li>
            <li>35+ עם ילדים מתחת ל-18: 175 ימים</li>
            <li>45+: 175 ימים</li>
          </ul>
        </>
      }
      faq={<FAQ items={faqItems} />}
      sources={
        <ul className="space-y-2 text-blue-700">
          <li>
            <a
              href="https://www.btl.gov.il/benefits/Unemployment"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              ביטוח לאומי - דמי אבטלה
            </a>
          </li>
        </ul>
      }
    />
  );
}
