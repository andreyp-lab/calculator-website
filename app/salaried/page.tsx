import Link from 'next/link';
import { Metadata } from 'next';
import {
  ArrowLeft,
  Calculator,
  Receipt,
  Heart,
  TrendingUp,
  Calendar,
  Baby,
  Briefcase,
  Shield,
  Award,
  DollarSign,
  Banknote,
} from 'lucide-react';
import { Breadcrumbs } from '@/components/calculator/Breadcrumbs';

export const metadata: Metadata = {
  alternates: { canonical: '/salaried' },
  title: 'שכירים - מחשבונים והחזר מס',
  description:
    'מרכז מקיף לעובדים שכירים בישראל: החזר מס, מחשבון נטו/ברוטו, פיצויי פיטורין, דמי הבראה, דמי לידה, מילואים, אבטלה ועוד. כל הזכויות שלך במקום אחד.',
  keywords: [
    'שכירים',
    'החזר מס',
    'נטו ברוטו',
    'פיצויי פיטורין',
    'דמי הבראה',
    'דמי לידה',
    'תגמולי מילואים',
    'דמי אבטלה',
    'דמי מחלה',
    'חופשה שנתית',
  ],
};

interface Calc {
  title: string;
  description: string;
  href: string;
  icon: typeof Calculator;
  highlight?: boolean;
  badge?: string;
}

const TAX_AND_SALARY: Calc[] = [
  {
    title: '🌟 החזר מס',
    description:
      'בדוק כמה מס מגיע לך בחזרה — תרומות, פנסיה, פריפריה, נסיעות, הוצאות מוכרות. ממוצע: ₪3,500 לשנה.',
    href: '/personal-tax/tax-refund',
    icon: Receipt,
    highlight: true,
    badge: '⭐ הכי מבוקש',
  },
  {
    title: 'שכר נטו / ברוטו',
    description: 'המרה בין נטו לברוטו עם נקודות זיכוי, ביטוח לאומי, מס בריאות ומס הכנסה.',
    href: '/personal-tax/salary-net-gross',
    icon: Banknote,
  },
  {
    title: 'מחשבון מס הכנסה',
    description: 'חישוב מס הכנסה מדויק לפי מדרגות 2026 כולל נקודות זיכוי וב.ל.',
    href: '/personal-tax/income-tax',
    icon: Calculator,
  },
  {
    title: 'נקודות זיכוי',
    description: 'בדוק כמה נקודות זיכוי מגיעות לך לפי מצב משפחתי, ילדים, עולה חדש ועוד.',
    href: '/personal-tax/tax-credits',
    icon: Award,
  },
  {
    title: 'מה שווה לי לעבוד?',
    description: 'השוואה: שכר vs דמי לידה / אבטלה / קצבה — שווי אמיתי של חודש עבודה.',
    href: '/personal-tax/work-value',
    icon: TrendingUp,
  },
  {
    title: '📘 איך קוראים תלוש משכורת',
    description: 'מדריך מלא לתלוש 2026: ברוטו מול נטו, ניכויי חובה, נקודות זיכוי, הפרשות מעסיק ומה לבדוק.',
    href: '/salaried/payslip-guide',
    icon: Receipt,
  },
];

const RIGHTS: Calc[] = [
  {
    title: 'פיצויי פיטורין',
    description: 'חישוב פיצויים לפי חוק פיצויי פיטורים — שכר אחרון × שנות ותק.',
    href: '/employee-rights/severance',
    icon: Shield,
  },
  {
    title: 'דמי הבראה',
    description: 'חישוב דמי הבראה לפי שנות ותק (תעריף 2026: ₪418/יום במגזר הפרטי).',
    href: '/employee-rights/recreation-pay',
    icon: Heart,
  },
  {
    title: 'דמי לידה',
    description: 'גובה דמי לידה מהביטוח הלאומי + הארכות לתאומים, לידה מוקדמת ועוד.',
    href: '/employee-rights/maternity-benefits',
    icon: Baby,
  },
  {
    title: 'דמי אבטלה',
    description: 'חישוב גובה דמי אבטלה ותקופת זכאות לפי גיל, ותק ושכר.',
    href: '/employee-rights/unemployment-benefits',
    icon: Briefcase,
  },
  {
    title: 'תגמולי מילואים',
    description: 'תשלום בסיסי + מענקי חרבות ברזל (₪280/יום נוספים).',
    href: '/employee-rights/reserve-duty-pay',
    icon: Award,
  },
  {
    title: 'דמי מחלה',
    description: 'חישוב תשלום ימי מחלה לפי חוק (50%/75%/100%).',
    href: '/employee-rights/sick-pay',
    icon: Heart,
  },
  {
    title: 'חופשה שנתית',
    description: 'כמה ימי חופשה מגיעים לך לפי שנות ותק ויום עבודה בשבוע.',
    href: '/employee-rights/annual-leave',
    icon: Calendar,
  },
  {
    title: 'מענק עבודה (Work Grant)',
    description: 'בדיקת זכאות למענק עבודה ממ"ה — לבעלי שכר נמוך וילדים.',
    href: '/employee-rights/work-grant',
    icon: Award,
  },
  {
    title: 'מענק שנתי / בונוס',
    description: 'חישוב מס על מענק (חד-פעמי) — איך הוא מתחלק ומה ייקבע מהמס.',
    href: '/employee-rights/annual-bonus',
    icon: DollarSign,
  },
  {
    title: 'שכר מינימום',
    description: 'בדיקה אם השכר שלך עומד בשכר מינימום (מ-1.4.2026: ₪6,443.85/חודש).',
    href: '/employee-rights/minimum-wage',
    icon: Shield,
  },
];

const COMPARE: Calc[] = [
  {
    title: 'שכיר vs עצמאי',
    description: 'השוואה מקיפה: כמה אקבל ביד כל חודש בכל מסלול — כולל פנסיה, ב"ל ומס.',
    href: '/compare/employee-vs-self-employed',
    icon: TrendingUp,
  },
];

export default function SalariedPage() {
  return (
    <div className="min-h-screen bg-cream">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Breadcrumbs
            items={[{ label: 'דף הבית', href: '/' }, { label: 'שכירים' }]}
          />
        </div>

        {/* Hero */}
        <div className="bg-ink-deep border border-cream/15 p-6 md:p-10 text-cream mb-8 relative overflow-hidden">
          <div className="relative z-10">
            <p className="font-mono text-xs uppercase tracking-[0.14em] text-gold-light mb-3">
              // מרכז שכירים ✦
            </p>
            <h1 className="text-3xl md:text-4xl font-bold mb-3 leading-tight">
              כל המחשבונים שעובד שכיר זקוק להם
              <br />
              <span className="text-gold-light italic font-normal font-serif">
                במקום אחד
              </span>
            </h1>
            <p className="text-cream/70 text-base md:text-lg mb-5 max-w-3xl">
              החזר מס, נטו/ברוטו, פיצויים, דמי הבראה, דמי לידה, מילואים, אבטלה ועוד —{' '}
              <strong className="text-cream">{TAX_AND_SALARY.length + RIGHTS.length} כלים</strong>{' '}
              לפי החקיקה העדכנית 2026.
            </p>
            <Link
              href="/personal-tax/tax-refund"
              className="inline-flex items-center gap-2 bg-gold text-paper px-8 py-3.5 hover:bg-gold-2 transition font-bold"
            >
              <Receipt className="w-5 h-5" />
              <span>בדוק החזר מס שלך — חינם</span>
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* TAX & SALARY Section */}
        <section className="mb-10">
          <div className="flex items-center gap-3 mb-5">
            <div className="border border-ink/15 p-2 bg-paper">
              <Receipt className="w-6 h-6 text-ink-mid" />
            </div>
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.14em] text-gold">// מיסוי ושכר</p>
              <h2 className="text-2xl font-bold text-ink">החזר מס, חישוב נטו/ברוטו, נקודות זיכוי</h2>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {TAX_AND_SALARY.map((calc) => (
              <CalcCard key={calc.href} calc={calc} />
            ))}
          </div>
        </section>

        {/* RIGHTS Section */}
        <section className="mb-10 bg-cream-2 border border-ink/15 p-6 md:p-8">
          <div className="flex items-center gap-3 mb-5">
            <div className="border border-ink/15 p-2 bg-paper">
              <Shield className="w-6 h-6 text-ink-mid" />
            </div>
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.14em] text-gold">// זכויות עובד</p>
              <h2 className="text-2xl font-bold text-ink">פיצויי פיטורין, הבראה, חופשה, מחלה, דמי לידה, מילואים, אבטלה</h2>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {RIGHTS.map((calc) => (
              <CalcCard key={calc.href} calc={calc} />
            ))}
          </div>
        </section>

        {/* COMPARE */}
        <section className="mb-10">
          <div className="flex items-center gap-3 mb-5">
            <div className="border border-ink/15 p-2 bg-paper">
              <TrendingUp className="w-6 h-6 text-ink-mid" />
            </div>
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.14em] text-gold">// השוואות</p>
              <h2 className="text-2xl font-bold text-ink">השוואה בין מסלולי תעסוקה</h2>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {COMPARE.map((calc) => (
              <CalcCard key={calc.href} calc={calc} />
            ))}
          </div>
        </section>

        {/* Why this section */}
        <div className="bg-paper border border-ink/15 p-6 mb-8">
          <h3 className="font-bold text-ink mb-3 flex items-center gap-2">
            <span className="text-gold">✦</span>
            למה כדאי להשתמש?
          </h3>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div className="border-r border-ink/10 pl-4 last:border-r-0">
              <strong className="text-ink">💰 כסף מגיע לך</strong>
              <p className="text-ink/70 mt-1">
                לפי רשות המסים, רק כ-50% מהזכאים מגישים החזר מס — בממוצע ₪3,500 לשנה. אתה משאיר כסף על השולחן.
              </p>
            </div>
            <div className="border-r border-ink/10 pl-4 last:border-r-0">
              <strong className="text-ink">⚖️ זכויות מלאות</strong>
              <p className="text-ink/70 mt-1">
                המעסיק לא תמיד מחשב נכון פיצויים, דמי הבראה או חופשה. בדוק בעצמך לפני שאתה חותם.
              </p>
            </div>
            <div>
              <strong className="text-ink">📊 תכנון פיננסי</strong>
              <p className="text-ink/70 mt-1">
                להבין מה אתה מקבל ביד מאפשר לך לתכנן: חיסכון, הוצאות, הלוואות. ידע = כוח.
              </p>
            </div>
          </div>
        </div>

        {/* Other categories */}
        <div className="text-center bg-cream-2 border border-ink/15 p-5">
          <p className="text-sm text-ink/70 mb-2">לא שכיר? יש לי גם:</p>
          <div className="flex flex-wrap justify-center gap-2 text-sm">
            <Link href="/self-employed" className="text-gold hover:text-gold-2 transition">
              💼 עצמאיים
            </Link>
            <span className="text-ink/30">•</span>
            <Link href="/real-estate" className="text-gold hover:text-gold-2 transition">
              🏠 משכנתא ונדל&quot;ן
            </Link>
            <span className="text-ink/30">•</span>
            <Link href="/savings" className="text-gold hover:text-gold-2 transition">
              💳 חיסכון והשקעות
            </Link>
            <span className="text-ink/30">•</span>
            <Link href="/vehicles" className="text-gold hover:text-gold-2 transition">
              🚗 רכב
            </Link>
            <span className="text-ink/30">•</span>
            <Link href="/tools" className="text-gold hover:text-gold-2 transition">
              🚀 כלים לבעלי עסקים
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function CalcCard({ calc }: { calc: Calc }) {
  const Icon = calc.icon;

  if (calc.highlight) {
    return (
      <Link
        href={calc.href}
        className="md:col-span-2 lg:col-span-3 group bg-ink border border-cream/15 hover:bg-ink-deep transition p-1"
      >
        <div className="bg-paper border border-ink/10 p-5 h-full">
          <div className="flex items-start gap-4">
            <div className="border border-ink/15 p-3 bg-cream flex-shrink-0">
              <Icon className="w-6 h-6 text-gold" />
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between gap-2 mb-1">
                <h3 className="font-bold text-lg text-ink group-hover:text-gold transition">
                  {calc.title}
                </h3>
                {calc.badge && (
                  <span className="bg-gold text-paper text-xs font-bold px-2 py-0.5 font-mono uppercase tracking-[0.1em]">
                    {calc.badge}
                  </span>
                )}
              </div>
              <p className="text-sm text-ink/70 leading-relaxed">{calc.description}</p>
              <div className="mt-3 inline-flex items-center gap-1 text-gold group-hover:text-gold-2 font-semibold text-sm transition">
                <span>בדוק עכשיו</span>
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition" />
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={calc.href}
      className="group bg-paper border border-ink/15 hover:bg-paper-hover transition p-5 flex flex-col gap-3"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="border border-ink/15 p-2 bg-cream">
          <Icon className="w-5 h-5 text-ink-mid" />
        </div>
        <ArrowLeft className="w-4 h-4 text-gold opacity-0 group-hover:opacity-100 transition" />
      </div>
      <div className="flex-1">
        <h3 className="font-bold text-ink mb-1 group-hover:text-gold transition text-base">
          {calc.title}
        </h3>
        <p className="text-sm text-ink/60 leading-relaxed">{calc.description}</p>
      </div>
    </Link>
  );
}
