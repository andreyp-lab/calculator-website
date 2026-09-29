import Link from 'next/link';
import { Metadata } from 'next';
import { ArrowLeft } from 'lucide-react';
import { Breadcrumbs } from '@/components/calculator/Breadcrumbs';
import { FAQ } from '@/components/calculator/FAQ';
import { PENSION_CONSTANTS_2026 } from '@/lib/calculators/pension';

export const metadata: Metadata = {
  alternates: { canonical: '/insurance' },
  title: 'ביטוחים ופנסיה — כלים ומדריכים',
  description: 'מידע לבדיקת הפנסיה בדוח האישי, מסלול הפרישה ודמי הניהול, לצד כלים לתכנון פיננסי.',
};

const calculators = [
  {
    title: 'מדריך בדיקת פנסיה צפויה',
    description: 'בדקו את הדוח האישי ואת מסלולי הקצבה',
    href: '/insurance/pension',
    icon: '👴',
  },
];

const faqItems = [
  {
    question: 'כמה מפרישים לפנסיה מהשכר ב-2026?',
    // שיעורי הפרשה = PENSION_CONSTANTS_2026.minContribRates / maxContribRates (lib/calculators/pension.ts)
    answer: `לפי צו ההרחבה הכללי שיעור ההפקדה המינימלי הוא ${PENSION_CONSTANTS_2026.minContribRates.total}% מהשכר הקובע: ${PENSION_CONSTANTS_2026.minContribRates.employee}% עובד, ${PENSION_CONSTANTS_2026.minContribRates.employer}% תגמולי מעסיק ו-${PENSION_CONSTANTS_2026.minContribRates.severance}% לרכיב פיצויים. הסכם מיטיב, שכר קובע ותקרות יכולים לשנות את ההפקדה האישית; בדקו בתלוש ובדוח הקרן.`,
  },
  {
    question: 'מהו מקדם המרה ואיך הוא קובע את הקצבה?',
    answer: 'מקדם ההמרה משמש לחישוב הקצבה מתוך הצבירה. הוא אינו מספר אחיד לגיל פרישה מסוים: תקנון הקרן, גיל הפורש, מסלול השאירים ופרטי בן או בת הזוג עשויים להשפיע. בקשו מהקרן הצעה לפי הנתונים שלכם.',
  },
  {
    question: 'האם קצבת הפנסיה חייבת במס?',
    // פטור קצבה = PENSION_CONSTANTS_2026.pensionTaxExemptionPct / pensionEligibleCeiling / pensionTaxExemptionCeiling (lib/calculators/pension.ts)
    answer: `קצבת פנסיה עשויה להיות חייבת במס. בשנת 2026 שיעור הפטור המרבי על קצבה מזכה הוא ${PENSION_CONSTANTS_2026.pensionTaxExemptionPct}% מתקרה של ${PENSION_CONSTANTS_2026.pensionEligibleCeiling.toLocaleString('he-IL')} ₪ בחודש, עד ${PENSION_CONSTANTS_2026.pensionTaxExemptionCeiling.toLocaleString('he-IL')} ₪ בחודש. הזכאות האישית תלויה בגיל הזכאות, במענקי פרישה ובהחלטות קיבוע זכויות; בדקו ברשות המסים.`,
  },
  {
    question: 'כמה קצבת אזרח ותיק מקבלים מביטוח לאומי?',
    // קצבת אזרח ותיק = PENSION_CONSTANTS_2026.nationalInsurancePension (lib/calculators/pension.ts)
    answer: `קצבת אזרח ותיק בסיסית עומדת ב-2026 על ${PENSION_CONSTANTS_2026.nationalInsurancePension.single.toLocaleString('he-IL')} ₪ בחודש ליחיד. סכום לזוג שבו רק אחד זכאי לקצבה, הכולל תוספת בן/בת זוג בכפוף לתנאים, הוא ${PENSION_CONSTANTS_2026.nationalInsurancePension.couple.toLocaleString('he-IL')} ₪. תוספות ותק ודחייה משנות את הסכום האישי. לבדיקת זכאות מדויקת יש להשתמש במחשבון ביטוח לאומי.`,
  },
];

export default function InsurancePage() {
  return (
    <div className="min-h-screen bg-paper">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Breadcrumbs items={[{ label: 'דף הבית', href: '/' }, { label: 'ביטוחים' }]} />
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-ink mb-3">💼 ביטוח ופנסיה</h1>
        <p className="text-lg text-ink/70 mb-6">
          מידע לבדיקת הדוח הפנסיוני, ההפקדות והאפשרויות לקראת פרישה.
        </p>

        {/* Quick answer */}
        <section className="answer-box bg-cream-2 border-r-4 border-gold p-5 mb-8" aria-label="תשובה מהירה">
          <p className="text-lg text-ink leading-relaxed">
            כמה פנסיה תקבלו בפרישה? בדקו בדוח הקרן את הצבירה ואת אומדן הקצבה לפי המסלול האישי.
            שיעורי ההפקדה לפי הצו הכללי הם{' '}
            {PENSION_CONSTANTS_2026.minContribRates.total}% מהשכר לפחות (
            {PENSION_CONSTANTS_2026.minContribRates.employee}% עובד,{' '}
            {PENSION_CONSTANTS_2026.minContribRates.employer}% מעסיק ו-
            {PENSION_CONSTANTS_2026.minContribRates.severance}% פיצויים), בכפוף לשכר הקובע
            ולהסדר החל. דמי ניהול, תשואות ומסלול קצבה משפיעים על התוצאה; אין מקדם אחיד לכל פורש.
          </p>
        </section>

        <div className="grid md:grid-cols-2 gap-4">
          {calculators.map((calc) => (
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
          ))}
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
              <Link href="/insurance/pension" className="text-gold underline underline-offset-2 hover:text-ink transition">מדריך בדיקת הפנסיה</Link>
              : בודקים בדוח האישי את הצבירה, ההפקדות ודמי הניהול, ופונים לקרן לקבלת אומדן
              קצבה לפי מסלול הפרישה והנתונים האישיים.
              זו נקודת התחלה לקבלת תמונה אישית לפני החלטות על הפקדות או פרישה.
            </p>
            <p>
              לתכנון רחב יותר של הפרישה, המשיכו ל
              <Link href="/investments/retirement" className="text-gold underline underline-offset-2 hover:text-ink transition">מדריך תכנון הפרישה</Link>{' '}
              שמסייע למפות מקורות הכנסה, צרכים והתחייבויות, ול
              <Link href="/investments/compound-interest" className="text-gold underline underline-offset-2 hover:text-ink transition">מחשבון ריבית דריבית</Link>{' '}
              כדי לראות תרחישים אפשריים של הפקדה לאורך זמן. שכירים שרוצים להבין את
              רכיבי הניכוי בתלוש לפנסיה ולביטוחים ימצאו הסבר ב
              <Link href="/employee-rights/salary-deductions" className="text-gold underline underline-offset-2 hover:text-ink transition">מחשבון הניכויים ממשכורת</Link>
              .
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
                </tr>
              </thead>
              <tbody>
                {/* כל השיעורים מיובאים מ-PENSION_CONSTANTS_2026 (lib/calculators/pension.ts) */}
                <tr className="border-t border-ink/10 bg-paper">
                  <td className="px-4 py-3 font-semibold text-ink">ניכוי עובד (תגמולים)</td>
                  <td className="px-4 py-3 text-ink/75">{PENSION_CONSTANTS_2026.minContribRates.employee}%</td>
                </tr>
                <tr className="border-t border-ink/10 bg-cream-2">
                  <td className="px-4 py-3 font-semibold text-ink">הפרשת מעסיק (תגמולים)</td>
                  <td className="px-4 py-3 text-ink/75">{PENSION_CONSTANTS_2026.minContribRates.employer}%</td>
                </tr>
                <tr className="border-t border-ink/10 bg-paper">
                  <td className="px-4 py-3 font-semibold text-ink">הפרשת מעסיק (פיצויים)</td>
                  <td className="px-4 py-3 text-ink/75">{PENSION_CONSTANTS_2026.minContribRates.severance}%</td>
                </tr>
                <tr className="border-t border-ink/15 bg-cream-2">
                  <td className="px-4 py-3 font-bold text-ink">סה&quot;כ מהשכר</td>
                  <td className="px-4 py-3 font-bold text-ink">{PENSION_CONSTANTS_2026.minContribRates.total}%</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-sm text-ink/70 leading-relaxed">
            הטבות המס על ההפקדות תלויות בתקרות, במעמד ובסוג ההפקדה. בדקו את התקרה המתאימה
            לכם לפני שינוי ההפקדה.
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
