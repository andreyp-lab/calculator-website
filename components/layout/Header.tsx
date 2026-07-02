'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { navigation } from '@/lib/config/navigation';
import { SearchBar } from './SearchBar';

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="site-header sticky top-0 z-40 border-b border-ink/14 bg-cream/92 backdrop-blur">
      <div className="max-w-7xl mx-auto px-4">
        {/* Top bar */}
        <div className="flex items-center justify-between gap-4 py-3.5">
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <span className="font-serif text-2xl font-black text-ink leading-none">
              חשבונ<span className="text-gold">אי</span>
            </span>
            <span className="hidden sm:flex items-center gap-1.5">
              <span className="text-gold" aria-hidden="true">
                ✦
              </span>
              <span className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink/50">
                est. 2026
              </span>
            </span>
          </Link>

          {/* Search - desktop */}
          <div className="hidden md:block flex-1 max-w-md">
            <SearchBar />
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 -mr-2 text-ink"
            aria-label={mobileOpen ? 'סגור תפריט' : 'פתח תפריט'}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Search - mobile (below top bar) */}
        <div className="md:hidden pb-3">
          <SearchBar />
        </div>

        {/* Navigation - desktop */}
        <nav className="hidden md:flex items-center gap-5 lg:gap-7 pb-3 overflow-x-auto">
          {navigation.main.map((item) => {
            const isHighlight = (item as { highlight?: boolean }).highlight;
            if (isHighlight) {
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="bg-ink text-cream px-5 py-2.5 hover:bg-ink-deep transition text-sm font-medium whitespace-nowrap flex-shrink-0"
                >
                  {item.label}
                </Link>
              );
            }
            return (
              <Link
                key={item.href}
                href={item.href}
                className="font-sans text-sm text-ink/70 hover:text-ink transition whitespace-nowrap flex-shrink-0"
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-ink/14 py-3">
            <nav className="flex flex-col gap-1">
              {navigation.main.map((item) => {
                const isHighlight = (item as { highlight?: boolean }).highlight;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`px-4 py-2.5 text-sm transition ${
                      isHighlight
                        ? 'bg-ink text-cream font-medium hover:bg-ink-deep'
                        : 'text-ink/70 hover:bg-ink/5 hover:text-ink'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
              <div className="border-t border-ink/14 my-2" />
              <Link
                href="/about"
                onClick={() => setMobileOpen(false)}
                className="px-4 py-2.5 text-sm text-ink/70 hover:bg-ink/5 hover:text-ink transition"
              >
                אודות
              </Link>
              <Link
                href="/contact"
                onClick={() => setMobileOpen(false)}
                className="px-4 py-2.5 text-sm text-ink/70 hover:bg-ink/5 hover:text-ink transition"
              >
                יצירת קשר
              </Link>
              <Link
                href="/blog"
                onClick={() => setMobileOpen(false)}
                className="px-4 py-2.5 text-sm text-ink/70 hover:bg-ink/5 hover:text-ink transition"
              >
                בלוג
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
