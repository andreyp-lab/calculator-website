import type { Metadata } from 'next';
import Link from 'next/link';
import { ExternalLink, Users, ArrowLeft } from 'lucide-react';
import { Breadcrumbs } from '@/components/calculator/Breadcrumbs';
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';
import { MACRO_DATA, formatHebrewDate } from '@/lib/data/macroeconomic-data';
import { WageChart } from './WageChart';

export const revalidate = 2592000; // ISR: ~30 ימים (רבעוני)

export const metadata: Metadata = {
  title: 'שכר ממוצע במשק ישראל 2026',
  description: `השכר הממוצע במשק: ₪${MACRO_DATA.averageWage.monthly.toLocaleString('he-IL')} לחודש (${MACRO_DATA.averageWage.reportPeriod}). גרף היסטורי, השוואת שכר ומחשבון שכר נטו.`,
  keywords: ['שכר ממוצע ישראל', 'שכר ממוצע 2026', 'ממוצע שכר במשק', 'שכר ברוטו ממוצע'],
  alternates: { canonical: 'https://cheshbonai.co.il/news/average-wage' },
  openGraph: {
    title: `שכר ממוצע: ₪${MACRO_DATA.averageWage.monthly.toLocaleString('he-IL')}/חודש`,
    description: `${MACRO_DATA.averageWage.reportPeriod} | עודכן: ${formatHebrewDate(MACRO_DATA.averageWage.lastUpdated)}`,
    url: 'https://cheshbonai.co.il/news/average-wage',
  },
};

const datasetSchema = {
  '@context': 'https://schema.org',
  '@type': 'Dataset',
  name: 'שכר ממוצע במשק ישראל 2026',
  description: `שכר ממוצע חודשי: ₪${MACRO_DATA.averageWage.monthly.toLocaleString('he-IL')} (${MACRO_DATA.averageWage.reportPeriod})`,
  url: 'https://cheshbonai.co.il/news/average-wage',
  inLanguage: 'he-IL',
  creator: { '@type': 'Organization', name: 'חשבונאי' },
  publisher: { '@type': 'Organization', name: 'ביטוח לאומי', url: MACRO_DATA.averageWage.sourceUrl },
  dateModified: MACRO_DATA.averageWage.lastUpdated,
};

export default function AverageWagePage() {
  const { monthly, reportPeriod, lastUpdated, sourceUrl, historicalWages } = MACRO_DATA.averageWage;

  // מס הכנסה משוער על שכר ממוצע
  const estimatedNetPct = 0.78; // ~22% מס + ב"ל על שכר ממוצע
  const estimatedNet = Math.round(monthly * estimatedNetPct);
  const estimatedTax = monthly - estimatedNet;

  // שכר מינימום vs ממוצע
  const minimumWage = 5_880; // ₪ שכר מינימום 2026
  const ratioToMin = (monthly / minimumWage).toFixed(1);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Breadcrumbs
            items={[
              { label: 'דף הבית', href: '/' },
              { label: 'עדכוני שוק', href: '/news' },
              { label: 'שכר ממוצע' },
            ]}
          />
        </div>

        {/* Hero */}
        <div className="bg-gradient-to-br from-green-500 to-emerald-700 text-white rounded-2xl p-8 mb-8">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div>
              <h1 className="text-green-100 text-sm font-medium mb-2">שכר ממוצע חודשי — {reportPeriod}</h1>
              <div className="text-6xl font-bold mb-2">
                ₪{monthly.toLocaleString('he-IL')}
              </div>
              <p className="text-green-100 text-lg">
                ברוטו למשרה מלאה | נטו משוער:{' '}
                <strong className="text-white">₪{estimatedNet.toLocaleString('he-IL')}</strong>
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <div className="bg-white/10 backdrop-blur rounded-xl px-5 py-4">
                <p className="text-green-200 text-xs mb-1">עודכן</p>
                <p className="font-semibold text-sm">
                  <time dateTime={lastUpdated}>{formatHebrewDate(lastUpdated)}</time>
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-xl px-5 py-4">
                <p className="text-green-200 text-xs mb-1">מקור</p>
                <p className="font-semibold text-sm">ביטוח לאומי / למס</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <div className="bg-green-50 border border-green-200 rounded-xl p-5 text-center">
            <p className="text-xs text-green-600 font-medium mb-2">ברוטו</p>
            <p className="text-3xl font-bold text-green-700">₪{monthly.toLocaleString('he-IL')}</p>
            <p className="text-xs text-gray-500 mt-2">לפני מסים וניכויים</p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-xl p-5 text-center">
            <p className="text-xs text-green-600 font-medium mb-2">נטו משוער</p>
            <p className="text-3xl font-bold text-green-700">₪{estimatedNet.toLocaleString('he-IL')}</p>
            <p className="text-xs text-gray-500 mt-2">אחרי מס + ב"ל + ביטוח</p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-xl p-5 text-center">
            <p className="text-xs text-green-600 font-medium mb-2">פי כמה משכר מינימום</p>
            <p className="text-3xl font-bold text-green-700">×{ratioToMin}</p>
            <p className="text-xs text-gray-500 mt-2">שכר מינימום: ₪{minimumWage.toLocaleString('he-IL')}</p>
          </div>
        </div>

        {/* Chart */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-1">מגמה — 5 רבעונים אחרונים</h2>
          <p className="text-sm text-gray-500 mb-6">שכר ממוצע ברוטו (ירוק כהה = נוכחי)</p>
          <WageChart
            data={[...historicalWages] as Array<{ quarter: string; wage: number }>}
            currentWage={monthly}
          />
        </div>

        {/* Tax Breakdown */}
        <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-green-600" />
            <h2 className="text-lg font-bold text-green-900">פירוט ניכויים על שכר ממוצע</h2>
          </div>
          <p className="text-sm text-gray-500 mb-4">אומדן משוער לרווק/ה ללא ילדים</p>
          <div className="space-y-2 mb-4">
            {[
              { label: 'שכר ברוטו', amount: monthly, isPositive: true },
              { label: 'מס הכנסה (משוער)', amount: -Math.round(monthly * 0.12), isPositive: false },
              { label: 'ביטוח לאומי עובד (12%)', amount: -Math.round(monthly * 0.12), isPositive: false },
              { label: 'ניכויים אחרים', amount: -Math.round(monthly * 0.02), isPositive: false },
              { label: 'שכר נטו', amount: estimatedNet, isPositive: true, bold: true },
            ].map(({ label, amount, isPositive, bold }) => (
              <div key={label} className={`flex justify-between items-center py-2 border-b border-green-100 ${bold ? 'font-bold' : ''}`}>
                <span className={`text-sm ${bold ? 'text-green-900' : 'text-gray-700'}`}>{label}</span>
                <span className={`text-sm font-mono ${isPositive ? 'text-green-700' : 'text-red-600'}`}>
                  {isPositive ? '' : '-'}₪{Math.abs(amount).toLocaleString('he-IL')}
                </span>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/personal-tax/salary-net-gross"
              className="inline-flex items-center gap-1.5 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition"
            >
              מחשבון שכר נטו/ברוטו מדויק
            </Link>
            <Link
              href="/personal-tax/tax-refund"
              className="inline-flex items-center gap-1.5 bg-white border border-green-300 text-green-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-50 transition"
            >
              מחשבון החזר מס
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
                q: 'מי מגדיר את השכר הממוצע במשק?',
                a: 'הלשכה המרכזית לסטטיסטיקה (למס) מחשבת את השכר הממוצע על בסיס דיווחי מעסיקים. ביטוח לאומי משתמש בנתון זה לחישוב גמלאות.',
              },
              {
                q: 'למה השכר הממוצע חשוב?',
                a: 'השכר הממוצע קובע תקרות וסף זכאות בגמלאות ביטוח לאומי כגון: דמי לידה, אבטלה, נכות ועוד. הוא גם מדד לייחוס שכר הוגן.',
              },
              {
                q: 'מה ההבדל בין שכר ממוצע לחציון שכר?',
                a: 'השכר הממוצע מושפע מהרוויחים מאוד. חציון השכר (50% מהעובדים מרוויחים פחות ממנו) נמוך יותר — כ-₪9,500-10,000 ב-2026.',
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
            <a href={sourceUrl} target="_blank" rel="noopener noreferrer"
              className="text-green-500 hover:underline inline-flex items-center gap-1">
              ביטוח לאומי — נתונים אקטואריים <ExternalLink className="w-3 h-3" />
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
            { name: 'שכר ממוצע', url: 'https://cheshbonai.co.il/news/average-wage' },
          ]}
        />
      </div>
    </div>
  );
}
