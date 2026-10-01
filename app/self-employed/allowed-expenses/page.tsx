import type { Metadata } from 'next';
import Link from 'next/link';
import { CalculatorLayout } from '@/components/calculator/CalculatorLayout';
import { FAQ } from '@/components/calculator/FAQ';
import { VAT_2026 } from '@/lib/constants/tax-2026';

const PAGE_PATH = '/self-employed/allowed-expenses';
const OFFICIAL_GUIDE =
  'https://www.gov.il/BlobFolder/generalpage/income-tax-guide-knowyourright/he/Guides_IncomeTax_da-2025.pdf';
const MICRO_BUSINESS_REPORT =
  'https://www.gov.il/he/service/report-and-payment-for-micro-business-owner';
const ANNUAL_REPORT_2025 =
  'https://www.gov.il/he/service/reporting-and-payment-2025-annual-tax-report-for-individuals';
const VAT_RATE_GUIDANCE =
  'https://www.gov.il/BlobFolder/dynamiccollectorresultitem/represent-info-051224-2/he/vat_represent-info-051224-2.pdf';
const DEPRECIATION_REGULATIONS = 'https://www.btl.gov.il/Laws1/02_0103_100026.pdf';
const VAT_LAW = 'https://www.btl.gov.il/Laws1/00_0022_000000.pdf';

const VAT_EXAMPLE_NET = 1_000;
const VAT_EXAMPLE_TAX = VAT_EXAMPLE_NET * VAT_2026.standard;
const VAT_EXAMPLE_TOTAL = VAT_EXAMPLE_NET + VAT_EXAMPLE_TAX;
const INCOME_EXAMPLE_BEFORE_EXPENSE = 10_000;
const INCOME_EXAMPLE_AFTER_EXPENSE = INCOME_EXAMPLE_BEFORE_EXPENSE - VAT_EXAMPLE_NET;
// מקור: רשות המסים — https://www.gov.il/he/service/report-and-payment-for-micro-business-owner
const MICRO_BUSINESS_NORMATIVE_EXPENSE_RATE = 0.3;
const MICRO_BUSINESS_EXAMPLE_TURNOVER = 100_000;
const MICRO_BUSINESS_EXAMPLE_EXPENSE =
  MICRO_BUSINESS_EXAMPLE_TURNOVER * MICRO_BUSINESS_NORMATIVE_EXPENSE_RATE;
const MICRO_BUSINESS_EXAMPLE_TAXABLE_INCOME =
  MICRO_BUSINESS_EXAMPLE_TURNOVER - MICRO_BUSINESS_EXAMPLE_EXPENSE;
const MIXED_EXPENSE_EXAMPLE_TOTAL = 1_000;
const MIXED_EXPENSE_EXAMPLE_BUSINESS_AMOUNT = 600;
const MIXED_EXPENSE_EXAMPLE_BUSINESS_SHARE =
  MIXED_EXPENSE_EXAMPLE_BUSINESS_AMOUNT / MIXED_EXPENSE_EXAMPLE_TOTAL;

const formatAmount = (amount: number) => amount.toLocaleString('he-IL');

export const metadata: Metadata = {
  title: { absolute: 'הוצאות מוכרות לעצמאי: מס הכנסה, מע״מ ותיעוד | חשבונאי' },
  description:
    'מדריך מעשי להוצאות מוכרות לעצמאי: ההבדל בין מס הכנסה למע״מ, הוצאה מעורבת, פחת, עבודה מהבית, רכב, תוכנה, מסמכים וטעויות נפוצות.',
  alternates: { canonical: PAGE_PATH },
  openGraph: {
    title: 'הוצאות מוכרות לעצמאי — מס הכנסה, מע״מ ותיעוד',
    description:
      'איך מסווגים הוצאה שוטפת, הוצאה מעורבת וציוד, ומה צריך לשמור לפני הדוח.',
    url: PAGE_PATH,
    type: 'article',
    locale: 'he_IL',
    images: ['/opengraph-image'],
  },
};

const faqItems = [
  {
    question: 'האם קבלה או חיוב בכרטיס מספיקים כדי שהוצאה תהיה מוכרת?',
    answer:
      'לא בהכרח. אמצעי התשלום מוכיח ששולם סכום, אך עדיין צריך מסמך מתאים ופרטים שמראים מה נרכש, ממי, מתי ומה הקשר לעסק. לצורך קיזוז מע״מ נדרשת בדרך כלל חשבונית מס שהוצאה כדין על שם העוסק, בכפוף לשאר התנאים.',
  },
  {
    question: 'האם עוסק פטור יכול לדרוש הוצאות במס הכנסה?',
    answer:
      'כן, סיווג כעוסק פטור שייך למע״מ ואינו מבטל את כללי מס ההכנסה. במסלול הרגיל אפשר לבחון הוצאות עסקיות בפועל לפי הכללים, אך עוסק פטור אינו מקזז מס תשומות. אם הוא מוכר גם כבעל עסק זעיר, חלים כללי המסלול הנורמטיבי במקום פירוט ההוצאות בפועל.',
  },
  {
    question: `האם בעל עסק זעיר מקבל אוטומטית ${MICRO_BUSINESS_NORMATIVE_EXPENSE_RATE * 100}% מכל הוצאה?`,
    answer: `לא. ${MICRO_BUSINESS_NORMATIVE_EXPENSE_RATE * 100}% הוא ניכוי הוצאות נורמטיבי ממחזור ההכנסות במסלול מס הכנסה ייעודי, למי שהוכר כבעל עסק זעיר ועומד בתנאיו. זה אינו שיעור מע״מ, אינו החזר כספי ואינו אחוז הכרה לכל חשבונית. אין לצרף אליו אוטומטית את ההוצאות העסקיות בפועל.`,
  },
  {
    question: 'איך מטפלים בהוצאה שמשמשת גם לעסק וגם לצרכים פרטיים?',
    answer:
      'מפרידים את החלק העסקי לפי נתונים שניתן להסביר ולשחזר, כגון שימוש בפועל, שטח או פירוט שיחות, ושומרים את דרך החישוב. אין אחוז אחיד שמתאים לכל הוצאה. את מס ההכנסה ואת מס התשומות בודקים בנפרד, משום שעשויות לחול עליהם מגבלות שונות.',
  },
  {
    question: 'האם מחשב או ציוד יקר נרשמים במלואם כהוצאה בשנת הקנייה?',
    answer:
      'לא תמיד. אם הרכישה היא נכס שמשרת את העסק לאורך זמן, ייתכן שמדובר בהוצאה הונית שנדרשת באמצעות פחת לפי סוג הנכס ומועד תחילת השימוש. תיקון שוטף, שדרוג מהותי ורכישת נכס חדש אינם בהכרח אותו סיווג.',
  },
  {
    question: 'האם יש אחוז קבוע להוצאות רכב, טלפון או משרד ביתי?',
    answer:
      'לא נכון להשתמש באחוז אחד לכל המצבים. כאשר הדין קובע תקרה, יחס או נוסחה מיוחדת — למשל לרכב או לטלפון — הם גוברים על מפתח שימוש פנימי. תיעוד מסביר את העובדות, אך אינו מתיר לבחור יחס שרירותי. גם כאשר נקבע חלק עסקי למס הכנסה, אין להסיק ממנו אוטומטית את מס התשומות שניתן לקזז.',
  },
  {
    question: 'מה עושים עם הוצאה ששולמה לפני פתיחת התיק?',
    answer:
      'שומרים את המסמך, הוכחת התשלום והסבר לקשר להקמת העסק. הכרה במס הכנסה וניכוי מס תשומות לפני הרישום נבחנים לפי תנאים שונים; במע״מ נדרש בין היתר להראות שהתשומות נרכשו בשלבי הקמת העסק ושימשו להקמתו. כדאי לבדוק לפני הדיווח ולא להניח שהכול מותר או אסור.',
  },
];

export default function AllowedExpensesPage() {
  return (
    <CalculatorLayout
      title="הוצאות מוכרות לעצמאי — מדריך מעשי"
      description="כך מסווגים הוצאה למס הכנסה, בודקים מע״מ תשומות ובונים תיק מסמכים שאפשר להסביר גם חודשים אחרי הרכישה."
      breadcrumbs={[
        { label: 'דף הבית', href: '/' },
        { label: 'עצמאים', href: '/self-employed' },
        { label: 'הוצאות מוכרות לעצמאי' },
      ]}
      pageUrl={PAGE_PATH}
      lastUpdated="2026-10-01"
      quickAnswer={
        <p>
          הוצאה מוכרת לעצמאי אינה פשוט כל תשלום שיצא מחשבון העסק. במסלול הרגיל בודקים אם
          ההוצאה שימשה לייצור ההכנסה, אם היא פרטית, מעורבת, שוטפת או הונית, ואם קיים תיעוד
          מתאים. אחר כך בודקים בנפרד אם מותר לקזז את מס התשומות: עוסק פטור אינו מקזז אותו,
          ואצל עוסק מורשה נדרשים חשבונית מס כדין ושימוש בעסקה חייבת. בעל עסק זעיר שהוכר
          במסלול מקבל, בכפוף לתנאים, ניכוי נורמטיבי של{' '}
          {MICRO_BUSINESS_NORMATIVE_EXPENSE_RATE * 100}% מהמחזור במקום פירוט הוצאות בפועל — לא
          בנוסף להן.
        </p>
      }
      content={
        <div className="guide-copy">
          <nav
            aria-label="תוכן עניינים"
            className="not-prose mb-10 border border-ink/20 bg-paper p-5 sm:p-6"
          >
            <p className="mb-3 font-bold text-ink">בעמוד זה</p>
            <ol className="grid gap-x-8 gap-y-2 text-sm text-ink/75 sm:grid-cols-2">
              <li><a className="hover:text-gold" href="#two-tests">1. מס הכנסה מול מע״מ</a></li>
              <li><a className="hover:text-gold" href="#status">2. פטור, מורשה ועסק זעיר</a></li>
              <li><a className="hover:text-gold" href="#examples">3. דוגמאות חישוב</a></li>
              <li><a className="hover:text-gold" href="#mixed">4. הוצאות מעורבות</a></li>
              <li><a className="hover:text-gold" href="#categories">5. סוגי הוצאות נפוצים</a></li>
              <li><a className="hover:text-gold" href="#documents">6. צ׳קליסט מסמכים</a></li>
              <li><a className="hover:text-gold" href="#workflow">7. תהליך עבודה חודשי</a></li>
              <li><a className="hover:text-gold" href="#mistakes">8. טעויות שכדאי למנוע</a></li>
            </ol>
          </nav>

          <h2 id="two-tests" className="scroll-mt-40">הוצאה אחת, שתי בדיקות שונות</h2>
          <p>
            הביטוי ״הוצאה מוכרת״ מערבב לעיתים שני מנגנונים. במס הכנסה, הוצאה מותרת מקטינה את
            הרווח העסקי החייב — היא אינה החזר מס בגובה ההוצאה. במע״מ, עוסק מורשה בודק אם ניתן
            לנכות את מס התשומות הכלול במסמך. הוצאה יכולה לעבור בדיקה אחת ולא את השנייה, או
            להיות מוגבלת בכל אחת מהן בדרך אחרת.
          </p>
          <div className="not-prose my-6 overflow-x-auto">
            <table className="w-full border border-ink/15 text-sm">
              <thead className="bg-cream-2 text-right">
                <tr>
                  <th className="border-b border-ink/15 p-3">השאלה</th>
                  <th className="border-b border-ink/15 p-3">מס הכנסה</th>
                  <th className="border-b border-ink/15 p-3">מע״מ תשומות</th>
                </tr>
              </thead>
              <tbody className="text-ink/75">
                <tr>
                  <td className="border-b border-ink/15 p-3 font-medium text-ink">מה בודקים?</td>
                  <td className="border-b border-ink/15 p-3">קשר לייצור הכנסה, סיווג, מגבלות ותיעוד</td>
                  <td className="border-b border-ink/15 p-3">מעמד העוסק, מסמך כדין ושימוש בעסקה חייבת</td>
                </tr>
                <tr className="bg-cream-2/40">
                  <td className="border-b border-ink/15 p-3 font-medium text-ink">מה ההשפעה?</td>
                  <td className="border-b border-ink/15 p-3">הקטנת ההכנסה העסקית החייבת, בכפוף לכללים</td>
                  <td className="border-b border-ink/15 p-3">הפחתת מס תשומות ממס העסקאות בדוח המע״מ</td>
                </tr>
                <tr>
                  <td className="p-3 font-medium text-ink">מה לא מספיק?</td>
                  <td className="p-3">עצם התשלום, כרטיס עסקי או הכותרת שנתתם להוצאה</td>
                  <td className="p-3">קבלה בלבד או העובדה שהרכישה ״קשורה לעסק״</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            לדוגמה, מסמך יכול לתאר רכישה עסקית אמיתית, אך לא להיות חשבונית מס שמאפשרת ניכוי
            תשומות. בכיוון ההפוך, גם חשבונית מס תקינה אינה הופכת חלק פרטי של רכישה להוצאה
            עסקית. להשלמת הבדיקה ראו את <Link href="/self-employed/vat">מדריך המע״מ לעצמאי</Link>{' '}
            ואת{' '}
            <Link href="/self-employed/invoices">
              מדריך החשבוניות, הקבלות ומספרי ההקצאה
            </Link>
            . כאשר נדרש מספר הקצאה לפי תנאי החשבונית, הוא חלק מבדיקת המסמך לפני ניכוי מס
            התשומות.
          </p>

          <h2 id="status" className="scroll-mt-40">עוסק פטור, עוסק מורשה ובעל עסק זעיר: מה משתנה?</h2>
          <p>
            ״פטור״ ו״מורשה״ הם סיווגים במע״מ. ״בעל עסק זעיר״ הוא מסלול במס הכנסה. לכן אדם יכול
            להיות עוסק פטור במע״מ ובמקביל בעל עסק זעיר במס הכנסה, או עוסק מורשה שהוכר כבעל
            עסק זעיר. אין להסיק מסיווג אחד מה מותר בסיווג האחר.
          </p>
          <div className="not-prose my-6 overflow-x-auto">
            <table className="w-full border border-ink/15 text-sm">
              <thead className="bg-cream-2 text-right">
                <tr>
                  <th className="border-b border-ink/15 p-3">מעמד או מסלול</th>
                  <th className="border-b border-ink/15 p-3">הוצאות במס הכנסה</th>
                  <th className="border-b border-ink/15 p-3">מס תשומות</th>
                </tr>
              </thead>
              <tbody className="text-ink/75">
                <tr>
                  <td className="border-b border-ink/15 p-3 font-medium text-ink">עוסק פטור במסלול הרגיל</td>
                  <td className="border-b border-ink/15 p-3">בוחן הוצאות בפועל לפי כללי מס הכנסה</td>
                  <td className="border-b border-ink/15 p-3">אינו מקזז מס תשומות</td>
                </tr>
                <tr className="bg-cream-2/40">
                  <td className="border-b border-ink/15 p-3 font-medium text-ink">עוסק מורשה במסלול הרגיל</td>
                  <td className="border-b border-ink/15 p-3">בוחן הוצאות בפועל לפי כללי מס הכנסה</td>
                  <td className="border-b border-ink/15 p-3">בודק כל תשומה לפי המסמך, השימוש והמגבלות</td>
                </tr>
                <tr>
                  <td className="p-3 font-medium text-ink">בעל עסק זעיר שהוכר במסלול</td>
                  <td className="p-3">
                    ניכוי נורמטיבי של {MICRO_BUSINESS_NORMATIVE_EXPENSE_RATE * 100}% מהמחזור,
                    בכפוף לתנאי המסלול והדיווח
                  </td>
                  <td className="p-3">נקבע לפי סיווגו הנפרד במע״מ — פטור או מורשה</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            לפי שירות רשות המסים, הדיווח המקוצר מיועד למי שהוכרו כבעלי עסק זעיר וביצעו תיאום מס,
            והמערכת מפחיתה {MICRO_BUSINESS_NORMATIVE_EXPENSE_RATE * 100}% מהמחזור כהוצאות. זהו
            ניכוי נורמטיבי במקום הצגה ופירוט של ההוצאות העסקיות בפועל במסלול, ולא בחירה של אחוז
            לכל קבלה. לפני הסתמכות עליו יש לוודא שההכרה במסלול עדיין בתוקף ושכל תנאי הדיווח
            מתקיימים.
          </p>

          <h2 id="examples" className="scroll-mt-40">דוגמאות חישוב: מה באמת יורד ומאיפה?</h2>
          <h3>דוגמה 1: שירות תוכנה שוטף אצל עוסק מורשה</h3>
          <p>
            נניח שעוסק מורשה שילם {formatAmount(VAT_EXAMPLE_TOTAL)} ₪ עבור שירות תוכנה שוטף:{' '}
            {formatAmount(VAT_EXAMPLE_NET)} ₪ לפני מע״מ ועוד {formatAmount(VAT_EXAMPLE_TAX)} ₪
            מע״מ. נניח גם שהשירות משמש כולו לעסקאות חייבות, התקבלה חשבונית מס כדין וכל תנאי
            הניכוי מתקיימים. בדוגמה זו, {formatAmount(VAT_EXAMPLE_TAX)} ₪ נבחנים כמס תשומות בדוח
            המע״מ, ו־{formatAmount(VAT_EXAMPLE_NET)} ₪ נבחנים כהוצאה שוטפת במס הכנסה.
          </p>
          <p>
            אם ההכנסה העסקית לפני ההוצאה הייתה {formatAmount(INCOME_EXAMPLE_BEFORE_EXPENSE)} ₪,
            הרווח לפני הוצאות והתאמות אחרות יהיה {formatAmount(INCOME_EXAMPLE_AFTER_EXPENSE)} ₪.
            החיסכון במס אינו {formatAmount(VAT_EXAMPLE_NET)} ₪: המס מחושב על ההכנסה החייבת
            הכוללת ולפי הנתונים האישיים. אם אותו רוכש הוא עוסק פטור, הוא אינו מקזז את{' '}
            {formatAmount(VAT_EXAMPLE_TAX)} ₪ כמס תשומות; במסלול ההוצאות בפועל בוחנים את מלוא
            העלות ששילם, {formatAmount(VAT_EXAMPLE_TOTAL)} ₪, לפי כללי מס הכנסה.
          </p>

          <h3>דוגמה 2: ניכוי נורמטיבי לבעל עסק זעיר</h3>
          <p>
            נניח שמי שכבר הוכר כבעל עסק זעיר ועומד בתנאי המסלול דיווח על מחזור של{' '}
            {formatAmount(MICRO_BUSINESS_EXAMPLE_TURNOVER)} ₪. המערכת מפחיתה{' '}
            {formatAmount(MICRO_BUSINESS_EXAMPLE_EXPENSE)} ₪ כהוצאות נורמטיביות, ולכן נקודת
            המוצא להכנסה העסקית החייבת היא {formatAmount(MICRO_BUSINESS_EXAMPLE_TAXABLE_INCOME)}
            {' ₪'}, לפני התאמות מס אישיות רלוונטיות. אין לחשב{' '}
            {MICRO_BUSINESS_NORMATIVE_EXPENSE_RATE * 100}% מהמס, ואין להוסיף באופן אוטומטי קבלות
            על הוצאות בפועל מעל הניכוי הנורמטיבי.
          </p>

          <h3>דוגמה 3: שימוש מעורב אינו כלל ענפי</h3>
          <p>
            עצמאי שילם {formatAmount(MIXED_EXPENSE_EXAMPLE_TOTAL)} ₪ לפני מע״מ על שירות שמשמש גם
            את העסק וגם את המשפחה. לאחר תיעוד השימוש נמצא שבמקרה המסוים{' '}
            {formatAmount(MIXED_EXPENSE_EXAMPLE_BUSINESS_AMOUNT)} ₪ קשורים לפעילות העסקית. במס
            הכנסה מתחילים מבדיקת אותם {formatAmount(MIXED_EXPENSE_EXAMPLE_BUSINESS_AMOUNT)} ₪,
            לא מכל הסכום. זהו חישוב הדגמה בלבד —{' '}
            {MIXED_EXPENSE_EXAMPLE_BUSINESS_SHARE * 100}% אינו שיעור שמותר לכל עצמאי, ואת מס
            התשומות צריך לבדוק בנפרד לפי חוק מע״מ והתקנות.
          </p>

          <h2 id="mixed" className="scroll-mt-40">איך בונים מפתח סביר להוצאה מעורבת?</h2>
          <p>
            הוצאה מעורבת דורשת הפרדה בין צורך עסקי לצורך פרטי. המפתח צריך לנבוע מאופי השימוש,
            להיות עקבי ולהישען על מידע שאפשר להציג — לא על מספר שנבחר בסוף השנה כדי להגיע
            לתוצאה רצויה.
          </p>
          <p>
            כאשר הדין קובע תקרה, יחס או נוסחה מיוחדת לסוג ההוצאה, הם גוברים על מפתח שימוש
            פנימי. הדבר חשוב במיוחד בקטגוריות כמו טלפון ורכב: תיעוד מסביר את העובדות, אך אינו
            מאפשר לבחור יחס שרירותי או לעקוף מגבלה שנקבעה בדין.
          </p>
          <ol>
            <li><strong>בדקו הוראה מיוחדת:</strong> לפני בניית מפתח, ודאו שאין תקרה, יחס או נוסחה מחייבים לסוג ההוצאה.</li>
            <li><strong>הגדירו את יחידת המדידה:</strong> שעות, שטח, משתמשים, שיחות, נסיעות או שימוש אחר שמתאים להוצאה.</li>
            <li><strong>אספו נתון בפועל:</strong> יומן, פירוט ספק, תרשים חדרים, רישום נסיעות או הרשאות משתמש.</li>
            <li><strong>הפרידו שימוש פרטי:</strong> אל תדרשו את החלק שאינו קשור לייצור ההכנסה.</li>
            <li><strong>תעדו את החישוב:</strong> שמרו דף קצר שמסביר את הנתונים, התקופה והתוצאה.</li>
            <li><strong>בדקו מע״מ בנפרד:</strong> מפתח מס הכנסה אינו בהכרח המפתח המותר לניכוי תשומות.</li>
          </ol>
          <p>
            אם אופי השימוש השתנה — למשל מעבר ממשרד ביתי למשרד שכור או הוספת קו טלפון ייעודי —
            מעדכנים את המפתח מהמועד המתאים ולא ממשיכים אוטומטית עם החלוקה הישנה.
          </p>

          <h2 id="categories" className="scroll-mt-40">סוגי הוצאות נפוצים ומה לבדוק בכל אחד</h2>
          <h3>משרד ביתי: לא מתחילים מאחוז, אלא מהעובדות</h3>
          <ul>
            <li>האם יש אזור מוגדר שמשמש בפועל את העסק, ומה שטחו ביחס לנכס?</li>
            <li>אילו חשבונות קשורים לשימוש העסקי: שכירות, ארנונה, חשמל, מים, ועד בית או אינטרנט?</li>
            <li>האם החוזה ותנאי השכירות מאפשרים את השימוש, והאם קיימות חובות ניכוי מס במקור בתשלום?</li>
            <li>האם מדובר בהוצאה שוטפת, תיקון, או שיפור הוני בנכס?</li>
          </ul>
          <p>
            אין כלל שלפיו כל מי שעובד מהבית רשאי לדרוש אותו חלק מההוצאות. מפתח המבוסס על שטח
            עשוי להתאים לחשבון אחד ולא לאחר, ושימוש משפחתי משמעותי משנה את הניתוח.
          </p>

          <h3>טלפון ואינטרנט: קו ייעודי שונה מחבילה משפחתית</h3>
          <p>
            שמרו חשבוניות ופירוט שמאפשר לזהות את השירות ואת המשתמשים. בקו או בחבילה מעורבים,
            תעדו את השימוש העסקי במקום לדרוש אוטומטית את כל החשבון. למקום מגורים ולטלפון נייד
            עשויים לחול כללים ומגבלות מיוחדים; גם כאן אין להסיק משיעור שנקבע לעסק אחר.
          </p>

          <h3>תוכנות ושירותים דיגיטליים</h3>
          <ul>
            <li><strong>מנוי שוטף:</strong> בדקו את תקופת השירות, המשתמשים והקשר לפעילות.</li>
            <li><strong>רישיון, פיתוח או הטמעה:</strong> ייתכן שמדובר בנכס או בעלות הונית ולא בהוצאה חודשית רגילה.</li>
            <li><strong>ספק מחו״ל:</strong> שמרו חשבונית, חוזה ואישור תשלום, ובדקו גם את השלכות המע״מ והניכוי במקור לפי סוג השירות.</li>
            <li><strong>חבילה פרטית ועסקית:</strong> הפרידו משתמשים או רכיבים, ואל תדרשו את החלק הפרטי.</li>
          </ul>

          <h3>שירותים מקצועיים: המטרה קובעת את הסיווג</h3>
          <p>
            הנהלת חשבונות, הכנת הדוח, ייעוץ מקצועי ושירות משפטי יכולים להיות קשורים לעסק, אך
            צריך לבדוק עבור מה שולם השירות. ייעוץ שוטף אינו בהכרח זהה לעלות מקצועית שנלווית
            לרכישת נכס, הקמת פעילות חדשה או עניין פרטי. שמרו הסכם, פירוט עבודה וחשבונית, ובדקו
            לפני התשלום אם נדרש אישור ניכוי מס במקור של הספק.
          </p>

          <h3>רכב: קבלות דלק לבדן אינן החישוב</h3>
          <p>
            הוצאות רכב כפופות לכללים ייעודיים. מדריך רשות המסים דורש, בין היתר, פרטי רכב ונתוני
            מד־מרחק כאשר נתבעות הוצאות רכב. סיווג הרכב, תקופת השימוש, ההוצאות בפועל והעמדת רכב
            לעובד עשויים לשנות את התוצאה. במע״מ קיימת גם הבחנה בין רכישת רכב לבין הוצאות שוטפות,
            ולכן אין להעתיק שיעור קבוע ממאמר או מעסק אחר.
          </p>

          <h3>ציוד, מחשב וריהוט: הוצאה שוטפת או פחת?</h3>
          <p>
            ציוד שממשיך לשמש את העסק לאורך זמן עשוי להיות נכס קבוע. במקרה כזה לא מניחים שכל
            מחיר הרכישה יורד בשנת התשלום, אלא בודקים פחת לפי סוג הנכס, המחיר המקורי, מועד תחילת
            השימוש והתקנות. לעומת זאת, תחזוקה או תיקון שמחזירים ציוד למצבו עשויים לקבל טיפול
            שונה משדרוג שמאריך את חייו או מוסיף לו יכולת מהותית.
          </p>
          <div className="not-prose my-6 border-r-4 border-gold bg-cream-2 p-5 text-sm leading-relaxed text-ink/75">
            <strong className="text-ink">כלל עבודה שימושי:</strong> לפני רישום רכישה גדולה, כתבו
            במשפט אחד מה נרכש, לכמה זמן הוא צפוי לשמש, מתי החל השימוש ומה היה קיים לפניו. ארבעת
            הנתונים האלה עוזרים להבחין בין הוצאה שוטפת, תיקון, שיפור ונכס לפחת.
          </div>

          <h3>אירוח, נסיעות, מתנות והוצאות בעלות אופי פרטי</h3>
          <p>
            בקטגוריות האלה עשויות לחול מגבלות, תקרות ודרישות רישום מיוחדות. שמרו את זהות מקבל
            המתנה או המשתתפים, מטרת הפגישה, יעד הנסיעה והקשר העסקי. אל תסווגו ארוחה אישית,
            חופשה או קנייה משפחתית כהוצאה עסקית רק משום ששולמו בכרטיס של העסק.
          </p>

          <h2 id="documents" className="scroll-mt-40">צ׳קליסט מסמכים לכל הוצאה</h2>
          <div className="not-prose my-6 grid gap-3 sm:grid-cols-2">
            {[
              ['מסמך העסקה', 'חשבונית או מסמך מתאים עם ספק, תאריך, פירוט וסכום; למע״מ — חשבונית מס כדין כשנדרשת.'],
              ['הוכחת תשלום', 'תנועת בנק, כרטיס, העברה או קבלה שמתחברים למסמך העסקה.'],
              ['מטרה עסקית', 'הזמנה, חוזה, תכתובת, שם פרויקט או הערה קצרה שמסבירים למה נרכש.'],
              ['חלוקה מעורבת', 'הנתונים, המפתח והחישוב שהפרידו בין העסק לפרטי.'],
              ['נכס קבוע', 'תאריך רכישה ותחילת שימוש, מחיר, מספר סידורי ומיקום ברשימת הנכסים.'],
              ['רכב ונסיעות', 'פרטי הרכב, מד־מרחק, תקופת שימוש ומסמכים לפי סוג הנסיעה.'],
              ['ספק וניכויים', 'אישור ניכוי מס במקור וניהול ספרים, והוכחה לדיווח אם חלה חובת ניכוי.'],
              ['שמירה ואחזור', 'שם קובץ עקבי, תיקייה לפי חודש וגיבוי לתקופה הנדרשת בדין.'],
            ].map(([title, text]) => (
              <div key={title} className="border border-ink/15 bg-paper p-4">
                <strong className="mb-1 block text-ink">{title}</strong>
                <span className="text-sm leading-relaxed text-ink/70">{text}</span>
              </div>
            ))}
          </div>
          <p>
            לפני תשלום לספק או נותן שירות, ראו גם{' '}
            <Link href="/self-employed/withholding-tax">אישור ניכוי מס במקור וניהול ספרים</Link>.
            האישור אינו מחליף חשבונית ואינו מוכיח שהוצאה פרטית הפכה לעסקית; הוא מטפל בחובה אחרת
            בתהליך התשלום והדיווח.
          </p>

          <h2 id="workflow" className="scroll-mt-40">תהליך חודשי קצר שמונע בלגן בדוח השנתי</h2>
          <ol>
            <li><strong>אספו:</strong> הורידו מסמכים מהדוא״ל, מהאפליקציות ומהספקים לפני שהקישורים פגים.</li>
            <li><strong>התאימו:</strong> חברו כל חיוב בבנק או בכרטיס למסמך העסקה ולהוכחת התשלום.</li>
            <li><strong>סווגו:</strong> שוטפת, מעורבת, נכס קבוע, רכב, מימון או קטגוריה מיוחדת לבדיקה.</li>
            <li><strong>הפרידו:</strong> סמנו מע״מ תשומות רק אחרי בדיקת הזכאות, ואל תרשמו את אותו מס גם כהוצאה מלאה.</li>
            <li><strong>תעדו חריגים:</strong> כתבו הערה קצרה להוצאה גדולה, לא רגילה או מעורבת.</li>
            <li><strong>עברו על חסרים:</strong> בקשו מסמך מתוקן בזמן, במקום לגלות בדוח השנתי שאין דרך לשחזר אותו.</li>
          </ol>
          <p>
            התהליך משתלב עם <Link href="/self-employed/business-finance">ניהול הכספים של העסק</Link>{' '}
            ועם בדיקה תקופתית של <Link href="/self-employed/tax-advances">מקדמות המס</Link>. הוצאה
            מתועדת היטב משפרת את איכות הנתונים, אך אינה קובעת לבדה את שיעור המס או את גובה המקדמה.
          </p>

          <h2 id="mistakes" className="scroll-mt-40">טעויות נפוצות שמייקרות את סוף השנה</h2>
          <ul>
            <li><strong>להסתמך על פירוט האשראי בלבד:</strong> הוא מראה ששילמתם, לא מה נרכש ומה מטרתו.</li>
            <li><strong>לדרוש את הסכום כולל מע״מ וגם לקזז את המע״מ:</strong> זו עלולה להיות ספירה כפולה.</li>
            <li><strong>לרשום ציוד כהוצאה משרדית:</strong> נכס רב־שנתי עשוי להידרש באמצעות פחת.</li>
            <li><strong>להעתיק אחוז מעסק אחר:</strong> שימוש ביתי, טלפון ורכב תלויים בעובדות ובכללים המתאימים.</li>
            <li><strong>לבלבל עוסק פטור עם פטור ממס הכנסה:</strong> הפטור הוא ממנגנון גביית מע״מ, לא מכל מס.</li>
            <li>
              <strong>
                להוסיף הוצאות בפועל לניכוי {MICRO_BUSINESS_NORMATIVE_EXPENSE_RATE * 100}%:
              </strong>{' '}
              במסלול בעל עסק זעיר הניכוי הוא נורמטיבי ובכפוף לתנאים.
            </li>
            <li><strong>להתעלם משנת ההוצאה:</strong> מועד ההכרה תלוי גם בשיטת הדיווח, בתקופת השירות ובמועד תחילת השימוש בנכס.</li>
            <li><strong>לשלם לספק בלי בדיקת אישורים:</strong> חשבונית תקינה אינה מבטלת חובת ניכוי מס במקור אם חלה.</li>
          </ul>

          <h2>מתי כדאי לעצור לפני הרישום?</h2>
          <p>
            בקשו בדיקה נקודתית לפני רכישת רכב, ציוד יקר, שיפוץ, תוכנה בפיתוח, שכירת חלק מהבית,
            תשלום גדול לספק מחו״ל או הוצאה מעורבת מהותית. גם מעבר למסלול בעל עסק זעיר או יציאה
            ממנו מצדיקים השוואה מסודרת: גובה ההוצאות בפועל הוא רק אחד הנתונים, ולתנאי הזכאות,
            חובות הדיווח ומעמד המע״מ יש השפעה נפרדת.
          </p>
          <p>
            לאחר הסיווג, אפשר להשתמש ב<Link href="/self-employed/net">מדריך הכנסה פנויה</Link>{' '}
            לתכנון תזרים. המדריך כאן מסייע להכין נתונים; הוא אינו מחליף סיווג בדוח לפי מסמכי העסק
            והנסיבות שלו.
          </p>
        </div>
      }
      faq={<FAQ items={faqItems} />}
      sources={
        <ul className="space-y-3">
          <li>
            <a href={OFFICIAL_GUIDE} target="_blank" rel="noopener noreferrer">
              רשות המסים — דע זכויותיך וחובותיך, מדריך למילוי דוח 2025
            </a>{' '}
            (נספח 1320: הוצאות רכב, משרד, טלפון, שירותים מקצועיים ופחת; נספח מע״מ: מס תשומות).
          </li>
          <li>
            <a href={MICRO_BUSINESS_REPORT} target="_blank" rel="noopener noreferrer">
              רשות המסים — דיווח שנתי מקוצר ותשלום לבעל עסק זעיר
            </a>{' '}
            (הכרה במסלול, תיאום מס וניכוי נורמטיבי של{' '}
            {MICRO_BUSINESS_NORMATIVE_EXPENSE_RATE * 100}% מהמחזור).
          </li>
          <li>
            <a href={ANNUAL_REPORT_2025} target="_blank" rel="noopener noreferrer">
              רשות המסים — דוח שנתי 2025 ליחידים ובעלי עסקים
            </a>{' '}
            (טופסי הדוח, רווח והפסד ודיווח פחת).
          </li>
          <li>
            <a href={VAT_RATE_GUIDANCE} target="_blank" rel="noopener noreferrer">
              רשות המסים — הוראת פרשנות 01/2025, שיעור מע״מ{' '}
              {VAT_2026.standard * 100}%
            </a>{' '}
            (הבסיס לדוגמת {formatAmount(VAT_EXAMPLE_NET)} ₪ ועוד{' '}
            {formatAmount(VAT_EXAMPLE_TAX)} ₪ מע״מ; שיעור המס חל לפי מועד החיוב בעסקה).
          </li>
          <li>
            <a href={DEPRECIATION_REGULATIONS} target="_blank" rel="noopener noreferrer">
              תקנות מס הכנסה (פחת), 1941 — נוסח PDF במאגר הביטוח הלאומי
            </a>.
          </li>
          <li>
            <a href={VAT_LAW} target="_blank" rel="noopener noreferrer">
              חוק מס ערך מוסף — נוסח PDF במאגר הביטוח הלאומי
            </a>{' '}
            (לרבות תנאי ניכוי מס תשומות בחשבונית מס שהוצאה כדין).
          </li>
        </ul>
      }
    />
  );
}
