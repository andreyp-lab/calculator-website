import type { Metadata } from 'next';
import Link from 'next/link';
import { AuthorBox } from '@/components/calculator/AuthorBox';
import { Breadcrumbs } from '@/components/calculator/Breadcrumbs';
import { CourseCTA } from '@/components/marketing/CourseCTA';
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';

const PAGE_PATH = '/business/profit-and-loss-guide';
const SITE_URL = 'https://cheshbonai.co.il';
const PUBLISHED_AT = '2026-10-02';

export const metadata: Metadata = {
  title: { absolute: 'דוח רווח והפסד לעסק — מדריך קריאה ובנייה | חשבונאי' },
  description:
    'מדריך שמרני לדוח רווח והפסד לעסק: מבנה הדוח, דוגמה מספרית שקופה, ההבדל מתזרים מזומנים והצלבה לדיווח השנתי.',
  alternates: { canonical: PAGE_PATH },
  openGraph: {
    title: 'דוח רווח והפסד לעסק — מדריך קריאה ובנייה',
    description:
      'איך לקרוא דוח רווח והפסד, לחשב רווחיות ולבדוק את הנתונים — בלי לבלבל בין רווח, מס ומזומן.',
    type: 'article',
    locale: 'he_IL',
    url: PAGE_PATH,
    images: ['/opengraph-image'],
  },
};

const officialSources = [
  {
    label: 'רשות המסים — הגשת דוח מס שנתי ליחידים ובעלי עסקים (שנת המס 2025)',
    href: 'https://www.gov.il/he/service/reporting-and-payment-2025-annual-tax-report-for-individuals',
  },
  {
    label: 'רשות המסים — טופס 1320, נספח א׳: דו״ח רווח והפסד לבעלי עסק עצמאי',
    href: 'https://www.gov.il/BlobFolder/service/reporting-and-payment-2025-annual-tax-report-for-individuals/he/Service_Pages_Income_tax_annual-report-2026_1320-2025.pdf',
  },
  {
    label: 'IFRS Foundation — IAS 1: Presentation of Financial Statements',
    href: 'https://www.ifrs.org/issued-standards/list-of-standards/ias-1-presentation-of-financial-statements.html/',
  },
  {
    label: 'IFRS Foundation — IFRS 18 (תחולה מתקופות שנתיות המתחילות ב־1.1.2027)',
    href: 'https://www.ifrs.org/issued-standards/list-of-standards/ifrs-18-presentation-and-disclosure-in-financial-statements/',
  },
  {
    label: 'U.S. SEC — Beginner’s Guide to Financial Statements',
    href: 'https://www.sec.gov/about/reports-publications/beginners-guide-financial-statements',
  },
];

export default function ProfitAndLossGuidePage() {
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'דוח רווח והפסד לעסק — מדריך קריאה ובנייה',
    description:
      'מדריך מעשי ושמרני להבנת דוח רווח והפסד, כולל מבנה, דוגמה מספרית והבדלה מתזרים מזומנים.',
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
          { name: 'מדריך דוח רווח והפסד', url: PAGE_PATH },
        ]}
      />

      <article className="mx-auto max-w-4xl px-4 py-8 sm:py-12">
        <Breadcrumbs
          items={[
            { label: 'דף הבית', href: '/' },
            { label: 'עסקים', href: '/business' },
            { label: 'דוח רווח והפסד' },
          ]}
        />

        <header className="border-b border-ink/15 pb-8 pt-8">
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.14em] text-gold">
            מדריך ניהולי לעסקים
          </p>
          <h1 className="font-serif text-4xl leading-tight text-ink sm:text-5xl">
            דוח רווח והפסד לעסק: איך בונים, קוראים ובודקים
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-ink/75">
            הדוח מרכז הכנסות והוצאות לתקופה ומסייע להבין מה יצר את הרווח או ההפסד. הוא אינו
            תחזית מס, אינו מציג לבדו את מצב המזומן, ואינו מחליף דוח שנערך לפי כללי הדיווח
            החלים על העסק.
          </p>
          <p className="mt-4 font-mono text-xs text-ink/55">נבדק ועודכן: 2 באוקטובר 2026</p>
        </header>

        <section aria-labelledby="quick-answer" className="my-8 border-r-4 border-gold bg-cream-2 p-6">
          <h2 id="quick-answer" className="font-serif text-2xl text-ink">
            תשובה מהירה
          </h2>
          <p className="mt-3 leading-7 text-ink/80">
            דוח רווח והפסד מתאר ביצועים לאורך תקופה: מתחילים בהכנסות, מפחיתים עלויות והוצאות
            לפי הסיווג המתאים, ומגיעים לתוצאה לתקופה. דוח מאזן, לעומת זאת, מתאר נכסים
            והתחייבויות בנקודת זמן. יתרת הבנק אינה הרווח, משום שמועד ההכרה בהכנסה או בהוצאה
            עשוי להיות שונה ממועד התקבול או התשלום. ההבחנה בין דוחות לתקופה לבין מאזן לנקודת
            זמן מוסברת גם ב
            <a
              href="https://www.sec.gov/about/reports-publications/beginners-guide-financial-statements"
              target="_blank"
              rel="noreferrer"
              className="font-medium text-gold underline underline-offset-4"
            >
              מדריך הרשמי של ה־SEC
            </a>
            .
          </p>
        </section>

        <div className="space-y-12 text-ink/80">
          <section aria-labelledby="structure">
            <h2 id="structure" className="font-serif text-3xl text-ink">
              מבנה עבודה שימושי — לא תבנית אחידה לכל עסק
            </h2>
            <p className="mt-4 leading-7">
              לצורך ניהול פנימי אפשר להתחיל במבנה הבא. השמות, רמת הפירוט והסיווג בפועל תלויים
              במהות העסק, בשיטת ניהול הספרים ובמסגרת הדיווח שחלה עליו. IAS 1, למשל, עוסק
              בהצגת דוחות כספיים לפי IFRS; הוא אינו הופך כל טבלת ניהול פנימית לדוח כספי ערוך.
            </p>
            <div className="mt-6 overflow-x-auto border border-ink/15 bg-white">
              <table className="w-full min-w-[34rem] text-right text-sm">
                <thead className="bg-cream-2 text-ink">
                  <tr>
                    <th className="px-4 py-3 font-semibold">שורה</th>
                    <th className="px-4 py-3 font-semibold">שאלת הבקרה</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink/10">
                  <tr><td className="px-4 py-3">הכנסות</td><td className="px-4 py-3">האם כל ההכנסות שייכות לאותה תקופה?</td></tr>
                  <tr><td className="px-4 py-3">פחות: עלות מכר או עלויות ישירות</td><td className="px-4 py-3">האם העלות קשורה ישירות למוצרים או לשירותים שנמכרו?</td></tr>
                  <tr><td className="px-4 py-3 font-medium text-ink">רווח גולמי</td><td className="px-4 py-3">רלוונטי כאשר הצגה כזו מתאימה למודל העסקי ולדיווח.</td></tr>
                  <tr><td className="px-4 py-3">פחות: הוצאות תפעול</td><td className="px-4 py-3">האם ההוצאה שוטפת, חריגה או שייכת לתקופה אחרת?</td></tr>
                  <tr><td className="px-4 py-3 font-medium text-ink">רווח תפעולי</td><td className="px-4 py-3">מה נשאר מהפעילות לפני סעיפי מימון ומס?</td></tr>
                  <tr><td className="px-4 py-3">פחות/יותר: מימון וסעיפים אחרים</td><td className="px-4 py-3">האם הסיווג תואם את מסגרת הדיווח של העסק?</td></tr>
                  <tr><td className="px-4 py-3 font-medium text-ink">תוצאה לפני מס</td><td className="px-4 py-3">בסיס לניתוח בלבד — לא חישוב חבות המס.</td></tr>
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-sm leading-6 text-ink/65">
              IFRS 18 יחליף את IAS 1 לעניין הצגה וגילוי בתקופות שנתיות המתחילות ב־1 בינואר
              2027, עם אפשרות ליישום מוקדם. לכן אין להציג את דרישות IFRS 18 כחובה כללית שכבר
              חלה ב־2026; יש לבדוק איזו מסגרת דיווח חלה על הישות.
            </p>
          </section>

          <section aria-labelledby="example">
            <h2 id="example" className="font-serif text-3xl text-ink">
              דוגמה מספרית שקופה
            </h2>
            <p className="mt-4 leading-7">
              הדוגמה הבאה היא המחשה חודשית בלבד, בשקלים, לפני מס וללא קביעה לגבי טיפול במע״מ.
              היא אינה תחזית ואינה אמת מידה לענף כלשהו.
            </p>
            <div className="mt-6 border border-ink/15 bg-cream-2 p-6">
              <dl className="grid gap-3 sm:grid-cols-2">
                <div className="flex justify-between gap-4 border-b border-ink/10 pb-2"><dt>הכנסות</dt><dd className="font-mono">120,000 ₪</dd></div>
                <div className="flex justify-between gap-4 border-b border-ink/10 pb-2"><dt>עלות ישירה</dt><dd className="font-mono">45,000− ₪</dd></div>
                <div className="flex justify-between gap-4 border-b border-ink/10 pb-2 font-semibold text-ink"><dt>רווח גולמי</dt><dd className="font-mono">75,000 ₪</dd></div>
                <div className="flex justify-between gap-4 border-b border-ink/10 pb-2"><dt>הוצאות תפעול</dt><dd className="font-mono">52,000− ₪</dd></div>
                <div className="flex justify-between gap-4 border-b border-ink/10 pb-2 font-semibold text-ink"><dt>רווח תפעולי</dt><dd className="font-mono">23,000 ₪</dd></div>
                <div className="flex justify-between gap-4 border-b border-ink/10 pb-2"><dt>הוצאות מימון</dt><dd className="font-mono">3,000− ₪</dd></div>
                <div className="flex justify-between gap-4 font-semibold text-ink sm:col-span-2"><dt>תוצאה לפני מס</dt><dd className="font-mono">20,000 ₪</dd></div>
              </dl>
              <div className="mt-5 space-y-2 border-t border-ink/15 pt-5 font-mono text-sm">
                <p>שיעור רווח גולמי: 75,000 ÷ 120,000 = 62.5%</p>
                <p>שיעור רווח תפעולי: 23,000 ÷ 120,000 ≈ 19.2%</p>
              </div>
              <p className="mt-4 text-sm leading-6 text-ink/65">
                האחוזים מתארים את המספרים בדוגמה בלבד. הם אינם יעד, סף תקינות או הבטחת ביצועים.
              </p>
            </div>
          </section>

          <section aria-labelledby="cash">
            <h2 id="cash" className="font-serif text-3xl text-ink">
              למה רווח אינו יתרת מזומן
            </h2>
            <ul className="mt-5 list-disc space-y-3 pr-6 leading-7 marker:text-gold">
              <li>מכירה באשראי יכולה להיכלל בהכנסות לפני שהלקוח שילם, בהתאם לבסיס הדיווח החל.</li>
              <li>תשלום לספק יכול להתרחש בתקופה אחרת מזו שבה העלות מוכרת.</li>
              <li>רכישת נכס עשויה להיות מוצגת במאזן ולהשפיע על הרווח לאורך זמן דרך פחת, בהתאם לכללים החלים.</li>
              <li>קבלת הלוואה מגדילה מזומן אך אינה הכנסה; החזר קרן מקטין מזומן אך אינו בהכרח הוצאה בדוח רווח והפסד.</li>
            </ul>
            <p className="mt-4 leading-7">
              לכן בוחנים יחד את דוח הרווח וההפסד, המאזן ותנועות המזומן. לניהול מועדי התקבולים
              והתשלומים אפשר להשתמש ב
              <Link href="/tools/cash-flow" className="font-medium text-gold underline underline-offset-4">
                כלי תזרים המזומנים לעסק
              </Link>
              .
            </p>
          </section>

          <section aria-labelledby="reconcile">
            <h2 id="reconcile" className="font-serif text-3xl text-ink">
              בדיקת הדוח לפני שמסיקים מסקנות
            </h2>
            <ol className="mt-5 list-decimal space-y-3 pr-6 leading-7 marker:font-semibold marker:text-gold">
              <li>בחרו תקופה עקבית והשוו לתקופה מקבילה או לתקציב שנבנה באותה שיטה.</li>
              <li>התאימו הכנסות למסמכי המכירה ולכרטסות הלקוחות, ובדקו זיכויים וביטולים.</li>
              <li>התאימו רכישות, שכר והוצאות למסמכים ולכרטסות; בדקו כפילויות וחוסרים.</li>
              <li>בדקו יתרות לקוחות, ספקים, מלאי ורכוש קבוע — לא רק תנועות בנק וכרטיסי אשראי.</li>
              <li>סמנו אירועים חד־פעמיים ושינויי סיווג כדי שהשוואת התקופות לא תהיה מטעה.</li>
              <li>תעדו הנחות והתאמות ובקשו מאיש מקצוע לאשר טיפול חשבונאי או מסי שאינו ברור.</li>
            </ol>
            <p className="mt-5 leading-7">
              לבניית מעקב ניהולי אפשר להתחיל ב
              <Link href="/tools/budget" className="font-medium text-gold underline underline-offset-4">
                כלי תקציב ורווח והפסד
              </Link>
              , ולהצליב עם נקודת האיזון ב
              <Link href="/tools/break-even" className="font-medium text-gold underline underline-offset-4">
                מחשבון נקודת האיזון
              </Link>
              . תוצאת כלי אינה תחליף לרישומי הנהלת החשבונות.
            </p>
          </section>

          <section aria-labelledby="tax-report" className="border border-ink/15 bg-white p-6">
            <h2 id="tax-report" className="font-serif text-3xl text-ink">
              דוח ניהולי לעומת נספח רווח והפסד לדוח השנתי
            </h2>
            <p className="mt-4 leading-7">
              רשות המסים כוללת בשירות הדוח השנתי ליחידים ולבעלי עסקים את טופס 1320 — נספח א׳,
              דוח רווח והפסד לבעלי עסק עצמאי. בטופס מופיעים, בין היתר, מחזור, עלות מכירות
              והוצאות. בדף השירות מצוין שכאשר הנהלת הספרים מבוססת על שיטה שונה מבסיס הדיווח
              למס, יש לבצע את ההתאמות הנדרשות. לכן אין להעתיק דוח ניהולי לטופס מס בלי לבדוק
              התאמות, סיווגים והוראות לשנת המס הרלוונטית.
            </p>
            <p className="mt-4 text-sm leading-6 text-ink/65">
              הקישור לטופס ולשירות למטה מתייחס לשנת המס 2025, כפי שפורסם באתר רשות המסים.
              בכל הגשה יש להשתמש בטופס ובהנחיות של שנת המס הנכונה.
            </p>
          </section>

          <section aria-labelledby="questions">
            <h2 id="questions" className="font-serif text-3xl text-ink">
              שאלות ניהוליות שכדאי לשאול — בלי ספי קסם
            </h2>
            <ul className="mt-5 list-disc space-y-3 pr-6 leading-7 marker:text-gold">
              <li>האם שינוי ברווח נובע ממחיר, כמות, תמהיל מוצרים או עלות?</li>
              <li>האם שיעור הרווח חושב על בסיס עקבי בין התקופות?</li>
              <li>האם הוצאה חד־פעמית מוצגת בנפרד בניתוח, בלי להעלים אותה מהדיווח?</li>
              <li>האם רווח מדווח מתורגם לגבייה, או נשאר ביתרות לקוחות ובמלאי?</li>
            </ul>
            <p className="mt-4 leading-7">
              אין שיעור רווח אחד שמתאים לכל עסק. השוואה מועילה דורשת הגדרה עקבית, הקשר ענפי
              והבנה של מודל הפעילות — ולא הבטחה על בסיס אחוז בודד.
            </p>
          </section>

          <section aria-labelledby="sources">
            <h2 id="sources" className="font-serif text-3xl text-ink">
              מקורות מקצועיים ורשמיים
            </h2>
            <ul className="mt-5 space-y-3">
              {officialSources.map((source) => (
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
              המקורות מספקים עקרונות וטפסים. המסגרת החשבונאית, בסיס הדיווח והוראות המס שיש
              להחיל נקבעים לפי סוג הישות, נסיבותיה ושנת הדיווח.
            </p>
          </section>

          <section aria-label="המשך לימוד">
            <CourseCTA path={PAGE_PATH} courseId="cfo" placement="business" />
          </section>

          <AuthorBox />

          <aside className="border border-ink/15 bg-cream-2 p-5 text-sm leading-6 text-ink/65">
            המידע כללי ולימודי בלבד ואינו ייעוץ חשבונאי, מס, משפטי או השקעות. לפני דיווח,
            שינוי שיטת רישום או החלטה מהותית יש לבדוק את הנתונים והדין החלים עם בעל מקצוע
            מוסמך.
          </aside>
        </div>
      </article>
    </div>
  );
}
