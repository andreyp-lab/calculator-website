import { Metadata } from 'next';
import { CalculatorLayout } from '@/components/calculator/CalculatorLayout';
import { CLVCalculator } from '@/components/calculators/CLVCalculator';
import { FAQ } from '@/components/calculator/FAQ';

export const metadata: Metadata = {
  title: 'מחשבון CLV - שווי לקוח לטווח ארוך 2026',
  description:
    'חשב את ה-Customer Lifetime Value (CLV/LTV) של הלקוחות שלך. כולל יחס LTV/CAC, Payback Period, ובנצ\'מארק לתעשיות שונות. מדד מפתח לעסקי SaaS, שירותים ו-E-commerce.',
  alternates: { canonical: '/tools/customer-lifetime-value' },
};

const faqItems = [
  {
    question: 'מה זה CLV / LTV?',
    answer:
      'Customer Lifetime Value (LTV) הוא הרווח הגולמי הכולל שלקוח מייצר במהלך כל זמן היותו לקוח שלך. זהו אחד המדדים המרכזיים בכל עסק שירותים, SaaS, מסחר חוזר, או Subscription. הוא עוזר להחליט: כמה להשקיע בגיוס לקוח? אילו לקוחות שווה לטפח? איזה ערוצי שיווק רווחיים?',
  },
  {
    question: 'מה ההבדל בין CLV ל-LTV?',
    answer:
      'אין הבדל אמיתי - זה אותו מדד. CLV (Customer Lifetime Value) הוא המונח הפורמלי, LTV נפוץ יותר בקרב מנהלי שיווק. שניהם מתייחסים לרווח הגולמי הכולל ללקוח לאורך חייו. לפעמים LTV מתייחס להכנסה ברוטו ו-CLV לרווח גולמי - אבל זו לא חוקיות.',
  },
  {
    question: 'מהו יחס LTV/CAC הבריא?',
    answer:
      'בנצ\'מארקים לפי תעשייה: SaaS B2B - 3-5x = בריא, 5+x = מצוין; E-commerce - 2-3x; שירותים מקצועיים - 4-10x; Mobile apps - 2-4x. יחס מתחת ל-1 = העסק מפסיד על כל לקוח. יחס 1-3 = רווחי אבל לא יעיל. יחס 3+ = עסק בריא שיכול לגדול. יחס 8+ = אולי לא משקיעים מספיק בשיווק.',
  },
  {
    question: 'איך מחשבים CAC?',
    answer:
      'CAC = (סך הוצאות שיווק + מכירות) ÷ (מספר לקוחות חדשים). כללו: פרסום בכל הערוצים, משכורות אנשי שיווק ומכירות, כלים ותוכנות (CRM, Marketing automation), עמלות סוכנים, אירועים והדגמות. אל תכללו: שירות לקוחות (לא חלק מהגיוס), ניהול חשבונות קיימים.',
  },
  {
    question: 'מה זה Payback Period?',
    answer:
      'מספר החודשים עד שהלקוח החזיר את עלות הגיוס שלו. אם CAC = 1,000 ₪ והרווח הגולמי החודשי מהלקוח = 100 ₪ → Payback = 10 חודשים. בריא: SaaS 12-18 חודש, E-commerce 6-12, שירותים 3-6. Payback ארוך = העסק זקוק להון תפעול גדול לתמיכה בצמיחה.',
  },
  {
    question: 'איך משפרים את ה-LTV?',
    answer:
      'דרכים להעלות LTV: (1) Upsell - מכירת תוכניות יקרות יותר ללקוחות קיימים; (2) Cross-sell - מכירת מוצרים נוספים; (3) הקטנת Churn (שימור לקוחות) - בעיקר ב-SaaS; (4) הגדלת תדירות רכישה (E-commerce); (5) שיפור Margin - יעילות, מחיר; (6) Premium pricing למוצר משופר.',
  },
  {
    question: 'מה זה Churn Rate ואיך זה מתחבר ל-LTV?',
    answer:
      'Churn = אחוז הלקוחות שעוזבים בכל תקופה. אם Churn חודשי = 5%, ממוצע שלקוח נשאר = 1/0.05 = 20 חודשים. בנוסחת LTV: LTV = ARPU × Margin / Churn_Rate. למשל: ARPU 200 ₪/חודש, מרגיני 70%, Churn 5% → LTV = 200×0.70/0.05 = 2,800 ₪. SaaS בריא: Churn חודשי <2%.',
  },
  {
    question: 'מתי המחשבון לא רלוונטי?',
    answer:
      'במצבים הבאים LTV פחות שימושי: (1) עסק עם מוצר חד-פעמי (לא חוזר) - רק "שווי הזמנה" משמעותי; (2) פרויקטים גדולים B2B עם מחזור ארוך מאוד (חוזה אחד שנמשך שנים); (3) שוק עם תחלופה גבוהה מאוד (LTV לא משמעותי בכל מקרה). במצבים אלה - מדד אחר כמו "Order Value" או "Gross Profit per Project" עדיף.',
  },
];

export default function CLVPage() {
  return (
    <>
      <CalculatorLayout
        title="מחשבון Customer Lifetime Value"
        description="חשב את שווי הלקוח לטווח ארוך - LTV/CAC, Payback Period, ועוד מדדים מרכזיים. כלי חיוני לעסקי SaaS, שירותים, Subscription ו-E-commerce."
        breadcrumbs={[
          { label: 'דף הבית', href: '/' },
          { label: 'כלים לבעלי עסקים', href: '/tools' },
          { label: 'CLV / LTV' },
        ]}
        lastUpdated="2026-05-03"
        calculator={<CLVCalculator />}
        content={
          <>
            <h2>מה זה CLV ולמה זה הכי חשוב?</h2>
            <p>
              Customer Lifetime Value (CLV) הוא המדד הכי חשוב בעסק data-driven. הוא עונה על
              השאלה: "כמה ₪ אני יכול להוציא על גיוס לקוח חדש ועדיין להרוויח?". בעסקי SaaS,
              שירותים ו-E-commerce, CLV הוא הבסיס לכל החלטות השיווק, התמחור, ושימור הלקוחות.
            </p>

            <h2>הנוסחה</h2>
            <div className="bg-blue-50 border-r-4 border-blue-600 p-4 my-4">
              <p className="font-mono text-base text-blue-900">
                CLV = ARPU × Gross Margin × Customer Lifespan - CAC
              </p>
              <p className="text-sm text-blue-700 mt-2">
                או עם Churn: CLV = (ARPU × Margin) / Monthly Churn Rate - CAC
              </p>
            </div>

            <h2>המדדים החשובים</h2>
            <ul>
              <li>
                <strong>ARPU</strong> (Average Revenue Per User) - הכנסה ממוצעת ללקוח/חודש
              </li>
              <li>
                <strong>Gross Margin</strong> - שיעור הרווח הגולמי
              </li>
              <li>
                <strong>Customer Lifespan</strong> - אורך חיים ממוצע של לקוח
              </li>
              <li>
                <strong>CAC</strong> (Customer Acquisition Cost) - עלות גיוס לקוח
              </li>
              <li>
                <strong>Churn Rate</strong> - אחוז לקוחות שעוזבים (חודשי/שנתי)
              </li>
              <li>
                <strong>LTV/CAC Ratio</strong> - יחס שווי לעלות (היעד 3+)
              </li>
              <li>
                <strong>Payback Period</strong> - זמן עד החזר ההשקעה (חודשים)
              </li>
            </ul>

            <h2>בנצ\'מארקים לפי תעשייה</h2>
            <table className="w-full text-sm border-collapse my-4">
              <thead>
                <tr className="bg-blue-50">
                  <th className="border border-gray-300 p-2 text-right">תעשייה</th>
                  <th className="border border-gray-300 p-2 text-right">LTV/CAC יעד</th>
                  <th className="border border-gray-300 p-2 text-right">Payback יעד</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 p-2">SaaS B2B</td>
                  <td className="border border-gray-300 p-2">3-5x</td>
                  <td className="border border-gray-300 p-2">12-18 חודשים</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2">E-commerce</td>
                  <td className="border border-gray-300 p-2">2-3x</td>
                  <td className="border border-gray-300 p-2">6-12 חודשים</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2">Mobile App</td>
                  <td className="border border-gray-300 p-2">2-4x</td>
                  <td className="border border-gray-300 p-2">3-9 חודשים</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2">שירותים מקצועיים</td>
                  <td className="border border-gray-300 p-2">4-10x</td>
                  <td className="border border-gray-300 p-2">3-6 חודשים</td>
                </tr>
              </tbody>
            </table>

            <h2>איך משפרים LTV/CAC?</h2>
            <h3>הגדלת LTV</h3>
            <ol>
              <li>Upselling - מעבר לתוכניות יקרות יותר</li>
              <li>Cross-selling - הוספת מוצרים נוספים</li>
              <li>הקטנת Churn - שימור לקוחות (עיקר ב-SaaS)</li>
              <li>הגדלת Order Frequency (E-commerce)</li>
              <li>שיפור Gross Margin - יעילות תפעולית</li>
              <li>Premium tiers עם ערך מוסף</li>
            </ol>

            <h3>הקטנת CAC</h3>
            <ol>
              <li>אופטימיזציה של ערוצי שיווק (קיצוץ בערוצים יקרים)</li>
              <li>הגדלת Conversion Rate בכל שלב במשפך</li>
              <li>Referral Programs - לקוחות מביאים לקוחות</li>
              <li>SEO ותוכן (טווח ארוך - CAC נמוך)</li>
              <li>אוטומציה במכירות</li>
              <li>פוקוס על ICP (Ideal Customer Profile) במקום הרחבה</li>
            </ol>
          </>
        }
        faq={<FAQ items={faqItems} />}
        sources={
          <ul className="space-y-2 text-blue-700">
            <li>
              <span>בנצ\'מארקים מבוססי דוחות SaaS Capital, Bain & Co, OpenView Partners</span>
            </li>
          </ul>
        }
      />
    </>
  );
}
