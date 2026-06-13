'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export interface FAQItem {
  question: string;
  answer: string;
}

interface FAQProps {
  items: FAQItem[];
}

export function FAQ({ items }: FAQProps) {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <>
      <div className="space-y-3">
        {items.map((item, idx) => (
          <div key={idx} className="border border-ink/15 bg-paper overflow-hidden">
            <button
              type="button"
              onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
              className="w-full flex items-center justify-between gap-3 px-4 py-3.5 hover:bg-paper-hover transition text-right"
            >
              <span className="font-serif text-lg text-ink">{item.question}</span>
              <ChevronDown
                className={`w-5 h-5 text-gold flex-shrink-0 transition-transform ${
                  openIdx === idx ? 'rotate-180' : ''
                }`}
              />
            </button>
            {openIdx === idx && (
              <div className="px-4 py-4 bg-cream-2 border-t border-ink/15">
                <p className="text-ink/75 leading-relaxed">{item.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* JSON-LD Schema for FAQ */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: items.map((item) => ({
              '@type': 'Question',
              name: item.question,
              acceptedAnswer: {
                '@type': 'Answer',
                text: item.answer,
              },
            })),
          }),
        }}
      />
    </>
  );
}
