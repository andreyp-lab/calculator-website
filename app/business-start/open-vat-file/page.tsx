import type { Metadata } from 'next';
import Link from 'next/link';
import { AuthorBox } from '@/components/calculator/AuthorBox';
import { Breadcrumbs } from '@/components/calculator/Breadcrumbs';
import { DisclaimerBox } from '@/components/calculator/DisclaimerBox';
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';

const SITE_URL = 'https://cheshbonai.co.il';
const PAGE_PATH = '/business-start/open-vat-file';
const LAST_UPDATED = '2026-10-24';
const guide = {
  "slug": "open-vat-file",
  "title": "פתיחת תיק מע״מ: סדר פעולות לעוסק חדש",
  "short": "פתיחת תיק מע״מ",
  "description": "מה מכינים לפתיחת תיק מע״מ, איך מבדילים בין עוסק פטור למורשה, מה בודקים אחרי ההגשה ואילו טעויות מונעים.",
  "eyebrow": "רישום במע״מ",
  "answerTitle": "מה צריך לעשות כדי לפתוח תיק מע״מ?",
  "answer": "מגדירים את הפעילות ואת המחזור הצפוי, בודקים אם ניתן להירשם כעוסק פטור או שחובה להירשם כעוסק מורשה, מרכזים את המסמכים שמופיעים בשירות הרשמי ומגישים בערוץ המתאים. לאחר ההגשה בודקים שהתיק נפתח, שהסיווג ותאריך תחילת הפעילות נכונים ושברור אילו מסמכים ודיווחים חלים על העסק.",
  "intro": "פתיחת תיק מע״מ אינה בחירה טכנית בלבד. הסיווג משפיע על מסמכי העסק, גביית מע״מ, דיווחים והתנהלות מול לקוחות וספקים. הסכומים, התנאים והערוצים עשויים להשתנות, ולכן הדף נמנע מהעתקת תקרה או מועד ומפנה לשירותים הרשמיים המעודכנים.",
  "sections": [
    {
      "heading": "שלב ראשון: מגדירים פעילות לפני שבוחרים סיווג",
      "paragraphs": [
        "תארו במילים פשוטות מה אתם מוכרים, למי, היכן השירות ניתן, מתי הפעילות מתחילה ומהו המחזור הצפוי. אל תבחרו עוסק פטור רק משום שהעסק קטן: רשות המסים מפרטת תנאי מחזור ועיסוקים שאינם יכולים להירשם כך. בדקו את הרשימה המעודכנת בשירות הרשמי ואת התאמת הפעילות בפועל, לא רק את הכותרת השיווקית שלה.",
        "אם קיימים כמה סוגי שירות, מכירות מקוונות, פעילות מחוץ לישראל או עבודה דרך שותפות או חברה, הציגו את התמונה המלאה למייצג או למשרד מע״מ. ניסוח חלקי עלול ליצור סיווג שאינו מתאים. תחזית המחזור צריכה להיות סבירה ומתועדת, אך אינה הבטחה עסקית."
      ],
      "bullets": [
        "תיאור פעילות ומועד התחלה",
        "לקוחות צפויים ומקום ביצוע העסקאות",
        "מחזור שנתי צפוי על בסיס הנחות כתובות",
        "רישיונות מקצועיים או עסקיים אם רלוונטיים"
      ]
    },
    {
      "heading": "מסמכים והגשה: עובדים לפי דף השירות",
      "paragraphs": [
        "השירות המקוון לעוסק פטור והשירות לעוסק מורשה אינם זהים. בדפי רשות המסים מפורטים מסמכי זיהוי, אסמכתאות בנק ומסמכים על מקום העסק או העיסוק לפי המקרה. אל תבנו רשימה קבועה מתוך מאמר צד שלישי; פתחו את דף השירות ביום ההגשה, הורידו את הטופס העדכני ושמרו עותק של כל קובץ שנשלח.",
        "בדקו שכל השמות, המספרים, הכתובות והתאריכים תואמים בין המסמכים. כאשר העסק פועל מהבית או בחלל של צד אחר, תעדו מהו הבסיס לשימוש במקום ובדקו מה הרשות מבקשת. אם נעזרים במייצג, הגדירו מראש מי מגיש, מי מקבל הודעות ומי מאמת שהתיק נקלט."
      ]
    },
    {
      "heading": "אחרי ההגשה: לא מתחילים להפיק מסמכים על אוטומט",
      "paragraphs": [
        "שמרו אישור הגשה ומספר פנייה. לאחר האישור בדקו את שם העוסק, מספרו, הסיווג ותאריך הרישום. לעוסק מורשה נדרשים פרטי גישה לדיווח; לעוסק פטור קיימות חובות שאינן נעלמות רק משום שאין גביית מע״מ מהלקוחות. ההוראות האישיות בתיק והמקורות הרשמיים קובעים מה ומתי לדווח.",
        "לפני העסקה הראשונה הגדירו עם תוכנת הנהלת החשבונות או המייצג איזה מסמך מופק בכל שלב: דרישת תשלום, חשבונית עסקה, חשבונית מס או קבלה, לפי המעמד והאירוע. אין להפיק חשבונית מס מעוסק שאינו רשאי לכך, ואין לדחות תיעוד תקבול רק משום שהלקוח לא ביקש מסמך."
      ]
    },
    {
      "heading": "טעויות שכדאי למנוע",
      "paragraphs": [
        "טעות נפוצה היא להעתיק תקרת עוסק פטור משנה קודמת. טעות אחרת היא להניח שמחזור שווה רווח, או שמס תשומות ניתן לקיזוז בכל הוצאה. עוד טעות היא להתחיל לגבות מחיר הכולל או אינו כולל מע״מ בלי לנסח זאת בהצעה. את כל הנקודות האלה סוגרים לפני פרסום מחיר.",
        "אם הפעילות משתנה או המחזור מתקרב לסף הרלוונטי, לא מחכים לסוף השנה. בודקים את המצב מול רשות המסים או מייצג ומבררים אם נדרש שינוי סיווג. שמרו תיעוד של הבדיקה וההנחיה שקיבלתם."
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
      "q": "האם כל עסק קטן יכול להיות עוסק פטור?",
      "a": "לא. הזכאות תלויה בין היתר במחזור הצפוי ובסוג העיסוק. בודקים את התנאים העדכניים בשירות הרשמי."
    },
    {
      "q": "כמה עולה לפתוח תיק מע״מ?",
      "a": "דפי השירות הרשמיים מציינים אם השירות הממשלתי כרוך בתשלום. שירות מקצועי חיצוני מתומחר בנפרד, ולכן יש לקבל הצעה כתובה."
    },
    {
      "q": "אפשר להתחיל להוציא חשבוניות לפני אישור?",
      "a": "יש לוודא שהרישום הושלם ואיזה מסמך מותר להפיק לפי המעמד. במקרה של ספק פונים למע״מ או למייצג."
    },
    {
      "q": "האם פתיחת מע״מ פותחת אוטומטית את כל שאר התיקים?",
      "a": "בחלק מהשירותים יש תהליך משולב, אך אין להניח שהכול נקלט. בודקים בנפרד מס הכנסה וביטוח לאומי."
    }
  ],
  "sources": [
    {
      "href": "https://www.gov.il/he/service/request-open-exempt-dealer-via-internet",
      "label": "פתיחת תיק עוסק פטור — רשות המסים"
    },
    {
      "href": "https://www.gov.il/he/service/vat-821/",
      "label": "פתיחת תיק עוסק מורשה, טופס 821 — רשות המסים"
    },
    {
      "href": "https://www.gov.il/he/pages/vat-to-the-new-dealer?chapterIndex=2",
      "label": "מדריך לעוסק החדש במע״מ — רשות המסים"
    }
  ],
  "related": [
    {
      "href": "/self-employed/opening-business",
      "label": "המדריך לפתיחת עסק עצמאי"
    },
    {
      "href": "/compare/osek-patur-vs-murshe",
      "label": "עוסק פטור מול עוסק מורשה"
    },
    {
      "href": "/self-employed/vat",
      "label": "מדריך מע״מ לעצמאים"
    },
    {
      "href": "/self-employed/invoices",
      "label": "חשבוניות, קבלות ומסמכי העסק"
    },
    {
      "href": "/self-employed/first-90-days",
      "label": "90 הימים הראשונים אחרי פתיחת עוסק"
    },
    {
      "href": "/self-employed/business-setup-cost",
      "label": "תכנון עלויות הקמת עסק"
    }
  ],
  "disclaimer": "המידע כללי ואינו ייעוץ מס. תנאי הרישום, הסיווג, התקרות, המסמכים ותקופות הדיווח עשויים להשתנות ותלויים בפעילות. יש לבדוק במקור הרשמי או עם מייצג מוסמך."
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
