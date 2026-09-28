import type { Metadata } from 'next';
import Link from 'next/link';

const EXEMPT_OPENING = 'https://www.gov.il/he/service/request-open-exempt-dealer-via-internet';
const LICENSED_OPENING = 'https://www.gov.il/he/service/vat-821';
const COMPANY_FEE = 'https://www.gov.il/he/service/company_partnership_annual_payment';

export const metadata: Metadata = {
  title: 'כמה עולה לפתוח עסק? רכיבי עלות לעוסק ולחברה',
  description: 'הפרדה בין שירות רישום ממשלתי, אגרות חברה ועלויות ספקים לפי הצעות מחיר אישיות.',
  alternates: { canonical: '/self-employed/business-setup-cost' },
};

export default function BusinessSetupCostPage() {
  return (
    <main dir="rtl" className="mx-auto max-w-4xl px-5 py-12 text-ink">
      <nav aria-label="פירורי לחם" className="mb-8 text-sm text-ink/60"><Link href="/">דף הבית</Link> / <Link href="/self-employed">עצמאים</Link> / עלויות פתיחה</nav>
      <h1 className="mb-5 text-3xl font-bold md:text-4xl">כמה עולה לפתוח עסק?</h1>
      <p className="mb-8 text-lg leading-relaxed">יש להבחין בין עלות הרישום ברשויות, אגרות הנוגעות לחברה ועלויות שוק של שירותים וציוד. טווחי מחירים כלליים אינם הצעת מחיר, ואינם מספיקים לבחירה בין עוסק לחברה.</p>

      <section className="border-r-4 border-gold bg-cream-2 p-6 leading-relaxed">
        <h2 className="mb-3 text-xl font-bold">מה ניתן לאמת מראש?</h2>
        <p>לפי רשות המסים, הבקשה המקוונת לפתיחת תיק עוסק פטור ניתנת ללא עלות. לרישום עוסק מורשה יש שירות רישום נפרד ברשות המסים. חברה נדרשת גם לאגרות התאגדות ואגרה שנתית: הסכומים ומועד התשלום המוזל מתפרסמים בשירות רשות התאגידים, ויש לבדוק אותם במועד הבקשה. שנת ההתאגדות פטורה בדרך כלל מהאגרה השנתית לפי תנאי השירות.</p>
        <div className="mt-4 flex flex-wrap gap-5">
          <a href={EXEMPT_OPENING} target="_blank" rel="noopener noreferrer" className="text-gold underline">פתיחת עוסק פטור ↗</a>
          <a href={LICENSED_OPENING} target="_blank" rel="noopener noreferrer" className="text-gold underline">פתיחת עוסק מורשה ↗</a>
          <a href={COMPANY_FEE} target="_blank" rel="noopener noreferrer" className="text-gold underline">אגרה שנתית לחברה ↗</a>
        </div>
      </section>

      <section className="mt-10 space-y-4 leading-relaxed">
        <h2 className="text-2xl font-bold">תקציב שנה ראשונה: מה לאסוף</h2>
        <ul className="list-disc space-y-3 pr-6">
          <li>אגרות רישום והתאגדות לפי סוג הישות ואופן ההגשה; אגרה שנתית לחברה לפי שנת הרישום.</li>
          <li>הצעות מחיר לליווי משפטי, הנהלת חשבונות, שכר ועריכת דוחות, לפי מספר העסקאות והעובדים.</li>
          <li>תמחור תוכנה להפקת מסמכים, סליקה, חשבון בנק והוצאות שוטפות.</li>
          <li>ביטוח בהתאם לסיכון המקצועי, דרישות לקוחות או רישוי ענפי.</li>
          <li>ציוד, מלאי, אתר, שכירות, פיקדונות ותקציב תזרים עד להתחלת גבייה מלקוחות.</li>
        </ul>
        <p>מס הכנסה ודמי ביטוח לאומי תלויים בהכנסה ובמעמד האישי; מע״מ תלוי בסוג העוסק והעסקאות. אלה אינם ״דמי פתיחה״ קבועים. בדקו את התחזית יחד עם מייצג לפני בחירת מבנה העסק.</p>
      </section>

      <aside className="mt-12 border border-ink/15 bg-cream-2 p-6">
        <h2 className="mb-2 text-xl font-bold">רוצים לבנות תקציב פתיחה ותזרים?</h2>
        <p className="mb-4">הקורס לעצמאים עוסק בניהול כספי העסק ובתכנון החלטות.</p>
        <Link href="/course/self-employed" className="font-semibold text-gold underline">לפרטי הקורס</Link>
      </aside>
    </main>
  );
}
