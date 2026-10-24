import type { Metadata } from 'next';
import Link from 'next/link';
import { AuthorBox } from '@/components/calculator/AuthorBox';
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';

const title = "זיכוי מס על תרומות: בדיקה ומימוש לפי סעיף 46";
const description = "איך בודקים אישור לתרומה, מאתרים קבלות במערכת תרומות ישראל ובוחרים מסלול מימוש בתלוש, בתיאום או בהחזר מס. מדריך עם מקורות רשמיים ובדיקות לפני הגשה.";
const pageUrl = "https://cheshbonai.co.il/personal-tax/donations-tax-credit";
const checkedAt = '2026-10-24';
const quickAnswer = "זיכוי מס על תרומה נבדק לפי אישור המוסד, נתוני התרומה והכללים של שנת המס. התחילו במדריך רשות המסים, בדקו שהתרומה משויכת אליכם במערכת תרומות ישראל, ואז בחרו בדרך המימוש המתאימה. תרומה שמופיעה באזור האישי אינה הוכחה שהזיכוי כבר ניתן בשכר. את התקרות והסכום המזערי יש לבדוק במדריך הרשמי לשנה הרלוונטית.";
const sources = [
  {
    "url": "https://www.gov.il/he/pages/tax-credit-for-donations-to-individuals",
    "label": "רשות המסים — מדריך זיכוי ממס על תרומות ליחידים"
  },
  {
    "url": "https://www.gov.il/he/pages/tax-credit-for-donations-to-individuals?chapterIndex=2",
    "label": "רשות המסים — זכאות ודרכי מימוש הזיכוי"
  },
  {
    "url": "https://www.gov.il/he/pages/tax-credit-for-donations-to-individuals?chapterIndex=4",
    "label": "רשות המסים — תרומות שלא דווחו ופרטי תורם חסרים"
  },
  {
    "url": "https://www.gov.il/he/service/tax-coordination-online",
    "label": "רשות המסים — עריכת תיאום מס מקוון"
  },
  {
    "url": "https://www.gov.il/he/service/itc135",
    "label": "רשות המסים — בקשה להחזר מס"
  }
];
const sections = [
  {
    "heading": "מה בודקים לפני שסופרים את התרומה כהטבת מס?",
    "source": 0,
    "paragraphs": [
      "לא כל העברה לעמותה היא בהכרח תרומה המוכרת לצורך זיכוי. מדריך רשות המסים עוסק בתרומות למוסדות ציבור המוכרים לפי סעיף 46. לכן נקודת ההתחלה היא זיהוי הגוף שקיבל את הכסף ובדיקת האישור המתאים, ולא רק שם הקמפיין או מטרת גיוס הכספים. מתוך הקישורים במדריך הרשמי הגיעו לבדיקת המוסד, והשוו את זהותו לפרטים שעל הקבלה. שמרו את תוצאת הבדיקה לצד מסמך התרומה כדי שתוכלו לחזור אליה בעת הכנת הבקשה.",
      "אם מופיעים שם מסחרי, שם מיזם ושם משפטי שונים, בקשו מהגוף המקבל להסביר מי הוציא את הקבלה. אל תסיקו מאישור של גוף קשור שגם התרומה שלכם עומדת בתנאים. כשיש ספק לגבי תוקף האישור ביחס לתרומה המסוימת, בררו אותו עם רשות המסים לפני הזנתה כחלק מזיכוי מבוקש."
    ]
  },
  {
    "heading": "איך להפריד בין סכום התרומה לבין הזיכוי?",
    "source": 0,
    "paragraphs": [
      "לפי המדריך הרשמי, שיעור הזיכוי ליחיד הוא 35% מסכום התרומה, בכפוף לסכום המזערי, לתקרות ולחבות המס. זהו שיעור לחישוב ההטבה האפשרית; הסכום שהעברתם לעמותה אינו הסכום שיוחזר לכם. את הסף ואת התקרה בדקו בפרק הפותח במדריך, תוך התאמה לשנת התרומה. אין להשתמש בנתוני שנה אחרת רק מפני שהבקשה מוגשת עכשיו.",
      "לצורך בדיקה מסודרת, הכינו ריכוז של התרומות לפי שנת מס, שם המוסד והסכום שבקבלה. הוסיפו עמודה נפרדת למצב המימוש: טרם התבקש, הוגש לבדיקה, או נכלל באישור. הריכוז הוא כלי עבודה שלכם ואינו מחליף בדיקת זכאות. הוא עוזר לזהות תרומה שהוזנה בטעות פעמיים או קבלה של שנה אחרת שהצטרפה לתיק."
    ]
  },
  {
    "heading": "מה לבדוק במערכת תרומות ישראל?",
    "source": 2,
    "paragraphs": [
      "המדריך הרשמי מפרט טיפול בתרומה שלא מופיעה באזור האישי, ובפרט במצב שבו חסר מספר הזהות של התורם. במקרה כזה פונים לעמותה לצורך עדכון הפרט ושיוך התרומה. פתחו את המדריך מהקישור למטה ועברו לפרק העוסק בתרומה שלא דווחה. השוו בין הקבלה שבידכם לבין המידע שמופיע במערכת, ואל תנסו לפתור פער באמצעות יצירת רישום נוסף ללא בירור.",
      "מומלץ לרשום לעצמכם מה חסר: התרומה כולה, פרטי הזיהוי, סכום או מסמך תומך. כך הפנייה לעמותה תהיה ממוקדת. בקשו אישור שהפנייה התקבלה ושמרו את התשובה. כאשר התרומה מופיעה לאחר תיקון, בדקו שוב את התאמתה לקבלה המקורית. עצם הופעת הרשומה במערכת אינה עונה על השאלה אם הזיכוי כבר נוצל במסלול אחר."
    ]
  },
  {
    "heading": "מימוש בתלוש השכר או באמצעות תיאום מס",
    "source": 1,
    "paragraphs": [
      "לפי רשות המסים, מימוש הזיכוי ישירות בשכר באמצעות המערכת מותנה בהתממשקות תוכנת השכר ובאישור העובד למעסיק העיקרי באזור האישי. לכן לפני שממתינים לשינוי בתלוש, שאלו את מחלקת השכר אם המסלול פעיל אצל המעסיק ואילו פעולות דרושות מצדכם. אם המעסיק אינו מחובר, המדריך מפנה גם לאפשרות של תיאום מס.",
      "הכינו לשיחה את פרטי שנת המס ואת מצב התרומות במערכת. בקשו להבין היכן יוצג הזיכוי בתלוש ואיך ייבדק שהאישור נקלט. כשנדרש תיאום מס, העבירו למעסיק את האישור שהופק בהתאם להנחיות השירות. שמירת צילום מסך של בקשה אינה תחליף להעברת האישור. לאחר הטיפול השוו את האישור לתלוש ובדקו שהשינוי המבוקש אכן משתקף בחישוב."
    ]
  },
  {
    "heading": "תרומה שלא דווחה או תרומה בשווה כסף",
    "source": 2,
    "paragraphs": [
      "במדריך הרשמי קיימת הבחנה בין תרומה שדווחה במערכת לבין תרומה שלא דווחה, וכן התייחסות נפרדת לתרומה בשווה כסף. אין להסיק מהמסלול של תרומה כספית רגילה שכל תרומת ציוד תטופל באותה דרך. עבור שווה כסף המדריך מפנה להגשת דוח להחזר מס או דוח שנתי, ואינו מתאר זיכוי אוטומטי בתלוש.",
      "אם תרמתם ציוד, אספו את התיעוד שקיבלתם ובקשו הבהרה על אופן הדיווח של המוסד. אל תקבעו שווי לצורך מס רק לפי מחיר פרסום של פריט דומה. אם התרומה אינה מוצגת במערכת, עיינו בפרק המתאים לפני בחירת מסלול ההגשה. כדאי לצרף לבירור תיאור קצר של המקרה, מבלי לשנות את התאריך או הסכום של המסמך המקורי."
    ]
  },
  {
    "heading": "בדיקת שנה שהסתיימה והחזר מס",
    "source": 4,
    "paragraphs": [
      "שירות החזר המס המקוצר של רשות המסים מיועד ליחידים המתאימים לתנאי השירות ואינם חייבים בדוח שנתי. לפני הגשה בדקו את ההתאמה שלכם, את שנות הבקשה הפתוחות ואת רשימת המסמכים המעודכנת. מי שחייבים בהגשת דוח צריכים לברר את הטיפול במסגרת הדיווח המתאימה להם; קבלה על תרומה אינה קובעת לבדה באיזה טופס משתמשים.",
      "כדי לבדוק את התוצאה, רכזו את מלוא נתוני ההכנסה והמס של השנה לצד התרומות. אל תסתמכו על התלוש האחרון בלבד כאשר היו מעסיקים נוספים. המחשבון הפנימי יכול לסייע באומדן במקרים שהוא תומך בהם, אבל תוצאה חיובית אינה אישור מהרשות. שמרו עותק של הנתונים שהוגשו ושל המסמכים, כדי שתוכלו לענות לפנייה בלי להרכיב מחדש את התיק."
    ]
  },
  {
    "heading": "איך למנוע כפל בקשה ולטפל בפערים?",
    "source": 3,
    "paragraphs": [
      "דרך מעשית לסיים את הבדיקה היא התאמה בין רשימת התרומות, אישורי המס ותלושי השכר. אם אינכם יודעים אם זיכוי מסוים כבר נלקח בחשבון, בקשו ממחלקת השכר הסבר לחישוב לפני הגשה נוספת. בתיאום מס קיים אפשר לבקש עדכון לפי הוראות השירות הרשמי ולצרף מסמכים תומכים כשנדרש. יש להציג נתונים מלאים ולא להסתפק בסכום ההחזר הרצוי.",
      "כאשר פונים לבירור, ציינו מה ניסיתם לממש, באיזה מסלול ומה בדיוק אינו תואם. למשל: התרומה מופיעה באזור האישי אך לא ברור אם האישור הגיע למעסיק. ניסוח כזה מפריד בין בעיית רישום לבין בעיית יישום בשכר. אם התקבלה החלטה או דרישת מסמכים, קראו את הנימוק ושמרו אותו לצד הבקשה. אין בעמוד הזה קביעה שהרשות תאשר מקרה מסוים."
    ]
  }
];
const faqItems = [
  {
    "question": "האם כל תרומה לעמותה מזכה במס?",
    "answer": "אין להניח זאת. בדקו את זהות המוסד ואת ההכרה הרלוונטית לפי סעיף 46 באמצעות המדריך הרשמי, וכן את כללי שנת התרומה. קבלה לבדה אינה מסיימת את בירור הזכאות."
  },
  {
    "question": "מה עושים כשהתרומה אינה באזור האישי?",
    "answer": "השוו לקבלה ועיינו בפרק הרשמי על תרומות שלא דווחו. אם חסר מספר זהות, המדריך מפנה לתורם לפנות לעמותה לצורך עדכון ושיוך. בחרו את מסלול המימוש רק לאחר בירור הפער."
  },
  {
    "question": "האם צריך לבקש שוב זיכוי שכבר ניתן בשכר?",
    "answer": "לפני הגשה נוספת בדקו מה כבר נכלל בתלוש ובאישורי המס. יש להתאים את הנתונים למסלול ההגשה ולכלול את המידע הנדרש, בלי לספור את אותה הטבה פעמיים."
  }
];

export const metadata: Metadata = {
  title: { absolute: `${title} | חשבונאי` },
  description,
  alternates: { canonical: pageUrl },
  openGraph: {
    title, description, url: pageUrl, type: 'article', locale: 'he_IL',
    siteName: 'חשבונאי', modifiedTime: checkedAt,
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: title }],
  },
  twitter: { card: 'summary_large_image', title, description, images: ['/opengraph-image'] },
};

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  '@id': `${pageUrl}#article`,
  headline: title,
  description,
  url: pageUrl,
  mainEntityOfPage: pageUrl,
  inLanguage: 'he-IL',
  datePublished: checkedAt,
  dateModified: checkedAt,
  author: { '@type': 'Organization', name: 'מערכת חשבונאי', url: 'https://cheshbonai.co.il/about' },
  publisher: { '@type': 'Organization', name: 'חשבונאי', url: 'https://cheshbonai.co.il' },
  citation: sources.map((source) => source.url),
};
const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  '@id': `${pageUrl}#faq`,
  mainEntity: faqItems.map((item) => ({
    '@type': 'Question', name: item.question,
    acceptedAnswer: { '@type': 'Answer', text: item.answer },
  })),
};

export default function DonationsTaxCreditPage() {
  return (
    <main dir="rtl" className="mx-auto max-w-4xl px-5 py-12 text-ink">
      <BreadcrumbSchema items={[
        { name: 'דף הבית', url: '/' },
        { name: 'מיסוי אישי', url: '/personal-tax' },
        { name: title, url: pageUrl },
      ]} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify([articleSchema, faqSchema]).replace(/</g, '\\u003c'),
      }} />
      <nav aria-label="פירורי לחם" className="mb-8 text-sm text-ink/70">
        <Link href="/" className="underline">דף הבית</Link>
        {' / '}<Link href="/personal-tax" className="underline">מיסוי אישי</Link>
        {' / '}<span aria-current="page">{title}</span>
      </nav>
      <article className="space-y-8">
        <header>
          <h1 className="font-serif text-3xl leading-tight md:text-4xl">{title}</h1>
          <p className="mt-4 text-sm text-ink/70">
            מאת מערכת חשבונאי · תאריך בדיקת המקורות: <time dateTime={checkedAt}>24.10.2026</time>
          </p>
        </header>
        <section aria-labelledby="quick-answer" className="border border-gold/40 bg-paper p-6">
          <h2 id="quick-answer" className="mb-3 text-xl font-bold">תשובה מהירה</h2>
          <p className="leading-8">{quickAnswer}</p>
          <a href={sources[0].url} className="mt-3 inline-block text-gold underline" target="_blank" rel="noopener noreferrer">
            המקור הרשמי לבדיקה
          </a>
        </section>
        <aside aria-label="הבהרה חשובה" className="border-r-4 border-gold bg-paper p-5 leading-8">
          המידע בעמוד הוא הסבר כללי בלבד ואינו ייעוץ מס או ייעוץ משפטי. אין בו קביעה של זכאות אישית
          או הבטחה להחזר. לפני הגשה או החלטה בדקו את המקור הרשמי לשנת המס ולנסיבות שלכם,
          ובמקרה הצורך פנו לרואה חשבון, ליועץ מס או לעורך דין. הוראות הדין והחלטת הרשות הן הקובעות.
        </aside>
        <nav aria-label="תוכן העניינים" className="border border-ink/15 p-5">
          <h2 className="mb-3 text-lg font-bold">מה תמצאו במדריך?</h2>
          <ul className="list-inside list-disc space-y-2">
            {sections.map((section, index) => (
              <li key={section.heading}><a href={`#section-${index + 1}`} className="underline">{section.heading}</a></li>
            ))}
          </ul>
        </nav>
        {sections.map((section, index) => (
          <section key={section.heading} aria-labelledby={`section-${index + 1}`} className="space-y-4">
            <h2 id={`section-${index + 1}`} className="scroll-mt-24 text-2xl font-bold">{section.heading}</h2>
            {section.paragraphs.map((paragraph) => <p key={paragraph} className="leading-8">{paragraph}</p>)}
            <p className="text-sm leading-7 text-ink/70">
              מקור: <a className="text-gold underline" href={sources[section.source].url} target="_blank" rel="noopener noreferrer">
                {sources[section.source].label}
              </a>
            </p>
          </section>
        ))}
        <section aria-labelledby="faq" className="space-y-5">
          <h2 id="faq" className="text-2xl font-bold">שאלות נפוצות</h2>
          {faqItems.map((item) => (
            <div key={item.question}>
              <h3 className="mb-2 text-lg font-bold">{item.question}</h3>
              <p className="leading-8">{item.answer}</p>
            </div>
          ))}
        </section>
        <section aria-labelledby="official-sources" className="border border-ink/15 p-6">
          <h2 id="official-sources" className="mb-3 text-2xl font-bold">מקורות רשמיים ותאריך בדיקה</h2>
          <p className="mb-4 leading-8">
            המקורות נבדקו ב־24.10.2026. המדריך מבוסס על דפי רשות המסים ו־gov.il.
            כאשר רשימה או טבלה מתעדכנת, יש לפתוח את המקור ולבחור את שנת המס המתאימה.
            אם המקור אינו נגיש, אין להסתמך על עותק לא מאומת לצורך קביעת זכאות.
          </p>
          <ul className="list-inside list-disc space-y-3 leading-7">
            {sources.map((source) => (
              <li key={source.url}><a href={source.url} className="text-gold underline" target="_blank" rel="noopener noreferrer">{source.label}</a></li>
            ))}
          </ul>
        </section>
        <section aria-labelledby="related-reading">
          <h2 id="related-reading" className="mb-4 text-2xl font-bold">כלים ומדריכים להמשך הבדיקה</h2>
          <p className="mb-4 leading-8">הכלים באתר מסייעים להבין את חישוב המס. יש להזין זכאות שאומתה במקור הרשמי, ולבדוק את תחומי הכיסוי של כל מחשבון לפני שימוש בתוצאה.</p>
          <ul className="grid gap-3 sm:grid-cols-2">
            {[
              ['/personal-tax/tax-credits', 'מדריך נקודות זיכוי במס הכנסה'],
              ['/personal-tax/income-tax', 'מחשבון מס הכנסה'],
              ['/personal-tax/salary-net-gross', 'מחשבון שכר ברוטו ונטו'],
              ['/personal-tax/tax-refund', 'בדיקת אומדן החזר מס'],
              ['/personal-tax/tax-return-full', 'חישוב מס שנתי — תחומי הכיסוי'],
              ['/salaried/payslip-guide', 'מדריך לקריאת תלוש השכר'],
              ["/personal-tax/degree-tax-credit","זיכוי מס לתואר אקדמי: אישורים וטופס 119"],
              ["/personal-tax/locality-tax-credit","זיכוי מס לתושבי יישוב מזכה: בדיקת תושבות"],
              ["/personal-tax/new-immigrant-tax-benefits","הטבות מס לעולים חדשים: זיכוי, פטור ודיווח"],
            ].map(([href, label]) => (
              <li key={href}><Link className="text-gold underline" href={href}>{label}</Link></li>
            ))}
          </ul>
        </section>
        <p className="text-sm leading-7 text-ink/70">אחריות התוכן: מערכת חשבונאי. פרטי בעל האתר מופיעים להלן ובדף האודות; אין בהצגתם אישור לבדיקה מקצועית פרטנית של נסיבות הקורא.</p>
        <AuthorBox />
      </article>
    </main>
  );
}

