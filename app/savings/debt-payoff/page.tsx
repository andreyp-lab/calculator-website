import { withPageSocialMetadata } from '@/lib/config/site-info';
import type { Metadata } from 'next';
import Link from 'next/link';
import { CalculatorLayout } from '@/components/calculator/CalculatorLayout';
import { FAQ } from '@/components/calculator/FAQ';
import { FinanceExtraCalculator } from '@/components/calculators/FinanceExtraCalculator';

export const metadata: Metadata = withPageSocialMetadata({
  title: "מחשבון סילוק חוב — כמה זמן ייקח ומה ההחזר הנדרש",
  description: "חשבו תוך כמה חודשים תסגרו חוב לפי החזר חודשי וריבית, כמה ריבית תשלמו, ומה ההחזר הנדרש כדי לסגור בזמן שקבעתם.",
  alternates: { canonical: '/savings/debt-payoff' },
});

const faqItems = [
  { question: "מה עדיף: לסגור קודם חוב ביוקר?", answer: "בדרך כלל כן: סגירת החוב עם הריבית הגבוהה ביותר חוסכת הכי הרבה ריבית. בדקו גם עמלות פירעון מוקדם." },
];

export default function Page() {
  return (
    <CalculatorLayout
      pageUrl="/savings/debt-payoff"
      title="מחשבון סילוק חוב"
      description="חשבו תוך כמה חודשים תסגרו חוב לפי החזר חודשי וריבית, כמה ריבית תשלמו, ומה ההחזר הנדרש כדי לסגור בזמן שקבעתם."
      breadcrumbs={[
        { label: 'דף הבית', href: '/' },
        { label: "חיסכון וחובות", href: '/savings' },
        { label: "סילוק חוב" },
      ]}
      lastUpdated="2026-11-20"
      quickAnswer={<p>כדי שחוב יקטן, ההחזר החודשי חייב להיות גבוה מהריבית החודשית על היתרה. הגדלת ההחזר מקצרת את הזמן ומקטינה את סך הריבית. המחשבון מראה כמה חודשים ייקח, וגם איזה החזר דרוש כדי לסגור תוך מספר חודשים שתבחרו.</p>}
      calculator={<FinanceExtraCalculator section="debt" />}
      content={
        <>
          <h2>איך מחשבים</h2>
          <p>בכל חודש נוספת ריבית על היתרה ומופחת ההחזר. כשההחזר גבוה מהריבית, היתרה יורדת עד סגירה. השוואה בין שני תרחישי החזר מראה כמה חוסכים בריבית.</p>
          <p>ראו גם: <Link href="/savings/loan-methods">הלוואה בשלוש שיטות</Link>, <Link href="/savings/overdraft">מינוס בחשבון</Link>, <Link href="/savings/family-budget">תקציב משפחתי</Link>.</p>
        </>
      }
      faq={<FAQ items={faqItems} />}

    />
  );
}
