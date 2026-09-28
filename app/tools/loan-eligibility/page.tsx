import type { Metadata } from 'next';
import { CalculatorLayout } from '@/components/calculator/CalculatorLayout';
import { FAQ } from '@/components/calculator/FAQ';

const fundUrl = 'https://govextra.gov.il/mof-gloans/homepage/';

export const metadata: Metadata = {
  title: { absolute: 'הלוואה בערבות המדינה לעסק — בדיקת מסלולים ותנאים' },
  description: 'איך בודקים מסלול ותנאי בקשה להלוואה בערבות המדינה? קישור לקרן הרשמית והסבר אילו פרטים ומסמכים לבדוק לפני ההגשה.',
  alternates: { canonical: '/tools/loan-eligibility' },
};

export default function LoanEligibilityPage() {
  return (
    <CalculatorLayout
      title="הלוואות לעסקים בערבות המדינה"
      description="בדקו באתר הרשמי של הקרן אילו מסלולים פתוחים, מה תנאיהם וכיצד מגישים בקשה."
      breadcrumbs={[{ label: 'דף הבית', href: '/' }, { label: 'כלים לבעלי עסקים', href: '/tools' }, { label: 'הלוואות בערבות המדינה' }]}
      lastUpdated="2026-09-28"
      pageUrl="/tools/loan-eligibility"
      quickAnswer={<p>תנאי הסף, סכומי ההלוואות, תקופות ההחזר ומועדי ההגשה משתנים לפי המסלול ועשויים להשתנות לאורך השנה. בחרו מסלול לפי מצב העסק ומטרת המימון, ואז בדקו את התנאים והמסמכים <a href={fundUrl} target="_blank" rel="noopener noreferrer">באתר הרשמי של הקרן בערבות המדינה</a>. בדיקה מקוונת כללית אינה אישור זכאות או התחייבות למתן הלוואה.</p>}
      content={<>
        <h2>מה לבדוק לפני הגשת בקשה?</h2>
        <ul>
          <li>שהמסלול מתאים לסוג העסק ולמטרת ההלוואה ושהגשת הבקשות אליו עדיין פתוחה.</li>
          <li>מחזור העסק, היסטוריית הפעילות, מצב ההתחייבויות ומסמכי הדיווח הנדרשים למסלול.</li>
          <li>סכום ההלוואה האפשרי, שיעור הביטחונות, תקופת ההחזר, הריבית והעמלות לפי תנאי המסלול והצעת נותן האשראי.</li>
          <li>יכולת החזר לפי תזרים צפוי, לרבות תרחיש שבו ההכנסות נמוכות מהמתוכנן.</li>
        </ul>
        <p>מסלולי סיוע ייעודיים עשויים להיפתח לתקופה מוגבלת. אין להסתמך על רשימת מסלולים או שיעורי ביטחונות ישנים בעת החלטה פיננסית.</p>
        <p><a href={fundUrl} target="_blank" rel="noopener noreferrer">מעבר לאתר הקרן להלוואות בערבות המדינה — מסלולים, תנאים והגשת בקשה</a>.</p>
      </>}
      faq={<FAQ items={[
        { question: 'האם עמידה בתנאי סף מבטיחה קבלת הלוואה?', answer: 'לא. יש לבדוק את תנאי המסלול העדכניים; החלטת אשראי תלויה גם בבדיקת העסק ונותן האשראי.' },
        { question: 'האם כל מסלול סיוע פתוח לאורך השנה?', answer: 'לא בהכרח. חלק מהמסלולים מוגבלים במועדי הגשה או משתנים בהחלטת הקרן. בדקו באתר הרשמי בעת הגשת הבקשה.' },
      ]} />}
      sources={<ul><li><a href={fundUrl} target="_blank" rel="noopener noreferrer">משרד האוצר — הקרן להלוואות בערבות המדינה</a></li></ul>}
    />
  );
}
