import Link from 'next/link';
import { Metadata } from 'next';
import { ArrowLeft, Calculator } from 'lucide-react';
import { Breadcrumbs } from '@/components/calculator/Breadcrumbs';
import { FAQ } from '@/components/calculator/FAQ';
import { PENSION_CONSTANTS_2026 } from '@/lib/calculators/pension';

export const metadata: Metadata = {
  alternates: { canonical: '/insurance' },
  title: 'מחשבוני ביטוחים ופנסיה 2026 – חישוב קצבה ועלות ביטוח',
  description: 'חשב את הפנסיה הצפויה שלך לפי שכר וותק, סכום ביטוח החיים הנדרש למשפחה ועלות ביטוח רכב. מחשבונים מקצועיים לתכנון פיננסי, עדכניים ל-2026 — חינם ומיידי.',
};

const calculators = [
  {
    title: 'מחשבון פנסיה צפויה',
    description: 'חשב את הקצבה החודשית שתקבל בפרישה',
    href: '/insurance/pension',
    available: true,
    icon: '👴',
  },
  {
    title: 'מחשבון ביטוח חיים',
    description: 'חישוב סכום ביטוח נדרש למשפחה',
    href: '/insurance/life',
    available: false,
    icon: '🛡️',
  },
  {
    title: 'מחשבון ביטוח רכב',
    description: 'השוואת ביטוח חובה ומקיף',
    href: '/insurance/car',
    available: false,
    icon: '🚗',
  },
];

const faqItems = [
  {
    question: 'כמה מפרישים לפנסיה מהשכר ב-2026?',
    // שיעורי הפרשה = PENSION_CONSTANTS_2026.minContribRates / maxContribRates (lib/calculators/pension.ts)
    answer: `ההפרשה המינימלית לפי צו ההרחבה היא ${PENSION_CONSTANTS_2026.minContribRates.total}% מהשכר: ${PENSION_CONSTANTS_2026.minContribRates.employee}% ניכוי מהעובד, ${PENSION_CONSTANTS_2026.minContribRates.employer}% תגמולי מעסיק ו-${PENSION_CONSTANTS_2026.minContribRates.severance}% לרכיב פיצויים. ניתן להגדיל עד ${PENSION_CONSTANTS_2026.maxContribRates.total}% (${PENSION_CONSTANTS_2026.maxContribRates.employee}% עובד, ${PENSION_CONSTANTS_2026.maxContribRates.employer}% מעסיק ו-${PENSION_CONSTANTS_2026.maxContribRates.severance}% פיצויים). ההבדל בין המינימום למקסימום מצטבר למאות אלפי שקלים לאורך קריירה.`,
  },
  {
    question: 'מהו מקדם המרה ואיך הוא קובע את הקצבה?',
    // מקדמים = PENSION_CONSTANTS_2026.conversionFactors / conversionFactorsWithSpouse (lib/calculators/pension.ts)
    answer: `הקצבה החודשית בפרישה מחושבת פשוט: הצבירה הכוללת חלקי מקדם ההמרה. בגיל 67 המקדם עומד על כ-${PENSION_CONSTANTS_2026.conversionFactors[67]} ללא הבטחת קצבת שאירים, וכ-${PENSION_CONSTANTS_2026.conversionFactorsWithSpouse[67]} עם קצבת שאירים לבן/בת הזוג. לדוגמה, המשמעות היא שכל 100,000 ₪ צבורים מתורגמים לכמה מאות שקלים של קצבה חודשית — ולכן דחיית פרישה, שמקטינה את המקדם ומגדילה את הצבירה, מעלה את הקצבה משני הכיוונים.`,
  },
  {
    question: 'האם קצבת הפנסיה חייבת במס?',
    // פטור קצבה = PENSION_CONSTANTS_2026.pensionTaxExemptionPct / pensionEligibleCeiling / pensionTaxExemptionCeiling (lib/calculators/pension.ts)
    answer: `קצבת פנסיה נחשבת הכנסה חייבת, אבל מגיל 67 קיים פטור משמעותי לפי סעיף 9א: ${PENSION_CONSTANTS_2026.pensionTaxExemptionPct}% מ"הקצבה המזכה" פטורים ממס, עד תקרת קצבה מזכה של ${PENSION_CONSTANTS_2026.pensionEligibleCeiling.toLocaleString('he-IL')} ₪ בחודש — פטור מרבי של כ-${PENSION_CONSTANTS_2026.pensionTaxExemptionCeiling.toLocaleString('he-IL')} ₪ בחודש ב-2026. על היתרה חלות מדרגות המס הרגילות, בקיזוז נקודות זיכוי.`,
  },
  {
    question: 'כמה קצבת אזרח ותיק מקבלים מביטוח לאומי?',
    // קצבת אזרח ותיק = PENSION_CONSTANTS_2026.nationalInsurancePension (lib/calculators/pension.ts)
    answer: `קצבת אזרח ותיק בסיסית עומדת ב-2026 על כ-${PENSION_CONSTANTS_2026.nationalInsurancePension.single.toLocaleString('he-IL')} ₪ בחודש ליחיד וכ-${PENSION_CONSTANTS_2026.nationalInsurancePension.couple.toLocaleString('he-IL')} ₪ לזוג, ומי שדוחה את קבלתה לגיל 70 מקבל תוספת דחייה. הקצבה משולמת בנוסף לפנסיה התעסוקתית — אבל היא לבדה רחוקה מלהספיק לשמירה על רמת החיים, ולכן חשוב לבדוק במחשבון הפנסיה מה צפויה להיות הקצבה הכוללת שלכם.`,
  },
];

export default function InsurancePage() {
  return (
    <div className="min-h-screen bg-paper">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Breadcrumbs items={[{ label: 'דף הבית', href: '/' }, { label: 'ביטוחים' }]} />
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-ink mb-3">💼 מחשבוני ביטוחים</h1>
        <p className="text-lg text-ink/70 mb-6">
          מחשבונים לתכנון פנסיוני וביטוחי. גלה כמה תקבל בפרישה וכמה ביטוח אתה צריך.
        </p>

        {/* Quick answer */}
        <section className="answer-box bg-cream-2 border-r-4 border-gold p-5 mb-8" aria-label="תשובה מהירה">
          <p className="text-lg text-ink leading-relaxed">
            כמה פנסיה תקבלו בפרישה? הקצבה החודשית היא הצבירה הפנסיונית חלקי מקדם ההמרה —
            בגיל 67 המקדם עומד על כ-{PENSION_CONSTANTS_2026.conversionFactors[67]} ללא קצבת
            שאירים. הצבירה עצמה נבנית מהפרשה חודשית של{' '}
            {PENSION_CONSTANTS_2026.minContribRates.total}% מהשכר לפחות (
            {PENSION_CONSTANTS_2026.minContribRates.employee}% עובד,{' '}
            {PENSION_CONSTANTS_2026.minContribRates.employer}% מעסיק ו-
            {PENSION_CONSTANTS_2026.minContribRates.severance}% פיצויים), ומושפעת דרמטית
            מדמי הניהול ומהתשואה לאורך עשרות שנים. מחשבון הפנסיה בעמוד זה מתרגם את הנתונים
            שלכם לקצבה צפויה — ומראה מה משנה כל אחוז.
          </p>
        </section>

        <div className="grid md:grid-cols-2 gap-4">
          {calculators.map((calc) =>
            calc.available ? (
              <Link
                key={calc.href}
                href={calc.href}
                className="group bg-paper p-6 rounded-none border-2 border-ink/15 hover:border-gold hover:shadow-md transition flex items-start gap-4"
              >
                <div className="text-3xl">{calc.icon}</div>
                <div className="flex-1">
                  <h3 className="font-bold text-ink mb-1 group-hover:text-gold transition">
                    {calc.title}
                  </h3>
                  <p className="text-sm text-ink/70">{calc.description}</p>
                </div>
                <ArrowLeft className="w-4 h-4 text-gold mt-2 opacity-0 group-hover:opacity-100 transition" />
              </Link>
            ) : (
              <div
                key={calc.href}
                className="bg-cream-2 p-6 rounded-none border-2 border-ink/15 flex items-start gap-4 opacity-60"
              >
                <div className="text-3xl">{calc.icon}</div>
                <div className="flex-1">
                  <h3 className="font-bold text-ink/70 mb-1">{calc.title}</h3>
                  <p className="text-sm text-ink/70">{calc.description}</p>
                  <span className="inline-block mt-2 text-xs bg-cream-2 text-ink/70 px-2 py-1 rounded-none">
                    בקרוב
                  </span>
                </div>
              </div>
            ),
          )}
        </div>

        {/* ===== איך בוחרים את הכלי הנכון ===== */}
        <section className="mt-14">
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-gold mb-2">
            ✦ מדריך מהיר
          </p>
          <h2 className="text-2xl font-bold text-ink mb-4">איזה כלי מתאים לכם?</h2>
          <div className="space-y-4 text-ink/75 leading-relaxed">
            <p>
              נקודת ההתחלה היא{' '}
              <Link href="/insurance/pension" className="text-gold underline underline-offset-2 hover:text-ink transition">מחשבון הפנסיה הצפויה</Link>
              : מזינים שכר, גיל, צבירה קיימת ודמי ניהול, ומקבלים את הקצבה החודשית הצפויה
              בפרישה — כולל השוואה בין תרחישי תשואה והמחשה של עלות דמי הניהול לאורך השנים.
              זהו הכלי החשוב ביותר בעמוד, כי פערים קטנים היום מתורגמים לפערי ענק בקצבה.
            </p>
            <p>
              לתכנון רחב יותר של הפרישה, המשיכו ל
              <Link href="/investments/retirement" className="text-gold underline underline-offset-2 hover:text-ink transition">מחשבון תכנון הפרישה</Link>{' '}
              שבודק אם סך החיסכון שלכם (פנסיה + השקעות) יספיק לרמת החיים הרצויה, ול
              <Link href="/investments/compound-interest" className="text-gold underline underline-offset-2 hover:text-ink transition">מחשבון ריבית דריבית</Link>{' '}
              כדי לראות כמה שווה כל הפקדה נוספת לאורך זמן. שכירים שרוצים להבין כמה בדיוק
              מנוכה מהתלוש לפנסיה ולביטוחים ימצאו פירוט שורה-שורה ב
              <Link href="/employee-rights/salary-deductions" className="text-gold underline underline-offset-2 hover:text-ink transition">מחשבון הניכויים ממשכורת</Link>
              . מחשבוני ביטוח החיים וביטוח הרכב יתווספו לעמוד בקרוב.
            </p>
          </div>
        </section>

        {/* ===== טבלת הפרשות ===== */}
        <section className="mt-14">
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-gold mb-2">
            ✦ השוואה
          </p>
          <h2 className="text-2xl font-bold text-ink mb-4">שיעורי ההפרשה לפנסיה 2026</h2>
          <div className="overflow-x-auto border border-ink/15">
            <table className="w-full text-sm text-right">
              <thead>
                <tr className="bg-ink text-cream">
                  <th className="px-4 py-3 font-mono text-xs uppercase tracking-[0.1em] font-normal">רכיב</th>
                  <th className="px-4 py-3 font-mono text-xs uppercase tracking-[0.1em] font-normal">מינימום (צו הרחבה)</th>
                  <th className="px-4 py-3 font-mono text-xs uppercase tracking-[0.1em] font-normal">מקסימום מוטב</th>
                </tr>
              </thead>
              <tbody>
                {/* כל השיעורים מיובאים מ-PENSION_CONSTANTS_2026 (lib/calculators/pension.ts) */}
                <tr className="border-t border-ink/10 bg-paper">
                  <td className="px-4 py-3 font-semibold text-ink">ניכוי עובד (תגמולים)</td>
                  <td className="px-4 py-3 text-ink/75">{PENSION_CONSTANTS_2026.minContribRates.employee}%</td>
                  <td className="px-4 py-3 text-ink/75">{PENSION_CONSTANTS_2026.maxContribRates.employee}%</td>
                </tr>
                <tr className="border-t border-ink/10 bg-cream-2">
                  <td className="px-4 py-3 font-semibold text-ink">הפרשת מעסיק (תגמולים)</td>
                  <td className="px-4 py-3 text-ink/75">{PENSION_CONSTANTS_2026.minContribRates.employer}%</td>
                  <td className="px-4 py-3 text-ink/75">{PENSION_CONSTANTS_2026.maxContribRates.employer}%</td>
                </tr>
                <tr className="border-t border-ink/10 bg-paper">
                  <td className="px-4 py-3 font-semibold text-ink">הפרשת מעסיק (פיצויים)</td>
                  <td className="px-4 py-3 text-ink/75">{PENSION_CONSTANTS_2026.minContribRates.severance}%</td>
                  <td className="px-4 py-3 text-ink/75">{PENSION_CONSTANTS_2026.maxContribRates.severance}%</td>
                </tr>
                <tr className="border-t border-ink/15 bg-cream-2">
                  <td className="px-4 py-3 font-bold text-ink">סה&quot;כ מהשכר</td>
                  <td className="px-4 py-3 font-bold text-ink">{PENSION_CONSTANTS_2026.minContribRates.total}%</td>
                  <td className="px-4 py-3 font-bold text-ink">{PENSION_CONSTANTS_2026.maxContribRates.total}%</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-sm text-ink/70 leading-relaxed">
            ההפרשות מזכות בהטבות מס עד תקרת שכר של{' '}
            {PENSION_CONSTANTS_2026.pensionCeiling.toLocaleString('he-IL')} ₪ בחודש. הפער בין
            המסלול המינימלי למקסימלי נראה קטן על תלוש בודד, אבל על פני 30–40 שנות עבודה הוא
            משנה את הקצבה בעשרות אחוזים — בדקו את שני התרחישים במחשבון הפנסיה.
          </p>
        </section>

        {/* ===== FAQ ===== */}
        <section className="mt-14">
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-gold mb-2">
            ✦ שאלות נפוצות
          </p>
          <h2 className="text-2xl font-bold text-ink mb-4">שאלות נפוצות על פנסיה וביטוח</h2>
          <FAQ items={faqItems} />
        </section>

        <p className="mt-10 text-xs text-ink/70 leading-relaxed">
          המידע בדף זה הוא מידע כללי בלבד ואינו מהווה ייעוץ פנסיוני, ייעוץ ביטוחי או שיווק
          פנסיוני כהגדרתם בחוק. שיעורי ההפרשה, המקדמים והתקרות מתעדכנים מעת לעת — לפני קבלת
          החלטות התייעצו עם בעל רישיון מתאים.
        </p>
      </div>
    </div>
  );
}
