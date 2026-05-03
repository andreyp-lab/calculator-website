import { Metadata } from 'next';
import { CalculatorLayout } from '@/components/calculator/CalculatorLayout';
import { RecreationPayCalculator } from '@/components/calculators/RecreationPayCalculator';
import { FAQ } from '@/components/calculator/FAQ';

export const metadata: Metadata = {
  title: 'מחשבון דמי הבראה 2026 - חישוב לפי וותק',
  description:
    'מחשבון דמי הבראה מקצועי לשנת 2026. חשב את דמי ההבראה שמגיעים לך לפי וותק, מגזר עבודה ואחוז משרה.',
  alternates: { canonical: '/employee-rights/recreation-pay' },
};

const faqItems = [
  {
    question: 'מי זכאי לדמי הבראה?',
    answer:
      'כל עובד שכיר שהשלים שנה אחת לפחות במקום העבודה זכאי לדמי הבראה. הזכות חלה גם על עובדים בחוזה לתקופה קצובה, עובדים זרים, ובמשרה חלקית (יחסית להיקף המשרה).',
  },
  {
    question: 'מהו תעריף דמי ההבראה ב-2026?',
    answer:
      'במגזר הפרטי - 418 ₪ ליום. במגזר הציבורי (עובדי מדינה ועובדים שחל עליהם הסכם קיבוצי דומה) - 471.40 ₪ ליום. התעריף מתעדכן בדרך כלל פעם בשנה.',
  },
  {
    question: 'כמה ימי הבראה מגיעים לי?',
    answer:
      'במגזר הפרטי: שנה 1 - 5 ימים, שנים 2-3 - 6 ימים, שנים 4-10 - 7 ימים, שנים 11-15 - 8 ימים, שנים 16-19 - 9 ימים, 20 שנה ומעלה - 10 ימים. במגזר הציבורי המספרים גבוהים יותר.',
  },
  {
    question: 'מתי משולמים דמי הבראה?',
    answer:
      'ברוב מקומות העבודה דמי הבראה משולמים פעם בשנה - בדרך כלל בקיץ (יוני-אוגוסט). אצל חלק מהמעסיקים הם משולמים במנות חודשיות. ההסכם הקיבוצי או חוזה העבודה קובע.',
  },
  {
    question: 'האם דמי הבראה חייבים במס?',
    answer:
      'כן, דמי הבראה חייבים במס הכנסה ובדמי ביטוח לאומי וביטוח בריאות, כמו שכר רגיל. הם חלק מהשכר הברוטו ומופיעים בתלוש המשכורת.',
  },
  {
    question: 'מה אם פוטרתי לפני שקיבלתי דמי הבראה?',
    answer:
      'גם אם פוטרת או התפטרת, אתה זכאי לדמי הבראה יחסיים עבור התקופה שעבדת. זכות זו לא פוקעת ויש לכלול אותה בגמר חשבון.',
  },
  {
    question: 'האם דמי הבראה חלים על עובדים זרים?',
    answer:
      'כן, חוקי העבודה הישראליים חלים על כל העובדים בישראל, כולל עובדים זרים. הם זכאים לאותם תנאים, ומגיע להם דמי הבראה לאחר שנה במקום העבודה.',
  },
  {
    question: 'מה ההבדל בין מגזר פרטי לציבורי?',
    answer:
      'במגזר הציבורי (עובדי מדינה, רשויות מקומיות, חלק מהארגונים) חל הסכם קיבוצי משלוח הסדרים מטיבים יותר - תעריף יומי גבוה יותר ומספר ימים גדול יותר. במגזר הפרטי חל צו ההרחבה הכללי.',
  },
];

export default function RecreationPayPage() {
  return (
    <>
      <CalculatorLayout
        title="מחשבון דמי הבראה 2026"
        description="חישוב דמי הבראה מדויק לפי צו ההרחבה הכללי במשק. ערכים מעודכנים לשנת 2026."
        breadcrumbs={[
          { label: 'דף הבית', href: '/' },
          { label: 'זכויות עובדים', href: '/employee-rights' },
          { label: 'מחשבון דמי הבראה' },
        ]}
        lastUpdated="2026-05-03"
        calculator={<RecreationPayCalculator />}
        content={
          <>
            <h2>מהם דמי הבראה?</h2>
            <p>
              דמי הבראה הם זכות בסיסית של עובדים בישראל - תשלום שנתי הניתן לעובד לצורך הבראה ונופש.
              הזכות מוסדרת בצו ההרחבה הכללי במשק (מגזר פרטי) ובהסכמים קיבוציים שונים (מגזר ציבורי).
            </p>

            <h2>תעריפים 2026</h2>
            <ul>
              <li>
                <strong>מגזר פרטי</strong>: 418 ₪ ליום
              </li>
              <li>
                <strong>מגזר ציבורי</strong>: 471.40 ₪ ליום
              </li>
            </ul>

            <h2>ימי הבראה לפי וותק (מגזר פרטי)</h2>
            <table>
              <thead>
                <tr>
                  <th>וותק</th>
                  <th>ימי הבראה</th>
                  <th>סכום שנתי (משרה מלאה)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>שנה 1</td>
                  <td>5 ימים</td>
                  <td>2,090 ₪</td>
                </tr>
                <tr>
                  <td>שנים 2-3</td>
                  <td>6 ימים</td>
                  <td>2,508 ₪</td>
                </tr>
                <tr>
                  <td>שנים 4-10</td>
                  <td>7 ימים</td>
                  <td>2,926 ₪</td>
                </tr>
                <tr>
                  <td>שנים 11-15</td>
                  <td>8 ימים</td>
                  <td>3,344 ₪</td>
                </tr>
                <tr>
                  <td>שנים 16-19</td>
                  <td>9 ימים</td>
                  <td>3,762 ₪</td>
                </tr>
                <tr>
                  <td>20 שנה ומעלה</td>
                  <td>10 ימים</td>
                  <td>4,180 ₪</td>
                </tr>
              </tbody>
            </table>

            <h2>הזכאות לעובד במשרה חלקית</h2>
            <p>
              עובד במשרה חלקית זכאי לדמי הבראה <strong>בהתאם לאחוז המשרה</strong>. למשל, עובד במשרת
              50% עם וותק של 5 שנים יקבל: 7 ימים × 418 ₪ × 50% = 1,463 ₪.
            </p>

            <h2>מתי משולמים דמי ההבראה?</h2>
            <p>
              ברוב מקומות העבודה - תשלום שנתי בקיץ (יוני-אוגוסט). אצל חלק מהמעסיקים - תשלום חודשי
              בתלוש. בכל מקרה, הזכות לדמי הבראה היא שנתית ויש לקבלה מלאה.
            </p>

            <h2>הבדל מגזר פרטי לציבורי</h2>
            <p>
              במגזר הציבורי - הסכמים קיבוציים מיטיבים: תעריף גבוה יותר, מספר ימים גדול יותר וכללים
              שונים לחישוב הוותק. במגזר הפרטי - חל צו ההרחבה הכללי שהוא הסטנדרט המינימלי.
            </p>
          </>
        }
        faq={<FAQ items={faqItems} />}
        sources={
          <ul className="space-y-2 text-blue-700">
            <li>
              <a
                href="https://www.kolzchut.org.il/he/%D7%93%D7%9E%D7%99_%D7%94%D7%91%D7%A8%D7%90%D7%94"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                כל-זכות: דמי הבראה
              </a>
            </li>
            <li>
              <a
                href="https://www.btl.gov.il"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                ביטוח לאומי
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
            name: 'מחשבון דמי הבראה 2026',
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
