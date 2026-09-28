import type { Metadata } from 'next';
import { OfficialBenefitPage } from '@/components/verification/OfficialBenefitPage';

export const metadata: Metadata = {
  title: 'דמי לידה 2026 — זכאות וחישוב רשמי בביטוח הלאומי',
  description: 'דמי לידה בשנת 2026: תקופות זכאות, תקרה יומית וקישור לחישוב האישי של הביטוח הלאומי.',
  alternates: { canonical: '/employee-rights/maternity-benefits' },
};

export default function MaternityBenefitsPage() {
  return (
    <OfficialBenefitPage
      title="דמי לידה — כמה מגיע לך?"
      description="לפי הביטוח הלאומי, דמי הלידה מחושבים מהשכר בשלושת או בששת החודשים המלאים שקדמו להפסקת העבודה, לפי הגבוה מביניהם. התקרה החל מינואר 2026 היא 1,752.33 ₪ ליום. זכאות מלאה היא ל־105 ימים לאחר תקופת אכשרה של 10 מתוך 14 חודשים או 15 מתוך 22; זכאות חלקית היא ל־56 ימים לאחר 6 מתוך 14. בלידה מרובת עוברים ובאשפוז עשויה לחול הארכה בתנאים מוגדרים. מדמי הלידה מנוכים מס הכנסה, דמי ביטוח לאומי ודמי בריאות."
      sourceUrl="https://www.btl.gov.il/Simulators/Pages/DmeyLedaCalc.aspx"
      sourceLabel="למחשבון דמי הלידה של הביטוח הלאומי"
      details={[
        'חודשי עבודה ותשלום דמי ביטוח לפני הפסקת העבודה, לרבות תקופות שעשויות להיכלל באכשרה.',
        'שכר בשלושת ובששת החודשים המלאים שלפני הפסקת העבודה; לעצמאית גם נתוני מקדמות ושומות.',
        'נתוני לידה מרובת עוברים או אשפוז, אם רלוונטיים, ובדיקת תנאי ההארכה בנפרד.',
      ]}
      related={[{ href: '/blog/maternity-benefits-complete-guide-2026', label: 'מדריך דמי לידה' }]}
    />
  );
}
