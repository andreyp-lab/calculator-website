/**
 * נתונים כלליים המוצגים בקטגוריית הביטוח לשנת 2026.
 * חבות אישית, מקדם המרה לקצבה ותשואה עתידית דורשים נתוני קרן ואדם מסוימים.
 * מקורות: צו ההרחבה לפנסיית חובה; הנחיית רשות המסים מ־2.2.2026; סכומי קצבת אזרח ותיק בביטוח הלאומי.
 */
export const PENSION_CONSTANTS_2026 = {
  minContribRates: {
    employee: 6,
    employer: 6.5,
    severance: 6,
    total: 18.5,
  },
  pensionTaxExemptionPct: 57.5,
  pensionEligibleCeiling: 9_430,
  pensionTaxExemptionCeiling: 5_422,
  nationalInsurancePension: {
    single: 1_838,
    couple: 2_762,
  },
} as const;
