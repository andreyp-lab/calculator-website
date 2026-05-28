import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ניתוח דוחות כספיים',
  description: 'ניתוח מעמיק של דוחות כספיים: יחסים פיננסיים, Z-Score פשיטת רגל, דירוג אשראי ועוד. לבעלי עסקים ורואי חשבון.',
  alternates: { canonical: '/tools/financial-analysis' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
