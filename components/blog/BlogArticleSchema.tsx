'use client';

import { useSelectedLayoutSegment } from 'next/navigation';
import { blogPosts } from '@/content/blog/registry';

const SITE_URL = 'https://cheshbonai.co.il';

/**
 * BlogArticleSchema – מזריק JSON-LD Article לכל פוסט בלוג.
 * קורא את ה-slug מ-useSelectedLayoutSegment ומחפש את מידע הפוסט מה-registry.
 * משמש ב-app/blog/(post)/layout.tsx.
 */
export function BlogArticleSchema() {
  const slug = useSelectedLayoutSegment();
  const post = slug ? blogPosts.find((p) => p.slug === slug) : undefined;

  if (!post) return null;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.updatedDate ?? post.date,
    url: `${SITE_URL}/blog/${post.slug}`,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/blog/${post.slug}`,
    },
    inLanguage: 'he-IL',
    articleSection: post.category,
    timeRequired: post.readTime,
    author: {
      '@type': 'Person',
      name: 'אנדרי פלטונוב',
      jobTitle: 'רואה חשבון מוסמך וסמנכ״ל כספים',
      url: `${SITE_URL}/about`,
    },
    publisher: {
      '@type': 'Organization',
      name: 'חשבונאי',
      url: SITE_URL,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/og-default.png`,
      },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
