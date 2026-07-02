import Link from 'next/link';
import { Metadata } from 'next';
import { ArrowLeft, Calculator, BookOpen } from 'lucide-react';
import { Breadcrumbs } from '@/components/calculator/Breadcrumbs';
import { FAQ } from '@/components/calculator/FAQ';

export const metadata: Metadata = {
  alternates: { canonical: '/employee-rights' },
  title: 'מחשבוני זכויות עובדים 2026 — פיצויים, הבראה, אבטלה ומחלה',
  description: 'מחשבונים לזכויות עובדים שכירים בישראל 2026: פיצויי פיטורין, דמי הבראה, חופשה שנתית, דמי לידה, דמי אבטלה, מחלה ומילואים. בדוק כמה מגיע לך עכשיו.',
};

const calculators = [
  {
    title: 'מחשבון פיצויי פיטורין',
    description: 'חישוב פיצויי פיטורין מדויק לפי חוק פיצויי פיטורים',
    href: '/employee-rights/severance',
    available: true,
  },
  {
    title: '🆕 מחשבון ניכויים ממשכורת',
    description: 'מה מנכים מהברוטו ולמה — מס הכנסה, ביטוח לאומי, בריאות ופנסיה, שורה-שורה',
    href: '/employee-rights/salary-deductions',
    available: true,
  },
  {
    title: 'מחשבון דמי הבראה',
    description: 'חישוב דמי הבראה לפי שנות ותק (תעריף 2026)',
    href: '/employee-rights/recreation-pay',
    available: true,
  },
  {
    title: 'מחשבון דמי לידה',
    description: 'חישוב גובה דמי לידה מהביטוח הלאומי + הארכות לתאומים',
    href: '/employee-rights/maternity-benefits',
    available: true,
  },
  {
    title: 'מחשבון דמי אבטלה',
    description: 'חישוב גובה דמי אבטלה ותקופת הזכאות לפי גיל ושכר',
    href: '/employee-rights/unemployment-benefits',
    available: true,
  },
  {
    title: 'מחשבון תגמולי מילואים',
    description: 'תשלום בסיסי + מענקי חרבות ברזל (280 ₪/יום)',
    href: '/employee-rights/reserve-duty-pay',
    available: true,
  },
  {
    title: 'מחשבון חופשה שנתית',
    description: 'חישוב ימי חופשה, פדיון חופשה וצבירה לפי שנות ותק',
    href: '/employee-rights/annual-leave',
    available: true,
  },
  {
    title: 'מחשבון דמי מחלה',
    description: 'חישוב דמי מחלה, ימים צבורים ומחלת בן משפחה',
    href: '/employee-rights/sick-pay',
    available: true,
  },
  {
    title: 'מחשבון שכר מינימום',
    description: 'בדיקת עמידה בשכר מינימום 2026: 6,443.85 ₪/חודש',
    href: '/employee-rights/minimum-wage',
    available: true,
  },
  {
    title: 'מחשבון בונוס שנתי',
    description: 'חישוב גובה הבונוס ומיסוי תשלום שנתי חד-פעמי',
    href: '/employee-rights/annual-bonus',
    available: true,
  },
  {
    title: 'מחשבון מענק עבודה',
    description: 'חישוב מענק עבודה (מס הכנסה שלילי) לשכירים',
    href: '/employee-rights/work-grant',
    available: true,
  },
];

const faqItems = [
  {
    question: 'פיטרו אותי אחרי 8 חודשים — מגיעים לי פיצויי פיטורין?',
    answer:
      'הזכאות החוקית לפיצויי פיטורין מתחילה לאחר שנת עבודה אחת לפחות אצל אותו מעסיק. עם זאת, אם המעסיק הפריש לאורך התקופה לרכיב פיצויים בקרן הפנסיה (סעיף 14), הכספים שנצברו שם שייכים לך גם אם עבדת פחות משנה. כדאי לבדוק בדוח הפנסיה השנתי מה נצבר ברכיב הפיצויים.',
  },
  {
    question: 'האם פיצויי פיטורין חייבים במס?',
    answer:
      'חלק מהפיצויים פטור ממס: הפטור הוא עד תקרה של 13,750 ₪ לכל שנת עבודה (נכון ל-2026), ובאישור פקיד שומה ניתן להגדיל את הפטור עד פי 1.5 מהשכר החודשי לכל שנת ותק — עד אותה תקרה. כל סכום מעבר לפטור מצטרף להכנסה החייבת. מחשבון פיצויי הפיטורין שלנו מחשב גם את רכיב המס.',
  },
  {
    question: 'התפטרתי בעצמי — האם אני זכאי לדמי אבטלה?',
    answer:
      'כן, אבל עם המתנה: מי שהתפטר מרצונו בלי הצדקה מוכרת זכאי לדמי אבטלה רק לאחר 90 ימי המתנה מיום הפסקת העבודה. מי שפוטר, או התפטר בנסיבות המוכרות כמוצדקות (למשל הרעת תנאים מוחשית), זכאי ללא תקופת המתנה זו. בכל מקרה נדרשת תקופת אכשרה של חודשי עבודה שבהם שולמו דמי ביטוח לאומי.',
  },
  {
    question: 'לא ניצלתי ימי חופשה — האם הם נשרפים?',
    answer:
      'חופשה שנתית ניתנת לצבירה מוגבלת בהסכמת המעסיק, אך החוק לא מאפשר צבירה בלתי מוגבלת לאורך שנים. בסיום העסקה, ימי חופשה שנצברו ולא נוצלו נפדים בכסף (פדיון חופשה) לפי ערך יום עבודה. אם אתם מתקרבים לסיום העסקה — בדקו במחשבון החופשה השנתית כמה ימים עומדים לזכותכם.',
  },
  {
    question: 'מה ההבדל בין דמי הבראה במגזר הפרטי לציבורי?',
    answer:
      'התעריף ליום הבראה שונה: במגזר הפרטי 418 ₪ ליום, ובמגזר הציבורי 471.40 ₪ ליום (2026). מספר הימים נקבע לפי ותק — מ-5 ימים בשנה הראשונה ועד 10 ימים למי שצבר 20 שנות ותק ומעלה. הזכאות לדמי הבראה מתחילה לאחר השלמת שנת עבודה ראשונה.',
  },
];

const comparisonRows = [
  {
    calc: 'פיצויי פיטורין',
    href: '/employee-rights/severance',
    when: 'פוטרתם או סיימתם עבודה אחרי שנה ומעלה',
    input: 'שכר אחרון + שנות ותק',
  },
  {
    calc: 'דמי הבראה',
    href: '/employee-rights/recreation-pay',
    when: 'בדיקת התשלום השנתי (בדרך כלל בקיץ)',
    input: 'ותק + מגזר (פרטי/ציבורי)',
  },
  {
    calc: 'חופשה שנתית',
    href: '/employee-rights/annual-leave',
    when: 'כמה ימי חופשה מגיעים לכם או פדיון בסיום עבודה',
    input: 'ותק + היקף משרה',
  },
  {
    calc: 'דמי אבטלה',
    href: '/employee-rights/unemployment-benefits',
    when: 'פוטרתם או התפטרתם ונרשמתם בלשכת התעסוקה',
    input: 'גיל + שכר אחרון',
  },
  {
    calc: 'דמי מחלה',
    href: '/employee-rights/sick-pay',
    when: 'היעדרות עקב מחלה שלכם או של בן משפחה',
    input: 'ימי מחלה צבורים + שכר',
  },
  {
    calc: 'תגמולי מילואים',
    href: '/employee-rights/reserve-duty-pay',
    when: 'שירתם במילואים — שכיר, עצמאי או סטודנט',
    input: 'ימי שירות + הכנסה',
  },
];

const furtherReading = [
  {
    href: '/guides/employee-rights-complete-guide',
    title: 'המדריך המלא לזכויות עובדים',
    description: 'כל הזכויות של עובד שכיר בישראל במקום אחד — מהיום הראשון ועד סיום העסקה',
  },
  {
    href: '/blog/severance-pay-complete-guide',
    title: 'פיצויי פיטורין — המדריך המלא',
    description: 'חישוב, פטור ממס, סעיף 14 ומה לעשות כשמסיימים עבודה',
  },
  {
    href: '/blog/employee-rights-israel-2026',
    title: 'זכויות עובדים בישראל 2026',
    description: 'מה השתנה השנה — שכר מינימום, הבראה, חופשה ומחלה',
  },
  {
    href: '/blog/recreation-pay-2026',
    title: 'דמי הבראה 2026',
    description: 'תעריפים מעודכנים, טבלת ימי זכאות לפי ותק ומתי משולם',
  },
];

export default function EmployeeRightsPage() {
  return (
    <div className="min-h-screen bg-paper">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Breadcrumbs
            items={[{ label: 'דף הבית', href: '/' }, { label: 'זכויות עובדים' }]}
          />
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-ink mb-3">
          מחשבוני זכויות עובדים 2026 — פיצויים, הבראה, אבטלה ומחלה
        </h1>
        <p className="text-lg text-ink/70 mb-6">
          מחשבונים מקצועיים לבדיקת הזכויות שמגיעות לך כעובד שכיר בישראל
        </p>

        {/* Banner to /salaried */}
        <Link
          href="/salaried"
          className="block bg-cream-2 border-2 border-ink/15 p-4 mb-8 hover:shadow-md transition group"
        >
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="font-semibold text-ink mb-1">
                🆕 מרכז שכירים — כולל גם החזר מס ונטו/ברוטו
              </div>
              <div className="text-sm text-ink/70">
                כל הכלים לעובד שכיר במקום אחד: זכויות + מיסים + השוואות (16 כלים)
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
                className="group bg-paper p-6 border-2 border-ink/15 hover:border-gold hover:shadow-md transition flex items-start gap-4"
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
                className="bg-cream-2 p-6 border-2 border-ink/15 flex items-start gap-4 opacity-60"
              >
                <Calculator className="w-6 h-6 text-ink/45 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h3 className="font-bold text-ink/70 mb-1">{calc.title}</h3>
                  <p className="text-sm text-ink/60">{calc.description}</p>
                  <span className="inline-block mt-2 text-xs bg-cream-2 text-ink/60 px-2 py-1">
                    בקרוב
                  </span>
                </div>
              </div>
            )
          )}
        </div>

        {/* ===== Editorial: מדריך זכויות עובדים ===== */}
        <section className="mt-14">
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-gold mb-2">
            ✦ מדריך מקוצר
          </p>
          <h2 className="text-2xl font-bold text-ink mb-4">
            הזכויות שכל עובד שכיר בישראל חייב להכיר
          </h2>
          <div className="space-y-4 text-ink/75 leading-relaxed">
            <p>
              רוב העובדים בישראל לא יודעים בדיוק מה מגיע להם — וזה בדיוק המקום שבו כסף
              נשאר על השולחן. זכויות עובדים אינן הטבה שהמעסיק נותן מרצונו הטוב: הן קבועות
              בחוקי עבודה ובצווי הרחבה, והן חלות על כל עובד שכיר, כולל עובדים במשרה חלקית,
              עובדים שעתיים ועובדים דרך חברות כוח אדם. בעמוד הזה ריכזנו את המחשבונים
              שיעזרו לכם לבדוק בדקות ספורות אם אתם מקבלים את מה שמגיע לכם.
            </p>
          </div>

          <h2 className="text-xl font-bold text-ink mt-8 mb-3">
            פיצויי פיטורין — הזכות הגדולה ביותר בסיום עבודה
          </h2>
          <div className="space-y-4 text-ink/75 leading-relaxed">
            <p>
              עובד שפוטר לאחר שנת עבודה אחת לפחות אצל אותו מעסיק זכאי לפיצויי פיטורין —
              משכורת חודשית אחת (לפי השכר האחרון) לכל שנת עבודה. עבור עובד עם ותק של
              כמה שנים מדובר לרוב בעשרות אלפי שקלים, ולכן חשוב לחשב נכון. חלק מהסכום פטור
              ממס הכנסה: תקרת הפטור עומדת על 13,750 ₪ לכל שנת עבודה (2026), ובאישור מס
              הכנסה ניתן להגדיל את הפטור עד 1.5 משכורות לשנת ותק, עד אותה תקרה. שימו לב
              גם ל&quot;סעיף 14&quot; — הסדר שבו ההפרשה החודשית לפנסיה באה במקום פיצויים,
              והכספים שייכים לעובד גם בהתפטרות.
            </p>
          </div>

          <h2 className="text-xl font-bold text-ink mt-8 mb-3">
            דמי הבראה וחופשה שנתית — הזכויות שנשכחות בתלוש
          </h2>
          <div className="space-y-4 text-ink/75 leading-relaxed">
            <p>
              דמי הבראה משולמים אחת לשנה (בדרך כלל בין יוני לספטמבר) לכל עובד שהשלים שנת
              עבודה. התעריף ב-2026: 418 ₪ ליום במגזר הפרטי ו-471.40 ₪ ליום במגזר
              הציבורי. מספר הימים גדל עם הוותק — 5 ימים בשנה הראשונה, ועד 10 ימים למי
              שצבר 20 שנות ותק ומעלה. עובד במשרה חלקית זכאי לדמי הבראה באופן יחסי להיקף
              המשרה.
            </p>
            <p>
              חופשה שנתית היא זכות נפרדת: החוק מקנה בשנים הראשונות 16 ימי חופשה
              קלנדריים בשנה (14 ימי חופשה נטו, ללא ימי המנוחה השבועית), ומהשנה השישית
              ואילך מתווסף יום לכל שנת ותק — עד מקסימום של 28 ימים. ימי חופשה שלא נוצלו
              עד סיום ההעסקה נפדים בכסף. כדאי גם לוודא שהשכר עצמו לא נופל משכר המינימום —
              6,443.85 ₪ לחודש (35.40 ₪ לשעה במשרה של 182 שעות), בתוקף מ-1.4.2026.
            </p>
          </div>

          <h2 className="text-xl font-bold text-ink mt-8 mb-3">
            אבטלה ומילואים — כשהביטוח הלאומי נכנס לתמונה
          </h2>
          <div className="space-y-4 text-ink/75 leading-relaxed">
            <p>
              דמי אבטלה משולמים על ידי הביטוח הלאומי למי שפוטר או סיים עבודה, צבר תקופת
              אכשרה מספקת ונרשם בלשכת התעסוקה. גובה הקצבה נגזר מהשכר בחודשים שקדמו
              לאבטלה, ומספר ימי הזכאות תלוי בגיל ובמצב המשפחתי — ולכן שני עובדים עם אותו
              שכר יכולים לקבל סכומים שונים לגמרי. מי שהתפטר מרצונו ללא הצדקה מוכרת ימתין
              90 יום לפני תחילת התשלום.
            </p>
            <p>
              משרתי מילואים זכאים לתגמול מהביטוח הלאומי המחושב לפי ההכנסה לפני השירות —
              שכירים מקבלים אותו דרך המעסיק, ועצמאים ישירות מהביטוח הלאומי. במסגרת מלחמת
              חרבות ברזל נוספו מענקים ייעודיים, ובהם מענק של 280 ₪ ליום שירות. מחשבון
              תגמולי המילואים שלנו מחשב את התשלום הבסיסי יחד עם המענקים.
            </p>
          </div>
        </section>

        {/* ===== טבלת השוואה: איזה מחשבון מתאים לי ===== */}
        <section className="mt-14">
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-gold mb-2">
            ✦ ניווט מהיר
          </p>
          <h2 className="text-2xl font-bold text-ink mb-4">איזה מחשבון מתאים למצב שלי?</h2>
          <div className="overflow-x-auto border border-ink/15">
            <table className="w-full text-sm text-right">
              <thead>
                <tr className="bg-ink text-cream">
                  <th className="px-4 py-3 font-mono text-xs uppercase tracking-[0.1em] font-normal">
                    מחשבון
                  </th>
                  <th className="px-4 py-3 font-mono text-xs uppercase tracking-[0.1em] font-normal">
                    מתי משתמשים
                  </th>
                  <th className="px-4 py-3 font-mono text-xs uppercase tracking-[0.1em] font-normal">
                    מה צריך להזין
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row, idx) => (
                  <tr
                    key={row.href}
                    className={`border-t border-ink/10 ${idx % 2 === 1 ? 'bg-cream-2' : 'bg-paper'}`}
                  >
                    <td className="px-4 py-3 font-semibold">
                      <Link href={row.href} className="text-ink hover:text-gold transition">
                        {row.calc}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-ink/70">{row.when}</td>
                    <td className="px-4 py-3 text-ink/70">{row.input}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ===== FAQ ===== */}
        <section className="mt-14">
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-gold mb-2">
            ✦ שאלות נפוצות
          </p>
          <h2 className="text-2xl font-bold text-ink mb-4">
            שאלות שגולשים שואלים על זכויות עובדים
          </h2>
          <FAQ items={faqItems} />
        </section>

        {/* ===== קריאה נוספת ===== */}
        <section className="mt-14">
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-gold mb-2">
            ✦ להעמקה
          </p>
          <h2 className="text-2xl font-bold text-ink mb-4">קריאה נוספת</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {furtherReading.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group bg-cream-2 border border-ink/15 hover:border-gold transition p-5 flex items-start gap-3"
              >
                <BookOpen className="w-5 h-5 text-gold flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-ink mb-1 group-hover:text-gold transition">
                    {item.title}
                  </h3>
                  <p className="text-sm text-ink/70">{item.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Disclaimer */}
        <p className="mt-12 text-xs text-ink/50 leading-relaxed border-t border-ink/10 pt-4">
          המידע בעמוד זה הוא מידע כללי בלבד ואינו מהווה ייעוץ משפטי, ייעוץ מס או תחליף
          לייעוץ מקצועי. הזכויות בפועל תלויות בהסכם העבודה, בצווי הרחבה ובנסיבות האישיות.
        </p>
      </div>
    </div>
  );
}
