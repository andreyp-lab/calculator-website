import { withPageSocialMetadata } from '@/lib/config/site-info';
import type { Metadata } from 'next';
import Link from 'next/link';
import { CalculatorLayout } from '@/components/calculator/CalculatorLayout';
import { FAQ } from '@/components/calculator/FAQ';
import { CurrencyConverter } from '@/components/calculators/CurrencyConverter';
import { convertCurrency } from '@/lib/calculators/currency';
import { getExchangeRates } from '@/lib/data/exchange-rates';

// שערים חיים עם ISR: הדף נבנה מחדש לכל היותר כל 6 שעות (ערך מילולי נדרש ל-Next; ראו EXCHANGE_REVALIDATE_SECONDS).
export const revalidate = 21600;

export const metadata: Metadata = withPageSocialMetadata({
  title: 'ממיר מטבעות — שער דולר, אירו ועוד לפי השער היציג',
  description:
    'המרת שקל, דולר, אירו, ליש״ט ועוד לפי השער היציג של בנק ישראל, עם חישוב עמלת המרה ושער אפקטיבי.',
  alternates: { canonical: '/investments/currency-converter' },
});

const faqItems = [
  {
    question: 'מה ההבדל בין השער היציג לשער שהבנק נותן?',
    answer:
      'השער היציג הוא שער הייחוס שבנק ישראל מפרסם. בפועל בנק, חברת אשראי או מחליף כספים מוסיפים מרווח ועמלה, ולכן תקבלו פחות. במחשבון אפשר להזין את אחוז העמלה ולראות את השער האפקטיבי.',
  },
  {
    question: 'באיזו תדירות השער מתעדכן?',
    answer:
      'השערים נמשכים ממקור חי ומתעדכנים כמה פעמים ביום. התאריך המוצג מתחת למחשבון הוא תאריך העדכון של המקור.',
  },
  {
    question: 'איך ממירים בין שני מטבעות זרים?',
    answer:
      'מחשבים דרך השקל: ממירים את הסכום לשקלים לפי שער המטבע הראשון, ואז למטבע השני לפי השער שלו. המחשבון עושה זאת אוטומטית.',
  },
  {
    question: 'האם המחשבון מתאים לדיווח מס?',
    answer:
      'לדיווח מס על הכנסה במטבע חוץ משתמשים בשער לפי הכללים של רשות המסים, ולרוב בשער היציג ביום האירוע. ראו את דף ההכנסות מחו״ל באתר ובדקו את הכללים החלים עליכם.',
  },
];

export default async function CurrencyConverterPage() {
  const rates = await getExchangeRates();
  const sample = rates
    ? convertCurrency({ amount: 1000, from: 'USD', to: 'ILS', ilsPerUnit: rates.ilsPerUnit })
    : null;

  return (
    <CalculatorLayout
      pageUrl="/investments/currency-converter"
      title="ממיר מטבעות"
      description="המרת מטבע לפי השער היציג, כולל עמלה ושער אפקטיבי."
      breadcrumbs={[
        { label: 'דף הבית', href: '/' },
        { label: 'השקעות', href: '/investments' },
        { label: 'ממיר מטבעות' },
      ]}
      lastUpdated={rates?.updatedAt ? rates.updatedAt.slice(0, 10) : '2026-11-20'}
      quickAnswer={
        <p>
          כדי להמיר מטבע, מכפילים את הסכום בשער: סכום במטבע זר × שער בשקלים = סכום בשקלים. השער היציג הוא שער
          ייחוס; הסכום שתקבלו בפועל תלוי בעמלה ובמרווח של הבנק או המחליף.
          {sample && rates?.ilsPerUnit.USD && (
            <> לפי השער הנוכחי, 1,000 דולר שווים כ־{sample.gross.toLocaleString('he-IL')} ₪.</>
          )}
        </p>
      }
      calculator={
        rates ? (
          <CurrencyConverter
            ilsPerUnit={rates.ilsPerUnit}
            updatedAt={rates.updatedAt}
            sourceLabel={rates.source === 'boi' ? 'שער יציג של בנק ישראל' : 'open.er-api.com (מקור גיבוי)'}
            sourceUrl={rates.sourceUrl}
          />
        ) : (
          <p className="my-8 border border-ink/15 bg-paper p-6 font-bold" role="alert">
            שערי החליפין אינם זמינים כרגע. נסו שוב מאוחר יותר או בדקו באתר בנק ישראל.
          </p>
        )
      }
      content={
        <>
          <h2>איך מחשבים המרת מטבע</h2>
          <p>
            לכל מטבע יש שער מול השקל. המרה מדולר לשקל: סכום בדולר כפול שער הדולר. המרה לכיוון ההפוך: סכום
            בשקלים חלקי השער. בין שני מטבעות זרים מחשבים דרך השקל.
          </p>
          <h2>למה אתם מקבלים פחות מהשער היציג</h2>
          <p>
            בנקים וחברות כרטיסי אשראי מחשבים את ההמרה בשער שכולל מרווח, ולעיתים מוסיפים עמלה קבועה. הזינו
            במחשבון את אחוז העמלה שלכם כדי לראות את השער האפקטיבי ואת עלות ההמרה בש״ח.
          </p>
          <h2>מקומות שבהם זה רלוונטי</h2>
          <ul>
            <li>
              <Link href="/personal-tax/foreign-income">הכנסות מחו״ל</Link> — המרת הכנסה במטבע זר לשקלים לצורך דיווח.
            </li>
            <li>
              <Link href="/personal-tax/crypto-tax">מס על קריפטו</Link> — קביעת שווי בשקלים בעת אירוע מס.
            </li>
            <li>
              <Link href="/investments/compound-interest">ריבית דריבית</Link> ו־<Link href="/investments/roi">תשואה על השקעה</Link> — השוואת
              השקעות במטבעות שונים.
            </li>
          </ul>
        </>
      }
      faq={<FAQ items={faqItems} />}
      sources={
        <ul>
          <li>
            <a href="https://www.boi.org.il/roles/markets/exchange-rates/" target="_blank" rel="noopener noreferrer">
              בנק ישראל — שערי חליפין יציגים
            </a>
          </li>
        </ul>
      }
    />
  );
}
