import Link from 'next/link';
import { Metadata } from 'next';
import { ArrowLeft, Calculator } from 'lucide-react';
import { Breadcrumbs } from '@/components/calculator/Breadcrumbs';
import { FAQ } from '@/components/calculator/FAQ';
import { MACRO_DATA } from '@/lib/data/macroeconomic-data';

export const metadata: Metadata = {
  alternates: { canonical: '/vehicles' },
  title: 'מחשבוני רכב 2026 — שווי שימוש, עלות דלק וליסינג פרטי',
  description: 'חשב שווי שימוש ברכב צמוד, עלות דלק חודשית ושנתית, והשווה ליסינג פרטי מול קניית רכב (TCO מלא). כלים מקצועיים להוצאות רכב בעברית, עדכני 2026 — חינם.',
};

const calculators = [
  {
    title: 'מחשבון שווי שימוש ברכב צמוד',
    description: 'התוספת החודשית לשכר החייבת במס על רכב מהעבודה — לפי קבוצת מחיר הרכב',
    href: '/vehicles/company-car-benefit',
    available: true,
    icon: '🚘',
  },
  {
    title: 'מחשבון עלות דלק',
    description: 'חשב את ההוצאה החודשית והשנתית על דלק לפי צריכה וק"מ',
    href: '/vehicles/fuel-cost',
    available: true,
    icon: '⛽',
  },
  {
    title: 'ליסינג פרטי vs קנייה',
    description: 'השוואת עלות בעלות מלאה (TCO) בין ליסינג פרטי, קנייה במימון וקנייה במזומן',
    href: '/vehicles/leasing-vs-buying',
    available: true,
    icon: '🚙',
  },
];

const faqItems = [
  {
    question: 'מה זה שווי שימוש ברכב צמוד וכמה זה עולה?',
    answer:
      'שווי שימוש הוא סכום שמתווסף לשכר ברוטו של עובד שמקבל רכב מהמעסיק, וחייב במס הכנסה ובביטוח לאומי כאילו היה חלק מהשכר. הסכום נקבע לפי קבוצת המחיר של הרכב (1–7) ולא לפי השימוש בפועל. ככל שהרכב יקר יותר — שווי השימוש גבוה יותר, ובפועל העובד משלם מס שולי (עד 50%) על התוספת הזו. במחשבון שווי השימוש אפשר לבדוק כמה באמת "עולה" לכם הרכב מהעבודה נטו.',
  },
  {
    question: 'כמה עולה דלק לחודש בישראל?',
    answer:
      `מחיר בנזין 95 אוקטן נכון ל-2026 הוא כ-${MACRO_DATA.fuelPrices.gasoline95} ₪ לליטר (סולר כ-${MACRO_DATA.fuelPrices.diesel} ₪). ההוצאה החודשית תלויה בצריכת הרכב ובק"מ שאתם נוסעים: רכב שצורך 7 ליטר ל-100 ק"מ ונוסע 1,500 ק"מ בחודש ישרוף כ-105 ליטר — כ-${Math.round(105 * MACRO_DATA.fuelPrices.gasoline95)} ₪ בחודש. מחשבון עלות הדלק מחשב זאת במדויק לפי הנתונים שלכם.`,
  },
  {
    question: 'ליסינג פרטי או קניית רכב — מה משתלם יותר?',
    answer:
      'ליסינג פרטי הוא תשלום חודשי קבוע הכולל רכב, ביטוח, טיפולים ורישוי, ללא בעלות ברכב בסוף התקופה. קנייה (במזומן או במימון) מקנה בעלות ונכס, אך חושפת אתכם לירידת ערך, תחזוקה ומימון. ההשוואה הנכונה היא לפי עלות בעלות מלאה (TCO) לאורך כל שנות ההחזקה — כולל ירידת ערך, דלק, ביטוח, טיפולים ועלות ההזדמנות של הכסף. מחשבון הליסינג מול קנייה עושה את ההשוואה המלאה הזו.',
  },
  {
    question: 'האם רכב חברה משתלם יותר מתוספת שכר?',
    answer:
      'לא תמיד. רכב צמוד נוח אך "עולה" לעובד בשווי שימוש שממוסה בשיעור השולי, ולעיתים תוספת שכר במזומן (שממנה אפשר לממן ליסינג פרטי או רכב זול יותר) משתלמת יותר — במיוחד לנוסעים מעטים. כדאי להשוות: שווי השימוש והמס עליו מול העלות האמיתית של החזקת רכב פרטי באותה רמה.',
  },
];

export default function VehiclesPage() {
  return (
    <div className="min-h-screen bg-paper">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Breadcrumbs items={[{ label: 'דף הבית', href: '/' }, { label: 'רכב ותחבורה' }]} />
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-ink mb-3">
          🚗 מחשבוני רכב 2026 — שווי שימוש, דלק וליסינג
        </h1>
        <p className="text-lg text-ink/70 mb-12">
          כלים מקצועיים לכל החלטת רכב: כמה עולה שווי שימוש ברכב צמוד, מה ההוצאה על דלק,
          והאם משתלם יותר ליסינג פרטי או קניית רכב.
        </p>

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
                <Calculator className="w-6 h-6 text-ink/45 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h3 className="font-bold text-ink/70 mb-1">{calc.title}</h3>
                  <p className="text-sm text-ink/60">{calc.description}</p>
                  <span className="inline-block mt-2 text-xs bg-ink/10 text-ink/70 px-2 py-1 rounded-none">
                    בקרוב
                  </span>
                </div>
              </div>
            ),
          )}
        </div>

        {/* Pillar content */}
        <section className="prose prose-lg max-w-none mt-14 text-ink leading-relaxed">
          <h2>כמה באמת עולה לכם הרכב?</h2>
          <p>
            רכב הוא אחת ההוצאות הגדולות של משק בית ישראלי — אבל רוב האנשים מסתכלים רק על מחיר
            הקנייה או על התשלום החודשי, ומפספסים את התמונה המלאה. העלות האמיתית כוללת גם דלק,
            ביטוח, טיפולים, ירידת ערך, ובמקרה של רכב מהעבודה — גם את <strong>שווי השימוש</strong>{' '}
            שממוסה כאילו היה חלק מהשכר. שלושת המחשבונים כאן עוזרים לכם להחליט על בסיס מספרים
            אמיתיים ולא על תחושת בטן.
          </p>

          <h2>שווי שימוש ברכב צמוד</h2>
          <p>
            אם אתם מקבלים רכב מהעבודה, מתווסף לשכר הברוטו שלכם סכום חודשי בשם "שווי שימוש",
            שחייב במס הכנסה ובביטוח לאומי. הסכום נקבע לפי <strong>קבוצת המחיר של הרכב</strong>{' '}
            (1 עד 7) ולא לפי כמה שאתם נוסעים בפועל — ולכן רכב יקר יכול "לעלות" לכם מאות שקלים
            בחודש בנטו. <Link href="/vehicles/company-car-benefit">מחשבון שווי השימוש</Link> מראה
            לכם את התוספת המדויקת ואת המס שתשלמו עליה.
          </p>

          <h2>עלות דלק חודשית</h2>
          <p>
            מחיר בנזין 95 אוקטן נכון ל-2026 עומד על כ-{MACRO_DATA.fuelPrices.gasoline95} ₪ לליטר,
            וסולר על כ-{MACRO_DATA.fuelPrices.diesel} ₪. ההוצאה שלכם תלויה בצריכת הרכב ובמספר
            הקילומטרים שאתם נוסעים.{' '}
            <Link href="/vehicles/fuel-cost">מחשבון עלות הדלק</Link> מחשב את ההוצאה החודשית
            והשנתית לפי הנתונים האישיים שלכם, וגם משווה בין רכב בנזין לרכב חשמלי.
          </p>

          <h2>ליסינג פרטי מול קנייה</h2>
          <p>
            השאלה "ליסינג או קנייה?" לא נפתרת לפי התשלום החודשי בלבד. צריך להשוות{' '}
            <strong>עלות בעלות מלאה (TCO)</strong> לאורך כל שנות ההחזקה — כולל ירידת ערך, ביטוח,
            טיפולים, מימון ועלות ההזדמנות של הכסף.{' '}
            <Link href="/vehicles/leasing-vs-buying">מחשבון ליסינג מול קנייה</Link> משווה שלוש
            אפשרויות — ליסינג פרטי, קנייה במימון וקנייה במזומן — ונותן המלצה לפי המצב שלכם.
          </p>

          <h2>איזה מחשבון מתאים לי?</h2>
          <div className="overflow-x-auto">
            <table>
              <thead>
                <tr>
                  <th>אם אתם רוצים לדעת…</th>
                  <th>המחשבון</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>כמה מס אני משלם על רכב מהעבודה</td>
                  <td><Link href="/vehicles/company-car-benefit">שווי שימוש ברכב</Link></td>
                </tr>
                <tr>
                  <td>כמה עולה לי דלק בחודש / בשנה</td>
                  <td><Link href="/vehicles/fuel-cost">עלות דלק</Link></td>
                </tr>
                <tr>
                  <td>האם עדיף ליסינג פרטי, מימון או מזומן</td>
                  <td><Link href="/vehicles/leasing-vs-buying">ליסינג מול קנייה</Link></td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* FAQ */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-ink mb-6">שאלות נפוצות על עלויות רכב</h2>
          <FAQ items={faqItems} />
        </section>

        {/* קריאה נוספת */}
        <section className="mt-12">
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-gold mb-3">
            ✦ קריאה נוספת
          </p>
          <ul className="space-y-2 text-ink/80">
            <li>
              <Link href="/blog/electric-vs-gasoline-car" className="text-gold hover:text-gold-2 underline">
                רכב חשמלי מול בנזין — מה משתלם ב-2026?
              </Link>
            </li>
            <li>
              <Link href="/blog/leasing-vs-buying-vs-cash-decision" className="text-gold hover:text-gold-2 underline">
                ליסינג, מימון או מזומן — המדריך המלא להחלטה
              </Link>
            </li>
            <li>
              <Link href="/blog/vehicle-tco-guide" className="text-gold hover:text-gold-2 underline">
                עלות הבעלות האמיתית על רכב (TCO) — כל הרכיבים
              </Link>
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
