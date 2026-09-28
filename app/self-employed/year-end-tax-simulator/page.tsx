import type { Metadata } from 'next';
import Link from 'next/link';
import { CalculatorLayout } from '@/components/calculator/CalculatorLayout';
import { FAQ } from '@/components/calculator/FAQ';

export const metadata: Metadata = {
  title: 'סוף שנת מס לעצמאי — הכנת הנתונים ובדיקת החבות',
  description: 'רשימת נתונים להכנת הדוח השנתי ולבדיקת מקדמות, ביטוח לאומי והפקדות מול המקורות הרשמיים.',
  alternates: { canonical: '/self-employed/year-end-tax-simulator' },
};

const faqItems = [
  {
    question: 'האם אפשר לדעת מה תהיה חבות המס רק מהמחזור וההוצאות?',
    answer: 'לא. החבות תלויה בסיווג ההכנסות וההוצאות, בהכנסות נוספות, בזיכויים, בהפקדות ובנתונים האישיים, וכן בשומה הסופית.',
  },
  {
    question: 'האם מקדמות ששולמו קובעות את המס הסופי?',
    answer: 'מקדמות הן תשלומים על חשבון החבות. יש להשוות אותן לדיווח ולשומה ולהביא בחשבון גם ניכוי מס במקור ותשלומים נוספים.',
  },
  {
    question: 'מה לגבי הפקדות לפנסיה ולקרן השתלמות?',
    answer: 'יש לשמור אישורי הפקדה ולבדוק את זכאות הניכוי או הזיכוי והתקרות לפי השנה והנתונים האישיים. אין להניח שכל הפקדה מזכה אוטומטית באותה הטבה.',
  },
];

export default function Page() {
  return (
    <CalculatorLayout
      title="סוף שנת מס לעצמאי — הכנת הנתונים"
      description="רשימת בדיקות לקראת הדוח השנתי והשוואת תשלומים לחבות שתיקבע לפי הנתונים האישיים."
      breadcrumbs={[
        { label: 'דף הבית', href: '/' },
        { label: 'עצמאים', href: '/self-employed' },
        { label: 'בדיקת סוף שנה' },
      ]}
      lastUpdated="2026-09-28"
      quickAnswer={
        <p>
          הערכת מס סוף שנה דורשת את כלל ההכנסות, ההוצאות המסווגות, הזיכויים והניכויים,
          אישורי ההפקדות והתשלומים שכבר בוצעו. תשלום לביטוח לאומי ודיווח מע״מ נבחנים
          בנפרד. אספו את האסמכתאות והשוו את הנתונים לדיווחים ולשומה.
        </p>
      }
      content={
        <>
          <h2>מה לאסוף לקראת הדוח?</h2>
          <ul>
            <li>רישומי הכנסות והוצאות העסק ואסמכתאות, כולל הכנסות ממקורות אחרים.</li>
            <li>אישורי מקדמות מס הכנסה, ניכוי מס במקור ותשלומי דמי ביטוח.</li>
            <li>אישורי הפקדות לפנסיה ולקרן השתלמות ונתונים לזיכויים אישיים.</li>
            <li>דיווחי מע״מ, אם העסק חייב בהם, בנפרד מחישוב מס הכנסה.</li>
          </ul>
          <h2>בדיקה מול הרשויות</h2>
          <ul>
            <li><a href="https://www.gov.il/he/departments/topics/annual-reports-1301" target="_blank" rel="noopener noreferrer">דוחות שנתיים ליחידים — רשות המסים</a></li>
            <li><a href="https://www.gov.il/he/service/itc-payment-online-incometax" target="_blank" rel="noopener noreferrer">דיווח ותשלום מקדמות מס הכנסה</a></li>
            <li><a href="https://www.btl.gov.il/Insurance/National%20Insurance/type_list/Self_Employed/Pages/hishov.dmey.bituach.aspx" target="_blank" rel="noopener noreferrer">דוגמת חישוב דמי ביטוח לעצמאי</a></li>
          </ul>
          <p>ראו גם <Link href="/self-employed/tax-advances">בדיקת מקדמות במהלך השנה</Link>.</p>
        </>
      }
      faq={<FAQ items={faqItems} />}
    />
  );
}
