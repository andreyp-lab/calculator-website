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
    <div className="min-h-screen bg-cream">
      {/* Hero */}
      <div className="bg-cream border-b border-ink/15 py-14 md:py-20">
        <div className="max-w-5xl mx-auto px-4">
          <div className="mb-6">
            <Breadcrumbs items={[{ label: 'דף הבית', href: '/' }, { label: 'בלוג' }]} />
          </div>
          <div className="text-center">
            <p className="font-mono text-xs uppercase tracking-[0.14em] text-gold mb-4">
              ✦ ידע פיננסי
            </p>
            <h1 className="text-3xl md:text-5xl text-ink mb-4">בלוג פיננסי</h1>
            <p className="text-base md:text-lg text-ink/70 max-w-2xl mx-auto leading-relaxed">
              מאמרי עומק מקצועיים על מיסוי, זכויות עובדים, וכלכלה אישית.
              כל מאמר נכתב במיוחד עבור עובדים, עצמאיים ובעלי עסקים בישראל.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* קטגוריות + רשימת מאמרים (סינון client-side) */}
        <BlogExplorer posts={sorted} categories={categories} totalCount={blogPosts.length} />
      </div>
    </div>
  );
}
