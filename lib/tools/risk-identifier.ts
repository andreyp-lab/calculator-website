/**
 * Risk Identifier Engine
 *
 * זיהוי וקיטלוג סיכונים פיננסיים לחברה ע"פ רמת חומרה:
 * - Critical: דורש פעולה מיידית
 * - High: דורש פעולה בטווח קצר
 * - Medium: דורש מעקב
 * - Low: לא דחוף
 *
 * הסיכונים מקובצים לפי תחום: נזילות, מינוף, רווחיות, יעילות, תזרים.
 */

import type { FinancialRatios, ZScoreResult } from './types';

export type RiskLevel = 'critical' | 'high' | 'medium' | 'low';
export type RiskCategory =
  | 'liquidity'
  | 'leverage'
  | 'profitability'
  | 'efficiency'
  | 'coverage'
  | 'bankruptcy';

export interface RiskItem {
  type: string;
  level: RiskLevel;
  category: RiskCategory;
  title: string;
  description: string;
  recommendation: string;
  metric?: { name: string; value: number; threshold: number };
}

export interface RiskAssessmentResult {
  critical: RiskItem[];
  high: RiskItem[];
  medium: RiskItem[];
  low: RiskItem[];
  summary: {
    criticalCount: number;
    highCount: number;
    mediumCount: number;
    lowCount: number;
    overallRiskScore: number; // 0-100, גבוה יותר = יותר סיכון
    overallRiskLevel: 'נמוך' | 'בינוני' | 'בינוני-גבוה' | 'גבוה' | 'קריטי';
  };
}

interface RiskInput {
  ratios: FinancialRatios;
  zScore: ZScoreResult;
  /** רווח נקי שלילי? */
  hasLoss: boolean;
}

export function identifyRisks(input: RiskInput): RiskAssessmentResult {
  const { ratios, zScore, hasLoss } = input;
  const risks: RiskItem[] = [];

  // ============= BANKRUPTCY RISKS =============
  if (zScore.zone === 'distress') {
    risks.push({
      type: 'bankruptcy_risk',
      level: 'critical',
      category: 'bankruptcy',
      title: 'סיכון פשיטת רגל',
      description: `Z-Score של ${zScore.score.toFixed(2)} מצביע על סיכון משמעותי לפשיטת רגל בתוך שנתיים`,
      recommendation: 'נדרשת התערבות מיידית - הזרמת הון, מחזור חוב, תוכנית הבראה',
      metric: { name: 'Z-Score', value: zScore.score, threshold: 1.81 },
    });
  } else if (zScore.zone === 'grey') {
    risks.push({
      type: 'bankruptcy_warning',
      level: 'medium',
      category: 'bankruptcy',
      title: 'אזור אפור (Z-Score)',
      description: `Z-Score של ${zScore.score.toFixed(2)} - יציבות פיננסית לא ודאית`,
      recommendation: 'מומלץ לעקוב מקרוב ולשפר יחסי מינוף ונזילות',
      metric: { name: 'Z-Score', value: zScore.score, threshold: 2.99 },
    });
  }

  // ============= COVERAGE / DEBT SERVICE RISKS =============
  if (ratios.dscr < 1) {
    risks.push({
      type: 'debt_service',
      level: 'critical',
      category: 'coverage',
      title: 'חוסר יכולת לשרת חוב',
      description: `DSCR של ${ratios.dscr.toFixed(2)} מתחת ל-1 - החברה לא מכסה את תשלומי החוב`,
      recommendation: 'מחזור חוב, גיוס הון, או הגדלת הכנסות בהקדם',
      metric: { name: 'DSCR', value: ratios.dscr, threshold: 1.0 },
    });
  } else if (ratios.dscr < 1.25) {
    risks.push({
      type: 'tight_debt_service',
      level: 'high',
      category: 'coverage',
      title: 'יכולת החזר חוב על הגבול',
      description: `DSCR של ${ratios.dscr.toFixed(2)} - מרווח בטחון דק`,
      recommendation: 'שיפור התזרים או הקטנת נטל החוב',
      metric: { name: 'DSCR', value: ratios.dscr, threshold: 1.25 },
    });
  }

  if (ratios.interestCoverage < 1.5 && ratios.interestCoverage < 99) {
    risks.push({
      type: 'low_interest_coverage',
      level: 'high',
      category: 'coverage',
      title: 'כיסוי ריבית נמוך',
      description: `יחס כיסוי ריבית ${ratios.interestCoverage.toFixed(2)} - נטל ריבית כבד`,
      recommendation: 'מחזור חוב לריבית נמוכה יותר',
      metric: { name: 'ICR', value: ratios.interestCoverage, threshold: 1.5 },
    });
  }

  // ============= LIQUIDITY RISKS =============
  if (ratios.currentRatio < 0.8) {
    risks.push({
      type: 'liquidity_crisis',
      level: 'critical',
      category: 'liquidity',
      title: 'משבר נזילות',
      description: `יחס שוטף ${ratios.currentRatio.toFixed(2)} - לא מספיק נכסים לכיסוי חובות שוטפים`,
      recommendation: 'גיוס מזומנים מיידי או קו אשראי חירום',
      metric: { name: 'Current Ratio', value: ratios.currentRatio, threshold: 0.8 },
    });
  } else if (ratios.currentRatio < 1) {
    risks.push({
      type: 'liquidity_pressure',
      level: 'high',
      category: 'liquidity',
      title: 'לחץ נזילות',
      description: `יחס שוטף ${ratios.currentRatio.toFixed(2)} - קושי לעמוד בהתחייבויות שוטפות`,
      recommendation: 'שיפור גביית לקוחות והארכת אשראי ספקים',
      metric: { name: 'Current Ratio', value: ratios.currentRatio, threshold: 1.0 },
    });
  } else if (ratios.currentRatio < 1.2) {
    risks.push({
      type: 'tight_liquidity',
      level: 'medium',
      category: 'liquidity',
      title: 'נזילות הדוקה',
      description: `יחס שוטף ${ratios.currentRatio.toFixed(2)} - לא מומלץ לטווח ארוך`,
      recommendation: 'בנייה הדרגתית של רזרבת מזומנים',
      metric: { name: 'Current Ratio', value: ratios.currentRatio, threshold: 1.2 },
    });
  }

  if (ratios.quickRatio < 0.5) {
    risks.push({
      type: 'inventory_dependency',
      level: 'medium',
      category: 'liquidity',
      title: 'תלות גבוהה במלאי',
      description: `יחס מהיר ${ratios.quickRatio.toFixed(2)} - תלות באפשרות מימוש מלאי`,
      recommendation: 'בחינת מדיניות מלאי וזרימה',
      metric: { name: 'Quick Ratio', value: ratios.quickRatio, threshold: 0.5 },
    });
  }

  // ============= LEVERAGE RISKS =============
  if (ratios.debtToEquity > 4) {
    risks.push({
      type: 'extreme_leverage',
      level: 'critical',
      category: 'leverage',
      title: 'מינוף קיצוני',
      description: `יחס חוב להון ${ratios.debtToEquity.toFixed(2)} - חשיפה גבוהה לסיכון`,
      recommendation: 'הקטנת חוב או הגדלת הון עצמי בהקדם',
      metric: { name: 'D/E', value: ratios.debtToEquity, threshold: 4 },
    });
  } else if (ratios.debtToEquity > 2.5) {
    risks.push({
      type: 'high_leverage',
      level: 'high',
      category: 'leverage',
      title: 'מינוף גבוה',
      description: `יחס חוב להון ${ratios.debtToEquity.toFixed(2)} - מעל הנורמה`,
      recommendation: 'תכנון הקטנת חוב לאורך זמן',
      metric: { name: 'D/E', value: ratios.debtToEquity, threshold: 2.5 },
    });
  }

  if (ratios.debtToAssets > 0.7) {
    risks.push({
      type: 'over_leveraged_assets',
      level: 'high',
      category: 'leverage',
      title: 'נכסים ממומנים בעיקר בחוב',
      description: `${(ratios.debtToAssets * 100).toFixed(0)}% מהנכסים ממומנים בחוב`,
      recommendation: 'פגיעות לעליית ריבית ולשינויי שווי נכסים',
      metric: { name: 'D/A', value: ratios.debtToAssets, threshold: 0.7 },
    });
  }

  // ============= PROFITABILITY RISKS =============
  if (hasLoss) {
    risks.push({
      type: 'operating_loss',
      level: 'critical',
      category: 'profitability',
      title: 'פעילות הפסדית',
      description: 'החברה מפסידה - רווח נקי שלילי',
      recommendation: 'בחינה דחופה של מבנה עלויות והכנסות',
    });
  } else if (ratios.netProfitMargin < 2) {
    risks.push({
      type: 'thin_margins',
      level: 'medium',
      category: 'profitability',
      title: 'מרווחים דקים',
      description: `מרווח רווח נקי ${ratios.netProfitMargin.toFixed(1)}% - לחץ על רווחיות`,
      recommendation: 'בחינת תמחור ועלויות',
      metric: { name: 'NPM', value: ratios.netProfitMargin, threshold: 2 },
    });
  }

  if (ratios.returnOnEquity < 5 && !hasLoss) {
    risks.push({
      type: 'low_roe',
      level: 'medium',
      category: 'profitability',
      title: 'תשואה נמוכה למשקיעים',
      description: `ROE של ${ratios.returnOnEquity.toFixed(1)}% - תשואה לא אטרקטיבית`,
      recommendation: 'שיפור רווחיות או אופטימיזציית מבנה הון',
      metric: { name: 'ROE', value: ratios.returnOnEquity, threshold: 5 },
    });
  }

  // ============= EFFICIENCY RISKS =============
  if (ratios.ccc > 120) {
    risks.push({
      type: 'severe_working_capital',
      level: 'high',
      category: 'efficiency',
      title: 'הון חוזר כלוא לתקופה ארוכה',
      description: `CCC של ${ratios.ccc.toFixed(0)} ימים - הון תקוע מדי זמן רב`,
      recommendation: 'קיצור ימי לקוחות והקטנת מלאי',
      metric: { name: 'CCC', value: ratios.ccc, threshold: 120 },
    });
  } else if (ratios.ccc > 90) {
    risks.push({
      type: 'long_working_capital',
      level: 'medium',
      category: 'efficiency',
      title: 'מחזור הון חוזר ארוך',
      description: `CCC של ${ratios.ccc.toFixed(0)} ימים`,
      recommendation: 'אופטימיזציה של גבייה, מלאי וספקים',
      metric: { name: 'CCC', value: ratios.ccc, threshold: 90 },
    });
  }

  if (ratios.dso > 90) {
    risks.push({
      type: 'slow_collection',
      level: 'high',
      category: 'efficiency',
      title: 'גבייה איטית מאוד',
      description: `${ratios.dso.toFixed(0)} ימי גבייה - חובות לקוחות גדלים`,
      recommendation: 'הידוק מדיניות אשראי ושיפור גבייה',
      metric: { name: 'DSO', value: ratios.dso, threshold: 90 },
    });
  }

  if (ratios.dio > 120) {
    risks.push({
      type: 'slow_inventory',
      level: 'medium',
      category: 'efficiency',
      title: 'מלאי איטי',
      description: `${ratios.dio.toFixed(0)} ימי מלאי - סיכון להתיישנות`,
      recommendation: 'בחינת מדיניות הזמנות וזרימת מלאי',
      metric: { name: 'DIO', value: ratios.dio, threshold: 120 },
    });
  }

  if (ratios.assetTurnover < 0.5) {
    risks.push({
      type: 'asset_inefficiency',
      level: 'low',
      category: 'efficiency',
      title: 'ניצול נכסים נמוך',
      description: `מחזור נכסים ${ratios.assetTurnover.toFixed(2)} - נכסים לא פרודוקטיביים`,
      recommendation: 'בחינת מימוש נכסים לא פעילים',
      metric: { name: 'AT', value: ratios.assetTurnover, threshold: 0.5 },
    });
  }

  // Categorize and calculate scores
  const critical = risks.filter((r) => r.level === 'critical');
  const high = risks.filter((r) => r.level === 'high');
  const medium = risks.filter((r) => r.level === 'medium');
  const low = risks.filter((r) => r.level === 'low');

  const overallRiskScore = Math.min(
    100,
    critical.length * 25 + high.length * 12 + medium.length * 5 + low.length * 2,
  );

  let overallRiskLevel: RiskAssessmentResult['summary']['overallRiskLevel'];
  if (critical.length > 0) overallRiskLevel = 'קריטי';
  else if (high.length >= 2) overallRiskLevel = 'גבוה';
  else if (high.length >= 1 || medium.length >= 3) overallRiskLevel = 'בינוני-גבוה';
  else if (medium.length >= 1) overallRiskLevel = 'בינוני';
  else overallRiskLevel = 'נמוך';

  return {
    critical,
    high,
    medium,
    low,
    summary: {
      criticalCount: critical.length,
      highCount: high.length,
      mediumCount: medium.length,
      lowCount: low.length,
      overallRiskScore,
      overallRiskLevel,
    },
  };
}
