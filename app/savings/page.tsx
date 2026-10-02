import Link from 'next/link';
import { Metadata } from 'next';
import { ArrowLeft } from 'lucide-react';
import { Breadcrumbs } from '@/components/calculator/Breadcrumbs';
import { FAQ } from '@/components/calculator/FAQ';
import { MACRO_DATA } from '@/lib/data/macroeconomic-data';

export const metadata: Metadata = {
  alternates: { canonical: '/savings' },
  title: 'חיסכון ותקציב משפחתי — מחשבון ומדריכים',
  description:
    'כלים לניהול כספים משפחתי: תקציב לפי כלל 50/30/20, חישוב החזר הלוואה ומדריך להשוואת הצעות להלוואה אישית.',
};

const calculators = [
  {
    title: 'תקציב משפחתי',
    description: 'מדריך למיפוי הכנסות והוצאות ולבדיקת כלל 50/30/20',
    href: '/savings/family-budget',
    available: true,
    icon: '👨‍👩‍👧',
  },
  {
    title: 'מחשבון החזרי הלוואה',
    description: 'חישוב תשלום חודשי וסך ריבית להלוואה קבועה לא צמודה',
    href: '/savings/loan-repayment',
    available: true,
    icon: '💳',
  },
  {
    title: 'מדריך להשוואת הלוואה אישית',
    description: 'השוו ריבית, עמלות, עלות כוללת ותנאי החזר בין הצעות אישיות',
    href: '/savings/personal-loan',
    available: true,
    icon: '🏦',
  },
];

const faqItems = [
  {
    question: 'מהו כלל 50/30/20 לניהול תקציב משפחתי?',
    answer:
      'כלל 50/30/20 מחלק את ההכנסה נטו לשלושה חלקים: 50% לצרכים חיוניים, 30% לרצונות ו-20% לחיסכון או להקטנת חובות. זו נקודת פתיחה בלבד; מדריך התקציב מסביר איך לרכז את הנתונים בלי ספירה כפולה.',
  },
  {
    question: 'מה זה ריבית פריים ולמה היא חשובה להלוואה שלי?',
    answer:
      `ריבית הפריים היא בדרך כלל ריבית בנק ישראל בתוספת 1.5 נקודות אחוז. בבדיקה מ־${MACRO_DATA.primeRate.lastUpdated} ריבית בנק ישראל עמדה על ${MACRO_DATA.primeRate.boiBaseRate}% והפריים על ${MACRO_DATA.primeRate.value}%. רק הלוואה שריביתה נקבעת לפי פריים תושפע ישירות משינוי בו; יש לבדוק את תנאי ההסכם.`,
  },
  {
    question: 'האם סילוק מוקדם של הלוואה באמת חוסך כסף?',
    answer:
      'הקטנת יתרת הקרן עשויה להפחית ריבית עתידית. גובה החיסכון תלוי במועד התשלום, בתנאי הריבית ובעמלות פירעון מוקדם. בקשו מהמלווה לוח תשלומים מעודכן לפני החלטה.',
  },
  {
    question: 'מה ההבדל בין שיטת Snowball לשיטת Avalanche להחזר חובות?',
    answer:
      'בשיטת Avalanche מפנים תשלום נוסף תחילה לחוב היקר ביותר, ובשיטת Snowball לחוב הקטן ביותר. התוצאה בפועל תלויה בתנאי החובות, בעמלות ובהתמדה בתשלומים.',
  },
  {
    question: 'כמה קצבת ילדים מקבלים מביטוח לאומי ב-2026?',
    answer:
      'סכומי הבסיס לפי הביטוח הלאומי מ־1.1.2026: 173 ₪ לילד הראשון, 219 ₪ לכל אחד מהילדים השני עד הרביעי, ו־173 ₪ לילד חמישי ואילך. הסכום האישי עשוי להשתנות לפי נסיבות המשפחה; בדקו באתר הביטוח הלאומי.',
  },
];

export default function SavingsPage() {
  return (
    <div className="min-h-screen bg-paper">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Breadcrumbs items={[{ label: 'דף הבית', href: '/' }, { label: 'חיסכון וחובות' }]} />
        </div>

        <p className="font-mono text-xs uppercase tracking-[0.14em] text-gold mb-3">
          {'// מרכז חיסכון ותקציב ✦'}
        </p>
        <h1 className="text-3xl md:text-4xl font-bold text-ink mb-3">
          חיסכון ותקציב משפחתי
        </h1>
        <p className="text-lg text-ink/70 mb-12">
          ניהול תקציב משפחתי, חישוב החזרי הלוואה ותכנון חיסכון — הכל במקום אחד, חינם
        </p>

        <div className="grid md:grid-cols-2 gap-4">
          {calculators.map((calc) => (
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
          ))}
        </div>

        {/* בלוק אדיטוריאלי */}
        <section className="mt-14 max-w-3xl">
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-gold mb-2">
            ✦ מדריך קצר
          </p>

          <h2 className="text-2xl font-bold text-ink mb-4">
            תקציב משפחתי — הבסיס לכל החלטה כספית
          </h2>
          <div className="space-y-4 text-ink/75 leading-relaxed">
            <p>
              רוב המשפחות בישראל יודעות בערך כמה נכנס בכל חודש — אבל הרבה פחות יודעות
              לאן הכסף יוצא. תקציב משפחתי הוא לא טבלת אקסל מענישה; הוא פשוט תמונת מצב:
              כמה נכנס, כמה יוצא, ומה נשאר. נקודת פתיחה נפוצה היא כלל 50/30/20 — כמחצית
              מההכנסה נטו לצרכים חיוניים כמו דיור, מזון ותחבורה, חלק לרצונות, והיתרה
              לחיסכון ולהקטנת חובות. הכלל אינו מתאים לכל משפחה (בערים יקרות הדיור לבדו
              יכול לחרוג מהמסגרת), אבל הוא מצוין לזיהוי פערים: אם החיסכון החודשי שלכם
              קרוב לאפס, זה הסימן להתחיל.
            </p>
            <p>
              חשוב גם לזכור את ההקשר: שיעור האינפלציה השנתי שנבדק ב-28.9.2026 עמד על 1.5%, כלומר
              כסף ששוכב בעו&quot;ש בלי ריבית מאבד כוח קנייה בשקט. תקציב טוב לא רק עוצר
              דליפות — הוא מפנה כסף למקומות שבהם הוא עובד בשבילכם.
            </p>
          </div>

          <div className="text-center text-gold my-8">✦</div>

          <h2 className="text-2xl font-bold text-ink mb-4">
            ריבית דריבית — למה כדאי להתחיל מוקדם
          </h2>
          <div className="space-y-4 text-ink/75 leading-relaxed">
            <p>
              ריבית דריבית היא המנגנון שבו הרווחים שצברתם מתחילים בעצמם לייצר רווחים.
              בשנים הראשונות ההשפעה מרגישה זניחה — ההפקדות שלכם הן רוב הצבירה. אבל ככל
              שעוברות שנים, החלק של הריבית-על-הריבית גדל, והעקומה מפסיקה להיות קו ישר.
              המסקנה המעשית פשוטה: משך הזמן חשוב לא פחות מגובה ההפקדה. הפקדה חודשית
              צנועה שמתחילה מוקדם יכולה לעקוף הפקדה גדולה שמתחילה מאוחר — פשוט כי היה
              לה יותר זמן לעבוד.
            </p>
            <p>
              אותו מנגנון פועל גם נגדכם: חוב בריבית גבוהה שלא מטופל צובר ריבית על
              ריבית באותה צורה בדיוק. השוו את הריבית האפקטיבית והעמלות על החוב לתשואה
              הצפויה אחרי מס, לצורך בנזילות ולתנאי פירעון מוקדם; אף אחת מהחלופות אינה מובטחת.
            </p>
          </div>

          <div className="text-center text-gold my-8">✦</div>

          <h2 className="text-2xl font-bold text-ink mb-4">
            החזר הלוואות — הריבית שאתם לא רואים
          </h2>
          <div className="space-y-4 text-ink/75 leading-relaxed">
            <p>
              בבדיקה מ־{MACRO_DATA.primeRate.lastUpdated} ריבית בנק ישראל עמדה על{' '}
              {MACRO_DATA.primeRate.boiBaseRate}% והפריים על {MACRO_DATA.primeRate.value}%.
              למשל, בהלוואה בריבית פריים + 3 נקודות אחוז, הריבית באותו מועד היא{' '}
              {MACRO_DATA.primeRate.value + 3}%. ריבית שמשתנה לפי פריים עשויה לשנות את
              ההחזר כשבנק ישראל משנה את הריבית. לפני החתימה השוו את ההצעות בפועל,
              כולל עמלות, הצמדה ותנאי פירעון מוקדם.
            </p>
            <p>
              ואם כבר יש הלוואה: סילוק מואץ, גם בתוספת חודשית קטנה, מקצר את חיי
              ההלוואה ומקטין את סך הריבית שתשלמו — כי הריבית מחושבת על יתרת קרן קטנה
              יותר, לאורך פחות חודשים.
            </p>
          </div>

          <div className="text-center text-gold my-8">✦</div>

          <h2 className="text-2xl font-bold text-ink mb-4">
            חיסכון לילדים — קטן היום, משמעותי בגיל 18
          </h2>
          <div className="space-y-4 text-ink/75 leading-relaxed">
            <p>
              חיסכון לילד הוא הדוגמה הכי טובה לכוח של זמן: אופק של 18 שנה הופך גם
              הפקדות קטנות לסכום מורגש. נקודת פתיחה טבעית היא קצבת הילדים מביטוח לאומי
              — לפי הביטוח הלאומי, ב־2026 סכום הבסיס הוא 173 ₪ לילד הראשון, 219 ₪
              לכל אחד מהילדים השני עד הרביעי ו־173 ₪ לילד חמישי ואילך.{' '}
              <a href="https://www.btl.gov.il/benefits/children/Pages/%D7%A9%D7%99%D7%A2%D7%95%D7%A8%D7%99%20%D7%94%D7%A7%D7%A6%D7%91%D7%94.aspx"
                 target="_blank" rel="noopener noreferrer">בדקו את הסכום האישי באתר הביטוח הלאומי</a>.
              משפחות
              שמנתבות את הקצבה (או חלק ממנה) ישירות להוראת קבע לחיסכון ייעודי בונות
              לילד כרית התחלתית ללימודים, לרישיון או לדירה — בלי להרגיש את זה בתקציב
              השוטף. השלב הראשון הוא לוודא שיש בכלל שורת &quot;חיסכון ילדים&quot;
              בתקציב המשפחתי; מדריך התקציב שלנו עוזר למפות את ההוצאות.
            </p>
          </div>
        </section>

        {/* טבלת עזר */}
        <section className="mt-14">
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-gold mb-2">
            ✦ איזה מחשבון מתאים לי?
          </p>
          <h2 className="text-2xl font-bold text-ink mb-6">השוואה מהירה בין הכלים</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-ink/15">
              <thead>
                <tr className="bg-ink text-cream">
                  <th className="p-3 text-right font-mono text-xs uppercase tracking-[0.1em] font-normal">מחשבון</th>
                  <th className="p-3 text-right font-mono text-xs uppercase tracking-[0.1em] font-normal">מתי משתמשים</th>
                  <th className="p-3 text-right font-mono text-xs uppercase tracking-[0.1em] font-normal">מה מקבלים</th>
                </tr>
              </thead>
              <tbody className="text-ink/75">
                <tr className="border-t border-ink/15 bg-paper">
                  <td className="p-3 font-bold text-ink">
                    <Link href="/savings/family-budget" className="hover:text-gold transition">תקציב משפחתי</Link>
                  </td>
                  <td className="p-3">רוצים לדעת לאן הכסף הולך ואיפה אפשר לחסוך</td>
                  <td className="p-3">צעדים למיפוי הכנסות והוצאות ולהתאמת כלל 50/30/20</td>
                </tr>
                <tr className="border-t border-ink/15 bg-cream-2">
                  <td className="p-3 font-bold text-ink">
                    <Link href="/savings/loan-repayment" className="hover:text-gold transition">החזרי הלוואה</Link>
                  </td>
                  <td className="p-3">יש הלוואה קיימת ורוצים לבדוק סילוק מוקדם</td>
                  <td className="p-3">החזר חודשי, לוח סילוקין וכמה ריבית חוסך סילוק מואץ</td>
                </tr>
                <tr className="border-t border-ink/15 bg-paper">
                  <td className="p-3 font-bold text-ink">
                    <Link href="/savings/personal-loan" className="hover:text-gold transition">הלוואה אישית</Link>
                  </td>
                  <td className="p-3">שוקלים לקחת הלוואה חדשה או מסדרים כמה חובות</td>
                  <td className="p-3">רשימת נתונים להשוואה וקישורים לבנק ישראל</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* FAQ */}
        <section className="mt-14">
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-gold mb-2">
            ✦ שאלות נפוצות
          </p>
          <h2 className="text-2xl font-bold text-ink mb-6">שאלות ותשובות על חיסכון ותקציב</h2>
          <FAQ items={faqItems} />
        </section>

        {/* קריאה נוספת */}
        <section className="mt-14 mb-4">
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-gold mb-2">
            ✦ קריאה נוספת
          </p>
          <h2 className="text-2xl font-bold text-ink mb-6">מהבלוג שלנו</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            <Link
              href="/blog/compound-interest-and-time-magic"
              className="group bg-cream-2 border border-ink/15 p-5 hover:border-gold transition"
            >
              <h3 className="font-bold text-ink mb-1 group-hover:text-gold transition">
                ריבית דריבית וקסם הזמן
              </h3>
              <p className="text-sm text-ink/70">למה השנים הראשונות של חיסכון שוות הכי הרבה</p>
            </Link>
            <Link
              href="/blog/business-budget-planning-2026"
              className="group bg-cream-2 border border-ink/15 p-5 hover:border-gold transition"
            >
              <h3 className="font-bold text-ink mb-1 group-hover:text-gold transition">
                תכנון תקציב ל-2026
              </h3>
              <p className="text-sm text-ink/70">איך בונים תקציב שנתי שמחזיק מים</p>
            </Link>
            <Link
              href="/blog/inflation-and-investments"
              className="group bg-cream-2 border border-ink/15 p-5 hover:border-gold transition"
            >
              <h3 className="font-bold text-ink mb-1 group-hover:text-gold transition">
                אינפלציה והשקעות
              </h3>
              <p className="text-sm text-ink/70">מה עליית המדד עושה לכסף שלכם ומה עושים עם זה</p>
            </Link>
          </div>
        </section>

        <p className="mt-10 text-xs text-ink/70 leading-relaxed border-t border-ink/15 pt-4">
          המידע בעמוד זה הוא מידע כללי בלבד ואינו מהווה ייעוץ פיננסי, ייעוץ השקעות או
          ייעוץ מס. לפני קבלת החלטות כספיות מומלץ להתייעץ עם בעל מקצוע מוסמך.
        </p>
      </div>
    </div>
  );
}
