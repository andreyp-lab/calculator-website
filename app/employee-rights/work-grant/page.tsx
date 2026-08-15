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
  title: { absolute: 'מחשבון מענק עבודה 2026 (מס הכנסה שלילי) — סימולטור בדיקת זכאות' },
  description:
    'בדיקת זכאות למענק עבודה (מס הכנסה שלילי) 2026 בחינם: הורים מגיל 23 (הורה יחיד מגיל 21), ללא ילדים מגיל 55. חישוב מדויק, כולל הגשה רטרואקטיבית לשנים קודמות.',
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
      'תנאי הזכאות: (1) תושב ישראל הרשום במרשם האוכלוסין; (2) גיל — הורה לילד אחד או יותר מגיל 23 (הורה יחיד מגיל 21); מי שאין לו ילדים זכאי רק מגיל 55 ומעלה; (3) הכנסה שנתית מעבודה בטווח המזכה (תלוי במצב המשפחתי); (4) לך, לבן/בת הזוג או לילד התלוי בך כלכלית אין זכויות במקרקעין (בארץ או בחו"ל) בשיעור העולה על 50% — למעט דירת מגורים יחידה. גם עצמאים זכאים!',
  },
  {
    question: 'כמה כסף מקבלים ממענק עבודה?',
    answer:
      'הסכום תלוי בהכנסה ובמצב משפחתי. מקסימום 2026 (חודשי): הורה ל-1-2 ילדים ובני 55+ — עד 585 ₪/חודש (עד 7,020 ₪ לשנת עבודה מלאה); הורה ל-3+ ילדים — עד 855 ₪/חודש (עד 10,260 ₪); הורה יחיד — מענק מוגדל של 150%. הסכום הגבוה ביותר מתקבל בהכנסה חודשית של 4,260–5,680 ₪ — מעבר לכך המענק יורד בהדרגה.',
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
      'המענק מחושב על ההכנסה החודשית הממוצעת: מתחת ל-2,450 ₪/חודש — אין זכאות; בין 2,450 ל-4,260 ₪ — שלב עלייה (כל שקל נוסף מגדיל את המענק); בין 4,260 ל-5,680 ₪ — טווח השיא; מעל 5,680 ₪ — שלב ירידה, עד איפוס בסביבות 7,380 ₪ (1-2 ילדים) או 8,100 ₪ (3+ ילדים). להורה יחיד הטווח רחב יותר — עד 11,190/13,660 ₪.',
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
          {MAX_INCOME_SINGLE} ₪ ליחיד או עד {MAX_INCOME_PARENT} ₪ להורה; גיל — הורה מגיל{' '}
          {WORK_GRANT_MIN_AGE_WITH_CHILDREN} (הורה יחיד מגיל 21), וללא ילדים רק מגיל{' '}
          {WORK_GRANT_MIN_AGE_NO_CHILDREN}; ואי-החזקה בנדל״ן מעבר לדירת מגורים יחידה. הסכום אינו
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
            נמוך, כדי לתמרץ עבודה על פני קבלת קצבאות. ב-2026, הסכום המקסימלי הוא עד כ-15,390 ₪/שנה
            להורה יחיד עם ילדים. התביעה מוגשת באתר רשות המסים לאחר תום שנת המס — וניתן להגיש
            רטרואקטיבית עד שנתיים מתום שנת המס (ב-2026: שנות המס 2024 ו-2025).
          </p>

          <h2>מי זכאי? — 7 תנאים</h2>
          <ol>
            <li>תושב ישראל הרשום במרשם האוכלוסין</li>
            <li>גיל: הורה מגיל 23 (הורה יחיד מגיל 21) · ללא ילדים — רק מגיל 55</li>
            <li>הכנסה חודשית ממוצעת מעבודה: 2,450–8,100 ₪ (הורה יחיד: 1,510–13,660 ₪)</li>
            <li>ההכנסה החודשית הממוצעת מחושבת לפי חודשי העבודה בפועל (אין דרישת מינימום חודשים לשכיר)</li>
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
                <td className="border border-ink/15 p-2">בני 55+ ללא ילדים</td>
                <td className="border border-ink/15 p-2 text-center font-semibold">עד 7,020 ₪</td>
                <td className="border border-ink/15 p-2 text-center">עד 585 ₪</td>
                <td className="border border-ink/15 p-2 text-center">~7,380 ₪/חודש</td>
              </tr>
              <tr className="bg-cream-2">
                <td className="border border-ink/15 p-2">הורה — 1-2 ילדים</td>
                <td className="border border-ink/15 p-2 text-center font-semibold">עד 7,020 ₪</td>
                <td className="border border-ink/15 p-2 text-center">עד 585 ₪</td>
                <td className="border border-ink/15 p-2 text-center">~7,380 ₪/חודש</td>
              </tr>
              <tr>
                <td className="border border-ink/15 p-2">הורה — 3+ ילדים</td>
                <td className="border border-ink/15 p-2 text-center font-semibold">עד 10,260 ₪</td>
                <td className="border border-ink/15 p-2 text-center">עד 855 ₪</td>
                <td className="border border-ink/15 p-2 text-center">8,100 ₪/חודש</td>
              </tr>
              <tr className="bg-cream-2">
                <td className="border border-ink/15 p-2">הורה יחיד — 1-2 ילדים</td>
                <td className="border border-ink/15 p-2 text-center font-semibold">עד 10,530 ₪</td>
                <td className="border border-ink/15 p-2 text-center">עד ~878 ₪</td>
                <td className="border border-ink/15 p-2 text-center">11,190 ₪/חודש</td>
              </tr>
            </tbody>
          </table>

          <h2>איך מגישים — שלב אחר שלב</h2>
          <ol>
            <li>היכנס לאתר רשות המסים: taxes.gov.il</li>
            <li>חפש "מענק עבודה" ולחץ "הגשת בקשה"</li>
            <li>הזן תעודת זהות ופרטי כניסה</li>
            <li>אין חובה לצרף טופס 106 — רשות המסים מצליבה מול דיווחי המעסיק</li>
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
