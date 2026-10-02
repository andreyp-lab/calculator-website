import type { Metadata } from 'next';
import Link from 'next/link';
import { CalculatorLayout } from '@/components/calculator/CalculatorLayout';
import { FAQ } from '@/components/calculator/FAQ';
import { TaxRefundCalculator } from '@/components/calculators/TaxRefundCalculator';
import { calculateTaxRefund, TAX_REFUND_YEAR_RULES } from '@/lib/calculators/tax-refund';
import { FULL_RETURN_YEAR_RULES } from '@/lib/calculators/tax-full-return';
import { buildCreditPointsLedger } from '@/lib/calculators/tax-credit-points';
import { formatCurrency } from '@/lib/utils/formatters';

const pageDescription = 'תחשיב מס שנתי מלא לשכירים לשנים 2020–2025: שכר, שכירות (פטור, 10%, רגיל, חו״ל), ריבית, דיבידנד ורווחי הון, קיזוז הפסדים, מס יסף, מס זר ונקודות זיכוי לחייל, תואר ועולה. אומדן בלבד.';

const exampleLedger = buildCreditPointsLedger({
  taxYear: '2025',
  gender: 'female',
  soldier: { serviceType: 'army', serviceMonths: 24, dischargeYear: 2024, dischargeMonth: 12 },
});
const example = calculateTaxRefund({
  taxYear: '2025',
  incomeSources: [{ taxableIncome: 120_000, taxWithheld: 14_000, insuredIncome: 120_000, employeePensionContributions: 7_200 }],
  creditPoints: exampleLedger.total,
});

export const metadata: Metadata = {
  title: { absolute: 'תחשיב מס שנתי מלא לשכירים 2020–2025 | חשבונאי' },
  description: pageDescription,
  alternates: { canonical: '/personal-tax/tax-return-full' },
  openGraph: {
    title: 'תחשיב מס שנתי מלא לשכירים 2020–2025',
    description: pageDescription,
    url: '/personal-tax/tax-return-full',
    type: 'website',
    locale: 'he_IL',
    siteName: 'חשבונאי',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'חשבונאי — מחשבונים פיננסיים בעברית' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'תחשיב מס שנתי מלא לשכירים 2020–2025',
    description: pageDescription,
    images: ['/opengraph-image'],
  },
};

const faqItems = [
  {
    question: 'מה ההבדל בין התחשיב המלא לסימולטור החזר המס הרגיל?',
    answer:
      'הסימולטור הרגיל מחשב החזר מהיר לפי נקודות בסיס וילדים. התחשיב המלא מוסיף חישוב אוטומטי של נקודות לחייל משוחרר, בן/בת שירות לאומי, מסיימי תואר ועולים חדשים, הנחת יישוב מוטב ומציג כל שורה בחישוב. שניהם משתמשים באותו מנוע לחישוב המס עצמו.',
  },
  {
    question: 'איך מחושבות נקודות זיכוי לחייל משוחרר?',
    answer:
      'הזכאות נמשכת 36 חודשים החל מהחודש שלאחר חודש השחרור. נקודה אחת מגיעה לשירות של 12 חודשים ויותר, ושתיים לשירות ארוך (חיילים 23 חודשים, חיילות 22, שירות לאומי 24). מכיוון ששנת המס היא קלנדרית, כל שנה מקבלת רק את חלק הזכאות שחל בחודשיה.',
  },
  {
    question: 'איך מחושבות נקודות לעולה חדש?',
    answer:
      'העולה זכאי לשבריר נקודה בכל חודש, לפי הוותק מחודש קבלת תעודת העולה. עולים לפני 2022 מקבלים 42 חודשים, ועולים מ-2022 מקבלים 54 חודשים. תקופת שירות סדיר או לימודים על-תיכוניים מקפיאה את הזכאות, ולכן במקרים כאלה יש להזין סך נקודות מאומת.',
  },
  {
    question: 'אילו מקרים התחשיב המלא אינו מכסה?',
    answer:
      'הכנסה מעסק או ממשלח יד, מענקי פרישה ופיצויים חייבים, תושבות חלקית, חישוב משותף עם בן/בת זוג, סכום אינפלציוני לנכסים ישנים, והפסדי הון מחו״ל שלא קוזזו מול רווחי חו״ל. נקודות לתואר שלישי, מסיימי תואר עד 2022 והורה יחיד מוזנות כסך מאומת.',
  },
  {
    question: 'איך מחושב מס על שכר דירה?',
    answer:
      'במסלול הפטור, דמי שכירות עד התקרה החודשית פטורים; מעליה התקרה קטנה בסכום החריגה, והחלק החייב ממוסה כהכנסה שאינה מעבודה. במסלול 10% משלמים 10% מדמי השכירות ללא הוצאות וללא זיכויים, ומי שמשכיר דירה יחידה ושוכר דירה למגוריו רשאי לנכות את שכר הדירה ששילם עד 90,000 ₪. במסלול הרגיל מזינים הכנסה נטו אחרי הוצאות ופחת.',
  },
  {
    question: 'מה ההטבה לבני 60 ומעלה?',
    answer:
      'מגיל 60 הכנסה שאינה מעבודה, כמו שכירות או רווח הון וריבית צמודה, ממוסה לפי המדרגות המופחתות במקום שיעור מזערי של 31%, ובכל מקרה לא מעל השיעור המיוחד שלה. דיבידנד נשאר בשיעור הקבוע בחוק (25% או 30%).',
  },
  {
    question: 'האם קיזוז הפסדי הון נכלל?',
    answer:
      'כן, לפי סעיף 92 וחוזר מס הכנסה 10/2025. הפסד שוטף מניירות ערך מקוזז מול רווחי הון, ואחר כך מול ריבית ודיבידנד מניירות ערך שהמס עליהם עד 25%. הוא אינו מקוזז מול ריבית מפיקדון או תכנית חיסכון, מול רווחי קרן נאמנות או מול הכנסה מעבודה. הפסד מועבר משנים קודמות מקוזז מול רווחי הון בלבד.',
  },
  {
    question: 'האם האתר שומר את הנתונים?',
    answer:
      'לא. החישוב מתבצע בדפדפן ואינו נשלח לשרת. אירועי מדידה, אם פעילים, כוללים רק התקדמות בטופס, שנת מס וסוג תוצאה כללי, ללא סכומים.',
  },
];

export default function TaxReturnFullPage() {
  return (
    <CalculatorLayout
      title="תחשיב מס שנתי מלא לשכירים"
      description="תחשיב שורה-שורה לשנים 2020–2025: שכר, שכירות, ריבית, דיבידנד ורווחי הון, קיזוז הפסדים, מס יסף, מס זר ונקודות זיכוי לכל זכאות."
      breadcrumbs={[
        { label: 'דף הבית', href: '/' },
        { label: 'מיסוי אישי', href: '/personal-tax' },
        { label: 'תחשיב מס שנתי מלא' },
      ]}
      pageUrl="/personal-tax/tax-return-full"
      lastUpdated="2026-10-02"
      quickAnswer={
        <p className="text-lg leading-relaxed text-ink">
          התחשיב המלא מחשב את המס השנתי של יחיד שכיר מכל מקורות ההכנסה ומשווה אותו למס ששולם: שכר,
          שכר דירה בישראל ובחו״ל לפי המסלול שנבחר, ריבית, דיבידנד ורווחי הון עם קיזוז הפסדים, מס יסף
          ומס נוסף על הכנסה הונית, זיכוי מס זר, ונקודות זיכוי לכל זכאות בנפרד — כולל חייל משוחרר, תואר
          ועולה חדש. כל שורה מוצגת עם הסעיף בחוק. התוצאה אומדן בלבד ואינה מחליפה שומה של רשות המסים.
        </p>
      }
      calculator={<TaxRefundCalculator mode="full" />}
      disclaimerText="התחשיב מיועד ליחיד תושב ישראל שהוא שכיר, עם הכנסות שכירות והכנסות הוניות. הוא אינו כולל הכנסה מעסק או משלח יד, מענקי פרישה, תושבות חלקית או חישוב משותף עם בן/בת זוג. סדר קיזוז וייחוס זיכויים שהחוק אינו קובע במפורש מחושב לפי הנחות שמרניות. רשות המסים קובעת את השומה וההחזר."
      content={
        <>
          <h2>מה נכלל בתחשיב?</h2>
          <ul>
            <li><strong>מס לפי מדרגות השנה</strong> ומס יסף 3% מעל התקרה השנתית; מ-2025 גם מס נוסף של 2% על הכנסה ממקור הוני מעל התקרה.</li>
            <li><strong>שכר דירה למגורים:</strong> מסלול פטור, 10% או רגיל; שכירות מחו״ל ב-15% או ברגיל עם זיכוי מס זר.</li>
            <li><strong>הכנסות הוניות:</strong> ריבית (15% לא צמודה, עד 25% צמודה), דיבידנד (25%, מהותי 30%), רווח הון ריאלי (עד 25%, מהותי עד 30%, אג״ח לא צמודות עד 15%).</li>
            <li><strong>קיזוז הפסדי הון</strong> שוטפים ומועברים, וניכוי מריבית פיקדון לפי סעיף 125ד.</li>
            <li><strong>הטבת גיל 60</strong> על הכנסה שאינה מעבודה.</li>
            <li><strong>נקודות זיכוי בנפרד לכל זכאות:</strong> בסיס, ילדים, חייל משוחרר או שירות לאומי, תואר ראשון או שני, עולה חדש, ונקודות נוספות שאומתו.</li>
            <li><strong>הנחת יישוב מוטב:</strong> שיעור ותקרה מהרשימה הרשמית.</li>
            <li><strong>זיכוי פנסיה לפי סעיף 45א ותרומות לפי סעיף 46.</strong></li>
          </ul>

          <h2>דוגמה: חיילת משוחררת ב-2025</h2>
          <p>
            שכירה ששירתה 24 חודשים והשתחררה בדצמבר 2024, עם הכנסה חייבת של {formatCurrency(120_000)} ומס שנוכה של{' '}
            {formatCurrency(14_000)} ב-{example.taxYear}. הנקודות מחושבות כך:
          </p>
          <ul>
            {exampleLedger.lines.map((line) => (
              <li key={line.key}>{line.label}: {line.points.toFixed(2)} ({line.note})</li>
            ))}
          </ul>
          <p>
            סך הנקודות {example.creditPoints.toFixed(2)}, ולכן זיכוי נקודות של {formatCurrency(example.creditPointsAmount)} על
            מס של {formatCurrency(example.taxBeforeCredits)}. חבות המס אחרי זיכויים היא {formatCurrency(example.taxAfterCredits)},
            וההחזר המשוער הוא {formatCurrency(example.estimatedRefund)}. הנתונים מופקים מאותו מנוע חישוב; זו אינה הבטחה להחזר.
          </p>

          <h2>איך מחושבות הזכאויות?</h2>
          <p>
            מס ההכנסה מחושב לפי שנה קלנדרית, ולכן כל זכאות שמוגבלת בזמן מחושבת חודש אחר חודש.
            חייל משוחרר מקבל את הנקודות ל-36 חודשים מהחודש שלאחר השחרור. עולה חדש מקבל
            1/12, 1/6 או 1/4 נקודה בכל חודש לפי הוותק שלו. תואר ראשון מזכה בנקודה אחת במשך שנות הלימוד
            (עד שלוש שנות מס), ותואר שני בחצי נקודה עד שנתיים, מהשנה שלאחר הסיום.
          </p>

          <h2>טבלת קבועים לפי שנה</h2>
          <div className="overflow-x-auto">
            <table>
              <caption>קבועים שמשמשים את התחשיב, מלוחות העזר של רשות המסים</caption>
              <thead><tr><th scope="col">שנה</th><th scope="col">נקודת זיכוי שנתית</th><th scope="col">תקרת פטור שכירות לחודש</th><th scope="col">סף מס יסף</th><th scope="col">מס הוני נוסף</th></tr></thead>
              <tbody>{Object.entries(TAX_REFUND_YEAR_RULES).map(([y, r]) => {
                const f = FULL_RETURN_YEAR_RULES[y as keyof typeof FULL_RETURN_YEAR_RULES];
                return (
                  <tr key={y}>
                    <th scope="row">{y}</th>
                    <td>{formatCurrency(r.creditPointMonthly * 12)}</td>
                    <td>{formatCurrency(f.rentalExemptionMonthly)}</td>
                    <td>{formatCurrency(r.surtaxThreshold)}</td>
                    <td>{f.capitalSurtaxRate > 0 ? `${f.capitalSurtaxRate * 100}%` : '—'}</td>
                  </tr>
                );
              })}</tbody>
            </table>
          </div>

          <h2>איך מוקצים הזיכויים והקיזוזים</h2>
          <ul>
            <li>נקודות ילדים להורה נשוי ונקודות חייל משוחרר — כנגד המס על הכנסה מיגיעה אישית בלבד (סעיפים 66(ג) ו-39א; מדריך רשות המסים). כך גם הנחת יישוב.</li>
            <li>נקודות תושב, נסיעה ואישה, תואר ועולה חדש, זיכוי פנסיה ותרומות — כנגד כלל המס, למעט מסלולי 10% ו-15% לשכירות שבהם החוק אוסר זיכוי.</li>
            <li>הפסד הון שוטף מניירות ערך — מול רווחי הון ואז מול ריבית ודיבידנד מניירות ערך שהמס עליהם עד 25%; לא מול ריבית פיקדון ולא מול רווחי קרן נאמנות. הפסד מועבר — מול רווחי הון בלבד (חוזר מס הכנסה 10/2025).</li>
            <li>סדר הקיזוז נתון לבחירת הנישום (חוזר 10/2025 סעיף 6.1); המחשבון בוחר לקזז תחילה מול ההכנסה בשיעור המס הגבוה.</li>
            <li>תקרת זיכוי מס זר על הכנסה רגילה — לפי המס לאחר הזיכויים האישיים (מדריך רשות המסים).</li>
          </ul>
          <h2>הנחות שלא נמצא להן מקור מפורש</h2>
          <ul>
            <li>מגיל 60, כשיש כמה הכנסות הוניות, אלו בתקרת השיעור הגבוהה ממוקמות ראשונות במדרגות הנמוכות.</li>
            <li>כשמתקיימים שני ניכויי הריבית לפי סעיף 125ד, נלקח הגבוה מביניהם.</li>
            <li>נקודות נוספות שהוזנו ידנית מוקצות כנגד מס על הכנסה מיגיעה אישית בלבד (שמרני).</li>
          </ul>

          <h2>מה לא מחושב כאן?</h2>
          <p>
            הכנסה מעסק או ממשלח יד, מענקי פרישה ופיצויים חייבים, תושבות חלקית וחישוב משותף עם בן/בת זוג. מסיימי תואר עד 2022, הורה יחיד ותואר
            שלישי דורשים את סך הנקודות מהסימולטור הרשמי, וניתן להזין אותו בשדה &quot;נקודות נוספות שאומתו&quot;.
            לבדיקה מהירה בלי פירוט, השתמשו ב
            <Link href="/personal-tax/tax-refund" className="text-gold underline">סימולטור החזר המס הרגיל</Link>.
          </p>
        </>
      }
      faq={<FAQ items={faqItems} />}
      sources={
        <ul className="space-y-3">
          <li><a href="https://www.gov.il/he/pages/pa110123-1" target="_blank" rel="noopener noreferrer" className="text-gold underline">רשות המסים: לוחות עזר שנתיים (מדרגות, נקודות, תואר, יישובים מוטבים)</a></li>
          <li><a href="https://www.gov.il/BlobFolder/policy/inst-07-2025/he/IncomeTax_inst-07-2025.pdf" target="_blank" rel="noopener noreferrer" className="text-gold underline">רשות המסים: הוראת ביצוע 7/2025 — נקודות ילדים</a></li>
          <li><a href="https://www.kolzchut.org.il/he/נקודות_זיכוי_ממס_הכנסה_לחיילים_משוחררים_ומסיימי_שירות_לאומי-אזרחי" target="_blank" rel="noopener noreferrer" className="text-gold underline">כל-זכות: נקודות זיכוי לחיילים משוחררים (סעיף 39א)</a></li>
          <li><a href="https://www.kolzchut.org.il/he/נקודות_זיכוי_ממס_הכנסה_לעולה_חדש" target="_blank" rel="noopener noreferrer" className="text-gold underline">כל-זכות: נקודות זיכוי לעולה חדש (סעיף 35)</a></li>
          <li><a href="https://www.gov.il/BlobFolder/policy/professional-directives-271125-1/he/IncomeTax_professional-directives-271125-1.pdf" target="_blank" rel="noopener noreferrer" className="text-gold underline">רשות המסים: חוזר מס הכנסה 10/2025 — קיזוז הפסדי הון</a></li>
          <li><a href="https://www.gov.il/BlobFolder/generalpage/income-tax-guide-knowyourright/he/Guides_IncomeTax_da-2024.pdf" target="_blank" rel="noopener noreferrer" className="text-gold underline">רשות המסים: דע זכויותיך וחובותיך 2024 — הסברים לדוח השנתי</a></li>
          <li><a href="https://he.wikisource.org/wiki/פקודת_מס_הכנסה" target="_blank" rel="noopener noreferrer" className="text-gold underline">פקודת מס הכנסה — סעיפים 91, 92, 121, 121ב, 122, 122א, 125ב, 125ג, 125ד, 204</a></li>
          <li><a href="https://he.wikisource.org/wiki/חוק_מס_הכנסה_(פטור_ממס_על_הכנסה_מהשכרת_דירת_מגורים)" target="_blank" rel="noopener noreferrer" className="text-gold underline">חוק מס הכנסה (פטור ממס על הכנסה מהשכרת דירת מגורים), התש״ן–1990</a></li>
          <li><a href="https://www.gov.il/he/service/tax-credit" target="_blank" rel="noopener noreferrer" className="text-gold underline">רשות המסים: סימולטור נקודות זיכוי</a></li>
        </ul>
      }
    />
  );
}
