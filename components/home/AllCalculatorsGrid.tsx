import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

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
      { title: 'החזר מס', href: '/personal-tax/tax-refund', badge: '⭐' },
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
      { title: 'סימולטור מס שנתי', href: '/self-employed/year-end-tax-simulator', badge: '⭐' },
      { title: 'נטו לעצמאי', href: '/self-employed/net' },
      { title: 'ביטוח לאומי', href: '/self-employed/social-security' },
      { title: 'מחשבון מע"מ', href: '/self-employed/vat' },
      { title: 'מקדמות מס', href: '/self-employed/tax-advances' },
      { title: 'הוצאות מוכרות', href: '/self-employed/allowed-expenses', badge: '🆕' },
      { title: 'תקרת עוסק פטור', href: '/self-employed/vat-threshold', badge: '🆕' },
      { title: 'שכיר + עצמאי', href: '/self-employed/employee-and-self-employed', badge: '🆕' },
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
      { title: 'מחשבון משכנתא', href: '/real-estate/mortgage', badge: '⭐' },
      { title: 'אופטימייזר תמהיל', href: '/real-estate/mortgage-optimizer', badge: '🆕' },
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

const COLOR_STYLES: Record<string, { border: string; bg: string; text: string; hover: string }> = {
  blue: { border: 'border-blue-200', bg: 'bg-blue-50', text: 'text-blue-700', hover: 'hover:border-blue-400 hover:bg-blue-100' },
  green: { border: 'border-green-200', bg: 'bg-green-50', text: 'text-green-700', hover: 'hover:border-green-400 hover:bg-green-100' },
  purple: { border: 'border-purple-200', bg: 'bg-purple-50', text: 'text-purple-700', hover: 'hover:border-purple-400 hover:bg-purple-100' },
  amber: { border: 'border-amber-200', bg: 'bg-amber-50', text: 'text-amber-700', hover: 'hover:border-amber-400 hover:bg-amber-100' },
  emerald: { border: 'border-emerald-200', bg: 'bg-emerald-50', text: 'text-emerald-700', hover: 'hover:border-emerald-400 hover:bg-emerald-100' },
  red: { border: 'border-red-200', bg: 'bg-red-50', text: 'text-red-700', hover: 'hover:border-red-400 hover:bg-red-100' },
};

export function AllCalculatorsGrid() {
  const totalCalcs = GROUPS.reduce((sum, g) => sum + g.calcs.length, 0);

  return (
    <section id="all-calculators" className="max-w-6xl mx-auto px-4 py-16 scroll-mt-20">
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          🧮 כל המחשבונים שלנו
        </h2>
        <p className="text-gray-600 text-lg">
          {totalCalcs} מחשבונים מקצועיים, מסודרים לפי קטגוריות. עדכני לחוק 2026.
        </p>
      </div>

      <div className="space-y-8">
        {GROUPS.map((group) => {
          const styles = COLOR_STYLES[group.color];
          return (
            <div
              key={group.title}
              className={`rounded-xl border-2 ${styles.border} ${styles.bg} p-6`}
            >
              <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                <h3 className={`text-xl font-bold ${styles.text} flex items-center gap-2`}>
                  <span className="text-2xl">{group.icon}</span>
                  {group.title}
                  <span className="text-sm font-normal text-gray-500">
                    ({group.calcs.length})
                  </span>
                </h3>
                <Link
                  href={group.href}
                  className={`text-sm font-medium ${styles.text} hover:underline flex items-center gap-1`}
                >
                  כל הקטגוריה
                  <ArrowLeft className="w-3 h-3" />
                </Link>
              </div>

              <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {group.calcs.map((calc) => (
                  <li key={calc.href}>
                    <Link
                      href={calc.href}
                      className={`block bg-white border ${styles.border} rounded-lg px-3 py-2.5 text-sm text-gray-800 ${styles.hover} transition group`}
                    >
                      <span className="flex items-center justify-between gap-1">
                        <span className="flex items-center gap-1.5">
                          {calc.badge && <span>{calc.badge}</span>}
                          <span className="group-hover:font-medium transition">{calc.title}</span>
                        </span>
                        <ArrowLeft className={`w-3 h-3 ${styles.text} opacity-0 group-hover:opacity-100 transition`} />
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      {/* Cross-link to Pillar Guides for stronger internal link graph */}
      <div className="mt-10 bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-200 rounded-xl p-6">
        <h3 className="text-lg font-bold text-indigo-900 mb-3 flex items-center gap-2">
          📚 מדריכים מקיפים
        </h3>
        <div className="grid sm:grid-cols-3 gap-3">
          <Link
            href="/guides/mortgage-complete-guide-2026"
            className="block bg-white border border-indigo-200 hover:border-indigo-400 rounded-lg px-4 py-3 text-sm text-indigo-800 transition hover:bg-indigo-50"
          >
            🏠 המדריך המלא למשכנתא 2026
          </Link>
          <Link
            href="/guides/taxes-complete-guide-2026"
            className="block bg-white border border-indigo-200 hover:border-indigo-400 rounded-lg px-4 py-3 text-sm text-indigo-800 transition hover:bg-indigo-50"
          >
            💰 המדריך המלא למיסים 2026
          </Link>
          <Link
            href="/guides/employee-rights-complete-guide"
            className="block bg-white border border-indigo-200 hover:border-indigo-400 rounded-lg px-4 py-3 text-sm text-indigo-800 transition hover:bg-indigo-50"
          >
            👤 זכויות עובדים - המדריך
          </Link>
        </div>
      </div>
    </section>
  );
}
