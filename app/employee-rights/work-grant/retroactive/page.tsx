import type { Metadata } from 'next';
import { OfficialBenefitPage } from '@/components/verification/OfficialBenefitPage';

export const metadata: Metadata = {
  title: 'מענק עבודה לשנים קודמות — מועדי הגשה',
  description: 'בדקו ברשות המסים אילו שנות זכאות פתוחות להגשה ואת המועד החל על כל שנה.',
  alternates: { canonical: '/employee-rights/work-grant/retroactive' },
};

export default function RetroactiveWorkGrantPage() {
  return (
    <OfficialBenefitPage
      title="מענק עבודה לשנים קודמות"
      description="מועדי ההגשה עשויים להשתנות לפי שנת הזכאות ואופן ההגשה. אל תסתמכו על טבלת סכומים משנים אחרות: בדקו ברשות המסים איזו שנה פתוחה כעת והגישו בקשה נפרדת לכל שנת זכאות."
      sourceUrl="https://www.gov.il/he/service/submitting-an-online-claim-for-job-grant"
      sourceLabel="למועדי ההגשה ולבקשה המקוונת"
      details={[
        'זהו את שנת המס שלגביה טרם הוגשה בקשה.',
        'בדקו את המועד העדכני להגשה עבור אותה שנה בשירות הרשמי.',
        'ודאו שפרטי חשבון הבנק וההכנסה תואמים לדיווחים שהוגשו.',
      ]}
      related={[{ href: '/employee-rights/work-grant', label: 'חזרה למענק עבודה' }]}
    />
  );
}
