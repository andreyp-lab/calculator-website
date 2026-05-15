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
