import type { Metadata } from 'next';
import Link from 'next/link';
import { AuthorBox } from '@/components/calculator/AuthorBox';
import { Breadcrumbs } from '@/components/calculator/Breadcrumbs';
import { DisclaimerBox } from '@/components/calculator/DisclaimerBox';
import { CourseCTA } from '@/components/marketing/CourseCTA';
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';

const SITE_URL = 'https://cheshbonai.co.il';
const PAGE_PATH = '/self-employed/first-90-days';
const LAST_UPDATED = '2026-10-02';

const OFFICIAL_SOURCES = {
  exemptRegistration:
    'https://www.gov.il/he/service/request-open-exempt-dealer-via-internet',
  licensedRegistration: 'https://www.gov.il/he/service/vat-821',
  nationalInsuranceRegistration:
    'https://www.btl.gov.il/Insurance/National%20Insurance/type_list/Self_Employed/Pages/howtoregister.aspx',
  nationalInsuranceAdvances:
    'https://www.btl.gov.il/Insurance/National%20Insurance/type_list/Self_Employed/Pages/tikun.aspx',
  incomeTaxAdvances: 'https://www.gov.il/he/service/itc-payment-online-incometax',
  incomeTaxAdvanceReduction: 'https://www.gov.il/he/service/itc-2216a',
  vatReports: 'https://www.gov.il/he/service/reporting-or-payment-of-vat-reports',
  withholdingAndBooks: 'https://www.gov.il/he/service/itc-gmishurim',
  vatLaw: 'https://www.btl.gov.il/Laws1/00_0022_000000.pdf',
  taxGuide:
    'https://www.gov.il/BlobFolder/generalpage/income-tax-guide-knowyourright/he/Guides_IncomeTax_da-2025.pdf',
} as const;

export const metadata: Metadata = {
  title: { absolute: '90 הימים הראשונים אחרי פתיחת עוסק | חשבונאי' },
  description:
    'תכנית עבודה שמרנית ל-90 הימים הראשונים אחרי פתיחת עוסק: אימות תיקים, מסמכים, מע״מ, מקדמות, ביטוח לאומי, הוצאות ושגרת בקרה.',
  alternates: { canonical: `${SITE_URL}${PAGE_PATH}` },
  openGraph: {
    title: '90 הימים הראשונים אחרי פתיחת עוסק',
    description:
      'צ׳קליסט מעשי לעצמאי חדש: מה לבדוק בשבועיים הראשונים, בחודש הראשון ועד סוף היום ה-90.',
    type: 'article',
    locale: 'he_IL',
    url: PAGE_PATH,
    siteName: 'חשבונאי',
    images: ['/opengraph-image'],
  },
  twitter: {
    card: 'summary_large_image',
    title: '90 הימים הראשונים אחרי פתיחת עוסק',
    description: 'תכנית עבודה שמרנית לרישום, מסמכים, דיווחים ובקרה בעסק חדש.',
    images: ['/opengraph-image'],
  },
};

function OfficialSource({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="font-medium text-gold underline decoration-gold/40 underline-offset-4 hover:text-ink"
    >
      {children} ↗
    </a>
  );
}

export default function FirstNinetyDaysPage() {
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: '90 הימים הראשונים אחרי פתיחת עוסק',
    description:
      'תכנית עבודה מעשית ושמרנית לעצמאי חדש: אימות רישום, מסמכים, דיווחים, מקדמות, הוצאות ובקרה.',
    inLanguage: 'he-IL',
    datePublished: '2026-10-02',
    dateModified: LAST_UPDATED,
    author: {
      '@type': 'Person',
      name: 'אנדרי פלטונוב',
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
    image: `${SITE_URL}/opengraph-image`,
    url: `${SITE_URL}${PAGE_PATH}`,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_URL}${PAGE_PATH}`,
    },
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
          { name: 'עצמאיים', url: '/self-employed' },
          { name: '90 הימים הראשונים אחרי פתיחת עוסק', url: PAGE_PATH },
        ]}
      />

      <article className="mx-auto max-w-3xl px-4 py-8">
        <div className="mb-6">
          <Breadcrumbs
            items={[
              { label: 'דף הבית', href: '/' },
              { label: 'עצמאיים', href: '/self-employed' },
              { label: '90 הימים הראשונים' },
            ]}
          />
        </div>

        <header className="mb-8">
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.14em] text-gold">
            {'// '}מדריך מעשי לעצמאי חדש
          </p>
          <h1 className="mb-3 text-3xl font-bold text-ink md:text-4xl">
            90 הימים הראשונים אחרי פתיחת עוסק
          </h1>
          <p className="text-lg leading-relaxed text-ink/70">
            פתיחת התיק היא רק נקודת ההתחלה. בשלושת החודשים הראשונים צריך לוודא שהרישום נקלט,
            להקים שיטת מסמכים ותשלומים, לעקוב אחר ההכנסה בפועל ולתקן הנחות שהתבררו כלא נכונות.
            המדריך מסדר את העבודה בלי להמציא מועדים או שיעורי מס שאינם מופיעים בהודעות שלכם.
          </p>
          <p className="mt-3 text-sm text-ink/70">
            נכתב על ידי אנדרי פלטונוב, רו״ח · עודכן {LAST_UPDATED}
          </p>
        </header>

        <section className="mb-8 border border-gold/40 bg-cream-2 p-5" aria-labelledby="quick-answer">
          <p className="mb-2 font-mono text-xs uppercase tracking-[0.14em] text-gold">תשובה מהירה</p>
          <h2 id="quick-answer" className="mb-2 text-xl font-bold text-ink">
            מה עושים מיד אחרי פתיחת עוסק?
          </h2>
          <p className="text-sm leading-relaxed text-ink/80">
            קודם מאמתים שהרישום במע״מ, במס הכנסה ובביטוח הלאומי תואם לפעילות. אחר כך מגדירים
            אילו מסמכים מפיקים ומתי, מרכזים כל הכנסה והוצאה, ובודקים באזור האישי ובהודעות
            הרשויות אילו דיווחים ומקדמות נקבעו לתיק. במהלך 90 הימים משווים את הפעילות בפועל
            לתחזית ומבקשים תיקון כשיש פער מהותי. <strong>90 יום אינם מועד חוקי אחיד</strong> — זו
            מסגרת ניהולית; המועדים המחייבים הם אלה שנקבעו לתיק ובהודעות הרשות.
          </p>
        </section>

        <nav aria-label="תוכן עניינים" className="mb-10 border border-ink/15 bg-paper p-5">
          <p className="mb-3 font-bold text-ink">תכנית 90 הימים</p>
          <ol className="grid gap-2 text-sm text-ink/75 sm:grid-cols-2">
            <li><a className="hover:text-gold" href="#days-1-14">ימים 1–14: מאמתים תיקים</a></li>
            <li><a className="hover:text-gold" href="#days-15-30">ימים 15–30: בונים שגרה</a></li>
            <li><a className="hover:text-gold" href="#days-31-60">ימים 31–60: סוגרים חודש</a></li>
            <li><a className="hover:text-gold" href="#days-61-90">ימים 61–90: מתקנים תחזית</a></li>
            <li><a className="hover:text-gold" href="#calendar">לוח בקרה אישי</a></li>
            <li><a className="hover:text-gold" href="#sources">מקורות רשמיים</a></li>
          </ol>
        </nav>

        <div className="prose prose-lg max-w-none leading-relaxed text-ink">
          <section id="days-1-14" className="scroll-mt-40">
            <h2>ימים 1–14: מאמתים שהעסק באמת רשום</h2>
            <p>
              אל תניחו שטופס שנשלח הוא תיק שנפתח. שמרו את אישורי ההגשה, בדקו את פרטי העוסק,
              כתובת הפעילות, תאריך תחילת העיסוק ופרטי חשבון הבנק, וודאו שקיבלתם את פרטי הגישה
              הנדרשים לדיווח. אם נרשמתם כעוסק פטור, בדקו את סטטוס הבקשה בשירות המקוון; עוסק
              מורשה מקבל לאחר פתיחת התיק אישור רישום ופרטי גישה לדיווח מע״מ.
            </p>
            <p>
              מקורות רשמיים:{' '}
              <OfficialSource href={OFFICIAL_SOURCES.exemptRegistration}>
                פתיחת תיק עוסק פטור — רשות המסים
              </OfficialSource>{' '}
              וכן{' '}
              <OfficialSource href={OFFICIAL_SOURCES.licensedRegistration}>
                פתיחת תיק עוסק מורשה, טופס 821 — רשות המסים
              </OfficialSource>
              .
            </p>
            <p>
              בביטוח הלאומי יש לדווח על תחילת עבודה כעצמאי עם תחילת העבודה. אם פתחתם תיק
              בתהליך הדיגיטלי המשולב, בדקו שהבקשה הועברה ונקלטה; אם כבר פתחתם ברשות המסים בלבד,
              דף הביטוח הלאומי מפנה לדין וחשבון רב־שנתי. ההצהרה על היקף העבודה וההכנסה הצפויה
              משפיעה על המעמד, התשלום ובנסיבות מסוימות גם על זכויות לקצבאות.
            </p>
            <p>
              מקור רשמי:{' '}
              <OfficialSource href={OFFICIAL_SOURCES.nationalInsuranceRegistration}>
                פתיחת תיק עצמאי — הביטוח הלאומי
              </OfficialSource>
              .
            </p>

            <h3>צ׳קליסט אימות</h3>
            <ul>
              <li>אישור רישום וסיווג במע״מ תואמים למה שביקשתם.</li>
              <li>תיק מס הכנסה מופיע באזור האישי והודעות התיק נשמרות.</li>
              <li>המעמד בביטוח הלאומי, היקף העבודה וההכנסה הצפויה נקלטו נכון.</li>
              <li>פרטי הקשר וחשבון הבנק מעודכנים בכל רשות רלוונטית.</li>
              <li>כל אישור נשמר בתיקייה אחת, לצד תאריך ההגשה והתגובה שהתקבלה.</li>
            </ul>
            <p>
              אם עדיין לא ברור מהו הסיווג שלכם או מה נפתח בכל רשות, חזרו ל
              <Link href="/self-employed/opening-business">מדריך פתיחת עסק עצמאי</Link> לפני
              הפקת המסמך הראשון.
            </p>
          </section>

          <section id="days-15-30" className="scroll-mt-40">
            <h2>ימים 15–30: בונים שגרת מסמכים ותשלומים</h2>
            <p>
              בשלב הזה המטרה אינה לבחור תוכנה נוצצת, אלא ליצור מסלול שאפשר לשחזר: הצעת מחיר או
              הזמנה, מסמך העסקה המתאים, תיעוד התקבול ושיוך ההוצאה למסמך. סוג המסמך תלוי במעמד
              העוסק, בסוג העסקה ובמועד החיוב; עוסק פטור אינו מוציא חשבונית מס. לכן אין להעתיק
              תהליך מעסק אחר בלי לבדוק את הסיווג שלכם.
            </p>
            <p>
              מקור רשמי:{' '}
              <OfficialSource href={OFFICIAL_SOURCES.vatLaw}>
                חוק מס ערך מוסף — נוסח רשמי
              </OfficialSource>
              .
            </p>
            <p>
              עברו על{' '}
              <Link href="/self-employed/invoices">מדריך החשבוניות והקבלות</Link>, הגדירו סדר
              מסמכים קבוע ובדקו עם המייצג או ספק התוכנה שהמערכת מתאימה להוראות ניהול הספרים
              החלות על העסק. מידע על אישורי ניהול ספרים וניכוי מס במקור ניתן לבדיקה בשירות
              הרשמי של רשות המסים.
            </p>
            <p>
              מקור רשמי:{' '}
              <OfficialSource href={OFFICIAL_SOURCES.withholdingAndBooks}>
                מידע על אישורי ניכוי מס במקור וניהול ספרים — רשות המסים
              </OfficialSource>
              .
            </p>

            <h3>אל תחשבו את המקדמות לבד לפי אחוז כללי</h3>
            <p>
              מקדמות מס הכנסה משולמות על ידי בעלי תיק שנדרשו במקדמות, לפי הדרישה בתיק. דמי
              הביטוח הם מערכת נפרדת, ומע״מ הוא דיווח נפרד נוסף. שמרו את ההודעות שקיבלתם והכניסו
              ליומן רק את מועדי הדיווח והתשלום שנקבעו לכם — לא תאריך שמצאתם בדוגמה כללית.
            </p>
            <p>
              מקורות רשמיים:{' '}
              <OfficialSource href={OFFICIAL_SOURCES.incomeTaxAdvances}>
                דיווח ותשלום מקדמות מס הכנסה — רשות המסים
              </OfficialSource>{' '}
              וכן{' '}
              <OfficialSource href={OFFICIAL_SOURCES.vatReports}>
                דיווח ותשלום דוחות מע״מ — רשות המסים
              </OfficialSource>
              . להרחבה ראו גם <Link href="/self-employed/tax-advances">מדריך מקדמות לעצמאי</Link>{' '}
              ו<Link href="/self-employed/vat">מדריך המע״מ</Link>.
            </p>
          </section>

          <section id="days-31-60" className="scroll-mt-40">
            <h2>ימים 31–60: סוגרים חודש ראשון שאפשר להסביר</h2>
            <p>
              בסוף החודש הראשון התאימו בין תנועות הבנק והאשראי לבין המסמכים. סמנו תקבולים שלא
              הופק להם המסמך המתאים, הוצאות ללא מסמך, לקוחות שטרם שילמו ותשלומים עתידיים לרשויות.
              המטרה היא לא רק יתרה נכונה, אלא שרשרת תיעוד שאפשר להסביר גם בעוד שנה.
            </p>

            <h3>בדיקת הוצאות בלי קיצורי דרך</h3>
            <p>
              עצם התשלום אינו הופך הוצאה למותרת בניכוי, וחשבונית מס אינה הופכת שימוש פרטי
              לשימוש עסקי. מס הכנסה ומע״מ בוחנים תנאים שונים; אצל עוסק פטור אין ניכוי מס תשומות.
              מיינו הוצאות לפי מה שנרכש ולשם מה, שמרו את המסמך ואת הוכחת התשלום, והפרידו רכישות
              פרטיות או מעורבות לבחינה פרטנית. אל תבחרו אחוז עסקי שרירותי.
            </p>
            <p>
              מקור רשמי:{' '}
              <OfficialSource href={OFFICIAL_SOURCES.taxGuide}>
                מדריך רשות המסים ״דע את זכויותיך וחובותיך״
              </OfficialSource>
              . להסבר מעשי ראו <Link href="/self-employed/allowed-expenses">הוצאות מוכרות לעצמאי</Link>.
            </p>

            <div className="not-prose my-6 overflow-x-auto">
              <table className="w-full border border-ink/15 text-sm">
                <thead className="bg-cream-2 text-right">
                  <tr>
                    <th className="border-b border-ink/15 p-3">בדיקה</th>
                    <th className="border-b border-ink/15 p-3">מה צריך לצאת ממנה</th>
                  </tr>
                </thead>
                <tbody className="text-ink/75">
                  <tr>
                    <td className="border-b border-ink/15 p-3 font-medium text-ink">הכנסות</td>
                    <td className="border-b border-ink/15 p-3">רשימת עסקאות, תקבולים ומסמכים תואמת</td>
                  </tr>
                  <tr className="bg-cream-2/40">
                    <td className="border-b border-ink/15 p-3 font-medium text-ink">הוצאות</td>
                    <td className="border-b border-ink/15 p-3">מסמך, תשלום, הסבר עסקי וסימון הוצאה מעורבת</td>
                  </tr>
                  <tr>
                    <td className="border-b border-ink/15 p-3 font-medium text-ink">לקוחות וספקים</td>
                    <td className="border-b border-ink/15 p-3">יתרות פתוחות ומועדי תשלום צפויים</td>
                  </tr>
                  <tr className="bg-cream-2/40">
                    <td className="p-3 font-medium text-ink">רשויות</td>
                    <td className="p-3">הודעות, תקופות דיווח ותשלומים צפויים לפי התיק</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section id="days-61-90" className="scroll-mt-40">
            <h2>ימים 61–90: מחליפים את ההערכות בנתונים</h2>
            <p>
              עכשיו כבר קיימת היסטוריה קצרה. השוו מחזור, רווח משוער, שעות עבודה ותזרים בפועל
              למה שהצהרתם בעת הפתיחה. חודש או חודשיים אינם תחזית שנתית מושלמת, אבל הם יכולים
              לחשוף פער ברור — למשל פעילות נמוכה בהרבה מהמתוכנן או לקוח חדש שמגדיל את המחזור.
            </p>
            <p>
              אם ההכנסה השתנתה, בדקו את מסלולי התיקון הרשמיים ואל תפסיקו לשלם על דעת עצמכם.
              רשות המסים מפעילה שירות לבקשה להקטנת מקדמות מס הכנסה. בביטוח הלאומי ניתן לבקש
              תיקון מקדמות בתנאים המפורטים בדף השירות, בצירוף מסמכים תומכים; לעדכון שם עשויה
              להיות השפעה גם על בסיס זכויות מסוימות.
            </p>
            <p>
              מקורות רשמיים:{' '}
              <OfficialSource href={OFFICIAL_SOURCES.incomeTaxAdvanceReduction}>
                בקשה להקטנת מקדמות מס הכנסה — רשות המסים
              </OfficialSource>{' '}
              וכן{' '}
              <OfficialSource href={OFFICIAL_SOURCES.nationalInsuranceAdvances}>
                תיקון מקדמות לעובד עצמאי — הביטוח הלאומי
              </OfficialSource>
              .
            </p>

            <h3>ארבע החלטות לסוף היום ה־90</h3>
            <ol>
              <li>
                <strong>האם הסיווג עדיין מתאים?</strong> בדקו את סוג הפעילות והמחזור בפועל מול
                תנאי הסיווג, בלי להמתין לסוף השנה אם נוצר פער ברור.
              </li>
              <li>
                <strong>האם המקדמות משקפות את העסק?</strong> משווים לנתונים ומגישים בקשה מסודרת
                כשנדרש; לא משנים תשלום באופן חד־צדדי.
              </li>
              <li>
                <strong>האם שיטת המסמכים מחזיקה?</strong> אם יש מסמכים חסרים או כפולים, מתקנים את
                התהליך לפני שהפער גדל.
              </li>
              <li>
                <strong>האם צריך ליווי?</strong> פעילות עם עובדים, יבוא, מלאי, עסקאות מורכבות או
                מעבר סיווג מצדיקה בדיקה מקצועית מותאמת.
              </li>
            </ol>
          </section>

          <section id="calendar" className="scroll-mt-40">
            <h2>לוח הבקרה האישי: מה מכניסים ליומן</h2>
            <p>
              אין לוח אחד שמתאים לכל עוסק. תקופת הדיווח במע״מ, דרישת המקדמות והחיובים בביטוח
              הלאומי נקבעים לפי התיק וההודעות. בנו לוח רק ממסמכים רשמיים שקיבלתם ומהאזור האישי:
            </p>
            <ul>
              <li>תקופת הדיווח והמועד שנקבעו למע״מ, אם אתם חייבים בדוח תקופתי.</li>
              <li>דרישת מקדמות מס הכנסה, אם הוצאה לכם דרישה.</li>
              <li>חיובי דמי ביטוח והמועד שמופיע בחשבון האישי או בדרישה.</li>
              <li>מועדי גבייה מלקוחות ותשלום לספקים — לצורך תזרים, לא כמועד מס.</li>
              <li>בדיקה חודשית של מסמכים ובדיקה רבעונית של התחזית מול הפעילות.</li>
            </ul>
            <p>
              אם הודעה אישית סותרת מדריך כללי, פועלים לפי ההודעה ובודקים את הסתירה מול הרשות או
              המייצג. אל תדחו דיווח בגלל שהעסק עדיין ״בהרצה״.
            </p>
          </section>

          <section>
            <h2>חמש טעויות שמסבכות עסק חדש</h2>
            <ul>
              <li>להתחיל לעבוד לפני שבודקים שהרישום והמעמד בביטוח הלאומי נקלטו.</li>
              <li>להוציא מסמך שאינו מתאים לסוג העוסק או למועד העסקה והתקבול.</li>
              <li>לערבב מס עסקאות, מקדמות מס הכנסה ודמי ביטוח כאילו הם אותו חיוב.</li>
              <li>לרשום כל תשלום כהוצאה עסקית בלי מסמך ובלי לבדוק שימוש פרטי או הוני.</li>
              <li>להתעלם מהודעות הרשות ולהסתמך על לוח כללי מהאינטרנט.</li>
            </ul>
          </section>
        </div>

        <section id="sources" className="mb-10 mt-12 border-t border-ink/15 pt-8">
          <h2 className="mb-4 text-xl font-bold text-ink">מקורות רשמיים</h2>
          <ul className="list-inside list-disc space-y-2 text-sm text-ink/70">
            <li><OfficialSource href={OFFICIAL_SOURCES.exemptRegistration}>פתיחת תיק עוסק פטור — רשות המסים</OfficialSource></li>
            <li><OfficialSource href={OFFICIAL_SOURCES.licensedRegistration}>פתיחת תיק עוסק מורשה — רשות המסים</OfficialSource></li>
            <li><OfficialSource href={OFFICIAL_SOURCES.nationalInsuranceRegistration}>פתיחת תיק עצמאי — הביטוח הלאומי</OfficialSource></li>
            <li><OfficialSource href={OFFICIAL_SOURCES.incomeTaxAdvances}>דיווח ותשלום מקדמות מס הכנסה — רשות המסים</OfficialSource></li>
            <li><OfficialSource href={OFFICIAL_SOURCES.incomeTaxAdvanceReduction}>בקשה להקטנת מקדמות מס הכנסה — רשות המסים</OfficialSource></li>
            <li><OfficialSource href={OFFICIAL_SOURCES.nationalInsuranceAdvances}>תיקון מקדמות — הביטוח הלאומי</OfficialSource></li>
            <li><OfficialSource href={OFFICIAL_SOURCES.vatReports}>דיווח ותשלום דוחות מע״מ — רשות המסים</OfficialSource></li>
            <li><OfficialSource href={OFFICIAL_SOURCES.vatLaw}>חוק מס ערך מוסף — נוסח רשמי</OfficialSource></li>
            <li><OfficialSource href={OFFICIAL_SOURCES.withholdingAndBooks}>אישורי ניכוי מס במקור וניהול ספרים — רשות המסים</OfficialSource></li>
            <li><OfficialSource href={OFFICIAL_SOURCES.taxGuide}>מדריך ״דע את זכויותיך וחובותיך״ — רשות המסים</OfficialSource></li>
          </ul>
          <p className="mt-4 text-xs leading-relaxed text-ink/60">
            המקורות נבדקו ביום {LAST_UPDATED}. בדפי השירות עצמם מצוין כי במקרה של סתירה הוראות
            הדין גוברות על דף המידע.
          </p>
        </section>

        <section className="mb-8">
          <CourseCTA path={PAGE_PATH} courseId="cpa" placement="self-employed" />
        </section>

        <section className="mb-8">
          <AuthorBox />
        </section>

        <DisclaimerBox text="המדריך הוא תכנית עבודה כללית ואינו ייעוץ מס, ביטוח לאומי או ייעוץ משפטי. 90 הימים הם מסגרת ניהולית ולא ארכה או מועד חוקי. החובות והמועדים נקבעים לפי סוג התיק, הפעילות וההודעות האישיות שקיבלתם מהרשויות; במקרה של ספק יש לבדוק מול הרשות או מייצג מוסמך." />
      </article>
    </div>
  );
}
