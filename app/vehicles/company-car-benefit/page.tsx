import type { Metadata } from 'next';
import Link from 'next/link';
import { CalculatorLayout } from '@/components/calculator/CalculatorLayout';

export const metadata: Metadata = {
  title: 'שווי שימוש ברכב צמוד — בדיקה לפי דגם ברשות המסים',
  description: 'בדקו את שווי השימוש החודשי של רכב מעסיק בסימולטור הרשמי לפי דגם ושנת רישום, ואת השפעתו על השכר.',
  alternates: { canonical: '/vehicles/company-car-benefit' },
};

const official = 'https://www.gov.il/he/service/itc-mm_usecar10';

export default function Page() {
  return (
    <CalculatorLayout
      pageUrl="/vehicles/company-car-benefit"
      title="שווי שימוש ברכב צמוד"
      description="בדיקה לפי דגם הרכב בסימולטור של רשות המסים והשוואה לתלוש השכר."
      breadcrumbs={[{ label: 'דף הבית', href: '/' }, { label: 'רכב', href: '/vehicles' }, { label: 'שווי שימוש ברכב' }]}
      lastUpdated="2026-09-28"
      quickAnswer={<p>רכב צמוד העומד לרשות העובד לשימוש פרטי יוצר שווי שימוש שנזקף לשכר. <a href={official} target="_blank" rel="noopener noreferrer">בדקו את סכום הזקיפה לפי דגם הרכב ושנתו ברשות המסים</a>; סכום הזקיפה אינו המס עצמו.</p>}
      calculator={<div className="p-6 border border-ink/20 bg-paper"><p>לבדיקת שווי שימוש אישי, הזינו את פרטי הרכב במערכת רשות המסים.</p><a className="inline-block mt-4 text-gold underline" href={official} target="_blank" rel="noopener noreferrer">פתיחת הסימולטור הרשמי</a></div>}
      content={<>
        <h2>איך בודקים את הסכום?</h2>
        <p>הזינו בסימולטור רשות המסים את פרטי הרכב כפי שהם מופיעים ברישיון. לרכב שנרשם החל מ־1 בינואר 2010, השווי מבוסס על מחיר הרכב כשהיה חדש; לכלי רכב מוקדמים יותר חלות טבלאות שנתיות. הפחתות לפי סוג ההנעה ותקרות תלויות בדין הרלוונטי ובנתוני הרכב, ולכן יש להסתמך על התוצאה הרשמית.</p>
        <p><a href={official} target="_blank" rel="noopener noreferrer">לסימולטור שווי השימוש של רשות המסים</a></p>
        <h2>איך משווים חלופות?</h2>
        <p>השוו את ההשפעה בפועל על התלוש, את תוספת השכר האפשרית במקום רכב, ואת העלויות שהמעסיק מכסה. שווי השימוש אינו שקול לשווי נטו של הרכב או לעלות המס האישית. אפשר לבדוק מס על שכר ב<Link href="/personal-tax/income-tax">מחשבון מס הכנסה</Link> עם נתוניכם האישיים, ולהשוות הצעת רכב פרטי והסכם העסקה בפועל.</p>
      </>}
    />
  );
}
