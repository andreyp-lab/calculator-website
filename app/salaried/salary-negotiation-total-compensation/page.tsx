import type { Metadata } from 'next';
import Link from 'next/link';
import { CalculatorLayout } from '@/components/calculator/CalculatorLayout';
import { FAQSchema } from '@/components/seo/FAQSchema';

const PATH = '/salaried/salary-negotiation-total-compensation';
const SITE = 'https://cheshbonai.co.il';
const UPDATED = '2026-10-30';
const TITLE = 'השוואת הצעות שכר: טבלת החלטה והכנה למשא ומתן';
const DESCRIPTION = 'איך משווים חבילות תגמול והופכים פערים לבקשות במשא ומתן: טבלת הצעות, תנאים שדורשים הבהרה, תרחישי בונוס, זמן והוצאות עבודה.';
const SOURCE = 'https://www.gov.il/BlobFolder/generalpage/work-rights-working-conditions-notification/he/workers-rights_admission-to-work_work-rights-working-conditions-notification_Hodaa-Pirot.pdf';
const faq = [
  { question: 'האם אפשר לבחור לפי סכום חבילת התגמול השנתית?', answer: 'תחילה בדקו מה חובר לסכום: כסף קבוע, יעד בונוס, הפקדות או הטבה. בטבלת ההחלטה השאירו את הקבוצות נפרדות ובדקו את מועדי התשלום. סכום כולל לבדו אינו מתאר את הכסף שיהיה פנוי לכם בכל חודש.' },
  { question: 'מה עושים כשהמגייס אינו יכול לאשר תנאי?', answer: 'מסמנים את התנאי כפתוח ומבקשים לדעת מי מוסמך להשיב ומתי צפויה תשובה. אפשר להמשיך להשוות את הנתונים הידועים, אבל אין לבנות החלטה על הנחה שהבקשה תתקבל.' },
  { question: 'האם טופס ההודעה הרשמי הוא הסכם עבודה?', answer: 'בטופס משרד העבודה נאמר שההודעה אינה הסכם עבודה. כאן משתמשים בשדותיו כרשימת בדיקה למידע שכדאי לברר. עצם הופעת רכיב בטופס אינה מוכיחה שהוא הובטח בהצעה שלכם או קובעת את הזכויות האישיות.' },
];

export const metadata: Metadata = {
  title: TITLE, description: DESCRIPTION,
  alternates: { canonical: PATH },
  openGraph: { title: TITLE, description: DESCRIPTION, type: 'article', locale: 'he_IL', url: PATH, images: ['/opengraph-image'] },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION, images: ['/opengraph-image'] },
};

export default function SalaryNegotiationPage() {
  const article = {
    '@context': 'https://schema.org', '@type': 'Article', headline: TITLE,
    description: DESCRIPTION, inLanguage: 'he-IL', datePublished: UPDATED, dateModified: UPDATED,
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE}${PATH}` },
    author: { '@type': 'Person', name: 'אנדרי פלטונוב', url: `${SITE}/about` },
    publisher: { '@type': 'Organization', name: 'חשבונאי', url: SITE },
    image: `${SITE}/opengraph-image`, citation: [SOURCE],
  };

  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(article).replace(/</g, '\\u003c') }} />
    <FAQSchema items={faq} />
    <CalculatorLayout
      title={TITLE} description={DESCRIPTION} pageUrl={PATH} lastUpdated={UPDATED}
      breadcrumbs={[{ label: 'דף הבית', href: '/' }, { label: 'שכירים ושכר', href: '/salaried' }, { label: 'השוואת הצעות שכר' }]}
      disclaimerText="מידע כללי להכנת השוואה ומשא ומתן, שאינו ייעוץ מס, משפטי או פנסיוני. זכויות, מיסוי והפקדות תלויים בדין ובהסדר האישי; במקרה של ספק יש לבדוק את המסמכים עם בעל מקצוע מתאים."
      quickAnswer={<p>כדי להשוות הצעות שכר, הכינו טבלה על אותה תקופה ואותו היקף עבודה, הפרידו בין תנאי מתועד לנתון שעדיין פתוח, ובחרו מה חשוב לכם לבקש בשיחה. לצד הכסף רשמו זמן, הוצאות וגמישות. הטבלה צריכה להסתיים ברשימת פערים ובקשות ממוקדות. להסבר על כל רכיב בנפרד התחילו ב<Link href="/salaried/salary-components">מדריך רכיבי השכר</Link>; כאן מתמקדים בהחלטה בין הצעות ובהכנה למשא ומתן.</p>}
      content={<>
        <nav aria-label="תוכן עניינים"><ul>
          <li><a href="#same-basis">בסיס השוואה משותף</a></li>
          <li><a href="#offer-table">טבלת החלטה</a></li>
          <li><a href="#example">תרחיש להמחשה</a></li>
          <li><a href="#negotiation">הבקשה למשא ומתן</a></li>
        </ul></nav>
        <h2 id="same-basis">מיישרים את תקופת ההשוואה</h2>
        <p>רשמו בראש הטבלה את התפקיד, היקף העבודה, תאריך ההתחלה ותקופת ההשוואה שבחרתם. אם הצעה אחת מתייחסת לשנה מלאה והאחרת לחודשים הראשונים בתפקיד, הציגו זאת במפורש. מענק הצטרפות, בחינת שכר עתידית ושינוי תנאים לאחר תקופת קליטה צריכים שורות נפרדות, עם התנאים שנמסרו בפועל.</p>
        <p>בטופס <a href={SOURCE}>ההודעה הרשמי על תנאי עבודה</a> מופיעים בסיס תשלום השכר, תשלומים קבועים ושאינם קבועים, מועדי תשלום, אורך יום ושבוע העבודה ותשלומים לתנאים סוציאליים. אלו עוגנים שימושיים לבקשת מידע. השימוש בטופס כאן הוא כלי הכנה לשיחה; הוא אינו קובע שהטבה מסוימת מוצעת לכם.</p>

        <h2 id="offer-table">טבלת החלטה: מה חסר כדי לבחור?</h2>
        <p>פתחו עמודה לכל הצעה והעתיקו את הנוסח מהמסמך שקיבלתם. ליד כל נתון ציינו ״מתועד״, ״נאמר בשיחה״ או ״לבירור״. הוסיפו את השאלה שתאפשר להשוות בלי לנחש. הטבלה הבאה מציעה נושאי עבודה, ולא רשימת זכויות או חובות של מעסיק:</p>
        <div className="overflow-x-auto">
          <table>
            <caption>שדות למילוי לכל הצעה ושאלת המשך</caption>
            <thead><tr><th scope="col">נושא</th><th scope="col">מה לרשום בכל הצעה</th><th scope="col">מה לברר בשיחה</th></tr></thead>
            <tbody>
              <tr><th scope="row">תשלום קבוע</th><td>סכום, בסיס תשלום והיקף עבודה</td><td>האם הסכום כולל רכיב נוסף?</td></tr>
              <tr><th scope="row">תגמול משתנה</th><td>תנאי, מועד ותלות באישור</td><td>מה קורה אם היעד אינו מושג?</td></tr>
              <tr><th scope="row">חיסכון והטבות</th><td>ההסדר הכתוב והמידע החסר</td><td>מהו בסיס ההפקדות ומה כלול?</td></tr>
              <tr><th scope="row">זמן והוצאות</th><td>שעות, מיקום ועלויות אישיות צפויות</td><td>מה סוכם ומה תלוי במדיניות?</td></tr>
              <tr><th scope="row">תנאי מעבר</th><td>התחלה, מענק והתחייבות שנמסרה</td><td>מה משתנה בעזיבה או בדחייה?</td></tr>
            </tbody>
          </table>
        </div>
        <p>הפרידו שאלת מידע מבקשת שיפור: ״מתי הבונוס משולם?״ מבקשת הבהרה; ״האם אפשר להעביר חלק מהתגמול לשכר קבוע?״ היא בקשה לשינוי ההצעה. כך תוכלו לדעת אם השיחה סגרה פער במסמכים או שינתה את התנאים עצמם.</p>

        <h2 id="example">תרחיש להמחשה: בונוס אפשרי מול זמן פנוי</h2>
        <p>נניח שהצעה אחת כוללת יעד בונוס והגעה תכופה למשרד, ואחרת כוללת תשלום קבוע ועבודה חלקית מהבית. אין כאן דירוג של ההצעות או הנחה שהבונוס ישולם. הציגו לכל הצעה את התשלום הקבוע בנפרד, ולצדו תרחיש שבו מתקיימים תנאי התגמול המשתנה כפי שנמסרו.</p>
        <p>הוסיפו את הוצאות הנסיעה והזמן לפי המסלול האישי שלכם. אל תתנו להטבה ערך כספי רק מפני שהמעסיק הציג לה מחיר. שאלו איזו הוצאה היא באמת מחליפה ומה משמעותה עבורכם. במקרה של רכב, הפנו את בירור המס ל<Link href="/vehicles/company-car-benefit">עמוד שווי השימוש</Link>.</p>

        <h2 id="negotiation">הופכים את הפער לבקשה ממוקדת</h2>
        <p>בחרו את התנאי שישפיע ביותר על ההחלטה שלכם, ונסחו בקשה שניתן להשיב עליה. לדוגמה להמחשה: ״כדי שאוכל לתכנן הוצאות קבועות, חשוב לי להגדיל את הרכיב הקבוע. האם אפשר לעדכן אותו, ומה תהיה ההשפעה על יתר ההצעה?״ אין בנוסח הבטחה להסכמה או טענה לשכר שוק.</p>
        <ul>
          <li>הגדירו לעצמכם מה חיוני ומה גמיש לפני השיחה.</li>
          <li>אם מוצעת חלופה, רשמו מה נוסף ומה השתנה במקומו.</li>
          <li>בקשו הצעה מעודכנת בכתב וסמנו מי צריך לאשר תנאי שנותר פתוח.</li>
        </ul>
        <p>לאחר השיחה, השוו שוב את כל החבילה. שינוי בתשלום אחד אינו מספר לבדו מה השתנה בשעות, בבונוס או בהטבות. שמרו את הגרסה הקודמת לצד המעודכנת כדי שתוכלו לזהות את ההבדלים.</p>

        <h2>בדיקה אחרונה לפני תשובה להצעה</h2>
        <p>אפשר לבדוק אומדן ב<Link href="/personal-tax/salary-net-gross">מחשבון ברוטו־נטו</Link>, תוך שימוש באותם נתונים אישיים לכל הצעה. בקשו מחשבות השכר הדמיה לרכיבים שאינם מכוסים באומדן, וקראו את <Link href="/employee-rights/annual-bonus">מדריך הבונוס</Link> כשזהו פער מהותי. לאחר הבחירה, המשיכו ל<Link href="/salaried/starting-new-job">מדריך תחילת עבודה</Link> להכנת מסמכי הקליטה.</p>
      </>}
      faq={<div className="space-y-3">{faq.map((item) => <details key={item.question} className="border border-ink/15 p-4"><summary className="cursor-pointer font-bold">{item.question}</summary><p className="mt-3 leading-relaxed">{item.answer}</p></details>)}</div>}
      sources={<p><a className="underline" href={SOURCE}>משרד העבודה — דוגמה רשמית להודעה על תנאי עבודה, עמוד 1</a>. סעיפים 5–9 משמשים לבדיקת שדות ההשוואה. טבלת ההחלטה, התרחיש ונוסח הבקשה הם הצעות עבודה של המדריך.</p>}
    />
  </>;
}
