import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'התחל כאן - כלים לבעלי עסקים',
  description: 'מדריך לבחירת הכלי הפיננסי המתאים לך: תקציב, תזרים, ניתוח כספי — מצא את הכלי שמתאים לעסק שלך.',
  alternates: { canonical: '/tools/start' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
