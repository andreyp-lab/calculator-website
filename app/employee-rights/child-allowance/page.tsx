import { withPageSocialMetadata } from '@/lib/config/site-info';
import type { Metadata } from 'next';
import Link from 'next/link';
import { CalculatorLayout } from '@/components/calculator/CalculatorLayout';
import { FAQ } from '@/components/calculator/FAQ';
import { FamilyBenefitsCalculator } from '@/components/calculators/FamilyBenefitsCalculator';
import { calculateBirthGrant, calculateChildAllowance } from '@/lib/calculators/btl-family';
import { CHILD_SAVINGS_2026, CHILDREN_ALLOWANCE_2026 } from '@/lib/constants/tax-2026';

export const metadata: Metadata = withPageSocialMetadata({
  title: 'קצבת ילדים ומענק לידה 2026 — מחשבון לפי מספר הילדים',
  description:
    'כמה קצבת ילדים מגיעה לפי סדר הילד, מענק הלידה לפי מספר הילדים במשפחה, ואומדן דמי לידה — לפי הסכומים של הביטוח הלאומי מ־2026.',
  alternates: { canonical: '/employee-rights/child-allowance' },
});

const THREE = calculateChildAllowance(3)!;
const GRANT_FIRST = calculateBirthGrant({ childrenInFamilyAfterBirth: 1, newborns: 1 })!;
const GRANT_SECOND = calculateBirthGrant({ childrenInFamilyAfterBirth: 2, newborns: 1 })!;
const GRANT_THIRD = calculateBirthGrant({ childrenInFamilyAfterBirth: 3, newborns: 1 })!;
const money = (v: number) => `${v.toLocaleString('he-IL')} ₪`;

const faqItems = [
  {
    question: 'כמה קצבת ילדים מקבלים ב־2026?',
    answer: `לפי הביטוח הלאומי: ${money(CHILDREN_ALLOWANCE_2026.firstChild)} לילד הראשון, ${money(CHILDREN_ALLOWANCE_2026.secondChild)} לילדים שני עד רביעי, ו־${money(CHILDREN_ALLOWANCE_2026.fifthAndAbove)} מהילד החמישי. הקצבה משולמת עד סוף החודש שבו הילד מגיע לגיל 18.`,
  },
  {
    question: 'מה התוספת לילד שלישי ורביעי?',
    answer:
      'הורה שמקבל הבטחת הכנסה, מזונות או קצבת זקנה/שאירים עם השלמת הכנסה זכאי לתוספת של 113 ₪ לחודש לכל אחד מהילדים השלישי והרביעי.',
  },
  {
    question: 'מתי מתחילים לקבל קצבת ילדים אחרי לידה?',
    answer:
      'אם הלידה הייתה עד ה־15 בחודש, התשלום מתחיל מהראשון באותו חודש. אם ב־16 ואילך, מתחיל מהחודש הבא.',
  },
  {
    question: 'מה מענק הלידה?',
    answer: `סכום חד־פעמי לפי מספר הילדים במשפחה כולל הנולד: ${money(GRANT_FIRST)} ללידה ראשונה, ${money(GRANT_SECOND)} לשנייה ו־${money(GRANT_THIRD)} לשלישית ואילך. לתאומים ולשלישיות סכומים גבוהים יותר, כמפורט במחשבון.`,
  },
  {
    question: 'איך מחושבים דמי לידה?',
    answer:
      'לפי הגבוה מבין שכר ממוצע ליום בשלושת החודשים המלאים שלפני הפסקת העבודה, ושכר ממוצע ליום בששת החודשים המלאים, עד תקרה יומית. זכאות מלאה היא 15 שבועות (105 ימים) וחלקית 8 שבועות, לפי חודשי אכשרה.',
  },
  {
    question: 'האם המחשבון מחליף את הבדיקה בביטוח הלאומי?',
    answer:
      'לא. הוא נותן אומדן לפי הסכומים והכללים הכלליים. זכאות אישית, לידה מרובה, אשפוז, עצמאיות ותנאים מיוחדים נבדקים בביטוח הלאומי.',
  },
];

export default function ChildAllowancePage() {
  return (
    <CalculatorLayout
      pageUrl="/employee-rights/child-allowance"
      title="קצבת ילדים ומענק לידה 2026"
      description="קצבת ילדים לפי סדר הילד, מענק לידה לפי מספר הילדים, ואומדן דמי לידה."
      breadcrumbs={[
        { label: 'דף הבית', href: '/' },
        { label: 'זכויות עובדים', href: '/employee-rights' },
        { label: 'קצבת ילדים ומענק לידה' },
      ]}
      lastUpdated="2026-11-20"
      quickAnswer={
        <p>
          קצבת הילדים ב־2026 היא {money(CHILDREN_ALLOWANCE_2026.firstChild)} לילד הראשון,{' '}
          {money(CHILDREN_ALLOWANCE_2026.secondChild)} לילדים שני עד רביעי ו־{money(CHILDREN_ALLOWANCE_2026.fifthAndAbove)}{' '}
          מהחמישי. משפחה עם שלושה ילדים מקבלת {money(THREE.monthly)} בחודש, כלומר {money(THREE.annual)} בשנה. מענק לידה
          הוא {money(GRANT_FIRST)} ללידה ראשונה, {money(GRANT_SECOND)} לשנייה ו־{money(GRANT_THIRD)} לשלישית ואילך. בנוסף
          הביטוח הלאומי מפקיד {CHILD_SAVINGS_2026.monthlyDeposit} ₪ בחודש לחיסכון לכל ילד.
        </p>
      }
      calculator={<FamilyBenefitsCalculator />}
      content={
        <>
          <h2>איך מחושבת קצבת ילדים</h2>
          <p>
            הסכום תלוי במקום הילד במשפחה: הילד הבכור מבין הזכאים הוא הראשון. הקצבה משולמת עד סוף החודש שבו הילד מגיע
            לגיל 18, כל עוד אינו נשוי וגר בישראל. התשלום ב־20 בכל חודש.
          </p>
          <h3>דוגמה מחושבת</h3>
          <p>
            שלושה ילדים: {money(CHILDREN_ALLOWANCE_2026.firstChild)} + {money(CHILDREN_ALLOWANCE_2026.secondChild)} +{' '}
            {money(CHILDREN_ALLOWANCE_2026.thirdChild)} = {money(THREE.monthly)} בחודש.
          </p>

          <h2>הקצבה בתקציב המשפחתי</h2>
          <p>
            הקצבה היא הכנסה חודשית קבועה. הוסיפו אותה ב<Link href="/savings/family-budget">תקציב המשפחתי</Link>, ושקלו
            להפנות חלק ממנה ל<Link href="/savings/child-savings">חיסכון לכל ילד</Link>: ההורים יכולים להוסיף{' '}
            {CHILD_SAVINGS_2026.parentTopUpMonthly} ₪ בחודש מהקצבה לחיסכון.
          </p>

          <h2>דמי לידה ותכנון הלידה</h2>
          <p>
            דמי הלידה נקבעים לפי שכר ממוצע בחודשים שלפני הפסקת העבודה. ראו גם את הדף על{' '}
            <Link href="/employee-rights/maternity-benefits">דמי לידה</Link> ואת{' '}
            <Link href="/personal-tax/salary-net-gross">חישוב נטו וברוטו</Link> להבנת ההשפעה על השכר.
          </p>
        </>
      }
      faq={<FAQ items={faqItems} />}
      sources={
        <ul>
          <li>
            <a href="https://www.btl.gov.il/benefits/children/Pages/%D7%A9%D7%99%D7%A2%D7%95%D7%A8%D7%99%20%D7%94%D7%A7%D7%A6%D7%91%D7%94.aspx" target="_blank" rel="noopener noreferrer">
              ביטוח לאומי — שיעורי קצבת ילדים
            </a>
          </li>
          <li>
            <a href="https://www.btl.gov.il/benefits/maternity/maanakleda/Pages/ShiurMaanakLeda.aspx" target="_blank" rel="noopener noreferrer">
              ביטוח לאומי — שיעורי מענק לידה
            </a>
          </li>
          <li>
            <a href="https://www.btl.gov.il/benefits/maternity/Childbirth_Allowance/Pages/ShiureyLeda.aspx" target="_blank" rel="noopener noreferrer">
              ביטוח לאומי — שיעורי דמי לידה
            </a>
          </li>
          <li>
            <a href="https://www.btl.gov.il/benefits/children/HisahoLayeled/Pages/sum.aspx" target="_blank" rel="noopener noreferrer">
              ביטוח לאומי — חיסכון לכל ילד
            </a>
          </li>
        </ul>
      }
    />
  );
}
