import { Metadata } from 'next';
import { SeveranceCalculator } from '@/components/calculators/SeveranceCalculator';

export const metadata: Metadata = {
  title: 'מחשבון פיצויי פיטורין — גרסה להטמעה',
  description: 'גרסה להטמעה (embed) של מחשבון פיצויי הפיטורין של חשבונאי.',
  robots: { index: false, follow: true },
  alternates: { canonical: '/employee-rights/severance' },
};

// Hide the site chrome (Ticker/Header/Footer from the root layout) plus the
// floating accessibility widget so the iframe shows only the calculator.
const embedStyles = `
  .site-ticker, .site-header, .site-footer,
  div[class*="z-[9000]"], div[class*="z-[9001]"] {
    display: none !important;
  }
`;

export default function SeveranceEmbedPage() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: embedStyles }} />
      <div className="bg-paper p-3 sm:p-4">
        <SeveranceCalculator />
        <p className="mt-4 pt-3 border-t border-ink/15 text-center font-mono text-xs text-ink/70">
          המחשבון באדיבות{' '}
          <a
            href="https://cheshbonai.co.il/employee-rights/severance"
            target="_blank"
            rel="noopener"
            className="text-gold underline underline-offset-2 hover:text-ink"
          >
            cheshbonai.co.il
          </a>{' '}
          · אנדרי פלטונוב, רו&quot;ח
        </p>
      </div>
    </>
  );
}
