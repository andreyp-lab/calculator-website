import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'מדריכים פיננסיים מקיפים 2026 — מסים, משכנתא וזכויות עובדים',
  description:
    'מדריכי העומק של חשבונאי: כל המסים בישראל, המדריך השלם למשכנתא, והאנציקלופדיה לזכויות עובדים. מעודכנים לשנת 2026, עם קישור למחשבונים מדויקים.',
  alternates: { canonical: '/guides' },
};

const guides = [
  {
    href: '/guides/taxes-complete-guide-2026',
    title: 'כל המסים בישראל 2026 — המדריך השלם',
    description:
      'מס הכנסה, ביטוח לאומי, מע"מ, מס שבח, מס רכישה ומס על השקעות — כל מערכת המס הישראלית במדריך אחד, כולל מדרגות, תקרות ונקודות זיכוי מעודכנות.',
    icon: '🧾',
    tag: 'מיסוי',
  },
  {
    href: '/guides/mortgage-complete-guide-2026',
    title: "המדריך השלם למשכנתא בישראל 2026 — מ-א' עד ת'",
    description:
      'מסלולי משכנתא, ריביות, יחס החזר, הון עצמי, מחזור משכנתא וטעויות נפוצות — כל מה שצריך לדעת לפני שחותמים, צעד אחר צעד.',
    icon: '🏠',
    tag: 'נדל"ן',
  },
  {
    href: '/guides/employee-rights-complete-guide',
    title: 'זכויות עובדים בישראל 2026 — האנציקלופדיה המלאה',
    description:
      'פיצויי פיטורים, דמי אבטלה, דמי לידה, חופשה שנתית, הבראה, פנסיה חובה ושעות נוספות — כל הזכויות במקום אחד, עם מחשבונים לכל זכות.',
    icon: '👷',
    tag: 'עבודה',
  },
  {
    href: '/salaried/payslip-guide',
    title: 'איך קוראים תלוש שכר — המדריך המלא',
    description:
      'שורה-שורה בתלוש: ברוטו, נטו, שווי שימוש, הפרשות מעסיק, ניכויי רשות וניכויי חובה — ואיך לזהות טעויות שעולות לכם כסף.',
    icon: '📄',
    tag: 'שכירים',
  },
];

export default function GuidesPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6" aria-label="breadcrumbs">
        <Link href="/" className="hover:text-blue-600">
          דף הבית
        </Link>
        <span className="mx-2">‹</span>
        <span>מדריכים</span>
      </nav>

      <h1 className="text-3xl font-bold mb-3">מדריכים פיננסיים מקיפים</h1>
      <p className="text-gray-600 mb-8 max-w-2xl">
        מדריכי העומק שלנו מרכזים נושא שלם במקום אחד — מעודכנים לשנת 2026, כתובים בעברית
        פשוטה, ומקושרים למחשבונים מדויקים כדי שתוכלו לעבור מהבנה לחישוב בקליק.
      </p>

      <div className="grid gap-6 sm:grid-cols-2">
        {guides.map((g) => (
          <Link
            key={g.href}
            href={g.href}
            className="block rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md hover:border-blue-300"
          >
            <div className="flex items-center gap-3 mb-3">
              <span className="text-3xl" aria-hidden>
                {g.icon}
              </span>
              <span className="text-xs font-medium text-blue-700 bg-blue-50 rounded-full px-3 py-1">
                {g.tag}
              </span>
            </div>
            <h2 className="text-lg font-semibold mb-2 text-gray-900">{g.title}</h2>
            <p className="text-sm text-gray-600 leading-relaxed">{g.description}</p>
          </Link>
        ))}
      </div>

      <div className="mt-10 rounded-xl bg-gradient-to-l from-blue-50 to-emerald-50 p-6">
        <h2 className="text-lg font-semibold mb-2">מחפשים נושא ספציפי?</h2>
        <p className="text-sm text-gray-700">
          כל המחשבונים מסודרים לפי נושאים בעמוד{' '}
          <Link href="/topics" className="text-blue-700 underline hover:no-underline">
            הנושאים
          </Link>
          , ומונחים מקצועיים מוסברים ב
          <Link href="/glossary" className="text-blue-700 underline hover:no-underline">
            מילון המונחים
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
