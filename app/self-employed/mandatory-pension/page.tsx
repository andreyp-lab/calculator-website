import type { Metadata } from 'next';
import Link from 'next/link';

const PENSION_GUIDE = 'https://www.gov.il/he/pages/independent-must-pension';
const DEPOSIT_REPORT = 'https://www.gov.il/he/service/pension-deposit-report';

export const metadata: Metadata = {
  title: 'פנסיה חובה לעצמאים — כללי ההפקדה ובדיקה אישית',
  description:
    'שיעורי חובת ההפקדה לפנסיה לעצמאים, מצבים הדורשים בדיקה אישית, והפניה למידע ולדיווח הרשמיים.',
  alternates: { canonical: '/self-employed/mandatory-pension' },
};

export default function MandatoryPensionPage() {
  return (
    <main dir="rtl" className="mx-auto max-w-4xl px-5 py-12 text-ink">
      <nav aria-label="פירורי לחם" className="mb-8 text-sm text-ink/60">
        <Link href="/">דף הבית</Link> / <Link href="/self-employed">עצמאים</Link> / פנסיה חובה
      </nav>

      <h1 className="mb-5 text-3xl font-bold md:text-4xl">פנסיה חובה לעצמאים</h1>
      <p className="mb-8 text-lg leading-relaxed">
        מאז 2017 חלה חובת הפקדה לחיסכון פנסיוני על עצמאים העומדים בתנאי החוק. שיעור ההפקדה הוא
        4.45% מחלק ההכנסה החייבת בהפקדה שעד מחצית השכר הממוצע במשק, ו־12.55% מהחלק שמעל מחצית
        השכר הממוצע ועד השכר הממוצע. תחולת החובה והסכום האישי תלויים בגיל, בהכנסה ובנסיבות נוספות.
      </p>

      <section className="border-r-4 border-gold bg-cream-2 p-6">
        <h2 className="mb-3 text-xl font-bold">בדקו את החובה לפי הנתונים שלכם</h2>
        <p className="mb-5 leading-relaxed">
          סכומי השכר הממוצע, תקרות הטבות המס ונתוני ההכנסה עשויים להשתנות. לפני הפקדה או החלטת מס,
          בדקו את הכללים העדכניים ואת הדוח האישי שלכם. אין לחשב קנס, החזר מס או קצבה עתידית מתוך
          שיעורי ההפקדה לבדם.
        </p>
        <a href={PENSION_GUIDE} target="_blank" rel="noopener noreferrer" className="inline-block bg-ink px-6 py-3 font-semibold text-cream hover:bg-ink-deep">
          למדריך פנסיה חובה לעצמאים של משרד האוצר ↗
        </a>
      </section>

      <section className="mt-10 space-y-4 leading-relaxed">
        <h2 className="text-2xl font-bold">מה קורה אם לא הופקד הסכום הנדרש?</h2>
        <p>
          אי־עמידה בחובת ההפקדה עלולה לגרור קנס בהתאם לתנאים שבחוק. אין בכך חוב אוטומטי לביטוח
          הלאומי בגובה כל ההפקדות החסרות ובתוספת ריבית. אם קיבלתם הודעה, בדקו את שנת המס,
          ההכנסה וההפקדות שכבר בוצעו. שירות הממשלה מאפשר לדווח למרכז לגביית קנסות על הפקדות
          לפנסיה כדי לברר את החיוב.
        </p>
        <a href={DEPOSIT_REPORT} target="_blank" rel="noopener noreferrer" className="font-semibold text-gold underline underline-offset-4">
          לדיווח על הפקדות למרכז לגביית קנסות ↗
        </a>
      </section>

      <section className="mt-10">
        <h2 className="mb-4 text-2xl font-bold">מה להכין לבדיקה?</h2>
        <ul className="list-disc space-y-3 pr-6 leading-relaxed">
          <li>הכנסה חייבת מהעסק לפי שנת המס הרלוונטית, ולא מחזור ההכנסות בלבד.</li>
          <li>אישורי ההפקדה השנתיים לקופת גמל לקצבה ודוח המס השנתי.</li>
          <li>פרטים על הכנסה כשכיר והפקדות מעסיק, אם אתם גם עובדים כשכירים.</li>
          <li>מועד תחילת הפעילות והגיל בשנת המס, לצורך בדיקת תחולת החובה.</li>
        </ul>
      </section>

      <aside className="mt-12 border border-ink/15 bg-cream-2 p-6">
        <h2 className="mb-2 text-xl font-bold">לומדים לנהל את כספי העסק</h2>
        <p className="mb-4">למי שרוצה להעמיק בתכנון העסקי והפיננסי, אפשר להכיר את הקורס לעצמאים.</p>
        <Link href="/course/self-employed" className="font-semibold text-gold underline underline-offset-4">
          לפרטי הקורס לעצמאים
        </Link>
      </aside>
    </main>
  );
}
