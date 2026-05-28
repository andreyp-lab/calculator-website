import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'הון חוזר - ניהול ואופטימיזציה',
  description: 'חישוב והערכת הון חוזר: יחסי נזילות, מחזור לקוחות וספקים, מימון תפעולי ואסטרטגיות לשיפור תזרים.',
  alternates: { canonical: '/tools/capital' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
