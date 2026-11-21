import { withPageSocialMetadata } from '@/lib/config/site-info';
import type { Metadata } from 'next';
import Link from 'next/link';
import { CalculatorLayout } from '@/components/calculator/CalculatorLayout';
import { FAQ } from '@/components/calculator/FAQ';
import { UtilityBillsCalculator } from '@/components/calculators/UtilityBillsCalculator';
import { calculateElectricityBill, calculateWaterBill } from '@/lib/calculators/utility-bills';
import { ELECTRICITY_HOUSEHOLD_2026, WATER_HOUSEHOLD_2026 } from '@/lib/constants/utilities-2026';
import { VAT_2026 } from '@/lib/constants/tax-2026';

export const metadata: Metadata = withPageSocialMetadata({
  title: 'מחשבון חשבון חשמל ומים 2026 — תעריף לקוט״ש ולמ״ק',
  description:
    'חשבו חשבון חשמל ומים ביתי לפי תעריפי רשות החשמל ורשות המים: צריכה, תשלום קבוע, מכסת מים לפי נפשות ומע״מ.',
  alternates: { canonical: '/savings/utility-bills' },
});

// דוגמאות מחושבות מהמנוע ומהקבועים — הטקסט לא מוקלד ידנית.
const E = calculateElectricityBill({ kwh: 600, billingMonths: 2, phase: 'single' })!;
const W = calculateWaterBill({ m3: 25, persons: 4, billingMonths: 2 })!;
const money = (v: number) => `${v.toLocaleString('he-IL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₪`;
const vatPct = `${Math.round(VAT_2026.standard * 100)}%`;
const priceWithVat = (ELECTRICITY_HOUSEHOLD_2026.agorotPerKwh * (1 + VAT_2026.standard)).toFixed(2);

const faqItems = [
  {
    question: 'כמה עולה קוט״ש חשמל לבית?',
    answer: `לפי ספר התעריפים של רשות החשמל, התעריף האחיד לצרכן ביתי הוא ${ELECTRICITY_HOUSEHOLD_2026.agorotPerKwh} אגורות לקוט״ש ללא מע״מ (כ־${priceWithVat} אגורות עם מע״מ ${vatPct}), בתוקף מ־1.7.2026. בנוסף יש תשלום קבוע לשירותי צרכנות ותשלום קיבולת. התעריף מתעדכן בתחילת כל חצי שנה.`,
  },
  {
    question: 'האם יש תעריף שעות ביום (תעו״ז) לבית?',
    answer:
      'צרכן ביתי משלם תעריף אחיד כברירת מחדל. תעריף לפי שעות חל בחובה רק על צרכנים גדולים, ויש אפשרות וולונטרית. המחשבון מבוסס על התעריף האחיד.',
  },
  {
    question: 'איך מחושבת מכסת המים?',
    answer: `המכסה היא ${WATER_HOUSEHOLD_2026.quotaM3PerPersonPerMonth} מ״ק לנפש בחודש, ולא פחות מ־${WATER_HOUSEHOLD_2026.minQuotaM3PerMonth} מ״ק בחודש ליחידת דיור. משפחה של ארבע נפשות מקבלת 14 מ״ק בחודש, כלומר 28 מ״ק בחשבון דו־חודשי.`,
  },
  {
    question: 'כמה עולה מ״ק מים?',
    answer: `לפי ספר התעריפים של רשות המים מ־1.1.2026: ${WATER_HOUSEHOLD_2026.quotaPricePerM3} ₪ למ״ק ללא מע״מ בתוך המכסה ו־${WATER_HOUSEHOLD_2026.aboveQuotaPricePerM3} ₪ מעבר למכסה, כולל ביוב לצרכני תאגידי מים.`,
  },
  {
    question: 'למה החשבון שלי שונה מהמחשבון?',
    answer:
      'החשבון בפועל כולל גם תשלום קיבולת לפי גודל החיבור, תיקוני מדידה, הנחות רווחה, ריבית פיגורים ותעריף ביוב מקומי ברשויות שטרם התאגדו. המחשבון מציג אומדן לפי התעריפים הכלליים.',
  },
];

export default function UtilityBillsPage() {
  return (
    <CalculatorLayout
      pageUrl="/savings/utility-bills"
      title="מחשבון חשבון חשמל ומים"
      description="אומדן לחשבון חשמל ולחשבון מים וביוב ביתי לפי תעריפי 2026."
      breadcrumbs={[
        { label: 'דף הבית', href: '/' },
        { label: 'חיסכון וחובות', href: '/savings' },
        { label: 'חשבון חשמל ומים' },
      ]}
      lastUpdated="2026-11-20"
      quickAnswer={
        <p>
          חשבון חשמל = צריכה × {ELECTRICITY_HOUSEHOLD_2026.agorotPerKwh} אגורות לקוט״ש + תשלום קבוע, ועליהם מע״מ {vatPct}.
          למשל, 600 קוט״ש בחשבון דו־חודשי עולים {money(E.total)} (כ־{money(E.effectivePerKwh)} לקוט״ש, בלי תשלום קיבולת).
          במים, 25 מ״ק בחשבון דו־חודשי לארבע נפשות (מכסה של 28 מ״ק) עולים {money(W.total)} כולל ביוב ומע״מ.
        </p>
      }
      calculator={<UtilityBillsCalculator />}
      content={
        <>
          <h2>איך מחושב חשבון החשמל</h2>
          <p>
            החשבון כולל שלושה רכיבים: תשלום לפי צריכה (אגורות לקוט״ש), תשלום קבוע לשירותי צרכנות לכל חשבון, ותשלום
            קיבולת לפי גודל החיבור. על הסכום חל מע״מ. התעריפים נקבעים על ידי רשות החשמל ומתעדכנים בתחילת כל חצי שנה.
          </p>
          <h3>דוגמה מחושבת</h3>
          <p>
            600 קוט״ש × {ELECTRICITY_HOUSEHOLD_2026.agorotPerKwh} אגורות = {money(E.energy)}; תשלום קבוע {money(E.fixed)};
            סך לפני מע״מ {money(E.beforeVat)}; מע״מ {money(E.vat)}; סך הכול {money(E.total)}.
          </p>

          <h2>איך מחושב חשבון המים</h2>
          <p>
            לכל יחידת דיור מכסה של מים בתעריף נמוך, לפי מספר הנפשות. צריכה מעבר למכסה מחויבת בתעריף גבוה יותר. תעריף
            המים כולל ביוב אצל צרכני תאגידי מים.
          </p>
          <h3>דוגמה מחושבת</h3>
          <p>
            ארבע נפשות, חשבון דו־חודשי: מכסה של {W.quotaM3} מ״ק. צריכה של 25 מ״ק × {WATER_HOUSEHOLD_2026.quotaPricePerM3} ₪ ={' '}
            {money(W.beforeVat)} לפני מע״מ; עם מע״מ {money(W.total)}.
          </p>

          <h2>איפה זה נכנס בתקציב</h2>
          <p>
            חשמל ומים הם הוצאות קבועות בתקציב הבית. הוסיפו אותם ל<Link href="/savings/family-budget">תקציב המשפחתי</Link> יחד עם{' '}
            <Link href="/real-estate/arnona">ארנונה</Link>, וכשבודקים דירה חדשה ראו את{' '}
            <Link href="/real-estate/first-home-budget">תקציב דירה ראשונה</Link>.
          </p>
        </>
      }
      faq={<FAQ items={faqItems} />}
      sources={
        <ul>
          <li>
            <a href={ELECTRICITY_HOUSEHOLD_2026.sourceUrl} target="_blank" rel="noopener noreferrer">
              רשות החשמל — ספר התעריפים, יולי 2026
            </a>
          </li>
          <li>
            <a href={WATER_HOUSEHOLD_2026.sourceUrl} target="_blank" rel="noopener noreferrer">
              רשות המים — ספר התעריפים, ינואר 2026
            </a>
          </li>
        </ul>
      }
    />
  );
}
