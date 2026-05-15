import { Metadata } from 'next';
import { CalculatorLayout } from '@/components/calculator/CalculatorLayout';
import { UnemploymentBenefitsCalculator } from '@/components/calculators/UnemploymentBenefitsCalculator';
import { FAQ } from '@/components/calculator/FAQ';

export const metadata: Metadata = {
  title: 'מחשבון דמי אבטלה 2026 - חישוב מביטוח לאומי',
  description:
    'מחשבון דמי אבטלה מקצועי - בדוק זכאות, תשלום יומי, לוח תשלומים, עבודה חלקית ומס. נתונים עדכניים 2026.',
  alternates: { canonical: '/employee-rights/unemployment-benefits' },
};

const faqItems = [
  {
    question: 'מי זכאי לדמי אבטלה ב-2026?',
    answer:
      'תנאי הזכאות: (1) גיל 20 עד 66 (טרם הגעה לגיל פרישה); (2) עובד שכיר שצבר לפחות 12 חודשי תשלומים לביטוח לאומי ב-18 החודשים האחרונים (בעלי ילדים מתחת לגיל 18 — די ב-9 חודשים); (3) פוטר מעבודתו שלא מרצונו, או התפטר מסיבה מוצדקת; (4) רשום כמחפש עבודה פעיל בלשכת שירות התעסוקה; (5) אינו עצמאי פעיל. חייבים לעמוד בכל התנאים יחד.',
  },
  {
    question: 'איך בדיוק מחושבים דמי האבטלה?',
    answer:
      'דמי האבטלה מחושבים לפי שלב: (א) מחשבים את השכר היומי הממוצע (שכר חודשי ÷ 30). (ב) מיישמים שיעור לפי מדרגה: שכר עד 60% מהממוצע הארצי (כ-8,261 ₪) = 80%; 60-80% (עד 11,015 ₪) = 60%; מעל 80% = 50%. (ג) תוצאה זו מוגבלת לתקרה יומית: 550.76 ₪ ל-125 הימים הראשונים, ו-367.17 ₪ מהיום ה-126 ואילך.',
  },
  {
    question: 'כמה ימי זכאות מגיעים לפי גיל?',
    answer:
      'תקופת הזכאות נקבעת לפי גיל ומצב משפחתי: גיל 20-24 ללא ילדים = 50 ימים; גיל 20-24 עם ילדים / גיל 25-27 = 100 ימים; גיל 28-34 = 138 ימים; גיל 35-44 עם ילדים / גיל 45+ = 175 ימים; גיל 35-44 ללא ילדים = 138 ימים. בנוסף, לפני תחילת התשלום חלה תקופת המתנה של 5 ימים (אחרי פיטורים) או 90 יום (אחרי התפטרות ללא עילה).',
  },
  {
    question: 'מה ההבדל בין פיטורים להתפטרות מרצון?',
    answer:
      'אחרי פיטורים: תחול תקופת המתנה קצרה של 5 ימים בלבד, ואז מתחיל תשלום. אחרי התפטרות רגילה: תקופת המתנה של 90 ימים — ורק אז מקבלים דמי אבטלה. יוצאים מהכלל (ללא המתנה של 90 יום): מעבר דירה בשל מקום עבודת בן/בת הזוג, התפטרות מסיבות בריאות (אישור רפואי), הרעה מהותית בתנאי העבודה שהוכחה, סיום חוזה קצוב ללא הצעת חידוש, והטרדה מינית.',
  },
  {
    question: 'כמה זמן עד שמתחילים לקבל את הכסף?',
    answer:
      'תהליך: (1) מגישים תביעה אונליין באתר ביטוח לאומי (my.btl.gov.il) תוך שבוע מהפסקת העבודה; (2) נרשמים בשירות התעסוקה באופן מיידי; (3) ביטוח לאומי מאשר תוך 14-30 ימי עסקים; (4) לאחר האישור — תשלום ראשון מועבר תוך שבועיים, ותשלומים שוטפים כל חודש-חודשיים. תשלומים מחושבים רטרואקטיבית מיום הזכאות הראשון.',
  },
  {
    question: 'האם דמי אבטלה חייבים במס הכנסה?',
    answer:
      'כן. דמי אבטלה מוגדרים בחוק כהכנסה חייבת במס. ביטוח לאומי מנכה אוטומטית: 10% מס הכנסה (מדרגה 1) + 3.5% ביטוח לאומי. אם שכרך לפני הפסקת העבודה היה במדרגה גבוהה יותר — תשלם הפרש בדוח השנתי. מנגד, אם שנת ההכנסה הנמוכה מזכה בהחזר — ניתן לקבלו דרך הגשת דוח שנתי.',
  },
  {
    question: 'מה קורה אם מצאתי עבודה באמצע תקופת האבטלה?',
    answer:
      'ביום שתתחיל לעבוד — תשלומי דמי האבטלה נפסקים. ימי הזכאות שנשארו "נשמרים" אצלך. אם תפוטר שוב תוך 4 שנים — תוכל לחזור ולנצל את הימים הנותרים מבלי לצבור מחדש מלוא הוותק. אם ההכנסה החדשה נמוכה מ-50% מהשכר הממוצע הארצי — ייתכן שתוכל לקבל "השלמת אבטלה" יחסית.',
  },
  {
    question: 'האם ניתן לעבוד בחלקיות בזמן דמי אבטלה?',
    answer:
      'כן, בתנאים: אם ההכנסה מהעבודה החלקית נמוכה מ-50% מהשכר הממוצע הארצי (כ-6,885 ₪/חודש ב-2026) — תקבל דמי אבטלה מופחתים (מופחתים ביחס לאחוז המשרה). אם ההכנסה עולה על 50% — דמי האבטלה נפסקים לחלוטין לאותו חודש. חובה לדווח לביטוח לאומי ולשירות התעסוקה מיד.',
  },
  {
    question: 'כיצד אבטלה חוזרת (שנייה) שונה מהראשונה?',
    answer:
      'אם תפוטר שוב תוך 4 שנים מהתביעה הראשונה: (א) אם נשארו לך ימי זכאות מהתביעה הקודמת — תתחיל מהם; (ב) אם לא נשארו ימים — עליך לצבור מחדש 12 חודשי ביטוח (ב-18 האחרונים) לפני קבלת תביעה חדשה. כך המדינה מונעת ניצול לרעה של מנגנון האבטלה.',
  },
  {
    question: 'כיצד תקופת האבטלה משפיעה על הפנסיה?',
    answer:
      'בתקופת אבטלה: ביטוח לאומי רושם "ימי ביטוח" שנחשבים לוותק הביטוחי, ומשפיעים על קצבת זקנה עתידית, דמי לידה ועוד. לפנסיה הפרטית (קרן פנסיה/קופת גמל) — אין הפקדות בתקופת האבטלה, אלא אם תפקיד עצמית. חשוב לבדוק עם קרן הפנסיה שלך אפשרות לרצף ביטוחי שומר כיסוי לנכות ולשאירים גם בתקופת האבטלה.',
  },
  {
    question: 'מה הם ה"תנאי מחפש עבודה" שנדרשים לעמוד בהם?',
    answer:
      'בתקופת דמי האבטלה חובה: (1) להתייצב בלשכת התעסוקה בזמנים שנקבעו; (2) להגיב לפניות שירות התעסוקה ולהתראיין לעבודות שמוצעות; (3) לא לסרב ללא סיבה מוצדקת לעבודה המתאימה לכישוריך; (4) לדווח על כל שינוי (עבודה, מחלה, חו"ל). אי-עמידה בתנאים עלולה להפסיק את דמי האבטלה.',
  },
  {
    question: 'האם גם עובדים בחוזה קצוב (תקופתי) זכאים לדמי אבטלה?',
    answer:
      'כן, עם מספר הבדלים: עובד בחוזה קצוב שחוזהו הסתיים ולא חודש — נחשב "פוטר" לצורך דמי אבטלה ואין תקופת המתנה. אולם, אם הסכים לסיום החוזה ידועה מראש ולא ביקש חידוש — ייתכן שיסווג כ"מתפטר". חשוב לתעד את הסיומות. עובד עונתי חוזר — כללים ספציפיים חלים לפי הסכמים קיבוציים.',
  },
];

export default function UnemploymentBenefitsPage() {
  return (
    <CalculatorLayout
      title="מחשבון דמי אבטלה 2026"
      description="בדוק את הזכאות וגובה דמי האבטלה שלך מהביטוח הלאומי. כולל חישוב לפי שכר, גיל, מצב משפחתי, עבודה חלקית והשפעת מס."
      breadcrumbs={[
        { label: 'דף הבית', href: '/' },
        { label: 'זכויות עובדים', href: '/employee-rights' },
        { label: 'דמי אבטלה' },
      ]}
      lastUpdated="2026-05-15"
      calculator={<UnemploymentBenefitsCalculator />}
      content={
        <>
          <h2>דמי אבטלה — מה צריך לדעת</h2>
          <p>
            דמי אבטלה הם תשלום זמני מהביטוח הלאומי לעובד שכיר שאיבד את עבודתו ועומד בתנאי
            הזכאות. הם נועדו לאפשר תקופת חיפוש עבודה ללא דאגה כלכלית חריפה. הסכום מחושב לפי
            השכר הממוצע בששת החודשים האחרונים, עם תקרות וסף שנקבעים בחוק.
          </p>

          <h2>שיעורי תשלום מדורגים (2026)</h2>
          <table className="w-full text-sm border-collapse my-4">
            <thead>
              <tr className="bg-blue-50">
                <th className="border border-gray-300 p-2 text-right">מדרגת שכר</th>
                <th className="border border-gray-300 p-2 text-right">% מהשכר</th>
                <th className="border border-gray-300 p-2 text-right">שכר עד (₪/חודש)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 p-2">עד 60% מהשכר הממוצע</td>
                <td className="border border-gray-300 p-2 font-bold text-green-700">80%</td>
                <td className="border border-gray-300 p-2">עד 8,261 ₪</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="border border-gray-300 p-2">60–80% מהשכר הממוצע</td>
                <td className="border border-gray-300 p-2 font-bold text-blue-700">60%</td>
                <td className="border border-gray-300 p-2">עד 11,015 ₪</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2">מעל 80% מהשכר הממוצע</td>
                <td className="border border-gray-300 p-2 font-bold text-amber-700">50%</td>
                <td className="border border-gray-300 p-2">מעל 11,015 ₪</td>
              </tr>
            </tbody>
          </table>

          <h2>תקרות יומיות 2026</h2>
          <ul>
            <li>ימים 1–125: עד <strong>550.76 ₪/יום</strong></li>
            <li>מיום 126 ואילך: עד <strong>367.17 ₪/יום</strong> (כ-2/3 מהתקרה)</li>
          </ul>

          <h2>תקופת זכאות לפי גיל ומשפחה</h2>
          <table className="w-full text-sm border-collapse my-4">
            <thead>
              <tr className="bg-blue-50">
                <th className="border border-gray-300 p-2 text-right">גיל</th>
                <th className="border border-gray-300 p-2 text-right">ללא ילדים</th>
                <th className="border border-gray-300 p-2 text-right">עם ילדים (מתחת ל-18)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 p-2">20–24</td>
                <td className="border border-gray-300 p-2">50 ימים</td>
                <td className="border border-gray-300 p-2">100 ימים</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="border border-gray-300 p-2">25–27</td>
                <td className="border border-gray-300 p-2">100 ימים</td>
                <td className="border border-gray-300 p-2">100 ימים</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2">28–34</td>
                <td className="border border-gray-300 p-2">138 ימים</td>
                <td className="border border-gray-300 p-2">138 ימים</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="border border-gray-300 p-2">35–44</td>
                <td className="border border-gray-300 p-2">138 ימים</td>
                <td className="border border-gray-300 p-2 font-bold">175 ימים</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2">45+</td>
                <td className="border border-gray-300 p-2 font-bold">175 ימים</td>
                <td className="border border-gray-300 p-2 font-bold">175 ימים</td>
              </tr>
            </tbody>
          </table>

          <h2>שלבי הגשת התביעה</h2>
          <ol>
            <li>
              <strong>להירשם בשירות התעסוקה</strong> — תוך 14 יום מהפסקת העבודה (מומלץ מיד)
            </li>
            <li>
              <strong>להגיש תביעה לביטוח לאומי</strong> — באתר my.btl.gov.il או בסניף
            </li>
            <li>
              <strong>להמתין לאישור</strong> — בדרך כלל 14-30 ימי עסקים
            </li>
            <li>
              <strong>להתייצב קבוע</strong> בלשכת התעסוקה לפי הזמנים שנקבעו
            </li>
          </ol>
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
              ביטוח לאומי — דמי אבטלה (btl.gov.il)
            </a>
          </li>
          <li>
            <a
              href="https://www.gov.il/he/departments/legalInfo/employment_service_law"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              חוק שירות התעסוקה, תשי"ט-1959
            </a>
          </li>
          <li>
            <a
              href="https://www.nevo.co.il/law_html/law01/500_001.htm"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              חוק הביטוח הלאומי (נוסח משולב), תשנ"ה-1995 — פרק י&quot; (דמי אבטלה)
            </a>
          </li>
        </ul>
      }
    />
  );
}
