import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'מתכנן תקציב עסקי',
  description: 'תכנון תקציב שנתי לעסק: הכנסות, הוצאות, קו מטרה ומעקב ביצוע. כלי מקצועי לבעלי עסקים ועצמאיים.',
  alternates: { canonical: '/tools/budget' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
