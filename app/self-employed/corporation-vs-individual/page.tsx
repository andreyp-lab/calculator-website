import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'חברה בע"מ או עוסק מורשה — השוואת שיקולים',
  description:
    'מדריך לבחירת מבנה עסקי לפי רווח, משיכות, דיווחים ועלויות. אין סף הכנסה אחיד או חישוב מס שמכריע לבדו.',
  alternates: { canonical: '/self-employed/corporation-vs-individual' },
};

export default function CorporationVsIndividualPage() {
  return (
    <main dir="rtl" className="mx-auto max-w-4xl px-5 py-12 text-ink">
      <nav aria-label="פירורי לחם" className="mb-8 text-sm text-ink/60">
        <Link href="/">דף הבית</Link> / <Link href="/self-employed">עצמאים</Link> / חברה או עוסק
      </nav>
      <h1 className="mb-5 text-3xl font-bold md:text-4xl">חברה בע&quot;מ או עוסק מורשה?</h1>
      <p className="mb-8 text-lg leading-relaxed">
        אין רווח שנתי שממנו חברה בהכרח משתלמת יותר. השוואת מס דורשת לבדוק גם את סכומי המשיכה
        לבעלים, רווחים שנשארים בפעילות, חובות דיווח ועלויות ניהול, וגם נסיבות אישיות. מחזור
        מכירות לבדו אינו נתון מספיק להחלטה.
      </p>

      <section className="border-r-4 border-gold bg-cream-2 p-6">
        <h2 className="mb-3 text-xl font-bold">איך מתחילים להשוות?</h2>
        <p className="leading-relaxed">
          הכינו תחזית רווח לאחר הוצאות עסקיות, סכום משיכה למחיה, עלויות רישום וניהול לפי הצעות
          שקיבלתם, ותוכנית למימון העסק. השוו את תוצאת המס של כל מסלול עם רואה חשבון או יועץ מס
          על בסיס הנתונים האישיים. הוצאות פרטיות אינן הופכות להוצאות עסקיות עקב הקמת חברה.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="mb-4 text-2xl font-bold">שאלות שיש לברר</h2>
        <ul className="list-disc space-y-3 pr-6 leading-relaxed">
          <li>איזה חלק מהרווח יימשך כמשכורת או כדיבידנד, ואיזה חלק נדרש לעסק?</li>
          <li>מה עלויות הנהלת החשבונות, הביקורת, הדיווחים והאגרות בפועל?</li>
          <li>האם יש שותפים, התחייבויות אישיות או ערבויות שמשנות את שיקולי האחריות?</li>
          <li>האם חלים על הפעילות כללי מס מיוחדים, לרבות כללים הנוגעים לחברות מעטים?</li>
        </ul>
      </section>

      <section className="mt-10 space-y-3 leading-relaxed">
        <h2 className="text-2xl font-bold">מקורות רשמיים</h2>
        <p><a href="https://www.gov.il/BlobFolder/generalpage/income-tax-monthly-deductions-booklet/he/generalInformation_income-tax-monthly-deductions-booklet_monthly-deductions-booklet-2026.pdf" target="_blank" rel="noopener noreferrer" className="text-gold underline">לוח הניכויים של רשות המסים לשנת 2026 ↗</a></p>
        <p><a href="https://www.gov.il/he/service/company_registration" target="_blank" rel="noopener noreferrer" className="text-gold underline">רישום חברה ברשות התאגידים ↗</a></p>
        <p><a href="https://www.gov.il/he/service/company_partnership_annual_payment" target="_blank" rel="noopener noreferrer" className="text-gold underline">תשלום אגרה שנתית לחברה ↗</a></p>
      </section>

      <div className="mt-10 flex flex-wrap gap-5">
        <Link href="/blog/company-vs-self-employed-ultimate-guide" className="font-semibold text-gold underline underline-offset-4">למדריך המפורט</Link>
        <Link href="/course/business" className="font-semibold text-gold underline underline-offset-4">לקורס ניהול כספים לעסק</Link>
      </div>
    </main>
  );
}
