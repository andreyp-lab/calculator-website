import type { Metadata } from 'next';
import Link from 'next/link';
import { AuthorBox } from '@/components/calculator/AuthorBox';
import { Breadcrumbs } from '@/components/calculator/Breadcrumbs';
import { CourseCTA } from '@/components/marketing/CourseCTA';
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';

const PAGE_PATH = '/business/business-credit-preparation';
const SITE_URL = 'https://cheshbonai.co.il';

const SOURCES = {
  fundDocuments: 'https://govextra.gov.il/newgloans/documents/',
  documentSelector:
    'https://www.gov.il/he/departments/dynamiccollectors/submission-suitable-documents',
  stateGuaranteedLoans: 'https://www.sba.org.il/hb/AidPrograms/Pages/pr10.aspx',
  businessPlan: 'https://www.sba.org.il/hb/Guides/articles/Pages/ar7.aspx',
  creditData:
    'https://www.boi.org.il/bank-of-israel/about/banks_functions/management-credit-data/',
} as const;

export const metadata: Metadata = {
  title: 'איך להתכונן לבקשת אשראי עסקי — מסמכים ונתונים',
  description:
    'רשימת הכנה לבקשת אשראי עסקי: דוחות, תזרים, התחייבויות, מטרת המימון ושאלות שכדאי לברר מול נותן האשראי — ללא תחזית אישור או זכאות.',
  alternates: { canonical: PAGE_PATH },
  openGraph: {
    title: 'איך להתכונן לבקשת אשראי עסקי',
    description:
      'מארגנים מסמכים ונתונים, בודקים התאמות ומציגים את מטרת המימון — בלי להבטיח זכאות או אישור.',
    type: 'article',
    locale: 'he_IL',
    siteName: 'חשבונאי',
    url: PAGE_PATH,
    images: ['/opengraph-image'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'איך להתכונן לבקשת אשראי עסקי',
    description: 'צ׳קליסט זהיר להכנת מסמכים ונתונים לפני פנייה לנותן אשראי.',
    images: ['/opengraph-image'],
  },
};

const preparationRows = [
  {
    area: 'זיהוי ומבנה העסק',
    prepare: 'פרטי התאגדות או עוסק, בעלי העסק ומורשי החתימה, לפי מה שהמממן מבקש.',
    check: 'שהשמות, מספרי הזיהוי ופרטי החשבון תואמים למסמכים הרשמיים.',
  },
  {
    area: 'תוצאות כספיות',
    prepare: 'דוחות כספיים, דוחות רווח והפסד, שומות או מאזן בוחן — לפי סוג העסק והתקופה שנדרשה.',
    check: 'שהתקופות ברורות ושאפשר להסביר שינויים חריגים, בלי לשנות או לייפות נתונים.',
  },
  {
    area: 'חשבונות והתחייבויות',
    prepare: 'דפי חשבון, ריכוז יתרות, פירוט הלוואות ולוחות סילוקין עדכניים, אם נדרשו.',
    check: 'שאין התחייבות שנשמטה ושיתרות החוב תואמות למועד הפקת המסמך.',
  },
  {
    area: 'מטרת המימון',
    prepare: 'תיאור השימוש בכסף, מועד השימוש והצעות מחיר או אסמכתאות להשקעה, לפי העניין.',
    check: 'שהסכום המבוקש נגזר מצורך מתועד ולא ממספר עגול ללא פירוט.',
  },
  {
    area: 'תחזית ותזרים',
    prepare: 'תחזית תקבולים ותשלומים שמפרידה בין פעילות שוטפת, השקעה ומימון.',
    check: 'שההנחות מסומנות כהנחות ושיש גם תרחיש חלש יותר, לא רק תרחיש יעד.',
  },
] as const;

export default function BusinessCreditPreparationPage() {
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'איך להתכונן לבקשת אשראי עסקי',
    description:
      'מדריך להכנת מסמכים ונתונים לפני בקשת אשראי עסקי, ללא קביעת זכאות או תחזית אישור.',
    inLanguage: 'he-IL',
    datePublished: '2026-10-02',
    dateModified: '2026-10-02',
    image: `${SITE_URL}/opengraph-image`,
    articleSection: 'ניהול פיננסי לעסקים',
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE_URL}${PAGE_PATH}` },
    author: {
      '@type': 'Person',
      name: 'אנדרי פלטונוב',
      url: `${SITE_URL}/about`,
      jobTitle: 'רואה חשבון',
    },
    publisher: {
      '@type': 'Organization',
      name: 'חשבונאי',
      url: SITE_URL,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/brand-logo.svg`,
        width: 512,
        height: 512,
      },
    },
  };

  return (
    <main className="min-h-screen bg-cream" dir="rtl">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <BreadcrumbSchema
        items={[
          { name: 'דף הבית', url: '/' },
          { name: 'מדריכי הקמת עסק', url: '/business' },
          { name: 'הכנה לבקשת אשראי עסקי', url: PAGE_PATH },
        ]}
      />

      <article className="mx-auto max-w-4xl px-4 py-8">
        <div className="mb-6">
          <Breadcrumbs
            items={[
              { label: 'דף הבית', href: '/' },
              { label: 'הקמת עסק', href: '/business' },
              { label: 'הכנה לבקשת אשראי עסקי' },
            ]}
          />
        </div>

        <header className="mb-8 border-b border-ink/15 pb-6">
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.14em] text-gold">
            {'// '}מדריך הכנה פיננסית ✦
          </p>
          <h1 className="mb-4 text-3xl font-bold text-ink md:text-4xl">
            איך להתכונן לבקשת אשראי עסקי
          </h1>
          <p className="text-lg leading-relaxed text-ink/75">
            המטרה היא להגיע לשיחה עם נתונים מסודרים, מסמכים עדכניים והסבר ברור לצורך העסקי.
            המדריך אינו בודק זכאות, אינו חוזה אישור ואינו קובע אילו תנאים יוצעו לעסק מסוים.
          </p>
          <p className="mt-4 font-mono text-xs uppercase tracking-[0.12em] text-gold">
            עודכן לאחרונה: <time dateTime="2026-10-02">02.10.2026</time>
          </p>
        </header>

        <section
          className="answer-box mb-10 border-r-4 border-gold bg-cream-2 p-5"
          aria-label="תשובה מהירה"
        >
          <p className="leading-relaxed text-ink/85">
            <strong>כדי להתכונן לבקשת אשראי עסקי,</strong> הגדירו בכתב למה נדרש המימון,
            מתי ישמש ומהו הסכום שמגובה בתקציב או בהצעות מחיר. רכזו את הדוחות הכספיים,
            נתוני החשבון, פירוט ההלוואות וההתחייבויות, מסמכי המס ותחזית התזרים שביקש נותן
            האשראי. ודאו שאותם סכומים ותקופות מופיעים באופן עקבי בכל המסמכים והכינו הסבר
            להנחות ולשינויים חריגים. אין רשימת מסמכים אחידה לכל גוף, והכנה מלאה אינה מבטיחה
            אישור: כל נותן אשראי רשאי לבקש השלמות ולבחון את הבקשה לפי מדיניותו והמידע שבפניו.
          </p>
        </section>

        <div className="prose prose-lg max-w-none text-ink leading-relaxed">
          <h2>מתחילים מהצורך, לא מההלוואה</h2>
          <p>
            לפני איסוף הקבצים, כתבו פסקה קצרה שמסבירה את מטרת הבקשה. האם הכסף מיועד לרכישת
            ציוד, להקמת פעילות, להון חוזר בתקופה מוגדרת או לגישור על פער בין תשלום לספקים לבין
            גבייה מלקוחות? הפרידו בין שימוש חד־פעמי לבין הוצאה שוטפת, ורשמו את מועד התשלום
            הצפוי לכל רכיב.
          </p>
          <p>
            סכום הבקשה צריך להתחבר למסמכים: הצעות מחיר, תקציב השקעה או תחזית תזרים. אין צורך
            להציג תחזית כאילו היא ודאית. סמנו מה מבוסס על חוזה או הזמנה, מה מבוסס על היסטוריה
            ומה עדיין בגדר הנחה.
          </p>

          <h2>אילו מסמכים ונתונים כדאי לרכז?</h2>
          <p>
            הדרישה המדויקת נקבעת בידי נותן האשראי והמסלול. כדוגמה רשמית, אתר הקרן להלוואות
            בערבות המדינה מפרסם רשימה מצטברת: מסמכי בסיס, ולצדם מסמכים לפי סוג העסק, מטרת
            ההלוואה ומאפייני הבקשה. זו רשימת ייחוס שימושית להכנה, אך היא אינה רשימת חובה אחידה
            לכל בנק או גוף חוץ־בנקאי.
          </p>

          <div className="not-prose my-6 overflow-x-auto">
            <table className="w-full min-w-[760px] border border-ink/15 bg-paper text-right text-sm">
              <thead className="bg-cream-2">
                <tr>
                  <th scope="col" className="p-3">תחום</th>
                  <th scope="col" className="p-3">מה מכינים לפי הדרישה</th>
                  <th scope="col" className="p-3">מה בודקים לפני ההגשה</th>
                </tr>
              </thead>
              <tbody>
                {preparationRows.map((row) => (
                  <tr key={row.area} className="border-t border-ink/15 align-top">
                    <th scope="row" className="p-3 font-bold">{row.area}</th>
                    <td className="p-3 text-ink/75">{row.prepare}</td>
                    <td className="p-3 text-ink/75">{row.check}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p>
            ברשימה הרשמית של הקרן מופיעים, לפי נסיבות הבקשה, דפי עו״ש, ריכוז יתרות, פירוט
            הלוואות, לוחות סילוקין של אשראי חוץ־בנקאי, דוחות כספיים או דוחות רווח והפסד,
            שומות ומאזן בוחן. בבקשות השקעה או הקמה עשויים להתבקש גם תוכנית עסקית, הצעות מחיר
            ומסמכים הנוגעים להשקעה. בדקו את הרשימה המעודכנת סמוך להגשה; אל תניחו שמסמך שהיה
            מספיק בעבר עדיין מספיק.
          </p>

          <h2>בונים תזרים שמסביר את הצורך</h2>
          <p>
            תחזית תזרים אינה הבטחה. היא מסמך עבודה שמציג מתי כסף צפוי להיכנס ולצאת ומהן
            ההנחות. התחילו מיתרת הפתיחה, הוסיפו תקבולים לפי מועדי גבייה סבירים ותשלומים לפי
            המועדים החוזיים או הצפויים. הפרידו את קבלת האשראי ואת החזריו מפעילות העסק, כדי שלא
            להציג מימון כהכנסה תפעולית.
          </p>
          <p>
            כדאי להכין גם תרחיש חלש יותר — למשל גבייה מאוחרת או מכירות נמוכות מהתכנון — בלי
            לקבוע מהו ״סף״ שהבנק יקבל. אפשר לארגן את הנתונים באמצעות{' '}
            <Link href="/tools/cash-flow">כלי תזרים המזומנים</Link>. הכלי מסייע לסדר תרחיש
            שהזנתם; הוא אינו מעריך אם בקשת האשראי תאושר.
          </p>

          <h2>מתאימים בין הדוחות, החשבון והבקשה</h2>
          <p>
            עברו על דוח הרווח וההפסד, המאזן או המאזן הבוחן ועל נתוני החשבון לאותה תקופה.
            ההבדלים אינם בהכרח טעות: מכירה יכולה להירשם לפני הגבייה, רכישת ציוד אינה תמיד
            הוצאה מיידית בדוח, והחזר קרן הלוואה אינו הוצאה תפעולית. עם זאת, חשוב להיות מסוגלים
            להסביר את הפערים במסמכים תומכים.
          </p>
          <p>
            <Link href="/tools/financial-analysis">כלי הניתוח הפיננסי</Link> יכול לעזור לארגן
            יחסים ונתונים מתוך הדוחות שהוזנו. התוצאה היא המחשה חשבונאית בלבד; היא אינה דירוג
            אשראי של בנק ואינה מחליפה בדיקה של רואה חשבון או של נותן האשראי.
          </p>

          <h2>מרכזים את כל ההתחייבויות הקיימות</h2>
          <p>
            הכינו רשימה אחת של הלוואות, מסגרות, אשראי חוץ־בנקאי וערבויות רלוונטיות שנדרשו
            בבקשה, עם יתרה, מועד סיום ותשלום תקופתי לפי המסמכים העדכניים. אין להסתיר התחייבות
            או לבחור תאריך שמציג תמונה חלקית. כאשר נדרש מידע על בעלי העסק או ערבים, פועלים לפי
            טופס ההסכמה וההנחיות של הגוף המממן.
          </p>
          <p>
            בנק ישראל מסביר שמערכת נתוני האשראי אוספת מידע על התחייבויות אשראי של יחידים ועל
            אופן פירעונן. בתקנון הקרן בערבות המדינה מופיעה גם בדיקת דוח אשראי של העסק והערבים
            כחלק מהליך הבקשה. מידע זה אינו מאפשר להסיק מראש אם הבקשה תאושר.
          </p>

          <h2>מכינים תקציר קצר לפגישה</h2>
          <ul>
            <li><strong>מטרת המימון:</strong> מה נרכש או איזה פער תזרימי ממומן.</li>
            <li><strong>סכום ומועד:</strong> איך הסכום חושב ומתי כל חלק צפוי לשמש.</li>
            <li><strong>מקור הנתונים:</strong> אילו נתונים היסטוריים ואילו הנחות שימשו בתחזית.</li>
            <li><strong>אירועים חריגים:</strong> שינוי במחזור, הוצאה חד־פעמית או לקוח מהותי שדורשים הסבר.</li>
            <li><strong>שאלות למממן:</strong> ריבית, עמלות, בטוחות, הצמדה, מועדי תשלום ותנאי פירעון מוקדם.</li>
          </ul>
          <p>
            בקשו הצעה כתובה וקראו את מלוא התנאים. מחיר האשראי ותנאי הבטוחות אינם נגזרים
            מרשימת המסמכים בלבד. השוואה בין הצעות צריכה להתייחס לאותו סכום, תקופה ומבנה
            החזר, ולא רק לתשלום הראשון או לכותרת השיווקית.
          </p>

          <div className="not-prose my-8 border border-ink/15 bg-paper p-6">
            <h2 className="mb-4 text-xl font-bold text-ink">בדיקה לפני שליחה</h2>
            <ul className="space-y-3 text-ink/80">
              <li>☐ התקבלה מנותן האשראי רשימת המסמכים העדכנית לבקשה המסוימת.</li>
              <li>☐ כל מסמך קריא, מלא ומופק לתאריך הנדרש.</li>
              <li>☐ הסכומים והתקופות תואמים בין הטופס, הדוחות והנספחים.</li>
              <li>☐ התחזית מפרידה בבירור בין נתון קיים לבין הנחה.</li>
              <li>☐ לא הוצגה תוצאה של כלי באתר כאישור, דירוג בנקאי או תחזית זכאות.</li>
              <li>☐ נשמר עותק של הבקשה ושל כל מסמך שנשלח.</li>
            </ul>
          </div>

          <h2>היכן בודקים מסלול ורשימת מסמכים?</h2>
          <p>
            אפשר להתחיל ב<Link href="/tools/loan-eligibility">מדריך מסלולי המימון</Link> כדי
            לארגן שאלות ולמצוא הפניות. גם כאן, הכלי אינו קובע זכאות. במסלול הקרן בערבות
            המדינה יש לבדוק באתר הרשמי את המסלול, רשימת המסמכים ותהליך ההגשה במועד הפנייה.
            הסוכנות לעסקים קטנים מציינת שהגוף המתאם בודק את תקינות המסמכים ואת נתוני העסק,
            ושהבקשה מועברת לבחינה לפי תהליך הקרן; עצם ההגשה או צירוף המסמכים אינם אישור.
          </p>
        </div>

        <CourseCTA path={PAGE_PATH} courseId="cfo" placement="business" />

        <section className="mb-10 text-sm leading-relaxed text-ink/75">
          <h2 className="mb-4 text-xl font-bold text-ink">מקורות רשמיים</h2>
          <ul className="list-disc space-y-3 pr-5">
            <li>
              <a className="text-gold underline" href={SOURCES.fundDocuments} target="_blank" rel="noopener noreferrer">
                הקרן להלוואות בערבות המדינה — רשימת מסמכים עדכנית לפי סוג הבקשה ↗
              </a>
            </li>
            <li>
              <a className="text-gold underline" href={SOURCES.documentSelector} target="_blank" rel="noopener noreferrer">
                משרד האוצר — מסמכים מותאמים להגשה לפי מאפייני העסק וההלוואה ↗
              </a>
            </li>
            <li>
              <a className="text-gold underline" href={SOURCES.stateGuaranteedLoans} target="_blank" rel="noopener noreferrer">
                הסוכנות לעסקים קטנים ובינוניים — מידע על הלוואות בערבות המדינה ותהליך הבדיקה ↗
              </a>
            </li>
            <li>
              <a className="text-gold underline" href={SOURCES.businessPlan} target="_blank" rel="noopener noreferrer">
                הסוכנות לעסקים קטנים ובינוניים — מטרת תוכנית עסקית והכנת נתונים כספיים ↗
              </a>
            </li>
            <li>
              <a className="text-gold underline" href={SOURCES.creditData} target="_blank" rel="noopener noreferrer">
                בנק ישראל — מערכת נתוני האשראי והמידע הנכלל בה ↗
              </a>
            </li>
          </ul>
        </section>

        <aside className="mb-10 border-r-4 border-gold bg-cream-2 p-5 text-sm leading-relaxed text-ink/75">
          <strong className="text-ink">חשוב:</strong> המדריך מסייע בהכנת מידע ומסמכים בלבד.
          הוא אינו ייעוץ אשראי אישי, אינו קובע זכאות ואינו מנבא החלטת בנק, קרן או נותן אשראי.
          הדרישות, העלויות, הבטוחות והתנאים נקבעים בכל בקשה לגופה ועשויים להשתנות. לפני חתימה
          בדקו את מסמכי ההצעה והתייעצו לפי הצורך עם רואה חשבון, עורך דין או יועץ מורשה מתאים.
        </aside>

        <section className="mb-8">
          <AuthorBox />
        </section>
      </article>
    </main>
  );
}
