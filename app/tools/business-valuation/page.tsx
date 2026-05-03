import { Metadata } from 'next';
import { CalculatorLayout } from '@/components/calculator/CalculatorLayout';
import { BusinessValuationCalculator } from '@/components/calculators/BusinessValuationCalculator';
import { FAQ } from '@/components/calculator/FAQ';

export const metadata: Metadata = {
  title: 'מחשבון שווי עסק 2026 - 3 שיטות הערכת שווי',
  description:
    'הערך את שווי העסק שלך - DCF, מכפיל EBITDA, ומכפיל הכנסות. מכפילים מותאמים לענף בישראל 2026. כלי חיוני לפני מכירה / השקעה / מיזוג.',
  alternates: { canonical: '/tools/business-valuation' },
};

const faqItems = [
  {
    question: 'מתי כדאי לבצע הערכת שווי לעסק?',
    answer:
      'במצבים הבאים: (1) לפני מכירה / מיזוג / רכישה; (2) קליטת שותף או משקיע; (3) פרישת בעל מניות; (4) הערכת מס ירושה / מתנה; (5) הערכת ביצועים; (6) קבלת אשראי / שעבוד מניות; (7) חלוקת רכוש בגירושין. גם אם אין צורך מיידי - כדאי לעשות הערכה כל 2-3 שנים כדי לעקוב.',
  },
  {
    question: 'מה זה EBITDA ולמה משתמשים בו?',
    answer:
      'EBITDA = Earnings Before Interest, Tax, Depreciation, Amortization. רווח לפני ריבית, מס, פחת והפחתות. המדד הזה מנטרל את ההשפעה של מבנה ההון (ריבית), משטר המס, והחלטות חשבונאיות (פחת) - ומראה את היכולת התפעולית הטהורה של העסק. זה המדד הסטנדרטי בעולם להערכת שווי.',
  },
  {
    question: 'איך נקבעים מכפילי EBITDA לפי ענף?',
    answer:
      'מכפילים נגזרים מעסקאות אמיתיות בענף + מכפילי חברות ציבוריות. בישראל 2026 (משוער): שירותים מקצועיים 3-5x, מסחר 2-4x, תעשייה 4-6x, היי-טק SaaS 6-12x, מסעדנות 2-3x. מכפילים גבוהים יותר ל: צמיחה מהירה, מחזור משתלם, חוזים ארוכי טווח, IP ייחודי.',
  },
  {
    question: 'מה זה DCF (Discounted Cash Flow)?',
    answer:
      'שיטה מתמטית: מהוונים את כל תזרימי המזומנים העתידיים שצפויים להגיע מהעסק לערכם הנוכחי, בהיוון בשיעור מסוים (Discount Rate / WACC). היתרון: לוקח בחשבון צמיחה והיוון. החיסרון: רגיש לשינויים בהנחות (קצב צמיחה, שיעור היוון). בד"כ משתמשים יחד עם מכפיל EBITDA ובוחנים שהתוצאות סבירות.',
  },
  {
    question: 'מה זה Terminal Value?',
    answer:
      'בשיטת DCF, אנחנו מתחזים תזרים ל-5-10 שנים. אבל העסק ימשיך אחרי זה! Terminal Value הוא השווי שמיוחס לכל התזרים מעבר לתחזית, מחושב לרוב בנוסחת Gordon Growth: TV = FCF × (1+g) / (r-g). בעסקים יציבים, ה-TV יכול להיות 50-70% מהשווי הכולל.',
  },
  {
    question: 'מה ההבדל בין הערכה לפני מכירה לבין הערכת קונה?',
    answer:
      'מוכר מעריך לפי שווי "מי שיודע למקסם את העסק". קונה מעריך לפי "מה אני יכול להוציא מהעסק בידיי". בד"כ יש פער של 20-50% בין שני הצדדים. במשא ומתן, מנסים לסגור את הפער דרך מנגנונים: Earn-out (תשלום תלוי תוצאות), הסכמי המשך עם הבעלים, אופציות.',
  },
  {
    question: 'האם ההערכה במחשבון מספיקה לעסקה אמיתית?',
    answer:
      'לא! ההערכה כאן היא הערכה ראשונית בלבד למטרות תכנון. עסקה אמיתית דורשת: (1) Due Diligence מלא של רואה חשבון; (2) הערכה מקצועית של מעריך מוסמך; (3) ניתוח חוזים ועובדים מרכזיים; (4) בחינת סינרגיות אפשריות; (5) ניתוח סיכונים מקיף. עלות הערכה מקצועית: 15,000-150,000 ₪.',
  },
  {
    question: 'מה משפיע על שווי העסק שלי?',
    answer:
      'גורמים מעלי שווי: צמיחה מהירה, רווחיות גבוהה, חוזים ארוכי טווח, לקוחות מגוונים, IP/פטנטים, צוות חזק לא תלוי בבעלים, מערכות ותהליכים מתועדים. גורמים מורידי שווי: תלות בלקוח אחד, תלות בבעלים, צמיחה משוטחת, חובות גבוהים, סיכונים משפטיים, התחרות עולה.',
  },
];

export default function BusinessValuationPage() {
  return (
    <>
      <CalculatorLayout
        title="מחשבון שווי עסק"
        description="הערכת שווי מקצועית בשלוש שיטות - DCF (היוון תזרים), מכפיל EBITDA, ומכפיל הכנסות. עם מכפילים מותאמים לענפי תעשייה בישראל 2026."
        breadcrumbs={[
          { label: 'דף הבית', href: '/' },
          { label: 'כלים מקצועיים', href: '/tools' },
          { label: 'הערכת שווי' },
        ]}
        lastUpdated="2026-05-03"
        calculator={<BusinessValuationCalculator />}
        content={
          <>
            <h2>למה כדאי להעריך את שווי העסק?</h2>
            <p>
              שווי העסק הוא אחד מהנכסים המשמעותיים ביותר שיש לבעל עסק - ועם זאת, רוב הבעלים לא
              יודעים כמה הוא שווה באמת. הערכת שווי תקופתית עוזרת ב: תכנון פרישה, קבלת החלטות
              צמיחה / מכירה, גיוס שותפים / משקיעים, וניהול סיכונים.
            </p>

            <h2>3 השיטות העיקריות להערכת שווי</h2>

            <h3>1. מכפיל EBITDA (Multiple Method)</h3>
            <p>
              המתודולוגיה הכי נפוצה בעסקאות M&A. מבוססת על מכפיל ענפי × EBITDA. למשל: בעסק
              שירותים עם EBITDA של 1M ₪ ומכפיל 4x → שווי 4M ₪. <strong>יתרון:</strong> פשטות,
              השוואה לעסקאות אחרות. <strong>חיסרון:</strong> לא לוקח בחשבון צמיחה ספציפית.
            </p>

            <h3>2. DCF - היוון תזרים מזומנים</h3>
            <p>
              שיטה מתמטית שמהוונת את כל התזרימים העתידיים לערך נוכחי. הפרמטרים: קצב צמיחה, שיעור
              היוון (WACC), תקופת תחזית, Terminal Value. <strong>יתרון:</strong> מדויקת
              תיאורטית. <strong>חיסרון:</strong> רגישה להנחות (סטיה של 1% בהיוון = 10-15% שינוי).
            </p>

            <h3>3. מכפיל הכנסות (Revenue Multiple)</h3>
            <p>
              מכפיל הכנסות שנתיות (במיוחד ב-SaaS). למשל: SaaS עם ARR של 5M ומכפיל 4x → שווי 20M.
              <strong>יתרון:</strong> פשוטה במיוחד לעסקים צעירים שעוד לא רווחיים.
              <strong>חיסרון:</strong> מתעלמת מרווחיות.
            </p>

            <h2>מכפילים טיפוסיים בישראל 2026</h2>
            <table className="w-full text-sm border-collapse my-4">
              <thead>
                <tr className="bg-blue-50">
                  <th className="border border-gray-300 p-2 text-right">ענף</th>
                  <th className="border border-gray-300 p-2 text-right">מכפיל EBITDA</th>
                  <th className="border border-gray-300 p-2 text-right">מכפיל הכנסות</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 p-2">שירותים מקצועיים</td>
                  <td className="border border-gray-300 p-2">3-5x</td>
                  <td className="border border-gray-300 p-2">0.5-1.5x</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2">מסחר</td>
                  <td className="border border-gray-300 p-2">2-4x</td>
                  <td className="border border-gray-300 p-2">0.3-0.7x</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2">תעשייה</td>
                  <td className="border border-gray-300 p-2">4-6x</td>
                  <td className="border border-gray-300 p-2">0.8-1.5x</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2">היי-טק SaaS</td>
                  <td className="border border-gray-300 p-2">8-12x</td>
                  <td className="border border-gray-300 p-2">3-7x</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2">מסעדנות / תיירות</td>
                  <td className="border border-gray-300 p-2">2-3x</td>
                  <td className="border border-gray-300 p-2">0.5-1x</td>
                </tr>
              </tbody>
            </table>

            <h2>איך מעלים את השווי?</h2>
            <ol>
              <li>
                <strong>הגדלת רווחיות תפעולית</strong> - יותר EBITDA × אותו מכפיל = שווי גבוה
              </li>
              <li>
                <strong>צמיחה עקבית</strong> - מעלה את המכפיל עצמו
              </li>
              <li>
                <strong>הפחתת תלות בבעלים</strong> - תהליכים, צוות ניהולי
              </li>
              <li>
                <strong>חוזים ארוכי טווח</strong> - חיזוי הכנסות = שווי גבוה
              </li>
              <li>
                <strong>גיוון לקוחות</strong> - אף לקוח מתחת ל-20% מהמכירות
              </li>
              <li>
                <strong>תיעוד מלא</strong> - מערכות, נהלים, תהליכים
              </li>
            </ol>
          </>
        }
        faq={<FAQ items={faqItems} />}
        sources={
          <ul className="space-y-2 text-blue-700">
            <li>
              <a
                href="https://www.icpas.org.il"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                לשכת רואי החשבון - עקרונות הערכת שווי
              </a>
            </li>
          </ul>
        }
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebApplication',
            name: 'מחשבון שווי עסק',
            applicationCategory: 'FinanceApplication',
            operatingSystem: 'Any',
            offers: { '@type': 'Offer', price: '0', priceCurrency: 'ILS' },
            inLanguage: 'he',
          }),
        }}
      />
    </>
  );
}
