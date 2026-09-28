import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'בדיקת פיצויי פיטורים — גרסה להטמעה',
  description: 'בדיקת הזכאות לפיצויי פיטורים דורשת שכר קובע, תקופות העסקה ונתוני הפקדות; הסבר וקישור למקורות הרשמיים.',
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
        <section dir="rtl" className="border border-ink/15 p-5 text-ink">
          <h1 className="text-xl font-bold mb-3">בדיקת פיצויי פיטורים</h1>
          <p className="leading-relaxed">
            הזכאות והסכום תלויים בסיבת סיום העבודה, בשכר הקובע, בתקופות ההעסקה,
            בהפקדות בפועל ובתחולת סעיף 14. בדקו את הסכם העבודה, דוח הקרן וטופס 161.
          </p>
          <a
            className="mt-4 inline-block font-semibold text-gold underline"
            href="https://cheshbonai.co.il/employee-rights/severance"
            target="_blank"
            rel="noopener noreferrer"
          >
            הנחיות ומקורות רשמיים לבדיקת הפיצויים ↗
          </a>
        </section>
        <p className="mt-4 pt-3 border-t border-ink/15 text-center font-mono text-xs text-ink/70">
          המידע באדיבות{' '}
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
