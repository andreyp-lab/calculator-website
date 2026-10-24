import type { Metadata } from 'next';
import Link from 'next/link';
import { AuthorBox } from '@/components/calculator/AuthorBox';
import { Breadcrumbs } from '@/components/calculator/Breadcrumbs';
import { DisclaimerBox } from '@/components/calculator/DisclaimerBox';
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';

const SITE_URL = 'https://cheshbonai.co.il';
const PAGE_PATH = '/business-start/register-national-insurance';
const LAST_UPDATED = '2026-10-24';
const guide = {
  "slug": "register-national-insurance",
  "title": "רישום עצמאי בביטוח לאומי: מדריך לבדיקת המעמד",
  "short": "רישום בביטוח לאומי",
  "description": "איך מדווחים על תחילת עבודה עצמאית לביטוח הלאומי, מה מצהירים, למה המעמד חשוב ואיך בודקים שהרישום נקלט.",
  "eyebrow": "מעמד מבוטח עצמאי",
  "answerTitle": "מתי ואיך נרשמים כעצמאים בביטוח הלאומי?",
  "answer": "עם תחילת העבודה העצמאית מדווחים לביטוח הלאומי לפי השירות הרשמי. מי שפותח תיק דרך מסלול משולב ברשות המסים יכול לבקש שהמידע יועבר; מי שכבר פתח ברשות המסים עשוי להידרש לדין וחשבון רב־שנתי. בכל מסלול חייבים לבדוק שהמעמד, שעות העבודה וההכנסה הצפויה נקלטו נכון.",
  "intro": "הרישום בביטוח הלאומי אינו רק גבייה. המעמד והדיווח עשויים להשפיע על תשלומים ועל זכויות בתנאים הקבועים לכל קצבה. לכן חשוב לדווח נתונים סבירים, לשלם לפי הדרישות ולתקן שינוי במקום להשאיר הצהרה ישנה.",
  "sections": [
    {
      "heading": "מדווחים על הפעילות כפי שהיא באמת",
      "paragraphs": [
        "דף הביטוח הלאומי מבקש לדווח מיד עם תחילת העבודה העצמאית. בתהליך ממלאים פרטים על העבודה, היקף השעות וההכנסה הצפויה. אין לבחור מספר נמוך כדי להפחית תשלום או מספר גבוה כדי להרגיש בטוחים; בונים הערכה על בסיס לקוחות, מחיר, זמן עבודה והוצאות צפויות ושומרים את החישוב.",
        "הגדרת עובד עצמאי בביטוח הלאומי אינה זהה בהכרח להגדרות מע״מ או מס הכנסה. אדם יכול להיות רשום כעוסק ועדיין להידרש לבחינת מעמד לפי כללי הביטוח הלאומי. אם משלבים עבודה כשכיר ועצמאי, מדווחים את התמונה המלאה ולא מניחים שתלוש השכר פותר את הטיפול בפעילות העצמאית."
      ],
      "bullets": [
        "תאריך תחילת עבודה בפועל",
        "שעות עבודה שבועיות צפויות",
        "הכנסה חודשית צפויה על בסיס סביר",
        "עיסוקים נוספים ושינויי מעמד רלוונטיים"
      ]
    },
    {
      "heading": "מסלול משולב או פנייה נפרדת",
      "paragraphs": [
        "השירות הרשמי מסביר שאפשר לפתוח תיק ברשות המסים ובביטוח הלאומי בתהליך דיגיטלי אחד במקרים המתאימים. אם תיק המס כבר נפתח ויש צורך רק בביטוח הלאומי, הדף מפנה לטופס דין וחשבון רב־שנתי. בדקו מהו המסלול שמתאים למצבכם ביום ההגשה.",
        "העברת מידע בין מערכות אינה סיבה לוותר על אימות. שמרו אישור הגשה, היכנסו לאזור האישי ובדקו שהמעמד ותאריך ההתחלה נכונים. אם לא התקבל אישור או שהנתונים שונים, פנו בערוץ הרשמי ושמרו מספר פנייה."
      ]
    },
    {
      "heading": "מקדמות וזכויות: מעדכנים כשיש שינוי",
      "paragraphs": [
        "הביטוח הלאומי מסביר שההצהרה על ההכנסה משמשת לקביעת התשלום, ושבסוף התהליך עשויה להתבצע התאמה לפי הנתונים. הוא גם מדגיש שבנסיבות מסוימות רישום ותשלום במועד רלוונטיים לבחינת זכאות לקצבאות. אין להסיק מכך סכום או זכאות אישית בלי לבדוק את תנאי הקצבה.",
        "כאשר ההכנסה או היקף העבודה משתנים, בודקים את האפשרות לעדכון לפי השירות הרשמי. אל תבטלו הוראת תשלום או תשנו סכום על דעת עצמכם. תעדו את השינוי העסקי ואת המסמכים שתומכים בו, ושלבו את ההחלטה בתחזית התזרים."
      ]
    },
    {
      "heading": "בקרה שמונעת הפתעות",
      "paragraphs": [
        "הצליבו אחת לתקופה בין ההכנסה בפועל, התחזית בביטוח הלאומי והתחזית במס הכנסה. המערכות שונות, אך פער לא מוסבר הוא סימן שצריך בדיקה. שמרו הפרדה בין דמי ביטוח לאומי, דמי בריאות, מס הכנסה ומע״מ כדי להבין מה שולם ולמי.",
        "לפני אירוע משמעותי כמו הפסקת פעילות, מעבר להתאגדות, חופשה ממושכת או שינוי היקף עבודה, בדקו אילו עדכונים נדרשים. סגירת חשבון בנק או הפסקת הפקת חשבוניות אינן בהכרח סוגרות מעמד."
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
      "q": "האם פתיחת תיק במס הכנסה פותחת תמיד גם ביטוח לאומי?",
      "a": "בחלק מהמסלולים אפשר לבקש העברת מידע, אך צריך לוודא שהמעמד נקלט בביטוח הלאומי."
    },
    {
      "q": "למה מבקשים שעות עבודה והכנסה צפויה?",
      "a": "הנתונים משמשים לבחינת המעמד ולקביעת תשלומים לפי הכללים. חשוב למסור הערכה סבירה ולעדכן שינוי."
    },
    {
      "q": "מה קורה אם ההכנסה השתנתה?",
      "a": "בודקים בשירות הרשמי כיצד לבקש תיקון מקדמות או עדכון, ולא משנים תשלום באופן חד־צדדי."
    },
    {
      "q": "האם רישום מבטיח קצבה?",
      "a": "לא. כל קצבה כפופה לתנאי זכאות. הרישום והתשלום עשויים להיות תנאים רלוונטיים בחלק מהמקרים."
    }
  ],
  "sources": [
    {
      "href": "https://www.btl.gov.il/Insurance/National%20Insurance/type_list/Self_Employed/Pages/HowToRegister.aspx",
      "label": "פתיחת תיק עצמאי — הביטוח הלאומי"
    },
    {
      "href": "https://www.gov.il/he/service/request-open-exempt-dealer-via-internet",
      "label": "פתיחת תיק משולבת לעוסק פטור — רשות המסים"
    }
  ],
  "related": [
    {
      "href": "/self-employed/social-security",
      "label": "ביטוח לאומי לעצמאים"
    },
    {
      "href": "/self-employed/opening-business",
      "label": "המדריך לפתיחת עסק עצמאי"
    },
    {
      "href": "/self-employed/first-90-days",
      "label": "90 הימים הראשונים אחרי פתיחת עוסק"
    },
    {
      "href": "/self-employed/tax-advances",
      "label": "מקדמות מס לעצמאים"
    },
    {
      "href": "/self-employed/business-finance",
      "label": "ניהול כספים לעסק קטן"
    },
    {
      "href": "/self-employed/business-setup-cost",
      "label": "תכנון עלויות הקמת עסק"
    }
  ],
  "disclaimer": "המידע כללי ואינו ייעוץ ביטוח לאומי, מס או משפטי. מעמד, תשלום וזכאות נקבעים לפי נתונים אישיים והוראות הביטוח הלאומי. יש לבדוק באזור האישי או מול המוסד."
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
