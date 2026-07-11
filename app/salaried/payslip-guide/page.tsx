import type { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/calculator/Breadcrumbs';
import { AuthorBox } from '@/components/calculator/AuthorBox';

const PAGE_PATH = '/salaried/payslip-guide';
const SITE_URL = 'https://cheshbonai.co.il';

export const metadata: Metadata = {
  title: 'איך קוראים תלוש משכורת 2026 — המדריך המלא',
  description:
    'תלוש המשכורת מבלבל אותך? מדריך מלא לקריאת תלוש 2026: ברוטו מול נטו, ניכויי חובה (מס, ב.ל. 12.17%, פנסיה), נקודות זיכוי, הפרשות מעסיק וטעויות שכדאי לבדוק.',
  alternates: { canonical: PAGE_PATH },
  openGraph: {
    title: 'איך קוראים תלוש משכורת 2026 — המדריך המלא',
    description:
      'מברוטו לנטו: כל רכיבי תלוש המשכורת מוסברים — ניכויי חובה, נקודות זיכוי, הפרשות מעסיק וטעויות נפוצות.',
    type: 'article',
    locale: 'he_IL',
  },
};

const faqItems = [
  {
    question: 'מה ההבדל בין ברוטו לנטו בתלוש?',
    answer:
      'ברוטו הוא השכר המלא לפני ניכויים. נטו הוא הסכום שמגיע בפועל לחשבון הבנק — אחרי ניכוי מס הכנסה, ביטוח לאומי, דמי בריאות וחלק העובד בפנסיה. ההפרש בין ברוטו לנטו הוא סך הניכויים.',
  },
  {
    question: 'אילו ניכויי חובה מופיעים בתלוש?',
    answer:
      'מס הכנסה (לפי מדרגות, בניכוי נקודות זיכוי), ביטוח לאומי ודמי בריאות (4.27% על החלק עד 7,703 ₪ ו-12.17% מעל, עד התקרה), וחלק העובד בהפרשה לפנסיה (לרוב 6%). אלו ניכויים שחובה לנכות מכל עובד.',
  },
  {
    question: 'כמה שווה נקודת זיכוי ב-2026?',
    answer:
      'נקודת זיכוי שווה 242 ₪ לחודש (2,904 ₪ לשנה). נקודות הזיכוי מקטינות ישירות את מס ההכנסה. כל תושב מקבל 2.25 נקודות בסיס, ויש תוספות לנשים, הורים לילדים, עולים חדשים, חיילים משוחררים ובעלי תואר.',
  },
  {
    question: 'מהן הפרשות המעסיק ולמה הן לא בנטו?',
    answer:
      'מעבר לשכר, המעסיק מפריש עבורך (לא מנוכה ממך): כ-6.5% לפנסיה (תגמולים), כ-6% לפיצויים, ולעיתים קרן השתלמות וביטוח לאומי מעסיק. כספים אלו נצברים לטובתך בקופות אך אינם חלק מהנטו שמגיע לחשבון.',
  },
  {
    question: 'מה חשוב לבדוק בתלוש?',
    answer:
      'ודא שהשכר אינו מתחת לשכר המינימום (6,443.85 ₪ ב-2026), שמספר נקודות הזיכוי נכון, שמפרישים לך לפנסיה, שצבירת ימי החופשה והמחלה מעודכנת, ושתוספות (נסיעות, שעות נוספות) משולמות כחוק.',
  },
];

export default function PayslipGuidePage() {
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'איך קוראים תלוש משכורת 2026 — המדריך המלא',
    description: 'מדריך מלא לקריאת תלוש משכורת בישראל 2026: ברוטו, נטו, ניכויים והפרשות.',
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
      { '@type': 'ListItem', position: 2, name: 'שכירים', item: `${SITE_URL}/salaried` },
      { '@type': 'ListItem', position: 3, name: 'קריאת תלוש משכורת', item: `${SITE_URL}${PAGE_PATH}` },
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
              { label: 'שכירים', href: '/salaried' },
              { label: 'קריאת תלוש משכורת' },
            ]}
          />
        </div>

        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-ink mb-3">
            איך קוראים תלוש משכורת 2026
          </h1>
          <p className="text-lg text-ink/70 leading-relaxed">
            תלוש המשכורת מלא במספרים ומונחים מבלבלים — אבל ברגע שמבינים את המבנה, הכול נהיה ברור.
            הנה מדריך שורה-אחר-שורה: מברוטו לנטו, מה כל ניכוי אומר, ומה חשוב לבדוק כל חודש.
          </p>
          <p className="text-sm text-ink/60 mt-3">נכתב על ידי אנדרי פלטונוב, רו"ח · עודכן ל-2026</p>
        </header>

        <div className="prose prose-lg max-w-none text-ink leading-relaxed">
          <h2>מבנה התלוש — 4 החלקים העיקריים</h2>
          <ol>
            <li><strong>פרטים כלליים</strong> — שם, ת"ז, ותק, חודש השכר, ימי/שעות עבודה, ומספר נקודות הזיכוי.</li>
            <li><strong>תשלומים (ברוטו)</strong> — שכר יסוד + תוספות (ותק, נסיעות, אש"ל, שעות נוספות).</li>
            <li><strong>ניכויים</strong> — חובה (מס, ב.ל., בריאות, פנסיה) ורשות (קרן השתלמות, ביטוחים).</li>
            <li><strong>נטו לתשלום</strong> — הסכום שמגיע בפועל לחשבון הבנק.</li>
          </ol>

          <h2>ניכויי החובה — לאן הולך הכסף</h2>
        </div>

        <div className="overflow-x-auto my-6 not-prose">
          <table className="w-full text-sm border border-ink/15 overflow-hidden">
            <thead className="bg-cream-2">
              <tr className="text-right">
                <th className="p-3 font-bold text-ink/70 border-b">ניכוי</th>
                <th className="p-3 font-bold text-ink/70 border-b">שיעור 2026</th>
                <th className="p-3 font-bold text-ink/70 border-b">הסבר</th>
              </tr>
            </thead>
            <tbody className="text-ink/70">
              <tr><td className="p-3 border-b font-medium">מס הכנסה</td><td className="p-3 border-b">10%–50% מדורג</td><td className="p-3 border-b">לפי מדרגות, פחות נקודות זיכוי (242 ₪ ליחידה)</td></tr>
              <tr className="bg-cream-2/50"><td className="p-3 border-b font-medium">ביטוח לאומי + בריאות</td><td className="p-3 border-b">4.27% / 12.17%</td><td className="p-3 border-b">מופחת עד 7,703 ₪, מלא מעבר (עד תקרה 51,910)</td></tr>
              <tr><td className="p-3 border-b font-medium">פנסיה (חלק העובד)</td><td className="p-3 border-b">6%</td><td className="p-3 border-b">נצבר לטובתך בקרן הפנסיה</td></tr>
              <tr className="bg-cream-2/50"><td className="p-3 font-medium">קרן השתלמות (רשות)</td><td className="p-3">2.5%</td><td className="p-3">אם קיימת — הטבת מס משמעותית</td></tr>
            </tbody>
          </table>
        </div>

        <div className="prose prose-lg max-w-none text-ink leading-relaxed">
          <h2>הפרשות המעסיק — כסף שלא רואים בנטו</h2>
          <p>
            מעבר לשכר, המעסיק מפריש <strong>עבורך</strong> (לא מנוכה ממך) — והכסף נצבר בקופות
            לטובתך:
          </p>
          <ul>
            <li><strong>פנסיה (תגמולים):</strong> כ-6.5% מהשכר.</li>
            <li><strong>פיצויים:</strong> כ-6% (ובהסדר סעיף 14 — 8.33%).</li>
            <li><strong>קרן השתלמות:</strong> עד 7.5% (אם קיימת).</li>
          </ul>
          <p>
            לכן "עלות המעסיק" האמיתית גבוהה מהברוטו שלך — לרוב 130%–145% ממנו.
          </p>

          <h2>5 דברים שחובה לבדוק בתלוש</h2>
          <ul>
            <li>שהשכר אינו נמוך משכר המינימום (6,443.85 ₪ ב-2026).</li>
            <li>שמספר נקודות הזיכוי תואם את מצבך האישי (ילדים, תואר, עלייה).</li>
            <li>שמפרישים לך לפנסיה — ומהחודש הראשון אם יש לך פנסיה קודמת.</li>
            <li>שצבירת ימי החופשה והמחלה מעודכנת ונכונה.</li>
            <li>שתוספות (נסיעות, שעות נוספות) משולמות כחוק.</li>
          </ul>

          <p className="text-sm text-ink/60">
            * אין לראות במדריך זה ייעוץ מס. לבדיקה מדויקת של הנטו שלך — השתמש במחשבון למטה.
          </p>
        </div>

        {/* Related */}
        <section className="my-10">
          <h2 className="text-2xl font-bold text-ink mb-4">כלים ומדריכים רלוונטיים</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              { href: '/personal-tax/salary-net-gross', label: 'מחשבון שכר נטו / ברוטו' },
              { href: '/personal-tax/tax-credits', label: 'מחשבון נקודות זיכוי' },
              { href: '/personal-tax/tax-refund', label: 'מחשבון החזר מס' },
              { href: '/employee-rights/severance', label: 'מחשבון פיצויי פיטורין' },
              { href: '/insurance/pension', label: 'מחשבון פנסיה' },
              { href: '/glossary/net', label: 'נטו — הגדרה' },
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
                  <span className="text-ink/45 group-open:rotate-180 transition" aria-hidden>▾</span>
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
