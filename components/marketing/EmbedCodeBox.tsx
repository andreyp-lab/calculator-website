'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

const SITE_URL = 'https://cheshbonai.co.il';

interface EmbedCodeBoxProps {
  /** embed slug, e.g. "severance" → /embed/severance */
  slug: string;
  /** iframe title attribute (accessibility), e.g. "מחשבון פיצויי פיטורין" */
  title?: string;
}

/**
 * "הטמע את המחשבון באתר שלך" — editorial box with a ready-to-copy iframe
 * snippet pointing at /embed/[slug]. Rendered on the full calculator pages.
 */
export function EmbedCodeBox({ slug, title = 'מחשבון חשבונאי' }: EmbedCodeBoxProps) {
  const [copied, setCopied] = useState(false);

  const embedCode = `<iframe src="${SITE_URL}/embed/${slug}" title="${title}" width="100%" height="640" style="width:100%;max-width:100%;border:1px solid #e5e0d5;" loading="lazy"></iframe>`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(embedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API unavailable — the textarea is selectable as a fallback
    }
  };

  return (
    <section className="border border-ink/15 bg-paper p-5 sm:p-6">
      <p className="font-mono text-xs uppercase tracking-[0.14em] text-gold mb-2">
        Embed ✦ להטמעה
      </p>
      <h2 className="text-xl font-bold text-ink mb-2">הטמע את המחשבון באתר שלך</h2>
      <p className="text-sm text-ink/70 mb-4">
        העתק את הקוד והדבק אותו בעמוד באתר שלך — המחשבון יוצג בתוך iframe,
        מתעדכן אוטומטית וללא עלות. נשמח לקרדיט עם קישור.
      </p>
      <textarea
        readOnly
        dir="ltr"
        value={embedCode}
        rows={3}
        onFocus={(e) => e.currentTarget.select()}
        className="w-full border border-ink/15 bg-cream p-3 font-mono text-xs text-ink/80 resize-none focus:outline-none focus:border-gold"
        aria-label="קוד הטמעה"
      />
      <button
        type="button"
        onClick={handleCopy}
        className="mt-3 inline-flex items-center gap-2 border border-ink bg-ink px-4 py-2 font-mono text-xs uppercase tracking-[0.14em] text-cream hover:bg-ink-deep transition-colors"
      >
        {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
        {copied ? 'הועתק!' : 'העתק קוד'}
      </button>
    </section>
  );
}
