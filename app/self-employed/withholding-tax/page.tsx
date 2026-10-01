import type { Metadata } from 'next';
import Link from 'next/link';
import { CalculatorLayout } from '@/components/calculator/CalculatorLayout';
import { FAQ } from '@/components/calculator/FAQ';

const PAGE_PATH = '/self-employed/withholding-tax';
const SOURCES = {
  certificates: 'https://www.gov.il/he/service/itc-gmishurim',
  reduction: 'https://www.gov.il/he/service/itc2542',
  annual: 'https://www.gov.il/he/service/itc806',
  instructions: 'https://www.gov.il/BlobFolder/policy/inst-02-2026/he/IncomeTax_inst-02-2026.pdf',
  guide: 'https://www.gov.il/BlobFolder/generalpage/income-tax-guide-knowyourright/he/Guides_IncomeTax_da-2025.pdf',
};

export const metadata: Metadata = {
  title: 'ניכוי מס במקור ואישור ניהול ספרים — מדריך לעצמאי',
  description: 'הלקוח ביקש אישור ניכוי מס במקור וניהול ספרים? כך בודקים ומדפיסים אישורים, מבקשים הקטנה ומתאימים תשלום שנוכה ממנו מס למסמכי העסק.',
  alternates: { canonical: PAGE_PATH },
  openGraph: {
    title: 'ניכוי מס במקור ואישור ניהול ספרים — מדריך לעצמאי',
    description: 'בדיקת אישורים, בקשת הקטנה והתאמת תשלום שנוכה ממנו מס — עם מקורות רשמיים וצ׳קליסט.',
    type: 'article',
    locale: 'he_IL',
    url: PAGE_PATH,
    images: ['/opengraph-image'],
  },
};

// Illustrative reconciliation only: not a statutory rate or a tax estimate.
const EXAMPLE = { totalDue: 5000, withheldByCustomer: 250 };
const amountReceived = EXAMPLE.totalDue - EXAMPLE.withheldByCustomer;
const nis = (amount: number) => `${amount.toLocaleString('he-IL')} ₪`;

const faq = [
  {
    question: 'איך מוציאים אישור ניכוי מס במקור ואישור ניהול ספרים?',
    answer: 'נכנסים לשירות המידע הרשמי של רשות המסים, מחפשים לפי מספר התיק המתאים ובודקים את האישורים המוצגים. השירות מאפשר הדפסה והוא ללא תשלום. הוא אינו בקשה להנפקת אישור שחסר או לשינוי שיעור הניכוי.',
  },
  {
    question: 'האם אישור ניהול ספרים הוא פטור מניכוי מס במקור?',
    answer: 'לא. אלה שני אישורים נפרדים. אישור ניהול ספרים אינו קובע כמה מס ינוכה מהתשלום; לשם כך בודקים את אישור ניכוי המס במקור ואת תנאיו.',
  },
  {
    question: 'יש לי פטור מניכוי מס במקור — האם אני פטור ממס הכנסה?',
    answer: 'לא. הפטור מתייחס לניכוי בידי המשלם לפי תנאי האישור. חבות מס ההכנסה נקבעת לפי ההכנסה החייבת, הזיכויים וכללי הדיווח החלים עליכם. ייתכנו מקדמות או יתרת מס לתשלום גם כשלא נוכה מס אצל הלקוח.',
  },
  {
    question: 'עוסק פטור צריך לבדוק ניכוי מס במקור?',
    answer: 'כן, כאשר הוא מקבל תשלום ממשלם שחייב בניכוי. מעמד עוסק פטור הוא במע״מ ואינו מחליף אישור ניכוי מס במקור. יש לבדוק את האישור בפועל; לא כל לקוח חייב לנכות מכל תשלום.',
  },
  {
    question: 'מה עושים אם לא מופיע אישור או אם רוצים להקטין את הניכוי?',
    answer: 'מזהים קודם איזה אישור חסר. באישור ניהול ספרים בודקים את מצב התיקים, הדיווחים והליקויים מול הרשויות. לבקשת פטור או הקטנה של ניכוי מס במקור קיים טופס 2542, למי שעומד בתנאי השירות. הטופס אינו בקשה לאישור ניהול ספרים, ועצם הגשתו אינה אישור לפטור.',
  },
  {
    question: 'איזה מסמך מבקשים מהלקוח בסוף השנה?',
    answer: 'מבקשים אישור שנתי על התשלומים והמס שנוכה, בהתאם לסוג התשלום. שירות טופס 806 של רשות המסים מתאר אישור הכולל את התשלומים, המע״מ והניכוי במהלך השנה. משווים אותו למסמכי העסק ולאישורי הניכוי שנאספו במהלך השנה.',
  },
];

export default function WithholdingTaxPage() {
  return (
    <CalculatorLayout
      title="ניכוי מס במקור ואישור ניהול ספרים — מה שולחים ללקוח?"
      description="מדריך לעצמאי שקיבל בקשה לאישורים, לתשלום שנוכה ממנו מס ולהכנת האסמכתאות לסוף השנה."
      breadcrumbs={[
        { label: 'דף הבית', href: '/' },
        { label: 'עצמאים', href: '/self-employed' },
        { label: 'ניכוי מס במקור וניהול ספרים' },
      ]}
      pageUrl={PAGE_PATH}
      lastUpdated="2026-10-01"
      quickAnswer={
        <p>
          <strong>אישור ניכוי מס במקור ואישור ניהול ספרים אינם אותו מסמך.</strong>{' '}
          הראשון מציג מידע על שיעור הניכוי שעל משלם החייב בכך לבדוק; השני עוסק בניהול
          פנקסי חשבונות ודיווח לפי חוק עסקאות גופים ציבוריים. אפשר לבדוק ולהדפיס אותם
          בשירות הרשמי של רשות המסים. פטור מניכוי אינו פטור ממס הכנסה, וגם רישום כעוסק
          פטור במע״מ אינו מחליף אותו. לפני שמעבירים אישור ללקוח, ודאו שהוא שייך לעסק
          הנכון ובתוקף, ושסוג התשלום והתנאים מתאימים.
        </p>
      }
      content={
        <div className="guide-copy">
          <nav aria-label="תוכן העניינים" className="not-prose mb-8 border border-ink/15 bg-paper p-5">
            <h2 className="mb-3 text-lg font-bold">מה צריך לעשות עכשיו?</h2>
            <ul className="grid gap-3 text-sm sm:grid-cols-2">
              <li><a className="underline underline-offset-4" href="#certificates">להבין אילו אישורים ביקשו</a></li>
              <li><a className="underline underline-offset-4" href="#print">לבדוק ולהדפיס אישור</a></li>
              <li><a className="underline underline-offset-4" href="#missing">לטפל באישור חסר או בשיעור ניכוי</a></li>
              <li><a className="underline underline-offset-4" href="#payment">להתאים תשלום שנוכה ממנו מס</a></li>
              <li><a className="underline underline-offset-4" href="#year-end">להכין מסמכים לסוף השנה</a></li>
            </ul>
          </nav>

          <h2 id="certificates" className="scroll-mt-40">שלושה מסמכים עם שמות דומים — ותפקיד שונה</h2>
          <div className="not-prose my-6 overflow-x-auto">
            <table className="w-full border border-ink/15 text-right text-sm">
              <caption className="mb-2 text-right text-ink/70">אישורים לפני התשלום לעומת אסמכתא לאחריו</caption>
              <thead className="bg-cream-2"><tr>
                <th scope="col" className="p-3">המסמך</th>
                <th scope="col" className="p-3">למה הוא משמש?</th>
                <th scope="col" className="p-3">מה הוא לא מוכיח?</th>
              </tr></thead>
              <tbody>
                <tr className="border-t border-ink/15">
                  <th scope="row" className="p-3">אישור ניכוי מס במקור</th>
                  <td className="p-3">בדיקת שיעור הניכוי ותנאי האישור אצל מקבל התשלום.</td>
                  <td className="p-3">שהמס השנתי הסופי יהיה אפס.</td>
                </tr>
                <tr className="border-t border-ink/15">
                  <th scope="row" className="p-3">אישור ניהול ספרים</th>
                  <td className="p-3">אישור לפי חוק עסקאות גופים ציבוריים בעניין ניהול פנקסים ודיווח.</td>
                  <td className="p-3">פטור מניכוי במקור, רישיון עסק או בדיקת איכות הספק.</td>
                </tr>
                <tr className="border-t border-ink/15">
                  <th scope="row" className="p-3">אישור שנתי על מס שנוכה</th>
                  <td className="p-3">תיעוד התשלומים והניכויים שכבר בוצעו בידי המשלם.</td>
                  <td className="p-3">שיעור הניכוי שיחול על התשלום הבא.</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            רשות המסים מפרידה בין האישורים. לכן, אם הלקוח מבקש את שניהם, שלחו את שניהם
            ובדקו כל אחד בנפרד. הוראות הטיפול העדכניות מופיעות ב
            <a href={SOURCES.instructions}>הוראת ביצוע אישורי ניכוי וניהול ספרים לשנת 2026</a>.
          </p>

          <h2 id="print" className="scroll-mt-40">איך בודקים ומדפיסים את האישורים?</h2>
          <ol>
            <li>פתחו את <a href={SOURCES.certificates}>שירות המידע על אישורי ניכוי מס במקור וניהול ספרים</a>.</li>
            <li>הזינו את מספר התיק המתאים כפי שמבקשת המערכת, ובדקו שהשם והמספר בתוצאה שייכים לעסק.</li>
            <li>קראו את תוקף האישור, סוגי התשלומים, השיעורים וכל הסתייגות שמופיעה בו.</li>
            <li>הדפיסו או שמרו עותק ושלחו ללקוח. שמרו גם אצלכם תיעוד של מה שנשלח ומתי.</li>
          </ol>
          <p>
            השירות ללא תשלום. הוא מיועד להצגת מידע ולהדפסה, <strong>לא להגשת בקשה לשינוי</strong>.
            צילום ישן בתיקיית המסמכים אינו מבטיח שהמידע עדיין תקף; לקראת תשלום בדקו את
            המידע העדכני ואת תנאי האישור, ולא רק את הכותרת שלו.
          </p>
          <p>
            <strong>גם למשלם יש בדיקה משלו:</strong> לפי סעיף 6.3 להוראת 2026, בפלט הפרטני
            המופנה למשלם נדרשים פרטיו ופרטי הספק, והוא שומר את האסמכתא לפי תנאי ההוראה.
            עותק שהספק שולח לצורך קליטתו אינו מחליף את בדיקת המשלם; פלט המופנה למשלם מסוים
            אינו אישור שניתן להעביר למשלם אחר.
          </p>

          <h2 id="missing" className="scroll-mt-40">אין אישור: קודם מזהים איזה אישור חסר</h2>
          <p>
            <strong>חסר אישור ניהול ספרים?</strong> בדקו מול הרשויות אם התיקים במע״מ ובמס
            הכנסה פעילים, אם הוגשו הדוחות ואם קיים ליקוי ניהול ספרים. אלה תנאים הנבדקים
            בנפרד מניכוי מס במקור, לפי סעיף 4.4 להוראת 2026. טופס 2542 אינו בקשה לאישור הזה.
          </p>
          <h3>חסר אישור ניכוי במקור, או שרוצים להקטין את השיעור?</h3>
          <p>
            אל תשנו את הקובץ ואל תניחו שהיעדר אישור פירושו פטור. פנו למשרד מס הכנסה שבו
            מתנהל התיק לבירור. לבקשת פטור או הקטנה קיים{' '}
            <a href={SOURCES.reduction}>טופס 2542 והשירות הרשמי להגשתו</a>, המיועד לבעל תיק
            במס הכנסה החייב בדוח שנתי. לפי דף השירות, מגישים טופס מלא וחתום למשרד שבו
            מתנהל התיק; הגעה למשרד מחייבת זימון תור. הורדת הטופס או הצגת האישור באתר אינן הגשת הבקשה.
          </p>
          <p>
            להכנת הבירור, רכזו את האישור הקיים, פרטי העסק, פירוט התשלומים הצפויים והודעה
            שקיבלתם מהרשות אם ישנה. זו רשימת הכנה מעשית, לא רשימת מסמכי חובה לכל בקשה.
            בקשה לשינוי שיעור צריכה להיות מנומקת בכתב ונתמכת באסמכתאות. לאחר החלטת הרשות
            בדקו שוב את האישור במערכת לפני עדכון הלקוח.
          </p>

          <h2 id="payment" className="scroll-mt-40">הלקוח שילם פחות בגלל ניכוי: דוגמת התאמה</h2>
          <p>
            ניכוי במקור הוא תשלום על חשבון המס באמצעות המשלם, ולא הנחה שנתתם לו.
            לכן סכום ההעברה לבנק לבדו אינו מספיק לבדיקת סגירת החוב. בקשו אסמכתא על
            הניכוי ובדקו אותה לצד המסמך שהפקתם ופירוט התשלום. העיקרון מוסבר ב
            <a href={SOURCES.guide}>מדריך רשות המסים, פרק מקדמות וניכוי במקור</a>.
          </p>
          <div className="not-prose my-6 border border-ink/15 bg-cream-2 p-5">
            <h3 className="mb-3 text-lg font-bold">דוגמה חשבונית בלבד — לא קביעת שיעור ניכוי</h3>
            <dl className="grid grid-cols-2 gap-3 text-sm">
              <dt>סכום כולל שהלקוח חייב</dt><dd className="font-bold">{nis(EXAMPLE.totalDue)}</dd>
              <dt>ניכוי לפי אסמכתא שהלקוח מסר</dt><dd className="font-bold">{nis(EXAMPLE.withheldByCustomer)}</dd>
              <dt>העברה צפויה לבנק</dt><dd className="font-bold">{nis(amountReceived)}</dd>
            </dl>
            <p className="mt-4 text-sm leading-relaxed text-ink/75">
              בדקו שסכום ההעברה והניכוי יחד מסבירים את מלוא החוב. הדוגמה אינה קובעת
              את בסיס הניכוי, טיפול במע״מ או שיעור חובה. אלה תלויים בסוג התשלום ובדין החל.
            </p>
          </div>
          <p>
            הפקת קבלה או חשבונית והצגת הניכוי במערכת הנהלת החשבונות הן שלב נפרד
            מבדיקת האישור. אין למחוק הכנסה או להוציא זיכוי רק מפני שהבנק קיבל סכום
            קטן יותר. ראו <Link href="/self-employed/invoices">איזה מסמך מפיקים ומתי — חשבוניות וקבלות</Link>.
          </p>

          <h2 id="year-end" className="scroll-mt-40">מה שומרים לקראת הדוח השנתי?</h2>
          <ul>
            <li>רשימת לקוחות שניכו מס, עם מספרי המסמכים והתשלומים שאליהם הניכוי מתייחס.</li>
            <li>אסמכתאות הניכוי ופירוט ההעברות, ולא רק צילום של יתרת הבנק.</li>
            <li>אישור שנתי מהמשלם והשוואה שלו לרישומים שלכם; הפרש דורש בירור לפני הדיווח.</li>
          </ul>
          <p>
            <a href={SOURCES.annual}>שירות טופס 806</a> מפרט אישור שנתי על התשלומים, המע״מ
            והמס שנוכה. אין לבלבל אותו עם טופס 106 של מעסיק לשכיר. כשהניכויים מתועדים,
            אפשר לבדוק אותם לצד <Link href="/self-employed/tax-advances">המקדמות ששולמו</Link>{' '}
            במסגרת <Link href="/self-employed/year-end-tax-simulator">הכנת נתונים לסוף שנת המס</Link>.
            אין להפחית את אותו ניכוי פעמיים או להסתמך על אומדן ללא אסמכתא.
          </p>

          <h2>איפה הנושא משתלב בניהול העסק?</h2>
          <ul>
            <li>לפני העסקה הראשונה: <Link href="/self-employed/opening-business">רישום העסק ברשויות והכנת המסמכים</Link>.</li>
            <li>לבחינת המעמד במע״מ: <Link href="/compare/osek-patur-vs-murshe">ההבדל בין עוסק פטור למורשה</Link>.</li>
            <li>לרישום עלויות: <Link href="/self-employed/allowed-expenses">הוצאות מוכרות וההבדל מקיזוז מע״מ</Link>.</li>
            <li>אם יש גם משכורת: <Link href="/self-employed/employee-and-self-employed">שכיר ועצמאי במקביל</Link>.</li>
          </ul>
          <p className="text-sm text-ink/65">
            היקף המדריך: תשלומים לעסק בישראל ומסמכים לבירור. תשלומים לתושבי חוץ, שכר,
            שוק ההון ומקרים מיוחדים מחייבים בדיקה נפרדת. המדריך אינו קובע חובת ניכוי או שיעור אישי.
          </p>
        </div>
      }
      faq={<FAQ items={faq} />}
      sources={
        <ul className="space-y-3 text-sm text-ink/75">
          <li><a className="underline" href={SOURCES.certificates}>רשות המסים — בדיקה והדפסה של אישורי ניכוי מס וניהול ספרים</a></li>
          <li><a className="underline" href={SOURCES.instructions}>הוראת ביצוע 02/2026 — אישורי ניכוי מס וניהול ספרים</a></li>
          <li><a className="underline" href={SOURCES.reduction}>רשות המסים — בקשת פטור או הקטנה, טופס 2542</a></li>
          <li><a className="underline" href={SOURCES.annual}>רשות המסים — אישור שנתי, טופס 806</a></li>
          <li><a className="underline" href={SOURCES.guide}>דע זכויותיך וחובותיך — מקדמות וניכוי במקור</a></li>
        </ul>
      }
    />
  );
}
