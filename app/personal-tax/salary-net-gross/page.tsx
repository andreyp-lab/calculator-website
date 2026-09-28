import { Metadata } from 'next';
import Link from 'next/link';
import { CalculatorLayout } from '@/components/calculator/CalculatorLayout';
import { SalaryNetGrossCalculator } from '@/components/calculators/SalaryNetGrossCalculator';
import { FAQ } from '@/components/calculator/FAQ';
import { EmbedCodeBox } from '@/components/marketing/EmbedCodeBox';

export const metadata: Metadata = {
  title: 'מחשבון ברוטו נטו 2026 — אומדן שכר חודשי',
  description:
    'אומדן ברוטו לנטו, נטו לברוטו ועלות מעסיק לפי מדרגות מס ודמי ביטוח. בדקו את התוצאה מול תלוש השכר והסימולטור הרשמי.',
  alternates: { canonical: '/personal-tax/salary-net-gross' },
};

const faqItems = [
  {
    question: 'מה ההבדל בין ברוטו לנטו?',
    answer: 'ברוטו הוא השכר לפני ניכויים. נטו הוא הסכום לאחר מס הכנסה, דמי ביטוח לאומי ובריאות, חלק העובד בפנסיה וניכויים אחרים לפי התלוש. לאותו ברוטו יכול להיות נטו שונה בין עובדים.',
  },
  {
    question: 'האם האומדן כולל את כל הטבות המס?',
    answer: 'לא. המחשבון מחשב מס לפי מדרגות ונקודות זיכוי שהוזנו, אך אינו כולל את זיכוי המס האפשרי בשל הפקדת העובד לפנסיה, הטבות אישיות אחרות או רכיבי תלוש מיוחדים. בדקו את החישוב האישי מול המעסיק או רשות המסים.',
  },
  {
    question: 'איך בודקים כמה נקודות זיכוי מגיעות לי?',
    answer: 'המספר תלוי בנסיבות האישיות ובשנת המס, לרבות ילדים. בדקו בסימולטור נקודות הזיכוי של רשות המסים ועדכנו את טופס 101 אצל המעסיק.',
  },
  {
    question: 'איך בונוס משפיע על הנטו?',
    answer: 'בונוס עשוי להעביר חלק מהשכר למדרגת מס גבוהה יותר. חישוב דמי הביטוח והניכוי בפועל תלוי בפרטי הבונוס ובתלוש; אין שיעור מס יחיד לכל בונוס.',
  },
];

export default function SalaryNetGrossPage() {
  return (
    <CalculatorLayout
      title="מחשבון שכר נטו ברוטו 2026"
      description="אומדן ברוטו→נטו, נטו→ברוטו ועלות מעסיק לפי הנחות שתזינו. התוצאה אינה תלוש שכר אישי."
      breadcrumbs={[
        { label: 'דף הבית', href: '/' },
        { label: 'מיסוי אישי', href: '/personal-tax' },
        { label: 'שכר נטו ברוטו' },
      ]}
      lastUpdated="2026-09-28"
      embed={<EmbedCodeBox slug="salary-net-gross" title="מחשבון שכר נטו ברוטו" />}
      quickAnswer={
        <p className="text-lg text-ink leading-relaxed">
          הנטו הוא הברוטו לאחר מס הכנסה, דמי ביטוח לאומי ובריאות וניכויי עובד כגון פנסיה.
          בשנת 2026 שיעור דמי הביטוח והבריאות הרגיל לעובד תושב ישראל בגיל העבודה הוא 4.27%
          על חלק השכר עד 7,703 ₪ ו־12.17% על החלק שמעליו, עד 51,910 ₪. הזינו את נקודות
          הזיכוי וההפרשות כדי לקבל אומדן. המחשבון אינו מיישם זיכוי מס בשל הפקדה לפנסיה,
          ולכן הנטו המוצג עשוי להיות נמוך מהנטו המחושב בתלוש.
        </p>
      }
      calculator={<SalaryNetGrossCalculator />}
      content={
        <>
          <h2>איך לקרוא את התוצאה?</h2>
          <p>
            מס הכנסה מחושב לפי מדרגות על ההכנסה החייבת, ולא בשיעור אחד על כל השכר. מן המס
            מקזזים נקודות זיכוי לפי הנתון שהזנתם. דמי ביטוח לאומי ובריאות מחושבים בשתי מדרגות
            עד לתקרה. ניכוי הפנסיה של העובד מוצג בנפרד. חישוב העלות למעסיק מוסיף לברוטו
            הפרשות מעסיק לפי הנחות המחשבון; העלות בפועל תלויה בהסכם העבודה ובבסיס ההפרשות.
          </p>
          <h2>מה צריך לבדוק בתלוש?</h2>
          <ul>
            <li>נקודות הזיכוי המעודכנות לפי טופס 101, לרבות זכאות אישית בשל ילדים ונסיבות נוספות.</li>
            <li>השכר המבוטח, שיעורי ההפרשות לפנסיה ולקרן השתלמות וזיכוי המס על ההפקדה.</li>
            <li>בונוסים, שווי הטבות, עבודה נוספת ותיאום מס, אם רלוונטיים.</li>
          </ul>
          <p>
            לאימות אישי השתמשו ב
            <a href="https://www.gov.il/he/service/income-tax-calculator" target="_blank" rel="noopener noreferrer">סימולטור ניכוי המס של רשות המסים</a>,
            ב<a href="https://www.gov.il/he/service/tax-credit" target="_blank" rel="noopener noreferrer">סימולטור נקודות הזיכוי</a>
            וב<a href="https://www.btl.gov.il/Insurance/Rates/Pages/%D7%9C%D7%A2%D7%95%D7%91%D7%93%D7%99%D7%9D%20%D7%A9%D7%9B%D7%99%D7%A8%D7%99%D7%9D.aspx" target="_blank" rel="noopener noreferrer">שיעורי דמי הביטוח הרשמיים</a>.
          </p>
          <h2>מחשבונים קשורים</h2>
          <ul>
            <li><Link href="/personal-tax/income-tax">מחשבון מס הכנסה</Link></li>
            <li><Link href="/personal-tax/tax-credits">בדיקת נקודות זיכוי</Link></li>
            <li><Link href="/employee-rights/salary-deductions">פירוט ניכויים ממשכורת</Link></li>
          </ul>
        </>
      }
      faq={<FAQ items={faqItems} />}
    />
  );
}
