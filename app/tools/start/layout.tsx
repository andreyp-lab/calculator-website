import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'התחל כאן - כלים פיננסיים | חשבונאי',
  description: 'נקודת התחלה לכלי הניהול הפיננסי - בחירת הכלי המתאים, היכרות, והדרכה.',
  alternates: { canonical: '/tools/start' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
