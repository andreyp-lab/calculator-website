import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'מערכת ניהול פיננסי מאוחדת',
  description: 'תקציב + תזרים + ניתוח כספי במערכת אחת: ניהול פיננסי מקיף לעסקים, צפייה ב-P&L ותכנון לטווח ארוך.',
  alternates: { canonical: '/tools/unified' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
