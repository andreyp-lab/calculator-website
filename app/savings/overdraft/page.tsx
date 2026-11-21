import { withPageSocialMetadata } from '@/lib/config/site-info';
import type { Metadata } from 'next';
import Link from 'next/link';
import { CalculatorLayout } from '@/components/calculator/CalculatorLayout';
import { FAQ } from '@/components/calculator/FAQ';
import { OverdraftCalculator } from '@/components/calculators/OverdraftCalculator';
import { overdraftCost, overdraftPayoff } from '@/lib/calculators/overdraft';

export const metadata: Metadata = withPageSocialMetadata({
  title: 'מחשבון מינוס בחשבון — כמה עולה הריבית וכמה זמן לצאת ממנו',
  description:
    'חשבו כמה עולה מינוס בעו״ש לפי יתרה, ריבית וימי חריגה, כמה זמן ייקח לסגור אותו, ואם הלוואה משתלמת יותר. החישוב ללא נתונים מומצאים: הריבית מהסכם הבנק שלכם.',
  alternates: { canonical: '/savings/overdraft' },
});

// דוגמה מחושבת מהמנוע: הטקסט לא מוקלד ידנית ולכן לא יכול להתפצל מהמחשבון.
const EX = { balance: 10000, rate: 12, days: 30, paydown: 1000 };
const EX_COST = overdraftCost({ averageOverdraft: EX.balance, annualRatePct: EX.rate, daysPerMonth: EX.days })!;
const EX_PAYOFF = overdraftPayoff({ balance: EX.balance, annualRatePct: EX.rate, monthlyPaydown: EX.paydown })!;
const money = (v: number) => `${v.toLocaleString('he-IL', { maximumFractionDigits: 2 })} ₪`;

const faqItems = [
  {
    question: 'איך מחושבת הריבית על מינוס?',
    answer:
      'בדרך כלל הבנק מחשב ריבית יומית על היתרה השלילית בכל יום, וגובה אותה בחיוב תקופתי. ריבית שנתית של 12% על 10,000 ₪ במינוס כל חודש עולה כ־100 ₪ בחודש, אבל השיעור והמועד נקבעים בהסכם עם הבנק.',
  },
  {
    question: 'מה ריבית המינוס בישראל?',
    answer:
      'אין שיעור אחיד. כל בנק קובע ריבית חריגה להסכם שלכם, והיא בדרך כלל גבוהה מריבית הפריים. מצאו אותה בדף התנאים של הבנק, בהודעת ריבית שקיבלתם או בשירות הלקוחות, והזינו אותה במחשבון.',
  },
  {
    question: 'האם כדאי לקחת הלוואה כדי לסגור מינוס?',
    answer:
      'לפעמים כן, כשהריבית בהלוואה נמוכה מריבית המינוס ואתם מתכוונים להחזיר. הבדל חשוב: במינוס הקרן נשארת חוב, ובהלוואה היא מוחזרת בתשלומים. לפני החלטה בדקו עמלות פתיחה, הצמדה וביטוח בהצעה.',
  },
  {
    question: 'למה מינוס יכול להתארך גם כשמפקידים כסף?',
    answer:
      'אם ההפקדה החודשית נמוכה מהריבית החודשית על המינוס, החוב לא קטן. המחשבון מראה את הסכום שצריך להקטין בכל חודש כדי שהמינוס ייסגר.',
  },
  {
    question: 'האם יש עמלות נוספות על מינוס?',
    answer:
      'יכולות להיות: עמלת חריגה ממסגרת, עמלות על פעולות בחשבון ועוד. המחשבון כולל ריבית בלבד. בדקו את כל החיובים בדף התנאים ובתדפיס החשבון.',
  },
];

export default function OverdraftPage() {
  return (
    <CalculatorLayout
      pageUrl="/savings/overdraft"
      title="מחשבון מינוס בחשבון"
      description="כמה עולה הריבית על המינוס, כמה זמן ייקח לסגור אותו, ומתי הלוואה משתלמת יותר."
      breadcrumbs={[
        { label: 'דף הבית', href: '/' },
        { label: 'חיסכון וחובות', href: '/savings' },
        { label: 'מינוס בחשבון' },
      ]}
      lastUpdated="2026-11-20"
      quickAnswer={
        <p>
          עלות מינוס = יתרה ממוצעת × ריבית שנתית × ימי חריגה ÷ 365. למשל, מינוס ממוצע של{' '}
          {money(EX.balance)} בריבית של {EX.rate}% ל־{EX.days} ימים בחודש עולה כ־{money(EX_COST.monthlyInterest)}{' '}
          בחודש, כלומר כ־{money(EX_COST.annualInterest)} בשנה. אם מקטינים את המינוס ב־{money(EX.paydown)} בחודש, הוא
          נסגר בכ־{EX_PAYOFF.months} חודשים בריבית כוללת של {money(EX_PAYOFF.totalInterest)}. ריבית המינוס בפועל
          נקבעת בהסכם עם הבנק.
        </p>
      }
      calculator={<OverdraftCalculator />}
      content={
        <>
          <h2>איך עובד חישוב ריבית על מינוס</h2>
          <p>
            הבנק מחשב ריבית על היתרה השלילית בכל יום שבו החשבון במינוס. לכן אותו סכום עולה פחות אם הוא נשאר
            במינוס כמה ימים בחודש, ויותר אם הוא במינוס כל החודש. במחשבון אפשר להגדיר כמה ימים בחודש החשבון
            חורג.
          </p>
          <h3>דוגמה מחושבת</h3>
          <p>
            {money(EX.balance)} × {EX.rate}% × ({EX.days}/365) = {money(EX_COST.monthlyInterest)} בחודש. אם
            מקטינים את המינוס ב־{money(EX.paydown)} בחודש הוא נסגר בכ־{EX_PAYOFF.months} חודשים.
          </p>

          <h2>איך יוצאים מהמינוס</h2>
          <ul>
            <li>
              <strong>מקטינים בכל חודש סכום קבוע</strong> שגבוה מהריבית החודשית, כדי שהקרן תרד.
            </li>
            <li>
              <strong>משווים להלוואה</strong> רק אם ריבית ההלוואה נמוכה מריבית המינוס ואתם משלמים את התשלום
              בזמן. ראו את <Link href="/savings/loan-repayment">מחשבון החזר הלוואה</Link> ואת{' '}
              <Link href="/savings/personal-loan">המדריך להלוואה אישית</Link>.
            </li>
            <li>
              <strong>בודקים את המצב הכולל</strong> ב<Link href="/savings/family-budget">תקציב המשפחתי</Link> כדי
              לראות מה גורם למינוס לחזור.
            </li>
          </ul>

          <h2>מה המחשבון לא כולל</h2>
          <p>
            עמלות, ריבית משתנה, ריבית דריבית בתוך החודש ושינויי מסגרת. הוא נועד לאמוד את עלות הריבית ולא
            להחליף את תדפיס הבנק.
          </p>
        </>
      }
      faq={<FAQ items={faqItems} />}
      sources={
        <ul>
          <li>
            <a
              href="https://www.boi.org.il/information/bank-paymnts/financial-education/"
              target="_blank"
              rel="noopener noreferrer"
            >
              בנק ישראל — מידע לציבור על חשבון עו״ש ואשראי
            </a>
          </li>
        </ul>
      }
    />
  );
}
