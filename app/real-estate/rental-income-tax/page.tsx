import type { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/calculator/Breadcrumbs';
import { AuthorBox } from '@/components/calculator/AuthorBox';

const PAGE_PATH = '/real-estate/rental-income-tax';
const SITE_URL = 'https://cheshbonai.co.il';

export const metadata: Metadata = {
  title: 'מיסוי שכר דירה 2026 — פטור, מסלול 10% ומדרגות מס',
  description:
    'איך ממוסים הכנסה משכר דירה למגורים ב-2026? 3 המסלולים: פטור (עד 5,654 ₪/חודש), מסלול 10% ומדרגות מס. כולל פטור חלקי, דוגמאות חישוב וטיפים. מדריך מרו"ח.',
  alternates: { canonical: PAGE_PATH },
  openGraph: {
    title: 'מיסוי שכר דירה 2026 — פטור, מסלול 10% ומדרגות מס',
    description:
      'שלושת מסלולי המס על הכנסה משכר דירה למגורים 2026: פטור, 10% ומדרגות. דוגמאות חישוב וטיפים מרו"ח.',
    type: 'article',
    locale: 'he_IL',
  },
};

const faqItems = [
  {
    question: 'כמה מס משלמים על שכר דירה?',
    answer:
      'תלוי במסלול שתבחר. במסלול הפטור — אם ההכנסה מתחת ל-5,654 ₪/חודש (2026) אינך משלם מס כלל. במסלול 10% — משלמים 10% מסך דמי השכירות, ללא ניכוי הוצאות. במסלול מדרגות המס — משלמים לפי מדרגות המס שלך, עם אפשרות לנכות הוצאות ופחת.',
  },
  {
    question: 'מהי תקרת הפטור על שכר דירה ב-2026?',
    answer:
      'תקרת הפטור המלא היא 5,654 ₪ לחודש (נכון ל-2024–2026). אם ההכנסה החודשית עד הסכום הזה — היא פטורה ממס לחלוטין. מעל הסכום הזה נכנס מנגנון "פטור חלקי" עד לתקרה של 11,308 ₪.',
  },
  {
    question: 'איך עובד הפטור החלקי?',
    answer:
      'אם דמי השכירות בין 5,654 ל-11,308 ₪/חודש, מחשבים את הפטור כך: מפחיתים מתקרת הפטור (5,654) את הסכום שבו ההכנסה עולה על התקרה. הנוסחה: פטור = (2 × 5,654) − ההכנסה. החלק שמעל הפטור חייב במס לפי מדרגות. מעל 11,308 ₪ — הפטור מתאפס לחלוטין.',
  },
  {
    question: 'מתי כדאי לבחור מסלול 10%?',
    answer:
      'מסלול 10% משתלם כשההכנסה גבוהה מתקרת הפטור ואין לך הוצאות מוכרות גדולות (ריבית משכנתא, תחזוקה, פחת). הוא פשוט לדיווח ואינו מוגבל בתקרה — אך לא ניתן לקזז בו הוצאות, והפחת ייווסף לרווח החייב במס שבח בעת מכירת הדירה.',
  },
  {
    question: 'האם משלמים ביטוח לאומי על שכר דירה?',
    answer:
      'הכנסה משכר דירה למגורים פטורה בדרך כלל מדמי ביטוח לאומי, כל עוד אינה מגיעה לכדי "עסק". זו אחת הסיבות שהשקעה בנדל"ן למגורים נחשבת יעילה מבחינת מס בהשוואה להכנסה מיגיעה אישית.',
  },
];

export default function RentalIncomeTaxPage() {
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'מיסוי שכר דירה 2026 — פטור, מסלול 10% ומדרגות מס',
    description: 'מדריך מלא למיסוי הכנסה משכר דירה למגורים בישראל 2026.',
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
      { '@type': 'ListItem', position: 2, name: 'נדל"ן', item: `${SITE_URL}/real-estate` },
      { '@type': 'ListItem', position: 3, name: 'מיסוי שכר דירה', item: `${SITE_URL}${PAGE_PATH}` },
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
              { label: 'נדל"ן', href: '/real-estate' },
              { label: 'מיסוי שכר דירה' },
            ]}
          />
        </div>

        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            מיסוי שכר דירה 2026 — המדריך המלא
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            משכיר דירה למגורים? יש שלוש דרכים לשלם מס — והבחירה ביניהן יכולה לחסוך לך אלפי שקלים
            בשנה. הנה כל מה שצריך לדעת על מסלול הפטור, מסלול 10% ומסלול מדרגות המס, עם דוגמאות.
          </p>
          <p className="text-sm text-gray-500 mt-3">נכתב על ידי אנדרי פלטונוב, רו"ח · עודכן ל-2026</p>
        </header>

        <div className="prose prose-lg max-w-none text-gray-800 leading-relaxed">
          <h2>3 מסלולי המס על שכר דירה למגורים</h2>
          <p>
            על הכנסה מהשכרת דירת מגורים בישראל ניתן לבחור באחד משלושה מסלולים. הבחירה היא שנתית
            וניתן להחליף בין שנים — כדאי לחשב כל שנה מה הכי משתלם.
          </p>

          <h3>1. מסלול הפטור</h3>
          <p>
            אם סך ההכנסה החודשית משכר דירה אינו עולה על <strong>5,654 ₪ (2026)</strong> — ההכנסה
            פטורה ממס לחלוטין. זהו המסלול הפשוט והמשתלם ביותר למשכירים בודדים.
          </p>

          <h3>2. מסלול 10%</h3>
          <p>
            תשלום של <strong>10% מסך דמי השכירות</strong>, ללא ניכוי הוצאות וללא תקרה. פשוט לדיווח
            ומתאים כשההכנסה גבוהה מהתקרה ואין הוצאות גדולות. שים לב: לא ניתן לנכות פחת, והפחת
            ייווסף לרווח החייב במס שבח בעת מכירת הדירה.
          </p>

          <h3>3. מסלול מדרגות המס</h3>
          <p>
            ההכנסה ממוסה לפי מדרגות המס שלך (לרוב החל מ-31% להכנסה פסיבית, אלא אם מלאו לך 60),
            אך ניתן לנכות הוצאות מוכרות — ריבית משכנתא, תחזוקה, ביטוח ופחת. משתלם כשיש הוצאות
            משמעותיות שמקטינות מאוד את הרווח.
          </p>

          <h2>הפטור החלקי — האזור שבין 5,654 ל-11,308 ₪</h2>
          <p>
            אם דמי השכירות גבוהים מ-5,654 ₪ אך נמוכים מ-11,308 ₪, מגיע לך <strong>פטור חלקי</strong>.
            הנוסחה: מפחיתים מתקרת הפטור את הסכום שבו ההכנסה עולה עליה.
          </p>
          <blockquote>
            <strong>דוגמה:</strong> שכר דירה 7,000 ₪/חודש.<br />
            הסכום שמעל התקרה: 7,000 − 5,654 = 1,346 ₪.<br />
            הפטור המתואם: 5,654 − 1,346 = 4,308 ₪.<br />
            הסכום החייב במס: 7,000 − 4,308 = <strong>2,692 ₪</strong> (לפי מדרגות המס).
          </blockquote>
          <p>מעל 11,308 ₪/חודש (פעמיים התקרה) — הפטור מתאפס לחלוטין.</p>
        </div>

        <div className="overflow-x-auto my-6 not-prose">
          <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-gray-50">
              <tr className="text-right">
                <th className="p-3 font-bold text-gray-700 border-b">מסלול</th>
                <th className="p-3 font-bold text-gray-700 border-b">שיעור</th>
                <th className="p-3 font-bold text-gray-700 border-b">ניכוי הוצאות</th>
                <th className="p-3 font-bold text-gray-700 border-b">מתי משתלם</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              <tr><td className="p-3 border-b font-medium">פטור</td><td className="p-3 border-b">0%</td><td className="p-3 border-b">—</td><td className="p-3 border-b">הכנסה עד 5,654 ₪/חודש</td></tr>
              <tr className="bg-gray-50/50"><td className="p-3 border-b font-medium">10%</td><td className="p-3 border-b">10% מהמחזור</td><td className="p-3 border-b">לא</td><td className="p-3 border-b">הכנסה גבוהה, מעט הוצאות</td></tr>
              <tr><td className="p-3 font-medium">מדרגות מס</td><td className="p-3">לפי מדרגה (לרוב 31%+)</td><td className="p-3">כן (כולל פחת)</td><td className="p-3">הוצאות גדולות (ריבית, תחזוקה)</td></tr>
            </tbody>
          </table>
        </div>

        <div className="prose prose-lg max-w-none text-gray-800 leading-relaxed">
          <p className="text-sm text-gray-500">
            * אין לראות במדריך זה ייעוץ מס. הכללים מורכבים ותלויים בנסיבות אישיות — מומלץ להיוועץ
            ברואה חשבון.
          </p>
        </div>

        {/* Related */}
        <section className="my-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">כלים ומדריכים רלוונטיים</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              { href: '/real-estate/capital-gains-tax', label: 'מחשבון מס שבח' },
              { href: '/real-estate/purchase-tax', label: 'מחשבון מס רכישה' },
              { href: '/real-estate/mortgage', label: 'מחשבון משכנתא' },
              { href: '/personal-tax/income-tax', label: 'מחשבון מס הכנסה' },
              { href: '/blog/real-estate-investment-strategy', label: 'אסטרטגיית השקעה בנדל"ן' },
              { href: '/glossary/capital-gains-tax', label: 'מס שבח — הגדרה' },
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
