'use client';

/**
 * SkipToContent — hidden link that becomes visible on keyboard focus.
 * Allows keyboard/screen-reader users to skip repeated navigation.
 * Target: <main id="main-content"> in layout.tsx
 */
export function SkipToContent() {
  return (
    <a
      href="#main-content"
      className={[
        // Visually hidden by default; shown on focus
        'sr-only focus:not-sr-only',
        'focus:fixed focus:top-4 focus:right-4 focus:z-[9999]',
        'focus:bg-blue-600 focus:text-white',
        'focus:px-4 focus:py-2 focus:rounded-md',
        'focus:font-bold focus:text-sm',
        'focus:shadow-lg focus:outline-2 focus:outline-white',
        // RTL: position right
      ].join(' ')}
    >
      דלג לתוכן הראשי
    </a>
  );
}
