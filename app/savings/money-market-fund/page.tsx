import type { Metadata } from 'next';
import Link from 'next/link';
import { AuthorBox } from '@/components/calculator/AuthorBox';
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';

const title = 'קרן כספית: איך להבין תשואה, נזילות, עלויות ומס';
const description = 'מהי קרן כספית, מה ההבדל בין קרן יומית לקרן במועדים קבועים ואילו פרטים לבדוק במסמכי הקרן. מדריך עם מקורות רשמיים, ללא דירוג קרנות.';
const pageUrl = 'https://cheshbonai.co.il/savings/money-market-fund';
const checkedAt = '2026-10-30';
const quickAnswer = 'קרן כספית היא קרן נאמנות המשקיעה בנכסים בעלי סיכון ותנודתיות נמוכים יחסית, לפי הסבר בנק ישראל. לפני רכישה יש לזהות אם זו קרן יומית או קרן במועדים קבועים, ולבדוק את מסמכי הקרן, דמי הניהול ומועדי הפדיון. אומדן תשואה בקרן במועדים קבועים אינו התחייבות להשגתו, כפי שמדגישה רשות ניירות ערך.';
const sources = [
  { label: 'בנק ישראל — קרן כספית: מאפיינים, חשבון ניירות ערך, דמי ניהול ומיסוי ריאלי', url: 'https://www.boi.org.il/information/bank-paymnts/savingsandinvestmentproducts/moneyfund/' },
  { label: 'בנק ישראל — שקיפות במוצרי שוק הכסף וההבחנה בין קרנות יומיות למועדים קבועים', url: 'https://www.boi.org.il/publications/pressreleases/12-5-25/' },
  { label: 'רשות ניירות ערך — מדריך ליישום ההוראה לגבי קרן כספית, גילוי בתשקיף ובדוח השנתי (PDF)', url: 'https://www.new.isa.gov.il/images/Fittings/isa/asset_library_pic/al_lobby/al_lobby-62bd445f910eb/guideFunds.pdf' },
];
const sections = [
  {
    heading: 'מתחילים בזיהוי המוצר, לפני חיפוש התשואה',
    paragraphs: [
      'בנק ישראל מסביר שההשקעה נעשית דרך חשבון ניירות ערך בבנק או בבית השקעות. נקודת הפתיחה לבדיקה היא שם הקרן ומספרה במסמך המוצר. אל תסתפקו בכותרת של מסך חיסכון או בשם מסחרי דומה: בקשו לראות לאיזה מוצר בדיוק מתייחסים הנתונים שהוצגו לכם.',
      'הכינו תיק בדיקה קצר: פרטי הזיהוי, מסמכי הקרן העדכניים, תאריך הנתונים והשאלות שנותרו פתוחות. מטרת התיק היא לאפשר שיחה ממוקדת עם בעל רישיון מתאים. למשל, אם נאמר לכם שהכסף זמין, בקשו שיצביעו על תנאי הפדיון של הקרן שזוהתה, במקום להסתפק בהסבר על קרנות כספיות באופן כללי.',
    ],
    refs: [0],
  },
  {
    heading: 'קרן יומית וקרן במועדים קבועים הן בדיקות נזילות שונות',
    paragraphs: [
      'בפרסום בנק ישראל על מוצרי שוק הכסף מתוארת קרן יומית שבה אפשר לרכוש ולפדות יחידות בכל יום מסחר, לצד קרן במועדים קבועים. מדריך רשות ניירות ערך מפנה בתשקיף הקרן במועדים קבועים לפירוט מועדי הגשת ההזמנות ולמועד ביצוען. לכן אין להחיל את תיאור הנזילות היומית על כל קרן שנושאת את המילה כספית.',
      'בדקו בנפרד מתי אפשר למסור הוראה, מתי היא אמורה להתבצע ומתי התמורה צפויה להיות זמינה בחשבון שלכם. בקשו הסבר גם לגבי הוראה שנמסרה אחרי השעה הרלוונטית או סביב יום שאינו יום מסחר. אם הכסף מיועד לתשלום במועד ידוע, השוו את התשובה למועד התשלום; העמוד אינו מבטיח זיכוי בשעה או ביום מסוים.',
    ],
    refs: [1, 2],
  },
  {
    heading: 'תשואה שהתרחשה ואומדן לעתיד אינם אותו נתון',
    paragraphs: [
      'רשות ניירות ערך מבהירה במדריך היישום שפרסום אומדן תשואה צפויה בקרן במועדים קבועים אינו התחייבות של מנהל הקרן להשיגו. המדריך מתייחס גם להצגה במונחים תקופתיים ושנתיים ולהשוואת האומדן לתשואה בפועל בדוח השנתי. את הנתונים צריך לקרוא יחד עם תקופת המדידה וההסבר המצורף להם.',
      'ליד כל נתון תשואה שאתם בוחנים, כתבו אם מדובר בעבר או באומדן, לאיזו תקופה הוא מתייחס ומה תאריך פרסומו. אם מוצג נתון שנתי לצד תקופת החזקה אחרת, בקשו הסבר כיצד לקרוא אותו. השאירו מקום לתוצאה שונה מהאומדן בתכנון האישי; אין כאן תחזית לתשואת קרן מסוימת או הבטחה לתוצאה עתידית.',
    ],
    refs: [2],
  },
  {
    heading: 'סיכון נמוך יחסית אינו תחליף לקריאת מדיניות הקרן',
    paragraphs: [
      'הסבר בנק ישראל מתאר נכסים בעלי סיכון ותנודתיות נמוכים ומגבלות על ההשקעות. זהו תיאור מאפייני המוצר, ולא קביעה שהקרן המסוימת מתאימה לכל צורך שלכם. השתמשו בו כפתח לבירור: אילו נכסים מופיעים במדיניות, אילו סיכונים מתוארים במסמכים ומה משמעותם ביחס לשימוש המתוכנן בכסף?',
      'בפגישה מקצועית אפשר לשאול מה עלול להשתבש במוצר הנבדק, מה ניתן להבין מהמסמכים ומה נותר בלתי ידוע. בקשו הסבר בשפה שאתם מבינים, כולל הבחנה בין רמת הסיכון לבין האפשרות לקבל את הכסף במועד הרצוי. אל תסיקו מסיווג המוצר לבדו שקיימת התחייבות לשמירת סכום ההשקעה או לתשואה מסוימת.',
    ],
    refs: [0, 2],
  },
  {
    heading: 'קוראים עלויות ומס בלי להמציא סכום נטו',
    paragraphs: [
      'בנק ישראל מפנה לבדיקת דמי הניהול לפני רכישה ומסביר שמיסוי הרווח בקרן כספית מתייחס לרווח הריאלי, שמעבר לעליית מדד המחירים לצרכן בתקופה. ההסבר הכללי אינו חישוב מס אישי. לפני השוואת סכום נטו, בקשו בירור של סיווג הקרן ושל אופן הטיפול במס בחשבון שלכם אצל איש מקצוע מתאים.',
      'הפרידו בדף הבדיקה בין דמי הניהול המופיעים במסמכי הקרן לבין עלויות שנמסרו לכם ביחס לחשבון ולפעולה. שאלו מה כבר נכלל בנתון התשואה שמוצג ומה עדיין טעון בירור. אין לנכות עלות פעם נוספת בלי להבין אם נכללה בנתון, ואין להכניס שיעור מס מתוך מאמר כללי במקום בדיקה של נסיבות ההחזקה.',
    ],
    refs: [0],
  },
  {
    heading: 'מסיימים בשאלות שאפשר לבדוק במסמך',
    paragraphs: [
      'לפני החלטה, נסו להשלים משפט פשוט: זיהיתי את הקרן, הבנתי את סוג הנזילות, ביררתי כיצד נקרא נתון התשואה ורשמתי מה עדיין חסר לבדיקת העלויות והמס. אם אחד החלקים חסר, נסחו שאלה ממוקדת לגביו. אין צורך לבחור מוצר כדי להכין את הבירור הזה, ואין ברשימה אישור לבצע עסקה.',
      'אם החלטתם לפעול לאחר בירור מקצועי, שמרו את המסמכים שעליהם הסתמכתם ואת אישור הפעולה. השוו בין פרטי ההוראה לבין מה שבוצע, ופנו לגורם המטפל אם נדרש הסבר. להחלטה עתידית חזרו למסמכים עדכניים ולמטרת הכסף, במקום להפוך נתון שראיתם בעבר לכלל פעולה קבוע.',
    ],
    refs: [],
  },
];
const faqItems = [
  { question: 'האם כל קרן כספית מאפשרת פדיון יומי?', answer: 'לא. בנק ישראל מבחין בין קרן יומית לקרן במועדים קבועים. בקרן במועדים קבועים יש לבדוק בתשקיף את מועדי מסירת ההזמנות וביצוען; אין להסיק נזילות יומית משם המוצר בלבד.', refs: [1, 2] },
  { question: 'האם תשואה צפויה היא סכום שהמנהל מתחייב להשיג?', answer: 'לא. מדריך רשות ניירות ערך לקרן במועדים קבועים דורש להבהיר שאומדן התשואה הצפויה אינו התחייבות להשגתו. קראו גם את התקופה ואת משמעות הנתון.', refs: [2] },
  { question: 'האם העמוד מאפשר לחשב כמה מס אשלם?', answer: 'לא. הסבר בנק ישראל מתייחס למיסוי רווח ריאלי, אך העמוד אינו קובע שיעור מס, פטור או זכאות אישית. לבירור נדרשים פרטי ההחזקה וייעוץ של רואה חשבון או יועץ מס לפי העניין.', refs: [0] },
];
const relatedLinks = [
  ['/savings', 'חיסכון ומשפחה'],
  ['/savings/deposit-vs-money-market-fund', 'השוואת פיקדון לקרן כספית'],
  ['/savings/emergency-fund', 'תכנון כסף למקרה חירום'],
  ['/savings/sinking-funds', 'חיסכון להוצאה מתוכננת'],
];

export const metadata: Metadata = {
  title: { absolute: `${title} | חשבונאי` }, description,
  alternates: { canonical: pageUrl },
  openGraph: { title, description, url: pageUrl, type: 'article', locale: 'he_IL', siteName: 'חשבונאי', publishedTime: checkedAt, modifiedTime: checkedAt, images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: title }] },
  twitter: { card: 'summary_large_image', title, description, images: ['/opengraph-image'] },
};
const articleSchema = {
  '@context': 'https://schema.org', '@type': 'Article', '@id': `${pageUrl}#article`,
  headline: title, description, url: pageUrl, mainEntityOfPage: pageUrl, inLanguage: 'he-IL',
  datePublished: checkedAt, dateModified: checkedAt,
  author: { '@type': 'Organization', name: 'מערכת חשבונאי', url: 'https://cheshbonai.co.il/about' },
  publisher: { '@type': 'Organization', name: 'חשבונאי', url: 'https://cheshbonai.co.il' },
  citation: sources.map((source) => source.url),
};
const faqSchema = {
  '@context': 'https://schema.org', '@type': 'FAQPage', '@id': `${pageUrl}#faq`,
  mainEntity: faqItems.map((item) => ({ '@type': 'Question', name: item.question, acceptedAnswer: { '@type': 'Answer', text: item.answer } })),
};

function SourceRefs({ refs }: { refs: number[] }) {
  return refs.length ? <p className="mt-3 text-sm leading-7 text-ink/70">מקור: {refs.map((ref, index) => <span key={ref}>{index > 0 && ' · '}<a href={sources[ref].url} target="_blank" rel="noopener noreferrer" className="underline">{sources[ref].label}</a></span>)}</p> : null;
}

export default function MoneyMarketFundPage() {
  return (
    <main dir="rtl" className="mx-auto max-w-4xl px-5 py-12 text-ink">
      <BreadcrumbSchema items={[{ name: 'דף הבית', url: '/' }, { name: 'חיסכון ומשפחה', url: '/savings' }, { name: title, url: pageUrl }]} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([articleSchema, faqSchema]).replace(/</g, '\\u003c') }} />
      <nav aria-label="פירורי לחם" className="mb-8 text-sm text-ink/70"><Link href="/" className="underline">דף הבית</Link>{' / '}<Link href="/savings" className="underline">חיסכון ומשפחה</Link>{' / '}<span aria-current="page">קרן כספית</span></nav>
      <article className="space-y-8">
        <header>
          <h1 className="font-serif text-3xl leading-tight md:text-4xl">{title}</h1>
          <p className="mt-4 text-sm text-ink/70">מאת מערכת חשבונאי · נבדק ועודכן: <time dateTime={checkedAt}>30.10.2026</time></p>
        </header>
        <section aria-labelledby="quick-answer" className="border border-gold/40 bg-paper p-6">
          <h2 id="quick-answer" className="mb-3 text-xl font-bold">תשובה מהירה</h2>
          <p className="leading-8">{quickAnswer}</p><SourceRefs refs={[0, 2]} />
        </section>
        <aside aria-label="הבהרה מקצועית" className="border-r-4 border-gold bg-paper p-5 leading-8">
          המידע כללי ואינו ייעוץ מס, משפטי, פנסיוני או השקעות. נדרשת התייעצות עם בעל רישיון מתאים לתחום ולנסיבות לפני החלטה. אין כאן המלצה על קרן או ספק, התחייבות לשמירת הקרן או הבטחת תשואה.
        </aside>
        {sections.map((section, index) => <section key={section.heading} aria-labelledby={`section-${index}`} className="space-y-3">
          <h2 id={`section-${index}`} className="text-2xl font-bold">{section.heading}</h2>
          {section.paragraphs.map((paragraph) => <p key={paragraph} className="leading-8">{paragraph}</p>)}
          <SourceRefs refs={section.refs} />
        </section>)}
        <section aria-labelledby="faq" className="space-y-5">
          <h2 id="faq" className="text-2xl font-bold">שאלות נפוצות על קרן כספית</h2>
          {faqItems.map((item) => <div key={item.question}><h3 className="mb-2 text-lg font-bold">{item.question}</h3><p className="leading-8">{item.answer}</p><SourceRefs refs={item.refs} /></div>)}
        </section>
        <section aria-labelledby="official-sources" className="border border-ink/15 p-6">
          <h2 id="official-sources" className="mb-3 text-2xl font-bold">מקורות רשמיים ושיטת הבדיקה</h2>
          <p className="mb-4 leading-8">המקורות נבדקו ב־30.10.2026. המדריך מרכז הסברים רשמיים ושאלות לקריאת מסמכים; הוא אינו סקירת ביצועים של קרנות ואינו בדיקה מקצועית של מוצר מסוים. במדריך רשות ניירות ערך ראו במיוחד את פרקי הגילוי בתשקיף והדוח השנתי.</p>
          <ul className="list-inside list-disc space-y-3 leading-7">{sources.map((source) => <li key={source.url}><a href={source.url} target="_blank" rel="noopener noreferrer" className="text-gold underline">{source.label}</a></li>)}</ul>
        </section>
        <section aria-labelledby="related-reading"><h2 id="related-reading" className="mb-4 text-2xl font-bold">להמשך הבירור</h2><ul className="grid gap-3 sm:grid-cols-2">{relatedLinks.map(([href, label]) => <li key={href}><Link href={href} className="text-gold underline">{label}</Link></li>)}</ul></section>
        <p className="text-sm leading-7 text-ink/70">אחריות התוכן: מערכת חשבונאי. תיבת בעל האתר מציגה את זהותו המקצועית; אין בה הצהרה על ייעוץ השקעות או על בדיקה פרטנית של נסיבות הקורא.</p>
        <AuthorBox title="רואה חשבון · סמנכ״ל כספים · בעל האתר" bio="פרטי בעל האתר ותחומי עיסוקו מופיעים בדף האודות. בירור השקעות אישי דורש פנייה לבעל רישיון מתאים." />
      </article>
    </main>
  );
}
