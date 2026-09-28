import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'פנסיה לקראת פרישה — בדיקת קצבה, דוח ומסלול',
  description:
    'מה משפיע על קצבת הפנסיה, היכן בודקים את הצבירה והמקדם האישי, ואיך בוחנים תשואות ודמי ניהול ממקור רשמי.',
  alternates: { canonical: '/insurance/pension' },
};

export default function PensionPage() {
  return (
    <main dir="rtl" className="mx-auto max-w-4xl px-5 py-12 text-ink">
      <nav aria-label="פירורי לחם" className="mb-8 text-sm text-ink/60">
        <Link href="/">דף הבית</Link> / <Link href="/insurance">ביטוחים</Link> / פנסיה
      </nav>
      <h1 className="mb-5 text-3xl font-bold md:text-4xl">איך בודקים את הפנסיה הצפויה?</h1>
      <p className="mb-8 text-lg leading-relaxed">
        הקצבה תלויה בצבירה, במסלול הפרישה, במקדם שנקבע לפי תקנון הקרן ובנתונים האישיים.
        אין מקדם המרה אחיד לכל מי שפורש באותו גיל, ולכן חלוקת היתרה במספר קבוע אינה תחזית
        מחייבת. גם תשואה עתידית, דמי ניהול ומיסוי הקצבה אינם זהים לכל חוסך.
      </p>

      <section className="border-r-4 border-gold bg-cream-2 p-6">
        <h2 className="mb-3 text-xl font-bold">התחילו מהדוח האישי של הקרן</h2>
        <p className="leading-relaxed">
          בדקו את היתרה, ההפקדות, דמי הניהול, מסלול ההשקעה, הכיסויים הביטוחיים ואת אומדן הקצבה
          שמציגה הקרן. לקראת פרישה בקשו מהגוף המנהל פירוט של מסלולי הקצבה והמקדמים לפי גיל,
          פרטי בן או בת זוג ותקופת הבטחה. האומדן עשוי להשתנות עד למועד הפרישה.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="mb-4 text-2xl font-bold">מה כדאי להשוות?</h2>
        <ul className="list-disc space-y-3 pr-6 leading-relaxed">
          <li>הצבירה וההפקדות בפועל בכל מוצר פנסיוני, ולא רק בקרן אחת.</li>
          <li>דמי ניהול מהפקדה ומצבירה, ומסלול השקעה התואם את הצרכים והסיכון שלכם.</li>
          <li>המסלול לקצבת שאירים ותקופת ההבטחה הרצויים בעת הפרישה.</li>
          <li>מיסוי הקצבה וזכאות אישית לפטור, כולל השפעה אפשרית של מענקי פרישה ומשיכות עבר.</li>
        </ul>
      </section>

      <section className="mt-10 space-y-3 leading-relaxed">
        <h2 className="text-2xl font-bold">כלים ומקורות רשמיים</h2>
        <p><a href="https://pensyanet.cma.gov.il/" target="_blank" rel="noopener noreferrer" className="text-gold underline">פנסיה נט — השוואת תשואות קרנות פנסיה ↗</a> מציגה תשואות היסטוריות, שאינן מבטיחות תשואה בעתיד.</p>
        <p><a href="https://www.gov.il/he/service/itc-request-for-fixed-rights-at-retirement-age" target="_blank" rel="noopener noreferrer" className="text-gold underline">בקשה לקיבוע זכויות ברשות המסים ↗</a> מרכזת את בדיקת הטבות המס על קצבה מזכה לפי הנתונים האישיים.</p>
        <p><a href="https://www.btl.gov.il/benefits/old_age/Pages/BdikatZacautZikna.aspx" target="_blank" rel="noopener noreferrer" className="text-gold underline">מחשבון קצבת אזרח ותיק של הביטוח הלאומי ↗</a> בודק בנפרד זכאות וסכום בהתאם למקרה.</p>
      </section>

      <div className="mt-10 flex flex-wrap gap-5">
        <Link href="/investments/retirement" className="font-semibold text-gold underline underline-offset-4">תכנון חיסכון לפרישה</Link>
        <Link href="/self-employed/mandatory-pension" className="font-semibold text-gold underline underline-offset-4">כללי פנסיה חובה לעצמאים</Link>
      </div>
    </main>
  );
}
