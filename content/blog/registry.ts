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
    title: 'החזר מס לשכירים: איך בודקים ומגישים בקשה',
    description:
      'בדיקת זכאות להחזר מס לשכירים מול רשות המסים, הכנת מסמכים והגשת טופס 135.',
    category: 'מיסוי אישי',
    readTime: '15 דקות',
    date: '2026-05-04',
    updatedDate: '2026-09-29',
    featured: true,
    relatedCalculator: {
      href: '/personal-tax/tax-refund',
      label: 'בדיקת זכאות להחזר מס',
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
    title: 'מע״מ בישראל 2026: שיעור, עוסק פטור וניכוי תשומות',
    description:
      'שיעור מע״מ 2026, תקרת עוסק פטור, חישוב הוספה וחילוץ, דיווח תקופתי וכללי ניכוי מס תשומות.',
    category: 'עצמאיים',
    readTime: '12 דקות',
    date: '2026-05-04',
    updatedDate: '2026-09-29',
    featured: true,
    relatedCalculator: {
      href: '/self-employed/vat',
      label: 'מחשבון מע"מ',
    },
    related: ['company-vs-self-employed-ultimate-guide', 'year-end-tax-planning-self-employed'],
  },
  {
    slug: 'employee-rights-israel-2026',
    title: 'זכויות עובדים בישראל 2026: בדיקה לפי תלוש ותנאי העסקה',
    description:
      'בדיקת שכר מינימום, חופשה, מחלה, הבראה, פנסיה ופיצויים מול מקורות רשמיים.',
    category: 'זכויות עובדים',
    readTime: '20 דקות',
    date: '2026-05-04',
    updatedDate: '2026-09-29',
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
    title: 'שינוי מדרגות מס הכנסה ב־2026: מה רווח ומה צריך לבדוק',
    description:
      'ריווח מדרגות המס בשיעורי 20% ו־31%, עם קישורים ללוח הרשמי ולבדיקה אישית.',
    category: 'מיסוי אישי',
    readTime: '8 דקות',
    date: '2026-05-01',
    updatedDate: '2026-09-29',
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
    title: 'הפקדות לפנסיה לעצמאי: חובת הפקדה והטבות מס',
    description:
      'איך להבחין בין חובת ההפקדה לפנסיה לבין ניכוי וזיכוי ממס, ומה לבדוק לפי הנתונים האישיים.',
    category: 'עצמאיים',
    readTime: '9 דקות',
    date: '2026-05-14',
    updatedDate: '2026-09-29',
    featured: false,
    relatedCalculator: {
      href: '/self-employed/year-end-tax-simulator',
      label: 'בדיקת הטבות פנסיה',
    },
    related: ['study-fund-self-employed-strategy', 'tax-reduction-25-legal-ways'],
  },
  {
    slug: 'study-fund-self-employed-strategy',
    title: 'קרן השתלמות לעצמאי 2026: ניכוי, פטור ונזילות',
    description:
      'ההבדל בין ניכוי הפקדה לבין פטור אפשרי על רווחים, ואילו תקרות ותנאי משיכה צריך לבדוק.',
    category: 'עצמאיים',
    readTime: '8 דקות',
    date: '2026-05-14',
    updatedDate: '2026-09-29',
    featured: false,
    relatedCalculator: {
      href: '/self-employed/year-end-tax-simulator',
      label: 'בדיקת הטבות קרן השתלמות',
    },
    related: ['pension-deduction-self-employed-2026', 'year-end-tax-planning-self-employed'],
  },
  {
    slug: 'severance-pay-complete-guide',
    title: 'פיצויי פיטורים: זכאות, חישוב וטופס 161',
    description:
      'בדיקת זכאות לפיצויים, הפקדות לרכיב הפיצויים, סעיף 14 ומיסוי הפרישה.',
    category: 'זכויות עובדים',
    readTime: '11 דקות',
    date: '2026-05-14',
    updatedDate: '2026-09-29',
    featured: false,
    relatedCalculator: {
      href: '/employee-rights/severance',
      label: 'מדריך בדיקת פיצויים',
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
    title: 'מדרגות מס הכנסה 2026: איך קוראים את הלוח הרשמי',
    description:
      'ריווח שתי מדרגות המס ב־2026, הסבר על חישוב מדורג ובדיקת זיכויים ומס יסף לפי נתונים אישיים.',
    category: 'מיסוי אישי',
    readTime: '15 דקות',
    date: '2026-05-16',
    updatedDate: '2026-09-29',
    featured: true,
    relatedCalculator: {
      href: '/personal-tax/salary-net-gross',
      label: 'חשב את המס שלך',
    },
    related: ['salary-net-2026-complete-guide', 'tax-changes-2026', 'tax-credit-points-2026'],
  },
  {
    slug: 'surtax-yesef-2026-explained',
    title: 'מס יסף 2026: שיעור 3% ומס נוסף על הכנסה הונית',
    description:
      'מתי בודקים מס יסף על הכנסה חייבת גבוהה, ומהו המס הנוסף על הכנסה ממקור הוני.',
    category: 'מיסוי אישי',
    readTime: '10 דקות',
    date: '2026-05-16',
    updatedDate: '2026-09-29',
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
    title: 'מסלולי משכנתא: איך משווים פריים, קבועה והצמדה',
    description:
      'בדיקת ריבית, הצמדה, שינויי תשלום וסיכונים לפי ההצעות האישיות של הבנקים.',
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
    title: 'שכר נטו 2026: מה משפיע על התלוש',
    description:
      'שיטת בדיקה של ניכויי מס הכנסה, ביטוח לאומי, בריאות ופנסיה מול המקורות הרשמיים.',
    category: 'מיסוי אישי',
    readTime: '12 דקות',
    date: '2026-05-15',
    updatedDate: '2026-09-29',
    featured: false,
    relatedCalculator: {
      href: '/personal-tax/salary-net-gross',
      label: 'מחשבון שכר נטו-ברוטו',
    },
    related: ['tax-refund-complete-guide-2026', 'tax-changes-2026'],
  },
  {
    slug: 'vacation-redemption-guide',
    title: 'פדיון חופשה בסיום עבודה: יתרה, חישוב ומס',
    description:
      'בדיקת יתרת חופשה לפדיון בסיום עבודה, התעריף והמסמכים הדרושים.',
    category: 'זכויות עובדים',
    readTime: '8 דקות',
    date: '2026-05-15',
    updatedDate: '2026-09-29',
    featured: false,
    relatedCalculator: {
      href: '/employee-rights/annual-leave',
      label: 'מדריך חופשה שנתית',
    },
    related: ['severance-pay-complete-guide', 'recreation-pay-2026'],
  },
  {
    slug: 'vehicle-tco-guide',
    title: 'עלות בעלות על רכב: אילו נתונים צריך להשוות',
    description:
      'מחיר רכישה, מימון, דלק, ביטוח, תחזוקה וערך מכירה לאורך תקופת החזקה.',
    category: 'רכב',
    readTime: '12 דקות',
    date: '2026-05-15',
    updatedDate: '2026-09-29',
    featured: false,
    relatedCalculator: {
      href: '/vehicles/leasing-vs-buying',
      label: 'מדריך ליסינג מול קנייה',
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
      label: 'מדריך השוואת תמהילים',
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
      label: 'מדריך להשוואת תמהילי משכנתא',
    },
    related: ['boi-directive-329-mortgage-rules', 'mortgage-refinance-when-and-how', 'mortgage-tracks-guide-2026'],
  },
  {
    slug: 'mortgage-refinance-when-and-how',
    title: 'מיחזור משכנתא: איך בודקים אם ההצעה החדשה משתלמת?',
    description:
      'בקשת יתרת סילוק והשוואת הצעה חדשה כולל ריבית, מסלולים, עמלות ועלויות נוספות.',
    category: 'נדל"ן ומשכנתאות',
    readTime: '12 דקות',
    date: '2026-05-16',
    featured: false,
    relatedCalculator: {
      href: '/real-estate/mortgage-optimizer',
      label: 'מדריך השוואת תמהילים',
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
    title: 'מיסוי פיצויי פיטורים: פטור, רצף ופריסה',
    description:
      'בחירות מס בעת סיום עבודה: טופס 161, פטור על מענק פרישה, רצף ופריסת הכנסה.',
    category: 'זכויות עובדים',
    readTime: '14 דקות',
    date: '2026-05-16',
    updatedDate: '2026-09-29',
    featured: true,
    relatedCalculator: {
      href: '/employee-rights/severance',
      label: 'מדריך בדיקת פיצויים',
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
      label: 'מדריך להשוואת תמהילי משכנתא',
    },
    related: ['purchase-tax-2026-complete-guide', 'capital-gains-tax-property-2026', 'compound-interest-and-time-magic'],
  },

  // ===== אשכול G - כלים לעסקים =====
  {
    slug: 'business-budget-planning-2026',
    title: 'איך בונים תקציב לעסק קטן ומעדכנים אותו',
    description:
      'בניית תקציב הכנסות, הוצאות ותזרים לפי נתוני העסק, והשוואת התכנון לביצוע לאורך השנה.',
    category: 'תקציב וחיסכון',
    readTime: '12 דקות',
    date: '2026-05-16',
    updatedDate: '2026-09-29',
    featured: true,
    relatedCalculator: {
      href: '/tools/budget',
      label: 'מחשבון תקציב ו-P&L',
    },
    related: ['cash-flow-forecast-business', 'business-valuation-methods', 'tax-advances-self-employed-survival'],
  },
  {
    slug: 'cash-flow-forecast-business',
    title: 'תחזית תזרים מזומנים לעסק: איך בונים ומעדכנים',
    description:
      'תחזית תקבולים ותשלומים לפי מועדים, הבחנה בין רווח למזומן ועדכון חודשי של תרחישים.',
    category: 'תקציב וחיסכון',
    readTime: '13 דקות',
    date: '2026-05-16',
    updatedDate: '2026-09-29',
    featured: true,
    relatedCalculator: {
      href: '/tools/cash-flow',
      label: 'מחשבון תזרים מזומנים',
    },
    related: ['business-budget-planning-2026', 'business-valuation-methods'],
  },
  {
    slug: 'business-valuation-methods',
    title: 'הערכת שווי עסק: תזרים, עסקאות השוואה ונכסים',
    description:
      'גישת הכנסה, גישת שוק וגישת עלות: נתוני העסק וההנחות הדרושות להערכת שווי.',
    category: 'תקציב וחיסכון',
    readTime: '14 דקות',
    date: '2026-05-16',
    updatedDate: '2026-09-29',
    featured: false,
    relatedCalculator: {
      href: '/tools/business-valuation',
      label: 'מדריך הערכת שווי עסק',
    },
    related: ['business-budget-planning-2026', 'cash-flow-forecast-business', 'company-vs-self-employed-ultimate-guide'],
  },

  // ===== אשכול H - רכב =====
  {
    slug: 'leasing-vs-buying-vs-cash-decision',
    title: 'ליסינג, הלוואה או קניית רכב במזומן: כך משווים',
    description:
      'השוואה לפי הצעות אישיות: תשלומים, ריבית, שירותים בחוזה, ערך הרכב בסוף התקופה ועלויות שימוש.',
    category: 'רכב',
    readTime: '14 דקות',
    date: '2026-05-16',
    updatedDate: '2026-09-29',
    featured: true,
    relatedCalculator: {
      href: '/vehicles/leasing-vs-buying',
      label: 'מדריך ליסינג מול קנייה',
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
      label: 'מדריך ליסינג מול קנייה',
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
    title: 'פנסיה לעצמאי 2026: איך בודקים חובת הפקדה והטבת מס',
    description:
      'שיעורי חובת ההפקדה, ההבדל בין ניכוי לזיכוי והנתונים הדרושים לבדיקת הזכאות האישית.',
    category: 'עצמאיים',
    readTime: '13 דקות',
    date: '2026-05-16',
    updatedDate: '2026-09-29',
    featured: false,
    relatedCalculator: {
      href: '/self-employed/year-end-tax-simulator',
      label: 'מדריך בדיקת מס לסוף שנה',
    },
    related: ['bituach-leumi-self-employed-deep-dive', 'study-fund-self-employed-strategy', 'pension-deduction-self-employed-2026'],
  },
  {
    slug: 'tax-coordination-guide-2026',
    title: 'תיאום מס 2026: מתי עושים ואיך מגישים',
    description:
      'תיאום מס לשכירים ולבעלי עסק זעיר דרך השירות המקוון של רשות המסים.',
    category: 'עצמאיים',
    readTime: '10 דקות',
    date: '2026-06-12',
    updatedDate: '2026-09-29',
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
