'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Search, X } from 'lucide-react';
import { searchCalculators, type CalculatorEntry } from '@/lib/config/all-calculators';

export function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<CalculatorEntry[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // עדכון תוצאות בעת הקלדה
  useEffect(() => {
    if (query.trim().length >= 1) {
      setResults(searchCalculators(query));
      setIsOpen(true);
    } else {
      setResults([]);
      setIsOpen(false);
    }
  }, [query]);

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
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query && setIsOpen(true)}
          placeholder="חפש מחשבון... (משכנתא, פנסיה, רכב)"
          className="w-full pr-9 pl-9 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            aria-label="נקה חיפוש"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Results Dropdown */}
      {isOpen && (
        <div className="absolute top-full mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          {results.length === 0 ? (
            <div className="p-4 text-center text-sm text-gray-500">
              לא נמצאו מחשבונים. נסה: &quot;משכנתא&quot;, &quot;פנסיה&quot;, &quot;ROI&quot;
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
                      className="flex items-start gap-3 px-3 py-2.5 hover:bg-blue-50 transition border-b border-gray-100 last:border-0"
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
