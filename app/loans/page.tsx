import Link from 'next/link';
import { Metadata } from 'next';
import { ArrowLeft, Home, CreditCard, BarChart3, CheckCircle, Sparkles, TrendingDown } from 'lucide-react';
import { Breadcrumbs } from '@/components/calculator/Breadcrumbs';

export const metadata: Metadata = {
  title: 'מחשבוני הלוואות ומשכנתא בישראל 2026 - כל הכלים במקום אחד',
  description:
    'כל מחשבוני ההלוואות בישראל — משכנתא, אופטימייזר תמהיל, הלוואה אישית, השוואת הלוואות וכושר החזר. נתונים עדכניים 2026. השתמש עכשיו — ללא הרשמה, חינם.',
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
    <div className="min-h-screen bg-cream">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Breadcrumbs items={[{ label: 'דף הבית', href: '/' }, { label: 'הלוואות' }]} />
        </div>

        {/* Hero */}
        <div className="bg-ink-deep border border-cream/15 p-6 md:p-10 text-cream mb-10 relative overflow-hidden">
          <div className="relative z-10 max-w-3xl">
            <div className="flex items-center gap-2 mb-3">
              <TrendingDown className="w-8 h-8 text-gold-light" />
              <p className="font-mono text-xs uppercase tracking-[0.14em] text-gold-light">
                // כל ההלוואות במקום אחד ✦
              </p>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold mb-3 leading-tight">
              מחשבוני הלוואות 2026
            </h1>
            <p className="text-cream/70 text-base md:text-lg mb-4">
              5 כלים מקצועיים לכל סוג הלוואה - משכנתא, אישית, איחוד חובות, ובדיקת כושר.
              עם <strong className="text-cream">אופטימייזר משכנתא בלעדי</strong> שמוצא את התמהיל האידיאלי בשבילך.
            </p>
            <div className="flex flex-wrap gap-2 text-sm">
              <span className="border border-cream/20 text-cream/80 px-3 py-1 font-mono text-xs">משכנתא מעורבת</span>
              <span className="border border-cream/20 text-cream/80 px-3 py-1 font-mono text-xs">מחזור משכנתא</span>
              <span className="border border-cream/20 text-cream/80 px-3 py-1 font-mono text-xs">פירעון מוקדם</span>
              <span className="border border-cream/20 text-cream/80 px-3 py-1 font-mono text-xs">איחוד חובות</span>
              <span className="border border-cream/20 text-cream/80 px-3 py-1 font-mono text-xs">APR אמיתי</span>
            </div>
          </div>
        </div>

        {/* Featured */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-ink mb-5 flex items-center gap-2">
            <span className="text-gold">✦</span>
            הכלים המרכזיים
          </h2>
          <div className="grid md:grid-cols-2 gap-5">
            {featured.map((calc) => {
              const Icon = calc.icon;
              return (
                <Link
                  key={calc.href}
                  href={calc.href}
                  className="group block bg-paper border border-ink/15 hover:bg-paper-hover hover:border-ink/25 p-6 transition"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="border border-ink/15 p-3 bg-cream">
                      <Icon className="w-7 h-7 text-ink-mid" />
                    </div>
                    {calc.badge && (
                      <span className="bg-ink text-cream text-xs font-bold px-2.5 py-1 font-mono uppercase tracking-[0.1em]">
                        {calc.badge}
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-ink mb-2 group-hover:text-gold transition">
                    {calc.title}
                  </h3>
                  <p className="text-sm text-ink/70 mb-4 leading-relaxed">
                    {calc.description}
                  </p>
                  <ul className="space-y-1 mb-4">
                    {calc.features.map((f, i) => (
                      <li key={i} className="text-sm text-ink/60 flex items-start gap-2">
                        <span className="text-gold mt-0.5">✦</span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="flex items-center gap-2 text-gold text-sm font-medium pt-3 border-t border-ink/10">
                    <span>פתח את המחשבון</span>
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition" />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Others */}
        <section className="mb-10 bg-cream-2 border border-ink/15 p-6 md:p-8">
          <h2 className="text-2xl font-bold text-ink mb-5">
            מחשבונים נוספים
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            {others.map((calc) => {
              const Icon = calc.icon;
              return (
                <Link
                  key={calc.href}
                  href={calc.href}
                  className="group block bg-paper border border-ink/15 hover:bg-paper-hover hover:border-ink/25 p-5 transition"
                >
                  <div className="flex items-start justify-between mb-3">
                    <Icon className="w-6 h-6 text-ink-mid" />
                    {calc.badge && (
                      <span className="bg-cream border border-ink/15 text-ink text-xs font-mono uppercase tracking-[0.1em] px-2 py-0.5">
                        {calc.badge}
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-ink mb-1.5 group-hover:text-gold transition">
                    {calc.title}
                  </h3>
                  <p className="text-xs text-ink/60 mb-3 leading-relaxed">
                    {calc.description}
                  </p>
                  <ul className="space-y-0.5 mb-3">
                    {calc.features.map((f, i) => (
                      <li key={i} className="text-xs text-ink/50 flex items-start gap-1.5">
                        <span className="text-gold mt-0.5">·</span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="flex items-center gap-2 text-gold text-xs font-medium pt-2 border-t border-ink/10">
                    <span>פתח</span>
                    <ArrowLeft className="w-3 h-3" />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Tips */}
        <section className="bg-paper border border-ink/15 p-6 mb-8">
          <h3 className="font-bold text-ink mb-3 flex items-center gap-2">
            <span className="text-gold">✦</span>
            איך לבחור את המחשבון הנכון?
          </h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-ink/80">
            <div className="border-b border-ink/10 pb-4 md:border-b-0 md:border-l md:border-ink/10 md:pl-4">
              <strong className="block mb-1 text-ink">🏠 רכישת דירה?</strong>
              <p className="leading-relaxed">
                התחל ב<Link href="/real-estate/mortgage-optimizer" className="text-gold hover:text-gold-2 underline transition">אופטימייזר משכנתא</Link>{' '}
                למציאת התמהיל הנכון, ואז ב<Link href="/real-estate/mortgage" className="text-gold hover:text-gold-2 underline transition">מחשבון המשכנתא</Link>{' '}
                לחישוב מפורט.
              </p>
            </div>
            <div className="border-b border-ink/10 pb-4 md:border-b-0 md:border-l md:border-ink/10 md:pl-4">
              <strong className="block mb-1 text-ink">💳 חוב בכרטיס אשראי?</strong>
              <p className="leading-relaxed">
                ב<Link href="/savings/personal-loan" className="text-gold hover:text-gold-2 underline transition">הלוואה אישית</Link>{' '}
                תוכל לחשב כמה תחסוך אם תחליף לחוב לאיחוד הלוואות בריבית נמוכה יותר.
              </p>
            </div>
            <div className="border-b border-ink/10 pb-4 md:border-b-0 md:border-l md:border-ink/10 md:pl-4">
              <strong className="block mb-1 text-ink">📊 כמה הצעות מהבנקים?</strong>
              <p className="leading-relaxed">
                <Link href="/savings/loan-repayment" className="text-gold hover:text-gold-2 underline transition">השוואת הלוואות</Link>{' '}
                מדרגת אותן לפי עלות אמיתית - כולל APR שמכלילה עמלות נסתרות.
              </p>
            </div>
            <div>
              <strong className="block mb-1 text-ink">❓ לא בטוח אם תאושר?</strong>
              <p className="leading-relaxed">
                <Link href="/tools/loan-eligibility" className="text-gold hover:text-gold-2 underline transition">כושר החזר</Link>{' '}
                בודק את ה-DTI שלך ומראה אם הבנק יאשר את הסכום הרצוי.
              </p>
            </div>
          </div>
        </section>

        {/* Cross-links */}
        <div className="text-center bg-cream-2 border border-ink/15 p-5">
          <p className="text-sm text-ink/70 mb-3">חזרה לקטגוריות אחרות:</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/real-estate"
              className="px-4 py-2 bg-paper border border-ink/20 text-sm hover:bg-paper-hover hover:border-ink/35 transition text-ink"
            >
              🏠 משכנתא ונדל&quot;ן
            </Link>
            <Link
              href="/savings"
              className="px-4 py-2 bg-paper border border-ink/20 text-sm hover:bg-paper-hover hover:border-ink/35 transition text-ink"
            >
              💰 חיסכון וחובות
            </Link>
            <Link
              href="/topics"
              className="px-4 py-2 bg-paper border border-ink/20 text-sm hover:bg-paper-hover hover:border-ink/35 transition text-ink"
            >
              📂 נושאים אחרים
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
