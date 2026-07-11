import type { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/calculator/Breadcrumbs';
import { AuthorBox } from '@/components/calculator/AuthorBox';
import { CourseCTA } from '@/components/marketing/CourseCTA';

const PAGE_PATH = '/self-employed/business-setup-cost';
const SITE_URL = 'https://cheshbonai.co.il';

export const metadata: Metadata = {
  title: 'כמה עולה לפתוח עסק ב-2026? כל העלויות בשקלים',
  description:
    'טבלאות עלות מפורטות לפתיחת עסק בישראל: עוסק פטור, עוסק מורשה וחברה בע"מ. אגרות רשמיות, רו"ח, ביטוח ותוכנה — כמה זה יעלה לך בשנה הראשונה?',
  alternates: { canonical: PAGE_PATH },
  openGraph: {
    title: 'כמה עולה לפתוח עסק ב-2026? כל העלויות בשקלים',
    description:
      'עלויות פתיחת עסק בישראל: עוסק פטור, עוסק מורשה וחברה בע"מ — אגרות, רו"ח, ביטוח, תוכנה ועלות שנה ראשונה כוללת.',
    type: 'article',
    locale: 'he_IL',
  },
};

const faqItems = [
  {
    question: 'כמה עולה לפתוח עוסק פטור?',
    answer:
      'פתיחת עוסק פטור היא חינם — אין אגרת רישום ברשות המסים ואין תשלום לביטוח לאומי. העלות האמיתית היא שירותי רו"ח לדוח שנתי: בין 1,500 ל-4,000 ₪ לשנה, ואופציונלית תוכנת חשבוניות (0–100 ₪/חודש). בשנה ראשונה, עם מינימום שירותים, אפשר להסתדר ב-2,000–4,000 ₪.',
  },
  {
    question: 'כמה עולה לפתוח עוסק מורשה?',
    answer:
      'גם רישום עוסק מורשה חינם מבחינת אגרות. העלות המרכזית היא רו"ח: 3,000–8,000 ₪/שנה (כולל דיווחי מע"מ), בתוספת תוכנת הנהלת חשבונות (50–100 ₪/חודש) וביטוח מקצועי אם נדרש. בשנה ראשונה: בין 4,000 ל-12,000 ₪ בהתאם להיקף.',
  },
  {
    question: 'כמה עולה לפתוח חברה בע"מ?',
    answer:
      'אגרת רישום ברשות התאגידים: כ-2,559 ₪ בהגשה מקוונת (כ-3,123 ₪ בידני). בשנת הקמה פטור מאגרה שנתית. לאחר מכן: 1,338 ₪/שנה (בתשלום עד 31.3) או 1,777 ₪ לאחר מכן. שכ"ט רו"ח לחברה: 8,000–20,000+ ₪/שנה. עלות שנה ראשונה כוללת: 15,000–30,000 ₪ ומעלה.',
  },
  {
    question: 'האם חייבים רואה חשבון כשפותחים עסק?',
    answer:
      'חוקית — לא. אפשר לפתוח עסק לבד. מעשית — מומלץ מאוד, לפחות לייעוץ ראשוני ולדוח השנתי. רו"ח טוב חוסך מס יותר מעלות שכ"ט שלו. עוסק פטור עם מחזור נמוך יכול להסתדר עם רו"ח שמטפל רק בדוח שנתי ועולה 1,500–3,000 ₪.',
  },
  {
    question: 'האם צריך לפתוח חשבון בנק עסקי?',
    answer:
      'אין חובה חוקית לפתוח חשבון נפרד, אך מומלץ מאוד — הפרדת הכספים מפשטת ניהול, מקטינה סיכון בביקורת ומונעת טעויות. חשבון בנק עסקי עולה בממוצע 50–150 ₪/חודש לפי הבנק וסוג הפעילות.',
  },
  {
    question: 'מה ההבדל בין עלות רשמית לעלות שוק?',
    answer:
      'עלות רשמית היא אגרת ממשלתית קבועה בחוק (כמו אגרת רישום חברה — 2,559 ₪). עלות שוק היא מה שמשלמים לרו"ח, לחברת ביטוח או למפתח אתר — טווחים שמשתנים לפי ספק, מורכבות ואיזור. בדף זה מסומנות שתי הקטגוריות בבירור.',
  },
  {
    question: 'האם עוסק פטור חייב לשלם ביטוח לאומי?',
    answer:
      'כן. עוסק פטור חייב בדמי ביטוח לאומי ובריאות כמו כל עצמאי. שיעור מופחת (7.7%) על הכנסה עד 7,703 ₪/חודש, שיעור מלא (18%) על השאר עד תקרה של 51,910 ₪/חודש. "פטור" מתייחס רק למע"מ.',
  },
  {
    question: 'מה אפשר לחסוך בעלויות פתיחת עסק?',
    answer:
      'אפשר לחסוך: פתיחה מקוונת ישירה (ללא רו"ח לשלב הרישום), שימוש בתוכנת חשבוניות חינמית בשלב ראשון, ביטוח מקצועי בכיסוי מינימלי. לא שווה לחסוך: ייעוץ מקצועי לבחירת מסלול (עוסק פטור/מורשה/חברה), ליווי רו"ח לדוח שנתי, ניהול מקדמות מס.',
  },
  {
    question: 'מתי עדיף לפתוח חברה בע"מ ולא עוסק?',
    answer:
      'חברה בע"מ כדאית בדרך כלל ממחזור שנתי של כ-600,000–800,000 ₪ ומעלה, כשיש מספר שותפים, כשמבקשים הגנה אישית (הפרדת אחריות) או כשיש לקוחות עסקיים גדולים שמעדיפים לעבוד מול חברה. ראה ניתוח מפורט בדף ההשוואה.',
  },
  {
    question: 'האם אגרת רישום חברה כוללת שירותי רו"ח?',
    answer:
      'לא. 2,559 ₪ היא אגרת הרישום ברשות התאגידים בלבד. שכ"ט עורך דין/רו"ח להקמה הוא בנוסף — בדרך כלל 2,000–5,000 ₪ חד-פעמי לניסוח תקנון וליווי הליך הרישום, ולאחר מכן שכ"ט שוטף לניהול החברה.',
  },
];

export default function BusinessSetupCostPage() {
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'כמה עולה לפתוח עסק ב-2026? כל העלויות בשקלים',
    description:
      'טבלאות עלות לפתיחת עסק בישראל: עוסק פטור, עוסק מורשה וחברה בע"מ — אגרות, רו"ח, ביטוח ושנה ראשונה.',
    inLanguage: 'he-IL',
    datePublished: '2026-06-12',
    dateModified: '2026-06-12',
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
      { '@type': 'ListItem', position: 3, name: 'עלות פתיחת עסק', item: `${SITE_URL}${PAGE_PATH}` },
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
              { label: 'עלות פתיחת עסק' },
            ]}
          />
        </div>

        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-ink mb-3">
            כמה עולה לפתוח עסק ב-2026? כל העלויות בשקלים
          </h1>
          <p className="text-lg text-ink/70 leading-relaxed">
            טבלאות עלות לפי מסלול: עוסק פטור, עוסק מורשה וחברה בע"מ. הפרדה ברורה בין
            אגרות רשמיות לעלויות שוק, ועלות שנה ראשונה כוללת לכל מסלול.
          </p>
          <p className="text-sm text-ink/60 mt-3">
            נכתב על ידי אנדרי פלטונוב, רו&quot;ח · עודכן ל-2026 · עודכן לאחרונה 2026-06-12
          </p>
        </header>

        {/* Legend */}
        <div className="bg-cream-2 border border-ink/15 rounded-none p-4 mb-8 text-sm text-ink">
          <p className="font-bold mb-2">מקרא</p>
          <ul className="space-y-1">
            <li>
              <span className="inline-block bg-ink text-cream text-xs px-2 py-0.5 ml-1">אגרה רשמית</span>
              — סכום קבוע בחוק/תקנות. אינו משתנה לפי ספק.
            </li>
            <li>
              <span className="inline-block bg-orange-500 text-white text-xs px-2 py-0.5 ml-1">טווח שוק משוער</span>
              — מחיר שוק ממוצע. עשוי להשתנות לפי רו&quot;ח, אזור ומורכבות.
            </li>
          </ul>
        </div>

        <div className="prose prose-lg max-w-none text-ink leading-relaxed">
          <h2>עוסק פטור — עלויות שנה ראשונה</h2>
          <p>
            עוסק פטור הוא המסלול הפשוט ביותר. פתיחת התיקים ברשות המסים ובביטוח לאומי היא חינם.
            העלות מגיעה מהשירותים המקצועיים שבוחרים לצרף.
          </p>
        </div>

        {/* Table: עוסק פטור */}
        <div className="overflow-x-auto my-6 not-prose">
          <table className="w-full text-sm border border-ink/15 rounded-none overflow-hidden">
            <thead className="bg-cream-2">
              <tr className="text-right">
                <th className="p-3 font-bold text-ink border-b border-ink/15">סעיף</th>
                <th className="p-3 font-bold text-ink border-b border-ink/15">עלות</th>
                <th className="p-3 font-bold text-ink border-b border-ink/15">סוג</th>
                <th className="p-3 font-bold text-ink border-b border-ink/15">הערה</th>
              </tr>
            </thead>
            <tbody className="text-ink/70">
              <tr>
                <td className="p-3 border-b font-medium">רישום עוסק פטור (מע&quot;מ + מ&quot;ה + ב&quot;ל)</td>
                <td className="p-3 border-b text-green-700 font-bold">חינם</td>
                <td className="p-3 border-b">
                  <span className="inline-block bg-ink text-cream text-xs px-2 py-0.5">אגרה רשמית</span>
                </td>
                <td className="p-3 border-b text-ink/60">אין אגרת פתיחה</td>
              </tr>
              <tr className="bg-cream-2/50">
                <td className="p-3 border-b font-medium">רו&quot;ח — דוח שנתי</td>
                <td className="p-3 border-b">1,500–4,000 ₪/שנה</td>
                <td className="p-3 border-b">
                  <span className="inline-block bg-orange-500 text-white text-xs px-2 py-0.5">טווח שוק משוער</span>
                </td>
                <td className="p-3 border-b text-ink/60">תלוי היקף ומורכבות</td>
              </tr>
              <tr>
                <td className="p-3 border-b font-medium">תוכנת חשבוניות</td>
                <td className="p-3 border-b">0–100 ₪/חודש</td>
                <td className="p-3 border-b">
                  <span className="inline-block bg-orange-500 text-white text-xs px-2 py-0.5">טווח שוק משוער</span>
                </td>
                <td className="p-3 border-b text-ink/60">חלק מהפלטפורמות חינמיות לעוסק קטן</td>
              </tr>
              <tr className="bg-cream-2/50">
                <td className="p-3 border-b font-medium">ביטוח אחריות מקצועית</td>
                <td className="p-3 border-b">1,000–5,000+ ₪/שנה</td>
                <td className="p-3 border-b">
                  <span className="inline-block bg-orange-500 text-white text-xs px-2 py-0.5">טווח שוק משוער</span>
                </td>
                <td className="p-3 border-b text-ink/60">אופציונלי, תלוי מקצוע</td>
              </tr>
              <tr className="bg-yellow-50 font-bold">
                <td className="p-3 font-bold">עלות שנה ראשונה (הערכה)</td>
                <td className="p-3 text-ink">2,000–8,000 ₪</td>
                <td className="p-3">—</td>
                <td className="p-3 text-ink/60 font-normal text-xs">ללא ביטוח; עם ביטוח — עד 13,000 ₪</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="prose prose-lg max-w-none text-ink leading-relaxed">
          <h2>עוסק מורשה — עלויות שנה ראשונה</h2>
          <p>
            עוסק מורשה גובה מע&quot;מ ומדווח בתדירות גבוהה יותר, ולכן שכ&quot;ט הרו&quot;ח גבוה יותר מעוסק פטור.
            מנגד, מקזז מע&quot;מ על הוצאות — חלק מהעלויות מחזיר דרך החזר מע&quot;מ.
          </p>
        </div>

        {/* Table: עוסק מורשה */}
        <div className="overflow-x-auto my-6 not-prose">
          <table className="w-full text-sm border border-ink/15 rounded-none overflow-hidden">
            <thead className="bg-cream-2">
              <tr className="text-right">
                <th className="p-3 font-bold text-ink border-b border-ink/15">סעיף</th>
                <th className="p-3 font-bold text-ink border-b border-ink/15">עלות</th>
                <th className="p-3 font-bold text-ink border-b border-ink/15">סוג</th>
                <th className="p-3 font-bold text-ink border-b border-ink/15">הערה</th>
              </tr>
            </thead>
            <tbody className="text-ink/70">
              <tr>
                <td className="p-3 border-b font-medium">רישום עוסק מורשה (מע&quot;מ + מ&quot;ה + ב&quot;ל)</td>
                <td className="p-3 border-b text-green-700 font-bold">חינם</td>
                <td className="p-3 border-b">
                  <span className="inline-block bg-ink text-cream text-xs px-2 py-0.5">אגרה רשמית</span>
                </td>
                <td className="p-3 border-b text-ink/60">אין אגרת פתיחה</td>
              </tr>
              <tr className="bg-cream-2/50">
                <td className="p-3 border-b font-medium">רו&quot;ח שנתי (כולל דיווחי מע&quot;מ)</td>
                <td className="p-3 border-b">3,000–8,000 ₪/שנה</td>
                <td className="p-3 border-b">
                  <span className="inline-block bg-orange-500 text-white text-xs px-2 py-0.5">טווח שוק משוער</span>
                </td>
                <td className="p-3 border-b text-ink/60">כולל דיווח דו-חודשי למע&quot;מ</td>
              </tr>
              <tr>
                <td className="p-3 border-b font-medium">הנהלת חשבונות חודשית</td>
                <td className="p-3 border-b">300–1,200 ₪/חודש</td>
                <td className="p-3 border-b">
                  <span className="inline-block bg-orange-500 text-white text-xs px-2 py-0.5">טווח שוק משוער</span>
                </td>
                <td className="p-3 border-b text-ink/60">אם לא כלול בשכ&quot;ט הרו&quot;ח</td>
              </tr>
              <tr className="bg-cream-2/50">
                <td className="p-3 border-b font-medium">תוכנת חשבוניות/הנה&quot;ח</td>
                <td className="p-3 border-b">50–100 ₪/חודש</td>
                <td className="p-3 border-b">
                  <span className="inline-block bg-orange-500 text-white text-xs px-2 py-0.5">טווח שוק משוער</span>
                </td>
                <td className="p-3 border-b text-ink/60">נחוץ לניהול חשבוניות מס</td>
              </tr>
              <tr>
                <td className="p-3 border-b font-medium">ביטוח אחריות מקצועית</td>
                <td className="p-3 border-b">1,000–5,000+ ₪/שנה</td>
                <td className="p-3 border-b">
                  <span className="inline-block bg-orange-500 text-white text-xs px-2 py-0.5">טווח שוק משוער</span>
                </td>
                <td className="p-3 border-b text-ink/60">מומלץ; חובה במקצועות מוסדרים</td>
              </tr>
              <tr className="bg-yellow-50 font-bold">
                <td className="p-3 font-bold">עלות שנה ראשונה (הערכה)</td>
                <td className="p-3 text-ink">5,000–15,000 ₪</td>
                <td className="p-3">—</td>
                <td className="p-3 text-ink/60 font-normal text-xs">תלוי אם הנה&quot;ח כלולה ברו&quot;ח</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="prose prose-lg max-w-none text-ink leading-relaxed">
          <h2>חברה בע&quot;מ — עלויות שנה ראשונה</h2>
          <p>
            חברה בע&quot;מ כרוכה באגרת רישום חד-פעמית אצל רשות התאגידים ובאגרה שנתית שוטפת. בנוסף,
            הדרישות החשבונאיות קפדניות יותר — דוחות כספיים מבוקרים ועלויות רו&quot;ח גבוהות משמעותית.
          </p>
          <p className="text-sm text-ink/70 bg-amber-50 border border-amber-200 rounded-none p-3 not-prose">
            <strong>שימו לב:</strong> בשנת ההקמה פטורה החברה מאגרה שנתית. מהשנה השנייה:
            1,338 ₪ בתשלום עד 31.3 (1,777 ₪ לאחר מכן).
          </p>
        </div>

        {/* Table: חברה בע"מ */}
        <div className="overflow-x-auto my-6 not-prose">
          <table className="w-full text-sm border border-ink/15 rounded-none overflow-hidden">
            <thead className="bg-cream-2">
              <tr className="text-right">
                <th className="p-3 font-bold text-ink border-b border-ink/15">סעיף</th>
                <th className="p-3 font-bold text-ink border-b border-ink/15">עלות</th>
                <th className="p-3 font-bold text-ink border-b border-ink/15">סוג</th>
                <th className="p-3 font-bold text-ink border-b border-ink/15">הערה</th>
              </tr>
            </thead>
            <tbody className="text-ink/70">
              <tr>
                <td className="p-3 border-b font-medium">אגרת רישום חברה (הגשה מקוונת)</td>
                <td className="p-3 border-b font-bold">כ-2,559 ₪</td>
                <td className="p-3 border-b">
                  <span className="inline-block bg-ink text-cream text-xs px-2 py-0.5">אגרה רשמית</span>
                </td>
                <td className="p-3 border-b text-ink/60">רשות התאגידים, הגשה מקוונת; ידנית כ-3,123 ₪</td>
              </tr>
              <tr className="bg-cream-2/50">
                <td className="p-3 border-b font-medium">אגרה שנתית (מהשנה השנייה)</td>
                <td className="p-3 border-b">1,338 ₪ (עד 31.3) / 1,777 ₪ לאחר מכן</td>
                <td className="p-3 border-b">
                  <span className="inline-block bg-ink text-cream text-xs px-2 py-0.5">אגרה רשמית</span>
                </td>
                <td className="p-3 border-b text-ink/60">שנת הקמה — פטור מאגרה שנתית</td>
              </tr>
              <tr>
                <td className="p-3 border-b font-medium">עו&quot;ד/רו&quot;ח — הקמה (חד-פעמי)</td>
                <td className="p-3 border-b">2,000–5,000 ₪</td>
                <td className="p-3 border-b">
                  <span className="inline-block bg-orange-500 text-white text-xs px-2 py-0.5">טווח שוק משוער</span>
                </td>
                <td className="p-3 border-b text-ink/60">תקנון, רישום, פרוטוקולים</td>
              </tr>
              <tr className="bg-cream-2/50">
                <td className="p-3 border-b font-medium">רו&quot;ח שנתי (דוחות כספיים)</td>
                <td className="p-3 border-b">8,000–20,000+ ₪/שנה</td>
                <td className="p-3 border-b">
                  <span className="inline-block bg-orange-500 text-white text-xs px-2 py-0.5">טווח שוק משוער</span>
                </td>
                <td className="p-3 border-b text-ink/60">כולל דוחות מבוקרים; יכול להגיע לעשרות אלפים בחברה גדולה</td>
              </tr>
              <tr>
                <td className="p-3 border-b font-medium">הנהלת חשבונות חודשית</td>
                <td className="p-3 border-b">500–1,500 ₪/חודש</td>
                <td className="p-3 border-b">
                  <span className="inline-block bg-orange-500 text-white text-xs px-2 py-0.5">טווח שוק משוער</span>
                </td>
                <td className="p-3 border-b text-ink/60">מחייב ניהול מלא</td>
              </tr>
              <tr className="bg-cream-2/50">
                <td className="p-3 border-b font-medium">תוכנת הנה&quot;ח</td>
                <td className="p-3 border-b">100–300 ₪/חודש</td>
                <td className="p-3 border-b">
                  <span className="inline-block bg-orange-500 text-white text-xs px-2 py-0.5">טווח שוק משוער</span>
                </td>
                <td className="p-3 border-b text-ink/60">תוכנה מקצועית כגון Priority/חשבשבת</td>
              </tr>
              <tr>
                <td className="p-3 border-b font-medium">ביטוח אחריות מקצועית / צד ג&apos;</td>
                <td className="p-3 border-b">2,000–8,000+ ₪/שנה</td>
                <td className="p-3 border-b">
                  <span className="inline-block bg-orange-500 text-white text-xs px-2 py-0.5">טווח שוק משוער</span>
                </td>
                <td className="p-3 border-b text-ink/60">תלוי ענף וכיסוי</td>
              </tr>
              <tr className="bg-yellow-50 font-bold">
                <td className="p-3 font-bold">עלות שנה ראשונה (הערכה)</td>
                <td className="p-3 text-ink">15,000–35,000+ ₪</td>
                <td className="p-3">—</td>
                <td className="p-3 text-ink/60 font-normal text-xs">כולל אגרת רישום ועלויות הקמה</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Summary comparison table */}
        <div className="prose prose-lg max-w-none text-ink leading-relaxed">
          <h2>השוואת עלות שנה ראשונה לפי מסלול</h2>
        </div>

        <div className="overflow-x-auto my-6 not-prose">
          <table className="w-full text-sm border border-ink/15 rounded-none overflow-hidden">
            <thead className="bg-cream-2">
              <tr className="text-right">
                <th className="p-3 font-bold text-ink border-b border-ink/15">עלות</th>
                <th className="p-3 font-bold text-ink border-b border-ink/15">עוסק פטור</th>
                <th className="p-3 font-bold text-ink border-b border-ink/15">עוסק מורשה</th>
                <th className="p-3 font-bold text-ink border-b border-ink/15">חברה בע&quot;מ</th>
              </tr>
            </thead>
            <tbody className="text-ink/70">
              <tr>
                <td className="p-3 border-b font-medium">אגרות רשמיות</td>
                <td className="p-3 border-b text-green-700">0 ₪</td>
                <td className="p-3 border-b text-green-700">0 ₪</td>
                <td className="p-3 border-b">~2,559 ₪</td>
              </tr>
              <tr className="bg-cream-2/50">
                <td className="p-3 border-b font-medium">רו&quot;ח (שנתי)</td>
                <td className="p-3 border-b">1,500–4,000 ₪</td>
                <td className="p-3 border-b">3,000–8,000 ₪</td>
                <td className="p-3 border-b">8,000–20,000+ ₪</td>
              </tr>
              <tr>
                <td className="p-3 border-b font-medium">הנה&quot;ח שוטפת</td>
                <td className="p-3 border-b">לרוב כלול ברו&quot;ח</td>
                <td className="p-3 border-b">3,600–14,400 ₪</td>
                <td className="p-3 border-b">6,000–18,000 ₪</td>
              </tr>
              <tr className="bg-cream-2/50">
                <td className="p-3 border-b font-medium">תוכנה</td>
                <td className="p-3 border-b">0–1,200 ₪</td>
                <td className="p-3 border-b">600–1,200 ₪</td>
                <td className="p-3 border-b">1,200–3,600 ₪</td>
              </tr>
              <tr>
                <td className="p-3 border-b font-medium">ביטוח מקצועי</td>
                <td className="p-3 border-b">אופציונלי</td>
                <td className="p-3 border-b">1,000–5,000 ₪</td>
                <td className="p-3 border-b">2,000–8,000 ₪</td>
              </tr>
              <tr className="bg-yellow-50 font-bold border-t-2 border-yellow-300">
                <td className="p-3 font-bold">סה&quot;כ שנה ראשונה (הערכה)</td>
                <td className="p-3 text-ink">2,000–8,000 ₪</td>
                <td className="p-3 text-ink">5,000–15,000 ₪</td>
                <td className="p-3 text-ink">15,000–35,000+ ₪</td>
              </tr>
            </tbody>
          </table>
          <p className="text-xs text-ink/60 mt-2 not-prose">
            * כל הטווחים הם הערכות שוק. הוצאות ביטוח לאומי ומס הכנסה אינן כלולות — הן תלויות ברווח ומחושבות
            בנפרד. ראה מחשבון נטו לעצמאי לחישוב מדויק.
          </p>
        </div>

        {/* What to save / what not to save */}
        <div className="prose prose-lg max-w-none text-ink leading-relaxed">
          <h2>מה אפשר לחסוך — ומה לא שווה לחסוך</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-4 my-6 not-prose">
          {/* אפשר לחסוך */}
          <div className="border border-green-200 rounded-none p-5 bg-green-50">
            <h3 className="font-bold text-green-800 text-lg mb-3">אפשר לחסוך</h3>
            <ul className="space-y-2 text-sm text-green-900">
              <li className="flex gap-2">
                <span className="text-green-600 mt-0.5 flex-shrink-0">+</span>
                <span>
                  <strong>פתיחת תיקים בעצמאיות:</strong> ניתן לפתוח תיקים ברשות המסים ובב&quot;ל ישירות
                  ב-online, ללא רו&quot;ח — חינם לחלוטין.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-green-600 mt-0.5 flex-shrink-0">+</span>
                <span>
                  <strong>תוכנת חשבוניות חינמית:</strong> עוסק פטור עם מחזור נמוך יכול להסתדר
                  עם פלטפורמה חינמית בשנה הראשונה.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-green-600 mt-0.5 flex-shrink-0">+</span>
                <span>
                  <strong>ביטוח מקצועי בכיסוי מינימלי:</strong> בשלב הראשון, כיסוי בסיסי ב-1,000 ₪/שנה
                  עדיף על אפס כיסוי.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-green-600 mt-0.5 flex-shrink-0">+</span>
                <span>
                  <strong>הנהלת חשבונות עצמאית (עוסק פטור):</strong> עם עסקאות מעטות, אפשר לנהל
                  בגיליון אקסל ולהגיש לרו&quot;ח רק לדוח שנתי.
                </span>
              </li>
            </ul>
          </div>

          {/* לא שווה לחסוך */}
          <div className="border border-red-200 rounded-none p-5 bg-red-50">
            <h3 className="font-bold text-red-800 text-lg mb-3">לא שווה לחסוך</h3>
            <ul className="space-y-2 text-sm text-red-900">
              <li className="flex gap-2">
                <span className="text-red-600 mt-0.5 flex-shrink-0">–</span>
                <span>
                  <strong>ייעוץ ראשוני לבחירת מסלול:</strong> טעות בבחירה בין עוסק פטור/מורשה/חברה
                  עולה הרבה יותר משעת ייעוץ עם רו&quot;ח.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-red-600 mt-0.5 flex-shrink-0">–</span>
                <span>
                  <strong>דוח שנתי ללא רו&quot;ח:</strong> טעות בדוח = קנסות, שומות ועגמת נפש שעולים
                  הרבה יותר משכ&quot;ט הרו&quot;ח.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-red-600 mt-0.5 flex-shrink-0">–</span>
                <span>
                  <strong>ניהול מקדמות מס:</strong> אי-תשלום מקדמות = חוב גדול עם ריבית והפרשי
                  הצמדה בסוף השנה.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-red-600 mt-0.5 flex-shrink-0">–</span>
                <span>
                  <strong>הפרדת חשבון בנק עסקי:</strong> ערבוב חשבונות מקשה על ניהול, ביקורת
                  ותביעת הוצאות מוכרות.
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Tip box */}
        <div className="bg-cream-2 border border-ink/15 rounded-none p-5 my-6 not-prose">
          <h3 className="font-bold text-ink mb-2">טיפ: מה מוכר כהוצאה?</h3>
          <p className="text-sm text-ink/70">
            רוב עלויות פתיחת העסק — שכ&quot;ט רו&quot;ח, ביטוח מקצועי, תוכנה — מוכרות כהוצאה עסקית
            ומקטינות את ההכנסה החייבת במס. כלומר, חלק מהעלות &quot;מוחזר&quot; דרך חיסכון במס.
            ראה פרטים בדף ההוצאות המוכרות.
          </p>
        </div>

        {/* Related pages */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-ink mb-4">מדריכים וכלים קשורים</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              { href: '/self-employed/opening-business', label: 'איך פותחים עסק בישראל — המדריך המלא' },
              { href: '/self-employed/corporation-vs-individual', label: 'חברה בע"מ מול עוסק — השוואה מלאה' },
              { href: '/self-employed/allowed-expenses', label: 'הוצאות מוכרות לעצמאי 2026' },
              { href: '/self-employed/net', label: 'מחשבון נטו לעצמאי' },
              { href: '/self-employed/tax-advances', label: 'מחשבון מקדמות מס' },
              { href: '/self-employed/social-security', label: 'מחשבון ביטוח לאומי לעצמאי' },
            ].map((c) => (
              <Link
                key={c.href}
                href={c.href}
                className="group flex items-center justify-between gap-2 border border-ink/15 rounded-none p-4 hover:bg-paper-hover transition"
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
              <details key={f.question} className="border border-ink/15 rounded-none p-4 group">
                <summary className="font-bold text-ink cursor-pointer list-none flex items-center justify-between">
                  {f.question}
                  <span className="text-ink/45 group-open:rotate-180 transition" aria-hidden>▾</span>
                </summary>
                <p className="text-ink/70 mt-3 leading-relaxed">{f.answer}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Sources */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-ink mb-4">מקורות</h2>
          <ul className="text-sm text-ink/60 space-y-1">
            <li>
              רשות התאגידים — אגרות רישום חברה:{' '}
              <a
                href="https://ica.justice.gov.il/IcaSite/request-type-menu/8/3"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold underline"
              >
                ica.justice.gov.il
              </a>
            </li>
            <li>
              כל-זכות — עוסק פטור:{' '}
              <a
                href="https://www.kolzchut.org.il/he/%D7%A2%D7%95%D7%A1%D7%A7_%D7%A4%D7%98%D7%95%D7%A8"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold underline"
              >
                kolzchut.org.il
              </a>
            </li>
            <li>
              ביטוח לאומי — שיעורי דמי ביטוח עצמאי:{' '}
              <a
                href="https://www.btl.gov.il/Insurance/National%20Insurance/type_list/Self_Employed/Pages/rates.aspx"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold underline"
              >
                btl.gov.il
              </a>
            </li>
            <li>
              תקנות מס הכנסה (ניכוי הוצאות מסויימות):{' '}
              <a
                href="https://www.nevo.co.il/law_html/law01/255_418.htm"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold underline"
              >
                nevo.co.il
              </a>
            </li>
          </ul>
          <p className="text-xs text-ink/45 mt-3">
            * נתוני האגרות הרשמיות מבוססים על פרסומי רשות התאגידים לשנת 2026. טווחי השוק הם הערכות בלבד
            ועשויים להשתנות. אין לראות בתוכן זה ייעוץ מקצועי. עודכן לאחרונה: 2026-06-12.
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
