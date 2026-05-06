import Link from 'next/link';
import { Metadata } from 'next';
import {
  ArrowLeft,
  Calculator,
  Sparkles,
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
  title: 'שכירים - מחשבונים והחזר מס | FinCalc',
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
    description: 'בדיקה אם השכר שלך עומד בשכר מינימום (2026: ₪6,247/חודש).',
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
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Breadcrumbs
            items={[{ label: 'דף הבית', href: '/' }, { label: 'שכירים' }]}
          />
        </div>

        {/* Hero */}
        <div className="bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-700 rounded-2xl p-6 md:p-10 text-white mb-8 relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                'radial-gradient(circle at 30% 70%, white 1px, transparent 1px), radial-gradient(circle at 70% 30%, white 1px, transparent 1px)',
              backgroundSize: '50px 50px',
            }}
          />
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur px-3 py-1 rounded-full text-sm font-medium mb-3">
              <Sparkles className="w-4 h-4" />
              מרכז שכירים
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold mb-3 leading-tight">
              כל המחשבונים שעובד שכיר זקוק להם
              <br />
              <span className="bg-gradient-to-r from-amber-300 to-yellow-200 bg-clip-text text-transparent">
                במקום אחד
              </span>
            </h1>
            <p className="text-blue-100 text-base md:text-lg mb-5 max-w-3xl">
              החזר מס, נטו/ברוטו, פיצויים, דמי הבראה, דמי לידה, מילואים, אבטלה ועוד —{' '}
              <strong className="text-white">{TAX_AND_SALARY.length + RIGHTS.length} כלים</strong>{' '}
              לפי החקיקה העדכנית 2026.
            </p>
            <Link
              href="/personal-tax/tax-refund"
              className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-gray-900 px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
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
            <div className="bg-blue-100 p-2 rounded-lg">
              <Receipt className="w-6 h-6 text-blue-700" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">מיסוי ושכר</h2>
              <p className="text-sm text-gray-600">
                החזר מס, חישוב נטו/ברוטו, נקודות זיכוי
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {TAX_AND_SALARY.map((calc) => (
              <CalcCard key={calc.href} calc={calc} />
            ))}
          </div>
        </section>

        {/* RIGHTS Section */}
        <section className="mb-10">
          <div className="flex items-center gap-3 mb-5">
            <div className="bg-emerald-100 p-2 rounded-lg">
              <Shield className="w-6 h-6 text-emerald-700" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">זכויות עובד</h2>
              <p className="text-sm text-gray-600">
                פיצויי פיטורין, הבראה, חופשה, מחלה, דמי לידה, מילואים, אבטלה
              </p>
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
            <div className="bg-purple-100 p-2 rounded-lg">
              <TrendingUp className="w-6 h-6 text-purple-700" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">השוואות</h2>
              <p className="text-sm text-gray-600">השוואה בין מסלולי תעסוקה</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {COMPARE.map((calc) => (
              <CalcCard key={calc.href} calc={calc} />
            ))}
          </div>
        </section>

        {/* Why this section */}
        <div className="bg-gradient-to-br from-gray-50 to-blue-50 border-2 border-blue-200 rounded-2xl p-6 mb-8">
          <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-600" />
            למה כדאי להשתמש?
          </h3>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div>
              <strong className="text-gray-900">💰 כסף מגיע לך</strong>
              <p className="text-gray-700 mt-1">
                לפי רשות המסים, רק כ-50% מהזכאים מגישים החזר מס — בממוצע ₪3,500 לשנה. אתה משאיר כסף על השולחן.
              </p>
            </div>
            <div>
              <strong className="text-gray-900">⚖️ זכויות מלאות</strong>
              <p className="text-gray-700 mt-1">
                המעסיק לא תמיד מחשב נכון פיצויים, דמי הבראה או חופשה. בדוק בעצמך לפני שאתה חותם.
              </p>
            </div>
            <div>
              <strong className="text-gray-900">📊 תכנון פיננסי</strong>
              <p className="text-gray-700 mt-1">
                להבין מה אתה מקבל ביד מאפשר לך לתכנן: חיסכון, הוצאות, הלוואות. ידע = כוח.
              </p>
            </div>
          </div>
        </div>

        {/* Other categories */}
        <div className="text-center bg-gray-50 rounded-xl p-5 border border-gray-200">
          <p className="text-sm text-gray-700 mb-2">לא שכיר? יש לי גם:</p>
          <div className="flex flex-wrap justify-center gap-2 text-sm">
            <Link href="/self-employed" className="text-blue-600 hover:underline">
              💼 עצמאיים
            </Link>
            <span className="text-gray-400">•</span>
            <Link href="/real-estate" className="text-blue-600 hover:underline">
              🏠 משכנתא ונדל"ן
            </Link>
            <span className="text-gray-400">•</span>
            <Link href="/savings" className="text-blue-600 hover:underline">
              💳 חיסכון והשקעות
            </Link>
            <span className="text-gray-400">•</span>
            <Link href="/vehicles" className="text-blue-600 hover:underline">
              🚗 רכב
            </Link>
            <span className="text-gray-400">•</span>
            <Link href="/tools" className="text-blue-600 hover:underline">
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
        className="md:col-span-2 lg:col-span-3 group bg-gradient-to-br from-amber-400 via-orange-400 to-pink-500 p-1 rounded-xl hover:shadow-2xl transition-all"
      >
        <div className="bg-white rounded-lg p-5 h-full">
          <div className="flex items-start gap-4">
            <div className="bg-amber-100 p-3 rounded-xl flex-shrink-0">
              <Icon className="w-6 h-6 text-amber-700" />
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between gap-2 mb-1">
                <h3 className="font-bold text-lg text-gray-900 group-hover:text-amber-700 transition">
                  {calc.title}
                </h3>
                {calc.badge && (
                  <span className="bg-amber-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {calc.badge}
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">{calc.description}</p>
              <div className="mt-3 inline-flex items-center gap-1 text-amber-700 group-hover:text-amber-900 font-semibold text-sm">
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
      className="group bg-white p-5 rounded-xl border-2 border-gray-200 hover:border-blue-400 hover:shadow-md transition flex flex-col gap-3"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="bg-blue-50 p-2 rounded-lg">
          <Icon className="w-5 h-5 text-blue-600" />
        </div>
        <ArrowLeft className="w-4 h-4 text-blue-600 opacity-0 group-hover:opacity-100 transition" />
      </div>
      <div className="flex-1">
        <h3 className="font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition text-base">
          {calc.title}
        </h3>
        <p className="text-sm text-gray-600 leading-relaxed">{calc.description}</p>
      </div>
    </Link>
  );
}
