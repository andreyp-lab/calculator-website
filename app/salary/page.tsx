import type { Metadata } from 'next';
import Link from 'next/link';
import { CalculatorLayout } from '@/components/calculator/CalculatorLayout';
import { SALARY_PAGE_AMOUNTS } from '@/lib/data/salary-pages';

export const metadata: Metadata = {
  title: 'טבלת ברוטו נטו לפי שכר — 6,500 עד 40,000 ₪',
  description:
    'בחרו שכר ברוטו חודשי וקבלו אומדן נטו מפורט לשנת 2026. כל עמוד מחושב מאותו מנוע שכר וכולל מס, ביטוח לאומי ופנסיה לפי ההנחות המוצגות.',
  alternates: { canonical: '/salary' },
};

const salaryGroups = [
  { label: 'עד 10,000 ₪', amounts: SALARY_PAGE_AMOUNTS.filter((amount) => amount <= 10_000) },
  {
    label: '10,500–15,000 ₪',
    amounts: SALARY_PAGE_AMOUNTS.filter((amount) => amount >= 10_500 && amount <= 15_000),
  },
  {
    label: '15,500–20,000 ₪',
    amounts: SALARY_PAGE_AMOUNTS.filter((amount) => amount >= 15_500 && amount <= 20_000),
  },
  { label: 'מעל 20,000 ₪', amounts: SALARY_PAGE_AMOUNTS.filter((amount) => amount >= 20_500) },
];

export default function SalaryIndexPage() {
  return (
    <CalculatorLayout
      title="ברוטו נטו לפי סכום שכר"
      description="בחרו את השכר החודשי כדי לפתוח אומדן מפורט של הנטו לשנת 2026."
      breadcrumbs={[
        { label: 'דף הבית', href: '/' },
        { label: 'מיסוי אישי', href: '/personal-tax' },
        { label: 'ברוטו נטו לפי שכר' },
      ]}
      pageUrl="/salary"
      lastUpdated="2026-10-02"
      quickAnswer={
        <p>
          הנטו אינו נקבע לפי הברוטו בלבד: נקודות זיכוי, הפרשות לפנסיה ורכיבי תלוש נוספים
          משנים את התוצאה. העמודים כאן מציגים תרחיש אחיד כדי לאפשר בדיקה ראשונית והשוואה בין
          סכומי שכר. בכל עמוד מפורטות ההנחות, מדרגות המס וההשפעה של מספר נקודות זיכוי שונה.
        </p>
      }
      content={
        <>
          <h2>בחרו שכר ברוטו חודשי</h2>
          <p>
            הסכומים מחושבים בזמן בניית האתר באמצעות אותו מנוע של{' '}
            <Link href="/personal-tax/salary-net-gross">מחשבון ברוטו נטו המלא</Link>. אם השכר
            שלכם אינו מופיע ברשימה, השתמשו במחשבון והזינו את הסכום המדויק ואת נקודות הזיכוי.
          </p>
          <div className="not-prose space-y-7 my-8">
            {salaryGroups.map((group) => (
              <section key={group.label} aria-labelledby={`salary-${group.amounts[0]}`}>
                <h3 id={`salary-${group.amounts[0]}`} className="text-xl font-bold text-ink mb-3">
                  {group.label}
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                  {group.amounts.map((amount) => (
                    <Link
                      key={amount}
                      href={`/salary/${amount}`}
                      className="min-h-12 flex items-center justify-center border border-ink/20 bg-paper px-3 py-2 font-medium text-ink hover:border-gold hover:text-gold transition"
                    >
                      {amount.toLocaleString('he-IL')} ₪
                    </Link>
                  ))}
                </div>
              </section>
            ))}
          </div>
          <h2>מה האומדן כולל?</h2>
          <p>
            עמודי הסכומים מציגים מס הכנסה לפי מדרגות 2026, נקודות זיכוי בסיסיות, דמי ביטוח
            לאומי ובריאות ותרחיש עם הפקדת עובד לפנסיה. הם אינם תלוש אישי ואינם כוללים כל
            הטבת מס, הסכם עבודה או רכיב שכר אפשרי.
          </p>
        </>
      }
    />
  );
}
