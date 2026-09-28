import type { Metadata } from 'next';
import Link from 'next/link';
import { VerifiedPurchaseTaxCalculator } from '@/components/calculators/VerifiedPurchaseTaxCalculator';

export const metadata: Metadata = {
  title: 'מס רכישה 2026 — מדרגות ומחשבון',
  description: 'אומדן מס רכישה לדירה יחידה, דירה נוספת ולעולה הזכאי לדירה יחידה לפי הוראת רשות המסים 1/2026.',
  alternates: { canonical: '/real-estate/purchase-tax' },
};

export default function PurchaseTaxPage() {
  return <main dir="rtl" className="mx-auto max-w-4xl px-5 py-12 text-ink">
    <nav className="mb-8 text-sm text-ink/60"><Link href="/">דף הבית</Link> / <Link href="/real-estate">נדל״ן</Link></nav>
    <h1 className="mb-5 text-3xl font-bold">מס רכישה 2026</h1>
    <p className="leading-relaxed">מס הרכישה תלוי בשווי הדירה ובסיווג העסקה. מדרגות דירה יחידה לתושב ישראל: פטור עד 1,978,745 ₪; 3.5% על החלק עד 2,347,040 ₪; 5% עד 6,055,070 ₪; 8% עד 20,183,565 ₪; ו־10% מעל. לדירה נוספת שיעור 8% עד 6,055,070 ₪ ו־10% מעבר לכך (הוראת השעה הקיימת עד 31 בדצמבר 2026).</p>
    <VerifiedPurchaseTaxCalculator />
    <h2 className="mb-3 mt-10 text-2xl font-bold">הקלה לעולים</h2>
    <p className="leading-relaxed">לפי תקנה 12א, עולה העומד בתנאים הרוכש דירת מגורים יחידה נהנה מפטור עד 1,978,745 ₪, משיעור 0.5% על החלק עד 6,055,070 ₪, ומשיעור 8% על החלק עד 20,183,565 ₪. מעל התקרה האחרונה ההקלה אינה חלה. למסלול הוותיק לפי תקנה 12 ולזכאות של מי שעלו לפני אוגוסט 2024 עשויים לחול כללים אחרים. תושב חוזר אינו מקבל אוטומטית את ההטבה הזו.</p>
    <p className="mt-4 leading-relaxed">למשל, לעולה זכאי בדירה יחידה של 3 מיליון ₪, האומדן במסלול 12א הוא כ־5,106 ₪. בדירה יחידה רגילה באותו שווי האומדן הוא כ־45,538 ₪. יש לבדוק את הסיווג, מועד העלייה והעסקה באופן אישי.</p>
    <h2 className="mb-3 mt-10 text-2xl font-bold">מקרים אישיים</h2>
    <p className="leading-relaxed">משפרי דיור, בעלי דירה חלקית, רכישות משותפות, מתנות, נכות ורכישת נכס שאינו דירת מגורים דורשים בדיקת תנאים ומועדים נפרדת. המחשבון כאן אינו מחשב את הזכאות האישית שלהם. לצורך החלטה או דיווח השתמשו <a className="text-gold underline" href="https://www.gov.il/he/service/real_eatate_taxsimulator" target="_blank" rel="noopener noreferrer">בסימולטור רשות המסים</a> ובייעוץ מתאים.</p>
    <p className="mt-8 text-sm text-ink/70">מקור: <a className="underline" href="https://www.gov.il/BlobFolder/policy/inst-01-2026/he/realestate_inst-01-2026.pdf" target="_blank" rel="noopener noreferrer">הוראת ביצוע מיסוי מקרקעין 1/2026</a>.</p>
  </main>;
}
