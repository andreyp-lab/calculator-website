import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'מתכנן תקציב עסקי 2026 – הכנסות, הוצאות ו-P&L בזמן אמת',
  description: 'תכנן את תקציב העסק שלך לשנת 2026 — הכנסות, הוצאות, עלות עובדים, הלוואות ו-P&L מלא בזמן אמת. כלי מקצועי ומקיף לבעלי עסקים ועצמאיים. ללא עלות.',
  alternates: { canonical: '/tools/budget' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
