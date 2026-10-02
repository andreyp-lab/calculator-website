import type { TaxRefundYear } from './tax-refund';

/**
 * נקודות לילד להורה נשוי לאורך השנה, ללא דחיית נקודה משנת הלידה.
 * גיל הוא הגיל שמלא לילד בשנת המס, לא הגיל היום; אין חלוקה לפי חודש לידה.
 * מקור 2024–2025: הוראת ביצוע 7/2025, טבלת סעיף 3.5.
 * מקור מעבר 2022–2024: הנחיית רשות המסים למעסיקים מ-3.1.2024.
 * https://www.gov.il/BlobFolder/policy/inst-07-2025/he/IncomeTax_inst-07-2025.pdf
 * https://www.gov.il/BlobFolder/dynamiccollectorresultitem/employers-info-030124/he/IncomeTax_employers-info-030124.pdf
 * לא כולל זכויות נוספות של הורה יחיד/ילד להורה אחד, משמורת או העברת נקודות.
 */
export function calculateRefundChildPoints(
  year: TaxRefundYear,
  birthYear: number,
  parent: 'mother' | 'father',
): number {
  if (!Number.isInteger(birthYear)) throw new Error('יש להזין שנת לידה שלמה.');
  const age = Number(year) - birthYear;
  if (age < 0 || age > 18) throw new Error('שנת הלידה צריכה להתאים לגיל 0–18 בשנת המס.');
  if (age === 18) return parent === 'mother' ? 0.5 : 0;
  if (Number(year) >= 2024) {
    if (age === 0) return 2.5;
    if (age <= 2) return 4.5;
    if (age === 3) return 3.5;
    if (age <= 5) return 2.5;
    return parent === 'mother' ? 2 : 1;
  }
  if (age === 0) return 1.5;
  if (age <= 5) return 2.5;
  const temporaryExtra = Number(year) >= 2022 && age <= 12 ? 1 : 0;
  return (parent === 'mother' ? 1 : 0) + temporaryExtra;
}
