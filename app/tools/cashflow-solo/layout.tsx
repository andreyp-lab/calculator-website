import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'תזרים מזומנים לעצמאים 2026 – מעקב הכנסות ותשלומים',
  description: 'עקוב אחר תזרים המזומנים שלך כעצמאי לשנת 2026: הכנסות, הוצאות, מקדמות מס, מע״מ 18% וביטוח לאומי — הכל במקום אחד. ללא חיבור לתקציב, הזנה ישירה. חינם.',
  alternates: { canonical: '/tools/cashflow-solo' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
