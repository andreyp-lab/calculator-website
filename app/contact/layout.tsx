import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'יצירת קשר | חשבונאי',
  description: 'יצירת קשר עם צוות חשבונאי - שאלות, הצעות, ושיתופי פעולה.',
  alternates: { canonical: '/contact' },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
