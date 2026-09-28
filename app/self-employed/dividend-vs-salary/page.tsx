import type { Metadata } from 'next';
import Link from 'next/link';

const TAX_BOOKLET = 'https://www.gov.il/BlobFolder/generalpage/income-tax-monthly-deductions-booklet/he/generalInformation_income-tax-monthly-deductions-booklet_monthly-deductions-booklet-2026.pdf';
const CLOSE_COMPANIES = 'https://www.gov.il/he/pages/191025-faq-taxation-of-profits';
const DIVIDEND_REPORT = 'https://www.gov.il/he/service/itc804';

export const metadata: Metadata = {
  title: 'דיבידנד או משכורת לבעל חברה — מה צריך לבדוק?',
  description:
    'בחירת דרך משיכה מחברה תלויה בשכר, בדיבידנד, בחובות החברה ובנתונים האישיים. מדריך להכנת הנתונים ולבדיקת כללי המס העדכניים.',
  alternates: { canonical: '/self-employed/dividend-vs-salary' },
};

export default function DividendVsSalaryPage() {
  return (
    <main dir="rtl" className="mx-auto max-w-4xl px-5 py-12 text-ink">
      <nav aria-label="פירורי לחם" className="mb-8 text-sm text-ink/60">
        <Link href="/">דף הבית</Link> / <Link href="/self-employed">עצמאים</Link> / דיבידנד או משכורת
      </nav>
      <h1 className="mb-5 text-3xl font-bold md:text-4xl">דיבידנד או משכורת לבעל חברה?</h1>
      <p className="mb-8 text-lg leading-relaxed">
        אין חלוקה קבועה בין משכורת לדיבידנד שהיא הטובה ביותר לכל בעל חברה. משכורת, דיבידנד
        ורווח שנשאר בחברה נבחנים לפי כללי מס שונים. התוצאה תלויה בהכנסות האישיות, בבעלי המניות,
        בצורכי החברה ובכללים שעשויים לחול על חברות מעטים ועל רווחים לא מחולקים.
      </p>

      <section className="border-r-4 border-gold bg-cream-2 p-6">
        <h2 className="mb-3 text-xl font-bold">מה להביא לחישוב אישי?</h2>
        <ul className="list-disc space-y-3 pr-6 leading-relaxed">
          <li>רווח החברה ותזרים המזומנים לאחר התחייבויות והשקעות מתוכננות.</li>
          <li>הסכום שצריך למשוך למחיה, והכנסות אישיות נוספות של בעל המניות.</li>
          <li>שיעור ההחזקה, תפקיד בפועל בחברה והפרשות סוציאליות קיימות.</li>
          <li>רווחים שנצברו, חלוקות קודמות וכללים מיוחדים שיכולים לחול על החברה.</li>
        </ul>
      </section>

      <section className="mt-10 space-y-4 leading-relaxed">
        <h2 className="text-2xl font-bold">מה משתנה בין דרכי המשיכה?</h2>
        <p>
          משכורת כרוכה בחישובי שכר, ניכויי מס ודמי ביטוח ובהסדרת זכויות לפי נסיבות ההעסקה.
          דיבידנד הוא חלוקת רווחים לבעלי המניות, עם כללי מס ודיווח נפרדים. השוואה שמחשבת רק
          שיעור מס אחד או מניחה שכל רווחי החברה מחולקים מיד אינה מספיקה להחלטה. גם העסקת בן או
          בת זוג דורשת עבודה אמיתית ושכר מתאים, ולא ניתן להניח חיסכון קבוע מראש.
        </p>
        <p>
          לפני בחירה בדרך משיכה, בקשו חישוב המבוסס על נתוני החברה, בעל המניות והכללים החלים
          בשנת המס הרלוונטית. אומדן אחיד אינו קובע מהו סכום המשיכה המתאים לכם.
        </p>
      </section>

      <section className="mt-10 space-y-3 leading-relaxed">
        <h2 className="text-2xl font-bold">מקורות רשמיים</h2>
        <p><a href={TAX_BOOKLET} target="_blank" rel="noopener noreferrer" className="text-gold underline">לוח הניכויים של רשות המסים לשנת 2026 ↗</a></p>
        <p><a href={CLOSE_COMPANIES} target="_blank" rel="noopener noreferrer" className="text-gold underline">שאלות ותשובות של רשות המסים על רווחים לא מחולקים ↗</a></p>
        <p><a href={DIVIDEND_REPORT} target="_blank" rel="noopener noreferrer" className="text-gold underline">דיווח ותשלום על חלוקת דיבידנד ↗</a></p>
      </section>

      <div className="mt-10 flex flex-wrap gap-5">
        <Link href="/self-employed/corporation-vs-individual" className="font-semibold text-gold underline underline-offset-4">חברה מול עוסק מורשה</Link>
        <Link href="/course/business" className="font-semibold text-gold underline underline-offset-4">הקורס לניהול כספים בעסק</Link>
      </div>
    </main>
  );
}
