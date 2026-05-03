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
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition text-right"
      >
        <span className="font-medium text-gray-900">{title}</span>
        <ChevronDown
          className={`w-5 h-5 text-gray-600 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && (
        <div className="p-4 bg-white">
          <dl className="space-y-3">
            {items.map((item, idx) => (
              <div
                key={idx}
                className={`flex justify-between gap-4 ${
                  item.bold ? 'pt-3 border-t border-gray-200 font-bold' : ''
                }`}
              >
                <dt className="text-gray-700">
                  {item.label}
                  {item.note && (
                    <span className="block text-xs text-gray-500 font-normal mt-0.5">
                      {item.note}
                    </span>
                  )}
                </dt>
                <dd className="text-gray-900 font-medium whitespace-nowrap">{item.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}
    </div>
  );
}
