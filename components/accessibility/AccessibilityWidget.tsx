'use client';

import { useEffect, useRef } from 'react';
import { useAccessibility, type TextSize } from './AccessibilityProvider';

// ─── Individual toggle row ────────────────────────────────────────────────────

interface ToggleRowProps {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  id: string;
}

function ToggleRow({ label, checked, onChange, id }: ToggleRowProps) {
  return (
    <div className="flex items-center justify-between gap-3 py-2">
      <label htmlFor={id} className="text-sm text-gray-800 cursor-pointer flex-1">
        {label}
      </label>
      <button
        id={id}
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={[
          'relative inline-flex w-10 h-5 rounded-full transition-colors duration-200 flex-shrink-0',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1',
          checked ? 'bg-blue-600' : 'bg-gray-300',
        ].join(' ')}
      >
        <span
          aria-hidden="true"
          className={[
            'inline-block w-4 h-4 rounded-full bg-white shadow transform transition-transform duration-200 mt-0.5',
            checked ? 'translate-x-5' : 'translate-x-1',
          ].join(' ')}
        />
      </button>
    </div>
  );
}

// ─── Text size selector ───────────────────────────────────────────────────────

const TEXT_SIZE_LABELS: Record<TextSize, string> = {
  0: 'רגיל',
  1: 'גדול',
  2: 'גדול יותר',
  3: 'גדול ביותר',
};

function TextSizeSelector() {
  const { settings, updateSetting } = useAccessibility();

  return (
    <div className="py-2">
      <p className="text-sm text-gray-700 mb-2 font-medium">גודל טקסט</p>
      <div className="flex gap-1" role="group" aria-label="גודל טקסט">
        {([0, 1, 2, 3] as TextSize[]).map((size) => (
          <button
            key={size}
            onClick={() => updateSetting('textSize', size)}
            aria-pressed={settings.textSize === size}
            aria-label={TEXT_SIZE_LABELS[size]}
            className={[
              'flex-1 py-1 text-xs rounded border transition-colors duration-150',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
              settings.textSize === size
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50',
            ].join(' ')}
          >
            {TEXT_SIZE_LABELS[size]}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Main Widget ──────────────────────────────────────────────────────────────

export function AccessibilityWidget() {
  const { settings, updateSetting, resetSettings, isOpen, setIsOpen } = useAccessibility();
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Close on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, setIsOpen]);

  // Close on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        isOpen &&
        panelRef.current &&
        !panelRef.current.contains(e.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [isOpen, setIsOpen]);

  // Trap focus within panel when open
  useEffect(() => {
    if (!isOpen || !panelRef.current) return;
    const focusables = panelRef.current.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (focusables.length > 0) {
      focusables[0].focus();
    }

    const trap = (e: KeyboardEvent) => {
      if (e.key !== 'Tab' || !panelRef.current) return;
      const items = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
      );
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', trap);
    return () => document.removeEventListener('keydown', trap);
  }, [isOpen]);

  const hasActiveSettings =
    settings.textSize !== 0 ||
    settings.highContrast ||
    settings.invertedContrast ||
    settings.highlightLinks ||
    settings.highlightHeadings ||
    settings.readableFont ||
    settings.stopAnimations ||
    settings.largeCursor ||
    settings.emphasizedFocus ||
    settings.lineSpacing;

  return (
    <>
      {/* Floating trigger button — bottom-left for RTL sites */}
      <div className="fixed bottom-5 left-5 z-[9000]" dir="ltr">
        <button
          ref={triggerRef}
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-controls="a11y-panel"
          aria-label={isOpen ? 'סגור תפריט נגישות' : 'פתח תפריט נגישות'}
          title="תפריט נגישות"
          className={[
            'w-12 h-12 rounded-full shadow-lg flex items-center justify-center',
            'text-2xl font-bold transition-all duration-200',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500',
            hasActiveSettings
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-white text-blue-600 border-2 border-blue-600 hover:bg-blue-50',
          ].join(' ')}
        >
          <span aria-hidden="true">♿</span>
          {hasActiveSettings && (
            <span
              aria-hidden="true"
              className="absolute top-0 left-0 w-3 h-3 rounded-full bg-orange-400 border border-white"
            />
          )}
        </button>
      </div>

      {/* Panel */}
      {isOpen && (
        <div
          id="a11y-panel"
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label="הגדרות נגישות"
          dir="rtl"
          className={[
            'fixed bottom-20 left-5 z-[9001]',
            'w-72 bg-white rounded-xl shadow-2xl border border-gray-200',
            'overflow-y-auto max-h-[80vh]',
          ].join(' ')}
        >
          {/* Panel header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-blue-50 rounded-t-xl">
            <h2 className="font-bold text-blue-800 text-base" id="a11y-panel-title">
              הגדרות נגישות
            </h2>
            <button
              onClick={() => {
                setIsOpen(false);
                triggerRef.current?.focus();
              }}
              aria-label="סגור תפריט נגישות"
              className="text-gray-500 hover:text-gray-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded p-1"
            >
              <span aria-hidden="true" className="text-lg">✕</span>
            </button>
          </div>

          {/* Panel body */}
          <div className="px-4 py-2 divide-y divide-gray-100">

            {/* Text size */}
            <TextSizeSelector />

            {/* Toggle rows */}
            <ToggleRow
              id="a11y-high-contrast"
              label="ניגודיות גבוהה"
              checked={settings.highContrast}
              onChange={(v) => {
                updateSetting('highContrast', v);
                if (v) updateSetting('invertedContrast', false);
              }}
            />

            <ToggleRow
              id="a11y-inverted"
              label="ניגודיות הפוכה"
              checked={settings.invertedContrast}
              onChange={(v) => {
                updateSetting('invertedContrast', v);
                if (v) updateSetting('highContrast', false);
              }}
            />

            <ToggleRow
              id="a11y-links"
              label="הדגשת קישורים"
              checked={settings.highlightLinks}
              onChange={(v) => updateSetting('highlightLinks', v)}
            />

            <ToggleRow
              id="a11y-headings"
              label="הדגשת כותרות"
              checked={settings.highlightHeadings}
              onChange={(v) => updateSetting('highlightHeadings', v)}
            />

            <ToggleRow
              id="a11y-font"
              label="פונט קריא (Arial)"
              checked={settings.readableFont}
              onChange={(v) => updateSetting('readableFont', v)}
            />

            <ToggleRow
              id="a11y-animations"
              label="עצירת אנימציות"
              checked={settings.stopAnimations}
              onChange={(v) => updateSetting('stopAnimations', v)}
            />

            <ToggleRow
              id="a11y-cursor"
              label="הגדלת סמן"
              checked={settings.largeCursor}
              onChange={(v) => updateSetting('largeCursor', v)}
            />

            <ToggleRow
              id="a11y-focus"
              label="מקלדת מודגשת"
              checked={settings.emphasizedFocus}
              onChange={(v) => updateSetting('emphasizedFocus', v)}
            />

            <ToggleRow
              id="a11y-spacing"
              label="רווח שורות מוגדל"
              checked={settings.lineSpacing}
              onChange={(v) => updateSetting('lineSpacing', v)}
            />
          </div>

          {/* Footer */}
          <div className="px-4 py-3 border-t border-gray-100 flex justify-between items-center">
            <button
              onClick={resetSettings}
              disabled={!hasActiveSettings}
              aria-label="איפוס כל הגדרות הנגישות"
              className={[
                'text-xs py-1.5 px-3 rounded border transition-colors',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400',
                hasActiveSettings
                  ? 'border-red-300 text-red-600 hover:bg-red-50 cursor-pointer'
                  : 'border-gray-200 text-gray-400 cursor-not-allowed',
              ].join(' ')}
            >
              איפוס הכל
            </button>
            <a
              href="/accessibility"
              className="text-xs text-blue-600 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
            >
              הצהרת נגישות
            </a>
          </div>
        </div>
      )}
    </>
  );
}
