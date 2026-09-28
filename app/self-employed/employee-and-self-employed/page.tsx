import type { Metadata } from 'next';
import Link from 'next/link';
import { CalculatorLayout } from '@/components/calculator/CalculatorLayout';
import { FAQ } from '@/components/calculator/FAQ';

export const metadata: Metadata = {
  title: 'שכיר ועצמאי במקביל — בדיקת מס ודמי ביטוח',
  description: 'כיצד להכין את נתוני השכר והעסק ולבדוק מס הכנסה ודמי ביטוח כאשר עובדים גם כשכירים וגם כעצמאים.',
  alternates: { canonical: '/self-employed/employee-and-self-employed' },
};

const faqItems = [
  {
    question: 'האם הכנסה ממשכורת והכנסה מעסק נבדקות יחד במס הכנסה?',
    answer: 'בדוח השנתי מדווחים על כלל מקורות ההכנסה הרלוונטיים, וכוללים את הניכויים והזיכויים לפי הנתונים האישיים. בדקו גם תשלומי מקדמות וניכוי מס במקור.',
  },
  {
    question: 'איך בודקים דמי ביטוח כשעובדים גם כשכירים?',
    answer: 'המעמד בביטוח הלאומי, גובה ההכנסות מכל מקור וההכנסה המרבית משפיעים על החיוב. המחשבון הרשמי כולל בחירה עבור עצמאי שהוא גם שכיר.',
  },
  {
    question: 'האם אפשר לקבוע את הנטו מהעסק לפי שיעור מס שולי אחד?',
    answer: 'לא. ההכנסה הפנויה תלויה בין השאר בסיווג ההוצאות, בזיכויים, בהפקדות, במס שנוכה מהשכר ובמקדמות ששולמו.',
  },
];

export default function Page() {
  return (
    <CalculatorLayout
      title="שכיר ועצמאי במקביל — הכנת הנתונים"
      description="בדקו את השכר, תוצאות העסק והתשלומים מול כל רשות לפי המעמד האישי."
      breadcrumbs={[
        { label: 'דף הבית', href: '/' },
        { label: 'עצמאים', href: '/self-employed' },
        { label: 'שכיר ועצמאי' },
      ]}
      lastUpdated="2026-09-28"
      quickAnswer={
        <p>
          לשילוב של שכר והכנסה מעסק יש השלכות על מס הכנסה ועל דמי הביטוח, אך כל אחד
          מחושב לפי כללים ונתונים משלו. אספו את טופס 106, נתוני העסק, ההפקדות
          והמקדמות, ובדקו את המעמד ואת החיוב בביטוח הלאומי.
        </p>
      }
      content={
        <>
          <h2>נתונים שכדאי לאסוף</h2>
          <ul>
            <li>טופס 106, תלושי השכר ואישורי ניכוי מס במקור.</li>
            <li>הכנסות העסק, הוצאות מסווגות ואישורי תשלום מקדמות מס.</li>
            <li>אישורי הפקדות וזיכויים רלוונטיים, וכן המעמד הרשום בביטוח הלאומי.</li>
          </ul>
          <h2>בדיקה במקורות הרשמיים</h2>
          <ul>
            <li><a href="https://www.btl.gov.il/Simulators/BituahCalc/Pages/Insurance_NotSachir.aspx" target="_blank" rel="noopener noreferrer">מחשבון הביטוח הלאומי — כולל עצמאי שהוא גם שכיר</a></li>
            <li><a href="https://www.gov.il/he/departments/topics/annual-reports-1301" target="_blank" rel="noopener noreferrer">דוחות שנתיים ליחידים — רשות המסים</a></li>
          </ul>
          <p>להכנת תזרים ראו <Link href="/self-employed/net">בדיקת הכנסה פנויה לעצמאי</Link>.</p>
        </>
      }
      faq={<FAQ items={faqItems} />}
    />
  );
}
