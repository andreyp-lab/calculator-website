import type { Metadata } from 'next';
import Link from 'next/link';
import { AuthorBox } from '@/components/calculator/AuthorBox';
import { Breadcrumbs } from '@/components/calculator/Breadcrumbs';
import { DisclaimerBox } from '@/components/calculator/DisclaimerBox';
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';

const SITE_URL = 'https://cheshbonai.co.il';
const PAGE_PATH = '/business-start/business-license';
const LAST_UPDATED = '2026-10-24';
const guide = {
  "slug": "business-license",
  "title": "בדיקת רישיון עסק לפני פתיחה: מדריך מעשי",
  "short": "רישיון עסק",
  "description": "איך בודקים אם עסק טעון רישוי, מאתרים פריט בצו החכם, פונים לרשות המקומית ומתכננים נכס ופתיחה בלי לנחש דרישות.",
  "eyebrow": "רישוי ותכנון מקום",
  "answerTitle": "איך יודעים אם העסק צריך רישיון עסק?",
  "answer": "בודקים את הפעילות והמיקום מול יחידת רישוי העסקים ברשות המקומית ומול הצו החכם של משרד הפנים. אם העסק משויך לפריט רישוי, בודקים את המסלול, נותני האישור, המפרט האחיד והמסמכים הנדרשים. לא חותמים על נכס או מתחילים פעילות בהנחה שבקשה עתידית תאושר.",
  "intro": "רישוי עסק תלוי במה שמפעילים ובמקום שבו מפעילים אותו. שם מסחרי כללי אינו מספיק: מסעדה, מחסן, ייצור, טיפול בחומרים או שירות לציבור עשויים לכלול פריטי רישוי ודרישות שונות. הבדיקה המוקדמת נועדה למנוע השקעה בנכס שאינו מתאים.",
  "sections": [
    {
      "heading": "מתארים פעילות ברמת פירוט שמאפשרת סיווג",
      "paragraphs": [
        "הכינו תיאור של כל הפעילויות במקום: קבלת קהל, הכנה או מכירה של מזון, אחסון, ייצור, משלוחים, טיפול בחומרים, מספר עובדים ושעות פעילות. ציינו שטח, כתובת ושימוש קיים בנכס. פעילות משנית יכולה להיות פריט רישוי נפרד, ולכן אין להסתפק בפעילות המרכזית בלבד.",
        "פנו ליחידת רישוי העסקים ברשות המקומית ובקשו בדיקה אם העסק טעון רישוי ואיזה פריט או פריטים חלים. משרד הפנים מדגיש שבעלי עסקים צריכים להפנות שאלות כאלה לרשות המקומית. שמרו תשובה כתובה ככל שניתן."
      ],
      "bullets": [
        "תיאור מלא של הפעילות",
        "כתובת, שטח ותכנית הנכס",
        "שימושים נלווים ואחסון",
        "זהות הבעלים והמבנה העסקי"
      ]
    },
    {
      "heading": "משתמשים בצו החכם ובמפרט האחיד",
      "paragraphs": [
        "הצו החכם מאפשר לחפש פריטי רישוי ולראות מידע על מסלול, תוקף, חיקוקים ומסמכי בקשה. הוא כלי מידע ואינו קביעה ממצה, כפי שמצוין באתר. השתמשו בו להכנה לשיחה עם הרשות ולא כתחליף לאישור פרטני.",
        "בדף הבקשה הרשמי מוסבר שנותני אישור ממשלתיים עשויים להיות מעורבים לפי הפריט, ושבחלק מהפריטים פורסם מפרט אחיד. קראו את המפרט הרלוונטי לפני תכנון שיפוץ או רכישת ציוד. דרישות יכולות להשתנות לפי הפריט, הרשות והנכס."
      ]
    },
    {
      "heading": "בודקים נכס לפני התחייבות",
      "paragraphs": [
        "לפני חתימה על שכירות או רכישה, בדקו התאמה תכנונית, נגישות, תשתיות, בטיחות והיתכנות לעמוד בדרישות הרישוי. עורך דין, אדריכל או יועץ רישוי יכולים לסייע לפי המקרה. אל תסתפקו בכך שבעבר פעל במקום עסק דומה; בעלות, פעילות ותנאים עשויים להשתנות.",
        "אם חותמים לפני השלמת הבדיקה, יש לשקול עם עורך דין תנאים מתלים וחלוקת אחריות לביצוע התאמות. אין נוסח אחיד שמתאים לכל עסקה. עלויות תכנון, יועצים, אגרות ושיפוץ משתנות ויש לקבל הצעות פרטניות."
      ]
    },
    {
      "heading": "הגשה, מעקב ושינויים",
      "paragraphs": [
        "השירות המקוון זמין רק ברשויות שתומכות בו; אחרת פונים לרשות המקומית לפי הנחיותיה. שמרו אישור הגשה ועקבו אחרי הסטטוס. בקשה שהוגשה אינה רישיון, ואישור של גורם אחד אינו בהכרח השלמת כל המסלול.",
        "שינוי בעלות, כתובת, שטח או פעילות עשוי לדרוש בדיקה מחודשת. לפני שינוי תפעולי משמעותי חזרו לפריט הרישוי ולרשות. שמרו את הרישיון, התנאים והבדיקות בתיק תפעולי נגיש לעובדים האחראים."
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
      "q": "האם כל עסק צריך רישיון עסק?",
      "a": "לא. החובה תלויה בפריט הרישוי ובפעילות. בודקים בצו החכם ומקבלים הכוונה מהרשות המקומית."
    },
    {
      "q": "האם הגשת בקשה מאפשרת להתחיל לפעול?",
      "a": "בקשה אינה רישיון. יש לברר עם רשות הרישוי מה מותר בכל שלב ומהו האישור הנדרש."
    },
    {
      "q": "כמה עולה להוציא רישיון?",
      "a": "העלות משתנה לפי פריט, נכס, יועצים והתאמות. יש לקבל מידע מהרשות והצעות כתובות מבעלי מקצוע."
    },
    {
      "q": "מי נותן את הרישיון?",
      "a": "רשות הרישוי המקומית מטפלת בבקשה, ובפריטים מסוימים מעורבים נותני אישור ממשלתיים לפי הצו."
    }
  ],
  "sources": [
    {
      "href": "https://www.gov.il/he/service/application-for-new-business-license",
      "label": "בקשה לרישיון עסק — משרד הפנים"
    },
    {
      "href": "https://www.gov.il/he/departments/dynamiccollectors/add-zav-rishuy?skip=0",
      "label": "הצו החכם — משרד הפנים"
    }
  ],
  "related": [
    {
      "href": "/self-employed/opening-business",
      "label": "המדריך לפתיחת עסק עצמאי"
    },
    {
      "href": "/self-employed/business-setup-cost",
      "label": "תכנון עלויות הקמת עסק"
    },
    {
      "href": "/self-employed/first-90-days",
      "label": "90 הימים הראשונים אחרי פתיחת עוסק"
    },
    {
      "href": "/self-employed/business-finance",
      "label": "ניהול כספים לעסק קטן"
    },
    {
      "href": "/self-employed/invoices",
      "label": "חשבוניות, קבלות ומסמכי העסק"
    },
    {
      "href": "/compare/osek-patur-vs-murshe",
      "label": "עוסק פטור מול עוסק מורשה"
    }
  ],
  "disclaimer": "המידע כללי ואינו ייעוץ משפטי, תכנוני או רישויי. הקביעה אם עסק טעון רישוי והדרישות החלות נעשות לפי הדין, פריט הרישוי והרשות המקומית."
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
