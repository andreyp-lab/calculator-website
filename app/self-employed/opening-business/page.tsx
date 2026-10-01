import type { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/calculator/Breadcrumbs';
import { AuthorBox } from '@/components/calculator/AuthorBox';
import { DisclaimerBox } from '@/components/calculator/DisclaimerBox';
import { CourseCTA } from '@/components/marketing/CourseCTA';
import { VAT_2026 } from '@/lib/constants/tax-2026';

const PAGE_PATH = '/self-employed/opening-business';
const SITE_URL = 'https://cheshbonai.co.il';
const VAT_THRESHOLD = VAT_2026.smallBusinessThreshold.toLocaleString('he-IL');
const VAT_RATE_PERCENT = `${VAT_2026.standard * 100}%`;
const VAT_EXAMPLE_BASE = 10_000;
const VAT_EXAMPLE_TAX = VAT_EXAMPLE_BASE * VAT_2026.standard;
const VAT_EXAMPLE_TOTAL = VAT_EXAMPLE_BASE + VAT_EXAMPLE_TAX;
const EXEMPT_REGISTRATION = 'https://www.gov.il/he/service/request-open-exempt-dealer-via-internet';
const LICENSED_REGISTRATION = 'https://www.gov.il/he/service/vat-821';
const NATIONAL_INSURANCE_REGISTRATION =
  'https://www.btl.gov.il/Insurance/National%20Insurance/type_list/Self_Employed/Pages/howtoregister.aspx';

export const metadata: Metadata = {
  title: { absolute: 'פתיחת עסק עצמאי ב-2026: עוסק פטור או מורשה' },
  description:
    'איך לפתוח עוסק פטור או עוסק מורשה ב-2026: בחירת סיווג, מסמכים, רישום במע״מ, מס הכנסה וביטוח לאומי, תקרת המחזור וצ׳קליסט מעשי.',
  alternates: { canonical: PAGE_PATH },
  openGraph: {
    // OG image לא מתפשט מ-app/opengraph-image.tsx לדפים שמגדירים openGraph משלהם.
    images: ['/opengraph-image'],
    title: 'פתיחת עסק עצמאי ב-2026: עוסק פטור או מורשה',
    description:
      'מדריך מעשי לפתיחת עוסק פטור או מורשה: איך לבחור סיווג, אילו מסמכים להכין ואיך להירשם ברשויות.',
    type: 'article',
    locale: 'he_IL',
  },
};

const faqItems = [
  {
    question: 'מה ההבדל בין עוסק פטור לעוסק מורשה?',
    answer:
      'עוסק פטור הוא סיווג במע״מ לעסק העומד בתקרת המחזור ובשאר תנאי הרישום. הוא אינו גובה מע״מ ואינו מנכה מס תשומות. עוסק מורשה גובה מע״מ בעסקאות החייבות, ועשוי לנכות מס תשומות לפי תנאי הדין. מס הכנסה ודמי ביטוח נבדקים בנפרד לפי ההכנסה והמעמד האישי.',
  },
  {
    question: 'כמה עולה לפתוח עוסק פטור או עוסק מורשה?',
    answer:
      'שירות פתיחת תיק עוסק פטור המקוון של רשות המסים ניתן ללא עלות. עלויות ספקים, ציוד וביטוחים תלויות בפעילות ובבחירות שלכם. במדריך עלויות פתיחת עסק באתר מפורטים הרכיבים שיש לאסוף עבור תקציב אישי.',
  },
  {
    question: 'מהי תקרת עוסק פטור ב-2026?',
    answer: `תקרת מחזור העסקאות הצפוי לפתיחת עוסק פטור ב-2026 היא ${VAT_THRESHOLD} ₪. התקרה מתייחסת למחזור העסקאות ולא לרווח לאחר הוצאות. אם המחזור בפועל גבוה מהסכום הקובע, יש לפנות למשרד מע״מ האזורי לשינוי הסיווג.`,
  },
  {
    question: 'איך פותחים עסק בישראל?',
    answer:
      'בוחרים סיווג מתאים, נרשמים במע״מ ובמס הכנסה ומסדירים את המעמד בביטוח הלאומי. בשירות המקוון לפתיחת עוסק פטור מזינים נתונים שלפיהם נקבע אם צריך לפתוח גם תיק בביטוח הלאומי; אם כן, הבקשה מועברת אליו אוטומטית. לעוסק מורשה יש מסלול רישום נפרד ברשות המסים.',
  },
  {
    question: 'האם כדאי להיות עוסק פטור?',
    answer:
      'עוסק פטור אפשרי אם המחזור הצפוי אינו עולה על התקרה לשנת 2026 והעיסוק אינו נמנה עם אלה שחייבים ברישום כעוסק מורשה. כדאי להשוות גם מחירי מכירה, סוג הלקוחות, רכישות שעשויות לזכות בניכוי תשומות ועלויות ניהול.',
  },
  {
    question: 'מתי כדאי לפתוח עוסק מורשה במקום פטור?',
    answer:
      'יש להירשם כעוסק מורשה כשהמחזור הצפוי עולה על תקרת עוסק פטור או כשהעיסוק מחייב זאת לפי תקנה 13 לתקנות מע"מ (רישום). מתחת לתקרה, כדאי לבחון באופן אישי אם רישום כעוסק מורשה מתאים, בלי להניח שכל הוצאה מזכה בניכוי מע"מ.',
  },
  {
    question: 'עוסק פטור משלם מס הכנסה?',
    answer:
      'הפטור הוא לעניין גביית מע"מ בלבד. מס הכנסה ודמי ביטוח נבדקים לפי ההכנסה והמעמד האישי. חובת הדיווח למס הכנסה תלויה בסוג התיק ובנסיבות; מי שהוכר כבעל עסק זעיר ועומד בתנאי המסלול עשוי להגיש דיווח שנתי מקוצר במקום דוח שנתי רגיל.',
  },
  {
    question: 'איזה טופס ממלאים כדי לפתוח תיק במע"מ?',
    answer:
      'לעוסק מורשה קיים שירות רשות המסים להגשת טופס 821, ולעוסק פטור שירות פתיחת תיק מקוון. המסמכים ואופן ההגשה מפורטים בדפי השירות הרשמיים, ויש לבדוק את תנאי המסלול המתאים לפני הגשת הבקשה.',
  },
];

export default function OpeningBusinessPage() {
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'פתיחת עסק עצמאי בישראל ב-2026 — עוסק פטור או עוסק מורשה',
    description: `מדריך מעשי לפתיחת עסק עצמאי בישראל ב-2026: עוסק פטור מול מורשה, תקרת ${VAT_THRESHOLD} ₪, רישום מול הרשויות וצ׳קליסט.`,
    inLanguage: 'he-IL',
    datePublished: '2026-06-01',
    dateModified: '2026-10-01',
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
    <div className="min-h-screen bg-paper" dir="rtl">
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
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-gold mb-3">
            המדריך המלא לעצמאים · 2026
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-ink mb-3">
            פתיחת עסק עצמאי בישראל ב-2026 — עוסק פטור או עוסק מורשה?
          </h1>
          <p className="text-lg text-ink/70 leading-relaxed">
            רוצים לפתוח עוסק פטור או עוסק מורשה? כאן תמצאו את ההחלטה שצריך לקבל לפני ההגשה,
            את המסמכים והקישורים הרשמיים, את סדר הרישום במע״מ, במס הכנסה ובביטוח הלאומי,
            וצ׳קליסט מסודר ליום שאחרי הפתיחה.
          </p>
          <p className="text-sm text-ink/70 mt-3">
            נכתב על ידי אנדרי פלטונוב, רו"ח · עודכן ל-2026
          </p>
        </header>

        {/* Quick answer */}
        <div className="border border-ink/15 bg-cream-2 p-5 mb-8">
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-gold mb-2">בקצרה</p>
          <p className="text-ink/80 leading-relaxed text-sm">
            לפני שממלאים טופס, בדקו שני תנאי סף: האם מחזור העסקאות השנתי הצפוי גבוה מ-
            <strong>{VAT_THRESHOLD} ₪</strong>, והאם סוג העיסוק מחייב רישום כעוסק מורשה. אם לא,
            אפשר לבחון עוסק פטור מול מורשה לפי סוג הלקוחות, המחיר וההוצאות. לאחר הבחירה מסדירים
            מע״מ, מס הכנסה וביטוח לאומי; חברה בע״מ היא החלטת התאגדות נפרדת.
          </p>
        </div>

        <section className="mb-10" aria-labelledby="choose-opening-route">
          <h2 id="choose-opening-route" className="text-2xl font-bold text-ink mb-4">
            לאיזה מסלול הגעתם?
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="border border-ink/15 bg-cream-2 p-5">
              <h3 className="font-bold text-ink mb-2">פתיחת עוסק פטור</h3>
              <p className="text-sm leading-relaxed text-ink/70 mb-3">
                המחזור הצפוי עד התקרה והעיסוק אינו מחייב עוסק מורשה? בדקו את תנאי השירות והגישו
                בקשה מקוונת לפתיחת תיק במע״מ ובמס הכנסה.
              </p>
              <a href={EXEMPT_REGISTRATION} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-gold underline">
                לשירות הרשמי ברשות המסים ↗
              </a>
            </div>
            <div className="border border-ink/15 bg-cream-2 p-5">
              <h3 className="font-bold text-ink mb-2">פתיחת עוסק מורשה</h3>
              <p className="text-sm leading-relaxed text-ink/70 mb-3">
                המחזור צפוי לעבור את התקרה או שהעיסוק נכלל בתקנה 13? עברו למסלול טופס 821 והכינו
                את המסמכים המפורטים בדף השירות.
              </p>
              <a href={LICENSED_REGISTRATION} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-gold underline">
                לטופס 821 ולהוראות ההגשה ↗
              </a>
            </div>
            <div className="border border-ink/15 bg-cream-2 p-5">
              <h3 className="font-bold text-ink mb-2">עדיין לא בטוחים</h3>
              <p className="text-sm leading-relaxed text-ink/70 mb-3">
                התחילו מתקרת המחזור ומהמקצוע, ואז השוו את השפעת המע״מ על מחיר המכירה, התשומות
                וההתנהלות השוטפת.
              </p>
              <Link href="/compare/osek-patur-vs-murshe" className="text-sm font-semibold text-gold underline">
                להשוואת עוסק פטור מול מורשה ←
              </Link>
            </div>
          </div>
        </section>

        <div className="prose prose-lg max-w-none text-ink leading-relaxed">
          <h2>שלושת הרישומים שצריך להסדיר</h2>
          <ol>
            <li>
              <strong>פתיחת תיק במע"מ</strong> — בחירת סיווג: עוסק פטור או עוסק מורשה. זהו הצעד
              שקובע את אופן ההתנהלות מול רשות המסים.
            </li>
            <li>
              <strong>פתיחת תיק במס הכנסה</strong> — דיווח על תחילת פעילות ובדיקת חובות הדיווח
              והמקדמות לפי סוג התיק.
            </li>
            <li>
              <strong>בדיקת מעמד בביטוח הלאומי</strong> — החיוב והזכויות תלויים בהיקף העבודה,
              בהכנסה ובמעמד שנקבע. בתהליך הדיגיטלי אפשר לבקש גם פתיחת תיק בביטוח הלאומי;
              אם כבר נפתח תיק ברשות המסים, משתמשים במסלול הדיווח של הביטוח הלאומי.
            </li>
          </ol>
          <p>
            בדקו את אופן הרישום בכל מסלול באתר הרשות המתאימה. בהמשך המדריך — פירוט של כל
            שלב, כולל טפסים ומסמכים. לפני כן, נעצור בהחלטה שמשפיעה על כל ההתנהלות
            הכספית שלכם: <strong>איזה סוג עוסק להיות</strong>.
          </p>

          <h2>עוסק פטור — למי זה מתאים?</h2>
          <p>
            <strong>עוסק פטור</strong> הוא סיווג במע״מ לעוסק שמחזור העסקאות הצפוי שלו אינו עולה על{' '}
            <strong>{VAT_THRESHOLD} ₪ (2026)</strong> ושעיסוקו אינו מחייב רישום כעוסק מורשה.
            הוא אינו גובה מע״מ בעסקאותיו, אינו מגיש דוחות מע״מ תקופתיים ואינו מנכה מס תשומות;
            במקום זאת הוא מגיש הצהרת מחזור שנתית.
          </p>
          <p>
            חשוב להבין: "פטור" מתייחס <strong>רק למע"מ</strong>. עוסק פטור עדיין משלם מס הכנסה
            ודמי ביטוח לפי הכנסתו ומעמדו. סוג הדיווח למס הכנסה תלוי בסוג התיק ובנסיבות.
          </p>
          <p>
            שימו לב שהתקרה נמדדת לפי <strong>מחזור העסקאות</strong>, לא לפי רווח. עסק עם
            מחזור של 130,000 ₪ ורווח של 40,000 ₪ — כבר מעבר לתקרה, ולכן יש לפנות למע״מ לשינוי
            הסיווג. אם
            אתם מתקרבים לתקרה, מומלץ להיערך מראש —{' '}
            <Link href="/self-employed/vat-threshold">מדריך תקרת עוסק פטור</Link> מסביר כיצד
            להשוות את המחזור לתקרה ולהיערך לבדיקת הסיווג.
          </p>
          <p>
            רוצים השוואה ממוקדת לפני ההחלטה? עברו ל
            <Link href="/compare/osek-patur-vs-murshe">עוסק פטור מול עוסק מורשה</Link>, כולל
            שאלות שכדאי להביא לרואה החשבון.
          </p>

          <h2>עוסק מורשה — למי זה מתאים?</h2>
          <p>
            <strong>עוסק מורשה</strong> גובה מע"מ בשיעור <strong>{VAT_RATE_PERCENT}</strong> מלקוחותיו, מעביר
            אותו לרשות המסים, ועשוי לנכות מע״מ תשומות על הוצאות לפי תנאי הדין. הוא מדווח למע״מ
            לפי תקופת הדיווח שנקבעה לו. עוסק מורשה נדרש כאשר המחזור עובר {VAT_THRESHOLD} ₪, וגם במקצועות מסוימים
            ללא קשר למחזור.
          </p>
          <p>
            לקוח עסקי עשוי להיות זכאי לנכות מע"מ תשומות, בכפוף לסוג העסקה, לחשבונית תקינה
            ולכללי הניכוי. לקוח פרטי אינו מנכה מע"מ תשומות. השפעת המע"מ על מחיר השוק ועל הרווח
            תלויה במחיר הכולל שמסכימים עליו ובסוג הלקוחות.
          </p>
          <p>
            <strong>דוגמה מספרית:</strong> נניח ששני מעצבים גובים {VAT_EXAMPLE_BASE.toLocaleString('he-IL')} ₪ על פרויקט. העוסק הפטור
            מפיק קבלה על {VAT_EXAMPLE_BASE.toLocaleString('he-IL')} ₪ — זה המחיר הסופי. העוסק המורשה מפיק חשבונית מס על אותו בסיס בתוספת
            מע"מ {VAT_RATE_PERCENT}, כלומר {VAT_EXAMPLE_TOTAL.toLocaleString('he-IL')} ₪. לקוח <strong>פרטי</strong> ישלם למורשה {VAT_EXAMPLE_TAX.toLocaleString('he-IL')} ₪ יותר על אותה
            עבודה רק אם שני בעלי העסק קובעים אותו מחיר בסיס. לקוח <strong>עסקי</strong> עשוי לנכות
            את מע"מ התשומות אם מתקיימים כל התנאים, אך אין בכך קיזוז אוטומטי בכל עסקה. זהות
            הלקוחות היא שיקול אחד לצד מחיר, סוג העסקאות וההוצאות. לחישוב החשבוני —{' '}
            <Link href="/self-employed/vat">מחשבון המע"מ</Link> באתר.
          </p>

          <h2>ומה עם חברה בע"מ?</h2>
          <p>
            האפשרות השלישית היא <strong>חברה בע"מ</strong> — ישות משפטית נפרדת שנרשמת ברשם החברות
            (בתשלום אגרה, בניגוד לרישום עוסק שהוא חינמי). לחברה יתרונות של הפרדה בין הנכסים
            האישיים לעסקיים ותכנון מס גמיש יותר ברווחים גבוהים: החברה משלמת מס חברות על הרווח,
            ובעל המניות עשוי לשלם מס נוסף לפי דרך המשיכה והכללים החלים. מנגד — עלויות ההקמה והתפעול גבוהות
            משמעותית: הנהלת חשבונות כפולה, דוחות מבוקרים על ידי רו"ח ואגרה שנתית.
          </p>
          <p>
            סוג ההתאגדות המתאים תלוי בנתוני הפעילות, המשיכות, הבעלות והסיכון המשפטי. לבחינת השיקולים:{' '}
            <Link href="/self-employed/corporation-vs-individual">מדריך חברה בע"מ מול עוסק</Link>{' '}
            והמדריך המורחב{' '}
            <Link href="/blog/company-vs-self-employed-ultimate-guide">
              חברה בע"מ או עצמאי — המדריך האולטימטיבי
            </Link>
            .
          </p>

          <h2>עוסק פטור מול עוסק מורשה מול חברה בע"מ — טבלת השוואה</h2>
        </div>

        {/* Comparison table */}
        <div className="overflow-x-auto my-6 not-prose">
          <table className="w-full text-sm border border-ink/15 overflow-hidden">
            <thead className="bg-cream-2">
              <tr className="text-right">
                <th className="p-3 font-bold text-ink border-b border-ink/15">קריטריון</th>
                <th className="p-3 font-bold text-gold border-b border-ink/15">עוסק פטור</th>
                <th className="p-3 font-bold text-emerald-800 border-b border-ink/15">עוסק מורשה</th>
                <th className="p-3 font-bold text-ink border-b border-ink/15">חברה בע"מ</th>
              </tr>
            </thead>
            <tbody className="text-ink/70">
              <tr>
                <td className="p-3 border-b border-ink/15 font-medium">תקרת מחזור</td>
                <td className="p-3 border-b border-ink/15">עד {VAT_THRESHOLD} ₪/שנה</td>
                <td className="p-3 border-b border-ink/15">ללא הגבלה</td>
                <td className="p-3 border-b border-ink/15">ללא הגבלה</td>
              </tr>
              <tr className="bg-cream-2/50">
                <td className="p-3 border-b border-ink/15 font-medium">גביית מע"מ</td>
                <td className="p-3 border-b border-ink/15">לא גובה</td>
                <td className="p-3 border-b border-ink/15">גובה {VAT_RATE_PERCENT}</td>
                <td className="p-3 border-b border-ink/15">גובה {VAT_RATE_PERCENT}</td>
              </tr>
              <tr>
                <td className="p-3 border-b border-ink/15 font-medium">קיזוז מע"מ תשומות</td>
                <td className="p-3 border-b border-ink/15">לא</td>
                <td className="p-3 border-b border-ink/15">בכפוף לכללי הניכוי</td>
                <td className="p-3 border-b border-ink/15">בכפוף לכללי הניכוי</td>
              </tr>
              <tr className="bg-cream-2/50">
                <td className="p-3 border-b border-ink/15 font-medium">דיווח מע"מ</td>
                <td className="p-3 border-b border-ink/15">הצהרת מחזור שנתית למע״מ</td>
                <td className="p-3 border-b border-ink/15">לפי תקופת הדיווח שנקבעה</td>
                <td className="p-3 border-b border-ink/15">לפי תקופת הדיווח שנקבעה</td>
              </tr>
              <tr>
                <td className="p-3 border-b border-ink/15 font-medium">מיסוי הרווח</td>
                <td className="p-3 border-b border-ink/15">מדרגות מס הכנסה אישיות</td>
                <td className="p-3 border-b border-ink/15">מדרגות מס הכנסה אישיות</td>
                <td className="p-3 border-b border-ink/15">מס חברות, ומס דיבידנד במשיכה</td>
              </tr>
              <tr className="bg-cream-2/50">
                <td className="p-3 border-b border-ink/15 font-medium">עלות הקמה</td>
                <td className="p-3 border-b border-ink/15">חינם</td>
                <td className="p-3 border-b border-ink/15">חינם</td>
                <td className="p-3 border-b border-ink/15">אגרת רישום ברשם החברות + ליווי משפטי</td>
              </tr>
              <tr>
                <td className="p-3 border-b border-ink/15 font-medium">הנהלת חשבונות</td>
                <td className="p-3 border-b border-ink/15">פשוטה מאוד</td>
                <td className="p-3 border-b border-ink/15">חד-צדית ברוב העסקים הקטנים</td>
                <td className="p-3 border-b border-ink/15">כפולה + דוחות מבוקרים</td>
              </tr>
              <tr className="bg-cream-2/50">
                <td className="p-3 border-b border-ink/15 font-medium">הגנה משפטית (הפרדת נכסים)</td>
                <td className="p-3 border-b border-ink/15">אין</td>
                <td className="p-3 border-b border-ink/15">אין</td>
                <td className="p-3 border-b border-ink/15">יש (אחריות מוגבלת)</td>
              </tr>
              <tr>
                <td className="p-3 font-medium">מתאים ל-</td>
                <td className="p-3">עסק קטן, לקוחות פרטיים</td>
                <td className="p-3">מחזור גבוה, לקוחות עסקיים, הוצאות גדולות</td>
                <td className="p-3">רווחים גבוהים, שותפים, צורך בהפרדה משפטית</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Is patur worth it? */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-ink mb-4">האם כדאי להיות עוסק פטור?</h2>
          <p className="text-ink/70 leading-relaxed mb-5">
            זו השאלה הנפוצה ביותר של עצמאים חדשים — והתשובה תלויה בשלושה גורמים: מי הלקוחות שלכם,
            כמה הוצאות יש לעסק, ולאן המחזור צפוי להגיע. הנה הקריטריונים בפועל:
          </p>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="border border-ink/15 bg-cream-2 p-5">
              <p className="font-mono text-xs uppercase tracking-[0.14em] text-gold mb-3">
                עוסק פטור כדאי כאשר…
              </p>
              <ul className="space-y-2 text-sm text-ink/70 leading-relaxed">
                <li>✦ המחזור הצפוי נמוך בבירור מ-{VAT_THRESHOLD} ₪ בשנה, והעיסוק אינו מחייב מורשה.</li>
                <li>✦ הלקוחות הם בעיקר <strong>אנשים פרטיים</strong> — בדקו כיצד סיווג המע״מ משפיע על המחיר הסופי שתוכלו להציע.</li>
                <li>✦ ההוצאות העסקיות קטנות — אין הרבה מע"מ תשומות "להפסיד".</li>
                <li>✦ אתם רוצים מינימום בירוקרטיה: בלי דיווחי מע"מ שוטפים, רק הצהרה שנתית.</li>
              </ul>
            </div>
            <div className="border border-ink/15 bg-cream-2 p-5">
              <p className="font-mono text-xs uppercase tracking-[0.14em] text-gold mb-3">
                עוסק פטור פחות כדאי כאשר…
              </p>
              <ul className="space-y-2 text-sm text-ink/70 leading-relaxed">
                <li>✦ רוב הלקוחות הם <strong>עסקים</strong> — חלקם עשויים להיות זכאים לנכות מע״מ תשומות לפי תנאי העסקה.</li>
                <li>✦ יש השקעה ראשונית גדולה — בדקו בנפרד אם המע״מ על כל רכישה ניתן לניכוי.</li>
                <li>✦ המחזור צפוי לעבור את התקרה כבר בשנת הפתיחה — כדאי לברר מראש את הסיווג הנכון.</li>
                <li>✦ המקצוע שלכם מחייב עוסק מורשה על פי דין (למשל עו"ד, רופא, רו"ח, אדריכל).</li>
              </ul>
            </div>
          </div>

          <p className="text-ink/70 leading-relaxed mt-5 text-sm">
            הסיווג נקבע לפי המחזור והעיסוק, ובמקרים שבהם יש בחירה יש לבחון גם מחיר, לקוחות,
            רכישות ועלות ניהול. להכנת הנתונים בדקו את{' '}
            <Link href="/self-employed/net" className="text-gold hover:underline">מדריך הכנסה פנויה לעצמאי</Link>{' '}
            ואת{' '}
            <Link href="/self-employed/vat-threshold" className="text-gold hover:underline">מדריך תקרת עוסק פטור</Link>.
          </p>
        </section>

        <div className="prose prose-lg max-w-none text-ink leading-relaxed">
          <h2>מתי חייבים לעבור למורשה, ומתי רק כדאי לבדוק?</h2>
          <ul>
            <li><strong>חובה לבדוק שינוי סיווג</strong> כשהמחזור בפועל גבוה מהסכום הקובע או כשהפעילות משתנה לעיסוק המחייב מורשה.</li>
            <li><strong>שיקול מסחרי</strong> כשלקוחות עסקיים מבקשים חשבונית מס — אך עצם הבקשה שלהם אינה מחליפה את תנאי הדין.</li>
            <li><strong>שיקול כלכלי</strong> כשיש רכישות עם מע״מ — לאחר שבודקים אם מס התשומות אכן ניתן לניכוי ומה תהיה ההשפעה על מחיר המכירה.</li>
          </ul>
          <p>
            המעבר עצמו נעשה מול רשות המסים בעדכון סיווג התיק. מרגע המעבר, מתחילים להפיק חשבוניות
            מס (במקום קבלות בלבד) ולדווח מע"מ באופן שוטף. על ההבדל בין המסמכים —{' '}
            <Link href="/self-employed/invoices">חשבונית מס מול קבלה: המדריך המלא</Link>.
          </p>

          <h3>מה קורה כשעוברים את התקרה באמצע השנה?</h3>
          <p>
            תקרת עוסק פטור אינה המלצה. כשהמחזור מתקרב אליה או צפוי לעבור אותה, פנו לרשות המסים
            לברר שינוי סיווג ואת מועד החיוב במע"מ בעסקאות הרלוונטיות. אל תניחו שכל הסכום שמעבר
            לתקרה חייב באותו אופן בלי לבדוק את מועד העסקאות ומסמכיהן. עקבו אחרי המחזור המצטבר
            והתחזית לאורך השנה. <Link href="/self-employed/vat-threshold">מדריך תקרת עוסק פטור</Link>
            מסביר אילו נתונים להכין לבדיקה.
          </p>

          <h2>עצמאי לצד משרה כשכיר — הדרך הנפוצה להתחיל</h2>
          <p>
            הרבה עסקים בישראל לא נפתחים בקפיצת ראש אלא בהדרגה: ממשיכים במשרה כשכיר, ופותחים עוסק
            במקביל לעבודה צדדית — פרילנס, ייעוץ, הוראה פרטית, מכירות אונליין. המסלול הזה לגיטימי
            לחלוטין, וברוב המקרים גם הבחירה הכלכלית הנכונה: ההכנסה מהמשרה מכסה את המחיה בזמן שהעסק
            צובר לקוחות.
          </p>
          <p>
            כמה דברים שכדאי לדעת על המצב המשולב:
          </p>
          <ul>
            <li>
              <strong>הרישום זהה</strong> — פותחים תיק מע"מ, מס הכנסה וביטוח לאומי בדיוק כמו עצמאי
              "מלא". עבודה צדדית אינה הופכת את העסק אוטומטית לעוסק פטור; בודקים את המחזור הצפוי
              ואת סוג העיסוק כמו בכל פעילות אחרת.
            </li>
            <li>
              <strong>מס הכנסה מחושב על סך ההכנסות</strong> — השכר מהמשרה וההכנסה מהעסק מצטרפים
              לאותן מדרגות מס. המשמעות: אם השכר שלכם כבר "ממלא" את המדרגות הנמוכות, ההכנסה מהעסק
              תמוסה מהשקל הראשון במדרגה השולית הגבוהה שלכם.
            </li>
            <li>
              <strong>ביטוח לאומי מחושב על שני המקורות</strong> — המעסיק מנכה משכרכם כשכיר, ובנוסף
              תשלמו דמי ביטוח כעצמאי על רווחי העסק, בכפוף לתקרת ההכנסה החייבת הכוללת.
            </li>
            <li>
              <strong>אין להסתיר את העסק מהמעסיק אם החוזה דורש גילוי</strong> — בחוזי עבודה רבים יש
              סעיף עיסוק נוסף; שווה לבדוק לפני שמתחילים.
            </li>
          </ul>
          <p>
            לבדיקת הנתונים שצריך להביא לחישוב המס והביטוח הלאומי במצב המשולב —{' '}
            <Link href="/self-employed/employee-and-self-employed">
              מדריך שכיר וגם עצמאי
            </Link>.
          </p>
        </div>

        {/* Costs section */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-ink mb-4">כמה עולה לפתוח עסק עצמאי?</h2>
          <p className="text-ink/70 leading-relaxed mb-4">
            שירותי רשות המסים לפתיחת עוסק פטור ועוסק מורשה ניתנים ללא עלות. לצד הרישום עשויות
            להיות עלויות של ליווי, ציוד, תוכנה, ביטוחים, רישוי ענפי והיערכות תזרימית — והן משתנות
            מעסק לעסק:
          </p>
          <ul className="space-y-2 text-ink/70 leading-relaxed mb-5 list-disc pr-6">
            <li>
              <strong>ליווי מקצועי</strong> — רואה חשבון או יועץ מס לפתיחת התיקים ולדוח השנתי.
              היקף הליווי המקצועי תלוי במורכבות העסק ובהעדפות בעל העסק.
            </li>
            <li>
              <strong>תוכנת חשבוניות</strong> — הפקת חשבוניות/קבלות דיגיטליות ומעקב הכנסות.
            </li>
            <li>
              <strong>ציוד והתארגנות</strong> — מחשב, כלי עבודה, מלאי ראשוני, אתר אינטרנט.
            </li>
            <li>
              <strong>ביטוחים</strong> — אחריות מקצועית וצד ג׳, בהתאם לתחום.
            </li>
            <li>
              <strong>כרית מזומנים</strong> — לרוב העסקים לוקח זמן עד שההכנסות מתייצבות; חשוב
              לתקצב את חודשי ההרצה מראש.
            </li>
          </ul>
          <Link
            href="/self-employed/business-setup-cost"
            className="group flex items-center justify-between gap-2 border border-ink/15 bg-cream-2 p-4 hover:bg-paper-hover hover:shadow-sm transition"
          >
            <span className="font-medium text-ink group-hover:text-gold transition">
              עלויות פתיחת עסק — רכיבים להכנת תקציב אישי
            </span>
            <span className="text-gold group-hover:-translate-x-1 transition" aria-hidden>←</span>
          </Link>
        </section>

        {/* Step-by-step registration section */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-ink mb-6">פתיחת תיק ברשויות — מה צריך לבדוק</h2>
          <p className="text-ink/70 mb-6 leading-relaxed">
            להלן שלושת הגופים שיש לבדוק מולם את הרישום ואת המעמד: מע"מ, מס הכנסה וביטוח לאומי.
          </p>

          {/* Step 1: VAT */}
          <div className="border border-ink/15 p-6 mb-4 bg-cream-2">
            <div className="flex items-start gap-4">
              <span className="flex-shrink-0 w-9 h-9 rounded-full bg-ink text-cream font-bold text-lg flex items-center justify-center">
                1
              </span>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-ink mb-3">פתיחת תיק מע"מ</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border border-ink/15 overflow-hidden bg-paper">
                    <tbody className="text-ink/70">
                      <tr className="border-b border-ink/15">
                        <td className="p-3 font-medium text-ink/70 w-32">טופס</td>
                        <td className="p-3 font-semibold">בקשה מקוונת לעוסק פטור; טופס 821 לעוסק מורשה</td>
                      </tr>
                      <tr className="border-b border-ink/15 bg-cream-2/50">
                        <td className="p-3 font-medium text-ink/70">מסמכים</td>
                        <td className="p-3">לפי המסלול ותנאי השירות: פרטי זהות, פרטי העסק, אישור חשבון בנק ומסמכים נוספים לפי הנדרש</td>
                      </tr>
                      <tr className="border-b border-ink/15">
                        <td className="p-3 font-medium text-ink/70">איך</td>
                        <td className="p-3">
                          לעוסק פטור —{' '}
                          <a href={EXEMPT_REGISTRATION} target="_blank" rel="noopener noreferrer">שירות מקוון</a>{' '}
                          הכולל גם פתיחת תיק מס הכנסה; לעוסק מורשה —{' '}
                          <a href={LICENSED_REGISTRATION} target="_blank" rel="noopener noreferrer">שירות טופס 821</a>
                        </td>
                      </tr>
                      <tr className="border-b border-ink/15 bg-cream-2/50">
                        <td className="p-3 font-medium text-ink/70">עלות</td>
                        <td className="p-3 font-semibold text-emerald-800">חינם — אין אגרת פתיחה</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-medium text-ink/70">זמן טיפול</td>
                        <td className="p-3">לפי בדיקת הבקשה ואופן הרישום ברשות המסים</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-sm text-ink/70 mt-3">
                  כאן תבחרו: <strong>עוסק פטור</strong> (מחזור עד {VAT_THRESHOLD} ₪ ובכפוף לסוג
                  העיסוק) או <strong>עוסק מורשה</strong>. עוסק מורשה מדווח לפי תקופת הדיווח שנקבעה לתיק.
                </p>
              </div>
            </div>
          </div>

          {/* Step 2: Income Tax */}
          <div className="border border-ink/15 p-6 mb-4 bg-cream-2">
            <div className="flex items-start gap-4">
              <span className="flex-shrink-0 w-9 h-9 rounded-full bg-ink text-cream font-bold text-lg flex items-center justify-center">
                2
              </span>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-ink mb-3">פתיחת תיק מס הכנסה</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border border-ink/15 overflow-hidden bg-paper">
                    <tbody className="text-ink/70">
                      <tr className="border-b border-ink/15">
                        <td className="p-3 font-medium text-ink/70 w-32">טופס</td>
                        <td className="p-3 font-semibold">טופס 5329 או מסלול פתיחת תיק אחר בהתאם לסיווג</td>
                      </tr>
                      <tr className="border-b border-ink/15 bg-cream-2/50">
                        <td className="p-3 font-medium text-ink/70">מסמכים</td>
                        <td className="p-3">לפי הדרישות שמופיעות בשירות הרלוונטי ברשות המסים</td>
                      </tr>
                      <tr className="border-b border-ink/15">
                        <td className="p-3 font-medium text-ink/70">איך</td>
                        <td className="p-3">לעוסק פטור הבקשה המקוונת פותחת גם את תיק מס הכנסה; במקרים אחרים בדקו את שירות טופס 5329 או פנו למייצג</td>
                      </tr>
                      <tr className="border-b border-ink/15 bg-cream-2/50">
                        <td className="p-3 font-medium text-ink/70">עלות</td>
                        <td className="p-3 font-semibold text-emerald-800">חינם</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-medium text-ink/70">זמן טיפול</td>
                        <td className="p-3">לפי הטיפול בבקשה ברשות המסים</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-sm text-ink/70 mt-3">
                  לאחר הפתיחה עשויות להיקבע <strong>מקדמות מס</strong> לפי נתוני התיק. חשוב להשוות אותן
                  להכנסה הצפויה. פער בין המקדמות לחיוב השנתי עשוי ליצור יתרה לתשלום או החזר.
                  לבדיקת הנתונים ודרך בקשת שינוי ראו את{' '}
                  <Link href="/self-employed/tax-advances" className="text-gold hover:underline">
                    מדריך מקדמות המס
                  </Link>
                  .
                </p>
              </div>
            </div>
          </div>

          {/* Step 3: National Insurance */}
          <div className="border border-ink/15 p-6 mb-4 bg-cream-2">
            <div className="flex items-start gap-4">
              <span className="flex-shrink-0 w-9 h-9 rounded-full bg-ink text-cream font-bold text-lg flex items-center justify-center">
                3
              </span>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-ink mb-3">רישום בביטוח לאומי כעצמאי</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border border-ink/15 overflow-hidden bg-paper">
                    <tbody className="text-ink/70">
                      <tr className="border-b border-ink/15">
                        <td className="p-3 font-medium text-ink/70 w-32">טופס</td>
                        <td className="p-3 font-semibold">תהליך משולב בעת פתיחת התיק ברשות המסים, או דין וחשבון רב-שנתי אם התיק ברשות המסים כבר נפתח</td>
                      </tr>
                      <tr className="border-b border-ink/15 bg-cream-2/50">
                        <td className="p-3 font-medium text-ink/70">מסמכים</td>
                        <td className="p-3">פרטים אישיים, היקף העבודה וההכנסה הצפויים, ומסמכים נוספים לפי מסלול השירות</td>
                      </tr>
                      <tr className="border-b border-ink/15">
                        <td className="p-3 font-medium text-ink/70">איך</td>
                        <td className="p-3"><a href={NATIONAL_INSURANCE_REGISTRATION} target="_blank" rel="noopener noreferrer">לפי הוראות פתיחת תיק עצמאי באתר הביטוח הלאומי</a></td>
                      </tr>
                      <tr className="border-b border-ink/15 bg-cream-2/50">
                        <td className="p-3 font-medium text-ink/70">עלות</td>
                        <td className="p-3 font-semibold text-emerald-800">חינם — הרישום עצמו ללא אגרה</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-medium text-ink/70">זמן טיפול</td>
                        <td className="p-3">לפי בדיקת הבקשה בביטוח הלאומי; מועד החיוב ייקבע לפי נתוני הפעילות והמעמד</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-sm text-ink/70 mt-3">
                  דמי הביטוח מחושבים לפי מעמד העצמאי ובסיס החיוב שקובע הביטוח הלאומי, הכולל
                  התאמות מעבר להכנסה החודשית הפשוטה. הרישום המוקדם חשוב; להסבר ולמחשבון הרשמי:{' '}
                  <Link href="/self-employed/social-security" className="text-gold hover:underline">
                    מדריך ביטוח לאומי לעצמאי
                  </Link>
                  .
                </p>
              </div>
            </div>
          </div>

          {/* Summary notice */}
          <div className="bg-amber-50 border border-amber-200 p-4 mt-2">
            <p className="text-sm text-amber-800 leading-relaxed">
              <strong>טיפ מעשי:</strong> שמרו את אישורי ההגשה והפתיחה מכל רשות, ואל תניחו שהגשה
              למערכת אחת השלימה אוטומטית את כל הרישומים. בדקו באזור האישי או מול הרשות שהתיק
              אכן נפתח ושנתוני ההכנסה והיקף העבודה נקלטו נכון.
            </p>
          </div>
        </section>

        {/* Books & timeline */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-ink mb-4">ניהול ספרים ותיעוד — מה באמת נדרש מכם</h2>
          <div className="prose prose-lg max-w-none text-ink leading-relaxed">
            <p>
              מרגע שהעסק פעיל, אתם מחויבים בניהול ספרים לפי הוראות מס הכנסה. אצל רוב העצמאים
              הקטנים מדובר במערכת פשוטה למדי, אבל חשוב להכיר את העקרונות:
            </p>
            <ul>
              <li>
                <strong>תיעוד כל הכנסה</strong> — על כל תקבול מפיקים מסמך: עוסק פטור מפיק קבלה,
                עוסק מורשה מפיק חשבונית מס וקבלה (או חשבונית מס/קבלה משולבת). אסור לקבל כסף "מתחת
                לשולחן" — גם לא סכומים קטנים. פירוט מלא של סוגי המסמכים ומתי מפיקים כל אחד —{' '}
                <Link href="/self-employed/invoices">במדריך החשבוניות</Link>.
              </li>
              <li>
                <strong>תיעוד הוצאות</strong> — שמרו מסמך מתאים עבור כל הוצאה עסקית. הזכאות לניכוי
                במס הכנסה או לקיזוז מע״מ נבדקת בנפרד לפי ההוצאה והמסמך; לא כל רכישה מזכה בשניהם.
              </li>
              <li>
                <strong>הפקה דיגיטלית</strong> — אם בוחרים מערכת להפקת מסמכים, ודאו שהיא מתאימה
                לסוג העוסק ולמסמכים שעליכם להפיק, ושמרו גיבוי וגישה לנתונים.
              </li>
              <li>
                <strong>שמירת מסמכים לאורך שנים</strong> — את ספרי העסק והמסמכים יש לשמור גם אחרי
                הגשת הדוח, לצורך ביקורת עתידית אפשרית של רשות המסים.
              </li>
            </ul>
            <h3>לוח זמנים ריאלי: מהחלטה לעסק פעיל</h3>
            <p>
              זמן הטיפול תלוי במסלול ובבדיקת הבקשה, ולכן אין לבנות על מספר ימים קבוע. הכינו מראש
              את תיאור הפעילות, המחזור הצפוי, תאריך תחילת הפעילות, אישור ניהול חשבון והסכם שכירות
              או מסמכים נוספים אם הם נדרשים בדף השירות. במקביל הגדירו תמחור, אופן הפקת מסמכים
              ומעקב תזרים. סדר הפעולות המלא מחכה בצ'קליסט שבהמשך העמוד.
            </p>
          </div>
        </section>

        {/* What happens after opening */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-ink mb-4">פתחתם? זה מה שמחכה לכם בהתנהלות השוטפת</h2>
          <div className="prose prose-lg max-w-none text-ink leading-relaxed">
            <h3>מס הכנסה — מדרגות, מקדמות ודוח שנתי</h3>
            <p>
              מס הכנסה לעצמאי נבדק לפי ההכנסה החייבת השנתית, המדרגות, נקודות הזיכוי והנתונים
              האישיים — לא לפי סיווג פטור או מורשה במע״מ. במהלך השנה עשויות להידרש{' '}
              <Link href="/self-employed/tax-advances">מקדמות מס</Link>,
              ובסוף שנת המס בודקים את חובת הדיווח לפי סוג התיק. מי שאושר במסלול בעל עסק זעיר
              ועומד בתנאיו עשוי להגיש דיווח מקוצר במקום דוח שנתי רגיל. לחישוב מדרגות עדכני עברו
              ל<Link href="/personal-tax/income-tax">מחשבון מס הכנסה</Link> במקום להסתמך על מספר
              כללי בתוך מדריך הפתיחה.
            </p>
          </div>

          <div className="prose prose-lg max-w-none text-ink leading-relaxed">
            <h3>ביטוח לאומי — כמה משלם עצמאי בפועל?</h3>
            <p>
              הביטוח הלאומי מפרסם שיעור מופחת ושיעור רגיל לעצמאים, אך בסיס החיוב אינו בהכרח
              הרווח החודשי שהוזן: בחישוב עשויים להיכלל התאמות, ניכויים והכנסות נוספות.
              המקדמות וההתחשבנות הסופית תלויות בנתונים שנקלטו ובשומה. לצורך תכנון תזרים
              בדקו את המקדמות מול הביטוח הלאומי, ולהערכת חיוב אישי השתמשו במחשבון הרשמי —{' '}
              <Link href="/self-employed/social-security">מדריך ביטוח לאומי לעצמאי</Link>.
            </p>
            <h3>הוצאות מוכרות — הכלי המרכזי להקטנת המס</h3>
            <p>
              הוצאות עסקיות עשויות להפחית את ההכנסה החייבת לפי כללי הניכוי, לעיתים באופן חלקי
              או דרך פחת. שמרו מסמכים ובדקו את סיווג ההוצאה לפני הדיווח. פירוט —{' '}
              <Link href="/self-employed/allowed-expenses">מדריך ההוצאות המוכרות לעצמאים</Link>.
            </p>
            <h3>פנסיה וקרן השתלמות</h3>
            <p>
              עצמאים העומדים בתנאי החוק חייבים בהפקדה לפנסיה (
              <Link href="/self-employed/mandatory-pension">פנסיית חובה לעצמאים</Link>), ובנוסף
              כדאי לבדוק גם <strong>קרן השתלמות לעצמאים</strong>. הטבות המס והתקרות תלויות
              בהכנסה, בסוג ההפקדה ובשנת המס; אין להסיק סכום אישי מנתון יחיד.
            </p>
            <h3>ניהול הכסף של העסק</h3>
            <p>
              ההמלצה החשובה ביותר לעצמאי חדש: <strong>הפרידו את כספי העסק מהכסף הפרטי</strong> —
              חשבון בנק ייעודי, מעקב חודשי אחרי הכנסות מול הוצאות, והפרשה שוטפת בצד למס, לביטוח
              הלאומי ולפנסיה, כדי שתשלומי סוף השנה לא יתפסו אתכם בלי כיסוי. למדריך המלא על ניהול
              הכספים, תזרים והתנהלות מול הבנק —{' '}
              <Link href="/self-employed/business-finance">התנהלות פיננסית לעצמאים: המדריך המלא</Link>.
            </p>
            <p>
              ואם ההקמה עצמה דורשת מימון — ציוד, שיפוץ או הון חוזר — התחנה הראשונה היא{' '}
              <Link href="/tools/loan-eligibility">בודק הזכאות להלוואות בערבות המדינה</Link>. מי
              שמעדיף שלא להתמודד לבד מול הקרן והבנקים יכול להיעזר ב
              <a
                href="https://profitmargin.co.il/%D7%94%D7%9C%D7%95%D7%95%D7%90%D7%95%D7%AA-%D7%91%D7%A2%D7%A8%D7%91%D7%95%D7%AA-%D7%94%D7%9E%D7%93%D7%99%D7%A0%D7%94/"
                target="_blank"
                rel="noopener noreferrer"
              >
                ליווי מקצועי בגיוס הלוואה בערבות המדינה
              </a>{' '}
              — מבדיקת זכאות ועד הגשת הבקשה.
            </p>
          </div>
        </section>

        {/* Persona examples */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-ink mb-4">שלושה תרחישים להמחשת הבחירה</h2>
          <p className="text-ink/70 leading-relaxed mb-5">
            התיאוריה ברורה — אבל הכי קל להבין את ההחלטה דרך מקרים טיפוסיים. שימו לב: אלו דוגמאות
            להמחשת שיקולים, לא תחליף לבדיקה פרטנית של המספרים שלכם.
          </p>
          <div className="space-y-4">
            <div className="border border-ink/15 bg-cream-2 p-5">
              <p className="font-mono text-xs uppercase tracking-[0.14em] text-gold mb-2">
                דוגמה 1 · מורה ליוגה לצד משרה
              </p>
              <p className="text-sm text-ink/70 leading-relaxed">
                שכירה במשרה מלאה שמעבירה שיעורי יוגה בערבים, עם הכנסה צפויה של כ-40,000 ₪ בשנה
                מהשיעורים. הלקוחות כולם פרטיים, ההוצאות מסתכמות במזרנים ושכירות אולם מזדמנת.
                המחזור נמוך מתקרת 2026, ולכן אפשר לבדוק אם עוסק פטור מתאים, בכפוף לסוג העיסוק
                וליתר תנאי הרישום. את השפעת ההכנסה הנוספת על המס כדאי לבדוק ב{' '}
                <Link href="/self-employed/employee-and-self-employed" className="text-gold hover:underline">
                  מדריך שכיר וגם עצמאי
                </Link>.
              </p>
            </div>
            <div className="border border-ink/15 bg-cream-2 p-5">
              <p className="font-mono text-xs uppercase tracking-[0.14em] text-gold mb-2">
                דוגמה 2 · מפתח תוכנה שעוזב משרה לפרילנס
              </p>
              <p className="text-sm text-ink/70 leading-relaxed">
                מפתח עם חוזה ראשון מול חברת הייטק בהיקף חודשי קבוע — המחזור השנתי הצפוי יעבור את
                התקרה כבר בחודשים הראשונים. במקרה כזה יש לבדוק רישום כעוסק מורשה מראש,
                ללא קשר ליכולת של לקוח מסוים לנכות מע״מ. בהמשך, אם נתוני העסק ישתנו, אפשר לבחון
                התאגדות כחברה בע"מ —{' '}
                <Link href="/self-employed/corporation-vs-individual" className="text-gold hover:underline">
                  מדריך חברה בע"מ מול עוסק
                </Link>{' '}
                מפרט את הנתונים שכדאי לבדוק.
              </p>
            </div>
            <div className="border border-ink/15 bg-cream-2 p-5">
              <p className="font-mono text-xs uppercase tracking-[0.14em] text-gold mb-2">
                דוגמה 3 · פתיחת סטודיו עם השקעה בציוד
              </p>
              <p className="text-sm text-ink/70 leading-relaxed">
                צלמת שפותחת סטודיו: המחזור הצפוי בשנה הראשונה נמוך מהתקרה, אבל ההשקעה הראשונית —
                מצלמות, תאורה, שיפוץ ומחשב — עשויה לכלול מע״מ. ניכוי מס תשומות, אם נרשמים
                כעוסק מורשה, תלוי בסוג הרכישה ובכללים החלים. יש להשוות את ההוצאות ואת מחיר
                המכירה ללקוחות פרטיים ועסקיים עם רואה חשבון לפני בחירת הסיווג. רכיבי התקציב מופיעים ב{' '}
                <Link href="/self-employed/business-setup-cost" className="text-gold hover:underline">
                  מדריך עלות פתיחת העסק
                </Link>.
              </p>
            </div>
          </div>
        </section>

        <div className="prose prose-lg max-w-none text-ink leading-relaxed">
          <h2>הטעויות הנפוצות של עצמאים חדשים</h2>
          <ul>
            <li>
              <strong>בחירת סיווג לפי כלל אצבע בלבד</strong> — סוג הלקוחות והיקף ההוצאות הם שיקולים,
              אבל קודם בודקים את התקרה ואת סוג העיסוק, ורק אחר כך את מחיר המכירה וניכוי התשומות.
            </li>
            <li>
              <strong>אי-ניצול הוצאות מוכרות</strong> — בלי קבלות ותיעוד, הרווח החייב במס גבוה
              מהנדרש.
            </li>
            <li>
              <strong>הזנחת מקדמות מס</strong> — מקדמה נמוכה מדי מובילה ל"הפתעה" של חוב גדול
              (בתוספת ריבית והצמדה) בסוף השנה.
            </li>
            <li>
              <strong>דחיית הרישום לביטוח לאומי</strong> — מי שמתחיל לעבוד בלי להירשם עלול לקבל
              חיוב רטרואקטיבי, וחמור מכך: פגיעה בעבודה לפני הרישום עלולה לפגוע בזכאות לגמלה.
            </li>
            <li>
              <strong>ערבוב בין תנועות פרטיות לעסקיות</strong> — מקשה על מעקב, על הדוח השנתי ועל
              כל ביקורת עתידית. הגדירו דרך ברורה להפרדה ולתיעוד.
            </li>
            <li>
              <strong>אי-הפרשה שוטפת למס ולפנסיה</strong> — עצמאי מקבל ברוטו ושוכח שחלק מהכסף
              אינו שלו; חשוב "לשלם לרשויות קודם" בכל חודש.
            </li>
            <li>
              <strong>תמחור לפי אינטואיציה</strong> — שכחת עלויות המס, הביטוח הלאומי, הפנסיה
              והחופשות בתעריף. השתמשו ב
              <Link href="/self-employed/hourly-rate">כלי יעד הכנסה לשעת חיוב</Link> לפני שסוגרים
              מחיר עם לקוח ראשון.
            </li>
            <li>
              <strong>התעלמות מתקרת עוסק פטור</strong> — אם המחזור צפוי לחצות את תקרת {VAT_THRESHOLD} ₪,
              בדקו בהקדם עם רשות המסים כיצד לעדכן את הסיווג ומהן חובות הדיווח והמע״מ.
            </li>
          </ul>
        </div>

        {/* Checklist */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-ink mb-4">צ'קליסט פתיחת עסק — כל הפעולות בסדר הנכון</h2>
          <div className="border border-ink/15 bg-cream-2 p-6">
            <p className="font-mono text-xs uppercase tracking-[0.14em] text-gold mb-4">
              לפני הפתיחה
            </p>
            <ul className="space-y-2 text-sm text-ink/80 leading-relaxed mb-6">
              <li>☐ הגדרתם מה העסק מוכר, למי, ובאיזה מחיר (היעזרו ב<Link href="/self-employed/hourly-rate" className="text-gold hover:underline">כלי לתכנון יעד הכנסה לשעת חיוב</Link>)</li>
              <li>☐ אמדתם את מחזור העסקאות השנתי הצפוי — מעל או מתחת ל-{VAT_THRESHOLD} ₪?</li>
              <li>☐ בחרתם סיווג: עוסק פטור / עוסק מורשה (או חברה בע"מ)</li>
              <li>☐ תקצבתם את עלויות הפתיחה (<Link href="/self-employed/business-setup-cost" className="text-gold hover:underline">מדריך רכיבי העלות</Link>)</li>
              <li>☐ הגדרתם דרך להפריד ולתעד את תנועות העסק</li>
            </ul>
            <p className="font-mono text-xs uppercase tracking-[0.14em] text-gold mb-4">
              שבוע הפתיחה
            </p>
            <ul className="space-y-2 text-sm text-ink/80 leading-relaxed mb-6">
              <li>☐ בדיקת מסלול הרישום במע״מ: בקשה מקוונת לעוסק פטור או טופס 821 לעוסק מורשה</li>
              <li>☐ וידוא פתיחת תיק מס הכנסה במסלול המתאים; הבקשה המקוונת לעוסק פטור כוללת גם אותו</li>
              <li>☐ וידוא רישום בביטוח הלאומי במסלול המשולב או בדין וחשבון רב-שנתי, לפי המקרה</li>
              <li>☐ הסדרת תוכנה להפקת חשבוניות/קבלות (<Link href="/self-employed/invoices" className="text-gold hover:underline">איזה מסמך מפיקים למי?</Link>)</li>
            </ul>
            <p className="font-mono text-xs uppercase tracking-[0.14em] text-gold mb-4">
              בחודשים הראשונים
            </p>
            <ul className="space-y-2 text-sm text-ink/80 leading-relaxed">
              <li>☐ בדיקת מקדמות מס הכנסה לפי ההכנסה בפועל (<Link href="/self-employed/tax-advances" className="text-gold hover:underline">מדריך מקדמות</Link>)</li>
              <li>☐ בדיקת מקדמות ביטוח לאומי (<Link href="/self-employed/social-security" className="text-gold hover:underline">מדריך ב״ל לעצמאי</Link>)</li>
              <li>☐ פתיחת קופת פנסיה — חובת הפקדה לעצמאים</li>
              <li>☐ שמירת כל קבלה והוצאה עסקית מסודרת</li>
              <li>☐ הפרשה חודשית בצד למס, ב"ל ופנסיה — לפני שמושכים כסף הביתה (<Link href="/self-employed/business-finance" className="text-gold hover:underline">מדריך ההתנהלות הפיננסית</Link>)</li>
              <li>☐ מעקב רבעוני אחרי המחזור מול תקרת עוסק פטור (<Link href="/self-employed/vat-threshold" className="text-gold hover:underline">מדריך התקרה</Link>)</li>
            </ul>
          </div>
        </section>

        {/* Related calculators */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-ink mb-4">מחשבונים ומדריכים שיעזרו לך להתחיל</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              { href: '/self-employed/vat', label: 'מחשבון מע"מ' },
              { href: '/self-employed/net', label: 'מדריך הכנסה פנויה לעצמאי' },
              { href: '/self-employed/social-security', label: 'ביטוח לאומי לעצמאי — מדריך ומחשבון רשמי' },
              { href: '/self-employed/tax-advances', label: 'מדריך מקדמות מס' },
              { href: '/self-employed/vat-threshold', label: 'מדריך תקרת עוסק פטור' },
              { href: '/self-employed/hourly-rate', label: 'כלי לתכנון יעד הכנסה לשעת חיוב' },
              { href: '/self-employed/corporation-vs-individual', label: 'חברה בע"מ מול עוסק' },
              { href: '/self-employed/business-setup-cost', label: 'כמה עולה לפתוח עסק?' },
              { href: '/self-employed/invoices', label: 'חשבונית מס מול קבלה — המדריך' },
              { href: '/self-employed/business-finance', label: 'התנהלות פיננסית לעצמאים' },
            ].map((c) => (
              <Link
                key={c.href}
                href={c.href}
                className="group flex items-center justify-between gap-2 border border-ink/15 p-4 hover:bg-paper-hover hover:shadow-sm transition"
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

        {/* קידום קורס FinSchool */}
        <CourseCTA />

        <section className="mb-8 text-sm leading-relaxed">
          <h2 className="mb-3 text-lg font-bold">מקורות רשמיים לבדיקת הסיווג והדיווח</h2>
          <ul className="list-disc space-y-2 pr-5">
            <li><a href={EXEMPT_REGISTRATION} target="_blank" rel="noopener noreferrer" className="text-gold underline">רשות המסים — פתיחת תיק עוסק פטור ותנאי הרישום</a></li>
            <li><a href={LICENSED_REGISTRATION} target="_blank" rel="noopener noreferrer" className="text-gold underline">רשות המסים — פתיחת תיק עוסק מורשה</a></li>
            <li><a href="https://www.gov.il/he/service/itc5329" target="_blank" rel="noopener noreferrer" className="text-gold underline">רשות המסים — טופס 5329 לפתיחת תיק עצמאי</a></li>
            <li><a href="https://www.gov.il/he/service/report-and-payment-for-micro-business-owner" target="_blank" rel="noopener noreferrer" className="text-gold underline">רשות המסים — דיווח מקוצר לבעל עסק זעיר</a></li>
            <li><a href={NATIONAL_INSURANCE_REGISTRATION} target="_blank" rel="noopener noreferrer" className="text-gold underline">הביטוח הלאומי — פתיחת תיק עצמאי והמסלול המשולב</a></li>
          </ul>
        </section>

        <section className="mb-8">
          <DisclaimerBox text="המידע בעמוד זה הוא מידע כללי בלבד ואינו מהווה ייעוץ מס, ייעוץ משפטי או ייעוץ פיננסי. הנתונים נכונים לשנת המס 2026 ועשויים להתעדכן. לפני פתיחת עסק ובחירת סיווג, מומלץ להתייעץ עם רואה חשבון או יועץ מס מוסמך." />
        </section>

        <section className="mb-8">
          <AuthorBox />
        </section>
      </article>
    </div>
  );
}
