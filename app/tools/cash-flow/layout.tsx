import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'תזרים מזומנים | חשבונאי',
  description: 'מערכת ניהול תזרים מזומנים לעסקים - יתרות בנק, תחזיות, ניהול עיכובים, ותרחישים.',
  alternates: { canonical: '/tools/cash-flow' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
