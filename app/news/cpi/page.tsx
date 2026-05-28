import type { Metadata } from 'next';
import Link from 'next/link';
import { ExternalLink, TrendingUp, Calculator, ArrowLeft } from 'lucide-react';
import { Breadcrumbs } from '@/components/calculator/Breadcrumbs';
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';
import { MACRO_DATA, formatHebrewDate } from '@/lib/data/macroeconomic-data';
import { CpiChart } from './CpiChart';

export const revalidate = 21600; // ISR: 6 שעות

export const metadata: Metadata = {
  title: 'מדד המחירים לצרכן (אינפלציה) 2026',
  description: `אינפלציה שנתית עדכנית: ${MACRO_DATA.inflation.annualRate}%. שינוי חודשי: ${MACRO_DATA.inflation.monthlyRate}%. גרף היסטורי, מדד CPI, ומשמעות לחיסכון ולמשכנתא.`,
  keywords: [
    'מדד המחירים לצרכן',
    'אינפלציה ישראל',
    'CPI ישראל',
    'מדד עדכני',
    'שיעור אינפלציה 2026',
  ],
  alternates: {
    canonical: 'https://cheshbonai.co.il/news/cpi',
  },
  openGraph: {
    title: `אינפלציה עדכנית: ${MACRO_DATA.inflation.annualRate}%`,
    description: `מדד המחירים לצרכן — שינוי שנתי | עודכן: ${formatHebrewDate(MACRO_DATA.inflation.lastUpdated)}`,
    url: 'https://cheshbonai.co.il/news/cpi',
  },
};

const datasetSchema = {
  '@context': 'https://schema.org',
  '@type': 'Dataset',
  name: 'מדד המחירים לצרכן ישראל 2026',
  description: `אינפלציה שנתית בישראל: ${MACRO_DATA.inflation.annualRate}% (12 חודשים אחרונים)`,
  url: 'https://cheshbonai.co.il/news/cpi',
  inLanguage: 'he-IL',
  temporalCoverage: '2025-06/2026-05',
  creator: { '@type': 'Organization', name: 'חשבונאי' },
  publisher: { '@type': 'Organization', name: 'הלשכה המרכזית לסטטיסטיקה', url: MACRO_DATA.inflation.sourceUrl },
  dateModified: MACRO_DATA.inflation.lastUpdated,
};

export default function CpiPage() {
  const { annualRate, monthlyRate, cpiIndex, lastUpdated, sourceUrl, historicalRates } =
    MACRO_DATA.inflation;

  // השפעה על חיסכון: ₪100,000 לאחר שנה
  const savingsImpact = 100_000 * (1 - annualRate / 100);
  const lostPurchasingPower = 100_000 - savingsImpact;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Breadcrumbs
            items={[
              { label: 'דף הבית', href: '/' },
              { label: 'עדכוני שוק', href: '/news' },
              { label: 'מדד המחירים לצרכן' },
            ]}
          />
        </div>

        {/* Hero */}
        <div className="bg-gradient-to-br from-orange-500 to-amber-600 text-white rounded-2xl p-8 mb-8">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div>
              <h1 className="text-orange-100 text-sm font-medium mb-2">אינפלציה שנתית — 12 חודשים אחרונים</h1>
              <div className="text-7xl font-bold mb-2">{annualRate}%</div>
              <p className="text-orange-100 text-lg">
                שינוי חודשי אחרון:{' '}
                <strong className="text-white">
                  {monthlyRate >= 0 ? '+' : ''}
                  {monthlyRate}%
                </strong>
                {' '}| מדד:{' '}
                <strong className="text-white">{cpiIndex}</strong>
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <div className="bg-white/10 backdrop-blur rounded-xl px-5 py-4">
                <p className="text-orange-200 text-xs mb-1">עודכן</p>
                <p className="font-semibold text-sm">
                  <time dateTime={lastUpdated}>{formatHebrewDate(lastUpdated)}</time>
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-xl px-5 py-4">
                <p className="text-orange-200 text-xs mb-1">מקור</p>
                <p className="font-semibold text-sm">למס — הלשכה המרכזית לסטטיסטיקה</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-5 text-center">
            <p className="text-xs text-orange-600 font-medium mb-2">שינוי שנתי</p>
            <p className="text-4xl font-bold text-orange-700">{annualRate}%</p>
            <p className="text-xs text-gray-500 mt-2">12 חודשים אחרונים</p>
          </div>
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-5 text-center">
            <p className="text-xs text-orange-600 font-medium mb-2">שינוי חודשי</p>
            <p className="text-4xl font-bold text-orange-700">
              {monthlyRate >= 0 ? '+' : ''}
              {monthlyRate}%
            </p>
            <p className="text-xs text-gray-500 mt-2">חודש אחרון</p>
          </div>
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-5 text-center">
            <p className="text-xs text-orange-600 font-medium mb-2">מדד CPI</p>
            <p className="text-4xl font-bold text-orange-700">{cpiIndex}</p>
            <p className="text-xs text-gray-500 mt-2">בסיס 2022 = 100</p>
          </div>
        </div>

        {/* Chart */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-1">היסטוריה — 12 חודשים אחרונים</h2>
          <p className="text-sm text-gray-500 mb-6">אינפלציה שנתית (קו) ושינוי חודשי (עמודות)</p>
          <CpiChart data={[...historicalRates] as Array<{ month: string; annualRate: number; monthlyRate: number }>} />
        </div>

        {/* Impact Calculator */}
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Calculator className="w-5 h-5 text-orange-600" />
            <h2 className="text-lg font-bold text-orange-900">מה האינפלציה אומרת עליי?</h2>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            דוגמה: ₪100,000 בחיסכון ללא ריבית, לאחר שנה עם אינפלציה של {annualRate}%:
          </p>
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div className="bg-white rounded-lg p-4">
              <p className="text-xs text-gray-500 mb-1">כוח קנייה אחרי שנה</p>
              <p className="text-2xl font-bold text-orange-700">
                ₪{Math.round(savingsImpact).toLocaleString('he-IL')}
              </p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <p className="text-xs text-gray-500 mb-1">ירידה בכוח הקנייה</p>
              <p className="text-2xl font-bold text-red-600">
                -₪{Math.round(lostPurchasingPower).toLocaleString('he-IL')}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/investments/compound-interest"
              className="inline-flex items-center gap-1.5 bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-700 transition"
            >
              <TrendingUp className="w-4 h-4" />
              מחשבון ריבית דריבית
            </Link>
            <Link
              href="/real-estate/mortgage"
              className="inline-flex items-center gap-1.5 bg-white border border-orange-300 text-orange-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-50 transition"
            >
              מחשבון משכנתא
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <Link
              href="/investments/retirement"
              className="inline-flex items-center gap-1.5 bg-white border border-orange-300 text-orange-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-50 transition"
            >
              תכנון פרישה
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
                q: 'מה זה מדד המחירים לצרכן?',
                a: 'מדד המחירים לצרכן (CPI) הוא מדד שמודד את השינוי הממוצע במחירי סל מוצרים ושירותים שמשפחה ממוצעת בישראל צורכת. מפרסם אותו הלשכה המרכזית לסטטיסטיקה (למס) מדי חודש.',
              },
              {
                q: 'מתי מתפרסם המדד החדש?',
                a: 'המדד מתפרסם בדרך כלל ב-15 לחודש לגבי החודש הקודם.',
              },
              {
                q: 'איך האינפלציה משפיעה על המשכנתא?',
                a: 'מסלולי צמוד מדד — הקרן עולה עם המדד. למשל, משכנתא של ₪500,000 צמודת מדד עולה בכ-₪14,000 בשנה עם אינפלציה של 2.8%.',
              },
              {
                q: 'האם אינפלציה של 2.8% גבוהה?',
                a: 'יעד בנק ישראל הוא 1%-3%. אינפלציה של 2.8% נמצאת בסוף טווח היעד ונחשבת גבוהה מעט אך בשליטה.',
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
              className="text-orange-500 hover:underline inline-flex items-center gap-1"
            >
              הלשכה המרכזית לסטטיסטיקה <ExternalLink className="w-3 h-3" />
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
            { name: 'מדד המחירים לצרכן', url: 'https://cheshbonai.co.il/news/cpi' },
          ]}
        />
      </div>
    </div>
  );
}
