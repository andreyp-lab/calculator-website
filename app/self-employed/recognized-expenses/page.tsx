import type { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/calculator/Breadcrumbs';
import { AuthorBox } from '@/components/calculator/AuthorBox';
import { CourseBanner } from '@/components/marketing/CourseBanner';
import { LeadMagnet } from '@/components/marketing/LeadMagnet';
import { COURSES } from '@/lib/config/courses';

const PAGE_PATH = '/self-employed/recognized-expenses';
const SITE_URL = 'https://cheshbonai.co.il';

export const metadata: Metadata = {
  title: 'הוצאות מוכרות לעצמאי 2026 — המדריך המלא לחיסכון במס',
  description:
    'מה נחשב הוצאה מוכרת לעצמאי ב-2026? רשימה מלאה: רכב, משרד בבית, טלפון, כיבוד, השתלמות, פחת וביטוחים — ואיך כל שקל מוכר חוסך לך מס. מדריך מעשי מרו"ח.',
  alternates: { canonical: PAGE_PATH },
  openGraph: {
    title: 'הוצאות מוכרות לעצמאי 2026 — המדריך המלא לחיסכון במס',
    description:
      'רשימת ההוצאות המוכרות לעצמאי 2026 ואיך הן מקטינות את ההכנסה החייבת במס. מדריך מעשי מרו"ח.',
    type: 'article',
    locale: 'he_IL',
  },
};

const faqItems = [
  {
    question: 'מה זאת הוצאה מוכרת?',
    answer:
      'הוצאה מוכרת היא הוצאה ששימשה לייצור הכנסה בעסק, וניתן לנכות אותה מההכנסה לפני חישוב המס. כל שקל של הוצאה מוכרת מקטין את ההכנסה החייבת — וכך מקטין את המס שאתה משלם. הוצאות פרטיות (שלא קשורות לעסק) אינן מוכרות.',
  },
  {
    question: 'כמה חוסכת לי הוצאה מוכרת?',
    answer:
      'החיסכון שווה לגובה ההוצאה כפול שיעור המס השולי שלך. לדוגמה: אם אתה במדרגת מס שולית של 31% והוצאת 1,000 ₪ מוכרים — תחסוך כ-310 ₪ במס (ולעיתים גם מע"מ וביטוח לאומי). לכן תיעוד מלא של ההוצאות הוא אחד הכלים החזקים ביותר לחיסכון.',
  },
  {
    question: 'האם הוצאות רכב מוכרות במלואן?',
    answer:
      'לא תמיד. הוצאות החזקת רכב (דלק, ביטוח, טיפולים) מוכרות בדרך כלל באופן חלקי, מכיוון שמניחים שימוש מעורב — עסקי ופרטי. הכללים המדויקים נקבעים על ידי רשות המסים ותלויים בסוג הרכב ובשימוש. מומלץ להיוועץ ברואה חשבון לחישוב המדויק.',
  },
  {
    question: 'האם אפשר לנכות הוצאות משרד בבית?',
    answer:
      'כן, בתנאי שחלק מהבית משמש בפועל לעסק. ניתן לנכות חלק יחסי מהוצאות הבית (ארנונה, חשמל, שכירות, אינטרנט) לפי שטח החדר העסקי מתוך הבית. חשוב לשמור תיעוד ולחשב את היחס בזהירות.',
  },
  {
    question: 'מה ההבדל בין הוצאה שוטפת לפחת?',
    answer:
      'הוצאה שוטפת (כמו טלפון או חומרי גלם) מנוכה במלואה בשנת ההוצאה. רכישת נכס לטווח ארוך (מחשב, ריהוט, ציוד) נרשמת כ"פחת" ומנוכה בפריסה על פני מספר שנים, לפי שיעורי הפחת שקבעה רשות המסים.',
  },
];

export default function RecognizedExpensesPage() {
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'הוצאות מוכרות לעצמאי 2026 — המדריך המלא לחיסכון במס',
    description:
      'מדריך מלא להוצאות מוכרות לעצמאי בישראל 2026 וכיצד הן מקטינות את ההכנסה החייבת במס.',
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
      { '@type': 'ListItem', position: 2, name: 'עצמאיים', item: `${SITE_URL}/self-employed` },
      { '@type': 'ListItem', position: 3, name: 'הוצאות מוכרות', item: `${SITE_URL}${PAGE_PATH}` },
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
              { label: 'עצמאיים', href: '/self-employed' },
              { label: 'הוצאות מוכרות' },
            ]}
          />
        </div>

        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            הוצאות מוכרות לעצמאי 2026
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            כל שקל של הוצאה מוכרת מקטין את ההכנסה החייבת — ובכך חוסך לך מס. הנה הרשימה המלאה של
            ההוצאות שמותר לעצמאי לנכות ב-2026, ואיך לנצל אותן עד הסוף בלי להסתבך עם רשות המסים.
          </p>
          <p className="text-sm text-gray-500 mt-3">נכתב על ידי אנדרי פלטונוב, רו"ח · עודכן ל-2026</p>
        </header>

        <div className="prose prose-lg max-w-none text-gray-800 leading-relaxed">
          <h2>איך הוצאה מוכרת חוסכת לך כסף?</h2>
          <p>
            כשאתה מנכה הוצאה מוכרת, אתה מקטין את ההכנסה החייבת במס. החיסכון שווה ל
            <strong>גובה ההוצאה כפול שיעור המס השולי שלך</strong>. למשל, אם אתה במדרגת 31% והוצאת
            1,000 ₪ מוכרים — חסכת כ-310 ₪ במס. לכן תיעוד מלא של הוצאות הוא כלי חיסכון מהחזקים
            ביותר שיש לעצמאי.
          </p>

          <h2>הוצאות מוכרות נפוצות לעצמאי</h2>
        </div>

        <div className="overflow-x-auto my-6 not-prose">
          <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-gray-50">
              <tr className="text-right">
                <th className="p-3 font-bold text-gray-700 border-b">קטגוריה</th>
                <th className="p-3 font-bold text-gray-700 border-b">דוגמאות</th>
                <th className="p-3 font-bold text-gray-700 border-b">הכרה</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              <tr><td className="p-3 border-b font-medium">משרד / מקום עבודה</td><td className="p-3 border-b">שכירות, ארנונה, חשמל, אינטרנט</td><td className="p-3 border-b">מלאה / יחסית (משרד בבית)</td></tr>
              <tr className="bg-gray-50/50"><td className="p-3 border-b font-medium">רכב</td><td className="p-3 border-b">דלק, ביטוח, טיפולים</td><td className="p-3 border-b">חלקית (שימוש מעורב)</td></tr>
              <tr><td className="p-3 border-b font-medium">תקשורת</td><td className="p-3 border-b">טלפון נייד, חבילת אינטרנט</td><td className="p-3 border-b">לפי חלק עסקי</td></tr>
              <tr className="bg-gray-50/50"><td className="p-3 border-b font-medium">ציוד ופחת</td><td className="p-3 border-b">מחשב, ריהוט, ציוד מקצועי</td><td className="p-3 border-b">בפריסת פחת</td></tr>
              <tr><td className="p-3 border-b font-medium">שירותים מקצועיים</td><td className="p-3 border-b">רו"ח, ייעוץ משפטי, תוכנה</td><td className="p-3 border-b">מלאה</td></tr>
              <tr className="bg-gray-50/50"><td className="p-3 border-b font-medium">השתלמות מקצועית</td><td className="p-3 border-b">קורסים, כנסים, ספרות מקצועית</td><td className="p-3 border-b">מלאה (בתחום העיסוק)</td></tr>
              <tr><td className="p-3 border-b font-medium">שיווק ופרסום</td><td className="p-3 border-b">פרסום דיגיטלי, אתר, עיצוב</td><td className="p-3 border-b">מלאה</td></tr>
              <tr className="bg-gray-50/50"><td className="p-3 font-medium">כיבוד ואירוח</td><td className="p-3">כיבוד במקום העסק, אירוח לקוחות</td><td className="p-3">מוגבלת בתקרה</td></tr>
            </tbody>
          </table>
          <p className="text-xs text-gray-500 mt-2">
            * שיעורי ההכרה המדויקים נקבעים על ידי רשות המסים ותלויים בנסיבות. מומלץ להיוועץ ברואה חשבון.
          </p>
        </div>

        <div className="prose prose-lg max-w-none text-gray-800 leading-relaxed">
          <h2>3 כללי זהב לניהול הוצאות</h2>
          <ul>
            <li><strong>תעד הכול</strong> — שמור כל קבלה וחשבונית. הוצאה ללא תיעוד = הוצאה שלא תוכר.</li>
            <li><strong>הפרד אישי מעסקי</strong> — נהל חשבון בנק וכרטיס אשראי נפרדים לעסק. זה מקל על הניהול ומחזק את ההכרה בהוצאות.</li>
            <li><strong>הכר את הגבולות</strong> — חלק מההוצאות (רכב, כיבוד, אש"ל) מוכרות חלקית בלבד. ניכוי-יתר עלול להוביל לשומה ולקנסות.</li>
          </ul>

          <h2>טעות נפוצה: לא מנצלים הוצאות שמגיעות</h2>
          <p>
            הרבה עצמאים משלמים מס מיותר פשוט כי הם לא מתעדים הוצאות מוכרות — או לא יודעים שהן
            מוכרות. תיעוד שיטתי לאורך השנה יכול לחסוך אלפי שקלים במס. בקורס נכנסים לעומק לכל
            קטגוריה ומראים בדיוק איך לנהל את זה נכון.
          </p>
        </div>

        {/* Lead magnet */}
        <div className="my-10">
          <LeadMagnet
            magnet="recognized-expenses-list"
            title="20 הוצאות מוכרות שעצמאים מפספסים — חינם"
            description="הרשימה המלאה להורדה. כל שורה יכולה להקטין את המס שלך."
            bullets={['20 הוצאות מוכרות נפוצות', 'מה מוכר במלואו ומה חלקית', 'מוכן להדפסה ושמירה']}
            page={PAGE_PATH}
          />
        </div>

        {/* Course banner */}
        <div className="my-10">
          <CourseBanner course={COURSES.selfEmployed} page={PAGE_PATH} variant="hero" />
        </div>

        {/* Related */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">כלים ומדריכים רלוונטיים</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              { href: '/self-employed/net', label: 'מחשבון נטו לעצמאי' },
              { href: '/self-employed/tax-advances', label: 'מחשבון מקדמות מס' },
              { href: '/self-employed/vat', label: 'מחשבון מע"מ' },
              { href: '/self-employed/opening-business', label: 'מדריך פתיחת עסק' },
              { href: '/self-employed/exempt-to-authorized', label: 'מעבר לעוסק מורשה' },
              { href: '/personal-tax/tax-refund', label: 'מחשבון החזר מס' },
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
