import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'תכנון פרישה — מקורות הכנסה, הוצאות וקצבאות',
  description: 'מדריך למיפוי הכנסה והוצאות לקראת פרישה עם הפניות לדוח הפנסיוני, ביטוח לאומי ורשות המסים.',
  alternates: { canonical: '/investments/retirement' },
};

export default function RetirementPage() {
  return (
    <main dir="rtl" className="mx-auto max-w-4xl px-5 py-12 text-ink">
      <nav aria-label="פירורי לחם" className="mb-8 text-sm text-ink/60">
        <Link href="/">דף הבית</Link> / <Link href="/investments">השקעות</Link> / תכנון פרישה
      </nav>
      <h1 className="mb-5 text-3xl font-bold md:text-4xl">איך בונים תמונה כלכלית לקראת פרישה?</h1>
      <p className="mb-8 text-lg leading-relaxed">
        סכום החיסכון הדרוש תלוי בהוצאות, בקצבאות שתקבלו בפועל, בגיל הפרישה, במס,
        בתקופת הפרישה ובסיכון של ההשקעות. כלל משיכה קבוע או תשואה משוערת אינם יכולים
        לקבוע לבדם אם החיסכון יספיק. התחילו מנתונים אישיים ועדכנו את התכנון מדי פעם.
      </p>
      <section className="border-r-4 border-gold bg-cream-2 p-6">
        <h2 className="mb-3 text-xl font-bold">ארבעה נתונים שכדאי לאסוף</h2>
        <ol className="list-decimal space-y-3 pr-6 leading-relaxed">
          <li>הוצאות חודשיות צפויות בפרישה, כולל דיור, בריאות והוצאות חד פעמיות.</li>
          <li>אומדן קצבה אישי בדוחות של כל קרנות הפנסיה ומוצרי החיסכון.</li>
          <li>זכאות צפויה לקצבת אזרח ותיק לפי גיל, הכנסות ותנאי הביטוח הלאומי.</li>
          <li>חסכונות נזילים, התחייבויות, הכנסות נוספות ושיעורי מס אישיים.</li>
        </ol>
      </section>
      <section className="mt-10 space-y-4 leading-relaxed">
        <h2 className="text-2xl font-bold">איך בודקים את הפער?</h2>
        <p>
          השוו בין ההוצאות הצפויות לבין הקצבאות וההכנסות שמגובות בנתונים אישיים. בחנו מה
          יקרה אם ההוצאות יעלו, אם התשואה תהיה נמוכה מהצפוי או אם הפרישה תימשך יותר זמן.
          גם סדר השנים של תשואה חיובית ושלילית עשוי להשפיע על תיק שממנו מושכים כסף.
        </p>
        <p>
          בדקו את גיל הפרישה האישי: הוא תלוי במין ובתאריך הלידה, וקצבת אזרח ותיק בגיל
          הפרישה עשויה להיות כפופה למבחן הכנסות. לפני משיכת פיצויים או היוון קצבה בדקו
          את ההשפעה על הקצבה ועל הטבות המס עם בעל מקצוע מתאים.
        </p>
      </section>
      <section className="mt-10 space-y-3 leading-relaxed">
        <h2 className="text-2xl font-bold">מקורות לבדיקה אישית</h2>
        <p><a href="https://haotzarsheli.mof.gov.il/Calculators/Pages/Pension-Fund-Report-Popup.aspx" target="_blank" rel="noopener noreferrer" className="text-gold underline">מדריך משרד האוצר לקריאת דוח הפנסיה ↗</a> מציג את שדות הקצבה בדוח האישי.</p>
        <p><a href="https://www.btl.gov.il/benefits/old_age/Pages/RetirementCalculation.aspx" target="_blank" rel="noopener noreferrer" className="text-gold underline">מחשבון גיל פרישה של הביטוח הלאומי ↗</a> מאפשר לבדוק גיל לפי תאריך לידה.</p>
        <p><a href="https://www.btl.gov.il/benefits/old_age/Pages/BdikatZacautZikna.aspx" target="_blank" rel="noopener noreferrer" className="text-gold underline">מחשבון קצבת אזרח ותיק ↗</a> מיועד לבדיקת זכאות וסכום משוער.</p>
        <p><a href="https://www.gov.il/he/service/itc-request-for-fixed-rights-at-retirement-age" target="_blank" rel="noopener noreferrer" className="text-gold underline">קיבוע זכויות ברשות המסים ↗</a> מסביר על בדיקת הפטור האישי על קצבה.</p>
      </section>
      <div className="mt-10 flex flex-wrap gap-5">
        <Link href="/insurance/pension" className="font-semibold text-gold underline underline-offset-4">איך בודקים את הפנסיה הצפויה?</Link>
        <Link href="/savings/family-budget" className="font-semibold text-gold underline underline-offset-4">מיפוי התקציב המשפחתי</Link>
      </div>
    </main>
  );
}
