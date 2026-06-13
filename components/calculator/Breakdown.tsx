'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export interface BreakdownItem {
  label: string;
  value: string;
  note?: string;
  bold?: boolean;
}

interface BreakdownProps {
  title?: string;
  items: BreakdownItem[];
  defaultOpen?: boolean;
}

export function Breakdown({ title = 'פירוט החישוב', items, defaultOpen = false }: BreakdownProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border border-ink/15 overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-3 px-4 py-3.5 bg-cream-2 hover:bg-paper-hover transition text-right"
      >
        <span className="font-mono text-xs uppercase tracking-[0.14em] text-gold">{title}</span>
        <ChevronDown
          className={`w-5 h-5 text-gold transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && (
        <div className="p-4 bg-paper">
          <dl className="space-y-3">
            {items.map((item, idx) => (
              <div
                key={idx}
                className={`flex justify-between gap-4 ${
                  item.bold ? 'pt-3 border-t border-ink/12 font-bold' : ''
                }`}
              >
                <dt className="text-ink/70">
                  {item.label}
                  {item.note && (
                    <span className="block text-xs text-ink/50 font-normal mt-0.5">
                      {item.note}
                    </span>
                  )}
                </dt>
                <dd className="text-ink font-medium whitespace-nowrap">{item.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}
    </div>
  );
}
