import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, RefreshCw, TrendingUp, DollarSign, Users, Shield } from 'lucide-react';
import { Breadcrumbs } from '@/components/calculator/Breadcrumbs';
import { MACRO_DATA, formatHebrewDate } from '@/lib/data/macroeconomic-data';

export const revalidate = 21600; // ISR: 6 שעות

export const metadata: Metadata = {
  title: 'עדכוני שוק ונתונים כלכליים 2026 — ריבית, מדד ושכר',
  description:
    'ריבית פריים, שיעור אינפלציה שנתי והשכר הממוצע לפי חוק הביטוח הלאומי — נתונים שנבדקו ידנית וקישור למקורות הרשמיים.',
  alternates: {
    canonical: 'https://cheshbonai.co.il/news',
  },
  openGraph: {
    // OG image לא מתפשט מ-app/opengraph-image.tsx לדפים שמגדירים openGraph משלהם.
    images: ['/opengraph-image'],
    title: 'עדכוני שוק ונתונים כלכליים 2026 — ריבית, מדד ושכר',
    description: 'ריבית פריים, אינפלציה ושכר ממוצע — תאריך אימות וקישור למקורות.',
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
    gradient: 'from-ink to-ink-deep',
    bgLight: 'bg-cream-2',
    border: 'border-ink/20',
    textColor: 'text-ink',
    badge: 'אימות ידני',
    description: 'ריבית הפריים קובעת את עלות המשכנתא, ההלוואות והחסכונות שלך.',
  },
  {
    href: '/news/cpi',
    title: 'מדד המחירים לצרכן',
    titleEn: 'CPI / Inflation',
    value: `${MACRO_DATA.inflation.annualRate}%`,
    subtitle: 'שינוי ב־12 החודשים האחרונים',
    lastUpdated: MACRO_DATA.inflation.lastUpdated,
    color: 'orange',
    icon: DollarSign,
    gradient: 'from-orange-500 to-amber-600',
    bgLight: 'bg-orange-50',
    border: 'border-orange-200',
    textColor: 'text-orange-700',
    badge: 'אימות ידני',
    description: 'שיעור האינפלציה השנתי משפיע על כוח הקנייה, המשכנתא והחסכון.',
  },
  {
    href: '/news/average-wage',
    title: 'שכר ממוצע לפי חוק',
    titleEn: 'Average Wage',
    value: `₪${MACRO_DATA.averageWage.monthly.toLocaleString('he-IL')}`,
    subtitle: `לחודש — ${MACRO_DATA.averageWage.reportPeriod}`,
    lastUpdated: MACRO_DATA.averageWage.lastUpdated,
    color: 'green',
    icon: Users,
    gradient: 'from-green-500 to-emerald-600',
    bgLight: 'bg-green-50',
    border: 'border-green-200',
    textColor: 'text-green-700',
    badge: 'לשנת 2026',
    description: 'הסכום הסטטוטורי לפי סעיף 2 לחוק הביטוח הלאומי; אינו ממוצע נטו.',
  },
];

const colorMap: Record<string, string> = {
  blue: 'hover:border-gold hover:shadow-sm',
  orange: 'hover:border-orange-400 hover:shadow-orange-100',
  green: 'hover:border-green-400 hover:shadow-green-100',
  red: 'hover:border-red-400 hover:shadow-red-100',
};

export default function NewsPage() {
  return (
    <div className="min-h-screen bg-paper">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Breadcrumbs
            items={[{ label: 'דף הבית', href: '/' }, { label: 'עדכוני שוק' }]}
          />
        </div>

        {/* Hero */}
        <div className="mb-10 text-center">
          <div className="inline-flex items-center gap-2 bg-cream-2 text-ink px-4 py-1.5 text-sm font-medium mb-4">
            <RefreshCw className="w-4 h-4" />
            נתונים שנבדקו מול מקורות רשמיים
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-ink mb-4">
            נתונים כלכליים עדכניים
          </h1>
          <p className="text-lg text-ink/70 max-w-2xl mx-auto">
            ריבית פריים, אינפלציה שנתית ושכר ממוצע לפי חוק הביטוח הלאומי —
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
                className={`group bg-paper border-2 ${card.border} p-6 hover:shadow-lg ${colorMap[card.color]} transition-all duration-200`}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-br ${card.gradient} flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <span className={`text-xs font-medium px-2.5 py-1 ${card.bgLight} ${card.textColor}`}>
                    {card.badge}
                  </span>
                </div>

                {/* Title */}
                <h2 className="text-lg font-bold text-ink mb-1">{card.title}</h2>
                <p className="text-xs text-ink/70 mb-3">{card.titleEn}</p>

                {/* Big Value */}
                <div className={`text-4xl font-bold ${card.textColor} mb-1`}>
                  {card.value}
                </div>
                <div className="text-sm text-ink/70 mb-4">{card.subtitle}</div>

                {/* Description */}
                <p className="text-sm text-ink/70 mb-4 leading-relaxed">
                  {card.description}
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between text-xs text-ink/70 pt-4 border-t border-ink/10">
                  <span>עודכן: {formatHebrewDate(card.lastUpdated)}</span>
                  <div className="flex items-center gap-1 text-gold opacity-0 group-hover:opacity-100 transition font-medium">
                    <span>לפרטים</span>
                    <ArrowLeft className="w-3 h-3" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Data provenance */}
        <div className="bg-cream-2 border border-ink/15 p-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <RefreshCw className="w-5 h-5 text-ink/70" />
            <h3 className="font-semibold text-ink/70">איך הנתונים מתעדכנים?</h3>
          </div>
          <p className="text-sm text-ink/70 max-w-xl mx-auto leading-relaxed">
            הנתונים נבדקים ומוזנים ידנית. תאריך הבדיקה מופיע בכל כרטיס. טעינה מחדש של הדף
            אינה מושכת נתונים חדשים מהמקורות; לפני החלטה כספית יש לעיין בקישור למקור הרשמי.
          </p>
        </div>

        {/* Related Tools */}
        <div className="mt-8 bg-cream-2 border border-ink/15 p-6">
          <h2 className="text-lg font-bold text-ink mb-4">כלים קשורים</h2>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/real-estate/mortgage"
              className="inline-flex items-center gap-1.5 bg-paper border border-ink/15 text-ink px-4 py-2 text-sm font-medium hover:border-gold hover:text-gold transition"
            >
              מחשבון משכנתא
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <Link
              href="/personal-tax/salary-net-gross"
              className="inline-flex items-center gap-1.5 bg-paper border border-ink/15 text-ink px-4 py-2 text-sm font-medium hover:border-gold hover:text-gold transition"
            >
              מחשבון שכר נטו/ברוטו
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <Link
              href="/investments/compound-interest"
              className="inline-flex items-center gap-1.5 bg-paper border border-ink/15 text-ink px-4 py-2 text-sm font-medium hover:border-gold hover:text-gold transition"
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
              description: 'ריבית פריים, מדד המחירים לצרכן ושכר ממוצע לפי חוק הביטוח הלאומי',
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
