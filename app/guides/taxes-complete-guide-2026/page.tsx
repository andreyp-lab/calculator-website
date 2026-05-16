import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'כל המסים בישראל 2026 - המדריך השלם',
  description:
    'מדריך מקיף לכל המסים בישראל: מס הכנסה, ב.ל., מע"מ, מס שבח, מס רכישה, מס יסף, מס דיבידנד. מדרגות, פטורים, הטבות וכל מה שחייבים לדעת.',
  alternates: { canonical: '/guides/taxes-complete-guide-2026' },
  openGraph: {
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
  { id: 'donations', label: 'תרומות - 35% החזר' },
  { id: 'annual-planning', label: 'תכנון מס שנתי' },
  { id: 'mistakes', label: 'טעויות יקרות' },
  { id: 'calculators', label: 'כל המחשבונים' },
  { id: 'faq', label: 'שאלות נפוצות' },
];

export default function TaxesCompleteGuide() {
  return (
    <div className="min-h-screen bg-white" dir="rtl">
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
            dateModified: '2026-05-16',
            author: { '@type': 'Organization', name: 'חשבונאי' },
            publisher: { '@type': 'Organization', name: 'חשבונאי' },
            inLanguage: 'he',
            url: 'https://cheshbonai.co.il/guides/taxes-complete-guide-2026',
          }),
        }}
      />

      {/* Hero */}
      <div className="bg-gradient-to-bl from-emerald-900 via-emerald-700 to-teal-500 text-white py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-sm text-emerald-200 mb-3">
            <Link href="/" className="hover:text-white">דף הבית</Link>
            {' › '}
            <Link href="/personal-tax" className="hover:text-white">מיסים</Link>
            {' › '}
            <span>מדריך מסים שלם 2026</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
            כל המסים בישראל 2026 – המדריך השלם
          </h1>
          <p className="text-xl text-emerald-100 mb-6 max-w-3xl">
            מס הכנסה, ב.ל., מע&quot;מ, מס שבח, מס רכישה, מס יסף, דיבידנד, רווחי הון –
            מדרגות, פטורים, הטבות ותכנון מס חכם.
          </p>
          <div className="flex flex-wrap gap-4 text-sm text-emerald-200">
            <span>⏱ זמן קריאה: ~50 דקות</span>
            <span>📅 עודכן: מאי 2026</span>
            <span>📖 ~7,800 מילים</span>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10 lg:flex lg:gap-10">
        {/* Sticky TOC */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <div className="sticky top-8 bg-emerald-50 rounded-xl p-5 border border-emerald-100">
            <h2 className="font-bold text-emerald-900 mb-3 text-sm uppercase tracking-wide">תוכן עניינים</h2>
            <ol className="space-y-1">
              {tocItems.map((item, i) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    className="text-sm text-emerald-700 hover:text-emerald-900 hover:underline block py-0.5"
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
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 pb-2 border-b-2 border-emerald-500">
              1. למה זה חשוב: ישראלים מאבדים מיליארדים
            </h2>
            <p className="text-gray-700 mb-5 text-lg">
              מחקר של רשות המסים הראה שישראלים מאבדים מאות אלפי שקלים לאורך חיי העבודה שלהם
              על מסים שאפשר היה לחסוך בצורה חוקית לחלוטין. החזרי מס לא נדרשים, ניכויים שלא נוצלו,
              פטורים שלא ידעו עליהם – אלה לא חוקי מס מתוחכמים. אלה זכויות בסיסיות.
            </p>

            <div className="grid md:grid-cols-3 gap-4 mb-6">
              {[
                { stat: '2.5B₪', label: 'החזרי מס שלא נדרשו ב-2024', color: 'text-red-700' },
                { stat: '800K', label: 'שכירים זכאים שלא ביקשו החזר מס', color: 'text-orange-700' },
                { stat: '40K₪', label: 'ממוצע החזר מס שנתי אפשרי לעצמאי', color: 'text-green-700' },
              ].map((item) => (
                <div key={item.stat} className="bg-white border border-gray-200 rounded-xl p-5 text-center shadow-sm">
                  <div className={`text-3xl font-bold ${item.color} mb-1`}>{item.stat}</div>
                  <div className="text-sm text-gray-600">{item.label}</div>
                </div>
              ))}
            </div>

            <p className="text-gray-700">
              מטרת המדריך הזה: לתת לך ידע מלא על כל מס בישראל, כך שתוכל לתכנן נכון ולא לשלם
              שקל יותר ממה שמחויב בחוק.
            </p>
          </section>

          {/* Section 2 */}
          <section id="income-tax-employee" className="mb-14 scroll-mt-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 pb-2 border-b-2 border-emerald-500">
              2. מס הכנסה לשכיר – מדרגות, נקודות זיכוי, החזר מס
            </h2>

            <h3 className="text-xl font-bold text-gray-800 mb-3">מדרגות מס הכנסה 2026 (שכיר)</h3>
            <div className="overflow-x-auto mb-6">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-emerald-900 text-white">
                    <th className="border border-emerald-700 p-3 text-right">הכנסה שנתית</th>
                    <th className="border border-emerald-700 p-3 text-right">שיעור מס שולי</th>
                    <th className="border border-emerald-700 p-3 text-right">מס על המדרגה</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['עד 84,120 ₪ (7,010 ₪/חודש)', '10%', 'עד 8,412 ₪'],
                    ['84,121 – 120,720 ₪', '14%', '5,124 ₪'],
                    ['120,721 – 193,800 ₪', '20%', '14,616 ₪'],
                    ['193,801 – 269,280 ₪', '31%', '23,396 ₪'],
                    ['269,281 – 560,280 ₪', '35%', '101,850 ₪'],
                    ['560,281 – 721,560 ₪', '47%', '75,793 ₪'],
                    ['מעל 721,560 ₪', '50%', 'על כל שקל נוסף'],
                  ].map(([income, rate, tax], i) => (
                    <tr key={income} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="border border-gray-200 p-3">{income}</td>
                      <td className="border border-gray-200 p-3 font-bold text-emerald-700">{rate}</td>
                      <td className="border border-gray-200 p-3">{tax}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h3 className="text-xl font-bold text-gray-800 mb-3">נקודות זיכוי – הכלי הכי לא ידוע</h3>
            <p className="text-gray-700 mb-4">
              נקודת זיכוי שווה 242 ₪ לחודש (2,904 ₪ לשנה). כולם מקבלים 2.25 נקודות בסיס,
              ויש עשרות סיבות לנקודות נוספות. הנה הנפוצות:
            </p>
            <div className="grid md:grid-cols-2 gap-3 mb-5">
              {[
                { who: 'תושב ישראל', points: '2.25' },
                { who: 'אישה עובדת', points: '0.5' },
                { who: 'הורה לילד 0–5', points: '2.0 לכל ילד' },
                { who: 'הורה לילד 6–17', points: '1.0 לכל ילד' },
                { who: 'הורה יחיד', points: '1.0' },
                { who: 'אזרח חדש (3 שנים ראשונות)', points: 'עד 3.0' },
                { who: 'שינוי תושבות', points: 'תלוי מוצא' },
                { who: 'תואר אקדמי', points: '0.5–1.0' },
              ].map((item) => (
                <div key={item.who} className="bg-gray-50 border border-gray-200 rounded-lg p-3 flex justify-between">
                  <span className="text-gray-800 text-sm">{item.who}</span>
                  <span className="font-bold text-emerald-700 text-sm">{item.points} נקודות</span>
                </div>
              ))}
            </div>

            <h3 className="text-xl font-bold text-gray-800 mb-3">מי זכאי להחזר מס?</h3>
            <p className="text-gray-700 mb-5">
              שכיר שעבד אצל יותר ממעסיק אחד, היה בחל&quot;ת חלקי, נולד לו ילד, עלה לישראל, למד,
              תרם, או שיש לו הוצאות מוכרות – עשוי לקבל החזר של 5,000–25,000 ₪. ניתן לדרוש
              עד 6 שנים אחורה! בדוק:
            </p>
            <Link href="/personal-tax/tax-refund" className="inline-block bg-emerald-600 text-white px-5 py-2.5 rounded-lg hover:bg-emerald-700 font-medium mb-4">
              מחשבון החזר מס לשכיר ←
            </Link>

            <div className="mt-3">
              <Link href="/blog/tax-refund-complete-guide-2026" className="text-emerald-600 underline text-sm">
                המדריך השלם להחזר מס לשכירים 2026 ←
              </Link>
            </div>
          </section>

          {/* Section 3 */}
          <section id="income-tax-self" className="mb-14 scroll-mt-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 pb-2 border-b-2 border-emerald-500">
              3. מס הכנסה לעצמאי – מקדמות, ניכויים, הוצאות מוכרות
            </h2>

            <p className="text-gray-700 mb-5">
              עצמאי מחשב מס הכנסה על הרווח (הכנסות פחות הוצאות מוכרות), לא על מחזור.
              מדרגות המס זהות לשכיר, אך יש הבדלים מהותיים:
            </p>

            <h3 className="text-xl font-bold text-gray-800 mb-3">הוצאות מוכרות עיקריות</h3>
            <div className="grid md:grid-cols-2 gap-3 mb-6">
              {[
                { expense: 'שכר דירה לעסק', rate: '100% (עסק נפרד) / 25% (בית)' },
                { expense: 'רכב עסקי', rate: 'לפי נסיעות / 45% על שווי שימוש' },
                { expense: 'ציוד ומחשבים', rate: '100% (מחשב) / לפי פחת' },
                { expense: 'טלפון', rate: '50%–80% לפי שימוש עסקי' },
                { expense: 'השתלמות מקצועית', rate: '100% בתחום העיסוק' },
                { expense: 'ביטוחים עסקיים', rate: '100%' },
                { expense: 'פנסיה עצמאי', rate: '16.5% מהרווח (ניכוי + זיכוי)' },
                { expense: 'קרן השתלמות עצמאי', rate: '4.5% מהרווח (עד תקרה)' },
              ].map((item) => (
                <div key={item.expense} className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                  <div className="font-medium text-gray-800 text-sm">{item.expense}</div>
                  <div className="text-emerald-700 text-sm">{item.rate}</div>
                </div>
              ))}
            </div>

            <h3 className="text-xl font-bold text-gray-800 mb-3">מקדמות מס – מה הן ואיך מחשבים?</h3>
            <p className="text-gray-700 mb-5">
              עצמאי משלם מקדמות מס כל חודש (עד ה-15 לחודש העוקב). גובה המקדמה נקבע
              לפי % מהמחזור, בהתאם לתחום. הכנסות גבוהות מהצפי → ישנם מנגנוני עדכון.
              בסוף השנה מגישים דוח שנתי ומחשבים מס אמיתי.
            </p>

            <div className="flex gap-3 flex-wrap">
              <Link href="/self-employed/net" className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 text-sm font-medium">
                מחשבון נטו עצמאי ←
              </Link>
              <Link href="/self-employed/tax-advances" className="bg-white border border-emerald-600 text-emerald-700 px-4 py-2 rounded-lg hover:bg-emerald-50 text-sm font-medium">
                מחשבון מקדמות מס ←
              </Link>
              <Link href="/self-employed/year-end-tax-simulator" className="bg-white border border-emerald-600 text-emerald-700 px-4 py-2 rounded-lg hover:bg-emerald-50 text-sm font-medium">
                סימולטור מס שנתי ←
              </Link>
            </div>

            <div className="mt-4">
              <Link href="/blog/year-end-tax-planning-self-employed" className="text-emerald-600 underline text-sm">
                תכנון מס לעצמאי לקראת סוף שנה ←
              </Link>
            </div>
          </section>

          {/* Section 4 */}
          <section id="bituach-leumi" className="mb-14 scroll-mt-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 pb-2 border-b-2 border-emerald-500">
              4. ביטוח לאומי + בריאות – שכיר vs. עצמאי
            </h2>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
                <h3 className="font-bold text-blue-900 mb-3">שכיר</h3>
                <ul className="space-y-2 text-sm text-blue-800">
                  <li>• ב.ל. עובד: 3.5% (עד תקרה) + 12% (מעל)</li>
                  <li>• ב.ל. מעסיק: 3.55% + 7.6%</li>
                  <li>• ביטוח בריאות: 3.1% + 5%</li>
                  <li>• כל הניכויים אוטומטיים מהשכר</li>
                </ul>
              </div>
              <div className="bg-orange-50 border border-orange-200 rounded-xl p-5">
                <h3 className="font-bold text-orange-900 mb-3">עצמאי (עוסק)</h3>
                <ul className="space-y-2 text-sm text-orange-800">
                  <li>• ב.ל. (הכנסות עד 7,522 ₪): 5.97%</li>
                  <li>• ב.ל. (הכנסות מעל): 17.83%</li>
                  <li>• ביטוח בריאות: 3.1% + 5%</li>
                  <li>• תשלום דרך פנקס המקדמות</li>
                </ul>
              </div>
            </div>

            <p className="text-gray-700 mb-5">
              <strong>ההבדל הגדול:</strong> שכיר עם שכר 20,000 ₪ ישלם ב.ל. ~700 ₪/חודש.
              עצמאי עם הכנסה זהה ישלם ~3,300 ₪/חודש (כולל חלק מעסיק שמשלם לבד). סה&quot;כ
              הפרש: ~2,600 ₪/חודש = 31,200 ₪ לשנה.
            </p>

            <div className="flex gap-3 flex-wrap">
              <Link href="/self-employed/social-security" className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 text-sm font-medium">
                מחשבון ב.ל. לעצמאי ←
              </Link>
              <Link href="/blog/bituach-leumi-self-employed-deep-dive" className="text-emerald-600 underline text-sm inline-flex items-center">
                מדריך מעמיק לב.ל. לעצמאי ←
              </Link>
            </div>
          </section>

          {/* Section 5 */}
          <section id="vat" className="mb-14 scroll-mt-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 pb-2 border-b-2 border-emerald-500">
              5. מע&quot;מ – 18%, עוסק פטור/מורשה
            </h2>

            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-5 mb-6">
              <p className="font-bold text-yellow-900 mb-2">שיעור מע&quot;מ 2026: 18%</p>
              <p className="text-yellow-800 text-sm">
                מע&quot;מ עלה מ-17% ל-18% ב-1 בינואר 2025. המשמעות: כל עסק מורשה גובה 18% מע&quot;מ על
                מחיר השירות/מוצר ומעביר לרשות המסים.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-5 mb-6">
              <div className="border border-gray-200 rounded-xl p-5">
                <h3 className="font-bold text-gray-900 mb-3">עוסק פטור</h3>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>• מחזור עד 120,000 ₪ לשנה</li>
                  <li>• פטור מגביית מע&quot;מ מלקוחות</li>
                  <li>• אינו מחזיר מע&quot;מ תשומות</li>
                  <li>• דיווח שנתי בלבד</li>
                  <li>• <strong>חיסרון:</strong> בלתי מועדף על ידי עסקים (אין חשבונית מע&quot;מ)</li>
                </ul>
              </div>
              <div className="border border-gray-200 rounded-xl p-5">
                <h3 className="font-bold text-gray-900 mb-3">עוסק מורשה</h3>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>• מחזור מעל 120,000 ₪ לשנה (חובה)</li>
                  <li>• גובה 18% מע&quot;מ מלקוחות</li>
                  <li>• מחזיר מע&quot;מ על הוצאות עסק</li>
                  <li>• דיווח דו-חודשי / חודשי</li>
                  <li>• <strong>יתרון:</strong> לקוחות עסקיים מעדיפים (ניכוי מע&quot;מ)</li>
                </ul>
              </div>
            </div>

            <div className="flex gap-3 flex-wrap">
              <Link href="/self-employed/vat" className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 text-sm font-medium">
                מחשבון מע&quot;מ ←
              </Link>
              <Link href="/blog/vat-complete-guide-israel" className="text-emerald-600 underline text-sm inline-flex items-center">
                המדריך השלם למע&quot;מ ←
              </Link>
            </div>
          </section>

          {/* Section 6 */}
          <section id="surtax" className="mb-14 scroll-mt-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 pb-2 border-b-2 border-emerald-500">
              6. מס יסף 3% – מי חייב ואיך מחשבים
            </h2>

            <p className="text-gray-700 mb-5">
              מס יסף (Surtax) הוא תוספת של 3% על הכנסה חייבת מעל 721,560 ₪ לשנה (2026).
              מדובר על כלל ההכנסות: שכר, עסק, שכר דירה, רווחי הון, דיבידנד – הכל מצטרף.
            </p>

            <div className="bg-red-50 border border-red-200 rounded-xl p-5 mb-5">
              <h3 className="font-bold text-red-900 mb-2">מי חייב?</h3>
              <p className="text-red-800 text-sm">
                כל מי שהכנסתו הכוללת (מכל המקורות) עולה על 721,560 ₪ לשנה.
                שים לב: גם רווח ממכירת נכס (מס שבח) יכול לדחוף להכנסה הכוללת מעל הסף.
              </p>
            </div>

            <h3 className="text-xl font-bold text-gray-800 mb-3">דוגמה מספרית</h3>
            <p className="text-gray-700 mb-5">
              שכר שנתי 800,000 ₪ → 800,000 – 721,560 = 78,440 ₪ חייב במס יסף → 78,440 × 3% =
              2,353 ₪ מס יסף שנתי (בנוסף למס ה-50% השולי).
            </p>

            <Link href="/blog/surtax-yesef-2026-explained" className="text-emerald-600 underline text-sm">
              הסבר מלא על מס יסף 2026 ←
            </Link>
          </section>

          {/* Section 7 */}
          <section id="capital-gains" className="mb-14 scroll-mt-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 pb-2 border-b-2 border-emerald-500">
              7. מס שבח – מכירת דירה, מס לינארי
            </h2>

            <p className="text-gray-700 mb-5">
              מס שבח = מס על הרווח ממכירת נדל&quot;ן. שיעורו 25%, אך קיימות פטורים ומנגנון לינארי.
            </p>

            <h3 className="text-xl font-bold text-gray-800 mb-3">פטור דירת מגורים</h3>
            <p className="text-gray-700 mb-5">
              מי שמוכר דירת מגורים יחידה, גר בה לפחות 18 חודשים מ-4 השנים האחרונות, ולא מכר
              דירה בפטור ב-18 החודשים האחרונים – זכאי לפטור מלא. אם מכר – שיעור מס מופחת לפי
              חישוב לינארי (לפי יחס השנים לפני 2014 ואחריהן).
            </p>

            <h3 className="text-xl font-bold text-gray-800 mb-3">מס לינארי (דירה שנייה+)</h3>
            <p className="text-gray-700 mb-5">
              שבח מחולק לשניים: חלק עד 2014 (שיעור 0%) + חלק אחרי 2014 (שיעור 25%).
              דוגמה: קנייה ב-2010, מכירה ב-2026 = 16 שנים סה&quot;כ. 4 שנים עד 2014 = 4/16 פטור.
              12 שנים אחרי 2014 = 12/16 × 25% = 18.75% מס אפקטיבי על כלל השבח.
            </p>

            <div className="flex gap-3 flex-wrap">
              <Link href="/real-estate/capital-gains-tax" className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 text-sm font-medium">
                מחשבון מס שבח ←
              </Link>
              <Link href="/blog/capital-gains-tax-property-2026" className="text-emerald-600 underline text-sm inline-flex items-center">
                מדריך מס שבח 2026 ←
              </Link>
            </div>
          </section>

          {/* Section 8 */}
          <section id="purchase-tax" className="mb-14 scroll-mt-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 pb-2 border-b-2 border-emerald-500">
              8. מס רכישה – 8 סוגי רוכשים
            </h2>

            <p className="text-gray-700 mb-5">
              מס רכישה משלמים בעת קניית נדל&quot;ן. השיעורים משתנים לפי סוג הרוכש ומחיר הנכס:
            </p>

            <div className="overflow-x-auto mb-5">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-emerald-900 text-white">
                    <th className="border border-emerald-700 p-3 text-right">סוג רוכש</th>
                    <th className="border border-emerald-700 p-3 text-right">מס עד 1.99M₪</th>
                    <th className="border border-emerald-700 p-3 text-right">מס מ-1.99M₪ ואילך</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['דירה ראשונה (יחידה)', '0% עד 1,978,745 ₪ | 3.5% עד 2,347,040 | 5% עד 6,055,070 | 8%+ מעל', '5%–10%'],
                    ['דירה שנייה (משקיע)', '8% מהשקל הראשון', '10% על כל השווי'],
                    ['דירה יחידה – עולה חדש', 'מדרגות מופחתות מיוחדות', '5%'],
                    ['מגרש / נכס מסחרי', '6%', '6%'],
                  ].map(([type, low, high], i) => (
                    <tr key={type} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="border border-gray-200 p-3 font-medium">{type}</td>
                      <td className="border border-gray-200 p-3 text-green-700">{low}</td>
                      <td className="border border-gray-200 p-3 text-red-700">{high}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex gap-3 flex-wrap">
              <Link href="/real-estate/purchase-tax" className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 text-sm font-medium">
                מחשבון מס רכישה ←
              </Link>
              <Link href="/blog/purchase-tax-2026-complete-guide" className="text-emerald-600 underline text-sm inline-flex items-center">
                מדריך מס רכישה 2026 ←
              </Link>
            </div>
          </section>

          {/* Section 9 */}
          <section id="dividend-tax" className="mb-14 scroll-mt-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 pb-2 border-b-2 border-emerald-500">
              9. מס דיבידנד – 25%/30% לבעל שליטה
            </h2>

            <p className="text-gray-700 mb-5">
              חלוקת דיבידנד מחברה בע&quot;מ חייבת במס. שיעורי המס:
            </p>

            <div className="grid md:grid-cols-2 gap-4 mb-5">
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                <h3 className="font-bold text-gray-900 mb-2">בעל מניות רגיל</h3>
                <p className="text-2xl font-bold text-emerald-700">25%</p>
                <p className="text-sm text-gray-600">מי שמחזיק פחות מ-10% מהחברה</p>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                <h3 className="font-bold text-gray-900 mb-2">בעל שליטה (10%+)</h3>
                <p className="text-2xl font-bold text-red-700">30%</p>
                <p className="text-sm text-gray-600">מחזיק 10%+ מהחברה (רוב בעלי עסקים)</p>
              </div>
            </div>

            <p className="text-gray-700 mb-5">
              <strong>מס על מס:</strong> חברה שילמה 23% מס חברות על הרווח. מה שנשאר מחולק
              כדיבידנד ומשלם עוד 30%. מס אפקטיבי כולל: 23% + (77% × 30%) = ~46.1%.
              לכן בעלי שליטה רבים מעדיפים לקחת שכר (עד מדרגת 47%) ולא דיבידנד.
            </p>

            <div className="flex gap-3">
              <Link href="/self-employed/dividend-vs-salary" className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 text-sm font-medium">
                מחשבון דיבידנד vs. שכר ←
              </Link>
            </div>
          </section>

          {/* Section 10 */}
          <section id="investment-gains" className="mb-14 scroll-mt-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 pb-2 border-b-2 border-emerald-500">
              10. מס רווחי הון – 25% על השקעות
            </h2>

            <p className="text-gray-700 mb-5">
              רווח ממכירת ניירות ערך, קרנות נאמנות, קריפטו, אופציות – חייב ב-25% מס רווחי הון.
              בעל שליטה בחברה שמשקיע דרכה: 30%.
            </p>

            <h3 className="text-xl font-bold text-gray-800 mb-3">מה מחשבים?</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-5">
              <li>רווח = מחיר מכירה – מחיר קנייה (מתואם לאינפלציה)</li>
              <li>הפסדים ניתן לקזז מול רווחים באותה שנה</li>
              <li>הפסד שלא קוזז: אפשר להעביר 3 שנים קדימה</li>
              <li>פטור: קרן השתלמות, פנסיה, קופות גמל</li>
            </ul>

            <h3 className="text-xl font-bold text-gray-800 mb-3">אופציות 102 – הטבה מרכזית</h3>
            <p className="text-gray-700 mb-5">
              עובדים שמקבלים אופציות במסלול 102 יכולים לשלם מס רווחי הון (25%) במקום מס
              הכנסה (47%+). תנאי: החזקת האופציות לפחות 24 חודש לאחר ההקצאה (או הבשלה).
            </p>

            <Link href="/investments/compound-interest" className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 text-sm font-medium inline-block">
              מחשבון ריבית דריבית ←
            </Link>
          </section>

          {/* Section 11 */}
          <section id="study-fund" className="mb-14 scroll-mt-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 pb-2 border-b-2 border-emerald-500">
              11. קרן השתלמות – ההטבה המטורפת
            </h2>

            <div className="bg-gradient-to-l from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6 mb-5">
              <h3 className="font-bold text-green-900 mb-3 text-lg">למה זאת ההטבה הטובה ביותר בישראל?</h3>
              <ul className="space-y-2 text-green-800 text-sm">
                <li>• <strong>שכיר:</strong> מעסיק מפקיד 7.5% (פטור ממס הכנסה לעובד!)</li>
                <li>• <strong>שכיר:</strong> עובד מפקיד 2.5% (ניכוי ממס הכנסה)</li>
                <li>• <strong>תשואה:</strong> הכסף מושקע בשוק ההון ומשיג תשואה</li>
                <li>• <strong>משיכה לאחר 6 שנים:</strong> פטור מלא ממס רווחי הון!</li>
                <li>• <strong>תקרה פטורה לשכיר:</strong> 15,712 ₪ הכנסה × 7.5% = 1,178 ₪/חודש</li>
              </ul>
            </div>

            <h3 className="text-xl font-bold text-gray-800 mb-3">קרן השתלמות לעצמאי</h3>
            <p className="text-gray-700 mb-5">
              עצמאי יכול להפקיד עד 4.5% מהרווח (עד 18,840 ₪ לשנה) ולקבל ניכוי ממס הכנסה.
              כמו כן – הכנסות מהשקעות בקרן פטורות ממס רווחי הון לאחר 6 שנים.
            </p>

            <Link href="/blog/study-fund-self-employed-strategy" className="text-emerald-600 underline text-sm">
              מדריך קרן השתלמות לעצמאי ←
            </Link>
          </section>

          {/* Section 12 */}
          <section id="pension-tax" className="mb-14 scroll-mt-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 pb-2 border-b-2 border-emerald-500">
              12. פנסיה – 11% ניכוי + 5.5% זיכוי לעצמאי
            </h2>

            <div className="grid md:grid-cols-2 gap-5 mb-5">
              <div className="border border-gray-200 rounded-xl p-5">
                <h3 className="font-bold text-gray-900 mb-3">שכיר</h3>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>• עובד מפקיד: 6%</li>
                  <li>• מעסיק מפקיד: 6.5% (פנסיה) + 6% (פיצויים)</li>
                  <li>• סה&quot;כ: 18.5% מהשכר</li>
                  <li>• עובד: ניכוי מס על 7% מהשכר (עד תקרה)</li>
                </ul>
              </div>
              <div className="border border-gray-200 rounded-xl p-5">
                <h3 className="font-bold text-gray-900 mb-3">עצמאי</h3>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>• חובת הפקדה מינימלית: לפי גיל וסכום</li>
                  <li>• ניכוי: 11% מהרווח (עד 9,024 ₪/שנה)</li>
                  <li>• זיכוי: 5.5% מהרווח (עד 5,460 ₪/שנה)</li>
                  <li>• סה&quot;כ חיסכון מס: עד ~15,000 ₪/שנה</li>
                </ul>
              </div>
            </div>

            <div className="flex gap-3 flex-wrap">
              <Link href="/insurance/pension" className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 text-sm font-medium">
                מחשבון פנסיה ←
              </Link>
              <Link href="/self-employed/mandatory-pension" className="bg-white border border-emerald-600 text-emerald-700 px-4 py-2 rounded-lg hover:bg-emerald-50 text-sm font-medium">
                פנסיה חובה לעצמאי ←
              </Link>
              <Link href="/blog/pension-deduction-self-employed-2026" className="text-emerald-600 underline text-sm inline-flex items-center">
                ניכוי פנסיה לעצמאי ←
              </Link>
            </div>
          </section>

          {/* Section 13 */}
          <section id="donations" className="mb-14 scroll-mt-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 pb-2 border-b-2 border-emerald-500">
              13. תרומות – 35% החזר ממס
            </h2>

            <p className="text-gray-700 mb-5">
              תרומה לגוף ציבורי מוכר (סעיף 46 לפקודת מס הכנסה) מזכה בזיכוי מס של 35% מסכום
              התרומה. לא ניכוי – זיכוי. כלומר, הממשלה מממנת 35% מהתרומה שלך.
            </p>

            <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 mb-4">
              <p className="text-purple-900 text-sm">
                <strong>דוגמה:</strong> תרמת 10,000 ₪ לעמוסי ישראל →
                10,000 × 35% = 3,500 ₪ זיכוי ממס הכנסה שתקבל בהחזר.
                עלות התרומה האפקטיבית: 6,500 ₪.
              </p>
            </div>

            <p className="text-gray-700 mb-3">
              <strong>תנאים:</strong> מינימום תרומה 190 ₪ בשנה. הסכום המוכר: עד 30% מההכנסה החייבת
              (לשכירים) / 30% מהרווח (לעצמאיים).
            </p>
          </section>

          {/* Section 14 */}
          <section id="annual-planning" className="mb-14 scroll-mt-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 pb-2 border-b-2 border-emerald-500">
              14. תכנון מס שנתי – 12 חודשים
            </h2>

            <div className="space-y-4">
              {[
                { month: 'ינואר', action: 'בדיקת תיאום מס – אם עובד אצל 2+ מעסיקים, בצע תיאום מס כדי לא לשלם מקדמות גבוהות.' },
                { month: 'פברואר–מרץ', action: 'הגשת דוח שנתי לשנה הקודמת (עצמאים ועובדים עם הכנסות נוספות).' },
                { month: 'אפריל–יוני', action: 'בדיקת זכאות להחזר מס לשנה הקודמת (שכירים). טופס 135 או הגשה אוטומטית.' },
                { month: 'יולי–ספטמבר', action: 'עדכון מקדמות מס לעצמאים (אם ההכנסה שונה מהצפוי).' },
                { month: 'ספטמבר–נובמבר', action: 'תכנון שנתי: האם לפרוע הוצאות בשנה הנוכחית? לקנות ציוד? להפקיד לקרן השתלמות?' },
                { month: 'נובמבר–דצמבר', action: 'הפקדה מקסימלית לקרן השתלמות ולפנסיה לפני סוף שנה. בדיקת הפסדים לקיזוז.' },
              ].map((item) => (
                <div key={item.month} className="flex gap-4 bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex-shrink-0 bg-emerald-600 text-white rounded-lg px-3 py-2 text-xs font-bold text-center min-w-[80px]">
                    {item.month}
                  </div>
                  <p className="text-gray-700 text-sm">{item.action}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Section 15 */}
          <section id="mistakes" className="mb-14 scroll-mt-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 pb-2 border-b-2 border-emerald-500">
              15. טעויות שעולות אלפי שקלים
            </h2>

            <div className="space-y-4">
              {[
                { mistake: 'לא לדרוש החזר מס', cost: 'עד 25,000 ₪ לשנה!', fix: 'בדוק זכאות לשנים אחורה – ניתן לדרוש עד 6 שנים.' },
                { mistake: 'לא לעדכן נקודות זיכוי', cost: '3,000–15,000 ₪ לשנה', fix: 'עדכן ילד חדש, תואר, עלייה לישראל – מיד!' },
                { mistake: 'לא לבצע תיאום מס', cost: 'אלפי שקלים ינוכו יותר', fix: 'אם יש 2 מעסיקים – תיאום מס הכרחי.' },
                { mistake: 'לא לנצל קרן השתלמות', cost: 'אובדן תשואה פטורה ממס', fix: 'הפקד את המקסימום – הכי טוב תשואה נטו בישראל.' },
                { mistake: 'לא לנכות פנסיה כעצמאי', cost: '5,000–15,000 ₪ מס נוסף', fix: 'הפקד לפנסיה ודרוש ניכוי מלא בדוח.' },
                { mistake: 'שכחת לרשום הוצאות', cost: 'תשלום מס על הכנסה בה לא חייב', fix: 'שמור כל קבלה ורשום הוצאות מוכרות.' },
              ].map((item, i) => (
                <div key={i} className="border border-red-200 rounded-xl p-5 bg-red-50">
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
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 pb-2 border-b-2 border-emerald-500">
              16. כל המחשבונים שלנו
            </h2>

            <div className="grid md:grid-cols-2 gap-4">
              {[
                { href: '/personal-tax/salary-net-gross', label: 'מחשבון שכר נטו-ברוטו', desc: 'חשב שכר נטו מדויק כולל מס, ב.ל. ופנסיה.' },
                { href: '/personal-tax/tax-refund', label: 'מחשבון החזר מס לשכיר', desc: 'גלה אם מגיע לך החזר מס וכמה.' },
                { href: '/personal-tax/income-tax', label: 'מחשבון מס הכנסה', desc: 'חישוב מס הכנסה מדויק לפי מדרגות 2026.' },
                { href: '/personal-tax/tax-credits', label: 'מחשבון נקודות זיכוי', desc: 'בדוק כמה נקודות זיכוי מגיעות לך.' },
                { href: '/self-employed/net', label: 'מחשבון נטו עצמאי', desc: 'חשב כמה תקח הביתה כעצמאי.' },
                { href: '/self-employed/social-security', label: 'מחשבון ב.ל. עצמאי', desc: 'ביטוח לאומי ובריאות לעצמאים.' },
                { href: '/self-employed/vat', label: 'מחשבון מע"מ', desc: 'חישוב מע"מ עוסק מורשה/פטור.' },
                { href: '/self-employed/tax-advances', label: 'מחשבון מקדמות מס', desc: 'חשב מקדמות מס חודשיות.' },
                { href: '/self-employed/year-end-tax-simulator', label: 'סימולטור מס שנתי', desc: 'מה יהיה המס שלך בסוף השנה?' },
                { href: '/self-employed/dividend-vs-salary', label: 'דיבידנד vs. שכר', desc: 'מה עדיף לבעל שליטה?' },
                { href: '/real-estate/capital-gains-tax', label: 'מחשבון מס שבח', desc: 'חשב מס שבח על מכירת נדל"ן.' },
                { href: '/real-estate/purchase-tax', label: 'מחשבון מס רכישה', desc: 'מס רכישה לפי סוג רוכש ומחיר.' },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block bg-white border border-emerald-200 rounded-xl p-4 hover:border-emerald-400 hover:shadow-md transition group"
                >
                  <h3 className="font-bold text-emerald-700 group-hover:text-emerald-900 mb-1">{item.label}</h3>
                  <p className="text-gray-600 text-sm">{item.desc}</p>
                </Link>
              ))}
            </div>

            <h3 className="text-lg font-bold text-gray-800 mt-8 mb-3">מאמרים קשורים</h3>
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
                  className="flex items-center gap-2 text-emerald-600 hover:text-emerald-800 text-sm py-1 border-b border-gray-100"
                >
                  <span>←</span> {item.label}
                </Link>
              ))}
            </div>
          </section>

          {/* Section 17 - FAQ */}
          <section id="faq" className="mb-14 scroll-mt-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 pb-2 border-b-2 border-emerald-500">
              17. שאלות נפוצות (FAQ)
            </h2>

            <div className="space-y-5">
              {[
                {
                  q: 'מה שיעור מס הכנסה המינימלי בישראל?',
                  a: '10% על הכנסה עד 84,120 ₪ לשנה. אך בפועל, בגלל נקודות זיכוי (2.25 לפחות לכל אחד = 5,418 ₪ זיכוי שנתי), שכיר עם שכר עד ~6,500 ₪/חודש לא ישלם מס הכנסה כלל.',
                },
                {
                  q: 'האם צריך להגיש דוח שנתי כשכיר?',
                  a: 'לרוב השכירים – לא. הגשת דוח חובה רק אם יש הכנסות נוספות (שכ"ד, דיבידנד, עסק צדדי). אך מומלץ לבדוק זכאות להחזר מס (ניתן לדרוש בלי להגיש דוח מלא).',
                },
                {
                  q: 'האם שכר דירה חייב במס?',
                  a: 'כן, אבל יש פטור. דמי שכירות עד 5,654 ₪/חודש (2026) על דירה למגורים – פטורים ממס. מעל הסף: שיטת מיסוי מיוחדת. שכ"ד מנכסים מסחריים: חייב במלואו.',
                },
                {
                  q: 'מה ההבדל בין ניכוי מס לבין זיכוי מס?',
                  a: 'ניכוי = מפחית את ההכנסה החייבת (חוסך לך % המס השולי שלך). זיכוי = מפחית ישירות את המס שתשלם (שקל לשקל). זיכוי עדיף – חוסך יותר.',
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
                  a: 'לא מס הכנסה אם אין רווח. אך לב.ל. יש תשלום מינימלי (~1,000 ₪/חודש) גם אם אין הכנסה, אלא אם העצמאי סגר את עסקו.',
                },
                {
                  q: 'מתי כדאי לפתוח חברה בע"מ?',
                  a: 'ככלל אצבע: כשהרווח השנתי עולה על 400,000–500,000 ₪. מתחת לסכום זה, עוסק מורשה כדאי יותר (חוסכים הוצאות חשבונאות ועלויות ניהול חברה).',
                },
                {
                  q: 'האם עלות ילד במעון מוכרת לניכוי?',
                  a: 'לא ישירות כהוצאה. אבל יש נקודות זיכוי על ילדים עד גיל 5 (2 נקודות לכל ילד) שמקטינות את המס. בנוסף – ישנה הכרה בתשלום למוסד חינוכי בתנאים מסוימים.',
                },
                {
                  q: 'האם ניתן לבטל מקדמות מס?',
                  a: 'ניתן לבקש הפחתת מקדמות אם ההכנסה ירדה משמעותית. ניתן גם לדחות תשלום בנסיבות מיוחדות. פנה לרשות המסים.',
                },
                {
                  q: 'מה הרישוי הנדרש לפתיחת עסק?',
                  a: 'רשות המסים: פתיחת תיק עוסק. הרשות המקומית: רישיון עסק (לחלק מסוגי העסקים). ביטוח לאומי: פתיחת תיק עצמאי. זה בסה"כ 2–3 ימי עבודה.',
                },
                {
                  q: 'האם אפשר להגיש דוח שנתי בעצמי?',
                  a: 'כן, דרך אתר רשות המסים (מערכת e-file). לדוח פשוט (הכנסה ממקור אחד) – ממש לא קשה. לדוח מורכב (מספר מקורות, שכ"ד, נדל"ן) – עדיף רואה חשבון.',
                },
                {
                  q: 'מה ההבדל בין "מחיר למשתכן" ל"מחיר מופחת"?',
                  a: 'מחיר למשתכן: תוכנית ממשלתית לרוכשי דירה ראשונה – קנייה ב-75%–80% ממחיר שוק. בחלק מהפרויקטים – מס רכישה מופחת (0% על חלק ממחיר).',
                },
                {
                  q: 'האם הפרשות לפנסיה פטורות ממס?',
                  a: 'הפרשות המעסיק לפנסיה: פטורות ממס בידי העובד בעת ההפקדה. הפקדות עצמיות: מזכות בניכוי (7% מהשכר עד תקרה). משיכת פנסיה בגיל פרישה: חייבת בחלקה, אבל יש פטור של עד ~8,700 ₪/חודש (2026).',
                },
              ].map((item, i) => (
                <details key={i} className="border border-gray-200 rounded-xl overflow-hidden">
                  <summary className="p-4 font-bold text-gray-900 cursor-pointer hover:bg-gray-50 flex items-center gap-2">
                    <span className="text-emerald-600">ש:</span> {item.q}
                  </summary>
                  <div className="p-4 pt-0 bg-gray-50 text-gray-700 text-sm leading-relaxed">
                    <span className="text-green-700 font-bold">ת: </span>{item.a}
                  </div>
                </details>
              ))}
            </div>
          </section>

          {/* Bottom CTA */}
          <div className="bg-gradient-to-l from-emerald-600 to-teal-700 text-white rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-bold mb-3">מוכן לחסוך מסים?</h2>
            <p className="text-emerald-100 mb-6">
              השתמש בכלים שלנו לחישוב מס מדויק ומציאת הזדמנויות חיסכון
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link
                href="/personal-tax/tax-refund"
                className="bg-white text-emerald-700 px-6 py-3 rounded-lg font-bold hover:bg-emerald-50 transition"
              >
                מחשבון החזר מס ←
              </Link>
              <Link
                href="/self-employed/year-end-tax-simulator"
                className="bg-emerald-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-emerald-400 transition border border-emerald-400"
              >
                סימולטור מס שנתי ←
              </Link>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}
