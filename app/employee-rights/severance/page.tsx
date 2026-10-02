import { Metadata } from 'next';
import Link from 'next/link';
import { CalculatorLayout } from '@/components/calculator/CalculatorLayout';
import { FAQ } from '@/components/calculator/FAQ';

export const metadata: Metadata = {
  title: 'פיצויי פיטורים — בדיקת זכאות, סעיף 14 ומיסוי',
  description: 'מה לבדוק בסיום עבודה: שכר קובע, יתרת רכיב הפיצויים, תחולת סעיף 14, טופס 161 ואפשרויות המס. קישורים להנחיות משרד העבודה ורשות המסים.',
  alternates: { canonical: '/employee-rights/severance' },
};

const faqItems = [
  {
    question: 'איך בודקים את סכום הפיצויים?',
    answer: 'אספו את תאריכי העבודה, השכר הקובע, השינויים בהיקף המשרה, הסכם העבודה ודוח הקרן עם רכיב הפיצויים. בסיס החישוב וההשלמה מהמעסיק תלויים בתקופות ובשיעורי ההפקדה בפועל.',
  },
  {
    question: 'האם סעיף 14 חל על כל הפיצויים?',
    answer: 'לא בהכרח. יש לבדוק את ההסדר החל, את השכר והרכיבים שבוטחו, שיעור ההפרשה ואת התקופות שעליהן בוצעה הפקדה. הכספים שהופקדו עשויים לבוא במקום חלק מהחבות בלבד.',
  },
  {
    question: 'האם כדאי למשוך פיצויים בפטור, לפרוס מס או לבחור ברצף קצבה?',
    answer: 'הבחירה תלויה ביתרות, בזכאות לפטור, בהכנסות בשנות המס הרלוונטיות ובהשפעה על פטור עתידי מקצבה. יש לבחון את טופס 161 ואת הנחיות רשות המסים לפני בחירה.',
  },
];

export default function SeverancePage() {
  return (
    <CalculatorLayout
      pageUrl="/employee-rights/severance"
      title="פיצויי פיטורים — כך בודקים את הזכאות"
      description="בדקו את תקופת העבודה, השכר הקובע, ההפקדות בפועל והדיווח בטופס 161 לפני החלטה על כספי הפיצויים."
      breadcrumbs={[
        { label: 'דף הבית', href: '/' },
        { label: 'זכויות עובדים', href: '/employee-rights' },
        { label: 'פיצויי פיטורים' },
      ]}
      lastUpdated="2026-09-28"
      quickAnswer={
        <p>
          סכום הפיצויים אינו נקבע רק על פי השכר האחרון כפול שנות העבודה. הזכאות, השכר הקובע,
          תחולת סעיף 14 והשלמת המעסיק דורשים בדיקה של ההסכם, תקופות העבודה ודוח ההפקדות.
          גם מס על מענקי פרישה נבחן לפי טופס 161 והנתונים האישיים.
        </p>
      }
      content={
        <>
          <h2>אילו נתונים להכין?</h2>
          <ul>
            <li>תאריכי תחילת וסיום העסקה, סיבת הסיום ושינויים בהיקף המשרה או בשכר.</li>
            <li>תלושי שכר, הסכם עבודה, הסדר סעיף 14 ודוח יתרות עדכני של רכיב הפיצויים בקרן.</li>
            <li>טופס 161 מהמעסיק ופירוט מענקים נוספים עם סיום העבודה.</li>
          </ul>
          <h2>מה לבדוק מול המעסיק והקרן?</h2>
          <p>
            ודאו על אילו תקופות ורכיבי שכר הופרשו פיצויים ובאיזה שיעור. השוו את ההפקדות
            והיתרה בקרן להסדר החל עליכם. במקרה של שינויי שכר או משרה, אין להניח אוטומטית
            שהמשכורת האחרונה או הממוצע הגבוה ביותר הם השכר הקובע לכל התקופה.
          </p>
          <h2>מיסוי והחלטה על הכספים</h2>
          <p>
            פטור ממס, רצף קצבה ופריסה כפופים לתנאים ולהיסטוריית הפרישה שלכם. משיכת כספי
            פיצויים עשויה להשפיע גם על החיסכון והפטור בעת פרישה. בדקו את אפשרויות הבחירה
            במדריך רשות המסים ובטופס 161; אין חלופה עדיפה אחת לכל עובד.
          </p>
          <ul>
            <li><a href="https://www.gov.il/he/pages/severance-package" target="_blank" rel="noopener noreferrer">משרד העבודה — תשלום פיצויי פיטורים</a></li>
            <li><a href="https://www.gov.il/he/pages/provisions-for-severance-pay" target="_blank" rel="noopener noreferrer">משרד העבודה — הפרשות לפיצויי פיטורים</a></li>
            <li><a href="https://www.gov.il/he/pages/retirement-from-work-2023" target="_blank" rel="noopener noreferrer">רשות המסים — מדריך פרישה מעבודה</a></li>
            <li><a href="https://www.gov.il/he/service/notice-of-retirement" target="_blank" rel="noopener noreferrer">רשות המסים — טופס 161</a></li>
          </ul>
          <p>
            לאחר סיום העבודה ניתן לבדוק גם <Link href="/employee-rights/annual-leave">יתרת חופשה</Link>
            {' '}ו<Link href="/employee-rights/unemployment-benefits">זכאות לדמי אבטלה</Link>.
          </p>
        </>
      }
      faq={<FAQ items={faqItems} />}
    />
  );
}
