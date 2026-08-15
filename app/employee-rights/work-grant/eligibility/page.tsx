import Link from 'next/link';
import { Metadata } from 'next';
import { CalculatorLayout } from '@/components/calculator/CalculatorLayout';
import { NITCalculator } from '@/components/calculators/NITCalculator';
import { FAQ } from '@/components/calculator/FAQ';
import { HowToSchema } from '@/components/seo/HowToSchema';
import {
  WORK_GRANT_MIN_INCOME_2026,
  WORK_GRANT_PEAK_INCOME_2026,
  WORK_GRANT_MAX_INCOME_SINGLE_2026,
  WORK_GRANT_MAX_INCOME_PARENT_2026,
  WORK_GRANT_MIN_AGE_NO_CHILDREN,
  WORK_GRANT_MIN_AGE_WITH_CHILDREN,
  WORK_GRANT_MIN_MONTHS_SALARIED,
  WORK_GRANT_MIN_WEEKS_SELF_EMPLOYED,
  calculateMaxGrant,
} from '@/lib/calculators/work-grant';

const PAGE_PATH = '/employee-rights/work-grant/eligibility';

// כל מספר בדף נשלף מקבועי המחשבון — אתר YMYL, אין מספרים כתובים ביד.
const nis = (n: number) => n.toLocaleString('he-IL');
const MIN_INCOME = nis(WORK_GRANT_MIN_INCOME_2026);
const PEAK_INCOME = nis(WORK_GRANT_PEAK_INCOME_2026);
const MAX_SINGLE = nis(WORK_GRANT_MAX_INCOME_SINGLE_2026);
const MAX_PARENT = nis(WORK_GRANT_MAX_INCOME_PARENT_2026);
const MAX_GRANT_SINGLE = nis(Math.round(calculateMaxGrant(0, false)));
const MAX_GRANT_PARENT_2 = nis(Math.round(calculateMaxGrant(2, false)));
const MAX_GRANT_SINGLE_PARENT_2 = nis(Math.round(calculateMaxGrant(2, true)));

export const metadata: Metadata = {
  title: { absolute: `בדיקת זכאות למענק עבודה 2026 — מס הכנסה שלילי` },
  description: `בדוק תוך 30 שניות אם מגיע לך מענק עבודה 2026: הכנסה ${MIN_INCOME}–${MAX_PARENT} ₪, גיל — הורה מ-${WORK_GRANT_MIN_AGE_WITH_CHILDREN}, ללא ילדים מ-${WORK_GRANT_MIN_AGE_NO_CHILDREN}. בדיקת זכאות חינם, כולל שנים קודמות.`,
  alternates: { canonical: PAGE_PATH },
  openGraph: {
    title: 'בדיקת זכאות למענק עבודה 2026 — מס הכנסה שלילי',
    description: `בדוק אם מגיע לך מענק עבודה: תנאי הכנסה, גיל וּותק, ומה הסכום שתקבל.`,
    url: PAGE_PATH,
    type: 'article',
    locale: 'he_IL',
    images: ['/opengraph-image'],
  },
};

const faqItems = [
  {
    question: 'איך בודקים זכאות למענק עבודה?',
    answer: `בדיקת הזכאות מצליבה ארבעה תנאים: תושבות ישראלית, גיל, הכנסה שנתית מעבודה וּותק תעסוקתי. הכנסה שנתית מעבודה צריכה להיות בין ${MIN_INCOME} ₪ ל-${MAX_SINGLE} ₪ ליחיד או ${MAX_PARENT} ₪ להורה; הגיל — הורה מגיל ${WORK_GRANT_MIN_AGE_WITH_CHILDREN} (הורה יחיד מגיל 21), וללא ילדים רק מגיל ${WORK_GRANT_MIN_AGE_NO_CHILDREN}; והוותק ${WORK_GRANT_MIN_MONTHS_SALARIED} חודשים כשכיר או ${WORK_GRANT_MIN_WEEKS_SELF_EMPLOYED} שבועות כעצמאי. הכלי בדף בודק את כל התנאים יחד ומחזיר תשובה חד-משמעית.`,
  },
  {
    question: 'מה ההבדל בין מענק עבודה למס הכנסה שלילי?',
    answer:
      'אין הבדל — אלו שני שמות לאותה תוכנית. "מס הכנסה שלילי" הוא הכינוי המקורי, "מענק עבודה" הוא השם הרשמי שרשות המסים משתמשת בו היום. אם חיפשת אחד מהם, הגעת למקום הנכון.',
  },
  {
    question: 'אני עצמאי — האם אני זכאי?',
    answer: `כן. עצמאי זכאי אם עבד לפחות ${WORK_GRANT_MIN_WEEKS_SELF_EMPLOYED} שבועות בשנת המס, ב-50% או יותר מהזמן הרגיל. ההכנסה הנחשבת היא ההכנסה מעסק או ממשלח יד כפי שדווחה בדוח השנתי. שים לב שהוצאות מוכרות מקטינות את ההכנסה החייבת — וזה עשוי להכניס אותך לטווח הזכאות או להוציא אותך ממנו.`,
  },
  {
    question: 'הכנסתי גבוהה מדי. יש בכלל טווח שבו כדאי להרוויח פחות?',
    answer: `לא כדאי להקטין הכנסה בכוונה, אבל חשוב להבין את המבנה: המענק עולה עד הכנסה של ${PEAK_INCOME} ₪ בשנה, ומשם יורד עד שהוא מתאפס ב-${MAX_SINGLE} ₪ (יחיד) או ${MAX_PARENT} ₪ (הורה). בשלב העלייה כל שקל נוסף מגדיל את המענק; בשלב הירידה כל שקל נוסף מקטין אותו — אבל תמיד בפחות משקל, כך שההכנסה הכוללת ממשיכה לעלות.`,
  },
  {
    question: 'לא הגשתי בשנים קודמות — עדיין אפשר?',
    answer:
      'כן, אבל רק עד שנתיים מתום שנת המס (סעיף 7(א)(1) לחוק מענק עבודה) — ב-2026 זה שנות המס 2024 ו-2025 בלבד. "6 שנים אחורה" נכון להחזר מס, לא למענק. בדיקת זכאות לשנה קודמת משתמשת בסכומים של אותה שנה, אבל תנאי הזכאות עצמם דומים.',
  },
  {
    question: 'הבדיקה מראה שאני זכאי. מה עכשיו?',
    answer:
      'הגשה נעשית באתר רשות המסים, לאחר תום שנת המס ועד שנתיים מתומה (מי שמגיש עד 30.6 מקבל את התשלום הראשון ב-15.7). נדרשים תעודת זהות ואסמכתת חשבון בנק; עצמאי חייב שהדוח השנתי לאותה שנה הוגש במועד. ההחלטה ניתנת עד 90 יום מתביעה מלאה, והכסף מועבר ישירות לחשבון.',
  },
  {
    question: 'האם המענק פוגע בקצבאות אחרות או חייב במס?',
    answer:
      'לא ולא. מענק עבודה פטור ממס הכנסה ומביטוח לאומי — הסכום שמתקבל הוא נטו מלא. הוא גם אינו נחשב הכנסה לצורך קצבאות הביטוח הלאומי, כך שקצבת ילדים, קצבת זקנה ודמי אבטלה אינם נפגעים.',
  },
];

const howToSteps = [
  {
    name: 'בדוק תושבות וגיל',
    text: `צריך להיות תושב ישראל הרשום במרשם האוכלוסין, ובגיל המזכה: הורה מגיל ${WORK_GRANT_MIN_AGE_WITH_CHILDREN} (הורה יחיד מגיל 21); ללא ילדים — מגיל ${WORK_GRANT_MIN_AGE_NO_CHILDREN} ומעלה.`,
  },
  {
    name: 'חשב את ההכנסה השנתית מעבודה',
    text: `סכום ההכנסה ממשכורת או מעסק בלבד — ללא קצבאות ושכר דירה. הטווח הקובע: ${MIN_INCOME}–${MAX_SINGLE} ₪ ליחיד, ועד ${MAX_PARENT} ₪ להורה.`,
  },
  {
    name: 'ודא ותק תעסוקתי',
    text: `לפחות ${WORK_GRANT_MIN_MONTHS_SALARIED} חודשי עבודה כשכיר בשנת המס, או ${WORK_GRANT_MIN_WEEKS_SELF_EMPLOYED} שבועות כעצמאי ב-50%+ מהזמן.`,
  },
  {
    name: 'הרץ את בדיקת הזכאות',
    text: 'הזן גיל, הכנסה שנתית, מספר ילדים וחודשי עבודה בכלי שבדף. התוצאה מציגה זכאות כן/לא, ואם כן — את הסכום המשוער.',
    url: `https://cheshbonai.co.il${PAGE_PATH}`,
  },
  {
    name: 'הגש בקשה לרשות המסים',
    text: 'אם נמצאת זכאי, הגש תביעה מקוונת באתר רשות המסים עם תעודת זהות ואסמכתת חשבון בנק (אין חובה לצרף טופס 106; עצמאי — הדוח השנתי חייב להיות מוגש). ההחלטה ניתנת עד 90 יום מתביעה מלאה.',
  },
];

export default function Page() {
  return (
    <>
      <HowToSchema
        name="איך בודקים זכאות למענק עבודה 2026"
        description="חמישה שלבים לבדיקת זכאות למענק עבודה (מס הכנסה שלילי) ולהגשת הבקשה לרשות המסים."
        steps={howToSteps}
        totalTime="PT5M"
      />
      <CalculatorLayout
        title="בדיקת זכאות למענק עבודה 2026 — מס הכנסה שלילי"
        description="בדוק אם מגיע לך מענק עבודה: תנאי הכנסה, גיל וּותק תעסוקתי, ומה הסכום שתקבל בפועל."
        breadcrumbs={[
          { label: 'דף הבית', href: '/' },
          { label: 'זכויות עובדים', href: '/employee-rights' },
          { label: 'מענק עבודה', href: '/employee-rights/work-grant' },
          { label: 'בדיקת זכאות' },
        ]}
        pageUrl={PAGE_PATH}
        lastUpdated="2026-07-30"
        quickAnswer={
          <p>
            <strong>אתה זכאי למענק עבודה 2026 אם מתקיימים ארבעת התנאים:</strong> אתה תושב ישראל;
            גילך מזכה — הורה מגיל {WORK_GRANT_MIN_AGE_WITH_CHILDREN} (הורה יחיד מגיל 21), וללא
            ילדים מגיל {WORK_GRANT_MIN_AGE_NO_CHILDREN} ומעלה;
            הכנסתך השנתית <strong>מעבודה בלבד</strong> נעה בין {MIN_INCOME} ₪ ל-{MAX_SINGLE} ₪
            (יחיד) או עד {MAX_PARENT} ₪ (הורה); ועבדת לפחות{' '}
            {WORK_GRANT_MIN_MONTHS_SALARIED} חודשים כשכיר או {WORK_GRANT_MIN_WEEKS_SELF_EMPLOYED}{' '}
            שבועות כעצמאי. הסכום נע עד {MAX_GRANT_SINGLE} ₪ ליחיד ללא ילדים ועד{' '}
            {MAX_GRANT_SINGLE_PARENT_2} ₪ להורה יחיד לשני ילדים, פטור ממס. הבדיקה למטה מצליבה את
            כל התנאים ומחזירה תשובה תוך 30 שניות.
          </p>
        }
        calculator={<NITCalculator initialTab="eligibility" />}
        content={
          <>
            <h2>ארבעת תנאי הזכאות — במדויק</h2>
            <table className="w-full text-sm border-collapse my-4">
              <thead>
                <tr className="bg-ink text-cream">
                  <th className="border border-ink/20 p-2 text-right">תנאי</th>
                  <th className="border border-ink/20 p-2 text-right">הדרישה</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-ink/15 p-2 font-semibold">תושבות</td>
                  <td className="border border-ink/15 p-2">
                    תושב ישראל הרשום במרשם האוכלוסין
                  </td>
                </tr>
                <tr className="bg-cream-2">
                  <td className="border border-ink/15 p-2 font-semibold">גיל</td>
                  <td className="border border-ink/15 p-2">
                    הורה: מגיל {WORK_GRANT_MIN_AGE_WITH_CHILDREN} (הורה יחיד: 21) ·{' '}
                    ללא ילדים: מגיל {WORK_GRANT_MIN_AGE_NO_CHILDREN}
                  </td>
                </tr>
                <tr>
                  <td className="border border-ink/15 p-2 font-semibold">הכנסה שנתית מעבודה</td>
                  <td className="border border-ink/15 p-2">
                    {MIN_INCOME}–{MAX_SINGLE} ₪ (יחיד) · {MIN_INCOME}–{MAX_PARENT} ₪ (הורה)
                  </td>
                </tr>
                <tr className="bg-cream-2">
                  <td className="border border-ink/15 p-2 font-semibold">ותק תעסוקתי</td>
                  <td className="border border-ink/15 p-2">
                    {WORK_GRANT_MIN_MONTHS_SALARIED} חודשים כשכיר · או{' '}
                    {WORK_GRANT_MIN_WEEKS_SELF_EMPLOYED} שבועות כעצמאי ב-50%+ מהזמן
                  </td>
                </tr>
              </tbody>
            </table>

            <h2>שלוש הטעויות שמפילות בדיקות זכאות</h2>
            <ol>
              <li>
                <strong>סופרים הכנסה שאינה מעבודה.</strong> קצבאות, שכר דירה, ריבית ודיבידנד אינם
                נספרים בטווח ההכנסה הקובע. מי שסופר אותם עלול לחשוב שהוא מעל התקרה בזמן שהוא בתוך
                הטווח.
              </li>
              <li>
                <strong>עצמאים שמזינים מחזור במקום הכנסה חייבת.</strong> ההכנסה הקובעת היא לאחר
                ניכוי הוצאות מוכרות. ההפרש בין השניים הוא לרוב מה שמכניס עצמאי לטווח הזכאות. ראו{' '}
                <Link href="/self-employed/allowed-expenses">מדריך ההוצאות המוכרות</Link>.
              </li>
              <li>
                <strong>מוותרים אחרי בדיקה שלילית לשנה אחת.</strong> הזכאות נבדקת לכל שנת מס
                בנפרד. שנה שבה עבדת חלקית או החלפת עבודה עשויה דווקא ליפול בתוך הטווח.
              </li>
            </ol>

            <h2>מה קורה מעל ומתחת לטווח</h2>
            <p>
              המענק אינו סכום קבוע אלא עקומה. הוא מתחיל לצבור מהכנסה של {MIN_INCOME} ₪, מגיע לשיא
              בהכנסה של {PEAK_INCOME} ₪, ומשם יורד בהדרגה עד שהוא מתאפס ב-{MAX_SINGLE} ₪ ליחיד או{' '}
              {MAX_PARENT} ₪ להורה. משמעות מעשית: מי שנמצא בשלב העלייה מגדיל את המענק עם כל שקל
              נוסף שהוא מרוויח. גרף העקומה המלא, לפי מספר הילדים, נמצא ב
              <Link href="/employee-rights/work-grant">מחשבון המענק</Link>.
            </p>

            <h2>סכומים מקסימליים 2026</h2>
            <ul>
              <li>יחיד ללא ילדים — עד {MAX_GRANT_SINGLE} ₪ בשנה</li>
              <li>הורה לשני ילדים — עד {MAX_GRANT_PARENT_2} ₪ בשנה</li>
              <li>הורה יחיד לשני ילדים — עד {MAX_GRANT_SINGLE_PARENT_2} ₪ בשנה</li>
            </ul>
            <p>הסכומים פטורים ממס הכנסה ומביטוח לאומי, ואינם מקטינים קצבאות אחרות.</p>

            <h2>נמצאת זכאי — ומה הלאה</h2>
            <ol>
              <li>
                ההגשה נפתחת אחרי תום שנת המס ופתוחה עד שנתיים מתומה. מומלץ להגיש עד 30.6 —
                כך התשלום הראשון מתקבל כבר ב-15.7.
              </li>
              <li>הגשה באתר רשות המסים, במסלול &quot;מענק עבודה&quot;.</li>
              <li>
                מסמכים: תעודת זהות ואסמכתת חשבון בנק בלבד (אין חובה לצרף טופס 106). עצמאי —
                הדוח השנתי לאותה שנה חייב להיות מוגש במועד.
              </li>
              <li>עיבוד: עד 90 יום, תשלום ישירות לחשבון.</li>
              <li>
                בדוק גם את שנת המס הקודמת — ניתן להגיש עד שנתיים מתום שנת המס. פירוט ב
                <Link href="/employee-rights/work-grant/retroactive">מדריך ההגשה הרטרואקטיבית</Link>.
              </li>
            </ol>

            <h2>כלים קשורים</h2>
            <ul>
              <li>
                <Link href="/employee-rights/work-grant">מחשבון מענק עבודה</Link> — חישוב הסכום
                המדויק, גרף העקומה והשוואת שנים
              </li>
              <li>
                <Link href="/personal-tax/tax-refund">מחשבון החזר מס</Link> — זכאות נפרדת שרבים
                מפספסים במקביל למענק
              </li>
              <li>
                <Link href="/personal-tax/tax-credits">מחשבון נקודות זיכוי</Link> — כמה שווה כל
                נקודה ואילו מגיעות לך
              </li>
              <li>
                <Link href="/employee-rights/unemployment-benefits">מחשבון דמי אבטלה</Link> —
                לתקופות שבין עבודות
              </li>
            </ul>
          </>
        }
        sources={
          <ul>
            <li>
              <a href="https://www.gov.il/he/service/negative-income-tax" rel="nofollow noopener">
                רשות המסים — מענק עבודה (מס הכנסה שלילי)
              </a>
            </li>
            <li>
              <a
                href="https://www.kolzchut.org.il/he/מענק_עבודה_(מענק_הכנסה,_מס_הכנסה_שלילי)"
                rel="nofollow noopener"
              >
                כל זכות — מענק עבודה
              </a>
            </li>
          </ul>
        }
        faq={<FAQ items={faqItems} />}
      />
    </>
  );
}
