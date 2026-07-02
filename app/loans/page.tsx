import Link from 'next/link';
import { Metadata } from 'next';
import { ArrowLeft, Home, CreditCard, BarChart3, CheckCircle, Sparkles, TrendingDown } from 'lucide-react';
import { Breadcrumbs } from '@/components/calculator/Breadcrumbs';
import { FAQ } from '@/components/calculator/FAQ';
import { DisclaimerBox } from '@/components/calculator/DisclaimerBox';
import { MACRO_DATA, formatHebrewDate } from '@/lib/data/macroeconomic-data';

export const metadata: Metadata = {
  title: 'מחשבוני הלוואות 2026 — חשב בחינם החזר חודשי ומיחזור',
  description:
    'כל מחשבוני ההלוואות בישראל — משכנתא, אופטימייזר תמהיל, הלוואה אישית, השוואת הלוואות וכושר החזר. נתונים עדכניים 2026. השתמש עכשיו — ללא הרשמה, חינם.',
  alternates: { canonical: '/loans' },
};

interface Calculator {
  title: string;
  description: string;
  href: string;
  icon: typeof Home;
  badge?: string;
  highlight?: boolean;
  features: string[];
}

const featured: Calculator[] = [
  {
    title: 'מחשבון משכנתא',
    description: 'חישוב תשלום חודשי, השוואת מסלולים מעורבים, מחזור, פירעון מוקדם וכושר החזר',
    href: '/real-estate/mortgage',
    icon: Home,
    badge: '5 טאבים',
    highlight: true,
    features: [
      'שפיצר / קרן שווה',
      'משכנתא מעורבת (2-5 מסלולים)',
      'חישוב מחזור (Refinancing)',
      'פירעון מוקדם וחיסכון',
      'בדיקת כושר החזר',
    ],
  },
  {
    title: 'אופטימייזר תמהיל משכנתא',
    description: 'הכלי הייחודי שלנו - מצא את החלוקה האופטימלית בין מסלולים. סגנון Solver של Excel',
    href: '/real-estate/mortgage-optimizer',
    icon: Sparkles,
    badge: '🆕 חדש',
    highlight: true,
    features: [
      'אלגוריתם אופטימיזציה אמיתי',
      'מטרות: עלות / סיכון / חודשי',
      'אילוצים רגולטוריים (33% קבועה)',
      'תרחישי קיצון (אינפלציה, פריים)',
      'השוואה להצעת הבנק',
    ],
  },
];

const others: Calculator[] = [
  {
    title: 'הלוואה אישית',
    description: 'חישוב + APR אמיתי + השוואת 6 מקורות + Snowball/Avalanche לסילוק חוב',
    href: '/savings/personal-loan',
    icon: CreditCard,
    badge: '6 טאבים',
    features: [
      'PMT + לוח סילוקין מלא',
      'APR אמיתי (כולל עמלות)',
      '6 מקורות: בנק / קרן השתלמות / כרטיס / משפחה',
      'Snowball vs Avalanche',
      'כרטיס אשראי vs הלוואה',
    ],
  },
  {
    title: 'השוואת הלוואות',
    description: 'השוואה צד-ליד-צד, איחוד הלוואות, ניתוח חוב מקיף',
    href: '/savings/loan-repayment',
    icon: BarChart3,
    badge: '5 טאבים',
    features: [
      'עד 5 הצעות במקביל',
      'דירוג לפי עלות אמיתית',
      'איחוד הלוואות + חיסכון',
      'פירעון מוקדם',
      'אמורטיזציה מלאה',
    ],
  },
  {
    title: 'כושר החזר הלוואה',
    description: 'כמה הלוואה אתה יכול לקבל? בדיקה לפי DTI + הכנסה + התחייבויות',
    href: '/tools/loan-eligibility',
    icon: CheckCircle,
    features: [
      'DTI gauge ויזואלי',
      'מגבלות בנקאיות',
      'התחייבויות קיימות',
      'המלצות אישיות',
    ],
  },
];

const faqItems = [
  {
    question: 'מה ההבדל בין הריבית הנקובה ל-APR (עלות אשראי אמיתית)?',
    answer:
      'הריבית הנקובה היא האחוז שהבנק מפרסם, אבל היא לא כוללת עמלות פתיחת תיק, דמי ניהול וביטוחים נלווים. ה-APR (שיעור עלות אשראי אפקטיבי) מגלם את כל העלויות האלה לאחוז שנתי אחד, ולכן הוא הדרך הנכונה להשוות בין הצעות הלוואה. מחשבון ההלוואה האישית שלנו מחשב APR אמיתי לכל הצעה.',
  },
  {
    question: `מה זה ריבית פריים וכמה היא היום?`,
    answer: `ריבית הפריים היא ריבית בנק ישראל בתוספת מרווח בנקאי קבוע של ${MACRO_DATA.primeRate.bankSpread}%. נכון ל-${formatHebrewDate(MACRO_DATA.primeRate.lastUpdated)}, ריבית בנק ישראל עומדת על ${MACRO_DATA.primeRate.boiBaseRate}% ולכן הפריים הוא ${MACRO_DATA.primeRate.value}%. הלוואות רבות בישראל צמודות לפריים, כך שכל שינוי בריבית בנק ישראל משנה את ההחזר החודשי שלכם.`,
  },
  {
    question: 'מתי כדאי למחזר הלוואה או משכנתא?',
    answer:
      'מיחזור כדאי כאשר הריבית שתקבלו היום נמוכה משמעותית מהריבית בהלוואה הקיימת, וכאשר החיסכון הכולל גדול מעמלת הפירעון המוקדם ועלויות המיחזור. במחשבון המשכנתא יש טאב ייעודי למיחזור שמחשב את נקודת האיזון — כמה חודשים ייקח עד שהחיסכון מכסה את העלויות.',
  },
  {
    question: 'כמה הלוואה אני יכול לקבל מהבנק?',
    answer:
      'בנקים בוחנים את יחס ההחזר להכנסה (DTI) — איזה חלק מההכנסה הפנויה שלכם הולך להחזרי הלוואות, כולל התחייבויות קיימות. ככל שהיחס גבוה יותר, הסיכון שהבקשה תידחה או שהריבית תעלה גדל. מחשבון כושר ההחזר בודק את היחס שלכם ומעריך את סכום ההלוואה הריאלי.',
  },
  {
    question: 'שפיצר או קרן שווה — מה עדיף?',
    answer:
      'בלוח שפיצר ההחזר החודשי קבוע לאורך כל התקופה, אבל סך הריבית המצטברת גבוה יותר. בקרן שווה ההחזר מתחיל גבוה ויורד בהדרגה, וסך הריבית נמוך יותר. שפיצר מתאים למי שצריך יציבות תקציבית; קרן שווה למי שיכול לעמוד בהחזר התחלתי גבוה ורוצה לשלם פחות ריבית בסך הכול. אפשר להשוות בין השניים במחשבון המשכנתא.',
  },
];

export default function LoansPage() {
  return (
    <div className="min-h-screen bg-cream">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Breadcrumbs items={[{ label: 'דף הבית', href: '/' }, { label: 'הלוואות' }]} />
        </div>

        {/* Hero */}
        <div className="bg-ink-deep border border-cream/15 p-6 md:p-10 text-cream mb-10 relative overflow-hidden">
          <div className="relative z-10 max-w-3xl">
            <div className="flex items-center gap-2 mb-3">
              <TrendingDown className="w-8 h-8 text-gold-light" />
              <p className="font-mono text-xs uppercase tracking-[0.14em] text-gold-light">
                // כל ההלוואות במקום אחד ✦
              </p>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold mb-3 leading-tight">
              מחשבוני הלוואות 2026 — החזר חודשי, מיחזור וזכאות
            </h1>
            <p className="text-cream/70 text-base md:text-lg mb-4">
              5 כלים מקצועיים לכל סוג הלוואה - משכנתא, אישית, איחוד חובות, ובדיקת כושר.
              עם <strong className="text-cream">אופטימייזר משכנתא בלעדי</strong> שמוצא את התמהיל האידיאלי בשבילך.
            </p>
            <div className="flex flex-wrap gap-2 text-sm">
              <span className="border border-cream/20 text-cream/80 px-3 py-1 font-mono text-xs">משכנתא מעורבת</span>
              <span className="border border-cream/20 text-cream/80 px-3 py-1 font-mono text-xs">מחזור משכנתא</span>
              <span className="border border-cream/20 text-cream/80 px-3 py-1 font-mono text-xs">פירעון מוקדם</span>
              <span className="border border-cream/20 text-cream/80 px-3 py-1 font-mono text-xs">איחוד חובות</span>
              <span className="border border-cream/20 text-cream/80 px-3 py-1 font-mono text-xs">APR אמיתי</span>
            </div>
          </div>
        </div>

        {/* Featured */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-ink mb-5 flex items-center gap-2">
            <span className="text-gold">✦</span>
            הכלים המרכזיים
          </h2>
          <div className="grid md:grid-cols-2 gap-5">
            {featured.map((calc) => {
              const Icon = calc.icon;
              return (
                <Link
                  key={calc.href}
                  href={calc.href}
                  className="group block bg-paper border border-ink/15 hover:bg-paper-hover hover:border-ink/25 p-6 transition"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="border border-ink/15 p-3 bg-cream">
                      <Icon className="w-7 h-7 text-ink-mid" />
                    </div>
                    {calc.badge && (
                      <span className="bg-ink text-cream text-xs font-bold px-2.5 py-1 font-mono uppercase tracking-[0.1em]">
                        {calc.badge}
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-ink mb-2 group-hover:text-gold transition">
                    {calc.title}
                  </h3>
                  <p className="text-sm text-ink/70 mb-4 leading-relaxed">
                    {calc.description}
                  </p>
                  <ul className="space-y-1 mb-4">
                    {calc.features.map((f, i) => (
                      <li key={i} className="text-sm text-ink/60 flex items-start gap-2">
                        <span className="text-gold mt-0.5">✦</span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="flex items-center gap-2 text-gold text-sm font-medium pt-3 border-t border-ink/10">
                    <span>פתח את המחשבון</span>
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition" />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Others */}
        <section className="mb-10 bg-cream-2 border border-ink/15 p-6 md:p-8">
          <h2 className="text-2xl font-bold text-ink mb-5">
            מחשבונים נוספים
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            {others.map((calc) => {
              const Icon = calc.icon;
              return (
                <Link
                  key={calc.href}
                  href={calc.href}
                  className="group block bg-paper border border-ink/15 hover:bg-paper-hover hover:border-ink/25 p-5 transition"
                >
                  <div className="flex items-start justify-between mb-3">
                    <Icon className="w-6 h-6 text-ink-mid" />
                    {calc.badge && (
                      <span className="bg-cream border border-ink/15 text-ink text-xs font-mono uppercase tracking-[0.1em] px-2 py-0.5">
                        {calc.badge}
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-ink mb-1.5 group-hover:text-gold transition">
                    {calc.title}
                  </h3>
                  <p className="text-xs text-ink/60 mb-3 leading-relaxed">
                    {calc.description}
                  </p>
                  <ul className="space-y-0.5 mb-3">
                    {calc.features.map((f, i) => (
                      <li key={i} className="text-xs text-ink/50 flex items-start gap-1.5">
                        <span className="text-gold mt-0.5">·</span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="flex items-center gap-2 text-gold text-xs font-medium pt-2 border-t border-ink/10">
                    <span>פתח</span>
                    <ArrowLeft className="w-3 h-3" />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Editorial guide */}
        <section className="mb-10 bg-paper border border-ink/15 p-6 md:p-10">
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-gold mb-2">
            // מדריך קצר ✦ הלוואות בישראל 2026
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-ink mb-6">
            מה חשוב להבין לפני שלוקחים הלוואה
          </h2>

          <div className="space-y-8 text-ink/80 leading-relaxed max-w-3xl">
            <div>
              <h3 className="text-xl font-bold text-ink mb-3">איך מחושב ההחזר החודשי</h3>
              <p className="mb-3">
                ההחזר החודשי של רוב ההלוואות בישראל מחושב לפי לוח שפיצר: תשלום קבוע שמורכב
                מריבית ומהחזר קרן, כשבתחילת התקופה רוב התשלום הוא ריבית ורק בהמשך חלק הקרן
                גדל. שלושה משתנים קובעים את גובה ההחזר — סכום ההלוואה, הריבית ומספר החודשים.
                הארכת תקופת ההלוואה מקטינה את ההחזר החודשי, אבל מגדילה משמעותית את סך הריבית
                שתשלמו לאורך הדרך.
              </p>
              <p>
                לכן ההשוואה הנכונה בין הצעות היא לא רק &quot;כמה אשלם בחודש&quot; אלא כמה תעלה
                ההלוואה בסך הכול — כולל עמלות פתיחה ודמי ניהול. זה בדיוק מה
                ש<Link href="/savings/personal-loan" className="text-gold hover:text-gold-2 underline transition">מחשבון ההלוואה האישית</Link>{' '}
                מחשב עבורכם, כולל APR אמיתי.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-ink mb-3">ריבית הפריים — הבסיס של רוב ההלוואות</h3>
              <p className="mb-3">
                ריבית הפריים היא ריבית בנק ישראל בתוספת מרווח קבוע של{' '}
                {MACRO_DATA.primeRate.bankSpread}%. נכון ל
                {formatHebrewDate(MACRO_DATA.primeRate.lastUpdated)}, ריבית בנק ישראל עומדת על{' '}
                {MACRO_DATA.primeRate.boiBaseRate}% והפריים על {MACRO_DATA.primeRate.value}%.
                הלוואות אישיות רבות ומסלול הפריים במשכנתא נקובים כ&quot;פריים פלוס&quot; או
                &quot;פריים מינוס&quot;, כך שההחזר החודשי שלכם משתנה עם כל החלטת ריבית של בנק
                ישראל. החלטת הריבית הבאה מתוכננת ל-
                {formatHebrewDate(MACRO_DATA.primeRate.nextScheduledDecision)}.
              </p>
              <p>
                לפני שסוגרים הלוואה צמודת פריים, שווה לבדוק במחשבון מה יקרה להחזר אם הפריים
                יעלה — תרחיש שהאופטימייזר שלנו בודק אוטומטית. להגדרה מלאה של המונח, ראו{' '}
                <Link href="/glossary#prime" className="text-gold hover:text-gold-2 underline transition">ריבית פריים במילון המונחים</Link>.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-ink mb-3">מיחזור הלוואות — מתי זה משתלם</h3>
              <p className="mb-3">
                מיחזור הוא החלפת הלוואה קיימת בהלוואה חדשה בתנאים טובים יותר — ריבית נמוכה
                יותר, תקופה מתאימה יותר, או איחוד של כמה הלוואות יקרות להלוואה אחת זולה.
                המיחזור משתלם כשהחיסכון בריבית לאורך יתרת התקופה גדול מהעלויות: עמלת פירעון
                מוקדם, עמלת פתיחת תיק חדשה ועלויות נלוות.
              </p>
              <p>
                הטעות הנפוצה היא להסתכל רק על ההחזר החודשי החדש — החזר נמוך יותר שמושג על ידי
                הארכת התקופה עלול דווקא לייקר את ההלוואה. טאב המיחזור
                ב<Link href="/real-estate/mortgage" className="text-gold hover:text-gold-2 underline transition">מחשבון המשכנתא</Link>{' '}
                מחשב את נקודת האיזון ואת החיסכון האמיתי, ומחשבון{' '}
                <Link href="/savings/loan-repayment" className="text-gold hover:text-gold-2 underline transition">השוואת ההלוואות</Link>{' '}
                עושה זאת לאיחוד הלוואות צרכניות.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-ink mb-3">הלוואה מסודרת מול משיכת יתר</h3>
              <p>
                משיכת יתר (מינוס) היא בפועל הלוואה — אבל בדרך כלל היקרה ביותר שהבנק מציע,
                והריבית עליה גבוהה משמעותית מריבית על הלוואה אישית מסודרת. מי שנמצא במינוס
                כרוני משלם ריבית גבוהה על חוב שלא נסגר לעולם, בלי לוח סילוקין ובלי תאריך סיום.
                המרת המינוס להלוואה מסודרת עם החזר חודשי קבוע כמעט תמיד מוזילה את עלות החוב
                ומכריחה אותו להיסגר. אותו היגיון חל על חוב מתגלגל בכרטיס אשראי — במחשבון
                ההלוואה האישית יש השוואה ייעודית בין חוב בכרטיס אשראי להלוואה מסודרת.
              </p>
            </div>
          </div>

          <div className="text-center text-gold my-8">✦</div>

          {/* Comparison table */}
          <h3 className="text-xl font-bold text-ink mb-4">איזה מחשבון מתאים לכם?</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-ink/15">
              <thead>
                <tr className="bg-ink text-cream">
                  <th className="text-right font-mono text-xs uppercase tracking-[0.1em] px-4 py-3 border-b border-ink/15">המחשבון</th>
                  <th className="text-right font-mono text-xs uppercase tracking-[0.1em] px-4 py-3 border-b border-ink/15">מתי משתמשים</th>
                  <th className="text-right font-mono text-xs uppercase tracking-[0.1em] px-4 py-3 border-b border-ink/15">מה מקבלים</th>
                </tr>
              </thead>
              <tbody className="text-ink/80">
                <tr className="bg-paper border-b border-ink/10">
                  <td className="px-4 py-3 font-bold text-ink whitespace-nowrap">
                    <Link href="/real-estate/mortgage" className="hover:text-gold transition">מחשבון משכנתא</Link>
                  </td>
                  <td className="px-4 py-3">רכישת דירה, מיחזור או פירעון מוקדם של משכנתא</td>
                  <td className="px-4 py-3">החזר חודשי, לוח סילוקין, השוואת מסלולים ובדיקת מיחזור</td>
                </tr>
                <tr className="bg-cream-2 border-b border-ink/10">
                  <td className="px-4 py-3 font-bold text-ink whitespace-nowrap">
                    <Link href="/real-estate/mortgage-optimizer" className="hover:text-gold transition">אופטימייזר תמהיל</Link>
                  </td>
                  <td className="px-4 py-3">לפני פגישה עם יועץ או בנק — לבניית תמהיל מסלולים</td>
                  <td className="px-4 py-3">חלוקה אופטימלית בין מסלולים לפי מטרה: עלות, סיכון או החזר</td>
                </tr>
                <tr className="bg-paper border-b border-ink/10">
                  <td className="px-4 py-3 font-bold text-ink whitespace-nowrap">
                    <Link href="/savings/personal-loan" className="hover:text-gold transition">הלוואה אישית</Link>
                  </td>
                  <td className="px-4 py-3">הלוואה צרכנית, רכב, או סגירת חוב בכרטיס אשראי</td>
                  <td className="px-4 py-3">החזר חודשי, APR אמיתי כולל עמלות והשוואת מקורות מימון</td>
                </tr>
                <tr className="bg-cream-2 border-b border-ink/10">
                  <td className="px-4 py-3 font-bold text-ink whitespace-nowrap">
                    <Link href="/savings/loan-repayment" className="hover:text-gold transition">השוואת הלוואות</Link>
                  </td>
                  <td className="px-4 py-3">יש כמה הצעות ביד, או כמה הלוואות שרוצים לאחד</td>
                  <td className="px-4 py-3">דירוג הצעות לפי עלות אמיתית וחיסכון מאיחוד הלוואות</td>
                </tr>
                <tr className="bg-paper">
                  <td className="px-4 py-3 font-bold text-ink whitespace-nowrap">
                    <Link href="/tools/loan-eligibility" className="hover:text-gold transition">כושר החזר</Link>
                  </td>
                  <td className="px-4 py-3">לפני הגשת בקשה — לבדוק כמה הלוואה ריאלי לקבל</td>
                  <td className="px-4 py-3">יחס החזר להכנסה (DTI) והערכת סכום ההלוואה האפשרי</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-10">
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-gold mb-2">
            // שאלות נפוצות ✦
          </p>
          <h2 className="text-2xl font-bold text-ink mb-5">שאלות נפוצות על הלוואות</h2>
          <FAQ items={faqItems} />
        </section>

        {/* Further reading */}
        <section className="mb-10 bg-cream-2 border border-ink/15 p-6 md:p-8">
          <h2 className="text-2xl font-bold text-ink mb-5 flex items-center gap-2">
            <span className="text-gold">✦</span>
            קריאה נוספת
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            <Link
              href="/blog/ltv-mortgage-rates-secret"
              className="group block bg-paper border border-ink/15 hover:bg-paper-hover hover:border-ink/25 p-5 transition"
            >
              <p className="font-mono text-xs uppercase tracking-[0.14em] text-gold mb-2">מדריך</p>
              <h3 className="font-bold text-ink mb-2 group-hover:text-gold transition">
                יחס המימון (LTV) והסוד של ריביות המשכנתא
              </h3>
              <p className="text-sm text-ink/60 leading-relaxed">
                איך אחוז המימון שאתם מבקשים משפיע על הריבית שתקבלו מהבנק.
              </p>
            </Link>
            <Link
              href="/blog/mortgage-refinance-when-and-how"
              className="group block bg-paper border border-ink/15 hover:bg-paper-hover hover:border-ink/25 p-5 transition"
            >
              <p className="font-mono text-xs uppercase tracking-[0.14em] text-gold mb-2">מדריך</p>
              <h3 className="font-bold text-ink mb-2 group-hover:text-gold transition">
                מיחזור משכנתא — מתי ואיך
              </h3>
              <p className="text-sm text-ink/60 leading-relaxed">
                מתי מיחזור משתלם, איך מחשבים נקודת איזון ומה בודקים לפני שחותמים.
              </p>
            </Link>
            <Link
              href="/glossary#prime"
              className="group block bg-paper border border-ink/15 hover:bg-paper-hover hover:border-ink/25 p-5 transition"
            >
              <p className="font-mono text-xs uppercase tracking-[0.14em] text-gold mb-2">מילון מונחים</p>
              <h3 className="font-bold text-ink mb-2 group-hover:text-gold transition">
                ריבית פריים — הגדרה מלאה
              </h3>
              <p className="text-sm text-ink/60 leading-relaxed">
                מה זה פריים, איך הוא נקבע ולמה הוא חשוב לכל הלוואה בישראל.
              </p>
            </Link>
          </div>
        </section>

        {/* Disclaimer */}
        <div className="mb-8">
          <DisclaimerBox text="המידע בעמוד זה הוא מידע כללי בלבד ואינו מהווה ייעוץ פיננסי, ייעוץ משכנתאות או המלצה לנטילת אשראי. הריביות והנתונים מוצגים נכון לתאריך העדכון האחרון ועשויים להשתנות. לפני נטילת הלוואה יש לבדוק את התנאים המלאים מול הגוף המלווה." />
        </div>

        {/* Tips */}
        <section className="bg-paper border border-ink/15 p-6 mb-8">
          <h3 className="font-bold text-ink mb-3 flex items-center gap-2">
            <span className="text-gold">✦</span>
            איך לבחור את המחשבון הנכון?
          </h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-ink/80">
            <div className="border-b border-ink/10 pb-4 md:border-b-0 md:border-l md:border-ink/10 md:pl-4">
              <strong className="block mb-1 text-ink">🏠 רכישת דירה?</strong>
              <p className="leading-relaxed">
                התחל ב<Link href="/real-estate/mortgage-optimizer" className="text-gold hover:text-gold-2 underline transition">אופטימייזר משכנתא</Link>{' '}
                למציאת התמהיל הנכון, ואז ב<Link href="/real-estate/mortgage" className="text-gold hover:text-gold-2 underline transition">מחשבון המשכנתא</Link>{' '}
                לחישוב מפורט.
              </p>
            </div>
            <div className="border-b border-ink/10 pb-4 md:border-b-0 md:border-l md:border-ink/10 md:pl-4">
              <strong className="block mb-1 text-ink">💳 חוב בכרטיס אשראי?</strong>
              <p className="leading-relaxed">
                ב<Link href="/savings/personal-loan" className="text-gold hover:text-gold-2 underline transition">הלוואה אישית</Link>{' '}
                תוכל לחשב כמה תחסוך אם תחליף לחוב לאיחוד הלוואות בריבית נמוכה יותר.
              </p>
            </div>
            <div className="border-b border-ink/10 pb-4 md:border-b-0 md:border-l md:border-ink/10 md:pl-4">
              <strong className="block mb-1 text-ink">📊 כמה הצעות מהבנקים?</strong>
              <p className="leading-relaxed">
                <Link href="/savings/loan-repayment" className="text-gold hover:text-gold-2 underline transition">השוואת הלוואות</Link>{' '}
                מדרגת אותן לפי עלות אמיתית - כולל APR שמכלילה עמלות נסתרות.
              </p>
            </div>
            <div>
              <strong className="block mb-1 text-ink">❓ לא בטוח אם תאושר?</strong>
              <p className="leading-relaxed">
                <Link href="/tools/loan-eligibility" className="text-gold hover:text-gold-2 underline transition">כושר החזר</Link>{' '}
                בודק את ה-DTI שלך ומראה אם הבנק יאשר את הסכום הרצוי.
              </p>
            </div>
          </div>
        </section>

        {/* Cross-links */}
        <div className="text-center bg-cream-2 border border-ink/15 p-5">
          <p className="text-sm text-ink/70 mb-3">חזרה לקטגוריות אחרות:</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/real-estate"
              className="px-4 py-2 bg-paper border border-ink/20 text-sm hover:bg-paper-hover hover:border-ink/35 transition text-ink"
            >
              🏠 משכנתא ונדל&quot;ן
            </Link>
            <Link
              href="/savings"
              className="px-4 py-2 bg-paper border border-ink/20 text-sm hover:bg-paper-hover hover:border-ink/35 transition text-ink"
            >
              💰 חיסכון וחובות
            </Link>
            <Link
              href="/topics"
              className="px-4 py-2 bg-paper border border-ink/20 text-sm hover:bg-paper-hover hover:border-ink/35 transition text-ink"
            >
              📂 נושאים אחרים
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
