'use client';

import { useSelectedLayoutSegment } from 'next/navigation';
import { Breadcrumbs } from '@/components/calculator/Breadcrumbs';
import { blogPosts } from '@/content/blog/registry';

/**
 * BlogBreadcrumbs – breadcrumbs דינמיים לדפי בלוג.
 * קורא את ה-slug הנוכחי מ-useSelectedLayoutSegment ומחפש את שם הפוסט מה-registry.
 * משמש ב-app/blog/(post)/layout.tsx כדי להציג כותרת פוסט אמיתית במקום "מאמר".
 */
export function BlogBreadcrumbs() {
  const slug = useSelectedLayoutSegment();
  const post = slug ? blogPosts.find((p) => p.slug === slug) : undefined;
  const postTitle = post?.title ?? 'מאמר';

  return (
    <Breadcrumbs
      items={[
        { label: 'דף הבית', href: '/' },
        { label: 'בלוג', href: '/blog' },
        { label: postTitle },
      ]}
    />
  );
}
