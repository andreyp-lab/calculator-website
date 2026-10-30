import { withPageSocialMetadata } from '@/lib/config/site-info';
import type { Metadata } from 'next';
import Link from 'next/link';
import { AuthorBox } from '@/components/calculator/AuthorBox';
import { Breadcrumbs } from '@/components/calculator/Breadcrumbs';
import { DisclaimerBox } from '@/components/calculator/DisclaimerBox';
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';

const PAGE_PATH = '/vehicles/business-lease-tax';
const PAGE_URL = `https://cheshbonai.co.il${PAGE_PATH}`;
const UPDATED = '2026-10-24';
const TITLE = 'מיסוי ליסינג לעסק: בדיקת חוזה, חשבונית ומע״מ';
const DESCRIPTION = 'לפני שמניחים שליסינג הוא הוצאה מוכרת: מה לברר לגבי החוכר, סוג הרכב, רכיבי החיוב ומס התשומות, ואילו מסמכים להעביר למייצג.';
const SOURCES = [
  { id: 'leasing-vat', title: 'רשות המסים — מדריך ניכוי מס תשומות לרכב, פרק עסקאות ליסינג', url: 'https://www.gov.il/he/pages/instructions-for-deduction-of-input-tax-for-vehicles-and-motorcycles?chapterIndex=6', note: 'הכלל בדבר מס התשומות בחשבונית לחוכר והפניה לחריגים שבתקנה 14(ב)(2). המדריך מציג עדכון מ־11.01.2026.' },
  { id: 'maintenance', title: 'רשות המסים — הוראות פרשנות 1/2002: השכרת רכב פרטי בליסינג תפעולי', url: 'https://www.gov.il/BlobFolder/policy/vat_11/he/vat_vatInterpretation_parshanut1_2002.pdf', note: 'מסמך העוסק בפיצול חשבוניות למרכיבי השכרה ותחזוקה. אין כאן קביעה של שיעור ניכוי או תקרת פיצול לחוזה מסוים.' },
  { id: 'expenses', title: 'תקנות מס הכנסה (ניכוי הוצאות רכב), התשנ״ה–1995', url: 'https://www.btl.gov.il/Laws1/02_0103_100052.pdf', note: 'הגדרת הוצאות החזקת רכב כוללת דמי שכירות; ההכרה כפופה לסוג הרכב ולהוראה החלה.' },
];

export const metadata: Metadata = withPageSocialMetadata({
  title: { absolute: `${TITLE} | חשבונאי` },
  description: DESCRIPTION,
  alternates: { canonical: PAGE_PATH },
  openGraph: { images: ['/opengraph-image'], title: TITLE, description: DESCRIPTION, url: PAGE_URL, type: 'article', locale: 'he_IL', modifiedTime: UPDATED },
});

const sections = [
  {
    heading: 'מגדירים מי חוכר ומה הרכב עושה בעסק',
    paragraphs: [
      'לפני שבודקים מס, הכינו תיאור קצר של העסקה: מי חתום על החוזה, מי מקבל את החשבונית, איזה רכב נמסר ומי משתמש בו. עצמאי שנוסע ללקוחות וחברה שמעמידה רכב לעובד מציגים נסיבות שונות. צרפו רישיון, תיאור שימוש והסכם מלא; הכיתוב ״ליסינג עסקי״ בהצעה אינו מספיק כדי לקבוע את תוצאת המס.',
      'רשמו גם אם הרכב חוזר לחברה בסוף ההסכם, אם קיימת אפשרות רכישה ומה נדרש כדי לממש אותה. בקשו מהמייצג לקבוע את הטיפול לפי התנאים והמהות, ולא לפי כותרת המכירה בלבד. כדאי להציג את המסמכים לפני חתימה, כשעוד אפשר לבקש הבהרות ולתקן אי־התאמה בין ההצעה לבין החוזה.',
    ],
    source: 'expenses',
  },
  {
    heading: 'מה אומת לגבי מע״מ בחשבונית הליסינג?',
    paragraphs: [
      'מדריך רשות המסים קובע ככלל שמס התשומות בחשבונית לחוכר בעסקת ליסינג מימוני או תפעולי אסור בניכוי, למעט המקרים החריגים המנויים בתקנה 14(ב)(2). יש לבחון את תחולת הכלל לפי הגדרת הרכב, פעילות העסק והשימוש. אין להסיק שעצם היות החוכר עוסק מורשה או העובדה שהנסיעה עסקית מתירות את ניכוי המס.',
      'כשבהצעה מופיע מחיר ״אחרי מע״מ״, בקשו להבין מה בדיוק חושב: מחיר ללא מס, תשלום כולל מס או עלות לאחר ניכוי שהמוכר מניח שתוכלו לבצע. אלה נתונים שונים. לצורך החלטה תקציבית שמרו לצד ההצעה את המחיר לתשלום בפועל, והכניסו התאמת מס רק לאחר בדיקה שמתייחסת לרכב ולחוזה שלכם.',
    ],
    source: 'leasing-vat',
  },
  {
    heading: 'מפרידים תחזוקה מהשכרה בלי להמציא זכאות',
    paragraphs: [
      'הוראות פרשנות 1/2002 עוסקות בפיצול חשבוניות ליסינג תפעולי בין השכרה לתחזוקה. לכן כדאי לבקש את נספח השירותים ואת פירוט החיוב, ולא להסתפק בשורה כוללת. הצגת רכיב תחזוקה בנפרד אינה כשלעצמה אישור לניכוי; יש לבדוק את תנאי ההסכם ואת ההוראות החלות על השירות והשימוש ברכב.',
      'לבדיקה הכינו שאלות קונקרטיות: אילו טיפולים כלולים, מה מחויב בנפרד, מה קורה ברכב חלופי ואיך מוצגים זיכויים. אם הספק מציע חלופות שירות, שמרו את שתיהן עם המחירים. המדריך אינו מציג אחוז קבוע לתחזוקה, שיעור ניכוי מע״מ או פיצול מלאכותי של תשלום כולל. את ההכרעה יש לתעד לאחר עיון במסמכים ובהוראה המלאה.',
    ],
    source: 'maintenance',
  },
  {
    heading: 'מס הכנסה: בודקים את ההוצאה בנפרד מתזרים התשלומים',
    paragraphs: [
      'הגדרת הוצאות החזקת רכב בתקנות מס הכנסה כוללת דמי שכירות, אך אין בכך היתר גורף לכל תשלום בחוזה. הטיפול תלוי בסוג הרכב, במהות התשלום ובהוראה החלה. בקשו מהמייצג להבחין בין התשלומים ולהסביר את הטיפול במקדמה, בשכירות, במימון ובאפשרות רכישה, ככל שקיימים בחוזה. אין כאן קביעה שמקדמה או תשלום סיום מותרים מיד בניכוי.',
      'בריכוז העבודה הציגו לכל רכיב את מועד התשלום, התקופה שאליה הוא מתייחס והמסמך התומך. ציינו שאלות פתוחות במקום לסווג לבד סכום כ״הוצאה מוכרת״. הפרידו בין עלות הרכב לעסק לבין החיסכון במס לאחר החישוב; תשלום שיוצא מהבנק אינו בהכרח הוצאה באותו סכום ובאותה תקופה לצורכי הדוח.',
    ],
    source: 'expenses',
  },
  {
    heading: 'כך בונים תיק חוזה שאפשר לבדוק',
    paragraphs: [
      'מומלץ לרכז יחד את ההצעה, ההסכם החתום, נספח השירותים, רישיון הרכב, מסמך המסירה וחשבונית לדוגמה. לאחר תחילת ההתקשרות צרפו חשבוניות, זיכויים ואסמכתאות תשלום. זו המלצת ארגון לבדיקה מקצועית, ולא רשימת מסמכים משפטית סגורה. אם ההצעה מבטיחה הטבת מס, בקשו הסבר כתוב להפניה שעליה היא נשענת.',
      'בעת החזרת הרכב או רכישתו, הוסיפו את מסמך הסיום ואת ההתחשבנות לתיק המקורי. כך ניתן לעקוב אחר מקדמה, יתרה וזיכוי בלי לייחס אותם בטעות לחוזה החדש. כשמשתנה המשתמש ברכב או אופי הפעילות, עדכנו את המייצג עם תיאור השינוי והמועד; אל תמשיכו להשתמש בהנחת מס שנבדקה בנסיבות אחרות.',
    ],
  },
];

const faqItems = [
  { question: 'האם ״ליסינג עסקי״ מבטיח ניכוי מע״מ?', answer: 'לא. במדריך רשות המסים מופיע כלל האוסר ניכוי בחשבונית לחוכר, לצד חריגים. תחולת הכלל והחריגים דורשת בדיקה לפי סוג הרכב ופעילות העסק. שם המסלול בהצעה אינו מחליף את הבדיקה.' },
  { question: 'האם כדאי לבקש חשבונית עם פירוט תחזוקה?', answer: 'כן, כחלק מהכנת המידע לבדיקה. בקשו גם נספח שמסביר את השירותים ותנאי ההתקשרות. פירוט עוזר לזהות את התשלום, אך אינו קובע לבדו אם המס על רכיב מסוים מותר בניכוי.' },
  { question: 'מה לגבי רכב שהעסק מעמיד לעובד?', answer: 'יש להעביר לבדיקת השכר את פרטי הרכב ואת תנאי העמדתו לעובד. ניכוי הוצאות אצל העסק ובדיקת שווי שימוש אצל העובד הן שאלות שונות. המדריך כאן אינו קובע סכום זקיפה או פטור לעובד מסוים.' },
];

export default function BusinessLeaseTaxPage() {
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
        <Breadcrumbs items={[{ label: 'דף הבית', href: '/' }, { label: 'רכב ותחבורה', href: '/vehicles' }, { label: 'מיסוי ליסינג לעסק' }]} />
        <header className="my-8 border-b border-ink/15 pb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-ink mb-3">{TITLE}</h1>
          <p className="text-lg text-ink/70">{DESCRIPTION}</p>
          <p className="mt-4 text-sm text-ink/70">מאת אנדרי פלטונוב · בדיקת מקורות ועדכון: <time dateTime={UPDATED}>{UPDATED}</time></p>
        </header>
        <section className="answer-box bg-cream-2 border-r-4 border-gold p-5 mb-8" aria-label="תשובה מהירה">
          <h2 className="text-xl mb-2">האם ליסינג לעסק הוא הוצאה מוכרת?</h2>
          <p>אין תשובה אחת לכל חוזה ולכל רכב. יש לבדוק את ההוצאה למס הכנסה ואת מס התשומות בנפרד, לפי החוכר, סיווג הרכב, השימוש ורכיבי העסקה. לפני חתימה בקשו חוזה מלא, פירוט שירותים וחשבונית לדוגמה והעבירו אותם למייצג. המדריך עוסק בהכנת בדיקת המס של העסקה; להשוואת עלויות הרכישה והשכירות יש מדריך נפרד. בפרט, אל תחשבו חיסכון במע״מ רק משום שההצעה נושאת כותרת עסקית. <a href="#leasing-vat" className="underline">מקור: מדריך רשות המסים לליסינג</a>.</p>
        </section>
        <div className="prose prose-lg max-w-none text-ink leading-relaxed">
          {sections.map((section) => <section key={section.heading}><h2>{section.heading}</h2>{section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}{section.source && <p className="text-sm"><a href={`#${section.source}`}>למקור הרשמי של הסעיף</a></p>}</section>)}
          <h2>ממשיכים לפי השאלה שלכם</h2>
          <p>להשוואה כספית קראו על <Link href="/vehicles/leasing-vs-buying">ליסינג מול קנייה</Link>. לחישוב הוצאות בפועל עברו ל<Link href="/vehicles/self-employed-car-expenses">הוצאות רכב לעצמאי</Link>, ולרכב מעסיק ראו <Link href="/vehicles/company-car-benefit">בדיקת שווי שימוש לפי דגם</Link>.</p>
          <section id="faq"><h2>שאלות נפוצות</h2>{faqItems.map((item) => <details key={item.question} className="border border-ink/15 p-4 mb-3"><summary className="cursor-pointer font-bold">{item.question}</summary><p>{item.answer}</p></details>)}</section>
          <section aria-label="מקורות"><h2>מקורות ראשוניים והיקף הבדיקה</h2><p>המקורות להלן תומכים בהבחנות ובתהליך הבדיקה. לא הונח שיעור ניכוי לתחזוקה, לפחת או למס תשומות ללא קביעה פרטנית לפי הדין והחוזה.</p><ul>{SOURCES.map((source) => <li id={source.id} key={source.id}><a href={source.url} target="_blank" rel="noopener noreferrer">{source.title}</a> — {source.note}</li>)}</ul></section>
        </div>
        <div className="my-8"><DisclaimerBox text="מידע כללי בלבד, שאינו ייעוץ מס או משפטי. יש לבדוק את החוזה, סוג הרכב, פעילות העסק והשימוש בפועל לפני רישום הוצאה או ניכוי מע״מ. אין כאן התחייבות להטבת מס או לשווי שימוש מסוים." /></div>
        <AuthorBox bio="רואה חשבון מוסמך וסמנכ״ל כספים. עוסק בניהול פיננסי ובהבראת חברות; פרטי המחבר מופיעים בעמוד אודות האתר." />
      </div>
      <BreadcrumbSchema items={[{ name: 'דף הבית', url: '/' }, { name: 'רכב ותחבורה', url: '/vehicles' }, { name: 'מיסוי ליסינג לעסק', url: PAGE_PATH }]} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }} />
    </article>
  );
}
