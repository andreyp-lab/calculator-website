import type { Metadata } from 'next';
import Link from 'next/link';
import { ExternalLink, Calendar, TrendingDown, Home, ArrowLeft } from 'lucide-react';
import { Breadcrumbs } from '@/components/calculator/Breadcrumbs';
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';
import { MACRO_DATA, formatHebrewDate, daysUntilNextDecision } from '@/lib/data/macroeconomic-data';
import { PrimeRateChart } from './PrimeRateChart';

export const revalidate = 21600; // ISR: 6 שעות

export const metadata: Metadata = {
  title: 'ריבית פריים עדכנית 2026 — ריבית בנק ישראל ומשכנתא',
  description: `ריבית פריים נוכחית: ${MACRO_DATA.primeRate.value}%. ריבית בנק ישראל: ${MACRO_DATA.primeRate.boiBaseRate}%. גרף היסטורי, ההחלטה הבאה של בנק ישראל ומשמעות לנוטלי משכנתא.`,
  keywords: [
    'ריבית פריים',
    'ריבית בנק ישראל',
    'פריים עדכני',
    'ריבית משכנתא',
    'בנק ישראל ריבית',
  ],
  alternates: {
    canonical: 'https://cheshbonai.co.il/news/prime-rate',
  },
  openGraph: {
    title: `ריבית פריים עדכנית: ${MACRO_DATA.primeRate.value}%`,
    description: `ריבית בנק ישראל: ${MACRO_DATA.primeRate.boiBaseRate}% | עודכן: ${formatHebrewDate(MACRO_DATA.primeRate.lastUpdated)}`,
    url: 'https://cheshbonai.co.il/news/prime-rate',
  },
};

const datasetSchema = {
  '@context': 'https://schema.org',
  '@type': 'Dataset',
  name: 'ריבית פריים ישראל 2026',
  description: `ריבית הפריים העדכנית בישראל: ${MACRO_DATA.primeRate.value}% (ריבית בנק ישראל ${MACRO_DATA.primeRate.boiBaseRate}% + מרווח ${MACRO_DATA.primeRate.bankSpread}%)`,
  url: 'https://cheshbonai.co.il/news/prime-rate',
  inLanguage: 'he-IL',
  temporalCoverage: '2025-06/2026-05',
  creator: {
    '@type': 'Organization',
    name: 'חשבונאי',
  },
  publisher: {
    '@type': 'Organization',
    name: 'בנק ישראל',
    url: MACRO_DATA.primeRate.sourceUrl,
  },
  dateModified: MACRO_DATA.primeRate.lastUpdated,
};

export default function PrimeRatePage() {
  const daysLeft = daysUntilNextDecision();
  const { value, boiBaseRate, bankSpread, lastUpdated, sourceUrl, nextScheduledDecision, historicalRates } =
    MACRO_DATA.primeRate;

  // חישוב דוגמה: ריבית על משכנתא פריים של 1M ₪
  const exampleLoan = 1_000_000;
  const monthlyPayment = (exampleLoan * (value / 100 / 12)) / (1 - Math.pow(1 + value / 100 / 12, -240));
  const yearlyInterest = exampleLoan * (value / 100);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Breadcrumbs
            items={[
              { label: 'דף הבית', href: '/' },
              { label: 'עדכוני שוק', href: '/news' },
              { label: 'ריבית פריים' },
            ]}
          />
        </div>

        {/* Hero */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white rounded-2xl p-8 mb-8">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div>
              <h1 className="text-blue-200 text-sm font-medium mb-2">ריבית פריים נוכחית</h1>
              <div className="text-7xl font-bold mb-2">{value}%</div>
              <p className="text-blue-100 text-lg">
                ריבית בנק ישראל: <strong className="text-white">{boiBaseRate}%</strong> + מרווח{' '}
                <strong className="text-white">{bankSpread}%</strong>
              </p>
            </div>
            <div className="flex flex-col gap-3 md:text-left">
              <div className="bg-white/10 backdrop-blur rounded-xl px-5 py-4">
                <p className="text-blue-200 text-xs mb-1">עודכן</p>
                <p className="font-semibold text-sm">
                  <time dateTime={lastUpdated}>{formatHebrewDate(lastUpdated)}</time>
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-xl px-5 py-4">
                <p className="text-blue-200 text-xs mb-1">החלטה הבאה</p>
                <p className="font-semibold text-sm">{formatHebrewDate(nextScheduledDecision)}</p>
                <p className="text-blue-200 text-xs mt-1">בעוד {daysLeft} ימים</p>
              </div>
            </div>
          </div>
        </div>

        {/* Breakdown */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 text-center">
            <p className="text-xs text-blue-600 font-medium mb-2">ריבית בנק ישראל</p>
            <p className="text-4xl font-bold text-blue-700">{boiBaseRate}%</p>
            <p className="text-xs text-gray-500 mt-2">הריבית הבסיסית שקובע בנק ישראל</p>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 text-center">
            <p className="text-xs text-blue-600 font-medium mb-2">מרווח בנקאי</p>
            <p className="text-4xl font-bold text-blue-700">+{bankSpread}%</p>
            <p className="text-xs text-gray-500 mt-2">תוספת קבועה שהוסכמה ב-1994</p>
          </div>
          <div className="bg-gradient-to-br from-blue-100 to-blue-50 border-2 border-blue-300 rounded-xl p-5 text-center">
            <p className="text-xs text-blue-700 font-bold mb-2">ריבית פריים = סכום</p>
            <p className="text-4xl font-bold text-blue-800">{value}%</p>
            <p className="text-xs text-gray-500 mt-2">הריבית שהבנקים מלווים בה</p>
          </div>
        </div>

        {/* Chart */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-1">היסטוריה — 12 חודשים אחרונים</h2>
          <p className="text-sm text-gray-500 mb-6">ריבית בנק ישראל וריבית פריים</p>
          <PrimeRateChart data={[...historicalRates] as Array<{ month: string; boiRate: number; primeRate: number }>} />
        </div>

        {/* Next Decision Countdown */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-8 flex items-start gap-4">
          <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <Calendar className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <h3 className="font-bold text-amber-900 mb-1">ההחלטה הבאה של בנק ישראל</h3>
            <p className="text-amber-800 text-sm">
              הוועדה המוניטרית תתכנס ב-{formatHebrewDate(nextScheduledDecision)} — בעוד{' '}
              <strong>{daysLeft} ימים</strong>. בנק ישראל מחליט על הריבית בממוצע 8 פעמים בשנה.
            </p>
          </div>
        </div>

        {/* Calculator Example */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <TrendingDown className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-bold text-blue-900">מה זה אומר עבור המשכנתא שלי?</h2>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            דוגמה: משכנתא של ₪1,000,000 במסלול פריים ל-20 שנה:
          </p>
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div className="bg-white rounded-lg p-4">
              <p className="text-xs text-gray-500 mb-1">תשלום חודשי משוער</p>
              <p className="text-2xl font-bold text-blue-700">
                ₪{Math.round(monthlyPayment).toLocaleString('he-IL')}
              </p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <p className="text-xs text-gray-500 mb-1">ריבית שנתית (שנה ראשונה)</p>
              <p className="text-2xl font-bold text-blue-700">
                ₪{Math.round(yearlyInterest).toLocaleString('he-IL')}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            <Link
              href="/real-estate/mortgage"
              className="inline-flex items-center gap-1.5 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
            >
              <Home className="w-4 h-4" />
              מחשבון משכנתא
            </Link>
            <Link
              href="/real-estate/mortgage-optimizer"
              className="inline-flex items-center gap-1.5 bg-white border border-blue-300 text-blue-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-50 transition"
            >
              אופטימייזר תמהיל
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* FAQ */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">שאלות נפוצות</h2>
          <div className="space-y-3">
            {[
              {
                q: 'מה זה ריבית פריים?',
                a: 'ריבית הפריים היא ריבית הבסיס שהבנקים המסחריים בישראל משתמשים בה לתמחור הלוואות. היא שווה לריבית בנק ישראל בתוספת 1.5% — מרווח שנקבע ב-1994 ולא השתנה מאז.',
              },
              {
                q: 'מתי בנק ישראל מחליט על הריבית?',
                a: 'הוועדה המוניטרית מתכנסת בממוצע 8 פעמים בשנה. ההחלטה הבאה ב-' + formatHebrewDate(nextScheduledDecision) + '.',
              },
              {
                q: 'איך הריבית משפיעה על המשכנתא שלי?',
                a: 'מסלולי פריים ומסלולי ריבית משתנה (P±) מושפעים ישירות מכל שינוי בריבית. ירידה של 0.25% בריבית חוסכת כ-₪120-150 לחודש על כל מיליון ₪ משכנתא.',
              },
              {
                q: 'האם ריבית הפריים תרד?',
                a: 'ציפיות השוק מגולמות בשוק האג"ח. לניתוח עדכני, עקוב אחרי מסיבות העיתונאים של בנק ישראל לאחר כל החלטה.',
              },
            ].map(({ q, a }) => (
              <details key={q} className="border border-gray-200 rounded-lg">
                <summary className="px-4 py-3 font-medium text-gray-900 cursor-pointer hover:bg-gray-50 rounded-lg">
                  {q}
                </summary>
                <p className="px-4 pb-3 pt-1 text-sm text-gray-600 leading-relaxed">{a}</p>
              </details>
            ))}
          </div>
        </div>

        {/* Source */}
        <div className="text-center text-xs text-gray-400">
          <p>
            מקור:{' '}
            <a
              href={sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline inline-flex items-center gap-1"
            >
              בנק ישראל — ריביות <ExternalLink className="w-3 h-3" />
            </a>{' '}
            | עודכן: <time dateTime={lastUpdated}>{formatHebrewDate(lastUpdated)}</time>
          </p>
        </div>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(datasetSchema) }}
        />
        <BreadcrumbSchema
          items={[
            { name: 'דף הבית', url: 'https://cheshbonai.co.il' },
            { name: 'עדכוני שוק', url: 'https://cheshbonai.co.il/news' },
            { name: 'ריבית פריים', url: 'https://cheshbonai.co.il/news/prime-rate' },
          ]}
        />
      </div>
    </div>
  );
}
