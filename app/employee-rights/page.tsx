import Link from 'next/link';
import { Metadata } from 'next';
import { ArrowLeft, Calculator, BookOpen } from 'lucide-react';
import { Breadcrumbs } from '@/components/calculator/Breadcrumbs';
import { FAQ } from '@/components/calculator/FAQ';
import {
  MINIMUM_WAGE_2026,
  RECREATION_PAY_2026,
} from '@/lib/constants/tax-2026';

export const metadata: Metadata = {
  alternates: { canonical: '/employee-rights' },
  title: { absolute: 'מחשבוני זכויות עובדים 2026 — פיצויים, הבראה, אבטלה ומחלה' },
  description: 'מידע וכלים לבדיקת זכויות עובדים בישראל: פיצויי פיטורים, חופשה, הבראה, אבטלה, מחלה ומילואים, עם הפניות למקורות רשמיים.',
};

const calculators = [
  {
    title: 'בדיקת פיצויי פיטורים',
    description: 'אילו נתונים ומסמכים דרושים לבדיקת הזכאות, סעיף 14 ומיסוי',
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
    title: 'בדיקת דמי לידה',
    description: 'הסבר וקישור למחשבון דמי הלידה הרשמי של הביטוח הלאומי',
    href: '/employee-rights/maternity-benefits',
    available: true,
  },
  {
    title: 'בדיקת דמי אבטלה',
    description: 'תנאי זכאות וקישור לחישוב האישי בביטוח הלאומי',
    href: '/employee-rights/unemployment-benefits',
    available: true,
  },
  {
    title: 'מחשבון תגמולי מילואים',
    description: 'בדיקת תגמול מילואים במחשבון הביטוח הלאומי',
    href: '/employee-rights/reserve-duty-pay',
    available: true,
  },
  {
    title: 'בדיקת חופשה שנתית',
    description: 'השוואת תלוש ופנקס חופשה לזכאות לפי הוותק וימי העבודה בפועל',
    href: '/employee-rights/annual-leave',
    available: true,
  },
  {
    title: 'בדיקת דמי מחלה',
    description: 'שיעורי תשלום, יתרה בתלוש ותנאי היעדרות בשל מחלת בן משפחה',
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
    title: 'מיסוי בונוס שנתי',
    description: 'מה לבדוק בתלוש ובחישוב המס על בונוס',
    href: '/employee-rights/annual-bonus',
    available: true,
  },
  {
    title: 'בדיקת מענק עבודה',
    description: 'תנאי הזכאות וקישור לבדיקת הסכום ברשות המסים',
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
      'הפטור ממס ותקרתו תלויים בנתוני הפרישה וההיסטוריה האישית. המעסיק מדווח על הסכומים בטופס 161; בדקו אותו מול מדריך הפרישה של רשות המסים לפני בחירה במשיכה, פריסה או רצף קצבה.',
  },
  {
    question: 'התפטרתי בעצמי — האם אני זכאי לדמי אבטלה?',
    answer:
      'כן, אבל עם המתנה: מי שהתפטר מרצונו בלי הצדקה מוכרת זכאי לדמי אבטלה רק לאחר 90 ימי המתנה מיום הפסקת העבודה. מי שפוטר, או התפטר בנסיבות המוכרות כמוצדקות (למשל הרעת תנאים מוחשית), זכאי ללא תקופת המתנה זו. בכל מקרה נדרשת תקופת אכשרה של חודשי עבודה שבהם שולמו דמי ביטוח לאומי.',
  },
  {
    question: 'לא ניצלתי ימי חופשה — האם הם נשרפים?',
    answer:
      'חופשה שנתית ניתנת לצבירה מוגבלת בתנאי החוק ובהסכמת המעסיק. עם סיום ההעסקה יש לבדוק את היתרה ואת דמי החופשה לפי מתכונת השכר. השוו את התלוש ופנקס החופשה למידע הרשמי.',
  },
  {
    question: 'מה ההבדל בין דמי הבראה במגזר הפרטי לציבורי?',
    answer:
      'לפי הצו הכללי במגזר הפרטי, תעריף הבסיס הוא 418 ₪ ליום והימים גדלים עם הוותק. במגזר הציבורי ובענפים שונים עשויים לחול הסכמים אחרים; יש לבדוק את ההסכם החל. הזכאות לפי הצו הכללי מתחילה לאחר שנת עבודה.',
  },
];

const comparisonRows = [
  {
    calc: 'פיצויי פיטורין',
    href: '/employee-rights/severance',
    when: 'פוטרתם או סיימתם עבודה אחרי שנה ומעלה',
    input: 'הסכם, תלושים, ותק ויתרת הקרן',
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
    input: 'ותק + ימי עבודה + פנקס חופשה',
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
    input: 'יתרה בתלוש + מועדי היעדרות + הסכם',
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

        {/* Quick answer */}
        <section className="answer-box bg-cream-2 border-r-4 border-gold p-5 mb-8" aria-label="תשובה מהירה">
          <p className="text-lg text-ink leading-relaxed">
            מה מגיע לעובד שכיר בישראל ב-2026? שכר של לפחות{' '}
            {MINIMUM_WAGE_2026.monthly.toLocaleString('he-IL')} ₪ לחודש במשרה מלאה, וכן זכויות
            לפיצויי פיטורים בנסיבות המזכות, לחופשה, לדמי מחלה ולתגמולי מילואים.
            דמי ההבראה במגזר הפרטי מחושבים לפי {RECREATION_PAY_2026.privateSectorPerDay} ₪ ליום
            והוותק. השתמשו בכלים ובמקורות המצורפים כדי לבדוק את הנתונים האישיים.
          </p>
        </section>

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
                <Calculator className="w-6 h-6 text-ink/70 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h3 className="font-bold text-ink/70 mb-1">{calc.title}</h3>
                  <p className="text-sm text-ink/70">{calc.description}</p>
                  <span className="inline-block mt-2 text-xs bg-cream-2 text-ink/70 px-2 py-1">
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
              בסיום עבודה בדקו את הזכאות לפי נסיבות הסיום, השכר הקובע והתקופות שבהן
              הופקדו כספים לרכיב הפיצויים. תחולת סעיף 14 והשלמה מהמעסיק תלויות בהסדר
              ובשיעורי ההפקדה בפועל. להחלטה על משיכה ומיסוי דרושים טופס 161 ונתוני
              הפרישה האישיים.
            </p>
          </div>

          <h2 className="text-xl font-bold text-ink mt-8 mb-3">
            דמי הבראה וחופשה שנתית — הזכויות שנשכחות בתלוש
          </h2>
          <div className="space-y-4 text-ink/75 leading-relaxed">
            <p>
              דמי הבראה משולמים אחת לשנה (בדרך כלל בין יוני לספטמבר) לכל עובד שהשלים שנת
              עבודה. תעריף הבסיס לפי הצו הכללי במגזר הפרטי הוא 418 ₪ ליום; במגזר הציבורי
              ובענפים אחרים יש לבדוק את ההסכם החל. מספר הימים גדל עם הוותק — 5 ימים בשנה הראשונה, ועד 10 ימים למי
              שצבר 20 שנות ותק ומעלה. עובד במשרה חלקית זכאי לדמי הבראה באופן יחסי להיקף
              המשרה.
            </p>
            <p>
              חופשה שנתית היא זכות נפרדת. בדקו את המכסה לפי הוותק, שבוע העבודה והימים
              שעבדתם בפועל, לצד הזכאות בהסכם העבודה. יתרה שלא נוצלה נבחנת בעת סיום
              העבודה לפי פנקס החופשה ובסיס דמי החופשה. כדאי גם לוודא שהשכר עצמו לא נופל משכר המינימום —
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
              חרבות ברזל נקבעו מסלולי מענקים נוספים בתנאים משתנים. בדקו את הזכאות ואת
              התגמול האישי בשירותי הביטוח הלאומי.
            </p>
          </div>
        </section>

        {/* ===== טבלת מספרי מפתח 2026 ===== */}
        <section className="mt-14">
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-gold mb-2">
            ✦ המספרים של 2026
          </p>
          <h2 className="text-2xl font-bold text-ink mb-4">זכויות עובדים 2026 — מספרי המפתח</h2>
          <div className="overflow-x-auto border border-ink/15">
            <table className="w-full text-sm text-right">
              <thead>
                <tr className="bg-ink text-cream">
                  <th className="px-4 py-3 font-mono text-xs uppercase tracking-[0.1em] font-normal">הזכות</th>
                  <th className="px-4 py-3 font-mono text-xs uppercase tracking-[0.1em] font-normal">הנתון ב-2026</th>
                  <th className="px-4 py-3 font-mono text-xs uppercase tracking-[0.1em] font-normal">הערה</th>
                </tr>
              </thead>
              <tbody>
                {/* כל הערכים מיובאים מ-lib/constants/tax-2026.ts */}
                <tr className="border-t border-ink/10 bg-paper">
                  <td className="px-4 py-3 font-semibold">
                    <Link href="/employee-rights/minimum-wage" className="text-ink hover:text-gold transition">שכר מינימום</Link>
                  </td>
                  <td className="px-4 py-3 text-ink/75">
                    {MINIMUM_WAGE_2026.monthly.toLocaleString('he-IL')} ₪ לחודש / {MINIMUM_WAGE_2026.hourly182} ₪ לשעה
                  </td>
                  <td className="px-4 py-3 text-ink/75">בתוקף מ-1.4.2026, משרה של 182 שעות</td>
                </tr>
                <tr className="border-t border-ink/10 bg-cream-2">
                  <td className="px-4 py-3 font-semibold">
                    <Link href="/employee-rights/severance" className="text-ink hover:text-gold transition">פיצויי פיטורין</Link>
                  </td>
                  <td className="px-4 py-3 text-ink/75">לפי זכאות, שכר קובע והפקדות</td>
                  <td className="px-4 py-3 text-ink/75">בדקו סעיף 14 וטופס 161</td>
                </tr>
                <tr className="border-t border-ink/10 bg-paper">
                  <td className="px-4 py-3 font-semibold">
                    <Link href="/employee-rights/recreation-pay" className="text-ink hover:text-gold transition">דמי הבראה</Link>
                  </td>
                  <td className="px-4 py-3 text-ink/75">
                    {RECREATION_PAY_2026.privateSectorPerDay} ₪ ליום לפי הצו הכללי במגזר הפרטי; תעריף אחר לפי הסכם חל
                  </td>
                  <td className="px-4 py-3 text-ink/75">
                    {RECREATION_PAY_2026.daysByYearsOfService[0].days}–{RECREATION_PAY_2026.daysByYearsOfService[5].days} ימים בשנה לפי ותק
                  </td>
                </tr>
                <tr className="border-t border-ink/10 bg-cream-2">
                  <td className="px-4 py-3 font-semibold">
                    <Link href="/employee-rights/annual-leave" className="text-ink hover:text-gold transition">חופשה שנתית</Link>
                  </td>
                  <td className="px-4 py-3 text-ink/75">
                    לפי ותק וימי עבודה בפועל
                  </td>
                  <td className="px-4 py-3 text-ink/75">
                    בדקו יתרה ופדיון לפי פנקס החופשה
                  </td>
                </tr>
              </tbody>
            </table>
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
        <p className="mt-12 text-xs text-ink/70 leading-relaxed border-t border-ink/10 pt-4">
          המידע בעמוד זה הוא מידע כללי בלבד ואינו מהווה ייעוץ משפטי, ייעוץ מס או תחליף
          לייעוץ מקצועי. הזכויות בפועל תלויות בהסכם העבודה, בצווי הרחבה ובנסיבות האישיות.
        </p>
      </div>
    </div>
  );
}
