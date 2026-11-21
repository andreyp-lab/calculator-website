/**
 * מענק עבודה (שנת המס 2025) ושווי שימוש ברכב (2026) — נתונים ממקורות רשמיים של רשות המסים.
 *
 * מענק עבודה: "דע זכויותיך וחובותיך" 2025, נספח א (עמ' 131–134), gov.il/BlobFolder/generalpage/income-tax-guide-knowyourright/he/Guides_IncomeTax_da-2025.pdf.
 *   הספים נכונים לפי המדד הידוע ב-1.1.2026. המדריך אינו כולל את נוסחת הסכום לפי הכנסה — היא בסימולטור הרשמי.
 * שווי שימוש: לוח עזר לחישוב מס הכנסה 2026, פרק ד (עמ' 17), gov.il/BlobFolder/generalpage/income-tax-monthly-deductions-booklet/...
 *   שיעור 2.48% אינו מופיע בלוח; הוא מהתקנות ומקורות משניים (נקרא ב-20.11.2026) ולכן מסומן לאימות.
 */

export interface GrantBand {
  /** ההכנסה החודשית הממוצעת חייבת להיות גבוהה מזה */
  above: number;
  /** ... ונמוכה מזה */
  below: number;
}

export const WORK_GRANT_2025 = {
  minAge: 21,
  seniorAge: 55,
  maxGrantWithoutToddlers: 10_260,
  enlargedRatePct: 150,
  toddlerSupplementPerChild: 500,
  minMonthlyGrant: 20,
  childMaxAgeExclusive: 19,
  /** מענק כללי */
  general: {
    parents1or2: { above: 2_450, below: 7_289 } as GrantBand,
    parents3plus: { above: 2_450, below: 8_020 } as GrantBand,
    singleParent1or2: { above: 1_510, below: 11_190 } as GrantBand,
    singleParent3plus: { above: 1_510, below: 13_660 } as GrantBand,
    /** בני 55 ומעלה (גם ללא ילדים) */
    seniors: { above: 2_450, below: 7_289 } as GrantBand,
    /** נשים בגילי 60–65 שנולדו 1.1.1960 ואילך (נספח ב') */
    women60to65: { above: 920, below: 8_930 } as GrantBand,
  },
  /** מענק נוסף להורה לפעוט (עד גיל 3) */
  toddler: {
    parents1or2: { above: 2_460, below: 8_781 } as GrantBand,
    parents3plus: { above: 2_460, below: 9_462 } as GrantBand,
    singleParent1or2: { above: 1_500, below: 11_063 } as GrantBand,
    singleParent3plus: { above: 1_500, below: 13_474 } as GrantBand,
  },
  taxYear: 2025,
  claimDeadline: '2027-12-31',
  simulatorUrl: 'https://www.misim.gov.il/shmaanakavoda/frmFirst.aspx',
  sourceUrl: 'https://www.gov.il/BlobFolder/generalpage/income-tax-guide-knowyourright/he/Guides_IncomeTax_da-2025.pdf',
} as const;

/** שווי שימוש חודשי לרכב שנרשם לפני 1.1.2010, לפי קבוצת מחיר (לוח עזר 2026). */
export const COMPANY_CAR_PRE_2010_MONTHLY = [3_220, 3_490, 4_490, 5_390, 7_450, 9_660, 12_430] as const;

export const COMPANY_CAR_BENEFIT_2026 = {
  /** מחיר מתואם לצרכן — תקרה לחישוב (לוח עזר 2026) */
  priceCeiling: 596_860,
  /** אחוז חודשי ממחיר הרכב לרכב שנרשם מ-1.1.2010 — מהתקנות; לאימות מול רשות המסים */
  monthlyRateOfPrice: 0.0248,
  /** הפחתות חודשיות לרכב בהנעה מתקדמת, הוראת שעה עד 31.12.2028 */
  reductions: { regular: 0, hybrid: 580, plugin: 1_150, electric: 1_380 },
  motorcycleL3Monthly: 1_070,
  verifiedAt: '2026-11-20',
  simulatorUrl: 'https://www.gov.il/he/service/itc-mm_usecar10',
  sourceUrl:
    'https://www.gov.il/BlobFolder/generalpage/income-tax-monthly-deductions-booklet/he/generalInformation_income-tax-monthly-deductions-booklet_monthly-deductions-booklet-2026.pdf',
} as const;
