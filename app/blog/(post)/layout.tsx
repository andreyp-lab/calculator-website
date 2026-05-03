import { ReactNode } from 'react';
import { Breadcrumbs } from '@/components/calculator/Breadcrumbs';
import { AuthorBox } from '@/components/calculator/AuthorBox';

export default function BlogPostLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-white py-8">
      <article className="max-w-3xl mx-auto px-4">
        <div className="mb-6">
          <Breadcrumbs
            items={[
              { label: 'דף הבית', href: '/' },
              { label: 'בלוג', href: '/blog' },
              { label: 'מאמר' },
            ]}
          />
        </div>

        <div>{children}</div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <AuthorBox />
        </div>
      </article>
    </div>
  );
}
