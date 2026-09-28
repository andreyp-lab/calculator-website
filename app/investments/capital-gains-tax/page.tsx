import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'מס רווח הון על השקעות — בדיקת סוג הכנסה ודיווח',
  description: 'מה לבדוק לפני חישוב מס על ניירות ערך, ריבית ודיבידנד: סוג הכנסה, ניכוי במקור, הפסדים וזכאות אישית.',
  alternates: { canonical: '/investments/capital-gains-tax' },
};

export default function CapitalGainsTaxPage() {
  return (
    <main dir="rtl" className="mx-auto max-w-4xl px-5 py-12 text-ink">
      <nav aria-label="פירורי לחם" className="mb-8 text-sm text-ink/60">
        <Link href="/">דף הבית</Link> / <Link href="/investments">השקעות</Link> / מס רווח הון
      </nav>
      <h1 className="mb-5 text-3xl font-bold md:text-4xl">איך בודקים מס על השקעות?</h1>
      <p className="mb-8 text-lg leading-relaxed">
        שיעור המס ובסיס החישוב תלויים בסוג נייר הערך, בסוג ההכנסה, בהצמדה,
        במעמד המשקיע ובנסיבות נוספות. אין שיעור אחיד שאפשר להחיל על כל מניה, אג״ח,
        פיקדון או דיבידנד. גם מס יסף וקיזוז הפסדים נבדקים מול כלל נתוני שנת המס.
      </p>
      <section className="border-r-4 border-gold bg-cream-2 p-6">
        <h2 className="mb-3 text-xl font-bold">מה להכין לבדיקה?</h2>
        <ol className="list-decimal space-y-3 pr-6 leading-relaxed">
          <li>דוח פעולות ואישור ניכוי מס במקור מהבנק או מהברוקר, לרבות עסקאות בחו״ל.</li>
          <li>סוג ההכנסה: רווח ממכירה, ריבית או דיבידנד, וסוג הנייר או המוצר.</li>
          <li>עלות רכישה, תמורה, תאריכים, עמלות, הצמדה ומטבע לפי המסמכים.</li>
          <li>הפסדים בני קיזוז, הכנסות אחרות ונתונים שעשויים להשפיע על מס יסף.</li>
        </ol>
      </section>
      <section className="mt-10 space-y-4 leading-relaxed">
        <h2 className="text-2xl font-bold">ניכוי במקור ודיווח</h2>
        <p>
          ניכוי מס במקור אינו תשובה אוטומטית לשאלת חובת הדיווח או לסכום המס הסופי.
          בדקו אם כל הפעולות נכללות באישורים ואם יש עסקאות שלא נוכה מהן מס,
          הפסדים מועברים או הכנסות מחו״ל. טופסי הדוח השנתי של רשות המסים מבחינים
          בין סוגי עסקאות ושיעורי מס. אם הנתונים מורכבים, בדקו אותם עם איש מקצוע.
        </p>
        <p>
          לפני מימוש הפסד לצורך קיזוז, בדקו את כללי הקיזוז והדיווח הרלוונטיים
          למועד העסקה ולהכנסה שכנגדה מבקשים לקזז. אין להסיק מהפסד ״על הנייר״
          שהוא כבר זמין לקיזוז.
        </p>
      </section>
      <section className="mt-10 space-y-3 leading-relaxed">
        <h2 className="text-2xl font-bold">מקורות רשמיים</h2>
        <p><a href="https://www.gov.il/he/service/reporting-and-payment-2025-annual-tax-report-for-individuals" target="_blank" rel="noopener noreferrer" className="text-gold underline">רשות המסים — דוח שנתי ונספחי רווח הון מניירות ערך ↗</a></p>
        <p><a href="https://www.gov.il/BlobFolder/service/reporting-and-payment-2025-annual-tax-report-for-individuals/he/Service_Pages_Income_tax_annual-report-2026_1325-2025.pdf" target="_blank" rel="noopener noreferrer" className="text-gold underline">הוראות נספח רווח הון מניירות ערך סחירים ↗</a></p>
        <p><a href="https://www.gov.il/BlobFolder/generalpage/income-tax-monthly-deductions-booklet/he/generalInformation_income-tax-monthly-deductions-booklet_monthly-deductions-booklet-2026.pdf" target="_blank" rel="noopener noreferrer" className="text-gold underline">לוח הניכויים לשנת 2026 ↗</a></p>
      </section>
      <div className="mt-10 flex flex-wrap gap-5">
        <Link href="/investments/roi" className="font-semibold text-gold underline underline-offset-4">חישוב ROI לפי נתונים שהוזנו</Link>
        <Link href="/investments/compound-interest" className="font-semibold text-gold underline underline-offset-4">תרחישי ריבית דריבית</Link>
      </div>
    </main>
  );
}
