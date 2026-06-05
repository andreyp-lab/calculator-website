import type { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/calculator/Breadcrumbs';
import { AuthorBox } from '@/components/calculator/AuthorBox';

const PAGE_PATH = '/investments/capital-gains-tax';
const SITE_URL = 'https://cheshbonai.co.il';

export const metadata: Metadata = {
  title: 'מס רווח הון על השקעות 2026 — מניות, קרנות ודיבידנד',
  description:
    'כמה מס משלמים על רווחים בבורסה ב-2026? 25% על רווח הון ריאלי, 25%/30% על דיבידנד, מס יסף, קיזוז הפסדים ופטורים. המדריך המלא למשקיע הישראלי מרו"ח.',
  alternates: { canonical: PAGE_PATH },
  openGraph: {
    title: 'מס רווח הון על השקעות 2026 — מניות, קרנות ודיבידנד',
    description:
      '25% על רווח הון ריאלי, מס דיבידנד, מס יסף, קיזוז הפסדים ופטורים — כל מה שמשקיע ישראלי צריך לדעת ב-2026.',
    type: 'article',
    locale: 'he_IL',
  },
};

const faqItems = [
  {
    question: 'כמה מס משלמים על רווח ממניות?',
    answer:
      'על רווח הון ממכירת ניירות ערך סחירים משלמים 25% על הרווח הריאלי (הרווח לאחר ניכוי עליית המדד). השיעור חל על מניות, קרנות נאמנות, ETF ואג"ח. בחשבון ישראלי המס מנוכה אוטומטית במקור בעת המכירה.',
  },
  {
    question: 'מהו מס דיבידנד ב-2026?',
    answer:
      'מס על דיבידנד הוא 25% למשקיע רגיל, ו-30% ל"בעל מניות מהותי" (מי שמחזיק 10% או יותר מהחברה). גם על ריבית מאיגרות חוב חל בדרך כלל 25%.',
  },
  {
    question: 'מה זה מס יסף על השקעות?',
    answer:
      'מס יסף הוא תוספת מס על הכנסה גבוהה. החל מ-2025 הוא חל גם על הכנסה פסיבית (רווחי הון, דיבידנד, ריבית, שכר דירה). מי שסך הכנסתו השנתית עולה על 721,560 ₪ (2026) משלם תוספת — על הכנסה פסיבית השיעור הכולל מגיע ל-5% (3% + 2%).',
  },
  {
    question: 'אפשר לקזז הפסדים בבורסה?',
    answer:
      'כן. הפסד הון ניתן לקזז כנגד רווח הון, וכך להקטין את המס. ניתן לקזז הפסדים מאותה שנה, ובמקרים מסוימים להעביר הפסדים לשנים הבאות. זהו כלי חשוב לתכנון מס — לעיתים כדאי לממש הפסד "על הנייר" כדי לקזז רווח.',
  },
  {
    question: 'אילו אפיקי השקעה פטורים ממס?',
    answer:
      'קרן השתלמות (לאחר 6 שנים) פטורה ממס רווחי הון, וכך גם חיסכון פנסיוני בתנאים מסוימים. קופת גמל להשקעה מאפשרת דחיית מס והטבות בפרישה. אלו מהכלים היעילים ביותר מבחינת מס למשקיע הישראלי.',
  },
];

export default function CapitalGainsTaxPage() {
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'מס רווח הון על השקעות 2026 — מניות, קרנות ודיבידנד',
    description: 'מדריך מלא למיסוי רווחי הון ודיבידנד על השקעות בישראל 2026.',
    inLanguage: 'he-IL',
    datePublished: '2026-06-01',
    dateModified: '2026-06-01',
    author: { '@type': 'Person', name: 'אנדרי פלטונוב', jobTitle: 'רואה חשבון' },
    publisher: {
      '@type': 'Organization',
      name: 'חשבונאי',
      url: SITE_URL,
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/og-default.png` },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE_URL}${PAGE_PATH}` },
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'דף הבית', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'השקעות', item: `${SITE_URL}/investments` },
      { '@type': 'ListItem', position: 3, name: 'מס רווח הון', item: `${SITE_URL}${PAGE_PATH}` },
    ],
  };

  return (
    <div className="min-h-screen bg-white" dir="rtl">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <article className="max-w-3xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Breadcrumbs
            items={[
              { label: 'דף הבית', href: '/' },
              { label: 'השקעות', href: '/investments' },
              { label: 'מס רווח הון' },
            ]}
          />
        </div>

        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            מס רווח הון על השקעות 2026
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            הרווחת בבורסה? לפני שתשמח — חלק מהרווח הולך למדינה. הנה כל מה שצריך לדעת על מיסוי
            מניות, קרנות, דיבידנד וריבית בישראל 2026, כולל קיזוז הפסדים ואפיקים פטורים ממס.
          </p>
          <p className="text-sm text-gray-500 mt-3">נכתב על ידי אנדרי פלטונוב, רו"ח · עודכן ל-2026</p>
        </header>

        <div className="prose prose-lg max-w-none text-gray-800 leading-relaxed">
          <h2>שיעורי המס על השקעות — 2026</h2>
        </div>

        <div className="overflow-x-auto my-6 not-prose">
          <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-gray-50">
              <tr className="text-right">
                <th className="p-3 font-bold text-gray-700 border-b">סוג הכנסה</th>
                <th className="p-3 font-bold text-gray-700 border-b">שיעור מס</th>
                <th className="p-3 font-bold text-gray-700 border-b">הערות</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              <tr><td className="p-3 border-b font-medium">רווח הון (מניות, קרנות, ETF, אג"ח)</td><td className="p-3 border-b">25%</td><td className="p-3 border-b">על הרווח הריאלי (בניכוי מדד)</td></tr>
              <tr className="bg-gray-50/50"><td className="p-3 border-b font-medium">דיבידנד — משקיע רגיל</td><td className="p-3 border-b">25%</td><td className="p-3 border-b">מחזיק מתחת ל-10%</td></tr>
              <tr><td className="p-3 border-b font-medium">דיבידנד — בעל מניות מהותי</td><td className="p-3 border-b">30%</td><td className="p-3 border-b">מחזיק 10% ומעלה</td></tr>
              <tr className="bg-gray-50/50"><td className="p-3 border-b font-medium">ריבית (אג"ח, פיקדונות)</td><td className="p-3 border-b">25%</td><td className="p-3 border-b">לרוב</td></tr>
              <tr><td className="p-3 font-medium">מס יסף (הכנסה פסיבית גבוהה)</td><td className="p-3">+2% (סה"כ 5%)</td><td className="p-3">מעל 721,560 ₪/שנה</td></tr>
            </tbody>
          </table>
        </div>

        <div className="prose prose-lg max-w-none text-gray-800 leading-relaxed">
          <h2>"רווח ריאלי" — למה זה חשוב?</h2>
          <p>
            המס חל על <strong>הרווח הריאלי</strong> — כלומר הרווח לאחר ניכוי עליית מדד המחירים
            לצרכן לאורך תקופת ההחזקה. בתקופות אינפלציה גבוהה זה מקטין את המס בפועל, מכיוון שחלק
            מ"הרווח" הוא רק שמירה על ערך הכסף ולא רווח אמיתי.
          </p>

          <h2>קיזוז הפסדים — הכלי שמשקיעים מפספסים</h2>
          <p>
            הפסד הון ניתן לקזז כנגד רווח הון ולהקטין את המס. אם מכרת נייר ברווח ויש לך נייר אחר
            בהפסד — מימוש ההפסד יכול לקזז את הרווח החייב. בסוף השנה כדאי לבדוק אם יש "הפסדים על
            הנייר" שכדאי לממש לצורכי קיזוז (Tax Loss Harvesting).
          </p>

          <h2>איך משלמים את המס?</h2>
          <p>
            בחשבון השקעות <strong>ישראלי</strong>, הברוקר/הבנק מנכה את המס במקור אוטומטית בעת
            המכירה — אינך צריך לעשות דבר. בחשבון אצל ברוקר <strong>זר</strong> (כמו Interactive
            Brokers), המס אינו מנוכה אוטומטית ועליך לדווח ולשלם בעצמך, לרוב במקדמות חצי-שנתיות.
          </p>

          <h2>אפיקים פטורים / דחויי מס</h2>
          <ul>
            <li><strong>קרן השתלמות</strong> — פטורה ממס רווחי הון לאחר 6 שנים.</li>
            <li><strong>חיסכון פנסיוני</strong> — דחיית מס והטבות בפרישה.</li>
            <li><strong>קופת גמל להשקעה</strong> — גמישות + הטבות מס בפרישה כקצבה.</li>
          </ul>

          <p className="text-sm text-gray-500">
            * אין לראות במדריך זה ייעוץ מס או השקעות. מומלץ להיוועץ ברואה חשבון.
          </p>
        </div>

        {/* Related */}
        <section className="my-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">כלים ומדריכים רלוונטיים</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              { href: '/investments/compound-interest', label: 'מחשבון ריבית דריבית' },
              { href: '/investments/roi', label: 'מחשבון תשואה (ROI)' },
              { href: '/investments/fire', label: 'מחשבון FIRE' },
              { href: '/blog/fire-strategy-israel', label: 'אסטרטגיית FIRE בישראל' },
              { href: '/blog/inflation-and-investments', label: 'אינפלציה והשקעות' },
              { href: '/glossary/surtax', label: 'מס יסף — הגדרה' },
            ].map((c) => (
              <Link
                key={c.href}
                href={c.href}
                className="group flex items-center justify-between gap-2 border border-gray-200 rounded-lg p-4 hover:border-blue-400 hover:shadow-sm transition"
              >
                <span className="font-medium text-gray-900 group-hover:text-blue-700 transition">{c.label}</span>
                <span className="text-blue-600 group-hover:-translate-x-1 transition" aria-hidden>←</span>
              </Link>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">שאלות נפוצות</h2>
          <div className="space-y-4">
            {faqItems.map((f) => (
              <details key={f.question} className="border border-gray-200 rounded-lg p-4 group">
                <summary className="font-bold text-gray-900 cursor-pointer list-none flex items-center justify-between">
                  {f.question}
                  <span className="text-gray-400 group-open:rotate-180 transition" aria-hidden>▾</span>
                </summary>
                <p className="text-gray-700 mt-3 leading-relaxed">{f.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="mb-8">
          <AuthorBox />
        </section>
      </article>
    </div>
  );
}
