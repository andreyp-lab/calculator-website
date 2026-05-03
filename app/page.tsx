import Link from 'next/link';
import { navigation } from '@/lib/config/navigation';
import { ArrowLeft, LayoutDashboard, TrendingUp, Wallet, BarChart3 } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            המקום אחד לכל המחשבונים הפיננסיים שלך
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            מעל 15 מחשבונים מקצועיים בעברית - מס הכנסה, משכנתא, השקעות, רכב, ביטוחים ועוד.
            כל החישובים מעודכנים לחוק הישראלי 2026 ובוצעו על ידי רואה חשבון מוסמך.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="#calculators"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition font-medium inline-flex items-center gap-2"
            >
              עיין בכל המחשבונים
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <Link
              href="/tools"
              className="bg-purple-600 text-white px-8 py-3 rounded-lg hover:bg-purple-700 transition font-medium inline-flex items-center gap-2"
            >
              🚀 כלים מקצועיים לעסקים
            </Link>
          </div>
        </div>

        {/* Trust Signals */}
        <div className="grid md:grid-cols-4 gap-6 mb-16 bg-white p-8 rounded-lg border border-gray-200">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-1">15+</div>
            <p className="text-sm text-gray-600">מחשבונים מקצועיים</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-1">8</div>
            <p className="text-sm text-gray-600">קטגוריות</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-1">100%</div>
            <p className="text-sm text-gray-600">חינם ובעברית</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-1">2026</div>
            <p className="text-sm text-gray-600">מעודכן ומאומת</p>
          </div>
        </div>
      </section>

      {/* Professional Tools Section - חדש! */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 rounded-2xl p-8 md:p-12 text-white shadow-2xl">
          <div className="flex items-start gap-4 mb-6">
            <div className="bg-white/20 backdrop-blur p-3 rounded-xl">
              <LayoutDashboard className="w-8 h-8" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold">
                  ⭐ חדש
                </span>
                <span className="bg-white/20 backdrop-blur px-3 py-1 rounded-full text-xs">
                  לעסקים
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-2">
                🚀 כלים פיננסיים מקצועיים
              </h2>
              <p className="text-white/90 text-lg">
                מערכת מאוחדת לתכנון תקציב, ניהול תזרים מזומנים וניתוח דוחות כספיים
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-6">
            {navigation.professionalTools.map((tool) => {
              const icons: Record<string, typeof LayoutDashboard> = {
                unified: LayoutDashboard,
                budget: TrendingUp,
                'cash-flow': Wallet,
                'financial-analysis': BarChart3,
              };
              const Icon = icons[tool.id] || LayoutDashboard;
              const isFeatured = tool.id === 'unified';

              return (
                <Link
                  key={tool.id}
                  href={tool.href}
                  className={`group flex items-start gap-3 p-4 rounded-lg border-2 transition hover:scale-[1.02] ${
                    isFeatured
                      ? 'bg-yellow-400/20 border-yellow-300 hover:bg-yellow-400/30'
                      : 'bg-white/10 border-white/20 hover:bg-white/20'
                  }`}
                >
                  <Icon className="w-6 h-6 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold">{tool.label}</h3>
                      {(tool as { badge?: string }).badge && (
                        <span className="bg-yellow-400 text-yellow-900 text-xs px-2 py-0.5 rounded-full font-bold">
                          {(tool as { badge?: string }).badge}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-white/80">{tool.description}</p>
                  </div>
                  <ArrowLeft className="w-4 h-4 opacity-0 group-hover:opacity-100 transition flex-shrink-0 mt-2" />
                </Link>
              );
            })}
          </div>

          <div className="mt-6 pt-6 border-t border-white/20 flex items-center justify-between">
            <div className="text-sm text-white/80">
              ✨ פרטיות מלאה - הנתונים נשמרים מקומית
            </div>
            <Link
              href="/tools"
              className="bg-white text-purple-700 px-5 py-2.5 rounded-lg font-bold hover:bg-yellow-100 transition flex items-center gap-2"
            >
              פתח את כל הכלים
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section id="calculators" className="max-w-6xl mx-auto px-4 py-12 scroll-mt-20">
        <h2 className="text-3xl font-bold text-gray-900 mb-3">📐 כל המחשבונים</h2>
        <p className="text-gray-600 mb-8">8 קטגוריות עם מחשבונים שמשתמשים בנתוני 2026 המעודכנים</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {navigation.categories.map((category) => (
            <Link
              key={category.id}
              href={category.href}
              className="group bg-white p-5 rounded-lg border-2 border-gray-200 hover:border-blue-400 hover:shadow-lg transition"
            >
              <div className="text-3xl mb-2">{(category as { icon?: string }).icon || '📊'}</div>
              <h3 className="font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition">
                {category.label}
              </h3>
              <p className="text-gray-600 text-xs">{category.description}</p>
              <div className="flex items-center gap-1 mt-3 text-blue-600 opacity-0 group-hover:opacity-100 transition text-xs">
                <span className="font-medium">פתח</span>
                <ArrowLeft className="w-3 h-3" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Info Section */}
      <section className="bg-blue-50 py-12 border-t border-gray-200 mt-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">אודות האתר</h2>
          <p className="text-gray-600 max-w-3xl mb-4">
            FinCalc הוא אתר מחשבונים פיננסיים בעברית, נבנה על ידי רואה חשבון מוסמך עם ניסיון רב בתחום.
            כל המחשבונים בנויים בהתאם לחוק ותקנות בישראל, ועדכנים לשנה הנוכחית.
          </p>
          <p className="text-gray-600">
            <strong>הערה חשובה:</strong> התוכן באתר זה אינו מהווה ייעוץ משפטי או מקצועי, והוא מיועד לעזר כללי בלבד.
            אנא התייעץ עם רואה חשבון או עורך דין לפני קבלת החלטות פיננסיות חשובות.
          </p>
        </div>
      </section>
    </div>
  );
}
