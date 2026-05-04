import { Metadata } from 'next';
import { CalculatorLayout } from '@/components/calculator/CalculatorLayout';
import { FireCalculator } from '@/components/calculators/FireCalculator';
import { FAQ } from '@/components/calculator/FAQ';

export const metadata: Metadata = {
  title: 'מחשבון FIRE 2026 - תכנון פרישה מוקדמת',
  description:
    'מחשבון FIRE (Financial Independence, Retire Early) - חשב תוך כמה שנים תוכל לפרוש. כולל כלל ה-4%, חישוב צמיחת תיק, וסיווג Lean/Regular/Fat FIRE.',
  alternates: { canonical: '/investments/fire' },
};

const faqItems = [
  {
    question: 'מה זה FIRE?',
    answer:
      'FIRE = Financial Independence, Retire Early. תנועה גלובלית של אנשים שחוסכים בעקביות כדי לצאת לפנסיה לפני גיל 65 (לרוב בגיל 40-55). הרעיון המרכזי: לחיות מתחת לרמת ההכנסה כדי לצבור כסף בתיק השקעות שיתפרנס אותך לכל החיים.',
  },
  {
    question: 'מהו "כלל ה-4%"?',
    answer:
      'מחקר Trinity המפורסם הראה שאפשר למשוך 4% משווי תיק השקעות מגוון בכל שנה (מתואם לאינפלציה) למשך 30+ שנים בלי שייגמר. לכן הסכום שאתה צריך כדי לפרוש = הוצאות שנתיות × 25 (כי 1/0.04 = 25).',
  },
  {
    question: 'מה ההבדל בין Lean / Regular / Fat FIRE?',
    answer:
      'Lean FIRE: הוצאות 8K-12K ₪/חודש (חיים פשוטים, אולי בפריפריה). Regular FIRE: 15K-25K ₪/חודש (רמת חיים נוחה). Fat FIRE: 30K+ ₪/חודש (רמת חיים גבוהה). ככל שההוצאות נמוכות יותר - מגיעים ל-FIRE מהר יותר.',
  },
  {
    question: 'איך מגיעים ל-FIRE בישראל?',
    answer:
      'בישראל זה מאתגר אבל אפשרי: (1) שיעור חיסכון גבוה - 30-50% מההכנסה; (2) השקעות בקרנות סל זולות - מסלול S&P 500 בקרן ה.; (3) ניצול הטבות מס - פנסיה, קרן השתלמות, IRA; (4) מינימום הוצאות קבועות (משכנתא בריבית קבועה, רכב יחסית זול); (5) הגדלת הכנסה - bizdev, צד נוסף.',
  },
  {
    question: 'האם 4% Rule רלוונטי לישראל?',
    answer:
      'בעיקרון כן, אבל עם זהירות: (1) שוק ההון הישראלי תנודתי יותר; (2) אינפלציה מקומית יכולה להיות גבוהה יותר; (3) מסים על רווחי הון 25%. רבים ממליצים על שיעור משיכה של 3.5% במקום 4% לבטיחות. כנגד זה - יש קצבת זקנה ב.ל. שמתחילה בגיל 67 שמקטינה את הסיכון.',
  },
  {
    question: 'האם FIRE זה ריאלי או חלום?',
    answer:
      'תלוי במצב. רעיוני אבל אפשרי: (1) זוג צעיר עם הכנסה גבוהה (ביחד 40K+ ברוטו) שחוסך 50% יכול להגיע ל-FIRE תוך 17 שנים. (2) מי שמרוויח בינוני (15K) ועם הוצאות גבוהות - אולי לא יגיע. (3) רוב האנשים מסתפקים ב"FI" (חופש כלכלי) ולא RE (פרישה מוקדמת מלאה).',
  },
  {
    question: 'מה החסרונות של FIRE?',
    answer:
      'חסרונות: (1) חיים מתחת לאמצעים - דורש משמעת רבה לאורך זמן; (2) סיכון בריאותי - אם תחלה אחרי הפרישה הביטוח יקר; (3) סיכון שוק - מפץ פיננסי יכול להוריד תיק 50%; (4) שעמום פוטנציאלי - הרבה אנשים מתגעגעים לעבודה; (5) לחץ חברתי - חברים בתפקידים בכירים, אתה "ביתי".',
  },
  {
    question: 'איך מתחילים?',
    answer:
      'שלבים: (1) חשב את ה-FI Number שלך (הוצאות שנתיות × 25); (2) ספור את החיסכון הנוכחי שלך; (3) חשב כמה אתה חוסך כל חודש; (4) הגדל את שיעור החיסכון בכל אפשרות - הקטנת הוצאות + הגדלת הכנסה; (5) השקע במגוון רחב של ני"ע - לא במניות בודדות; (6) עקוב אחרי ההתקדמות פעם בשנה.',
  },
];

export default function FirePage() {
  return (
    <CalculatorLayout
      title="מחשבון FIRE - פרישה מוקדמת"
      description="גלה תוך כמה שנים תוכל לפרוש בפרישה מוקדמת. מבוסס על כלל ה-4% והערכת תזרים השקעות עתידי."
      breadcrumbs={[
        { label: 'דף הבית', href: '/' },
        { label: 'השקעות', href: '/investments' },
        { label: 'FIRE - פרישה מוקדמת' },
      ]}
      lastUpdated="2026-05-04"
      calculator={<FireCalculator />}
      content={
        <>
          <h2>FIRE - העצמאות הכלכלית האולטימטיבית</h2>
          <p>
            FIRE (Financial Independence, Retire Early) היא תנועה שצוברת תאוצה בעולם ובישראל.
            הרעיון: לבנות תיק השקעות גדול מספיק כדי לחיות מהריבית בלבד - ולפרוש לפני גיל
            הפנסיה הרשמי. הכלי הזה יחשב לך תוך כמה שנים תגיע לעצמאות כלכלית.
          </p>

          <h2>הפילוסופיה של FIRE</h2>
          <ol>
            <li>
              <strong>שיעור חיסכון גבוה</strong>: 30-50%+ מההכנסה (לעומת ~5% ממוצע ישראלי)
            </li>
            <li>
              <strong>השקעה במדדים</strong>: S&P 500, MSCI World - תשואה היסטורית 7%+
            </li>
            <li>
              <strong>חיים פשוטים</strong>: שמירה על הוצאות נמוכות תוך הכנסה הולכת וגדלה
            </li>
            <li>
              <strong>FIRE Number</strong>: 25× הוצאות שנתיות = הסכום שצריך
            </li>
            <li>
              <strong>4% Rule</strong>: משיכה שנתית בטוחה לטווח ארוך
            </li>
          </ol>

          <h2>המתמטיקה של FIRE</h2>
          <table className="w-full text-sm border-collapse my-4">
            <thead>
              <tr className="bg-blue-50">
                <th className="border border-gray-300 p-2 text-right">שיעור חיסכון</th>
                <th className="border border-gray-300 p-2 text-right">שנים ל-FIRE (מ-0)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 p-2">10%</td>
                <td className="border border-gray-300 p-2">~51 שנים</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2">25%</td>
                <td className="border border-gray-300 p-2">~32 שנים</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2">50%</td>
                <td className="border border-gray-300 p-2">~17 שנים</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2">75%</td>
                <td className="border border-gray-300 p-2">~7 שנים</td>
              </tr>
            </tbody>
          </table>
          <p className="text-sm text-gray-600">בהנחת תשואה ריאלית של 5% שנתי</p>
        </>
      }
      faq={<FAQ items={faqItems} />}
      sources={
        <ul className="space-y-2 text-blue-700">
          <li>
            <span>4% Rule מחקר Trinity (Cooley, Hubbard, Walz)</span>
          </li>
          <li>
            <span>קהילת FIRE ישראל בפייסבוק וטלגרם</span>
          </li>
        </ul>
      }
    />
  );
}
