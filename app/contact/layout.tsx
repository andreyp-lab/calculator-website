import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'צור קשר - חשבונאי',
  description: 'פנייה לצוות חשבונאי: שאלות, הצעות לשיפור, דיווח על שגיאות או שיתוף פעולה. נשמח לשמוע ממך.',
  alternates: { canonical: '/contact' },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
