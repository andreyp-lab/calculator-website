import Link from 'next/link';
import { Metadata } from 'next';
import { ArrowLeft, Calculator, BookOpen } from 'lucide-react';
import { Breadcrumbs } from '@/components/calculator/Breadcrumbs';
import { FAQ } from '@/components/calculator/FAQ';
import { DisclaimerBox } from '@/components/calculator/DisclaimerBox';

export const metadata: Metadata = {
  alternates: { canonical: '/real-estate' },
  title: 'מחשבוני משכנתא ונדל"ן 2026 — חשב מס רכישה ושבח בחינם',
  description:
    'מחשבוני נדל"ן 2026: משכנתא, מס רכישה לפי מדרגות עדכניות, מס שבח ואופטימיזציה תמהיל משכנתא לרוכשי דירות בישראל. חשב את עלויות הרכישה עכשיו בחינם.',
};

const calculators = [
  {
    title: 'מחשבון משכנתא',
    description: 'חישוב תשלום חודשי, לוח סילוקין שפיצר/קרן שווה, גרף שנתי',
    href: '/real-estate/mortgage',
    available: true,
    badge: undefined as string | undefined,
  },
  {
    title: 'אופטימייזר תמהיל משכנתא',
    description: 'Solver-style: מוצא את החלוקה האופטימלית בין מסלולים למזעור עלות, סיכון, או תשלום חודשי',
    href: '/real-estate/mortgage-optimizer',
    available: true,
    badge: 'חדש' as string | undefined,
  },
  {
    title: 'מחשבון מס רכישה',
    description: 'חישוב מס רכישה לפי מדרגות 2026 (דירה ראשונה / נוספת)',
    href: '/real-estate/purchase-tax',
    available: true,
    badge: undefined as string | undefined,
  },
  {
    title: 'מחשבון מס שבח',
    description: 'מכירת דירה - פטור דירה יחידה + חישוב לינארי מוטב',
    href: '/real-estate/capital-gains-tax',
    available: true,
    badge: undefined as string | undefined,
  },
  {
    title: '📘 מדריך מיסוי שכר דירה',
    description: '3 מסלולי המס על הכנסה משכירות: פטור (עד 5,654 ₪), מסלול 10% ומדרגות — מתי כל אחד משתלם',
    href: '/real-estate/rental-income-tax',
    available: true,
    badge: undefined as string | undefined,
  },
];

const comparisonRows = [
  {
    tool: 'מחשבון משכנתא',
    href: '/real-estate/mortgage',
    when: 'לפני פגישה עם הבנק — כמה יעלה ההחזר החודשי ומה סך הריבית לאורך חיי ההלוואה',
    output: 'החזר חודשי, לוח סילוקין מלא, סך ריבית',
  },
  {
    tool: 'אופטימייזר תמהיל',
    href: '/real-estate/mortgage-optimizer',
    when: 'כשמתלבטים איך לחלק את ההלוואה בין פריים, קבועה וצמודה',
    output: 'חלוקה מומלצת בין מסלולים לפי יעד — עלות, סיכון או תשלום',
  },
  {
    tool: 'מחשבון מס רכישה',
    href: '/real-estate/purchase-tax',
    when: 'לפני חתימת חוזה רכישה — כמה מס תשלמו על הדירה (ראשונה או נוספת)',
    output: 'סכום המס המדויק לפי מדרגות 2026',
  },
  {
    tool: 'מחשבון מס שבח',
    href: '/real-estate/capital-gains-tax',
    when: 'לפני מכירת דירה — בדיקת פטור דירה יחידה וחישוב לינארי מוטב',
    output: 'אומדן מס השבח והפטורים הרלוונטיים',
  },
  {
    tool: 'מדריך מיסוי שכירות',
    href: '/real-estate/rental-income-tax',
    when: 'כשמשכירים דירה — איזה מסלול מס משתלם: פטור, 10% או מדרגות',
    output: 'השוואת שלושת המסלולים לפי גובה שכר הדירה',
  },
];

const faqItems = [
  {
    question: 'כמה מס רכישה משלמים על דירה ראשונה ב-2026?',
    answer:
      'רוכשי דירה יחידה (תושבי ישראל) פטורים ממס רכישה עד שווי של 1,978,745 ₪. מעל סכום זה המס מדורג: 3.5% עד 2,347,040 ₪, 5% עד 6,055,070 ₪, 8% עד 20,183,565 ₪ ו-10% מעל. המדרגות מתעדכנות מדי שנה לפי המדד — השתמשו במחשבון מס רכישה לחישוב מדויק.',
  },
  {
    question: 'מה ההבדל בין מס רכישה למס שבח?',
    answer:
      'מס רכישה משולם על ידי הקונה בעת רכישת הנכס, לפי מדרגות התלויות בשווי הדירה ובשאלה אם זו דירה יחידה. מס שבח משולם על ידי המוכר על הרווח (השבח) ממכירת הנכס — שיעור סטנדרטי של 25% על השבח הריאלי. שימו לב: מס רכישה ששולם בעבר ניתן לניכוי מהשבח בעת המכירה.',
  },
  {
    question: 'מה עדיף — מסלול פריים או ריבית קבועה במשכנתא?',
    answer:
      'אין תשובה אחת. מסלול פריים (כיום 5.5%) זול יחסית וגמיש לפירעון מוקדם, אך חשוף לשינויי ריבית של בנק ישראל. ריבית קבועה לא צמודה נותנת ודאות מלאה בהחזר אך יקרה יותר. רוב הלווים משלבים כמה מסלולים — האופטימייזר שלנו עוזר למצוא את התמהיל המתאים לפרופיל הסיכון שלכם.',
  },
  {
    question: 'מתי כדאי למחזר משכנתא?',
    answer:
      'כשריבית השוק ירדה משמעותית מהריבית שאתם משלמים, כשהתזרים המשפחתי השתנה, או כשמסלולים צמודי מדד "התנפחו". הבדיקה פשוטה: מריצים את יתרת ההלוואה במחשבון המשכנתא בתנאים החדשים ומשווים לסך התשלומים שנותר במסלול הקיים, כולל עמלות פירעון מוקדם אם ישנן.',
  },
  {
    question: 'האם צריך לשלם מס על הכנסה משכר דירה?',
    answer:
      'תלוי בגובה ההכנסה ובמסלול שבוחרים. הכנסה משכירות למגורים עד 5,654 ₪ בחודש (2026) פטורה ממס במסלול הפטור. מעל התקרה קיים מנגנון פטור חלקי עד 11,308 ₪, ולחלופין מסלול מס מופחת של 10% ללא ניכוי הוצאות, או מסלול מדרגות עם ניכוי הוצאות ופחת. המדריך שלנו משווה בין השלושה.',
  },
];

const furtherReading = [
  {
    href: '/guides/mortgage-complete-guide-2026',
    title: 'המדריך המלא למשכנתא 2026',
    description: 'מהון עצמי ועד חתימה — כל שלבי לקיחת המשכנתא במקום אחד',
  },
  {
    href: '/blog/purchase-tax-2026-complete-guide',
    title: 'מס רכישה 2026 — המדריך המלא',
    description: 'מדרגות, פטורים, דירה יחידה מול דירה נוספת ודוגמאות חישוב',
  },
  {
    href: '/blog/mortgage-tracks-guide-2026',
    title: 'מסלולי משכנתא 2026 — מדריך',
    description: 'פריים, קבועה, צמודה ומשתנה — יתרונות, חסרונות ולמי מתאים',
  },
  {
    href: '/blog/capital-gains-tax-property-2026',
    title: 'מס שבח על דירה 2026',
    description: 'פטור דירה יחידה, חישוב לינארי מוטב והוצאות מוכרות',
  },
];

export default function RealEstatePage() {
  return (
    <div className="min-h-screen bg-paper">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Breadcrumbs items={[{ label: 'דף הבית', href: '/' }, { label: 'משכנתא ונדל"ן' }]} />
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-ink mb-3">
          מחשבוני משכנתא ונדל&quot;ן 2026 — מס רכישה, מס שבח ומחזור
        </h1>
        <p className="text-lg text-ink/70 mb-12">
          מחשבונים מקצועיים לרוכשי ובעלי דירות בישראל
        </p>

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
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-ink group-hover:text-gold transition">
                      {calc.title}
                    </h3>
                    {calc.badge && (
                      <span className="bg-cream-2 text-gold text-xs px-2 py-0.5 rounded-full font-medium">
                        {calc.badge}
                      </span>
                    )}
                  </div>
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

        {/* ================= Editorial ================= */}
        <section className="mt-16">
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-gold mb-2">
            ✦ המדריך המרוכז
          </p>
          <h2 className="text-2xl font-bold text-ink mb-4">
            משכנתא ומסלולים — איך בנויה ההלוואה הגדולה של חייכם
          </h2>
          <div className="space-y-4 text-ink/75 leading-relaxed">
            <p>
              משכנתא ישראלית כמעט אף פעם אינה מסלול אחד — היא תמהיל של כמה הלוואות במקביל, שלכל
              אחת מהן ריבית, הצמדה ורמת סיכון משלה. מסלול הפריים נשען על ריבית הפריים, שעומדת כיום
              על 5.5% (ריבית בנק ישראל 4.0% בתוספת מרווח קבוע). הוא זול יחסית וגמיש לפירעון מוקדם,
              אבל ההחזר בו משתנה עם כל החלטת ריבית. מנגד, ריבית קבועה לא צמודה נותנת ודאות מלאה —
              ההחזר לא יזוז עד סוף התקופה — ובתמורה מתומחרת גבוה יותר. באמצע נמצאים מסלולים צמודי
              מדד ומסלולים בריבית משתנה. לשם השוואה, הריבית הממוצעת על משכנתאות חדשות (מסלולים
              מעורבים) עומדת כיום סביב 4.8%. נקודת המוצא היא <Link href="/real-estate/mortgage" className="text-gold underline underline-offset-2 hover:text-ink transition">מחשבון המשכנתא</Link>{' '}
              לחישוב ההחזר, ומשם{' '}
              <Link href="/real-estate/mortgage-optimizer" className="text-gold underline underline-offset-2 hover:text-ink transition">האופטימייזר</Link>{' '}
              שמחלק את הסכום בין המסלולים לפי היעד שלכם.
            </p>
          </div>

          <h2 className="text-2xl font-bold text-ink mt-10 mb-4">
            מס רכישה — כמה באמת עולה לקנות דירה
          </h2>
          <div className="space-y-4 text-ink/75 leading-relaxed">
            <p>
              מעבר למחיר הדירה עצמה, הקונה משלם מס רכישה לפי מדרגות המתעדכנות מדי שנה לפי מדד
              המחירים לצרכן. ב-2026, רוכש דירה יחידה (תושב ישראל) נהנה מפטור מלא עד שווי של
              1,978,745 ₪ — כלומר חלק ניכר מהדירות בפריפריה ואף חלק מהדירות במרכז פטורות לחלוטין.
              מעל הסף, המס מדורג: 3.5% על החלק שעד 2,347,040 ₪, 5% עד 6,055,070 ₪, 8% עד
              20,183,565 ₪ ו-10% מעבר לכך. מי שרוכש דירה נוספת (משקיעים) מתחיל ישר במדרגות
              גבוהות: 8% עד 6,055,070 ₪ ו-10% מעל. ההבדל בין &quot;דירה יחידה&quot; ל&quot;דירה
              נוספת&quot; יכול להסתכם במאות אלפי שקלים — לכן שווה לבדוק את הסטטוס שלכם{' '}
              <Link href="/real-estate/purchase-tax" className="text-gold underline underline-offset-2 hover:text-ink transition">במחשבון מס הרכישה</Link>{' '}
              לפני שחותמים.
            </p>
          </div>

          <h2 className="text-2xl font-bold text-ink mt-10 mb-4">
            מס שבח — המס של המוכרים
          </h2>
          <div className="space-y-4 text-ink/75 leading-relaxed">
            <p>
              בצד המכירה עומד מס השבח: מס על הרווח הריאלי ממכירת הנכס, בשיעור סטנדרטי של 25%
              ב-2026. החדשות הטובות: מוכרי דירה יחידה זכאים במקרים רבים לפטור, ולדירות שנרכשו לפני
              2014 קיים &quot;חישוב לינארי מוטב&quot; שמפחית דרמטית את המס — ככל שהרכישה ישנה
              יותר, חלק גדול יותר מהשבח פטור. גם הוצאות מוכרות (שכ&quot;ט עו&quot;ד, תיווך, שיפוצים,
              ואפילו מס הרכישה ששילמתם בזמנו) מקטינות את השבח החייב.{' '}
              <Link href="/real-estate/capital-gains-tax" className="text-gold underline underline-offset-2 hover:text-ink transition">מחשבון מס השבח</Link>{' '}
              עושה את החישוב המלא כולל בדיקת הפטורים.
            </p>
          </div>

          <h2 className="text-2xl font-bold text-ink mt-10 mb-4">
            מיחזור משכנתא והכנסה משכירות
          </h2>
          <div className="space-y-4 text-ink/75 leading-relaxed">
            <p>
              משכנתא היא לא גזירת גורל ל-30 שנה. כשריבית השוק יורדת מתחת לריבית שאתם משלמים, או
              כשמסלול צמוד מדד &quot;התנפח&quot;, מיחזור — פירעון ההלוואה הקיימת ולקיחת חדשה בתנאים
              טובים יותר — יכול לחסוך עשרות אלפי שקלים. הבדיקה פשוטה: מזינים את היתרה במחשבון
              המשכנתא בתנאי השוק הנוכחיים ומשווים למה שנשאר לשלם היום, בלי לשכוח עמלות פירעון
              מוקדם.
            </p>
            <p>
              ולבסוף, מי שמשכיר דירה צריך לבחור מסלול מס: מסלול פטור (הכנסה עד 5,654 ₪ בחודש
              פטורה לחלוטין ב-2026, עם פטור חלקי עד 11,308 ₪), מסלול מס מופחת של 10% ללא ניכוי
              הוצאות, או מסלול מדרגות מס רגילות עם ניכוי הוצאות ופחת.{' '}
              <Link href="/real-estate/rental-income-tax" className="text-gold underline underline-offset-2 hover:text-ink transition">מדריך מיסוי שכר הדירה</Link>{' '}
              משווה בין השלושה ומראה מתי כל אחד משתלם.
            </p>
          </div>
        </section>

        {/* ================= Comparison table ================= */}
        <section className="mt-16">
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-gold mb-2">
            ✦ מפת דרכים
          </p>
          <h2 className="text-2xl font-bold text-ink mb-6">איזה מחשבון מתאים לכם?</h2>
          <div className="overflow-x-auto border border-ink/15">
            <table className="w-full text-sm text-right">
              <thead>
                <tr className="bg-ink text-cream">
                  <th className="px-4 py-3 font-mono text-xs uppercase tracking-[0.1em] font-normal">הכלי</th>
                  <th className="px-4 py-3 font-mono text-xs uppercase tracking-[0.1em] font-normal">מתי משתמשים</th>
                  <th className="px-4 py-3 font-mono text-xs uppercase tracking-[0.1em] font-normal">מה מקבלים</th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row, idx) => (
                  <tr
                    key={row.href}
                    className={`border-t border-ink/15 ${idx % 2 === 1 ? 'bg-cream-2' : 'bg-paper'}`}
                  >
                    <td className="px-4 py-3 font-bold text-ink whitespace-nowrap">
                      <Link href={row.href} className="hover:text-gold transition">
                        {row.tool}
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

        {/* ================= FAQ ================= */}
        <section className="mt-16">
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-gold mb-2">
            ✦ שאלות נפוצות
          </p>
          <h2 className="text-2xl font-bold text-ink mb-6">שאלות שגולשים שואלים על משכנתא ומיסוי נדל&quot;ן</h2>
          <FAQ items={faqItems} />
        </section>

        {/* ================= Further reading ================= */}
        <section className="mt-16">
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-gold mb-2">
            ✦ קריאה נוספת
          </p>
          <h2 className="text-2xl font-bold text-ink mb-6">מדריכים מעמיקים</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {furtherReading.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group bg-cream-2 border border-ink/15 hover:border-gold transition p-5 flex items-start gap-3"
              >
                <BookOpen className="w-5 h-5 text-gold flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h3 className="font-bold text-ink group-hover:text-gold transition mb-1">
                    {item.title}
                  </h3>
                  <p className="text-sm text-ink/60">{item.description}</p>
                </div>
                <ArrowLeft className="w-4 h-4 text-gold mt-1 opacity-0 group-hover:opacity-100 transition" />
              </Link>
            ))}
          </div>
        </section>

        <div className="mt-12">
          <DisclaimerBox text="המידע בעמוד זה הוא מידע כללי בלבד ואינו מהווה ייעוץ משפטי, מס או פיננסי. מדרגות המס, הריביות והתקרות מתעדכנות מעת לעת. לפני קבלת החלטות רכישה, מכירה או מיחזור — התייעצו עם יועץ משכנתאות, רואה חשבון או עורך דין מוסמך." />
        </div>
      </div>
    </div>
  );
}
