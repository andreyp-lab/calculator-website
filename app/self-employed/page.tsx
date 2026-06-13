import Link from 'next/link';
import { Metadata } from 'next';
import { ArrowLeft, Calculator, LayoutDashboard, Wallet, TrendingUp, BarChart3, LineChart, Target } from 'lucide-react';
import { Breadcrumbs } from '@/components/calculator/Breadcrumbs';

/** כלים מתקדמים לניהול פיננסי של העסק (B2B) */
const businessTools = [
  { href: '/tools/unified', icon: LayoutDashboard, title: 'מערכת מאוחדת', description: 'תקציב + תזרים + ניתוח דוחות במקום אחד', badge: 'מומלץ' },
  { href: '/tools/budget-wizard', icon: Target, title: 'אשף תקציב חכם', description: '10 שאלות מודרכות → תקציב שנתי מוכן' },
  { href: '/tools/cash-flow', icon: Wallet, title: 'תזרים מזומנים', description: 'יתרות בנק, תחזיות והתראות גירעון' },
  { href: '/tools/budget', icon: TrendingUp, title: 'תכנון תקציב', description: 'P&L, הכנסות, הוצאות ועובדים' },
  { href: '/tools/financial-analysis', icon: BarChart3, title: 'ניתוח דוחות', description: 'יחסים פיננסיים, Z-Score ודירוג אשראי' },
  { href: '/tools/forecast', icon: LineChart, title: 'חיזוי פיננסי', description: 'תחזיות הכנסה ותרחישים' },
];

export const metadata: Metadata = {
  alternates: { canonical: '/self-employed' },
  title: 'מחשבונים לעצמאים ועסקים 2026 - מע"מ, ב.ל., מס ונטו',
  description: 'מחשבונים מקצועיים לעצמאיים ופרילנסרים 2026: מע"מ 18%, ביטוח לאומי, מקדמות מס הכנסה, נטו, תמחור שעה ועוד. גלה כמה נשאר לך ביד — חינמי ומדויק.',
};

const calculators = [
  {
    title: '📘 מדריך פתיחת עסק — עוסק פטור או מורשה?',
    description: 'מתחילים עסק? המדריך המלא לבחירה בין עוסק פטור למורשה, רישום מול הרשויות, תקרת 122,833 ₪ וטעויות נפוצות',
    href: '/self-employed/opening-business',
    available: true,
  },
  {
    title: '⭐ סימולטור הערכת מס לסוף שנה',
    description: 'הכלי המקיף ביותר: הכנסות + הוצאות + פנסיה + ב.ל. + מקדמות - הערכת חבות מס מלאה לסוף השנה',
    href: '/self-employed/year-end-tax-simulator',
    available: true,
  },
  {
    title: '💰 מחשבון נטו לעצמאי',
    description: 'כמה כסף נשאר ביד בסוף החודש? המרה מהירה ממחזור לנטו אחרי מס, ב.ל., מע"מ ופנסיה',
    href: '/self-employed/net',
    available: true,
  },
  {
    title: 'מחשבון מע"מ',
    description: 'הוספת או חילוץ מע"מ (18% ב-2026)',
    href: '/self-employed/vat',
    available: true,
  },
  {
    title: '🆕 מחשבון תקרת עוסק פטור',
    description: 'בדוק אם חצית את תקרת 122,833 ₪ — מה קורה בחריגה ומתי חובה לעבור לעוסק מורשה',
    href: '/self-employed/vat-threshold',
    available: true,
  },
  {
    title: '🆕 מחשבון הוצאות מוכרות לעצמאי',
    description: 'אילו הוצאות מוכרות במס וכמה — רכב 45%, טלפון, חדר עבודה, כיבוד 80% ועוד',
    href: '/self-employed/allowed-expenses',
    available: true,
  },
  {
    title: '🆕 מחשבון שכיר + עצמאי',
    description: 'עובד גם כשכיר וגם כפרילנסר? כמה באמת נשאר מההכנסה המשולבת אחרי מס וב.ל.',
    href: '/self-employed/employee-and-self-employed',
    available: true,
  },
  {
    title: '🆕 כמה עולה לפתוח עסק?',
    description: 'כל עלויות פתיחת העסק בשקלים — אגרות, רו"ח, ביטוחים וציוד',
    href: '/self-employed/business-setup-cost',
    available: true,
  },
  {
    title: '🆕 חשבונית מס, חשבונית עסקה או קבלה?',
    description: 'המדריך המלא לסוגי המסמכים — מה מוציאים, מתי, וההבדלים בין עוסק פטור למורשה',
    href: '/self-employed/invoices',
    available: true,
  },
  {
    title: 'מחשבון ביטוח לאומי לעצמאי',
    description: 'חישוב ב.ל. + בריאות, השוואה לשכיר, הטבת מס 52%, תיאום שנתי וזכויות',
    href: '/self-employed/social-security',
    available: true,
  },
  {
    title: 'מחשבון מקדמות מס',
    description: 'מקדמות מס הכנסה + ב.ל. + מע"מ - חישוב מלא, תזרים מזומנים, תיאום אמצע שנה',
    href: '/self-employed/tax-advances',
    available: true,
  },
  {
    title: 'מחשבון תמחור שעת עבודה',
    description: 'חישוב מחיר שעה לפרילנסר/יועץ - שכר רצוי + הוצאות + רווח',
    href: '/self-employed/hourly-rate',
    available: true,
  },
  {
    title: 'מחשבון עלות מעסיק',
    description: 'כמה עולה להעסיק עובד - שכר + ביטוח לאומי + פנסיה + הטבות',
    href: '/self-employed/employer-cost',
    available: true,
  },
  {
    title: 'חברה בע"מ vs עוסק מורשה',
    description: 'השוואת מס מצרפי - איזה מבנה עסקי משתלם יותר',
    href: '/self-employed/corporation-vs-individual',
    available: true,
  },
  {
    title: 'דיבידנד vs משכורת',
    description: 'אופטימיזציית מס לבעל חברה - מציאת המיקס האופטימלי',
    href: '/self-employed/dividend-vs-salary',
    available: true,
  },
];

export default function SelfEmployedPage() {
  return (
    <div className="min-h-screen bg-cream">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Breadcrumbs items={[{ label: 'דף הבית', href: '/' }, { label: 'עצמאיים' }]} />
        </div>

        {/* Hero */}
        <div className="bg-ink-deep border border-cream/15 p-6 md:p-10 text-cream mb-8">
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-gold-light mb-3">
            // מרכז עצמאיים ✦
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-cream mb-3">מחשבונים לעצמאיים</h1>
          <p className="text-cream/70 text-lg mb-0">
            מחשבונים מקצועיים לעצמאיים, פרילנסרים ובעלי עסקים קטנים
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {calculators.map((calc) =>
            calc.available ? (
              <Link
                key={calc.href}
                href={calc.href}
                className="group bg-paper border border-ink/15 hover:bg-paper-hover transition p-6 flex items-start gap-4"
              >
                <Calculator className="w-6 h-6 text-ink-mid flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h3 className="font-bold text-ink mb-1 group-hover:text-gold transition">
                    {calc.title}
                  </h3>
                  <p className="text-sm text-ink/60">{calc.description}</p>
                </div>
                <ArrowLeft className="w-4 h-4 text-gold mt-2 opacity-0 group-hover:opacity-100 transition" />
              </Link>
            ) : (
              <div
                key={calc.href}
                className="bg-cream-2 border border-ink/10 p-6 flex items-start gap-4 opacity-60"
              >
                <Calculator className="w-6 h-6 text-ink/30 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h3 className="font-bold text-ink/60 mb-1">{calc.title}</h3>
                  <p className="text-sm text-ink/40">{calc.description}</p>
                  <span className="inline-block mt-2 text-xs bg-ink/10 text-ink/50 px-2 py-1 font-mono uppercase tracking-[0.1em]">
                    בקרוב
                  </span>
                </div>
              </div>
            )
          )}
        </div>

        {/* כלים מתקדמים לניהול העסק (B2B) */}
        <section className="mt-14">
          <div className="mb-6">
            <p className="font-mono text-xs uppercase tracking-[0.14em] text-gold mb-2">
              ✦ כלים מתקדמים לניהול העסק
            </p>
            <h2 className="text-2xl font-bold text-ink">
              מעבר למחשבונים — <span className="font-serif italic font-normal text-gold">מערכת ניהול פיננסי מלאה</span>
            </h2>
            <p className="text-ink/60 mt-2 max-w-2xl">
              תקציב שנתי, תזרים מזומנים, ניתוח דוחות וחיזוי — הכלים שבנינו לניהול הכספים של העסק,
              בלי אקסלים מסורבלים. הנתונים נשמרים מקומית אצלך.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {businessTools.map((tool) => {
              const Icon = tool.icon;
              return (
                <Link
                  key={tool.href}
                  href={tool.href}
                  className="group bg-ink border border-ink/15 p-5 text-cream transition hover:bg-ink-deep flex flex-col"
                >
                  <div className="flex items-center justify-between mb-3">
                    <Icon className="w-6 h-6 text-gold-light" />
                    {tool.badge && (
                      <span className="font-mono text-[10px] uppercase tracking-[0.12em] bg-gold text-ink px-2 py-0.5">
                        {tool.badge}
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-cream mb-1 group-hover:text-gold-light transition">
                    {tool.title}
                  </h3>
                  <p className="text-sm text-cream/60 flex-1">{tool.description}</p>
                  <span className="mt-4 flex items-center gap-1 text-xs font-mono uppercase tracking-[0.1em] text-gold-light">
                    פתח <ArrowLeft className="w-3.5 h-3.5" />
                  </span>
                </Link>
              );
            })}
          </div>
          <div className="mt-4 text-center">
            <Link href="/tools" className="font-mono text-xs uppercase tracking-[0.12em] text-gold hover:text-gold-2">
              לכל הכלים העסקיים ←
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
