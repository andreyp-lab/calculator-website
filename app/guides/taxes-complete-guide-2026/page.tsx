import type { Metadata } from 'next';
import Link from 'next/link';
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';
import { HowToSchema } from '@/components/seo/HowToSchema';
import { FAQSchema } from '@/components/seo/FAQSchema';
import {
  TAX_BRACKETS_2026,
  SURTAX_2026,
  VAT_2026,
  CREDIT_POINT_2026,
} from '@/lib/constants/tax-2026';

// כל מספר בתיבת התשובה נשלף מקבועי tax-2026 — אתר YMYL, אין מספרים כתובים ביד.
const TAX_MIN_PCT = TAX_BRACKETS_2026[0].rate * 100; // 10
const TAX_TOP_PCT = TAX_BRACKETS_2026[TAX_BRACKETS_2026.length - 2].rate * 100; // 47
const SURTAX_PCT = SURTAX_2026.rate * 100; // 3
const SURTAX_THRESHOLD = SURTAX_2026.annualThreshold.toLocaleString('he-IL'); // 721,560
const VAT_PCT = VAT_2026.standard * 100; // 18
const CREDIT_POINT_MONTHLY = CREDIT_POINT_2026.monthly; // 242

export const metadata: Metadata = {
  title: 'כל המסים בישראל 2026 - המדריך השלם',
  description:
    'מדריך מקיף לכל המסים בישראל 2026: מס הכנסה, ב.ל., מע"מ, מס שבח, מס רכישה ומס יסף. מדרגות, פטורים, הטבות וניכויים לשכיר ועצמאי. חשב עכשיו עם המחשבונים.',
  alternates: { canonical: '/guides/taxes-complete-guide-2026' },
  openGraph: {
    // OG image לא מתפשט מ-app/opengraph-image.tsx לדפים שמגדירים openGraph משלהם.
    images: ['/opengraph-image'],
    title: 'כל המסים בישראל 2026 - המדריך השלם',
    description:
      'מדריך מקיף לכל המסים בישראל: מס הכנסה, ב.ל., מע"מ, מס שבח, מס רכישה, מס יסף, מס דיבידנד. מדרגות, פטורים, הטבות.',
    type: 'article',
    locale: 'he_IL',
  },
};

const tocItems = [
  { id: 'why', label: 'למה זה חשוב?' },
  { id: 'income-tax-employee', label: 'מס הכנסה לשכיר' },
  { id: 'income-tax-self', label: 'מס הכנסה לעצמאי' },
  { id: 'bituach-leumi', label: 'ביטוח לאומי + בריאות' },
  { id: 'vat', label: 'מע"מ' },
  { id: 'surtax', label: 'מס יסף 3%' },
  { id: 'capital-gains', label: 'מס שבח - מכירת דירה' },
  { id: 'purchase-tax', label: 'מס רכישה' },
  { id: 'dividend-tax', label: 'מס דיבידנד' },
  { id: 'investment-gains', label: 'מס רווחי הון' },
  { id: 'study-fund', label: 'קרן השתלמות' },
  { id: 'pension-tax', label: 'פנסיה וניכויים' },
  { id: 'donations', label: 'זיכוי מס על תרומות' },
  { id: 'annual-planning', label: 'תכנון מס שנתי' },
  { id: 'mistakes', label: 'טעויות יקרות' },
  { id: 'calculators', label: 'כל המחשבונים' },
  { id: 'faq', label: 'שאלות נפוצות' },
];

const taxesBreadcrumbs = [
  { name: 'דף הבית', url: '/' },
  { name: 'מיסוי אישי', url: '/personal-tax' },
  { name: 'כל המסים בישראל 2026', url: '/guides/taxes-complete-guide-2026' },
];

const taxesHowToSteps = [
  {
    name: 'הבן את מדרגות מס הכנסה לשכיר',
    text: 'למד את שבע מדרגות המס 2026, חשב את שיעור המס האפקטיבי שלך, ובדוק לאיזו מדרגה אתה שייך.',
    url: 'https://cheshbonai.co.il/guides/taxes-complete-guide-2026#income-tax-employee',
  },
  {
    name: 'בדוק מיסוי עצמאים ועוסקים',
    text: 'עצמאי? למד על מקדמות מס, ב.ל. עצמאי, מע"מ, וסוגיית חברה מול עוסק מורשה.',
    url: 'https://cheshbonai.co.il/guides/taxes-complete-guide-2026#income-tax-self',
  },
  {
    name: 'חשב ביטוח לאומי ודמי בריאות',
    text: 'שני שיעורים לשכיר: מופחת (4.27%) ומלא (12.17%). עצמאי: שיעורים שונים. חשב את חלקך.',
    url: 'https://cheshbonai.co.il/guides/taxes-complete-guide-2026#bituach-leumi',
  },
  {
    name: 'הבן מסי נדל"ן (שבח ורכישה)',
    text: 'מוכר או קונה זכות במקרקעין? הכיר את נתוני העסקה והסיווג הנדרשים, ובדוק את החבות בשירותי השומה העצמית הרשמיים.',
    url: 'https://cheshbonai.co.il/guides/taxes-complete-guide-2026#capital-gains',
  },
  {
    name: 'תכנן מס שנתי ובדוק זכאות להחזר',
    text: 'זהה ניכויים והטבות שעשויים לחול: קרן השתלמות, תרומות למוסד מאושר, נקודות זיכוי ופנסיה.',
    url: 'https://cheshbonai.co.il/guides/taxes-complete-guide-2026#annual-planning',
  },
];

const taxesFaqItems = [
  {
    question: 'מהן מדרגות המס לשכיר בישראל 2026?',
    answer: '7 מדרגות: 10% (עד 7,010 ₪/חודש), 14% (עד 10,060), 20% (עד 19,000), 31% (עד 25,100), 35% (עד 46,690), 47% (עד 60,130). מעל 60,130 ₪/חודש: 47% + 3% מס יסף (סה״כ 50% על הפרוסה העודפת).',
  },
  {
    question: 'מה ההבדל בין מס שבח למס רכישה?',
    answer: 'מס שבח משלם המוכר (על הרווח ממכירת הנכס). מס רכישה משלם הקונה (עפ"י מחיר הנכס וסוג הרוכש).',
  },
  {
    question: 'מה זה מס יסף ומי משלם אותו?',
    answer: 'מס יסף בשיעור 3% עשוי לחול על הכנסה חייבת מעל הסף השנתי. החל מ-2025 נוסף מס יסף של 2% על הכנסה ממקור הוני מעל הסף, לפי תנאי הדין. בדקו את פירוט ההכנסות בדוח השנתי.',
  },
  {
    question: 'האם עצמאי יכול לבחור בין חברה לעוסק מורשה?',
    answer: 'בחירת מבנה העסק תלויה ברווח, במשיכות, בעלויות ניהול, באחריות ובמס על חלוקת רווחים. אין סף הכנסה אחד שבו חברה עדיפה לכל עסק.',
  },
];

export default function TaxesCompleteGuide() {
  return (
    <div className="min-h-screen bg-paper" dir="rtl">
      {/* SEO Schemas */}
      <BreadcrumbSchema items={taxesBreadcrumbs} />
      <HowToSchema
        name="איך להבין ולתכנן את המסים שלך בישראל 2026"
        description={'מדריך שלב-אחר-שלב לכל המסים בישראל: מס הכנסה, ביטוח לאומי, מע"מ, מס שבח ומס רכישה.'}
        steps={taxesHowToSteps}
        totalTime="PT40M"
      />
      <FAQSchema items={taxesFaqItems} />

      {/* Schema.org */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: 'כל המסים בישראל 2026 - המדריך השלם',
            description:
              'מדריך מקיף לכל המסים בישראל: מס הכנסה, ב.ל., מע"מ, מס שבח, מס רכישה, מס יסף, מס דיבידנד.',
            datePublished: '2026-05-16',
            dateModified: '2026-10-02',
            author: { '@type': 'Organization', name: 'חשבונאי' },
            publisher: { '@type': 'Organization', name: 'חשבונאי' },
            inLanguage: 'he',
            url: 'https://cheshbonai.co.il/guides/taxes-complete-guide-2026',
          }),
        }}
      />

      {/* Dataset Schema — מדרגות מס ונתוני מס 2026 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Dataset',
            name: 'מדרגות מס הכנסה ונתוני מס ישראל 2026',
            description:
              'מדרגות מס הכנסה, שיעורי ביטוח לאומי, מע"מ ונתוני מס נוספים לשנת 2026 בישראל, כפי שמופיעים במדריך המסים השלם.',
            temporalCoverage: '2026',
            inLanguage: 'he',
            url: 'https://cheshbonai.co.il/guides/taxes-complete-guide-2026',
            creator: {
              '@type': 'Person',
              name: 'אנדרי פלטונוב',
              sameAs: 'https://www.linkedin.com/in/andreypl/',
            },
          }),
        }}
      />

      {/* Hero */}
      <div className="bg-ink text-cream py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-sm text-cream/70 mb-3">
            <Link href="/" className="hover:text-cream">דף הבית</Link>
            {' › '}
            <Link href="/personal-tax" className="hover:text-cream">מיסים</Link>
            {' › '}
            <span>מדריך מסים שלם 2026</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
            כל המסים בישראל 2026 – המדריך השלם
          </h1>
          <p className="text-xl text-cream/80 mb-6 max-w-3xl">
            מס הכנסה, ב.ל., מע&quot;מ, מס שבח, מס רכישה, מס יסף, דיבידנד, רווחי הון –
            מדרגות, פטורים, הטבות ותכנון מס חכם.
          </p>
          <div className="flex flex-wrap gap-4 text-sm text-cream/60">
            <span>⏱ זמן קריאה: ~50 דקות</span>
            <span>📅 עודכן: אוקטובר 2026</span>
            <span>📖 ~7,800 מילים</span>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10 lg:flex lg:gap-10">
        {/* Sticky TOC */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <div className="sticky top-8 bg-cream-2 rounded-none p-5 border border-ink/15">
            <h2 className="font-bold text-ink mb-3 text-sm uppercase tracking-wide">תוכן עניינים</h2>
            <ol className="space-y-1">
              {tocItems.map((item, i) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    className="text-sm text-ink/70 hover:text-ink hover:underline block py-0.5"
                  >
                    {i + 1}. {item.label}
                  </a>
                </li>
              ))}
            </ol>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0">

          {/* Quick answer */}
          <section
            className="answer-box bg-cream-2 border-r-4 border-gold p-5 mb-10"
            aria-label="תשובה מהירה"
          >
            <p className="text-lg text-ink leading-relaxed">
              <strong>
                אלה המסים העיקריים שמשלם יחיד בישראל ב-2026: מס הכנסה בשבע מדרגות, מ-
                {TAX_MIN_PCT}% ועד {TAX_TOP_PCT}%
              </strong>{' '}
              (ומס יסף של {SURTAX_PCT}% נוסף מעל {SURTAX_THRESHOLD} ₪ להכנסה חייבת, ובמקרים
              המתאימים עוד 2% על הכנסה ממקור הוני), ביטוח
              לאומי ודמי בריאות בשיעורים מדורגים, ומע&quot;מ של {VAT_PCT}% על צריכה. מנגד,
              כל נקודת זיכוי שווה {CREDIT_POINT_MONTHLY} ₪ בחודש שמפחיתים ישירות מהמס.
              בנדל&quot;ן נוספים מס רכישה לקונה ומס שבח למוכר, ובהשקעות — מס רווחי הון.
              המדריך שלפניך מפרט כל מס: מי משלם, כמה, אילו פטורים והטבות קיימים — עם קישור
              למדריכים ולכלים המתאימים לבדיקת הנתונים האישיים.
            </p>
          </section>

          {/* Section 1 */}
          <section id="why" className="mb-14 scroll-mt-8">
            <h2 className="text-2xl md:text-3xl font-bold text-ink mb-6 pb-2 border-b-2 border-ink/20">
              1. למה חשוב לבדוק זכאות אישית
            </h2>
            <p className="text-ink/70 mb-5 text-lg">
              כדאי לבדוק אם נוצלו נקודות זיכוי, ניכויים, פטורים והחזרים שמגיעים לפי נסיבותיכם.
              סכום ההחזר האפשרי משתנה מאדם לאדם ויש לאמת זכאות מול רשות המסים.
            </p>

            <p className="text-ink/70">
              מטרת המדריך הזה: לתת לך ידע מלא על כל מס בישראל, כך שתוכל לתכנן נכון ולא לשלם
              שקל יותר ממה שמחויב בחוק.
            </p>
          </section>

          {/* Section 2 */}
          <section id="income-tax-employee" className="mb-14 scroll-mt-8">
            <h2 className="text-2xl md:text-3xl font-bold text-ink mb-6 pb-2 border-b-2 border-ink/20">
              2. מס הכנסה לשכיר – מדרגות, נקודות זיכוי, החזר מס
            </h2>

            <h3 className="text-xl font-bold text-ink mb-3">מדרגות מס הכנסה 2026 (שכיר)</h3>
            <div className="overflow-x-auto mb-6">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-ink text-cream">
                    <th className="border border-ink/20 p-3 text-right">הכנסה שנתית</th>
                    <th className="border border-ink/20 p-3 text-right">שיעור מס שולי</th>
                    <th className="border border-ink/20 p-3 text-right">מס על המדרגה</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['עד 84,120 ₪ (7,010 ₪/חודש)', '10%', 'עד 8,412 ₪'],
                    ['84,121 – 120,720 ₪', '14%', '5,124 ₪'],
                    ['120,721 – 228,000 ₪', '20%', '21,456 ₪'],
                    ['228,001 – 301,200 ₪', '31%', '22,692 ₪'],
                    ['301,201 – 560,280 ₪', '35%', '90,678 ₪'],
                    ['560,281 – 721,560 ₪', '47%', '75,802 ₪'],
                    ['מעל 721,560 ₪', '47% + 3% יסף', 'על כל שקל נוסף'],
                  ].map(([income, rate, tax], i) => (
                    <tr key={income} className={i % 2 === 0 ? 'bg-paper' : 'bg-cream-2'}>
                      <td className="border border-ink/15 p-3">{income}</td>
                      <td className="border border-ink/15 p-3 font-bold text-gold">{rate}</td>
                      <td className="border border-ink/15 p-3">{tax}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h3 className="text-xl font-bold text-ink mb-3">נקודות זיכוי – בדיקה לפי המצב האישי</h3>
            <p className="text-ink/70 mb-4">
              נקודת זיכוי שווה 242 ₪ לחודש (2,904 ₪ לשנה). מספר הנקודות תלוי בין היתר
              בתושבות, במין, בשנת הלידה של הילדים, בזהות ההורה, בחזקה, במצב המשפחתי,
              בשירות, בלימודים ובמעמד העלייה. אין טבלה אחידה שמתאימה לכל הורה או לכל שנה.
              בדקו את הנתונים ב<a href="https://www.gov.il/he/service/tax-credit" target="_blank" rel="noopener noreferrer" className="text-gold underline">סימולטור נקודות הזיכוי הרשמי</a>.
            </p>

            <h3 className="text-xl font-bold text-ink mb-3">מי זכאי להחזר מס?</h3>
            <p className="text-ink/70 mb-5">
              שכיר שעבד אצל יותר ממעסיק אחד, היה בחל&quot;ת חלקי, נולד לו ילד, עלה לישראל, למד,
              תרם, או שיש לו הוצאות מוכרות – עשוי להיות זכאי להחזר, בהתאם לנתוניו. ניתן לדרוש
              עד 6 שנים אחורה! בדוק:
            </p>
            <Link href="/personal-tax/tax-refund" className="inline-block bg-ink text-cream px-5 py-2.5 rounded-none hover:bg-ink-deep font-medium mb-4">
              מדריך ובדיקה ברשות המסים ←
            </Link>

            <div className="mt-3">
              <Link href="/blog/tax-refund-complete-guide-2026" className="text-gold underline text-sm">
                המדריך השלם להחזר מס לשכירים 2026 ←
              </Link>
            </div>
          </section>

          {/* Section 3 */}
          <section id="income-tax-self" className="mb-14 scroll-mt-8">
            <h2 className="text-2xl md:text-3xl font-bold text-ink mb-6 pb-2 border-b-2 border-ink/20">
              3. מס הכנסה לעצמאי – מקדמות, ניכויים, הוצאות מוכרות
            </h2>

            <p className="text-ink/70 mb-5">
              עצמאי מחשב מס הכנסה על הרווח (הכנסות פחות הוצאות מוכרות), לא על מחזור.
              מדרגות המס זהות לשכיר, אך יש הבדלים מהותיים:
            </p>

            <h3 className="text-xl font-bold text-ink mb-3">הוצאות מוכרות עיקריות</h3>
            <div className="grid md:grid-cols-2 gap-3 mb-6">
              {[
                { expense: 'שכר דירה לעסק', rate: 'לפי השימוש, המסמכים ותנאי ההכרה' },
                { expense: 'רכב עסקי', rate: 'לפי סוג הרכב ותקנות ניכוי הוצאות רכב' },
                { expense: 'ציוד ומחשבים', rate: 'לפי סיווג ההוצאה וכללי הפחת' },
                { expense: 'טלפון', rate: 'לפי אופי השימוש והכללים החלים' },
                { expense: 'השתלמות מקצועית', rate: 'לפי הזיקה לעיסוק ותנאי הדין' },
                { expense: 'ביטוחים עסקיים', rate: 'לפי סוג הביטוח והקשר לעסק' },
                { expense: 'פנסיה עצמאי', rate: 'ניכוי וזיכוי לפי תקרות ותנאי זכאות' },
                { expense: 'קרן השתלמות עצמאי', rate: 'ניכוי לפי ההכנסה והתקרה הרלוונטית' },
              ].map((item) => (
                <div key={item.expense} className="bg-cream-2 border border-ink/15 rounded-none p-3">
                  <div className="font-medium text-ink text-sm">{item.expense}</div>
                  <div className="text-gold text-sm">{item.rate}</div>
                </div>
              ))}
            </div>

            <h3 className="text-xl font-bold text-ink mb-3">מקדמות מס – מה הן ואיך מחשבים?</h3>
            <p className="text-ink/70 mb-5">
              מקדמות מס הכנסה משולמות לפי הדרישה והתקופה שנקבעו בתיק. אם גובה הדרישה אינו
              תואם את הנתונים, אפשר לבדוק בקשת הקטנה בטופס 2216א׳ של רשות המסים. הדוח
              השנתי משמש לקביעת החבות לאחר הבאת המקדמות בחשבון.
            </p>

            <div className="flex gap-3 flex-wrap">
              <Link href="/self-employed/net" className="bg-ink text-cream px-4 py-2 rounded-none hover:bg-ink-deep text-sm font-medium">
                מדריך נטו עצמאי ←
              </Link>
              <Link href="/self-employed/tax-advances" className="bg-paper border border-ink text-ink px-4 py-2 rounded-none hover:bg-paper-hover text-sm font-medium">
                מדריך מקדמות מס ←
              </Link>
              <Link href="/self-employed/year-end-tax-simulator" className="bg-paper border border-ink text-ink px-4 py-2 rounded-none hover:bg-paper-hover text-sm font-medium">
                מדריך מס שנתי ←
              </Link>
            </div>

            <div className="mt-4">
              <Link href="/blog/year-end-tax-planning-self-employed" className="text-gold underline text-sm">
                תכנון מס לעצמאי לקראת סוף שנה ←
              </Link>
            </div>
          </section>

          {/* Section 4 */}
          <section id="bituach-leumi" className="mb-14 scroll-mt-8">
            <h2 className="text-2xl md:text-3xl font-bold text-ink mb-6 pb-2 border-b-2 border-ink/20">
              4. ביטוח לאומי + בריאות – שכיר vs. עצמאי
            </h2>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="bg-cream-2 border border-ink/15 rounded-none p-5">
                <h3 className="font-bold text-ink mb-3">שכיר</h3>
                <ul className="space-y-2 text-sm text-ink/70">
                  <li>• ב.ל. ובריאות לעובד רגיל בגיל העבודה: 4.27% עד 7,703 ₪ ו־12.17% מעליו, עד תקרה של 51,910 ₪</li>
                  <li>• חלק המעסיק: 4.51% במדרגה המופחתת ו־7.6% במדרגה הגבוהה</li>
                  <li>• רכיב הבריאות בחלק העובד: 3.23% ו־5.17% בהתאמה</li>
                  <li>• כל הניכויים אוטומטיים מהשכר</li>
                </ul>
              </div>
              <div className="bg-paper border border-ink/15 rounded-none p-5">
                <h3 className="font-bold text-ink mb-3">עצמאי (עוסק)</h3>
                <ul className="space-y-2 text-sm text-ink/70">
                  <li>• ב.ל. (הכנסות עד 7,703 ₪): 7.70%</li>
                  <li>• ב.ל. (הכנסות מעל עד 51,910 ₪): 18%</li>
                  <li>• רכיב הבריאות בתוך השיעורים: 3.23% ו־5.17% בהתאמה</li>
                  <li>• תשלום דרך פנקס המקדמות</li>
                </ul>
              </div>
            </div>

            <p className="text-ink/70 mb-5">
              <strong>השוואה אישית:</strong> בסיס הביטוח לעצמאי אינו בהכרח זהה לשכר ברוטו של
              שכיר באותו סכום. הביטוח הלאומי מבצע התאמות להכנסה המבוטחת, ולכן יש לבדוק כל
              מעמד ואת ההכנסות הנוספות במחשבון הרשמי.
            </p>

            <div className="flex gap-3 flex-wrap">
              <Link href="/self-employed/social-security" className="bg-ink text-cream px-4 py-2 rounded-none hover:bg-ink-deep text-sm font-medium">
                מדריך ב.ל. לעצמאי ←
              </Link>
              <Link href="/blog/bituach-leumi-self-employed-deep-dive" className="text-gold underline text-sm inline-flex items-center">
                מדריך מעמיק לב.ל. לעצמאי ←
              </Link>
            </div>
          </section>

          {/* Section 5 */}
          <section id="vat" className="mb-14 scroll-mt-8">
            <h2 className="text-2xl md:text-3xl font-bold text-ink mb-6 pb-2 border-b-2 border-ink/20">
              5. מע&quot;מ – 18%, עוסק פטור/מורשה
            </h2>

            <div className="bg-yellow-50 border border-yellow-200 rounded-none p-5 mb-6">
              <p className="font-bold text-yellow-900 mb-2">שיעור מע&quot;מ 2026: 18%</p>
              <p className="text-yellow-800 text-sm">
                מע&quot;מ עלה מ-17% ל-18% ב-1 בינואר 2025. עוסק מורשה גובה מע&quot;מ על עסקאות חייבות
                בשיעור החל עליהן ומדווח לרשות המסים; יש גם עסקאות פטורות או בשיעור אפס לפי הדין.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-5 mb-6">
              <div className="border border-ink/15 rounded-none p-5">
                <h3 className="font-bold text-ink mb-3">עוסק פטור</h3>
                <ul className="space-y-1 text-sm text-ink/70">
                  <li>• מחזור צפוי עד 122,833 ₪ לשנה, בכפוף לסוג העיסוק ולתנאי הרישום</li>
                  <li>• פטור מגביית מע&quot;מ מלקוחות</li>
                  <li>• אינו מנכה מס תשומות</li>
                  <li>• מגיש הצהרה שנתית למע&quot;מ; חובות דיווח אחרות נבדקות בנפרד</li>
                </ul>
              </div>
              <div className="border border-ink/15 rounded-none p-5">
                <h3 className="font-bold text-ink mb-3">עוסק מורשה</h3>
                <ul className="space-y-1 text-sm text-ink/70">
                  <li>• נדרש מעל התקרה או בעיסוקים שחייבים ברישום מורשה</li>
                  <li>• גובה מע&quot;מ בעסקאות חייבות בשיעור החל</li>
                  <li>• עשוי לנכות מס תשומות רק בהתקיים תנאי הדין ובמסמך תקין</li>
                  <li>• תקופת הדיווח נקבעת בתיק</li>
                </ul>
              </div>
            </div>

            <div className="flex gap-3 flex-wrap">
              <Link href="/self-employed/vat" className="bg-ink text-cream px-4 py-2 rounded-none hover:bg-ink-deep text-sm font-medium">
                מחשבון מע&quot;מ ←
              </Link>
              <Link href="/blog/vat-complete-guide-israel" className="text-gold underline text-sm inline-flex items-center">
                המדריך השלם למע&quot;מ ←
              </Link>
            </div>
          </section>

          {/* Section 6 */}
          <section id="surtax" className="mb-14 scroll-mt-8">
            <h2 className="text-2xl md:text-3xl font-bold text-ink mb-6 pb-2 border-b-2 border-ink/20">
              6. מס יסף – בדיקת הכנסות מעל הסף
            </h2>

            <p className="text-ink/70 mb-5">
              מס יסף בשיעור 3% חל על הכנסה חייבת מעל הסף השנתי לפי תנאי הדין. החל משנת 2025
              חל גם מס נוסף של 2% על חלק מההכנסה ממקור הוני שעולה על הסף. אופן צירוף
              ההכנסות והחריגים מפורטים בהוראת הביצוע של רשות המסים.
            </p>

            <div className="bg-red-50 border border-red-200 rounded-none p-5 mb-5">
              <h3 className="font-bold text-red-900 mb-2">מי חייב?</h3>
              <p className="text-red-800 text-sm">
                בדקו את ההכנסה החייבת מכל מקור ואת אופי ההכנסה ההונית לפני חישוב.
                בחלק מעסקאות המקרקעין חלים כללים מיוחדים.
              </p>
            </div>

            <h3 className="text-xl font-bold text-ink mb-3">דוגמה מספרית</h3>
            <p className="text-ink/70 mb-5">
              אם ההכנסה החייבת היא שכר בלבד בסך 800,000 ₪ והסף הרלוונטי הוא 721,560 ₪,
              ההפרש הוא 78,440 ₪. מס היסף בשיעור 3% על ההפרש הוא 2,353.20 ₪, לפני בדיקת
              נסיבות נוספות. ראו את{' '}
              <a href="https://www.gov.il/BlobFolder/policy/inst-05-2025/he/IncomeTax_inst-05-2025.pdf" className="text-gold underline">הוראת הביצוע של רשות המסים</a>.
            </p>

            <Link href="/blog/surtax-yesef-2026-explained" className="text-gold underline text-sm">
              הסבר מלא על מס יסף 2026 ←
            </Link>
          </section>

          {/* Section 7 */}
          <section id="capital-gains" className="mb-14 scroll-mt-8">
            <h2 className="text-2xl md:text-3xl font-bold text-ink mb-6 pb-2 border-b-2 border-ink/20">
              7. מס שבח – מכירת דירה, מס לינארי
            </h2>

            <p className="text-ink/70 mb-5">
              מס שבח נבדק על השבח במכירת זכות במקרקעין. שיעור המס, ההוצאות המותרות,
              הפטורים והחישוב הלינארי תלויים בסוג הנכס, במועדי הרכישה והמכירה ובנתוני המוכר.
            </p>

            <h3 className="text-xl font-bold text-ink mb-3">פטור דירת מגורים</h3>
            <p className="text-ink/70 mb-5">
              פטור לדירת מגורים יחידה כפוף לתנאים מצטברים. בין היתר נבדקים מעמד הדירה כדירת
              מגורים מזכה, בעלות של 18 חודשים לפחות מהמועד שבו הייתה לדירת מגורים, היותה דירה
              יחידה והיעדר שימוש בפטור זה ב־18 החודשים הקודמים, לצד חריגים וכללים נוספים.
            </p>

            <h3 className="text-xl font-bold text-ink mb-3">מס לינארי (דירה שנייה+)</h3>
            <p className="text-ink/70 mb-5">
              בחלק מהמקרים חל חישוב לינארי מוטב המחלק את השבח לפי תקופות, אך התוצאה אינה
              נקבעת לפי מספר השנים בלבד. יש להביא בחשבון יום רכישה ומכירה, הוצאות מוכרות,
              פחת, זכויות בנייה, פטורים ונתונים נוספים. אמתו את התוצאה ב<a href="https://www.gov.il/he/service/real_estate_selfshuma" target="_blank" rel="noopener noreferrer" className="text-gold underline">שומה העצמית הרשמית</a>.
            </p>

            <div className="flex gap-3 flex-wrap">
              <Link href="/real-estate/capital-gains-tax" className="bg-ink text-cream px-4 py-2 rounded-none hover:bg-ink-deep text-sm font-medium">
                בדיקת מס שבח ←
              </Link>
              <Link href="/blog/capital-gains-tax-property-2026" className="text-gold underline text-sm inline-flex items-center">
                מדריך מס שבח 2026 ←
              </Link>
            </div>
          </section>

          {/* Section 8 */}
          <section id="purchase-tax" className="mb-14 scroll-mt-8">
            <h2 className="text-2xl md:text-3xl font-bold text-ink mb-6 pb-2 border-b-2 border-ink/20">
              8. מס רכישה – מדרגות וסיווג הרוכש
            </h2>

            <p className="text-ink/70 mb-5">
              מס רכישה מחושב במדרגות ובהתאם לסוג הזכות, שווי העסקה וסיווג הרוכש. דירה יחידה,
              דירה נוספת, זכות שאינה דירת מגורים והקלות אישיות כפופות למסלולים ולתנאים שונים.
              אין לפצל את כל המסלולים סביב סף יחיד, ואין להחיל את השיעור העליון על מלוא השווי
              כאשר הדין קובע מדרגות. בדקו את הנתונים ב<a href="https://www.gov.il/he/service/real_eatate_taxsimulator" target="_blank" rel="noopener noreferrer" className="text-gold underline">סימולטור מס הרכישה הרשמי</a>.
            </p>

            <div className="flex gap-3 flex-wrap">
              <Link href="/real-estate/purchase-tax" className="bg-ink text-cream px-4 py-2 rounded-none hover:bg-ink-deep text-sm font-medium">
                מחשבון מס רכישה ←
              </Link>
              <Link href="/blog/purchase-tax-2026-complete-guide" className="text-gold underline text-sm inline-flex items-center">
                מדריך מס רכישה 2026 ←
              </Link>
            </div>
          </section>

          {/* Section 9 */}
          <section id="dividend-tax" className="mb-14 scroll-mt-8">
            <h2 className="text-2xl md:text-3xl font-bold text-ink mb-6 pb-2 border-b-2 border-ink/20">
              9. מס דיבידנד – שיעור רגיל ובעל מניות מהותי
            </h2>

            <p className="text-ink/70 mb-5">
              חלוקת דיבידנד מחברה בע&quot;מ חייבת במס. שיעורי המס:
            </p>

            <div className="grid md:grid-cols-2 gap-4 mb-5">
              <div className="bg-cream-2 border border-ink/15 rounded-none p-4">
                <h3 className="font-bold text-ink mb-2">בעל מניות רגיל</h3>
                <p className="text-2xl font-bold text-gold">25%</p>
                <p className="text-sm text-ink/70">מי שמחזיק פחות מ-10% מהחברה</p>
              </div>
              <div className="bg-cream-2 border border-ink/15 rounded-none p-4">
                <h3 className="font-bold text-ink mb-2">בעל מניות מהותי</h3>
                <p className="text-2xl font-bold text-red-700">30%</p>
                <p className="text-sm text-ink/70">ככלל, מחזיק במישרין או בעקיפין 10% לפחות באמצעי שליטה</p>
              </div>
            </div>

            <p className="text-ink/70 mb-5">
              <strong>מיסוי דו־שלבי:</strong> החברה משלמת מס חברות על רווחיה, ובחלוקת דיבידנד
              עשוי לחול מס נוסף אצל בעל המניות. השוואת שכר ודיבידנד תלויה גם בדמי ביטוח,
              בניכוי ההוצאה בחברה, במס יסף ובכללי משיכה מחברה; אין העדפה אחידה לכל בעל עסק.
            </p>

            <div className="flex gap-3">
              <Link href="/self-employed/dividend-vs-salary" className="bg-ink text-cream px-4 py-2 rounded-none hover:bg-ink-deep text-sm font-medium">
                מדריך דיבידנד מול שכר ←
              </Link>
            </div>
          </section>

          {/* Section 10 */}
          <section id="investment-gains" className="mb-14 scroll-mt-8">
            <h2 className="text-2xl md:text-3xl font-bold text-ink mb-6 pb-2 border-b-2 border-ink/20">
              10. מס רווחי הון – לפי הנכס והנישום
            </h2>

            <p className="text-ink/70 mb-5">
              שיעור המס ובסיס החישוב משתנים לפי סוג הנכס, אופן ההחזקה, זהות הנישום, הצמדה,
              מועד הרכישה והוראות מיוחדות. אין שיעור אוניברסלי אחד לכל נייר ערך, קרן, קריפטו
              או אופציה, ויש לבדוק גם מס יסף וחובת דיווח.
            </p>

            <h3 className="text-xl font-bold text-ink mb-3">מה מחשבים?</h3>
            <ul className="list-disc list-inside text-ink/70 space-y-2 mb-5">
              <li>בסיס הרווח וההתאמה למדד תלויים בסוג הנכס ובהוראות החלות</li>
              <li>קיזוז הפסדים מותר רק מול הכנסות ובהתאם לתנאי סעיף 92</li>
              <li>הפסד הון כשיר עשוי לעבור לשנים הבאות בכפוף לדיווח ולתנאי הדין</li>
              <li>המיסוי בחיסכון פנסיוני, קופת גמל וקרן השתלמות כפוף למסלול, לתקרות ולתנאי המשיכה</li>
            </ul>

            <h3 className="text-xl font-bold text-ink mb-3">אופציות 102 – הטבה מרכזית</h3>
            <p className="text-ink/70 mb-5">
              במסלול רווח הון לפי סעיף 102 חלים תנאים מהותיים על ההקצאה, הנאמן והחברה.
              תקופת 24 החודשים נמדדת ככלל ממועד ההקצאה וההפקדה אצל הנאמן, ולא ממועד ההבשלה.
            </p>

            <Link href="/investments/compound-interest" className="bg-ink text-cream px-4 py-2 rounded-none hover:bg-ink-deep text-sm font-medium inline-block">
              מחשבון ריבית דריבית ←
            </Link>
          </section>

          {/* Section 11 */}
          <section id="study-fund" className="mb-14 scroll-mt-8">
            <h2 className="text-2xl md:text-3xl font-bold text-ink mb-6 pb-2 border-b-2 border-ink/20">
              11. קרן השתלמות – ניכוי ופטור מותנה
            </h2>

            <div className="bg-green-50 border border-green-200 rounded-none p-6 mb-5">
              <h3 className="font-bold text-green-900 mb-3 text-lg">מה כדאי לבדוק בקרן השתלמות?</h3>
              <ul className="space-y-2 text-green-800 text-sm">
                <li>• <strong>שכיר:</strong> כאשר קיים הסדר קרן, הפקדות מעסיק שעומדות ביחס ובתקרה עשויות לקבל טיפול מס מועדף</li>
                <li>• <strong>שכיר:</strong> הפקדת העובד היא חלק מתנאי הקרן ואינה ניכוי מס גורף לעצמה</li>
                <li>• <strong>תשואה:</strong> תלויה במסלול ובביצועי ההשקעות ואינה מובטחת</li>
                <li>• <strong>משיכה:</strong> פטור על הרווחים כפוף לתקרה, לוותק ולתנאי המשיכה</li>
                <li>• <strong>תקרה פטורה לשכיר:</strong> 15,712 ₪ הכנסה × 7.5% = 1,178 ₪/חודש</li>
              </ul>
            </div>

            <h3 className="text-xl font-bold text-ink mb-3">קרן השתלמות לעצמאי</h3>
            <p className="text-ink/70 mb-5">
              עצמאי עשוי לקבל ניכוי על הפקדות עד 4.5% מההכנסה הקובעת בכפוף לתקרה.
              תקרת ההפקדה לצורך פטור רווחי הון שונה מתקרת הניכוי, והפטור כפוף לתנאי המשיכה.
            </p>

            <Link href="/blog/study-fund-self-employed-strategy" className="text-gold underline text-sm">
              מדריך קרן השתלמות לעצמאי ←
            </Link>
          </section>

          {/* Section 12 */}
          <section id="pension-tax" className="mb-14 scroll-mt-8">
            <h2 className="text-2xl md:text-3xl font-bold text-ink mb-6 pb-2 border-b-2 border-ink/20">
              12. פנסיה – חובת הפקדה והטבות מס
            </h2>

            <div className="grid md:grid-cols-2 gap-5 mb-5">
              <div className="border border-ink/15 rounded-none p-5">
                <h3 className="font-bold text-ink mb-3">שכיר</h3>
                <ul className="space-y-1 text-sm text-ink/70">
                  <li>• עובד מפקיד: 6%</li>
                  <li>• מעסיק מפקיד: 6.5% (פנסיה) + 6% (פיצויים)</li>
                  <li>• סה&quot;כ: 18.5% מהשכר</li>
                  <li>• הטבת מס להפקדת עובד: נבדקת לפי תנאי הזיכוי והתקרות</li>
                </ul>
              </div>
              <div className="border border-ink/15 rounded-none p-5">
                <h3 className="font-bold text-ink mb-3">עצמאי</h3>
                <ul className="space-y-1 text-sm text-ink/70">
                  <li>• חובת הפקדה: לפי ההכנסה והתנאים האישיים</li>
                  <li>• ניכוי: מקטין הכנסה חייבת בכפוף לתקרה</li>
                  <li>• זיכוי: מקטין את המס לפי תנאי הזכאות</li>
                  <li>• הטבת המס האישית: תלויה בהכנסה ובהפקדות בפועל</li>
                </ul>
              </div>
            </div>

            <div className="flex gap-3 flex-wrap">
              <Link href="/insurance/pension" className="bg-ink text-cream px-4 py-2 rounded-none hover:bg-ink-deep text-sm font-medium">
                מדריך בדיקת פנסיה ←
              </Link>
              <Link href="/self-employed/mandatory-pension" className="bg-paper border border-ink text-ink px-4 py-2 rounded-none hover:bg-paper-hover text-sm font-medium">
                פנסיה חובה לעצמאי ←
              </Link>
              <Link href="/blog/pension-deduction-self-employed-2026" className="text-gold underline text-sm inline-flex items-center">
                ניכוי פנסיה לעצמאי ←
              </Link>
            </div>
          </section>

          {/* Section 13 */}
          <section id="donations" className="mb-14 scroll-mt-8">
            <h2 className="text-2xl md:text-3xl font-bold text-ink mb-6 pb-2 border-b-2 border-ink/20">
              13. תרומות – זיכוי מס בכפוף לתנאים
            </h2>

            <p className="text-ink/70 mb-5">
              יחיד עשוי לקבל זיכוי של עד 35% מתרומה למוסד בעל אישור תקף לפי סעיף 46,
              בכפוף למס ששולם, לסכום המזערי ולתקרות השנתיות. יש לבדוק את האישור והקבלה
              במערכת התרומות של רשות המסים.
            </p>

            <div className="bg-cream-2 border border-ink/15 rounded-none p-4 mb-4">
              <p className="text-ink/70 text-sm">
                <strong>דוגמה מותנית:</strong> תרומה של 10,000 ₪ עשויה להקנות זיכוי של עד
                3,500 ₪ רק אם המוסד מאושר, התרומה עומדת בתנאים ויש לנישום די מס לקיזוז.
              </p>
            </div>

            <p className="text-ink/70 mb-3">
              הסכום המזערי והתקרות מתעדכנים. בדקו את הערכים לשנת המס ואת יתרת המס לתשלום
              ב<a href="https://www.gov.il/he/pages/faq-digital-donation-system" target="_blank" rel="noopener noreferrer" className="text-gold underline">הנחיות רשות המסים</a>.
            </p>
          </section>

          {/* Section 14 */}
          <section id="annual-planning" className="mb-14 scroll-mt-8">
            <h2 className="text-2xl md:text-3xl font-bold text-ink mb-6 pb-2 border-b-2 border-ink/20">
              14. תכנון מס שנתי – 12 חודשים
            </h2>

            <div className="space-y-4">
              {[
                { month: 'ינואר', action: 'בדקו אם נדרש תיאום מס לפי מקורות ההכנסה והמשלמים שלכם.' },
                { month: 'במהלך השנה', action: 'בדקו את המועד שפרסמה רשות המסים לשנת המס ולשיטת ההגשה הרלוונטית.' },
                { month: 'לאחר קבלת האישורים', action: 'בדקו זכאות להחזר מס ואת מסלול ההגשה המתאים.' },
                { month: 'יולי–ספטמבר', action: 'עדכון מקדמות מס לעצמאים (אם ההכנסה שונה מהצפוי).' },
                { month: 'ספטמבר–נובמבר', action: 'תכנון שנתי: האם לפרוע הוצאות בשנה הנוכחית? לקנות ציוד? להפקיד לקרן השתלמות?' },
                { month: 'נובמבר–דצמבר', action: 'בדקו תקרות שלא נוצלו, צורכי נזילות ואפשרות קיזוז הפסדים לפני פעולה.' },
              ].map((item) => (
                <div key={item.month} className="flex gap-4 bg-paper border border-ink/15 rounded-none p-4">
                  <div className="flex-shrink-0 bg-ink text-cream rounded-none px-3 py-2 text-xs font-bold text-center min-w-[80px]">
                    {item.month}
                  </div>
                  <p className="text-ink/70 text-sm">{item.action}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Section 15 */}
          <section id="mistakes" className="mb-14 scroll-mt-8">
            <h2 className="text-2xl md:text-3xl font-bold text-ink mb-6 pb-2 border-b-2 border-ink/20">
              15. טעויות שעולות אלפי שקלים
            </h2>

            <div className="space-y-4">
              {[
                { mistake: 'לא לבדוק זכאות להחזר מס', cost: 'תלוי בנתונים', fix: 'בדוק את שנות המס שבהן ניתן להגיש בקשה.' },
                { mistake: 'לא לעדכן נקודות זיכוי', cost: 'תלוי בזכאות', fix: 'עדכן שינוי במצב משפחתי וזכאות לתואר או להטבות אחרות.' },
                { mistake: 'לא לבדוק צורך בתיאום מס', cost: 'ניכוי גבוה אפשרי', fix: 'משלם משני עשוי לנכות בשיעור גבוה; בדקו אם תיאום מס חל.' },
                { mistake: 'לא לבדוק תנאי קרן השתלמות', cost: 'הטבה אפשרית', fix: 'בדוק תקרות, תנאי משיכה והתאמה לצורכי נזילות.' },
                { mistake: 'לא לבדוק הטבת פנסיה כעצמאי', cost: 'תלוי בתקרה', fix: 'בדוק ניכוי וזיכוי לפי אישורי ההפקדה וההכנסה.' },
                { mistake: 'שכחת לרשום הוצאות', cost: 'תשלום מס על הכנסה בה לא חייב', fix: 'שמור כל קבלה ורשום הוצאות מוכרות.' },
              ].map((item, i) => (
                <div key={i} className="border border-red-200 rounded-none p-5 bg-red-50">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold text-red-900">{item.mistake}</h3>
                    <span className="bg-red-700 text-white text-xs px-2 py-1 rounded">{item.cost}</span>
                  </div>
                  <p className="text-green-800 text-sm font-medium">פתרון: {item.fix}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Section 16 */}
          <section id="calculators" className="mb-14 scroll-mt-8">
            <h2 className="text-2xl md:text-3xl font-bold text-ink mb-6 pb-2 border-b-2 border-ink/20">
              16. מחשבונים ומדריכים
            </h2>

            <div className="grid md:grid-cols-2 gap-4">
              {[
                { href: '/personal-tax/salary-net-gross', label: 'מחשבון שכר נטו-ברוטו', desc: 'קבלו אומדן לפי מדרגות המס, ב.ל. והנחות הפנסיה המוצגות.' },
                { href: '/personal-tax/tax-refund', label: 'סימולטור החזר מס לשכירים', desc: 'אומדן שנתי לפי טופסי 106, מס שנוכה ונקודות זיכוי.' },
                { href: '/personal-tax/income-tax', label: 'מדריך מס הכנסה', desc: 'הבינו את המדרגות ועברו לבדיקה הרשמית.' },
                { href: '/personal-tax/tax-credits', label: 'בדיקת נקודות זיכוי', desc: 'הכינו את הנתונים ובדקו בסימולטור הרשמי.' },
                { href: '/self-employed/net', label: 'מדריך נטו עצמאי', desc: 'הכן את הנתונים לבדיקה אישית של התזרים הפנוי.' },
                { href: '/self-employed/social-security', label: 'מדריך ב.ל. עצמאי', desc: 'בדוק בסיס חיוב ושיעורים באתר ביטוח לאומי.' },
                { href: '/self-employed/vat', label: 'מחשבון מע"מ', desc: 'חישוב מע"מ עוסק מורשה/פטור.' },
                { href: '/self-employed/tax-advances', label: 'מדריך מקדמות מס', desc: 'בדוק את הדרישה בתיק ואת אפשרות עדכונה.' },
                { href: '/self-employed/year-end-tax-simulator', label: 'מדריך מס שנתי', desc: 'רכז נתונים לדוח השנתי ולהערכת החבות.' },
                { href: '/self-employed/dividend-vs-salary', label: 'דיבידנד מול שכר', desc: 'מה לבדוק לפני בחירת דרך משיכה?' },
                { href: '/real-estate/capital-gains-tax', label: 'הפניה לשומה העצמית הרשמית', desc: 'הכינו נתוני מכירה והוצאות לבדיקת מס שבח.' },
                { href: '/real-estate/purchase-tax', label: 'מחשבון מס רכישה', desc: 'מס רכישה לפי סוג רוכש ומחיר.' },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block bg-paper border border-ink/15 rounded-none p-4 hover:border-gold hover:shadow-md transition group"
                >
                  <h3 className="font-bold text-gold group-hover:text-ink mb-1">{item.label}</h3>
                  <p className="text-ink/70 text-sm">{item.desc}</p>
                </Link>
              ))}
            </div>

            <h3 className="text-lg font-bold text-ink mt-8 mb-3">מאמרים קשורים</h3>
            <div className="grid md:grid-cols-2 gap-2">
              {[
                { href: '/blog/tax-refund-complete-guide-2026', label: 'המדריך השלם להחזר מס 2026' },
                { href: '/blog/income-tax-brackets-2026-complete-guide', label: 'מדרגות מס הכנסה 2026' },
                { href: '/blog/tax-reduction-25-legal-ways', label: '25 דרכים חוקיות להפחית מס' },
                { href: '/blog/tax-changes-2026', label: 'שינויי מס 2026' },
                { href: '/blog/tax-credit-points-2026', label: 'נקודות זיכוי 2026' },
                { href: '/blog/surtax-yesef-2026-explained', label: 'מס יסף 2026 - הסבר' },
                { href: '/blog/study-fund-self-employed-strategy', label: 'קרן השתלמות לעצמאי' },
                { href: '/blog/pension-self-employed-11-percent', label: 'פנסיה עצמאי - 11% ניכוי' },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-2 text-gold hover:text-ink/70 text-sm py-1 border-b border-ink/10"
                >
                  <span>←</span> {item.label}
                </Link>
              ))}
            </div>
          </section>

          {/* Section 17 - FAQ */}
          <section id="faq" className="mb-14 scroll-mt-8">
            <h2 className="text-2xl md:text-3xl font-bold text-ink mb-6 pb-2 border-b-2 border-ink/20">
              17. שאלות נפוצות (FAQ)
            </h2>

            <div className="space-y-5">
              {[
                {
                  q: 'מה שיעור מס הכנסה המינימלי בישראל?',
                  a: 'שיעור המדרגה הראשונה הוא 10%. המס בפועל תלוי בהכנסה השנתית, בנקודות הזיכוי ובנתונים האישיים; אין סף הכנסה נטול מס זהה לכולם.',
                },
                {
                  q: 'האם צריך להגיש דוח שנתי כשכיר?',
                  a: 'חובת ההגשה תלויה בסוגי ההכנסה, בסכומים, בניכוי במקור, בנכסים ובפטורים. שכיר שאינו חייב בדוח עשוי עדיין להגיש בקשה להחזר במסלול המתאים.',
                },
                {
                  q: 'האם שכר דירה חייב במס?',
                  a: 'הטיפול תלוי בסוג הנכס והשימוש, בזהות השוכר, בסכום הכולל ובמסלול שנבחר. גם מסלול הפטור לדירת מגורים כפוף לתנאים, לתיעוד ולצבירת הכנסות השכירות.',
                },
                {
                  q: 'מה ההבדל בין ניכוי מס לבין זיכוי מס?',
                  a: 'ניכוי מפחית את ההכנסה החייבת; זיכוי מפחית את המס המחושב. הערך בפועל תלוי בשיעור המס, בתקרות ובמס שניתן לקזז, ולכן אין לקבוע שאחד תמיד עדיף.',
                },
                {
                  q: 'כמה אחורה ניתן לדרוש החזר מס?',
                  a: 'עד 6 שנים אחורה. דרישת החזר ל-2020 ניתן להגיש עד 31.12.2026. בדוק אם מגיע לך גם על שנים ישנות.',
                },
                {
                  q: 'האם עצמאי יכול להיות גם שכיר?',
                  a: 'כן. ניתן לעבוד כשכיר ובמקביל לנהל עסק עצמאי. חייבים לדווח על שתי ההכנסות ולשלם מס ו-ב.ל. בהתאם.',
                },
                {
                  q: 'מה הכוונה במס אפקטיבי לעומת מס שולי?',
                  a: 'מס שולי = שיעור המס על השקל האחרון שהרווחת (47% אם עברת מדרגה מסוימת). מס אפקטיבי = כמה % שילמת מכלל ההכנסה. לרוב המס האפקטיבי נמוך משמעותית מהשולי.',
                },
                {
                  q: 'האם עצמאי חייב לשלם מס גם אם לא הרוויח?',
                  a: 'החבות במס הכנסה ובביטוח לאומי תלויה במקורות הכנסה אחרים, במעמד הביטוחי ובבסיס החיוב. בדקו את הדרישה האישית ברשות המסים ובביטוח הלאומי.',
                },
                {
                  q: 'מתי כדאי לפתוח חברה בע"מ?',
                  a: 'אין רווח שנתי יחיד שממנו חברה בע״מ עדיפה. השוו רווח, משיכות, מס חברות ומס דיבידנד, אחריות ועלויות ניהול עם איש מקצוע.',
                },
                {
                  q: 'האם עלות ילד במעון מוכרת לניכוי?',
                  a: 'אין להסיק מתשלום למעון מספר קבוע של נקודות זיכוי. נקודות בגין ילדים תלויות בשנת הלידה, בזהות ההורה, בחזקה ובמצב המשפחתי; בדקו בסימולטור הרשמי.',
                },
                {
                  q: 'האם ניתן לבטל מקדמות מס?',
                  a: 'ניתן להגיש בקשה להקטנת מקדמות כאשר השיעור שנקבע גבוה מהמס הצפוי, בהתאם לתנאי השירות ולמסמכים הנדרשים.',
                },
                {
                  q: 'מה הרישוי הנדרש לפתיחת עסק?',
                  a: 'הרישומים תלויים בסוג הפעילות: מע״מ ומס הכנסה, מעמד בביטוח הלאומי ולעיתים רישיון עסק או אישורים מקצועיים. זמני הטיפול משתנים לפי המסלול והמסמכים.',
                },
                {
                  q: 'האם אפשר להגיש דוח שנתי בעצמי?',
                  a: 'ניתן להגיש באופן מקוון כאשר שירות רשות המסים מאפשר זאת. הטפסים והנספחים תלויים במקורות ההכנסה ובנכסים; במקרה מורכב כדאי לקבל סיוע מקצועי.',
                },
                {
                  q: 'האם הפרשות לפנסיה פטורות ממס?',
                  a: 'הפקדות מעסיק ועובד מקבלות טיפול מס רק בתוך התקרות ובכפוף לתנאים. הפטור על קצבה בגיל פרישה הוא אישי ועשוי להיות מושפע מקיבוע זכויות וממענקים שנמשכו בעבר.',
                },
              ].map((item, i) => (
                <details key={i} className="border border-ink/15 rounded-none overflow-hidden">
                  <summary className="p-4 font-bold text-ink cursor-pointer hover:bg-cream-2 flex items-center gap-2">
                    <span className="text-gold">ש:</span> {item.q}
                  </summary>
                  <div className="p-4 pt-0 bg-cream-2 text-ink/70 text-sm leading-relaxed">
                    <span className="text-green-700 font-bold">ת: </span>{item.a}
                  </div>
                </details>
              ))}
            </div>
          </section>

          {/* Bottom CTA */}
          <div className="bg-ink text-cream rounded-none p-8 text-center">
            <h2 className="text-2xl font-bold mb-3">רוצה לבדוק את נתוני המס?</h2>
            <p className="text-cream/80 mb-6">
              בדוק את הזכויות והנתונים האישיים שלך בעזרת המדריכים והמקורות הרשמיים
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link
                href="/personal-tax/tax-refund"
                className="bg-cream text-ink px-6 py-3 rounded-none font-bold hover:bg-paper-hover transition"
              >
                סימולטור החזר מס ←
              </Link>
              <Link
                href="/self-employed/year-end-tax-simulator"
                className="bg-ink-deep text-cream px-6 py-3 rounded-none font-bold hover:bg-ink transition border border-cream/20"
              >
                מדריך מס שנתי ←
              </Link>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}
