import type { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/calculator/Breadcrumbs';
import { AuthorBox } from '@/components/calculator/AuthorBox';
import { CourseCTA } from '@/components/marketing/CourseCTA';

const PAGE_PATH = '/self-employed/invoices';
const SITE_URL = 'https://cheshbonai.co.il';
const ALLOCATION_THRESHOLDS_2026 = {
  januaryToMay: {
    from: '1.1.2026',
    through: '31.5.2026',
    threshold: 10_000,
  },
  fromJune: {
    from: '1.6.2026',
    threshold: 5_000,
  },
} as const;

const formatNis = (amount: number) => `${amount.toLocaleString('he-IL')} ₪`;
const ALLOCATION_PERIOD_LABELS_2026 = {
  januaryToMay: `${ALLOCATION_THRESHOLDS_2026.januaryToMay.from} – ${ALLOCATION_THRESHOLDS_2026.januaryToMay.through}`,
  fromJune: `מ-${ALLOCATION_THRESHOLDS_2026.fromJune.from} ואילך`,
} as const;

export const metadata: Metadata = {
  title: { absolute: 'חשבונית מס, חשבונית עסקה או קבלה? המדריך המלא לעצמאים 2026' },
  description:
    'מתי מנפיקים חשבונית מס, חשבונית עסקה וקבלה: תהליכי עבודה, מספרי הקצאה ב-2026, ניכוי מס במקור ותיקון טעויות.',
  alternates: { canonical: `${SITE_URL}${PAGE_PATH}` },
  openGraph: {
    // OG image לא מתפשט מ-app/opengraph-image.tsx לדפים שמגדירים openGraph משלהם.
    images: ['/opengraph-image'],
    title: 'חשבונית מס, חשבונית עסקה או קבלה? המדריך המלא לעצמאים 2026',
    description:
      'מי מנפיק איזה מסמך, מה קורה בבסיס מזומן ואיך בודקים מספר הקצאה ב-2026.',
    type: 'article',
    locale: 'he_IL',
    url: PAGE_PATH,
    siteName: 'חשבונאי',
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/opengraph-image'],
    title: 'חשבונית מס, חשבונית עסקה או קבלה? מדריך 2026',
    description: 'תהליכי הנפקה, מספרי הקצאה, ניכוי מס במקור ותיקון מסמך שגוי.',
  },
};

const faqItems = [
  {
    question: 'מה ההבדל בין חשבונית מס לחשבונית עסקה?',
    answer:
      'חשבונית עסקה מתעדת עסקה ולעיתים משמשת גם כדרישת תשלום. עוסק מורשה רשאי להוציא במקומה חשבונית מס בעסקה חייבת, וחייב לעשות זאת לפי דרישת הקונה בכפוף לדין; בעסקה על בסיס מזומן הקונה אינו רשאי לדרוש אותה לפני התשלום. חשבונית עסקה אינה מאפשרת ניכוי מס תשומות.',
  },
  {
    question: 'האם עוסק פטור יכול להנפיק חשבונית מס?',
    answer:
      'לא. עוסק פטור אינו רשאי להוציא חשבונית מס. הוא מוציא חשבונית עסקה לתיעוד העסקה, ולעיתים גם כדרישת תשלום, וקבלה עם קבלת התקבול. חשבונית העסקה והקבלה שלו אינן מקנות ללקוח מס תשומות לניכוי.',
  },
  {
    question: 'מהו מספר הקצאה ומה הסף שלו ב-2026?',
    answer:
      'מ-' +
      ALLOCATION_THRESHOLDS_2026.januaryToMay.from +
      ' עד ' +
      ALLOCATION_THRESHOLDS_2026.januaryToMay.through +
      ' נבדק סכום העולה על ' +
      formatNis(ALLOCATION_THRESHOLDS_2026.januaryToMay.threshold) +
      ' לפני מע"מ; מ-' +
      ALLOCATION_THRESHOLDS_2026.fromJune.from +
      ' — סכום העולה על ' +
      formatNis(ALLOCATION_THRESHOLDS_2026.fromJune.threshold) +
      '. לפי הוראת רשות המסים, בקשת הקצאה נדרשת כאשר החשבונית כוללת רכיב מע"מ, הלקוח הוא עוסק מורשה והוא דרש מספר. הסף הוא מעל, לא שווה לו.',
  },
  {
    question: 'מה זה חשבונית מס-קבלה?',
    answer:
      'זהו מסמך משולב לעוסק הרשום כעוסק מורשה, כאשר גם החובה להוציא חשבונית מס וגם החובה לתעד את התקבול נולדות באותו מועד. אם חשבונית המס כבר הוצאה במועד מוקדם יותר, עם קבלת התשלום מוציאים קבלה ולא מסמך מס נוסף.',
  },
  {
    question: 'תוך כמה זמן חייבים להוציא חשבונית מס?',
    answer:
      'סעיף 46 לחוק מע"מ קובע שחשבונית תוצא תוך 14 יום ממועד החיוב במס. מועד החיוב עצמו משתנה לפי סוג העסקה והוראות החוק החלות עליה. בעסקה שמועד החיוב בה הוא עם קבלת התמורה, לא סופרים 14 יום מגמר העבודה אלא ממועד החיוב הרלוונטי.',
  },
  {
    question: 'כמה זמן חייבים לשמור חשבוניות ומסמכים עסקיים?',
    answer:
      'מערכת החשבונות תישמר שבע שנים מתום שנת המס שאליה היא מתייחסת או שש שנים מיום הגשת הדוח על ההכנסה לאותה שנה — לפי המאוחר. לגבי מסמכים אחרים עשויים לחול כללים נוספים.',
  },
  {
    question: 'אפשר להנפיק חשבוניות דיגיטליות?',
    answer:
      'אפשר להנפיק ולשמור מסמכים דיגיטליים בהתאם להוראות ניהול הספרים ולכללי מסמך ממוחשב. יש לבדוק שהתוכנה, אופן המסירה והשמירה עומדים בדרישות ושאפשר לאחזר את המסמך המקורי בעת ביקורת.',
  },
  {
    question: 'לקוח מבקש חשבונית מס לפני ששילם — האם חייבים?',
    answer:
      'אם מועד החיוב במע"מ חל עם קבלת התמורה, סעיף 47(א1) קובע שהקונה לא ידרוש חשבונית מס לפני תשלום התמורה או חלקה. אפשר להעביר חשבונית עסקה לצורך התשלום. בעסקה שאינה על בסיס מזומן, התזמון עשוי להיות שונה.',
  },
  {
    question: 'האם אפשר לתקן חשבונית שגויה?',
    answer:
      'אין לשכתב מסמך סופי שכבר נרשם במערכת. אבל גם אין כלל שלפיו כל שגיאה מחייבת אוטומטית ביטול מלא והנפקה מחדש. הודעת זיכוי אפשרית במקרים כגון ביטול עסקה, שינוי בתנאיה, טעות בחשבונית או שינוי בסכום. אם עדיין נדרש חיוב מתוקן, מפיקים אותו לפי סוג הטעות והנחיות התוכנה או המייצג.',
  },
  {
    question: 'הלקוח ניכה מס במקור ולבנק נכנס פחות מסכום החשבונית. מה שומרים?',
    answer:
      'שומרים את אסמכתאות התשלום, הקבלה או חשבונית המס-קבלה, ואת אישור הניכוי שמסר הלקוח. הניכוי הוא תשלום על חשבון המס וצריך להתאים בין הסכום ברוטו, הנטו שנכנס לבנק וסכום הניכוי. אין לסמן אוטומטית את ההפרש כחוב פתוח; מוודאים שהתוכנה רושמת ניכוי מס במקור בנפרד.',
  },
  {
    question: 'קיבלתי תשלום חלקי. איזה מסמך מוציאים?',
    answer:
      'מוציאים קבלה על התקבול שהתקבל. אם העסקה מדווחת על בסיס מזומן, גם חשבונית המס עשויה להיות על הסכום שהתקבל באותו שלב; אם מועד החיוב חל קודם, ייתכן שחשבונית המס כבר הוצאה על סכום אחר. לכן לא מסיקים את סכום חשבונית המס מגובה ההפקדה בלבד.',
  },
];

export default function InvoicesPage() {
  const lastUpdated = '2026-10-01';

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'חשבונית מס, חשבונית עסקה או קבלה? המדריך המלא לעצמאים 2026',
    description:
      'ההבדל בין חשבונית מס, חשבונית עסקה וקבלה, מי מנפיק מה, מספרי הקצאה 2026 ושמירת מסמכי העסק.',
    inLanguage: 'he-IL',
    datePublished: '2026-06-12',
    dateModified: lastUpdated,
    author: { '@type': 'Person', name: 'אנדרי פלטונוב', jobTitle: 'רואה חשבון' },
    publisher: {
      '@type': 'Organization',
      name: 'חשבונאי',
      url: SITE_URL,
    },
    image: `${SITE_URL}/opengraph-image`,
    url: `${SITE_URL}${PAGE_PATH}`,
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
      {
        '@type': 'ListItem',
        position: 3,
        name: 'חשבוניות ומסמכים',
        item: `${SITE_URL}${PAGE_PATH}`,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-paper" dir="rtl">
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

      <article className="max-w-3xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Breadcrumbs
            items={[
              { label: 'דף הבית', href: '/' },
              { label: 'עצמאיים', href: '/self-employed' },
              { label: 'חשבוניות ומסמכים' },
            ]}
          />
        </div>

        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-ink mb-3">
            חשבונית מס, חשבונית עסקה או קבלה? המדריך המלא לעצמאים 2026
          </h1>
          <p className="text-lg text-ink/70 leading-relaxed">
            המדריך המעשי לבחירת המסמך הנכון בכל שלב: מהצעת המחיר, דרך מועד החיוב
            והתשלום, ועד קבלה, ניכוי מס במקור ומספר הקצאה.
          </p>
          <p className="text-sm text-ink/70 mt-3">
            נכתב על ידי אנדרי פלטונוב, רו&quot;ח · עודכן {lastUpdated}
          </p>
        </header>

        <div className="answer-box mb-8 border border-gold/35 bg-cream-2 p-5">
          <p className="mb-2 font-mono text-xs font-bold uppercase tracking-[0.12em] text-gold">
            התשובה הקצרה
          </p>
          <p className="leading-relaxed text-ink/80">
            חשבונית עסקה מתעדת את העסקה ולעיתים משמשת גם כדרישת תשלום; היא אינה חשבונית מס.
            עוסק מורשה מפיק חשבונית מס לפי מועד החיוב במע״מ, וקבלה לכל תקבול. בעסקה על
            בסיס מזומן הלקוח אינו אמור לדרוש חשבונית מס לפני ששילם, לפי חריג סעיף 47(א1);
            אפשר להעביר חשבונית עסקה ואז להפיק חשבונית מס וקבלה עם קבלת התמורה. אם
            חשבונית המס כבר הוצאה קודם, עם התשלום מפיקים קבלה בלבד.
          </p>
        </div>

        <nav aria-label="תוכן המדריך" className="mb-10 border-y border-ink/15 py-5">
          <p className="mb-3 font-bold text-ink">במדריך</p>
          <ul className="grid gap-2 text-sm sm:grid-cols-2">
            <li><a className="text-gold underline-offset-4 hover:underline" href="#documents">סוגי המסמכים</a></li>
            <li><a className="text-gold underline-offset-4 hover:underline" href="#workflow-timing">תהליך עבודה ומועדי הפקה</a></li>
            <li><a className="text-gold underline-offset-4 hover:underline" href="#allocation">מספרי הקצאה ב-2026</a></li>
            <li><a className="text-gold underline-offset-4 hover:underline" href="#digital-records">מסמכים דיגיטליים ושמירה</a></li>
            <li><a className="text-gold underline-offset-4 hover:underline" href="#corrections">תיקון חשבונית שגויה</a></li>
            <li><a className="text-gold underline-offset-4 hover:underline" href="#faq">שאלות נפוצות</a></li>
          </ul>
        </nav>

        <div className="guide-copy prose prose-lg max-w-none text-ink leading-relaxed">
          <h2 id="documents" className="scroll-mt-40">סוגי המסמכים — טבלת מפתח</h2>
          <p>
            יש שלושה מסמכי יסוד — חשבונית עסקה, חשבונית מס וקבלה — ולצדם מסמך משולב נפוץ:
            חשבונית מס-קבלה. בודקים את הרישום בפועל במע״מ ואת מועד החיוב בעסקה; לא מסיקים
            את סוג המסמך רק מכך שמדובר ביחיד או בחברה.
          </p>
        </div>

        {/* Main document type table */}
        <div className="overflow-x-auto my-6 not-prose">
          <table className="w-full text-sm border border-ink/15 rounded-none overflow-hidden">
            <thead className="bg-cream-2">
              <tr className="text-right">
                <th className="p-3 font-bold text-ink border-b border-ink/15">סוג מסמך</th>
                <th className="p-3 font-bold text-ink border-b border-ink/15">מי מנפיק</th>
                <th className="p-3 font-bold text-ink border-b border-ink/15">מתי</th>
                <th className="p-3 font-bold text-ink border-b border-ink/15">דוגמה מעשית</th>
              </tr>
            </thead>
            <tbody className="text-ink/70">
              <tr>
                <td className="p-3 border-b font-semibold text-ink">חשבונית מס</td>
                <td className="p-3 border-b">
                  <strong>מי שרשום כעוסק מורשה במע״מ.</strong>{' '}
                  <span className="text-red-700 font-medium">עוסק פטור — אסור</span>
                </td>
                <td className="p-3 border-b">
                  תוך 14 יום ממועד החיוב במס; קודם קובעים מהו המועד בעסקה המסוימת
                </td>
                <td className="p-3 border-b">
                  ספק שמדווח על בסיס מזומן מקבל תשלום ומפיק חשבונית מס על הסכום שהתקבל
                </td>
              </tr>
              <tr className="bg-cream-2/50">
                <td className="p-3 border-b font-semibold text-ink">חשבונית מס-קבלה</td>
                <td className="p-3 border-b">מי שרשום כעוסק מורשה במע״מ</td>
                <td className="p-3 border-b">
                  כשמועד חשבונית המס וקבלת התקבול חלים יחד
                </td>
                <td className="p-3 border-b">
                  נותן שירות מקבל העברה ומפיק מסמך משולב במקום חשבונית מס וקבלה נפרדות
                </td>
              </tr>
              <tr>
                <td className="p-3 border-b font-semibold text-ink">חשבונית עסקה</td>
                <td className="p-3 border-b">עוסק מורשה ועוסק פטור</td>
                <td className="p-3 border-b">
                  לתיעוד העסקה; משמשת לעיתים כדרישת תשלום, אך אינה מסמך לניכוי תשומות
                </td>
                <td className="p-3 border-b">
                  יועצת שולחת פירוט שירות וסכום לתשלום בלי להקדים חשבונית מס בעסקה על בסיס מזומן
                </td>
              </tr>
              <tr className="bg-cream-2/50">
                <td className="p-3 font-semibold text-ink">קבלה</td>
                <td className="p-3">עוסק מורשה ועוסק פטור</td>
                <td className="p-3">לכל תקבול בנפרד, עם קבלתו</td>
                <td className="p-3">
                  התקבלה מקדמה או יתרה — מפיקים קבלה על התקבול שהתקבל
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Critical distinction callout */}
        <div className="bg-amber-50 border border-amber-300 rounded-none p-4 mb-8 not-prose">
          <p className="font-bold text-amber-900 mb-1">ההבחנה הקריטית: עוסק פטור לא מנפיק חשבונית מס</p>
          <p className="text-amber-800 text-sm leading-relaxed">
            עוסק פטור אינו גובה מע&quot;מ ולכן <strong>אינו רשאי</strong> להנפיק חשבונית מס.
            הוא מוציא חשבונית עסקה לתיעוד העסקה וקבלה עם קבלת תקבול. לקוח עסקי לא יכול
            לנכות מס תשומות ממסמכים של עוסק פטור. מנגד, עצם היות הספק חברה אינה תחליף
            לבדיקה כיצד הוא רשום במע״מ.
          </p>
        </div>

        <section id="workflow-timing" className="mb-10 scroll-mt-40">
          <h2 className="text-2xl font-bold text-ink mb-4">מהצעת מחיר עד קבלה — שלושה תהליכים נפוצים</h2>
          <p className="text-ink/70 leading-relaxed mb-5">
            הצעת מחיר או הזמנה מסכמות את ההתקשרות, אך אינן מחליפות מסמך חשבונאי. מכאן
            המסלול משתנה לפי הרישום במע״מ ולפי מועד החיוב במס.
          </p>
          <div className="grid gap-4">
            <div className="border border-ink/15 bg-cream-2 p-5">
              <h3 className="font-bold text-ink mb-2">1. נותן שירות מורשה שמדווח על בסיס מזומן</h3>
              <ol className="list-decimal list-inside space-y-2 text-sm leading-relaxed text-ink/70">
                <li>מאשרים הצעת מחיר או הזמנה ושומרים את פירוט השירות ותנאי התשלום.</li>
                <li>
                  מעבירים חשבונית עסקה לתיעוד העסקה ולבקשת התשלום; היא אינה חשבונית מס.
                </li>
                <li>
                  עם קבלת התמורה מפיקים חשבונית מס וקבלה, או חשבונית מס-קבלה. בתשלום
                  חלקי בודקים את המסמכים הנדרשים לגבי הסכום שהתקבל.
                </li>
              </ol>
            </div>
            <div className="border border-ink/15 bg-cream-2 p-5">
              <h3 className="font-bold text-ink mb-2">2. עסקה שמועד החיוב בה חל לפני התשלום</h3>
              <ol className="list-decimal list-inside space-y-2 text-sm leading-relaxed text-ink/70">
                <li>מזהים את מועד החיוב לפי סוג העסקה — למשל מסירת טובין או מתן שירות מסוים.</li>
                <li>
                  מפיקים חשבונית מס בתוך 14 יום ממועד החיוב, גם אם הלקוח טרם שילם.
                </li>
                <li>עם קבלת כל תקבול מפיקים קבלה ומקשרים אותה לחשבונית המתאימה.</li>
              </ol>
            </div>
            <div className="border border-ink/15 bg-cream-2 p-5">
              <h3 className="font-bold text-ink mb-2">3. עוסק פטור</h3>
              <ol className="list-decimal list-inside space-y-2 text-sm leading-relaxed text-ink/70">
                <li>מאשרים הצעה או הזמנה ושומרים את פרטי העסקה.</li>
                <li>מוציאים חשבונית עסקה; אין בה מע״מ ואין היא מאפשרת ניכוי תשומות.</li>
                <li>עם קבלת התשלום מוציאים קבלה. מספר הקצאה אינו שייך למסמכים אלה.</li>
              </ol>
            </div>
          </div>
          <p className="text-sm text-ink/65 leading-relaxed mt-4">
            ״בסיס מזומן״ אינו בחירה חופשית לכל עסקה. אם לא ברור מהו מועד החיוב אצלכם,
            בודקים את סוג העסקה והוראות ניהול הספרים לפני הגדרת תהליך אוטומטי בתוכנה.
          </p>
        </section>

        <section className="mb-10 border border-ink/15 p-5">
          <h2 className="text-2xl font-bold text-ink mb-4">צ׳קליסט מסמכים לפני שמפיקים</h2>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <h3 className="font-bold text-ink mb-2">לפני תחילת העבודה</h3>
              <ul className="list-disc list-inside space-y-2 text-sm leading-relaxed text-ink/70">
                <li>הצעה, הזמנה או הסכם עם תיאור, מחיר, מועדים ותנאי תשלום.</li>
                <li>שם הלקוח, כתובת ומספר עוסק/חברה כשנדרשים למסמך.</li>
                <li>אישור הרישום שלכם במע״מ והגדרת סוג העסקה בתוכנת הנהלת החשבונות.</li>
                <li>
                  בעבודה מול עסק או גוף ציבורי: אישורים עדכניים של ניכוי מס במקור וניהול
                  ספרים, אם הלקוח דורש אותם.
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-ink mb-2">בעת חיוב ותשלום</h3>
              <ul className="list-disc list-inside space-y-2 text-sm leading-relaxed text-ink/70">
                <li>תאריך החיוב, תיאור מדויק והפניה להזמנה או לתעודת משלוח, אם רלוונטי.</li>
                <li>בדיקת מספר הקצאה לפני סגירת חשבונית מס שעומדת בתנאי המודל.</li>
                <li>אסמכתת בנק או סליקה וקבלה לכל תקבול, לרבות מקדמה.</li>
                <li>אישור ניכוי מס במקור מהלקוח והתאמה בין הברוטו, הנטו והניכוי.</li>
              </ul>
            </div>
          </div>
          <p className="text-sm text-ink/70 mt-4">
            להסבר על בדיקת אישורים, תוקף וניכוי בתשלום ראו{' '}
            <Link href="/self-employed/withholding-tax" className="text-gold underline">
              אישור ניכוי מס במקור וניהול ספרים
            </Link>
            . שליחת עותק האישור בידי הספק אינה מחליפה את בדיקת המשלם במערכת הרשמית.
          </p>
        </section>

        <div className="guide-copy prose prose-lg max-w-none text-ink leading-relaxed">
          <h2 id="allocation" className="scroll-mt-40">חשבוניות ישראל — מספרי הקצאה 2026</h2>
          <p>
            מספר הקצאה הוא מספר בן תשע ספרות שמתקבל מרשות המסים ומתווסף למספר האסמכתה
            של חשבונית המס. לפי הוראת הביצוע לשנת 2026, בודקים יחד ארבעה תנאים:
          </p>
          <ol>
            <li>סכום חשבונית המס, ללא מע״מ, <strong>עולה</strong> על הסף בתקופה הרלוונטית.</li>
            <li>חשבונית המס כוללת רכיב מע״מ.</li>
            <li>הלקוח או מקבל החשבונית רשום כעוסק מורשה.</li>
            <li>הלקוח דרש מספר הקצאה כתנאי לניכוי מס התשומות.</li>
          </ol>
          <p>
            חשבונית הכוללת רק עסקאות פטורות או עסקאות בשיעור אפס אינה נדרשת למספר לפי
            ההוראה. אפשר לבקש מספר הקצאה גם מתחת לסף, אך זו אינה אותה חובת בקשה.
          </p>
        </div>

        {/* Allocation number threshold table */}
        <div className="overflow-x-auto my-6 not-prose">
          <table className="w-full text-sm border border-ink/15 rounded-none overflow-hidden">
            <thead className="bg-cream-2">
              <tr className="text-right">
                <th className="p-3 font-bold text-ink border-b border-ink/15">תקופה</th>
                <th className="p-3 font-bold text-ink border-b border-ink/15">סף (לפני מע&quot;מ)</th>
                <th className="p-3 font-bold text-ink border-b border-ink/15">משמעות</th>
              </tr>
            </thead>
            <tbody className="text-ink/70">
              <tr className="bg-cream-2/50">
                <td className="p-3 border-b font-medium text-ink">
                  {ALLOCATION_PERIOD_LABELS_2026.januaryToMay}
                </td>
                <td className="p-3 border-b font-bold text-ink">
                  {formatNis(ALLOCATION_THRESHOLDS_2026.januaryToMay.threshold)}
                </td>
                <td className="p-3 border-b">
                  רק סכום העולה על{' '}
                  {formatNis(ALLOCATION_THRESHOLDS_2026.januaryToMay.threshold)}, ובכפוף
                  ליתר תנאי המודל
                </td>
              </tr>
              <tr>
                <td className="p-3 font-medium text-red-800">
                  {ALLOCATION_PERIOD_LABELS_2026.fromJune}
                </td>
                <td className="p-3 font-bold text-red-800">
                  {formatNis(ALLOCATION_THRESHOLDS_2026.fromJune.threshold)}
                </td>
                <td className="p-3">
                  רק סכום העולה על{' '}
                  {formatNis(ALLOCATION_THRESHOLDS_2026.fromJune.threshold)}, ובכפוף ליתר
                  תנאי המודל
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-cream-2 border border-ink/15 rounded-none p-4 mb-8 not-prose">
          <p className="font-bold text-ink mb-1">איך מקבלים מספר הקצאה?</p>
          <p className="text-ink/70 text-sm leading-relaxed">
            באמצעות תוכנה המחוברת לשירותי רשות המסים, או ביישום הייעודי באתר הרשות למי
            שמשתמש בפנקס ידני או בתוכנה שאינה מחוברת. לפני סגירת המסמך ודאו שהמספר
            שהתקבל מופיע על חשבונית המס.
          </p>
          <ul className="mt-3 space-y-1 text-sm leading-relaxed text-ink/70">
            <li>
              <strong>
                בתקופה {ALLOCATION_PERIOD_LABELS_2026.januaryToMay}, סכום{' '}
                {formatNis(ALLOCATION_THRESHOLDS_2026.januaryToMay.threshold)} לפני מע״מ:
              </strong>{' '}
              הסכום שווה לסף ולא עולה עליו, ולכן תנאי הסכום לבדו אינו מחייב הקצאה.
            </li>
            <li>
              <strong>
                באותה תקופה, סכום{' '}
                {formatNis(ALLOCATION_THRESHOLDS_2026.januaryToMay.threshold + 1)} לפני מע״מ:
              </strong>{' '}
              ממשיכים לבדוק רכיב מע״מ, רישום הלקוח כעוסק מורשה ודרישתו למספר.
            </li>
            <li>
              <strong>
                {ALLOCATION_PERIOD_LABELS_2026.fromJune}, סכום{' '}
                {formatNis(ALLOCATION_THRESHOLDS_2026.fromJune.threshold + 1)} לפני מע״מ:
              </strong>{' '}
              הסכום עבר את הסף; עדיין נדרשים יתר התנאים.
            </li>
          </ul>
        </div>

        <div className="guide-copy prose prose-lg max-w-none text-ink leading-relaxed">
          <h2 id="digital-records" className="scroll-mt-40">מסמכים דיגיטליים — מה מותר?</h2>
          <p>
            אפשר להפיק ולשמור מסמכים ממוחשבים לפי הוראות ניהול הספרים. קובץ PDF לבדו
            אינו מוכיח עמידה בכל הדרישות; בדקו את התוכנה, אופן המסירה והשמירה. בין הנתונים
            שיש לבדוק:
          </p>
          <ul>
            <li>
              <strong>פרטי המסמך:</strong> בודקים את הכותרת הנכונה, פרטי המנפיק, המספור,
              התאריך, פרטי הלקוח הנדרשים, תיאור העסקה והסכומים המתאימים לסוג המסמך.
            </li>
            <li>
              <strong>מספר הקצאה:</strong> יש לבדוק אם נדרש לפי סוג החשבונית, סכומה ותנאי
              מודל חשבוניות ישראל.
            </li>
            <li>
              <strong>שמירה ואחזור:</strong> המסמך והרישום צריכים להישאר קריאים, ניתנים
              לאיתור ולשחזור במשך תקופת השמירה. פועלים לפי דרישות הגיבוי של מערכת ממוחשבת.
            </li>
            <li>
              <strong>רצף וביטולים:</strong> לא מוחקים מסמך סופי ולא ממחזרים מספר. מתעדים
              ביטול או תיקון כך שהרצף החשבונאי נשמר.
            </li>
          </ul>

          <h2>כמה זמן שומרים את מערכת החשבונות?</h2>
          <p>
            לפי הוראות ניהול הספרים, יש לשמור את מערכת החשבונות <strong>שבע שנים מתום שנת המס
            או שש שנים מיום הגשת הדוח על ההכנסה לאותה שנה, לפי המאוחר</strong>. בדקו עם מייצג
            אילו מסמכים הם חלק ממערכת החשבונות ואילו כללים חלים על מסמכים אחרים.
          </p>
          <p>
            <a href="https://www.gov.il/BlobFolder/policy/income-tax-professional-inst-02-2012/he/Policy_IncomeTaxInst_hoz02-2012.pdf" target="_blank" rel="noopener noreferrer" className="text-gold underline">להנחיית רשות המסים על שמירת מערכת החשבונות ↗</a>
          </p>

          <h2 id="corrections" className="scroll-mt-40">איך מתקנים מסמך בלי למחוק את ההיסטוריה?</h2>
          <ol>
            <li>
              <strong>בודקים אם זו טיוטה או מסמך סופי.</strong> טיוטה אפשר לתקן לפני
              הפקה; מסמך סופי נשאר ברצף ואין לשכתב אותו.
            </li>
            <li>
              <strong>מסווגים את השינוי.</strong> ביטול עסקה, שינוי בתנאים, טעות בחשבונית
              או שינוי בסכום עשויים להצדיק הודעת זיכוי לפי סעיף 49 ותקנה 23א.
            </li>
            <li>
              <strong>מתקנים רק את מה שנדרש.</strong> אם העסקה עדיין קיימת ונדרש חיוב
              נכון, מפיקים מסמך מתקן בהתאם. לא כל שגיאת מלל מחייבת ביטול מלא והנפקה מחדש.
            </li>
            <li>
              <strong>קושרים בין המסמכים.</strong> שומרים אסמכתאות, מוסרים ללקוח את מסמך
              התיקון ובודקים מחדש מספר הקצאה כאשר השינוי נוגע לסכום או לחשבונית המס.
            </li>
          </ol>

          <h2>טעויות נפוצות שכדאי להכיר</h2>
        </div>

        {/* Common mistakes table */}
        <div className="overflow-x-auto my-6 not-prose">
          <table className="w-full text-sm border border-ink/15 rounded-none overflow-hidden">
            <thead className="bg-cream-2">
              <tr className="text-right">
                <th className="p-3 font-bold text-ink border-b border-ink/15">הטעות</th>
                <th className="p-3 font-bold text-ink border-b border-ink/15">מה קורה בפועל</th>
                <th className="p-3 font-bold text-ink border-b border-ink/15">מה לעשות</th>
              </tr>
            </thead>
            <tbody className="text-ink/70">
              <tr>
                <td className="p-3 border-b text-red-700 font-medium">
                  עוסק פטור מנפיק &quot;חשבונית מס&quot;
                </td>
                <td className="p-3 border-b">המסמך אינו מסמך שעוסק פטור רשאי להוציא</td>
                <td className="p-3 border-b">חשבונית עסקה לתיעוד; קבלה עם קבלת תקבול</td>
              </tr>
              <tr className="bg-cream-2/50">
                <td className="p-3 border-b text-red-700 font-medium">
                  חשבונית מעל הסף העדכני ללא מספר הקצאה, כשהוא נדרש
                </td>
                <td className="p-3 border-b">
                  ניכוי מס התשומות של הלקוח עלול להימנע
                </td>
                <td className="p-3 border-b">לברר מול רשות המסים או המייצג את דרך התיקון</td>
              </tr>
              <tr>
                <td className="p-3 border-b text-red-700 font-medium">
                  שינוי חשבונית שכבר נמסרה
                </td>
                <td className="p-3 border-b">
                  שכתוב המסמך שובר את עקבות הרישום ואינו דרך תיקון תקינה
                </td>
                <td className="p-3 border-b">
                  לבחור זיכוי או מסמך מתקן לפי סוג הטעות; לא לבטל אוטומטית כל מסמך
                </td>
              </tr>
              <tr className="bg-cream-2/50">
                <td className="p-3 border-b text-red-700 font-medium">פערים במספרי החשבוניות</td>
                <td className="p-3 border-b">
                  חסר תיעוד שמסביר מה קרה למסמך ברצף
                </td>
                <td className="p-3 border-b">לא למחוק או למחזר מספר; לתעד ביטול ותיקון</td>
              </tr>
              <tr>
                <td className="p-3 border-b text-red-700 font-medium">
                  חוסר בפרטי הלקוח על החשבונית
                </td>
                <td className="p-3 border-b">
                  החשבונית עלולה שלא להיחשב כמסמך שהוצא כדין
                </td>
                <td className="p-3 border-b">לבדוק את פרטי החובה לפי סוג המסמך והעסקה</td>
              </tr>
              <tr className="bg-cream-2/50">
                <td className="p-3 text-red-700 font-medium">
                  הוצאת חשבונית זמן רב אחרי העסקה
                </td>
                <td className="p-3">
                  14 הימים נספרים ממועד החיוב במס, לא מכל תאריך שנוח לבחור
                </td>
                <td className="p-3">לזהות תחילה את מועד החיוב ולתזמן ממנו את ההפקה</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Related links */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-ink mb-4">מדריכים קשורים</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              {
                href: '/self-employed/vat',
                label: 'מחשבון מע"מ לעצמאי',
                desc: 'חישוב מע"מ, דיווח שוטף ומה מותר לקזז',
              },
              {
                href: '/self-employed/withholding-tax',
                label: 'אישור ניכוי מס במקור וניהול ספרים',
                desc: 'בדיקת אישורים והתאמת תשלום שהלקוח ניכה ממנו מס',
              },
            ].map((c) => (
              <Link
                key={c.href}
                href={c.href}
                className="group flex flex-col gap-1 border border-ink/15 rounded-none p-4 hover:bg-paper-hover transition"
              >
                <span className="font-medium text-ink group-hover:text-gold transition flex items-center justify-between">
                  {c.label}
                  <span className="text-gold group-hover:-translate-x-1 transition" aria-hidden>
                    ←
                  </span>
                </span>
                <span className="text-sm text-ink/70">{c.desc}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="mb-10 scroll-mt-40">
          <h2 className="text-2xl font-bold text-ink mb-6">שאלות נפוצות</h2>
          <div className="space-y-4">
            {faqItems.map((f) => (
              <details key={f.question} className="border border-ink/15 rounded-none p-4 group">
                <summary className="font-bold text-ink cursor-pointer list-none flex items-center justify-between">
                  {f.question}
                  <span className="text-ink/70 group-open:rotate-180 transition" aria-hidden>
                    ▾
                  </span>
                </summary>
                <p className="text-ink/70 mt-3 leading-relaxed">{f.answer}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Sources */}
        <section className="mb-10 border-t border-ink/15 pt-8">
          <h2 className="text-lg font-bold text-ink/70 mb-3">מקורות</h2>
          <ul className="text-sm text-ink/70 space-y-1 list-disc list-inside">
            <li>
              <a href="https://www.btl.gov.il/Laws1/00_0022_000000.pdf" target="_blank" rel="noopener noreferrer" className="underline hover:text-ink">
                נוסח חוק מע״מ — סעיפים 45–47: חשבונית עסקה, 14 יום וחריג בסיס מזומן
              </a>
            </li>
            <li>
              <a href="https://www.gov.il/BlobFolder/policy/vat_11/he/vat_represent-info-051224-2.pdf" target="_blank" rel="noopener noreferrer" className="underline hover:text-ink">
                רשות המסים — מועד החיוב בעסקאות ושירותים
              </a>
            </li>
            <li>
              <a href="https://www.gov.il/BlobFolder/policy/inst-071225-1/he/vat_inst-071225-1.pdf" target="_blank" rel="noopener noreferrer" className="underline hover:text-ink">
                רשות המסים — הוראת ביצוע 01/2025, תנאי מספרי הקצאה וספי 2026
              </a>
            </li>
            <li>
              <a href="https://www.gov.il/BlobFolder/policy/procedures-020226-1/he/vat_procedures-020226-1.pdf" target="_blank" rel="noopener noreferrer" className="underline hover:text-ink">
                רשות המסים — נייר עמדה 01/2026, התנאים להודעת זיכוי
              </a>
            </li>
            <li>
              <a href="https://www.gov.il/BlobFolder/policy/inst-02-2026/he/IncomeTax_inst-02-2026.pdf" target="_blank" rel="noopener noreferrer" className="underline hover:text-ink">
                רשות המסים — הוראת ביצוע 02/2026, אישורי ניכוי מס וניהול ספרים
              </a>
            </li>
            <li>
              <a href="https://www.gov.il/BlobFolder/policy/income-tax-professional-inst-02-2012/he/Policy_IncomeTaxInst_hoz02-2012.pdf" target="_blank" rel="noopener noreferrer" className="underline hover:text-ink">
                רשות המסים — שמירת מערכת חשבונות ומסמכים דיגיטליים
              </a>
            </li>
          </ul>
          <p className="text-xs text-ink/70 mt-3">
            עודכן לאחרונה: {lastUpdated}. המידע לצורכי הכוונה כללית בלבד ואינו מהווה ייעוץ משפטי
            או מיסויי. לפני החלטה — יש להתייעץ עם רואה חשבון.
          </p>
        </section>

        <section className="mb-8">
          <CourseCTA path={PAGE_PATH} courseId="cpa" placement="self-employed" />
        </section>

        <section className="mb-8">
          <AuthorBox />
        </section>
      </article>
    </div>
  );
}
