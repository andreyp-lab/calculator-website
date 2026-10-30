import type { Metadata } from 'next';
import Link from 'next/link';
import { AuthorBox } from '@/components/calculator/AuthorBox';
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';

const title = 'קרן השתלמות לשכיר: הפקדות, תקרת מס ובדיקת התלוש';
const description = 'מדריך לשכיר לבדיקת קרן השתלמות: בסיס ההפקדה, חלק העובד והמעסיק, תקרת המשכורת ב־2026 והתאמה בין התלוש לרישומי הקרן.';
const pageUrl = 'https://cheshbonai.co.il/savings/education-fund-employee';
const checkedAt = '2026-10-30';
const quickAnswer = 'בקרן השתלמות לשכיר יש להפריד בין תנאי ההפקדה שסוכמו בעבודה לבין תנאי הטבת המס. לשנת 2026 רשות המסים מפרסמת תקרת משכורת קובעת שנתית של 188,544 ש״ח. התקרה אינה סכום ההפקדה ואינה קובעת זכאות אישית לקרן. בדקו את בסיס השכר, את חלק העובד והמעסיק ואת הסכומים שנקלטו בפועל בחשבון הקרן, לפני הסקת מסקנה על ההטבה או על כסף שניתן למשוך.';
const sources = [
  { url: 'https://www.gov.il/BlobFolder/generalpage/income-tax-monthly-deductions-booklet/he/generalInformation_income-tax-monthly-deductions-booklet_monthly-deductions-booklet-2026.pdf#page=12', label: 'רשות המסים — לוח הניכויים לשנת 2026, פרק ג׳, עמוד 12' },
  { url: 'https://www.gov.il/BlobFolder/policy/state-budget-main-2026/he/state-budget_2026_Files_state-budget-main-2026-file.pdf#page=200', label: 'משרד האוצר — עיקרי התקציב 2026, קרנות השתלמות, עמוד 200' },
  { url: 'https://www.gov.il/BlobFolder/dynamiccollectorresultitem/review-15102025/he/reviews-and-publishes_review-15102025.pdf#page=4', label: 'משרד האוצר, אגף הכלכלן הראשי — סקירת קרנות השתלמות, עמודים 4–5' },
  { url: 'https://gemelnet.cma.gov.il/views/dafMakdim_Link1.aspx', label: 'רשות שוק ההון — הסבר הנתונים במערכת גמל נט' },
];
const sections = [
  {
    heading: 'מתחילים מההסדר במקום העבודה',
    source: 2,
    paragraphs: [
      'סקירת משרד האוצר מתארת קרן השתלמות כהטבה נלווית לשכר המופעלת במסגרת יחסי העבודה, ומבהירה שהיא אינה נגישה לכל העובדים. לכן אל תסיקו מהתקרה לצורכי מס שהמעסיק התחייב להפקיד עבורכם. בקשו ממשאבי אנוש או מחשבות השכר את המסמך שמסדיר את הקרן אצלכם ואת ההסבר כיצד הוא חל על ההעסקה שלכם.',
      'סמנו במסמך את מועד תחילת ההפקדות, בסיס השכר והשיעור של כל צד. אם הבטחה בהצעת העבודה אינה מופיעה במסמך שקיבלתם, בקשו הבהרה בכתב. שמרו יחד את ההסכם ואת התשובה, כדי שהבדיקה הבאה תתייחס לאותו הסדר.',
    ],
  },
  {
    heading: 'בסיס השכר ותקרת המס עונים על שאלות שונות',
    source: 0,
    paragraphs: [
      'בלוח רשות המסים ל־2026 מופיעה משכורת קובעת להפרשות לקרן השתלמות בסך 188,544 ש״ח לשנה, בהפניה לסעיף 3(ה). מדובר בתקרת משכורת לצורך הוראות המס, ולא בסכום שנתי שמופקד לקרן. אל תחליפו בין תקרת השכר, בסיס ההפקדה שמופיע בתלוש וסכום ההפקדה שנקלט בחיסכון.',
      'בקשו מחשבות השכר להצביע על בסיס ההפקדה שלכם ולפרט אילו רכיבים נכללו בו. אם השכר השתנה במהלך השנה, אספו את התלושים הרלוונטיים ואת פירוט השינוי. בקשו הסבר לאופן יישום התקרה ולכל חיוב מס שנרשם.',
    ],
  },
  {
    heading: 'מה משמעות חלק המעסיק וחלק העובד?',
    source: 1,
    paragraphs: [
      'בהסבר משרד האוצר לשנת 2026, מסגרת הטבת המס לשכיר שאינו עובד הוראה מתייחסת להפקדת מעסיק שאינה עולה על 7.5% מהמשכורת הקובעת, בכפוף לתקרה ולתנאים. ההסבר מציין השתתפות עובד השווה לשליש מהפקדת המעסיק, המשולמת מהנטו ללא הטבת מס בעת ההפקדה. המספרים מתארים את מסגרת ההטבה; אין בהם קביעה שזהו הסדר ההעסקה שלכם.',
      'אותו מקור מגדיר את המשכורת הקובעת לצורך זה כהכנסת עבודה ללא החזר הוצאות וללא שכר שעות נוספות. כאשר סכום בתלוש אינו ברור, שאלו אם ההבדל קשור לבסיס ההפקדה, לשיעור שסוכם או לטיפול במס. לעובדי הוראה יש הסדרים ייחודיים, ולכן נדרש בירור מתאים למעמדם.',
    ],
  },
  {
    heading: 'משווים את התלוש לרישומי הקרן, לפי חודש שכר',
    source: null,
    paragraphs: [
      'הכינו טבלת עבודה ובה חודש השכר, בסיס ההפקדה המופיע בתלוש, ניכוי העובד, חלק המעסיק והסכום המופיע ברישומי הקרן. העתיקו כל נתון מהמסמך שממנו נלקח, והשאירו תא ריק אם הוא חסר. ציינו בנפרד את תאריך ההפקדה ואת חודש השכר שאליו היא מתייחסת, כדי שההשוואה לא תתבסס רק על סדר התנועות בחשבון.',
      'אם מצאתם פער, פנו לחשבות השכר עם התלוש ועם פירוט הקרן ובקשו התאמה לפי חודש. שאלו האם קיימים תיקון, דיווח חסר או סכום שטרם זוהה, ובקשו אסמכתה לתשובה. ההשוואה היא דרך לאתר נושא לבירור; היא אינה קובעת בעצמה שהייתה הפרה. טענה משפטית על אי־הפקדה מצריכה בדיקה אצל איש מקצוע מתאים.',
    ],
  },
  {
    heading: 'מפרידים הטבה בהפקדה ממס בעת משיכה',
    source: 1,
    paragraphs: [
      'משרד האוצר מבחין בין ההטבה בעת הפקדת המעסיק לבין הפטור על רווחים שמקורם בהפקדות עד התקרה, בכפוף למועדי המשיכה הקבועים בדין. לכן המילים קרן השתלמות אינן מספיקות כדי לקבוע שכל יתרת החשבון פטורה ממס. בקשו מהגוף המנהל הסבר נפרד לגבי כספים שעליהם חלה הטבה ולגבי כספים אחרים, ככל שקיימים בחשבון.',
      'לפני משיכה בקשו מסמך עם מועד הנזילות שנרשם בקרן, התנאים לפעולה ופירוט הניכוי הצפוי. אם המטרה היא תשלום במועד מסוים, בררו גם את הליך הבקשה לפני התחייבות שמסתמכת על הכסף. אין בעמוד שיעור מס אישי, אישור פטור או חישוב של משיכה מוקדמת; את אלה יש לברר לפי נתוני החשבון והנסיבות.',
    ],
  },
  {
    heading: 'נזילות אינה הוראה למשוך את החיסכון',
    source: 2,
    paragraphs: [
      'סקירת משרד האוצר מתארת אפשרות משיכה לכל מטרה לאחר שש שנות ותק, בכפוף לתנאי הדין, ומציינת חריגים. אין להחליף את מועד הנזילות הרשום בחשבון בספירה עצמאית של שנים מאז תחילת העבודה. לפני פעולה בקשו מהקרן לאשר את המועד ואת תחולת התנאים על הכספים המבוקשים.',
      'לאחר בירור המועד, הגדירו מה הפעולה אמורה לפתור: הוצאה מתוכננת, שינוי בתזרים או שאלה על המשך החיסכון. לפגישה המקצועית הביאו גם פירוט תשלומים מתוכננים, כדי שהדיון בנזילות יתייחס למועד שבו נדרש הכסף בפועל.',
    ],
  },
  {
    heading: 'נתוני השוואה כלליים אינם הדוח האישי שלכם',
    source: 3,
    paragraphs: [
      'בהסבר גמל נט של רשות שוק ההון מתוארות טבלאות השוואה הכוללות תשואות לתקופה שנבחרה, נכסים ודמי ניהול. כשנעזרים במערכת רשמו את סוג הקופה, המסלול ותקופת ההשוואה. הנתונים נועדו לבדיקה ולהשוואה; את ההפקדות בחשבון שלכם ואת התנאים שנמסרו לכם בדקו במסמכים האישיים של הגוף המנהל.',
      'אם אתם גם עצמאים, הביאו לפגישה המקצועית את מסמכי שני המעמדות. סמנו בכל אישור לאיזה חשבון הוא שייך ובקשו לבדוק את ההפקדות העצמאיות בנפרד. רשימת מסמכים משותפת תאפשר להציג את התמונה המלאה בלי לערבב בין החשבונות.',
    ],
  },
];
const faqItems = [
  { question: 'האם תקרת 188,544 ש״ח היא סכום ההפקדה ב־2026?', answer: 'לא. בלוח רשות המסים זהו סכום המשכורת הקובעת השנתית להפרשות לקרן השתלמות לפי סעיף 3(ה), ולא סכום הכסף שמופקד לקרן.' },
  { question: 'האם מסגרת הטבת המס מבטיחה לי קרן מהמעסיק?', answer: 'לא ניתן להסיק ממנה זכאות אישית. יש לברר את ההסדר החל בעבודה; סקירת משרד האוצר מבהירה שהטבה זו אינה נגישה לכל העובדים.' },
  { question: 'האם היתרה בדוח היא הסכום שאקבל במשיכה?', answer: 'אין לקבוע זאת מהיתרה בלבד. בקשו מהגוף המנהל את תנאי המשיכה ואת פירוט ניכוי המס הצפוי לגבי הכספים המבוקשים.' },
];
const relatedLinks = [
  ['/savings', 'מרכז חיסכון ומשפחה'],
  ['/salaried/payslip-guide', 'הבנת השורות בתלוש השכר'],
  ['/salaried/starting-new-job', 'קליטה בעבודה חדשה והכנת המסמכים'],
  ['/compare/keren-hishtalmut-vs-pikadon', 'קרן השתלמות מול פיקדון: מס ונזילות'],
  ['/blog/study-fund-self-employed-strategy', 'בירור נפרד לקרן השתלמות במעמד עצמאי'],
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

export default function EducationFundEmployeePage() {
  return (
    <main dir="rtl" className="mx-auto max-w-4xl px-5 py-12 text-ink">
      <BreadcrumbSchema items={[{ name: 'דף הבית', url: '/' }, { name: 'חיסכון ומשפחה', url: '/savings' }, { name: title, url: pageUrl }]} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([articleSchema, faqSchema]).replace(/</g, '\\u003c') }} />
      <nav aria-label="פירורי לחם" className="mb-8 text-sm text-ink/70"><Link href="/" className="underline">דף הבית</Link>{' / '}<Link href="/savings" className="underline">חיסכון ומשפחה</Link>{' / '}<span aria-current="page">קרן השתלמות לשכיר</span></nav>
      <article className="space-y-8">
        <header><h1 className="font-serif text-3xl leading-tight md:text-4xl">{title}</h1><p className="mt-4 text-sm text-ink/70">מאת מערכת חשבונאי · נבדק ועודכן: <time dateTime={checkedAt}>30.10.2026</time></p></header>
        <section aria-labelledby="quick-answer" className="border border-gold/40 bg-paper p-6"><h2 id="quick-answer" className="mb-3 text-xl font-bold">תשובה מהירה</h2><p className="leading-8">{quickAnswer}</p><a href={sources[0].url} className="text-gold underline" target="_blank" rel="noopener noreferrer">מקור לתקרה: רשות המסים — לוח 2026</a></section>
        <aside aria-label="הבהרה מקצועית" className="border-r-4 border-gold bg-paper p-5 leading-8">המידע כללי בלבד ואינו ייעוץ מס, משפטי, פנסיוני או השקעות. לפני החלטה נדרשת התייעצות עם איש מקצוע בעל רישיון מתאים לנושא ולנסיבות. אין כאן המלצה על קרן, חברה או מסלול, ואין הבטחת תשואה.</aside>
        {sections.map((section, index) => <section key={section.heading} aria-labelledby={`section-${index}`} className="space-y-4"><h2 id={`section-${index}`} className="text-2xl font-bold">{section.heading}</h2>{section.paragraphs.map((paragraph) => <p key={paragraph} className="leading-8">{paragraph}</p>)}{section.source !== null ? <p className="text-sm leading-7"><a href={sources[section.source].url} className="text-gold underline" target="_blank" rel="noopener noreferrer">{sources[section.source].label}</a></p> : null}</section>)}
        <section aria-labelledby="faq" className="space-y-5"><h2 id="faq" className="text-2xl font-bold">שאלות נפוצות</h2>{faqItems.map((item) => <div key={item.question}><h3 className="mb-2 text-lg font-bold">{item.question}</h3><p className="leading-8">{item.answer}</p></div>)}</section>
        <section aria-labelledby="sources" className="border border-ink/15 p-6"><h2 id="sources" className="mb-3 text-2xl font-bold">מקורות רשמיים</h2><p className="mb-4 leading-8">נבדק ועודכן ב־30.10.2026. תקרת השכר ומסגרת המס מיוחסות לפרסומי 2026. הסקירה מ־2025 משמשת להסבר מבנה המוצר בלבד; סכומיה ההיסטוריים אינם מוצגים כתקרות השנה. הצעות התאמת המסמכים הן של מערכת האתר.</p><ul className="list-inside list-disc space-y-3 leading-7">{sources.map((source) => <li key={source.url}><a href={source.url} className="text-gold underline" target="_blank" rel="noopener noreferrer">{source.label}</a></li>)}</ul></section>
        <section aria-labelledby="related"><h2 id="related" className="mb-4 text-2xl font-bold">מדריכים להמשך הבדיקה</h2><ul className="grid gap-3 sm:grid-cols-2">{relatedLinks.map(([href, label]) => <li key={href}><Link href={href} className="text-gold underline">{label}</Link></li>)}</ul></section>
        <p className="text-sm leading-7 text-ink/70">אחריות התוכן: מערכת חשבונאי. פרטי בעל האתר להלן; אין בהצגתם אישור לבדיקה אישית של תלוש, חבות מס או התאמת השקעה.</p>
        <AuthorBox bio="רואה חשבון וסמנכ״ל כספים. פרטי בעל האתר ותחומי עיסוקו מופיעים בדף האודות." />
      </article>
    </main>
  );
}
