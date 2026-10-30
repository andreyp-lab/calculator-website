import { withPageSocialMetadata } from '@/lib/config/site-info';
import type { Metadata } from 'next';

export const metadata: Metadata = withPageSocialMetadata({
  title: 'אשף תקציב עסקי 2026 – בניית תקציב עסקי שלב אחר שלב',
  description: 'בנה תקציב עסקי מקצועי לשנת 2026 בתהליך מודרך: הגדרת יעדים עסקיים, תחזית הכנסות, תכנון הוצאות ויצירת דוח P&L שנתי מלא. 10 שלבים פשוטים, בחינם.',
  alternates: { canonical: '/tools/budget-wizard' },
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
