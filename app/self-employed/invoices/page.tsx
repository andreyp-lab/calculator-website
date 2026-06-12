import type { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/calculator/Breadcrumbs';
import { AuthorBox } from '@/components/calculator/AuthorBox';
import { CourseCTA } from '@/components/marketing/CourseCTA';

const PAGE_PATH = '/self-employed/invoices';
const SITE_URL = 'https://cheshbonai.co.il';

export const metadata: Metadata = {
  title: 'חשבונית מס, חשבונית עסקה או קבלה? המדריך המלא לעצמאים 2026',
  description:
    'ההבדל בין חשבונית מס, חשבונית עסקה וקבלה — מי מנפיק מה ומתי. חשבוניות ישראל, מספרי הקצאה, ספי 10,000 ₪ ו-5,000 ₪, חובת שמירה 7 שנים. מדריך עדכני לעצמאים ב-2026.',
  alternates: { canonical: PAGE_PATH },
  openGraph: {
    title: 'חשבונית מס, חשבונית עסקה או קבלה? המדריך המלא לעצמאים 2026',
    description:
      'מי מנפיק חשבונית מס ומי לא, מספרי הקצאה בחשבוניות ישראל, חובת שמירה 7 שנים וטעויות נפוצות.',
    type: 'article',
    locale: 'he_IL',
  },
};

const faqItems = [
  {
    question: 'מה ההבדל בין חשבונית מס לחשבונית עסקה?',
    answer:
      'חשבונית מס מנפיקה רק עוסק מורשה או חברה — היא מאפשרת ללקוח לקזז מע"מ תשומות. חשבונית עסקה היא דרישת תשלום (כמו הצעת מחיר מחייבת) שיכולה להנפיק גם עוסק פטור, אך אינה מזכה את מקבלה בקיזוז מע"מ.',
  },
  {
    question: 'האם עוסק פטור יכול להנפיק חשבונית מס?',
    answer:
      'לא. עוסק פטור אינו גובה מע"מ ולכן אינו מנפיק חשבונית מס. הוא מנפיק קבלה ו/או חשבונית עסקה. לקוחות עסקיים שמעוניינים לקזז מע"מ יצטרכו לקנות מעוסק מורשה.',
  },
  {
    question: 'מהו מספר הקצאה ומה הסף שלו ב-2026?',
    answer:
      'מספר הקצאה הוא אישור שמנפיקה רשות המסים לכל חשבונית מס מעל סכום מסוים. מ-1.1.2026 — חשבוניות מס מעל 10,000 ₪ (לפני מע"מ) חייבות במספר הקצאה. מ-1.6.2026 הסף יורד ל-5,000 ₪. חשבונית מעל הסף ללא מספר הקצאה עלולה להיפסל ולמנוע קיזוז מע"מ אצל הקונה.',
  },
  {
    question: 'מה זה חשבונית מס-קבלה?',
    answer:
      'מסמך משולב שמנפיק עוסק מורשה או חברה כשהתשלום מתקבל באותו מעמד שמנפיקים את החשבונית. הוא מחליף גם את החשבונית וגם את הקבלה, ולכן פשוט יותר לניהול. מי שמקבל תשלום לאחר מכן — מנפיק קודם חשבונית מס ואחר כך קבלה בנפרד.',
  },
  {
    question: 'תוך כמה זמן חייבים להוציא חשבונית מס?',
    answer:
      'לפי הוראות ניהול ספרים — תוך 14 יום ממועד החיוב במס (בעיקרון, מועד ביצוע העסקה). בפרקטיקה נוהגים להוציא את החשבונית סמוך מאוד לאספקת השירות או הסחורה.',
  },
  {
    question: 'כמה זמן חייבים לשמור חשבוניות ומסמכים עסקיים?',
    answer:
      '7 שנים מתום שנת המס שבה נרשמה העסקה. זהו כלל האצבע הפרקטי לפי הוראות ניהול ספרים. מסמכים מסוימים (כגון חוזים לנכסים) טוב לשמור גם מעבר לכך.',
  },
  {
    question: 'אפשר להנפיק חשבוניות דיגיטליות?',
    answer:
      'כן. מסמכים דיגיטליים (PDF שנוצר בתוכנה מוסמכת ונשמר במקור דיגיטלי) מוכרים כחוקיים לחלוטין. חשוב שהמסמך יכלול את כל הפרטים הנדרשים (שם, ח.פ./ע.מ., סכומים, מספר הקצאה אם נדרש) ושיישמר בצורה שמאפשרת לאחזרו בביקורת.',
  },
  {
    question: 'מה קורה אם הנפקתי חשבונית מס מעל 10,000 ₪ בלי מספר הקצאה?',
    answer:
      'החשבונית עלולה להיפסל בביקורת מע"מ, והקונה לא יוכל לקזז את מע"מ התשומות שלו. יש לפנות מיד לרשות המסים, לבטל את החשבונית ולהנפיק חשבונית חדשה עם מספר הקצאה.',
  },
  {
    question: 'האם אפשר לתקן חשבונית שגויה?',
    answer:
      'כן — מבטלים את החשבונית המקורית (חשבונית זיכוי) ומנפיקים חשבונית חדשה. אין לשנות חשבונית שכבר הונפקה ונמסרה ללקוח. רישום הביטול חייב להיות בספרים.',
  },
  {
    question: 'עוסק פטור שעבר לעוסק מורשה — מה קורה לחשבוניות הישנות?',
    answer:
      'החשבוניות הישנות (קבלות וחשבוניות עסקה) בתקופת הפטור תקפות. מרגע הרישום כמורשה — חייבים להתחיל להנפיק חשבוניות מס כולל מע"מ. אי-הנפקת חשבונית מס כמורשה עלולה לגרור קנסות וחיוב מע"מ רטרואקטיבי.',
  },
];

export default function InvoicesPage() {
  const lastUpdated = '2026-06-12';

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'חשבונית מס, חשבונית עסקה או קבלה? המדריך המלא לעצמאים 2026',
    description:
      'ההבדל בין חשבונית מס, חשבונית עסקה וקבלה, מי מנפיק מה, מספרי הקצאה 2026, חובת שמירה 7 שנים וטעויות נפוצות.',
    inLanguage: 'he-IL',
    datePublished: '2026-06-12',
    dateModified: lastUpdated,
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
      {
        '@type': 'ListItem',
        position: 3,
        name: 'חשבוניות ומסמכים',
        item: `${SITE_URL}${PAGE_PATH}`,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-white" dir="rtl">
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
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            חשבונית מס, חשבונית עסקה או קבלה? המדריך המלא לעצמאים 2026
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            איזה מסמך מנפיקים, מתי, ולמי — ומה ההבדל הקריטי בין עוסק פטור לעוסק מורשה. כולל
            מספרי הקצאה, חשבוניות ישראל וטעויות שעולות כסף.
          </p>
          <p className="text-sm text-gray-500 mt-3">
            נכתב על ידי אנדרי פלטונוב, רו&quot;ח · עודכן {lastUpdated}
          </p>
        </header>

        <div className="prose prose-lg max-w-none text-gray-800 leading-relaxed">
          <h2>סוגי המסמכים — טבלת מפתח</h2>
          <p>
            ישנם ארבעה מסמכים עיקריים שעצמאי עשוי להנפיק. ההחלטה מי מנפיק מה תלויה לגמרי
            בסיווג שלך אצל רשות המסים — עוסק פטור או עוסק מורשה.
          </p>
        </div>

        {/* Main document type table */}
        <div className="overflow-x-auto my-6 not-prose">
          <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-gray-50">
              <tr className="text-right">
                <th className="p-3 font-bold text-gray-700 border-b">סוג מסמך</th>
                <th className="p-3 font-bold text-gray-700 border-b">מי מנפיק</th>
                <th className="p-3 font-bold text-gray-700 border-b">מתי</th>
                <th className="p-3 font-bold text-gray-700 border-b">דוגמה מעשית</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              <tr>
                <td className="p-3 border-b font-semibold text-blue-800">חשבונית מס</td>
                <td className="p-3 border-b">
                  <strong>עוסק מורשה או חברה בלבד.</strong>{' '}
                  <span className="text-red-700 font-medium">עוסק פטור — אסור</span>
                </td>
                <td className="p-3 border-b">
                  בעת ביצוע העסקה / אספקת השירות (תוך 14 יום מהחיוב)
                </td>
                <td className="p-3 border-b">
                  מעצב גרפי (מורשה) מסיים פרויקט ומנפיק חשבונית מס ב-11,800 ₪ כולל מע&quot;מ
                </td>
              </tr>
              <tr className="bg-gray-50/50">
                <td className="p-3 border-b font-semibold text-purple-800">חשבונית מס-קבלה</td>
                <td className="p-3 border-b">עוסק מורשה או חברה בלבד</td>
                <td className="p-3 border-b">כשהתשלום מתקבל באותו מעמד שמנפיקים את החשבונית</td>
                <td className="p-3 border-b">
                  אינסטלטור (מורשה) גומר עבודה ומקבל מזומן — מנפיק מסמך אחד במקום שניים
                </td>
              </tr>
              <tr>
                <td className="p-3 border-b font-semibold text-orange-800">חשבונית עסקה</td>
                <td className="p-3 border-b">עוסק מורשה ועוסק פטור</td>
                <td className="p-3 border-b">
                  דרישת תשלום לפני קבלת התמורה; לא מאפשרת קיזוז מע&quot;מ אצל הקונה
                </td>
                <td className="p-3 border-b">
                  מנחה סדנאות (פטור) שולחת חשבונית עסקה עם פירוט השירות לפני קבלת התשלום
                </td>
              </tr>
              <tr className="bg-gray-50/50">
                <td className="p-3 font-semibold text-emerald-800">קבלה</td>
                <td className="p-3">עוסק מורשה ועוסק פטור</td>
                <td className="p-3">עם קבלת התשלום בפועל</td>
                <td className="p-3">
                  פסיכולוג (פטור) מקבל תשלום בסוף הפגישה ומנפיק קבלה על 400 ₪
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Critical distinction callout */}
        <div className="bg-amber-50 border border-amber-300 rounded-lg p-4 mb-8 not-prose">
          <p className="font-bold text-amber-900 mb-1">ההבחנה הקריטית: עוסק פטור לא מנפיק חשבונית מס</p>
          <p className="text-amber-800 text-sm leading-relaxed">
            עוסק פטור אינו גובה מע&quot;מ ולכן <strong>אינו רשאי</strong> להנפיק חשבונית מס.
            הנפקת חשבונית מס כשאתה פטור היא עבירה. הוא מנפיק קבלה ו/או חשבונית עסקה בלבד.
            לקוחות עסקיים (חברות, עוסקים מורשים) שמחפשים לקזז מע&quot;מ — לא יוכלו לעשות
            זאת ממסמכי עוסק פטור.
          </p>
        </div>

        <div className="prose prose-lg max-w-none text-gray-800 leading-relaxed">
          <h2>חשבוניות ישראל — מספרי הקצאה 2026</h2>
          <p>
            מ-2024 רשות המסים מחייבת קבלת <strong>מספר הקצאה</strong> (אישור ממחולל חשבוניות
            ישראל) עבור חשבוניות מס מעל סכומים מסוימים. ללא מספר ההקצאה, הקונה לא יוכל לקזז
            את מע&quot;מ התשומות.
          </p>
        </div>

        {/* Allocation number threshold table */}
        <div className="overflow-x-auto my-6 not-prose">
          <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-gray-50">
              <tr className="text-right">
                <th className="p-3 font-bold text-gray-700 border-b">תקופה</th>
                <th className="p-3 font-bold text-gray-700 border-b">סף (לפני מע&quot;מ)</th>
                <th className="p-3 font-bold text-gray-700 border-b">משמעות</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              <tr>
                <td className="p-3 border-b font-medium">עד 31.12.2025</td>
                <td className="p-3 border-b">20,000 ₪</td>
                <td className="p-3 border-b">הסף הקודם</td>
              </tr>
              <tr className="bg-gray-50/50">
                <td className="p-3 border-b font-medium text-blue-800">1.1.2026 – 31.5.2026</td>
                <td className="p-3 border-b font-bold text-blue-800">10,000 ₪</td>
                <td className="p-3 border-b">
                  חשבונית מס מעל 10,000 ₪ חייבת במספר הקצאה לפני הנפקה
                </td>
              </tr>
              <tr>
                <td className="p-3 font-medium text-red-800">מ-1.6.2026 ואילך</td>
                <td className="p-3 font-bold text-red-800">5,000 ₪</td>
                <td className="p-3">
                  הסף יורד — חשוב לוודא שמערכת החשבוניות מעודכנת
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8 not-prose">
          <p className="font-bold text-blue-900 mb-1">איך מקבלים מספר הקצאה?</p>
          <p className="text-blue-800 text-sm leading-relaxed">
            דרך מערכת &quot;חשבוניות ישראל&quot; של רשות המסים, שמחוברת אוטומטית לתוכנות
            חשבוניות מוכרות (Green Invoice, iCount, Invoice4U ואחרות). בעת הנפקה מעל הסף,
            המערכת פונה לרשות המסים ומקבלת מספר הקצאה שמוטבע על גבי החשבונית.
          </p>
        </div>

        <div className="prose prose-lg max-w-none text-gray-800 leading-relaxed">
          <h2>מסמכים דיגיטליים — מה מותר?</h2>
          <p>
            חשבוניות ומסמכים שנוצרו דיגיטלית (PDF שנשמר בצורה מקורית) מוכרים לחלוטין. אין
            צורך להדפיס ולשמור פיזית — אבל יש כמה תנאים:
          </p>
          <ul>
            <li>
              <strong>פרטי חובה:</strong> שם בית העסק, ח.פ./ע.מ., שם ומען הלקוח, תאריך, מספר
              חשבונית רציף, תיאור השירות/מוצר, סכום לפני מע&quot;מ, שיעור המע&quot;מ, סכום
              המע&quot;מ, סך הכל לתשלום.
            </li>
            <li>
              <strong>מספר הקצאה:</strong> חובה על מסמכים מעל הסף — חייב להופיע על גבי
              החשבונית.
            </li>
            <li>
              <strong>שמירה:</strong> גיבוי ענן אמין שמאפשר שחזור בביקורת.
            </li>
            <li>
              <strong>רצף מספרים:</strong> חשבוניות ממוספרות ברצף, ללא פערים.
            </li>
          </ul>

          <h2>חובת שמירת מסמכים — 7 שנים</h2>
          <p>
            לפי הוראות ניהול ספרים, יש לשמור <strong>7 שנים</strong> מתום שנת המס. חשבוניות,
            קבלות, הסכמים, תדפיסי בנק, קופה רושמת — כולם נכללים בחובה זו. דרישה זו חלה
            במקביל על מסמכים נייריים ודיגיטליים.
          </p>
          <p>
            למה 7 שנים? רשות המסים רשאית לפתוח שומה עד 4 שנים לאחר הגשת הדוח (בחשד להעלמה
            — עד 7 שנים). ביטוח לאומי רשאי לדרוש בדיקה לתקופה דומה.
          </p>

          <h2>טעויות נפוצות שכדאי להכיר</h2>
        </div>

        {/* Common mistakes table */}
        <div className="overflow-x-auto my-6 not-prose">
          <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-gray-50">
              <tr className="text-right">
                <th className="p-3 font-bold text-gray-700 border-b">הטעות</th>
                <th className="p-3 font-bold text-gray-700 border-b">מה קורה בפועל</th>
                <th className="p-3 font-bold text-gray-700 border-b">מה לעשות</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              <tr>
                <td className="p-3 border-b text-red-700 font-medium">
                  עוסק פטור מנפיק &quot;חשבונית מס&quot;
                </td>
                <td className="p-3 border-b">עבירה על חוק מע&quot;מ; חשיפה לקנסות</td>
                <td className="p-3 border-b">להנפיק קבלה / חשבונית עסקה בלבד</td>
              </tr>
              <tr className="bg-gray-50/50">
                <td className="p-3 border-b text-red-700 font-medium">
                  חשבונית מעל 10,000 ₪ ללא מספר הקצאה
                </td>
                <td className="p-3 border-b">
                  הלקוח לא יוכל לקזז מע&quot;מ; החשבונית תיפסל בביקורת
                </td>
                <td className="p-3 border-b">לבטל ולהנפיק מחדש עם מספר הקצאה</td>
              </tr>
              <tr>
                <td className="p-3 border-b text-red-700 font-medium">
                  שינוי חשבונית שכבר נמסרה
                </td>
                <td className="p-3 border-b">
                  אסור לשנות — נחשב זיוף מסמך
                </td>
                <td className="p-3 border-b">
                  לבטל בחשבונית זיכוי ולהנפיק חשבונית חדשה
                </td>
              </tr>
              <tr className="bg-gray-50/50">
                <td className="p-3 border-b text-red-700 font-medium">פערים במספרי החשבוניות</td>
                <td className="p-3 border-b">
                  מעורר חשד בביקורת — פקיד שומה ידרוש הסבר
                </td>
                <td className="p-3 border-b">לשמור על מספור רציף; לתעד ביטולים</td>
              </tr>
              <tr>
                <td className="p-3 border-b text-red-700 font-medium">
                  חוסר בפרטי הלקוח על החשבונית
                </td>
                <td className="p-3 border-b">
                  הלקוח לא יוכל לקזז מע&quot;מ; פגם פורמלי
                </td>
                <td className="p-3 border-b">לכלול שם, כתובת ומספר ע.מ./ח.פ. של הלקוח</td>
              </tr>
              <tr className="bg-gray-50/50">
                <td className="p-3 text-red-700 font-medium">
                  הוצאת חשבונית זמן רב אחרי העסקה
                </td>
                <td className="p-3">
                  עיכוב מעל 14 יום עלול לגרום לקנס ניהול ספרים
                </td>
                <td className="p-3">להנפיק סמוך לאספקת השירות/מוצר</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Related links */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">מדריכים קשורים</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              {
                href: '/self-employed/opening-business',
                label: 'פתיחת עסק — עוסק פטור או מורשה?',
                desc: 'ההבדלים, תהליך הרישום ושאלות מפתח בתחילת הדרך',
              },
              {
                href: '/self-employed/vat',
                label: 'מחשבון מע"מ לעצמאי',
                desc: 'חישוב מע"מ, דיווח שוטף ומה מותר לקזז',
              },
              {
                href: '/self-employed/vat-threshold',
                label: 'תקרת עוסק פטור 2026',
                desc: 'כיצד מחושבת תקרת 122,833 ₪ ומה קורה כשחוצים אותה',
              },
            ].map((c) => (
              <Link
                key={c.href}
                href={c.href}
                className="group flex flex-col gap-1 border border-gray-200 rounded-lg p-4 hover:border-blue-400 hover:shadow-sm transition"
              >
                <span className="font-medium text-gray-900 group-hover:text-blue-700 transition flex items-center justify-between">
                  {c.label}
                  <span className="text-blue-600 group-hover:-translate-x-1 transition" aria-hidden>
                    ←
                  </span>
                </span>
                <span className="text-sm text-gray-500">{c.desc}</span>
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
                  <span className="text-gray-400 group-open:rotate-180 transition" aria-hidden>
                    ▾
                  </span>
                </summary>
                <p className="text-gray-700 mt-3 leading-relaxed">{f.answer}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Sources */}
        <section className="mb-10 border-t border-gray-100 pt-8">
          <h2 className="text-lg font-bold text-gray-700 mb-3">מקורות</h2>
          <ul className="text-sm text-gray-500 space-y-1 list-disc list-inside">
            <li>
              <a
                href="https://www.kolzchut.org.il/he/%D7%A2%D7%95%D7%A1%D7%A7_%D7%A4%D7%98%D7%95%D7%A8"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-gray-700"
              >
                כל-זכות — עוסק פטור
              </a>
            </li>
            <li>
              <a
                href="https://www.greeninvoice.co.il/magazine/israel-invoice/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-gray-700"
              >
                Green Invoice — חשבוניות ישראל ומספרי הקצאה 2026
              </a>
            </li>
            <li>
              <a
                href="https://bakertilly.co.il/blog-invoices-2026.html"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-gray-700"
              >
                Baker Tilly — חשבוניות ישראל 2026
              </a>
            </li>
            <li>
              הוראות ניהול ספרים — חובת שמירה 7 שנים (רשות המסים)
            </li>
            <li>
              <a
                href="https://www.kolzchut.org.il/he/%D7%9E%D7%A1_%D7%AA%D7%A9%D7%95%D7%9E%D7%95%D7%AA"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-gray-700"
              >
                כל-זכות — מס תשומות
              </a>
            </li>
          </ul>
          <p className="text-xs text-gray-400 mt-3">
            עודכן לאחרונה: {lastUpdated}. המידע לצורכי הכוונה כללית בלבד ואינו מהווה ייעוץ משפטי
            או מיסויי. לפני החלטה — יש להתייעץ עם רואה חשבון.
          </p>
        </section>

        <section className="mb-8">
          <CourseCTA />
        </section>

        <section className="mb-8">
          <AuthorBox />
        </section>
      </article>
    </div>
  );
}
