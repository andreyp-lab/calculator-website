import { withPageSocialMetadata } from '@/lib/config/site-info';
import type { Metadata } from 'next';
import Link from 'next/link';
import { AuthorBox } from '@/components/calculator/AuthorBox';
import { Breadcrumbs } from '@/components/calculator/Breadcrumbs';
import { DisclaimerBox } from '@/components/calculator/DisclaimerBox';
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';

const PAGE_PATH = '/vehicles/mileage-log';
const PAGE_URL = `https://cheshbonai.co.il${PAGE_PATH}`;
const UPDATED = '2026-10-24';
const TITLE = 'יומן נסיעות לעסק: קריאות מונה ותיעוד שימוש ברכב';
const DESCRIPTION = 'מה נדרש בדיווח קריאות מונה ומה מומלץ לרשום ביומן נסיעות: שדות עבודה, אסמכתאות, החלפת רכב וטיפול בנתונים חסרים לקראת הדוח.';
const SOURCES = [
  { id: 'reporting-rule', title: 'תקנות מס הכנסה (ניכוי הוצאות רכב), התשנ״ה–1995', url: 'https://www.btl.gov.il/Laws1/02_0103_100052.pdf', note: 'תקנה 6: דיווח קריאות מונה לכל רכב; תקנות 1–2: סיווג וחישוב הוצאות. נוסח חקיקה במאגר הביטוח הלאומי.' },
  { id: 'annual-form', title: 'רשות המסים — טופס 1320 לשנת המס 2025', url: 'https://www.gov.il/BlobFolder/service/reporting-and-payment-2025-annual-tax-report-for-individuals/he/Service_Pages_Income_tax_annual-report-2026_1320-2025-ACC.pdf', note: 'חלק ג: פרטי הרכב, חודשי השימוש וקריאת מונה בתחילת השנה או השימוש ובסופם. זהו טופס 2025; יש לבדוק את טופס שנת הדיווח בפועל.' },
];

export const metadata: Metadata = withPageSocialMetadata({
  title: { absolute: `${TITLE} | חשבונאי` },
  description: DESCRIPTION,
  alternates: { canonical: PAGE_PATH },
  openGraph: { images: ['/opengraph-image'], title: TITLE, description: DESCRIPTION, url: PAGE_URL, type: 'article', locale: 'he_IL', modifiedTime: UPDATED },
});

const sections = [
  {
    heading: 'מבדילים בין קריאת מונה לדיווח לבין יומן עבודה',
    paragraphs: [
      'תקנה 6 מתנה ניכוי הוצאות רכב ברישום קריאת המונה בדוח, לכל רכב בנפרד, בתחילת שנת המס ובסופה. כשהרכב הגיע לרשות הנישום או יצא מרשותו במהלך השנה, התקנה מתייחסת לקריאה ביום הקבלה או היציאה, לפי העניין. אלה נתוני דיווח; ההוראה אינה רשימת שדות של יומן יומי לכל נסיעה.',
      'יומן שוטף יכול לעזור להסביר נסיעות ולזהות פערים, אך המדריך אינו קובע שכל עסק חייב לנהל דווקא את התבנית שלהלן. בדקו עם המייצג אם חלות על פעילותכם דרישות נוספות. הבחינו בין נתון שמופיע בטופס רשמי, מסמך שתומך בו והרגל עבודה פנימי שבחרתם כדי לשפר את הבקרה.',
    ],
    source: 'reporting-rule',
  },
  {
    heading: 'פותחים כרטיס לכל רכב',
    paragraphs: [
      'מומלץ לפתוח כרטיס עם מספר הרישוי, תיאור הרכב, פרטי המחזיק ותאריך תחילת השימוש. שמרו לידו רישיון ומסמך רכישה, שכירות או מסירה. הפרידו את התיקיות לפי רכב כדי למנוע שיוך שגוי של מסמכים.',
      'בטופס 1320 לשנת 2025 יש מקום לפרטי הרכב, חודשי שימוש וקריאות מונה. הוא משמש כאן להמחשת הנתונים שנבדקו, ואינו מוצג כטופס לשנה אחרת. בעת הכנת הדוח השוו את כרטיס העבודה לשדות בטופס התקף, והעבירו למייצג שאלה אם אחד מהם אינו מתאים לנסיבות שלכם.',
    ],
    source: 'annual-form',
  },
  {
    heading: 'מה מומלץ לרשום בכל שורת יומן?',
    paragraphs: [
      'לתיעוד פנימי מועיל אפשר לרשום תאריך, שם הנהג, מוצא, יעד, מטרת הנסיעה וקריאת מונה בתחילה ובסיום. הוסיפו הפניה לפגישה או להזמנת עבודה כאשר היא מסבירה את הקשר לעסק. אין צורך להמציא מידע שלא תועד בזמן אמת; אם המטרה אינה ידועה, סמנו זאת לבירור במקום לבחור אוטומטית בקטגוריה עסקית.',
      'בנסיעה שמשלבת כמה מטרות, תארו את המסלול ואת העצירות הרלוונטיות בלי לקבוע לבד את תוצאת המס. אפשר להוסיף עמודת הערה לרכב חלופי, שינוי מסלול או משתמש נוסף. אלה שדות מוצעים לארגון מידע, לא תבנית מאושרת של רשות המסים ולא קביעה שהמרחק הרשום יקנה הוצאה מוכרת.',
    ],
  },
  {
    heading: 'בודקים רצף בעזרת מסמכים זמינים',
    paragraphs: [
      'כדאי לשמור צילום מונה עם תאריך ולצדו מסמכי מוסך, מסירה והחזרה שיש בהם קריאה נוספת. בבקרה תקופתית בדקו שהקריאות מתקדמות בסדר הגיוני ושהמספר שייך לרכב הנכון. תדלוק, חניה או חיוב כביש יכולים לעזור לברר אירוע, אך אינם מוכיחים לבדם מי נסע, לאיזו מטרה או מה הייתה קריאת המונה באותו יום.',
      'אם מתגלה פער, חזרו למסמך המקורי ותעדו מה תוקן ולמה. עדיף לשמור גם את הגרסה הקודמת מאשר למחוק שורה בלי הסבר. אל תשלימו מרחק חסר לפי יעד ההוצאה הרצוי. נתוני ניווט יכולים להיות כלי עזר לבירור המסלול; הם אינם תחליף אוטומטי לקריאה שנדרשת בדיווח.',
    ],
  },
  {
    heading: 'החלפה, מכירה או נתון חסר באמצע השנה',
    paragraphs: [
      'בהחלפת רכב סגרו את כרטיס הרכב היוצא ופתחו כרטיס חדש לרכב הנכנס. מומלץ לרכז את תאריכי המסירה וההחזרה ואת המסמכים מכל צד. שמרו רישומים נפרדים גם כשאותו הסכם ממשיך או כשקיבלתם רכב חלופי. ההפרדה מסייעת למייצג לבדוק אילו נתונים והוצאות שייכים לכל רכב ולכל תקופה.',
      'אם קריאה לא נשמרה במועד, אספו מסמכים סמוכים והסבירו במפורש מה חסר. בקשו מהמייצג הנחיה כיצד לטפל בחוסר בדוח, בלי להציג שחזור כאילו נמדד בזמן אמת. אותו עיקרון מועיל במקרה של החלפת מד־מרחק או תקלה: שומרים את תיעוד האירוע ואת הקריאות הקיימות, ומבררים את אופן הדיווח המתאים.',
    ],
  },
  {
    heading: 'מוסרים למייצג חבילת מידע שאפשר לשחזר',
    paragraphs: [
      'לקראת הדוח רכזו כרטיס רכב, קריאות לתקופה, ריכוז הוצאות וקישורים למסמכים. הפרידו בין מידע מאומת, בירור פתוח והערה ניהולית. אפשר לצרף דף הסבר קצר על שינוי בפעילות או שימוש של כמה נהגים. המלצת העבודה היא לשמור רצף ברור בין מקור הנתון לבין הריכוז שנמסר, בלי להסתמך על זיכרון משיחה.',
      'שמרו את ההנחיות ואת הגרסה שנמסרה להכנת הדוח. היומן מסייע לתיאור העובדות; סיווג הרכב וחישוב ההוצאה נעשים לפי הכללים החלים. הוא אינו קובע זכאות לניכוי מע״מ או פוטר מבדיקת שווי שימוש לרכב עובד.',
    ],
  },
];

const faqItems = [
  { question: 'האם חייבים לרשום כל נסיעה בתבנית שמופיעה כאן?', answer: 'המדריך מציע שדות לתיעוד פנימי ואינו מציג אותם כחובה כללית. הדרישה שאומתה בתקנה 6 היא דיווח קריאות מונה לכל רכב במועדים שנקבעו בה. דרישות נוספות יש לבדוק לפי הפעילות והדין החל עליה.' },
  { question: 'האם צילום מונה מחליף חשבוניות הוצאה?', answer: 'צילום מתעד קריאה; חשבונית מתעדת רכישה או שירות. הם עונים על שאלות שונות. מומלץ לשמור אותם יחד כדי שאפשר יהיה לבדוק את נתוני השימוש ואת ריכוז ההוצאות, בלי לראות באחד תחליף אוטומטי לאחר.' },
  { question: 'האם יותר נסיעות עסקיות מבטיחות ניכוי גבוה יותר?', answer: 'אין להסיק זאת מהיומן לבדו. ההוצאה תלויה בסיווג ובנוסחת התקנות החלה על הרכב, והמע״מ נבדק בנפרד. תיעוד מפורט מסייע לבירור העובדות, אך אינו יוצר שיעור הכרה חדש.' },
];

export default function MileageLogPage() {
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
        <Breadcrumbs items={[{ label: 'דף הבית', href: '/' }, { label: 'רכב ותחבורה', href: '/vehicles' }, { label: 'יומן נסיעות לעסק' }]} />
        <header className="my-8 border-b border-ink/15 pb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-ink mb-3">{TITLE}</h1>
          <p className="text-lg text-ink/70">{DESCRIPTION}</p>
          <p className="mt-4 text-sm text-ink/70">מאת אנדרי פלטונוב · בדיקת מקורות ועדכון: <time dateTime={UPDATED}>{UPDATED}</time></p>
        </header>
        <section className="answer-box bg-cream-2 border-r-4 border-gold p-5 mb-8" aria-label="תשובה מהירה">
          <h2 className="text-xl mb-2">מה צריך לתעד לגבי נסיעות ברכב העסק?</h2>
          <p>לצורך דרישת הוצאות רכב יש להבחין בין קריאות המונה הנדרשות בדוח לבין יומן נסיעות שמסייע לבקרה. <a href="#reporting-rule" className="underline">תקנה 6</a> מפרטת את מועדי הקריאה ואת הדיווח לכל רכב בנפרד. שדות כמו יעד, מטרת נסיעה והפניה לפגישה הם כאן המלצות עבודה, ואינם מוצגים כחובת יומן יומית לכל עצמאי. היומן אינו מחליף חשבוניות, אינו קובע לבדו את ההוצאה המוכרת ואינו יוצר זכאות לקיזוז מע״מ. בדקו דרישות נוספות לפי סוג הרכב והפעילות.</p>
        </section>
        <div className="prose prose-lg max-w-none text-ink leading-relaxed">
          {sections.map((section) => <section key={section.heading}><h2>{section.heading}</h2>{section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}{section.source && <p className="text-sm"><a href={`#${section.source}`}>למקור הרשמי של הסעיף</a></p>}</section>)}
          <h2>מתיעוד לחישוב</h2>
          <p>להבנת החישוב ראו <Link href="/vehicles/self-employed-car-expenses">הוצאות רכב לעצמאי</Link>. לתכנון הוצאות אנרגיה השתמשו ב<Link href="/vehicles/fuel-cost">מחשבון עלות נסיעה</Link>, ולמסגרת הרחבה קראו על <Link href="/self-employed/allowed-expenses">הוצאות מוכרות ותיעודן</Link>.</p>
          <section id="faq"><h2>שאלות נפוצות</h2>{faqItems.map((item) => <details key={item.question} className="border border-ink/15 p-4 mb-3"><summary className="cursor-pointer font-bold">{item.question}</summary><p>{item.answer}</p></details>)}</section>
          <section aria-label="מקורות"><h2>מקורות ראשוניים והיקף הבדיקה</h2><p>קריאות המונה ושדות הטופס נבדקו במקורות שלהלן. יתר המלצות הארגון הן כלי עבודה מוצע, ללא טענה לאישור התבנית בידי רשות המסים.</p><ul>{SOURCES.map((source) => <li id={source.id} key={source.id}><a href={source.url} target="_blank" rel="noopener noreferrer">{source.title}</a> — {source.note}</li>)}</ul></section>
        </div>
        <div className="my-8"><DisclaimerBox text="מידע כללי בלבד, שאינו ייעוץ מס או משפטי. דרישות התיעוד והדיווח תלויות ברכב, בפעילות ובשנת המס. אין לראות ביומן או בתבנית המוצעת אישור לניכוי הוצאה, לקיזוז מע״מ או לפטור משווי שימוש." /></div>
        <AuthorBox bio="רואה חשבון מוסמך וסמנכ״ל כספים. עוסק בניהול פיננסי ובהבראת חברות; פרטי המחבר מופיעים בעמוד אודות האתר." />
      </div>
      <BreadcrumbSchema items={[{ name: 'דף הבית', url: '/' }, { name: 'רכב ותחבורה', url: '/vehicles' }, { name: 'יומן נסיעות לעסק', url: PAGE_PATH }]} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }} />
    </article>
  );
}
