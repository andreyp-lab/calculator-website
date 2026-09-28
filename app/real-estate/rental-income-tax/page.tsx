import type { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/calculator/Breadcrumbs';
import { AuthorBox } from '@/components/calculator/AuthorBox';

const PAGE_PATH = '/real-estate/rental-income-tax';
const SITE_URL = 'https://cheshbonai.co.il';

export const metadata: Metadata = {
  title: 'מיסוי שכר דירה 2026 — פטור, מסלול 10% ומדרגות מס',
  description:
    'איך בודקים את מסלולי המס על הכנסה מהשכרת דירת מגורים בישראל ב-2026? תקרת פטור, מסלול 10% ומסלול רגיל, בכפוף לתנאי הזכאות.',
  alternates: { canonical: PAGE_PATH },
  openGraph: {
    // OG image לא מתפשט מ-app/opengraph-image.tsx לדפים שמגדירים openGraph משלהם.
    images: ['/opengraph-image'],
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
      'התוצאה תלויה בסך ההכנסות מכל הדירות, בשימוש בדירה, בתנאי המסלול ובנתוני הנישום. במסלול הפטור יש תקרה חודשית, במסלול 10% מס על דמי השכירות ללא ניכוי הוצאות, ובמסלול הרגיל אפשר לבחון ניכוי הוצאות מותרות.',
  },
  {
    question: 'מהי תקרת הפטור על שכר דירה ב-2026?',
    answer:
      'בשנת 2026 תקרת הפטור החודשי היא 5,654 ₪. יש לבדוק את ההכנסה מכל הדירות ואת יתר תנאי החוק; מעל התקרה יכול לחול פטור חלקי עד לפעמיים התקרה.',
  },
  {
    question: 'איך עובד הפטור החלקי?',
    answer:
      'אם דמי השכירות בין 5,654 ל-11,308 ₪/חודש, מחשבים את הפטור כך: מפחיתים מתקרת הפטור (5,654) את הסכום שבו ההכנסה עולה על התקרה. הנוסחה: פטור = (2 × 5,654) − ההכנסה. החלק שמעל הפטור חייב במס לפי מדרגות. מעל 11,308 ₪ — הפטור מתאפס לחלוטין.',
  },
  {
    question: 'מתי כדאי לבחור מסלול 10%?',
    answer:
      'מסלול 10% עשוי להיות כדאי בחלק מהמקרים, אבל אין בו ניכוי הוצאות או פחת בשוטף. מכירת הדירה דורשת בדיקת מס שבח נפרדת, לרבות השפעת הפחת לפי הדין. השוו למסלול הרגיל ולמסלול הפטור לפי נתוניכם.',
  },
  {
    question: 'האם משלמים ביטוח לאומי על שכר דירה?',
    answer:
      'סיווג ההכנסה לצורכי ביטוח לאומי תלוי בנסיבות. הכנסה בהיקף פעילות העולה כדי עסק עשויה להיות מטופלת באופן שונה; בדקו את המקרה האישי מול הביטוח הלאומי.',
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
    dateModified: '2026-09-28',
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
    <div className="min-h-screen bg-paper" dir="rtl">
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
          <h1 className="text-3xl md:text-4xl font-bold text-ink mb-3">
            מיסוי שכר דירה 2026 — המדריך המלא
          </h1>
          <p className="text-lg text-ink/70 leading-relaxed">
            משכיר דירה למגורים? יש שלוש דרכים לשלם מס — והבחירה ביניהן יכולה לחסוך לך אלפי שקלים
            בשנה. הנה כל מה שצריך לדעת על מסלול הפטור, מסלול 10% ומסלול מדרגות המס, עם דוגמאות.
          </p>
          <p className="text-sm text-ink/70 mt-3">נכתב על ידי אנדרי פלטונוב, רו&quot;ח · עודכן ל-2026</p>
        </header>

        <div className="prose prose-lg max-w-none text-ink leading-relaxed">
          <h2>3 מסלולי המס על שכר דירה למגורים</h2>
          <p>
            על הכנסה מהשכרת דירת מגורים בישראל ניתן לבחור באחד משלושה מסלולים. הבחירה היא שנתית
            וניתן להחליף בין שנים — כדאי לחשב כל שנה מה הכי משתלם.
          </p>

          <h3>1. מסלול הפטור</h3>
          <p>
            תקרת הפטור החודשי היא <strong>5,654 ₪ (2026)</strong>, בכפוף לתנאי החוק ולהכנסה
            מכל דירות המגורים הרלוונטיות. יש לבדוק את השימוש בדירה ואת נתוני המשכיר.
          </p>

          <h3>2. מסלול 10%</h3>
          <p>
            תשלום של <strong>10% מסך דמי השכירות</strong>, ללא ניכוי הוצאות וללא תקרה. פשוט לדיווח
            ומתאים לבדיקה מול המסלולים האחרים. אין במסלול זה ניכוי הוצאות או פחת בשוטף;
            בעת מכירת הדירה יש לבחון את השפעת הפחת על מס השבח לפי נסיבות המכירה.
          </p>

          <h3>3. מסלול מדרגות המס</h3>
          <p>
            ההכנסה ממוסה לפי מדרגות המס שלך (לרוב החל מ-31% להכנסה פסיבית, אלא אם מלאו לך 60),
            וניתן לבדוק ניכוי הוצאות מותרות לפי הדין, לרבות פחת בתנאים המתאימים. סכום ההוצאה
            המוכרת והכדאיות תלויים בנתוני הנכס ובדיווח.
          </p>

          <h2>הפטור החלקי — האזור שבין 5,654 ל-11,308 ₪</h2>
          <p>
            אם סך דמי השכירות הרלוונטיים גבוה מ-5,654 ₪ אך נמוך מ-11,308 ₪, ייתכן <strong>פטור חלקי</strong> בכפוף לתנאי החוק.
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
          <table className="w-full text-sm border border-ink/15 overflow-hidden">
            <thead className="bg-cream-2">
              <tr className="text-right">
                <th className="p-3 font-bold text-ink/70 border-b">מסלול</th>
                <th className="p-3 font-bold text-ink/70 border-b">שיעור</th>
                <th className="p-3 font-bold text-ink/70 border-b">ניכוי הוצאות</th>
                <th className="p-3 font-bold text-ink/70 border-b">מתי משתלם</th>
              </tr>
            </thead>
            <tbody className="text-ink/70">
              <tr><td className="p-3 border-b font-medium">פטור</td><td className="p-3 border-b">0% על החלק הפטור</td><td className="p-3 border-b">לפי תנאי המסלול</td><td className="p-3 border-b">בכפוף לתקרה ולתנאי הזכאות</td></tr>
              <tr className="bg-cream-2/50"><td className="p-3 border-b font-medium">10%</td><td className="p-3 border-b">10% מהמחזור</td><td className="p-3 border-b">לא</td><td className="p-3 border-b">הכנסה גבוהה, מעט הוצאות</td></tr>
              <tr><td className="p-3 font-medium">מדרגות מס</td><td className="p-3">לפי מדרגה (לרוב 31%+)</td><td className="p-3">כן (כולל פחת)</td><td className="p-3">הוצאות גדולות (ריבית, תחזוקה)</td></tr>
            </tbody>
          </table>
        </div>

        <div className="prose prose-lg max-w-none text-ink leading-relaxed">
          <p className="text-sm text-ink/70">
            * אין לראות במדריך זה ייעוץ מס. הכללים מורכבים ותלויים בנסיבות אישיות — מומלץ להיוועץ
            ברואה חשבון.
          </p>
          <p className="text-sm text-ink/70">מקורות: <a href="https://www.gov.il/he/pages/tax-return-application-guide?chapterIndex=6" target="_blank" rel="noopener noreferrer">תקרת הפטור לשנת 2026 ברשות המסים</a> ו<a href="https://www.gov.il/he/pages/detail-tracks-payment-tax-relief-rental-apartments" target="_blank" rel="noopener noreferrer">מדריך מסלולי מיסוי שכירות ברשות המסים</a>.</p>
        </div>

        {/* Related */}
        <section className="my-10">
          <h2 className="text-2xl font-bold text-ink mb-4">כלים ומדריכים רלוונטיים</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              { href: '/real-estate/capital-gains-tax', label: 'בדיקת מס שבח' },
              { href: '/real-estate/purchase-tax', label: 'מחשבון מס רכישה' },
              { href: '/real-estate/mortgage', label: 'מחשבון משכנתא' },
              { href: '/personal-tax/income-tax', label: 'מחשבון מס הכנסה' },
              { href: '/blog/real-estate-investment-strategy', label: 'אסטרטגיית השקעה בנדל"ן' },
              { href: '/glossary/capital-gains-tax', label: 'מס שבח — הגדרה' },
            ].map((c) => (
              <Link
                key={c.href}
                href={c.href}
                className="group flex items-center justify-between gap-2 border border-ink/15 p-4 hover:border-gold hover:shadow-sm transition"
              >
                <span className="font-medium text-ink group-hover:text-gold transition">{c.label}</span>
                <span className="text-gold group-hover:-translate-x-1 transition" aria-hidden>←</span>
              </Link>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-ink mb-6">שאלות נפוצות</h2>
          <div className="space-y-4">
            {faqItems.map((f) => (
              <details key={f.question} className="border border-ink/15 p-4 group">
                <summary className="font-bold text-ink cursor-pointer list-none flex items-center justify-between">
                  {f.question}
                  <span className="text-ink/70 group-open:rotate-180 transition" aria-hidden>▾</span>
                </summary>
                <p className="text-ink/70 mt-3 leading-relaxed">{f.answer}</p>
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
