import { withPageSocialMetadata } from '@/lib/config/site-info';
import Link from 'next/link';
import type { Metadata } from 'next';
import { CalculatorLayout } from '@/components/calculator/CalculatorLayout';
import { FAQ } from '@/components/calculator/FAQ';
import { ArnonaCalculator } from '@/components/calculators/ArnonaCalculator';
import { UtilityBillsCalculator } from '@/components/calculators/UtilityBillsCalculator';

export const metadata: Metadata = withPageSocialMetadata({
  title: { absolute: 'תקציב משפחתי — איך מרכזים הכנסות והוצאות' },
  description: 'מדריך קצר לבניית תקציב משפחתי חודשי: הכנסה נטו, הוצאות, חובות וחיסכון. כלל 50/30/20 הוא נקודת פתיחה ולא דירוג פיננסי.',
  alternates: { canonical: '/savings/family-budget' },
});

export default function FamilyBudgetPage() {
  return (
    <CalculatorLayout
      title="תקציב משפחתי"
      description="רכזו את ההכנסות וההוצאות של משק הבית, ובדקו מה נשאר לאחר הוצאות חיוניות והחזרי חובות."
      breadcrumbs={[{ label: 'דף הבית', href: '/' }, { label: 'חיסכון וחובות', href: '/savings' }, { label: 'תקציב משפחתי' }]}
      lastUpdated="2026-09-28"
      pageUrl="/savings/family-budget"
      quickAnswer={<p>התחילו מההכנסה הפנויה שמגיעה לחשבון ומכל ההוצאות והתשלומים שיוצאים ממנו בפועל. אם ההפרשות לפנסיה כבר נוכו מהשכר לפני שהגעתם להכנסה נטו, אל תפחיתו אותן שוב. השוו את יתרת החודש ליעדי החיסכון ולתשלומים הצפויים.</p>}
      content={<>
        <h2>איך בונים תקציב?</h2>
        <ol>
          <li>רשמו את כל ההכנסות שמתקבלות בפועל בכל חודש, כולל <Link href="/employee-rights/child-allowance">קצבת ילדים</Link> אם אתם זכאים לה.</li>
          <li>קבצו הוצאות דיור, חשבונות, מזון, תחבורה, בריאות, חינוך ובילויים.</li>
          <li>הוסיפו תשלומי הלוואות, הוצאות שנתיות בחלוקה חודשית וחיסכון שאתם מעבירים בפועל.</li>
          <li>בדקו את הפער בין ההכנסות לבין כל התשלומים והשוו כמה חודשים כדי לאתר הוצאות חריגות.</li>
        </ol>
        <h2>ארנונה בתקציב החודשי</h2>
        <p>הארנונה היא הוצאת דיור קבועה, ולרוב משולמת בשישה תשלומים דו־חודשיים או בחלוקה חודשית. כדי להכניס אותה לתקציב כסכום חודשי, חשבו אותה לפי צו הארנונה 2026 של העירייה והוסיפו לסעיף הדיור.</p>
        <ArnonaCalculator heading="ארנונה חודשית לדירה" />
        <h2>חשמל ומים בתקציב</h2>
        <p>חשבונות חשמל ומים משתנים לפי צריכה. אפשר לאמוד אותם לפי תעריפי 2026 ולהכניס סכום חודשי ממוצע לסעיף הדיור. פירוט נוסף: <Link href="/savings/utility-bills">מחשבון חשבון חשמל ומים</Link>.</p>
        <UtilityBillsCalculator />
        <h2>כלל 50/30/20</h2>
        <p>חלוקה של 50% לצרכים, 30% לרצונות ו־20% לחיסכון היא כלל אצבע בלבד. סיווג הוצאה מסוימת משתנה בין משפחות, ושיעור חיסכון יחיד אינו מלמד לבדו על מצב פיננסי או מועד פרישה.</p>
        <p>להערכת עלות הלוואה לפי סכום, ריבית ותקופה אפשר להשתמש ב<Link href="/savings/loan-repayment">מחשבון החזר הלוואה</Link>, ולעלות של חריגה במינוס ב<Link href="/savings/overdraft">מחשבון המינוס</Link>; לפני נטילת הלוואה השוו גם עמלות ותנאים נלווים.</p>
      </>}
      faq={<FAQ items={[
        { question: 'כמה חייבים לחסוך כל חודש?', answer: 'אין שיעור אחיד שמתאים לכולם. הגדירו יעד בהתאם להכנסה, להוצאות החיוניות, לחובות ולמטרות שלכם.' },
        { question: 'האם להוסיף פנסיה לחישוב ההוצאות?', answer: 'רק אם ההפרשה יוצאת בפועל מתוך ההכנסה שהזנתם. אם הזנתם שכר נטו אחרי ניכוי הפנסיה, חיוב נוסף שלה ייצור ספירה כפולה.' },
      ]} />}
    />
  );
}
