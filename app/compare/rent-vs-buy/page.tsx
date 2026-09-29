import type { Metadata } from 'next';
import Link from 'next/link';
import { CalculatorLayout } from '@/components/calculator/CalculatorLayout';
import { MortgageCalculator } from '@/components/calculators/MortgageCalculator';

export const metadata: Metadata = {
  title: 'שכירות מול קניית דירה — מדריך להשוואת ההחלטה',
  description: 'אילו נתונים צריך לבדוק כשמשווים שכירות לקניית דירה: תזרים, משכנתא, מס רכישה, תחזוקה, הון עצמי וסיכונים.',
  alternates: { canonical: '/compare/rent-vs-buy' },
};

export default function RentVsBuyComparePage() {
  return <CalculatorLayout
    title="שכירות מול קניית דירה"
    description="מדריך לאיסוף נתונים ולהשוואת החלופות לפי הדירה והנסיבות שלכם."
    breadcrumbs={[
      { label: 'דף הבית', href: '/' },
      { label: 'דפי השוואה', href: '/compare' },
      { label: 'שכירות מול קנייה' },
    ]}
    lastUpdated="2026-09-29"
    pageUrl="/compare/rent-vs-buy"
    quickAnswer={<p>כדאיות השכירות או הקנייה תלויה במחיר הדירה ובשכר הדירה של דירות דומות, בהון העצמי, בתנאי המימון, בעלויות העסקה והתחזוקה ובמשך הזמן שאתם צפויים להתגורר במקום. השוו גם תרחישים שבהם מחיר הדירה, שכר הדירה, הריבית או התשואה על החיסכון משתנים. אין יחס מספרי אחד או מספר שנים קבוע שקובעים איזו חלופה עדיפה.</p>}
    calculator={<section aria-labelledby="mortgage-estimate-title" className="space-y-4">
      <h2 id="mortgage-estimate-title" className="text-2xl font-bold text-ink">אומדן החזר למסלול משכנתא אחד</h2>
      <p className="leading-relaxed text-ink/75">המחשבון הבא מציג החזר למסלול יחיד בריבית קבועה שהזנתם. הוא אינו משווה את עלות הקנייה לשכירות, אינו מחשב הצמדה למדד או שינויי ריבית, ואינו כולל את יתר עלויות העסקה והבעלות.</p>
      <MortgageCalculator />
    </section>}
    content={<>
      <h2>נתונים שצריך לאסוף</h2>
      <table>
        <thead><tr><th>נתון</th><th>שכירות</th><th>קנייה</th></tr></thead>
        <tbody>
          <tr><td>תשלום שוטף</td><td>דמי שכירות ותנאי עדכון בחוזה</td><td>החזרי משכנתא לפי האישור העקרוני, ביטוחים ותשלומים שוטפים</td></tr>
          <tr><td>תשלום ראשוני</td><td>פיקדון ועלויות מעבר לפי החוזה</td><td>הון עצמי, מס רכישה אם חל ועלויות עסקה</td></tr>
          <tr><td>תחזוקה</td><td>חלוקת האחריות לתיקונים לפי החוזה</td><td>תחזוקת בעלים ותיקונים צפויים</td></tr>
          <tr><td>בסוף התקופה</td><td>התשלומים ששולמו וההון שנותר להשקעה</td><td>שווי מכירה אפשרי בניכוי יתרת הלוואה ועלויות מכירה</td></tr>
        </tbody>
      </table>
      <p>בדקו את המחירים והתנאים בפועל לדירות דומות ובאותה שכונה. תשלום המשכנתא כולל החזר קרן וריבית; אין להשוות את מלוא התשלום לדמי שכירות כאילו כולו הוצאה שאינה יוצרת הון. מנגד, שווי מכירה עתידי או תשואת השקעה חלופית אינם מובטחים.</p>
      <h2>איך בונים תרחישים?</h2>
      <ol>
        <li>קבעו תקופת השוואה שמתאימה לתוכניות האישיות שלכם.</li>
        <li>השוו את התזרים והיתרה בסוף התקופה, כולל הוצאות חד פעמיות, תחזוקה ויתרת המשכנתא.</li>
        <li>בדקו תרחיש בסיס ולצדו שינויי ריבית, שכר דירה, מחיר מכירה והוצאות בלתי צפויות.</li>
        <li>ודאו שהחלופה שתבחרו משאירה מרווח בטוח בהוצאות השוטפות.</li>
      </ol>
      <h2>מקורות וכלים לבדיקת הנתונים</h2>
      <p>התחילו ב<a href="https://haotzarsheli.mof.gov.il/LifeState/Pages/Apartment-Price.aspx" target="_blank" rel="noopener noreferrer">מדריך משרד האוצר לעלויות רכישת דירה</a>. את תנאי המשכנתא השוו באמצעות אישור עקרוני והמידע על מסלולים וריביות ב<a href="https://www.boi.org.il/information/bank-paymnts/financial-education/%D7%94%D7%A8%D7%A4%D7%95%D7%A8%D7%9E%D7%94-%D7%9C%D7%94%D7%92%D7%91%D7%A8%D7%AA-%D7%A9%D7%A7%D7%99%D7%A4%D7%95%D7%AA-%D7%94%D7%9E%D7%99%D7%93%D7%A2-%D7%95%D7%94%D7%AA%D7%97%D7%A8%D7%95%D7%AA-%D7%91%D7%9E%D7%A9%D7%9B%D7%A0%D7%AA%D7%90%D7%95%D7%AA/" target="_blank" rel="noopener noreferrer">מדריך בנק ישראל להשוואת משכנתאות</a>. לבדיקת מס רכישה לפי פרטי העסקה אפשר להיעזר ב<Link href="/real-estate/purchase-tax">מדרגות ובמחשבון מס הרכישה</Link> ולאמת את הזכאות והסכום ב<a href="https://www.gov.il/he/service/real_eatate_taxsimulator" target="_blank" rel="noopener noreferrer">סימולטור רשות המסים</a>.</p>
    </>}
  />;
}
