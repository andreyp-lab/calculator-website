import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'מערכת ניהול פיננסי מאוחדת לעסקים 2026 — תקציב, תזרים וניתוח',
  description: 'תקציב + תזרים + ניתוח כספי + חיזוי במערכת אחת מסונכרנת. 30+ כלי ניתוח לבעלי עסקים: P&L, DuPont, DSCR, Monte Carlo ועוד — נסה בחינם ללא הרשמה.',
  alternates: { canonical: '/tools/unified' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
