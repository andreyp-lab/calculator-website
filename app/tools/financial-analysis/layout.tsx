import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ניתוח דוחות כספיים מקיף לעסקים 2026 — יחסים, DuPont, DSCR',
  description: 'ניתוח מעמיק של דוחות כספיים 2026: יחסים פיננסיים, DuPont, DSCR מתקדם, Z-Score ונקודת איזון. כלי מקצועי לבעלי עסקים ורואי חשבון — נסה עכשיו בחינם.',
  alternates: { canonical: '/tools/financial-analysis' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
