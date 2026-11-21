import { withPageSocialMetadata } from '@/lib/config/site-info';
import type { Metadata } from 'next';
import Link from 'next/link';
import { CalculatorLayout } from '@/components/calculator/CalculatorLayout';
import { FAQ } from '@/components/calculator/FAQ';
import { ArnonaCalculator } from '@/components/calculators/ArnonaCalculator';
import { calculateArnona } from '@/lib/calculators/arnona';
import { ARNONA_CITIES } from '@/lib/data/arnona-rates';
import { ARNONA_CITY_PAGES } from '@/lib/data/arnona-city-pages';

export const metadata: Metadata = withPageSocialMetadata({
  title: 'מחשבון ארנונה לפי עיר ואזור — תעריפים מהצו הרשמי',
  description:
    'חשבו ארנונה למגורים לפי עיר, אזור, סוג בניין ושטח, עם הנחות. התעריפים נלקחים מצו הארנונה הרשמי של העירייה, עם קישור למקור.',
  alternates: { canonical: '/real-estate/arnona' },
});

// דוגמה מחושבת מהמנוע ומהנתונים — המספרים בטקסט לא מוקלדים ידנית ולכן לא יכולים להתפצל מהמחשבון.
const CURRENT = ARNONA_CITIES.find((c) => c.status !== 'pending-approval') ?? ARNONA_CITIES[0];
const EXAMPLE_ZONE = CURRENT.zones[0];
const EXAMPLE_CLASS = CURRENT.classes?.[0]?.id ?? '';
const EXAMPLE_RATE = EXAMPLE_ZONE.rateByClass ? EXAMPLE_ZONE.rateByClass[EXAMPLE_CLASS] : EXAMPLE_ZONE.rate!;
const EXAMPLE_AREA = 100;
const EXAMPLE = calculateArnona({ areaSqm: EXAMPLE_AREA, zone: EXAMPLE_RATE })!;
const money = (v: number) =>
  `${v.toLocaleString('he-IL', { maximumFractionDigits: 2 })} ₪`;

const CITY_NAMES = [...new Set(ARNONA_CITIES.map((c) => c.name))];

const faqItems = [
  {
    question: 'איך מחשבים ארנונה?',
    answer:
      'שטח הנכס במ״ר כפול התעריף למ״ר לשנה שנקבע בצו הארנונה של הרשות המקומית, לפי האזור וסוג הנכס. את הסכום השנתי מחלקים ל־12 או ל־6 לפי תדירות התשלום, ומפחיתים הנחות שמגיעות לכם.',
  },
  {
    question: 'מי קובע את תעריף הארנונה?',
    answer:
      'כל רשות מקומית מפרסמת צו ארנונה שנתי שמאושר במועצה, ובמקרים מסוימים גם בשרים. התעריפים נעים במסגרת שמשרד הפנים קובע, ולכן אותו נכס בערים שונות יחויב בסכום שונה.',
  },
  {
    question: 'למה התעריף תלוי באזור ובסוג הבניין?',
    answer:
      'עיר מחולקת לאזורי מס לפי מפה שבצו, ובחלק מהערים התעריף תלוי גם בגיל הבניין ובאיכותו. האזור וסוג הבניין מופיעים בחשבון הארנונה האחרון שלכם.',
  },
  {
    question: 'האם הגודל משפיע על התעריף?',
    answer:
      'בחלק מהערים כן. בתל אביב-יפו, למשל, דירה עד 140 מ״ר באזורים 1 ו־2 מחויבת בתעריף נמוך יותר, ווילה או דירה מעל 140 מ״ר מחויבות בתעריף גבוה על כל השטח. בערים אחרות יש מדרגות שבהן רק החלק העודף מחויב בתעריף הגבוה. המחשבון מטפל בשתי השיטות לפי הצו.',
  },
  {
    question: 'אילו הנחות בארנונה קיימות?',
    answer:
      'החוק והצו קובעים הנחות לאזרחים ותיקים, נכים, עיוורים, עולים חדשים, מקבלי הבטחת הכנסה, בעלי הכנסה נמוכה, משפחות מרובות ילדים ועוד. ההנחות תלויות בתנאים ובתקרת שטח, ובדרך כלל צריך להגיש בקשה בעירייה עם אסמכתאות. המחשבון כולל את ההנחות שנקראו בבירור בצו; לבדיקה מלאה פנו לעירייה.',
  },
  {
    question: 'מה ההבדל בין צו 2026 לצו 2027?',
    answer:
      'צו הארנונה מתעדכן כל שנה. מקור התעריפים בכל בחירה מופיע מתחת למחשבון, ובצו שעדיין ממתין לאישור השרים המחשבון מציין זאת במפורש.',
  },
  {
    question: 'האם התוצאה מחייבת?',
    answer:
      'לא. זה אומדן לפי הצו. החיוב בפועל נקבע לפי הסיווג והשטח המחויב שרשומים בעירייה, ולכן כדאי לבדוק מול חשבון הארנונה או מול מחלקת הגבייה.',
  },
];

export default function ArnonaPage() {
  return (
    <CalculatorLayout
      pageUrl="/real-estate/arnona"
      title="מחשבון ארנונה לפי עיר ואזור"
      description="ארנונה למגורים לפי תעריפי הצו הרשמי של העירייה: אזור, סוג בניין, שטח והנחות."
      breadcrumbs={[
        { label: 'דף הבית', href: '/' },
        { label: 'נדל״ן', href: '/real-estate' },
        { label: 'ארנונה' },
      ]}
      lastUpdated={CURRENT.verifiedAt}
      quickAnswer={
        <p>
          ארנונה = שטח הנכס במ״ר × תעריף למ״ר לשנה בצו הארנונה של העירייה. למשל, בצו {CURRENT.year}
          של {CURRENT.name} (אזור 1, סוג בניין אא), דירה של {EXAMPLE_AREA} מ״ר משלמת{' '}
          {money(EXAMPLE.annual)} בשנה, כלומר כ־{money(EXAMPLE.monthly)} בחודש. הסכום בפועל תלוי באזור
          המס, בסוג הבניין ובהנחות שמגיעות לכם, ולכן בחרו את הנתונים שמופיעים בחשבון הארנונה שלכם.
        </p>
      }
      calculator={<ArnonaCalculator />}
      content={
        <>
          <h2>איך מחושבת ארנונה</h2>
          <p>
            הארנונה היא מס עירוני שהרשות המקומית גובה מהמחזיק בנכס. הנוסחה: שטח מחויב כפול תעריף למ״ר
            לשנה. התעריף מופיע בצו הארנונה של העירייה ומשתנה לפי אזור, שימוש בנכס (מגורים, עסק) ובחלק
            מהערים לפי סוג הבניין וגודל הנכס.
          </p>
          <h3>דוגמה מחושבת</h3>
          <p>
            {CURRENT.name}, צו {CURRENT.year}, {EXAMPLE_ZONE.label}, דירה של {EXAMPLE_AREA} מ״ר:{' '}
            {EXAMPLE_AREA} × {money(EXAMPLE.breakdown[0].ratePerSqm)} = {money(EXAMPLE.annual)} לשנה.
            חלוקה ל־12 חודשים נותנת {money(EXAMPLE.monthly)}; חיוב דו־חודשי הוא {money(EXAMPLE.bimonthly)}.
          </p>

          <h2>תעריף לפי טווח שטח או לפי מדרגות</h2>
          <p>
            אין שיטה אחת בכל הארץ. בחלק מהערים כל השטח מחויב בתעריף שנקבע לפי גודל הנכס (למשל דירה עד
            140 מ״ר מול דירה מעל 140 מ״ר). בערים אחרות יש מדרגות, ורק השטח העודף מחויב בתעריף הגבוה.
            המחשבון מציג את הפירוט כשיש יותר ממדרגה אחת.
          </p>

          <h2>הנחות בארנונה</h2>
          <p>
            הנחות נקבעות בתקנות ובצו העירייה. רובן חלות על דירת מגורים בלבד, חלקן על תקרת שטח (למשל
            100 מ״ר ראשונים), ובדרך כלל נדרש להגיש בקשה עם מסמכים. המחשבון כולל את ההנחות שנקראו בבירור
            בצו של העיר שבחרתם ומציין את התנאים והתקרה. הנחות לפי הכנסה ומצבים מיוחדים נבדקים מול העירייה.
          </p>

          <h2>אילו ערים כלולות</h2>
          <p>
            כרגע: {CITY_NAMES.join(', ')}. כל עיר נוספת מתווספת רק לאחר קריאת הצו הרשמי שלה. לא מועתקים
            תעריפים מאתרי צד שלישי. רוצים לבדוק עיר שאינה ברשימה?{' '}
            <Link href="/contact" className="text-gold underline">
              כתבו לנו
            </Link>
            .
          </p>
          <p>
            לפי עיר: {ARNONA_CITY_PAGES.map((cp, i) => (
              <span key={cp.slug}>
                {i > 0 ? ' · ' : ''}
                <Link href={`/real-estate/arnona/${cp.slug}`} className="text-gold underline">
                  {cp.name}
                </Link>
              </span>
            ))}
          </p>
          <p>
            הנחה לפי הכנסה? ראו את{' '}
            <Link href="/real-estate/arnona-discount" className="text-gold underline">
              מחשבון ההנחה בארנונה לפי הכנסה
            </Link>
            .
          </p>
          <p>
            מחפשים ארנונה לנכס עסקי?{' '}
            <Link href="/real-estate/arnona-business" className="text-gold underline">
              מחשבון ארנונה לעסקים
            </Link>
            .
          </p>
        </>
      }
      faq={<FAQ items={faqItems} />}
      sources={
        <ul>
          {ARNONA_CITIES.map((c) => (
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
