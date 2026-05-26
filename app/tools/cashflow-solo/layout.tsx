import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'תזרים סולו - לעצמאיים | חשבונאי',
  description: 'תזרים מזומנים מפושט לעצמאיים ובעלי עסקים קטנים. ניהול הכנסות, הוצאות, ומאזן בנק.',
  alternates: { canonical: '/tools/cashflow-solo' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
