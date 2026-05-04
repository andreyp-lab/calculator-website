import Link from 'next/link';
import { Metadata } from 'next';
import { ArrowLeft, BookOpen } from 'lucide-react';
import { Breadcrumbs } from '@/components/calculator/Breadcrumbs';

export const metadata: Metadata = {
  title: 'בלוג FinCalc - מאמרי עומק על מיסוי וכלכלה אישית 2026',
  description:
    'מאמרים מקצועיים מקיפים על מס הכנסה, החזרי מס, פיצויי פיטורין, חברה בע"מ vs עוסק, מע"מ, זכויות עובדים והפחתת מס - מעודכן 2026.',
};

const posts = [
  {
    slug: 'tax-refund-complete-guide-2026',
    title: 'המדריך השלם להחזר מס לשכירים 2026',
    description:
      'כל מה שצריך לדעת כדי לקבל את החזר המס המקסימלי שמגיע לך - 12 סיבות לזכאות, איך מגישים, ומה החשוב לדעת. כולל דוגמאות מספריות.',
    category: 'מיסוי אישי',
    readTime: '15 דקות',
    date: '2026-05-04',
    featured: true,
  },
  {
    slug: 'company-vs-self-employed-ultimate-guide',
    title: 'חברה בע"מ או עוסק מורשה - המדריך הסופי 2026',
    description:
      'ההחלטה שכל פרילנסר ובעל עסק חייב להבין. ניתוח מקיף של המסים, ההטבות והעלויות בכל מסלול.',
    category: 'עצמאיים',
    readTime: '18 דקות',
    date: '2026-05-04',
    featured: true,
  },
  {
    slug: 'vat-complete-guide-israel',
    title: 'מע"מ בישראל - המדריך השלם לעוסק 2026',
    description:
      'כל מה שעוסק חייב לדעת על מע"מ - 18%, חשבוניות, דיווח, החזרים, ופטורים. כולל דוגמאות מעשיות.',
    category: 'עצמאיים',
    readTime: '12 דקות',
    date: '2026-05-04',
    featured: true,
  },
  {
    slug: 'employee-rights-israel-2026',
    title: 'זכויות עובדים בישראל 2026 - המדריך המלא',
    description:
      'פיצויים, דמי הבראה, חופשה, מחלה, לידה, מילואים. כל הזכויות לפי החוק עם דוגמאות חישוב.',
    category: 'זכויות עובדים',
    readTime: '20 דקות',
    date: '2026-05-04',
    featured: true,
  },
  {
    slug: 'tax-reduction-25-legal-ways',
    title: 'איך להפחית מס באופן חוקי - 25 דרכים מוכחות 2026',
    description:
      'אסטרטגיות להפחתת מס לשכירים, עצמאיים ובעלי עסקים - הפקדות מוטבות, הוצאות מוכרות, פטורים, ועוד. עם דוגמאות מספריות.',
    category: 'מיסוי אישי',
    readTime: '25 דקות',
    date: '2026-05-04',
    featured: true,
  },
  {
    slug: 'tax-changes-2026',
    title: 'מה השתנה במדרגות מס הכנסה ב-2026? המדריך המלא',
    description:
      'סקירה מקיפה של השינויים במדרגות המס לשנת 2026 והשפעתם על השכר נטו.',
    category: 'מיסוי אישי',
    readTime: '8 דקות',
    date: '2026-05-01',
    featured: false,
  },
];

export default function BlogPage() {
  const featuredPosts = posts.filter((p) => p.featured);
  const regularPosts = posts.filter((p) => !p.featured);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Breadcrumbs items={[{ label: 'דף הבית', href: '/' }, { label: 'בלוג' }]} />
        </div>

        <div className="mb-12 text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-3">
            📚 בלוג פיננסי
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            מאמרי עומק מקצועיים על מיסוי, זכויות עובדים, וכלכלה אישית.
            כל מאמר נכתב במיוחד עבור הצרכים של עובדים, עצמאיים ובעלי עסקים בישראל.
          </p>
        </div>

        {featuredPosts.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-blue-600" />
              מאמרי עוגן
            </h2>
            <div className="grid md:grid-cols-2 gap-5">
              {featuredPosts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="block bg-gradient-to-br from-blue-50 to-emerald-50 p-6 rounded-xl border-2 border-blue-200 hover:border-blue-400 hover:shadow-xl transition group"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className="bg-blue-100 text-blue-700 text-xs font-medium px-2 py-1 rounded">
                      {post.category}
                    </span>
                    <span className="text-xs text-gray-500">⏱️ {post.readTime}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition">
                    {post.title}
                  </h3>
                  <p className="text-gray-700 text-sm mb-3 leading-relaxed">
                    {post.description}
                  </p>
                  <div className="flex items-center gap-2 text-blue-600 text-sm font-medium">
                    <span>קרא את המדריך המלא</span>
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition" />
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {regularPosts.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">מאמרים נוספים</h2>
            <div className="space-y-4">
              {regularPosts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="block bg-white p-6 rounded-lg border-2 border-gray-200 hover:border-blue-400 hover:shadow-md transition group"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-gray-100 text-gray-700 text-xs font-medium px-2 py-1 rounded">
                      {post.category}
                    </span>
                    <time className="text-sm text-gray-500">
                      {new Date(post.date).toLocaleDateString('he-IL')}
                    </time>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-2">{post.description}</p>
                  <div className="flex items-center gap-2 text-blue-600 text-sm font-medium">
                    <span>קרא עוד</span>
                    <ArrowLeft className="w-4 h-4" />
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
