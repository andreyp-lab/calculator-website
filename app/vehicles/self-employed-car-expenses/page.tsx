import { withPageSocialMetadata } from '@/lib/config/site-info';
import type { Metadata } from 'next';
import Link from 'next/link';
import { AuthorBox } from '@/components/calculator/AuthorBox';
import { Breadcrumbs } from '@/components/calculator/Breadcrumbs';
import { DisclaimerBox } from '@/components/calculator/DisclaimerBox';
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';

const PAGE_PATH = '/vehicles/self-employed-car-expenses';
const PAGE_URL = `https://cheshbonai.co.il${PAGE_PATH}`;
const UPDATED = '2026-10-24';
const TITLE = 'הוצאות רכב לעצמאי: סיווג, חישוב ותיק מסמכים';
const DESCRIPTION = 'איך מכינים הוצאות רכב לדוח של עצמאי: תחולת תקנות הרכב, ההבדל בין ההוצאה לחיסכון במס, בדיקת מע״מ ותיעוד לכל רכב בנפרד.';
const SOURCES = [
  { id: 'regulations', title: 'תקנות מס הכנסה (ניכוי הוצאות רכב), התשנ״ה–1995', url: 'https://www.btl.gov.il/Laws1/02_0103_100052.pdf', note: 'תקנות 1–2: הגדרות וניכוי הוצאות; תקנה 6: קריאות מונה. נוסח חקיקה במאגר הביטוח הלאומי.' },
  { id: 'report', title: 'רשות המסים — טופס 1320 לשנת המס 2025', url: 'https://www.gov.il/BlobFolder/service/reporting-and-payment-2025-annual-tax-report-for-individuals/he/Service_Pages_Income_tax_annual-report-2026_1320-2025-ACC.pdf', note: 'סעיף הוצאות רכב וחלק ג: הוצאות, פחת, פרטי הרכב ותקופת השימוש. טופס לשנת 2025, לא טופס לשנת 2026.' },
  { id: 'vat-law', title: 'חוק מס ערך מוסף, התשל״ו–1975', url: 'https://www.btl.gov.il/Laws1/00_0022_000000.pdf', note: 'סעיפים 38 ו־41: מסמך כדין ושימוש בעסקה חייבת, בכפוף להגבלות ולהוראות הדין העדכניות.' },
];

export const metadata: Metadata = withPageSocialMetadata({
  title: { absolute: `${TITLE} | חשבונאי` },
  description: DESCRIPTION,
  alternates: { canonical: PAGE_PATH },
  openGraph: { images: ['/opengraph-image'], title: TITLE, description: DESCRIPTION, url: PAGE_URL, type: 'article', locale: 'he_IL', modifiedTime: UPDATED },
});

const sections = [
  {
    heading: 'מזהים את הרכב ואת מסלול הדיווח לפני החישוב',
    paragraphs: [
      'המדריך מיועד לעצמאי שבוחן הוצאות רכב בפועל לצורכי מס הכנסה. התחילו ברישיון: סוג הרכב, הסיווג, המשקל הכולל המותר והשימוש בפועל. הגדרת רכב בתקנות כוללת סיווגים מסוימים שמשקלם פחות מ־3,500 ק״ג, ומחריגה רכב עבודה ורכב תפעולי לפי ההגדרות שם. הכינוי המסחרי של הדגם אינו הכרעה לצורכי מס. בקשו מהמייצג לזהות את ההוראה המתאימה לרכב שלכם.',
      'בתיק העבודה כדאי לציין גם מי מחזיק ברכב, מתי החל לשמש את העסק והאם הוא משמש עובד. אם הדיווח שלכם נעשה במסלול אחר, בדקו תחילה אם חישוב הוצאות בפועל מתאים לו. עבודה מהבית, ביקורים אצל לקוחות או הובלת ציוד הם עובדות לבדיקה; אל תהפכו אותם בעצמכם לסיווג משפטי.',
    ],
    source: 'regulations',
  },
  {
    heading: 'מה משמעות כלל ההכרה בהוצאות?',
    paragraphs: [
      'לבדיקת הוצאות לשנת המס 2026, תקנה 2(1) קובעת לרכב הנכלל בה ושאינו אופנוע או רכב בעל הסדר מיוחד המפורט בתקנה: משווים בין הוצאות ההחזקה בניכוי שווי השימוש לפי התקנות לבין 45% מהוצאות ההחזקה, ובוחרים בגבוה. זהו כלל לחישוב הוצאה בניכוי, ולא החזר של אותו שיעור מהתשלום. אין להחילו אוטומטית על אופנוע, מונית, רכב הוראת נהיגה או רכב שמוחרג מהגדרת רכב.',
      'הוצאה שהותרה מפחיתה הכנסה חייבת; החיסכון האישי תלוי בחישוב המס של העסק ובנתוניו. בקשו לקבל דף התאמה שמראה את הסכום שנאסף, את הבסיס שנכלל בחישוב ואת התוצאה לדוח. כך אפשר להסביר מדוע סכום החשבוניות שונה מההוצאה שנדרשה, בלי להתייחס להפרש כאל כסף שהרשות אמורה להעביר לחשבון.',
    ],
    source: 'regulations',
  },
  {
    heading: 'אוספים הוצאות בלי לספור רכישה או פחת פעמיים',
    paragraphs: [
      'פתחו תיקייה לכל רכב ורכזו בה מסמכי רכישה או שכירות, חשבוניות שימוש, ביטוח ורישוי. טופס 1320 לשנת 2025 מבחין בין מלוא הוצאות הרכב, לרבות פחת, לבין החלק המותר בניכוי. אין להסיק מכך שמחיר הרכישה כולו הוא הוצאה שוטפת. את הפחת, ככל שקיימת זכאות לו, יש לחשב בנפרד לפי הנכס והדין המתאים.',
      'בתוך התיקייה אפשר לנהל ריכוז לפי ספק וסוג תשלום. סמנו חשבונית זיכוי ליד החשבונית המקורית, ובדקו אם תשלום שכבר נכלל בחבילת שכירות נרשם שוב מחשבונית נפרדת. ברכב שהוחלף במהלך השנה, שמרו את מסמכי שני הרכבים בנפרד. אלה המלצות לבקרה שמסייעות להכנת החישוב; הן אינן רשימה ממצה של מסמכים המחויבים בדין.',
    ],
    source: 'report',
  },
  {
    heading: 'בודקים מע״מ בנפרד מההוצאה למס הכנסה',
    paragraphs: [
      'אל תעתיקו את תוצאת מס ההכנסה לדוח המע״מ. חוק מע״מ קושר ניכוי תשומות למסמך כדין ולשימוש בעסקה חייבת, ולרכב עשויות לחול הגבלות נוספות. בקשו בדיקה נפרדת לרכישה, לשכירות ולהוצאות השימוש, לפי סוג הרכב ומעמד העסק. המדריך אינו קובע שיעור ניכוי מע״מ לחשבונית מסוימת, גם אם היא נושאת את שם העסק.',
      'ריכוז העבודה יכול להציג בנפרד את הסכום לפני מע״מ, המס שנרשם בחשבונית והסכום ששולם. השאירו למי שמכין את הדיווח לקבוע מה מותר לנכות ומה משמעות ההחלטה לרישום ההוצאה או הנכס. אין להזין חיסכון משוער בתזרים לפני שהבדיקה הושלמה. בפרט, חשבון משפחתי או חבילת שירותים מצריכים בירור מה בדיוק סופק ולמי.',
    ],
    source: 'vat-law',
  },
  {
    heading: 'משלימים נתוני שימוש ומטפלים בחוסרים',
    paragraphs: [
      'לקראת הדוח אספו את תקופת ההחזקה ואת קריאות המונה שנדרשות בתקנה 6. אפשר לצרף לתיק העבודה צילום מתוארך, מסמך מסירה או חשבונית מוסך שמסייעים לבדוק את הרצף. אם נתון חסר, הציגו את החוסר למייצג עם המסמכים הזמינים; אין להחליף אותו במספר שנראה סביר או באומדן נסיעות מאפליקציית ניווט.',
      'לבדיקה יעילה, כתבו אילו שאלות נשארו פתוחות: סיווג הרכב, תשלום לא מזוהה, שימוש של אדם נוסף או החלפה באמצע השנה. בקשו תשובה שמפנה למסמך ולכלל הרלוונטי. שמירת ההסבר לצד הריכוז מקלה על המשך העבודה בשנה הבאה, ובמיוחד אם מתחלף מנהל החשבונות או משתנה אופי הפעילות.',
    ],
    source: 'regulations',
  },
];

const faqItems = [
  { question: 'האם יומן נסיעות קובע את אחוז ההוצאה המוכרת?', answer: 'יומן מסייע לברר את השימוש, אך אינו מחליף את נוסחת התקנות או את סיווג הרכב. את ההוצאה מחשבים לפי ההוראה החלה; אין לבחור אחוז עסקי מתוך היומן ולהניח שהוא גובר על הכלל המיוחד לרכב.' },
  { question: 'האם אפשר להשתמש בטופס המצורף לדוח של שנה אחרת?', answer: 'הקישור כאן הוא לטופס לשנת המס 2025 וממחיש את מבנה המידע שנבדק. בהכנת הדוח יש להשתמש בטופס ובהוראות לשנת הדיווח בפועל ולבדוק אם השתנו השדות או הכללים.' },
  { question: 'מה להכין לפני פגישה עם המייצג?', answer: 'מומלץ להכין רישיון, הסכמי רכישה או שכירות, ריכוז חשבוניות וזיכויים, תקופת החזקה וקריאות מונה. צרפו רשימת חוסרים ושאלות על השימוש. זו הכנה מעשית לפגישה, ולא קביעה שכל מסמך ברשימה הוא חובה בכל מקרה.' },
];

export default function SelfEmployedCarExpensesPage() {
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'Article', '@id': `${PAGE_URL}#article`, headline: TITLE, description: DESCRIPTION, mainEntityOfPage: PAGE_URL, inLanguage: 'he-IL', datePublished: UPDATED, dateModified: UPDATED, author: { '@type': 'Person', name: 'אנדרי פלטונוב', url: 'https://cheshbonai.co.il/about' }, publisher: { '@type': 'Organization', name: 'חשבונאי', url: 'https://cheshbonai.co.il' }, citation: SOURCES.map((source) => source.url) },
      { '@type': 'FAQPage', '@id': `${PAGE_URL}#faq`, mainEntity: faqItems.map((item) => ({ '@type': 'Question', name: item.question, acceptedAnswer: { '@type': 'Answer', text: item.answer } })) },
    ],
  };

  return (
    <article className="bg-cream" dir="rtl">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Breadcrumbs items={[{ label: 'דף הבית', href: '/' }, { label: 'רכב ותחבורה', href: '/vehicles' }, { label: 'הוצאות רכב לעצמאי' }]} />
        <header className="my-8 border-b border-ink/15 pb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-ink mb-3">{TITLE}</h1>
          <p className="text-lg text-ink/70">{DESCRIPTION}</p>
          <p className="mt-4 text-sm text-ink/70">מאת אנדרי פלטונוב · בדיקת מקורות ועדכון: <time dateTime={UPDATED}>{UPDATED}</time></p>
        </header>
        <section className="answer-box bg-cream-2 border-r-4 border-gold p-5 mb-8" aria-label="תשובה מהירה">
          <h2 className="text-xl mb-2">איך בודקים הוצאות רכב לעצמאי?</h2>
          <p>מזהים תחילה את סיווג הרכב ואת השימוש בו, מרכזים הוצאות ונתוני החזקה, ומחשבים את החלק המותר לפי התקנות המתאימות. לאחר מכן בודקים מע״מ בנפרד. אין אחוז אחד שמתאים לכל כלי רכב, ואין להסיק מהוצאה מוכרת מה יהיה החיסכון האישי במס. המדריך מתמקד בהכנת הוצאות רכב בפועל לדוח של עצמאי; הוא אינו תחליף לבדיקת מסלול הדיווח, רכב מיוחד או רכב שהועמד לעובד. <a href="#regulations" className="underline">הבסיס: תקנות הוצאות רכב</a>.</p>
        </section>
        <div className="prose prose-lg max-w-none text-ink leading-relaxed">
          {sections.map((section) => <section key={section.heading}><h2>{section.heading}</h2>{section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}<p className="text-sm"><a href={`#${section.source}`}>למקור הרשמי של הסעיף</a></p></section>)}
          <h2>להמשך הבדיקה</h2>
          <p>למסגרת הכללית קראו על <Link href="/self-employed/allowed-expenses">הוצאות מוכרות לעצמאי</Link>. את אופן התיעוד מפרט <Link href="/vehicles/mileage-log">מדריך יומן הנסיעות</Link>, ולבדיקת חוזה חכירה היעזרו ב<Link href="/vehicles/business-lease-tax">מדריך מיסוי ליסינג לעסק</Link>.</p>
          <section id="faq"><h2>שאלות נפוצות</h2>{faqItems.map((item) => <details key={item.question} className="border border-ink/15 p-4 mb-3"><summary className="cursor-pointer font-bold">{item.question}</summary><p>{item.answer}</p></details>)}</section>
          <section aria-label="מקורות"><h2>מקורות ראשוניים והיקף הבדיקה</h2><p>התוכן נערך לפי המקורות המקושרים. הפניות לטופס מציינות את שנתו; לפני דיווח יש לבדוק את הדין ואת הטופס התקפים למקרה ולשנה.</p><ul>{SOURCES.map((source) => <li id={source.id} key={source.id}><a href={source.url} target="_blank" rel="noopener noreferrer">{source.title}</a> — {source.note}</li>)}</ul></section>
        </div>
        <div className="my-8"><DisclaimerBox text="המידע כללי ואינו ייעוץ מס או משפטי. סיווג הרכב, מסלול העסק, השימוש ושנת המס עשויים לשנות את ההכרה בהוצאות ואת דיני המע״מ. נדרשת בדיקה פרטנית לפני דיווח." /></div>
        <AuthorBox bio="רואה חשבון מוסמך וסמנכ״ל כספים. עוסק בניהול פיננסי ובהבראת חברות; פרטי המחבר מופיעים בעמוד אודות האתר." />
      </div>
      <BreadcrumbSchema items={[{ name: 'דף הבית', url: '/' }, { name: 'רכב ותחבורה', url: '/vehicles' }, { name: 'הוצאות רכב לעצמאי', url: PAGE_PATH }]} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }} />
    </article>
  );
}
