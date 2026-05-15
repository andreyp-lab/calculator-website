import { Metadata } from 'next';
import { CalculatorLayout } from '@/components/calculator/CalculatorLayout';
import { MinimumWageCalculator } from '@/components/calculators/MinimumWageCalculator';
import { FAQ } from '@/components/calculator/FAQ';

export const metadata: Metadata = {
  title: 'מחשבון שכר מינימום 2026 – חודשי, שעתי, יומי, נוער ונטו',
  description:
    'שכר מינימום ישראל 2026: 6,443.85 ₪/חודש | 35.40 ₪/שעה. בדיקת תאימות, חישוב נטו, השוואה בינלאומית, נוער, היסטוריה ועלות מחיה.',
  alternates: { canonical: '/employee-rights/minimum-wage' },
};

const faqItems = [
  {
    question: 'מהו שכר המינימום ב-2026?',
    answer:
      'מ-1.4.2026 שכר המינימום עומד על 6,443.85 ₪ לחודש למשרה מלאה (182 שעות). התעריפים: שעתי לפי 182 שעות/חודש – 35.40 ₪; שעתי לפי 186 שעות/חודש – 34.64 ₪; יומי לפי 5 ימי עבודה בשבוע – 297.40 ₪; יומי לפי 6 ימים – 257.75 ₪.',
  },
  {
    question: 'מה שכר המינימום לנוער (מתחת לגיל 18)?',
    answer:
      'חוק עבודת נוער קובע שכר מינימום מופחת: מתחת לגיל 16 – 60% (≈3,866 ₪/חודש); גיל 16-17 – 70% (≈4,511 ₪/חודש); גיל 17-18 – 75% (≈4,833 ₪/חודש). מגיל 18 – שכר מינימום מלא. חשוב: שכר נמוך יותר מהמותר לפי גיל הוא עבירה, גם אם העובד הסכים.',
  },
  {
    question: 'מה אם המעסיק משלם פחות משכר מינימום?',
    answer:
      'תשלום פחות משכר המינימום הוא עבירה פלילית לפי חוק שכר מינימום התשמ"ז-1987. המעסיק חייב להשלים את ההפרש בתוספת ריבית והצמדה. ניתן להגיש תלונה לאגף הפיקוח על יחסי עבודה של משרד הכלכלה (1-700-707-100), לבית הדין לעבודה, או לפנות דרך ביטוח לאומי. מומלץ לתעד שעות עבודה, תלושי שכר והתכתבויות עם המעסיק.',
  },
  {
    question: 'האם תוספות שכר נחשבות לשכר המינימום?',
    answer:
      'לפי החוק, לא. שכר המינימום מתייחס לשכר היסוד בלבד. תוספות שאינן נחשבות לשכר מינימום: פרמיות ייצור, תוספת שעות נוספות, תוספות מיוחדות כגון נסיעות, הבראה, ביגוד. לעומת זאת, תוספת ותק שנקבעה בהסכם קיבוצי כחלק מהשכר – עשויה להיחשב. אם יש ספק, מומלץ לפנות לייעוץ משפטי.',
  },
  {
    question: 'כמה שכר מינימום נטו מקבלים?',
    answer:
      'עובד המקבל שכר מינימום מלא (6,443.85 ₪) עם 2.25 נקודות זיכוי ופנסיה 6% יקבל נטו כ-5,500-5,700 ₪ לחודש, תלוי בנקודות הזיכוי. שכר מינימום נמצא כמעט כולו במדרגת 10% מס הכנסה, ולכן רוב ניכויי המס הם ב.ל. ובריאות (כ-4.27%-12.17%).',
  },
  {
    question: 'מתי ואיך מתעדכן שכר המינימום?',
    answer:
      'שכר המינימום מתעדכן לרוב פעם בשנה (בתחילת אפריל) לפי שינויים במדד המחירים לצרכן ולפי הסכמים בין הממשלה, ההסתדרות ומרכז המעסיקים. ב-2026 עלה שכר המינימום ב-3.14% לעומת 2025 (מ-6,247.67 ₪ ל-6,443.85 ₪). ב-2027 צפוי עדכון נוסף בהתאם למדד.',
  },
  {
    question: 'האם עובד זר (מוגדר לא ישראלי) זכאי לשכר מינימום?',
    answer:
      'כן. עובדים זרים חוקיים המועסקים בישראל זכאים לשכר מינימום מלא, בדיוק כמו עובדים ישראלים. חוק שכר מינימום חל על כל עובד שכיר בישראל, ללא קשר ללאומיות. הפרות שכר מינימום של עובדים זרים הן עבירה חמורה במיוחד ועלולות להוביל לביטול רישיון עסקי.',
  },
  {
    question: 'מה ההבדל בין שכר מינימום ל"שכר מחייה" (Living Wage)?',
    answer:
      'שכר מינימום הוא הרף החוקי המינימלי שמותר לשלם לעובד. "שכר מחייה" הוא הסכום הדרוש לקיום בסיסי כבוד – כולל שכר דירה, מזון, תחבורה, בריאות וחינוך. מחקרים ישראליים מצביעים על פער משמעותי: למשל, ליחיד בתל אביב שכר המחייה עשוי להגיע ל-8,000-10,000 ₪, גבוה בהרבה משכר המינימום.',
  },
  {
    question: 'האם עובד במשרה חלקית זכאי לשכר מינימום?',
    answer:
      'כן, אבל בחישוב יחסי. עובד ב-50% משרה זכאי לפחות 50% משכר המינימום (≈3,222 ₪). החישוב הוא: אחוז משרה × שכר מינימום מלא. גם שכר מינימום שעתי חל בהתאם: לכל שעת עבודה מגיעות לפחות 35.40 ₪.',
  },
  {
    question: 'האם ישנם ענפים עם שכר מינימום גבוה יותר?',
    answer:
      'כן. מספר ענפים קיבוציים מחויבים בשכר גבוה יותר מהמינימום הסטטוטורי, בשל הסכמים קיבוציים או צווי הרחבה. לדוגמה: אבטחה ושמירה – מינימום ≈7,200 ₪; ניקיון – ≈6,600 ₪; בנייה – ≈6,800 ₪. המינימום הגבוה יותר חל גם אם המעסיק לא חתום על ההסכם, כל עוד צו ההרחבה פורסם.',
  },
  {
    question: 'כיצד ישראל ממוקמת ביחס לעולם בשכר מינימום?',
    answer:
      'ישראל ממוקמת בדרגה בינונית-גבוהה בין מדינות ה-OECD. בהתאמת כוח קנייה (PPP) שכר המינימום הישראלי עומד על כ-1,780 USD לחודש, גבוה ממדינות כמו ספרד (≈1,650$) וארה"ב (1,256$), אך נמוך ממדינות כמו אוסטרליה (2,850$) ולוקסמבורג (2,700$).',
  },
];

export default function Page() {
  return (
    <CalculatorLayout
      title="מחשבון שכר מינימום 2026"
      description="בדיקת שכר מינימום לפי החוק – חודשי, שעתי, יומי. כולל חישוב נטו, נוער, היסטוריה, השוואה בינלאומית ועלות מחיה."
      breadcrumbs={[
        { label: 'דף הבית', href: '/' },
        { label: 'זכויות עובדים', href: '/employee-rights' },
        { label: 'שכר מינימום' },
      ]}
      lastUpdated="2026-05-15"
      calculator={<MinimumWageCalculator />}
      content={
        <>
          <h2>שכר מינימום בישראל 2026</h2>
          <p>
            שכר המינימום הוא הסכום המינימלי שמעסיק חייב לשלם לעובד שכיר לפי חוק שכר מינימום
            התשמ"ז-1987. החוק חל על כל עובד שכיר בישראל, ללא קשר ללאומיות, מין, גיל, או סוג
            ההעסקה (פרט לנוער שלגביו חלות הוראות מיוחדות).
          </p>

          <h2>תעריפי שכר מינימום מעודכנים (1.4.2026)</h2>
          <table className="w-full text-sm border-collapse my-4">
            <thead>
              <tr className="bg-blue-50">
                <th className="border border-gray-300 p-2 text-right font-semibold">סוג</th>
                <th className="border border-gray-300 p-2 text-right font-semibold">סכום</th>
                <th className="border border-gray-300 p-2 text-right font-semibold">בסיס</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 p-2">חודשי (משרה מלאה)</td>
                <td className="border border-gray-300 p-2 font-bold text-blue-700">6,443.85 ₪</td>
                <td className="border border-gray-300 p-2 text-gray-500">182 שעות/חודש</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="border border-gray-300 p-2">שעתי (182 ש/ח)</td>
                <td className="border border-gray-300 p-2 font-bold text-blue-700">35.40 ₪</td>
                <td className="border border-gray-300 p-2 text-gray-500">5 ימי עבודה/שבוע</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2">שעתי (186 ש/ח)</td>
                <td className="border border-gray-300 p-2 font-bold text-blue-700">34.64 ₪</td>
                <td className="border border-gray-300 p-2 text-gray-500">6 ימי עבודה/שבוע</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="border border-gray-300 p-2">יומי (5 ימים/שבוע)</td>
                <td className="border border-gray-300 p-2 font-bold text-blue-700">297.40 ₪</td>
                <td className="border border-gray-300 p-2 text-gray-500">22 ימי עבודה/חודש</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2">יומי (6 ימים/שבוע)</td>
                <td className="border border-gray-300 p-2 font-bold text-blue-700">257.75 ₪</td>
                <td className="border border-gray-300 p-2 text-gray-500">25 ימי עבודה/חודש</td>
              </tr>
            </tbody>
          </table>

          <h2>שכר מינימום לנוער</h2>
          <table className="w-full text-sm border-collapse my-4">
            <thead>
              <tr className="bg-amber-50">
                <th className="border border-gray-300 p-2 text-right font-semibold">גיל</th>
                <th className="border border-gray-300 p-2 text-right font-semibold">אחוז</th>
                <th className="border border-gray-300 p-2 text-right font-semibold">חודשי</th>
                <th className="border border-gray-300 p-2 text-right font-semibold">שעתי</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 p-2">מתחת ל-16</td>
                <td className="border border-gray-300 p-2">60%</td>
                <td className="border border-gray-300 p-2">3,866.31 ₪</td>
                <td className="border border-gray-300 p-2">21.24 ₪</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="border border-gray-300 p-2">16-17</td>
                <td className="border border-gray-300 p-2">70%</td>
                <td className="border border-gray-300 p-2">4,510.70 ₪</td>
                <td className="border border-gray-300 p-2">24.78 ₪</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2">17-18</td>
                <td className="border border-gray-300 p-2">75%</td>
                <td className="border border-gray-300 p-2">4,832.89 ₪</td>
                <td className="border border-gray-300 p-2">26.55 ₪</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="border border-gray-300 p-2">18+</td>
                <td className="border border-gray-300 p-2">100%</td>
                <td className="border border-gray-300 p-2">6,443.85 ₪</td>
                <td className="border border-gray-300 p-2">35.40 ₪</td>
              </tr>
            </tbody>
          </table>

          <h2>מה כוללת ההגנה של חוק שכר מינימום?</h2>
          <ul>
            <li>עובד שכיר שמועסק 182 שעות לחודש זכאי לשכר מינימום חודשי מלא</li>
            <li>עובד שכיר בעסק קטן (פחות מ-5 עובדים) – אותן הוראות</li>
            <li>עובדים זרים חוקיים – אותן הוראות</li>
            <li>עבודה בשעות נוספות מחושבת על בסיס שכר המינימום כמחיר שעה</li>
          </ul>

          <h2>הפרה – מה קורה?</h2>
          <p>
            מעסיק שמשלם פחות משכר המינימום צפוי לתשלום ההפרש בצירוף ריבית, לקנס פלילי, ואף למאסר
            (בהפרות חוזרות). ניתן להגיש תלונה לאגף הפיקוח על יחסי עבודה של משרד הכלכלה ב-
            1-700-707-100.
          </p>
        </>
      }
      faq={<FAQ items={faqItems} />}
    />
  );
}
