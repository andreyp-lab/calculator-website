import type { Metadata } from 'next';
import Link from 'next/link';
import { AuthorBox } from '@/components/calculator/AuthorBox';
import { Breadcrumbs } from '@/components/calculator/Breadcrumbs';
import { DisclaimerBox } from '@/components/calculator/DisclaimerBox';
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';

const SITE_URL = 'https://cheshbonai.co.il';
const PAGE_PATH = '/business-start/pricing-first-service';
const LAST_UPDATED = '2026-10-24';
const guide = {
  "slug": "pricing-first-service",
  "title": "איך מתמחרים שירות ראשון בעסק חדש",
  "short": "תמחור שירות ראשון",
  "description": "שיטה מעשית לתמחור שירות ראשון: הגדרת תוצאה, היקף, זמן, עלויות, סיכון, תנאי תשלום ובדיקת רווחיות אחרי הביצוע.",
  "eyebrow": "תמחור ומכירה",
  "answerTitle": "איך קובעים מחיר לשירות הראשון?",
  "answer": "מגדירים במדויק מה הלקוח מקבל ומה לא, מעריכים זמן ישיר ועקיף, עלויות, סיכון וקיבולת, ובודקים אם המחיר משאיר רווח סביר אחרי כל המרכיבים. מציגים הצעה ברורה עם תנאי תשלום ושינוי היקף. אין מחיר שוק יחיד שאפשר להעתיק; בודקים חלופות ומקבלים נתונים או הצעות עדכניות.",
  "intro": "המחיר הראשון יוצר ציפייה אצל הלקוח וגם אצלכם. מחיר נמוך מדי עלול להפוך כל עבודה להפסד, ומחיר גבוה ללא הגדרת ערך יקשה על המכירה. המטרה אינה למצוא מספר קסם אלא לבנות הנחה שאפשר למדוד ולשפר.",
  "sections": [
    {
      "heading": "מגדירים יחידת שירות ותוצאה",
      "paragraphs": [
        "כתבו משפט אחד שמסביר את התוצאה, את נקודת הסיום ואת מה שהלקוח צריך לספק. לאחר מכן פרטו שלבים, מספר סבבי תיקון, פורמט מסירה, זמינות ולוח עבודה משוער. בלי גבול ברור, המחיר מתייחס למוצר אחד והלקוח מדמיין מוצר אחר.",
        "הפרידו בין ליבה לתוספות. אפשר להציג חבילות, אך כל חבילה צריכה הבדל אמיתי בהיקף או בתוצאה. אל תוסיפו תכונות רק כדי להצדיק מחיר. קבעו מנגנון כתוב לשינוי היקף לפני שמתחילה עבודה נוספת."
      ],
      "bullets": [
        "תוצאה ומסירת סיום",
        "מה כלול ומה מוחרג",
        "אחריות הלקוח וחומרי קלט",
        "סבבי תיקון ותהליך אישור"
      ]
    },
    {
      "heading": "מחשבים עלות מלאה וקיבולת",
      "paragraphs": [
        "העריכו שעות ביצוע, שיחות, מכירה, הכנה, תיקונים, גבייה וניהול. הוסיפו כלים, קבלני משנה, עמלות וסיכון סביר. לאחר מכן בדקו כמה יחידות שירות אפשר לבצע בחודש בלי לפגוע באיכות. לא כל שעת עבודה ניתנת לחיוב, ולכן חלוקת יעד ההכנסה רק בשעות הביצוע עלולה להטעות.",
        "השתמשו בשלושה תרחישים: מהיר, סביר ומורכב. המחיר או תנאי ההצעה צריכים להגן מפני התרחיש המורכב בלי להעניש לקוח פשוט. אם אי־הוודאות גדולה, אפשר לבצע שלב אבחון בתשלום או לקבל הצעה מספק חיצוני לפני התחייבות."
      ]
    },
    {
      "heading": "בוחרים מודל מחיר ותנאי תשלום",
      "paragraphs": [
        "מחיר קבוע מתאים כאשר ההיקף ברור; מחיר לפי שעה מתאים כאשר השינוי מובנה; ריטיינר מתאים לזמינות ותפוקה מתמשכת; ותמחור לפי שלבים מתאים לפרויקט. אין מודל טוב תמיד. בחרו לפי יכולת למדוד היקף ולנהל סיכון.",
        "כתבו האם המחיר כולל מע״מ לפי מעמד העסק, מתי מפיקים מסמך, מתי התשלום נדרש ומה קורה בביטול או דחייה. אל תעתיקו תנאי תשלום שאינם מתאימים לתזרים שלכם. לפני פרסום ודאו שהניסוח תואם למעמד במע״מ ולמסמכים שאתם רשאים להפיק."
      ]
    },
    {
      "heading": "בודקים את המחיר אחרי העבודה הראשונה",
      "paragraphs": [
        "בסיום רשמו זמן בפועל, עלויות, חריגות, מספר תיקונים וזמן גבייה. השוו להצעה בלי להאשים את הלקוח או את עצמכם; המטרה היא לזהות הנחה שגויה. אם העבודה הייתה רווחית רק משום שלא ספרתם שעות ניהול, תקנו את המודל.",
        "אספו משוב על הערך ועל בהירות התהליך, לא רק על המחיר. עדכנו תבנית הצעה, צ׳קליסט קלט והחרגות. מחיר חדש צריך להתבסס על נתונים מהביצוע ועל מיצוב, ולא על העלאה שרירותית."
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
      "q": "האם כדאי לתת מחיר היכרות?",
      "a": "רק אם מגדירים למה, לכמה זמן ומה המחיר הרגיל. הנחה לא מתקנת היקף לא ברור או עלות שלא חושבה."
    },
    {
      "q": "מחיר קבוע או שעתי?",
      "a": "קבוע מתאים להיקף ברור; שעתי מתאים לאי־ודאות. אפשר לשלב שלבים, תקרה או מנגנון שינוי."
    },
    {
      "q": "איך יודעים שהמחיר רווחי?",
      "a": "עוקבים אחרי זמן ועלויות בפועל ומשווים להכנסה לפני ואחרי מסים והתחייבויות רלוונטיות."
    },
    {
      "q": "האם להציג מחיר כולל מע״מ?",
      "a": "הניסוח תלוי במעמד ובקהל. יש להציג את המחיר באופן ברור ובהתאם לדין ולמעמד העוסק."
    }
  ],
  "sources": [],
  "related": [
    {
      "href": "/self-employed/hourly-rate",
      "label": "חישוב תעריף לשעה"
    },
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
      "href": "/self-employed/opening-business",
      "label": "המדריך לפתיחת עסק עצמאי"
    },
    {
      "href": "/self-employed/vat",
      "label": "מדריך מע״מ לעצמאים"
    }
  ],
  "disclaimer": "המידע כללי ואינו ייעוץ עסקי, משפטי או מס. המחיר, תנאי ההצעה והרווחיות תלויים בשירות, בשוק, בעלויות ובמעמד העסק. יש לבצע בדיקה פרטנית."
} as const;
const sources = guide.sources as readonly { href: string; label: string }[];

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
        {sources.length > 0 ? <section className="mb-10 border border-ink/15 p-5"><h2 className="mb-3 text-2xl font-bold text-ink">מקורות רשמיים</h2><ul className="space-y-2 text-sm">{sources.map((source) => <li key={source.href}><a href={source.href} target="_blank" rel="noopener noreferrer" className="font-medium text-gold underline underline-offset-4">{source.label} ↗</a></li>)}</ul><p className="mt-4 text-xs leading-relaxed text-ink/60">המקורות נבדקו ביום {LAST_UPDATED}. במקרה של סתירה, הוראות הדין וההודעה האישית של הרשות גוברות על מדריך זה.</p></section> : null}
        <section className="mb-10"><h2 className="mb-6 text-2xl font-bold text-ink">שאלות נפוצות</h2><div className="space-y-4">{guide.faq.map((item) => <details key={item.q} className="group border border-ink/15 p-4"><summary className="flex cursor-pointer list-none items-center justify-between font-bold text-ink">{item.q}<span className="text-ink/70 transition group-open:rotate-180" aria-hidden>▾</span></summary><p className="mt-3 leading-relaxed text-ink/70">{item.a}</p></details>)}</div></section>
        <section className="mb-8"><AuthorBox /></section>
        <DisclaimerBox text={guide.disclaimer} />
      </article>
    </div>
  );
}
