import type { Metadata } from 'next';
import Link from 'next/link';
import { CalculatorLayout } from '@/components/calculator/CalculatorLayout';
import { FuelCostCalculator } from '@/components/calculators/FuelCostCalculator';
import { FUEL_PRICES_2026 } from '@/lib/calculators/vehicles';
import { MACRO_DATA } from '@/lib/data/macroeconomic-data';

export const metadata: Metadata = {
  title: 'מחשבון עלות נסיעה — בנזין, סולר וחשמל',
  description: 'הזינו קילומטרים בחודש, צריכת אנרגיה ומחיר בפועל כדי להעריך עלות חודשית ושנתית של נסיעה.',
  alternates: { canonical: '/vehicles/fuel-cost' },
};

export default function FuelCostPage() {
  return <CalculatorLayout
    title="מחשבון עלות נסיעה"
    description="אומדן הוצאה לפי נסועה, צריכה ומחיר ליחידת אנרגיה."
    breadcrumbs={[
      { label: 'דף הבית', href: '/' },
      { label: 'רכב ותחבורה', href: '/vehicles' },
      { label: 'עלות נסיעה' },
    ]}
    lastUpdated="2026-10-02"
    quickAnswer={<p>עלות חודשית משוערת = קילומטרים בחודש × צריכה ל־100 קילומטרים ÷ 100 × מחיר לליטר או לקוט״ש. המחירים הראשוניים במחשבון הם נקודת פתיחה: {FUEL_PRICES_2026.gasoline_95} ₪ לליטר בנזין 95 לפי המחיר המרבי שנכנס לתוקף ב־1.10.2026; מחירי בנזין 98, סולר וחשמל הם הנחות דוגמה בלבד. סמנו ״השתמש במחיר מותאם אישית״ והזינו את המחיר בפועל לפני הסתמכות על התוצאה.</p>}
    calculator={<FuelCostCalculator />}
    content={<>
      <h2>איך משתמשים במחשבון?</h2>
      <p>בדקו את הקילומטרים שנסעתם לאחרונה ואת צריכת הרכב בפועל. צריכת החשמל נמדדת בקוט״ש ל־100 ק״מ וצריכת דלק בליטרים ל־100 ק״מ. בעת השוואת טעינה ביתית או ציבורית, הזינו את המחיר שאתם משלמים בפועל; תנאי טעינה יכולים להוסיף עלויות.</p>
      <p>החישוב הוא אומדן להוצאות אנרגיה בלבד. הוא אינו כולל את מחיר הרכב, ביטוח, רישוי, טיפולים, מימון או ירידת ערך. נתוני צריכה של דגם הרכב עשויים להשתנות בנהיגה בפועל.</p>
      <p>מקור למחיר המרבי של בנזין 95 מאוקטובר 2026: <a href={MACRO_DATA.fuelPrices.sourceUrl} target="_blank" rel="noopener noreferrer">הודעת משרד האנרגיה והתשתיות</a>. בעת התדלוק בדקו את המחיר במועד ובתחנה הרלוונטיים.</p>
      <p>להשוואת דרכי רכישה, קראו גם את <Link href="/vehicles/leasing-vs-buying">מדריך ליסינג מול קנייה</Link>.</p>
    </>}
  />;
}
