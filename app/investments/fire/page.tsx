import { Metadata } from 'next';
import { CalculatorLayout } from '@/components/calculator/CalculatorLayout';
import { FireCalculator } from '@/components/calculators/FireCalculator';
import { FAQ } from '@/components/calculator/FAQ';

export const metadata: Metadata = {
  title: 'מחשבון FIRE 2026 - פרישה מוקדמת | Lean, Regular, Fat, Coast, Barista',
  description:
    'מחשבון FIRE מקיף (Financial Independence, Retire Early) בהקשר ישראלי. 5 סוגי FIRE, כלל ה-4%, Coast FIRE, Barista FIRE, ניתוח SWR, ביטוח לאומי ונדל"ן. גלה מתי תוכל לפרוש.',
  alternates: { canonical: '/investments/fire' },
};

const faqItems = [
  {
    question: 'מה זה FIRE ואיך זה עובד?',
    answer:
      'FIRE = Financial Independence, Retire Early. תנועה גלובלית של אנשים שחוסכים 30-70% מהכנסתם כדי לבנות תיק השקעות שיממן את כל הוצאות המחיה לנצח - ולפרוש לפני גיל 65. הרעיון המרכזי: צבור תיק ששווה 25× הוצאותיך השנתיות (כלל ה-4%). ברגע שהגעת לסכום הזה - אתה פנוי. אין שעות עבודה, אין בוס - רק הזמן שלך.',
  },
  {
    question: 'מהו "כלל ה-4%" ואיפה הוא הגיע?',
    answer:
      'כלל ה-4% מגיע ממחקר Trinity האמריקאי (1998) שניתח 30 שנות נתוני שוק (1926-1995). הממצא: תיק של 75% מניות + 25% אג"ח שממנו נמשכים 4% בשנה הראשונה ומתאמים לאינפלציה - שרד 96% מהמקרים ל-30 שנה. לכן: FIRE Number = הוצאות שנתיות × 25. חשוב: המחקר מבוסס על שוק אמריקאי - לישראלים כדאי לשקול 3.5% (מכפיל 28.6) לבטיחות נוספת.',
  },
  {
    question: 'מה ההבדל בין Lean / Regular / Fat / Coast / Barista FIRE?',
    answer:
      'Lean FIRE: הוצאות מינימליות ₪8K-12K/חודש - חיים פשוטים, אולי בפריפריה, ללא מותרות. Regular FIRE: ₪15K-25K/חודש - רמת חיים נוחה, נסיעות מדי פעם, מרכז הארץ. Fat FIRE: ₪35K-50K+/חודש - אורח חיים גבוה, מסעדות, טיסות, נסיעות יוקרה. Coast FIRE: הגעת לסכום שיצמח לבד ל-FIRE Number ללא הפקדות נוספות - אתה "חוף" לפני שעגנת. Barista FIRE: עובד חלקית (20-30 שעות שבועיות) + תיק קטן יותר - האיזון בין עבודה לחופש.',
  },
  {
    question: 'איך מגיעים ל-FIRE בישראל - מה המאפיינים המקומיים?',
    answer:
      'ישראל מציגה אתגרים ייחודיים: (1) יוקר מחיה גבוה במרכז - ₪6K-10K/חודש שכירות; (2) שוק הון מקומי קטן - כדאי חשיפה ל-S&P 500 דרך קרנות מחקות; (3) מס רווחי הון 25% - יש לחשב נטו; (4) קרן השתלמות - הטבת מס ייחודית (פטורה ממס לאחר 6 שנים!); (5) ביטוח לאומי מגיל 67 - רשת ביטחון חשובה; (6) שוק נדל"ן יקר - נכס להשקעה יכול להוות עמוד תוכנית FIRE.',
  },
  {
    question: 'מהו Sequence of Returns Risk ולמה זה חשוב?',
    answer:
      'זהו הסיכון הגדול ביותר ב-FIRE: ירידות גדולות בשוק בתחילת שנות הפרישה. דוגמה: תיק 2.5M ₪ יורד 40% ב-2008 ל-1.5M ₪ בשנה 1 של פרישה - ובמקביל אתה ממשיך למשוך ₪100K/שנה. זה פוגע קשה מאוד כי אין לך זמן להתאושש. פתרונות: שמור 2-3 שנות הוצאות במזומן/אג"ח, הקטן משיכות בשנות ירידה, שמור גמישות לעבודה חלקית בסיכונים.',
  },
  {
    question: 'האם 4% Rule מתאים לפרישה בגיל 40 (ל-50+ שנה)?',
    answer:
      'לא בדיוק. המחקר המקורי בדק 30 שנה. לפרישה בגיל 40 עם 50+ שנות פרישה - מומחים ממליצים: (1) 3-3.5% SWR (מכפיל 29-33×); (2) גמישות בהוצאות - יכולת לצמצם 20% בשנות ירידה; (3) שמירה על הכנסה קטנה - גם 5K ₪/חודש מעבודה מיוחדת; (4) חשיפה גבוהה למניות (80-90%) לפריסה ארוכה. ישראל ספציפית: קצבת ב.ל. מגיל 67 עוזרת.',
  },
  {
    question: 'ביטוח לאומי ובריאות בפרישה מוקדמת - מה צריך לדעת?',
    answer:
      'ביטוח לאומי: (1) יש לשלם דמי ב.ל. מינימום גם בפרישה - כ-560 ₪/חודש כשכיר שאינו עובד כדי לשמור על זכויות; (2) לזכות בקצבת זקנה מלאה (1,754 ₪/חודש+) דרושים 60 חודשי תשלום לפחות בין גיל 18-67; (3) קצבת נכות ואי-כושר - חשוב לשמור. בריאות: קופת חולים עולה ₪200-400/חודש לאחר עזיבת עבודה (תשלום עצמאי). כדאי לכלול בחישוב ה-FIRE.',
  },
  {
    question: 'נדל"ן כחלק מתוכנית FIRE - האם זה משתלם?',
    answer:
      'נדל"ן יכול להיות עמוד מרכזי ב-FIRE הישראלי: (1) נכס ב-1.5M ₪ שמניב 5,000 ₪/חודש נטו = שווה-ערך ל-FIRE Number של 1.5M ₪ (ב-4% SWR); (2) הגנה מאינפלציה טובה; (3) מינוף (משכנתא) מגביר תשואה. חסרונות: חוסר נזילות, עלויות תחזוקה ועסקאות, ניהול דיירים, ריכוז גאוגרפי. הגישה המומלצת: FIRE מגוון - 60-70% תיק ני"ע + 30-40% נדל"ן.',
  },
  {
    question: 'מה שיעור החיסכון שצריך להגיע ל-FIRE?',
    answer:
      'הגורם הכי קריטי הוא שיעור החיסכון מהכנסה: 10% = ~51 שנות עבודה, 25% = ~32 שנים, 40% = ~22 שנים, 50% = ~17 שנים, 70% = ~8.5 שנים. (בהנחת תשואה ריאלית 5%). ישראל: כדאי לכוון ל-30-40% שיעור חיסכון. כולל: פנסיה (מחוייבת), קרן השתלמות, חיסכון חופשי. שים לב שחלק מהחיסכון הוא "מחוייב" (פנסיה) ואינו מרגיש.',
  },
  {
    question: 'Coast FIRE - איך יודעים אם הגעתי?',
    answer:
      'Coast FIRE פירושו שצברת מספיק כסף שיצמח לבד (ללא הפקדות) ל-FIRE Number שלך עד גיל הפרישה. חישוב: Coast Number = FIRE Number ÷ (1 + תשואה ריאלית)^שנים_עד_פרישה. דוגמה: FIRE Number 3M ₪, 25 שנה עד פרישה, 5% תשואה ריאלית: Coast = 3,000,000 ÷ 1.05^25 = ~886,000 ₪. אם יש לך 886K ₪ - הגעת ל-Coast FIRE. אפשר להפסיק לחסוך ולחיות טוב יותר.',
  },
  {
    question: 'מה הסיכונים הגדולים של FIRE שלא חושבים עליהם?',
    answer:
      'סיכונים שקטים: (1) "Identity Crisis" - אנשים רבים מגיעים ל-FIRE ומגלים שהם משועממים ורוצים לחזור לעבוד; (2) עלויות בריאות - מחלה כרונית יכולה לאכול FIRE Number; (3) אינפלציה גבוהה לתקופה ארוכה; (4) שינוי מדיניות מס בישראל; (5) גירושין - חלוקת תיק FIRE; (6) ילדים - עלויות חינוך לא צפויות; (7) הורים קשישים - תמיכה כלכלית. כדאי לשמור "מרווח ביטחון" של 20-25% מעל FIRE Number.',
  },
  {
    question: 'איך מתחילים לתכנן FIRE בגיל 35-40 - צעדים מעשיים?',
    answer:
      'מפת הדרכים: (1) חשב FIRE Number שלך = הוצאות חודשיות × 12 × 25 (4% SWR); (2) בדוק מה יש לך היום - פנסיה, קרן השתלמות, כסף חופשי, נדל"ן; (3) חשב שיעור חיסכון נוכחי; (4) הגדל שיעור חיסכון: קרן השתלמות מקסימלית, IRA, קיצוצים בהוצאות גדולות; (5) בנה תיק מגוון - קרנות מחקות, עלויות ניהול נמוכות; (6) עקוב אחרי ה-FI Progress שלך פעם בשנה; (7) קרא: "Early Retirement Extreme" של Fisker, r/financialindependence, קהילת FIRE ישראל.',
  },
];

export default function FirePage() {
  return (
    <CalculatorLayout
      title="מחשבון FIRE - פרישה מוקדמת"
      description="מחשבון FIRE מקיף: 5 סוגי FIRE, כלל ה-4%, Coast FIRE, Barista FIRE, הקשר ישראלי - ביטוח לאומי, נדל&quot;ן, קרן השתלמות."
      breadcrumbs={[
        { label: 'דף הבית', href: '/' },
        { label: 'השקעות', href: '/investments' },
        { label: 'FIRE - פרישה מוקדמת' },
      ]}
      lastUpdated="2026-05-15"
      calculator={<FireCalculator />}
      content={
        <>
          <h2>FIRE - העצמאות הכלכלית האולטימטיבית</h2>
          <p>
            FIRE (Financial Independence, Retire Early) היא תנועה שצוברת תאוצה בעולם ובישראל.
            הרעיון: לבנות תיק השקעות גדול מספיק כדי לחיות מהריבית בלבד - ולפרוש לפני גיל
            הפנסיה הרשמי. המחשבון הזה יחשב לך בדיוק מתי תגיע לעצמאות כלכלית, בכמה מסלולים
            אפשריים.
          </p>

          <h2>5 סוגי FIRE - מה מתאים לך?</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse my-4">
              <thead>
                <tr className="bg-blue-50">
                  <th className="border border-gray-300 p-2 text-right">סוג FIRE</th>
                  <th className="border border-gray-300 p-2 text-right">הוצאות/חודש (זוג)</th>
                  <th className="border border-gray-300 p-2 text-right">FIRE Number</th>
                  <th className="border border-gray-300 p-2 text-right">מה זה מחייב?</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 p-2 font-medium text-green-700">Lean FIRE</td>
                  <td className="border border-gray-300 p-2">₪8K-12K</td>
                  <td className="border border-gray-300 p-2">₪2.4M-3.6M</td>
                  <td className="border border-gray-300 p-2">חיים פשוטים, ייתכן פריפריה</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 p-2 font-medium text-blue-700">Regular FIRE</td>
                  <td className="border border-gray-300 p-2">₪15K-25K</td>
                  <td className="border border-gray-300 p-2">₪4.5M-7.5M</td>
                  <td className="border border-gray-300 p-2">רמת חיים נוחה, נסיעות מדי פעם</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2 font-medium text-purple-700">Fat FIRE</td>
                  <td className="border border-gray-300 p-2">₪35K-50K+</td>
                  <td className="border border-gray-300 p-2">₪10.5M-15M+</td>
                  <td className="border border-gray-300 p-2">עושר אמיתי, ללא פשרות</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 p-2 font-medium text-amber-700">Coast FIRE</td>
                  <td className="border border-gray-300 p-2">כל סכום</td>
                  <td className="border border-gray-300 p-2">תלוי בגיל</td>
                  <td className="border border-gray-300 p-2">הפסק הפקדות, ממשיך לעבוד</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2 font-medium text-pink-700">Barista FIRE</td>
                  <td className="border border-gray-300 p-2">₪12K-18K</td>
                  <td className="border border-gray-300 p-2">₪2.5M-4M</td>
                  <td className="border border-gray-300 p-2">עבודה חלקית + תיק קטן</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2>המתמטיקה של FIRE - שיעור חיסכון</h2>
          <p>הגורם הכי קריטי הוא לא הכנסה - אלא שיעור החיסכון:</p>
          <table className="w-full text-sm border-collapse my-4">
            <thead>
              <tr className="bg-blue-50">
                <th className="border border-gray-300 p-2 text-right">שיעור חיסכון</th>
                <th className="border border-gray-300 p-2 text-right">שנים ל-FIRE</th>
                <th className="border border-gray-300 p-2 text-right">תיאור</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 p-2">10%</td>
                <td className="border border-gray-300 p-2">~51 שנים</td>
                <td className="border border-gray-300 p-2">ממוצע ישראלי</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="border border-gray-300 p-2">25%</td>
                <td className="border border-gray-300 p-2">~32 שנים</td>
                <td className="border border-gray-300 p-2">FIRE-aware</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2">40%</td>
                <td className="border border-gray-300 p-2">~22 שנים</td>
                <td className="border border-gray-300 p-2">FIRE רציני</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="border border-gray-300 p-2">50%</td>
                <td className="border border-gray-300 p-2">~17 שנים</td>
                <td className="border border-gray-300 p-2">Regular FIRE</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2">70%+</td>
                <td className="border border-gray-300 p-2">~7-10 שנים</td>
                <td className="border border-gray-300 p-2">Extreme FIRE</td>
              </tr>
            </tbody>
          </table>
          <p className="text-sm text-gray-600">
            בהנחת תשואה ריאלית של 5% שנתי. מקור: Mr. Money Mustache.
          </p>

          <h2>הקשר ישראלי - מה ייחודי ב-FIRE בישראל?</h2>
          <ul>
            <li>
              <strong>קרן השתלמות</strong>: הכלי החשוב ביותר - פטורה ממס לאחר 6 שנים. מקסם את
              ההפקדות!
            </li>
            <li>
              <strong>ביטוח לאומי</strong>: קצבה מגיל 67 מקטינה את ה-FIRE Number שלך. אל תשכח לשמור
              על הזכות.
            </li>
            <li>
              <strong>פנסיה מחוייבת</strong>: כחיסכון FIRE - חלק מהפנסיה כבר בדרך, חשב אותה!
            </li>
            <li>
              <strong>נדל"ן</strong>: ישראלים רבים משלבים נכס להשקעה כ-&quot;עמוד&quot; ב-FIRE.
            </li>
            <li>
              <strong>מס 25%</strong>: כל משיכה מתיק חופשי = מס. תכנן משיכות חכמות (פנסיה +
              תיק).
            </li>
          </ul>
        </>
      }
      faq={<FAQ items={faqItems} />}
      sources={
        <ul className="space-y-2 text-blue-700">
          <li>Trinity Study - Cooley, Hubbard, Walz (1998, עודכן 2011)</li>
          <li>Early Retirement Extreme - Jacob Lund Fisker</li>
          <li>ביטוח לאומי ישראל - קצבת זקנה 2026</li>
          <li>רשות שוק ההון - נתוני פנסיה וקרן השתלמות 2026</li>
          <li>קהילת FIRE ישראל - פייסבוק, r/financialindependence</li>
          <li>בנק ישראל - אינפלציה ממוצעת 2020-2026</li>
        </ul>
      }
    />
  );
}
