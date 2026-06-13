import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'דף לא נמצא (404) | חשבונאי',
  description: 'הדף שחיפשת לא קיים. גלה את 30 המחשבונים הפיננסיים שלנו.',
  robots: { index: false, follow: false },
};

const popularLinks = [
  { href: '/personal-tax/salary-net-gross', label: 'מחשבון שכר נטו/ברוטו 2026' },
  { href: '/personal-tax/income-tax', label: 'מחשבון מס הכנסה לשכיר' },
  { href: '/employee-rights/severance', label: 'מחשבון פיצויי פיטורין' },
  { href: '/real-estate/mortgage-optimizer', label: 'אופטימייזר משכנתא' },
  { href: '/self-employed/year-end-tax-simulator', label: 'סימולטור מס לעצמאי' },
  { href: '/investments/compound-interest', label: 'מחשבון ריבית דריבית' },
];

export default function NotFound() {
  return (
    <div className="min-h-screen bg-paper flex items-center justify-center px-4" dir="rtl">
      <div className="max-w-lg w-full text-center">
        {/* 404 Visual */}
        <div className="text-8xl font-black text-ink/10 mb-2 select-none">404</div>

        <h1 className="text-2xl font-bold text-ink mb-3">הדף לא נמצא</h1>
        <p className="text-ink/60 mb-8">
          ייתכן שהכתובת שגויה או שהדף הוסר. אנחנו כאן כדי לעזור — בחר מהמחשבונים הפופולריים:
        </p>

        {/* Popular calculators */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8 text-right">
          {popularLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block border border-ink/15 rounded-none px-4 py-3 text-sm font-medium text-gold hover:border-ink/30 hover:bg-cream-2 transition"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Back to home */}
        <Link
          href="/"
          className="inline-block bg-ink text-cream px-8 py-3 rounded-none font-bold hover:bg-ink-deep transition"
        >
          חזרה לדף הבית ←
        </Link>
      </div>
    </div>
  );
}
