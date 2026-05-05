/**
 * Cap Table & Funding Rounds Engine
 *
 * סימולציה של דילול בעלי מניות לאורך סבבי גיוס:
 * Founders → ESOP → Pre-Seed → Seed → Series A → Series B → ...
 *
 * לכל סבב:
 * 1. Pre-money valuation מגדיר את מחיר המניה
 * 2. ESOP pool יכול להיווצר לפני (Pre-money) או אחרי (Post-money) הסבב
 *    - Pre-money: המייסדים מדוללים יותר
 *    - Post-money: כל בעלי המניות מדוללים שווה
 * 3. השקעה / מחיר מניה = מספר מניות חדשות
 * 4. Post-money = Pre-money + Investment
 *
 * תרחישי יציאה:
 * - Liquidation Preferences (1x, 2x, 3x)
 * - Participating preferred (כפול-קבלה)
 * - Common shareholders מקבלים את היתרה proporcionally
 */

import type {
  Shareholder,
  FundingRound,
  CapTableSnapshot,
  CapTableState,
  ExitWaterfall,
  ShareClass,
} from './types';

// ============================================================
// CAP TABLE SIMULATION
// ============================================================

export function simulateCapTable(snapshot: CapTableSnapshot): CapTableState {
  const perRound: CapTableState['perRound'] = [];

  // Initial state
  let shareholders: Shareholder[] = snapshot.initialShareholders.map((s) => ({ ...s }));

  // Initial snapshot (before any round)
  const initialTotal = shareholders.reduce((s, sh) => s + sh.shares, 0);
  perRound.push({
    afterRound: 'Initial (Founders)',
    shareholders: shareholders.map((sh) => ({
      ...sh,
      ownershipPct: initialTotal > 0 ? (sh.shares / initialTotal) * 100 : 0,
    })),
    totalShares: initialTotal,
    postMoneyValuation: 0,
    pricePerShare: 0,
  });

  for (const round of snapshot.rounds) {
    const totalSharesBefore = shareholders.reduce((s, sh) => s + sh.shares, 0);

    // ESOP Pool (אם נדרש לפני סבב)
    if (round.esopPoolPct && round.esopPoolPct > 0) {
      const esopPct = round.esopPoolPct / 100;
      let newEsopShares: number;

      if (round.esopPrePostMoney === 'pre') {
        // Pre-money pool: המייסדים מדוללים. ESOP = X% מ-post-investment, אבל יוצא מ-pre-money pool.
        // newEsopShares / (totalSharesBefore + newEsopShares) = esopPct
        // → newEsopShares = (totalSharesBefore × esopPct) / (1 - esopPct)
        newEsopShares = (totalSharesBefore * esopPct) / (1 - esopPct);
      } else {
        // Post-money pool: כל בעלי המניות מדוללים שווה (כולל המשקיע החדש)
        // נחשב לאחר ההשקעה
        newEsopShares = 0; // נטפל אחרי ההשקעה
      }

      if (round.esopPrePostMoney === 'pre' && newEsopShares > 0) {
        const existingEsop = shareholders.find((s) => s.shareClass === 'esop');
        if (existingEsop) {
          existingEsop.shares += newEsopShares;
        } else {
          shareholders.push({
            id: `esop-${round.id}`,
            name: 'ESOP Pool',
            shareClass: 'esop',
            shares: newEsopShares,
          });
        }
      }
    }

    // השקעה
    const totalSharesAfterEsop = shareholders.reduce((s, sh) => s + sh.shares, 0);
    const pricePerShare = round.preMoneyValuation / totalSharesAfterEsop;
    const newInvestorShares = round.investmentAmount / pricePerShare;

    shareholders.push({
      id: `inv-${round.id}`,
      name: round.investorName,
      shareClass: round.shareClass,
      shares: newInvestorShares,
    });

    // Post-money ESOP pool
    if (round.esopPoolPct && round.esopPoolPct > 0 && round.esopPrePostMoney !== 'pre') {
      const totalAfterInvestment = shareholders.reduce((s, sh) => s + sh.shares, 0);
      const esopPct = round.esopPoolPct / 100;
      const newEsopShares = (totalAfterInvestment * esopPct) / (1 - esopPct);
      const existingEsop = shareholders.find((s) => s.shareClass === 'esop');
      if (existingEsop) {
        existingEsop.shares += newEsopShares;
      } else {
        shareholders.push({
          id: `esop-${round.id}`,
          name: 'ESOP Pool',
          shareClass: 'esop',
          shares: newEsopShares,
        });
      }
    }

    // Snapshot
    const totalShares = shareholders.reduce((s, sh) => s + sh.shares, 0);
    const postMoneyValuation = round.preMoneyValuation + round.investmentAmount;

    perRound.push({
      afterRound: round.name,
      shareholders: shareholders.map((sh) => ({
        ...sh,
        ownershipPct: (sh.shares / totalShares) * 100,
      })),
      totalShares,
      postMoneyValuation,
      pricePerShare,
    });
  }

  return { perRound };
}

// ============================================================
// EXIT WATERFALL
// ============================================================

/**
 * חישוב חלוקה ביציאה לפי liquidation preferences.
 * סדר:
 * 1. Preferred shareholders מקבלים את ה-LP שלהם (latest series first)
 * 2. אם participating: גם משתתפים בשארית pro-rata
 * 3. אחרת: בוחרים בין LP או pro-rata (כפי שיותר רווחי)
 * 4. Common מקבלים את השארית
 */
export function calculateExitWaterfall(
  snapshot: CapTableSnapshot,
  exitValue: number,
): ExitWaterfall {
  const state = simulateCapTable(snapshot);
  const finalState = state.perRound[state.perRound.length - 1];
  const shareholders = finalState.shareholders;
  const totalShares = finalState.totalShares;

  const payouts: ExitWaterfall['payouts'] = [];
  let remainingValue = exitValue;

  // Build round info for each shareholder
  const roundsByClass = new Map<ShareClass, FundingRound>();
  for (const round of snapshot.rounds) {
    roundsByClass.set(round.shareClass, round);
  }

  // Sort: latest preferred first, common last
  const orderedClasses: ShareClass[] = [
    'preferred_c',
    'preferred_b',
    'preferred_a',
    'preferred_seed',
    'common',
    'esop',
  ];

  // STEP 1: Liquidation preferences (preferred only, latest first)
  for (const cls of orderedClasses) {
    if (cls === 'common' || cls === 'esop') continue;
    const round = roundsByClass.get(cls);
    if (!round || !round.liquidationPreference) continue;

    const lpShareholders = shareholders.filter((s) => s.shareClass === cls);
    for (const sh of lpShareholders) {
      const lpAmount = round.investmentAmount * round.liquidationPreference;
      const actual = Math.min(lpAmount, remainingValue);
      payouts.push({
        shareholderId: sh.id,
        shareholderName: sh.name,
        preferenceAmount: actual,
        proRataAmount: 0,
        totalAmount: actual,
        sharePct: 0,
      });
      remainingValue -= actual;
    }
  }

  // STEP 2: Pro-rata distribution of remaining
  if (remainingValue > 0) {
    // Determine who participates in pro-rata
    const participants = shareholders.filter((sh) => {
      if (sh.shareClass === 'common' || sh.shareClass === 'esop') return true;
      const round = roundsByClass.get(sh.shareClass);
      return round?.participating === true;
    });
    const totalParticipantShares = participants.reduce((s, sh) => s + sh.shares, 0);

    for (const sh of participants) {
      const proRata = totalParticipantShares > 0
        ? remainingValue * (sh.shares / totalParticipantShares)
        : 0;

      // הוסף ל-payout קיים או צור חדש
      const existing = payouts.find((p) => p.shareholderId === sh.id);
      if (existing) {
        existing.proRataAmount = proRata;
        existing.totalAmount += proRata;
      } else {
        payouts.push({
          shareholderId: sh.id,
          shareholderName: sh.name,
          preferenceAmount: 0,
          proRataAmount: proRata,
          totalAmount: proRata,
          sharePct: 0,
        });
      }
    }
  }

  // Compute share percentages
  for (const p of payouts) {
    p.sharePct = exitValue > 0 ? (p.totalAmount / exitValue) * 100 : 0;
  }

  return { exitValue, payouts };
}

/**
 * Helper: יוצר Cap Table דוגמה מהירה.
 */
export function createSampleCapTable(): CapTableSnapshot {
  return {
    initialShareholders: [
      { id: 'f1', name: 'מייסד 1', shareClass: 'common', shares: 4500000, isFounder: true },
      { id: 'f2', name: 'מייסד 2', shareClass: 'common', shares: 4500000, isFounder: true },
      { id: 'f3', name: 'מייסד 3', shareClass: 'common', shares: 1000000, isFounder: true },
    ],
    rounds: [
      {
        id: 'preseed',
        name: 'Pre-Seed',
        shareClass: 'preferred_seed',
        preMoneyValuation: 4000000,
        investmentAmount: 1000000,
        investorName: 'Angel Investors',
        esopPoolPct: 10,
        esopPrePostMoney: 'pre',
        liquidationPreference: 1,
        participating: false,
      },
      {
        id: 'seed',
        name: 'Seed',
        shareClass: 'preferred_a',
        preMoneyValuation: 12000000,
        investmentAmount: 3000000,
        investorName: 'Seed VC',
        esopPoolPct: 5,
        esopPrePostMoney: 'pre',
        liquidationPreference: 1,
        participating: false,
      },
    ],
  };
}
