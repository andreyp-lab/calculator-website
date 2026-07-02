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

  // הערה: ה-Article/BlogPosting JSON-LD מוזרק פעם אחת בלבד דרך BlogArticleSchema
  // ב-app/blog/(post)/layout.tsx (עם author=Person אנדרי פלטונוב). אין להזריק כאן שוב
  // כדי למנוע duplicate-schema ו-author מנותק.

  return (
    <div className="space-y-8 mt-12 not-prose">
      {/* CTA למחשבון */}
      {post.relatedCalculator && (
        <div className="bg-ink border border-ink/20 rounded-none p-6">
          <div className="flex items-start gap-4">
            <div className="border border-gold-light/30 p-3 flex-shrink-0">
              <Calculator className="w-6 h-6 text-gold-light" />
            </div>
            <div className="flex-1">
              <p className="font-mono text-xs uppercase tracking-[0.14em] text-gold-light mb-2">
                ✦ כלי מעשי
              </p>
              <h3 className="font-serif text-lg text-cream mb-1">רוצה לחשב בעצמך?</h3>
              <p className="text-sm text-cream/65 mb-4 leading-relaxed">
                המחשבון המקצועי שלנו יבצע את החישוב במדויק לפי הנתונים שלך — בחינם.
              </p>
              <Link
                href={post.relatedCalculator.href}
                className="inline-flex items-center gap-2 bg-gold text-paper hover:bg-gold-2 font-medium px-6 py-2.5 rounded-none transition"
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
          <h3 className="text-xl text-ink mb-1 flex items-center gap-2">
            <span className="text-gold">✦</span>
            מאמרים נוספים שיעניינו אותך
          </h3>
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-gold mb-5">
            קריאה נוספת
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {related.map((p) => (
              <Link
                key={p.slug}
                href={`/blog/${p.slug}`}
                className="block bg-paper border border-ink/15 hover:bg-paper-hover rounded-none p-4 transition group"
              >
                <div className="font-mono text-xs uppercase tracking-[0.14em] text-gold mb-2">
                  {p.category}
                </div>
                <h4 className="font-serif text-base text-ink mb-1.5 leading-snug group-hover:text-ink-mid transition">
                  {p.title}
                </h4>
                <p className="text-xs text-ink/55 line-clamp-2 leading-relaxed">{p.description}</p>
                <div className="mt-3 text-xs text-ink/40">{p.readTime}</div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
