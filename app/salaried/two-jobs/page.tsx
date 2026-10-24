import type { Metadata } from 'next';
import Link from 'next/link';
import { AuthorBox } from '@/components/calculator/AuthorBox';
import { Breadcrumbs } from '@/components/calculator/Breadcrumbs';
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';

const SITE_URL = 'https://cheshbonai.co.il';
const PAGE_PATH = '/salaried/two-jobs';
const UPDATED = '2026-10-24';
const TITLE = 'עבודה בשתי עבודות: תיאום מס ובדיקת דמי ביטוח';
const DESCRIPTION = 'עובדים אצל מעסיקים במקביל? מדריך מעשי לאיסוף נתוני שכר, טיפול בתיאום מס, בדיקת תיאום דמי ביטוח ומעקב אחר האישורים בתלושים, עם קישורים למקורות הרשמיים.';

const sources = [
  { label: 'רשות המסים: תיאום מס מקוון ועדכון תיאום קיים', href: 'https://www.gov.il/he/service/tax-coordination-online' },
  { label: 'רשות המסים: טופס 101 והצהרה על הכנסות', href: 'https://www.gov.il/he/service/itc101' },
  { label: 'ביטוח לאומי: בדיקת הצורך בתיאום דמי ביטוח', href: 'https://www.btl.gov.il/Insurance/Teum/Pages/default.aspx' },
  { label: 'ביטוח לאומי: הפקת אישור לתיאום דמי ביטוח', href: 'https://www.btl.gov.il/Insurance/Teum/Pages/הפקת-אישור-לשנלמעסיק-משני-.aspx' },
  { label: 'רשות המסים: מסמכי הכנסה לבקשת החזר מס', href: 'https://www.gov.il/he/service/itc135' },
  { label: 'תקנות מס הכנסה (ניכוי ממשכורת ומשכר עבודה) — תקנה 2', href: 'https://www.btl.gov.il/Laws1/02_0103_100076.pdf#page=2' },
];

const sections = [
  {
    id: 'map',
    title: 'ממפים את העבודה המקבילה לפני שמטפלים בטפסים',
    paragraphs: [
      'התחילו מתמונה מסודרת של מקורות השכר: מי משלם, מהי תקופת העבודה, איזה רכיב קבוע ואיזה משתנה, ואילו מסמכים כבר קיימים. הפרידו בין עבודה במקביל לבין מעבר ממעסיק למעסיק. גם אם התקבלו תשלומים ממעסיקים שונים, כדאי לברר לאילו תקופות הם מתייחסים כדי לתאר את המצב נכון לגורם המטפל.',
      'הכינו תיק שבו לכל מעסיק יש תלושים, פרטי גורם הקשר בשכר והאישורים שנמסרו לו. לצד הנתונים בפועל רשמו את ההכנסה הצפויה והנחות העבודה שלכם: האם היקף המשמרות ידוע, האם יש עמלה והאם מתוכנן שינוי בתפקיד. אל תציגו הערכה כאילו היא שכר שכבר התקבל.',
      'מטרת הארגון היא לאפשר טיפול עקבי מול המעסיקים והרשויות. כאשר אין תשובה לפרט מסוים, שאלו את חשבות השכר או את הרשות כיצד לתאר אותו. עדיף להשאיר שאלה מסומנת לבירור מאשר להעתיק נתון מתלוש שאינו מתאים למקור ההכנסה או לתקופה המבוקשת.',
    ],
    source: null,
  },
  {
    id: 'declaration',
    title: 'מוסרים פרטי הכנסה ומתעדים מה נקלט אצל כל מעסיק',
    paragraphs: [
      'טופס 101 הוא כרטיס העובד המשמש גם לטיפול בהכנסות נוספות, כמוסבר בדף השירות של רשות המסים. מלאו את ההצהרה לפי המצב שלכם וההוראות בטופס, והעבירו את המסמכים שהתבקשתם לצרף. כשהניסוח אינו מתאים להבנתכם, בקשו הבהרה לפני החתימה במקום לבחור אפשרות לפי מה שנראה שישאיר נטו גבוה יותר.',
      'שמרו עותק של ההצהרה שנמסרה ושל אישור הקליטה, ככל שהוא זמין. כך אפשר יהיה לבדוק מה הוצהר אם יתגלה בהמשך פער בניכוי. שאלו מי מטפל במסמכים אצל כל מעסיק ואיך ניתן לוודא שטופס או אישור חדש הגיעו לאדם הנכון. עצם משלוח קובץ אינו נותן לכם תמונה של אופן הטיפול בו.',
      'אם השתנה פרט שמופיע בכרטיס העובד, תקנה 2(ד) מחייבת להודיע למעסיק על השינוי בתוך שבוע. החובה לעדכן את טופס 101 נפרדת מהשאלה אם צריך לעדכן גם תיאום מס קיים. עיינו בנוסח התקנה שבמקורות; רשימת המקורות והעותקים ששמרתם תסייע לתאר לחשבות השכר מה השתנה ולהימנע מגרסאות שונות של אותם נתונים.',
    ],
    source: sources[1],
  },
  {
    id: 'income-tax',
    title: 'תיאום מס: מכינים נתונים, מקבלים אישורים ומעבירים אותם',
    paragraphs: [
      'בדף התיאום המקוון מפרטת רשות המסים מה להכין: פרטי תיקי הניכויים, נתוני הכנסה ומסמכים תומכים לפי הבקשה. השירות מתייחס גם להערכה של ההכנסה השנתית, והאישורים המופקים בו מיועדים למסירה למעסיקים או למשלמים. בדקו בדף הרשמי אם המסלול המקוון מתאים למקרה שלכם.',
      'לפני הזנה, השוו את שם המעסיק ופרטי התיק למסמך שכר עדכני. אם היקף העבודה משתנה, הכינו הערכה מנומקת וכתבו לעצמכם על מה היא מבוססת. אין לנחש הכנסה כדי להשיג תוצאה מסוימת. כאשר אינכם יודעים כיצד להזין תשלום משתנה או הכנסה שאינה רגילה, הפנו את השאלה לרשות או למייצג.',
      'לאחר קבלת האישורים בדקו למי מיועד כל מסמך ושלחו אותו לגורם השכר המתאים. שמרו את הקובץ שנמסר ואת התשובה שקיבלתם. דף השירות הרשמי מסביר גם כיצד מעדכנים תיאום קיים; אם הנתונים השתנו, בדקו את התהליך שם ואל תניחו שהאישור שכבר שמור בתיק משקף את המצב החדש.',
    ],
    source: sources[0],
  },
  {
    id: 'national-insurance',
    title: 'בודקים בנפרד את דמי הביטוח הלאומי והבריאות',
    paragraphs: [
      'לביטוח הלאומי יש מסלול נפרד לבדיקת תיאום דמי ביטוח כשיש מקורות עבודה במקביל. באתרו נדרשת בדיקה אם התיאום נחוץ לפי המצב האישי. אין להסיק שכל מי שעובד בעבודות מקבילות צריך אותו טיפול, ואין להעתיק ספי הכנסה ממדריך ישן. את התנאים העדכניים בודקים ישירות באתר הביטוח הלאומי.',
      'לצורך הפנייה רכזו את נתוני השכר מכל המקורות ואת פרטי המעסיקים. אם אינכם בטוחים כיצד מוגדרים אצלכם מעסיק עיקרי ומשני, בדקו את ההסבר הרשמי ובקשו הבהרה ביחס להצהרות שלכם. אל תעבירו לאחד המעסיקים נתון שאינכם יודעים כיצד נקבע רק כדי להשלים טופס.',
      'אם נדרש והופק אישור מתאים, דף ההפקה הרשמי מסביר למי למסור אותו. שמרו אותו בנפרד מאישור תיאום המס והגדירו בתיק איזו רשות הנפיקה כל מסמך. כאשר תשובה שקיבלתם אינה ברורה או אינה מתאימה לכאורה למצבכם, בררו אותה מול הביטוח הלאומי לפני שמבקשים לשנות ניכויים.',
    ],
    source: sources[2],
  },
  {
    id: 'payslips',
    title: 'אחרי המסירה: בודקים יישום ולא רק את הנטו',
    paragraphs: [
      'קחו את תלושי השכר הרלוונטיים והשוו אותם למסמכים שנמסרו. בדקו בנפרד את ניכוי מס ההכנסה ואת ניכויי הביטוח, ושאלו את חשבות השכר כיצד יושם כל אישור. המטרה היא להבין אם נעשה שימוש במסמך הנכון ובנתונים הנכונים, ולא להניח שכל שינוי בנטו מעיד על טעות או על חיסכון.',
      'בתשלום הכולל עמלה, תוספת או חודש עבודה חלקי, ההשוואה לתלוש אחר דורשת תשומת לב להרכב השכר. רשמו מה השתנה ברכיבים לפני שמסיקים מסקנה מהניכוי. אם יש פער לא מוסבר, צרפו לפנייה את האישור ואת התלוש ושאלו על השורה המסוימת. בקשו הסבר שניתן לבדוק מול המסמכים.',
      'בתקציב האישי עקבו גם אחר ההוצאות הנוספות הכרוכות בעבודה, כמו נסיעה או ארגון מחדש של זמנכם. לצורך הערכת הכדאיות אל תסמכו על חיבור של תוצאות ממחשבונים נפרדים שאינם מתחשבים בכל ההכנסות. בקשו בדיקה שמכירה את התמונה הכוללת ואת הנחות החישוב.',
    ],
    source: null,
  },
  {
    id: 'changes',
    title: 'הפסקת עבודה, שינוי שכר ואיסוף מסמכים לבדיקה שנתית',
    paragraphs: [
      'כאשר עבודה נוספת מסתיימת או משתנה, עדכנו קודם את מפת ההכנסות האישית. בדקו אילו הצהרות ואישורים הסתמכו על המצב הקודם ולמי צריך לפנות כדי לברר את הטיפול בהמשך. שמרו גם את המסמכים הישנים לצורך הבנת הרישומים, תוך סימון ברור של הגרסה שנמסרה אחרונה לכל גורם.',
      'לקראת בדיקת מס שנתית הכינו רשימת אישורים מכל מקורות ההכנסה. רשות המסים מפרטת בדף בקשת ההחזר את מסמכי ההכנסה הנדרשים, לרבות אישורים ממקומות עבודה ומקורות אחרים לפי העניין. יש באתר מדריך נפרד לטופס 106 שיעזור לבדוק את האישור עצמו; בדף הזה המיקוד הוא בתיאום העבודה והטיפול השוטף במקביל.',
      'עבודה אצל מעסיקים במקביל אינה הוכחה לזכאות להחזר מס. אם עולה חשד לניכוי עודף או לחסר, הכינו את התיק המלא ובקשו בדיקה אישית. הפרידו בין תיקון הנתונים המשמשים במהלך העבודה לבין בחינת תוצאת המס בהליך המתאים, ושמרו תיעוד של ההנחיה שקיבלתם לכל פעולה.',
    ],
    source: sources[4],
  },
];

const faqItems = [
  { question: 'האם תיאום מס ותיאום דמי ביטוח הם אותו הליך?', answer: 'אלו מסלולים נפרדים אצל רשות המסים ואצל הביטוח הלאומי. בדקו בכל רשות את ההנחיות המתאימות לכם ושמרו כל אישור לפי הגוף שהנפיק אותו ולפי הגורם שאליו נמסר.' },
  { question: 'האם כל עבודה נוספת מחייבת תיאום דמי ביטוח?', answer: 'אין לקבוע זאת מעצם קיומה של עבודה נוספת. הביטוח הלאומי מפנה לבדיקה לפי תנאי התיאום והנתונים האישיים. היכנסו לדף הרשמי ובדקו את המצב שלכם בלי להסתמך על ספים ממדריך ישן.' },
  { question: 'מה עושים כששכר העבודה הנוספת משתנה?', answer: 'רכזו את הנתונים החדשים ואת ההערכה המעודכנת. בדקו מול רשות המסים אם נדרש עדכון של התיאום, ובנפרד מול הביטוח הלאומי אם חל שינוי בטיפול בדמי הביטוח.' },
  { question: 'הופק אישור אבל איני מבין את הניכוי בתלוש. מה לבדוק?', answer: 'ודאו שהאישור המתאים נמסר ונקלט אצל גורם השכר. בקשו הסבר על יישומו ועל הנתונים ששימשו בתלוש, והציגו את הרכיבים שהשתנו. שינוי בנטו לבדו אינו מסביר את מקור ההפרש.' },
];

const relatedLinks = [
  { href: '/salaried/form-106', label: 'איסוף ובדיקה של אישורי השכר השנתיים' },
  { href: '/salaried/starting-new-job', label: 'קליטה מסודרת במקום העבודה הנוסף' },
  { href: '/salaried/salary-components', label: 'בירור רכיבים קבועים ומשתנים בשכר' },
  { href: '/salaried/payslip-guide', label: 'קריאת הניכויים בתלוש' },
  { href: '/personal-tax/tax-refund', label: 'הכנת נתונים לאומדן מס שנתי' },
  { href: '/personal-tax/tax-credits', label: 'בדיקה אישית של נושא נקודות הזיכוי' },
  { href: '/personal-tax/work-value', label: 'בחינת השינוי בהכנסה מעבודה' },
];

export const metadata: Metadata = {
  title: { absolute: `${TITLE} | חשבונאי` }, description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}${PAGE_PATH}` },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `${SITE_URL}${PAGE_PATH}`, type: 'article', locale: 'he_IL', siteName: 'חשבונאי', images: ['/opengraph-image'] },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION, images: ['/opengraph-image'] },
};

export default function TwoJobsPage() {
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
      <BreadcrumbSchema items={[{ name: 'דף הבית', url: '/' }, { name: 'שכירים', url: '/salaried' }, { name: 'עבודה בשתי עבודות', url: PAGE_PATH }]} />
      <article className="mx-auto max-w-3xl px-4 py-8">
        <Breadcrumbs items={[{ label: 'דף הבית', href: '/' }, { label: 'שכירים', href: '/salaried' }, { label: 'עבודה בשתי עבודות' }]} />
        <header className="my-8"><h1 className="mb-4 text-3xl font-bold text-ink md:text-4xl">{TITLE}</h1><p className="text-lg leading-relaxed text-ink/75">מדריך לעובדים אצל מעסיקים במקביל: מה להכין, מול מי לברר ואיך לעקוב אחר יישום האישורים. להיערכות כללית לפני קליטה אצל מעסיק, עברו אל <Link href="/salaried/starting-new-job" className="underline">מדריך התחלת עבודה חדשה</Link>.</p><p className="mt-3 text-sm text-ink/70">מאת אנדרי פלטונוב, רו״ח · בדיקת תוכן ומקורות: <time dateTime={UPDATED}>24.10.2026</time></p></header>
        <section aria-labelledby="quick-answer" className="mb-8 border border-gold/40 bg-cream-2 p-5"><p className="mb-2 text-sm font-bold text-gold">תשובה מהירה</p><h2 id="quick-answer" className="mb-3 text-xl font-bold text-ink">מה לבדוק כשמתחילים לעבוד במקביל?</h2><p className="leading-relaxed text-ink/80">רכזו את נתוני השכר מכל המעסיקים, מלאו הצהרות לפי ההנחיות ובדקו טיפול בתיאום מס ברשות המסים. בדקו בנפרד באתר הביטוח הלאומי אם נחוץ תיאום דמי ביטוח. לאחר מסירת האישורים, בררו את קליטתם ובדקו כיצד יושמו בתלושים. אין להסיק זכאות לתיאום או להחזר בלי בדיקה אישית.</p></section>
        <nav aria-label="תוכן עניינים" className="mb-8 border border-ink/15 p-5"><ul className="space-y-2">{sections.map((section) => <li key={section.id}><a href={`#${section.id}`} className="text-ink/80 underline">{section.title}</a></li>)}</ul></nav>
        <div className="prose prose-lg max-w-none leading-relaxed text-ink">{sections.map((section) => <section key={section.id} aria-labelledby={section.id}><h2 id={section.id}>{section.title}</h2>{section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}{section.source && <p className="text-sm">מקור רשמי: <a href={section.source.href}>{section.source.label}</a>.</p>}</section>)}</div>
        <section aria-labelledby="insurance-certificate" className="my-8 border border-ink/15 p-5"><h2 id="insurance-certificate" className="mb-3 text-xl font-bold text-ink">המשך טיפול מול הביטוח הלאומי</h2><p className="leading-relaxed text-ink/80">לאחר בדיקת הצורך בתיאום, עיינו ב<a href={sources[3].href} className="underline">הנחיות הרשמיות להפקת אישור לתיאום דמי ביטוח</a>. בדקו שם את המסלול המתאים, את המסמך למסירה ואת זהות מקבל האישור לפי המקרה שלכם.</p></section>
        <section aria-labelledby="related" className="my-10"><h2 id="related" className="mb-4 text-2xl font-bold text-ink">כלים ומדריכים לעבודה במקביל</h2><ul className="grid gap-3 sm:grid-cols-2">{relatedLinks.map((link) => <li key={link.href}><Link href={link.href} className="block border border-ink/15 p-4 text-ink underline hover:border-gold">{link.label}</Link></li>)}</ul></section>
        <section aria-labelledby="faq" className="mb-10"><h2 id="faq" className="mb-4 text-2xl font-bold text-ink">שאלות נפוצות על עבודה בשתי עבודות</h2><div className="space-y-3">{faqItems.map((item) => <details key={item.question} className="border border-ink/15 p-4"><summary className="cursor-pointer font-bold text-ink">{item.question}</summary><p className="mt-3 leading-relaxed text-ink/75">{item.answer}</p></details>)}</div></section>
        <section aria-labelledby="sources" className="mb-8"><h2 id="sources" className="mb-3 text-xl font-bold text-ink">מקורות רשמיים</h2><ul className="space-y-2">{sources.map((source) => <li key={source.href}><a href={source.href} className="text-ink/80 underline">{source.label}</a></li>)}</ul></section>
        <aside aria-label="הבהרה מקצועית" className="mb-8 border border-ink/15 bg-cream-2 p-5 text-sm leading-relaxed text-ink/75">המידע כללי ואינו ייעוץ מס או משפטי. הצורך בתיאום, מסלול הטיפול ותוצאת הניכוי תלויים בנתונים האישיים ובהוראות העדכניות של כל רשות. שאלות לגבי תנאי העסקה מקבילה או חובת דיווח יש להפנות לבעל מקצוע מתאים.</aside>
        <AuthorBox bio="רואה חשבון וסמנכ״ל כספים. באתר חשבונאי מסביר מושגים פיננסיים ומציג כלים לבדיקת נתונים אישיים מול מסמכים ומקורות רשמיים." />
      </article>
    </div>
  );
}
