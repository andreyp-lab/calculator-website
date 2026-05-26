import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'חיזוי פיננסי | חשבונאי',
  description: 'מודלים פיננסיים מתקדמים - 3-Statement Model, Monte Carlo, ניתוח קוהורט.',
  alternates: { canonical: '/tools/forecast' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
