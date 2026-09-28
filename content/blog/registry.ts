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
  /** תאריך עדכון תוכן אמיתי (ISO). למלא רק אם הפוסט עודכן בפועל — מזין dateModified ב-schema. */
  updatedDate?: string;
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
    title: 'חברה בע"מ או עוסק מורשה — איך בוחנים את מבנה העסק?',
    description:
      'שיקולי מס, משיכות, עלויות ניהול ואחריות לפני בחירת המבנה העסקי; אין סף הכנסה אחיד שמתאים לכל עסק.',
    category: 'עצמאיים',
    readTime: '5 דקות',
    date: '2026-09-28',
    featured: true,
    relatedCalculator: {
      href: '/self-employed/corporation-vs-individual',
      label: 'השווה חברה vs עוסק',
    },
    related: ['vat-complete-guide-israel', 'net-self-employed-explained'],
  },
  {
    slug: 'vat-complete-guide-israel',
    title: 'מע"מ 2026 — 18%: חילוץ מע"מ, החזרים, חוק מע"מ ודיווח לעוסק',
    description:
      'שיעור המע"מ בישראל 2026: 18%. איך מחלצים מע"מ מסכום כולל (÷1.18), מתי מגיע החזר מע"מ (גם על דלק ורכב), חובות דיווח ופטורים לעוסק פטור. דוגמאות מספריות.',
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
    title: 'בדיקות להפחתת מס כחוק: נקודות זיכוי, תיאום והחזר',
    description:
      'שירותים רשמיים לבדיקת נקודות זיכוי, תיאום מס, החזר ותרומות מוכרות לפי הנתונים האישיים.',
    category: 'מיסוי אישי',
    readTime: '4 דקות',
    date: '2026-05-04',
    featured: true,
    relatedCalculator: {
      href: '/personal-tax/tax-refund',
      label: 'בדיקת החזר מס',
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
      'הסבר על המעבר ממחזור לתזרים פנוי ועל בדיקת מס, ביטוח לאומי, מע״מ והפקדות לפי הנתונים האישיים.',
    category: 'עצמאיים',
    readTime: '10 דקות',
    date: '2026-05-14',
    updatedDate: '2026-09-28',
    featured: true,
    relatedCalculator: {
      href: '/self-employed/net',
      label: 'איך בודקים נטו לעצמאי',
    },
    related: ['year-end-tax-planning-self-employed', 'pension-deduction-self-employed-2026'],
  },
  {
    slug: 'year-end-tax-planning-self-employed',
    title: 'בדיקות לסוף שנת המס לעצמאי 2026',
    description:
      'רשימת בדיקות למקדמות, הוצאות, הפקדות ותרומות לפני סוף שנת המס.',
    category: 'עצמאיים',
    readTime: '12 דקות',
    date: '2026-05-14',
    updatedDate: '2026-09-28',
    featured: true,
    relatedCalculator: {
      href: '/self-employed/year-end-tax-simulator',
      label: 'מדריך בדיקת מס לסוף שנה',
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
      label: 'בדיקת הטבות פנסיה',
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
      label: 'בדיקת הטבות קרן השתלמות',
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
    title: 'דמי הבראה 2026: כמה ימים ואיזה תעריף חל?',
    description:
      'הסבר בסיסי על ותק, היקף משרה ותעריף לפי הצו הכללי, עם קישור לצווי ההרחבה הרשמיים.',
    category: 'זכויות עובדים',
    readTime: '6 דקות',
    date: '2026-05-14',
    featured: false,
    relatedCalculator: {
      href: '/employee-rights/recreation-pay',
      label: 'אומדן דמי הבראה',
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
      'שווי נקודה ב-2026 וקישורים לבדיקת זכאות אישית בשירותי רשות המסים.',
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
    title: 'אינפלציה והשקעות — בדיקת כוח קנייה ותשואה ריאלית',
    description:
      'איך משווים ערך כסף ותשואה לאורך זמן בעזרת מדד המחירים לצרכן ומחשבון הלמ״ס.',
    category: 'השקעות',
    readTime: '3 דקות',
    date: '2026-09-28',
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
    title: 'הוראת בנק ישראל 329 — מגבלות מימון ותמהיל משכנתא',
    description:
      'סקירת מגבלות שיעור מימון ותמהיל לפי הוראת בנק ישראל 329; ההוראה העדכנית אינה קובעת מגבלת שליש נפרדת לפריים.',
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
    title: 'שיעור מימון במשכנתא: תקרות, חישוב והשוואת הצעות',
    description:
      'כך מחשבים שיעור מימון, בודקים את מגבלות בנק ישראל ומשווים הצעות ריבית בפועל.',
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
    title: 'דמי לידה 2026 - תקופת זכאות, חישוב וניכויים',
    description:
      'תנאי זכאות, חישוב השכר לפי הביטוח הלאומי, תקרה וניכויים, עם קישור למחשבון הרשמי.',
    category: 'זכויות עובדים',
    readTime: '4 דקות',
    date: '2026-05-16',
    featured: true,
    relatedCalculator: {
      href: '/employee-rights/maternity-benefits',
      label: 'בדיקת דמי לידה',
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
    title: 'תגמולי מילואים 2026 — חישוב וזכויות',
    description:
      'תגמול השירות מחושב בביטוח הלאומי לפי השכר ומשך השירות. מענקים נוספים כפופים למסלול ולתנאי זכאות; בדקו במקור הרשמי.',
    category: 'זכויות עובדים',
    readTime: '11 דקות',
    date: '2026-05-16',
    featured: false,
    relatedCalculator: {
      href: '/employee-rights/reserve-duty-pay',
      label: 'בדיקת תגמולי מילואים',
    },
    related: ['severance-pay-tax-strategies', 'employee-rights-israel-2026', 'tax-refund-complete-guide-2026'],
  },

  // ===== אשכול E - השקעות =====
  {
    slug: 'compound-interest-and-time-magic',
    title: 'ריבית דריבית — איך זמן והפקדות משנים תרחיש',
    description:
      'הנוסחה של ריבית דריבית, ההבדל בין סכום נומינלי לריאלי והדרך לקרוא תרחיש חיסכון.',
    category: 'השקעות',
    readTime: '3 דקות',
    date: '2026-09-28',
    featured: true,
    relatedCalculator: {
      href: '/investments/compound-interest',
      label: 'מחשבון ריבית דריבית',
    },
    related: ['inflation-and-investments', 'fire-strategy-israel', 'pension-self-employed-11-percent'],
  },
  {
    slug: 'fire-strategy-israel',
    title: 'FIRE בישראל — איך בוחנים פרישה מוקדמת',
    description:
      'מפת בדיקה לתכנון פרישה מוקדמת: הוצאות, חסכונות, קצבאות, מס וסיכון השקעה.',
    category: 'השקעות',
    readTime: '4 דקות',
    date: '2026-09-28',
    featured: true,
    relatedCalculator: {
      href: '/investments/fire',
      label: 'מדריך FIRE',
    },
    related: ['compound-interest-and-time-magic', 'study-fund-self-employed-strategy', 'pension-self-employed-11-percent'],
  },
  {
    slug: 'portfolio-allocation-by-age',
    title: 'הרכב תיק השקעות לפי גיל — מה עוד צריך לבדוק',
    description:
      'גיל הוא רק חלק מהתמונה: מטרות, אופק השקעה, נזילות, פיזור, עלויות ויכולת לשאת הפסדים.',
    category: 'השקעות',
    readTime: '3 דקות',
    date: '2026-09-28',
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
    title: 'מס רכישה 2026 — מדרגות וזכאות אישית',
    description:
      'מס רכישה 2026: מדרגות לדירה יחידה, דירה נוספת והקלה לעולה זכאי, עם הפניה לסימולטור רשות המסים.',
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
    title: 'מס שבח במכירת דירה: בדיקה נכונה לפני עסקה',
    description:
      'מתי יש לבדוק פטור, חישוב לינארי, הוצאות ומועד רכישה באמצעות השומה העצמית של רשות המסים.',
    category: 'נדל"ן ומשכנתאות',
    readTime: '4 דקות',
    date: '2026-05-16',
    featured: true,
    relatedCalculator: {
      href: '/real-estate/capital-gains-tax',
      label: 'בדיקת מס שבח',
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
    title: 'שווי שימוש ברכב מעסיק: בדיקה לפי דגם ושכר',
    description:
      'איך בודקים שווי שימוש לרכב צמוד ברשות המסים ומשווים את השפעתו על השכר לחלופות.',
    category: 'רכב',
    readTime: '12 דקות',
    date: '2026-05-16',
    featured: true,
    relatedCalculator: {
      href: '/vehicles/company-car-benefit',
      label: 'בדיקת שווי שימוש ברכב מעסיק',
    },
    related: ['leasing-vs-buying-vs-cash-decision', 'electric-vs-gasoline-car', 'salary-net-2026-complete-guide'],
  },
  {
    slug: 'electric-vs-gasoline-car',
    title: 'רכב חשמלי מול בנזין: כך משווים עלות בעלות',
    description:
      'איסוף הנתונים ונוסחאות להשוואת עלות הבעלות של שני דגמי רכב על סמך הצעות אישיות.',
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
    title: 'ביטוח לאומי לעצמאי 2026: שיעורים ובסיס החיוב',
    description:
      'השיעורים הרשמיים, בסיס החיוב והניכוי של דמי הביטוח הלאומי בלבד, עם קישור לבדיקה אישית.',
    category: 'עצמאיים',
    readTime: '14 דקות',
    date: '2026-05-16',
    updatedDate: '2026-09-28',
    featured: true,
    relatedCalculator: {
      href: '/self-employed/social-security',
      label: 'בדיקת ביטוח לאומי לעצמאי',
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
    slug: 'tax-coordination-guide-2026',
    title: 'תיאום מס 2026 — מי חייב, איך עושים אונליין, וכמה זה חוסך',
    description:
      'בלי תיאום מס המעסיק מנכה 47% מהמשכורת. מדריך מעשי: מי חייב לבצע תיאום מס, צעד אחר צעד בפורטל רשות המסים, ומתי הוא מתעדכן.',
    category: 'עצמאיים',
    readTime: '10 דקות',
    date: '2026-06-12',
    featured: false,
    relatedCalculator: {
      href: '/self-employed/employee-and-self-employed',
      label: 'מדריך שכיר ועצמאי',
    },
    related: ['net-self-employed-explained', 'tax-advances-self-employed-survival', 'annual-tax-report-1301'],
  },
  {
    slug: 'annual-tax-report-1301',
    title: 'דוח שנתי למס הכנסה ליחיד: מי מגיש ומה להכין',
    description:
      'הכנת מסמכי הכנסה והוצאות, בדיקת חובת דיווח ומקדמות ומעבר לשירות הרשמי לפי שנת המס.',
    category: 'עצמאיים',
    readTime: '11 דקות',
    date: '2026-06-12',
    updatedDate: '2026-09-28',
    featured: false,
    relatedCalculator: {
      href: '/self-employed/tax-advances',
      label: 'מדריך מקדמות מס לעצמאי',
    },
    related: ['tax-advances-self-employed-survival', 'year-end-tax-planning-self-employed', 'tax-coordination-guide-2026'],
  },
  {
    slug: 'tax-advances-self-employed-survival',
    title: 'מקדמות מס לעצמאי 2026: דיווח ועדכון',
    description:
      'כיצד לבדוק דרישת מקדמות, לדווח ולשלם לרשות המסים ולבקש הקטנה בטופס 2216א׳.',
    category: 'עצמאיים',
    readTime: '12 דקות',
    date: '2026-05-16',
    updatedDate: '2026-09-28',
    featured: false,
    relatedCalculator: {
      href: '/self-employed/tax-advances',
      label: 'מדריך מקדמות מס לעצמאי',
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
