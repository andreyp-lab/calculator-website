import type { Metadata } from 'next';
import Link from 'next/link';
import { AuthorBox } from '@/components/calculator/AuthorBox';
import { Breadcrumbs } from '@/components/calculator/Breadcrumbs';
import { DisclaimerBox } from '@/components/calculator/DisclaimerBox';
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';

const SITE_URL = 'https://cheshbonai.co.il';
const PAGE_PATH = '/business-start/bookkeeping-method';
const LAST_UPDATED = '2026-10-24';
const guide = {
  "slug": "bookkeeping-method",
  "title": "בחירת שיטת הנהלת חשבונות לעסק חדש",
  "short": "שיטת הנהלת חשבונות",
  "description": "איך בוחרים שיטת הנהלת חשבונות, תוכנה ותהליך מסמכים לפי סוג העסק והוראות ניהול הספרים — בלי להסתפק בחד־צידית או כפולה.",
  "eyebrow": "תיעוד ובקרה",
  "answerTitle": "איך יודעים איזו הנהלת חשבונות העסק צריך?",
  "answer": "לא בוחרים שיטה רק לפי נוחות או מחיר. ממפים את סוג הפעילות, המבנה, המחזור, מספר העובדים, המלאי ואופן הגבייה; בודקים איזו תוספת בהוראות ניהול הספרים חלה; ואז בוחרים מערכת ותהליך שעומדים בדרישות ומספקים מידע ניהולי. ההכרעה אם נדרשת הנהלת חשבונות חד־צידית או כפולה היא חלק מהבדיקה, לא כל הבדיקה.",
  "intro": "תוכנה יכולה להפיק מסמך יפה ועדיין לא להתאים לחובות העסק. מצד שני, מערכת מורכבת מדי עלולה ליצור עבודה כפולה בלי ערך. הבחירה הנכונה מתחילה בדרישות הדין וממשיכה בצורכי ניהול, הרשאות וגיבוי.",
  "sections": [
    {
      "heading": "ממפים את העסק לפני שמדברים על תוכנה",
      "paragraphs": [
        "רשמו מה העסק עושה, כיצד הוא מקבל הזמנות, מתי נוצרת עסקה, איך מתקבל תשלום ואילו הוצאות חוזרות קיימות. ציינו מלאי, עובדים, קופה, אשראי, פרויקטים, סניפים ומטבע חוץ. הוראות ניהול הספרים כוללות תוספות לפי סוגי עסקים ומאפיינים, ולכן שני עסקים עם אותו מחזור עשויים להזדקק לתהליך שונה.",
        "מסרו את המפה לרואה חשבון או יועץ מס ובקשו תשובה כתובה: איזו תוספת וסעיף חלים, אילו ספרים ומסמכים נדרשים, מהו מועד הרישום, ומה צריך לשמור. אל תסתפקו במשפט ״חד־צידית מספיק״ בלי להבין את יתר הדרישות."
      ],
      "bullets": [
        "סוג הפעילות והמבנה המשפטי",
        "מחזור, עובדים, מלאי וסניפים",
        "אמצעי תשלום וקופות",
        "מסמכים, ספרים ודוחות שנדרשים לפי הבדיקה"
      ]
    },
    {
      "heading": "חד־צידית וכפולה: שאלה משפטית וניהולית",
      "paragraphs": [
        "הנהלת חשבונות חד־צידית מתמקדת בדרך כלל ברישום הכנסות והוצאות, ואילו כפולה מתעדת כל פעולה בשני צדדים ומאפשרת מאזן מלא. אולם ההגדרות המקצועיות אינן תחליף לבדיקת החובה הספציפית. גם עסק שאינו חייב בכפולה עשוי לבחור בה לצורכי בקרה, מימון או צמיחה.",
        "בחירה וולונטרית במערכת מפורטת יותר צריכה להצדיק את עלותה ואת יכולת הצוות לתפעל אותה. בקשו הצעה לפי היקף מסמכים, מורכבות, התאמות ודוחות, ולא רק מחיר חודשי בסיסי. המחירים משתנים ויש להשוות היקף שירות, תמיכה והעברת נתונים."
      ]
    },
    {
      "heading": "בוחרים מערכת ותהליך ולא רק ממשק",
      "paragraphs": [
        "בדקו שהמערכת מפיקה את המסמכים המתאימים למעמד העסק, שומרת רצף, מאפשרת תיקון בדרך תקינה ומספקת גיבוי וייצוא. בררו מי אחראי לעדכוני רגולציה, כיצד מתקבלות הרשאות, ואיך מעבירים את החומר למייצג. אם יש סליקה או חנות, בדקו התאמה בין המכירה, התקבול והמסמך.",
        "כתבו נוהל קצר לכל אירוע: קבלת מקדמה, ביטול עסקה, החזר ללקוח, הוצאה ששולמה פרטית, תשלום לספק ותקבול במטבע אחר. כך העובד או הבעלים אינם מאלתרים בזמן אמת."
      ]
    },
    {
      "heading": "סגירה חודשית ושמירת מסמכים",
      "paragraphs": [
        "קבעו יום פנימי לסגירת חודש: התאמות בנק ואשראי, בדיקת רצף מסמכים, קליטת הוצאות, רשימת חייבים וזכאים ובדיקת יתרות חריגות. היום הפנימי אינו מועד חוקי; הוא תאריך ניהולי שמאפשר לעמוד במועדים האישיים של העסק.",
        "שמרו מסמכים ונתונים בהתאם להוראות החלות ולהנחיית המייצג. ודאו שאפשר לייצא את הנתונים בפורמט שימושי ושאינכם תלויים רק בגישה של ספק. בצעו בדיקת שחזור, לא רק גיבוי שמסומן כפעיל."
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
      "q": "מה ההבדל בין חד־צידית לכפולה?",
      "a": "חד־צידית מתמקדת ברישומי הכנסה והוצאה; כפולה מנהלת מערכת חשבונות מלאה. החובה וההתאמה תלויות בעסק."
    },
    {
      "q": "האם עוסק פטור פטור מניהול ספרים?",
      "a": "לא. הפטור מתייחס למע״מ בתנאים מסוימים, ולא מבטל תיעוד וניהול ספרים לפי ההוראות החלות."
    },
    {
      "q": "איך בוחרים תוכנה?",
      "a": "בודקים התאמה להוראות, סוגי מסמכים, הרשאות, גיבוי, ייצוא וחיבור למייצג, ומבקשים הצעה לפי היקף השימוש."
    },
    {
      "q": "אפשר לשנות שיטה באמצע שנה?",
      "a": "שינוי דורש תכנון כדי לשמור רצף ותיעוד. יש לתאם מראש עם המייצג וספק המערכת."
    }
  ],
  "sources": [
    {
      "href": "https://www.btl.gov.il/Laws1/02_0022_100006.pdf",
      "label": "תקנות מע״מ וניהול פנקסי חשבונות — נוסח רשמי"
    },
    {
      "href": "https://www.gov.il/he/pages/income-tax-guide-open-business?chapterIndex=7",
      "label": "מדריך מס הכנסה לפתיחת עסק — רשות המסים"
    }
  ],
  "related": [
    {
      "href": "/self-employed/invoices",
      "label": "חשבוניות, קבלות ומסמכי העסק"
    },
    {
      "href": "/self-employed/business-finance",
      "label": "ניהול כספים לעסק קטן"
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
      "href": "/self-employed/opening-business",
      "label": "המדריך לפתיחת עסק עצמאי"
    },
    {
      "href": "/self-employed/business-setup-cost",
      "label": "תכנון עלויות הקמת עסק"
    }
  ],
  "disclaimer": "המידע כללי ואינו ייעוץ חשבונאי או מס. הוראות ניהול הספרים תלויות בסוג העסק ובמאפייניו. יש לקבל קביעה פרטנית ממייצג מוסמך ולבדוק את הנוסח העדכני."
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
