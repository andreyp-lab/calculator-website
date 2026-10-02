import type { Metadata } from 'next';
import Link from 'next/link';
import { AuthorBox } from '@/components/calculator/AuthorBox';
import { Breadcrumbs } from '@/components/calculator/Breadcrumbs';
import { CourseCTA } from '@/components/marketing/CourseCTA';
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';

const PAGE_PATH = '/business/working-capital-guide';
const SITE_URL = 'https://cheshbonai.co.il';
const PUBLISHED_AT = '2026-10-02';

export const metadata: Metadata = {
  title: { absolute: 'הון חוזר בעסק — חישוב, ניתוח וניהול תזרים | חשבונאי' },
  description:
    'מדריך שמרני להון חוזר: נוסחת החישוב, סיווג נכסים והתחייבויות שוטפים, מחזור המרת מזומן ודוגמאות מספריות שקופות.',
  alternates: { canonical: PAGE_PATH },
  openGraph: {
    title: 'הון חוזר בעסק — חישוב, ניתוח וניהול תזרים',
    description:
      'איך לחשב הון חוזר ולנתח לקוחות, מלאי, ספקים ופערי עיתוי — ללא ספי קסם או הבטחות.',
    type: 'article',
    locale: 'he_IL',
    url: PAGE_PATH,
    images: ['/opengraph-image'],
  },
};

const sources = [
  {
    label: 'IFRS Foundation — IAS 1: Presentation of Financial Statements',
    href: 'https://www.ifrs.org/issued-standards/list-of-standards/ias-1-presentation-of-financial-statements.html/',
  },
  {
    label: 'IAS 1 — הטקסט הרשמי, לרבות סעיפים 66–69 בנושא סיווג שוטף',
    href: 'https://www.ifrs.org/content/dam/ifrs/publications/pdf-standards/english/2022/issued/part-a/ias-1-presentation-of-financial-statements.pdf?bypass=on',
  },
  {
    label: 'U.S. SEC — Beginner’s Guide to Financial Statements',
    href: 'https://www.sec.gov/about/reports-publications/beginners-guide-financial-statements',
  },
  {
    label: 'FDIC Money Smart for Small Business — Managing Cash Flow',
    href: 'https://www.fdic.gov/consumer-resource-center/mssb-m10-pg.pdf',
  },
  {
    label: 'ACCA — Working capital management',
    href: 'https://www.accaglobal.com/gb/en/student/exam-support-resources/fundamentals-exams-study-resources/f9/technical-articles/wcm.html',
  },
  {
    label: 'הקרן להלוואות בערבות מדינה — מסמכים ומידע רשמי',
    href: 'https://govextra.gov.il/newgloans/documents/',
  },
];

export default function WorkingCapitalGuidePage() {
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'הון חוזר בעסק — חישוב, ניתוח וניהול תזרים',
    description:
      'מדריך מעשי ושמרני לחישוב הון חוזר, הבנת הרכבו וניתוח מחזור המרת המזומן.',
    inLanguage: 'he-IL',
    datePublished: PUBLISHED_AT,
    dateModified: PUBLISHED_AT,
    author: {
      '@type': 'Person',
      name: 'אנדרי פלטונוב',
      jobTitle: 'רואה חשבון',
      url: `${SITE_URL}/about`,
    },
    publisher: {
      '@type': 'Organization',
      name: 'חשבונאי',
      url: SITE_URL,
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/brand-logo.svg`, width: 512, height: 512 },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE_URL}${PAGE_PATH}` },
  };

  return (
    <div className="min-h-screen bg-paper" dir="rtl">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <BreadcrumbSchema
        items={[
          { name: 'דף הבית', url: '/' },
          { name: 'עסקים', url: '/business' },
          { name: 'מדריך הון חוזר', url: PAGE_PATH },
        ]}
      />

      <article className="mx-auto max-w-4xl px-4 py-8 sm:py-12">
        <Breadcrumbs
          items={[
            { label: 'דף הבית', href: '/' },
            { label: 'עסקים', href: '/business' },
            { label: 'הון חוזר' },
          ]}
        />

        <header className="border-b border-ink/15 pb-8 pt-8">
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.14em] text-gold">
            מדריך ניהולי לעסקים
          </p>
          <h1 className="font-serif text-4xl leading-tight text-ink sm:text-5xl">
            הון חוזר בעסק: חישוב, ניתוח וניהול פערי העיתוי
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-ink/75">
            הון חוזר הוא תמונת מצב מאזנית. כדי לנהל נזילות צריך לבדוק גם מתי לקוחות משלמים,
            מתי מלאי נמכר ומתי התחייבויות נפרעות — ולא להסתפק במספר יחיד.
          </p>
          <p className="mt-4 font-mono text-xs text-ink/55">נבדק ועודכן: 2 באוקטובר 2026</p>
        </header>

        <section aria-labelledby="quick-answer" className="my-8 border-r-4 border-gold bg-cream-2 p-6">
          <h2 id="quick-answer" className="font-serif text-2xl text-ink">
            תשובה מהירה
          </h2>
          <p className="mt-3 leading-7 text-ink/80">
            הון חוזר מחושב בדרך כלל כך: נכסים שוטפים פחות התחייבויות שוטפות. גם ה־SEC מציג
            נוסחה זו במדריך הרשמי לדוחות כספיים. תוצאה חיובית אינה הוכחה אוטומטית לנזילות
            טובה, ותוצאה שלילית אינה מספיקה לבדה לאבחון עסק: צריך לבדוק את הרכב הסעיפים,
            מועדי המימוש והפירעון, עונתיות ומסגרות מימון זמינות.
          </p>
          <p className="mt-3 font-mono text-base text-ink">הון חוזר = נכסים שוטפים − התחייבויות שוטפות</p>
        </section>

        <div className="space-y-12 text-ink/80">
          <section aria-labelledby="classification">
            <h2 id="classification" className="font-serif text-3xl text-ink">
              קודם מסווגים נכון, אחר כך מחשבים
            </h2>
            <p className="mt-4 leading-7">
              לפי IAS 1, הסיווג כשוטף מתייחס בין היתר למחזור התפעולי הרגיל, להחזקה למסחר,
              למימוש או פירעון הצפויים בתוך 12 חודשים, ולמזומן שאינו מוגבל לשימוש בתקופה
              הרלוונטית. לנכס ולהתחייבות יש מבחני סיווג נפרדים, והניסוח המלא נמצא בסעיפים
              66–69 לתקן. יש ליישם את מסגרת הדיווח שחלה בפועל על הישות, ולא להניח ש־IFRS חל
              על כל עסק.
            </p>
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <div className="border border-ink/15 bg-white p-5">
                <h3 className="font-serif text-xl text-ink">נכסים שוטפים — דוגמאות אפשריות</h3>
                <ul className="mt-3 list-disc space-y-2 pr-5 leading-7 marker:text-gold">
                  <li>מזומן ושווי מזומן, בכפוף לסיווג החל</li>
                  <li>יתרות לקוחות וחייבים שוטפים</li>
                  <li>מלאי</li>
                  <li>תשלומים מראש ונכסים שוטפים אחרים</li>
                </ul>
              </div>
              <div className="border border-ink/15 bg-white p-5">
                <h3 className="font-serif text-xl text-ink">התחייבויות שוטפות — דוגמאות אפשריות</h3>
                <ul className="mt-3 list-disc space-y-2 pr-5 leading-7 marker:text-gold">
                  <li>ספקים וזכאים שוטפים</li>
                  <li>חלויות שוטפות של אשראי, לפי תנאיו וסיווגו</li>
                  <li>שכר והתחייבויות לעובדים</li>
                  <li>מסים והתחייבויות שוטפות אחרות</li>
                </ul>
              </div>
            </div>
            <p className="mt-4 text-sm leading-6 text-ink/65">
              הרשימות הן דוגמאות בלבד. סעיף מסוים עשוי לדרוש פיצול בין שוטף ללא־שוטף או טיפול
              שונה בהתאם לעובדות ולכללי הדיווח.
            </p>
          </section>

          <section aria-labelledby="balance-example">
            <h2 id="balance-example" className="font-serif text-3xl text-ink">
              דוגמה מאזנית שקופה
            </h2>
            <p className="mt-4 leading-7">
              כל הסכומים בדוגמה הם להמחשה בלבד ליום מסוים, ואינם נתוני אמת או המלצה על מבנה
              הון רצוי.
            </p>
            <div className="mt-6 overflow-x-auto border border-ink/15 bg-white">
              <table className="w-full min-w-[34rem] text-right text-sm">
                <thead className="bg-cream-2 text-ink">
                  <tr><th className="px-4 py-3">נכסים שוטפים</th><th className="px-4 py-3">סכום</th><th className="px-4 py-3">התחייבויות שוטפות</th><th className="px-4 py-3">סכום</th></tr>
                </thead>
                <tbody className="divide-y divide-ink/10">
                  <tr><td className="px-4 py-3">מזומן</td><td className="px-4 py-3 font-mono">70,000 ₪</td><td className="px-4 py-3">ספקים</td><td className="px-4 py-3 font-mono">80,000 ₪</td></tr>
                  <tr><td className="px-4 py-3">לקוחות</td><td className="px-4 py-3 font-mono">90,000 ₪</td><td className="px-4 py-3">חלויות שוטפות של הלוואה</td><td className="px-4 py-3 font-mono">35,000 ₪</td></tr>
                  <tr><td className="px-4 py-3">מלאי</td><td className="px-4 py-3 font-mono">60,000 ₪</td><td className="px-4 py-3">התחייבויות שוטפות אחרות</td><td className="px-4 py-3 font-mono">25,000 ₪</td></tr>
                  <tr className="font-semibold text-ink"><td className="px-4 py-3">סה״כ</td><td className="px-4 py-3 font-mono">220,000 ₪</td><td className="px-4 py-3">סה״כ</td><td className="px-4 py-3 font-mono">140,000 ₪</td></tr>
                </tbody>
              </table>
            </div>
            <div className="mt-5 border-r-4 border-gold bg-cream-2 p-5 font-mono text-sm leading-7">
              <p>הון חוזר: 220,000 − 140,000 = 80,000 ₪</p>
              <p>יחס שוטף: 220,000 ÷ 140,000 ≈ 1.57</p>
            </div>
            <p className="mt-4 leading-7">
              היחס הוא תיאור של הדוגמה, לא ציון ולא סף אישור לאשראי. אם 50,000 ₪ מיתרת
              הלקוחות צפויים להיגבות רק בעוד 45 יום, בעוד 40,000 ₪ לספקים נדרשים בעוד 10
              ימים, עלול להיווצר פער מזומן זמני גם כשההון החוזר חיובי. תחזית תזרים לפי תאריכים
              נדרשת כדי לראות את הפער.
            </p>
          </section>

          <section aria-labelledby="operating-cycle">
            <h2 id="operating-cycle" className="font-serif text-3xl text-ink">
              מחזור המרת מזומן: שכבת ניתוח נוספת
            </h2>
            <p className="mt-4 leading-7">
              חומר ההדרכה של FDIC מציג את מחזור המרת המזומן כסכום ימי המלאי וימי הלקוחות,
              פחות ימי הספקים. גם ACCA מדגישה שהמחזור תלוי באופי העסק; אין מספר אחיד שמתאים
              לכל מודל פעילות.
            </p>
            <div className="mt-6 space-y-3 border border-ink/15 bg-white p-6 font-mono text-sm leading-7">
              <p>ימי מלאי: 60,000 ÷ 360,000 × 365 ≈ 60.8 ימים</p>
              <p>ימי לקוחות: 90,000 ÷ 720,000 × 365 ≈ 45.6 ימים</p>
              <p>ימי ספקים: 80,000 ÷ 360,000 × 365 ≈ 81.1 ימים</p>
              <p className="border-t border-ink/15 pt-3 font-semibold text-ink">
                מחזור המרת מזומן: 60.8 + 45.6 − 81.1 ≈ 25.3 ימים
              </p>
            </div>
            <p className="mt-4 text-sm leading-6 text-ink/65">
              בדוגמה נעשה שימוש בעלות מכר שנתית של 360,000 ₪ ובמכירות אשראי נטו של 720,000
              ₪, בהתאם לנוסחאות ההמחשה בחומר FDIC. בפועל חשוב להשתמש בהגדרות עקביות; בניתוחים
              מסוימים ימי ספקים מחושבים לפי רכישות באשראי כאשר הנתון זמין. התוצאה אינה יעד
              ואינה מבטיחה זמינות מזומן.
            </p>
          </section>

          <section aria-labelledby="management">
            <h2 id="management" className="font-serif text-3xl text-ink">
              פעולות ניהול שאפשר לבחון
            </h2>
            <ul className="mt-5 list-disc space-y-3 pr-6 leading-7 marker:text-gold">
              <li>להפיק דוח גיול לקוחות ולעקוב אחר חשבוניות לפי מועד פירעון מוסכם.</li>
              <li>להוציא מסמכים ולבקש מקדמות או אבני דרך רק בהתאם להסכם ולדין החל.</li>
              <li>לנתח מלאי איטי, זמני אספקה ונקודות הזמנה בלי לפגוע ביכולת לספק ללקוחות.</li>
              <li>להשוות תנאי ספקים ולנהל מו״מ, בלי לאחר בניגוד להסכם.</li>
              <li>למקם על ציר זמן שכר, מסים, החזרי אשראי והוצאות עונתיות.</li>
              <li>להפריד בין פער עיתוי זמני לבין הפסד תפעולי שחוזר מדי חודש.</li>
            </ul>
            <p className="mt-5 leading-7">
              אפשר לבנות את לוח התקבולים והתשלומים ב
              <Link href="/tools/cash-flow" className="font-medium text-gold underline underline-offset-4">
                כלי תזרים המזומנים לעסק
              </Link>
              , ולבחון את השפעת המכירות והעלויות ב
              <Link href="/tools/budget" className="font-medium text-gold underline underline-offset-4">
                כלי התקציב ורווח והפסד
              </Link>
              . הכלים הם אמצעי תכנון ואינם מאמתים יתרות חשבונאיות.
            </p>
          </section>

          <section aria-labelledby="finance" className="border border-ink/15 bg-cream-2 p-6">
            <h2 id="finance" className="font-serif text-3xl text-ink">
              לפני שמממנים את הפער
            </h2>
            <p className="mt-4 leading-7">
              אשראי יכול לגשר על עיתוי, אך הוא יוצר עלות והתחייבות להחזר. לפני החלטה יש למפות
              את סכום הפער ואת משכו, לבדוק תרחישי גבייה, ולהשוות ריבית, עמלות, בטוחות, לוח
              סילוקין ותנאי פירעון מוקדם במסמכים המחייבים של כל הצעה. הלוואה אינה מתקנת לבדה
              פעילות שמפסידה באופן מתמשך.
            </p>
            <p className="mt-4 leading-7">
              מסלול בערבות מדינה אינו אישור אוטומטי: באתר הרשמי מפורסמים מסמכים נדרשים ומטרות
              מימון, ובהם גם צורך בהון חוזר. לבדיקת אפשרויות אפשר לקרוא את
              <Link href="/tools/loan-eligibility" className="font-medium text-gold underline underline-offset-4">
                המדריך לבדיקת זכאות להלוואה
              </Link>
              , ולאחר מכן לאמת את התנאים והמסמכים מול הגורם המממן והאתר הרשמי.
            </p>
          </section>

          <section aria-labelledby="monthly-check">
            <h2 id="monthly-check" className="font-serif text-3xl text-ink">
              בדיקה חודשית קצרה
            </h2>
            <ol className="mt-5 list-decimal space-y-3 pr-6 leading-7 marker:font-semibold marker:text-gold">
              <li>התאימו יתרות לקוחות וספקים לכרטסות ולמסמכים.</li>
              <li>בדקו גיל יתרות, מחלוקות, זיכויים ויתרות שאינן צפויות להיגבות או להיפרע כרגיל.</li>
              <li>ספרו או בקרו מלאי לפי השיטה הנהוגה ובדקו מלאי איטי או פגום.</li>
              <li>עדכנו חלויות אשראי, התחייבויות לעובדים ומועדי תשלום צפויים.</li>
              <li>בנו תחזית מזומן לפי תאריכים והשוו את התחזית לביצוע בפועל.</li>
              <li>תעדו שינויי הנחות וסיווגים כדי שההשוואה בין חודשים תהיה עקבית.</li>
            </ol>
          </section>

          <section aria-labelledby="sources">
            <h2 id="sources" className="font-serif text-3xl text-ink">
              מקורות מקצועיים ורשמיים
            </h2>
            <ul className="mt-5 space-y-3">
              {sources.map((source) => (
                <li key={source.href}>
                  <a
                    href={source.href}
                    target="_blank"
                    rel="noreferrer"
                    className="text-gold underline underline-offset-4 hover:text-ink"
                  >
                    {source.label}
                  </a>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm leading-6 text-ink/60">
              מקורות מארצות הברית ומ־ACCA מובאים לעקרונות ניהוליים ונוסחאות בלבד, לא כהוראת
              דין בישראל. סיווג ודיווח בישראל צריכים להיבדק לפי הישות והמסגרת החלות עליה.
            </p>
          </section>

          <section aria-label="המשך לימוד">
            <CourseCTA path={PAGE_PATH} courseId="cfo" placement="business" />
          </section>

          <AuthorBox />

          <aside className="border border-ink/15 bg-cream-2 p-5 text-sm leading-6 text-ink/65">
            המידע כללי ולימודי בלבד ואינו ייעוץ חשבונאי, מס, משפטי, אשראי או השקעות. לפני
            סיווג יתרה, נטילת מימון או החלטה מהותית יש לבדוק את הנתונים, ההסכמים והדין החלים
            עם בעל מקצוע מוסמך.
          </aside>
        </div>
      </article>
    </div>
  );
}
