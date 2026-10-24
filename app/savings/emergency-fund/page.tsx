import type { Metadata } from 'next';
import Link from 'next/link';
import { AuthorBox } from '@/components/calculator/AuthorBox';
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';

const title = "קרן חירום: תכנון רזרבה אישית להוצאה בלתי צפויה";
const description = "איך לתכנן קרן חירום לפי הוצאות חיוניות, תרחישי הכנסה ונגישות לכסף, בלי מספר חודשי חיסכון אחיד ובלי המלצה על מוצר פיננסי.";
const pageUrl = 'https://cheshbonai.co.il/savings/emergency-fund';
const checkedAt = '2026-10-24';
const quickAnswer = "קרן חירום היא הכינוי שנשתמש בו לכסף המיועד לתרחיש בלתי צפוי שפוגע בתקציב. כדי לתכנן אותה, רשמו מה עלול לקרות, אילו תשלומים יימשכו ואיזה כסף יהיה נגיש בזמן. בחרו בעצמכם את משך התרחיש ואת סכום ההיערכות. אין במדריך יעד אוניברסלי של חודשי מחיה או מוצר שמתאים לכל משק בית.";
const sources = [
  {
    "url": "https://www.boi.org.il/information/bank-paymnts/savingsandinvestmentproducts/pikadon/",
    "label": "בנק ישראל — מדריך פיקדון בנקאי"
  },
  {
    "url": "https://boi.org.il/information/bank-paymnts/financial-education/campaigns/boi-equator/deposit/",
    "label": "בנק ישראל — קו המשווה לפיקדונות והערות הנתונים"
  }
];
const sections = [
  {
    "heading": "מגדירים מה נחשב חירום אצלכם",
    "source": null,
    "paragraphs": [
      "התחילו בהגדרה כתובה של האירועים שעבורם אתם רוצים לשמור רזרבה: הפסקה בהכנסה, תיקון דחוף או הוצאה חיונית שלא נכללה בתכנון. ליד כל אירוע כתבו מה הופך אותו לדחוף ומה אפשר לדחות. המטרה היא ליצור שפה משותפת בבית, כדי שהחלטת המשיכה לא תתקבל רק לפי התחושה שיש כסף פנוי.",
      "הפרידו ברשימה בין אירוע שהתרחש בלי שצפיתם אותו לבין תשלום שמועדו ידוע. חופשה שתכננתם או חידוש תקופתי יכולים לקבל תקציב ייעודי משלהם. זו חלוקה לצורך התכנון בלבד: אתם קובעים את הגבול לפי הצרכים שלכם, ויכולים לעדכן אותו כאשר מתברר שהוצאה מסוימת חוזרת שוב ושוב."
    ]
  },
  {
    "heading": "ממפים הוצאות חיוניות בזמן שיבוש",
    "source": null,
    "paragraphs": [
      "עברו על התשלומים שלכם וסמנו מה תצטרכו להמשיך לממן גם בתרחיש שבחרתם. אפשר לכלול דיור, מזון, טיפול רפואי, תחבורה והתחייבויות קיימות, בהתאם למציאות שלכם. אל תעתיקו תקציב ממשפחה אחרת. לכל סעיף רשמו את הסכום מתוך המסמכים שלכם, את מועד התשלום ואת האפשרות לצמצם או לדחות אותו לאחר בירור.",
      "בנו לצד התקציב הרגיל גרסה לתקופה של שיבוש. שאלו אילו הוצאות יקטנו, אילו יישארו ואילו עשויות להתווסף דווקא בגלל האירוע. אם יש אדם נוסף שתלוי בהכנסה שלכם, תעדו גם את צרכיו. הבחנה כזו מסייעת לנסח את השאלה הכספית לפני שקובעים כמה כסף רוצים להפריש לחיסכון."
    ]
  },
  {
    "heading": "בוחרים תרחיש ומסמנים את אי הוודאות",
    "source": null,
    "paragraphs": [
      "בחרו תקופת היערכות ונמקו אותה כהנחת עבודה אישית. אפשר להכין תרחישים להפחתה חלקית בהכנסה ולהפסקתה. בכל תרחיש רשמו את ההוצאות, את ההכנסות שלדעתכם יימשכו ואת הפרטים שעדיין דורשים בדיקה.",
      "אל תכניסו לתרחיש קצבה, פיצוי, החזר או עזרה מקרובים כאילו כבר התקבלו. אם אתם מבקשים להביא אותם בחשבון, כתבו מה מקור המידע, האם ההסכמה קיימת ומתי הכסף עשוי להגיע. השאירו גלויה גם גרסה שבה אותו סכום אינו זמין. כך אפשר לזהות עד כמה התכנון שלכם נשען על הנחה שטרם אומתה."
    ]
  },
  {
    "heading": "בודקים מה באמת זמין לשימוש",
    "source": 0,
    "paragraphs": [
      "בנק ישראל מסביר כי בפיקדונות עשויות להיות תחנות יציאה ומגבלות על משיכה מוקדמת. לכן יתרה שמופיעה בחשבון אינה מספיקה לבדיקת הזמינות. בקשו את תנאי המשיכה של כל סכום שאתם שוקלים לשייך לרזרבה, ורשמו מתי תוכלו להשתמש בו בפועל ומה יש לברר לפני כן.",
      "רשמו לכל סכום את החשבון, הייעוד ודרך הגישה אליו. סמנו כסף שכבר מיועד לתשלום אחר. סכום שזמינותו אינה ברורה אפשר להשאיר מחוץ לגרסת התכנון השמרנית עד לקבלת הבהרה."
    ]
  },
  {
    "heading": "מתכננים צבירה שמתיישבת עם התקציב",
    "source": null,
    "paragraphs": [
      "אחרי שהגדרתם את התרחיש ואת היתרה הזמינה, בחרו סכום הפרשה שאתם מסוגלים לשלב בתקציב הנוכחי. בדקו אותו לצד מועדי כניסת ההכנסה והחיובים. אל תקבעו אחוז אחיד מהשכר רק מפני שהוא נוח לזכירה. הסכום והקצב הם החלטת תכנון שלכם, שצריכה להישען על ההכנסות וההתחייבויות שתיעדתם.",
      "אם כרגע אין אפשרות להפריש את הסכום הרצוי, אפשר לרשום יעד ביניים אישי ולבחון מה צריך להשתנות בתקציב. הציגו את הפער באופן גלוי במקום להניח שתשואה עתידית תסגור אותו. כשיש גם חוב, הכינו תמונה משותפת של תנאי החוב ושל צורכי הנזילות, ובמידת הצורך בקשו סיוע פרטני."
    ]
  },
  {
    "heading": "מנסחים נוהל משיכה ומילוי מחדש",
    "source": null,
    "paragraphs": [
      "קבעו מראש אילו שאלות תשאלו לפני משיכה: האם ההוצאה חיונית, האם נדרש תשלום כעת והאם היא מתאימה להגדרה שנתתם לחירום. במשק בית משותף אפשר להסכים מי מתעד ומי שותף להחלטה. הנוהל נועד להקל על פעולה בזמן לחץ, ואינו צריך לעכב טיפול בצורך שהגדרתם כדחוף.",
      "אחרי השימוש, רשמו את הסיבה, את הסכום ואת היתרה שנותרה. לאחר מכן בחנו כיצד לעדכן את קצב הצבירה לפי התקציב החדש. אם אותה סיבה חוזרת, שקלו להעביר אותה לרשימת ההוצאות המתוכננות. זו הזדמנות לתקן את המודל האישי שלכם, בלי להפוך כל חריגה להוכחה שנדרש סכום יעד זהה לכולם."
    ]
  },
  {
    "heading": "מפרידים בין השוואת מוצרים לבדיקת התוכנית",
    "source": 1,
    "paragraphs": [
      "קו המשווה של בנק ישראל מציג נתונים לצורך השוואה כללית; הבהרתו מציינת שהמידע אינו כולל את כל התנאים והסייגים. אפשר להיעזר בו לפתיחת בירור על פיקדון, אך את התאמתו למועד שבו תצטרכו את הכסף בדקו מול ההסכם שמוצע לכם. העמוד כאן אינו מדרג מוצרים או בנקים.",
      "חזרו לתוכנית לאחר שינוי בהכנסה, בהרכב הבית או בהתחייבויות. בדקו אם התרחיש עדיין מתאר את החשש שלכם ואם הכסף שסימנתם נשאר נגיש. שמרו תאריך לצד הנחות העבודה ולצד המסמכים. כך הבדיקה הבאה מתחילה מנתונים מוכרים, ואפשר להסביר מה השתנה במקום לבחור מחדש סכום לפי כלל כללי."
    ]
  }
];
const faqItems = [
  {
    "question": "כמה חודשי מחיה צריכה לכסות קרן חירום?",
    "answer": "אין כאן מספר חודשים אחיד. בחרו תקופת תכנון לפי התרחיש שלכם, תעדו מדוע בחרתם בה ובדקו אילו הכנסות והוצאות יתקיימו בה. זו הנחה אישית שאפשר לשנות, ולא המלצה מקצועית למשך כיסוי."
  },
  {
    "question": "האם הוצאה צפויה יכולה להיכלל בקרן?",
    "answer": "אפשר לקבוע את החלוקה שלכם, אך לצורך בהירות מומלץ לתעד הוצאות שמועדן ידוע בתקציב ייעודי. כך תראו איזה חלק מהיתרה כבר נועד להוצאה מתוכננת ואיזה חלק נשאר לתרחיש שלא צפיתם."
  },
  {
    "question": "האם חייבים לפתוח חשבון נפרד?",
    "answer": "שיטת התכנון אינה מחייבת חשבון נוסף. אפשר להתחיל ברישום ברור של הייעוד. אם בוחנים חשבון או פיקדון, בדקו את תנאיהם ואת נגישות הכסף; עצם ההפרדה ברישום אינה משנה את תנאי המוצר."
  }
];
const relatedLinks = [
  [
    "/savings",
    "חיסכון ומשפחה"
  ],
  [
    "/savings/family-budget",
    "בניית תקציב משפחתי"
  ],
  [
    "/savings/sinking-funds",
    "היערכות להוצאות ידועות מראש"
  ],
  [
    "/savings/savings-account",
    "ארגון חשבון חיסכון"
  ],
  [
    "/savings/bank-deposit",
    "בדיקת תנאי פיקדון"
  ],
  [
    "/tools/budget",
    "כלי לניהול תקציב"
  ]
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

export default function EmergencyFundPage() {
  return (
    <main dir="rtl" className="mx-auto max-w-4xl px-5 py-12 text-ink">
      <BreadcrumbSchema items={[
        { name: 'דף הבית', url: '/' },
        { name: 'חיסכון ומשפחה', url: '/savings' },
        { name: title, url: pageUrl },
      ]} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify([articleSchema, faqSchema]).replace(/</g, '\\u003c'),
      }} />
      <nav aria-label="פירורי לחם" className="mb-8 text-sm text-ink/70">
        <Link href="/" className="underline">דף הבית</Link>
        {' / '}<Link href="/savings" className="underline">חיסכון ומשפחה</Link>
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
        </section>
        <aside aria-label="הבהרה חשובה" className="border-r-4 border-gold bg-paper p-5 leading-8">
          המידע חינוכי בלבד ואינו ייעוץ השקעות, מס או משפט.
          שיטות התכנון מיועדות למילוי עצמי ואינן המלצת רשות או המלצה על מוצר.
          בדקו תנאים ומסמכים עדכניים, ובמידת הצורך פנו לבעל רישיון מתאים.
        </aside>
        {sections.map((section, index) => (
          <section key={section.heading} aria-labelledby={`section-${index + 1}`} className="space-y-4">
            <h2 id={`section-${index + 1}`} className="scroll-mt-24 text-2xl font-bold">{section.heading}</h2>
            {section.paragraphs.map((paragraph) => <p key={paragraph} className="leading-8">{paragraph}</p>)}
            {section.source !== null ? (
              <p className="text-sm leading-7 text-ink/70">
                מקור לעובדות על המוצר או השירות: <a className="text-gold underline" href={sources[section.source].url} target="_blank" rel="noopener noreferrer">
                  {sources[section.source].label}
                </a>
              </p>
            ) : null}
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
            נבדק ב־24.10.2026. המקורות מאמתים את העובדות המסומנות במדריך.
            שיטות הארגון הן הצעות אישיות; אין להן יעד אוניברסלי.
            בדפי השוואה בדקו את תקופת הנתונים.
          </p>
          <ul className="list-inside list-disc space-y-3 leading-7">
            {sources.map((source) => (
              <li key={source.url}><a href={source.url} className="text-gold underline" target="_blank" rel="noopener noreferrer">{source.label}</a></li>
            ))}
          </ul>
        </section>
        <section aria-labelledby="related-reading">
          <h2 id="related-reading" className="mb-4 text-2xl font-bold">מדריכים וכלים להמשך</h2>
          <ul className="grid gap-3 sm:grid-cols-2">
            {relatedLinks.map(([href, label]) => (
              <li key={href}><Link className="text-gold underline" href={href}>{label}</Link></li>
            ))}
          </ul>
        </section>
        <p className="text-sm leading-7 text-ink/70">
          אחריות התוכן: מערכת חשבונאי. פרטי בעל האתר להלן; אין בהצגתם אישור לבדיקה פרטנית של נסיבות הקורא.
        </p>
        <AuthorBox bio="רואה חשבון וסמנכ״ל כספים. פרטי בעל האתר ותחומי עיסוקו מופיעים בדף האודות." />
      </article>
    </main>
  );
}
