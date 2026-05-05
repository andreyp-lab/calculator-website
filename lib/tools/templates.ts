/**
 * Industry Budget Templates
 *
 * תבניות מוכנות לעסקים שונים - חוסך למשתמש זמן באוונבורדינג.
 * כל תבנית כוללת:
 * - מבנה הכנסות טיפוסי
 * - הוצאות עיקריות (כולל אחוזים מהכנסות)
 * - הנחות ענפיות (DSO/DPO/CapEx)
 * - הערות אסטרטגיות
 */

import type {
  BudgetTemplate,
  BudgetData,
  Industry,
  ForecastAssumptions,
} from './types';

/** עוזר ליצירת ID */
const id = () => Math.random().toString(36).slice(2, 10);

// ============================================================
// SaaS / Tech Startup
// ============================================================

const SAAS_TEMPLATE: BudgetTemplate = {
  id: 'saas-startup',
  name: 'SaaS / סטארט-אפ טכנולוגי',
  industry: 'technology',
  description: 'חברת SaaS B2B עם מנויים חודשיים. דגש על R&D ושיווק.',
  icon: 'Cloud',
  budget: {
    income: [
      {
        id: id(),
        name: 'מנויים חודשיים',
        amount: 80000,
        startMonth: 0,
        duration: 12,
        growthPct: 8, // 8% צמיחה חודשית
        paymentTerms: 0,
        status: 'expected',
      },
      {
        id: id(),
        name: 'מנויים שנתיים (פרמיום)',
        amount: 50000,
        startMonth: 0,
        duration: 12,
        growthPct: 5,
        paymentTerms: 0,
        status: 'expected',
      },
      {
        id: id(),
        name: 'שירותי מקצוע (אונבורדינג)',
        amount: 15000,
        startMonth: 0,
        duration: 12,
        growthPct: 3,
        paymentTerms: 30,
        status: 'expected',
      },
    ],
    expenses: [
      // COGS - עלויות הענן
      {
        id: id(),
        category: 'cogs',
        name: 'AWS / תשתיות ענן',
        amount: 0,
        isPct: true,
        percentage: 12,
        startMonth: 0,
        duration: 12,
        paymentTerms: 30,
      },
      {
        id: id(),
        category: 'cogs',
        name: 'תמיכה טכנית (CSM)',
        amount: 0,
        isPct: true,
        percentage: 8,
        startMonth: 0,
        duration: 12,
        paymentTerms: 0,
      },
      // R&D
      {
        id: id(),
        category: 'rnd',
        name: 'כלי פיתוח (Linear, Sentry, ועוד)',
        amount: 3500,
        isPct: false,
        percentage: 0,
        startMonth: 0,
        duration: 12,
        paymentTerms: 0,
      },
      // Marketing
      {
        id: id(),
        category: 'marketing',
        name: 'Google Ads + LinkedIn',
        amount: 0,
        isPct: true,
        percentage: 18,
        startMonth: 0,
        duration: 12,
        paymentTerms: 30,
      },
      {
        id: id(),
        category: 'marketing',
        name: 'תוכן + SEO',
        amount: 8000,
        isPct: false,
        percentage: 0,
        startMonth: 0,
        duration: 12,
        paymentTerms: 30,
      },
      // Operating
      {
        id: id(),
        category: 'operating',
        name: 'משרד + שירותים',
        amount: 12000,
        isPct: false,
        percentage: 0,
        startMonth: 0,
        duration: 12,
        paymentTerms: 0,
      },
      {
        id: id(),
        category: 'operating',
        name: 'רואה חשבון + עו"ד',
        amount: 5000,
        isPct: false,
        percentage: 0,
        startMonth: 0,
        duration: 12,
        paymentTerms: 30,
      },
    ],
    employees: [
      {
        id: id(),
        name: 'CTO',
        department: 'development',
        monthlySalary: 40000,
        startMonth: 0,
        endMonth: null,
        position: 'CTO',
      },
      {
        id: id(),
        name: 'Senior Backend',
        department: 'development',
        monthlySalary: 30000,
        startMonth: 0,
        endMonth: null,
        position: 'Senior SWE',
      },
      {
        id: id(),
        name: 'Senior Frontend',
        department: 'development',
        monthlySalary: 28000,
        startMonth: 0,
        endMonth: null,
        position: 'Senior SWE',
      },
      {
        id: id(),
        name: 'VP Sales',
        department: 'sales',
        monthlySalary: 32000,
        startMonth: 0,
        endMonth: null,
        position: 'VP Sales',
      },
      {
        id: id(),
        name: 'CMO',
        department: 'marketing',
        monthlySalary: 28000,
        startMonth: 0,
        endMonth: null,
        position: 'CMO',
      },
    ],
    loans: [],
  },
  assumptions: {
    revenueGrowthPct: [40, 35, 30, 25, 20],
    grossMarginPct: [75, 78, 80, 82, 82],
    rndPctOfRevenue: [25, 22, 20, 18, 16],
    marketingPctOfRevenue: [30, 28, 25, 22, 20],
    operatingPctOfRevenue: [12, 11, 10, 9, 8],
    dso: 30,
    dpo: 30,
    dio: 0,
    effectiveTaxRate: 23,
    effectiveInterestRate: 6,
  },
  notes: [
    'יחסי R&D ושיווק גבוהים אופייניים ל-SaaS בצמיחה',
    'מטרה: NRR מעל 110%, LTV/CAC מעל 3',
    'מאזן: נמוך AR (תשלום מראש), נמוך מלאי, גבוה IP/intangibles',
  ],
};

// ============================================================
// Restaurant
// ============================================================

const RESTAURANT_TEMPLATE: BudgetTemplate = {
  id: 'restaurant',
  name: 'מסעדה',
  industry: 'food',
  description: 'מסעדה עירונית ב-50-80 מקומות. תזרים יומי גבוה, מלאי מתכלה.',
  icon: 'UtensilsCrossed',
  budget: {
    income: [
      {
        id: id(),
        name: 'מכירות אוכל - שולחנות',
        amount: 280000,
        startMonth: 0,
        duration: 12,
        growthPct: 1,
        paymentTerms: 0,
        status: 'expected',
      },
      {
        id: id(),
        name: 'משלוחים (Wolt/10bis)',
        amount: 90000,
        startMonth: 0,
        duration: 12,
        growthPct: 2,
        paymentTerms: 14,
        status: 'expected',
      },
      {
        id: id(),
        name: 'אירועים פרטיים',
        amount: 25000,
        startMonth: 0,
        duration: 12,
        growthPct: 0,
        paymentTerms: 0,
        status: 'expected',
      },
    ],
    expenses: [
      {
        id: id(),
        category: 'cogs',
        name: 'חומרי גלם (מזון + משקאות)',
        amount: 0,
        isPct: true,
        percentage: 32,
        startMonth: 0,
        duration: 12,
        paymentTerms: 30,
      },
      {
        id: id(),
        category: 'cogs',
        name: 'עמלות משלוחים (Wolt/10bis)',
        amount: 0,
        isPct: true,
        percentage: 5,
        startMonth: 0,
        duration: 12,
        paymentTerms: 14,
      },
      {
        id: id(),
        category: 'operating',
        name: 'שכירות',
        amount: 35000,
        isPct: false,
        percentage: 0,
        startMonth: 0,
        duration: 12,
        paymentTerms: 0,
      },
      {
        id: id(),
        category: 'operating',
        name: 'חשמל + גז + מים',
        amount: 12000,
        isPct: false,
        percentage: 0,
        startMonth: 0,
        duration: 12,
        paymentTerms: 60,
      },
      {
        id: id(),
        category: 'operating',
        name: 'ארנונה + ביטוחים',
        amount: 8000,
        isPct: false,
        percentage: 0,
        startMonth: 0,
        duration: 12,
        paymentTerms: 0,
      },
      {
        id: id(),
        category: 'marketing',
        name: 'קידום במדיה חברתית',
        amount: 6000,
        isPct: false,
        percentage: 0,
        startMonth: 0,
        duration: 12,
        paymentTerms: 0,
      },
    ],
    employees: [
      {
        id: id(),
        name: 'שף ראשי',
        department: 'operations',
        monthlySalary: 22000,
        startMonth: 0,
        endMonth: null,
        position: 'Chef',
      },
      {
        id: id(),
        name: 'סו-שף',
        department: 'operations',
        monthlySalary: 14000,
        startMonth: 0,
        endMonth: null,
        position: 'Sous Chef',
      },
      {
        id: id(),
        name: 'מנהל אולם',
        department: 'operations',
        monthlySalary: 14000,
        startMonth: 0,
        endMonth: null,
        position: 'FOH Manager',
      },
      {
        id: id(),
        name: 'טבחים (×3)',
        department: 'operations',
        monthlySalary: 30000, // 10K × 3
        startMonth: 0,
        endMonth: null,
      },
      {
        id: id(),
        name: 'מלצרים (×4)',
        department: 'operations',
        monthlySalary: 28000, // 7K × 4
        startMonth: 0,
        endMonth: null,
      },
    ],
    loans: [],
  },
  assumptions: {
    revenueGrowthPct: [5, 6, 6, 5, 4],
    grossMarginPct: [63, 64, 65, 65, 65],
    rndPctOfRevenue: [0, 0, 0, 0, 0],
    marketingPctOfRevenue: [3, 3, 3, 3, 3],
    operatingPctOfRevenue: [40, 38, 37, 36, 36],
    dso: 7,
    dpo: 30,
    dio: 7,
    effectiveTaxRate: 23,
    effectiveInterestRate: 7,
  },
  notes: [
    'יחס עלות מזון 28-35% מהמכירות הוא הנורמה',
    'שכר עובדים נע סביב 30-35% מהמכירות',
    'תזרים: מכירות מזומן/אשראי מיידי, ספקים בנטו 30',
  ],
};

// ============================================================
// E-commerce
// ============================================================

const ECOMMERCE_TEMPLATE: BudgetTemplate = {
  id: 'ecommerce',
  name: 'חנות מקוונת (E-commerce)',
  industry: 'retail',
  description: 'חנות D2C עם מלאי. דגש על שיווק דיגיטלי ולוגיסטיקה.',
  icon: 'ShoppingCart',
  budget: {
    income: [
      {
        id: id(),
        name: 'מכירות אתר',
        amount: 350000,
        startMonth: 0,
        duration: 12,
        growthPct: 5,
        paymentTerms: 0,
        status: 'expected',
      },
      {
        id: id(),
        name: 'מכירות מרקטפלייס (Amazon/eBay)',
        amount: 120000,
        startMonth: 0,
        duration: 12,
        growthPct: 4,
        paymentTerms: 14,
        status: 'expected',
      },
    ],
    expenses: [
      {
        id: id(),
        category: 'cogs',
        name: 'עלות מוצרים',
        amount: 0,
        isPct: true,
        percentage: 45,
        startMonth: 0,
        duration: 12,
        paymentTerms: 60,
      },
      {
        id: id(),
        category: 'cogs',
        name: 'משלוחים + אריזה',
        amount: 0,
        isPct: true,
        percentage: 8,
        startMonth: 0,
        duration: 12,
        paymentTerms: 30,
      },
      {
        id: id(),
        category: 'cogs',
        name: 'עמלות פלטפורמה (Amazon)',
        amount: 0,
        isPct: true,
        percentage: 4,
        startMonth: 0,
        duration: 12,
        paymentTerms: 14,
      },
      {
        id: id(),
        category: 'marketing',
        name: 'Meta Ads + Google Ads',
        amount: 0,
        isPct: true,
        percentage: 18,
        startMonth: 0,
        duration: 12,
        paymentTerms: 30,
      },
      {
        id: id(),
        category: 'marketing',
        name: 'משפיענים + תוכן',
        amount: 15000,
        isPct: false,
        percentage: 0,
        startMonth: 0,
        duration: 12,
        paymentTerms: 30,
      },
      {
        id: id(),
        category: 'operating',
        name: 'מחסן + לוגיסטיקה',
        amount: 25000,
        isPct: false,
        percentage: 0,
        startMonth: 0,
        duration: 12,
        paymentTerms: 30,
      },
      {
        id: id(),
        category: 'operating',
        name: 'Shopify + כלי SaaS',
        amount: 4000,
        isPct: false,
        percentage: 0,
        startMonth: 0,
        duration: 12,
        paymentTerms: 0,
      },
    ],
    employees: [
      {
        id: id(),
        name: 'מנכ"ל / מייסד',
        department: 'administration',
        monthlySalary: 25000,
        startMonth: 0,
        endMonth: null,
      },
      {
        id: id(),
        name: 'מנהל שיווק',
        department: 'marketing',
        monthlySalary: 22000,
        startMonth: 0,
        endMonth: null,
      },
      {
        id: id(),
        name: 'תפעול + שירות לקוחות',
        department: 'operations',
        monthlySalary: 14000,
        startMonth: 0,
        endMonth: null,
      },
    ],
    loans: [],
  },
  assumptions: {
    revenueGrowthPct: [25, 22, 18, 15, 12],
    grossMarginPct: [43, 44, 45, 46, 47],
    rndPctOfRevenue: [0, 0, 0, 0, 0],
    marketingPctOfRevenue: [22, 20, 18, 17, 16],
    operatingPctOfRevenue: [12, 11, 10, 10, 9],
    dso: 5,
    dpo: 60,
    dio: 75,
    effectiveTaxRate: 23,
    effectiveInterestRate: 7,
  },
  notes: [
    'מלאי גבוה (DIO 60-90 ימים) - תכנון תזרים קריטי',
    'הוצאת שיווק 15-25% מהכנסות נורמלית בשנים הראשונות',
    'CAC ו-LTV דרושים לסקאלינג בריא',
  ],
};

// ============================================================
// Freelancer / Consultant
// ============================================================

const FREELANCER_TEMPLATE: BudgetTemplate = {
  id: 'freelancer',
  name: 'פרילנסר / יועץ',
  industry: 'services',
  description: 'עוסק מורשה / חברה זעירה. הוצאות מינימליות, עיקר ההכנסה משעות.',
  icon: 'Laptop',
  budget: {
    income: [
      {
        id: id(),
        name: 'פרויקטים קבועים',
        amount: 35000,
        startMonth: 0,
        duration: 12,
        growthPct: 1,
        paymentTerms: 30,
        status: 'expected',
      },
      {
        id: id(),
        name: 'פרויקטים אד-הוק',
        amount: 15000,
        startMonth: 0,
        duration: 12,
        growthPct: 3,
        paymentTerms: 30,
        status: 'expected',
      },
    ],
    expenses: [
      {
        id: id(),
        category: 'operating',
        name: 'משרד / Co-working',
        amount: 1500,
        isPct: false,
        percentage: 0,
        startMonth: 0,
        duration: 12,
        paymentTerms: 0,
      },
      {
        id: id(),
        category: 'operating',
        name: 'כלים + מנויים',
        amount: 1200,
        isPct: false,
        percentage: 0,
        startMonth: 0,
        duration: 12,
        paymentTerms: 0,
      },
      {
        id: id(),
        category: 'operating',
        name: 'רואה חשבון',
        amount: 800,
        isPct: false,
        percentage: 0,
        startMonth: 0,
        duration: 12,
        paymentTerms: 30,
      },
      {
        id: id(),
        category: 'marketing',
        name: 'אתר + LinkedIn',
        amount: 500,
        isPct: false,
        percentage: 0,
        startMonth: 0,
        duration: 12,
        paymentTerms: 0,
      },
    ],
    employees: [],
    loans: [],
  },
  assumptions: {
    revenueGrowthPct: [10, 10, 8, 8, 5],
    grossMarginPct: [85, 85, 85, 85, 85],
    rndPctOfRevenue: [0, 0, 0, 0, 0],
    marketingPctOfRevenue: [2, 2, 2, 2, 2],
    operatingPctOfRevenue: [10, 10, 10, 10, 10],
    dso: 45,
    dpo: 30,
    dio: 0,
    effectiveTaxRate: 35, // עוסק מורשה בסקלת מס פרוגרסיבית
    effectiveInterestRate: 8,
  },
  notes: [
    'גמישות גבוהה - אבל DSO ארוך מאיים על תזרים',
    'דרושה רזרבת מזומן של 3-6 חודשים',
    'שקול תאגיד אם הכנסה > 600K שח/שנה (יתרון מס)',
  ],
};

// ============================================================
// Clinic / Healthcare
// ============================================================

const CLINIC_TEMPLATE: BudgetTemplate = {
  id: 'clinic',
  name: 'קליניקה רפואית / רופא פרטי',
  industry: 'healthcare',
  description: 'מרפאה פרטית עם 2-4 מטפלים. הכנסה מטיפולים + הסכמי ביטוח.',
  icon: 'Stethoscope',
  budget: {
    income: [
      {
        id: id(),
        name: 'מטופלים פרטיים',
        amount: 95000,
        startMonth: 0,
        duration: 12,
        growthPct: 2,
        paymentTerms: 0,
        status: 'expected',
      },
      {
        id: id(),
        name: 'הסכמי ביטוח (השלמת שב"ן)',
        amount: 60000,
        startMonth: 0,
        duration: 12,
        growthPct: 1,
        paymentTerms: 60,
        status: 'expected',
      },
    ],
    expenses: [
      {
        id: id(),
        category: 'cogs',
        name: 'חומרים מתכלים + תרופות',
        amount: 0,
        isPct: true,
        percentage: 8,
        startMonth: 0,
        duration: 12,
        paymentTerms: 30,
      },
      {
        id: id(),
        category: 'operating',
        name: 'שכירות מרפאה',
        amount: 18000,
        isPct: false,
        percentage: 0,
        startMonth: 0,
        duration: 12,
        paymentTerms: 0,
      },
      {
        id: id(),
        category: 'operating',
        name: 'ביטוח אחריות מקצועית',
        amount: 4500,
        isPct: false,
        percentage: 0,
        startMonth: 0,
        duration: 12,
        paymentTerms: 0,
      },
      {
        id: id(),
        category: 'operating',
        name: 'מערכת ניהול + IT',
        amount: 2500,
        isPct: false,
        percentage: 0,
        startMonth: 0,
        duration: 12,
        paymentTerms: 0,
      },
      {
        id: id(),
        category: 'marketing',
        name: 'דיגיטל + פרסום',
        amount: 5000,
        isPct: false,
        percentage: 0,
        startMonth: 0,
        duration: 12,
        paymentTerms: 30,
      },
    ],
    employees: [
      {
        id: id(),
        name: 'רופא בכיר',
        department: 'operations',
        monthlySalary: 50000,
        startMonth: 0,
        endMonth: null,
      },
      {
        id: id(),
        name: 'אחות מקצועית',
        department: 'operations',
        monthlySalary: 18000,
        startMonth: 0,
        endMonth: null,
      },
      {
        id: id(),
        name: 'פקידת קבלה',
        department: 'administration',
        monthlySalary: 9500,
        startMonth: 0,
        endMonth: null,
      },
    ],
    loans: [],
  },
  assumptions: {
    revenueGrowthPct: [12, 10, 8, 7, 6],
    grossMarginPct: [88, 89, 90, 90, 90],
    rndPctOfRevenue: [0, 0, 0, 0, 0],
    marketingPctOfRevenue: [4, 4, 4, 3, 3],
    operatingPctOfRevenue: [18, 17, 16, 16, 15],
    dso: 35,
    dpo: 30,
    dio: 14,
    effectiveTaxRate: 23,
    effectiveInterestRate: 7,
  },
  notes: [
    'שב"ן = תשלום נדחה 60-90 ימים, יוצר עומק AR',
    'ציוד רפואי דורש CapEx משמעותי - פחת בשנים',
    'ביטוח אחריות מקצועית חובה',
  ],
};

// ============================================================
// Construction Contractor
// ============================================================

const CONSTRUCTION_TEMPLATE: BudgetTemplate = {
  id: 'construction',
  name: 'קבלן ביצוע',
  industry: 'construction',
  description: 'קבלן זעיר/בינוני בענף הבנייה. תזרים תלוי בחיובים מבוקרים.',
  icon: 'HardHat',
  budget: {
    income: [
      {
        id: id(),
        name: 'פרויקט בינוני - שלב 1',
        amount: 180000,
        startMonth: 0,
        duration: 6,
        growthPct: 0,
        paymentTerms: 60,
        status: 'expected',
      },
      {
        id: id(),
        name: 'פרויקט בינוני - שלב 2',
        amount: 200000,
        startMonth: 6,
        duration: 6,
        growthPct: 0,
        paymentTerms: 60,
        status: 'expected',
      },
      {
        id: id(),
        name: 'עבודות שיפוצים פרטיים',
        amount: 35000,
        startMonth: 0,
        duration: 12,
        growthPct: 0,
        paymentTerms: 30,
        status: 'expected',
      },
    ],
    expenses: [
      {
        id: id(),
        category: 'cogs',
        name: 'חומרי בנייה',
        amount: 0,
        isPct: true,
        percentage: 38,
        startMonth: 0,
        duration: 12,
        paymentTerms: 60,
      },
      {
        id: id(),
        category: 'cogs',
        name: 'קבלני משנה',
        amount: 0,
        isPct: true,
        percentage: 25,
        startMonth: 0,
        duration: 12,
        paymentTerms: 45,
      },
      {
        id: id(),
        category: 'operating',
        name: 'ציוד + השכרה',
        amount: 18000,
        isPct: false,
        percentage: 0,
        startMonth: 0,
        duration: 12,
        paymentTerms: 30,
      },
      {
        id: id(),
        category: 'operating',
        name: 'ביטוח עבודות + קבלנים',
        amount: 8000,
        isPct: false,
        percentage: 0,
        startMonth: 0,
        duration: 12,
        paymentTerms: 0,
      },
    ],
    employees: [
      {
        id: id(),
        name: 'מנהל פרויקטים',
        department: 'operations',
        monthlySalary: 25000,
        startMonth: 0,
        endMonth: null,
      },
      {
        id: id(),
        name: 'פועלים קבועים (×2)',
        department: 'operations',
        monthlySalary: 22000,
        startMonth: 0,
        endMonth: null,
      },
    ],
    loans: [
      {
        id: id(),
        name: 'הלוואת הון חוזר',
        amount: 300000,
        termMonths: 36,
        annualRate: 8.5,
        startMonth: 0,
        type: 'bank',
      },
    ],
  },
  assumptions: {
    revenueGrowthPct: [8, 10, 8, 6, 5],
    grossMarginPct: [22, 23, 24, 25, 25],
    rndPctOfRevenue: [0, 0, 0, 0, 0],
    marketingPctOfRevenue: [1, 1, 1, 1, 1],
    operatingPctOfRevenue: [10, 9, 9, 8, 8],
    dso: 75,
    dpo: 60,
    dio: 30,
    effectiveTaxRate: 23,
    effectiveInterestRate: 9,
  },
  notes: [
    'DSO ארוך (60-120 ימים) - דרושה ערבות בנקאית/מימון',
    'חיובים על שלבי ביצוע - חשוב להגדיר בחוזה',
    'נקודות קריטיות: ערבויות, ביטוחים, בטיחות',
  ],
};

// ============================================================
// EXPORT
// ============================================================

export const BUDGET_TEMPLATES: BudgetTemplate[] = [
  SAAS_TEMPLATE,
  RESTAURANT_TEMPLATE,
  ECOMMERCE_TEMPLATE,
  FREELANCER_TEMPLATE,
  CLINIC_TEMPLATE,
  CONSTRUCTION_TEMPLATE,
];

export function getTemplate(id: string): BudgetTemplate | undefined {
  return BUDGET_TEMPLATES.find((t) => t.id === id);
}

export function getTemplatesByIndustry(industry: Industry): BudgetTemplate[] {
  return BUDGET_TEMPLATES.filter((t) => t.industry === industry);
}

/**
 * החזר עותק "טרי" של תקציב התבנית עם IDs חדשים.
 */
export function instantiateTemplate(template: BudgetTemplate): BudgetData {
  return {
    income: template.budget.income.map((i) => ({ ...i, id: id() })),
    expenses: template.budget.expenses.map((e) => ({ ...e, id: id() })),
    employees: template.budget.employees.map((e) => ({ ...e, id: id() })),
    loans: template.budget.loans.map((l) => ({ ...l, id: id() })),
  };
}
