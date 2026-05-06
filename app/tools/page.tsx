import { Metadata } from 'next';
import Link from 'next/link';
import {
  Sparkles,
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
  title: 'FinCalc Pro - מערכת פיננסית לבעלי עסקים',
  description:
    'המערכת המקיפה ביותר בישראל לתכנון פיננסי: תקציב, תזרים, ניתוח דוחות, חיזוי 5 שנים, הערכת שווי DCF, Cap Table. עברית מלאה, ללא הרשמה.',
};

interface Tool {
  href: string;
  title: string;
  emoji: string;
  description: string;
  icon: LucideIcon;
  color: string;
  features: string[];
}

const STANDALONE_CALCULATORS: Tool[] = [
  {
    href: '/tools/loan-eligibility',
    title: 'הלוואות בערבות מדינה',
    emoji: '🏦',
    description: 'בדוק זכאות תוך דקה - 6 מסלולים שונים כולל חרבות ברזל',
    icon: Landmark,
    color: 'from-emerald-500 to-emerald-700',
    features: ['עסק בהקמה / קטן / בינוני', 'מסלול יצואן ותעשייה', 'מסלול חרבות ברזל'],
  },
  {
    href: '/tools/break-even',
    title: 'נקודת איזון מהירה',
    emoji: '⚖️',
    description: 'חישוב נקודת איזון פשוטה לפי מחיר ועלות יחידה',
    icon: Scale,
    color: 'from-cyan-500 to-cyan-700',
    features: ['חישוב מינימום מכירות', 'מרווח ביטחון', 'מתאים לבדיקה מהירה'],
  },
  {
    href: '/tools/business-valuation',
    title: 'הערכת שווי עסק (פשוט)',
    emoji: '💎',
    description: '3 שיטות מהירות: DCF, מכפיל EBITDA, מכפיל הכנסות',
    icon: Gem,
    color: 'from-rose-500 to-rose-700',
    features: ['מכפילים ענפיים 2026', 'Terminal Value', 'טווח שווי'],
  },
  {
    href: '/tools/customer-lifetime-value',
    title: 'שווי לקוח (CLV/LTV)',
    emoji: '👤',
    description: 'מדד מפתח ל-SaaS וE-commerce - LTV/CAC, Payback',
    icon: Users,
    color: 'from-indigo-500 to-indigo-700',
    features: ['LTV/CAC ratio', 'Payback period', 'בנצ\'מארק לתעשיות'],
  },
];

export default function ToolsLandingPage() {
  return (
    <div>
      {/* HERO - Single primary CTA */}
      <div className="relative overflow-hidden rounded-2xl mb-10">
        <div className="bg-gradient-to-br from-purple-600 via-indigo-700 to-blue-800 text-white p-8 md:p-12 relative">
          {/* Decorative pattern */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 80%, white 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }}
          />

          <div className="relative z-10 max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
              <Sparkles className="w-4 h-4" />
              FinCalc Pro
            </div>

            <h1 className="text-3xl md:text-5xl font-extrabold mb-4 leading-tight">
              המערכת הפיננסית המקיפה ביותר
              <br />
              <span className="bg-gradient-to-r from-amber-300 to-yellow-200 bg-clip-text text-transparent">
                לעסקים בישראל
              </span>
            </h1>

            <p className="text-lg md:text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              תקציב + תזרים + ניתוח דוחות + חיזוי 5 שנים + הערכת שווי DCF —{' '}
              <strong>הכל במקום אחד</strong>, ללא הרשמה, בעברית מלאה.
            </p>

            <Link
              href="/tools/start"
              className="inline-flex items-center gap-2 bg-white text-purple-700 px-8 py-4 rounded-xl text-lg font-bold shadow-2xl hover:shadow-3xl hover:-translate-y-1 transition-all"
            >
              <Zap className="w-5 h-5 text-amber-500" />
              <span>התחל כאן</span>
              <ArrowLeft className="w-5 h-5" />
            </Link>

            <p className="text-xs text-blue-200 mt-4">
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
          color="emerald"
        />
        <FeatureCard
          icon={Wallet}
          title="גמישות מלאה"
          description="יש לך מצב נפרד? תזרים סולו ללא תקציב. רוצה אשף? 10 שאלות → תקציב מוכן. רוצה הכל ביחד? המערכת המאוחדת. אתה בוחר."
          color="blue"
        />
        <FeatureCard
          icon={BarChart3}
          title="בנצ'מרק ענפי"
          description="10 ענפים × 15 מדדים. רואה את עצמך מול הממוצע (Q1/חציון/Q3). מבוסס על דוחות בורסה, Damodaran, ו-D&B 2024."
          color="purple"
        />
      </div>

      {/* What's Inside - quick preview */}
      <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 mb-10 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-600" />
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
            <div key={i} className="flex items-start gap-1.5 text-gray-700">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
              <span className="text-xs">{item}</span>
            </div>
          ))}
        </div>
        <div className="text-center mt-5">
          <Link
            href="/tools/start"
            className="inline-flex items-center gap-2 bg-purple-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-purple-700"
          >
            פתח את המערכת
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Other standalone calculators */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">
            מחשבונים נוספים (עצמאיים)
          </h2>
          <span className="text-xs text-gray-500">לא חלק מהמערכת המאוחדת</span>
        </div>
        <p className="text-sm text-gray-600 mb-5">
          מחשבונים מהירים לבדיקות נקודתיות — מתאימים אם אתה לא רוצה לפתוח פרויקט שלם.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {STANDALONE_CALCULATORS.map((tool) => {
            const Icon = tool.icon;
            return (
              <Link
                key={tool.href}
                href={tool.href}
                className="group bg-white rounded-xl border-2 border-gray-200 hover:border-blue-400 hover:shadow-lg transition-all overflow-hidden"
              >
                <div className={`bg-gradient-to-br ${tool.color} p-4 text-white`}>
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className="w-5 h-5" />
                    <span className="text-xl">{tool.emoji}</span>
                  </div>
                  <h3 className="font-bold text-base">{tool.title}</h3>
                </div>
                <div className="p-3">
                  <p className="text-xs text-gray-600 mb-2 line-clamp-2">{tool.description}</p>
                  <div className="text-blue-600 group-hover:text-blue-800 text-xs flex items-center gap-1">
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
      <div className="text-center bg-gray-50 rounded-xl p-5 border border-gray-200">
        <p className="text-sm text-gray-700 mb-2">
          חסר לך מחשבון? יש לי גם:
        </p>
        <div className="flex flex-wrap justify-center gap-2 text-sm">
          <Link href="/self-employed" className="text-blue-600 hover:underline">
            מחשבונים לעצמאיים
          </Link>
          <span className="text-gray-400">•</span>
          <Link href="/personal-tax" className="text-blue-600 hover:underline">
            מיסוי אישי
          </Link>
          <span className="text-gray-400">•</span>
          <Link href="/real-estate" className="text-blue-600 hover:underline">
            נדל״ן ומשכנתא
          </Link>
          <span className="text-gray-400">•</span>
          <Link href="/savings" className="text-blue-600 hover:underline">
            חיסכון והשקעות
          </Link>
          <span className="text-gray-400">•</span>
          <Link href="/vehicles" className="text-blue-600 hover:underline">
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
  color,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  color: string;
}) {
  const colorMap: Record<string, { bg: string; text: string; border: string }> = {
    emerald: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
    blue: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
    purple: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
  };
  const c = colorMap[color];
  return (
    <div className={`${c.bg} ${c.border} border-2 rounded-xl p-5`}>
      <Icon className={`w-8 h-8 ${c.text} mb-3`} />
      <h3 className="font-bold text-gray-900 text-lg mb-2">{title}</h3>
      <p className="text-sm text-gray-700 leading-relaxed">{description}</p>
    </div>
  );
}
