import type { Metadata } from 'next';
import { CalculatorLayout } from '@/components/calculator/CalculatorLayout';
import { VAT_2026 } from '@/lib/constants/tax-2026';

export const metadata: Metadata = {
  title: 'תקרת עוסק פטור 2026 — בדיקת מחזור',
  description: 'תקרת המחזור לעוסק פטור ב־2026 והשלבים לבדיקת שינוי סיווג מול רשות המסים.',
  alternates: { canonical: '/self-employed/vat-threshold' },
};

const threshold = VAT_2026.smallBusinessThreshold.toLocaleString('he-IL');
const registration = 'https://www.gov.il/he/service/request-open-exempt-dealer-via-internet';
const declaration = 'https://www.gov.il/he/service/vat-declarationisexempt';

export default function Page() {
  return <CalculatorLayout
    title="תקרת עוסק פטור 2026"
    description="בדקו את המחזור השנתי שלכם ואת סוג התיק במע״מ מול רשות המסים."
    breadcrumbs={[{ label: 'דף הבית', href: '/' }, { label: 'עצמאיים', href: '/self-employed' }, { label: 'תקרת עוסק פטור' }]}
    lastUpdated="2026-09-28"
    quickAnswer={<p>תקרת המחזור הצפוי לפתיחת תיק עוסק פטור בשנת 2026 היא <strong>{threshold} ₪</strong>, לפי <a href={registration} target="_blank" rel="noopener noreferrer">רשות המסים</a>. התקרה מתייחסת למחזור העסקאות, לא לרווח אחרי הוצאות.</p>}
    calculator={<div className="bg-paper border border-ink/20 p-6"><p>השוו את המחזור המצטבר והצפי לשאר השנה לתקרה השנתית. אם אתם מתקרבים אליה או צפויים לחרוג ממנה, בררו מול רשות המסים או מייצג איך ומתי לעדכן את סוג התיק.</p><a className="inline-block mt-4 text-gold underline" href={registration} target="_blank" rel="noopener noreferrer">מידע רשמי על תיק עוסק פטור</a></div>}
    content={<>
      <h2>מה לבדוק במהלך השנה?</h2>
      <p>רכזו את מחזור העסקאות בפועל ואת העסקאות הצפויות. סיווג עוסק פטור הוא לעניין מע״מ; הוא אינו פטור אוטומטי ממס הכנסה או מדמי ביטוח. יש מקצועות וסוגי פעילות שאינם נרשמים כעוסק פטור גם אם המחזור נמוך מהתקרה.</p>
      <p>הגישו <a href={declaration} target="_blank" rel="noopener noreferrer">הצהרת מחזור לעוסק פטור</a> בהתאם להנחיות השירות. לקראת חריגה פנו לרשות המסים לברר שינוי סיווג, הוצאת מסמכים וחבות מע״מ לעסקאות הרלוונטיות. תחזית חודשית לבדה אינה קובעת את מועד החיוב או סכום המס.</p>
    </>}
  />;
}
