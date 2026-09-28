import type { Metadata } from 'next';
import Link from 'next/link';
import { CalculatorLayout } from '@/components/calculator/CalculatorLayout';
import { FAQ } from '@/components/calculator/FAQ';

export const metadata: Metadata = {
  title: 'מקדמות לעצמאי — בדיקת חיובים ותיקון מקדמות',
  description: 'איך בודקים ומשלמים מקדמות מס הכנסה ודמי ביטוח, ומה עושים כשההכנסה משתנה במהלך השנה.',
  alternates: { canonical: '/self-employed/tax-advances' },
};

const faqItems = [
  {
    question: 'האם מקדמות מס הכנסה, ביטוח לאומי ומע״מ הן תשלום אחד?',
    answer: 'לא. אלו מערכות דיווח ותשלום נפרדות. יש לבדוק כל חיוב ומועד באזור האישי או בהודעה מהרשות המתאימה.',
  },
  {
    question: 'מה עושים אם ההכנסה השתנתה?',
    answer: 'בודקים את החיוב המעודכן ואת אפשרות תיקון המקדמות במס הכנסה ובביטוח הלאומי בנפרד, עם נתונים ומסמכים התומכים בבקשה.',
  },
  {
    question: 'האם אחוז קבוע מהמחזור הוא סכום המקדמה?',
    answer: 'לא בהכרח. מקדמות מס הכנסה נקבעות לפי התיק וההודעות מרשות המסים, ודמי ביטוח נקבעים לפי מעמד והכנסה בביטוח הלאומי. מע״מ מדווח בנפרד לפי העסקאות והתשומות החייבות.',
  },
];

export default function Page() {
  return (
    <CalculatorLayout
      title="מקדמות לעצמאי — בדיקת החיובים"
      description="בדקו את דרישות התשלום ואת האפשרות לתקן מקדמות לפי נתוני התיק וההכנסה בפועל."
      breadcrumbs={[
        { label: 'דף הבית', href: '/' },
        { label: 'עצמאים', href: '/self-employed' },
        { label: 'מקדמות' },
      ]}
      lastUpdated="2026-09-28"
      quickAnswer={
        <p>
          מקדמות מס הכנסה ודמי ביטוח משולמות לרשויות שונות ונבדקות לפי הנתונים בתיק שלכם.
          אין לחשב חיוב אישי על ידי חלוקת מס שנתי משוער למספר תשלומים, ואין להניח שריבית,
          מועדים או שיעור הפרשה אחיד חלים בכל תיק. השוו את ההודעות שקיבלתם לנתוני העסק.
        </p>
      }
      content={
        <>
          <h2>רשימת בדיקה לאורך השנה</h2>
          <ul>
            <li>בדקו את שיעור או סכום המקדמות שנקבעו לכם ואת תקופת הדיווח בכל רשות.</li>
            <li>השוו את ההכנסה בפועל לתחזית, ושמרו אישורי דיווח ותשלום.</li>
            <li>אם ההכנסה השתנתה, בדקו בנפרד בקשת הקטנה או תיקון של כל חיוב.</li>
            <li>בדקו את חבות מע״מ העסקאות והתשומות בדיווח המע״מ, בהתאם למעמד העסק.</li>
          </ul>
          <h2>תשלום ותיקון במקורות הרשמיים</h2>
          <ul>
            <li><a href="https://www.gov.il/he/service/itc-payment-online-incometax" target="_blank" rel="noopener noreferrer">דיווח ותשלום מקדמות מס הכנסה — רשות המסים</a></li>
            <li><a href="https://www.gov.il/he/service/itc-2216a" target="_blank" rel="noopener noreferrer">בקשה להקטנת מקדמות מס הכנסה — רשות המסים</a></li>
            <li><a href="https://www.btl.gov.il/Insurance/National%20Insurance/type_list/Self_Employed/Pages/tikun.aspx" target="_blank" rel="noopener noreferrer">תיקון מקדמות דמי ביטוח — הביטוח הלאומי</a></li>
          </ul>
          <p>למידע על בסיס דמי הביטוח ראו <Link href="/self-employed/social-security">ביטוח לאומי לעצמאי</Link>.</p>
        </>
      }
      faq={<FAQ items={faqItems} />}
    />
  );
}
