import Link from 'next/link';
import { Metadata } from 'next';
import { ArrowLeft, Calculator } from 'lucide-react';
import { Breadcrumbs } from '@/components/calculator/Breadcrumbs';
import { FAQ } from '@/components/calculator/FAQ';

export const metadata: Metadata = {
  alternates: { canonical: '/personal-tax' },
  title: 'מחשבוני מס הכנסה 2026 — נטו, החזרי מס ונקודות זיכוי',
  description:
    'מחשבוני מס הכנסה 2026: שכר נטו מברוטו, מדרגות מס, נקודות זיכוי (242 ₪ לנקודה) והחזרי מס לשכירים. כל השיעורים מעודכנים לשנת המס 2026. חשב בחינם עכשיו.',
};

const calculators = [
  {
    title: 'מחשבון שכר נטו ברוטו 2026',
    description: 'חישוב מדויק של שכר נטו מברוטו - מס הכנסה, ביטוח לאומי, ביטוח בריאות ותוספות שכר',
    href: '/personal-tax/salary-net-gross',
    available: true,
  },
  {
    title: 'מחשבון מס הכנסה לשכיר',
    description: 'חישוב מס הכנסה מדויק לפי מדרגות 2026 כולל נקודות זיכוי וב.ל.',
    href: '/personal-tax/income-tax',
    available: true,
  },
  {
    title: 'מחשבון נקודות זיכוי',
    description: 'בדוק כמה נקודות זיכוי מגיעות לך לפי מצב אישי',
    href: '/personal-tax/tax-credits',
    available: true,
  },
  {
    title: 'מחשבון החזר מס',
    description: 'בדוק כמה מס מגיע לך בחזרה - תרומות, פנסיה, פריפריה, ועוד',
    href: '/personal-tax/tax-refund',
    available: true,
  },
  {
    title: 'מחשבון "מה שווה לי לעבוד?"',
    description: 'השוואת שכר vs דמי לידה/אבטלה/קצבה - שווי אמיתי של עבודה',
    href: '/personal-tax/work-value',
    available: true,
  },
];

const calculatorComparison = [
  {
    name: 'שכר נטו ברוטו',
    href: '/personal-tax/salary-net-gross',
    when: 'קיבלת הצעת שכר ורוצה לדעת כמה ייכנס לחשבון בפועל',
    output: 'שכר נטו חודשי מפורט',
  },
  {
    name: 'מס הכנסה לשכיר',
    href: '/personal-tax/income-tax',
    when: 'רוצה להבין כמה מס הכנסה בדיוק יורד לך ולפי אילו מדרגות',
    output: 'פירוט מס לפי מדרגות',
  },
  {
    name: 'נקודות זיכוי',
    href: '/personal-tax/tax-credits',
    when: 'רוצה לבדוק כמה נקודות מגיעות לך — ילדים, תואר, עלייה ועוד',
    output: 'סך נקודות ושוויין בשקלים',
  },
  {
    name: 'החזר מס',
    href: '/personal-tax/tax-refund',
    when: 'החלפת עבודה, עבדת חלק משנה או הפקדת לפנסיה/תרומות',
    output: 'הערכת החזר מס שנתי',
  },
  {
    name: 'מה שווה לי לעבוד?',
    href: '/personal-tax/work-value',
    when: 'מתלבט בין עבודה לקצבה (דמי לידה, אבטלה) ורוצה השוואה',
    output: 'השוואת הכנסה נטו',
  },
];

const faqItems = [
  {
    question: 'כמה שווה נקודת זיכוי ב-2026?',
    answer:
      'נקודת זיכוי אחת שווה 242 ₪ בחודש, שהם 2,904 ₪ בשנה. הנקודות מופחתות ישירות מהמס שחושב לכם — לא מההכנסה. כל תושב ישראל מקבל 2.25 נקודות בסיס, ואישה מקבלת חצי נקודה נוספת.',
  },
  {
    question: 'מהי מדרגת המס הראשונה ב-2026?',
    answer:
      'המדרגה הראשונה היא 10% על הכנסה מיגיעה אישית עד 7,010 ₪ בחודש (84,120 ₪ בשנה). מעליה: 14% עד 10,060 ₪, ו-20% עד 19,000 ₪ בחודש. חשוב לזכור שהמס מדורג — רק החלק שבתוך כל מדרגה ממוסה בשיעור שלה.',
  },
  {
    question: 'מתי מגיע לי החזר מס?',
    answer:
      'החזר מס נפוץ כשעבדתם רק חלק מהשנה, החלפתם מעסיק בלי תיאום מס, תרמתם למוסד מוכר, הפקדתם באופן עצמאי לפנסיה, או שלא נוצלו נקודות זיכוי (למשל על ילדים או תואר). ניתן לדרוש החזר עד שש שנים אחורה.',
  },
  {
    question: 'למה הנטו שלי נמוך מהברוטו בתלוש?',
    answer:
      'מהברוטו יורדים שלושה ניכויי חובה: מס הכנסה לפי המדרגות, דמי ביטוח לאומי ודמי ביטוח בריאות (יחד 4.27% על חלק השכר עד 7,703 ₪ בחודש, ו-12.17% מעליו). בנוסף יורדות הפרשות העובד לפנסיה ולעיתים לקרן השתלמות.',
  },
  {
    question: 'מהו מס יסף ומי משלם אותו?',
    answer:
      'מס יסף הוא תוספת של 3% על הכנסה שנתית מעל 721,560 ₪ (כ-60,130 ₪ בחודש). מי שמרוויח מעל הסף משלם בפועל מס שולי של 50% על החלק שמעליו — 47% מדרגה עליונה ועוד 3% מס יסף.',
  },
];

export default function PersonalTaxPage() {
  return (
    <div className="min-h-screen bg-paper">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Breadcrumbs items={[{ label: 'דף הבית', href: '/' }, { label: 'מיסוי אישי' }]} />
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-ink mb-3">
          מחשבוני מס הכנסה 2026 — נטו, החזרי מס ונקודות זיכוי
        </h1>
        <p className="text-lg text-ink/70 mb-6">
          כל המחשבונים לחישוב מס הכנסה לשכיר לפי מדרגות 2026: שכר נטו מברוטו, נקודות זיכוי,
          החזרי מס והשוואת שכר לקצבאות — לפי החקיקה העדכנית
        </p>

        {/* Banner to /salaried */}
        <Link
          href="/salaried"
          className="block bg-cream-2 border-2 border-ink/15 rounded-none p-4 mb-8 hover:shadow-md transition group"
        >
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="font-semibold text-ink mb-1">
                🆕 מרכז שכירים — כל הכלים לעובד במקום אחד
              </div>
              <div className="text-sm text-ink/70">
                החזר מס + נטו/ברוטו + פיצויי פיטורין + דמי הבראה + 11 כלים נוספים
              </div>
            </div>
            <ArrowLeft className="w-5 h-5 text-gold group-hover:-translate-x-1 transition flex-shrink-0" />
          </div>
        </Link>

        <div className="grid md:grid-cols-2 gap-4">
          {calculators.map((calc) =>
            calc.available ? (
              <Link
                key={calc.href}
                href={calc.href}
                className="group bg-paper p-6 rounded-none border-2 border-ink/15 hover:border-gold hover:shadow-md transition flex items-start gap-4"
              >
                <Calculator className="w-6 h-6 text-gold flex-shrink-0 mt-1" />
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
                <Calculator className="w-6 h-6 text-ink/45 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h3 className="font-bold text-ink/70 mb-1">{calc.title}</h3>
                  <p className="text-sm text-ink/60">{calc.description}</p>
                  <span className="inline-block mt-2 text-xs bg-ink/10 text-ink/60 px-2 py-1 rounded-none">
                    בקרוב
                  </span>
                </div>
              </div>
            )
          )}
        </div>

        {/* ===== איזה מחשבון מתאים לי? ===== */}
        <section className="mt-14">
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-gold mb-2">
            ✦ מדריך מהיר
          </p>
          <h2 className="text-2xl font-bold text-ink mb-4">איזה מחשבון מתאים לי?</h2>
          <div className="overflow-x-auto border border-ink/15">
            <table className="w-full text-sm text-right">
              <thead>
                <tr className="bg-ink text-cream">
                  <th className="px-4 py-3 font-semibold">מחשבון</th>
                  <th className="px-4 py-3 font-semibold">מתי להשתמש</th>
                  <th className="px-4 py-3 font-semibold">מה מקבלים</th>
                </tr>
              </thead>
              <tbody>
                {calculatorComparison.map((row, idx) => (
                  <tr key={row.href} className={idx % 2 === 0 ? 'bg-paper' : 'bg-cream-2'}>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <Link href={row.href} className="font-semibold text-ink hover:text-gold transition">
                        {row.name}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-ink/75">{row.when}</td>
                    <td className="px-4 py-3 text-ink/75">{row.output}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ===== תוכן אדיטוריאלי ===== */}
        <section className="mt-14 space-y-10">
          <div className="text-center text-gold">✦</div>

          <div>
            <h2 className="text-2xl font-bold text-ink mb-3">מדרגות מס הכנסה 2026</h2>
            <div className="space-y-3 text-ink/75 leading-relaxed">
              <p>
                מס הכנסה בישראל הוא מס פרוגרסיבי: ההכנסה מחולקת למדרגות, וכל מדרגה ממוסה
                בשיעור משלה. ב-2026 המדרגה הראשונה היא 10% על הכנסה חודשית מיגיעה אישית עד
                7,010 ₪, המדרגה השנייה 14% עד 10,060 ₪, והשלישית 20% עד 19,000 ₪ בחודש. מעל
                לכך: 31% עד 25,100 ₪, 35% עד 46,690 ₪, ו-47% עד 60,130 ₪. על החלק שמעל
                60,130 ₪ בחודש (721,560 ₪ בשנה) מתווסף מס יסף של 3%, כך שהשיעור השולי המרבי
                מגיע ל-50%.
              </p>
              <p>
                חשוב להבין: מי שמרוויח 12,000 ₪ בחודש לא משלם 20% על כל השכר — אלא 10% על
                החלק הראשון, 14% על החלק שבמדרגה השנייה, ו-20% רק על החלק שמעל 10,060 ₪.
                בשנת 2026 הורחבו מדרגות ה-20% וה-31%, מה שמקטין את המס למרוויחים בטווחי
                הביניים לעומת המבנה הקודם.
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-ink mb-3">נקודות זיכוי — ההנחה הכי חשובה בתלוש</h2>
            <div className="space-y-3 text-ink/75 leading-relaxed">
              <p>
                נקודות זיכוי הן הקלה שמופחתת ישירות מהמס עצמו, לא מההכנסה. ב-2026 כל נקודה
                שווה 242 ₪ בחודש (2,904 ₪ בשנה). כל תושב ישראל זכאי ל-2.25 נקודות בסיס, ואישה
                מקבלת חצי נקודה נוספת. מעבר לכך יש נקודות על ילדים (לפי גיל הילד), על תואר
                אקדמי, לחיילים משוחררים, לעולים חדשים ולהורים יחידים.
              </p>
              <p>
                המשמעות המעשית: עובד עם הכנסה נמוכה עשוי לא לשלם מס הכנסה כלל, כי סכום
                הזיכוי מכסה את כל המס שחושב לו. מנגד, מי שלא דיווח למעסיק על נקודות שמגיעות
                לו — למשל אחרי לידה או סיום תואר — משלם מס עודף, וזו אחת הסיבות הנפוצות
                ביותר להחזרי מס.
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-ink mb-3">החזרי מס — למה שכירים משלמים יותר מדי</h2>
            <div className="space-y-3 text-ink/75 leading-relaxed">
              <p>
                מס הכנסה מנוכה מהתלוש לפי הנחה שהשכר החודשי יימשך כל השנה. כשהמציאות שונה —
                עבדתם רק חלק מהשנה, החלפתם מעסיק, עבדתם בשתי עבודות בלי תיאום מס — הניכוי
                בפועל גבוה מהמס האמיתי, וההפרש מגיע לכם בחזרה. גם תרומות למוסדות מוכרים,
                הפקדות עצמאיות לפנסיה ונקודות זיכוי שלא נוצלו מזכים בהחזר.
              </p>
              <p>
                את הבקשה מגישים לרשות המסים באופן עצמאי, וניתן לדרוש החזרים עד שש שנים
                אחורה. לפני שמתחילים בבירוקרטיה, שווה להריץ את המספרים במחשבון החזר המס
                ולראות אם יש בכלל על מה לדבר.
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-ink mb-3">ההבדל בין ברוטו לנטו</h2>
            <div className="space-y-3 text-ink/75 leading-relaxed">
              <p>
                השכר הברוטו הוא הסכום שסוכם בחוזה; הנטו הוא מה שנכנס לחשבון הבנק. בין השניים
                עומדים שלושה ניכויי חובה: מס הכנסה לפי המדרגות (בקיזוז נקודות הזיכוי), דמי
                ביטוח לאומי ודמי ביטוח בריאות. על חלק השכר עד 7,703 ₪ בחודש שיעור הביטוח
                הלאומי והבריאות המשולב הוא 4.27%, ועל החלק שמעליו — 12.17%, עד תקרת הכנסה
                חייבת של 51,910 ₪ בחודש.
              </p>
              <p>
                בנוסף לניכויי החובה יורדות מהתלוש הפרשות העובד לפנסיה, ולעיתים גם לקרן
                השתלמות ולביטוחים נוספים — כך שהפער בין ברוטו לנטו משתנה מעובד לעובד גם
                באותה רמת שכר. מחשבון שכר נטו ברוטו עושה את כל החישוב הזה בבת אחת.
              </p>
            </div>
          </div>
        </section>

        {/* ===== FAQ ===== */}
        <section className="mt-14">
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-gold mb-2">
            ✦ שאלות נפוצות
          </p>
          <h2 className="text-2xl font-bold text-ink mb-4">שאלות ותשובות על מס הכנסה 2026</h2>
          <FAQ items={faqItems} />
        </section>

        {/* ===== קריאה נוספת ===== */}
        <section className="mt-14 bg-cream-2 border border-ink/15 p-6 md:p-8">
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-gold mb-2">
            ✦ קריאה נוספת
          </p>
          <h2 className="text-2xl font-bold text-ink mb-4">מדריכים ומונחים שיעזרו לכם</h2>
          <ul className="space-y-3">
            <li>
              <Link href="/blog/tax-refund-complete-guide-2026" className="text-ink font-semibold hover:text-gold transition">
                המדריך המלא להחזרי מס 2026 ←
              </Link>
              <span className="block text-sm text-ink/60">מי זכאי, איך מגישים וכמה אפשר לקבל בחזרה</span>
            </li>
            <li>
              <Link href="/blog/salary-net-2026-complete-guide" className="text-ink font-semibold hover:text-gold transition">
                המדריך המלא לשכר נטו 2026 ←
              </Link>
              <span className="block text-sm text-ink/60">כל מה שיורד מהתלוש — ואיך לקרוא אותו נכון</span>
            </li>
            <li>
              <Link href="/blog/income-tax-brackets-2026-complete-guide" className="text-ink font-semibold hover:text-gold transition">
                מדרגות מס הכנסה 2026 — המדריך המלא ←
              </Link>
              <span className="block text-sm text-ink/60">כל המדרגות, השינויים והשלכותיהם על השכר שלכם</span>
            </li>
            <li>
              <Link href="/glossary/tax-credit-points" className="text-ink font-semibold hover:text-gold transition">
                מילון מונחים: נקודות זיכוי ←
              </Link>
              <span className="block text-sm text-ink/60">הגדרה קצרה וברורה של המונח החשוב בתלוש</span>
            </li>
            <li>
              <Link href="/glossary/tax-brackets" className="text-ink font-semibold hover:text-gold transition">
                מילון מונחים: מדרגות מס ←
              </Link>
              <span className="block text-sm text-ink/60">איך עובד מס פרוגרסיבי — בשפה פשוטה</span>
            </li>
          </ul>
        </section>

        <p className="mt-10 text-xs text-ink/50 leading-relaxed">
          המידע בדף זה הוא מידע כללי בלבד ואינו מהווה ייעוץ מס, ייעוץ משפטי או תחליף לייעוץ
          מקצועי המותאם לנסיבות האישיות שלכם.
        </p>
      </div>
    </div>
  );
}
