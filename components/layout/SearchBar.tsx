'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Search, X } from 'lucide-react';
import { searchCalculators, type CalculatorEntry } from '@/lib/config/all-calculators';

export function SearchBar() {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const results: CalculatorEntry[] = query.trim() ? searchCalculators(query) : [];

  // סגירה כשלוחצים מחוץ
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function handleResultClick() {
    setQuery('');
    setIsOpen(false);
  }

  return (
    <div ref={containerRef} className="relative w-full max-w-md">
      <div className="relative">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          aria-label="חיפוש כלי או מדריך"
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(Boolean(e.target.value.trim()));
          }}
          onFocus={() => query && setIsOpen(true)}
          placeholder="חפש כלי או מדריך... (משכנתא, פנסיה, רכב)"
          className="w-full pr-9 pl-9 py-2 text-sm bg-paper border border-ink/20 rounded-none text-ink placeholder:text-ink/70 focus:border-gold focus:ring-1 focus:ring-gold outline-none transition"
        />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setIsOpen(false);
            }}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            aria-label="נקה חיפוש"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Results Dropdown */}
      {isOpen && (
        <div className="absolute top-full mt-1 w-full bg-paper border border-ink/20 rounded-none shadow-lg z-50 max-h-96 overflow-y-auto">
          {results.length === 0 ? (
            <div className="p-4 text-center text-sm text-gray-500">
              לא נמצאו תוצאות. נסה: &quot;משכנתא&quot;, &quot;פנסיה&quot;, &quot;ROI&quot;
            </div>
          ) : (
            <>
              <div className="px-3 py-2 text-xs text-gray-500 border-b border-gray-100">
                {results.length} תוצאות
              </div>
              <ul>
                {results.map((calc) => (
                  <li key={calc.id}>
                    <Link
                      href={calc.href}
                      onClick={handleResultClick}
                      className="flex items-start gap-3 px-3 py-2.5 hover:bg-paper-hover transition border-b border-ink/10 last:border-0"
                    >
                      <span className="text-2xl flex-shrink-0">{calc.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-900 text-sm truncate">
                          {calc.title}
                        </div>
                        <div className="text-xs text-gray-500 truncate">
                          {calc.category} · {calc.description}
                        </div>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
    </div>
  );
}
