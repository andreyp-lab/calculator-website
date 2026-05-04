import { Metadata } from 'next';
import { CalculatorLayout } from '@/components/calculator/CalculatorLayout';
import { AnnualLeaveCalculator } from '@/components/calculators/AnnualLeaveCalculator';
import { FAQ } from '@/components/calculator/FAQ';

export const metadata: Metadata = {
  title: 'מחשבון ימי חופשה 2026 - לפי וותק',
  description: 'חישוב ימי חופשה שנתיים לפי וותק - 12 ימים בסיסי, עולה עם השנים עד 24-26 ימים.',
  alternates: { canonical: '/employee-rights/annual-leave' },
};

const faqItems = [
  { question: 'כמה ימי חופשה מגיעים?', answer: 'לפי חוק חופשה שנתית: 4 שנים ראשונות = 12 ימים (5 ימי עבודה). שנה 5 = 14, שנה 6 = 16, שנה 7 = 18, שנה 8 = 19, שנה 9-10 = 20, שנה 11 = 21, שנה 12 = 22, שנה 13 = 23, שנה 14+ = 24-26 ימים.' },
  { question: 'מה עם 6 ימי עבודה בשבוע?', answer: 'ימי החופשה גבוהים יותר - 14 ימים בסיסי, ועולים עד 28 ימים בוותק 14+. הסיבה: שבוע עבודה ארוך יותר → פיצוי בחופשה.' },
  { question: 'האם ניתן לפדות חופשה בכסף?', answer: 'כן, אבל בעיקר בעת סיום עבודה. במהלך עבודה פדיון אסור (מטרת החוק - שהעובד יצא לחופשה). בעת פיטורים/התפטרות: ימי חופשה שלא נוצלו משולמים לפי השכר היומי האחרון, עד גובה שנת חופשה אחת.' },
  { question: 'מה קורה אם המעסיק לא מאפשר חופשה?', answer: 'החוק מחייב את המעסיק לאפשר ניצול לפחות 7 ימי חופשה רצופים בשנה. אם לא מאפשר - העובד יכול לפנות למשרד הכלכלה או בית הדין לעבודה. גם המעסיק יכול לחייב יציאה לחופשה (במקרים מוגדרים).' },
  { question: 'האם חופשת מחלה / לידה נחשבת לחופשה?', answer: 'לא. ימי מחלה, חופשת לידה, מילואים - הם זכויות נפרדות שלא נסערים מימי החופשה השנתיים.' },
];

export default function Page() {
  return (
    <CalculatorLayout
      title="מחשבון ימי חופשה 2026"
      description="חישוב הימי חופשה השנתיים שמגיעים לך לפי חוק - לפי וותק וימי עבודה בשבוע."
      breadcrumbs={[{label:'דף הבית',href:'/'},{label:'זכויות עובדים',href:'/employee-rights'},{label:'ימי חופשה'}]}
      lastUpdated="2026-05-04"
      calculator={<AnnualLeaveCalculator />}
      content={<><h2>ימי חופשה - לפי החוק</h2><p>חוק חופשה שנתית מחייב מעסיק לתת חופשה בתשלום לכל עובד. המספר תלוי בוותק ובמספר ימי העבודה בשבוע.</p><h2>טבלת זכאות (5 ימי עבודה)</h2><table className="w-full text-sm border-collapse my-4"><thead><tr className="bg-blue-50"><th className="border border-gray-300 p-2 text-right">וותק</th><th className="border border-gray-300 p-2 text-right">ימי חופשה</th></tr></thead><tbody><tr><td className="border border-gray-300 p-2">1-4 שנים</td><td className="border border-gray-300 p-2">12</td></tr><tr><td className="border border-gray-300 p-2">5</td><td className="border border-gray-300 p-2">14</td></tr><tr><td className="border border-gray-300 p-2">6</td><td className="border border-gray-300 p-2">16</td></tr><tr><td className="border border-gray-300 p-2">7</td><td className="border border-gray-300 p-2">18</td></tr><tr><td className="border border-gray-300 p-2">9-10</td><td className="border border-gray-300 p-2">20</td></tr><tr><td className="border border-gray-300 p-2">14+</td><td className="border border-gray-300 p-2">24-26</td></tr></tbody></table></>}
      faq={<FAQ items={faqItems} />}
    />
  );
}
