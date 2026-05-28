import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'תזרים מזומנים - ניהול והתחזית',
  description: 'ניהול תזרים מזומנים לעסק: תחזית חודשית, ניתוח פערים בין תקציב לביצוע, זיהוי סיכוני נזילות ותכנון קדימה.',
  alternates: { canonical: '/tools/cash-flow' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
