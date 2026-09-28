import type { Metadata } from 'next';
import Link from 'next/link';
import { CalculatorLayout } from '@/components/calculator/CalculatorLayout';
import { FAQ } from '@/components/calculator/FAQ';

export const metadata: Metadata = {
  title: 'ביטוח לאומי לעצמאי 2026 — שיעורים וחישוב רשמי',
  description: 'שיעורי דמי הביטוח והבריאות לעצמאי ב-2026, אופן בדיקת בסיס החיוב וקישור למחשבון הרשמי של הביטוח הלאומי.',
  alternates: { canonical: '/self-employed/social-security' },
};

const faqItems = [
  {
    question: 'איך בודקים כמה דמי ביטוח עצמאי צריך לשלם?',
    answer: 'הסכום תלוי במעמד המבוטח, גיל, הכנסות נוספות ובבסיס החיוב שנקבע לפי השומה והמקדמות. היעזרו במחשבון הרשמי של הביטוח הלאומי ובפירוט החשבון האישי.',
  },
  {
    question: 'האם הניכוי של 52% חל גם על דמי בריאות?',
    answer: 'לא. ההפחתה שעליה מסביר הביטוח הלאומי מתייחסת ל-52% מרכיב דמי הביטוח הלאומי, בלי דמי ביטוח בריאות. החישוב האישי תלוי בנתוני השומה ובהפקדות לקופת גמל.',
  },
  {
    question: 'האם שיעורי עצמאי חלים גם על מי שכיר ועצמאי?',
    answer: 'יש לבחון את מכלול ההכנסות והמעמד בביטוח הלאומי. אין להחיל חישוב של עצמאי שעיסוקו היחיד הוא העסק על מקרה של הכנסה נוספת בלי בדיקה אישית.',
  },
];

export default function Page() {
  return (
    <CalculatorLayout
      title="ביטוח לאומי לעצמאי — בדיקת החיוב"
      description="בדקו את שיעורי 2026 ואת בסיס החיוב, ואז חשבו את התשלום האישי במחשבון הביטוח הלאומי."
      breadcrumbs={[
        { label: 'דף הבית', href: '/' },
        { label: 'עצמאים', href: '/self-employed' },
        { label: 'ביטוח לאומי לעצמאי' },
      ]}
      lastUpdated="2026-09-28"
      quickAnswer={
        <p>
          לעצמאי בגיל העבודה שעיסוקו היחיד הוא העסק, שיעורי דמי הביטוח והבריאות הכלליים
          ב-2026 הם 7.7% על חלק ההכנסה עד 7,703 ₪ לחודש ו-18% על החלק שמעליו עד 51,910 ₪.
          הסכום לתשלום אינו מתקבל תמיד מכפל פשוט של ההכנסה בשיעורים: בסיס החיוב מושפע
          מהשומה ומהפחתות לפי הדין. בדקו את התוצאה במחשבון הרשמי.
        </p>
      }
      content={
        <>
          <h2>מה צריך להכין לחישוב?</h2>
          <ul>
            <li>הכנסה מעסק לפי השומה או ההערכה למקדמות, ומידע על הפקדות לקופת גמל.</li>
            <li>מעמד המבוטח, גיל והכנסות נוספות, לרבות עבודה כשכיר.</li>
            <li>פירוט המקדמות ששולמו והודעות השומה בחשבון האישי.</li>
          </ul>
          <h2>מה פירוש הפחתת 52%?</h2>
          <p>
            הביטוח הלאומי מפרט כי בקביעת בסיס החיוב לעצמאי מופחתים 52% מרכיב דמי הביטוח
            הלאומי, בלי דמי ביטוח בריאות, וכן חלק מההפקדה לקופת גמל לפי הכללים. לכן
            דוגמת החישוב הרשמית משתמשת בנוסחה לבסיס החיוב לפני החלת השיעורים.
          </p>
          <h2>בדיקה אישית במקור הרשמי</h2>
          <ul>
            <li><a href="https://www.btl.gov.il/Simulators/BituahCalc/Pages/Insurance_NotSachir.aspx" target="_blank" rel="noopener noreferrer">מחשבון דמי ביטוח לעצמאי — הביטוח הלאומי</a></li>
            <li><a href="https://www.btl.gov.il/Insurance/National%20Insurance/type_list/Self_Employed/Pages/rates.aspx" target="_blank" rel="noopener noreferrer">שיעורי דמי הביטוח לעצמאי</a></li>
            <li><a href="https://www.btl.gov.il/Insurance/National%20Insurance/type_list/Self_Employed/Pages/hishov.dmey.bituach.aspx" target="_blank" rel="noopener noreferrer">דוגמת חישוב בסיס החיוב</a></li>
          </ul>
          <p>להערכת תזרים העסק ראו גם <Link href="/self-employed/net">מדריך בדיקת הנטו לעצמאי</Link>.</p>
        </>
      }
      faq={<FAQ items={faqItems} />}
    />
  );
}
