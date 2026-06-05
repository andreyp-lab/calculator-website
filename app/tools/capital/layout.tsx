import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'כלי הון, שווי וגיוס 2026 – DCF Valuation ו-Cap Table',
  description: 'הערך את שווי החברה שלך בשיטת DCF ונהל את מבנה ההון עם Cap Table מקצועי. מחשב דילול מניות, סבבי גיוס ויציאות לחברות סטארטאפ ועסקים בישראל 2026.',
  alternates: { canonical: '/tools/capital' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
