import type { Metadata } from 'next';
import Link from 'next/link';
import { AuthorBox } from '@/components/calculator/AuthorBox';
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';

const title = 'פיקדון או קרן כספית: איך להשוות הצעות לאותו כסף';
const description = 'השוואת פיקדון בנקאי לקרן כספית לפי מועד השימוש בכסף, סוג הנתון, פדיון, עלויות ובירור מס. טבלת בדיקה עם מקורות רשמיים וללא המלצה על מוצר.';
const pageUrl = 'https://cheshbonai.co.il/savings/deposit-vs-money-market-fund';
const checkedAt = '2026-10-30';
const quickAnswer = 'השוואת פיקדון לקרן כספית מתחילה במועד שבו צריך את הכסף ובמסמכים של המוצרים המסוימים. בפיקדון בודקים מנגנון ריבית ותנאי יציאה; בקרן מזהים אם היא יומית או במועדים קבועים. אין להשוות ריבית מוסכמת בפיקדון בריבית קבועה לאומדן תשואה בקרן כאילו שניהם התחייבות זהה. בנק ישראל ורשות ניירות ערך מסבירים את ההבחנות במקורות להלן.';
const sources = [
  { label: 'בנק ישראל — פיקדון בנקאי: ריבית קבועה ומשתנה, תחנות יציאה ומשיכה מוקדמת', url: 'https://www.boi.org.il/information/bank-paymnts/savingsandinvestmentproducts/pikadon/' },
  { label: 'בנק ישראל — קרן כספית: מאפיינים, דמי ניהול ומיסוי הרווח הריאלי', url: 'https://www.boi.org.il/information/bank-paymnts/savingsandinvestmentproducts/moneyfund/' },
  { label: 'בנק ישראל — קו המשווה לפיקדונות: הנחות, תקופת דיווח והסתייגויות', url: 'https://boi.org.il/information/bank-paymnts/financial-education/campaigns/boi-equator/deposit/' },
  { label: 'בנק ישראל — שקיפות במוצרי שוק הכסף: קרן יומית וקרן במועדים קבועים', url: 'https://www.boi.org.il/publications/pressreleases/12-5-25/' },
  { label: 'רשות ניירות ערך — מדריך ליישום ההוראה לגבי קרן כספית: מועדי הזמנות ואומדן תשואה (PDF)', url: 'https://www.new.isa.gov.il/images/Fittings/isa/asset_library_pic/al_lobby/al_lobby-62bd445f910eb/guideFunds.pdf' },
];
const comparisonRows = [
  { topic: 'זהות המוצר', deposit: 'סוג הפיקדון והצעה כתובה מהבנק.', fund: 'שם ומספר הקרן ומסמכיה העדכניים.', refs: [0, 1] },
  { topic: 'משמעות נתון התשואה', deposit: 'בריבית קבועה הריבית נקבעת לתקופה; בריבית משתנה התוצאה תלויה במנגנון.', fund: 'בדקו אם זה נתון עבר או אומדן בקרן במועדים קבועים; האומדן אינו התחייבות.', refs: [0, 4] },
  { topic: 'גישה לכסף', deposit: 'לפי התקופה ותחנות היציאה; ייתכנו מגבלות ועלות למשיכה מוקדמת.', fund: 'הבחינו בין פדיון בימי מסחר בקרן יומית לבין מועדים קבועים.', refs: [0, 3, 4] },
  { topic: 'בדיקת עלויות ומס', deposit: 'בקשו פירוט של הסכום לפני ואחרי מס ושל כל עלות בתרחיש היציאה שבחרתם.', fund: 'בקשו פירוט דמי ניהול, עלויות חשבון והטיפול במס; סמנו מה כבר נכלל בתשואה.', refs: [] },
];
const sections = [
  {
    heading: 'מגדירים השוואה שאפשר לסיים בתשובה',
    paragraphs: [
      'כתבו מה הסכום שאתם בוחנים, מהו המטבע שבו תידרשו לשלם ומתי צפוי השימוש בכסף. סמנו אם מועד השימוש קבוע או פתוח, והאם ייתכן צורך רק בחלק מהסכום. אלה שאלות הכנה להשוואה, לא קביעה איזה מוצר מתאים לכם. בלי מסגרת כזו, גם נתון תשואה ברור אינו עונה על השאלה המעשית.',
      'המחשה ללא חישוב: כסף לתשלום שכבר נקבע לו מועד מזמין בדיקה אחרת מכסף שאין לו עדיין יעד. במקרה הראשון שאלת הבירור המרכזית היא התאמה למועד התשלום; במקרה השני כדאי לנסח קודם מה ייחשב צורך בכסף. אין בתיאור המלצה להפקיד או לרכוש קרן, אלא דרך להציג לבעל מקצוע את אותה שאלה לגבי שתי החלופות.',
    ],
    refs: [],
  },
  {
    heading: 'מעמידים ריבית, תשואת עבר ואומדן על בסיס קריאה משותף',
    paragraphs: [
      'לפי בנק ישראל, בפיקדון בריבית קבועה ניתן לדעת את הריבית בסוף התקופה, ואילו ריבית משתנה תלויה במנגנון שלה. מנגד, רשות ניירות ערך מבהירה שאומדן תשואה בקרן במועדים קבועים אינו התחייבות להשגתו. לכן ליד כל מספר שמתקבל בהצעה כתבו איזה סוג נתון הוא, לפני ניסיון להשוות תוצאות.',
      'בקשו להציג את הנתונים ביחס לאותה תקופת בדיקה, ולציין אם מדובר במונחים שנתיים או תקופתיים. אם יש אומדן, השאירו אותו מסומן כאומדן גם בסיכום ההשוואה. אל תשלימו לבד נתון חסר באמצעות תשואת העבר או ריבית כללית במשק. העמוד אינו מציג שיעורי תשואה, תחזית ריבית או סכום עתידי מחושב.',
    ],
    refs: [0, 4],
  },
  {
    heading: 'בודקים את תרחיש היציאה שההשוואה אמורה לשרת',
    paragraphs: [
      'בנק ישראל מתאר פיקדונות עם תחנות יציאה ומגבלות אפשריות על משיכה מוקדמת. בפרסום על שוק הכסף הוא מבחין בין קרן יומית לקרן במועדים קבועים. אל תערכו את ההשוואה כאילו כל פיקדון נעול וכל קרן נזילה בכל רגע; היעזרו בסוג המוצר ובמסמכים כדי לזהות את מועדי הפעולה הרלוונטיים.',
      'שלחו לכל גורם את אותה שאלה: אם אצטרך את הכסף בתאריך שקבעתי, איזו הוראה עליי לתת, מתי תבוצע ומה עליי לברר לגבי התמורה? שאלו גם על צורך מוקדם מהמתוכנן ועל משיכה חלקית. רשמו תשובה נפרדת לכל חלופה. כך אפשר לראות היכן חסר מידע בלי להמיר את המילה נזיל בהבטחה לזמינות מיידית.',
    ],
    refs: [0, 3, 4],
  },
  {
    heading: 'מפרידים בירור מס מהשוואת הנתון המוצג',
    paragraphs: [
      'מדריך בנק ישראל לקרן כספית מתאר מיסוי של רווח ריאלי, שמעל עליית מדד המחירים לצרכן בתקופה, ומפנה לבדוק דמי ניהול. אין מכך מסקנה שאפשר להכריע בין מוצרים לפי כותרת מס בלבד. כאן לא נקבע שיעור מס לפיקדון או לקרן, לא נבחנת זכאות לפטור ולא מחושב יתרון נטו לחוסך.',
      'בקשו לגבי כל חלופה פירוט: מהו הנתון לפני מס, אילו עלויות כבר נכללו בו ומה עדיין דורש בדיקה. העבירו שאלות מס לרואה חשבון או ליועץ מס עם פרטי המוצר והחשבון. אם עדיין אין תשובה, השאירו את שורת הנטו פתוחה. סימון חוסר מידע שימושי יותר מתוצאה מדויקת לכאורה שנבנתה על הנחה שלא נבדקה.',
    ],
    refs: [1],
  },
  {
    heading: 'משתמשים בקו המשווה כדי לבחון הצעה, ואז חוזרים למסמכים',
    paragraphs: [
      'קו המשווה של בנק ישראל מבוסס על דיווחי הבנקים על עסקאות בפועל בחודש הנתונים. נתוני הפיקדונות מניחים החזקה לאורך חיי הפיקדון ללא פירעון מוקדם, והאתר מבהיר שההשוואה כללית ואינה כוללת את מלוא תנאי השירות. לכן רשמו את החודש ואת סוג הפיקדון שנבדק לצד ההצעה האישית, ולא במקומה.',
      'בסיום הכינו סיכום קצר עם פרטי שתי החלופות, הנקודות שאומתו והפערים שעדיין דורשים הסבר. אם הצעה תוקנה או הוחלף מוצר, עדכנו את הסיכום בהתאם לפני החלטה. אין חובה להגיע למנצח כללי: מטרת הבדיקה היא להבין מה נשען על הסכם, מה על אומדן, ואילו שאלות צריך להעביר לבעל רישיון לפני פעולה בכסף שלכם.',
    ],
    refs: [2],
  },
];
const faqItems = [
  { question: 'האם הקרן עם נתון התשואה הגבוה יותר עדיפה על הפיקדון?', answer: 'הנתון לבדו אינו מספיק להשוואה. בדקו אם הוא תשואת עבר, אומדן או ריבית מוסכמת, לאיזו תקופה הוא מתייחס ומהם תנאי היציאה. אומדן בקרן במועדים קבועים אינו התחייבות להשגתו.', refs: [0, 4] },
  { question: 'האם נתון קו המשווה הוא הצעה אישית מהבנק?', answer: 'לא. לפי הבהרות בנק ישראל אלה נתונים להשוואה כללית המבוססים על דיווחים על עסקאות בפועל. יש לבדוק את ההסכם האישי ואת התנאים והסייגים הנלווים אליו.', refs: [2] },
  { question: 'אילו מסמכים להכין לייעוץ לפני בחירה?', answer: 'כהכנה לשיחה, רכזו את הצעת הפיקדון, מסמכי הקרן, תאריך הנתונים, מועד הצורך בכסף והשאלות לגבי עלויות ומס. זו רשימת עזר לשיחה, ואינה רשימת מסמכים מחייבת או קביעה שהמוצרים מתאימים לכם.', refs: [] },
];
const relatedLinks = [
  ['/savings', 'חיסכון ומשפחה'],
  ['/savings/bank-deposit', 'קריאת הצעת פיקדון בנקאי'],
  ['/savings/money-market-fund', 'הבנת מסמכי קרן כספית'],
  ['/savings/sinking-funds', 'תכנון חיסכון להוצאה ידועה'],
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

export default function DepositVsMoneyMarketFundPage() {
  return (
    <main dir="rtl" className="mx-auto max-w-4xl px-5 py-12 text-ink">
      <BreadcrumbSchema items={[{ name: 'דף הבית', url: '/' }, { name: 'חיסכון ומשפחה', url: '/savings' }, { name: title, url: pageUrl }]} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([articleSchema, faqSchema]).replace(/</g, '\\u003c') }} />
      <nav aria-label="פירורי לחם" className="mb-8 text-sm text-ink/70"><Link href="/" className="underline">דף הבית</Link>{' / '}<Link href="/savings" className="underline">חיסכון ומשפחה</Link>{' / '}<span aria-current="page">פיקדון מול קרן כספית</span></nav>
      <article className="space-y-8">
        <header>
          <h1 className="font-serif text-3xl leading-tight md:text-4xl">{title}</h1>
          <p className="mt-4 text-sm text-ink/70">מאת מערכת חשבונאי · נבדק ועודכן: <time dateTime={checkedAt}>30.10.2026</time></p>
        </header>
        <section aria-labelledby="quick-answer" className="border border-gold/40 bg-paper p-6"><h2 id="quick-answer" className="mb-3 text-xl font-bold">תשובה מהירה</h2><p className="leading-8">{quickAnswer}</p><SourceRefs refs={[0, 3, 4]} /></section>
        <aside aria-label="הבהרה מקצועית" className="border-r-4 border-gold bg-paper p-5 leading-8">המידע כללי ואינו ייעוץ מס, משפטי, פנסיוני או השקעות. נדרשת התייעצות עם בעל רישיון מתאים לתחום ולנסיבות לפני החלטה. אין כאן המלצה על בנק, קרן או ספק, דירוג מוצרים או הבטחת תשואה.</aside>
        <section aria-labelledby="comparison" className="space-y-4">
          <h2 id="comparison" className="text-2xl font-bold">טבלת בדיקה להצעה מול מסמכי קרן</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-right text-sm leading-7">
              <caption className="mb-3 text-right text-ink/70">שאלות להשוואה פרטנית; הטבלה אינה קובעת מוצר עדיף.</caption>
              <thead><tr><th scope="col" className="border border-ink/20 p-3">מה בודקים</th><th scope="col" className="border border-ink/20 p-3">פיקדון בנקאי</th><th scope="col" className="border border-ink/20 p-3">קרן כספית</th></tr></thead>
              <tbody>{comparisonRows.map((row) => <tr key={row.topic}><th scope="row" className="border border-ink/20 p-3 align-top">{row.topic}</th><td className="border border-ink/20 p-3 align-top">{row.deposit}</td><td className="border border-ink/20 p-3 align-top">{row.fund}<SourceRefs refs={row.refs} /></td></tr>)}</tbody>
            </table>
          </div>
        </section>
        {sections.map((section, index) => <section key={section.heading} aria-labelledby={`section-${index}`} className="space-y-3"><h2 id={`section-${index}`} className="text-2xl font-bold">{section.heading}</h2>{section.paragraphs.map((paragraph) => <p key={paragraph} className="leading-8">{paragraph}</p>)}<SourceRefs refs={section.refs} /></section>)}
        <section aria-labelledby="faq" className="space-y-5"><h2 id="faq" className="text-2xl font-bold">שאלות נפוצות על ההשוואה</h2>{faqItems.map((item) => <div key={item.question}><h3 className="mb-2 text-lg font-bold">{item.question}</h3><p className="leading-8">{item.answer}</p><SourceRefs refs={item.refs} /></div>)}</section>
        <section aria-labelledby="official-sources" className="border border-ink/15 p-6">
          <h2 id="official-sources" className="mb-3 text-2xl font-bold">מקורות רשמיים ותאריך בדיקה</h2>
          <p className="mb-4 leading-8">נבדק ועודכן ב־30.10.2026. ההשוואה מבוססת על הסברי הרשויות, לא על איסוף הצעות מסחריות. שאלות ההכנה הן כלי עבודה לקורא. בנתוני קו המשווה יש לבדוק את חודש הדיווח; במסמכי הקרן יש לבדוק את הגרסה הרלוונטית למוצר.</p>
          <ul className="list-inside list-disc space-y-3 leading-7">{sources.map((source) => <li key={source.url}><a href={source.url} target="_blank" rel="noopener noreferrer" className="text-gold underline">{source.label}</a></li>)}</ul>
        </section>
        <section aria-labelledby="related-reading"><h2 id="related-reading" className="mb-4 text-2xl font-bold">מדריכים להמשך ההשוואה</h2><ul className="grid gap-3 sm:grid-cols-2">{relatedLinks.map(([href, label]) => <li key={href}><Link href={href} className="text-gold underline">{label}</Link></li>)}</ul></section>
        <p className="text-sm leading-7 text-ink/70">אחריות התוכן: מערכת חשבונאי. פרטי בעל האתר מוצגים להלן; אין בהצגתם אישור להתאמת מוצר או לבדיקה אישית של נסיבות הקורא.</p>
        <AuthorBox title="רואה חשבון · סמנכ״ל כספים · בעל האתר" bio="פרטי בעל האתר ותחומי עיסוקו מופיעים בדף האודות. השוואה אישית בין מוצרי השקעה דורשת פנייה לבעל רישיון מתאים." />
      </article>
    </main>
  );
}
