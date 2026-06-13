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
      {/* כפתורי קטגוריות */}
      <div className="mb-10 flex flex-wrap gap-2 justify-center">
        <button
          type="button"
          onClick={() => choose(null)}
          aria-pressed={selected === null}
          className={`px-4 py-1.5 text-sm font-medium rounded-none transition border ${
            selected === null
              ? 'bg-ink text-cream border-ink'
              : 'bg-paper border-ink/15 text-ink hover:bg-paper-hover'
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
            className={`px-4 py-1.5 text-sm font-medium rounded-none transition border ${
              selected === c.name
                ? 'bg-ink text-cream border-ink'
                : 'bg-paper border-ink/15 text-ink hover:bg-paper-hover'
            }`}
          >
            {c.name} ({c.count})
          </button>
        ))}
      </div>

      {/* מאמרי עוגן — רק במצב "הכל" */}
      {featured.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl text-ink mb-6 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-gold flex-shrink-0" />
            מאמרי עוגן
          </h2>
          <div className="grid md:grid-cols-2 gap-5">
            {featured.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="block bg-paper border border-ink/15 hover:bg-paper-hover rounded-none p-6 transition group"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="font-mono text-xs uppercase tracking-[0.14em] text-gold">
                    ✦ {post.category}
                  </span>
                  <span className="text-xs text-ink/50">{post.readTime}</span>
                </div>
                <h3 className="text-xl text-ink mb-2 leading-snug group-hover:text-ink-mid transition">
                  {post.title}
                </h3>
                <p className="text-ink/65 text-sm mb-4 leading-relaxed">{post.description}</p>
                <div className="flex items-center gap-1.5 text-gold text-sm font-medium">
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
        <h2 className="text-2xl text-ink mb-6 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-gold flex-shrink-0" />
          {selected ? `מאמרים בנושא ${selected}` : 'כל המאמרים'}
          <span className="text-base font-normal text-ink/40 mr-1">({visible.length})</span>
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          {visible.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="block bg-paper border border-ink/15 hover:bg-paper-hover rounded-none p-5 transition group"
            >
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="font-mono text-xs uppercase tracking-[0.14em] text-gold">
                  {post.category}
                </span>
                <span className="text-xs text-ink/45">{post.readTime}</span>
                <time className="text-xs text-ink/45" dateTime={post.date}>
                  {new Date(post.date).toLocaleDateString('he-IL')}
                </time>
              </div>
              <h3 className="text-lg text-ink mb-1.5 leading-snug group-hover:text-ink-mid transition">
                {post.title}
              </h3>
              <p className="text-ink/60 text-sm leading-relaxed line-clamp-2">
                {post.description}
              </p>
              <div className="mt-3 flex items-center gap-1 text-gold text-xs font-medium">
                <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition" />
                <span>קרא עוד</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
