import { withPageSocialMetadata } from '@/lib/config/site-info';
import type { Metadata } from 'next';
import Link from 'next/link';
import { AuthorBox } from '@/components/calculator/AuthorBox';
import { Breadcrumbs } from '@/components/calculator/Breadcrumbs';
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';

const PAGE_PATH = '/employee-rights/work-grant/couples';
const OFFICIAL_SIMULATOR = 'https://www.gov.il/he/service/check-eligibility-for-job-grant';
const OFFICIAL_APPLICATION = 'https://www.gov.il/he/service/submitting-an-online-claim-for-job-grant';
const OFFICIAL_GUIDE =
  'https://www.gov.il/BlobFolder/generalpage/income-tax-guide-knowyourright/he/Guides_IncomeTax_da-2025.pdf';

export const metadata: Metadata = withPageSocialMetadata({
  title: 'מענק עבודה לשני בני זוג עובדים: מי מגיש ומה משפיע',
  description:
    'כאשר שני בני הזוג עובדים: האם כל אחד מגיש, איך הכנסת בן הזוג משפיעה, אילו נתונים מכינים ואיך בודקים סכום ברשות המסים.',
  alternates: { canonical: PAGE_PATH },
});

const faqs = [
  {
    question: 'האם שני בני הזוג יכולים לקבל מענק עבודה?',
    answer:
      'ייתכן שכן. כל אחד נבדק כמבקש בפני עצמו וצריך לעמוד בתנאים. עם זאת, הכנסות בן או בת הזוג עשויות להפחית את הסכום של המבקש האחר.',
  },
  {
    question: 'מגישים בקשה אחת משותפת?',
    answer:
      'לא. רשות המסים מדגישה שהבקשה אישית. אם שני בני הזוג רוצים לבדוק זכאות, כל אחד בודק ומגיש עבור עצמו.',
  },
  {
    question: 'האם הכנסת בן הזוג מבטלת זכאות אוטומטית?',
    answer:
      'לא בהכרח. המדריך קובע שהכנסת בן או בת הזוג מעבודה, מעסק או ממשלח יד והכנסות נוספות עשויות להפחית את המענק בהתאם לגובהן. החישוב האישי נעשה בסימולטור ובבדיקת הרשות.',
  },
  {
    question: 'מה אם אחד שכיר והשני עצמאי?',
    answer:
      'כל אחד מוסר את סוגי ההכנסה שלו בבדיקה האישית. הכנסת העצמאי נבחנת לפי הכנסה מעסק או ממשלח יד, והכנסת השכיר לפי הכנסת עבודה; הכנסות בני הזוג עשויות להשפיע זו על זו בחישוב.',
  },
];

export default function WorkGrantCouplesPage() {
  return (
    <main className="min-h-screen bg-cream" dir="rtl">
      <BreadcrumbSchema
        items={[
          { name: 'דף הבית', url: '/' },
          { name: 'זכויות עובדים', url: '/employee-rights' },
          { name: 'מענק עבודה', url: '/employee-rights/work-grant' },
          { name: 'שני בני זוג עובדים', url: PAGE_PATH },
        ]}
      />
      <article className="mx-auto max-w-4xl px-4 py-8">
        <div className="mb-6">
          <Breadcrumbs
            items={[
              { label: 'דף הבית', href: '/' },
              { label: 'זכויות עובדים', href: '/employee-rights' },
              { label: 'מענק עבודה', href: '/employee-rights/work-grant' },
              { label: 'שני בני זוג עובדים' },
            ]}
          />
        </div>

        <header className="mb-8 border-b border-ink/15 pb-6">
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.14em] text-gold">{'// '}משק בית עובד ✦</p>
          <h1 className="mb-4 text-3xl font-bold text-ink md:text-4xl">מענק עבודה לשני בני זוג עובדים</h1>
          <p className="text-lg leading-relaxed text-ink/75">
            כאשר שני בני הזוג עובדים, כל אחד בודק זכאות ומגיש בקשה אישית. עם זאת, ההכנסה של
            בן או בת הזוג היא חלק מהחישוב ועשויה להפחית את המענק של המבקש האחר.
          </p>
          <p className="mt-4 font-mono text-xs uppercase tracking-[0.12em] text-gold">
            עודכן לאחרונה: <time dateTime="2026-10-24">24.10.2026</time>
          </p>
        </header>

        <section className="answer-box mb-10 border-r-4 border-gold bg-cream-2 p-5" aria-label="תשובה מהירה">
          <p className="leading-relaxed text-ink/85">
            <strong>שני בני זוג עובדים אינם מגישים בקשה משותפת.</strong> כל אחד צריך לבצע
            בדיקה ולהגיש בקשה על שמו. בבדיקה של כל מבקש רשות המסים מביאה בחשבון גם הכנסות
            מסוימות של בן או בת הזוג, ולכן סכום אחד אינו מעיד על הסכום של האחר. הזינו את
            הנתונים של כל אחד בנפרד ב{' '}
            <a href={OFFICIAL_SIMULATOR} className="font-bold underline" target="_blank" rel="noreferrer">
              סימולטור מענק העבודה הרשמי
            </a>.
          </p>
        </section>

        <div className="prose prose-lg max-w-none text-ink leading-relaxed">
          <h2>בקשה אישית, חישוב שמתחשב במשק הבית</h2>
          <p>
            מענק עבודה משולם לעובד, לא למשפחה כיחידה אחת. לכן כל בן זוג נבדק לפי גילו,
            הכנסתו, ילדיו ויתר התנאים החלים עליו. רשות המסים מדגישה שהבקשה אישית ולא ניתן
            להגיש אותה עבור אדם אחר. אם שני בני הזוג רוצים לקבל מענק, כל אחד צריך להשלים
            בדיקה ובקשה משלו.
          </p>
          <p>
            בצד זאת, החישוב אינו מתעלם מהמשפחה. מדריך 2025 מציין שהכנסות בן או בת הזוג
            ממשכורת, מעסק או ממשלח יד וכן הכנסות נוספות עשויות להפחית את גובה המענק. לכן
            “בקשה אישית” אינה “חישוב מבודד”. יש להכין מידע מדויק על שני הצדדים.
          </p>

          <h2>האם שניהם יכולים להיות זכאים?</h2>
          <p>
            כן, ייתכן ששני בני הזוג יהיו זכאים, כל אחד על פי נתוניו. אין כלל שלפיו אישור לאחד
            שולל אוטומטית את האחר. מנגד, גם אין כלל שלפיו זכאות של אחד מבטיחה זכאות לשני.
            הבדלים בגובה ההכנסה, בחודשי העבודה, בגיל ובסוגי ההכנסה יכולים להביא לתוצאות
            שונות בתוך אותו משק בית.
          </p>
          <p>
            כל אחד צריך לעבור את התנאים הכלליים, לרבות התנאים הנוגעים לגיל, ילדים וזכויות
            במקרקעין. הסבר מרוכז נמצא בדף <Link href="/employee-rights/work-grant/eligibility">זכאות למענק עבודה</Link>.
            דף זה אינו משכפל את התנאים, אלא מסביר את הקשר בין שתי הבקשות.
          </p>

          <h2>איזו הכנסה של בן או בת הזוג משפיעה?</h2>
          <p>
            לפי מדריך רשות המסים, הסכום עשוי לפחות כאשר לבן או בת הזוג יש הכנסה ממשכורת,
            מעסק או ממשלח יד או הכנסה נוספת. ההפחתה תלויה בגובה ההכנסות הרלוונטיות ובנוסחת
            החוק. אין סף יחיד שנכון לכל משפחה ולכל שנת מס, ולכן חיבור שתי המשכורות והשוואה
            לטבלה אקראית אינו חישוב תקף.
          </p>
          <p>
            גם הכנסות שאינן שכר עשויות להיות רלוונטיות. המדריך מגדיר “הכנסה נוספת” וכולל
            סוגי קצבאות וגמלאות מסוימים, לצד חריגים. אם קיימת הכנסה כזו, יש להזין ולדווח אותה
            בהתאם לשאלות השירות. לפירוט מנגנון הסכום ראו{' '}
            <Link href="/employee-rights/work-grant/amount">איך מחושב מענק עבודה</Link>.
          </p>

          <h2>כאשר אחד שכיר והשני עצמאי</h2>
          <p>
            השוני באופן ההעסקה אינו מונע בדיקה. השכיר מדווח על הכנסת העבודה שלו, והעצמאי
            נבדק לפי הכנסה מעסק או ממשלח יד. אצל עצמאי אין להשתמש במחזור העסק כתחליף לרווח
            המדווח. פרטים על ההגדרה והדוח השנתי נמצאים בדף{' '}
            <Link href="/employee-rights/work-grant/self-employed">מענק עבודה לעצמאים</Link>.
          </p>
          <p>
            אם אחד מבני הזוג חייב בדוח שנתי, מדריך רשות המסים מציין שהגשת הדוח היא תנאי
            תפעולי רלוונטי לטיפול. לכן גם הבקשה של בן הזוג השכיר עשויה להמתין לנתונים מן הדוח
            של העצמאי. חשוב ששני הצדדים יתאמו את שנת המס ואת הנתונים, בלי להגיש מספרים שונים
            לאותה הכנסה.
          </p>

          <h2>איזה מידע מכינים לפני שתי הבדיקות?</h2>
          <ul>
            <li>הכנסות מעבודה של כל אחד מבני הזוג בשנת הזכאות.</li>
            <li>הכנסות מעסק או ממשלח יד ומספר חודשי הפעילות בפועל.</li>
            <li>הכנסות נוספות שעשויות להיכלל לפי המדריך.</li>
            <li>מספר המעסיקים של כל אחד בשנת המס.</li>
            <li>פרטי הילדים והמצב המשפחתי באותה שנה.</li>
            <li>חשבון בנק על שם כל מבקש והדוחות שהיו חייבים בהגשה.</li>
          </ul>
          <p>
            הכינו את הנתונים פעם אחת, אך בצעו שתי בדיקות נפרדות — אחת עבור כל בן זוג. החלפת
            זהות המבקש משנה את נקודת המבט של החישוב. לאחר מכן עברו ל{' '}
            <Link href="/employee-rights/work-grant/application">מדריך הגשת בקשה</Link> עבור כל מי שתוצאתו מצביעה על אפשרות לזכאות.
          </p>

          <h2>מה קורה אחרי ההגשה?</h2>
          <p>
            כל מבקש מקבל מספר תביעה משלו וצריך לשמור אותו. אפשר לעקוב בנפרד דרך{' '}
            <Link href="/employee-rights/work-grant/status">בדיקת סטטוס מענק עבודה</Link>. ייתכן שבקשה אחת תוכרע לפני האחרת,
            במיוחד אם באחת חסר דיווח מעסיק או דוח שנתי. אין להסיק מעיכוב בבקשה אחת שגם
            הבקשה השנייה נדחתה.
          </p>
          <p>
            אם לאחר הקביעה מתברר שהכנסה של אחד מבני הזוג לא נכללה או דווחה באופן שגוי,
            רשות המסים רשאית לעדכן את הקביעה לפי ההוראות. לכן חשוב לאשר את התצהיר רק לאחר
            ששני בני הזוג בדקו שהפרטים המתייחסים אליהם מדויקים.
          </p>

          <h2>ומה לגבי הורה יחיד?</h2>
          <p>
            אדם שחי עם בן או בת זוג, לרבות ידוע או ידועה בציבור, אינו נכנס להגדרת “הורה יחיד”
            רק מפני שאינו נשוי רשמית. מדריך רשות המסים משתמש בהגדרה מהותית. אם אתם חיים
            בנפרד מההורה השני ואין לכם בן זוג, ראו את ההסבר הייעודי על{' '}
            <Link href="/employee-rights/work-grant/single-parent">מענק עבודה להורה יחיד</Link>.
          </p>

          <h2>מקורות רשמיים</h2>
          <ul>
            <li><a href={OFFICIAL_GUIDE} target="_blank" rel="noreferrer">מדריך מענק עבודה לשנת 2025 — רשות המסים</a></li>
            <li><a href={OFFICIAL_SIMULATOR} target="_blank" rel="noreferrer">בדיקת זכאות וסכום — רשות המסים</a></li>
            <li><a href={OFFICIAL_APPLICATION} target="_blank" rel="noreferrer">הגשת בקשה — רשות המסים</a></li>
          </ul>

          <h2>שאלות נפוצות לבני זוג עובדים</h2>
          {faqs.map((faq) => (
            <section key={faq.question}>
              <h3>{faq.question}</h3>
              <p>{faq.answer}</p>
            </section>
          ))}
        </div>

        <aside className="my-10 border border-amber-300 bg-amber-50 p-5 text-sm leading-relaxed text-ink/80">
          המידע כללי ואינו ייעוץ מס. אין בו קביעה כי אחד מבני הזוג או שניהם זכאים. רשות המסים
          קובעת את הזכאות והסכום לפי הדין, שנת המס והנתונים האישיים של כל מבקש ומשק הבית.
        </aside>
        <AuthorBox />
      </article>
    </main>
  );
}
