import type { Metadata } from 'next';
import Link from 'next/link';
import { AuthorBox } from '@/components/calculator/AuthorBox';
import { Breadcrumbs } from '@/components/calculator/Breadcrumbs';
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';

const PATH = '/pension/retirement-age';
const URL = `https://cheshbonai.co.il${PATH}`;
const TITLE = "גיל פרישה בישראל: טבלת נשים והבדלים בין קצבאות";
const DESCRIPTION = "גיל הפרישה לפי תאריך לידה, גיל פרישת חובה וגיל הזכאות לקצבת אזרח ותיק. טבלת הביטוח הלאומי והפרדה בין עבודה, פנסיה ומס.";
const sources = [
  {
    "title": "הביטוח הלאומי — גיל הפרישה וטבלת תאריכי הלידה לנשים",
    "url": "https://www.btl.gov.il/benefits/old_age/Conditions_of_eligibility/gilMezake/Pages/gilPrisha.aspx"
  },
  {
    "title": "הביטוח הלאומי — מבחן הכנסות וגיל הזכאות לקצבת אזרח ותיק",
    "url": "https://www.btl.gov.il/benefits/old_age/Conditions_of_eligibility/Pages/%D7%94%D7%9B%D7%A0%D7%A1%D7%95%D7%AA%20%D7%91%D7%92%D7%99%D7%9C%20%D7%94%D7%A4%D7%A8%D7%99%D7%A9%D7%94.aspx"
  },
  {
    "title": "משרד העבודה — גיל פרישת חובה והמשך העסקה",
    "url": "https://www.gov.il/he/pages/retirement-age?chapterIndex=2"
  },
  {
    "title": "משרד האוצר — פנסיה צוברת והבדלים בין מוצרים פנסיוניים",
    "url": "https://www.gov.il/he/pages/cumulative-pension?chapterIndex=1"
  },
  {
    "title": "רשות המסים — טופס הבקשה לקיבוע זכויות והגדרת גיל הזכאות לצורכי הפטור",
    "url": "https://www.gov.il/BlobFolder/service/itc-request-for-fixed-rights-at-retirement-age/ar/Service_Pages_Purchase_and_Excise_tax_161D-ACC.pdf"
  }
];
const faqs = [
  {
    "question": "מהו גיל הפרישה לגברים?",
    "answer": "לפי דף גיל הפרישה של הביטוח הלאומי, גיל הפרישה לגברים הוא 67. בדיקת קצבת אזרח ותיק בגיל זה כוללת גם את יתר תנאי הזכאות ואת מבחן ההכנסות הרלוונטי. הגיל אינו לבדו אישור לקבלת קצבה מהחיסכון הפנסיוני."
  },
  {
    "question": "האם כל אישה פורשת באותו גיל?",
    "answer": "לא. הביטוח הלאומי מפרסם טבלה לפי תאריך לידה. לנשים שנולדו משנת 1960 יש מדרגות העלאה, ולילידות ינואר 1970 ואילך מופיע גיל 65. יש לאתר את השורה האישית ולא להשתמש בגיל של עמיתה לעבודה."
  },
  {
    "question": "מה משתנה בגיל 70 בקצבת אזרח ותיק?",
    "answer": "לפי הביטוח הלאומי, בגיל הזכאות קצבת אזרח ותיק משולמת בלי מבחן הכנסות. עדיין יש לבדוק את יתר תנאי הקצבה ואת הליך התביעה. הכלל הזה אינו קובע פטור ממס או מועד לקבלת פנסיה מהקרן."
  },
  {
    "question": "האם גיל הפרישה קובע אוטומטית את מועד הפנסיה והפטור ממס?",
    "answer": "לא. את מועד הקצבה מהחיסכון בודקים מול הגוף המנהל, ואת תנאי הפטור מול רשות המסים. יש לאסוף מסמכי פרישה וקצבאות ולבחון את המקרה האישי לפני בחירת מועד או מסלול."
  }
];
const retirementRows = [
  ['1960', '62 שנים ו־4 חודשים'],
  ['1961', '62 שנים ו־8 חודשים'],
  ['1962', '63 שנים'],
  ['1963', '63 שנים ו־3 חודשים'],
  ['1964', '63 שנים ו־6 חודשים'],
  ['1965', '63 שנים ו־9 חודשים'],
  ['1966', '64 שנים'],
  ['1967', '64 שנים ו־3 חודשים'],
  ['1968', '64 שנים ו־6 חודשים'],
  ['1969', '64 שנים ו־9 חודשים'],
  ['ינואר 1970 ואילך', '65 שנים'],
];

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: { images: ['/opengraph-image'], title: TITLE, description: DESCRIPTION, url: URL, type: 'article', locale: 'he_IL' },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION },
};

export default function RetirementAgePage() {
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article', '@id': `${URL}#article`,
        headline: TITLE, description: DESCRIPTION, mainEntityOfPage: URL,
        inLanguage: 'he-IL', datePublished: '2026-10-24', dateModified: '2026-10-24',
        author: { '@type': 'Person', name: 'אנדרי פלטונוב', url: 'https://cheshbonai.co.il/about' },
        publisher: { '@type': 'Organization', name: 'חשבונאי', url: 'https://cheshbonai.co.il' },
        citation: sources.map((source) => source.url),
      },
      {
        '@type': 'FAQPage', '@id': `${URL}#faq`,
        mainEntity: faqs.map((faq) => ({
          '@type': 'Question', name: faq.question,
          acceptedAnswer: { '@type': 'Answer', text: faq.answer },
        })),
      },
    ],
  };
  return (
    <article dir="rtl" className="bg-cream">
      <BreadcrumbSchema items={[{ name: 'דף הבית', url: '/' }, { name: 'מדריך פנסיה', url: '/insurance/pension' }, { name: "גיל פרישה", url: PATH }]} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }} />
      <div className="mx-auto max-w-4xl px-4 py-8">
        <Breadcrumbs items={[{ label: 'דף הבית', href: '/' }, { label: 'מדריך פנסיה', href: '/insurance/pension' }, { label: "גיל פרישה" }]} />
        <header className="my-8 border-b border-ink/15 pb-6">
          <h1 className="mb-4 text-3xl font-bold text-ink md:text-4xl">{TITLE}</h1>
          <p className="text-lg text-ink/75">בודקים איזה גיל רלוונטי לכל שאלה, לפני שקובעים תאריך סיום עבודה.</p>
          <p className="mt-4 text-sm text-ink/70">תאריך בדיקת מקורות: <time dateTime="2026-10-24">24.10.2026</time></p>
        </header>
        <section aria-label="תשובה מהירה" className="answer-box mb-8 border-r-4 border-gold bg-cream-2 p-5">
          <h2 className="mb-2 text-xl font-bold">תשובה מהירה</h2>
          <p>לפי <a className="underline" href={sources[0].url}>הביטוח הלאומי</a>, גיל הפרישה לגברים הוא 67 ולנשים הוא נקבע לפי תאריך הלידה. בנפרד, <a className="underline" href={sources[2].url}>גיל פרישת החובה הכללי</a> הוא 67 לגבר ולאישה, בכפוף לדין החל ולחריגים. <a className="underline" href={sources[1].url}>גיל הזכאות לקצבת אזרח ותיק בלי מבחן הכנסות</a> הוא 70. אלה מושגים שונים, ואינם מחליפים בדיקת תנאי הפנסיה מהמוצר האישי או תנאי הפטור ממס.</p>
        </section>
        <aside aria-label="הבהרה פנסיונית ומשפטית" className="mb-8 border border-ink/15 p-5 text-sm leading-relaxed">
          המידע כללי ואינו ייעוץ פנסיוני, משפטי, מס או השקעות. אין בו המלצה על מוצר, משיכה, העברה או מסלול השקעה, ואין בו קביעת זכאות אישית. היישום דורש בדיקת מסמכים עם בעל מקצוע מתאים; לא מוצג כאן אישור של יועץ פנסיוני או עורך דין.
        </aside>
        <div className="prose prose-lg max-w-none leading-relaxed text-ink">
          <h2>מתחילים בשאלה, ולא רק בתאריך</h2>
          <p>כאשר שואלים ״מתי אני יוצא לפנסיה״, צריך לברר אם השאלה עוסקת בסיום עבודה, בקצבת אזרח ותיק, בקצבה מהקרן או במיסוי. הכינו רשימה נפרדת של כל אחד מהנושאים ושל הגוף שמוסמך להשיב עליו. תאריך שמתאים למערכת אחת אינו מוכיח שכל שאר התשלומים מתחילים באותו יום. העמוד מרכז את ההבחנות ואת מקורות הבדיקה, ואינו קובע תאריך פרישה אישי.</p>
          <p>בקשו מהביטוח הלאומי בדיקת זכאות, מהגוף הפנסיוני פירוט אפשרויות קצבה, ומהמעסיק מסמכי סיום העסקה. לצורך מס, אספו גם מידע על מענקי פרישה וקצבאות קודמות. כך ניתן לזהות פער בין הפסקת שכר לתחילת הכנסה אחרת.</p>
          <h2>גיל הפרישה לנשים לפי תאריך לידה</h2>
          <p>הטבלה הבאה מרכזת את השורות לילידות משנת 1960 מתוך <a href={sources[0].url}>הטבלה הרשמית של הביטוח הלאומי</a>, כפי שנבדקה ביום 24.10.2026. לכל שנת לידה בטבלה, למעט השורה האחרונה, הכוונה לינואר עד דצמבר של אותה שנה. לתאריכי לידה מוקדמים יותר יש לעיין בטבלה המלאה שבמקור. אין לקרוא את שנת הלידה כשנת הפרישה.</p>
          <div className="overflow-x-auto">
          <table>
          <caption>גיל הפרישה לנשים ילידות 1960 ואילך — מקור: הביטוח הלאומי; בדיקה 24.10.2026</caption>
          <thead><tr><th scope="col">שנת לידה</th><th scope="col">גיל פרישה</th></tr></thead>
          <tbody>{retirementRows.map(([birth, age]) => <tr key={birth}><th scope="row">{birth}</th><td>{age}</td></tr>)}</tbody>
          </table>
          </div>
          <p>לבדיקה אישית השתמשו בתאריך הלידה המלא ובכלי הבדיקה שאליו מפנה הביטוח הלאומי. טעות בהעתקת חודש או שנה משנה את נקודת המוצא. שמרו את התוצאה ואת תאריך הבדיקה, ואמתו אותם שוב כשמתקרבים למועד הבקשה. הטבלה מציגה גיל; היא אינה קובעת מה יהיה סכום הקצבה, מועד ההפקדה הראשון או אילו מסמכים יידרשו במקרה שלכם.</p>
          <h2>קצבת אזרח ותיק ומבחן הכנסות</h2>
          <p><a href={sources[1].url}>הביטוח הלאומי מבחין בין גיל הפרישה לגיל הזכאות</a>: ככלל, בתקופה שביניהם הזכאות נבחנת לפי הכנסות, ואילו בגיל הזכאות אין מבחן הכנסות. בדף הרשמי מצוין חריג למי שקיבל קצבת נכות כללית עד גיל הפרישה ועובר לקצבת אזרח ותיק — לגביו אין מבחן הכנסות כבר בגיל הפרישה. הכנסה מפנסיה אינה מובאת בחשבון במבחן המתואר שם. מכאן אין להסיק פטור ממס או פטור ממבחנים של תשלום אחר.</p>
          <p>לפנייה אישית הכינו פירוט של ההכנסות ושל מקורותיהן, ושאלו אילו נתונים נדרשים למסלול שלכם. בעמוד לא מועתקות תקרות הכנסה או נוסחאות לקצבה חלקית. אם ממשיכים לעבוד, בקשו בדיקה שמשקפת את העבודה בפועל ואת השינויים הצפויים. עמידה בגיל היא רק רכיב בבירור; צריך לבדוק גם את יתר תנאי הזכאות ואת אופן הגשת התביעה.</p>
          <h2>גיל פרישת חובה וסיום העסקה</h2>
          <p><a href={sources[2].url}>מדריך משרד העבודה</a> מגדיר גיל פרישת חובה כגיל שבו ניתן לחייב עובד לפרוש בשל גילו. הוא מציין גם אפשרות להסכם הקובע גיל גבוה יותר, ואת הצורך לשקול בקשת עובד להמשיך לעבוד לפי הפסיקה. בדיקה אישית של סיום העסקה מחייבת בירור של הדין, ההסכמים והחריגים החלים על העובד והמעסיק.</p>
          <p>הפרידו בין הודעת המעסיק על סיום עבודה לבין תשובה מהקרן על קצבה. אם המסמכים מציגים מועדים שונים, בקשו הסבר לפני קביעת תאריך סופי. שאלות על הליך הפרישה או על המשך העסקה מצריכות בדיקה משפטית. את יתר רכיבי החשבון אפשר למפות בעמודי <Link href="/employee-rights/notice-period">הודעה מוקדמת</Link> ו<Link href="/employee-rights/severance">פיצויי פיטורים</Link>, בלי להסיק מהם זכאות אוטומטית.</p>
          <h2>הקצבה מהחיסכון הפנסיוני</h2>
          <p><a href={sources[3].url}>משרד האוצר מסביר שפנסיה צוברת מבוססת על חיסכון במוצר פנסיוני</a>, ושקיימים הבדלים בין המוצרים. בקשו מהגוף המנהל פירוט כתוב של תנאי הקצבה ושל הנתונים שעליהם מבוסס האומדן האישי. לא מוצג כאן גיל אחיד לתחילת קצבה בכל מוצר, מקדם קבוע או הבטחה לסכום. ב<Link href="/insurance/pension">מדריך בדיקת הפנסיה</Link> מפורטים המסמכים שכדאי לרכז.</p>
          <h2>גיל זכאות לצורכי מס הוא בירור נוסף</h2>
          <p><a href={sources[4].url}>טופס רשות המסים לקיבוע זכויות</a> כולל הגדרת גיל זכאות לצורכי הפטור, המתייחסת לגיל הפרישה ולמועד תחילת קצבה מזכה. אין לזהות אותה עם הכותרת ״גיל זכאות״ בביטוח הלאומי. לצורך בירור מס, הציגו את מסמכי המעסיקים, הקצבאות ומענקי העבר לבעל מקצוע מתאים. העמוד אינו ממליץ על משיכה, היוון או בחירת מסלול, ואינו מחשב פטור אישי.</p>
        </div>
        <section aria-labelledby="faq-title" className="my-10">
          <h2 id="faq-title" className="mb-4 text-2xl font-bold">שאלות נפוצות</h2>
          {faqs.map((faq) => (
            <details key={faq.question} className="mb-3 border border-ink/15 bg-paper p-4">
              <summary className="cursor-pointer font-bold">{faq.question}</summary>
              <p className="mt-3 leading-relaxed">{faq.answer}</p>
            </details>
          ))}
        </section>
        <section aria-labelledby="sources-title" className="my-10">
          <h2 id="sources-title" className="mb-4 text-2xl font-bold">מקורות רשמיים</h2>
          <ul className="list-disc space-y-3 pr-6">
            {sources.map((source) => (
              <li key={source.url}><a className="underline" href={source.url} target="_blank" rel="noopener noreferrer">{source.title}</a></li>
            ))}
          </ul>
          <p className="mt-4 text-sm">נבדקו ביום 24.10.2026. הדין ותנאי ההסדר האישי גוברים על הסבר כללי; תאריך הבדיקה אינו אישור לזכאות.</p>
        </section>
        <AuthorBox title="רו״ח · מידע פיננסי כללי" bio="אנדרי פלטונוב, רואה חשבון. המדריך מרכז מידע ממקורות רשמיים ואינו חוות דעת משפטית או ייעוץ פנסיוני. בחינת הזכאות, הכיסוי והמיסוי דורשת בעל מקצוע מתאים לפי העניין." />
      </div>
    </article>
  );
}
