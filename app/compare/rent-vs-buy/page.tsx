import { Metadata } from 'next';
import Link from 'next/link';
import { CalculatorLayout } from '@/components/calculator/CalculatorLayout';
import { MortgageCalculator } from '@/components/calculators/MortgageCalculator';

export const metadata: Metadata = {
  title: 'שכירות vs קנייה - מה משתלם יותר? 2026',
  description:
    'השוואה מתמטית בין שכירות לקנייה של דירה בישראל. כולל משכנתא, ארנונה, עליית שווי, וניתוח לטווח ארוך.',
  alternates: { canonical: '/compare/rent-vs-buy' },
};

export default function RentVsBuyComparePage() {
  return (
    <CalculatorLayout
      title="שכירות vs קנייה - איזה יותר משתלם?"
      description="ההחלטה הגדולה: לקנות דירה או להמשיך לשכור? השוואה מקיפה כולל עלויות, יתרונות וחסרונות לטווח קצר וארוך."
      breadcrumbs={[
        { label: 'דף הבית', href: '/' },
        { label: 'דפי השוואה', href: '/compare' },
        { label: 'שכירות vs קנייה' },
      ]}
      lastUpdated="2026-05-04"
      calculator={<MortgageCalculator />}
      content={
        <>
          <h2>הדילמה הגדולה של כל ישראלי</h2>
          <p>
            לקנות דירה זה החלום הישראלי. אבל האם זה תמיד משתלם כלכלית? עלייה גבוהה במחירי
            הדירות, ריבית גבוהה על משכנתא, ומחירי שכירות שעולים - כל אלה משפיעים על ההחלטה.
            הנה השוואה מפורטת.
          </p>

          <h2>השוואת עלויות חודשיות (דירה 2.5M ₪)</h2>
          <table className="w-full text-sm border-collapse my-4">
            <thead>
              <tr className="bg-blue-50">
                <th className="border border-gray-300 p-3 text-right">סעיף</th>
                <th className="border border-gray-300 p-3 text-right">קנייה</th>
                <th className="border border-gray-300 p-3 text-right">שכירות</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 p-3">משכנתא חודשית</td>
                <td className="border border-gray-300 p-3">~10,500 ₪ (פריים+1.5%)</td>
                <td className="border border-gray-300 p-3">-</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="border border-gray-300 p-3">שכר דירה</td>
                <td className="border border-gray-300 p-3">-</td>
                <td className="border border-gray-300 p-3">~7,500-8,500 ₪</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-3">ארנונה</td>
                <td className="border border-gray-300 p-3">~600-1,200 ₪</td>
                <td className="border border-gray-300 p-3">~600-1,200 ₪</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="border border-gray-300 p-3">ועד בית</td>
                <td className="border border-gray-300 p-3">~250-500 ₪</td>
                <td className="border border-gray-300 p-3">~250-500 ₪</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-3">תחזוקה ותיקונים</td>
                <td className="border border-gray-300 p-3">~500-1,000 ₪</td>
                <td className="border border-gray-300 p-3">בעל הבית</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="border border-gray-300 p-3">ביטוח דירה</td>
                <td className="border border-gray-300 p-3">~150 ₪</td>
                <td className="border border-gray-300 p-3">~50 ₪ (תכולה)</td>
              </tr>
              <tr className="bg-blue-100 font-bold">
                <td className="border border-gray-300 p-3">סה"כ חודשי משוער</td>
                <td className="border border-gray-300 p-3">~12,000-13,500 ₪</td>
                <td className="border border-gray-300 p-3">~8,500-10,000 ₪</td>
              </tr>
            </tbody>
          </table>

          <h2>אבל זה לא רק העלות החודשית!</h2>

          <h3>יתרונות הקנייה</h3>
          <ul>
            <li>
              <strong>בניית הון</strong> - חלק מהמשכנתא הופך להון אישי
            </li>
            <li>
              <strong>עלייה בשווי</strong> - היסטורית: 5-7%/שנה (בערך)
            </li>
            <li>
              <strong>יציבות</strong> - אין סיכון פינוי
            </li>
            <li>
              <strong>גמישות שימוש</strong> - שיפוצים, הרחבות
            </li>
            <li>
              <strong>הגנה מאינפלציה</strong> - הנכס "צמוד" למחיר השוק
            </li>
          </ul>

          <h3>יתרונות השכירות</h3>
          <ul>
            <li>
              <strong>ניידות</strong> - קל להחליף עיר/שכונה
            </li>
            <li>
              <strong>תזרים פנוי</strong> - אין הון מושקע
            </li>
            <li>
              <strong>אין סיכון</strong> - בעל הבית מתקן
            </li>
            <li>
              <strong>אפשרויות השקעה אחרות</strong> - 500K הון עצמי שמושקע במניות יכול לתת תשואה דומה
            </li>
            <li>
              <strong>פחות התחייבויות</strong> - חופש מבחינה כלכלית
            </li>
          </ul>

          <h2>חישוב מתמטי - מתי קנייה משתלמת?</h2>
          <p>
            הכלל המקובל: <strong>5x Rule</strong>. אם המחיר השנתי לקנייה (משכנתא + ארנונה +
            תחזוקה + מס) הוא יותר מ-5 פעמים שכר הדירה השנתי - השכירות משתלמת. אם פחות מ-5x -
            עדיף לקנות.
          </p>

          <div className="bg-blue-50 border-r-4 border-blue-600 p-4 my-4 text-sm">
            <p className="font-semibold mb-2">דוגמה:</p>
            <p>
              דירה 2.5M ₪. שכ"ד דומה: 8,000 ₪/חודש = 96,000 ₪/שנה. עלות שנתית של קנייה: ~150K
              ₪. יחס = 150K / 96K = 1.56x. <strong>פחות מ-5x = קנייה משתלמת בטווח ארוך.</strong>
            </p>
          </div>

          <h2>שיקולים נוספים</h2>
          <h3>אופק זמן</h3>
          <ul>
            <li>פחות מ-5 שנים → שכירות (עלויות עסקה גבוהות)</li>
            <li>5-10 שנים → תלוי במחירים</li>
            <li>10+ שנים → קנייה לרוב משתלמת</li>
          </ul>

          <h3>גורמי סיכון</h3>
          <ul>
            <li>אינפלציה גבוהה - מטיב עם בעלי דירות</li>
            <li>ירידת מחירים - מסכן בעלי דירות</li>
            <li>אובדן עבודה - שכירות בטוחה יותר</li>
            <li>שינוי אישי (גירושים, מעבר) - שכירות גמישה</li>
          </ul>

          <h2>חישוב מדויק</h2>
          <p>
            השתמש ב<Link href="/real-estate/mortgage" className="text-blue-600 underline">מחשבון המשכנתא</Link>{' '}
            למטה כדי לחשב בדיוק כמה תשלם בקנייה. אחר כך השווה לשכר דירה שמתאים לאותה דירה
            באותה שכונה.
          </p>
        </>
      }
    />
  );
}
