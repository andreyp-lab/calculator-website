/**
 * מחשבון נקודות זיכוי 2026
 *
 * מקור: רשות המסים, חוזרים מקצועיים
 * שווי נקודה 2026: 242 ₪ חודשי / 2,904 ₪ שנתי
 */

import { CREDIT_POINT_2026 } from '@/lib/constants/tax-2026';

export interface TaxCreditsInput {
  // בסיסי
  isResident: boolean; // תושב ישראל
  gender: 'male' | 'female';
  age: number;

  // מצב משפחתי
  isMarried: boolean;
  isSingleParent: boolean;

  // ילדים (לפי גיל)
  childrenAge0: number; // עד שנה
  childrenAge1to5: number;
  childrenAge6to17: number;
  childrenAge18: number;
  disabledChildren: number;

  // מצבים מיוחדים
  isReleasedSoldier: boolean; // חייל משוחרר (3 שנים אחרי שחרור)
  yearsSinceRelease: number;
  isNewImmigrant: boolean;
  monthsSinceImmigration: number;
  hasBachelorDegree: boolean;
  hasMasterDegree: boolean;
}

export interface CreditPointEntry {
  category: string;
  points: number;
  monthlyValue: number;
  yearlyValue: number;
}

export interface TaxCreditsResult {
  totalPoints: number;
  monthlyValue: number;
  yearlyValue: number;
  breakdown: CreditPointEntry[];
}

export function calculateTaxCredits(input: TaxCreditsInput): TaxCreditsResult {
  const breakdown: CreditPointEntry[] = [];
  const valueOfPoint = CREDIT_POINT_2026.monthly;

  function addCredit(category: string, points: number) {
    if (points > 0) {
      breakdown.push({
        category,
        points,
        monthlyValue: points * valueOfPoint,
        yearlyValue: points * valueOfPoint * 12,
      });
    }
  }

  // נקודות בסיסיות לתושב
  if (input.isResident) {
    addCredit('תושב ישראל (בסיסי)', 2.25);
  }

  // אישה - נקודה נוספת
  if (input.isResident && input.gender === 'female') {
    addCredit('אישה', 0.5);
  }

  // ילדים לפי גיל
  if (input.childrenAge0 > 0) {
    addCredit(
      `ילד בשנת לידתו (×${input.childrenAge0})`,
      input.childrenAge0 * 1.5,
    );
  }
  if (input.childrenAge1to5 > 0) {
    addCredit(
      `ילדים בני 1-5 (×${input.childrenAge1to5})`,
      input.childrenAge1to5 * 2.5,
    );
  }
  if (input.childrenAge6to17 > 0) {
    addCredit(
      `ילדים בני 6-17 (×${input.childrenAge6to17})`,
      input.childrenAge6to17 * 1,
    );
  }
  if (input.childrenAge18 > 0) {
    addCredit(`ילדים בני 18 (×${input.childrenAge18})`, input.childrenAge18 * 0.5);
  }

  // ילדים נכים
  if (input.disabledChildren > 0) {
    addCredit(`ילד נכה (×${input.disabledChildren})`, input.disabledChildren * 1);
  }

  // הורה יחיד
  if (input.isSingleParent) {
    addCredit('הורה יחיד', 1);
  }

  // חייל משוחרר (3 שנים אחרי שחרור)
  if (input.isReleasedSoldier && input.yearsSinceRelease <= 3) {
    addCredit('חייל משוחרר', 2);
  }

  // עולה חדש - שלבים
  if (input.isNewImmigrant) {
    if (input.monthsSinceImmigration <= 18) {
      addCredit('עולה חדש (18 חודשים ראשונים)', 3);
    } else if (input.monthsSinceImmigration <= 30) {
      addCredit('עולה חדש (חודשים 19-30)', 2);
    } else if (input.monthsSinceImmigration <= 54) {
      addCredit('עולה חדש (חודשים 31-54)', 1);
    }
  }

  // תארים אקדמיים (עד שנה)
  if (input.hasBachelorDegree) {
    addCredit('תואר ראשון (שנה אחת)', 1);
  }
  if (input.hasMasterDegree) {
    addCredit('תואר שני (שנה אחת)', 0.5);
  }

  const totalPoints = breakdown.reduce((sum, b) => sum + b.points, 0);

  return {
    totalPoints,
    monthlyValue: totalPoints * valueOfPoint,
    yearlyValue: totalPoints * valueOfPoint * 12,
    breakdown,
  };
}
