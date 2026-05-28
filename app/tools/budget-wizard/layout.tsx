import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'אשף תקציב עסקי - שלב אחר שלב',
  description: 'בניית תקציב עסקי בתהליך מודרך: הגדרת יעדים, תחזית הכנסות, תכנון הוצאות ויצירת תקציב שנתי מלא.',
  alternates: { canonical: '/tools/budget-wizard' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
