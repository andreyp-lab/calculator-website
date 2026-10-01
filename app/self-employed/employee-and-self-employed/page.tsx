import type { Metadata } from 'next';
import Link from 'next/link';
import { CalculatorLayout } from '@/components/calculator/CalculatorLayout';
import { FAQ } from '@/components/calculator/FAQ';

const PAGE_PATH = '/self-employed/employee-and-self-employed';
const OPEN_EXEMPT_DEALER =
  'https://www.gov.il/he/service/request-open-exempt-dealer-via-internet';
const ANNUAL_REPORT =
  'https://www.gov.il/he/service/reporting-and-payment-2025-annual-tax-report-for-individuals';
const FORM_106 = 'https://www.gov.il/he/service/itc-106';
const TAX_ADVANCES = 'https://www.gov.il/he/service/itc-payment-online-incometax';
const TAX_COORDINATION = 'https://www.gov.il/he/service/tax-coordination-online';
const MICRO_BUSINESS_REPORT =
  'https://www.gov.il/he/service/report-and-payment-for-micro-business-owner';
const BTL_REGISTRATION =
  'https://www.btl.gov.il/Insurance/National%20Insurance/type_list/Self_Employed/Pages/howtoregister.aspx';
const BTL_SELF_EMPLOYED_STATUS =
  'https://www.btl.gov.il/Insurance/National%20Insurance/type_list/Self_Employed/Pages/default.aspx';
const BTL_EMPLOYEE_SELF_EMPLOYED_RATE =
  'https://www.btl.gov.il/Arabic%20HomePage/%D7%9E%D7%99%D7%93%D7%A2%20%D7%9C%D7%A7%D7%94%D7%9C%20%D7%99%D7%A2%D7%93/Self_employed_workers_ar/%D7%9E%D7%99%D7%93%D7%A2%20%D7%9C%D7%A2%D7%A6%D7%9E%D7%90%D7%99/Pages/%D7%94%D7%9B%D7%A0%D7%A1%D7%94%20%D7%9E%D7%99%D7%A0%D7%99%D7%9E%D7%9C%D7%99%D7%AA%20%D7%9C%D7%AA%D7%A9%D7%9C%D7%95%D7%9D%20%D7%93%D7%9E%D7%99%20%D7%91%D7%99%D7%98%D7%95%D7%97%20%D7%95%D7%93%D7%9E%D7%99%20%D7%91%D7%99%D7%98%D7%95%D7%97%20%D7%91%D7%A8%D7%99%D7%90%D7%95%D7%AA.aspx';
const BTL_CALCULATOR =
  'https://www.btl.gov.il/Simulators/BituahCalc/Pages/Insurance_NotSachir.aspx';
const PENSION_OBLIGATION =
  'https://www.gov.il/BlobFolder/generalpage/forms-eca-new-format-2/he/Forms_fines-mandatory-pension.pdf';
const PENSION_TAX_BENEFITS =
  'https://www.gov.il/BlobFolder/generalpage/pensions-forms/he/files_pensions-forms_tax-benefits-fund-independent.pdf';

export const metadata: Metadata = {
  title: 'שכיר ועצמאי במקביל: פתיחת עסק, מס וביטוח לאומי',
  description:
    'מדריך מעשי לשכיר שפותח עסק: מה נחשב למחזור, איך מרכזים שכר ורווח בדוח השנתי, מה מעדכנים בביטוח לאומי ואילו מסמכים שומרים.',
  alternates: { canonical: PAGE_PATH },
  openGraph: {
    images: ['/opengraph-image'],
    title: 'שכיר ועצמאי במקביל: פתיחת עסק, מס וביטוח לאומי',
    description:
      'הפרדה ברורה בין משכורת, מחזור ורווח — עם צ׳קליסט מסמכים ופעולות מול הרשויות.',
    type: 'article',
    locale: 'he_IL',
    url: PAGE_PATH,
  },
};

// Illustrative bookkeeping inputs, not a personalized tax or net-pay calculation.
const EXAMPLE = { salary: 180000, turnover: 60000, expenses: 15000 };
const exampleProfit = EXAMPLE.turnover - EXAMPLE.expenses;
const nis = (amount: number) => `${amount.toLocaleString('he-IL')} ₪`;

const faqItems = [
  {
    question: 'האם שכיר שמתחיל להכניס כסף מהצד צריך לפתוח תיק?',
    answer:
      'כאשר מדובר בפעילות עסקית עצמאית של מכירת שירותים או מוצרים, העבודה כשכיר אינה מחליפה את רישום העסק. יש לבדוק מראש את הסיווג במע״מ, לפתוח תיק במס הכנסה ולהסדיר את המעמד בביטוח הלאומי. מסלול הרישום והמסמכים תלויים בסוג הפעילות ובסיווג העסק.',
  },
  {
    question: 'האם המשכורת נספרת בתקרת המחזור של עוסק פטור?',
    answer:
      'לא. תקרת עוסק פטור נבדקת לפי מחזור העסקאות של העסק, ולא לפי השכר שמקבלים ממעסיק. המשכורת כן רלוונטית לחישוב מס ההכנסה השנתי ולדמי הביטוח, ולכן צריך לשמור את טופס 106 ונתוני השכר בנפרד מרישומי העסק.',
  },
  {
    question: 'האם מס הכנסה מחושב על המשכורת ועל העסק יחד?',
    answer:
      'בדוח השנתי הרגיל מדווחים על מקורות ההכנסה הרלוונטיים, ובהם השכר וההכנסה החייבת מהעסק. המס שנוכה בתלוש, מקדמות ששולמו וניכוי מס במקור מלקוחות הם תשלומים או זיכויים על חשבון החבות; השומה השנתית קובעת אם נותרה יתרה לתשלום או נוצר החזר.',
  },
  {
    question: 'האם שכיר עם עסק צריך לעשות תיאום מס?',
    answer:
      'לא מניחים שתיאום המס הרגיל לשכירים מכסה גם עסק עצמאי. השירות המקוון של רשות המסים מיועד לשכירים וגם לבעלי עסק זעיר שהוכרו במסלול. עסק רגיל מתנהל בדרך כלל באמצעות מקדמות ודוח שנתי לפי דרישות התיק. אם הוכרתם כבעלי עסק זעיר, יש לבדוק את תנאי התיאום והדיווח המקוצר של המסלול.',
  },
  {
    question: 'איך ביטוח לאומי מתייחס למי שהוא גם שכיר וגם עצמאי?',
    answer:
      'ביטוח לאומי קובע את המעמד העצמאי בנפרד, לפי היקף העבודה וההכנסה. יש לדווח על תחילת הפעילות ועל ההכנסה הצפויה, והכנסת השכיר מובאת בחשבון בחישוב דמי הביטוח כעצמאי. אין להסיק מהניכוי בתלוש שאין חיוב נוסף או שהמעמד העצמאי כבר עודכן.',
  },
  {
    question: 'האם הפקדות הפנסיה כשכיר פוטרות מהפקדה כעצמאי?',
    answer:
      'לא מניחים פטור אוטומטי רק משום שמופיעה הפקדה בתלוש. צריך לבדוק את חובת ההפקדה החלה על ההכנסה העצמאית מול ההפקדות שבוצעו כשכיר ואת הנתונים האישיים. גם הטבות המס כפופות לתקרות ולנתוני השכר וההפקדות, ולכן אין להניח הטבה כפולה.',
  },
  {
    question: 'אילו מסמכים שכיר ועצמאי צריך להכין לדוח השנתי?',
    answer:
      'בדרך כלל מכינים טופסי 106 מכל המעסיקים, דוח רווח והפסד וריכוז הכנסות והוצאות העסק, אישורי ניכוי מס במקור מלקוחות, אישורי מקדמות, אישורי הפקדות לפנסיה ולקופות, ואישורים אישיים רלוונטיים. הרשימה הסופית תלויה בנתונים ובנספחים הנדרשים לאותה שנת מס.',
  },
];

export default function Page() {
  return (
    <CalculatorLayout
      title="שכיר ועצמאי במקביל — מה פותחים, מה מדווחים ומה שומרים"
      description="מדריך מעשי להפרדה בין המשכורת, מחזור העסק והרווח — ולחיבור הנכון ביניהם במס הכנסה, בביטוח הלאומי ובפנסיה."
      breadcrumbs={[
        { label: 'דף הבית', href: '/' },
        { label: 'עצמאים', href: '/self-employed' },
        { label: 'שכיר ועצמאי במקביל' },
      ]}
      pageUrl={PAGE_PATH}
      lastUpdated="2026-10-01"
      quickAnswer={
        <p>
          אפשר לעבוד כשכירים ולנהל עסק במקביל, אבל המשכורת אינה מחליפה את רישום העסק.
          לצורכי מע״מ בודקים את <strong>מחזור העסקאות של העסק בלבד</strong>; לצורכי מס הכנסה
          מרכזים בדיווח השנתי את השכר ואת ההכנסה החייבת מהעסק, ומביאים בחשבון מס שכבר נוכה
          ותשלומים ששולמו. בביטוח הלאומי צריך להסדיר בנפרד מעמד של שכיר ועצמאי, והחישוב מתחשב
          בשני מקורות ההכנסה. התחילו בפתיחת התיקים המתאימים, נהלו מסמכי עסק בנפרד, ושמרו טופס
          106, אישורי ניכוי במקור, מקדמות והפקדות.
        </p>
      }
      content={
        <div className="guide-copy">
          <nav aria-label="תוכן העניינים" className="not-prose mb-8 border border-ink/15 bg-paper p-5">
            <h2 className="mb-3 text-lg font-bold">מה בודקים כשיש משכורת ועסק?</h2>
            <ul className="grid gap-3 text-sm sm:grid-cols-2">
              <li><a className="underline underline-offset-4" href="#registration">פתיחת עסק לצד העבודה</a></li>
              <li><a className="underline underline-offset-4" href="#income-example">דוגמה: משכורת, מחזור ורווח</a></li>
              <li><a className="underline underline-offset-4" href="#tax">מס הכנסה ותיאום מס</a></li>
              <li><a className="underline underline-offset-4" href="#insurance">ביטוח לאומי</a></li>
              <li><a className="underline underline-offset-4" href="#pension">פנסיה והפקדות</a></li>
              <li><a className="underline underline-offset-4" href="#documents">צ׳קליסט מסמכים</a></li>
            </ul>
          </nav>
          <h2>שלוש בדיקות שונות — אל תחברו את המספרים מוקדם מדי</h2>
          <p>
            הטעות הנפוצה היא לקחת את השכר, התקבולים מהלקוחות וההוצאות ולנסות להפיק מהם
            ״אחוז מס אחד״. לכל רשות יש בסיס בדיקה אחר, ורק לאחר שממיינים את הנתונים נכון אפשר
            להבין את התמונה השנתית.
          </p>
          <div className="not-prose my-6 overflow-x-auto">
            <table className="w-full border border-ink/15 text-sm">
              <thead className="bg-cream-2 text-right">
                <tr>
                  <th className="border-b border-ink/15 p-3">בדיקה</th>
                  <th className="border-b border-ink/15 p-3">הנתון העסקי המרכזי</th>
                  <th className="border-b border-ink/15 p-3">מה קורה למשכורת</th>
                </tr>
              </thead>
              <tbody className="text-ink/75">
                <tr>
                  <td className="border-b border-ink/15 p-3 font-medium text-ink">מע״מ</td>
                  <td className="border-b border-ink/15 p-3">מחזור העסקאות של העסק</td>
                  <td className="border-b border-ink/15 p-3">אינה חלק ממחזור העסק לצורך תקרת עוסק פטור</td>
                </tr>
                <tr className="bg-cream-2/40">
                  <td className="border-b border-ink/15 p-3 font-medium text-ink">מס הכנסה</td>
                  <td className="border-b border-ink/15 p-3">הכנסה חייבת מהעסק לאחר ההתאמות המותרות</td>
                  <td className="border-b border-ink/15 p-3">מדווחת עם יתר מקורות ההכנסה הרלוונטיים בדוח השנתי</td>
                </tr>
                <tr>
                  <td className="p-3 font-medium text-ink">ביטוח לאומי</td>
                  <td className="p-3">הכנסה ומעמד לפי כללי הביטוח הלאומי</td>
                  <td className="p-3">מובאת בחשבון בחישוב החיוב לצד ההכנסה העצמאית</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2 id="registration" className="scroll-mt-40">פותחים עסק לצד העבודה: השלבים הראשונים</h2>
          <p>
            אם התחלתם לתת שירותים או למכור מוצרים כפעילות עצמאית, היותכם שכירים לא מכסה את
            הפעילות הזו. לפני החשבונית או הקבלה הראשונה צריך לבחור סיווג מתאים ולהסדיר את
            הרישום. את השלבים המלאים והמסמכים תמצאו ב
            <Link href="/self-employed/opening-business">מדריך פתיחת עסק</Link>; את ההבדלים
            במע״מ כדאי לבדוק ב
            <Link href="/compare/osek-patur-vs-murshe">השוואת עוסק פטור מול עוסק מורשה</Link>.
          </p>
          <ol>
            <li>
              <strong>מגדירים את הפעילות והמחזור העסקי הצפוי.</strong> סוג העיסוק והמחזור קובעים
              אם אפשר להירשם כעוסק פטור או שנדרש עוסק מורשה.
            </li>
            <li>
              <strong>פותחים את התיקים המתאימים.</strong> השירות המקוון לעוסק פטור פותח תיקי
              מע״מ ומס הכנסה, ובמקרה המתאים מעביר את הנתונים לביטוח הלאומי. במסלולים אחרים יש
              להשלים את הרישום לפי השירות המתאים.
            </li>
            <li>
              <strong>מסדירים תיעוד מהעסקה הראשונה.</strong> סוג המסמך תלוי בסיווג ובמועד
              התשלום; ראו <Link href="/self-employed/invoices">מדריך חשבוניות, קבלות וחשבוניות עסקה</Link>.
            </li>
            <li>
              <strong>בודקים את חוזה ההעסקה.</strong> חובת סודיות, קניין רוחני, הגבלת תחרות או
              צורך באישור לעבודה נוספת הן סוגיות תעסוקתיות נפרדות מחובות המס.
            </li>
          </ol>

          <h2 id="income-example" className="scroll-mt-40">דוגמה: ההבדל בין משכורת, מחזור ורווח</h2>
          <div className="not-prose my-6 border-r-4 border-gold bg-paper p-6">
            <p className="mb-3 font-bold text-ink">דוגמה לצורת המיון בלבד</p>
            <ul className="space-y-2 text-sm leading-relaxed text-ink/75">
              <li>שכר ברוטו שנתי לפי טופס 106: {nis(EXAMPLE.salary)}.</li>
              <li>עסקאות העסק שנרשמו במהלך השנה: {nis(EXAMPLE.turnover)}.</li>
              <li>הוצאות עסקיות שנרשמו: {nis(EXAMPLE.expenses)}, לפני בדיקת ההכרה וההתאמות לצורכי מס.</li>
            </ul>
            <p className="mt-4 text-sm leading-relaxed text-ink/75">
              לצורך מעקב אחר תקרת עוסק פטור, נתון העסק הוא {nis(EXAMPLE.turnover)} — השכר אינו מצטרף אליו.
              בדוח רווח והפסד החשבונאי הפשוט מתקבלת יתרה של {nis(exampleProfit)} לפני התאמות. במס הכנסה
              אין מחברים את השכר למחזור: משתמשים בנתוני השכר ובמס שנוכה לפי טופס 106, ולצדם
              בהכנסה החייבת מהעסק לאחר הבדיקות המתאימות. מכאן אי אפשר להסיק נטו, משום שחסרים
              נתונים אישיים, זיכויים, הפקדות, דמי ביטוח ותשלומים שכבר שולמו.
            </p>
          </div>
          <p>
            כדי לבדוק אם הוצאה מסוימת שייכת לעסק ומה צריך לשמור עבורה, עברו ל
            <Link href="/self-employed/allowed-expenses">מדריך הוצאות עסקיות</Link>. למעקב אחר
            התקרה עצמה השתמשו ב<Link href="/self-employed/vat-threshold">מדריך תקרת עוסק פטור</Link>
            — בלי לערב בו את תלוש השכר.
          </p>

          <h2 id="tax" className="scroll-mt-40">מס הכנסה: החישוב השנתי לחוד, התשלומים במהלך השנה לחוד</h2>
          <p>
            בדוח השנתי הרגיל ליחיד מדווחים על השכר ועל תוצאות העסק בנספחים המתאימים. טופס 106
            מרכז את השכר ואת המס שנוכה בידי המעסיק; דוח רווח והפסד מרכז את נתוני העסק. רשות
            המסים קולטת את הדוח ומפיקה שומה שממנה יכולה להיווצר יתרה לתשלום או החזר.
          </p>
          <p>
            במקביל, במהלך השנה יכולים להיגבות סכומים <strong>על חשבון</strong> החבות: מס שנוכה
            מהמשכורת, מקדמות מס הכנסה, וניכוי מס במקור שלקוחות ניכו מתשלום לעסק. לכן שומרים כל
            אישור ולא מפחיתים סכום מהחישוב רק לפי תנועת הבנק. אם לקוח מבקש אישורים, ראו את
            המדריך ל<Link href="/self-employed/withholding-tax">אישור ניכוי מס במקור וניהול ספרים</Link>.
          </p>
          <div className="not-prose my-6 grid gap-4 sm:grid-cols-2">
            <div className="border border-ink/15 bg-cream-2 p-5">
              <p className="mb-2 font-bold text-ink">עסק במסלול הרגיל</p>
              <p className="text-sm leading-relaxed text-ink/70">
                בודקים את דרישות המקדמות ואת חובת הדוח לפי התיק. תיאום המס לשכירים אינו אישור
                אוטומטי לכיסוי ההכנסה העסקית.
              </p>
            </div>
            <div className="border border-ink/15 bg-cream-2 p-5">
              <p className="mb-2 font-bold text-ink">מי שהוכר כבעל עסק זעיר</p>
              <p className="text-sm leading-relaxed text-ink/70">
                השירות המקוון לתיאום מס והדיווח המקוצר עשויים לחול בכפוף לתנאי המסלול ולהשלמת
                הפעולות הנדרשות. עצם היות העסק קטן או פטור במע״מ אינו מספיק.
              </p>
            </div>
          </div>

          <h2 id="insurance" className="scroll-mt-40">ביטוח לאומי: אותו אדם, מעמד נוסף שצריך לעדכן</h2>
          <p>
            הביטוח הלאומי מגדיר ״עובד עצמאי״ לפי מבחני שעות והכנסה משלו. מי שאינו עומד בהם עשוי
            להיחשב כבעל הכנסה שלא מעבודה לעניין דמי ביטוח וזכויות — גם אם במס הכנסה ובמע״מ
            נפתח עסק. לכן לא מעתיקים אוטומטית את הסיווג מרשות אחת לאחרת.
          </p>
          <ul>
            <li>מדווחים מיד עם תחילת העבודה העצמאית ומוסרים הערכת שעות והכנסה סבירה.</li>
            <li>מוודאים שהמעמד במערכת משקף גם שכיר וגם עצמאי, ולא רק את מקום העבודה.</li>
            <li>אם ההכנסה הצפויה השתנתה, בודקים עדכון מקדמות במקום להמתין לחוב בסוף השנה.</li>
            <li>
              בחישוב דמי הביטוח ההכנסה כשכיר מובאת בחשבון; לפי הסבר הביטוח הלאומי, המדרגה
              המופחתת עשויה כבר להיות מנוצלת דרך השכר, ולכן אין לחשב את ההכנסה העצמאית כאילו
              היא המקור היחיד.
            </li>
          </ul>
          <p>
            אפשר להתחיל ב
            <a href={BTL_CALCULATOR} target="_blank" rel="noopener noreferrer">
              מחשבון הרשמי הכולל אפשרות לעצמאי שהוא גם שכיר
            </a>
            , אך התוצאה תלויה בנתונים ובמעמד המעודכן במוסד.
          </p>

          <h2 id="pension" className="scroll-mt-40">פנסיה: בודקים השלמה, לא מניחים פטור או הטבה כפולה</h2>
          <p>
            חוק פנסיה חובה לעצמאים קובע חובת הפקדה לפי ההכנסה העצמאית ובכפוף לתנאי התחולה.
            כאשר אתם גם שכירים, מרכזים את ההפקדות שבוצעו דרך המעסיק ואת ההפקדות העצמאיות
            ובודקים אם קיימת חובת השלמה לפי הנתונים האישיים. עצם קיומה של קרן פנסיה בתלוש אינו
            בסיס מספיק לקביעה גורפת שאין צורך בהפקדה נוספת.
          </p>
          <p>
            גם הטבת המס אינה ״כפולה״ אוטומטית. השכר המבוטח, הפקדות העובד והמעסיק, הפקדות
            עצמאיות והתקרות השנתיות משפיעים על הניכוי או הזיכוי. לכן שומרים את הדוח השנתי של
            הקופה ואת אישורי ההפקדות ומצרפים אותם להכנת הדוח. להמשך הבדיקה:{' '}
            <Link href="/self-employed/mandatory-pension">מדריך פנסיה חובה לעצמאי</Link>.
          </p>

          <h2 id="documents" className="scroll-mt-40">צ׳קליסט מסמכים לפי שלב</h2>
          <div className="not-prose my-6 grid gap-4 md:grid-cols-3">
            <section className="border border-ink/15 bg-paper p-5">
              <h3 className="mb-3 text-lg font-bold text-ink">לפני פתיחת העסק</h3>
              <ul className="space-y-2 text-sm leading-relaxed text-ink/70">
                <li>☐ תיאור הפעילות וסוג הלקוחות</li>
                <li>☐ תחזית מחזור עסקי — בלי המשכורת</li>
                <li>☐ תעודת זהות ואישור חשבון בנק</li>
                <li>☐ חוזה שכירות או מסמכי פעילות, אם רלוונטי</li>
                <li>☐ הערכת שעות והכנסה לביטוח הלאומי</li>
              </ul>
            </section>
            <section className="border border-ink/15 bg-paper p-5">
              <h3 className="mb-3 text-lg font-bold text-ink">במהלך השנה</h3>
              <ul className="space-y-2 text-sm leading-relaxed text-ink/70">
                <li>☐ חשבוניות, קבלות ורישומי תקבולים</li>
                <li>☐ מסמכי הוצאות ואמצעי תשלום</li>
                <li>☐ אישורי מקדמות מס וביטוח לאומי</li>
                <li>☐ אישורי ניכוי מס במקור מלקוחות</li>
                <li>☐ עדכון תחזית כשהפעילות משתנה</li>
              </ul>
            </section>
            <section className="border border-ink/15 bg-paper p-5">
              <h3 className="mb-3 text-lg font-bold text-ink">אחרי סוף השנה</h3>
              <ul className="space-y-2 text-sm leading-relaxed text-ink/70">
                <li>☐ טופס 106 מכל מעסיק</li>
                <li>☐ דוח רווח והפסד וריכוז הוצאות</li>
                <li>☐ אישורי קופות גמל ופנסיה</li>
                <li>☐ אישורים לזיכויים אישיים רלוונטיים</li>
                <li>☐ אישורי הגשה ותשלום שנשמרו מהמערכות</li>
              </ul>
            </section>
          </div>

          <h2>סדר עבודה מומלץ בחודש הראשון</h2>
          <ol>
            <li>הפרידו בין תחזית השכר לבין תחזית העסקאות של העסק.</li>
            <li>בחרו סיווג ופתחו את התיקים לפני שמפיקים מסמכי עסקה.</li>
            <li>ודאו בביטוח הלאומי שהמעמד והערכת ההכנסה נקלטו.</li>
            <li>פתחו תיקייה לטופסי 106, מקדמות, ניכויים במקור והפקדות פנסיוניות.</li>
            <li>קבעו בדיקה רבעונית של המחזור, הרווח המשוער והמקדמות — בלי לנסות לחשב נטו לפי אחוז יחיד.</li>
          </ol>
        </div>
      }
      faq={<FAQ items={faqItems} />}
      sources={
        <ul>
          <li>
            <a href={OPEN_EXEMPT_DEALER} target="_blank" rel="noopener noreferrer">
              רשות המסים — פתיחת תיק עוסק פטור באופן מקוון
            </a>{' '}
            (תנאי מחזור עסקאות, מסמכים והעברת נתונים לביטוח הלאומי במקרים המתאימים).
          </li>
          <li>
            <a href={ANNUAL_REPORT} target="_blank" rel="noopener noreferrer">
              רשות המסים — דוח שנתי ליחידים ובעלי עסקים שאינם חברה, טופס 1301
            </a>{' '}
            (השירות המקושר הוא לדוח שנת המס 2025; להגשת שנה אחרת יש להשתמש בטפסים ובהוראות
            לאותה שנה כשהם מתפרסמים, ולא להעתיק מועדי הגשה משנה קודמת).
          </li>
          <li>
            <a href={FORM_106} target="_blank" rel="noopener noreferrer">
              רשות המסים — אישור על משכורת וניכוי מס, טופס 106
            </a>{' '}
            (ריכוז שנתי של השכר, ניכויי המס והפקדות העובד והמעסיק לקצבה).
          </li>
          <li>
            <a href={TAX_ADVANCES} target="_blank" rel="noopener noreferrer">
              רשות המסים — דיווח ותשלום מקדמות מס הכנסה
            </a>{' '}
            (מקדמות תקופתיות לבעלי תיק שנדרשו בהן).
          </li>
          <li>
            <a href={TAX_COORDINATION} target="_blank" rel="noopener noreferrer">
              רשות המסים — תיאום מס מקוון
            </a>{' '}
            ו
            <a href={MICRO_BUSINESS_REPORT} target="_blank" rel="noopener noreferrer">
              דיווח שנתי מקוצר לבעל עסק זעיר
            </a>{' '}
            (תחולת השירות על שכירים ובעלי עסק זעיר ותנאי הדיווח המקוצר).
          </li>
          <li>
            <a href={BTL_REGISTRATION} target="_blank" rel="noopener noreferrer">
              ביטוח לאומי — פתיחת תיק עצמאי
            </a>{' '}
            ו
            <a href={BTL_SELF_EMPLOYED_STATUS} target="_blank" rel="noopener noreferrer">
              הגדרת עובד עצמאי
            </a>{' '}
            (מועד הדיווח, שינוי מקדמות ומבחני שעות והכנסה).
          </li>
          <li>
            <a href={BTL_EMPLOYEE_SELF_EMPLOYED_RATE} target="_blank" rel="noopener noreferrer">
              ביטוח לאומי — הכנסה מינימלית ושיעור מופחת לעצמאי שהוא גם שכיר
            </a>{' '}
            (סדר החישוב הכללי של השיעור המופחת בין ההכנסה כשכיר להכנסה כעצמאי).
          </li>
          <li>
            <a href={PENSION_OBLIGATION} target="_blank" rel="noopener noreferrer">
              משרד האוצר — אגרת פנסיה חובה לעצמאים
            </a>{' '}
            ו
            <a href={PENSION_TAX_BENEFITS} target="_blank" rel="noopener noreferrer">
              הסבר ממשלתי על הטבות מס בהפקדה במעמד עצמאי
            </a>{' '}
            (חובת ההפקדה וההבחנה בין הפקדות כשכיר להפקדות עצמאיות לצורכי הטבות מס).
          </li>
        </ul>
      }
    />
  );
}
