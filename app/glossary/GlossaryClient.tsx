'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import type { GlossaryTerm } from '@/lib/data/glossary';

export type { GlossaryTerm };

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
            className="w-full border-2 border-ink/20 rounded-none px-5 py-3 text-right text-lg focus:border-gold focus:outline-none shadow-sm"
            dir="rtl"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/45 hover:text-ink text-xl"
            >
              ✕
            </button>
          )}
        </div>
        {query && (
          <p className="text-sm text-ink/60 mt-2 text-center">
            נמצאו {filtered.length} מונחים לחיפוש &quot;{query}&quot;
          </p>
        )}
      </div>

      {/* Letter navigation */}
      <div className="sticky top-0 bg-paper/95 backdrop-blur z-10 border-b border-ink/15 py-3 mb-8">
        <div className="flex flex-wrap gap-1.5 justify-center">
          <button
            onClick={() => { setActiveLetter(null); setQuery(''); }}
            className={`px-3 py-1.5 rounded-none text-sm font-medium transition ${
              !activeLetter && !query
                ? 'bg-ink text-cream'
                : 'bg-cream-2 text-ink/70 hover:bg-paper-hover'
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
                className={`px-3 py-1.5 rounded-none text-sm font-bold transition ${
                  activeLetter === letter
                    ? 'bg-ink text-cream'
                    : hasTerms
                    ? 'bg-cream-2 text-ink/70 hover:bg-paper-hover'
                    : 'bg-cream-2 text-ink/30 cursor-default'
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
        <div className="text-center py-16 text-ink/60">
          <div className="text-4xl mb-4">🔍</div>
          <p className="text-xl">לא נמצאו מונחים עבור &quot;{query}&quot;</p>
          <button onClick={() => setQuery('')} className="mt-4 text-gold underline">
            נקה חיפוש
          </button>
        </div>
      ) : (
        <div className="space-y-12">
          {displayLetters.map((letter) => (
            <section key={letter} id={`letter-${letter}`} className="scroll-mt-20">
              <h2 className="text-3xl font-bold text-ink border-b-2 border-ink/20 pb-2 mb-6">
                {letter}
              </h2>
              <div className="grid md:grid-cols-2 gap-5">
                {byLetter[letter].map((t) => (
                  <article
                    key={t.id}
                    id={t.id}
                    className="bg-paper border border-ink/15 rounded-none p-5 shadow-sm hover:shadow-md transition"
                  >
                    <h3 className="text-lg font-bold mb-2">
                      <Link
                        href={`/glossary/${t.id}`}
                        className="text-ink hover:text-gold transition"
                      >
                        {t.term}
                      </Link>
                    </h3>
                    <p className="text-ink/70 text-sm leading-relaxed mb-3">{t.definition}</p>
                    {t.seeAlso && t.seeAlso.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        <span className="text-xs text-ink/60">ראה גם:</span>
                        {t.seeAlso.map((link) => (
                          <Link
                            key={link.href}
                            href={link.href}
                            className="text-xs text-gold hover:text-gold-2 underline"
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
