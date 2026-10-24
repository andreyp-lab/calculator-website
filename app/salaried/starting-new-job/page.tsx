import type { Metadata } from 'next';
import Link from 'next/link';
import { AuthorBox } from '@/components/calculator/AuthorBox';
import { Breadcrumbs } from '@/components/calculator/Breadcrumbs';
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';

const SITE_URL = 'https://cheshbonai.co.il';
const PAGE_PATH = '/salaried/starting-new-job';
const UPDATED = '2026-10-24';
const TITLE = 'מתחילים עבודה חדשה: מסמכים, פנסיה והשכר הראשון';
const DESCRIPTION = 'מה להכין כשמתחילים עבודה חדשה? רשימת עבודה מעשית לבדיקת תנאי ההעסקה, טופס 101, מסמכי פנסיה, דיווח נוכחות ובקרת המשכורת הראשונה, עם מקורות ממשלתיים רשמיים.';

const sources = [
  { label: 'משרד העבודה: דוגמה להודעה על תנאי עבודה (PDF)', href: 'https://www.gov.il/BlobFolder/generalpage/work-rights-working-conditions-notification/he/workers-rights_admission-to-work_work-rights-working-conditions-notification_Hodaa-Pirot.pdf' },
  { label: 'רשות המסים: כרטיס עובד ובקשה להקלה ולתיאום מס, טופס 101', href: 'https://www.gov.il/he/service/itc101' },
  { label: 'משרד האוצר: פנסיה צוברת ומוצרי חיסכון', href: 'https://www.gov.il/he/pages/cumulative-pension?chapterIndex=1' },
  { label: 'משרד העבודה: שכר עבודה והסדרים נוספים', href: 'https://www.gov.il/he/pages/labor-wage?chapterIndex=4' },
  { label: 'רשות המסים: תיאום מס מקוון', href: 'https://www.gov.il/he/service/tax-coordination-online' },
  { label: 'תקנות מס הכנסה (ניכוי ממשכורת ומשכר עבודה) — תקנה 2', href: 'https://www.btl.gov.il/Laws1/02_0103_100076.pdf#page=2' },
];

const sections = [
  {
    id: 'agreement',
    title: 'לפני הקליטה: מרכזים את מה שסוכם על העבודה',
    paragraphs: [
      'פתחו תיק מסמכים למעסיק החדש ושמרו בו את הצעת העבודה, ההסכם וכל הבהרה שנמסרה לכם. עברו על זהות המעסיק, התפקיד, היקף העבודה ובסיס השכר. אם הובטח רכיב מסוים בשיחה, בקשו לראות כיצד הוא מתואר במסמך. כך אפשר להגיע לקליטה עם שאלות ממוקדות במקום לנסות לשחזר הבטחות לאחר שהעבודה כבר החלה.',
      'הדוגמה הרשמית של משרד העבודה להודעה על תנאי עבודה יכולה לעזור לארגן את הבדיקה. היא כוללת נושאים כמו תפקיד, תשלומי שכר ותנאים סוציאליים. השתמשו בה כרשימת נושאים לשיחה עם משאבי אנוש, ולא כמסמך שקובע לבדו את התנאים שלכם. בקשו הסבר לכל סעיף שנותר עמום במסמכי ההעסקה האישיים.',
      'רשמו גם מי אחראי לטיפול בכל נושא: המנהל המקצועי, משאבי אנוש, חשבות שכר או גורם אחר. במקרה של חוסר התאמה בין המסמכים, בקשו הבהרה כתובה שמזהה את הנוסח שעליו מסתמכים. שאלות לגבי חוקיות הסדר או תחולת הסכם דורשות בדיקה מקצועית של המקרה ולא ניחוש על סמך תפקיד דומה.',
    ],
    source: sources[0],
  },
  {
    id: 'employee-card',
    title: 'ממלאים טופס 101 על בסיס הפרטים האמיתיים',
    paragraphs: [
      'לפי תקנה 2(א)(1), יש להגיש למעסיק טופס 101 מלא בתוך שבוע מתחילת העבודה או ביום קבלת המשכורת הראשונה — לפי המוקדם — ולהגיש מחדש בתחילת כל שנת מס. יש לצרף צילום תעודת זהות עם ספח והמסמכים הנדרשים לפי הטופס. בהזנה למערכת המעסיק קראו גם פרטים שהוזנו מראש; אל תאשרו שדה רק מפני שכבר מופיע בו ערך.',
      'הכינו מראש את המידע שנדרש מכם, וודאו שהמסמכים המצורפים קריאים ומתאימים להצהרה. אם אינכם יודעים כיצד לתאר הכנסה ממקור אחר או פרט אישי, בקשו הכוונה מהגורם המטפל לפני החתימה. הבקשה להקלה והטיפול בה צריכים להישען על המקרה והאסמכתאות שלכם, ולא על סימון שהומלץ לעובד אחר.',
      'שמרו את העותק שהוגש, אם המערכת מאפשרת זאת, ועקבו אחר הודעת השלמה או חוסר. כשמקבלים בקשה לתיקון, בדקו מהו הפרט החסר ומה צריך לצרף כדי להשלים אותו. אל תשאירו טיוטה במערכת מתוך הנחה שהיא נשלחה; בדקו מהו מצב הבקשה כפי שהוא מוצג אצל המעסיק.',
    ],
    source: sources[1],
  },
  {
    id: 'pension',
    title: 'מבררים את פרטי הפנסיה ואת קליטת ההפקדות',
    paragraphs: [
      'אספו את פרטי המוצר הפנסיוני הקיים, אם יש כזה, ואת מסמכי ההצטרפות או הדוחות שבידיכם. במדריך משרד האוצר מוסבר המבנה של חיסכון פנסיוני צובר והמוצרים השונים. לצורך הקליטה בקשו מחשבות השכר רשימת מסמכים מתאימה, ובררו מול הגוף המנהל אילו פרטים דרושים לזיהוי החיסכון ולהמשך הטיפול.',
      'שאלו מהו בסיס השכר להפקדות לפי ההסדר שלכם, כיצד מתבצע הרישום ואיך תוכלו לבדוק את קליטת הכספים. אין במדריך קביעה של מועד תחילת זכאות, שיעור הפקדה או כיסוי ביטוחי אחיד. בקשו בירור אישי של הנושאים האלה, ובמיוחד אם הייתה הפסקה בעבודה או אם אינכם יודעים מה מצב המוצר הקיים.',
      'אם מוצעת לכם בחירה או החלפה של מוצר, הכינו את המסמכים לשיחה עם בעל רישיון מתאים. השוו את התנאים והמשמעויות האישיות לפני החלטה. לשם מעקב אחר הקליטה הפרידו בין מסמך שנמסר למעסיק, רישום שכר והמידע שמציג הגוף הפנסיוני; במקרה של פער בקשו מכל גורם להסביר את הרישום שבאחריותו.',
    ],
    source: sources[2],
  },
  {
    id: 'payroll',
    title: 'מסדירים את דיווח הנוכחות ואת מסלול הטיפול בשכר',
    paragraphs: [
      'בררו היכן מדווחים עבודה, מי מאשר את הדיווח ואיך מתקנים רישום שלא נקלט. שאלו כיצד מטפלים בימי היעדרות, בעבודה מחוץ למשרד ובהוצאה שהמעסיק אישר. בקשו את נוהל העבודה במקום להסתמך על הרגלים ממעסיק קודם. מטרת הרשימה היא לדעת איך להעביר מידע נכון למערכת השכר.',
      'בדקו מול הגורם המוסמך כיצד מוסרים ומאמתים פרטי חשבון בנק, ואיך מקבלים גישה לתלושים ולמסמכים. שמרו אישורי מסירה בערוץ המקובל, והימנעו משליחת מסמכים המכילים מידע רגיש לגורם שלא ברור תפקידו. אם אתם מזהים שגיאה בפרט זיהוי או בפרטי התשלום, פנו לתיקונה ושמרו את התשובה.',
      'לגבי מועד ואופן תשלום השכר, בדקו את המסמכים וההוראות החלות על ההעסקה. משרד העבודה מפרסם הסבר לפי בסיס התשלום ומציין שייתכנו הסדרים נוספים. אם מועד הסגירה הפנימי של מערכת הדיווח אינו ברור, שאלו מה משמעותו התפעולית וכיצד מדווחים תיקון; אל תסיקו ממנו לבדו מסקנה משפטית.',
    ],
    source: sources[3],
  },
  {
    id: 'transition',
    title: 'מעבר ממעסיק קודם או המשך עבודה נוספת',
    paragraphs: [
      'כתבו לעצמכם מה השתנה: עבודה שהסתיימה, עבודה שנמשכת במקביל או שינוי בהיקף העבודה. שמרו את מסמכי המעסיק הקודם בנפרד מהתיק החדש, אך הכינו אותם אם הגורם המטפל זקוק לתמונת ההכנסות. אם צפוי תשלום נוסף, בררו מה הוא מייצג וכיצד לדווח עליו בהליך הרלוונטי במקום להניח שהוא אינו קשור לבדיקה.',
      'כאשר עולות שאלות על טיפול בהכנסות או על התאמת אישור מס, פנו לדף התיאום הרשמי של רשות המסים או לבדיקה מקצועית. אין לקבוע אוטומטית מתוך החלפת העבודה אם נדרש תיאום ומה תהיה התוצאה. אם אתם ממשיכים אצל מעסיקים במקביל, המדריך הייעודי לעבודה בשתי עבודות מפרט כיצד לארגן את הטיפול מול הגורמים השונים.',
      'המעבר הוא גם הזדמנות לבקש דרך לקבלת מסמכי שכר מהמעסיק הקודם לאחר סגירת הגישה למערכותיו. שמרו פרטי קשר מתאימים ועותקים של מסמכים שכבר נמסרו. כך תוכלו להשיב לבקשה מאוחרת לאישור הכנסה בלי להיות תלויים רק בגישה ישנה למערכת ארגונית.',
    ],
    source: sources[4],
  },
  {
    id: 'first-salary',
    title: 'בודקים את המשכורת הראשונה מול תיק הקליטה',
    paragraphs: [
      'כשתקבלו את התלוש, קחו לצדו את ההסכם, דיווח העבודה והאישורים שנמסרו. בדקו את זהות המעסיק, התקופה המתוארת, רכיבי השכר והניכויים. אם עבדתם רק בחלק מתקופת השכר, בקשו הסבר לחישוב המתאים לכך לפני שאתם משווים לסכום שנדון עבור עבודה מלאה.',
      'עברו על ההחזרים והתוספות שציפיתם לראות, ובדקו את רישומי ההפקדות מול ההסבר שקיבלתם. התאימו את התשלום בפועל לרישום הרלוונטי בתלוש. אל תסיקו שטעות קיימת רק בגלל שינוי בנטו, ואל תניחו שהכול תקין רק משום שההעברה לבנק התקבלה. מטרת הבדיקה היא לחבר בין ההסכמה, הרישום והתשלום.',
      'אם משהו חסר, פתחו פנייה עם תיאור נקודתי: איזה רכיב או פרט דורש בירור, על איזה מסמך הסתמכתם ומה מופיע בתלוש. בקשו תשובה בכתב והנחיה כיצד תיבדק התוצאה. המשיכו לעקוב אחרי השאלה עד שיש הסבר ומסמך מתאים, ושמרו את שניהם בתיק הקליטה להמשך העבודה.',
    ],
    source: null,
  },
];

const faqItems = [
  { question: 'מה כדאי להכין לפני שמתחילים עבודה חדשה?', answer: 'רכזו את מסמכי ההעסקה, פרטי הזיהוי והמסמכים שנדרשו לכרטיס העובד, ופרטי החיסכון הפנסיוני שבידיכם. בקשו מהמעסיק רשימת קליטה מותאמת ובררו מי מטפל בשאלות שכר ונוכחות.' },
  { question: 'האם אפשר להניח שהפרטים בטופס הקליטה כבר נכונים?', answer: 'קראו גם שדות שהמערכת מילאה מראש, השוו למסמכים ועדכנו שגיאות לפני החתימה. בדקו שהטופס נשלח ונקלט ולא נשאר כטיוטה. פרט לא ברור מפנים לבירור אצל הגורם המטפל.' },
  { question: 'מה לבדוק אם כבר יש לי חיסכון פנסיוני?', answer: 'אספו פרטי מוצר ומסמכים קיימים ובקשו הנחיות קליטה מהמעסיק ומהגוף המנהל. בררו אישית את בסיס ההפקדות, הטיפול בכיסוי וההסדר החל. אין להסיק מהמדריך מועד זכאות או שיעור הפקדה.' },
  { question: 'מה עושים אם המשכורת הראשונה שונה ממה שציפיתי?', answer: 'השוו את ההסכם, תקופת העבודה, הדיווח והרכיבים לתלוש. בקשו מחשבות השכר הסבר על הפער המסוים והציגו את המסמך שעליו הסתמכתם. אם נמצא צורך בתיקון, עקבו אחר הטיפול ואחר המסמך המעודכן.' },
];

const relatedLinks = [
  { href: '/salaried/salary-components', label: 'פירוט חבילת השכר לפני חתימה' },
  { href: '/salaried/payslip-guide', label: 'מדריך לקריאת המשכורת הראשונה' },
  { href: '/personal-tax/salary-net-gross', label: 'אומדן שכר נטו לפי הנחות אישיות' },
  { href: '/insurance/pension', label: 'שאלות לבדיקת החיסכון הפנסיוני' },
  { href: '/salaried/two-jobs', label: 'טיפול בעבודה נוספת במקביל' },
  { href: '/salaried/form-106', label: 'קבלת אישור השכר השנתי מהמעסיק' },
  { href: '/personal-tax/tax-credits', label: 'בדיקת נקודות זיכוי ומסמכים רלוונטיים' },
];

export const metadata: Metadata = {
  title: { absolute: `${TITLE} | חשבונאי` }, description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}${PAGE_PATH}` },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `${SITE_URL}${PAGE_PATH}`, type: 'article', locale: 'he_IL', siteName: 'חשבונאי', images: ['/opengraph-image'] },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION, images: ['/opengraph-image'] },
};

export default function StartingNewJobPage() {
  const articleSchema = {
    '@context': 'https://schema.org', '@type': 'Article', headline: TITLE, description: DESCRIPTION,
    inLanguage: 'he-IL', datePublished: UPDATED, dateModified: UPDATED,
    author: { '@type': 'Person', name: 'אנדרי פלטונוב', jobTitle: 'רואה חשבון' },
    publisher: { '@type': 'Organization', name: 'חשבונאי', url: SITE_URL }, image: `${SITE_URL}/opengraph-image`,
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE_URL}${PAGE_PATH}` }, citation: sources.map((source) => source.href),
  };
  const faqSchema = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faqItems.map((item) => ({ '@type': 'Question', name: item.question, acceptedAnswer: { '@type': 'Answer', text: item.answer } })) };

  return (
    <div className="min-h-screen bg-paper" dir="rtl">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema).replace(/</g, '\\u003c') }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema).replace(/</g, '\\u003c') }} />
      <BreadcrumbSchema items={[{ name: 'דף הבית', url: '/' }, { name: 'שכירים', url: '/salaried' }, { name: 'מתחילים עבודה חדשה', url: PAGE_PATH }]} />
      <article className="mx-auto max-w-3xl px-4 py-8">
        <Breadcrumbs items={[{ label: 'דף הבית', href: '/' }, { label: 'שכירים', href: '/salaried' }, { label: 'מתחילים עבודה חדשה' }]} />
        <header className="my-8"><h1 className="mb-4 text-3xl font-bold text-ink md:text-4xl">{TITLE}</h1><p className="text-lg leading-relaxed text-ink/75">רשימת עבודה מהסיכום על התנאים ועד בדיקת התלוש: אילו מסמכים לאסוף, מה לשאול ואיך לוודא שתהליך הקליטה הושלם. להסבר מעמיק על מבנה ההצעה, היעזרו ב<Link href="/salaried/salary-components" className="underline">מדריך רכיבי השכר</Link>.</p><p className="mt-3 text-sm text-ink/70">מאת אנדרי פלטונוב, רו״ח · בדיקת תוכן ומקורות: <time dateTime={UPDATED}>24.10.2026</time></p></header>
        <section aria-labelledby="quick-answer" className="mb-8 border border-gold/40 bg-cream-2 p-5"><p className="mb-2 text-sm font-bold text-gold">תשובה מהירה</p><h2 id="quick-answer" className="mb-3 text-xl font-bold text-ink">מה עושים כדי להתחיל עבודה בצורה מסודרת?</h2><p className="leading-relaxed text-ink/80">רכזו את תנאי העבודה בכתב, השלימו את כרטיס העובד לפי ההנחיות, בררו את הטיפול בחיסכון הפנסיוני והכירו את נוהל דיווח העבודה. שמרו אישורי מסירה, ובמשכורת הראשונה השוו את ההסכם והדיווח לתלוש ולתשלום. שאלה על זכאות, מס או הסדר פנסיוני מפנים לבדיקה אישית.</p></section>
        <nav aria-label="תוכן עניינים" className="mb-8 border border-ink/15 p-5"><ul className="space-y-2">{sections.map((section) => <li key={section.id}><a href={`#${section.id}`} className="text-ink/80 underline">{section.title}</a></li>)}</ul></nav>
        <div className="prose prose-lg max-w-none leading-relaxed text-ink">{sections.map((section) => <section key={section.id} aria-labelledby={section.id}><h2 id={section.id}>{section.title}</h2>{section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}{section.source && <p className="text-sm">מקור רשמי: <a href={section.source.href}>{section.source.label}</a>.</p>}</section>)}</div>
        <section aria-labelledby="related" className="my-10"><h2 id="related" className="mb-4 text-2xl font-bold text-ink">מדריכים וכלים להשלמת הקליטה</h2><ul className="grid gap-3 sm:grid-cols-2">{relatedLinks.map((link) => <li key={link.href}><Link href={link.href} className="block border border-ink/15 p-4 text-ink underline hover:border-gold">{link.label}</Link></li>)}</ul></section>
        <section aria-labelledby="faq" className="mb-10"><h2 id="faq" className="mb-4 text-2xl font-bold text-ink">שאלות נפוצות לפני ובמהלך הקליטה</h2><div className="space-y-3">{faqItems.map((item) => <details key={item.question} className="border border-ink/15 p-4"><summary className="cursor-pointer font-bold text-ink">{item.question}</summary><p className="mt-3 leading-relaxed text-ink/75">{item.answer}</p></details>)}</div></section>
        <section aria-labelledby="sources" className="mb-8"><h2 id="sources" className="mb-3 text-xl font-bold text-ink">מקורות רשמיים</h2><ul className="space-y-2">{sources.map((source) => <li key={source.href}><a href={source.href} className="text-ink/80 underline">{source.label}</a></li>)}</ul></section>
        <aside aria-label="הבהרה מקצועית" className="mb-8 border border-ink/15 bg-cream-2 p-5 text-sm leading-relaxed text-ink/75">המידע כללי ואינו ייעוץ מס, משפטי או פנסיוני. תנאי עבודה, זכאות, מועדים וטיפול בהפקדות נבדקים לפי הנתונים וההסדר האישי. כאשר חסר מקור ברור או מסמך מתאים, בקשו בירור מחשבות השכר, מהרשות המוסמכת או מבעל רישיון מתאים.</aside>
        <AuthorBox bio="רואה חשבון וסמנכ״ל כספים. באתר חשבונאי מסביר מושגים פיננסיים ומציג כלים לבדיקת נתונים אישיים מול מסמכים ומקורות רשמיים." />
      </article>
    </div>
  );
}
