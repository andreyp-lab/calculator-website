import { Metadata } from 'next';
import Link from 'next/link';
import { CalculatorLayout } from '@/components/calculator/CalculatorLayout';
import { LeasingCalculator } from '@/components/calculators/LeasingCalculator';

export const metadata: Metadata = {
  title: 'ליסינג vs קנייה - השוואה מקיפה לרכב 2026',
  description:
    'איזה אופן רכישת רכב משתלם? השוואה מלאה בין ליסינג, מימון וקנייה במזומן. כולל TCO לטווח 5 שנים.',
  alternates: { canonical: '/compare/leasing-vs-buying-comparison' },
};

export default function LeasingVsBuyingComparePage() {
  return (
    <CalculatorLayout
      title="ליסינג vs קנייה - השוואה מקיפה"
      description="השוואת 3 אופנים לרכישת רכב: ליסינג תפעולי, מימון ארוך טווח, וקנייה במזומן. כולל ניתוח TCO."
      breadcrumbs={[
        { label: 'דף הבית', href: '/' },
        { label: 'דפי השוואה', href: '/compare' },
        { label: 'ליסינג vs קנייה' },
      ]}
      lastUpdated="2026-05-04"
      calculator={<LeasingCalculator />}
      content={
        <>
          <h2>3 אופני רכישת רכב</h2>
          <p>
            לפני שקונים רכב חדש, חשוב להבין את ההבדלים בין שלוש אופציות עיקריות. כל אחת
            מתאימה למצב פיננסי שונה ואורח חיים שונה.
          </p>

          <h2>השוואת אופציות</h2>
          <table className="w-full text-sm border-collapse my-4">
            <thead>
              <tr className="bg-blue-50">
                <th className="border border-gray-300 p-3 text-right">קריטריון</th>
                <th className="border border-gray-300 p-3 text-right">🚗 קנייה במזומן</th>
                <th className="border border-gray-300 p-3 text-right">💳 מימון/הלוואה</th>
                <th className="border border-gray-300 p-3 text-right">📋 ליסינג תפעולי</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 p-3 font-semibold">תשלום ראשוני</td>
                <td className="border border-gray-300 p-3">100% ממחיר הרכב</td>
                <td className="border border-gray-300 p-3">10-30%</td>
                <td className="border border-gray-300 p-3">0-20%</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="border border-gray-300 p-3 font-semibold">תשלום חודשי</td>
                <td className="border border-gray-300 p-3">0 ₪ (אחרי הקנייה)</td>
                <td className="border border-gray-300 p-3">החזר משכנתא</td>
                <td className="border border-gray-300 p-3">דמי ליסינג קבועים</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-3 font-semibold">בעלות</td>
                <td className="border border-gray-300 p-3">מיידית</td>
                <td className="border border-gray-300 p-3">בסוף ההלוואה</td>
                <td className="border border-gray-300 p-3">לא - תמיד שייך לחברה</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="border border-gray-300 p-3 font-semibold">תחזוקה</td>
                <td className="border border-gray-300 p-3">על הבעלים</td>
                <td className="border border-gray-300 p-3">על הבעלים</td>
                <td className="border border-gray-300 p-3">כלולה ✓</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-3 font-semibold">ביטוח</td>
                <td className="border border-gray-300 p-3">על הבעלים</td>
                <td className="border border-gray-300 p-3">על הבעלים</td>
                <td className="border border-gray-300 p-3">לרוב כלול</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="border border-gray-300 p-3 font-semibold">פחת/ירידת ערך</td>
                <td className="border border-gray-300 p-3">סיכון על הבעלים</td>
                <td className="border border-gray-300 p-3">סיכון על הבעלים</td>
                <td className="border border-gray-300 p-3">סיכון על החברה</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-3 font-semibold">גמישות</td>
                <td className="border border-gray-300 p-3">בלתי מוגבלת</td>
                <td className="border border-gray-300 p-3">מוגבלת עד סיום החוב</td>
                <td className="border border-gray-300 p-3">קשור לחוזה (3-5 שנים)</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="border border-gray-300 p-3 font-semibold">החלפה תכופה</td>
                <td className="border border-gray-300 p-3">קשה (מכירה + קנייה)</td>
                <td className="border border-gray-300 p-3">קשה</td>
                <td className="border border-gray-300 p-3">קלה (סוף חוזה)</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-3 font-semibold">הוצאה מוכרת לעצמאי</td>
                <td className="border border-gray-300 p-3">פחת על הרכב</td>
                <td className="border border-gray-300 p-3">פחת + ריבית</td>
                <td className="border border-gray-300 p-3">100% מוכר!</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="border border-gray-300 p-3 font-semibold">קילומטראז'</td>
                <td className="border border-gray-300 p-3">בלתי מוגבל</td>
                <td className="border border-gray-300 p-3">בלתי מוגבל</td>
                <td className="border border-gray-300 p-3">מוגבל בחוזה</td>
              </tr>
            </tbody>
          </table>

          <h2>למי כל אחד מתאים?</h2>

          <h3>🚗 קנייה במזומן - למי?</h3>
          <ul>
            <li>יש הון פנוי ולא רוצה הוצאות חודשיות</li>
            <li>נוהג הרבה (50K+ ק"מ/שנה)</li>
            <li>תכנון לטווח ארוך (10+ שנים עם אותו רכב)</li>
            <li>רוצה גמישות מלאה</li>
          </ul>

          <h3>💳 מימון - למי?</h3>
          <ul>
            <li>אין הון פנוי אבל יש הכנסה יציבה</li>
            <li>תכנון להחזיק את הרכב 5+ שנים</li>
            <li>נוהג הרבה (אין מגבלת ק"מ)</li>
            <li>רוצה את הבעלות המלאה בסוף</li>
          </ul>

          <h3>📋 ליסינג - למי?</h3>
          <ul>
            <li>מעדיף עלות חודשית קבועה</li>
            <li>משתמש בתחזוקה / לא רוצה להתעסק</li>
            <li>נוהג בערים (פחות מ-25K ק"מ/שנה)</li>
            <li>אוהב להחליף רכב כל 3-5 שנים</li>
            <li>עצמאי שרוצה הוצאה מוכרת מקסימלית</li>
          </ul>

          <h2>חישוב TCO (Total Cost of Ownership) ל-5 שנים</h2>
          <div className="bg-blue-50 border-r-4 border-blue-600 p-4 my-4 text-sm">
            <p className="font-semibold mb-2">דוגמה: רכב משפחתי 200K ₪</p>
            <ul className="space-y-1">
              <li>קנייה במזומן: 200K + תחזוקה 30K + ביטוח 20K - שווי בסוף 100K = <strong>150K ₪</strong></li>
              <li>מימון 10%/5 שנים: 230K + 30K + 20K - 100K = <strong>180K ₪</strong></li>
              <li>ליסינג 3,500/חודש: 210K (כולל תחזוקה וביטוח) = <strong>210K ₪</strong></li>
            </ul>
            <p className="mt-2">קנייה במזומן הכי זול - אך דורש את ההון הראשוני.</p>
          </div>

          <h2>טיפים מקצועיים</h2>
          <ul>
            <li>לעצמאיים - ליסינג מאפשר 100% הוצאה מוכרת</li>
            <li>למי שעושה הרבה ק"מ - קנייה משתלמת יותר (אין מגבלות)</li>
            <li>אם יש הון פנוי - מזומן עדיף מהבחינה הכלכלית</li>
            <li>במכוניות חשמליות - בדוק תמריצים מיוחדים בליסינג</li>
            <li>במכוניות יוקרה - ליסינג מקטין סיכון פחת מהיר</li>
          </ul>

          <h2>חישוב ספציפי</h2>
          <p>
            השתמש ב<Link href="/vehicles/leasing-vs-buying" className="text-blue-600 underline">המחשבון המפורט</Link>{' '}
            למטה כדי להזין את הנתונים הספציפיים שלך ולקבל ניתוח מדויק.
          </p>
        </>
      }
    />
  );
}
