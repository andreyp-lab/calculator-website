import { Metadata } from 'next';
import { VatBasicCalculator } from '@/components/calculators/VatBasicCalculator';

export const metadata: Metadata = {
  title: 'מחשבון הוספה וחילוץ מע"מ — גרסה להטמעה',
  description: 'חישוב הוספה או חילוץ מע"מ בסיסי בשיעור 18%; הגרסה להטמעה של חשבונאי.',
  robots: { index: false, follow: true },
  alternates: { canonical: '/self-employed/vat' },
};

// Hide the site chrome (Ticker/Header/Footer from the root layout) plus the
// floating accessibility widget so the iframe shows only the calculator.
const embedStyles = `
  .site-ticker, .site-header, .site-footer,
  div[class*="z-[9000]"], div[class*="z-[9001]"] {
    display: none !important;
  }
`;

export default function VatEmbedPage() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: embedStyles }} />
      <div className="bg-paper p-3 sm:p-4">
        <VatBasicCalculator />
        <p className="mt-4 pt-3 border-t border-ink/15 text-center font-mono text-xs text-ink/70">
          המחשבון באדיבות{' '}
          <a
            href="https://cheshbonai.co.il/self-employed/vat"
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
