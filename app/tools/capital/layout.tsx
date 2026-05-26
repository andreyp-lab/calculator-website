import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'הון חוזר | חשבונאי',
  description: 'חישוב והערכת הון חוזר עסקי - יחסי נזילות, מימון תפעולי, ואופטימיזציה.',
  alternates: { canonical: '/tools/capital' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
