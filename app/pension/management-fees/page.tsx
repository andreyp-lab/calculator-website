import type { Metadata } from 'next';
import Link from 'next/link';
import { AuthorBox } from '@/components/calculator/AuthorBox';
import { Breadcrumbs } from '@/components/calculator/Breadcrumbs';
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';

const PATH = '/pension/management-fees';
const URL = `https://cheshbonai.co.il${PATH}`;
const TITLE = 'דמי ניהול בפנסיה: קריאת הדוח והשוואת הצעות';
const DESCRIPTION = 'איך בודקים דמי ניהול מהפקדה ומצבירה, משווים הצעה כתובה לדוח ומשתמשים במחשבון רשות שוק ההון. ללא דירוג קרנות, הבטחת חיסכון או המלצת מעבר.';
const sources = [
  { title: 'רשות שוק ההון — מחשבון דמי ניהול: אופן הזנת הנתונים והשוואת ההצעות', url: 'https://www.gov.il/he/service/management_fee_calculator' },
  { title: 'רשות שוק ההון — דוח שנתי ורבעוני לעמיתים ולמבוטחים: דמי ניהול והוצאות, נוסח תיקון 2020', url: 'https://www.gov.il/BlobFolder/dynamiccollectorresultitem/r_2020-9-22/he/2020-9-22.pdf' },
  { title: 'רשות שוק ההון — תוצאות ההליך הרביעי לקרנות נבחרות: דמי ניהול וחלופות המרה', url: 'https://www.gov.il/BlobFolder/dynamiccollectorresultitem/notice-2024-101/he/Results_of_the_fourth_procedure_for_determining_selected_funds_pdf.pdf' },
  { title: 'רשות שוק ההון — עדכון זכויות וחובות בקרן חדשה מקיפה: השלכות משיכת כספים, מאי 2025', url: 'https://www.gov.il/BlobFolder/dynamiccollectorresultitem/notice-2025-22/he/instructions_regarding_the_rights_and_obligations_of_members_in_the_regulations_of_a_new_pension_fund.pdf' },
];
const faqs = [
  { question: 'האם אפשר להשוות הצעות לפי אחוז יחיד?', answer: 'בדקו בנפרד דמי ניהול מההפקדות ודמי ניהול מהיתרה הצבורה, ואת התנאים החלים על החשבון. שיעור נמוך ברכיב מסוים אינו מתאר לבדו את כל העלות. אין לחבר אחוזים שחלים על בסיסי חיוב שונים.' },
  { question: 'האם תוצאת מחשבון הרשות מחליפה הצעה אישית?', answer: 'המחשבון מציג שיעורי דמי ניהול מוצעים לפי הנתונים המוזנים. שמרו את ההנחות והתוצאה, ובקשו מהגוף המנהל הצעה כתובה עם תחולה ותוקף. התוצאה אינה מסמך התנאים של החשבון ואינה אישור להתאמת מוצר.' },
  { question: 'האם כל ירידה ביתרה נובעת מדמי ניהול?', answer: 'אין לקבוע זאת ללא פירוט תנועות. דמי ניהול, עלויות ביטוח, הוצאות ותנועות כספים הם נתונים שיש לזהות בנפרד בדוח. בקשו הסבר לכל שורה לא ברורה ואל תייחסו שינוי כולל ביתרה לרכיב עלות מסוים.' },
  { question: 'האם הצעה זולה יותר מחייבת לעבור קרן?', answer: 'השוואת דמי ניהול היא בדיקה של תנאי עלות בלבד. החלטה על שינוי דורשת בחינת כיסוי, זכויות ותנאים אישיים עם בעל מקצוע מתאים. העמוד אינו ממליץ על קרן, מוצר, מסלול או העברה.' },
];

export const metadata: Metadata = {
  title: TITLE, description: DESCRIPTION, alternates: { canonical: URL },
  openGraph: { title: TITLE, description: DESCRIPTION, url: URL, type: 'article', locale: 'he_IL' },
};

export default function PensionManagementFeesPage() {
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'Article', '@id': `${URL}#article`, headline: TITLE, description: DESCRIPTION, mainEntityOfPage: URL, inLanguage: 'he-IL', datePublished: '2026-10-24', dateModified: '2026-10-24', author: { '@type': 'Person', name: 'אנדרי פלטונוב', url: 'https://cheshbonai.co.il/about' }, publisher: { '@type': 'Organization', name: 'חשבונאי', url: 'https://cheshbonai.co.il' }, citation: sources.map((source) => source.url) },
      { '@type': 'FAQPage', '@id': `${URL}#faq`, mainEntity: faqs.map((faq) => ({ '@type': 'Question', name: faq.question, acceptedAnswer: { '@type': 'Answer', text: faq.answer } })) },
    ],
  };
  return (
    <article dir="rtl" className="bg-cream">
      <BreadcrumbSchema items={[{ name: 'דף הבית', url: '/' }, { name: 'מדריך פנסיה', url: '/insurance/pension' }, { name: 'דמי ניהול בפנסיה', url: PATH }]} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }} />
      <div className="mx-auto max-w-4xl px-4 py-8">
        <Breadcrumbs items={[{ label: 'דף הבית', href: '/' }, { label: 'מדריך פנסיה', href: '/insurance/pension' }, { label: 'דמי ניהול בפנסיה' }]} />
        <header className="my-8 border-b border-ink/15 pb-6">
          <h1 className="mb-4 text-3xl font-bold text-ink md:text-4xl">{TITLE}</h1>
          <p className="text-lg text-ink/75">משווים תנאים כתובים על בסיס אותם נתונים, ואז בודקים את החיוב בפועל.</p>
          <p className="mt-4 text-sm text-ink/70">בדיקת מקורות ועדכון: <time dateTime="2026-10-24">24.10.2026</time></p>
        </header>
        <section aria-label="תשובה מהירה" className="answer-box mb-8 border-r-4 border-gold bg-cream-2 p-5">
          <h2 className="mb-2 text-xl font-bold">תשובה מהירה</h2>
          <p>לבדיקת דמי ניהול בפנסיה רשמו בנפרד את השיעור מההפקדות ואת השיעור מהצבירה, לצד הסכומים שנגבו ותנאי ההצעה. <a className="underline" href={sources[0].url}>מחשבון רשות שוק ההון</a> מסייע להשוות שיעורים מוצעים לפי הנתונים האישיים. אין לחבר את האחוזים או להסיק מאחוז יחיד מהי העלות הכוללת. אישור כתוב והדוח האישי נדרשים כדי לברר מה חל בחשבון שלכם.</p>
        </section>
        <aside aria-label="הבהרה מקצועית" className="mb-8 border border-ink/15 p-5 text-sm leading-relaxed">
          המידע כללי ואינו ייעוץ פנסיוני, השקעות, מס או משפטי. אין המלצה על מוצר, קרן או מסלול, ואין הבטחת תשואה או סכום עתידי. לא מוצגים כאן שיעורי תקרה כלליים או אומדן חיסכון אישי.
        </aside>
        <div className="prose prose-lg max-w-none leading-relaxed text-ink">
          <h2>מפרידים בין בסיסי החיוב</h2>
          <p><a href={sources[1].url}>תבניות הדיווח של רשות שוק ההון</a> מפרידות בין דמי ניהול שנגבו מההפקדות לבין דמי ניהול מהחיסכון הצבור. שיעור מהפקדה מתייחס לכספים המופקדים, בעוד ששיעור מצבירה מתייחס ליתרה. כשמקבלים הצעה, העתיקו כל רכיב לשדה נפרד ובקשו הבהרה אם לא צוין בסיסו. אין לפרש שיעורים ממוצרים שונים כאילו כולם נגבים באותו אופן.</p>
          <p>השוו גם את יחידת הזמן ואת היקף החשבון שאליו מתייחסת ההצעה. סכום שנגבה בתקופת דוח אינו זהה לשיעור המוצע להמשך, והפקדה מתקנת יכולה להתייחס לשכר מתקופה אחרת. לפני כל בדיקה מספרית צריך לדעת מהו הבסיס ומהו המועד. המדריך אינו מציע נוסחת עלות שמחליפה את מנגנון החיוב של הגוף המנהל.</p>
          <h2>אילו מסמכים מניחים לצד הדוח?</h2>
          <p>אספו את הדוח המפורט, הודעות על תנאי דמי הניהול והצעות שקיבלתם בכתב. אם התנאים נמסרו באמצעות מקום העבודה, בקשו גם את האישור המתייחס לחשבון שלכם. רשמו מתי ניתנה ההצעה, על איזה מוצר היא חלה ומה הוגדר לגבי תחילתה וסיומה. אמירה כללית בשיחה אינה מסבירה אילו תנאים נקלטו בפועל בגוף המנהל.</p>
          <p>ליד כל הצעה ציינו אם היא כוללת תנאים הקשורים למעמד החשבון או להפקדות. אל תניחו שהטבה ממשיכה ללא שינוי בעת עזיבת עבודה, ואל תניחו שהיא מתבטלת: בקשו תשובה כתובה. אם אין מסמך שמסביר את משך התנאים, השאירו את הנושא פתוח לבירור. העמוד אינו קובע תקופת הנחה אחידה לכל מוצר או חשבון.</p>
          <h2>כיצד משתמשים במחשבון הרשמי?</h2>
          <p><a href={sources[0].url}>דף השירות של הרשות</a> מסביר שההשוואה נעשית לאחר בחירת המוצר והזנת נתונים כגון מעמד תעסוקתי, גיל והיקף חיסכון או הפקדות לפי דרישות המערכת. אפשר להזין גם דמי ניהול קיימים. היכנסו דרך הקישור הרשמי ועקבו אחר השדות המוצגים כעת, בלי להעתיק נתון ממוצר אחר רק כדי להשלים שדה חסר.</p>
          <p>שמרו את תאריך הבדיקה ואת הנתונים שהזנתם. כאשר חוזרים להשוואה, השתמשו באותו בסיס או תעדו מה השתנה. אם תוצאה אינה תואמת הצעה שקיבלתם, בקשו מהגוף להסביר למי מיועדת ההצעה ובאילו תנאים. הצגת שיעור במערכת אינה קובעת את התאמת הכיסוי הביטוחי או את יתר זכויות החשבון.</p>
          <h2>מכינים ריכוז שאפשר להשוות</h2>
          <ul>
            <li>שם הגוף, שם המוצר וזיהוי החשבון או ההצעה שאליהם מתייחסים הנתונים.</li>
            <li>דמי ניהול מהפקדות ודמי ניהול מצבירה, בשדות נפרדים עם יחידות ברורות.</li>
            <li>תוקף התנאים, מועד תחילה ותנאים לשינוי, כפי שאושרו בכתב.</li>
            <li>סכומים שנגבו בדוח, לצד התקופה שעליה הם מדווחים.</li>
            <li>שאלות פתוחות לגבי עלויות נוספות או פער בין הצעה לחיוב.</li>
          </ul>
          <p>זו רשימת עבודה לארגון אישי, ולא רשימת מסמכים מחייבת של הרשות. בחרו מסמך מקור לכל שדה ושמרו אותו לצד הריכוז. כשהנתון מתעדכן, ציינו מה החליף אותו ומדוע. כך ניתן להבין אם שינוי בהשוואה נובע מהצעה חדשה, מהפקדות שונות או מטעות בהעתקה, ולא רק לראות תוצאה סופית שאין לה הסבר.</p>
          <h2>מפרידים דמי ניהול מעלויות אחרות</h2>
          <p>הוראות הדיווח כוללות מידע על עלויות ורכיבים נוספים, ובהם כיסוי ביטוחי והוצאות. אל תסכמו כל שורת ניכוי תחת הכותרת דמי ניהול. בקשו פירוט של סיווג החיוב ושל התקופה שאליה הוא שייך. את משמעות נתוני הביטוח אפשר לבדוק ב<Link href="/pension/insurance-cover">מדריך הכיסוי הביטוחי בפנסיה</Link>. השוואת עלות צריכה לשמור על משמעותו של כל רכיב.</p>
          <h2>תנאי קרנות נבחרות ושינויים בחשבון</h2>
          <p><a href={sources[2].url}>תוצאות ההליך לקרנות נבחרות</a> כוללות תנאי דמי ניהול ואפשרויות המרה בין רכיביהם. אין להסיק מהם שכל הצטרפות לכל קרן מקנה אותם תנאים. פירוט המנגנון מופיע ב<Link href="/pension/default-funds">מדריך הקרנות הנבחרות</Link>. כשמוצגת חלופה, בקשו אישור של הרכיבים והתנאים החלים עליכם; אין כאן העדפה של חלופה מסוימת.</p>
          <p>לאחר אישור שינוי בדקו בדוח הבא או באישור עדכני ממתי הוא יושם ועל איזה חשבון. אם נותר פער, פנו עם ההצעה והחיוב המדויק. <a href={sources[3].url}>עדכון הרשות ממאי 2025</a> מדגיש השלכות של משיכת כספים על קצבאות; השוואת עלויות אינה מספיקה להחלטה כזו. לבדיקת התמונה הרחבה חזרו ל<Link href="/insurance/pension">מדריך הפנסיה</Link> ופנו לבחינה מקצועית לפי הצורך.</p>
        </div>
        <section aria-labelledby="faq-title" className="my-10">
          <h2 id="faq-title" className="mb-4 text-2xl font-bold">שאלות נפוצות</h2>
          {faqs.map((faq) => <details key={faq.question} className="mb-3 border border-ink/15 bg-paper p-4"><summary className="cursor-pointer font-bold">{faq.question}</summary><p className="mt-3 leading-relaxed">{faq.answer}</p></details>)}
        </section>
        <section aria-labelledby="sources-title" className="my-10">
          <h2 id="sources-title" className="mb-4 text-2xl font-bold">מקורות רשמיים</h2>
          <ul className="list-disc space-y-3 pr-6">{sources.map((source) => <li key={source.url}><a className="underline" href={source.url} target="_blank" rel="noopener noreferrer">{source.title}</a></li>)}</ul>
          <p className="mt-4 text-sm">נבדקו ביום 24.10.2026. תנאי החשבון והדין החל דורשים בדיקה אישית; תוצאת השוואה אינה המלצת מוצר.</p>
        </section>
        <AuthorBox title="רו״ח · מידע פיננסי כללי" bio="אנדרי פלטונוב, רואה חשבון. המדריך מסייע לקריאת נתוני עלות ממקורות רשמיים ואינו ייעוץ פנסיוני. התאמת מוצר, כיסוי ותנאי פרישה דורשת בעל מקצוע מתאים." />
      </div>
    </article>
  );
}
