/**
 * חישוב מע"מ 2026 - מקיף
 *
 * מקור: רשות המסים, חוק מס ערך מוסף, תשל"ו-1975
 * שיעור מע"מ ב-2026: 18% (עלה מ-17% ב-1.1.2025)
 *
 * מכיל:
 * 1. חישובי מע"מ בסיסיים (הוספה / חילוץ)
 * 2. טיפוסי עוסקים (פטור / מורשה / עמותה)
 * 3. דוח דו-חודשי (עסקאות מול תשומות)
 * 4. מעקב חשבוניות לתקופה
 * 5. תרחישים מיוחדים (הנחה, יבוא, תיירות, אילת)
 * 6. השוואת שנים 2024 (17%) vs 2025+ (18%)
 * 7. כללים ענפיים
 */

// ============================================================
// קבועים
// ============================================================

export const VAT_RATES: { standard2025: number; standard2024: number; zero: number } = {
  /** שיעור רגיל 2026 (ו-2025) */
  standard2025: 0.18,
  /** שיעור רגיל 2024 (ולפני) */
  standard2024: 0.17,
  /** שיעור אפס */
  zero: 0,
};

/** תקרת עוסק פטור לשנת 2026 */
export const EXEMPT_THRESHOLD_2026 = 120_000;

// ============================================================
// סוגי עוסקים
// ============================================================

export type OperatorType =
  | 'osek-murshe'   // עוסק מורשה
  | 'osek-patur'    // עוסק פטור
  | 'osek-zair'     // עוסק זעיר (היסטורי)
  | 'amuta'         // עמותה / מלכ"ר
  | 'company';      // חברה בע"מ

export interface OperatorRules {
  type: OperatorType;
  label: string;
  description: string;
  collectsVat: boolean;
  canDeductInputVat: boolean;
  mustReport: boolean;
  reportingFrequency: string;
  threshold: number | null;
  keyPoints: string[];
  advantages: string[];
  disadvantages: string[];
}

export function getOperatorRules(type: OperatorType): OperatorRules {
  switch (type) {
    case 'osek-murshe':
      return {
        type,
        label: 'עוסק מורשה',
        description: 'עסק עם מחזור שנתי מעל 120,000 ₪ — מנפיק חשבוניות מס וגובה מע"מ',
        collectsVat: true,
        canDeductInputVat: true,
        mustReport: true,
        reportingFrequency: 'דו-חודשי (או חודשי למחזור גבוה)',
        threshold: null,
        keyPoints: [
          'גובה מע"מ 18% מלקוחות ומעביר לרשות המסים',
          'מקזז מע"מ ששולם על תשומות עסקיות',
          'מנפיק חשבוניות מס (חשבונית ישראל החל מ-2024)',
          'מגיש דוח מע"מ עד ה-15 לחודש שאחרי תקופת הדיווח',
        ],
        advantages: [
          'מקבל החזר מע"מ על קניות עסקיות',
          'נראה מקצועי ללקוחות עסקיים',
          'אין תקרת מחזור',
        ],
        disadvantages: [
          'ניהול ספרים ודיווח תקופתי',
          'ניכויים מוגבלים לחלק עסקי בלבד',
        ],
      };

    case 'osek-patur':
      return {
        type,
        label: 'עוסק פטור',
        description: 'עסק קטן עם מחזור שנתי עד 120,000 ₪ — לא גובה ולא מדווח מע"מ',
        collectsVat: false,
        canDeductInputVat: false,
        mustReport: true,
        reportingFrequency: 'שנתי (דוח רווח/הפסד בלבד)',
        threshold: EXEMPT_THRESHOLD_2026,
        keyPoints: [
          'לא גובה מע"מ מלקוחות',
          'לא מנפיק חשבונית מס (רק קבלה / חשבונית עסקה)',
          'לא מקזז מע"מ תשומות',
          'תקרת מחזור שנתי: 120,000 ₪ לשנת 2026',
        ],
        advantages: [
          'פחות ניירת ובירוקרטיה',
          'מחיר תחרותי ללקוחות פרטיים (כולל מע"מ בפועל)',
        ],
        disadvantages: [
          'אינו מקבל החזר מע"מ על קניות',
          'לקוחות עסקיים מעדיפים עוסק מורשה',
          'עלות הציוד יקרה יותר ב-18%',
        ],
      };

    case 'osek-zair':
      return {
        type,
        label: 'עוסק זעיר',
        description: 'סיווג שנבטל בעיקרו — לא רלוונטי לרוב העצמאים החדשים',
        collectsVat: false,
        canDeductInputVat: false,
        mustReport: false,
        reportingFrequency: 'לא רלוונטי',
        threshold: null,
        keyPoints: [
          'הסיווג בוטל רשמית בשנות ה-90',
          'אם אתה בסיווג זה — מומלץ לבדוק מול רשות המסים',
        ],
        advantages: [],
        disadvantages: ['סיווג מיושן — כמעט לא בשימוש'],
      };

    case 'amuta':
      return {
        type,
        label: 'עמותה / מלכ"ר',
        description: 'עמותות ומוסדות ללא כוונת רווח — פטורות ממע"מ על פעילותן הרגילה',
        collectsVat: false,
        canDeductInputVat: false,
        mustReport: false,
        reportingFrequency: 'לא חל בפעילות מלכ"רית',
        threshold: null,
        keyPoints: [
          'פטורות ממע"מ על שירותים ללא תמורה',
          'פעילות מסחרית נלווית עשויה להיות חייבת במע"מ',
          'אינן מקזזות מע"מ תשומות',
        ],
        advantages: ['פטור ממע"מ על פעילות מלכ"ר'],
        disadvantages: ['לא מקזזות מע"מ על רכש', 'פעילות עסקית חייבת בדיווח'],
      };

    case 'company':
      return {
        type,
        label: 'חברה בע"מ',
        description: 'חברות רשומות — תמיד עוסק מורשה, ללא תלות במחזור',
        collectsVat: true,
        canDeductInputVat: true,
        mustReport: true,
        reportingFrequency: 'דו-חודשי (או חודשי)',
        threshold: null,
        keyPoints: [
          'חייבת ברישום כעוסק מורשה מהיום הראשון',
          'גובה מע"מ על כל מכירה בישראל',
          'מקזזת מע"מ תשומות',
        ],
        advantages: ['מקבלת החזר מע"מ על כל רכש עסקי', 'מקצועיות עסקית'],
        disadvantages: ['ניהול ספרים כפול', 'דיווח חובה מיידי'],
      };
  }
}

// ============================================================
// VatMode & VatInput / VatResult
// ============================================================

export type VatMode = 'add' | 'extract';

export interface VatInput {
  amount: number;
  mode: VatMode;
  rate?: number; // ברירת מחדל: 0.18
}

export interface VatResult {
  amountWithoutVat: number;
  vatAmount: number;
  amountWithVat: number;
  vatRate: number;
}

export function calculateVat(input: VatInput): VatResult {
  const rate = input.rate ?? VAT_RATES.standard2025;
  const amount = Math.max(0, input.amount);

  if (input.mode === 'add') {
    const vatAmount = amount * rate;
    return {
      amountWithoutVat: amount,
      vatAmount,
      amountWithVat: amount + vatAmount,
      vatRate: rate,
    };
  } else {
    // rate === 0 edge case
    if (rate === 0) {
      return {
        amountWithoutVat: amount,
        vatAmount: 0,
        amountWithVat: amount,
        vatRate: 0,
      };
    }
    const amountWithoutVat = amount / (1 + rate);
    const vatAmount = amount - amountWithoutVat;
    return {
      amountWithoutVat,
      vatAmount,
      amountWithVat: amount,
      vatRate: rate,
    };
  }
}

// ============================================================
// הוספת מע"מ (alias בשם ברור)
// ============================================================

export function calculateAddVat(netAmount: number, rate = VAT_RATES.standard2025): VatResult {
  return calculateVat({ amount: netAmount, mode: 'add', rate });
}

export function calculateExtractVat(grossAmount: number, rate = VAT_RATES.standard2025): VatResult {
  return calculateVat({ amount: grossAmount, mode: 'extract', rate });
}

// ============================================================
// חישוב נטו מסכום כולל
// ============================================================

export function calculateNetFromTotal(total: number, rate = VAT_RATES.standard2025): {
  net: number;
  vatAmount: number;
  vatRate: number;
  effectiveVatPercent: number;
} {
  const result = calculateExtractVat(total, rate);
  return {
    net: result.amountWithoutVat,
    vatAmount: result.vatAmount,
    vatRate: rate,
    effectiveVatPercent: rate === 0 ? 0 : rate / (1 + rate),
  };
}

// ============================================================
// הנחה לפני/אחרי מע"מ
// ============================================================

export interface DiscountScenario {
  originalNet: number;
  originalGross: number;
  discountPercent: number;
  vatRate: number;
  /** הנחה לפני מע"מ */
  discountBeforeVat: {
    discountAmount: number;
    priceAfterDiscount: number;
    vatOnDiscounted: number;
    finalGross: number;
    totalSaving: number;
  };
  /** הנחה אחרי מע"מ (מחיר בסיס לא משתנה, חוזרים ל-gross) */
  discountAfterVat: {
    discountAmount: number;
    finalGross: number;
    impliedNet: number;
    vatAmount: number;
    totalSaving: number;
  };
}

export function calculateDiscountScenario(
  netAmount: number,
  discountPercent: number,
  rate = VAT_RATES.standard2025,
): DiscountScenario {
  const originalGross = netAmount * (1 + rate);
  const discountFraction = discountPercent / 100;

  // הנחה לפני מע"מ
  const discountedNet = netAmount * (1 - discountFraction);
  const vatOnDiscounted = discountedNet * rate;
  const finalGrossBeforeDiscount = discountedNet + vatOnDiscounted;

  // הנחה אחרי מע"מ
  const discountOnGross = originalGross * discountFraction;
  const finalGrossAfterDiscount = originalGross - discountOnGross;
  const impliedNet = finalGrossAfterDiscount / (1 + rate);
  const vatAfter = finalGrossAfterDiscount - impliedNet;

  return {
    originalNet: netAmount,
    originalGross,
    discountPercent,
    vatRate: rate,
    discountBeforeVat: {
      discountAmount: netAmount * discountFraction,
      priceAfterDiscount: discountedNet,
      vatOnDiscounted,
      finalGross: finalGrossBeforeDiscount,
      totalSaving: originalGross - finalGrossBeforeDiscount,
    },
    discountAfterVat: {
      discountAmount: discountOnGross,
      finalGross: finalGrossAfterDiscount,
      impliedNet,
      vatAmount: vatAfter,
      totalSaving: discountOnGross,
    },
  };
}

// ============================================================
// יבוא בינלאומי — מכס + מע"מ
// ============================================================

export interface ImportVatInput {
  goodsValueUSD: number;
  exchangeRateILS: number; // שקלים לדולר
  customsDutyPercent: number; // מכס (%)
  purchaseTaxPercent?: number; // מס קנייה (%)
  vatRate?: number;
}

export interface ImportVatResult {
  goodsValueILS: number;
  customsDuty: number;
  purchaseTax: number;
  vatBase: number; // בסיס חישוב מע"מ (שווי + מכס + מס קנייה)
  vatAmount: number;
  totalLandedCost: number;
  effectiveTaxRate: number; // אחוז מס אפקטיבי
  breakdown: { label: string; amount: number; percent: number }[];
}

export function calculateImportVat(input: ImportVatInput): ImportVatResult {
  const rate = input.vatRate ?? VAT_RATES.standard2025;
  const goodsValueILS = input.goodsValueUSD * input.exchangeRateILS;
  const customsDuty = goodsValueILS * (input.customsDutyPercent / 100);
  const purchaseTax = goodsValueILS * ((input.purchaseTaxPercent ?? 0) / 100);
  const vatBase = goodsValueILS + customsDuty + purchaseTax;
  const vatAmount = vatBase * rate;
  const totalLandedCost = goodsValueILS + customsDuty + purchaseTax + vatAmount;
  const effectiveTaxRate = (totalLandedCost - goodsValueILS) / goodsValueILS;

  const breakdown = [
    {
      label: 'שווי סחורה',
      amount: goodsValueILS,
      percent: (goodsValueILS / totalLandedCost) * 100,
    },
    {
      label: 'מכס',
      amount: customsDuty,
      percent: (customsDuty / totalLandedCost) * 100,
    },
    {
      label: 'מס קנייה',
      amount: purchaseTax,
      percent: (purchaseTax / totalLandedCost) * 100,
    },
    {
      label: `מע"מ (${(rate * 100).toFixed(0)}%)`,
      amount: vatAmount,
      percent: (vatAmount / totalLandedCost) * 100,
    },
  ].filter((b) => b.amount > 0);

  return {
    goodsValueILS,
    customsDuty,
    purchaseTax,
    vatBase,
    vatAmount,
    totalLandedCost,
    effectiveTaxRate,
    breakdown,
  };
}

// ============================================================
// דוח דו-חודשי (תקופת מע"מ)
// ============================================================

export interface InvoiceItem {
  id: string;
  description: string;
  amount: number;     // סכום ללא מע"מ
  vatRate: number;    // שיעור (0, 0.18 וכו')
  type: 'output' | 'input'; // עסקאות / תשומות
}

export interface BimonthlyReportInput {
  invoices: InvoiceItem[];
  /** מחזור שנתי עד כה (לבדיקת חריגה מתקרת עוסק פטור) */
  annualRevenueToDate?: number;
}

export interface BimonthlyReportResult {
  /** מע"מ עסקאות (Output VAT) */
  outputVat: number;
  /** סה"כ עסקאות ללא מע"מ */
  outputBase: number;
  /** סה"כ עסקאות כולל מע"מ */
  outputGross: number;

  /** מע"מ תשומות (Input VAT) */
  inputVat: number;
  /** סה"כ תשומות ללא מע"מ */
  inputBase: number;

  /** לתשלום (+) או להחזר (-) */
  netVatDue: number;
  isRefund: boolean;

  /** ריכוז לפי שיעור מע"מ */
  byRate: {
    rate: number;
    outputBase: number;
    outputVat: number;
    inputBase: number;
    inputVat: number;
  }[];

  /** אזהרה על חריגה מתקרה */
  exemptThresholdWarning: boolean;
  projectedAnnualRevenue: number;

  /** רשימת חשבוניות מסוכמות */
  invoiceSummary: {
    outputs: InvoiceItem[];
    inputs: InvoiceItem[];
  };
}

export function calculateBimonthlyReport(input: BimonthlyReportInput): BimonthlyReportResult {
  const outputs = input.invoices.filter((i) => i.type === 'output');
  const inputs = input.invoices.filter((i) => i.type === 'input');

  const outputBase = outputs.reduce((s, i) => s + i.amount, 0);
  const outputVat = outputs.reduce((s, i) => s + i.amount * i.vatRate, 0);
  const outputGross = outputBase + outputVat;

  const inputBase = inputs.reduce((s, i) => s + i.amount, 0);
  const inputVat = inputs.reduce((s, i) => s + i.amount * i.vatRate, 0);

  const netVatDue = outputVat - inputVat;

  // ריכוז לפי שיעור
  const ratesSet = new Set([...outputs.map((i) => i.vatRate), ...inputs.map((i) => i.vatRate)]);
  const byRate = Array.from(ratesSet)
    .sort((a, b) => b - a)
    .map((rate) => {
      const rateOutputs = outputs.filter((i) => i.vatRate === rate);
      const rateInputs = inputs.filter((i) => i.vatRate === rate);
      return {
        rate,
        outputBase: rateOutputs.reduce((s, i) => s + i.amount, 0),
        outputVat: rateOutputs.reduce((s, i) => s + i.amount * rate, 0),
        inputBase: rateInputs.reduce((s, i) => s + i.amount, 0),
        inputVat: rateInputs.reduce((s, i) => s + i.amount * rate, 0),
      };
    });

  // אזהרה: חריגה מתקרת עוסק פטור
  const annualToDate = input.annualRevenueToDate ?? 0;
  const projectedAnnualRevenue = annualToDate + outputBase;
  const exemptThresholdWarning = projectedAnnualRevenue > EXEMPT_THRESHOLD_2026;

  return {
    outputVat,
    outputBase,
    outputGross,
    inputVat,
    inputBase,
    netVatDue,
    isRefund: netVatDue < 0,
    byRate,
    exemptThresholdWarning,
    projectedAnnualRevenue,
    invoiceSummary: { outputs, inputs },
  };
}

// ============================================================
// השוואת שנים: 2024 (17%) vs 2025+ (18%)
// ============================================================

export interface YearComparisonResult {
  netAmount: number;
  year2024: {
    vatRate: number;
    vatAmount: number;
    grossAmount: number;
  };
  year2025plus: {
    vatRate: number;
    vatAmount: number;
    grossAmount: number;
  };
  difference: {
    vatAmountDiff: number;
    grossAmountDiff: number;
    percentIncrease: number;
  };
  annualImpact: {
    /** אם מחזור שנתי נתון — השפעה שנתית */
    annualRevenue: number;
    extraVatAnnual: number;
    extraCostToConsumer: number;
  };
}

export function calculateYearComparison(
  netAmount: number,
  annualRevenue = 0,
): YearComparisonResult {
  const vat2024 = calculateAddVat(netAmount, VAT_RATES.standard2024);
  const vat2025 = calculateAddVat(netAmount, VAT_RATES.standard2025);

  const vatDiff = vat2025.vatAmount - vat2024.vatAmount;
  const grossDiff = vat2025.amountWithVat - vat2024.amountWithVat;
  const percentIncrease = vat2024.amountWithVat > 0
    ? ((vat2025.amountWithVat - vat2024.amountWithVat) / vat2024.amountWithVat) * 100
    : 0;

  // חישוב השפעה שנתית (על מחזור שנתי)
  const annualVat2024 = annualRevenue * VAT_RATES.standard2024;
  const annualVat2025 = annualRevenue * VAT_RATES.standard2025;
  const extraVatAnnual = annualVat2025 - annualVat2024;

  return {
    netAmount,
    year2024: {
      vatRate: VAT_RATES.standard2024,
      vatAmount: vat2024.vatAmount,
      grossAmount: vat2024.amountWithVat,
    },
    year2025plus: {
      vatRate: VAT_RATES.standard2025,
      vatAmount: vat2025.vatAmount,
      grossAmount: vat2025.amountWithVat,
    },
    difference: {
      vatAmountDiff: vatDiff,
      grossAmountDiff: grossDiff,
      percentIncrease,
    },
    annualImpact: {
      annualRevenue,
      extraVatAnnual,
      extraCostToConsumer: annualRevenue * (1 + VAT_RATES.standard2025) - annualRevenue * (1 + VAT_RATES.standard2024),
    },
  };
}

// ============================================================
// כללים ענפיים
// ============================================================

export type IndustryVatKey =
  | 'standard'
  | 'export'
  | 'tourism'
  | 'eilat'
  | 'agriculture'
  | 'financial'
  | 'real-estate-residential'
  | 'real-estate-commercial'
  | 'npo';

export interface IndustryVatRule {
  key: IndustryVatKey;
  label: string;
  vatRate: number;
  category: 'standard' | 'zero' | 'exempt';
  description: string;
  examples: string[];
  notes: string[];
}

export const INDUSTRY_VAT_RULES: Record<IndustryVatKey, IndustryVatRule> = {
  standard: {
    key: 'standard',
    label: 'עסק רגיל (18%)',
    vatRate: 0.18,
    category: 'standard',
    description: 'רוב העסקים בישראל כפופים לשיעור מע"מ הרגיל של 18%',
    examples: ['מסחר', 'שירותים', 'תוכנה', 'יעוץ', 'בנייה', 'מסעדות'],
    notes: ['שיעור זה חל על כל עסקה שלא מוחרגת במפורש בחוק'],
  },
  export: {
    key: 'export',
    label: 'יצוא (0%)',
    vatRate: 0,
    category: 'zero',
    description: 'יצוא טובין ושירותים מחוץ לישראל — שיעור מע"מ אפס',
    examples: ['מכירת מוצרים לחו"ל', 'שירותי תוכנה ללקוח זר', 'ייעוץ לחברה זרה'],
    notes: [
      'ניתן לקזז מע"מ תשומות על רכש ישראלי',
      'יש להוכיח שהשירות ניתן לחו"ל (חוזה, העברת כסף מחוץ לישראל)',
      'שירות לחברה זרה עם נוכחות בישראל עשוי להיות חייב ב-18%',
    ],
  },
  tourism: {
    key: 'tourism',
    label: 'תיירות (0%)',
    vatRate: 0,
    category: 'zero',
    description: 'שירותים לתיירים זרים — לרוב פטורים ממע"מ',
    examples: ['מלונות לתיירים', 'סיורים לתיירים זרים', 'השכרת רכב לתייר'],
    notes: [
      'תחולה על תיירים שאינם תושבי ישראל',
      'דרישות תיעוד מחמירות (דרכון, כרטיס אשראי זר)',
      'חשוב לוודא עם יועץ מס את התנאים המדויקים',
    ],
  },
  eilat: {
    key: 'eilat',
    label: 'אילת (0%)',
    vatRate: 0,
    category: 'zero',
    description: 'מכירות ושירותים באזור אילת — פטורים ממע"מ על פי חוק',
    examples: ['מסחר קמעונאי באילת', 'שירותי בתי מלון באילת', 'ייצור תעשייתי באילת'],
    notes: [
      'הפטור חל רק על עסקות שבוצעו פיזית באילת',
      'ייבוא טובין לאילת — פטור ממסי ייבוא',
      'עסק שפועל גם מחוץ לאילת חייב להפריד בין הפעילויות',
    ],
  },
  agriculture: {
    key: 'agriculture',
    label: 'חקלאות',
    vatRate: 0.18,
    category: 'standard',
    description: 'חקלאים ומגדלים — חייבים במע"מ בשיעור רגיל, אך עם כללי רישום מיוחדים',
    examples: ['מכירת פירות וירקות', 'גידול בהמות', 'דיג'],
    notes: [
      'חקלאי מורשה: חייב ב-18% כרגיל',
      'חקלאי פטור: פטור מגביית מע"מ עד תקרת 120,000 ₪',
      'עסקאות בין חקלאים עשויות להיות פטורות ממע"מ',
    ],
  },
  financial: {
    key: 'financial',
    label: 'שירותים פיננסיים',
    vatRate: 0,
    category: 'exempt',
    description: 'שירותים פיננסיים רבים פטורים ממע"מ (פטור, לא אפס)',
    examples: ['ביטוח', 'הלוואות', 'מסחר במניות', 'קרנות נאמנות'],
    notes: [
      'פטור = לא מחייב ולא מקזז מע"מ',
      'בנקים ומבטחים אינם גובים מע"מ על עמלות בנקאיות',
      'ייעוץ פיננסי (רואה חשבון, יועץ מס) — חייב ב-18%',
    ],
  },
  'real-estate-residential': {
    key: 'real-estate-residential',
    label: 'נדל"ן למגורים',
    vatRate: 0,
    category: 'exempt',
    description: 'השכרת דירות למגורים — פטורה ממע"מ',
    examples: ['השכרת דירה לפרטי', 'פנסיון', 'השכרת חדר'],
    notes: [
      'פטור חל על השכרה למגורים בלבד',
      'מכירת דירה בין פרטיים — פטורה ממע"מ',
      'קבלן המוכר דירות חדשות — חייב ב-18%',
      'השכרת דירה לעסק — חייבת ב-18%',
    ],
  },
  'real-estate-commercial': {
    key: 'real-estate-commercial',
    label: 'נדל"ן מסחרי',
    vatRate: 0.18,
    category: 'standard',
    description: 'השכרת ומכירת נדל"ן מסחרי — חייב במע"מ 18%',
    examples: ['השכרת משרד', 'השכרת מחסן', 'מכירת חנות'],
    notes: [
      'יש לגבות מע"מ על כל דמי שכירות',
      'קיזוז מע"מ תשומות על עלויות הנכס',
    ],
  },
  npo: {
    key: 'npo',
    label: 'מלכ"ר / עמותה',
    vatRate: 0,
    category: 'exempt',
    description: 'עמותות ומוסדות ציבוריים — פטורים ממע"מ על פעילות עיקרית',
    examples: ['שירותי חינוך', 'שירותי רווחה', 'מוסדות דת'],
    notes: [
      'פעילות עסקית נלווית עשויה להיות חייבת',
      'אינן מקזזות מע"מ תשומות',
      'חייבות ברישום מיוחד ברשות המסים',
    ],
  },
};

// ============================================================
// מעקב חשבוניות לתקופה (Tracker)
// ============================================================

export interface TrackerSummary {
  totalInvoices: number;
  totalNetAmount: number;
  totalVatAmount: number;
  totalGrossAmount: number;
  averageVatRate: number;
  byType: {
    output: { count: number; netAmount: number; vatAmount: number; grossAmount: number };
    input: { count: number; netAmount: number; vatAmount: number; grossAmount: number };
  };
  netVatPosition: number; // חיובי = לתשלום, שלילי = להחזר
}

export function summarizeInvoices(invoices: InvoiceItem[]): TrackerSummary {
  const outputs = invoices.filter((i) => i.type === 'output');
  const inputs = invoices.filter((i) => i.type === 'input');

  const calcGroup = (items: InvoiceItem[]) => ({
    count: items.length,
    netAmount: items.reduce((s, i) => s + i.amount, 0),
    vatAmount: items.reduce((s, i) => s + i.amount * i.vatRate, 0),
    grossAmount: items.reduce((s, i) => s + i.amount * (1 + i.vatRate), 0),
  });

  const outputStats = calcGroup(outputs);
  const inputStats = calcGroup(inputs);

  const totalNet = outputStats.netAmount + inputStats.netAmount;
  const totalVat = outputStats.vatAmount + inputStats.vatAmount;
  const averageVatRate = totalNet > 0 ? totalVat / totalNet : 0;

  return {
    totalInvoices: invoices.length,
    totalNetAmount: outputStats.netAmount + inputStats.netAmount,
    totalVatAmount: totalVat,
    totalGrossAmount: outputStats.grossAmount + inputStats.grossAmount,
    averageVatRate,
    byType: {
      output: outputStats,
      input: inputStats,
    },
    netVatPosition: outputStats.vatAmount - inputStats.vatAmount,
  };
}
