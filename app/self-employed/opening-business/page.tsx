import type { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/calculator/Breadcrumbs';
import { AuthorBox } from '@/components/calculator/AuthorBox';
import { DisclaimerBox } from '@/components/calculator/DisclaimerBox';
import { CourseCTA } from '@/components/marketing/CourseCTA';

const PAGE_PATH = '/self-employed/opening-business';
const SITE_URL = 'https://cheshbonai.co.il';

export const metadata: Metadata = {
  title: 'איך לפתוח עסק עצמאי בישראל 2026 — עוסק פטור או מורשה? המדריך המלא',
  description:
    'איך פותחים עסק עצמאי בישראל ב-2026: עוסק פטור מול עוסק מורשה מול חברה בע"מ, תקרת 122,833 ₪, מע"מ 18%, רישום מול הרשויות צעד אחר צעד, עלויות, צ\'קליסט וטעויות שכדאי לחסוך. מדריך מעשי מרו"ח.',
  alternates: { canonical: PAGE_PATH },
  openGraph: {
    title: 'איך לפתוח עסק עצמאי בישראל 2026 — עוסק פטור או מורשה? המדריך המלא',
    description:
      'איך פותחים עסק עצמאי בישראל ב-2026: עוסק פטור מול עוסק מורשה מול חברה בע"מ, תקרת 122,833 ₪, מע"מ, רישום מול הרשויות, עלויות וטעויות נפוצות.',
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
    question: 'כמה עולה לפתוח עוסק פטור או עוסק מורשה?',
    answer:
      'הרישום עצמו ברשויות — מע"מ, מס הכנסה וביטוח לאומי — הוא חינם, ללא אגרות פתיחה. העלויות בפועל הן עקיפות: ליווי רואה חשבון או יועץ מס (אם בוחרים בכך), תוכנת הפקת חשבוניות, ציוד ראשוני וביטוחים מקצועיים. אפשר לאמוד את העלות הכוללת במחשבון עלות פתיחת עסק באתר.',
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
    question: 'האם כדאי להיות עוסק פטור?',
    answer:
      'עוסק פטור כדאי כשהמחזור הצפוי נמוך מהתקרה (122,833 ₪ ב-2026), הלקוחות הם בעיקר פרטיים, וההוצאות העסקיות קטנות. הוא פחות כדאי כשרוב הלקוחות עסקיים (מעדיפים חשבונית מס לקיזוז מע"מ), כשיש השקעה גדולה בציוד עם מע"מ שכדאי לקזז, או כשהמחזור צפוי לעבור את התקרה תוך זמן קצר.',
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
];

export default function OpeningBusinessPage() {
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'איך לפתוח עסק עצמאי בישראל 2026 — עוסק פטור או מורשה? המדריך המלא',
    description:
      'מדריך מעשי לפתיחת עסק עצמאי בישראל 2026: עוסק פטור מול מורשה מול חברה בע"מ, תקרת 122,833 ₪, מע"מ, רישום מול הרשויות, עלויות וצ\'קליסט.',
    inLanguage: 'he-IL',
    datePublished: '2026-06-01',
    dateModified: '2026-07-02',
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
            איך לפתוח עסק עצמאי בישראל 2026 — עוסק פטור או עוסק מורשה?
          </h1>
          <p className="text-lg text-ink/70 leading-relaxed">
            פותחים עסק עצמאי בישראל? המדריך המלא לבחירה בין עוסק פטור, עוסק מורשה וחברה בע"מ,
            רישום מול הרשויות צעד אחר צעד, תקרת 122,833 ₪, מע"מ 18%, עלויות הפתיחה, צ'קליסט
            פעולות והטעויות שכדאי לחסוך כבר בהתחלה.
          </p>
          <p className="text-sm text-ink/60 mt-3">
            נכתב על ידי אנדרי פלטונוב, רו"ח · עודכן ל-2026
          </p>
        </header>

        {/* Quick answer */}
        <div className="border border-ink/15 bg-cream-2 p-5 mb-8">
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-gold mb-2">בקצרה</p>
          <p className="text-ink/80 leading-relaxed text-sm">
            פתיחת עסק עצמאי בישראל = שלושה רישומים: <strong>מע"מ ← מס הכנסה ← ביטוח לאומי</strong>.
            כולם חינם, ואפשר להשלים את שלושתם תוך שבוע. ההחלטה החשובה באמת היא הסיווג:{' '}
            <strong>עוסק פטור</strong> (מחזור עד 122,833 ₪ בשנה, בלי גביית מע"מ, מינימום בירוקרטיה)
            או <strong>עוסק מורשה</strong> (גובה מע"מ 18%, מקזז מע"מ על הוצאות, מדווח חודשי/דו-חודשי).
            חברה בע"מ רלוונטית בדרך כלל רק ברווחים גבוהים או כשנדרשת הפרדה משפטית.
          </p>
        </div>

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
          <p>
            שלושת הרישומים חינמיים, ואת רובם ניתן לבצע אונליין. בהמשך המדריך — פירוט מלא של כל
            שלב, כולל טפסים, מסמכים וזמני טיפול. לפני כן, נעצור בהחלטה שמשפיעה על כל ההתנהלות
            הכספית שלכם: <strong>איזה סוג עוסק להיות</strong>.
          </p>

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
          <p>
            שימו לב שהתקרה נמדדת לפי <strong>מחזור</strong> (סך ההכנסות), לא לפי רווח. עסק עם
            מחזור של 130,000 ₪ ורווח של 40,000 ₪ — כבר מעבר לתקרה וחייב במעבר לעוסק מורשה. אם
            אתם מתקרבים לתקרה, מומלץ להיערך מראש —{' '}
            <Link href="/self-employed/vat-threshold">מחשבון תקרת עוסק פטור</Link> יעזור לכם לעקוב
            אחרי המרחק מהתקרה ולתכנן את המעבר.
          </p>

          <h2>עוסק מורשה — למי זה מתאים?</h2>
          <p>
            <strong>עוסק מורשה</strong> גובה מע"מ בשיעור <strong>18%</strong> מלקוחותיו, מעביר
            אותו לרשות המסים, ובמקביל מקזז מע"מ על הוצאות עסקיות. הוא מדווח למע"מ אחת לחודש או
            לחודשיים. עוסק מורשה הוא חובה כאשר המחזור עובר 122,833 ₪, וגם נדרש במקצועות מסוימים
            ללא קשר למחזור.
          </p>
          <p>
            בפועל, עבור עסקים שמוכרים לעסקים אחרים (B2B), המע"מ הוא כמעט "שקוף": הלקוח העסקי מקזז
            את המע"מ ששילם לכם, ולכן חשבונית מס עם מע"מ אינה מייקרת את השירות מבחינתו. לעומת זאת,
            מול לקוחות פרטיים — המע"מ מתווסף למחיר הסופי, ושם לעוסק פטור יש יתרון תחרותי אמיתי.
          </p>
          <p>
            <strong>דוגמה מספרית:</strong> נניח ששני מעצבים גובים 10,000 ₪ על פרויקט. העוסק הפטור
            מפיק קבלה על 10,000 ₪ — זה המחיר הסופי. העוסק המורשה מפיק חשבונית מס על 10,000 ₪ בתוספת
            מע"מ 18%, כלומר 11,800 ₪. לקוח <strong>פרטי</strong> ישלם למורשה 1,800 ₪ יותר על אותה
            עבודה — יתרון ברור לפטור. אבל לקוח <strong>עסקי</strong> (עוסק מורשה בעצמו) יקזז את
            1,800 ₪ המע"מ בדיווח שלו, כך שהעלות האמיתית עבורו זהה — 10,000 ₪ בשני המקרים. זו הסיבה
            שזהות הלקוחות היא הקריטריון החשוב ביותר בבחירת הסיווג. לחישובי מע"מ מהירים —{' '}
            <Link href="/self-employed/vat">מחשבון המע"מ</Link> באתר.
          </p>

          <h2>ומה עם חברה בע"מ?</h2>
          <p>
            האפשרות השלישית היא <strong>חברה בע"מ</strong> — ישות משפטית נפרדת שנרשמת ברשם החברות
            (בתשלום אגרה, בניגוד לרישום עוסק שהוא חינמי). לחברה יתרונות של הפרדה בין הנכסים
            האישיים לעסקיים ותכנון מס גמיש יותר ברווחים גבוהים: החברה משלמת מס חברות על הרווח,
            ובעל המניות משלם מס נוסף רק כשהוא מושך דיבידנד. מנגד — עלויות ההקמה והתפעול גבוהות
            משמעותית: הנהלת חשבונות כפולה, דוחות מבוקרים על ידי רו"ח ואגרה שנתית.
          </p>
          <p>
            לרוב העצמאים בתחילת הדרך, עוסק (פטור או מורשה) הוא נקודת ההתחלה הנכונה — ותמיד אפשר
            להתאגד כחברה בהמשך כשהרווחים מצדיקים זאת. להשוואה מספרית מלאה בין המסלולים:{' '}
            <Link href="/self-employed/corporation-vs-individual">מחשבון חברה בע"מ מול עוסק</Link>{' '}
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
                <th className="p-3 font-bold text-emerald-700 border-b border-ink/15">עוסק מורשה</th>
                <th className="p-3 font-bold text-ink border-b border-ink/15">חברה בע"מ</th>
              </tr>
            </thead>
            <tbody className="text-ink/70">
              <tr>
                <td className="p-3 border-b border-ink/15 font-medium">תקרת מחזור</td>
                <td className="p-3 border-b border-ink/15">עד 122,833 ₪/שנה</td>
                <td className="p-3 border-b border-ink/15">ללא הגבלה</td>
                <td className="p-3 border-b border-ink/15">ללא הגבלה</td>
              </tr>
              <tr className="bg-cream-2/50">
                <td className="p-3 border-b border-ink/15 font-medium">גביית מע"מ</td>
                <td className="p-3 border-b border-ink/15">לא גובה</td>
                <td className="p-3 border-b border-ink/15">גובה 18%</td>
                <td className="p-3 border-b border-ink/15">גובה 18%</td>
              </tr>
              <tr>
                <td className="p-3 border-b border-ink/15 font-medium">קיזוז מע"מ תשומות</td>
                <td className="p-3 border-b border-ink/15">לא</td>
                <td className="p-3 border-b border-ink/15">כן</td>
                <td className="p-3 border-b border-ink/15">כן</td>
              </tr>
              <tr className="bg-cream-2/50">
                <td className="p-3 border-b border-ink/15 font-medium">דיווח מע"מ</td>
                <td className="p-3 border-b border-ink/15">הצהרה שנתית בלבד</td>
                <td className="p-3 border-b border-ink/15">חודשי / דו-חודשי</td>
                <td className="p-3 border-b border-ink/15">חודשי / דו-חודשי</td>
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
                <li>✦ המחזור הצפוי נמוך בבירור מ-122,833 ₪ בשנה — למשל עבודה צדדית לצד משרה כשכיר.</li>
                <li>✦ הלקוחות הם בעיקר <strong>אנשים פרטיים</strong> — המחיר שלכם נמוך ב-18% ממתחרה מורשה שגובה מע"מ.</li>
                <li>✦ ההוצאות העסקיות קטנות — אין הרבה מע"מ תשומות "להפסיד".</li>
                <li>✦ אתם רוצים מינימום בירוקרטיה: בלי דיווחי מע"מ שוטפים, רק הצהרה שנתית.</li>
              </ul>
            </div>
            <div className="border border-ink/15 bg-cream-2 p-5">
              <p className="font-mono text-xs uppercase tracking-[0.14em] text-gold mb-3">
                עוסק פטור פחות כדאי כאשר…
              </p>
              <ul className="space-y-2 text-sm text-ink/70 leading-relaxed">
                <li>✦ רוב הלקוחות הם <strong>עסקים</strong> — הם מקזזים ממילא את המע"מ ולעיתים אף מעדיפים חשבונית מס.</li>
                <li>✦ יש השקעה ראשונית גדולה (ציוד, שיפוץ, רכב) — כמורשה הייתם מקזזים את המע"מ עליה.</li>
                <li>✦ המחזור צפוי לעבור את התקרה תוך שנה-שנתיים — מעבר באמצע שנה מסורבל יותר מפתיחה נכונה מראש.</li>
                <li>✦ המקצוע שלכם מחייב עוסק מורשה על פי דין (למשל עו"ד, רופא, רו"ח, אדריכל).</li>
              </ul>
            </div>
          </div>

          <p className="text-ink/70 leading-relaxed mt-5 text-sm">
            כלל אצבע: עסק צדדי קטן שמוכר לפרטיים — פטור. עסק שמתוכנן לפרנסה עיקרית עם לקוחות
            עסקיים — כנראה מורשה מהיום הראשון. ואם אתם על הגבול — בדקו את המספרים שלכם עם{' '}
            <Link href="/self-employed/net" className="text-gold hover:underline">מחשבון הנטו לעצמאי</Link>{' '}
            ועם{' '}
            <Link href="/self-employed/vat-threshold" className="text-gold hover:underline">מחשבון תקרת עוסק פטור</Link>.
          </p>
        </section>

        <div className="prose prose-lg max-w-none text-ink leading-relaxed">
          <h2>מתי כדאי לעבור מעוסק פטור למורשה?</h2>
          <ul>
            <li>המחזור השנתי מתקרב או עובר את <strong>122,833 ₪</strong> (אז המעבר חובה).</li>
            <li>רוב הלקוחות הם <strong>עסקים</strong> שזקוקים לחשבונית מס לצורך קיזוז.</li>
            <li>יש <strong>הוצאות גדולות עם מע"מ</strong> (ציוד, שכירות, רכב) שכדאי לקזז.</li>
          </ul>
          <p>
            המעבר עצמו נעשה מול רשות המסים בעדכון סיווג התיק. מרגע המעבר, מתחילים להפיק חשבוניות
            מס (במקום קבלות בלבד) ולדווח מע"מ באופן שוטף. על ההבדל בין המסמכים —{' '}
            <Link href="/self-employed/invoices">חשבונית מס מול קבלה: המדריך המלא</Link>.
          </p>

          <h3>מה קורה כשעוברים את התקרה באמצע השנה?</h3>
          <p>
            תקרת עוסק פטור אינה "המלצה" — מרגע שהמחזור המצטבר שלכם חצה את 122,833 ₪, אתם חייבים
            לפנות לרשות המסים ולעדכן את הסיווג לעוסק מורשה. ההשלכה המשמעותית: על ההכנסות שמעבר
            לתקרה תידרשו לשלם מע"מ — וכיוון שלרוב אי אפשר לחזור ללקוח ולבקש ממנו תוספת רטרואקטיבית,
            המע"מ הזה יֵצא בפועל מהכיס שלכם. עסק שגבה 10,000 ₪ מעבר לתקרה בלי לגבות מע"מ עלול למצוא
            את עצמו מפריש מתוכם את רכיב המע"מ לרשות המסים. לכן חשוב לעקוב אחרי המחזור המצטבר לאורך
            השנה — לא לגלות בדיעבד בדוח השנתי. <Link href="/self-employed/vat-threshold">מחשבון
            תקרת עוסק פטור</Link> מראה בדיוק כמה "מקום" נשאר לכם עד התקרה ומתי כדאי ליזום את המעבר
            מראש.
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
              "מלא". ברוב המקרים עבודה צדדית מתחילה כעוסק פטור, כי המחזור נמוך מהתקרה.
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
            לחישוב מדויק של המס והביטוח הלאומי במצב המשולב —{' '}
            <Link href="/self-employed/employee-and-self-employed">
              מחשבון שכיר וגם עצמאי
            </Link>{' '}
            עושה בדיוק את זה: מקבל את השכר ואת רווחי העסק, ומראה כמה באמת יישאר נטו מהעבודה הצדדית.
          </p>
        </div>

        {/* Costs section */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-ink mb-4">כמה עולה לפתוח עסק עצמאי?</h2>
          <p className="text-ink/70 leading-relaxed mb-4">
            החדשות הטובות: <strong>הרישום עצמו חינם</strong>. פתיחת תיק במע"מ, במס הכנסה ובביטוח
            לאומי אינה כרוכה באגרות. העלויות האמיתיות של פתיחת עסק הן עקיפות, והן משתנות מאוד
            מעסק לעסק:
          </p>
          <ul className="space-y-2 text-ink/70 leading-relaxed mb-5 list-disc pr-6">
            <li>
              <strong>ליווי מקצועי</strong> — רואה חשבון או יועץ מס לפתיחת התיקים ולדוח השנתי.
              עוסק פטור עם התנהלות פשוטה יכול לרוב להסתדר לבד; עוסק מורשה כמעט תמיד ירוויח
              מליווי שוטף.
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
              מחשבון: כמה עולה לפתוח את העסק שלך? — אומדן מותאם אישית
            </span>
            <span className="text-gold group-hover:-translate-x-1 transition" aria-hidden>←</span>
          </Link>
        </section>

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
                  לפי ההכנסה הצפויה — מקדמה נמוכה מדי תגרור תשלום חוב + ריבית בסוף השנה. אפשר לאמוד
                  את המקדמה הנכונה עם{' '}
                  <Link href="/self-employed/tax-advances" className="text-gold hover:underline">
                    מחשבון מקדמות המס
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
                  שיעורי דמי הביטוח לעצמאי (2026): <strong>7.7%</strong> על חלק ההכנסה עד 7,703 ₪/חודש,
                  ו-<strong>18%</strong> על החלק שמעל (עד תקרה של 51,910 ₪/חודש). הרישום המוקדם חשוב —
                  עיכוב עלול לגרור תשלום רטרואקטיבי. לחישוב מדויק:{' '}
                  <Link href="/self-employed/social-security" className="text-gold hover:underline">
                    מחשבון ביטוח לאומי לעצמאי
                  </Link>
                  .
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
                <strong>שמירת כל הוצאה</strong> — חשבונית מס או קבלה על כל הוצאה עסקית. בלי מסמך —
                אין הוצאה מוכרת, וזה כסף שהולך לאיבוד פעמיים: גם במס הכנסה וגם (למורשה) בקיזוז
                המע"מ.
              </li>
              <li>
                <strong>הפקה דיגיטלית</strong> — תוכנות הנהלת החשבונות והחשבוניות בענן הפכו את
                התיעוד לפשוט: המסמכים ממוספרים אוטומטית, נשמרים בענן וזמינים לדוח השנתי. לרוב
                העצמאים החדשים זו הדרך המומלצת מהיום הראשון.
              </li>
              <li>
                <strong>שמירת מסמכים לאורך שנים</strong> — את ספרי העסק והמסמכים יש לשמור גם אחרי
                הגשת הדוח, לצורך ביקורת עתידית אפשרית של רשות המסים.
              </li>
            </ul>
            <h3>לוח זמנים ריאלי: מהחלטה לעסק פעיל</h3>
            <p>
              בניגוד לתדמית, הבירוקרטיה של פתיחת עסק בישראל קצרה: את פתיחת תיק המע"מ אפשר להשלים
              אונליין תוך זמן קצר, ואת שלושת הרישומים — בתוך שבוע. מה שלוקח זמן הוא דווקא ההכנה
              שלפני: הגדרת השירות והתמחור, בדיקת כדאיות הסיווג, פתיחת חשבון בנק נפרד ובחירת תוכנת
              חשבוניות. ההמלצה המעשית: הקדישו שבוע-שבועיים לתכנון עם המחשבונים באתר (תמחור, נטו,
              עלויות פתיחה), ורק אז גשו לרישומים — סדר הפעולות המלא מחכה לכם בצ'קליסט שבהמשך העמוד.
            </p>
          </div>
        </section>

        {/* What happens after opening */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-ink mb-4">פתחתם? זה מה שמחכה לכם בהתנהלות השוטפת</h2>
          <div className="prose prose-lg max-w-none text-ink leading-relaxed">
            <h3>מס הכנסה — מדרגות, מקדמות ודוח שנתי</h3>
            <p>
              עצמאי משלם מס הכנסה על ה<strong>רווח</strong> (הכנסות פחות הוצאות מוכרות) לפי מדרגות
              המס האישיות — מ-10% על החלק הראשון של ההכנסה (עד 7,010 ₪/חודש ב-2026) ועד 50% בהכנסות
              הגבוהות ביותר (כולל מס יסף 3%). כל תושב ישראל נהנה מנקודות זיכוי — 2.25 נקודות בסיס
              (ואישה מקבלת 0.5 נוספת), כשכל נקודה שווה 242 ₪ הפחתת מס בחודש. במהלך השנה משלמים{' '}
              <Link href="/self-employed/tax-advances">מקדמות מס</Link> חודשיות או דו-חודשיות,
              ובסוף השנה מגישים דוח שנתי שמיישר את החשבון.
            </p>
          </div>

          <div className="overflow-x-auto my-6 not-prose">
            <table className="w-full text-sm border border-ink/15 overflow-hidden">
              <thead className="bg-cream-2">
                <tr className="text-right">
                  <th className="p-3 font-bold text-ink border-b border-ink/15">מדרגה</th>
                  <th className="p-3 font-bold text-ink border-b border-ink/15">הכנסה חודשית (רווח)</th>
                  <th className="p-3 font-bold text-gold border-b border-ink/15">שיעור המס</th>
                </tr>
              </thead>
              <tbody className="text-ink/70">
                <tr>
                  <td className="p-3 border-b border-ink/15">1</td>
                  <td className="p-3 border-b border-ink/15">עד 7,010 ₪</td>
                  <td className="p-3 border-b border-ink/15 font-semibold">10%</td>
                </tr>
                <tr className="bg-cream-2/50">
                  <td className="p-3 border-b border-ink/15">2</td>
                  <td className="p-3 border-b border-ink/15">7,011–10,060 ₪</td>
                  <td className="p-3 border-b border-ink/15 font-semibold">14%</td>
                </tr>
                <tr>
                  <td className="p-3 border-b border-ink/15">3</td>
                  <td className="p-3 border-b border-ink/15">10,061–19,000 ₪</td>
                  <td className="p-3 border-b border-ink/15 font-semibold">20%</td>
                </tr>
                <tr className="bg-cream-2/50">
                  <td className="p-3 border-b border-ink/15">4</td>
                  <td className="p-3 border-b border-ink/15">19,001–25,100 ₪</td>
                  <td className="p-3 border-b border-ink/15 font-semibold">31%</td>
                </tr>
                <tr>
                  <td className="p-3 border-b border-ink/15">5</td>
                  <td className="p-3 border-b border-ink/15">25,101–46,690 ₪</td>
                  <td className="p-3 border-b border-ink/15 font-semibold">35%</td>
                </tr>
                <tr className="bg-cream-2/50">
                  <td className="p-3 border-b border-ink/15">6</td>
                  <td className="p-3 border-b border-ink/15">46,691–60,130 ₪</td>
                  <td className="p-3 border-b border-ink/15 font-semibold">47%</td>
                </tr>
                <tr>
                  <td className="p-3 border-b border-ink/15">7</td>
                  <td className="p-3 border-b border-ink/15">מעל 60,130 ₪</td>
                  <td className="p-3 border-b border-ink/15 font-semibold">50% (כולל מס יסף 3%)</td>
                </tr>
              </tbody>
            </table>
            <p className="text-xs text-ink/60 mt-2">
              מדרגות מס 2026 להכנסה מיגיעה אישית. ב-2026 הורחבו מדרגות ה-20% וה-31% במסגרת "ריווח
              מדרגות המס". המס מחושב באופן מדורג — כל מדרגה חלה רק על חלק ההכנסה שבתחומה.
            </p>
          </div>

          <div className="prose prose-lg max-w-none text-ink leading-relaxed">
            <h3>ביטוח לאומי — כמה משלם עצמאי בפועל?</h3>
            <p>
              דמי הביטוח הלאומי ודמי בריאות לעצמאי ב-2026 מחושבים בשני שיעורים: על חלק ההכנסה עד
              7,703 ₪ בחודש משלמים <strong>7.7%</strong> (מתוכם 4.47% ביטוח לאומי ו-3.23% דמי
              בריאות), ועל החלק שמעל — <strong>18%</strong> (12.83% ביטוח לאומי ו-5.17% דמי בריאות),
              עד תקרת הכנסה של 51,910 ₪ בחודש. חשוב לזכור: זה נטל משמעותי שגבוה מזה של שכיר באותה
              הכנסה, ולכן חובה לכלול אותו בתמחור ובתכנון התזרים. הביטוח הלאומי גובה{' '}
              <strong>מקדמות חודשיות</strong> לפי הצהרת ההכנסה שלכם ומתחשבן בסוף השנה מול השומה
              בפועל — עדכנו את המקדמות אם ההכנסה משתנה מהותית. חלק מדמי הביטוח הלאומי (לא דמי
              הבריאות) אף מוכר כניכוי לצורכי מס הכנסה. לחישוב מלא —{' '}
              <Link href="/self-employed/social-security">מחשבון ביטוח לאומי לעצמאי</Link>.
            </p>
            <h3>הוצאות מוכרות — הכלי המרכזי להקטנת המס</h3>
            <p>
              כל הוצאה ששימשה לייצור ההכנסה יכולה להקטין את הרווח החייב במס: ציוד, נסיעות, תוכנות,
              שכירות משרד, השתלמויות מקצועיות ועוד. עצמאים חדשים רבים "משאירים כסף על השולחן" פשוט
              כי לא שמרו קבלות. רשימה מלאה —{' '}
              <Link href="/self-employed/allowed-expenses">מדריך ההוצאות המוכרות לעצמאים</Link>.
            </p>
            <h3>פנסיה וקרן השתלמות</h3>
            <p>
              עצמאים חייבים בהפקדה לפנסיה על פי חוק (
              <Link href="/self-employed/mandatory-pension">פנסיית חובה לעצמאים</Link>), ובנוסף
              כדאי להכיר את <strong>קרן ההשתלמות לעצמאים</strong> — אפיק חיסכון עם הטבת מס: ניכוי
              של עד 4.5% מההכנסה הקובעת, ותקרת הפקדה מוטבת של 20,566 ₪ בשנה (2026).
            </p>
            <h3>ניהול הכסף של העסק</h3>
            <p>
              ההמלצה החשובה ביותר לעצמאי חדש: <strong>הפרידו את כספי העסק מהכסף הפרטי</strong> —
              חשבון בנק ייעודי, מעקב חודשי אחרי הכנסות מול הוצאות, והפרשה שוטפת בצד למס, לביטוח
              הלאומי ולפנסיה, כדי שתשלומי סוף השנה לא יתפסו אתכם בלי כיסוי. למדריך המלא על ניהול
              הכספים, תזרים והתנהלות מול הבנק —{' '}
              <Link href="/self-employed/business-finance">התנהלות פיננסית לעצמאים: המדריך המלא</Link>.
            </p>
          </div>
        </section>

        {/* Persona examples */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-ink mb-4">שלוש דוגמאות מהשטח: איזה מסלול מתאים למי?</h2>
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
                המחזור רחוק מאוד מתקרת ה-122,833 ₪, אין כמעט מע"מ תשומות לקזז, ולקוח פרטי לא רוצה
                לשלם 18% יותר. <strong>הבחירה המתבקשת: עוסק פטור</strong> — מינימום בירוקרטיה,
                מקסימום תחרותיות במחיר. את השפעת ההכנסה הנוספת על המס כדאי לבדוק{' '}
                <Link href="/self-employed/employee-and-self-employed" className="text-gold hover:underline">
                  במחשבון שכיר וגם עצמאי
                </Link>.
              </p>
            </div>
            <div className="border border-ink/15 bg-cream-2 p-5">
              <p className="font-mono text-xs uppercase tracking-[0.14em] text-gold mb-2">
                דוגמה 2 · מפתח תוכנה שעוזב משרה לפרילנס
              </p>
              <p className="text-sm text-ink/70 leading-relaxed">
                מפתח עם חוזה ראשון מול חברת הייטק בהיקף חודשי קבוע — המחזור השנתי הצפוי יעבור את
                התקרה כבר בחודשים הראשונים, והלקוחות כולם עסקיים שמקזזים מע"מ ממילא.
                <strong> הבחירה המתבקשת: עוסק מורשה מהיום הראשון</strong> — פתיחה כפטור רק תחייב
                מעבר מסורבל באמצע השנה. בהמשך, כשהרווח יטפס למדרגות המס הגבוהות, שווה לבחון
                התאגדות כחברה בע"מ —{' '}
                <Link href="/self-employed/corporation-vs-individual" className="text-gold hover:underline">
                  מחשבון חברה בע"מ מול עוסק
                </Link>{' '}
                מראה את נקודת האיזון.
              </p>
            </div>
            <div className="border border-ink/15 bg-cream-2 p-5">
              <p className="font-mono text-xs uppercase tracking-[0.14em] text-gold mb-2">
                דוגמה 3 · פתיחת סטודיו עם השקעה בציוד
              </p>
              <p className="text-sm text-ink/70 leading-relaxed">
                צלמת שפותחת סטודיו: המחזור הצפוי בשנה הראשונה נמוך מהתקרה, אבל ההשקעה הראשונית —
                מצלמות, תאורה, שיפוץ, מחשב — כוללת מע"מ משמעותי. כעוסקת פטורה המע"מ הזה "הולך
                לאיבוד"; כעוסקת מורשה הוא מתקזז מול המע"מ שתגבה מלקוחות. אם חלק ניכר מהלקוחות הם
                עסקיים (אירועי חברה, קטלוגים) — <strong>מורשה עדיף למרות המחזור הנמוך</strong>. אם
                כמעט כולם פרטיים (חתונות, משפחות) — ההחלטה צמודה יותר ותלויה בגובה ההשקעה. זה
                בדיוק המקרה שבו כדאי לשבת עם רואה חשבון לפני הרישום, ולהריץ את המספרים{' '}
                <Link href="/self-employed/business-setup-cost" className="text-gold hover:underline">
                  במחשבון עלות פתיחת העסק
                </Link>.
              </p>
            </div>
          </div>
        </section>

        <div className="prose prose-lg max-w-none text-ink leading-relaxed">
          <h2>הטעויות הנפוצות של עצמאים חדשים</h2>
          <ul>
            <li>
              <strong>בחירת סיווג שגוי בהתחלה</strong> — פתיחת עוסק פטור כשרוב הלקוחות עסקיים, או
              מורשה כשעסק קטן היה מסתדר בלי דיווחי מע"מ. התוצאה: תשלום מע"מ מיותר או החמצת קיזוז
              תשומות.
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
              <strong>ערבוב בין חשבון בנק פרטי לעסקי</strong> — מקשה על מעקב, על הדוח השנתי ועל
              כל ביקורת עתידית.
            </li>
            <li>
              <strong>אי-הפרשה שוטפת למס ולפנסיה</strong> — עצמאי מקבל ברוטו ושוכח שחלק מהכסף
              אינו שלו; חשוב "לשלם לרשויות קודם" בכל חודש.
            </li>
            <li>
              <strong>תמחור לפי אינטואיציה</strong> — שכחת עלויות המס, הביטוח הלאומי, הפנסיה
              והחופשות בתעריף. השתמשו ב
              <Link href="/self-employed/hourly-rate">מחשבון תמחור שעת עבודה</Link> לפני שסוגרים
              מחיר עם לקוח ראשון.
            </li>
            <li>
              <strong>התעלמות מתקרת עוסק פטור</strong> — חציית 122,833 ₪ בלי מעבר מסודר לעוסק
              מורשה היא עבירה על החוק וגוררת חיוב מע"מ בדיעבד.
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
              <li>☐ הגדרתם מה העסק מוכר, למי, ובאיזה מחיר (בדקו עם <Link href="/self-employed/hourly-rate" className="text-gold hover:underline">מחשבון התמחור</Link>)</li>
              <li>☐ אמדתם את המחזור השנתי הצפוי — מעל או מתחת ל-122,833 ₪?</li>
              <li>☐ בחרתם סיווג: עוסק פטור / עוסק מורשה (או חברה בע"מ)</li>
              <li>☐ תקצבתם את עלויות הפתיחה (<Link href="/self-employed/business-setup-cost" className="text-gold hover:underline">מחשבון עלות פתיחת עסק</Link>)</li>
              <li>☐ פתחתם חשבון בנק נפרד לפעילות העסקית</li>
            </ul>
            <p className="font-mono text-xs uppercase tracking-[0.14em] text-gold mb-4">
              שבוע הפתיחה
            </p>
            <ul className="space-y-2 text-sm text-ink/80 leading-relaxed mb-6">
              <li>☐ פתיחת תיק מע"מ — טופס 821 (אונליין או בסניף)</li>
              <li>☐ פתיחת תיק מס הכנסה — טופס 5329</li>
              <li>☐ רישום כעצמאי בביטוח לאומי — טופס בל/6101</li>
              <li>☐ הסדרת תוכנה להפקת חשבוניות/קבלות (<Link href="/self-employed/invoices" className="text-gold hover:underline">איזה מסמך מפיקים למי?</Link>)</li>
            </ul>
            <p className="font-mono text-xs uppercase tracking-[0.14em] text-gold mb-4">
              בחודשים הראשונים
            </p>
            <ul className="space-y-2 text-sm text-ink/80 leading-relaxed">
              <li>☐ כיול מקדמות מס הכנסה לפי ההכנסה בפועל (<Link href="/self-employed/tax-advances" className="text-gold hover:underline">מחשבון מקדמות</Link>)</li>
              <li>☐ בדיקת מקדמות ביטוח לאומי (<Link href="/self-employed/social-security" className="text-gold hover:underline">מחשבון ב"ל לעצמאי</Link>)</li>
              <li>☐ פתיחת קופת פנסיה — חובת הפקדה לעצמאים</li>
              <li>☐ שמירת כל קבלה והוצאה עסקית מסודרת</li>
              <li>☐ הפרשה חודשית בצד למס, ב"ל ופנסיה — לפני שמושכים כסף הביתה (<Link href="/self-employed/business-finance" className="text-gold hover:underline">מדריך ההתנהלות הפיננסית</Link>)</li>
              <li>☐ מעקב רבעוני אחרי המחזור מול תקרת עוסק פטור (<Link href="/self-employed/vat-threshold" className="text-gold hover:underline">מחשבון התקרה</Link>)</li>
            </ul>
          </div>
        </section>

        {/* Related calculators */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-ink mb-4">מחשבונים ומדריכים שיעזרו לך להתחיל</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              { href: '/self-employed/vat', label: 'מחשבון מע"מ' },
              { href: '/self-employed/net', label: 'מחשבון נטו לעצמאי' },
              { href: '/self-employed/social-security', label: 'מחשבון ביטוח לאומי לעצמאי' },
              { href: '/self-employed/tax-advances', label: 'מחשבון מקדמות מס' },
              { href: '/self-employed/vat-threshold', label: 'מחשבון תקרת עוסק פטור' },
              { href: '/self-employed/hourly-rate', label: 'מחשבון תמחור שעת עבודה' },
              { href: '/self-employed/corporation-vs-individual', label: 'חברה בע"מ מול עוסק' },
              { href: '/self-employed/business-setup-cost', label: 'כמה עולה לפתוח עסק?' },
              { href: '/business', label: '🏗️ כמה עולה להקים סטודיו / בית קפה / קליניקה — לפי סוג עסק' },
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
          <DisclaimerBox text="המידע בעמוד זה הוא מידע כללי בלבד ואינו מהווה ייעוץ מס, ייעוץ משפטי או ייעוץ פיננסי. הנתונים נכונים לשנת המס 2026 ועשויים להתעדכן. לפני פתיחת עסק ובחירת סיווג, מומלץ להתייעץ עם רואה חשבון או יועץ מס מוסמך." />
        </section>

        <section className="mb-8">
          <AuthorBox />
        </section>
      </article>
    </div>
  );
}
