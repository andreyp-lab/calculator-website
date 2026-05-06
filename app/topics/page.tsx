import Link from 'next/link';
import { Metadata } from 'next';
import {
  ArrowLeft,
  Home as HomeIcon,
  TrendingUp,
  Car,
  Shield,
  PiggyBank,
} from 'lucide-react';
import { Breadcrumbs } from '@/components/calculator/Breadcrumbs';

export const metadata: Metadata = {
  title: 'נושאים נוספים - כל המחשבונים | FinCalc',
  description:
    'משכנתא ונדל"ן, חיסכון והשקעות, ביטוחים, רכב — כל הקטגוריות הנוספות במחשבונים פיננסיים בישראל.',
};

interface Group {
  id: string;
  title: string;
  description: string;
  icon: typeof HomeIcon;
  gradient: string;
  topics: Array<{
    href: string;
    label: string;
    description: string;
    count?: number;
  }>;
}

const GROUPS: Group[] = [
  {
    id: 'real-estate',
    title: 'משכנתא ונדל"ן',
    description: 'מחשבוני משכנתא, מס רכישה, מס שבח, רווחי הון מנכסים',
    icon: HomeIcon,
    gradient: 'from-blue-500 to-indigo-700',
    topics: [
      {
        href: '/real-estate',
        label: 'מרכז משכנתא ונדל"ן',
        description: 'משכנתא, מס רכישה, מס שבח, רווחי הון',
      },
    ],
  },
  {
    id: 'savings-investments',
    title: 'חיסכון, השקעות ופנסיה',
    description: 'חיסכון לטווח ארוך, השקעות, ריבית דריבית, תכנון פרישה',
    icon: TrendingUp,
    gradient: 'from-emerald-500 to-teal-700',
    topics: [
      {
        href: '/savings',
        label: 'חיסכון וחובות',
        description: 'תקציב משפחתי, החזרי הלוואה, חיסכון לטווח קצר',
      },
      {
        href: '/investments',
        label: 'השקעות',
        description: 'ריבית דריבית, ROI, תיק השקעות, תכנון פרישה',
      },
      {
        href: '/insurance',
        label: 'ביטוחים ופנסיה',
        description: 'פנסיה צפויה, ביטוח חיים, קרן השתלמות',
      },
    ],
  },
  {
    id: 'vehicles',
    title: 'רכב ותחבורה',
    description: 'עלות דלק, ליסינג מול קנייה, שווי שימוש ברכב',
    icon: Car,
    gradient: 'from-orange-500 to-red-700',
    topics: [
      {
        href: '/vehicles',
        label: 'מרכז רכב ותחבורה',
        description: 'דלק, ליסינג, מס שימוש, עלות בעלות',
      },
    ],
  },
];

const POPULAR: Array<{ href: string; label: string; description: string; emoji: string }> = [
  {
    href: '/real-estate/mortgage',
    label: 'מחשבון משכנתא',
    description: 'תכנון תשלומים והחזר שנתי',
    emoji: '🏠',
  },
  {
    href: '/real-estate/purchase-tax',
    label: 'מחשבון מס רכישה',
    description: 'דירה ראשונה / משקיעים / חו"ל',
    emoji: '📑',
  },
  {
    href: '/savings/family-budget',
    label: 'תקציב משפחתי',
    description: 'תכנון הוצאות והכנסות חודשיות',
    emoji: '👪',
  },
  {
    href: '/savings/loan-repayment',
    label: 'מחשבון החזרי הלוואה',
    description: 'תכנון תשלומים ופירעון מוקדם',
    emoji: '🏦',
  },
  {
    href: '/vehicles/leasing-vs-buying',
    label: 'ליסינג vs קנייה',
    description: 'איזו אופציה משתלמת יותר?',
    emoji: '🚗',
  },
  {
    href: '/vehicles/fuel-cost',
    label: 'מחשבון עלות דלק',
    description: 'עלות חודשית/שנתית של דלק',
    emoji: '⛽',
  },
];

export default function TopicsPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Breadcrumbs items={[{ label: 'דף הבית', href: '/' }, { label: 'נושאים אחרים' }]} />
        </div>

        {/* Hero */}
        <div className="bg-gradient-to-br from-slate-700 to-slate-900 rounded-2xl p-6 md:p-10 text-white mb-8 relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                'radial-gradient(circle at 30% 70%, white 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }}
          />
          <div className="relative z-10">
            <h1 className="text-3xl md:text-4xl font-extrabold mb-3 leading-tight">
              נושאים נוספים
            </h1>
            <p className="text-slate-200 text-base md:text-lg max-w-3xl">
              משכנתא ונדל"ן, חיסכון והשקעות, ביטוחים ופנסיה, רכב ותחבורה — כל הקטגוריות הנוספות במקום אחד.
            </p>
          </div>
        </div>

        {/* Popular calculators */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <PiggyBank className="w-5 h-5 text-emerald-600" />
            מחשבונים פופולריים
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
            {POPULAR.map((calc) => (
              <Link
                key={calc.href}
                href={calc.href}
                className="group bg-white p-4 rounded-xl border-2 border-gray-200 hover:border-blue-400 hover:shadow-md transition flex items-start gap-3"
              >
                <div className="text-2xl">{calc.emoji}</div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition">
                    {calc.label}
                  </h3>
                  <p className="text-xs text-gray-600 mt-0.5">{calc.description}</p>
                </div>
                <ArrowLeft className="w-4 h-4 text-blue-600 opacity-0 group-hover:opacity-100 transition mt-1" />
              </Link>
            ))}
          </div>
        </section>

        {/* Groups */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-4">קטגוריות</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {GROUPS.map((group) => {
              const Icon = group.icon;
              return (
                <div
                  key={group.id}
                  className="bg-white rounded-2xl border-2 border-gray-200 hover:border-blue-300 hover:shadow-lg transition overflow-hidden flex flex-col"
                >
                  {/* Header */}
                  <div className={`bg-gradient-to-br ${group.gradient} p-5 text-white`}>
                    <div className="flex items-center gap-2 mb-2">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold mb-1">{group.title}</h3>
                    <p className="text-sm opacity-90">{group.description}</p>
                  </div>

                  {/* Body */}
                  <div className="p-4 flex-1">
                    <ul className="space-y-2">
                      {group.topics.map((topic) => (
                        <li key={topic.href}>
                          <Link
                            href={topic.href}
                            className="group flex items-start gap-2 p-2 rounded hover:bg-blue-50 transition"
                          >
                            <ArrowLeft className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0 opacity-50 group-hover:opacity-100 transition" />
                            <div className="flex-1">
                              <div className="font-semibold text-gray-900 text-sm group-hover:text-blue-600 transition">
                                {topic.label}
                              </div>
                              <div className="text-xs text-gray-600">{topic.description}</div>
                            </div>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Cross-links */}
        <div className="text-center bg-gray-50 rounded-xl p-5 border border-gray-200">
          <p className="text-sm text-gray-700 mb-3">חזרה לקטגוריות הראשיות:</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/salaried"
              className="px-4 py-2 bg-white border border-blue-300 rounded-lg text-sm hover:bg-blue-50 hover:border-blue-500 transition"
            >
              👤 שכירים
            </Link>
            <Link
              href="/self-employed"
              className="px-4 py-2 bg-white border border-blue-300 rounded-lg text-sm hover:bg-blue-50 hover:border-blue-500 transition"
            >
              💼 עצמאיים
            </Link>
            <Link
              href="/tools"
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg text-sm font-semibold hover:shadow-md transition"
            >
              🚀 כלים לבעלי עסקים
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
