import type { Metadata } from 'next';
import Link from 'next/link';
import { CalculatorLayout } from '@/components/calculator/CalculatorLayout';
import { FAQ } from '@/components/calculator/FAQ';
import { BasicLoanCalculator } from './BasicLoanCalculator';

const bankOfIsraelUrl = 'https://www.boi.org.il/information/bank-paymnts/financial-education/';

export const metadata: Metadata = {
  title: 'מחשבון החזר הלוואה — תשלום חודשי ועלות ריבית',
  description: 'חשבו החזר חודשי ועלות ריבית להלוואה בריבית קבועה לא צמודה. הבינו כיצד להשוות הצעות והיכן לבדוק עמלות ותנאי פירעון מוקדם.',
  alternates: { canonical: '/savings/loan-repayment' },
};

export default function LoanRepaymentPage() {
  return (
    <CalculatorLayout
      title="מחשבון החזר הלוואה"
      description="חישוב בסיסי של תשלום חודשי ועלות ריבית לפי סכום, ריבית ותקופה שתזינו."
      breadcrumbs={[{ label: 'דף הבית', href: '/' }, { label: 'חיסכון וחובות', href: '/savings' }, { label: 'החזר הלוואה' }]}
      lastUpdated="2026-09-29"
      pageUrl="/savings/loan-repayment"
      calculator={<BasicLoanCalculator />}
      quickAnswer={<p>בהלוואה בריבית קבועה שאינה צמודה, עם תשלום חודשי קבוע וללא עמלות, ההחזר נקבע לפי סכום ההלוואה, הריבית ומספר החודשים. תקופה ארוכה מקטינה בדרך כלל את התשלום החודשי אך מגדילה את סך הריבית. המחשבון מציג תוצאה לתנאים שהוזנו, ואינו מחשב עלות אפקטיבית הכוללת עמלות, הצמדה, ביטוח או שינויי ריבית.</p>}
      content={<>
        <h2>איך מחושב ההחזר?</h2>
        <p>בשיטת שפיצר, בהנחה שהריבית אינה משתנה, התשלום החודשי קבוע. מחשבים ריבית חודשית כריבית שנתית נומינלית חלקי 12, ואת ההחזר לפי סכום הקרן ומספר התשלומים. בהלוואה ללא ריבית, מחלקים את הקרן במספר החודשים. החלוקה בין קרן לריבית משתנה לאורך התקופה גם כשהתשלום קבוע.</p>
        <h2>איך משווים הצעות?</h2>
        <ul>
          <li>הזינו במחשבון לכל הצעה את סכום ההלוואה, הריבית הנומינלית והתקופה שנקבעו בה.</li>
          <li>בדקו במסמכי ההצעה גם עמלות, הצמדה, ביטוח, ריבית משתנה ותנאי פירעון מוקדם. הם אינם נכללים בחישוב כאן.</li>
          <li>השוו את הסכום שתקבלו בפועל, את לוח התשלומים ואת העלות הכוללת בהתאם להסכם, ולא רק את ההחזר הראשון.</li>
        </ul>
        <p>למידע נוסף על השוואת תנאים ראו את <Link href="/savings/personal-loan">המדריך להלוואה אישית</Link> ואת <a href={bankOfIsraelUrl} target="_blank" rel="noopener noreferrer">המידע לציבור של בנק ישראל</a>.</p>
      </>}
      faq={<FAQ items={[
        { question: 'האם המחשבון מציג את העלות הכוללת של כל הלוואה?', answer: 'לא. הוא מניח ריבית קבועה, ללא הצמדה וללא עמלות או ביטוח. בהצעה בפועל יש לבדוק את כל תזרימי התשלום והחיובים הנוספים.' },
        { question: 'האם תשלום נוסף יקטין את הריבית?', answer: 'הקטנת הקרן עשויה לחסוך ריבית עתידית, אך התוצאה תלויה במועד התשלום, בדרך חישוב הריבית, בעמלות ובתנאי ההסכם. בקשו לוח סילוקין מעודכן מהמלווה.' },
        { question: 'האם יש שיעור ריבית שמתאים לכל סוג הלוואה?', answer: 'לא. הריבית ותנאי האשראי תלויים במלווה, בלווה, בבטוחות, בתקופה ובמועד ההצעה. הזינו את הריבית מתוך הצעה שקיבלתם.' },
      ]} />}
      sources={<ul><li><a href={bankOfIsraelUrl} target="_blank" rel="noopener noreferrer">בנק ישראל — מידע לציבור על בנקאות ותשלומים</a></li></ul>}
    />
  );
}
