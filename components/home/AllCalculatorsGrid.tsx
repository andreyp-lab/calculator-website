import Link from 'next/link';

interface CalcLink {
  title: string;
  href: string;
  badge?: string;
}

interface CalcGroup {
  title: string;
  icon: string;
  href: string;
  color: string;
  calcs: CalcLink[];
}

const GROUPS: CalcGroup[] = [
  {
    title: 'מסים אישיים',
    icon: '💰',
    href: '/personal-tax',
    color: 'blue',
    calcs: [
      { title: 'החזר מס', href: '/personal-tax/tax-refund', badge: 'מומלץ' },
      { title: 'שכר נטו / ברוטו', href: '/personal-tax/salary-net-gross' },
      { title: 'מס הכנסה', href: '/personal-tax/income-tax' },
      { title: 'נקודות זיכוי', href: '/personal-tax/tax-credits' },
      { title: 'מענק עבודה', href: '/personal-tax/work-value' },
    ],
  },
  {
    title: 'זכויות עובדים',
    icon: '👤',
    href: '/employee-rights',
    color: 'green',
    calcs: [
      { title: 'פיצויי פיטורין', href: '/employee-rights/severance' },
      { title: 'דמי לידה', href: '/employee-rights/maternity-benefits' },
      { title: 'דמי אבטלה', href: '/employee-rights/unemployment-benefits' },
      { title: 'תשלום מילואים', href: '/employee-rights/reserve-duty-pay' },
      { title: 'שכר מינימום', href: '/employee-rights/minimum-wage' },
      { title: 'דמי הבראה', href: '/employee-rights/recreation-pay' },
      { title: 'חופשה שנתית', href: '/employee-rights/annual-leave' },
      { title: 'בונוס שנתי', href: '/employee-rights/annual-bonus' },
      { title: 'דמי מחלה', href: '/employee-rights/sick-pay' },
      { title: 'מענק עבודה', href: '/employee-rights/work-grant' },
    ],
  },
  {
    title: 'עצמאיים',
    icon: '💼',
    href: '/self-employed',
    color: 'purple',
    calcs: [
      { title: 'סימולטור מס שנתי', href: '/self-employed/year-end-tax-simulator', badge: 'מומלץ' },
      { title: 'נטו לעצמאי', href: '/self-employed/net' },
      { title: 'ביטוח לאומי', href: '/self-employed/social-security' },
      { title: 'מחשבון מע"מ', href: '/self-employed/vat' },
      { title: 'מקדמות מס', href: '/self-employed/tax-advances' },
      { title: 'הוצאות מוכרות', href: '/self-employed/allowed-expenses', badge: 'חדש' },
      { title: 'תקרת עוסק פטור', href: '/self-employed/vat-threshold', badge: 'חדש' },
      { title: 'שכיר + עצמאי', href: '/self-employed/employee-and-self-employed', badge: 'חדש' },
      { title: 'תמחור שעת עבודה', href: '/self-employed/hourly-rate' },
      { title: 'עלות מעסיק', href: '/self-employed/employer-cost' },
      { title: 'פנסיה חובה', href: '/self-employed/mandatory-pension' },
      { title: 'חברה מול עצמאי', href: '/self-employed/corporation-vs-individual' },
      { title: 'דיבידנד מול משכורת', href: '/self-employed/dividend-vs-salary' },
    ],
  },
  {
    title: 'משכנתא ונדל"ן',
    icon: '🏠',
    href: '/real-estate',
    color: 'amber',
    calcs: [
      { title: 'מחשבון משכנתא', href: '/real-estate/mortgage', badge: 'מומלץ' },
      { title: 'אופטימייזר תמהיל', href: '/real-estate/mortgage-optimizer', badge: 'חדש' },
      { title: 'מס רכישה', href: '/real-estate/purchase-tax' },
      { title: 'מס שבח', href: '/real-estate/capital-gains-tax' },
    ],
  },
  {
    title: 'השקעות וחיסכון',
    icon: '📈',
    href: '/investments',
    color: 'emerald',
    calcs: [
      { title: 'ריבית דריבית', href: '/investments/compound-interest' },
      { title: 'תכנון פרישה', href: '/investments/retirement' },
      { title: 'FIRE - עצמאות פיננסית', href: '/investments/fire' },
      { title: 'תשואה (ROI)', href: '/investments/roi' },
      { title: 'תקציב משפחתי', href: '/savings/family-budget' },
      { title: 'הלוואה אישית', href: '/savings/personal-loan' },
      { title: 'השוואת הלוואות', href: '/savings/loan-repayment' },
      { title: 'פנסיה', href: '/insurance/pension' },
    ],
  },
  {
    title: 'רכב ותחבורה',
    icon: '🚗',
    href: '/vehicles',
    color: 'red',
    calcs: [
      { title: 'ליסינג מול קנייה', href: '/vehicles/leasing-vs-buying' },
      { title: 'עלות דלק שנתית', href: '/vehicles/fuel-cost' },
      { title: 'שווי שימוש רכב', href: '/vehicles/company-car-benefit' },
    ],
  },
];

export function AllCalculatorsGrid() {
  return (
    <section id="all-calculators" className="mx-auto mt-14 max-w-6xl px-4 scroll-mt-20">
      <div className="space-y-12">
        {GROUPS.map((group, groupIdx) => (
          <div key={group.title}>
            {/* כותרת קטגוריה */}
            <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-ink/15 pb-3">
              <h3 className="flex items-baseline gap-3 text-2xl font-black text-ink">
                <span className="font-mono text-sm text-ink/40">
                  {String(groupIdx + 1).padStart(2, '0')}
                </span>
                {group.title}
                <span className="font-mono text-xs uppercase tracking-[0.1em] text-gold">
                  {group.calcs.length} כלים
                </span>
              </h3>
              <Link
                href={group.href}
                className="group flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.1em] text-ink/60 transition hover:text-gold"
              >
                כל הקטגוריה
                <span className="text-gold transition-transform group-hover:-translate-x-1" aria-hidden="true">
                  ←
                </span>
              </Link>
            </div>

            {/* גריד תאי מחשבונים */}
            <ul className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {group.calcs.map((calc) => (
                <li key={calc.href}>
                  <Link
                    href={calc.href}
                    className="group flex h-full items-center justify-between gap-2 border border-ink/14 bg-paper px-4 py-3 text-sm text-ink transition hover:bg-paper-hover"
                  >
                    <span className="flex items-center gap-2">
                      <span className="font-medium transition group-hover:text-gold">
                        {calc.title}
                      </span>
                      {calc.badge && (
                        <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-gold">
                          {calc.badge}
                        </span>
                      )}
                    </span>
                    <span className="text-gold opacity-0 transition-all group-hover:-translate-x-1 group-hover:opacity-100" aria-hidden="true">
                      ←
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* קישור למדריכים המקיפים — חיזוק גרף הקישורים הפנימי */}
      <div className="mt-14 border border-ink/15 bg-cream-2 p-7">
        <p className="font-mono text-xs uppercase tracking-[0.14em] text-gold">
          ✦ מדריכים מקיפים
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <Link
            href="/guides/mortgage-complete-guide-2026"
            className="group flex items-center justify-between border border-ink/14 bg-paper px-4 py-3 text-sm font-medium text-ink transition hover:bg-paper-hover hover:text-gold"
          >
            המדריך המלא למשכנתא 2026
            <span className="text-gold opacity-0 transition group-hover:opacity-100" aria-hidden="true">←</span>
          </Link>
          <Link
            href="/guides/taxes-complete-guide-2026"
            className="group flex items-center justify-between border border-ink/14 bg-paper px-4 py-3 text-sm font-medium text-ink transition hover:bg-paper-hover hover:text-gold"
          >
            המדריך המלא למיסים 2026
            <span className="text-gold opacity-0 transition group-hover:opacity-100" aria-hidden="true">←</span>
          </Link>
          <Link
            href="/guides/employee-rights-complete-guide"
            className="group flex items-center justify-between border border-ink/14 bg-paper px-4 py-3 text-sm font-medium text-ink transition hover:bg-paper-hover hover:text-gold"
          >
            זכויות עובדים — המדריך
            <span className="text-gold opacity-0 transition group-hover:opacity-100" aria-hidden="true">←</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
