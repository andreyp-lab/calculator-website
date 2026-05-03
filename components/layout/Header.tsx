'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { navigation } from '@/lib/config/navigation';
import { SearchBar } from './SearchBar';

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="border-b border-gray-200 bg-white sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        {/* Top bar */}
        <div className="flex items-center justify-between gap-4 py-3">
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">FC</span>
            </div>
            <span className="font-bold text-gray-900 hidden sm:inline">FinCalc</span>
          </Link>

          {/* Search - desktop */}
          <div className="hidden md:block flex-1 max-w-md">
            <SearchBar />
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 -mr-2"
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
        <nav className="hidden md:flex items-center gap-4 lg:gap-6 pb-3 overflow-x-auto">
          {navigation.main.map((item) => {
            const isHighlight = (item as { highlight?: boolean }).highlight;
            if (isHighlight) {
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-3 py-1.5 rounded-lg font-medium hover:shadow-md transition text-sm whitespace-nowrap flex-shrink-0"
                >
                  {item.label}
                </Link>
              );
            }
            return (
              <Link
                key={item.href}
                href={item.href}
                className="text-gray-600 hover:text-blue-600 transition text-sm whitespace-nowrap flex-shrink-0"
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-gray-200 py-3">
            <nav className="flex flex-col gap-1">
              {navigation.main.map((item) => {
                const isHighlight = (item as { highlight?: boolean }).highlight;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`px-3 py-2.5 rounded-lg text-sm transition ${
                      isHighlight
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
              <div className="border-t border-gray-200 my-2" />
              <Link
                href="/about"
                onClick={() => setMobileOpen(false)}
                className="px-3 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-gray-100"
              >
                אודות
              </Link>
              <Link
                href="/contact"
                onClick={() => setMobileOpen(false)}
                className="px-3 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-gray-100"
              >
                יצירת קשר
              </Link>
              <Link
                href="/blog"
                onClick={() => setMobileOpen(false)}
                className="px-3 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-gray-100"
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
