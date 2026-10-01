import type { Metadata } from 'next';
import Link from 'next/link';
import { AuthorBox } from '@/components/calculator/AuthorBox';
import { Breadcrumbs } from '@/components/calculator/Breadcrumbs';
import { DisclaimerBox } from '@/components/calculator/DisclaimerBox';
import { CourseCTA } from '@/components/marketing/CourseCTA';

const PAGE_PATH = '/compare/osek-patur-vs-murshe';
const SITE_URL = 'https://cheshbonai.co.il';
const LAST_UPDATED = '1 באוקטובר 2026';

const sources = {
  exemptRegistration: 'https://www.gov.il/he/service/request-open-exempt-dealer-via-internet',
  exemptDeclaration: 'https://www.gov.il/he/service/vat-declarationisexempt',
  authorizedRegistration: 'https://www.gov.il/he/service/vat-821',
  vatGuide:
    'https://www.gov.il/BlobFolder/generalpage/income-tax-guide-knowyourright/he/Guides_IncomeTax_da-2025.pdf',
  microBusiness:
    'https://www.gov.il/BlobFolder/dynamiccollectorresultitem/netuachmaam-030626/he/vat_netuachmaam-030626.pdf',
  nationalInsurance:
    'https://www.btl.gov.il/Insurance/National%20Insurance/type_list/Self_Employed/Pages/howtoregister.aspx',
} as const;

export const metadata: Metadata = {
  title: { absolute: 'עוסק פטור או עוסק מורשה? ההבדלים שחשוב להכיר | חשבונאי' },
  description:
    'השוואה מעשית בין עוסק פטור לעוסק מורשה: מע״מ, מס תשומות, מס הכנסה, הוצאות, דיווחים, מקצועות שחייבים עוסק מורשה ושינוי סיווג.',
  alternates: { canonical: PAGE_PATH },
  openGraph: {
    title: 'עוסק פטור או עוסק מורשה? ההבדלים שחשוב להכיר',
    description:
      'השוואה מעשית בין שני סיווגי המע״מ — בלי לבלבל בין מחזור, רווח, הוצאות ומס תשומות.',
    url: PAGE_PATH,
    type: 'article',
    locale: 'he_IL',
    siteName: 'חשבונאי',
    images: ['/opengraph-image'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'עוסק פטור או עוסק מורשה? ההבדלים שחשוב להכיר',
    description: 'מע״מ, מס תשומות, מס הכנסה ודיווחים — השוואה מעשית לפני בחירת סיווג.',
    images: ['/opengraph-image'],
  },
};

const comparisonRows = [
  {
    topic: 'המשמעות של הסיווג',
    exempt: 'סיווג במע״מ שמאפשר, בכפוף לתנאים, לא לגבות מע״מ מהלקוחות.',
    authorized: 'סיווג במע״מ שבו גובים מע״מ בעסקאות חייבות ומדווחים עליו לרשות המסים.',
  },
  {
    topic: 'מחזור עסקאות',
    exempt: 'אפשרי רק כשהמחזור עומד בתקרה התקפה וביתר תנאי הרישום.',
    authorized: 'אינו כפוף לתקרת עוסק פטור; עשוי להיות חובה בגלל המחזור או סוג העיסוק.',
  },
  {
    topic: 'מע״מ מהלקוחות',
    exempt: 'לא גובה מע״מ על עסקאותיו כעוסק פטור.',
    authorized: 'גובה מע״מ בעסקאות חייבות בהתאם לדין.',
  },
  {
    topic: 'מס תשומות על רכישות',
    exempt: 'אינו רשאי לנכות מס תשומות.',
    authorized: 'עשוי לנכות מס תשומות כשמתקיימים תנאי הדין ויש מסמך מתאים; לא כל רכישה מזכה.',
  },
  {
    topic: 'דיווח למע״מ',
    exempt: 'מגיש הצהרה על מחזור העסקאות של השנה שחלפה.',
    authorized: 'מגיש דוחות תקופתיים לפי תקופת הדיווח שנקבעה לו.',
  },
  {
    topic: 'מס הכנסה',
    exempt: 'אין פטור אוטומטי. המס נבחן לפי ההכנסה החייבת והנסיבות האישיות.',
    authorized: 'אותו עיקרון: הסיווג במע״מ אינו קובע לבדו את מס ההכנסה.',
  },
  {
    topic: 'ביטוח לאומי',
    exempt: 'המעמד והחיוב נבדקים בנפרד מול הביטוח הלאומי.',
    authorized: 'המעמד והחיוב נבדקים בנפרד מול הביטוח הלאומי.',
  },
] as const;

const faqItems = [
  {
    question: 'מה ההבדל העיקרי בין עוסק פטור לעוסק מורשה?',
    answer:
      'ההבדל העיקרי הוא ההתנהלות במע״מ. עוסק פטור אינו גובה מע״מ ואינו מנכה מס תשומות; עוסק מורשה גובה מע״מ בעסקאות חייבות ועשוי לנכות מס תשומות לפי התנאים. הפטור אינו פטור ממס הכנסה או מביטוח לאומי.',
  },
  {
    question: 'האם עוסק פטור יכול לנכות הוצאות?',
    answer:
      'יש להפריד בין הוצאה לצורכי מס הכנסה לבין מס התשומות הכלול בה. סיווג עוסק פטור שולל ניכוי מס תשומות, אבל אינו קובע לבדו אם ההוצאה מותרת בניכוי לצורכי מס הכנסה. גם במס הכנסה חלים תנאים, ובמסלול בעל עסק זעיר מנגנון ההוצאות שונה.',
  },
  {
    question: 'האם עוסק מורשה תמיד משתלם יותר כשיש הוצאות?',
    answer:
      'לא. יש לבדוק אילו רכישות מזכות בניכוי מס תשומות, מי הלקוחות, מהו המחיר הסופי שניתן לגבות ומהן עלויות הדיווח והניהול. עצם קיומה של הוצאה אינו מבטיח ניכוי מלא ואינו מכריע את הבחירה.',
  },
  {
    question: 'האם כל עסק קטן יכול להירשם כעוסק פטור?',
    answer:
      'לא. לצד מגבלת המחזור, תקנה 13 לתקנות מע״מ (רישום) מונה עיסוקים שחייבים להירשם כעוסק מורשה. יש לבדוק את הפעילות המדויקת ולא להסתפק בשם כללי של המקצוע.',
  },
  {
    question: 'מה עושים כשהמחזור של עוסק פטור מתקרב לתקרה?',
    answer:
      'עוקבים אחר מחזור העסקאות בפועל ואחר עסקאות צפויות, ופונים לרשות המסים או למייצג לפני שינוי אופן הוצאת המסמכים או גביית המע״מ. שינוי הסיווג אינו רק שינוי בשם העסק.',
  },
  {
    question: 'האם בעל עסק זעיר הוא אותו דבר כמו עוסק פטור?',
    answer:
      'לא. עוסק פטור ועוסק מורשה הם סיווגים במע״מ. בעל עסק זעיר הוא מסלול במס הכנסה, ובכפוף לתנאים יכול להשתייך אליו גם עוסק פטור וגם עוסק מורשה שמחזורו עומד בתקרה הרלוונטית.',
  },
];

function SourceRef({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-gold underline decoration-gold/40 underline-offset-4 hover:text-gold-2"
    >
      {children} ↗
    </a>
  );
}

export default function OsekPaturVsMurshePage() {
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'עוסק פטור או עוסק מורשה? ההבדלים שחשוב להכיר',
    description:
      'השוואה מעשית בין סיווג עוסק פטור לסיווג עוסק מורשה במע״מ, והפרדה בין מע״מ, מס הכנסה וביטוח לאומי.',
    inLanguage: 'he-IL',
    datePublished: '2026-10-01',
    dateModified: '2026-10-01',
    author: {
      '@type': 'Person',
      name: 'אנדרי פלטונוב',
      jobTitle: 'רואה חשבון',
      url: `${SITE_URL}/about`,
    },
    publisher: { '@type': 'Organization', name: 'חשבונאי', url: SITE_URL },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE_URL}${PAGE_PATH}` },
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'דף הבית', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'השוואות', item: `${SITE_URL}/compare` },
      {
        '@type': 'ListItem',
        position: 3,
        name: 'עוסק פטור מול עוסק מורשה',
        item: `${SITE_URL}${PAGE_PATH}`,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-cream" dir="rtl">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <article className="mx-auto max-w-4xl px-4 py-8 sm:py-12">
        <div className="mb-7">
          <Breadcrumbs
            items={[
              { label: 'דף הבית', href: '/' },
              { label: 'השוואות', href: '/compare' },
              { label: 'עוסק פטור מול עוסק מורשה' },
            ]}
          />
        </div>

        <header className="mb-8 border-b border-ink/15 pb-8">
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.14em] text-gold">
            השוואת סיווגים במע״מ · 2026
          </p>
          <h1 className="mb-4 text-3xl font-bold leading-tight text-ink md:text-5xl">
            עוסק פטור או עוסק מורשה — מה באמת ההבדל?
          </h1>
          <p className="max-w-3xl text-lg leading-relaxed text-ink/75">
            ההחלטה אינה מסתכמת בשאלה מי גובה מע״מ. צריך לבדוק גם את סוג הפעילות, הלקוחות,
            הרכישות, המחיר שאפשר לגבות וחובות הדיווח — בלי לבלבל בין מחזור לרווח ובין הוצאה
            מוכרת למס תשומות.
          </p>
          <p className="mt-4 text-sm text-ink/60">
            מאת אנדרי פלטונוב, רו״ח · עודכן {LAST_UPDATED}
          </p>
        </header>

        <section aria-labelledby="short-answer" className="mb-10 border-r-4 border-gold bg-paper p-6">
          <p className="mb-2 font-mono text-xs uppercase tracking-[0.14em] text-gold">התשובה הקצרה</p>
          <h2 id="short-answer" className="mb-3 text-2xl font-bold text-ink">
            ההבדל המרכזי הוא במע״מ — לא בעצם החבות במס הכנסה
          </h2>
          <p className="leading-relaxed text-ink/80">
            <strong>עוסק פטור</strong> אינו גובה מע״מ מלקוחותיו ואינו רשאי לנכות מס תשומות.
            <strong> עוסק מורשה</strong> גובה מע״מ בעסקאות חייבות ועשוי לנכות מס תשומות לפי תנאי
            הדין. בשני המסלולים עדיין בודקים בנפרד מס הכנסה וביטוח לאומי. האפשרות להירשם כעוסק
            פטור תלויה בתקרת המחזור התקפה ובסוג העיסוק — יש מקצועות שחייבים עוסק מורשה גם במחזור
            נמוך.{' '}
            <SourceRef href={sources.exemptRegistration}>תנאי הרישום ברשות המסים</SourceRef>
          </p>
        </section>

        <section className="mb-12" aria-labelledby="comparison-heading">
          <div className="mb-5">
            <p className="mb-2 font-mono text-xs uppercase tracking-[0.14em] text-gold">שורה מול שורה</p>
            <h2 id="comparison-heading" className="text-2xl font-bold text-ink md:text-3xl">
              טבלת השוואה: עוסק פטור מול עוסק מורשה
            </h2>
          </div>
          <div className="overflow-x-auto border border-ink/15 bg-paper">
            <table className="w-full min-w-[720px] border-collapse text-right text-sm">
              <thead className="bg-ink text-cream">
                <tr>
                  <th scope="col" className="w-1/5 p-4 font-bold">נושא</th>
                  <th scope="col" className="w-2/5 p-4 font-bold">עוסק פטור</th>
                  <th scope="col" className="w-2/5 p-4 font-bold">עוסק מורשה</th>
                </tr>
              </thead>
              <tbody className="text-ink/80">
                {comparisonRows.map((row) => (
                  <tr key={row.topic} className="border-t border-ink/15 even:bg-cream-2/60">
                    <th scope="row" className="p-4 align-top font-bold text-ink">{row.topic}</th>
                    <td className="p-4 align-top leading-relaxed">{row.exempt}</td>
                    <td className="p-4 align-top leading-relaxed">{row.authorized}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-ink/60">
            הטבלה מסכמת את העקרונות בלבד. תנאי ניכוי מס תשומות וחובות הדיווח תלויים בדין ובנתוני
            העסק. ראו גם את{' '}
            <SourceRef href={sources.vatGuide}>מדריך המע״מ הרשמי לעוסק חדש</SourceRef>.
          </p>
        </section>

        <div className="space-y-12 text-ink">
          <section aria-labelledby="taxes-are-different">
            <h2 id="taxes-are-different" className="mb-4 text-2xl font-bold md:text-3xl">
              שלוש מערכות שונות: מע״מ, מס הכנסה וביטוח לאומי
            </h2>
            <div className="space-y-4 leading-relaxed text-ink/75">
              <p>
                המילה “פטור” מטעה: היא מתארת את אופן ההתנהלות במע״מ, לא פטור כולל ממסים.
                עוסק פטור ועוסק מורשה מדווחים למס הכנסה לפי סוג התיק והנסיבות שלהם, והמעמד
                בביטוח הלאומי נבחן לפי כללי הביטוח הלאומי.
              </p>
              <p>
                לכן אין להסיק שסיווג במע״מ קובע כמה מס הכנסה ישולם. מס הכנסה מתבסס על ההכנסה
                החייבת והנתונים האישיים; מע״מ עוסק במס על עסקאות ובניכוי תשומות; הביטוח הלאומי
                קובע מעמד, מקדמות וזכויות לפי כלליו. בעת פתיחת העסק אפשר במקרים המתאימים להעביר
                את פרטי הבקשה גם לביטוח הלאומי.{' '}
                <SourceRef href={sources.nationalInsurance}>פתיחת תיק עצמאי בביטוח הלאומי</SourceRef>
              </p>
            </div>
          </section>

          <section aria-labelledby="expense-vs-input-tax">
            <h2 id="expense-vs-input-tax" className="mb-4 text-2xl font-bold md:text-3xl">
              הוצאה מוכרת אינה אותו דבר כמו מס תשומות
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="border border-ink/15 bg-paper p-5">
                <h3 className="mb-2 text-xl font-bold">הוצאה לצורכי מס הכנסה</h3>
                <p className="leading-relaxed text-ink/75">
                  השאלה היא אם ההוצאה מותרת בניכוי בחישוב ההכנסה החייבת, ובאיזה היקף. זהו בירור
                  לפי כללי מס הכנסה, והוא נפרד מסיווג העסק במע״מ.
                </p>
              </div>
              <div className="border border-ink/15 bg-paper p-5">
                <h3 className="mb-2 text-xl font-bold">מס תשומות לצורכי מע״מ</h3>
                <p className="leading-relaxed text-ink/75">
                  זהו רכיב המע״מ ברכישה. עוסק פטור אינו מנכה אותו. עוסק מורשה עשוי לנכות אותו
                  רק אם מתקיימים התנאים — בין היתר קשר לעסק ומסמך שהוצא כדין. לא כל הוצאה
                  ולא כל רכישה מזכות בניכוי.
                </p>
              </div>
            </div>
            <p className="mt-4 border-r-2 border-gold pr-4 text-sm leading-relaxed text-ink/70">
              לדוגמה, מחשב יכול להיות רלוונטי לפעילות העסקית, אבל מכאן לא נובע אוטומטית שכל מחירו
              יוכר מיד למס הכנסה או שכל המע״מ עליו ניתן לניכוי. אלה שתי בדיקות שונות.
            </p>
          </section>

          <section aria-labelledby="decision-factors">
            <h2 id="decision-factors" className="mb-4 text-2xl font-bold md:text-3xl">
              אילו נתונים כדאי לבדוק לפני שבוחרים?
            </h2>
            <ol className="grid gap-4 sm:grid-cols-2">
              {[
                ['סוג העיסוק', 'האם הפעילות נכללת בעיסוקים שחייבים רישום כעוסק מורשה לפי תקנה 13?'],
                ['מחזור צפוי', 'האם המחזור השנתי הצפוי עומד בתקרת עוסק פטור, ומה מרווח הביטחון מול התקרה?'],
                ['סוג הלקוחות', 'האם הלקוחות פרטיים או עסקים, והאם מבחינתם המחיר כולל המע״מ הוא הנתון החשוב?'],
                ['מבנה הרכישות', 'איזה חלק מהרכישות כולל מע״מ שעשוי להיות בר־ניכוי, ולא רק כמה העסק מוציא בסך הכול?'],
                ['תמחור', 'האם ניתן להוסיף מע״מ למחיר או שהמחיר הסופי בשוק קבוע וייאלץ לכלול אותו?'],
                ['ניהול ודיווח', 'האם העסק ערוך להפקת מסמכים נכונים, דיווחים תקופתיים ומעקב תזרימי?'],
              ].map(([title, text], index) => (
                <li key={title} className="flex gap-4 border border-ink/15 bg-paper p-5">
                  <span className="font-mono text-sm font-bold text-gold" aria-hidden>
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h3 className="mb-1 text-lg font-bold">{title}</h3>
                    <p className="text-sm leading-relaxed text-ink/70">{text}</p>
                  </div>
                </li>
              ))}
            </ol>
            <p className="mt-5 leading-relaxed text-ink/75">
              לא מתחילים מהשאלה “מה משתלם לכולם”, אלא מתחזית של העסק המסוים. למיפוי השלבים
              המלאים ראו את{' '}
              <Link href="/self-employed/opening-business" className="font-semibold text-gold underline underline-offset-4">
                מדריך פתיחת העסק
              </Link>
              . למעקב אחר מחזור בפועל וצפי להמשך השנה עברו ל
              <Link href="/self-employed/vat-threshold" className="font-semibold text-gold underline underline-offset-4">
                מדריך תקרת עוסק פטור
              </Link>
              .
            </p>
          </section>

          <section aria-labelledby="regulated-professions" className="bg-cream-2 p-6 sm:p-8">
            <p className="mb-2 font-mono text-xs uppercase tracking-[0.14em] text-gold">חריג שחייב לבדוק</p>
            <h2 id="regulated-professions" className="mb-3 text-2xl font-bold md:text-3xl">
              יש עיסוקים שחייבים להירשם כעוסק מורשה
            </h2>
            <p className="leading-relaxed text-ink/75">
              עמידה בתקרת המחזור אינה מספיקה. תקנה 13 לתקנות מס ערך מוסף (רישום) מונה סוגי
              עיסוק שחייבים רישום כעוסק מורשה; דף השירות של רשות המסים מציין כדוגמאות מקצועות
              חופשיים ובהם עורכי דין ורואי חשבון. הרשימה המשפטית והגדרת הפעילות הן שקובעות, לכן
              כדאי לבדוק את העיסוק המדויק לפני ההרשמה ולא להסתמך על כותרת מקצוע כללית.{' '}
              <SourceRef href={sources.exemptRegistration}>בדיקת תנאי עוסק פטור</SourceRef>
            </p>
          </section>

          <section aria-labelledby="examples">
            <h2 id="examples" className="mb-4 text-2xl font-bold md:text-3xl">
              שלוש דוגמאות שממחישות את השיקולים — בלי תשובה אוטומטית
            </h2>
            <div className="space-y-4">
              <div className="border border-ink/15 bg-paper p-5">
                <h3 className="mb-2 text-lg font-bold">נותנת שירות ללקוחות עסקיים</h3>
                <p className="leading-relaxed text-ink/70">
                  צריך לבדוק קודם אם העיסוק מאפשר רישום כעוסק פטור. אחר כך בודקים אם הלקוחות
                  עשויים לנכות מס תשומות, אם המחיר מסוכם לפני או אחרי מע״מ ואילו רכישות עסקיות
                  קיימות. העובדה שהלקוחות הם עסקים היא שיקול — לא הכרעה.
                </p>
              </div>
              <div className="border border-ink/15 bg-paper p-5">
                <h3 className="mb-2 text-lg font-bold">יוצר שמוכר בעיקר לקהל פרטי</h3>
                <p className="leading-relaxed text-ink/70">
                  הלקוח הפרטי מסתכל בדרך כלל על המחיר הסופי ואינו מנכה מס תשומות. לכן חשוב לבדוק
                  אם מעבר לעוסק מורשה יאפשר להוסיף מע״מ למחיר או יחייב לספוג אותו בתוך המחיר.
                  במקביל בודקים את היקף הרכישות ואת הצפי למחזור.
                </p>
              </div>
              <div className="border border-ink/15 bg-paper p-5">
                <h3 className="mb-2 text-lg font-bold">צלמת שרוכשת ציוד בתחילת הדרך</h3>
                <p className="leading-relaxed text-ink/70">
                  ציוד עתיר מע״מ עשוי להפוך את ניכוי התשומות לשיקול משמעותי, אבל יש לבדוק אם
                  הרכישות אכן מזכות בניכוי, מהו תמהיל הלקוחות ומה המחיר שניתן לגבות. לא נכון
                  להשוות רק את סכום הקניות.
                </p>
              </div>
            </div>
          </section>

          <section aria-labelledby="change-status">
            <h2 id="change-status" className="mb-4 text-2xl font-bold md:text-3xl">
              שינוי סיווג: לא מחכים לרגע האחרון ולא משנים מסמכים לבד
            </h2>
            <div className="space-y-4 leading-relaxed text-ink/75">
              <p>
                אם המחזור מתקרב לתקרה, סוג הפעילות השתנה או שהתברר שתנאי הרישום אינם מתקיימים,
                יש לפנות לרשות המסים או למייצג ולברר את מועד שינוי הסיווג ואת הטיפול בעסקאות
                ובמסמכים. אל תניחו לבד מאיזה מועד משתנים גביית המע״מ והמסמכים שמפיק העסק — המועד
                והטיפול תלויים בנסיבות ובהנחיות מע״מ.
              </p>
              <p>
                גם מעבר מעוסק מורשה לעוסק פטור אינו שינוי שמבצעים עצמאית במערכת החשבוניות; הוא
                מחייב בדיקת תנאים וטיפול מול מע״מ. נקודת ההתחלה היא תיעוד מסודר של המחזור
                והפעילות, ובדיקה מול המשרד האזורי או מייצג.
              </p>
              <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm">
                <SourceRef href={sources.exemptDeclaration}>הצהרת מחזור לעוסק פטור</SourceRef>
                <SourceRef href={sources.authorizedRegistration}>שירות פתיחת תיק עוסק מורשה</SourceRef>
              </div>
            </div>
          </section>

          <section aria-labelledby="micro-business" className="border-y border-ink/15 py-8">
            <h2 id="micro-business" className="mb-4 text-2xl font-bold md:text-3xl">
              עוסק פטור אינו “בעל עסק זעיר”
            </h2>
            <div className="space-y-4 leading-relaxed text-ink/75">
              <p>
                <strong>עוסק פטור ועוסק מורשה</strong> הם סיווגים במע״מ. <strong>בעל עסק זעיר</strong>{' '}
                הוא מסלול במס הכנסה שנועד לפשט את חישוב ההוצאות והדיווח למי שעומד בתנאיו. לפי
                חומרי רשות המסים, גם עוסק פטור וגם עוסק מורשה יכולים להירשם למסלול כשהם עומדים
                בתקרת המחזור וביתר התנאים.
              </p>
              <p>
                במסלול בעל עסק זעיר ההכנסה החייבת מחושבת באמצעות ניכוי הוצאות נורמטיבי בשיעור
                30% מהמחזור במקום דרישת הוצאות בפועל. זה אינו משנה את סיווג המע״מ: עוסק פטור
                עדיין אינו מנכה מס תשומות, ועוסק מורשה ממשיך לפעול לפי כללי המע״מ החלים עליו.{' '}
                <SourceRef href={sources.microBusiness}>רשות המסים — רפורמת בעל עסק זעיר, יוני 2026</SourceRef>
              </p>
            </div>
          </section>
        </div>

        <CourseCTA path={PAGE_PATH} placement="comparison" />

        <section className="mb-12" aria-labelledby="faq-heading">
          <h2 id="faq-heading" className="mb-6 text-2xl font-bold text-ink md:text-3xl">שאלות נפוצות</h2>
          <div className="space-y-4">
            {faqItems.map((item) => (
              <details key={item.question} className="group border border-ink/15 bg-paper p-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-bold text-ink">
                  {item.question}
                  <span aria-hidden className="text-gold transition group-open:rotate-180">▾</span>
                </summary>
                <p className="mt-3 leading-relaxed text-ink/70">{item.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="mb-10" aria-labelledby="next-step-heading">
          <h2 id="next-step-heading" className="mb-4 text-2xl font-bold text-ink">הצעד הבא</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <Link href="/self-employed/opening-business" className="group border border-ink/15 bg-paper p-5 transition hover:bg-paper-hover hover:shadow-sm">
              <span className="block font-bold text-ink transition group-hover:text-gold">מדריך פתיחת עסק</span>
              <span className="mt-1 block text-sm leading-relaxed text-ink/60">רישום, מסמכים וצ׳קליסט לתחילת הפעילות</span>
            </Link>
            <Link href="/self-employed/vat-threshold" className="group border border-ink/15 bg-paper p-5 transition hover:bg-paper-hover hover:shadow-sm">
              <span className="block font-bold text-ink transition group-hover:text-gold">תקרת עוסק פטור</span>
              <span className="mt-1 block text-sm leading-relaxed text-ink/60">הסכום המעודכן ומעקב אחר המחזור</span>
            </Link>
          </div>
        </section>

        <section className="mb-10 text-sm" aria-labelledby="sources-heading">
          <h2 id="sources-heading" className="mb-3 text-xl font-bold text-ink">מקורות רשמיים</h2>
          <p className="mb-4 leading-relaxed text-ink/60">
            המקורות נבדקו ב־{LAST_UPDATED}. דפי הרשויות והוראות הדין עשויים להתעדכן.
          </p>
          <ol className="list-decimal space-y-3 pr-5 leading-relaxed text-ink/75">
            <li><SourceRef href={sources.exemptRegistration}>רשות המסים — בקשה לפתיחת תיק עוסק פטור ותנאי הרישום</SourceRef></li>
            <li><SourceRef href={sources.exemptDeclaration}>רשות המסים — הצהרת עוסק פטור</SourceRef></li>
            <li><SourceRef href={sources.authorizedRegistration}>רשות המסים — בקשה לפתיחת תיק עוסק מורשה (טופס 821)</SourceRef></li>
            <li><SourceRef href={sources.vatGuide}>רשות המסים — מדריך מע״מ לעוסק חדש</SourceRef></li>
            <li><SourceRef href={sources.microBusiness}>רשות המסים — רפורמת בעל עסק זעיר, יוני 2026</SourceRef></li>
            <li><SourceRef href={sources.nationalInsurance}>הביטוח הלאומי — פתיחת תיק עצמאי</SourceRef></li>
          </ol>
        </section>

        <section className="mb-8">
          <DisclaimerBox text="המידע בעמוד הוא מידע כללי ואינו ייעוץ מס או ייעוץ משפטי. סיווג נכון תלוי במחזור, בסוג הפעילות, בעסקאות ובנסיבות האישיות. לפני רישום או שינוי סיווג יש לבדוק את הוראות הדין והשירותים המעודכנים מול רשות המסים או מייצג מוסמך." />
        </section>

        <section>
          <AuthorBox />
        </section>
      </article>
    </div>
  );
}
