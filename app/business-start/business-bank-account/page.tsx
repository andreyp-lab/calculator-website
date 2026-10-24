import type { Metadata } from 'next';
import Link from 'next/link';
import { AuthorBox } from '@/components/calculator/AuthorBox';
import { Breadcrumbs } from '@/components/calculator/Breadcrumbs';
import { DisclaimerBox } from '@/components/calculator/DisclaimerBox';
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';

const SITE_URL = 'https://cheshbonai.co.il';
const PAGE_PATH = '/business-start/business-bank-account';
const LAST_UPDATED = '2026-10-24';
const guide = {
  "slug": "business-bank-account",
  "title": "חשבון בנק לעסק חדש: איך לבחור ולהקים תהליך נכון",
  "short": "חשבון בנק עסקי",
  "description": "מדריך מעשי לבחירת חשבון לעסק, השוואת הצעות, הרשאות, סליקה, התאמות והפרדה בין כסף פרטי לעסקי.",
  "eyebrow": "תשתית כספית לעסק",
  "answerTitle": "האם צריך חשבון בנק נפרד לעסק?",
  "answer": "הצורך המשפטי והבנקאי תלוי במבנה העסק ובהוראות הבנק, אבל מבחינה ניהולית הפרדה בין פעילות עסקית לפרטית מקלה מאוד על תיעוד, התאמות ובקרה. לפני פתיחה מגדירים שימושים והרשאות, מבקשים הצעות כתובות מכמה בנקים או ספקים ובודקים את העלות הכוללת לפי דפוס הפעילות — בלי להניח מחיר אחיד.",
  "intro": "חשבון בנק הוא מערכת עבודה, לא רק מקום לקבל בו כסף. בחירה טובה מחברת גבייה, תשלומים, כרטיסים, סליקה, הנהלת חשבונות והרשאות. הדף אינו משווה מחירים משום שעמלות ותנאים משתנים; הוא מסביר איך לבקש הצעה שניתן באמת להשוות.",
  "sections": [
    {
      "heading": "מתחילים ממפת שימושים ולא משם הבנק",
      "paragraphs": [
        "רשמו כמה תקבולים ותשלומים צפויים, באילו מטבעות, האם יהיו הפקדות מזומן או שיקים, מי צריך כרטיס, האם נדרשת סליקה ומה נדרש לייצוא להנהלת חשבונות. עסק שירותים עם מעט העברות שונה מחנות עם סליקה יומית, ולכן חבילת עמלות זולה על הנייר עלולה להיות יקרה בפועל.",
        "הגדירו גם צרכים עתידיים סבירים: עובד שצריך הרשאת צפייה, שותף שמאשר תשלום, מסגרת אשראי או חשבון מטבע. אין צורך לרכוש הכול מראש, אבל כדאי לברר מה תהליך ההוספה ומה דורש מסמכים או אישור חדש."
      ],
      "bullets": [
        "ערוצי גבייה ותשלום",
        "מספר משתמשים ורמות הרשאה",
        "חיבור לתוכנת הנהלת חשבונות",
        "מטבע, סליקה, שיקים ומזומן לפי הפעילות"
      ]
    },
    {
      "heading": "מבקשים הצעה שאפשר להשוות",
      "paragraphs": [
        "שלחו לכל בנק או ספק אותה רשימת שימושים ובקשו הצעה כתובה. בדקו עמלות פעולה, דמי כרטיס, עלויות סליקה או המרה, תנאי הטבה ומה קורה בסיומה. אל תציגו מספר ממדריך אינטרנטי כעלות שוק; ההצעה תלויה בעסק, במחזור, בסיכון ובמשא ומתן.",
        "השוו גם איכות תפעול: זמינות שירות, יכולת לייצא תנועות, התראות, ניהול מוטבים ותהליך החלפת מורשה. מחיר נמוך אינו מפצה על מערכת שמקשה לבצע התאמה חודשית או על הרשאות שאינן מתאימות לשותפות."
      ]
    },
    {
      "heading": "מסמכים, בעלות והרשאות",
      "paragraphs": [
        "הבנק יבקש מסמכים בהתאם לסוג הלקוח, מבנה הבעלות, מורשי החתימה והוראות הדין. עצמאי, שותפות וחברה אינם אותו מקרה. רשות המסים מבקשת במצבים מסוימים אישור ניהול חשבון או צ׳ק מבוטל במסגרת פתיחת תיק, ולכן חשוב ששמות ומספרים יתאימו למסמכי הרישום.",
        "בשותפות או חברה אל תסתפקו בסיסמה משותפת. הגדירו משתמש אישי, הרשאת צפייה, יוזם תשלום ומאשר תשלום לפי הצורך. קבעו מי יכול לשנות מוטב או מסגרת, ומהו נוהל ביטול הרשאה כשאדם עוזב."
      ]
    },
    {
      "heading": "בונים שגרת התאמה ושומרים כסף למטרותיו",
      "paragraphs": [
        "חברו כל תנועה למסמך: תקבול ללקוח ולקבלה, תשלום לספק ולחשבונית, העברה לבעלים לרישום מתאים ותשלום לרשות לאישור. אחת לחודש בצעו התאמת בנק וסמנו תנועות לא מזוהות. ההפרדה חוסכת זמן ומקטינה סיכון לאובדן הוצאה או לרישום כפול.",
        "השתמשו בחשבון גם לבקרת תזרים, אבל אל תפרשו יתרה ככסף פנוי. חלק מהיתרה מיועד לספקים, משכורות, מע״מ או מסים. אפשר ליצור תתי־חשבונות או מעקב פנימי, בהתאם לכלים ולעלויות שקיבלתם בהצעה."
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
      "q": "האם עצמאי חייב חשבון עסקי נפרד?",
      "a": "הדרישה תלויה במבנה ובהוראות הבנק והדין. ניהולית, הפרדה מקלה על תיעוד ובקרה. יש לברר פרטנית."
    },
    {
      "q": "כמה עולה חשבון לעסק?",
      "a": "אין מחיר אחיד. מבקשים הצעה כתובה לפי דפוס הפעילות ומשווים עמלות, הטבות ותנאים לאחר סיום ההטבה."
    },
    {
      "q": "מה צריך להביא לבנק?",
      "a": "המסמכים תלויים במבנה העסק ובבנק. בקשו רשימה עדכנית לפני הפגישה וודאו התאמה למסמכי הרישום."
    },
    {
      "q": "אפשר להשתמש בסיסמה משותפת לשותפים?",
      "a": "עדיף להגדיר משתמשים והרשאות אישיים לפי מדיניות הבנק, כדי לשמור על אבטחה ותיעוד פעולות."
    }
  ],
  "sources": [
    {
      "href": "https://www.gov.il/he/service/vat-821/",
      "label": "מסמכי חשבון בנק בפתיחת עוסק מורשה — רשות המסים"
    },
    {
      "href": "https://www.gov.il/he/service/request-open-exempt-dealer-via-internet",
      "label": "מסמכים לפתיחת עוסק פטור — רשות המסים"
    }
  ],
  "related": [
    {
      "href": "/self-employed/business-finance",
      "label": "ניהול כספים לעסק קטן"
    },
    {
      "href": "/self-employed/business-setup-cost",
      "label": "תכנון עלויות הקמת עסק"
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
      "href": "/self-employed/opening-business",
      "label": "המדריך לפתיחת עסק עצמאי"
    },
    {
      "href": "/self-employed/hourly-rate",
      "label": "חישוב תעריף לשעה"
    }
  ],
  "disclaimer": "המידע כללי ואינו ייעוץ בנקאי, משפטי או פיננסי. תנאי חשבון, עמלות, אשראי ומסמכים נקבעים בידי הבנק ובהתאם ללקוח. יש לקבל הצעה עדכנית ולבדוק אותה."
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
