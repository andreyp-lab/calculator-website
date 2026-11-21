import { withPageSocialMetadata } from '@/lib/config/site-info';
import type { Metadata } from 'next';
import Link from 'next/link';
import { CalculatorLayout } from '@/components/calculator/CalculatorLayout';
import { FAQ } from '@/components/calculator/FAQ';
import { ArnonaBusinessCalculator } from '@/components/calculators/ArnonaBusinessCalculator';
import { calculateArnona } from '@/lib/calculators/arnona';
import { ARNONA_BUSINESS_CITIES, businessRate } from '@/lib/data/arnona-business-rates';

export const metadata: Metadata = withPageSocialMetadata({
  title: 'ארנונה לעסקים 2026 — מחשבון לפי עיר, אזור וסוג נכס',
  description:
    'חשבו ארנונה לעסק לפי צו הארנונה 2026 של העירייה: משרד, חנות, תעשייה, מחסן, בנק ועוד, לפי אזור, שטח ומדרגות — עם קישור לצו.',
  alternates: { canonical: '/real-estate/arnona-business' },
});

// דוגמה מחושבת מהמנוע ומהנתונים: הטקסט והמחשבון לא יכולים להתפצל.
const TLV = ARNONA_BUSINESS_CITIES.find((c) => c.id === 'tel-aviv-business-2026')!;
const OFFICE = TLV.uses.find((u) => u.id === 'office-retail')!;
const EXAMPLE_AREA = 100;
const EXAMPLE = calculateArnona({
  areaSqm: EXAMPLE_AREA,
  zone: businessRate(OFFICE, 'z1')!,
})!;
const INDUSTRY = TLV.uses.find((u) => u.id === 'industry')!;
const INDUSTRY_AREA = 250;
const INDUSTRY_EXAMPLE = calculateArnona({
  areaSqm: INDUSTRY_AREA,
  zone: businessRate(INDUSTRY, 'z1')!,
})!;

const money = (v: number) => `${v.toLocaleString('he-IL', { maximumFractionDigits: 2 })} ₪`;
const CITY_NAMES = ARNONA_BUSINESS_CITIES.map((c) => c.name);

const faqItems = [
  {
    question: 'איך מחשבים ארנונה לעסק?',
    answer:
      'שטח הנכס במ״ר כפול התעריף למ״ר לשנה בצו הארנונה של העירייה, לפי סוג השימוש (משרד, חנות, תעשייה, מחסן ועוד) והאזור. בחלק מהערים התעריף תלוי גם בגודל העסק או בסימול הבניין.',
  },
  {
    question: 'למה הארנונה לעסק יקרה בהרבה מארנונה לדירה?',
    answer:
      'תעריפי העסקים גבוהים מתעריפי המגורים בכל עיר, ובמרכז הערים הגדולות הם מגיעים למאות שקלים למ״ר בשנה. לכן שטח הנכס, האזור וסוג השימוש משפיעים מאוד על ההוצאה.',
  },
  {
    question: 'מה ההבדל בין משרד לחנות בארנונה?',
    answer:
      'תלוי בעיר. בתל אביב משרדים, שירותים וחנויות מחויבים בתעריף אחיד; בפתח תקווה ובחיפה יש טבלאות נפרדות ותלויות סימול או סוג בניין; ובבאר שבע חנות ללא רישוי ומשרד בבניין שירותים מחויבים בתעריפים שונים.',
  },
  {
    question: 'האם התעריף חל על כל השטח או רק על העודף?',
    answer:
      'זה משתנה בין ערים ובין סוגי נכסים. בתל אביב, בבאר שבע ובחיפה תעריפי התעשייה והמחסנים הם מדרגות שוליות: כל טווח שטח בתעריף שלו. בצווים אחרים נקבע תעריף לפי הגודל הכולל של הנכס. כשהצו לא מבהיר, המחשבון מציין זאת במפורש בתיאור השימוש.',
  },
  {
    question: 'איך אדע באיזה אזור העסק שלי?',
    answer:
      'האזור מופיע בחשבון הארנונה האחרון. אם אין לכם חשבון, העירייה מפרסמת מפה או רשימת רחובות או גושים וחלקות, ולעיתים יש שירות חיפוש כתובת. בחיפה ובפתח תקווה רשימת הרחובות אינה בקובץ הצו עצמו.',
  },
  {
    question: 'האם יש הנחות בארנונה לעסקים?',
    answer:
      'הנחות סוציאליות חלות על דירות מגורים בלבד. לעסקים קיימות בעיקר הנחות לנכס ריק (עד 6 או 12 חודשים לפי הצו), לבניין חדש, לתשלום מראש או בהוראת קבע, ולעיתים הנחות למפעלים חדשים. ההנחות אינן מחושבות במחשבון ויש לבדוק אותן בצו.',
  },
  {
    question: 'האם התוצאה מחייבת?',
    answer:
      'לא. זה אומדן לפי תעריפי הצו. החיוב בפועל נקבע לפי הסיווג, האזור והשטח המחויב שרשומים בעירייה, כולל כללי מדידה כמו שטחים משותפים וגלריות.',
  },
];

export default function ArnonaBusinessPage() {
  return (
    <CalculatorLayout
      pageUrl="/real-estate/arnona-business"
      title="מחשבון ארנונה לעסקים"
      description="ארנונה לנכס עסקי לפי צו הארנונה 2026 של העירייה: סוג שימוש, אזור, שטח ומדרגות."
      breadcrumbs={[
        { label: 'דף הבית', href: '/' },
        { label: 'נדל״ן', href: '/real-estate' },
        { label: 'ארנונה לעסקים' },
      ]}
      lastUpdated={TLV.verifiedAt}
      quickAnswer={
        <p>
          ארנונה לעסק = שטח במ״ר × תעריף למ״ר לשנה בצו הארנונה, לפי סוג השימוש והאזור. למשל, בצו 2026
          של {TLV.name}, משרד או חנות של {EXAMPLE_AREA} מ״ר באזור 1 משלמים {money(EXAMPLE.annual)} בשנה,
          כלומר כ־{money(EXAMPLE.monthly)} בחודש. מפעל של {INDUSTRY_AREA} מ״ר באותה עיר, בתעריפי התעשייה
          המדורגים, משלם {money(INDUSTRY_EXAMPLE.annual)} בשנה. הסכום בפועל תלוי באזור, בסימול הבניין
          ובכללי המדידה של העירייה.
        </p>
      }
      calculator={<ArnonaBusinessCalculator />}
      content={
        <>
          <h2>איך מחושבת ארנונה לעסק</h2>
          <p>
            הנוסחה זהה למגורים: שטח כפול תעריף. ההבדל הוא בתעריף: הוא נקבע לפי סוג השימוש בנכס, האזור
            בעיר, ובחלק מהערים גם לפי גודל העסק או סימול הבניין. תעריפי עסקים גבוהים בהרבה מתעריפי
            מגורים, ולכן שגיאה בסיווג או בשטח עולה הרבה כסף.
          </p>
          <h3>דוגמה מחושבת</h3>
          <p>
            {TLV.name}, צו 2026, משרד באזור 1, {EXAMPLE_AREA} מ״ר: {EXAMPLE_AREA} ×{' '}
            {money(EXAMPLE.breakdown[0].ratePerSqm)} = {money(EXAMPLE.annual)} לשנה, כלומר{' '}
            {money(EXAMPLE.monthly)} בחודש.
          </p>
          <p>
            תעשייה מדורגת, {INDUSTRY_AREA} מ״ר באותה עיר:{' '}
            {INDUSTRY_EXAMPLE.breakdown
              .map((row) => `${row.sqm} × ${money(row.ratePerSqm)}`)
              .join(' + ')}{' '}
            = {money(INDUSTRY_EXAMPLE.annual)} לשנה.
          </p>

          <h2>שלושה דברים שמשנים את התוצאה</h2>
          <ul>
            <li>
              <strong>סוג השימוש:</strong> משרד, חנות, מחסן, תעשייה, בנק וביטוח מחויבים בתעריפים שונים.
              הצו קובע לכל שימוש הגדרה משלו, ולכן חשוב לבחור את הסיווג שרשום בחשבון הארנונה.
            </li>
            <li>
              <strong>אזור:</strong> בכל עיר יש אזורי מס לעסקים, ולעיתים הם שונים מאזורי המגורים.
            </li>
            <li>
              <strong>מדרגות שטח וסימול בניין:</strong> בתעשייה ובמחסנים תעריף השטח יורד בדרך כלל ככל
              שהנכס גדול יותר; בחיפה ובפתח תקווה גם סוג הבניין משפיע.
            </li>
          </ul>

          <h2>מה המחשבון לא מחשב</h2>
          <p>
            המחשבון אינו כולל הנחות (נכס ריק, בניין חדש, תשלום מראש, מפעל חדש), שטחים משותפים וגלריות,
            ושימושים נדירים כמו מלונות, בתי חולים או תחנות דלק. אלה מפורטים בצו של כל עיר, ובתיאור כל
            עיר מתחת למחשבון מצוינים החריגים העיקריים שנקראו.
          </p>

          <h2>אילו ערים כלולות</h2>
          <p>
            כרגע: {CITY_NAMES.join(', ')}. התעריפים נלקחו מצווי הארנונה הרשמיים לשנת 2026. עיר נוספת
            תתווסף רק לאחר קריאת הצו שלה. למחשבון ארנונה לדירת מגורים:{' '}
            <Link href="/real-estate/arnona" className="text-gold underline">
              ארנונה למגורים
            </Link>
            .
          </p>
          <h3>הערות לפי עיר</h3>
          {ARNONA_BUSINESS_CITIES.map((c) => (
            <div key={c.id}>
              <h4>{c.name}</h4>
              <ul>
                {c.notes.map((n) => (
                  <li key={n}>{n}</li>
                ))}
              </ul>
            </div>
          ))}
        </>
      }
      faq={<FAQ items={faqItems} />}
      sources={
        <ul>
          {ARNONA_BUSINESS_CITIES.map((c) => (
            <li key={c.id}>
              <a href={c.sourceUrl} target="_blank" rel="noopener noreferrer">
                {c.name}: {c.sourceLabel}
              </a>{' '}
              (אומת {c.verifiedAt})
            </li>
          ))}
        </ul>
      }
    />
  );
}
