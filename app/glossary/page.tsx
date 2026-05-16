import type { Metadata } from 'next';
import Link from 'next/link';
import { GlossaryClient, type GlossaryTerm } from './GlossaryClient';

export const metadata: Metadata = {
  title: 'מילון מונחים פיננסיים – הגדרות בעברית פשוטה',
  description:
    'מילון מונחים פיננסיים מקיף: 80+ מושגים חשובים מעולם המס, ההשקעות, המשכנתאות והעצמאיים. הגדרה ברורה + לינק למחשבון רלוונטי.',
  alternates: { canonical: '/glossary' },
  openGraph: {
    title: 'מילון מונחים פיננסיים – הגדרות בעברית פשוטה',
    description:
      'מילון מונחים פיננסיים מקיף: 80+ מושגים חשובים מעולם המס, ההשקעות, המשכנתאות והעצמאיים.',
    type: 'website',
    locale: 'he_IL',
  },
};

const ALL_TERMS: GlossaryTerm[] = [
  // א
  {
    id: 'options-102',
    term: 'אופציות 102',
    letter: 'א',
    definition:
      'מסלול מיסוי עדיף לאופציות מניות שניתנות לעובדים. אחרי החזקה של 24 חודש – המס הוא 25% רווחי הון במקום 47%+ מס הכנסה. הטבה עצומה לעובדי היי-טק.',
    seeAlso: [{ label: 'מחשבון מס', href: '/personal-tax/income-tax' }],
  },
  {
    id: 'ltv-percent',
    term: 'אחוז מימון (LTV)',
    letter: 'א',
    definition:
      'Loan to Value – יחס בין הלוואה לערך הנכס. למשל: דירה ב-2M₪ עם משכנתא 1.5M₪ = LTV 75%. מגבלה חוקית: 75% לדירה ראשונה, 50% לדירה שנייה (הוראה 329).',
    seeAlso: [
      { label: 'מחשבון משכנתא', href: '/real-estate/mortgage' },
      { label: 'מדריך משכנתא שלם', href: '/guides/mortgage-complete-guide-2026' },
    ],
  },
  {
    id: 'inflation',
    term: 'אינפלציה',
    letter: 'א',
    definition:
      'עליית מחירים כללית בכלכלה, מבוטאת כאחוז שנתי. מדד המחירים לצרכן (מד"מ) מודד אינפלציה בישראל. אינפלציה גבוהה מזיקה לחיסכון, לצמוד מדד, ולרכישת כוח קנייה.',
    seeAlso: [{ label: 'מדריך השקעות', href: '/blog/inflation-and-investments' }],
  },
  {
    id: 'preliminary-approval',
    term: 'אישור עקרוני',
    letter: 'א',
    definition:
      'אישור בנקאי ראשוני לקבלת משכנתא בסכום מסוים, ללא קשר לנכס ספציפי. תוקף: 90 ימים. מאפשר חיפוש דירה בידיעה כמה אפשר לקבל.',
    seeAlso: [{ label: 'מחשבון משכנתא', href: '/real-estate/mortgage' }],
  },
  // ב
  {
    id: 'bonus',
    term: 'בונוס',
    letter: 'ב',
    definition:
      'תשלום חד-פעמי נוסף לשכר. בונוס שהובטח בחוזה – מחויב חוקית. בונוס שנתי שניתן 3+ שנים ברציפות עלול להיחשב "זכות מוקנית". חייב במס הכנסה וב.ל. כמו שכר.',
    seeAlso: [{ label: 'מחשבון בונוס', href: '/employee-rights/annual-bonus' }],
  },
  {
    id: 'bituach-leumi',
    term: 'ביטוח לאומי (ב.ל.)',
    letter: 'ב',
    definition:
      'תשלומי חובה לב.ל. המממן גמלאות: אבטלה, לידה, זקנה, נכות, מחלה. שכיר: ~3.5% עובד + ~3.55% מעסיק. עצמאי: ~16% לבדו. הגמלאות שמקבלים תלויות בהכנסה ובוותק.',
    seeAlso: [
      { label: 'מחשבון ב.ל. עצמאי', href: '/self-employed/social-security' },
      { label: 'מדריך ב.ל.', href: '/blog/bituach-leumi-self-employed-deep-dive' },
    ],
  },
  {
    id: 'balloon',
    term: 'בלון (הלוואת)',
    letter: 'ב',
    definition:
      'הלוואה שבה כל הקרן מוחזרת בסוף התקופה בבת אחת. לאורך כל התקופה משלמים ריבית בלבד. נפוץ בהלוואות עסקיות. בנדל"ן לאנשים פרטיים – נדיר ולא מומלץ.',
    seeAlso: [{ label: 'מדריך משכנתא', href: '/guides/mortgage-complete-guide-2026' }],
  },
  // ג
  {
    id: 'retirement-age',
    term: 'גיל פרישה',
    letter: 'ג',
    definition:
      'גיל פרישה חובה בישראל: 67 לגברים, 65 לנשים (מדורג עד 67 בשנים הקרובות). גיל זכאות לפנסיה מב.ל.: 67 לגברים, 62 לנשים (מדורג). ניתן לדחות גיל פרישה ולהגדיל קצבה.',
    seeAlso: [{ label: 'מחשבון פנסיה', href: '/insurance/pension' }],
  },
  {
    id: 'grace',
    term: 'גרייס (תקופת)',
    letter: 'ג',
    definition:
      'תקופה בתחילת הלוואה שבה משלמים ריבית בלבד, ללא קרן. ההחזר נמוך יותר בזמן זה, אבל הקרן לא יורדת – ולכן הריבית הכוללת לאורך ההלוואה גבוהה יותר.',
    seeAlso: [{ label: 'מדריך משכנתא', href: '/guides/mortgage-complete-guide-2026' }],
  },
  {
    id: 'unemployment-benefit',
    term: 'גמלת אבטלה',
    letter: 'ג',
    definition:
      'דמי אבטלה = 70%–80% מהשכר הממוצע (עד תקרה), לאחר פיטורים. תנאי זכאות: 360 ימי עבודה ב-18 חודשים האחרונים. תקופה: 100–175 ימים לפי גיל.',
    seeAlso: [{ label: 'מחשבון דמי אבטלה', href: '/employee-rights/unemployment-benefits' }],
  },
  // ד
  {
    id: 'convalescence-pay',
    term: 'דמי הבראה',
    letter: 'ד',
    definition:
      'תשלום שנתי חובה מהמעסיק. 2026: 418 ₪ ליום. עובד לאחר שנה ראשונה: 5 ימים (2,090 ₪). גדל עם ותק עד 10 ימים (4,180 ₪). משולם פעם בשנה, בדרך כלל לפני חופשת קיץ.',
    seeAlso: [{ label: 'מחשבון הבראה', href: '/employee-rights/recreation-pay' }],
  },
  {
    id: 'maternity-benefits',
    term: 'דמי לידה',
    letter: 'ד',
    definition:
      'גמלת ב.ל. לאם עובדת במהלך חופשת לידה. 105 ימים (15 שבועות) בתשלום מלא לפי שכר ממוצע. פטורים לחלוטין ממס הכנסה! ניתן להעביר חלק לאב.',
    seeAlso: [{ label: 'מחשבון דמי לידה', href: '/employee-rights/maternity-benefits' }],
  },
  {
    id: 'sick-pay',
    term: 'דמי מחלה',
    letter: 'ד',
    definition:
      'תשלום בעת מחלה: יום ראשון ללא תשלום, ימים 2–3 ב-50%, מהיום 4 ב-100%. צבירה: 1.5 יום/חודש עד 90 ימים. מחייב תעודת מחלה מרופא.',
    seeAlso: [{ label: 'מחשבון דמי מחלה', href: '/employee-rights/sick-pay' }],
  },
  {
    id: 'dividend',
    term: 'דיבידנד',
    letter: 'ד',
    definition:
      'חלוקת רווחי חברה לבעלי מניות. מס על דיבידנד: 25% לבעל מניות רגיל, 30% לבעל שליטה (10%+). משולם אחרי מס חברות (23%). מס אפקטיבי: ~46%.',
    seeAlso: [
      { label: 'מחשבון דיבידנד vs. שכר', href: '/self-employed/dividend-vs-salary' },
      { label: 'מדריך מסים', href: '/guides/taxes-complete-guide-2026' },
    ],
  },
  {
    id: 'first-apartment',
    term: 'דירה ראשונה',
    letter: 'ד',
    definition:
      'קנייה של הדירה היחידה להחזקה. מזכה ב: LTV עד 75%, מדרגות מס רכישה מופחתות (0% עד ~1.98M₪), ועשויה לזכות בפטור ממס שבח בעת מכירה.',
    seeAlso: [
      { label: 'מחשבון מס רכישה', href: '/real-estate/purchase-tax' },
      { label: 'מחשבון משכנתא', href: '/real-estate/mortgage' },
    ],
  },
  // ה
  {
    id: 'recognized-expense',
    term: 'הוצאה מוכרת',
    letter: 'ה',
    definition:
      'הוצאה עסקית שניתן לנכות מההכנסה החייבת במס. מפחיתה את הרווח שעליו משלמים מס. לא כל הוצאה מוכרת – הוצאות פרטיות (למשל: ארוחה פרטית) אינן מוכרות.',
    seeAlso: [{ label: 'מדריך מסים', href: '/guides/taxes-complete-guide-2026' }],
  },
  {
    id: 'equity',
    term: 'הון עצמי',
    letter: 'ה',
    definition:
      'כסף מזומן / נכסים שיש לך ממקורות עצמיים (לא הלוואה). לרכישת דירה: נדרש הון עצמי מינימלי 25%–50% מהנכס + 5% נוסף לעלויות עסקה.',
    seeAlso: [{ label: 'מחשבון משכנתא', href: '/real-estate/mortgage' }],
  },
  {
    id: 'taxable-income',
    term: 'הכנסה חייבת',
    letter: 'ה',
    definition:
      'ההכנסה שעליה מחשבים מס הכנסה, לאחר הפחתת הוצאות מוכרות, ניכויים (פנסיה, קרן השתלמות) ופטורים. נמוכה יותר מהכנסה ברוטו.',
    seeAlso: [{ label: 'מחשבון מס הכנסה', href: '/personal-tax/income-tax' }],
  },
  {
    id: 'directive-329',
    term: 'הוראה 329',
    letter: 'ה',
    definition:
      'הוראת ניהול בנקאי תקין של בנק ישראל. קובעת: שליש קבוע במשכנתא, שליש מקסימום פריים, LTV 75% לדירה ראשונה ו-50% לשנייה. מגן על לווים מסיכון ריבית.',
    seeAlso: [
      { label: 'מדריך משכנתא', href: '/guides/mortgage-complete-guide-2026' },
      { label: 'מאמר על הוראה 329', href: '/blog/boi-directive-329-mortgage-rules' },
    ],
  },
  {
    id: 'cpi-linkage',
    term: 'הצמדה למדד',
    letter: 'ה',
    definition:
      'קישור יתרת הלוואה (או חיסכון) למדד המחירים לצרכן. אם המדד עולה 3% – הקרן גדלה ב-3%. בתקופת אינפלציה גבוהה – מסוכן מאוד למי שלווה.',
    seeAlso: [{ label: 'מדריך משכנתא', href: '/guides/mortgage-complete-guide-2026' }],
  },
  // ח
  {
    id: 'llc',
    term: 'חברה בע"מ',
    letter: 'ח',
    definition:
      'חברה בעירבון מוגבל – ישות משפטית נפרדת. מס חברות: 23%. בעל השליטה משלם מס נוסף על משיכת דיבידנד (30%). כדאית כשהרווח עולה על ~400K₪ לשנה.',
    seeAlso: [
      { label: 'השוואה: חברה vs. עוסק', href: '/self-employed/corporation-vs-individual' },
      { label: 'מדריך מסים', href: '/guides/taxes-complete-guide-2026' },
    ],
  },
  {
    id: 'annual-leave',
    term: 'חופשה שנתית',
    letter: 'ח',
    definition:
      'חופשה שנתית בתשלום לפי חוק. ותק עד 4 שנים: 12 ימי עסקים. מהשנה 5: 14–24 ימים. פדיון חופשה שלא נוצלה: מגיע לפי שכר אחרון. לא ניתן לוותר עליה.',
    seeAlso: [{ label: 'מדריך זכויות עובד', href: '/guides/employee-rights-complete-guide' }],
  },
  {
    id: 'maternity-leave',
    term: 'חופשת לידה',
    letter: 'ח',
    definition:
      'זכות לאם לחופשה של עד 26 שבועות. 15 שבועות (105 ימים) בתשלום דמי לידה מב.ל. – פטורים ממס! 7 שבועות ניתן להעביר לאב. הגנה מפיטורין במהלך + 60 יום אחרי.',
    seeAlso: [{ label: 'מחשבון דמי לידה', href: '/employee-rights/maternity-benefits' }],
  },
  // ל
  {
    id: 'amortization-table',
    term: 'לוח סילוקין',
    letter: 'ל',
    definition:
      'טבלה המציגה את כל תשלומי ההלוואה לאורך זמן, עם פירוט קרן וריבית. שפיצר: תשלום קבוע לכל החיים. קרן שווה: תשלום יורד עם הזמן.',
    seeAlso: [{ label: 'מחשבון משכנתא', href: '/real-estate/mortgage' }],
  },
  {
    id: 'leasing',
    term: 'ליסינג',
    letter: 'ל',
    definition:
      'שכירת רכב ארוכת טווח (3–5 שנים). תשלום חודשי קבוע, בלי בעלות על הרכב. כולל לרוב: ביטוח, אחזקה, שינוי צמיגים. ליסינג תפעולי vs. ממוני – הבדלי חשבונאות ומס.',
    seeAlso: [
      { label: 'ליסינג vs. קנייה', href: '/vehicles/leasing-vs-buying' },
      { label: 'מדריך ליסינג', href: '/blog/leasing-vs-buying-vs-cash-decision' },
    ],
  },
  // מ
  {
    id: 'tax-brackets',
    term: 'מדרגות מס',
    letter: 'מ',
    definition:
      'שיטת מיסוי פרוגרסיבית שבה כל "פרוסת" הכנסה ממוסה בשיעור עולה. ישראל 2026: 10%, 14%, 20%, 31%, 35%, 47%, 50%. רק השקלים מעל הסף ממוסים בשיעור הגבוה.',
    seeAlso: [
      { label: 'מחשבון מס הכנסה', href: '/personal-tax/income-tax' },
      { label: 'מדריך מסים', href: '/guides/taxes-complete-guide-2026' },
    ],
  },
  {
    id: 'vat',
    term: 'מע"מ',
    letter: 'מ',
    definition:
      'מס ערך מוסף – 18% (2026). גבייה ממצרכים ושירותים. עוסק מורשה גובה ומעביר לרשות המסים, ומזכה תשומות. עוסק פטור: מחזור עד 120,000 ₪, לא גובה ולא מזוכה.',
    seeAlso: [
      { label: 'מחשבון מע"מ', href: '/self-employed/vat' },
      { label: 'מדריך מע"מ', href: '/blog/vat-complete-guide-israel' },
    ],
  },
  {
    id: 'reverse-mortgage',
    term: 'משכנתא הפוכה',
    letter: 'מ',
    definition:
      'הלוואה לבעלי דירה מעל גיל 60, כנגד ערך הדירה. אין תשלום חודשי – הריבית מצטברת. ההחזר בעת מכירת הדירה (לרוב בפטירה). מאפשר נזילות לגמלאים עם דירה.',
    seeAlso: [{ label: 'מחשבון משכנתא', href: '/real-estate/mortgage' }],
  },
  {
    id: 'surtax',
    term: 'מס יסף',
    letter: 'מ',
    definition:
      'תוספת מס של 3% על הכנסה מעל 721,560 ₪ לשנה (2026). חל על כלל ההכנסות: שכר, עסק, שכ"ד, דיבידנד, רווחי הון. גם מכירת נכס יכולה להביא לחבות יסף.',
    seeAlso: [
      { label: 'מדריך מסים', href: '/guides/taxes-complete-guide-2026' },
      { label: 'מאמר מס יסף', href: '/blog/surtax-yesef-2026-explained' },
    ],
  },
  {
    id: 'capital-gains-tax',
    term: 'מס שבח',
    letter: 'מ',
    definition:
      'מס על רווח ממכירת נדל"ן (25%). קיים מנגנון לינארי שמחלק את השבח לתקופות לפני/אחרי 2014. דירת מגורים יחידה שגרת בה 18+ חודשים – פטורה ממס שבח.',
    seeAlso: [
      { label: 'מחשבון מס שבח', href: '/real-estate/capital-gains-tax' },
      { label: 'מדריך מס שבח', href: '/blog/capital-gains-tax-property-2026' },
    ],
  },
  {
    id: 'tax-advances',
    term: 'מקדמות מס',
    letter: 'מ',
    definition:
      'תשלומים חודשיים שעצמאים מעבירים לרשות המסים על חשבון מס הכנסה השנתי. מחושבות כ-% מהמחזור. בסוף השנה מגישים דוח ומתמרים – תשלום יתרה או קבלת החזר.',
    seeAlso: [{ label: 'מחשבון מקדמות', href: '/self-employed/tax-advances' }],
  },
  {
    id: 'variable-5-year',
    term: 'משתנה כל 5 שנים',
    letter: 'מ',
    definition:
      'מסלול משכנתא שבו הריבית מתחדשת כל 5 שנים לפי ריבית השוק. לרוב צמוד מדד. ביום הריענון – אפשרות לפירעון מוקדם ללא עמלה. שילוב של סיכון מדד + סיכון ריבית.',
    seeAlso: [{ label: 'מדריך משכנתא', href: '/guides/mortgage-complete-guide-2026' }],
  },
  {
    id: 'conversion-factor',
    term: 'מקדם המרה',
    letter: 'מ',
    definition:
      'הגורם שמחשב את הקצבה החודשית מתוך הצבירה בפנסיה. נקבע על ידי חברת הביטוח/קרן הפנסיה לפי לוחות תמותה וריבית. מקדם נמוך = קצבה גבוהה יותר.',
    seeAlso: [{ label: 'מחשבון פנסיה', href: '/insurance/pension' }],
  },
  // נ
  {
    id: 'tax-credit-points',
    term: 'נקודות זיכוי',
    letter: 'נ',
    definition:
      'מנגנון להפחתת מס הכנסה ישירות. נקודה אחת = 242 ₪/חודש (2,904 ₪/שנה). כולם מקבלים 2.25 בסיסיות. ילדים, עלייה, תואר, נכות – מוסיפים נקודות.',
    seeAlso: [
      { label: 'מחשבון נקודות זיכוי', href: '/personal-tax/tax-credits' },
      { label: 'מאמר נקודות זיכוי', href: '/blog/tax-credit-points-2026' },
    ],
  },
  {
    id: 'net',
    term: 'נטו',
    letter: 'נ',
    definition:
      'שכר לאחר כל הניכויים: מס הכנסה, ביטוח לאומי, ביטוח בריאות, פנסיה. לעצמאי: הכנסה פחות הוצאות מוכרות, מסים, ב.ל. ופנסיה.',
    seeAlso: [
      { label: 'מחשבון שכר נטו', href: '/personal-tax/salary-net-gross' },
      { label: 'מחשבון נטו עצמאי', href: '/self-employed/net' },
    ],
  },
  {
    id: 'real-estate-investment',
    term: 'נדל"ן להשקעה',
    letter: 'נ',
    definition:
      'רכישת נכס לצורך השכרה ו/או השבחה. בישראל: LTV מוגבל ל-50%. מס רכישה: 8%–10%. תשואת שכירות: 3%–5%. לפני רכישה – חשב מס שבח עתידי ומס רכישה.',
    seeAlso: [
      { label: 'אסטרטגיית השקעה בנדל"ן', href: '/blog/real-estate-investment-strategy' },
    ],
  },
  // ס
  {
    id: 'section-14',
    term: 'סעיף 14',
    letter: 'ס',
    definition:
      'סעיף 14 לחוק פיצויי פיטורין. מאפשר למעסיק לשלם לקרן פנסיה 8.33% כ"פיצויים" במקום להחזיק את הכסף. אם יש הסדר סעיף 14 – הכסף בפנסיה שייך לעובד גם אם התפטר.',
    seeAlso: [
      { label: 'מחשבון פיצויים', href: '/employee-rights/severance' },
      { label: 'מדריך זכויות', href: '/guides/employee-rights-complete-guide' },
    ],
  },
  {
    id: 'social-benefits',
    term: 'סוציאליות',
    letter: 'ס',
    definition:
      'מכלול התנאים הסוציאליים שמעסיק מחויב לספק: פנסיה, קרן השתלמות, ביטוח חיים, פיצויים, חופשה, מחלה, הבראה, נסיעות. "עלות מעסיק" כוללת את כולם.',
    seeAlso: [
      { label: 'מחשבון עלות מעסיק', href: '/self-employed/employer-cost' },
      { label: 'מדריך זכויות', href: '/guides/employee-rights-complete-guide' },
    ],
  },
  // ע
  {
    id: 'exempt-dealer',
    term: 'עוסק פטור',
    letter: 'ע',
    definition:
      'עסק קטן עם מחזור עד 120,000 ₪/שנה. פטור מגביית מע"מ ומדיווח מע"מ חודשי. החיסרון: לא יכול להחזיר מע"מ על הוצאות, ולקוחות עסקיים לא יכולים לנכות מע"מ ממנו.',
    seeAlso: [
      { label: 'מחשבון מע"מ', href: '/self-employed/vat' },
      { label: 'מדריך מסים', href: '/guides/taxes-complete-guide-2026' },
    ],
  },
  {
    id: 'authorized-dealer',
    term: 'עוסק מורשה',
    letter: 'ע',
    definition:
      'עסק שמחזורו מעל 120,000 ₪/שנה (חובה), או עוסק שבחר להירשם גם מתחת לסף. גובה 18% מע"מ, מגיש דיווח דו-חודשי/חודשי. מקבל החזר מע"מ על הוצאות.',
    seeAlso: [{ label: 'מחשבון מע"מ', href: '/self-employed/vat' }],
  },
  {
    id: 'employer-cost',
    term: 'עלות מעסיק',
    letter: 'ע',
    definition:
      'העלות הכוללת של עובד למעסיק: שכר ברוטו + ב.ל. מעסיק (7.6%) + פנסיה מעסיק (6.5%) + פיצויים (6%) + קרן השתלמות (7.5%) + הבראה + נסיעות. לרוב 130%–145% מהברוטו.',
    seeAlso: [{ label: 'מחשבון עלות מעסיק', href: '/self-employed/employer-cost' }],
  },
  // פ
  {
    id: 'severance',
    term: 'פיצויי פיטורין',
    letter: 'פ',
    definition:
      'שכר אחרון × שנות ותק. מגיע לאחר שנת עבודה ראשונה. עמ זכאי: פיטורים, התפטרות בדין מפוטר, פרישה לגמלאות. פטור ממס: 12,360 ₪ לשנת ותק (2026).',
    seeAlso: [
      { label: 'מחשבון פיצויים', href: '/employee-rights/severance' },
      { label: 'מדריך פיצויים', href: '/blog/severance-pay-complete-guide' },
    ],
  },
  {
    id: 'pension',
    term: 'פנסיה',
    letter: 'פ',
    definition:
      'חיסכון פנסיוני חובה. שכיר: 6% עובד + 6.5% מעסיק (תגמולים) + 6% מעסיק (פיצויים). עצמאי: הפקדת חובה מינימלית לפי גיל. פנסיה = קצבה חודשית בגיל פרישה + ביטוח נכות/שארים.',
    seeAlso: [
      { label: 'מחשבון פנסיה', href: '/insurance/pension' },
      { label: 'פנסיה עצמאי', href: '/self-employed/mandatory-pension' },
    ],
  },
  {
    id: 'prime',
    term: 'פריים',
    letter: 'פ',
    definition:
      'ריבית בנק ישראל + 1.5%. ריבית ב"י (מאי 2026): 4.5% → פריים: 6%. ריבית בסיסית שסביבה מחושבים מסלולי משכנתא. ריבית ב"י עולה → פריים עולה.',
    seeAlso: [
      { label: 'מחשבון משכנתא', href: '/real-estate/mortgage' },
      { label: 'מדריך מסלולי משכנתא', href: '/blog/mortgage-tracks-guide-2026' },
    ],
  },
  {
    id: 'early-repayment',
    term: 'פירעון מוקדם',
    letter: 'פ',
    definition:
      'החזר הלוואה לפני הזמן. על פריים: ללא עמלה. על מסלולים קבועים: עמלת פירעון מוקדם = הפרש ריביות × שנים × יתרה. כדאי לחשב האם חיסכון עולה על העמלה.',
    seeAlso: [{ label: 'מדריך משכנתא', href: '/guides/mortgage-complete-guide-2026' }],
  },
  {
    id: 'vacation-redemption',
    term: 'פדיון חופשה',
    letter: 'פ',
    definition:
      'תשלום לעובד עבור ימי חופשה שלא נוצלו, בעת סיום עבודה. מחושב לפי שכר אחרון. לא ניתן לאבד ימי חופשה שצברת – המעסיק חייב לשלם פדיון.',
    seeAlso: [{ label: 'מדריך פדיון חופשה', href: '/blog/vacation-redemption-guide' }],
  },
  // צ
  {
    id: 'cpi-linked',
    term: 'צמוד מדד',
    letter: 'צ',
    definition:
      'הלוואה/חיסכון שיתרתו מעודכנת לפי מדד המחירים לצרכן. בתקופת אינפלציה – יתרת החוב גדלה. ב-2022 (אינפלציה 5.4%) יתרה של 1M₪ גדלה ל-1.054M₪.',
    seeAlso: [{ label: 'מדריך משכנתא', href: '/guides/mortgage-complete-guide-2026' }],
  },
  // ק
  {
    id: 'study-fund',
    term: 'קרן השתלמות',
    letter: 'ק',
    definition:
      'חיסכון פנסיוני עם הטבות מס. שכיר: מעסיק 7.5% + עובד 2.5%. ניתן למשוך אחרי 6 שנים בפטור מרווחי הון. אחד מכלי החיסכון הטובים ביותר בישראל.',
    seeAlso: [
      { label: 'מדריך קרן השתלמות', href: '/blog/study-fund-self-employed-strategy' },
      { label: 'מדריך מסים', href: '/guides/taxes-complete-guide-2026' },
    ],
  },
  {
    id: 'fixed-unlinked',
    term: 'קל"צ',
    letter: 'ק',
    definition:
      'קבוע לא צמוד – מסלול משכנתא עם ריבית קבועה שאינה צמודה למדד. ההחזר ידוע מראש לכל תקופה. בטוח יותר אך ריבית גבוהה מפריים. חייב להיות לפחות 33% מהתמהיל.',
    seeAlso: [
      { label: 'מדריך מסלולי משכנתא', href: '/blog/mortgage-tracks-guide-2026' },
    ],
  },
  {
    id: 'old-age-pension',
    term: 'קצבת זקנה',
    letter: 'ק',
    definition:
      'קצבה מב.ל. לאחר גיל פרישה. גובה: תלוי בוותק ביטוחי ובנסיבות. 2026: קצבה בסיסית ~4,500 ₪. ניתן לדחות גיל פרישה ולקבל קצבה גבוהה יותר.',
    seeAlso: [{ label: 'מחשבון פרישה', href: '/investments/retirement' }],
  },
  // ר
  {
    id: 'compound-interest',
    term: 'ריבית דריבית',
    letter: 'ר',
    definition:
      'ריבית שמצטברת על גם הריבית שנצברה בעבר. "פלא העולם השמיני" (אלברט איינשטיין). 100,000 ₪ ב-7% ל-30 שנה = 761,226 ₪. כוח המייצר עושר בטווח ארוך.',
    seeAlso: [
      { label: 'מחשבון ריבית דריבית', href: '/investments/compound-interest' },
      { label: 'מאמר ריבית דריבית', href: '/blog/compound-interest-and-time-magic' },
    ],
  },
  {
    id: 'company-car',
    term: 'רכב חברה',
    letter: 'ר',
    definition:
      'רכב שהמעסיק נותן לעובד לשימוש פרטי. נחשב "שווי שימוש" = הכנסת עבודה החייבת במס. גובה: לפי קבוצת מחיר הרכב. רכב חשמלי: הנחה של 30% בשווי שימוש.',
    seeAlso: [
      { label: 'מחשבון שווי שימוש', href: '/vehicles/company-car-benefit' },
      { label: 'מדריך רכב חברה', href: '/blog/company-car-tax-2026' },
    ],
  },
  {
    id: 'annuity-continuity',
    term: 'רצף קצבה',
    letter: 'ר',
    definition:
      'הכנסת פיצויי פיטורין לקרן פנסיה לצורך קצבה, תוך שמירת פטור. מאפשר לדחות מס על הפיצויים עד הפרישה. קצבה שמקורה ברצף קצבה – פטורה ממס (עד תקרה).',
    seeAlso: [{ label: 'מחשבון פיצויים', href: '/employee-rights/severance' }],
  },
  // ש
  {
    id: 'benefit-value',
    term: 'שווי שימוש',
    letter: 'ש',
    definition:
      'שווי הכלכלי של הטבה שמעסיק נותן לעובד (מלבד שכר). שווי שימוש ברכב, בדיור, בקיצבת אש"ל – נחשב הכנסה ומחויב במס. חשוב לדעת כדי לחשב שכר נטו אמיתי.',
    seeAlso: [{ label: 'מחשבון שווי שימוש', href: '/vehicles/company-car-benefit' }],
  },
  {
    id: 'minimum-wage',
    term: 'שכר מינימום',
    letter: 'ש',
    definition:
      'שכר מינימום חודשי 2026: 6,443.85 ₪ (ל-186 שעות). שעתי: 34.64 ₪. אינו ניתן לוויתור – גם עם הסכמת עובד. מעסיק שמשלם פחות חשוף לקנסות ותביעה.',
    seeAlso: [{ label: 'מחשבון שכר מינימום', href: '/employee-rights/minimum-wage' }],
  },
  {
    id: 'spitzer',
    term: 'שפיצר',
    letter: 'ש',
    definition:
      'לוח סילוקין שפיצר – ההחזר החודשי קבוע לאורך כל ההלוואה. בהתחלה רוב ההחזר הוא ריבית, בסוף רוב הקרן. הנפוץ ביותר בישראל. ריבית כוללת גבוהה יותר מקרן שווה.',
    seeAlso: [{ label: 'מחשבון משכנתא', href: '/real-estate/mortgage' }],
  },
  {
    id: 'marginal-tax-rate',
    term: 'שיעור מס שולי',
    letter: 'ש',
    definition:
      'אחוז המס על השקל האחרון שהרווחת. בישראל: 10%–50% לפי מדרגות. שיעור שולי ≠ מס אפקטיבי. דוגמה: הכנסה 300,000 ₪ → שיעור שולי 35%, אך מס אפקטיבי ~22%.',
    seeAlso: [{ label: 'מחשבון מס הכנסה', href: '/personal-tax/income-tax' }],
  },
  // ת
  {
    id: 'mix',
    term: 'תמהיל',
    letter: 'ת',
    definition:
      'שילוב המסלולים בתוך משכנתא (פריים, קל"צ, משתנה). לפי הוראה 329: שליש קבוע, שליש מקסימום פריים. תמהיל נכון לפי פרופיל: גיל, סיבולת סיכון, אורך הלוואה.',
    seeAlso: [
      { label: 'אופטימייזר תמהיל', href: '/real-estate/mortgage-optimizer' },
      { label: 'מדריך משכנתא', href: '/guides/mortgage-complete-guide-2026' },
    ],
  },
  {
    id: 'tax-coordination',
    term: 'תיאום מס',
    letter: 'ת',
    definition:
      'הסדר בין מספר מעסיקים לגבי הניכוי של מס הכנסה. חיוני כשיש יותר מעסיק אחד. ללא תיאום – ינוכה מס גבוה מדי (כל מעסיק מניח שאין הכנסה ממקורות אחרים).',
    seeAlso: [{ label: 'מחשבון שכר נטו', href: '/personal-tax/salary-net-gross' }],
  },
  {
    id: 'taml',
    term: 'תמ"ל (תגמול מלחמה)',
    letter: 'ת',
    definition:
      'מענקים מיוחדים לחיילי מילואים ומשפחות שנפגעו במלחמה (חרבות ברזל). כולל: מענק שימור תעסוקה, מענק מחייה ראשוני, תוספת לפצועים. מתעדכן בצווים ממשלתיים.',
    seeAlso: [{ label: 'מחשבון מילואים', href: '/employee-rights/reserve-duty-pay' }],
  },
  {
    id: 'exemption-limit',
    term: 'תקרת פטור',
    letter: 'ת',
    definition:
      'הסכום המקסימלי שפטור ממס. לדוגמה: קרן השתלמות – תקרת הפקדה פטורה ממס לשכיר. פיצויים – 12,360 ₪ לשנת ותק. פנסיה – קצבה של עד ~8,700 ₪/חודש פטורה.',
    seeAlso: [{ label: 'מדריך מסים', href: '/guides/taxes-complete-guide-2026' }],
  },
  {
    id: 'weighted-average-period',
    term: 'תקופה ממוצעת משוקללת',
    letter: 'ת',
    definition:
      'מדד המבטא את "אורך החיים" הממוצע של ההלוואה, בהתחשב בלוח הסילוקין. בהלוואה ל-20 שנה עם שפיצר – התקופה הממוצעת משוקללת קצרה יותר (כ-12 שנים) בגלל תשלומי קרן מוקדמים.',
    seeAlso: [{ label: 'מחשבון משכנתא', href: '/real-estate/mortgage' }],
  },
];

const HEBREW_ALPHABET = ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ז', 'ח', 'ט', 'י', 'כ', 'ל', 'מ', 'נ', 'ס', 'ע', 'פ', 'צ', 'ק', 'ר', 'ש', 'ת'];

export default function GlossaryPage() {
  return (
    <div className="min-h-screen bg-white" dir="rtl">
      {/* Schema.org */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'DefinedTermSet',
            name: 'מילון מונחים פיננסיים',
            description: 'מילון מונחים פיננסיים מקיף: 80+ מושגים חשובים מעולם המס, ההשקעות, המשכנתאות והעצמאיים.',
            url: 'https://cheshbonai.co.il/glossary',
            inLanguage: 'he',
          }),
        }}
      />

      {/* Hero */}
      <div className="bg-gradient-to-bl from-gray-900 via-slate-700 to-slate-500 text-white py-14 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-sm text-gray-300 mb-3">
            <Link href="/" className="hover:text-white">דף הבית</Link>
            {' › '}
            <span>מילון מונחים</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            מילון מונחים פיננסיים
          </h1>
          <p className="text-lg text-gray-200 max-w-2xl mx-auto mb-4">
            80+ מונחים מעולם המס, המשכנתאות, ההשקעות וזכויות העובד – הגדרה ברורה בעברית פשוטה,
            עם לינק למחשבון הרלוונטי.
          </p>
          <div className="flex flex-wrap gap-4 justify-center text-sm text-gray-300">
            <span>📚 {ALL_TERMS.length} מונחים</span>
            <span>🔍 חיפוש ואינדקס אלפביתי</span>
            <span>📅 מעודכן מאי 2026</span>
          </div>
        </div>
      </div>

      {/* Quick links to pillar pages */}
      <div className="bg-slate-50 border-b border-gray-200 py-4 px-4">
        <div className="max-w-4xl mx-auto flex flex-wrap gap-3 justify-center text-sm">
          <span className="text-gray-500">מדריכים מלאים:</span>
          <Link href="/guides/mortgage-complete-guide-2026" className="text-blue-600 hover:text-blue-800 underline">
            מדריך משכנתא שלם
          </Link>
          <Link href="/guides/taxes-complete-guide-2026" className="text-emerald-600 hover:text-emerald-800 underline">
            מדריך מסים שלם
          </Link>
          <Link href="/guides/employee-rights-complete-guide" className="text-purple-600 hover:text-purple-800 underline">
            מדריך זכויות עובדים
          </Link>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-5xl mx-auto px-4 py-10">
        <GlossaryClient terms={ALL_TERMS} letters={HEBREW_ALPHABET} />
      </div>
    </div>
  );
}
