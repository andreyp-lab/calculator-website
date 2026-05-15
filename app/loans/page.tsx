import Link from 'next/link';
import { Metadata } from 'next';
import { ArrowLeft, Home, CreditCard, BarChart3, CheckCircle, Sparkles, TrendingDown } from 'lucide-react';
import { Breadcrumbs } from '@/components/calculator/Breadcrumbs';

export const metadata: Metadata = {
  title: 'הלוואות - כל המחשבונים במקום אחד 2026 | FinCalc',
  description:
    'כל מחשבוני ההלוואות בישראל - משכנתא, אופטימייזר תמהיל, הלוואה אישית, השוואת הלוואות, כושר החזר. עדכני 2026.',
  alternates: { canonical: '/loans' },
};

interface Calculator {
  title: string;
  description: string;
  href: string;
  icon: typeof Home;
  badge?: string;
  highlight?: boolean;
  features: string[];
}

const featured: Calculator[] = [
  {
    title: 'מחשבון משכנתא',
    description: 'חישוב תשלום חודשי, השוואת מסלולים מעורבים, מחזור, פירעון מוקדם וכושר החזר',
    href: '/real-estate/mortgage',
    icon: Home,
    badge: '5 טאבים',
    highlight: true,
    features: [
      'שפיצר / קרן שווה',
      'משכנתא מעורבת (2-5 מסלולים)',
      'חישוב מחזור (Refinancing)',
      'פירעון מוקדם וחיסכון',
      'בדיקת כושר החזר',
    ],
  },
  {
    title: 'אופטימייזר תמהיל משכנתא',
    description: 'הכלי הייחודי שלנו - מצא את החלוקה האופטימלית בין מסלולים. סגנון Solver של Excel',
    href: '/real-estate/mortgage-optimizer',
    icon: Sparkles,
    badge: '🆕 חדש',
    highlight: true,
    features: [
      'אלגוריתם אופטימיזציה אמיתי',
      'מטרות: עלות / סיכון / חודשי',
      'אילוצים רגולטוריים (33% קבועה)',
      'תרחישי קיצון (אינפלציה, פריים)',
      'השוואה להצעת הבנק',
    ],
  },
];

const others: Calculator[] = [
  {
    title: 'הלוואה אישית',
    description: 'חישוב + APR אמיתי + השוואת 6 מקורות + Snowball/Avalanche לסילוק חוב',
    href: '/savings/personal-loan',
    icon: CreditCard,
    badge: '6 טאבים',
    features: [
      'PMT + לוח סילוקין מלא',
      'APR אמיתי (כולל עמלות)',
      '6 מקורות: בנק / קרן השתלמות / כרטיס / משפחה',
      'Snowball vs Avalanche',
      'כרטיס אשראי vs הלוואה',
    ],
  },
  {
    title: 'השוואת הלוואות',
    description: 'השוואה צד-ליד-צד, איחוד הלוואות, ניתוח חוב מקיף',
    href: '/savings/loan-repayment',
    icon: BarChart3,
    badge: '5 טאבים',
    features: [
      'עד 5 הצעות במקביל',
      'דירוג לפי עלות אמיתית',
      'איחוד הלוואות + חיסכון',
      'פירעון מוקדם',
      'אמורטיזציה מלאה',
    ],
  },
  {
    title: 'כושר החזר הלוואה',
    description: 'כמה הלוואה אתה יכול לקבל? בדיקה לפי DTI + הכנסה + התחייבויות',
    href: '/tools/loan-eligibility',
    icon: CheckCircle,
    features: [
      'DTI gauge ויזואלי',
      'מגבלות בנקאיות',
      'התחייבויות קיימות',
      'המלצות אישיות',
    ],
  },
];

export default function LoansPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Breadcrumbs items={[{ label: 'דף הבית', href: '/' }, { label: 'הלוואות' }]} />
        </div>

        {/* Hero */}
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 md:p-10 text-white mb-10 relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: 'radial-gradient(circle at 30% 70%, white 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }}
          />
          <div className="relative z-10 max-w-3xl">
            <div className="flex items-center gap-2 mb-3">
              <TrendingDown className="w-8 h-8" />
              <span className="text-xs font-medium bg-white/20 px-2 py-1 rounded">
                כל ההלוואות במקום אחד
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold mb-3 leading-tight">
              מחשבוני הלוואות 2026
            </h1>
            <p className="text-blue-100 text-base md:text-lg mb-4">
              5 כלים מקצועיים לכל סוג הלוואה - משכנתא, אישית, איחוד חובות, ובדיקת כושר.
              עם <strong>אופטימייזר משכנתא בלעדי</strong> שמוצא את התמהיל האידיאלי בשבילך.
            </p>
            <div className="flex flex-wrap gap-2 text-sm">
              <span className="bg-white/15 px-3 py-1 rounded-full">משכנתא מעורבת</span>
              <span className="bg-white/15 px-3 py-1 rounded-full">מחזור משכנתא</span>
              <span className="bg-white/15 px-3 py-1 rounded-full">פירעון מוקדם</span>
              <span className="bg-white/15 px-3 py-1 rounded-full">איחוד חובות</span>
              <span className="bg-white/15 px-3 py-1 rounded-full">APR אמיתי</span>
            </div>
          </div>
        </div>

        {/* Featured */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-5 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-amber-500" />
            הכלים המרכזיים
          </h2>
          <div className="grid md:grid-cols-2 gap-5">
            {featured.map((calc) => {
              const Icon = calc.icon;
              return (
                <Link
                  key={calc.href}
                  href={calc.href}
                  className="group block bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 hover:border-blue-400 hover:shadow-xl rounded-2xl p-6 transition"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="bg-white p-3 rounded-xl">
                      <Icon className="w-7 h-7 text-blue-600" />
                    </div>
                    {calc.badge && (
                      <span className="bg-blue-600 text-white text-xs font-bold px-2.5 py-1 rounded">
                        {calc.badge}
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-700 transition">
                    {calc.title}
                  </h3>
                  <p className="text-sm text-gray-700 mb-4 leading-relaxed">
                    {calc.description}
                  </p>
                  <ul className="space-y-1 mb-4">
                    {calc.features.map((f, i) => (
                      <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                        <span className="text-blue-500 mt-0.5">✓</span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="flex items-center gap-2 text-blue-600 text-sm font-medium pt-3 border-t border-blue-200">
                    <span>פתח את המחשבון</span>
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition" />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Others */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-5">
            מחשבונים נוספים
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            {others.map((calc) => {
              const Icon = calc.icon;
              return (
                <Link
                  key={calc.href}
                  href={calc.href}
                  className="group block bg-white border-2 border-gray-200 hover:border-blue-300 hover:shadow-md rounded-xl p-5 transition"
                >
                  <div className="flex items-start justify-between mb-3">
                    <Icon className="w-6 h-6 text-blue-600" />
                    {calc.badge && (
                      <span className="bg-gray-100 text-gray-700 text-xs font-medium px-2 py-0.5 rounded">
                        {calc.badge}
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1.5 group-hover:text-blue-600 transition">
                    {calc.title}
                  </h3>
                  <p className="text-xs text-gray-600 mb-3 leading-relaxed">
                    {calc.description}
                  </p>
                  <ul className="space-y-0.5 mb-3">
                    {calc.features.map((f, i) => (
                      <li key={i} className="text-xs text-gray-600 flex items-start gap-1.5">
                        <span className="text-blue-400 mt-0.5">·</span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="flex items-center gap-2 text-blue-600 text-xs font-medium pt-2 border-t border-gray-100">
                    <span>פתח</span>
                    <ArrowLeft className="w-3 h-3" />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Tips */}
        <section className="bg-amber-50 border-2 border-amber-200 rounded-xl p-6">
          <h3 className="font-bold text-amber-900 mb-3 flex items-center gap-2">
            💡 איך לבחור את המחשבון הנכון?
          </h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-amber-900">
            <div>
              <strong className="block mb-1">🏠 רכישת דירה?</strong>
              <p className="leading-relaxed">
                התחל ב<Link href="/real-estate/mortgage-optimizer" className="underline">אופטימייזר משכנתא</Link>{' '}
                למציאת התמהיל הנכון, ואז ב<Link href="/real-estate/mortgage" className="underline">מחשבון המשכנתא</Link>{' '}
                לחישוב מפורט.
              </p>
            </div>
            <div>
              <strong className="block mb-1">💳 חוב בכרטיס אשראי?</strong>
              <p className="leading-relaxed">
                ב<Link href="/savings/personal-loan" className="underline">הלוואה אישית</Link>{' '}
                תוכל לחשב כמה תחסוך אם תחליף לחוב לאיחוד הלוואות בריבית נמוכה יותר.
              </p>
            </div>
            <div>
              <strong className="block mb-1">📊 כמה הצעות מהבנקים?</strong>
              <p className="leading-relaxed">
                <Link href="/savings/loan-repayment" className="underline">השוואת הלוואות</Link>{' '}
                מדרגת אותן לפי עלות אמיתית - כולל APR שמכלילה עמלות נסתרות.
              </p>
            </div>
            <div>
              <strong className="block mb-1">❓ לא בטוח אם תאושר?</strong>
              <p className="leading-relaxed">
                <Link href="/tools/loan-eligibility" className="underline">כושר החזר</Link>{' '}
                בודק את ה-DTI שלך ומראה אם הבנק יאשר את הסכום הרצוי.
              </p>
            </div>
          </div>
        </section>

        {/* Cross-links */}
        <div className="mt-8 text-center bg-gray-50 rounded-xl p-5 border border-gray-200">
          <p className="text-sm text-gray-700 mb-3">חזרה לקטגוריות אחרות:</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/real-estate"
              className="px-4 py-2 bg-white border border-blue-300 rounded-lg text-sm hover:bg-blue-50 hover:border-blue-500 transition"
            >
              🏠 משכנתא ונדל"ן
            </Link>
            <Link
              href="/savings"
              className="px-4 py-2 bg-white border border-blue-300 rounded-lg text-sm hover:bg-blue-50 hover:border-blue-500 transition"
            >
              💰 חיסכון וחובות
            </Link>
            <Link
              href="/topics"
              className="px-4 py-2 bg-white border border-blue-300 rounded-lg text-sm hover:bg-blue-50 hover:border-blue-500 transition"
            >
              📂 נושאים אחרים
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
