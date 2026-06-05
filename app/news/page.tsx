import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, RefreshCw, TrendingUp, DollarSign, Users, Shield } from 'lucide-react';
import { Breadcrumbs } from '@/components/calculator/Breadcrumbs';
import { MACRO_DATA, formatHebrewDate } from '@/lib/data/macroeconomic-data';

export const revalidate = 21600; // ISR: 6 שעות

export const metadata: Metadata = {
  title: 'עדכוני שוק ונתונים כלכליים 2026 — ריבית, מדד ושכר',
  description:
    'ריבית פריים עדכנית, מדד המחירים לצרכן, שכר ממוצע ומענקי חרבות ברזל — נתונים כלכליים מעודכנים אוטומטית לשנת 2026.',
  alternates: {
    canonical: 'https://cheshbonai.co.il/news',
  },
  openGraph: {
    title: 'עדכוני שוק ונתונים כלכליים 2026 — ריבית, מדד ושכר',
    description: 'ריבית פריים, מדד המחירים לצרכן, שכר ממוצע ומענקי חרבות ברזל — מעודכן אוטומטית לשנת 2026.',
    url: 'https://cheshbonai.co.il/news',
  },
};

const cards = [
  {
    href: '/news/prime-rate',
    title: 'ריבית פריים',
    titleEn: 'Prime Rate',
    value: `${MACRO_DATA.primeRate.value}%`,
    subtitle: `ריבית בנק ישראל: ${MACRO_DATA.primeRate.boiBaseRate}%`,
    lastUpdated: MACRO_DATA.primeRate.lastUpdated,
    color: 'blue',
    icon: TrendingUp,
    gradient: 'from-blue-500 to-blue-700',
    bgLight: 'bg-blue-50',
    border: 'border-blue-200',
    textColor: 'text-blue-700',
    badge: 'מתעדכן ~8 פעמים בשנה',
    description: 'ריבית הפריים קובעת את עלות המשכנתא, ההלוואות והחסכונות שלך.',
  },
  {
    href: '/news/cpi',
    title: 'מדד המחירים לצרכן',
    titleEn: 'CPI / Inflation',
    value: `${MACRO_DATA.inflation.annualRate}%`,
    subtitle: `שינוי חודשי: ${MACRO_DATA.inflation.monthlyRate >= 0 ? '+' : ''}${MACRO_DATA.inflation.monthlyRate}%`,
    lastUpdated: MACRO_DATA.inflation.lastUpdated,
    color: 'orange',
    icon: DollarSign,
    gradient: 'from-orange-500 to-amber-600',
    bgLight: 'bg-orange-50',
    border: 'border-orange-200',
    textColor: 'text-orange-700',
    badge: 'מתעדכן מדי חודש',
    description: 'שיעור האינפלציה השנתי משפיע על כוח הקנייה, המשכנתא והחסכון.',
  },
  {
    href: '/news/average-wage',
    title: 'שכר ממוצע',
    titleEn: 'Average Wage',
    value: `₪${MACRO_DATA.averageWage.monthly.toLocaleString('he-IL')}`,
    subtitle: `לחודש ברוטו — ${MACRO_DATA.averageWage.reportPeriod}`,
    lastUpdated: MACRO_DATA.averageWage.lastUpdated,
    color: 'green',
    icon: Users,
    gradient: 'from-green-500 to-emerald-600',
    bgLight: 'bg-green-50',
    border: 'border-green-200',
    textColor: 'text-green-700',
    badge: 'מתעדכן רבעוני',
    description: 'השכר הממוצע במשק קובע זכאות לקצבאות, ביטוח לאומי ותנאים סוציאליים.',
  },
  {
    href: '/news/iron-swords',
    title: 'מענקי חרבות ברזל',
    titleEn: 'Iron Swords Grants',
    value: `₪${MACRO_DATA.ironSwordsBonuses.generalGrant.toLocaleString('he-IL')}`,
    subtitle: `מענק כללי | יומי: ₪${MACRO_DATA.ironSwordsBonuses.dailyGrant}`,
    lastUpdated: MACRO_DATA.ironSwordsBonuses.lastUpdated,
    color: 'red',
    icon: Shield,
    gradient: 'from-red-500 to-rose-600',
    bgLight: 'bg-red-50',
    border: 'border-red-200',
    textColor: 'text-red-700',
    badge: MACRO_DATA.ironSwordsBonuses.status === 'active' ? 'פעיל' : 'מושהה',
    description: 'מענקים ממשלתיים לשמורי מילואים ולעסקים שנפגעו ממלחמת חרבות ברזל.',
  },
];

const colorMap: Record<string, string> = {
  blue: 'hover:border-blue-400 hover:shadow-blue-100',
  orange: 'hover:border-orange-400 hover:shadow-orange-100',
  green: 'hover:border-green-400 hover:shadow-green-100',
  red: 'hover:border-red-400 hover:shadow-red-100',
};

export default function NewsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Breadcrumbs
            items={[{ label: 'דף הבית', href: '/' }, { label: 'עדכוני שוק' }]}
          />
        </div>

        {/* Hero */}
        <div className="mb-10 text-center">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
            <RefreshCw className="w-4 h-4" />
            מתעדכן אוטומטית כל 6 שעות
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
            נתונים כלכליים עדכניים
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            ריבית פריים, מדד המחירים לצרכן, שכר ממוצע ומענקי חרבות ברזל —
            כל הנתונים הכלכליים שמשפיעים עליך, במקום אחד.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid sm:grid-cols-2 gap-6 mb-12">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <Link
                key={card.href}
                href={card.href}
                className={`group bg-white rounded-2xl border-2 ${card.border} p-6 hover:shadow-lg ${colorMap[card.color]} transition-all duration-200`}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${card.bgLight} ${card.textColor}`}>
                    {card.badge}
                  </span>
                </div>

                {/* Title */}
                <h2 className="text-lg font-bold text-gray-900 mb-1">{card.title}</h2>
                <p className="text-xs text-gray-500 mb-3">{card.titleEn}</p>

                {/* Big Value */}
                <div className={`text-4xl font-bold ${card.textColor} mb-1`}>
                  {card.value}
                </div>
                <div className="text-sm text-gray-600 mb-4">{card.subtitle}</div>

                {/* Description */}
                <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                  {card.description}
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between text-xs text-gray-500 pt-4 border-t border-gray-100">
                  <span>עודכן: {formatHebrewDate(card.lastUpdated)}</span>
                  <div className="flex items-center gap-1 text-blue-600 opacity-0 group-hover:opacity-100 transition font-medium">
                    <span>לפרטים</span>
                    <ArrowLeft className="w-3 h-3" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* ISR Explanation */}
        <div className="bg-gray-50 rounded-xl border border-gray-200 p-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <RefreshCw className="w-5 h-5 text-gray-400" />
            <h3 className="font-semibold text-gray-700">איך הנתונים מתעדכנים?</h3>
          </div>
          <p className="text-sm text-gray-600 max-w-xl mx-auto leading-relaxed">
            אנו משתמשים ב-ISR (Incremental Static Regeneration) של Next.js — האתר בונה מחדש את
            הדפים אוטומטית כל 6 שעות, ומשלב נתונים מעודכנים מהמקורות הרשמיים.
            לנתונים שמשתנים לעיתים רחוקות (כגון ריבית פריים), מתבצע גם עדכון ידני מאומת.
          </p>
        </div>

        {/* Related Tools */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">כלים קשורים</h2>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/real-estate/mortgage"
              className="inline-flex items-center gap-1.5 bg-white border border-blue-300 text-blue-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-50 transition"
            >
              מחשבון משכנתא
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <Link
              href="/personal-tax/salary-net-gross"
              className="inline-flex items-center gap-1.5 bg-white border border-blue-300 text-blue-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-50 transition"
            >
              מחשבון שכר נטו/ברוטו
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <Link
              href="/investments/compound-interest"
              className="inline-flex items-center gap-1.5 bg-white border border-blue-300 text-blue-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-50 transition"
            >
              מחשבון ריבית דריבית
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Schema.org */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebPage',
              name: 'עדכוני שוק ונתונים כלכליים',
              url: 'https://cheshbonai.co.il/news',
              description: 'ריבית פריים, מדד המחירים לצרכן, שכר ממוצע ומענקי חרבות ברזל',
              inLanguage: 'he-IL',
              publisher: {
                '@type': 'Organization',
                name: 'חשבונאי',
                url: 'https://cheshbonai.co.il',
              },
            }),
          }}
        />
      </div>
    </div>
  );
}
