import type { Metadata } from 'next';
import Link from 'next/link';
import { AuthorBox } from '@/components/calculator/AuthorBox';
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';

const title = "פיקדון בנקאי: איך לקרוא הצעה ולהשוות תנאים";
const description = "מדריך ניטרלי לבדיקת פיקדון בנקאי: תקופת ההפקדה, סוג הריבית, תנאי המשיכה, קו המשווה ומסמכי המס, ללא הצעת ריבית או דירוג בנקים.";
const pageUrl = 'https://cheshbonai.co.il/savings/bank-deposit';
const checkedAt = '2026-10-24';
const quickAnswer = "פיקדון בנקאי הוא חיסכון לתקופה מוסכמת כנגד ריבית, כפי שמסביר בנק ישראל. לפני הפקדה בקשו מסמך שמפרט את התקופה, מנגנון הריבית ותנאי המשיכה. השתמשו בהשוואה הרשמית כנקודת פתיחה, ובדקו את ההצעה האישית כולה. אין בעמוד שיעור ריבית עדכני, תשואה מובטחת או המלצה על בנק מסוים.";
const sources = [
  {
    "url": "https://www.boi.org.il/information/bank-paymnts/savingsandinvestmentproducts/pikadon/",
    "label": "בנק ישראל — מדריך פיקדון בנקאי"
  },
  {
    "url": "https://boi.org.il/information/bank-paymnts/financial-education/campaigns/boi-equator/deposit/",
    "label": "בנק ישראל — קו המשווה לפיקדונות והערות הנתונים"
  },
  {
    "url": "https://www.gov.il/he/service/116b",
    "label": "רשות המסים — בקשה לניכוי מס הכנסה מוקטן מריבית, טופס 116ב׳"
  }
];
const sections = [
  {
    "heading": "מגדירים את השאלה שהפיקדון אמור לפתור",
    "source": null,
    "paragraphs": [
      "כתבו מה מטרת הכסף ומתי עשוי להתעורר צורך להשתמש בו. הבחינו בין סכום שכבר זמין להפקדה לבין הכנסה שאתם מצפים לקבל בהמשך. לפני בקשת הצעות, רשמו גם אילו התחייבויות מתוכננות להיפרע מאותו כסף. כך אפשר לבחון מוצר מול צורך מוגדר במקום להתחיל מכותרת פרסומית על ריבית.",
      "הכינו דף השוואה שבו מופיעים סכום ההפקדה שאתם בוחרים, מועד תחילת ההפקדה ומועד הצורך בכסף. סמנו אילו מהנתונים גמישים מבחינתכם. הדף הוא כלי עבודה אישי בלבד: הוא אינו קובע שהפקדה מתאימה לנסיבותיכם ואינו מחליף בירור לגבי חובות קיימים או צורכי נזילות אחרים."
    ]
  },
  {
    "heading": "מזהים את סוג הריבית בהצעה",
    "source": 1,
    "paragraphs": [
      "בנק ישראל מבחין בין ריבית קבועה, שנקבעת בהפקדה ונשארת זהה בתקופה, לבין ריבית משתנה התלויה בפרמטר משתנה. אל תסתפקו במילים קבועה או משתנה: בקשו שיצביעו במסמך על הסעיף שמתאר את מנגנון ההצעה שקיבלתם, ושמרו עותק עם תאריך קבלתה.",
      "ברשימת השאלות שלכם אפשר לכלול את בסיס הצגת הריבית, מועד זיכויה ותנאי ההצמדה, אם קיימים. אם נמסר סכום צפוי בסיום, בקשו פירוט של ההנחות ששימשו להצגתו. הבדילו בין הסבר המבוסס על תנאי ההסכם לבין המחשה שנבנתה לצורך השיחה. השאירו כל פרט לא ברור כפריט לבירור."
    ]
  },
  {
    "heading": "קוראים את תנאי היציאה לפני ההפקדה",
    "source": 0,
    "paragraphs": [
      "לפי מדריך בנק ישראל, קיימים פיקדונות עם תחנות יציאה, ומשיכה מוקדמת עשויה להיות כרוכה בקנס או במגבלות. לפני החלטה בדקו באילו מועדים ניתן לבקש משיכה לפי ההצעה שלכם, ואילו תנאים חלים עליה. אין להסיק מהמילה פיקדון שהכסף יהיה זמין בכל רגע.",
      "שאלו גם על מצב שבו נדרש רק חלק מהכסף ועל הפעולה שיש לבצע כדי לקבלו. בקשו תשובה כתובה לגבי ההשפעה על היתרה ועל הריבית, ככל שהדבר רלוונטי להצעה. אל תכניסו לתוכנית תשלום שמסתמך על יציאה מוקדמת כל עוד לא ברור לכם כיצד אותה יציאה מתאפשרת."
    ]
  },
  {
    "heading": "משווים הצעות באותה מסגרת",
    "source": 1,
    "paragraphs": [
      "נתוני קו המשווה מבוססים על דיווחי הבנקים על פיקדונות שהתקבלו בפועל בחודש הנתונים. הריבית המוצגת מניחה החזקה לאורך חיי הפיקדון ללא פירעון מוקדם. לכן רשמו את תקופת הדיווח ואת החתך שבדקתם. הנתון יכול לסייע בניסוח שאלות, אך אינו הצעה אישית שניתנה לכם.",
      "בדף העבודה הניחו הצעות עם תקופה, סוג ריבית ותנאי זמינות דומים זו לצד זו. אם התנאים שונים, סמנו את ההבדל במפורש במקום לבחור לפי המספר הבולט. בקשו להשלים פרטים חסרים לפני סיכום ההשוואה. תוצאה כללית באתר אינה מספיקה כדי לתאר את מלוא תנאי ההסכם האישי."
    ]
  },
  {
    "heading": "בודקים את סוף התקופה ואת הוראות ההמשך",
    "source": null,
    "paragraphs": [
      "בקשו הסבר מה יקרה בתום ההפקדה: לאן יעבור הכסף, כיצד תימסר הודעה והאם ההצעה כוללת הוראת חידוש. אל תניחו שהתנאים לתקופה נוספת יהיו זהים לתנאים שבמסמך הנוכחי. רשמו אילו הוראות נתתם ואיך תוכלו לבדוק שהן נקלטו, בהתאם למוצר ולמסמכים שנמסרו לכם.",
      "הוסיפו ליומן מועד בדיקה שבחרתם לפני סיום התקופה. בבדיקה חזרו למטרת הכסף ולתשלומים המתקרבים, ורק אז בחנו הצעה נוספת אם תרצו. החזיקו יחד את מסמך ההפקדה ואת ההודעות שהתקבלו לאורך הדרך. התיעוד נועד לאפשר השוואה בין מה שסוכם לבין מה שמופיע ברישומי החשבון."
    ]
  },
  {
    "heading": "מפרידים ריבית מוצגת מבירור המס",
    "source": 2,
    "paragraphs": [
      "רשות המסים מפעילה שירות לבקשת ניכוי מס הכנסה מוקטן מריבית באמצעות טופס 116ב׳, בהתאם לתנאי השירות. עצם קיום השירות אינו קובע זכאות שלכם. אם הנושא רלוונטי, פתחו את ההנחיות ובדקו עם הרשות את התנאים לשנת המס המבוקשת, בלי להעתיק תקרה או שיעור מהקשר אחר.",
      "בקשו להבין האם סכום שמוצג בהצעה מתואר לפני מס או לאחריו, ומה נלקח בחשבון. שמרו את מסמכי הפיקדון ואת נתוני הריבית שנמסרו לכם לצורך בירור. העמוד אינו מחשב מס, אינו קובע פטור ואינו מבטיח אישור להפחתת ניכוי. במקרה של ספק אפשר לפנות ליועץ מס או לרואה חשבון."
    ]
  },
  {
    "heading": "משלימים רשימת בדיקה לפני פעולה",
    "source": null,
    "paragraphs": [
      "לפני מתן הוראה עברו על שם המוצר, הסכום, התקופה, הריבית ותנאי המשיכה כפי שהם מופיעים במסמך שקיבלתם. סמנו שאלה פתוחה ליד כל פרט שלא הוסבר. אם התקבל הסבר בעל פה, בקשו הפניה לסעיף או אישור כתוב, כדי שתוכלו להסתמך על מסמך שתואם את ההצעה.",
      "לאחר פעולה שבחרתם לבצע, השוו את אישור ההפקדה להוראות שנתתם. אם מצאתם הבדל, פנו לבנק לבירור ותעדו את המענה. שמרו את התיק במקום שתוכלו לאתר בעת הצורך. מטרת הבדיקה היא להבין את ההתחייבות ואת הזמינות, בלי לייחס למוצר יתרון כללי לכל חוסך."
    ]
  }
];
const faqItems = [
  {
    "question": "האם נתון בקו המשווה הוא ריבית שאקבל?",
    "answer": "לא בהכרח. אלה נתונים מדווחים להשוואה כללית, עם הנחות והסתייגויות המפורטות במקור. בקשו הצעה אישית ומסמך תנאים לפני החלטה."
  },
  {
    "question": "האם צריך להפקיד דווקא בבנק של העו״ש?",
    "answer": "מדריך בנק ישראל מציין שאפשר להפקיד גם בבנק אחר. בדקו את פרטי ההליך והתנאים בהצעה שתקבלו; אין בכך המלצה לעבור בנק."
  },
  {
    "question": "האם מותר למשוך בכל עת?",
    "answer": "יש לבדוק את ההסכם המסוים. בנק ישראל מתאר תחנות יציאה ומגבלות אפשריות; אין להניח שקיימת אפשרות משיכה מוקדמת ללא עלות."
  }
];
const relatedLinks = [
  [
    "/savings",
    "חיסכון ומשפחה"
  ],
  [
    "/savings/savings-account",
    "ניהול חשבון חיסכון"
  ],
  [
    "/savings/emergency-fund",
    "תכנון רזרבה לחירום"
  ],
  [
    "/savings/sinking-funds",
    "חיסכון להוצאה מתוכננת"
  ],
  [
    "/savings/family-budget",
    "תקציב משפחתי"
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

export default function BankDepositPage() {
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
