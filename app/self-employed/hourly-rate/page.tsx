import type { Metadata } from 'next';
import Link from 'next/link';
import { CalculatorLayout } from '@/components/calculator/CalculatorLayout';
import { FAQ } from '@/components/calculator/FAQ';
import { HourlyRateBasicCalculator } from '@/components/calculators/HourlyRateBasicCalculator';
import { VAT_2026 } from '@/lib/constants/tax-2026';

const PAGE_PATH = '/self-employed/hourly-rate';
const VAT_RATE_GUIDANCE =
  'https://www.gov.il/BlobFolder/dynamiccollectorresultitem/represent-info-051224-2/he/vat_represent-info-051224-2.pdf';
const EXEMPT_DEALER_REGISTRATION =
  'https://www.gov.il/he/service/request-open-exempt-dealer-via-internet';

const EXAMPLE = {
  monthlyWorkHours: 160,
  nonBillableHours: 40,
  fixedCosts: 3_500,
  variableCosts: 1_500,
  ownerIncomeTarget: 13_000,
  reserves: 3_000,
  businessProfit: 3_000,
  projectDeliveryHours: 24,
  projectCoordinationHours: 4,
  projectRevisionHours: 4,
  projectExternalCosts: 1_200,
  retainerHours: 20,
} as const;

const billableHours = EXAMPLE.monthlyWorkHours - EXAMPLE.nonBillableHours;
const monthlyRevenueTarget =
  EXAMPLE.fixedCosts +
  EXAMPLE.variableCosts +
  EXAMPLE.ownerIncomeTarget +
  EXAMPLE.reserves +
  EXAMPLE.businessProfit;
const hourlyPlanningRate = monthlyRevenueTarget / billableHours;
const projectHours =
  EXAMPLE.projectDeliveryHours +
  EXAMPLE.projectCoordinationHours +
  EXAMPLE.projectRevisionHours;
const projectPrice = projectHours * hourlyPlanningRate + EXAMPLE.projectExternalCosts;
const retainerPrice = EXAMPLE.retainerHours * hourlyPlanningRate;
const retainerPriceWithVat = retainerPrice * (1 + VAT_2026.standard);

const formatAmount = (amount: number) =>
  amount.toLocaleString('he-IL', { maximumFractionDigits: 0 });
const formatPercent = (rate: number) =>
  rate.toLocaleString('he-IL', { style: 'percent', maximumFractionDigits: 0 });

export const metadata: Metadata = {
  title: { absolute: 'תמחור שעת עבודה לעצמאי: מחשבון ומדריך | חשבונאי' },
  description:
    'איך מחשבים מחיר שעת עבודה לפרילנסר? מחשבון ומדריך לשעות חיוב, עלויות, עתודה ורווח, כולל דוגמאות לתמחור פרויקט וריטיינר לפני מע״מ וצ׳קליסט להצעה.',
  alternates: { canonical: PAGE_PATH },
  openGraph: {
    title: 'תמחור שעת עבודה לעצמאי ולפרילנסר',
    description:
      'נוסחה מעשית לתעריף שעה, שעות חיוב, מחיר לפרויקט וריטיינר — עם הנחות גלויות ודוגמאות מחושבות.',
    url: PAGE_PATH,
    type: 'article',
    locale: 'he_IL',
    images: ['/opengraph-image'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'תמחור שעת עבודה לעצמאי ולפרילנסר',
    description: 'מחשבון ומדריך מעשי לתמחור שעה, פרויקט וריטיינר.',
    images: ['/opengraph-image'],
  },
};

const faqItems = [
  {
    question: 'איך מחשבים מחיר שעת עבודה לפרילנסר?',
    answer:
      'מתחילים מיעד הכנסות חודשי שמכסה עלויות עסקיות, סכום מבוקש למחיה או משיכה, עתודות ורווח רצוי. את היעד מחלקים רק בשעות שאפשר לחייב לקוחות בפועל, לאחר הפחתת שיווק, ניהול, גבייה, למידה והיעדרויות. זו נקודת תכנון, לא תעריף שוק ולא חישוב נטו.',
  },
  {
    question: 'מה ההבדל בין שעות עבודה לשעות חיוב?',
    answer:
      'שעות עבודה כוללות את כל הזמן שמושקע בעסק. שעות חיוב הן רק השעות שנמכרות ללקוח או נכללות במוצר מתומחר. זמן להצעות מחיר, הנהלה, שיווק, גבייה ופיתוח מקצועי בדרך כלל אינו מחויב ישירות, ולכן חלוקה בכל שעות העבודה עלולה להציג יעד שעתי נמוך מדי.',
  },
  {
    question: 'האם המחשבון מציג תעריף שוק מומלץ?',
    answer:
      'לא. המחשבון מחלק יעד הכנסות בשעות חיוב ומציג יעד חשבוני בלבד. מחיר שניתן לגבות תלוי בתחום, בניסיון, בהצעת הערך, ברמת האחריות, בחלופות של הלקוח ובהסכם. אין בעמוד טבלת תעריפי שוק משום שלא קיים שיעור אחיד ואמין שמתאים לכל מקצוע ולקוח.',
  },
  {
    question: 'איך ממירים תעריף שעתי למחיר לפרויקט?',
    answer:
      'מעריכים בנפרד שעות ביצוע, תיאום, פגישות, בדיקות וסבבי תיקון; מכפילים ביעד השעתי; ומוסיפים עלויות חיצוניות שאינן כלולות בתעריף. בהצעה מגדירים תוצרים, מספר סבבים, מה נחשב שינוי היקף ומה מחיר עבודה נוספת.',
  },
  {
    question: 'איך מתמחרים ריטיינר חודשי?',
    answer:
      'מגדירים מה הלקוח מקבל בכל חודש: שעות או תוצרים, זמני תגובה, פגישות, טיפול דחוף וכללי העברת יתרה. מחיר בסיסי אפשר לחשב לפי קיבולת חודשית שמורה כפול יעד התעריף, ואז לבדוק אם ההתחייבות לזמינות או להיקף מצדיקה התאמה.',
  },
  {
    question: 'האם להוסיף מע״מ למחיר?',
    answer: `עוסק מורשה מציג בהצעה באופן ברור אם המחיר לפני מע״מ או כולל מע״מ, ומוסיף את המס לפי הדין החל. השיעור הרגיל שבקבועי האתר הוא ${formatPercent(VAT_2026.standard)}. עוסק פטור אינו גובה מע״מ מלקוחותיו. המעמד, מועד החיוב וסוג העסקה עשויים להשפיע, ולכן אין להסיק מהמחשבון כיצד להפיק מסמך מס.`,
  },
];

export default function HourlyRatePage() {
  return (
    <CalculatorLayout
      title="תמחור שעת עבודה לעצמאי ולפרילנסר"
      description="מחשבון ומדריך לקביעת יעד תעריף לפי שעות חיוב, עלויות, עתודות ורווח — לפני שמנסחים הצעה ללקוח."
      breadcrumbs={[
        { label: 'דף הבית', href: '/' },
        { label: 'עצמאים', href: '/self-employed' },
        { label: 'תמחור שעת עבודה' },
      ]}
      pageUrl={PAGE_PATH}
      lastUpdated="2026-10-02"
      quickAnswer={
        <p>
          כדי לחשב מחיר שעת עבודה לפרילנסר, קובעים תחילה יעד הכנסות חודשי שמכסה
          עלויות קבועות ומשתנות, סכום מבוקש למחיה, עתודות ורווח עסקי. את היעד מחלקים
          במספר <strong>שעות החיוב</strong> הצפויות — לא בכל שעות העבודה. לדוגמה, יעד
          של {formatAmount(monthlyRevenueTarget)} ₪ לפני מע״מ ו־{billableHours} שעות
          חיוב נותנים יעד של {formatAmount(hourlyPlanningRate)} ₪ לשעה. זהו מחיר תכנון,
          לא אומדן נטו ולא תעריף שוק. לאחר החישוב בודקים ביקוש, היקף אחריות, תנאי תשלום
          ומה בדיוק כלול במחיר.
        </p>
      }
      calculator={<HourlyRateBasicCalculator />}
      content={
        <div className="guide-copy">
          <nav
            aria-label="תוכן עניינים"
            className="not-prose mb-10 border border-ink/20 bg-paper p-5 sm:p-6"
          >
            <p className="mb-3 font-bold text-ink">בעמוד זה</p>
            <ol className="grid gap-x-8 gap-y-2 text-sm text-ink/75 sm:grid-cols-2">
              <li><a className="hover:text-gold" href="#formula">1. נוסחת התמחור</a></li>
              <li><a className="hover:text-gold" href="#billable-hours">2. שעות חיוב</a></li>
              <li><a className="hover:text-gold" href="#costs">3. עלויות, עתודה ורווח</a></li>
              <li><a className="hover:text-gold" href="#monthly-example">4. דוגמה חודשית</a></li>
              <li><a className="hover:text-gold" href="#project-retainer">5. פרויקט וריטיינר</a></li>
              <li><a className="hover:text-gold" href="#vat">6. מע״מ</a></li>
              <li><a className="hover:text-gold" href="#proposal">7. הצעת מחיר</a></li>
              <li><a className="hover:text-gold" href="#review">8. בקרה ועדכון</a></li>
            </ol>
          </nav>

          <h2 id="formula" className="scroll-mt-40">נוסחת תמחור שעת עבודה</h2>
          <p>נקודת המוצא היא נוסחת תכנון פשוטה:</p>
          <div className="not-prose my-6 border-r-4 border-gold bg-cream-2 p-5 text-center">
            <p className="font-mono text-lg font-bold text-ink">
              יעד תעריף לשעת חיוב = יעד הכנסות חודשי ÷ שעות חיוב צפויות
            </p>
          </div>
          <p>
            הנוסחה אינה קובעת מה הלקוח יסכים לשלם. היא עונה על שאלה אחרת: איזה מחיר
            ממוצע צריך העסק לייצר מכל שעה שנמכרת כדי לעמוד ביעד שהוגדר. אחר כך בודקים
            את התוצאה מול הצעת הערך, רמת המומחיות, החלופות של הלקוח והסיכון שבהתחייבות.
          </p>

          <h2 id="billable-hours" className="scroll-mt-40">שעות עבודה אינן שעות חיוב</h2>
          <p>
            עצמאי יכול לעבוד יום מלא ועדיין לחייב רק חלק ממנו. שיווק, הכנת הצעות,
            גבייה, הנהלת חשבונות, תמיכה, למידה וחופשות צורכים זמן עסקי אך אינם תמיד
            מופיעים כשורה בחשבונית. לכן יש לתכנן קיבולת מתוך יומן אמיתי ולא מתוך מספר
            שעות העבודה התאורטי בחודש.
          </p>
          <div className="not-prose my-6 overflow-x-auto">
            <table className="w-full border border-ink/15 text-sm">
              <caption className="pb-3 text-right font-bold text-ink">מיפוי שעות לפני קביעת תעריף</caption>
              <thead className="bg-cream-2 text-right">
                <tr>
                  <th scope="col" className="border-b border-ink/15 p-3">סוג זמן</th>
                  <th scope="col" className="border-b border-ink/15 p-3">דוגמאות</th>
                  <th scope="col" className="border-b border-ink/15 p-3">איך מטפלים בתכנון</th>
                </tr>
              </thead>
              <tbody className="text-ink/75">
                <tr>
                  <th scope="row" className="border-b border-ink/15 p-3 text-right font-medium text-ink">שעות חיוב ישיר</th>
                  <td className="border-b border-ink/15 p-3">ביצוע, פגישה או טיפול שנכללים בהזמנה</td>
                  <td className="border-b border-ink/15 p-3">נכנסות למכנה של החישוב</td>
                </tr>
                <tr className="bg-cream-2/40">
                  <th scope="row" className="border-b border-ink/15 p-3 text-right font-medium text-ink">זמן פרויקט עקיף</th>
                  <td className="border-b border-ink/15 p-3">תיאום, בדיקות, תיקונים ותיעוד</td>
                  <td className="border-b border-ink/15 p-3">נכלל באומדן הפרויקט גם אם אינו מוצג ללקוח כשעות</td>
                </tr>
                <tr>
                  <th scope="row" className="p-3 text-right font-medium text-ink">זמן ניהול העסק</th>
                  <td className="p-3">שיווק, הנהלה, גבייה, למידה והיעדרויות</td>
                  <td className="p-3">מפחית את הקיבולת הזמינה לחיוב</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2 id="costs" className="scroll-mt-40">מה מכניסים ליעד ההכנסות?</h2>
          <p>
            יעד הכנסות שימושי מפריד בין רכיבים שונים במקום להוסיף ״אחוז ביטחון״ לא
            מוסבר. ההפרדה גם מונעת ספירה כפולה. זו מסגרת ניהולית, לא נוסחת מס או קביעה
            שכל רכיב הוא הוצאה מוכרת.
          </p>
          <ul>
            <li><strong>עלויות קבועות:</strong> תוכנות, משרד, ביטוחים ושירותים שמשולמים גם בחודש חלש.</li>
            <li><strong>עלויות משתנות:</strong> קבלני משנה, סליקה, נסיעות או רכש שמשתנים עם הפעילות.</li>
            <li><strong>סכום מבוקש למחיה או משיכה:</strong> יעד אישי; אצל עצמאי הוא אינו משכורת ואינו הופך אוטומטית להוצאה מוכרת.</li>
            <li><strong>עתודות:</strong> מסים לפי אומדן אישי, חופשה, מחלה, ציוד ותקופות ללא עבודה.</li>
            <li><strong>רווח עסקי:</strong> סכום שנשאר מעבר לכיסוי העלויות והיעדים האחרים, להשקעה ולצמיחה.</li>
          </ul>
          <p>
            לבניית בסיס נתונים אמיתי, התחילו מ־<Link href="/self-employed/allowed-expenses">מיפוי ההוצאות העסקיות</Link>{' '}
            ומ־<Link href="/self-employed/business-finance">תכנון תזרים ותקציב לעסק</Link>. מס הכנסה
            וביטוח לאומי תלויים בנתונים האישיים וברווח השנתי; המחשבון בעמוד אינו מחשב אותם.
          </p>

          <h2 id="monthly-example" className="scroll-mt-40">דוגמה 1: מתכנון חודשי ליעד שעתי</h2>
          <p>
            נניח, לצורך הדגמה בלבד, חודש של {EXAMPLE.monthlyWorkHours} שעות עבודה. מתוכן
            מוקצות {EXAMPLE.nonBillableHours} שעות לשיווק, ניהול, גבייה ולמידה, ולכן נשארות
            {billableHours} שעות חיוב. יעד ההכנסות נבנה מההנחות הבאות:
          </p>
          <div className="not-prose my-6 overflow-x-auto">
            <table className="w-full border border-ink/15 text-sm">
              <caption className="pb-3 text-right font-bold text-ink">הנחות הדוגמה — סכומים חודשיים לפני מע״מ</caption>
              <thead className="bg-cream-2 text-right">
                <tr>
                  <th scope="col" className="border-b border-ink/15 p-3">רכיב תכנון</th>
                  <th scope="col" className="border-b border-ink/15 p-3">סכום</th>
                </tr>
              </thead>
              <tbody className="text-ink/75">
                <tr><td className="border-b border-ink/15 p-3">עלויות קבועות</td><td className="border-b border-ink/15 p-3">{formatAmount(EXAMPLE.fixedCosts)} ₪</td></tr>
                <tr className="bg-cream-2/40"><td className="border-b border-ink/15 p-3">עלויות משתנות צפויות</td><td className="border-b border-ink/15 p-3">{formatAmount(EXAMPLE.variableCosts)} ₪</td></tr>
                <tr><td className="border-b border-ink/15 p-3">יעד אישי למחיה או משיכה</td><td className="border-b border-ink/15 p-3">{formatAmount(EXAMPLE.ownerIncomeTarget)} ₪</td></tr>
                <tr className="bg-cream-2/40"><td className="border-b border-ink/15 p-3">עתודות שהוגדרו בתכנון</td><td className="border-b border-ink/15 p-3">{formatAmount(EXAMPLE.reserves)} ₪</td></tr>
                <tr><td className="border-b border-ink/15 p-3">רווח עסקי רצוי</td><td className="border-b border-ink/15 p-3">{formatAmount(EXAMPLE.businessProfit)} ₪</td></tr>
                <tr className="bg-cream-2 font-bold text-ink"><th scope="row" className="p-3 text-right">יעד הכנסות</th><td className="p-3">{formatAmount(monthlyRevenueTarget)} ₪</td></tr>
              </tbody>
            </table>
          </div>
          <p>
            החישוב הוא {formatAmount(monthlyRevenueTarget)} ÷ {billableHours} ={' '}
            <strong>{formatAmount(hourlyPlanningRate)} ₪ לשעת חיוב לפני מע״מ</strong>. אם בפועל
            נמכרות פחות שעות, המחיר הממוצע הדרוש עולה; אם הקיבולת גדלה בלי להגדיל עלויות,
            הוא עשוי לרדת. אין להסיק מהדוגמה שזה המחיר המתאים למקצוע מסוים.
          </p>

          <h2 id="project-retainer" className="scroll-mt-40">דוגמה 2: מחיר לפרויקט ולריטיינר</h2>
          <h3>תמחור פרויקט</h3>
          <p>
            נניח פרויקט שדורש {EXAMPLE.projectDeliveryHours} שעות ביצוע,{' '}
            {EXAMPLE.projectCoordinationHours} שעות תיאום ו־{EXAMPLE.projectRevisionHours} שעות
            לבדיקות ותיקונים. סך הכול {projectHours} שעות. לפי יעד של{' '}
            {formatAmount(hourlyPlanningRate)} ₪ לשעה, רכיב העבודה הוא{' '}
            {formatAmount(projectHours * hourlyPlanningRate)} ₪. לאחר הוספת{' '}
            {formatAmount(EXAMPLE.projectExternalCosts)} ₪ של עלויות חיצוניות שצוינו מראש,
            מחיר התכנון הוא <strong>{formatAmount(projectPrice)} ₪ לפני מע״מ</strong>.
          </p>
          <p>
            מחיר קבוע לפרויקט אינו מבטל את הצורך לאמוד שעות. הוא פשוט מעביר את הסיכון של
            חריגה לספק, ולכן ההצעה צריכה להגדיר תוצרים, לוחות זמנים, מספר סבבי תיקון ומה
            ייחשב שינוי בהיקף.
          </p>
          <h3>תמחור ריטיינר</h3>
          <p>
            אם נשמרות ללקוח {EXAMPLE.retainerHours} שעות בחודש, בסיס התכנון הוא{' '}
            {EXAMPLE.retainerHours} × {formatAmount(hourlyPlanningRate)} ={' '}
            <strong>{formatAmount(retainerPrice)} ₪ לפני מע״מ</strong>. בריטיינר מגדירים גם
            זמני תגובה, תוצרים, פגישות, עבודה דחופה והאם שעות שלא נוצלו עוברות לחודש הבא.
            עצם ההתחייבות לזמינות עשויה להשפיע על המחיר, גם אם לא כל שעה נוצלה.
          </p>

          <h2 id="vat" className="scroll-mt-40">מע״מ: לא לערבב בין מחיר להכנסה</h2>
          <p>
            החישובים בדוגמאות מוצגים לפני מע״מ. עוסק מורשה צריך לנסח במפורש אם המחיר
            בהצעה הוא לפני מע״מ או כולל מע״מ. לפי הוראת רשות המסים, השיעור הרגיל הוא{' '}
            {formatPercent(VAT_2026.standard)}. לכן ריטיינר של {formatAmount(retainerPrice)} ₪
            לפני מע״מ מסתכם בדוגמה ב־{formatAmount(retainerPriceWithVat)} ₪ לתשלום, כל עוד
            זה השיעור החל על העסקה. המע״מ שנגבה אינו הכנסה שמממנת את יעד התמחור.
          </p>
          <p>
            עוסק פטור אינו גובה מע״מ מלקוחותיו, אך עדיין נדרש לתמחר את כל עלויותיו. למעמד
            ולמסמכים המתאימים ראו <Link href="/compare/osek-patur-vs-murshe">עוסק פטור מול עוסק מורשה</Link>{' '}
            ואת <Link href="/self-employed/invoices">מדריך החשבוניות והקבלות</Link>.
          </p>

          <h2 id="proposal" className="scroll-mt-40">מה חייב להיות ברור בהצעת המחיר?</h2>
          <p>
            תעריף לבדו אינו הצעה מלאה. לפני שליחה, עברו על הרשימה וודאו שאין פער בין מה
            שאתם מתכוונים לספק לבין מה שהלקוח עלול להבין:
          </p>
          <ul>
            <li>התוצרים והיקף העבודה שנכללים במחיר.</li>
            <li>מספר פגישות וסבבי תיקון, ומה נחשב שינוי היקף.</li>
            <li>עלויות חיצוניות, נסיעות, רישיונות או קבלני משנה.</li>
            <li>לוח זמנים, תלות בחומרים מהלקוח ותוקף ההצעה.</li>
            <li>מחיר עבודה נוספת, תנאי תשלום ומועד גבייה.</li>
            <li>האם המחיר לפני מע״מ או כולל מע״מ, לפי המעמד והעסקה.</li>
            <li>כללי דחייה, ביטול, הקפאה או העברת שעות בריטיינר.</li>
          </ul>

          <h2 id="review" className="scroll-mt-40">איך בודקים אם התמחור עובד?</h2>
          <p>
            בסוף כל חודש השוו בין התכנון לביצוע: יעד הכנסות מול הכנסות בפועל, שעות חיוב
            שתוכננו מול שעות שנמכרו, ושעות פרויקט שתומחרו מול הזמן שנמדד. חריגה חוזרת אינה
            תמיד סימן שצריך לעבוד מהר יותר; היא יכולה להעיד שחסר רכיב בהצעה, שהיקף העבודה
            אינו מוגדר או ששעות הניהול הוערכו בחסר.
          </p>
          <p>
            עדכנו את ההנחות כאשר עלות קבועה משתנה, כשנוסף שירות, כשהביקוש משתנה או כשנתוני
            הזמן מראים תמונה אחרת. לבדיקת נקודת הפתיחה הרחבה יותר, עברו ל־
            <Link href="/self-employed/business-setup-cost">מדריך עלות פתיחת עסק</Link>.
          </p>
          <p className="text-sm text-ink/65">
            היקף המדריך: תכנון מחיר וניהול קיבולת. הוא אינו חישוב חבות מס, הכנסה נטו,
            סיווג הוצאה, מחירון מקצועי או ייעוץ משפטי לניסוח חוזה.
          </p>
        </div>
      }
      faq={<FAQ items={faqItems} />}
      sources={
        <ul className="space-y-3 text-sm text-ink/75">
          <li>
            <a className="underline" href={VAT_RATE_GUIDANCE}>
              רשות המסים — הוראת פרשנות 01/2025 בדבר שיעור מע״מ של {formatPercent(VAT_2026.standard)}
            </a>
          </li>
          <li>
            <a className="underline" href={EXEMPT_DEALER_REGISTRATION}>
              רשות המסים — תנאי רישום עוסק פטור והבהרה לגבי מעמדו במע״מ
            </a>
          </li>
        </ul>
      }
    />
  );
}
