import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'דפי השוואה - שכיר vs עצמאי, שכירות vs קנייה | FinCalc',
  description:
    'דפי השוואה מקיפים לקבלת החלטות פיננסיות גדולות: שכיר מול עצמאי, שכירות מול קנייה, ליסינג מול קנייה.',
};

const COMPARISONS = [
  {
    href: '/compare/employee-vs-self-employed',
    title: 'שכיר vs עצמאי',
    icon: '👔',
    description: 'איזה מסלול תעסוקה משתלם יותר עבורך? השוואה מלאה כולל מס, ב.ל., יציבות, הטבות והון אנושי.',
    color: 'from-blue-500 to-blue-700',
  },
  {
    href: '/compare/rent-vs-buy',
    title: 'שכירות vs קנייה',
    icon: '🏠',
    description: 'לקנות דירה או לשכור? השוואה מתמטית של עלויות לטווח ארוך כולל משכנתא, ארנונה, ועלייה בשווי.',
    color: 'from-emerald-500 to-emerald-700',
  },
  {
    href: '/compare/leasing-vs-buying-comparison',
    title: 'ליסינג vs קנייה (רכב)',
    icon: '🚗',
    description: 'איזה אופן רכישת רכב משתלם יותר? ליסינג, מימון או רכישה מלאה.',
    color: 'from-orange-500 to-orange-700',
  },
];

export default function ComparePage() {
  return (
    <div>
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
          ⚖️ דפי השוואה - החלטות פיננסיות גדולות
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          השוואות מתמטיות מפורטות שעוזרות לקבל החלטות פיננסיות נכונות. כל השוואה כוללת מחשבון, נתונים אמיתיים, וניתוח רב-גורמי.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {COMPARISONS.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className="group bg-white rounded-xl border-2 border-gray-200 hover:border-blue-400 hover:shadow-xl transition-all overflow-hidden"
          >
            <div className={`bg-gradient-to-br ${c.color} p-6 text-white`}>
              <div className="text-4xl mb-2">{c.icon}</div>
              <h3 className="text-xl font-bold mb-1">{c.title}</h3>
              <p className="text-sm opacity-90">{c.description}</p>
            </div>
            <div className="p-4 text-blue-600 group-hover:text-blue-800 flex justify-between items-center">
              <span className="font-medium">פתח השוואה</span>
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
