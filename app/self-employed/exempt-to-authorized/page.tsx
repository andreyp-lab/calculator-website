import type { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/calculator/Breadcrumbs';
import { AuthorBox } from '@/components/calculator/AuthorBox';
import { CourseBanner } from '@/components/marketing/CourseBanner';
import { LeadMagnet } from '@/components/marketing/LeadMagnet';
import { COURSES } from '@/lib/config/courses';

const PAGE_PATH = '/self-employed/exempt-to-authorized';
const SITE_URL = 'https://cheshbonai.co.il';

export const metadata: Metadata = {
  title: 'מעבר מעוסק פטור לעוסק מורשה 2026 — מתי, איך ולמה',
  description:
    'עברת את תקרת 120,000 ₪? מדריך מלא למעבר מעוסק פטור לעוסק מורשה ב-2026: מתי חובה לעבור, איך עושים זאת, מה משתנה במע"מ ובדיווח, וטעויות שעולות ביוקר.',
  alternates: { canonical: PAGE_PATH },
  openGraph: {
    title: 'מעבר מעוסק פטור לעוסק מורשה 2026 — מתי, איך ולמה',
    description:
      'מתי חובה לעבור מעוסק פטור למורשה, איך עושים את זה נכון, ומה משתנה במע"מ ובדיווח. מדריך מעשי מרו"ח.',
    type: 'article',
    locale: 'he_IL',
  },
};

const faqItems = [
  {
    question: 'מתי חובה לעבור מעוסק פטור לעוסק מורשה?',
    answer:
      'החובה לעבור נכנסת לתוקף ברגע שהמחזור השנתי עובר את תקרת עוסק פטור — 120,000 ₪ (2026). ברגע שחצית את התקרה, עליך לדווח לרשות המסים ולהפוך לעוסק מורשה. מקצועות מסוימים (עורכי דין, רואי חשבון, רופאים, אדריכלים ועוד) חייבים בעוסק מורשה ללא קשר למחזור.',
  },
  {
    question: 'מה קורה אם עברתי את התקרה ולא עדכנתי?',
    answer:
      'אם עברת את 120,000 ₪ ולא הפכת לעוסק מורשה, רשות המסים עלולה לחייב אותך במע"מ רטרואקטיבית על כל העסקאות מעל התקרה — גם אם לא גבית מע"מ מהלקוחות. זו אחת הטעויות היקרות ביותר, ולכן חשוב לעקוב אחר המחזור לאורך השנה.',
  },
  {
    question: 'מה משתנה כשעוברים לעוסק מורשה?',
    answer:
      'מתחילים לגבות מע"מ 18% מהלקוחות, מקזזים מע"מ על הוצאות עסקיות, ומדווחים למע"מ אחת לחודש או לחודשיים (לפי גובה המחזור). חובת הדיווח והרישום מתהדקת, אך נפתחת אפשרות לקזז מע"מ תשומות — מה שמשתלם במיוחד למי שיש לו הוצאות גדולות.',
  },
  {
    question: 'האם כדאי לעבור לעוסק מורשה עוד לפני שעברתי את התקרה?',
    answer:
      'לעיתים כן. אם רוב הלקוחות שלך הם עסקים (שמעדיפים חשבונית מס לצורך קיזוז), או אם יש לך הוצאות גדולות עם מע"מ שכדאי לקזז — מעבר מוקדם לעוסק מורשה יכול להיות כדאי כלכלית גם מתחת ל-120,000 ₪.',
  },
  {
    question: 'כמה זמן לוקח המעבר?',
    answer:
      'המעבר עצמו מול רשות המע"מ הוא הליך מנהלי קצר (לרוב ימים בודדים). מומלץ לבצע אותו בליווי רואה חשבון כדי לוודא שכל ההגדרות — תדירות דיווח, מקדמות מס וניהול ספרים — מתעדכנות נכון.',
  },
];

export default function ExemptToAuthorizedPage() {
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'מעבר מעוסק פטור לעוסק מורשה 2026 — מתי, איך ולמה',
    description:
      'מדריך מעשי למעבר מעוסק פטור לעוסק מורשה בישראל 2026: תקרת 120,000 ₪, השלכות מע"מ, הליך והטעויות הנפוצות.',
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
      { '@type': 'ListItem', position: 3, name: 'מעבר לעוסק מורשה', item: `${SITE_URL}${PAGE_PATH}` },
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
              { label: 'מעבר לעוסק מורשה' },
            ]}
          />
        </div>

        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            מעבר מעוסק פטור לעוסק מורשה 2026
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            המחזור שלך גדל והתקרב ל-120,000 ₪? הנה כל מה שצריך לדעת על המעבר לעוסק מורשה — מתי זו
            חובה, איך עושים זאת נכון, מה משתנה במע"מ ובדיווח, ואילו טעויות עולות הכי ביוקר.
          </p>
          <p className="text-sm text-gray-500 mt-3">נכתב על ידי אנדרי פלטונוב, רו"ח · עודכן ל-2026</p>
        </header>

        <div className="prose prose-lg max-w-none text-gray-800 leading-relaxed">
          <h2>מתי חייבים לעבור לעוסק מורשה?</h2>
          <p>
            הכלל המרכזי פשוט: ברגע שהמחזור השנתי עובר את <strong>תקרת עוסק פטור — 120,000 ₪
            (2026)</strong> — חובה להפוך לעוסק מורשה. בנוסף, ישנם מקצועות שחייבים בעוסק מורשה
            מהיום הראשון, ללא קשר למחזור (כגון עורכי דין, רואי חשבון, רופאים, אדריכלים, יועצי
            מס ועוד).
          </p>

          <h2>3 סיבות לעבור לעוסק מורשה — גם לפני התקרה</h2>
          <ul>
            <li><strong>לקוחות עסקיים</strong> — עסקים מעדיפים לעבוד מול עוסק מורשה כדי לקבל חשבונית מס ולקזז מע"מ.</li>
            <li><strong>הוצאות גדולות</strong> — אם אתה רוכש ציוד, שוכר משרד או מחזיק רכב לעסק, עוסק מורשה יכול לקזז את מע"מ התשומות.</li>
            <li><strong>תדמית מקצועית</strong> — מול חלק מהלקוחות, מעמד של עוסק מורשה משדר עסק מבוסס יותר.</li>
          </ul>

          <h2>מה משתנה אחרי המעבר?</h2>
        </div>

        <div className="overflow-x-auto my-6 not-prose">
          <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-gray-50">
              <tr className="text-right">
                <th className="p-3 font-bold text-gray-700 border-b">נושא</th>
                <th className="p-3 font-bold text-blue-700 border-b">לפני (עוסק פטור)</th>
                <th className="p-3 font-bold text-emerald-700 border-b">אחרי (עוסק מורשה)</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              <tr><td className="p-3 border-b font-medium">גביית מע"מ מלקוחות</td><td className="p-3 border-b">לא</td><td className="p-3 border-b">כן — 18%</td></tr>
              <tr className="bg-gray-50/50"><td className="p-3 border-b font-medium">קיזוז מע"מ תשומות</td><td className="p-3 border-b">לא</td><td className="p-3 border-b">כן</td></tr>
              <tr><td className="p-3 border-b font-medium">דיווח מע"מ</td><td className="p-3 border-b">הצהרה שנתית</td><td className="p-3 border-b">חודשי / דו-חודשי</td></tr>
              <tr className="bg-gray-50/50"><td className="p-3 border-b font-medium">סוג חשבונית</td><td className="p-3 border-b">חשבונית עסקה</td><td className="p-3 border-b">חשבונית מס</td></tr>
              <tr><td className="p-3 font-medium">מס הכנסה + ב.ל.</td><td className="p-3">חייב</td><td className="p-3">חייב (ללא שינוי)</td></tr>
            </tbody>
          </table>
        </div>

        <div className="prose prose-lg max-w-none text-gray-800 leading-relaxed">
          <h2>איך מבצעים את המעבר — צעד אחר צעד</h2>
          <ol>
            <li>מעדכנים את רשות המע"מ על שינוי הסיווג לעוסק מורשה.</li>
            <li>מתאימים את תדירות הדיווח (חודשי או דו-חודשי) לפי המחזור.</li>
            <li>מתחילים להפיק <strong>חשבוניות מס</strong> הכוללות מע"מ.</li>
            <li>מקפידים לשמור קבלות וחשבוניות ספק — כדי לקזז מע"מ תשומות.</li>
            <li>בודקים מול רואה החשבון אם צריך לעדכן מקדמות מס הכנסה.</li>
          </ol>

          <h2>הטעות שעולה הכי ביוקר</h2>
          <p>
            המלכודת הנפוצה ביותר: עוברים את תקרת 120,000 ₪ במהלך השנה אך <strong>לא מעדכנים את
            הסיווג</strong>. במקרה כזה, רשות המסים עלולה לדרוש מע"מ רטרואקטיבי על כל העסקאות מעל
            התקרה — מע"מ שלא גבית מהלקוחות וייצא מהכיס שלך. לכן חשוב לעקוב אחר המחזור לאורך כל
            השנה ולא רק בסופה.
          </p>
        </div>

        {/* Lead magnet */}
        <div className="my-10">
          <LeadMagnet
            magnet="opening-business-checklist"
            title="צ׳קליסט פתיחת עסק — חינם"
            description="כל הצעדים לפתיחת עסק וניהול מול הרשויות, מסודרים לסימון ✓."
            bullets={['רישום מול 3 הרשויות', 'מעקב מחזור מול תקרת 120,000 ₪', 'טעויות נפוצות']}
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
              { href: '/self-employed/opening-business', label: 'מדריך פתיחת עסק' },
              { href: '/self-employed/vat', label: 'מחשבון מע"מ' },
              { href: '/self-employed/net', label: 'מחשבון נטו לעצמאי' },
              { href: '/self-employed/tax-advances', label: 'מחשבון מקדמות מס' },
              { href: '/self-employed/social-security', label: 'ביטוח לאומי לעצמאי' },
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
