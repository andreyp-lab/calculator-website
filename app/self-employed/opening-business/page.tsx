import type { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/calculator/Breadcrumbs';
import { AuthorBox } from '@/components/calculator/AuthorBox';
import { CourseCTA } from '@/components/marketing/CourseCTA';

const PAGE_PATH = '/self-employed/opening-business';
const SITE_URL = 'https://cheshbonai.co.il';

export const metadata: Metadata = {
  title: 'פתיחת עסק 2026 — עוסק פטור או עוסק מורשה? המדריך המלא',
  description:
    'איך פותחים עסק בישראל ב-2026: עוסק פטור מול עוסק מורשה, תקרת 122,833 ₪, מע"מ 18%, רישום מול הרשויות וטעויות שכדאי לחסוך. מדריך מעשי מרו"ח.',
  alternates: { canonical: PAGE_PATH },
  openGraph: {
    title: 'פתיחת עסק 2026 — עוסק פטור או עוסק מורשה? המדריך המלא',
    description:
      'איך פותחים עסק בישראל ב-2026: עוסק פטור מול עוסק מורשה, תקרת 122,833 ₪, מע"מ, רישום מול הרשויות וטעויות נפוצות.',
    type: 'article',
    locale: 'he_IL',
  },
};

const faqItems = [
  {
    question: 'מה ההבדל בין עוסק פטור לעוסק מורשה?',
    answer:
      'עוסק פטור הוא עסק שמחזורו השנתי עד 122,833 ₪ (2026). הוא פטור מגביית מע"מ ומדיווח מע"מ שוטף, אך אינו יכול לקזז מע"מ תשומות על הוצאות. עוסק מורשה גובה מע"מ 18% מלקוחותיו, מקזז מע"מ על הוצאות, ומדווח למע"מ אחת לחודש או חודשיים. שניהם חייבים במס הכנסה ובביטוח לאומי.',
  },
  {
    question: 'מהי תקרת עוסק פטור ב-2026?',
    answer:
      'תקרת המחזור לעוסק פטור ב-2026 היא 122,833 ₪ לשנה. אם המחזור עובר את הסכום הזה — חובה לעבור לעוסק מורשה. התקרה מתעדכנת מדי שנה לפי מדד המחירים לצרכן.',
  },
  {
    question: 'איך פותחים עסק בישראל?',
    answer:
      'פותחים תיק במע"מ (עוסק פטור או מורשה), פותחים תיק במס הכנסה, ונרשמים כעצמאי בביטוח לאומי. אפשר לבצע את שלושת הצעדים גם דרך השער הממשלתי המאוחד. מומלץ להיוועץ ברואה חשבון לבחירת הסיווג הנכון כבר בהתחלה.',
  },
  {
    question: 'מתי כדאי לפתוח עוסק מורשה במקום פטור?',
    answer:
      'כדאי לפתוח עוסק מורשה כאשר: המחזור צפוי לעבור 122,833 ₪, רוב הלקוחות הם עסקים (שמעדיפים חשבונית מס לקיזוז), או כשיש הוצאות גדולות עם מע"מ שכדאי לקזז (ציוד, שכירות, רכב). מקצועות מסוימים (כמו עורכי דין ורופאים) חייבים בעוסק מורשה ללא קשר למחזור.',
  },
  {
    question: 'עוסק פטור משלם מס הכנסה?',
    answer:
      'כן. "פטור" מתייחס רק למע"מ — עוסק פטור פטור מגביית מע"מ בלבד. הוא עדיין חייב במס הכנסה לפי מדרגות המס ובדמי ביטוח לאומי ובריאות על הרווח שלו, ומגיש דוח שנתי למס הכנסה.',
  },
  {
    question: 'איזה טופס ממלאים כדי לפתוח תיק במע"מ?',
    answer:
      'ממלאים טופס 821 — "בקשה לרישום עוסק". ניתן להגיש אונליין דרך אתר רשות המסים או בסניף. המסמכים הנדרשים: תעודת זהות, אישור ניהול חשבון בנק, וחוזה שכירות או הוכחת בעלות על נכס העסק. הרישום עצמו חינמי — אין אגרת פתיחה לעוסק.',
  },
  {
    question: 'כמה זמן לוקח לפתוח תיק ברשויות?',
    answer:
      'פתיחה אונליין — לרוב מיידית עד מספר ימי עסקים. פתיחה בסניף עשויה לקחת עד שבוע. מומלץ לפתוח את שלושת התיקים (מע"מ, מס הכנסה, ביטוח לאומי) באותו שבוע ולא לדחות את הביטוח הלאומי — כי מקדמות דמי הביטוח מחושבות מיום הרישום.',
  },
  {
    question: 'האם חובה להגיש טופס 5329 גם לעוסק פטור?',
    answer:
      'כן. טופס 5329 — "דו"ח פרטים אישיים והצהרה על מקורות הכנסה" — נדרש לפתיחת תיק עצמאי במס הכנסה לכל סוגי העוסקים, פטור ומורשה כאחד. ניתן להגישו ידנית בפקיד השומה או דרך מייצג (רו"ח/שע"מ).',
  },
];

export default function OpeningBusinessPage() {
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'פתיחת עסק 2026 — עוסק פטור או עוסק מורשה? המדריך המלא',
    description:
      'מדריך מעשי לפתיחת עסק בישראל 2026: עוסק פטור מול מורשה, תקרת 122,833 ₪, מע"מ ורישום מול הרשויות.',
    inLanguage: 'he-IL',
    datePublished: '2026-06-01',
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
          <h1 className="text-3xl md:text-4xl font-bold text-ink mb-3">
            פתיחת עסק 2026 — עוסק פטור או עוסק מורשה?
          </h1>
          <p className="text-lg text-ink/70 leading-relaxed">
            פותחים עסק עצמאי בישראל? המדריך המלא לבחירה בין עוסק פטור לעוסק מורשה, רישום מול
            הרשויות, תקרת 122,833 ₪, מע"מ 18% והטעויות שכדאי לחסוך כבר בהתחלה.
          </p>
          <p className="text-sm text-ink/60 mt-3">
            נכתב על ידי אנדרי פלטונוב, רו"ח · עודכן ל-2026
          </p>
        </header>

        <div className="prose prose-lg max-w-none text-ink leading-relaxed">
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
              ובתמורה צובר זכויות (דמי לידה, פגיעה בעבודה, נכות כללית, קצבת אזרח ותיק ועוד).{' '}
              <strong>שימו לב: עצמאי אינו מבוטח בביטוח אבטלה.</strong>
            </li>
          </ol>

          <h2>עוסק פטור — למי זה מתאים?</h2>
          <p>
            <strong>עוסק פטור</strong> הוא עסק קטן שמחזורו השנתי אינו עולה על{' '}
            <strong>122,833 ₪ (2026)</strong>. היתרון: אינו גובה מע"מ ואינו מדווח מע"מ שוטף —
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
            לחודשיים. עוסק מורשה הוא חובה כאשר המחזור עובר 122,833 ₪, וגם נדרש במקצועות מסוימים
            ללא קשר למחזור.
          </p>

          <h2>עוסק פטור מול עוסק מורשה — טבלת השוואה</h2>
        </div>

        {/* Comparison table */}
        <div className="overflow-x-auto my-6 not-prose">
          <table className="w-full text-sm border border-ink/15 overflow-hidden">
            <thead className="bg-cream-2">
              <tr className="text-right">
                <th className="p-3 font-bold text-ink border-b border-ink/15">קריטריון</th>
                <th className="p-3 font-bold text-gold border-b border-ink/15">עוסק פטור</th>
                <th className="p-3 font-bold text-emerald-700 border-b border-ink/15">עוסק מורשה</th>
              </tr>
            </thead>
            <tbody className="text-ink/70">
              <tr><td className="p-3 border-b border-ink/15 font-medium">תקרת מחזור</td><td className="p-3 border-b border-ink/15">עד 122,833 ₪/שנה</td><td className="p-3 border-b border-ink/15">ללא הגבלה</td></tr>
              <tr className="bg-cream-2/50"><td className="p-3 border-b border-ink/15 font-medium">גביית מע"מ</td><td className="p-3 border-b border-ink/15">לא גובה</td><td className="p-3 border-b border-ink/15">גובה 18%</td></tr>
              <tr><td className="p-3 border-b border-ink/15 font-medium">קיזוז מע"מ תשומות</td><td className="p-3 border-b border-ink/15">לא</td><td className="p-3 border-b border-ink/15">כן</td></tr>
              <tr className="bg-cream-2/50"><td className="p-3 border-b border-ink/15 font-medium">דיווח מע"מ</td><td className="p-3 border-b border-ink/15">הצהרה שנתית בלבד</td><td className="p-3 border-b border-ink/15">חודשי / דו-חודשי</td></tr>
              <tr><td className="p-3 border-b border-ink/15 font-medium">מס הכנסה + ב.ל.</td><td className="p-3 border-b border-ink/15">חייב</td><td className="p-3 border-b border-ink/15">חייב</td></tr>
              <tr className="bg-cream-2/50"><td className="p-3 font-medium">מתאים ל-</td><td className="p-3">עסק קטן, לקוחות פרטיים</td><td className="p-3">מחזור גבוה, לקוחות עסקיים, הוצאות גדולות</td></tr>
            </tbody>
          </table>
        </div>

        <div className="prose prose-lg max-w-none text-ink leading-relaxed">
          <h2>מתי כדאי לעבור מעוסק פטור למורשה?</h2>
          <ul>
            <li>המחזור השנתי מתקרב או עובר את <strong>122,833 ₪</strong> (אז המעבר חובה).</li>
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

        {/* Step-by-step registration section */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-ink mb-6">פתיחת תיק ברשויות — צעד אחר צעד</h2>
          <p className="text-ink/70 mb-6 leading-relaxed">
            להלן שלושת הגופים שאליהם חייב כל עצמאי להירשם. הסדר המומלץ: מע"מ → מס הכנסה → ביטוח לאומי.
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
                        <td className="p-3 font-medium text-ink/60 w-32">טופס</td>
                        <td className="p-3 font-semibold">טופס 821 — בקשה לרישום עוסק</td>
                      </tr>
                      <tr className="border-b border-ink/15 bg-cream-2/50">
                        <td className="p-3 font-medium text-ink/60">מסמכים</td>
                        <td className="p-3">תעודת זהות · אישור ניהול חשבון בנק · חוזה שכירות / הוכחת בעלות על נכס העסק · פרטי העסק</td>
                      </tr>
                      <tr className="border-b border-ink/15">
                        <td className="p-3 font-medium text-ink/60">איך</td>
                        <td className="p-3">אונליין דרך אתר רשות המסים, או פיזית בסניף מע"מ הקרוב</td>
                      </tr>
                      <tr className="border-b border-ink/15 bg-cream-2/50">
                        <td className="p-3 font-medium text-ink/60">עלות</td>
                        <td className="p-3 font-semibold text-emerald-700">חינם — אין אגרת פתיחה</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-medium text-ink/60">זמן טיפול</td>
                        <td className="p-3">אונליין — לרוב מיידי עד ימים ספורים</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-sm text-ink/60 mt-3">
                  כאן תבחרו: <strong>עוסק פטור</strong> (מחזור עד 122,833 ₪) או <strong>עוסק מורשה</strong>.
                  ברגע שאתם מורשים — מתחייבים בדיווח מע"מ חודשי/דו-חודשי.
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
                        <td className="p-3 font-medium text-ink/60 w-32">טופס</td>
                        <td className="p-3 font-semibold">טופס 5329 — דו"ח פרטים אישיים והצהרה על מקורות הכנסה</td>
                      </tr>
                      <tr className="border-b border-ink/15 bg-cream-2/50">
                        <td className="p-3 font-medium text-ink/60">מסמכים</td>
                        <td className="p-3">תעודת זהות · פרטי בנק · אישור פתיחת תיק מע"מ</td>
                      </tr>
                      <tr className="border-b border-ink/15">
                        <td className="p-3 font-medium text-ink/60">איך</td>
                        <td className="p-3">הגשה ידנית בפקיד השומה, או דרך מייצג (רו"ח / שע"מ). חל על עוסק פטור ועוסק מורשה כאחד.</td>
                      </tr>
                      <tr className="border-b border-ink/15 bg-cream-2/50">
                        <td className="p-3 font-medium text-ink/60">עלות</td>
                        <td className="p-3 font-semibold text-emerald-700">חינם</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-medium text-ink/60">זמן טיפול</td>
                        <td className="p-3">בדרך כלל עד שבוע ממועד ההגשה</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-sm text-ink/60 mt-3">
                  לאחר הפתיחה, פקיד השומה יקבע <strong>מקדמות מס</strong> חודשיות. חשוב לכייל את המקדמות
                  לפי ההכנסה הצפויה — מקדמה נמוכה מדי תגרור תשלום חוב + ריבית בסוף השנה.
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
                        <td className="p-3 font-medium text-ink/60 w-32">טופס</td>
                        <td className="p-3 font-semibold">טופס בל/6101 — דין וחשבון רב שנתי (מהדורה 03.2026)</td>
                      </tr>
                      <tr className="border-b border-ink/15 bg-cream-2/50">
                        <td className="p-3 font-medium text-ink/60">מסמכים</td>
                        <td className="p-3">תעודת זהות · אישורי פתיחת תיק מע"מ ומס הכנסה · פרטי חשבון בנק לחיוב</td>
                      </tr>
                      <tr className="border-b border-ink/15">
                        <td className="p-3 font-medium text-ink/60">איך</td>
                        <td className="p-3">אונליין דרך אתר ביטוח לאומי (btl.gov.il) או בסניף הקרוב</td>
                      </tr>
                      <tr className="border-b border-ink/15 bg-cream-2/50">
                        <td className="p-3 font-medium text-ink/60">עלות</td>
                        <td className="p-3 font-semibold text-emerald-700">חינם — הרישום עצמו ללא אגרה</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-medium text-ink/60">זמן טיפול</td>
                        <td className="p-3">לרוב ימים ספורים עד שבוע; מקדמות ב"ל מחושבות מיום הרישום</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-sm text-ink/60 mt-3">
                  שיעורי דמי הביטוח לעצמאי (2026): <strong>6.1%</strong> על חלק ההכנסה עד 7,522 ₪/חודש,
                  ו-<strong>18%</strong> על החלק שמעל (עד תקרה של 51,910 ₪/חודש). הרישום המוקדם חשוב —
                  עיכוב עלול לגרור תשלום רטרואקטיבי.
                </p>
              </div>
            </div>
          </div>

          {/* Summary notice */}
          <div className="bg-amber-50 border border-amber-200 p-4 mt-2">
            <p className="text-sm text-amber-800 leading-relaxed">
              <strong>טיפ מעשי:</strong> ניתן לפתוח את שלושת התיקים באותו שבוע. אם עובדים עם רואה חשבון — רוב המשרדים מבצעים את הפתיחה במלואה. אם מטפלים לבד, כדאי להיעזר בשער הממשלתי המאוחד.
            </p>
          </div>
        </section>

        {/* Related calculators */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-ink mb-4">מחשבונים שיעזרו לך להתחיל</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              { href: '/self-employed/vat', label: 'מחשבון מע"מ' },
              { href: '/self-employed/net', label: 'מחשבון נטו לעצמאי' },
              { href: '/self-employed/social-security', label: 'מחשבון ביטוח לאומי לעצמאי' },
              { href: '/self-employed/tax-advances', label: 'מחשבון מקדמות מס' },
              { href: '/self-employed/hourly-rate', label: 'מחשבון תמחור שעת עבודה' },
              { href: '/self-employed/corporation-vs-individual', label: 'חברה בע"מ מול עוסק' },
              { href: '/self-employed/business-setup-cost', label: 'כמה עולה לפתוח עסק?' },
              { href: '/self-employed/invoices', label: 'חשבונית מס מול קבלה — המדריך' },
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
                  <span className="text-ink/45 group-open:rotate-180 transition" aria-hidden>▾</span>
                </summary>
                <p className="text-ink/70 mt-3 leading-relaxed">{f.answer}</p>
              </details>
            ))}
          </div>
        </section>

        {/* קידום קורס FinSchool */}
        <CourseCTA />

        <section className="mb-8">
          <AuthorBox />
        </section>
      </article>
    </div>
  );
}
