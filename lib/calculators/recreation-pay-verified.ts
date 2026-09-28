/** Base private-sector convalescence-pay illustration. Collective agreements can override it. */
export const PRIVATE_DAY_RATE = 418;

export function privateDaysForCompletedYears(years: number): number {
  if (!Number.isFinite(years) || years < 1) return 0;
  if (years < 2) return 5;
  if (years < 4) return 6;
  if (years < 11) return 7;
  if (years < 16) return 8;
  if (years < 20) return 9;
  return 10;
}

export function calculatePrivateRecreationEstimate(years: number, positionPercent: number, dayRate = PRIVATE_DAY_RATE) {
  const daysEntitled = privateDaysForCompletedYears(years);
  const percent = Math.min(100, Math.max(0, Number.isFinite(positionPercent) ? positionPercent : 0));
  const rate = Math.max(0, Number.isFinite(dayRate) ? dayRate : 0);
  return { daysEntitled, dayRate: rate, grossEstimate: Math.round(daysEntitled * rate * percent / 100 * 100) / 100 };
}
