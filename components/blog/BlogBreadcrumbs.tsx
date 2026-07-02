'use client';

import { useSelectedLayoutSegment } from 'next/navigation';
import { Breadcrumbs } from '@/components/calculator/Breadcrumbs';
import { blogPosts } from '@/content/blog/registry';

/**
 * BlogBreadcrumbs – breadcrumbs דינמיים לדפי בלוג.
 * קורא את ה-slug הנוכחי מ-useSelectedLayoutSegment ומחפש את שם הפוסט מה-registry.
 * משמש ב-app/blog/(post)/layout.tsx כדי להציג כותרת פוסט אמיתית במקום "מאמר".
 */
const HE_MONTHS = [
  '', 'ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני',
  'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר',
];

function formatHeDate(iso: string): string {
  const [y, m, d] = iso.split('-');
  return `${parseInt(d, 10)} ${HE_MONTHS[parseInt(m, 10)]} ${y}`;
}

export function BlogBreadcrumbs() {
  const slug = useSelectedLayoutSegment();
  const post = slug ? blogPosts.find((p) => p.slug === slug) : undefined;
  const postTitle = post?.title ?? 'מאמר';

  return (
    <>
      <Breadcrumbs
        items={[
          { label: 'דף הבית', href: '/' },
          { label: 'בלוג', href: '/blog' },
          { label: postTitle },
        ]}
      />
      {post && (
        <div className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-xs uppercase tracking-[0.1em] text-ink/55">
          <span>מאת אנדרי פלטונוב · רו״ח</span>
          <span aria-hidden className="text-gold">✦</span>
          <time dateTime={post.updatedDate ?? post.date}>
            {post.updatedDate ? 'עודכן ' : ''}
            {formatHeDate(post.updatedDate ?? post.date)}
          </time>
          <span aria-hidden className="text-gold">✦</span>
          <span>{post.readTime} קריאה</span>
        </div>
      )}
    </>
  );
}
