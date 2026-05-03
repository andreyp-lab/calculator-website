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
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'כלים פיננסיים מקצועיים | FinCalc Pro',
  description:
    'מערכת מאוחדת לתכנון תקציב, ניהול תזרים מזומנים וניתוח דוחות כספיים לעסקים',
};

const tools = [
  {
    href: '/tools/unified',
    title: '🎯 מערכת מאוחדת',
    description: 'דשבורד מרכזי שמשלב תקציב + תזרים + ניתוח דוחות במקום אחד',
    icon: LayoutDashboard,
    badge: 'מומלץ',
    color: 'from-purple-500 to-purple-700',
    features: [
      'KPIs בזמן אמת',
      'תובנות אוטומטיות',
      'workflow מלא: תקציב → תזרים → ניתוח',
    ],
  },
  {
    href: '/tools/budget',
    title: '💰 תכנון תקציב',
    description: 'בנה תקציב שנתי מלא עם הכנסות, הוצאות, עובדים והלוואות',
    icon: TrendingUp,
    color: 'from-green-500 to-green-700',
    features: ['P&L Statement', 'הכנסות עם צמיחה', '5 קטגוריות הוצאות', 'הוצאות אחוזיות מקושרות'],
  },
  {
    href: '/tools/cash-flow',
    title: '💸 תזרים מזומנים',
    description: 'עקוב אחר יתרות בנק חודשיות וזהה תקופות של תזרים שלילי',
    icon: Wallet,
    color: 'from-blue-500 to-blue-700',
    features: ['תחזיות חודשיות', 'תנאי אשראי', 'עיכובי גביה ודחיות', 'התראות אוטומטיות'],
  },
  {
    href: '/tools/financial-analysis',
    title: '📊 ניתוח דוחות',
    description: '20+ יחסים פיננסיים, Altman Z-Score, דירוג אשראי וציון בריאות',
    icon: BarChart3,
    color: 'from-orange-500 to-orange-700',
    features: ['יחסי רווחיות + נזילות', 'Z-Score (Altman)', 'דירוג אשראי AAA-D', 'DSCR מתקדם'],
  },
  {
    href: '/tools/loan-eligibility',
    title: '🏦 הלוואות בערבות מדינה',
    description: 'בדוק זכאות להלוואה בערבות המדינה - 6 מסלולים שונים',
    icon: Landmark,
    color: 'from-emerald-500 to-emerald-700',
    features: [
      'עסק בהקמה / קטן / בינוני',
      'מסלול יצואן ותעשייה',
      'מסלול חרבות ברזל',
      'תוצאה תוך דקה',
    ],
  },
  {
    href: '/tools/break-even',
    title: '⚖️ נקודת איזון',
    description: 'כמה צריך למכור כדי לכסות הוצאות - חישוב מינימום מכירות',
    icon: Scale,
    color: 'from-cyan-500 to-cyan-700',
    features: ['תרומה לכיסוי', 'מרווח ביטחון', 'יחידות לרווח מטרה', 'חישוב יומי + חודשי'],
  },
  {
    href: '/tools/business-valuation',
    title: '💎 הערכת שווי עסק',
    description: 'שווי העסק שלך - DCF, מכפיל EBITDA, מכפיל הכנסות',
    icon: Gem,
    color: 'from-rose-500 to-rose-700',
    features: ['3 שיטות הערכה', 'מכפילים ענפיים 2026', 'Terminal Value', 'טווח שווי'],
  },
  {
    href: '/tools/customer-lifetime-value',
    title: '👤 שווי לקוח (CLV/LTV)',
    description: 'מדד מפתח ל-SaaS וE-commerce - LTV/CAC, Payback',
    icon: Users,
    color: 'from-indigo-500 to-indigo-700',
    features: ['LTV/CAC ratio', 'Payback period', 'בנצ\'מארק לתעשיות', 'Churn-based calc'],
  },
];

export default function ToolsLandingPage() {
  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">
          🚀 כלים פיננסיים מקצועיים
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          מערכת מאוחדת ב-Hebrew לתכנון תקציב, ניהול תזרים מזומנים וניתוח דוחות כספיים.
          כל הנתונים נשמרים מקומית - פרטיות מלאה.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tools.map((tool) => {
          const Icon = tool.icon;
          return (
            <Link
              key={tool.href}
              href={tool.href}
              className="group bg-white rounded-xl border-2 border-gray-200 hover:border-blue-400 hover:shadow-xl transition-all overflow-hidden"
            >
              <div className={`bg-gradient-to-r ${tool.color} p-6 text-white`}>
                <div className="flex items-start justify-between mb-3">
                  <Icon className="w-10 h-10" />
                  {tool.badge && (
                    <span className="bg-white/20 backdrop-blur px-3 py-1 rounded-full text-xs font-medium">
                      {tool.badge}
                    </span>
                  )}
                </div>
                <h3 className="text-2xl font-bold mb-1">{tool.title}</h3>
                <p className="text-sm opacity-90">{tool.description}</p>
              </div>
              <div className="p-5">
                <ul className="space-y-1.5">
                  {tool.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                      <span className="text-green-600">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between text-blue-600 group-hover:text-blue-800">
                  <span className="font-medium">פתח כלי</span>
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Info section */}
      <div className="mt-12 bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-3">💡 איך זה עובד?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <div className="font-bold text-blue-700 mb-1">1. בנה תקציב</div>
            <p className="text-gray-700">
              הזן הכנסות, הוצאות, עובדים והלוואות. המערכת מחשבת אוטומטית P&L מלא.
            </p>
          </div>
          <div>
            <div className="font-bold text-blue-700 mb-1">2. ניתוח תזרים</div>
            <p className="text-gray-700">
              הנתונים מהתקציב מזרימים אוטומטית לתזרים, כולל תנאי אשראי ותחזיות.
            </p>
          </div>
          <div>
            <div className="font-bold text-blue-700 mb-1">3. ניתוח דוחות</div>
            <p className="text-gray-700">
              הוסף נתוני מאזן וקבל 20+ יחסים פיננסיים, דירוג אשראי וציון בריאות.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
