import { Metadata } from 'next';
import { CalculatorLayout } from '@/components/calculator/CalculatorLayout';
import { SickPayCalculator } from '@/components/calculators/SickPayCalculator';
import { FAQ } from '@/components/calculator/FAQ';

export const metadata: Metadata = {
  title: 'מחשבון דמי מחלה 2026 - חישוב תשלום',
  description: 'חישוב דמי מחלה - יום 1 ללא תשלום, ימים 2-3 ב-50%, יום 4+ ב-100%. עד 18 ימים בשנה.',
  alternates: { canonical: '/employee-rights/sick-pay' },
};

const faqItems = [
  { question: 'איך משלמים דמי מחלה?', answer: 'יום 1: ללא תשלום. ימים 2-3: 50% מהשכר היומי. יום 4+: 100% מהשכר היומי. לדוגמה: עובד בשכר 10,000 ₪/חודש (333 ₪/יום), 5 ימי מחלה = 0 + 167 + 167 + 333 + 333 = 1,000 ₪.' },
  { question: 'כמה ימים אני זכאי?', answer: '18 ימי מחלה לשנה (1.5 ימים בחודש). הצבירה מקסימלית: 90 ימים. ימים שלא נוצלו לא מועברים בעת סיום עבודה (לא נפדים בכסף - שלא כמו חופשה).' },
  { question: 'מה דרוש כאישור?', answer: 'אישור רפואי מרופא משפחה / מומחה. עד 3 ימים אפשר ב"הצהרה אישית" (לא תמיד מתקבל). ימי מחלה ארוכים (7+) דורשים אישור מומחה. שלח את האישור למעסיק תוך 3 ימי עסקים.' },
  { question: 'מה זה "ימי מחלה לבן זוג / הורה / ילד"?', answer: 'מחלה של ילד עד 16 - עד 8 ימים בשנה לטיפול. מחלת בן/בת זוג חולה - עד 6 ימים. מחלת הורה - עד 6 ימים. דרושים אישורים. הימים נחשבים מהמכסה השנתית של 18.' },
  { question: 'מה אם המחלה ארוכה במיוחד?', answer: 'אחרי 90 ימי מחלה רצופים - העובד יכול להיכנס לתוכנית "פיצוי על אבדן כושר עבודה" של ב.ל. דרוש קביעת אחוזי נכות. במקרים של מחלה קשה - ייתכנו פטור ממס לפי סעיף 9.5.' },
];

export default function Page() {
  return (
    <CalculatorLayout
      title="מחשבון דמי מחלה 2026"
      description="חישוב התשלום שמגיע לך מהמעסיק בעת מחלה - לפי חוק דמי מחלה."
      breadcrumbs={[{label:'דף הבית',href:'/'},{label:'זכויות עובדים',href:'/employee-rights'},{label:'דמי מחלה'}]}
      lastUpdated="2026-05-04"
      calculator={<SickPayCalculator />}
      content={<><h2>דמי מחלה - מה החוק אומר</h2><p>חוק דמי מחלה מסדיר את התשלום שמעסיק חייב לעובד שלא יכול להגיע לעבודה בגלל מחלה. החוק מאזן בין זכויות העובד לעלות המעסיק.</p><h2>שיעורי תשלום</h2><table className="w-full text-sm border-collapse my-4"><thead><tr className="bg-blue-50"><th className="border border-gray-300 p-2 text-right">יום</th><th className="border border-gray-300 p-2 text-right">תשלום</th></tr></thead><tbody><tr><td className="border border-gray-300 p-2">יום 1</td><td className="border border-gray-300 p-2">0%</td></tr><tr><td className="border border-gray-300 p-2">יום 2</td><td className="border border-gray-300 p-2">50%</td></tr><tr><td className="border border-gray-300 p-2">יום 3</td><td className="border border-gray-300 p-2">50%</td></tr><tr><td className="border border-gray-300 p-2">יום 4+</td><td className="border border-gray-300 p-2">100%</td></tr></tbody></table></>}
      faq={<FAQ items={faqItems} />}
    />
  );
}
