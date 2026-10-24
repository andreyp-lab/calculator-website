import type { Metadata } from 'next';
import Link from 'next/link';
import { AuthorBox } from '@/components/calculator/AuthorBox';
import { Breadcrumbs } from '@/components/calculator/Breadcrumbs';
import { DisclaimerBox } from '@/components/calculator/DisclaimerBox';
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';

const SITE_URL = 'https://cheshbonai.co.il';
const PAGE_PATH = '/business-start/partnership';
const LAST_UPDATED = '2026-10-24';
const guide = {
  "slug": "partnership",
  "title": "פתיחת שותפות בישראל: מה מחליטים לפני הרישום",
  "short": "פתיחת שותפות",
  "description": "מדריך זהיר לפתיחת שותפות: סוג השותפות, הסכם, רישום ברשם השותפויות, תיקים ברשויות, הרשאות ובקרות לפני תחילת פעילות.",
  "eyebrow": "מבנה משפטי וניהולי",
  "answerTitle": "איך פותחים שותפות בלי להשאיר החלטות קריטיות בעל פה?",
  "answer": "מתחילים בהגדרת הפעילות, חלוקת הבעלות, הסמכויות, ההשקעות ומנגנון היציאה; בודקים עם עורך דין ורואה חשבון איזה מבנה מתאים; ורק אז משלימים את הרישום ואת פתיחת התיקים הנדרשים. רישום ברשם השותפויות אינו מחליף הסכם שותפות, ורישום משפטי אינו מחליף טיפול במע״מ, מס הכנסה, ביטוח לאומי או רישוי עסק.",
  "intro": "שותפות יכולה להיראות פשוטה משום ששני אנשים מתחילים לעבוד יחד, אבל הסיכון המרכזי נמצא דווקא במה שלא נכתב: מי רשאי להתחייב, מי מביא כסף או עבודה, איך מחלקים רווחים, ומה קורה כשאחד רוצה לצאת. הדף מתמקד בסדר ההחלטות ובנקודות הבקרה, ולא מציג נוסח משפטי או המלצה למבנה מסוים.",
  "sections": [
    {
      "heading": "לפני רישום: מנסחים תמונת מצב משותפת",
      "paragraphs": [
        "כתבו מסמך עקרונות שמפריד בין בעלות, עבודה וניהול. אחוז ברווחים אינו בהכרח זהה לאחוז ההשקעה או לכוח ההצבעה, ולכן יש להגדיר כל ממד בנפרד. תעדו נכסים שכל שותף מביא, הוצאות שהעסק יחזיר, קניין רוחני, לקוחות קיימים והתחייבויות קודמות. מסמך העקרונות אינו תחליף להסכם משפטי, אך הוא חושף מחלוקות לפני שהעסק מתחייב כלפי צד שלישי.",
        "הקדישו מקום למצבי קצה: היעדרות ממושכת, צורך בהזרמת הון, חריגה מתקציב, שותף שלא עומד בתפקידו, מכירת חלק, פירוק ומחלוקת. קבעו מי מוסמך לחתום ובאיזה סכום נדרשת הסכמה נוספת, אך אל תקבעו סכומי סף מתוך מדריך כללי. הספים צריכים לנבוע מהיקף העסק ומהסכם שקיבל בדיקה מקצועית."
      ],
      "bullets": [
        "מפת תפקידים ואחריות לכל שותף",
        "מנגנון החלטות רגילות והחלטות מהותיות",
        "כללים למשיכות, שכר, החזר הוצאות וחלוקת רווחים",
        "תהליך יציאה, הצטרפות שותף חדש ויישוב מחלוקות"
      ]
    },
    {
      "heading": "רישום השותפות ותיאום עם מערכי המס",
      "paragraphs": [
        "רשות התאגידים מפעילה שירות לרישום שותפות כללית, מוגבלת או שותפות חוץ. סוג השותפות משפיע על מסמכי הרישום ועל האחריות המשפטית, ולכן הבחירה דורשת ייעוץ פרטני. בדף הרשמי יש לבדוק את ערוץ ההגשה, הטפסים והדרישות העדכניים במועד הפעולה; אין להסתמך על רשימת מסמכים שהועתקה בעבר.",
        "לאחר קביעת המבנה בודקים את הטיפול במע״מ, במס הכנסה ובניכויים. רשות המסים פרסמה מסלול מקוון למייצגים לפתיחת תיקי שותפויות במערכי המס, אך אופן הטיפול תלוי בישות ובנסיבות. כל שותף צריך להבין אילו דיווחים חלים עליו אישית ואילו חלים על השותפות. שמרו הפרדה בין מספר הרישום, מספר העוסק ומספרי התיקים האחרים."
      ]
    },
    {
      "heading": "חשבון, הרשאות ותיעוד החלטות",
      "paragraphs": [
        "הגדירו חשבון ותהליך תשלומים שמתאימים למבנה שנבחר. הבנק יבצע את בדיקותיו ויבקש מסמכים לפי מדיניותו והדין; לכן אין רשימת מסמכים או מחיר אחידים שאפשר להבטיח מראש. בקשו הצעה כתובה, בררו מי מורשה לצפות, לאשר ולחתום, ומה קורה כשאחד המורשים אינו זמין.",
        "פתחו יומן החלטות קצר: תאריך, נושא, חלופות, החלטה ואישור השותפים. שמרו חוזים ומסמכי מס בשם השותפות ולא בחשבון פרטי של אחד השותפים. גישה משותפת אינה אומרת שלכולם יש הרשאה בלתי מוגבלת; הפרדת תפקידים ובקרה כפולה על תשלומים מהותיים מצמצמות טעויות ומחלוקות."
      ]
    },
    {
      "heading": "מה לא כדאי לעשות ביום הראשון",
      "paragraphs": [
        "אל תחתמו על שכירות ארוכה, ציוד או התחייבות ללקוח לפני שבדקתם מי הצד החותם ומה נדרש להפעלת העסק. אל תציגו את הרישום כפתרון לכל היבטי האחריות. אל תערבבו תקבולים פרטיים ועסקיים, ואל תחלקו כסף לפי יתרת הבנק בלי להבין התחייבויות, מסים והון חוזר.",
        "בנו רשימת השלמה אחת שמחברת משפט, מס ותפעול: הסכם חתום, רישום שאושר, תיקים שנקלטו, הרשאות בנק, שיטת הנהלת חשבונות, ביטוחים ורישוי לפי הפעילות. רק כאשר כל בעל תפקיד יודע מה חסר אפשר להתחיל פעילות באופן נשלט."
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
      "q": "האם רישום שותפות מחליף הסכם שותפות?",
      "a": "לא. הרישום וההסכם ממלאים תפקידים שונים. הסכם מותאם מסדיר יחסים, סמכויות ומצבי יציאה, ויש לערוך אותו עם עורך דין."
    },
    {
      "q": "האם כל שותפות חייבת להירשם באותו אופן?",
      "a": "לא. קיימים סוגי שותפויות ומבנים אחרים. יש לבדוק את סוג הפעילות, האחריות והמסמכים מול רשות התאגידים ובעלי מקצוע."
    },
    {
      "q": "אפשר לפתוח חשבון לפני שכל הרישומים הושלמו?",
      "a": "יש לברר מול הבנק אילו מסמכים הוא דורש ובאיזה שלב. אין להבטיח מראש שהליך מסוים יאושר."
    },
    {
      "q": "מי מדווח למס הכנסה?",
      "a": "הטיפול בשותפות ובשותפים אינו זהה. יש לקבל מיפוי פרטני מרואה חשבון או יועץ מס ולוודא שכל תיק נפתח ונקלט."
    }
  ],
  "sources": [
    {
      "href": "https://www.gov.il/he/service/partnership_registration",
      "label": "רישום שותפות — רשות התאגידים"
    },
    {
      "href": "https://www.gov.il/he/service/itc4436",
      "label": "פתיחת תיק לתאגיד במס הכנסה או בניכויים — רשות המסים"
    }
  ],
  "related": [
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
      "href": "/self-employed/business-setup-cost",
      "label": "תכנון עלויות הקמת עסק"
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
  "disclaimer": "המידע כללי ואינו ייעוץ משפטי, מס או חשבונאי. סוג השותפות, אחריות השותפים, הסכם השותפות ואופן הדיווח דורשים בדיקה פרטנית לפני רישום או התחייבות."
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
