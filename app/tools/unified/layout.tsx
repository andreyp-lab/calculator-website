import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'מערכת מאוחדת - תקציב + תזרים + ניתוח | חשבונאי',
  description: 'מערכת ניהול פיננסי מקיפה - תקציב, תזרים מזומנים, וניתוח דוחות במקום אחד.',
  alternates: { canonical: '/tools/unified' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
