import type { Metadata } from 'next';
import Link from 'next/link';
import { AuthorBox } from '@/components/calculator/AuthorBox';
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';

const title = "הטבות מס לעולים חדשים: זיכוי, פטור ודיווח";
const description = "מדריך להטבות מס לעולים חדשים: בירור נקודות זיכוי, מסלולי פטור, הכנסות מחו״ל וחובות דיווח. כולל מקורות רשות המסים המעודכנים והכנת מסמכים לבדיקת המקרה.";
const pageUrl = "https://cheshbonai.co.il/personal-tax/new-immigrant-tax-benefits";
const checkedAt = '2026-10-24';
const quickAnswer = "בהטבות מס לעולים צריך לבדוק בנפרד נקודות זיכוי, פטור על סוג הכנסה מסוים וחובת דיווח. פתחו את מדריך העולים של רשות המסים ואת שירות מימוש ההקלות העדכני, ובדקו את המסלול לפי מועד ההגעה, התושבות וההכנסות שלכם. אין להסיק ממעמד עולה פטור כללי מכל מס או מכל דיווח, ואין להחיל מסלול של תושב חוזר בלי בירור.";
const sources = [
  {
    "url": "https://www.gov.il/he/pages/immigrant-guide-1",
    "label": "רשות המסים — מדריך הטבות מס הכנסה לעולים חדשים"
  },
  {
    "url": "https://www.gov.il/he/service/tax-relief-new-immigrants",
    "label": "רשות המסים — מימוש ההקלות לעולים ולתושבים חוזרים ותיקים"
  },
  {
    "url": "https://www.gov.il/he/pages/immigrant-guide-1?chapterIndex=7",
    "label": "רשות המסים — הכנסות מחוץ לישראל ופטור מדיווח"
  },
  {
    "url": "https://www.gov.il/he/pages/new-olim-rights-guide?chapterIndex=10",
    "label": "gov.il — מדריך זכויות עולים, הטבות במיסים"
  },
  {
    "url": "https://www.gov.il/he/service/tax-coordination-online",
    "label": "רשות המסים — תיאום מס מקוון"
  },
  {
    "url": "https://www.gov.il/he/service/itc135",
    "label": "רשות המסים — בקשה להחזר מס"
  }
];
const sections = [
  {
    "heading": "מתחילים בזיהוי המסלול ובציר זמן",
    "source": 0,
    "paragraphs": [
      "מדריך רשות המסים מבחין בין הקלות על הכנסות שמקורן בישראל, הטבות על הכנסות מחוץ לישראל, נקודות זיכוי ושנת הסתגלות. לפני חישוב כספי הכינו ציר זמן אישי ובו תאריך ההגעה, מועד קבלת המעמד, תקופות מגורים ופרטי תחילת העבודה. זהו ריכוז עובדות לצורך בירור, ולא נוסחה לקביעת תושבות מס. אם הנתונים אינם תואמים בין המסמכים, בררו את ההבדל לפני מילוי בקשה.",
      "אל תעתיקו מסלול של בן משפחה רק מפני שעליתם יחד. לכל אדם עשויים להיות מסמכי מעמד, הכנסות ונסיבות שונות. השתמשו בשמות המסלולים כפי שהם מופיעים במדריך, ושאלו במפורש איזה מהם נבדק עבורכם. מעמד במשרד העלייה והקליטה הוא נתון חשוב, אך יש לבדוק גם את התנאים המתייחסים למסלול המס המסוים ולא להסתפק בכותרת כללית של הטבות לעולים."
    ]
  },
  {
    "heading": "נקודות זיכוי בשכר והמסמכים הנלווים",
    "source": 3,
    "paragraphs": [
      "מדריך הזכויות הממשלתי מתאר מימוש נקודות זיכוי באמצעות דיווח על מעמד עולה וצירוף תעודת עולה, ובין היתר מפנה שכירים לטופס 101. את פירוט התקופות והחריגים יש לבדוק במדריך רשות המסים בהתאם למועד העלייה. אין להשתמש במספר נקודות של מכר או בתלוש משנה אחרת בלי התאמה לנתונים האישיים.",
      "כאשר פונים למעסיק, בקשו לדעת אילו מסמכים נקלטו ואיזה מסלול הוגדר במערכת השכר. שמרו את הטופס והאישור, והשוו את הפרטים למה שמופיע בתלוש. אם עבדתם אצל כמה משלמים, רכזו את התמונה לפני בקשה נוספת. מטרת הבדיקה היא להבין מה כבר יושם ומה דורש טיפול, ולא להוסיף הטבה משוערת לכל משכורת בנפרד."
    ]
  },
  {
    "heading": "מסלול ההקלות המעודכן על הכנסה בישראל",
    "source": 1,
    "paragraphs": [
      "לצד נקודות הזיכוי הרגילות, רשות המסים מפרסמת שירות ייעודי למימוש הקלות לעולים חדשים ולתושבים חוזרים ותיקים. בעת בדיקת העמוד נמצא שירות שעודכן ב־22.10.2026, עם תנאי תחולה, מסמכים ומסלולי מימוש נפרדים לפי מצב הדיווח וההכנסה. לכן אין להסתפק במדריך כללי שנשמר לפני העדכון או להסיק שכותרת על פטור מכסה את כל ההכנסות.",
      "פתחו את השירות הרשמי ובדקו את פרק הזכאות, רשימת המסמכים והסימולטור המצורף אליו. טבלאות התקרות ותקופות התחולה אינן מועתקות לכאן; יש לקרוא אותן במקור העדכני. בדקו בנפרד מה אפשר לממש במהלך השנה ומה מטופל בדוח. השירות מבהיר שאישור במסגרת ההקלה אינו מבטל חובת דוח שקיימת מסיבה אחרת. שמרו את תוצאת הבירור לצד אישורי ההכנסה."
    ]
  },
  {
    "heading": "הכנסות מחוץ לישראל: מקור ההכנסה דורש בירור",
    "source": 2,
    "paragraphs": [
      "בפרק העוסק בהכנסות מחוץ לישראל, רשות המסים מפרטת דוגמאות ומסלולי פטור לפי סוג המעמד וההכנסה. אין לקבוע שמקור ההכנסה בחוץ לארץ רק משום שהמשלם או חשבון הבנק נמצאים שם. בפרט, המדריך הממשלתי מבחין בין עבודה המתבצעת בחוץ לארץ לבין הכנסה עבור עבודה שמתבצעת בישראל. כשיש עבודה מרחוק או פעילות בכמה מדינות, צריך לברר את הסיווג לפי העובדות.",
      "לקראת הבירור הכינו תיאור של העבודה או הנכס, מקום הפעילות, זהות המשלם והמסמכים שקיבלתם. הפרידו בין שכר, הכנסה מעסק, שכירות והשקעות, בלי להחליט מראש שכולן מכוסות באותו פטור. הציגו גם את המס ששולם במדינה אחרת אם הוא רלוונטי לבדיקה. עצם קיומו של מס זר אינו תשובה מלאה לשאלה מה יש לדווח בישראל או איזה מסלול מתאים."
    ]
  },
  {
    "heading": "פטור ממס אינו פטור מדיווח",
    "source": 2,
    "paragraphs": [
      "זהו הבדל מרכזי בבדיקת זכויות העולים: לפי מדריך רשות המסים, הפטור מדיווח על הכנסות ונכסים מחוץ לישראל אינו חל על מי שהגיעו החל מ־1.1.2026, אף שהכנסות עשויות להמשיך ליהנות מפטור ממס בהתאם לתנאים המתוארים בו. לכן אין להסיק מהיעדר חבות מס שלא צריך למסור מידע או להגיש דוח. יש לברר את חובות הדיווח הרלוונטיות למקרה שלכם.",
      "מומלץ להחזיק רישום נפרד לכל שאלה: האם ההכנסה חייבת במס, האם קיימת הקלה, ואילו פרטים צריך לדווח. אם קיבלתם תשובה על שאלה אחת בלבד, בקשו הבהרה לגבי האחרות. הכינו מראש אישורי הכנסות ונתוני נכסים רלוונטיים כדי שהבדיקה תהיה שלמה. כאשר יש פער בין הסבר ישן לבין המדריך המעודכן, הפנו את הבירור לנקודת ההבדל ואל תבחרו בגרסה הנוחה יותר."
    ]
  },
  {
    "heading": "איך להכין בקשה שאפשר לבדוק?",
    "source": 1,
    "paragraphs": [
      "שירות מימוש ההקלות מפרט מסמכים ובהם טופס הבקשה, תעודת המעמד, נתוני כניסות ויציאות ואישורי הכנסה. עיינו ברשימה המלאה בשירות לפני תחילת ההגשה, משום שייתכנו דרישות הנוגעות גם לנסיבות המשפחה ולסוג ההקלה. ארגנו את החומר לפי נושא, והשאירו את האישור המקורי כפי שהונפק. במקרה של טעות בקשו תיקון מהגורם המנפיק.",
      "לכל מסמך תנו שם שעוזר לכם לזהות את שנת המס ואת הגוף שהוציא אותו. בדקו שהקובץ כולל את כל העמודים ושניתן לקרוא את פרטי הזיהוי. אם חסר מסמך, בררו כיצד להשלים אותו ולא אם ניתן להחליף את הנתון בהערכה. אין צורך למסור מסמכי זהות או נתוני הכנסה לאתר חשבונאי כדי לקרוא את המדריך; את ההגשה מבצעים בערוץ הרשמי המתאים."
    ]
  },
  {
    "heading": "בחירת מסלול מימוש ובדיקת התוצאה",
    "source": 4,
    "paragraphs": [
      "שירות תיאום המס מאפשר לבקש הקלות, ובהן הקלות לעולים, לפי התנאים המפורטים בו. בשירות הייעודי לעולים מוסברות גם חלופות התלויות במצב הדיווח. בחרו את דרך המימוש לפי ההנחיות המתאימות לכם, וקראו את האישור שהתקבל לפני מסירתו למעסיק. לאחר הטיפול בדקו שהנתונים הנכונים נלקחו בחשבון ושאין ערבוב בין מסלולי הטבות שונים.",
      "אם אתם בוחנים שנה שכבר הסתיימה, בדקו אם מתאים שירות החזר המס או שנדרש טיפול בדוח אחר. מחשבון שכר יכול לסייע להבין את מבנה הניכוי לאחר שהזכאות אומתה, אך אין בו בדיקה מלאה של תושבות, הכנסות חוץ או חובת דיווח. במקרים כאלה קחו את ריכוז העובדות והמקורות לאיש מקצוע מתאים. בקשו תשובה המתייחסת במפורש גם לזכויות וגם לחובות שנותרו לאחר ההקלה."
    ]
  }
];
const faqItems = [
  {
    "question": "האם תעודת עולה פוטרת מכל מס הכנסה?",
    "answer": "לא ניתן להסיק זאת. מדריך רשות המסים כולל מסלולים שונים לנקודות זיכוי ולפטורים. בדקו את סוג ההכנסה, המעמד, התקופה והתנאים המתאימים, לרבות השירות המעודכן למימוש ההקלות."
  },
  {
    "question": "האם הכנסה פטורה מחו״ל אינה דורשת דיווח?",
    "answer": "אין להסיק זאת. בפרק הכנסות החוץ של רשות המסים מוסבר השינוי בפטור מדיווח למגיעים החל מ־1.1.2026. יש לבדוק בנפרד את חבות המס ואת חובת הדיווח האישית."
  },
  {
    "question": "איפה בודקים את התקרות ואת תקופות ההטבה?",
    "answer": "במדריך ובשירות הייעודי של רשות המסים המקושרים במקורות. עיינו בסעיף המתאים למצבכם ובסימולטור המצורף לשירות. הטבלאות המשתנות אינן משוכפלות במדריך הזה."
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

export default function NewImmigrantTaxBenefitsPage() {
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
              ["/personal-tax/degree-tax-credit","זיכוי מס לתואר אקדמי: אישורים וטופס 119"],
              ["/personal-tax/locality-tax-credit","זיכוי מס לתושבי יישוב מזכה: בדיקת תושבות"],
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

