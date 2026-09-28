import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'שכיר או עצמאי — מה כדאי להשוות לפני שמחליטים?',
  description:
    'השוואה בין עבודה כשכיר לעבודה כעצמאי: הכנסה נטו, הפרשות, זכויות, הוצאות עסקיות וסיכונים. ההחלטה תלויה בנתונים האישיים.',
  alternates: { canonical: '/compare/employee-vs-self-employed' },
};

const rows = [
  ['בסיס ההשוואה', 'שכר וחלק המעסיק בעלויות העסקה', 'הכנסות פחות הוצאות עסקיות, מסים ועלויות ניהול'],
  ['חיסכון פנסיוני', 'הפרשות העובד והמעסיק לפי ההסדר החל', 'הפקדה עצמית לפי תנאי חובת ההפקדה'],
  ['זכויות בתקופות היעדרות', 'חופשה, מחלה, הבראה וזכויות נוספות לפי הדין וההסכם', 'יש לתכנן מימון עצמי לתקופות שבהן אין הכנסה'],
  ['דמי ביטוח לאומי ובריאות', 'ניכוי עובד והשתתפות מעסיק לפי מדרגות', 'תשלום לפי המעמד וההכנסה המדווחת'],
  ['הוצאות עסקיות', 'אין לנכות באופן גורף את הוצאות העבודה מהשכר', 'ניכוי הוצאות מותרות לפי סוג ההוצאה והכללים החלים'],
  ['סיכון ותזרים', 'השכר נקבע לפי הסכם העבודה', 'ההכנסות והתשלומים תלויים בלקוחות ובעסק'],
] as const;

export default function EmployeeVsSelfEmployedComparePage() {
  return (
    <main dir="rtl" className="mx-auto max-w-5xl px-5 py-12 text-ink">
      <nav aria-label="פירורי לחם" className="mb-8 text-sm text-ink/60">
        <Link href="/">דף הבית</Link> / <Link href="/compare">השוואות</Link> / שכיר או עצמאי
      </nav>
      <h1 className="mb-5 text-3xl font-bold md:text-4xl">שכיר או עצמאי — איך משווים נכון?</h1>
      <p className="mb-8 text-lg leading-relaxed">
        אין רמת הכנסה אחידה שבה אחד המסלולים משתלם יותר לכולם. מחזור של עסק אינו מקביל לשכר
        ברוטו: יש להביא בחשבון הוצאות, שעות עבודה, מסים, הפרשות, זכויות וסיכון. ההשוואה שלהלן
        עוזרת לאסוף את הנתונים לפני החלטה אישית.
      </p>

      <div className="overflow-x-auto border border-ink/15">
        <table className="w-full min-w-[650px] border-collapse text-right text-sm">
          <thead className="bg-ink text-cream">
            <tr><th className="p-4">נושא</th><th className="p-4">שכיר</th><th className="p-4">עצמאי</th></tr>
          </thead>
          <tbody>
            {rows.map(([label, employee, selfEmployed]) => (
              <tr key={label} className="border-t border-ink/15 even:bg-cream-2">
                <th scope="row" className="p-4 font-semibold">{label}</th>
                <td className="p-4">{employee}</td>
                <td className="p-4">{selfEmployed}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <section className="mt-10 space-y-4 leading-relaxed">
        <h2 className="text-2xl font-bold">נתונים שכדאי לבדוק לפני מעבר</h2>
        <ul className="list-disc space-y-3 pr-6">
          <li>השוו את עלות ההעסקה הכוללת להכנסה העסקית הצפויה לאחר הוצאות בפועל.</li>
          <li>בדקו זכאות אישית לחופשה, מחלה, לידה ואבטלה לפי המעמד והנסיבות. אין זכאות אוטומטית זהה לכל עובד או עצמאי.</li>
          <li>הביאו בחשבון הפקדות לפנסיה, הטבות מס לפי תנאי הזכאות, ודמי ביטוח לאומי ובריאות.</li>
          <li>בחנו את זמן הגבייה מלקוחות, עלויות הנהלת חשבונות ותקופות ללא עבודה.</li>
        </ul>
        <p>
          אם שוקלים הקמת חברה, אין מחזור מכירות שמבטיח יתרון מס. בדקו רווח, משיכות, מס חברות
          ודיבידנד ועלויות ניהול עם איש מקצוע. אפשר להתחיל ב{' '}
          <Link href="/self-employed/corporation-vs-individual" className="font-semibold text-gold underline underline-offset-4">השוואת חברה מול עוסק</Link>.
        </p>
      </section>

      <section className="mt-10 border-r-4 border-gold bg-cream-2 p-6">
        <h2 className="mb-3 text-xl font-bold">בדיקה לפי המקורות הרשמיים</h2>
        <p className="mb-4">לשיעורים ולזכאות המעודכנים בדקו את המידע הרשמי ואת פרטי המקרה שלכם.</p>
        <ul className="list-disc space-y-2 pr-6">
          <li><a href="https://www.btl.gov.il/Insurance/National%20Insurance/type_list/Self_Employed/Pages/rates.aspx" target="_blank" rel="noopener noreferrer" className="text-gold underline">שיעורי הביטוח הלאומי לעצמאים ↗</a></li>
          <li><a href="https://www.gov.il/he/pages/independent-must-pension" target="_blank" rel="noopener noreferrer" className="text-gold underline">פנסיה חובה לעצמאים במשרד האוצר ↗</a></li>
        </ul>
      </section>

      <div className="mt-10 flex flex-wrap gap-5">
        <Link href="/self-employed/net" className="font-semibold text-gold underline underline-offset-4">מחשבון נטו לעצמאי</Link>
        <Link href="/self-employed/mandatory-pension" className="font-semibold text-gold underline underline-offset-4">מדריך פנסיה חובה</Link>
        <Link href="/course/self-employed" className="font-semibold text-gold underline underline-offset-4">הקורס לעצמאים</Link>
      </div>
    </main>
  );
}
