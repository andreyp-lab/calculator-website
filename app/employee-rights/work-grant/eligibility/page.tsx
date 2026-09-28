import type { Metadata } from 'next';
import { OfficialBenefitPage } from '@/components/verification/OfficialBenefitPage';

export const metadata: Metadata = {
  title: 'זכאות למענק עבודה — בדיקה רשמית',
  description: 'בדקו זכאות למענק עבודה לפי שנת המס, הכנסה ומצב משפחתי ברשות המסים.',
  alternates: { canonical: '/employee-rights/work-grant/eligibility' },
};

export default function WorkGrantEligibilityPage() {
  return (
    <OfficialBenefitPage
      title="זכאות למענק עבודה"
      description="הזכאות אינה נקבעת לפי הכנסה בלבד. רשות המסים בודקת גם גיל, ילדים, מצב משפחתי, זכויות במקרקעין והכנסות נוספות לפי שנת המס. הסימולטור הרשמי הוא הדרך לבדוק את הסכום האישי."
      sourceUrl="https://www.gov.il/he/service/check-eligibility-for-job-grant"
      sourceLabel="לסימולטור רשות המסים"
      details={[
        'הכנסה מעבודה כשכיר או מעסק בשנת המס הרלוונטית.',
        'פרטי בן או בת הזוג והילדים, אם רלוונטי.',
        'פרטי זכויות במקרקעין ומידע נוסף שהסימולטור מבקש.',
      ]}
      related={[{ href: '/employee-rights/work-grant', label: 'חזרה למענק עבודה' }]}
    />
  );
}
