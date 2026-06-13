'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, BookOpen, Sparkles } from 'lucide-react';

export interface BlogExplorerPost {
  slug: string;
  title: string;
  description: string;
  category: string;
  readTime: string;
  date: string;
  featured?: boolean;
}

interface BlogExplorerProps {
  /** posts pre-sorted (featured first, then by date desc) */
  posts: BlogExplorerPost[];
  categories: { name: string; count: number }[];
  totalCount: number;
}

export function BlogExplorer({ posts, categories, totalCount }: BlogExplorerProps) {
  // null = "הכל". מאותחל ל-null כך שה-SSR מרנדר את כל הפוסטים (טוב ל-SEO).
  const [selected, setSelected] = useState<string | null>(null);

  // תאימות לאחור: קישורים משותפים בפורמט /blog#cat-<שם> מסננים אחרי טעינה.
  useEffect(() => {
    const applyHash = () => {
      const raw = decodeURIComponent(window.location.hash.replace(/^#/, ''));
      if (raw.startsWith('cat-')) {
        const name = raw.slice(4);
        if (categories.some((c) => c.name === name)) {
          setSelected(name);
          return;
        }
      }
      if (raw === 'all-posts' || raw === '') setSelected(null);
    };
    applyHash();
    window.addEventListener('hashchange', applyHash);
    return () => window.removeEventListener('hashchange', applyHash);
  }, [categories]);

  const choose = (name: string | null) => {
    setSelected(name);
    // עדכון ה-hash כדי שה-URL יישאר שיתופי, בלי קפיצת גלילה.
    const target = name ? `cat-${name}` : 'all-posts';
    if (typeof window !== 'undefined') {
      history.replaceState(null, '', `#${target}`);
    }
  };

  const visible = selected ? posts.filter((p) => p.category === selected) : posts;
  const featured = selected ? [] : posts.filter((p) => p.featured);

  return (
    <>
      {/* קטגוריות */}
      <div className="mb-10 flex flex-wrap gap-2 justify-center">
        <button
          type="button"
          onClick={() => choose(null)}
          aria-pressed={selected === null}
          className={`px-3 py-1.5 text-sm font-medium rounded-full transition ${
            selected === null
              ? 'bg-gray-800 text-white'
              : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
          }`}
        >
          הכל ({totalCount})
        </button>
        {categories.map((c) => (
          <button
            type="button"
            key={c.name}
            onClick={() => choose(c.name)}
            aria-pressed={selected === c.name}
            className={`px-3 py-1.5 text-sm font-medium rounded-full transition ${
              selected === c.name
                ? 'bg-blue-600 text-white'
                : 'bg-blue-50 hover:bg-blue-100 text-blue-700'
            }`}
          >
            {c.name} ({c.count})
          </button>
        ))}
      </div>

      {/* מאמרי עוגן — רק במצב "הכל" */}
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
                <p className="text-gray-700 text-sm mb-3 leading-relaxed">{post.description}</p>
                <div className="flex items-center gap-2 text-blue-600 text-sm font-medium">
                  <span>קרא את המדריך</span>
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition" />
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* רשימת המאמרים (מסוננת) */}
      <section id="all-posts" className="scroll-mt-24">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-blue-600" />
          {selected ? `מאמרים בנושא ${selected}` : 'כל המאמרים'}
          <span className="text-base font-normal text-gray-400">({visible.length})</span>
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          {visible.map((post) => (
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
    </>
  );
}
