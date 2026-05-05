import { describe, it, expect } from 'vitest';
import {
  simulateCapTable,
  calculateExitWaterfall,
  createSampleCapTable,
} from '@/lib/tools/cap-table-engine';
import type { CapTableSnapshot } from '@/lib/tools/types';

describe('cap-table-engine', () => {
  describe('simulateCapTable', () => {
    it('builds initial snapshot with 100% ownership', () => {
      const snapshot: CapTableSnapshot = {
        initialShareholders: [
          { id: 'a', name: 'A', shareClass: 'common', shares: 5000000, isFounder: true },
          { id: 'b', name: 'B', shareClass: 'common', shares: 5000000, isFounder: true },
        ],
        rounds: [],
      };
      const state = simulateCapTable(snapshot);
      expect(state.perRound).toHaveLength(1);
      expect(state.perRound[0].shareholders[0].ownershipPct).toBe(50);
      expect(state.perRound[0].shareholders[1].ownershipPct).toBe(50);
    });

    it('dilutes founders after seed round', () => {
      const snapshot: CapTableSnapshot = {
        initialShareholders: [
          { id: 'a', name: 'Founder', shareClass: 'common', shares: 10000000, isFounder: true },
        ],
        rounds: [
          {
            id: 'r1',
            name: 'Seed',
            shareClass: 'preferred_seed',
            preMoneyValuation: 5000000,
            investmentAmount: 1000000,
            investorName: 'VC',
          },
        ],
      };
      const state = simulateCapTable(snapshot);
      const afterSeed = state.perRound[1];
      // Pre-money 5M / 10M shares = 0.5 / share
      // 1M investment / 0.5 = 2M new shares
      // Total 12M shares; founder 10/12 = 83.33%
      const founder = afterSeed.shareholders.find((s) => s.name === 'Founder');
      expect(founder?.ownershipPct).toBeCloseTo(83.33, 1);
    });

    it('handles ESOP pool dilution (pre-money)', () => {
      const snapshot: CapTableSnapshot = {
        initialShareholders: [
          { id: 'a', name: 'Founder', shareClass: 'common', shares: 10000000, isFounder: true },
        ],
        rounds: [
          {
            id: 'r1',
            name: 'Seed',
            shareClass: 'preferred_seed',
            preMoneyValuation: 5000000,
            investmentAmount: 1000000,
            investorName: 'VC',
            esopPoolPct: 10,
            esopPrePostMoney: 'pre',
          },
        ],
      };
      const state = simulateCapTable(snapshot);
      const afterSeed = state.perRound[1];
      const esop = afterSeed.shareholders.find((s) => s.shareClass === 'esop');
      expect(esop).toBeDefined();
    });

    it('sample cap table runs without error', () => {
      const sample = createSampleCapTable();
      const state = simulateCapTable(sample);
      expect(state.perRound.length).toBe(sample.rounds.length + 1);
    });
  });

  describe('calculateExitWaterfall', () => {
    it('distributes proportionally with no preferences', () => {
      const snapshot: CapTableSnapshot = {
        initialShareholders: [
          { id: 'a', name: 'A', shareClass: 'common', shares: 5000000 },
          { id: 'b', name: 'B', shareClass: 'common', shares: 5000000 },
        ],
        rounds: [],
      };
      const wf = calculateExitWaterfall(snapshot, 10000000);
      // Both should get 50% = 5M each
      const a = wf.payouts.find((p) => p.shareholderName === 'A');
      const b = wf.payouts.find((p) => p.shareholderName === 'B');
      expect(a?.totalAmount).toBeCloseTo(5000000, 0);
      expect(b?.totalAmount).toBeCloseTo(5000000, 0);
    });

    it('preferred gets liquidation preference first', () => {
      const snapshot: CapTableSnapshot = {
        initialShareholders: [
          { id: 'f', name: 'Founder', shareClass: 'common', shares: 9000000 },
        ],
        rounds: [
          {
            id: 'r1',
            name: 'Seed',
            shareClass: 'preferred_seed',
            preMoneyValuation: 9000000,
            investmentAmount: 1000000,
            investorName: 'VC',
            liquidationPreference: 1,
            participating: false,
          },
        ],
      };
      // Exit at 5M - VC takes their 1M back first
      const wf = calculateExitWaterfall(snapshot, 5000000);
      const vc = wf.payouts.find((p) => p.shareholderName === 'VC');
      expect(vc?.preferenceAmount).toBeCloseTo(1000000, 0);
    });

    it('total payout sums to exit value', () => {
      const sample = createSampleCapTable();
      const wf = calculateExitWaterfall(sample, 50000000);
      const total = wf.payouts.reduce((s, p) => s + p.totalAmount, 0);
      expect(total).toBeCloseTo(50000000, -2); // ±100
    });
  });
});
