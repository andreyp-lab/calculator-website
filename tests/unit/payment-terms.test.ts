import { describe, it, expect } from 'vitest';
import {
  calculatePaymentSchedule,
  validatePaymentTerms,
  describePaymentTerms,
  calculateWeightedAverageDays,
  COMMON_PAYMENT_TERMS,
} from '@/lib/tools/payment-terms';

describe('payment-terms engine', () => {
  describe('calculatePaymentSchedule', () => {
    it('handles simple net terms', () => {
      const schedule = calculatePaymentSchedule(10000, { simpleNet: 30 }, 0);
      expect(schedule).toHaveLength(1);
      expect(schedule[0].monthOffset).toBe(1);
      expect(schedule[0].amount).toBe(10000);
    });

    it('handles immediate payment', () => {
      const schedule = calculatePaymentSchedule(5000, { simpleNet: 0 }, 3);
      expect(schedule).toHaveLength(1);
      expect(schedule[0].monthOffset).toBe(3);
      expect(schedule[0].amount).toBe(5000);
    });

    it('splits payment across installments', () => {
      const terms = {
        simpleNet: 60,
        installments: [
          { percentage: 30, daysOffset: 0, label: 'מקדמה' },
          { percentage: 70, daysOffset: 60, label: 'יתרה' },
        ],
      };
      const schedule = calculatePaymentSchedule(100000, terms, 0);
      expect(schedule).toHaveLength(2);
      expect(schedule[0].amount).toBe(30000);
      expect(schedule[0].monthOffset).toBe(0);
      expect(schedule[1].amount).toBe(70000);
      expect(schedule[1].monthOffset).toBe(2);
    });

    it('handles 3-installment split (30/30/40 over 90 days)', () => {
      const terms = COMMON_PAYMENT_TERMS['staged-90'];
      const schedule = calculatePaymentSchedule(100000, terms, 0);
      expect(schedule).toHaveLength(3);
      expect(schedule[0].amount).toBe(30000);
      expect(schedule[1].amount).toBe(30000);
      expect(schedule[2].amount).toBe(40000);
    });

    it('normalizes if percentages do not sum to 100', () => {
      const terms = {
        simpleNet: 30,
        installments: [
          { percentage: 50, daysOffset: 0 },
          { percentage: 60, daysOffset: 30 }, // 110% total
        ],
      };
      const schedule = calculatePaymentSchedule(110000, terms, 0);
      const total = schedule.reduce((s, p) => s + p.amount, 0);
      expect(total).toBeCloseTo(110000, 1);
    });
  });

  describe('validatePaymentTerms', () => {
    it('validates simple net terms', () => {
      expect(validatePaymentTerms({ simpleNet: 30 }).valid).toBe(true);
      expect(validatePaymentTerms({ simpleNet: -1 }).valid).toBe(false);
      expect(validatePaymentTerms({ simpleNet: 400 }).valid).toBe(false);
    });

    it('rejects splits that do not sum to 100', () => {
      const result = validatePaymentTerms({
        simpleNet: 30,
        installments: [
          { percentage: 30, daysOffset: 0 },
          { percentage: 50, daysOffset: 30 }, // 80%
        ],
      });
      expect(result.valid).toBe(false);
    });

    it('accepts valid splits', () => {
      const result = validatePaymentTerms({
        simpleNet: 30,
        installments: [
          { percentage: 30, daysOffset: 0 },
          { percentage: 70, daysOffset: 30 },
        ],
      });
      expect(result.valid).toBe(true);
    });
  });

  describe('describePaymentTerms', () => {
    it('describes immediate', () => {
      expect(describePaymentTerms({ simpleNet: 0 })).toBe('מיידי');
    });
    it('describes simple net', () => {
      expect(describePaymentTerms({ simpleNet: 30 })).toBe('נטו 30');
    });
    it('describes splits', () => {
      const desc = describePaymentTerms({
        simpleNet: 30,
        installments: [
          { percentage: 30, daysOffset: 0 },
          { percentage: 70, daysOffset: 30 },
        ],
      });
      expect(desc).toContain('30%');
      expect(desc).toContain('70%');
    });
  });

  describe('calculateWeightedAverageDays', () => {
    it('returns simple net for non-split', () => {
      expect(calculateWeightedAverageDays({ simpleNet: 45 })).toBe(45);
    });
    it('computes weighted avg for splits', () => {
      // 30% נטו 0 + 70% נטו 60 = 0.3*0 + 0.7*60 = 42
      const avg = calculateWeightedAverageDays({
        simpleNet: 30,
        installments: [
          { percentage: 30, daysOffset: 0 },
          { percentage: 70, daysOffset: 60 },
        ],
      });
      expect(avg).toBeCloseTo(42, 1);
    });
  });
});
