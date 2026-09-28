import type { Metadata } from 'next';
import Link from 'next/link';

const INSURANCE_RATES = 'https://www.btl.gov.il/Insurance/Rates/Pages/%D7%9C%D7%A2%D7%95%D7%91%D7%93%D7%99%D7%9D%20%D7%A9%D7%9B%D7%99%D7%A8%D7%99%D7%9D.aspx';
const LABOR_RIGHTS = 'https://www.gov.il/he/departments/ministry_of_labor';
const VACATION_LAW = 'https://www.btl.gov.il/Laws1/02_0082_000000.pdf';

export const metadata: Metadata = {
  title: 'עלות מעסיק 2026 — רכיבי העלות לבדיקה',
  description: 'מדריך לבדיקת עלות העסקת עובד: שכר, דמי ביטוח, הפרשות, הבראה ותנאים נוספים. הכינו נתוני שכר אישיים לפני אומדן.',
  alternates: { canonical: '/self-employed/employer-cost' },
};

export default function EmployerCostPage() {
  return (
    <main dir="rtl" className="mx-auto max-w-4xl px-5 py-12 text-ink">
      <nav aria-label="פירורי לחם" className="mb-8 text-sm text-ink/60"><Link href="/">דף הבית</Link> / <Link href="/self-employed">עצמאים</Link> / עלות מעסיק</nav>
      <h1 className="mb-5 text-3xl font-bold md:text-4xl">מהי העלות של העסקת עובד?</h1>
      <p className="mb-8 text-lg leading-relaxed">עלות מעסיק כוללת שכר ברוטו, חלק מעסיק בדמי ביטוח לאומי, הפרשות לפנסיה ולפיצויים, דמי הבראה, נסיעות והטבות לפי תנאי ההעסקה. הסכום משתנה לפי השכר המבוטח, גיל העובד, ותק, היקף המשרה, ענף העבודה וההסכמים החלים.</p>

      <section className="border-r-4 border-gold bg-cream-2 p-6 leading-relaxed">
        <h2 className="mb-3 text-xl font-bold">למה אין כאן סכום אוטומטי?</h2>
        <p>בגרסה הקודמת הוספנו לשכר החודשי עלות חודשית נפרדת של ימי חופשה וימי מחלה לפי הנחת ניצול קבועה. לעובד המקבל שכר חודשי, תשלום עבור ימי חופשה הוא בדרך כלל חלק מן השכר הרגיל; חיבור מלא שלו פעם נוספת מנפח את האומדן. גם היקף תשלום ימי מחלה תלוי בהיעדרות בפועל ובתנאי העובד. לכן אין להסיק משכר ברוטו לבדו תוספת אחידה או עלות ״מדויקת״.</p>
      </section>

      <section className="mt-10 space-y-5 leading-relaxed">
        <h2 className="text-2xl font-bold">נתונים שצריך להכין לתקציב העסקה</h2>
        <ul className="list-disc space-y-3 pr-6">
          <li>שכר חודשי או שעתי, היקף המשרה, תשלומים נוספים והשכר שעליו חלות ההפרשות.</li>
          <li>גיל ומעמד העובד, לצורך בחירת טור שיעורי דמי הביטוח המתאים בטבלת הביטוח הלאומי.</li>
          <li>הסדר הפנסיה והפיצויים, שיעור ההפקדה, מועד תחילת הזכאות והסכמים ענפיים החלים.</li>
          <li>וותק וזכאות לדמי הבראה, נסיעות, קרן השתלמות והטבות אחרות לפי חוזה והדין.</li>
          <li>עלות תפעולית שאינה בתלוש: ציוד, הדרכה, מקום עבודה, גיוס וכיסוי בתקופות היעדרות, לפי צורכי העסק בפועל.</li>
        </ul>
        <p>דמי חופשה, מחלה והפרשות בתקופת היעדרות דורשים טיפול שונה לפי סוג השכר והזכאות. חשבו אותם עם חשב שכר לפני הצגת אומדן ללקוח או קבלת החלטת גיוס.</p>
      </section>

      <section className="mt-10 space-y-3 leading-relaxed">
        <h2 className="text-2xl font-bold">מקורות רשמיים</h2>
        <p><a href={INSURANCE_RATES} target="_blank" rel="noopener noreferrer" className="text-gold underline">הביטוח הלאומי — שיעורי דמי ביטוח לעובדים שכירים ↗</a></p>
        <p><a href={VACATION_LAW} target="_blank" rel="noopener noreferrer" className="text-gold underline">חוק חופשה שנתית — נוסח באתר הביטוח הלאומי ↗</a></p>
        <p><a href={LABOR_RIGHTS} target="_blank" rel="noopener noreferrer" className="text-gold underline">משרד העבודה — זכויות עובדים ↗</a></p>
      </section>

      <aside className="mt-12 border border-ink/15 bg-cream-2 p-6">
        <h2 className="mb-2 text-xl font-bold">לומדים לתכנן את תקציב העסק?</h2>
        <p className="mb-4">הקורס לניהול כספים בעסק עוסק בתכנון תקציב, תזרים ובחינת החלטות כלכליות.</p>
        <Link href="/course/business" className="font-semibold text-gold underline">לפרטי הקורס</Link>
      </aside>
    </main>
  );
}
