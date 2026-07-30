import { describe, it, expect } from 'vitest';
import {
  extractVat,
  addVat,
  roundAgorot,
  VAT_EXTRACT_RATE,
} from '@/lib/calculators/vat-extract';
import { VAT_2026 } from '@/lib/constants/tax-2026';

// ============================================================
// שיעור המע"מ — מקור אמת יחיד
// ============================================================

describe('VAT_EXTRACT_RATE', () => {
  it('שווה בדיוק לקבוע VAT_2026.standard (ללא שכפול מספר)', () => {
    expect(VAT_EXTRACT_RATE).toBe(VAT_2026.standard);
  });
});

// ============================================================
// extractVat — חילוץ מע"מ
// ============================================================

describe('extractVat', () => {
  it('מספרים עגולים: חילוץ מסכום כולל שבנוי מ-1000 נטו', () => {
    const gross = 1000 * (1 + VAT_EXTRACT_RATE); // 1180 בשיעור 18%
    const result = extractVat(gross);
    expect(result.base).toBeCloseTo(1000, 2);
    expect(result.vat).toBeCloseTo(gross - 1000, 2);
    expect(result.gross).toBeCloseTo(gross, 2);
    expect(result.rate).toBe(VAT_EXTRACT_RATE);
  });

  it('עיגול לאגורות: כל התוצאות עם 2 ספרות לכל היותר', () => {
    const result = extractVat(100);
    expect(result.base).toBe(roundAgorot(100 / (1 + VAT_EXTRACT_RATE)));
    expect(result.vat).toBe(roundAgorot(100 - result.base));
    // בדיוק 2 ספרות עשרוניות
    expect(result.base).toBe(Math.round(result.base * 100) / 100);
    expect(result.vat).toBe(Math.round(result.vat * 100) / 100);
  });

  it('שמירת סכום: base + vat === gross בדיוק (אחרי עיגול)', () => {
    for (const gross of [100, 99.99, 123.45, 1180, 0.01, 7703.13]) {
      const result = extractVat(gross);
      expect(roundAgorot(result.base + result.vat)).toBe(result.gross);
    }
  });

  it('אפס: חילוץ מ-0 מחזיר אפסים', () => {
    const result = extractVat(0);
    expect(result.base).toBe(0);
    expect(result.vat).toBe(0);
    expect(result.gross).toBe(0);
  });

  it('סכום שלילי מוגבל ל-0', () => {
    const result = extractVat(-500);
    expect(result.base).toBe(0);
    expect(result.vat).toBe(0);
  });

  it('שיעור 0% — הבסיס שווה לסכום, מע"מ אפס', () => {
    const result = extractVat(250, 0);
    expect(result.base).toBe(250);
    expect(result.vat).toBe(0);
  });
});

// ============================================================
// addVat — הוספת מע"מ
// ============================================================

describe('addVat', () => {
  it('מספרים עגולים: הוספה ל-1000 נטו', () => {
    const result = addVat(1000);
    expect(result.vat).toBeCloseTo(1000 * VAT_EXTRACT_RATE, 2);
    expect(result.gross).toBeCloseTo(1000 * (1 + VAT_EXTRACT_RATE), 2);
    expect(result.net).toBe(1000);
  });

  it('עיגול לאגורות: net + vat === gross בדיוק', () => {
    for (const net of [99.99, 33.33, 0.01, 123.456, 8474.58]) {
      const result = addVat(net);
      expect(result.vat).toBe(Math.round(result.vat * 100) / 100);
      expect(roundAgorot(result.net + result.vat)).toBe(result.gross);
    }
  });

  it('אפס: הוספה ל-0 מחזירה אפסים', () => {
    const result = addVat(0);
    expect(result.gross).toBe(0);
    expect(result.vat).toBe(0);
  });

  it('סכום שלילי מוגבל ל-0', () => {
    const result = addVat(-100);
    expect(result.gross).toBe(0);
    expect(result.vat).toBe(0);
  });
});

// ============================================================
// זהות הלוך-חזור: extractVat(addVat(x).gross).base ≈ x
// ============================================================

describe('זהות הלוך-חזור', () => {
  it('extractVat(addVat(x).gross).base === x בטולרנס עיגול (אגורה)', () => {
    for (const x of [1, 10, 100, 1000, 99.99, 123.45, 8474.58, 50000]) {
      const roundTrip = extractVat(addVat(x).gross);
      expect(Math.abs(roundTrip.base - roundAgorot(x))).toBeLessThanOrEqual(0.01);
    }
  });

  it('כיוון הפוך: addVat(extractVat(g).base).gross ≈ g בטולרנס אגורה', () => {
    for (const g of [118, 1180, 99.99, 4321.09]) {
      const roundTrip = addVat(extractVat(g).base);
      expect(Math.abs(roundTrip.gross - roundAgorot(g))).toBeLessThanOrEqual(0.01);
    }
  });
});
