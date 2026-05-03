import { Metadata } from 'next';
import { CalculatorLayout } from '@/components/calculator/CalculatorLayout';
import { PurchaseTaxCalculator } from '@/components/calculators/PurchaseTaxCalculator';
import { FAQ } from '@/components/calculator/FAQ';

export const metadata: Metadata = {
  title: 'מחשבון מס רכישה 2026 | חישוב מדויק לדירה',
  description:
    'חשב מס רכישה על דירה - דירה ראשונה, נוספת או למשקיעים. מדרגות 2026 מאומתות.',
  alternates: { canonical: '/real-estate/purchase-tax' },
};

const faqItems = [
  {
    question: 'מהו מס רכישה?',
    answer:
      'מס שמשולם בעת רכישת דירה או נכס נדל"ן. שיעור המס תלוי בשווי הדירה ובסוג הרוכש. דירה ראשונה ויחידה זוכה לפטור מלא עד 1,978,745 ₪ (מדרגות 2026), ובהמשך - 3.5%, 5%, 8% ו-10%.',
  },
  {
    question: 'דירה ראשונה - איזה פטור יש?',
    answer:
      'תושב ישראל הקונה דירה ראשונה ויחידה: פטור מלא עד 1,978,745 ₪. מעבר לכך: 3.5% עד 2,347,040, 5% עד 6,055,070, 8% עד 20,183,565, ו-10% מעבר. דירה ב-2.5 מיליון = ~25,648 ₪ מס.',
  },
  {
    question: 'מה ההגדרה של דירה יחידה?',
    answer:
      'דירה יחידה = הקונה לא היה בעל זכויות בדירת מגורים אחרת ב-18 החודשים האחרונים. מי שמוכר דירה ישנה וקונה חדשה (מחליף דירה) זכאי לאותן מדרגות אם הוא מוכר את הישנה תוך 18 חודשים.',
  },
  {
    question: 'מה השיעור למשקיעים?',
    answer:
      'דירה נוספת / להשקעה: 8% עד 6,055,070 ₪, ו-10% מעבר לכך. אין פטור! דירה למשקיע ב-2 מיליון = 160,000 ₪ מס. הסיבה: הממשלה רוצה לעודד מגורים ולא השקעות.',
  },
  {
    question: 'עולה חדש - מה ההקלה?',
    answer:
      'עולה חדש (תושב חוזר) ב-7 שנותיו הראשונות בארץ זכאי לשיעור מופחת: 0.5% עד 5 מיליון ₪, 5% מעבר לכך. דירה ב-2.5 מיליון לעולה חדש = 12,500 ₪ בלבד (במקום 25,648 ₪).',
  },
  {
    question: 'מתי משלמים את המס?',
    answer:
      'תוך 50 ימים ממועד עסקת הרכישה. אם לא משלמים במועד - יש קנסות וריבית. בד"כ עורך הדין מטפל בתשלום כחלק מתהליך העסקה.',
  },
];

export default function PurchaseTaxPage() {
  return (
    <CalculatorLayout
      title="מחשבון מס רכישה 2026"
      description="חישוב מס רכישה לפי מדרגות מעודכנות. תומך בכל סוגי הרוכשים: דירה ראשונה, מחליף, משקיע, עולה חדש."
      breadcrumbs={[
        { label: 'דף הבית', href: '/' },
        { label: 'משכנתא ונדל"ן', href: '/real-estate' },
        { label: 'מס רכישה' },
      ]}
      lastUpdated="2026-05-03"
      calculator={<PurchaseTaxCalculator />}
      content={
        <>
          <h2>מה זה מס רכישה?</h2>
          <p>
            מס רכישה הוא מס ששלך משלם בעת רכישת דירה או נכס נדל"ן בישראל. שיעור המס תלוי בשני
            פרמטרים עיקריים: שווי הדירה וסוג הרוכש. המס נגבה על ידי רשות המסים בעת העסקה ויש לשלמו
            תוך 50 ימים מהחתימה.
          </p>

          <h2>מדרגות 2026 - דירה ראשונה ויחידה</h2>
          <table>
            <thead>
              <tr>
                <th>טווח שווי</th>
                <th>שיעור מס</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>0 - 1,978,745</td>
                <td>0% (פטור!)</td>
              </tr>
              <tr>
                <td>1,978,745 - 2,347,040</td>
                <td>3.5%</td>
              </tr>
              <tr>
                <td>2,347,040 - 6,055,070</td>
                <td>5%</td>
              </tr>
              <tr>
                <td>6,055,070 - 20,183,565</td>
                <td>8%</td>
              </tr>
              <tr>
                <td>מעל 20,183,565</td>
                <td>10%</td>
              </tr>
            </tbody>
          </table>

          <h2>מדרגות לדירה נוספת / משקיעים</h2>
          <table>
            <thead>
              <tr>
                <th>טווח שווי</th>
                <th>שיעור מס</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>0 - 6,055,070</td>
                <td>8%</td>
              </tr>
              <tr>
                <td>מעל 6,055,070</td>
                <td>10%</td>
              </tr>
            </tbody>
          </table>

          <h2>דוגמאות מספריות</h2>

          <h3>דוגמה 1: זוג צעיר קונה דירה ראשונה ב-2.5 מיליון</h3>
          <ul>
            <li>0 - 1,978,745 (פטור): 0 ₪</li>
            <li>1,978,745 - 2,347,040 (3.5%): 12,890 ₪</li>
            <li>2,347,040 - 2,500,000 (5%): 7,648 ₪</li>
            <li>
              <strong>סה"כ: 20,538 ₪</strong> (0.82% מהשווי)
            </li>
          </ul>

          <h3>דוגמה 2: משקיע קונה דירה נוספת ב-2.5 מיליון</h3>
          <ul>
            <li>2,500,000 × 8% = 200,000 ₪</li>
            <li>
              <strong>הפרש מאדם פרטי: 179,462 ₪!</strong>
            </li>
          </ul>

          <h3>דוגמה 3: עולה חדש קונה דירה ב-3 מיליון</h3>
          <ul>
            <li>3,000,000 × 0.5% = 15,000 ₪</li>
            <li>
              <strong>חיסכון משמעותי לעולים חדשים</strong>
            </li>
          </ul>

          <h2>טיפים חשובים</h2>
          <ul>
            <li>
              <strong>בדוק זכאות לדירה יחידה</strong> - גם אם יש לך דירה ישנה, אם תמכור תוך 18 חודש,
              עדיין זכאי
            </li>
            <li>
              <strong>עולה חדש</strong> - בדוק את התקופה הזכאית (בד"כ 7 שנים מעלייה)
            </li>
            <li>
              <strong>נכה / נפגע פעולת איבה</strong> - בקש פטורים מיוחדים
            </li>
            <li>
              <strong>תכנון עסקה</strong> - לעיתים שווה למכור ראשון ואז לקנות
            </li>
            <li>
              <strong>דירה משותפת</strong> - אם 2 בני זוג, שניהם צריכים להיות "דירה ראשונה"
            </li>
          </ul>
        </>
      }
      faq={<FAQ items={faqItems} />}
      sources={
        <ul className="space-y-2 text-blue-700">
          <li>
            <a
              href="https://www.gov.il/he/departments/israel_tax_authority"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              רשות המסים - מיסוי מקרקעין
            </a>
          </li>
          <li>
            <a
              href="https://www.misim.gov.il/svsimurechisha/frmFirstPage.aspx"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              סימולטור מס רכישה - רשות המסים
            </a>
          </li>
        </ul>
      }
    />
  );
}
