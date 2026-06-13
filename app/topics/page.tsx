import Link from 'next/link';
import { Metadata } from 'next';
import {
  ArrowLeft,
  Home as HomeIcon,
  TrendingUp,
  Car,
  PiggyBank,
} from 'lucide-react';
import { Breadcrumbs } from '@/components/calculator/Breadcrumbs';

export const metadata: Metadata = {
  alternates: { canonical: '/topics' },
  title: 'מחשבונים פיננסיים לכל נושא 2026 - נדל״ן, רכב, ביטוח, השקעות',
  description:
    'בדוק מחשבוני מס רכישה, מס שבח, ריבית דריבית ועוד — כלים עדכניים ל-2026 למשכנתא ונדל״ן, חיסכון והשקעות, ביטוחים ופנסיה, רכב ותחבורה. ללא הרשמה, חינם לחלוטין.',
};

interface Group {
  id: string;
  title: string;
  description: string;
  icon: typeof HomeIcon;
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
    href: '/real-estate/purchase-tax',
    label: 'מחשבון מס רכישה',
    description: 'דירה ראשונה / משקיעים / חו"ל',
    emoji: '📑',
  },
  {
    href: '/real-estate/capital-gains-tax',
    label: 'מחשבון מס שבח',
    description: 'מכירת דירה - חישוב מס',
    emoji: '💰',
  },
  {
    href: '/savings/family-budget',
    label: 'תקציב משפחתי',
    description: 'תכנון הוצאות והכנסות חודשיות',
    emoji: '👪',
  },
  {
    href: '/investments/compound-interest',
    label: 'ריבית דריבית',
    description: 'תכנון השקעות + אינפלציה',
    emoji: '📈',
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
    <div className="min-h-screen bg-cream">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Breadcrumbs items={[{ label: 'דף הבית', href: '/' }, { label: 'נושאים אחרים' }]} />
        </div>

        {/* Hero */}
        <div className="bg-ink border border-cream/15 p-6 md:p-10 text-cream mb-8">
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-gold-light mb-3">
            {'// '}נושאים פיננסיים ✦
          </p>
          <h1 className="text-3xl md:text-4xl font-bold mb-3 leading-tight">
            נושאים נוספים
          </h1>
          <p className="text-cream/70 text-base md:text-lg max-w-3xl">
            משכנתא ונדל&quot;ן, חיסכון והשקעות, ביטוחים ופנסיה, רכב ותחבורה — כל הקטגוריות הנוספות במקום אחד.
          </p>
        </div>

        {/* Popular calculators */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-ink mb-4 flex items-center gap-2">
            <PiggyBank className="w-5 h-5 text-gold" />
            <span>מחשבונים פופולריים</span>
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
            {POPULAR.map((calc) => (
              <Link
                key={calc.href}
                href={calc.href}
                className="group bg-paper border border-ink/15 hover:bg-paper-hover transition p-4 flex items-start gap-3"
              >
                <div className="text-2xl">{calc.emoji}</div>
                <div className="flex-1">
                  <h3 className="font-bold text-ink group-hover:text-gold transition">
                    {calc.label}
                  </h3>
                  <p className="text-xs text-ink/60 mt-0.5">{calc.description}</p>
                </div>
                <ArrowLeft className="w-4 h-4 text-gold opacity-0 group-hover:opacity-100 transition mt-1" />
              </Link>
            ))}
          </div>
        </section>

        {/* Groups */}
        <section className="mb-10 bg-cream-2 border border-ink/15 p-6 md:p-8">
          <h2 className="text-xl font-bold text-ink mb-4">קטגוריות</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {GROUPS.map((group) => {
              const Icon = group.icon;
              return (
                <div
                  key={group.id}
                  className="bg-paper border border-ink/15 hover:border-ink/25 transition overflow-hidden flex flex-col"
                >
                  {/* Header */}
                  <div className="bg-ink p-5 text-cream">
                    <div className="flex items-center gap-2 mb-2">
                      <Icon className="w-6 h-6 text-gold-light" />
                      <p className="font-mono text-xs uppercase tracking-[0.14em] text-gold-light">✦</p>
                    </div>
                    <h3 className="text-xl font-bold mb-1">{group.title}</h3>
                    <p className="text-sm text-cream/70">{group.description}</p>
                  </div>

                  {/* Body */}
                  <div className="p-4 flex-1">
                    <ul className="space-y-2">
                      {group.topics.map((topic) => (
                        <li key={topic.href}>
                          <Link
                            href={topic.href}
                            className="group flex items-start gap-2 p-2 hover:bg-cream transition"
                          >
                            <ArrowLeft className="w-4 h-4 text-gold mt-0.5 flex-shrink-0 opacity-50 group-hover:opacity-100 transition" />
                            <div className="flex-1">
                              <div className="font-semibold text-ink text-sm group-hover:text-gold transition">
                                {topic.label}
                              </div>
                              <div className="text-xs text-ink/60">{topic.description}</div>
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
        <div className="text-center bg-cream-2 border border-ink/15 p-5">
          <p className="text-sm text-ink/70 mb-3">חזרה לקטגוריות הראשיות:</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/salaried"
              className="px-4 py-2 bg-paper border border-ink/20 text-sm hover:bg-paper-hover hover:border-ink/35 transition text-ink"
            >
              👤 שכירים
            </Link>
            <Link
              href="/self-employed"
              className="px-4 py-2 bg-paper border border-ink/20 text-sm hover:bg-paper-hover hover:border-ink/35 transition text-ink"
            >
              💼 עצמאיים
            </Link>
            <Link
              href="/tools"
              className="px-4 py-2 bg-ink text-cream text-sm font-semibold hover:bg-ink-deep transition"
            >
              🚀 כלים לבעלי עסקים
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
