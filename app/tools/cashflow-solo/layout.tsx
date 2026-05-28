import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'תזרים מזומנים לעצמאים',
  description: 'מעקב תזרים מזומנים לעצמאי: הכנסות, הוצאות, מקדמות מס, מע״מ וביטוח לאומי — הכל במקום אחד.',
  alternates: { canonical: '/tools/cashflow-solo' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
