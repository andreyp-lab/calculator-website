import { withPageSocialMetadata } from '@/lib/config/site-info';
import type { Metadata } from 'next';
import { OfficialBenefitPage } from '@/components/verification/OfficialBenefitPage';
import { BenefitsCalculator } from '@/components/calculators/BenefitsCalculator';


export const metadata: Metadata = withPageSocialMetadata({
  title: 'מענק עבודה — בדיקת זכאות וסימולטור רשמי (שנת המס 2025)',
  description: 'בדיקת זכאות למענק עבודה לפי הכנסה, גיל וילדים, טבלת טווחי ההכנסה המזכים וקישור לסימולטור הרשמי של רשות המסים לחישוב הסכום.',
  alternates: { canonical: '/employee-rights/work-grant' },
});

export default function WorkGrantPage() {
  return (
    <OfficialBenefitPage
      title="סימולטור מענק עבודה — בדיקה רשמית"
      description="מענק עבודה נקבע לפי שנת המס, הכנסה, מצב משפחתי ונתונים נוספים. נכון לספטמבר 2026 רשות המסים מפרסמת מדריך לשנת הזכאות 2025. אין באתר זה נוסחה מאומתת לחישוב מענק לשנת הזכאות 2026."
      sourceUrl="https://www.gov.il/he/service/check-eligibility-for-job-grant"
      sourceLabel="לבדיקת זכאות וסכום ברשות המסים"
      details={[
        'בחרו את שנת המס שלגביה אתם מבקשים לבדוק זכאות.',
        'הכינו את פרטי ההכנסה מעבודה או מעסק ואת פרטי התא המשפחתי.',
        'בדקו את מועד ההגשה לשנה שבחרתם באתר רשות המסים.',
      ]}
      related={[
        { href: '/employee-rights/work-grant/eligibility', label: 'על בדיקת הזכאות' },
        { href: '/employee-rights/work-grant/retroactive', label: 'הגשה על שנים קודמות' },
        { href: '/employee-rights/work-grant/amount', label: 'איך נקבע סכום המענק' },
        { href: '/employee-rights/work-grant/application', label: 'איך מגישים בקשה' },
        { href: '/employee-rights/work-grant/status', label: 'בדיקת סטטוס הבקשה' },
        { href: '/employee-rights/work-grant/self-employed', label: 'מענק עבודה לעצמאים' },
        { href: '/employee-rights/work-grant/single-parent', label: 'מענק להורה יחיד' },
        { href: '/employee-rights/work-grant/couples', label: 'השפעת הכנסת בני זוג' },
      ]}
    >
      <BenefitsCalculator section="workgrant" />
    </OfficialBenefitPage>
  );
}
