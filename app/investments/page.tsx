import Link from 'next/link';
import { Metadata } from 'next';
import { ArrowLeft, Calculator } from 'lucide-react';
import { Breadcrumbs } from '@/components/calculator/Breadcrumbs';
import { FAQ } from '@/components/calculator/FAQ';

export const metadata: Metadata = {
  alternates: { canonical: '/investments' },
  title: 'השקעות וחיסכון — מחשבונים ומדריכי פרישה',
  description:
    'כלים לתרחישי ריבית דריבית ותשואה לצד מדריכים לבדיקת פנסיה ופרישה מוקדמת.',
};

const calculators = [
  {
    title: 'מחשבון ריבית דריבית',
    description: 'השווה תרחישי צמיחה לפי הפקדות והנחות תשואה ואינפלציה',
    href: '/investments/compound-interest',
    available: true,
    icon: '📈',
  },
  {
    title: 'מחשבון ROI',
    description: 'חשב רווח ביחס לעלות ושיעור שנתי שקול לתקופה',
    href: '/investments/roi',
    available: true,
    icon: '💹',
  },
  {
    title: 'מדריך תכנון פרישה',
    description: 'מיפוי הוצאות, קצבאות וחסכונות לקראת פרישה',
    href: '/investments/retirement',
    available: true,
    icon: '🏖️',
  },
  {
    title: 'מדריך FIRE - פרישה מוקדמת',
    description: 'בדיקת הוצאות, חסכונות וסיכונים לפרישה מוקדמת',
    href: '/investments/fire',
    available: true,
    icon: '🔥',
  },
  {
    title: '📘 מדריך מס רווח הון',
    description: 'בדיקת סוג הכנסה, ניכויים וזכאות אישית',
    href: '/investments/capital-gains-tax',
    available: true,
    icon: '🧾',
  },
];

const faqItems = [
  {
    question: 'כמה מס משלמים על רווחים בבורסה?',
    answer: 'מיסוי השקעות תלוי בסוג הנכס, באופן ההחזקה ובנתונים האישיים. רווח הון ממכירת ניירות ערך עשוי להיות ממוסה בשיעור שונה מריבית או מדיבידנד; גם בעל מניות מהותי וכללי מס יסף דורשים בדיקה נפרדת. בדקו את נתוני הפעולה ואת דוח הניכויים לפני קבלת החלטה.',
  },
  {
    question: 'מה זה ריבית דריבית ולמה היא כל כך משמעותית?',
    answer:
      'ריבית דריבית היא צמיחה שבה תשואה שנצברה משפיעה גם על התקופות הבאות. המחשבון מציג תרחיש לפי שיעורים שהוזנו; הוא אינו מנבא תשואה עתידית.',
  },
  {
    question: 'מהו כלל ה-4% לפרישה מוקדמת (FIRE)?',
    answer:
      'כלל ה-4% הוא דוגמה לשיעור משיכה במחקרי עבר, ולא הבטחה לכך שתיק אישי יממן פרישה מוקדמת. תקופת המשיכה, הרכב התיק, מיסוי, אינפלציה וסדר התשואות משנים את התוצאה. מדריך ה-FIRE מסייע לזהות מה צריך לבדוק לפני קבלת החלטה.',
  },
  {
    question: 'איך אינפלציה משפיעה על החיסכון שלי?',
    answer: 'שינוי המחירים משפיע על כוח הקנייה של סכום עתידי. במחשבון ריבית דריבית אפשר להזין הנחת אינפלציה כדי לראות ערך ריאלי משוער; לשינוי מדד שכבר התרחש משתמשים בנתוני הלמ״ס לפי תאריכים.',
  },
];

export default function InvestmentsPage() {
  return (
    <div className="min-h-screen bg-paper">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Breadcrumbs items={[{ label: 'דף הבית', href: '/' }, { label: 'השקעות' }]} />
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-ink mb-3">
          📈 מחשבוני השקעות וחיסכון
        </h1>
        <p className="text-lg text-ink/70 mb-6">
          מחשבוני תרחישים ומדריכים לבדיקת חיסכון ופרישה
        </p>

        {/* Quick answer */}
        <section className="answer-box bg-cream-2 border-r-4 border-gold p-5 mb-8" aria-label="תשובה מהירה">
          <p className="text-lg text-ink leading-relaxed">
            תרחישי צמיחה תלויים בהפקדות, בתשואה ובמשך ההשקעה. התוצאה בפועל מושפעת
            גם מדמי ניהול, אינפלציה, הפסדים ומיסוי אישי. בדקו את ההנחות במחשבונים
            והשתמשו בדוחות האישיים לתכנון פרישה.
          </p>
        </section>

        <div className="grid md:grid-cols-2 gap-4">
          {calculators.map((calc) =>
            calc.available ? (
              <Link
                key={calc.href}
                href={calc.href}
                className="group bg-paper p-6 border-2 border-ink/15 hover:border-gold hover:shadow-md transition flex items-start gap-4"
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
                className="bg-cream-2 p-6 border-2 border-ink/15 flex items-start gap-4 opacity-60"
              >
                <Calculator className="w-6 h-6 text-ink/70 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h3 className="font-bold text-ink/70 mb-1">{calc.title}</h3>
                  <p className="text-sm text-ink/70">{calc.description}</p>
                  <span className="inline-block mt-2 text-xs bg-ink/10 text-ink/70 px-2 py-1">
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
          <h2 className="text-2xl font-bold text-ink mb-4">איזה מחשבון מתאים לכם?</h2>
          <div className="space-y-4 text-ink/75 leading-relaxed">
            <p>
              נקודת ההתחלה של רוב החוסכים היא{' '}
              <Link href="/investments/compound-interest" className="text-gold underline underline-offset-2 hover:text-ink transition">מחשבון ריבית דריבית</Link>
              : מזינים סכום התחלתי, הפקדה חודשית והנחות תשואה ואינפלציה, ומשווים
              תוצאות מתמטיות אפשריות. מי שכבר ביצע השקעה
              ורוצה למדוד אותה בדיעבד ישתמש ב
              <Link href="/investments/roi" className="text-gold underline underline-offset-2 hover:text-ink transition">מחשבון ה-ROI</Link>
              , שמציג רווח ביחס לעלות ושיעור שנתי שקול. תזרימים במועדים שונים דורשים חישוב נפרד.
            </p>
            <p>
              לתכנון ארוך טווח:{' '}
              <Link href="/investments/retirement" className="text-gold underline underline-offset-2 hover:text-ink transition">מדריך תכנון הפרישה</Link>{' '}
              מסייע למפות הוצאות, קצבאות וחסכונות, ו
              <Link href="/investments/fire" className="text-gold underline underline-offset-2 hover:text-ink transition">מדריך ה-FIRE</Link>{' '}
              מפרט אילו סיכונים לבדוק לפני פרישה מוקדמת. ולפני מכירת ניירות ערך, שווה לעבור על{' '}
              <Link href="/investments/capital-gains-tax" className="text-gold underline underline-offset-2 hover:text-ink transition">מדריך מס רווח הון</Link>{' '}
              — קיזוז הפסדים ותזמון מכירה נכון יכולים לחסוך אלפי שקלים.
            </p>
          </div>
        </section>

        {/* ===== טבלת השוואה: אפיקי חיסכון ===== */}
        <section className="mt-14">
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-gold mb-2">
            ✦ השוואה
          </p>
          <h2 className="text-2xl font-bold text-ink mb-4">אפיקי חיסכון והשקעה — מיסוי ונזילות</h2>
          <div className="overflow-x-auto border border-ink/15">
            <table className="w-full text-sm text-right">
              <thead>
                <tr className="bg-ink text-cream">
                  <th className="px-4 py-3 font-mono text-xs uppercase tracking-[0.1em] font-normal">אפיק</th>
                  <th className="px-4 py-3 font-mono text-xs uppercase tracking-[0.1em] font-normal">מיסוי הרווחים</th>
                  <th className="px-4 py-3 font-mono text-xs uppercase tracking-[0.1em] font-normal">נזילות</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-ink/10 bg-paper">
                  <td className="px-4 py-3 font-semibold text-ink">תיק השקעות ממוסה (בורסה)</td>
                  <td className="px-4 py-3 text-ink/75">
                    תלוי בסוג נייר הערך, בסוג ההכנסה ובמעמד המשקיע; בדקו ניכוי במקור ומס יסף אם רלוונטי
                  </td>
                  <td className="px-4 py-3 text-ink/75">מלאה — מכירה בכל עת</td>
                </tr>
                <tr className="border-t border-ink/10 bg-cream-2">
                  <td className="px-4 py-3 font-semibold text-ink">קרן השתלמות</td>
                  <td className="px-4 py-3 text-ink/75">
                    הטבות מס בתנאים ובתקרות משתנות; בדקו את המוצר ואת ההפקדות שלכם
                  </td>
                  <td className="px-4 py-3 text-ink/75">מועד משיכה כדין תלוי בנסיבות ובוותק</td>
                </tr>
                <tr className="border-t border-ink/10 bg-paper">
                  <td className="px-4 py-3 font-semibold text-ink">חיסכון פנסיוני</td>
                  <td className="px-4 py-3 text-ink/75">
                    הפקדות וקצבה כפופות לכללי מס ולזכאות אישית
                  </td>
                  <td className="px-4 py-3 text-ink/75">תנאי משיכה ומיסוי לפי המוצר והנסיבות</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* ===== FAQ ===== */}
        <section className="mt-14">
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-gold mb-2">
            ✦ שאלות נפוצות
          </p>
          <h2 className="text-2xl font-bold text-ink mb-4">שאלות נפוצות על השקעות וחיסכון</h2>
          <FAQ items={faqItems} />
        </section>

        <p className="mt-10 text-xs text-ink/70 leading-relaxed">
          המידע בדף זה הוא מידע כללי בלבד ואינו מהווה ייעוץ השקעות, ייעוץ מס או המלצה לפעולה
          בניירות ערך. תשואות עבר אינן מבטיחות תשואות עתידיות.
        </p>
      </div>
    </div>
  );
}
