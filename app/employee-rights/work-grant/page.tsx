import Link from 'next/link';
import { Metadata } from 'next';
import { CalculatorLayout } from '@/components/calculator/CalculatorLayout';
import { NITCalculator } from '@/components/calculators/NITCalculator';
import { FAQ } from '@/components/calculator/FAQ';
import {
  WORK_GRANT_MIN_INCOME_2026,
  WORK_GRANT_PEAK_INCOME_2026,
  WORK_GRANT_MAX_INCOME_SINGLE_2026,
  WORK_GRANT_MAX_INCOME_PARENT_2026,
  WORK_GRANT_BASE_MAX_2026,
  WORK_GRANT_MIN_AGE_NO_CHILDREN,
  WORK_GRANT_MIN_AGE_WITH_CHILDREN,
  calculateMaxGrant,
} from '@/lib/calculators/work-grant';

// כל מספר ב-quickAnswer נשלף מקבועי המנוע — אתר YMYL, אין מספרים כתובים ביד.
const nis = (n: number) => n.toLocaleString('he-IL');
const MIN_INCOME = nis(WORK_GRANT_MIN_INCOME_2026);
const PEAK_INCOME = nis(WORK_GRANT_PEAK_INCOME_2026);
const MAX_INCOME_SINGLE = nis(WORK_GRANT_MAX_INCOME_SINGLE_2026);
const MAX_INCOME_PARENT = nis(WORK_GRANT_MAX_INCOME_PARENT_2026);
const MAX_SINGLE = nis(WORK_GRANT_BASE_MAX_2026);
// הסכום הגבוה ביותר שהתוכנית מאפשרת: הורה יחיד ל-3 ילדים.
const MAX_OVERALL = nis(calculateMaxGrant(3, true));

export const metadata: Metadata = {
  title: { absolute: 'מחשבון מענק עבודה 2026 — בדיקת זכאות מיידית וחישוב הסכום' },
  description:
    'בדיקת זכאות למענק עבודה (מס הכנסה שלילי) 2026 בחינם: הכנסה 30,240–99,960 ₪, גיל 21/23+. חישוב מדויק עד 13,142 ₪/שנה, כולל הגשה רטרואקטיבית לשנים קודמות.',
  alternates: { canonical: '/employee-rights/work-grant' },
};

const faqItems = [
  {
    question: 'מה זה מענק עבודה (מס הכנסה שלילי)?',
    answer:
      'מענק עבודה (Earned Income Tax Credit — EITC, או "מס הכנסה שלילי") הוא תוכנית ממשלתית שמעניקה כסף לעובדים בשכר נמוך, כתמריץ לעבודה. במקום שאתה תשלם מס — המדינה משלמת לך. התוכנית הוקמה כדי להפוך עבודה בשכר נמוך לכדאית יותר מאשר קבלת קצבאות.',
  },
  {
    question: 'מי זכאי למענק עבודה 2026?',
    answer:
      'תנאי הזכאות: (1) תושב ישראל הרשום במרשם האוכלוסין; (2) גיל 23+ ללא ילדים, 21+ עם ילדים, או 56–62 ללא ילדים; (3) הכנסה שנתית מעבודה בין 30,240 ל-83,400 ₪ (יחיד) / 99,960 ₪ (הורה); (4) עבד לפחות 6 חודשים כשכיר, או 13 שבועות כעצמאי ב-50%+ מהזמן. גם עצמאים זכאים!',
  },
  {
    question: 'כמה כסף מקבלים ממענק עבודה?',
    answer:
      'הסכום תלוי בהכנסה ובמצב משפחתי. מקסימום 2026: יחיד ללא ילדים ~5,506 ₪; הורה לילד אחד ~7,068 ₪; הורה לשני ילדים ~8,630 ₪; הורה לשלושה ילדים ~10,192 ₪. הורה יחיד מקבל תוספת של ~2,950 ₪ נוספים. הסכום הגבוה ביותר מתקבל בהכנסה של ~67,320 ₪/שנה — אחרי זה יורד.',
  },
  {
    question: 'איך מגישים בקשה למענק עבודה?',
    answer:
      'דרך אתר רשות המסים: https://www.gov.il → "מענק עבודה" → "הגשת בקשה". נדרש: תעודת זהות ואסמכתת חשבון בנק (אין חובה לצרף טופס 106 — הרשות מצליבה מול דוחות המעסיק). התביעה המקוונת פתוחה כל השנה לשתי שנות המס האחרונות; מי שמגיש עד 30.6 מקבל את התשלום הראשון ב-15.7. ההחלטה ניתנת עד 90 יום מתביעה מלאה או עד 15 ביולי, לפי המאוחר.',
  },
  {
    question: 'האם אפשר להגיש מענק עבודה על שנים קודמות?',
    answer:
      'כן, אבל פחות ממה שנהוג לחשוב: לפי סעיף 7(א)(1) לחוק מענק עבודה ניתן לתבוע עד שנתיים מתום שנת המס — בשנת 2026 זה שנות המס 2024 ו-2025 בלבד. הטענה הנפוצה על "6 שנים אחורה" נכונה להחזר מס, לא למענק עבודה. אם היית זכאי בשתי השנים הפתוחות ולא הגשת — מדובר בשתי תביעות במקביל ששוות אלפי שקלים כל אחת.',
  },
  {
    question: 'האם גם עצמאי זכאי למענק עבודה?',
    answer:
      'כן. עצמאי זכאי בתנאי שעבד לפחות 13 שבועות בשנת המס, ב-50% או יותר מהזמן הרגיל. ההכנסה הנחשבת היא הכנסה מעסק/משלח יד כפי שדווחה בדוח השנתי לרשות המסים. חשוב: ניכויים (כמו הוצאות עסקיות) מורידים את ההכנסה החייבת ועלולים להשפיע על הזכאות.',
  },
  {
    question: 'האם מענק עבודה פוגע בקצבאות אחרות?',
    answer:
      'לא. מענק עבודה לא נחשב כהכנסה לצורך קצבאות הביטוח הלאומי (קצבת ילדים, קצבת זקנה, דמי אבטלה). הוא גם אינו גורם להפחתה בקצבאות אחרות שאתה מקבל. קצבת ילדים וקצבת מענק עבודה ניתן לקבל בו-זמנית.',
  },
  {
    question: 'האם צריך לשלם מס על מענק עבודה?',
    answer:
      'לא. מענק עבודה פטור ממס הכנסה ומביטוח לאומי. הסכום שמשולם הוא נטו לחלוטין. זוהי אחת הסיבות שהתוכנית אפקטיבית — כל שקל שמגיע לך מגיע ישירות לחשבון.',
  },
  {
    question: 'מה ההבדל בין מענק עבודה לבין קצבת ילדים?',
    answer:
      'קצבת ילדים: ניתנת אוטומטית מביטוח לאומי, לא תלויה בהכנסה, לא דורשת הגשה. מענק עבודה: תלוי בהכנסה מעבודה, דורש הגשת בקשה פעילה, מגיע רק לטווח הכנסות מסוים. שניהם ניתן לקבל יחד — הם מנגנונים נפרדים.',
  },
  {
    question: 'מה קורה אם הכנסתי גבוהה מדי או נמוכה מדי?',
    answer:
      'אם הכנסתך נמוכה מ-30,240 ₪/שנה — לא זכאי. ייתכן שהגדלת שעות עבודה תביא לטווח הזכאות. אם הכנסתך גבוהה מ-83,400 ₪ (יחיד) / 99,960 ₪ (הורה) — לא זכאי. אם הכנסתך נופלת בין הסף לבין שיא ב-67,320 ₪ — אתה בשלב עלייה (כל עלייה בהכנסה מגדילה המענק). אם אתה מעל 67,320 ₪ — שלב ירידה (כל עלייה מקטינה).',
  },
  {
    question: 'כמה זמן לוקח לקבל את הכסף?',
    answer:
      'רשות המסים מחויבת לעבד בקשות תוך 90 יום מהגשה. בפועל, בתקופת השיא (אוגוסט–ספטמבר), עיבוד עשוי להתארך. ניתן לעקוב אחר סטטוס הבקשה באתר רשות המסים. הכסף מועבר ישירות לחשבון הבנק.',
  },
];

export default function Page() {
  return (
    <CalculatorLayout
      title="מחשבון מענק עבודה 2026 — בדיקת זכאות וחישוב הסכום"
      description="בדיקת זכאות למענק עבודה (מס הכנסה שלילי) + חישוב מדויק לפי הכנסה, גיל ומצב משפחתי. כולל גרף עקומת המענק, השוואה 2024 vs 2026, ובדיקת כל תנאי הזכאות."
      breadcrumbs={[
        { label: 'דף הבית', href: '/' },
        { label: 'זכויות עובדים', href: '/employee-rights' },
        { label: 'מענק עבודה' },
      ]}
      lastUpdated="2026-05-15"
      pageUrl="/employee-rights/work-grant"
      calculator={<NITCalculator />}
      quickAnswer={
        <p className="text-lg text-ink leading-relaxed">
          <strong>
            מענק עבודה (מס הכנסה שלילי) הוא תשלום של רשות המסים לעובדים בשכר נמוך — עד{' '}
            {MAX_OVERALL} ₪ בשנה, פטור ממס וללא פגיעה בקצבאות.
          </strong>{' '}
          הזכאות ב-2026 נשענת על שלושה תנאים: הכנסה שנתית מעבודה בין {MIN_INCOME} ל-
          {MAX_INCOME_SINGLE} ₪ ליחיד או עד {MAX_INCOME_PARENT} ₪ להורה; גיל{' '}
          {WORK_GRANT_MIN_AGE_NO_CHILDREN}+ ללא ילדים או {WORK_GRANT_MIN_AGE_WITH_CHILDREN}+ עם
          ילדים (וכן 56–62 בכל מקרה); ולפחות 6 חודשי עבודה כשכיר או 13 שבועות כעצמאי. הסכום אינו
          עולה ככל שמרוויחים יותר: הוא מטפס עד הכנסה של {PEAK_INCOME} ₪ בשנה, שם הוא מגיע לשיא —{' '}
          {MAX_SINGLE} ₪ ליחיד ללא ילדים, ויותר לכל ילד — ומשם יורד עד אפס בתקרה. גם עצמאים
          זכאים, וניתן להגיש רטרואקטיבית עד שנתיים מתום שנת המס. המחשבון שמתחת בודק את כל התנאים
          ומחשב את הסכום המדויק לפי ההכנסה, הגיל ומספר הילדים.
        </p>
      }
      content={
        <>
          <h2>מענק עבודה — הזכות הפיננסית שרבים לא מכירים</h2>
          <p>
            מענק עבודה (Earned Income Tax Credit) הוא תוכנית של רשות המסים שמשלמת כסף לעובדים בשכר
            נמוך, כדי לתמרץ עבודה על פני קבלת קצבאות. ב-2026, הסכום המקסימלי הוא כ-13,142 ₪/שנה
            להורה יחיד עם ילדים. התביעה מוגשת באתר רשות המסים לאחר תום שנת המס — וניתן להגיש
            רטרואקטיבית עד שנתיים מתום שנת המס (ב-2026: שנות המס 2024 ו-2025).
          </p>

          <h2>מי זכאי? — 7 תנאים</h2>
          <ol>
            <li>תושב ישראל הרשום במרשם האוכלוסין</li>
            <li>גיל 23+ (ללא ילדים), 21+ (עם ילדים), או 56–62 (בכל מקרה)</li>
            <li>הכנסה שנתית מעבודה: 30,240–99,960 ₪ (בהתאם למצב)</li>
            <li>עבד לפחות 6 חודשים כשכיר, או 13 שבועות כעצמאי (50%+ מהזמן)</li>
            <li>הכנסה ממקור עבודה (לא קצבאות/שכירות)</li>
            <li>הכנסה משקית כוללת בתוך התקרות</li>
            <li>לא קיבל כפילות מהסניפים הממשלתיים האחרים</li>
          </ol>

          <h2>טבלת סכומים מקסימליים 2026</h2>
          <table className="w-full text-sm border-collapse my-4">
            <thead>
              <tr className="bg-ink text-cream">
                <th className="border border-ink/20 p-2 text-right">מצב משפחתי</th>
                <th className="border border-ink/20 p-2 text-center">מקסימום שנתי</th>
                <th className="border border-ink/20 p-2 text-center">חודשי</th>
                <th className="border border-ink/20 p-2 text-center">הכנסה מקסימלית</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-ink/15 p-2">יחיד ללא ילדים</td>
                <td className="border border-ink/15 p-2 text-center font-semibold">~5,506 ₪</td>
                <td className="border border-ink/15 p-2 text-center">~459 ₪</td>
                <td className="border border-ink/15 p-2 text-center">83,400 ₪</td>
              </tr>
              <tr className="bg-cream-2">
                <td className="border border-ink/15 p-2">הורה — ילד אחד</td>
                <td className="border border-ink/15 p-2 text-center font-semibold">~7,068 ₪</td>
                <td className="border border-ink/15 p-2 text-center">~589 ₪</td>
                <td className="border border-ink/15 p-2 text-center">99,960 ₪</td>
              </tr>
              <tr>
                <td className="border border-ink/15 p-2">הורה — שני ילדים</td>
                <td className="border border-ink/15 p-2 text-center font-semibold">~8,630 ₪</td>
                <td className="border border-ink/15 p-2 text-center">~719 ₪</td>
                <td className="border border-ink/15 p-2 text-center">99,960 ₪</td>
              </tr>
              <tr className="bg-cream-2">
                <td className="border border-ink/15 p-2">הורה יחיד — שני ילדים</td>
                <td className="border border-ink/15 p-2 text-center font-semibold">~11,580 ₪</td>
                <td className="border border-ink/15 p-2 text-center">~965 ₪</td>
                <td className="border border-ink/15 p-2 text-center">99,960 ₪</td>
              </tr>
            </tbody>
          </table>

          <h2>איך מגישים — שלב אחר שלב</h2>
          <ol>
            <li>היכנס לאתר רשות המסים: taxes.gov.il</li>
            <li>חפש "מענק עבודה" ולחץ "הגשת בקשה"</li>
            <li>הזן תעודת זהות ופרטי כניסה</li>
            <li>העלה טופס 106 (מהמעסיק) / דוח שנתי (עצמאי)</li>
            <li>הזן פרטי חשבון בנק לקבלת התשלום</li>
            <li>שלח ועקוב אחר סטטוס הבקשה</li>
          </ol>

          <h2>הגשה רטרואקטיבית — עד שנתיים אחורה</h2>
          <p>
            החוק מאפשר לתבוע מענק עבודה עד שנתיים מתום שנת המס — ב-2026 ניתן להגיש על שנות
            המס 2024 ו-2025 בלבד (הטענה על &quot;6 שנים אחורה&quot; נכונה להחזר מס, לא למענק).
            אם לא הגשת על השנים הפתוחות, מדובר בשתי תביעות במקביל. המדריך המלא, כולל המועדים
            המדויקים ומסלול ההגשה באיחור:{' '}
            <Link href="/employee-rights/work-grant/retroactive">
              מענק עבודה רטרואקטיבית — לאילו שנים אפשר להגיש
            </Link>
            .
          </p>

          <h2>מחשבונים קשורים</h2>
          <ul>
            <li>
              <Link href="/employee-rights/work-grant/eligibility">בדיקת זכאות למענק עבודה</Link> — ארבעת התנאים, הטעויות הנפוצות ותשובת כן/לא
            </li>
            <li>
              <Link href="/employee-rights/work-grant/retroactive">מענק עבודה רטרואקטיבית</Link> — לאילו שנות מס עוד אפשר להגיש, ואיך תובעים שנה קודמת
            </li>
            <li>
              <Link href="/employee-rights/minimum-wage">מחשבון שכר מינימום 2026</Link> — בדוק אם השכר שלך עומד בדרישות החוק
            </li>
            <li>
              <Link href="/personal-tax/salary-net-gross">מחשבון שכר נטו–ברוטו</Link> — חשב את השכר נטו לאחר מסים וביטוח לאומי
            </li>
            <li>
              <Link href="/personal-tax/tax-credits">מחשבון נקודות זיכוי</Link> — גלה אילו נקודות זיכוי מגיעות לך
            </li>
            <li>
              <Link href="/employee-rights/recreation-pay">מחשבון דמי הבראה</Link> — חשב את דמי ההבראה המגיעים לך
            </li>
          </ul>
        </>
      }
      faq={<FAQ items={faqItems} />}
    />
  );
}
