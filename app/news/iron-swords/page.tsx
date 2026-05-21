import type { Metadata } from 'next';
import Link from 'next/link';
import { ExternalLink, Shield, CheckCircle, ArrowLeft, AlertCircle } from 'lucide-react';
import { Breadcrumbs } from '@/components/calculator/Breadcrumbs';
import { MACRO_DATA, formatHebrewDate } from '@/lib/data/macroeconomic-data';

export const revalidate = 604800; // ISR: 7 ימים (שבועי)

export const metadata: Metadata = {
  title: 'מענקי חרבות ברזל 2026 — סכומים עדכניים | FinCalc',
  description: `מענק כללי ₪${MACRO_DATA.ironSwordsBonuses.generalGrant.toLocaleString('he-IL')}, מענק יומי ₪${MACRO_DATA.ironSwordsBonuses.dailyGrant}, מענק חזרה לעבודה ₪${MACRO_DATA.ironSwordsBonuses.returnToWorkGrant}. מעודכן ${formatHebrewDate(MACRO_DATA.ironSwordsBonuses.lastUpdated)}.`,
  keywords: [
    'מענק חרבות ברזל',
    'מענק מילואים',
    'ביטוח לאומי מילואים',
    'מענק חרבות ברזל 2026',
  ],
  alternates: { canonical: 'https://cheshbonai.co.il/news/iron-swords' },
  openGraph: {
    title: `מענקי חרבות ברזל: ₪${MACRO_DATA.ironSwordsBonuses.generalGrant.toLocaleString('he-IL')} | FinCalc`,
    description: `מענק כללי, יומי וחזרה לעבודה — עודכן: ${formatHebrewDate(MACRO_DATA.ironSwordsBonuses.lastUpdated)}`,
    url: 'https://cheshbonai.co.il/news/iron-swords',
  },
};

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'מענקי חרבות ברזל 2026 — סכומים עדכניים',
  description: `מענקי ביטוח לאומי במסגרת מלחמת חרבות ברזל. מענק כללי ₪${MACRO_DATA.ironSwordsBonuses.generalGrant}, מענק יומי ₪${MACRO_DATA.ironSwordsBonuses.dailyGrant}.`,
  url: 'https://cheshbonai.co.il/news/iron-swords',
  inLanguage: 'he-IL',
  dateModified: MACRO_DATA.ironSwordsBonuses.lastUpdated,
  publisher: { '@type': 'Organization', name: 'חשבונאי - FinCalc', url: 'https://cheshbonai.co.il' },
};

const STATUS_LABELS = {
  active: { label: 'פעיל', color: 'bg-green-100 text-green-700 border-green-200' },
  suspended: { label: 'מושהה', color: 'bg-red-100 text-red-700 border-red-200' },
  updated: { label: 'עודכן', color: 'bg-amber-100 text-amber-700 border-amber-200' },
};

export default function IronSwordsPage() {
  const { generalGrant, dailyGrant, returnToWorkGrant, lastUpdated, status, sourceUrl, notes } =
    MACRO_DATA.ironSwordsBonuses;

  const statusInfo = STATUS_LABELS[status];

  const grants = [
    {
      title: 'מענק כללי (חד-פעמי)',
      amount: generalGrant,
      description: 'מענק חד-פעמי לשמורי מילואים העומדים בתנאי הזכאות',
      conditions: ['גויסת למילואים בצו 8 או בסדר', 'תקופת שירות מינימלית כנדרש', 'הגשת תביעה בביטוח לאומי'],
    },
    {
      title: 'מענק יומי',
      amount: dailyGrant,
      description: 'תשלום יומי לכל יום שירות מילואים מעבר לסף הבסיסי',
      conditions: ['מחושב לפי ימי השירות בפועל', 'מעל סף ימים מינימלי', 'בנוסף לשכר המילואים מהמעסיק'],
    },
    {
      title: 'מענק חזרה לעבודה',
      amount: returnToWorkGrant,
      description: 'מענק חד-פעמי למי שחזר לשוק העבודה לאחר שחרור',
      conditions: ['שוחרר מילואים ממושכים (30+ ימים)', 'חזר לעבודה תוך 90 ימים', 'מגיש תביעה בביטוח לאומי'],
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Breadcrumbs
            items={[
              { label: 'דף הבית', href: '/' },
              { label: 'עדכוני שוק', href: '/news' },
              { label: 'מענקי חרבות ברזל' },
            ]}
          />
        </div>

        {/* Hero */}
        <div className="bg-gradient-to-br from-red-600 to-rose-700 text-white rounded-2xl p-8 mb-8">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <Shield className="w-8 h-8" />
                <span className={`text-sm font-bold px-3 py-1 rounded-full border ${statusInfo.color}`}>
                  {statusInfo.label}
                </span>
              </div>
              <p className="text-red-100 text-sm font-medium mb-2">מענקי חרבות ברזל</p>
              <div className="text-6xl font-bold mb-2">
                ₪{generalGrant.toLocaleString('he-IL')}
              </div>
              <p className="text-red-100 text-lg">
                מענק כללי | יומי:{' '}
                <strong className="text-white">₪{dailyGrant}</strong> | חזרה לעבודה:{' '}
                <strong className="text-white">₪{returnToWorkGrant.toLocaleString('he-IL')}</strong>
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <div className="bg-white/10 backdrop-blur rounded-xl px-5 py-4">
                <p className="text-red-200 text-xs mb-1">עודכן</p>
                <p className="font-semibold text-sm">{formatHebrewDate(lastUpdated)}</p>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-xl px-5 py-4">
                <p className="text-red-200 text-xs mb-1">מקור</p>
                <p className="font-semibold text-sm">ביטוח לאומי</p>
              </div>
            </div>
          </div>
        </div>

        {/* Notes Banner */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-amber-800">
            <strong>הערה חשובה:</strong> {notes}. לפרטים מלאים ולהגשת תביעה,{' '}
            <a href={sourceUrl} target="_blank" rel="noopener noreferrer" className="underline">
              גש לאתר ביטוח לאומי
            </a>
            .
          </p>
        </div>

        {/* Grant Cards */}
        <div className="space-y-4 mb-8">
          {grants.map((grant) => (
            <div key={grant.title} className="bg-red-50 border border-red-200 rounded-xl p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
                <h2 className="text-lg font-bold text-red-900">{grant.title}</h2>
                <div className="text-3xl font-bold text-red-700">
                  ₪{grant.amount.toLocaleString('he-IL')}
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-3">{grant.description}</p>
              <div className="space-y-1.5">
                <p className="text-xs font-semibold text-red-700 mb-1">תנאי זכאות עיקריים:</p>
                {grant.conditions.map((c) => (
                  <div key={c} className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-700">{c}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Calculator Links */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4">מחשבונים קשורים</h2>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/employee-rights/reserve-duty-pay"
              className="inline-flex items-center gap-1.5 bg-red-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-red-700 transition"
            >
              <Shield className="w-4 h-4" />
              מחשבון שכר מילואים
            </Link>
            <Link
              href="/employee-rights/unemployment-benefits"
              className="inline-flex items-center gap-1.5 bg-white border border-gray-300 text-gray-700 px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
            >
              דמי אבטלה
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <Link
              href="/employee-rights/severance"
              className="inline-flex items-center gap-1.5 bg-white border border-gray-300 text-gray-700 px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
            >
              פיצויי פיטורין
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
                q: 'מי זכאי למענקי חרבות ברזל?',
                a: 'שמורי מילואים שגויסו בצו 8 או בסדר מילואים מאז תחילת מלחמת חרבות ברזל (7.10.2023). הזכאות תלויה בתקופת השירות ובמעמד המבוטח.',
              },
              {
                q: 'איך מגישים תביעה?',
                a: 'מגישים דרך אתר ביטוח לאומי — my.btl.gov.il — עם צו הגיוס ואישורי שירות. ניתן גם להגיש בסניף ביטוח לאומי.',
              },
              {
                q: 'האם המענק חייב במס?',
                a: 'מענקי חרבות ברזל פטורים ממס הכנסה. אך שכר המילואים עצמו (מעבר למענק) עשוי להיות חייב במס.',
              },
              {
                q: 'האם המענקים יוארכו?',
                a: 'הזכאות ותקופות הפעילות מתעדכנות בהתאם להחלטות הממשלה. הדף מתעדכן עם כל שינוי.',
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
              className="text-red-500 hover:underline inline-flex items-center gap-1">
              ביטוח לאומי — חרבות ברזל <ExternalLink className="w-3 h-3" />
            </a>{' '}
            | עודכן: {formatHebrewDate(lastUpdated)}
          </p>
        </div>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
        />
      </div>
    </div>
  );
}
