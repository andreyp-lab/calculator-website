import { Metadata } from 'next';
import Link from 'next/link';
import { CalculatorLayout } from '@/components/calculator/CalculatorLayout';
import { FAQ } from '@/components/calculator/FAQ';
import {
  OVERTIME_RATES,
  MONTHLY_HOURS_5_DAY_WEEK,
  calculateOvertimeDay,
  calculateMonthlyShifts,
  calculateRestDayPay,
  hourlyWageFromMonthly,
  splitShift,
} from '@/lib/calculators/overtime-pay';

export const metadata: Metadata = {
  title: 'שעות נוספות — איך מחשבים 125% ו־150% בתלוש',
  description:
    'מה נחשב שעה נוספת, איך מחשבים שכר שעתי משכר חודשי, וכמה משלמים על כל שעה נוספת ועל עבודה בשבת — עם דוגמה מחושבת ורשימת בדיקה לתלוש.',
  alternates: { canonical: '/employee-rights/overtime' },
};

// כל המספרים בדוגמה מחושבים כאן מהמנוע ולא מוקלדים ידנית — כך הטקסט והטבלה לא יכולים להתפצל.
const EXAMPLE_MONTHLY_WAGE = 12_000;
const EXAMPLE_HOURLY = hourlyWageFromMonthly(EXAMPLE_MONTHLY_WAGE);
const EXAMPLE_ROWS = [1, 2, 3, 4].map((hours) => ({
  hours,
  ...calculateOvertimeDay(EXAMPLE_HOURLY, hours),
}));
const EXAMPLE_REST_DAY_8H = calculateRestDayPay(EXAMPLE_HOURLY, 8);

// חודש לדוגמה עם משמרות. הכול מחושב מהמנוע; אין מספרים מוקלדים בטבלאות.
const REGULAR_DAY_HOURS = 8;
const SHIFT_GROUPS = [
  { label: 'משמרת רגילה', count: 18, shift: { hours: 8 } },
  { label: 'משמרת ארוכה', count: 3, shift: { hours: 10 } },
  { label: 'משמרת ארוכה מאוד', count: 1, shift: { hours: 11 } },
  { label: 'משמרת שבת', count: 1, shift: { hours: 8, restDay: true } },
].map((group) => ({ ...group, split: splitShift(group.shift, REGULAR_DAY_HOURS) }));
const MONTH = calculateMonthlyShifts({
  monthlyWage: EXAMPLE_MONTHLY_WAGE,
  shifts: SHIFT_GROUPS.flatMap((g) => Array.from({ length: g.count }, () => g.shift)),
  regularDayHours: REGULAR_DAY_HOURS,
});
const MONTH_SHIFT_COUNT = SHIFT_GROUPS.reduce((sum, g) => sum + g.count, 0);

const pct = (rate: number) => `${Math.round(rate * 100)}%`;
const money = (value: number) =>
  `${value.toLocaleString('he-IL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₪`;

const PCT_FIRST = pct(OVERTIME_RATES.firstTwoHours);
const PCT_AFTER = pct(OVERTIME_RATES.afterTwoHours);
const PCT_REST = pct(OVERTIME_RATES.restDay);

const faqItems = [
  {
    question: 'כמה משלמים על שעות נוספות?',
    answer: `לפי חוק שעות עבודה ומנוחה, על שתי השעות הנוספות הראשונות באותו יום משלמים לפחות ${PCT_FIRST} מהשכר הרגיל, ועל כל שעה נוספת אחריהן לפחות ${PCT_AFTER}. אלה שיעורי מינימום: הסכם קיבוצי או חוזה אישי יכולים לקבוע יותר.`,
  },
  {
    question: 'איך מחשבים שכר שעתי כשמקבלים משכורת חודשית?',
    answer: `במשרה מלאה של חמישה ימים בשבוע נהוג לחלק את השכר החודשי ב־${MONTHLY_HOURS_5_DAY_WEEK}, וזה גם המחלק שהביטוח הלאומי מפרסם לשכר המינימום. בחוזה שלכם המחלק עשוי להיות אחר, למשל במשרה של שישה ימים או במשרה חלקית, ולכן כדאי לבדוק מה כתוב בחוזה ובתלוש.`,
  },
  {
    question: 'מה מקבלים על עבודה בשבת?',
    answer: `על עבודה בשעות המנוחה השבועית החוק קובע תשלום של לפחות ${PCT_REST} מהשכר הרגיל לכל שעה, או לחלופין מתן שעות מנוחה במקומו, בהתאם להיתר שלפיו הועסק העובד. לעובד בשכר חודשי החוק מאפשר גם מנוחה חלופית בהיקף של שעה וחצי לפחות על כל שעת עבודה.`,
  },
  {
    question: 'האם כל עובד זכאי לתשלום על שעות נוספות?',
    answer:
      'לא בהכרח. החוק קובע חריגים, למשל לתפקידי ניהול ואמון ולעבודות מסוימות, ויש הסדרים מיוחדים בענפים שונים. אם אתם לא בטוחים אם החוק חל עליכם, בדקו מול משרד העבודה או התייעצו עם עורך דין לדיני עבודה.',
  },
  {
    question: 'האם מספיק שהמעסיק ישלם לי תוספת קבועה במקום שעות נוספות?',
    answer:
      'הסדרים של תשלום גלובלי על שעות נוספות קיימים, אבל תקפותם תלויה בפרטי ההסכם ובכך שהתשלום באמת מכסה את השעות שעבדתם בפועל. אין כלל אחד לכולם. אם השעות בפועל גבוהות ממה שהתוספת מכסה, שווה לבדוק את החישוב עם גורם מקצועי.',
  },
  {
    question: 'איפה בתלוש רואים שעות נוספות?',
    answer:
      'בדרך כלל בחלק התשלומים, בשורות נפרדות לפי שיעור (למשל שעות ב־125% ושעות ב־150%) עם מספר השעות והסכום. אם התלוש מציג רק סכום כולל בלי פירוט, אפשר לבקש מהמעסיק פירוט שעות.',
  },
];

export default function OvertimePage() {
  return (
    <CalculatorLayout
      pageUrl="/employee-rights/overtime"
      title="שעות נוספות — כך מחשבים את התשלום"
      description="מה נחשב שעה נוספת, כמה משלמים על כל שעה, ואיך בודקים שהתלוש תואם — עם דוגמה מחושבת."
      breadcrumbs={[
        { label: 'דף הבית', href: '/' },
        { label: 'זכויות עובדים', href: '/employee-rights' },
        { label: 'שעות נוספות' },
      ]}
      lastUpdated="2026-10-13"
      quickAnswer={
        <p>
          לפי החוק, על שתי השעות הנוספות הראשונות ביום משלמים לפחות {PCT_FIRST} מהשכר הרגיל,
          ועל כל שעה אחריהן לפחות {PCT_AFTER}. עבודה בשעות המנוחה השבועית מזכה בלפחות {PCT_REST}
          לשעה, או במנוחה חלופית. אלה שיעורי מינימום; הסכם קיבוצי או חוזה אישי יכולים לקבוע
          יותר, ולכן הסכום המדויק שלכם תלוי בחוזה ובשכר השעתי שלכם.
        </p>
      }
      content={
        <>
          <h2>מה נחשב שעה נוספת?</h2>
          <p>
            החוק מגדיר שעה נוספת כשעת עבודה שחורגת מיום העבודה או משבוע העבודה שנקבעו לעובד. כלומר,
            לא מספיק לשאול כמה שעות עבדתם היום. צריך לדעת מה אורך יום העבודה ושבוע העבודה שחלים עליכם.
          </p>
          <ul>
            <li>
              <strong>יום עבודה:</strong> לפי החוק, יום עבודה אינו עולה על 8 שעות. בעבודת לילה, וכן ביום
              שלפני המנוחה השבועית או לפני חג שבו העובד אינו עובד, התקרה היא 7 שעות.
            </li>
            <li>
              <strong>שבוע עבודה:</strong> החוק עצמו קובע תקרה של 45 שעות בשבוע. במקומות עבודה רבים נהוג שבוע
              קצר יותר, ומשרד העבודה מציין 42 שעות בשבוע כשבוע העבודה הרגיל. מה שקובע אצלכם הוא מה שחל על
              העובד לפי החוזה, ההסכם הקיבוצי או הצו שחל בענף.
            </li>
          </ul>
          <p>
            הסיבה שחשוב לבדוק: אותה שעת עבודה יכולה להיות &quot;רגילה&quot; במקום עבודה אחד ו&quot;נוספת&quot;
            במקום אחר, אם שבוע העבודה שם קצר יותר.
          </p>

          <h2>איך מחשבים: שלושה צעדים</h2>
          <ol>
            <li>
              <strong>מוצאים את השכר השעתי.</strong> אם אתם בשכר חודשי במשרה מלאה של חמישה ימים, מחלקים את
              השכר ב־{MONTHLY_HOURS_5_DAY_WEEK}. אם שכרכם שעתי, זה כבר המספר. החוק מגדיר &quot;שכר רגיל&quot;
              רחב, שכולל את התוספות שהמעסיק משלם, ולכן לא תמיד אפשר להסתפק בשכר היסוד בלבד.
            </li>
            <li>
              <strong>מפצלים את השעות הנוספות של אותו יום.</strong> שתי השעות הראשונות הן ב־{PCT_FIRST},
              וכל שעה אחריהן ב־{PCT_AFTER}.
            </li>
            <li>
              <strong>מכפילים ומחברים.</strong> זה הסכום ברוטו, לפני מס ולפני ניכויים.
            </li>
          </ol>

          <h2>דוגמה מחושבת</h2>
          <p>
            נניח שכר חודשי של {money(EXAMPLE_MONTHLY_WAGE)} ברוטו במשרה מלאה. השכר השעתי הוא{' '}
            {money(EXAMPLE_MONTHLY_WAGE)} ÷ {MONTHLY_HOURS_5_DAY_WEEK} = <strong>{money(EXAMPLE_HOURLY)}</strong>{' '}
            לשעה. הטבלה מראה כמה מקבלים על שעות נוספות ביום אחד:
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-ink/15 rounded-none overflow-hidden">
              <thead className="bg-cream-2">
                <tr className="text-right">
                  <th className="p-3 font-bold text-ink border-b border-ink/15">שעות נוספות ביום</th>
                  <th className="p-3 font-bold text-ink border-b border-ink/15">פירוט</th>
                  <th className="p-3 font-bold text-ink border-b border-ink/15">סה״כ ברוטו</th>
                  <th className="p-3 font-bold text-ink border-b border-ink/15">מזה תוספת מעל שכר רגיל</th>
                </tr>
              </thead>
              <tbody className="text-ink/70">
                {EXAMPLE_ROWS.map((row) => (
                  <tr key={row.hours}>
                    <td className="p-3 border-b font-medium text-ink">{row.hours}</td>
                    <td className="p-3 border-b">
                      {row.hoursAt125} × {PCT_FIRST}
                      {row.hoursAt150 > 0 ? ` + ${row.hoursAt150} × ${PCT_AFTER}` : ''}
                    </td>
                    <td className="p-3 border-b font-bold text-ink">{money(row.totalPay)}</td>
                    <td className="p-3 border-b text-green-700">{money(row.premium)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p>
            שימו לב לשורה השלישית: השעה השלישית עולה יותר מהראשונות, כי היא כבר ב־{PCT_AFTER}. חוזרים על
            החישוב בכל יום בנפרד, כי החלוקה ל־{PCT_FIRST} ול־{PCT_AFTER} נעשית לפי שעות באותו יום.
          </p>

          <h2>עבודה בשבת ובמנוחה השבועית</h2>
          <p>
            המנוחה השבועית לפי החוק היא לפחות 36 שעות רצופות, ובשבוע של עובד יהודי היא כוללת את יום
            השבת. עבודה בשעות האלה דורשת היתר, ועליה משלמים לפחות {PCT_REST} מהשכר הרגיל לכל שעה,
            או נותנים שעות מנוחה במקום התשלום. באותה דוגמה, 8 שעות עבודה בשבת הן {money(EXAMPLE_REST_DAY_8H)}{' '}
            ברוטו ({money(EXAMPLE_HOURLY)} × 8 × {OVERTIME_RATES.restDay}).
          </p>

          <h2>דוגמה מלאה: חודש עבודה עם משמרות</h2>
          <p>
            עובד בשכר חודשי של {money(EXAMPLE_MONTHLY_WAGE)} ברוטו עבד בחודש מסוים {MONTH_SHIFT_COUNT} משמרות.
            ההנחה בדוגמה: יום העבודה הרגיל הוא {REGULAR_DAY_HOURS} שעות, והבדיקה נעשית לפי יום. במקום עבודה
            שבו יום העבודה הרגיל ארוך או קצר מזה, החלוקה לשעות נוספות תהיה אחרת.
          </p>
          <p>
            שלב ראשון: מפרקים כל משמרת. השכר החודשי כבר מכסה את השעות הרגילות, ולכן משלמים בנוסף רק על
            השעות שמעבר ליום הרגיל ועל עבודה בשבת.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-ink/15 rounded-none overflow-hidden">
              <thead className="bg-cream-2">
                <tr className="text-right">
                  <th className="p-3 font-bold text-ink border-b border-ink/15">סוג משמרת</th>
                  <th className="p-3 font-bold text-ink border-b border-ink/15">כמות</th>
                  <th className="p-3 font-bold text-ink border-b border-ink/15">שעות במשמרת</th>
                  <th className="p-3 font-bold text-ink border-b border-ink/15">רגילות</th>
                  <th className="p-3 font-bold text-ink border-b border-ink/15">ב־{PCT_FIRST}</th>
                  <th className="p-3 font-bold text-ink border-b border-ink/15">ב־{PCT_AFTER}</th>
                  <th className="p-3 font-bold text-ink border-b border-ink/15">מנוחה שבועית ({PCT_REST})</th>
                </tr>
              </thead>
              <tbody className="text-ink/70">
                {SHIFT_GROUPS.map((group) => (
                  <tr key={group.label}>
                    <td className="p-3 border-b font-medium text-ink">{group.label}</td>
                    <td className="p-3 border-b">{group.count}</td>
                    <td className="p-3 border-b">{group.shift.hours}</td>
                    <td className="p-3 border-b">{group.split.regularHours}</td>
                    <td className="p-3 border-b">{group.split.hoursAt125}</td>
                    <td className="p-3 border-b">{group.split.hoursAt150}</td>
                    <td className="p-3 border-b">{group.split.restDayHours}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p>
            שלב שני: מסכמים את השעות לפי שיעור, כמו שורות בתלוש. המשמרת של 11 שעות תורמת 2 שעות ב־{PCT_FIRST}
            ושעה אחת ב־{PCT_AFTER}. כל שורה מעוגלת לאגורה. השכר השעתי הוא {money(MONTH.hourlyWage)}.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-ink/15 rounded-none overflow-hidden">
              <thead className="bg-cream-2">
                <tr className="text-right">
                  <th className="p-3 font-bold text-ink border-b border-ink/15">שורה בתלוש</th>
                  <th className="p-3 font-bold text-ink border-b border-ink/15">שעות</th>
                  <th className="p-3 font-bold text-ink border-b border-ink/15">חישוב</th>
                  <th className="p-3 font-bold text-ink border-b border-ink/15">סכום ברוטו</th>
                </tr>
              </thead>
              <tbody className="text-ink/70">
                <tr>
                  <td className="p-3 border-b font-medium text-ink">שכר חודשי</td>
                  <td className="p-3 border-b">—</td>
                  <td className="p-3 border-b">שכר קבוע</td>
                  <td className="p-3 border-b font-bold text-ink">{money(MONTH.baseSalary)}</td>
                </tr>
                {MONTH.lines.map((line) => (
                  <tr key={line.label}>
                    <td className="p-3 border-b font-medium text-ink">{line.label}</td>
                    <td className="p-3 border-b">{line.hours}</td>
                    <td className="p-3 border-b">
                      {line.hours} × {money(MONTH.hourlyWage)} × {line.rate}
                    </td>
                    <td className="p-3 border-b font-bold text-ink">{money(line.amount)}</td>
                  </tr>
                ))}
                <tr className="bg-cream-2/50">
                  <td className="p-3 border-b font-bold text-ink">סה״כ ברוטו לחודש</td>
                  <td className="p-3 border-b" />
                  <td className="p-3 border-b">
                    {money(MONTH.baseSalary)} + {money(MONTH.extraPay)}
                  </td>
                  <td className="p-3 border-b font-bold text-ink">{money(MONTH.totalGross)}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            שימו לב: על שעה נוספת לא משלמים רק את התוספת. השעות האלה לא נכללות בשכר החודשי, ולכן הן
            משולמות במלואן ב־{PCT_FIRST} או ב־{PCT_AFTER} מהשכר השעתי. הסכום כאן הוא ברוטו: מס הכנסה,
            ביטוח לאומי והפרשות ינוכו ממנו כמו משאר השכר.
          </p>

          <h2>רשימת בדיקה לתלוש</h2>
          <ul>
            <li>האם השעות הנוספות מופיעות בשורות נפרדות, לפי שיעור, עם מספר שעות וסכום?</li>
            <li>האם מספר השעות בתלוש תואם את הרישום שלכם (שעון נוכחות, דיווח ידני, הודעות עבודה)?</li>
            <li>האם השכר השעתי שמשמש לחישוב כולל את התוספות הקבועות שמגיעות לכם?</li>
            <li>אם יש סכום גלובלי &quot;שעות נוספות&quot;: האם הוא מכסה את מספר השעות שעבדתם בפועל?</li>
            <li>האם עבודה בשבת או בחג נרשמה בנפרד ובשיעור הנכון?</li>
          </ul>

          <h2>מה הדף הזה לא עושה</h2>
          <p>
            הדף מסביר את שיעורי המינימום שבחוק. הוא לא קובע אילו מהשעות שלכם נחשבות נוספות, לא בודק אם
            החוק חל על התפקיד שלכם, ולא מחליף חוזה, הסכם קיבוצי או ייעוץ משפטי. כדי להבין כמה מהברוטו
            ישאר אחרי מס, אפשר להשתמש ב<Link href="/personal-tax/salary-net-gross">מחשבון ברוטו נטו</Link>.
            להמשך בדיקת זכויות ראו גם את <Link href="/employee-rights/annual-leave">חופשה שנתית</Link>,
            את <Link href="/employee-rights/sick-pay">דמי מחלה</Link> ואת{' '}
            <Link href="/employee-rights/minimum-wage">שכר המינימום</Link>.
          </p>

          <h2>מקורות</h2>
          <ul>
            <li>
              <a
                href="https://he.wikisource.org/wiki/חוק_שעות_עבודה_ומנוחה"
                target="_blank"
                rel="noopener noreferrer"
              >
                חוק שעות עבודה ומנוחה, תשי״א־1951 — נוסח החוק (סעיפים 1, 2, 3, 7, 16, 17 ו־18)
              </a>
            </li>
            <li>
              <a
                href="https://www.gov.il/he/service/request-for-employment-during-weekend-or-extra-hours"
                target="_blank"
                rel="noopener noreferrer"
              >
                משרד העבודה — העסקה בשעות נוספות ובמנוחה השבועית
              </a>
            </li>
            <li>
              <a
                href="https://www.btl.gov.il/Mediniyut/GeneralData/Pages/%D7%A9%D7%9B%D7%A8%20%D7%9E%D7%99%D7%A0%D7%99%D7%9E%D7%95%D7%9D.aspx"
                target="_blank"
                rel="noopener noreferrer"
              >
                ביטוח לאומי — שכר מינימום (המחלק של {MONTHLY_HOURS_5_DAY_WEEK} שעות לחודש)
              </a>
            </li>
          </ul>
        </>
      }
      faq={<FAQ items={faqItems} />}
    />
  );
}
