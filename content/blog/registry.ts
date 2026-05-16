/**
 * רשימת כל הפוסטים בבלוג - נקודת אמת אחת.
 *
 * להוספת פוסט חדש:
 *   1. צור קובץ MDX ב: app/blog/(post)/[slug]/page.mdx
 *   2. הוסף ערך כאן עם ה-slug התואם
 *   3. עדכן sitemap.xml אם צריך
 */

export type BlogCategory =
  | 'מיסוי אישי'
  | 'עצמאיים'
  | 'זכויות עובדים'
  | 'נדל"ן ומשכנתאות'
  | 'תקציב וחיסכון'
  | 'השקעות'
  | 'רכב';

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  category: BlogCategory;
  readTime: string;
  date: string;
  featured: boolean;
  /** מחשבון רלוונטי - יוצג כ-CTA בסוף הפוסט */
  relatedCalculator?: {
    href: string;
    label: string;
  };
  /** סלוגים של פוסטים קשורים (לתצוגה בתחתית) */
  related?: string[];
}

export const blogPosts: BlogPost[] = [
  // ===== מאמרי עוגן קיימים =====
  {
    slug: 'tax-refund-complete-guide-2026',
    title: 'המדריך השלם להחזר מס לשכירים 2026',
    description:
      'כל מה שצריך לדעת כדי לקבל את החזר המס המקסימלי שמגיע לך - 12 סיבות לזכאות, איך מגישים, ומה החשוב לדעת. כולל דוגמאות מספריות.',
    category: 'מיסוי אישי',
    readTime: '15 דקות',
    date: '2026-05-04',
    featured: true,
    relatedCalculator: {
      href: '/personal-tax/tax-refund',
      label: 'חשב את ההחזר שמגיע לך',
    },
    related: ['tax-reduction-25-legal-ways', 'tax-changes-2026'],
  },
  {
    slug: 'company-vs-self-employed-ultimate-guide',
    title: 'חברה בע"מ או עוסק מורשה - המדריך הסופי 2026',
    description:
      'ההחלטה שכל פרילנסר ובעל עסק חייב להבין. ניתוח מקיף של המסים, ההטבות והעלויות בכל מסלול.',
    category: 'עצמאיים',
    readTime: '18 דקות',
    date: '2026-05-04',
    featured: true,
    relatedCalculator: {
      href: '/self-employed/corporation-vs-individual',
      label: 'השווה חברה vs עוסק',
    },
    related: ['vat-complete-guide-israel', 'net-self-employed-explained'],
  },
  {
    slug: 'vat-complete-guide-israel',
    title: 'מע"מ בישראל - המדריך השלם לעוסק 2026',
    description:
      'כל מה שעוסק חייב לדעת על מע"מ - 18%, חשבוניות, דיווח, החזרים, ופטורים. כולל דוגמאות מעשיות.',
    category: 'עצמאיים',
    readTime: '12 דקות',
    date: '2026-05-04',
    featured: true,
    relatedCalculator: {
      href: '/self-employed/vat',
      label: 'מחשבון מע"מ',
    },
    related: ['company-vs-self-employed-ultimate-guide', 'year-end-tax-planning-self-employed'],
  },
  {
    slug: 'employee-rights-israel-2026',
    title: 'זכויות עובדים בישראל 2026 - המדריך המלא',
    description:
      'פיצויים, דמי הבראה, חופשה, מחלה, לידה, מילואים. כל הזכויות לפי החוק עם דוגמאות חישוב.',
    category: 'זכויות עובדים',
    readTime: '20 דקות',
    date: '2026-05-04',
    featured: true,
    relatedCalculator: {
      href: '/salaried',
      label: 'כל המחשבונים לשכירים',
    },
    related: ['severance-pay-complete-guide', 'recreation-pay-2026'],
  },
  {
    slug: 'tax-reduction-25-legal-ways',
    title: 'איך להפחית מס באופן חוקי - 25 דרכים מוכחות 2026',
    description:
      'אסטרטגיות להפחתת מס לשכירים, עצמאיים ובעלי עסקים - הפקדות מוטבות, הוצאות מוכרות, פטורים, ועוד. עם דוגמאות מספריות.',
    category: 'מיסוי אישי',
    readTime: '25 דקות',
    date: '2026-05-04',
    featured: true,
    relatedCalculator: {
      href: '/personal-tax/tax-refund',
      label: 'חשב את ההחזר',
    },
    related: ['pension-deduction-self-employed-2026', 'study-fund-self-employed-strategy'],
  },
  {
    slug: 'tax-changes-2026',
    title: 'מה השתנה במדרגות מס הכנסה ב-2026? המדריך המלא',
    description:
      'סקירה מקיפה של השינויים במדרגות המס לשנת 2026 והשפעתם על השכר נטו.',
    category: 'מיסוי אישי',
    readTime: '8 דקות',
    date: '2026-05-01',
    featured: false,
    relatedCalculator: {
      href: '/personal-tax/income-tax',
      label: 'מחשבון מס הכנסה 2026',
    },
    related: ['tax-refund-complete-guide-2026', 'tax-reduction-25-legal-ways'],
  },

  // ===== מאמרים חדשים =====
  {
    slug: 'net-self-employed-explained',
    title: 'כמה כסף נשאר ביד? המדריך לחישוב נטו לעצמאי 2026',
    description:
      'מהמחזור לכסף בכיס: הסבר ברור על מס, ב.ל., מע"מ, פנסיה וקרן השתלמות - עם דוגמאות מספריות וטיפים לאופטימיזציה.',
    category: 'עצמאיים',
    readTime: '10 דקות',
    date: '2026-05-14',
    featured: true,
    relatedCalculator: {
      href: '/self-employed/net',
      label: 'מחשבון נטו לעצמאי',
    },
    related: ['year-end-tax-planning-self-employed', 'pension-deduction-self-employed-2026'],
  },
  {
    slug: 'year-end-tax-planning-self-employed',
    title: 'תכנון מס לסוף שנה לעצמאי - 10 פעולות שיחסכו אלפי שקלים',
    description:
      'דצמבר מתקרב? עוד יש זמן לחסוך עשרות אלפי שקלים במס. 10 הפעולות הקריטיות לעצמאי לפני סגירת שנת המס.',
    category: 'עצמאיים',
    readTime: '12 דקות',
    date: '2026-05-14',
    featured: true,
    relatedCalculator: {
      href: '/self-employed/year-end-tax-simulator',
      label: 'סימולטור הערכת מס לסוף שנה',
    },
    related: ['pension-deduction-self-employed-2026', 'study-fund-self-employed-strategy'],
  },
  {
    slug: 'pension-deduction-self-employed-2026',
    title: 'ניכוי פנסיה לעצמאי 2026: 11%, 5.5% וזיכוי 35% — איך זה עובד?',
    description:
      'המדריך המעשי להבנת הטבות המס בהפקדה לפנסיה לעצמאי. מתי כדאי להפקיד את המקסימום, איך משלבים עם קרן השתלמות, ודוגמאות מספריות.',
    category: 'עצמאיים',
    readTime: '9 דקות',
    date: '2026-05-14',
    featured: false,
    relatedCalculator: {
      href: '/self-employed/year-end-tax-simulator',
      label: 'בדוק את ההטבה שמגיעה לך',
    },
    related: ['study-fund-self-employed-strategy', 'tax-reduction-25-legal-ways'],
  },
  {
    slug: 'study-fund-self-employed-strategy',
    title: 'קרן השתלמות לעצמאי: הטבת המס הגדולה ביותר שלא ניצלת',
    description:
      'ניכוי 4.5% + פטור ממס רווחי הון = ההטבה המשתלמת ביותר לעצמאי. איך זה עובד, כמה להפקיד, ומתי משתלם?',
    category: 'עצמאיים',
    readTime: '8 דקות',
    date: '2026-05-14',
    featured: false,
    relatedCalculator: {
      href: '/self-employed/year-end-tax-simulator',
      label: 'חשב את ההטבה',
    },
    related: ['pension-deduction-self-employed-2026', 'year-end-tax-planning-self-employed'],
  },
  {
    slug: 'severance-pay-complete-guide',
    title: 'פיצויי פיטורין 2026: חישוב מלא, מס וזכויות',
    description:
      'כמה פיצויים מגיע לך? איך מחושבים, מתי פטורים ממס, ומה ההבדל בין סעיף 14 לפיצויים רגילים. מדריך מלא עם דוגמאות.',
    category: 'זכויות עובדים',
    readTime: '11 דקות',
    date: '2026-05-14',
    featured: false,
    relatedCalculator: {
      href: '/employee-rights/severance',
      label: 'מחשבון פיצויי פיטורין',
    },
    related: ['employee-rights-israel-2026', 'recreation-pay-2026'],
  },
  {
    slug: 'recreation-pay-2026',
    title: 'דמי הבראה 2026: כמה מגיע לך וכמתי?',
    description:
      '418 ₪ ליום לוותיק. אבל כמה ימים מגיעים לך? איך מבקשים? מה ההבדל בין המגזר הציבורי לפרטי? כל המידע.',
    category: 'זכויות עובדים',
    readTime: '6 דקות',
    date: '2026-05-14',
    featured: false,
    relatedCalculator: {
      href: '/employee-rights/recreation-pay',
      label: 'מחשבון דמי הבראה',
    },
    related: ['severance-pay-complete-guide', 'employee-rights-israel-2026'],
  },

  // ===== אשכול TAX 2026 =====
  {
    slug: 'income-tax-brackets-2026-complete-guide',
    title: 'מדרגות מס הכנסה 2026 - המדריך המלא והשינויים מהשנים הקודמות',
    description:
      'כל מדרגות המס לשנת 2026: 7 מדרגות מ-10% עד 50%, השינויים לעומת 2024-2025, חישובים לפי שכר ונקודות זיכוי. עדכני ומאומת.',
    category: 'מיסוי אישי',
    readTime: '15 דקות',
    date: '2026-05-16',
    featured: true,
    relatedCalculator: {
      href: '/personal-tax/salary-net-gross',
      label: 'חשב את המס שלך',
    },
    related: ['salary-net-2026-complete-guide', 'tax-changes-2026', 'tax-credit-points-2026'],
  },
  {
    slug: 'surtax-yesef-2026-explained',
    title: 'מס יסף 3% (2026) - מי משלם, כמה זה עולה, ואיך להפחית?',
    description:
      'מס יסף 3% הוא חבות מס נוספת על הכנסה שנתית מעל 721,560 ₪. מי חייב, חישוב מדויק, פטורים ואסטרטגיות הפחתה חוקיות.',
    category: 'מיסוי אישי',
    readTime: '10 דקות',
    date: '2026-05-16',
    featured: false,
    relatedCalculator: {
      href: '/personal-tax/salary-net-gross',
      label: 'חשב את המס שלך',
    },
    related: ['income-tax-brackets-2026-complete-guide', 'tax-reduction-25-legal-ways', 'tax-changes-2026'],
  },
  {
    slug: 'tax-credit-points-2026',
    title: 'נקודות זיכוי 2026 - איך לחשב נכון ולא לאבד אלפי שקלים',
    description:
      'כל נקודות הזיכוי לשנת 2026: 2,904 ₪/שנה לנקודה, חישוב לפי מצב משפחתי, ילדים, עולה חדש, חייל משוחרר. כולל טעויות נפוצות שעולות כסף.',
    category: 'מיסוי אישי',
    readTime: '12 דקות',
    date: '2026-05-16',
    featured: false,
    relatedCalculator: {
      href: '/personal-tax/salary-net-gross',
      label: 'חשב את המס שלך',
    },
    related: ['income-tax-brackets-2026-complete-guide', 'surtax-yesef-2026-explained', 'tax-refund-complete-guide-2026'],
  },

  // ===== מאמרים חדשים מאי 2026 =====
  {
    slug: 'inflation-and-investments',
    title: 'אינפלציה והשקעות 2026 - איך לא לאבד 30% מהכסף שלך',
    description:
      'אינפלציה שוחקת את ערך הכסף בשקט. מדריך מעמיק על הגנת החסכונות, ריבית דריבית ריאלית, ואסטרטגיות השקעה שמנצחות את האינפלציה.',
    category: 'השקעות',
    readTime: '10 דקות',
    date: '2026-05-15',
    featured: false,
    relatedCalculator: {
      href: '/investments/compound-interest',
      label: 'מחשבון ריבית דריבית',
    },
    related: ['study-fund-self-employed-strategy', 'pension-deduction-self-employed-2026'],
  },
  {
    slug: 'mortgage-tracks-guide-2026',
    title: 'מסלולי משכנתא 2026 - פריים, קל"צ, צמוד מדד: מה לבחור?',
    description:
      'מדריך מקיף לכל 5 מסלולי המשכנתא בישראל. מתי כדאי פריים? מתי קל"צ? דוגמאות מספריות, השוואות וטיפים לחיסכון עשרות אלפי שקלים.',
    category: 'נדל"ן ומשכנתאות',
    readTime: '15 דקות',
    date: '2026-05-15',
    featured: false,
    relatedCalculator: {
      href: '/real-estate/mortgage',
      label: 'מחשבון משכנתא',
    },
    related: ['tax-changes-2026'],
  },
  {
    slug: 'salary-net-2026-complete-guide',
    title: 'המדריך המלא לשכר נטו 2026 - מדרגות מס חדשות, נטו → ברוטו',
    description:
      'מדרגות מס הכנסה 2026 המעודכנות, חישוב שכר נטו מברוטו ובכיוון הפוך, השפעת הפנסיה ודמי הבריאות. מדריך מלא עם דוגמאות מספריות.',
    category: 'מיסוי אישי',
    readTime: '12 דקות',
    date: '2026-05-15',
    featured: false,
    relatedCalculator: {
      href: '/personal-tax/salary-net-gross',
      label: 'מחשבון שכר נטו-ברוטו',
    },
    related: ['tax-refund-complete-guide-2026', 'tax-changes-2026'],
  },
  {
    slug: 'vacation-redemption-guide',
    title: 'פדיון חופשה - איך לחשב כמה כסף מגיע לך',
    description:
      'מדריך מלא לפדיון ימי חופשה בישראל. מתי מגיע פדיון, איך מחשבים את הסכום, מה ההבדל בין פיטורים להתפטרות, ואיך לא לפספס אלפי שקלים.',
    category: 'זכויות עובדים',
    readTime: '8 דקות',
    date: '2026-05-15',
    featured: false,
    relatedCalculator: {
      href: '/employee-rights/annual-leave',
      label: 'מחשבון חופשה שנתית',
    },
    related: ['severance-pay-complete-guide', 'recreation-pay-2026'],
  },
  {
    slug: 'vehicle-tco-guide',
    title: 'כמה רכב באמת עולה לכם? המדריך השלם לעלות בעלות אמיתית',
    description:
      'TCO (Total Cost of Ownership) - הדרך הנכונה לחשוב על עלות רכב. השוואה בין מזומן, הלוואה וליסינג, עם כל העלויות הנסתרות ועלות הזדמנות.',
    category: 'רכב',
    readTime: '12 דקות',
    date: '2026-05-15',
    featured: false,
    relatedCalculator: {
      href: '/vehicles/leasing-vs-buying',
      label: 'מחשבון ליסינג vs קנייה',
    },
    related: ['mortgage-tracks-guide-2026'],
  },

  // ===== אשכול C - משכנתא =====
  {
    slug: 'boi-directive-329-mortgage-rules',
    title: 'הוראת בנק ישראל 329 - 3 הכללים החבויים שכל לוקח משכנתא חייב להכיר',
    description:
      'הוראה 329 (מאי 2013) קובעת מה הבנק חייב לאשר ומה אסור: 1/3 קבוע, 2/3 משתנה, 1/3 פריים. במאמר: כל הכללים עם דוגמאות מספריות + טעויות נפוצות.',
    category: 'נדל"ן ומשכנתאות',
    readTime: '11 דקות',
    date: '2026-05-16',
    featured: true,
    relatedCalculator: {
      href: '/real-estate/mortgage-optimizer',
      label: 'אופטימייזר תמהיל משכנתא',
    },
    related: ['ltv-mortgage-rates-secret', 'mortgage-tracks-guide-2026', 'mortgage-refinance-when-and-how'],
  },
  {
    slug: 'ltv-mortgage-rates-secret',
    title: 'LTV - הסוד שיכול לחסוך לך 100,000 ₪ במשכנתא',
    description:
      'LTV (Loan-to-Value) הוא היחס בין המשכנתא לשווי הנכס. ככל שיש לך יותר הון עצמי - הבנק מציע ריבית טובה יותר. במאמר: הטבלה המדויקת + חישוב חיסכון.',
    category: 'נדל"ן ומשכנתאות',
    readTime: '10 דקות',
    date: '2026-05-16',
    featured: true,
    relatedCalculator: {
      href: '/real-estate/mortgage-optimizer',
      label: 'אופטימייזר תמהיל משכנתא',
    },
    related: ['boi-directive-329-mortgage-rules', 'mortgage-refinance-when-and-how', 'mortgage-tracks-guide-2026'],
  },
  {
    slug: 'mortgage-refinance-when-and-how',
    title: 'מחזור משכנתא 2026 - מתי, איך, וכמה אתה יכול לחסוך',
    description:
      'מחזור משכנתא יכול לחסוך עשרות אלפי שקלים, אבל עלויות 5-15K. במאמר: מתי שווה, חישוב breakeven מדויק, טעויות נפוצות, ואיך לבחור בנק חדש.',
    category: 'נדל"ן ומשכנתאות',
    readTime: '12 דקות',
    date: '2026-05-16',
    featured: false,
    relatedCalculator: {
      href: '/real-estate/mortgage-optimizer',
      label: 'אופטימייזר תמהיל משכנתא',
    },
    related: ['boi-directive-329-mortgage-rules', 'ltv-mortgage-rates-secret', 'mortgage-tracks-guide-2026'],
  },

  // ===== אשכול D - זכויות עובד =====
  {
    slug: 'maternity-benefits-complete-guide-2026',
    title: 'דמי לידה 2026 - חישוב מלא, זכויות הארכה, וחופשת אב',
    description:
      'המדריך המלא לדמי לידה 2026: 15 שבועות + הארכות לתאומים/פגות, חישוב לפי שכר, חופשת אב 7 ימים, ושעת הנקה. עם דוגמאות מספריות.',
    category: 'זכויות עובדים',
    readTime: '13 דקות',
    date: '2026-05-16',
    featured: true,
    relatedCalculator: {
      href: '/employee-rights/maternity-benefits',
      label: 'מחשבון דמי לידה',
    },
    related: ['severance-pay-tax-strategies', 'recreation-pay-2026', 'employee-rights-israel-2026'],
  },
  {
    slug: 'severance-pay-tax-strategies',
    title: 'פיצויי פיטורין 2026 - 4 אסטרטגיות מס שיכולות לחסוך 100,000 ₪',
    description:
      'פיצויי פיטורין יכולים להגיע למאות אלפי שקלים, אבל מס יכול לקחת חצי. 4 אסטרטגיות מס חוקיות: פטור מיידי, רצף קצבה, פריסה, שילוב. עם דוגמאות.',
    category: 'זכויות עובדים',
    readTime: '14 דקות',
    date: '2026-05-16',
    featured: true,
    relatedCalculator: {
      href: '/employee-rights/severance',
      label: 'מחשבון פיצויי פיטורין',
    },
    related: ['maternity-benefits-complete-guide-2026', 'recreation-pay-2026', 'vacation-redemption-guide', 'employee-rights-israel-2026'],
  },
  {
    slug: 'reserve-duty-pay-iron-swords-2026',
    title: 'תגמולי מילואים חרבות ברזל 2026 - 4 המענקים שמגיעים לך',
    description:
      'מילואים בתקופת חרבות ברזל: מענק כללי 5,000 ₪, מענק יומי 280 ₪, מענק חזרה לעבודה 5,000 ₪. במאמר: כל הזכויות, חישוב מדויק, ופטור ממס.',
    category: 'זכויות עובדים',
    readTime: '11 דקות',
    date: '2026-05-16',
    featured: false,
    relatedCalculator: {
      href: '/employee-rights/reserve-duty-pay',
      label: 'מחשבון תגמולי מילואים',
    },
    related: ['severance-pay-tax-strategies', 'employee-rights-israel-2026', 'tax-refund-complete-guide-2026'],
  },

  // ===== אשכול E - השקעות =====
  {
    slug: 'compound-interest-and-time-magic',
    title: 'ריבית דריבית: למה זמן חשוב יותר מסכום ההפקדה',
    description:
      'ריבית דריבית היא הכוח הפיננסי החזק ביותר. במאמר: דוגמאות מספריות שיהממו אותך, מה זה Rule of 72, ולמה להתחיל בגיל 25 שווה פי 2 מגיל 35.',
    category: 'השקעות',
    readTime: '12 דקות',
    date: '2026-05-16',
    featured: true,
    relatedCalculator: {
      href: '/investments/compound-interest',
      label: 'מחשבון ריבית דריבית',
    },
    related: ['inflation-and-investments', 'fire-strategy-israel', 'pension-self-employed-11-percent'],
  },
  {
    slug: 'fire-strategy-israel',
    title: 'FIRE בישראל 2026 - איך לפרוש מוקדם ב-5 דרכים שונות',
    description:
      'תנועת FIRE (Financial Independence Retire Early) בישראל: 5 סוגי FIRE עם דוגמאות מספריות לישראלי ממוצע. כולל בידול חברתי ופיתרונות לביטוח לאומי.',
    category: 'השקעות',
    readTime: '15 דקות',
    date: '2026-05-16',
    featured: true,
    relatedCalculator: {
      href: '/investments/fire',
      label: 'מחשבון FIRE',
    },
    related: ['compound-interest-and-time-magic', 'study-fund-self-employed-strategy', 'pension-self-employed-11-percent'],
  },
  {
    slug: 'portfolio-allocation-by-age',
    title: 'תיק השקעות לפי גיל - כלל "120 פחות גיל" והאמת מאחוריו',
    description:
      'איך לבנות תיק השקעות לפי הגיל שלך: 120 פחות גיל ל-מניות, ההמרה הריאלית בישראל, ו-5 תיקי השקעות לדוגמא ב-2026 לכל קבוצת גיל.',
    category: 'השקעות',
    readTime: '13 דקות',
    date: '2026-05-16',
    featured: false,
    relatedCalculator: {
      href: '/investments/compound-interest',
      label: 'מחשבון ריבית דריבית',
    },
    related: ['compound-interest-and-time-magic', 'fire-strategy-israel', 'inflation-and-investments'],
  },

  // ===== אשכול F - נדל"ן מתקדם =====
  {
    slug: 'purchase-tax-2026-complete-guide',
    title: 'מס רכישה 2026 - מדריך מלא ל-8 סוגי רוכשים',
    description:
      'מס רכישה 2026: מדרגות לדירה ראשונה (0% עד 1.98M ₪), משקיע (8% מהראשון), עולה חדש (0.5%), נכה - 8 סוגי רוכשים עם דוגמאות וטיפים.',
    category: 'נדל"ן ומשכנתאות',
    readTime: '13 דקות',
    date: '2026-05-16',
    featured: true,
    relatedCalculator: {
      href: '/real-estate/purchase-tax',
      label: 'מחשבון מס רכישה',
    },
    related: ['capital-gains-tax-property-2026', 'real-estate-investment-strategy', 'boi-directive-329-mortgage-rules', 'ltv-mortgage-rates-secret'],
  },
  {
    slug: 'capital-gains-tax-property-2026',
    title: 'מס שבח 2026 - איך לחסוך עשרות אלפי שקלים בעת מכירת דירה',
    description:
      'מס שבח על מכירת דירה: מס לינארי לדירות לפני 2014 (חיסכון של עד 50%!), פטור דירה יחידה עד 5M, חישוב מדויק עם דוגמאות. עדכני 2026.',
    category: 'נדל"ן ומשכנתאות',
    readTime: '14 דקות',
    date: '2026-05-16',
    featured: true,
    relatedCalculator: {
      href: '/real-estate/capital-gains-tax',
      label: 'מחשבון מס שבח',
    },
    related: ['purchase-tax-2026-complete-guide', 'real-estate-investment-strategy', 'inflation-and-investments'],
  },
  {
    slug: 'real-estate-investment-strategy',
    title: 'השקעה בנדל"ן בישראל 2026 - 5 אסטרטגיות + חישוב תשואה',
    description:
      'השקעה בנדל"ן בישראל: דירה להשכרה, פליפינג, REIT, נדל"ן מסחרי, בנייה. השוואה לשוק ההון, חישוב תשואה נטו אחרי מס וריבית.',
    category: 'נדל"ן ומשכנתאות',
    readTime: '15 דקות',
    date: '2026-05-16',
    featured: false,
    relatedCalculator: {
      href: '/real-estate/mortgage-optimizer',
      label: 'אופטימייזר תמהיל משכנתא',
    },
    related: ['purchase-tax-2026-complete-guide', 'capital-gains-tax-property-2026', 'compound-interest-and-time-magic'],
  },

  // ===== אשכול G - כלים לעסקים =====
  {
    slug: 'business-budget-planning-2026',
    title: 'תקציב לעסק קטן 2026 - איך לבנות תקציב שמחזיק לכל השנה',
    description:
      'תכנון תקציב לעסק קטן: P&L, חזוי הוצאות, מודל גידול, וטיפים למניעת תרחישי חוסר בכסף. כולל תבנית מעשית וחישובי תזרים מזומנים.',
    category: 'תקציב וחיסכון',
    readTime: '12 דקות',
    date: '2026-05-16',
    featured: true,
    relatedCalculator: {
      href: '/tools/budget',
      label: 'מחשבון תקציב ו-P&L',
    },
    related: ['cash-flow-forecast-business', 'business-valuation-methods', 'tax-advances-self-employed-survival'],
  },
  {
    slug: 'cash-flow-forecast-business',
    title: 'תזרים מזומנים לעסק - איך להימנע מקריסה תזרימית',
    description:
      'תזרים מזומנים הוא הגורם #1 לכישלון עסקי. במאמר: איך לבנות תחזית תזרים, לזהות איתותי אזהרה, וטכניקות תכנון. עם תבנית 12 חודשים.',
    category: 'תקציב וחיסכון',
    readTime: '13 דקות',
    date: '2026-05-16',
    featured: true,
    relatedCalculator: {
      href: '/tools/cash-flow',
      label: 'מחשבון תזרים מזומנים',
    },
    related: ['business-budget-planning-2026', 'business-valuation-methods'],
  },
  {
    slug: 'business-valuation-methods',
    title: 'הערכת שווי עסק - 4 שיטות שכל בעל עסק חייב להכיר',
    description:
      'איך להעריך שווי של עסק לפני מכירה / שותפות / מיזוג: שיטת DCF, מכפילי שוק, NAV ושיטת ההכנסה. כולל דוגמאות לעסקים קטנים בישראל.',
    category: 'תקציב וחיסכון',
    readTime: '14 דקות',
    date: '2026-05-16',
    featured: false,
    relatedCalculator: {
      href: '/tools/business-valuation',
      label: 'מחשבון הערכת שווי עסק',
    },
    related: ['business-budget-planning-2026', 'cash-flow-forecast-business', 'company-vs-self-employed-ultimate-guide'],
  },

  // ===== אשכול H - רכב =====
  {
    slug: 'leasing-vs-buying-vs-cash-decision',
    title: 'ליסינג vs קנייה vs מימון עצמי - מה משתלם באמת ב-2026?',
    description:
      'השוואה מקיפה בין 3 דרכים לרכוש רכב: ליסינג, הלוואה, מימון עצמי. חישוב TCO מלא כולל עלות הזדמנות, ירידת ערך, ועלויות תפעול. עדכני 2026.',
    category: 'רכב',
    readTime: '14 דקות',
    date: '2026-05-16',
    featured: true,
    relatedCalculator: {
      href: '/vehicles/leasing-vs-buying',
      label: 'מחשבון ליסינג vs קנייה',
    },
    related: ['company-car-tax-2026', 'electric-vs-gasoline-car', 'vehicle-tco-guide'],
  },
  {
    slug: 'company-car-tax-2026',
    title: 'שווי שימוש ברכב מעסיק 2026 - 8 קבוצות + הטבת חשמלי 50%',
    description:
      'שווי שימוש ברכב מעסיק 2026: 8 קבוצות (2.04%-5.14%), הטבת רכב חשמלי 50%, היברידי 70%, חישוב מס מלא. כולל השוואה לרכב פרטי.',
    category: 'רכב',
    readTime: '12 דקות',
    date: '2026-05-16',
    featured: true,
    relatedCalculator: {
      href: '/vehicles/company-car-benefit',
      label: 'מחשבון שווי שימוש ברכב מעסיק',
    },
    related: ['leasing-vs-buying-vs-cash-decision', 'electric-vs-gasoline-car', 'salary-net-2026-complete-guide'],
  },
  {
    slug: 'electric-vs-gasoline-car',
    title: 'רכב חשמלי vs בנזין 2026 - השוואה מקיפה של עלות בעלות',
    description:
      'האם רכב חשמלי באמת זול יותר? השוואה מקיפה: מחיר רכישה, דלק/חשמל, תחזוקה, ירידת ערך, סוללה ושווי שימוש. כולל break-even analysis.',
    category: 'רכב',
    readTime: '13 דקות',
    date: '2026-05-16',
    featured: false,
    relatedCalculator: {
      href: '/vehicles/leasing-vs-buying',
      label: 'מחשבון ליסינג vs קנייה',
    },
    related: ['leasing-vs-buying-vs-cash-decision', 'company-car-tax-2026', 'vehicle-tco-guide'],
  },

  // ===== אשכול B - עצמאיים =====
  {
    slug: 'bituach-leumi-self-employed-deep-dive',
    title: 'ביטוח לאומי לעצמאי 2026 - חישוב מקיף, השוואה לשכיר, והטבת מס 52%',
    description:
      'כל מה שעצמאי חייב לדעת על ב.ל.: 2 מדרגות (6.10%/18.00%), הטבת מס 52%, השוואה לשכיר, תשלומים רבעוניים, וזכויות. עדכני 2026.',
    category: 'עצמאיים',
    readTime: '14 דקות',
    date: '2026-05-16',
    featured: true,
    relatedCalculator: {
      href: '/self-employed/social-security',
      label: 'מחשבון ביטוח לאומי לעצמאי',
    },
    related: ['pension-deduction-self-employed-2026', 'study-fund-self-employed-strategy', 'net-self-employed-explained'],
  },
  {
    slug: 'pension-self-employed-11-percent',
    title: 'פנסיה לעצמאי 2026 - 11% או 16.5%? המדריך המלא להטבת המס',
    description:
      'המדריך המעשי להפקדה לפנסיה לעצמאי: ניכוי 11%, זיכוי 5.5%, חובת הפקדה מינימלית, ושילוב עם קרן השתלמות. עדכני 2026 עם דוגמאות.',
    category: 'עצמאיים',
    readTime: '13 דקות',
    date: '2026-05-16',
    featured: false,
    relatedCalculator: {
      href: '/self-employed/year-end-tax-simulator',
      label: 'סימולטור הערכת מס לסוף שנה',
    },
    related: ['bituach-leumi-self-employed-deep-dive', 'study-fund-self-employed-strategy', 'pension-deduction-self-employed-2026'],
  },
  {
    slug: 'tax-advances-self-employed-survival',
    title: 'מקדמות מס לעצמאי 2026 - איך לא לחיות בחרדה מסוף השנה',
    description:
      'המדריך המעשי למקדמות מס: חישוב נכון, תיאום אמצע שנה (טופס 1300), תזרים מזומנים, וריבית פיגורים. עדכני 2026 עם 4 תרחישים.',
    category: 'עצמאיים',
    readTime: '12 דקות',
    date: '2026-05-16',
    featured: false,
    relatedCalculator: {
      href: '/self-employed/tax-advances',
      label: 'מחשבון מקדמות מס לעצמאי',
    },
    related: ['bituach-leumi-self-employed-deep-dive', 'pension-self-employed-11-percent', 'year-end-tax-planning-self-employed'],
  },
];

// ===== עזרים =====
export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}

export function getRelatedPosts(slug: string, limit = 3): BlogPost[] {
  const post = getPostBySlug(slug);
  if (!post) return [];
  const relatedSlugs = post.related || [];
  const related = relatedSlugs.map(getPostBySlug).filter(Boolean) as BlogPost[];
  if (related.length >= limit) return related.slice(0, limit);
  // השלמה לפי קטגוריה
  const byCategory = blogPosts.filter(
    (p) => p.category === post.category && p.slug !== slug && !relatedSlugs.includes(p.slug),
  );
  return [...related, ...byCategory].slice(0, limit);
}

export function getPostsByCategory(category: BlogCategory): BlogPost[] {
  return blogPosts.filter((p) => p.category === category);
}

export function getAllCategories(): { name: BlogCategory; count: number }[] {
  const map = new Map<BlogCategory, number>();
  for (const p of blogPosts) {
    map.set(p.category, (map.get(p.category) || 0) + 1);
  }
  return Array.from(map.entries()).map(([name, count]) => ({ name, count }));
}
