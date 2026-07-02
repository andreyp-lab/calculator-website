import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'מחשבון תזרים מזומנים לעצמאי 2026 – כלי פשוט לפרילנסר',
  description: 'מחשבון תזרים מזומנים לעצמאי ולפרילנסר: הזנה ישירה של תקבולים ותשלומים לפי תאריכים, בלי חיבור לתקציב ובלי הגדרות מיותרות. מעקב הכנסות, הוצאות ויתרה מצטברת. חינם.',
  alternates: { canonical: '/tools/cashflow-solo' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
