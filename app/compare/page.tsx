import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  alternates: { canonical: '/compare' },
  title: 'השוואות פיננסיות 2026 - שכיר vs עצמאי, שכירות vs קנייה',
  description:
    'דפי השוואה מקיפים לקבלת החלטות פיננסיות גדולות. השווה שכיר מול עצמאי, שכירות מול קנייה ועוד — עם מחשבונים מדויקים לפי נתוני 2026. השתמש עכשיו בחינם.',
};

const COMPARISONS = [
  {
    href: '/compare/employee-vs-self-employed',
    title: 'שכיר vs עצמאי',
    icon: '👔',
    description: 'איזה מסלול תעסוקה משתלם יותר עבורך? השוואה מלאה כולל מס, ב.ל., יציבות, הטבות והון אנושי.',
    color: 'bg-ink',
  },
  {
    href: '/compare/rent-vs-buy',
    title: 'שכירות vs קנייה',
    icon: '🏠',
    description: 'לקנות דירה או לשכור? השוואה מתמטית של עלויות לטווח ארוך כולל משכנתא, ארנונה, ועלייה בשווי.',
    color: 'bg-ink-deep',
  },
  {
    href: '/vehicles/leasing-vs-buying',
    title: 'ליסינג vs קנייה (רכב)',
    icon: '🚗',
    description: 'איזה אופן רכישת רכב משתלם יותר? ליסינג, מימון או רכישה מלאה.',
    color: 'bg-ink',
  },
];

export default function ComparePage() {
  return (
    <div>
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-ink mb-3">
          ⚖️ דפי השוואה - החלטות פיננסיות גדולות
        </h1>
        <p className="text-lg text-ink/70 max-w-3xl mx-auto">
          השוואות מתמטיות מפורטות שעוזרות לקבל החלטות פיננסיות נכונות. כל השוואה כוללת מחשבון, נתונים אמיתיים, וניתוח רב-גורמי.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {COMPARISONS.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className="group bg-paper border-2 border-ink/15 hover:border-ink/30 hover:shadow-xl transition-all overflow-hidden"
          >
            <div className={`${c.color} p-6 text-cream`}>
              <div className="text-4xl mb-2">{c.icon}</div>
              <h3 className="text-xl font-bold mb-1">{c.title}</h3>
              <p className="text-sm opacity-90">{c.description}</p>
            </div>
            <div className="p-4 text-gold hover:text-ink flex justify-between items-center">
              <span className="font-medium">פתח השוואה</span>
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
