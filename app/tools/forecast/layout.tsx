import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'חיזוי פיננסי ומודלים עסקיים 2026 — 3-Statement, Monte Carlo, DCF',
  description: 'מודלים פיננסיים מתקדמים: 3-Statement Model, ניתוח Monte Carlo, תחזיות הכנסה וניתוח קוהורט. בנה תחזית DCF ו-Cap Table ליזמים ומנהלים פיננסיים — נסה בחינם.',
  alternates: { canonical: '/tools/forecast' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
