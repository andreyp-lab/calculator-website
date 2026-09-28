import type { Metadata } from 'next';
import { OfficialBenefitPage } from '@/components/verification/OfficialBenefitPage';

export const metadata: Metadata = {
  title: 'תגמולי מילואים — חישוב רשמי בביטוח הלאומי',
  description: 'בדיקת תגמולי מילואים לפי הכנסה וימי שירות במחשבון הביטוח הלאומי.',
  alternates: { canonical: '/employee-rights/reserve-duty-pay' },
};

export default function ReserveDutyPayPage() {
  return (
    <OfficialBenefitPage
      title="תגמולי מילואים — כמה מגיע לכם?"
      description="התגמול הבסיסי תלוי בהכנסה ובימי השירות המוכרים לתשלום. ב-2026 המינימום הוא 328.76 ₪ ליום והמקסימום 1,730.33 ₪ ליום. ימי תוספת מחושבים לפי אורך השירות. מענקים והטבות אחרים תלויים במסלול ובתקופה, ואינם מתווספים אוטומטית לכל משרת."
      sourceUrl="https://www.btl.gov.il/benefits/Reserve_Service/Pages/Calculator.aspx"
      sourceLabel="למחשבון תגמולי המילואים של הביטוח הלאומי"
      details={[
        'תאריכי השירות כפי שדווחו לביטוח הלאומי.',
        'הכנסה חייבת בדמי ביטוח בשלושת החודשים שלפני השירות, או נתוני המקדמות לעצמאי.',
        'בדקו בנפרד מענקים והטבות לפי מסלול השירות והתנאים החלים עליכם.',
      ]}
    />
  );
}
