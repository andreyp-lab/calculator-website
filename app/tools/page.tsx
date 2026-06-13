import { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowLeft,
  Landmark,
  Scale,
  Gem,
  Users,
  CheckCircle2,
  Zap,
  TrendingUp,
  Wallet,
  BarChart3,
  type LucideIcon,
} from 'lucide-react';

export const metadata: Metadata = {
  alternates: { canonical: '/tools' },
  title: 'מערכת פיננסית לבעלי עסקים 2026 - תקציב, תזרים, DCF ועוד',
  description:
    'המערכת המקיפה ביותר בישראל לתכנון פיננסי: תקציב, תזרים, ניתוח דוחות, חיזוי 5 שנים, הערכת שווי DCF, Cap Table. עברית מלאה, ללא הרשמה. | חינם.',
};

interface Tool {
  href: string;
  title: string;
  emoji: string;
  description: string;
  icon: LucideIcon;
  features: string[];
}

const STANDALONE_CALCULATORS: Tool[] = [
  {
    href: '/tools/loan-eligibility',
    title: 'הלוואות בערבות מדינה',
    emoji: '🏦',
    description: 'בדוק זכאות תוך דקה - 6 מסלולים שונים כולל חרבות ברזל',
    icon: Landmark,
    features: ['עסק בהקמה / קטן / בינוני', 'מסלול יצואן ותעשייה', 'מסלול חרבות ברזל'],
  },
  {
    href: '/tools/break-even',
    title: 'נקודת איזון מהירה',
    emoji: '⚖️',
    description: 'חישוב נקודת איזון פשוטה לפי מחיר ועלות יחידה',
    icon: Scale,
    features: ['חישוב מינימום מכירות', 'מרווח ביטחון', 'מתאים לבדיקה מהירה'],
  },
  {
    href: '/tools/business-valuation',
    title: 'הערכת שווי עסק (פשוט)',
    emoji: '💎',
    description: '3 שיטות מהירות: DCF, מכפיל EBITDA, מכפיל הכנסות',
    icon: Gem,
    features: ['מכפילים ענפיים 2026', 'Terminal Value', 'טווח שווי'],
  },
  {
    href: '/tools/customer-lifetime-value',
    title: 'שווי לקוח (CLV/LTV)',
    emoji: '👤',
    description: 'מדד מפתח ל-SaaS וE-commerce - LTV/CAC, Payback',
    icon: Users,
    features: ['LTV/CAC ratio', 'Payback period', 'בנצ\'מארק לתעשיות'],
  },
];

export default function ToolsLandingPage() {
  return (
    <div>
      {/* HERO */}
      <div className="bg-ink-deep border border-cream/15 mb-10 relative overflow-hidden">
        <div className="p-8 md:p-12 relative">
          <div className="relative z-10 max-w-3xl mx-auto text-center">
            <p className="font-mono text-xs uppercase tracking-[0.14em] text-gold-light mb-4">
              {'// '}חשבונאי Pro ✦
            </p>

            <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight text-cream">
              המערכת הפיננסית המקיפה ביותר
              <br />
              <span className="text-gold-light italic font-normal font-serif">
                לעסקים בישראל
              </span>
            </h1>

            <p className="text-lg md:text-xl text-cream/70 mb-8 max-w-2xl mx-auto">
              תקציב + תזרים + ניתוח דוחות + חיזוי 5 שנים + הערכת שווי DCF —{' '}
              <strong className="text-cream">הכל במקום אחד</strong>, ללא הרשמה, בעברית מלאה.
            </p>

            <Link
              href="/tools/start"
              className="inline-flex items-center gap-2 bg-gold text-paper px-8 py-4 text-lg font-bold hover:bg-gold-2 transition"
            >
              <Zap className="w-5 h-5" />
              <span>התחל כאן</span>
              <ArrowLeft className="w-5 h-5" />
            </Link>

            <p className="text-xs text-cream/40 mt-4">
              4 מסלולי כניסה לבחירה • הנתונים נשמרים מקומית • חינם לחלוטין
            </p>
          </div>
        </div>
      </div>

      {/* Why FinCalc - 3 columns */}
      <div className="grid md:grid-cols-3 gap-4 mb-10">
        <FeatureCard
          icon={TrendingUp}
          title="60+ כלי ניתוח"
          description="תקציב, תזרים, יחסים פיננסיים, DSCR, DuPont, Z-Score, Break-Even, סיכונים, אשראי בנקאי, Three-Statement Model, DCF, Cap Table — הכל מסונכרן."
        />
        <FeatureCard
          icon={Wallet}
          title="גמישות מלאה"
          description="יש לך מצב נפרד? תזרים סולו ללא תקציב. רוצה אשף? 10 שאלות → תקציב מוכן. רוצה הכל ביחד? המערכת המאוחדת. אתה בוחר."
        />
        <FeatureCard
          icon={BarChart3}
          title="בנצ'מרק ענפי"
          description="10 ענפים × 15 מדדים. רואה את עצמך מול הממוצע (Q1/חציון/Q3). מבוסס על דוחות בורסה, Damodaran, ו-D&B 2025/2026."
        />
      </div>

      {/* What's Inside */}
      <div className="bg-paper border border-ink/15 p-6 mb-10">
        <h2 className="text-xl font-bold text-ink mb-4 flex items-center gap-2">
          <span className="text-gold">✦</span>
          מה כלול במערכת?
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 text-sm">
          {[
            'תקציב שנתי מלא (P&L)',
            'תזרים מזומנים חודשי',
            'ניהול עובדים לפי מחלקה',
            'ניהול הלוואות + Spitzer',
            '20+ יחסים פיננסיים',
            'Altman Z-Score',
            'דירוג אשראי AAA-D',
            'DSCR מתקדם (5 שיטות)',
            'DuPont Analysis 3F+5F',
            'Break-Even + Margin of Safety',
            'ניתוח רגישות + תרחישים',
            'איכות תזרים (FCF)',
            'Three-Statement Model',
            'Monte Carlo Simulation',
            'DCF Valuation',
            'Cap Table + Dilution',
            'Cohort Analysis (LTV/CAC)',
            'Burn Rate / Runway',
            'Working Capital Optimizer',
            'Goals Tracking',
            'Industry Benchmarks',
            '6 תבניות מוכנות לפי ענף',
            'Excel + PDF Export',
            'תרחישים מרובים',
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-1.5 text-ink/70">
              <CheckCircle2 className="w-3.5 h-3.5 text-gold shrink-0 mt-0.5" />
              <span className="text-xs">{item}</span>
            </div>
          ))}
        </div>
        <div className="text-center mt-5">
          <Link
            href="/tools/start"
            className="inline-flex items-center gap-2 bg-ink text-cream px-6 py-2.5 font-semibold hover:bg-ink-deep transition"
          >
            פתח את המערכת
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Other standalone calculators */}
      <div className="mb-8 bg-cream-2 border border-ink/15 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-ink">
            מחשבונים נוספים (עצמאיים)
          </h2>
          <span className="font-mono text-xs text-ink/40 uppercase tracking-[0.1em]">לא חלק מהמערכת המאוחדת</span>
        </div>
        <p className="text-sm text-ink/60 mb-5">
          מחשבונים מהירים לבדיקות נקודתיות — מתאימים אם אתה לא רוצה לפתוח פרויקט שלם.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {STANDALONE_CALCULATORS.map((tool) => {
            const Icon = tool.icon;
            return (
              <Link
                key={tool.href}
                href={tool.href}
                className="group bg-paper border border-ink/15 hover:bg-paper-hover hover:border-ink/25 transition overflow-hidden"
              >
                <div className="bg-ink p-4 text-cream">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className="w-5 h-5 text-gold-light" />
                    <span className="text-xl">{tool.emoji}</span>
                  </div>
                  <h3 className="font-bold text-base">{tool.title}</h3>
                </div>
                <div className="p-3">
                  <p className="text-xs text-ink/60 mb-2 line-clamp-2">{tool.description}</p>
                  <div className="text-gold group-hover:text-gold-2 text-xs flex items-center gap-1 transition">
                    <span>פתח</span>
                    <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Categories cross-link */}
      <div className="text-center bg-cream-2 border border-ink/15 p-5">
        <p className="text-sm text-ink/70 mb-2">
          חסר לך מחשבון? יש לי גם:
        </p>
        <div className="flex flex-wrap justify-center gap-2 text-sm">
          <Link href="/self-employed" className="text-gold hover:text-gold-2 transition">
            מחשבונים לעצמאיים
          </Link>
          <span className="text-ink/30">•</span>
          <Link href="/personal-tax" className="text-gold hover:text-gold-2 transition">
            מיסוי אישי
          </Link>
          <span className="text-ink/30">•</span>
          <Link href="/real-estate" className="text-gold hover:text-gold-2 transition">
            נדל״ן ומשכנתא
          </Link>
          <span className="text-ink/30">•</span>
          <Link href="/savings" className="text-gold hover:text-gold-2 transition">
            חיסכון והשקעות
          </Link>
          <span className="text-ink/30">•</span>
          <Link href="/vehicles" className="text-gold hover:text-gold-2 transition">
            רכבים
          </Link>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-paper border border-ink/15 p-5">
      <Icon className="w-8 h-8 text-ink-mid mb-3" />
      <h3 className="font-bold text-ink text-lg mb-2">{title}</h3>
      <p className="text-sm text-ink/70 leading-relaxed">{description}</p>
    </div>
  );
}
