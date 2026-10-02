import type { Metadata } from 'next';
import { OfficialBenefitPage } from '@/components/verification/OfficialBenefitPage';

export const metadata: Metadata = {
  title: 'טבלת דמי אבטלה לפי גיל 2026 — ימים וסכום',
  description: 'טבלת ימי אבטלה מרביים לפי גיל ומספר תלויים, והפניה למחשבון הסכום הרשמי של הביטוח הלאומי.',
  alternates: { canonical: '/employee-rights/unemployment-benefits' },
};

export default function UnemploymentBenefitsPage() {
  return (
    <OfficialBenefitPage
      title="טבלת דמי אבטלה לפי גיל 2026"
      description="דמי האבטלה מחושבים לפי ההכנסה החייבת בדמי ביטוח בששת החודשים שקדמו לרישום בשירות התעסוקה, עם מדרגות שונות למי שטרם מלאו לו 28. תקרת התשלום היומית בשנת 2026 היא 550.76 ₪ ב-125 הימים הראשונים ו-367.17 ₪ לאחר מכן. תקופת האכשרה הרגילה היא 12 חודשי עבודה מתוך 18 חודשים."
      sourceUrl="https://www.btl.gov.il/Simulators/Pages/AvtalaCalcNew.aspx"
      sourceLabel="למחשבון דמי האבטלה של הביטוח הלאומי"
      details={[
        'הכנסה מכל מקומות העבודה בששת החודשים שלפני הרישום.',
        'גיל, חודשי עבודה ונסיבות סיום ההעסקה.',
        'מועד ההתייצבות בשירות התעסוקה והכנסות נוספות בתקופת האבטלה.',
      ]}
    >
      <section className="mt-10" aria-labelledby="unemployment-days-heading">
        <h2 id="unemployment-days-heading" className="mb-4 text-2xl font-bold">מספר ימי האבטלה המרבי לפי גיל ותלויים</h2>
        <p className="mb-4 leading-relaxed">הטבלה מציגה את המכסה המרבית שמפרסם הביטוח הלאומי. היא אינה קובעת זכאות אישית, ומספר הימים בפועל תלוי גם בתקופת האכשרה, בהתייצבות ובתביעות קודמות.</p>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-right">
            <thead>
              <tr className="bg-cream-2">
                <th scope="col" className="border p-3">גיל</th>
                <th scope="col" className="border p-3">עד 2 תלויים</th>
                <th scope="col" className="border p-3">3 תלויים ויותר</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['עד 25', '50 ימים', '138 ימים'],
                ['25 עד 28', '67 ימים', '138 ימים'],
                ['28 עד 35', '100 ימים', '138 ימים'],
                ['35 עד 45', '138 ימים', '175 ימים'],
                ['45 ומעלה', '175 ימים', '175 ימים'],
              ].map(([age, upToTwo, threeOrMore]) => (
                <tr key={age}>
                  <th scope="row" className="border p-3 font-semibold">{age}</th>
                  <td className="border p-3">{upToTwo}</td>
                  <td className="border p-3">{threeOrMore}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-sm leading-relaxed text-ink/70">לנשים בגיל 57–67 שנולדו מ־1.1.1960 ואילך מפרסם הביטוח הלאומי מכסה של עד 300 ימים בתקופה של 18 חודשים. המקור והחריגים מתעדכנים באתר הביטוח הלאומי.</p>
        <a href="https://www.btl.gov.il/benefits/unemployment/pages/tkufat_zakaut.aspx" target="_blank" rel="noopener noreferrer" className="mt-3 inline-block font-semibold text-gold underline underline-offset-4">מקור: הביטוח הלאומי — תקופת הזכאות ↗</a>
      </section>
    </OfficialBenefitPage>
  );
}
