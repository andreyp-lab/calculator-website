import type { Metadata } from 'next';
import { OfficialBenefitPage } from '@/components/verification/OfficialBenefitPage';

export const metadata: Metadata = {
  title: 'דמי אבטלה — בדיקת סכום וזכאות בביטוח הלאומי',
  description: 'בדיקת דמי אבטלה לפי הכנסה, גיל ותקופת אכשרה במחשבון הרשמי של הביטוח הלאומי.',
  alternates: { canonical: '/employee-rights/unemployment-benefits' },
};

export default function UnemploymentBenefitsPage() {
  return (
    <OfficialBenefitPage
      title="דמי אבטלה — בדיקת הסכום האישי"
      description="דמי האבטלה מחושבים לפי ההכנסה החייבת בדמי ביטוח בששת החודשים שקדמו לרישום בשירות התעסוקה, עם מדרגות שונות למי שטרם מלאו לו 28. תקרת התשלום היומית בשנת 2026 היא 550.76 ₪ ב-125 הימים הראשונים ו-367.17 ₪ לאחר מכן. תקופת האכשרה הרגילה היא 12 חודשי עבודה מתוך 18 חודשים."
      sourceUrl="https://www.btl.gov.il/Simulators/Pages/AvtalaCalcNew.aspx"
      sourceLabel="למחשבון דמי האבטלה של הביטוח הלאומי"
      details={[
        'הכנסה מכל מקומות העבודה בששת החודשים שלפני הרישום.',
        'גיל, חודשי עבודה ונסיבות סיום ההעסקה.',
        'מועד ההתייצבות בשירות התעסוקה והכנסות נוספות בתקופת האבטלה.',
      ]}
    />
  );
}
