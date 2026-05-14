import Link from 'next/link';
import { ArrowLeft, Calculator } from 'lucide-react';
import { getRelatedPosts, getPostBySlug } from '@/content/blog/registry';

interface BlogPostFooterProps {
  slug: string;
}

/**
 * רכיב לסוף כל פוסט:
 * - CTA למחשבון רלוונטי (אם הוגדר)
 * - 3 מאמרים קשורים
 *
 * שימוש בתוך page.mdx:
 *   <BlogPostFooter slug="my-slug" />
 */
export function BlogPostFooter({ slug }: BlogPostFooterProps) {
  const post = getPostBySlug(slug);
  if (!post) return null;

  const related = getRelatedPosts(slug, 3);

  return (
    <div className="space-y-8 mt-12 not-prose">
      {/* CTA למחשבון */}
      {post.relatedCalculator && (
        <div className="bg-gradient-to-br from-blue-50 to-emerald-50 border-2 border-blue-200 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="bg-blue-100 rounded-lg p-3 flex-shrink-0">
              <Calculator className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 mb-1 text-lg">רוצה לחשב בעצמך?</h3>
              <p className="text-sm text-gray-600 mb-3">
                המחשבון המקצועי שלנו יבצע את החישוב במדויק לפי הנתונים שלך - בחינם.
              </p>
              <Link
                href={post.relatedCalculator.href}
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2.5 rounded-lg transition"
              >
                <span>{post.relatedCalculator.label}</span>
                <ArrowLeft className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* מאמרים קשורים */}
      {related.length > 0 && (
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            📚 מאמרים נוספים שיעניינו אותך
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {related.map((p) => (
              <Link
                key={p.slug}
                href={`/blog/${p.slug}`}
                className="block bg-white border-2 border-gray-200 hover:border-blue-300 hover:shadow-md transition rounded-lg p-4 group"
              >
                <div className="text-xs font-medium text-blue-600 mb-1.5">{p.category}</div>
                <h4 className="font-bold text-gray-900 mb-1.5 leading-snug group-hover:text-blue-600 transition">
                  {p.title}
                </h4>
                <p className="text-xs text-gray-600 line-clamp-2">{p.description}</p>
                <div className="mt-2 text-xs text-gray-500">⏱️ {p.readTime}</div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
