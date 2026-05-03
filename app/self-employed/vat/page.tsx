import { Metadata } from 'next';
import { CalculatorLayout } from '@/components/calculator/CalculatorLayout';
import { VatCalculator } from '@/components/calculators/VatCalculator';
import { FAQ } from '@/components/calculator/FAQ';

export const metadata: Metadata = {
  title: 'מחשבון מע"מ 2026 - הוספה וחילוץ מע"מ',
  description:
    'מחשבון מע"מ מקצועי ב-18%. הוספת מע"מ לסכום או חילוץ מע"מ מסכום סופי. לעצמאיים ועוסקים מורשים.',
  alternates: { canonical: '/self-employed/vat' },
};

const faqItems = [
  {
    question: 'מהו שיעור המע"מ ב-2026?',
    answer:
      'שיעור המע"מ הסטנדרטי בישראל ב-2026 הוא 18%. השיעור עלה מ-17% ל-18% ב-1 בינואר 2025 כחלק ממדיניות הממשלה לאחר מלחמת חרבות ברזל. אין שינוי צפוי ב-2026.',
  },
  {
    question: 'איך מחשבים מע"מ על סכום?',
    answer:
      'כדי להוסיף מע"מ לסכום ללא מע"מ: הכפל ב-1.18 (בסכום הסופי), או הכפל ב-0.18 (בסכום המע"מ בלבד). למשל: 1,000 ₪ × 1.18 = 1,180 ₪ סופי, מתוכם 180 ₪ מע"מ.',
  },
  {
    question: 'איך מחלצים את המע"מ מסכום סופי?',
    answer:
      'אם יש לך סכום שכולל מע"מ ואתה רוצה לדעת כמה מע"מ "מסתתר" בו: חלק את הסכום ב-1.18 כדי לקבל את הסכום ללא מע"מ. למשל: 1,180 ₪ ÷ 1.18 = 1,000 ₪ ללא מע"מ, והמע"מ הוא 180 ₪.',
  },
  {
    question: 'מי חייב לגבות מע"מ?',
    answer:
      'עוסק מורשה (מי שמחזור עסקאותיו מעל תקרת עוסק פטור) חייב לגבות מע"מ מלקוחותיו ולהעבירו לרשות המסים. עוסק פטור (עד ~120,000 ₪/שנה ב-2026) פטור מגבייה ומדיווח.',
  },
  {
    question: 'מהי תקרת עוסק פטור ב-2026?',
    answer:
      'תקרת עוסק פטור ב-2026 היא כ-120,000 ₪ למחזור שנתי. עוסק פטור לא מנפיק חשבוניות מס, לא גובה מע"מ ולא מקזז מע"מ תשומות. התקרה מתעדכנת מעת לעת.',
  },
  {
    question: 'מה זה מע"מ אפס ומתי הוא חל?',
    answer:
      'מע"מ אפס (0%) חל בעיקר על יצוא של טובין ושירותים מחוץ לישראל, ועל מכירות לתיירים בנמלי כניסה. החייל בעוסק יכול להזדכות במע"מ תשומות שהשתלם, ולכן זה שונה מ"פטור".',
  },
  {
    question: 'מתי משלמים מע"מ לרשות המסים?',
    answer:
      'דיווח חודשי או דו-חודשי, לפי מחזור העסקים. הדיווח חייב להגיע עד ה-15 של החודש שאחרי תקופת הדיווח. החל מ-2024 חובה להשתמש ב"חשבונית ישראל" - מערכת דיווח מקוונת.',
  },
  {
    question: 'האם המע"מ נכלל במחיר לצרכן?',
    answer:
      'כן, על פי חוק, מחיר לצרכן הסופי בישראל חייב להיות מוצג כולל מע"מ. בעסקה בין עוסקים, לעיתים מציגים מחיר ללא מע"מ ועם מע"מ בנפרד. זה תקני בחשבוניות מס.',
  },
];

export default function VatPage() {
  return (
    <>
      <CalculatorLayout
        title="מחשבון מע&quot;מ 2026"
        description="חישוב מהיר ופשוט של מס ערך מוסף ב-18%. הוסף מע&quot;מ לסכום או חלץ אותו מסכום סופי."
        breadcrumbs={[
          { label: 'דף הבית', href: '/' },
          { label: 'עצמאיים', href: '/self-employed' },
          { label: 'מחשבון מע"מ' },
        ]}
        lastUpdated="2026-05-03"
        calculator={<VatCalculator />}
        content={
          <>
            <h2>מהו מע&quot;מ?</h2>
            <p>
              מס ערך מוסף (מע&quot;מ) הוא מס עקיף שמשולם על ידי הצרכן הסופי, אך נגבה לאורך שרשרת
              ההפצה. כל עוסק מורשה גובה מע&quot;מ ממכירות ומקזז את המע&quot;מ ששילם על תשומות
              (קניות עסקיות).
            </p>
            <p>
              בישראל שיעור המע&quot;מ הסטנדרטי הוא <strong>18%</strong> נכון לשנת 2026 (עלה מ-17%
              ב-1.1.2025).
            </p>

            <h2>איך עובד החישוב?</h2>

            <h3>הוספת מע&quot;מ לסכום</h3>
            <p>אם יש לך מחיר בסיסי (ללא מע&quot;מ) ואתה רוצה לדעת מה המחיר הסופי לצרכן:</p>
            <ul>
              <li>
                <strong>נוסחה</strong>: סכום סופי = סכום × 1.18
              </li>
              <li>
                <strong>דוגמה</strong>: 1,000 × 1.18 = 1,180 ₪ (מתוכם 180 ₪ מע&quot;מ)
              </li>
            </ul>

            <h3>חילוץ מע&quot;מ מסכום</h3>
            <p>אם יש לך מחיר סופי לצרכן ואתה רוצה לדעת כמה מע&quot;מ &quot;מסתתר&quot; בו:</p>
            <ul>
              <li>
                <strong>נוסחה</strong>: סכום ללא מע&quot;מ = סכום ÷ 1.18
              </li>
              <li>
                <strong>דוגמה</strong>: 1,180 ÷ 1.18 = 1,000 ₪ ללא מע&quot;מ
              </li>
            </ul>

            <h2>סוגי עוסקים</h2>
            <ul>
              <li>
                <strong>עוסק פטור</strong> - עסק קטן עם מחזור עד ~120,000 ₪ לשנה. לא גובה
                מע&quot;מ, לא מקזז תשומות.
              </li>
              <li>
                <strong>עוסק מורשה</strong> - עסק גדול יותר, חייב לגבות מע&quot;מ ולדווח עליו לרשות
                המסים.
              </li>
              <li>
                <strong>חברה בע&quot;מ</strong> - תמיד עוסקת מורשית, ללא תלות במחזור.
              </li>
            </ul>

            <h2>הסוגי שיעורים שונים של מע&quot;מ</h2>
            <ul>
              <li>
                <strong>18%</strong> - שיעור רגיל על רוב המוצרים והשירותים
              </li>
              <li>
                <strong>0%</strong> - יצוא, שירותים לחו&quot;ל, חלק מהמכירות לתיירים
              </li>
              <li>
                <strong>פטור</strong> - שירותים פיננסיים, ביטוח, השכרת דירות למגורים
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
                רשות המסים - מע&quot;מ
              </a>
            </li>
            <li>
              <a
                href="https://www.kolzchut.org.il/he/%D7%9E%D7%A2%22%D7%9E"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                כל-זכות: מע&quot;מ
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
            name: 'מחשבון מע"מ 2026',
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
