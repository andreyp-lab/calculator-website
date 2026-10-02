import type { Metadata } from 'next';
import Link from 'next/link';
import { CalculatorLayout } from '@/components/calculator/CalculatorLayout';
import { VatBasicCalculator } from '@/components/calculators/VatBasicCalculator';

const RATE_HISTORY = 'https://www.gov.il/he/pages/vat-history';
const VAT_REPORT = 'https://www.gov.il/he/service/reporting-or-payment-of-vat-reports';
const INVOICE_ISRAEL = 'https://www.gov.il/he/pages/minisite-israel-invoice-200324';
const EXEMPT_REGISTRATION = 'https://www.gov.il/he/service/request-open-exempt-dealer-via-internet';

export const metadata: Metadata = {
  title: 'מחשבון מע״מ 2026 — הוספה וחילוץ בשיעור 18%',
  description: 'חישוב חשבוני של הוספה וחילוץ מע״מ בשיעור הרגיל; מידע רשמי על דיווח, עוסק פטור ומספרי הקצאה.',
  alternates: { canonical: '/self-employed/vat' },
};

export default function VatPage() {
  return (
    <CalculatorLayout
      pageUrl="/self-employed/vat"
      title="מחשבון מע״מ 2026"
      description="הוספה וחילוץ של מע״מ בשיעור הרגיל. לפני דיווח או הפקת חשבונית, בדקו את כללי העסקה והמועד מול רשות המסים."
      breadcrumbs={[{ label: 'דף הבית', href: '/' }, { label: 'עצמאים', href: '/self-employed' }, { label: 'מע״מ' }]}
      lastUpdated="2026-09-28"
      quickAnswer={<p>שיעור המע״מ הרגיל הוא <strong>18%</strong> מאז 1 בינואר 2025. לסכום לפני מע״מ מוסיפים 18%; כדי לחלץ מע״מ מסכום הכולל אותו, מחלקים את הסכום ב־1.18. החישוב תקף כשעל העסקה חל השיעור הרגיל. <a href={RATE_HISTORY} target="_blank" rel="noopener noreferrer" className="text-gold underline">היסטוריית שיעורי מע״מ ברשות המסים ↗</a></p>}
      calculator={<VatBasicCalculator />}
      content={<>
        <h2>מה הכלי מחשב?</h2>
        <p>למשל, עבור 1,000 ₪ לפני מע״מ, המס הוא 180 ₪ והסכום כולל מע״מ הוא 1,180 ₪. מתוך 1,180 ₪ הכוללים מע״מ בשיעור 18%, חלק המע״מ הוא 180 ₪. חישוב זה אינו קובע באיזה שיעור חייבת עסקה מסוימת או מתי נוצר החיוב במס.</p>
        <h2>דיווח תקופתי וניכוי תשומות</h2>
        <p>תקופת הדיווח נקבעת לעוסק; היא אינה בהכרח דו־חודשית. לפי שירות רשות המסים, דיווח ותשלום מקוון של דוח מע״מ תקופתי אפשריים בדרך כלל עד 19 בחודש, במקום עד 15 בדיווח רגיל. לדיווח מפורט עשויים לחול כללים ומועדים אחרים. הסכום שניתן לנכות כתשומות תלוי בחשבוניות, בסוג העסקה ובכללי הניכוי; הכלי כאן אינו מחשב יתרה לתשלום בדוח.</p>
        <p><a href={VAT_REPORT} target="_blank" rel="noopener noreferrer" className="text-gold underline">הוראות דיווח ותשלום ברשות המסים ↗</a></p>
        <h2>עוסק פטור וחשבוניות ישראל</h2>
        <p>התקרה לפתיחת תיק עוסק פטור בשנת 2026 היא 122,833 ₪ של מחזור עסקאות צפוי, בכפוף לשאר תנאי הרישום. הפטור נוגע למע״מ ואינו פוטר אוטומטית ממס הכנסה או מדמי ביטוח.</p>
        <p>במודל חשבוניות ישראל, החל מ־1 ביוני 2026 סף העסקה לצורך מספר הקצאה הוא סכום <strong>העולה על 5,000 ₪ לפני מע״מ</strong>, לפי התנאים שמפרסמת רשות המסים. יש לבדוק את תחולת המודל לפני הפקת חשבונית או ניכוי תשומות.</p>
        <ul>
          <li><a href={EXEMPT_REGISTRATION} target="_blank" rel="noopener noreferrer" className="text-gold underline">תנאי פתיחת תיק עוסק פטור ↗</a></li>
          <li><a href={INVOICE_ISRAEL} target="_blank" rel="noopener noreferrer" className="text-gold underline">חשבוניות ישראל — מידע רשמי ↗</a></li>
          <li><Link href="/self-employed/vat-threshold" className="text-gold underline">מדריך תקרת עוסק פטור</Link></li>
          <li><Link href="/self-employed/net" className="text-gold underline">בדיקת נטו לעצמאי</Link></li>
          <li><Link href="/course/self-employed" className="text-gold underline">הקורס לעצמאים</Link></li>
        </ul>
      </>}
      sources={<ul className="space-y-2"><li><a href={RATE_HISTORY} target="_blank" rel="noopener noreferrer">רשות המסים — היסטוריית שיעורי המע״מ</a></li><li><a href={VAT_REPORT} target="_blank" rel="noopener noreferrer">רשות המסים — דיווח ותשלום דוחות מע״מ</a></li><li><a href={INVOICE_ISRAEL} target="_blank" rel="noopener noreferrer">רשות המסים — חשבוניות ישראל</a></li></ul>}
    />
  );
}
