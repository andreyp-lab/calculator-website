import { withPageSocialMetadata } from '@/lib/config/site-info';
import type { Metadata } from 'next';
import Link from 'next/link';
import { CalculatorLayout } from '@/components/calculator/CalculatorLayout';
import { FAQ } from '@/components/calculator/FAQ';
import { LaborRightsCalculator } from '@/components/calculators/LaborRightsCalculator';

export const metadata: Metadata = withPageSocialMetadata({
  title: "מחשבון ביטוח לאומי ודמי בריאות 2026 — שכיר ועצמאי",
  description: "חשבו דמי ביטוח לאומי ודמי ביטוח בריאות חודשיים לפי הכנסה ומעמד, עם השיעור המופחת והמלא ותקרת ההכנסה.",
  alternates: { canonical: '/personal-tax/national-insurance' },
});

const faqItems = [
  { question: "מה ההבדל בין דמי ביטוח לאומי לדמי בריאות?", answer: "הם שני מרכיבים נפרדים בחיוב: ביטוח לאומי מממן קצבאות, ודמי בריאות מממנים את מערכת הבריאות והצטרפות לקופת חולים." },
  { question: "האם המעסיק משלם גם?", answer: "כן, חלק המעסיק נוסף על ניכוי השכיר ואינו יורד מהשכר." },
];

export default function Page() {
  return (
    <CalculatorLayout
      pageUrl="/personal-tax/national-insurance"
      title="מחשבון ביטוח לאומי ודמי בריאות"
      description="חשבו דמי ביטוח לאומי ודמי ביטוח בריאות חודשיים לפי הכנסה ומעמד, עם השיעור המופחת והמלא ותקרת ההכנסה."
      breadcrumbs={[
        { label: 'דף הבית', href: '/' },
        { label: "מיסוי אישי", href: '/personal-tax' },
        { label: "ביטוח לאומי" },
      ]}
      lastUpdated="2026-11-20"
      quickAnswer={<p>דמי ביטוח לאומי ודמי בריאות מחושבים בשיעור מופחת על ההכנסה עד 60% מהשכר הממוצע ובשיעור מלא על החלק שמעליו, עד תקרה. שכיר משלם גם חלק, והמעסיק משלם חלק נפרד; עצמאי משלם שיעורים גבוהים יותר. הזינו הכנסה חודשית ומעמד וקבלו פירוט.</p>}
      calculator={<LaborRightsCalculator section="btl" />}
      content={
        <>
          <h2>איך מחושב</h2>
          <p>ההכנסה מתחלקת לשני חלקים: עד הסף המופחת ומעליו עד התקרה. על כל חלק חל שיעור אחר לביטוח לאומי ולבריאות. ההכנסה מעל התקרה אינה חייבת.</p>
          <h2>איפה זה משתלב</h2>
          <p><Link href="/personal-tax/salary-net-gross">חישוב ברוטו נטו</Link> משתמש באותם שיעורים. לעצמאים: <Link href="/self-employed/social-security">ביטוח לאומי לעצמאים</Link> ו<Link href="/self-employed/net">חישוב נטו לעצמאי</Link>.</p>
        </>
      }
      faq={<FAQ items={faqItems} />}
      sources={
        <ul>
          <li><a href="https://www.btl.gov.il/Insurance/Rates/Pages/default.aspx" target="_blank" rel="noopener noreferrer">ביטוח לאומי — שיעורי דמי ביטוח</a></li>
        </ul>
      }
    />
  );
}
