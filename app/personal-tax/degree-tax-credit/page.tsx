import type { Metadata } from 'next';
import Link from 'next/link';
import { AuthorBox } from '@/components/calculator/AuthorBox';
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';

const title = "זיכוי מס לתואר אקדמי: אישורים וטופס 119";
const description = "מדריך לזיכוי מס על תואר אקדמי ולימודי מקצוע: שנת סיום, אישור זכאות, טופס 119 ובחירת דרך המימוש. קראו איך להכין בקשה לפי מקורות רשות המסים העדכניים.";
const pageUrl = "https://cheshbonai.co.il/personal-tax/degree-tax-credit";
const checkedAt = '2026-10-24';
const quickAnswer = "הטבת המס על סיום תואר נבדקת לפי סוג הלימודים, שנת הסיום והמסמכים המעידים על הזכאות. התחילו בדף טופס 119 של רשות המסים; הוא מבחין בין מסיימי לימודים בתקופות שונות ומסביר את דרכי המימוש. אין להעתיק זכאות של בוגר אחר או להניח שתאריך טקס הענקת התואר הוא הנתון הדרוש לבקשה.";
const sources = [
  {
    "url": "https://www.gov.il/he/service/itc119",
    "label": "רשות המסים — הטבה לבעלי תואר אקדמי או תעודת מקצוע, טופס 119"
  },
  {
    "url": "https://www.gov.il/he/service/tax-coordination-online",
    "label": "רשות המסים — תיאום מס ובקשת הקלות"
  },
  {
    "url": "https://www.gov.il/he/service/itc135",
    "label": "רשות המסים — החזר מס לשנים קודמות"
  }
];
const sections = [
  {
    "heading": "איזה מסמך מסביר אם סיימתם את הלימודים?",
    "source": 0,
    "paragraphs": [
      "דף השירות הרשמי מתייחס למסיימי תואר אקדמי במוסד מוכר להשכלה גבוהה שיש בידיהם אישור זכאות לתואר. לכן לפני שמתחילים בחישוב כדאי לאתר את האישור הרלוונטי של המוסד, לקרוא את סוג התואר ואת מועד הזכאות המופיעים בו ולהשוות לפרטים שבבקשה. גיליון ציונים, קבלה על שכר לימוד והזמנה לטקס הם מסמכים בעלי מטרות אחרות; אל תבחרו מתוכם תאריך נוח בלי לבדוק מה נדרש.",
      "אם חסר אישור או שיש בו נתון לא ברור, פנו למוסד הלימודים ובקשו הבהרה. אפשר להכין רשימה קצרה הכוללת את שם המסלול, התואר, שנת הסיום והאישור התומך. כך קל יותר לזהות סתירה בין המסמכים לפני שהם מגיעים למעסיק או לרשות המסים. התיעוד נועד להציג עובדות, ואינו מחליף בדיקת תנאי הזכאות עצמם."
    ]
  },
  {
    "heading": "למה שנת הסיום משנה את הבדיקה?",
    "source": 0,
    "paragraphs": [
      "בדף טופס 119 קיימת הבחנה בין מסיימי לימודים בשנים 2014–2022 לבין מסיימים משנת 2023 ואילך. בין היתר, הדף מסביר שלמסיימים משנת 2023 ההטבה מתחילה בשנת המס שלאחר סיום הלימודים או ההתמחות במקצועות שבהם נדרשת התמחות. אל תשתמשו בכלל של קבוצה אחרת רק משום שהוא מופיע באותו עמוד.",
      "דרך טובה לקריאת ההנחיות היא להניח את אישור הזכאות ליד דף השירות, לבחור תחילה את תקופת הסיום ורק אחר כך את סוג התואר. רשמו איזו שנת מס אתם מבקשים לבדוק ומהו המקור לבחירה. אם אתם בוחנים שנה קודמת, יש לברר את הכללים שחלו על אותה שנה. שנת הכנת הבקשה אינה משנה מעצמה את שנת סיום הלימודים או את קבוצת הזכאות."
    ]
  },
  {
    "heading": "תואר ראשון, תואר שני ומסלולים מיוחדים",
    "source": 0,
    "paragraphs": [
      "רשות המסים מפרטת בדף השירות מסלולים נפרדים לתואר ראשון, לתואר שני, לתואר שלישי ישיר וללימודי רפואה. משמעות ההפרדה היא שלא נכון להשתמש במספר נקודות כללי לכל מי שסיים לימודים אקדמיים. לצורך מספר הנקודות ומשך ההטבה פתחו את הסעיף המתאים בדף הרשמי, לאחר שביררתם את שנת סיום הלימודים.",
      "כאשר יש כמה תארים, שינוי מסלול או התמחות, הכינו תיאור עובדתי של רצף הלימודים והאישורים. אל תחברו אוטומטית הטבות הנראות מתאימות לשני מסלולים. בקשו הבהרה לגבי המסלול שמיושם במקרה שלכם, ובייחוד אם תאריך סיום ההתמחות שונה מתאריך הזכאות לתואר. כך אפשר לשאול שאלה מדויקת ולקבל תשובה הנוגעת למסמכים שלכם, במקום להסתמך על דוגמה של בוגר אחר."
    ]
  },
  {
    "heading": "מה שונה בלימודי מקצוע?",
    "source": 0,
    "paragraphs": [
      "לימודי מקצוע נידונים בדף השירות בנפרד מלימודי תואר. הדף מציין לימודים בהיקף של לפחות 1,700 שעות אקדמיות במוסד מוכר וזכאות לתעודת מקצוע. לכן אין די בכותרת שיווקית של קורס או בהבטחה שניתנה בזמן ההרשמה. בקשו מהמוסד מסמך המבהיר את ההכשרה ואת היקפה, ובדקו אותו מול ההגדרות והמסמכים המפורטים בשירות הרשמי.",
      "בשלב ההכנה הפרידו בין תעודת הסיום, אישור היקף הלימודים ופרטים על המסגרת שבה למדתם. אם ההכשרה כוללת כמה קורסים, אל תסכמו בעצמכם שעות כדי להצהיר על זכאות בלי בירור. הציגו לרשות את המידע כפי שהוא מתועד. במקרה של לימודים בחוץ לארץ או אישור שאינו תואם את התיאור בשירות, כדאי לקבל הבהרה פרטנית לפני מילוי הטופס."
    ]
  },
  {
    "heading": "איך להכין את טופס 119 ואת הנספחים?",
    "source": 0,
    "paragraphs": [
      "בדף רשות המסים מפורטים אישור הזכאות לתואר או לתעודת המקצוע, תלוש שכר אחרון מכל מעסיק או משלם בשנת המס ואישורים על הטבות נוספות אם קיימות. הורידו את הטופס מתוך דף השירות עצמו, כדי להתחיל מהגרסה המוצעת בו. מלאו את שנת המס המבוקשת ואת פרטי הלימודים באופן שתואם לאישורים, ובדקו שהסריקה קריאה ושלמה.",
      "לפני מסירה מומלץ לעבור על הבקשה מתחילתה ועד סופה ולהשוות את הנתונים החוזרים בין הטופס לנספחים. תאריך שונה במסמך אחד יכול להצדיק בירור, ולא תיקון עצמאי של האישור. שמרו עותק של החומר שהועבר ושל מענה שקיבלתם. לפי דף השירות, יש להגיש בקשה נפרדת לכל שנת זכאות בצירוף המסמכים הדרושים; אין להניח שמסירה בעבר מכסה כל בקשה עתידית."
    ]
  },
  {
    "heading": "מימוש דרך המעסיק ותיאום מס",
    "source": 1,
    "paragraphs": [
      "דף טופס 119 מתאר צירוף של הטופס לטופס 101 במסלול המעסיק כאשר היה מעסיק אחד לאורך שנת המס. כאשר תנאי זה אינו מתקיים, או כשההטבה לא עודכנה בדרך זו, בדקו את מסלול תיאום המס. שירות תיאום המס הרשמי מציין גם זכאות לתואר אקדמי או לימודי מקצוע בין ההקלות שניתן לבקש. בחרו את מסלול הטיפול לאחר בדיקת נתוני התעסוקה שלכם וההנחיות, והכינו את המידע מכל המשלמים הרלוונטיים.",
      "לאחר הפקת אישור אל תסתפקו בכך שהוא מופיע באזור האישי: קראו את ההוראות והעבירו אותו למעסיק המתאים. בקשו ממחלקת השכר לוודא שהאישור נקלט ושהזכאות יושמה בחישוב. אם בתלוש לא ברור מה השתנה, השוו לתלוש שקדם לטיפול ולנתוני ההכנסה באותו חודש. עלייה בנטו לבדה אינה מסבירה איזו הטבה הופעלה, משום ששכר ורכיבים אחרים עשויים להשתנות במקביל."
    ]
  },
  {
    "heading": "מה עושים אם ההטבה לא מומשה בעבר?",
    "source": 2,
    "paragraphs": [
      "מי שמבררים זכאות משנים קודמות צריכים להבחין בין תיאום לשנה הנוכחית לבין בקשה הנוגעת לשנה שהסתיימה. רשות המסים מפעילה שירות החזר מס מקוצר למי שעומדים בתנאיו, ובדף טופס 119 יש גם התייחסות למי שחייבים בדוחות ומבקשים לתקן דוח. קראו את ההנחיות למסלול שלכם ואת מגבלות ההגשה לפני שתבחרו טופס.",
      "הכינו תיק לפי שנת מס ובו אישור הלימודים, בקשות שהוגשו, אישורים שהתקבלו ונתוני ההכנסה והמס. יש משמעות גם להטבות שכבר נלקחו בחשבון, ולכן אל תבקשו סכום נוסף מתוך הנחה שכל מה שחסר בתלוש הוא החזר שמגיע לכם. כלי אומדן יכול לעזור לזהות שאלה לבדיקה, אך החלטת הרשות מבוססת על התמונה השנתית ועל המסמכים הרלוונטיים."
    ]
  }
];
const faqItems = [
  {
    "question": "האם עצם היותי סטודנט מקנה את ההטבה הזו?",
    "answer": "המסלול המתואר כאן עוסק בסיום תואר או לימודי מקצוע בהתאם לתנאים בדף טופס 119. בדקו את אישור הזכאות ואת שנת הסיום; אין להסיק זכאות רק מרישום ללימודים או מתשלום שכר לימוד."
  },
  {
    "question": "איך יודעים כמה נקודות לבקש?",
    "answer": "פתחו בדף רשות המסים את תקופת סיום הלימודים ואת סוג התואר או ההכשרה המתאימים. מספר הנקודות ותקופת המימוש נקבעים לפי המסלול. במקרה של התמחות או כמה תארים בקשו הבהרה פרטנית."
  },
  {
    "question": "האם אישור מהשנה שעברה מספיק?",
    "answer": "לפי דף השירות נדרשת בקשה לכל שנת זכאות בנפרד עם המסמכים הנדרשים. שמרו את האישור הקודם לצורך השוואה, אך בדקו מה יש להגיש לשנת המס שאתם מבקשים לממש."
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

export default function DegreeTaxCreditPage() {
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
              ["/personal-tax/donations-tax-credit","זיכוי מס על תרומות: בדיקה ומימוש לפי סעיף 46"],
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
