'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

export type TextSize = 0 | 1 | 2 | 3;

export interface AccessibilitySettings {
  textSize: TextSize;          // 0=default, 1=large, 2=larger, 3=largest
  highContrast: boolean;       // black bg, yellow text
  invertedContrast: boolean;   // inverted colors
  highlightLinks: boolean;     // underline + bold links
  highlightHeadings: boolean;  // bold + underline headings
  readableFont: boolean;       // Arial/Verdana
  stopAnimations: boolean;     // disable transitions + prefers-reduced-motion
  largeCursor: boolean;        // 3× cursor size
  emphasizedFocus: boolean;    // thick focus indicators
  lineSpacing: boolean;        // line-height 2
}

const DEFAULT_SETTINGS: AccessibilitySettings = {
  textSize: 0,
  highContrast: false,
  invertedContrast: false,
  highlightLinks: false,
  highlightHeadings: false,
  readableFont: false,
  stopAnimations: false,
  largeCursor: false,
  emphasizedFocus: false,
  lineSpacing: false,
};

const STORAGE_KEY = 'cheshbonai-a11y-settings';

interface AccessibilityContextType {
  settings: AccessibilitySettings;
  updateSetting: <K extends keyof AccessibilitySettings>(
    key: K,
    value: AccessibilitySettings[K]
  ) => void;
  resetSettings: () => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | null>(null);

export function useAccessibility() {
  const ctx = useContext(AccessibilityContext);
  if (!ctx) throw new Error('useAccessibility must be used within AccessibilityProvider');
  return ctx;
}

/** Map settings → HTML class names applied to <html> element */
function buildClassList(settings: AccessibilitySettings): string[] {
  const classes: string[] = [];

  if (settings.textSize === 1) classes.push('a11y-text-lg');
  if (settings.textSize === 2) classes.push('a11y-text-xl');
  if (settings.textSize === 3) classes.push('a11y-text-2xl');

  if (settings.highContrast) classes.push('a11y-high-contrast');
  if (settings.invertedContrast) classes.push('a11y-inverted');
  if (settings.highlightLinks) classes.push('a11y-highlight-links');
  if (settings.highlightHeadings) classes.push('a11y-highlight-headings');
  if (settings.readableFont) classes.push('a11y-readable-font');
  if (settings.stopAnimations) classes.push('a11y-no-animations');
  if (settings.largeCursor) classes.push('a11y-large-cursor');
  if (settings.emphasizedFocus) classes.push('a11y-focus-visible');
  if (settings.lineSpacing) classes.push('a11y-line-spacing');

  return classes;
}

const A11Y_CLASSES = [
  'a11y-text-lg',
  'a11y-text-xl',
  'a11y-text-2xl',
  'a11y-high-contrast',
  'a11y-inverted',
  'a11y-highlight-links',
  'a11y-highlight-headings',
  'a11y-readable-font',
  'a11y-no-animations',
  'a11y-large-cursor',
  'a11y-focus-visible',
  'a11y-line-spacing',
];

function applyClassesToHtml(settings: AccessibilitySettings) {
  if (typeof document === 'undefined') return;
  const html = document.documentElement;
  // Remove all a11y classes first
  A11Y_CLASSES.forEach((cls) => html.classList.remove(cls));
  // Apply active ones
  buildClassList(settings).forEach((cls) => html.classList.add(cls));
}

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<AccessibilitySettings>(DEFAULT_SETTINGS);
  const [isOpen, setIsOpen] = useState(false);

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as Partial<AccessibilitySettings>;
        const merged = { ...DEFAULT_SETTINGS, ...parsed };
        setSettings(merged);
        applyClassesToHtml(merged);
      }
    } catch {
      // ignore parse errors
    }
  }, []);

  // Persist & apply on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {
      // ignore storage errors
    }
    applyClassesToHtml(settings);
  }, [settings]);

  const updateSetting = useCallback(
    <K extends keyof AccessibilitySettings>(key: K, value: AccessibilitySettings[K]) => {
      setSettings((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const resetSettings = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    applyClassesToHtml(DEFAULT_SETTINGS);
  }, []);

  return (
    <AccessibilityContext.Provider
      value={{ settings, updateSetting, resetSettings, isOpen, setIsOpen }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
}
