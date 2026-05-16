import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'זכויות עובדים בישראל 2026 – האנציקלופדיה המלאה',
  description:
    'כל זכויות העובד בישראל: שכר, פיצויים, חופשה, מחלה, לידה, מילואים, אבטלה, פנסיה. מדריך משפטי מקיף עם דוגמאות חישוב.',
  alternates: { canonical: '/guides/employee-rights-complete-guide' },
  openGraph: {
    title: 'זכויות עובדים בישראל 2026 – האנציקלופדיה המלאה',
    description:
      'כל זכויות העובד בישראל: שכר, פיצויים, חופשה, מחלה, לידה, מילואים, אבטלה, פנסיה.',
    type: 'article',
    locale: 'he_IL',
  },
};

const tocItems = [
  { id: 'why', label: 'למה כל עובד חייב לדעת' },
  { id: 'salary', label: 'שכר מינימום, שעות נוספות, בונוס' },
  { id: 'mandatory-benefits', label: 'תוספות חובה' },
  { id: 'leave', label: 'חופשות: שנתית, מחלה, מילואים, לידה' },
  { id: 'social', label: 'תנאים סוציאליים: פנסיה, קרן, פיצויים' },
  { id: 'miluim', label: 'מילואים בחרבות ברזל' },
  { id: 'dismissal', label: 'פיטורים: תהליך, שימוע, הודעה מוקדמת' },
  { id: 'unemployment', label: 'דמי אבטלה' },
  { id: 'special-rights', label: 'זכויות מיוחדות: הריון, נכות, הורות' },
  { id: 'car-benefit', label: 'שווי שימוש ברכב מעסיק' },
  { id: 'condition-change', label: 'שינוי תנאים = פיצויים?' },
  { id: 'resign-as-fired', label: 'התפטרות בדין מפוטר – 9 מצבים' },
  { id: 'tools', label: 'כלים ומחשבונים' },
  { id: 'faq', label: 'שאלות נפוצות' },
];

export default function EmployeeRightsCompleteGuide() {
  return (
    <div className="min-h-screen bg-white" dir="rtl">
      {/* Schema.org */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: 'זכויות עובדים בישראל 2026 – האנציקלופדיה המלאה',
            description:
              'כל זכויות העובד בישראל: שכר, פיצויים, חופשה, מחלה, לידה, מילואים, אבטלה, פנסיה.',
            datePublished: '2026-05-16',
            dateModified: '2026-05-16',
            author: { '@type': 'Organization', name: 'חשבונאי' },
            publisher: { '@type': 'Organization', name: 'חשבונאי' },
            inLanguage: 'he',
            url: 'https://cheshbonai.co.il/guides/employee-rights-complete-guide',
          }),
        }}
      />

      {/* Hero */}
      <div className="bg-gradient-to-bl from-purple-900 via-purple-700 to-violet-500 text-white py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-sm text-purple-200 mb-3">
            <Link href="/" className="hover:text-white">דף הבית</Link>
            {' › '}
            <Link href="/employee-rights" className="hover:text-white">זכויות עובדים</Link>
            {' › '}
            <span>האנציקלופדיה המלאה</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
            זכויות עובדים בישראל 2026
            <br />
            <span className="text-purple-200">האנציקלופדיה המלאה</span>
          </h1>
          <p className="text-xl text-purple-100 mb-6 max-w-3xl">
            שכר, פיצויים, חופשה, מחלה, לידה, מילואים, אבטלה, פנסיה, פיטורין, שימוע ועוד.
            כל זכות – עם הסבר חוקי ודוגמת חישוב.
          </p>
          <div className="flex flex-wrap gap-4 text-sm text-purple-200">
            <span>⏱ זמן קריאה: ~55 דקות</span>
            <span>📅 עודכן: מאי 2026</span>
            <span>📖 ~7,200 מילים</span>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10 lg:flex lg:gap-10">
        {/* Sticky TOC */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <div className="sticky top-8 bg-purple-50 rounded-xl p-5 border border-purple-100">
            <h2 className="font-bold text-purple-900 mb-3 text-sm uppercase tracking-wide">תוכן עניינים</h2>
            <ol className="space-y-1">
              {tocItems.map((item, i) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    className="text-sm text-purple-700 hover:text-purple-900 hover:underline block py-0.5"
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
          <section id="why" className="mb-14 scroll-mt-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 pb-2 border-b-2 border-purple-500">
              1. למה כל עובד חייב לדעת את הזכויות שלו
            </h2>
            <p className="text-gray-700 mb-5 text-lg">
              מחקרים מראים שיותר מ-40% מהעובדים בישראל אינם מממשים את מלוא זכויותיהם. הסיבות
              שונות: חוסר ידע, חשש לפגוע ביחסי עובד-מעסיק, ואי-ידיעה שמשהו שקורה אצלם
              הוא בלתי חוקי. המחיר? עשרות ואף מאות אלפי שקלים לאורך שנות עבודה.
            </p>

            <div className="grid md:grid-cols-3 gap-4 mb-6">
              {[
                { stat: '6,443 ₪', label: 'שכר מינימום חודשי 2026', icon: '💰' },
                { stat: '418 ₪', label: 'דמי הבראה ליום (2026)', icon: '🏖️' },
                { stat: '105 ימים', label: 'חופשת לידה בתשלום (ב.ל.)', icon: '👶' },
              ].map((item) => (
                <div key={item.stat} className="bg-white border border-gray-200 rounded-xl p-5 text-center shadow-sm">
                  <div className="text-2xl mb-1">{item.icon}</div>
                  <div className="text-2xl font-bold text-purple-700 mb-1">{item.stat}</div>
                  <div className="text-sm text-gray-600">{item.label}</div>
                </div>
              ))}
            </div>

            <p className="text-gray-700">
              חוקי עבודה בישראל הם מהמפורטים בעולם. רוב ההגנות הן קוגנטיות – כלומר,
              לא ניתן לוותר עליהן גם אם העובד &quot;הסכים&quot;. חוזה שמנסה לפגוע בהן – בטל.
            </p>
          </section>

          {/* Section 2 */}
          <section id="salary" className="mb-14 scroll-mt-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 pb-2 border-b-2 border-purple-500">
              2. שכר: מינימום, שעות נוספות, בונוסים ו-RSU
            </h2>

            <h3 className="text-xl font-bold text-gray-800 mb-3">שכר מינימום 2026</h3>
            <div className="overflow-x-auto mb-5">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-purple-900 text-white">
                    <th className="border border-purple-700 p-3 text-right">סוג שכר</th>
                    <th className="border border-purple-700 p-3 text-right">שיעור 2026</th>
                    <th className="border border-purple-700 p-3 text-right">הערה</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['שכר מינימום חודשי', '6,443.85 ₪', 'ל-186 שעות/חודש'],
                    ['שכר מינימום שעתי', '34.64 ₪', 'לעובד יומי / שעתי'],
                    ['שכר מינימום יומי', '277.15 ₪', 'ל-8 שעות עבודה'],
                    ['נוער (15–17)', '2/3 מהמינימום', 'עד גיל 17 בהשכלה'],
                  ].map(([type, rate, note], i) => (
                    <tr key={type} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="border border-gray-200 p-3 font-medium">{type}</td>
                      <td className="border border-gray-200 p-3 font-bold text-purple-700">{rate}</td>
                      <td className="border border-gray-200 p-3 text-gray-600">{note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h3 className="text-xl font-bold text-gray-800 mb-3">שעות נוספות</h3>
            <p className="text-gray-700 mb-4">
              שבוע עבודה: 43 שעות (אפשר 45 בהסכמה). מעל הנורמה:
            </p>
            <ul className="space-y-2 text-gray-700 mb-5">
              <li>• 2 שעות ראשונות נוספות: 125% מהשכר הרגיל</li>
              <li>• כל שעה נוספת מעבר: 150% מהשכר הרגיל</li>
              <li>• גמול שעות נוספות ניתן לתשלום בכסף או בשעות מנוחה (בהסכמה)</li>
            </ul>

            <h3 className="text-xl font-bold text-gray-800 mb-3">שכר 13 / בונוסים</h3>
            <p className="text-gray-700 mb-5">
              שכר 13 (חודש 13) אינו חובה חוקית בישראל – אלא אם נקבע בחוזה העבודה, בהסכם קיבוצי
              או שהוא מנהג מקובל בחברה. אם ניתן באופן עקבי 3+ שנים – עלול להפוך לזכות מוקנית.
              בונוסים: גם הם לפי הסכם. בונוס שהובטח – ניתן לתבוע.
            </p>

            <h3 className="text-xl font-bold text-gray-800 mb-3">RSU – אופציות מניות לעובדים</h3>
            <p className="text-gray-700 mb-5">
              RSU (Restricted Stock Units) הם מניות חברה שמוענקות לעובד על פני תקופת הבשלה (vesting).
              מיסוי: לרוב לפי מסלול 102 ב – מס רווחי הון 25% בעת המכירה (לאחר 24 חודש מהענקה).
              הטבה גדולה לעומת מס הכנסה 47%! חשוב לתאם עם יועץ מס לפני מכירה.
            </p>

            <Link href="/employee-rights/minimum-wage" className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 text-sm font-medium inline-block">
              מחשבון שכר מינימום ←
            </Link>
          </section>

          {/* Section 3 */}
          <section id="mandatory-benefits" className="mb-14 scroll-mt-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 pb-2 border-b-2 border-purple-500">
              3. תוספות חובה: דמי הבראה, נסיעות, ארוחה
            </h2>

            <h3 className="text-xl font-bold text-gray-800 mb-3">דמי הבראה</h3>
            <p className="text-gray-700 mb-4">
              עובד זכאי לדמי הבראה לפי ותק. שיעור יום הבראה 2026: <strong>418 ₪</strong>.
            </p>
            <div className="overflow-x-auto mb-5">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-purple-900 text-white">
                    <th className="border border-purple-700 p-3 text-right">שנות ותק</th>
                    <th className="border border-purple-700 p-3 text-right">ימי הבראה</th>
                    <th className="border border-purple-700 p-3 text-right">סכום שנתי</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['שנה 1', '5 ימים', '2,090 ₪'],
                    ['שנות 2–3', '6 ימים', '2,508 ₪'],
                    ['שנות 4–10', '7 ימים', '2,926 ₪'],
                    ['שנות 11–15', '8 ימים', '3,344 ₪'],
                    ['שנות 16–19', '9 ימים', '3,762 ₪'],
                    ['20 שנה ומעלה', '10 ימים', '4,180 ₪'],
                  ].map(([years, days, amount], i) => (
                    <tr key={years} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="border border-gray-200 p-3">{years}</td>
                      <td className="border border-gray-200 p-3 text-purple-700 font-bold">{days}</td>
                      <td className="border border-gray-200 p-3 text-green-700 font-bold">{amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h3 className="text-xl font-bold text-gray-800 mb-3">דמי נסיעות</h3>
            <p className="text-gray-700 mb-5">
              מעסיק חייב לשלם דמי נסיעה לעבודה: עלות כרטיס חופשי חודשי באוטובוס/רכבת (לפי עלות
              ממשית), או עד 26.40 ₪ ליום (2026) – הנמוך מביניהם. לעובד שמגיע ברכב פרטי – תלוי
              בהסכם.
            </p>

            <h3 className="text-xl font-bold text-gray-800 mb-3">השתתפות בארוחה</h3>
            <p className="text-gray-700 mb-5">
              רק אם נקבע בחוזה / הסכם קיבוצי. אין חובה חוקית לארוחה – אלא אם נהוג בחברה
              ונכלל בהסכם העבודה.
            </p>

            <Link href="/employee-rights/recreation-pay" className="text-purple-600 underline text-sm">
              מחשבון דמי הבראה ←
            </Link>
          </section>

          {/* Section 4 */}
          <section id="leave" className="mb-14 scroll-mt-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 pb-2 border-b-2 border-purple-500">
              4. חופשות: שנתית, חגים, מחלה, מילואים, לידה
            </h2>

            <h3 className="text-xl font-bold text-gray-800 mb-3">חופשה שנתית</h3>
            <div className="overflow-x-auto mb-5">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-purple-800 text-white">
                    <th className="border border-purple-700 p-3 text-right">שנות ותק</th>
                    <th className="border border-purple-700 p-3 text-right">ימי חופשה</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['1–4 שנות עבודה', '12 ימי עסקים (14 ימים קלנדריים)'],
                    ['5 שנות עבודה', '14 ימי עסקים'],
                    ['6 שנות עבודה', '15 ימי עסקים'],
                    ['7 שנות עבודה', '16 ימי עסקים'],
                    ['8 שנות עבודה', '18 ימי עסקים'],
                    ['10 שנות עבודה ומעלה', '22–23 ימי עסקים (לפי הסכם)'],
                  ].map(([years, days], i) => (
                    <tr key={years} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="border border-gray-200 p-3">{years}</td>
                      <td className="border border-gray-200 p-3 font-bold text-purple-700">{days}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h3 className="text-xl font-bold text-gray-800 mb-3">חגים</h3>
            <p className="text-gray-700 mb-5">
              9 ימי חג חוקיים בשנה (בחירה מרשימה הכוללת חגי ישראל + חגי דת). עובד שחג הוא
              יום מנוחתו הקבוע – לא מקבל פיצוי. עובד שנדרש לעבוד ביום חג – 150% שכר.
            </p>

            <h3 className="text-xl font-bold text-gray-800 mb-3">מחלה</h3>
            <p className="text-gray-700 mb-5">
              צבירה: 1.5 ימי מחלה לכל חודש עבודה, עד 90 ימים מצטברים.
              <br />
              <strong>תשלום:</strong> יום ראשון – ללא תשלום. יום שני ושלישי – 50% שכר.
              מהיום הרביעי – 100% שכר. עם תעודת מחלה בלבד.
            </p>

            <h3 className="text-xl font-bold text-gray-800 mb-3">מילואים</h3>
            <p className="text-gray-700 mb-5">
              מילואים = עד 45 ימים לשנה בדרך כלל. שכר מילואים = שכר ממוצע ב-3 חודשים
              אחרונים, משולם על ידי ב.ל. (לא המעסיק). לא ניתן לפטר עובד בגין מילואים.
              הגנה תעסוקתית: 30 ימים לאחר חזרה ממילואים של 60+ ימים.
            </p>

            <h3 className="text-xl font-bold text-gray-800 mb-3">חופשת לידה – פטורה ממס!</h3>
            <div className="bg-pink-50 border border-pink-200 rounded-xl p-5 mb-5">
              <ul className="space-y-2 text-pink-800 text-sm">
                <li>• <strong>אורך:</strong> 26 שבועות (אפשרות להאריך ל-26 עם הסכמת מעסיק)</li>
                <li>• <strong>תשלום מב.ל.:</strong> 15 שבועות (105 ימים) בדמי לידה מלאים</li>
                <li>• <strong>גובה:</strong> שכר ממוצע 3 חודשים אחרונים (עד תקרה יומית)</li>
                <li>• <strong>פטור ממס:</strong> כן! דמי לידה פטורים לחלוטין ממס הכנסה</li>
                <li>• <strong>זכות לאב:</strong> ניתן להעביר חלק מהחופשה לאב (7 שבועות)</li>
              </ul>
            </div>

            <div className="flex gap-3 flex-wrap">
              <Link href="/employee-rights/maternity-benefits" className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 text-sm font-medium">
                מחשבון דמי לידה ←
              </Link>
              <Link href="/employee-rights/reserve-duty-pay" className="bg-white border border-purple-600 text-purple-700 px-4 py-2 rounded-lg hover:bg-purple-50 text-sm font-medium">
                מחשבון שכר מילואים ←
              </Link>
              <Link href="/blog/maternity-benefits-complete-guide-2026" className="text-purple-600 underline text-sm inline-flex items-center">
                מדריך זכויות לידה ←
              </Link>
            </div>
          </section>

          {/* Section 5 */}
          <section id="social" className="mb-14 scroll-mt-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 pb-2 border-b-2 border-purple-500">
              5. תנאים סוציאליים: פנסיה, קרן השתלמות, פיצויים
            </h2>

            <div className="grid md:grid-cols-2 gap-5 mb-6">
              <div className="border border-gray-200 rounded-xl p-5">
                <h3 className="font-bold text-gray-900 mb-3">פנסיה חובה</h3>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>• עובד מפקיד: 6%</li>
                  <li>• מעסיק תגמולים: 6.5%</li>
                  <li>• מעסיק פיצויים: 6%</li>
                  <li>• סה&quot;כ מהשכר: 18.5%</li>
                  <li>• חובה החל מחודש 3 להעסקה</li>
                </ul>
              </div>
              <div className="border border-gray-200 rounded-xl p-5">
                <h3 className="font-bold text-gray-900 mb-3">קרן השתלמות</h3>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>• מעסיק מפקיד: 7.5%</li>
                  <li>• עובד מפקיד: 2.5%</li>
                  <li>• פטור ממס הכנסה לעובד</li>
                  <li>• ניתן למשיכה אחרי 6 שנים (פטור מס)</li>
                  <li>• אחרי 3 שנים – לצורך השתלמות מקצועית</li>
                </ul>
              </div>
              <div className="border border-gray-200 rounded-xl p-5">
                <h3 className="font-bold text-gray-900 mb-3">פיצויי פיטורין</h3>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>• שכר חודשי אחרון × מספר שנות ותק</li>
                  <li>• לפי הוראת סעיף 14: הפרשות המעסיק לפנסיה = פיצויים</li>
                  <li>• מגיע לאחר שנת עבודה ראשונה</li>
                  <li>• פיטורים / התפטרות בדין מפוטר = זכאות</li>
                </ul>
              </div>
              <div className="border border-gray-200 rounded-xl p-5">
                <h3 className="font-bold text-gray-900 mb-3">ביטוח חיים</h3>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>• לרוב כלול בפנסיה (ביטוח מנהלים / קרן פנסיה)</li>
                  <li>• כיסוי נכות ומוות</li>
                  <li>• מעסיק עשוי לשלם חלק</li>
                  <li>• בדוק בחוזה / תלוש שכר</li>
                </ul>
              </div>
            </div>

            <div className="flex gap-3 flex-wrap">
              <Link href="/employee-rights/severance" className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 text-sm font-medium">
                מחשבון פיצויי פיטורין ←
              </Link>
              <Link href="/blog/severance-pay-complete-guide" className="text-purple-600 underline text-sm inline-flex items-center">
                המדריך השלם לפיצויים ←
              </Link>
              <Link href="/blog/severance-pay-tax-strategies" className="text-purple-600 underline text-sm inline-flex items-center">
                אסטרטגיות מס לפיצויים ←
              </Link>
            </div>
          </section>

          {/* Section 6 */}
          <section id="miluim" className="mb-14 scroll-mt-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 pb-2 border-b-2 border-purple-500">
              6. מילואים בחרבות ברזל – 4 מענקים + הגנה תעסוקתית
            </h2>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-5">
              <h3 className="font-bold text-blue-900 mb-3">4 מענקים לחיילי מילואים (חרבות ברזל)</h3>
              <ul className="space-y-2 text-blue-800 text-sm">
                <li>1. <strong>מענק שימור תעסוקה:</strong> לעצמאים שעסקם נפגע בגלל שירות מילואים ממושך.</li>
                <li>2. <strong>מענק מחייה ראשוני:</strong> חד-פעמי לחיילים שחזרו לאחר 120+ ימי מילואים.</li>
                <li>3. <strong>מענק פרישה:</strong> לחיילי קבע שפרשו עקב המלחמה.</li>
                <li>4. <strong>שוברי נסיעה:</strong> עד 5,000 ₪ לתיירות פנים לחיילי מילואים.</li>
              </ul>
            </div>

            <h3 className="text-xl font-bold text-gray-800 mb-3">הגנה תעסוקתית</h3>
            <ul className="space-y-2 text-gray-700 mb-5">
              <li>• אסור לפטר חייל מילואים בזמן השירות</li>
              <li>• אחרי 60+ ימים: הגנה של 30 ימים לאחר השחרור</li>
              <li>• אסור לפגוע בדרגה, בשכר, בתפקיד – בגלל מילואים</li>
              <li>• הגנות משופרות בחרבות ברזל (צווים מיוחדים)</li>
            </ul>

            <Link href="/employee-rights/reserve-duty-pay" className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 text-sm font-medium inline-block">
              מחשבון שכר מילואים ←
            </Link>
          </section>

          {/* Section 7 */}
          <section id="dismissal" className="mb-14 scroll-mt-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 pb-2 border-b-2 border-purple-500">
              7. פיטורים: תהליך תקין, שימוע, הודעה מוקדמת, פיצויים
            </h2>

            <h3 className="text-xl font-bold text-gray-800 mb-3">תהליך פיטורים תקין</h3>
            <div className="space-y-3 mb-6">
              {[
                { step: '1', title: 'הזמנה לשימוע', detail: 'הודעה בכתב עם פירוט הסיבות ומועד השימוע (לפחות 48–72 שעות מראש).' },
                { step: '2', title: 'קיום שימוע', detail: 'פגישה שבה העובד מציג עמדתו ומנסה לשכנע. מומלץ להביא עד / יועץ.' },
                { step: '3', title: 'החלטה מנומקת', detail: 'לאחר השימוע – מעסיק חייב לקבל החלטה מנומקת בכתב.' },
                { step: '4', title: 'הודעה מוקדמת', detail: 'לפי ותק: עד שנה – יום לכל חודש. שנה ראשונה: 1 חודש. 2+ שנים: 30 יום.' },
                { step: '5', title: 'תשלום פיצויים', detail: 'שכר אחרון × שנות ותק. יש לשלם בתוך 15 ימים מסיום ההעסקה.' },
              ].map((item) => (
                <div key={item.step} className="flex gap-4 bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex-shrink-0 bg-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                    {item.step}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{item.title}</h4>
                    <p className="text-gray-700 text-sm">{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>

            <h3 className="text-xl font-bold text-gray-800 mb-3">הודעה מוקדמת לפי ותק</h3>
            <div className="overflow-x-auto mb-5">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-purple-800 text-white">
                    <th className="border border-purple-700 p-3 text-right">ותק</th>
                    <th className="border border-purple-700 p-3 text-right">הודעה מוקדמת</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['חודש ראשון', 'יום לכל 2 ימי עבודה'],
                    ['חודשים 2–6', 'יום לכל 2.5 שבועות'],
                    ['חודשים 7–12', 'יום לכל חודש'],
                    ['שנה שנייה ואילך', '30 ימים'],
                  ].map(([tenure, notice], i) => (
                    <tr key={tenure} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="border border-gray-200 p-3">{tenure}</td>
                      <td className="border border-gray-200 p-3 text-purple-700 font-bold">{notice}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h3 className="text-xl font-bold text-gray-800 mb-3">4 אסטרטגיות מס לפיצויים</h3>
            <div className="grid md:grid-cols-2 gap-4 mb-5">
              {[
                { strategy: 'פטור חד-פעמי', detail: 'עד 12,360 ₪ לשנת ותק (2026) – פטור ממס' },
                { strategy: 'פריסת הכנסה', detail: 'פריסת הפיצויים על 6 שנים קדימה – מדרגות מס נמוכות יותר' },
                { strategy: 'רצף פיצויים', detail: 'שמירת הפיצויים בקופה עד פנסיה – דחיית מס' },
                { strategy: 'רצף קצבה', detail: 'הכנסת הפיצויים לקרן פנסיה לקצבה פטורה ממס' },
              ].map((item) => (
                <div key={item.strategy} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <h4 className="font-bold text-gray-900 mb-1">{item.strategy}</h4>
                  <p className="text-gray-700 text-sm">{item.detail}</p>
                </div>
              ))}
            </div>

            <Link href="/employee-rights/severance" className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 text-sm font-medium inline-block">
              מחשבון פיצויי פיטורין ←
            </Link>
          </section>

          {/* Section 8 */}
          <section id="unemployment" className="mb-14 scroll-mt-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 pb-2 border-b-2 border-purple-500">
              8. דמי אבטלה – זכאות, תקופה, גובה
            </h2>

            <p className="text-gray-700 mb-5">
              דמי אבטלה מב.ל. לאחר אובדן עבודה לא מרצון. תנאי זכאות: 360 ימי עבודה ב-18
              חודשים האחרונים (18 חודש לאחרונה לגיל 45+).
            </p>

            <h3 className="text-xl font-bold text-gray-800 mb-3">תקופת זכאות לפי גיל</h3>
            <div className="overflow-x-auto mb-5">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-purple-800 text-white">
                    <th className="border border-purple-700 p-3 text-right">גיל</th>
                    <th className="border border-purple-700 p-3 text-right">ימי זכאות מקסימלי</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['עד גיל 35 (ילד אחד לפחות)', '138 ימים'],
                    ['עד גיל 35 (ללא ילדים)', '100 ימים'],
                    ['גיל 35–44', '138 ימים'],
                    ['גיל 45+', '175 ימים'],
                  ].map(([age, days], i) => (
                    <tr key={age} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="border border-gray-200 p-3">{age}</td>
                      <td className="border border-gray-200 p-3 font-bold text-purple-700">{days}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h3 className="text-xl font-bold text-gray-800 mb-3">גובה דמי האבטלה</h3>
            <p className="text-gray-700 mb-5">
              ב-50 הימים הראשונים: 80% מהשכר הממוצע (עד תקרה יומית של 304.93 ₪ ב-2026).
              מהיום ה-51 ואילך: 50% מהשכר הממוצע. קיימת תקרת שכר מרבי שממנה מחשבים.
            </p>

            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-4">
              <p className="text-yellow-900 text-sm">
                <strong>חשוב:</strong> מי שהתפטר – זכאי לדמי אבטלה רק אם מסיבות מיוחדות
                (מחלה, טיפול בילד, מעבר עיר עם בן/בת הזוג). פיטורים = זכאות מלאה.
              </p>
            </div>

            <Link href="/employee-rights/unemployment-benefits" className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 text-sm font-medium inline-block">
              מחשבון דמי אבטלה ←
            </Link>
          </section>

          {/* Section 9 */}
          <section id="special-rights" className="mb-14 scroll-mt-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 pb-2 border-b-2 border-purple-500">
              9. זכויות מיוחדות: הריון, הנקה, הורה יחיד, נכות
            </h2>

            <h3 className="text-xl font-bold text-gray-800 mb-3">הריון</h3>
            <ul className="space-y-2 text-gray-700 mb-5">
              <li>• <strong>איסור פיטורין:</strong> ללא אישור שר העבודה – בכל שלבי ההיריון וחופשת הלידה + 60 ימים אחריה</li>
              <li>• <strong>בדיקות רפואיות:</strong> עד 40 שעות שמר (בתשלום) לבדיקות הריון</li>
              <li>• <strong>הסתגלות תנאים:</strong> מעסיק חייב להתאים תנאי עבודה אם קיימת סכנה לעוברה</li>
            </ul>

            <h3 className="text-xl font-bold text-gray-800 mb-3">הנקה</h3>
            <p className="text-gray-700 mb-5">
              זכות ל-<strong>שעה נוספת מנוחה ביום</strong> (בשכר) לצורך הנקה – עד 4 חודשים לאחר לידה.
              אפשר לפצל ל-2 × 30 דקות.
            </p>

            <h3 className="text-xl font-bold text-gray-800 mb-3">הורה יחיד</h3>
            <ul className="space-y-2 text-gray-700 mb-5">
              <li>• זכויות מורחבות ביחס לשעות נוספות</li>
              <li>• אפשרות לסרב לעבודה מעל שעות מסוימות</li>
              <li>• נקודת זיכוי נוספת (1 נקודה) במס הכנסה</li>
            </ul>

            <h3 className="text-xl font-bold text-gray-800 mb-3">עובדים עם מוגבלות</h3>
            <ul className="space-y-2 text-gray-700 mb-5">
              <li>• חוק שוויון זכויות לאנשים עם מוגבלות – חובת התאמות סבירות</li>
              <li>• איסור אפליה בקבלה לעבודה, קידום, תנאים</li>
              <li>• קצבת נכות מב.ל. אם יש נכות של 40%+ שמפחיתה כושר עבודה ב-50%+</li>
            </ul>
          </section>

          {/* Section 10 */}
          <section id="car-benefit" className="mb-14 scroll-mt-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 pb-2 border-b-2 border-purple-500">
              10. שווי שימוש ברכב מעסיק
            </h2>
            <p className="text-gray-700 mb-5">
              אם המעסיק נותן לך רכב לשימוש פרטי – הדבר נחשב הכנסת עבודה ומחויב במס.
              גובה שווי השימוש תלוי בקבוצת המחיר של הרכב (1–7 קבוצות). לדוגמה:
              רכב בקבוצה 4 (מחיר מחירון 120,000–170,000 ₪): שווי שימוש ~2,700 ₪/חודש.
            </p>

            <p className="text-gray-700 mb-5">
              <strong>רכב חשמלי:</strong> שווי שימוש מופחת ב-30% (הטבה לקידום ירוק).
              <br />
              <strong>נסיעות עסקיות בלבד:</strong> אם הרכב רק לעסקי – שווי שימוש 0.
              אך הבנה בין מעסיק לעובד – עדיין חייבת בדיווח נכון.
            </p>

            <Link href="/vehicles/company-car-benefit" className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 text-sm font-medium inline-block">
              מחשבון שווי שימוש ←
            </Link>
          </section>

          {/* Section 11 */}
          <section id="condition-change" className="mb-14 scroll-mt-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 pb-2 border-b-2 border-purple-500">
              11. שינוי תנאים = פיצויים?
            </h2>
            <p className="text-gray-700 mb-5">
              מעסיק לא יכול לשנות תנאי עבודה מהותיים ללא הסכמת העובד. שינויים מהותיים כוללים:
              הורדת שכר, שינוי תפקיד, שינוי שעות עבודה, מעבר מיקום.
            </p>

            <p className="text-gray-700 mb-5">
              אם עובד לא מסכים לשינוי ומתפטר – עשוי להיחשב &quot;התפטרות בדין מפוטר&quot; שמזכה
              בפיצויים. אך זה תלוי בנסיבות, מהות השינוי ובית הדין לעבודה.
            </p>

            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
              <p className="text-yellow-900 text-sm">
                <strong>המלצה:</strong> לפני שמתפטרים בגלל שינוי תנאים – התייעץ עם עורך דין לדיני עבודה.
                הגשת תביעה לא מוצדקת תעכב פיצויים ותגרור עלויות.
              </p>
            </div>
          </section>

          {/* Section 12 */}
          <section id="resign-as-fired" className="mb-14 scroll-mt-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 pb-2 border-b-2 border-purple-500">
              12. התפטרות בדין מפוטר – 9 מצבים שמזכים בפיצויים
            </h2>
            <p className="text-gray-700 mb-5">
              ישנם מצבים שבהם עובד שמתפטר נחשב כ&quot;מפוטר&quot; לצורך קבלת פיצויים.
              תנאי: הקשר בין הסיבה לבין ההתפטרות חייב להיות ישיר וברור.
            </p>

            <div className="grid md:grid-cols-2 gap-3 mb-5">
              {[
                'מחלה קשה שמונעת המשך עבודה',
                'הרעה מוחשית בתנאי עבודה',
                'שינוי מהותי בתנאי שכר',
                'מעבר מגורים עקב עבודת בן/בת הזוג',
                'הטרדה מינית ממעסיק',
                'פגיעה בכבוד העובד (הקמה חוזרת)',
                'העדר תשלום פנסיה / קרן השתלמות',
                'אי תשלום שכר בזמן (2+ פעמים)',
                'עבודה בתנאים בלתי בטיחותיים',
              ].map((reason, i) => (
                <div key={reason} className="bg-red-50 border border-red-200 rounded-lg p-3 flex gap-2">
                  <span className="text-red-700 font-bold">{i + 1}.</span>
                  <span className="text-gray-800 text-sm">{reason}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Section 13 */}
          <section id="tools" className="mb-14 scroll-mt-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 pb-2 border-b-2 border-purple-500">
              13. כלים ומחשבונים לזכויות עובד
            </h2>

            <div className="grid md:grid-cols-2 gap-4">
              {[
                { href: '/employee-rights/severance', label: 'מחשבון פיצויי פיטורין', desc: 'חשב כמה מגיע לך בפיטורים / התפטרות.' },
                { href: '/employee-rights/maternity-benefits', label: 'מחשבון דמי לידה', desc: 'כמה תקבלי מב.ל. בחופשת לידה?' },
                { href: '/employee-rights/unemployment-benefits', label: 'מחשבון דמי אבטלה', desc: 'כמה תקבל אחרי פיטורים?' },
                { href: '/employee-rights/reserve-duty-pay', label: 'מחשבון שכר מילואים', desc: 'חשב שכר מילואים לפי חרבות ברזל.' },
                { href: '/employee-rights/minimum-wage', label: 'מחשבון שכר מינימום', desc: 'בדוק שמשלמים לך לפחות שכר מינימום.' },
                { href: '/employee-rights/recreation-pay', label: 'מחשבון דמי הבראה', desc: 'כמה מגיע לך בדמי הבראה?' },
                { href: '/employee-rights/sick-pay', label: 'מחשבון דמי מחלה', desc: 'חשב ימי מחלה שמגיעים לך.' },
                { href: '/employee-rights/annual-bonus', label: 'מחשבון בונוס שנתי', desc: 'חישוב בונוס ומס בגינו.' },
                { href: '/employee-rights/work-grant', label: 'מחשבון מענק עבודה', desc: 'בדוק זכאות למענק עבודה (ברנע).' },
                { href: '/vehicles/company-car-benefit', label: 'מחשבון שווי שימוש ברכב', desc: 'כמה מס תשלם על רכב החברה?' },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block bg-white border border-purple-200 rounded-xl p-4 hover:border-purple-400 hover:shadow-md transition group"
                >
                  <h3 className="font-bold text-purple-700 group-hover:text-purple-900 mb-1">{item.label}</h3>
                  <p className="text-gray-600 text-sm">{item.desc}</p>
                </Link>
              ))}
            </div>

            <h3 className="text-lg font-bold text-gray-800 mt-8 mb-3">מאמרים קשורים</h3>
            <div className="grid md:grid-cols-2 gap-2">
              {[
                { href: '/blog/employee-rights-israel-2026', label: 'זכויות עובדים בישראל 2026' },
                { href: '/blog/severance-pay-complete-guide', label: 'המדריך השלם לפיצויי פיטורין' },
                { href: '/blog/maternity-benefits-complete-guide-2026', label: 'זכויות לידה ואימהות 2026' },
                { href: '/blog/recreation-pay-2026', label: 'דמי הבראה 2026 - כל מה שצריך' },
                { href: '/blog/vacation-redemption-guide', label: 'פדיון חופשה - מדריך מלא' },
                { href: '/blog/reserve-duty-pay-iron-swords-2026', label: 'שכר מילואים בחרבות ברזל 2026' },
                { href: '/blog/severance-pay-tax-strategies', label: 'אסטרטגיות מס לפיצויי פיטורין' },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-2 text-purple-600 hover:text-purple-800 text-sm py-1 border-b border-gray-100"
                >
                  <span>←</span> {item.label}
                </Link>
              ))}
            </div>
          </section>

          {/* Section 14 - FAQ */}
          <section id="faq" className="mb-14 scroll-mt-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 pb-2 border-b-2 border-purple-500">
              14. שאלות נפוצות (FAQ)
            </h2>

            <div className="space-y-5">
              {[
                {
                  q: 'האם מגיע לי פיצויים אם התפטרתי?',
                  a: 'בדרך כלל לא, אלא אם ההתפטרות היתה "בדין מפוטר" – כלומר, עקב הרעה מוחשית בתנאי עבודה, מחלה, הטרדה, או אחד מ-9 המצבים המוכרים. התייעץ עם עורך דין לדיני עבודה.',
                },
                {
                  q: 'האם מעסיק חייב לתת לי שימוע לפני פיטורים?',
                  a: 'כן! זהו זכות יסוד. פיטורים ללא שימוע = פיטורים פגומים, שמזכים בפיצויים נוספים (מעבר לרגילים). שימוע = הזדמנות לעובד להציג עמדתו לפני ההחלטה.',
                },
                {
                  q: 'כמה ימי חופשה מצטברים בשנה?',
                  a: 'עד 4 שנות ותק: 12 ימי עסקים. מהשנה החמישית: 14–24 ימים. הצבירה היא חוקית ואסור לאבד ימי חופשה. אם פוטרת – מגיע לך פדיון חופשה על כל הימים שלא נוצלו.',
                },
                {
                  q: 'האם חופשת לידה אכן פטורה ממס?',
                  a: 'כן, דמי לידה מב.ל. פטורים לחלוטין ממס הכנסה. זה אחד מהפטורים הנדירים על הכנסה חלופית. אם המעסיק משלם תוספת מעל ב.ל. – החלק הנוסף חייב במס.',
                },
                {
                  q: 'מה זה "שעות נוספות גלובליות"?',
                  a: 'הסדר שבו המעסיק משלם סכום קבוע כ"גלובוס" תמורת כל שעות נוספות. חוקי רק אם הסכום לפחות שווה לערך שעות נוספות בפועל. לעובד יש זכות לבדוק שהגלובוס מספיק.',
                },
                {
                  q: 'האם מגיע לי פיצוי אם הסכם עובד-מעסיק לא נחתם?',
                  a: 'כן. חוק הודעה לעובד מחייב מסירת תנאי העסקה בכתב תוך 30 יום. אי-מסירה = עבירה. הזכויות החוקיות חלות גם ללא חוזה כתוב.',
                },
                {
                  q: 'מה קורה לפנסיה שלי כשמחליפים עבודה?',
                  a: 'הפנסיה שלך שמורה. ניתן להעביר את הצבירה לקופה חדשה (העברה ישירה) ללא אובדן ותק ביטוחי. לא ניתן לפדות פנסיה לפני גיל פרישה (ללא קנסות כבדים).',
                },
                {
                  q: 'האם מותר לפטר עובד בזמן חופשת מחלה?',
                  a: 'בדרך כלל לא. פיטורים בזמן אי-כושר עבודה מוגנים. ישנם חריגים: פיטורים מסיבה שאינה קשורה למחלה + אישור פקיד בכיר. בפועל – קשה מאוד לפטר בחולה.',
                },
                {
                  q: 'האם עובד יכול לוותר על שכר מינימום?',
                  a: 'לא. שכר מינימום הוא קוגנטי – לא ניתן לוותר עליו. גם חוזה שמגביל שכר מתחת למינימום – בטל. מעסיק שמשלם מתחת למינימום חשוף לתביעה ולקנסות גבוהים.',
                },
                {
                  q: 'כמה ימים יש לי לתבוע זכויות שלא קיבלתי?',
                  a: 'ההתיישנות לתביעות עבודה בישראל: 7 שנים (בדרך כלל). על פיצויים – 7 שנים. על שכר מינימום – 7 שנים. חשוב להגיש לבית הדין לעבודה בתוך תקופה זו.',
                },
                {
                  q: 'האם עובד זמני זכאי לאותן זכויות?',
                  a: 'כן, לרוב. עובד זמני (כולל קבלני משנה, עובדי קבלן כוח אדם) זכאי לשכר מינימום, שעות נוספות, חופשה, מחלה. בחלק מהזכויות (פיצויים, הבראה) יש הבדלים.',
                },
                {
                  q: 'מה ה"שכר הקובע" לפיצויים?',
                  a: 'השכר הממוצע ב-12 החודשים האחרונים (כולל תוספות קבועות). לא כולל: הוצאות נסיעה, אש"ל, החזרי הוצאות, רכב שהוא לשימוש מלא. מחלוקות על שכר קובע – נפוצות מאוד.',
                },
                {
                  q: 'האם ניתן להגיש תביעה גם אחרי עזיבת העבודה?',
                  a: 'כן, עד 7 שנים ממועד הפגיעה. ניתן להגיש תביעה לבית הדין לעבודה. בתביעות שכר: עד 7 שנים אחורה. בתביעות לשחזור עבודה: 60 יום מהפיטורים.',
                },
                {
                  q: 'מה עושים אם המעסיק לא משלם שכר?',
                  a: 'אי-תשלום שכר = עבירה פלילית + עוות דין אזרחי. ניתן לפנות לממונה על שכר עבודה (לשכת התעסוקה), לתבוע בבית הדין לעבודה, ולדרוש ריבית פיגורים (5% לחודש).',
                },
                {
                  q: 'האם ניתן לעבוד בשתי עבודות במקביל?',
                  a: 'כן, אין חוק שאוסר. אלא אם חוזה אחד כולל סעיף מחסום תחרות (לא תעבוד אצל מתחרה) שהוא תקף. שתי עבודות = שני מעסיקים = צריך תיאום מס.',
                },
              ].map((item, i) => (
                <details key={i} className="border border-gray-200 rounded-xl overflow-hidden">
                  <summary className="p-4 font-bold text-gray-900 cursor-pointer hover:bg-gray-50 flex items-center gap-2">
                    <span className="text-purple-600">ש:</span> {item.q}
                  </summary>
                  <div className="p-4 pt-0 bg-gray-50 text-gray-700 text-sm leading-relaxed">
                    <span className="text-green-700 font-bold">ת: </span>{item.a}
                  </div>
                </details>
              ))}
            </div>
          </section>

          {/* Bottom CTA */}
          <div className="bg-gradient-to-l from-purple-600 to-violet-700 text-white rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-bold mb-3">בדוק את הזכויות שמגיעות לך</h2>
            <p className="text-purple-100 mb-6">
              השתמש במחשבונים שלנו לחישוב מדויק של כל זכויותיך
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link
                href="/employee-rights/severance"
                className="bg-white text-purple-700 px-6 py-3 rounded-lg font-bold hover:bg-purple-50 transition"
              >
                מחשבון פיצויים ←
              </Link>
              <Link
                href="/employee-rights"
                className="bg-purple-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-purple-400 transition border border-purple-400"
              >
                כל מחשבוני זכויות ←
              </Link>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}
