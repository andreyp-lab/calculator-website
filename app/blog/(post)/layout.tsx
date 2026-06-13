import { ReactNode } from 'react';
import { BlogBreadcrumbs } from '@/components/blog/BlogBreadcrumbs';
import { BlogArticleSchema } from '@/components/blog/BlogArticleSchema';
import { AuthorBox } from '@/components/calculator/AuthorBox';

export default function BlogPostLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-cream py-8">
      <article className="max-w-3xl mx-auto px-4">
        <div className="mb-8">
          <BlogBreadcrumbs />
        </div>

        <div
          className="prose prose-lg max-w-none
            prose-headings:font-serif prose-headings:text-ink prose-headings:font-normal
            prose-p:text-ink/80 prose-p:leading-relaxed
            prose-strong:text-ink
            prose-a:text-gold prose-a:no-underline hover:prose-a:underline
            prose-li:text-ink/80
            prose-blockquote:border-gold prose-blockquote:text-ink/70
            prose-hr:border-ink/15
            prose-code:text-ink-mid prose-code:bg-paper prose-code:rounded-none"
        >
          {children}
        </div>

        <div className="mt-12 pt-8 border-t border-ink/15">
          <AuthorBox />
        </div>
      </article>

      {/* Article JSON-LD schema – injected per-post via client component */}
      <BlogArticleSchema />
    </div>
  );
}
