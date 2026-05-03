/**
 * רשימת כל המחשבונים לצורך חיפוש
 *
 * פורמט: לכל מחשבון - שם, קישור, קטגוריה, מילות מפתח לחיפוש
 */

export interface CalculatorEntry {
  id: string;
  title: string;
  href: string;
  category: string;
  categoryHref: string;
  description: string;
  icon: string;
  keywords: string[]; // מילים נוספות לחיפוש
}

export const allCalculators: CalculatorEntry[] = [
  // זכויות עובדים
  {
    id: 'severance',
    title: 'מחשבון פיצויי פיטורין',
    href: '/employee-rights/severance',
    category: 'זכויות עובדים',
    categoryHref: '/employee-rights',
    description: 'חישוב פיצויים לפי החוק כולל פטור ממס',
    icon: '💼',
    keywords: ['פיטורין', 'פיצויים', 'חוק פיצויי פיטורים', 'סיום עבודה'],
  },
  {
    id: 'recreation-pay',
    title: 'מחשבון דמי הבראה',
    href: '/employee-rights/recreation-pay',
    category: 'זכויות עובדים',
    categoryHref: '/employee-rights',
    description: 'חישוב דמי הבראה לפי וותק',
    icon: '🏖️',
    keywords: ['הבראה', 'נופש', 'וותק'],
  },

  // מיסוי אישי
  {
    id: 'income-tax',
    title: 'מחשבון מס הכנסה לשכיר',
    href: '/personal-tax/income-tax',
    category: 'מיסוי אישי',
    categoryHref: '/personal-tax',
    description: 'חישוב מס הכנסה ונטו עם נקודות זיכוי וב.ל.',
    icon: '💰',
    keywords: ['נטו', 'ברוטו', 'משכורת', 'מדרגות מס', 'תלוש משכורת'],
  },
  {
    id: 'tax-credits',
    title: 'מחשבון נקודות זיכוי',
    href: '/personal-tax/tax-credits',
    category: 'מיסוי אישי',
    categoryHref: '/personal-tax',
    description: 'בדוק כמה נקודות זיכוי מגיעות לך',
    icon: '🎯',
    keywords: ['זיכוי', 'נקודות', 'הנחה', 'החזר מס', 'טופס 101'],
  },

  // נדל"ן ומשכנתא
  {
    id: 'mortgage',
    title: 'מחשבון משכנתא',
    href: '/real-estate/mortgage',
    category: 'משכנתא ונדל"ן',
    categoryHref: '/real-estate',
    description: 'חישוב לוח סילוקין שפיצר/קרן שווה',
    icon: '🏠',
    keywords: ['משכנתא', 'לוח סילוקין', 'שפיצר', 'הלוואה לדיור', 'בנק'],
  },
  {
    id: 'purchase-tax',
    title: 'מחשבון מס רכישה',
    href: '/real-estate/purchase-tax',
    category: 'משכנתא ונדל"ן',
    categoryHref: '/real-estate',
    description: 'חישוב מס רכישה לדירה ראשונה / משקיעים',
    icon: '🏘️',
    keywords: ['מס רכישה', 'דירה ראשונה', 'משקיע', 'מדרגות מס'],
  },

  // עצמאיים
  {
    id: 'vat',
    title: 'מחשבון מע"מ',
    href: '/self-employed/vat',
    category: 'עצמאיים',
    categoryHref: '/self-employed',
    description: 'הוספה / חילוץ מע"מ ב-18%',
    icon: '🧾',
    keywords: ['מע"מ', 'חשבונית', 'עוסק מורשה', 'עוסק פטור', 'מס ערך מוסף'],
  },
  {
    id: 'hourly-rate',
    title: 'מחשבון תמחור שעת עבודה',
    href: '/self-employed/hourly-rate',
    category: 'עצמאיים',
    categoryHref: '/self-employed',
    description: 'תעריף שעתי לפרילנסר/יועץ - שכר רצוי + הוצאות + רווח',
    icon: '⏱️',
    keywords: [
      'תמחור',
      'תעריף שעתי',
      'פרילנסר',
      'יועץ',
      'עצמאי',
      'מחיר שעה',
      'billable',
      'hourly rate',
      'freelancer',
    ],
  },
  {
    id: 'employer-cost',
    title: 'מחשבון עלות מעסיק',
    href: '/self-employed/employer-cost',
    category: 'עצמאיים',
    categoryHref: '/self-employed',
    description: 'כמה עולה להעסיק עובד - שכר, ביטוח לאומי, פנסיה, הטבות',
    icon: '👥',
    keywords: [
      'עלות מעסיק',
      'העסקת עובד',
      'מעסיק',
      'ביטוח לאומי מעסיק',
      'פנסיה חובה',
      'דמי הבראה',
      'פיצויים',
      'עלות עובד',
      'employer cost',
    ],
  },

  // השקעות
  {
    id: 'compound-interest',
    title: 'מחשבון ריבית דריבית',
    href: '/investments/compound-interest',
    category: 'השקעות',
    categoryHref: '/investments',
    description: 'גלה כמה הכסף שלך יגדל לאורך זמן',
    icon: '📈',
    keywords: ['ריבית', 'דריבית', 'השקעה', 'תשואה', 'פיקדון', 'חיסכון'],
  },
  {
    id: 'roi',
    title: 'מחשבון ROI',
    href: '/investments/roi',
    category: 'השקעות',
    categoryHref: '/investments',
    description: 'חישוב תשואה על השקעה (ROI)',
    icon: '💹',
    keywords: ['ROI', 'תשואה', 'רווח', 'השקעה', 'אחוז'],
  },
  {
    id: 'retirement',
    title: 'מחשבון תכנון פרישה',
    href: '/investments/retirement',
    category: 'השקעות',
    categoryHref: '/investments',
    description: 'בדוק אם אתה במסלול לפרישה',
    icon: '🏖️',
    keywords: ['פרישה', 'פנסיה', 'גיל פרישה', 'תכנון', 'חיסכון לטווח ארוך'],
  },

  // חיסכון וחובות
  {
    id: 'family-budget',
    title: 'תקציב משפחתי',
    href: '/savings/family-budget',
    category: 'חיסכון וחובות',
    categoryHref: '/savings',
    description: 'נהל תקציב לפי כלל 50/30/20',
    icon: '👨‍👩‍👧',
    keywords: ['תקציב', 'משפחה', 'הוצאות', 'הכנסות', '50/30/20', 'חיסכון'],
  },
  {
    id: 'loan-repayment',
    title: 'מחשבון החזרי הלוואה',
    href: '/savings/loan-repayment',
    category: 'חיסכון וחובות',
    categoryHref: '/savings',
    description: 'חישוב החזרים + סילוק מואץ',
    icon: '💳',
    keywords: ['הלוואה', 'החזר', 'סילוק מוקדם', 'ריבית', 'PMT'],
  },

  // רכב
  {
    id: 'fuel-cost',
    title: 'מחשבון עלות דלק',
    href: '/vehicles/fuel-cost',
    category: 'רכב',
    categoryHref: '/vehicles',
    description: 'חישוב עלות חודשית ושנתית של דלק',
    icon: '⛽',
    keywords: ['דלק', 'בנזין', 'סולר', 'חשמלי', 'הוצאות רכב', 'צריכה'],
  },
  {
    id: 'leasing-vs-buying',
    title: 'ליסינג vs קנייה',
    href: '/vehicles/leasing-vs-buying',
    category: 'רכב',
    categoryHref: '/vehicles',
    description: 'השוואה בין ליסינג לקניית רכב',
    icon: '🚙',
    keywords: ['ליסינג', 'קנייה', 'רכב', 'מימון רכב', 'השוואה'],
  },

  // ביטוחים
  {
    id: 'pension',
    title: 'מחשבון פנסיה צפויה',
    href: '/insurance/pension',
    category: 'ביטוחים',
    categoryHref: '/insurance',
    description: 'חישוב קצבה חודשית בפרישה',
    icon: '👴',
    keywords: ['פנסיה', 'קצבה', 'פרישה', 'מקדם המרה', 'חיסכון פנסיוני'],
  },

  // כלים מקצועיים
  {
    id: 'unified-tools',
    title: 'מערכת מאוחדת',
    href: '/tools/unified',
    category: 'כלים לעסקים',
    categoryHref: '/tools',
    description: 'תקציב + תזרים + ניתוח דוחות',
    icon: '🚀',
    keywords: ['עסקים', 'תקציב', 'תזרים', 'ניתוח דוחות', 'B2B', 'CFO'],
  },
  {
    id: 'budget-tool',
    title: 'תכנון תקציב לעסק',
    href: '/tools/budget',
    category: 'כלים לעסקים',
    categoryHref: '/tools',
    description: 'P&L מלא, הכנסות, הוצאות, עובדים',
    icon: '📊',
    keywords: ['תקציב', 'P&L', 'רווח והפסד', 'הכנסות', 'הוצאות'],
  },
  {
    id: 'cash-flow',
    title: 'תזרים מזומנים',
    href: '/tools/cash-flow',
    category: 'כלים לעסקים',
    categoryHref: '/tools',
    description: 'יתרות בנק ותחזיות תזרים',
    icon: '💵',
    keywords: ['תזרים', 'מזומנים', 'יתרת בנק', 'תחזיות'],
  },
  {
    id: 'financial-analysis',
    title: 'ניתוח דוחות כספיים',
    href: '/tools/financial-analysis',
    category: 'כלים לעסקים',
    categoryHref: '/tools',
    description: 'יחסים פיננסיים, Z-Score, דירוג אשראי',
    icon: '🔍',
    keywords: ['ניתוח', 'יחסים פיננסיים', 'Z-Score', 'אשראי', 'מאזן'],
  },
];

/**
 * חיפוש מחשבונים לפי טקסט
 */
export function searchCalculators(query: string): CalculatorEntry[] {
  if (!query.trim()) return [];

  const q = query.toLowerCase().trim();
  const words = q.split(/\s+/);

  return allCalculators
    .map((calc) => {
      const haystack =
        `${calc.title} ${calc.category} ${calc.description} ${calc.keywords.join(' ')}`.toLowerCase();
      let score = 0;

      // התאמה מלאה
      if (haystack.includes(q)) score += 10;

      // התאמה לכל מילה
      for (const word of words) {
        if (calc.title.toLowerCase().includes(word)) score += 5;
        if (calc.category.toLowerCase().includes(word)) score += 3;
        if (calc.keywords.some((k) => k.toLowerCase().includes(word))) score += 2;
        if (calc.description.toLowerCase().includes(word)) score += 1;
      }

      return { calc, score };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((r) => r.calc)
    .slice(0, 8); // עד 8 תוצאות
}
