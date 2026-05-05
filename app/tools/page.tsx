import { Metadata } from 'next';
import Link from 'next/link';
import {
  LayoutDashboard,
  TrendingUp,
  Wallet,
  BarChart3,
  Landmark,
  Scale,
  Gem,
  Users,
  ArrowLeft,
  LineChart,
  type LucideIcon,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'כלים לבעלי עסקים | FinCalc Pro',
  description:
    'מערכת מקיפה לבעלי עסקים: תכנון תקציב, תזרים מזומנים, ניתוח דוחות, הערכת שווי, נקודת איזון, מימון ועוד. מסודר בקטגוריות לפי תחום שימוש.',
};

interface Tool {
  href: string;
  title: string;
  emoji: string;
  description: string;
  icon: LucideIcon;
  badge?: string;
  color: string;
  features: string[];
}

interface Category {
  id: string;
  title: string;
  emoji: string;
  description: string;
  tools: Tool[];
}

const CATEGORIES: Category[] = [
  // ==================================================
  // 1. תכנון תפעולי
  // ==================================================
  {
    id: 'operational',
    title: 'תכנון תפעולי',
    emoji: '📋',
    description: 'כלים לניהול שוטף - תקציב, תזרים ומערכת מאוחדת',
    tools: [
      {
        href: '/tools/unified',
        title: 'מערכת מאוחדת',
        emoji: '🎯',
        description: 'דשבורד מרכזי שמשלב תקציב + תזרים + ניתוח דוחות',
        icon: LayoutDashboard,
        badge: 'מומלץ',
        color: 'from-purple-500 to-purple-700',
        features: ['KPIs בזמן אמת', 'תובנות אוטומטיות', 'workflow מלא'],
      },
      {
        href: '/tools/budget',
        title: 'תכנון תקציב',
        emoji: '💰',
        description: 'תקציב שנתי מלא: הכנסות, הוצאות, עובדים והלוואות',
        icon: TrendingUp,
        color: 'from-green-500 to-green-700',
        features: ['P&L Statement', 'הכנסות עם צמיחה', '5 קטגוריות הוצאות'],
      },
      {
        href: '/tools/cash-flow',
        title: 'תזרים מזומנים',
        emoji: '💸',
        description: 'יתרות בנק חודשיות, תחזיות ותקופות תזרים שלילי',
        icon: Wallet,
        color: 'from-blue-500 to-blue-700',
        features: ['תחזיות חודשיות', 'תנאי אשראי', 'התראות אוטומטיות'],
      },
    ],
  },

  // ==================================================
  // 2. אנליטיקה ומדדים
  // ==================================================
  {
    id: 'analytics',
    title: 'אנליטיקה ומדדים',
    emoji: '📊',
    description: 'ניתוח ביצועים וקבלת החלטות מבוססת נתונים',
    tools: [
      {
        href: '/tools/financial-analysis',
        title: 'ניתוח דוחות כספיים',
        emoji: '🔍',
        description: '20+ יחסים פיננסיים, Z-Score, דירוג אשראי וציון בריאות',
        icon: BarChart3,
        color: 'from-orange-500 to-orange-700',
        features: ['רווחיות + נזילות', 'Z-Score (Altman)', 'דירוג AAA-D', 'DSCR'],
      },
      {
        href: '/tools/break-even',
        title: 'נקודת איזון',
        emoji: '⚖️',
        description: 'כמה צריך למכור כדי לכסות הוצאות - מינימום פעילות',
        icon: Scale,
        color: 'from-cyan-500 to-cyan-700',
        features: ['תרומה לכיסוי', 'מרווח ביטחון', 'יחידות לרווח מטרה'],
      },
      {
        href: '/tools/business-valuation',
        title: 'הערכת שווי עסק',
        emoji: '💎',
        description: '3 שיטות: DCF, מכפיל EBITDA, מכפיל הכנסות',
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
      {
        href: '/tools/forecast',
        title: 'חיזוי רב-שנתי',
        emoji: '🔮',
        description: 'מודל פיננסי 3-דוחות (P&L + מאזן + תזרים) ל-3-5 שנים, מונטה קרלו ו-LTV/CAC',
        icon: LineChart,
        badge: 'חדש',
        color: 'from-violet-500 to-fuchsia-700',
        features: [
          'היסטוריה → תחזית 3-5 שנים',
          'מודל מאזן ותזרים אינדירקטי',
          'סימולציית מונטה קרלו',
          'ניתוח קוהורט לפי חודש רכישה',
        ],
      },
      {
        href: '/tools/capital',
        title: 'הון, שווי ודילול',
        emoji: '💎',
        description: 'DCF Valuation מלא + Cap Table עם סבבי גיוס, ESOP ו-Exit Waterfall',
        icon: Gem,
        badge: 'חדש',
        color: 'from-rose-500 to-pink-700',
        features: [
          'WACC + DCF + Sensitivity',
          'Cap Table 5+ סבבים',
          'Liquidation Preferences',
          'Exit Waterfall',
        ],
      },
    ],
  },

  // ==================================================
  // 3. מימון ואשראי
  // ==================================================
  {
    id: 'financing',
    title: 'מימון ואשראי',
    emoji: '🏦',
    description: 'בדיקת זכאות והתאמת מסלולי מימון לעסק',
    tools: [
      {
        href: '/tools/loan-eligibility',
        title: 'הלוואות בערבות מדינה',
        emoji: '🏦',
        description: 'בדוק זכאות תוך דקה - 6 מסלולים שונים כולל חרבות ברזל',
        icon: Landmark,
        color: 'from-emerald-500 to-emerald-700',
        features: ['עסק בהקמה / קטן / בינוני', 'מסלול יצואן ותעשייה', 'מסלול חרבות ברזל'],
      },
    ],
  },
];

export default function ToolsLandingPage() {
  const totalTools = CATEGORIES.reduce((sum, cat) => sum + cat.tools.length, 0);

  return (
    <div>
      {/* Hero */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
          🚀 כלים לבעלי עסקים
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-4">
          מערכת מקיפה לעסקים קטנים ובינוניים בישראל. {totalTools} כלים לבעלי עסקים מסודרים
          לפי תחום שימוש.
        </p>
        <div className="flex flex-wrap justify-center gap-2 text-sm">
          <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full">
            פרטיות מלאה - הנתונים נשמרים מקומית
          </span>
          <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full">
            ללא צורך בהרשמה
          </span>
          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
            עברית מלאה - RTL
          </span>
        </div>
      </div>

      {/* Quick navigation */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-8">
        <p className="text-xs text-gray-600 mb-2 font-medium">קפיצה לקטגוריה:</p>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <a
              key={cat.id}
              href={`#${cat.id}`}
              className="bg-white border border-gray-300 hover:border-blue-400 px-3 py-1.5 rounded-lg text-sm transition flex items-center gap-1.5"
            >
              <span>{cat.emoji}</span>
              <span>{cat.title}</span>
              <span className="text-xs text-gray-500">({cat.tools.length})</span>
            </a>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div className="space-y-12">
        {CATEGORIES.map((category) => (
          <section key={category.id} id={category.id} className="scroll-mt-20">
            {/* Category header */}
            <div className="mb-6 pb-4 border-b-2 border-gray-200">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1 flex items-center gap-2">
                <span>{category.emoji}</span>
                <span>{category.title}</span>
                <span className="text-sm font-normal text-gray-500 mr-2">
                  ({category.tools.length} כלים)
                </span>
              </h2>
              <p className="text-gray-600">{category.description}</p>
            </div>

            {/* Tools grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {category.tools.map((tool) => {
                const Icon = tool.icon;
                return (
                  <Link
                    key={tool.href}
                    href={tool.href}
                    className="group bg-white rounded-xl border-2 border-gray-200 hover:border-blue-400 hover:shadow-xl transition-all overflow-hidden flex flex-col"
                  >
                    <div className={`bg-gradient-to-br ${tool.color} p-5 text-white`}>
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Icon className="w-7 h-7" />
                          <span className="text-2xl">{tool.emoji}</span>
                        </div>
                        {tool.badge && (
                          <span className="bg-white/25 backdrop-blur px-2.5 py-0.5 rounded-full text-xs font-medium">
                            {tool.badge}
                          </span>
                        )}
                      </div>
                      <h3 className="text-xl font-bold mb-1">{tool.title}</h3>
                      <p className="text-xs opacity-90">{tool.description}</p>
                    </div>
                    <div className="p-4 flex-1 flex flex-col">
                      <ul className="space-y-1 flex-1">
                        {tool.features.map((f, i) => (
                          <li
                            key={i}
                            className="flex items-center gap-1.5 text-xs text-gray-700"
                          >
                            <span className="text-green-600 flex-shrink-0">✓</span>
                            {f}
                          </li>
                        ))}
                      </ul>
                      <div className="mt-3 pt-3 border-t border-gray-200 flex items-center justify-between text-blue-600 group-hover:text-blue-800 text-sm">
                        <span className="font-medium">פתח כלי</span>
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition" />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      {/* How it works */}
      <div className="mt-16 bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200 rounded-xl p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">💡 איך עובדת המערכת?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="bg-white rounded-lg p-4 border border-blue-100">
            <div className="font-bold text-blue-700 mb-2 flex items-center gap-2">
              <span className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">
                1
              </span>
              תכנון
            </div>
            <p className="text-gray-700">
              בנה תקציב שנתי ותחזית תזרים. המערכת מחשבת אוטומטית P&L ויתרות בנק חודשיות.
            </p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-blue-100">
            <div className="font-bold text-blue-700 mb-2 flex items-center gap-2">
              <span className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">
                2
              </span>
              ניתוח
            </div>
            <p className="text-gray-700">
              נתח את הנתונים: יחסים פיננסיים, נקודת איזון, שווי עסק ושווי לקוח. זהה הזדמנויות
              ובעיות.
            </p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-blue-100">
            <div className="font-bold text-blue-700 mb-2 flex items-center gap-2">
              <span className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">
                3
              </span>
              צמיחה
            </div>
            <p className="text-gray-700">
              גייס הון - בדוק זכאות להלוואות בערבות מדינה. נצל את כל הכלים יחד לקבלת החלטות
              חכמות.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="mt-8 text-center">
        <p className="text-sm text-gray-600">
          חסר לך כלי? יש לי גם מחשבונים ל
          <Link href="/self-employed" className="text-blue-600 hover:underline mx-1">
            עצמאיים
          </Link>
          ול
          <Link href="/personal-tax" className="text-blue-600 hover:underline mx-1">
            מיסוי אישי
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
