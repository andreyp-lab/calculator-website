import { Metadata } from 'next';
import { Breadcrumbs } from '@/components/calculator/Breadcrumbs';
import { blogPosts, getAllCategories } from '@/content/blog/registry';
import { BlogExplorer } from '@/components/blog/BlogExplorer';

export const metadata: Metadata = {
  alternates: { canonical: '/blog' },
  title: 'בלוג - מאמרי עומק על מיסוי וכלכלה אישית 2026',
  description:
    'מאמרים מקצועיים מקיפים על מס הכנסה, החזרי מס, פיצויי פיטורין, חברה בע"מ vs עוסק, מע"מ, זכויות עובדים והפחתת מס - מעודכן 2026.',
};

export default function BlogPage() {
  // מיון: featured קודם, ואז לפי תאריך יורד
  const sorted = [...blogPosts].sort((a, b) => {
    if (a.featured !== b.featured) return a.featured ? -1 : 1;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

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

        {/* קטגוריות + רשימת מאמרים (סינון client-side) */}
        <BlogExplorer posts={sorted} categories={categories} totalCount={blogPosts.length} />
      </div>
    </div>
  );
}
