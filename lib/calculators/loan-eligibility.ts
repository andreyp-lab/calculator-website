/**
 * בודק זכאות להלוואות בערבות המדינה
 *
 * מבוסס על תקנות הקרן להלוואות בערבות מדינה לעסקים קטנים ובינוניים (חשכ"ל / החשב הכללי).
 * מכסה גם מסלול "חרבות ברזל" עם הקלות לעסקים בצפון/דרום ולמשרתי מילואים.
 *
 * מסלולים עיקריים:
 * 1. עסק בהקמה - עד 500K ₪, 5% ביטחונות
 * 2. עסק קטן (מחזור < 6.25M ₪) - עד 500K ₪, 15% ביטחונות
 * 3. עסק קטן/בינוני (מחזור 6.25M-100M ₪) - עד 8% מהמחזור (תקרה 8M)
 * 4. יצואן - עד 12% מהמחזור (תקרה 12M)
 * 5. תעשייה - עד 15% מהמחזור (תקרה 15M), עד 12 שנים החזר
 * 6. חרבות ברזל - הקלות בביטחונות (5% במקום 15%)
 *
 * תנאי סף לכל המסלולים:
 * - אין הליכים משפטיים תלויים ועומדים
 * - אין חובות לרשויות המס
 * - אין הגבלות על חשבון הבנק או עיקולים
 * - מחזור עד 100M ₪ (מעל זה - לא זכאי)
 *
 * מקור: רשות לחשבונאות והגזברות, https://www.gov.il
 * אומת: 2026-05-03
 */

export type BusinessAge = 'new' | 'under3' | 'over3';
export type AnnualRevenueBand = 'under625' | '625to25m' | '25to100m' | 'over100m';
export type LegalStatus = 'individual' | 'company' | 'partnership' | 'ngo';
export type LoanPurpose =
  | 'workingCapital'
  | 'expansion'
  | 'newBusiness'
  | 'equipment'
  | 'industry';

export interface LoanEligibilityInput {
  // פרטי עסק
  businessAge: BusinessAge;
  annualRevenue: AnnualRevenueBand;
  legalStatus: LegalStatus;

  // תנאי סף - כל אחד מהם מבטל זכאות
  hasLegalProceedings: boolean;
  hasTaxDebt: boolean;
  hasAccountLimitations: boolean;

  // מאפיינים שמשפיעים על המסלול
  loanPurpose: LoanPurpose;
  isInNorth: boolean;
  isExporter: boolean;
  isIndustry: boolean;
  reserveService: boolean;
}

export interface LoanEligibilityResult {
  eligible: boolean;
  /** סכום מקסימלי - ₪ */
  maxLoanAmount: number;
  /** שם המסלול הנבחר */
  route: string;
  /** ביטחונות נדרשים באחוזים */
  securityRequiredPct: number;
  /** ביטחונות בש"ח */
  securityRequiredAmount: number;
  /** תקופת החזר */
  termsLabel: string;
  /** הסבר מפורט */
  message: string;
  /** סיבות לאי-זכאות */
  disqualifiers: string[];
  /** מסלולים נוספים שאפשר להחיל */
  applicableRoutes: string[];
}

export function calculateLoanEligibility(input: LoanEligibilityInput): LoanEligibilityResult {
  const disqualifiers: string[] = [];

  // 1. בדיקת תנאי סף
  if (input.hasLegalProceedings) {
    disqualifiers.push('הליכים משפטיים תלויים ועומדים נגד העסק');
  }
  if (input.hasTaxDebt) {
    disqualifiers.push('חובות לרשויות המס');
  }
  if (input.hasAccountLimitations) {
    disqualifiers.push('הגבלות על חשבון הבנק או עיקולים');
  }
  if (input.annualRevenue === 'over100m') {
    disqualifiers.push('מחזור שנתי מעל 100 מיליון ₪ - לא נכלל בקרן');
  }

  if (disqualifiers.length > 0) {
    return {
      eligible: false,
      maxLoanAmount: 0,
      route: '',
      securityRequiredPct: 0,
      securityRequiredAmount: 0,
      termsLabel: '',
      message:
        'העסק אינו עומד בתנאי הסף של הקרן. נדרש לפעול לפתרון הסוגיות הבאות לפני הגשת בקשה.',
      disqualifiers,
      applicableRoutes: [],
    };
  }

  const applicableRoutes: string[] = [];

  // 2. עסק בהקמה - מסלול קבוע
  if (input.businessAge === 'new') {
    let route = 'עסק בהקמה';
    let securityPct = 5;
    if (input.isInNorth || input.reserveService) {
      route += ' + חרבות ברזל';
      securityPct = 5; // כבר 5%
    }
    applicableRoutes.push(route);
    return {
      eligible: true,
      maxLoanAmount: 500_000,
      route,
      securityRequiredPct: securityPct,
      securityRequiredAmount: 500_000 * (securityPct / 100),
      termsLabel: 'עד 5 שנים החזר, עד 6 חודשי גרייס',
      message:
        'זכאות במסלול עסק בהקמה. ההלוואה ניתנת להוצאות הקמה: ציוד, שיפוצים, הון חוזר ראשוני, שיווק.',
      disqualifiers: [],
      applicableRoutes,
    };
  }

  // 3. עסק קטן (מחזור < 6.25M ₪) - מסלול קבוע 500K
  if (input.annualRevenue === 'under625') {
    let securityPct = 15;
    let route = 'עסק קטן';
    applicableRoutes.push(route);

    if (input.isInNorth || input.reserveService) {
      securityPct = 5;
      route += ' + חרבות ברזל';
      applicableRoutes.push('חרבות ברזל - הקלת ביטחונות');
    }

    return {
      eligible: true,
      maxLoanAmount: 500_000,
      route,
      securityRequiredPct: securityPct,
      securityRequiredAmount: 500_000 * (securityPct / 100),
      termsLabel: 'עד 5 שנים החזר, עד 6 חודשי גרייס',
      message:
        'זכאות במסלול עסק קטן. ההלוואה ניתנת לצורך הון חוזר, הרחבה, או רכישת ציוד.',
      disqualifiers: [],
      applicableRoutes,
    };
  }

  // 4. עסק עם מחזור 6.25M - 100M
  let revenueEstimate = 0;
  if (input.annualRevenue === '625to25m') revenueEstimate = 25_000_000;
  else if (input.annualRevenue === '25to100m') revenueEstimate = 100_000_000;

  // מסלול בסיסי - 8% מהמחזור, תקרה 8M
  let bestAmount = Math.min(revenueEstimate * 0.08, 8_000_000);
  let bestRoute = 'עסק קטן/בינוני';
  let bestTerms = 'עד 5 שנים החזר, עד 6 חודשי גרייס';
  let bestMessage =
    'זכאות במסלול עסק קטן/בינוני. עד 8% מהמחזור השנתי, מקסימום 8 מיליון ₪.';
  applicableRoutes.push(bestRoute);

  // מסלול יצואן - 12% מהמחזור, תקרה 12M
  if (input.isExporter) {
    const exporterAmount = Math.min(revenueEstimate * 0.12, 12_000_000);
    applicableRoutes.push('יצואן');
    if (exporterAmount > bestAmount) {
      bestAmount = exporterAmount;
      bestRoute = 'יצואן';
      bestMessage =
        'זכאות במסלול יצואן (היקף יצוא מינימלי 250K$). עד 12% מהמחזור, מקסימום 12 מיליון ₪.';
    }
  }

  // מסלול תעשייה - 15% מהמחזור, תקרה 15M, 12 שנים
  if (input.isIndustry) {
    const industryAmount = Math.min(revenueEstimate * 0.15, 15_000_000);
    applicableRoutes.push('תעשייה');
    if (industryAmount > bestAmount) {
      bestAmount = industryAmount;
      bestRoute = 'תעשייה';
      bestTerms = 'עד 12 שנים החזר, עד 6 חודשי גרייס';
      bestMessage =
        'זכאות במסלול תעשייה. עד 15% מהמחזור, מקסימום 15 מיליון ₪. תקופת החזר ארוכה במיוחד למימון השקעות הון.';
    }
  }

  // חרבות ברזל - הקלת ביטחונות
  let securityPct = 15;
  if (input.isInNorth || input.reserveService) {
    securityPct = 5;
    bestRoute += ' + חרבות ברזל';
    bestMessage += ' זכאי גם להקלות במסגרת מסלול חרבות ברזל.';
    applicableRoutes.push('חרבות ברזל - הקלת ביטחונות');
  }

  return {
    eligible: true,
    maxLoanAmount: bestAmount,
    route: bestRoute,
    securityRequiredPct: securityPct,
    securityRequiredAmount: bestAmount * (securityPct / 100),
    termsLabel: bestTerms,
    message: bestMessage,
    disqualifiers: [],
    applicableRoutes,
  };
}
