import type { Metadata } from 'next';
import Link from 'next/link';
import { AuthorBox } from '@/components/calculator/AuthorBox';
import { Breadcrumbs } from '@/components/calculator/Breadcrumbs';
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';

const SITE_URL = 'https://cheshbonai.co.il';
const PAGE_PATH = '/salaried/form-106';
const UPDATED = '2026-10-24';
const TITLE = 'טופס 106: איך מקבלים, בודקים ומשתמשים באישור';
const DESCRIPTION = 'טופס 106 מרכז נתוני שכר וניכויי מס. למדו ממי מבקשים אותו, איך משווים אותו לתלושים, מה עושים כשחסר מסמך ואיך מכינים אותו לבדיקת מס בעזרת המקורות הרשמיים.';

const sources = [
  { label: 'רשות המסים: אישור על משכורת וניכוי מס, טופס 106', href: 'https://www.gov.il/he/service/itc-106' },
  { label: 'רשות המסים: טופס 106 הרשמי ופירוט שדותיו (PDF)', href: 'https://www.gov.il/BlobFolder/service/itc-106/he/Service_Pages_Income_tax_itc106.pdf' },
  { label: 'רשות המסים: בקשה להחזר מס ומסמכים לצירוף, טופס 135', href: 'https://www.gov.il/he/service/itc135' },
  { label: 'רשות המסים: כרטיס עובד, טופס 101', href: 'https://www.gov.il/he/service/itc101' },
  { label: 'תקנות מס הכנסה (ניכוי ממשכורת ומשכר עבודה) — תקנה 13', href: 'https://www.btl.gov.il/Laws1/02_0103_100076.pdf#page=4' },
];

const sections = [
  {
    id: 'purpose',
    title: 'מהו טופס 106 ומה הוא מאפשר לבדוק?',
    paragraphs: [
      'רשות המסים מתארת את טופס 106 כאישור שמרכז את נתוני המשכורת וניכויי המס בשנת המס. הוא כולל בין היתר חודשי עבודה, הפקדות העובד והמעסיק לקצבה ונתוני נקודות זיכוי. המעסיק הוא שמנפיק אותו. מדובר באישור על הנתונים שנרשמו אצל המעסיק, ולא בתוצאה של בדיקת מס אישית מטעם הרשות.',
      'מבחינה מעשית, התלושים עוזרים להבין מה קרה במהלך העבודה, והאישור השנתי מסייע לרכז את המידע עבור הבדיקה או הגוף שביקש אותו. כדאי לקרוא אותו כשיש לידכם את מסמכי השכר, ולא לנסות לזכור את הנתונים. אם מטרתכם היא להבין את מבנה התלוש, יש באתר מדריך נפרד לכך; כאן המיקוד הוא באישור ובשימוש במסמך.',
    ],
    source: sources[0],
  },
  {
    id: 'request',
    title: 'ממי מבקשים את הטופס ואיך מנהלים את האיסוף?',
    paragraphs: [
      'פנו למחלקת השכר או לגורם המטפל במסמכי עובדים אצל המעסיק הרלוונטי. ציינו את שנת המס המבוקשת ואת פרטי הזיהוי הנדרשים בערוץ המקובל אצל המעסיק. שאלו אם המסמך זמין במערכת העובדים או נשלח בדרך אחרת. אין להניח שאופן קבלת הטופס אצל מעסיק קודם זהה לאופן הקבלה במקום העבודה הנוכחי.',
      'הכינו רשימת מעסיקים ותקופות עבודה על סמך המסמכים שבידיכם. ליד כל מעסיק סמנו אם האישור התקבל, אם הוא קריא ואם פרטי השנה והזהות תואמים. כשאין גישה למערכת של מעסיק קודם, בקשו חלופה לקבלת מסמכי השכר ושמרו את ההתכתבות. פעולה מסודרת כזאת מונעת מצב שבו מתברר שחסר אישור רק באמצע מילוי הבקשה.',
      'לפי דף השירות העדכני של רשות המסים, המעסיקים מחויבים למסור את הטופס המלא עד 31 במרץ בשנה שלאחר שנת המס. תקנה 13(א) מוסיפה שכאשר העובד חדל להיות מועסק, המסירה היא ביום שבו חדל להיות מועסק, לפי העניין. אם המעסיק אינו משיב או אם יש קושי לזהות מי מחזיק ברישומים, פנו לרשות המסים או לבעל מקצוע עם פרטי המקרה. אל תיצרו מסמך שנראה כמו אישור מעסיק מתוך חיבור עצמי של תלושים.',
    ],
    source: sources[0],
  },
  {
    id: 'review',
    title: 'קוראים את השדות לפני שמעבירים מספרים',
    paragraphs: [
      'התחילו בשם העובד, במספר הזהות, בשם המעסיק ובשנת המס. אחר כך עברו לחודשי העבודה ולנתוני השכר והמס. הטופס הרשמי מפריד בין שדות שונים, ובהם תשלומים והפקדות, ולכן חשוב לקרוא את תיאור השדה ולא לזהות אותו רק לפי המיקום בדף. גרסת מערכת השכר של המעסיק עשויה להיראות אחרת מהטופס הריק באתר הרשות.',
      'בנו רשימת בדיקה קצרה: לאיזה נושא מתייחס השדה, מאיזה מסמך אפשר לברר אותו, והאם נותרה שאלה. הפרידו בין שכר שנרשם, מס שנוכה ונתוני הפקדות. אם אינכם מבינים קוד או כותרת, בקשו הסבר מחשבות השכר לפני ההזנה במערכת אחרת. התאמה בין תיאורי השדות חשובה יותר מהדמיון הגרפי בין המסמכים.',
      'צילום חלקי עלול להסתיר כותרת, הערה או המשך של הטופס. שמרו עותק מלא וקריא, כולל עמודי המשך אם ישנם. בהעברה לגורם מטפל בררו מהו ערוץ המסירה המתאים למסמך שמכיל פרטי זיהוי ושכר, וודאו שהקובץ שאתם שולחים אכן שייך לשנה ולמעסיק שביקשו.',
    ],
    source: sources[1],
  },
  {
    id: 'reconcile',
    title: 'איך בודקים פער בין האישור לתלושים?',
    paragraphs: [
      'רכזו את התלושים המתייחסים לעבודה אצל אותו מעסיק ואת מסמכי התיקון שנמסרו לכם. השוו נתונים בעלי אותה משמעות, ולא את ההפקדות בבנק מול כל שדה שנראה כמו הכנסה. התחילו מפרט שאתם מזהים בבירור והתקדמו לשדות האחרים. אם מדובר בהפרש לא מוסבר, סמנו אותו לבדיקה בלי לקבוע מראש איזו גרסה נכונה.',
      'פנייה מועילה לחשבות השכר כוללת את שנת המס, שם השדה, הנתון באישור והמסמכים שמעלים את השאלה. בקשו להבין אילו רישומים נכללו בו והאם יש מסמך נוסף או תיקון שיש להביא בחשבון. ההסבר צריך להתייחס לנתונים שלכם; תשובה כללית כמו כך המערכת מחשבת אינה מאפשרת להשלים את הבירור.',
      'אם התקבלה גרסה מתוקנת, שמרו אותה עם הסבר שמזהה את ההחלפה. בתיק העבודה הפעיל סמנו מהו הקובץ העדכני, כדי שלא תזינו גם את המסמך הישן וגם את החדש. אם כבר מסרתם את הנתונים לרשות או למייצג, עדכנו אותם על השינוי ובדקו מה נדרש לתיקון במסגרת ההליך המסוים.',
    ],
    source: null,
  },
  {
    id: 'tax-file',
    title: 'מכינים תיק מסמכים, בלי להסיק שהטופס מבטיח החזר',
    paragraphs: [
      'בדף הבקשה להחזר מס דורשת רשות המסים אישורי הכנסה מכל המקורות הרלוונטיים, ובהם טופסי 106, וכן מסמכים נוספים בהתאם למקרה. לכן אישור ממעסיק מסוים הוא חלק מתיק הבדיקה. בדקו בדף השירות אילו אישורים נדרשים להכנסות נוספות ולנתונים האישיים שלכם, ואל תסיקו שהמסמך היחיד שבידכם משלים את הבקשה.',
      'לצורך עבודה מסודרת, חלקו את התיק לאישורי שכר, אישורי הכנסות אחרים ומסמכים תומכים. רשמו מה כבר התקבל ומה עדיין חסר. אם בקשה מסוימת אינה מתאימה לנסיבות שלכם או אם קיימת שאלה בדבר חובת דיווח, בררו את מסלול הטיפול מול הרשות או המייצג לפני ההגשה. אין צורך לנחש תנאי זכאות כדי להתחיל לאסוף את התיעוד.',
      'אפשר להשתמש בנתונים לצורך אומדן, אך יש להבחין בין תוצאת סימולציה, הגשת בקשה והחלטת הרשות. הטופס אינו מבטיח החזר ואינו מחליף בדיקה של תמונת ההכנסות והמס המלאה. שמרו את אישור ההגשה וההתכתבות בתיק המתאים כדי שאפשר יהיה לעקוב אחר בקשת השלמה או החלטה.',
    ],
    source: sources[2],
  },
  {
    id: 'forms',
    title: 'טופס 101 וטופס 106: לאיזו פעולה שייך כל מסמך?',
    paragraphs: [
      'דף השירות של טופס 101 מתאר כרטיס עובד המשמש למסירת פרטים ולבקשות להקלה ולתיאום מס באמצעות המעסיק. טופס 106 מרכז את רישומי השכר והניכויים של שנת המס. כשמבקשים מכם מסמך, בדקו את שמו ואת מטרת הבקשה: הצהרה לצורך טיפול בשכר ואישור על רישומי שכר הם מסמכים שונים.',
      'למשל, אם אתם מתחילים עבודה ומקבלים בקשה למלא כרטיס עובד, שמירת אישור השכר מהמעסיק הקודם אינה משלימה את מילוי ההצהרה. ואם אתם מכינים אישורי הכנסה לבדיקת מס, אל תשלחו במקום האישור עותק של הצהרת הקליטה. במצב לא ברור בקשו מהגורם המטפל לציין את המסמך החסר ואת הפעולה שהוא אמור לתמוך בה.',
    ],
    source: sources[3],
  },
];

const faqItems = [
  { question: 'מי מנפיק טופס 106?', answer: 'לפי רשות המסים, האישור מונפק בידי המעסיק. פנו לגורם המטפל בשכר ובקשו את האישור עבור שנת המס הרלוונטית, באמצעות ערוץ המסירה המקובל אצלו.' },
  { question: 'אפשר להשתמש בתלושים במקום אישור חסר?', answer: 'התלושים מסייעים בבירור ובבדיקת הנתונים. אין להניח שהם מחליפים את האישור בהליך המבוקש. בקשו את המסמך מהמעסיק ובררו מול הגוף המטפל מה נדרש במקרה שלכם.' },
  { question: 'מה עושים אם מצאתי טעות בטופס?', answer: 'פנו לחשבות השכר עם שם השדה והמסמכים שמצביעים על הפער. בקשו בירור ועותק מתוקן במידת הצורך. אם הנתונים כבר הוגשו בהליך אחר, בדקו מול הגורם המטפל כיצד לעדכן אותם.' },
  { question: 'האם טופס 106 מוכיח שמגיע לי החזר מס?', answer: 'האישור מתעד נתוני שכר וניכויים. כדי לבדוק החזר יש לבחון את כלל הנתונים והמסמכים הרלוונטיים לפי הנחיות רשות המסים. אין להסיק זכאות מעצם קבלת האישור או מנתון מס בודד.' },
];

const relatedLinks = [
  { href: '/personal-tax/tax-refund', label: 'אומדן החזר מס בעזרת הנתונים השנתיים' },
  { href: '/personal-tax/tax-return-full', label: 'היערכות לבדיקת דוח מס' },
  { href: '/salaried/payslip-guide', label: 'זיהוי השדות בתלוש המשכורת' },
  { href: '/personal-tax/tax-credits', label: 'בדיקת נושא נקודות הזיכוי' },
  { href: '/salaried/two-jobs', label: 'ניהול מסמכים כשעובדים אצל מעסיקים במקביל' },
  { href: '/salaried/starting-new-job', label: 'הפרטים והמסמכים לקליטה אצל מעסיק חדש' },
  { href: '/salaried/salary-components', label: 'הבנת ההבדל בין רכיבי השכר' },
];

export const metadata: Metadata = {
  title: { absolute: `${TITLE} | חשבונאי` }, description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}${PAGE_PATH}` },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `${SITE_URL}${PAGE_PATH}`, type: 'article', locale: 'he_IL', siteName: 'חשבונאי', images: ['/opengraph-image'] },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION, images: ['/opengraph-image'] },
};

export default function Form106Page() {
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
      <BreadcrumbSchema items={[{ name: 'דף הבית', url: '/' }, { name: 'שכירים', url: '/salaried' }, { name: 'טופס 106', url: PAGE_PATH }]} />
      <article className="mx-auto max-w-3xl px-4 py-8">
        <Breadcrumbs items={[{ label: 'דף הבית', href: '/' }, { label: 'שכירים', href: '/salaried' }, { label: 'טופס 106' }]} />
        <header className="my-8">
          <h1 className="mb-4 text-3xl font-bold text-ink md:text-4xl">{TITLE}</h1>
          <p className="text-lg leading-relaxed text-ink/75">קיבלתם אישור שכר שנתי או התבקשתם לצרף אותו? כאן נלמד לאסוף את המסמך, לבדוק את פרטיו ולהכין אותו לשימוש. לבדיקת תוצאת המס עצמה המשיכו אל <Link href="/personal-tax/tax-refund" className="underline">סימולטור החזר המס</Link> וההנחיות הרשמיות.</p>
          <p className="mt-3 text-sm text-ink/70">מאת אנדרי פלטונוב, רו״ח · בדיקת תוכן ומקורות: <time dateTime={UPDATED}>24.10.2026</time></p>
        </header>
        <section aria-labelledby="quick-answer" className="mb-8 border border-gold/40 bg-cream-2 p-5">
          <p className="mb-2 text-sm font-bold text-gold">תשובה מהירה</p>
          <h2 id="quick-answer" className="mb-3 text-xl font-bold text-ink">איך מקבלים ומשתמשים בטופס 106?</h2>
          <p className="leading-relaxed text-ink/80">מבקשים מהמעסיק את אישור השכר לשנת המס הרלוונטית. בודקים זהות, שנת מס ונתונים מול מסמכי השכר, ומבררים פערים לפני השימוש. בהכנת בקשת מס פועלים לפי רשימת המסמכים הרשמית; האישור כשלעצמו אינו קובע זכאות להחזר.</p>
        </section>
        <nav aria-label="תוכן עניינים" className="mb-8 border border-ink/15 p-5"><ul className="space-y-2">{sections.map((section) => <li key={section.id}><a href={`#${section.id}`} className="text-ink/80 underline">{section.title}</a></li>)}</ul></nav>
        <div className="prose prose-lg max-w-none leading-relaxed text-ink">
          {sections.map((section) => <section key={section.id} aria-labelledby={section.id}><h2 id={section.id}>{section.title}</h2>{section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}{section.source && <p className="text-sm">מקור רשמי: <a href={section.source.href}>{section.source.label}</a>.</p>}</section>)}
        </div>
        <section aria-labelledby="related" className="my-10"><h2 id="related" className="mb-4 text-2xl font-bold text-ink">ממשיכים מהמסמך לבדיקה</h2><ul className="grid gap-3 sm:grid-cols-2">{relatedLinks.map((link) => <li key={link.href}><Link href={link.href} className="block border border-ink/15 p-4 text-ink underline hover:border-gold">{link.label}</Link></li>)}</ul></section>
        <section aria-labelledby="faq" className="mb-10"><h2 id="faq" className="mb-4 text-2xl font-bold text-ink">שאלות נפוצות על טופס 106</h2><div className="space-y-3">{faqItems.map((item) => <details key={item.question} className="border border-ink/15 p-4"><summary className="cursor-pointer font-bold text-ink">{item.question}</summary><p className="mt-3 leading-relaxed text-ink/75">{item.answer}</p></details>)}</div></section>
        <section aria-labelledby="sources" className="mb-8"><h2 id="sources" className="mb-3 text-xl font-bold text-ink">מקורות רשמיים</h2><ul className="space-y-2">{sources.map((source) => <li key={source.href}><a href={source.href} className="text-ink/80 underline">{source.label}</a></li>)}</ul></section>
        <aside aria-label="הבהרה מקצועית" className="mb-8 border border-ink/15 bg-cream-2 p-5 text-sm leading-relaxed text-ink/75">המידע כללי ואינו ייעוץ מס או משפטי. התאמת מסמכים, חובת דיווח, מועדים וזכאות להחזר נבדקים לפי הנתונים האישיים וההוראות העדכניות. במקרה של מסמך חסר, טעות או ספק פנו למעסיק, לרשות המסים או לבעל מקצוע מתאים.</aside>
        <AuthorBox bio="רואה חשבון וסמנכ״ל כספים. באתר חשבונאי מסביר מושגים פיננסיים ומציג כלים לבדיקת נתונים אישיים מול מסמכים ומקורות רשמיים." />
      </article>
    </div>
  );
}
