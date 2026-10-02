import type { Metadata } from 'next';
import { CalculatorLayout } from '@/components/calculator/CalculatorLayout';

export const metadata: Metadata = {
  title: 'בונוס שנתי: בדיקת מס וניכויים',
  description: 'היכן לבדוק ניכוי מס על בונוס ותשלום נוסף בדמי ביטוח לפי נתוני השכר האישיים.',
  alternates: { canonical: '/employee-rights/annual-bonus' },
};

const incomeTax = 'https://www.gov.il/he/service/income-tax-calculator';
const refund = 'https://www.gov.il/he/service/itc135';
const insurance = 'https://www.btl.gov.il/Insurance/Maasik/Pages/hacnasaHacayevet.aspx';

export default function Page() {
  return <CalculatorLayout
    pageUrl="/employee-rights/annual-bonus"
    title="בונוס שנתי: בדיקת מס וניכויים"
    description="הבונוס מצטרף להכנסה. בדקו את אופן הניכוי בתלוש ואת הנתונים האישיים מול המקורות הרשמיים."
    breadcrumbs={[{ label: 'דף הבית', href: '/' }, { label: 'זכויות עובדים', href: '/employee-rights' }, { label: 'בונוס שנתי' }]}
    lastUpdated="2026-09-28"
    quickAnswer={<p>לא קיים אחוז נטו אחיד לבונוס. ניכוי המס ודמי הביטוח תלויים בשכר, בשנת המס, במועד התשלום ובנתונים האישיים. קבלו מהמעסיק את תלוש השכר והפרטים על ההפקדות.</p>}
    calculator={<div className="border border-ink/20 bg-paper p-6"><p>בדקו את הניכוי בסימולטור הרשמי של רשות המסים על בסיס הנתונים האישיים שלכם.</p><a className="inline-block mt-4 text-gold underline" href={incomeTax} target="_blank" rel="noopener noreferrer">פתיחת סימולטור ניכוי המס</a></div>}
    content={<>
      <h2>מה לבדוק בתלוש?</h2>
      <p>האם התשלום חד פעמי או חלק משכר קבוע; האם בוצעו ממנו הפקדות פנסיוניות; ומה נוכה בפועל למס הכנסה, לביטוח לאומי ולביטוח בריאות. חלוקת תשלום נוסף לצורך דמי ביטוח עשויה להיות תלויה בסכום ובתקופת ההעסקה. בקשו ממחלקת השכר הסבר לפי התלוש.</p>
      <p>לקריאה על ההכנסה החייבת בדמי ביטוח ראו <a href={insurance} target="_blank" rel="noopener noreferrer">ביטוח לאומי</a>. אם נוכה מס ביתר במהלך שנה שכבר הסתיימה, בדקו את <a href={refund} target="_blank" rel="noopener noreferrer">שירות הבקשה להחזר מס ברשות המסים</a> ואת התאמת טופס 135 לנסיבותיכם.</p>
      <p>הכלי הקודם חזה נטו וחיסכון מס מתוך משכורת חודשית קבועה, הניח פריסה של כל בונוס ל־12 חודשים והשווה שיטות ניכוי ו־RSU בלי נתוני תלוש מלאים. מספרים אלה אינם בדיקת זכאות אישית, ולכן הוחלפו בהפניה לבדיקה הרשמית.</p>
    </>}
  />;
}
