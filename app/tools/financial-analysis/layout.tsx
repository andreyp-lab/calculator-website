import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ניתוח דוחות כספיים | חשבונאי',
  description: 'ניתוח מקיף של דוחות כספיים - יחסים פיננסיים, Z-Score פשיטת רגל, דירוג אשראי.',
  alternates: { canonical: '/tools/financial-analysis' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
