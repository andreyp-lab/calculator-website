'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';

export interface GlossaryTerm {
  id: string;
  term: string;
  letter: string;
  definition: string;
  seeAlso?: { label: string; href: string }[];
}

interface GlossaryClientProps {
  terms: GlossaryTerm[];
  letters: string[];
}

export function GlossaryClient({ terms, letters }: GlossaryClientProps) {
  const [query, setQuery] = useState('');
  const [activeLetter, setActiveLetter] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return terms.filter((t) => {
      const matchLetter = activeLetter ? t.letter === activeLetter : true;
      const matchQuery = q
        ? t.term.toLowerCase().includes(q) || t.definition.toLowerCase().includes(q)
        : true;
      return matchLetter && matchQuery;
    });
  }, [terms, query, activeLetter]);

  const byLetter = useMemo(() => {
    const map: Record<string, GlossaryTerm[]> = {};
    for (const t of filtered) {
      if (!map[t.letter]) map[t.letter] = [];
      map[t.letter].push(t);
    }
    return map;
  }, [filtered]);

  const displayLetters = letters.filter((l) => byLetter[l]);

  return (
    <div>
      {/* Search bar */}
      <div className="max-w-2xl mx-auto mb-8">
        <div className="relative">
          <input
            type="search"
            placeholder="חפש מונח... (לדוגמה: פריים, פיצויים, LTV)"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActiveLetter(null);
            }}
            className="w-full border-2 border-gray-300 rounded-xl px-5 py-3 text-right text-lg focus:border-blue-500 focus:outline-none shadow-sm"
            dir="rtl"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 text-xl"
            >
              ✕
            </button>
          )}
        </div>
        {query && (
          <p className="text-sm text-gray-500 mt-2 text-center">
            נמצאו {filtered.length} מונחים לחיפוש &quot;{query}&quot;
          </p>
        )}
      </div>

      {/* Letter navigation */}
      <div className="sticky top-0 bg-white/95 backdrop-blur z-10 border-b border-gray-200 py-3 mb-8">
        <div className="flex flex-wrap gap-1.5 justify-center">
          <button
            onClick={() => { setActiveLetter(null); setQuery(''); }}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
              !activeLetter && !query
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            הכל
          </button>
          {letters.map((letter) => {
            const hasTerms = !!byLetter[letter];
            return (
              <button
                key={letter}
                onClick={() => {
                  setActiveLetter(activeLetter === letter ? null : letter);
                  setQuery('');
                }}
                disabled={!hasTerms && !activeLetter}
                className={`px-3 py-1.5 rounded-lg text-sm font-bold transition ${
                  activeLetter === letter
                    ? 'bg-blue-600 text-white'
                    : hasTerms
                    ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    : 'bg-gray-50 text-gray-300 cursor-default'
                }`}
              >
                {letter}
              </button>
            );
          })}
        </div>
      </div>

      {/* Terms display */}
      {displayLetters.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <div className="text-4xl mb-4">🔍</div>
          <p className="text-xl">לא נמצאו מונחים עבור &quot;{query}&quot;</p>
          <button onClick={() => setQuery('')} className="mt-4 text-blue-600 underline">
            נקה חיפוש
          </button>
        </div>
      ) : (
        <div className="space-y-12">
          {displayLetters.map((letter) => (
            <section key={letter} id={`letter-${letter}`} className="scroll-mt-20">
              <h2 className="text-3xl font-bold text-blue-700 border-b-2 border-blue-200 pb-2 mb-6">
                {letter}
              </h2>
              <div className="grid md:grid-cols-2 gap-5">
                {byLetter[letter].map((t) => (
                  <article
                    key={t.id}
                    id={t.id}
                    className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition"
                  >
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{t.term}</h3>
                    <p className="text-gray-700 text-sm leading-relaxed mb-3">{t.definition}</p>
                    {t.seeAlso && t.seeAlso.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        <span className="text-xs text-gray-500">ראה גם:</span>
                        {t.seeAlso.map((link) => (
                          <Link
                            key={link.href}
                            href={link.href}
                            className="text-xs text-blue-600 hover:text-blue-800 underline"
                          >
                            {link.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
