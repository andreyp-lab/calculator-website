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
      <label htmlFor={id} className="text-sm text-ink/70 cursor-pointer flex-1">
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
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-1',
          checked ? 'bg-ink' : 'bg-ink/20',
        ].join(' ')}
      >
        <span
          aria-hidden="true"
          className={[
            'inline-block w-4 h-4 rounded-full bg-paper shadow transform transition-transform duration-200 mt-0.5',
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
      <p className="text-sm text-ink/70 mb-2 font-medium">גודל טקסט</p>
      <div className="flex gap-1" role="group" aria-label="גודל טקסט">
        {([0, 1, 2, 3] as TextSize[]).map((size) => (
          <button
            key={size}
            onClick={() => updateSetting('textSize', size)}
            aria-pressed={settings.textSize === size}
            aria-label={TEXT_SIZE_LABELS[size]}
            className={[
              'flex-1 py-1 text-xs rounded-none border transition-colors duration-150',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-gold',
              settings.textSize === size
                ? 'bg-ink text-cream border-ink'
                : 'bg-paper text-ink/70 border-ink/15 hover:bg-paper-hover',
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
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gold',
            hasActiveSettings
              ? 'bg-ink text-cream hover:bg-ink-deep'
              : 'bg-paper text-ink border-2 border-ink hover:bg-paper-hover',
          ].join(' ')}
        >
          <span aria-hidden="true">♿</span>
          {hasActiveSettings && (
            <span
              aria-hidden="true"
              className="absolute top-0 left-0 w-3 h-3 rounded-full bg-gold border border-cream"
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
            'w-72 bg-paper rounded-none shadow-2xl border border-ink/15',
            'overflow-y-auto max-h-[80vh]',
          ].join(' ')}
        >
          {/* Panel header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-ink/15 bg-cream-2 rounded-none">
            <h2 className="font-bold text-ink text-base" id="a11y-panel-title">
              הגדרות נגישות
            </h2>
            <button
              onClick={() => {
                setIsOpen(false);
                triggerRef.current?.focus();
              }}
              aria-label="סגור תפריט נגישות"
              className="text-ink/60 hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-none p-1"
            >
              <span aria-hidden="true" className="text-lg">✕</span>
            </button>
          </div>

          {/* Panel body */}
          <div className="px-4 py-2 divide-y divide-ink/10">

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
          <div className="px-4 py-3 border-t border-ink/15 flex justify-between items-center">
            <button
              onClick={resetSettings}
              disabled={!hasActiveSettings}
              aria-label="איפוס כל הגדרות הנגישות"
              className={[
                'text-xs py-1.5 px-3 rounded-none border transition-colors',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400',
                hasActiveSettings
                  ? 'border-red-300 text-red-600 hover:bg-red-50 cursor-pointer'
                  : 'border-ink/15 text-ink/45 cursor-not-allowed',
              ].join(' ')}
            >
              איפוס הכל
            </button>
            <a
              href="/accessibility"
              className="text-xs text-gold hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-none"
            >
              הצהרת נגישות
            </a>
          </div>
        </div>
      )}
    </>
  );
}
