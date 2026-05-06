/**
 * DuPont Analysis Engine
 *
 * פירוק ה-ROE לרכיביו לזיהוי מקור הביצועים.
 *
 * 3-Factor:
 *   ROE = NPM × Asset Turnover × Equity Multiplier
 *       = (Net Income/Revenue) × (Revenue/Assets) × (Assets/Equity)
 *
 * 5-Factor (מורחב):
 *   ROE = Tax Burden × Interest Burden × Operating Margin × Asset Turnover × Equity Multiplier
 *       = (NI/EBT) × (EBT/EBIT) × (EBIT/Revenue) × (Revenue/Assets) × (Assets/Equity)
 *
 * המודל ה-5-Factor מאפשר להפריד את ההשפעה של:
 * - מס (Tax Burden)
 * - מינוף פיננסי על הוצאות מימון (Interest Burden)
 * - יעילות תפעולית (Operating Margin)
 * - יעילות שימוש בנכסים (Asset Turnover)
 * - מינוף הון (Equity Multiplier)
 */

export interface DuPontInput {
  revenue: number;
  netProfit: number;
  ebit: number; // = operatingProfit
  ebt: number; // = pre-tax profit (EBIT - interest expense)
  totalAssets: number;
  totalEquity: number;
}

export interface DuPontComponent {
  value: number;
  label: string;
  formula: string;
  interpretation: string;
}

export interface DuPontResult {
  threeFactor: {
    roe: number;
    netProfitMargin: DuPontComponent;
    assetTurnover: DuPontComponent;
    equityMultiplier: DuPontComponent;
  };
  fiveFactor: {
    roe: number;
    taxBurden: DuPontComponent;
    interestBurden: DuPontComponent;
    operatingMargin: DuPontComponent;
    assetTurnover: DuPontComponent;
    equityMultiplier: DuPontComponent;
  };
  /** ROE הישיר לבדיקת עקביות */
  directROE: number;
  /** מקור עיקרי לתשואה */
  primaryDriver: 'profitability' | 'efficiency' | 'leverage';
  insights: string[];
}

const safeDiv = (n: number, d: number, fallback = 0): number =>
  Math.abs(d) > 0.001 ? n / d : fallback;

export function calculateDuPont(input: DuPontInput): DuPontResult {
  const { revenue, netProfit, ebit, ebt, totalAssets, totalEquity } = input;

  // 3-Factor components
  const npm = safeDiv(netProfit, revenue);
  const at = safeDiv(revenue, totalAssets);
  const em = safeDiv(totalAssets, totalEquity);
  const roe3F = npm * at * em;

  // 5-Factor components
  const taxBurden = safeDiv(netProfit, ebt, 0.77); // ברירת מחדל 23% מס
  const interestBurden = safeDiv(ebt, ebit, 1);
  const operatingMargin = safeDiv(ebit, revenue);
  const roe5F = taxBurden * interestBurden * operatingMargin * at * em;

  const directROE = safeDiv(netProfit, totalEquity);

  // Identify primary driver
  // נשווה לסטנדרט: NPM 8%, AT 1, EM 2 → ROE 16%
  const npmRatio = npm / 0.08; // יחסית לסטנדרט
  const atRatio = at / 1.0;
  const emRatio = em / 2.0;

  let primaryDriver: 'profitability' | 'efficiency' | 'leverage';
  if (npmRatio > atRatio && npmRatio > emRatio) primaryDriver = 'profitability';
  else if (atRatio > emRatio) primaryDriver = 'efficiency';
  else primaryDriver = 'leverage';

  const insights: string[] = [];

  // Insights based on components
  if (em > 4) {
    insights.push(`⚠️ מכפיל הון גבוה מאוד (${em.toFixed(2)}x) — ROE מבוסס על מינוף מסוכן`);
  } else if (em > 3) {
    insights.push(`📊 מכפיל הון גבוה (${em.toFixed(2)}x) — חלק מ-ROE מגיע ממינוף`);
  }

  if (npm > 0.15) {
    insights.push(`✅ רווחיות גבוהה (${(npm * 100).toFixed(1)}%) — יתרון תחרותי`);
  } else if (npm < 0.03 && npm > 0) {
    insights.push(`⚠️ רווחיות נמוכה (${(npm * 100).toFixed(1)}%) — לחץ על מרווחים`);
  } else if (npm < 0) {
    insights.push(`🚨 רווחיות שלילית — החברה מפסידה`);
  }

  if (at > 1.5) {
    insights.push(`✅ ניצול נכסים יעיל מאוד (מחזור ${at.toFixed(2)})`);
  } else if (at < 0.5) {
    insights.push(`⚠️ ניצול נכסים נמוך — נכסים לא מייצרים מספיק הכנסות`);
  }

  if (taxBurden < 0.6) {
    insights.push(`💰 נטל מס גבוה (${((1 - taxBurden) * 100).toFixed(0)}%) — בחן תכנון מס`);
  }

  if (interestBurden < 0.7) {
    insights.push(
      `💸 נטל ריבית גבוה — ${((1 - interestBurden) * 100).toFixed(0)}% מהרווח התפעולי הולך לריבית`,
    );
  }

  if (Math.abs(roe3F - directROE) > 0.01) {
    insights.push(`⚠️ פער בין ROE מחושב ל-DuPont — בדוק נתונים`);
  }

  return {
    threeFactor: {
      roe: roe3F,
      netProfitMargin: {
        value: npm,
        label: 'מרווח רווח נקי (NPM)',
        formula: 'רווח נקי / הכנסות',
        interpretation: 'רווחיות - כמה רווח על כל ש"ח הכנסות',
      },
      assetTurnover: {
        value: at,
        label: 'מחזור נכסים (AT)',
        formula: 'הכנסות / סך נכסים',
        interpretation: 'יעילות - כמה הכנסות על כל ש"ח נכסים',
      },
      equityMultiplier: {
        value: em,
        label: 'מכפיל הון (EM)',
        formula: 'סך נכסים / הון עצמי',
        interpretation: 'מינוף - כמה נכסים על כל ש"ח הון',
      },
    },
    fiveFactor: {
      roe: roe5F,
      taxBurden: {
        value: taxBurden,
        label: 'נטל מס',
        formula: 'רווח נקי / רווח לפני מס',
        interpretation: `${(taxBurden * 100).toFixed(0)}% מהרווח לפני מס נשאר אחרי מס`,
      },
      interestBurden: {
        value: interestBurden,
        label: 'נטל ריבית',
        formula: 'רווח לפני מס / רווח תפעולי',
        interpretation: `${(interestBurden * 100).toFixed(0)}% מהרווח התפעולי נשאר אחרי ריבית`,
      },
      operatingMargin: {
        value: operatingMargin,
        label: 'מרווח תפעולי',
        formula: 'רווח תפעולי / הכנסות',
        interpretation: 'יעילות תפעולית טהורה',
      },
      assetTurnover: {
        value: at,
        label: 'מחזור נכסים',
        formula: 'הכנסות / סך נכסים',
        interpretation: 'יעילות שימוש בנכסים',
      },
      equityMultiplier: {
        value: em,
        label: 'מכפיל הון',
        formula: 'סך נכסים / הון עצמי',
        interpretation: 'רמת מינוף',
      },
    },
    directROE,
    primaryDriver,
    insights,
  };
}

/**
 * השוואת DuPont בין שתי תקופות.
 * מאפשר להבין מה גרם לשינוי ב-ROE.
 */
export function compareDuPont(current: DuPontResult, previous: DuPontResult) {
  const roeChange = current.threeFactor.roe - previous.threeFactor.roe;

  // נפרק את השינוי ל-3 גורמים
  const npmContribution =
    (current.threeFactor.netProfitMargin.value - previous.threeFactor.netProfitMargin.value) *
    previous.threeFactor.assetTurnover.value *
    previous.threeFactor.equityMultiplier.value;

  const atContribution =
    current.threeFactor.netProfitMargin.value *
    (current.threeFactor.assetTurnover.value - previous.threeFactor.assetTurnover.value) *
    previous.threeFactor.equityMultiplier.value;

  const emContribution =
    current.threeFactor.netProfitMargin.value *
    current.threeFactor.assetTurnover.value *
    (current.threeFactor.equityMultiplier.value - previous.threeFactor.equityMultiplier.value);

  return {
    roeChange,
    npmContribution,
    atContribution,
    emContribution,
    primaryChangeDriver:
      Math.abs(npmContribution) > Math.abs(atContribution) &&
      Math.abs(npmContribution) > Math.abs(emContribution)
        ? 'profitability'
        : Math.abs(atContribution) > Math.abs(emContribution)
          ? 'efficiency'
          : 'leverage',
  };
}
