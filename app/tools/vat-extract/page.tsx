import { Metadata } from 'next';
import { CalculatorLayout } from '@/components/calculator/CalculatorLayout';
import { VatExtractCalculator } from '@/components/calculators/VatExtractCalculator';
import { FAQ } from '@/components/calculator/FAQ';
import { extractVat, addVat, VAT_EXTRACT_RATE } from '@/lib/calculators/vat-extract';
import { formatCurrency } from '@/lib/utils/formatters';

// ============================================================
// כל מספר בעמוד מחושב מהמנוע / מהקבוע — אין מספרים ידניים
// ============================================================
const RATE_PCT = (VAT_EXTRACT_RATE * 100).toFixed(0); // "18"
const DIVISOR = (1 + VAT_EXTRACT_RATE).toFixed(2); // "1.18"
const EFFECTIVE_PCT = ((VAT_EXTRACT_RATE / (1 + VAT_EXTRACT_RATE)) * 100).toFixed(2); // "15.25"

// דוגמה מעובדת — מחושבת מהמנוע
const exampleAdd = addVat(1000); // 1,000 נטו → ברוטו
const exampleExtract = extractVat(exampleAdd.gross); // חילוץ חזרה
const exampleOdd = extractVat(500); // דוגמת אגורות

export const metadata: Metadata = {
  title: `מחשבון חילוץ מע"מ ${RATE_PCT}% — סכום לפני מע"מ`,
  description: `מחשבון חילוץ מע"מ: הזינו סכום כולל מע"מ וקבלו מיד את הסכום לפני מע"מ ואת רכיב המע"מ (${RATE_PCT}%). כולל הוספת מע"מ, נוסחה ודוגמה מחושבת.`,
  alternates: { canonical: '/tools/vat-extract' },
  openGraph: {
    title: `מחשבון חילוץ מע"מ ${RATE_PCT}%`,
    description: `חילוץ מע"מ מסכום כולל: חלוקה ב-${DIVISOR} נותנת את הסכום לפני מע"מ. מחשבון מיידי בשני הכיוונים.`,
    images: ['/opengraph-image'],
  },
};

const faqItems = [
  {
    question: 'איך מחלצים מע"מ מסכום שכולל מע"מ?',
    answer: `מחלקים את הסכום הכולל ב-${DIVISOR}: סכום לפני מע"מ = סכום כולל ÷ ${DIVISOR}. רכיב המע"מ הוא ההפרש. דוגמה: ${formatCurrency(exampleExtract.gross)} ÷ ${DIVISOR} = ${formatCurrency(exampleExtract.base)} לפני מע"מ, ורכיב המע"מ הוא ${formatCurrency(exampleExtract.vat)}.`,
  },
  {
    question: `למה לא מורידים פשוט ${RATE_PCT}% מהסכום הכולל?`,
    answer: `כי המע"מ מחושב על הסכום לפני מע"מ, לא על הסכום הכולל. הורדת ${RATE_PCT}% מהסכום הכולל תיתן תוצאה נמוכה מדי. רכיב המע"מ מתוך הסכום הכולל הוא בפועל כ-${EFFECTIVE_PCT}% (${RATE_PCT}/1${RATE_PCT}), ולכן הדרך הנכונה היא חלוקה ב-${DIVISOR}.`,
  },
  {
    question: 'איך מוסיפים מע"מ לסכום נטו (הכיוון ההפוך)?',
    answer: `מכפילים את הסכום ללא מע"מ ב-${DIVISOR}. דוגמה: ${formatCurrency(exampleAdd.net)} × ${DIVISOR} = ${formatCurrency(exampleAdd.gross)} כולל מע"מ, מתוכם ${formatCurrency(exampleAdd.vat)} מע"מ. המחשבון בעמוד זה תומך בשני הכיוונים.`,
  },
  {
    question: 'מתי צריך לחלץ מע"מ בפועל?',
    answer: `בעיקר כשמקבלים מחיר "כולל מע"מ" וצריך את הבסיס: הפקת חשבונית מס מסכום סופי שסוכם עם לקוח, רישום הוצאה בהנהלת חשבונות (מע"מ תשומות לקיזוז), או השוואת הצעות מחיר שחלקן כוללות מע"מ וחלקן לא. עוסק מורשה מקזז את רכיב המע"מ שחולץ מהוצאות עסקיות מוכרות.`,
  },
];

export default function VatExtractPage() {
  return (
    <CalculatorLayout
      title={`מחשבון חילוץ מע"מ ${RATE_PCT}%`}
      description={`חילוץ רכיב המע"מ והסכום לפני מע"מ מכל סכום כולל — וגם הכיוון ההפוך (הוספת מע"מ). חישוב מיידי, מעוגל לאגורות, לפי השיעור הרגיל של ${RATE_PCT}%.`}
      breadcrumbs={[
        { label: 'דף הבית', href: '/' },
        { label: 'כלים פיננסיים', href: '/tools' },
        { label: 'חילוץ מע"מ' },
      ]}
      pageUrl="/tools/vat-extract"
      lastUpdated="2026-07-30"
      quickAnswer={
        <p className="text-lg text-ink leading-relaxed">
          כדי לחלץ מע&quot;מ מסכום שכולל מע&quot;מ — <strong>מחלקים ב-{DIVISOR}</strong>: סכום
          לפני מע&quot;מ = סכום כולל ÷ {DIVISOR}, ורכיב המע&quot;מ הוא ההפרש. למשל,{' '}
          {formatCurrency(exampleExtract.gross)} כולל מע&quot;מ הם{' '}
          {formatCurrency(exampleExtract.base)} לפני מע&quot;מ ועוד{' '}
          {formatCurrency(exampleExtract.vat)} מע&quot;מ. שימו לב: רכיב המע&quot;מ מתוך הסכום
          הכולל הוא כ-{EFFECTIVE_PCT}% — לא {RATE_PCT}% — כי המע&quot;מ מחושב על הבסיס, לא על
          הסכום הסופי.
        </p>
      }
      calculator={<VatExtractCalculator />}
      content={
        <>
          <h2>הנוסחה לחילוץ מע&quot;מ</h2>
          <ul>
            <li>
              <strong>סכום לפני מע&quot;מ</strong> = סכום כולל ÷ {DIVISOR}
            </li>
            <li>
              <strong>רכיב המע&quot;מ</strong> = סכום כולל − סכום לפני מע&quot;מ (שווה ערך ל-סכום
              כולל × {RATE_PCT}/1{RATE_PCT} ≈ {EFFECTIVE_PCT}% מהסכום הכולל)
            </li>
          </ul>

          <h2>דוגמה מעובדת</h2>
          <p>
            קיבלתם תשלום של {formatCurrency(exampleExtract.gross)} כולל מע&quot;מ וצריכים להפיק
            חשבונית מס:
          </p>
          <ul>
            <li>
              {formatCurrency(exampleExtract.gross)} ÷ {DIVISOR} ={' '}
              <strong>{formatCurrency(exampleExtract.base)}</strong> לפני מע&quot;מ
            </li>
            <li>
              רכיב המע&quot;מ: {formatCurrency(exampleExtract.gross)} −{' '}
              {formatCurrency(exampleExtract.base)} ={' '}
              <strong>{formatCurrency(exampleExtract.vat)}</strong>
            </li>
          </ul>
          <p>
            וכשהסכום לא מתחלק יפה, המחשבון מעגל לאגורות: {formatCurrency(exampleOdd.gross)} כולל
            מע&quot;מ הם {formatCurrency(exampleOdd.base)} לפני מע&quot;מ ועוד{' '}
            {formatCurrency(exampleOdd.vat)} מע&quot;מ — והסכום תמיד מתאזן בדיוק.
          </p>

          <h2>הכיוון ההפוך: הוספת מע&quot;מ</h2>
          <p>
            כשיש לכם מחיר נטו וצריך את המחיר הסופי — מכפילים ב-{DIVISOR}:{' '}
            {formatCurrency(exampleAdd.net)} × {DIVISOR} ={' '}
            <strong>{formatCurrency(exampleAdd.gross)}</strong>, מתוכם{' '}
            {formatCurrency(exampleAdd.vat)} מע&quot;מ.
          </p>

          <h2>כלים ומדריכים קשורים</h2>
          <ul>
            <li>
              <a href="/self-employed/vat" className="text-gold hover:underline">
                מחשבון מע&quot;מ המלא
              </a>{' '}
              — דוח דו-חודשי, מעקב חשבוניות, סוגי עוסקים, יבוא ותרחישי הנחה
            </li>
            <li>
              <a href="/blog/vat-complete-guide-israel" className="text-gold hover:underline">
                המדריך המלא למע&quot;מ בישראל
              </a>{' '}
              — מי חייב, מי פטור, ואיך מדווחים
            </li>
          </ul>
        </>
      }
      faq={<FAQ items={faqItems} />}
      sources={
        <ul className="space-y-2 text-gold">
          <li>
            <a
              href="https://www.gov.il/he/departments/israel_tax_authority"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              רשות המסים — מע&quot;מ
            </a>
          </li>
          <li>
            <a
              href="https://www.kolzchut.org.il/he/%D7%9E%D7%A1_%D7%A2%D7%A8%D7%9A_%D7%9E%D7%95%D7%A1%D7%A3_(%D7%9E%D7%A2%22%D7%9E)"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              כל-זכות: מע&quot;מ
            </a>
          </li>
        </ul>
      }
    />
  );
}
