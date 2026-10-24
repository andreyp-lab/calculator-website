import type { Metadata } from 'next';
import Link from 'next/link';
import { AuthorBox } from '@/components/calculator/AuthorBox';
import { Breadcrumbs } from '@/components/calculator/Breadcrumbs';
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';

const PATH = '/pension/inactive-fund';
const URL = `https://cheshbonai.co.il${PATH}`;
const TITLE = "קרן פנסיה לא פעילה: איתור החשבון ובדיקת הזכויות";
const DESCRIPTION = "איך מאתרים חיסכון פנסיוני לא פעיל במנוע הרשמי, מה תוצאת החיפוש אינה מגלה ואילו מסמכים מבקשים מהגוף המנהל. ללא המלצה למשיכה או לאיחוד.";
const sources = [
  {
    "title": "רשות שוק ההון — קבלת מידע על חסכונות פנסיוניים: מנוע האיתור הרשמי ומגבלות המידע",
    "url": "https://www.gov.il/he/service/pension_savings_search"
  },
  {
    "title": "רשות שוק ההון — חוזר מתן דוח שנתי ורבעוני לעמיתים ולמבוטחים, נוסח תיקון משנת 2020",
    "url": "https://www.gov.il/BlobFolder/dynamiccollectorresultitem/r_2020-9-22/he/2020-9-22.pdf"
  },
  {
    "title": "משרד האוצר — פנסיה צוברת והבדלים בין סוגי המוצרים",
    "url": "https://www.gov.il/he/pages/cumulative-pension?chapterIndex=1"
  },
  {
    "title": "רשות שוק ההון — עדכון זכויות וחובות עמיתים בקרן חדשה מקיפה, מאי 2025; השפעות משיכה",
    "url": "https://www.gov.il/BlobFolder/dynamiccollectorresultitem/notice-2025-22/he/instructions_regarding_the_rights_and_obligations_of_members_in_the_regulations_of_a_new_pension_fund.pdf"
  },
  {
    "title": "רשות שוק ההון — מחשבון דמי ניהול של חברות ביטוח, פנסיה וגמל",
    "url": "https://www.gov.il/he/service/management_fee_calculator"
  }
];
const faqs = [
  {
    "question": "האם חיפוש חסכונות פנסיוניים בשירות הרשמי עולה כסף?",
    "answer": "לפי דף השירות של רשות שוק ההון, מנוע האיתור ניתן ללא עלות. חיפוש דרך גורם פרטי אינו זהה לשירות הממשלתי. השתמשו בקישור הרשמי וקראו את תנאי השירות לפני מסירת פרטי הזיהוי."
  },
  {
    "question": "האם תוצאת חיפוש מציגה את היתרה ואת כל הזכויות?",
    "answer": "לא. רשות שוק ההון מבהירה שהתוצאה מציגה אפשרות לקיום חשבון או פוליסה. המידע הקובע לגבי עצם קיומם, יתרות וזכויות נמצא אצל הגוף המוסדי. יש לפנות אליו לאימות ולפירוט."
  },
  {
    "question": "האם חשבון לא פעיל בהכרח חסר כיסוי ביטוחי?",
    "answer": "אין לקבוע את מצב הביטוח מכותרת החשבון או מתוצאת האיתור. בקשו מהגוף המנהל תשובה על סוג המוצר, הכיסויים ומועדיהם לפי המסמכים החלים עליו. יתרת חיסכון ומעמד ביטוחי מחייבים בדיקות נפרדות."
  },
  {
    "question": "האם מציאת קרן ישנה היא סיבה למשוך או לאחד כספים?",
    "answer": "תוצאת האיתור אינה המלצה לפעולה. לפני כל החלטה נדרשת בחינה של תנאי החשבון, זכויות, כיסוי ומס עם בעל מקצוע מתאים. המדריך אינו ממליץ על מוצר, משיכה, איחוד או השקעה."
  }
];


export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: { title: TITLE, description: DESCRIPTION, url: URL, type: 'article', locale: 'he_IL' },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION },
};

export default function InactivePensionFundPage() {
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
      <BreadcrumbSchema items={[{ name: 'דף הבית', url: '/' }, { name: 'מדריך פנסיה', url: '/insurance/pension' }, { name: "קרן פנסיה לא פעילה", url: PATH }]} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }} />
      <div className="mx-auto max-w-4xl px-4 py-8">
        <Breadcrumbs items={[{ label: 'דף הבית', href: '/' }, { label: 'מדריך פנסיה', href: '/insurance/pension' }, { label: "קרן פנסיה לא פעילה" }]} />
        <header className="my-8 border-b border-ink/15 pb-6">
          <h1 className="mb-4 text-3xl font-bold text-ink md:text-4xl">{TITLE}</h1>
          <p className="text-lg text-ink/75">מאתרים את הגוף המנהל, מאמתים את החשבון ומבררים בנפרד יתרה וכיסוי.</p>
          <p className="mt-4 text-sm text-ink/70">תאריך בדיקת מקורות: <time dateTime="2026-10-24">24.10.2026</time></p>
        </header>
        <section aria-label="תשובה מהירה" className="answer-box mb-8 border-r-4 border-gold bg-cream-2 p-5">
          <h2 className="mb-2 text-xl font-bold">תשובה מהירה</h2>
          <p>התחילו ב<a className="underline" href={sources[0].url}>מנוע הרשמי לאיתור חסכונות פנסיוניים</a> של רשות שוק ההון. השירות ניתן ללא עלות ומציג אפשרות לקיום חשבונות או פוליסות שאינם פעילים; המידע הקובע על קיומם, היתרות והזכויות נמצא אצל הגופים המנהלים. לאחר האיתור בקשו דוח ואישור פרטים לכל חשבון. עצם מציאת קרן אינה קביעה על הכיסוי הביטוחי או על אפשרות משיכת הכסף.</p>
        </section>
        <aside aria-label="הבהרה פנסיונית ומשפטית" className="mb-8 border border-ink/15 p-5 text-sm leading-relaxed">
          המידע כללי ואינו ייעוץ פנסיוני, משפטי, מס או השקעות. אין בו המלצה על מוצר, משיכה, העברה או מסלול השקעה, ואין בו קביעת זכאות אישית. היישום דורש בדיקת מסמכים עם בעל מקצוע מתאים; לא מוצג כאן אישור של יועץ פנסיוני או עורך דין.
        </aside>
        <div className="prose prose-lg max-w-none leading-relaxed text-ink">
          <h2>מה בדיוק מנסים לאתר?</h2>
          <p>לפני החיפוש רשמו את מקומות העבודה הקודמים ואת שמות הגופים שמופיעים בתלושים ובדוחות ישנים. אל תחליטו שכל מסמך מתייחס לקרן פנסיה: ייתכן שמדובר במוצר אחר. <a href={sources[2].url}>משרד האוצר מבחין בין סוגי מוצרים פנסיוניים</a> ומדגיש את הצורך בבחינת התאמה אישית. בשלב האיתור המטרה היא לדעת מי מנהל את החשבון ואיך לקבל ממנו מידע מוסמך.</p>
          <h2>נכנסים למנוע דרך דף השירות הרשמי</h2>
          <p><a href={sources[0].url}>דף השירות של רשות שוק ההון</a> מרכז את הכניסה למערכת ואת תנאי השימוש. פעלו לפי ההנחיות המופיעות בו, והזינו את פרטי הזיהוי במערכת הרשמית. השירות מיועד לאיתור חשבונות שאינם פעילים, ולכן אין להציגו כתמונה מלאה של כל החיסכון שלכם. לצורך חשבון שאתם כבר מכירים, אפשר לבקש מידע ישירות מהגוף שמנהל אותו.</p>
          <p>בסיום שמרו את תוצאת החיפוש ואת תאריך הפקתה. רשמו לאיזה גוף צריך לפנות ואיזה סוג מוצר נזכר, ככל שהמידע מוצג. אל תצרפו לתכתובת רגילה צילום של כל פרטי הזיהוי רק כדי להסביר מה מצאתם; בקשו מהגוף המנהל ערוץ הזדהות מתאים. רשימת ההכנה כאן נועדה לארגון אישי ואינה דרישת מסמכים רשמית של כל חברה.</p>
          <h2>מה התוצאה אומרת, ומה צריך לברר?</h2>
          <p>הרשות מבהירה שהמידע במנוע מבוסס על דיווחי הגופים המוסדיים, ושאימות החשבון ופרטיו נעשה אצלם. פנו לגוף שהופיע בתוצאה ובקשו אישור אם החשבון קיים על שמכם. אם שם הגוף השתנה, בקשו הבהרה על הגוף שמנהל כיום את החשבון ועל דרך קבלת הדוחות. אין להמיר תוצאת חיפוש לאומדן של סכום המגיע לתשלום.</p>
          <p>אם לא נמצאה תוצאה אך ברשותכם דוח ישן, המשיכו את הבירור באמצעות הפרטים שבו. תוצאה חסרה אינה מסבירה מה קרה לכל חשבון שהיה לכם בעבר. שאלו אם החשבון הועבר, מוזג או נסגר, ובקשו אסמכתה התואמת את מספרו. שמרו את התשובה לצד הדוח הישן, כך שניתן יהיה להבין את רצף המסמכים ולא רק את השם שמופיע כיום.</p>
          <h2>מסמכים לבקשה מהגוף המנהל</h2>
          <ul>
          <li>אישור פרטי חשבון וסוג המוצר, כולל שמו הנוכחי והגוף שמנהל אותו.</li>
          <li>דוח עדכני עם תאריך היתרה, כדי שההשוואה לא תיעשה בין מועדים שונים.</li>
          <li>פירוט ההפקדות והתנועות הדרוש לבירור התקופות שלא עקבתם אחריהן.</li>
          <li>הסבר לדמי הניהול ולעלויות המופיעות בדוח, והמסמך שעליו התנאים נשענים.</li>
          <li>תשובה נפרדת על הכיסויים הביטוחיים ועל התנאים החלים, אם קיימים כאלה במוצר.</li>
          </ul>
          <p><a href={sources[1].url}>הוראות רשות שוק ההון לדיווח לעמיתים</a> מספקות מסגרת לקריאת תנועות, יתרות ודמי ניהול. אין בעמוד קביעה שכל שדה מופיע באותה צורה בכל סוג מוצר. בקשו הסבר לשורה שאינה ברורה במקום להניח שסכום מסוים הוא הפקדה, תשואה או כסף זמין למשיכה. תאריך הדוח ומספר החשבון צריכים להישמר גם כשמעתיקים את הנתונים לרשימה אישית.</p>
          <h2>איך בודקים את ההיסטוריה בלי לספור פעמיים?</h2>
          <p>השוו את פירוט התנועות לדוחות ולתלושים שבידיכם. כאשר מופיעה העברה בין חשבונות, חפשו את המסמך מהגוף המעביר ואת המסמך מהגוף המקבל. אותה יתרה עשויה להופיע במסמכים ממועדים שונים; אין לחבר אותם כאילו מדובר בחסכונות נפרדים בלי לאמת את רצף התנועה. אם חסר הסבר, ציינו את הפער כשאלה פתוחה ולא כסכום נוסף ברשימת הנכסים.</p>
          <p>אם נראה שחסרות הפקדות ממעסיק קודם, צרפו לבירור את חודשי השכר ואת תלושי התקופה. המדריך על <Link href="/pension/mandatory-employee">פנסיה חובה לשכירים</Link> מסביר כיצד להשוות את הרכיבים. כשמדובר במעבר בין עבודות, השתמשו גם ב<Link href="/pension/job-change-continuity">מדריך הרציפות</Link> לבירור מצב הכיסוי; אין להסיק שהפקדה מתקנת לבדה פתרה כל שאלה ביטוחית.</p>
          <h2>דמי ניהול והחלטות בהמשך</h2>
          <p>לאחר אימות החשבון, אפשר להשתמש ב<a href={sources[4].url}>מחשבון דמי הניהול של הרשות</a> כדי לקבל מידע להשוואה, תוך בדיקת ההנחות והנתונים שהוזנו. תוצאת ההשוואה אינה מחליפה את התנאים הכתובים של החשבון. העמוד אינו קובע שחשבון לא פעיל מחויב בשיעור מסוים, או שדמי הניהול שלו עולים בהכרח כאשר נפסקות הפקדות.</p>
          <p><a href={sources[3].url}>עדכון הרשות ממאי 2025</a> מתייחס להשפעות משיכת כספים על קצבאות וכיסוי בקרנות חדשות מקיפות. לכן האיתור הוא שלב באיסוף מידע, והחלטה על הכסף דורשת בדיקה אישית של תנאים ומיסוי. לקראת פרישה קראו גם על <Link href="/pension/retirement-age">גיל הפרישה והקצבאות</Link>. אין כאן המלצה למשוך, לאחד, להעביר או לשנות השקעה.</p>
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
