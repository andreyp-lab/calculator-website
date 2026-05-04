import { Metadata } from 'next';
import { CalculatorLayout } from '@/components/calculator/CalculatorLayout';
import { SelfEmployedPensionCalculator } from '@/components/calculators/SelfEmployedPensionCalculator';
import { FAQ } from '@/components/calculator/FAQ';

export const metadata: Metadata = {
  title: 'מחשבון פנסיה חובה לעצמאי 2026',
  description: 'חישוב הפקדת פנסיה חובה לעצמאי. כולל הטבת מס וקצבה צפויה לפרישה.',
  alternates: { canonical: '/self-employed/mandatory-pension' },
};

const faqItems = [
  { question: 'מה חובת הפנסיה לעצמאי?', answer: 'מאז 2017 - עצמאי חייב להפקיד לפנסיה. החישוב לפי השכר הממוצע במשק (13,769 ₪): שלב 1 - 4.45% עד מחצית השכר (6,884 ₪); שלב 2 - 12.55% עד השכר הממוצע. מעל זה - אין חובה.' },
  { question: 'מה הקנס אם לא מפקידים?', answer: 'ב.ל. גובה את הקנס. הקנס מצטבר מ-2017 ויכול להיות עשרות אלפי שקלים. בנוסף, אובדן הטבת מס משמעותית. מומלץ לסדר זה מיד עם פתיחת התיק העצמאי.' },
  { question: 'מה הטבות המס?', answer: 'שתי הטבות: (1) ניכוי - ההפקדה מורידה מההכנסה החייבת (חוסך מס במלוא השיעור השולי). (2) זיכוי - 35% החזר מס על חלק מההפקדה. שילוב של שתיהם = החזר 50%-70% מההפקדה!' },
  { question: 'האם להפקיד מעבר לחובה?', answer: 'בהחלט מומלץ. תקרת ההפקדה הפטורה מס: ~13,700 ₪ לשנה. כל ₪ נוסף עד התקרה מקבל הטבת מס משמעותית. ככל שהמס השולי גבוה - הטבה גבוהה יותר. דוגמה: עצמאי במדרגת 47% שמפקיד 1,000 ₪ - חוסך ~600 ₪ מס.' },
  { question: 'איפה כדאי להפקיד?', answer: 'אפשרויות: קופת גמל לפנסיה (קצבה לכל החיים), קרן פנסיה חדשה (תשואה גבוהה יותר אבל סיכון), ביטוח מנהלים (יקר). למי שמתחיל - קרן פנסיה חדשה (עלויות נמוכות, תשואה ארוכת טווח טובה).' },
  { question: 'מה קורה לפנסיה אם אעבור לשכיר?', answer: 'הקרן ממשיכה לקבל הפקדות מהמעסיק החדש (12.5%). הצבירה מהתקופה כעצמאי נשמרת. ניתן לאחד מספר קרנות בעת הפרישה. רצף הביטוח חיוני - אל תעצור הפקדות בעת מעבר.' },
];

export default function Page() {
  return (
    <CalculatorLayout
      title="מחשבון פנסיה חובה לעצמאי 2026"
      description="חישוב ההפקדה החובה לפי החוק + תכנון הפקדה רצונית עם הטבות מס."
      breadcrumbs={[{label:'דף הבית',href:'/'},{label:'עצמאיים',href:'/self-employed'},{label:'פנסיה חובה'}]}
      lastUpdated="2026-05-04"
      calculator={<SelfEmployedPensionCalculator />}
      content={<><h2>פנסיה חובה לעצמאי - מה החוק אומר</h2><p>מאז 2017 חוק פנסיה חובה חל גם על עצמאים. החובה מבוססת על השכר הממוצע במשק.</p><h2>שיעורי ההפקדה (2026)</h2><table className="w-full text-sm border-collapse my-4"><thead><tr className="bg-blue-50"><th className="border border-gray-300 p-2 text-right">שלב</th><th className="border border-gray-300 p-2 text-right">הכנסה</th><th className="border border-gray-300 p-2 text-right">שיעור</th></tr></thead><tbody><tr><td className="border border-gray-300 p-2">1</td><td className="border border-gray-300 p-2">עד 6,884 ₪</td><td className="border border-gray-300 p-2">4.45%</td></tr><tr><td className="border border-gray-300 p-2">2</td><td className="border border-gray-300 p-2">6,884 - 13,769 ₪</td><td className="border border-gray-300 p-2">12.55%</td></tr><tr><td className="border border-gray-300 p-2">3</td><td className="border border-gray-300 p-2">מעל 13,769 ₪</td><td className="border border-gray-300 p-2">לא חובה (מומלץ)</td></tr></tbody></table></>}
      faq={<FAQ items={faqItems} />}
    />
  );
}
