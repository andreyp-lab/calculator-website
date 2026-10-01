import type { Metadata } from 'next';
import Link from 'next/link';
import { CalculatorLayout } from '@/components/calculator/CalculatorLayout';
import { FAQ } from '@/components/calculator/FAQ';
import { VAT_2026 } from '@/lib/constants/tax-2026';

const PAGE_PATH = '/self-employed/vat-threshold';
const threshold = VAT_2026.smallBusinessThreshold.toLocaleString('he-IL');
const registration = 'https://www.gov.il/he/service/request-open-exempt-dealer-via-internet';
const declaration = 'https://www.gov.il/he/service/vat-declarationisexempt';
const licensedRegistration = 'https://www.gov.il/he/service/vat-821';
const officialGuide =
  'https://www.gov.il/BlobFolder/generalpage/income-tax-guide-knowyourright/he/Guides_IncomeTax_da-2025.pdf';

export const metadata: Metadata = {
  title: { absolute: `תקרת עוסק פטור 2026: ${threshold} ₪ ומה עושים בחריגה` },
  description: `תקרת עוסק פטור ב-2026 היא ${threshold} ₪ במחזור עסקאות. מה נכלל במחזור, איך לעקוב במהלך השנה ומה עושים כשמתקרבים לתקרה או עוברים אותה.`,
  alternates: { canonical: PAGE_PATH },
  openGraph: {
    images: ['/opengraph-image'],
    title: `תקרת עוסק פטור 2026: ${threshold} ₪`,
    description: 'מדריך מעשי למעקב אחר מחזור העסקאות ולבדיקת שינוי סיווג במע״מ.',
    type: 'article',
    locale: 'he_IL',
  },
};

const faqItems = [
  {
    question: 'מהי תקרת עוסק פטור בשנת 2026?',
    answer: `לפי שירות פתיחת עוסק פטור של רשות המסים, מחזור העסקאות השנתי הצפוי לא יעלה על ${threshold} ₪ בשנת 2026. בנוסף, סוג העיסוק צריך לאפשר רישום כעוסק פטור.`,
  },
  {
    question: 'התקרה נבדקת לפי הכנסה או לפי רווח?',
    answer:
      'לפי מחזור העסקאות, לפני הפחתת הוצאות. רווח הוא ההפרש לאחר הוצאות ומשמש לבדיקות מס אחרות; הוא אינו הנתון שמשווים לתקרת עוסק פטור.',
  },
  {
    question: 'מה עושים אם עברתי את התקרה?',
    answer:
      'פונים בהקדם למשרד מע״מ האזורי כדי לשנות את הסיווג לעוסק מורשה ולברר את מועד תחולת השינוי, המסמכים והדיווח הנדרשים. אין להניח שרק הסכום שמעל התקרה חייב במע״מ או לקבוע לבד את מועד החיוב.',
  },
  {
    question: 'האם כל מי שמתחת לתקרה יכול לפתוח עוסק פטור?',
    answer:
      'לא. תקנה 13 לתקנות מע״מ (רישום) קובעת עיסוקים שחייבים ברישום כעוסק מורשה גם במחזור נמוך מהתקרה. בדקו את תנאי השירות הרשמי לפי הפעילות המדויקת שלכם.',
  },
  {
    question: 'עוסק פטור ובעל עסק זעיר הם אותו דבר?',
    answer:
      'לא. עוסק פטור הוא סיווג במע״מ. בעל עסק זעיר הוא מסלול במס הכנסה עם תנאים וכללי דיווח משלו. ייתכן קשר בין הנתונים, אבל אין להסיק זכאות למסלול אחד מהרישום במסלול האחר.',
  },
];

export default function VatThresholdPage() {
  return (
    <CalculatorLayout
      title={`תקרת עוסק פטור 2026 — ${threshold} ₪`}
      description="כך בודקים את מחזור העסקאות, מזהים התקרבות לתקרה ופועלים מול מע״מ בלי להסתמך על כלל אצבע."
      breadcrumbs={[
        { label: 'דף הבית', href: '/' },
        { label: 'עצמאים', href: '/self-employed' },
        { label: 'תקרת עוסק פטור' },
      ]}
      pageUrl={PAGE_PATH}
      lastUpdated="2026-10-01"
      quickAnswer={
        <p>
          תקרת מחזור העסקאות הצפוי לפתיחת עוסק פטור בשנת 2026 היא{' '}
          <strong>{threshold} ₪</strong>, לפי רשות המסים. משווים לתקרה את מחזור העסקאות — לא את
          הרווח אחרי הוצאות. התקרה לבדה אינה מספיקה: מי שעיסוקו נכלל בתקנה 13 לתקנות מע״מ
          (רישום) נדרש להירשם כעוסק מורשה גם במחזור נמוך יותר. אם המחזור מתקרב לתקרה או עבר אותה,
          פונים למשרד מע״מ לבדיקת שינוי הסיווג ומועד תחולתו; לא מניחים שרק ההפרש מעל התקרה חייב.
        </p>
      }
      content={
        <>
          <div className="not-prose mb-10 border border-ink/20 bg-paper p-6">
            <h2 className="mb-4 text-xl font-bold text-ink">בדיקת מצב בארבעה נתונים</h2>
            <ol className="grid gap-3 text-sm leading-relaxed text-ink/75 sm:grid-cols-2">
              <li className="border border-ink/15 bg-cream-2 p-4">
                <strong className="block text-ink">1. מחזור בפועל</strong>
                סכמו את העסקאות מתחילת שנת 2026 לפי רישומי העסק.
              </li>
              <li className="border border-ink/15 bg-cream-2 p-4">
                <strong className="block text-ink">2. עסקאות צפויות</strong>
                הוסיפו עבודה חתומה או צפויה עד סוף השנה, לא רק תקבולים שכבר נכנסו לבנק.
              </li>
              <li className="border border-ink/15 bg-cream-2 p-4">
                <strong className="block text-ink">3. סוג העיסוק</strong>
                ודאו שהפעילות אינה מחייבת עוסק מורשה ללא קשר למחזור.
              </li>
              <li className="border border-ink/15 bg-cream-2 p-4">
                <strong className="block text-ink">4. פער מהתקרה</strong>
                השוו את התחזית ל-{threshold} ₪ וקבעו מועד לבדיקה חוזרת לפני העסקה הבאה.
              </li>
            </ol>
            <p className="mt-4 text-sm text-ink/65">
              הרשימה עוזרת להכין נתונים; היא אינה קובעת את מועד החיוב במע״מ או את סכום המס.
            </p>
          </div>

          <h2>מה בדיוק משווים לתקרה?</h2>
          <p>
            הנתון הרלוונטי הוא <strong>מחזור העסקאות השנתי</strong>, לא הרווח ולא היתרה בחשבון
            הבנק. הוצאות העסק אינן מקטינות את המחזור לצורך הבדיקה. גם מועד העסקה ומועד החיוב
            במע״מ אינם נקבעים תמיד לפי היום שבו הכסף הופיע בבנק, ולכן יש להסתמך על רישומי העסק
            ועל הכללים החלים על סוג העסקה שלכם.
          </p>
          <p>
            לדוגמה בלבד: אם נרשמו עסקאות בסך 100,000 ₪ והוצאות בסך 35,000 ₪, נתון המעקב לתקרה
            הוא 100,000 ₪ — לא רווח של 65,000 ₪. לפני שמוסיפים עסקה עתידית לתחזית, בדקו עם מייצג
            כיצד היא נרשמת ומתי חל החיוב לפי אופי הפעילות.
          </p>

          <h2>היכן אתם נמצאים — ומה הפעולה הבאה?</h2>
          <div className="not-prose my-6 overflow-x-auto">
            <table className="w-full border border-ink/15 text-sm">
              <thead className="bg-cream-2 text-right">
                <tr>
                  <th className="border-b border-ink/15 p-3">מצב</th>
                  <th className="border-b border-ink/15 p-3">מה לבדוק</th>
                  <th className="border-b border-ink/15 p-3">פעולה מעשית</th>
                </tr>
              </thead>
              <tbody className="text-ink/75">
                <tr>
                  <td className="border-b border-ink/15 p-3 font-medium text-ink">לפני פתיחת התיק</td>
                  <td className="border-b border-ink/15 p-3">מחזור שנתי צפוי וסוג העיסוק</td>
                  <td className="border-b border-ink/15 p-3">בחרו מסלול פטור או מורשה לפני ההגשה</td>
                </tr>
                <tr className="bg-cream-2/40">
                  <td className="border-b border-ink/15 p-3 font-medium text-ink">מתחת לתקרה</td>
                  <td className="border-b border-ink/15 p-3">מחזור מצטבר, חוזים ועסקאות צפויות</td>
                  <td className="border-b border-ink/15 p-3">המשיכו מעקב והגישו הצהרת מחזור שנתית</td>
                </tr>
                <tr>
                  <td className="border-b border-ink/15 p-3 font-medium text-ink">קרוב לתקרה</td>
                  <td className="border-b border-ink/15 p-3">העסקה הבאה, מחיר כולל מע״מ ותזמון</td>
                  <td className="border-b border-ink/15 p-3">פנו מראש למע״מ או למייצג והכינו מעבר</td>
                </tr>
                <tr className="bg-cream-2/40">
                  <td className="p-3 font-medium text-ink">מעל התקרה</td>
                  <td className="p-3">מועד העסקאות והמסמכים שכבר הופקו</td>
                  <td className="p-3">פנו למשרד מע״מ האזורי לשינוי סיווג והנחיות</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2>צ׳קליסט חודשי למעקב שלא תלוי בזיכרון</h2>
          <ul>
            <li>הפיקו דוח מחזור מצטבר מתחילת השנה ממערכת הנהלת החשבונות.</li>
            <li>התאימו את הדוח למסמכים שהופקו ולרישומי התקבולים; חוסר התאמה דורש בירור.</li>
            <li>הוסיפו לתחזית הצעות שאושרו, חוזים, הזמנות ועבודה שצפויה להסתיים השנה.</li>
            <li>רשמו בנפרד הוצאות — הן חשובות לרווח ולמס הכנסה, אך אינן מופחתות מתקרת המחזור.</li>
            <li>כשהפער קטן ביחס לעסקאות הרגילות שלכם, הקדימו את הבירור מול מע״מ.</li>
          </ul>

          <h2>עברתם את התקרה: מה לא לעשות</h2>
          <ul>
            <li>אל תמשיכו להפיק מסמכים כאילו הסיווג לא השתנה בלי לקבל הנחיה.</li>
            <li>אל תניחו אוטומטית שרק הסכום שמעל התקרה חייב במע״מ.</li>
            <li>אל תוסיפו מע״מ רטרואקטיבית למחיר מול לקוח בלי לבדוק את ההסכם ואת כללי המס.</li>
            <li>אל תדחו את הבירור לסוף השנה; הכינו מחזור מצטבר, רשימת עסקאות ומסמכים שכבר הופקו.</li>
          </ul>
          <p>
            לאחר קבלת הנחיות, בדקו גם איזה מסמך להפיק לכל עסקה, מהי תקופת הדיווח שנקבעה לתיק
            ואיך המחיר שסוכם עם הלקוח מושפע. ראו{' '}
            <Link href="/self-employed/invoices">מדריך חשבוניות וקבלות</Link> ו
            <Link href="/self-employed/vat">מחשבון המע״מ</Link>.
          </p>

          <h2>תקרה, סיווג ומסלולים אחרים — לא להתבלבל</h2>
          <ul>
            <li><strong>עוסק פטור / מורשה</strong> — סיווג במע״מ.</li>
            <li><strong>בעל עסק זעיר</strong> — מסלול במס הכנסה; הזכאות והדיווח נבדקים בנפרד.</li>
            <li><strong>עצמאי בביטוח הלאומי</strong> — מעמד שנקבע לפי כללי הביטוח הלאומי ונתוני הפעילות.</li>
          </ul>
          <p>
            אם אתם עדיין בשלב ההקמה, התחילו ב
            <Link href="/self-employed/opening-business">מדריך פתיחת עסק</Link>. לבחירה ממוקדת
            עברו ל<Link href="/compare/osek-patur-vs-murshe">השוואת עוסק פטור מול עוסק מורשה</Link>.
          </p>
        </>
      }
      faq={<FAQ items={faqItems} />}
      sources={
        <ul className="list-disc space-y-2 pr-5 text-sm leading-relaxed">
          <li>
            <a href={registration} target="_blank" rel="noopener noreferrer">
              רשות המסים — פתיחת תיק עוסק פטור, תקרת 2026 ותנאי הרישום
            </a>
          </li>
          <li>
            <a href={declaration} target="_blank" rel="noopener noreferrer">
              רשות המסים — הצהרת מחזור שנתית לעוסק פטור
            </a>
          </li>
          <li>
            <a href={licensedRegistration} target="_blank" rel="noopener noreferrer">
              רשות המסים — פתיחת תיק עוסק מורשה (טופס 821)
            </a>
          </li>
          <li>
            <a href={officialGuide} target="_blank" rel="noopener noreferrer">
              רשות המסים — מדריך רשמי לזכויות ולחובות של עוסקים
            </a>
          </li>
        </ul>
      }
    />
  );
}
