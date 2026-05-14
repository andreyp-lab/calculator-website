import Link from 'next/link';
import { Metadata } from 'next';
import { ArrowLeft, BookOpen, Sparkles } from 'lucide-react';
import { Breadcrumbs } from '@/components/calculator/Breadcrumbs';
import { blogPosts, getAllCategories } from '@/content/blog/registry';

export const metadata: Metadata = {
  title: 'בלוג FinCalc - מאמרי עומק על מיסוי וכלכלה אישית 2026',
  description:
    'מאמרים מקצועיים מקיפים על מס הכנסה, החזרי מס, פיצויי פיטורין, חברה בע"מ vs עוסק, מע"מ, זכויות עובדים והפחתת מס - מעודכן 2026.',
};

export default function BlogPage() {
  // מיון: featured קודם, ואז לפי תאריך יורד
  const sorted = [...blogPosts].sort((a, b) => {
    if (a.featured !== b.featured) return a.featured ? -1 : 1;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  const featured = sorted.filter((p) => p.featured);
  const regular = sorted.filter((p) => !p.featured);
  const categories = getAllCategories();

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Breadcrumbs items={[{ label: 'דף הבית', href: '/' }, { label: 'בלוג' }]} />
        </div>

        {/* Hero */}
        <div className="mb-10 text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-3">📚 בלוג פיננסי</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            מאמרי עומק מקצועיים על מיסוי, זכויות עובדים, וכלכלה אישית.
            כל מאמר נכתב במיוחד עבור עובדים, עצמאיים ובעלי עסקים בישראל.
          </p>
        </div>

        {/* קטגוריות */}
        <div className="mb-10 flex flex-wrap gap-2 justify-center">
          <a
            href="#all-posts"
            className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-medium rounded-full transition"
          >
            הכל ({blogPosts.length})
          </a>
          {categories.map((c) => (
            <a
              key={c.name}
              href={`#cat-${c.name}`}
              className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-sm font-medium rounded-full transition"
            >
              {c.name} ({c.count})
            </a>
          ))}
        </div>

        {/* מאמרי עוגן */}
        {featured.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-amber-500" />
              מאמרי עוגן
            </h2>
            <div className="grid md:grid-cols-2 gap-5">
              {featured.map((post) => (
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
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition leading-snug">
                    {post.title}
                  </h3>
                  <p className="text-gray-700 text-sm mb-3 leading-relaxed">
                    {post.description}
                  </p>
                  <div className="flex items-center gap-2 text-blue-600 text-sm font-medium">
                    <span>קרא את המדריך</span>
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition" />
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* כל המאמרים */}
        <section id="all-posts">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-blue-600" />
            כל המאמרים
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {sorted.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="block bg-white p-5 rounded-lg border-2 border-gray-200 hover:border-blue-400 hover:shadow-md transition group"
              >
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className="bg-blue-50 text-blue-700 text-xs font-medium px-2 py-0.5 rounded">
                    {post.category}
                  </span>
                  <span className="text-xs text-gray-500">⏱️ {post.readTime}</span>
                  <time className="text-xs text-gray-500" dateTime={post.date}>
                    {new Date(post.date).toLocaleDateString('he-IL')}
                  </time>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1.5 group-hover:text-blue-600 transition leading-snug">
                  {post.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
                  {post.description}
                </p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
