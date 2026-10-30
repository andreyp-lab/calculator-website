import { withPageSocialMetadata } from '@/lib/config/site-info';
import type { Metadata } from 'next';

export const metadata: Metadata = withPageSocialMetadata({
  title: 'כלים פיננסיים לבעלי עסקים 2026 — בחר את הכלי הנכון לך',
  description:
    'מדריך לבחירת הכלי הפיננסי המתאים לך לשנת 2026: תקציב, תזרים, ניתוח דוחות, חיזוי ו-DCF. כלים חינמיים ללא הרשמה לבעלי עסקים קטנים ובינוניים — התחל עכשיו.',
  alternates: { canonical: '/tools/start' },
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
