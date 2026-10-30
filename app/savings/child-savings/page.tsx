import type { Metadata } from 'next';
import Link from 'next/link';
import { AuthorBox } from '@/components/calculator/AuthorBox';
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';

const title = 'חיסכון לכל ילד: הפקדות, בחירה והשלמה פרטית';
const description = 'מה מופקד בחיסכון לכל ילד ב־2026, מהיכן מגיעה ההכפלה, איך בודקים את הגוף המנהל ומה מבררים לפני משיכה או חיסכון נוסף.';
const pageUrl = 'https://cheshbonai.co.il/savings/child-savings';
const checkedAt = '2026-10-30';
const quickAnswer = 'בחיסכון לכל ילד הביטוח הלאומי מפקיד 58 ש״ח בחודש בשנת 2026 לילד הזכאי לקצבת ילדים, עד גיל 18. אפשר להוסיף 58 ש״ח מקצבת הילדים ולהגיע להפקדה חודשית של 116 ש״ח. התוספת באה מהקצבה המשולמת למשפחה. תחילה בדקו היכן מנוהל החיסכון והאם ההכפלה פעילה; תכנון חיסכון פרטי נוסף מצריך בירור נפרד של תנאי המוצר ושל מי שרשום כבעליו.';
const sources = [
  { url: 'https://www.btl.gov.il/benefits/children/HisahoLayeled/Pages/default.aspx', label: 'ביטוח לאומי — התוכנית, הזכאות וההפקדה ב־2026' },
  { url: 'https://www.btl.gov.il/benefits/children/HisahoLayeled/Pages/nolad.aspx', label: 'ביטוח לאומי — בחירה לאחר לידה ודיווח שנתי' },
  { url: 'https://www.btl.gov.il/benefits/children/HisahoLayeled/Pages/HisahonKupot.aspx', label: 'ביטוח לאומי — הכפלת ההפקדה וביטולה' },
  { url: 'https://www.btl.gov.il/benefits/children/HisahoLayeled/Pages/mavar.aspx', label: 'ביטוח לאומי — שינוי גוף מנהל ומסלול' },
  { url: 'https://www.btl.gov.il/benefits/children/HisahoLayeled/Pages/sum.aspx', label: 'ביטוח לאומי — סכום החיסכון ודמי ניהול' },
  { url: 'https://www.btl.gov.il/benefits/children/HisahoLayeled/Pages/MeshihaHisahon.aspx', label: 'ביטוח לאומי — משיכה, אישורים וניכוי מס' },
];
const sections = [
  {
    heading: 'מאתרים את החשבון לפני שמחליטים לשנות',
    source: 0,
    paragraphs: [
      'פתחו את שירות המידע האישי המקושר מדף התוכנית בביטוח הלאומי ורשמו לכל ילד את הגוף המנהל. לאחר מכן בקשו מהגוף עצמו יתרה עדכנית ופרטי מסלול. הכינו רישום נפרד לכל ילד: שם הגוף, סוג החיסכון, תאריך הבדיקה והמסמך שעליו הסתמכתם. אין צורך להתחיל מבחירת גוף חדש כאשר עדיין לא ברור היכן הכסף הקיים נמצא.',
      'דף הביטוח הלאומי מפנה שאלות על היתרה ומועדי המשיכה לבנק או לקופת הגמל המנהלים את החיסכון. אם המידע האישי והדוח שבידיכם אינם תואמים, שלחו לגוף המנהל שאלה ממוקדת וציינו לאיזה תאריך מתייחסת כל יתרה. שמרו את התשובה עם הדוח; אל תשלימו סכום חסר מתוך פרסום המציג חיסכון משוער לילד אחר.',
    ],
  },
  {
    heading: 'ההכפלה משנה גם את התקציב המשפחתי',
    source: 2,
    paragraphs: [
      'לפי דף ההכפלה, נכון ל־2026 אפשר להפנות לחיסכון עוד 58 ש״ח בחודש מקצבת הילדים, בנוסף להפקדת הביטוח הלאומי. הסכום הנוסף מופקד בחודש שלאחר הבחירה, ואפשר לבטל את התוספת בכל שלב בתוכנית. המשמעות התקציבית היא שחלק מהקצבה מופנה לחיסכון במקום לשימוש שוטף. אל תרשמו את התוספת כהכנסה נוספת מהמדינה.',
      'לפני שינוי, בדקו ברישום שלכם האם התוספת כבר פעילה, כדי שלא לבנות תקציב כאילו מדובר בהחלטה חדשה. לאחר שליחת הבחירה שמרו אישור ובדקו את ההפקדה המתאימה בדוח הגוף המנהל. אם אתם שוקלים גם הפרשה פרטית, רשמו אותה בשורה אחרת: כך תראו מה נגרע מהקצבה ומה אמור לצאת מחשבון המשפחה בנפרד.',
    ],
  },
  {
    heading: 'לאחר לידה: בחירת גוף ובחירת מסלול',
    source: 1,
    paragraphs: [
      'הביטוח הלאומי קובע חלון בחירה של שישה חודשים מיום הלידה לבחירת מקום ניהול החיסכון ומסלולו. דף הפתיחה מתאר גם את ברירת המחדל אם ההורים אינם בוחרים. בדקו את ההנחיות המתאימות לילד שנולד, במקום להניח שהבחירה שנעשתה בעבר עבור אח או אחות תחול בדיוק באותה דרך.',
      'הפרידו ברישום בין שם הגוף לבין שם המסלול. לקראת בחירה בקשו מסמך שמציג את תנאי המסלול, ושאלו מה אפשר לשנות בהמשך. דף הביטוח הלאומי מציין שהגוף המנהל שולח דיווח שנתי עד 1 במרץ; השתמשו בו לבדיקת הבחירה וההפקדות. שמרו גם את אישור הבחירה הראשוני, כדי שתוכלו לחזור למה שביקשתם בפועל.',
    ],
  },
  {
    heading: 'שינוי חיסכון בבנק אינו העברת כל היתרה',
    source: 3,
    paragraphs: [
      'לפי הביטוח הלאומי, בחיסכון המנוהל בקופת גמל אפשר לשנות מסלול דרך הקופה או להעביר את החיסכון לקופת גמל אחרת המשתתפת בתוכנית. במקרה של מעבר בין קופות, פונים לקופה שאליה רוצים לעבור. אלה פעולות שונות: שינוי מסלול אצל אותו גוף אינו זהה להחלפת הגוף שמנהל את החיסכון.',
      'כאשר החיסכון בבנק, אפשר להפסיק את ההפקדות אליו ולפתוח חיסכון נוסף בקופת גמל שאליו יועברו התשלומים החודשיים. הרישום לאחר השינוי צריך לעקוב אחר החיסכון בבנק ואחר החיסכון בקופה בנפרד; אין לתאר זאת כהעברת כל היתרה הישנה. הביטוח הלאומי מציין גם שאין אפשרות להעביר את החיסכון לבנק אחר. בדקו את פרטי הפעולה במקור לפני הגשת בקשה.',
    ],
  },
  {
    heading: 'דמי ניהול ומשיכה: בודקים לפי הגיל והפעולה',
    source: 4,
    paragraphs: [
      'בדף סכום החיסכון נכתב שהביטוח הלאומי משלם את דמי הניהול עד גיל 21, ולאחר מכן הם נגבים מחשבון החיסכון. לקראת גיל זה בקשו מהגוף המנהל את התנאים שיחולו על החשבון, במקום להסתמך על תנאים של חיסכון פרטי אחר. שמרו את התשובה לצד הדוח העדכני והפרידו בין יתרה שנצברה לבין עלויות עתידיות שנמסרו לכם.',
    ],
  },
  {
    heading: 'לפני בקשת משיכה, מבררים את האישור ואת המס',
    source: 5,
    paragraphs: [
      'דף המשיכה מתאר משיכה מגיל 18 בתום חודש יום ההולדת, למעט חריגים המפורטים בו. מגיל 18 ועד גיל 21 נדרש אישור הורה למשיכה; מגיל 21 אין צורך באישור ההורים. את הבקשה מגישים לגוף המנהל. לפני תכנון תשלום מכספי החיסכון, בקשו מהגוף הנחיות המתאימות לגיל ולמצב החשבון.',
      'הביטוח הלאומי מציין שבעת משיכה מנוכה מס רווחי הון. לכן בקשו פירוט של הסכום הצפוי להתקבל לאחר הניכוי, בלי לזהות את היתרה המוצגת עם הסכום שיועבר לחשבון. סוגיות מס אישיות וחריגי משיכה דורשים בדיקה פרטנית. המדריך אינו מחשב מס ואינו כולל את טבלת המענקים; לבירור מענק יש לעיין בתנאים לפי תאריך הלידה במקור הרשמי.',
    ],
  },
  {
    heading: 'איך מתכננים השלמה פרטית בלי לערבב בין החשבונות?',
    source: null,
    paragraphs: [
      'אם המשפחה מבקשת להוסיף חיסכון פרטי, הגדירו תחילה מטרה ומועד שימוש משוערים: לימודים, מעבר דירה או עזרה בתחילת הדרך. כתבו מה כבר קיים בתוכנית ומה עדיין בגדר יעד. הימנעו מהצגת יתרה עתידית כהבטחה לילד; הפרידו בין הפקדות שבוצעו, הפקדות שאתם מתכננים והערכה שטרם נבדקה.',
      'בכל הצעה פרטית בקשו לברר על שם מי נפתח החשבון, מי מוסמך לתת הוראות, מתי ניתן למשוך ומהן העלויות והשלכות המס. אל תחילו את תנאי התוכנית הממשלתית על ההצעה הפרטית. הכינו תיק משפחתי עם מסמכים, אישורי פעולות ושאלות פתוחות, ופנו לבעלי רישיון מתאימים לפני החלטה. רשימת השאלות היא כלי ארגון, ולא בחירת מוצר או קביעת זכויות בכסף.',
    ],
  },
];
const faqItems = [
  { question: 'האם המדינה מוסיפה גם את סכום ההכפלה?', answer: 'התוספת של 58 ש״ח לחודש ב־2026 מופנית מקצבת הילדים המשולמת למשפחה, לפי בחירת ההורים. היא נוספת להפקדת הביטוח הלאומי ומביאה את ההפקדה החודשית ל־116 ש״ח.' },
  { question: 'האם מעבר מחיסכון בבנק לקופה מעביר את כל הכסף?', answer: 'לפי דף שינוי הגוף החוסך, ההפקדות החודשיות מופנות לחיסכון נוסף בקופת גמל. יש לעקוב גם אחרי החיסכון שנותר בבנק.' },
  { question: 'למי מגישים בקשת משיכה?', answer: 'לבנק או לקופת הגמל המנהלים את החיסכון, בהתאם להנחיות ולאישורים הנדרשים. הביטוח הלאומי אינו מטפל בבקשת המשיכה עצמה.' },
];
const relatedLinks = [
  ['/savings', 'מרכז חיסכון ומשפחה'],
  ['/savings/family-budget', 'שילוב ההפקדות בתקציב המשפחתי'],
  ['/savings/sinking-funds', 'תכנון כסף להוצאה עתידית'],
  ['/savings/bank-deposit', 'בדיקת תנאים של פיקדון פרטי'],
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

export default function ChildSavingsPage() {
  return (
    <main dir="rtl" className="mx-auto max-w-4xl px-5 py-12 text-ink">
      <BreadcrumbSchema items={[{ name: 'דף הבית', url: '/' }, { name: 'חיסכון ומשפחה', url: '/savings' }, { name: title, url: pageUrl }]} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([articleSchema, faqSchema]).replace(/</g, '\\u003c') }} />
      <nav aria-label="פירורי לחם" className="mb-8 text-sm text-ink/70"><Link href="/" className="underline">דף הבית</Link>{' / '}<Link href="/savings" className="underline">חיסכון ומשפחה</Link>{' / '}<span aria-current="page">חיסכון לכל ילד</span></nav>
      <article className="space-y-8">
        <header><h1 className="font-serif text-3xl leading-tight md:text-4xl">{title}</h1><p className="mt-4 text-sm text-ink/70">מאת מערכת חשבונאי · נבדק ועודכן: <time dateTime={checkedAt}>30.10.2026</time></p></header>
        <section aria-labelledby="quick-answer" className="border border-gold/40 bg-paper p-6"><h2 id="quick-answer" className="mb-3 text-xl font-bold">תשובה מהירה</h2><p className="leading-8">{quickAnswer}</p><a href={sources[0].url} className="text-gold underline" target="_blank" rel="noopener noreferrer">מקור: ביטוח לאומי — תנאי התוכנית והסכומים</a></section>
        <aside aria-label="הבהרה מקצועית" className="border-r-4 border-gold bg-paper p-5 leading-8">המידע כללי בלבד ואינו ייעוץ מס, משפטי, פנסיוני או השקעות. לפני החלטה נדרשת התייעצות עם איש מקצוע בעל רישיון מתאים לנושא ולנסיבות. אין כאן המלצה על קופה, בנק או מסלול, ואין הבטחת תשואה.</aside>
        {sections.map((section, index) => <section key={section.heading} aria-labelledby={`section-${index}`} className="space-y-4"><h2 id={`section-${index}`} className="text-2xl font-bold">{section.heading}</h2>{section.paragraphs.map((paragraph) => <p key={paragraph} className="leading-8">{paragraph}</p>)}{section.source !== null && <p className="text-sm leading-7"><a href={sources[section.source].url} className="text-gold underline" target="_blank" rel="noopener noreferrer">{sources[section.source].label}</a></p>}</section>)}
        <section aria-labelledby="faq" className="space-y-5"><h2 id="faq" className="text-2xl font-bold">שאלות נפוצות</h2>{faqItems.map((item) => <div key={item.question}><h3 className="mb-2 text-lg font-bold">{item.question}</h3><p className="leading-8">{item.answer}</p></div>)}</section>
        <section aria-labelledby="sources" className="border border-ink/15 p-6"><h2 id="sources" className="mb-3 text-2xl font-bold">מקורות רשמיים</h2><p className="mb-4 leading-8">המקורות נבדקו ב־30.10.2026. הסכומים המפורטים מתייחסים ל־2026; יש לבדוק עדכונים לפני פעולה. הצעות התיעוד והארגון הן של מערכת האתר.</p><ul className="list-inside list-disc space-y-3 leading-7">{sources.map((source) => <li key={source.url}><a href={source.url} className="text-gold underline" target="_blank" rel="noopener noreferrer">{source.label}</a></li>)}</ul></section>
        <section aria-labelledby="related"><h2 id="related" className="mb-4 text-2xl font-bold">להמשך תכנון משפחתי</h2><ul className="grid gap-3 sm:grid-cols-2">{relatedLinks.map(([href, label]) => <li key={href}><Link href={href} className="text-gold underline">{label}</Link></li>)}</ul></section>
        <p className="text-sm leading-7 text-ink/70">אחריות התוכן: מערכת חשבונאי. פרטי בעל האתר מוצגים להלן; אין בכך אישור לבדיקה אישית של החיסכון או המלצה פנסיונית.</p>
        <AuthorBox bio="רואה חשבון וסמנכ״ל כספים. פרטי בעל האתר ותחומי עיסוקו מופיעים בדף האודות." />
      </article>
    </main>
  );
}
