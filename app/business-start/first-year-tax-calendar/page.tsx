import type { Metadata } from 'next';
import Link from 'next/link';
import { AuthorBox } from '@/components/calculator/AuthorBox';
import { Breadcrumbs } from '@/components/calculator/Breadcrumbs';
import { DisclaimerBox } from '@/components/calculator/DisclaimerBox';
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';

const SITE_URL = 'https://cheshbonai.co.il';
const PAGE_PATH = '/business-start/first-year-tax-calendar';
const LAST_UPDATED = '2026-10-24';
const guide = {
  "slug": "first-year-tax-calendar",
  "title": "לוח מס לשנה הראשונה של עסק חדש",
  "short": "לוח מס לשנה הראשונה",
  "description": "איך בונים לוח מס אישי לעסק חדש לפי הודעות התיק: מע״מ, מקדמות, ניכויים, ביטוח לאומי, דוח שנתי וסגירה חודשית.",
  "eyebrow": "תכנון דיווחים ותשלומים",
  "answerTitle": "איך בונים לוח מס לשנה הראשונה בלי לטעות במועדים?",
  "answer": "מתחילים רק מהתיקים שנפתחו ומהודעות הרשויות: רושמים לכל חיוב את התקופה, ערוץ הדיווח, המועד שנקבע, האחראי והאישור שצריך לשמור. מוסיפים מועדי בקרה פנימיים מוקדמים, אך לא מציגים אותם כמועד חוקי. כל שינוי בתיק או בהעסקת עובדים מחייב עדכון של הלוח.",
  "intro": "אין לוח אחד שמתאים לכל עסק. תקופות דיווח, מקדמות, ניכויים וחובות שנתיות תלויות בסיווג ובתיק. לכן הדף מלמד איך לבנות לוח אישי ואינו מפרסם רשימת תאריכים שעלולה להיות שגויה עבורכם.",
  "sections": [
    {
      "heading": "ממפים את כל התיקים וההודעות",
      "paragraphs": [
        "פתחו טבלה עם שורה לכל מערכת: מע״מ, מס הכנסה, ניכויים אם נפתח תיק, ביטוח לאומי וחובות נוספות לפי הפעילות. לכל שורה צרפו מספר תיק, אזור אישי, תקופת דיווח, ערוץ תשלום ומקור שקובע את המועד. אם לא ברור מה נפתח, חוזרים לאישור או פונים לרשות.",
        "רשות המסים מציינת שדוחות מע״מ מוגשים לפי תקופת הדיווח שנקבעה לעוסק. זהו עיקרון חשוב: לא מעתיקים תדירות מעסק אחר. כך גם במקדמות ובניכויים — עובדים לפי הדרישה האישית וההודעות העדכניות."
      ],
      "bullets": [
        "מערכת ומספר תיק",
        "תקופת דיווח ומועד אישי",
        "אחראי להכנה ולאישור",
        "אסמכתה שיש לשמור לאחר הגשה"
      ]
    },
    {
      "heading": "מפרידים בין לוח חוקי ללוח תפעולי",
      "paragraphs": [
        "המועד החוקי הוא המועד שקובע הדין או הרשות. המועד התפעולי הוא תאריך מוקדם שאתם קובעים לאיסוף מסמכים, סגירה ובדיקה. לדוגמה, אפשר לקבוע יום חודשי להשלמת התאמות, בלי לטעון שזהו מועד הדיווח. ההפרדה מאפשרת מרווח לתיקון טעויות.",
        "לכל דיווח הגדירו שרשרת: איסוף, התאמה, הכנה, אישור, שידור, תשלום ושמירת אסמכתה. אם מייצג משדר, עדיין קבעו מתי אתם מעבירים חומר ומתי מקבלים אישור. ״שלחתי לרואה החשבון״ אינו הוכחה שהדוח הוגש."
      ]
    },
    {
      "heading": "אירועים שמשנים את הלוח",
      "paragraphs": [
        "עובד ראשון, שכירת נכס, מעבר מעוסק פטור למורשה, שינוי תחזית הכנסה או הפסקת פעילות יכולים ליצור או לשנות חובות. בנו טריגרים בלוח: כשאירוע קורה, האחראי בודק אילו תיקים, דיווחים והרשאות מתעדכנים.",
        "גם הודעה חדשה מהרשות היא טריגר. הגדירו כתובת דוא״ל וטלפון עדכניים, בדקו תיבות הודעות ואזורים אישיים ושמרו את ההודעה בתיק. אל תחכו לקנס כדי לגלות שהתקופה או המקדמה השתנו."
      ]
    },
    {
      "heading": "סגירה שנתית מתחילה במהלך השנה",
      "paragraphs": [
        "שמרו מדי חודש מסמכי הכנסה והוצאה, התאמות, חוזים ואישורי תשלום. עסקים עם מלאי, רכוש או יתרות לקוחות וספקים צריכים תהליך סגירה מתאים בהנחיית המייצג. ריכוז הכול בסוף השנה מגדיל סיכון לחסר ולדיווח לא מדויק.",
        "לקראת סוף השנה בקשו מהמייצג רשימת הכנה מותאמת ומועדי מסירה פנימיים. הדוח השנתי ומסמכי הניכויים עשויים לכלול נתונים ממקורות נוספים, ולכן חשוב לעדכן על שכר, השקעות, נכסים ושותפויות לפי הצורך."
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
      "q": "מהו המועד לדיווח מע״מ?",
      "a": "הדיווח נעשה לפי תקופת הדיווח שנקבעה לעוסק ובערוץ הרלוונטי. בודקים בתיק ובשירות הרשמי."
    },
    {
      "q": "האם לכל עצמאי יש אותם מקדמות?",
      "a": "לא. הדרישה נקבעת לתיק ויכולה להשתנות. עובדים לפי ההודעה האישית."
    },
    {
      "q": "מה מוסיפים ללוח כשמעסיקים עובד?",
      "a": "בודקים פתיחת תיק ניכויים וחובות דיווח ותשלום למס הכנסה ולביטוח הלאומי, וכן חובות מעסיק נוספות."
    },
    {
      "q": "האם תזכורת ביומן מספיקה?",
      "a": "לא. צריך תהליך עם אחראי, מסמכים, אישור ושמירת אסמכתה."
    }
  ],
  "sources": [
    {
      "href": "https://www.gov.il/he/service/reporting-or-payment-of-vat-reports",
      "label": "דיווח ותשלום דוחות מע״מ — רשות המסים"
    },
    {
      "href": "https://www.gov.il/he/pages/income-tax-guide-open-business?chapterIndex=7",
      "label": "מדריך מס הכנסה לפתיחת עסק — רשות המסים"
    },
    {
      "href": "https://www.btl.gov.il/Insurance/National%20Insurance/type_list/Self_Employed/Pages/HowToRegister.aspx",
      "label": "פתיחת תיק עצמאי — הביטוח הלאומי"
    }
  ],
  "related": [
    {
      "href": "/self-employed/first-90-days",
      "label": "90 הימים הראשונים אחרי פתיחת עוסק"
    },
    {
      "href": "/self-employed/tax-advances",
      "label": "מקדמות מס לעצמאים"
    },
    {
      "href": "/self-employed/vat",
      "label": "מדריך מע״מ לעצמאים"
    },
    {
      "href": "/self-employed/social-security",
      "label": "ביטוח לאומי לעצמאים"
    },
    {
      "href": "/self-employed/invoices",
      "label": "חשבוניות, קבלות ומסמכי העסק"
    },
    {
      "href": "/self-employed/business-finance",
      "label": "ניהול כספים לעסק קטן"
    }
  ],
  "disclaimer": "המידע כללי ואינו לוח מועדים מחייב או ייעוץ מס. המועדים והתקופות נקבעים לפי הדין, סוג התיק והודעות הרשויות. יש לבנות לוח אישי ולעדכנו."
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
