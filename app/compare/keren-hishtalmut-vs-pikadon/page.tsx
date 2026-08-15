import { Metadata } from 'next';
import Link from 'next/link';
import { CalculatorLayout } from '@/components/calculator/CalculatorLayout';
import { CompoundInterestCalculator } from '@/components/calculators/CompoundInterestCalculator';
import { FAQ } from '@/components/calculator/FAQ';
import { STUDY_FUND_2026 } from '@/lib/constants/tax-2026';
import { STANDARD_TAX_RATE } from '@/lib/calculators/capital-gains-tax';

// ============================================================
// נתוני מס נגזרים מקבועי האתר ככל האפשר.
// מס על ריבית פיקדון שקלי לא-צמוד: 15% נומינלי; פיקדון צמוד: 25% ריאלי.
// מקור: פקודת מס הכנסה סעיף 125ג; אומת מול bizportal/kolzchut 2026-08-15.
// ============================================================
const DEPOSIT_TAX_NOMINAL = 0.15; // ריבית נומינלית, פיקדון שקלי לא צמוד
const DEPOSIT_TAX_REAL = STANDARD_TAX_RATE; // 25% ריאלי - פיקדון צמוד מדד/מט"ח

const pct = (v: number) =>
  `${(v * 100).toLocaleString('he-IL', { maximumFractionDigits: 2 })}%`;
const fmt = (n: number) => Math.round(n).toLocaleString('he-IL');

const MAX_DEPOSIT = fmt(STUDY_FUND_2026.maxAnnualDeposit); // תקרת הפקדה מוטבת לעצמאי
const DEDUCTION_PCT = pct(STUDY_FUND_2026.taxDeductionPercentage); // 4.5% ניכוי
const INCOME_CEILING = fmt(STUDY_FUND_2026.incomeCeilingSelfEmployed); // תקרת הכנסה קובעת
const DEDUCTION_CAP = fmt(
  STUDY_FUND_2026.taxDeductionPercentage * STUDY_FUND_2026.incomeCeilingSelfEmployed,
); // תקרת ניכוי בפועל
const NOMINAL_TAX_PCT = pct(DEPOSIT_TAX_NOMINAL);
const REAL_TAX_PCT = pct(DEPOSIT_TAX_REAL);

export const metadata: Metadata = {
  title: 'קרן השתלמות מול פיקדון בנקאי - איפה לשים את הכסף?',
  description:
    `קרן השתלמות או פיקדון בנקאי? השוואה מלאה 2026: פטור ממס רווח הון עד תקרת הפקדה מול מס ${pct(DEPOSIT_TAX_NOMINAL)}/${pct(DEPOSIT_TAX_REAL)} על פיקדון, נזילות, תשואה ולמי מתאים כל אפיק.`,
  alternates: { canonical: '/compare/keren-hishtalmut-vs-pikadon' },
};

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'קרן השתלמות מול פיקדון בנקאי - השוואה מקיפה 2026',
  description:
    'השוואה בין קרן השתלמות לפיקדון בנקאי: הטבות מס, נזילות, תשואה צפויה ורמת סיכון - למי מתאים כל אפיק חיסכון.',
  url: 'https://cheshbonai.co.il/compare/keren-hishtalmut-vs-pikadon',
  inLanguage: 'he-IL',
  datePublished: '2026-08-15',
  dateModified: '2026-08-15',
  author: {
    '@type': 'Organization',
    name: 'חשבונאי',
    url: 'https://cheshbonai.co.il',
  },
  publisher: {
    '@type': 'Organization',
    name: 'חשבונאי',
    url: 'https://cheshbonai.co.il',
  },
};

const faqItems = [
  {
    question: 'מה הטבת המס בקרן השתלמות לעומת פיקדון?',
    answer:
      'הרווחים בקרן השתלמות פטורים לגמרי ממס רווח הון, כל עוד ההפקדה השנתית לא עברה את התקרה המוטבת (' +
      MAX_DEPOSIT +
      ' ₪ לעצמאי ב-2026) והמשיכה נעשית במועד כדין (אחרי 6 שנים). בפיקדון בנקאי, לעומת זאת, הריבית ממוסה: ' +
      NOMINAL_TAX_PCT +
      ' על הרווח הנומינלי בפיקדון שקלי לא צמוד, או ' +
      REAL_TAX_PCT +
      ' על הרווח הריאלי בפיקדון צמוד מדד או מט"ח. עצמאי מקבל בנוסף ניכוי מההכנסה החייבת על חלק מההפקדה.',
  },
  {
    question: 'כמה כדאי לעצמאי להפקיד לקרן השתלמות ב-2026?',
    answer:
      'התקרה המוטבת להפקדה היא ' +
      MAX_DEPOSIT +
      ' ₪ בשנה - עד סכום זה הרווחים פטורים ממס רווח הון. בנוסף, הפקדה של עד ' +
      DEDUCTION_PCT +
      ' מההכנסה החייבת (עד תקרת הכנסה של ' +
      INCOME_CEILING +
      ' ₪, כלומר ניכוי מרבי של כ-' +
      DEDUCTION_CAP +
      ' ₪) מוכרת כניכוי שמקטין את המס השוטף. מי שיכול - כדאי לו לנצל את מלוא התקרה המוטבת, כי זה אפיק החיסכון היחיד לטווח בינוני עם פטור מלא ממס רווח הון.',
  },
  {
    question: 'מתי אפשר למשוך קרן השתלמות בלי לשלם מס?',
    answer:
      'אחרי 6 שנים מההפקדה הראשונה בקרן - הכסף נזיל לכל מטרה, כולל הרווחים, בפטור ממס. אחרי 3 שנים בלבד אפשר למשוך בפטור לצורך השתלמות או לימודים מוכרים, או אם הגעת לגיל פרישה. משיכה מוקדמת שלא בתנאים אלה מחויבת במס שולי על הרווחים ועל הפקדות שקיבלו הטבה - ולכן כמעט אף פעם לא כדאית.',
  },
  {
    question: 'האם קרן השתלמות מסוכנת יותר מפיקדון?',
    answer:
      'כן, ברמת התנודתיות - וזה חלק מהעסקה. פיקדון בנקאי מבטיח ריבית ידועה מראש וקרן מובטחת. קרן השתלמות מושקעת בשוק ההון (אפשר לבחור מסלול: מנייתי, כללי, אג"ח או אפילו כספי סולידי), ולכן יכולה לרדת בטווח הקצר אבל היסטורית הניבה תשואה גבוהה משמעותית מפיקדונות לאורך שנים. מי שרוצה סיכון מינימלי יכול לבחור מסלול כספי בקרן ההשתלמות - וליהנות מהפטור ממס גם על תשואה סולידית.',
  },
  {
    question: 'למי בכלל מותר לפתוח קרן השתלמות?',
    answer:
      'רק לשכירים שהמעסיק מפריש עבורם (בהסכמתו) ולעצמאים - עוסק פטור, עוסק מורשה או שותף. מי שאינו עצמאי ואין לו מעסיק שמפריש - לא יכול לפתוח קרן השתלמות באופן עצמאי, ובשבילו ההשוואה הרלוונטית היא פיקדון מול תיק השקעות ממוסה. לשכיר, הפרשת המעסיק (בדרך כלל 7.5% מהשכר מול 2.5% מהעובד) היא הטבה ששווה לדרוש במשא ומתן - זו למעשה תוספת שכר פטורה ממס עד התקרה.',
  },
];

export default function KerenHishtalmutVsPikadonPage() {
  return (
    <>
      <CalculatorLayout
        title="קרן השתלמות מול פיקדון בנקאי - איפה לחסוך?"
        description="שני אפיקים לכסף פנוי לטווח בינוני: קרן השתלמות עם פטור מלא ממס רווח הון, מול פיקדון בנקאי בטוח ונזיל. השוואה מלאה של מס, נזילות, תשואה וסיכון."
        breadcrumbs={[
          { label: 'דף הבית', href: '/' },
          { label: 'דפי השוואה', href: '/compare' },
          { label: 'קרן השתלמות מול פיקדון' },
        ]}
        lastUpdated="2026-08-15"
        pageUrl="/compare/keren-hishtalmut-vs-pikadon"
        calculator={<CompoundInterestCalculator />}
        quickAnswer={
          <p className="text-lg text-ink leading-relaxed">
            <strong>
              קרן השתלמות היא אפיק החיסכון היחיד בישראל לטווח בינוני שהרווחים בו פטורים לחלוטין
              ממס רווח הון — עד תקרת הפקדה שנתית של {MAX_DEPOSIT} ₪ לעצמאי ב-2026. פיקדון בנקאי,
              לעומת זאת, ממוסה: {NOMINAL_TAX_PCT} על הרווח הנומינלי בפיקדון שקלי לא צמוד, או{' '}
              {REAL_TAX_PCT} על הרווח הריאלי בפיקדון צמוד.
            </strong>{' '}
            המחיר של ההטבה הוא נזילות: כספי קרן השתלמות נעולים 6 שנים (3 שנים למטרת השתלמות או
            בגיל פרישה), בעוד פיקדון נזיל בתום תקופתו — ולעיתים בתחנות יציאה. גם התשואה שונה
            במהותה: פיקדון מבטיח ריבית ידועה מראש, וקרן השתלמות מושקעת בשוק ההון עם תנודתיות אך
            תשואה היסטורית גבוהה יותר. לכסף שלא תצטרכו בשנים הקרובות — קרן השתלמות עד התקרה היא
            כמעט תמיד הצעד הראשון; פיקדון מתאים לכסף שצריך להישאר זמין ובטוח.
          </p>
        }
        content={
          <>
            <h2>שני פתרונות לאותה שאלה: מה לעשות עם כסף פנוי?</h2>
            <p>
              גם קרן השתלמות וגם פיקדון בנקאי הם דרכים לחסוך כסף לטווח של כמה שנים. אבל הם
              שונים כמעט בכל פרמטר: מיסוי, נזילות, תשואה, סיכון ומי בכלל רשאי להשתמש בהם. הנה
              ההשוואה המלאה — ובעזרת{' '}
              <Link href="/investments/compound-interest" className="text-gold underline">
                מחשבון הריבית דריבית
              </Link>{' '}
              שמתחת אפשר לראות כמה ההבדל במס ובתשואה שווה לאורך שנים.
            </p>

            <h2>טבלת השוואה - קרן השתלמות מול פיקדון בנקאי</h2>

            <div className="overflow-x-auto my-6">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-ink text-cream">
                    <th className="border border-ink/20 p-3 text-right font-bold">קריטריון</th>
                    <th className="border border-ink/20 p-3 text-right font-bold text-cream">
                      🎓 קרן השתלמות
                    </th>
                    <th className="border border-ink/20 p-3 text-right font-bold text-cream">
                      🏦 פיקדון בנקאי
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-ink/15 p-3 font-semibold">מס על הרווחים</td>
                    <td className="border border-ink/15 p-3">
                      פטור מלא ממס רווח הון עד תקרת ההפקדה; מעל התקרה - {REAL_TAX_PCT} על הרווח
                      הריאלי
                    </td>
                    <td className="border border-ink/15 p-3">
                      {NOMINAL_TAX_PCT} נומינלי (שקלי לא צמוד) או {REAL_TAX_PCT} ריאלי (צמוד
                      מדד/מט&quot;ח)
                    </td>
                  </tr>
                  <tr className="bg-cream-2">
                    <td className="border border-ink/15 p-3 font-semibold">הטבת מס בהפקדה</td>
                    <td className="border border-ink/15 p-3">
                      לעצמאי: ניכוי עד {DEDUCTION_PCT} מההכנסה (עד כ-{DEDUCTION_CAP} ₪); לשכיר:
                      הפרשת מעסיק פטורה ממס עד התקרה
                    </td>
                    <td className="border border-ink/15 p-3">אין</td>
                  </tr>
                  <tr>
                    <td className="border border-ink/15 p-3 font-semibold">נזילות</td>
                    <td className="border border-ink/15 p-3">
                      נעולה 6 שנים (3 שנים להשתלמות/גיל פרישה); אחר כך נזילה לכל מטרה
                    </td>
                    <td className="border border-ink/15 p-3">
                      לפי תקופת הפיקדון: יומי, חודשי, שנתי; לעיתים תחנות יציאה
                    </td>
                  </tr>
                  <tr className="bg-cream-2">
                    <td className="border border-ink/15 p-3 font-semibold">תשואה</td>
                    <td className="border border-ink/15 p-3">
                      תלוית שוק ההון ומסלול (מנייתי/כללי/אג&quot;ח/כספי); לא מובטחת
                    </td>
                    <td className="border border-ink/15 p-3">
                      ריבית ידועה מראש, נגזרת מריבית בנק ישראל
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-ink/15 p-3 font-semibold">סיכון</td>
                    <td className="border border-ink/15 p-3">
                      תנודתיות בטווח קצר; ניתן לבחור מסלול סולידי
                    </td>
                    <td className="border border-ink/15 p-3">קרן מובטחת על ידי הבנק</td>
                  </tr>
                  <tr className="bg-cream-2">
                    <td className="border border-ink/15 p-3 font-semibold">מי יכול להשתמש</td>
                    <td className="border border-ink/15 p-3">
                      עצמאים, ושכירים שהמעסיק מפריש עבורם
                    </td>
                    <td className="border border-ink/15 p-3">כל אחד</td>
                  </tr>
                  <tr>
                    <td className="border border-ink/15 p-3 font-semibold">תקרת הפקדה</td>
                    <td className="border border-ink/15 p-3">
                      {MAX_DEPOSIT} ₪ בשנה לעצמאי (להטבה מלאה); אפשר להפקיד מעבר ללא פטור
                    </td>
                    <td className="border border-ink/15 p-3">ללא הגבלה</td>
                  </tr>
                  <tr className="bg-cream-2">
                    <td className="border border-ink/15 p-3 font-semibold">דמי ניהול</td>
                    <td className="border border-ink/15 p-3">
                      קיימים (ניתנים למיקוח, בדרך כלל שברי אחוז מהצבירה)
                    </td>
                    <td className="border border-ink/15 p-3">אין</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h2>למה הפטור ממס שווה כל כך הרבה?</h2>
            <p>
              ההבדל בין &quot;פטור ממס&quot; ל&quot;מס של {REAL_TAX_PCT}&quot; נראה קטן בשנה
              אחת, אבל הוא מצטבר דרמטית בזכות ריבית דריבית: המס בפיקדון נגבה מכל הרווח, ולכן
              מקטין את הסכום שממשיך לצבור תשואה. בקרן השתלמות כל הרווח ממשיך לעבוד. על עשרות
              שנים, אותה תשואה שנתית מניבה בקרן השתלמות עשרות אחוזים יותר נטו. לעצמאי מתווספת
              הטבה שנייה: ניכוי ההפקדה מההכנסה החייבת מקטין את המס כבר השנה —{' '}
              <Link href="/self-employed/net" className="text-gold underline">
                מחשבון הנטו לעצמאי
              </Link>{' '}
              מראה את ההשפעה המדויקת.
            </p>

            <h2>מתי לבחור מה?</h2>
            <h3>קרן השתלמות עדיפה כש...</h3>
            <ul>
              <li>אתם עצמאים או שכירים עם הפרשת מעסיק — וטרם ניצלתם את התקרה השנתית</li>
              <li>הכסף לא נחוץ ב-6 השנים הקרובות</li>
              <li>אתם רוצים חשיפה לשוק ההון בעטיפת המס הטובה בישראל</li>
              <li>גם שונאי סיכון — מסלול כספי בקרן נותן תשואה דמוית פיקדון עם פטור ממס</li>
            </ul>

            <h3>פיקדון בנקאי עדיף כש...</h3>
            <ul>
              <li>הכסף מיועד למטרה קרובה: דירה, רכב, אירוע — ואסור שיהיה נעול</li>
              <li>אין לכם מעמד עצמאי או מעסיק שמפריש — קרן השתלמות פשוט לא זמינה לכם</li>
              <li>כבר מיציתם את תקרת ההפקדה המוטבת השנה, ואתם רוצים אפס סיכון</li>
              <li>זו כרית ביטחון שחייבת להישאר ודאית ומובטחת</li>
            </ul>

            <h2>האסטרטגיה המקובלת: קודם התקרה, אחר כך השאר</h2>
            <p>
              לרוב החוסכים סדר הפעולות הנכון הוא: למלא קודם את תקרת ההפקדה המוטבת בקרן
              ההשתלמות ({MAX_DEPOSIT} ₪ לעצמאי), ורק אחר כך להחליט מה לעשות עם יתרת הכסף —
              פיקדון לכסף קצר-טווח, ותיק השקעות ממוסה לכסף ארוך-טווח. השוו גם עם{' '}
              <Link href="/investments/capital-gains-tax" className="text-gold underline">
                מחשבון מס רווח הון
              </Link>{' '}
              כדי להבין כמה מס תשלמו על השקעה רגילה, וקראו את{' '}
              <Link href="/blog/study-fund-self-employed-strategy" className="text-gold underline">
                המדריך לאסטרטגיית קרן השתלמות לעצמאים
              </Link>
              .
            </p>

            <h2>מחשבונים ומדריכים רלוונטיים</h2>
            <ul>
              <li>
                <Link href="/investments/compound-interest" className="text-gold underline">
                  מחשבון ריבית דריבית
                </Link>{' '}
                - כמה שווה הפטור ממס לאורך שנים.
              </li>
              <li>
                <Link href="/investments/capital-gains-tax" className="text-gold underline">
                  מחשבון מס רווח הון
                </Link>{' '}
                - המס על השקעות מחוץ לקרן.
              </li>
              <li>
                <Link href="/self-employed/net" className="text-gold underline">
                  מחשבון נטו לעצמאי
                </Link>{' '}
                - כולל השפעת ניכוי קרן ההשתלמות על המס.
              </li>
              <li>
                <Link href="/blog/study-fund-self-employed-strategy" className="text-gold underline">
                  אסטרטגיית קרן השתלמות לעצמאים
                </Link>{' '}
                - מדריך מעמיק.
              </li>
            </ul>

            <p>
              עצמאים: הטבות המס על קרן השתלמות ופנסיה הן חלק מתכנון פיננסי שלם של העסק.{' '}
              <Link href="/course/business" className="text-gold underline">
                קורס ניהול פיננסי לבעלי עסקים
              </Link>{' '}
              מסדר את כל התמונה — ממיסים ועד תזרים.
            </p>
          </>
        }
        faq={<FAQ items={faqItems} />}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
    </>
  );
}
