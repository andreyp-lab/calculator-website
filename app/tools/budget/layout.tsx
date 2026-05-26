import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'תכנון תקציב | חשבונאי',
  description: 'תכנון תקציב עסקי מקיף - הכנסות, הוצאות, עובדים, P&L. עם הצגת תרחישים והשוואה.',
  alternates: { canonical: '/tools/budget' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
