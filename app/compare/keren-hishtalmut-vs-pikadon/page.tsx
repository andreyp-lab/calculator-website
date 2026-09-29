import type { Metadata } from 'next';
import Link from 'next/link';
import { CalculatorLayout } from '@/components/calculator/CalculatorLayout';
import { FAQ } from '@/components/calculator/FAQ';

const taxGuide = 'https://www.gov.il/BlobFolder/generalpage/income-tax-guide-knowyourright/he/Guides_IncomeTax_da-2025.pdf';
const fundGuide = 'https://www.gov.il/he/pages/training-fund';
const depositComparison = 'https://www.boi.org.il/information/bank-paymnts/financial-education/campaigns/boi-equator/deposit/';

export const metadata: Metadata = {
  title: 'קרן השתלמות מול פיקדון — מס, נזילות וסיכון',
  description: 'השוואה בין קרן השתלמות לפיקדון בנקאי לפי תנאי משיכה, מיסוי, עלויות ורמת סיכון, עם מקורות רשמיים וללא הנחת תשואה מובטחת.',
  alternates: { canonical: '/compare/keren-hishtalmut-vs-pikadon' },
};

export default function KerenHishtalmutVsPikadonPage() {
  return (
    <CalculatorLayout
      title="קרן השתלמות מול פיקדון בנקאי"
      description="איך משווים תנאי חיסכון, מיסוי, נזילות וסיכון לפני שבוחרים היכן להפקיד."
      breadcrumbs={[{ label: 'דף הבית', href: '/' }, { label: 'דפי השוואה', href: '/compare' }, { label: 'קרן השתלמות מול פיקדון' }]}
      lastUpdated="2026-09-29"
      pageUrl="/compare/keren-hishtalmut-vs-pikadon"
      quickAnswer={<p>קרן השתלמות עשויה להעניק הטבות מס להפקדה ולרווחים, בכפוף לתקרות, למעמד החוסך ולתנאי המשיכה. תשואתה תלויה במסלול ובשוק ואינה מובטחת. פיקדון בנקאי פועל לפי ריבית, תקופה ותנאי משיכה שסוכמו עם הבנק; גם הריבית עשויה להיות משתנה, והמס על הריבית תלוי בסוג הפיקדון ובנתוני החוסך. כדי להשוות ביניהם יש להשתמש בהצעות אישיות, בעלויות ובמועד שבו תזדקקו לכסף.</p>}
      content={<>
        <h2>מה לבדוק בכל מוצר?</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead><tr><th className="border p-2 text-right">נושא</th><th className="border p-2 text-right">קרן השתלמות</th><th className="border p-2 text-right">פיקדון בנקאי</th></tr></thead>
            <tbody>
              <tr><td className="border p-2">תשואה ועלויות</td><td className="border p-2">תשואה לא מובטחת לפי מסלול ההשקעה; בדקו דמי ניהול.</td><td className="border p-2">ריבית קבועה או משתנה לפי ההצעה; בדקו תקופת חישוב ותנאי שינוי.</td></tr>
              <tr><td className="border p-2">מיסוי</td><td className="border p-2">הטבות מס אפשריות לפי מעמד החוסך, תקרות ותנאי משיכה. סכומים מעל תקרה עשויים להתחייב במס.</td><td className="border p-2">מס על הריבית לפי סוג הפיקדון והנסיבות; פיקדון לא צמוד ופיקדון צמוד עשויים להיות ממוסים בבסיס ובשיעור שונים.</td></tr>
              <tr><td className="border p-2">נזילות</td><td className="border p-2">משיכה פטורה לכל מטרה מתאפשרת בדרך כלל לאחר שש שנות ותק; קיימים חריגים ותנאים מיוחדים.</td><td className="border p-2">מועד המשיכה, תחנות יציאה ועלות יציאה מוקדמת נקבעים בהסכם הפיקדון.</td></tr>
              <tr><td className="border p-2">סיכון</td><td className="border p-2">ערך החיסכון עשוי לעלות או לרדת לפי הנכסים במסלול.</td><td className="border p-2">בדקו את תנאי הפיקדון, ההצמדה והריבית; כוח הקנייה עלול להישחק אם הריבית נטו נמוכה מהאינפלציה.</td></tr>
            </tbody>
          </table>
        </div>
        <h2>השוואה שמתאימה לנתונים שלכם</h2>
        <p>בקרן השתלמות יש להפריד בין הטבת ניכוי לעצמאי לבין פטור אפשרי על רווחים. התקרות אינן זהות, ושכיר שהוא גם עצמאי נדרש לבדיקה נוספת. בפיקדון, השוו את הריבית האפקטיבית, אפשרות המשיכה, ההצמדה והמס. אין להניח מראש שקרן השתלמות תניב יותר מפיקדון באותה תקופה.</p>
        <p>השוו הצעות פיקדון ב<a href={depositComparison} target="_blank" rel="noopener noreferrer">קו המשווה של בנק ישראל</a>, ובדקו דמי ניהול ומסלול השקעה בקרן. להשוואת תרחישים מתמטיים לפי הנחות שלכם בלבד השתמשו ב<Link href="/investments/compound-interest">מחשבון ריבית דריבית</Link>; הוא אינו מחשב את המס האישי או משווה מוצרי חיסכון.</p>
      </>}
      faq={<FAQ items={[
        { question: 'האם כל רווח מקרן השתלמות פטור ממס?', answer: 'לא. הפטור תלוי בתקרות ההפקדה, במעמד החוסך ובתנאי המשיכה. יש לבדוק בנפרד כספים שהופקדו מעל תקרה.' },
        { question: 'האם ריבית הפיקדון תמיד ידועה מראש?', answer: 'לא. קיימים פיקדונות בריבית קבועה ומשתנה, צמודים ולא צמודים. יש לבדוק את ההצעה ואת תנאי השינוי והמשיכה.' },
        { question: 'האם קיימת בחירה שטובה תמיד לכל חוסך?', answer: 'לא. התוצאה תלויה בנזילות הדרושה, בהטבות המס האישיות, בתנאי הפיקדון, במסלול הקרן ובסיכון שמתאים לחוסך.' },
      ]} />}
      sources={<ul>
        <li><a href={fundGuide} target="_blank" rel="noopener noreferrer">משרד האוצר — קרן השתלמות</a></li>
        <li><a href={taxGuide} target="_blank" rel="noopener noreferrer">רשות המסים — מדריך מיסוי פיקדונות וקרנות השתלמות</a></li>
        <li><a href={depositComparison} target="_blank" rel="noopener noreferrer">בנק ישראל — השוואת פיקדונות</a></li>
      </ul>}
    />
  );
}
