import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: "המדריך השלם למשכנתא בישראל 2026 - מ-א' עד ת'",
  description:
    'המדריך הכי מקיף למשכנתא: מתחיל לחלוטין עד מומחה. הוראת בנק ישראל 329, בחירת תמהיל, מסלולים, מחזור, פירעון מוקדם, LTV וכל מה שצריך.',
  alternates: { canonical: '/guides/mortgage-complete-guide-2026' },
  openGraph: {
    title: "המדריך השלם למשכנתא בישראל 2026 - מ-א' עד ת'",
    description:
      'המדריך הכי מקיף למשכנתא: מתחיל לחלוטין עד מומחה. הוראת בנק ישראל 329, בחירת תמהיל, מסלולים, מחזור, פירעון מוקדם, LTV וכל מה שצריך.',
    type: 'article',
    locale: 'he_IL',
  },
};

const tocItems = [
  { id: 'five-questions', label: 'לפני שמתחילים: 5 שאלות חייבות' },
  { id: 'glossary', label: 'מילון מונחים: ריבית, תמהיל, LTV' },
  { id: 'tldr', label: 'תקציר 5 דקות לעצלנים' },
  { id: 'when', label: 'מתי לקחת משכנתא?' },
  { id: 'how-much', label: 'כמה אפשר לקבל? LTV + DTI' },
  { id: 'directive-329', label: 'הוראת בנק ישראל 329' },
  { id: 'tracks', label: 'כל מסלולי המשכנתא' },
  { id: 'mix', label: 'בחירת התמהיל הנכון' },
  { id: 'process', label: 'תהליך בקשת משכנתא - 12 שבועות' },
  { id: 'documents', label: 'המסמכים שצריך' },
  { id: 'negotiation', label: 'התמקחות - איך ולמה' },
  { id: 'refinance', label: 'מחזור משכנתא' },
  { id: 'prepayment', label: 'פירעון מוקדם' },
  { id: 'grace', label: 'גרייס/בלון' },
  { id: 'mistakes', label: 'טעויות נפוצות' },
  { id: 'tools', label: 'כלים ומחשבונים' },
  { id: 'faq', label: 'שאלות נפוצות' },
];

export default function MortgageCompleteGuide() {
  return (
    <div className="min-h-screen bg-white" dir="rtl">
      {/* Schema.org Article markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: "המדריך השלם למשכנתא בישראל 2026 - מ-א' עד ת'",
            description:
              'המדריך הכי מקיף למשכנתא: מתחיל לחלוטין עד מומחה. הוראת בנק ישראל 329, בחירת תמהיל, מסלולים, מחזור, פירעון מוקדם, LTV.',
            datePublished: '2026-05-16',
            dateModified: '2026-05-16',
            author: { '@type': 'Organization', name: 'חשבונאי' },
            publisher: { '@type': 'Organization', name: 'חשבונאי' },
            inLanguage: 'he',
            url: 'https://cheshbonai.co.il/guides/mortgage-complete-guide-2026',
          }),
        }}
      />

      {/* Hero */}
      <div className="bg-gradient-to-bl from-blue-900 via-blue-700 to-blue-500 text-white py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-sm text-blue-200 mb-3">
            <Link href="/" className="hover:text-white">דף הבית</Link>
            {' › '}
            <Link href="/real-estate" className="hover:text-white">נדל&quot;ן</Link>
            {' › '}
            <span>מדריך משכנתא שלם</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
            המדריך השלם למשכנתא בישראל 2026
          </h1>
          <p className="text-xl text-blue-100 mb-6 max-w-3xl">
            מתחיל לחלוטין עד מומחה. הוראת בנק ישראל 329, בחירת תמהיל, כל המסלולים,
            מחזור, פירעון מוקדם, LTV ומה שבין לבין.
          </p>
          <div className="flex flex-wrap gap-4 text-sm text-blue-200">
            <span>⏱ זמן קריאה: ~45 דקות</span>
            <span>📅 עודכן: מאי 2026</span>
            <span>📖 ~7,500 מילים</span>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10 lg:flex lg:gap-10">
        {/* Sticky TOC - desktop */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <div className="sticky top-8 bg-blue-50 rounded-xl p-5 border border-blue-100">
            <h2 className="font-bold text-blue-900 mb-3 text-sm uppercase tracking-wide">תוכן עניינים</h2>
            <ol className="space-y-1">
              {tocItems.map((item, i) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    className="text-sm text-blue-700 hover:text-blue-900 hover:underline block py-0.5"
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

          {/* Section 1 */}
          <section id="five-questions" className="mb-14 scroll-mt-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 pb-2 border-b-2 border-blue-500">
              1. לפני שמתחילים: 5 שאלות שאתה חייב לענות לעצמך
            </h2>
            <p className="text-gray-700 mb-6 text-lg">
              לפני שניגשים לבנק, לפני שמחפשים דירה, ואפילו לפני שמדברים עם יועץ משכנתא –
              יש חמש שאלות בסיסיות שכל לווה חייב לענות בכנות. הן יקבעו את כל שאר ההחלטות.
            </p>

            <h3 className="text-xl font-bold text-gray-800 mb-3">שאלה 1: מהי יכולת ההחזר החודשית האמיתית שלך?</h3>
            <p className="text-gray-700 mb-5">
              הכלל: ההחזר החודשי לא יעלה על 33%–40% מהשכר נטו. אם שכרך נטו הוא 15,000 ₪,
              ההחזר המקסימלי שכדאי לך לקחת הוא בין 4,950 ₪ ל-6,000 ₪. כלל זה אינו חוקי – הוא
              פרקטי. בנקים ידרשו עד 40%, אך אנחנו ממליצים לשמור על מרווח בטיחות של 20%.
            </p>
            <div className="bg-yellow-50 border-r-4 border-yellow-400 p-4 mb-5 rounded">
              <strong>אזהרה:</strong> אל תחשב לפי שכר הברוטו. חשב לפי שכר נטו בפועל, אחרי מס,
              ב.ל. ופנסיה. ההפרש יכול להיות 25%–35%.
            </div>

            <h3 className="text-xl font-bold text-gray-800 mb-3">שאלה 2: כמה הון עצמי יש לך?</h3>
            <p className="text-gray-700 mb-5">
              הון עצמי מינימלי לדירה ראשונה (LTV 75%) הוא 25% מערך הנכס. לדירה שנייה (LTV 50%) –
              50%. אבל שים לב: הון עצמי ≠ מה שיש לך בבנק. ממנו יש להוציא: עלויות עסקה (מס רכישה,
              שכר עו"ד, תיווך = ~2%–5%), שיפוצים, ריהוט, ותקציב חירום של 3 חודשי משכורת.
            </p>

            <h3 className="text-xl font-bold text-gray-800 mb-3">שאלה 3: מה אורך חיי הצפוי עם הדירה?</h3>
            <p className="text-gray-700 mb-5">
              הולדים תינוק בעוד שנה? מתכוונים לעלות לדירה גדולה יותר בעוד 5 שנים? עוברים
              עיר? יחס ההחזר (רב-שנתי) ורמת הגמישות (אפשרות מחזור, פירעון מוקדם) יהיו שונים
              לפי הצפי. מי שיידע שמוכר בעוד 7 שנים יעדיף תמהיל גמיש יותר עם פחות צמוד מדד.
            </p>

            <h3 className="text-xl font-bold text-gray-800 mb-3">שאלה 4: מה סיבולת הסיכון שלך?</h3>
            <p className="text-gray-700 mb-5">
              אם הריבית תעלה מ-5% ל-8% – תוכל לעמוד בהחזר? לא מדובר בהסתברות בלבד – זה קרה
              ב-2022. אם התשובה היא "לא" – תזדקק לתמהיל עם יחס גבוה יותר של קל&quot;צ (קבוע לא
              צמוד). אם התשובה היא "כן, אני מסתכן" – פריים גבוה יחסוך ריבית אבל יצריך עצבי ברזל.
            </p>

            <h3 className="text-xl font-bold text-gray-800 mb-3">שאלה 5: האם אתה יודע את הרקורד הפיננסי שלך?</h3>
            <p className="text-gray-700 mb-5">
              ציון אשראי, חריגות בחשבון, הלוואות קיימות – הבנק יראה הכל. בדוק את דוח האשראי
              שלך מהמאגר הממשלתי (creditdata.org.il) לפני הגשת הבקשה. ניתן לתקן שגיאות ולנקות
              חריגות ישנות לפני הפגישה עם הבנק.
            </p>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mt-6">
              <h4 className="font-bold text-blue-900 mb-2">כלי לחישוב ראשוני</h4>
              <p className="text-blue-800 text-sm mb-3">
                השתמש במחשבון המשכנתא שלנו לקבלת תמונה ראשונית של ההחזר החודשי:
              </p>
              <Link
                href="/real-estate/mortgage"
                className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm font-medium"
              >
                מחשבון משכנתא בסיסי ←
              </Link>
            </div>
          </section>

          {/* Section 2 */}
          <section id="glossary" className="mb-14 scroll-mt-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 pb-2 border-b-2 border-blue-500">
              2. מילון מונחים: הריבית, התמהיל, ה-LTV וכל מה שצריך לדעת
            </h2>

            <div className="grid md:grid-cols-2 gap-4">
              {[
                { term: 'LTV (Loan to Value)', def: 'יחס הלוואה לערך הנכס. דירה ראשונה: 75% מקסימום. דירה שנייה: 50%. ככל שה-LTV נמוך, כך הבנק לוקח פחות סיכון ונוטה להציע ריבית טובה יותר.' },
                { term: 'DTI (Debt to Income)', def: 'יחס חוב להכנסה. הבנקים בישראל בודקים שהחזר כלל ההלוואות לא יעלה על 40%–50% מהשכר נטו.' },
                { term: 'פריים (Prime)', def: 'ריבית בנק ישראל + 1.5%. נכון למאי 2026: ריבית ב"י = 4.5%, פריים = 6%. ריבית זו משתנה בכל פעם שבנק ישראל משנה את הריבית הבסיסית.' },
                { term: 'קל"צ (קבוע לא צמוד)', def: 'ריבית קבועה שאינה צמודה למדד. ההחזר ידוע מראש לכל תקופת ההלוואה. יקרה יותר בדרך כלל, אך נותנת ודאות מלאה.' },
                { term: 'צמוד מדד', def: 'הקרן (ולפעמים הריבית) צמודות למדד המחירים לצרכן. בתקופות אינפלציה גבוהה – היתרה עולה, ההחזר גדל. סיכון משמעותי שיש להכיר.' },
                { term: 'תמהיל', def: 'שילוב המסלולים בתוך המשכנתא. לפי הוראה 329, לפחות שליש בריבית קבועה. תמהיל טיפוסי: 33% קל"צ + 33% פריים + 33% משתנה.' },
                { term: 'לוח שפיצר', def: 'לוח סילוקין שבו ההחזר החודשי שווה לאורך כל התקופה, אך הרכב הריבית/קרן משתנה – בהתחלה רוב ההחזר הוא ריבית.' },
                { term: 'לוח קרן שווה', def: 'ההחזר מתחיל גבוה ויורד עם הזמן. ריבית כוללת נמוכה יותר, אך צריך יכולת גבוהה יותר בהתחלה.' },
                { term: 'גרייס (Grace)', def: 'תקופה שבה משלמים ריבית בלבד ללא קרן. מאפשר להפחית החזר זמנית – אך הקרן לא יורדת ובטווח הארוך הלוואה יקרה יותר.' },
                { term: 'פירעון מוקדם', def: 'החזר הלוואה לפני הזמן. עשוי לדרוש תשלום עמלת פירעון מוקדם (עמלה שמחושבת לפי הפרש הריביות). על פריים – ללא עמלה.' },
                { term: 'מחזור משכנתא', def: 'סגירת המשכנתא הקיימת ולקיחת חדשה בתנאים טובים יותר. כדאי כשהריבית ירדה ב-1%+ מהריבית הנוכחית.' },
                { term: 'הצמדה', def: 'קישור הקרן למדד המחירים לצרכן. אם המדד עולה 3% – הקרן גדלה ב-3%. כלומר, תחזיר יותר כסף מנומינלי.' },
              ].map((item) => (
                <div key={item.term} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <dt className="font-bold text-blue-900 mb-1">{item.term}</dt>
                  <dd className="text-gray-700 text-sm">{item.def}</dd>
                </div>
              ))}
            </div>
            <p className="mt-4 text-sm text-gray-500">
              למילון מונחים מלא ראה: <Link href="/glossary" className="text-blue-600 underline">מילון מונחים פיננסי שלם ←</Link>
            </p>
          </section>

          {/* Section 3 - TL;DR */}
          <section id="tldr" className="mb-14 scroll-mt-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 pb-2 border-b-2 border-blue-500">
              3. תקציר 5 דקות לעצלנים (TL;DR)
            </h2>
            <div className="bg-gradient-to-l from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
              <ol className="space-y-3 text-gray-800">
                <li className="flex gap-3">
                  <span className="font-bold text-blue-700 flex-shrink-0">1.</span>
                  <span><strong>הון עצמי:</strong> 25% לפחות לדירה ראשונה (+ 5% עלויות). 50% לדירה שנייה.</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-blue-700 flex-shrink-0">2.</span>
                  <span><strong>הוראה 329:</strong> שליש קבוע, שליש מקסימום פריים, שלישים-שלישים-שלישים (לא חובה ממש).</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-blue-700 flex-shrink-0">3.</span>
                  <span><strong>תמהיל בסיסי:</strong> 33% קל&quot;צ + 33% פריים + 33% משתנה כל 5 שנים צמוד.</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-blue-700 flex-shrink-0">4.</span>
                  <span><strong>השוואת בנקים:</strong> פנה ל-3 בנקים לפחות, אל תקבל ההצעה הראשונה.</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-blue-700 flex-shrink-0">5.</span>
                  <span><strong>עלות כוללת:</strong> שים לב לריבית כוללת לאורך כל התקופה, לא רק ההחזר החודשי.</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-blue-700 flex-shrink-0">6.</span>
                  <span><strong>מחזור:</strong> בדוק מחדש כל 3–5 שנים. ירידת ריבית של 1% יכולה לחסוך 100,000 ₪+.</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-blue-700 flex-shrink-0">7.</span>
                  <span><strong>יועץ עצמאי:</strong> שווה לשלם 2,000–5,000 ₪ ליועץ בלתי תלוי. על משכנתא של 1.5M₪ –כלום.</span>
                </li>
              </ol>
            </div>
          </section>

          {/* Section 4 */}
          <section id="when" className="mb-14 scroll-mt-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 pb-2 border-b-2 border-blue-500">
              4. מתי לקחת משכנתא? – ניתוח עיתוי
            </h2>
            <p className="text-gray-700 mb-5">
              השאלה הגדולה: &quot;האם עכשיו זה הזמן?&quot; – אין לה תשובה אחת. יש משתנים שכן ניתן לבחון:
            </p>

            <h3 className="text-xl font-bold text-gray-800 mb-3">מחזור ריבית בנק ישראל</h3>
            <p className="text-gray-700 mb-5">
              ריבית בנק ישראל (מאי 2026) היא 4.5%. הריבית הגבוהה אומרת שמשכנתא יקרה יותר
              מאשר בתקופת ריבית 0.1% (2021). אולם מחירי הדירות לא ירדו בהתאם, ולמעשה בחלק
              מהאזורים עלו. לכן, ממתינים לא בהכרח נהנים.
            </p>

            <h3 className="text-xl font-bold text-gray-800 mb-3">מדד כדאיות: שכירות vs. משכנתא</h3>
            <p className="text-gray-700 mb-5">
              כלל אצבע: אם שכר הדירה × 200 = ערך הנכס, השוק &quot;הגון&quot;. בישראל 2026 שכ&quot;ד ×
              300–400 = מחיר הנכס. פירוש: הנכס יקר בין 50%–100% לעומת מה שמוצדק כלכלית.
              זה לא אומר &quot;אל תקנה&quot; – אלא קנה כי אתה רוצה לגור שם, לא בתור השקעה גרידא.
            </p>

            <h3 className="text-xl font-bold text-gray-800 mb-3">מתי כן כדאי?</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-5">
              <li>הון עצמי מוכן ויציבות תעסוקתית ל-3+ שנים</li>
              <li>מחיר השכירות גבוה מ-50% מהחזר משכנתא (לא כדאי לשכור)</li>
              <li>ריבית ירדה ב-1% לפחות מהשיא, או שהריבית הנוכחית &quot;סבירה&quot; ביחס להיסטוריה</li>
              <li>נכס שאתה באמת רוצה, לא &quot;מה שמצאתי&quot;</li>
              <li>בני זוג מאוחדים ומסכימים על ההתחייבות</li>
            </ul>

            <h3 className="text-xl font-bold text-gray-800 mb-3">מתי לא?</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-5">
              <li>תכניות לשינוי מהותי בחיים תוך 3 שנים (ילד, עלייה לחו&quot;ל, עסק חדש)</li>
              <li>חוב גבוה אחר (הלוואות, כרטיסי אשראי) שגורר ריבית גבוהה</li>
              <li>הון עצמי לפחות מ-20% מהנכס (מסוכן מאוד)</li>
              <li>יציבות תעסוקתית נמוכה</li>
            </ul>
          </section>

          {/* Section 5 */}
          <section id="how-much" className="mb-14 scroll-mt-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 pb-2 border-b-2 border-blue-500">
              5. כמה אפשר לקבל? – LTV + DTI הסבר מלא
            </h2>

            <h3 className="text-xl font-bold text-gray-800 mb-3">LTV – הגבלת אחוז מימון</h3>
            <div className="overflow-x-auto mb-6">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-blue-900 text-white">
                    <th className="border border-blue-700 p-3 text-right">סוג רוכש</th>
                    <th className="border border-blue-700 p-3 text-right">LTV מקסימלי</th>
                    <th className="border border-blue-700 p-3 text-right">הון עצמי מינימלי</th>
                    <th className="border border-blue-700 p-3 text-right">דוגמה על 2M₪</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['דירה ראשונה / יחידה', '75%', '25%', '500,000 ₪'],
                    ['דירה שנייה (משקיע)', '50%', '50%', '1,000,000 ₪'],
                    ['דירה חלופית (מוכר + קונה)', '70%', '30%', '600,000 ₪'],
                    ['דירה להשקעה (כבר יש דירה)', '50%', '50%', '1,000,000 ₪'],
                  ].map(([type, ltv, equity, example], i) => (
                    <tr key={type} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="border border-gray-200 p-3 font-medium">{type}</td>
                      <td className="border border-gray-200 p-3 text-green-700 font-bold">{ltv}</td>
                      <td className="border border-gray-200 p-3 text-red-700">{equity}</td>
                      <td className="border border-gray-200 p-3">{example}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h3 className="text-xl font-bold text-gray-800 mb-3">DTI – יחס חוב להכנסה</h3>
            <p className="text-gray-700 mb-5">
              הבנקים בודקים שסך ההחזרים (כלל ההלוואות, לא רק המשכנתא) לא יעלה על 40%–50%
              מהשכר נטו. דוגמה: הכנסה נטו משפחתית 20,000 ₪ → מקסימום החזר 8,000 ₪–10,000 ₪.
              אם כבר יש לך הלוואת רכב של 2,000 ₪ – נשאר לך מרווח של 6,000 ₪–8,000 ₪ למשכנתא.
            </p>

            <h3 className="text-xl font-bold text-gray-800 mb-3">חישוב ראלי: מה אחוז ה-LTV הנכון לך?</h3>
            <p className="text-gray-700 mb-5">
              גם אם הבנק מוכן לתת 75% – לא תמיד כדאי לקחת את המקסימום. LTV גבוה = יותר ריבית
              לאורך שנים + פחות גמישות. ממליצים להשאיר לפחות 10%–15% &quot;כרית&quot; מתחת לאחוז המקסימלי
              המותר.
            </p>

            <Link
              href="/real-estate/mortgage"
              className="inline-block bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 font-medium"
            >
              חשב את ההחזר שלך לפי LTV ←
            </Link>
          </section>

          {/* Section 6 */}
          <section id="directive-329" className="mb-14 scroll-mt-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 pb-2 border-b-2 border-blue-500">
              6. הוראת בנק ישראל 329 – 3 הכללים
            </h2>
            <p className="text-gray-700 mb-5">
              הוראת ניהול בנקאי תקין מספר 329 (עודכנה 2010) קובעת כמה כללים מחייבים לגבי
              הרכב המשכנתא. מטרתה: הגן על הלווה מפני סיכון ריבית מוגזם.
            </p>

            <div className="grid md:grid-cols-3 gap-4 mb-6">
              {[
                {
                  rule: 'כלל 1: שליש קבוע',
                  detail: 'לפחות 1/3 (33.3%) מהמשכנתא חייב להיות במסלול ריבית קבועה (קל"צ או צמוד קבועה). מגביל סיכון ריבית עולה.',
                  color: 'bg-green-50 border-green-400',
                },
                {
                  rule: 'כלל 2: שליש מקסימום פריים',
                  detail: 'לא יותר מ-1/3 (33.3%) מהמשכנתא יכול להיות במסלול פריים. מגביל חשיפה לריבית משתנה קצרת טווח.',
                  color: 'bg-yellow-50 border-yellow-400',
                },
                {
                  rule: 'כלל 3: LTV לפי סוג',
                  detail: 'הגבלת אחוז מימון לפי מטרת הרכישה: 75% לדירה ראשונה, 50% לדירה שנייה, 70% לחלופית.',
                  color: 'bg-blue-50 border-blue-400',
                },
              ].map((item) => (
                <div key={item.rule} className={`${item.color} border-r-4 rounded-xl p-5`}>
                  <h3 className="font-bold text-gray-900 mb-2">{item.rule}</h3>
                  <p className="text-gray-700 text-sm">{item.detail}</p>
                </div>
              ))}
            </div>

            <p className="text-gray-700">
              תמהיל שעומד בהוראה 329 נראה בדרך כלל כך: 33% קל&quot;צ + 33% פריים + 34% מסלול
              נוסף (לרוב: משתנה כל 5 שנים צמוד או קבועה צמודה). זה לא הכרח שבלעדיו הבנק לא
              יתן משכנתא – אלא קווים מנחים שהבנקים מחויבים להציע בהתאם להם.
            </p>

            <div className="mt-4">
              <Link href="/blog/boi-directive-329-mortgage-rules" className="text-blue-600 underline text-sm">
                קרא את המדריך המלא להוראה 329 ←
              </Link>
            </div>
          </section>

          {/* Section 7 */}
          <section id="tracks" className="mb-14 scroll-mt-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 pb-2 border-b-2 border-blue-500">
              7. כל מסלולי המשכנתא בישראל – מדריך מלא
            </h2>

            <h3 className="text-xl font-bold text-gray-800 mb-3">מסלול 1: פריים (Prime)</h3>
            <p className="text-gray-700 mb-2">
              <strong>מהו:</strong> ריבית הבנק + 1.5%. כיום (מאי 2026): ריבית ב&quot;י 4.5% → פריים 6%.
            </p>
            <p className="text-gray-700 mb-2"><strong>יתרון:</strong> ריבית נמוכה בתקופת ריבית ב&quot;י נמוכה. פירעון מוקדם ללא עמלה. גמישות מלאה.</p>
            <p className="text-gray-700 mb-5"><strong>חיסרון:</strong> ריבית עולה כשבנק ישראל מעלה. מגבלת 33% מהתמהיל. חוסר ודאות.</p>

            <h3 className="text-xl font-bold text-gray-800 mb-3">מסלול 2: קל&quot;צ (קבוע לא צמוד)</h3>
            <p className="text-gray-700 mb-2">
              <strong>מהו:</strong> ריבית קבועה לכל תקופת ההלוואה. ההחזר לא ישתנה לעולם.
            </p>
            <p className="text-gray-700 mb-2"><strong>יתרון:</strong> ודאות מלאה. מגן מפני עליית ריבית. ידוע מראש.</p>
            <p className="text-gray-700 mb-5"><strong>חיסרון:</strong> ריבית גבוהה יותר מהשוק. עמלת פירעון מוקדם גבוהה כשריבית יורדת. אין הנאה מירידת ריבית.</p>

            <h3 className="text-xl font-bold text-gray-800 mb-3">מסלול 3: קבועה צמודה למדד</h3>
            <p className="text-gray-700 mb-2">
              <strong>מהו:</strong> ריבית קבועה, אך הקרן צמודה למדד המחירים לצרכן.
            </p>
            <p className="text-gray-700 mb-2"><strong>יתרון:</strong> ריבית נמוכה יותר מקל&quot;צ. ריבית קבועה – ידוע מה משלמים (%  ריבית).</p>
            <p className="text-gray-700 mb-5"><strong>חיסרון:</strong> הקרן גדלה עם האינפלציה. בתקופת אינפלציה גבוהה (2022-2023) – יתרת החוב עלתה.</p>

            <h3 className="text-xl font-bold text-gray-800 mb-3">מסלול 4: משתנה כל 5 שנים (צמוד מדד)</h3>
            <p className="text-gray-700 mb-2">
              <strong>מהו:</strong> ריבית מתחדשת כל 5 שנים לפי ריבית השוק. הקרן צמודה.
            </p>
            <p className="text-gray-700 mb-2"><strong>יתרון:</strong> בינוני בין קל&quot;צ לפריים. אפשרות לפירעון ביום הריענון ללא עמלה.</p>
            <p className="text-gray-700 mb-5"><strong>חיסרון:</strong> הצמדה + ריבית משתנה = כפול סיכון. עלייה חדה אפשרית.</p>

            <h3 className="text-xl font-bold text-gray-800 mb-3">מסלול 5: משתנה לא צמוד</h3>
            <p className="text-gray-700 mb-2">
              <strong>מהו:</strong> ריבית מתחדשת כל 5 שנים, ללא הצמדה למדד.
            </p>
            <p className="text-gray-700 mb-2"><strong>יתרון:</strong> אין סיכון הצמדה. ריבית נמוכה יחסית לקל&quot;צ.</p>
            <p className="text-gray-700 mb-5"><strong>חיסרון:</strong> ריבית משתנה – חשיפה לעליות. פחות נפוץ בשוק.</p>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <p className="text-sm text-blue-800">
                לניתוח מעמיק של כל המסלולים:{' '}
                <Link href="/blog/mortgage-tracks-guide-2026" className="underline">
                  מדריך מסלולי המשכנתא 2026 ←
                </Link>
              </p>
            </div>
          </section>

          {/* Section 8 */}
          <section id="mix" className="mb-14 scroll-mt-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 pb-2 border-b-2 border-blue-500">
              8. בחירת התמהיל הנכון – לפי פרופיל
            </h2>
            <p className="text-gray-700 mb-6">
              אין &quot;תמהיל אחד שמתאים לכולם&quot;. הנה 4 פרופילים ותמהיל מומלץ לכל אחד:
            </p>

            <div className="space-y-5">
              {[
                {
                  profile: 'שונאי סיכון / זוגות עם הכנסה קבועה',
                  icon: '🛡️',
                  mix: '50% קל"צ + 25% פריים + 25% משתנה לא צמוד',
                  why: 'ודאות גבוהה, אפשר לתכנן תקציב. המחיר: ריבית גבוהה יותר בסה"כ.',
                },
                {
                  profile: 'בני 30, זוג צעיר, צפי הכנסות עולות',
                  icon: '🚀',
                  mix: '33% קל"צ + 33% פריים + 34% משתנה 5 שנים',
                  why: 'פריים ירד בטווח הבינוני? מרוויחים. ההכנסה תעלה ותכסה עליות. גמישות לפירעון חלקי.',
                },
                {
                  profile: 'בני 50, לפני פרישה (עד 10 שנים)',
                  icon: '⚖️',
                  mix: '60% קל"צ + 40% פריים (ללא צמוד)',
                  why: 'אפס חשיפה להצמדה, כי יש פחות שנים "לספוג" אינפלציה. ריבית קבועה = ביטחון לפני פרישה.',
                },
                {
                  profile: 'משקיעים (דירה להשקעה)',
                  icon: '📈',
                  mix: '25% קל"צ + 33% פריים + 42% משתנה צמוד',
                  why: 'ממקסמים גמישות – רוצים פירעון מהיר אם שוק הנדל"ן עולה. פריים גבוה = בעיה, לכן מגבילים.',
                },
              ].map((item) => (
                <div key={item.profile} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {item.icon} {item.profile}
                  </h3>
                  <div className="bg-blue-50 rounded-lg px-4 py-2 mb-2 font-mono text-blue-900 text-sm">
                    {item.mix}
                  </div>
                  <p className="text-gray-700 text-sm">{item.why}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 bg-purple-50 border border-purple-200 rounded-xl p-4">
              <p className="text-sm text-purple-800 mb-2 font-medium">
                נסה את האופטימייזר שלנו – כלי שמחשב את התמהיל האופטימלי לפרופיל שלך:
              </p>
              <Link
                href="/real-estate/mortgage-optimizer"
                className="inline-block bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 text-sm font-medium"
              >
                מחשבון אופטימייזר תמהיל ←
              </Link>
            </div>
          </section>

          {/* Section 9 */}
          <section id="process" className="mb-14 scroll-mt-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 pb-2 border-b-2 border-blue-500">
              9. תהליך בקשת משכנתא – 12 שבועות מ-א' עד ת'
            </h2>

            <div className="space-y-4">
              {[
                { week: 'שבועות 1–2', step: 'הכנה', detail: 'בדיקת ציון אשראי, ריכוז מסמכים, חישוב הון עצמי מדויק, הגדרת תקציב.' },
                { week: 'שבועות 2–3', step: 'פנייה ל-3–4 בנקים', detail: 'הגשת בקשה מקדמית (pre-approval) לבנקים שונים. קבלת הצעות ראשוניות.' },
                { week: 'שבועות 3–4', step: 'התמקחות', detail: 'השוואת ההצעות, חזרה לכל בנק עם הצעה המתחרה. ניהול מו"מ על כל נקודת בסיס.' },
                { week: 'שבועות 4–5', step: 'אישור עקרוני', detail: 'קבלת אישור עקרוני (אישור כתוב). תוקף: 90 יום. אתה יכול לחפש דירה.' },
                { week: 'שבועות 5–9', step: 'חיפוש דירה + חוזה', detail: 'חתימה על חוזה רכישה. חשוב: הכנס סעיף המותנה בקבלת משכנתא!' },
                { week: 'שבועות 9–10', step: 'שמאות ואישור סופי', detail: 'שמאי מטעם הבנק מעריך את הנכס. בהתאם לשמאות, הבנק מאשר סכום סופי.' },
                { week: 'שבועות 10–11', step: 'חתימה על חוזי משכנתא', detail: 'חתימה על כל המסמכים: שטר חוב, הסכם משכנתא, ביטוח חיים וביטוח מבנה.' },
                { week: 'שבוע 12', step: 'העברת כספים', detail: 'הבנק מעביר כספים לחשבון הנאמנות. סגירת עסקת הרכישה.' },
              ].map((item) => (
                <div key={item.week} className="flex gap-4 bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex-shrink-0 bg-blue-600 text-white rounded-lg px-3 py-2 text-xs font-bold text-center min-w-[80px]">
                    {item.week}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{item.step}</h3>
                    <p className="text-gray-700 text-sm">{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Section 10 */}
          <section id="documents" className="mb-14 scroll-mt-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 pb-2 border-b-2 border-blue-500">
              10. המסמכים שצריך – רשימה מלאה
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-bold text-gray-800 mb-3">מסמכי זהות</h3>
                <ul className="space-y-1 text-gray-700 text-sm">
                  <li>תעודות זהות של כל הלווים</li>
                  <li>תעודת נישואים / גירושים (אם רלוונטי)</li>
                  <li>צווי ירושה (אם רלוונטי)</li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-gray-800 mb-3">מסמכי הכנסה (שכירים)</h3>
                <ul className="space-y-1 text-gray-700 text-sm">
                  <li>3 תלושי שכר אחרונים</li>
                  <li>אישור העסקה ממעסיק</li>
                  <li>טופס 106 (שנת מס אחרונה)</li>
                  <li>חוזה עבודה</li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-gray-800 mb-3">מסמכי הכנסה (עצמאיים)</h3>
                <ul className="space-y-1 text-gray-700 text-sm">
                  <li>שומות מס 2 שנים אחרונות</li>
                  <li>דוחות כספיים (אם חברה)</li>
                  <li>דוח רואה חשבון</li>
                  <li>אישור עוסק ממע&quot;מ</li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-gray-800 mb-3">מסמכי נכס</h3>
                <ul className="space-y-1 text-gray-700 text-sm">
                  <li>נסח טאבו / רישום</li>
                  <li>חוזה רכישה חתום</li>
                  <li>תשריט / היתר בנייה</li>
                  <li>שמאות (מבצעת הבנק)</li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-gray-800 mb-3">מסמכי הון עצמי</h3>
                <ul className="space-y-1 text-gray-700 text-sm">
                  <li>דפי חשבון 3 חודשים אחרונים</li>
                  <li>מסמכי קרן השתלמות (אם רלוונטי)</li>
                  <li>מסמכי מכירת נכס קודם (אם רלוונטי)</li>
                  <li>מסמכי מתנה/ירושה (אם רלוונטי)</li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-gray-800 mb-3">ביטוחים (דרישת הבנק)</h3>
                <ul className="space-y-1 text-gray-700 text-sm">
                  <li>פוליסת ביטוח חיים (כיסוי יתרת ההלוואה)</li>
                  <li>פוליסת ביטוח מבנה</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 11 */}
          <section id="negotiation" className="mb-14 scroll-mt-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 pb-2 border-b-2 border-blue-500">
              11. התמקחות – איך ולמה
            </h2>
            <p className="text-gray-700 mb-5">
              בנקים רבים מניחים שהלקוח יקבל את הצעתם הראשונה. אל תעשה את הטעות הזו.
              כל נקודת בסיס (0.01%) על משכנתא של 1.5M₪ ל-25 שנה = ~4,000 ₪ על פני כל התקופה.
              הפרש של 0.5% = 200,000 ₪! שווה לשקוע שבוע בתהליך.
            </p>

            <h3 className="text-xl font-bold text-gray-800 mb-3">טקטיקות התמקחות אפקטיביות</h3>
            <ul className="space-y-3 text-gray-700 mb-5">
              <li className="flex gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span><strong>3 בנקים לפחות:</strong> קבל הצעות מ-3 בנקים שונים. בנק שיודע שיש תחרות ייתן תנאים טובים יותר.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span><strong>הצג הצעה מתחרה:</strong> &quot;בנק א' הציע לי 5.8%. יכולים להתאים?&quot; – בדרך כלל כן.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span><strong>בנק עם מערכת יחסים:</strong> הבנק שבו מסורת משפחתית, שכר מועבר שם, חיסכון ישן – מניע לריבית טובה.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span><strong>מרכזת משכורת:</strong> הצעה להעביר שכר לבנק תמורת הנחה בריבית.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span><strong>יועץ משכנתא בלתי תלוי:</strong> שילמת 3,000 ₪ – וקיבלת הנחה של 0.3% = 120,000 ₪.</span>
              </li>
            </ul>
          </section>

          {/* Section 12 */}
          <section id="refinance" className="mb-14 scroll-mt-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 pb-2 border-b-2 border-blue-500">
              12. מחזור משכנתא – מתי כדאי ואיך לעשות
            </h2>
            <p className="text-gray-700 mb-5">
              מחזור משכנתא = סגירת המשכנתא הנוכחית ולקיחת חדשה בתנאים טובים יותר.
              זהו אחד הכלים הפיננסיים החזקים ביותר, ועדיין רוב הישראלים לא עושים אותו.
            </p>

            <h3 className="text-xl font-bold text-gray-800 mb-3">מתי כדאי לבצע מחזור?</h3>
            <ul className="space-y-2 text-gray-700 mb-5">
              <li>• ריבית השוק ירדה ב-1%+ מהריבית שלך</li>
              <li>• שכרך עלה משמעותית ויכולת ההחזר השתפרה</li>
              <li>• אחד מהמסלולים הגיע לנקודת ריענון (פירעון ללא עמלה)</li>
              <li>• שינוי מהותי בחיים (ירושה, גירושים, שינוי מקום עבודה)</li>
              <li>• גילית שהתמהיל הנוכחי לא מתאים לצרכים</li>
            </ul>

            <h3 className="text-xl font-bold text-gray-800 mb-3">כיצד לחשב אם כדאי?</h3>
            <p className="text-gray-700 mb-5">
              חישוב פשוט: (חיסכון חודשי × מספר חודשים נותרים) – עמלת פירעון מוקדם = רווח נטו.
              אם הרווח חיובי ומשמעותי – כדאי. הבנקים חייבים לחשב עבורך את עמלת הפירעון מוקדם.
            </p>

            <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4">
              <p className="text-green-800 text-sm mb-2 font-medium">דוגמה מספרית:</p>
              <p className="text-green-900 text-sm">
                יתרת הלוואה: 800,000 ₪ | ריבית נוכחית: 5.5% | ריבית שוק: 4.5% |
                חיסכון חודשי: ~550 ₪ | שנים נותרות: 15 (180 חודש) |
                עמלת פירעון: 25,000 ₪ | חיסכון כולל: 550 × 180 – 25,000 = <strong>74,000 ₪!</strong>
              </p>
            </div>

            <Link href="/blog/mortgage-refinance-when-and-how" className="text-blue-600 underline text-sm">
              המדריך השלם למחזור משכנתא ←
            </Link>
          </section>

          {/* Section 13 */}
          <section id="prepayment" className="mb-14 scroll-mt-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 pb-2 border-b-2 border-blue-500">
              13. פירעון מוקדם – חישוב חיסכון
            </h2>
            <p className="text-gray-700 mb-5">
              יש לך פתאום כסף (ירושה, בונוס, מכירת נכס) – האם לשלם את המשכנתא מוקדם?
              התשובה תלויה בריבית שאתה משלם לעומת מה שהכסף יניב בהשקעה חלופית.
            </p>

            <h3 className="text-xl font-bold text-gray-800 mb-3">מתי כדאי לפרוע מוקדם?</h3>
            <ul className="space-y-2 text-gray-700 mb-5">
              <li>• ריבית המשכנתא (אחרי מגן מס) גבוהה מהתשואה הצפויה מהשקעה</li>
              <li>• רוצה להפחית לחץ פיננסי ולשפר cash flow</li>
              <li>• מתקרב לפרישה ורוצה להיכנס אליה ללא חוב</li>
            </ul>

            <h3 className="text-xl font-bold text-gray-800 mb-3">מתי לא?</h3>
            <ul className="space-y-2 text-gray-700 mb-5">
              <li>• ריבית משכנתאך 4% ותשואת קרן השתלמות/שוק ההון 8%+ → השקע!</li>
              <li>• עמלת פירעון מוקדם גבוהה ששוחקת את החיסכון</li>
              <li>• יש לך הלוואות יקרות יותר (כרטיס אשראי ב-12%, הלוואה ב-7%)</li>
            </ul>

            <div className="bg-yellow-50 border-r-4 border-yellow-400 p-4 rounded">
              <strong>כלל אצבע:</strong> אם ריבית המשכנתא שלך &lt; 5% – השקע בשוק ההון.
              אם &gt; 5.5% – שקול פירעון. בין 5%–5.5% – תלוי בפרופיל האישי.
            </div>
          </section>

          {/* Section 14 */}
          <section id="grace" className="mb-14 scroll-mt-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 pb-2 border-b-2 border-blue-500">
              14. גרייס/בלון – מתי שווה ומתי לא
            </h2>

            <h3 className="text-xl font-bold text-gray-800 mb-3">גרייס (Grace Period)</h3>
            <p className="text-gray-700 mb-5">
              תקופת גרייס = שלב בהלוואה שבו משלמים ריבית בלבד (ללא קרן). ההחזר נמוך יותר בתקופה זו,
              אך הקרן לא יורדת – ולכן ריבית כוללת גבוהה יותר לאורך ההלוואה.
              <br /><strong>מתי שווה:</strong> שיפוץ דירה שנמשך 12–18 חודש לפני כניסה. הכנסות צפויות שתגדלנה משמעותית.
              <br /><strong>מתי לא שווה:</strong> כסטנדרד לצמצם החזר חודשי – עלות כוללת גבוהה מאוד.
            </p>

            <h3 className="text-xl font-bold text-gray-800 mb-3">בלון (Bullet)</h3>
            <p className="text-gray-700 mb-5">
              הלוואת בלון = כל הקרן מוחזרת בסוף התקופה בבת אחת. לאורך כל התקופה משלמים ריבית בלבד.
              נפוץ יותר בהלוואות עסקיות. בנדל&quot;ן – נדיר ולא מומלץ לאנשים פרטיים.
            </p>
          </section>

          {/* Section 15 */}
          <section id="mistakes" className="mb-14 scroll-mt-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 pb-2 border-b-2 border-blue-500">
              15. טעויות נפוצות ב-15 השנים האחרונות
            </h2>

            <div className="space-y-4">
              {[
                { mistake: '100% פריים ב-2021', result: 'ריבית 0.1% → פריים 1.6%. ב-2022: ריבית 4.5% → פריים 6%. החזר חודשי קפץ ב-40%!', lesson: 'אל תשים יותר מ-33% בפריים.' },
                { mistake: '100% צמוד מדד', result: 'אינפלציה 2022: 5%. הקרן גדלה בעשרות אלפי שקלים תוך שנה אחת.', lesson: 'הצמדה = סיכון מוסתר. הגבל ל-40% מהתמהיל.' },
                { mistake: 'לא לנהל מו"מ עם הבנק', result: 'הצעה ראשונה = הצעה הגבוהה ביותר. ממוצע הפרש: 0.3%–0.5% בריבית.', lesson: 'תמיד להתמקח, תמיד ל-3 בנקים.' },
                { mistake: 'לקחת כמה שיותר', result: 'LTV 75% + כל ההכנסה בהחזר → כל משבר (פיטורין, בעיה רפואית) → מחדל.', lesson: 'השאר 20% מרווח בין ההחזר לקיבולת.' },
                { mistake: 'לא לקחת יועץ עצמאי', result: 'הבנק = צד שכנגד. היועץ = צד שלך. שכר יועץ 2,000–5,000 ₪ = בדרך כלל יחסוך עשרות אלפי שקלים.', lesson: 'שקול יועץ עצמאי לפני כל החלטה גדולה.' },
                { mistake: 'לא לבדוק מחזור כל 5 שנים', result: 'אנשים שלקחו ב-2018 בריבית 4.2% ולא בדקו ב-2021 (ריבית 2%) – הפסידו מחזור משתלם.', lesson: 'קבע תזכורת כל 3–5 שנים לבדוק מחזור.' },
              ].map((item, i) => (
                <div key={i} className="border border-red-200 rounded-xl p-5 bg-red-50">
                  <h3 className="font-bold text-red-900 mb-1">טעות {i + 1}: {item.mistake}</h3>
                  <p className="text-red-800 text-sm mb-2"><strong>מה קרה:</strong> {item.result}</p>
                  <p className="text-green-800 text-sm font-medium">לקח: {item.lesson}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Section 16 */}
          <section id="tools" className="mb-14 scroll-mt-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 pb-2 border-b-2 border-blue-500">
              16. כלים ומחשבונים
            </h2>

            <div className="grid md:grid-cols-2 gap-4">
              {[
                { href: '/real-estate/mortgage', label: 'מחשבון משכנתא בסיסי', desc: 'חשב החזר חודשי, ריבית כוללת ולוח סילוקין מלא לכל מסלול.' },
                { href: '/real-estate/mortgage-optimizer', label: 'אופטימייזר תמהיל משכנתא', desc: 'הכלי המתקדם ביותר בישראל – Solver-style לתמהיל האופטימלי לפרופיל שלך.' },
                { href: '/real-estate/purchase-tax', label: 'מחשבון מס רכישה', desc: 'חשב את מס הרכישה לפי סוג רוכש, מחיר ומצב משפחתי.' },
                { href: '/real-estate/capital-gains-tax', label: 'מחשבון מס שבח', desc: 'מכירת דירה? חשב את מס השבח לפי הלינאריות.' },
                { href: '/tools/loan-eligibility', label: 'מחשבון כשירות הלוואה', desc: 'בדוק כמה תוכל לקבל לפי הכנסה, התחייבויות ו-LTV.' },
                { href: '/compare/rent-vs-buy', label: 'השוואה: שכירות vs. קנייה', desc: 'ניתוח מלא – מתי כדאי לקנות ומתי לשכור.' },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block bg-white border border-blue-200 rounded-xl p-4 hover:border-blue-400 hover:shadow-md transition group"
                >
                  <h3 className="font-bold text-blue-700 group-hover:text-blue-900 mb-1">{item.label}</h3>
                  <p className="text-gray-600 text-sm">{item.desc}</p>
                </Link>
              ))}
            </div>

            <h3 className="text-lg font-bold text-gray-800 mt-8 mb-3">פוסטים קשורים</h3>
            <div className="grid md:grid-cols-2 gap-3">
              {[
                { href: '/blog/mortgage-tracks-guide-2026', label: 'מסלולי המשכנתא - המדריך המלא 2026' },
                { href: '/blog/boi-directive-329-mortgage-rules', label: 'הוראת בנק ישראל 329 - הסבר מלא' },
                { href: '/blog/ltv-mortgage-rates-secret', label: 'LTV וריביות - הסוד שהבנקים לא אומרים' },
                { href: '/blog/mortgage-refinance-when-and-how', label: 'מחזור משכנתא - מתי וכיצד' },
                { href: '/blog/purchase-tax-2026-complete-guide', label: 'מדריך מס רכישה 2026' },
                { href: '/blog/capital-gains-tax-property-2026', label: 'מס שבח על נדל"ן 2026' },
                { href: '/blog/real-estate-investment-strategy', label: 'אסטרטגיית השקעה בנדל"ן' },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm py-1 border-b border-gray-100"
                >
                  <span>←</span>
                  {item.label}
                </Link>
              ))}
            </div>
          </section>

          {/* Section 17 - FAQ */}
          <section id="faq" className="mb-14 scroll-mt-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 pb-2 border-b-2 border-blue-500">
              17. שאלות נפוצות (FAQ)
            </h2>

            <div className="space-y-5">
              {[
                {
                  q: 'כמה זמן לוקח לקבל אישור עקרוני למשכנתא?',
                  a: 'בדרך כלל 3–7 ימי עסקים לאחר הגשת כל המסמכים. לבנקים מסוימים (ב-pre-approval מקוון) – גם 24–48 שעות.',
                },
                {
                  q: 'האם אפשר לקבל משכנתא ללא הון עצמי?',
                  a: 'לא. בנק ישראל קובע 25% הון עצמי מינימלי לדירה ראשונה. יש מסלולים כמו מחיר למשתכן שמשנים את התנאים, אך גם שם נדרש הון עצמי.',
                },
                {
                  q: 'האם כדאי לקחת יועץ משכנתא?',
                  a: 'כמעט תמיד כן. עלות יועץ עצמאי: 2,000–5,000 ₪. ההנחה הממוצעת שמצליח להשיג: 0.3%. על משכנתא של 1.5M₪ ל-25 שנה = 120,000 ₪ חיסכון. ROI של 2,400%.',
                },
                {
                  q: 'מה ההבדל בין הצמדה למדד לבין ריבית קבועה?',
                  a: 'ריבית קבועה = ה-% שמשלמים קבוע. הצמדה = הקרן עצמה גדלה לפי מדד המחירים לצרכן. גם קבועה צמודה – יש לה ריבית קבועה, אך הקרן גדלה.',
                },
                {
                  q: 'כמה עולה עמלת פירעון מוקדם?',
                  a: 'תלוי במסלול. על פריים: אין עמלה. על מסלולים קבועים: מחושבת לפי הפרש הריביות × שנים × יתרה. יכולה להגיע לעשרות אלפי שקלים. הבנק חייב לחשב לך.',
                },
                {
                  q: 'האם ניתן לקחת משכנתא כזוג לא נשוי?',
                  a: 'כן. שני הלווים יכולים להיות ידועים בציבור, שותפים עסקיים, או בני משפחה. שניהם יחתמו על כל המסמכים ויהיו אחראים ביחד.',
                },
                {
                  q: 'מה קורה אם לא אוכל לשלם תשלום חודשי?',
                  a: 'יש להגיע לבנק לפני, לא אחרי. הבנקים מציעים גרייס זמני, דחיית תשלומים, או ארגון מחדש של ההלוואה. אחרי 3 חודשים ללא תשלום – הבנק מתחיל הליך גבייה.',
                },
                {
                  q: 'מה ההבדל בין לוח שפיצר ללוח קרן שווה?',
                  a: 'שפיצר: החזר חודשי קבוע לאורך כל התקופה. קרן שווה: קרן קבועה כל חודש, ריבית יורדת עם הזמן – החזר ראשוני גבוה יותר אך ריבית כוללת נמוכה יותר.',
                },
                {
                  q: 'האם אפשר להשתמש בכסף מקרן השתלמות לרכישת דירה?',
                  a: 'כן, אם קרן ההשתלמות פדויה (אחרי 6 שנים). אפשר לפדות ולהשתמש כהון עצמי – אך שים לב לאיבוד הטבת הפטור ממס על רווחים עתידיים אם מפדים מוקדם.',
                },
                {
                  q: 'כמה עמלות יש לשלם בלקיחת משכנתא?',
                  a: 'עמלת פתיחת תיק (500–1,000 ₪), שמאות (1,500–2,500 ₪), ביטוח חיים (200–400 ₪/חודש), ביטוח מבנה (50–150 ₪/חודש), שכר עו"ד (5,000–15,000 ₪). סה"כ ראשוני: 10,000–20,000 ₪.',
                },
                {
                  q: 'מה ההבדל בין אישור עקרוני לאישור סופי?',
                  a: 'אישור עקרוני: הבנק מסכים עקרונית לתת הלוואה בסכום מסוים, ללא קשר לנכס ספציפי. אישור סופי: אחרי שמאות הנכס הספציפי ובדיקת כל המסמכים – הסכום הסופי שהבנק ייתן.',
                },
                {
                  q: 'האם כדאי לקחת ביטוח חיים מהבנק או ממקום אחר?',
                  a: 'בדרך כלל עדיף לרכוש ביטוח חיים עצמאי (לא דרך הבנק). הסיבה: גמישות, תנאים טובים יותר, ואפשרות לבטל/להחליף בלי להיות תלוי בבנק. הבנק חייב לקבל כל ביטוח שתביא.',
                },
                {
                  q: 'מה זה מחיר למשתכן ואיך זה משפיע על המשכנתא?',
                  a: 'מחיר למשתכן הוא תוכנית ממשלתית לרוכשי דירה ראשונה בהנחה. מאפשר LTV גבוה יותר (עד 90%!), אבל יש מגבלות על מי מתאים ועל סוג הנכס.',
                },
                {
                  q: 'מה תהליך המשכנתא כשבונים בית עצמי (בנייה עצמית)?',
                  a: 'שונה מרכישת דירה קיימת. הבנק מעביר כסף בשלבים (tranches) לפי התקדמות הבנייה, לא חד פעמי. נדרש ייעוץ מיוחד ותכנון אחר לגמרי.',
                },
                {
                  q: 'האם אני יכול לפצל משכנתא בין שני בנקים?',
                  a: 'כן, פיצול בנקים אפשרי, אך מסורבל. הבנקים יידרשו ביטחונות מסוימים ואחד מהם יהיה "שני מסירה". בדרך כלל לא שווה את הסיבוך.',
                },
              ].map((item, i) => (
                <details key={i} className="border border-gray-200 rounded-xl overflow-hidden">
                  <summary className="p-4 font-bold text-gray-900 cursor-pointer hover:bg-gray-50 flex items-center gap-2">
                    <span className="text-blue-600">ש:</span> {item.q}
                  </summary>
                  <div className="p-4 pt-0 bg-gray-50 text-gray-700 text-sm leading-relaxed">
                    <span className="text-green-700 font-bold">ת: </span>{item.a}
                  </div>
                </details>
              ))}
            </div>
          </section>

          {/* Bottom CTA */}
          <div className="bg-gradient-to-l from-blue-600 to-blue-800 text-white rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-bold mb-3">מוכן לחשב את המשכנתא שלך?</h2>
            <p className="text-blue-100 mb-6">
              השתמש בכלים המתקדמים שלנו לחישוב מדויק ותמהיל אופטימלי
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link
                href="/real-estate/mortgage"
                className="bg-white text-blue-700 px-6 py-3 rounded-lg font-bold hover:bg-blue-50 transition"
              >
                מחשבון משכנתא ←
              </Link>
              <Link
                href="/real-estate/mortgage-optimizer"
                className="bg-blue-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-400 transition border border-blue-400"
              >
                אופטימייזר תמהיל ←
              </Link>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}
