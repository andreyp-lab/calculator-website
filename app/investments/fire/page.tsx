import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'FIRE ופרישה מוקדמת — איך בוחנים תוכנית אישית',
  description: 'בדיקת הוצאות, מקורות הכנסה וסיכונים בתכנון פרישה מוקדמת, עם הפניות למקורות רשמיים בישראל.',
  alternates: { canonical: '/investments/fire' },
};

export default function FirePage() {
  return (
    <main dir="rtl" className="mx-auto max-w-4xl px-5 py-12 text-ink">
      <nav aria-label="פירורי לחם" className="mb-8 text-sm text-ink/60">
        <Link href="/">דף הבית</Link> / <Link href="/investments">השקעות</Link> / FIRE
      </nav>
      <h1 className="mb-5 text-3xl font-bold md:text-4xl">FIRE: תכנון פרישה מוקדמת</h1>
      <p className="mb-8 text-lg leading-relaxed">
        FIRE הוא רעיון של חיסכון והשקעה כדי להקטין את התלות בהכנסה מעבודה. חישוב שמכפיל
        הוצאה שנתית במספר קבוע הוא תרגיל ראשוני בלבד: הוא אינו מבטיח שתיק השקעות יממן
        עשרות שנות פרישה. תשואות עתידיות, רצף ירידות, מסים, הוצאות וזכאות לקצבאות אינם ידועים מראש.
      </p>
      <section className="border-r-4 border-gold bg-cream-2 p-6">
        <h2 className="mb-3 text-xl font-bold">מה להכין לפני החלטה על פרישה?</h2>
        <ul className="list-disc space-y-3 pr-6 leading-relaxed">
          <li>תקציב הוצאות אישי הכולל דיור, בריאות, תלויים ושינויי צרכים לאורך השנים.</li>
          <li>פירוט חסכונות נזילים מול נכסים פנסיוניים, ותנאי משיכה ומיסוי לכל מוצר.</li>
          <li>קצבאות והכנסות אחרות לפי זכאות אישית ומועדי תחילה, ולא לפי גיל משוער אחיד.</li>
          <li>תרחישים של תשואה נמוכה, אינפלציה גבוהה, תקופת פרישה ארוכה והוצאות בלתי צפויות.</li>
          <li>השפעת הפסקת העבודה על הפקדות, כיסויים ביטוחיים ודמי ביטוח.</li>
        </ul>
      </section>
      <section className="mt-10 space-y-4 leading-relaxed">
        <h2 className="text-2xl font-bold">איך להשתמש בתרחיש משיכה?</h2>
        <p>
          בחרו הוצאות והכנסות אישיות, ובחנו כמה מסלולי תשואה ואינפלציה. בדקו גם מצב שבו
          הירידות מגיעות בתחילת תקופת המשיכות. שיעור משיכה שנראה אפשרי בתרחיש אחד אינו
          שיעור בטוח לכל תיק או תקופת חיים. הימנעו מהסתמכות על מחיר נכס, שכר דירה או
          הטבת מס משוערים בלי מסמכים והצעות פרטניים.
        </p>
      </section>
      <section className="mt-10 space-y-3 leading-relaxed">
        <h2 className="text-2xl font-bold">בדיקות רשמיות</h2>
        <p><a href="https://haotzarsheli.mof.gov.il/Calculators/Pages/Pension-Fund-Report-Popup.aspx" target="_blank" rel="noopener noreferrer" className="text-gold underline">קריאת דוח הפנסיה ↗</a> מסייעת למצוא את אומדן הקצבה והצבירה האישיים.</p>
        <p><a href="https://www.btl.gov.il/benefits/old_age/Pages/RetirementCalculation.aspx" target="_blank" rel="noopener noreferrer" className="text-gold underline">מחשבון גיל פרישה של ביטוח לאומי ↗</a> בודק את הגיל לפי תאריך הלידה.</p>
        <p><a href="https://www.btl.gov.il/benefits/old_age/Pages/BdikatZacautZikna.aspx" target="_blank" rel="noopener noreferrer" className="text-gold underline">בדיקת קצבת אזרח ותיק ↗</a> מאפשרת לבחון זכאות וסכום משוער לפי הנתונים.</p>
      </section>
      <div className="mt-10 flex flex-wrap gap-5">
        <Link href="/investments/retirement" className="font-semibold text-gold underline underline-offset-4">מדריך תכנון פרישה</Link>
        <Link href="/insurance/pension" className="font-semibold text-gold underline underline-offset-4">בדיקת הפנסיה הצפויה</Link>
      </div>
    </main>
  );
}
