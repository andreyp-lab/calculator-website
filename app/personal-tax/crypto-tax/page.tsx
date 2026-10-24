import type { Metadata } from 'next';
import Link from 'next/link';
import { AuthorBox } from '@/components/calculator/AuthorBox';
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';

const title = 'מס על קריפטו: מכירה, החלפת מטבעות ותיעוד לבדיקה';
const description = 'עמדת רשות המסים על מכירת קריפטו והחלפת מטבע במטבע, ואיך מכינים היסטוריית פעילות לבדיקה מקצועית. ללא שיעור מס גורף או המלצת השקעה.';
const path = '/personal-tax/crypto-tax';
const url = `https://cheshbonai.co.il${path}`;
const checkedAt = '2026-10-24';
const sources = [
  {
    label: 'רשות המסים — רשימת עמדות חייבות בדיווח לשנת המס 2025, עמדה 91/2021, עמוד 39',
    url: 'https://www.gov.il/BlobFolder/news/sa301225-3/en/ReportStation_2025_1.pdf#page=39',
  },
  {
    label: 'רשות המסים — שירות הדוח השנתי לשנת המס 2025: נספחי רווח הון ודיווחים מיוחדים',
    url: 'https://www.gov.il/he/service/reporting-and-payment-2025-annual-tax-report-for-individuals',
  },
  {
    label: 'רשות המסים — דיווח על מכירת נכס בטופס 1399י, לרבות מטבעות וירטואליים',
    url: 'https://www.gov.il/he/service/declaration-assets-sale-itc1399',
  },
];
const quickAnswer = 'לפי עמדה 91/2021 של רשות המסים, המופיעה גם ברשימת העמדות לשנת המס 2025, מכירת מטבע וירטואלי היא אירוע מס; גם החלפת מטבע אחד באחר נחשבת מימוש, אף בלי קבלת כסף רשמי. אם הפעילות מגיעה לכדי עסק, הסיווג שונה. במימוש המסווג במישור ההוני יש לבדוק גם דיווח בטופס 1399י בתוך 30 ימים ממועד המכירה; הדוח השנתי אינו מחליף את הדיווח במועד.';
const sections = [
  {
    heading: 'מה קובעת העמדה הרשמית על מכירה והמרה?',
    source: 0,
    paragraphs: [
      'העמדה מסווגת מטבע וירטואלי כנכס לעניין פקודת מס הכנסה. היא מבחינה בין רווח הון ממכירה לבין הכנסה מפעילות שמגיעה לכדי עסק, ומבהירה שגם החלפת ביטקוין באת׳ריום, למשל, היא מימוש. זו עמדת רשות המסים ולא חישוב אישי של רווח או מס. אין בעמוד קביעה שכל הפעולות בארנק נכללות באותו סיווג, ואין כאן שיעור מס אחיד.',
      'מבחינה מעשית, התחילו בתיאור הפעולה: מה יצא, מה התקבל, באיזה מועד והיכן נשמר התיעוד. הכותרת שמוצגת באפליקציה יכולה לסייע לאתר את הפעולה, אך בקשו מבעל המקצוע לבדוק את משמעותה לצורכי מס. כאשר מדובר במוצר או במנגנון שאינכם מבינים, צרפו גם את תיאורו ואת תנאיו כפי שנמסרו לכם. אל תבחרו סיווג רק מפני שהוא מופיע כברירת מחדל בתוכנה.',
    ],
  },
  {
    heading: 'בונים מפת חשבונות לפני שמסכמים רווחים',
    source: 0,
    paragraphs: [
      'רשמו באילו זירות וארנקים פעלתם, ומה הקשר ביניהם. אפשר לתת לכל חשבון כינוי פנימי ולציין לידו היכן נמצא יצוא הנתונים. המטרה היא לסייע לבודק לעקוב אחרי המסמכים, לא לפרסם כתובות או מידע אישי. הציגו בנפרד חשבון שהפסיק לפעול או זירה שכבר אין אליה גישה, וכתבו אילו נתונים עדיין ניתנים להשגה ממנה.',
      'הורידו היסטוריית פעולות מלאה ככל שניתן ושמרו עותק מקורי לפני כל מיון. לצד כל קובץ רשמו מתי הופק ואיזו תקופה הוא מכסה. אם מערכת מסחר מציעה גם סיכום רווח, שמרו אותו כקובץ נוסף. בקשו מהבודק להסביר אם הסיכום מתאים לנתונים ולשאלות המס שלכם. מספר מסכם אינו מחליף יכולת לחזור אל פרטי הפעולות שיצרו אותו.',
    ],
  },
  {
    heading: 'עוקבים אחרי שני צדי ההחלפה',
    source: 0,
    paragraphs: [
      'לבדיקת החלפה בין מטבעות הכינו רישום שמציג את הנכס שנמסר ואת הנכס שהתקבל באותה פעולה. שמרו מזהה עסקה, זמן ביצוע, כמויות, פירוט עמלות והמסמך שממנו נלקח כל פרט, ככל שהם זמינים. אלה הצעות לארגון המידע לבירור מקצועי, ולא רשימת שדות מחייבת של רשות המסים. השאירו סימון ברור במקום שבו הנתון חסר או אינו מובן.',
      'כאשר מייבאים נתונים מכמה מערכות, בדקו אם אותה פעולה הופיעה ביותר מקובץ אחד. אל תמחקו רשומות מתוך העותק המקורי; סמנו את החשד לכפילות בעותק עבודה. השוו גם את אזור הזמן ואת אופן הצגת שמות המטבעות. לאחר ההתאמה, העבירו לבודק את שאלות הסיווג והשווי. אין לבחור שיטת חישוב עלות או שער המרה רק מפני שקל יותר לחשב אותם.',
    ],
  },
  {
    heading: 'פערים שכדאי לפתור לפני שמסתמכים על דוח תוכנה',
    source: 0,
    paragraphs: [
      'עברו על רשומות שהתוכנה סימנה כחסרות עלות, כלא מזוהות או ככפולות. לכל שורה כזו חפשו את הפעולה המקורית ואת המסמך התומך, ותעדו מה נמצא ומה נשאר פתוח. אם השתמשתם בעבר בשירות אחר לחישוב, צרפו את הדוח הקודם ואת ההסבר שקיבלתם עליו. כך אפשר לשאול על הבדל מסוים, במקום להשוות רק בין סכומים סופיים שאינם מוסברים.',
      'בנו רשימת שאלות הנוגעת להיסטוריה שלכם: האם חסרה זירה, האם היבוא כיסה את כל התקופה, ומה משמעות השדות שהמערכת שינתה. לגבי תגמולים, הלוואות, כרייה או פעילות מורכבת אחרת, הכינו תיאור נפרד ובקשו מקור רשמי מתאים לבדיקה. המדריך אינו מספק להן כללי מס. עצם הופעת שורה בשם מסחרי מוכר אינה מאפשרת להחיל עליה אוטומטית את ההסבר על מכירה רגילה.',
    ],
  },
  {
    heading: 'מכינים חבילת בדיקה ומבררים את הדיווח המתאים',
    source: 2,
    paragraphs: [
      'סדרו חבילה הכוללת מפת חשבונות, קבצים מקוריים, דף התאמות ורשימת שאלות פתוחות. בקשו מבעל המקצוע לזהות אילו מסקנות כבר נתמכות ואילו דורשות השלמה. אם התקבלו תוצאות שונות משתי תוכנות, הציגו את הנחות העבודה ואת הרשומות שבמחלוקת. העמוד אינו ממליץ למכור נכס, לשנות החזקה או לבצע פעולה כדי ליצור תוצאה מסוימת.',
      'שירות רשות המסים לדיווח על מכירת נכס כולל מטבעות וירטואליים בין סוגי הנכסים ומורה על דיווח בטופס 1399י בתוך 30 ימים ממועד המכירה, גם במקרה של הפסד, ועל תשלום מקדמה כאשר נוצר מס לתשלום. לפי עמדה 91/2021, גם החלפה בין מטבעות נחשבת מימוש. הדוח השנתי הוא שלב נוסף ואינו מחליף את הדיווח במועד. בקשו מבעל המקצוע לבדוק אם הפעילות מסווגת במישור ההוני ומהו הדיווח המתאים לנסיבותיכם.',
    ],
  },
];
const faqItems = [
  {
    question: 'החלפתי מטבע במטבע בלי למשוך לבנק. האם יש מה לבדוק?',
    answer: 'כן. עמדה 91/2021 מתייחסת גם להחלפה בין מטבעות כמימוש, אף בלי קבלת מטבע רשמי. הציגו את פרטי ההחלפה ואת המסמכים לבדיקת החישוב האישי; העמוד אינו קובע את סכום הרווח או המס.',
  },
  {
    question: 'האם דוח הרווח מהזירה מספיק להכנת הדיווח?',
    answer: 'השתמשו בו כנקודת פתיחה לבירור: בדקו אילו חשבונות ותקופות נכללו, והאם אפשר לשחזר את הנתונים. בקשו מבעל מקצוע לקבוע אילו מסמכים וחישובים נוספים מתאימים למקרה שלכם.',
  },
  {
    question: 'איפה מופיע כאן שיעור המס על קריפטו?',
    answer: 'העמוד אינו מציג שיעור גורף. מטרתו להסביר את עמדת הרשות על מכירה והמרה ולעזור לארגן נתונים. סיווג הפעילות והחבות האישית נבדקים בנפרד עם איש מקצוע מורשה.',
  },
  {
    question: 'האם מספיק לדווח על המכירה בדוח השנתי?',
    answer: 'לא בהכרח. במימוש המסווג במישור ההוני, שירות רשות המסים מפנה לטופס 1399י ולדיווח בתוך 30 ימים ממועד המכירה, גם במקרה של הפסד. הדוח השנתי אינו מחליף את הדיווח במועד; יש לבדוק את הסיווג והטפסים המתאימים עם בעל מקצוע.',
  },
];

export const metadata: Metadata = {
  title: { absolute: `${title} | חשבונאי` }, description,
  alternates: { canonical: url },
  openGraph: { title, description, url, type: 'article', locale: 'he_IL', modifiedTime: checkedAt },
};

export default function CryptoTaxPage() {
  const structuredData = [
    {
      '@context': 'https://schema.org', '@type': 'Article', '@id': `${url}#article`,
      headline: title, description, url, mainEntityOfPage: url, inLanguage: 'he-IL',
      datePublished: checkedAt, dateModified: checkedAt,
      author: { '@type': 'Organization', name: 'מערכת חשבונאי', url: 'https://cheshbonai.co.il/about' },
      publisher: { '@type': 'Organization', name: 'חשבונאי', url: 'https://cheshbonai.co.il' },
      citation: sources.map((source) => source.url),
    },
    {
      '@context': 'https://schema.org', '@type': 'FAQPage', '@id': `${url}#faq`,
      mainEntity: faqItems.map((item) => ({
        '@type': 'Question', name: item.question,
        acceptedAnswer: { '@type': 'Answer', text: item.answer },
      })),
    },
  ];
  return (
    <main dir="rtl" className="mx-auto max-w-4xl px-5 py-12 text-ink">
      <BreadcrumbSchema items={[{ name: 'דף הבית', url: '/' }, { name: 'מיסוי אישי', url: '/personal-tax' }, { name: title, url: path }]} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, '\\u003c') }} />
      <nav aria-label="פירורי לחם" className="mb-8 text-sm text-ink/70">
        <Link href="/" className="underline">דף הבית</Link>{' / '}
        <Link href="/personal-tax" className="underline">מיסוי אישי</Link>{' / '}<span aria-current="page">מס על קריפטו</span>
      </nav>
      <article className="space-y-8">
        <header>
          <h1 className="font-serif text-3xl leading-tight md:text-4xl">{title}</h1>
          <p className="mt-4 text-sm text-ink/70">מאת מערכת חשבונאי · נבדק ועודכן: <time dateTime={checkedAt}>24.10.2026</time></p>
        </header>
        <section aria-labelledby="quick-answer" className="border border-gold/40 bg-paper p-6">
          <h2 id="quick-answer" className="mb-3 text-xl font-bold">תשובה מהירה</h2>
          <p className="leading-8">{quickAnswer}</p>
          <a href={sources[0].url} className="text-gold underline">לעמדה הרשמית ברשימת שנת המס 2025</a>
        </section>
        <aside aria-label="הבהרה" className="border-r-4 border-gold bg-paper p-5 leading-8">
          המידע כללי בלבד ואינו ייעוץ מס, משפטי, פנסיוני או השקעות, ואינו המלצה לקנות, למכור או להחזיק נכס.
          אין הבטחה לתוצאת מס. לפני דיווח או החלטה יש להיוועץ ברואה חשבון, ביועץ מס מורשה או בעורך דין בעל רישיון מתאים.
        </aside>
        {sections.map((section, index) => (
          <section key={section.heading} aria-labelledby={`section-${index}`} className="space-y-4">
            <h2 id={`section-${index}`} className="text-2xl font-bold">{section.heading}</h2>
            {section.paragraphs.map((paragraph) => <p key={paragraph} className="leading-8">{paragraph}</p>)}
            <p className="text-sm text-ink/70">מסגרת רשמית לבדיקה: <a href={sources[section.source].url} className="text-gold underline">{section.source === 0 ? 'עמדת הרשות על מכירה והמרה' : section.source === 1 ? 'שירות הדוח השנתי' : 'שירות הדיווח על מכירת נכס'}</a></p>
          </section>
        ))}
        <section aria-labelledby="faq" className="space-y-5">
          <h2 id="faq" className="text-2xl font-bold">שאלות נפוצות</h2>
          {faqItems.map((item) => <div key={item.question}><h3 className="mb-2 text-lg font-bold">{item.question}</h3><p className="leading-8">{item.answer}</p></div>)}
        </section>
        <section aria-labelledby="sources" className="border border-ink/15 p-6">
          <h2 id="sources" className="mb-3 text-2xl font-bold">מקורות רשמיים</h2>
          <p className="mb-4 leading-8">נבדקו ב־24.10.2026. עמדה 91/2021 נקראה ברשימת רשות המסים לשנת המס 2025, בעמוד 39. הצעות ארגון הקבצים הן כלי הכנה של המערכת, ואינן דרישות דיווח רשמיות.</p>
          <ul className="list-inside list-disc space-y-3">{sources.map((source) => <li key={source.url}><a href={source.url} className="text-gold underline">{source.label}</a></li>)}</ul>
        </section>
        <nav aria-label="להמשך הבדיקה" className="space-y-3 leading-8">
          <h2 className="text-2xl font-bold">להמשך הבדיקה</h2>
          <p>למבנה ההגשה ראו <Link href="/blog/annual-tax-report-1301" className="text-gold underline">מדריך הדוח השנתי</Link>. <Link href="/investments/capital-gains-tax" className="text-gold underline">כלי מס רווחי ההון</Link> אינו תחליף לחישוב עסקאות קריפטו. אם יש גם הכנסות אחרות מחוץ לישראל, ראו <Link href="/personal-tax/foreign-income" className="text-gold underline">הכנת נתוני הכנסות חוץ</Link> ובדקו את סיווגן בנפרד.</p>
        </nav>
        <p className="text-sm leading-7 text-ink/70">אחריות עריכת התוכן: מערכת חשבונאי. פרטי בעל האתר וזהותו המקצועית מופיעים להלן; אין בכך אישור לבדיקה פרטנית של נסיבות הקורא.</p>
        <AuthorBox bio="אנדרי פלטונוב, רואה חשבון וסמנכ״ל כספים, בעל אתר חשבונאי. המידע בעמוד נערך בידי המערכת על בסיס המקורות הרשמיים המקושרים ואינו חוות דעת על נסיבות אישיות." />
      </article>
    </main>
  );
}
