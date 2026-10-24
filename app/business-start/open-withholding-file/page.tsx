import type { Metadata } from 'next';
import Link from 'next/link';
import { AuthorBox } from '@/components/calculator/AuthorBox';
import { Breadcrumbs } from '@/components/calculator/Breadcrumbs';
import { DisclaimerBox } from '@/components/calculator/DisclaimerBox';
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';

const SITE_URL = 'https://cheshbonai.co.il';
const PAGE_PATH = '/business-start/open-withholding-file';
const LAST_UPDATED = '2026-10-24';
const guide = {
  "slug": "open-withholding-file",
  "title": "פתיחת תיק ניכויים לעסק: מתי צריך ומה עושים",
  "short": "פתיחת תיק ניכויים",
  "description": "מדריך לפתיחת תיק ניכויים בעת העסקת עובדים או תשלומים רלוונטיים: מס הכנסה, ביטוח לאומי, שכר, דיווחים ובקרות.",
  "eyebrow": "מעסיקים ומשלמים",
  "answerTitle": "מתי עסק צריך לפתוח תיק ניכויים?",
  "answer": "עסק שמתחיל להעסיק עובדים צריך לפתוח תיק ניכויים במס הכנסה; המידע מועבר לביטוח הלאומי, שפותח תיק מעסיק לפי התהליך הרשמי. תיק עשוי להידרש גם בנסיבות תשלום אחרות, כגון שכירות או תשלומים שעליהם חלה חובת ניכוי. בודקים את המקרה לפני התשלום הראשון ומוודאים ששני התיקים נקלטו.",
  "intro": "תיק ניכויים הוא תשתית לדיווח על סכומים שנוכו מתשלומים, ולא אישור כללי לנכות כסף מכל ספק. הסיבה לפתיחה, סוג הדיווח והטפסים תלויים ביחסים עם העובד, המשכיר או מקבל התשלום. לפני גיוס או תשלום בונים תהליך שכר ותיעוד.",
  "sections": [
    {
      "heading": "מזהים את הטריגר לפתיחת התיק",
      "paragraphs": [
        "הטריגר הברור הוא עובד ראשון. דף הביטוח הלאומי קובע שמעסיק חדש המעסיק עובדים חייב לפתוח תיק ניכויים במס הכנסה, ולאחר מכן המידע מועבר לביטוח הלאומי לצורך פתיחת תיק מעסיק. אל תחכו לתלוש הראשון כדי להתחיל את הטיפול.",
        "גם שכירת נכס לצורך פעילות או תשלומים מסוימים לספקים עשויים ליצור חובת ניכוי או תיק, לפי הדין והאישורים. השירות לעוסק פטור מציין שכאשר מעסיקים עובדים או שוכרים נכס לצורך העסק, יש לפתוח תיק ניכויים לדיווח על תשלומים אלה. בדקו את ההסכם ואת סוג התשלום עם מייצג."
      ],
      "bullets": [
        "תאריך תחילת העסקה או התשלום",
        "זהות מקבל התשלום והיחסים המשפטיים",
        "הסכם, פרטי שכר או שכירות",
        "אישור ניכוי מס במקור כשנדרש"
      ]
    },
    {
      "heading": "פותחים במס הכנסה ומוודאים בביטוח הלאומי",
      "paragraphs": [
        "ליחיד ניתן להשתמש בטופס ובשירות המתאים לפי הנסיבות; לתאגידים קיים טופס 4436 וערוצי הגשה שמפורטים בשירות הרשמי. אל תשתמשו בטופס של יחיד עבור חברה או להפך. שמרו עותק מלא ואישור הגשה.",
        "אחרי פתיחת התיק במס הכנסה, בדקו שהמידע נקלט ושנפתח תיק מעסיק בביטוח הלאומי. לפי דף הביטוח הלאומי, המעסיק מקבל הודעה ושאלון להשלמת פרטים. השיבו לפי ההנחיות ואל תניחו שהעברת המידע פוטרת ממעקב."
      ]
    },
    {
      "heading": "בונים תהליך שכר ודיווח לפני התשלום",
      "paragraphs": [
        "קבעו מי אוסף דיווחי שעות, מי מחשב שכר, מי מאשר ומי משלם. שמרו הסכם העסקה, טופסי עובד, נתוני קופות והוכחות תשלום בהתאם לדין. תיק ניכויים לבדו אינו משלים חובות שכר, פנסיה, זכויות עובדים או דיווחים אחרים.",
        "הפרידו בין סכומים שנוכו מהעובד או מהמקבל לבין הוצאות העסק. סכום שנוכה מיועד להעברה לרשות ואינו תזרים פנוי. התאימו בין דוחות השכר, תנועות הבנק והדיווחים בכל תקופה."
      ]
    },
    {
      "heading": "דיווחים תקופתיים ושנתיים",
      "paragraphs": [
        "לאחר פתיחת התיק תקבלו הנחיות לגבי דיווחים ותשלומים. פעלו לפי התקופה והמועד שנקבעו לתיק. רשות המסים מפעילה שירות לדוחות שנתיים 126 ו־856 המתייחסים לתשלומים לעובדים או למקבלי תשלום אחרים ולמס שנוכה במקור.",
        "בסיום כל תקופה שמרו אישור שידור ותשלום. בסוף השנה בצעו התאמה בין הדוחות התקופתיים, השנתיים, ספרי העסק ואישורי העובדים או הספקים. אם נפסקה העסקה, בדקו אם נדרש עדכון או סגירת תיק; הפסקת תשלום אינה סוגרת תיק אוטומטית."
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
      "q": "האם עובד ראשון מחייב תיק ניכויים?",
      "a": "כן. לפי הביטוח הלאומי, מעסיק חדש פותח תיק ניכויים במס הכנסה, והמידע מועבר לפתיחת תיק מעסיק."
    },
    {
      "q": "האם שכירות עסקית יכולה לחייב תיק?",
      "a": "כן, בנסיבות המתוארות בשירותי רשות המסים. יש לבדוק את ההסכם וחובת הניכוי עם מייצג."
    },
    {
      "q": "האם ביטוח לאומי נפתח אוטומטית?",
      "a": "המידע מועבר ממס הכנסה לפי התהליך הרשמי, אך יש לוודא שהפתיחה הושלמה ולהשיב לכל דרישה."
    },
    {
      "q": "מהם דוחות 126 ו־856?",
      "a": "אלה דיווחים שנתיים על תשלומים וניכויים לעובדים או למקבלי תשלום אחרים, לפי סוג הדוח והחובה."
    }
  ],
  "sources": [
    {
      "href": "https://www.btl.gov.il/Insurance/National%20Insurance/type_list/%D7%9E%D7%99%D7%93%D7%A2%20%D7%9C%D7%9E%D7%A2%D7%A1%D7%99%D7%A7%D7%99%D7%9D%20%D7%94%D7%9E%D7%A2%D7%A1%D7%99%D7%A7%D7%99%D7%9D%20%D7%A2%D7%95%D7%91%D7%93%D7%99%D7%9D%20%D7%91%D7%A2%D7%A1%D7%A7/Pages/%D7%A4%D7%AA%D7%99%D7%97%D7%AA%20%D7%AA%D7%99%D7%A7%20%D7%A0%D7%99%D7%9B%D7%95%D7%99%D7%99%D7%9D.aspx",
      "label": "פתיחת תיק ניכויים למעסיק — הביטוח הלאומי"
    },
    {
      "href": "https://www.gov.il/he/service/itc4436",
      "label": "טופס 4436 לתאגיד — רשות המסים"
    },
    {
      "href": "https://www.gov.il/he/service/report126",
      "label": "שידור דוחות 126 ו־856 — רשות המסים"
    }
  ],
  "related": [
    {
      "href": "/self-employed/withholding-tax",
      "label": "ניכוי מס במקור"
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
      "href": "/self-employed/business-finance",
      "label": "ניהול כספים לעסק קטן"
    },
    {
      "href": "/self-employed/invoices",
      "label": "חשבוניות, קבלות ומסמכי העסק"
    },
    {
      "href": "/self-employed/tax-advances",
      "label": "מקדמות מס לעצמאים"
    }
  ],
  "disclaimer": "המידע כללי ואינו ייעוץ מס, שכר או דיני עבודה. חובת פתיחת תיק, ניכוי, דיווח ותשלום תלויה בזהות המשלם, מקבל התשלום וההתקשרות. יש לבדוק פרטנית."
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
