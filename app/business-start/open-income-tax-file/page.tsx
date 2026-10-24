import type { Metadata } from 'next';
import Link from 'next/link';
import { AuthorBox } from '@/components/calculator/AuthorBox';
import { Breadcrumbs } from '@/components/calculator/Breadcrumbs';
import { DisclaimerBox } from '@/components/calculator/DisclaimerBox';
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';

const SITE_URL = 'https://cheshbonai.co.il';
const PAGE_PATH = '/business-start/open-income-tax-file';
const LAST_UPDATED = '2026-10-24';
const guide = {
  "slug": "open-income-tax-file",
  "title": "פתיחת תיק במס הכנסה לעצמאי: מה להכין ומה לבדוק",
  "short": "פתיחת תיק מס הכנסה",
  "description": "סדר פעולות לפתיחת תיק עצמאי במס הכנסה: נתוני פעילות, טופס מתאים, מקדמות, אישורים ובדיקות לאחר הקליטה.",
  "eyebrow": "רישום במס הכנסה",
  "answerTitle": "איך ניגשים לפתיחת תיק במס הכנסה?",
  "answer": "מרכזים פרטים אישיים ועסקיים, מתארים את מקורות ההכנסה ואת הפעילות הצפויה, משתמשים בשירות או בטופס העדכני המתאים ומוודאים שהתיק נקלט. לאחר הפתיחה בודקים אם נקבעו מקדמות, אילו אישורים הופקו ומהן חובות הדיווח האישיות — בלי להניח ששיעור או מועד של עסק אחר חל גם עליכם.",
  "intro": "מס הכנסה עוסק בהכנסה וברווח החייב, ולא רק במחזור המכירות. כבר בשלב הפתיחה נדרשת תמונה סבירה של הפעילות ומקורות ההכנסה. המטרה כאן היא לא לחשב מס אישי, אלא להכין תיק מסודר ולזהות את ההודעות שדורשות טיפול.",
  "sections": [
    {
      "heading": "מכינים תמונת הכנסה מלאה",
      "paragraphs": [
        "רשמו את תאריך תחילת הפעילות, תיאור העיסוק, מקום העסק, מחזור והכנסה צפויים, וכן הכנסות נוספות של התא המשפחתי ככל שהטופס מבקש. אל תבלבלו בין מחזור, שהוא סך העסקאות, לבין רווח, שהוא תוצאה לאחר הוצאות בהתאם לדין. התחזית היא בסיס עבודה וצריך להיות אפשר להסביר כיצד נבנתה.",
        "טופס 5329 הרשמי כולל פרטים אישיים והצהרה על מקורות הכנסה ויכול לשמש בפתיחת תיק עצמאי או ניכויים לפי הנסיבות. מסלולים מקוונים מסוימים משלבים פתיחת מע״מ ומס הכנסה. בחרו את המסלול לפי דף השירות העדכני והמבנה המשפטי, ואל תשתמשו בטופס ישן שהורד בעבר."
      ],
      "bullets": [
        "פרטי זהות וכתובת עדכניים",
        "תיאור הפעילות ותאריך התחלה",
        "תחזית מחזור והכנסה עם הנחות",
        "פרטי מקום העסק, חשבון והתקשרויות לפי הנדרש"
      ]
    },
    {
      "heading": "בודקים מה נפתח ומה נקבע",
      "paragraphs": [
        "אחרי ההגשה שמרו אישור ומספר פנייה. ודאו שהתיק מופיע באזור האישי ושהפרטים נכונים. חפשו הודעות על מקדמות, פנקסים, אישורי ניכוי מס במקור או דרישות נוספות. אין לקבוע לעצמכם שיעור מקדמה מתוך מדריך כללי; עובדים לפי הדרישה בתיק ופונים לתיקון כאשר התחזית השתנתה באופן מהותי.",
        "פתיחת תיק אינה סוף התהליך. יש לחבר בין התיק לבין שיטת הנהלת החשבונות, מסמכי ההכנסה וההוצאה והדוח השנתי. הגדירו מי אוסף מסמכים, מי מבצע התאמה ומי עוקב אחרי הודעות. אם אתם גם שכירים, בעלי נכסים או שותפים, ודאו שמקורות ההכנסה מוצגים למייצג."
      ]
    },
    {
      "heading": "מקדמות, ניכוי במקור ואישורים",
      "paragraphs": [
        "מקדמות הן תשלומים במהלך השנה על חשבון המס הצפוי, אך אופן החישוב והדרישה משתנים. ניכוי מס במקור הוא מנגנון אחר שבו לקוח או משלם עשוי לנכות סכום מהתשלום לפי האישור החל. אל תערבבו בין השניים ואל תבטיחו ללקוח אישור שלא הופק.",
        "בדקו את האישורים במערכות הרשמיות ושמרו עותק עדכני. כאשר לקוח מבקש אישור, שלחו את המסמך הרלוונטי ולא צילום ישן. אם התוצאה העסקית שונה מהתחזית, פנו בשירות המתאים או דרך מייצג לבחינת שינוי; אין להפסיק תשלום על דעת עצמכם."
      ]
    },
    {
      "heading": "שגרת מעקב לשנה הראשונה",
      "paragraphs": [
        "אחת לחודש השוו הכנסות, הוצאות ורווח משוער לתחזית הפתיחה. רשמו התחייבויות שטרם שולמו ושמרו סכום ייעודי לתשלומי רשויות לפי הערכה מקצועית. יתרת הבנק אינה רווח פנוי משום שחלקה עשוי להיות מיועד למע״מ, מקדמות, ספקים או השקעה חוזרת.",
        "אחת לרבעון לפחות עברו על הודעות התיק, הרשאות הגישה והמסמכים החסרים. לקראת סוף השנה הכינו התאמות מלאי, רכוש ויתרות לפי סוג העסק ובהנחיית המייצג. לוח הבקרה צריך להתבסס על התיק שלכם, לא על תאריך גנרי במאמר."
      ]
    },
    {
      "heading": "איך לעבוד עם המדריך בלי לנחש",
      "paragraphs": [
        "הפרידו בין שלושה סוגי מידע: כלל חוקי שמופיע במקור רשמי, דרישה פרטנית שנמסרה לעסק שלכם, והחלטה ניהולית שאתם קובעים לעצמכם. כלל רשמי בודקים בדף השירות או בדין; דרישה פרטנית מאמתים באזור האישי, במכתב או מול הרשות; והחלטה ניהולית מתעדים כך שאפשר יהיה לשנות אותה. ההפרדה הזו מונעת מצב שבו המלצה כללית הופכת בטעות לחובה, או שבו דוגמה של עסק אחר מועתקת לעסק עם פעילות שונה.",
        "שמרו תיק פתיחה אחד ובו אישורי הגשה, מסמכי זיהוי, הסכמים, התכתבויות, החלטות ותאריכי בדיקה. ליד כל פעולה כתבו מי אחראי, מה הטריגר לביצוע ומה נחשב השלמה. אין צורך להמציא תאריך אחיד אם הרשות לא קבעה כזה; מכניסים ליומן את המועד שמופיע בהודעה האישית ומוסיפים תזכורת פנימית מוקדמת. אם פרט מהותי משתנה, כמו כתובת, שותף, עובד, סוג פעילות או תחזית הכנסה, בודקים אילו רשויות וספקים צריכים עדכון.",
        "לפני שליחה, קנייה או חתימה שאלו ארבע שאלות: מה המטרה, מהו המקור שעליו הסתמכנו, איזה מסמך מוכיח שביצענו, ומי בודק שהתוצאה נקלטה. טופס שנשלח אינו בהכרח תיק שנפתח, ובקשה לרישיון אינה רישיון. בדומה לכך, הצעת מחיר שנשלחה אינה תקבול והחלטה לפתוח חשבון אינה תחליף לבדיקת תנאי הבנק. נקודת הבקרה האחרונה חשובה לא פחות מהפעולה עצמה."
      ],
      "bullets": [
        "לא מעתיקים סכומים, מועדים או רשימות מסמכים ממדריך ישן בלי אימות עדכני.",
        "לא מציגים הצעת ספק כעלות קבועה; מבקשים הצעה כתובה ומשווים היקף שירות.",
        "לא מסתמכים על זיכרון: שומרים אישור, צילום מסך או מספר פנייה במקום מסודר.",
        "כשיש ספק מהותי, פונים לרשות הרלוונטית או לבעל מקצוע מוסמך לפני פעולה."
      ]
    }
  ],
  "faq": [
    {
      "q": "האם פתיחת עוסק פטור כוללת גם מס הכנסה?",
      "a": "השירות המקוון הרשמי לעוסק פטור מיועד לפתיחת תיק במע״מ ובמס הכנסה, אך יש לוודא שהבקשה נקלטה בכל מערכת."
    },
    {
      "q": "מה ההבדל בין מחזור לרווח?",
      "a": "מחזור הוא סך העסקאות; רווח מחושב לאחר הוצאות בהתאם לכללים. מס הכנסה אינו נקבע רק לפי יתרת הבנק."
    },
    {
      "q": "האם מקדמות הן המס הסופי?",
      "a": "לא בהכרח. הן תשלומים במהלך השנה, והחבות הסופית נקבעת לפי הנתונים והדיווח הרלוונטי."
    },
    {
      "q": "אפשר לפתוח תיק לבד?",
      "a": "קיימים שירותים וטפסים רשמיים. כאשר המבנה או מקורות ההכנסה מורכבים, כדאי לקבל ייעוץ פרטני."
    }
  ],
  "sources": [
    {
      "href": "https://www.gov.il/he/pages/income-tax-guide-open-business?chapterIndex=7",
      "label": "מדריך מס הכנסה לפתיחת עסק — רשות המסים"
    },
    {
      "href": "https://www.gov.il/BlobFolder/service/itc5329/he/Service_Pages_Income_tax_itc5329.pdf",
      "label": "טופס 5329 — רשות המסים"
    },
    {
      "href": "https://www.gov.il/he/service/request-open-exempt-dealer-via-internet",
      "label": "פתיחת תיק עוסק פטור במערכי המס — רשות המסים"
    }
  ],
  "related": [
    {
      "href": "/self-employed/opening-business",
      "label": "המדריך לפתיחת עסק עצמאי"
    },
    {
      "href": "/self-employed/tax-advances",
      "label": "מקדמות מס לעצמאים"
    },
    {
      "href": "/self-employed/withholding-tax",
      "label": "ניכוי מס במקור"
    },
    {
      "href": "/self-employed/allowed-expenses",
      "label": "הוצאות מוכרות לעצמאים"
    },
    {
      "href": "/self-employed/first-90-days",
      "label": "90 הימים הראשונים אחרי פתיחת עוסק"
    },
    {
      "href": "/self-employed/business-finance",
      "label": "ניהול כספים לעסק קטן"
    }
  ],
  "disclaimer": "המידע כללי ואינו ייעוץ מס או תחליף לבדיקה אישית. פתיחת התיק, המקדמות, האישורים וחובת הדיווח תלויים בנתוני הנישום ובהודעות רשות המסים."
} as const;

export const metadata: Metadata = {
  title: { absolute: guide.title + ' | חשבונאי' },
  description: guide.description,
  alternates: { canonical: SITE_URL + PAGE_PATH },
  openGraph: { title: guide.title, description: guide.description, type: 'article', locale: 'he_IL', url: PAGE_PATH, siteName: 'חשבונאי', images: ['/opengraph-image'] },
  twitter: { card: 'summary_large_image', title: guide.title, description: guide.description, images: ['/opengraph-image'] },
};

export default function Page() {
  const articleSchema = { '@context': 'https://schema.org', '@type': 'Article', headline: guide.title, description: guide.description, inLanguage: 'he-IL', datePublished: LAST_UPDATED, dateModified: LAST_UPDATED, author: { '@type': 'Person', name: 'אנדרי פלטונוב', jobTitle: 'רואה חשבון' }, publisher: { '@type': 'Organization', name: 'חשבונאי', url: SITE_URL }, mainEntityOfPage: { '@type': 'WebPage', '@id': SITE_URL + PAGE_PATH } };
  const faqSchema = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: guide.faq.map((item) => ({ '@type': 'Question', name: item.q, acceptedAnswer: { '@type': 'Answer', text: item.a } })) };
  return (
    <div className="min-h-screen bg-paper" dir="rtl">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <BreadcrumbSchema items={[{ name: 'דף הבית', url: '/' }, { name: 'עצמאיים', url: '/self-employed' }, { name: guide.short, url: PAGE_PATH }]} />
      <article className="mx-auto max-w-3xl px-4 py-8">
        <div className="mb-6"><Breadcrumbs items={[{ label: 'דף הבית', href: '/' }, { label: 'עצמאיים', href: '/self-employed' }, { label: guide.short }]} /></div>
        <header className="mb-8">
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.14em] text-gold">{'// '}{guide.eyebrow}</p>
          <h1 className="mb-3 text-3xl font-bold text-ink md:text-4xl">{guide.title}</h1>
          <p className="text-lg leading-relaxed text-ink/70">{guide.intro}</p>
          <p className="mt-3 text-sm text-ink/70">נכתב על ידי אנדרי פלטונוב, רו״ח · עודכן {LAST_UPDATED}</p>
        </header>
        <section className="mb-8 border border-gold/40 bg-cream-2 p-5" aria-labelledby="quick-answer">
          <p className="mb-2 font-mono text-xs uppercase tracking-[0.14em] text-gold">תשובה מהירה</p>
          <h2 id="quick-answer" className="mb-2 text-xl font-bold text-ink">{guide.answerTitle}</h2>
          <p className="text-sm leading-relaxed text-ink/80">{guide.answer}</p>
        </section>
        <nav aria-label="תוכן עניינים" className="mb-10 border border-ink/15 p-5">
          <p className="mb-3 font-bold text-ink">במדריך</p>
          <ol className="grid gap-2 text-sm text-ink/75 sm:grid-cols-2">{guide.sections.map((section, index) => <li key={section.heading}><a className="hover:text-gold" href={'#section-' + index}>{section.heading}</a></li>)}</ol>
        </nav>
        <div className="prose prose-lg max-w-none leading-relaxed text-ink">
          {guide.sections.map((section, index) => <section id={'section-' + index} className="scroll-mt-40" key={section.heading}><h2>{section.heading}</h2>{section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}{'bullets' in section && section.bullets ? <ul>{section.bullets.map((item) => <li key={item}>{item}</li>)}</ul> : null}</section>)}
        </div>
        <section className="my-10"><h2 className="mb-4 text-2xl font-bold text-ink">מדריכים וכלים להמשך</h2><div className="grid gap-3 sm:grid-cols-2">{guide.related.map((item) => <Link key={item.href} href={item.href} className="group flex items-center justify-between gap-2 border border-ink/15 p-4 transition hover:border-gold"><span className="font-medium text-ink group-hover:text-gold">{item.label}</span><span className="text-gold" aria-hidden>←</span></Link>)}</div></section>
        {guide.sources.length > 0 ? <section className="mb-10 border border-ink/15 p-5"><h2 className="mb-3 text-2xl font-bold text-ink">מקורות רשמיים</h2><ul className="space-y-2 text-sm">{guide.sources.map((source) => <li key={source.href}><a href={source.href} target="_blank" rel="noopener noreferrer" className="font-medium text-gold underline underline-offset-4">{source.label} ↗</a></li>)}</ul><p className="mt-4 text-xs leading-relaxed text-ink/60">המקורות נבדקו ביום {LAST_UPDATED}. במקרה של סתירה, הוראות הדין וההודעה האישית של הרשות גוברות על מדריך זה.</p></section> : null}
        <section className="mb-10"><h2 className="mb-6 text-2xl font-bold text-ink">שאלות נפוצות</h2><div className="space-y-4">{guide.faq.map((item) => <details key={item.q} className="group border border-ink/15 p-4"><summary className="flex cursor-pointer list-none items-center justify-between font-bold text-ink">{item.q}<span className="text-ink/70 transition group-open:rotate-180" aria-hidden>▾</span></summary><p className="mt-3 leading-relaxed text-ink/70">{item.a}</p></details>)}</div></section>
        <section className="mb-8"><AuthorBox /></section>
        <DisclaimerBox text={guide.disclaimer} />
      </article>
    </div>
  );
}
