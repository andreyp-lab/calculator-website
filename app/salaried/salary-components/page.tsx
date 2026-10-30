import type { Metadata } from 'next';
import Link from 'next/link';
import { AuthorBox } from '@/components/calculator/AuthorBox';
import { Breadcrumbs } from '@/components/calculator/Breadcrumbs';
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';

const SITE_URL = 'https://cheshbonai.co.il';
const PAGE_PATH = '/salaried/salary-components';
const UPDATED = '2026-10-24';
const TITLE = 'רכיבי שכר: בסיס, תוספות, שווי ושכר לפנסיה';
const DESCRIPTION = 'מה כוללים רכיבי השכר ואיך משווים הצעות עבודה? מדריך לשכר בסיס, בונוסים, החזרי הוצאות, שווי רכב והשכר להפקדות, עם שאלות מעשיות לחשבות השכר ומקורות רשמיים.';

const sources = [
  { label: 'משרד העבודה: שכר עבודה והסדרים החלים על השכר', href: 'https://www.gov.il/he/pages/labor-wage?chapterIndex=4' },
  { label: 'משרד העבודה: דוגמה רשמית להודעה על תנאי עבודה (PDF)', href: 'https://www.gov.il/BlobFolder/generalpage/work-rights-working-conditions-notification/he/workers-rights_admission-to-work_work-rights-working-conditions-notification_Hodaa-Pirot.pdf' },
  { label: 'רשות המסים: מחשבון לקביעת שווי שימוש ברכב', href: 'https://www.gov.il/he/service/itc-mm_usecar10' },
  { label: 'משרד האוצר: הסבר על פנסיה צוברת', href: 'https://www.gov.il/he/pages/cumulative-pension?chapterIndex=1' },
];

const sections = [
  {
    id: 'base',
    title: 'שכר בסיס: מתחילים ממה שסוכם בכתב',
    paragraphs: [
      'לפני שמשווים את הסכום הבולט בהצעת העבודה, מבררים מה הוא מייצג. האם מדובר בשכר בסיס, בשכר הכולל תוספות, או בתיאור של עלות ההעסקה? בקשו מסמך שמפריד בין הרכיבים ומציין את בסיס התשלום ואת היקף העבודה שאליו הוא מתייחס. כך אפשר להבין אם הצעות שנראות דומות אכן מבטיחות אותו תשלום עבור אותה עבודה.',
      'שכר חודשי ושכר לפי שעות דורשים שאלות שונות. בשכר חודשי כדאי לברר כיצד מוצג חודש עבודה חלקי; בשכר שעתי חשוב להבין כיצד מדווחים ומאשרים את שעות העבודה. בכל מקרה, שמרו את ההצעה וההסכם לצד פירוט השכר. השוואה בין מסמכים יעילה יותר מהסתמכות על ניסוח שנאמר בשיחת גיוס.',
      'משרד העבודה מציין שהשכר נקבע גם על רקע הדין וההסדרים החלים על ההעסקה. לכן המסמך האישי הוא נקודת פתיחה לבדיקה, ואינו מספיק לבדו לקביעת מלוא הזכויות. כאשר יש מחלוקת על רכיב או על הסדר ענפי, בקשו הסבר כתוב והפנו את המסמכים לבדיקה מקצועית.',
    ],
    source: sources[0],
  },
  {
    id: 'variable',
    title: 'תוספות, עמלות ובונוסים: מפרידים בין הבטחה לתרחיש',
    paragraphs: [
      'לצורך תכנון אישי, הפרידו בין תשלום שהוגדר באופן ברור לבין תשלום שתלוי בתוצאה, באישור או בביצוע עבודה נוספת. בתוכנית עמלות שאלו מהי הפעולה המזכה לפי ההסכם, מאין מגיעים הנתונים, מי מאשר אותם וכיצד מטפלים בביטול עסקה. אלו שאלות לבירור ההצעה המסוימת שלכם, ולא רשימת תנאי זכאות אחידה.',
      'בבונוס בקשו להבין האם המסמך מתאר יעד, התחייבות או שיקול דעת. הגדירו לעצמכם תרחיש שכר מובטח ותרחיש שכר אפשרי, ואל תבנו הוצאות קבועות על רכיב שטרם התברר. אם מוצג שכר הכולל שעות נוספות, בקשו פירוט נפרד של הרכיב והסבר לאופן הרישום וההתחשבנות בפועל.',
      'אפשר להיעזר בדוגמת ההודעה הרשמית על תנאי עבודה כדי להכין את השאלות לשיחה: היא מפרידה בין סוגי תשלומים ומאפשרת לתאר רכיבים קבועים ומשתנים. אין להסיק מעצם הופעתו של שם רכיב במסמך שהוא משולם לכל עובד. חפשו את המקור והנוסח שמתייחסים לתפקיד ולמעסיק שלכם.',
    ],
    source: sources[1],
  },
  {
    id: 'expenses',
    title: 'החזרי הוצאות: בודקים גם את ההוצאה שמולם',
    paragraphs: [
      'החזר הוצאות ותוספת שכר עשויים להופיע בסמיכות, אך לצורך השוואת הצעות כדאי לבדוק אותם בנפרד. אם העבודה מחייבת הוצאה שהמעסיק מציע להשיב, שאלו מה נדרש לתיעוד, מי מאשר את ההחזר והיכן הוא יופיע. הסכום שמתקבל אינו מספר את כל הסיפור בלי להבין איזו הוצאה שילמתם כדי לקבלו.',
      'אל תקבעו את הטיפול במס או בהפקדות מתוך הכותרת בלבד. מילים כמו נסיעות, אחזקת רכב או טלפון אינן תחליף לבדיקת ההסדר המסוים. בקשו מחשבות השכר לתאר כיצד הרכיב מטופל ולצרף את הבסיס המקצועי לכך. אם אינכם מקבלים תשובה ברורה, השאירו את ההשפעה על הנטו ועל החיסכון כשאלה פתוחה.',
      'לניהול ההוצאות שלכם שמרו בקשות החזר ואישורים לצד התלוש המתאים. אם חסר תשלום, אפשר אז להציג פנייה ממוקדת: מה אושר, באיזה מסמך, ומה מופיע ברישום השכר. הבדיקה הזאת עוסקת במסמכים שלכם ואינה מניחה סכום החזר, פטור או מועד תשלום אחידים.',
    ],
    source: null,
  },
  {
    id: 'benefits',
    title: 'שווי הטבה: מדוע הטבה ושכר בכסף דורשים השוואה אחרת',
    paragraphs: [
      'בהצעה הכוללת רכב צמוד, בקשו להפריד בין התועלת האישית של הרכב לבין זקיפת שווי השימוש לצורכי מס. רשות המסים מפעילה מחשבון רשמי לקביעת שווי שימוש ברכב לפי פרטי הרכב. את הנתון הרלוונטי בודקים שם; אין צורך להעתיק לכאן שיעור או סכום שעלולים שלא להתאים לרכב ולהוראות העדכניות.',
      'לצורך החלטה בקשו הדמיית תלוש שמציגה מה משולם בכסף, מה נזקף כהטבה ואילו ניכויים חושבו. לצד ההדמיה רשמו את ההוצאות האישיות שההטבה עשויה להחליף, לפי השימוש הצפוי שלכם. אם מציעים הטבה אחרת, בקשו הסבר ייעודי לטיפול בה במקום להחיל עליה את כללי הרכב.',
    ],
    source: sources[2],
  },
  {
    id: 'pension',
    title: 'השכר להפקדות: שאלה נפרדת מהברוטו המוצג',
    paragraphs: [
      'במדריך משרד האוצר מוסבר שפנסיה צוברת היא חיסכון לקצבה שאליו מופקדים כספים לאורך תקופת העבודה. כשמשווים חבילות שכר, בקשו לדעת מאיזה בסיס שכר מחושבות ההפקדות בכל הצעה, ולא רק מה שמו של המוצר הפנסיוני. שאלו אילו רכיבים נכללים בחישוב ומהו המסמך שעליו נשענת התשובה.',
      'בדקו בנפרד את חלק העובד, את תשלומי המעסיק ואת הרישומים בקופה. אין כאן קביעה של שיעורי הפקדה או של רכיבים שנכללים תמיד בשכר הקובע: הדבר דורש בדיקת ההסדר החל. כשיש בונוסים, שינוי היקף עבודה או רכיב בעל שם לא ברור, בקשו התייחסות מפורשת גם אליהם.',
      'הכינו טבלת עבודה אישית ובה שם הרכיב, התנאי לתשלום לפי המסמכים, אופן הצגתו בתלוש והתשובה שקיבלתם לגבי ההפקדות. טבלה כזאת חושפת מה עדיין לא הוסבר, ומאפשרת להעביר שאלה מסודרת לבעל רישיון מתאים בלי להסתמך על הנחות לגבי עובד אחר.',
    ],
    source: sources[3],
  },
  {
    id: 'compare',
    title: 'איך הופכים את הפירוט להשוואת הצעות מועילה',
    paragraphs: [
      'רכזו בכל הצעה את השכר המובטח, הרכיבים המשתנים, ההטבות, ההוצאות הנדרשות וההפקדות. ליד כל נתון כתבו אם הוא מופיע במסמך או עדיין דורש הבהרה. אל תחברו יחד רכיב כספי, יעד עמלות ועלות שהמעסיק נושא בה ותציגו את הסכום כתשלום שתוכלו להוציא בחשבון הבנק.',
      'לאחר שיש פירוט אפשר לבקש הדמיות על אותן הנחות אישיות. השוואה של תוצאות שהוכנו בהנחות שונות עלולה להטעות גם כשהחישוב עצמו תקין. ציינו לכל הדמיה אילו רכיבים נכללו, האם הונח ביצוע של עבודה נוספת ואילו פרטים אישיים נלקחו בחשבון. המחשבון הוא כלי עזר להבנת ההצעה ולא אישור לנכונות ההסכם.',
      'כשתתקבל המשכורת, חזרו לטבלה ובדקו אם שמות הרכיבים וההסברים תואמים למה שסוכם. אם יש פער, שאלו עליו במונחים של רכיב ומסמך: איזה רכיב חסר, מה מקורו ומהו אופן התיקון המוצע. כך שיחת השכר מתמקדת בנושא שניתן לברר במקום באי הבנה כללית לגבי הברוטו.',
    ],
    source: null,
  },
];

const faqItems = [
  { question: 'האם שכר בסיס וברוטו הם אותו דבר?', answer: 'אין להניח זאת מתוך הכותרת בהצעה. בקשו פירוט שמראה מהו שכר הבסיס, אילו תוספות נכללו ומהו הסכום המשולם בכסף. בדקו את הניסוח מול ההסכם ופירוט השכר שלכם.' },
  { question: 'האם כל רכיב שכר נכלל בהפקדות לפנסיה?', answer: 'לא קובעים זאת לפי שם הרכיב בלבד. בקשו מחשבות השכר פירוט של בסיס ההפקדות וההסדר שעליו הוא נשען, ובמקרה של ספק פנו לבדיקה מקצועית של המסמכים.' },
  { question: 'איך בודקים שווי שימוש ברכב בלי לנחש סכום?', answer: 'נכנסים למחשבון הרשמי של רשות המסים לקביעת שווי שימוש ברכב ובודקים את פרטי הרכב. לאחר מכן מבקשים הדמיית שכר שמפרידה בין תשלום בכסף לזקיפת השווי.' },
  { question: 'מה לבקש כשמציעים שכר הכולל בונוס?', answer: 'בקשו מסמך שמפרט את מנגנון הבונוס ואת הנתונים שעליהם הוא מבוסס. לצורך התקציב האישי הציגו בנפרד את השכר שהובטח ואת התשלום שתלוי בהתקיימות התנאים שבהסכם.' },
];

const relatedLinks = [
  { href: '/salaried/salary-negotiation-total-compensation', label: 'השוואת חבילות שכר לפני קבלת הצעה' },
  { href: '/salaried/payslip-guide', label: 'קריאת תלוש משכורת לפי חלקיו' },
  { href: '/personal-tax/salary-net-gross', label: 'מחשבון שכר ברוטו ונטו' },
  { href: '/employee-rights/overtime', label: 'בדיקת רכיב שעות נוספות' },
  { href: '/insurance/pension', label: 'מדריך לבדיקת החיסכון הפנסיוני' },
  { href: '/vehicles/company-car-benefit', label: 'בדיקת הטבת רכב צמוד' },
  { href: '/salaried/starting-new-job', label: 'הכנת מסמכים לקליטה לעבודה חדשה' },
  { href: '/salaried/form-106', label: 'בדיקת סיכום השכר בטופס 106' },
];

export const metadata: Metadata = {
  title: { absolute: `${TITLE} | חשבונאי` },
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}${PAGE_PATH}` },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `${SITE_URL}${PAGE_PATH}`, type: 'article', locale: 'he_IL', siteName: 'חשבונאי', images: ['/opengraph-image'] },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION, images: ['/opengraph-image'] },
};

export default function SalaryComponentsPage() {
  const articleSchema = {
    '@context': 'https://schema.org', '@type': 'Article', headline: TITLE, description: DESCRIPTION,
    inLanguage: 'he-IL', datePublished: UPDATED, dateModified: UPDATED,
    author: { '@type': 'Person', name: 'אנדרי פלטונוב', jobTitle: 'רואה חשבון' },
    publisher: { '@type': 'Organization', name: 'חשבונאי', url: SITE_URL },
    image: `${SITE_URL}/opengraph-image`,
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE_URL}${PAGE_PATH}` },
    citation: sources.map((source) => source.href),
  };
  const faqSchema = {
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: faqItems.map((item) => ({ '@type': 'Question', name: item.question, acceptedAnswer: { '@type': 'Answer', text: item.answer } })),
  };

  return (
    <div className="min-h-screen bg-paper" dir="rtl">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema).replace(/</g, '\\u003c') }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema).replace(/</g, '\\u003c') }} />
      <BreadcrumbSchema items={[{ name: 'דף הבית', url: '/' }, { name: 'שכירים', url: '/salaried' }, { name: 'רכיבי שכר', url: PAGE_PATH }]} />
      <article className="mx-auto max-w-3xl px-4 py-8">
        <Breadcrumbs items={[{ label: 'דף הבית', href: '/' }, { label: 'שכירים', href: '/salaried' }, { label: 'רכיבי שכר' }]} />
        <header className="my-8">
          <h1 className="mb-4 text-3xl font-bold text-ink md:text-4xl">{TITLE}</h1>
          <p className="text-lg leading-relaxed text-ink/75">מדריך להבנת חבילת השכר ולהשוואת הצעות עבודה לפי הרכיבים שהן כוללות. לקריאה לפי סדר השורות בתלוש עצמו, עברו אל <Link href="/salaried/payslip-guide" className="underline">מדריך קריאת התלוש</Link>.</p>
          <p className="mt-3 text-sm text-ink/70">מאת אנדרי פלטונוב, רו״ח · בדיקת תוכן ומקורות: <time dateTime={UPDATED}>24.10.2026</time></p>
        </header>
        <section aria-labelledby="quick-answer" className="mb-8 border border-gold/40 bg-cream-2 p-5">
          <p className="mb-2 text-sm font-bold text-gold">תשובה מהירה</p>
          <h2 id="quick-answer" className="mb-3 text-xl font-bold text-ink">מה צריך לבדוק ברכיבי השכר?</h2>
          <p className="leading-relaxed text-ink/80">בקשו פירוט שמפריד בין שכר בסיס, תוספות משתנות, החזרי הוצאות והטבות. בררו מה משולם בכסף ומהו בסיס ההפקדות לפנסיה לפי ההסדר שלכם. השוו הצעות על אותן הנחות, והעבירו רכיב לא ברור לבירור לפני שמסתמכים עליו בתקציב האישי.</p>
        </section>
        <nav aria-label="תוכן עניינים" className="mb-8 border border-ink/15 p-5">
          <ul className="space-y-2">{sections.map((section) => <li key={section.id}><a href={`#${section.id}`} className="text-ink/80 underline">{section.title}</a></li>)}</ul>
        </nav>
        <div className="prose prose-lg max-w-none leading-relaxed text-ink">
          {sections.map((section) => (
            <section key={section.id} aria-labelledby={section.id}>
              <h2 id={section.id}>{section.title}</h2>
              {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              {section.source && <p className="text-sm">מקור רשמי: <a href={section.source.href}>{section.source.label}</a>.</p>}
            </section>
          ))}
        </div>
        <section aria-labelledby="related" className="my-10">
          <h2 id="related" className="mb-4 text-2xl font-bold text-ink">כלים להמשך בדיקת חבילת השכר</h2>
          <ul className="grid gap-3 sm:grid-cols-2">{relatedLinks.map((link) => <li key={link.href}><Link href={link.href} className="block border border-ink/15 p-4 text-ink underline hover:border-gold">{link.label}</Link></li>)}</ul>
        </section>
        <section aria-labelledby="faq" className="mb-10">
          <h2 id="faq" className="mb-4 text-2xl font-bold text-ink">שאלות נפוצות על רכיבי שכר</h2>
          <div className="space-y-3">{faqItems.map((item) => <details key={item.question} className="border border-ink/15 p-4"><summary className="cursor-pointer font-bold text-ink">{item.question}</summary><p className="mt-3 leading-relaxed text-ink/75">{item.answer}</p></details>)}</div>
        </section>
        <section aria-labelledby="sources" className="mb-8">
          <h2 id="sources" className="mb-3 text-xl font-bold text-ink">מקורות רשמיים</h2>
          <ul className="space-y-2">{sources.map((source) => <li key={source.href}><a href={source.href} className="text-ink/80 underline">{source.label}</a></li>)}</ul>
        </section>
        <aside className="mb-8 border border-ink/15 bg-cream-2 p-5 text-sm leading-relaxed text-ink/75" aria-label="הבהרה מקצועית">המידע כללי ואינו ייעוץ מס, משפטי או פנסיוני. סיווג רכיבי שכר והזכויות הנלוות להם דורשים בדיקת המסמכים, הדין וההסדר האישי. אין להסיק מהמדריך סכום נטו או זכאות; במקרה של ספק פנו לחשבות השכר ולבעל מקצוע מתאים.</aside>
        <AuthorBox bio="רואה חשבון וסמנכ״ל כספים. באתר חשבונאי מסביר מושגים פיננסיים ומציג כלים לבדיקת נתונים אישיים מול מסמכים ומקורות רשמיים." />
      </article>
    </div>
  );
}
