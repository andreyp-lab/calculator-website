import { Metadata } from 'next';
import { CalculatorLayout } from '@/components/calculator/CalculatorLayout';
import { MinimumWageCalculator } from '@/components/calculators/MinimumWageCalculator';
import { FAQ } from '@/components/calculator/FAQ';

export const metadata: Metadata = {
  title: 'מחשבון שכר מינימום 2026 - חודשי, שעתי ויומי',
  description: 'שכר מינימום בישראל 2026: 6,443.85 ₪/חודש, 35.40 ₪/שעה. בדוק אם השכר שלך תואם לחוק.',
  alternates: { canonical: '/employee-rights/minimum-wage' },
};

const faqItems = [
  { question: 'מהו שכר המינימום ב-2026?', answer: 'מ-1.4.2026: 6,443.85 ₪/חודש למשרה מלאה. שעתי 182 שעות: 35.40 ₪. שעתי 186 שעות: 34.64 ₪. יומי 5 ימים בשבוע: 297.40 ₪. יומי 6 ימים: 257.75 ₪.' },
  { question: 'מה שכר המינימום לנוער?', answer: 'בני 16-17: 70% משכר המינימום (~4,510 ₪/חודש). בני 17-18: 75% (~4,833 ₪). מגיל 18 - שכר מינימום מלא.' },
  { question: 'מה אם המעסיק משלם פחות?', answer: 'תשלום פחות משכר המינימום הוא עבירה פלילית! המעסיק חייב להשלים את ההפרש + ריבית. ניתן להגיש תלונה למשרד הכלכלה (1-700-707-100) או בית הדין לעבודה. מומלץ לתעד את שעות העבודה.' },
  { question: 'האם תוספות נכללות בשכר מינימום?', answer: 'לא. שכר המינימום מתייחס לשכר היסוד בלבד. תוספות חובה (ותק, יוקר מחיה, נסיעות) הן בנוסף. אבל אם המעסיק "מוסיף" שעות נוספות במחיר רגיל - זו בעיה.' },
  { question: 'מתי מתעדכן שכר המינימום?', answer: 'מתעדכן באפריל בכל שנה לפי מדד המחירים לצרכן. ב-2026 התעדכן מ-6,247.67 ל-6,443.85. ב-2027 צפוי עדכון נוסף בהתאם למדד.' },
];

export default function Page() {
  return (
    <CalculatorLayout
      title="מחשבון שכר מינימום 2026"
      description="בדיקת שכר מינימום לפי החוק - חודשי, שעתי, יומי. כולל מקדמי גיל לנוער."
      breadcrumbs={[{label:'דף הבית',href:'/'},{label:'זכויות עובדים',href:'/employee-rights'},{label:'שכר מינימום'}]}
      lastUpdated="2026-05-04"
      calculator={<MinimumWageCalculator />}
      content={<><h2>שכר מינימום בישראל 2026</h2><p>שכר המינימום הוא הסכום המינימלי שמעסיק חייב לשלם לעובד לפי חוק. תקף מ-1.4.2026.</p><h2>תעריפים מעודכנים</h2><table className="w-full text-sm border-collapse my-4"><thead><tr className="bg-blue-50"><th className="border border-gray-300 p-2 text-right">סוג</th><th className="border border-gray-300 p-2 text-right">סכום</th></tr></thead><tbody><tr><td className="border border-gray-300 p-2">חודשי (משרה מלאה)</td><td className="border border-gray-300 p-2">6,443.85 ₪</td></tr><tr><td className="border border-gray-300 p-2">שעתי (182 ש/ח)</td><td className="border border-gray-300 p-2">35.40 ₪</td></tr><tr><td className="border border-gray-300 p-2">שעתי (186 ש/ח)</td><td className="border border-gray-300 p-2">34.64 ₪</td></tr><tr><td className="border border-gray-300 p-2">יומי 5 ימים</td><td className="border border-gray-300 p-2">297.40 ₪</td></tr><tr><td className="border border-gray-300 p-2">יומי 6 ימים</td><td className="border border-gray-300 p-2">257.75 ₪</td></tr></tbody></table></>}
      faq={<FAQ items={faqItems} />}
    />
  );
}
