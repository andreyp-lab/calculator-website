import { withPageSocialMetadata } from '@/lib/config/site-info';
import type { Metadata } from 'next';
import Link from 'next/link';
import { CalculatorLayout } from '@/components/calculator/CalculatorLayout';
import { FAQ } from '@/components/calculator/FAQ';
import { CpiLinkageCalculator } from '@/components/calculators/CpiLinkageCalculator';
import { linkToCpi } from '@/lib/calculators/cpi-linkage';
import { CPI_LAST_MONTH, CPI_VERIFIED_AT } from '@/lib/data/cpi-series';

export const metadata: Metadata = withPageSocialMetadata({
  title: 'מחשבון הצמדה למדד המחירים לצרכן — שכירות, הלוואה ומזונות',
  description:
    'חשבו כמה שווה סכום אחרי הצמדה למדד המחירים לצרכן בין שני תאריכים, לפי נתוני הלמ״ס והמדד הידוע, כולל שרשור על פני החלפת בסיס.',
  alternates: { canonical: '/savings/cpi-linkage' },
});

// דוגמה מחושבת מהמנוע ומנתוני הלמ"ס — זהה לתוצאה במחשבון הרשמי של הלמ"ס.
const EX = linkToCpi({ amount: 1000, fromMonth: '2020-03', toMonth: '2026-03' })!;
const money = (v: number) => `${v.toLocaleString('he-IL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₪`;

const faqItems = [
  {
    question: 'מה זה מדד ידוע ומה זה מדד בגין?',
    answer:
      'מדד ידוע הוא המדד האחרון שפורסם לפני תאריך החישוב: תאריך בחודש מסוים מוצמד למדד של חודשיים קודם. מדד בגין הוא מדד החודש שבגינו משולם הסכום. הסכם שכירות, הלוואה או מזונות קובע איזו שיטה חלה. המחשבון משתמש במדד הידוע, כמו מחשבון הלמ״ס.',
  },
  {
    question: 'למה המדד בתאריך מסוים שונה מהמדד שמופיע לאותו חודש?',
    answer:
      'כי הצמדה לפי מדד ידוע מתייחסת למדד שפורסם עד ה־15 בחודש הקודם, שהוא מדד של חודשיים אחורה.',
  },
  {
    question: 'איך מחשבים הצמדה כשבסיס המדד התחלף?',
    answer:
      'הלמ״ס מחליף בסיס כל שנתיים בינואר ומפרסם מקדמי שרשור. כדי להשוות חודשים משני בסיסים, ממירים את הערך החדש לבסיס הישן במקדם. המחשבון עושה זאת אוטומטית ומציין כשזה קרה.',
  },
  {
    question: 'האם הצמדה יכולה להקטין את הסכום?',
    answer:
      'כן, כשהמדד יורד בין שני התאריכים. אם ההסכם שלכם כולל סעיף שמונע ירידה מתחת לסכום הבסיס, המחשבון לא מחיל אותו. בדקו בהסכם.',
  },
  {
    question: 'האם המחשבון מחליף את מחשבון הלמ״ס?',
    answer:
      'לא. הוא מבוסס על אותם נתונים ותוצאתו זהה למחשבון הרשמי של הלמ״ס במקרים שנבדקו. לצורכי הליך משפטי או הסכם מחייב כדאי לאמת מול המחשבון הרשמי.',
  },
];

export default function CpiLinkagePage() {
  return (
    <CalculatorLayout
      pageUrl="/savings/cpi-linkage"
      title="מחשבון הצמדה למדד"
      description="כמה שווה סכום אחרי הצמדה למדד המחירים לצרכן בין שני תאריכים."
      breadcrumbs={[
        { label: 'דף הבית', href: '/' },
        { label: 'חיסכון וחובות', href: '/savings' },
        { label: 'הצמדה למדד' },
      ]}
      lastUpdated={CPI_VERIFIED_AT}
      quickAnswer={
        <p>
          סכום מוצמד = סכום × (המדד הידוע בתאריך החישוב ÷ המדד הידוע בתאריך הבסיס). תאריך בחודש מסוים מוצמד
          למדד של חודשיים קודם. למשל, 1,000 ₪ מ־03/2020 עד 03/2026 הופכים ל־{money(EX.linkedAmount)}, עלייה של{' '}
          {EX.changePct}%, בדיוק כמו במחשבון של הלמ״ס. המדד האחרון בנתונים הוא {CPI_LAST_MONTH}.
        </p>
      }
      calculator={<CpiLinkageCalculator />}
      content={
        <>
          <h2>איך מחשבים הצמדה למדד</h2>
          <p>
            מחלקים את מדד היעד במדד הבסיס ומכפילים בסכום. אם הבסיס של המדד התחלף בין שני התאריכים, הערך
            החדש מומר לבסיס הישן במקדם השרשור שהלמ״ס מפרסם.
          </p>
          <h3>דוגמה מחושבת</h3>
          <p>
            1,000 ₪ מ־03/2020 עד 03/2026: המדד הידוע בתאריך הבסיס הוא של {EX.fromIndexMonth} ({EX.fromIndexPublished}),
            ובתאריך היעד של {EX.toIndexMonth} ({EX.toIndexPublished}, בבסיס חדש יותר). אחרי שרשור הבסיסים התוצאה
            היא {money(EX.linkedAmount)}.
          </p>

          <h2>איפה זה משמש</h2>
          <ul>
            <li>
              <strong>שכר דירה</strong> בהסכם צמוד מדד: ראו גם <Link href="/compare/rent-vs-buy">שכירות מול קנייה</Link>.
            </li>
            <li>
              <strong>הלוואות ומשכנתאות צמודות:</strong> ראו <Link href="/real-estate/mortgage/guide/index-linked">מסלול צמוד מדד</Link> ואת{' '}
              <Link href="/savings/loan-repayment">מחשבון החזר הלוואה</Link>.
            </li>
            <li>
              <strong>מזונות, קצבאות והסכמים:</strong> סכומים שנקבעו בעבר ומתעדכנים לפי המדד.
            </li>
            <li>
              <strong>ערך אמיתי של כסף:</strong> השוו אינפלציה לתשואה ב<Link href="/investments/compound-interest">מחשבון ריבית דריבית</Link> ובעדכון
              ה<Link href="/news/cpi">אינפלציה</Link>.
            </li>
          </ul>

          <h2>מה לא כלול</h2>
          <p>
            מדד בגין, הצמדה לתאריך אחר ממדד חודשיים אחורה, הצמדה חלקית או מדד שונה מהכללי. הסכם המוצמד לפי
            כללים אחרים יחושב לפי ההסכם.
          </p>
        </>
      }
      faq={<FAQ items={faqItems} />}
      sources={
        <ul>
          <li>
            <a
              href="https://api.cbs.gov.il/index/data/price?id=120010&format=json&download=false"
              target="_blank"
              rel="noopener noreferrer"
            >
              הלשכה המרכזית לסטטיסטיקה — מדד המחירים לצרכן, סדרה 120010
            </a>
          </li>
          <li>
            <a
              href="https://api.cbs.gov.il/index/data/price_selected?id=120010&format=json&download=false"
              target="_blank"
              rel="noopener noreferrer"
            >
              הלמ״ס — מקדמי שרשור בין בסיסים
            </a>
          </li>
        </ul>
      }
    />
  );
}
