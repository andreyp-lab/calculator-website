import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'תזרים מזומנים עסקי 2026 – ניהול, תחזית ו-Burn Rate',
  description: 'נהל את תזרים המזומנים של העסק שלך לשנת 2026: תחזית חודשית, ניתוח פערים, זיהוי סיכוני נזילות, Burn Rate ו-Runway. מתחבר לתקציב האחוד. כלי חינמי.',
  alternates: { canonical: '/tools/cash-flow' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
