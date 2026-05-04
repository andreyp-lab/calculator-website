import { Metadata } from 'next';
import Link from 'next/link';
import { CalculatorLayout } from '@/components/calculator/CalculatorLayout';
import { CorpVsIndividualCalculator } from '@/components/calculators/CorpVsIndividualCalculator';

export const metadata: Metadata = {
  title: 'שכיר vs עצמאי - השוואה מלאה 2026',
  description:
    'איזה מסלול תעסוקה משתלם יותר? השוואה מלאה בין שכיר לעצמאי - מס הכנסה, ב.ל., יציבות, הטבות, פנסיה, חופשה ועוד.',
  alternates: { canonical: '/compare/employee-vs-self-employed' },
};

export default function EmployeeVsSelfEmployedComparePage() {
  return (
    <CalculatorLayout
      title="שכיר vs עצמאי - השוואה מקיפה"
      description="ההחלטה הגדולה: לעבוד בתור שכיר עם הטבות וביטחון, או לפתוח עצמאי עם הכנסה גבוהה יותר ופחות מסים? השוואה מלאה."
      breadcrumbs={[
        { label: 'דף הבית', href: '/' },
        { label: 'דפי השוואה', href: '/compare' },
        { label: 'שכיר vs עצמאי' },
      ]}
      lastUpdated="2026-05-04"
      calculator={<CorpVsIndividualCalculator />}
      content={
        <>
          <h2>השאלה הגדולה: שכיר או עצמאי?</h2>
          <p>
            זוהי אחת ההחלטות החשובות ביותר בקריירה. ההחלטה משפיעה על המס שתשלם, על היציבות
            הכלכלית שלך, על הזמן הפנוי, ועל הפוטנציאל הכלכלי לטווח ארוך. הנה השוואה מלאה
            לפי כל הקריטריונים החשובים.
          </p>

          <h2>השוואה מקיפה - שכיר מול עצמאי</h2>

          <div className="overflow-x-auto my-6">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-blue-50">
                  <th className="border border-gray-300 p-3 text-right font-bold">קריטריון</th>
                  <th className="border border-gray-300 p-3 text-right font-bold text-blue-900">
                    👔 שכיר
                  </th>
                  <th className="border border-gray-300 p-3 text-right font-bold text-emerald-900">
                    💼 עצמאי
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 p-3 font-semibold">מס הכנסה</td>
                  <td className="border border-gray-300 p-3">10%-50% (לפי מדרגות)</td>
                  <td className="border border-gray-300 p-3">10%-50% (זהה)</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 p-3 font-semibold">ביטוח לאומי</td>
                  <td className="border border-gray-300 p-3">~5% (עובד)</td>
                  <td className="border border-gray-300 p-3">~16% (לבד)</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-3 font-semibold">פנסיה חובה</td>
                  <td className="border border-gray-300 p-3">12.5% מהמעסיק</td>
                  <td className="border border-gray-300 p-3">חובה להפקיד עצמית</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 p-3 font-semibold">קרן השתלמות</td>
                  <td className="border border-gray-300 p-3">7.5% מהמעסיק (פטור ממס)</td>
                  <td className="border border-gray-300 p-3">עצמאית - תקרה 18,840 ₪</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-3 font-semibold">פיצויי פיטורין</td>
                  <td className="border border-gray-300 p-3">חובה - חודש לכל שנה</td>
                  <td className="border border-gray-300 p-3">אין</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 p-3 font-semibold">דמי הבראה</td>
                  <td className="border border-gray-300 p-3">5-10 ימים בשנה</td>
                  <td className="border border-gray-300 p-3">אין</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-3 font-semibold">חופשה</td>
                  <td className="border border-gray-300 p-3">12-26 ימים בתשלום</td>
                  <td className="border border-gray-300 p-3">חופשה ללא תשלום</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 p-3 font-semibold">דמי מחלה</td>
                  <td className="border border-gray-300 p-3">18 ימים מהמעסיק</td>
                  <td className="border border-gray-300 p-3">דמי מחלה מב.ל. (עם תקופת המתנה)</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-3 font-semibold">דמי לידה</td>
                  <td className="border border-gray-300 p-3">15 שבועות בתשלום מלא</td>
                  <td className="border border-gray-300 p-3">לפי הצהרת הכנסות (לרוב נמוך)</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 p-3 font-semibold">דמי אבטלה</td>
                  <td className="border border-gray-300 p-3">זכאי אחרי 360 ימי עבודה</td>
                  <td className="border border-gray-300 p-3">אין</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-3 font-semibold">הוצאות מוכרות</td>
                  <td className="border border-gray-300 p-3">לא רלוונטי</td>
                  <td className="border border-gray-300 p-3">חלק גדול מהוצאות הופך מוכר</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 p-3 font-semibold">יציבות הכנסה</td>
                  <td className="border border-gray-300 p-3">גבוהה מאוד</td>
                  <td className="border border-gray-300 p-3">תנודתית</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-3 font-semibold">פוטנציאל הכנסה</td>
                  <td className="border border-gray-300 p-3">תקרה לרוב 30K-50K/חודש</td>
                  <td className="border border-gray-300 p-3">בלתי מוגבל - לפי המאמץ</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 p-3 font-semibold">בירוקרטיה</td>
                  <td className="border border-gray-300 p-3">המעסיק עושה הכל</td>
                  <td className="border border-gray-300 p-3">הרבה ניירת + רואה חשבון</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-3 font-semibold">חופש בעבודה</td>
                  <td className="border border-gray-300 p-3">מוגבל - יש בוס</td>
                  <td className="border border-gray-300 p-3">חופש מלא</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2>נטו לכיס - מי משתלם יותר?</h2>
          <p>
            הכלל הפשוט: ב<strong>הכנסות נמוכות (עד 12K/חודש)</strong> - שכיר משתלם יותר, כי
            הטבות הסוציאליות שווה הרבה יחסית. ב<strong>הכנסות גבוהות (מעל 25K)</strong> -
            עצמאי או חברה בע"מ משתלמים יותר, כי שיעור המס המצרפי נמוך יותר וניתן להזרים יותר
            הוצאות.
          </p>

          <h2>שיקולים שאינם פיננסיים</h2>
          <h3>בעד שכיר</h3>
          <ul>
            <li>יציבות הכנסה - משכורת חודשית קבועה</li>
            <li>ביטחון - לא תלוי בלקוחות</li>
            <li>קצב חיים - שעות עבודה מוגדרות</li>
            <li>אין בעלות על הסיכונים העסקיים</li>
            <li>קצבאות חברתיות גבוהות (לידה, אבטלה)</li>
          </ul>

          <h3>בעד עצמאי</h3>
          <ul>
            <li>חופש - בחירת לקוחות, פרויקטים, שעות</li>
            <li>פוטנציאל הכנסה גבוה</li>
            <li>הטבות מס - הוצאות מוכרות</li>
            <li>קריירה אישית - בניית מותג</li>
            <li>אפשרות לסיב את העסק (בנייה לטווח ארוך)</li>
          </ul>

          <h2>מתי לעבור מעצמאי לחברה בע"מ?</h2>
          <p>
            בהכנסות שנתיות מעל 350K-450K ₪, חברה בע"מ הופכת ליעילה יותר ממס. ראה את{' '}
            <Link href="/self-employed/corporation-vs-individual" className="text-blue-600 underline">
              המחשבון המפורט
            </Link>{' '}
            להחלטה.
          </p>

          <h2>איך עוברים מעצמאי לשכיר (וההפך)?</h2>
          <p>
            <strong>משכיר לעצמאי</strong>: התפטרות, הקמת תיק במס הכנסה, מע"מ, ב.ל., פתיחת
            חשבון בנק עסקי. זמן: 2-4 שבועות.
          </p>
          <p>
            <strong>מעצמאי לשכיר</strong>: סגירת תיקים (במהלך 6 חודשים), המשך הפקדות פנסיה
            וקרן השתלמות בלבד. זמן: 1-3 חודשים.
          </p>
        </>
      }
    />
  );
}
