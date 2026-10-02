import type { Metadata } from 'next';
import { OfficialBenefitPage } from '@/components/verification/OfficialBenefitPage';

export const metadata: Metadata = {
  title: 'סימולטור מענק עבודה — בדיקה רשמית',
  description: 'בדיקת זכאות ומענק עבודה לפי שנת המס והמצב האישי בשירות הרשמי של רשות המסים.',
  alternates: { canonical: '/employee-rights/work-grant' },
};

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
      ]}
    />
  );
}
