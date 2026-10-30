import { withPageSocialMetadata } from '@/lib/config/site-info';
import type { Metadata } from 'next';
import Link from 'next/link';
import { AuthorBox } from '@/components/calculator/AuthorBox';
import { Breadcrumbs } from '@/components/calculator/Breadcrumbs';
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';

const PAGE_PATH = '/employee-rights/work-grant/single-parent';
const OFFICIAL_SIMULATOR = 'https://www.gov.il/he/service/check-eligibility-for-job-grant';
const OFFICIAL_APPLICATION = 'https://www.gov.il/he/service/submitting-an-online-claim-for-job-grant';
const OFFICIAL_GUIDE =
  'https://www.gov.il/BlobFolder/generalpage/income-tax-guide-knowyourright/he/Guides_IncomeTax_da-2025.pdf';

export const metadata: Metadata = withPageSocialMetadata({
  title: 'מענק עבודה להורה יחיד: הגדרה, סכום ובדיקה',
  description:
    'מהי הגדרת הורה יחיד במענק עבודה, איך ילדים והכנסה משפיעים, מהו מענק מוגדל ואיך בודקים ומגישים בשירות רשות המסים.',
  alternates: { canonical: PAGE_PATH },
});

const faqs = [
  {
    question: 'מי נחשב הורה יחיד לצורך מענק עבודה?',
    answer:
      'לפי מדריך רשות המסים, זהו עובד שהוא הורה לילד אחד או יותר הנמצאים אצלו וכלכלתם עליו, שחי בנפרד מההורה השני ושאין לו בן זוג, לרבות אדם אחר הידוע בציבור כבן זוגו.',
  },
  {
    question: 'האם גרוש או גרושה נחשבים אוטומטית הורה יחיד?',
    answer:
      'לא בהכרח. המצב הרשמי לבדו אינו כל ההגדרה. נבדקים מגורי הילדים, כלכלתם, חיים בנפרד מההורה השני והיעדר בן זוג או ידוע בציבור.',
  },
  {
    question: 'האם הורה יחיד מקבל סכום קבוע?',
    answer:
      'לא. ההגדרה משפיעה על טווחי ההכנסה ועל שיעור המענק, אך הסכום האישי עדיין תלוי בהכנסה, במספר הילדים, בגיל ובהכנסות נוספות.',
  },
  {
    question: 'האם ילד מתחת לגיל 3 משפיע?',
    answer:
      'ייתכן. מדריך 2025 כולל מענק נוסף להורה לפעוט בתנאים המפורטים בו. יש לבדוק את גיל הילד בשנת הזכאות ואת יתר התנאים בסימולטור ובמדריך הרשמי.',
  },
];

export default function WorkGrantSingleParentPage() {
  return (
    <main className="min-h-screen bg-cream" dir="rtl">
      <BreadcrumbSchema
        items={[
          { name: 'דף הבית', url: '/' },
          { name: 'זכויות עובדים', url: '/employee-rights' },
          { name: 'מענק עבודה', url: '/employee-rights/work-grant' },
          { name: 'הורה יחיד', url: PAGE_PATH },
        ]}
      />
      <article className="mx-auto max-w-4xl px-4 py-8">
        <div className="mb-6">
          <Breadcrumbs
            items={[
              { label: 'דף הבית', href: '/' },
              { label: 'זכויות עובדים', href: '/employee-rights' },
              { label: 'מענק עבודה', href: '/employee-rights/work-grant' },
              { label: 'הורה יחיד' },
            ]}
          />
        </div>

        <header className="mb-8 border-b border-ink/15 pb-6">
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.14em] text-gold">{'// '}משפחה חד־הורית ✦</p>
          <h1 className="mb-4 text-3xl font-bold text-ink md:text-4xl">מענק עבודה להורה יחיד</h1>
          <p className="text-lg leading-relaxed text-ink/75">
            הורה יחיד עשוי להיבדק בטווחי הכנסה רחבים יותר ולקבל מענק מוגדל, אך ההגדרה אינה
            מבוססת רק על רישום “רווק” או “גרוש”. בודקים גם את מגורי הילדים, כלכלתם וקיום בן זוג.
          </p>
          <p className="mt-4 font-mono text-xs uppercase tracking-[0.12em] text-gold">
            עודכן לאחרונה: <time dateTime="2026-10-24">24.10.2026</time>
          </p>
        </header>

        <section className="answer-box mb-10 border-r-4 border-gold bg-cream-2 p-5" aria-label="תשובה מהירה">
          <p className="leading-relaxed text-ink/85">
            <strong>לצורך מענק עבודה, הורה יחיד</strong> הוא הורה לילד אחד או יותר הנמצאים
            אצלו וכלכלתם עליו, החי בנפרד מההורה השני ושאין לו בן זוג, לרבות ידוע בציבור.
            אם ההגדרה מתקיימת, עשויים לחול טווחי הכנסה ייעודיים ומענק מוגדל; זה עדיין אינו
            אישור אוטומטי. בדקו את שנת המס והנתונים האישיים ב{' '}
            <a href={OFFICIAL_SIMULATOR} className="font-bold underline" target="_blank" rel="noreferrer">
              סימולטור רשות המסים
            </a>.
          </p>
        </section>

        <div className="prose prose-lg max-w-none text-ink leading-relaxed">
          <h2>הגדרת “הורה יחיד” היא הגדרה מהותית</h2>
          <p>
            מדריך רשות המסים לשנת 2025 משתמש בהגדרה מפורטת: עובד שהוא הורה לילד אחד או יותר
            הנמצאים אצלו וכלכלתם עליו, החי בנפרד מההורה השני ואין לו בן זוג, לרבות אדם אחר
            הידוע בציבור כבן זוגו. כל חלק במשפט חשוב. עצם היות האדם גרוש, פרוד או רווק אינו
            מוכיח לבדו שההגדרה מתקיימת.
          </p>
          <p>
            אין בדף זה ניסיון להכריע במצב משפחתי מורכב. משמורת משותפת, מגורים משתנים,
            תמיכה כלכלית או זוגיות חדשה עשויים לדרוש בדיקה פרטנית מול רשות המסים. יש למסור
            בבקשה מידע נכון לשנת הזכאות ולא להסתמך על כותרת כללית במסמך ישן.
          </p>

          <h2>איך ההגדרה משפיעה על טווח ההכנסה?</h2>
          <p>
            במדריך הרשמי מפורסמים טווחי הכנסה חודשית ממוצעת נפרדים להורה יחיד במשפחה
            חד־הורית. הטווח משתנה לפי מספר הילדים ולפי שנת הזכאות. הטווחים אינם סכום המענק:
            הם גבולות לבדיקת הזכאות. בתוך הטווח, הסכום מחושב לפי נוסחת החוק והנתונים האישיים.
          </p>
          <p>
            לכן אין להסיק שהורה יחיד שנמצא בתוך טווח כלשהו יקבל את הסכום המרבי. ההכנסה
            החודשית הממוצעת מחושבת מכלל הכנסת העבודה ו/או ההכנסה מעסק או ממשלח יד, חלקי
            חודשי העבודה והפעילות בפועל. הכנסות נוספות עשויות להפחית את המענק. לפירוט ראו{' '}
            <Link href="/employee-rights/work-grant/amount">איך מחושב סכום מענק עבודה</Link>.
          </p>

          <h2>מהו מענק מוגדל?</h2>
          <p>
            מדריך 2025 מציין שמענק מוגדל בשיעור 150% ניתן, בין היתר, ל“הורה יחיד” כהגדרתו
            ולהורה עובד לילד אחד או יותר לפי הקבוצות המפורטות בו. שיעור ההגדלה אינו אומר
            שמקבלים 150% מהסכום המרבי שמפורסם במדריך. תחילה נקבע מענק לפי הנוסחה, ולאחר מכן
            מוחלות ההוראות הרלוונטיות לקבוצה.
          </p>
          <p>
            הסכום הסופי עדיין יכול להיות מושפע מגובה ההכנסה, מספר הילדים, גיל, הכנסות נוספות
            ונתונים אחרים. הדרך הבטוחה היא להזין את נתוני השנה בסימולטור הרשמי ולא לבצע
            חישוב ידני על בסיס אחוז בלבד.
          </p>

          <h2>ילדים, גיל הילד ומענק לפעוט</h2>
          <p>
            לצורך ההגדרות הבסיסיות במדריך, ילד הוא מי שטרם מלאו לו 19 שנים במהלך שנת המס
            שבגינה נדרש המענק. יש לבחון את הגיל ביחס לשנת הזכאות, לא ביחס ליום שבו ממלאים
            את הטופס. ילד שחצה גיל מסוים לאחר סוף שנת המס עשוי עדיין להיכלל בבדיקה של אותה
            שנה, בהתאם להגדרה.
          </p>
          <p>
            מדריך 2025 כולל גם “מענק עבודה נוסף” להורה לפעוט, עבור ילד שטרם מלאו לו 3 שנים,
            בתנאים ובטווחי ההכנסה המפורטים שם. התוספת אינה ניתנת רק משום שיש פעוט; צריך
            לעמוד בדרישות ההכנסה ובשאר תנאי החוק. אם יש כמה פעוטות, המדריך מתייחס למענק עבור
            כל פעוט בהתאם לתנאים. השתמשו בסימולטור לשנת הזכאות במקום להעתיק סכום משנה אחרת.
          </p>

          <h2>מה עוד נבדק מלבד הורות יחידה?</h2>
          <p>
            הגדרת הורה יחיד אינה מבטלת את יתר התנאים. רשות המסים בודקת הכנסה, גיל, ילדים,
            זכויות במקרקעין ונתונים נוספים. מי שהוא עצמאי צריך להביא בחשבון את ההכנסה מעסק
            או ממשלח יד ואת הדיווחים לשנת המס; ראו <Link href="/employee-rights/work-grant/self-employed">מענק עבודה לעצמאים</Link>.
            התנאים הכלליים מרוכזים בדף <Link href="/employee-rights/work-grant/eligibility">זכאות למענק עבודה</Link>.
          </p>
          <p>
            חשוב במיוחד לדווח אמת על מצב הזוגיות. ההגדרה כוללת גם ידוע או ידועה בציבור,
            ולא רק נישואין רשומים. מסירת מידע שאינו נכון עלולה להשפיע על הקביעה ולהוביל
            להשבת סכומים ששולמו ביתר, נוסף להשלכות הקבועות בדין.
          </p>

          <h2>איך מגישים ועוקבים?</h2>
          <ol>
            <li>בודקים בסימולטור הרשמי את שנת המס ואת המצב המשפחתי.</li>
            <li>מרכזים נתוני הכנסה, חודשי עבודה ופרטי הילדים לשנת הזכאות.</li>
            <li>מוודאים שהמצב המדווח תואם למציאות באותה שנה.</li>
            <li>עוברים ל<Link href="/employee-rights/work-grant/application">הגשת בקשה למענק עבודה</Link> וממלאים בקשה אישית.</li>
            <li>שומרים את מספר התביעה ובודקים התקדמות דרך <Link href="/employee-rights/work-grant/status">שירות הסטטוס</Link>.</li>
          </ol>
          <p>
            הבקשה אינה מוגשת בשם הילד ואינה תביעה משותפת עם ההורה האחר. היא בקשה אישית של
            העובד. כאשר המצב המשפחתי שנוי במחלוקת או השתנה באמצע השנה, מומלץ לקבל בירור
            פרטני מרשות המסים לפני סימון תשובה שאינה ברורה.
          </p>

          <h2>מקורות רשמיים</h2>
          <ul>
            <li><a href={OFFICIAL_GUIDE} target="_blank" rel="noreferrer">מדריך מענק עבודה לשנת 2025 — רשות המסים</a></li>
            <li><a href={OFFICIAL_SIMULATOR} target="_blank" rel="noreferrer">בדיקת זכאות וסכום — רשות המסים</a></li>
            <li><a href={OFFICIAL_APPLICATION} target="_blank" rel="noreferrer">הגשת בקשה — רשות המסים</a></li>
          </ul>

          <h2>שאלות נפוצות להורה יחיד</h2>
          {faqs.map((faq) => (
            <section key={faq.question}>
              <h3>{faq.question}</h3>
              <p>{faq.answer}</p>
            </section>
          ))}
        </div>

        <aside className="my-10 border border-amber-300 bg-amber-50 p-5 text-sm leading-relaxed text-ink/80">
          המידע כללי ואינו ייעוץ מס או קביעה לגבי מעמד משפחתי. במצבים מורכבים יש לבדוק את
          העובדות מול רשות המסים או בעל מקצוע. הדין והחלטת הרשות במקרה האישי הם הקובעים.
        </aside>
        <AuthorBox />
      </article>
    </main>
  );
}
