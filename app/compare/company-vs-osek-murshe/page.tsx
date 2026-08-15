import { Metadata } from 'next';
import Link from 'next/link';
import { CalculatorLayout } from '@/components/calculator/CalculatorLayout';
import { CorpVsIndividualCalculator } from '@/components/calculators/CorpVsIndividualCalculator';
import { FAQ } from '@/components/calculator/FAQ';
import {
  CORP_TAX_2026,
  DIVIDEND_TAX_CONTROLLING,
  DIVIDEND_TAX_NON_CONTROLLING,
  CORP_EFFECTIVE_ALL_DIV,
} from '@/lib/calculators/corporation-vs-individual';
import {
  TAX_BRACKETS_2026,
  SOCIAL_SECURITY_SELF_EMPLOYED_2026,
} from '@/lib/constants/tax-2026';

// ============================================================
// כל נתוני המס נגזרים מקבועי המנוע — אין מספרי מס מוקלדים ידנית
// ============================================================
const pct = (v: number) =>
  `${(v * 100).toLocaleString('he-IL', { maximumFractionDigits: 2 })}%`;

const CORP_TAX_PCT = pct(CORP_TAX_2026); // מס חברות
const DIV_CONTROLLING_PCT = pct(DIVIDEND_TAX_CONTROLLING); // דיבידנד בעל מניות מהותי (כולל מס יסף)
const DIV_REGULAR_PCT = pct(DIVIDEND_TAX_NON_CONTROLLING); // דיבידנד בעל מניות רגיל
const CORP_COMBINED_PCT = pct(CORP_EFFECTIVE_ALL_DIV); // מס מצרפי חברה + דיבידנד מלא
const TOP_BRACKET_PCT = pct(TAX_BRACKETS_2026[TAX_BRACKETS_2026.length - 1].rate); // מדרגה עליונה
const FIRST_BRACKET_PCT = pct(TAX_BRACKETS_2026[0].rate);
const NI_REDUCED_PCT = pct(SOCIAL_SECURITY_SELF_EMPLOYED_2026.reducedRate.total);
const NI_FULL_PCT = pct(SOCIAL_SECURITY_SELF_EMPLOYED_2026.fullRate.total);

export const metadata: Metadata = {
  title: 'חברה בע"מ מול עוסק מורשה - השוואה מלאה 2026',
  description:
    `חברה בע"מ או עוסק מורשה? השוואה מקיפה 2026: מס חברות ${CORP_TAX_PCT} ודיבידנד מול מדרגות מס אישיות, ביטוח לאומי, אחריות משפטית, עלויות הנהלת חשבונות ומשיכת כסף. כולל מחשבון.`,
  alternates: { canonical: '/compare/company-vs-osek-murshe' },
};

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'חברה בע"מ מול עוסק מורשה - השוואה מקיפה 2026',
  description:
    'מתי משתלם להתאגד כחברה בע"מ ומתי להישאר עוסק מורשה? השוואה מלאה: מיסוי, ביטוח לאומי, אחריות משפטית, עלויות ומשיכת כסף.',
  url: 'https://cheshbonai.co.il/compare/company-vs-osek-murshe',
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
    question: 'מאיזו הכנסה שנתית משתלם לפתוח חברה בע"מ?',
    answer:
      'אין מספר קסם אחד, אבל סדר הגודל המקובל הוא רווח שנתי של 350-450 אלף ₪ ומעלה — ובעיקר כשלא צריך למשוך את כל הרווח למחיה. ככל שנשאר יותר רווח בחברה (שממוסה רק במס חברות של ' +
      CORP_TAX_PCT +
      ' עד המשיכה), היתרון של החברה גדל. מי שמושך את כל הרווח כדיבידנד משלם מס מצרפי של כ-' +
      CORP_COMBINED_PCT +
      ', שדומה למדרגות הגבוהות של יחיד. המחשבון באתר מוצא את נקודת האיזון המדויקת לנתונים שלך.',
  },
  {
    question: 'כמה מס משלמת חברה בע"מ בישראל ב-2026?',
    answer:
      'חברה משלמת מס חברות של ' +
      CORP_TAX_PCT +
      ' על הרווח. כשבעל המניות מושך דיבידנד, מתווסף מס דיבידנד: ' +
      DIV_CONTROLLING_PCT +
      ' לבעל מניות מהותי (מעל 10% מהמניות, כולל מס יסף) או ' +
      DIV_REGULAR_PCT +
      ' לבעל מניות רגיל. המס המצרפי על רווח שנמשך במלואו כדיבידנד הוא כ-' +
      CORP_COMBINED_PCT +
      '.',
  },
  {
    question: 'האם בעל חברה משלם ביטוח לאומי?',
    answer:
      'על דיבידנד לא משולמים דמי ביטוח לאומי — זה אחד היתרונות המרכזיים של חברה. אבל אם בעל החברה מושך משכורת (שכיר בחברה שלו), המשכורת חייבת בביטוח לאומי של עובד ושל מעסיק כרגיל. חשוב לזכור שדיבידנד גם לא צובר זכויות: לא דמי לידה, לא אבטלה ולא קצבת נכות, ולכן מקובל לשלב משכורת בסיסית עם דיבידנד.',
  },
  {
    question: 'מה ההבדל באחריות המשפטית בין חברה לעוסק מורשה?',
    answer:
      'עוסק מורשה הוא האדם עצמו — חובות העסק הם חובות אישיים, והנושים יכולים לרדת לנכסים הפרטיים. חברה בע"מ היא אישיות משפטית נפרדת עם אחריות מוגבלת: בעל המניות מסכן ככלל רק את מה שהשקיע בחברה. בפועל בנקים וספקים גדולים דורשים לעיתים ערבות אישית מבעל השליטה, מה שמצמצם חלק מההגנה.',
  },
  {
    question: 'כמה עולה להחזיק חברה בע"מ בשנה?',
    answer:
      'העלויות השוטפות כוללות רואה חשבון מבקר (ביקורת דוחות שנתיים היא חובה בחברה), הנהלת חשבונות כפולה ואגרה שנתית לרשם החברות. סדר הגודל הכולל לחברת יחיד קטנה הוא בדרך כלל 12-25 אלף ₪ בשנה — לעומת כמה אלפי שקלים לעוסק מורשה עם הנהלת חשבונות חד-צידית. הפער הזה הוא חלק מחישוב הכדאיות.',
  },
];

export default function CompanyVsOsekMurshePage() {
  return (
    <>
      <CalculatorLayout
        title='חברה בע"מ מול עוסק מורשה - מה משתלם יותר?'
        description='ההחלטה המבנית החשובה ביותר של בעל עסק: להישאר עוסק מורשה או להתאגד כחברה בע"מ? השוואה מלאה של מיסוי, ביטוח לאומי, אחריות משפטית, עלויות ומשיכת כסף.'
        breadcrumbs={[
          { label: 'דף הבית', href: '/' },
          { label: 'דפי השוואה', href: '/compare' },
          { label: 'חברה בע"מ מול עוסק מורשה' },
        ]}
        lastUpdated="2026-08-15"
        pageUrl="/compare/company-vs-osek-murshe"
        calculator={<CorpVsIndividualCalculator />}
        quickAnswer={
          <p className="text-lg text-ink leading-relaxed">
            <strong>
              עוסק מורשה משלם מס אישי לפי מדרגות ({FIRST_BRACKET_PCT}–{TOP_BRACKET_PCT}) בתוספת
              ביטוח לאומי, על כל הרווח — גם אם לא משך אותו. חברה בע&quot;מ משלמת מס חברות של{' '}
              {CORP_TAX_PCT} בלבד על רווח שנשאר בחברה, ורק במשיכת דיבידנד מתווסף מס נוסף שמביא
              את המס המצרפי לכ-{CORP_COMBINED_PCT}.
            </strong>{' '}
            לכן הכלל המעשי: בהכנסות נמוכות ובינוניות, או כשמושכים את כל הרווח למחיה — עוסק מורשה
            פשוט וזול יותר. חברה מתחילה להשתלם בדרך כלל מרווח שנתי של כ-350-450 אלף ₪, ובעיקר כשחלק
            מהרווח נשאר בחברה להשקעה או לצמיחה. מעבר למס, חברה נותנת אחריות משפטית מוגבלת אך עולה
            יותר בהנהלת חשבונות. המחשבון שמתחת משווה את הנטו בפועל בין המסלולים לפי הנתונים שלך.
          </p>
        }
        content={
          <>
            <h2>ההחלטה: אישיות משפטית נפרדת או פשטות תפעולית?</h2>
            <p>
              עוסק מורשה וחברה בע&quot;מ הם שני מבנים משפטיים שונים לחלוטין לאותו עסק. ההבדל
              משפיע על כמה מס תשלמו, מתי תשלמו אותו, מה קורה אם העסק נקלע לחובות, וכמה תשלמו
              לרואה החשבון. הנה ההשוואה המלאה, קריטריון אחר קריטריון —{' '}
              <Link href="/self-employed/corporation-vs-individual" className="text-gold underline">
                ובמחשבון חברה בע&quot;מ מול עוסק מורשה
              </Link>{' '}
              תוכלו לראות את המספרים המדויקים לעסק שלכם.
            </p>

            <h2>טבלת השוואה - חברה בע&quot;מ מול עוסק מורשה</h2>

            <div className="overflow-x-auto my-6">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-ink text-cream">
                    <th className="border border-ink/20 p-3 text-right font-bold">קריטריון</th>
                    <th className="border border-ink/20 p-3 text-right font-bold text-cream">
                      💼 עוסק מורשה
                    </th>
                    <th className="border border-ink/20 p-3 text-right font-bold text-cream">
                      🏢 חברה בע&quot;מ
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-ink/15 p-3 font-semibold">מיסוי על הרווח</td>
                    <td className="border border-ink/15 p-3">
                      מס אישי לפי מדרגות: {FIRST_BRACKET_PCT}–{TOP_BRACKET_PCT}, על כל הרווח
                      באותה שנה
                    </td>
                    <td className="border border-ink/15 p-3">
                      מס חברות {CORP_TAX_PCT}; דיבידנד במשיכה: {DIV_CONTROLLING_PCT} לבעל מניות
                      מהותי (מצרפי ~{CORP_COMBINED_PCT})
                    </td>
                  </tr>
                  <tr className="bg-cream-2">
                    <td className="border border-ink/15 p-3 font-semibold">דחיית מס</td>
                    <td className="border border-ink/15 p-3">אין - הרווח ממוסה בשנה שנוצר</td>
                    <td className="border border-ink/15 p-3">
                      רווח שנשאר בחברה ממוסה רק ב-{CORP_TAX_PCT} עד למשיכה בפועל
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-ink/15 p-3 font-semibold">ביטוח לאומי</td>
                    <td className="border border-ink/15 p-3">
                      {NI_REDUCED_PCT} (מופחת) / {NI_FULL_PCT} (מלא) על כל הרווח עד התקרה
                    </td>
                    <td className="border border-ink/15 p-3">
                      על משכורת בלבד (עובד + מעסיק); על דיבידנד אין ביטוח לאומי
                    </td>
                  </tr>
                  <tr className="bg-cream-2">
                    <td className="border border-ink/15 p-3 font-semibold">אחריות משפטית</td>
                    <td className="border border-ink/15 p-3">
                      אישית ומלאה - חובות העסק הם חובות פרטיים
                    </td>
                    <td className="border border-ink/15 p-3">
                      מוגבלת - אישיות משפטית נפרדת (בפועל בנקים דורשים לעיתים ערבות אישית)
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-ink/15 p-3 font-semibold">
                      הנהלת חשבונות ועלויות
                    </td>
                    <td className="border border-ink/15 p-3">
                      לרוב חד-צידית, אלפי ₪ בשנה; דוח שנתי אישי
                    </td>
                    <td className="border border-ink/15 p-3">
                      כפולה + ביקורת רו&quot;ח חובה + אגרת רשם החברות; לרוב 12-25 אלף ₪ בשנה
                    </td>
                  </tr>
                  <tr className="bg-cream-2">
                    <td className="border border-ink/15 p-3 font-semibold">משיכת כסף</td>
                    <td className="border border-ink/15 p-3">
                      חופשית - הכסף שלך מרגע שנכנס (המס מחושב על הרווח ממילא)
                    </td>
                    <td className="border border-ink/15 p-3">
                      רק כמשכורת או דיבידנד; משיכה &quot;סתם&quot; נחשבת הכנסה חייבת (סעיף 3(ט1))
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-ink/15 p-3 font-semibold">זכויות סוציאליות</td>
                    <td className="border border-ink/15 p-3">
                      צובר זכויות בביטוח לאומי לפי ההכנסה (ללא אבטלה)
                    </td>
                    <td className="border border-ink/15 p-3">
                      רק על רכיב המשכורת; דיבידנד לא צובר זכויות
                    </td>
                  </tr>
                  <tr className="bg-cream-2">
                    <td className="border border-ink/15 p-3 font-semibold">תדמית ועסקים גדולים</td>
                    <td className="border border-ink/15 p-3">מתאים לעסק אישי / נותן שירות</td>
                    <td className="border border-ink/15 p-3">
                      נדרשת לעיתים מול תאגידים, שותפים ומשקיעים; מאפשרת הכנסת שותפים והקצאת מניות
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-ink/15 p-3 font-semibold">מתי כדאי</td>
                    <td className="border border-ink/15 p-3">
                      רווח נמוך-בינוני, מושכים הכל למחיה, רוצים פשטות
                    </td>
                    <td className="border border-ink/15 p-3">
                      רווח גבוה (לרוב 350-450 אלף ₪+), חלק מהרווח נשאר לצמיחה, צורך בהגנה משפטית
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h2>איך באמת עובד המס בחברה?</h2>
            <p>
              הטעות הנפוצה היא להשוות את מס החברות ({CORP_TAX_PCT}) למדרגות המס של יחיד ולהסיק
              שחברה &quot;חוסכת מס&quot; תמיד. אבל הכסף בחברה עדיין לא שלכם: כדי להעביר אותו
              לכיס הפרטי צריך למשוך דיבידנד ({DIV_CONTROLLING_PCT} לבעל מניות מהותי) או משכורת
              (מס אישי + ביטוח לאומי). המס המצרפי על רווח שנמשך במלואו כדיבידנד הוא כ-
              {CORP_COMBINED_PCT} — קרוב מאוד למדרגות הגבוהות של יחיד. היתרון האמיתי של חברה
              נמצא בשני מקומות:
            </p>
            <ul>
              <li>
                <strong>דחיית מס על רווחים שנשארים בעסק</strong> - רווח שמושקע בחזרה בחברה
                (ציוד, עובדים, השקעות) ממוסה רק ב-{CORP_TAX_PCT} בשלב הזה.
              </li>
              <li>
                <strong>אופטימיזציית משכורת-דיבידנד</strong> - משכורת בגובה המדרגות הנמוכות
                מנצלת את נקודות הזיכוי, והיתרה נמשכת כדיבידנד ללא ביטוח לאומי. ראו{' '}
                <Link href="/self-employed/dividend-vs-salary" className="text-gold underline">
                  מחשבון דיבידנד מול משכורת
                </Link>
                .
              </li>
            </ul>

            <h2>מתי לבחור מה?</h2>
            <h3>הישארו עוסק מורשה אם...</h3>
            <ul>
              <li>הרווח השנתי מתחת לכ-350 אלף ₪ ואתם מושכים את רובו למחיה</li>
              <li>אתם רוצים מינימום בירוקרטיה ועלויות הנהלת חשבונות</li>
              <li>אין סיכון משפטי או אשראי ספקים משמעותי בפעילות</li>
              <li>העסק בתחילת דרכו וההכנסה עוד לא יציבה</li>
            </ul>

            <h3>שקלו חברה בע&quot;מ אם...</h3>
            <ul>
              <li>הרווח השנתי עובר את אזור ה-350-450 אלף ₪ ויש רווח שלא נמשך</li>
              <li>אתם רוצים להשקיע רווחים בחזרה בעסק או בהשקעות דרך החברה</li>
              <li>הפעילות חושפת אתכם לתביעות או להתחייבויות גדולות מול ספקים</li>
              <li>אתם מתכננים להכניס שותפים או משקיעים, או למכור את העסק בעתיד</li>
            </ul>

            <p>
              נקודת האיזון המדויקת תלויה בנקודות הזיכוי, בעלויות החברה ובתמהיל המשיכה —{' '}
              <Link href="/self-employed/corporation-vs-individual" className="text-gold underline">
                <strong>המחשבון המלא</strong>
              </Link>{' '}
              מחשב אותה עבורכם, כולל תחזית רב-שנתית.
            </p>

            <h2>מחשבונים ומדריכים רלוונטיים</h2>
            <ul>
              <li>
                <Link href="/self-employed/corporation-vs-individual" className="text-gold underline">
                  מחשבון חברה בע&quot;מ מול עוסק מורשה
                </Link>{' '}
                - השוואת נטו מלאה בין המבנים, כולל נקודת איזון.
              </li>
              <li>
                <Link href="/self-employed/dividend-vs-salary" className="text-gold underline">
                  מחשבון דיבידנד מול משכורת
                </Link>{' '}
                - איך למשוך כסף מהחברה בצורה חכמה.
              </li>
              <li>
                <Link href="/self-employed/net" className="text-gold underline">
                  מחשבון נטו לעצמאי
                </Link>{' '}
                - כמה נשאר לעוסק מורשה אחרי מס וביטוח לאומי.
              </li>
              <li>
                <Link href="/compare/employee-vs-self-employed" className="text-gold underline">
                  השוואת שכיר מול עצמאי
                </Link>{' '}
                - אם אתם עוד לפני ההחלטה לצאת לעצמאות.
              </li>
            </ul>

            <p>
              רוצים ללמוד לנהל את הכספים של העסק בצורה מסודרת — תמחור, תזרים, מיסים והתנהלות מול
              רואה החשבון?{' '}
              <Link href="/course/business" className="text-gold underline">
                קורס ניהול פיננסי לבעלי עסקים
              </Link>{' '}
              עושה סדר בכל התמונה.
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
