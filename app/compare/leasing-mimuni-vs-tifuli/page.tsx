import { Metadata } from 'next';
import Link from 'next/link';
import { CalculatorLayout } from '@/components/calculator/CalculatorLayout';
import { VehicleOwnershipCalculator } from '@/components/calculators/VehicleOwnershipCalculator';
import { FAQ } from '@/components/calculator/FAQ';
import {
  LINEAR_USAGE_RATE_2026,
  USAGE_VALUE_PRICE_CEILING_2026,
} from '@/lib/calculators/company-car-benefit';
import { VAT_2026 } from '@/lib/constants/tax-2026';

// ============================================================
// נתוני מס נגזרים מקבועי המנועים — אין מספרי מס מוקלדים ידנית
// ============================================================
const pct = (v: number) =>
  `${(v * 100).toLocaleString('he-IL', { maximumFractionDigits: 2 })}%`;
const fmt = (n: number) => n.toLocaleString('he-IL');

const USAGE_RATE_PCT = pct(LINEAR_USAGE_RATE_2026); // שווי שימוש ליניארי
const USAGE_CEILING = fmt(USAGE_VALUE_PRICE_CEILING_2026); // תקרת מחיר לשווי שימוש
const VAT_PCT = pct(VAT_2026.standard); // מע"מ

export const metadata: Metadata = {
  title: 'ליסינג מימוני מול ליסינג תפעולי - מה ההבדל ומה כדאי?',
  description:
    'ליסינג מימוני או תפעולי? השוואה מלאה לעסק ולפרטי: בעלות על הרכב, פחת והוצאה מוכרת, מע"מ, שווי שימוש, תזרים מזומנים וסוף תקופה. כולל מחשבון השוואת עלויות.',
  alternates: { canonical: '/compare/leasing-mimuni-vs-tifuli' },
};

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'ליסינג מימוני מול ליסינג תפעולי - השוואה מקיפה 2026',
  description:
    'ההבדלים בין ליסינג מימוני לליסינג תפעולי: בעלות, רישום בספרים, פחת, מע"מ, שווי שימוש ותזרים - לעסקים ולפרטיים.',
  url: 'https://cheshbonai.co.il/compare/leasing-mimuni-vs-tifuli',
  inLanguage: 'he-IL',
  datePublished: '2026-08-15',
  dateModified: '2026-08-15',
  author: {
    '@type': 'Organization',
    name: 'חשבונאי',
    url: 'https://cheshbonai.co.il',
  },
  publisher: {
    '@type': 'Organization',
    name: 'חשבונאי',
    url: 'https://cheshbonai.co.il',
  },
};

const faqItems = [
  {
    question: 'מה ההבדל העיקרי בין ליסינג מימוני לליסינג תפעולי?',
    answer:
      'ליסינג מימוני הוא בעצם קניית רכב בתשלומים: הרכב נרשם על שמך (עם שעבוד לחברת המימון), אתה אחראי לתחזוקה ולביטוח, ובסוף התקופה הרכב שלך תמורת תשלום סיום מוסכם. ליסינג תפעולי הוא שכירות ארוכת טווח: חברת הליסינג נשארת הבעלים, אתה משלם דמי שכירות חודשיים קבועים שכוללים לרוב תחזוקה, ביטוח וטיפולים, ובסוף התקופה מחזירים את הרכב (או קונים אותו במחיר שוק).',
  },
  {
    question: 'איך נרשם כל סוג ליסינג בהנהלת החשבונות?',
    answer:
      'בליסינג מימוני הרכב נרשם כנכס בספרי העסק ומולו התחייבות לחברת המימון; ההוצאה המוכרת היא פחת שנתי על הרכב בתוספת רכיב הריבית שבתשלומים. בליסינג תפעולי הרכב אינו נכס של העסק - התשלום החודשי נרשם כהוצאת שכירות שוטפת. בשני המקרים ההכרה במס על רכב פרטי כפופה למגבלות הוצאות רכב (תיאום מול שווי שימוש או שיעור מההוצאה), ולכן כדאי לוודא את החישוב מול רואה החשבון.',
  },
  {
    question: 'האם אפשר לקזז מע"מ על תשלומי ליסינג?',
    answer:
      'על רכב פרטי - ככלל לא. מס התשומות על רכישת רכב פרטי אסור בניכוי (תקנה 14(ב) לתקנות מע"מ), ועמדת רשות המסים (פרשנות 1/2002) היא שגם רכיב השכירות בליסינג - מימוני או תפעולי - דינו כדין רכישה ואינו ניתן לניכוי. רכיב תחזוקה שמופרד בחשבונית ניתן לניכוי חלקי לפי תקנה 18 (בדרך כלל שני שליש כשעיקר השימוש עסקי). על רכב מסחרי מעל 3.5 טון או עוסקים חריגים (השכרה, הסעות, לימוד נהיגה) הכללים שונים.',
  },
  {
    question: 'האם משלמים שווי שימוש גם בליסינג תפעולי וגם במימוני?',
    answer:
      'כן. שווי השימוש נקבע לפי הרכב שהועמד לרשות העובד, לא לפי צורת המימון שלו. עובד שמקבל רכב צמוד מחויב בשווי שימוש חודשי של ' +
      pct(LINEAR_USAGE_RATE_2026) +
      ' ממחיר המחירון של הרכב (עד תקרת מחיר של ' +
      fmt(USAGE_VALUE_PRICE_CEILING_2026) +
      ' ₪ ב-2026), בין אם הרכב בליסינג תפעולי, מימוני או בבעלות החברה. לרכב חשמלי והיברידי יש הפחתה בסכום קבוע.',
  },
  {
    question: 'מה עדיף לעסק קטן - ליסינג מימוני או תפעולי?',
    answer:
      'תלוי במטרה. אם חשוב לך תזרים צפוי בלי הפתעות (טיפולים, ביטוח, ירידת ערך) ואתה מחליף רכב כל 3 שנים - ליסינג תפעולי נוח יותר, אבל בדרך כלל יקר יותר לאורך זמן כי אתה משלם על הנוחות. אם אתה מתכוון להחזיק את הרכב שנים רבות ורוצה לצבור נכס - ליסינג מימוני (או הלוואה רגילה) לרוב זול יותר בסך הכל, אבל דורש הון עצמי גבוה יותר ונושא את סיכון ירידת הערך. המחשבון באתר משווה את העלות הכוללת של המסלולים.',
  },
];

export default function LeasingMimuniVsTifuliPage() {
  return (
    <>
      <CalculatorLayout
        title="ליסינג מימוני מול ליסינג תפעולי - מה ההבדל?"
        description="שני מסלולים שנקראים ליסינג אבל שונים מהותית: אחד הוא קנייה בתשלומים ואחד הוא שכירות ארוכת טווח. השוואה מלאה לעסק ולפרטי: בעלות, פחת, מע&quot;מ, שווי שימוש ותזרים."
        breadcrumbs={[
          { label: 'דף הבית', href: '/' },
          { label: 'דפי השוואה', href: '/compare' },
          { label: 'ליסינג מימוני מול תפעולי' },
        ]}
        lastUpdated="2026-08-15"
        pageUrl="/compare/leasing-mimuni-vs-tifuli"
        calculator={<VehicleOwnershipCalculator />}
        quickAnswer={
          <p className="text-lg text-ink leading-relaxed">
            <strong>
              ליסינג מימוני הוא קניית רכב בתשלומים: הרכב נרשם על שמכם, נחשב נכס בספרים, ובסוף
              התקופה הוא שלכם. ליסינג תפעולי הוא שכירות ארוכת טווח: חברת הליסינג נשארת הבעלים,
              והתשלום החודשי — שכולל לרוב תחזוקה וביטוח — נרשם כהוצאת שכירות.
            </strong>{' '}
            ההשלכות: במימוני מכירים בפחת ובריבית וסופגים את ירידת הערך, בתפעולי מקבלים תזרים
            קבוע וצפוי אך משלמים פרמיה על הנוחות. מבחינת מע&quot;מ, על רכב פרטי אין ניכוי מס
            תשומות על רכיב הרכישה/השכירות בשני המסלולים, ורק רכיב תחזוקה מופרד ניתן לניכוי חלקי.
            שווי השימוש לעובד ({USAGE_RATE_PCT} ממחיר המחירון) זהה בשני המסלולים. המחשבון שמתחת
            משווה את העלות הכוללת של החלופות לאורך שנים.
          </p>
        }
        content={
          <>
            <h2>שני מוצרים שונים עם אותו שם</h2>
            <p>
              המילה &quot;ליסינג&quot; מבלבלת כי היא מתארת שני מוצרים כלכליים שונים לגמרי:
              מסלול מימון לרכישת רכב (מימוני) ומסלול שכירות (תפעולי). הבחירה ביניהם משפיעה על
              הבעלות, על הרישום בספרים, על המס ועל התזרים. לפני שצוללים לטבלה — אם אתם מתלבטים
              בין ליסינג לקנייה במזומן או בהלוואה,{' '}
              <Link href="/vehicles/leasing-vs-buying" className="text-gold underline">
                מחשבון ליסינג מול קנייה
              </Link>{' '}
              עושה את ההשוואה המספרית המלאה.
            </p>

            <h2>טבלת השוואה - ליסינג מימוני מול תפעולי</h2>

            <div className="overflow-x-auto my-6">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-ink text-cream">
                    <th className="border border-ink/20 p-3 text-right font-bold">קריטריון</th>
                    <th className="border border-ink/20 p-3 text-right font-bold text-cream">
                      🔑 ליסינג מימוני
                    </th>
                    <th className="border border-ink/20 p-3 text-right font-bold text-cream">
                      🔄 ליסינג תפעולי
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-ink/15 p-3 font-semibold">מהות העסקה</td>
                    <td className="border border-ink/15 p-3">קנייה בתשלומים (מימון)</td>
                    <td className="border border-ink/15 p-3">שכירות ארוכת טווח (לרוב 3 שנים)</td>
                  </tr>
                  <tr className="bg-cream-2">
                    <td className="border border-ink/15 p-3 font-semibold">בעלות ורישום</td>
                    <td className="border border-ink/15 p-3">
                      הרכב על שמך, עם שעבוד לחברת המימון עד סיום התשלומים
                    </td>
                    <td className="border border-ink/15 p-3">
                      הרכב בבעלות חברת הליסינג לאורך כל התקופה
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-ink/15 p-3 font-semibold">רישום בספרים</td>
                    <td className="border border-ink/15 p-3">
                      נכס במאזן + התחייבות; הוצאות: פחת + ריבית
                    </td>
                    <td className="border border-ink/15 p-3">
                      אין נכס; התשלום החודשי נרשם כהוצאת שכירות שוטפת
                    </td>
                  </tr>
                  <tr className="bg-cream-2">
                    <td className="border border-ink/15 p-3 font-semibold">
                      מע&quot;מ ({VAT_PCT}) - רכב פרטי
                    </td>
                    <td className="border border-ink/15 p-3">
                      אין ניכוי מס תשומות על הרכישה/התשלומים (תקנה 14(ב))
                    </td>
                    <td className="border border-ink/15 p-3">
                      אין ניכוי על רכיב השכירות; רכיב תחזוקה מופרד - ניכוי חלקי לפי תקנה 18
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-ink/15 p-3 font-semibold">שווי שימוש לעובד</td>
                    <td className="border border-ink/15 p-3">
                      {USAGE_RATE_PCT} ממחיר המחירון לחודש (עד תקרת {USAGE_CEILING} ₪)
                    </td>
                    <td className="border border-ink/15 p-3">
                      זהה - שווי השימוש לא תלוי בצורת המימון
                    </td>
                  </tr>
                  <tr className="bg-cream-2">
                    <td className="border border-ink/15 p-3 font-semibold">תחזוקה וביטוח</td>
                    <td className="border border-ink/15 p-3">באחריותך ועל חשבונך</td>
                    <td className="border border-ink/15 p-3">
                      כלולים בדרך כלל בתשלום החודשי (כולל רכב חלופי)
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-ink/15 p-3 font-semibold">תזרים מזומנים</td>
                    <td className="border border-ink/15 p-3">
                      מקדמה גבוהה יחסית + תשלומים; הוצאות תחזוקה לא צפויות
                    </td>
                    <td className="border border-ink/15 p-3">
                      תשלום חודשי קבוע וצפוי, מקדמה נמוכה או ללא
                    </td>
                  </tr>
                  <tr className="bg-cream-2">
                    <td className="border border-ink/15 p-3 font-semibold">ירידת ערך</td>
                    <td className="border border-ink/15 p-3">הסיכון עליך - הרכב נכס שלך</td>
                    <td className="border border-ink/15 p-3">הסיכון על חברת הליסינג</td>
                  </tr>
                  <tr>
                    <td className="border border-ink/15 p-3 font-semibold">מגבלות שימוש</td>
                    <td className="border border-ink/15 p-3">אין - הרכב שלך</td>
                    <td className="border border-ink/15 p-3">
                      הגבלת ק&quot;מ שנתית, חיוב על חריגה ועל נזקים בהחזרה
                    </td>
                  </tr>
                  <tr className="bg-cream-2">
                    <td className="border border-ink/15 p-3 font-semibold">סוף התקופה</td>
                    <td className="border border-ink/15 p-3">
                      הרכב עובר לבעלותך המלאה (תשלום סיום מוסכם מראש)
                    </td>
                    <td className="border border-ink/15 p-3">
                      מחזירים את הרכב, מחדשים לרכב חדש, או קונים באופציית רכישה
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h2>מע&quot;מ על ליסינג - הנקודה שמפתיעה בעלי עסקים</h2>
            <p>
              רבים מניחים שעסק יכול &quot;לקזז מע&quot;מ על הליסינג&quot;. בפועל, לגבי רכב פרטי
              (עד 3.5 טון, שאינו מסחרי מהחריגים), מס התשומות על רכישת הרכב אסור בניכוי — ועמדת
              רשות המסים היא שגם דמי השכירות בליסינג, תפעולי או מימוני, דינם כדין רכישה. מה שכן
              ניתן לניכוי חלקי הוא הוצאות השוטפות — דלק, טיפולים ורכיב תחזוקה שמופרד בחשבונית
              הליסינג — לפי יחס השימוש העסקי (בדרך כלל שני שליש כשעיקר השימוש עסקי). החריגים:
              חברות השכרה והסעות, לימוד נהיגה, ורכב מסחרי כבד.
            </p>

            <h2>שווי שימוש - זהה בשני המסלולים</h2>
            <p>
              כשעובד (או בעל שליטה) מקבל רכב צמוד, נזקף לשכרו &quot;שווי שימוש&quot; חודשי של{' '}
              {USAGE_RATE_PCT} ממחיר המחירון של הרכב, עד תקרת מחיר של {USAGE_CEILING} ₪ ב-2026 —
              ללא קשר לשאלה אם הרכב בליסינג תפעולי, מימוני או בבעלות מלאה. לרכב חשמלי, פלאג-אין
              והיברידי יש הפחתות בסכום קבוע.{' '}
              <Link href="/vehicles/company-car-benefit" className="text-gold underline">
                מחשבון שווי שימוש ברכב חברה
              </Link>{' '}
              מראה כמה מס זה מוסיף לתלוש בפועל.
            </p>

            <h2>מתי לבחור מה?</h2>
            <h3>ליסינג מימוני מתאים כש...</h3>
            <ul>
              <li>מתכוונים להחזיק את הרכב מעבר ל-3 שנים ולצבור נכס</li>
              <li>נוסעים הרבה ק&quot;מ ולא רוצים מגבלות קילומטראז&#39;</li>
              <li>מוכנים לנהל תחזוקה וביטוח לבד תמורת עלות כוללת נמוכה יותר</li>
              <li>יש הון עצמי למקדמה ורוצים בעלות מלאה בסוף</li>
            </ul>

            <h3>ליסינג תפעולי מתאים כש...</h3>
            <ul>
              <li>חשוב תזרים חודשי קבוע וצפוי, בלי הפתעות של מוסך וביטוח</li>
              <li>מחליפים רכב כל 2-3 שנים ולא רוצים להתעסק במכירה</li>
              <li>מנהלים צי רכבים לעובדים ורוצים מיקור חוץ של כל התפעול</li>
              <li>לא רוצים לשאת בסיכון ירידת הערך של הרכב</li>
            </ul>

            <h2>מחשבונים רלוונטיים</h2>
            <ul>
              <li>
                <Link href="/vehicles/leasing-vs-buying" className="text-gold underline">
                  מחשבון ליסינג מול קנייה
                </Link>{' '}
                - השוואת עלות כוללת: ליסינג, מימון וקנייה במזומן.
              </li>
              <li>
                <Link href="/vehicles/company-car-benefit" className="text-gold underline">
                  מחשבון שווי שימוש רכב חברה
                </Link>{' '}
                - כמה עולה רכב צמוד בתלוש.
              </li>
              <li>
                <Link href="/vehicles/fuel-cost" className="text-gold underline">
                  מחשבון עלויות דלק
                </Link>{' '}
                - ההוצאה השוטפת הגדולה ביותר אחרי ירידת הערך.
              </li>
            </ul>

            <p>
              רכב הוא אחת ההוצאות הגדולות של עסק קטן, והבחירה במסלול הנכון היא החלטה פיננסית
              לכל דבר. אם אתם רוצים לבנות תמונה מלאה של הוצאות, תמחור ותזרים בעסק —{' '}
              <Link href="/course/business" className="text-gold underline">
                קורס ניהול פיננסי לבעלי עסקים
              </Link>{' '}
              מלמד בדיוק את זה.
            </p>
          </>
        }
        faq={<FAQ items={faqItems} />}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
    </>
  );
}
