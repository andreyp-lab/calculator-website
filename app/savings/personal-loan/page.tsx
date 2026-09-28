import Link from 'next/link';
import type { Metadata } from 'next';
import { CalculatorLayout } from '@/components/calculator/CalculatorLayout';
import { FAQ } from '@/components/calculator/FAQ';

const comparisonUrl = 'https://www.boi.org.il/information/bank-paymnts/financial-education/campaigns/boi-equator/loans/';
const questionsUrl = 'https://www.boi.org.il/media/t0ad2hij/%D7%91%D7%93%D7%A8%D7%9A-%D7%9C%D7%A7%D7%97%D7%AA-%D7%94%D7%9C%D7%95%D7%95%D7%90%D7%94.pdf';

export const metadata: Metadata = {
  title: { absolute: 'הלוואה אישית — השוואת עלויות ותנאים' },
  description: 'מה בודקים לפני הלוואה אישית: ריבית, עלות כוללת, עמלות, הצמדה ויכולת החזר. קישורים להשוואת ריביות באתר בנק ישראל.',
  alternates: { canonical: '/savings/personal-loan' },
};

export default function Page() {
  return (
    <CalculatorLayout
      title="הלוואה אישית — איך משווים הצעות"
      description="לפני נטילת הלוואה השוו הצעות אישיות לפי העלות הכוללת והתנאים. בדקו ריביות שניתנו בפועל בכלי של בנק ישראל."
      breadcrumbs={[{ label: 'דף הבית', href: '/' }, { label: 'חיסכון', href: '/savings' }, { label: 'הלוואה אישית' }]}
      lastUpdated="2026-09-28"
      pageUrl="/savings/personal-loan"
      quickAnswer={<p>ריבית ההלוואה בפועל תלויה במלווה, בלווה, בסכום, במשך ובתנאי ההצעה. בקשו הצעה כתובה ובדקו את סכום ההחזר הכולל, שיעור העלות הממשית של האשראי ככל שנמסר, עמלות, הצמדה ותנאי פירעון מוקדם. <a href={comparisonUrl} target="_blank" rel="noopener noreferrer">קו המשווה של בנק ישראל</a> מציג ריביות על הלוואות שניתנו בפועל לצורך השוואה כללית.</p>}
      content={<>
        <h2>מה להשוות בין הצעות?</h2>
        <ul>
          <li>סכום נטו שתקבלו, מספר התשלומים, ההחזר החודשי וסך כל התשלומים.</li>
          <li>ריבית נומינלית, ריבית אפקטיבית או שיעור העלות הממשית; בדקו מה בדיוק כל נתון כולל.</li>
          <li>עמלות ותשלומי חובה נוספים, הצמדה למדד, ריבית משתנה וקנסות או עמלות בעת פירעון מוקדם.</li>
          <li>השפעת ההחזר על ההוצאות החיוניות ועל החובות הקיימים שלכם.</li>
        </ul>
        <p>אל תסיקו שקרן השתלמות, בנק או חברת אשראי זולים תמיד בסדר קבוע. תנאי כל מוצר והזכאות לו משתנים; השוו הצעות בפועל באותו סכום ובאותה תקופה.</p>
        <h2>כלים וקישורים</h2>
        <ul>
          <li><Link href="/savings/loan-repayment">מחשבון החזר הלוואה</Link> — תרחיש מתמטי לפי הסכום, הריבית והתקופה שהזנתם.</li>
          <li><a href={comparisonUrl} target="_blank" rel="noopener noreferrer">השוואת ריביות הלוואות בבנק ישראל</a> — נתונים כלליים; בדקו את התנאים האישיים מול המלווה.</li>
          <li><a href={questionsUrl} target="_blank" rel="noopener noreferrer">שאלות בנק ישראל לפני נטילת הלוואה</a>.</li>
        </ul>
      </>}
      faq={<FAQ items={[
        { question: 'האם אפשר לדעת מראש איזו הלוואה תהיה הזולה ביותר?', answer: 'לא לפי סוג המלווה בלבד. בקשו הצעות לאותו סכום ולאותה תקופה והשוו את העלות הכוללת ואת התנאים האישיים.' },
        { question: 'האם פירעון מוקדם תמיד חוסך כסף?', answer: 'הקטנת הקרן יכולה לחסוך ריבית עתידית, אך צריך להביא בחשבון עמלות פירעון ותנאי ההסכם. בקשו מהמלווה חישוב כתוב לפני ההחלטה.' },
      ]} />}
      sources={<ul><li><a href={comparisonUrl} target="_blank" rel="noopener noreferrer">בנק ישראל — קו המשווה להלוואות</a></li><li><a href={questionsUrl} target="_blank" rel="noopener noreferrer">בנק ישראל — שאלות לפני הלוואה</a></li></ul>}
    />
  );
}
