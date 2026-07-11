/**
 * שכר דירה מסחרי וארנונה מסחרית לפי עיר — נתוני בסיס למחשבון תוכנית עסקית.
 *
 * ⚠️ כל הערכים הם **הערכות שוק בקירוב** ל-2026, לצורך אומדן ראשוני בלבד.
 *    שכר דירה בפועל תלוי במיקום בתוך העיר, קומה, מצב הנכס וחוזה; ארנונה נקבעת
 *    לפי צו הארנונה העירוני, אזור וסיווג. יש לאמת מול הרשות המקומית ומול השוק.
 *
 * מקורות: מדדי שוק מסחרי (יד2/מדלן), צווי ארנונה עירוניים 2026 (הערכה).
 */

export interface CityRent {
  city: string;
  /** שכ"ד מסחרי חודשי ממוצע — ₪ למ"ר (טווח מרכזי, אזור מסחרי טיפוסי) */
  rentPerSqmMonthly: number;
  /** ארנונה מסחרית שנתית — ₪ למ"ר (הערכה, סיווג משרדים/מסחר) */
  arnonaPerSqmYearly: number;
  /** אזור/דירוג לתצוגה */
  tier: 'יוקרתי' | 'מרכז' | 'פריפריה';
}

/**
 * ערים מרכזיות. rentPerSqmMonthly = שכ"ד חודשי לכל מ"ר.
 * לדוגמה: 100 מ"ר בת"א ≈ 100 × 120 = 12,000 ₪/חודש.
 */
export const RENT_BY_CITY: CityRent[] = [
  { city: 'תל אביב',        rentPerSqmMonthly: 120, arnonaPerSqmYearly: 360, tier: 'יוקרתי' },
  { city: 'רמת גן',         rentPerSqmMonthly: 95,  arnonaPerSqmYearly: 320, tier: 'מרכז' },
  { city: 'גבעתיים',        rentPerSqmMonthly: 90,  arnonaPerSqmYearly: 300, tier: 'מרכז' },
  { city: 'הרצליה',         rentPerSqmMonthly: 100, arnonaPerSqmYearly: 330, tier: 'יוקרתי' },
  { city: 'ראשון לציון',    rentPerSqmMonthly: 75,  arnonaPerSqmYearly: 270, tier: 'מרכז' },
  { city: 'פתח תקווה',      rentPerSqmMonthly: 70,  arnonaPerSqmYearly: 260, tier: 'מרכז' },
  { city: 'נתניה',          rentPerSqmMonthly: 65,  arnonaPerSqmYearly: 240, tier: 'מרכז' },
  { city: 'ירושלים',        rentPerSqmMonthly: 85,  arnonaPerSqmYearly: 300, tier: 'מרכז' },
  { city: 'חיפה',           rentPerSqmMonthly: 55,  arnonaPerSqmYearly: 230, tier: 'מרכז' },
  { city: 'באר שבע',        rentPerSqmMonthly: 45,  arnonaPerSqmYearly: 200, tier: 'פריפריה' },
  { city: 'אשדוד',          rentPerSqmMonthly: 50,  arnonaPerSqmYearly: 210, tier: 'פריפריה' },
  { city: 'אשקלון',         rentPerSqmMonthly: 45,  arnonaPerSqmYearly: 195, tier: 'פריפריה' },
  { city: 'כפר סבא',        rentPerSqmMonthly: 80,  arnonaPerSqmYearly: 290, tier: 'מרכז' },
  { city: 'מודיעין',        rentPerSqmMonthly: 70,  arnonaPerSqmYearly: 260, tier: 'מרכז' },
  { city: 'רחובות',         rentPerSqmMonthly: 60,  arnonaPerSqmYearly: 235, tier: 'מרכז' },
  { city: 'חדרה',           rentPerSqmMonthly: 45,  arnonaPerSqmYearly: 195, tier: 'פריפריה' },
  { city: 'טבריה',          rentPerSqmMonthly: 40,  arnonaPerSqmYearly: 180, tier: 'פריפריה' },
  { city: 'אילת',           rentPerSqmMonthly: 65,  arnonaPerSqmYearly: 220, tier: 'פריפריה' },
];

/** ברירת מחדל אם לא נבחרה עיר — ממוצע ארצי מקורב */
export const DEFAULT_CITY_RENT: CityRent = {
  city: 'ממוצע ארצי',
  rentPerSqmMonthly: 70,
  arnonaPerSqmYearly: 260,
  tier: 'מרכז',
};

export function getCityRent(city: string): CityRent {
  return RENT_BY_CITY.find((c) => c.city === city) ?? DEFAULT_CITY_RENT;
}
