import type { Metadata } from 'next';
import Link from 'next/link';
import { AuthorBox } from '@/components/calculator/AuthorBox';
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';

const title = "חיסכון להוצאות צפויות: בניית קופות ייעודיות";
const description = "שיטת תכנון להוצאות ידועות מראש: מיפוי מועדי תשלום, רישום סכום אישי, חלוקת ההפרשות ומעקב אחר היתרה, ללא יעד חיסכון אחיד.";
const pageUrl = 'https://cheshbonai.co.il/savings/sinking-funds';
const checkedAt = '2026-10-24';
const quickAnswer = "קופה ייעודית היא כינוי תקציבי לכסף ששומרים להוצאה מוגדרת, כגון חידוש ביטוח, טיפול מתוכנן או רכישה עתידית. רשמו את מטרת ההוצאה, את המועד ואת העלות שבדקתם, ובחרו הפרשות שמתאימות לתזרים שלכם. המונח אינו מציין כאן מוצר פיננסי או קרן השקעה; אפשר להתחיל ברישום בלבד.";
const sources = [
  {
    "url": "https://boi.org.il/media/h50n0mit/1-%D7%9E%D7%A8-%D7%97%D7%A1%D7%9B%D7%9F-%D7%95%D7%9E%D7%A8-%D7%91%D7%96%D7%91%D7%96%D7%9F-pdf.pdf",
    "label": "בנק ישראל — מר חסכן ומר בזבזן: תכנון מטרות במסגרת תקציב"
  },
  {
    "url": "https://www.boi.org.il/information/bank-paymnts/savingsandinvestmentproducts/pikadon/",
    "label": "בנק ישראל — מדריך פיקדון בנקאי"
  }
];
const sections = [
  {
    "heading": "מתחילים מלוח ההוצאות העתידיות",
    "source": null,
    "paragraphs": [
      "עברו על יומן התשלומים, הודעות החידוש והוצאות העבר. חפשו חיובים שאינם מופיעים בכל חודש, אך אתם יודעים שהם צפויים: לימודים, תחזוקה, אירועים או החלפת ציוד. לכל הוצאה פתחו שורה עם תיאור ברור ומועד משוער. אם עדיין אין תאריך, סמנו זאת במקום להציג הערכה כמועד סופי.",
      "הבחינו בין תשלום שכבר התחייבתם אליו לבין רכישה שאתם רק שוקלים. אפשר להחזיק את שניהם באותה רשימה, עם סימון שונה של מידת המחויבות. ההבחנה נועדה לעזור כאשר אין מספיק תקציב לכל המטרות: תוכלו לראות מה מצריך בירור ומה אפשר לשנות בלי להניח שכל הרשימה מחייבת באותה מידה."
    ]
  },
  {
    "heading": "נותנים לכל יעד סכום עם אסמכתה",
    "source": null,
    "paragraphs": [
      "ליד כל מטרה רשמו עלות לפי הצעת מחיר, מסמך חידוש או בירור עדכני שעשיתם. ציינו מה כלול במחיר ומה לא נבדק. אם יש רק אומדן, כתבו מי הכין אותו ומתי. סכום מתועד מאפשר לחזור להנחה ולעדכן אותה, בלי לקבוע שכל משק בית צריך לחסוך אותו סכום לאותה קטגוריה.",
      "החליטו אם אתם מתכננים את מלוא ההוצאה או רק את החלק שימומן מהקופה. אם אדם אחר משתתף בתשלום, תעדו את הסכמתו ואת מועד ההשתתפות המשוער. כסף שכבר שמור למטרה צריך להופיע בנפרד מהפרשות עתידיות. אל תספרו את אותה יתרה כמימון זמין לכמה מטרות במקביל."
    ]
  },
  {
    "heading": "מתאימים את קצב ההפרשה למועד התשלום",
    "source": null,
    "paragraphs": [
      "סמנו ביומן את ההזדמנויות שבהן תוכלו להעביר כסף לפני מועד התשלום. לאחר מכן בחרו סכומי הפרשה אישיים ובדקו אם הצירוף שלהם עם היתרה הקיימת תואם את העלות שתיעדתם. זו בדיקת תכנון בנתונים שלכם, ולא נוסחה שמבטיחה עמידה ביעד. אפשר לבחור קצב שאינו אחיד לאורך התקופה.",
      "אם התכנון אינו מתכנס, בחנו שינוי בהוצאה, במועד או בחלוקת התקציב. אל תמלאו את הפער באמצעות תשואה משוערת שלא בדקתם. כאשר נדרשת מקדמה, הוסיפו אותה כמועד נפרד בתוכנית. כך לא תישענו על כסף שאמור להיצבר רק לאחר שכבר יהיה עליכם לשלם."
    ]
  },
  {
    "heading": "בודקים את כל המטרות מול התקציב",
    "source": 0,
    "paragraphs": [
      "חומר החינוך הפיננסי של בנק ישראל עוסק בקביעת סדרי עדיפויות ובתכנון חיסכון למטרות במסגרת תקציב מוגבל. כתרגיל אישי, הניחו את כל ההפרשות המתוכננות זו לצד זו ובדקו אם הן אפשריות יחד עם ההוצאות השוטפות. יעד שנראה נוח לבדו צריך להיבחן גם כחלק מהתמונה המלאה.",
      "סמנו אילו מטרות קשורות לאותו מקור הכנסה עתידי. אם כולן תלויות בבונוס שטרם התקבל, רשמו זאת בגלוי. אפשר להכין גרסה שבה ההכנסה הזו אינה מגיעה ולבחור מראש מה יידחה. סדר העדיפויות הוא שלכם; המדריך אינו מקצה אחוזים קבועים לחופשה, לתחזוקה או לכל מטרה אחרת."
    ]
  },
  {
    "heading": "מפרידים רישום תקציבי מבחירת מוצר",
    "source": 1,
    "paragraphs": [
      "קופה ברישום אינה קובעת היכן יוחזק הכסף. בנק ישראל מציין שתנאי הפיקדון כוללים התייחסות למשיכת הכספים ולמגבלות אפשריות על משיכה מוקדמת. אם אתם בוחנים פיקדון עבור הוצאה מתוכננת, השוו את מועדי המשיכה האפשריים למועד התשלום שרשמתם, ובקשו הבהרה לגבי תנאי המוצר המסוים.",
      "בעת בחירת דרך הרישום, העדיפו צורה שתוכלו לתחזק: גיליון, רשימה או כלי תקציב. לכל מטרה הציגו יתרה נוכחית, הפקדות ומשיכות. גם אם הכסף מוחזק יחד, צריכה להיות אפשרות להבין איזה חלק ממנו שייך לכל יעד. אין בשיטת הארגון עצמה המלצה לפתוח חשבון נוסף."
    ]
  },
  {
    "heading": "מתעדים את השימוש ומונעים ספירה כפולה",
    "source": null,
    "paragraphs": [
      "כאשר משלמים מהקופה, סמנו ברישום גם את ההוצאה וגם את הפחתת היתרה שיועדה לה. אם ההפקדה לקופה כבר סומנה כהקצאת תקציב, הגדירו כיצד תציגו את התשלום בפועל, כדי שלא תסיקו בטעות שנדרשו עבורו שני תקציבים נפרדים. שמרו את ההבחנה בין תנועת כסף לבין מטרת ההוצאה.",
      "לאחר התשלום בדקו אם נשארה יתרה ומה תרצו לעשות בה. אפשר להשאירה לאותו יעד, להעבירה למטרה אחרת או לעדכן את ההפרשות הבאות בהתאם להחלטתכם. תעדו את השינוי. אם מדובר בהוצאה חוזרת, פתחו את מחזור התכנון הבא עם העלות שנבדקה ועם מועד הבירור הבא."
    ]
  },
  {
    "heading": "מחליטים איך מטפלים בשינוי בתוכנית",
    "source": null,
    "paragraphs": [
      "מחיר חדש, דחיית אירוע או שינוי בהכנסה הם סיבות לחזור לרשימה. עדכנו את השדה שהשתנה ורק אחר כך בחנו את ההפרשות. אם מעבירים כסף מיעד ליעד, רשמו איזה תשלום נותר ללא מימון ומה תעשו לגביו. כך אפשר להחליט במודע ולא להסתפק בכך שהיתרה הכוללת נראית מספקת.",
      "שמרו בנפרד גם רשימת תרחישים בלתי צפויים שאתם מבקשים לממן מקרן חירום. הוצאה שמופיעה מראש בלוח אינה צריכה להיעלם מהתכנון רק מפני שהגדרתם רזרבה כללית. אם אינכם בטוחים כיצד לסווג הוצאה, תעדו את ההחלטה ואת הסיבה, וחזרו אליה בבדיקה הבאה."
    ]
  }
];
const faqItems = [
  {
    "question": "האם קופה ייעודית היא קרן פיננסית?",
    "answer": "בעמוד הזה מדובר בשיטת רישום תקציבי בלבד. השם אינו מציין קרן נאמנות, חשבון או פיקדון, ואינו מעניק לכסף תנאי משיכה או מיסוי כלשהם."
  },
  {
    "question": "מה עושים כשלא יודעים את העלות הסופית?",
    "answer": "רושמים אומדן מסומן, את הבסיס שעליו נשען ואת מועד הבירור הבא. לאחר קבלת מחיר מעדכנים את התוכנית ואת סדרי העדיפויות, בלי להציג את האומדן כהבטחה."
  },
  {
    "question": "האם להעביר אוטומטית סכום זהה לכל מטרה?",
    "answer": "אפשר לבחור העברה קבועה, אך אין כאן סכום אחיד או חלוקה מחייבת. בדקו את מועד הצורך, את היתרה שכבר יועדה ואת היכולת לשלב את ההפרשות בתקציב שלכם."
  }
];
const relatedLinks = [
  [
    "/savings",
    "חיסכון ומשפחה"
  ],
  [
    "/savings/family-budget",
    "תכנון תקציב משפחתי"
  ],
  [
    "/tools/budget",
    "כלי לניהול תקציב"
  ],
  [
    "/savings/emergency-fund",
    "תכנון קרן חירום"
  ],
  [
    "/savings/savings-account",
    "ניהול חשבון חיסכון"
  ],
  [
    "/savings/bank-deposit",
    "בדיקת פיקדון בנקאי"
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

export default function SinkingFundsPage() {
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
