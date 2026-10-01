import type { Metadata } from 'next';
import Link from 'next/link';
import { CalculatorLayout } from '@/components/calculator/CalculatorLayout';
import { FAQ } from '@/components/calculator/FAQ';

const PAGE_PATH = '/self-employed/business-setup-cost';
const SITE_URL = 'https://cheshbonai.co.il';

const SOURCES = {
  exemptOpening: 'https://www.gov.il/he/service/request-open-exempt-dealer-via-internet',
  licensedOpening: 'https://www.gov.il/he/service/vat-821',
  companyRegistration: 'https://www.gov.il/he/service/company_registration',
  companyFee: 'https://www.gov.il/he/service/company_partnership_annual_payment',
  businessLicense: 'https://www.gov.il/he/service/application-for-new-business-license',
  preliminaryLicenseReview: 'https://www.gov.il/he/service/business-license-review',
  nationalInsurance:
    'https://www.btl.gov.il/Insurance/National%20Insurance/type_list/Self_Employed/Pages/howtoregister.aspx',
} as const;

export const metadata: Metadata = {
  title: 'כמה עולה לפתוח עסק? תקציב פתיחה מלא',
  description:
    'כמה עולה לפתוח עסק או עוסק מורשה? מדריך לבניית תקציב הכולל רישום, ציוד, ספקים, עלויות חודשיות והון חוזר — עם שתי דוגמאות מחושבות.',
  alternates: { canonical: PAGE_PATH },
  openGraph: {
    title: 'כמה עולה לפתוח עסק? כך בונים תקציב פתיחה',
    description:
      'מפרידים בין רישום ממשלתי, השקעה חד־פעמית, הוצאות חודשיות והון חוזר — ומחשבים כמה כסף באמת צריך לפני שמתחילים.',
    type: 'article',
    locale: 'he_IL',
    siteName: 'חשבונאי',
    url: PAGE_PATH,
    images: ['/opengraph-image'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'כמה עולה לפתוח עסק? תקציב פתיחה מלא',
    description: 'מדריך מעשי לבניית תקציב פתיחה, כולל שתי דוגמאות מחושבות.',
    images: ['/opengraph-image'],
  },
};

type BudgetItem = {
  label: string;
  amount: number;
  note: string;
};

// מספרי הדוגמאות הם קלט המחשה בלבד. הם אינם מחירון, ממוצע שוק או המלצה.
const HOME_SERVICE_EXAMPLE = {
  oneTime: [
    { label: 'מחשב וציוד עבודה', amount: 4500, note: 'קלט המחשה לציוד שחסר לפני תחילת הפעילות' },
    { label: 'אתר ודף נחיתה', amount: 1800, note: 'קלט המחשה להצעת מחיר מספק' },
    { label: 'שפה חזותית וחומרי פתיחה', amount: 900, note: 'קלט המחשה בלבד' },
    { label: 'הגדרות תוכנה וסליקה', amount: 600, note: 'קלט המחשה להקמה ראשונית' },
  ] satisfies BudgetItem[],
  monthly: [
    { label: 'הנהלת חשבונות וליווי', amount: 350, note: 'קלט המחשה להצעת מחיר חודשית' },
    { label: 'תוכנות ושירותים מקוונים', amount: 180, note: 'קלט המחשה למנויים' },
    { label: 'שיווק', amount: 600, note: 'תקציב שהוגדר בדוגמה' },
    { label: 'טלפון ותקשורת', amount: 150, note: 'החלק העסקי שהוגדר בדוגמה' },
  ] satisfies BudgetItem[],
  reserveMonths: 3,
};

const PREMISES_EXAMPLE = {
  oneTime: [
    { label: 'פיקדון ושכירות מראש', amount: 24000, note: 'קלט המחשה לתנאי חוזה' },
    { label: 'התאמות במקום', amount: 35000, note: 'קלט המחשה להצעות מחיר' },
    { label: 'ציוד וריהוט', amount: 28000, note: 'קלט המחשה לרשימת ציוד' },
    { label: 'מלאי פתיחה', amount: 22000, note: 'קלט המחשה לתכנית הרכש' },
    { label: 'תכנון, רישוי ושילוט', amount: 9000, note: 'קלט המחשה; החיוב בפועל תלוי בעסק וברשות' },
  ] satisfies BudgetItem[],
  monthly: [
    { label: 'שכירות', amount: 8000, note: 'קלט המחשה לפי חוזה' },
    { label: 'ארנונה ודמי ניהול', amount: 2000, note: 'קלט המחשה בלבד' },
    { label: 'חשמל, מים ותקשורת', amount: 1800, note: 'קלט המחשה בלבד' },
    { label: 'הנהלת חשבונות וליווי', amount: 800, note: 'קלט המחשה להצעת מחיר' },
    { label: 'תוכנות וסליקה', amount: 600, note: 'קלט המחשה בלבד' },
    { label: 'ביטוח', amount: 500, note: 'קלט המחשה להצעת מחיר' },
    { label: 'שיווק', amount: 1800, note: 'תקציב שהוגדר בדוגמה' },
  ] satisfies BudgetItem[],
  reserveMonths: 4,
};

const sumItems = (items: readonly BudgetItem[]) =>
  items.reduce((total, item) => total + item.amount, 0);
const homeOneTime = sumItems(HOME_SERVICE_EXAMPLE.oneTime);
const homeMonthly = sumItems(HOME_SERVICE_EXAMPLE.monthly);
const homeReserve = homeMonthly * HOME_SERVICE_EXAMPLE.reserveMonths;
const homeOpeningBudget = homeOneTime + homeReserve;
const premisesOneTime = sumItems(PREMISES_EXAMPLE.oneTime);
const premisesMonthly = sumItems(PREMISES_EXAMPLE.monthly);
const premisesReserve = premisesMonthly * PREMISES_EXAMPLE.reserveMonths;
const premisesOpeningBudget = premisesOneTime + premisesReserve;
const nis = (amount: number) => `${amount.toLocaleString('he-IL')} ₪`;

const faqItems = [
  {
    question: 'כמה עולה לפתוח עסק בישראל?',
    answer:
      'אין מחיר אחיד. פתיחת תיק עוסק פטור או עוסק מורשה ברשות המסים ניתנת ללא עלות לפי דפי השירות הרשמיים, אבל תקציב ההקמה עשוי לכלול ציוד, רישוי, שכירות, מלאי, שירותים מקצועיים והון חוזר. בונים את הסכום לפי הצעות מחיר ותזרים צפוי לעסק המסוים.',
  },
  {
    question: 'כמה עולה לפתוח עוסק מורשה?',
    answer:
      'שירות פתיחת תיק עוסק מורשה במע״מ ניתן ללא עלות לפי רשות המסים. העלות המעשית נובעת מהכנת העסק לפעילות: מערכת מסמכים, הנהלת חשבונות, ביטוח, ציוד, מקום ורישוי לפי הצורך. מייצג או ספק שירות רשאי לגבות שכר טרחה משלו, ולכן מבקשים הצעה כתובה.',
  },
  {
    question: 'מה ההבדל בין עלות פתיחת עוסק לבין חברה בע״מ?',
    answer:
      'רישום חברה כרוך באגרת רישום ובחובה לבדוק גם אגרה שנתית, לצד עלויות ניהול ודיווח שעשויות להיות שונות מעוסק יחיד. הסכומים משתנים ומתפרסמים בשירותי רשות התאגידים, ולכן יש לבדוק אותם במועד ההגשה ולא להסתמך על מחיר ישן.',
  },
  {
    question: 'האם כל עסק צריך רישיון עסק?',
    answer:
      'לא. החובה תלויה בסוג הפעילות ובפריט הרישוי. משרד הפנים מפנה לצו החכם ולרשות המקומית כדי לזהות את הדרישות, נותני האישור והמסמכים הרלוונטיים. לפני חתימה על מקום או רכישת ציוד יקר כדאי לברר אם הפעילות טעונת רישוי.',
  },
  {
    question: 'כמה חודשי הוצאות כדאי לכלול כהון חוזר?',
    answer:
      'אין מספר חוקי או אחיד. מחשבים את הפער הצפוי בין מועד התשלום לספקים לבין מועד הגבייה מלקוחות, מוסיפים הוצאות חודשיות בתקופת ההרצה ובוחנים תרחיש חלש. בדוגמאות בעמוד נבחרו שלושה וארבעה חודשים לצורך המחשה בלבד.',
  },
  {
    question: 'האם הוצאות ההקמה מוכרות מיד לצורכי מס?',
    answer:
      'לא בהכרח. יש להבחין בין הוצאה שוטפת, ציוד או נכס שעשוי להיות מופחת, מלאי, פיקדון והוצאה פרטית. גם טיפול המע״מ תלוי בסיווג ובתנאים. שמרו מסמכים ובדקו את הסיווג עם איש מקצוע לפני הדיווח.',
  },
];

function BudgetTable({ items, totalLabel }: { items: readonly BudgetItem[]; totalLabel: string }) {
  return (
    <div className="not-prose my-6 overflow-x-auto">
      <table className="w-full min-w-[620px] border border-ink/15 text-right text-sm">
        <thead className="bg-cream-2">
          <tr>
            <th scope="col" className="p-3">רכיב</th>
            <th scope="col" className="p-3">קלט בדוגמה</th>
            <th scope="col" className="p-3">איך נקבע</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.label} className="border-t border-ink/15">
              <th scope="row" className="p-3 font-medium">{item.label}</th>
              <td className="p-3 font-mono">{nis(item.amount)}</td>
              <td className="p-3 text-ink/70">{item.note}</td>
            </tr>
          ))}
          <tr className="border-t-2 border-ink/30 bg-paper font-bold">
            <th scope="row" className="p-3">{totalLabel}</th>
            <td className="p-3 font-mono">{nis(sumItems(items))}</td>
            <td className="p-3">מחושב מסכומי הקלט שמעל</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default function BusinessSetupCostPage() {
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'כמה עולה לפתוח עסק? מדריך לבניית תקציב פתיחה',
    description:
      'מדריך מעשי להפרדה בין רישום ממשלתי, השקעה חד־פעמית, עלויות חודשיות והון חוזר בעת פתיחת עסק.',
    inLanguage: 'he-IL',
    datePublished: '2026-10-02',
    dateModified: '2026-10-02',
    mainEntityOfPage: `${SITE_URL}${PAGE_PATH}`,
    author: { '@type': 'Person', name: 'אנדרי פלטונוב', url: `${SITE_URL}/about` },
    publisher: { '@type': 'Organization', name: 'חשבונאי', url: SITE_URL },
  };

  return (
    <>
      <CalculatorLayout
        title="כמה עולה לפתוח עסק? בונים תקציב פתיחה אמיתי"
        description="מדריך שמפריד בין רישום ברשויות, השקעות חד־פעמיות, הוצאות חודשיות והכסף שצריך עד שהלקוחות מתחילים לשלם."
        breadcrumbs={[
          { label: 'דף הבית', href: '/' },
          { label: 'עצמאים', href: '/self-employed' },
          { label: 'עלות פתיחת עסק' },
        ]}
        pageUrl={PAGE_PATH}
        lastUpdated="2026-10-02"
        quickAnswer={
          <p>
            <strong>פתיחת תיק עוסק פטור או עוסק מורשה ברשות המסים ניתנת ללא עלות,</strong>{' '}
            לפי דפי השירות הרשמיים. אבל זה אינו אומר שפתיחת העסק כולה חינם. התקציב האמיתי
            מורכב מארבע שכבות: תשלומים ממשלתיים ורישוי אם הם חלים, השקעה חד־פעמית בציוד
            ובהקמה, עלויות חודשיות קבועות והון חוזר עד שהגבייה מתייצבת. חברה בע״מ עשויה
            לשלם אגרת רישום ואגרה שנתית, ועסק טעון רישוי עשוי להידרש למסמכים, תכנון
            ואישורים. לכן אין מספר אחד שמתאים לכולם: בונים רשימת רכיבים, אוספים הצעות
            מחיר ומחשבים כמה חודשי פעילות צריך לממן לפני ההכנסה הראשונה.
          </p>
        }
        content={
          <div className="guide-copy">
            <nav aria-label="תוכן העניינים" className="not-prose mb-8 border border-ink/15 bg-paper p-5">
              <h2 className="mb-3 text-lg font-bold">במדריך</h2>
              <ul className="grid gap-3 text-sm sm:grid-cols-2">
                <li><a className="underline underline-offset-4" href="#formula">נוסחת תקציב הפתיחה</a></li>
                <li><a className="underline underline-offset-4" href="#government">עלויות ממשלתיות ורישוי</a></li>
                <li><a className="underline underline-offset-4" href="#quotes">מה מתמחרים באמצעות הצעות מחיר</a></li>
                <li><a className="underline underline-offset-4" href="#home-example">דוגמה: עסק שירות מהבית</a></li>
                <li><a className="underline underline-offset-4" href="#premises-example">דוגמה: עסק עם מקום ומלאי</a></li>
                <li><a className="underline underline-offset-4" href="#checklist">צ׳קליסט לפני שמתחייבים</a></li>
              </ul>
            </nav>

            <h2 id="formula" className="scroll-mt-40">הנוסחה: לא רק ״כמה עולה הרישום״</h2>
            <p>
              שאלת התקציב מתחילה בארבע קופות נפרדות. הערבוב ביניהן הוא הסיבה הנפוצה
              לכך שעסק נראה זול לפתיחה על הנייר, אבל חסר לו כסף בחודש השני.
            </p>
            <ol>
              <li><strong>רישום, אגרות ורישוי:</strong> רק מה שחל על הישות ועל סוג הפעילות.</li>
              <li><strong>השקעה חד־פעמית:</strong> ציוד, התאמות, אתר, שילוט ומלאי פתיחה.</li>
              <li><strong>עלות חודשית:</strong> שכירות, תוכנות, הנהלת חשבונות, ביטוח ושיווק.</li>
              <li><strong>הון חוזר:</strong> הכסף שמממן את התקופה בין תשלום ההוצאות לבין גבייה מהלקוחות.</li>
            </ol>
            <div className="not-prose my-6 border-r-4 border-gold bg-cream-2 p-5">
              <p className="font-bold">תקציב פתיחה = השקעה חד־פעמית + הון חוזר + תשלומי רישוי שחלים בפועל</p>
              <p className="mt-2 text-sm leading-relaxed text-ink/70">
                מס הכנסה, ביטוח לאומי ומע״מ אינם ״מחיר פתיחה״ אחיד. הם תלויים במעמד,
                בפעילות, בהכנסה ובדיווחים. גם משיכת מחיה לבעל העסק צריכה להופיע בתכנית
                התזרים, אך היא אינה עלות ספק רגילה.
              </p>
            </div>

            <h2 id="government" className="scroll-mt-40">מה אפשר לאמת מול הרשויות?</h2>
            <div className="not-prose my-6 overflow-x-auto">
              <table className="w-full min-w-[720px] border border-ink/15 text-right text-sm">
                <caption className="mb-2 text-right text-ink/70">השירות הרשמי אינו כולל שכר טרחה של מייצג או ספק פרטי</caption>
                <thead className="bg-cream-2">
                  <tr>
                    <th scope="col" className="p-3">פעולה</th>
                    <th scope="col" className="p-3">מה ידוע רשמית?</th>
                    <th scope="col" className="p-3">מה עדיין צריך לבדוק?</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-ink/15">
                    <th scope="row" className="p-3">פתיחת עוסק פטור</th>
                    <td className="p-3">השירות המקוון ברשות המסים ניתן ללא עלות.</td>
                    <td className="p-3">זכאות לסיווג, מסמכים ותיק ניכויים אם נדרש.</td>
                  </tr>
                  <tr className="border-t border-ink/15">
                    <th scope="row" className="p-3">פתיחת עוסק מורשה</th>
                    <td className="p-3">שירות פתיחת התיק במע״מ ניתן ללא עלות.</td>
                    <td className="p-3">שכר מייצג, מערכת הנה״ח ועלויות הענף — לפי בחירה והצעה.</td>
                  </tr>
                  <tr className="border-t border-ink/15">
                    <th scope="row" className="p-3">רישום חברה</th>
                    <td className="p-3">קיים שירות רישום ממשלתי הכרוך באגרת רישום.</td>
                    <td className="p-3">את הסכום המעודכן ואופן ההגשה בודקים בשירות במועד הרישום.</td>
                  </tr>
                  <tr className="border-t border-ink/15">
                    <th scope="row" className="p-3">אגרה שנתית לחברה</th>
                    <td className="p-3">חברה רשומה חייבת לבדוק את חובת האגרה ואת מועדי התשלום.</td>
                    <td className="p-3">סכום, הנחה אפשרית והחרגות לפי פרטי החברה ושנת התשלום.</td>
                  </tr>
                  <tr className="border-t border-ink/15">
                    <th scope="row" className="p-3">רישיון עסק</th>
                    <td className="p-3">החובה והמסלול נקבעים לפי סוג הפעילות והרשות המקומית.</td>
                    <td className="p-3">אגרה, תכניות, התאמות ונותני אישור הרלוונטיים למקום ולעסק.</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p>
              המסקנה לשאלה <strong>״כמה עולה לפתוח עוסק מורשה?״</strong> היא כפולה:
              פתיחת התיק עצמה ללא עלות, אבל אין להסיק מכך שהכנת העסק לפעילות ללא עלות.
              אם הפעילות טעונת רישוי, בדקו את הדרישות לפני חתימה על חוזה שכירות או הזמנת
              התאמות. משרד הפנים מציין שהרשות המקומית ונותני האישור קובעים את המשך התהליך,
              וקיים גם מסלול של חוות דעת מקדמית במקרים המתאימים.
            </p>

            <h2 id="quotes" className="scroll-mt-40">מה לא מעתיקים ממחירון באינטרנט?</h2>
            <p>
              כמעט כל עלות תפעולית תלויה בהיקף ובסיכון של העסק. לכן מבקשים הצעה כתובה
              שמבהירה מה כלול, מה מחויב בנפרד ומה יקרה כשהפעילות תגדל.
            </p>
            <ul>
              <li><strong>הנהלת חשבונות ודוחות:</strong> מספר מסמכים, עובדים, מלאי, סניפים וסוג הישות.</li>
              <li><strong>ביטוח:</strong> תחום מקצועי, מקום, ציוד, אחריות כלפי לקוחות ועובדים.</li>
              <li><strong>סליקה ותוכנה:</strong> דמי מנוי, עמלות, הקמה, חיבור והפקת מסמכים.</li>
              <li><strong>מקום עסק:</strong> פיקדון, התאמות, ארנונה, דמי ניהול והחזרת המושכר.</li>
              <li><strong>רישוי ותכנון:</strong> רק אחרי שזוהו פריט הרישוי, הרשות ונותני האישור.</li>
            </ul>
            <p>
              במקביל, הפרידו בין תשלום שיוצא מהבנק לבין אופן ההכרה בו לצורכי מס. ציוד,
              מלאי ופיקדון אינם בהכרח הוצאה שוטפת מיידית. ראו את המדריך על{' '}
              <Link href="/self-employed/allowed-expenses">הוצאות מוכרות, פחת ומס תשומות</Link>.
            </p>

            <h2 id="home-example" className="scroll-mt-40">דוגמה 1: עסק שירות מהבית</h2>
            <p>
              זו המחשה חשבונית בלבד. כל מספר בטבלאות הוא קלט שנבחר לצורך הדוגמה — לא
              מחיר שוק, הצעה או המלצה. העסק כבר כולל מקום עבודה בבית ואינו נדרש למלאי.
            </p>
            <h3>השקעה חד־פעמית</h3>
            <BudgetTable items={HOME_SERVICE_EXAMPLE.oneTime} totalLabel="סך השקעה חד־פעמית" />
            <h3>עלות חודשית</h3>
            <BudgetTable items={HOME_SERVICE_EXAMPLE.monthly} totalLabel="סך הוצאה חודשית בדוגמה" />
            <div className="not-prose my-6 border border-ink/15 bg-paper p-5">
              <dl className="grid grid-cols-2 gap-3 text-sm">
                <dt>השקעה חד־פעמית</dt><dd className="font-mono font-bold">{nis(homeOneTime)}</dd>
                <dt>רזרבה ל־{HOME_SERVICE_EXAMPLE.reserveMonths} חודשי הוצאות</dt><dd className="font-mono font-bold">{nis(homeReserve)}</dd>
                <dt className="border-t border-ink/15 pt-3 font-bold">תקציב פתיחה בדוגמה</dt><dd className="border-t border-ink/15 pt-3 font-mono font-bold">{nis(homeOpeningBudget)}</dd>
              </dl>
            </div>
            <p>
              הדוגמה אינה כוללת מסים, משיכת מחיה, עלות זמן של בעל העסק או רכיב שלא הופיע
              בקלט. בעסק שמקבל תשלום באיחור, הרזרבה צריכה לשקף גם את ימי האשראי ללקוחות.
            </p>

            <h2 id="premises-example" className="scroll-mt-40">דוגמה 2: עסק עם מקום ומלאי</h2>
            <p>
              גם כאן מדובר בקלט המחשה בלבד. מטרת הדוגמה היא להראות מדוע עסק עם חוזה,
              התאמות ומלאי דורש הפרדה בין כסף שננעל לפני הפתיחה לבין ההוצאה החודשית.
            </p>
            <h3>השקעה חד־פעמית</h3>
            <BudgetTable items={PREMISES_EXAMPLE.oneTime} totalLabel="סך השקעה חד־פעמית" />
            <h3>עלות חודשית</h3>
            <BudgetTable items={PREMISES_EXAMPLE.monthly} totalLabel="סך הוצאה חודשית בדוגמה" />
            <div className="not-prose my-6 border border-ink/15 bg-paper p-5">
              <dl className="grid grid-cols-2 gap-3 text-sm">
                <dt>השקעה חד־פעמית</dt><dd className="font-mono font-bold">{nis(premisesOneTime)}</dd>
                <dt>רזרבה ל־{PREMISES_EXAMPLE.reserveMonths} חודשי הוצאות</dt><dd className="font-mono font-bold">{nis(premisesReserve)}</dd>
                <dt className="border-t border-ink/15 pt-3 font-bold">תקציב פתיחה בדוגמה</dt><dd className="border-t border-ink/15 pt-3 font-mono font-bold">{nis(premisesOpeningBudget)}</dd>
              </dl>
            </div>
            <p>
              לא נכללו שכר עובדים, עלות מעסיק, מסים, חידוש מלאי או משיכת מחיה. אם אלה
              דרושים לעסק, מוסיפים אותם במפורש ולא מסתירים אותם בתוך סעיף ״שונות״.
              אחרי בניית התקציב אפשר לבדוק את ההשפעה באמצעות{' '}
              <Link href="/tools/break-even">מחשבון נקודת האיזון</Link>.
            </p>

            <h2 id="checklist" className="scroll-mt-40">צ׳קליסט לפני שמוציאים כסף</h2>
            <ol>
              <li>מגדירים פעילות, לקוחות, אופן גבייה ומועד ההכנסה הראשונה.</li>
              <li>בוחרים סיווג ומבנה רק אחרי בדיקת <Link href="/compare/osek-patur-vs-murshe">עוסק פטור מול עוסק מורשה</Link> והאם חברה בכלל נדרשת.</li>
              <li>בודקים רישוי, שימוש בנכס ומגבלות ענפיות לפני חתימה והזמנת ציוד.</li>
              <li>אוספים לפחות הצעה מפורטת לכל רכיב מהותי ומשווים על בסיס אותה תכולה.</li>
              <li>מפרידים בטבלה בין חד־פעמי, חודשי, מלאי, פיקדונות ומסים.</li>
              <li>בונים תרחיש חלש: מכירות נמוכות יותר, גבייה מאוחרת או פתיחה שנדחית.</li>
              <li>משאירים רזרבה שמתאימה למחזור הגבייה ולסיכון, ולא למספר כללי מהאינטרנט.</li>
            </ol>
            <p>
              להמשך התהליך ראו <Link href="/self-employed/opening-business">פתיחת עסק ברשויות — סדר הפעולות והמסמכים</Link>,{' '}
              <Link href="/self-employed/invoices">חשבוניות וקבלות בתחילת הפעילות</Link> ו
              <Link href="/self-employed/hourly-rate">תמחור שעת עבודה שמכסה את עלויות העסק</Link>.
            </p>
            <p className="text-sm text-ink/65">
              הדוגמאות בעמוד מיועדות להמחיש שיטת עבודה בלבד. הן אינן הצעת מחיר, תחזית
              הכנסות, ייעוץ מס, ייעוץ משפטי או קביעה שהוצאה מסוימת מותרת בניכוי. העלויות,
              הרישוי והמסמכים משתנים לפי ענף, רשות מקומית, מבנה משפטי והצעות הספקים.
            </p>
          </div>
        }
        faq={<FAQ items={faqItems} />}
        sources={
          <ul className="space-y-3 text-sm text-ink/75">
            <li><a className="underline" href={SOURCES.exemptOpening}>רשות המסים — פתיחת תיק עוסק פטור באינטרנט</a></li>
            <li><a className="underline" href={SOURCES.licensedOpening}>רשות המסים — פתיחת תיק עוסק מורשה, טופס 821</a></li>
            <li><a className="underline" href={SOURCES.companyRegistration}>רשות התאגידים — בקשה לרישום חברה</a></li>
            <li><a className="underline" href={SOURCES.companyFee}>רשות התאגידים — אגרה שנתית לחברה או לשותפות</a></li>
            <li><a className="underline" href={SOURCES.businessLicense}>משרד הפנים — בקשה לרישיון עסק והכנה להגשה</a></li>
            <li><a className="underline" href={SOURCES.preliminaryLicenseReview}>משרד הבריאות — חוות דעת מקדמית בנושא רישוי עסק</a></li>
            <li><a className="underline" href={SOURCES.nationalInsurance}>המוסד לביטוח לאומי — פתיחת תיק עצמאי בתהליך הדיגיטלי</a></li>
          </ul>
        }
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
    </>
  );
}
