import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'חיזוי פיננסי ומודלים עסקיים',
  description: 'מודלים פיננסיים מתקדמים: 3-Statement Model, ניתוח Monte Carlo, תחזיות הכנסה וניתוח קוהורט לצמיחת עסק.',
  alternates: { canonical: '/tools/forecast' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
