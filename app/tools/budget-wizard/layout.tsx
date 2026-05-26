import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'אשף תקציב חכם | חשבונאי',
  description: 'אשף בניית תקציב עסקי מהיר - שאלון של 5 דקות שיוצר תקציב מותאם לעסק שלך.',
  alternates: { canonical: '/tools/budget-wizard' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
