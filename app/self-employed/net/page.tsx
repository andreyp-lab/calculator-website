import type { Metadata } from 'next';
import Link from 'next/link';
import { CalculatorLayout } from '@/components/calculator/CalculatorLayout';
import { FAQ } from '@/components/calculator/FAQ';

export const metadata: Metadata = {
  title: 'כמה נשאר לעצמאי? בדיקת מחזור, הוצאות, מס והפקדות',
  description: 'דרך לבדיקת הכנסה פנויה של עצמאי לפי נתוני העסק, השומה, דמי ביטוח, מע״מ והפקדות, בלי להניח אחוז הכרה אחיד לכל הוצאה.',
  alternates: { canonical: '/self-employed/net' },
};

const faqItems = [
  {
    question: 'מה ההבדל בין מחזור להכנסה פנויה?',
    answer: 'מחזור הוא סך העסקאות לפני קיזוז הוצאות. כדי להעריך כסף פנוי יש לבדוק תשלומים לספקים, מסים, דמי ביטוח, מקדמות והפקדות לחיסכון, לפי התקופה והנתונים האישיים.',
  },
  {
    question: 'האם לכל הוצאה עסקית יש אחוז הכרה קבוע?',
    answer: 'לא. ההכרה תלויה בסוג ההוצאה, בשימוש העסקי ובתקנות. אין להחיל באופן גורף שיעור אחד על כל הוצאה לרכב, לטלפון או לעסק מהבית.',
  },
  {
    question: 'האם עוסק פטור פטור ממס הכנסה ומביטוח לאומי?',
    answer: 'לא. הפטור עוסק בגביית מע״מ על עסקאות בהתאם למעמד ולתקרה. מס הכנסה ודמי ביטוח נבחנים לפי ההכנסה, המעמד והנתונים האישיים.',
  },
];

export default function Page() {
  return (
    <CalculatorLayout
      pageUrl="/self-employed/net"
      title="כמה נשאר לעצמאי? הכנת הנתונים לחישוב נטו"
      description="אספו את המחזור, הוצאות העסק, המקדמות וההפקדות, ובדקו את החבות מול הדוחות והחשבונות האישיים."
      breadcrumbs={[
        { label: 'דף הבית', href: '/' },
        { label: 'עצמאים', href: '/self-employed' },
        { label: 'הכנסה פנויה לעצמאי' },
      ]}
      lastUpdated="2026-09-28"
      quickAnswer={
        <p>
          אין יחס קבוע בין מחזור העסק לנטו שנשאר לעצמאי. יש לבחון הוצאות מוכרות לפי סוגן,
          הכנסות נוספות, נקודות זיכוי, הפקדות ותשלומי מס וביטוח לאומי. עוסק מורשה צריך
          להפריד גם בין מע״מ עסקאות למע״מ תשומות. חישוב אישי דורש נתוני שומה ותזרים,
          ולכן אין להסיק אותו מהמחזור בלבד.
        </p>
      }
      content={
        <>
          <h2>רשימת נתונים לחישוב הכנסה פנויה</h2>
          <ul>
            <li>מחזור העסקאות ללא מע״מ והתקבולים שהתקבלו בפועל בתקופה שנבדקת.</li>
            <li>הוצאות העסק לפי אסמכתאות וסיווג לצורכי מס, כולל הוצאות בעלות שימוש מעורב.</li>
            <li>מקדמות מס הכנסה, תשלומי ביטוח לאומי ובריאות והפקדות לפנסיה ולקרן השתלמות.</li>
            <li>הכנסות נוספות, נקודות זיכוי ומעמד העוסק במע״מ.</li>
          </ul>
          <h2>הבחנה בין רווח לתזרים</h2>
          <p>
            רווח לצורכי מס אינו זהה ליתרת המזומן בבנק. תשלום הוצאות, גבייה מלקוחות,
            מקדמות והפקדות עשויים לחול בחודשים שונים. לצורך תכנון תזרים ערכו רשימה חודשית
            של תקבולים ותשלומים, ואת המסים בדקו על בסיס הדיווחים והשומה הרלוונטיים.
          </p>
          <h2>איפה בודקים את החיובים?</h2>
          <ul>
            <li><a href="https://www.btl.gov.il/Simulators/BituahCalc/Pages/Insurance_NotSachir.aspx" target="_blank" rel="noopener noreferrer">מחשבון דמי ביטוח לעצמאי — הביטוח הלאומי</a></li>
            <li><a href="https://www.gov.il/he/departments/topics/annual-reports-1301" target="_blank" rel="noopener noreferrer">דוח שנתי ליחיד — רשות המסים</a></li>
            <li><a href="https://www.gov.il/he/service/tax-credit" target="_blank" rel="noopener noreferrer">מחשבון נקודות זיכוי לפי מצב משפחתי — רשות המסים</a></li>
          </ul>
          <p>למידע נוסף ראו <Link href="/self-employed/social-security">דמי ביטוח לעצמאי</Link> ו<Link href="/self-employed/allowed-expenses">הוצאות עסקיות</Link>.</p>
        </>
      }
      faq={<FAQ items={faqItems} />}
    />
  );
}
