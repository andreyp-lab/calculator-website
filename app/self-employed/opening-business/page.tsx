import type { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/calculator/Breadcrumbs';
import { AuthorBox } from '@/components/calculator/AuthorBox';
import { CourseBanner } from '@/components/marketing/CourseBanner';
import { LeadMagnet } from '@/components/marketing/LeadMagnet';
import { COURSES } from '@/lib/config/courses';

const PAGE_PATH = '/self-employed/opening-business';
const SITE_URL = 'https://cheshbonai.co.il';

export const metadata: Metadata = {
  title: 'פתיחת עסק 2026 — עוסק פטור או עוסק מורשה? המדריך המלא',
  description:
    'איך פותחים עסק בישראל ב-2026: עוסק פטור מול עוסק מורשה, תקרת 120,000 ₪, מע"מ 18%, רישום מול הרשויות וטעויות שכדאי לחסוך. מדריך מעשי מרו"ח.',
  alternates: { canonical: PAGE_PATH },
  openGraph: {
    title: 'פתיחת עסק 2026 — עוסק פטור או עוסק מורשה? המדריך המלא',
    description:
      'איך פותחים עסק בישראל ב-2026: עוסק פטור מול עוסק מורשה, תקרת 120,000 ₪, מע"מ, רישום מול הרשויות וטעויות נפוצות.',
    type: 'article',
    locale: 'he_IL',
  },
};

const faqItems = [
  {
    question: 'מה ההבדל בין עוסק פטור לעוסק מורשה?',
    answer:
      'עוסק פטור הוא עסק שמחזורו השנתי עד 120,000 ₪ (2026). הוא פטור מגביית מע"מ ומדיווח מע"מ שוטף, אך אינו יכול לקזז מע"מ תשומות על הוצאות. עוסק מורשה גובה מע"מ 18% מלקוחותיו, מקזז מע"מ על הוצאות, ומדווח למע"מ אחת לחודש או חודשיים. שניהם חייבים במס הכנסה ובביטוח לאומי.',
  },
  {
    question: 'מהי תקרת עוסק פטור ב-2026?',
    answer:
      'תקרת המחזור לעוסק פטור ב-2026 היא 120,000 ₪ לשנה. אם המחזור עובר את הסכום הזה — חובה לעבור לעוסק מורשה. התקרה מתעדכנת מדי שנה לפי מדד המחירים לצרכן.',
  },
  {
    question: 'איך פותחים עסק בישראל?',
    answer:
      'פותחים תיק במע"מ (עוסק פטור או מורשה), פותחים תיק במס הכנסה, ונרשמים כעצמאי בביטוח לאומי. אפשר לבצע את שלושת הצעדים גם דרך השער הממשלתי המאוחד. מומלץ להיוועץ ברואה חשבון לבחירת הסיווג הנכון כבר בהתחלה.',
  },
  {
    question: 'מתי כדאי לפתוח עוסק מורשה במקום פטור?',
    answer:
      'כדאי לפתוח עוסק מורשה כאשר: המחזור צפוי לעבור 120,000 ₪, רוב הלקוחות הם עסקים (שמעדיפים חשבונית מס לקיזוז), או כשיש הוצאות גדולות עם מע"מ שכדאי לקזז (ציוד, שכירות, רכב). מקצועות מסוימים (כמו עורכי דין ורופאים) חייבים בעוסק מורשה ללא קשר למחזור.',
  },
  {
    question: 'עוסק פטור משלם מס הכנסה?',
    answer:
      'כן. "פטור" מתייחס רק למע"מ — עוסק פטור פטור מגביית מע"מ בלבד. הוא עדיין חייב במס הכנסה לפי מדרגות המס ובדמי ביטוח לאומי ובריאות על הרווח שלו, ומגיש דוח שנתי למס הכנסה.',
  },
];

export default function OpeningBusinessPage() {
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'פתיחת עסק 2026 — עוסק פטור או עוסק מורשה? המדריך המלא',
    description:
      'מדריך מעשי לפתיחת עסק בישראל 2026: עוסק פטור מול מורשה, תקרת 120,000 ₪, מע"מ ורישום מול הרשויות.',
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
      { '@type': 'ListItem', position: 3, name: 'פתיחת עסק', item: `${SITE_URL}${PAGE_PATH}` },
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
              { label: 'פתיחת עסק' },
            ]}
          />
        </div>

        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            פתיחת עסק 2026 — עוסק פטור או עוסק מורשה?
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            פותחים עסק עצמאי בישראל? המדריך המלא לבחירה בין עוסק פטור לעוסק מורשה, רישום מול
            הרשויות, תקרת 120,000 ₪, מע"מ 18% והטעויות שכדאי לחסוך כבר בהתחלה.
          </p>
          <p className="text-sm text-gray-500 mt-3">
            נכתב על ידי אנדרי פלטונוב, רו"ח · עודכן ל-2026
          </p>
        </header>

        <div className="prose prose-lg max-w-none text-gray-800 leading-relaxed">
          <h2>3 הצעדים לפתיחת עסק בישראל</h2>
          <ol>
            <li>
              <strong>פתיחת תיק במע"מ</strong> — בחירת סיווג: עוסק פטור או עוסק מורשה. זהו הצעד
              שקובע את אופן ההתנהלות מול רשות המסים.
            </li>
            <li>
              <strong>פתיחת תיק במס הכנסה</strong> — דיווח על תחילת פעילות. כאן ייקבעו מקדמות המס
              שלך לאורך השנה.
            </li>
            <li>
              <strong>רישום בביטוח לאומי</strong> — כעצמאי אתה חייב בתשלום דמי ביטוח לאומי ובריאות,
              ובתמורה צובר זכויות (דמי לידה, נפגעי עבודה, אבטלה מוגבלת ועוד).
            </li>
          </ol>

          <h2>עוסק פטור — למי זה מתאים?</h2>
          <p>
            <strong>עוסק פטור</strong> הוא עסק קטן שמחזורו השנתי אינו עולה על{' '}
            <strong>120,000 ₪ (2026)</strong>. היתרון: אינו גובה מע"מ ואינו מדווח מע"מ שוטף —
            פחות בירוקרטיה. החיסרון: אינו יכול לקזז מע"מ תשומות על הוצאות, ולקוחות עסקיים אינם
            יכולים לקזז ממנו מע"מ.
          </p>
          <p>
            חשוב להבין: "פטור" מתייחס <strong>רק למע"מ</strong>. עוסק פטור עדיין משלם מס הכנסה
            ודמי ביטוח לאומי על הרווח, ומגיש דוח שנתי.
          </p>

          <h2>עוסק מורשה — למי זה מתאים?</h2>
          <p>
            <strong>עוסק מורשה</strong> גובה מע"מ בשיעור <strong>18%</strong> מלקוחותיו, מעביר
            אותו לרשות המסים, ובמקביל מקזז מע"מ על הוצאות עסקיות. הוא מדווח למע"מ אחת לחודש או
            לחודשיים. עוסק מורשה הוא חובה כאשר המחזור עובר 120,000 ₪, וגם נדרש במקצועות מסוימים
            ללא קשר למחזור.
          </p>

          <h2>עוסק פטור מול עוסק מורשה — טבלת השוואה</h2>
        </div>

        {/* Comparison table */}
        <div className="overflow-x-auto my-6 not-prose">
          <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-gray-50">
              <tr className="text-right">
                <th className="p-3 font-bold text-gray-700 border-b">קריטריון</th>
                <th className="p-3 font-bold text-blue-700 border-b">עוסק פטור</th>
                <th className="p-3 font-bold text-emerald-700 border-b">עוסק מורשה</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              <tr><td className="p-3 border-b font-medium">תקרת מחזור</td><td className="p-3 border-b">עד 120,000 ₪/שנה</td><td className="p-3 border-b">ללא הגבלה</td></tr>
              <tr className="bg-gray-50/50"><td className="p-3 border-b font-medium">גביית מע"מ</td><td className="p-3 border-b">לא גובה</td><td className="p-3 border-b">גובה 18%</td></tr>
              <tr><td className="p-3 border-b font-medium">קיזוז מע"מ תשומות</td><td className="p-3 border-b">לא</td><td className="p-3 border-b">כן</td></tr>
              <tr className="bg-gray-50/50"><td className="p-3 border-b font-medium">דיווח מע"מ</td><td className="p-3 border-b">הצהרה שנתית בלבד</td><td className="p-3 border-b">חודשי / דו-חודשי</td></tr>
              <tr><td className="p-3 border-b font-medium">מס הכנסה + ב.ל.</td><td className="p-3 border-b">חייב</td><td className="p-3 border-b">חייב</td></tr>
              <tr className="bg-gray-50/50"><td className="p-3 font-medium">מתאים ל-</td><td className="p-3">עסק קטן, לקוחות פרטיים</td><td className="p-3">מחזור גבוה, לקוחות עסקיים, הוצאות גדולות</td></tr>
            </tbody>
          </table>
        </div>

        <div className="prose prose-lg max-w-none text-gray-800 leading-relaxed">
          <h2>מתי כדאי לעבור מעוסק פטור למורשה?</h2>
          <ul>
            <li>המחזור השנתי מתקרב או עובר את <strong>120,000 ₪</strong> (אז המעבר חובה).</li>
            <li>רוב הלקוחות הם <strong>עסקים</strong> שזקוקים לחשבונית מס לצורך קיזוז.</li>
            <li>יש <strong>הוצאות גדולות עם מע"מ</strong> (ציוד, שכירות, רכב) שכדאי לקזז.</li>
          </ul>

          <h2>הטעויות הנפוצות בפתיחת עסק</h2>
          <ul>
            <li>בחירת סיווג שגוי בהתחלה — ואז תשלום מע"מ או החמצת קיזוז תשומות.</li>
            <li>אי-ניצול הוצאות מוכרות שמקטינות את ההכנסה החייבת במס.</li>
            <li>הזנחת מקדמות מס — שמובילה ל"הפתעה" של חוב גדול בסוף השנה.</li>
            <li>ערבוב בין חשבון בנק פרטי לעסקי — שמקשה על ניהול וביקורת.</li>
          </ul>
        </div>

        {/* Lead magnet — free checklist in exchange for email (builds owned list) */}
        <div className="my-10">
          <LeadMagnet
            magnet="opening-business-checklist"
            title="צ׳קליסט פתיחת עסק — חינם"
            description="כל הצעדים לפתיחת עסק נכון, מסודרים לסימון ✓. שמור והדפס."
            bullets={['רישום מול 3 הרשויות', 'בחירת סיווג נכון', 'טעויות שעולות אלפי שקלים']}
            page={PAGE_PATH}
          />
        </div>

        {/* Course banner — perfect intent match */}
        <div className="my-10">
          <CourseBanner course={COURSES.selfEmployed} page={PAGE_PATH} variant="hero" />
        </div>

        {/* Related calculators */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">מחשבונים שיעזרו לך להתחיל</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              { href: '/self-employed/vat', label: 'מחשבון מע"מ' },
              { href: '/self-employed/net', label: 'מחשבון נטו לעצמאי' },
              { href: '/self-employed/social-security', label: 'מחשבון ביטוח לאומי לעצמאי' },
              { href: '/self-employed/tax-advances', label: 'מחשבון מקדמות מס' },
              { href: '/self-employed/hourly-rate', label: 'מחשבון תמחור שעת עבודה' },
              { href: '/self-employed/corporation-vs-individual', label: 'חברה בע"מ מול עוסק' },
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
