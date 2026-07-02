import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ניהול תזרים מזומנים לעסק 2026 – מחובר לתקציב',
  description: 'מערכת ניהול תזרים מזומנים לעסק, מחוברת למערכת התקציב: תחזית חודשית, חשבונות בנק, עיכובי גבייה, פריסת חוב, Burn Rate ו-Runway. כלי חינמי.',
  alternates: { canonical: '/tools/cash-flow' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
